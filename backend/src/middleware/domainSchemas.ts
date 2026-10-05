import { z } from 'zod';

/**
 * Request schemas for the migrated domain routes.
 *
 * Every schema here replaces a browser-side persistence path: a Data Connect
 * mutation, a localStorage write, or an in-memory state object. Two rules hold
 * across all of them.
 *
 * 1. No schema accepts a user id, company id, or college id for authorization.
 *    Those come from the PostgreSQL `users` row that the auth middleware loaded,
 *    so a client cannot act on behalf of another account or tenant.
 * 2. Enums mirror the PostgreSQL enum values in migration 0000 exactly. A
 *    mismatch would surface as a 500 from the driver rather than a 400.
 */

const shortText = (max: number) => z.string().trim().min(1, 'must not be empty').max(max);
const optionalText = (max: number) => z.string().trim().max(max).optional().nullable();
const textArray = (max: number) => z.array(z.string().trim().min(1).max(max)).max(50).default([]);
const url = z.string().trim().url('must be a valid URL').max(1000).optional().nullable();
const isoDate = z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, 'must be an ISO date (YYYY-MM-DD)');
const optionalIsoDate = isoDate.optional().nullable();

export const WORK_MODES = ['remote', 'hybrid', 'onsite'] as const;
export const EMPLOYMENT_TYPES = ['full_time', 'part_time', 'contract'] as const;
export const OPPORTUNITY_STATUSES = ['draft', 'active', 'closed'] as const;
export const SKILL_TIERS = ['basic', 'intermediate', 'advanced'] as const;
export const SKILL_IMPORTANCE = ['required', 'preferred'] as const;
export const LEARNING_STATUSES = ['not_started', 'in_progress', 'completed'] as const;
export const APPLICATION_SOURCES = ['internal', 'verified_api'] as const;
export const APPLICATION_STAGES = [
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
] as const;
export const INTERVIEW_ROUNDS = ['technical', 'hr', 'leadership', 'coding_assessment_review'] as const;
export const INTERVIEW_MODES = ['online', 'offline'] as const;
export const INTERVIEW_STATUSES = ['scheduled', 'completed', 'cancelled'] as const;
export const OFFER_TYPES = ['full_time_employment', 'internship_with_ppo', 'summer_internship'] as const;
export const OFFER_STATUSES = ['draft', 'sent', 'accepted', 'declined'] as const;
export const CHALLENGE_DIFFICULTIES = ['basic', 'intermediate', 'advanced'] as const;
export const CHALLENGE_STATUSES = ['active', 'upcoming', 'closed'] as const;
export const SUBMISSION_STATUSES = ['under_review', 'shortlisted', 'winner', 'interview_fast_tracked'] as const;
export const EDUCATION_LEVELS = ['college', 'puc', 'school'] as const;
export const RESOURCE_TYPES = ['video', 'doc', 'article', 'practice', 'mini_project'] as const;
export const ENROLLMENT_STATUSES = ['enrolled', 'completed', 'withdrawn'] as const;
export const NOTIFICATION_TYPES = [
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
] as const;

export const PROFICIENCY_LEVELS = ['beginner', 'intermediate', 'advanced', 'expert'] as const;
export const SKILL_VERIFICATION_TYPES = [
  'claimed',
  'assessment_verified',
  'registry_verified',
  'resume_extracted',
] as const;
export const SKILL_EVIDENCE_SOURCES = [
  'self_declared',
  'resume',
  'assessment',
  'project',
  'certification',
] as const;

/** Shared slug generator input for tables that carry a unique slug. */
const slug = z
  .string()
  .trim()
  .min(2)
  .max(160)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'must be lowercase alphanumeric words joined by single hyphens');

const optionalSlug = slug.optional();

/** Score fields are numeric(5,2) and range-checked in the database. */
const score = z.number().min(0).max(100).optional().nullable();
const cgpa = z.number().min(0).max(10).optional().nullable();

/* ------------------------------------------------------------------ student */

export const updateStudentProfileSchema = z
  .object({
    displayName: optionalText(200),
    phone: optionalText(32),
    usn: optionalText(64),
    degree: optionalText(120),
    department: optionalText(120),
    academicYear: optionalText(64),
    cgpa,
    careerGoal: optionalText(2000),
    bio: optionalText(4000),
    githubUrl: url,
    linkedinUrl: url,
    portfolioUrl: url,
    location: optionalText(200),
    city: optionalText(120),
    state: optionalText(120),
    country: optionalText(120),
    latitude: z.number().min(-90).max(90).optional().nullable(),
    longitude: z.number().min(-180).max(180).optional().nullable(),
  })
  .strict();

export type UpdateStudentProfileBody = z.infer<typeof updateStudentProfileSchema>;

export const upsertEducationSchema = z
  .object({
    level: z.enum(EDUCATION_LEVELS),
    institutionName: shortText(200),
    degree: optionalText(120),
    department: optionalText(120),
    course: optionalText(120),
    board: optionalText(120),
    academicYear: optionalText(64),
    score: z.number().min(0).max(1000).optional().nullable(),
    scoreText: optionalText(64),
  })
  .strict();

export type UpsertEducationBody = z.infer<typeof upsertEducationSchema>;

export const createProjectSchema = z
  .object({
    title: shortText(200),
    description: optionalText(4000),
    techStack: textArray(120),
    githubUrl: url,
    liveUrl: url,
  })
  .strict();

export const updateProjectSchema = createProjectSchema.partial().strict();
export type CreateWorkExperienceBody = z.infer<typeof createWorkExperienceSchema>;
export type CreateProjectBody = z.infer<typeof createProjectSchema>;
export type UpdateProjectBody = z.infer<typeof updateProjectSchema>;

export const createWorkExperienceSchema = z
  .object({
    title: shortText(200),
    company: optionalText(200),
    location: optionalText(200),
    startDate: optionalIsoDate,
    endDate: optionalIsoDate,
    isCurrent: z.boolean().default(false),
    description: optionalText(4000),
  })
  .strict();

export const createCertificationSchema = z
  .object({
    title: shortText(200),
    issuer: optionalText(200),
    issueDate: optionalIsoDate,
    expiryDate: optionalIsoDate,
    credentialId: optionalText(200),
    credentialUrl: url,
  })
  .strict();

export const updateCertificationSchema = createCertificationSchema.partial().strict();
export type CreateCertificationBody = z.infer<typeof createCertificationSchema>;
export type UpdateCertificationBody = z.infer<typeof updateCertificationSchema>;

/**
 * The client previously posted a base64 PDF alongside the metadata. That is a
 * 5 MB column (certifications_file_size_max) and was the single largest request
 * the API accepted. File upload is deliberately not reimplemented here: this
 * migration moves *where* application state lives, not the upload transport.
 */
export const certificationUploadRejected = () =>
  new Error('certificate file upload is not part of this migration; metadata only');

/* ------------------------------------------------------------------- skills */

export const createUserSkillSchema = z
  .object({
    skillId: z.string().uuid('must be a UUID'),
    progress: z.number().int().min(0).max(100).optional(),
    learningStatus: z.enum(LEARNING_STATUSES).optional(),
  })
  .strict();

export const updateUserSkillSchema = z
  .object({
    progress: z.number().int().min(0).max(100).optional(),
    learningStatus: z.enum(LEARNING_STATUSES).optional(),
    assessmentStatus: z.enum(['locked', 'ready', 'passed', 'failed']).optional(),
    bestScore: score,
  })
  .strict();

export const verifyUserSkillSchema = z
  .object({
    verificationType: z.enum(SKILL_VERIFICATION_TYPES).optional(),
    verifiedLevel: z.enum(PROFICIENCY_LEVELS).optional(),
    evidenceSource: z.enum(SKILL_EVIDENCE_SOURCES).optional(),
    verifiedScore: score,
    strengths: textArray(200),
    improvements: textArray(200),
  })
  .strict();

export type CreateUserSkillBody = z.infer<typeof createUserSkillSchema>;
export type UpdateUserSkillBody = z.infer<typeof updateUserSkillSchema>;
export type VerifyUserSkillBody = z.infer<typeof verifyUserSkillSchema>;

/* ------------------------------------------------------------ opportunities */

const requiredSkillSchema = z
  .object({
    skillId: z.string().uuid('must be a UUID'),
    level: z.enum(SKILL_TIERS).default('intermediate'),
    importance: z.enum(SKILL_IMPORTANCE).default('required'),
    minScore: score,
  })
  .strict();

export const createJobSchema = z
  .object({
    slug: optionalSlug,
    title: shortText(200),
    department: optionalText(120),
    location: optionalText(200),
    city: optionalText(120),
    state: optionalText(120),
    country: optionalText(120),
    workMode: z.enum(WORK_MODES).default('onsite'),
    employmentType: z.enum(EMPLOYMENT_TYPES).default('full_time'),
    salaryRange: optionalText(120),
    experienceRequired: optionalText(120),
    educationRequired: optionalText(200),
    graduationYear: optionalText(64),
    minimumCgpa: cgpa,
    description: optionalText(8000),
    responsibilities: textArray(500),
    qualifications: textArray(500),
    openings: z.number().int().min(0).max(10000).default(1),
    deadline: optionalIsoDate,
    status: z.enum(OPPORTUNITY_STATUSES).default('draft'),
    requiredSkills: z.array(requiredSkillSchema).max(50).default([]),
  })
  .strict();

export const updateJobSchema = createJobSchema.partial().strict();
export type CreateJobBody = z.infer<typeof createJobSchema>;
export type UpdateJobBody = z.infer<typeof updateJobSchema>;

export const createInternshipSchema = z
  .object({
    slug: optionalSlug,
    title: shortText(200),
    department: optionalText(120),
    location: optionalText(200),
    city: optionalText(120),
    state: optionalText(120),
    country: optionalText(120),
    workMode: z.enum(WORK_MODES).default('onsite'),
    duration: optionalText(120),
    stipend: optionalText(120),
    eligibility: optionalText(2000),
    startDate: optionalIsoDate,
    applicationDeadline: optionalIsoDate,
    description: optionalText(8000),
    learningOutcomes: textArray(500),
    mentor: optionalText(200),
    targetAudience: optionalText(500),
    openings: z.number().int().min(0).max(10000).default(1),
    isStartupFriendly: z.boolean().default(false),
    eligibleForConversion: z.boolean().default(false),
    status: z.enum(OPPORTUNITY_STATUSES).default('draft'),
    requiredSkills: z.array(requiredSkillSchema).max(50).default([]),
  })
  .strict();

export const updateInternshipSchema = createInternshipSchema.partial().strict();
export type CreateInternshipBody = z.infer<typeof createInternshipSchema>;
export type UpdateInternshipBody = z.infer<typeof updateInternshipSchema>;

/**
 * Listing is open to any active account: the student portal needs to browse
 * opportunities. `companyId` filters the industry portal's own listings and is
 * still server-checked against the caller's company.
 */
export const listOpportunitiesSchema = z.object({
  status: z.enum(OPPORTUNITY_STATUSES).default('active'),
  companyId: z.string().uuid().optional(),
  city: z.string().trim().max(120).optional(),
  workMode: z.enum(WORK_MODES).optional(),
  search: z.string().trim().max(200).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).max(10000).default(0),
});

export type ListOpportunitiesQuery = z.infer<typeof listOpportunitiesSchema>;

/* ------------------------------------------------------------ applications */

export const createApplicationSchema = z
  .object({
    // Exactly one target. The database CHECK applications_single_internal_target
    // rejects job+internship together; the refine below rejects client-side
    // nonsense before it becomes a 500.
    source: z.enum(APPLICATION_SOURCES).default('internal'),
    jobId: z.string().uuid().optional(),
    internshipId: z.string().uuid().optional(),
    externalId: z.string().trim().min(1).max(300).optional(),
    externalCompany: optionalText(200),
    externalTitle: optionalText(200),
    matchScore: score,
    matchedSkills: textArray(200),
    missingSkills: textArray(200),
    coverNote: optionalText(4000),
  })
  .strict()
  .refine((body) => Boolean(body.jobId ?? body.internshipId ?? body.externalId), {
    message: 'one of jobId, internshipId or externalId is required',
    path: ['jobId'],
  })
  .refine((body) => !(body.jobId && body.internshipId), {
    message: 'jobId and internshipId are mutually exclusive',
    path: ['jobId'],
  })
  .refine((body) => body.source !== 'verified_api' || Boolean(body.externalId), {
    message: 'externalId is required when source is verified_api',
    path: ['externalId'],
  });

export type CreateApplicationBody = z.infer<typeof createApplicationSchema>;

export const updateApplicationStageSchema = z
  .object({
    stage: z.enum(APPLICATION_STAGES),
    note: optionalText(2000),
  })
  .strict();

export const listApplicationsSchema = z.object({
  stage: z.enum(APPLICATION_STAGES).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).max(10000).default(0),
});

export const upsertSavedJobSchema = z
  .object({
    source: z.enum(APPLICATION_SOURCES).default('internal'),
    externalId: z.string().trim().min(1).max(300),
    jobId: z.string().uuid().optional(),
    internshipId: z.string().uuid().optional(),
    title: optionalText(200),
    companyName: optionalText(200),
    location: optionalText(200),
    workMode: z.enum(WORK_MODES).optional(),
    salaryRange: optionalText(120),
  })
  .strict();

export type UpdateApplicationStageBody = z.infer<typeof updateApplicationStageSchema>;
export type ListApplicationsQuery = z.infer<typeof listApplicationsSchema>;
export type UpsertSavedJobBody = z.infer<typeof upsertSavedJobSchema>;

/* ---------------------------------------------------------------- learning */

export const createCourseSchema = z
  .object({
    slug: optionalSlug,
    skillId: z.string().uuid().optional(),
    title: shortText(200),
    description: optionalText(8000),
    level: z.enum(SKILL_TIERS).default('basic'),
    estimatedHours: z.number().min(0).max(10000).optional().nullable(),
    isPublished: z.boolean().default(false),
    materials: z
      .array(
        z
          .object({
            title: shortText(200),
            type: z.enum(RESOURCE_TYPES),
            url: url,
            duration: optionalText(64),
            description: optionalText(2000),
            isPublished: z.boolean().default(false),
          })
          .strict(),
      )
      .max(100)
      .default([]),
  })
  .strict();

export const listCoursesSchema = z.object({
  skillId: z.string().uuid().optional(),
  isPublished: z
    .enum(['true', 'false'])
    .default('true')
    .transform((value) => value === 'true'),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export const enrollInCourseSchema = z
  .object({
    status: z.enum(ENROLLMENT_STATUSES).default('enrolled'),
  })
  .strict();

export const updateMaterialProgressSchema = z
  .object({
    completed: z.boolean(),
  })
  .strict();

export type UpdateMaterialProgressBody = z.infer<typeof updateMaterialProgressSchema>;
export type CreateCourseBody = z.infer<typeof createCourseSchema>;
export type ListCoursesQuery = z.infer<typeof listCoursesSchema>;

/* ------------------------------------------------------------- challenges */

export const createChallengeSchema = z
  .object({
    slug: optionalSlug,
    title: shortText(200),
    description: optionalText(8000),
    problemStatement: optionalText(20000),
    difficulty: z.enum(CHALLENGE_DIFFICULTIES).default('basic'),
    status: z.enum(CHALLENGE_STATUSES).default('upcoming'),
    deadline: optionalIsoDate,
    teamSize: optionalText(64),
    prize: optionalText(120),
    submissionRequirements: optionalText(4000),
    collegeParticipation: optionalText(2000),
    requiredSkills: textArray(200),
  })
  .strict();

export const updateChallengeSchema = createChallengeSchema.partial().strict();
export type CreateChallengeBody = z.infer<typeof createChallengeSchema>;
export type UpdateChallengeBody = z.infer<typeof updateChallengeSchema>;

export const createSubmissionSchema = z
  .object({
    slug: optionalSlug,
    teamName: shortText(200),
    teamLeadName: optionalText(200),
    githubUrl: url,
    liveDemoUrl: url,
    videoUrl: url,
    testPassRate: optionalText(64),
    skillsDemonstrated: textArray(200),
    collegeId: z.string().uuid().optional(),
  })
  .strict();

export const updateSubmissionSchema = z
  .object({
    status: z.enum(SUBMISSION_STATUSES).optional(),
    score,
    aiSummary: optionalText(8000),
  })
  .strict();

export const listChallengesSchema = z.object({
  status: z.enum(CHALLENGE_STATUSES).optional(),
  companyId: z.string().uuid().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).max(10000).default(0),
});

export type CreateSubmissionBody = z.infer<typeof createSubmissionSchema>;
export type UpdateSubmissionBody = z.infer<typeof updateSubmissionSchema>;
export type ListChallengesQuery = z.infer<typeof listChallengesSchema>;

/* --------------------------------------------------- interviews and offers */

export const createInterviewSchema = z
  .object({
    applicationId: z.string().uuid().optional(),
    jobId: z.string().uuid().optional(),
    internshipId: z.string().uuid().optional(),
    round: z.enum(INTERVIEW_ROUNDS),
    scheduledAt: z.string().trim().datetime({ message: 'must be an ISO 8601 timestamp' }),
    mode: z.enum(INTERVIEW_MODES).default('online'),
    meetingLink: url,
    interviewers: textArray(200),
    notes: optionalText(4000),
    score,
  })
  .strict()
  .refine((body) => Boolean(body.jobId ?? body.internshipId ?? body.applicationId), {
    message: 'one of applicationId, jobId or internshipId is required',
    path: ['applicationId'],
  });

export const updateInterviewSchema = z
  .object({
    status: z.enum(INTERVIEW_STATUSES).optional(),
    scheduledAt: z.string().trim().datetime().optional(),
    mode: z.enum(INTERVIEW_MODES).optional(),
    meetingLink: url,
    notes: optionalText(4000),
    score,
  })
  .strict();

export const createOfferSchema = z
  .object({
    applicationId: z.string().uuid().optional(),
    jobId: z.string().uuid().optional(),
    internshipId: z.string().uuid().optional(),
    offerType: z.enum(OFFER_TYPES),
    department: optionalText(120),
    location: optionalText(200),
    workMode: z.enum(WORK_MODES).default('onsite'),
    compensation: optionalText(200),
    baseFixed: optionalText(200),
    variableBonus: optionalText(200),
    retentionJoiningBonus: optionalText(200),
    benefitsSummary: optionalText(4000),
    joiningDate: optionalIsoDate,
    validUntil: optionalIsoDate,
    status: z.enum(OFFER_STATUSES).default('draft'),
    authorizedSignatory: optionalText(200),
    signatoryTitle: optionalText(200),
  })
  .strict();

export const updateOfferSchema = z
  .object({
    status: z.enum(OFFER_STATUSES).optional(),
    notes: optionalText(4000).optional(),
  })
  .strict();

export type CreateInterviewBody = z.infer<typeof createInterviewSchema>;
export type UpdateInterviewBody = z.infer<typeof updateInterviewSchema>;
export type CreateOfferBody = z.infer<typeof createOfferSchema>;
export type UpdateOfferBody = z.infer<typeof updateOfferSchema>;

/* ----------------------------------------------------------- organizations */

export const updateCompanyProfileSchema = z
  .object({
    name: optionalText(200),
    type: optionalText(120),
    industry: optionalText(120),
    location: optionalText(200),
    city: optionalText(120),
    state: optionalText(120),
    country: optionalText(120),
    latitude: z.number().min(-90).max(90).optional().nullable(),
    longitude: z.number().min(-180).max(180).optional().nullable(),
    employees: optionalText(64),
    founded: z.number().int().min(1000).max(2200).optional().nullable(),
    websiteUrl: url,
    tagline: optionalText(300),
    about: optionalText(8000),
    mission: optionalText(4000),
    techStack: textArray(120),
    departments: textArray(120),
    hiringDomains: textArray(120),
    benefits: textArray(300),
    culture: textArray(300),
    logoUrl: url,
    coverImageUrl: url,
  })
  .strict();

export const updateCollegeProfileSchema = z
  .object({
    name: optionalText(200),
    shortName: optionalText(120),
    city: optionalText(120),
    district: optionalText(120),
    state: optionalText(120),
    country: optionalText(120),
    university: optionalText(200),
    institutionType: optionalText(120),
    affiliation: optionalText(200),
    officialWebsite: url,
    logoUrl: url,
    about: optionalText(8000),
    totalStudents: z.number().int().min(0).max(10000000).optional().nullable(),
    naacGrade: optionalText(64),
    placementOfficer: z
      .object({
        name: optionalText(200),
        title: optionalText(200),
        email: z.string().trim().email().max(320).optional().nullable(),
        phone: optionalText(32),
      })
      .strict()
      .optional()
      .nullable(),
  })
  .strict();

export type UpdateCompanyProfileBody = z.infer<typeof updateCompanyProfileSchema>;
export type UpdateCollegeProfileBody = z.infer<typeof updateCollegeProfileSchema>;

/* ------------------------------------------------- industry hiring settings */

export const upsertHiringPreferencesSchema = z
  .object({
    preferredDepartments: textArray(200),
    preferredDegrees: textArray(200),
    preferredGraduationYears: textArray(64),
    preferredLocations: textArray(200),
    workModes: z.array(z.enum(WORK_MODES)).max(10).default([]),
    minimumCgpa: cgpa,
    prioritizeVerifiedSkills: z.boolean().default(false),
    prioritizeStartupExperience: z.boolean().default(false),
    searchRadiusKm: z.number().int().min(1).max(1000).default(25),
  })
  .strict();

export const listTalentPoolSchema = z.object({
  category: z.string().trim().max(200).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).max(10000).default(0),
});

export const upsertTalentPoolEntrySchema = z
  .object({
    candidateUserId: z.string().uuid('must be a UUID'),
    category: shortText(200),
    note: optionalText(2000),
  })
  .strict();

export type UpsertHiringPreferencesBody = z.infer<typeof upsertHiringPreferencesSchema>;
export type ListTalentPoolQuery = z.infer<typeof listTalentPoolSchema>;
export type UpsertTalentPoolEntryBody = z.infer<typeof upsertTalentPoolEntrySchema>;

/* ---------------------------------------------------------- notifications */

export const listNotificationsSchema = z.object({
  unreadOnly: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true'),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).max(10000).default(0),
});

export const createNotificationSchema = z
  .object({
    recipientUserId: z.string().uuid('must be a UUID'),
    type: z.enum(NOTIFICATION_TYPES),
    title: shortText(200),
    message: optionalText(2000),
    link: optionalText(500),
    meta: z.record(z.string(), z.unknown()).default({}),
  })
  .strict();

export type ListNotificationsQuery = z.infer<typeof listNotificationsSchema>;
export type CreateNotificationBody = z.infer<typeof createNotificationSchema>;