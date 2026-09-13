'use client';

import React from 'react';
import Link from 'next/link';
import { Opportunity } from '@/types/student';
import { useStudent } from '@/context/StudentContext';
import { getOpportunityTypeBadgeColor } from '@/lib/styleUtils';
import {
  X,
  MapPin,
  Clock,
  Briefcase,
  Bookmark,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  Award,
  CircleAlert
} from 'lucide-react';

interface OpportunityDetailModalProps {
  opportunity: Opportunity | null;
  onClose: () => void;
  onApply: (opp: Opportunity) => void;
}

export const OpportunityDetailModal: React.FC<OpportunityDetailModalProps> = ({
  opportunity,
  onClose,
  onApply,
}) => {
  const { toggleSaveOpportunity, isOpportunitySaved, skills } = useStudent();

  if (!opportunity) return null;

  const saved = isOpportunitySaved(opportunity.id);
  const typeColors = getOpportunityTypeBadgeColor(opportunity.type);

  // Identify verified skills among matched
  const verifiedMatchedSkills = (opportunity.matchedSkills || []).filter((sName) => {
    const s = skills.find((sk) => sk.name.toLowerCase() === sName.toLowerCase());
    return s?.isVerified;
  });

  const firstMissingSkill = opportunity.missingSkills?.[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col justify-between">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${typeColors.bg} ${typeColors.text} ${typeColors.border}`}
              >
                {opportunity.type}
              </span>
              {opportunity.isStartup && (
                <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
                  Startup
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
              {opportunity.title}
            </h2>
            <div className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-brand-teal" />
              {opportunity.company}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Key Quick Info Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Distance</span>
              <strong className="text-slate-800 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-brand-teal" />
                {opportunity.distanceKm} km away
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Work Mode</span>
              <strong className="text-slate-800 mt-0.5 block">{opportunity.workMode}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Duration</span>
              <strong className="text-slate-800 mt-0.5 block">{opportunity.duration}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Compensation</span>
              <strong className="text-emerald-700 mt-0.5 block font-bold">{opportunity.stipend}</strong>
            </div>
          </div>

          {/* Skill Match Section (Highlighted Feature) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-50/60 to-teal-50/60 border border-emerald-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Your Skill Match</h4>
                  <p className="text-[11px] text-slate-500">
                    Calculated from your verified competencies and experience
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-emerald-700">
                  {opportunity.matchScore}%
                </span>
              </div>
            </div>

            {/* Dynamic Match Boost Banner if applicable */}
            {opportunity.isMatchBoosted && (
              <div className="mb-3 p-2 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-semibold flex items-center gap-2 border border-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Your verified Python skill improved this match score!</span>
              </div>
            )}

            {/* Matched & Missing Skills comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-emerald-200/70">
              <div>
                <span className="text-slate-500 font-semibold block mb-1.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Matched Skills:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(opportunity.matchedSkills || []).map((sk) => {
                    const isVer = verifiedMatchedSkills.includes(sk);
                    return (
                      <span
                        key={sk}
                        className={`px-2 py-1 rounded-md text-xs font-semibold ${
                          isVer
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        ✓ {sk} {isVer ? '(Verified)' : ''}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div>
                <span className="text-slate-500 font-semibold block mb-1.5 flex items-center gap-1">
                  <CircleAlert className="w-3.5 h-3.5 text-amber-600" />
                  Missing Skills:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(opportunity.missingSkills || []).length > 0 ? (
                    opportunity.missingSkills?.map((sk) => (
                      <span
                        key={sk}
                        className="px-2 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200"
                      >
                        &cir; {sk}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-500 italic">None! Full match!</span>
                  )}
                </div>
              </div>
            </div>

            {/* Recommendation Prompt */}
            {firstMissingSkill && (
              <div className="mt-3.5 pt-3 border-t border-emerald-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <p className="text-slate-700">
                  You are missing <strong>{firstMissingSkill}</strong>. Learn {firstMissingSkill} to improve your match.
                </p>
                <Link
                  href="/student/skills"
                  onClick={onClose}
                  className="font-bold text-brand-teal hover:underline flex items-center gap-1 shrink-0"
                >
                  Explore Skill &rarr;
                </Link>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="font-bold text-sm text-slate-900">About the Opportunity</h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {opportunity.description}
            </p>
          </div>

          {/* Responsibilities */}
          {opportunity.responsibilities && opportunity.responsibilities.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-bold text-sm text-slate-900">Key Responsibilities</h4>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {opportunity.responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-brand-teal mt-0.5">&bull;</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Perks & Benefits */}
          {opportunity.perks && opportunity.perks.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-bold text-sm text-slate-900">Perks &amp; Highlights</h4>
              <div className="flex flex-wrap gap-2">
                {opportunity.perks.map((p, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium"
                  >
                    ★ {p}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/80 rounded-b-3xl flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => toggleSaveOpportunity(opportunity.id)}
            className={`px-4 py-2.5 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition-colors ${
              saved
                ? 'bg-amber-50 border-amber-300 text-amber-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
            <span>{saved ? 'Saved' : 'Save Opportunity'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 text-xs font-semibold"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onApply(opportunity);
              }}
              className="px-5 py-2.5 rounded-xl bg-brand-teal hover:bg-brand-dark text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <span>Apply Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
