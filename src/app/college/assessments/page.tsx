'use client';

import React, { useState } from 'react';
import { useCollege } from '@/context/CollegeContext';
import { BadgeCheck, Award, CheckCircle2, Search, Filter, BookOpen, Sparkles } from 'lucide-react';
import { MOCK_ASSESSMENTS } from '@/data/collegeData';

export default function AssessmentsPage() {
  const { showToast } = useCollege();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');

  const filteredAssessments = MOCK_ASSESSMENTS.filter((a) => {
    const matchesSearch =
      a.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.usn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.skill.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'All' || a.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-brand-dark via-brand-teal to-teal-900 text-white rounded-3xl p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <BadgeCheck className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-extrabold text-white">Assessments &amp; Skill Verification</h1>
          </div>
          <p className="text-xs text-teal-100 mt-1">
            Monitor student evaluation tests, verified skill badges, and assessment performance across campus.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-card space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Total Assessments</span>
          <p className="text-2xl font-extrabold text-slate-900">4,120</p>
          <span className="text-[10px] text-slate-500">Across 6 academic departments</span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-card space-y-1">
          <span className="text-[11px] font-bold text-blue-700 uppercase">Completed Tests</span>
          <p className="text-2xl font-extrabold text-blue-700">3,850</p>
          <span className="text-[10px] text-blue-600">93.4% completion rate</span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-card space-y-1">
          <span className="text-[11px] font-bold text-emerald-700 uppercase">Passed Assessments</span>
          <p className="text-2xl font-extrabold text-emerald-700">3,240</p>
          <span className="text-[10px] text-emerald-600">84.1% pass percentage</span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-card space-y-1">
          <span className="text-[11px] font-bold text-purple-700 uppercase">Verified Skill Badges</span>
          <p className="text-2xl font-extrabold text-purple-700">1,742</p>
          <span className="text-[10px] text-purple-600">Issued by AYUSH Institute Cell</span>
        </div>
      </div>

      {/* Assessment Records Table */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-300 w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search student, USN or skill..."
              className="w-full bg-transparent text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
            />
          </div>

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-slate-50 border border-slate-300 text-xs text-slate-700 rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
          >
            <option value="All">All Departments</option>
            <option value="CSE">CSE</option>
            <option value="AIML">AIML</option>
            <option value="ECE">ECE</option>
            <option value="EEE">EEE</option>
            <option value="Mechanical">Mechanical</option>
            <option value="Civil">Civil</option>
          </select>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <th className="py-3 px-3">Student Name</th>
                <th className="py-3 px-3">USN &amp; Dept</th>
                <th className="py-3 px-3">Skill &amp; Level</th>
                <th className="py-3 px-3">Score</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Verification Badge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredAssessments.map((asm) => (
                <tr key={asm.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-900">{asm.studentName}</td>
                  <td className="py-3 px-3">
                    <span className="font-mono text-slate-700">{asm.usn}</span>
                    <span className="text-[10px] text-slate-500 block">{asm.department}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-800">{asm.skill}</span>
                    <span className="text-[10px] text-slate-500 block">{asm.level}</span>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-emerald-700 text-sm">
                    {asm.score}%
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[10px]">
                      {asm.status}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-bold text-[10px]">
                      <Award className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{asm.badgeIssued}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
