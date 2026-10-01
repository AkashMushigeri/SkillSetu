/**
 * src/server/ai/skillGapService.ts
 * 
 * Professional, verification-aware AI Skill Gap Analysis Engine.
 * 
 * Identifies evidence-based skill gaps by comparing opportunity requirements
 * against a student's verified and claimed profile using existing taxonomy,
 * matching algorithms, and proficiency levels.
 */

import {
  Opportunity,
  Skill,
  Project,
  StudentProfile,
  SkillGapStatus,
  SkillGapItem,
  SkillGapSummary,
  SkillGapAnalysisResult,
  SkillProficiencyLevel,
  SkillTier,
} from '@/types/student';
import { calculateSkillSimilarity } from './skillTaxonomy';
import { matchStudentToOpportunity } from './skillMatchingService';

export const PROFICIENCY_LEVEL_ORDER: Record<string, number> = {
  basic: 1,
  beginner: 1,
  intermediate: 2,
  advanced: 3,
  expert: 4,
};

/**
 * Normalizes proficiency string to numeric rank.
 */
function getProficiencyRank(level?: string): number {
  if (!level) return 2; // Default to intermediate if unspecified
  const norm = level.toLowerCase().trim();
  return PROFICIENCY_LEVEL_ORDER[norm] || 2;
}

/**
 * Determines default expected proficiency for an opportunity skill.
 */
function inferRequiredProficiency(opportunity: Opportunity): SkillProficiencyLevel {
  const exp = (opportunity.experienceLevel || '').toLowerCase();
  if (exp.includes('senior') || exp.includes('lead') || exp.includes('advanced')) {
    return 'Advanced';
  }
  if (exp.includes('fresher') || exp.includes('student') || exp.includes('entry') || exp.includes('beginner')) {
    return 'Intermediate'; // Engineering standard for production entry
  }
  return 'Intermediate';
}

/**
 * Performs evidence-based AI Skill Gap Analysis between a student and an opportunity.
 */
export function analyzeSkillGaps(
  opportunity: Opportunity,
  skills: Skill[],
  projects: Project[] = [],
  profile?: Partial<StudentProfile>
): SkillGapAnalysisResult {
  const requiredSkillsList = opportunity.requiredSkills || [];
  const preferredSkillsList = opportunity.preferredSkills || [];
  const targetProficiency = inferRequiredProficiency(opportunity);
  const targetRank = getProficiencyRank(targetProficiency);

  // Active student skill index (filtered by claimed, resume-extracted, or verified)
  const studentSkills = skills.filter(
    (s) =>
      (typeof s.progress === 'number' && s.progress > 0) ||
      s.isVerified ||
      s.evidenceSource === 'resume' ||
      s.verificationType === 'resume_extracted'
  );

  // 1. Calculate authoritative current match score using existing engine
  const currentMatch = matchStudentToOpportunity(opportunity, studentSkills, projects, profile);
  const currentMatchScore = currentMatch.matchScore;

  // Buckets for categorized skills
  const reqMatched: SkillGapItem[] = [];
  const reqPartial: SkillGapItem[] = [];
  const reqClaimedUnverified: SkillGapItem[] = [];
  const reqMissing: SkillGapItem[] = [];

  const prefMatched: SkillGapItem[] = [];
  const prefPartial: SkillGapItem[] = [];
  const prefMissing: SkillGapItem[] = [];

  const priorityGaps: SkillGapItem[] = [];

  // Helper to find student skill match
  function findBestStudentSkill(reqSkillName: string) {
    let best: {
      skill?: Skill;
      score: number;
      relation: 'exact' | 'synonym' | 'related' | 'none';
      canonical: string;
    } = { score: 0, relation: 'none', canonical: reqSkillName };

    for (const s of studentSkills) {
      const sim = calculateSkillSimilarity(s.name, reqSkillName);
      if (sim.score > best.score) {
        best = { skill: s, score: sim.score, relation: sim.relation, canonical: sim.canonical };
      }
    }
    return best;
  }

  // =========================================================================
  // 1. Process Required Skills (Mandatory Core Requirements)
  // =========================================================================
  requiredSkillsList.forEach((reqSkill) => {
    const match = findBestStudentSkill(reqSkill);

    if (match.skill && (match.relation === 'exact' || match.relation === 'synonym')) {
      const isVerified = Boolean(match.skill.isVerified);
      const studentProficiency = match.skill.verifiedLevel || match.skill.level || 'Intermediate';
      const studentRank = getProficiencyRank(studentProficiency);

      if (isVerified) {
        if (studentRank >= targetRank) {
          // Fully satisfied requirement
          const item: SkillGapItem = {
            skill: reqSkill,
            importance: 'Required',
            status: 'MATCHED',
            requiredProficiency: targetProficiency,
            studentProficiency,
            isVerified: true,
            score: match.skill.verifiedScore || 85,
            matchedWith: match.relation === 'synonym' ? match.skill.name : undefined,
            relationType: match.relation,
            explanation: `${reqSkill} is verified at ${studentProficiency} level and satisfies the core opportunity requirement.`,
            priorityRank: 5,
          };
          reqMatched.push(item);
        } else {
          // Verified, but below the target proficiency
          const item: SkillGapItem = {
            skill: reqSkill,
            importance: 'Required',
            status: 'PARTIAL',
            requiredProficiency: targetProficiency,
            studentProficiency,
            isVerified: true,
            score: match.skill.verifiedScore,
            matchedWith: match.relation === 'synonym' ? match.skill.name : undefined,
            relationType: match.relation,
            explanation: `${reqSkill} is verified at ${studentProficiency} level, but this opportunity seeks ${targetProficiency} proficiency.`,
            recommendedAction: {
              type: 'reassess',
              label: `Re-assess for ${targetProficiency}`,
              url: `/student/skills/${match.skill.id}`,
            },
            priorityRank: 2,
          };
          reqPartial.push(item);
          priorityGaps.push(item);
        }
      } else {
        // Claimed on profile, but NOT verified through assessment
        const item: SkillGapItem = {
          skill: reqSkill,
          importance: 'Required',
          status: 'CLAIMED_UNVERIFIED',
          requiredProficiency: targetProficiency,
          studentProficiency: match.skill.level || 'Intermediate',
          isVerified: false,
          matchedWith: match.relation === 'synonym' ? match.skill.name : undefined,
          relationType: match.relation,
          explanation: `${reqSkill} is declared on your profile but has not yet been verified through a SkillSetu assessment.`,
          recommendedAction: {
            type: 'take_assessment',
            label: `Verify Skill (${reqSkill})`,
            url: `/student/skills/${match.skill.id}`,
          },
          priorityRank: 3,
        };
        reqClaimedUnverified.push(item);
        priorityGaps.push(item);
      }
    } else if (match.skill && match.relation === 'related' && match.score >= 0.5) {
      // Related skill foundation (e.g. knows Python when role asks for Machine Learning)
      const item: SkillGapItem = {
        skill: reqSkill,
        importance: 'Required',
        status: 'PARTIAL',
        requiredProficiency: targetProficiency,
        studentProficiency: 'Foundational',
        isVerified: Boolean(match.skill.isVerified),
        matchedWith: match.skill.name,
        relationType: 'related',
        explanation: `You have foundational knowledge via related skill ${match.skill.name}, but this role requires dedicated proficiency in ${reqSkill}.`,
        recommendedAction: {
          type: 'take_assessment',
          label: `Assess ${reqSkill}`,
          url: `/student/skills?addSkill=${encodeURIComponent(reqSkill)}`,
        },
        priorityRank: 2,
      };
      reqPartial.push(item);
      priorityGaps.push(item);
    } else {
      // Completely missing required skill
      const item: SkillGapItem = {
        skill: reqSkill,
        importance: 'Required',
        status: 'MISSING',
        requiredProficiency: targetProficiency,
        studentProficiency: 'None',
        isVerified: false,
        relationType: 'none',
        explanation: `${reqSkill} is a mandatory requirement that is currently missing from your skill profile and project portfolio.`,
        recommendedAction: {
          type: 'add_skill',
          label: `Add & Learn ${reqSkill}`,
          url: `/student/skills?addSkill=${encodeURIComponent(reqSkill)}`,
        },
        priorityRank: 1, // Highest priority gap
      };
      reqMissing.push(item);
      priorityGaps.push(item);
    }
  });

  // =========================================================================
  // 2. Process Preferred Skills (Non-Mandatory Value-Add Skills)
  // =========================================================================
  preferredSkillsList.forEach((prefSkill) => {
    const match = findBestStudentSkill(prefSkill);

    if (match.skill && (match.relation === 'exact' || match.relation === 'synonym')) {
      const isVerified = Boolean(match.skill.isVerified);
      const studentProficiency = match.skill.verifiedLevel || match.skill.level || 'Intermediate';

      if (isVerified) {
        prefMatched.push({
          skill: prefSkill,
          importance: 'Preferred',
          status: 'MATCHED',
          requiredProficiency: 'Basic',
          studentProficiency,
          isVerified: true,
          score: match.skill.verifiedScore || 80,
          matchedWith: match.relation === 'synonym' ? match.skill.name : undefined,
          relationType: match.relation,
          explanation: `${prefSkill} is verified and provides a competitive candidate advantage for this position.`,
          priorityRank: 5,
        });
      } else {
        const item: SkillGapItem = {
          skill: prefSkill,
          importance: 'Preferred',
          status: 'CLAIMED_UNVERIFIED',
          requiredProficiency: 'Basic',
          studentProficiency,
          isVerified: false,
          matchedWith: match.relation === 'synonym' ? match.skill.name : undefined,
          relationType: match.relation,
          explanation: `${prefSkill} is claimed in your profile; verifying it elevates your recruiter match boost.`,
          recommendedAction: {
            type: 'take_assessment',
            label: `Verify ${prefSkill}`,
            url: `/student/skills/${match.skill.id}`,
          },
          priorityRank: 4,
        };
        prefPartial.push(item);
        priorityGaps.push(item);
      }
    } else if (match.skill && match.relation === 'related') {
      const item: SkillGapItem = {
        skill: prefSkill,
        importance: 'Preferred',
        status: 'PARTIAL',
        requiredProficiency: 'Basic',
        studentProficiency: 'Foundational',
        isVerified: Boolean(match.skill.isVerified),
        matchedWith: match.skill.name,
        relationType: 'related',
        explanation: `Related knowledge observed from ${match.skill.name}. Direct skill in ${prefSkill} is preferred.`,
        priorityRank: 5,
      };
      prefPartial.push(item);
      priorityGaps.push(item);
    } else {
      const item: SkillGapItem = {
        skill: prefSkill,
        importance: 'Preferred',
        status: 'PREFERRED_GAP',
        requiredProficiency: 'Basic',
        studentProficiency: 'None',
        isVerified: false,
        relationType: 'none',
        explanation: `${prefSkill} is a preferred qualification. It is non-mandatory, but acquiring it elevates your recruiter match.`,
        recommendedAction: {
          type: 'add_skill',
          label: `Explore ${prefSkill}`,
          url: `/student/skills?addSkill=${encodeURIComponent(prefSkill)}`,
        },
        priorityRank: 4,
      };
      prefMissing.push(item);
      priorityGaps.push(item);
    }
  });

  // Sort priority gaps by priorityRank ascending (Rank 1 Critical -> Rank 5 Low)
  priorityGaps.sort((a, b) => a.priorityRank - b.priorityRank);

  // =========================================================================
  // 3. Potential Match Score Calculation (Using Real Engine Simulation)
  // =========================================================================
  // Simulate the student successfully verifying all required skills that were missing/claimed
  const simulatedSkills: Skill[] = [...studentSkills];

  requiredSkillsList.forEach((reqSkill) => {
    const existingIdx = simulatedSkills.findIndex(
      (s) => s.name.toLowerCase() === reqSkill.toLowerCase()
    );
    if (existingIdx >= 0) {
      simulatedSkills[existingIdx] = {
        ...simulatedSkills[existingIdx],
        isVerified: true,
        progress: 100,
        verifiedLevel: targetProficiency,
        verifiedScore: 88,
      };
    } else {
      simulatedSkills.push({
        id: `sim-${reqSkill.toLowerCase()}`,
        name: reqSkill,
        tier: 'Intermediate',
        category: 'Technical',
        icon: '✨',
        level: targetProficiency,
        progress: 100,
        isVerified: true,
        verifiedLevel: targetProficiency,
        verifiedScore: 88,
        verificationType: 'assessment_verified',
        learningStatus: 'completed',
        assessmentStatus: 'passed',
        description: 'Simulated verified competency for gap resolution projection.',
        estimatedTime: 'Completed',
        learningObjectives: [],
        resources: [],
        careerRoles: [],
        relatedOpportunityCount: 5,
      });
    }
  });

  const potentialMatch = matchStudentToOpportunity(opportunity, simulatedSkills, projects, profile);
  const potentialMatchScore = potentialMatch.matchScore;
  const potentialScoreDelta = Math.max(0, potentialMatchScore - currentMatchScore);

  // =========================================================================
  // 4. Readiness Summary & Actionable Recommendations
  // =========================================================================
  const totalRequired = requiredSkillsList.length;
  const totalPreferred = preferredSkillsList.length;
  const matchedCount = reqMatched.length;
  const partialCount = reqPartial.length;
  const claimedUnverifiedCount = reqClaimedUnverified.length;
  const missingCount = reqMissing.length;
  const preferredGapCount = prefMissing.length;

  let overallReadiness: 'High' | 'Moderate' | 'Developing' | 'Early Stage' = 'Early Stage';
  if (totalRequired === 0) {
    overallReadiness = 'High';
  } else {
    const satisfiedRatio = matchedCount / totalRequired;
    const partialRatio = (matchedCount + partialCount * 0.5 + claimedUnverifiedCount * 0.3) / totalRequired;

    if (satisfiedRatio >= 0.8) {
      overallReadiness = 'High';
    } else if (partialRatio >= 0.6) {
      overallReadiness = 'Moderate';
    } else if (partialRatio >= 0.35) {
      overallReadiness = 'Developing';
    } else {
      overallReadiness = 'Early Stage';
    }
  }

  const summary: SkillGapSummary = {
    totalRequired,
    totalPreferred,
    matchedCount,
    partialCount,
    claimedUnverifiedCount,
    missingCount,
    preferredGapCount,
    overallReadiness,
  };

  const recommendedActions = priorityGaps
    .filter((g) => g.recommendedAction)
    .slice(0, 4)
    .map((g) => ({
      skill: g.skill,
      action: g.recommendedAction!.label,
      url: g.recommendedAction!.url,
      urgency: g.priorityRank === 1 ? ('critical' as const) : g.priorityRank <= 3 ? ('high' as const) : ('medium' as const),
    }));

  return {
    opportunityId: opportunity.id,
    opportunityTitle: opportunity.title,
    company: opportunity.company,
    currentMatchScore,
    potentialMatchScore,
    potentialScoreDelta,
    summary,
    requiredSkills: {
      matched: reqMatched,
      partial: reqPartial,
      claimedUnverified: reqClaimedUnverified,
      missing: reqMissing,
    },
    preferredSkills: {
      matched: prefMatched,
      partial: prefPartial,
      missing: prefMissing,
    },
    priorityGaps,
    recommendedActions,
  };
}
