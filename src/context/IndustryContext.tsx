'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
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
import { mockCandidates } from '@/data/industry/industryCandidates';
import { mockJobs } from '@/data/industry/industryJobs';
import { mockInternships } from '@/data/industry/industryInternships';
import { mockApplications } from '@/data/industry/industryApplications';
import { mockColleges } from '@/data/industry/industryColleges';
import { mockChallenges } from '@/data/industry/industryChallenges';
import { mockInterviews } from '@/data/industry/industryInterviews';
import { mockSubmissions } from '@/data/industry/industrySubmissions';
import { mockOffers } from '@/data/industry/industryOffers';
import { mockCollegeMous } from '@/data/industry/industryMous';
import { calculateCandidateMatch } from '@/lib/industryMatching';
import {
  subscribeToSync,
  readNotificationsFor,
  consumeNotification,
} from '@/lib/syncBridge';
import {
  readIndustryApplicationsFromStudents,
  readTrainingSignalsFromCollege,
  publishIndustryOpportunities,
  publishApplicationStageUpdate,
  publishAcceptedOffer,
} from '@/lib/syncConverters';

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
  
  // Candidate & Talent Pool Actions
  toggleSaveCandidate: (candidateId: string, category?: Candidate['talentPoolCategory']) => void;
  shortlistCandidateForJob: (candidateId: string, jobId: string, jobTitle: string, jobType?: 'Job' | 'Internship') => void;
  
  // Pipeline & Application Actions
  moveApplicationStage: (applicationId: string, nextStage: ApplicationStage, note?: string) => void;
  rejectApplication: (applicationId: string, reason?: string) => void;
  
  // Job & Internship Creation
  postNewJob: (newJob: Omit<IndustryJob, 'id' | 'postedDate' | 'applicationsCount' | 'shortlistedCount' | 'strongMatchesCount'>) => IndustryJob;
  postNewInternship: (newInternship: Omit<IndustryInternship, 'id' | 'postedDate' | 'applicationsCount' | 'shortlistedCount'>) => IndustryInternship;
  closeJob: (jobId: string) => void;
  duplicateJob: (jobId: string) => void;

  // Interview Management
  scheduleNewInterview: (interview: Omit<IndustryInterview, 'id' | 'status'>) => IndustryInterview;
  
  // Challenge & Submissions Management
  createIndustryChallenge: (challenge: Omit<IndustryChallenge, 'id' | 'createdDate' | 'participantsCount' | 'submissionsCount' | 'status'>) => IndustryChallenge;
  updateSubmissionStatus: (submissionId: string, status: ChallengeSubmission['status']) => void;
  fastTrackSubmissionToInterview: (submissionId: string) => void;

  // Offer Letter Management
  createOffer: (offer: Omit<IndustryOffer, 'id' | 'generatedDate'>) => IndustryOffer;
  updateOfferStatus: (offerId: string, status: IndustryOffer['status']) => void;

  // College Collaboration & MoU
  requestCollegePartnership: (collegeId: string) => void;
  addCurriculumFeedback: (mouId: string, feedback: Omit<SuggestedCurriculumModule, 'id'>) => void;
  updateMoUStatus: (mouId: string, status: CollegeMoU['status']) => void;
  
  // Profile & Preferences
  updateCompanyProfile: (profile: Partial<CompanyProfile>) => void;
  updatePreferences: (prefs: Partial<HiringPreferences>) => void;
  
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
  const [company, setCompany] = useState<CompanyProfile>(defaultCompanyProfile);
  const [preferences, setPreferences] = useState<HiringPreferences>(defaultHiringPreferences);
  const [jobs, setJobs] = useState<IndustryJob[]>(mockJobs);
  const [internships, setInternships] = useState<IndustryInternship[]>(mockInternships);
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates);
  const [applications, setApplications] = useState<IndustryApplication[]>(mockApplications);
  const [interviews, setInterviews] = useState<IndustryInterview[]>(mockInterviews);
  const [colleges, setColleges] = useState<CollegePartner[]>(mockColleges);
  const [challenges, setChallenges] = useState<IndustryChallenge[]>(mockChallenges);
  const [submissions, setSubmissions] = useState<ChallengeSubmission[]>(mockSubmissions);
  const [offers, setOffers] = useState<IndustryOffer[]>(mockOffers);
  const [collegeMous, setCollegeMous] = useState<CollegeMoU[]>(mockCollegeMous);
  const [notifications, setNotifications] = useState<IndustryNotification[]>(defaultNotifications);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [searchRadiusKm, setSearchRadiusKm] = useState<number>(25);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const savedJobs = localStorage.getItem('skillsetu_ind_jobs');
      if (savedJobs) setJobs(JSON.parse(savedJobs));

      const savedInternships = localStorage.getItem('skillsetu_ind_internships');
      if (savedInternships) setInternships(JSON.parse(savedInternships));

      const savedCandidates = localStorage.getItem('skillsetu_ind_candidates');
      if (savedCandidates) setCandidates(JSON.parse(savedCandidates));

      const savedApps = localStorage.getItem('skillsetu_ind_applications');
      if (savedApps) setApplications(JSON.parse(savedApps));

      const savedInterviews = localStorage.getItem('skillsetu_ind_interviews');
      if (savedInterviews) setInterviews(JSON.parse(savedInterviews));

      const savedColleges = localStorage.getItem('skillsetu_ind_colleges');
      if (savedColleges) setColleges(JSON.parse(savedColleges));

      const savedChallenges = localStorage.getItem('skillsetu_ind_challenges');
      if (savedChallenges) setChallenges(JSON.parse(savedChallenges));

      const savedSubmissions = localStorage.getItem('skillsetu_ind_submissions');
      if (savedSubmissions) setSubmissions(JSON.parse(savedSubmissions));

      const savedOffers = localStorage.getItem('skillsetu_ind_offers');
      if (savedOffers) setOffers(JSON.parse(savedOffers));

      const savedMous = localStorage.getItem('skillsetu_ind_mous');
      if (savedMous) setCollegeMous(JSON.parse(savedMous));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, []);

  // ------------------------------------------------------------------
  // Cross-sector sync subscription (Student/College -> Industry)
  // ------------------------------------------------------------------
  const syncRefresh = useCallback(() => {
    try {
      // 1. Pull applications submitted from the Student Portal
      const inboundApps = readIndustryApplicationsFromStudents();
      if (inboundApps.length) {
        setApplications((prev) => {
          const ids = new Set(prev.map((a) => a.id));
          const fresh = inboundApps.filter((a) => !ids.has(a.id));
          if (!fresh.length) return prev;
          const merged = [...fresh, ...prev];
          saveState('skillsetu_ind_applications', merged);
          return merged;
        });
      }

      // 2. Pull college training signals (readiness/curriculum feedback)
      const trainingSignals = readTrainingSignalsFromCollege();
      if (trainingSignals.length) {
        // Surface as a notification (kept generic so no structural risk)
        setNotifications((prev) => {
          const existingIds = new Set(prev.map((n) => n.id));
          const fresh = trainingSignals
            .filter((t) => t && typeof t === 'object' && t.id && !existingIds.has(`sync-training-${t.id}`))
            .map((t) => ({
              id: `sync-training-${t.id}`,
              title: 'College Training Signal',
              message: `${t.enrolledStudents || 0} students enrolled in "${t.programName || t.skill}" (${t.level || 'Basic'}).`,
              time: 'Just now',
              read: false,
              type: 'partnership' as const,
            }));
          return fresh.length ? [...fresh, ...prev] : prev;
        });
      }

      // 3. Merge cross-sector notifications (student engagement, offers, etc.)
      const inboundNotifs = readNotificationsFor('industry');
      if (inboundNotifs.length) {
        setNotifications((prev) => {
          const existingIds = new Set(prev.map((n) => n.id));
          const fresh = inboundNotifs
            .filter((n) => !existingIds.has(n.id))
            .map((n) => ({
              id: n.id,
              title: n.title,
              message: n.message,
              time: n.time,
              read: !!n.read,
              type: (n.type === 'application' || n.type === 'shortlist' || n.type === 'offer'
                ? 'application'
                : n.type === 'challenge'
                ? 'challenge'
                : n.type === 'placement'
                ? 'pipeline'
                : 'partnership') as IndustryNotification['type'],
              link: n.link,
            }));
          if (!fresh.length) return prev;
          const merged = [...fresh, ...prev];
          return merged;
        });
        inboundNotifs.forEach((n) => consumeNotification(n.id));
      }
    } catch (e) {
      console.warn('[Sync] Industry refresh failed safely:', e);
    }
  }, []);

  useEffect(() => {
    syncRefresh();
    return subscribeToSync(syncRefresh);
  }, [syncRefresh]);

  // Publish the full existing catalog once on mount so the Student &
  // College portals can surface them (idempotent via correlation ids).
  useEffect(() => {
    try {
      publishIndustryOpportunities({
        jobs,
        internships,
        challenges: challenges.filter((c) => c.status === 'Active'),
      });
    } catch (e) {
      console.warn('[Sync] Failed to publish initial catalog:', e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save changes
  const saveState = <T,>(key: string, data: T) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  };

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

  const toggleSaveCandidate = (candidateId: string, category: Candidate['talentPoolCategory'] = 'Saved Candidates') => {
    setCandidates((prev) => {
      const updated = prev.map((c) => {
        if (c.id === candidateId) {
          const isSaved = !c.savedToTalentPool;
          return {
            ...c,
            savedToTalentPool: isSaved,
            talentPoolCategory: isSaved ? category : undefined,
          };
        }
        return c;
      });
      saveState('skillsetu_ind_candidates', updated);
      const target = prev.find((c) => c.id === candidateId);
      if (target?.savedToTalentPool) {
        showToast(`Removed ${target.name} from Talent Pool`, 'info');
      } else if (target) {
        showToast(`Added ${target.name} to Talent Pool (${category})`, 'success');
      }
      return updated;
    });
  };

  const shortlistCandidateForJob = (
    candidateId: string,
    jobId: string,
    jobTitle: string,
    jobType: 'Job' | 'Internship' = 'Job'
  ) => {
    const cand = candidates.find((c) => c.id === candidateId);
    if (!cand) return;

    // Check if application already exists
    const existing = applications.find(
      (a) => a.candidateId === candidateId && a.jobId === jobId
    );

    if (existing) {
      moveApplicationStage(existing.id, 'Shortlisted', 'Directly shortlisted by recruiter from talent discovery.');
      showToast(`Candidate ${cand.name} marked as Shortlisted for ${jobTitle}`, 'success');
      return;
    }

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
      appliedDate: 'Just now',
      stage: 'Shortlisted',
      recruiterNotes: 'Shortlisted directly by Recruiter from Skill-First Candidate Discovery.',
      history: [
        { stage: 'New Application', date: new Date().toLocaleDateString(), updatedBy: 'HR Lead' },
        { stage: 'Shortlisted', date: new Date().toLocaleDateString(), updatedBy: 'Rahul Verma' },
      ],
      matchedSkills: cand.skills.filter((s) => s.verified).map((s) => s.name),
      missingSkills: [],
    };

    const updatedApps = [newApp, ...applications];
    setApplications(updatedApps);
    saveState('skillsetu_ind_applications', updatedApps);

    // Also update candidate talent pool status
    toggleSaveCandidate(cand.id, 'Top Matches');
    showToast(`Candidate ${cand.name} shortlisted for ${jobTitle}!`, 'success');
  };

  const moveApplicationStage = (applicationId: string, nextStage: ApplicationStage, note?: string) => {
    setApplications((prev) => {
      const updated = prev.map((app) => {
        if (app.id === applicationId) {
          const newHistory = [
            ...app.history,
            {
              stage: nextStage,
              date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today',
              note: note || `Moved to ${nextStage}`,
              updatedBy: 'Rahul Verma (HR Lead)',
            },
          ];
          return {
            ...app,
            stage: nextStage,
            history: newHistory,
          };
        }
        return app;
      });
      saveState('skillsetu_ind_applications', updated);
      const app = prev.find((a) => a.id === applicationId);
      if (app) {
        showToast(`Moved ${app.candidateName} to ${nextStage}`, 'success');
        // Publish stage updates to the Student portal (shortlist / reject / offer)
        try {
          publishApplicationStageUpdate(
            { id: app.id, jobTitle: app.jobTitle, stage: nextStage },
            app.candidateEmail
          );
        } catch (e) {
          console.warn('[Sync] Failed to publish stage update:', e);
        }
      }
      return updated;
    });
  };

  const rejectApplication = (applicationId: string, reason: string = 'Profile does not align with current requirements.') => {
    moveApplicationStage(applicationId, 'Rejected', reason);
  };

  const postNewJob = (newJobData: Omit<IndustryJob, 'id' | 'postedDate' | 'applicationsCount' | 'shortlistedCount' | 'strongMatchesCount'>) => {
    const newJob: IndustryJob = {
      ...newJobData,
      id: `job-${Date.now()}`,
      postedDate: 'Just now',
      applicationsCount: 0,
      shortlistedCount: 0,
      strongMatchesCount: Math.floor(Math.random() * 25) + 15, // realistic match estimation
    };
    const updated = [newJob, ...jobs];
    setJobs(updated);
    saveState('skillsetu_ind_jobs', updated);
    // Publish to Student portal as a live opportunity
    try {
      publishIndustryOpportunities({ jobs: [newJob] });
    } catch (e) {
      console.warn('[Sync] Failed to publish job:', e);
    }
    showToast(`Job "${newJob.title}" published successfully!`, 'success');
    return newJob;
  };

  const postNewInternship = (newInternData: Omit<IndustryInternship, 'id' | 'postedDate' | 'applicationsCount' | 'shortlistedCount'>) => {
    const newInternship: IndustryInternship = {
      ...newInternData,
      id: `intern-${Date.now()}`,
      postedDate: 'Just now',
      applicationsCount: 0,
      shortlistedCount: 0,
    };
    const updated = [newInternship, ...internships];
    setInternships(updated);
    saveState('skillsetu_ind_internships', updated);
    // Publish to Student & College portals as live opportunities
    try {
      publishIndustryOpportunities({ internships: [newInternship] });
    } catch (e) {
      console.warn('[Sync] Failed to publish internship:', e);
    }
    showToast(`Internship "${newInternship.title}" published successfully!`, 'success');
    return newInternship;
  };

  const closeJob = (jobId: string) => {
    setJobs((prev) => {
      const updated = prev.map((j) => (j.id === jobId ? { ...j, status: 'Closed' as const } : j));
      saveState('skillsetu_ind_jobs', updated);
      showToast('Job listing marked as Closed.', 'info');
      return updated;
    });
  };

  const duplicateJob = (jobId: string) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return;
    const duplicated: IndustryJob = {
      ...job,
      id: `job-${Date.now()}`,
      title: `${job.title} (Copy)`,
      postedDate: 'Just now',
      applicationsCount: 0,
      shortlistedCount: 0,
      status: 'Draft',
    };
    const updated = [duplicated, ...jobs];
    setJobs(updated);
    saveState('skillsetu_ind_jobs', updated);
    showToast(`Created draft duplicate of "${job.title}"`, 'success');
  };

  const scheduleNewInterview = (data: Omit<IndustryInterview, 'id' | 'status'>) => {
    const newInterview: IndustryInterview = {
      ...data,
      id: `int-${Date.now()}`,
      status: 'Scheduled',
    };
    const updated = [newInterview, ...interviews];
    setInterviews(updated);
    saveState('skillsetu_ind_interviews', updated);

    // Also update any corresponding application to Interview stage if applicable
    const app = applications.find((a) => a.candidateId === data.candidateId);
    if (app && app.stage !== 'Technical Interview' && app.stage !== 'HR Interview') {
      moveApplicationStage(app.id, 'Technical Interview', `Interview scheduled for ${data.date} at ${data.time}`);
    }

    showToast(`Interview scheduled with ${data.candidateName} for ${data.date}!`, 'success');
    return newInterview;
  };

  const createIndustryChallenge = (challengeData: Omit<IndustryChallenge, 'id' | 'createdDate' | 'participantsCount' | 'submissionsCount' | 'status'>) => {
    const newChallenge: IndustryChallenge = {
      ...challengeData,
      id: `chal-${Date.now()}`,
      createdDate: 'Just now',
      participantsCount: 0,
      submissionsCount: 0,
      status: 'Active',
    };
    const updated = [newChallenge, ...challenges];
    setChallenges(updated);
    saveState('skillsetu_ind_challenges', updated);
    // Publish to Student portal as a challenge micro-internship
    try {
      publishIndustryOpportunities({ challenges: [newChallenge] });
    } catch (e) {
      console.warn('[Sync] Failed to publish challenge:', e);
    }
    showToast(`Industry Challenge "${newChallenge.title}" published!`, 'success');
    return newChallenge;
  };

  const requestCollegePartnership = (collegeId: string) => {
    setColleges((prev) => {
      const updated = prev.map((col) => {
        if (col.id === collegeId) {
          return {
            ...col,
            partnershipStatus: 'Pending' as const,
          };
        }
        return col;
      });
      saveState('skillsetu_ind_colleges', updated);
      const col = prev.find((c) => c.id === collegeId);
      if (col) {
        showToast(`Partnership request sent to ${col.name}!`, 'success');
      }
      return updated;
    });
  };

  const updateCompanyProfile = (profile: Partial<CompanyProfile>) => {
    setCompany((prev) => ({ ...prev, ...profile }));
    showToast('Company Profile updated successfully.', 'success');
  };

  const updatePreferences = (prefs: Partial<HiringPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...prefs }));
    showToast('Hiring Preferences saved.', 'success');
  };

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

  const updateSubmissionStatus = (submissionId: string, status: ChallengeSubmission['status']) => {
    setSubmissions((prev) => {
      const updated = prev.map((s) => (s.id === submissionId ? { ...s, status } : s));
      saveState('skillsetu_ind_submissions', updated);
      return updated;
    });
    showToast(`Submission status updated to ${status}`, 'success');
  };

  const fastTrackSubmissionToInterview = (submissionId: string) => {
    const sub = submissions.find((s) => s.id === submissionId);
    if (!sub) return;

    updateSubmissionStatus(submissionId, 'Interview Fast-Tracked');

    // Create interview record
    scheduleNewInterview({
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

  const createOffer = (offerData: Omit<IndustryOffer, 'id' | 'generatedDate'>) => {
    const newOffer: IndustryOffer = {
      ...offerData,
      id: `off-${Date.now()}`,
      generatedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    const updated = [newOffer, ...offers];
    setOffers(updated);
    saveState('skillsetu_ind_offers', updated);

    // Update matching application if any
    const app = applications.find((a) => a.candidateId === offerData.candidateId);
    if (app) {
      moveApplicationStage(app.id, 'Offer Sent', `Formal offer letter issued for ${offerData.roleTitle}`);
    }

    showToast(`Offer letter generated for ${offerData.candidateName}!`, 'success');
    return newOffer;
  };

  const updateOfferStatus = (offerId: string, status: IndustryOffer['status']) => {
    setOffers((prev) => {
      const updated = prev.map((o) => (o.id === offerId ? { ...o, status } : o));
      saveState('skillsetu_ind_offers', updated);
      const target = prev.find((o) => o.id === offerId);
      if (target && status === 'Accepted') {
        // Sync accepted offer to College (placement) + Student (notification)
        try {
          publishAcceptedOffer(target);
        } catch (e) {
          console.warn('[Sync] Failed to publish accepted offer:', e);
        }
      }
      return updated;
    });
    showToast(`Offer status updated to ${status}`, 'success');
  };

  const addCurriculumFeedback = (mouId: string, feedback: Omit<SuggestedCurriculumModule, 'id'>) => {
    setCollegeMous((prev) => {
      const updated = prev.map((m) => {
        if (m.id === mouId) {
          const newModule: SuggestedCurriculumModule = {
            ...feedback,
            id: `mod-${Date.now()}`,
          };
          return {
            ...m,
            curriculumReviewsCompleted: m.curriculumReviewsCompleted + 1,
            suggestedCurriculumModules: [newModule, ...m.suggestedCurriculumModules],
          };
        }
        return m;
      });
      saveState('skillsetu_ind_mous', updated);
      return updated;
    });
    showToast('Curriculum feedback submitted for college senate review!', 'success');
  };

  const updateMoUStatus = (mouId: string, status: CollegeMoU['status']) => {
    setCollegeMous((prev) => {
      const updated = prev.map((m) => (m.id === mouId ? { ...m, status } : m));
      saveState('skillsetu_ind_mous', updated);
      return updated;
    });
    showToast(`MoU status updated to ${status}`, 'success');
  };

  const resetToDefaults = () => {
    localStorage.removeItem('skillsetu_ind_jobs');
    localStorage.removeItem('skillsetu_ind_internships');
    localStorage.removeItem('skillsetu_ind_candidates');
    localStorage.removeItem('skillsetu_ind_applications');
    localStorage.removeItem('skillsetu_ind_interviews');
    localStorage.removeItem('skillsetu_ind_colleges');
    localStorage.removeItem('skillsetu_ind_challenges');
    localStorage.removeItem('skillsetu_ind_submissions');
    localStorage.removeItem('skillsetu_ind_offers');
    localStorage.removeItem('skillsetu_ind_mous');

    setCompany(defaultCompanyProfile);
    setPreferences(defaultHiringPreferences);
    setJobs(mockJobs);
    setInternships(mockInternships);
    setCandidates(mockCandidates);
    setApplications(mockApplications);
    setInterviews(mockInterviews);
    setColleges(mockColleges);
    setChallenges(mockChallenges);
    setSubmissions(mockSubmissions);
    setOffers(mockOffers);
    setCollegeMous(mockCollegeMous);
    showToast('Reset Industry Portal demo data to defaults.', 'info');
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
