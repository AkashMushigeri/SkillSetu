'use client';

import React, { useState } from 'react';
import { useCollege } from '@/context/CollegeContext';
import { Sparkles, GraduationCap, X, CheckCircle2 } from 'lucide-react';

interface CreateTrainingProps {
  isOpen: boolean;
  onClose: () => void;
  presetSkill?: string;
}

export const CreateTrainingModal: React.FC<CreateTrainingProps> = ({ isOpen, onClose, presetSkill }) => {
  const { addTrainingProgram } = useCollege();

  const [name, setName] = useState(presetSkill ? `${presetSkill} Mastery Program` : 'Cloud Computing Foundations');
  const [skill, setSkill] = useState(presetSkill || 'Cloud Architecture (AWS / Azure)');
  const [skillLevel, setSkillLevel] = useState<'Basic' | 'Intermediate' | 'Advanced'>('Advanced');
  const [description, setDescription] = useState('Hands-on cloud architecture bootcamp targeting high-demand cloud computing skills required by partner companies.');
  const [instructor, setInstructor] = useState('Dr. Priya Sharma & AWS Certified Instructors');
  const [startDate, setStartDate] = useState('2026-10-01');
  const [endDate, setEndDate] = useState('2026-12-15');
  const [maxStudents, setMaxStudents] = useState(250);
  const [learningResources, setLearningResources] = useState('AWS Academy, Hands-on Labs, College Portal Workbooks');
  const [assessmentRequired, setAssessmentRequired] = useState(true);
  const [industryPartner, setIndustryPartner] = useState('TechNova Labs');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTrainingProgram({
      name,
      skill,
      skillLevel,
      description,
      instructor,
      startDate,
      endDate,
      maxStudents: Number(maxStudents),
      learningResources: learningResources.split(',').map((r) => r.trim()),
      assessmentRequired,
      industryPartner,
      industryDemand: 1200,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div
        className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-white text-lg">Create Training Program</h2>
              <p className="text-xs text-slate-400">Launch a new skill development initiative for students.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Program Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Skill</label>
              <input
                type="text"
                required
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Skill Level</label>
              <select
                value={skillLevel}
                onChange={(e) => setSkillLevel(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Basic">Basic</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Max Capacity</label>
              <input
                type="number"
                required
                value={maxStudents}
                onChange={(e) => setMaxStudents(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Industry Partner</label>
              <input
                type="text"
                value={industryPartner}
                onChange={(e) => setIndustryPartner(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Instructor</label>
              <input
                type="text"
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Learning Resources (comma separated)</label>
              <input
                type="text"
                value={learningResources}
                onChange={(e) => setLearningResources(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="asmReq"
              checked={assessmentRequired}
              onChange={(e) => setAssessmentRequired(e.target.checked)}
              className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
            />
            <label htmlFor="asmReq" className="text-xs text-slate-300 font-medium cursor-pointer">
              Mandatory Skill Assessment &amp; Verification Badge required upon completion
            </label>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-900/30"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Create Program</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
