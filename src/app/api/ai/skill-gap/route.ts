import { NextRequest, NextResponse } from 'next/server';
import { analyzeSkillGaps } from '@/server/ai/skillGapService';
import { Opportunity, Skill, Project, StudentProfile } from '@/types/student';
import { INITIAL_SKILLS, INITIAL_PROJECTS, INITIAL_STUDENT_PROFILE } from '@/data/mockStudentData';
import { getOpportunityById } from '@/lib/jobProviders';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let opportunity: Opportunity | undefined = body.opportunity;
    const opportunityId = body.opportunityId || req.nextUrl.searchParams.get('opportunityId');

    // 1. If opportunityId was passed without full object, retrieve from authoritative source
    if (!opportunity && opportunityId) {
      opportunity = await getOpportunityById(opportunityId);
    }

    if (!opportunity) {
      return NextResponse.json(
        { error: 'Valid opportunity data or opportunityId is required' },
        { status: 400 }
      );
    }

    // 2. Validate skills array server-side (do not trust client match scores or unverified flags)
    const rawSkills = Array.isArray(body.skills) ? body.skills : (body.student?.skills || INITIAL_SKILLS);
    const sanitizedSkills: Skill[] = rawSkills.map((s: any) => ({
      ...s,
      isVerified: Boolean(s.isVerified),
      verifiedScore: typeof s.verifiedScore === 'number' ? s.verifiedScore : undefined,
      verifiedLevel: s.verifiedLevel || undefined,
      progress: typeof s.progress === 'number' ? s.progress : (s.isVerified ? 100 : 40),
    }));

    const rawProjects = Array.isArray(body.projects) ? body.projects : (body.student?.projects || []);
    const studentProfile = body.profile || body.student?.profile || undefined;

    // 3. Perform server-side skill gap analysis
    const result = analyzeSkillGaps(opportunity, sanitizedSkills, rawProjects, studentProfile);

    return NextResponse.json(result);
  } catch (err: any) {
    console.error('[API /api/ai/skill-gap] Error:', err);
    return NextResponse.json(
      { error: 'Failed to analyze skill gaps', details: err?.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const opportunityId = req.nextUrl.searchParams.get('opportunityId');

    if (!opportunityId) {
      return NextResponse.json(
        { error: 'opportunityId query parameter is required' },
        { status: 400 }
      );
    }

    const opportunity = await getOpportunityById(opportunityId);
    if (!opportunity) {
      return NextResponse.json(
        { error: `Opportunity with id "${opportunityId}" not found` },
        { status: 404 }
      );
    }

    // Default to initial profile for GET queries
    const result = analyzeSkillGaps(
      opportunity,
      INITIAL_SKILLS,
      INITIAL_PROJECTS,
      INITIAL_STUDENT_PROFILE
    );

    return NextResponse.json(result);
  } catch (err: any) {
    console.error('[API GET /api/ai/skill-gap] Error:', err);
    return NextResponse.json(
      { error: 'Failed to analyze skill gaps', details: err?.message },
      { status: 500 }
    );
  }
}
