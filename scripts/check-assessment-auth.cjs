const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');

function loadRoute() {
  const source = fs.readFileSync('src/app/api/skills/generate-assessment/route.ts', 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const moduleRef = { exports: {} };
  new Function('require', 'module', 'exports', code)((name) => {
    if (name === 'next/server') return { NextResponse: { json: (body, init) => Response.json(body, init) } };
    if (name === '@/server/rateLimit') return { verifyAppCheckHeader: async () => ({ isValid: true }), checkRateLimit: async () => ({ success: true }) };
    if (name === '@/server/verifyFirebaseUser') return { verifyFirebaseUser: async () => null };
    if (name === '@/server/assessmentAttempts') return { createAssessmentAttempt: async () => ({ id: 'attempt-1' }) };
    return require(name);
  }, moduleRef, moduleRef.exports);
  return moduleRef.exports;
}

(async () => {
  const previousKey = process.env.GEMINI_API_KEY;
  delete process.env.GEMINI_API_KEY;
  const route = loadRoute();
  const response = await route.POST(new Request('http://localhost/api/skills/generate-assessment', {
    method: 'POST', body: JSON.stringify({ skillName: 'React' }), headers: { 'Content-Type': 'application/json' },
  }));
  assert.equal(response.status, 401);
  if (previousKey === undefined) delete process.env.GEMINI_API_KEY;
  else process.env.GEMINI_API_KEY = previousKey;
  console.log('Assessment authentication check passed');
})();
