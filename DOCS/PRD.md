# SkillSetu — Product Requirements Document (PRD)

> GAT054 | Smart India Hackathon Internal Hackathon | Prototype MVP

---

## 1. Document Information

| Field | Value |
|---|---|
| Product Name | SkillSetu |
| Team ID | GAT054 |
| Project Type | Academia–Industry Collaboration Platform |
| Project Stage | SIH Final Round Prototype |
| PRD Version | 1.0.0 |
| Status | Active |
| Target Submission | 15 September 2026 |

---

## 2. Product Overview

### 2.1 What is SkillSetu?

SkillSetu is an intelligent Academia–Industry Collaboration Platform that connects students, companies, colleges, and ministries through a common skill-based ecosystem.

The platform helps students understand their current skills, identify skill gaps, discover suitable career paths, and find jobs, internships, challenges, and same-day tasks that match their capabilities.

At the same time, SkillSetu enables companies to discover suitable candidates based on skills, colleges to understand student skill readiness and industry demand, and ministries to monitor aggregate workforce skill readiness and opportunity data.

The central idea of SkillSetu is:

> Connect skills with opportunities and connect academia with industry.

---

## 3. Vision

To build a unified skill-intelligence ecosystem where:

- Students understand what they know and what they need to learn.
- Companies discover candidates based on relevant skills.
- Colleges understand the gap between student capabilities and industry requirements.
- Ministries gain high-level visibility into workforce skill readiness and opportunity distribution.

---

## 4. Mission

SkillSetu aims to reduce the gap between academic education and industry requirements by creating a platform that connects:

Student Profile
↓
Skills
↓
Skill Gap
↓
Career Readiness
↓
Industry Requirements
↓
Opportunity Matching
↓
Jobs / Internships / Challenges / Tasks

---

## 5. Problem Statement

### 5.1 Student Problem

Many students complete their academic programs without having a clear understanding of:

- Their actual skill profile.
- Their skill proficiency.
- The skills required by industry.
- The gap between their current skills and career requirements.
- Which career path is suitable for them.
- Which internships or jobs match their capabilities.
- What skills they should learn next.

Existing job portals primarily focus on listing opportunities. They generally do not provide a complete skill-readiness journey from:

Current Skills → Skill Gap → Career Recommendation → Opportunity → Application

SkillSetu addresses this gap.

---

### 5.2 Industry Problem

Companies often receive a large number of applications for jobs and internships.

Finding suitable candidates can be difficult when recruitment depends heavily on:

- Resume keywords.
- Degree.
- College.
- Experience.
- Generic qualifications.

Companies need a more skill-oriented way to identify candidates who match their actual requirements.

SkillSetu provides skill-based candidate matching and allows companies to understand:

- Which skills a candidate possesses.
- Which required skills match.
- Which skills are missing.
- How strongly the candidate matches an opportunity.

---

### 5.3 College Problem

Colleges need better visibility into:

- Student skill distribution.
- Student skill proficiency.
- Common skill gaps.
- Industry-demanded skills.
- Internship participation.
- Placement readiness.
- Placement trends.

Without consolidated skill intelligence, colleges may struggle to identify where students need additional training or how closely academic outcomes align with industry requirements.

SkillSetu addresses this through a centralized college intelligence dashboard.

---

### 5.4 Ministry / Government Problem

At a larger level, ministries and policymakers need insights into:

- Workforce skill readiness.
- High-demand skills.
- Skill supply.
- Skill demand.
- Supply-demand gaps.
- Opportunity distribution.
- Regional trends.

SkillSetu provides an aggregate intelligence layer to visualize these indicators without exposing individual student information.

---

## 6. Product Goals

The primary goals of the SkillSetu MVP are:

1. Build a unified Academia–Industry Collaboration Platform.
2. Provide skill-based opportunity discovery.
3. Analyze student skill gaps.
4. Recommend suitable career paths.
5. Match students with jobs and internships.
6. Help companies discover suitable candidates.
7. Provide colleges with skill and industry-demand insights.
8. Provide ministries with aggregate workforce intelligence.
9. Provide an interactive opportunity map.
10. Ensure the prototype remains functional using fallback demo data.
11. Provide a polished, professional, premium user experience suitable for SIH evaluation.
12. Demonstrate a complete end-to-end student-to-opportunity workflow.

---

## 7. Target Users

SkillSetu supports four primary user roles.

### 7.1 Student

Students use SkillSetu to:

- Build professional profiles.
- Manage skills.
- Add education.
- Manage resumes.
- Add certificates.
- Add projects.
- Discover jobs.
- Discover internships.
- Discover challenges.
- Discover same-day tasks.
- Analyze skill gaps.
- Explore career recommendations.
- Check opportunity match scores.
- Apply to opportunities.
- Track applications.

---

### 7.2 Company

Companies use SkillSetu to:

- Create company profiles.
- Post jobs.
- Post internships.
- Post challenges.
- Post same-day tasks.
- Define required skills.
- Review applicants.
- Discover matching candidates.
- Compare candidate skill compatibility.

---

### 7.3 College

Colleges use SkillSetu to:

- Monitor student skills.
- Analyze skill proficiency.
- Identify common skill gaps.
- Understand industry skill demand.
- Monitor internship participation.
- View placement insights.
- Understand overall student readiness.

---

### 7.4 Ministry

Ministries use SkillSetu to:

- Monitor aggregate skill readiness.
- Identify high-demand skills.
- Compare skill supply and demand.
- View opportunity distribution.
- Analyze regional trends.
- Monitor workforce readiness indicators.

---

## 8. Product Scope

The SkillSetu MVP contains the following features:

| ID | Feature | Priority |
|---|---|---|
| F-01 | Job and Internship Listings | P0 |
| F-02 | Live Job Map | P1 |
| F-03 | Skill-Gap Analysis | P0 |
| F-04 | Career Recommendations | P1 |
| F-05 | Skill Matching | P0 |
| F-06 | Student Profiles | P0 |
| F-07 | Role-Based Dashboards | P0 |
| F-08 | Company Tools | P0 |
| F-09 | College Insights | P1 |
| F-10 | Ministry Overview | P1 |
| F-11 | Fallback Demo Data | P0 |

These features define the MVP scope.

Any major feature outside this scope should not be introduced during prototype development unless explicitly approved by the team.

---

# 9. Functional Requirements

## F-01 — Job and Internship Listings

### Objective

Provide a centralized marketplace for discovering career and industry opportunities.

### Supported Opportunity Types

The platform shall support:

- Jobs.
- Internships.
- Challenges.
- Same-day tasks.

### Opportunity Card

Each opportunity card should display:

- Opportunity title.
- Company name.
- Opportunity type.
- Location.
- Work mode.
- Required skills.
- Experience level.
- Duration.
- Deadline.
- Posted date.
- Skill match percentage where applicable.

### Search

Users should be able to search opportunities using keywords.

Example searches:

- Python Developer.
- Data Analyst.
- Business Analyst.
- Machine Learning Intern.
- Finance Intern.
- Software Developer.
- UI/UX Challenge.

### Filters

Users should be able to filter opportunities using relevant criteria such as:

- Opportunity type.
- Skill.
- Location.
- Work mode.
- Experience level.
- Duration.
- Deadline.

### Opportunity Details

The opportunity detail page should contain:

#### Basic Information

- Title.
- Company.
- Opportunity type.
- Location.
- Work mode.

#### Description

- Role description.
- Responsibilities.
- Expectations.

#### Requirements

- Required skills.
- Preferred skills.
- Education requirements.
- Experience requirements.

#### Additional Information

- Duration.
- Deadline.
- Compensation where applicable.
- Application process.

#### Student Matching Information

For students, the page should display:

- Match percentage.
- Matching skills.
- Missing skills.
- Skill-gap summary.

### Acceptance Criteria

- Users can browse opportunities.
- Users can search opportunities.
- Users can filter opportunities.
- Users can view opportunity details.
- Students can see skill-match information.
- Students can initiate an application.
- The interface works with fallback demo data.

---

## F-02 — Live Job Map

### Objective

Provide an interactive map that allows users to discover opportunities based on location.

### Requirements

The map should:

- Display opportunity markers.
- Support zooming.
- Allow geographical exploration.
- Display opportunity information.
- Support opportunity filtering.
- Connect map results with opportunity listings.

### Marker Information

When a user selects a marker, the system should display:

- Opportunity title.
- Company.
- Opportunity type.
- Location.
- Match percentage where applicable.
- Short description.

### Map Flow

Open Job Map
↓
Explore Location
↓
View Opportunity Markers
↓
Select Opportunity
↓
View Opportunity Details
↓
View Skill Match
↓
Apply

### Prototype Requirement

The prototype may use seeded or demo geographical coordinates.

Real-time user location tracking is not required for the MVP.

---

## F-03 — Skill-Gap Analysis

### Objective

Compare a student's current skills against the skills required for a selected career or opportunity.

### Inputs

The system may use:

- Student skills.
- Skill proficiency.
- Target career.
- Required skills.
- Preferred skills.
- Relevant projects.
- Relevant experience.

### Outputs

The system should identify:

- Matching skills.
- Strong skills.
- Missing skills.
- Skills requiring improvement.
- Overall readiness.
- Match percentage.
- Recommended improvement areas.

### Example

Target Career: Data Analyst

Current Skills:
- Python.
- SQL.
- Excel.
- Data Analysis.

Skill Gaps:
- Power BI.
- Statistics.
- Data Visualization.

Readiness:
78%

### Explainability

The system must not rely only on a numerical score.

The user should understand why the score was generated.

Example:

Strong Skills:
- SQL.
- Python.
- Excel.

Needs Improvement:
- Power BI.
- Advanced Statistics.

### Acceptance Criteria

- Student can select a target career or opportunity.
- Current skills are compared against required skills.
- Matching skills are displayed.
- Missing skills are displayed.
- Readiness or match score is displayed.
- The result provides an understandable explanation.

---

## F-04 — Career Recommendations

### Objective

Provide personalized career recommendations based on the student's profile and skills.

### Recommendation Inputs

The recommendation system may consider:

- Education.
- Skills.
- Skill proficiency.
- Projects.
- Interests.
- Career preferences.
- Industry requirements.

### Recommendation Output

Each recommendation should contain:

- Career name.
- Suitability level.
- Required skills.
- Matching skills.
- Skill gaps.
- Suggested learning areas.
- Relevant opportunities where applicable.

### Example

Recommended Career:
Business Analyst

Suitability:
High

Matching Skills:
- Excel.
- SQL.
- Business Analysis.
- Communication.

Skills to Improve:
- Power BI.
- Statistics.

Suggested Next Step:
Build a business analytics project.

### AI Requirement

AI may be used to generate personalized recommendations and explanations.

AI recommendations should preferably be grounded in structured career and skill information.

---

## F-05 — Skill Matching

### Objective

Determine how closely a student's skills match the requirements of an opportunity.

### Inputs

The matching system may consider:

- Student skills.
- Skill proficiency.
- Required skills.
- Preferred skills.
- Relevant projects.
- Relevant experience.

### Outputs

The system should provide:

- Overall match percentage.
- Matching skills.
- Missing skills.
- Skill-level differences.
- Match explanation.

### Example

Match:
87%

Matching Skills:
- Python.
- SQL.
- Excel.
- Data Analysis.

Missing Skills:
- Power BI.
- Advanced Statistics.

### Company-Side Matching

Companies should be able to see candidate compatibility.

Example:

Candidate A — 92% Match
Candidate B — 86% Match
Candidate C — 74% Match

Companies should be able to inspect the reason behind the match score.

---

## F-06 — Student Profiles

### Objective

Provide students with a centralized professional profile used for skill analysis, matching, recommendations, and applications.

### Profile Sections

#### Personal Information

- Name.
- Profile image.
- Contact information where appropriate.

#### Education

- Institution.
- Degree.
- Branch or specialization.
- Graduation year.

#### Skills

- Skill name.
- Skill category.
- Proficiency level.

#### Resume

- Resume information.
- Resume upload or reference where supported.

#### Certificates

- Certificate name.
- Issuing organization.
- Date.
- Credential information where applicable.

#### Projects

- Project name.
- Description.
- Technologies used.
- Skills used.

#### Applications

- Applied opportunities.
- Application status.
- Application date.

### Skill Proficiency

The prototype may support:

- Beginner.
- Intermediate.
- Advanced.
- Expert.

### Profile Completion

The platform should provide a profile-completion indicator.

Example:

Profile Completion:
82%

### Acceptance Criteria

- Student can view their profile.
- Student can edit profile information.
- Student can add and manage skills.
- Student can manage certificates.
- Student can manage resume information.
- Student can manage projects.
- Student can view applications.

---

## F-07 — Role-Based Dashboards

### Objective

Provide separate dashboard experiences for each user role.

---

### Student Dashboard

The student dashboard should provide:

- Profile completion.
- Skill overview.
- Skill readiness.
- Skill-gap summary.
- Career recommendations.
- Recommended opportunities.
- Opportunity match scores.
- Application status.

Example dashboard content:

Good Morning

Profile Completion:
82%

Skill Readiness:
78%

Recommended Career:
Business Analyst

Top Opportunity:
Data Analyst Intern — 91% Match

Skills to Improve:
- Power BI.
- Statistics.

---

### Company Dashboard

The company dashboard should provide:

- Company overview.
- Active opportunities.
- Posted opportunities.
- Applications.
- Candidate matches.
- Shortlisted candidates.

---

### College Dashboard

The college dashboard should provide:

- Student skill distribution.
- Skill gaps.
- Industry demand.
- Internship insights.
- Placement insights.

---

### Ministry Dashboard

The ministry dashboard should provide:

- National skill readiness.
- High-demand skills.
- Skill supply.
- Skill demand.
- Supply-demand gap.
- Opportunity distribution.
- Regional trends.

---

## F-08 — Company Tools

### Objective

Enable companies to create opportunities and identify suitable candidates.

### Company Profile

Company profiles may contain:

- Company name.
- Logo.
- Industry.
- Description.
- Location.
- Website or reference information.

### Create Opportunity

Companies should be able to define:

- Opportunity title.
- Opportunity type.
- Description.
- Responsibilities.
- Required skills.
- Preferred skills.
- Location.
- Work mode.
- Experience.
- Duration.
- Deadline.

### Candidate Review

Companies should be able to:

- View applicants.
- View candidate profiles.
- View skill-match percentage.
- View matching skills.
- View missing skills.
- Review candidates.
- Shortlist candidates where supported.

### Acceptance Criteria

- Company can create an opportunity.
- Company can define required skills.
- Opportunity appears in the marketplace.
- Suitable candidates can be identified.
- Applicants can be reviewed.

---

## F-09 — College Insights

### Objective

Provide colleges with aggregated intelligence about student skills, industry demand, internships, and placements.

### Student Skill Insights

The dashboard should display:

- Most common skills.
- Skill proficiency distribution.
- Emerging skills.
- Common skill gaps.

### Industry Demand

The dashboard should display:

- High-demand skills.
- Industry demand.
- Student skill supply.
- Supply versus demand.

### Placement Insights

The prototype may display:

- Placement rate.
- Internship participation.
- Applications.
- Skills associated with successful placements.

### Example

Industry Demand:

SQL
Python
Power BI
Cloud
Machine Learning

The dashboard should communicate relative demand through charts or other appropriate visualizations.

---

## F-10 — Ministry Overview

### Objective

Provide an aggregate overview of national or regional skill readiness and opportunity information.

### Key Indicators

The dashboard should demonstrate metrics such as:

- Overall skill readiness.
- High-demand skills.
- Skill supply.
- Skill demand.
- Supply-demand gap.
- Opportunity count.
- Internship count.
- Regional distribution.

### Supply versus Demand

Example:

Skill:
Python

Demand:
82%

Supply:
67%

Gap:
15%

### Regional Insights

Where applicable, the dashboard may display:

- Region.
- Opportunity count.
- Skill demand.
- Skill readiness.
- Supply-demand gaps.

### Data Privacy

The ministry dashboard should use:

- Aggregated data.
- Anonymized data.
- Seeded or demo data.

Individual student information should not be exposed through the ministry dashboard.

---

## F-11 — Fallback Demo Data

### Objective

Ensure that the prototype continues functioning even when backend services or external APIs are unavailable.

This is a mandatory requirement for the SIH prototype.

### Expected Behavior

Frontend
↓
API Request
↓
API Available? 
├── Yes → Real Data
└── No → Demo Data
↓
UI

### Fallback Coverage

Fallback data should be available for critical screens:

- Student dashboard.
- Student profile.
- Opportunities.
- Skill analysis.
- Career recommendations.
- Company dashboard.
- College dashboard.
- Ministry dashboard.
- Job map.

### Data Compatibility

Fallback data should follow the same basic data structures as API responses wherever practical.

The frontend should be able to switch between real and demo data without requiring a redesign.

---

# 10. AI Requirements

AI is an intelligence layer within SkillSetu.

AI should be used where it provides meaningful product value.

### AI Use Cases

#### Skill-Gap Explanation

Explain why a student has a particular skill gap.

#### Career Recommendation

Recommend suitable career paths based on the student's profile.

#### Learning Recommendation

Suggest learning areas based on identified skill gaps.

#### Opportunity Explanation

Explain why an opportunity matches or does not match a student.

#### Candidate Explanation

Explain why a candidate matches a company's requirements.

---

## 10.1 AI Output Principles

AI-generated results should be:

- Relevant.
- Explainable.
- Context-aware.
- Consistent with platform data.
- Grounded where possible.

The system should avoid presenting unsupported AI-generated claims as verified facts.

---

# 11. RAG Requirements

Retrieval-Augmented Generation may be used to provide contextual information for:

- Career information.
- Industry skill requirements.
- Skill frameworks.
- Research-backed skill information.
- Learning recommendations.
- Curated career resources.

Conceptual flow:

Knowledge Sources
↓
Document Processing
↓
Chunking
↓
Embeddings
↓
Vector Search
↓
Relevant Context
↓
LLM
↓
Grounded Recommendation

RAG is not required for every feature.

Core platform functionality must remain usable if the RAG service is unavailable.

---

# 12. Core User Journeys

## 12.1 Student Journey

Login
↓
Student Dashboard
↓
Complete Profile
↓
Add Skills
↓
Analyze Skills
↓
Select Career
↓
Receive Career Recommendations
↓
Explore Opportunities
↓
View Skill Match
↓
View Skill Gap
↓
Apply
↓
Track Application

---

## 12.2 Company Journey

Login
↓
Company Dashboard
↓
Create Opportunity
↓
Define Required Skills
↓
Publish Opportunity
↓
View Candidate Matches
↓
Review Applicants
↓
Shortlist Candidates

---

## 12.3 College Journey

Login
↓
College Dashboard
↓
View Student Skill Distribution
↓
Identify Skill Gaps
↓
View Industry Demand
↓
Compare Skill Supply vs Demand
↓
View Internship / Placement Insights

---

## 12.4 Ministry Journey

Login
↓
Ministry Dashboard
↓
View National Skill Readiness
↓
View Skill Demand
↓
Compare Supply vs Demand
↓
View Opportunity Distribution
↓
View Regional Trends

---

# 13. Core Data Entities

The platform should conceptually support the following entities.

## User

- id
- name
- email
- role
- created_at

## Student

- user_id
- education
- skills
- resume
- certificates
- projects
- profile_completion

## Skill

- id
- name
- category
- description

## Student Skill

- student_id
- skill_id
- proficiency

## Company

- id
- name
- industry
- description
- location

## Opportunity

- id
- company_id
- title
- type
- description
- location
- work_mode
- required_skills
- preferred_skills
- deadline
- created_at

## Application

- id
- student_id
- opportunity_id
- status
- created_at

## Skill Match

- student_id
- opportunity_id
- score
- matched_skills
- missing_skills

## Career

- id
- name
- description
- required_skills

---

# 14. Search Requirements

Opportunity discovery should support:

- Keyword search.
- Skill search.
- Opportunity type.
- Location.
- Work mode.
- Experience level.

### Empty Search State

When no opportunities are found:

No opportunities found.

Try:

- Removing a filter.
- Searching another skill.
- Expanding the location.

---

# 15. Loading Requirements

Loading states should be provided for:

- Dashboards.
- Opportunity listings.
- Skill analysis.
- Career recommendations.
- Map data.
- Analytics.
- Candidate matching.

The application should avoid showing blank screens while data is loading.

---

# 16. Error Handling Requirements

Errors should be understandable to users.

Technical errors should not be unnecessarily exposed to users.

Instead of:

500 Internal Server Error

use:

We couldn't load live opportunities right now.

Showing available demo opportunities instead.

Critical failures should use fallback behavior whenever possible.

---

# 17. Empty State Requirements

Major collection-based screens should provide meaningful empty states.

Example:

No applications yet.

Explore opportunities that match your skills.

---

# 18. Responsive Requirements

SkillSetu should support:

- Desktop.
- Tablet.
- Mobile.

The primary SIH demonstration may be optimized for desktop, but core workflows should remain usable on smaller screens.

---

# 19. Accessibility Requirements

The prototype should follow basic accessibility principles:

- Clear typography.
- Adequate contrast.
- Semantic HTML.
- Visible interaction states.
- Meaningful labels.
- Keyboard-friendly controls where practical.
- Understandable error messages.

---

# 20. Performance Requirements

The application should:

- Minimize unnecessary API requests.
- Avoid blocking the main UI.
- Optimize images.
- Lazy-load expensive components where appropriate.
- Keep dashboard interactions responsive.
- Avoid excessive animations.
- Avoid unnecessary network requests.

---

# 21. Security Requirements

The implementation must:

- Never expose API keys in frontend code.
- Store secrets using environment variables.
- Validate backend inputs.
- Apply role-based authorization.
- Protect student information.
- Avoid committing secrets to Git.
- Sanitize user-generated content where appropriate.

---

# 22. Demo Data Requirements

Demo data must be:

- Realistic.
- Consistent.
- Internally connected.
- Reusable across screens.
- Structured similarly to production data.

The relationships should remain coherent.

Example:

Students
↓
Skills
↓
Opportunities
↓
Applications

and:

Companies
↓
Opportunities
↓
Required Skills
↓
Candidate Matches

---

# 23. Prototype Demonstration

The final prototype should demonstrate a coherent end-to-end story rather than a collection of unrelated screens.

## Student Demonstration

Student Profile
↓
Current Skills
↓
Skill-Gap Analysis
↓
Career Recommendation
↓
Relevant Internship
↓
91% Skill Match
↓
Missing Skills
↓
Application

---

## Company Demonstration

Company Dashboard
↓
Create Internship
↓
Define Required Skills
↓
Publish
↓
Candidate Matching
↓
Review Candidates

---

## College Demonstration

College Dashboard
↓
Student Skill Distribution
↓
Skill Gaps
↓
Industry Demand
↓
Placement Insights

---

## Ministry Demonstration

Ministry Dashboard
↓
National Skill Readiness
↓
Skill Demand
↓
Supply vs Demand
↓
Regional Opportunity Distribution

---

# 24. MVP Priority

## P0 — Must Work

The following functionality is critical:

- Student profile.
- Student skills.
- Job and internship listings.
- Skill matching.
- Skill-gap analysis.
- Company opportunity creation.
- Candidate/application flow.
- Role-based dashboards.
- Fallback demo data.

---

## P1 — Should Demonstrate

The following should be demonstrated if possible:

- Career recommendations.
- Live job map.
- College insights.
- Ministry overview.
- AI explanations.

---

## P2 — Optional Enhancement

Only implement these after the P0 features are stable:

- Advanced RAG.
- Advanced analytics.
- Additional visualizations.
- Advanced filtering.
- More sophisticated recommendation algorithms.

---

# 25. Out of Scope for MVP

The following are not required for the current prototype:

- Full production government integrations.
- Production-scale national employment databases.
- Native Android application.
- Native iOS application.
- Complex enterprise HR integrations.
- Payment systems.
- Fully automated recruitment.
- Production-scale distributed infrastructure.
- Large-scale real-time analytics.
- Fully autonomous AI agents.

These may be considered for future versions.

---

# 26. Product Design Direction

SkillSetu should have a:

- Premium.
- Professional.
- Modern.
- Intelligent.
- Trustworthy.
- Data-driven.
- Clean.

visual identity.

The product should feel like a modern career-intelligence and HR-tech SaaS platform rather than a traditional college management portal.

The detailed UI/UX system will be defined separately in:

docs/DESIGN.md

---

# 27. Technology Direction

The preferred prototype technology direction is:

## Frontend

- Next.js.
- TypeScript.
- Tailwind CSS.
- shadcn/ui.
- Lucide Icons.
- Recharts.
- Interactive map library.
- Framer Motion where appropriate.

## Backend

- FastAPI.
- Python.

## Database

- PostgreSQL.

## AI

- LLM API.
- Embeddings.
- RAG where appropriate.

## Vector Search

- pgvector or equivalent vector-search technology.

Detailed implementation decisions will be defined in:

docs/ARCHITECTURE.md

---

# 28. Product Principles

## 28.1 Skill First

Skills should be a central data layer connecting students, careers, and opportunities.

## 28.2 Explainability

Skill matches and recommendations should explain the reasoning behind their results.

## 28.3 Student First

Student workflows should be simple, useful, and actionable.

## 28.4 Industry Relevant

Industry requirements should influence skill analysis and opportunity matching.

## 28.5 Data Driven

Dashboards should provide actionable insights instead of meaningless statistics.

## 28.6 Reliable

Critical prototype flows should continue working when external services fail.

## 28.7 Prototype Focused

Working end-to-end functionality should be prioritized over unnecessary technical complexity.

## 28.8 Premium User Experience

The interface should communicate quality, trust, and technical maturity.

The product should avoid looking like a basic CRUD dashboard.

---

# 29. Success Criteria

## Student Success

The prototype should demonstrate that a student can:

- Create and manage a profile.
- Add skills.
- Understand skill readiness.
- Identify skill gaps.
- Receive career recommendations.
- Discover opportunities.
- Understand opportunity match scores.
- Apply to an opportunity.

## Company Success

The prototype should demonstrate that a company can:

- Create a company profile.
- Create an opportunity.
- Define required skills.
- Discover matching candidates.
- Review applicants.

## College Success

The prototype should demonstrate that a college can:

- View student skill distributions.
- Identify common skill gaps.
- Understand industry demand.
- View internship insights.
- View placement insights.

## Ministry Success

The prototype should demonstrate that a ministry can:

- View aggregate skill readiness.
- Understand high-demand skills.
- Compare skill supply and demand.
- View opportunity distribution.
- Understand regional trends.

## Technical Success

The prototype should:

- Run reliably.
- Support the primary demonstration flow.
- Have no critical runtime errors.
- Work using fallback demo data.
- Present a polished professional interface.
- Maintain consistent data across dashboards.
- Demonstrate the core value proposition within a short SIH presentation.

---

# 30. Definition of Done

A feature is considered complete when:

- [ ] Primary user flow works.
- [ ] UI is implemented.
- [ ] Responsive behavior is considered.
- [ ] Loading state is implemented where required.
- [ ] Error state is implemented where required.
- [ ] Empty state is implemented where required.
- [ ] Fallback behavior exists where required.
- [ ] Data structures are consistent.
- [ ] Existing functionality is not broken.
- [ ] Feature follows the architecture specification.
- [ ] Feature follows the design specification.
- [ ] Feature follows the development rules.
- [ ] Major decisions are documented.
- [ ] Feature is stable enough for the SIH demo.

---

# 31. Future Vision

Future versions of SkillSetu may include:

- Verified skill assessments.
- Industry-certified skill badges.
- AI resume analysis.
- Personalized learning paths.
- Industry mentorship.
- College-company collaboration programs.
- Advanced workforce forecasting.
- Government data integrations.
- Real-time labor-market intelligence.
- Advanced recommendation models.
- Verified industry skill frameworks.
- Automated skill assessments.

These features are not part of the current MVP.

---

# 32. Product Value Proposition

## For Students

> Understand your skills → identify your gaps → discover your career → find the right opportunity.

## For Companies

> Define required skills → discover matching candidates → review applicants.

## For Colleges

> Understand student skills → identify gaps → compare industry demand → improve student readiness.

## For Ministries

> Monitor skills → analyze demand → identify gaps → understand workforce readiness.

---

# 33. Core Product Loop

## Student

STUDENT
↓
PROFILE
↓
SKILLS
↓
SKILL-GAP ANALYSIS
↓
CAREER RECOMMENDATION
↓
OPPORTUNITY DISCOVERY
↓
SKILL MATCHING
↓
APPLICATION
↓
CAREER READINESS

---

## Company

COMPANY
↓
OPPORTUNITY
↓
REQUIRED SKILLS
↓
CANDIDATE MATCHING
↓
APPLICANT REVIEW

---

## College

COLLEGE
↓
STUDENT SKILLS
↓
SKILL GAPS
↓
INDUSTRY DEMAND
↓
PLACEMENT INSIGHTS

---

## Ministry

MINISTRY
↓
AGGREGATED DATA
↓
SKILL DEMAND
↓
SUPPLY VS DEMAND
↓
NATIONAL READINESS

---

# 34. Documentation Relationship

The SkillSetu project documentation should follow this hierarchy:

PRD.md
↓
Defines WHAT the product must do
↓
ARCHITECTURE.md
↓
Defines HOW the system is technically structured
↓
DESIGN.md
↓
Defines HOW the product should look and behave
↓
RULES.md
↓
Defines development and implementation constraints
↓
PHASES.md
↓
Defines WHEN and IN WHAT ORDER features are implemented
↓
MEMORY.md
↓
Records important project decisions and current state

---

# 35. Source of Truth

This document is the product-level source of truth for the SkillSetu MVP.

All implementation work should remain aligned with the requirements defined here.

If a new feature, major workflow, or significant product change is proposed, the PRD should be updated before the implementation becomes part of the official product scope.

Architecture decisions belong in:

docs/ARCHITECTURE.md

UI and UX decisions belong in:

docs/DESIGN.md

Development constraints belong in:

docs/RULES.md

Implementation phases belong in:

docs/PHASES.md

Important project decisions and state belong in:

docs/MEMORY.md

---

# 36. Final Product Statement

> SkillSetu is an AI-assisted Academia–Industry Collaboration Platform that maps student skills to career requirements and real-world opportunities while enabling companies to discover skill-matched talent and providing colleges and ministries with actionable workforce skill intelligence.

---

# 37. SIH Prototype Objective

The primary objective of the SIH prototype is to demonstrate that SkillSetu can create a meaningful connection between:

Academic Skills
↓
Industry Requirements
↓
Skill Gap
↓
Career Readiness
↓
Opportunity Matching
↓
Application
↓
Industry Talent Discovery

The prototype should prioritize:

1. A strong visual first impression.
2. A clear product story.
3. Functional core workflows.
4. Explainable skill intelligence.
5. Role-specific experiences.
6. Consistent demo data.
7. Reliable fallback behavior.
8. A professional and premium interface.

The prototype should make the value of the platform understandable within the first few minutes of interaction.

---

# 38. Final MVP Definition

The SkillSetu MVP is complete when the team can demonstrate the following scenario without critical failure:

A student creates or opens a profile, views their skills, receives a skill-gap analysis, receives a relevant career recommendation, discovers a suitable internship or job, sees an explainable skill-match score, views missing skills, and applies for the opportunity.

At the same time, the company side should demonstrate how an opportunity is created and how suitable candidates can be identified.

The college side should demonstrate student skill and industry-demand insights.

The ministry side should demonstrate aggregate workforce readiness and supply-demand intelligence.

If live services are unavailable, the same demonstration should continue using fallback demo data.

---

# 39. Document Status

**Product:** SkillSetu  
**Team:** GAT054  
**Document:** Product Requirements Document  
**Version:** 1.0.0  
**Status:** Active  
**Target:** SIH Final Round Prototype  
**Submission Date:** 15 September 2026

---

**End of PRD**
