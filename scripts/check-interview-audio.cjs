const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const source = fs.readFileSync(path.join(__dirname, '../src/lib/interviewAudio.ts'), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const audioExports = {};
new Function('exports', 'Blob', compiled)(audioExports, Blob);

(async () => {
  const pcm = [Uint8Array.of(0, 0, 255, 127), Uint8Array.of(0, 128)];
  const wav = audioExports.pcm16ToWav(pcm);
  const bytes = Buffer.from(await wav.arrayBuffer());
  assert.equal(wav.type, 'audio/wav');
  assert.equal(bytes.toString('ascii', 0, 4), 'RIFF');
  assert.equal(bytes.toString('ascii', 8, 12), 'WAVE');
  assert.equal(bytes.readUInt32LE(24), 24000);
  assert.equal(bytes.readUInt32LE(40), 6);
  assert.deepEqual([...bytes.subarray(44)], [0, 0, 255, 127, 0, 128]);
  console.log('Interview replay WAV check passed');
})().catch((error) => { console.error(error); process.exitCode = 1; });
