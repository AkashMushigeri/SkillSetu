'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useIndustry } from '@/context/IndustryContext';
import {
  Search,
  X,
  User,
  Briefcase,
  GraduationCap,
  School,
  Trophy,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalIndustrySearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { candidates, jobs, internships, colleges, challenges } = useIndustry();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle or open
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const filteredCandidates = q
    ? candidates.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.role.toLowerCase().includes(q) ||
          c.college.toLowerCase().includes(q) ||
          c.skills.some((s) => s.name.toLowerCase().includes(q))
      )
    : [];

  const filteredJobs = q
    ? jobs.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.department.toLowerCase().includes(q) ||
          j.requiredSkills.some((s) => s.name.toLowerCase().includes(q))
      )
    : [];

  const filteredColleges = q
    ? colleges.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q) ||
          c.topSkills.some((s) => s.toLowerCase().includes(q))
      )
    : [];

  const filteredChallenges = q
    ? challenges.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.requiredSkills.some((s) => s.toLowerCase().includes(q))
      )
    : [];

  const hasResults =
    filteredCandidates.length > 0 ||
    filteredJobs.length > 0 ||
    filteredColleges.length > 0 ||
    filteredChallenges.length > 0;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-start justify-center p-4 pt-16 sm:pt-24">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Search input header */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-emerald-600 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search verified skills (e.g. Python, SQL), candidates, jobs, colleges..."
            className="w-full bg-transparent border-none text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search results body */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4 text-xs">
          {!q && (
            <div className="py-8 text-center text-slate-500 space-y-2">
              <Sparkles className="w-8 h-8 text-emerald-500/70 mx-auto" />
              <p className="font-semibold text-slate-800">Search Across All SKILLSETU Industry Entities</p>
              <p className="text-[11px] text-slate-500">Type a skill like "Python", role like "AIML", or college name to begin.</p>
            </div>
          )}

          {q && !hasResults && (
            <div className="py-8 text-center text-slate-500">
              No results matching "<span className="text-slate-900 font-semibold">{query}</span>"
            </div>
          )}

          {filteredCandidates.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Candidates ({filteredCandidates.length})</p>
              {filteredCandidates.slice(0, 4).map((c) => (
                <Link
                  key={c.id}
                  href={`/industry/candidates/${c.id}`}
                  onClick={onClose}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-200/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img src={c.avatar} alt={c.name} className="w-8 h-8 rounded-lg object-cover border border-slate-200" />
                    <div>
                      <p className="font-bold text-slate-900 text-xs">{c.name}</p>
                      <p className="text-[10px] text-slate-500">{c.role} &bull; {c.college}</p>
                    </div>
                  </div>
                  <span className="text-emerald-700 font-mono font-bold">{c.matchScore}% Match</span>
                </Link>
              ))}
            </div>
          )}

          {filteredJobs.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Jobs &amp; Roles ({filteredJobs.length})</p>
              {filteredJobs.slice(0, 3).map((j) => (
                <Link
                  key={j.id}
                  href={`/industry/jobs`}
                  onClick={onClose}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200/80 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="font-bold text-slate-900 text-xs">{j.title}</p>
                      <p className="text-[10px] text-slate-500">{j.department} &bull; {j.salaryRange}</p>
                    </div>
                  </div>
                  <span className="text-slate-500 text-[10px]">{j.applicationsCount} applicants</span>
                </Link>
              ))}
            </div>
          )}

          {filteredColleges.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-purple-700">Colleges ({filteredColleges.length})</p>
              {filteredColleges.slice(0, 3).map((col) => (
                <Link
                  key={col.id}
                  href={`/industry/colleges`}
                  onClick={onClose}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-purple-50/60 border border-slate-200/80 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <School className="w-4 h-4 text-purple-600" />
                    <div>
                      <p className="font-bold text-slate-900 text-xs">{col.name}</p>
                      <p className="text-[10px] text-slate-500">{col.studentsCount} Students &bull; {col.location}</p>
                    </div>
                  </div>
                  <span className="text-emerald-700 font-semibold text-[10px]">{col.matchingStudentsCount} matching</span>
                </Link>
              ))}
            </div>
          )}

          {filteredChallenges.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Challenges ({filteredChallenges.length})</p>
              {filteredChallenges.slice(0, 2).map((ch) => (
                <Link
                  key={ch.id}
                  href={`/industry/challenges`}
                  onClick={onClose}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-amber-50/60 border border-slate-200/80 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Trophy className="w-4 h-4 text-amber-600" />
                    <p className="font-bold text-slate-900 text-xs">{ch.title}</p>
                  </div>
                  <span className="text-slate-500 text-[10px]">{ch.participantsCount} participants</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Press ESC to close</span>
          <span className="text-emerald-700 font-semibold">SKILLSETU Intelligent Search</span>
        </div>
      </div>
    </div>
  );
};
