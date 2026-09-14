/*
# Use user-selected ward_id from signup metadata instead of deterministic hash

1. Change
   The trigger `handle_new_user_profile` now reads `ward_id` from the new
   user's `raw_user_meta_data` (set by the signup form) instead of computing
   a deterministic hash. The user picks their ward during account creation.

2. Validation
   The trigger validates that the provided ward_id is an integer between
   1 and 30 (matching the existing WARDS data). If the metadata is missing
   or invalid, it falls back to ward 1 so the profile is never left
   without a ward.

3. Security impact
   The ward_id is still written server-side by the SECURITY DEFINER
   trigger — the user cannot change it after signup because column-level
   UPDATE on ward_id is revoked. The INSERT policy on complaints/surveys
   still enforces ward_id matches the profile's stored value.
*/

CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_ward integer;
  v_name text;
  v_meta_ward text;
BEGIN
  v_name := COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1));

  -- Read the ward the user selected during signup
  v_meta_ward := new.raw_user_meta_data->>'ward_id';

  -- Validate: must be a positive integer in the range of existing wards (1..30)
  IF v_meta_ward ~ '^[0-9]+$' THEN
    v_ward := v_meta_ward::integer;
    IF v_ward < 1 OR v_ward > 30 THEN
      v_ward := 1;
    END IF;
  ELSE
    v_ward := 1;
  END IF;

  INSERT INTO public.profiles (id, email, full_name, ward_id)
  VALUES (new.id, new.email, v_name, v_ward)
  ON CONFLICT (id) DO NOTHING;

  RETURN new;
END;
$$;
