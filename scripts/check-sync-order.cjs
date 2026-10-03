const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');

const source = fs.readFileSync('src/lib/syncBridge.ts', 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const moduleRef = { exports: {} };
const storage = new Map([['skillsetu_sync:notifications', JSON.stringify([
  { ts: 1, from: 'student', payload: { id: 'old' } },
  { ts: 2, from: 'student', payload: { id: 'new' } },
])]]);
global.window = { localStorage: { getItem: (key) => storage.get(key) ?? null } };
new Function('module', 'exports', code)(moduleRef, moduleRef.exports);

assert.deepEqual(moduleRef.exports.readSyncRecords('notifications').map((item) => item.id), ['new', 'old']);
console.log('Sync record ordering check passed');
