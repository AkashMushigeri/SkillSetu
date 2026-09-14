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
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-card hover:shadow-cardHover hover:border-slate-300 transition-all flex flex-col justify-between group">
      <div className="space-y-4">
        {/* Startup Friendly Badge Header */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {internship.isStartupFriendly && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <Award className="w-3 h-3 text-emerald-600" />
              Student-Friendly Opportunity &bull; {internship.targetAudience}
            </span>
          )}

          {internship.eligibleForConversion && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
              <TrendingUp className="w-3 h-3 text-blue-600" />
              PPO Eligible
            </span>
          )}
        </div>

        {/* Title and details */}
        <div>
          <h3 className="font-bold text-slate-900 text-lg group-hover:text-brand-teal transition-colors">
            {internship.title}
          </h3>
          <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-brand-teal" />
              {internship.location} ({internship.workMode})
            </span>
            <span>&bull;</span>
            <span className="font-mono text-emerald-700 font-bold">{internship.stipend}</span>
            <span>&bull;</span>
            <span className="text-slate-600">{internship.duration}</span>
          </p>
        </div>

        {/* Required Skills */}
        <div className="space-y-1.5 pt-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Required Skills
          </p>
          <div className="flex flex-wrap gap-1.5">
            {internship.requiredSkills.map((req, i) => (
              <span
                key={i}
                className="text-xs px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700"
              >
                {req.name}
              </span>
            ))}
          </div>
        </div>

        {/* Mentor & Learning Outcome Highlights */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Assigned Mentor:</span>
            <span className="text-slate-800 font-semibold">{internship.mentor}</span>
          </div>

          <p className="text-[11px] text-slate-600 line-clamp-2">
            {internship.description}
          </p>
        </div>
      </div>

      {/* Footer & Actions */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
        <Link
          href={`/industry/candidates?skill=${encodeURIComponent(
            internship.requiredSkills.map((s) => s.name).join(',')
          )}`}
          className="flex-1 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
        >
          <Search className="w-3.5 h-3.5 text-emerald-700" />
          <span>Find Matched Students</span>
        </Link>

        <Link
          href="/industry/applications"
          className="py-2 px-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1"
        >
          <span>Applications</span>
        </Link>
      </div>
    </div>
  );
};
