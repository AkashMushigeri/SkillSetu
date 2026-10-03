import { Opportunity, Skill, Project, StudentProfile, SkillMatchExplanation } from '@/types/student';
import { matchStudentToOpportunity } from '@/server/ai/skillMatchingService';
import { getQualityTier } from './skillNormalization';

export type { MatchQuality } from './skillNormalization';

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
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}

function getSkillLearningPathUrl(skillName: string): string {
  const slug = skillName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return `/student/skills/${slug}`;
}

export interface OpportunityMatchResult {
  matchScore: number;
  quality: ReturnType<typeof getQualityTier>;
  matchedSkills: string[];
  verifiedMatchedSkills: string[];
  claimedMatchedSkills: string[];
  partialMatchedSkills?: Array<{ skill: string; matchedWith: string }>;
  missingSkills: string[];
  isMatchBoosted: boolean;
  boostMessage?: string;
  matchExplanation?: string;
  explanation: SkillMatchExplanation;
  learningPathUrls: Record<string, string>;
}

/**
 * Computes transparent, explainable Skill Match percentage, matching skills,
 * verified/claimed boosts, project relevance, and learning paths for missing skills.
 */
export function computeOpportunityMatch(
  opportunity: Opportunity,
  skills: Skill[],
  projects: Project[] = [],
  profile?: Partial<StudentProfile>
): OpportunityMatchResult {
  const result = matchStudentToOpportunity(opportunity, skills, projects, profile);

  const learningPathUrls: Record<string, string> = {};
  result.missingSkills.forEach((skill) => {
    learningPathUrls[skill] = getSkillLearningPathUrl(skill);
  });

  return {
    matchScore: result.matchScore,
    quality: getQualityTier(result.matchScore),
    matchedSkills: result.matchedSkills,
    verifiedMatchedSkills: result.verifiedMatchedSkills,
    claimedMatchedSkills: result.claimedMatchedSkills,
    partialMatchedSkills: result.partialMatchedSkills,
    missingSkills: result.missingSkills,
    isMatchBoosted: result.isMatchBoosted,
    boostMessage: result.boostMessage,
    matchExplanation: result.explanation.summary,
    explanation: result.explanation,
    learningPathUrls,
  };
}
