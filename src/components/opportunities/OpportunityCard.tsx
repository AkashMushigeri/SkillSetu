'use client';

import React from 'react';
import { Opportunity } from '@/types/student';
import { useStudent } from '@/context/StudentContext';
import { getOpportunityTypeBadgeColor } from '@/lib/styleUtils';
import {
  MapPin,
  Bookmark,
  Sparkles,
  ArrowRight,
  Clock,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onViewDetails: (opp: Opportunity) => void;
  onApply: (opp: Opportunity) => void;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  onViewDetails,
  onApply,
}) => {
  const { toggleSaveOpportunity, isOpportunitySaved, skills } = useStudent();
  const saved = isOpportunitySaved(opportunity.id);
  const typeStyle = getOpportunityTypeBadgeColor(opportunity.type);

  // Check if student has verified skills matching this opportunity
  const verifiedMatchedSkills = (opportunity.matchedSkills || []).filter((sName) => {
    const s = skills.find((sk) => sk.name.toLowerCase() === sName.toLowerCase());
    return s?.isVerified;
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-card hover:shadow-cardHover hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between group">
      <div>
        {/* Top Header: Category Badge & Save Button */}
        <div className="flex items-center justify-between mb-2.5">
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-bold border ${typeStyle.bg} ${typeStyle.text} ${typeStyle.border}`}
          >
            {opportunity.type}
          </span>

          <div className="flex items-center gap-1.5">
            {(opportunity.verified ?? true) && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                Verified
              </span>
            )}
            {opportunity.isStartup && (
              <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[10px] font-bold">
                Startup
              </span>
            )}
            <button
              type="button"
              onClick={() => toggleSaveOpportunity(opportunity.id)}
              className={`p-1.5 rounded-lg border transition-colors ${
                saved
                  ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400'
                  : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
              title={saved ? 'Saved' : 'Save opportunity'}
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title & Company */}
        <h3
          onClick={() => onViewDetails(opportunity)}
          className="font-bold text-base text-slate-900 dark:text-white group-hover:text-brand-teal transition-colors cursor-pointer line-clamp-1"
        >
          {opportunity.title}
        </h3>
        <div className="flex items-center justify-between mt-0.5 gap-2">
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">{opportunity.company}</p>
          {opportunity.source && (
            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-md truncate max-w-[200px]" title={`Source: ${opportunity.source}`}>
              Source: {opportunity.source}
            </span>
          )}
        </div>

        {/* Location, Distance, and Work Mode */}
        <div className="mt-2.5 flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <strong className="text-slate-700 dark:text-slate-200">{opportunity.distanceKm} km</strong> &bull; {opportunity.city}
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-medium">
            {opportunity.workMode}
          </span>
          <span className="flex items-center gap-1 text-[11px]">
            <Clock className="w-3 h-3 text-slate-400" />
            {opportunity.duration}
          </span>
        </div>

        {/* Compensation */}
        <div className="mt-2 text-xs">
          <span className="font-extrabold text-slate-900 dark:text-white text-sm">{opportunity.stipend}</span>
        </div>

        {/* Skill Match Breakdown */}
        <div className="mt-3.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
              <Sparkles className="w-3.5 h-3.5 text-brand-teal" />
              <span>Skill Match:</span>
            </div>
            <span
              className={`font-black text-xs px-2 py-0.5 rounded-full ${
                (opportunity.matchScore || 0) >= 80
                  ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300'
                  : 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300'
              }`}
            >
              {opportunity.matchScore}% Match
            </span>
          </div>

          {/* Matched & Missing Skills tags */}
          <div className="mt-2 flex flex-wrap gap-1 items-center">
            {(opportunity.matchedSkills || []).map((sk) => {
              const isVer = verifiedMatchedSkills.includes(sk);
              return (
                <span
                  key={sk}
                  className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-medium ${
                    isVer
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-bold'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  {sk} {isVer ? '✓' : ''}
                </span>
              );
            })}

            {(opportunity.missingSkills || []).slice(0, 2).map((sk) => (
              <span
                key={sk}
                className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800/60 text-slate-400 dark:text-slate-500 border border-dashed border-slate-300 dark:border-slate-700"
              >
                &cir; {sk}
              </span>
            ))}
          </div>

          {/* Dynamic Match Boost Banner */}
          {opportunity.isMatchBoosted && (
            <div className="mt-2 text-[11px] text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-1 rounded-md font-semibold flex items-center gap-1 border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Your verified Python skill improved this match!</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onViewDetails(opportunity)}
          className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-brand-teal dark:hover:text-brand-teal transition-colors"
        >
          View Details
        </button>

        <button
          type="button"
          onClick={() => onApply(opportunity)}
          className="px-3.5 py-1.5 rounded-xl bg-brand-teal hover:bg-brand-dark text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
        >
          <span>Apply</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
