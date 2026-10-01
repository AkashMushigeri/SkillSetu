/**
 * src/server/ai/recommendationService.ts
 * 
 * AI Opportunity Recommendation Service.
 * Prioritizes opportunities tailored to student verified competencies, projects, and goals.
 */

import { Opportunity, Skill, Project, StudentProfile, Application } from '@/types/student';
import { matchStudentToOpportunity } from './skillMatchingService';

export interface RecommendedOpportunity extends Opportunity {
  recommendationReason: string;
  recommendationScore: number;
}

export function generateRecommendations(
  opportunities: Opportunity[],
  skills: Skill[],
  projects: Project[] = [],
  profile?: Partial<StudentProfile>,
  appliedIds: string[] = []
): RecommendedOpportunity[] {
  // Filter out opportunities already applied to
  const available = opportunities.filter((opp) => !appliedIds.includes(opp.id));

  const scoredList: RecommendedOpportunity[] = available.map((opp) => {
    const match = matchStudentToOpportunity(opp, skills, projects, profile);

    // Compute tailored recommendation boost
    let recScore = match.matchScore;

    // Bonus for verified skill alignment
    const verifiedMatches = match.verifiedMatchedSkills.length;
    recScore += verifiedMatches * 4;

    // Bonus for project alignment
    if (match.explanation.projectRelevance && match.explanation.projectRelevance.length > 0) {
      recScore += 5;
    }

    // Recommendation reason
    let reason = '';
    if (verifiedMatches > 0) {
      reason = `Recommended based on your verified skills in ${match.verifiedMatchedSkills.slice(0, 2).join(' & ')}.`;
    } else if (match.explanation.projectRelevance && match.explanation.projectRelevance.length > 0) {
      reason = `Matches tech stack used in your ${match.explanation.projectRelevance[0]} project.`;
    } else if (profile?.careerGoal && opp.title.toLowerCase().includes(profile.careerGoal.toLowerCase().split(' ')[0])) {
      reason = `Aligned with your aspirational career goal in ${profile.careerGoal}.`;
    } else {
      reason = `Strong skill overlap with ${opp.requiredSkills.slice(0, 2).join(' and ')}.`;
    }

    return {
      ...opp,
      matchScore: match.matchScore,
      matchedSkills: match.matchedSkills,
      verifiedMatchedSkills: match.verifiedMatchedSkills,
      claimedMatchedSkills: match.claimedMatchedSkills,
      partialMatchedSkills: match.partialMatchedSkills,
      missingSkills: match.missingSkills,
      isMatchBoosted: match.isMatchBoosted,
      boostMessage: match.boostMessage,
      matchExplanation: match.explanation.summary,
      recommendationReason: reason,
      recommendationScore: Math.min(100, recScore),
    };
  });

  // Sort descending by recommendationScore
  return scoredList.sort((a, b) => b.recommendationScore - a.recommendationScore);
}
