# Feature-to-Storage Mapping

## Status: Final Audit — Migration `deploy` branch

This document maps every user-facing feature and backend route to its current storage backend. It is the authoritative record for what has been migrated off Firebase Data Connect / Firestore / localStorage and what, if anything, still depends on legacy persistence.

---

## Storage Backends in Use

| Backend | Purpose | Auth |
|---------|---------|------|
| Firebase Auth | Identity only (`signInWithGoogle`, `signInWithEmail`, `signUpWithEmail`) | Token minted by Firebase |
| Neon PostgreSQL (`dev` branch) | All application data: profiles, skills, opportunities, applications, notifications, interviews, offers, learning, college, hiring, role requests | `users.firebase_uid` + `users.role` authoritative |
| `localStorage` | Theme preference (`skillsetu_theme`) only | None — cosmetic UI state |
| In-memory React state | Transient UI filters, selected city, search radius, form inputs | Per-tab, non-persistent |

**Not used for application data:**
- Firestore — no application writes; `firestore.rules` remains but is inert.
- Data Connect — connector and generated SDK remain in tree; no runtime writes.
- `sessionStorage` — not used anywhere.

---

## Frontend Feature Map

### Auth & Identity

| Feature | File | Current Storage | Legacy Storage Removed |
|---------|------|-----------------|------------------------|
| Sign-in / sign-up / sign-out | `src/context/AuthContext.tsx` | Firebase Auth token only | `skillsetu_user_role` localStorage entry |
| Role resolution | `src/lib/session.ts` → `/api/auth/me` | PostgreSQL `users.role` | Firestore `users/{uid}.role`, localStorage `skillsetu_user_role` |
| Routing / portal guards | `src/components/auth/OnboardingGuard.tsx` | `identity.role` from API | localStorage / Firestore role copy |
| Account fields | `PATCH /api/auth/me` | PostgreSQL `users` row | None — new endpoint |

**What still touches Firebase beyond Auth:**
- `src/lib/firebase.ts` still imports `firebase/firestore` and `firebase/data-connect` and exports `db` and `dataConnect`.
- No migrated context writes to either export. The imports exist for emulator support and legacy code paths that are now disabled or unreferenced.

### Student Portal

| Feature | Context / Component | Current Storage | Legacy Storage Removed |
|---------|---------------------|-----------------|------------------------|
| Profile hydration | `StudentContext.tsx` → `studentProfileApi.get()` | PostgreSQL `student_profiles` + `users` | Firestore `users/{uid}`, `skillsetu_<uid>_profile` localStorage |
| Skills | `skillsApi.mine()` | PostgreSQL `user_skills` | Data Connect `UpsertUserSkill`, `skillsetu_<uid>_skills` localStorage |
| Projects / certifications / education | `studentProfileApi` CRUD | PostgreSQL `projects`, `certifications`, `education` | `skillsetu_<uid>_projects`, `_certifications` localStorage |
| Applications | `applicationsApi.list/create` | PostgreSQL `applications` + `application_stage_history` | Data Connect `createApplication` / `updateApplicationStage`, `skillsetu_<uid>_applications` localStorage |
| Saved / bookmarked opportunities | `savedApi.save/unsave/list` | PostgreSQL `saved_jobs` / `saved_internships` | `skillsetu_<uid>_saved_opps` localStorage |
| Notifications | `notificationsApi.list/markAllRead` | PostgreSQL `notifications` | `skillsetu_sync:notifications` localStorage sync bus |
| Cross-tab stage updates | 60 s poll in `StudentContext` | `application_stage_history` rows | `subscribeToSync` localStorage event bus |
| Opportunity list | `serverOpportunities` + `syncedOpportunities` | PostgreSQL `jobs` / `internships` | Data Connect `listJobs` / `listInternships`, `readStudentOpportunitiesFromIndustry()` sync-bus read |
| Demo bypass / reset | `resetToDemo` | Clears local filters only; server data untouched | `INITIAL_STUDENT_PROFILE` hardcoded arrays, `localStorage` clearing + repopulation |
| Theme | `ThemeContext.tsx` | `localStorage` (`skillsetu_theme`) | None — intentional UI-only persistence |

### Industry Portal

| Feature | Context / Component | Current Storage | Legacy Storage Removed |
|---------|---------------------|-----------------|------------------------|
| Jobs / internships CRUD | `IndustryContext.tsx` → `opportunities` API | PostgreSQL `jobs` / `internships` | Data Connect `createJob` / `createInternship` / `listJobs` / `listInternships` |
| Applications review | `industryApplications` | PostgreSQL `applications` | localStorage `skillsetu_<uid>_applications` |
| Interviews | `interviews` API | PostgreSQL `interviews` | `skillsetu_ind_interviews` localStorage |
| Offers | `offers` API | PostgreSQL `offers` | `skillsetu_ind_offers` localStorage |
| Hiring preferences | `hiring` API | PostgreSQL `hiring_preferences` | In-memory only — never persisted |
| Talent pool | `hiring` API | PostgreSQL `talent_pool` | `savedToTalentPool` boolean on localStorage array |
| Challenges / submissions | `challenges` API | PostgreSQL `challenges` / `challenge_submissions` | `skillsetu_ind_challenges` / `_submissions` localStorage |
| Company profile | `companyProfile` API | PostgreSQL `companies` | Data Connect `upsertCompany` |
| Notifications | `notifications` API | PostgreSQL `notifications` | `syncBridge` localStorage bus |
| MoUs / partnerships | Read via `organizations` API | PostgreSQL `college_company` | `skillsetu_ind_mous` localStorage array |

### College Portal

| Feature | Context / Component | Current Storage | Legacy Storage Removed |
|---------|---------------------|-----------------|------------------------|
| College profile | `CollegeContext.tsx` → `domainApi` | PostgreSQL `colleges` + `users.college_id` | `skillsetu_college_profile` localStorage |
| Student roster | `domainApi.college.students` | PostgreSQL `users` where `college_id = req.user.college_id` | `MOCK_STUDENTS` hardcoded array |
| Training programs | `domainApi.college.trainingPrograms` | PostgreSQL `training_programs` | `INITIAL_TRAINING_PROGRAMS` mock array |
| Enrollments | `domainApi.college.enrollments` | PostgreSQL `training_enrollments` | None — new server-backed feature |
| Campus announcements | `domainApi.college.announcements` | PostgreSQL `campus_announcements` | `addAnnouncement` minted `anc-${Date.now()}` local ID |
| Placement drives | `domainApi.college.placementDrives` | PostgreSQL `placement_drives` | None — new server-backed feature |
| Partnerships / MoUs | `domainApi.college.partnerships` | PostgreSQL `college_company` | `syncBridge` localStorage event bus |
| Curriculum modules | `domainApi.college.curriculumModules` | PostgreSQL `curriculum_modules` | None — new server-backed feature |
| Internships listing | `src/app/college/internships/page.tsx` | PostgreSQL `internships` | None — new server-backed feature |
| Eligibility & recommendations | `domainApi.college.recommendations` | PostgreSQL `notifications` with `college_id` linkage | Fake "recommended to 42 students" toast with zero server write |
| Dashboard overview | `domainApi.college.dashboard` | Aggregated PostgreSQL counts | None |
| Student import | `ImportStudentsModal.tsx` | Disabled — explains invite/claim model required | Fake CSV import that incremented `totalStudents` in memory |

---

## Backend Route Map

| Route file | Endpoints | PostgreSQL tables | Legacy replaced |
|------------|-----------|-------------------|-----------------|
| `auth.ts` | `POST /api/auth/register`, `PATCH /api/auth/me`, `GET /api/auth/me` | `users`, `role_requests` | Firestore `users/{uid}`, localStorage `skillsetu_user_role` |
| `studentProfile.ts` | Profile, projects, certifications, education CRUD | `student_profiles`, `projects`, `certifications`, `education` | Data Connect `upsertStudentProfile` + 3 mutations, localStorage `skillsetu_<uid>_profile` / `_projects` / `_certifications` |
| `skills.ts` | Catalogue search, user skill CRUD, material progress, verification | `skills`, `user_skills`, `skill_resources`, `material_progress` | Data Connect `CreateSkill` throwaway rows, `UpsertUserSkill`, localStorage `skillsetu_<uid>_skills` |
| `opportunities.ts` | Jobs / internships list, create, update | `jobs`, `internships`, `job_required_skills`, `internship_required_skills` | Data Connect `listJobs`, `listInternships`, `createJob`, `createInternship` |
| `applications.ts` | Application CRUD, stage updates, saved jobs/internships | `applications`, `application_stage_history`, `saved_jobs`, `saved_internships` | Data Connect `createApplication`, `updateApplicationStage`, localStorage `skillsetu_<uid>_applications`, `skillsetu_<uid>_saved_opps` |
| `notifications.ts` | Notification feed CRUD | `notifications` | `syncBridge.ts` `skillsetu_sync:notifications` localStorage bus |
| `learning.ts` | Courses, enrollment, material progress, challenges, submissions | `courses`, `course_modules`, `course_progress`, `enrollments`, `challenges`, `challenge_submissions` | Client-side `skillsCatalog*.ts` blob, localStorage `skillsetu_ind_challenges` / `_submissions` |
| `interviews.ts` | Interviews, offers CRUD | `interviews`, `offers` | `skillsetu_ind_interviews`, `skillsetu_ind_offers` localStorage arrays |
| `industrySettings.ts` | Hiring preferences, talent pool, partnerships | `hiring_preferences`, `talent_pool`, `college_company` | In-memory preferences, localStorage talent-pool flag, `skillsetu_ind_mous` localStorage |
| `college.ts` | Roster, programs, announcements, drives, partnerships, curriculum, internships, recommendations, dashboard | `users`, `colleges`, `training_programs`, `training_enrollments`, `campus_announcements`, `placement_drives`, `college_company`, `curriculum_modules`, `notifications`, `jobs`, `internships` | `MOCK_STUDENTS`, `INITIAL_TRAINING_PROGRAMS`, `syncBridge` bus, fake CSV import |
| `organizations.ts` | Organization lookup, role requests | `organizations`, `role_requests` | None — new server-backed feature |
| `roleRequests.ts` | Role request lifecycle | `role_requests` | None — new server-backed feature |
| `health.ts` | Readiness / liveness | None — process health | None |

---

## Data Connect Operations — Disposition

| Operation | Status | Replacement |
|-----------|--------|-------------|
| `listJobs` | Unused | `GET /api/opportunities` |
| `listInternships` | Unused | `GET /api/opportunities` |
| `createJob` | Unused | `POST /api/opportunities/jobs` |
| `createInternship` | Unused | `POST /api/opportunities/internships` |
| `upsertStudentProfile` | Unused | `PATCH /api/auth/me` + `POST /api/student/profile/*` |
| `createCandidateEducation` | Unused | `POST /api/student/profile/education` |
| `createSkill` | Unused | `POST /api/skills` (catalogue) + `POST /api/skills/:id/user-skills` |
| `upsertCompany` | Unused | `PATCH /api/industry/company-profile` |
| `upsertCollege` | Unused | `PATCH /api/college/profile` |
| `getMyCompany` | Unused | `GET /api/industry/company-profile` |
| `getMyCollege` | Unused | `GET /api/college/profile` |
| `getMyEducation` | Unused | `GET /api/student/profile/education` |
| `listColleges` | Unused | `GET /api/skills` (catalogue) |

**No Data Connect remote data was migrated, imported, or modified.** The Neon `dev` database was seeded with independent reference data only.

---

## localStorage Keys — Disposition

| Key | Current use | Notes |
|-----|-------------|-------|
| `skillsetu_theme` | Theme preference | Cosmetic UI state only; acceptable |
| `skillsetu_use_emulator` | Firebase emulator toggle | Development only; does not carry user data |
| `skillsetu_user_role` | **Removed** | Replaced by `/api/auth/me`; `AuthContext` no longer reads or writes it |
| `skillsetu_student_profile` | **Removed** | Server hydration now authoritative |
| `skillsetu_student_skills` | **Removed** | Server hydration now authoritative |
| `skillsetu_applications` | **Removed** | Server hydration now authoritative |
| `skillsetu_saved_opps` | **Removed** | Server hydration now authoritative |
| `skillsetu_notifications` | **Removed** | Server hydration now authoritative |
| `skillsetu_sync:*` | **Removed** | Replaced by PostgreSQL notifications and polling |
| `skillsetu_ind_interviews` | **Removed** | Server-backed via `/api/interviews` |
| `skillsetu_ind_offers` | **Removed** | Server-backed via `/api/offers` |
| `skillsetu_ind_challenges` | **Removed** | Server-backed via `/api/learning` |
| `skillsetu_ind_submissions` | **Removed** | Server-backed via `/api/learning` |
| `skillsetu_ind_mous` | **Removed** | Server-backed via `college_company` table |
| `skillsetu_college_profile` | **Removed** | Server hydration now authoritative |

---

## Neon `dev` Schema Summary

| Table | Owner domain | Description |
|-------|-------------|-------------|
| `users` | Identity / registration | Firebase UID, role, status, college/company affiliation |
| `student_profiles` | Student | USN, degree, CGPA, career goal, geo, completion |
| `education` | Student | Degrees, institutions, years, GPA |
| `projects` | Student | Title, description, tech stack, URLs |
| `certifications` | Student | Name, issuer, date, credential ID |
| `skills` | Reference | Catalogue rows with `source_id` for frontend slug mapping |
| `skill_resources` | Reference | Learning resources per skill; `source_id` stable per skill |
| `user_skills` | Student / Industry / College | Per-user skill rows with verification and level |
| `material_progress` | Learner | Per-user material completion |
| `jobs` | Industry | Full-time / part-time listings |
| `internships` | Industry / College | Internship listings with eligibility |
| `job_required_skills` | Industry | Join: job ↔ required skill |
| `internship_required_skills` | Industry | Join: internship ↔ required skill |
| `applications` | Student / Industry | Application rows scoped by job or internship |
| `application_stage_history` | Student / Industry | Audit trail for stage changes |
| `saved_jobs` | Student | Bookmarked full-time / part-time jobs |
| `saved_internships` | Student | Bookmarked internships |
| `notifications` | All roles | Recipient-scoped notification feed |
| `interviews` | Industry / Student | Scheduled interviews |
| `offers` | Industry / Student | Job / internship offers |
| `companies` | Industry | Company profiles |
| `colleges` | College | College profiles |
| `training_programs` | College | Programs offered by a college |
| `training_enrollments` | College / Student | Student enrollment rows |
| `campus_announcements` | College | Announcements scoped to a college |
| `placement_drives` | College | Drive records with eligibility rules |
| `college_company` | College / Industry | Partnerships / MoUs |
| `curriculum_modules` | College | Modules tied to college or partnership |
| `courses` | Learning | Course catalogue |
| `course_modules` | Learning | Modules within a course |
| `course_progress` | Learning | Per-user per-material completion |
| `enrollments` | Learning | Per-user course enrollment |
| `challenges` | Industry | Industry-posted challenges |
| `challenge_submissions` | Student / Industry | Submissions linked to challenge and user |
| `hiring_preferences` | Industry | Recruiter search preferences |
| `talent_pool` | Industry | Saved candidate profiles |
| `role_requests` | Identity | Pending role-change requests |
| `organizations` | Identity | Company and college reference data |

---

## Verification Artifacts

| Check | Result | Notes |
|-------|--------|-------|
| Backend test suite | 187 pass / 0 fail / 36 suites | Covers auth, skills, opportunities, applications, notifications, learning, interviews, offers, college, identity |
| `npm --prefix backend run build` | Pass | TypeScript compiles cleanly |
| `npm run db:verify` | Pass | 39 expected/live tables, 541 expected columns, 0 drift |
| `db:push` | Forbidden | Not used; ordered SQL migrations `0000`–`0014` only |
| Neon seed count | 1,968 rows | User-scoped tables owned by auth seed; reference data by `backend/src/db/seed.ts` |

---

## Known Legacy Footprint

The following files remain in the tree but are either inert, unreferenced, or contain only emulator/bootstrap code:

| File | Status |
|------|--------|
| `src/lib/firebase.ts` | Exports `db` and `dataConnect`; no migrated code writes to them. Emulator config and legacy onboarding writes remain. |
| `src/generated/dataconnect/` | Generated SDK; no runtime calls from migrated code. |
| `src/lib/dataConnectService.ts` | Deleted. |
| `src/lib/syncBridge.ts` | Deleted. |
| `src/lib/syncConverters.ts` | Deleted. |
| `src/lib/seeder.ts` | Deleted. |
| `firestore.rules` | Inert for application data. |
| `functions/src/index.ts` | Cloud Functions still write Firestore timestamps for an out-of-band trigger; not part of the migrated data path. |
| `src/app/api/admin/seed/route.ts` | Returns HTTP 410. |
| `src/lib/backendApi.ts` | Legacy fetch wrapper; replaced by `src/lib/domainApi.ts`. |

---

## Conventions Going Forward

- All new features must write through Express routes to PostgreSQL.
- Authorization is derived from `req.user` resolved by the backend auth middleware; frontend role state is display-only.
- `localStorage` is reserved for non-critical UI preferences (theme, emulator toggle).
- No new `localStorage` keys carrying user data will be accepted without an explicit ADR exception.
