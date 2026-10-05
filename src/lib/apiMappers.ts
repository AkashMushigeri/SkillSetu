'use client';

/**
 * Maps Express/Neon response shapes onto the frontend's UI types.
 *
 * The portals render `Skill`, `Opportunity`, `Application` and friends, which
 * predate the backend and carry presentation concerns: display-cased work modes,
 * "Just now" timestamps, a `type` field that collapses jobs and internships into
 * one enum, required skills as `string[]` rather than `{skill_id, level}` rows.
 *
 * Keeping that translation in one file is what lets the rest of the app keep
 * importing its existing types while every read comes from Neon. It also means a
 * schema change lands here instead of in forty components.
 *
 * Nothing here writes to storage. A mapper that returned `undefined` on a
 * missing field would push persistence back into the caller's hands, which is
 * the failure mode this migration exists to remove.
 */

import type {
  Certification,
  LearningResource,
  NotificationItem,
  Opportunity,
  OpportunityType,
  Project,
  Skill,
  StudentProfile,
  Application,
} from '@/types/student';
import type {
  CourseSummary,
  IndustryInternship,
  IndustryJob,
  NotificationItem as ApiNotification,
  StudentApplication,
  StudentProfileResponse,
  StudentSkill,
  SavedOpportunity,
} from './apiClient';
import { findCatalogSkill } from '@/data/skillsData';

/* ------------------------------------------------------------------ dates */

/**
 * "Just now", "15m ago", "2d ago". The UI shows relative times and had been
 * storing whatever string it produced; deriving it from `created_at` means the
 * same row renders the same way on every device.
 */
export function relativeTime(iso: string | null | undefined): string {
  if (!iso) return '';
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';

  const seconds = Math.round((Date.now() - then) / 1000);
  if (seconds < 60) return 'Just now';

  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;

  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

/** `YYYY-MM-DD`, the shape the UI's date fields use. */
function toIsoDate(value: string | null | undefined): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
}

/** `2026-08-14T09:30:00.000Z` → `14 Aug 2026`. */
export function formatDate(value: string | null | undefined): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

/* ------------------------------------------------------------- enum casing */

export function toWorkModeLabel(value: string | null | undefined): 'Remote' | 'Hybrid' | 'On-site' {
  const lower = (value ?? '').toLowerCase();
  if (lower === 'remote') return 'Remote';
  if (lower === 'hybrid') return 'Hybrid';
  return 'On-site';
}

export function fromWorkModeLabel(value: 'Remote' | 'Hybrid' | 'On-site'): 'remote' | 'hybrid' | 'onsite' {
  return value === 'Remote' ? 'remote' : value === 'Hybrid' ? 'hybrid' : 'onsite';
}

function titleCase(value: string | null | undefined): string {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1).replace(/_/g, ' ');
}

/**
 * The database stores proficiency as `beginner|intermediate|advanced|expert`;
 * the UI shows `Beginner|Intermediate|Advanced|Expert`.
 */
function toProficiencyLabel(value: string | null | undefined): Skill['verifiedLevel'] {
  const lower = (value ?? '').toLowerCase();
  if (lower === 'beginner') return 'Beginner';
  if (lower === 'advanced') return 'Advanced';
  if (lower === 'expert') return 'Expert';
  return 'Intermediate';
}

/* ------------------------------------------------------------------ skills */

/**
 * A `user_skills` row joined to the catalogue, rendered as a `Skill`.
 *
 * The descriptive half (description, objectives, resources, career roles) comes
 * from the static catalogue when the skill is recognised there, because that is
 * where assessment questions and learning content live; the per-user half
 * (progress, verification) comes from Neon and is authoritative. A skill the
 * catalogue does not know still renders, using the row's own description.
 */
export function toSkill(row: StudentSkill): Skill {
  const catalog = findCatalogSkill(row.slug) ?? findCatalogSkill(row.name);

  const resources: LearningResource[] = (catalog?.resources ?? []).map((resource) => ({
    id: resource.id,
    title: resource.title,
    type: resource.type,
    duration: resource.duration ?? '',
    completed: false,
    url: resource.url,
    topic: resource.topic,
    description: resource.description,
  }));

  return {
    // The catalogue id keeps the rest of the UI (routes, assessment lookups,
    // deep links) working with the ids it already uses.
    id: catalog?.id ?? row.slug,
    name: row.name,
    tier: titleCase(row.tier) as Skill['tier'],
    category: row.category ?? 'General',
    icon: row.icon ?? catalog?.icon ?? '💡',
    level: catalog?.level ?? titleCase(row.tier),
    progress: row.progress,
    isVerified: row.is_verified,
    verifiedDate: row.verified_at ? formatDate(row.verified_at) : undefined,
    verificationType: (row.verification_type ?? undefined) as Skill['verificationType'],
    verifiedScore: row.best_score === null ? undefined : Number(row.best_score),
    verifiedLevel: row.verified_level ? toProficiencyLabel(row.verified_level) : undefined,
    evidenceSource: (row.evidence_source ?? undefined) as Skill['evidenceSource'],
    assessmentStrengths: row.assessment_strengths?.length ? row.assessment_strengths : undefined,
    assessmentImprovements: row.assessment_improvements?.length ? row.assessment_improvements : undefined,
    learningStatus: row.learning_status as Skill['learningStatus'],
    assessmentStatus: (row.assessment_status ?? 'locked') as Skill['assessmentStatus'],
    bestScore: row.best_score === null ? undefined : Number(row.best_score),
    description: row.description ?? catalog?.description ?? `Competency in ${row.name}.`,
    estimatedTime: catalog?.estimatedTime ?? 'Self-paced',
    learningObjectives: row.learning_objectives?.length
      ? row.learning_objectives
      : (catalog?.learningObjectives ?? [`Become proficient in ${row.name}`]),
    resources,
    careerRoles: row.career_roles?.length ? row.career_roles : (catalog?.careerRoles ?? []),
    relatedOpportunityCount: catalog?.relatedOpportunityCount ?? 0,
    aliases: catalog?.aliases,
    relatedSkills: catalog?.relatedSkills,
  };
}

/**
 * The catalogue id is what the UI passes around; the API needs a value it can
 * resolve to a row. `backend/src/db/seed.ts` inserts `skills.slug` from
 * `SkillItem.id`, so the catalogue id *is* the slug — there is no second field
 * to translate.
 */
export function toCatalogSlug(uiSkillId: string): string | null {
  return findCatalogSkill(uiSkillId)?.id ?? null;
}

/* --------------------------------------------------------- student profile */

/**
 * `GET /api/student/profile` → `StudentProfile`.
 *
 * `profile_completion` comes from the server's weighted calculation rather than
 * the client's local tally, which is what made the number in the UI able to
 * disagree with the profile it described.
 */
export function toStudentProfile(
  payload: StudentProfileResponse,
  identity: { firebaseUid: string; email: string | null; displayName: string | null; photoUrl: string | null },
): StudentProfile {
  const { profile, education } = payload;

  const collegeRecord = education.find((row) => row.level === 'college');
  const pucRecord = education.find((row) => row.level === 'puc');
  const schoolRecord = education.find((row) => row.level === 'school');

  return {
    id: identity.firebaseUid,
    name: identity.displayName ?? '',
    degree: profile.degree ?? collegeRecord?.degree ?? '',
    year: profile.academic_year ?? collegeRecord?.academic_year ?? '',
    college: collegeRecord?.institution_name ?? '',
    location: profile.location ?? [profile.city, profile.state].filter(Boolean).join(', ') ?? '',
    careerGoal: profile.career_goal ?? '',
    profileCompletion: profile.profile_completion,
    avatar: identity.photoUrl ?? '',
    bio: profile.bio ?? '',
    email: identity.email ?? '',
    phone: '',
    github: profile.github_url ?? '',
    linkedin: profile.linkedin_url ?? '',
    gpa: profile.cgpa ?? '',
    education: {
      college: collegeRecord
        ? {
            institutionName: collegeRecord.institution_name ?? '',
            degree: collegeRecord.degree ?? '',
            branch: collegeRecord.department ?? undefined,
            academicYear: collegeRecord.academic_year ?? '',
            score: collegeRecord.score_text ?? (collegeRecord.score ?? '').toString(),
          }
        : undefined,
      puc: pucRecord
        ? {
            institutionName: pucRecord.institution_name ?? '',
            course: pucRecord.course ?? '',
            academicYear: pucRecord.academic_year ?? '',
            score: pucRecord.score_text ?? (pucRecord.score ?? '').toString(),
          }
        : undefined,
      school: schoolRecord
        ? {
            institutionName: schoolRecord.institution_name ?? '',
            board: schoolRecord.board ?? '',
            academicYear: schoolRecord.academic_year ?? '',
            score: schoolRecord.score_text ?? (schoolRecord.score ?? '').toString(),
          }
        : undefined,
    },
  };
}

export function toProject(row: StudentProfileResponse['projects'][number]): Project {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? '',
    techStack: row.tech_stack ?? [],
    githubUrl: row.github_url ?? '',
    liveUrl: row.live_url ?? undefined,
  };
}

export function toCertification(row: StudentProfileResponse['certifications'][number]): Certification {
  return {
    id: row.id,
    title: row.title,
    issuer: row.issuer ?? '',
    issueDate: toIsoDate(row.issue_date) || undefined,
    expiryDate: toIsoDate(row.expiry_date) || undefined,
    credentialId: row.credential_id ?? undefined,
    credentialUrl: row.credential_url ?? undefined,
    fileName: row.file_name ?? undefined,
    fileType: row.file_type ?? undefined,
    uploadedAt: row.uploaded_at ?? undefined,
  };
}

/* ----------------------------------------------------------- opportunities */

/**
 * A Neon job row → `Opportunity`.
 *
 * `type` is `'Full-Time Job'` for jobs. The UI's union also carries internship
 * flavours, which is why the internship mapper below uses `'Internship'`.
 */
function opportunityBase(
  row: IndustryJob | IndustryInternship,
  kind: 'job' | 'internship',
): Omit<Opportunity, 'requiredSkills'> {
  const job = row as IndustryJob;
  const internship = row as IndustryInternship;

  const location = row.location ?? [row.city, row.state].filter(Boolean).join(', ');

  return {
    id: row.id,
    title: row.title,
    company: row.company_name ?? '',
    companyLogo: row.company_logo ?? undefined,
    type: (kind === 'job' ? 'Full-Time Job' : 'Internship') as OpportunityType,
    location,
    city: row.city ?? '',
    // Coordinates come from the row only when the publisher supplied them;
    // `resolveOpportunityCoordinates` falls back to city lookup otherwise, so a
    // missing pair is not a crash.
    coordinates: { lat: 0, lng: 0 },
    workMode: toWorkModeLabel(row.work_mode),
    stipend: kind === 'internship' ? (internship.stipend ?? '') : (job.salary_range ?? ''),
    duration: kind === 'internship' ? (internship.duration ?? '') : '',
    postedDate: row.posted_at ? formatDate(row.posted_at) : relativeTime(row.created_at),
    deadline: toIsoDate(kind === 'internship' ? internship.application_deadline : job.deadline),
    experienceLevel: job.experience_required ?? '',
    isStartup: kind === 'internship' ? internship.is_startup_friendly : false,
    description: row.description ?? '',
    responsibilities: job.responsibilities ?? internship.learning_outcomes ?? [],
    companyId: row.company_id,
  };
}

export function toOpportunityFromJob(row: IndustryJob): Opportunity {
  return { ...opportunityBase(row, 'job'), requiredSkills: [] };
}

export function toOpportunityFromInternship(row: IndustryInternship): Opportunity {
  return { ...opportunityBase(row, 'internship'), requiredSkills: [] };
}

/* ----------------------------------------------------------- applications */

const APPLICATION_STATUS: Record<string, Application['status']> = {
  new_application: 'Applied',
  screening: 'Under Review',
  shortlisted: 'Shortlisted',
  technical_interview: 'Interview Scheduled',
  hr_interview: 'Interview Scheduled',
  selected: 'Selected',
  offer_sent: 'Selected',
  hired: 'Selected',
  rejected: 'Rejected',
  withdrawn: 'Rejected',
};

/**
 * A Neon application row → `Application`.
 *
 * The student view has no separate status vocabulary, so the ten database stages
 * collapse onto the seven the UI renders. The industry side keeps the raw stage,
 * which is why it reads `row.stage` directly instead of going through here.
 */
export function toStudentApplication(row: StudentApplication): Application {
  const title = row.job_title ?? row.internship_title ?? row.external_title ?? 'Opportunity';
  const location = row.job_location ?? row.internship_location ?? '';

  return {
    id: row.id,
    opportunityId: row.job_id ?? row.internship_id ?? row.external_id ?? row.id,
    opportunityTitle: title,
    company: row.company_name ?? row.external_company ?? '',
    type: (row.internship_id ? 'Internship' : 'Full-Time Job') as OpportunityType,
    location,
    appliedDate: formatDate(row.applied_at) || relativeTime(row.created_at),
    status: APPLICATION_STATUS[row.stage] ?? 'Under Review',
    resumeUsed: '',
    matchScoreAtApply: row.match_score === null ? 0 : Number(row.match_score),
    stipend: '',
    companyId: row.company_id ?? undefined,
  };
}

/**
 * `saved_jobs` rows → the plain id list the student's saved view works with.
 *
 * The stored key is the row id for internal opportunities, which is the same id
 * the opportunity list uses, so a saved bookmark survives a re-fetch.
 */
export function toSavedId(row: SavedOpportunity): string {
  return row.job_id ?? row.internship_id ?? row.external_id;
}

/* ---------------------------------------------------------- notifications */

/**
 * Server notifications → the student's notification list.
 *
 * The UI's `type` union is narrower than the database enum, so an unmapped type
 * degrades to `system` rather than rendering an unknown badge.
 */
export function toNotification(row: ApiNotification): NotificationItem {
  const allowed = new Set(['assessment', 'opportunity', 'badge', 'profile', 'system']);

  return {
    id: row.id,
    title: row.title,
    message: row.message ?? '',
    time: relativeTime(row.created_at),
    read: row.read,
    type: (allowed.has(row.type) ? row.type : 'system') as NotificationItem['type'],
    link: row.link ?? undefined,
  };
}

/* -------------------------------------------------------------- learning */

export function toCourseSummary(row: CourseSummary) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description ?? '',
    level: titleCase(row.level),
    estimatedHours: row.estimated_hours ?? '',
    skillName: row.skill_name ?? '',
    enrolled: row.enrollment_status !== null,
    enrollmentStatus: row.enrollment_status ?? '',
    materialCount: row.material_count,
    completedCount: row.completed_count,
    progressPercent: row.progress_percent,
  };
}
