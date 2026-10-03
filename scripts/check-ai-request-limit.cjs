const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');

const source = fs.readFileSync('src/app/api/ai-interview/route.ts', 'utf8');
const code = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const moduleRef = { exports: {} };
const mocks = {
  'next/server': { NextResponse: { json: (body, init) => Response.json(body, init) } },
  '@/server/ai/interviewService': {},
  '@/server/rateLimit': {
    checkRateLimit: async () => ({ success: true }),
    verifyAppCheckHeader: async () => ({ isValid: true }),
  },
  '@/server/verifyFirebaseUser': { verifyFirebaseUser: async () => 'authenticated-user' },
};
new Function('require', 'module', 'exports', code)(
  (name) => mocks[name] || require(name),
  moduleRef,
  moduleRef.exports
);

async function main() {
  const body = new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode('{"filler":"'));
      controller.enqueue(new Uint8Array(7_500_000).fill(120));
      controller.enqueue(new TextEncoder().encode('"}'));
      controller.close();
    },
  });
  const request = new Request('http://localhost/api/ai-interview', {
    method: 'POST',
    // The route authenticates before it reads the body, so the request has to
    // clear verifyAuthUser to reach the 413 branch under test. A demo_token_*
    // value is accepted outside production.
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer demo_token_bodylimit' },
    body,
    duplex: 'half',
  });

  const response = await moduleRef.exports.POST(request);
  assert.equal(response.status, 413);
  console.log('AI request body limit check passed');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});