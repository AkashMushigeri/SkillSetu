export type OpportunityType = 
  | 'Internship'
  | 'Micro-Internship'
  | 'Same-Day Task'
  | 'Part-Time Job'
  | 'Full-Time Job'
  | 'Industry Challenge';

export type SkillTier = 'Basic' | 'Intermediate' | 'Advanced';

export interface CollegeEducation {
  institutionName: string;
  degree: string;
  branch?: string;
  academicYear: string;
  score: string;
  scoreType?: string;
}

export interface PucEducation {
  institutionName: string;
  course: string;
  academicYear: string;
  score: string;
  scoreType?: string;
}

export interface SchoolEducation {
  institutionName: string;
  board: string;
  academicYear: string;
  score: string;
  scoreType?: string;
}

export interface EducationHistory {
  college?: CollegeEducation;
  puc?: PucEducation;
  school?: SchoolEducation;
}

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
  education?: EducationHistory;
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
  codeSnippet?: string;
  type?: 'mcq' | 'code_analysis' | 'scenario' | 'debugging' | 'conceptual';
  difficulty?: 'easy' | 'medium' | 'hard';
}

export type SkillEvidenceSource = 'self_declared' | 'resume' | 'assessment' | 'project' | 'certification';
export type SkillVerificationType = 'claimed' | 'assessment_verified' | 'registry_verified' | 'resume_extracted';
export type SkillProficiencyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

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
  verificationType?: SkillVerificationType;
  verifiedScore?: number;
  verifiedLevel?: SkillProficiencyLevel;
  evidenceSource?: SkillEvidenceSource;
  evidenceSnippet?: string;
  evidenceConfidence?: number;
  assessmentStrengths?: string[];
  assessmentImprovements?: string[];
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

export interface ExtractedSkillItem {
  name: string;
  canonicalName: string;
  category: string;
  proficiency?: SkillProficiencyLevel;
  evidenceSnippet?: string;
  confidence: number;
  isAlreadyInProfile?: boolean;
  isAlreadyVerified?: boolean;
  selected?: boolean;
}

export interface ExtractedProjectItem {
  title: string;
  description: string;
  techStack: string[];
}

export interface ExtractedExperienceItem {
  title: string;
  company: string;
  period?: string;
  description?: string;
  technologies?: string[];
}

export interface ExtractedEducationItem {
  degree?: string;
  institution?: string;
  year?: string;
  fieldOfStudy?: string;
  score?: string;
}

export interface ResumeExtractionResult {
  candidateName?: string;
  email?: string;
  phone?: string;
  links?: {
    github?: string;
    linkedin?: string;
    portfolio?: string;
  };
  summary?: string;
  skills: ExtractedSkillItem[];
  projects: ExtractedProjectItem[];
  experience: ExtractedExperienceItem[];
  education: ExtractedEducationItem[];
  certifications: string[];
  extractionSource: 'ai' | 'offline_fallback';
  extractionTimeMs: number;
  rawTextPreview?: string;
}

export interface SkillMatchExplanation {
  matchScore: number;
  summary: string;
  matchedSkills: {
    name: string;
    verified: boolean;
    level?: string;
    matchedVia?: 'exact' | 'synonym' | 'project';
  }[];
  partialSkills: {
    name: string;
    reason: string;
  }[];
  missingSkills: {
    name: string;
    importance: 'required' | 'preferred';
  }[];
  projectRelevance?: string[];
  isMatchBoosted: boolean;
  boostMessage?: string;
}

export type SkillGapStatus =
  | 'MATCHED'
  | 'PARTIAL'
  | 'CLAIMED_UNVERIFIED'
  | 'MISSING'
  | 'PREFERRED_GAP';

export interface SkillGapItem {
  skill: string;
  importance: 'Required' | 'Preferred';
  status: SkillGapStatus;
  requiredProficiency?: string;
  studentProficiency?: string;
  isVerified: boolean;
  score?: number;
  matchedWith?: string;
  relationType: 'exact' | 'synonym' | 'related' | 'none';
  explanation: string;
  recommendedAction?: {
    type: 'take_assessment' | 'reassess' | 'add_skill' | 'add_project';
    label: string;
    url: string;
  };
  priorityRank: number; // 1 (Highest) to 5 (Lowest)
}

export interface SkillGapSummary {
  totalRequired: number;
  totalPreferred: number;
  matchedCount: number;
  partialCount: number;
  claimedUnverifiedCount: number;
  missingCount: number;
  preferredGapCount: number;
  overallReadiness: 'High' | 'Moderate' | 'Developing' | 'Early Stage';
}

export interface SkillGapAnalysisResult {
  opportunityId: string;
  opportunityTitle: string;
  company: string;
  currentMatchScore: number;
  potentialMatchScore: number;
  potentialScoreDelta: number;
  summary: SkillGapSummary;
  requiredSkills: {
    matched: SkillGapItem[];
    partial: SkillGapItem[];
    claimedUnverified: SkillGapItem[];
    missing: SkillGapItem[];
  };
  preferredSkills: {
    matched: SkillGapItem[];
    partial: SkillGapItem[];
    missing: SkillGapItem[];
  };
  priorityGaps: SkillGapItem[];
  recommendedActions: Array<{
    skill: string;
    action: string;
    url: string;
    urgency: 'critical' | 'high' | 'medium';
  }>;
}

export interface AssessmentQuestionItem {
  id: number;
  type: 'mcq' | 'code_analysis' | 'scenario' | 'debugging' | 'conceptual';
  questionType?: 'mcq' | 'code_analysis' | 'scenario' | 'debugging' | 'conceptual' | string;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface AssessmentSession {
  id: string;
  skillName: string;
  skillId: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Adaptive';
  questions: AssessmentQuestionItem[];
  startedAt: string;
}

export interface AssessmentEvaluationResult {
  score: number;
  correctCount?: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  skillLevel: SkillProficiencyLevel;
  proficiencyLevel?: SkillProficiencyLevel;
  strengths: string[];
  areasForImprovement: string[];
  topicsDemonstrated: string[];
  topicsToImprove: string[];
  disclaimer: string;
  verifiedDate: string;
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
  domain?: string;
  experienceLevel: string;
  isStartup: boolean;
  description: string;
  responsibilities: string[];
  perks?: string[];
  matchScore?: number;
  matchedSkills?: string[];
  verifiedMatchedSkills?: string[];
  claimedMatchedSkills?: string[];
  partialMatchedSkills?: Array<{ skill: string; matchedWith: string }>;
  missingSkills?: string[];
  isMatchBoosted?: boolean;
  boostMessage?: string;
  matchExplanation?: string;
  companyId?: string;
  industryId?: string;
}

export interface Application {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  company: string;
  type: OpportunityType;
  location: string;
  appliedDate: string;
  status: 'Applied' | 'Under Review' | 'Shortlisted' | 'Interview Scheduled' | 'Selected' | 'Rejected' | 'Submitted';
  resumeUsed: string;
  matchScoreAtApply: number;
  stipend: string;
  companyId?: string;
  institutionId?: string;
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
