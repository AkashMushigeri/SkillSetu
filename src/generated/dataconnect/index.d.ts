import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise, DataConnectSettings } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;
export const dataConnectSettings: DataConnectSettings;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;


export enum ApplicationStage {
  NEW_APPLICATION = "NEW_APPLICATION",
  SCREENING = "SCREENING",
  SHORTLISTED = "SHORTLISTED",
  TECHNICAL_INTERVIEW = "TECHNICAL_INTERVIEW",
  HR_INTERVIEW = "HR_INTERVIEW",
  SELECTED = "SELECTED",
  OFFER_SENT = "OFFER_SENT",
  HIRED = "HIRED",
  REJECTED = "REJECTED",
};

export enum ChallengeStatus {
  ACTIVE = "ACTIVE",
  UPCOMING = "UPCOMING",
  CLOSED = "CLOSED",
};

export enum CollegePartnershipStatus {
  POTENTIAL = "POTENTIAL",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
};

export enum CurriculumStatus {
  PENDING_SENATE_APPROVAL = "PENDING_SENATE_APPROVAL",
  IN_REVIEW = "IN_REVIEW",
  ADOPTED = "ADOPTED",
};

export enum MouStatus {
  DRAFT = "DRAFT",
  UNDER_REVIEW = "UNDER_REVIEW",
  ACTIVE = "ACTIVE",
  RENEWED = "RENEWED",
};

export enum OfferStatus {
  DRAFT = "DRAFT",
  SENT = "SENT",
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED",
};

export enum SkillImportance {
  REQUIRED = "REQUIRED",
  PREFERRED = "PREFERRED",
};

export enum SkillLevel {
  BASIC = "BASIC",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED",
};

export enum UserRole {
  STUDENT = "STUDENT",
  INDUSTRY = "INDUSTRY",
  COLLEGE = "COLLEGE",
};



export interface Application_Key {
  id: UUIDString;
  __typename?: 'Application_Key';
}

export interface CandidateEducation_Key {
  id: UUIDString;
  __typename?: 'CandidateEducation_Key';
}

export interface CandidateExperience_Key {
  id: UUIDString;
  __typename?: 'CandidateExperience_Key';
}

export interface CandidateProject_Key {
  id: UUIDString;
  __typename?: 'CandidateProject_Key';
}

export interface ChallengeSubmission_Key {
  id: UUIDString;
  __typename?: 'ChallengeSubmission_Key';
}

export interface Challenge_Key {
  id: UUIDString;
  __typename?: 'Challenge_Key';
}

export interface CollegeCompany_Key {
  collegeId: UUIDString;
  companyId: UUIDString;
  __typename?: 'CollegeCompany_Key';
}

export interface College_Key {
  id: UUIDString;
  __typename?: 'College_Key';
}

export interface Company_Key {
  id: UUIDString;
  __typename?: 'Company_Key';
}

export interface CreateApplicationData {
  application_insert: Application_Key;
}

export interface CreateApplicationVariables {
  companyId: UUIDString;
  opportunityId: UUIDString;
  opportunityType: string;
  jobId?: string | null;
  internshipId?: string | null;
  opportunityKey?: string | null;
  title: string;
  jobType: string;
  matchScore?: number | null;
  matchedSkills?: string[] | null;
  missingSkills?: string[] | null;
}

export interface CreateCandidateEducationData {
  candidateEducation_insert: CandidateEducation_Key;
}

export interface CreateCandidateEducationVariables {
  degree: string;
  department: string;
  college: string;
  graduationYear?: number | null;
  cgpa?: number | null;
  currentYear?: string | null;
}

export interface CreateCandidateExperienceData {
  candidateExperience_insert: CandidateExperience_Key;
}

export interface CreateCandidateExperienceVariables {
  title: string;
  company: string;
  duration?: string | null;
  description?: string | null;
  location?: string | null;
  startDate?: TimestampString | null;
  endDate?: TimestampString | null;
}

export interface CreateCandidateProjectData {
  candidateProject_insert: CandidateProject_Key;
}

export interface CreateCandidateProjectVariables {
  title: string;
  description?: string | null;
  technologies?: string[] | null;
  githubUrl?: string | null;
  liveUrl?: string | null;
}

export interface CreateChallengeData {
  challenge_insert: Challenge_Key;
}

export interface CreateChallengeSubmissionData {
  challengeSubmission_insert: ChallengeSubmission_Key;
}

export interface CreateChallengeSubmissionVariables {
  challengeId: UUIDString;
  teamName: string;
  githubUrl: string;
  liveDemoUrl?: string | null;
  videoUrl?: string | null;
  skillsDemonstrated?: string[] | null;
}

export interface CreateChallengeVariables {
  companyId: UUIDString;
  title: string;
  description?: string | null;
  problemStatement?: string | null;
  requiredSkills?: string[] | null;
  difficulty?: string | null;
  deadline: TimestampString;
  teamSize?: string | null;
  prize?: string | null;
  submissionRequirements?: string | null;
  collegeParticipation?: string | null;
  status?: ChallengeStatus | null;
}

export interface CreateCurriculumModuleData {
  curriculumModule_insert: CurriculumModule_Key;
}

export interface CreateCurriculumModuleVariables {
  collegeCompanyCollegeId: UUIDString;
  collegeCompanyCompanyId: UUIDString;
  semester: string;
  currentSubject: string;
  industryRecommendation?: string | null;
  recommendedTechnologies?: string[] | null;
  rationale?: string | null;
  status?: CurriculumStatus | null;
}

export interface CreateInternshipData {
  internship_insert: Internship_Key;
}

export interface CreateInternshipVariables {
  companyId: UUIDString;
  title: string;
  department?: string | null;
  location?: string | null;
  workMode?: string | null;
  duration?: string | null;
  stipend?: string | null;
  eligibility?: string | null;
  startDate?: TimestampString | null;
  applicationDeadline?: TimestampString | null;
  description?: string | null;
  learningOutcomes?: string[] | null;
  mentor?: string | null;
  openings?: number | null;
  isStartupFriendly?: boolean | null;
  targetAudience?: string | null;
  eligibleForConversion?: boolean | null;
  status?: string | null;
}

export interface CreateInterviewData {
  interview_insert: Interview_Key;
}

export interface CreateInterviewVariables {
  candidateUid: string;
  companyId: UUIDString;
  title: string;
  round: string;
  date: TimestampString;
  time: string;
  mode?: string | null;
  meetingLink?: string | null;
  interviewers?: string[] | null;
  notes?: string | null;
}

export interface CreateJobData {
  job_insert: Job_Key;
}

export interface CreateJobVariables {
  companyId: UUIDString;
  title: string;
  department?: string | null;
  location?: string | null;
  workMode?: string | null;
  jobType?: string | null;
  salaryRange?: string | null;
  experienceRequired?: string | null;
  education?: string | null;
  graduationYear?: string | null;
  minimumCgpa?: number | null;
  description?: string | null;
  responsibilities?: string[] | null;
  qualifications?: string[] | null;
  deadline?: TimestampString | null;
  openings?: number | null;
  status?: string | null;
}

export interface CreateMyCollegeData {
  college_insert: College_Key;
}

export interface CreateMyCollegeVariables {
  name: string;
  location?: string | null;
  contactPerson?: string | null;
  contactEmail?: string | null;
}

export interface CreateOfferData {
  offer_insert: Offer_Key;
}

export interface CreateOfferVariables {
  candidateUid: string;
  companyId: UUIDString;
  jobOrInternshipId?: string | null;
  roleTitle: string;
  type: string;
  department?: string | null;
  location?: string | null;
  workMode?: string | null;
  compensation?: string | null;
  baseFixed?: string | null;
  variableBonus?: string | null;
  retentionJoiningBonus?: string | null;
  benefitsSummary?: string | null;
  joiningDate?: TimestampString | null;
  validUntil?: TimestampString | null;
  status?: OfferStatus | null;
  authorizedSignatory?: string | null;
  signatoryTitle?: string | null;
}

export interface CreateProfileEducationData {
  candidateEducation_insert: CandidateEducation_Key;
}

export interface CreateProfileEducationVariables {
  degree: string;
  department: string;
  college: string;
  graduationYear?: number | null;
  cgpa?: number | null;
  currentYear?: string | null;
}

export interface CreateSkillData {
  skill_insert: Skill_Key;
}

export interface CreateSkillVariables {
  name: string;
  category?: string | null;
  description?: string | null;
}

export interface CurriculumModule_Key {
  id: UUIDString;
  __typename?: 'CurriculumModule_Key';
}

export interface DeleteMyDuplicateEducationData {
  candidateEducation_delete?: CandidateEducation_Key | null;
}

export interface DeleteMyDuplicateEducationVariables {
  id: UUIDString;
}

export interface GetCandidateProfileData {
  user?: {
    uid: string;
    displayName: string;
    role: UserRole;
    email: string;
    photoUrl?: string | null;
    college?: string | null;
    location?: string | null;
    phone?: string | null;
    candidateSkills: ({
      level: SkillLevel;
      verified: boolean;
      score?: number | null;
      verificationDate?: TimestampString | null;
      verifiedBy?: string | null;
      badgeUrl?: string | null;
      skill: {
        name: string;
        category?: string | null;
      };
    })[];
    candidateProjects_on_user: ({
      id: UUIDString;
      title: string;
      description?: string | null;
      technologies?: string[] | null;
      githubUrl?: string | null;
      liveUrl?: string | null;
      createdAt: TimestampString;
    } & CandidateProject_Key)[];
    candidateExperiences_on_user: ({
      id: UUIDString;
      title: string;
      company: string;
      duration?: string | null;
      description?: string | null;
      location?: string | null;
      startDate?: TimestampString | null;
      endDate?: TimestampString | null;
    } & CandidateExperience_Key)[];
    candidateEducations_on_user: ({
      id: UUIDString;
      profileOwnerUid?: string | null;
      degree: string;
      department: string;
      college: string;
      graduationYear?: number | null;
      cgpa?: number | null;
      currentYear?: string | null;
      createdAt: TimestampString;
    } & CandidateEducation_Key)[];
  } & User_Key;
}

export interface GetCandidateProfileVariables {
  uid: string;
}

export interface GetChallengeData {
  challenge?: {
    id: UUIDString;
    title: string;
    description?: string | null;
    problemStatement?: string | null;
    requiredSkills?: string[] | null;
    difficulty?: string | null;
    deadline: TimestampString;
    teamSize?: string | null;
    prize?: string | null;
    submissionRequirements?: string | null;
    collegeParticipation?: string | null;
    participantsCount?: number | null;
    submissionsCount?: number | null;
    status: ChallengeStatus;
    company: {
      id: UUIDString;
      name: string;
      logo?: string | null;
    } & Company_Key;
    createdDate: TimestampString;
    createdAt: TimestampString;
  } & Challenge_Key;
}

export interface GetChallengeVariables {
  id: UUIDString;
}

export interface GetCompanyData {
  company?: {
    id: UUIDString;
    name: string;
    type?: string | null;
    industry?: string | null;
    location?: string | null;
    coordinates?: unknown | null;
    employees?: string | null;
    founded?: number | null;
    website?: string | null;
    tagline?: string | null;
    about?: string | null;
    mission?: string | null;
    techStack?: string[] | null;
    departments?: string[] | null;
    hiringDomains?: string[] | null;
    benefits?: string[] | null;
    culture?: string[] | null;
    logo?: string | null;
    coverImage?: string | null;
    jobs_on_company: ({
      id: UUIDString;
      title: string;
      location?: string | null;
      workMode?: string | null;
      jobType?: string | null;
      salaryRange?: string | null;
      status?: string | null;
      postedDate: TimestampString;
    } & Job_Key)[];
    internships_on_company: ({
      id: UUIDString;
      title: string;
      location?: string | null;
      workMode?: string | null;
      duration?: string | null;
      stipend?: string | null;
      status?: string | null;
      postedDate: TimestampString;
    } & Internship_Key)[];
  } & Company_Key;
}

export interface GetCompanyVariables {
  id: UUIDString;
}

export interface GetMyCollegeData {
  colleges: ({
    id: UUIDString;
  } & College_Key)[];
}

export interface GetMyCompanyData {
  companies: ({
    id: UUIDString;
  } & Company_Key)[];
}

export interface GetMyEducationData {
  user?: {
    candidateEducations_on_user: ({
      id: UUIDString;
      profileOwnerUid?: string | null;
      degree: string;
      department: string;
      college: string;
      graduationYear?: number | null;
      cgpa?: number | null;
      currentYear?: string | null;
      createdAt: TimestampString;
    } & CandidateEducation_Key)[];
  };
}

export interface GetMyProfileData {
  user?: {
    uid: string;
    displayName: string;
    email: string;
    photoUrl?: string | null;
    role: UserRole;
    college?: string | null;
    location?: string | null;
    phone?: string | null;
    candidateSkills: ({
      level: SkillLevel;
      verified: boolean;
      score?: number | null;
      skill: {
        name: string;
        category?: string | null;
      };
    })[];
    candidateProjects_on_user: ({
      id: UUIDString;
      title: string;
      description?: string | null;
      technologies?: string[] | null;
      githubUrl?: string | null;
      liveUrl?: string | null;
      createdAt: TimestampString;
    } & CandidateProject_Key)[];
    candidateExperiences_on_user: ({
      id: UUIDString;
      title: string;
      company: string;
      duration?: string | null;
      description?: string | null;
      location?: string | null;
      startDate?: TimestampString | null;
      endDate?: TimestampString | null;
    } & CandidateExperience_Key)[];
    candidateEducations_on_user: ({
      id: UUIDString;
      profileOwnerUid?: string | null;
      degree: string;
      department: string;
      college: string;
      graduationYear?: number | null;
      cgpa?: number | null;
      currentYear?: string | null;
      createdAt: TimestampString;
    } & CandidateEducation_Key)[];
  } & User_Key;
}

export interface HiringPreferences_Key {
  companyId: UUIDString;
  __typename?: 'HiringPreferences_Key';
}

export interface InternshipRequiredSkill_Key {
  internshipId: UUIDString;
  skillId: UUIDString;
  __typename?: 'InternshipRequiredSkill_Key';
}

export interface Internship_Key {
  id: UUIDString;
  __typename?: 'Internship_Key';
}

export interface Interview_Key {
  id: UUIDString;
  __typename?: 'Interview_Key';
}

export interface JobRequiredSkill_Key {
  jobId: UUIDString;
  skillId: UUIDString;
  __typename?: 'JobRequiredSkill_Key';
}

export interface Job_Key {
  id: UUIDString;
  __typename?: 'Job_Key';
}

export interface ListChallengeSubmissionsData {
  challengeSubmissions: ({
    id: UUIDString;
    teamName: string;
    teamLeadUid: string;
    college?: string | null;
    submissionDate: TimestampString;
    githubUrl: string;
    liveDemoUrl?: string | null;
    videoUrl?: string | null;
    score?: number | null;
    testPassRate?: string | null;
    aiSummary?: string | null;
    status?: string | null;
    skillsDemonstrated?: string[] | null;
  } & ChallengeSubmission_Key)[];
}

export interface ListChallengeSubmissionsVariables {
  challengeId: UUIDString;
}

export interface ListChallengesData {
  challenges: ({
    id: UUIDString;
    title: string;
    description?: string | null;
    difficulty?: string | null;
    deadline: TimestampString;
    teamSize?: string | null;
    prize?: string | null;
    participantsCount?: number | null;
    submissionsCount?: number | null;
    status: ChallengeStatus;
    company: {
      id: UUIDString;
      name: string;
      logo?: string | null;
    } & Company_Key;
    requiredSkills?: string[] | null;
    createdDate: TimestampString;
  } & Challenge_Key)[];
}

export interface ListCollegesData {
  colleges: ({
    id: UUIDString;
    name: string;
    location?: string | null;
    studentsCount?: number | null;
    verifiedStudentsCount?: number | null;
    placementReadiness?: number | null;
    partnershipStatus?: CollegePartnershipStatus | null;
    contactPerson?: string | null;
    contactEmail?: string | null;
  } & College_Key)[];
}

export interface ListCompaniesData {
  companies: ({
    id: UUIDString;
    name: string;
    type?: string | null;
    industry?: string | null;
    location?: string | null;
    employees?: string | null;
    founded?: number | null;
    website?: string | null;
    tagline?: string | null;
    logo?: string | null;
    coverImage?: string | null;
  } & Company_Key)[];
}

export interface ListCompanyApplicationsData {
  applications: ({
    id: UUIDString;
    candidate: {
      uid: string;
      displayName: string;
      email: string;
      photoUrl?: string | null;
      college?: string | null;
      location?: string | null;
    } & User_Key;
    jobId?: string | null;
    internshipId?: string | null;
    title: string;
    jobType: string;
    matchScore?: number | null;
    appliedDate: TimestampString;
    stage: ApplicationStage;
    matchedSkills?: string[] | null;
    missingSkills?: string[] | null;
  } & Application_Key)[];
}

export interface ListCompanyApplicationsVariables {
  companyId: UUIDString;
}

export interface ListCompanyChallengesData {
  challenges: ({
    id: UUIDString;
    title: string;
    description?: string | null;
    difficulty?: string | null;
    deadline: TimestampString;
    teamSize?: string | null;
    prize?: string | null;
    participantsCount?: number | null;
    submissionsCount?: number | null;
    status: ChallengeStatus;
    createdDate: TimestampString;
    createdAt: TimestampString;
  } & Challenge_Key)[];
}

export interface ListCompanyChallengesVariables {
  companyId: UUIDString;
}

export interface ListCompanyInternshipsData {
  internships: ({
    id: UUIDString;
    title: string;
    department?: string | null;
    location?: string | null;
    workMode?: string | null;
    duration?: string | null;
    stipend?: string | null;
    eligibility?: string | null;
    startDate?: TimestampString | null;
    applicationDeadline?: TimestampString | null;
    openings?: number | null;
    isStartupFriendly?: boolean | null;
    eligibleForConversion?: boolean | null;
    applicationsCount?: number | null;
    shortlistedCount?: number | null;
    status?: string | null;
    postedDate: TimestampString;
    createdAt: TimestampString;
    updatedAt?: TimestampString | null;
  } & Internship_Key)[];
}

export interface ListCompanyInternshipsVariables {
  companyId: UUIDString;
}

export interface ListCompanyInterviewsData {
  interviews: ({
    id: UUIDString;
    candidate: {
      uid: string;
      displayName: string;
    } & User_Key;
    company: {
      id: UUIDString;
      name: string;
    } & Company_Key;
    title: string;
    round: string;
    date: TimestampString;
    time: string;
    mode?: string | null;
    meetingLink?: string | null;
    interviewers?: string[] | null;
    status?: string | null;
    score?: number | null;
    createdAt: TimestampString;
  } & Interview_Key)[];
}

export interface ListCompanyInterviewsVariables {
  companyId: UUIDString;
}

export interface ListCompanyJobsData {
  jobs: ({
    id: UUIDString;
    title: string;
    department?: string | null;
    location?: string | null;
    workMode?: string | null;
    jobType?: string | null;
    salaryRange?: string | null;
    experienceRequired?: string | null;
    minimumCgpa?: number | null;
    deadline?: TimestampString | null;
    openings?: number | null;
    applicationsCount?: number | null;
    shortlistedCount?: number | null;
    strongMatchesCount?: number | null;
    status?: string | null;
    postedDate: TimestampString;
    createdAt: TimestampString;
    updatedAt?: TimestampString | null;
  } & Job_Key)[];
}

export interface ListCompanyJobsVariables {
  companyId: UUIDString;
}

export interface ListInternshipsData {
  internships: ({
    id: UUIDString;
    title: string;
    company: {
      id: UUIDString;
      name: string;
      logo?: string | null;
      location?: string | null;
      coordinates?: unknown | null;
    } & Company_Key;
    department?: string | null;
    location?: string | null;
    workMode?: string | null;
    duration?: string | null;
    stipend?: string | null;
    eligibility?: string | null;
    startDate?: TimestampString | null;
    applicationDeadline?: TimestampString | null;
    internshipRequiredSkills_on_internship: ({
      level: SkillLevel;
      importance: SkillImportance;
      minScore?: number | null;
      skill: {
        name: string;
      };
    })[];
    openings?: number | null;
    isStartupFriendly?: boolean | null;
    eligibleForConversion?: boolean | null;
    applicationsCount?: number | null;
    status?: string | null;
    postedDate: TimestampString;
  } & Internship_Key)[];
}

export interface ListJobsData {
  jobs: ({
    id: UUIDString;
    title: string;
    company: {
      id: UUIDString;
      name: string;
      logo?: string | null;
      location?: string | null;
      coordinates?: unknown | null;
    } & Company_Key;
    department?: string | null;
    location?: string | null;
    workMode?: string | null;
    jobType?: string | null;
    salaryRange?: string | null;
    experienceRequired?: string | null;
    minimumCgpa?: number | null;
    jobRequiredSkills_on_job: ({
      level: SkillLevel;
      importance: SkillImportance;
      minScore?: number | null;
      skill: {
        name: string;
      };
    })[];
    deadline?: TimestampString | null;
    openings?: number | null;
    applicationsCount?: number | null;
    status?: string | null;
    postedDate: TimestampString;
  } & Job_Key)[];
}

export interface ListMoUsData {
  collegeCompanies: ({
    college: {
      id: UUIDString;
      name: string;
      location?: string | null;
    } & College_Key;
    company: {
      id: UUIDString;
      name: string;
      logo?: string | null;
    } & Company_Key;
    studentsCount?: number | null;
    internshipsOffered?: number | null;
    studentsHired?: number | null;
    activePrograms?: number | null;
    industryChallengesActive?: number | null;
    mouStatus?: MouStatus | null;
    curriculumModules_on_collegeCompany: ({
      semester: string;
      currentSubject: string;
      industryRecommendation?: string | null;
      recommendedTechnologies?: string[] | null;
      rationale?: string | null;
      status?: CurriculumStatus | null;
    })[];
  })[];
}

export interface ListMoUsForCollegeData {
  collegeCompanies: ({
    college: {
      id: UUIDString;
      name: string;
      location?: string | null;
    } & College_Key;
    company: {
      id: UUIDString;
      name: string;
      logo?: string | null;
    } & Company_Key;
    studentsCount?: number | null;
    internshipsOffered?: number | null;
    studentsHired?: number | null;
    activePrograms?: number | null;
    industryChallengesActive?: number | null;
    mouStatus?: MouStatus | null;
    curriculumModules_on_collegeCompany: ({
      semester: string;
      currentSubject: string;
      industryRecommendation?: string | null;
      recommendedTechnologies?: string[] | null;
      rationale?: string | null;
      status?: CurriculumStatus | null;
    })[];
  })[];
}

export interface ListMyApplicationsData {
  applications: ({
    id: UUIDString;
    company: {
      id: UUIDString;
      name: string;
    } & Company_Key;
    jobId?: string | null;
    internshipId?: string | null;
    title: string;
    jobType: string;
    matchScore?: number | null;
    appliedDate: TimestampString;
    stage: ApplicationStage;
    matchedSkills?: string[] | null;
    missingSkills?: string[] | null;
    interviewId?: string | null;
  } & Application_Key)[];
}

export interface ListMyInterviewsData {
  interviews: ({
    id: UUIDString;
    candidate: {
      uid: string;
      displayName: string;
    } & User_Key;
    company: {
      id: UUIDString;
      name: string;
    } & Company_Key;
    title: string;
    round: string;
    date: TimestampString;
    time: string;
    mode?: string | null;
    meetingLink?: string | null;
    interviewers?: string[] | null;
    status?: string | null;
    score?: number | null;
    createdAt: TimestampString;
  } & Interview_Key)[];
}

export interface ListMyOffersData {
  offers: ({
    id: UUIDString;
    candidate: {
      uid: string;
      displayName: string;
      email: string;
    } & User_Key;
    jobOrInternshipId?: string | null;
    roleTitle: string;
    type: string;
    department?: string | null;
    location?: string | null;
    workMode?: string | null;
    compensation?: string | null;
    baseFixed?: string | null;
    variableBonus?: string | null;
    retentionJoiningBonus?: string | null;
    benefitsSummary?: string | null;
    joiningDate?: TimestampString | null;
    validUntil?: TimestampString | null;
    status?: OfferStatus | null;
    generatedDate: TimestampString;
    authorizedSignatory?: string | null;
    signatoryTitle?: string | null;
  } & Offer_Key)[];
}

export interface ListMySkillsData {
  userSkills: ({
    level: SkillLevel;
    verified: boolean;
    score?: number | null;
    verificationDate?: TimestampString | null;
    verifiedBy?: string | null;
    badgeUrl?: string | null;
    skill: {
      name: string;
      category?: string | null;
    };
  })[];
}

export interface ListSkillsData {
  skills: ({
    id: UUIDString;
    name: string;
    category?: string | null;
    description?: string | null;
  } & Skill_Key)[];
}

export interface Offer_Key {
  id: UUIDString;
  __typename?: 'Offer_Key';
}

export interface SearchCandidatesData {
  candidates: ({
    uid: string;
    displayName: string;
    email: string;
    photoUrl?: string | null;
    college?: string | null;
    location?: string | null;
    filteredSkills: ({
      level: SkillLevel;
      verified: boolean;
      score?: number | null;
      skill: {
        name: string;
      };
    })[];
    candidateProjects_on_user: ({
      title: string;
      description?: string | null;
      technologies?: string[] | null;
      githubUrl?: string | null;
      liveUrl?: string | null;
    })[];
    candidateEducations_on_user: ({
      profileOwnerUid?: string | null;
      degree: string;
      department: string;
      college: string;
      graduationYear?: number | null;
      cgpa?: number | null;
      currentYear?: string | null;
      createdAt: TimestampString;
    })[];
  } & User_Key)[];
}

export interface SearchCandidatesVariables {
  skillNames?: string[] | null;
}

export interface Skill_Key {
  id: UUIDString;
  __typename?: 'Skill_Key';
}

export interface UpdateApplicationStageData {
  application_update?: Application_Key | null;
}

export interface UpdateApplicationStageVariables {
  id: UUIDString;
  stage: ApplicationStage;
  note?: string | null;
}

export interface UpdateMyCollegeData {
  college_update?: College_Key | null;
}

export interface UpdateMyCollegeVariables {
  id: UUIDString;
  name: string;
  location?: string | null;
  contactPerson?: string | null;
  contactEmail?: string | null;
}

export interface UpdateMyCompanyData {
  company_update?: Company_Key | null;
}

export interface UpdateMyCompanyVariables {
  id: UUIDString;
  name: string;
  industry?: string | null;
  employees?: string | null;
  location?: string | null;
  website?: string | null;
  about?: string | null;
  mission?: string | null;
}

export interface UpdateMyProfileEducationData {
  candidateEducation_update?: CandidateEducation_Key | null;
}

export interface UpdateMyProfileEducationVariables {
  id: UUIDString;
  degree: string;
  department: string;
  college: string;
  graduationYear?: number | null;
  cgpa?: number | null;
  currentYear?: string | null;
}

export interface UpsertCollegeData {
  college_insert: College_Key;
}

export interface UpsertCollegeVariables {
  name: string;
  location?: string | null;
  coordinates?: unknown | null;
  studentsCount?: number | null;
  verifiedStudentsCount?: number | null;
  placementReadiness?: number | null;
  contactPerson?: string | null;
  contactEmail?: string | null;
}

export interface UpsertCompanyData {
  company_insert: Company_Key;
}

export interface UpsertCompanyVariables {
  name: string;
  type?: string | null;
  industry?: string | null;
  location?: string | null;
  coordinates?: unknown | null;
  employees?: string | null;
  founded?: number | null;
  website?: string | null;
  tagline?: string | null;
  about?: string | null;
  mission?: string | null;
  techStack?: string[] | null;
  departments?: string[] | null;
  hiringDomains?: string[] | null;
  benefits?: string[] | null;
  culture?: string[] | null;
  logo?: string | null;
  coverImage?: string | null;
}

export interface UpsertHiringPreferencesData {
  hiringPreferences_upsert: HiringPreferences_Key;
}

export interface UpsertHiringPreferencesVariables {
  companyId: UUIDString;
  preferredDepartments?: string[] | null;
  preferredDegrees?: string[] | null;
  preferredGraduationYears?: string[] | null;
  preferredLocations?: string[] | null;
  workModes?: string[] | null;
  minimumCgpa?: number | null;
  prioritizeVerifiedSkills?: boolean | null;
  prioritizeStartupExperience?: boolean | null;
  searchRadiusKm?: number | null;
}

export interface UpsertInternshipRequiredSkillData {
  internshipRequiredSkill_upsert: InternshipRequiredSkill_Key;
}

export interface UpsertInternshipRequiredSkillVariables {
  internshipId: UUIDString;
  skillId: UUIDString;
  level: SkillLevel;
  importance: SkillImportance;
  minScore?: number | null;
}

export interface UpsertJobRequiredSkillData {
  jobRequiredSkill_upsert: JobRequiredSkill_Key;
}

export interface UpsertJobRequiredSkillVariables {
  jobId: UUIDString;
  skillId: UUIDString;
  level: SkillLevel;
  importance: SkillImportance;
  minScore?: number | null;
}

export interface UpsertStudentProfileData {
  user_upsert: User_Key;
}

export interface UpsertStudentProfileVariables {
  displayName: string;
  email: string;
  photoUrl?: string | null;
  college?: string | null;
  location?: string | null;
  phone?: string | null;
}

export interface UpsertUserProfileData {
  user_upsert: User_Key;
}

export interface UpsertUserProfileVariables {
  displayName: string;
  email: string;
  role: UserRole;
  photoUrl?: string | null;
  college?: string | null;
  location?: string | null;
  phone?: string | null;
}

export interface UpsertUserSkillData {
  userSkill_upsert: UserSkill_Key;
}

export interface UpsertUserSkillVariables {
  skillId: UUIDString;
  level: SkillLevel;
}

export interface UserSkill_Key {
  userUid: string;
  skillId: UUIDString;
  __typename?: 'UserSkill_Key';
}

export interface User_Key {
  uid: string;
  __typename?: 'User_Key';
}

interface UpsertStudentProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertStudentProfileVariables): MutationRef<UpsertStudentProfileData, UpsertStudentProfileVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertStudentProfileVariables): MutationRef<UpsertStudentProfileData, UpsertStudentProfileVariables>;
  operationName: string;
}
export const upsertStudentProfileRef: UpsertStudentProfileRef;

export function upsertStudentProfile(vars: UpsertStudentProfileVariables): MutationPromise<UpsertStudentProfileData, UpsertStudentProfileVariables>;
export function upsertStudentProfile(dc: DataConnect, vars: UpsertStudentProfileVariables): MutationPromise<UpsertStudentProfileData, UpsertStudentProfileVariables>;

interface UpsertUserProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertUserProfileVariables): MutationRef<UpsertUserProfileData, UpsertUserProfileVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertUserProfileVariables): MutationRef<UpsertUserProfileData, UpsertUserProfileVariables>;
  operationName: string;
}
export const upsertUserProfileRef: UpsertUserProfileRef;

export function upsertUserProfile(vars: UpsertUserProfileVariables): MutationPromise<UpsertUserProfileData, UpsertUserProfileVariables>;
export function upsertUserProfile(dc: DataConnect, vars: UpsertUserProfileVariables): MutationPromise<UpsertUserProfileData, UpsertUserProfileVariables>;

interface UpsertCompanyRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertCompanyVariables): MutationRef<UpsertCompanyData, UpsertCompanyVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertCompanyVariables): MutationRef<UpsertCompanyData, UpsertCompanyVariables>;
  operationName: string;
}
export const upsertCompanyRef: UpsertCompanyRef;

export function upsertCompany(vars: UpsertCompanyVariables): MutationPromise<UpsertCompanyData, UpsertCompanyVariables>;
export function upsertCompany(dc: DataConnect, vars: UpsertCompanyVariables): MutationPromise<UpsertCompanyData, UpsertCompanyVariables>;

interface UpdateMyCompanyRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateMyCompanyVariables): MutationRef<UpdateMyCompanyData, UpdateMyCompanyVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateMyCompanyVariables): MutationRef<UpdateMyCompanyData, UpdateMyCompanyVariables>;
  operationName: string;
}
export const updateMyCompanyRef: UpdateMyCompanyRef;

export function updateMyCompany(vars: UpdateMyCompanyVariables): MutationPromise<UpdateMyCompanyData, UpdateMyCompanyVariables>;
export function updateMyCompany(dc: DataConnect, vars: UpdateMyCompanyVariables): MutationPromise<UpdateMyCompanyData, UpdateMyCompanyVariables>;

interface UpsertCollegeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertCollegeVariables): MutationRef<UpsertCollegeData, UpsertCollegeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertCollegeVariables): MutationRef<UpsertCollegeData, UpsertCollegeVariables>;
  operationName: string;
}
export const upsertCollegeRef: UpsertCollegeRef;

export function upsertCollege(vars: UpsertCollegeVariables): MutationPromise<UpsertCollegeData, UpsertCollegeVariables>;
export function upsertCollege(dc: DataConnect, vars: UpsertCollegeVariables): MutationPromise<UpsertCollegeData, UpsertCollegeVariables>;

interface CreateMyCollegeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateMyCollegeVariables): MutationRef<CreateMyCollegeData, CreateMyCollegeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateMyCollegeVariables): MutationRef<CreateMyCollegeData, CreateMyCollegeVariables>;
  operationName: string;
}
export const createMyCollegeRef: CreateMyCollegeRef;

export function createMyCollege(vars: CreateMyCollegeVariables): MutationPromise<CreateMyCollegeData, CreateMyCollegeVariables>;
export function createMyCollege(dc: DataConnect, vars: CreateMyCollegeVariables): MutationPromise<CreateMyCollegeData, CreateMyCollegeVariables>;

interface UpdateMyCollegeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateMyCollegeVariables): MutationRef<UpdateMyCollegeData, UpdateMyCollegeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateMyCollegeVariables): MutationRef<UpdateMyCollegeData, UpdateMyCollegeVariables>;
  operationName: string;
}
export const updateMyCollegeRef: UpdateMyCollegeRef;

export function updateMyCollege(vars: UpdateMyCollegeVariables): MutationPromise<UpdateMyCollegeData, UpdateMyCollegeVariables>;
export function updateMyCollege(dc: DataConnect, vars: UpdateMyCollegeVariables): MutationPromise<UpdateMyCollegeData, UpdateMyCollegeVariables>;

interface CreateSkillRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateSkillVariables): MutationRef<CreateSkillData, CreateSkillVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateSkillVariables): MutationRef<CreateSkillData, CreateSkillVariables>;
  operationName: string;
}
export const createSkillRef: CreateSkillRef;

export function createSkill(vars: CreateSkillVariables): MutationPromise<CreateSkillData, CreateSkillVariables>;
export function createSkill(dc: DataConnect, vars: CreateSkillVariables): MutationPromise<CreateSkillData, CreateSkillVariables>;

interface UpsertUserSkillRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertUserSkillVariables): MutationRef<UpsertUserSkillData, UpsertUserSkillVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertUserSkillVariables): MutationRef<UpsertUserSkillData, UpsertUserSkillVariables>;
  operationName: string;
}
export const upsertUserSkillRef: UpsertUserSkillRef;

export function upsertUserSkill(vars: UpsertUserSkillVariables): MutationPromise<UpsertUserSkillData, UpsertUserSkillVariables>;
export function upsertUserSkill(dc: DataConnect, vars: UpsertUserSkillVariables): MutationPromise<UpsertUserSkillData, UpsertUserSkillVariables>;

interface CreateCandidateProjectRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateCandidateProjectVariables): MutationRef<CreateCandidateProjectData, CreateCandidateProjectVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateCandidateProjectVariables): MutationRef<CreateCandidateProjectData, CreateCandidateProjectVariables>;
  operationName: string;
}
export const createCandidateProjectRef: CreateCandidateProjectRef;

export function createCandidateProject(vars: CreateCandidateProjectVariables): MutationPromise<CreateCandidateProjectData, CreateCandidateProjectVariables>;
export function createCandidateProject(dc: DataConnect, vars: CreateCandidateProjectVariables): MutationPromise<CreateCandidateProjectData, CreateCandidateProjectVariables>;

interface CreateCandidateExperienceRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateCandidateExperienceVariables): MutationRef<CreateCandidateExperienceData, CreateCandidateExperienceVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateCandidateExperienceVariables): MutationRef<CreateCandidateExperienceData, CreateCandidateExperienceVariables>;
  operationName: string;
}
export const createCandidateExperienceRef: CreateCandidateExperienceRef;

export function createCandidateExperience(vars: CreateCandidateExperienceVariables): MutationPromise<CreateCandidateExperienceData, CreateCandidateExperienceVariables>;
export function createCandidateExperience(dc: DataConnect, vars: CreateCandidateExperienceVariables): MutationPromise<CreateCandidateExperienceData, CreateCandidateExperienceVariables>;

interface CreateCandidateEducationRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateCandidateEducationVariables): MutationRef<CreateCandidateEducationData, CreateCandidateEducationVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateCandidateEducationVariables): MutationRef<CreateCandidateEducationData, CreateCandidateEducationVariables>;
  operationName: string;
}
export const createCandidateEducationRef: CreateCandidateEducationRef;

export function createCandidateEducation(vars: CreateCandidateEducationVariables): MutationPromise<CreateCandidateEducationData, CreateCandidateEducationVariables>;
export function createCandidateEducation(dc: DataConnect, vars: CreateCandidateEducationVariables): MutationPromise<CreateCandidateEducationData, CreateCandidateEducationVariables>;

interface CreateProfileEducationRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateProfileEducationVariables): MutationRef<CreateProfileEducationData, CreateProfileEducationVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateProfileEducationVariables): MutationRef<CreateProfileEducationData, CreateProfileEducationVariables>;
  operationName: string;
}
export const createProfileEducationRef: CreateProfileEducationRef;

export function createProfileEducation(vars: CreateProfileEducationVariables): MutationPromise<CreateProfileEducationData, CreateProfileEducationVariables>;
export function createProfileEducation(dc: DataConnect, vars: CreateProfileEducationVariables): MutationPromise<CreateProfileEducationData, CreateProfileEducationVariables>;

interface UpdateMyProfileEducationRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateMyProfileEducationVariables): MutationRef<UpdateMyProfileEducationData, UpdateMyProfileEducationVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateMyProfileEducationVariables): MutationRef<UpdateMyProfileEducationData, UpdateMyProfileEducationVariables>;
  operationName: string;
}
export const updateMyProfileEducationRef: UpdateMyProfileEducationRef;

export function updateMyProfileEducation(vars: UpdateMyProfileEducationVariables): MutationPromise<UpdateMyProfileEducationData, UpdateMyProfileEducationVariables>;
export function updateMyProfileEducation(dc: DataConnect, vars: UpdateMyProfileEducationVariables): MutationPromise<UpdateMyProfileEducationData, UpdateMyProfileEducationVariables>;

interface DeleteMyDuplicateEducationRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteMyDuplicateEducationVariables): MutationRef<DeleteMyDuplicateEducationData, DeleteMyDuplicateEducationVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteMyDuplicateEducationVariables): MutationRef<DeleteMyDuplicateEducationData, DeleteMyDuplicateEducationVariables>;
  operationName: string;
}
export const deleteMyDuplicateEducationRef: DeleteMyDuplicateEducationRef;

export function deleteMyDuplicateEducation(vars: DeleteMyDuplicateEducationVariables): MutationPromise<DeleteMyDuplicateEducationData, DeleteMyDuplicateEducationVariables>;
export function deleteMyDuplicateEducation(dc: DataConnect, vars: DeleteMyDuplicateEducationVariables): MutationPromise<DeleteMyDuplicateEducationData, DeleteMyDuplicateEducationVariables>;

interface CreateJobRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateJobVariables): MutationRef<CreateJobData, CreateJobVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateJobVariables): MutationRef<CreateJobData, CreateJobVariables>;
  operationName: string;
}
export const createJobRef: CreateJobRef;

export function createJob(vars: CreateJobVariables): MutationPromise<CreateJobData, CreateJobVariables>;
export function createJob(dc: DataConnect, vars: CreateJobVariables): MutationPromise<CreateJobData, CreateJobVariables>;

interface UpsertJobRequiredSkillRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertJobRequiredSkillVariables): MutationRef<UpsertJobRequiredSkillData, UpsertJobRequiredSkillVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertJobRequiredSkillVariables): MutationRef<UpsertJobRequiredSkillData, UpsertJobRequiredSkillVariables>;
  operationName: string;
}
export const upsertJobRequiredSkillRef: UpsertJobRequiredSkillRef;

export function upsertJobRequiredSkill(vars: UpsertJobRequiredSkillVariables): MutationPromise<UpsertJobRequiredSkillData, UpsertJobRequiredSkillVariables>;
export function upsertJobRequiredSkill(dc: DataConnect, vars: UpsertJobRequiredSkillVariables): MutationPromise<UpsertJobRequiredSkillData, UpsertJobRequiredSkillVariables>;

interface CreateInternshipRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateInternshipVariables): MutationRef<CreateInternshipData, CreateInternshipVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateInternshipVariables): MutationRef<CreateInternshipData, CreateInternshipVariables>;
  operationName: string;
}
export const createInternshipRef: CreateInternshipRef;

export function createInternship(vars: CreateInternshipVariables): MutationPromise<CreateInternshipData, CreateInternshipVariables>;
export function createInternship(dc: DataConnect, vars: CreateInternshipVariables): MutationPromise<CreateInternshipData, CreateInternshipVariables>;

interface UpsertInternshipRequiredSkillRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertInternshipRequiredSkillVariables): MutationRef<UpsertInternshipRequiredSkillData, UpsertInternshipRequiredSkillVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertInternshipRequiredSkillVariables): MutationRef<UpsertInternshipRequiredSkillData, UpsertInternshipRequiredSkillVariables>;
  operationName: string;
}
export const upsertInternshipRequiredSkillRef: UpsertInternshipRequiredSkillRef;

export function upsertInternshipRequiredSkill(vars: UpsertInternshipRequiredSkillVariables): MutationPromise<UpsertInternshipRequiredSkillData, UpsertInternshipRequiredSkillVariables>;
export function upsertInternshipRequiredSkill(dc: DataConnect, vars: UpsertInternshipRequiredSkillVariables): MutationPromise<UpsertInternshipRequiredSkillData, UpsertInternshipRequiredSkillVariables>;

interface CreateApplicationRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateApplicationVariables): MutationRef<CreateApplicationData, CreateApplicationVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateApplicationVariables): MutationRef<CreateApplicationData, CreateApplicationVariables>;
  operationName: string;
}
export const createApplicationRef: CreateApplicationRef;

export function createApplication(vars: CreateApplicationVariables): MutationPromise<CreateApplicationData, CreateApplicationVariables>;
export function createApplication(dc: DataConnect, vars: CreateApplicationVariables): MutationPromise<CreateApplicationData, CreateApplicationVariables>;

interface UpdateApplicationStageRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateApplicationStageVariables): MutationRef<UpdateApplicationStageData, UpdateApplicationStageVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateApplicationStageVariables): MutationRef<UpdateApplicationStageData, UpdateApplicationStageVariables>;
  operationName: string;
}
export const updateApplicationStageRef: UpdateApplicationStageRef;

export function updateApplicationStage(vars: UpdateApplicationStageVariables): MutationPromise<UpdateApplicationStageData, UpdateApplicationStageVariables>;
export function updateApplicationStage(dc: DataConnect, vars: UpdateApplicationStageVariables): MutationPromise<UpdateApplicationStageData, UpdateApplicationStageVariables>;

interface CreateInterviewRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateInterviewVariables): MutationRef<CreateInterviewData, CreateInterviewVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateInterviewVariables): MutationRef<CreateInterviewData, CreateInterviewVariables>;
  operationName: string;
}
export const createInterviewRef: CreateInterviewRef;

export function createInterview(vars: CreateInterviewVariables): MutationPromise<CreateInterviewData, CreateInterviewVariables>;
export function createInterview(dc: DataConnect, vars: CreateInterviewVariables): MutationPromise<CreateInterviewData, CreateInterviewVariables>;

interface CreateChallengeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateChallengeVariables): MutationRef<CreateChallengeData, CreateChallengeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateChallengeVariables): MutationRef<CreateChallengeData, CreateChallengeVariables>;
  operationName: string;
}
export const createChallengeRef: CreateChallengeRef;

export function createChallenge(vars: CreateChallengeVariables): MutationPromise<CreateChallengeData, CreateChallengeVariables>;
export function createChallenge(dc: DataConnect, vars: CreateChallengeVariables): MutationPromise<CreateChallengeData, CreateChallengeVariables>;

interface CreateChallengeSubmissionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateChallengeSubmissionVariables): MutationRef<CreateChallengeSubmissionData, CreateChallengeSubmissionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateChallengeSubmissionVariables): MutationRef<CreateChallengeSubmissionData, CreateChallengeSubmissionVariables>;
  operationName: string;
}
export const createChallengeSubmissionRef: CreateChallengeSubmissionRef;

export function createChallengeSubmission(vars: CreateChallengeSubmissionVariables): MutationPromise<CreateChallengeSubmissionData, CreateChallengeSubmissionVariables>;
export function createChallengeSubmission(dc: DataConnect, vars: CreateChallengeSubmissionVariables): MutationPromise<CreateChallengeSubmissionData, CreateChallengeSubmissionVariables>;

interface CreateOfferRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateOfferVariables): MutationRef<CreateOfferData, CreateOfferVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateOfferVariables): MutationRef<CreateOfferData, CreateOfferVariables>;
  operationName: string;
}
export const createOfferRef: CreateOfferRef;

export function createOffer(vars: CreateOfferVariables): MutationPromise<CreateOfferData, CreateOfferVariables>;
export function createOffer(dc: DataConnect, vars: CreateOfferVariables): MutationPromise<CreateOfferData, CreateOfferVariables>;

interface CreateCurriculumModuleRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateCurriculumModuleVariables): MutationRef<CreateCurriculumModuleData, CreateCurriculumModuleVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateCurriculumModuleVariables): MutationRef<CreateCurriculumModuleData, CreateCurriculumModuleVariables>;
  operationName: string;
}
export const createCurriculumModuleRef: CreateCurriculumModuleRef;

export function createCurriculumModule(vars: CreateCurriculumModuleVariables): MutationPromise<CreateCurriculumModuleData, CreateCurriculumModuleVariables>;
export function createCurriculumModule(dc: DataConnect, vars: CreateCurriculumModuleVariables): MutationPromise<CreateCurriculumModuleData, CreateCurriculumModuleVariables>;

interface UpsertHiringPreferencesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertHiringPreferencesVariables): MutationRef<UpsertHiringPreferencesData, UpsertHiringPreferencesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertHiringPreferencesVariables): MutationRef<UpsertHiringPreferencesData, UpsertHiringPreferencesVariables>;
  operationName: string;
}
export const upsertHiringPreferencesRef: UpsertHiringPreferencesRef;

export function upsertHiringPreferences(vars: UpsertHiringPreferencesVariables): MutationPromise<UpsertHiringPreferencesData, UpsertHiringPreferencesVariables>;
export function upsertHiringPreferences(dc: DataConnect, vars: UpsertHiringPreferencesVariables): MutationPromise<UpsertHiringPreferencesData, UpsertHiringPreferencesVariables>;

interface ListCompaniesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListCompaniesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListCompaniesData, undefined>;
  operationName: string;
}
export const listCompaniesRef: ListCompaniesRef;

export function listCompanies(options?: ExecuteQueryOptions): QueryPromise<ListCompaniesData, undefined>;
export function listCompanies(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListCompaniesData, undefined>;

interface GetCompanyRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetCompanyVariables): QueryRef<GetCompanyData, GetCompanyVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetCompanyVariables): QueryRef<GetCompanyData, GetCompanyVariables>;
  operationName: string;
}
export const getCompanyRef: GetCompanyRef;

export function getCompany(vars: GetCompanyVariables, options?: ExecuteQueryOptions): QueryPromise<GetCompanyData, GetCompanyVariables>;
export function getCompany(dc: DataConnect, vars: GetCompanyVariables, options?: ExecuteQueryOptions): QueryPromise<GetCompanyData, GetCompanyVariables>;

interface GetMyCompanyRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyCompanyData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetMyCompanyData, undefined>;
  operationName: string;
}
export const getMyCompanyRef: GetMyCompanyRef;

export function getMyCompany(options?: ExecuteQueryOptions): QueryPromise<GetMyCompanyData, undefined>;
export function getMyCompany(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMyCompanyData, undefined>;

interface GetMyCollegeRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyCollegeData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetMyCollegeData, undefined>;
  operationName: string;
}
export const getMyCollegeRef: GetMyCollegeRef;

export function getMyCollege(options?: ExecuteQueryOptions): QueryPromise<GetMyCollegeData, undefined>;
export function getMyCollege(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMyCollegeData, undefined>;

interface GetMyEducationRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyEducationData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetMyEducationData, undefined>;
  operationName: string;
}
export const getMyEducationRef: GetMyEducationRef;

export function getMyEducation(options?: ExecuteQueryOptions): QueryPromise<GetMyEducationData, undefined>;
export function getMyEducation(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMyEducationData, undefined>;

interface ListCollegesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListCollegesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListCollegesData, undefined>;
  operationName: string;
}
export const listCollegesRef: ListCollegesRef;

export function listColleges(options?: ExecuteQueryOptions): QueryPromise<ListCollegesData, undefined>;
export function listColleges(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListCollegesData, undefined>;

interface GetMyProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyProfileData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetMyProfileData, undefined>;
  operationName: string;
}
export const getMyProfileRef: GetMyProfileRef;

export function getMyProfile(options?: ExecuteQueryOptions): QueryPromise<GetMyProfileData, undefined>;
export function getMyProfile(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMyProfileData, undefined>;

interface SearchCandidatesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: SearchCandidatesVariables): QueryRef<SearchCandidatesData, SearchCandidatesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: SearchCandidatesVariables): QueryRef<SearchCandidatesData, SearchCandidatesVariables>;
  operationName: string;
}
export const searchCandidatesRef: SearchCandidatesRef;

export function searchCandidates(vars?: SearchCandidatesVariables, options?: ExecuteQueryOptions): QueryPromise<SearchCandidatesData, SearchCandidatesVariables>;
export function searchCandidates(dc: DataConnect, vars?: SearchCandidatesVariables, options?: ExecuteQueryOptions): QueryPromise<SearchCandidatesData, SearchCandidatesVariables>;

interface GetCandidateProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetCandidateProfileVariables): QueryRef<GetCandidateProfileData, GetCandidateProfileVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetCandidateProfileVariables): QueryRef<GetCandidateProfileData, GetCandidateProfileVariables>;
  operationName: string;
}
export const getCandidateProfileRef: GetCandidateProfileRef;

export function getCandidateProfile(vars: GetCandidateProfileVariables, options?: ExecuteQueryOptions): QueryPromise<GetCandidateProfileData, GetCandidateProfileVariables>;
export function getCandidateProfile(dc: DataConnect, vars: GetCandidateProfileVariables, options?: ExecuteQueryOptions): QueryPromise<GetCandidateProfileData, GetCandidateProfileVariables>;

interface ListJobsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListJobsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListJobsData, undefined>;
  operationName: string;
}
export const listJobsRef: ListJobsRef;

export function listJobs(options?: ExecuteQueryOptions): QueryPromise<ListJobsData, undefined>;
export function listJobs(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListJobsData, undefined>;

interface ListInternshipsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListInternshipsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListInternshipsData, undefined>;
  operationName: string;
}
export const listInternshipsRef: ListInternshipsRef;

export function listInternships(options?: ExecuteQueryOptions): QueryPromise<ListInternshipsData, undefined>;
export function listInternships(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListInternshipsData, undefined>;

interface ListMyApplicationsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyApplicationsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListMyApplicationsData, undefined>;
  operationName: string;
}
export const listMyApplicationsRef: ListMyApplicationsRef;

export function listMyApplications(options?: ExecuteQueryOptions): QueryPromise<ListMyApplicationsData, undefined>;
export function listMyApplications(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMyApplicationsData, undefined>;

interface ListCompanyApplicationsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListCompanyApplicationsVariables): QueryRef<ListCompanyApplicationsData, ListCompanyApplicationsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListCompanyApplicationsVariables): QueryRef<ListCompanyApplicationsData, ListCompanyApplicationsVariables>;
  operationName: string;
}
export const listCompanyApplicationsRef: ListCompanyApplicationsRef;

export function listCompanyApplications(vars: ListCompanyApplicationsVariables, options?: ExecuteQueryOptions): QueryPromise<ListCompanyApplicationsData, ListCompanyApplicationsVariables>;
export function listCompanyApplications(dc: DataConnect, vars: ListCompanyApplicationsVariables, options?: ExecuteQueryOptions): QueryPromise<ListCompanyApplicationsData, ListCompanyApplicationsVariables>;

interface ListMyInterviewsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyInterviewsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListMyInterviewsData, undefined>;
  operationName: string;
}
export const listMyInterviewsRef: ListMyInterviewsRef;

export function listMyInterviews(options?: ExecuteQueryOptions): QueryPromise<ListMyInterviewsData, undefined>;
export function listMyInterviews(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMyInterviewsData, undefined>;

interface ListCompanyInterviewsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListCompanyInterviewsVariables): QueryRef<ListCompanyInterviewsData, ListCompanyInterviewsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListCompanyInterviewsVariables): QueryRef<ListCompanyInterviewsData, ListCompanyInterviewsVariables>;
  operationName: string;
}
export const listCompanyInterviewsRef: ListCompanyInterviewsRef;

export function listCompanyInterviews(vars: ListCompanyInterviewsVariables, options?: ExecuteQueryOptions): QueryPromise<ListCompanyInterviewsData, ListCompanyInterviewsVariables>;
export function listCompanyInterviews(dc: DataConnect, vars: ListCompanyInterviewsVariables, options?: ExecuteQueryOptions): QueryPromise<ListCompanyInterviewsData, ListCompanyInterviewsVariables>;

interface ListChallengesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListChallengesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListChallengesData, undefined>;
  operationName: string;
}
export const listChallengesRef: ListChallengesRef;

export function listChallenges(options?: ExecuteQueryOptions): QueryPromise<ListChallengesData, undefined>;
export function listChallenges(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListChallengesData, undefined>;

interface GetChallengeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetChallengeVariables): QueryRef<GetChallengeData, GetChallengeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetChallengeVariables): QueryRef<GetChallengeData, GetChallengeVariables>;
  operationName: string;
}
export const getChallengeRef: GetChallengeRef;

export function getChallenge(vars: GetChallengeVariables, options?: ExecuteQueryOptions): QueryPromise<GetChallengeData, GetChallengeVariables>;
export function getChallenge(dc: DataConnect, vars: GetChallengeVariables, options?: ExecuteQueryOptions): QueryPromise<GetChallengeData, GetChallengeVariables>;

interface ListChallengeSubmissionsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListChallengeSubmissionsVariables): QueryRef<ListChallengeSubmissionsData, ListChallengeSubmissionsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListChallengeSubmissionsVariables): QueryRef<ListChallengeSubmissionsData, ListChallengeSubmissionsVariables>;
  operationName: string;
}
export const listChallengeSubmissionsRef: ListChallengeSubmissionsRef;

export function listChallengeSubmissions(vars: ListChallengeSubmissionsVariables, options?: ExecuteQueryOptions): QueryPromise<ListChallengeSubmissionsData, ListChallengeSubmissionsVariables>;
export function listChallengeSubmissions(dc: DataConnect, vars: ListChallengeSubmissionsVariables, options?: ExecuteQueryOptions): QueryPromise<ListChallengeSubmissionsData, ListChallengeSubmissionsVariables>;

interface ListMyOffersRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyOffersData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListMyOffersData, undefined>;
  operationName: string;
}
export const listMyOffersRef: ListMyOffersRef;

export function listMyOffers(options?: ExecuteQueryOptions): QueryPromise<ListMyOffersData, undefined>;
export function listMyOffers(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMyOffersData, undefined>;

interface ListMoUsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMoUsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListMoUsData, undefined>;
  operationName: string;
}
export const listMoUsRef: ListMoUsRef;

export function listMoUs(options?: ExecuteQueryOptions): QueryPromise<ListMoUsData, undefined>;
export function listMoUs(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMoUsData, undefined>;

interface ListMoUsForCollegeRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMoUsForCollegeData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListMoUsForCollegeData, undefined>;
  operationName: string;
}
export const listMoUsForCollegeRef: ListMoUsForCollegeRef;

export function listMoUsForCollege(options?: ExecuteQueryOptions): QueryPromise<ListMoUsForCollegeData, undefined>;
export function listMoUsForCollege(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMoUsForCollegeData, undefined>;

interface ListSkillsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListSkillsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListSkillsData, undefined>;
  operationName: string;
}
export const listSkillsRef: ListSkillsRef;

export function listSkills(options?: ExecuteQueryOptions): QueryPromise<ListSkillsData, undefined>;
export function listSkills(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListSkillsData, undefined>;

interface ListMySkillsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMySkillsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListMySkillsData, undefined>;
  operationName: string;
}
export const listMySkillsRef: ListMySkillsRef;

export function listMySkills(options?: ExecuteQueryOptions): QueryPromise<ListMySkillsData, undefined>;
export function listMySkills(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMySkillsData, undefined>;

interface ListCompanyJobsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListCompanyJobsVariables): QueryRef<ListCompanyJobsData, ListCompanyJobsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListCompanyJobsVariables): QueryRef<ListCompanyJobsData, ListCompanyJobsVariables>;
  operationName: string;
}
export const listCompanyJobsRef: ListCompanyJobsRef;

export function listCompanyJobs(vars: ListCompanyJobsVariables, options?: ExecuteQueryOptions): QueryPromise<ListCompanyJobsData, ListCompanyJobsVariables>;
export function listCompanyJobs(dc: DataConnect, vars: ListCompanyJobsVariables, options?: ExecuteQueryOptions): QueryPromise<ListCompanyJobsData, ListCompanyJobsVariables>;

interface ListCompanyInternshipsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListCompanyInternshipsVariables): QueryRef<ListCompanyInternshipsData, ListCompanyInternshipsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListCompanyInternshipsVariables): QueryRef<ListCompanyInternshipsData, ListCompanyInternshipsVariables>;
  operationName: string;
}
export const listCompanyInternshipsRef: ListCompanyInternshipsRef;

export function listCompanyInternships(vars: ListCompanyInternshipsVariables, options?: ExecuteQueryOptions): QueryPromise<ListCompanyInternshipsData, ListCompanyInternshipsVariables>;
export function listCompanyInternships(dc: DataConnect, vars: ListCompanyInternshipsVariables, options?: ExecuteQueryOptions): QueryPromise<ListCompanyInternshipsData, ListCompanyInternshipsVariables>;

interface ListCompanyChallengesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListCompanyChallengesVariables): QueryRef<ListCompanyChallengesData, ListCompanyChallengesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListCompanyChallengesVariables): QueryRef<ListCompanyChallengesData, ListCompanyChallengesVariables>;
  operationName: string;
}
export const listCompanyChallengesRef: ListCompanyChallengesRef;

export function listCompanyChallenges(vars: ListCompanyChallengesVariables, options?: ExecuteQueryOptions): QueryPromise<ListCompanyChallengesData, ListCompanyChallengesVariables>;
export function listCompanyChallenges(dc: DataConnect, vars: ListCompanyChallengesVariables, options?: ExecuteQueryOptions): QueryPromise<ListCompanyChallengesData, ListCompanyChallengesVariables>;

