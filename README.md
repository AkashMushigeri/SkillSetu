# 🌟 SkillSetu — AYUSH Career Bridge

> **Smart India Hackathon (SIH) Prototype | Team ID: GAT054**  
> *"Portal for Academia–Industry collaboration for Skill Mapping, Internships and Placement"*

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-green?style=for-the-badge&logo=leaflet)](https://leafletjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## 📌 Problem Statement & Overview

Engineering colleges often face a **curriculum-skill lag** where graduates lack the specific competencies demanded by modern startups and high-growth industries. Resumes fail to reflect true hands-on capability, and companies struggle to filter talent based on verified technical abilities.

**SkillSetu** bridges this gap by creating an intelligent, skill-first ecosystem connecting **Students**, **Colleges**, and **Industry**:
- **Students** map verified skills, discover skill gaps, and access startup-friendly micro-sprints and internships.
- **Industry** discovers candidate profiles using a 100-point transparent skill match engine, manages an 8-stage Kanban pipeline, issues formal digital offer letters, and reviews live hackathon code benchmarks.
- **Colleges** track student placement readiness, identify curriculum blindspots, and collaborate with employers through AICTE-aligned bilateral Memoranda of Understanding (MoU).

---

## 🚀 Key Modules & Capabilities

### 1. 🏢 Industry / Corporate Portal (`/industry/*`)
*Demo Profile: TechNova Labs (Bengaluru · 120+ Employees · HR Lead: Rahul Verma)*

- **Skill-First Talent Discovery**: Filter candidates by granular skill levels (Basic, Intermediate, Advanced) and audited registry badges rather than static keyword resumes.
- **Transparent 100-Point Match Engine**:
  - Skill Overlap (60%)
  - Verified Registry Audit (15%)
  - Project & Repository Quality (10%)
  - Prior Sprint Experience (5%)
  - Academic CGPA (5%)
  - Proximity Radius (5%)
- **8-Stage Interactive Kanban Hiring Pipeline**: Drag-and-drop progression across *New Application*, *Screening*, *Shortlisted*, *Technical Interview*, *HR Interview*, *Selected*, *Offer Sent*, and *Hired*.
- **Integrated Interview Center**: Schedule technical and HR rounds with Google Meet links, scorecards, and recruiter notes.
- **Interactive Leaflet Ecosystem Map**: Visualizes company HQ (Indiranagar) and 14 affiliated partner institutions with dynamic radius filtering (5 km to 100 km).
- **Challenge Submissions Leaderboard**: Review code submissions from student teams, inspect automated unit test pass rates (`18/18 100%`), and **Fast-Track to Technical Interview** in 1 click.
- **Bilateral MoU & Curriculum Studio**: Recommend modern syllabus upgrades to college academic senates (e.g., Vector DBs, Edge AI) and download official AICTE-aligned MoU agreements.
- **Digital Offer Letter Studio**: Generate itemized compensation packages (Base Fixed, Variable, Retention Bonus) and print official corporate letterheads.

---

### 2. 🎓 Student Experience Portal (`/student/*`)
*Demo Profile: Aarav Sharma (B.Tech Computer Science, 3rd Year · RVCE Bengaluru)*

- **Verified Skill Badges**: Registry-verified competency scores with cryptographic verification seals.
- **AI Skill Gap Analysis**: Identifies missing competencies for aspirational roles (e.g. Machine Learning Engineer).
- **Interactive Opportunity Radar**: Geolocation-aware map showing nearby startups, internships, and micro-sprints.
- **One-Click Application & Timeline**: Real-time status tracking across screening, interviews, and offer letters.
- **Interactive Portfolio & Resume Builder**: Dynamic project showcases and clean PDF exports.

---

### 3. 🏫 Academia & College Portal (`/college/*`)
*Demo Profile: RV College of Engineering / AYUSH Technical Institutions*

- **Institutional Placement Dashboard**: Real-time KPI tracking across batch placement readiness, active drives, and hiring rates.
- **Student Skill Registry**: Batch-wide competency heatmaps across departments (AIML, CSE, ECE).
- **Eligibility Engine**: Set minimum CGPA and skill thresholds for campus placement drives.
- **Corporate Partnerships Tracker**: Manage bilateral MoUs, faculty immersion programs, and joint hackathon sponsorships.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | [Next.js 14](https://nextjs.org/) (App Router, Server & Client Components) |
| **Language** | [TypeScript 5.7](https://www.typescriptlang.org/) (Strict Mode) |
| **Styling & UI** | [Tailwind CSS 3.4](https://tailwindcss.com/), [Lucide React](https://lucide.dev/) Icons |
| **Interactive Maps** | [Leaflet](https://leafletjs.com/), [React Leaflet](https://react-leaflet.js.org/), OpenStreetMap |
| **Visual Effects** | [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) |
| **State Management** | Modular React Context API with automated `localStorage` persistence |
| **Build & Tooling** | PostCSS, Autoprefixer, Next SWC Compiler |

---

## ⚡ Quickstart & Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) v18.17+ or v20+
- [Git](https://git-scm.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/AkashMushigeri/SkillSetu.git
cd SkillSetu
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

Open your browser and navigate to:
👉 **`http://localhost:3000`**

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 🔑 Demo Access Credentials

The platform includes 1-click demo login buttons for seamless hackathon presentations:

| Portal | Login URL | Default Username | Default Password | Demo Persona |
|---|---|---|---|---|
| **Industry Portal** | [`/industry/login`](http://localhost:3000/industry/login) | `hr@technova.com` | `industry123` | Rahul Verma (Head of Talent, TechNova Labs) |
| **Student Portal** | [`/login`](http://localhost:3000/login) | `aarav.sharma@rvce.edu.in` | `demo123` | Aarav Sharma (3rd Year CS Student, RVCE) |
| **College Portal** | [`/college/login`](http://localhost:3000/college/login) | `admin@ayushcollege.edu` | `college123` | Placement Director, Affiliated Institution |

---

## 📂 Project Directory Structure

```
SkillSetu/
├── src/
│   ├── app/
│   │   ├── industry/             # Industry Portal (Jobs, Pipeline, MoUs, Offers, Map)
│   │   │   ├── analytics/        # Recruitment funnel & hiring performance
│   │   │   ├── applications/     # Candidate application management
│   │   │   ├── candidates/       # Skill-first talent search & candidate profiles
│   │   │   ├── challenges/       # Hackathons, benchmarks & submission leaderboard
│   │   │   ├── colleges/         # Academia collaboration & Bilateral MoU studio
│   │   │   ├── dashboard/        # Executive hiring KPI dashboard
│   │   │   ├── internships/      # Startup-friendly student opportunities
│   │   │   ├── interviews/       # Scheduling center with Google Meet
│   │   │   ├── jobs/             # Job creation with Required Skills Builder
│   │   │   ├── offers/           # Digital offer letter generator & letterhead
│   │   │   ├── pipeline/         # 8-stage interactive Kanban board
│   │   │   ├── profile/          # TechNova Labs company branding
│   │   │   └── settings/         # Hiring thresholds & preferences
│   │   ├── student/              # Student Portal (Skills, Learning, Opportunities)
│   │   ├── college/              # College Portal (Analytics, Students, Placements)
│   │   └── login/                # Streamlined multi-role portal authentication
│   ├── components/
│   │   ├── industry/             # Industry cards, modals, tables, and Leaflet maps
│   │   ├── student/              # Student UI widgets and opportunity cards
│   │   └── college/              # College analytics charts and modals
│   ├── context/
│   │   ├── IndustryContext.tsx   # Centralized store with localStorage persistence
│   │   ├── StudentContext.tsx    # Student state provider
│   │   └── CollegeContext.tsx    # College institutional state provider
│   ├── data/
│   │   └── industry/             # Rich mock datasets (Jobs, Candidates, MoUs, Offers)
│   ├── lib/
│   │   └── industryMatching.ts   # 100-point skill match algorithm
│   └── types/
│       └── industry.ts           # Strict TypeScript schemas
├── public/                       # Static assets & icons
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🏆 Smart India Hackathon Presentation Flow (3-Minute Script)

1. **Sign In**: Navigate to [`/industry/login`](http://localhost:3000/industry/login) and click **"Login as TechNova HR (1-Click Demo)"**.
2. **Dashboard & Radius Map**: Present the 6 hiring KPI cards and the Indiranagar HQ **Leaflet Ecosystem Map** showing verified talent density across a 25 km radius.
3. **Skill-First Discovery**: Open **Find Talent**, select `Python` + `Machine Learning` + `SQL`, and show **Aarav Sharma** matching at 94%.
4. **Verified Credential Deep-Dive**: Click Aarav's profile to demonstrate the audited **National Skill Registry** badge and radar breakdown. Click **Shortlist Candidate**.
5. **Kanban Pipeline**: Advance Aarav through the 8-stage Kanban board to **Technical Interview**.
6. **Code Benchmark & Hackathons**: Open **Challenges &rarr; Review Submissions** to show student code test pass rates (`18/18 100%`) and click **Fast-Track to Interview**.
7. **Academia-Industry Bilateral MoUs**: Open **Colleges &rarr; MoU & Curriculum Studio** to show syllabus upgrade advisories (modernizing outdated subjects to Vector DBs & Edge AI) and export the official AICTE MoU PDF.
8. **Digital Offer Letter**: Open **Offers & Letters**, issue a structured package, and preview the formal TechNova corporate letterhead.

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---

**Developed with ❤️ for Smart India Hackathon | Team ID: GAT054**
