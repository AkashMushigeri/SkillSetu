import { NextRequest, NextResponse } from 'next/server';
import { runDatabaseSeeder, SeedOptions } from '@/lib/seeder';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  return NextResponse.json({
    service: 'SkillSetu Database Seeder API',
    endpoint: '/api/admin/seed',
    methods: ['POST', 'GET'],
    usage: 'Send a POST request to /api/admin/seed with optional JSON payload { seedUsers, seedSkills, seedCompanies, seedColleges, seedJobs, seedInternships, seedChallenges } to run the seeder.',
  });
}

export async function POST(req: NextRequest) {
  try {
    let options: SeedOptions = {};
    try {
      options = await req.json();
    } catch {
      // Body is optional
    }

    const result = await runDatabaseSeeder(options);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to execute database seeder',
      },
      { status: 500 }
    );
  }
}
