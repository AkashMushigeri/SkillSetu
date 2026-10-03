import { UpsertStudentProfileData, UpsertStudentProfileVariables, UpsertUserProfileData, UpsertUserProfileVariables, UpsertCompanyData, UpsertCompanyVariables, UpdateMyCompanyData, UpdateMyCompanyVariables, UpsertCollegeData, UpsertCollegeVariables, CreateMyCollegeData, CreateMyCollegeVariables, UpdateMyCollegeData, UpdateMyCollegeVariables, CreateSkillData, CreateSkillVariables, UpsertUserSkillData, UpsertUserSkillVariables, CreateCandidateProjectData, CreateCandidateProjectVariables, CreateCandidateExperienceData, CreateCandidateExperienceVariables, CreateCandidateEducationData, CreateCandidateEducationVariables, CreateProfileEducationData, CreateProfileEducationVariables, UpdateMyProfileEducationData, UpdateMyProfileEducationVariables, DeleteMyDuplicateEducationData, DeleteMyDuplicateEducationVariables, CreateJobData, CreateJobVariables, UpsertJobRequiredSkillData, UpsertJobRequiredSkillVariables, CreateInternshipData, CreateInternshipVariables, UpsertInternshipRequiredSkillData, UpsertInternshipRequiredSkillVariables, CreateApplicationData, CreateApplicationVariables, UpdateApplicationStageData, UpdateApplicationStageVariables, CreateInterviewData, CreateInterviewVariables, CreateChallengeData, CreateChallengeVariables, CreateChallengeSubmissionData, CreateChallengeSubmissionVariables, CreateOfferData, CreateOfferVariables, CreateCurriculumModuleData, CreateCurriculumModuleVariables, UpsertHiringPreferencesData, UpsertHiringPreferencesVariables, ListCompaniesData, GetCompanyData, GetCompanyVariables, GetMyCompanyData, GetMyCollegeData, GetMyEducationData, ListCollegesData, GetMyProfileData, SearchCandidatesData, SearchCandidatesVariables, GetCandidateProfileData, GetCandidateProfileVariables, ListJobsData, ListInternshipsData, ListMyApplicationsData, ListCompanyApplicationsData, ListCompanyApplicationsVariables, ListMyInterviewsData, ListCompanyInterviewsData, ListCompanyInterviewsVariables, ListChallengesData, GetChallengeData, GetChallengeVariables, ListChallengeSubmissionsData, ListChallengeSubmissionsVariables, ListMyOffersData, ListMoUsData, ListMoUsForCollegeData, ListSkillsData, ListMySkillsData, ListCompanyJobsData, ListCompanyJobsVariables, ListCompanyInternshipsData, ListCompanyInternshipsVariables, ListCompanyChallengesData, ListCompanyChallengesVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useUpsertStudentProfile(options?: useDataConnectMutationOptions<UpsertStudentProfileData, FirebaseError, UpsertStudentProfileVariables>): UseDataConnectMutationResult<UpsertStudentProfileData, UpsertStudentProfileVariables>;
export function useUpsertStudentProfile(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertStudentProfileData, FirebaseError, UpsertStudentProfileVariables>): UseDataConnectMutationResult<UpsertStudentProfileData, UpsertStudentProfileVariables>;

export function useUpsertUserProfile(options?: useDataConnectMutationOptions<UpsertUserProfileData, FirebaseError, UpsertUserProfileVariables>): UseDataConnectMutationResult<UpsertUserProfileData, UpsertUserProfileVariables>;
export function useUpsertUserProfile(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertUserProfileData, FirebaseError, UpsertUserProfileVariables>): UseDataConnectMutationResult<UpsertUserProfileData, UpsertUserProfileVariables>;

export function useUpsertCompany(options?: useDataConnectMutationOptions<UpsertCompanyData, FirebaseError, UpsertCompanyVariables>): UseDataConnectMutationResult<UpsertCompanyData, UpsertCompanyVariables>;
export function useUpsertCompany(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertCompanyData, FirebaseError, UpsertCompanyVariables>): UseDataConnectMutationResult<UpsertCompanyData, UpsertCompanyVariables>;

export function useUpdateMyCompany(options?: useDataConnectMutationOptions<UpdateMyCompanyData, FirebaseError, UpdateMyCompanyVariables>): UseDataConnectMutationResult<UpdateMyCompanyData, UpdateMyCompanyVariables>;
export function useUpdateMyCompany(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateMyCompanyData, FirebaseError, UpdateMyCompanyVariables>): UseDataConnectMutationResult<UpdateMyCompanyData, UpdateMyCompanyVariables>;

export function useUpsertCollege(options?: useDataConnectMutationOptions<UpsertCollegeData, FirebaseError, UpsertCollegeVariables>): UseDataConnectMutationResult<UpsertCollegeData, UpsertCollegeVariables>;
export function useUpsertCollege(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertCollegeData, FirebaseError, UpsertCollegeVariables>): UseDataConnectMutationResult<UpsertCollegeData, UpsertCollegeVariables>;

export function useCreateMyCollege(options?: useDataConnectMutationOptions<CreateMyCollegeData, FirebaseError, CreateMyCollegeVariables>): UseDataConnectMutationResult<CreateMyCollegeData, CreateMyCollegeVariables>;
export function useCreateMyCollege(dc: DataConnect, options?: useDataConnectMutationOptions<CreateMyCollegeData, FirebaseError, CreateMyCollegeVariables>): UseDataConnectMutationResult<CreateMyCollegeData, CreateMyCollegeVariables>;

export function useUpdateMyCollege(options?: useDataConnectMutationOptions<UpdateMyCollegeData, FirebaseError, UpdateMyCollegeVariables>): UseDataConnectMutationResult<UpdateMyCollegeData, UpdateMyCollegeVariables>;
export function useUpdateMyCollege(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateMyCollegeData, FirebaseError, UpdateMyCollegeVariables>): UseDataConnectMutationResult<UpdateMyCollegeData, UpdateMyCollegeVariables>;

export function useCreateSkill(options?: useDataConnectMutationOptions<CreateSkillData, FirebaseError, CreateSkillVariables>): UseDataConnectMutationResult<CreateSkillData, CreateSkillVariables>;
export function useCreateSkill(dc: DataConnect, options?: useDataConnectMutationOptions<CreateSkillData, FirebaseError, CreateSkillVariables>): UseDataConnectMutationResult<CreateSkillData, CreateSkillVariables>;

export function useUpsertUserSkill(options?: useDataConnectMutationOptions<UpsertUserSkillData, FirebaseError, UpsertUserSkillVariables>): UseDataConnectMutationResult<UpsertUserSkillData, UpsertUserSkillVariables>;
export function useUpsertUserSkill(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertUserSkillData, FirebaseError, UpsertUserSkillVariables>): UseDataConnectMutationResult<UpsertUserSkillData, UpsertUserSkillVariables>;

export function useCreateCandidateProject(options?: useDataConnectMutationOptions<CreateCandidateProjectData, FirebaseError, CreateCandidateProjectVariables>): UseDataConnectMutationResult<CreateCandidateProjectData, CreateCandidateProjectVariables>;
export function useCreateCandidateProject(dc: DataConnect, options?: useDataConnectMutationOptions<CreateCandidateProjectData, FirebaseError, CreateCandidateProjectVariables>): UseDataConnectMutationResult<CreateCandidateProjectData, CreateCandidateProjectVariables>;

export function useCreateCandidateExperience(options?: useDataConnectMutationOptions<CreateCandidateExperienceData, FirebaseError, CreateCandidateExperienceVariables>): UseDataConnectMutationResult<CreateCandidateExperienceData, CreateCandidateExperienceVariables>;
export function useCreateCandidateExperience(dc: DataConnect, options?: useDataConnectMutationOptions<CreateCandidateExperienceData, FirebaseError, CreateCandidateExperienceVariables>): UseDataConnectMutationResult<CreateCandidateExperienceData, CreateCandidateExperienceVariables>;

export function useCreateCandidateEducation(options?: useDataConnectMutationOptions<CreateCandidateEducationData, FirebaseError, CreateCandidateEducationVariables>): UseDataConnectMutationResult<CreateCandidateEducationData, CreateCandidateEducationVariables>;
export function useCreateCandidateEducation(dc: DataConnect, options?: useDataConnectMutationOptions<CreateCandidateEducationData, FirebaseError, CreateCandidateEducationVariables>): UseDataConnectMutationResult<CreateCandidateEducationData, CreateCandidateEducationVariables>;

export function useCreateProfileEducation(options?: useDataConnectMutationOptions<CreateProfileEducationData, FirebaseError, CreateProfileEducationVariables>): UseDataConnectMutationResult<CreateProfileEducationData, CreateProfileEducationVariables>;
export function useCreateProfileEducation(dc: DataConnect, options?: useDataConnectMutationOptions<CreateProfileEducationData, FirebaseError, CreateProfileEducationVariables>): UseDataConnectMutationResult<CreateProfileEducationData, CreateProfileEducationVariables>;

export function useUpdateMyProfileEducation(options?: useDataConnectMutationOptions<UpdateMyProfileEducationData, FirebaseError, UpdateMyProfileEducationVariables>): UseDataConnectMutationResult<UpdateMyProfileEducationData, UpdateMyProfileEducationVariables>;
export function useUpdateMyProfileEducation(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateMyProfileEducationData, FirebaseError, UpdateMyProfileEducationVariables>): UseDataConnectMutationResult<UpdateMyProfileEducationData, UpdateMyProfileEducationVariables>;

export function useDeleteMyDuplicateEducation(options?: useDataConnectMutationOptions<DeleteMyDuplicateEducationData, FirebaseError, DeleteMyDuplicateEducationVariables>): UseDataConnectMutationResult<DeleteMyDuplicateEducationData, DeleteMyDuplicateEducationVariables>;
export function useDeleteMyDuplicateEducation(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteMyDuplicateEducationData, FirebaseError, DeleteMyDuplicateEducationVariables>): UseDataConnectMutationResult<DeleteMyDuplicateEducationData, DeleteMyDuplicateEducationVariables>;

export function useCreateJob(options?: useDataConnectMutationOptions<CreateJobData, FirebaseError, CreateJobVariables>): UseDataConnectMutationResult<CreateJobData, CreateJobVariables>;
export function useCreateJob(dc: DataConnect, options?: useDataConnectMutationOptions<CreateJobData, FirebaseError, CreateJobVariables>): UseDataConnectMutationResult<CreateJobData, CreateJobVariables>;

export function useUpsertJobRequiredSkill(options?: useDataConnectMutationOptions<UpsertJobRequiredSkillData, FirebaseError, UpsertJobRequiredSkillVariables>): UseDataConnectMutationResult<UpsertJobRequiredSkillData, UpsertJobRequiredSkillVariables>;
export function useUpsertJobRequiredSkill(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertJobRequiredSkillData, FirebaseError, UpsertJobRequiredSkillVariables>): UseDataConnectMutationResult<UpsertJobRequiredSkillData, UpsertJobRequiredSkillVariables>;

export function useCreateInternship(options?: useDataConnectMutationOptions<CreateInternshipData, FirebaseError, CreateInternshipVariables>): UseDataConnectMutationResult<CreateInternshipData, CreateInternshipVariables>;
export function useCreateInternship(dc: DataConnect, options?: useDataConnectMutationOptions<CreateInternshipData, FirebaseError, CreateInternshipVariables>): UseDataConnectMutationResult<CreateInternshipData, CreateInternshipVariables>;

export function useUpsertInternshipRequiredSkill(options?: useDataConnectMutationOptions<UpsertInternshipRequiredSkillData, FirebaseError, UpsertInternshipRequiredSkillVariables>): UseDataConnectMutationResult<UpsertInternshipRequiredSkillData, UpsertInternshipRequiredSkillVariables>;
export function useUpsertInternshipRequiredSkill(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertInternshipRequiredSkillData, FirebaseError, UpsertInternshipRequiredSkillVariables>): UseDataConnectMutationResult<UpsertInternshipRequiredSkillData, UpsertInternshipRequiredSkillVariables>;

export function useCreateApplication(options?: useDataConnectMutationOptions<CreateApplicationData, FirebaseError, CreateApplicationVariables>): UseDataConnectMutationResult<CreateApplicationData, CreateApplicationVariables>;
export function useCreateApplication(dc: DataConnect, options?: useDataConnectMutationOptions<CreateApplicationData, FirebaseError, CreateApplicationVariables>): UseDataConnectMutationResult<CreateApplicationData, CreateApplicationVariables>;

export function useUpdateApplicationStage(options?: useDataConnectMutationOptions<UpdateApplicationStageData, FirebaseError, UpdateApplicationStageVariables>): UseDataConnectMutationResult<UpdateApplicationStageData, UpdateApplicationStageVariables>;
export function useUpdateApplicationStage(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateApplicationStageData, FirebaseError, UpdateApplicationStageVariables>): UseDataConnectMutationResult<UpdateApplicationStageData, UpdateApplicationStageVariables>;

export function useCreateInterview(options?: useDataConnectMutationOptions<CreateInterviewData, FirebaseError, CreateInterviewVariables>): UseDataConnectMutationResult<CreateInterviewData, CreateInterviewVariables>;
export function useCreateInterview(dc: DataConnect, options?: useDataConnectMutationOptions<CreateInterviewData, FirebaseError, CreateInterviewVariables>): UseDataConnectMutationResult<CreateInterviewData, CreateInterviewVariables>;

export function useCreateChallenge(options?: useDataConnectMutationOptions<CreateChallengeData, FirebaseError, CreateChallengeVariables>): UseDataConnectMutationResult<CreateChallengeData, CreateChallengeVariables>;
export function useCreateChallenge(dc: DataConnect, options?: useDataConnectMutationOptions<CreateChallengeData, FirebaseError, CreateChallengeVariables>): UseDataConnectMutationResult<CreateChallengeData, CreateChallengeVariables>;

export function useCreateChallengeSubmission(options?: useDataConnectMutationOptions<CreateChallengeSubmissionData, FirebaseError, CreateChallengeSubmissionVariables>): UseDataConnectMutationResult<CreateChallengeSubmissionData, CreateChallengeSubmissionVariables>;
export function useCreateChallengeSubmission(dc: DataConnect, options?: useDataConnectMutationOptions<CreateChallengeSubmissionData, FirebaseError, CreateChallengeSubmissionVariables>): UseDataConnectMutationResult<CreateChallengeSubmissionData, CreateChallengeSubmissionVariables>;

export function useCreateOffer(options?: useDataConnectMutationOptions<CreateOfferData, FirebaseError, CreateOfferVariables>): UseDataConnectMutationResult<CreateOfferData, CreateOfferVariables>;
export function useCreateOffer(dc: DataConnect, options?: useDataConnectMutationOptions<CreateOfferData, FirebaseError, CreateOfferVariables>): UseDataConnectMutationResult<CreateOfferData, CreateOfferVariables>;

export function useCreateCurriculumModule(options?: useDataConnectMutationOptions<CreateCurriculumModuleData, FirebaseError, CreateCurriculumModuleVariables>): UseDataConnectMutationResult<CreateCurriculumModuleData, CreateCurriculumModuleVariables>;
export function useCreateCurriculumModule(dc: DataConnect, options?: useDataConnectMutationOptions<CreateCurriculumModuleData, FirebaseError, CreateCurriculumModuleVariables>): UseDataConnectMutationResult<CreateCurriculumModuleData, CreateCurriculumModuleVariables>;

export function useUpsertHiringPreferences(options?: useDataConnectMutationOptions<UpsertHiringPreferencesData, FirebaseError, UpsertHiringPreferencesVariables>): UseDataConnectMutationResult<UpsertHiringPreferencesData, UpsertHiringPreferencesVariables>;
export function useUpsertHiringPreferences(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertHiringPreferencesData, FirebaseError, UpsertHiringPreferencesVariables>): UseDataConnectMutationResult<UpsertHiringPreferencesData, UpsertHiringPreferencesVariables>;

export function useListCompanies(options?: useDataConnectQueryOptions<ListCompaniesData>): UseDataConnectQueryResult<ListCompaniesData, undefined>;
export function useListCompanies(dc: DataConnect, options?: useDataConnectQueryOptions<ListCompaniesData>): UseDataConnectQueryResult<ListCompaniesData, undefined>;

export function useGetCompany(vars: GetCompanyVariables, options?: useDataConnectQueryOptions<GetCompanyData>): UseDataConnectQueryResult<GetCompanyData, GetCompanyVariables>;
export function useGetCompany(dc: DataConnect, vars: GetCompanyVariables, options?: useDataConnectQueryOptions<GetCompanyData>): UseDataConnectQueryResult<GetCompanyData, GetCompanyVariables>;

export function useGetMyCompany(options?: useDataConnectQueryOptions<GetMyCompanyData>): UseDataConnectQueryResult<GetMyCompanyData, undefined>;
export function useGetMyCompany(dc: DataConnect, options?: useDataConnectQueryOptions<GetMyCompanyData>): UseDataConnectQueryResult<GetMyCompanyData, undefined>;

export function useGetMyCollege(options?: useDataConnectQueryOptions<GetMyCollegeData>): UseDataConnectQueryResult<GetMyCollegeData, undefined>;
export function useGetMyCollege(dc: DataConnect, options?: useDataConnectQueryOptions<GetMyCollegeData>): UseDataConnectQueryResult<GetMyCollegeData, undefined>;

export function useGetMyEducation(options?: useDataConnectQueryOptions<GetMyEducationData>): UseDataConnectQueryResult<GetMyEducationData, undefined>;
export function useGetMyEducation(dc: DataConnect, options?: useDataConnectQueryOptions<GetMyEducationData>): UseDataConnectQueryResult<GetMyEducationData, undefined>;

export function useListColleges(options?: useDataConnectQueryOptions<ListCollegesData>): UseDataConnectQueryResult<ListCollegesData, undefined>;
export function useListColleges(dc: DataConnect, options?: useDataConnectQueryOptions<ListCollegesData>): UseDataConnectQueryResult<ListCollegesData, undefined>;

export function useGetMyProfile(options?: useDataConnectQueryOptions<GetMyProfileData>): UseDataConnectQueryResult<GetMyProfileData, undefined>;
export function useGetMyProfile(dc: DataConnect, options?: useDataConnectQueryOptions<GetMyProfileData>): UseDataConnectQueryResult<GetMyProfileData, undefined>;

export function useSearchCandidates(vars?: SearchCandidatesVariables, options?: useDataConnectQueryOptions<SearchCandidatesData>): UseDataConnectQueryResult<SearchCandidatesData, SearchCandidatesVariables>;
export function useSearchCandidates(dc: DataConnect, vars?: SearchCandidatesVariables, options?: useDataConnectQueryOptions<SearchCandidatesData>): UseDataConnectQueryResult<SearchCandidatesData, SearchCandidatesVariables>;

export function useGetCandidateProfile(vars: GetCandidateProfileVariables, options?: useDataConnectQueryOptions<GetCandidateProfileData>): UseDataConnectQueryResult<GetCandidateProfileData, GetCandidateProfileVariables>;
export function useGetCandidateProfile(dc: DataConnect, vars: GetCandidateProfileVariables, options?: useDataConnectQueryOptions<GetCandidateProfileData>): UseDataConnectQueryResult<GetCandidateProfileData, GetCandidateProfileVariables>;

export function useListJobs(options?: useDataConnectQueryOptions<ListJobsData>): UseDataConnectQueryResult<ListJobsData, undefined>;
export function useListJobs(dc: DataConnect, options?: useDataConnectQueryOptions<ListJobsData>): UseDataConnectQueryResult<ListJobsData, undefined>;

export function useListInternships(options?: useDataConnectQueryOptions<ListInternshipsData>): UseDataConnectQueryResult<ListInternshipsData, undefined>;
export function useListInternships(dc: DataConnect, options?: useDataConnectQueryOptions<ListInternshipsData>): UseDataConnectQueryResult<ListInternshipsData, undefined>;

export function useListMyApplications(options?: useDataConnectQueryOptions<ListMyApplicationsData>): UseDataConnectQueryResult<ListMyApplicationsData, undefined>;
export function useListMyApplications(dc: DataConnect, options?: useDataConnectQueryOptions<ListMyApplicationsData>): UseDataConnectQueryResult<ListMyApplicationsData, undefined>;

export function useListCompanyApplications(vars: ListCompanyApplicationsVariables, options?: useDataConnectQueryOptions<ListCompanyApplicationsData>): UseDataConnectQueryResult<ListCompanyApplicationsData, ListCompanyApplicationsVariables>;
export function useListCompanyApplications(dc: DataConnect, vars: ListCompanyApplicationsVariables, options?: useDataConnectQueryOptions<ListCompanyApplicationsData>): UseDataConnectQueryResult<ListCompanyApplicationsData, ListCompanyApplicationsVariables>;

export function useListMyInterviews(options?: useDataConnectQueryOptions<ListMyInterviewsData>): UseDataConnectQueryResult<ListMyInterviewsData, undefined>;
export function useListMyInterviews(dc: DataConnect, options?: useDataConnectQueryOptions<ListMyInterviewsData>): UseDataConnectQueryResult<ListMyInterviewsData, undefined>;

export function useListCompanyInterviews(vars: ListCompanyInterviewsVariables, options?: useDataConnectQueryOptions<ListCompanyInterviewsData>): UseDataConnectQueryResult<ListCompanyInterviewsData, ListCompanyInterviewsVariables>;
export function useListCompanyInterviews(dc: DataConnect, vars: ListCompanyInterviewsVariables, options?: useDataConnectQueryOptions<ListCompanyInterviewsData>): UseDataConnectQueryResult<ListCompanyInterviewsData, ListCompanyInterviewsVariables>;

export function useListChallenges(options?: useDataConnectQueryOptions<ListChallengesData>): UseDataConnectQueryResult<ListChallengesData, undefined>;
export function useListChallenges(dc: DataConnect, options?: useDataConnectQueryOptions<ListChallengesData>): UseDataConnectQueryResult<ListChallengesData, undefined>;

export function useGetChallenge(vars: GetChallengeVariables, options?: useDataConnectQueryOptions<GetChallengeData>): UseDataConnectQueryResult<GetChallengeData, GetChallengeVariables>;
export function useGetChallenge(dc: DataConnect, vars: GetChallengeVariables, options?: useDataConnectQueryOptions<GetChallengeData>): UseDataConnectQueryResult<GetChallengeData, GetChallengeVariables>;

export function useListChallengeSubmissions(vars: ListChallengeSubmissionsVariables, options?: useDataConnectQueryOptions<ListChallengeSubmissionsData>): UseDataConnectQueryResult<ListChallengeSubmissionsData, ListChallengeSubmissionsVariables>;
export function useListChallengeSubmissions(dc: DataConnect, vars: ListChallengeSubmissionsVariables, options?: useDataConnectQueryOptions<ListChallengeSubmissionsData>): UseDataConnectQueryResult<ListChallengeSubmissionsData, ListChallengeSubmissionsVariables>;

export function useListMyOffers(options?: useDataConnectQueryOptions<ListMyOffersData>): UseDataConnectQueryResult<ListMyOffersData, undefined>;
export function useListMyOffers(dc: DataConnect, options?: useDataConnectQueryOptions<ListMyOffersData>): UseDataConnectQueryResult<ListMyOffersData, undefined>;

export function useListMoUs(options?: useDataConnectQueryOptions<ListMoUsData>): UseDataConnectQueryResult<ListMoUsData, undefined>;
export function useListMoUs(dc: DataConnect, options?: useDataConnectQueryOptions<ListMoUsData>): UseDataConnectQueryResult<ListMoUsData, undefined>;

export function useListMoUsForCollege(options?: useDataConnectQueryOptions<ListMoUsForCollegeData>): UseDataConnectQueryResult<ListMoUsForCollegeData, undefined>;
export function useListMoUsForCollege(dc: DataConnect, options?: useDataConnectQueryOptions<ListMoUsForCollegeData>): UseDataConnectQueryResult<ListMoUsForCollegeData, undefined>;

export function useListSkills(options?: useDataConnectQueryOptions<ListSkillsData>): UseDataConnectQueryResult<ListSkillsData, undefined>;
export function useListSkills(dc: DataConnect, options?: useDataConnectQueryOptions<ListSkillsData>): UseDataConnectQueryResult<ListSkillsData, undefined>;

export function useListMySkills(options?: useDataConnectQueryOptions<ListMySkillsData>): UseDataConnectQueryResult<ListMySkillsData, undefined>;
export function useListMySkills(dc: DataConnect, options?: useDataConnectQueryOptions<ListMySkillsData>): UseDataConnectQueryResult<ListMySkillsData, undefined>;

export function useListCompanyJobs(vars: ListCompanyJobsVariables, options?: useDataConnectQueryOptions<ListCompanyJobsData>): UseDataConnectQueryResult<ListCompanyJobsData, ListCompanyJobsVariables>;
export function useListCompanyJobs(dc: DataConnect, vars: ListCompanyJobsVariables, options?: useDataConnectQueryOptions<ListCompanyJobsData>): UseDataConnectQueryResult<ListCompanyJobsData, ListCompanyJobsVariables>;

export function useListCompanyInternships(vars: ListCompanyInternshipsVariables, options?: useDataConnectQueryOptions<ListCompanyInternshipsData>): UseDataConnectQueryResult<ListCompanyInternshipsData, ListCompanyInternshipsVariables>;
export function useListCompanyInternships(dc: DataConnect, vars: ListCompanyInternshipsVariables, options?: useDataConnectQueryOptions<ListCompanyInternshipsData>): UseDataConnectQueryResult<ListCompanyInternshipsData, ListCompanyInternshipsVariables>;

export function useListCompanyChallenges(vars: ListCompanyChallengesVariables, options?: useDataConnectQueryOptions<ListCompanyChallengesData>): UseDataConnectQueryResult<ListCompanyChallengesData, ListCompanyChallengesVariables>;
export function useListCompanyChallenges(dc: DataConnect, vars: ListCompanyChallengesVariables, options?: useDataConnectQueryOptions<ListCompanyChallengesData>): UseDataConnectQueryResult<ListCompanyChallengesData, ListCompanyChallengesVariables>;
