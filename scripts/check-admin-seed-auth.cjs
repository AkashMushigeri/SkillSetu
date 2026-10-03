const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');

const source = fs.readFileSync('src/app/api/admin/seed/route.ts', 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const moduleRef = { exports: {} };
new Function('require', 'module', 'exports', code)((name) => {
  if (name === 'next/server') return { NextResponse: { json: (body, init) => Response.json(body, init) } };
  if (name === '@/lib/seeder') return { runDatabaseSeeder: async () => ({ success: true }) };
  return require(name);
}, moduleRef, moduleRef.exports);

(async () => {
  const previousEnv = process.env.NODE_ENV;
  const previousToken = process.env.ADMIN_SEED_TOKEN;
  process.env.NODE_ENV = 'production';
  delete process.env.ADMIN_SEED_TOKEN;
  const response = await moduleRef.exports.POST(new Request('http://localhost/api/admin/seed', { method: 'POST' }));
  assert.equal(response.status, 404);
  if (previousEnv === undefined) delete process.env.NODE_ENV;
  else process.env.NODE_ENV = previousEnv;
  if (previousToken === undefined) delete process.env.ADMIN_SEED_TOKEN;
  else process.env.ADMIN_SEED_TOKEN = previousToken;
  console.log('Admin seed authentication check passed');
})();
