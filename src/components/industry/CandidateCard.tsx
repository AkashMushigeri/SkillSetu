'use client';

import React from 'react';
import Link from 'next/link';
import { Candidate } from '@/types/industry';
import { useIndustry } from '@/context/IndustryContext';
import { SkillBadge } from './SkillBadge';
import {
  MapPin,
  GraduationCap,
  Bookmark,
  BookmarkCheck,
  Briefcase,
  ExternalLink,
  CheckCircle2,
  FolderGit2,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface CandidateCardProps {
  candidate: Candidate;
  onOpenShortlistModal?: (candidate: Candidate) => void;
  calculatedMatchScore?: number;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  onOpenShortlistModal,
  calculatedMatchScore,
}) => {
  const { toggleSaveCandidate, shortlistCandidateForJob, jobs } = useIndustry();

  const match = calculatedMatchScore !== undefined ? calculatedMatchScore : candidate.matchScore || 88;
  const isSaved = candidate.savedToTalentPool;

  const handleQuickShortlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onOpenShortlistModal) {
      onOpenShortlistModal(candidate);
    } else {
      // Shortlist for primary active job
      const targetJob = jobs[0];
      shortlistCandidateForJob(candidate.id, targetJob.id, targetJob.title, 'Job');
    }
  };

  const handleToggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSaveCandidate(candidate.id, 'Saved Candidates');
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl hover:shadow-2xl hover:border-slate-700 transition-all duration-300 flex flex-col justify-between group">
      {/* Top Bar: Avatar, Info, Match Score, Bookmark */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="relative">
              <img
                src={candidate.avatar}
                alt={candidate.name}
                className="w-13 h-13 rounded-2xl object-cover border border-slate-700 shadow-md group-hover:scale-105 transition-transform"
              />
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900" />
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Link
                  href={`/industry/candidates/${candidate.id}`}
                  className="font-bold text-white text-base hover:text-emerald-400 transition-colors"
                >
                  {candidate.name}
                </Link>
              </div>

              <p className="text-xs text-emerald-400 font-medium">{candidate.role}</p>

              <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate max-w-[200px]">{candidate.college}</span>
              </p>

              <p className="text-[10px] text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                <span>{candidate.location}</span> &bull; <span>Class of {candidate.education.graduationYear}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            {/* Match Percentage Badge */}
            <div
              className={`px-2.5 py-1 rounded-xl text-center border font-mono shadow-sm ${
                match >= 85
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/40 ring-1 ring-emerald-500/20'
                  : match >= 70
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/40 ring-1 ring-amber-500/20'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              <div className="text-sm font-extrabold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>{match}%</span>
              </div>
              <div className="text-[9px] uppercase font-bold tracking-wider text-slate-400">
                {match >= 85 ? 'Strong Match' : match >= 70 ? 'Good Match' : 'Potential'}
              </div>
            </div>

            {/* Save to Talent Pool */}
            <button
              onClick={handleToggleSave}
              className={`p-1.5 rounded-lg border text-xs transition-colors ${
                isSaved
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                  : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
              }`}
              title={isSaved ? 'Saved in Talent Pool' : 'Save to Talent Pool'}
            >
              {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Verified Skills */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[10px] text-slate-400">
              Verified &amp; Key Skills
            </span>
            <span className="text-[10px] text-emerald-400">
              {candidate.skills.filter((s) => s.verified).length} Verified
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {candidate.skills.slice(0, 5).map((skill, idx) => (
              <SkillBadge key={idx} skill={skill} size="sm" />
            ))}
            {candidate.skills.length > 5 && (
              <span className="text-[10px] text-slate-400 self-center px-1">
                +{candidate.skills.length - 5} more
              </span>
            )}
          </div>
        </div>

        {/* Featured Project */}
        {candidate.projects.length > 0 && (
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200 text-[11px] flex items-center gap-1.5">
                <FolderGit2 className="w-3.5 h-3.5 text-teal-400" />
                {candidate.projects[0].title}
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                Verified Code
              </span>
            </div>
            <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
              {candidate.projects[0].description}
            </p>
          </div>
        )}
      </div>

      {/* Bottom Footer: Availability & Action Buttons */}
      <div className="mt-5 pt-3.5 border-t border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{candidate.availability}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleQuickShortlist}
            className="px-3 py-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Shortlist</span>
          </button>

          <Link
            href={`/industry/candidates/${candidate.id}`}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1"
          >
            <span>Profile</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </Link>
        </div>
      </div>
    </div>
  );
};
