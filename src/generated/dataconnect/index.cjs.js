const { queryRef, executeQuery, validateArgsWithOptions, mutationRef, executeMutation, validateArgs, makeMemoryCacheProvider } = require('firebase/data-connect');

const ApplicationStage = {
  NEW_APPLICATION: "NEW_APPLICATION",
  SCREENING: "SCREENING",
  SHORTLISTED: "SHORTLISTED",
  TECHNICAL_INTERVIEW: "TECHNICAL_INTERVIEW",
  HR_INTERVIEW: "HR_INTERVIEW",
  SELECTED: "SELECTED",
  OFFER_SENT: "OFFER_SENT",
  HIRED: "HIRED",
  REJECTED: "REJECTED",
}
exports.ApplicationStage = ApplicationStage;

const ChallengeStatus = {
  ACTIVE: "ACTIVE",
  UPCOMING: "UPCOMING",
  CLOSED: "CLOSED",
}
exports.ChallengeStatus = ChallengeStatus;

const CollegePartnershipStatus = {
  POTENTIAL: "POTENTIAL",
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
}
exports.CollegePartnershipStatus = CollegePartnershipStatus;

const CurriculumStatus = {
  PENDING_SENATE_APPROVAL: "PENDING_SENATE_APPROVAL",
  IN_REVIEW: "IN_REVIEW",
  ADOPTED: "ADOPTED",
}
exports.CurriculumStatus = CurriculumStatus;

const MouStatus = {
  DRAFT: "DRAFT",
  UNDER_REVIEW: "UNDER_REVIEW",
  ACTIVE: "ACTIVE",
  RENEWED: "RENEWED",
}
exports.MouStatus = MouStatus;

const OfferStatus = {
  DRAFT: "DRAFT",
  SENT: "SENT",
  ACCEPTED: "ACCEPTED",
  DECLINED: "DECLINED",
}
exports.OfferStatus = OfferStatus;

const SkillImportance = {
  REQUIRED: "REQUIRED",
  PREFERRED: "PREFERRED",
}
exports.SkillImportance = SkillImportance;

const SkillLevel = {
  BASIC: "BASIC",
  INTERMEDIATE: "INTERMEDIATE",
  ADVANCED: "ADVANCED",
}
exports.SkillLevel = SkillLevel;

const UserRole = {
  STUDENT: "STUDENT",
  INDUSTRY: "INDUSTRY",
  COLLEGE: "COLLEGE",
}
exports.UserRole = UserRole;

const connectorConfig = {
  connector: 'skillsetu',
  service: 'sih-gat054akash3sectors',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;
const dataConnectSettings = {
  cacheSettings: {
    cacheProvider: makeMemoryCacheProvider()
  }
};
exports.dataConnectSettings = dataConnectSettings;

const upsertStudentProfileRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertStudentProfile', inputVars);
}
upsertStudentProfileRef.operationName = 'UpsertStudentProfile';
exports.upsertStudentProfileRef = upsertStudentProfileRef;

exports.upsertStudentProfile = function upsertStudentProfile(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertStudentProfileRef(dcInstance, inputVars));
}
;

const upsertUserProfileRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertUserProfile', inputVars);
}
upsertUserProfileRef.operationName = 'UpsertUserProfile';
exports.upsertUserProfileRef = upsertUserProfileRef;

exports.upsertUserProfile = function upsertUserProfile(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertUserProfileRef(dcInstance, inputVars));
}
;

const upsertCompanyRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertCompany', inputVars);
}
upsertCompanyRef.operationName = 'UpsertCompany';
exports.upsertCompanyRef = upsertCompanyRef;

exports.upsertCompany = function upsertCompany(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertCompanyRef(dcInstance, inputVars));
}
;

const updateMyCompanyRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateMyCompany', inputVars);
}
updateMyCompanyRef.operationName = 'UpdateMyCompany';
exports.updateMyCompanyRef = updateMyCompanyRef;

exports.updateMyCompany = function updateMyCompany(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateMyCompanyRef(dcInstance, inputVars));
}
;

const upsertCollegeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertCollege', inputVars);
}
upsertCollegeRef.operationName = 'UpsertCollege';
exports.upsertCollegeRef = upsertCollegeRef;

exports.upsertCollege = function upsertCollege(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertCollegeRef(dcInstance, inputVars));
}
;

const createMyCollegeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateMyCollege', inputVars);
}
createMyCollegeRef.operationName = 'CreateMyCollege';
exports.createMyCollegeRef = createMyCollegeRef;

exports.createMyCollege = function createMyCollege(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createMyCollegeRef(dcInstance, inputVars));
}
;

const updateMyCollegeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateMyCollege', inputVars);
}
updateMyCollegeRef.operationName = 'UpdateMyCollege';
exports.updateMyCollegeRef = updateMyCollegeRef;

exports.updateMyCollege = function updateMyCollege(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateMyCollegeRef(dcInstance, inputVars));
}
;

const createSkillRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateSkill', inputVars);
}
createSkillRef.operationName = 'CreateSkill';
exports.createSkillRef = createSkillRef;

exports.createSkill = function createSkill(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createSkillRef(dcInstance, inputVars));
}
;

const upsertUserSkillRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertUserSkill', inputVars);
}
upsertUserSkillRef.operationName = 'UpsertUserSkill';
exports.upsertUserSkillRef = upsertUserSkillRef;

exports.upsertUserSkill = function upsertUserSkill(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertUserSkillRef(dcInstance, inputVars));
}
;

const createCandidateProjectRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateCandidateProject', inputVars);
}
createCandidateProjectRef.operationName = 'CreateCandidateProject';
exports.createCandidateProjectRef = createCandidateProjectRef;

exports.createCandidateProject = function createCandidateProject(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createCandidateProjectRef(dcInstance, inputVars));
}
;

const createCandidateExperienceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateCandidateExperience', inputVars);
}
createCandidateExperienceRef.operationName = 'CreateCandidateExperience';
exports.createCandidateExperienceRef = createCandidateExperienceRef;

exports.createCandidateExperience = function createCandidateExperience(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createCandidateExperienceRef(dcInstance, inputVars));
}
;

const createCandidateEducationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateCandidateEducation', inputVars);
}
createCandidateEducationRef.operationName = 'CreateCandidateEducation';
exports.createCandidateEducationRef = createCandidateEducationRef;

exports.createCandidateEducation = function createCandidateEducation(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createCandidateEducationRef(dcInstance, inputVars));
}
;

const createProfileEducationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateProfileEducation', inputVars);
}
createProfileEducationRef.operationName = 'CreateProfileEducation';
exports.createProfileEducationRef = createProfileEducationRef;

exports.createProfileEducation = function createProfileEducation(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createProfileEducationRef(dcInstance, inputVars));
}
;

const updateMyProfileEducationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateMyProfileEducation', inputVars);
}
updateMyProfileEducationRef.operationName = 'UpdateMyProfileEducation';
exports.updateMyProfileEducationRef = updateMyProfileEducationRef;

exports.updateMyProfileEducation = function updateMyProfileEducation(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateMyProfileEducationRef(dcInstance, inputVars));
}
;

const deleteMyDuplicateEducationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteMyDuplicateEducation', inputVars);
}
deleteMyDuplicateEducationRef.operationName = 'DeleteMyDuplicateEducation';
exports.deleteMyDuplicateEducationRef = deleteMyDuplicateEducationRef;

exports.deleteMyDuplicateEducation = function deleteMyDuplicateEducation(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteMyDuplicateEducationRef(dcInstance, inputVars));
}
;

const createJobRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateJob', inputVars);
}
createJobRef.operationName = 'CreateJob';
exports.createJobRef = createJobRef;

exports.createJob = function createJob(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createJobRef(dcInstance, inputVars));
}
;

const upsertJobRequiredSkillRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertJobRequiredSkill', inputVars);
}
upsertJobRequiredSkillRef.operationName = 'UpsertJobRequiredSkill';
exports.upsertJobRequiredSkillRef = upsertJobRequiredSkillRef;

exports.upsertJobRequiredSkill = function upsertJobRequiredSkill(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertJobRequiredSkillRef(dcInstance, inputVars));
}
;

const createInternshipRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateInternship', inputVars);
}
createInternshipRef.operationName = 'CreateInternship';
exports.createInternshipRef = createInternshipRef;

exports.createInternship = function createInternship(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createInternshipRef(dcInstance, inputVars));
}
;

const upsertInternshipRequiredSkillRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertInternshipRequiredSkill', inputVars);
}
upsertInternshipRequiredSkillRef.operationName = 'UpsertInternshipRequiredSkill';
exports.upsertInternshipRequiredSkillRef = upsertInternshipRequiredSkillRef;

exports.upsertInternshipRequiredSkill = function upsertInternshipRequiredSkill(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertInternshipRequiredSkillRef(dcInstance, inputVars));
}
;

const createApplicationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateApplication', inputVars);
}
createApplicationRef.operationName = 'CreateApplication';
exports.createApplicationRef = createApplicationRef;

exports.createApplication = function createApplication(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createApplicationRef(dcInstance, inputVars));
}
;

const updateApplicationStageRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateApplicationStage', inputVars);
}
updateApplicationStageRef.operationName = 'UpdateApplicationStage';
exports.updateApplicationStageRef = updateApplicationStageRef;

exports.updateApplicationStage = function updateApplicationStage(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateApplicationStageRef(dcInstance, inputVars));
}
;

const createInterviewRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateInterview', inputVars);
}
createInterviewRef.operationName = 'CreateInterview';
exports.createInterviewRef = createInterviewRef;

exports.createInterview = function createInterview(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createInterviewRef(dcInstance, inputVars));
}
;

const createChallengeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateChallenge', inputVars);
}
createChallengeRef.operationName = 'CreateChallenge';
exports.createChallengeRef = createChallengeRef;

exports.createChallenge = function createChallenge(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createChallengeRef(dcInstance, inputVars));
}
;

const createChallengeSubmissionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateChallengeSubmission', inputVars);
}
createChallengeSubmissionRef.operationName = 'CreateChallengeSubmission';
exports.createChallengeSubmissionRef = createChallengeSubmissionRef;

exports.createChallengeSubmission = function createChallengeSubmission(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createChallengeSubmissionRef(dcInstance, inputVars));
}
;

const createOfferRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateOffer', inputVars);
}
createOfferRef.operationName = 'CreateOffer';
exports.createOfferRef = createOfferRef;

exports.createOffer = function createOffer(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createOfferRef(dcInstance, inputVars));
}
;

const createCurriculumModuleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateCurriculumModule', inputVars);
}
createCurriculumModuleRef.operationName = 'CreateCurriculumModule';
exports.createCurriculumModuleRef = createCurriculumModuleRef;

exports.createCurriculumModule = function createCurriculumModule(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createCurriculumModuleRef(dcInstance, inputVars));
}
;

const upsertHiringPreferencesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertHiringPreferences', inputVars);
}
upsertHiringPreferencesRef.operationName = 'UpsertHiringPreferences';
exports.upsertHiringPreferencesRef = upsertHiringPreferencesRef;

exports.upsertHiringPreferences = function upsertHiringPreferences(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertHiringPreferencesRef(dcInstance, inputVars));
}
;

const listCompaniesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListCompanies');
}
listCompaniesRef.operationName = 'ListCompanies';
exports.listCompaniesRef = listCompaniesRef;

exports.listCompanies = function listCompanies(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listCompaniesRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getCompanyRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetCompany', inputVars);
}
getCompanyRef.operationName = 'GetCompany';
exports.getCompanyRef = getCompanyRef;

exports.getCompany = function getCompany(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getCompanyRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getMyCompanyRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyCompany');
}
getMyCompanyRef.operationName = 'GetMyCompany';
exports.getMyCompanyRef = getMyCompanyRef;

exports.getMyCompany = function getMyCompany(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(getMyCompanyRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getMyCollegeRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyCollege');
}
getMyCollegeRef.operationName = 'GetMyCollege';
exports.getMyCollegeRef = getMyCollegeRef;

exports.getMyCollege = function getMyCollege(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(getMyCollegeRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getMyEducationRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyEducation');
}
getMyEducationRef.operationName = 'GetMyEducation';
exports.getMyEducationRef = getMyEducationRef;

exports.getMyEducation = function getMyEducation(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(getMyEducationRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listCollegesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListColleges');
}
listCollegesRef.operationName = 'ListColleges';
exports.listCollegesRef = listCollegesRef;

exports.listColleges = function listColleges(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listCollegesRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getMyProfileRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyProfile');
}
getMyProfileRef.operationName = 'GetMyProfile';
exports.getMyProfileRef = getMyProfileRef;

exports.getMyProfile = function getMyProfile(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(getMyProfileRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const searchCandidatesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'SearchCandidates', inputVars);
}
searchCandidatesRef.operationName = 'SearchCandidates';
exports.searchCandidatesRef = searchCandidatesRef;

exports.searchCandidates = function searchCandidates(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, false);
  return executeQuery(searchCandidatesRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getCandidateProfileRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetCandidateProfile', inputVars);
}
getCandidateProfileRef.operationName = 'GetCandidateProfile';
exports.getCandidateProfileRef = getCandidateProfileRef;

exports.getCandidateProfile = function getCandidateProfile(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getCandidateProfileRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listJobsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListJobs');
}
listJobsRef.operationName = 'ListJobs';
exports.listJobsRef = listJobsRef;

exports.listJobs = function listJobs(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listJobsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listInternshipsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListInternships');
}
listInternshipsRef.operationName = 'ListInternships';
exports.listInternshipsRef = listInternshipsRef;

exports.listInternships = function listInternships(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listInternshipsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listMyApplicationsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListMyApplications');
}
listMyApplicationsRef.operationName = 'ListMyApplications';
exports.listMyApplicationsRef = listMyApplicationsRef;

exports.listMyApplications = function listMyApplications(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listMyApplicationsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listCompanyApplicationsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListCompanyApplications', inputVars);
}
listCompanyApplicationsRef.operationName = 'ListCompanyApplications';
exports.listCompanyApplicationsRef = listCompanyApplicationsRef;

exports.listCompanyApplications = function listCompanyApplications(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listCompanyApplicationsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listMyInterviewsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListMyInterviews');
}
listMyInterviewsRef.operationName = 'ListMyInterviews';
exports.listMyInterviewsRef = listMyInterviewsRef;

exports.listMyInterviews = function listMyInterviews(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listMyInterviewsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listCompanyInterviewsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListCompanyInterviews', inputVars);
}
listCompanyInterviewsRef.operationName = 'ListCompanyInterviews';
exports.listCompanyInterviewsRef = listCompanyInterviewsRef;

exports.listCompanyInterviews = function listCompanyInterviews(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listCompanyInterviewsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listChallengesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListChallenges');
}
listChallengesRef.operationName = 'ListChallenges';
exports.listChallengesRef = listChallengesRef;

exports.listChallenges = function listChallenges(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listChallengesRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getChallengeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetChallenge', inputVars);
}
getChallengeRef.operationName = 'GetChallenge';
exports.getChallengeRef = getChallengeRef;

exports.getChallenge = function getChallenge(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getChallengeRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listChallengeSubmissionsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListChallengeSubmissions', inputVars);
}
listChallengeSubmissionsRef.operationName = 'ListChallengeSubmissions';
exports.listChallengeSubmissionsRef = listChallengeSubmissionsRef;

exports.listChallengeSubmissions = function listChallengeSubmissions(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listChallengeSubmissionsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listMyOffersRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListMyOffers');
}
listMyOffersRef.operationName = 'ListMyOffers';
exports.listMyOffersRef = listMyOffersRef;

exports.listMyOffers = function listMyOffers(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listMyOffersRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listMoUsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListMoUs');
}
listMoUsRef.operationName = 'ListMoUs';
exports.listMoUsRef = listMoUsRef;

exports.listMoUs = function listMoUs(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listMoUsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listMoUsForCollegeRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListMoUsForCollege');
}
listMoUsForCollegeRef.operationName = 'ListMoUsForCollege';
exports.listMoUsForCollegeRef = listMoUsForCollegeRef;

exports.listMoUsForCollege = function listMoUsForCollege(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listMoUsForCollegeRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listSkillsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListSkills');
}
listSkillsRef.operationName = 'ListSkills';
exports.listSkillsRef = listSkillsRef;

exports.listSkills = function listSkills(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listSkillsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listMySkillsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListMySkills');
}
listMySkillsRef.operationName = 'ListMySkills';
exports.listMySkillsRef = listMySkillsRef;

exports.listMySkills = function listMySkills(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listMySkillsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listCompanyJobsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListCompanyJobs', inputVars);
}
listCompanyJobsRef.operationName = 'ListCompanyJobs';
exports.listCompanyJobsRef = listCompanyJobsRef;

exports.listCompanyJobs = function listCompanyJobs(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listCompanyJobsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listCompanyInternshipsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListCompanyInternships', inputVars);
}
listCompanyInternshipsRef.operationName = 'ListCompanyInternships';
exports.listCompanyInternshipsRef = listCompanyInternshipsRef;

exports.listCompanyInternships = function listCompanyInternships(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listCompanyInternshipsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listCompanyChallengesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListCompanyChallenges', inputVars);
}
listCompanyChallengesRef.operationName = 'ListCompanyChallenges';
exports.listCompanyChallengesRef = listCompanyChallengesRef;

exports.listCompanyChallenges = function listCompanyChallenges(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listCompanyChallengesRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;
