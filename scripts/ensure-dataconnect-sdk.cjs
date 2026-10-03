const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const sdkDir = path.join(root, 'src', 'generated', 'dataconnect');
const marker = path.join(sdkDir, 'package.json');
const useShell = process.platform === 'win32';

function isGenerated() {
  return fs.existsSync(marker);
}

function generate(command, args) {
  return spawnSync(command, args, {
    cwd: root,
    stdio: 'inherit',
    shell: useShell,
    timeout: 5 * 60 * 1000,
    killSignal: 'SIGKILL',
  });
}

function reportFailure() {
  console.warn('');
  console.warn('[dataconnect] Could not generate the Data Connect SDK automatically.');
  console.warn('[dataconnect] Install will finish, but the app will not start until you run:');
  console.warn('');
  console.warn('[dataconnect]   npm install -g firebase-tools');
  console.warn('[dataconnect]   firebase login');
  console.warn('[dataconnect]   firebase dataconnect:sdk:generate');
  console.warn('');
  console.warn('[dataconnect] No reinstall is needed afterwards: node_modules/@skillsetu/dataconnect');
  console.warn('[dataconnect] is a junction to src/generated/dataconnect and picks the files up at once.');
}

function main() {
  if (isGenerated()) {
    console.log('[dataconnect] SDK already present; nothing to do.');
    return;
  }

  if (process.env.SKIP_DATACONNECT_SDK) {
    console.warn('[dataconnect] SKIP_DATACONNECT_SDK is set; skipping SDK generation.');
    return;
  }

  console.log('[dataconnect] SDK missing; generating from dataconnect/schema/schema.gql ...');

  generate('firebase', ['dataconnect:sdk:generate']);
  if (isGenerated()) {
    console.log('[dataconnect] SDK generated.');
    return;
  }

  generate('npx', ['-y', 'firebase-tools', 'dataconnect:sdk:generate']);
  if (isGenerated()) {
    console.log('[dataconnect] SDK generated.');
    return;
  }

  reportFailure();
}

try {
  main();
} catch (error) {
  console.warn(`[dataconnect] Unexpected error: ${error && error.message}`);
  reportFailure();
}

process.exit(0);