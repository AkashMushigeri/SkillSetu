'use client';

import React, { useState } from 'react';
import { CandidateSkill } from '@/types/industry';
import { ShieldCheck, Check } from 'lucide-react';

interface SkillBadgeProps {
  skill: CandidateSkill;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export const SkillBadge: React.FC<SkillBadgeProps> = ({ skill, size = 'md', showDetails = true }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const isVerified = skill.verified;

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div
        className={`inline-flex items-center gap-1.5 rounded-lg font-medium transition-all cursor-default ${
          isVerified
            ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-500/20'
            : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600'
        } ${
          size === 'sm'
            ? 'px-2 py-0.5 text-[11px]'
            : size === 'lg'
            ? 'px-3 py-1.5 text-xs'
            : 'px-2.5 py-1 text-xs'
        }`}
      >
        <span>{skill.name}</span>

        {isVerified ? (
          <span className="flex items-center gap-0.5 text-emerald-400 font-bold">
            <Check className="w-3 h-3 stroke-[2.5]" />
            {skill.score && (
              <span className="text-[10px] bg-emerald-500/30 px-1 py-0.2 rounded text-emerald-200">
                {skill.score}%
              </span>
            )}
          </span>
        ) : (
          <span className="text-[10px] text-slate-500">({skill.level})</span>
        )}
      </div>

      {/* Popover tooltip with verified details */}
      {showTooltip && showDetails && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 bg-slate-900/95 border border-slate-700 rounded-xl shadow-2xl backdrop-blur-md z-30 text-left pointer-events-none">
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800">
            <span className="font-bold text-xs text-white flex items-center gap-1">
              {skill.name}
            </span>
            {isVerified ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded">
                <ShieldCheck className="w-3 h-3" /> Verified
              </span>
            ) : (
              <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                Self-Reported
              </span>
            )}
          </div>

          <div className="space-y-1 text-[11px] text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Proficiency:</span>
              <span className="font-semibold text-white">{skill.level}</span>
            </div>

            {skill.score && (
              <div className="flex justify-between">
                <span className="text-slate-400">Score:</span>
                <span className="font-bold text-emerald-400">{skill.score}%</span>
              </div>
            )}

            {skill.verificationDate && (
              <div className="flex justify-between">
                <span className="text-slate-400">Verified On:</span>
                <span>{skill.verificationDate}</span>
              </div>
            )}

            {skill.verifiedBy && (
              <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
                Issued by: <span className="text-slate-200">{skill.verifiedBy}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
