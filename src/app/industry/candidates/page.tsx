'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useIndustry } from '@/context/IndustryContext';
import { CandidateCard } from '@/components/industry/CandidateCard';
import { CandidateTable } from '@/components/industry/CandidateTable';
import { SkillBadge } from '@/components/industry/SkillBadge';
import { calculateCandidateMatch } from '@/lib/industryMatching';
import { popularTaxonomySkills } from '@/data/industry/industrySkills';
import {
  Search,
  Filter,
  ShieldCheck,
  Sparkles,
  LayoutGrid,
  List,
  SlidersHorizontal,
  X,
  Plus,
  CheckCircle2,
  GraduationCap,
  MapPin,
  RefreshCw,
} from 'lucide-react';

function FindTalentContent() {
  const searchParams = useSearchParams();
  const { candidates, company, jobs, showToast } = useIndustry();

  // Skill query pills
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Python', 'Machine Learning', 'SQL']);
  const [skillInput, setSkillInput] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [selectedRole, setSelectedRole] = useState<string>('All');
  const [selectedCollege, setSelectedCollege] = useState<string>('All');
  const [verifiedOnly, setVerifiedOnly] = useState(true);
  const [selectedAvailability, setSelectedAvailability] = useState<string>('All');

  // Handle URL param query
  useEffect(() => {
    const skillParam = searchParams.get('skill');
    if (skillParam) {
      const skillsFromUrl = skillParam.split(',').map((s) => s.trim()).filter(Boolean);
      if (skillsFromUrl.length > 0) {
        setSelectedSkills(skillsFromUrl);
      }
    }
    const collegeParam = searchParams.get('college');
    if (collegeParam) {
      setSelectedCollege(collegeParam);
    }
  }, [searchParams]);

  const handleAddSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !selectedSkills.includes(trimmed)) {
      setSelectedSkills([...selectedSkills, trimmed]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skill));
  };

  // Dynamically calculate match score for each candidate based on selectedSkills
  const scoredCandidates = useMemo(() => {
    const reqSkills = selectedSkills.map((name) => ({
      name,
      level: 'Intermediate' as const,
      importance: 'Required' as const,
    }));

    return candidates.map((cand) => {
      const match = calculateCandidateMatch(cand, reqSkills, company.location);
      return {
        ...cand,
        calculatedMatch: match.overall,
        matchBreakdownData: match,
      };
    });
  }, [candidates, selectedSkills, company.location]);

  // Filter candidates based on controls
  const filteredCandidates = useMemo(() => {
    return scoredCandidates.filter((cand) => {
      // Text search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = cand.name.toLowerCase().includes(q);
        const matchesRole = cand.role.toLowerCase().includes(q);
        const matchesCollege = cand.college.toLowerCase().includes(q);
        const matchesSkill = cand.skills.some((s) => s.name.toLowerCase().includes(q));
        const matchesProject = cand.projects.some((p) => p.title.toLowerCase().includes(q));
        if (!matchesName && !matchesRole && !matchesCollege && !matchesSkill && !matchesProject) {
          return false;
        }
      }

      // Verified only
      if (verifiedOnly) {
        const hasVerifiedSkill = cand.skills.some((s) => s.verified);
        if (!hasVerifiedSkill) return false;
      }

      // Skill Level filter
      if (selectedLevel !== 'All') {
        const hasLevel = cand.skills.some((s) => s.level === selectedLevel);
        if (!hasLevel) return false;
      }

      // Role filter
      if (selectedRole !== 'All') {
        if (!cand.role.toLowerCase().includes(selectedRole.toLowerCase())) {
          return false;
        }
      }

      // College filter
      if (selectedCollege !== 'All') {
        if (!cand.college.toLowerCase().includes(selectedCollege.toLowerCase())) {
          return false;
        }
      }

      // Availability filter
      if (selectedAvailability !== 'All') {
        if (cand.availability !== selectedAvailability) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => (b.calculatedMatch || 0) - (a.calculatedMatch || 0));
  }, [
    scoredCandidates,
    searchQuery,
    verifiedOnly,
    selectedLevel,
    selectedRole,
    selectedCollege,
    selectedAvailability,
  ]);

  const clearFilters = () => {
    setSelectedSkills(['Python', 'Machine Learning', 'SQL']);
    setSearchQuery('');
    setSelectedLevel('All');
    setSelectedRole('All');
    setSelectedCollege('All');
    setSelectedAvailability('All');
    setVerifiedOnly(true);
    showToast('Reset talent filters to default', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Find Talent
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-700 border border-emerald-500/40">
              Skill-First Engine
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Discover students and emerging professionals based on verified skills, real projects, and code evaluation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="p-1 bg-slate-100 border border-slate-200 rounded-xl flex items-center">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'grid' ? 'bg-white text-brand-teal shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'table' ? 'bg-white text-brand-teal shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 1. Primary Feature: Skill-First Requirement Builder ("What skills do you need?") */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-teal" />
              What skills do you need?
            </h2>
            <p className="text-xs text-slate-500">
              Select or type core technical competencies to calculate real-time weighted candidate matching.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xl font-black text-brand-teal font-mono">
              {filteredCandidates.length}
            </span>
            <span className="text-xs text-slate-500 ml-1.5 font-semibold">candidates found</span>
          </div>
        </div>

        {/* Selected Skill Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {selectedSkills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold shadow-sm"
            >
              <span>{skill}</span>
              <button
                onClick={() => handleRemoveSkill(skill)}
                className="text-emerald-700 hover:text-emerald-950 p-0.5"
                title={`Remove ${skill}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}

          {/* Add custom skill input */}
          <div className="flex items-center gap-1">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill(skillInput);
                }
              }}
              placeholder="+ Add skill (e.g. Git, Docker)..."
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-teal focus:bg-white placeholder:text-slate-400 w-44"
            />
            {skillInput && (
              <button
                onClick={() => handleAddSkill(skillInput)}
                className="p-1.5 bg-brand-teal text-white rounded-xl text-xs shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
          <span className="text-[11px] font-semibold text-slate-500">Popular Tech:</span>
          {popularTaxonomySkills.slice(0, 10).map((skill) => {
            const isSelected = selectedSkills.includes(skill);
            return (
              <button
                key={skill}
                onClick={() => (isSelected ? handleRemoveSkill(skill) : handleAddSkill(skill))}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  isSelected
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold'
                    : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {isSelected ? `✓ ${skill}` : `+ ${skill}`}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-card space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* Search Query Input */}
          <div className="sm:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by candidate name, role, college, project..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-teal focus:bg-white"
            />
          </div>

          {/* Role Filter */}
          <div className="sm:col-span-2">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-brand-teal focus:bg-white cursor-pointer"
            >
              <option value="All">All Roles</option>
              <option value="AI">AI / Machine Learning</option>
              <option value="Frontend">Frontend Developer</option>
              <option value="Backend">Backend / Java</option>
              <option value="Data">Data Analytics</option>
              <option value="Cloud">Cloud &amp; DevOps</option>
              <option value="Cyber">Cybersecurity</option>
            </select>
          </div>

          {/* College Filter */}
          <div className="sm:col-span-2">
            <select
              value={selectedCollege}
              onChange={(e) => setSelectedCollege(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-brand-teal focus:bg-white cursor-pointer"
            >
              <option value="All">All Institutions</option>
              <option value="AYUSH">AYUSH Institute of Tech</option>
              <option value="RV">RV College (RVCE)</option>
              <option value="BIT">Bangalore Institute (BIT)</option>
              <option value="PES">PES University</option>
              <option value="BMS">BMS College (BMSCE)</option>
              <option value="IIIT">IIIT Bangalore</option>
            </select>
          </div>

          {/* Availability Filter */}
          <div className="sm:col-span-2">
            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-brand-teal focus:bg-white cursor-pointer"
            >
              <option value="All">All Availability</option>
              <option value="Open to Internship">Internship Only</option>
              <option value="Open to Full-Time">Full-Time Only</option>
              <option value="Available Immediately">Available Immediately</option>
            </select>
          </div>

          {/* Verified Only Switch & Reset */}
          <div className="sm:col-span-2 flex items-center justify-between sm:justify-end gap-3">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 select-none">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="w-4 h-4 accent-emerald-600 rounded"
              />
              <span className="font-semibold text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified
              </span>
            </label>

            <button
              onClick={clearFilters}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              title="Reset Filters"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Candidate Results Display */}
      {filteredCandidates.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500 space-y-3 shadow-card">
          <Sparkles className="w-10 h-10 text-emerald-600/50 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No matching candidates found</h3>
          <p className="text-xs max-w-md mx-auto leading-relaxed">
            Try adjusting your required skills, turning off "Verified Only", or expanding your search filters.
          </p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-brand-teal text-white font-bold text-xs rounded-xl shadow-md"
          >
            Clear Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCandidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              calculatedMatchScore={candidate.calculatedMatch}
            />
          ))}
        </div>
      ) : (
        <CandidateTable candidates={filteredCandidates} />
      )}
    </div>
  );
}

export default function FindTalentPage() {
  return (
    <React.Suspense
      fallback={
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500 shadow-card space-y-2">
          <div className="w-6 h-6 border-2 border-brand-emerald border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs">Loading Candidate Discovery &amp; Skill Matching...</p>
        </div>
      }
    >
      <FindTalentContent />
    </React.Suspense>
  );
}
