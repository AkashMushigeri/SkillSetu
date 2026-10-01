/**
 * src/lib/ai/aiClient.ts
 * 
 * Client-side AI service wrapper with robust fallback.
 * Allows components and contexts to call server AI routes with automatic graceful fallback.
 */

import {
  Opportunity,
  Skill,
  Project,
  StudentProfile,
  AssessmentQuestionItem,
  AssessmentEvaluationResult,
  ResumeExtractionResult,
} from '@/types/student';
import { matchStudentToOpportunity } from '@/server/ai/skillMatchingService';
import { evaluateAssessmentAnswers } from '@/server/ai/skillAssessmentService';

export async function requestSkillAssessment(
  skillName: string,
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'Beginner' | 'Intermediate' | 'Advanced' | 'Adaptive' = 'MEDIUM',
  options?: { retakeSeed?: string }
): Promise<AssessmentQuestionItem[]> {
  try {
    const res = await fetch('/api/ai/assessment/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skillName, difficulty, retakeSeed: options?.retakeSeed }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        const questions = data.questions as AssessmentQuestionItem[];
        (questions as any).sessionId = data.sessionId;
        return questions;
      }
    } else {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData?.error || 'AI assessment generation is temporarily unavailable. Please try again.');
    }
  } catch (e: any) {
    console.error('[AI Client] Assessment generation API failed:', e?.message || e);
    throw e;
  }

  throw new Error('AI assessment generation is temporarily unavailable. Please try again.');
}

export async function submitAssessmentEvaluation(
  questions: AssessmentQuestionItem[],
  answers: Record<number, number>,
  skillName: string,
  sessionId?: string
): Promise<AssessmentEvaluationResult> {
  try {
    const res = await fetch('/api/ai/assessment/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        questions,
        answers,
        skillName,
        sessionId: sessionId || (questions as any)?.sessionId,
      }),
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('[AI Client] API call failed, falling back to local evaluator:', e);
  }

  // Graceful fallback to local evaluator
  return evaluateAssessmentAnswers(questions, answers);
}

export async function requestOpportunityMatching(
  opportunity: Opportunity,
  skills: Skill[],
  projects: Project[] = [],
  profile?: Partial<StudentProfile>
) {
  try {
    const res = await fetch('/api/ai/matching', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ opportunity, skills, projects, profile }),
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('[AI Client] Matching API call failed, falling back to local matcher:', e);
  }

  return matchStudentToOpportunity(opportunity, skills, projects, profile);
}

export async function requestRecommendations(
  opportunities: Opportunity[],
  skills: Skill[],
  projects: Project[] = [],
  profile?: Partial<StudentProfile>,
  appliedIds: string[] = []
) {
  try {
    const res = await fetch('/api/ai/recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ opportunities, skills, projects, profile, appliedIds }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.recommendations) {
        return data.recommendations;
      }
    }
  } catch (e) {
    console.warn('[AI Client] Recommendations API call failed, using local generator:', e);
  }

  const { generateRecommendations } = await import('@/server/ai/recommendationService');
  return generateRecommendations(opportunities, skills, projects, profile, appliedIds);
}

export async function requestSkillGapAnalysis(
  opportunity: Opportunity,
  skills: Skill[],
  projects: Project[] = [],
  profile?: Partial<StudentProfile>
) {
  try {
    const res = await fetch('/api/ai/skill-gap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ opportunity, skills, projects, profile }),
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('[AI Client] Skill Gap API call failed, using local analyzer:', e);
  }

  const { analyzeSkillGaps } = await import('@/server/ai/skillGapService');
  return analyzeSkillGaps(opportunity, skills, projects, profile);
}

export async function requestResumeExtraction(input: {
  file?: File;
  text?: string;
  existingSkills?: Skill[];
}): Promise<ResumeExtractionResult> {
  try {
    let res: Response;
    if (input.file) {
      const formData = new FormData();
      formData.append('file', input.file);
      if (input.existingSkills) {
        formData.append('existingSkills', JSON.stringify(input.existingSkills));
      }
      res = await fetch('/api/ai/resume/extract', {
        method: 'POST',
        body: formData,
      });
    } else {
      res = await fetch('/api/ai/resume/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: input.text,
          existingSkills: input.existingSkills,
        }),
      });
    }

    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('[AI Client] Resume extraction API call failed, using local engine:', e);
  }

  const { extractResumeData } = await import('@/server/ai/resumeExtractionService');
  let rawText = input.text || '';
  if (!rawText && input.file) {
    try {
      rawText = await input.file.text();
    } catch {
      // ignore
    }
  }
  return extractResumeData({
    rawText,
    existingSkills: input.existingSkills,
  });
}

