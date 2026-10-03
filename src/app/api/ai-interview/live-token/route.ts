import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';
import { checkRateLimit, verifyAppCheckHeader } from '@/server/rateLimit';
import { verifyFirebaseUser } from '@/server/verifyFirebaseUser';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const appCheck = await verifyAppCheckHeader(req);
  if (!appCheck.isValid) return NextResponse.json({ error: appCheck.reason || 'Invalid App Check token.' }, { status: 401 });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'Gemini Live is not configured.' }, { status: 503 });

  let userId: string | null;
  try {
    userId = await verifyFirebaseUser(req);
  } catch {
    return NextResponse.json({ error: 'Could not verify sign-in.' }, { status: 503 });
  }
  if (!userId) return NextResponse.json({ error: 'Sign in to start an interview.' }, { status: 401 });
  const limit = await checkRateLimit(`live-token:${userId}`, 5, 60);
  if (limit.unavailable) return NextResponse.json({ error: 'Interview service is temporarily unavailable.' }, { status: 503 });
  if (!limit.success) {
    return NextResponse.json({ error: 'Too many connection attempts. Try again in a minute.' }, { status: 429 });
  }

  try {
    const ai = new GoogleGenAI({ apiKey, httpOptions: { apiVersion: 'v1alpha' } });
    const token = await ai.authTokens.create({ config: {
      uses: 1,
      expireTime: new Date(Date.now() + 25 * 60_000).toISOString(),
      liveConnectConstraints: { model: 'gemini-3.8-live' },
    } });
    if (!token.name) throw new Error('Empty Gemini Live token');
    return NextResponse.json({ token: token.name }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    console.error('[Gemini Live] Could not create token.');
    return NextResponse.json({ error: 'Gemini Live is temporarily unavailable.' }, { status: 502 });
  }
}
