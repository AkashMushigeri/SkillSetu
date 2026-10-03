/**
 * src/lib/dataConnectService.ts
 * 
 * High-level service layer connecting React Contexts to Firebase Data Connect (PostgreSQL)
 * with TanStack Query optimistic updates, multi-device real-time sync, and resilient fallbacks.
 */

import { dataConnect } from '@/lib/firebase';
import {
  listJobs,
  listInternships,
  createJob,
  createInternship,
  getMyCompany,
  createApplication,
  updateApplicationStage,
  searchCandidates,
  listSkills,
  createSkill,
  upsertUserSkill,
  createOffer,
  createInterview,
  createCurriculumModule,
  createChallengeSubmission,
  ApplicationStage as GqlApplicationStage,
  OfferStatus as GqlOfferStatus,
  CurriculumStatus,
  SkillLevel as GqlSkillLevel,
} from '@skillsetu/dataconnect';
import {
  IndustryJob,
  IndustryInternship,
  ApplicationStage,
  Candidate,
  CandidateSkill,
  CandidateProject,
  CandidateEducation,
  SkillLevel,
  IndustryOffer,
  IndustryInterview,
  SuggestedCurriculumModule,
} from '@/types/industry';
import { Opportunity } from '@/types/student';
import { companyListingCoordinates } from '@/lib/opportunityLocation';
import { publishRealtimeNotification } from '@/lib/realtimeNotifications';

// Demo college rows are only used by the seed workflow.
export const DEFAULT_DEMO_COLLEGE_ID = '00000000-0000-0000-0000-000000000002';

async function getOwnedCompanyId(): Promise<string | null> {
  if (!dataConnect) return null;
  const { data } = await getMyCompany(dataConnect);
  return data.companies[0]?.id ?? null;
}

/**
 * Standard TanStack Query keys for Data Connect cache invalidation and queries.
 */
export const DC_QUERY_KEYS = {
  jobs: ['dc', 'jobs'] as const,
  internships: ['dc', 'internships'] as const,
  applications: ['dc', 'applications'] as const,
  candidates: ['dc', 'candidates'] as const,
  interviews: ['dc', 'interviews'] as const,
  offers: ['dc', 'offers'] as const,
  skills: ['dc', 'skills'] as const,
  challenges: ['dc', 'challenges'] as const,
};

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
      companyId: j.company?.id,
      dataConnectId: j.id,
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

    const opportunities: Opportunity[] = jobs.map((j) => {
      const coordinates = companyListingCoordinates(j.location, j.workMode, j.company?.location, j.company?.coordinates);
      return {
        id: `dc-${j.id}`,
        companyId: j.company?.id,
        dataConnectId: j.id,
        title: j.title,
        company: j.company?.name || 'TechNova Labs',
        type: 'Full-Time Job',
        location: j.location || 'Location not specified',
        city: (j.location || 'Location not specified').split(',')[0].trim(),
        coordinates,
        coordinateSource: coordinates ? 'company' : undefined,
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
      };
    });

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
      companyId: i.company?.id,
      dataConnectId: i.id,
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

    const opportunities: Opportunity[] = interns.map((i) => {
      const coordinates = companyListingCoordinates(i.location, i.workMode, i.company?.location, i.company?.coordinates);
      return {
        id: `dc-int-${i.id}`,
        companyId: i.company?.id,
        dataConnectId: i.id,
        title: i.title,
        company: i.company?.name || 'TechNova Labs',
        type: 'Internship',
        location: i.location || 'Location not specified',
        city: (i.location || 'Location not specified').split(',')[0].trim(),
        coordinates,
        coordinateSource: coordinates ? 'company' : undefined,
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
      };
    });

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
  companyId?: string
): Promise<{ id: string; companyId: string } | null> {
  if (!dataConnect) return null;

  try {
    const ownedCompanyId = companyId ?? await getOwnedCompanyId();
    if (!ownedCompanyId) return null;
    const { data } = await createJob(dataConnect, {
      companyId: ownedCompanyId,
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
    return { id: data.job_insert.id, companyId: ownedCompanyId };
  } catch (err: any) {
    console.warn('[DataConnect] Background Job sync notice:', err?.message || err);
    return null;
  }
}

/**
 * Sync a newly posted internship to Data Connect.
 */
export async function syncNewInternshipToDataConnect(
  internship: Omit<IndustryInternship, 'id' | 'postedDate' | 'applicationsCount' | 'shortlistedCount'>,
  companyId?: string
): Promise<{ id: string; companyId: string } | null> {
  if (!dataConnect) return null;

  try {
    const ownedCompanyId = companyId ?? await getOwnedCompanyId();
    if (!ownedCompanyId) return null;
    const { data } = await createInternship(dataConnect, {
      companyId: ownedCompanyId,
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
    return { id: data.internship_insert.id, companyId: ownedCompanyId };
  } catch (err: any) {
    console.warn('[DataConnect] Background Internship sync notice:', err?.message || err);
    return null;
  }
}

/**
 * Sync candidate application to Data Connect.
 */
export async function syncApplicationToDataConnect(params: {
  opportunityKey: string;
  companyId: string;
  opportunityId: string;
  opportunityType: 'job' | 'internship';
  jobId?: string;
  internshipId?: string;
  title: string;
  jobType: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
}): Promise<boolean> {
  if (!dataConnect || !params.companyId || !params.opportunityId) return false;

  try {
    const safeMatchScore = Number.isFinite(params.matchScore)
      ? Math.min(100, Math.max(0, Math.round(params.matchScore)))
      : 0;
    await createApplication(dataConnect, {
      companyId: params.companyId,
      opportunityId: params.opportunityId,
      opportunityType: params.opportunityType,
      opportunityKey: params.opportunityKey,
      jobId: params.jobId,
      internshipId: params.internshipId,
      title: params.title,
      jobType: params.jobType,
      matchScore: safeMatchScore,
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
 * Map local Offer status string to Data Connect OfferStatus enum value.
 * Local: 'Draft' | 'Sent' | 'Accepted' | 'Declined'
 * GQL:   DRAFT | SENT | ACCEPTED | DECLINED
 */
function mapOfferStatus(status: IndustryOffer['status']): GqlOfferStatus {
  switch (status) {
    case 'Draft':
      return GqlOfferStatus.DRAFT;
    case 'Sent':
      return GqlOfferStatus.SENT;
    case 'Accepted':
      return GqlOfferStatus.ACCEPTED;
    case 'Declined':
      return GqlOfferStatus.DECLINED;
    default:
      return GqlOfferStatus.DRAFT;
  }
}

/**
 * Map local SkillLevel to Data Connect GraphQL SkillLevel enum.
 * Local: 'Basic' | 'Intermediate' | 'Advanced'
 * GQL:   BASIC | INTERMEDIATE | ADVANCED
 */
function mapSkillLevel(level: SkillLevel): GqlSkillLevel {
  switch (level) {
    case 'Basic':
      return GqlSkillLevel.BASIC;
    case 'Intermediate':
      return GqlSkillLevel.INTERMEDIATE;
    case 'Advanced':
      return GqlSkillLevel.ADVANCED;
    default:
      return GqlSkillLevel.INTERMEDIATE;
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

/**
 * Fetch remote candidates from Firebase Data Connect.
 */
export async function fetchRemoteCandidates(skillNames?: string[]): Promise<Candidate[]> {
  if (!dataConnect) {
    return [];
  }

  try {
    const vars = skillNames && skillNames.length > 0 ? { skillNames } : undefined;
    const res = await searchCandidates(dataConnect, vars);
    const dcCandidates = res.data?.candidates || [];

    return dcCandidates.map((c) => {
      const mapDcSkillLevel = (level: string): SkillLevel => {
        switch (level) {
          case 'BASIC': return 'Basic';
          case 'INTERMEDIATE': return 'Intermediate';
          case 'ADVANCED': return 'Advanced';
          default: return 'Intermediate';
        }
      };

      const skills: CandidateSkill[] = (c.filteredSkills || []).map((s) => ({
        name: s.skill?.name || 'General Engineering',
        level: mapDcSkillLevel(s.level),
        verified: s.verified || false,
        score: s.score ?? undefined,
      }));

      const projects: CandidateProject[] = (c.candidateProjects_on_user || []).map((p) => ({
        title: p.title,
        description: p.description || '',
        technologies: p.technologies || [],
        githubUrl: p.githubUrl || undefined,
        liveUrl: p.liveUrl || undefined,
      }));

      const educationRows = c.candidateEducations_on_user || [];
      const primaryRow = educationRows.find((row) => row.profileOwnerUid === c.uid)
        || [...educationRows].sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
      const primaryEdu: CandidateEducation | undefined = primaryRow && {
        degree: primaryRow.degree || 'Engineering',
        department: primaryRow.department || 'General',
        college: primaryRow.college || 'Unknown',
        graduationYear: primaryRow.graduationYear ?? new Date().getFullYear(),
        cgpa: primaryRow.cgpa ?? 0,
        currentYear: primaryRow.currentYear ?? 'Current',
      };

      const role = skills.length > 0
        ? `${skills[0].name} Developer`
        : primaryEdu?.degree
        ? `${primaryEdu.degree} Student`
        : 'Candidate';

      return {
        id: c.uid,
        name: c.displayName,
        avatar: c.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.displayName)}&background=0D828D&color=fff`,
        email: c.email,
        phone: '',
        location: c.location || 'Bengaluru, Karnataka',
        college: primaryEdu?.college || c.college || 'Partner College',
        education: primaryEdu
          ? {
              degree: primaryEdu.degree,
              department: primaryEdu.department,
              college: primaryEdu.college,
              graduationYear: primaryEdu.graduationYear || new Date().getFullYear() + 1,
              cgpa: primaryEdu.cgpa || 8.0,
              currentYear: primaryEdu.currentYear || '3rd Year',
            }
          : {
              degree: 'B.Tech / B.E.',
              department: 'Engineering',
              college: c.college || 'Partner College',
              graduationYear: new Date().getFullYear() + 1,
              cgpa: 8.0,
              currentYear: '3rd Year',
            },
        role,
        availability: 'Available Immediately',
        skills,
        projects,
        experience: [],
        certifications: [],
        achievements: [],
        resumeText: '',
        savedToTalentPool: false,
      };
    });
  } catch (err: any) {
    console.info('[DataConnect] Remote candidates not available (using local/mock data):', err?.message || err);
    return [];
  }
}

/**
 * Sync a candidate's skill to Data Connect.
 */
export async function syncCandidateSkillToDataConnect(
  userUid: string,
  skillName: string,
  level: SkillLevel
): Promise<boolean> {
  if (!dataConnect) return false;

  try {
    const skillsRes = await listSkills(dataConnect);
    const skills = skillsRes.data?.skills || [];
    let skillId = skills.find((s) => s.name.toLowerCase() === skillName.toLowerCase())?.id;

    if (!skillId) {
      const createRes = await createSkill(dataConnect, {
        name: skillName,
        category: 'Technical',
      });
      skillId = createRes.data?.skill_insert?.id;
      console.log(`[DataConnect] Created new skill: ${skillName}`);
    }

    if (skillId) {
      // upsertUserSkill only accepts skillId and level. Verification metadata
      // (verified/score/verificationDate) is not part of this mutation, so
      // passing it made the whole call throw and the sync silently no-op'd.
      // Verification state is persisted on the Firestore profile instead.
      await upsertUserSkill(dataConnect, {
        skillId,
        level: mapSkillLevel(level),
      });
      console.log(`[DataConnect] Synced skill ${skillName} for user ${userUid}`);
      return true;
    }

    return false;
  } catch (err: any) {
    console.warn('[DataConnect] Candidate skill sync notice:', err?.message || err);
    return false;
  }
}

/**
 * Sync a generated Offer Letter to Data Connect.
 */
export async function syncNewOfferToDataConnect(
  offer: IndustryOffer,
  candidateUid: string = 'aarav-sharma-rvce'
): Promise<boolean> {
  if (!dataConnect) return false;

  try {
    const companyId = await getOwnedCompanyId();
    if (!companyId) return false;
    await createOffer(dataConnect, {
      candidateUid,
      companyId,
      jobOrInternshipId: offer.jobOrInternshipId,
      roleTitle: offer.roleTitle,
      type: offer.type,
      department: offer.department,
      location: offer.location,
      workMode: offer.workMode,
      compensation: offer.compensation,
      baseFixed: offer.breakdown?.baseFixed,
      variableBonus: offer.breakdown?.variableBonus,
      retentionJoiningBonus: offer.breakdown?.retentionJoiningBonus,
      benefitsSummary: offer.breakdown?.benefitsSummary,
      status: mapOfferStatus(offer.status),
      authorizedSignatory: offer.authorizedSignatory,
      signatoryTitle: offer.signatoryTitle,
    });
    console.log('[DataConnect] Persisted Offer Letter for role:', offer.roleTitle);
    return true;
  } catch (err: any) {
    console.warn('[DataConnect] Offer sync notice:', err?.message || err);
    return false;
  }
}

/**
 * Sync a scheduled Interview to Data Connect.
 */
export async function syncInterviewToDataConnect(
  interview: IndustryInterview,
  companyId: string | undefined,
  candidateUid: string = 'aarav-sharma-rvce'
): Promise<boolean> {
  if (!dataConnect) return false;

  try {
    const ownedCompanyId = companyId ?? await getOwnedCompanyId();
    if (!ownedCompanyId) return false;
    await createInterview(dataConnect, {
      candidateUid,
      companyId: ownedCompanyId,
      title: interview.jobTitle,
      round: interview.round,
      date: new Date(interview.date).toISOString(),
      time: interview.time,
      mode: interview.mode,
      meetingLink: interview.meetingLink,
      interviewers: interview.interviewers,
      notes: interview.notes,
    });
    console.log('[DataConnect] Persisted Scheduled Interview:', interview.jobTitle);
    return true;
  } catch (err: any) {
    console.warn('[DataConnect] Interview sync notice:', err?.message || err);
    return false;
  }
}

/**
 * Map a local CurriculumModule status to the Data Connect GraphQL enum.
 * Local: 'Adopted' | 'In Review' | 'Pending Senate Approval'
 * GQL:   ADOPTED | IN_REVIEW | PENDING_SENATE_APPROVAL
 */
function mapCurriculumStatus(
  status: SuggestedCurriculumModule['status']
): CurriculumStatus {
  switch (status) {
    case 'Adopted':
      return CurriculumStatus.ADOPTED;
    case 'In Review':
      return CurriculumStatus.IN_REVIEW;
    case 'Pending Senate Approval':
      return CurriculumStatus.PENDING_SENATE_APPROVAL;
    default:
      return CurriculumStatus.IN_REVIEW;
  }
}

/**
 * Sync a Proposed Curriculum Module to Data Connect.
 */
export async function syncCurriculumModuleToDataConnect(
  collegeId: string = DEFAULT_DEMO_COLLEGE_ID,
  companyId: string | undefined,
  module: SuggestedCurriculumModule
): Promise<boolean> {
  if (!dataConnect) return false;

  try {
    const ownedCompanyId = companyId ?? await getOwnedCompanyId();
    if (!ownedCompanyId) return false;
    await createCurriculumModule(dataConnect, {
      collegeCompanyCollegeId: collegeId,
      collegeCompanyCompanyId: ownedCompanyId,
      semester: module.semester,
      currentSubject: module.currentSubject,
      industryRecommendation: module.industryRecommendation,
      recommendedTechnologies: module.recommendedTechnologies,
      rationale: module.rationale,
      status: mapCurriculumStatus(module.status),
    });
    console.log('[DataConnect] Persisted Curriculum Advisory Module:', module.currentSubject);
    return true;
  } catch (err: any) {
    console.warn('[DataConnect] Curriculum Module sync notice:', err?.message || err);
    return false;
  }
}

/**
 * Sync a Challenge Submission to Data Connect.
 */
export async function syncChallengeSubmissionToDataConnect(
  challengeId: string,
  teamName: string,
  githubUrl: string,
  liveDemoUrl?: string,
  skillsDemonstrated: string[] = ['Full Stack', 'Cloud']
): Promise<boolean> {
  if (!dataConnect) return false;

  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(challengeId);
    if (!isUuid) return false;

    await createChallengeSubmission(dataConnect, {
      challengeId,
      teamName,
      githubUrl,
      liveDemoUrl,
      skillsDemonstrated,
    });
    console.log('[DataConnect] Persisted Challenge Submission:', teamName);
    return true;
  } catch (err: any) {
    console.warn('[DataConnect] Challenge Submission sync notice:', err?.message || err);
    return false;
  }
}

// ------------------------------------------------------------------
// Optimistic UI Mutation Helpers with Real-Time Notification Broadcast
// ------------------------------------------------------------------

/**
 * Optimistically apply to an opportunity:
 * 1. Executes optimistic local state mutation immediately.
 * 2. Broadcasts real-time notification across all devices and sectors.
 * 3. Persists to Data Connect PostgreSQL in the background.
 */
export async function optimisticApplyToOpportunity(
  applyLocalFn: () => boolean,
  opportunity: Opportunity,
  studentName: string = 'Aarav Sharma',
  matchScore: number = 88
): Promise<boolean> {
  const success = applyLocalFn();
  if (!success) return false;

  // Broadcast real-time notification to Industry recruiters
  publishRealtimeNotification({
    target: 'industry',
    type: 'application',
    title: 'New Candidate Application',
    message: `${studentName} applied for "${opportunity.title}" (${matchScore}% Match)`,
    link: '/industry/pipeline',
    read: false,
    meta: {
      opportunityId: opportunity.id,
      studentName,
      matchScore: String(matchScore),
    },
  });

  // Background Data Connect PostgreSQL mutation
  if (opportunity.companyId && opportunity.dataConnectId) {
    syncApplicationToDataConnect({
      opportunityKey: `${opportunity.type === 'Internship' ? 'dc-int' : 'dc'}-${opportunity.dataConnectId}`,
      companyId: opportunity.companyId,
      opportunityId: opportunity.dataConnectId,
      opportunityType: opportunity.type === 'Internship' ? 'internship' : 'job',
      jobId: opportunity.type === 'Internship' ? undefined : opportunity.dataConnectId,
      internshipId: opportunity.type === 'Internship' ? opportunity.dataConnectId : undefined,
      title: opportunity.title,
      jobType: opportunity.type,
      matchScore,
      matchedSkills: (opportunity.requiredSkills || []).slice(0, 3),
      missingSkills: [],
    });
  }

  return true;
}

/**
 * Optimistically update an application stage in the Kanban pipeline:
 * 1. Executes optimistic local Kanban card movement immediately.
 * 2. Broadcasts real-time notification to the student portal.
 * 3. Persists to Data Connect PostgreSQL in the background.
 */
export async function optimisticUpdateApplicationStage(
  updateLocalFn: () => void,
  applicationId: string,
  stage: ApplicationStage,
  candidateName: string,
  jobTitle: string
): Promise<void> {
  // 1. Optimistic UI update
  updateLocalFn();

  // 2. Broadcast push notification to student
  const stageNoticeMap: Partial<Record<ApplicationStage, string>> = {
    'Shortlisted': `Congratulations! Your application for "${jobTitle}" was Shortlisted by TechNova Labs.`,
    'Technical Interview': `Interview Invitation: Technical Round scheduled for "${jobTitle}".`,
    'HR Interview': `Interview Invitation: HR & Culture Round scheduled for "${jobTitle}".`,
    'Selected': `🎉 You have been Selected for "${jobTitle}"! Offer generation in progress.`,
    'Offer Sent': `📜 Official Offer Letter Sent for "${jobTitle}"! Review compensation package.`,
    'Hired': `🎉 Welcome aboard! You are formally Hired for "${jobTitle}".`,
  };

  const message = stageNoticeMap[stage] || `Application status for "${jobTitle}" updated to ${stage}.`;

  publishRealtimeNotification({
    target: 'student',
    type: stage === 'Offer Sent' ? 'offer' : stage.includes('Interview') ? 'interview' : 'application',
    title: `Application Update: ${stage}`,
    message,
    link: '/student/applications',
    read: false,
    meta: {
      applicationId,
      stage,
      jobTitle,
      candidateName,
    },
  });

  // 3. Background Data Connect PostgreSQL sync
  syncApplicationStageToDataConnect(applicationId, stage);
}
