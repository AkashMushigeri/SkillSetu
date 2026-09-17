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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-brand-dark via-brand-teal to-teal-900 text-white rounded-3xl p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-extrabold text-white">Training Programs</h1>
          </div>
          <p className="text-xs text-teal-100 mt-1">
            Design and deploy skill development initiatives aligned with industry demand and skill gap analysis.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-brand-emerald to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all"
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
            className="p-6 bg-white border border-slate-200 rounded-3xl shadow-card hover:shadow-cardHover space-y-4 flex flex-col justify-between transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                    program.status === 'Active'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : program.status === 'Completed'
                      ? 'bg-blue-50 text-blue-800 border-blue-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  {program.status}
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">
                  Level: {program.skillLevel}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-base leading-snug">{program.name}</h3>
                <p className="text-xs text-emerald-700 font-semibold mt-0.5">Skill: {program.skill}</p>
                <p className="text-xs text-slate-600 mt-2 line-clamp-2">{program.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-slate-500 text-[10px] block">Enrolled Students</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {program.enrolledStudents} / {program.maxStudents}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 text-[10px] block">Completion Rate</span>
                  <span className="font-bold text-emerald-700 text-sm">{program.completionRate}%</span>
                </div>

                <div>
                  <span className="text-slate-500 text-[10px] block">Avg Assessment Score</span>
                  <span className="font-bold text-blue-700 text-sm">{program.avgScore}%</span>
                </div>

                <div>
                  <span className="text-slate-500 text-[10px] block">Industry Partner</span>
                  <span className="font-bold text-purple-700 text-xs truncate block">
                    {program.industryPartner || 'Internal'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
              <button
                onClick={() => showToast(`Viewing details for ${program.name}`, 'info')}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center gap-1 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" /> View
              </button>
              <button
                onClick={() => showToast(`Enrolled 248 students into ${program.name}`, 'success')}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-200 transition-colors"
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
