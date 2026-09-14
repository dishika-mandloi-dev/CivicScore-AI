/*
# Fix ward assignment trigger: int4 overflow on abs()

1. Problem
   The `handle_new_user_profile` trigger uses `abs(hashtext(md5(...)))` to
   compute a ward number 1..30. `hashtext` returns int4, and `abs()` of
   int4's minimum value (-2147483648) overflows back to the same negative
   value, which would produce a negative ward_id and violate the NOT NULL
   / implicit constraint.

2. Fix
   Use `mod(hashtext(...) + 2147483648, 30) + 1` instead of
   `mod(abs(hashtext(...)), 30) + 1`. Adding 2147483648 shifts the range
   from [-2147483648, 2147483647] to [0, 4294967295] (unsigned), which
   `mod(_, 30)` safely maps to [0, 29], then +1 gives [1, 30].

3. Security impact
   None — this only fixes a rare runtime error that would prevent profile
   creation for certain user IDs.
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
BEGIN
  v_name := COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1));
  v_ward := mod(hashtext(md5(new.id::text)) + 2147483648, 30) + 1;

  INSERT INTO public.profiles (id, email, full_name, ward_id)
  VALUES (new.id, new.email, v_name, v_ward)
  ON CONFLICT (id) DO NOTHING;

  RETURN new;
END;
$$;
