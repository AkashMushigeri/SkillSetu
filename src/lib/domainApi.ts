'use client';

/**
 * Typed calls to the Express/Neon domain routes.
 *
 * The transports live in `apiClient.ts`; this module is the domain vocabulary the
 * portals import. Every function here maps to exactly one backend route, so a
 * reviewer can read this file and know precisely which tables the frontend
 * touches.
 *
 * Two invariants held throughout:
 *
 *  - No function accepts a `userId`, `companyId` or `collegeId` to scope a
 *    request. Ownership is resolved server-side from the verified token. The one
 *    exception is `talentPool.upsert`, where a recruiter explicitly nominates a
 *    *candidate* to shortlist; that candidate id is a subject, not a scope, and
 *    the backend still pins the company to the caller.
 *  - Nothing here falls back to browser storage on failure. If the request fails
 *    the caller's state is left untouched, because a UI that appears to have saved
 *    a change which never left the browser is worse than a visible error.
 */

import {
  api,
  type CollegeProfile,
  type CompanyProfile,
  type CourseDetail,
  type CourseSummary,
  type Challenge,
  type HiringPreferences,
  type IndustryApplication,
  type IndustryInternship,
  type IndustryJob,
  type Interview,
  type NotificationItem,
  type Offer,
  type SavedOpportunity,
  type StudentApplication,
  type StudentProfileResponse,
  type StudentSkill,
  type TalentPoolEntry,
} from './apiClient';

/* -------------------------------------------------------------- identity */

/** What `/api/auth/me` returns. Role here is the PostgreSQL role, not a claim. */
export type Identity = {
  userId: string;
  firebaseUid: string;
  email: string | null;
  displayName: string | null;
  photoUrl: string | null;
  phone: string | null;
  title: string | null;
  role: 'student' | 'industry' | 'college' | 'admin';
  status: 'pending' | 'active' | 'suspended';
  companyId: string | null;
  collegeId: string | null;
  onboardingCompleted: boolean;
};

export const identity = {
  me: () => api.get<Identity>('/api/auth/me'),

  /**
   * The account fields a person owns. Note what is *not* accepted: role, status,
   * companyId, collegeId. Those come from registration and admin approval, and the
   * schema rejects them with a 400 rather than ignoring them, so a stale client
   * cannot appear to have saved a role change that never happened.
   */
  update: (patch: {
    displayName?: string | null;
    phone?: string | null;
    title?: string | null;
    avatarUrl?: string | null;
    onboardingCompleted?: boolean;
  }) => api.patch<Identity>('/api/auth/me', patch),
};

/* -------------------------------------------------------- student profile */

export const studentProfile = {
  get: () => api.get<StudentProfileResponse>('/api/student/profile'),

  /**
   * Partial update. Keys that are absent are left alone on the server, so this
   * sends only what the form actually changed.
   */
  update: (patch: {
    displayName?: string | null;
    phone?: string | null;
    usn?: string | null;
    degree?: string | null;
    department?: string | null;
    academicYear?: string | null;
    cgpa?: number | null;
    careerGoal?: string | null;
    bio?: string | null;
    githubUrl?: string | null;
    linkedinUrl?: string | null;
    portfolioUrl?: string | null;
    location?: string | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
    latitude?: number | null;
    longitude?: number | null;
  }) => api.patch<{ profile: StudentProfileResponse['profile'] }>('/api/student/profile', patch),

  /**
   * One row per level (`ON CONFLICT (user_id, level)`), so the profile editor
   * calls this to fill a level rather than appending a duplicate.
   */
  upsertEducation: (record: {
    level: 'college' | 'puc' | 'school';
    institutionName: string;
    degree?: string | null;
    department?: string | null;
    course?: string | null;
    board?: string | null;
    academicYear?: string | null;
    score?: number | null;
    scoreText?: string | null;
  }) => api.put<void>('/api/student/education', record),

  createProject: (project: {
    title: string;
    description?: string | null;
    techStack: string[];
    githubUrl?: string | null;
    liveUrl?: string | null;
  }) => api.post<{ project: StudentProfileResponse['projects'][number] }>('/api/student/projects', project),

  updateProject: (
    id: string,
    patch: Partial<{
      title: string;
      description: string | null;
      techStack: string[];
      githubUrl: string | null;
      liveUrl: string | null;
    }>,
  ) => api.patch<{ project: StudentProfileResponse['projects'][number] }>(`/api/student/projects/${id}`, patch),

  deleteProject: (id: string) => api.delete<void>(`/api/student/projects/${id}`),

  createCertification: (cert: {
    title: string;
    issuer?: string | null;
    issueDate?: string | null;
    expiryDate?: string | null;
    credentialId?: string | null;
    credentialUrl?: string | null;
  }) =>
    api.post<{ certification: StudentProfileResponse['certifications'][number] }>(
      '/api/student/certifications',
      cert,
    ),

  updateCertification: (
    id: string,
    patch: Partial<{
      title: string;
      issuer: string | null;
      issueDate: string | null;
      expiryDate: string | null;
      credentialId: string | null;
      credentialUrl: string | null;
    }>,
  ) => api.patch<{ certification: StudentProfileResponse['certifications'][number] }>(
    `/api/student/certifications/${id}`,
    patch,
  ),

  deleteCertification: (id: string) => api.delete<void>(`/api/student/certifications/${id}`),

  createExperience: (experience: {
    title: string;
    company?: string | null;
    location?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    isCurrent: boolean;
    description?: string | null;
  }) =>
    api.post<{ experience: StudentProfileResponse['experiences'][number] }>(
      '/api/student/work-experiences',
      experience,
    ),

  deleteExperience: (id: string) => api.delete<void>(`/api/student/work-experiences/${id}`),
};

/* ---------------------------------------------------------------- skills */

export type SkillCatalogEntry = {
  id: string;
  slug: string;
  name: string;
  tier: string;
  category: string | null;
  icon: string | null;
  description: string | null;
  estimated_time: string | null;
  learning_objectives: string[];
  career_roles: string[];
  aliases: string[];
  related_skills: string[];
};

export const skills = {
  /**
   * The shared catalogue. Cached per session by the caller because it is
   * reference data that only changes on deploy.
   */
  catalog: (q?: string, limit?: number) =>
    api.get<{ skills: SkillCatalogEntry[] }>('/api/skills', {
      query: { q, limit },
    }),

  detail: (id: string) =>
    api.get<{
      skill: SkillCatalogEntry;
      resources: Array<{
        id: string;
        /** Stable frontend catalog id; null on rows seeded before migration 0014. */
        source_id: string | null;
        title: string;
        type: string;
        duration: string | null;
        url: string | null;
        topic: string | null;
        description: string | null;
        position: number;
      }>;
    }>(`/api/skills/${id}`),

  mine: () => api.get<{ skills: StudentSkill[] }>('/api/student/skills'),

  add: (skillId: string, progress?: number) =>
    api.post<{ skill: { skill_id: string; progress: number; learning_status: string } }>(
      '/api/student/skills',
      { skillId, progress, learningStatus: 'not_started' },
    ),

  update: (skillId: string, patch: { progress?: number; learningStatus?: string; assessmentStatus?: string; bestScore?: number | null }) =>
    api.patch<{ skill: { skill_id: string; progress: number; learning_status: string } }>(
      `/api/student/skills/${skillId}`,
      patch,
    ),

  /**
   * Records a verification. `verificationType: 'assessment_verified'` with
   * `evidenceSource: 'assessment'` is what a passed assessment sends.
   */
  verify: (
    skillId: string,
    payload: {
      verificationType?: 'claimed' | 'assessment_verified' | 'registry_verified' | 'resume_extracted';
      verifiedLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
      evidenceSource?: 'self_declared' | 'resume' | 'assessment' | 'project' | 'certification';
      verifiedScore?: number | null;
      strengths: string[];
      improvements: string[];
    },
  ) => api.post<{ skill: Record<string, unknown> }>(`/api/student/skills/${skillId}/verify`, payload),

  remove: (skillId: string) => api.delete<void>(`/api/student/skills/${skillId}`),

  setResourceProgress: (skillId: string, resourceId: string, completed: boolean) =>
    api.post<{ progress: { resource_id: string; completed: boolean } }>(
      `/api/student/skills/${skillId}/resources/${resourceId}/progress`,
      { completed },
    ),
};

/* --------------------------------------------------------- opportunities */

export type OpportunityQuery = {
  status?: 'draft' | 'active' | 'closed';
  city?: string;
  workMode?: 'remote' | 'hybrid' | 'onsite';
  search?: string;
  limit?: number;
  offset?: number;
};

export const opportunities = {
  /** One call returns both listings; the student portal renders them together. */
  list: (query: OpportunityQuery = {}) =>
    api.get<{ jobs: IndustryJob[]; internships: IndustryInternship[] }>('/api/opportunities', { query }),

  job: (id: string) =>
    api.get<{
      job: IndustryJob;
      requiredSkills: Array<{ skill_id: string; skill_name: string; skill_slug: string; level: string; importance: string; min_score: number | null }>;
      myMatch: { match_score: number | null; matched_skills: string[]; missing_skills: string[]; explanation: string | null } | null;
    }>(`/api/opportunities/jobs/${id}`),

  internship: (id: string) =>
    api.get<{
      internship: IndustryInternship;
      requiredSkills: Array<{ skill_id: string; skill_name: string; skill_slug: string; level: string; importance: string; min_score: number | null }>;
    }>(`/api/opportunities/internships/${id}`),
};

export const industryJobs = {
  create: (job: Record<string, unknown>) => api.post<{ job: IndustryJob }>('/api/industry/jobs', job),
  update: (id: string, patch: Record<string, unknown>) =>
    api.patch<{ job: IndustryJob }>(`/api/industry/jobs/${id}`, patch),
};

export const industryInternships = {
  create: (internship: Record<string, unknown>) =>
    api.post<{ internship: IndustryInternship }>('/api/industry/internships', internship),
  update: (id: string, patch: Record<string, unknown>) =>
    api.patch<{ internship: IndustryInternship }>(`/api/industry/internships/${id}`, patch),
};

/* --------------------------------------------------------- applications */

export const studentApplications = {
  list: (query: { stage?: string; limit?: number; offset?: number } = {}) =>
    api.get<{ applications: StudentApplication[]; total: number }>('/api/student/applications', { query }),

  /**
   * Replaces the localStorage application record plus the Data Connect write the
   * student portal used to fan out to. `matchScore` is the value the client
   * computed locally; it is stored, not trusted for anything.
   */
  create: (input: {
    jobId?: string;
    internshipId?: string;
    source?: 'internal' | 'verified_api';
    externalId?: string;
    externalCompany?: string | null;
    externalTitle?: string | null;
    matchScore?: number | null;
    matchedSkills: string[];
    missingSkills: string[];
    coverNote?: string | null;
  }) => api.post<{ application: StudentApplication }>('/api/student/applications', input),
};

export const industryApplications = {
  list: (query: { stage?: string; limit?: number; offset?: number } = {}) =>
    api.get<{ applications: IndustryApplication[] }>('/api/industry/applications', { query }),

  /**
   * Stage transitions. The server writes the history row, the notification, and
   * the stage in one transaction â€” the client used to have to fan those out and
   * could leave them disagreeing.
   */
  setStage: (id: string, stage: string, note?: string | null) =>
    api.patch<{ application: IndustryApplication }>(`/api/industry/applications/${id}/stage`, { stage, note }),

  history: (id: string) => api.get<{ history: Array<Record<string, unknown>> }>(`/api/industry/applications/${id}/history`),
};

export const saved = {
  list: () => api.get<{ saved: SavedOpportunity[] }>('/api/student/saved'),

  /**
   * Upsert keyed on (user, source, externalId). For internal opportunities the
   * `externalId` is the row id, so saving the same job twice is idempotent.
   */
  save: (input: {
    externalId: string;
    source?: 'internal' | 'verified_api';
    jobId?: string;
    internshipId?: string;
    title?: string | null;
    companyName?: string | null;
    location?: string | null;
    workMode?: 'remote' | 'hybrid' | 'onsite';
    salaryRange?: string | null;
  }) => api.put<{ saved: SavedOpportunity }>('/api/student/saved', input),

  unsave: (externalId: string) => api.delete<void>(`/api/student/saved/${encodeURIComponent(externalId)}`),
};

/* -------------------------------------------------------------- learning */

export const learning = {
  courses: (query: { skillId?: string; isPublished?: boolean; limit?: number } = {}) =>
    api.get<{ courses: CourseSummary[] }>('/api/courses', {
      query: { skillId: query.skillId, isPublished: query.isPublished === undefined ? undefined : String(query.isPublished), limit: query.limit },
    }),

  course: (id: string) => api.get<CourseDetail>(`/api/courses/${id}`),

  enroll: (id: string) => api.post<{ enrollment: Record<string, unknown> }>(`/api/courses/${id}/enroll`, {}),

  setMaterialProgress: (courseId: string, materialId: string, completed: boolean) =>
    api.post<{ progress: Record<string, unknown>; progressPercent: number }>(
      `/api/courses/${courseId}/materials/${materialId}/progress`,
      { completed },
    ),
};

export const challenges = {
  list: (query: { status?: string; limit?: number; offset?: number } = {}) =>
    api.get<{ challenges: Challenge[] }>('/api/challenges', { query }),

  detail: (id: string) => api.get<{ challenge: Challenge }>(`/api/challenges/${id}`),

  submissions: (id: string) => api.get<{ submissions: Array<Record<string, unknown>> }>(`/api/challenges/${id}/submissions`),

  create: (challenge: Record<string, unknown>) =>
    api.post<{ challenge: Challenge }>('/api/industry/challenges', challenge),

  update: (id: string, patch: Record<string, unknown>) =>
    api.patch<{ challenge: Challenge }>(`/api/industry/challenges/${id}`, patch),

  submit: (id: string, submission: Record<string, unknown>) =>
    api.post<{ submission: Record<string, unknown> }>(`/api/challenges/${id}/submissions`, submission),
};

/* --------------------------------------------------- interviews / offers */

export const interviews = {
  mine: () => api.get<{ interviews: Interview[] }>('/api/student/interviews'),
  forCompany: () => api.get<{ interviews: Interview[] }>('/api/industry/interviews'),
  create: (interview: Record<string, unknown>) =>
    api.post<{ interview: Interview }>('/api/industry/interviews', interview),
  update: (id: string, patch: Record<string, unknown>) =>
    api.patch<{ interview: Interview }>(`/api/industry/interviews/${id}`, patch),
};

export const offers = {
  mine: () => api.get<{ offers: Offer[] }>('/api/student/offers'),
  forCompany: () => api.get<{ offers: Offer[] }>('/api/industry/offers'),
  create: (offer: Record<string, unknown>) => api.post<{ offer: Offer }>('/api/industry/offers', offer),
  update: (id: string, patch: Record<string, unknown>) => api.patch<{ offer: Offer }>(`/api/offers/${id}`, patch),
};

/* -------------------------------------------------------- organizations */

export const companyProfile = {
  get: () =>
    api.get<{
      company: CompanyProfile | null;
      recruiters: Array<{ id: string; display_name: string | null; email: string | null; title: string | null; is_active: boolean }>;
    }>('/api/industry/company'),

  update: (patch: Record<string, unknown>) =>
    api.patch<{ company: CompanyProfile | null; unchanged?: boolean }>('/api/industry/company', patch),
};

export const collegeProfile = {
  get: () =>
    api.get<{
      college: CollegeProfile | null;
      officers: Array<{ id: string; display_name: string | null; email: string | null; title: string | null; designation: string | null }>;
    }>('/api/college/profile'),

  update: (patch: Record<string, unknown>) =>
    api.patch<{ college: CollegeProfile | null; unchanged?: boolean }>('/api/college/profile', patch),
};

export const directory = {
  companies: () => api.get<{ companies: Array<{ id: string; name: string; industry: string | null; city: string | null; state: string | null; logo_url: string | null }> }>('/api/directory/companies'),
  colleges: () => api.get<{ colleges: Array<{ id: string; name: string; short_name: string | null; city: string | null; state: string | null; logo_url: string | null }> }>('/api/directory/colleges'),
};

/* ------------------------------------------------- industry hiring settings */

export const hiring = {
  preferences: () => api.get<{ preferences: HiringPreferences }>('/api/industry/hiring-preferences'),

  savePreferences: (preferences: Record<string, unknown>) =>
    api.put<{ preferences: HiringPreferences }>('/api/industry/hiring-preferences', preferences),

  talentPool: (query: { category?: string; limit?: number; offset?: number } = {}) =>
    api.get<{ entries: TalentPoolEntry[] }>('/api/industry/talent-pool', { query }),

  /**
   * `candidateUserId` is who the recruiter is shortlisting, not which tenant to
   * read: the backend still pins the row to the caller's own company.
   */
  shortlist: (candidateUserId: string, category: string, note?: string | null) =>
    api.put<{ entry: TalentPoolEntry }>('/api/industry/talent-pool', {
      candidateUserId,
      category,
      note: note ?? null,
    }),

  removeFromTalentPool: (candidateUserId: string) =>
    api.delete<void>(`/api/industry/talent-pool/${candidateUserId}`),

  partnerships: () =>
    api.get<{ partnerships: Array<Record<string, unknown>> }>('/api/industry/partnerships'),
};

/* --------------------------------------------------------- notifications */

/**
 * Server-side notifications. This replaces the localStorage bus in
 * `syncBridge.ts`, which could only ever deliver to the tab that wrote the
 * message.
 */
export const notifications = {
  list: (query: { unreadOnly?: boolean; limit?: number; offset?: number } = {}) =>
    api.get<{ notifications: NotificationItem[]; unreadCount: number }>('/api/notifications', {
      query: {
        unreadOnly: query.unreadOnly ? 'true' : undefined,
        limit: query.limit,
        offset: query.offset,
      },
    }),

  markRead: (id: string) => api.post<{ id: string; read: boolean }>(`/api/notifications/${id}/read`, {}),

  markAllRead: () => api.post<{ markedRead: number }>('/api/notifications/read-all', {}),
};

/* --------------------------------------------------------------- college */
/*
 * The college portal had no backend until this migration. `0011_college.sql`
 * created the tables; these are the wrappers that finally reach them. Note that
 * none of these take a collegeId — the owning college always comes from the
 * authenticated user's `users.college_id`.
 */

export type CollegeTrainingProgramRow = {
  id: string;
  slug: string;
  name: string;
  skill_id: string | null;
  skill_slug: string | null;
  skill_name: string | null;
  skill_level: 'basic' | 'intermediate' | 'advanced';
  description: string | null;
  instructor: string | null;
  start_date: string | null;
  end_date: string | null;
  max_students: number | null;
  assessment_required: boolean;
  industry_partner: string | null;
  learning_resources: string[];
  status: 'active' | 'upcoming' | 'completed';
  enrolled_students: number;
  completed_students: number;
  average_score: string | null;
  created_at: string;
  updated_at: string;
};

export type CollegeAnnouncementRow = {
  id: string;
  slug: string;
  title: string;
  category:
    | 'internship'
    | 'placement_drive'
    | 'training_program'
    | 'assessment_deadline'
    | 'industry_challenge'
    | 'workshop';
  content: string | null;
  target_audience: string | null;
  status: 'published' | 'draft';
  important: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type CollegePlacementDriveRow = {
  id: string;
  slug: string;
  company_id: string | null;
  company_name: string | null;
  title: string;
  drive_date: string | null;
  eligible_departments: string[];
  minimum_cgpa: string | null;
  skills_required: string[];
  package_offer: string | null;
  openings: number | null;
  status: 'upcoming' | 'ongoing' | 'completed';
  created_at: string;
  updated_at: string;
};

export type CollegeStudentRow = {
  id: string;
  firebase_uid: string;
  email: string | null;
  display_name: string | null;
  photo_url: string | null;
  title: string | null;
  status: 'pending' | 'active' | 'suspended';
  onboarding_completed: boolean;
  degree: string | null;
  department: string | null;
  academic_year: string | null;
  cgpa: string | null;
  location: string | null;
  bio: string | null;
  skill_count: number;
  verified_skill_count: number;
};

export type CollegePartnershipRow = {
  college_id: string;
  company_id: string;
  company_name: string;
  industry: string | null;
  city: string | null;
  state: string | null;
  partnership_status: 'active' | 'pending' | 'potential';
  is_mou: boolean;
  mou_status: 'active' | 'under_review' | 'draft' | 'renewed' | null;
  contact_person: string | null;
  contact_email: string | null;
  effective_from: string | null;
  expires_at: string | null;
  key_initiatives: string[];
  internship_commitment_count: number;
  joint_hackathons_count: number;
  curriculum_reviews_completed: number;
  internship_opportunities_count: number;
  students_hired_count: number;
  challenges_active_count: number;
  curriculum_module_count: number;
  updated_at: string;
};

export type CollegeCurriculumRow = {
  id: string;
  slug: string;
  college_id: string;
  company_id: string;
  company_name: string | null;
  semester: string | null;
  current_subject: string | null;
  industry_recommendation: string | null;
  recommended_technologies: string[];
  rationale: string | null;
  status: 'adopted' | 'in_review' | 'pending_senate_approval';
  created_at: string;
  updated_at: string;
};

export type CollegeOverview = {
  students: number;
  active_training_programs: number;
  training_enrollments: number;
  published_announcements: number;
  upcoming_placement_drives: number;
  active_partnerships: number;
  adopted_curriculum_modules: number;
};

export const college = {
  overview: () => api.get<{ overview: CollegeOverview }>('/api/college/overview'),

  profile: () =>
    api.get<{
      college: Record<string, unknown> | null;
      officers: Array<Record<string, unknown>>;
    }>('/api/college/profile'),

  students: (query: { q?: string; department?: string; skillSlug?: string; limit?: number } = {}) =>
    api.get<{ students: CollegeStudentRow[]; total: number }>('/api/college/students', {
      query: {
        q: query.q,
        department: query.department,
        skillSlug: query.skillSlug,
        limit: query.limit,
      },
    }),

  trainingPrograms: () =>
    api.get<{ trainingPrograms: CollegeTrainingProgramRow[] }>('/api/college/training-programs'),

  createTrainingProgram: (body: {
    name: string;
    skillId?: string | null;
    skillName?: string | null;
    skillLevel?: 'basic' | 'intermediate' | 'advanced';
    description?: string | null;
    instructor?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    maxStudents?: number | null;
    assessmentRequired?: boolean;
    industryPartner?: string | null;
    learningResources?: string[];
    status?: 'active' | 'upcoming' | 'completed';
  }) => api.post<{ trainingProgram: Record<string, unknown> }>('/api/college/training-programs', body),

  updateTrainingProgram: (
    id: string,
    body: Partial<{
      name: string;
      skillId: string | null;
      skillName: string | null;
      skillLevel: 'basic' | 'intermediate' | 'advanced';
      description: string | null;
      instructor: string | null;
      startDate: string | null;
      endDate: string | null;
      maxStudents: number | null;
      assessmentRequired: boolean;
      industryPartner: string | null;
      learningResources: string[];
      status: 'active' | 'upcoming' | 'completed';
    }>,
  ) => api.patch<{ trainingProgram: Record<string, unknown> }>(`/api/college/training-programs/${id}`, body),

  deleteTrainingProgram: (id: string) =>
    api.delete<{ deleted: string }>(`/api/college/training-programs/${id}`),

  announcements: () =>
    api.get<{ announcements: CollegeAnnouncementRow[] }>('/api/college/announcements'),

  createAnnouncement: (body: {
    title: string;
    category: CollegeAnnouncementRow['category'];
    content?: string | null;
    targetAudience?: string | null;
    status?: 'published' | 'draft';
    important?: boolean;
  }) => api.post<{ announcement: Record<string, unknown> }>('/api/college/announcements', body),

  deleteAnnouncement: (id: string) =>
    api.delete<{ deleted: string }>(`/api/college/announcements/${id}`),

  placementDrives: () =>
    api.get<{ placementDrives: CollegePlacementDriveRow[] }>('/api/college/placement-drives'),

  createPlacementDrive: (body: {
    title: string;
    companyId?: string | null;
    driveDate?: string | null;
    eligibleDepartments?: string[];
    minimumCgpa?: number | null;
    skillsRequired?: string[];
    packageOffer?: string | null;
    openings?: number | null;
    status?: 'upcoming' | 'ongoing' | 'completed';
  }) => api.post<{ placementDrive: Record<string, unknown> }>('/api/college/placement-drives', body),

  partnerships: () =>
    api.get<{ partnerships: CollegePartnershipRow[] }>('/api/college/partnerships'),

  /**
   * Upsert, so re-submitting the same company updates the existing partnership
   * instead of colliding on the composite primary key.
   */
  upsertPartnership: (body: {
    companyId: string;
    partnershipStatus?: 'active' | 'pending' | 'potential';
    isMou?: boolean;
    mouStatus?: 'active' | 'under_review' | 'draft' | 'renewed' | null;
    contactPerson?: string | null;
    contactEmail?: string | null;
    effectiveFrom?: string | null;
    expiresAt?: string | null;
    keyInitiatives?: string[];
  }) => api.put<{ partnership: Record<string, unknown> }>('/api/college/partnerships', body),

  curriculum: () =>
    api.get<{ curriculumModules: CollegeCurriculumRow[] }>('/api/college/curriculum'),

  createCurriculumModule: (body: {
    companyId: string;
    semester?: string | null;
    currentSubject?: string | null;
    industryRecommendation?: string | null;
    recommendedTechnologies?: string[];
    rationale?: string | null;
    status?: 'adopted' | 'in_review' | 'pending_senate_approval';
  }) => api.post<{ curriculumModule: Record<string, unknown> }>('/api/college/curriculum', body),
};
/**
 * Internship recommendation, replacing a toast that reported "recommended to 42
 * eligible students" without writing anything. Eligibility is computed in SQL, so
 * the count shown on the card and the number of students actually notified are
 * the same number by construction.
 */
export const collegeInternships = {
  /**
   * Active internships with a per-college `eligible_students` count, so the UI
   * does not issue one request per card to learn how many students match.
   */
  list: () =>
    api.get<{
      internships: Array<{
        id: string;
        slug: string;
        title: string;
        department: string | null;
        location: string | null;
        city: string | null;
        state: string | null;
        work_mode: 'remote' | 'hybrid' | 'onsite';
        duration: string | null;
        stipend: string | null;
        eligibility: string | null;
        start_date: string | null;
        application_deadline: string | null;
        description: string | null;
        openings: number;
        is_startup_friendly: boolean;
        eligible_for_conversion: boolean;
        status: string;
        company_name: string;
        company_logo: string | null;
        required_skills: number;
        eligible_students: number;
      }>;
    }>('/api/college/internships'),

  eligibleStudents: (internshipId: string) =>
    api.get<{
      eligibleStudents: Array<{ id: string; display_name: string | null; email: string | null }>;
      total: number;
      requiredSkills: number;
    }>(`/api/college/internships/${internshipId}/eligible-students`),

  /**
   * Writes one `notifications` row per matched student. Returns the real count,
   * or `notified: 0` when nobody at the college currently qualifies.
   */
  recommend: (internshipId: string) =>
    api.post<{ notified: number; requiredSkills: number; message?: string }>(
      `/api/college/internships/${internshipId}/recommend`,
      {},
    ),
};