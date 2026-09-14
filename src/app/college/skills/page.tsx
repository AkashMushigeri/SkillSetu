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
    <div className="space-y-6 animate-in fade-in text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-6 h-6 text-emerald-600" />
            <h1 className="text-2xl font-extrabold text-slate-900">Skill Ecosystem</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track student proficiency, verification rates, and industry demand across Basic, Intermediate, and Advanced skill tiers.
          </p>
        </div>

        <button
          onClick={() => handleOpenTraining('Cloud Architecture (AWS / Azure)')}
          className="px-4 py-2.5 bg-gradient-to-r from-brand-emerald to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create Training Program</span>
        </button>
      </div>

      {/* Toolbar & Category Tabs */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Tier Tabs */}
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            {(['ALL', 'BASIC', 'INTERMEDIATE', 'ADVANCED'] as const).map((tier) => (
              <button
                key={tier}
                onClick={() => setActiveTier(tier)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTier === tier
                    ? 'bg-brand-emerald text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>

          {/* Search Field */}
          <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skills..."
              className="w-full bg-transparent text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Skill Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSkills.map((sk) => (
          <div
            key={sk.id}
            className={`p-6 bg-white border rounded-3xl shadow-card hover:shadow-cardHover space-y-4 flex flex-col justify-between transition-all hover:scale-[1.01] ${
              sk.isHighGap ? 'border-amber-300 ring-1 ring-amber-200' : 'border-slate-200'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                    sk.tier === 'BASIC'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : sk.tier === 'INTERMEDIATE'
                      ? 'bg-blue-50 text-blue-800 border border-blue-200'
                      : 'bg-purple-50 text-purple-800 border border-purple-200'
                  }`}
                >
                  {sk.tier}
                </span>
                {sk.isHighGap && (
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-amber-600" /> High Skill Gap
                  </span>
                )}
              </div>

              <h3 className="font-bold text-slate-900 text-lg mt-2">{sk.name}</h3>
              <p className="text-xs text-slate-500">{sk.category}</p>

              <div className="grid grid-cols-2 gap-3 pt-4 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 text-[10px] block font-medium">Students Enrolled</span>
                  <span className="font-bold text-slate-900 text-sm">{sk.studentCount.toLocaleString()}</span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 text-[10px] block font-medium">Verification Rate</span>
                  <span className="font-bold text-emerald-700 text-sm">{sk.verificationRate}%</span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 text-[10px] block font-medium">Avg Test Score</span>
                  <span className="font-bold text-blue-700 text-sm">{sk.avgAssessmentScore}%</span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 text-[10px] block font-medium">Industry Demand</span>
                  <span className="font-bold text-purple-700 text-sm">{sk.industryDemand.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-semibold">
                Gap:{' '}
                <strong className={sk.skillGap < 0 ? 'text-amber-700 font-mono' : 'text-emerald-700 font-mono'}>
                  {sk.skillGap}
                </strong>
              </span>
              <button
                onClick={() => handleOpenTraining(sk.name)}
                className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-xl text-xs border border-emerald-200 transition-colors"
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
