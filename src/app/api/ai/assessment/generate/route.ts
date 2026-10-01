import { NextRequest, NextResponse } from 'next/server';
import { generateSkillAssessment, normalizeDifficulty } from '@/server/ai/skillAssessmentService';

// Sliding-window rate limiter for assessment generation
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_GENERATE_PER_MINUTE = 20; // 20 requests per minute in production

function checkGenerateRateLimit(key: string): boolean {
  const now = Date.now();
  const timestamps = (rateLimitMap.get(key) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (timestamps.length >= MAX_GENERATE_PER_MINUTE) {
    return false;
  }
  timestamps.push(now);
  rateLimitMap.set(key, timestamps);
  return true;
}

export async function POST(req: NextRequest) {
  // Rate limiting check
  const clientIp =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'assessment-client';

  const isTestBypass = process.env.NODE_ENV !== 'production' && req.headers.get('x-test-suite') === 'true';

  if (!isTestBypass && !checkGenerateRateLimit(clientIp)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please wait a moment before generating another assessment.' },
      { status: 429 }
    );
  }

  try {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON request body' }, { status: 400 });
    }

    const { skillName, difficulty, targetProficiency, retakeSeed } = body as {
      skillName?: string;
      difficulty?: string;
      targetProficiency?: string;
      retakeSeed?: string;
    };

    if (!skillName || typeof skillName !== 'string' || !skillName.trim()) {
      return NextResponse.json({ error: 'Skill name is required' }, { status: 400 });
    }

    const trimmed = skillName.trim();
    if (trimmed.length > 100) {
      return NextResponse.json({ error: 'Skill name must not exceed 100 characters' }, { status: 400 });
    }

    const rawDiff = difficulty || targetProficiency || 'MEDIUM';
    const chosenDifficulty = normalizeDifficulty(rawDiff);

    const { questions, sessionId } = await generateSkillAssessment(trimmed, chosenDifficulty, { retakeSeed });
    const { normalizeSkillName } = await import('@/server/ai/skillTaxonomy');
    const canonical = normalizeSkillName(trimmed).canonical || trimmed;

    return NextResponse.json({
      success: true,
      sessionId,
      skill: canonical,
      skillName: canonical,
      difficulty: chosenDifficulty,
      totalQuestions: questions.length,
      questions,
    });
  } catch (err: any) {
    console.error('[API /api/ai/assessment/generate] Error:', err?.message || err);
    const errorMessage =
      err?.message && err.message.includes('temporarily unavailable')
        ? 'AI assessment generation is temporarily unavailable. Please try again.'
        : err?.message || 'AI assessment generation is temporarily unavailable. Please try again.';

    return NextResponse.json({ error: errorMessage }, { status: 503 });
  }
}
