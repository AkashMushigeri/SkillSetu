'use client';

import React from 'react';
import Link from 'next/link';
import { Candidate } from '@/types/industry';
import { useIndustry } from '@/context/IndustryContext';
import { SkillBadge } from './SkillBadge';
import {
  ExternalLink,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  MapPin,
  GraduationCap,
} from 'lucide-react';

interface CandidateTableProps {
  candidates: Candidate[];
  onOpenShortlistModal?: (candidate: Candidate) => void;
}

export const CandidateTable: React.FC<CandidateTableProps> = ({
  candidates,
  onOpenShortlistModal,
}) => {
  const { toggleSaveCandidate, shortlistCandidateForJob, jobs } = useIndustry();

  if (candidates.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-2">
        <p className="text-base font-semibold text-white">No matching candidates found.</p>
        <p className="text-xs">Try adjusting your skill filters or increasing the search radius.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
              <th className="p-4">Candidate</th>
              <th className="p-4">Institution &amp; Year</th>
              <th className="p-4">Match %</th>
              <th className="p-4">Verified Skills</th>
              <th className="p-4">Availability</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {candidates.map((cand) => {
              const match = cand.matchScore || 85;
              const isSaved = cand.savedToTalentPool;

              return (
                <tr
                  key={cand.id}
                  className="hover:bg-slate-850/50 transition-colors group"
                >
                  {/* Candidate info */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={cand.avatar}
                        alt={cand.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-700 shadow-sm"
                      />
                      <div>
                        <Link
                          href={`/industry/candidates/${cand.id}`}
                          className="font-bold text-white text-xs hover:text-emerald-400 transition-colors block"
                        >
                          {cand.name}
                        </Link>
                        <span className="text-[11px] text-emerald-400">{cand.role}</span>
                        <span className="text-[10px] text-slate-500 block">{cand.location}</span>
                      </div>
                    </div>
                  </td>

                  {/* College */}
                  <td className="p-4 text-slate-300">
                    <p className="font-semibold text-white truncate max-w-[180px]">{cand.college}</p>
                    <p className="text-[10px] text-slate-400">{cand.education.currentYear} &bull; CGPA {cand.education.cgpa}</p>
                  </td>

                  {/* Match Score */}
                  <td className="p-4">
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 font-mono font-extrabold text-xs text-emerald-400">
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      <span>{match}%</span>
                    </div>
                  </td>

                  {/* Skills */}
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {cand.skills.slice(0, 3).map((s, idx) => (
                        <SkillBadge key={idx} skill={s} size="sm" />
                      ))}
                      {cand.skills.length > 3 && (
                        <span className="text-[10px] text-slate-500 self-center">
                          +{cand.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Availability */}
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {cand.availability}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleSaveCandidate(cand.id)}
                        className={`p-1.5 rounded-lg border text-xs transition-colors ${
                          isSaved
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                        }`}
                        title={isSaved ? 'Saved in Talent Pool' : 'Save to Talent Pool'}
                      >
                        {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => {
                          if (onOpenShortlistModal) onOpenShortlistModal(cand);
                          else shortlistCandidateForJob(cand.id, jobs[0].id, jobs[0].title);
                        }}
                        className="px-2.5 py-1 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-semibold rounded-lg text-[11px] transition-all"
                      >
                        Shortlist
                      </button>

                      <Link
                        href={`/industry/candidates/${cand.id}`}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors"
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
