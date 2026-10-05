Two jobs, in this order. Job 1 is independent and can be done immediately.
Job 2 touches `main`, so read the warnings in it before starting.

===============================================================================
JOB 1 — Set NEXT_PUBLIC_API_URL on Vercel so signup writes to Neon
===============================================================================

CONTEXT
The Next.js frontend now calls our Express/Neon backend during signup, so a new
account also gets a row in the PostgreSQL `users` table. That call is gated on
an env var that is unset on Vercel, so signup currently skips the Neon write.
This is best-effort by design: it only logs a browser-console warning and never
blocks account creation. That is exactly why it failed silently.

Locally it is already set and verified working. Vercel needs the same value.

STEPS

1. Set this environment variable on the Vercel project that serves
   https://skill-setu-x4uy.vercel.app:

     Name:   NEXT_PUBLIC_API_URL
     Value:  https://skillsetu-api-jpfa.onrender.com

   Apply to the Production environment. Also add it to Preview and Development
   if you want branch deployments to register users too.

2. Redeploy. This step is mandatory, not cosmetic. NEXT_PUBLIC_* values are
   inlined into the client bundle at BUILD time, so setting the variable
   without a fresh production build has no effect.

3. Re-confirm the backend CORS allow-list includes the Vercel origin. This is
   already correct today; re-check it if anything about the backend changed:

     curl -i -X OPTIONS \
       https://skillsetu-api-jpfa.onrender.com/api/auth/register \
       -H "Origin: https://skill-setu-x4uy.vercel.app" \
       -H "Access-Control-Request-Method: POST" \
       -H "Access-Control-Request-Headers: authorization,content-type"

   Expect HTTP 204 and a header:
     access-control-allow-origin: https://skill-setu-x4uy.vercel.app

4. Confirm backend health. Note Render's free tier sleeps, so the first request
   after an idle period can take 30-60s while it cold-starts:

     curl https://skillsetu-api-jpfa.onrender.com/health

   Expect: {"status":"ok","database":"up","firebase":"initialized",...}

5. End-to-end verification:
   a) Sign up a NEW student account on https://skill-setu-x4uy.vercel.app/login
      using a fresh email that has never been used before.
   b) Watch the browser devtools console during signup. Expect:
        [backend] registered student <uuid> role=student status=active
      If you instead see "NEXT_PUBLIC_API_URL is not set", the build did not
      pick up the variable. Redeploy again.
   c) Confirm the row landed in Neon. Connection details are in backend/.env
      in the repo (use DATABASE_URL_UNPOOLED). Do NOT print or commit those
      values anywhere.
        SELECT firebase_uid, email, display_name, role, status, created_at
        FROM users ORDER BY created_at DESC LIMIT 5;
      The new account must appear with role='student' and status='active'.

NOTES FOR JOB 1
- Do NOT repoint Render's DATABASE_URL at the Neon `production` branch. It
  currently targets the `dev` branch, which is intentional for now.
- The endpoint is idempotent on firebase_uid, so re-testing the same account is
  safe and will not create duplicate rows.
- Do not set FIREBASE_AUTH_EMULATOR_HOST on Vercel or on Render.
- ALLOWED_ORIGINS on Render must keep https://skill-setu-x4uy.vercel.app in it.


===============================================================================
JOB 2 — Merge `deploy` into `main`
===============================================================================

READ THIS FIRST. There are two traps here. Both have already caused confusion,
so verify each one rather than assuming.

STATE AS OF NOW
- Branch `deploy` is at 8581ea6 and is already pushed to skillsetu2/deploy.
- `origin/main` is at d826607, which `deploy` does not contain.
- d826607 ("resolve @skillsetu/dataconnect module by committing generated SDK
  and configuring path aliases") adds:
    * tsconfig.json paths: "@skillsetu/dataconnect" -> "./src/generated/dataconnect"
    * next.config.mjs:  transpilePackages: ['@skillsetu/dataconnect']
    * .gitignore: stops ignoring src/generated/dataconnect/
  After merging, the app resolves the Data Connect SDK from
  src/generated/dataconnect instead of node_modules.

TRAP 1 — commit 8581ea6 contains a change that is WRONG once you merge.
It edited src/lib/dataConnectService.ts, removing `opportunityId` and
`opportunityType` from the createApplication() call in
syncApplicationToDataConnect(). That edit was correct only against the stale
SDK in node_modules, where those fields did not exist.

In the SDK committed by d826607, BOTH fields are REQUIRED:

  export interface CreateApplicationVariables {
    companyId: UUIDString;
    opportunityId: UUIDString;     // required
    opportunityType: string;       // required
    jobId?: string | null;
    internshipId?: string | null;
    opportunityKey?: string | null;
    title: string;
    jobType: string;
    matchScore?: number | null;
    matchedSkills?: string[] | null;
    missingSkills?: string[] | null;
  }

So if you merge and keep that edit, `next build` fails with missing required
properties. You must restore those two lines before or as part of the merge.

  TRAP 2 — `deploy` carries 7 commits authored by 4chuck that are NOT part of
  this signup work and have not been reviewed by the person who wrote them:
    bb815ee  report the configured key shape
    0c838ab  rebuild the service-account PEM
    2646fdc  strip quotes from FIREBASE_PRIVATE_KEY, fail closed
    5624d20  install backend devDependencies via .npmrc
    94f9d0f  make Render backend build reproducible
    e47e5e1  remove demo-token identity bypass
    7c44c6e  Render Blueprint for skillsetu-api
    0da667d  Express API on Neon with auth, role requests, migrations
  Four of these touch FIREBASE_PRIVATE_KEY parsing and fail-closed behaviour.
  Read them before they land on main. If any look unfinished, say so and stop
  rather than pushing.

SUGGESTED SEQUENCE

  git fetch origin
  git checkout deploy
  git merge origin/main          # brings d826607; expect no conflict, since
                                 # d826607 touches .gitignore / tsconfig.json /
                                 # next.config.mjs / src/generated/**, none of
                                 # which the signup work modifies

  # restore the two required fields in syncApplicationToDataConnect()
  # in src/lib/dataConnectService.ts:
  #   opportunityId: params.jobId || params.internshipId || `opp-${Date.now()}`,
  #   opportunityType: params.jobType || 'Job',

  npx tsc --noEmit              # must exit 0
  npx next build                # must succeed

  # then integrate, only once the build is green:
  git push origin deploy:main   # or merge deploy into main via a PR, whichever
                                 # your team prefers -- a PR is safer here

VERIFICATION BEFORE PUSHING
- npx tsc --noEmit exits 0.
- npx next build completes. It currently FAILS on `deploy` and succeeds on
  `main`; after the merge + the Trap 1 restore it must succeed on the merged
  branch. If it does not, stop and report.
- cd backend && npm test passes. Note this suite calls resetIdentityTables(),
  which DELETES all rows from `users`. That is expected and pre-existing, but
  be aware the Neon dev `users` table currently holds exactly 3 rows, all
  e2e-*@skillsetu-test.invalid test artifacts. Running the suite will replace
  them with fresh equivalents.
- Do NOT run `db:reset` against the production branch, and do not change any
  Render DATABASE_URL secret as part of this merge.


===============================================================================
ONE MORE THING WORTH A LOOK (report, do not necessarily fix now)
===============================================================================

In d826607's SDK, `opportunityId` is typed `UUIDString`, but the value the code
sends is `params.jobId || params.internshipId || \`opp-${Date.now()}\``. The
fallback branch produces something like `opp-1791132528208`, which is not a
UUID. This typechecks but is likely to fail at runtime against Postgres the
first time an application is submitted with neither a jobId nor an internshipId.
Confirm whether the Application table's opportunity_id column actually has a
UUID type and constraint. If it does, the fallback needs to generate a real
UUID (e.g. crypto.randomUUID()) or be dropped in favour of a nullable column.