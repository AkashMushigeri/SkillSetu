'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStudent } from '@/context/StudentContext';
import { Opportunity } from '@/types/student';
import { OpportunityCard } from '@/components/opportunities/OpportunityCard';
import { OpportunityDetailModal } from '@/components/opportunities/OpportunityDetailModal';
import { ApplyModal } from '@/components/opportunities/ApplyModal';
import {
  Bookmark,
  Sparkles,
  ArrowRight,
  FolderHeart
} from 'lucide-react';

export default function SavedOpportunitiesPage() {
  const { opportunities, savedOpportunityIds } = useStudent();
  const [activeModalOpp, setActiveModalOpp] = useState<Opportunity | null>(null);
  const [applyModalOpp, setApplyModalOpp] = useState<Opportunity | null>(null);

  const savedOpportunities = opportunities.filter((o) =>
    savedOpportunityIds.includes(o.id)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 text-xs font-semibold mb-2">
            <Bookmark className="w-3.5 h-3.5" />
            Bookmarked Opportunities
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Saved Opportunities ({savedOpportunities.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Roles and sprints you bookmarked for review and future application.
          </p>
        </div>

        <Link
          href="/student/opportunities"
          className="px-4 py-2.5 rounded-xl bg-brand-teal hover:bg-brand-dark text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Explore More Openings</span>
        </Link>
      </div>

      {/* Saved Opportunities Grid */}
      {savedOpportunities.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3 shadow-card">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">No saved opportunities yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click the bookmark icon on any internship, task, or challenge card to save it here.
          </p>
          <Link
            href="/student/opportunities"
            className="inline-block mt-2 px-4 py-2 bg-brand-teal text-white rounded-xl text-xs font-bold shadow-xs hover:bg-brand-dark"
          >
            Explore Opportunities
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedOpportunities.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              onViewDetails={(selected) => setActiveModalOpp(selected)}
              onApply={(selected) => setApplyModalOpp(selected)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {activeModalOpp && (
        <OpportunityDetailModal
          opportunity={activeModalOpp}
          onClose={() => setActiveModalOpp(null)}
          onApply={(opp) => setApplyModalOpp(opp)}
        />
      )}

      {applyModalOpp && (
        <ApplyModal
          opportunity={applyModalOpp}
          onClose={() => setApplyModalOpp(null)}
        />
      )}
    </div>
  );
}
