import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import { runDatabaseSeeder, SeedOptions } from '@/lib/seeder';

export const dynamic = 'force-dynamic';

function isAuthorized(req: NextRequest) {
  if (process.env.NODE_ENV !== 'production') return true;
  const expected = process.env.ADMIN_SEED_TOKEN;
  const received = req.headers.get('authorization')?.match(/^Bearer (.+)$/)?.[1];
  return Boolean(expected && received && expected.length === received.length && timingSafeEqual(Buffer.from(expected), Buffer.from(received)));
}

export async function GET() {
  return NextResponse.json({
    service: 'SkillSetu Database Seeder API',
    endpoint: '/api/admin/seed',
    methods: ['POST', 'GET'],
    usage: 'Send a POST request to /api/admin/seed with optional JSON payload { seedUsers, seedSkills, seedCompanies, seedColleges, seedJobs, seedInternships, seedChallenges } to run the seeder.',
  });
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  try {
    let options: SeedOptions = {};
    try {
      options = await req.json();
    } catch {
      // Body is optional
    }

    const result = await runDatabaseSeeder(options);
    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    const dataConnectUnavailable = error instanceof Error && error.message.includes('Data Connect is unavailable');
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to execute database seeder',
      },
      { status: dataConnectUnavailable ? 503 : 500 }
    );
  }
}
