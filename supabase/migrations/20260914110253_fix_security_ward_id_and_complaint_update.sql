/*
# Security fix: restrict profiles ward_id and user_complaints updates

1. Problem
   - The `update_own_profile` policy on `profiles` only checks `auth.uid() = id`
     in WITH CHECK but does NOT prevent the user from changing their `ward_id`.
     A user could UPDATE their own profile row and set ward_id to any ward,
     bypassing the server-side assignment.
   - The `update_own_complaints` policy on `user_complaints` allows users to
     change any column on their own complaints, including `status` and `ward_id`.
     Users should not be able to change complaint status (admin-managed) or
     re-assign a complaint to a different ward.

2. Changes
   - Revoke UPDATE on `profiles.ward_id` column from the `authenticated` role
     so only the service role / superuser can change ward assignment.
   - Revoke UPDATE on `user_complaints.status` and `user_complaints.ward_id`
     columns from the `authenticated` role so users can only edit the
     title/description/category of their own complaints.
   - The existing RLS policies remain: users can still UPDATE their own rows
     (for profile name/email and complaint title/description), but the column
     privileges prevent them from touching ward_id or status.

3. Security impact
   - Users can no longer change their ward assignment from the frontend.
   - Users can no longer change complaint status or ward_id.
   - All other functionality (profile name/email update, complaint editing)
     remains available.
*/

-- Prevent authenticated users from updating their ward_id
REVOKE UPDATE (ward_id) ON profiles FROM authenticated;

-- Prevent authenticated users from updating complaint status and ward_id
REVOKE UPDATE (status, ward_id) ON user_complaints FROM authenticated;
