/**
 * src/server/ai/skillMatchingService.ts
 * 
 * Professional, explainable AI Skill Matching Engine.
 * 
 * Computes multi-factor match scores between students and opportunities:
 * 1. Required vs Preferred Skills
 * 2. Verified vs Claimed Skills (AI assessment verification boost)
 * 3. Exact vs Synonym vs Related Skill Taxonomy Matching
 * 4. Practical Proof-of-Work / Project Tech Stack Relevance
 * 5. Role and Career Goal Alignment
 * 6. Clean, concise, user-facing explainable summaries.
 */

import { Opportunity, Skill, Project, StudentProfile, SkillMatchExplanation } from '@/types/student';
import { calculateSkillSimilarity } from './skillTaxonomy';

export interface DetailedMatchOutput {
  matchScore: number;
  matchedSkills: string[];
  verifiedMatchedSkills: string[];
  claimedMatchedSkills: string[];
  partialMatchedSkills: Array<{ skill: string; matchedWith: string }>;
  missingSkills: string[];
  isMatchBoosted: boolean;
  boostMessage?: string;
  explanation: SkillMatchExplanation;
}

export interface SkillMatchingWeights {
  requiredSkillWeight: number;
  preferredSkillWeight: number;
  verifiedSkillMultiplier: number;
  claimedSkillMultiplier: number;
  relatedSkillMultiplier: number;
  maxSkillBasePoints: number;
  maxProjectBonus: number;
  projectMatchPerSkill: number;
  maxRoleBonus: number;
  proximityBonus: number;
  maxScoreCeiling: number;
}

export const DEFAULT_MATCHING_WEIGHTS: SkillMatchingWeights = {
  requiredSkillWeight: 1.5,
  preferredSkillWeight: 0.75,
  verifiedSkillMultiplier: 1.0,
  claimedSkillMultiplier: 0.72,
  relatedSkillMultiplier: 0.5,
  maxSkillBasePoints: 82,
  maxProjectBonus: 10,
  projectMatchPerSkill: 2.5,
  maxRoleBonus: 5,
  proximityBonus: 5,
  maxScoreCeiling: 98,
};

export function matchStudentToOpportunity(
  opportunity: Opportunity,
  skills: Skill[],
  projects: Project[] = [],
  profile?: Partial<StudentProfile>,
  customWeights?: Partial<SkillMatchingWeights>
): DetailedMatchOutput {
  const weights: SkillMatchingWeights = { ...DEFAULT_MATCHING_WEIGHTS, ...customWeights };
  const required = opportunity.requiredSkills || [];
  const preferred = opportunity.preferredSkills || [];

  if (required.length === 0 && preferred.length === 0) {
    return {
      matchScore: 85,
      matchedSkills: [],
      verifiedMatchedSkills: [],
      claimedMatchedSkills: [],
      partialMatchedSkills: [],
      missingSkills: [],
      isMatchBoosted: false,
      explanation: {
        matchScore: 85,
        summary: 'General opportunity open to engineering students across all disciplines.',
        matchedSkills: [],
        partialSkills: [],
        missingSkills: [],
        isMatchBoosted: false,
      },
    };
  }

  // Build lookup index of student skills
  const studentSkillList = skills.filter(
    (s) => s.progress > 0 || s.isVerified || Boolean(s.resumeEvidence)
  );

  const matchedSkills: string[] = [];
  const verifiedMatchedSkills: string[] = [];
  const claimedMatchedSkills: string[] = [];
  const partialMatchedSkills: Array<{ skill: string; matchedWith: string }> = [];
  const missingSkills: string[] = [];

  let totalWeightedTarget = 0;
  let earnedSkillPoints = 0;
  let verifiedBoostCount = 0;
  const verifiedBoostSkills: string[] = [];

  // 1. Process Required Skills
  required.forEach((reqSkill) => {
    const weight = weights.requiredSkillWeight;
    totalWeightedTarget += weight;

    // Search for best matching student skill
    let bestMatch: {
      studentSkill?: Skill;
      score: number;
      relation: 'exact' | 'synonym' | 'related' | 'none';
    } = { score: 0, relation: 'none' };

    for (const s of studentSkillList) {
      const sim = calculateSkillSimilarity(s.name, reqSkill);
      if (sim.score > bestMatch.score) {
        bestMatch = { studentSkill: s, score: sim.score, relation: sim.relation };
      }
    }

    if (bestMatch.studentSkill && (bestMatch.relation === 'exact' || bestMatch.relation === 'synonym')) {
      matchedSkills.push(reqSkill);

      const isVerified = Boolean(bestMatch.studentSkill.isVerified);
      // Verified skills earn 100% of the match factor; claimed earn configured multiplier (e.g. 72%)
      const verificationMultiplier = isVerified ? weights.verifiedSkillMultiplier : weights.claimedSkillMultiplier;
      const itemScore = bestMatch.score * verificationMultiplier;
      earnedSkillPoints += weight * itemScore;

      if (isVerified) {
        verifiedMatchedSkills.push(reqSkill);
        verifiedBoostCount++;
        verifiedBoostSkills.push(reqSkill);
      } else {
        claimedMatchedSkills.push(reqSkill);
      }

      if (bestMatch.relation === 'synonym') {
        partialMatchedSkills.push({
          skill: reqSkill,
          matchedWith: bestMatch.studentSkill.name,
        });
      }
    } else if (bestMatch.studentSkill && bestMatch.relation === 'related' && bestMatch.score >= 0.5) {
      // Related skill partial match (e.g. knows Python when role asks for Machine Learning)
      partialMatchedSkills.push({
        skill: reqSkill,
        matchedWith: bestMatch.studentSkill.name,
      });
      const isVerified = Boolean(bestMatch.studentSkill.isVerified);
      const partialCredit = (isVerified ? weights.relatedSkillMultiplier * 1.1 : weights.relatedSkillMultiplier * 0.8) * weight;
      earnedSkillPoints += partialCredit;
      missingSkills.push(reqSkill);
    } else {
      missingSkills.push(reqSkill);
    }
  });

  // 2. Process Preferred Skills
  preferred.forEach((prefSkill) => {
    const weight = weights.preferredSkillWeight;
    totalWeightedTarget += weight;

    let bestMatch: {
      studentSkill?: Skill;
      score: number;
      relation?: 'exact' | 'synonym' | 'related' | 'none';
    } = { score: 0 };

    for (const s of studentSkillList) {
      const sim = calculateSkillSimilarity(s.name, prefSkill);
      if (sim.score > bestMatch.score) {
        bestMatch = { studentSkill: s, score: sim.score, relation: sim.relation };
      }
    }

    if (bestMatch.studentSkill && (bestMatch.relation === 'exact' || bestMatch.relation === 'synonym')) {
      const isVerified = Boolean(bestMatch.studentSkill.isVerified);
      const verificationMultiplier = isVerified ? weights.verifiedSkillMultiplier : weights.claimedSkillMultiplier;
      earnedSkillPoints += weight * bestMatch.score * verificationMultiplier;
      if (!matchedSkills.includes(prefSkill)) {
        matchedSkills.push(prefSkill);
        if (isVerified) {
          verifiedMatchedSkills.push(prefSkill);
        } else {
          claimedMatchedSkills.push(prefSkill);
        }
      }
    } else if (bestMatch.studentSkill && bestMatch.relation === 'related') {
      const isVerified = Boolean(bestMatch.studentSkill.isVerified);
      earnedSkillPoints += weight * weights.relatedSkillMultiplier * (isVerified ? 1.0 : weights.claimedSkillMultiplier);
    }
  });

  // Base raw ratio from skill inventory (0 to 1)
  const skillRatio = totalWeightedTarget > 0 ? earnedSkillPoints / totalWeightedTarget : 0;
  let rawScore = Math.round(skillRatio * weights.maxSkillBasePoints); // up to maxSkillBasePoints from skills

  // 3. Project Relevance Bonus (up to maxProjectBonus)
  let projectBonus = 0;
  const projectRelevanceNotes: string[] = [];

  if (projects.length > 0) {
    const projectTechs = projects.flatMap((p) => p.techStack || []);
    const projectTexts = projects.map((p) => `${p.title} ${p.description}`.toLowerCase()).join(' ');

    required.forEach((req) => {
      const reqLower = req.toLowerCase();
      const inTech = projectTechs.some((t) => t.toLowerCase().includes(reqLower) || reqLower.includes(t.toLowerCase()));
      const inText = projectTexts.includes(reqLower);

      if (inTech || inText) {
        projectBonus += weights.projectMatchPerSkill;
        if (!projectRelevanceNotes.includes(req)) {
          projectRelevanceNotes.push(req);
        }
      }
    });

    projectBonus = Math.min(weights.maxProjectBonus, Math.round(projectBonus));
  }

  // 4. Role & Career Goal Alignment Bonus (up to maxRoleBonus)
  let roleBonus = 0;
  if (profile?.careerGoal) {
    const goal = (profile.careerGoal || '').toLowerCase();
    const title = (opportunity.title || '').toLowerCase();
    const desc = (opportunity.description || '').toLowerCase();

    if (
      title.includes('analyst') && goal.includes('data') ||
      title.includes('software') && goal.includes('software') ||
      title.includes('machine learning') && goal.includes('ai') ||
      title.includes('product') && goal.includes('product') ||
      desc.includes(goal)
    ) {
      roleBonus = weights.maxRoleBonus;
    } else {
      roleBonus = Math.round(weights.maxRoleBonus * 0.4);
    }
  }

  // 5. Proximity / Baseline Points (only awarded if student has relevant skills or projects)
  let baseBonus = 0;
  const hasSkillOrProjectRelevance = matchedSkills.length > 0 || projectBonus > 0;
  if (hasSkillOrProjectRelevance) {
    if (opportunity.workMode === 'Remote' || (opportunity.distanceKm && opportunity.distanceKm <= 15)) {
      baseBonus = weights.proximityBonus;
    } else {
      baseBonus = Math.round(weights.proximityBonus * 0.6);
    }
  }

  let finalScore = rawScore + projectBonus + roleBonus + baseBonus;

  // Realistic boundary clamping: allow true 0% when no skills/projects overlap
  const minFloor = hasSkillOrProjectRelevance ? 20 : 0;
  finalScore = Math.max(minFloor, Math.min(weights.maxScoreCeiling, finalScore));

  const isMatchBoosted = verifiedBoostCount > 0;
  const boostMessage = isMatchBoosted
    ? `Your verified ${verifiedBoostSkills.slice(0, 2).join(' & ')} skill${verifiedBoostSkills.length > 1 ? 's' : ''} boosted this match score.`
    : undefined;

  // Concise explainable summary
  let summary = '';
  if (finalScore >= 85) {
    if (verifiedMatchedSkills.length > 0) {
      summary = `Strong match because you have verified proficiency in ${verifiedMatchedSkills.slice(0, 2).join(' and ')}${
        projectRelevanceNotes.length > 0 ? ` and demonstrated hands-on project experience in ${projectRelevanceNotes[0]}` : ''
      }.`;
    } else {
      summary = `Strong match across key requirements including ${matchedSkills.slice(0, 2).join(' and ')}. Verify these skills to boost your recruiter ranking.`;
    }
  } else if (finalScore >= 65) {
    summary = `Good alignment with core requirements (${matchedSkills.slice(0, 3).join(', ')}). ${
      missingSkills.length > 0 ? `Acquiring or verifying ${missingSkills[0]} will enhance your match.` : ''
    }`;
  } else if (finalScore > 0 && matchedSkills.length > 0) {
    summary = `Partial match. You have foundational skills in ${matchedSkills.join(', ')}, but this role emphasizes ${missingSkills.slice(0, 2).join(' and ')}.`;
  } else {
    summary = `No direct skill overlap found for this role (${missingSkills.slice(0, 3).join(', ')}). Add or verify relevant skills to qualify.`;
  }

  const explanation: SkillMatchExplanation = {
    matchScore: finalScore,
    summary,
    matchedSkills: matchedSkills.map((name) => ({
      name,
      verified: verifiedMatchedSkills.includes(name),
      matchedVia: partialMatchedSkills.some((p) => p.skill === name) ? 'synonym' : 'exact',
    })),
    partialSkills: partialMatchedSkills.map((p) => ({
      name: p.skill,
      reason: `Matched via related skill: ${p.matchedWith}`,
    })),
    missingSkills: missingSkills.map((name) => ({
      name,
      importance: 'required',
    })),
    projectRelevance: projectRelevanceNotes,
    isMatchBoosted,
    boostMessage,
  };

  return {
    matchScore: finalScore,
    matchedSkills,
    verifiedMatchedSkills,
    claimedMatchedSkills,
    partialMatchedSkills,
    missingSkills,
    isMatchBoosted,
    boostMessage,
    explanation,
  };
}
