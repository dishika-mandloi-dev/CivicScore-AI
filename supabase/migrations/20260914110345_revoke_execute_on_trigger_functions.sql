/*
# Revoke EXECUTE on trigger functions from anon and authenticated

1. Problem
   The three SECURITY DEFINER trigger functions (handle_new_user_profile,
   set_complaint_ward, set_survey_ward) are callable via the PostgREST API
   by any anon or authenticated user. While calling them directly has no
   useful effect (they're designed to run as triggers), this is an
   unnecessary attack surface.

2. Fix
   Revoke EXECUTE on all three functions from PUBLIC, anon, and authenticated.
   Triggers fire with the function owner's privileges regardless of EXECUTE
   grants, so revoking EXECUTE does not affect trigger behavior.

3. Security impact
   Closes the RPC attack surface on trigger functions. Trigger behavior
   is unchanged.
*/

REVOKE EXECUTE ON FUNCTION public.handle_new_user_profile() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_complaint_ward() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_survey_ward() FROM PUBLIC, anon, authenticated;
