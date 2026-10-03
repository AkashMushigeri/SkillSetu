# SkillSetu — Academia–Industry Career Platform

> **Learn. Connect. Grow Together.**  
> A skill-first career platform bridging the gap between student competencies, academic curricula, and industry hiring needs.

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-12.19-orange?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-green?style=for-the-badge&logo=leaflet)](https://leafletjs.com/)

---

## 📌 Overview & Core Mission

Traditional recruitment heavily relies on static resumes and academic percentages, which often fail to reflect hands-on technical proficiency. Higher education institutions face a curriculum-industry lag, while companies struggle to identify candidates with job-ready practical capabilities.

**SkillSetu** addresses this challenge through a unified career and talent discovery ecosystem connecting **Students**, **Industry**, and **Colleges**:

$$\text{Student} \longrightarrow \text{Skills} \longrightarrow \text{Learning} \longrightarrow \text{Opportunities} \longrightarrow \text{Industry} \longrightarrow \text{Career}$$

- **Students**: Build structured, skill-first profiles, manage multi-tier academic history, track competencies across tiered curricula, assess abilities, and discover nearby opportunities.
- **Industry Employers**: Discover talent using transparent multi-factor matching, filter candidates by verified competencies, manage recruitment through a Kanban pipeline, and issue digital offers.
- **Colleges & Academia**: Monitor institutional placement readiness, track student competency heatmaps across departments, coordinate campus drives, and manage bilateral corporate MoUs.

---

## 🚀 Key Modules & Capabilities

```text
SkillSetu Platform
│
├── 🔐 Authentication & Onboarding
│   ├── Multi-Role Portal Selection (Student, Industry, College)
│   ├── International Phone Validation & Country Selector
│   ├── Searchable College Autocomplete Directory
│   └── Nominatim-Powered City & Location Autocomplete
│
├── 🎓 Student Portal (/student/*)
│   ├── Profile & Multi-Tier Education Management (College, PUC, School)
│   ├── Skills Hub (Basic, Intermediate, Advanced) & Curriculum Checklists
│   ├── Interactive Skill Assessments & Verification
│   ├── Geolocation Opportunity Radar (Leaflet Distance Map)
│   ├── Resume Builder & PDF Text Ingestion (pdf-parse)
│   └── AI Mock Interview Engine (Gemini Live + Gemini Flash + Fallbacks)
│
├── 🏢 Industry Portal (/industry/*)
│   ├── Transparent 100-Point Candidate Match Engine
│   ├── Multi-Skill & Tiered Candidate Filtering
│   ├── Job & Internship Management
│   ├── Multi-Stage Kanban Hiring Pipeline
│   ├── Interview Scheduling Center
│   ├── Digital Offer Letter Generator
│   └── Hackathon & Code Challenge Benchmarks
│
└── 🏫 College Portal (/college/*)
    ├── Batch Placement Readiness Dashboard
    ├── Department Competency Heatmaps
    ├── Campus Placement Drive Management
    └── Bilateral Corporate MoU Collaboration
```

---

### 1. 🎓 Student Experience Portal (`/student/*`)

* **Skill-First Profiles**: Move beyond static resumes. Profiles showcase verified competencies, real-world projects, live repositories, academic backgrounds, and career goals.
* **Multi-Tier Education History**:
  * **College / University**: Institution name, degree (e.g., B.Tech, BCA), department/branch, academic year, and CGPA/percentage.
  * **Pre-University / 12th / Intermediate**: Institution name, stream/course (e.g., Science, PCMB), academic year, and score.
  * **Secondary / 10th / SSLC**: School name, education board (CBSE, ICSE, State Board), academic year, and score.
* **Tiered Skills Hub (`/student/skills`)**:
  * Categorized proficiency tiers: **Basic**, **Intermediate**, and **Advanced**.
  * Structured curricula across key disciplines:
    * *Core Programming*: C Programming, Python, Java, SQL, JavaScript
    * *Web & Systems*: HTML/CSS, React.js, Node.js, TypeScript, REST APIs
    * *Data & Cloud*: PostgreSQL, MongoDB, Cloud Computing (AWS/Azure), Docker, DevOps, Machine Learning
  * Actionable resource checklists (documentation, video lectures, practice exercises, and mini-projects).
  * Direct mapping from individual skills to real-world career roles and available opportunities.
* **Interactive Skill Assessments (`/student/skills/[id]`)**:
  * Topic-specific multiple-choice assessments with immediate answer validation and detailed explanations.
  * Successful completion updates skill status to verified within the student profile.
* **Geolocation Opportunity Radar (`/student/opportunities`)**:
  * Discover internships, full-time jobs, micro-sprints, and hackathons.
  * Interactive Leaflet map visualizing nearby corporate hubs and startups.
  * Haversine distance calculation relative to the student's selected city with radius filters (5 km, 10 km, 25 km, 50 km, 100+ km).
  * Transparent match score breakdown showing exact matched skills, missing skills, and verified boosts.
* **Resume Viewer & PDF Extraction (`/student/resume`)**:
  * Responsive resume viewer with print and PDF export capabilities.
  * PDF resume upload with automated text and skill extraction powered by `pdf-parse`.
* **AI Mock Interview (`/student/ai-interview`)**:
  * Interactive voice interview simulator evaluating candidate responses for specific job roles.
  * Powered by the Gemini Live API for conversation and Gemini Flash for structured scoring, with multi-provider and offline rubric fallbacks.
  * Generates scoring metrics across technical accuracy, communication, and confidence.
  * See [AI Features](#-ai-features) for the full breakdown.

---

### 2. 🏢 Industry / Corporate Portal (`/industry/*`)

* **Candidate Discovery & Skill Filtering (`/industry/candidates`)**:
  * Filter candidate pools by required technologies, proficiency tier (Basic, Intermediate, Advanced), location, and minimum GPA.
* **Transparent 100-Point Match Engine**:
  * **Skill Overlap (up to 60 pts)**: Weighted alignment with required and preferred job competencies.
  * **Verified Skill Bonus (up to 15 pts)**: Boost for skills verified through platform assessments.
  * **Project Quality (up to 10 pts)**: Verified repositories and practical portfolio builds.
  * **Work Experience (up to 5 pts)**: Prior internships and technical sprint participation.
  * **Academic Background (up to 5 pts)**: Degree relevance and academic GPA.
  * **Location Proximity (up to 5 pts)**: Proximity match based on candidate city.
* **Job & Internship Studio (`/industry/jobs`, `/industry/internships`)**:
  * Create and publish structured listings specifying required vs. optional skills, stipend/salary, location, and role types.
* **Multi-Stage Kanban Pipeline (`/industry/pipeline`)**:
  * Visual hiring workflow tracking applicants across stages: *Screening*, *Shortlisted*, *Technical Interview*, *HR Interview*, and *Hired*.
* **Interview Scheduling Center (`/industry/interviews`)**:
  * Organize technical and HR interview rounds with meeting links, interviewer assignments, and evaluation notes.
* **Digital Offer Letter Generator (`/industry/offers`)**:
  * Generate itemized compensation breakdowns (Base, Performance Variable, Retention Bonuses, Benefits) with formal exportable templates.
* **Challenge Benchmarks (`/industry/challenges`)**:
  * Review student code submissions and automated unit test pass rates for sponsored hackathon challenges.

---

### 3. 🏫 Academia & College Portal (`/college/*`)

* **Placement Readiness Dashboard (`/college/dashboard`)**:
  * Institutional overview tracking batch readiness percentages, active placement drives, and department distribution.
* **Student Directory & Profiles (`/college/students`)**:
  * Inspect individual student academic history, verified skills, and project portfolios.
* **Department Competency Analytics (`/college/skills`)**:
  * Aggregate skill heatmaps across departments (e.g., Computer Science, Information Science, Electronics) to identify curriculum gaps.
* **Placement Drive Coordinator (`/college/placement`, `/college/drives`)**:
  * Schedule on-campus and virtual recruitment drives with customizable eligibility filters (minimum CGPA, mandatory verified skills).
* **Corporate Partnerships & MoU Studio (`/college/mou`)**:
  * Track bilateral industry partnerships and collaborate on curriculum upgrades.

---

## 🔍 Onboarding, Matching & Location Services

### Searchable College Directory
The onboarding flow includes a dedicated directory containing over 200 Indian universities, engineering colleges, autonomous institutions, and Institutes of National Importance (IITs, NITs, IIITs, state universities).
* **Autocomplete & Search**: Dynamic fuzzy matching against formal names, short abbreviations (e.g., RVCE, BMSCE, IITB), and alternate aliases.
* **City Normalization**: Standardizes regional city variations (e.g., Bangalore $\rightarrow$ Bengaluru, Bombay $\rightarrow$ Mumbai, Madras $\rightarrow$ Chennai).
* **Institution Metadata**: Automatically links institution type, state, and city to student profiles.

### City Search & Geolocation Services
* **Dynamic Autocomplete**: Powered by OpenStreetMap Nominatim with client-side query caching and shorthand prefix expansion (`bang` $\rightarrow$ Bengaluru, `hyd` $\rightarrow$ Hyderabad, `del` $\rightarrow$ Delhi).
* **Proximity Calculation**: Calculates precise Haversine distances in kilometers between student locations and opportunity coordinates.

### Phone Number Validation & Multi-Role Authentication
* **Role-Based Portals**: Dedicated authentication workflows for Students, Industry Recruiters, and College Administrators.
* **International Country Selector**: Support for major country codes with flag icons and ISO codes.
* **Strict Validation**: Enforces exact 10-digit formats for Indian mobile numbers (`+91`) and specific length constraints for international numbers.
* **Credential Safety**: Secure password confirmation during signup and self-service password reset via Firebase Auth.
* **Streamlined Registration**: Minimal registration inputs on initial signup, collecting detailed academic and professional data during onboarding.

---

## 🎨 Design System & User Experience

* **Responsive Layout**: Optimized for desktop monitors, laptops, tablets, and mobile devices (includes a dedicated `MobileBottomNav` for students).
* **Theme System (Dark / Light)**:
  * Persistent theme preference stored via `localStorage` (`skillsetu_theme`).
  * Seamless CSS transitions with dark mode styling implemented across dashboards, modals, cards, and navigation headers.
* **In-Place Profile Editing**: Direct modal editors for profile header, education history, projects, bio, and social links.
* **Visual Status Indicators**: Real-time profile completion indicators, verification badges, and dynamic progress bars.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|:---|:---|
| **Frontend Framework** | [Next.js 14](https://nextjs.org/) (App Router, Server & Client Components) |
| **Language** | [TypeScript 5.7](https://www.typescriptlang.org/) (Strict Mode) |
| **UI & Styling** | [Tailwind CSS 3.4](https://tailwindcss.com/), [Lucide React](https://lucide.dev/) Icons |
| **Backend & Auth** | [Firebase 12](https://firebase.google.com/) (Authentication, Cloud Firestore, Firebase Data Connect) |
| **Interactive Maps** | [Leaflet 1.9](https://leafletjs.com/), OpenStreetMap API (Nominatim Geocoding) |
| **Document Processing** | [pdf-parse](https://www.npmjs.com/package/pdf-parse) (Resume text extraction) |
| **AI Integration** | [Google Gemini API](https://ai.google.dev/) (Gemini Live + Gemini Flash via server routes; multi-provider and offline fallbacks) — see [AI Features](#-ai-features) |
| **Visual Effects** | [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) |
| **State Management** | React Context API (`AuthContext`, `StudentContext`, `IndustryContext`, `CollegeContext`, `ThemeContext`) with local synchronization |

---

## 📂 Project Architecture

```text
SkillSetu/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── api/                      # Server-side API endpoints
│   │   │   ├── ai/                   # AI assessment, matching & resume endpoints
│   │   │   ├── ai-interview/         # Gemini AI interview route
│   │   │   ├── locations/            # Nominatim location autocomplete endpoint
│   │   │   └── admin/                # Database seed endpoint
│   │   ├── college/                  # College Portal pages (dashboard, students, placement, etc.)
│   │   ├── industry/                 # Industry Portal pages (pipeline, jobs, candidates, etc.)
│   │   ├── student/                  # Student Portal pages (profile, skills, radar, resume, etc.)
│   │   ├── login/                    # Unified multi-role authentication page
│   │   ├── onboarding/               # First-time onboarding with college & phone validation
│   │   ├── layout.tsx                # Root layout with Auth & Theme providers
│   │   └── page.tsx                  # Landing & routing redirect
│   ├── components/                   # Reusable UI components
│   │   ├── auth/                     # UnifiedLoginPage, PortalSelector, auth guards
│   │   ├── college/                  # College analytics and student management UI
│   │   ├── industry/                 # Candidate cards, Kanban pipeline, interview modal
│   │   ├── layout/                   # Headers, desktop navigation, MobileBottomNav, ThemeToggle
│   │   ├── map/                      # Leaflet map components & radar markers
│   │   ├── onboarding/               # CollegeAutocomplete component
│   │   └── opportunities/            # Opportunity cards, detail modals, application modal
│   ├── context/                      # React Context providers
│   │   ├── AuthContext.tsx           # Authentication state & role routing
│   │   ├── StudentContext.tsx        # Profile, education, skills, projects & applications
│   │   ├── IndustryContext.tsx       # Candidates, jobs, pipeline & offers
│   │   ├── CollegeContext.tsx        # College metrics, student tracking & drives
│   │   └── ThemeContext.tsx          # Dark/light theme state & document styling
│   ├── data/                         # Domain catalogs & static databases
│   │   ├── collegesData.ts           # Indian higher education directory & search engine
│   │   ├── skillsData.ts             # Tiered skills catalog, resources & career role mappings
│   │   ├── mockStudentData.ts        # Initial student data & opportunity listings
│   │   └── industry/                 # Industry jobs, candidates, and challenges data
│   ├── lib/                          # Utility libraries & SDK helpers
│   │   ├── firebase.ts               # Firebase initialization & profile storage
│   │   ├── matchUtils.ts             # Haversine distance & opportunity match scoring
│   │   ├── industryMatching.ts       # 100-point candidate match algorithm
│   │   └── syncBridge.ts             # Cross-portal synchronization helpers
│   ├── server/                       # Server-side business logic
│   │   └── ai/                       # AI interview, recommendation & resume parsing services
│   ├── styles/                       # Global stylesheet
│   │   └── globals.css
│   └── types/                        # TypeScript interfaces
│       ├── student.ts                # Student, EducationHistory, Skill, Opportunity models
│       ├── industry.ts               # Candidate, Job, Interview, Offer models
│       └── college.ts                # College, Placement, Batch models
├── public/                           # Static assets
├── dataconnect/                      # Firebase Data Connect schema & connector configuration
├── apphosting.yaml                   # Firebase App Hosting deployment runtime & env configuration
├── firebase.json                     # Firebase emulator and services configuration
├── firestore.rules                   # Firestore security rules
├── package.json                      # Project dependencies & scripts
├── tailwind.config.ts                # Tailwind design system configuration
└── tsconfig.json                     # TypeScript strict configuration
```

---

## ⚡ Full Local Setup

### Prerequisites

| Requirement | Version | Needed for |
|:---|:---|:---|
| [Node.js](https://nodejs.org/) | `>= 20.0.0` | Everything |
| [npm](https://www.npmjs.com/) | `>= 9.0.0` | Everything |
| [Git](https://git-scm.com/) | latest | Clone / branch |
| [Firebase CLI](https://firebase.google.com/docs/cli) | `>= 13` | Data Connect SDK generation + emulators (auto-run via `npx firebase-tools`) |
| Google Gemini API key | — | The AI features listed in [AI Features](#-ai-features) |

### 1. Clone the repository

```bash
git clone https://github.com/AkashMushigeri/SkillSetu.git
cd SkillSetu
```

### 2. Generate the Firebase Data Connect SDK — **do this before `npm install`**

`src/generated/dataconnect/` is **gitignored**, so a fresh clone does not contain it.
`package.json` depends on it via `"@skillsetu/dataconnect": "file:src/generated/dataconnect"`, so
installing first leaves you with a broken/empty package and dozens of
`Cannot find module '@skillsetu/dataconnect'` type errors.

```bash
firebase dataconnect:sdk:generate
```

This reads `dataconnect/schema/schema.gql` and writes the typed SDK to
`src/generated/dataconnect/`. Re-run it after any schema change.

### 3. Install dependencies

```bash
npm install
```

### 4. Create `.env.local`

```bash
cp .env.example .env.local
```

`.env.local` is local-only and **gitignored** — never commit it. Keep real keys out of
`.env.example` and the docs; use the `YOUR_...` placeholders below.

#### Environment variables

**Required for AI features**

```env
# Server-only. Get one at https://aistudio.google.com/apikey
# Never expose this in client code or commit it.
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
```

**Required (Firebase client config)**

The Firebase *web* config is public by design and safe to commit; the values below are the
shared project's and work out of the box. Override them to point at your own project.

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

**Optional — local development**

```env
NEXT_PUBLIC_ENV=development              # environment indicator
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false  # 'true' to point client SDKs at local emulators
NEXT_PUBLIC_APPCHECK_DEBUG=false         # 'true' on localhost to auto-fetch an App Check debug token
```

**Optional — extra AI providers for the live interview**

The interview tries providers in order (`openai` → `gemini` → `openrouter` → `huggingface` →
`together`) and uses the first whose key is present *and* which returns successfully.
Supply any one of these to widen the pool; `GEMINI_API_KEY` alone is enough.

```env
OPENAI_API_KEY="YOUR_OPENAI_API_KEY"        # also enables Whisper audio transcription
OPENROUTER_API_KEY="YOUR_OPENROUTER_KEY"
HF_API_KEY="YOUR_HUGGINGFACE_KEY"
TOGETHER_API_KEY="YOUR_TOGETHER_API_KEY"
```

**Production-only** (not needed locally; configured as App Hosting secrets)

```env
UPSTASH_REDIS_REST_URL=                     # shared rate limiter; AI routes FAIL CLOSED without it
UPSTASH_REDIS_REST_TOKEN=
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=             # Firebase App Check (reCAPTCHA Enterprise)
ADMIN_SEED_TOKEN=                           # only required for POST /api/admin/seed in production
REQUIRE_APP_CHECK=true                      # enforce App Check outside production too
```

### 5. Run the development server

```bash
npm run dev
```

Open 👉 **`http://localhost:3000`**

### 6. Verify the setup

```bash
npm run type-check   # must report 0 errors
npm run build        # must succeed
```

Run the project's check suite (21 assertions covering auth, AI rate limits,
assessments, resume parsing, seeding, and matching):

```bash
for f in scripts/check-*.cjs; do node "$f" || echo "FAILED: $f"; done
```

Then confirm in the browser:

- Landing page loads and the dark/light theme persists across reloads.
- Sign-up / sign-in works for a Student role.
- `/student/skills` renders the tiered catalog; open a skill and run its assessment.
- `/student/ai-interview` starts an interview. If `GEMINI_API_KEY` is unset the
  route reports Gemini Live is not configured (503) — set the key to enable it.

### 7. Firebase emulators (optional)

Runs Auth, Firestore and Data Connect locally. Data Connect is required to seed
locally, because the seeder aborts when there is no Data Connect connection.

```bash
npm run emulators
```

| Service | Port |
|:---|:---|
| Auth | 9099 |
| Firestore | 8080 |
| Data Connect | 9399 |
| Functions | 5001 |

Set `NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true`, then seed:

```bash
npm run db:seed
```

> **Note:** `db:seed` requires a live server-side Data Connect connection. It exits
> non-zero with `Data Connect is unavailable in this server runtime` rather than
> reporting a successful seed that wrote nothing.

---

## 🤖 AI Features

All AI runs **server-side only**; no model is ever called from the browser, and
`GEMINI_API_KEY` is read exclusively from `process.env` in API routes and
`src/server/ai/*`.

### AI Mock Interview — `/student/ai-interview`

Voice-based mock interview with live conversational feedback.

- **Live voice mode** uses the Gemini Live API (`gemini-3.8-live`). The browser
  requests a short-lived token from `/api/ai-interview/live-token`.
- **Post-interview evaluation** (`src/server/ai/interviewService.ts`, `gemini-3.6-flash`)
  scores overall, technical, communication and confidence, returning structured JSON
  with strengths and improvements.
- **Multi-provider fallback**: if Gemini is unavailable it retries, then tries
  OpenRouter / HuggingFace / Together free models, and can transcribe audio via
  OpenAI Whisper when `OPENAI_API_KEY` is set.
- **Offline rubric fallback**: with no key or after a failed call, evaluation still
  returns via a transcript-only rubric. The response is tagged `source: 'rubric'`
  (vs `source: 'gemini'`) and the UI labels it as a practice rubric, *not* an AI
  judgement of technical correctness.
- **Requires `GEMINI_API_KEY`** for live voice and Gemini evaluation. Works in a
  degraded, clearly-labelled mode without it.
- Retries only transient errors (408/429/500/502/503/504); a 400 is not retried.

### Dynamic AI Skill Assessments — `/student/skills/[id]`

- `/api/skills/generate-assessment` generates 10–15 original, topic-specific
  diagnostic questions via Gemini (`gemini-3.6-flash`, falling back to
  `gemini-flash-lite-latest`), then grades the submitted answers.
- Attempts are recorded server-side so a score cannot be forged client-side.
- **Requires `GEMINI_API_KEY`.** Without it the service throws
  *"AI assessment generation is temporarily unavailable."*

### Resume Parsing & Analysis — `/student/resume`

- Upload a **PDF, DOCX, or TXT** resume; `pdf-parse` extracts the text and Gemini
  (`gemini-1.5-flash`) extracts skills, projects, experience and education.
- Falls back to a high-fidelity offline NLP extractor if Gemini is unavailable or the
  file cannot be parsed, so the feature degrades rather than fails.
- `/api/resume-analysis` (`gemini-3.6-flash`) produces an ATS score, normalised
  skills, and a job-match score with missing skills.

### AI Opportunity Recommendations — `/api/ai/recommendations`

Ranks opportunities against the student's verified skills, projects and career goals.
Scores are computed **deterministically** — no LLM and **no API key required**.

### Skill Gap Analysis — `/api/ai/skill-gap`

Compares an opportunity's requirements against the student's evidence to produce
verification-aware gaps and a learning plan. **Deterministic — no API key required.**

### Explainable Skill Matching — `src/server/ai/skillMatchingService.ts`

The shared matching engine behind opportunity and candidate scoring. Combines
required/preferred skills, verified-vs-claimed weighting, project relevance, role
alignment and proximity into a score with a human-readable explanation, using a
domain taxonomy (`skillTaxonomy.ts`) to recognise synonyms such as `React.js` → `React`.
**Deterministic — no API key required.**

---

## 🆕 New Features

### AI
- Dynamic Gemini-generated skill assessments with server-side attempt tracking.
- Gemini Live voice mock interview, with multi-provider and offline rubric fallbacks.
- AI resume parsing (PDF/DOCX/TXT) with ATS scoring and job-match analysis.
- AI opportunity recommendations and verification-aware skill-gap analysis.

### Other
- **Skills curriculum refactor** — the catalog moved into `src/data/skillsData.ts`
  with tiered navigation (Basic/Intermediate/Advanced) and career-role mappings.
- **Skills ↔ resume mapping** — resume skills are matched onto catalog skills and
  mapped to target roles with coverage and missing-skill breakdowns.
- **Education history** — multi-tier records (College / PUC / Secondary) with modal
  add/edit in `/student/profile`.
- **College directory & autocomplete** — searchable directory of 200+ Indian
  institutions with fuzzy matching, short codes, and city normalisation
  (`src/data/collegesData.ts`, `src/components/onboarding/CollegeAutocomplete.tsx`).
- **Application-wide dark mode** with persistent `localStorage` preference and
  `ThemeToggle` in every portal header.
- **Database seeder runtime guard** — the seeder now fails loudly instead of
  reporting success when Data Connect is unavailable.

---

## 🌐 External Services

| Service | Required locally | Credentials / config | Emulator | Used by |
|:---|:---|:---|:---|:---|
| **Firebase Authentication** | Yes | `NEXT_PUBLIC_FIREBASE_*` | `9099` | All three portals, Google OAuth, role registration |
| **Cloud Firestore** | Yes | `NEXT_PUBLIC_FIREBASE_*` | `8080` | Profiles, skills, applications, pipeline, offers |
| **Firebase Data Connect** | Yes | Generated SDK from `dataconnect/schema` | `9399` | Opportunities, colleges, companies, user skills, seeding |
| **Google Gemini API** | For AI features | `GEMINI_API_KEY` (server-only) | — | Mock interview, skill assessments, resume parsing |
| **Firebase App Check** | Production | `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | — | Protects AI routes; enforced in production |
| **Upstash Redis REST** | Production | `UPSTASH_REDIS_REST_URL` / `_TOKEN` | — | Shared rate limiter. **AI routes fail closed without it in production** |
| **Firebase Cloud Functions** | Optional | Service account via `gcloud auth application-default login` | `5001` | `registerUserWithRole` / `updateUserRole` approval workflow |
| **OpenStreetMap Nominatim** | Optional | None (public endpoint) | — | City autocomplete via `/api/locations/autocomplete` |

Notes:

- Firebase **web** config values are public identifiers, not secrets; they are committed
  in `.env.example`. Real secrets belong in `.env.local` (gitignored) or App Hosting secrets.
- Cloud Functions are only needed for the INDUSTRY/COLLEGE registration approval flow.
  Without them deployed, those sign-ups fall back to the client's behaviour.
- The AI routes are rate-limited. Locally the limiter falls back to in-memory; in
  production it throws if Redis is unreachable.

---

## 📊 Feature Summary Table

| Functional Area | Current Production Capability |
|:---|:---|
| **Authentication** | Multi-role portal sign-in/up (Student, Industry, College), Google OAuth, Firebase Auth, password confirmation, self-service password reset |
| **Phone Validation** | Country selector with flags and ISO codes; strict 10-digit validation for India (`+91`) and international length enforcement |
| **Student Profile** | In-place modal editing for bio, header, GPA, career goals, links, and projects |
| **Education History** | Multi-tier records: College/University, PUC / 12th / Intermediate, and High School / 10th with verification badges |
| **Skills Catalog** | Tiered levels (**Basic**, **Intermediate**, **Advanced**) covering 16+ core skills with structured learning checklists |
| **Skill Assessment** | Topic-specific quizzes with instant scoring, answer explanations, and verified badge unlock. AI mode generates 10–15 fresh questions per attempt via Gemini and grades answers server-side |
| **AI Recommendations** | Opportunities ranked against verified skills, projects and career goals (`/api/ai/recommendations`) — deterministic, no API key needed |
| **Skill Gap Analysis** | Verification-aware gap report and learning plan for a target role (`/api/ai/skill-gap`) — deterministic, no API key needed |
| **College Directory** | Built-in directory of 200+ Indian institutions with fuzzy search, short-code matching, and city normalization |
| **Location & Radar** | Nominatim city autocomplete, Haversine distance calculations, and Leaflet interactive map with radius filters (5–100+ km) |
| **Opportunity Matching**| Transparent match breakdown displaying shared skills, missing competencies, verified boosts, and project relevance |
| **Resume Handling** | Interactive resume viewer, print/PDF export, and automated PDF/DOCX/TXT resume text extraction (`pdf-parse` + Gemini) |
| **AI Mock Interview** | Role-based voice interview via Gemini Live with structured Gemini Flash scoring, multi-provider fallback, and an offline practice rubric |
| **Industry Portal** | 100-point candidate scoring engine, multi-skill filtering, job/internship posting, and 5-stage Kanban hiring pipeline |
| **Interview & Offers** | Interview scheduling center with meeting links and digital offer letter generator with itemized salary breakdowns |
| **College Portal** | Institutional placement tracking, department skill heatmaps, drive coordinators, and bilateral MoU records |
| **Theme System** | Dark mode and light mode with persistent storage and smooth transitions across all portals |
| **Responsive Design** | Full desktop, tablet, and mobile responsiveness including a dedicated student bottom navigation bar |

---

## 🎯 The Problem SkillSetu Solves

1. **Static Resumes vs. Actual Competencies**: Traditional applications highlight pedigree over practical ability. SkillSetu anchors evaluation on tiered, verifiable competencies and real projects.
2. **Curriculum-Industry Gap**: Academic syllabi often lag industry toolchains. SkillSetu gives academia visibility into real-time skill demand while providing students clear roadmaps for skill acquisition.
3. **Hyperlocal Opportunity Discovery**: Students frequently miss relevant opportunities near their institutions. SkillSetu's distance-aware opportunity radar highlights nearby startups and companies.
4. **Transparent Recruitment**: Companies spend weeks screening unqualified candidates. SkillSetu's transparent 100-point matching criteria reduces screening overhead and accelerates technical shortlisting.

---

## 🔮 Future Roadmap

The following capabilities represent planned future enhancements:

- [ ] **Predictive Career Trajectory Mapping**: Forecasting career paths over time. (Today's
  `/api/ai/recommendations` ranks current opportunities; it does not yet project trajectories.)
- [ ] **Proctored Coding Assessments**: Integrated in-browser code editor and automated test runner for real-time coding evaluations.
- [ ] **Enterprise ATS Integrations**: Webhook and API connectors for major applicant tracking systems (Greenhouse, Lever, Workday).
- [ ] **Automated University Placement Reports**: One-click generation of institutional accreditation and NIRF/NAAC placement audit reports.
- [ ] **Bilateral MoU Digital Signatures**: Cryptographic signing and tracking of corporate-college partnership agreements.
- [ ] **Video Mock Interviews**: Video-based evaluation of pacing, clarity, and presentation. (Voice mode already ships via Gemini Live; webcam capture and visual metrics are not implemented.)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps to contribute:

1. **Fork** the repository
2. **Create a Feature Branch** (`git checkout -b feature/YourFeatureName`)
3. **Commit Your Changes** (`git commit -m "feat: add some amazing feature"`)
4. **Verify Type Safety & Linting** (`npm run type-check && npm run lint`)
5. **Push to the Branch** (`git push origin feature/YourFeatureName`)
6. **Open a Pull Request**

---

## 📄 License & Terms

Private repository. Copyright © 2026 SkillSetu. All rights reserved.
