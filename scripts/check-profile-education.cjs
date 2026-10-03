const assert = require('node:assert/strict');
const { selectProfileEducation, exactDuplicateEducationIds } = require('../src/lib/profileEducation.ts');

const rows = [
  { id: 'old', degree: 'B.Tech', department: 'CSE', college: 'PES', graduationYear: 2026, cgpa: 8.4, currentYear: '3rd Year', createdAt: '2026-01-01' },
  { id: 'latest', degree: 'B.Tech', department: 'CSE', college: 'PES', graduationYear: 2026, cgpa: 8.4, currentYear: '3rd Year', createdAt: '2026-02-01' },
  { id: 'other-degree', degree: 'M.Tech', department: 'CSE', college: 'PES', createdAt: '2026-03-01' },
];

const selected = selectProfileEducation(rows, 'user-a', { degree: 'B.Tech', college: 'PES' });
assert.equal(selected.id, 'latest');
assert.deepEqual(exactDuplicateEducationIds(rows, selected), ['old']);
assert.equal(selectProfileEducation([{ ...rows[0], profileOwnerUid: 'user-a' }, ...rows.slice(1)], 'user-a', { degree: 'M.Tech', college: 'PES' }).id, 'old');
assert.equal(selectProfileEducation([rows[2]], 'user-a', { degree: 'B.Tech', college: 'PES' }), undefined);
assert.deepEqual(exactDuplicateEducationIds(rows, { ...selected, cgpa: 9.0 }), []);
console.log('Profile education dedupe checks passed');
