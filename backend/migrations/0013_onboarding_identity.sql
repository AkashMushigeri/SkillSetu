-- 0013_onboarding_identity.sql
-- Two gaps that the frontend migration proved, both on `users` rather than on a
-- new table.
--
-- 1. users.title
--    The onboarding form collects a role-specific designation: "HR Lead" for a
--    recruiter, "Placement Officer" for a college officer. Both were written to
--    the Firestore user blob and read back through `userProfile.recruiterTitle`
--    and `userProfile.designation`. There was nowhere relational to put it:
--    `companies` describes the company, not the person, and putting a job title
--    on a company row would make two recruiters at the same employer disagree.
--    One nullable text column is the minimum representation.
--
-- 2. Nothing here: a student's college affiliation is already expressible.
--    `users.college_id` (migration 0002) is the Student -> College edge the
--    relational model calls for. It was previously only ever set for college
--    officers, because students had no way to claim one. Reusing the column
--    rather than adding `student_profiles.college_id` keeps a single edge for
--    "the institution this user belongs to", which is what the college portal's
--    student roster needs in order to scope its queries.
--
--    `requireOrganization('college')` in backend/src/middleware/auth.ts still
--    requires role = 'college' before it looks at college_id, so a student who
--    names their college gains nothing from having the column populated.

ALTER TABLE users ADD COLUMN IF NOT EXISTS title text;

COMMENT ON COLUMN users.title IS
  'Role-specific designation of the person (recruiter title, college officer designation). Null when not supplied.';
