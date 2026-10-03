const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');

function load(file, mockedRequire = require) {
  const source = fs.readFileSync(file, 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const moduleRef = { exports: {} };
  new Function('require', 'module', 'exports', code)(mockedRequire, moduleRef, moduleRef.exports);
  return moduleRef.exports;
}

const previous = {
  nodeEnv: process.env.NODE_ENV,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  redisUrl: process.env.UPSTASH_REDIS_REST_URL,
  redisToken: process.env.UPSTASH_REDIS_REST_TOKEN,
  openAiKey: process.env.OPENAI_API_KEY,
  geminiKey: process.env.GEMINI_API_KEY,
  fetch: global.fetch,
  warn: console.warn,
  log: console.log,
};

(async () => {
  process.env.NODE_ENV = 'production';
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = 'test-project';
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;

  let verifiedToken = null;
  const mockedRequire = (name) => {
    if (name === 'firebase-admin/app') return { getApps: () => [], initializeApp: () => ({ name: 'skillsetu-app-check' }) };
    if (name === 'firebase-admin/app-check') return { getAppCheck: () => ({ verifyToken: async (token) => {
      verifiedToken = token;
      if (token !== 'signed-token') throw new Error('invalid signature');
    } }) };
    return require(name);
  };
  const first = load('src/server/rateLimit.ts', mockedRequire);
  const second = load('src/server/rateLimit.ts', mockedRequire);
  const request = (token) => new Request('http://localhost/api/ai-interview', { headers: token ? { 'X-Firebase-AppCheck': token } : {} });

  assert.equal((await first.verifyAppCheckHeader(request())).isValid, false);
  assert.equal((await first.verifyAppCheckHeader(request('long-but-forged-token'))).isValid, false);
  assert.equal(verifiedToken, 'long-but-forged-token');
  assert.equal((await first.verifyAppCheckHeader(request('signed-token'))).isValid, true);
  assert.equal((await first.checkRateLimit('student', 1, 60)).unavailable, true);

  process.env.UPSTASH_REDIS_REST_URL = 'https://redis.example';
  process.env.UPSTASH_REDIS_REST_TOKEN = 'test-token';
  let count = 0;
  global.fetch = async (url, options) => {
    assert.equal(url, 'https://redis.example/multi-exec');
    assert.deepEqual(JSON.parse(options.body)[0], ['INCR', 'ratelimit:ai_interview:student']);
    return { ok: true, json: async () => [{ result: String(++count) }, { result: 1 }, { result: 60 }] };
  };
  assert.equal((await first.checkRateLimit('student', 1, 60)).success, true);
  const sharedLimit = await second.checkRateLimit('student', 1, 60);
  assert.equal(sharedLimit.success, false);
  assert.equal(sharedLimit.unavailable, undefined);

  global.fetch = async () => ({ ok: true, json: async () => [{ result: 1 }, { result: 1 }, { result: 0 }] });
  assert.equal((await first.checkRateLimit('student', 1, 60)).success, true);

  console.warn = () => {};
  global.fetch = async () => ({ ok: true, json: async () => [{ error: 'unknown command' }, { result: 1 }, { result: 60 }] });
  assert.equal((await first.checkRateLimit('student', 1, 60)).unavailable, true);
  global.fetch = async () => { throw new Error('Redis offline'); };
  assert.equal((await first.checkRateLimit('student', 1, 60)).unavailable, true);

  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;
  process.env.NODE_ENV = 'development';
  assert.equal((await first.checkRateLimit('local-student', 1, 60)).success, true);
  assert.equal((await first.checkRateLimit('local-student', 1, 60)).success, false);

  process.env.OPENAI_API_KEY = 'test-key';
  const logs = [];
  console.log = (...args) => logs.push(args.join(' '));
  console.warn = (...args) => logs.push(args.join(' '));
  global.fetch = async () => ({ ok: true, json: async () => ({ text: 'private spoken answer' }) });
  const interview = load('src/server/ai/interviewService.ts');
  assert.equal(await interview.transcribeAudioWithOpenAI('YQ=='), 'private spoken answer');
  assert.equal(logs.some((line) => line.includes('private spoken answer')), false);

  process.env.GEMINI_API_KEY = 'test-key';
  const route = load('src/app/api/resume-analysis/route.ts', (name) => {
    if (name === 'next/server') return { NextResponse: { json: (body, init) => Response.json(body, init) } };
    if (name === '@/lib/resumeAnalysis') return { buildResumeAnalysis: () => ({ ok: true }) };
    if (name === '@/server/rateLimit') return { verifyAppCheckHeader: async () => ({ isValid: true }), checkRateLimit: async () => ({ success: true }) };
    if (name === '@/server/verifyFirebaseUser') return { verifyFirebaseUser: async () => 'student' };
    return require(name);
  });
  const chunks = [
    Buffer.from('--resume\r\nContent-Disposition: form-data; name="resume"; filename="large.pdf"\r\nContent-Type: application/pdf\r\n\r\n'),
    Buffer.alloc(4 * 1024 * 1024 + 100_000, 65),
    Buffer.from('\r\n--resume--\r\n'),
  ];
  const stream = new ReadableStream({ pull(controller) {
    if (chunks.length) controller.enqueue(chunks.shift());
    else controller.close();
  } });
  const largeRequest = new Request('http://localhost/api/resume-analysis', {
    method: 'POST', headers: { 'Content-Type': 'multipart/form-data; boundary=resume' }, body: stream, duplex: 'half',
  });
  assert.equal((await route.POST(largeRequest)).status, 413);
  const smallForm = new FormData();
  smallForm.append('resume', new File(['%PDF-1.4'], 'small.pdf', { type: 'application/pdf' }));
  global.fetch = async () => ({ ok: true, json: async () => ({ candidates: [{ content: { parts: [{ text: '{}' }] } }] }) });
  assert.equal((await route.POST(new Request('http://localhost/api/resume-analysis', { method: 'POST', body: smallForm }))).status, 200);

  previous.log('AI endpoint hardening checks passed');
})().finally(() => {
  for (const [key, value] of Object.entries({ NODE_ENV: previous.nodeEnv, NEXT_PUBLIC_FIREBASE_PROJECT_ID: previous.projectId,
    UPSTASH_REDIS_REST_URL: previous.redisUrl, UPSTASH_REDIS_REST_TOKEN: previous.redisToken,
    OPENAI_API_KEY: previous.openAiKey, GEMINI_API_KEY: previous.geminiKey })) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  global.fetch = previous.fetch;
  console.warn = previous.warn;
  console.log = previous.log;
});
