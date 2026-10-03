import type { Skill } from '@/types/student';
import { getCanonicalSkillName, matchSkillNames } from './skillNormalization';

export interface MappedResumeSkill {
  name: string;
  category: string;
  evidence: string;
  verified: boolean;
}

export interface TargetRole {
  name: string;
  coverage: number;
  matchedSkills: string[];
  missingSkills: string[];
}

const categoryGroups: Record<string, string> = {
  Programming: 'Programming',
  'Core Programming': 'Programming',
  Algorithms: 'Programming',
  'Web Development': 'Web & Software',
  'Frontend Frameworks': 'Web & Software',
  'Backend Development': 'Web & Software',
  'Backend Architecture': 'Web & Software',
  Databases: 'Data & AI',
  'Data Analytics': 'Data & AI',
  'Data Science': 'Data & AI',
  'Artificial Intelligence': 'Data & AI',
  'Cloud Computing': 'Cloud & DevOps',
  Infrastructure: 'Cloud & DevOps',
  'Dev Tools': 'Cloud & DevOps',
  'Enterprise ERP': 'Business Tools',
  Productivity: 'Business Tools',
  'Soft Skills': 'Professional Skills',
};

function categoryFor(skill: Skill, catalog: Skill[]): string {
  const known = catalog.find((item) => matchSkillNames(item.name, skill.name));
  if (known) return categoryGroups[known.category] || 'Other Technology';
  const name = getCanonicalSkillName(skill.name);
  if (/docker|kubernetes|cloud|terraform|git|linux|ci cd/.test(name)) return 'Cloud & DevOps';
  if (/sql|database|data|pandas|tensorflow|pytorch|machine learning/.test(name)) return 'Data & AI';
  if (/react|angular|vue|html|css|node|express|api/.test(name)) return 'Web & Software';
  if (/python|java|typescript|javascript|cplusplus|csharp|golang|rust/.test(name)) return 'Programming';
  return 'Other Technology';
}

export const isResumeSkill = (skill: Skill): boolean => Boolean(skill.resumeEvidence || skill.category === 'Resume');

export function replaceResumeSkills(skills: Skill[], accepted: { name: string; evidence: string; source: 'Skill' | 'Technology' }[]): Skill[] {
  const approved = new Map(accepted.map((item) => [getCanonicalSkillName(item.name), item]));
  const next = skills.filter((skill) =>
    !isResumeSkill(skill) || approved.has(getCanonicalSkillName(skill.name)) || skill.isVerified || (skill.resources?.length ?? 0) > 0
  ).map((skill) => {
    const found = approved.get(getCanonicalSkillName(skill.name));
    if (found) return { ...skill, resumeEvidence: found.evidence, resumeSource: found.source };
    if (!isResumeSkill(skill)) return skill;
    return { ...skill, category: skill.category === 'Resume' ? 'Technical' : skill.category, resumeEvidence: undefined, resumeSource: undefined };
  });
  for (const item of accepted) {
    if (next.some((skill) => getCanonicalSkillName(skill.name) === getCanonicalSkillName(item.name))) continue;
    next.push({
      id: `resume-${getCanonicalSkillName(item.name).replace(/\s+/g, '-')}`,
      name: item.name,
      tier: 'Basic',
      category: 'Resume',
      resumeEvidence: item.evidence,
      resumeSource: item.source,
      icon: '📄',
      level: 'Basic',
      progress: 0,
      isVerified: false,
      learningStatus: 'not_started',
      assessmentStatus: 'ready',
      description: 'Student-confirmed skill found in an uploaded resume.',
      estimatedTime: '',
      learningObjectives: [],
      resources: [],
      careerRoles: [],
      relatedOpportunityCount: 0,
    });
  }
  return next;
}

export function resumeOpportunityFit(requiredSkills: string[], resumeSkills: Pick<Skill, 'name'>[]) {
  const required = requiredSkills.filter((name, index) =>
    requiredSkills.findIndex((other) => getCanonicalSkillName(other) === getCanonicalSkillName(name)) === index
  );
  const matchedSkills = required.filter((name) => resumeSkills.some((skill) =>
    getCanonicalSkillName(skill.name) === getCanonicalSkillName(name)
  ));
  return {
    coverage: required.length ? Math.round(matchedSkills.length / required.length * 100) : 0,
    matchedSkills,
    missingSkills: required.filter((name) => !matchedSkills.includes(name)),
  };
}

export function mapResumeSkills(skills: Skill[], catalog: Skill[], careerGoal = '') {
  const resumeSkills = skills.filter(isResumeSkill);
  const activeSkills = skills.filter((skill) => skill.isVerified || isResumeSkill(skill));
  const mappedSkills: MappedResumeSkill[] = resumeSkills.map((skill) => ({
    name: skill.name,
    category: categoryFor(skill, catalog),
    evidence: skill.resumeEvidence || '',
    verified: skill.isVerified,
  }));

  const roleRequirements = new Map<string, string[]>();
  for (const skill of catalog) {
    for (const role of skill.careerRoles) {
      roleRequirements.set(role, [...(roleRequirements.get(role) || []), skill.name]);
    }
  }

  const goalWords = careerGoal.toLowerCase().split(/[^a-z]+/).filter((word) => word.length > 3 && !['developer', 'engineer', 'software', 'intern'].includes(word));
  const roles = Array.from(roleRequirements).filter(([, required]) => required.length >= 2).map(([name, required]) => {
    const fit = resumeOpportunityFit(required, activeSkills);
    return { name, ...fit, goalMatch: goalWords.some((word) => name.toLowerCase().includes(word)) };
  }).filter((role) => role.matchedSkills.length > 0 || role.goalMatch)
    .sort((a, b) => Number(b.matchedSkills.length > 0) - Number(a.matchedSkills.length > 0) ||
      Number(b.goalMatch) - Number(a.goalMatch) || b.coverage - a.coverage || b.matchedSkills.length - a.matchedSkills.length);

  const primary = roles[0];
  const recommendations = primary
    ? primary.missingSkills.slice(0, 3).map((name) => {
        const course = catalog.find((skill) => getCanonicalSkillName(skill.name) === getCanonicalSkillName(name));
        return { text: `Build ${name} for ${primary.name}.`, href: course ? `/student/skills/${course.id}` : '/student/opportunities' };
      })
    : [];
  if (primary && recommendations.length === 0) {
    const unverified = primary.matchedSkills.find((name) =>
      !activeSkills.some((skill) => skill.isVerified && getCanonicalSkillName(skill.name) === getCanonicalSkillName(name))
    );
    if (unverified) {
      const course = catalog.find((skill) => getCanonicalSkillName(skill.name) === getCanonicalSkillName(unverified));
      recommendations.push({ text: `Verify ${unverified} for ${primary.name}.`, href: course ? `/student/skills/${course.id}` : '/student/opportunities' });
    }
  }

  return {
    mappedSkills,
    verifiedStrengths: activeSkills.filter((skill) => skill.isVerified).map((skill) => skill.name),
    targetRoles: roles.slice(0, 3).map((role): TargetRole => ({
      name: role.name,
      coverage: role.coverage,
      matchedSkills: role.matchedSkills,
      missingSkills: role.missingSkills,
    })),
    recommendations,
  };
}
