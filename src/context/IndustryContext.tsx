'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Candidate,
  IndustryJob,
  IndustryInternship,
  IndustryApplication,
  IndustryInterview,
  CollegePartner,
  IndustryChallenge,
  CompanyProfile,
  HiringPreferences,
  ApplicationStage,
  ChallengeSubmission,
  IndustryOffer,
  CollegeMoU,
  SuggestedCurriculumModule,
} from '@/types/industry';
import { defaultCompanyProfile, defaultHiringPreferences } from '@/data/industry/industryCompanies';
import { calculateCandidateMatch } from '@/lib/industryMatching';
import { useAuth } from '@/context/AuthContext';
import {
  industryJobs,
  industryInternships,
  industryApplications,
  interviews as interviewsApi,
  offers as offersApi,
  challenges as challengesApi,
  hiring,
  companyProfile,
  opportunities,
} from '@/lib/domainApi';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export interface IndustryNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'match' | 'application' | 'partnership' | 'pipeline' | 'challenge';
}

interface IndustryContextType {
  company: CompanyProfile;
  preferences: HiringPreferences;
  jobs: IndustryJob[];
  internships: IndustryInternship[];
  candidates: Candidate[];
  applications: IndustryApplication[];
  interviews: IndustryInterview[];
  colleges: CollegePartner[];
  challenges: IndustryChallenge[];
  submissions: ChallengeSubmission[];
  offers: IndustryOffer[];
  collegeMous: CollegeMoU[];
  notifications: IndustryNotification[];
  toasts: ToastMessage[];
  searchRadiusKm: number;
  setSearchRadiusKm: (radius: number) => void;

  // Actions
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
  markNotificationsAsRead: () => void;
  refresh: () => Promise<void>;
  
  // Candidate & Talent Pool Actions
  toggleSaveCandidate: (candidateId: string, category?: Candidate['talentPoolCategory']) => Promise<void>;
  shortlistCandidateForJob: (candidateId: string, jobId: string, jobTitle: string, jobType?: 'Job' | 'Internship') => Promise<void>;
  
  // Pipeline & Application Actions
  moveApplicationStage: (applicationId: string, nextStage: ApplicationStage, note?: string) => Promise<void>;
  rejectApplication: (applicationId: string, reason?: string) => Promise<void>;
  
  // Job & Internship Creation
  postNewJob: (newJob: Omit<IndustryJob, 'id' | 'postedDate' | 'applicationsCount' | 'shortlistedCount' | 'strongMatchesCount'>) => Promise<IndustryJob>;
  postNewInternship: (newInternship: Omit<IndustryInternship, 'id' | 'postedDate' | 'applicationsCount' | 'shortlistedCount'>) => Promise<IndustryInternship>;
  closeJob: (jobId: string) => Promise<void>;
  duplicateJob: (jobId: string) => Promise<IndustryJob | undefined>;
  // Interview Management
  scheduleNewInterview: (interview: Omit<IndustryInterview, 'id' | 'status'>) => Promise<IndustryInterview>;
  
  // Challenge & Submissions Management
  createIndustryChallenge: (challenge: Omit<IndustryChallenge, 'id' | 'createdDate' | 'participantsCount' | 'submissionsCount' | 'status'>) => Promise<IndustryChallenge>;
  updateSubmissionStatus: (submissionId: string, status: ChallengeSubmission['status']) => Promise<void>;
  fastTrackSubmissionToInterview: (submissionId: string) => Promise<void>;
  // Offer Letter Management
  createOffer: (offer: Omit<IndustryOffer, 'id' | 'generatedDate'>) => Promise<IndustryOffer>;
  updateOfferStatus: (offerId: string, status: IndustryOffer['status']) => Promise<void>;
  // College Collaboration & MoU
  requestCollegePartnership: (collegeId: string) => Promise<void>;
  addCurriculumFeedback: (mouId: string, feedback: Omit<SuggestedCurriculumModule, 'id'>) => Promise<void>;
  updateMoUStatus: (mouId: string, status: CollegeMoU['status']) => Promise<void>;
  
  // Profile & Preferences
  updateCompanyProfile: (profile: Partial<CompanyProfile>) => Promise<void>;
  updatePreferences: (prefs: Partial<HiringPreferences>) => Promise<void>;
  
  // Candidate Matching Helper
  getCandidateMatchBreakdown: (candidateId: string, jobId?: string) => ReturnType<typeof calculateCandidateMatch>;
  resetToDefaults: () => void;
}

const defaultNotifications: IndustryNotification[] = [
  {
    id: 'notif-01',
    title: 'Strong Skill Matches Available',
    message: '48 verified candidates strongly match your active AI/ML Engineer role.',
    time: '15m ago',
    read: false,
    type: 'match',
  },
  {
    id: 'notif-02',
    title: 'New Candidate Shortlisted',
    message: 'Aarav Sharma moved to Shortlisted stage for AI/ML Research Intern.',
    time: '1h ago',
    read: false,
    type: 'pipeline',
  },
  {
    id: 'notif-03',
    title: 'Partnership Accepted',
    message: 'AYUSH Institute of Technology accepted your collaboration request.',
    time: '3h ago',
    read: false,
    type: 'partnership',
  },
  {
    id: 'notif-04',
    title: 'Upcoming Interview Reminder',
    message: 'Sneha Rao is scheduled for Frontend Technical Interview tomorrow at 02:30 PM.',
    time: '5h ago',
    read: false,
    type: 'pipeline',
  },
  {
    id: 'notif-05',
    title: 'Challenge Deadline Approaching',
    message: 'AI Resume Screening Challenge deadline is in 17 days (84 participants).',
    time: '1d ago',
    read: true,
    type: 'challenge',
  },
];

const IndustryContext = createContext<IndustryContextType | undefined>(undefined);

export const IndustryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, identity } = useAuth();
  const [company, setCompany] = useState<CompanyProfile>(defaultCompanyProfile);
  const [preferences, setPreferences] = useState<HiringPreferences>(defaultHiringPreferences);
  const [jobs, setJobs] = useState<IndustryJob[]>([]);
  const [internships, setInternships] = useState<IndustryInternship[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [applications, setApplications] = useState<IndustryApplication[]>([]);
  const [interviews, setInterviews] = useState<IndustryInterview[]>([]);
  const [colleges, setColleges] = useState<CollegePartner[]>([]);
  const [challenges, setChallenges] = useState<IndustryChallenge[]>([]);
  const [submissions, setSubmissions] = useState<ChallengeSubmission[]>([]);
  const [offers, setOffers] = useState<IndustryOffer[]>([]);
  const [collegeMous, setCollegeMous] = useState<CollegeMoU[]>([]);
  const [notifications, setNotifications] = useState<IndustryNotification[]>(defaultNotifications);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [searchRadiusKm, setSearchRadiusKm] = useState<number>(25);

  // Hydrate all industry data from the backend on mount
  const refresh = useCallback(async () => {
    if (!identity) return;

    try {
      const [
        opportunitiesRes,
        applicationsRes,
        interviewsRes,
        offersRes,
        challengesRes,
        talentPoolRes,
        partnershipsRes,
        companyRes,
        preferencesRes,
      ] = await Promise.allSettled([
        opportunities.list(),
        industryApplications.list({ limit: 200 }),
        interviewsApi.forCompany(),
        offersApi.forCompany(),
        challengesApi.list({ status: 'Active', limit: 100 }),
        hiring.talentPool({ limit: 500 }),
        hiring.partnerships(),
        companyProfile.get(),
        hiring.preferences(),
      ]);

      if (opportunitiesRes.status === 'fulfilled') {
        setJobs((opportunitiesRes.value.jobs ?? []) as unknown as IndustryJob[]);
        setInternships((opportunitiesRes.value.internships ?? []) as unknown as IndustryInternship[]);
      }
      if (applicationsRes.status === 'fulfilled') setApplications((applicationsRes.value.applications ?? []) as unknown as IndustryApplication[]);
      if (interviewsRes.status === 'fulfilled') setInterviews((interviewsRes.value.interviews ?? []) as unknown as IndustryInterview[]);
      if (offersRes.status === 'fulfilled') setOffers((offersRes.value.offers ?? []) as unknown as IndustryOffer[]);
      if (challengesRes.status === 'fulfilled') setChallenges((challengesRes.value.challenges ?? []) as unknown as IndustryChallenge[]);
      if (talentPoolRes.status === 'fulfilled') {
        // Map TalentPoolEntry to Candidate shape
        const mappedCandidates = (talentPoolRes.value.entries ?? []).map((e) => ({
          id: e.candidate_user_id,
          name: e.display_name || 'Unknown',
          avatar: e.photo_url,
          email: e.email || '',
          college: '',
          location: e.location || '',
          skills: (e.verified_skills || []).map((s) => ({ name: s.name, verified: true, level: s.verified_level || 'Intermediate' })),
          matchScore: 0,
          savedToTalentPool: true,
          talentPoolCategory: e.category,
        }));
        setCandidates(mappedCandidates as unknown as Candidate[]);
      }
      if (partnershipsRes.status === 'fulfilled') {
        const partnerships = partnershipsRes.value.partnerships ?? [];
        setCollegeMous(partnerships as unknown as CollegeMoU[]);
        // Map partnerships to colleges for the college directory
        const mappedColleges = partnerships
          .filter((p) => p.college_id && p.college_name)
          .map((p) => ({
            id: p.college_id,
            name: p.college_name,
            shortName: p.college_short_name,
            city: p.college_city,
            state: p.college_state,
            logoUrl: p.college_logo,
            partnershipStatus: p.partnership_status,
            isMoU: p.is_mou,
            mouStatus: p.mou_status,
            contactPerson: p.contact_person,
            contactEmail: p.contact_email,
            effectiveFrom: p.effective_from,
            expiresAt: p.expires_at,
            keyInitiatives: p.key_initiatives,
            internshipCommitmentCount: p.internship_commitment_count,
          }));
        setColleges(mappedColleges as unknown as CollegePartner[]);
      }
      if (companyRes.status === 'fulfilled' && companyRes.value.company) setCompany(companyRes.value.company as unknown as CompanyProfile);
      if (preferencesRes.status === 'fulfilled') setPreferences(preferencesRes.value.preferences as unknown as HiringPreferences);
    } catch (e) {
      console.warn('[Industry] Hydration failed:', e);
    }
  }, [identity]);

  // Run hydration on mount and when identity changes
  useEffect(() => {
    refresh();
  }, [refresh]);

  const showToast = (message: string, type: ToastMessage['type'] = 'success') => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Candidate & Talent Pool Actions
  const toggleSaveCandidate = async (
    candidateId: string,
    category: Candidate['talentPoolCategory'] = 'Saved Candidates',
  ) => {
    const target = candidates.find((c) => c.id === candidateId);
    if (!target) return;

    const isSaved = !target.savedToTalentPool;

    setCandidates((prev) =>
      prev.map((c) =>
        c.id === candidateId
          ? { ...c, savedToTalentPool: isSaved, talentPoolCategory: isSaved ? category : undefined }
          : c,
      ),
    );

    try {
      await hiring.shortlist(candidateId, category);
      showToast(isSaved ? `Added ${target.name} to Talent Pool (${category})` : `Removed ${target.name} from Talent Pool`, isSaved ? 'success' : 'info');
    } catch (e) {
      // Rollback on failure
      setCandidates((prev) =>
        prev.map((c) =>
          c.id === candidateId ? { ...c, savedToTalentPool: !isSaved, talentPoolCategory: undefined } : c,
        ),
      );
      console.error('Could not update talent pool:', e);
      showToast('Failed to update talent pool', 'error');
    }
  };

  const shortlistCandidateForJob = async (
    candidateId: string,
    jobId: string,
    jobTitle: string,
    jobType: 'Job' | 'Internship' = 'Job',
  ) => {
    const cand = candidates.find((c) => c.id === candidateId);
    if (!cand) return;

    const existing = applications.find((a) => a.candidateId === candidateId && a.jobId === jobId);
    if (existing) {
      await moveApplicationStage(existing.id, 'Shortlisted', 'Directly shortlisted by recruiter from talent discovery.');
      showToast(`Candidate ${cand.name} marked as Shortlisted for ${jobTitle}`, 'success');
      return;
    }

    try {
      // Note: Backend doesn't expose POST /api/industry/applications yet.
      // Create locally and sync with setStage when the candidate applies.
      const newApp: IndustryApplication = {
        id: `app-${Date.now()}`,
        candidateId: cand.id,
        candidateName: cand.name,
        candidateAvatar: cand.avatar,
        candidateEmail: cand.email,
        candidateCollege: cand.college,
        jobId,
        jobTitle,
        jobType,
        matchScore: cand.matchScore || 92,
        appliedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        stage: 'Shortlisted',
        recruiterNotes: 'Shortlisted directly by Recruiter from Skill-First Candidate Discovery.',
        history: [
          { stage: 'New Application', date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), updatedBy: 'HR Lead' },
          { stage: 'Shortlisted', date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), updatedBy: 'Rahul Verma' },
        ],
        matchedSkills: cand.skills.filter((s) => s.verified).map((s) => s.name),
        missingSkills: [],
      };

      setApplications((prev) => [newApp, ...prev]);
      showToast(`Candidate ${cand.name} shortlisted for ${jobTitle}!`, 'success');
    } catch (e) {
      console.error('Could not shortlist candidate:', e);
      showToast('Failed to shortlist candidate', 'error');
    }
  };

  // Pipeline & Application Actions
  const moveApplicationStage = async (applicationId: string, nextStage: ApplicationStage, note?: string) => {
    try {
      const updated = await industryApplications.setStage(applicationId, nextStage, note);
      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId
            ? { ...app, stage: nextStage, history: [...app.history, { stage: nextStage, date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), note: note || `Moved to ${nextStage}`, updatedBy: 'Rahul Verma (HR Lead)' }] }
            : app,
        ),
      );
      showToast(`Moved to ${nextStage}`, 'success');
    } catch (e) {
      console.error('Could not move application stage:', e);
      showToast('Failed to move application stage', 'error');
    }
  };

  const rejectApplication = async (applicationId: string, reason: string = 'Profile does not align with current requirements.') => {
    await moveApplicationStage(applicationId, 'Rejected', reason);
  };

  // Job & Internship Creation
  const postNewJob = async (newJobData: Omit<IndustryJob, 'id' | 'postedDate' | 'applicationsCount' | 'shortlistedCount' | 'strongMatchesCount'>) => {
    try {
      const created = await industryJobs.create(newJobData);
      const job = created.job as unknown as IndustryJob;
      setJobs((prev) => [job, ...prev]);
      showToast(`Job "${job.title}" published successfully!`, 'success');
      return job;
    } catch (e) {
      console.error('Could not create job:', e);
      showToast('Failed to create job', 'error');
      throw e;
    }
  };

  const postNewInternship = async (newInternData: Omit<IndustryInternship, 'id' | 'postedDate' | 'applicationsCount' | 'shortlistedCount'>) => {
    try {
      const created = await industryInternships.create(newInternData);
      const internship = created.internship as unknown as IndustryInternship;
      setInternships((prev) => [internship, ...prev]);
      showToast(`Internship "${internship.title}" published successfully!`, 'success');
      return internship;
    } catch (e) {
      console.error('Could not create internship:', e);
      showToast('Failed to create internship', 'error');
      throw e;
    }
  };

  const closeJob = async (jobId: string) => {
    try {
      await industryJobs.update(jobId, { status: 'Closed' });
      setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, status: 'Closed' as const } : j)));
      showToast('Job listing marked as Closed.', 'info');
    } catch (e) {
      console.error('Could not close job:', e);
      showToast('Failed to close job', 'error');
    }
  };

  const duplicateJob = async (jobId: string) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return;

    try {
      const created = await industryJobs.create({
        ...job,
        title: `${job.title} (Copy)`,
        status: 'Draft',
        applicationsCount: 0,
        shortlistedCount: 0,
      } as unknown as Omit<IndustryJob, 'id' | 'postedDate' | 'applicationsCount' | 'shortlistedCount' | 'strongMatchesCount'>);
      const duplicated = created.job as unknown as IndustryJob;
      setJobs((prev) => [duplicated, ...prev]);
      showToast(`Created draft duplicate of "${job.title}"`, 'success');
      return duplicated;
    } catch (e) {
      console.error('Could not duplicate job:', e);
      showToast('Failed to duplicate job', 'error');
    }
  };

  // Interview Management
  const scheduleNewInterview = async (data: Omit<IndustryInterview, 'id' | 'status'>) => {
    try {
      const created = await interviewsApi.create(data);
      const interview = created.interview as unknown as IndustryInterview;
      setInterviews((prev) => [interview, ...prev]);

      // Also update any corresponding application to Interview stage if applicable
      const app = applications.find((a) => a.candidateId === data.candidateId);
      if (app && app.stage !== 'Technical Interview' && app.stage !== 'HR Interview') {
        await moveApplicationStage(app.id, 'Technical Interview', `Interview scheduled for ${data.date} at ${data.time}`);
      }

      showToast(`Interview scheduled with ${data.candidateName} for ${data.date}!`, 'success');
      return interview;
    } catch (e) {
      console.error('Could not schedule interview:', e);
      showToast('Failed to schedule interview', 'error');
      throw e;
    }
  };

  // Challenge & Submissions Management
  const createIndustryChallenge = async (
    challengeData: Omit<IndustryChallenge, 'id' | 'createdDate' | 'participantsCount' | 'submissionsCount' | 'status'>,
  ) => {
    try {
      const created = await challengesApi.create(challengeData);
      const challenge = created.challenge as unknown as IndustryChallenge;
      setChallenges((prev) => [challenge, ...prev]);
      showToast(`Industry Challenge "${challenge.title}" published!`, 'success');
      return challenge;
    } catch (e) {
      console.error('Could not create challenge:', e);
      showToast('Failed to create challenge', 'error');
      throw e;
    }
  };

  const requestCollegePartnership = async (collegeId: string) => {
    try {
      // The backend doesn't have a direct "request partnership" endpoint yet.
      // This would typically be a POST to /api/industry/partnerships or similar.
      // For now, update local state optimistically and show a message.
      setCollegeMous((prev) =>
        prev.map((col) =>
          col.id === collegeId ? { ...col, partnershipStatus: 'Pending' as const } : col,
        ),
      );
      const col = collegeMous.find((c) => c.id === collegeId);
      if (col) {
        showToast(`Partnership request sent to ${col.collegeName}!`, 'success');
      }
    } catch (e) {
      console.error('Could not request partnership:', e);
      showToast('Failed to request partnership', 'error');
    }
  };

  // Profile & Preferences
  const updateCompanyProfile = async (profile: Partial<CompanyProfile>) => {
    setCompany((prev) => {
      const next = { ...prev, ...profile };
      return next;
    });

    try {
      await companyProfile.update({
        displayName: profile.recruiter?.name,
        title: profile.recruiter?.title,
        // Other fields would need to be added to the API
      });
      showToast('Company Profile updated successfully.', 'success');
    } catch (e) {
      console.error('Could not update company profile:', e);
      showToast('Failed to update company profile', 'error');
    }
  };

  const updatePreferences = async (prefs: Partial<HiringPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...prefs }));
    try {
      await hiring.savePreferences(prefs);
      showToast('Hiring Preferences saved.', 'success');
    } catch (e) {
      console.error('Could not save preferences:', e);
      showToast('Failed to save preferences', 'error');
    }
  };

  // Candidate Matching Helper
  const getCandidateMatchBreakdown = (candidateId: string, jobId?: string) => {
    const cand = candidates.find((c) => c.id === candidateId) || candidates[0];
    const targetJob = jobId ? jobs.find((j) => j.id === jobId) || internships.find((i) => i.id === jobId) : jobs[0];
    const requiredSkills = targetJob?.requiredSkills || [
      { name: 'Python', level: 'Advanced', importance: 'Required' },
      { name: 'Machine Learning', level: 'Intermediate', importance: 'Required' },
      { name: 'SQL', level: 'Intermediate', importance: 'Required' },
      { name: 'Git', level: 'Basic', importance: 'Preferred' },
    ];
    return calculateCandidateMatch(cand, requiredSkills, company.location);
  };

  const updateSubmissionStatus = async (submissionId: string, status: ChallengeSubmission['status']) => {
    try {
      // The backend has PATCH /api/industry/challenges/:challengeId/submissions/:id
      // We need the challenge ID. For now, update locally and show toast.
      // In a real implementation, we'd call the API.
      setSubmissions((prev) =>
        prev.map((s) => (s.id === submissionId ? { ...s, status } : s)),
      );
      showToast(`Submission status updated to ${status}`, 'success');
    } catch (e) {
      console.error('Could not update submission status:', e);
      showToast('Failed to update submission status', 'error');
    }
  };

  const fastTrackSubmissionToInterview = async (submissionId: string) => {
    const sub = submissions.find((s) => s.id === submissionId);
    if (!sub) return;

    await updateSubmissionStatus(submissionId, 'Interview Fast-Tracked');

    // Create interview record
    await scheduleNewInterview({
      candidateId: `cand-sub-${sub.id}`,
      candidateName: sub.teamLead,
      candidateAvatar: sub.teamLeadAvatar,
      candidateCollege: sub.college,
      jobId: 'job-01',
      jobTitle: 'Hackathon Fast-Track Technical Interview',
      round: 'Technical Interview',
      date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      time: '02:30 PM',
      mode: 'Online',
      meetingLink: 'https://meet.google.com/fast-track-demo',
      interviewers: ['Rahul Verma (HR)', 'Vikram Sengupta (Principal Architect)'],
      notes: `Fast-tracked from Challenge Submission "${sub.teamName}" (Score: ${sub.score}/100, Test Pass Rate: ${sub.testPassRate}).`,
    });

    showToast(`Fast-tracked ${sub.teamLead} to Technical Interview!`, 'success');
  };

  // Offer Letter Management
  const createOffer = async (offerData: Omit<IndustryOffer, 'id' | 'generatedDate'>) => {
    try {
      const created = await offersApi.create(offerData);
      const offer = created.offer as unknown as IndustryOffer;
      setOffers((prev) => [offer, ...prev]);

      // Update matching application if any
      const app = applications.find((a) => a.candidateId === offerData.candidateId);
      if (app) {
        await moveApplicationStage(app.id, 'Offer Sent', `Formal offer letter issued for ${offerData.roleTitle}`);
      }

      showToast(`Offer letter generated for ${offerData.candidateName}!`, 'success');
      return offer;
    } catch (e) {
      console.error('Could not create offer:', e);
      showToast('Failed to create offer', 'error');
      throw e;
    }
  };

  const updateOfferStatus = async (offerId: string, status: IndustryOffer['status']) => {
    try {
      await offersApi.update(offerId, { status });
      setOffers((prev) =>
        prev.map((o) => (o.id === offerId ? { ...o, status } : o)),
      );

      if (status === 'Accepted') {
        // In a real implementation, we'd publish to college + student
        // For now just show toast
        showToast('Offer accepted!', 'success');
      } else {
        showToast(`Offer status updated to ${status}`, 'success');
      }
    } catch (e) {
      console.error('Could not update offer status:', e);
      showToast('Failed to update offer status', 'error');
    }
  };

  // College Collaboration & MoU
  const addCurriculumFeedback = async (mouId: string, feedback: Omit<SuggestedCurriculumModule, 'id'>) => {
    try {
      // Backend would need an endpoint for this. Update locally for now.
      setCollegeMous((prev) =>
        prev.map((m) => {
          if (m.id === mouId) {
            const newModule: SuggestedCurriculumModule = { ...feedback, id: `mod-${Date.now()}` };
            return {
              ...m,
              curriculumReviewsCompleted: m.curriculumReviewsCompleted + 1,
              suggestedCurriculumModules: [newModule, ...m.suggestedCurriculumModules],
            };
          }
          return m;
        }),
      );
      showToast('Curriculum feedback submitted for college senate review!', 'success');
    } catch (e) {
      console.error('Could not add curriculum feedback:', e);
      showToast('Failed to add curriculum feedback', 'error');
    }
  };

  const updateMoUStatus = async (mouId: string, status: CollegeMoU['status']) => {
    try {
      // Backend would need an endpoint. Update locally for now.
      setCollegeMous((prev) => prev.map((m) => (m.id === mouId ? { ...m, status } : m)));
      showToast(`MoU status updated to ${status}`, 'success');
    } catch (e) {
      console.error('Could not update MoU status:', e);
      showToast('Failed to update MoU status', 'error');
    }
  };

  const resetToDefaults = () => {
    setCompany(defaultCompanyProfile);
    setPreferences(defaultHiringPreferences);
    setJobs([]);
    setInternships([]);
    setCandidates([]);
    setApplications([]);
    setInterviews([]);
    setColleges([]);
    setChallenges([]);
    setSubmissions([]);
    setOffers([]);
    setCollegeMous([]);
    showToast('Reset Industry Portal to defaults.', 'info');
    // Re-hydrate from server
    refresh();
  };

  return (
    <IndustryContext.Provider
      value={{
        company,
        preferences,
        jobs,
        internships,
        candidates,
        applications,
        interviews,
        colleges,
        challenges,
        submissions,
        offers,
        collegeMous,
        notifications,
        toasts,
        searchRadiusKm,
        setSearchRadiusKm,
        showToast,
        removeToast,
        markNotificationsAsRead,
        refresh,
        toggleSaveCandidate,
        shortlistCandidateForJob,
        moveApplicationStage,
        rejectApplication,
        postNewJob,
        postNewInternship,
        closeJob,
        duplicateJob,
        scheduleNewInterview,
        createIndustryChallenge,
        updateSubmissionStatus,
        fastTrackSubmissionToInterview,
        createOffer,
        updateOfferStatus,
        requestCollegePartnership,
        addCurriculumFeedback,
        updateMoUStatus,
        updateCompanyProfile,
        updatePreferences,
        getCandidateMatchBreakdown,
        resetToDefaults,
      }}
    >
      {children}
    </IndustryContext.Provider>
  );
};

export const useIndustry = () => {
  const context = useContext(IndustryContext);
  if (!context) {
    throw new Error('useIndustry must be used within an IndustryProvider');
  }
  return context;
};
