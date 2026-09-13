'use client';

import React, { useState } from 'react';
import { useCollege } from '@/context/CollegeContext';
import { GraduationCap, Plus, Users, Award, Calendar, CheckCircle2, Building, Eye } from 'lucide-react';
import { CreateTrainingModal } from '@/components/college/CreateTrainingModal';

export default function TrainingProgramsPage() {
  const { trainingPrograms, showToast } = useCollege();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-extrabold text-white">Training Programs</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Design and deploy skill development initiatives aligned with industry demand and skill gap analysis.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/40"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Program</span>
        </button>
      </div>

      {/* Program Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainingPrograms.map((program) => (
          <div
            key={program.id}
            className="p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl space-y-4 flex flex-col justify-between hover:border-slate-700 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                    program.status === 'Active'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : program.status === 'Completed'
                      ? 'bg-blue-500/20 text-blue-300'
                      : 'bg-amber-500/20 text-amber-300'
                  }`}
                >
                  {program.status}
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">
                  Level: {program.skillLevel}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-white text-base leading-snug">{program.name}</h3>
                <p className="text-xs text-emerald-400 font-semibold mt-0.5">Skill: {program.skill}</p>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2">{program.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
                <div>
                  <span className="text-slate-500 text-[10px] block">Enrolled Students</span>
                  <span className="font-bold text-white text-sm">
                    {program.enrolledStudents} / {program.maxStudents}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 text-[10px] block">Completion Rate</span>
                  <span className="font-bold text-emerald-400 text-sm">{program.completionRate}%</span>
                </div>

                <div>
                  <span className="text-slate-500 text-[10px] block">Avg Assessment Score</span>
                  <span className="font-bold text-blue-400 text-sm">{program.avgScore}%</span>
                </div>

                <div>
                  <span className="text-slate-500 text-[10px] block">Industry Partner</span>
                  <span className="font-bold text-purple-400 text-xs truncate block">
                    {program.industryPartner || 'Internal'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={() => showToast(`Viewing details for ${program.name}`, 'info')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" /> View
              </button>
              <button
                onClick={() => showToast(`Enrolled 248 students into ${program.name}`, 'success')}
                className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs rounded-xl border border-emerald-500/30"
              >
                Manage Students
              </button>
            </div>
          </div>
        ))}
      </div>

      <CreateTrainingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
