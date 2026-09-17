export type OpportunityType = 
  | 'Internship'
  | 'Micro-Internship'
  | 'Same-Day Task'
  | 'Part-Time Job'
  | 'Full-Time Job'
  | 'Industry Challenge';

export type SkillTier = 'Basic' | 'Intermediate' | 'Advanced';

export interface StudentProfile {
  id: string;
  name: string;
  degree: string;
  year: string;
  college: string;
  location: string;
  careerGoal: string;
  profileCompletion: number;
  avatar: string;
  bio: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  gpa: string;
}

export interface LearningResource {
  id: string;
  title: string;
  type: 'video' | 'doc' | 'article' | 'practice' | 'mini_project';
  duration: string;
  completed: boolean;
  url?: string;
  topic?: string;
  description?: string;
}

export interface AssessmentQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
}

export interface Skill {
  id: string;
  name: string;
  tier: SkillTier;
  category: string;
  icon: string;
  level: string;
  progress: number;
  isVerified: boolean;
  verifiedDate?: string;
  learningStatus: 'not_started' | 'in_progress' | 'completed';
  assessmentStatus: 'locked' | 'ready' | 'passed' | 'failed';
  bestScore?: number;
  description: string;
  estimatedTime: string;
  learningObjectives: string[];
  resources: LearningResource[];
  careerRoles: string[];
  relatedOpportunityCount: number;
  assessmentQuestions?: AssessmentQuestion[];
}

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  type: OpportunityType;
  location: string;
  city: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  distanceKm?: number;
  workMode: 'Remote' | 'Hybrid' | 'On-site';
  stipend: string;
  duration: string;
  postedDate: string;
  deadline: string;
  requiredSkills: string[];
  preferredSkills?: string[];
  experienceLevel: string;
  isStartup: boolean;
  description: string;
  responsibilities: string[];
  perks?: string[];
  matchScore?: number;
  matchedSkills?: string[];
  missingSkills?: string[];
  isMatchBoosted?: boolean;
}

export interface Application {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  company: string;
  type: OpportunityType;
  location: string;
  appliedDate: string;
  status: 'Applied' | 'Under Review' | 'Shortlisted' | 'Rejected';
  resumeUsed: string;
  matchScoreAtApply: number;
  stipend: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl: string;
  liveUrl?: string;
}

export interface WorkExperience {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
  isCurrent: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'assessment' | 'opportunity' | 'badge' | 'profile' | 'system';
  link?: string;
}

export interface CityLocation {
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}
