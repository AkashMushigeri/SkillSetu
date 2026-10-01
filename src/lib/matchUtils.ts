import { Opportunity, Skill, Project, StudentProfile, SkillMatchExplanation } from '@/types/student';
import { matchStudentToOpportunity } from '@/server/ai/skillMatchingService';

/**
 * Calculates Haversine distance in kilometers between two GPS coordinates.
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of Earth in KM
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}

/**
 * Computes transparent, explainable Skill Match percentage, matching skills,
 * verified boosts, and project/role relevance.
 */
export function computeOpportunityMatch(
  opportunity: Opportunity,
  skills: Skill[],
  projects: Project[] = [],
  profile?: Partial<StudentProfile>
): {
  matchScore: number;
  matchedSkills: string[];
  verifiedMatchedSkills: string[];
  claimedMatchedSkills: string[];
  partialMatchedSkills?: Array<{ skill: string; matchedWith: string }>;
  missingSkills: string[];
  isMatchBoosted: boolean;
  boostMessage?: string;
  matchExplanation?: string;
  explanation: SkillMatchExplanation;
} {
  const result = matchStudentToOpportunity(opportunity, skills, projects, profile);

  return {
    matchScore: result.matchScore,
    matchedSkills: result.matchedSkills,
    verifiedMatchedSkills: result.verifiedMatchedSkills,
    claimedMatchedSkills: result.claimedMatchedSkills,
    partialMatchedSkills: result.partialMatchedSkills,
    missingSkills: result.missingSkills,
    isMatchBoosted: result.isMatchBoosted,
    boostMessage: result.boostMessage,
    matchExplanation: result.explanation.summary,
    explanation: result.explanation,
  };
}
