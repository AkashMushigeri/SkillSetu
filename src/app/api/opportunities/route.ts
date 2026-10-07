import { NextRequest, NextResponse } from 'next/server';
import {
  getVerifiedOpportunities,
  getOpportunityById,
  JobFilterParams,
} from '@/lib/jobProviders';
import { OpportunityType } from '@/types/student';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Single opportunity lookup by id
    const id = searchParams.get('id');
    if (id) {
      const opp = await getOpportunityById(id);
      if (!opp) {
        return NextResponse.json(
          { success: false, error: 'Verified opportunity not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, opportunity: opp });
    }

    // Filtered list
    const city = searchParams.get('city') || undefined;
    const q = searchParams.get('q') || undefined;
    const type = (searchParams.get('type') as OpportunityType) || undefined;
    const workMode =
      (searchParams.get('workMode') as 'Remote' | 'Hybrid' | 'On-site') ||
      undefined;
    const limit = searchParams.get('limit')
      ? parseInt(searchParams.get('limit')!, 10)
      : undefined;
    const skillsParam = searchParams.get('skills');
    const skills = skillsParam
      ? skillsParam.split(',').map((s) => s.trim()).filter(Boolean)
      : undefined;

    const filters: JobFilterParams = {
      city,
      q,
      type,
      workMode,
      skills,
      limit,
    };

    const opportunities = await getVerifiedOpportunities(filters);

    return NextResponse.json({
      success: true,
      total: opportunities.length,
      opportunities,
      filtersApplied: filters,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[API /api/opportunities] Error:', err);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve verified opportunities',
        details: err?.message,
      },
      { status: 500 }
    );
  }
}
