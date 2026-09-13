'use client';

import React from 'react';
import Link from 'next/link';
import { IndustryInternship } from '@/types/industry';
import {
  GraduationCap,
  MapPin,
  Calendar,
  Sparkles,
  Users,
  Search,
  CheckCircle2,
  TrendingUp,
  Award,
} from 'lucide-react';

interface InternshipCardProps {
  internship: IndustryInternship;
}

export const InternshipCard: React.FC<InternshipCardProps> = ({ internship }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl hover:shadow-2xl hover:border-slate-700 transition-all flex flex-col justify-between group">
      <div className="space-y-4">
        {/* Startup Friendly Badge Header */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {internship.isStartupFriendly && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/40">
              <Award className="w-3 h-3 text-emerald-400" />
              Student-Friendly Opportunity &bull; {internship.targetAudience}
            </span>
          )}

          {internship.eligibleForConversion && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              <TrendingUp className="w-3 h-3 text-blue-400" />
              PPO Eligible
            </span>
          )}
        </div>

        {/* Title and details */}
        <div>
          <h3 className="font-bold text-white text-lg group-hover:text-emerald-400 transition-colors">
            {internship.title}
          </h3>
          <p className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-400" />
              {internship.location} ({internship.workMode})
            </span>
            <span>&bull;</span>
            <span className="font-mono text-emerald-300 font-bold">{internship.stipend}</span>
            <span>&bull;</span>
            <span className="text-slate-300">{internship.duration}</span>
          </p>
        </div>

        {/* Required Skills */}
        <div className="space-y-1.5 pt-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Required Skills
          </p>
          <div className="flex flex-wrap gap-1.5">
            {internship.requiredSkills.map((req, i) => (
              <span
                key={i}
                className="text-xs px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200"
              >
                {req.name}
              </span>
            ))}
          </div>
        </div>

        {/* Mentor & Learning Outcome Highlights */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 text-xs space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Assigned Mentor:</span>
            <span className="text-slate-200 font-semibold">{internship.mentor}</span>
          </div>

          <p className="text-[11px] text-slate-400 line-clamp-2">
            {internship.description}
          </p>
        </div>
      </div>

      {/* Footer & Actions */}
      <div className="mt-5 pt-3.5 border-t border-slate-800 flex items-center justify-between gap-2">
        <Link
          href={`/industry/candidates?skill=${encodeURIComponent(
            internship.requiredSkills.map((s) => s.name).join(',')
          )}`}
          className="flex-1 py-2 px-3 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
        >
          <Search className="w-3.5 h-3.5 text-emerald-400" />
          <span>Find Matched Students</span>
        </Link>

        <Link
          href="/industry/applications"
          className="py-2 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1"
        >
          <span>Applications</span>
        </Link>
      </div>
    </div>
  );
};
