import { Client } from 'pg';
import { loadDatabaseEnv } from '../config/env';
import { logger } from '../lib/logger';
import { redactTarget } from './migrate';
import { getAllCatalogSkills, type SkillItem } from '../../../src/data/skillsData';
import { COLLEGES_DATA, type CollegeItem } from '../../../src/data/collegesData';
import {
  INITIAL_ANNOUNCEMENTS,
  INITIAL_COLLEGE_PROFILE,
  INITIAL_TRAINING_PROGRAMS,
  MOCK_PLACEMENT_DRIVES,
} from '../../../src/data/collegeData';
import { defaultCompanyProfile } from '../../../src/data/industry/industryCompanies';
import { mockJobs } from '../../../src/data/industry/industryJobs';
import { mockInternships } from '../../../src/data/industry/industryInternships';
import { mockChallenges } from '../../../src/data/industry/industryChallenges';
import { mockColleges } from '../../../src/data/industry/industryColleges';
import { mockCollegeMous } from '../../../src/data/industry/industryMous';

/**
 * PostgreSQL-only synthetic seed data.
 *
 * Hard constraints, enforced by review rather than by the compiler:
 *  - no firebase-admin import and no network call of any kind (validation row 22)
 *  - synthetic data only; no real personal data
 *  - idempotent: every statement is an upsert on a natural key
 *
 * Identity rows are deliberately NOT seeded. users.firebase_uid is NOT NULL and
 * is the permanent identity key, so a users row cannot be created without a real
 * Firebase Auth UID. `auth:seed:dev` owns the whole dev identity chain and is the
 * only writer of users and every user-scoped table, which is why there is no
 * second writer here that could disagree with it.
 */

const RELATIVE_DATE_PATTERN = /\b(ago|today|tonight|tomorrow|now|soon|left|remaining)\b/i;

type SeedStats = Record<string, number>;

type CollegeSeedRow = {
  name: string;
  normalizedName: string;
  code: string;
  shortName: string | null;
  aliases: string[];
  city: string | null;
  district: string | null;
  state: string | null;
  country: string;
  university: string | null;
  institutionType: string | null;
  affiliation: string | null;
  officialWebsite: string | null;
};

type CompanySeedRow = {
  name: string;
  normalizedName: string;
  type: string | null;
  industry: string | null;
  location: string | null;
  city: string | null;
  state: string | null;
  employees: string | null;
  founded: number | null;
  websiteUrl: string | null;
  tagline: string | null;
  about: string | null;
  mission: string | null;
  techStack: string[];
  departments: string[];
  hiringDomains: string[];
  benefits: string[];
  culture: string[];
  logoUrl: string | null;
  coverImageUrl: string | null;
};

export type SeedResult = {
  tableCounts: SeedStats;
  totalRows: number;
  skippedUserScoped: string[];
};

function normalizeName(value: string | null | undefined): string {
  if (!value) {
    return '';
  }

  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

/**
 * The seed catalogues store dates as display strings ("15 Nov 2026", "2 days ago",
 * "Tonight 11:59 PM"). Relative strings are rejected rather than resolved against
 * the clock, otherwise re-seeding would move rows and stop being idempotent.
 */
function parseSeedDate(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();

  if (RELATIVE_DATE_PATTERN.test(trimmed)) {
    return null;
  }

  const yearMatch = /\b(19|20)\d{2}\b/.exec(trimmed);

  if (!yearMatch) {
    return null;
  }

  const parsed = new Date(trimmed);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toISOString().slice(0, 10);
}

function parseNumber(value: string | number | null | undefined): number | null {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  if (!value) {
    return null;
  }

  const match = /-?\d+(?:\.\d+)?/.exec(value);
  return match ? Number(match[0]) : null;
}

/**
 * Maps a frontend display value onto a database enum value and fails loudly on an
 * unmapped value. A silent fallback would let the seed write a plausible-looking
 * but wrong status, which is far harder to notice than a hard failure.
 */
function toEnum(allowed: readonly string[], value: string, context: string): string {
  const direct = allowed.find((candidate) => candidate === value);

  if (direct) {
    return direct;
  }

  const slugged = slugify(value);

  if (allowed.includes(slugged)) {
    return slugged;
  }

  throw new Error(
    `Seed data contains "${value}" for ${context}, which is not a database enum value. Allowed: ${allowed.join(', ')}. Add the mapping in the migration or normalise the source catalogue.`,
  );
}

const WORK_MODES = ['remote', 'hybrid', 'onsite'] as const;
const EMPLOYMENT_TYPES = ['full_time', 'part_time', 'contract'] as const;
const OPPORTUNITY_STATUSES = ['draft', 'active', 'closed'] as const;
const SKILL_TIERS = ['basic', 'intermediate', 'advanced'] as const;
const SKILL_IMPORTANCES = ['required', 'preferred'] as const;
const CHALLENGE_STATUSES = ['active', 'upcoming', 'closed'] as const;
const CURRICULUM_STATUSES = ['adopted', 'in_review', 'pending_senate_approval'] as const;
const ANNOUNCEMENT_STATUSES = ['published', 'draft'] as const;
const PARTNERSHIP_STATUSES = ['active', 'pending', 'potential'] as const;
const MOU_STATUSES = ['active', 'under_review', 'draft', 'renewed'] as const;
const PLACEMENT_DRIVE_STATUSES = ['upcoming', 'ongoing', 'completed'] as const;
const TRAINING_STATUSES = ['active', 'upcoming', 'completed'] as const;
const RESOURCE_TYPES = ['video', 'doc', 'article', 'practice', 'mini_project'] as const;

function mapWorkMode(value: string): string {
  if (value === 'On-site' || value === 'Onsite') {
    return 'onsite';
  }
  return toEnum(WORK_MODES, value, 'work_mode');
}

function mapOpportunityStatus(value: string): string {
  // 'Expired' is a client-only display status with no rows in the seeded data; it
  // maps to closed rather than failing the whole seed.
  if (value === 'Expired') {
    return 'closed';
  }
  return toEnum(OPPORTUNITY_STATUSES, value, 'opportunity status');
}

function tierFromCatalogue(value: string): string {
  return toEnum(SKILL_TIERS, value, 'skill tier');
}

function collegeCodeFor(item: Pick<CollegeItem, 'id' | 'name'>): string {
  return item.id.trim().toUpperCase();
}

async function upsertColleges(client: Client, stats: SeedStats): Promise<Map<string, string>> {
  const idsByNormalizedName = new Map<string, string>();
  const rows: CollegeSeedRow[] = COLLEGES_DATA.map((item) => ({
    name: item.name,
    normalizedName: item.normalizedName ?? normalizeName(item.name),
    code: collegeCodeFor(item),
    shortName: item.shortName ?? null,
    aliases: item.aliases ?? [],
    city: item.city ?? null,
    district: item.district ?? null,
    state: item.state ?? null,
    country: item.country ?? 'India',
    university: item.university ?? null,
    institutionType: item.institutionType ?? item.type ?? null,
    affiliation: item.affiliation ?? null,
    officialWebsite: item.officialWebsite ?? null,
  }));

  const profile = INITIAL_COLLEGE_PROFILE;
  rows.push({
    name: profile.institutionName,
    normalizedName: normalizeName(profile.institutionName),
    code: profile.collegeId.trim().toUpperCase(),
    shortName: null,
    aliases: [],
    city: profile.location ?? null,
    district: null,
    state: null,
    country: 'India',
    university: null,
    institutionType: null,
    affiliation: null,
    officialWebsite: profile.website || null,
  });

  for (const row of rows) {
    const result = await client.query<{ id: string }>(
      `INSERT INTO colleges (
         name, normalized_name, code, short_name, aliases, city, district, state,
         country, university, institution_type, affiliation, official_website
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       ON CONFLICT (code) DO UPDATE SET
         name = EXCLUDED.name,
         normalized_name = EXCLUDED.normalized_name,
         short_name = EXCLUDED.short_name,
         aliases = EXCLUDED.aliases,
         city = EXCLUDED.city,
         district = EXCLUDED.district,
         state = EXCLUDED.state,
         university = EXCLUDED.university,
         institution_type = EXCLUDED.institution_type,
         affiliation = EXCLUDED.affiliation,
         official_website = EXCLUDED.official_website
       RETURNING id`,
      [
        row.name,
        row.normalizedName,
        row.code,
        row.shortName,
        row.aliases,
        row.city,
        row.district,
        row.state,
        row.country,
        row.university,
        row.institutionType,
        row.affiliation,
        row.officialWebsite,
      ],
    );

    const id = result.rows[0]?.id;

    if (!id) {
      continue;
    }

    for (const key of collegeLookupKeys(row.name)) {
      if (!idsByNormalizedName.has(key)) {
        idsByNormalizedName.set(key, id);
      }
    }

    for (const alias of row.aliases) {
      const key = normalizeName(alias);

      if (key && !idsByNormalizedName.has(key)) {
        idsByNormalizedName.set(key, id);
      }
    }

    if (row.shortName) {
      const key = normalizeName(row.shortName);

      if (key && !idsByNormalizedName.has(key)) {
        idsByNormalizedName.set(key, id);
      }
    }
  }

  stats.colleges = rows.length;
  return idsByNormalizedName;
}

async function upsertCompanies(
  client: Client,
  stats: SeedStats,
): Promise<Map<string, string>> {
  const idsByNormalizedName = new Map<string, string>();

  const profile = defaultCompanyProfile;
  const rows: CompanySeedRow[] = [
    {
      name: profile.name,
      normalizedName: normalizeName(profile.name),
      type: profile.type ?? null,
      industry: profile.industry ?? null,
      location: profile.location ?? null,
      city: null,
      state: null,
      employees: profile.employees ?? null,
      founded: profile.founded ?? null,
      websiteUrl: profile.website || null,
      tagline: profile.tagline || null,
      about: profile.about || null,
      mission: profile.mission || null,
      techStack: profile.techStack ?? [],
      departments: profile.departments ?? [],
      hiringDomains: profile.hiringDomains ?? [],
      benefits: profile.benefits ?? [],
      culture: profile.culture ?? [],
      logoUrl: profile.logo || null,
      coverImageUrl: profile.coverImage || null,
    },
  ];

  for (const job of [...mockJobs, ...mockInternships]) {
    const normalizedName = normalizeName(job.company);

    if (!normalizedName || rows.some((row) => row.normalizedName === normalizedName)) {
      continue;
    }

    rows.push({
      name: job.company,
      normalizedName,
      type: null,
      industry: null,
      location: job.location || null,
      city: null,
      state: null,
      employees: null,
      founded: null,
      websiteUrl: null,
      tagline: null,
      about: null,
      mission: null,
      techStack: [],
      departments: job.department ? [job.department] : [],
      hiringDomains: [],
      benefits: [],
      culture: [],
      logoUrl: null,
      coverImageUrl: null,
    });
  }

  for (const row of rows) {
    const result = await client.query<{ id: string }>(
      `INSERT INTO companies (
         name, normalized_name, type, industry, location, employees, founded,
         website_url, tagline, about, mission, tech_stack, departments,
         hiring_domains, benefits, culture, logo_url, cover_image_url
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
       ON CONFLICT (normalized_name) DO UPDATE SET
         type = EXCLUDED.type,
         industry = EXCLUDED.industry,
         location = EXCLUDED.location,
         employees = EXCLUDED.employees,
         founded = EXCLUDED.founded,
         website_url = EXCLUDED.website_url,
         tagline = EXCLUDED.tagline,
         about = EXCLUDED.about,
         mission = EXCLUDED.mission,
         tech_stack = EXCLUDED.tech_stack,
         departments = EXCLUDED.departments,
         hiring_domains = EXCLUDED.hiring_domains,
         benefits = EXCLUDED.benefits,
         culture = EXCLUDED.culture,
         logo_url = EXCLUDED.logo_url,
         cover_image_url = EXCLUDED.cover_image_url
       RETURNING id`,
      [
        row.name,
        row.normalizedName,
        row.type,
        row.industry,
        row.location,
        row.employees,
        row.founded,
        row.websiteUrl,
        row.tagline,
        row.about,
        row.mission,
        row.techStack,
        row.departments,
        row.hiringDomains,
        row.benefits,
        row.culture,
        row.logoUrl,
        row.coverImageUrl,
      ],
    );

    const id = result.rows[0]?.id;

    if (id) {
      idsByNormalizedName.set(row.normalizedName, id);
    }
  }

  stats.companies = rows.length;
  return idsByNormalizedName;
}

function deduplicateCatalog(catalog: SkillItem[]): SkillItem[] {
  const bySlug = new Set<string>();
  const byName = new Set<string>();
  const unique: SkillItem[] = [];

  for (const skill of catalog) {
    const nameKey = normalizeName(skill.name);

    if (bySlug.has(skill.id) || byName.has(nameKey)) {
      continue;
    }

    bySlug.add(skill.id);
    byName.add(nameKey);
    unique.push(skill);
  }

  return unique;
}

async function upsertSkills(
  client: Client,
  stats: SeedStats,
): Promise<Map<string, { id: string; slug: string }>> {
  const catalog = deduplicateCatalog(getAllCatalogSkills());
  const bySlug = new Map<string, { id: string; slug: string }>();
  const byName = new Map<string, { id: string; slug: string }>();

  for (const skill of catalog) {
    const result = await client.query<{ id: string }>(
      `INSERT INTO skills (
         slug, name, tier, category, icon, description, estimated_time,
         learning_objectives, career_roles, aliases, related_skills,
         related_opportunity_count
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       ON CONFLICT (slug) DO UPDATE SET
         name = EXCLUDED.name,
         tier = EXCLUDED.tier,
         category = EXCLUDED.category,
         icon = EXCLUDED.icon,
         description = EXCLUDED.description,
         estimated_time = EXCLUDED.estimated_time,
         learning_objectives = EXCLUDED.learning_objectives,
         career_roles = EXCLUDED.career_roles,
         aliases = EXCLUDED.aliases,
         related_skills = EXCLUDED.related_skills,
         related_opportunity_count = EXCLUDED.related_opportunity_count
       RETURNING id`,
      [
        skill.id,
        skill.name,
        tierFromCatalogue(skill.tier),
        skill.category ?? null,
        skill.icon ?? null,
        skill.description ?? null,
        skill.estimatedTime ?? null,
        skill.learningObjectives ?? [],
        skill.careerRoles ?? [],
        skill.aliases ?? [],
        skill.relatedSkills ?? [],
        skill.relatedOpportunityCount ?? 0,
      ],
    );

    const id = result.rows[0]?.id;

    if (id) {
      bySlug.set(skill.id, { id, slug: skill.id });
      byName.set(normalizeName(skill.name), { id, slug: skill.id });
    }
  }

  stats.skills = catalog.length;
  return bySlug;
}

async function seedLearning(
  client: Client,
  stats: SeedStats,
  bySlug: Map<string, { id: string; slug: string }>,
): Promise<void> {
  const catalog = deduplicateCatalog(getAllCatalogSkills());
  let resourceCount = 0;
  let courseCount = 0;
  let materialCount = 0;

  for (const skill of catalog) {
    const resolved = bySlug.get(skill.id);

    if (!resolved) {
      continue;
    }

    const resources = skill.resources ?? [];

    for (const [index, resource] of resources.entries()) {
      await client.query(
        `INSERT INTO skill_resources (skill_id, title, type, duration, url, topic, description, position)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
         ON CONFLICT (skill_id, position) DO UPDATE SET
           title = EXCLUDED.title,
           type = EXCLUDED.type,
           duration = EXCLUDED.duration,
           url = EXCLUDED.url,
           topic = EXCLUDED.topic,
           description = EXCLUDED.description`,
        [
          resolved.id,
          resource.title,
          toEnum(RESOURCE_TYPES, resource.type, `learning resource type for ${skill.name}`),
          resource.duration ?? null,
          resource.url ?? null,
          resource.topic ?? null,
          resource.description ?? null,
          index,
        ],
      );
      resourceCount += 1;
    }

    await client.query(
      `INSERT INTO courses (slug, skill_id, title, description, level, is_published)
       VALUES ($1,$2,$3,$4,$5,true)
       ON CONFLICT (slug) DO UPDATE SET
         skill_id = EXCLUDED.skill_id,
         title = EXCLUDED.title,
         description = EXCLUDED.description,
         level = EXCLUDED.level,
         is_published = EXCLUDED.is_published`,
      [
        skill.id,
        resolved.id,
        `${skill.name} — ${skill.tier}`,
        skill.description ?? null,
        tierFromCatalogue(skill.tier),
      ],
    );
    courseCount += 1;

    const course = await client.query<{ id: string }>(
      `SELECT id FROM courses WHERE slug = $1`,
      [skill.id],
    );
    const courseId = course.rows[0]?.id;

    if (!courseId) {
      continue;
    }

    for (const [index, resource] of resources.entries()) {
      await client.query(
        `INSERT INTO course_materials (course_id, title, type, position, url, duration, description, is_published)
         VALUES ($1,$2,$3,$4,$5,$6,$7,true)
         ON CONFLICT (course_id, position) DO UPDATE SET
           title = EXCLUDED.title,
           type = EXCLUDED.type,
           url = EXCLUDED.url,
           duration = EXCLUDED.duration,
           description = EXCLUDED.description,
           is_published = EXCLUDED.is_published`,
        [
          courseId,
          resource.title,
          toEnum(RESOURCE_TYPES, resource.type, `course material type for ${skill.name}`),
          index,
          resource.url ?? null,
          resource.duration ?? null,
          resource.description ?? null,
        ],
      );
      materialCount += 1;
    }
  }

  stats.skill_resources = resourceCount;
  stats.courses = courseCount;
  stats.course_materials = materialCount;
}

async function resolveSkillId(
  byName: Map<string, { id: string }>,
  name: string,
): Promise<string | null> {
  return byName.get(normalizeName(name))?.id ?? null;
}

async function seedJobs(
  client: Client,
  stats: SeedStats,
  companyIds: Map<string, string>,
  skillIdsByName: Map<string, { id: string }>,
): Promise<void> {
  let jobCount = 0;
  let requirementCount = 0;

  for (const job of mockJobs) {
    const companyId = companyIds.get(normalizeName(job.company));

    if (!companyId) {
      logger.warn({ job: job.id }, 'db:seed: skipping job with no resolvable company');
      continue;
    }

    const result = await client.query<{ id: string }>(
      `INSERT INTO jobs (
         slug, company_id, title, department, location, work_mode, employment_type,
         salary_range, experience_required, education_required, graduation_year,
         minimum_cgpa, description, responsibilities, qualifications, openings,
         deadline, status, posted_at
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
       ON CONFLICT (slug) DO UPDATE SET
         company_id = EXCLUDED.company_id,
         title = EXCLUDED.title,
         department = EXCLUDED.department,
         location = EXCLUDED.location,
         work_mode = EXCLUDED.work_mode,
         employment_type = EXCLUDED.employment_type,
         salary_range = EXCLUDED.salary_range,
         experience_required = EXCLUDED.experience_required,
         education_required = EXCLUDED.education_required,
         graduation_year = EXCLUDED.graduation_year,
         minimum_cgpa = EXCLUDED.minimum_cgpa,
         description = EXCLUDED.description,
         responsibilities = EXCLUDED.responsibilities,
         qualifications = EXCLUDED.qualifications,
         openings = EXCLUDED.openings,
         deadline = EXCLUDED.deadline,
         status = EXCLUDED.status,
         posted_at = EXCLUDED.posted_at
       RETURNING id`,
      [
        job.id,
        companyId,
        job.title,
        job.department || null,
        job.location || null,
        mapWorkMode(job.workMode),
        toEnum(EMPLOYMENT_TYPES, job.jobType, `job type for ${job.id}`),
        job.salaryRange || null,
        job.experienceRequired || null,
        job.education || null,
        job.graduationYear || null,
        parseNumber(job.minimumCgpa),
        job.description || null,
        job.responsibilities ?? [],
        job.qualifications ?? [],
        job.openings ?? 1,
        parseSeedDate(job.deadline),
        mapOpportunityStatus(job.status),
        job.postedDate ? parseSeedDate(job.postedDate) : null,
      ],
    );

    const jobId = result.rows[0]?.id;

    if (!jobId) {
      continue;
    }

    jobCount += 1;

    for (const required of job.requiredSkills ?? []) {
      const skillId = await resolveSkillId(skillIdsByName, required.name);

      if (!skillId) {
        continue;
      }

      const inserted = await client.query(
        `INSERT INTO job_required_skills (job_id, skill_id, level, importance, min_score)
         VALUES ($1,$2,$3,$4,$5)
         ON CONFLICT (job_id, skill_id) DO UPDATE SET
           level = EXCLUDED.level,
           importance = EXCLUDED.importance,
           min_score = EXCLUDED.min_score`,
        [
          jobId,
          skillId,
          tierFromCatalogue(required.level),
          toEnum(SKILL_IMPORTANCES, required.importance, `skill importance for ${job.id}`),
          parseNumber(required.minScore),
        ],
      );

      requirementCount += inserted.rowCount ?? 0;
    }
  }

  stats.jobs = jobCount;
  stats.job_required_skills = requirementCount;
}

async function seedInternships(
  client: Client,
  stats: SeedStats,
  companyIds: Map<string, string>,
  skillIdsByName: Map<string, { id: string }>,
): Promise<void> {
  let internshipCount = 0;
  let requirementCount = 0;

  for (const internship of mockInternships) {
    const companyId = companyIds.get(normalizeName(internship.company));

    if (!companyId) {
      logger.warn({ internship: internship.id }, 'db:seed: skipping internship with no resolvable company');
      continue;
    }

    const result = await client.query<{ id: string }>(
      `INSERT INTO internships (
         slug, company_id, title, department, location, work_mode, duration, stipend,
         eligibility, start_date, application_deadline, description, learning_outcomes,
         mentor, target_audience, openings, is_startup_friendly,
         eligible_for_conversion, status, posted_at
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
       ON CONFLICT (slug) DO UPDATE SET
         company_id = EXCLUDED.company_id,
         title = EXCLUDED.title,
         department = EXCLUDED.department,
         location = EXCLUDED.location,
         work_mode = EXCLUDED.work_mode,
         duration = EXCLUDED.duration,
         stipend = EXCLUDED.stipend,
         eligibility = EXCLUDED.eligibility,
         start_date = EXCLUDED.start_date,
         application_deadline = EXCLUDED.application_deadline,
         description = EXCLUDED.description,
         learning_outcomes = EXCLUDED.learning_outcomes,
         mentor = EXCLUDED.mentor,
         target_audience = EXCLUDED.target_audience,
         openings = EXCLUDED.openings,
         is_startup_friendly = EXCLUDED.is_startup_friendly,
         eligible_for_conversion = EXCLUDED.eligible_for_conversion,
         status = EXCLUDED.status,
         posted_at = EXCLUDED.posted_at
       RETURNING id`,
      [
        internship.id,
        companyId,
        internship.title,
        internship.department || null,
        internship.location || null,
        mapWorkMode(internship.workMode),
        internship.duration || null,
        internship.stipend || null,
        internship.eligibility || null,
        parseSeedDate(internship.startDate),
        parseSeedDate(internship.applicationDeadline),
        internship.description || null,
        internship.learningOutcomes ?? [],
        internship.mentor || null,
        internship.targetAudience || null,
        internship.openings ?? 1,
        internship.isStartupFriendly ?? false,
        internship.eligibleForConversion ?? false,
        mapOpportunityStatus(internship.status),
        internship.postedDate ? parseSeedDate(internship.postedDate) : null,
      ],
    );

    const internshipId = result.rows[0]?.id;

    if (!internshipId) {
      continue;
    }

    internshipCount += 1;

    for (const required of internship.requiredSkills ?? []) {
      const skillId = await resolveSkillId(skillIdsByName, required.name);

      if (!skillId) {
        continue;
      }

      const inserted = await client.query(
        `INSERT INTO internship_required_skills (internship_id, skill_id, level, importance, min_score)
         VALUES ($1,$2,$3,$4,$5)
         ON CONFLICT (internship_id, skill_id) DO UPDATE SET
           level = EXCLUDED.level,
           importance = EXCLUDED.importance,
           min_score = EXCLUDED.min_score`,
        [
          internshipId,
          skillId,
          tierFromCatalogue(required.level),
          toEnum(SKILL_IMPORTANCES, required.importance, `skill importance for ${internship.id}`),
          parseNumber(required.minScore),
        ],
      );

      requirementCount += inserted.rowCount ?? 0;
    }
  }

  stats.internships = internshipCount;
  stats.internship_required_skills = requirementCount;
}

async function seedChallenges(client: Client, stats: SeedStats): Promise<void> {
  let count = 0;

  for (const challenge of mockChallenges) {
    await client.query(
      `INSERT INTO challenges (
         slug, title, description, problem_statement, difficulty, status, deadline,
         team_size, prize, submission_requirements, college_participation,
         participants_count, submissions_count, required_skills
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
       ON CONFLICT (slug) DO UPDATE SET
         title = EXCLUDED.title,
         description = EXCLUDED.description,
         problem_statement = EXCLUDED.problem_statement,
         difficulty = EXCLUDED.difficulty,
         status = EXCLUDED.status,
         deadline = EXCLUDED.deadline,
         team_size = EXCLUDED.team_size,
         prize = EXCLUDED.prize,
         submission_requirements = EXCLUDED.submission_requirements,
         college_participation = EXCLUDED.college_participation,
         participants_count = EXCLUDED.participants_count,
         submissions_count = EXCLUDED.submissions_count,
         required_skills = EXCLUDED.required_skills`,
      [
        challenge.id,
        challenge.title,
        challenge.description || null,
        challenge.problemStatement || null,
        tierFromCatalogue(challenge.difficulty),
        toEnum(CHALLENGE_STATUSES, challenge.status, `challenge status for ${challenge.id}`),
        parseSeedDate(challenge.deadline),
        challenge.teamSize || null,
        challenge.prize || null,
        challenge.submissionRequirements || null,
        challenge.collegeParticipation || null,
        challenge.participantsCount ?? 0,
        challenge.submissionsCount ?? 0,
        challenge.requiredSkills ?? [],
      ],
    );

    count += 1;
  }

  stats.challenges = count;
}

/**
 * College names differ across the three catalogues that have to agree:
 *   collegesData.ts   "R.V. College of Engineering"
 *   industryMous.ts   "RV College of Engineering, Bengaluru"
 *   industryColleges.ts "RV College of Engineering (RVCE)"
 * so a single exact match silently drops MoUs and partnerships. Each variant
 * below is tried in turn before giving up.
 */
function collegeLookupKeys(value: string): string[] {
  const keys = new Set<string>();
  const withoutParenthetical = value.replace(/\s*\([^)]*\)\s*$/, '').trim();

  for (const variant of [
    value,
    withoutParenthetical,
    withoutParenthetical.replace(/,\s*[^,]+$/, ''),
  ]) {
    const normalized = normalizeName(variant);

    if (normalized) {
      keys.add(normalized);
    }
  }

  return [...keys];
}

function resolveCollegeId(
  collegeIds: Map<string, string>,
  ...candidates: (string | null | undefined)[]
): string | null {
  for (const candidate of candidates) {
    if (!candidate) {
      continue;
    }

    for (const key of collegeLookupKeys(candidate)) {
      const id = collegeIds.get(key);

      if (id) {
        return id;
      }
    }
  }

  return null;
}

async function seedCollegePortal(
  client: Client,
  stats: SeedStats,
  collegeIds: Map<string, string>,
  companyIds: Map<string, string>,
): Promise<void> {
  const primaryCompanyId = companyIds.get(normalizeName(defaultCompanyProfile.name)) ?? null;
  let partnershipCount = 0;
  let moduleCount = 0;

  for (const partner of mockColleges) {
    const collegeId = resolveCollegeId(collegeIds, partner.name);

    if (!collegeId || !primaryCompanyId) {
      continue;
    }

    await client.query(
      `INSERT INTO college_company (
         college_id, company_id, partnership_status, contact_person, contact_email,
         internship_opportunities_count, students_hired_count, challenges_active_count
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       ON CONFLICT (college_id, company_id) DO UPDATE SET
         partnership_status = EXCLUDED.partnership_status,
         contact_person = EXCLUDED.contact_person,
         contact_email = EXCLUDED.contact_email,
         internship_opportunities_count = EXCLUDED.internship_opportunities_count,
         students_hired_count = EXCLUDED.students_hired_count,
         challenges_active_count = EXCLUDED.challenges_active_count`,
      [
        collegeId,
        primaryCompanyId,
        toEnum(
          PARTNERSHIP_STATUSES,
          partner.partnershipStatus,
          `partnership status for ${partner.id}`,
        ),
        partner.contactPerson || null,
        partner.contactEmail || null,
        partner.internshipsOffered ?? 0,
        partner.studentsHired ?? 0,
        partner.industryChallengesActive ?? 0,
      ],
    );

    partnershipCount += 1;
  }

  for (const mou of mockCollegeMous) {
    if (!primaryCompanyId) {
      break;
    }

    const collegeId = resolveCollegeId(collegeIds, mou.collegeName, mou.collegeId);

    if (!collegeId) {
      logger.warn({ mou: mou.id }, 'db:seed: skipping MoU with no resolvable college');
      continue;
    }

    const mouStatusValue = toEnum(MOU_STATUSES, mou.status, `MoU status for ${mou.id}`);

    await client.query(
      `INSERT INTO college_company (
         college_id, company_id, partnership_status, is_mou, mou_status, contact_person,
         effective_from, key_initiatives, internship_commitment_count,
         joint_hackathons_count, curriculum_reviews_completed
       ) VALUES ($1,$2,$3,true,$4,$5,$6,$7,$8,$9,$10)
       ON CONFLICT (college_id, company_id) DO UPDATE SET
         partnership_status = EXCLUDED.partnership_status,
         is_mou = true,
         mou_status = EXCLUDED.mou_status,
         contact_person = EXCLUDED.contact_person,
         effective_from = EXCLUDED.effective_from,
         key_initiatives = EXCLUDED.key_initiatives,
         internship_commitment_count = EXCLUDED.internship_commitment_count,
         joint_hackathons_count = EXCLUDED.joint_hackathons_count,
         curriculum_reviews_completed = EXCLUDED.curriculum_reviews_completed`,
      [
        collegeId,
        primaryCompanyId,
        // An MoU carries its own lifecycle; partnership_status is derived from it
        // rather than reusing the MoU value verbatim.
        mouStatusValue === 'active' || mouStatusValue === 'renewed' ? 'active' : 'pending',
        mouStatusValue,
        mou.collegeContact || null,
        parseSeedDate(mou.effectiveFrom),
        mou.keyInitiatives ?? [],
        mou.internshipCommitmentCount ?? 0,
        mou.jointHackathonsCount ?? 0,
        mou.curriculumReviewsCompleted ?? 0,
      ],
    );

    partnershipCount += 1;

    for (const [index, module] of (mou.suggestedCurriculumModules ?? []).entries()) {
      await client.query(
        `INSERT INTO curriculum_modules (
           slug, college_id, company_id, semester, current_subject,
           industry_recommendation, recommended_technologies, rationale, status
         ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
         ON CONFLICT (slug) DO UPDATE SET
           college_id = EXCLUDED.college_id,
           company_id = EXCLUDED.company_id,
           semester = EXCLUDED.semester,
           current_subject = EXCLUDED.current_subject,
           industry_recommendation = EXCLUDED.industry_recommendation,
           recommended_technologies = EXCLUDED.recommended_technologies,
           rationale = EXCLUDED.rationale,
           status = EXCLUDED.status`,
        [
          `${mou.id}-module-${index + 1}`,
          collegeId,
          primaryCompanyId,
          module.semester || null,
          module.currentSubject || null,
          module.industryRecommendation || null,
          module.recommendedTechnologies ?? [],
          module.rationale || null,
          toEnum(
            CURRICULUM_STATUSES,
            module.status,
            `curriculum module status for ${module.id}`,
          ),
        ],
      );

      moduleCount += 1;
    }
  }

  const collegeId = collegeIds.get(normalizeName(INITIAL_COLLEGE_PROFILE.institutionName));

  if (collegeId) {
    for (const program of INITIAL_TRAINING_PROGRAMS) {
      await client.query(
        `INSERT INTO training_programs (
           slug, college_id, name, skill_name, skill_level, description, instructor,
           start_date, end_date, max_students, assessment_required, industry_partner,
           learning_resources, status
         ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
         ON CONFLICT (slug) DO UPDATE SET
           college_id = EXCLUDED.college_id,
           name = EXCLUDED.name,
           skill_name = EXCLUDED.skill_name,
           skill_level = EXCLUDED.skill_level,
           description = EXCLUDED.description,
           instructor = EXCLUDED.instructor,
           start_date = EXCLUDED.start_date,
           end_date = EXCLUDED.end_date,
           max_students = EXCLUDED.max_students,
           assessment_required = EXCLUDED.assessment_required,
           industry_partner = EXCLUDED.industry_partner,
           learning_resources = EXCLUDED.learning_resources,
           status = EXCLUDED.status`,
        [
          program.id,
          collegeId,
          program.name,
          program.skill || null,
          tierFromCatalogue(program.skillLevel),
          program.description || null,
          program.instructor || null,
          parseSeedDate(program.startDate),
          parseSeedDate(program.endDate),
          program.maxStudents ?? null,
          program.assessmentRequired ?? false,
          program.industryPartner || null,
          program.learningResources ?? [],
          toEnum(TRAINING_STATUSES, program.status, `training status for ${program.id}`),
        ],
      );

      stats.training_programs = (stats.training_programs ?? 0) + 1;
    }

    for (const announcement of INITIAL_ANNOUNCEMENTS) {
      await client.query(
        `INSERT INTO campus_announcements (
           slug, college_id, title, category, content, target_audience, status,
           important, published_at
         ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
         ON CONFLICT (slug) DO UPDATE SET
           college_id = EXCLUDED.college_id,
           title = EXCLUDED.title,
           category = EXCLUDED.category,
           content = EXCLUDED.content,
           target_audience = EXCLUDED.target_audience,
           status = EXCLUDED.status,
           important = EXCLUDED.important,
           published_at = EXCLUDED.published_at`,
        [
          announcement.id,
          collegeId,
          announcement.title,
          slugify(announcement.category),
          announcement.content || null,
          announcement.targetAudience || null,
          toEnum(ANNOUNCEMENT_STATUSES, announcement.status, `announcement status for ${announcement.id}`),
          announcement.important ?? false,
          announcement.status === 'Published' ? new Date() : null,
        ],
      );

      stats.campus_announcements = (stats.campus_announcements ?? 0) + 1;
    }
  }

  for (const drive of MOCK_PLACEMENT_DRIVES) {
    await client.query(
      `INSERT INTO placement_drives (
         slug, college_id, company_id, title, drive_date, eligible_departments,
         minimum_cgpa, skills_required, package_offer, openings, status
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       ON CONFLICT (slug) DO UPDATE SET
         college_id = EXCLUDED.college_id,
         company_id = EXCLUDED.company_id,
         title = EXCLUDED.title,
         drive_date = EXCLUDED.drive_date,
         eligible_departments = EXCLUDED.eligible_departments,
         minimum_cgpa = EXCLUDED.minimum_cgpa,
         skills_required = EXCLUDED.skills_required,
         package_offer = EXCLUDED.package_offer,
         openings = EXCLUDED.openings,
         status = EXCLUDED.status`,
      [
        drive.id,
        collegeId,
        primaryCompanyId,
        `${drive.company} — ${drive.role}`,
        parseSeedDate(drive.date),
        drive.eligibleDepts ?? [],
        parseNumber(drive.minCgpa),
        drive.skillsRequired ?? [],
        drive.packageOffer || null,
        drive.eligibleCount ?? null,
        toEnum(PLACEMENT_DRIVE_STATUSES, drive.status, `placement drive status for ${drive.id}`),
      ],
    );

    stats.placement_drives = (stats.placement_drives ?? 0) + 1;
  }

  stats.college_company = partnershipCount;
  stats.curriculum_modules = moduleCount;
}

const SEEDED_TABLES = [
  'colleges',
  'companies',
  'skills',
  'skill_resources',
  'courses',
  'course_materials',
  'jobs',
  'job_required_skills',
  'internships',
  'internship_required_skills',
  'challenges',
  'college_company',
  'curriculum_modules',
  'training_programs',
  'campus_announcements',
  'placement_drives',
] as const;

const USER_SCOPED_TABLES = [
  'users',
  'role_requests',
  'student_profiles',
  'education_records',
  'projects',
  'work_experiences',
  'certifications',
  'user_skills',
  'skill_resource_progress',
  'skill_assessment_attempts',
  'student_course_enrollments',
  'course_progress',
  'job_matches',
  'applications',
  'application_stage_history',
  'saved_jobs',
  'interviews',
  'offers',
  'training_enrollments',
  'notifications',
  'challenge_submissions',
];

/**
 * Reports the rows actually present rather than the number of upsert statements
 * issued. The two differ wherever an upsert merged onto an existing row, which is
 * exactly what a re-seed must be able to prove.
 */
async function readSeededRowCounts(client: Client): Promise<SeedStats> {
  const parts = SEEDED_TABLES.map(
    (table, index) => `SELECT ${index} AS idx, count(*)::int AS n FROM ${table}`,
  );
  const result = await client.query<{ idx: number; n: number }>(
    `SELECT * FROM (${parts.join(' UNION ALL ')}) AS counts`,
  );

  const counts: SeedStats = {};

  for (const row of result.rows) {
    const table = SEEDED_TABLES[row.idx];

    if (table) {
      counts[table] = row.n;
    }
  }

  return counts;
}

export async function runSeed(): Promise<SeedResult> {
  const env = loadDatabaseEnv();
  let stats: SeedStats = {};
  const client = new Client({ connectionString: env.databaseUrl });

  await client.connect();

  try {
    await client.query('BEGIN');

    const collegeIds = await upsertColleges(client, stats);
    const companyIds = await upsertCompanies(client, stats);
    const skillsBySlug = await upsertSkills(client, stats);
    const skillsByName = new Map<string, { id: string }>();

    for (const value of skillsBySlug.values()) {
      skillsByName.set(normalizeName(value.slug), value);
    }

    const nameLookup = await client.query<{ id: string; name: string }>(
      `SELECT id, name FROM skills`,
    );

    for (const row of nameLookup.rows) {
      if (!skillsByName.has(normalizeName(row.name))) {
        skillsByName.set(normalizeName(row.name), { id: row.id });
      }
    }

    await seedLearning(client, stats, skillsBySlug);
    await seedJobs(client, stats, companyIds, skillsByName);
    await seedInternships(client, stats, companyIds, skillsByName);
    await seedChallenges(client, stats);
    await seedCollegePortal(client, stats, collegeIds, companyIds);

    await client.query('COMMIT');

    const rowCounts = await readSeededRowCounts(client);
    stats = { ...stats, ...rowCounts };
  } catch (error) {
    await client.query('ROLLBACK').catch(() => undefined);
    throw error;
  } finally {
    await client.end().catch(() => undefined);
  }

  const totalRows = Object.values(stats).reduce((sum, value) => sum + value, 0);

  logger.info(
    { target: redactTarget(env.databaseUrl), tableCounts: stats, totalRows },
    'db:seed: complete',
  );

  return { tableCounts: stats, totalRows, skippedUserScoped: USER_SCOPED_TABLES };
}

if (require.main === module) {
  runSeed()
    .then((result) => {
      logger.info(
        { userScopedTablesOwnedByAuthSeedDev: result.skippedUserScoped.length },
        'db:seed: user-scoped tables intentionally left to auth:seed:dev',
      );
      process.exit(0);
    })
    .catch((error: unknown) => {
      logger.error({ err: error }, 'db:seed: failed');
      process.exit(1);
    });
}
