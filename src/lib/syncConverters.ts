/**
 * syncConverters.ts
 * ------------------------------------------------------------------
 * Type-safe conversions between the three sector domain models.
 * These functions map records that travel across the sync bridge from
 * one portal's shape into another portal's shape. Each conversion is
 * defensive: unknown / missing fields fall back to safe defaults so a
 * malformed record can never crash a consumer.
 * ------------------------------------------------------------------
 */

import type { Opportunity, Application, NotificationItem } from '@/types/student';
import type {
  IndustryJob,
  IndustryInternship,
  IndustryApplication,
  IndustryOffer,
  IndustryChallenge,
  ApplicationStage,
} from '@/types/industry';
import type {
  InternshipOpportunity,
  PlacementDrive,
  CollegeStudent,
} from '@/types/college';
import {
  SYNC_DOMAINS,
  readSyncRecords,
  writeSyncRecord,
  publishNotification,
  SyncNotification,
} from './syncBridge';

/* ------------------------------------------------------------------ */
/* Identifier coherence                                                 */
/* ------------------------------------------------------------------ */

/**
 * The demo student has different emails across mock files. Normalize to a
 * single canonical identity so cross-sector lookups match.
 */
export const STUDENT_EMAILS = new Set([
  'aarav.sharma@rvce.edu.in',
  'aarav.sharma@ayushcollege.edu',
]);

export function isAaravEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  const e = email.trim().toLowerCase();
  return STUDENT_EMAILS.has(e);
}

/* ------------------------------------------------------------------ */
/* Industry -> Student (opportunities)                                  */
/* ------------------------------------------------------------------ */

function workMode(s: string | undefined): Opportunity['workMode'] {
  if (s === 'Remote' || s === 'Hybrid' || s === 'On-site') return s;
  return 'Hybrid';
}

function oppTypeForJob(job: IndustryJob): Opportunity['type'] {
  if (job.jobType === 'Contract' || job.jobType === 'Part Time') return 'Part-Time Job';
  return 'Full-Time Job';
}

/**
 * Map an industry internship into a student-side opportunity.
 */
export function industryInternshipToOpportunity(internship: IndustryInternship): Opportunity {
  const city = (internship.location || 'Bengaluru').split(',')[0].trim();
  return {
    id: `sync-int-${internship.id}`,
    title: internship.title || 'Internship',
    company: internship.company || 'TechNova Labs',
    type: 'Internship',
    location: internship.location || 'Bengaluru, Karnataka',
    city,
    coordinates: { lat: 12.9716, lng: 77.5946 },
    workMode: workMode(internship.workMode),
    stipend: internship.stipend || 'Unpaid',
    duration: internship.duration || '3 Months',
    postedDate: internship.postedDate || 'Today',
    deadline: internship.applicationDeadline || '30 days',
    requiredSkills: (internship.requiredSkills || []).map((s) => s.name),
    experienceLevel: internship.targetAudience || internship.eligibility || 'Student / Fresher',
    isStartup: internship.isStartupFriendly === true,
    description: internship.description || '',
    responsibilities: internship.learningOutcomes || [],
    perks: internship.eligibleForConversion ? ['Internship-to-Full-Time (PPO) conversion track'] : [],
  };
}

/**
 * Map an industry job into a student-side opportunity (surfaced as a
 * full/part-time job).
 */
export function industryJobToOpportunity(job: IndustryJob): Opportunity {
  const city = (job.location || 'Bengaluru').split(',')[0].trim();
  return {
    id: `sync-job-${job.id}`,
    title: job.title || 'Job Opening',
    company: job.company || 'TechNova Labs',
    type: oppTypeForJob(job),
    location: job.location || 'Bengaluru, Karnataka',
    city,
    coordinates: { lat: 12.9716, lng: 77.5946 },
    workMode: workMode(job.workMode),
    stipend: job.salaryRange || 'Competitive',
    duration: 'Full-Time',
    postedDate: job.postedDate || 'Today',
    deadline: job.deadline || '30 days',
    requiredSkills: (job.requiredSkills || []).map((s) => s.name),
    experienceLevel: job.experienceRequired || 'Student / Fresher',
    isStartup: !!(job.company && job.company.toLowerCase().includes('labs')),
    description: job.description || '',
    responsibilities: job.responsibilities || [],
    perks: [],
  };
}

/**
 * Map an industry challenge into a student-side micro-internship.
 */
export function industryChallengeToOpportunity(challenge: IndustryChallenge): Opportunity {
  return {
    id: `sync-chal-${challenge.id}`,
    title: `${challenge.title} (Challenge)`,
    company: 'Industry Challenge',
    type: 'Industry Challenge',
    location: 'Remote',
    city: 'Remote',
    coordinates: { lat: 12.9716, lng: 77.5946 },
    workMode: 'Remote',
    stipend: challenge.prize || 'Cash Prize',
    duration: 'Challenge Sprint',
    postedDate: challenge.createdDate || 'Recently',
    deadline: challenge.deadline || '30 days',
    requiredSkills: challenge.requiredSkills || [],
    experienceLevel: challenge.difficulty || 'Intermediate',
    isStartup: true,
    description: challenge.description || challenge.problemStatement || '',
    responsibilities: [
      challenge.submissionRequirements || 'Submit a working solution',
      `Team size: ${challenge.teamSize || '1-4 students'}`,
      `Open to: ${challenge.collegeParticipation || 'Partner colleges'}`,
    ],
    perks: [challenge.prize || 'Winner recognition'],
  };
}

/* ------------------------------------------------------------------ */
/* Student -> Industry (applications + readiness)                      */
/* ------------------------------------------------------------------ */

export function studentApplicationToIndustry(
  app: Application
): Pick<IndustryApplication, 'id' | 'candidateId' | 'candidateName' | 'candidateAvatar' | 'candidateEmail' | 'candidateCollege' | 'jobId' | 'jobTitle' | 'jobType' | 'matchScore' | 'appliedDate' | 'stage' | 'recruiterNotes' | 'history' | 'matchedSkills' | 'missingSkills'> {
  return {
    id: `sync-app-${app.id}`,
    candidateId: 'sync-cand-student',
    candidateName: 'Aarav Sharma',
    candidateAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    candidateEmail: 'aarav.sharma@rvce.edu.in',
    candidateCollege: 'RV College of Engineering, Bengaluru',
    jobId: `sync-opp-${app.opportunityId}`,
    jobTitle: app.opportunityTitle || 'Opportunity',
    jobType: app.type === 'Internship' || app.type === 'Micro-Internship' ? 'Internship' : 'Job',
    matchScore: app.matchScoreAtApply || 0,
    appliedDate: app.appliedDate || new Date().toLocaleDateString(),
    stage: 'New Application',
    recruiterNotes: 'Submitted from the Student Portal (SkillSetu Student Experience Module).',
    history: [
      {
        stage: 'New Application',
        date: app.appliedDate || new Date().toLocaleString(),
        updatedBy: 'System Auto-Parser (Student Portal)',
      },
    ],
    matchedSkills: [],
    missingSkills: [],
  };
}

/* ------------------------------------------------------------------ */
/* Industry -> Student (application updates)                            */
/* ------------------------------------------------------------------ */

const INDUSTRY_STAGE_TO_STUDENT_STATUS: Record<string, Application['status']> = {
  'New Application': 'Under Review',
  Screening: 'Under Review',
  Shortlisted: 'Shortlisted',
  'Technical Interview': 'Shortlisted',
  'HR Interview': 'Shortlisted',
  Selected: 'Shortlisted',
  'Offer Sent': 'Shortlisted',
  Hired: 'Shortlisted',
  Rejected: 'Rejected',
};

export function industryStageToStudentStatus(stage: string): Application['status'] {
  return INDUSTRY_STAGE_TO_STUDENT_STATUS[stage] || 'Under Review';
}

/**
 * Merge a student's local application with a fresher industry-side stage
 * update (matched by opportunity title + candidate identity).
 */
export function mergeIndustryStageIntoStudentApplication(
  local: Application,
  industryApp: Pick<IndustryApplication, 'jobTitle' | 'stage'>,
): Application {
  return {
    ...local,
    status: industryStageToStudentStatus(industryApp.stage) || local.status,
  };
}

/* ------------------------------------------------------------------ */
/* Industry -> College (placements + internships)                       */
/* ------------------------------------------------------------------ */

/**
 * A placement drive created from an industry offer accepted for our
 * demo student (or any offer whose candidate email matches a college
 * student). Falls back to a generic "Recruitment Drive".
 */
export function industryOfferToPlacement(offer: IndustryOffer): PlacementDrive {
  const isInternship = offer.type === 'Summer Internship';
  return {
    id: `sync-placement-${offer.id}`,
    company: 'TechNova Labs',
    role: offer.roleTitle || 'Role',
    date: offer.joiningDate || offer.generatedDate || 'TBD',
    eligibleDepts: ['CSE', 'AIML'],
    minCgpa: 7,
    skillsRequired: [],
    packageOffer: offer.compensation || 'As per company policy',
    status: 'Upcoming',
    eligibleCount: 126,
    appliedCount: 0,
    shortlistedCount: 0,
    interviewCount: 0,
    selectedCount: 0,
    ...(isInternship ? { role: `${offer.roleTitle || 'Internship'} (Internship)` } : {}),
  };
}

/**
 * Map industry internship list into college-side internship opportunities.
 */
export function industryInternshipToCollege(
  internship: IndustryInternship
): InternshipOpportunity {
  return {
    id: `sync-int-${internship.id}`,
    company: internship.company || 'TechNova Labs',
    role: internship.title || 'Internship',
    skillsRequired: (internship.requiredSkills || []).map((s) => s.name),
    location: internship.location || 'Bengaluru, Karnataka',
    mode: workMode(internship.workMode),
    stipend: internship.stipend || 'Unpaid',
    duration: internship.duration || '3 Months',
    eligibleStudentsCount: internship.openings ? internship.openings * 25 : 42,
    applicationsCount: internship.applicationsCount || 0,
    status: internship.status === 'Active' ? 'Active' : internship.status === 'Closed' ? 'Filled' : 'Closing Soon',
    isStartup: internship.isStartupFriendly === true,
    recommendedForThirdYear: true,
  };
}

/* ------------------------------------------------------------------ */
/* College -> Industry (training signals)                               */
/* ------------------------------------------------------------------ */

export interface CollegeTrainingSignal {
  id: string;
  programName: string;
  skill: string;
  level: 'Basic' | 'Intermediate' | 'Advanced';
  instructor: string;
  startDate: string;
  endDate: string;
  enrolledStudents: number;
  industryPartner?: string;
}

export function collegeTrainingToSignal(training: {
  id: string;
  name: string;
  skill: string;
  skillLevel: 'Basic' | 'Intermediate' | 'Advanced';
  instructor: string;
  startDate: string;
  endDate: string;
  enrolledStudents: number;
  industryPartner?: string;
}): CollegeTrainingSignal {
  return {
    id: training.id,
    programName: training.name,
    skill: training.skill,
    level: training.skillLevel,
    instructor: training.instructor,
    startDate: training.startDate,
    endDate: training.endDate,
    enrolledStudents: training.enrolledStudents,
    industryPartner: training.industryPartner,
  };
}

/* ------------------------------------------------------------------ */
/* High-level publish helpers                                          */
/* ------------------------------------------------------------------ */

/**
 * Publish a student's new application so the industry portal can see it.
 */
export function publishStudentApplication(
  app: Application,
  opportunity: Pick<Opportunity, 'id' | 'title' | 'company'> | undefined
): void {
  const industryApp = studentApplicationToIndustry(app);
  writeSyncRecord(SYNC_DOMAINS.STUDENT_APPLICATIONS, industryApp, {
    from: 'student',
    correlationId: `app-${app.opportunityId}`,
  });
  if (opportunity) {
    publishNotification({
      id: `notif-sync-app-${Date.now()}`,
      target: 'industry',
      type: 'application',
      title: 'New Student Application',
      message: `${industryApp.candidateName} applied to "${opportunity.title}" at ${opportunity.company} from the Student Portal.`,
      time: 'Just now',
      read: false,
      link: '/industry/applications',
      meta: { opportunityId: opportunity.id },
    });
  }
}

/**
 * Publish industry opportunities (jobs/internships/challenges) so the
 * student portal can surface them as matched opportunities, and college
 * portal can surface internships.
 */
export function publishIndustryOpportunities(opts: {
  jobs?: IndustryJob[];
  internships?: IndustryInternship[];
  challenges?: IndustryChallenge[];
}): void {
  if (opts.jobs) {
    for (const job of opts.jobs) {
      const opp = industryJobToOpportunity(job);
      writeSyncRecord(SYNC_DOMAINS.INDUSTRY_JOBS, opp, {
        from: 'industry',
        correlationId: `job-${job.id}`,
      });
    }
  }
  if (opts.internships) {
    for (const intern of opts.internships) {
      const opp = industryInternshipToOpportunity(intern);
      writeSyncRecord(SYNC_DOMAINS.INDUSTRY_INTERNSHIPS, opp, {
        from: 'industry',
        correlationId: `intern-${intern.id}`,
      });
      // College-facing internship record as well
      writeSyncRecord(SYNC_DOMAINS.INDUSTRY_INTERNSHIPS, {
        __college: true,
        ...industryInternshipToCollege(intern),
      } as never, {
        from: 'industry',
        correlationId: `college-intern-${intern.id}`,
      });
    }
  }
  if (opts.challenges) {
    for (const chal of opts.challenges) {
      const opp = industryChallengeToOpportunity(chal);
      writeSyncRecord(SYNC_DOMAINS.CHALLENGES, opp, {
        from: 'industry',
        correlationId: `chal-${chal.id}`,
      });
    }
  }
}

/**
 * Publish a stage update for a student's application (industry side).
 */
export function publishApplicationStageUpdate(
  industryApp: Pick<IndustryApplication, 'id' | 'jobTitle' | 'stage'>,
  candidateEmail?: string
): void {
  writeSyncRecord(
    SYNC_DOMAINS.APPLICATION_UPDATES,
    { id: industryApp.id, jobTitle: industryApp.jobTitle, stage: industryApp.stage },
    { from: 'industry', correlationId: `app-update-${industryApp.id}` }
  );
  if (isAaravEmail(candidateEmail)) {
    publishNotification({
      id: `notif-sync-stage-${Date.now()}`,
      target: 'student',
      type: 'shortlist',
      title: 'Application Update',
      message: `Your application for "${industryApp.jobTitle}" moved to "${industryApp.stage}".`,
      time: 'Just now',
      read: false,
      link: '/student/applications',
      meta: { jobTitle: industryApp.jobTitle, stage: industryApp.stage },
    });
  }
}

/**
 * Publish an accepted offer to the college portal as a placement and
 * notify the student.
 */
export function publishAcceptedOffer(offer: IndustryOffer): void {
  const placement = industryOfferToPlacement(offer);
  writeSyncRecord(SYNC_DOMAINS.PLACEMENTS, placement, {
    from: 'industry',
    correlationId: `placement-${offer.id}`,
  });
  if (isAaravEmail(offer.candidateEmail)) {
    publishNotification({
      id: `notif-sync-offer-${Date.now()}`,
      target: 'student',
      type: 'offer',
      title: 'Offer Accepted 🎉',
      message: `Your offer for "${offer.roleTitle}" at ${offer.candidateEmail ? 'TechNova Labs' : 'TechNova Labs'} has been accepted. Your placement record is being updated.`,
      time: 'Just now',
      read: false,
      link: '/student/applications',
      meta: { role: offer.roleTitle, comp: offer.compensation },
    });
  }
  publishNotification({
    id: `notif-sync-placement-${Date.now()}`,
    target: 'college',
    type: 'placement',
    title: 'New Placement Record',
    message: `${offer.candidateName || 'A candidate'} accepted ${offer.roleTitle || 'an offer'} at TechNova Labs.`,
    time: 'Just now',
    read: false,
    link: '/college/placements',
    meta: { role: offer.roleTitle || '', company: 'TechNova Labs' },
  });
}

/**
 * Merge inbound sync notifications into a local notification feed.
 */
export function mergeSyncNotifications(
  local: NotificationItem[],
  inbound: SyncNotification[]
): NotificationItem[] {
  const items: NotificationItem[] = inbound
    .filter((n) => n && typeof n === 'object' && n.id)
    .map((n) => ({
      id: n.id,
      title: n.title,
      message: n.message,
      time: n.time,
      read: !!n.read,
      type: mapSyncNotifType(n.type),
      link: n.link,
    }));

  const map = new Map<string, NotificationItem>();
  for (const item of local) map.set(item.id, item);
  for (const item of items) map.set(item.id, item);
  return Array.from(map.values());
}

function mapSyncNotifType(t: SyncNotification['type']): NotificationItem['type'] {
  switch (t) {
    case 'application':
    case 'shortlist':
    case 'offer':
    case 'challenge':
    case 'placement':
      return 'opportunity';
    case 'interview':
      return 'assessment';
    case 'training':
      return 'profile';
    default:
      return 'system';
  }
}

/* ------------------------------------------------------------------ */
/* Read helpers for each sector                                        */
/* ------------------------------------------------------------------ */

export function readStudentOpportunitiesFromIndustry(): Opportunity[] {
  const jobs = readSyncRecords<Opportunity>(SYNC_DOMAINS.INDUSTRY_JOBS);
  const internships = readSyncRecords<Opportunity>(SYNC_DOMAINS.INDUSTRY_INTERNSHIPS).filter(
    (o) => !(o as Opportunity & { __college?: boolean }).__college
  );
  const challenges = readSyncRecords<Opportunity>(SYNC_DOMAINS.CHALLENGES);
  return [...jobs, ...internships, ...challenges];
}

export function readCollegeInternshipsFromIndustry(): InternshipOpportunity[] {
  return readSyncRecords<InternshipOpportunity & { __college?: boolean }>(
    SYNC_DOMAINS.INDUSTRY_INTERNSHIPS
  )
    .filter((r) => (r as { __college?: boolean }).__college === true)
    .map(({ __college: _c, ...rest }) => rest);
}

export function readIndustryApplicationsFromStudents(): Array<
  Pick<IndustryApplication, 'id' | 'candidateId' | 'candidateName' | 'candidateAvatar' | 'candidateEmail' | 'candidateCollege' | 'jobId' | 'jobTitle' | 'jobType' | 'matchScore' | 'appliedDate' | 'stage' | 'recruiterNotes' | 'history' | 'matchedSkills' | 'missingSkills'>
> {
  return readSyncRecords(SYNC_DOMAINS.STUDENT_APPLICATIONS);
}

export function readPlacementsFromIndustry(): PlacementDrive[] {
  return readSyncRecords<PlacementDrive>(SYNC_DOMAINS.PLACEMENTS);
}

export function readApplicationUpdatesFromIndustry(): Array<{
  id: string;
  jobTitle: string;
  stage: string;
}> {
  return readSyncRecords<{ id: string; jobTitle: string; stage: string }>(
    SYNC_DOMAINS.APPLICATION_UPDATES
  );
}

export function readTrainingSignalsFromCollege(): CollegeTrainingSignal[] {
  return readSyncRecords<CollegeTrainingSignal>(SYNC_DOMAINS.COLLEGE_TRAINING);
}

/**
 * Update a college student's placement status from industry offers.
 * Returns a new students array.
 */
export function applyPlacementsToCollegeStudents(
  students: CollegeStudent[],
  placements: PlacementDrive[]
): CollegeStudent[] {
  if (!placements.length) return students;
  return students.map((s) => {
    if (s.name === 'Aarav Sharma') {
      const matching = placements.find((p) => p.role.toLowerCase().includes('engineer') || p.role.toLowerCase().includes('intern'));
      if (matching) {
        return {
          ...s,
          placementStatus: 'Placed',
          companyPlaced: matching.company || 'TechNova Labs',
          offerPackage: matching.packageOffer,
        };
      }
    }
    return s;
  });
}