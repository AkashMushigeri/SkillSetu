const assert = require('node:assert/strict');
const fs = require('node:fs');

const route = fs.readFileSync('src/app/api/skills/submit-assessment/route.ts', 'utf8');
const attempts = fs.readFileSync('src/server/assessmentAttempts.ts', 'utf8');
assert.match(route, /submitAssessmentAttempt/);
assert.match(attempts, /collection\('skillAssessmentAttempts'\)/);
assert.match(attempts, /collection\('skillAssessments'\)/);
assert.match(attempts, /runTransaction/);
assert.match(attempts, /gradeAssessment/);
assert.match(attempts, /verified: result\.passed/);
console.log('Assessment persistence check passed');
