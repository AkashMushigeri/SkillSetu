const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const source = fs.readFileSync(path.join(__dirname, '..', 'src/lib/opportunityLocation.ts'), 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const compiled = { exports: {} };
new Function('module', 'exports', code)(compiled, compiled.exports);
const locate = compiled.exports.companyListingCoordinates;

assert.deepEqual(locate(' Bengaluru, Karnataka ', 'On-site', 'bengaluru, karnataka', { lat: 12.97, lng: 77.59 }), { lat: 12.97, lng: 77.59 });
assert.equal(locate('Mumbai', 'On-site', 'Bengaluru', { lat: 12.97, lng: 77.59 }), undefined);
assert.equal(locate('Bengaluru', 'Remote', 'Bengaluru', { lat: 12.97, lng: 77.59 }), undefined);
assert.equal(locate('Bengaluru', 'Hybrid', 'Bengaluru', { lat: 200, lng: 77.59 }), undefined);
assert.equal(locate('Bengaluru', 'Hybrid', 'Bengaluru', null), undefined);
console.log('Opportunity coordinate checks passed.');
