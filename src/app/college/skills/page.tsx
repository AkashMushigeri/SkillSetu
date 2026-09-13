'use client';

import React, { useState } from 'react';
import { useCollege } from '@/context/CollegeContext';
import { Cpu, AlertTriangle, Plus, Search, CheckCircle2, TrendingUp } from 'lucide-react';
import { SKILL_ECOSYSTEM_DATA } from '@/data/collegeData';
import { CreateTrainingModal } from '@/components/college/CreateTrainingModal';

export default function SkillEcosystemPage() {
  const [activeTier, setActiveTier] = useState<'ALL' | 'BASIC' | 'INTERMEDIATE' | 'ADVANCED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTrainingModalOpen, setIsTrainingModalOpen] = useState(false);
  const [selectedSkillForTraining, setSelectedSkillForTraining] = useState<string>('Cloud Architecture');

  const filteredSkills = SKILL_ECOSYSTEM_DATA.filter((sk) => {
    const matchesTier = activeTier === 'ALL' || sk.tier === activeTier;
    const matchesSearch =
      sk.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sk.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTier && matchesSearch;
  });

  const handleOpenTraining = (skillName: string) => {
    setSelectedSkillForTraining(skillName);
    setIsTrainingModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-extrabold text-white">Skill Ecosystem</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Track student proficiency, verification rates, and industry demand across Basic, Intermediate, and Advanced skill tiers.
          </p>
        </div>

        <button
          onClick={() => handleOpenTraining('Cloud Architecture (AWS / Azure)')}
          className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/40"
        >
          <Plus className="w-4 h-4" />
          <span>Create Training Program</span>
        </button>
      </div>

      {/* Toolbar & Category Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Tier Tabs */}
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            {(['ALL', 'BASIC', 'INTERMEDIATE', 'ADVANCED'] as const).map((tier) => (
              <button
                key={tier}
                onClick={() => setActiveTier(tier)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTier === tier
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>

          {/* Search Field */}
          <div className="flex items-center gap-2 bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skills..."
              className="w-full bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Skill Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSkills.map((sk) => (
          <div
            key={sk.id}
            className={`p-6 bg-slate-900 border rounded-3xl shadow-xl space-y-4 flex flex-col justify-between transition-all hover:scale-[1.01] ${
              sk.isHighGap ? 'border-amber-500/50 ring-1 ring-amber-500/30' : 'border-slate-800'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                    sk.tier === 'BASIC'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : sk.tier === 'INTERMEDIATE'
                      ? 'bg-blue-500/20 text-blue-300'
                      : 'bg-purple-500/20 text-purple-300'
                  }`}
                >
                  {sk.tier}
                </span>
                {sk.isHighGap && (
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> High Skill Gap
                  </span>
                )}
              </div>

              <h3 className="font-bold text-white text-lg mt-2">{sk.name}</h3>
              <p className="text-xs text-slate-400">{sk.category}</p>

              <div className="grid grid-cols-2 gap-3 pt-4 text-xs">
                <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
                  <span className="text-slate-400 text-[10px] block font-medium">Students Enrolled</span>
                  <span className="font-bold text-white text-sm">{sk.studentCount.toLocaleString()}</span>
                </div>

                <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
                  <span className="text-slate-400 text-[10px] block font-medium">Verification Rate</span>
                  <span className="font-bold text-emerald-400 text-sm">{sk.verificationRate}%</span>
                </div>

                <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
                  <span className="text-slate-400 text-[10px] block font-medium">Avg Test Score</span>
                  <span className="font-bold text-blue-400 text-sm">{sk.avgAssessmentScore}%</span>
                </div>

                <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
                  <span className="text-slate-400 text-[10px] block font-medium">Industry Demand</span>
                  <span className="font-bold text-purple-400 text-sm">{sk.industryDemand.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-semibold">
                Gap:{' '}
                <strong className={sk.skillGap < 0 ? 'text-amber-400 font-mono' : 'text-emerald-400 font-mono'}>
                  {sk.skillGap}
                </strong>
              </span>
              <button
                onClick={() => handleOpenTraining(sk.name)}
                className="px-3.5 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold rounded-xl text-xs border border-emerald-500/30 transition-colors"
              >
                + Launch Program
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <CreateTrainingModal
        isOpen={isTrainingModalOpen}
        onClose={() => setIsTrainingModalOpen(false)}
        presetSkill={selectedSkillForTraining}
      />
    </div>
  );
}
