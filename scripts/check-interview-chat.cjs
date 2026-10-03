const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const source = fs.readFileSync(path.join(__dirname, '../src/lib/interviewChat.ts'), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const chatExports = {};
new Function('exports', compiled)(chatExports);

let chat = [{ sender: 'ai', text: 'Placeholder greeting', time: 'Now' }];
chat = chatExports.upsertSpokenCaption(chat, { sender: 'ai', text: 'What is React?', time: 'Later' });
chat = chatExports.upsertSpokenCaption(chat, { sender: 'ai', text: 'What is React and why use it?', time: 'Later' });
assert.equal(chat.length, 1);
assert.equal(chat[0].text, 'What is React and why use it?');
chat = chatExports.upsertSpokenCaption(chat, { sender: 'user', text: 'It is a UI library.', time: 'Later' });
assert.equal(chat.length, 2);
assert.equal(chat[1].text, 'It is a UI library.');
assert.equal(chatExports.upsertSpokenCaption(chat, { sender: 'user', text: 'It is a UI library.', time: 'Later' }), chat);
console.log('Interview chat caption check passed');
