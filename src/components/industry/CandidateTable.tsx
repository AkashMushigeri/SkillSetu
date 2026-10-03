'use client';

import React from 'react';
import Link from 'next/link';
import { Candidate, MatchQuality } from '@/types/industry';
import { useIndustry } from '@/context/IndustryContext';
import { SkillBadge } from './SkillBadge';
import {
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface CandidateTableProps {
  candidates: Array<Candidate & { calculatedMatch?: number; qualityTier?: MatchQuality; missingSkills?: string[] }>;
  onOpenShortlistModal?: (candidate: Candidate) => void;
}

export const CandidateTable: React.FC<CandidateTableProps> = ({
  candidates,
  onOpenShortlistModal,
}) => {
  const { toggleSaveCandidate, shortlistCandidateForJob, jobs } = useIndustry();

  if (candidates.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 space-y-2 shadow-card">
        <p className="text-base font-semibold text-slate-900">No matching candidates found.</p>
        <p className="text-xs">Try adjusting your skill filters or increasing the search radius.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
              <th className="p-4">Candidate</th>
              <th className="p-4">Institution &amp; Year</th>
              <th className="p-4">Match %</th>
              <th className="p-4">Quality Tier</th>
              <th className="p-4">Verified Skills</th>
              <th className="p-4">Missing Skills</th>
              <th className="p-4">Availability</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {candidates.map((cand) => {
              const match = cand.calculatedMatch ?? cand.matchScore ?? 85;
              const isSaved = cand.savedToTalentPool;

              return (
                <tr
                  key={cand.id}
                  className="hover:bg-slate-50 transition-colors group"
                >
                  {/* Candidate info */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={cand.avatar}
                        alt={cand.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-sm"
                      />
                      <div>
                        <Link
                          href={`/industry/candidates/${cand.id}`}
                          className="font-bold text-slate-900 text-xs hover:text-brand-teal transition-colors block"
                        >
                          {cand.name}
                        </Link>
                        <span className="text-[11px] text-brand-teal font-semibold">{cand.role}</span>
                        <span className="text-[10px] text-slate-400 block">{cand.location}</span>
                      </div>
                    </div>
                  </td>

                  {/* College */}
                  <td className="p-4 text-slate-600">
                    <p className="font-semibold text-slate-900 truncate max-w-[180px]">{cand.college}</p>
                    <p className="text-[10px] text-slate-500">{cand.education.currentYear} &bull; CGPA {cand.education.cgpa}</p>
                  </td>

               {/* Match Score */}
               <td className="p-4">
                 <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200 font-mono font-extrabold text-xs text-emerald-800">
                   <Sparkles className="w-3 h-3 text-emerald-600" />
                   <span>{match}%</span>
                 </div>
               </td>

               {/* Quality Tier */}
               <td className="p-4">
                 {cand.qualityTier ? (
                   <span
                     className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${
                       cand.qualityTier === 'EXCELLENT'
                         ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                         : cand.qualityTier === 'STRONG'
                         ? 'bg-teal-100 text-teal-800 border-teal-200'
                         : cand.qualityTier === 'GOOD'
                         ? 'bg-blue-100 text-blue-800 border-blue-200'
                         : cand.qualityTier === 'FAIR'
                         ? 'bg-amber-100 text-amber-800 border-amber-200'
                         : 'bg-rose-100 text-rose-800 border-rose-200'
                     }`}
                   >
                     {cand.qualityTier}
                   </span>
                 ) : (
                   <span className="text-[10px] text-slate-400">—</span>
                 )}
               </td>

               {/* Skills */}
               <td className="p-4">
                 <div className="flex flex-wrap gap-1 max-w-xs">
                   {cand.skills.slice(0, 3).map((s, idx) => (
                     <SkillBadge key={idx} skill={s} size="sm" showDetails={false} />
                   ))}
                   {cand.skills.length > 3 && (
                     <span className="text-[10px] text-slate-500 self-center">
                       +{cand.skills.length - 3}
                     </span>
                   )}
                 </div>
               </td>

               {/* Missing Skills */}
               <td className="p-4">
                 <div className="flex flex-wrap gap-1 max-w-[180px]">
                   {cand.missingSkills && cand.missingSkills.length > 0 ? (
                     cand.missingSkills.slice(0, 3).map((skill, idx) => (
                       <span
                         key={idx}
                         className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 text-[9px]"
                       >
                         {skill}
                       </span>
                     ))
                   ) : (
                     <span className="text-[10px] text-slate-400">None</span>
                   )}
                 </div>
               </td>

                {/* Availability */}
                <td className="p-4">
                  <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {cand.availability}
                  </span>
                </td>

                {/* Actions */}
                <td className="p-4 text-right">
                  <div className="inline-flex items-center gap-1.5">
                    <button
                        onClick={() => {
                          if (onOpenShortlistModal) {
                            onOpenShortlistModal(cand);
                          } else {
                            const targetJob = jobs[0];
                            shortlistCandidateForJob(cand.id, targetJob.id, targetJob.title, 'Job');
                          }
                        }}
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold rounded-lg text-[11px] transition-colors"
                      >
                        Shortlist
                      </button>

                      <Link
                        href={`/industry/candidates/${cand.id}`}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-slate-600 hover:text-slate-900 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
