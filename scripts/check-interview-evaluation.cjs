const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const source = fs.readFileSync(path.join(__dirname, '../src/server/ai/interviewService.ts'), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const report = { overallScore: 80, technicalScore: 80, communicationScore: 80, confidenceScore: 80, feedback: 'Clear answer.', strengths: [], improvements: [] };
let calls = 0;
let status = 503;
const fetch = async () => {
  calls++;
  if (calls === 1) return { ok: false, status };
  return { ok: true, status: 200, json: async () => ({ candidates: [{ content: { parts: [{ text: JSON.stringify(report) }] } }] }) };
};
const serviceExports = {};
new Function('exports', 'process', 'fetch', 'AbortSignal', 'setTimeout', compiled)(
  serviceExports, { env: { GEMINI_API_KEY: 'test' } }, fetch, { timeout: () => undefined }, (fn) => fn()
);

(async () => {
  assert.deepEqual(
    await serviceExports.evaluateInterview('Engineer', [{ sender: 'user', text: 'I built an API.' }]),
    { ...report, source: 'gemini' },
    'a live Gemini evaluation is tagged source=gemini so the UI can tell it apart from the rubric fallback'
  );
  assert.equal(calls, 2, 'a temporary 503 should be retried');
  calls = 0;
  status = 400;
  const rubric = await serviceExports.evaluateInterview('Engineer', [{ sender: 'user', text: 'I built an API.' }]);
  assert.equal(rubric.source, 'rubric', 'a permanent 400 is not retried and falls back to the disclosed rubric');
  assert.equal(calls, 1, 'a bad request should not be retried');
  console.log('Interview evaluation retry check passed');
})().catch((error) => { console.error(error); process.exitCode = 1; });
