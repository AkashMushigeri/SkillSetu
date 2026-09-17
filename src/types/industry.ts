export type SkillLevel = 'Basic' | 'Intermediate' | 'Advanced';
export type SkillImportance = 'Required' | 'Preferred';

export interface RequiredSkill {
  name: string;
  level: SkillLevel;
  importance: SkillImportance;
  minScore?: number; // e.g. 75%
}

export interface CandidateSkill {
  name: string;
  level: SkillLevel;
  verified: boolean;
  score?: number; // e.g. 91%
  verificationDate?: string;
  verifiedBy?: string;
  badgeUrl?: string;
}

export interface CandidateProject {
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
}

export interface CandidateExperience {
  title: string;
  company: string;
  duration: string;
  description: string;
  location?: string;
}

export interface CandidateEducation {
  degree: string;
  department: string;
  college: string;
  graduationYear: number;
  cgpa: number;
  currentYear: string; // e.g. "3rd Year"
}

export interface Candidate {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  location: string;
  college: string;
  education: CandidateEducation;
  role: string;
  availability: 'Open to Internship' | 'Open to Full-Time' | 'Available Immediately' | 'Summer 2026';
  skills: CandidateSkill[];
  projects: CandidateProject[];
  experience: CandidateExperience[];
  certifications: string[];
  achievements: string[];
  resumeText: string;
  github?: string;
  linkedin?: string;
  portfolio?: string;
  savedToTalentPool?: boolean;
  talentPoolCategory?: 'Saved Candidates' | 'Top Matches' | 'Potential Candidates' | 'Previously Interviewed' | 'Future Hiring';
  matchScore?: number; // dynamic or precalculated
  matchBreakdown?: {
    skillMatch: number;
    verifiedBonus: number;
    projectsMatch: number;
    experienceMatch: number;
    educationMatch: number;
    overall: number;
    details: { skill: string; score: number; candidateLevel: string; requiredLevel: string; verified: boolean }[];
  };
}

export type JobType = 'Full Time' | 'Part Time' | 'Contract' | 'Internship' | 'Remote' | 'Hybrid' | 'On-site';
export type JobStatus = 'Active' | 'Draft' | 'Closed' | 'Expired';

export interface IndustryJob {
  id: string;
  title: string;
  company: string;
  department: string;
  location: string;
  workMode: 'Remote' | 'Hybrid' | 'On-site';
  jobType: 'Full Time' | 'Part Time' | 'Contract';
  salaryRange: string;
  experienceRequired: string;
  education: string;
  graduationYear: string;
  minimumCgpa: number;
  requiredSkills: RequiredSkill[];
  description: string;
  responsibilities: string[];
  qualifications: string[];
  deadline: string;
  openings: number;
  applicationsCount: number;
  shortlistedCount: number;
  strongMatchesCount: number;
  status: JobStatus;
  postedDate: string;
}

export interface IndustryInternship {
  id: string;
  title: string;
  company: string;
  department: string;
  location: string;
  workMode: 'Remote' | 'Hybrid' | 'On-site';
  duration: string; // e.g. "12 weeks"
  stipend: string; // e.g. "₹15,000/month"
  eligibility: string; // e.g. "3rd & 4th year B.Tech AIML/CSE"
  startDate: string;
  applicationDeadline: string;
  requiredSkills: RequiredSkill[];
  description: string;
  learningOutcomes: string[];
  mentor: string;
  openings: number;
  isStartupFriendly: boolean;
  targetAudience: string; // e.g. "Designed for 3rd-year students"
  eligibleForConversion: boolean; // Internship -> Full-Time conversion pipeline
  status: 'Active' | 'Draft' | 'Closed';
  applicationsCount: number;
  shortlistedCount: number;
  postedDate: string;
}

export type ApplicationStage =
  | 'New Application'
  | 'Screening'
  | 'Shortlisted'
  | 'Technical Interview'
  | 'HR Interview'
  | 'Selected'
  | 'Offer Sent'
  | 'Hired'
  | 'Rejected';

export interface ApplicationHistoryEvent {
  stage: ApplicationStage;
  date: string;
  note?: string;
  updatedBy: string;
}

export interface IndustryApplication {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateAvatar: string;
  candidateEmail: string;
  candidateCollege: string;
  jobId: string;
  jobTitle: string;
  jobType: 'Job' | 'Internship';
  matchScore: number;
  appliedDate: string;
  stage: ApplicationStage;
  recruiterNotes: string;
  history: ApplicationHistoryEvent[];
  matchedSkills: string[];
  missingSkills: string[];
  interviewId?: string;
}

export type InterviewMode = 'Online' | 'Offline';
export type InterviewStatus = 'Scheduled' | 'Completed' | 'Cancelled';

export interface IndustryInterview {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateAvatar: string;
  candidateCollege: string;
  jobId: string;
  jobTitle: string;
  round: 'Technical Interview' | 'HR Interview' | 'Leadership Round' | 'Coding Assessment Review';
  date: string; // YYYY-MM-DD
  time: string; // HH:MM AM/PM
  mode: InterviewMode;
  meetingLink?: string;
  interviewers: string[];
  notes?: string;
  status: InterviewStatus;
  score?: number;
}

export interface CollegePartner {
  id: string;
  name: string;
  location: string;
  coordinates: { lat: number; lng: number };
  studentsCount: number;
  verifiedStudentsCount: number;
  matchingStudentsCount: number;
  departments: string[];
  topSkills: string[];
  placementReadiness: number; // e.g. 88%
  partnershipStatus: 'Active' | 'Pending' | 'Potential';
  activePrograms: number;
  internshipsOffered: number;
  studentsHired: number;
  industryChallengesActive: number;
  contactPerson: string;
  contactEmail: string;
}

export interface IndustryChallenge {
  id: string;
  title: string;
  description: string;
  problemStatement: string;
  requiredSkills: string[];
  difficulty: 'Basic' | 'Intermediate' | 'Advanced';
  deadline: string;
  teamSize: string; // e.g. "1-4 Students"
  prize: string; // e.g. "₹50,000 + Pre-Placement Interview"
  submissionRequirements: string;
  collegeParticipation: string; // e.g. "Open to All Partner Colleges"
  participantsCount: number;
  submissionsCount: number;
  status: 'Active' | 'Upcoming' | 'Closed';
  createdDate: string;
}

export interface SkillDemandItem {
  skill: string;
  demandPercentage: number;
  category: 'High Demand' | 'Medium Demand' | 'Moderate Demand';
  growth: string;
  availableTalentPercentage: number;
  verifiedTalentPercentage: number;
}

export interface CompanyProfile {
  name: string;
  type: string;
  industry: string;
  location: string;
  coordinates: { lat: number; lng: number };
  employees: string;
  founded: number;
  activeJobsCount: number;
  activeInternshipsCount: number;
  collegePartnersCount: number;
  website: string;
  tagline: string;
  about: string;
  mission: string;
  techStack: string[];
  departments: string[];
  hiringDomains: string[];
  benefits: string[];
  culture: string[];
  logo: string;
  coverImage: string;
  recruiter: {
    name: string;
    title: string;
    email: string;
    avatar: string;
  };
}

export interface HiringPreferences {
  preferredDepartments: string[];
  preferredDegrees: string[];
  preferredGraduationYears: string[];
  preferredLocations: string[];
  workModes: ('Remote' | 'Hybrid' | 'On-site')[];
  minimumCgpa: number;
  prioritizeVerifiedSkills: boolean;
  prioritizeStartupExperience: boolean;
  searchRadiusKm: number;
}

export interface ChallengeSubmission {
  id: string;
  challengeId: string;
  teamName: string;
  teamLead: string;
  teamLeadAvatar: string;
  college: string;
  submissionDate: string;
  githubUrl: string;
  liveDemoUrl?: string;
  videoUrl?: string;
  score: number; // 0 - 100
  testPassRate: string; // e.g. "18/18 (100%)"
  aiSummary: string;
  status: 'Under Review' | 'Shortlisted' | 'Winner' | 'Interview Fast-Tracked';
  skillsDemonstrated: string[];
}

export interface IndustryOffer {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateAvatar: string;
  candidateEmail: string;
  candidateCollege: string;
  jobOrInternshipId: string;
  roleTitle: string;
  type: 'Full-Time Employment' | 'Internship with PPO' | 'Summer Internship';
  department: string;
  location: string;
  workMode: 'Remote' | 'Hybrid' | 'On-site';
  compensation: string; // e.g. "₹14,50,000 / annum" or "₹35,000 / month"
  breakdown: {
    baseFixed: string;
    variableBonus?: string;
    retentionJoiningBonus?: string;
    benefitsSummary: string;
  };
  joiningDate: string;
  validUntil: string;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Declined';
  generatedDate: string;
  authorizedSignatory: string;
  signatoryTitle: string;
}

export interface SuggestedCurriculumModule {
  id: string;
  semester: string;
  currentSubject: string;
  industryRecommendation: string;
  recommendedTechnologies: string[];
  rationale: string;
  status: 'Adopted' | 'In Review' | 'Pending Senate Approval';
}

export interface CollegeMoU {
  id: string;
  collegeId: string;
  collegeName: string;
  collegeContact: string;
  effectiveFrom: string;
  durationYears: number;
  status: 'Active' | 'Under Review' | 'Draft' | 'Renewed';
  keyInitiatives: string[];
  internshipCommitmentCount: number;
  jointHackathonsCount: number;
  curriculumReviewsCompleted: number;
  suggestedCurriculumModules: SuggestedCurriculumModule[];
}
