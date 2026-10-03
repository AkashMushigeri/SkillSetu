const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');

function loadTypeScriptModule(file, dependencyMap) {
  const source = fs.readFileSync(file, 'utf8');
  const code = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const moduleRef = { exports: {} };
  new Function('require', 'module', 'exports', code)(
    (name) => dependencyMap[name] || require(name),
    moduleRef,
    moduleRef.exports
  );
  return moduleRef.exports;
}

const scoring = loadTypeScriptModule('src/server/assessmentScoring.ts', {});
const attempts = loadTypeScriptModule('src/server/assessmentAttempts.ts', {
  'firebase-admin/app': { getApps: () => [], initializeApp: () => ({}) },
  'firebase-admin/firestore': { FieldValue: { serverTimestamp: () => ({ serverTimestamp: true }) }, getFirestore: () => { throw new Error('Firestore should not be used in local mode'); } },
  '@/server/assessmentScoring': scoring,
});

(async () => {
  for (const key of ['GOOGLE_APPLICATION_CREDENTIALS', 'FIREBASE_CLIENT_EMAIL', 'FIREBASE_PRIVATE_KEY', 'FIRESTORE_EMULATOR_HOST']) delete process.env[key];
  process.env.NODE_ENV = 'development';
  const canonicalQuestions = Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    question: `Question ${index + 1}`,
    options: ['A', 'B', 'C', 'D'],
    correctIndex: index % 4,
    explanation: `Explanation ${index + 1}`,
    topic: `Topic ${index + 1}`,
  }));
  const attempt = await attempts.createAssessmentAttempt({
    userId: 'student-1', skillId: 'skill-1', skillName: 'Test Skill', skillTier: 'Basic', skillCategory: 'Technical', questions: canonicalQuestions,
  });
  assert.match(attempt.attemptId, /^[A-Za-z0-9_-]{20}$/);
  assert.equal(attempt.questions.length, 10);
  assert.ok(attempt.questions.every((question) => question.correctIndex === -1 && question.explanation === ''));
  const answers = Object.fromEntries(canonicalQuestions.map((question, index) => [String(index), question.correctIndex]));
  const result = await attempts.submitAssessmentAttempt({ userId: 'student-1', attemptId: attempt.attemptId, answers });
  assert.equal(result.score, 10);
  assert.equal(result.passed, true);
  assert.equal(result.questionResults[0].explanation, 'Explanation 1');
  await assert.rejects(
    attempts.submitAssessmentAttempt({ userId: 'student-1', attemptId: attempt.attemptId, answers }),
    /already been submitted/
  );
  console.log('Assessment attempt flow check passed');
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
