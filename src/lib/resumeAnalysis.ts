import { getCanonicalSkillName } from './skillNormalization';

export interface ResumeDetail {
  value: string;
  evidence: string;
}

export interface ResumeCandidateSkill extends ResumeDetail {
  canonicalName: string;
  source: 'Skill' | 'Technology';
}

export interface ResumeAnalysis {
  name: string;
  email: string;
  phone: string;
  summary: string;
  education: ResumeDetail[];
  experience: ResumeDetail[];
  projects: ResumeDetail[];
  certifications: ResumeDetail[];
  technologies: ResumeDetail[];
  skills: ResumeDetail[];
  candidateSkills: ResumeCandidateSkill[];
  jobInterests: ResumeDetail[];
  suggestions: string[];
  atsScore: number;
  atsBreakdown: { label: string; score: number; max: number }[];
  jobMatch: { score: number; matchedSkills: string[]; missingSkills: string[] } | null;
}

const object = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};

const string = (value: unknown, max = 180): string =>
  typeof value === 'string' ? value.trim().slice(0, max) : '';

const details = (value: unknown, limit: number): ResumeDetail[] =>
  Array.isArray(value)
    ? value.map((item) => ({
        value: string(object(item).value),
        evidence: string(object(item).evidence),
      })).filter((item) => item.value && item.evidence).slice(0, limit)
    : [];

const uniqueSkills = <T extends ResumeDetail>(items: T[]): T[] => {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = getCanonicalSkillName(item.value);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export function buildResumeAnalysis(raw: unknown, hasJobDescription: boolean): ResumeAnalysis {
  const data = object(raw);
  const signals = object(data.signals);
  const name = string(data.name);
  const email = string(data.email);
  const phone = string(data.phone);
  const summary = string(data.summary, 500);
  const education = details(data.education, 6);
  const experience = details(data.experience, 8);
  const projects = details(data.projects, 8);
  const certifications = details(data.certifications, 10);
  const technologies = uniqueSkills(details(data.technologies, 25));
  const skills = uniqueSkills(details(data.skills, 30));
  const candidateSkills = uniqueSkills([
    ...skills.map((item) => ({ ...item, canonicalName: getCanonicalSkillName(item.value), source: 'Skill' as const })),
    ...technologies.map((item) => ({ ...item, canonicalName: getCanonicalSkillName(item.value), source: 'Technology' as const })),
  ]).slice(0, 40);
  const jobInterests = details(data.jobInterests, 5);

  if (!name && !email && !education.length && !experience.length && !projects.length && !certifications.length && !candidateSkills.length) {
    throw new Error('No readable resume details were found in this PDF.');
  }

  const atsBreakdown = [
    { label: 'Contact details', score: (email ? 10 : 0) + (phone ? 10 : 0), max: 20 },
    { label: 'Core content', score: (name ? 5 : 0) + (summary ? 5 : 0) + (education.length ? 10 : 0) + (candidateSkills.length ? 10 : 0) + (experience.length || projects.length ? 10 : 0), max: 40 },
    { label: 'Evidence of work', score: (signals.datedEntries === true ? 10 : 0) + (signals.quantifiedImpact === true ? 10 : 0), max: 20 },
    { label: 'Readable format', score: (signals.clearHeadings === true ? 10 : 0) + (signals.readableLayout === true ? 10 : 0), max: 20 },
  ];

  const requirements = uniqueSkills(
    (Array.isArray(data.jobRequirements) ? data.jobRequirements : [])
      .slice(0, 25)
      .map((value) => ({ value: string(value), evidence: 'Job description' }))
      .filter((item) => item.value)
  ).map((item) => item.value);
  const matchedSkills = requirements.filter((required) =>
    candidateSkills.some((skill) => skill.canonicalName === getCanonicalSkillName(required))
  );

  return {
    name,
    email,
    phone,
    summary,
    education,
    experience,
    projects,
    certifications,
    technologies,
    skills,
    candidateSkills,
    jobInterests,
    suggestions: Array.isArray(data.suggestions)
      ? data.suggestions.slice(0, 5).map((item) => string(item, 240)).filter(Boolean)
      : [],
    atsScore: atsBreakdown.reduce((total, item) => total + item.score, 0),
    atsBreakdown,
    jobMatch: hasJobDescription && requirements.length
      ? {
          score: Math.round(matchedSkills.length / requirements.length * 100),
          matchedSkills,
          missingSkills: requirements.filter((item) => !matchedSkills.includes(item)),
        }
      : null,
  };
}
