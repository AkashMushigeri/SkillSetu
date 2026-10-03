const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');

const source = fs.readFileSync('src/server/ai/interviewService.ts', 'utf8');
const code = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const moduleRef = { exports: {} };
new Function('module', 'exports', code)(moduleRef, moduleRef.exports);

(async () => {
  const previousKey = process.env.GEMINI_API_KEY;
  delete process.env.GEMINI_API_KEY;
  const result = await moduleRef.exports.evaluateInterview('Frontend React Developer', [
    { sender: 'ai', text: 'How would you manage UI state?' },
    { sender: 'user', text: 'I use React state and test edge cases because it keeps the component behavior predictable.' },
  ]);
  assert.equal(result.source, 'rubric');
  for (const field of ['overallScore', 'technicalScore', 'communicationScore', 'confidenceScore']) {
    assert.ok(Number.isFinite(result[field]) && result[field] >= 0 && result[field] <= 100);
  }
  assert.ok(Array.isArray(result.strengths));
  assert.ok(Array.isArray(result.improvements));
  assert.match(result.feedback, /transcript-only practice rubric/);
  if (previousKey !== undefined) process.env.GEMINI_API_KEY = previousKey;
  console.log('AI interview evaluation fallback check passed');
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
