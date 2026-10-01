import { NextResponse } from 'next/server';
import {
  AIInterviewRequest,
  AIInterviewResponse,
  callGeminiAPI,
  processNLPResponse,
} from '@/server/ai/interviewService';

// In-memory sliding window rate limiter: key (uid/ip) -> timestamps[]
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10; // Max 10 interview turns per minute

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const timestamps = (rateLimitMap.get(key) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  timestamps.push(now);
  rateLimitMap.set(key, timestamps);
  return true;
}

/**
 * Verifies the incoming Firebase Auth token server-side via Google Identity Toolkit.
 */
async function verifyAuthUser(req: Request): Promise<{ verified: boolean; uid?: string; email?: string; error?: string }> {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { verified: false, error: 'Unauthorized: Authentication required to access AI Interview.' };
  }

  const token = authHeader.slice(7).trim();
  if (!token) {
    return { verified: false, error: 'Unauthorized: Bearer token is empty.' };
  }

  // Support local demo sessions during development and testing
  if (process.env.NODE_ENV !== 'production' && token.startsWith('demo_token_')) {
    const demoUid = token.replace('demo_token_', '');
    return { verified: true, uid: demoUid };
  }

  // Cryptographically verify ID token with Google Identity Toolkit
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyBYafwhkKarQs36-GehGM50b1QqZKTvzPk';
  try {
    const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: token }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return {
        verified: false,
        error: `Unauthorized: Invalid or expired Firebase session token (${errData.error?.message || res.statusText}).`,
      };
    }

    const data = await res.json();
    const user = data.users?.[0];
    if (!user || !user.localId) {
      return { verified: false, error: 'Unauthorized: No active user account associated with token.' };
    }

    return { verified: true, uid: user.localId, email: user.email };
  } catch (err: any) {
    console.error('[AI Interview Auth] Token verification error:', err);
    return { verified: false, error: 'Unauthorized: Failed to verify authentication token.' };
  }
}

export async function POST(req: Request) {
  try {
    // 1. Authenticate user server-side
    const authResult = await verifyAuthUser(req);
    if (!authResult.verified) {
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    // 2. Enforce sliding window rate limit per authenticated user
    const rateLimitKey = authResult.uid || 'anonymous';
    if (!checkRateLimit(rateLimitKey)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded: You have reached the maximum allowed turns per minute. Please pause for a moment.' },
        { status: 429 }
      );
    }

    const body: AIInterviewRequest = await req.json();
    const { candidateName, roleTitle, userAnswer, chatHistory, audioMetrics } = body;

    const systemPrompt = `You are an expert Senior Technical Interviewer evaluating a candidate named "${candidateName}" for the position of "${roleTitle}".
Your task is to conduct an interactive, rigorous, and encouraging technical interview.

Guidelines:
1. Analyze the candidate's latest response: "${userAnswer}".
2. Evaluate their technical vocabulary, clarity, problem-solving approach, and relevance to the role.
3. If their answer is a brief greeting (e.g. "hi", "hello"), greet them warmly and ask them to introduce their technical background and primary stack.
4. If their answer is short or vague (e.g. "ok", "yes"), ask a specific technical question tailored to ${roleTitle}.
5. If their answer contains technical details (e.g. React, Node, Python, Databases, SQL, Architecture, Testing), acknowledge their specific points and ask an insightful follow-up question or scenario-based problem.
6. Keep your spoken response concise, professional, and natural (2-4 sentences max per turn).
7. Total interview length is 4 turns. You are currently on turn ${chatHistory.filter((c) => c.sender === 'user').length + 1}.

Respond ONLY in valid JSON format with the following keys:
{
  "reply": "Your next AI interviewer response / follow-up question",
  "isFinal": false,
  "technicalScore": 85,
  "communicationScore": 90,
  "sentiment": "Confident / Structured / Needs Detail",
  "keywordsIdentified": ["React", "API", "State"],
  "evaluation": null
}`;

    const conversationContext = `Conversation History:\n${chatHistory
      .map((c) => `${c.sender.toUpperCase()}: ${c.text}`)
      .join('\n')}`;

    const geminiResult: AIInterviewResponse | null = await callGeminiAPI(
      systemPrompt,
      conversationContext,
      userAnswer
    );

    if (geminiResult) {
      return NextResponse.json(geminiResult);
    }

    const nlpResult = processNLPResponse(
      candidateName,
      roleTitle,
      userAnswer,
      chatHistory,
      audioMetrics
    );
    return NextResponse.json(nlpResult);
  } catch (err: any) {
    console.error('AI Interview Route Error:', err);
    return NextResponse.json({ error: 'Failed to process AI interview response' }, { status: 500 });
  }
}
