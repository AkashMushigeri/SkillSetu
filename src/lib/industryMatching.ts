import { Candidate, RequiredSkill, MatchQuality } from '@/types/industry';
import { getQualityTier, matchSkillNames } from './skillNormalization';

export interface MatchResult {
  overall: number; // 0 - 100
  quality: MatchQuality;
  skillMatch: number; // out of 60
  verifiedBonus: number; // out of 15
  projectsMatch: number; // out of 10
  experienceMatch: number; // out of 5
  educationMatch: number; // out of 5
  locationMatch: number; // out of 5
  recommendedSkills: RequiredSkill[]; // gap analysis: required skills candidate lacks or is below level
  details: {
    skill: string;
    score: number;
    candidateLevel: string;
    requiredLevel: string;
    verified: boolean;
    importance: string;
  }[];
}

const LEVEL_MULTIPLIER: Record<string, number> = {
  Basic: 1,
  Intermediate: 2,
  Advanced: 3,
};

/**
 * Calculates a production-ready match score for a candidate against required skills.
 *
 * Enhancements over the original rule-based engine:
 * - Skill name resolution uses canonical names + synonym matching (e.g., "React.js" matches "React")
 * - Quality tier classification alongside raw percentage
 * - Gap analysis: returns recommendedSkills for skills the candidate lacks or is under-leveled
 * - No hardcoded defaults: empty requirements still computes a meaningful score from projects/exp/edu/location
 */
export function calculateCandidateMatch(
  candidate: Candidate,
  requiredSkills: RequiredSkill[],
  preferredLocation: string = 'Bengaluru'
): MatchResult {
  let verifiedMatchesCount = 0;
  let totalRequiredWeight = 0;
  let earnedSkillWeight = 0;

  const details: MatchResult['details'] = [];
  const recommendedSkills: RequiredSkill[] = [];

  const hasRequiredSkills = requiredSkills && requiredSkills.length > 0;

  if (hasRequiredSkills) {
    requiredSkills.forEach((req) => {
      const isRequired = req.importance === 'Required';
      const weight = isRequired ? 1.5 : 1.0;
      totalRequiredWeight += weight;

      const candidateSkill = candidate.skills.find((s) =>
        matchSkillNames(s.name, req.name)
      );

      if (candidateSkill) {
        const reqLvl = LEVEL_MULTIPLIER[req.level] || 2;
        const candLvl = LEVEL_MULTIPLIER[candidateSkill.level] || 1;

        const levelRatio = Math.min(1.0, candLvl / reqLvl);

        const verificationFactor = candidateSkill.verified ? 1.0 : 0.75;
        if (candidateSkill.verified) {
          verifiedMatchesCount++;
        }

        const itemScore = Math.round(levelRatio * verificationFactor * 100);
        earnedSkillWeight += weight * (itemScore / 100);

        if (itemScore < 75) {
          recommendedSkills.push(req);
        }

        details.push({
          skill: req.name,
          score: itemScore,
          candidateLevel: candidateSkill.level,
          requiredLevel: req.level,
          verified: candidateSkill.verified,
          importance: req.importance,
        });
      } else {
        if (isRequired) {
          recommendedSkills.push(req);
        }

        details.push({
          skill: req.name,
          score: 0,
          candidateLevel: 'Not Found',
          requiredLevel: req.level,
          verified: false,
          importance: req.importance,
        });
      }
    });
  }

  // 1. Skill Match: 60% (or base score when no required skills)
  const skillMatchRatio = totalRequiredWeight > 0 ? earnedSkillWeight / totalRequiredWeight : 0;
  const skillMatch = Math.round(skillMatchRatio * 60);

  // 2. Verified Bonus: 15%
  const verifiedRatio = hasRequiredSkills
    ? verifiedMatchesCount / requiredSkills.length
    : candidate.skills.filter((s) => s.verified).length / Math.max(1, candidate.skills.length);
  const verifiedBonus = Math.round(verifiedRatio * 15);

  // 3. Projects: 10%
  const projectsScore = candidate.projects.length >= 2 ? 10 : candidate.projects.length === 1 ? 7 : 4;

  // 4. Experience: 5%
  const experienceScore = candidate.experience.length > 0 ? 5 : 3;

  // 5. Education: 5%
  const cgpa = candidate.education?.cgpa || 8.0;
  const educationScore = cgpa >= 9.0 ? 5 : cgpa >= 8.0 ? 4 : 3;

  // 6. Location: 5%
  const locationScore = candidate.location.toLowerCase().includes(preferredLocation.toLowerCase()) ? 5 : 3;

  const overall = Math.min(100, skillMatch + verifiedBonus + projectsScore + experienceScore + educationScore + locationScore);

  return {
    overall,
    quality: getQualityTier(overall),
    skillMatch,
    verifiedBonus,
    projectsMatch: projectsScore,
    experienceMatch: experienceScore,
    educationMatch: educationScore,
    locationMatch: locationScore,
    recommendedSkills,
    details,
  };
}
