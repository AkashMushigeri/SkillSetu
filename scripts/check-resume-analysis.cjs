const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const SRC_DIR = path.resolve(__dirname, '../src');

function load(file) {
  const source = fs.readFileSync(file, 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const module = { exports: {} };
  new Function('require', 'module', 'exports', code)(
    (name) => {
      if (name.startsWith('@/')) return load(path.resolve(SRC_DIR, `${name.slice(2)}.ts`));
      if (name.startsWith('.')) return load(path.resolve(path.dirname(file), `${name}.ts`));
      return require(name);
    },
    module,
    module.exports
  );
  return module.exports;
}

const { buildResumeAnalysis } = load(path.resolve(__dirname, '../src/lib/resumeAnalysis.ts'));
const { computeOpportunityMatch } = load(path.resolve(__dirname, '../src/lib/matchUtils.ts'));
const { mapResumeSkills, replaceResumeSkills, resumeOpportunityFit } = load(path.resolve(__dirname, '../src/lib/resumeSkillMapping.ts'));
const { getCanonicalSkillName, matchSkillNames } = load(path.resolve(__dirname, '../src/lib/skillNormalization.ts'));
const { INITIAL_SKILLS } = load(path.resolve(__dirname, '../src/data/mockStudentData.ts'));
const item = (value) => ({ value, evidence: value });
const report = buildResumeAnalysis({
  name: 'Sam', email: 'sam@example.com', phone: '1234567890', summary: 'Engineer',
  education: [item('B.Tech')], experience: [item('Built APIs')], projects: [],
  certifications: [item('AWS Cloud Practitioner')], technologies: [item('Docker'), item('React')],
  skills: [item('React.js'), item('React'), item('Python')], jobInterests: [item('Frontend Developer')],
  suggestions: [], jobRequirements: ['React', 'SQL', 'Docker'],
  signals: { clearHeadings: true, readableLayout: true, datedEntries: true, quantifiedImpact: true },
}, true);

assert.equal(report.atsScore, 100);
assert.equal(report.skills.length, 2);
assert.equal(report.certifications.length, 1);
assert.equal(report.candidateSkills.length, 3);
assert.equal(report.candidateSkills[0].canonicalName, 'react');
assert.equal(report.candidateSkills[2].source, 'Technology');
assert.equal(report.jobMatch?.score, 67);
assert.deepEqual(report.jobMatch?.missingSkills, ['SQL']);
assert.deepEqual(
  computeOpportunityMatch({ requiredSkills: ['React'] }, [{ name: 'React.js', resumeEvidence: 'Built UI in React.js', progress: 0, isVerified: false }]).matchedSkills,
  ['React']
);
const catalog = [
  { id: 'react', name: 'React', category: 'Frontend Frameworks', careerRoles: ['Frontend Developer'] },
  { id: 'js', name: 'JavaScript', category: 'Programming', careerRoles: ['Frontend Developer'] },
  { id: 'css', name: 'CSS', category: 'Web Development', careerRoles: ['Frontend Developer'] },
];
const candidate = [
  { name: 'React.js', resumeEvidence: 'Built UI', isVerified: false },
  { name: 'JavaScript', isVerified: true },
];
const mapping = mapResumeSkills(candidate, catalog, 'Frontend Developer');
assert.equal(mapping.mappedSkills[0].category, 'Web & Software');
assert.deepEqual(mapping.verifiedStrengths, ['JavaScript']);
assert.equal(mapping.targetRoles[0].coverage, 67);
assert.deepEqual(mapping.targetRoles[0].missingSkills, ['CSS']);
assert.match(mapping.recommendations[0].text, /Build CSS/);
assert.ok(mapResumeSkills(candidate, INITIAL_SKILLS, 'Frontend Developer').targetRoles.length > 0);
assert.deepEqual(resumeOpportunityFit(['React', 'CSS'], candidate.filter((s) => s.resumeEvidence)).matchedSkills, ['React']);
assert.deepEqual(resumeOpportunityFit(['React', 'React Testing Library'], [{ name: 'React' }]).missingSkills, ['React Testing Library']);
const revised = replaceResumeSkills([
  { name: 'React.js', category: 'Resume', resumeEvidence: 'Old UI', resources: [], isVerified: false },
  { name: 'SQL', category: 'Resume', resumeEvidence: 'Old SQL', resources: [], isVerified: false },
  { name: 'JavaScript', category: 'Programming', resumeEvidence: 'Old JS', resources: [{}], isVerified: true },
], [
  { name: 'React', evidence: 'New UI', source: 'Skill' },
  { name: 'Docker', evidence: 'Deployed containers', source: 'Technology' },
]);
assert.equal(revised.find((s) => s.name === 'React.js').resumeEvidence, 'New UI');
assert.equal(revised.some((s) => s.name === 'SQL'), false);
assert.equal(revised.find((s) => s.name === 'JavaScript').resumeEvidence, undefined);
assert.equal(revised.find((s) => s.name === 'JavaScript').isVerified, true);
assert.equal(revised.find((s) => s.name === 'Docker').category, 'Resume');
assert.equal(matchSkillNames('Java', 'JavaScript'), false);
assert.equal(matchSkillNames('React', 'React Testing Library'), false);
assert.equal(matchSkillNames('SQL', 'PostgreSQL'), false);
assert.equal(matchSkillNames('Node.js', 'Express'), false);
assert.equal(matchSkillNames('AWS', 'S3'), false);
assert.equal(matchSkillNames('React.js', 'React'), true);
assert.deepEqual(
  computeOpportunityMatch({ requiredSkills: ['React Testing Library'] }, [{ name: 'React', resumeEvidence: 'Built a React UI', progress: 0, isVerified: false }]).missingSkills,
  ['React Testing Library']
);
assert.equal(getCanonicalSkillName('nodejs'), getCanonicalSkillName('Node.js'));
assert.equal(matchSkillNames('C++', 'C#'), false);
const sparseReport = buildResumeAnalysis({
  education: Array.from({ length: 6 }, () => ({ value: '', evidence: '' })).concat([item('B.Sc')]),
}, false);
assert.deepEqual(sparseReport.education, [item('B.Sc')]);
assert.throws(() => buildResumeAnalysis({}, false), /No readable resume/);
console.log('Resume analysis checks passed');
