import { NextRequest, NextResponse } from 'next/server';
import { matchStudentToOpportunity } from '@/server/ai/skillMatchingService';
import { Opportunity, Skill, Project, StudentProfile } from '@/types/student';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const opportunity = body.opportunity;
    const studentSkills = body.skills || body.student?.skills || [];
    const studentProjects = body.projects || body.student?.projects || [];
    const studentProfile = body.profile || body.student?.profile || undefined;

    if (!opportunity) {
      return NextResponse.json({ error: 'Opportunity data is required' }, { status: 400 });
    }

    const result = matchStudentToOpportunity(opportunity, studentSkills, studentProjects, studentProfile);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('[API /api/ai/matching] Error:', err);
    return NextResponse.json({ error: 'Failed to compute skill match', details: err?.message }, { status: 500 });
  }
}
