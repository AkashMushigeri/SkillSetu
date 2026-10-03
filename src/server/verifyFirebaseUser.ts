export async function verifyFirebaseUser(req: Request): Promise<string | null> {
  const idToken = req.headers.get('authorization')?.match(/^Bearer (\S+)$/)?.[1];
  if (!idToken) return null;

  const firebaseKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyBYafwhkKarQs36-GehGM50b1QqZKTvzPk';
  if (!firebaseKey) throw new Error('Firebase authentication is not configured.');

  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
    signal: AbortSignal.timeout(10_000),
  });
  if (response.status >= 500) throw new Error('Firebase authentication is unavailable.');
  const identity = response.ok ? await response.json() : null;
  return identity?.users?.[0]?.localId || null;
}
