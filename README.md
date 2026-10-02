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
│   └── AI Mock Interview Engine (Gemini 1.5 Flash + Fallback)
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
  * Interactive interview simulator evaluating candidate responses for specific job roles.
  * Powered by Google Gemini 1.5 Flash with built-in NLP heuristics as a fallback.
  * Generates scoring metrics across technical accuracy, communication, and confidence.

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
| **AI Integration** | [Google Gemini API](https://ai.google.dev/) (Gemini 1.5 Flash via Server Route with local NLP fallback) |
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

## ⚡ Installation & Local Setup

### Prerequisites
* [Node.js](https://nodejs.org/) `>= 20.0.0`
* [npm](https://www.npmjs.com/) `>= 9.0.0`
* [Git](https://git-scm.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/AkashMushigeri/SkillSetu.git
cd SkillSetu
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Configure your environment variables as required:

```env
# Firebase Client SDK Configuration (Frontend-safe)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Server-only: Google Gemini API Key for AI features (Optional for local dev)
GEMINI_API_KEY=your_gemini_api_key

# Environment & Emulator Settings
NEXT_PUBLIC_ENV=development
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false
```

> **Note**: If `GEMINI_API_KEY` is omitted, the AI Interview and Resume Extraction features automatically use built-in NLP fallback engines without crashing.

### 4. Run the Development Server
```bash
npm run dev
```

Open your browser and navigate to:  
👉 **`http://localhost:3000`**

### 5. Build for Production
```bash
# Verify TypeScript types
npm run type-check

# Build optimized production bundle
npm run build

# Start production server
npm run start
```

### 6. Firebase Emulators (Optional)
To test Firebase Auth, Firestore, and Data Connect locally:
```bash
npm run emulators
```

---

## 📊 Feature Summary Table

| Functional Area | Current Production Capability |
|:---|:---|
| **Authentication** | Multi-role portal sign-in/up (Student, Industry, College), Google OAuth, Firebase Auth, password confirmation, self-service password reset |
| **Phone Validation** | Country selector with flags and ISO codes; strict 10-digit validation for India (`+91`) and international length enforcement |
| **Student Profile** | In-place modal editing for bio, header, GPA, career goals, links, and projects |
| **Education History** | Multi-tier records: College/University, PUC / 12th / Intermediate, and High School / 10th with verification badges |
| **Skills Catalog** | Tiered levels (**Basic**, **Intermediate**, **Advanced**) covering 16+ core skills with structured learning checklists |
| **Skill Assessment** | Topic-specific quizzes with instant scoring, answer explanations, and verified badge unlock |
| **College Directory** | Built-in directory of 200+ Indian institutions with fuzzy search, short-code matching, and city normalization |
| **Location & Radar** | Nominatim city autocomplete, Haversine distance calculations, and Leaflet interactive map with radius filters (5–100+ km) |
| **Opportunity Matching**| Transparent match breakdown displaying shared skills, missing competencies, verified boosts, and project relevance |
| **Resume Handling** | Interactive resume viewer, print/PDF export, and automated PDF resume text extraction (`pdf-parse`) |
| **AI Mock Interview** | Role-based interview simulator with scoring feedback via Gemini 1.5 Flash (with offline NLP fallback) |
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

- [ ] **AI-Powered Career Trajectory Mapping**: Predictive career path recommendations based on academic background and acquired skills.
- [ ] **Proctored Coding Assessments**: Integrated in-browser code editor and automated test runner for real-time coding evaluations.
- [ ] **Enterprise ATS Integrations**: Webhook and API connectors for major applicant tracking systems (Greenhouse, Lever, Workday).
- [ ] **Automated University Placement Reports**: One-click generation of institutional accreditation and NIRF/NAAC placement audit reports.
- [ ] **Bilateral MoU Digital Signatures**: Cryptographic signing and tracking of corporate-college partnership agreements.
- [ ] **Video Mock Interviews**: Video and audio metric evaluation analyzing pacing, clarity, and presentation skills.

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
