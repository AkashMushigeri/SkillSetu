# SkillSetu — Agent & Developer Instructions

## Local setup (do this FIRST, before running anything)

Run these three commands in order. No manual file editing is needed.

```bash
npm install
npm run setup
npm run dev
```

`npm run setup` copies `.env.example` to `.env.local`. The committed Firebase **web**
config in `.env.example` is public by design, so this makes the app connect to
Firebase immediately. It never overwrites an existing `.env.local`.

`npm run dev` and `npm run build` run `setup` automatically via npm `pre` hooks, so
if you skip the explicit call it still happens.

### Required ordering: Data Connect SDK before `npm install`

`src/generated/dataconnect/` is gitignored, so a fresh clone does not contain it, and
`package.json` depends on it via `file:src/generated/dataconnect`. Installing first
leaves a broken package and dozens of `Cannot find module '@skillsetu/dataconnect'`
errors.

```bash
npm install -g firebase-tools    # once
firebase login                   # once
firebase dataconnect:sdk:generate
npm install
```

If you already ran `npm install` and see those module errors, just run
`firebase dataconnect:sdk:generate` and then `npm install` again.

## Environment variables

`.env.local` is gitignored and local-only. Never commit it, and never paste a real key
into any file that is tracked.

| Variable | Required | Notes |
|:---|:---|:---|
| `NEXT_PUBLIC_FIREBASE_*` (6 values) | Yes | Public identifiers. Already copied in by `npm run setup`. |
| `GEMINI_API_KEY` | For AI features | **Server-only.** Get one at <https://aistudio.google.com/apikey>. Put it in `.env.local`, never in client code. |
| `OPENAI_API_KEY` | Optional | Widens the interview provider pool; also enables Whisper transcription. |
| `OPENROUTER_API_KEY` / `HF_API_KEY` / `TOGETHER_API_KEY` | Optional | Additional interview fallbacks. |
| `NEXT_PUBLIC_USE_FIREBASE_EMULATOR` | Optional | `true` to point client SDKs at local emulators. |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN` | Production | Shared rate limiter. AI routes fail closed without it in production. |
| `ADMIN_SEED_TOKEN` | Production | Only for `POST /api/admin/seed`. |

Without `GEMINI_API_KEY` the app still runs: the mock interview and resume parsing fall
back to a clearly-labelled offline rubric, and skill-assessment generation reports that
it is unavailable.

## Verifying a change

```bash
npm run type-check                                  # must be 0 errors
npm run build                                       # must succeed
for f in scripts/check-*.cjs; do node "$f"; done    # 21 project checks
```

## Rules for agents

- Do not commit `.env.local`, `.env`, or any file containing a real API key.
- Do not use `NEXT_PUBLIC_` for a server-only secret. `NEXT_PUBLIC_*` values are
  inlined into the browser bundle.
- Do not run `git push --force` or `--force-with-lease`.
- Do not push to `main` or `production`.
- Keep `firestore.rules` restrictive; new collections need explicit rules, and
  `npm run check:rules` equivalent (`node scripts/check-firestore-rules.cjs`) must pass.
- Re-run the verification commands above before proposing a commit.

## Git workflow

```bash
git clone https://github.com/AkashMushigeri/SkillSetu.git
cd SkillSetu

git checkout main
git pull origin main

git checkout -b feature/<your-feature-name>

# Add or modify your files/code

git status
git add .
git commit -m "Add <your-feature-name>"

git push -u origin feature/<your-feature-name>

# Then create a Pull Request on GitHub:
# feature/<your-feature-name> -> main

# After the Pull Request is merged:
git checkout main
git pull origin main

# Delete your old local branch:
git branch -d feature/<your-feature-name>

# For your next feature:
git checkout main
git pull origin main
git checkout -b feature/<new-feature-name>
```
