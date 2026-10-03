const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');

const source = fs.readFileSync('src/server/verifyFirebaseUser.ts', 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const moduleRef = { exports: {} };
new Function('module', 'exports', code)(moduleRef, moduleRef.exports);
const { verifyFirebaseUser } = moduleRef.exports;

const previousKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const previousFetch = global.fetch;
process.env.NEXT_PUBLIC_FIREBASE_API_KEY = 'test-key';
let calls = 0;
global.fetch = async () => {
  calls++;
  return { ok: true, json: async () => ({ users: [{ localId: 'student-1' }] }) };
};

(async () => {
  delete process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  assert.equal(await verifyFirebaseUser(new Request('http://localhost')), null);
  assert.equal(calls, 0);
  assert.equal(await verifyFirebaseUser(new Request('http://localhost', { headers: { Authorization: 'Bearer valid' } })), 'student-1');
  assert.equal(calls, 1);

  calls = 0;
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY = 'test-key';
  assert.equal(await verifyFirebaseUser(new Request('http://localhost')), null);
  assert.equal(calls, 0);
  assert.equal(await verifyFirebaseUser(new Request('http://localhost', { headers: { Authorization: 'Bearer valid' } })), 'student-1');
  global.fetch = async () => ({ ok: false });
  assert.equal(await verifyFirebaseUser(new Request('http://localhost', { headers: { Authorization: 'Bearer invalid' } })), null);
  console.log('AI authentication checks passed');
})().finally(() => {
  global.fetch = previousFetch;
  if (previousKey === undefined) delete process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  else process.env.NEXT_PUBLIC_FIREBASE_API_KEY = previousKey;
});
