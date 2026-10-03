const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const connector = path.join(__dirname, '..', 'dataconnect', 'connector');
const queries = fs.readFileSync(path.join(connector, 'queries.gql'), 'utf8');
const mutations = fs.readFileSync(path.join(connector, 'mutations.gql'), 'utf8');

function operation(source, kind, name) {
  const match = source.match(new RegExp(`(?:^|\\n)${kind} ${name}\\b([\\s\\S]*?)(?=\\n(?:query|mutation) |$)`));
  assert.ok(match, `${name} is missing`);
  return match[1];
}

for (const name of ['ListCompanyApplications', 'ListCompanyInterviews', 'ListCompanyJobs', 'ListCompanyInternships', 'ListCompanyChallenges', 'ListChallengeSubmissions']) {
  const body = operation(queries, 'query', name);
  assert.match(body, /auth\.token\.userRole == 'INDUSTRY'/, `${name} needs the recruiter role`);
  assert.match(body, /ownerUid @check\(expr: "this == auth\.uid"|ownerUid: \{ eq_expr: "auth\.uid" \}/, `${name} needs owner validation`);
  assert.match(body, /@check\(expr: "this != null"|ownerUid @check/, `${name} needs a rejecting check`);
}

assert.match(operation(queries, 'query', 'ListMoUs'), /company: \{ ownerUid: \{ eq_expr: "auth\.uid" \} \}/);

const candidateProfile = operation(queries, 'query', 'GetCandidateProfile');
assert.match(candidateProfile, /auth\.token\.userRole in \['INDUSTRY', 'COLLEGE'\]/);
assert.match(candidateProfile, /user\(key: \{ uid: \$uid \}\) @check\(expr: "this != null && this\.role == 'STUDENT'/);

for (const name of ['UpsertCompany', 'UpdateMyCompany']) {
  assert.match(operation(mutations, 'mutation', name), /auth\.token\.userRole == 'INDUSTRY'/, `${name} needs the industry role`);
}
assert.match(operation(mutations, 'mutation', 'UpsertCompany'), /ownerUid_expr: "auth\.uid"/);
assert.match(operation(mutations, 'mutation', 'UpdateMyCompany'), /ownerUid: \{ eq_expr: "auth\.uid" \}/);

for (const name of ['UpsertCollege', 'CreateMyCollege', 'UpdateMyCollege']) {
  assert.match(operation(mutations, 'mutation', name), /auth\.token\.userRole == 'COLLEGE'/, `${name} needs the college role`);
}
for (const name of ['UpsertCollege', 'CreateMyCollege']) {
  assert.match(operation(mutations, 'mutation', name), /ownerUid_expr: "auth\.uid"/, `${name} must bind ownership to the caller`);
}
assert.match(operation(mutations, 'mutation', 'UpdateMyCollege'), /ownerUid: \{ eq_expr: "auth\.uid" \}/);

const upsertUserSkill = operation(mutations, 'mutation', 'UpsertUserSkill');
assert.match(upsertUserSkill, /auth\.token\.userRole == 'STUDENT'/);
assert.match(upsertUserSkill, /verified: false/);
assert.doesNotMatch(upsertUserSkill, /verified: \$|score: \$|verificationDate: \$|badgeUrl: \$/);

assert.match(operation(mutations, 'mutation', 'UpsertUserProfile'), /auth\.token\.userRole == vars\.role/);
assert.match(operation(mutations, 'mutation', 'UpsertStudentProfile'), /auth\.token\.userRole == 'STUDENT'/);
assert.match(operation(mutations, 'mutation', 'CreateSkill'), /auth\.token\.admin == true/);
for (const name of ['CreateCandidateProject', 'CreateCandidateExperience', 'CreateCandidateEducation', 'CreateProfileEducation', 'UpdateMyProfileEducation', 'DeleteMyDuplicateEducation']) {
  assert.match(operation(mutations, 'mutation', name), /auth\.token\.userRole == 'STUDENT'/, `${name} needs a trusted student role`);
}

for (const name of ['CreateJob', 'UpsertJobRequiredSkill', 'CreateInternship', 'UpsertInternshipRequiredSkill', 'UpdateApplicationStage', 'CreateInterview', 'CreateChallenge', 'CreateOffer', 'CreateCurriculumModule', 'UpsertHiringPreferences']) {
  const body = operation(mutations, 'mutation', name);
  assert.match(body, /auth\.token\.userRole == 'INDUSTRY'/, `${name} needs the recruiter role`);
  assert.match(body, /@transaction/, `${name} needs an atomic authorization check`);
  assert.match(body, /query @redact/, `${name} needs a server-side lookup`);
  assert.match(body, /ownerUid @check\(expr: "this == auth\.uid"|ownerUid: \{ eq_expr: "auth\.uid" \}/, `${name} needs owner validation`);
}

assert.match(operation(mutations, 'mutation', 'CreateOffer'), /companyId: \$companyId/);
assert.doesNotMatch(operation(mutations, 'mutation', 'CreateInterview'), /applicationId/);

const application = operation(mutations, 'mutation', 'CreateApplication');
assert.match(application, /@transaction/);
assert.match(application, /company\(id: \$companyId\)/);
assert.match(application, /ownedJob: jobs_on_company\(where: \{ id: \{ eq: \$opportunityId \} \}/);
assert.match(application, /ownedInternship: internships_on_company\(where: \{ id: \{ eq: \$opportunityId \} \}/);
assert.match(application, /@check\(expr: "this != null &&/);
const applicationService = fs.readFileSync(path.join(__dirname, '..', 'src', 'lib', 'dataConnectService.ts'), 'utf8');
assert.doesNotMatch(applicationService, /DEFAULT_DEMO_COMPANY_ID/);
console.log('Company and application ownership guards are present.');
