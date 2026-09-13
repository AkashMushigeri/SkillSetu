export type DepartmentName = 'CSE' | 'AIML' | 'ECE' | 'EEE' | 'Mechanical' | 'Civil';
export type AcademicYearFilter = 'All Years' | '1st Year' | '2nd Year' | '3rd Year' | '4th Year';

export interface CollegeStudent {
  id: string;
  usn: string;
  name: string;
  email: string;
  phone: string;
  department: DepartmentName;
  year: '1st Year' | '2nd Year' | '3rd Year' | '4th Year';
  gpa: number;
  skills: string[];
  verifiedSkills: string[];
  readinessScore: number;
  verificationStatus: 'Verified' | 'Pending' | 'In Progress';
  internshipStatus: 'Interning' | 'Seeking' | 'Completed' | 'Not Started';
  placementStatus: 'Placed' | 'Eligible' | 'In Interview' | 'Opted Out';
  companyPlaced?: string;
  offerPackage?: string;
  avatar: string;
  projectsCount: number;
  assessmentHistory: {
    skill: string;
    level: string;
    score: number;
    date: string;
    status: 'Passed' | 'Failed';
  }[];
}

export interface DepartmentReadiness {
  department: DepartmentName;
  students: number;
  verifiedPct: number;
  industryReadyPct: number;
  internshipRate: number;
  placementRate: number;
}

export interface SkillEcosystemItem {
  id: string;
  name: string;
  category: string;
  tier: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';
  studentCount: number;
  verificationRate: number;
  avgAssessmentScore: number;
  industryDemand: number;
  skillGap: number;
  isHighGap?: boolean;
}

export interface SkillGapItem {
  skill: string;
  tier: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';
  studentsCount: number;
  industryDemand: number;
  gap: number;
  highestGap?: boolean;
  recommendation: string;
}

export interface TrainingProgram {
  id: string;
  name: string;
  skill: string;
  skillLevel: 'Basic' | 'Intermediate' | 'Advanced';
  description: string;
  instructor: string;
  startDate: string;
  endDate: string;
  maxStudents: number;
  enrolledStudents: number;
  completionRate: number;
  avgScore: number;
  industryDemand: number;
  status: 'Active' | 'Upcoming' | 'Completed';
  learningResources: string[];
  assessmentRequired: boolean;
  industryPartner?: string;
}

export interface AssessmentRecord {
  id: string;
  studentId: string;
  studentName: string;
  usn: string;
  department: DepartmentName;
  skill: string;
  level: 'Basic' | 'Intermediate' | 'Advanced';
  score: number;
  status: 'Passed' | 'Failed';
  isVerified: boolean;
  verificationDate: string;
  badgeIssued: string;
  questionsCount: number;
}

export interface InternshipOpportunity {
  id: string;
  company: string;
  companyLogo?: string;
  role: string;
  skillsRequired: string[];
  location: string;
  mode: 'Hybrid' | 'Remote' | 'On-site';
  stipend: string;
  duration: string;
  eligibleStudentsCount: number;
  applicationsCount: number;
  status: 'Active' | 'Closing Soon' | 'Filled';
  isStartup: boolean;
  recommendedForThirdYear?: boolean;
}

export interface PlacementDrive {
  id: string;
  company: string;
  companyLogo?: string;
  logo?: string;
  role: string;
  date: string;
  eligibleDepts: DepartmentName[];
  minCgpa: number;
  skillsRequired: string[];
  packageOffer: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
  eligibleCount: number;
  appliedCount: number;
  shortlistedCount: number;
  interviewCount: number;
  selectedCount: number;
}

export interface IndustryPartner {
  id: string;
  name: string;
  logo?: string;
  industry: string;
  partnershipType: 'MoU Signed' | 'Research Partner' | 'Hiring Partner' | 'Incubation Partner';
  activePrograms: number;
  internshipsOffered: number;
  hiringOpportunities: number;
  lastCollaboration: string;
  status: 'Active' | 'Pending Renewal';
}

export interface CollegeIndustryProject {
  id: string;
  title: string;
  industryPartner: string;
  department: DepartmentName;
  studentsCount: number;
  facultyCount: number;
  status: 'In Progress' | 'Completed' | 'Planning';
  progressPct: number;
  description: string;
}

export interface IndustryChallenge {
  id: string;
  company: string;
  title: string;
  description: string;
  skills: string[];
  participantsCount: number;
  deadline: string;
  prizeOrIncentive: string;
  status: 'Open' | 'Under Evaluation' | 'Closed';
}

export interface CampusAnnouncement {
  id: string;
  title: string;
  category: 'Internship' | 'Placement Drive' | 'Training Program' | 'Assessment Deadline' | 'Industry Challenge' | 'Workshop';
  targetAudience: string;
  datePosted: string;
  status: 'Published' | 'Draft';
  content: string;
  important?: boolean;
}

export interface CollegeNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'internship' | 'assessment' | 'placement' | 'badge' | 'gap' | 'system';
  targetRoute: string;
}

export interface CollegeProfileInfo {
  institutionName: string;
  collegeId: string;
  location: string;
  address: string;
  website: string;
  email: string;
  phone: string;
  academicYear: string;
  departments: DepartmentName[];
  totalStudents: number;
  placementOfficer: {
    name: string;
    title: string;
    email: string;
    phone: string;
    avatar: string;
  };
  principalName: string;
  naacGrade: string;
  nirfRank: string;
  industryPartnersCount: number;
  logoUrl: string;
}
