const assert = require('node:assert/strict');
const fs = require('node:fs');

const file = 'src/app/api/skills/submit-assessment/route.ts';
assert.ok(fs.existsSync(file), 'Assessment submission route is missing.');
const source = fs.readFileSync(file, 'utf8');
assert.match(source, /verifyFirebaseUser|verifyAppCheckHeader/);
assert.match(source, /submitAssessmentAttempt/);
assert.match(source, /attemptId/);
assert.match(source, /normalizeAnswers/);
assert.doesNotMatch(source, /correctIndex/);
console.log('Assessment server verification contract check passed');
