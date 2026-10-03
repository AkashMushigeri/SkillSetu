const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');

const authContext = fs.readFileSync('src/context/AuthContext.tsx', 'utf8');
const firebaseClient = fs.readFileSync('src/lib/firebase.ts', 'utf8');
assert.match(authContext, /const effectiveRole = trustedRole \|\| 'STUDENT';/);
assert.doesNotMatch(authContext, /trustedRole \|\| preferredRole \|\| profile\?\.role \|\| getUserRole/);
assert.match(firebaseClient, /callback\(user as ExtendedUser\)/);
assert.doesNotMatch(firebaseClient, /customClaims:\s*\{\s*role:\s*storedRole/);

const source = fs.readFileSync('functions/src/index.ts', 'utf8');
const code = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;

const claimUpdates = [];
const users = new Map([
  ['recruiter-target', { featureAccess: 'kept', role: 'STUDENT', userRole: 'STUDENT' }],
]);
const documents = [];
const admin = {
  initializeApp() {},
  auth: () => ({
    setCustomUserClaims: async (uid, claims) => {
      claimUpdates.push({ uid, claims });
      users.set(uid, claims);
    },
    getUser: async (uid) => ({ customClaims: users.get(uid) || {} }),
    updateUser: async () => {},
  }),
  firestore: () => ({
    collection: (name) => ({
      doc: (id) => ({ set: async (data) => documents.push({ name, id, data }) }),
    }),
  }),
};
admin.firestore.FieldValue = { serverTimestamp: () => 'server-time' };

class HttpsError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

const mocks = {
  'firebase-functions/v2': { logger: { info() {}, error() {} } },
  'firebase-functions/v2/https': {
    HttpsError,
    onCall: (...args) => args[args.length - 1],
  },
  'firebase-functions/v1': { auth: { user: () => ({ onCreate: (handler) => handler }) } },
  'firebase-admin': admin,
};
const moduleRef = { exports: {} };
new Function('require', 'module', 'exports', code)(
  (name) => mocks[name] || require(name),
  moduleRef,
  moduleRef.exports
);

async function main() {
  const { registerUserWithRole, updateUserRole } = moduleRef.exports;

  const pending = await registerUserWithRole({
    auth: { uid: 'self-registering-user', token: { email: 'attacker@example.com' } },
    data: { role: 'INDUSTRY', displayName: 'Attacker' },
  });
  assert.equal(pending.pendingApproval, true);
  assert.equal(claimUpdates.length, 0, 'self-registration must not grant a privileged role');
  assert.equal(documents[0].name, 'pendingRegistrations');
  assert.equal(documents[0].data.processed, false);

  await assert.rejects(
    registerUserWithRole({
      auth: { uid: 'oversized-profile', token: {} },
      data: { role: 'STUDENT', displayName: 'x'.repeat(121) },
    }),
    (error) => error.code === 'invalid-argument'
  );

  await assert.rejects(
    updateUserRole({
      auth: { uid: 'untrusted-recruiter', token: { role: 'INDUSTRY' } },
      data: { targetUid: 'recruiter-target', role: 'INDUSTRY' },
    }),
    (error) => error.code === 'permission-denied'
  );
  await assert.rejects(
    updateUserRole({
      auth: { uid: 'trusted-admin', token: { admin: true } },
      data: { targetUid: 'x'.repeat(129), role: 'INDUSTRY' },
    }),
    (error) => error.code === 'invalid-argument'
  );
  assert.equal(claimUpdates.length, 0, 'non-admin callers must not assign roles');

  await updateUserRole({
    auth: { uid: 'trusted-admin', token: { admin: true } },
    data: { targetUid: 'recruiter-target', role: 'INDUSTRY' },
  });
  assert.deepEqual(claimUpdates.at(-1), {
    uid: 'recruiter-target',
    claims: { featureAccess: 'kept', role: 'INDUSTRY', userRole: 'INDUSTRY' },
  });

  const student = await registerUserWithRole({
    auth: { uid: 'student-user', token: { email: 'student@example.com' } },
    data: { role: 'STUDENT', displayName: 'Student' },
  });
  assert.equal(student.success, true);
  assert.deepEqual(claimUpdates.at(-1), {
    uid: 'student-user',
    claims: { role: 'STUDENT', userRole: 'STUDENT' },
  });

  users.set('approved-industry', { role: 'INDUSTRY', userRole: 'INDUSTRY' });
  const approved = await registerUserWithRole({
    auth: { uid: 'approved-industry', token: { email: 'recruiter@example.com' } },
    data: { role: 'INDUSTRY', displayName: 'Approved Recruiter' },
  });
  assert.equal(approved.pendingApproval, undefined);
  assert.equal(approved.success, true);

  const updatesBeforeLegacyClaim = claimUpdates.length;
  users.set('legacy-self-assigned', { role: 'INDUSTRY' });
  const legacy = await registerUserWithRole({
    auth: { uid: 'legacy-self-assigned', token: { email: 'legacy@example.com' } },
    data: { role: 'INDUSTRY', displayName: 'Legacy Recruiter' },
  });
  assert.equal(legacy.pendingApproval, true);
  assert.equal(claimUpdates.length, updatesBeforeLegacyClaim);

  console.log('Role authorization checks passed');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});