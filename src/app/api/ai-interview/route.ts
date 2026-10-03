import { NextResponse } from 'next/server';
import {
  AIInterviewRequest,
  AIInterviewResponse,
  callOpenAIAPI,
  callGeminiAPI,
  callOpenRouterAPI,
  callHuggingFaceAPI,
  transcribeAudioWithOpenAI,
  generateSpeechWithOpenAI,
  evaluateInterview,
  InterviewTurn,
} from '@/server/ai/interviewService';
import {
  checkRateLimit,
  verifyAppCheckHeader,
} from '@/server/rateLimit';
import { verifyFirebaseUser } from '@/server/verifyFirebaseUser';

export const runtime = 'nodejs';

const MAX_REQUEST_BYTES = 7 * 1024 * 1024;

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

async function readJsonBody(req: Request): Promise<{ body: unknown; tooLarge: boolean }> {
  const contentLength = Number(req.headers.get('content-length'));
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
    return { body: null, tooLarge: true };
  }

  if (!req.body) return { body: null, tooLarge: false };

  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let byteLength = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;

      byteLength += value.byteLength;
      if (byteLength > MAX_REQUEST_BYTES) {
        await reader.cancel().catch(() => {});
        return { body: null, tooLarge: true };
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const bytes = new Uint8Array(byteLength);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    return { body: JSON.parse(new TextDecoder().decode(bytes)), tooLarge: false };
  } catch {
    return { body: null, tooLarge: false };
  }
}

export async function POST(req: Request) {
  try {
    // 1. Firebase App Check Token Verification
    const appCheckResult = await verifyAppCheckHeader(req);
    if (!appCheckResult.isValid) {
      return NextResponse.json(
        { error: 'Unauthorized', message: appCheckResult.reason || 'Invalid App Check Token' },
        { status: 401 }
      );
    }

    // 2. Authenticate user server-side
    const authResult = await verifyAuthUser(req);
    if (!authResult.verified) {
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    let userId: string | null;
    try {
      userId = await verifyFirebaseUser(req);
    } catch (error) {
      console.error('[AI Interview] Sign-in verification unavailable:', error);
      return NextResponse.json({ error: 'Could not verify sign-in. Please retry.' }, { status: 503 });
    }
    if (!userId) return NextResponse.json({ error: 'Sign in to use the AI interviewer.' }, { status: 401 });

    // 3. Limit each signed-in user's AI requests independently.
    const rateLimit = await checkRateLimit(`interview:${userId}`, 25, 60);
    if (rateLimit.unavailable) {
      return NextResponse.json({ error: 'Interview service is temporarily unavailable.' }, { status: 503 });
    }

    if (!rateLimit.success) {
      const retryAfterSec = Math.ceil(rateLimit.resetMs / 1000);
      return NextResponse.json(
        {
          error: 'Too Many Requests',
          message: `Evaluation rate limit exceeded. Please wait ${retryAfterSec}s before sending another response.`,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfterSec),
            'X-RateLimit-Limit': String(rateLimit.limit),
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }

    const parsedBody = await readJsonBody(req);
    if (parsedBody.tooLarge) {
      return NextResponse.json({ error: 'Request body exceeds the 7 MB limit.' }, { status: 413 });
    }

    const body = parsedBody.body;
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json({ error: 'A valid JSON body is required' }, { status: 400 });
    }
    const requestBody = body as Record<string, unknown>;
    if (requestBody.action === 'evaluate') {
      const roleTitle = requestBody.roleTitle;
      const transcriptValue = requestBody.transcript;
      const transcript = Array.isArray(transcriptValue) ? transcriptValue as InterviewTurn[] : [];
      if (typeof roleTitle !== 'string' || !roleTitle.trim() || roleTitle.length > 200 ||
          !Array.isArray(transcriptValue) || transcript.length > 200 ||
          !transcript.every((turn) => (turn?.sender === 'ai' || turn?.sender === 'user') && typeof turn.text === 'string') ||
          !transcript.some((turn) => turn.sender === 'user' && turn.text.trim()) ||
          transcript.reduce((total, turn) => total + turn.text.length, 0) > 50000) {
        return NextResponse.json({ error: 'A valid interview transcript is required' }, { status: 400 });
      }
      try {
        const evaluation = await evaluateInterview(roleTitle, transcript);
        return NextResponse.json({ evaluation });
      } catch (error) {
        console.error('[AI Interview] Evaluation failed:', error);
        return NextResponse.json({ error: 'Interview evaluation is temporarily unavailable. Please retry.' }, { status: 503 });
      }
    }

    const { candidateName, roleTitle, userAnswer, audioBase64, audioMimeType, chatHistory } = requestBody as unknown as AIInterviewRequest;
    if (typeof candidateName !== 'string' || !candidateName.trim() || candidateName.length > 120 ||
        typeof roleTitle !== 'string' || !roleTitle.trim() || roleTitle.length > 200 ||
        (userAnswer !== undefined && (typeof userAnswer !== 'string' || userAnswer.length > 8000)) ||
        (audioBase64 !== undefined && (typeof audioBase64 !== 'string' || audioBase64.length > 6_000_000)) ||
        !Array.isArray(chatHistory) || chatHistory.length > 100 ||
        !chatHistory.every((turn) => (turn?.sender === 'ai' || turn?.sender === 'user') && typeof turn.text === 'string') ||
        chatHistory.reduce((total, turn) => total + turn.text.length, 0) > 30_000) {
      return NextResponse.json({ error: 'A valid interview answer is required' }, { status: 400 });
    }

    // 3. Process Original Audio Input (Voice -> OpenAI Whisper Transcription)
    let effectiveUserAnswer = (userAnswer || '').trim();

    if (audioBase64) {
      try {
        const whisperTranscript = await transcribeAudioWithOpenAI(audioBase64, audioMimeType || 'audio/webm');
        if (whisperTranscript && whisperTranscript.trim().length > 0) {
          effectiveUserAnswer = whisperTranscript.trim();
        }
      } catch {
        console.warn('[AI Interview] Whisper transcription failed.');
      }
    }

    if (!effectiveUserAnswer) {
      return NextResponse.json({ error: 'No readable answer was captured. Please try again.' }, { status: 422 });
    }

    const systemPrompt = `You are an expert Senior Technical Interviewer conducting a real-time voice interview with candidate "${candidateName}" for the position of "${roleTitle}".
Conduct an interactive, rigorous, concise, and encouraging interview.

Guidelines:
1. Candidate's latest spoken response: "${effectiveUserAnswer}".
2. Evaluate their technical vocabulary, clarity, problem-solving approach, and relevance to "${roleTitle}".
3. If their answer is a brief greeting (e.g. "hi", "hello"), greet them warmly and ask them to introduce their technical background and primary stack.
4. If their answer is short or vague (e.g. "ok", "yes"), ask a specific technical question tailored to ${roleTitle}.
5. If their answer contains technical details (e.g. React, Node, Python, Databases, SQL, Architecture, Testing), acknowledge their specific points and ask an insightful follow-up question or scenario-based problem.
6. Keep your spoken response natural, punchy, and conversational (2-3 sentences max per turn).
7. The session lasts up to 24 minutes. Continue asking questions until the client ends it.

Respond ONLY in valid JSON format with the following keys:
{
  "reply": "Your next spoken AI interviewer question or concluding remark",
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

    // Helper to enrich response with transcript and TTS audio
    const finalizeResponse = async (res: AIInterviewResponse): Promise<AIInterviewResponse> => {
      res.userTranscript = effectiveUserAnswer;
      if (!res.audioResponseBase64 && res.reply) {
        try {
          const ttsAudio = await generateSpeechWithOpenAI(res.reply);
          if (ttsAudio) {
            res.audioResponseBase64 = ttsAudio;
          }
        } catch {
          console.warn('[AI Interview] TTS generation failed.');
        }
      }
      return res;
    };

    const geminiResult: AIInterviewResponse | null = await callGeminiAPI(
      systemPrompt,
      conversationContext,
      effectiveUserAnswer
    );

    if (geminiResult) {
      console.log('[AI Interview] Response generated via Gemini LLM engine');
      const enriched = await finalizeResponse(geminiResult);
      return NextResponse.json(enriched);
    }

    const openAIResult: AIInterviewResponse | null = await callOpenAIAPI(
      systemPrompt,
      conversationContext,
      effectiveUserAnswer
    );

    if (openAIResult) {
      console.log('[AI Interview] Response generated via OpenAI LLM engine');
      const enriched = await finalizeResponse(openAIResult);
      return NextResponse.json(enriched);
    }

    const openRouterResult: AIInterviewResponse | null = await callOpenRouterAPI(
      systemPrompt,
      conversationContext,
      effectiveUserAnswer
    );

    if (openRouterResult) {
      console.log('[AI Interview] Response generated via OpenRouter LLM engine');
      const enriched = await finalizeResponse(openRouterResult);
      return NextResponse.json(enriched);
    }

    const hfResult: AIInterviewResponse | null = await callHuggingFaceAPI(
      systemPrompt,
      conversationContext,
      effectiveUserAnswer
    );

    if (hfResult) {
      console.log('[AI Interview] Response generated via Hugging Face LLM engine');
      const enriched = await finalizeResponse(hfResult);
      return NextResponse.json(enriched);
    }

    return NextResponse.json({ error: 'The AI interviewer is temporarily unavailable. Please try again.' }, { status: 503 });
  } catch {
    console.error('AI Interview Route Error');
    return NextResponse.json({ error: 'Failed to process AI interview response' }, { status: 500 });
  }
}
