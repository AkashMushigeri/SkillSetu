import { NextRequest, NextResponse } from 'next/server';
import { generateRecommendations } from '@/server/ai/recommendationService';
import { Opportunity, Skill, Project, StudentProfile } from '@/types/student';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const studentSkills = body.skills || body.student?.skills || [];
    const studentProjects = body.projects || body.student?.projects || [];
    const studentProfile = body.profile || body.student?.profile || undefined;
    const appliedIds = body.appliedIds || body.student?.appliedIds || [];
    const opportunities = body.opportunities || [];

    if (!Array.isArray(opportunities)) {
      return NextResponse.json({ error: 'opportunities array is required' }, { status: 400 });
    }

    const recommendations = generateRecommendations(
      opportunities,
      studentSkills,
      studentProjects,
      studentProfile,
      appliedIds
    );

    return NextResponse.json({ recommendations });
  } catch (err: any) {
    console.error('[API /api/ai/recommendations] Error:', err);
    return NextResponse.json({ error: 'Failed to generate recommendations', details: err?.message }, { status: 500 });
  }
}
