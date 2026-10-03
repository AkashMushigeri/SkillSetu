const assert = require('node:assert/strict');
const fs = require('node:fs');

const rules = fs.readFileSync('firestore.rules', 'utf8');
const users = rules.match(/match \/users\/\{userId\} \{([\s\S]*?)\n    \}/)?.[1];
const notifications = rules.match(/match \/notifications\/\{notificationId\} \{([\s\S]*?)\n    \}/)?.[1];

assert.ok(users, 'users rule block must exist');
assert.match(users, /allow get: if isOwner\(userId\);/);
assert.match(users, /allow list: if false;/);
assert.match(users, /allow create: if isOwner\(userId\)[\s\S]*hasTrustedRole\(request\.resource\.data\.role\)/);
assert.match(users, /allow update: if isOwner\(userId\)[\s\S]*request\.resource\.data\.role == resource\.data\.role[\s\S]*hasTrustedRole\(request\.resource\.data\.role\)/);
assert.ok(notifications, 'global notification rule block must exist');
assert.match(notifications, /allow read, write: if false;/);

console.log('Firestore ownership and role protection checks passed');