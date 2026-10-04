/**
 * src/lib/dataConnectService.ts
 * 
 * High-level service layer connecting React Contexts to Firebase Data Connect.
 * Provides type-safe abstractions with automatic mapping to portal models
 * and resilient fallbacks (safe no-op/logging when Data Connect or emulators are offline).
 */

import { dataConnect } from '@/lib/firebase';
import {
  listJobs,
  listInternships,
  createJob,
  createInternship,
  createApplication,
  updateApplicationStage,
  createChallenge,
  ApplicationStage as GqlApplicationStage,
  ChallengeStatus as GqlChallengeStatus,
} from '@skillsetu/dataconnect';
import { IndustryJob, IndustryInternship, IndustryChallenge, ApplicationStage } from '@/types/industry';
import { Opportunity } from '@/types/student';

// Default UUID used when seeding/testing without dedicated company UUID
export const DEFAULT_DEMO_COMPANY_ID = '00000000-0000-0000-0000-000000000001';

const DEFAULT_COORDINATES = { lat: 12.9716, lng: 77.5946 };

/**
 * Fetch remote jobs from Firebase Data Connect.
 * Converts to IndustryJob[] and Opportunity[].
 */
export async function fetchRemoteJobs(): Promise<{
  industryJobs: IndustryJob[];
  opportunities: Opportunity[];
}> {
  if (!dataConnect) {
    return { industryJobs: [], opportunities: [] };
  }

  try {
    const res = await listJobs(dataConnect);
    const jobs = res.data?.jobs || [];

    const industryJobs: IndustryJob[] = jobs.map((j) => ({
      id: j.id,
      title: j.title,
      company: j.company?.name || 'TechNova Labs',
      department: j.department || 'Engineering',
      location: j.location || 'Bengaluru, Karnataka',
      workMode: (j.workMode as any) || 'Hybrid',
      jobType: (j.jobType as any) || 'Full Time',
      salaryRange: j.salaryRange || '₹8 - 14 LPA',
      experienceRequired: j.experienceRequired || '0-2 Years',
      education: 'B.Tech / B.E.',
      graduationYear: '2025 / 2026',
      minimumCgpa: j.minimumCgpa || 7.5,
      requiredSkills: (j.jobRequiredSkills_on_job || []).map((s) => ({
        name: s.skill?.name || 'General Engineering',
        level: (s.level as any) || 'Intermediate',
        importance: (s.importance as any) || 'Required',
      })),
      description: (j as any).description || `Engineering opportunity at ${j.company?.name || 'TechNova Labs'}`,
      responsibilities: ((j as any).responsibilities as string[]) || ['Build scalable features', 'Collaborate with team'],
      qualifications: ((j as any).qualifications as string[]) || ['Strong computer science fundamentals'],
      deadline: j.deadline || '30 days',
      openings: j.openings || 2,
      applicationsCount: j.applicationsCount || 0,
      shortlistedCount: (j as any).shortlistedCount || 0,
      strongMatchesCount: (j as any).strongMatchesCount || 0,
      status: (j.status as any) || 'Active',
      postedDate: j.postedDate ? new Date(j.postedDate).toLocaleDateString() : 'Recent',
    }));

    const opportunities: Opportunity[] = jobs.map((j) => ({
      id: `dc-${j.id}`,
      title: j.title,
      company: j.company?.name || 'TechNova Labs',
      type: 'Full-Time Job',
      location: j.location || 'Bengaluru, Karnataka',
      city: (j.location || 'Bengaluru').split(',')[0].trim(),
      coordinates: DEFAULT_COORDINATES,
      workMode: (j.workMode as any) || 'Hybrid',
      stipend: j.salaryRange || 'Competitive',
      duration: 'Permanent',
      postedDate: j.postedDate ? new Date(j.postedDate).toLocaleDateString() : 'Recent',
      deadline: j.deadline || '30 days',
      requiredSkills: (j.jobRequiredSkills_on_job || []).map((s) => s.skill?.name || '').filter(Boolean),
      experienceLevel: j.experienceRequired || 'Fresher / Entry Level',
      isStartup: true,
      description: (j as any).description || `Engineering opportunity at ${j.company?.name || 'TechNova Labs'}`,
      responsibilities: ((j as any).responsibilities as string[]) || ['Contribute to core services'],
      perks: ['Health insurance', 'Flexible hours', 'Mentorship'],
    }));

    return { industryJobs, opportunities };
  } catch (err: any) {
    console.info('[DataConnect] Remote jobs not available (using local/sync layer):', err?.message || err);
    return { industryJobs: [], opportunities: [] };
  }
}

/**
 * Fetch remote internships from Firebase Data Connect.
 */
export async function fetchRemoteInternships(): Promise<{
  industryInternships: IndustryInternship[];
  opportunities: Opportunity[];
}> {
  if (!dataConnect) {
    return { industryInternships: [], opportunities: [] };
  }

  try {
    const res = await listInternships(dataConnect);
    const interns = res.data?.internships || [];

    const industryInternships: IndustryInternship[] = interns.map((i) => ({
      id: i.id,
      title: i.title,
      company: i.company?.name || 'TechNova Labs',
      department: i.department || 'Engineering',
      location: i.location || 'Bengaluru, Karnataka',
      workMode: (i.workMode as any) || 'Hybrid',
      duration: i.duration || '3 Months',
      stipend: i.stipend || '₹25,000 / month',
      eligibility: i.eligibility || 'Pre-final & Final year students',
      startDate: i.startDate || 'Immediate',
      applicationDeadline: i.applicationDeadline || '2 weeks',
      requiredSkills: (i.internshipRequiredSkills_on_internship || []).map((s) => ({
        name: s.skill?.name || 'Technical',
        level: (s.level as any) || 'Intermediate',
        importance: (s.importance as any) || 'Required',
      })),
      description: (i as any).description || `Internship program at ${i.company?.name || 'TechNova Labs'}`,
      learningOutcomes: ((i as any).learningOutcomes as string[]) || ['Practical software development experience'],
      mentor: (i as any).mentor || 'Staff AI Engineer',
      openings: i.openings || 2,
      isStartupFriendly: i.isStartupFriendly ?? true,
      targetAudience: (i as any).targetAudience || 'B.Tech / M.Tech',
      eligibleForConversion: i.eligibleForConversion ?? true,
      status: (i.status as any) || 'Active',
      applicationsCount: i.applicationsCount || 0,
      shortlistedCount: (i as any).shortlistedCount || 0,
      postedDate: i.postedDate ? new Date(i.postedDate).toLocaleDateString() : 'Recent',
    }));

    const opportunities: Opportunity[] = interns.map((i) => ({
      id: `dc-int-${i.id}`,
      title: i.title,
      company: i.company?.name || 'TechNova Labs',
      type: 'Internship',
      location: i.location || 'Bengaluru, Karnataka',
      city: (i.location || 'Bengaluru').split(',')[0].trim(),
      coordinates: DEFAULT_COORDINATES,
      workMode: (i.workMode as any) || 'Hybrid',
      stipend: i.stipend || '₹25,000 / month',
      duration: i.duration || '3 Months',
      postedDate: i.postedDate ? new Date(i.postedDate).toLocaleDateString() : 'Recent',
      deadline: i.applicationDeadline || '2 weeks',
      requiredSkills: (i.internshipRequiredSkills_on_internship || []).map((s) => s.skill?.name || '').filter(Boolean),
      experienceLevel: 'Student / Fresher',
      isStartup: i.isStartupFriendly ?? true,
      description: (i as any).description || `Internship program at ${i.company?.name || 'TechNova Labs'}`,
      responsibilities: ((i as any).learningOutcomes as string[]) || ['Hands-on engineering projects'],
      perks: i.eligibleForConversion ? ['PPO Conversion Track'] : [],
    }));

    return { industryInternships, opportunities };
  } catch (err: any) {
    console.info('[DataConnect] Remote internships not available:', err?.message || err);
    return { industryInternships: [], opportunities: [] };
  }
}

/**
 * Sync a newly posted job to Data Connect.
 */
export async function syncNewJobToDataConnect(
  job: Omit<IndustryJob, 'id' | 'postedDate' | 'applicationsCount' | 'shortlistedCount' | 'strongMatchesCount'>,
  companyId: string = DEFAULT_DEMO_COMPANY_ID
): Promise<boolean> {
  if (!dataConnect) return false;

  try {
    await createJob(dataConnect, {
      companyId,
      title: job.title,
      department: job.department,
      location: job.location,
      workMode: job.workMode,
      jobType: job.jobType,
      salaryRange: job.salaryRange,
      experienceRequired: job.experienceRequired,
      education: job.education,
      graduationYear: job.graduationYear,
      minimumCgpa: job.minimumCgpa,
      description: job.description,
      responsibilities: job.responsibilities,
      qualifications: job.qualifications,
      openings: job.openings,
      status: job.status,
    });
    console.log('[DataConnect] Successfully persisted new Job:', job.title);
    return true;
  } catch (err: any) {
    console.warn('[DataConnect] Background Job sync notice:', err?.message || err);
    return false;
  }
}

/**
 * Sync a newly posted internship to Data Connect.
 */
export async function syncNewInternshipToDataConnect(
  internship: Omit<IndustryInternship, 'id' | 'postedDate' | 'applicationsCount' | 'shortlistedCount'>,
  companyId: string = DEFAULT_DEMO_COMPANY_ID
): Promise<boolean> {
  if (!dataConnect) return false;

  try {
    await createInternship(dataConnect, {
      companyId,
      title: internship.title,
      department: internship.department,
      location: internship.location,
      workMode: internship.workMode,
      duration: internship.duration,
      stipend: internship.stipend,
      eligibility: internship.eligibility,
      description: internship.description,
      learningOutcomes: internship.learningOutcomes,
      mentor: internship.mentor,
      openings: internship.openings,
      isStartupFriendly: internship.isStartupFriendly,
      targetAudience: internship.targetAudience,
      eligibleForConversion: internship.eligibleForConversion,
      status: internship.status,
    });
    console.log('[DataConnect] Successfully persisted new Internship:', internship.title);
    return true;
  } catch (err: any) {
    console.warn('[DataConnect] Background Internship sync notice:', err?.message || err);
    return false;
  }
}

/**
 * Sync candidate application to Data Connect.
 */
export async function syncApplicationToDataConnect(params: {
  companyId?: string;
  jobId?: string;
  internshipId?: string;
  title: string;
  jobType: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
}): Promise<boolean> {
  if (!dataConnect) return false;

  try {
    await createApplication(dataConnect, {
      companyId: params.companyId || DEFAULT_DEMO_COMPANY_ID,
      jobId: params.jobId,
      internshipId: params.internshipId,
      title: params.title,
      jobType: params.jobType,
      matchScore: Math.round(params.matchScore),
      matchedSkills: params.matchedSkills,
      missingSkills: params.missingSkills,
    });
    console.log('[DataConnect] Successfully persisted Application for:', params.title);
    return true;
  } catch (err: any) {
    console.warn('[DataConnect] Application sync notice:', err?.message || err);
    return false;
  }
}

/**
 * Map local ApplicationStage string to Data Connect GqlApplicationStage enum.
 */
function toGqlStage(stage: ApplicationStage): GqlApplicationStage {
  switch (stage) {
    case 'New Application':
      return GqlApplicationStage.NEW_APPLICATION;
    case 'Screening':
      return GqlApplicationStage.SCREENING;
    case 'Shortlisted':
      return GqlApplicationStage.SHORTLISTED;
    case 'Technical Interview':
      return GqlApplicationStage.TECHNICAL_INTERVIEW;
    case 'HR Interview':
      return GqlApplicationStage.HR_INTERVIEW;
    case 'Selected':
      return GqlApplicationStage.SELECTED;
    case 'Offer Sent':
      return GqlApplicationStage.OFFER_SENT;
    case 'Hired':
      return GqlApplicationStage.HIRED;
    case 'Rejected':
      return GqlApplicationStage.REJECTED;
    default:
      return GqlApplicationStage.NEW_APPLICATION;
  }
}

/**
 * Sync application stage update to Data Connect.
 */
export async function syncApplicationStageToDataConnect(
  applicationId: string,
  stage: ApplicationStage,
  note?: string
): Promise<boolean> {
  if (!dataConnect) return false;

  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(applicationId);
    if (!isUuid) return false;

    await updateApplicationStage(dataConnect, {
      id: applicationId,
      stage: toGqlStage(stage),
      note: note || `Moved to ${stage}`,
    });
    console.log(`[DataConnect] Stage updated to ${stage} for application:`, applicationId);
    return true;
  } catch (err: any) {
    console.warn('[DataConnect] Application stage sync notice:', err?.message || err);
    return false;
  }
}
