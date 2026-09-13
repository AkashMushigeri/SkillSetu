'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCollege } from '@/context/CollegeContext';
import {
  Search,
  Users,
  Cpu,
  GraduationCap,
  Briefcase,
  Trophy,
  Building2,
  ArrowRight,
  X
} from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { students, trainingPrograms, internships, placements, profile } = useCollege();
  const [query, setQuery] = useState('Python');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open triggered from layout
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  // Search Results
  const matchingStudents = q
    ? students.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.usn.toLowerCase().includes(q) ||
          s.department.toLowerCase().includes(q) ||
          s.skills.some((sk) => sk.toLowerCase().includes(q))
      )
    : [];

  const matchingTraining = q
    ? trainingPrograms.filter(
        (tp) =>
          tp.name.toLowerCase().includes(q) ||
          tp.skill.toLowerCase().includes(q) ||
          tp.description.toLowerCase().includes(q)
      )
    : [];

  const matchingInternships = q
    ? internships.filter(
        (i) =>
          i.role.toLowerCase().includes(q) ||
          i.company.toLowerCase().includes(q) ||
          i.skillsRequired.some((sk) => sk.toLowerCase().includes(q))
      )
    : [];

  const matchingPlacements = q
    ? placements.filter(
        (p) =>
          p.company.toLowerCase().includes(q) ||
          p.role.toLowerCase().includes(q) ||
          p.skillsRequired.some((sk) => sk.toLowerCase().includes(q))
      )
    : [];

  const handleNavigate = (path: string) => {
    onClose();
    router.push(path);
  };

  const totalResults =
    matchingStudents.length +
    matchingTraining.length +
    matchingInternships.length +
    matchingPlacements.length;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 animate-in fade-in">
      <div
        className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Input */}
        <div className="p-4 bg-slate-800/80 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-emerald-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search students, skills, internships, companies..."
            className="w-full bg-transparent text-white font-medium text-sm placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 bg-slate-700/60 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg"
          >
            Esc
          </button>
        </div>

        {/* Results Body */}
        <div className="p-4 overflow-y-auto space-y-5 custom-scrollbar flex-1">
          {q.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <p className="text-xs text-slate-400">Type a skill, student name, or role to search...</p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                {['Python', 'Cloud', 'Infosys', 'React', 'Aarav', 'TechNova'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-medium rounded-full border border-slate-700"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No matching records found for &quot;{query}&quot;.
            </div>
          ) : (
            <>
              {/* Training Programs */}
              {matchingTraining.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    <GraduationCap className="w-4 h-4" />
                    <span>Training Programs ({matchingTraining.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {matchingTraining.map((tp) => (
                      <div
                        key={tp.id}
                        onClick={() => handleNavigate('/college/training')}
                        className="p-3 bg-slate-800/60 hover:bg-slate-800 rounded-xl border border-slate-700/80 cursor-pointer flex items-center justify-between group"
                      >
                        <div>
                          <p className="text-xs font-bold text-white group-hover:text-emerald-300">{tp.name}</p>
                          <p className="text-[11px] text-slate-400">{tp.skill} &bull; {tp.enrolledStudents} Enrolled</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Internships */}
              {matchingInternships.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
                    <Briefcase className="w-4 h-4" />
                    <span>Internship Opportunities ({matchingInternships.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {matchingInternships.map((i) => (
                      <div
                        key={i.id}
                        onClick={() => handleNavigate('/college/internships')}
                        className="p-3 bg-slate-800/60 hover:bg-slate-800 rounded-xl border border-slate-700/80 cursor-pointer flex items-center justify-between group"
                      >
                        <div>
                          <p className="text-xs font-bold text-white group-hover:text-blue-300">{i.role} @ {i.company}</p>
                          <p className="text-[11px] text-slate-400">{i.skillsRequired.join(', ')} &bull; {i.stipend}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Students */}
              {matchingStudents.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider">
                    <Users className="w-4 h-4" />
                    <span>Students ({matchingStudents.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {matchingStudents.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => handleNavigate(`/college/students/${s.id}`)}
                        className="p-3 bg-slate-800/60 hover:bg-slate-800 rounded-xl border border-slate-700/80 cursor-pointer flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <img src={s.avatar} alt={s.name} className="w-8 h-8 rounded-lg object-cover" />
                          <div>
                            <p className="text-xs font-bold text-white group-hover:text-purple-300">{s.name} ({s.usn})</p>
                            <p className="text-[11px] text-slate-400">{s.department} &bull; {s.year} &bull; Skills: {s.skills.join(', ')}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Placement Drives */}
              {matchingPlacements.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                    <Trophy className="w-4 h-4" />
                    <span>Placement Drives ({matchingPlacements.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {matchingPlacements.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => handleNavigate('/college/placements')}
                        className="p-3 bg-slate-800/60 hover:bg-slate-800 rounded-xl border border-slate-700/80 cursor-pointer flex items-center justify-between group"
                      >
                        <div>
                          <p className="text-xs font-bold text-white group-hover:text-amber-300">{p.company} &ndash; {p.role}</p>
                          <p className="text-[11px] text-slate-400">Date: {p.date} &bull; Package: {p.packageOffer}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
