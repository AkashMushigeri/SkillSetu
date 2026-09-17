import { Candidate, RequiredSkill } from '@/types/industry';

export interface MatchResult {
  overall: number; // 0 - 100
  skillMatch: number; // out of 60
  verifiedBonus: number; // out of 15
  projectsMatch: number; // out of 10
  experienceMatch: number; // out of 5
  educationMatch: number; // out of 5
  locationMatch: number; // out of 5
  details: {
    skill: string;
    score: number;
    candidateLevel: string;
    requiredLevel: string;
    verified: boolean;
    importance: string;
  }[];
}

/**
 * Calculates rule-based match score for a candidate against required skills.
 */
export function calculateCandidateMatch(
  candidate: Candidate,
  requiredSkills: RequiredSkill[],
  preferredLocation: string = 'Bengaluru'
): MatchResult {
  if (!requiredSkills || requiredSkills.length === 0) {
    return {
      overall: 85,
      skillMatch: 52,
      verifiedBonus: 13,
      projectsMatch: 9,
      experienceMatch: 4,
      educationMatch: 4,
      locationMatch: 5,
      details: [],
    };
  }

  let matchedSkillsCount = 0;
  let verifiedMatchesCount = 0;
  let totalRequiredWeight = 0;
  let earnedSkillWeight = 0;

  const details: MatchResult['details'] = [];

  const levelMultiplier: Record<string, number> = {
    Basic: 1,
    Intermediate: 2,
    Advanced: 3,
  };

  requiredSkills.forEach((req) => {
    const isRequired = req.importance === 'Required';
    const weight = isRequired ? 1.5 : 1.0;
    totalRequiredWeight += weight;

    const candidateSkill = candidate.skills.find(
      (s) => s.name.toLowerCase() === req.name.toLowerCase()
    );

    if (candidateSkill) {
      matchedSkillsCount++;
      const reqLvl = levelMultiplier[req.level] || 2;
      const candLvl = levelMultiplier[candidateSkill.level] || 1;

      // level ratio (max 1.0)
      let levelRatio = Math.min(1.0, candLvl / reqLvl);

      // Verified weight bonus vs unverified
      let verificationFactor = candidateSkill.verified ? 1.0 : 0.75;
      if (candidateSkill.verified) {
        verifiedMatchesCount++;
      }

      const itemScore = Math.round(levelRatio * verificationFactor * 100);
      earnedSkillWeight += weight * (itemScore / 100);

      details.push({
        skill: req.name,
        score: itemScore,
        candidateLevel: candidateSkill.level,
        requiredLevel: req.level,
        verified: candidateSkill.verified,
        importance: req.importance,
      });
    } else {
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

  // 1. Skill Match: 60%
  const skillMatchRatio = totalRequiredWeight > 0 ? earnedSkillWeight / totalRequiredWeight : 0;
  const skillMatch = Math.round(skillMatchRatio * 60);

  // 2. Verified Bonus: 15%
  const verifiedRatio = requiredSkills.length > 0 ? verifiedMatchesCount / requiredSkills.length : 0;
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

  const overall = Math.min(99, skillMatch + verifiedBonus + projectsScore + experienceScore + educationScore + locationScore);

  return {
    overall,
    skillMatch,
    verifiedBonus,
    projectsMatch: projectsScore,
    experienceMatch: experienceScore,
    educationMatch: educationScore,
    locationMatch: locationScore,
    details,
  };
}
