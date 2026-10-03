const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');

const source = fs.readFileSync('src/lib/seeder.ts', 'utf8');
const code = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const moduleRef = { exports: {} };
const mocks = {
  '@/lib/firebase': { db: null, dataConnect: null, saveUserProfile: async () => {} },
  '@skillsetu/dataconnect': {},
  '@/lib/dataConnectService': {},
  '@/data/industry/industrySkills': { popularTaxonomySkills: [] },
  '@/data/industry/industryCompanies': { defaultCompanyProfile: {} },
  '@/data/industry/industryColleges': { mockColleges: [] },
  '@/data/industry/industryJobs': { mockJobs: [] },
  '@/data/industry/industryInternships': { mockInternships: [] },
  '@/data/industry/industryChallenges': { mockChallenges: [] },
  '@/data/mockStudentData': { INITIAL_STUDENT_PROFILE: {} },
};
new Function('require', 'module', 'exports', code)(
  (name) => mocks[name] || require(name),
  moduleRef,
  moduleRef.exports
);

moduleRef.exports.runDatabaseSeeder().then(
  () => {
    console.error('Seeder incorrectly reported success without a database connection.');
    process.exitCode = 1;
  },
  (error) => {
    assert.match(error.message, /Data Connect is unavailable in this server runtime/);
    console.log('Seeder requires a live server-side Data Connect connection');
  }
);