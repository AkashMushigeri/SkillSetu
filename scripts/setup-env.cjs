const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const examplePath = path.join(root, '.env.example');
const localPath = path.join(root, '.env.local');

const PLACEHOLDERS = ['YOUR_GEMINI_API_KEY', 'YOUR_OPENAI_API_KEY', 'YOUR_OPENROUTER_API_KEY',
  'YOUR_HUGGINGFACE_API_KEY', 'YOUR_TOGETHER_API_KEY', 'YOUR_UPSTASH_REDIS_REST_URL',
  'YOUR_UPSTASH_REDIS_REST_TOKEN', 'YOUR_RECAPTCHA_ENTERPRISE_SITE_KEY'];

function isIgnoredByGit() {
  try {
    const { execFileSync } = require('node:child_process');
    execFileSync('git', ['check-ignore', '-q', '.env.local'], { cwd: root, stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function main() {
  if (!fs.existsSync(examplePath)) {
    console.warn('[setup] .env.example is missing; skipping .env.local creation.');
    return;
  }

  if (fs.existsSync(localPath)) {
    console.log('[setup] .env.local already exists; leaving it untouched.');
  } else {
    fs.copyFileSync(examplePath, localPath);
    console.log('[setup] Created .env.local from .env.example (public Firebase config copied in).');
  }

  if (!isIgnoredByGit()) {
    console.warn('[setup] WARNING: .env.local is NOT gitignored. Add it to .gitignore before committing.');
  } else {
    console.log('[setup] .env.local is gitignored, so your keys cannot be committed.');
  }

  const contents = fs.readFileSync(localPath, 'utf8');
  const pending = PLACEHOLDERS.filter((name) => contents.includes(name));

  if (pending.length > 0) {
    console.log('');
    console.log('[setup] These values still need a real value for the related features to work:');
    for (const name of pending) {
      console.log(`  - ${name}`);
    }
    console.log('');
    console.log('[setup] Required for the AI features: GEMINI_API_KEY');
    console.log('[setup] Get one at https://aistudio.google.com/apikey, then set it in .env.local');
    console.log('[setup] and restart the dev server. Everything else works without it.');
  } else {
    console.log('[setup] All placeholder values have been filled in.');
  }

  console.log('[setup] Next: npm run dev');
}

main();
