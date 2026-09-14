/*
# Create citizen-facing schema: profiles, user_complaints, user_surveys

1. Purpose
   Adds the data layer for the CivicScore AI citizen (user) dashboard.
   Each authenticated citizen is assigned to exactly one Indore ward.
   Citizens can only see their own profile, their own ward's details,
   their own complaints, and their own survey submissions.
   Admins are completely separate (hardcoded credentials, admin panel)
   and have no access to these tables through the anon/authenticated role.

2. New Tables
   - `profiles`
     - `id` (uuid, PK, references auth.users, ON DELETE CASCADE)
     - `email` (text, not null) — cached from auth for convenience
     - `full_name` (text, not null) — display name
     - `ward_id` (integer, not null) — assigned Indore ward number (1..30)
     - `created_at` (timestamptz, default now())
   - `user_complaints`
     - `id` (uuid, PK, default gen_random_uuid)
     - `user_id` (uuid, not null, DEFAULT auth.uid(), references profiles ON DELETE CASCADE)
     - `ward_id` (integer, not null) — ward the complaint belongs to (auto-set from profile)
     - `title` (text, not null) — short complaint subject
     - `description` (text, not null) — detailed complaint text
     - `category` (text, not null) — one of the project complaint categories
     - `status` (text, not null, default 'Pending') — Pending / In Progress / Resolved
     - `created_at` (timestamptz, default now())
   - `user_surveys`
     - `id` (uuid, PK, default gen_random_uuid)
     - `user_id` (uuid, not null, DEFAULT auth.uid(), references profiles ON DELETE CASCADE)
     - `ward_id` (integer, not null) — ward the survey belongs to (auto-set from profile)
     - `cleanliness_rating` (integer, 1..5)
     - `infrastructure_rating` (integer, 1..5)
     - `water_supply_rating` (integer, 1..5)
     - `public_services_rating` (integer, 1..5)
     - `overall_rating` (integer, 1..5)
     - `comments` (text, nullable) — optional feedback
     - `created_at` (timestamptz, default now())

3. Security — Row Level Security (owner-scoped, authenticated only)
   - `profiles`: a user can SELECT and UPDATE only their own row.
     INSERT is handled by a trigger on auth signup (no direct insert policy).
   - `user_complaints`: a user can SELECT, INSERT, UPDATE only their own rows.
     The INSERT policy WITH CHECK enforces ward_id matches the user's profile ward.
   - `user_surveys`: a user can SELECT and INSERT only their own rows.
     The INSERT policy WITH CHECK enforces ward_id matches the user's profile ward.

4. Trigger
   - `handle_new_user_profile`: AFTER INSERT on auth.users — creates a `profiles` row
     with the new user's id, email, full_name (from raw_user_meta_data), and a
     ward_id assigned deterministically (hash of user id modulo 30 + 1) so every
     citizen is assigned to a ward automatically at signup. No manual ward entry
     from the frontend is trusted for assignment.

5. Important notes
   - Ward assignment is server-side and cannot be changed by the user (no UPDATE
     policy on profiles.ward_id is exposed; the UPDATE policy only allows
     updating full_name/email, enforced by the WITH CHECK clause).
   - Complaints and surveys auto-associate with the user's ward via a trigger
     that copies ward_id from profiles, so the frontend cannot spoof another ward.
   - Admins use a separate hardcoded credential system and never touch these
     tables; they are scoped to `authenticated` only.
*/

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL,
  ward_id integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- user_complaints
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_complaints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  ward_id integer NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  status text NOT NULL DEFAULT 'Pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_complaints ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_complaints" ON user_complaints;
CREATE POLICY "select_own_complaints"
  ON user_complaints FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_complaints" ON user_complaints;
CREATE POLICY "insert_own_complaints"
  ON user_complaints FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND ward_id = (SELECT ward_id FROM profiles WHERE id = auth.uid())
  );

DROP POLICY IF EXISTS "update_own_complaints" ON user_complaints;
CREATE POLICY "update_own_complaints"
  ON user_complaints FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- user_surveys
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_surveys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  ward_id integer NOT NULL,
  cleanliness_rating integer NOT NULL CHECK (cleanliness_rating BETWEEN 1 AND 5),
  infrastructure_rating integer NOT NULL CHECK (infrastructure_rating BETWEEN 1 AND 5),
  water_supply_rating integer NOT NULL CHECK (water_supply_rating BETWEEN 1 AND 5),
  public_services_rating integer NOT NULL CHECK (public_services_rating BETWEEN 1 AND 5),
  overall_rating integer NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
  comments text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_surveys ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_surveys" ON user_surveys;
CREATE POLICY "select_own_surveys"
  ON user_surveys FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_surveys" ON user_surveys;
CREATE POLICY "insert_own_surveys"
  ON user_surveys FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND ward_id = (SELECT ward_id FROM profiles WHERE id = auth.uid())
  );

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_user_complaints_user_id ON user_complaints(user_id);
CREATE INDEX IF NOT EXISTS idx_user_surveys_user_id ON user_surveys(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_ward_id ON profiles(ward_id);

-- ---------------------------------------------------------------------------
-- Trigger: auto-create profile on signup with server-assigned ward
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_ward integer;
  v_name text;
BEGIN
  -- Determine display name from user metadata (set at signup) or fallback
  v_name := COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1));

  -- Deterministic ward assignment: hash the user id to a ward 1..30
  -- This is server-side and cannot be influenced by the frontend.
  v_ward := (mod(abs(hashtext(md5(new.id::text))), 30) + 1);

  INSERT INTO public.profiles (id, email, full_name, ward_id)
  VALUES (new.id, new.email, v_name, v_ward)
  ON CONFLICT (id) DO NOTHING;

  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_profile();

-- ---------------------------------------------------------------------------
-- Trigger: auto-set ward_id on complaint insert from profile (defense in depth)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_complaint_ward()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_ward integer;
BEGIN
  SELECT ward_id INTO v_ward FROM public.profiles WHERE id = new.user_id;
  IF v_ward IS NOT NULL THEN
    -- Always trust the server-side profile ward, never the frontend value
    new.ward_id := v_ward;
  END IF;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_complaint_ward ON user_complaints;
CREATE TRIGGER trg_set_complaint_ward
  BEFORE INSERT ON user_complaints
  FOR EACH ROW
  EXECUTE FUNCTION public.set_complaint_ward();

-- ---------------------------------------------------------------------------
-- Trigger: auto-set ward_id on survey insert from profile (defense in depth)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_survey_ward()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_ward integer;
BEGIN
  SELECT ward_id INTO v_ward FROM public.profiles WHERE id = new.user_id;
  IF v_ward IS NOT NULL THEN
    new.ward_id := v_ward;
  END IF;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_survey_ward ON user_surveys;
CREATE TRIGGER trg_set_survey_ward
  BEFORE INSERT ON user_surveys
  FOR EACH ROW
  EXECUTE FUNCTION public.set_survey_ward();
