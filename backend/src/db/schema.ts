import { relations, sql } from 'drizzle-orm';
import {
  boolean,
  date,
  doublePrecision,
  foreignKey,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

/**
 * Query model only. backend/migrations/*.sql is the sole authority for DDL; this
 * file exists so application code gets types and composable queries. It must
 * never be used to create or alter a table, and `npm run db:verify` exists to
 * catch drift between this file and the live database.
 */

export const userRoleEnum = pgEnum('user_role', ['student', 'industry', 'college', 'admin']);
export const userStatusEnum = pgEnum('user_status', ['pending', 'active', 'suspended']);
export const roleRequestStatusEnum = pgEnum('role_request_status', [
  'pending',
  'approved',
  'rejected',
  'withdrawn',
]);
export const educationLevelEnum = pgEnum('education_level', ['college', 'puc', 'school']);
export const skillTierEnum = pgEnum('skill_tier', ['basic', 'intermediate', 'advanced']);
export const learningStatusEnum = pgEnum('learning_status', ['not_started', 'in_progress', 'completed']);
export const assessmentStatusEnum = pgEnum('assessment_status', ['locked', 'ready', 'passed', 'failed']);
export const skillVerificationTypeEnum = pgEnum('skill_verification_type', [
  'claimed',
  'assessment_verified',
  'registry_verified',
  'resume_extracted',
]);
export const skillEvidenceSourceEnum = pgEnum('skill_evidence_source', [
  'self_declared',
  'resume',
  'assessment',
  'project',
  'certification',
]);
export const proficiencyLevelEnum = pgEnum('proficiency_level', [
  'beginner',
  'intermediate',
  'advanced',
  'expert',
]);
export const resourceTypeEnum = pgEnum('resource_type', [
  'video',
  'doc',
  'article',
  'practice',
  'mini_project',
]);
export const assessmentDifficultyEnum = pgEnum('assessment_difficulty', [
  'beginner',
  'intermediate',
  'advanced',
  'adaptive',
]);
export const workModeEnum = pgEnum('work_mode', ['remote', 'hybrid', 'onsite']);
export const employmentTypeEnum = pgEnum('employment_type', ['full_time', 'part_time', 'contract']);
export const opportunityStatusEnum = pgEnum('opportunity_status', ['draft', 'active', 'closed']);
export const skillImportanceEnum = pgEnum('skill_importance', ['required', 'preferred']);
export const applicationSourceEnum = pgEnum('application_source', ['internal', 'verified_api']);
export const applicationStageEnum = pgEnum('application_stage', [
  'new_application',
  'screening',
  'shortlisted',
  'technical_interview',
  'hr_interview',
  'selected',
  'offer_sent',
  'hired',
  'rejected',
  'withdrawn',
]);
export const interviewRoundEnum = pgEnum('interview_round', [
  'technical',
  'hr',
  'leadership',
  'coding_assessment_review',
]);
export const interviewModeEnum = pgEnum('interview_mode', ['online', 'offline']);
export const interviewStatusEnum = pgEnum('interview_status', ['scheduled', 'completed', 'cancelled']);
export const offerTypeEnum = pgEnum('offer_type', [
  'full_time_employment',
  'internship_with_ppo',
  'summer_internship',
]);
export const offerStatusEnum = pgEnum('offer_status', ['draft', 'sent', 'accepted', 'declined']);
export const challengeDifficultyEnum = pgEnum('challenge_difficulty', [
  'basic',
  'intermediate',
  'advanced',
]);
export const challengeStatusEnum = pgEnum('challenge_status', ['active', 'upcoming', 'closed']);
export const submissionStatusEnum = pgEnum('submission_status', [
  'under_review',
  'shortlisted',
  'winner',
  'interview_fast_tracked',
]);
export const trainingStatusEnum = pgEnum('training_status', ['active', 'upcoming', 'completed']);
export const enrollmentStatusEnum = pgEnum('enrollment_status', ['enrolled', 'completed', 'withdrawn']);
export const announcementCategoryEnum = pgEnum('announcement_category', [
  'internship',
  'placement_drive',
  'training_program',
  'assessment_deadline',
  'industry_challenge',
  'workshop',
]);
export const announcementStatusEnum = pgEnum('announcement_status', ['published', 'draft']);
export const placementDriveStatusEnum = pgEnum('placement_drive_status', [
  'upcoming',
  'ongoing',
  'completed',
]);
export const partnershipStatusEnum = pgEnum('partnership_status', ['active', 'pending', 'potential']);
export const mouStatusEnum = pgEnum('mou_status', ['active', 'under_review', 'draft', 'renewed']);
export const curriculumModuleStatusEnum = pgEnum('curriculum_module_status', [
  'adopted',
  'in_review',
  'pending_senate_approval',
]);
export const notificationTypeEnum = pgEnum('notification_type', [
  'assessment',
  'opportunity',
  'badge',
  'profile',
  'system',
  'application',
  'shortlist',
  'offer',
  'interview',
  'challenge',
  'placement',
  'training',
  'match',
  'partnership',
  'pipeline',
  'internship',
  'gap',
]);

const createdAt = timestamp('created_at', { withTimezone: true }).notNull().defaultNow();
const updatedAt = timestamp('updated_at', { withTimezone: true }).notNull().defaultNow();

export const colleges = pgTable('colleges', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  normalizedName: text('normalized_name').notNull(),
  code: text('code').notNull(),
  shortName: text('short_name'),
  aliases: text('aliases').array().notNull().default(sql`'{}'::text[]`),
  city: text('city'),
  district: text('district'),
  state: text('state'),
  country: text('country').notNull().default('India'),
  university: text('university'),
  institutionType: text('institution_type'),
  affiliation: text('affiliation'),
  officialWebsite: text('official_website'),
  logoUrl: text('logo_url'),
  about: text('about'),
  totalStudents: integer('total_students'),
  naacGrade: text('naac_grade'),
  placementOfficer: jsonb('placement_officer'),
  createdAt,
  updatedAt,
});

export const companies = pgTable('companies', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  normalizedName: text('normalized_name').notNull(),
  type: text('type'),
  industry: text('industry'),
  location: text('location'),
  city: text('city'),
  state: text('state'),
  country: text('country').notNull().default('India'),
  latitude: doublePrecision('latitude'),
  longitude: doublePrecision('longitude'),
  employees: text('employees'),
  founded: integer('founded'),
  websiteUrl: text('website_url'),
  tagline: text('tagline'),
  about: text('about'),
  mission: text('mission'),
  techStack: text('tech_stack').array().notNull().default(sql`'{}'::text[]`),
  departments: text('departments').array().notNull().default(sql`'{}'::text[]`),
  hiringDomains: text('hiring_domains').array().notNull().default(sql`'{}'::text[]`),
  benefits: text('benefits').array().notNull().default(sql`'{}'::text[]`),
  culture: text('culture').array().notNull().default(sql`'{}'::text[]`),
  logoUrl: text('logo_url'),
  coverImageUrl: text('cover_image_url'),
  ownerUserId: uuid('owner_user_id'),
  createdAt,
  updatedAt,
});

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    firebaseUid: text('firebase_uid').notNull(),
    email: text('email'),
    displayName: text('display_name'),
    photoUrl: text('photo_url'),
    phone: text('phone'),
    // Added by 0013. Describes the person, not the organization: a company row
    // cannot hold "HR Lead" without two recruiters at the same employer
    // disagreeing about it.
    title: text('title'),
    role: userRoleEnum('role').notNull().default('student'),
    status: userStatusEnum('status').notNull().default('active'),
    collegeId: uuid('college_id').references(() => colleges.id, { onDelete: 'set null' }),
    companyId: uuid('company_id').references(() => companies.id, { onDelete: 'set null' }),
    onboardingCompleted: boolean('onboarding_completed').notNull().default(false),
    lastSeenAt: timestamp('last_seen_at', { withTimezone: true }),
    createdAt,
    updatedAt,
  },
  (table) => [
    uniqueIndex('users_firebase_uid_key').on(table.firebaseUid),
    uniqueIndex('users_email_key').on(table.email),
    index('users_role_status_idx').on(table.role, table.status),
  ],
);

export const roleRequests = pgTable(
  'role_requests',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    requestedRole: userRoleEnum('requested_role').notNull(),
    status: roleRequestStatusEnum('status').notNull().default('pending'),
    organizationSnapshot: jsonb('organization_snapshot').notNull(),
    reason: text('reason'),
    reviewedBy: uuid('reviewed_by').references(() => users.id, { onDelete: 'set null' }),
    reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
    decisionNote: text('decision_note'),
    createdAt,
    updatedAt,
  },
  (table) => [
    uniqueIndex('role_requests_one_pending_per_user')
      .on(table.userId)
      .where(sql`${table.status} = 'pending'`),
    index('role_requests_queue').on(table.status, table.createdAt),
  ],
);

export const studentProfiles = pgTable('student_profiles', {
  userId: uuid('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  usn: text('usn'),
  degree: text('degree'),
  department: text('department'),
  academicYear: text('academic_year'),
  cgpa: numeric('cgpa', { precision: 3, scale: 2 }),
  careerGoal: text('career_goal'),
  bio: text('bio'),
  githubUrl: text('github_url'),
  linkedinUrl: text('linkedin_url'),
  portfolioUrl: text('portfolio_url'),
  avatarUrl: text('avatar_url'),
  location: text('location'),
  city: text('city'),
  state: text('state'),
  country: text('country'),
  latitude: doublePrecision('latitude'),
  longitude: doublePrecision('longitude'),
  profileCompletion: integer('profile_completion').notNull().default(0),
  createdAt,
  updatedAt,
});

export const educationRecords = pgTable(
  'education_records',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    level: educationLevelEnum('level').notNull(),
    institutionName: text('institution_name').notNull(),
    degree: text('degree'),
    department: text('department'),
    course: text('course'),
    board: text('board'),
    academicYear: text('academic_year'),
    score: numeric('score'),
    scoreText: text('score_text'),
    createdAt,
    updatedAt,
  },
  (table) => [uniqueIndex('education_records_one_per_level').on(table.userId, table.level)],
);

export const projects = pgTable(
  'projects',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description'),
    techStack: text('tech_stack').array().notNull().default(sql`'{}'::text[]`),
    githubUrl: text('github_url'),
    liveUrl: text('live_url'),
    createdAt,
    updatedAt,
  },
  (table) => [index('projects_user_id_idx').on(table.userId, table.createdAt)],
);

export const workExperiences = pgTable('work_experiences', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  company: text('company'),
  location: text('location'),
  startDate: date('start_date'),
  endDate: date('end_date'),
  isCurrent: boolean('is_current').notNull().default(false),
  description: text('description'),
  createdAt,
  updatedAt,
});

export const certifications = pgTable('certifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  issuer: text('issuer'),
  issueDate: date('issue_date'),
  expiryDate: date('expiry_date'),
  credentialId: text('credential_id'),
  credentialUrl: text('credential_url'),
  fileName: text('file_name'),
  fileType: text('file_type'),
  fileData: text('file_data'),
  fileSize: integer('file_size'),
  uploadedAt: timestamp('uploaded_at', { withTimezone: true }),
  createdAt,
  updatedAt,
});

export const skills = pgTable(
  'skills',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: text('slug').notNull(),
    name: text('name').notNull(),
    tier: skillTierEnum('tier').notNull(),
    category: text('category'),
    icon: text('icon'),
    description: text('description'),
    estimatedTime: text('estimated_time'),
    learningObjectives: text('learning_objectives').array().notNull().default(sql`'{}'::text[]`),
    careerRoles: text('career_roles').array().notNull().default(sql`'{}'::text[]`),
    aliases: text('aliases').array().notNull().default(sql`'{}'::text[]`),
    relatedSkills: text('related_skills').array().notNull().default(sql`'{}'::text[]`),
    relatedOpportunityCount: integer('related_opportunity_count').notNull().default(0),
    createdAt,
    updatedAt,
  },
  (table) => [
    uniqueIndex('skills_slug_unique').on(table.slug),
    uniqueIndex('skills_name_unique').on(table.name),
    index('skills_tier_idx').on(table.tier),
    index('skills_category_idx').on(table.category),
  ],
);

export const skillResources = pgTable(
  'skill_resources',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    skillId: uuid('skill_id')
      .notNull()
      .references(() => skills.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    type: resourceTypeEnum('type').notNull(),
    duration: text('duration'),
    url: text('url'),
    topic: text('topic'),
    description: text('description'),
    position: integer('position').notNull(),
    /**
     * Stable frontend catalog id. Progress writes address a resource by this
     * value, not by `position`, so reordering the catalog cannot silently move a
     * student's progress onto a different resource.
     */
    sourceId: text('source_id'),
    createdAt,
    updatedAt,
  },
  (table) => [
    uniqueIndex('skill_resources_position_per_skill').on(table.skillId, table.position),
    index('skill_resources_skill_id_idx').on(table.skillId, table.position),
  ],
);

export const userSkills = pgTable(
  'user_skills',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    skillId: uuid('skill_id')
      .notNull()
      .references(() => skills.id, { onDelete: 'cascade' }),
    progress: integer('progress').notNull().default(0),
    learningStatus: learningStatusEnum('learning_status').notNull().default('not_started'),
    assessmentStatus: assessmentStatusEnum('assessment_status').notNull().default('locked'),
    isVerified: boolean('is_verified').notNull().default(false),
    verifiedAt: timestamp('verified_at', { withTimezone: true }),
    verificationType: skillVerificationTypeEnum('verification_type'),
    verifiedScore: numeric('verified_score'),
    verifiedLevel: proficiencyLevelEnum('verified_level'),
    evidenceSource: skillEvidenceSourceEnum('evidence_source'),
    bestScore: numeric('best_score'),
    assessmentStrengths: text('assessment_strengths').array().notNull().default(sql`'{}'::text[]`),
    assessmentImprovements: text('assessment_improvements').array().notNull().default(sql`'{}'::text[]`),
    createdAt,
    updatedAt,
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.skillId] }),
    index('user_skills_skill_id_idx').on(table.skillId),
  ],
);

export const skillResourceProgress = pgTable(
  'skill_resource_progress',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    skillId: uuid('skill_id')
      .notNull()
      .references(() => skills.id, { onDelete: 'cascade' }),
    resourceId: uuid('resource_id')
      .notNull()
      .references(() => skillResources.id, { onDelete: 'cascade' }),
    completed: boolean('completed').notNull().default(false),
    lastAccessedAt: timestamp('last_accessed_at', { withTimezone: true }).notNull().defaultNow(),
    createdAt,
    updatedAt,
  },
  (table) => [primaryKey({ columns: [table.userId, table.skillId, table.resourceId] })],
);

export const skillAssessmentAttempts = pgTable('skill_assessment_attempts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  skillId: uuid('skill_id')
    .notNull()
    .references(() => skills.id, { onDelete: 'cascade' }),
  difficulty: assessmentDifficultyEnum('difficulty').notNull(),
  score: numeric('score'),
  correctCount: integer('correct_count'),
  totalQuestions: integer('total_questions'),
  percentage: numeric('percentage'),
  passed: boolean('passed').notNull().default(false),
  proficiencyLevel: proficiencyLevelEnum('proficiency_level'),
  strengths: text('strengths').array().notNull().default(sql`'{}'::text[]`),
  improvements: text('improvements').array().notNull().default(sql`'{}'::text[]`),
  startedAt: timestamp('started_at', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  createdAt,
  updatedAt,
});

export const courses = pgTable(
  'courses',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: text('slug').notNull(),
    skillId: uuid('skill_id').references(() => skills.id, { onDelete: 'set null' }),
    title: text('title').notNull(),
    description: text('description'),
    level: skillTierEnum('level').notNull().default('basic'),
    estimatedHours: numeric('estimated_hours', { precision: 6, scale: 2 }),
    isPublished: boolean('is_published').notNull().default(false),
    createdAt,
    updatedAt,
  },
  (table) => [uniqueIndex('courses_slug_unique').on(table.slug)],
);

export const courseMaterials = pgTable(
  'course_materials',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    courseId: uuid('course_id')
      .notNull()
      .references(() => courses.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    type: resourceTypeEnum('type').notNull(),
    position: integer('position').notNull(),
    url: text('url'),
    duration: text('duration'),
    description: text('description'),
    isPublished: boolean('is_published').notNull().default(false),
    createdAt,
    updatedAt,
  },
  (table) => [
    uniqueIndex('course_materials_position_per_course').on(table.courseId, table.position),
    index('course_materials_course_id_idx').on(table.courseId, table.position),
  ],
);

export const studentCourseEnrollments = pgTable(
  'student_course_enrollments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    courseId: uuid('course_id')
      .notNull()
      .references(() => courses.id, { onDelete: 'cascade' }),
    status: enrollmentStatusEnum('status').notNull().default('enrolled'),
    enrolledAt: timestamp('enrolled_at', { withTimezone: true }).notNull().defaultNow(),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    createdAt,
    updatedAt,
  },
  (table) => [
    uniqueIndex('student_course_enrollments_unique').on(table.userId, table.courseId),
    index('student_course_enrollments_course_id_idx').on(table.courseId),
  ],
);

// materialId is NOT NULL by design: PostgreSQL treats NULLs as distinct under
// UNIQUE, so a nullable material_id in this key would permit unlimited duplicate
// course-level rows. Course completion is derived on read instead.
export const courseProgress = pgTable(
  'course_progress',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    courseId: uuid('course_id')
      .notNull()
      .references(() => courses.id, { onDelete: 'cascade' }),
    materialId: uuid('material_id')
      .notNull()
      .references(() => courseMaterials.id, { onDelete: 'cascade' }),
    completed: boolean('completed').notNull().default(false),
    lastAccessedAt: timestamp('last_accessed_at', { withTimezone: true }).notNull().defaultNow(),
    createdAt,
    updatedAt,
  },
  (table) => [
    uniqueIndex('course_progress_unique_material').on(table.userId, table.courseId, table.materialId),
    index('course_progress_lookup_idx').on(table.userId, table.courseId),
  ],
);

export const jobs = pgTable(
  'jobs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: text('slug').notNull(),
    companyId: uuid('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    department: text('department'),
    location: text('location'),
    city: text('city'),
    state: text('state'),
    country: text('country').notNull().default('India'),
    workMode: workModeEnum('work_mode').notNull().default('onsite'),
    employmentType: employmentTypeEnum('employment_type').notNull().default('full_time'),
    salaryRange: text('salary_range'),
    experienceRequired: text('experience_required'),
    educationRequired: text('education_required'),
    graduationYear: text('graduation_year'),
    minimumCgpa: numeric('minimum_cgpa', { precision: 3, scale: 2 }),
    description: text('description'),
    responsibilities: text('responsibilities').array().notNull().default(sql`'{}'::text[]`),
    qualifications: text('qualifications').array().notNull().default(sql`'{}'::text[]`),
    openings: integer('openings').notNull().default(1),
    deadline: date('deadline'),
    status: opportunityStatusEnum('status').notNull().default('draft'),
    postedAt: timestamp('posted_at', { withTimezone: true }),
    createdAt,
    updatedAt,
  },
  (table) => [
    uniqueIndex('jobs_slug_unique').on(table.slug),
    index('jobs_company_status_idx').on(table.companyId, table.status),
    index('jobs_status_posted_at_idx').on(table.status, table.postedAt),
  ],
);

export const internships = pgTable(
  'internships',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: text('slug').notNull(),
    companyId: uuid('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    department: text('department'),
    location: text('location'),
    city: text('city'),
    state: text('state'),
    country: text('country').notNull().default('India'),
    workMode: workModeEnum('work_mode').notNull().default('onsite'),
    duration: text('duration'),
    stipend: text('stipend'),
    eligibility: text('eligibility'),
    startDate: date('start_date'),
    applicationDeadline: date('application_deadline'),
    description: text('description'),
    learningOutcomes: text('learning_outcomes').array().notNull().default(sql`'{}'::text[]`),
    mentor: text('mentor'),
    targetAudience: text('target_audience'),
    openings: integer('openings').notNull().default(1),
    isStartupFriendly: boolean('is_startup_friendly').notNull().default(false),
    eligibleForConversion: boolean('eligible_for_conversion').notNull().default(false),
    status: opportunityStatusEnum('status').notNull().default('draft'),
    postedAt: timestamp('posted_at', { withTimezone: true }),
    createdAt,
    updatedAt,
  },
  (table) => [
    uniqueIndex('internships_slug_unique').on(table.slug),
    index('internships_company_status_idx').on(table.companyId, table.status),
    index('internships_status_posted_at_idx').on(table.status, table.postedAt),
  ],
);

export const jobRequiredSkills = pgTable(
  'job_required_skills',
  {
    jobId: uuid('job_id')
      .notNull()
      .references(() => jobs.id, { onDelete: 'cascade' }),
    skillId: uuid('skill_id')
      .notNull()
      .references(() => skills.id, { onDelete: 'cascade' }),
    level: skillTierEnum('level').notNull().default('intermediate'),
    importance: skillImportanceEnum('importance').notNull().default('required'),
    minScore: numeric('min_score'),
  },
  (table) => [primaryKey({ columns: [table.jobId, table.skillId] })],
);

export const internshipRequiredSkills = pgTable(
  'internship_required_skills',
  {
    internshipId: uuid('internship_id')
      .notNull()
      .references(() => internships.id, { onDelete: 'cascade' }),
    skillId: uuid('skill_id')
      .notNull()
      .references(() => skills.id, { onDelete: 'cascade' }),
    level: skillTierEnum('level').notNull().default('intermediate'),
    importance: skillImportanceEnum('importance').notNull().default('required'),
    minScore: numeric('min_score'),
  },
  (table) => [primaryKey({ columns: [table.internshipId, table.skillId] })],
);

export const jobMatches = pgTable(
  'job_matches',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    jobId: uuid('job_id')
      .notNull()
      .references(() => jobs.id, { onDelete: 'cascade' }),
    matchScore: numeric('match_score', { precision: 5, scale: 2 }),
    matchedSkills: text('matched_skills').array().notNull().default(sql`'{}'::text[]`),
    missingSkills: text('missing_skills').array().notNull().default(sql`'{}'::text[]`),
    partialMatches: jsonb('partial_matches').notNull().default(sql`'[]'::jsonb`),
    explanation: text('explanation'),
    computedAt: timestamp('computed_at', { withTimezone: true }).notNull().defaultNow(),
    createdAt,
    updatedAt,
  },
  (table) => [
    uniqueIndex('job_matches_unique_user_job').on(table.userId, table.jobId),
    index('job_matches_job_id_idx').on(table.jobId),
  ],
);

export const applications = pgTable(
  'applications',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    candidateUserId: uuid('candidate_user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    companyId: uuid('company_id').references(() => companies.id, { onDelete: 'set null' }),
    source: applicationSourceEnum('source').notNull(),
    jobId: uuid('job_id').references(() => jobs.id, { onDelete: 'cascade' }),
    internshipId: uuid('internship_id').references(() => internships.id, { onDelete: 'cascade' }),
    externalId: text('external_id'),
    externalCompany: text('external_company'),
    externalTitle: text('external_title'),
    stage: applicationStageEnum('stage').notNull().default('new_application'),
    matchScore: numeric('match_score', { precision: 5, scale: 2 }),
    matchedSkills: text('matched_skills').array().notNull().default(sql`'{}'::text[]`),
    missingSkills: text('missing_skills').array().notNull().default(sql`'{}'::text[]`),
    coverNote: text('cover_note'),
    recruiterNotes: text('recruiter_notes'),
    appliedAt: timestamp('applied_at', { withTimezone: true }).notNull().defaultNow(),
    decidedAt: timestamp('decided_at', { withTimezone: true }),
    createdAt,
    updatedAt,
  },
  (table) => [
    uniqueIndex('applications_unique_job')
      .on(table.candidateUserId, table.source, table.jobId)
      .where(sql`${table.jobId} IS NOT NULL`),
    uniqueIndex('applications_unique_internship')
      .on(table.candidateUserId, table.source, table.internshipId)
      .where(sql`${table.internshipId} IS NOT NULL`),
    uniqueIndex('applications_unique_external')
      .on(table.candidateUserId, table.source, table.externalId)
      .where(sql`${table.externalId} IS NOT NULL`),
    index('applications_candidate_stage_idx').on(table.candidateUserId, table.stage),
    index('applications_company_stage_idx').on(table.companyId, table.stage),
  ],
);

export const applicationStageHistory = pgTable(
  'application_stage_history',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    applicationId: uuid('application_id')
      .notNull()
      .references(() => applications.id, { onDelete: 'cascade' }),
    stage: applicationStageEnum('stage').notNull(),
    note: text('note'),
    changedBy: uuid('changed_by').references(() => users.id, { onDelete: 'set null' }),
    changedAt: timestamp('changed_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('application_stage_history_application_idx').on(table.applicationId, table.changedAt)],
);

export const savedJobs = pgTable(
  'saved_jobs',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    source: applicationSourceEnum('source').notNull(),
    externalId: text('external_id').notNull(),
    jobId: uuid('job_id').references(() => jobs.id, { onDelete: 'cascade' }),
    internshipId: uuid('internship_id').references(() => internships.id, { onDelete: 'cascade' }),
    title: text('title'),
    companyName: text('company_name'),
    location: text('location'),
    workMode: workModeEnum('work_mode'),
    salaryRange: text('salary_range'),
    savedAt: timestamp('saved_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.source, table.externalId] }),
    index('saved_jobs_user_saved_idx').on(table.userId, table.savedAt),
  ],
);

export const interviews = pgTable(
  'interviews',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    applicationId: uuid('application_id').references(() => applications.id, { onDelete: 'set null' }),
    candidateUserId: uuid('candidate_user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    companyId: uuid('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),
    jobId: uuid('job_id').references(() => jobs.id, { onDelete: 'set null' }),
    internshipId: uuid('internship_id').references(() => internships.id, { onDelete: 'set null' }),
    round: interviewRoundEnum('round').notNull(),
    scheduledAt: timestamp('scheduled_at', { withTimezone: true }).notNull(),
    mode: interviewModeEnum('mode').notNull().default('online'),
    meetingLink: text('meeting_link'),
    interviewers: text('interviewers').array().notNull().default(sql`'{}'::text[]`),
    notes: text('notes'),
    status: interviewStatusEnum('status').notNull().default('scheduled'),
    score: numeric('score', { precision: 5, scale: 2 }),
    createdAt,
    updatedAt,
  },
  (table) => [
    index('interviews_candidate_idx').on(table.candidateUserId, table.scheduledAt),
    index('interviews_company_status_idx').on(table.companyId, table.status),
  ],
);

export const offers = pgTable(
  'offers',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    candidateUserId: uuid('candidate_user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    companyId: uuid('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),
    applicationId: uuid('application_id').references(() => applications.id, { onDelete: 'set null' }),
    jobId: uuid('job_id').references(() => jobs.id, { onDelete: 'set null' }),
    internshipId: uuid('internship_id').references(() => internships.id, { onDelete: 'set null' }),
    offerType: offerTypeEnum('offer_type').notNull(),
    department: text('department'),
    location: text('location'),
    workMode: workModeEnum('work_mode').notNull().default('onsite'),
    compensation: text('compensation'),
    baseFixed: text('base_fixed'),
    variableBonus: text('variable_bonus'),
    retentionJoiningBonus: text('retention_joining_bonus'),
    benefitsSummary: text('benefits_summary'),
    joiningDate: date('joining_date'),
    validUntil: date('valid_until'),
    status: offerStatusEnum('status').notNull().default('draft'),
    authorizedSignatory: text('authorized_signatory'),
    signatoryTitle: text('signatory_title'),
    generatedAt: timestamp('generated_at', { withTimezone: true }),
    createdAt,
    updatedAt,
  },
  (table) => [
    index('offers_candidate_idx').on(table.candidateUserId, table.createdAt),
    index('offers_company_status_idx').on(table.companyId, table.status),
  ],
);

export const challenges = pgTable(
  'challenges',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: text('slug').notNull(),
    companyId: uuid('company_id').references(() => companies.id, { onDelete: 'set null' }),
    title: text('title').notNull(),
    description: text('description'),
    problemStatement: text('problem_statement'),
    difficulty: challengeDifficultyEnum('difficulty').notNull().default('basic'),
    status: challengeStatusEnum('status').notNull().default('upcoming'),
    deadline: date('deadline'),
    teamSize: text('team_size'),
    prize: text('prize'),
    submissionRequirements: text('submission_requirements'),
    collegeParticipation: text('college_participation'),
    participantsCount: integer('participants_count').notNull().default(0),
    submissionsCount: integer('submissions_count').notNull().default(0),
    requiredSkills: text('required_skills').array().notNull().default(sql`'{}'::text[]`),
    createdAt,
    updatedAt,
  },
  (table) => [
    uniqueIndex('challenges_slug_unique').on(table.slug),
    index('challenges_company_status_idx').on(table.companyId, table.status),
  ],
);

export const challengeSubmissions = pgTable(
  'challenge_submissions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: text('slug').notNull(),
    challengeId: uuid('challenge_id')
      .notNull()
      .references(() => challenges.id, { onDelete: 'cascade' }),
    teamLeadUserId: uuid('team_lead_user_id').references(() => users.id, { onDelete: 'set null' }),
    teamName: text('team_name').notNull(),
    teamLeadName: text('team_lead_name'),
    collegeId: uuid('college_id').references(() => colleges.id, { onDelete: 'set null' }),
    githubUrl: text('github_url'),
    liveDemoUrl: text('live_demo_url'),
    videoUrl: text('video_url'),
    score: numeric('score', { precision: 5, scale: 2 }),
    testPassRate: text('test_pass_rate'),
    aiSummary: text('ai_summary'),
    status: submissionStatusEnum('status').notNull().default('under_review'),
    skillsDemonstrated: text('skills_demonstrated').array().notNull().default(sql`'{}'::text[]`),
    submittedAt: timestamp('submitted_at', { withTimezone: true }).notNull().defaultNow(),
    createdAt,
    updatedAt,
  },
  (table) => [
    uniqueIndex('challenge_submissions_slug_unique').on(table.slug),
    index('challenge_submissions_challenge_idx').on(table.challengeId, table.submittedAt),
  ],
);

export const collegeCompany = pgTable(
  'college_company',
  {
    collegeId: uuid('college_id')
      .notNull()
      .references(() => colleges.id, { onDelete: 'cascade' }),
    companyId: uuid('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),
    partnershipStatus: partnershipStatusEnum('partnership_status').notNull().default('pending'),
    isMou: boolean('is_mou').notNull().default(false),
    mouStatus: mouStatusEnum('mou_status'),
    contactPerson: text('contact_person'),
    contactEmail: text('contact_email'),
    effectiveFrom: date('effective_from'),
    expiresAt: date('expires_at'),
    keyInitiatives: text('key_initiatives').array().notNull().default(sql`'{}'::text[]`),
    internshipCommitmentCount: integer('internship_commitment_count').notNull().default(0),
    jointHackathonsCount: integer('joint_hackathons_count').notNull().default(0),
    curriculumReviewsCompleted: integer('curriculum_reviews_completed').notNull().default(0),
    internshipOpportunitiesCount: integer('internship_opportunities_count').notNull().default(0),
    studentsHiredCount: integer('students_hired_count').notNull().default(0),
    challengesActiveCount: integer('challenges_active_count').notNull().default(0),
    createdAt,
    updatedAt,
  },
  (table) => [
    primaryKey({ columns: [table.collegeId, table.companyId] }),
    index('college_company_company_idx').on(table.companyId),
  ],
);

export const curriculumModules = pgTable(
  'curriculum_modules',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: text('slug').notNull(),
    collegeId: uuid('college_id').notNull(),
    companyId: uuid('company_id').notNull(),
    semester: text('semester'),
    currentSubject: text('current_subject'),
    industryRecommendation: text('industry_recommendation'),
    recommendedTechnologies: text('recommended_technologies')
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    rationale: text('rationale'),
    status: curriculumModuleStatusEnum('status').notNull().default('in_review'),
    createdAt,
    updatedAt,
  },
  (table) => [
    uniqueIndex('curriculum_modules_slug_unique').on(table.slug),
    foreignKey({
      columns: [table.collegeId, table.companyId],
      foreignColumns: [collegeCompany.collegeId, collegeCompany.companyId],
      name: 'curriculum_modules_partnership_fkey',
    }).onDelete('cascade'),
    index('curriculum_modules_college_idx').on(table.collegeId),
  ],
);

export const trainingPrograms = pgTable(
  'training_programs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: text('slug').notNull(),
    collegeId: uuid('college_id')
      .notNull()
      .references(() => colleges.id, { onDelete: 'cascade' }),
    skillId: uuid('skill_id').references(() => skills.id, { onDelete: 'set null' }),
    name: text('name').notNull(),
    skillName: text('skill_name'),
    skillLevel: skillTierEnum('skill_level').notNull().default('intermediate'),
    description: text('description'),
    instructor: text('instructor'),
    startDate: date('start_date'),
    endDate: date('end_date'),
    maxStudents: integer('max_students'),
    assessmentRequired: boolean('assessment_required').notNull().default(false),
    industryPartner: text('industry_partner'),
    learningResources: text('learning_resources').array().notNull().default(sql`'{}'::text[]`),
    status: trainingStatusEnum('status').notNull().default('upcoming'),
    createdAt,
    updatedAt,
  },
  (table) => [
    uniqueIndex('training_programs_slug_unique').on(table.slug),
    index('training_programs_college_status_idx').on(table.collegeId, table.status),
  ],
);

export const trainingEnrollments = pgTable(
  'training_enrollments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    trainingProgramId: uuid('training_program_id')
      .notNull()
      .references(() => trainingPrograms.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    status: enrollmentStatusEnum('status').notNull().default('enrolled'),
    score: numeric('score', { precision: 5, scale: 2 }),
    enrolledAt: timestamp('enrolled_at', { withTimezone: true }).notNull().defaultNow(),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    createdAt,
    updatedAt,
  },
  (table) => [uniqueIndex('training_enrollments_unique').on(table.trainingProgramId, table.userId)],
);

export const campusAnnouncements = pgTable(
  'campus_announcements',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: text('slug').notNull(),
    collegeId: uuid('college_id')
      .notNull()
      .references(() => colleges.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    category: announcementCategoryEnum('category').notNull(),
    content: text('content'),
    targetAudience: text('target_audience'),
    status: announcementStatusEnum('status').notNull().default('draft'),
    important: boolean('important').notNull().default(false),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    createdAt,
    updatedAt,
  },
  (table) => [uniqueIndex('campus_announcements_slug_unique').on(table.slug)],
);

export const placementDrives = pgTable(
  'placement_drives',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: text('slug').notNull(),
    collegeId: uuid('college_id')
      .notNull()
      .references(() => colleges.id, { onDelete: 'cascade' }),
    companyId: uuid('company_id').references(() => companies.id, { onDelete: 'set null' }),
    title: text('title').notNull(),
    driveDate: date('drive_date'),
    eligibleDepartments: text('eligible_departments').array().notNull().default(sql`'{}'::text[]`),
    minimumCgpa: numeric('minimum_cgpa', { precision: 3, scale: 2 }),
    skillsRequired: text('skills_required').array().notNull().default(sql`'{}'::text[]`),
    packageOffer: text('package_offer'),
    openings: integer('openings'),
    status: placementDriveStatusEnum('status').notNull().default('upcoming'),
    createdAt,
    updatedAt,
  },
  (table) => [
    uniqueIndex('placement_drives_slug_unique').on(table.slug),
    index('placement_drives_college_status_idx').on(table.collegeId, table.status, table.driveDate),
  ],
);

export const notifications = pgTable(
  'notifications',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    recipientUserId: uuid('recipient_user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: notificationTypeEnum('type').notNull(),
    title: text('title').notNull(),
    message: text('message'),
    link: text('link'),
    meta: jsonb('meta').notNull().default(sql`'{}'::jsonb`),
    read: boolean('read').notNull().default(false),
    createdAt,
  },
  (table) => [
    index('notifications_recipient_read_idx').on(table.recipientUserId, table.read),
    index('notifications_recipient_created_idx').on(table.recipientUserId, table.createdAt),
  ],
);

export const hiringPreferences = pgTable(
  'hiring_preferences',
  {
    userId: uuid('user_id')
      .primaryKey()
      .references(() => users.id, { onDelete: 'cascade' }),
    companyId: uuid('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),
    preferredDepartments: text('preferred_departments').array().notNull().default(sql`'{}'::text[]`),
    preferredDegrees: text('preferred_degrees').array().notNull().default(sql`'{}'::text[]`),
    preferredGraduationYears: text('preferred_graduation_years').array().notNull().default(sql`'{}'::text[]`),
    preferredLocations: text('preferred_locations').array().notNull().default(sql`'{}'::text[]`),
    workModes: workModeEnum('work_modes').array().notNull().default(sql`'{}'::work_mode[]`),
    minimumCgpa: numeric('minimum_cgpa', { precision: 3, scale: 2 }),
    prioritizeVerifiedSkills: boolean('prioritize_verified_skills').notNull().default(false),
    prioritizeStartupExperience: boolean('prioritize_startup_experience').notNull().default(false),
    searchRadiusKm: integer('search_radius_km').notNull().default(25),
    createdAt,
    updatedAt,
  },
  (table) => [index('hiring_preferences_company_idx').on(table.companyId)],
);

export const companyCandidateLists = pgTable(
  'company_candidate_lists',
  {
    companyId: uuid('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),
    candidateUserId: uuid('candidate_user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    category: text('category').notNull(),
    note: text('note'),
    shortlistedAt: timestamp('shortlisted_at', { withTimezone: true }).notNull().defaultNow(),
    createdAt,
    updatedAt,
  },
  (table) => [
    primaryKey({ columns: [table.companyId, table.candidateUserId] }),
    index('company_candidate_lists_candidate_idx').on(table.candidateUserId),
    index('company_candidate_lists_company_category_idx').on(table.companyId, table.category),
  ],
);

export const usersRelations = relations(users, ({ one, many }) => ({
  college: one(colleges, { fields: [users.collegeId], references: [colleges.id] }),
  company: one(companies, { fields: [users.companyId], references: [companies.id] }),
  studentProfile: one(studentProfiles, { fields: [users.id], references: [studentProfiles.userId] }),
  skills: many(userSkills),
  roleRequests: many(roleRequests, { relationName: 'requester' }),
}));

export const applicationsRelations = relations(applications, ({ one }) => ({
  candidate: one(users, { fields: [applications.candidateUserId], references: [users.id] }),
  company: one(companies, { fields: [applications.companyId], references: [companies.id] }),
  job: one(jobs, { fields: [applications.jobId], references: [jobs.id] }),
  internship: one(internships, { fields: [applications.internshipId], references: [internships.id] }),
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
  skill: one(skills, { fields: [courses.skillId], references: [skills.id] }),
  materials: many(courseMaterials),
}));

export const skillsRelations = relations(skills, ({ one, many }) => ({
  resources: many(skillResources),
  userSkills: many(userSkills),
  courses: many(courses),
}));

export const collegesRelations = relations(colleges, ({ one, many }) => ({
  users: many(users),
  partnerships: many(collegeCompany),
}));

export const companiesRelations = relations(companies, ({ one, many }) => ({
  owner: one(users, {
    fields: [companies.ownerUserId],
    references: [users.id],
    relationName: 'company_owner',
  }),
  jobs: many(jobs),
  internships: many(internships),
  partnerships: many(collegeCompany),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type StudentProfile = typeof studentProfiles.$inferSelect;
export type Skill = typeof skills.$inferSelect;
export type UserSkill = typeof userSkills.$inferSelect;
export type Company = typeof companies.$inferSelect;
export type College = typeof colleges.$inferSelect;
export type Job = typeof jobs.$inferSelect;
export type Internship = typeof internships.$inferSelect;
export type Application = typeof applications.$inferSelect;
export type RoleRequest = typeof roleRequests.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
