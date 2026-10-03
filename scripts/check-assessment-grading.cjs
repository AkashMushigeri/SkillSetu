const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');

const source = fs.readFileSync('src/server/assessmentScoring.ts', 'utf8');
const code = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const moduleRef = { exports: {} };
new Function('module', 'exports', code)(moduleRef, moduleRef.exports);

const questions = [
  { id: 1, correctIndex: 2, topic: 'Arrays', explanation: 'Correct option is C.' },
  { id: 2, correctIndex: 0, topic: 'Async', explanation: 'Correct option is A.' },
  { id: 3, correctIndex: 3, topic: 'Types', explanation: 'Correct option is D.' },
  { id: 4, correctIndex: 1, topic: 'Loops', explanation: 'Correct option is B.' },
  { id: 5, correctIndex: 2, topic: 'Objects', explanation: 'Correct option is C.' },
  { id: 6, correctIndex: 0, topic: 'Errors', explanation: 'Correct option is A.' },
  { id: 7, correctIndex: 3, topic: 'Functions', explanation: 'Correct option is D.' },
  { id: 8, correctIndex: 1, topic: 'State', explanation: 'Correct option is B.' },
  { id: 9, correctIndex: 2, topic: 'Events', explanation: 'Correct option is C.' },
  { id: 10, correctIndex: 0, topic: 'Testing', explanation: 'Correct option is A.' },
];
const answers = Object.fromEntries(questions.map((question, index) => [String(index), question.correctIndex]));
const result = moduleRef.exports.gradeAssessment(questions, answers);
assert.equal(result.score, 10);
assert.equal(result.percentage, 100);
assert.equal(result.passed, true);
assert.equal(result.weakTopics.length, 0);

answers['0'] = 1;
const failed = moduleRef.exports.gradeAssessment(questions, answers);
assert.equal(failed.score, 9);
assert.equal(failed.weakTopics[0], 'Arrays');
assert.equal(failed.questionResults[0].explanation, 'Correct option is C.');
console.log('Assessment grading behavior check passed');