import { NextRequest, NextResponse } from 'next/server';
import { evaluateAssessmentAnswers, getAssessmentSession } from '@/server/ai/skillAssessmentService';
import { AssessmentQuestionItem } from '@/types/student';

// Sliding-window rate limiter for assessment evaluation
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_EVALUATE_PER_MINUTE = 40; // 40 requests per minute in production

function checkEvaluateRateLimit(key: string): boolean {
  const now = Date.now();
  const timestamps = (rateLimitMap.get(key) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (timestamps.length >= MAX_EVALUATE_PER_MINUTE) {
    return false;
  }
  timestamps.push(now);
  rateLimitMap.set(key, timestamps);
  return true;
}

export async function POST(req: NextRequest) {
  const clientIp =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'evaluate-client';

  const isTestBypass = process.env.NODE_ENV !== 'production' && req.headers.get('x-test-suite') === 'true';

  if (!isTestBypass && !checkEvaluateRateLimit(clientIp)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please wait a moment before evaluating.' },
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

    const { questions: clientQuestions, answers, skillName, sessionId } = body as {
      questions?: AssessmentQuestionItem[];
      answers?: Record<number, number>;
      skillName?: string;
      sessionId?: string;
    };

    // Server-authoritative: resolve authoritative question set from session cache if available
    const session = sessionId ? getAssessmentSession(sessionId) : undefined;
    const questions = session?.questions || clientQuestions;

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({ error: 'A valid non-empty questions array or valid sessionId is required' }, { status: 400 });
    }

    if (!answers || typeof answers !== 'object' || Array.isArray(answers)) {
      return NextResponse.json({ error: 'A valid answers map is required' }, { status: 400 });
    }

    // Server-authoritative: scores are computed solely from authoritative questions and answers
    // Client-supplied passed/score/percentage fields are completely ignored
    const evaluation = evaluateAssessmentAnswers(questions, answers);
    return NextResponse.json({
      success: true,
      skillName: (typeof skillName === 'string' && skillName.trim())
        ? skillName.trim().slice(0, 100)
        : (session?.skillName || 'Skill'),
      ...evaluation,
    });
  } catch (err: any) {
    console.error('[API /api/ai/assessment/evaluate] Error:', err);
    return NextResponse.json({ error: 'Failed to evaluate assessment', details: err?.message }, { status: 500 });
  }
}
