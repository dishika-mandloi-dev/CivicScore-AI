/*
# Fix column-level UPDATE privileges for profiles and user_complaints

1. Problem
   The previous attempt to REVOKE UPDATE on specific columns (ward_id, status)
   did not work because PostgreSQL table-level grants override column-level
   revokes when the table-level grant is broader. The `authenticated` role
   still has UPDATE on all columns including ward_id (profiles) and
   status/ward_id (user_complaints).

2. Fix
   - Revoke the table-level UPDATE from `authenticated` and `anon` on both
     `profiles` and `user_complaints`.
   - Re-grant UPDATE only on the columns users should be able to modify:
     - profiles: email, full_name
     - user_complaints: title, description, category
   - For user_surveys, revoke UPDATE entirely from both roles — users should
     not be able to edit submitted surveys (no update policy exists, but
     removing the grant is defense-in-depth).

3. Security impact
   - Users can no longer change their ward_id via any API call.
   - Users can no longer change complaint status or ward_id.
   - Users cannot modify submitted surveys at all.
   - Trigger functions still work (they run as SECURITY DEFINER with the
     owner's privileges, not the caller's).
*/

-- profiles: restrict UPDATE to email and full_name only
REVOKE UPDATE ON profiles FROM anon, authenticated;
GRANT UPDATE (email, full_name) ON profiles TO authenticated;

-- user_complaints: restrict UPDATE to title, description, category
REVOKE UPDATE ON user_complaints FROM anon, authenticated;
GRANT UPDATE (title, description, category) ON user_complaints TO authenticated;

-- user_surveys: no UPDATE at all for frontend roles
REVOKE UPDATE ON user_surveys FROM anon, authenticated;
