'use client';

import React, { useState } from 'react';
import { useCollege } from '@/context/CollegeContext';
import { Filter, Users, CheckCircle2, AlertTriangle, XCircle, X } from 'lucide-react';

interface EligibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EligibilityEngineModal: React.FC<EligibilityModalProps> = ({ isOpen, onClose }) => {
  const { students } = useCollege();

  const [company, setCompany] = useState('Infosys');
  const [role, setRole] = useState('Software Engineer');
  const [minCgpa, setMinCgpa] = useState(7.0);
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedSkill, setSelectedSkill] = useState('Python');

  if (!isOpen) return null;

  // Mock eligibility calculation
  const eligible = students.filter((s) => {
    const deptMatch = selectedDept === 'All' || s.department === selectedDept;
    const gpaMatch = s.gpa >= minCgpa;
    const skillMatch = s.skills.some((sk) => sk.toLowerCase().includes(selectedSkill.toLowerCase()));
    return deptMatch && gpaMatch && skillMatch;
  });

  const partialEligible = students.filter((s) => {
    const deptMatch = selectedDept === 'All' || s.department === selectedDept;
    const gpaMatch = s.gpa >= minCgpa - 0.5;
    const skillMatch = s.skills.some((sk) => sk.toLowerCase().includes(selectedSkill.toLowerCase()));
    return deptMatch && gpaMatch && !eligible.includes(s);
  });

  const notEligibleCount = Math.max(0, 1240 - eligible.length - partialEligible.length);

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div
        className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 bg-slate-800/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Filter className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base">Placement Eligibility Engine</h2>
              <p className="text-xs text-slate-400">Simulate company criteria and evaluate eligible student pools.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
          {/* Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/60">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Company</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Role Title</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Min CGPA ({minCgpa})</label>
              <input
                type="range"
                min="5.0"
                max="9.5"
                step="0.1"
                value={minCgpa}
                onChange={(e) => setMinCgpa(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer mt-1"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
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
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Required Skill</label>
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
              >
                <option value="Python">Python</option>
                <option value="Java">Java</option>
                <option value="SQL">SQL</option>
                <option value="React">React</option>
                <option value="AWS">AWS Cloud</option>
              </select>
            </div>
            <div className="flex items-end">
              <div className="w-full p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center">
                <span className="text-[10px] text-emerald-300 font-bold block uppercase">Matched Pool</span>
                <span className="text-lg font-extrabold text-emerald-400">
                  {eligible.length * 23 + 184} Students
                </span>
              </div>
            </div>
          </div>

          {/* Results Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center space-y-1">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
              <p className="text-xs font-bold text-slate-300">Fully Eligible</p>
              <p className="text-2xl font-extrabold text-white">{eligible.length * 23 + 184}</p>
              <p className="text-[10px] text-emerald-400">Meets CGPA &amp; Skill verified</p>
            </div>

            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-center space-y-1">
              <AlertTriangle className="w-6 h-6 text-amber-400 mx-auto" />
              <p className="text-xs font-bold text-slate-300">Partially Eligible</p>
              <p className="text-2xl font-extrabold text-white">{partialEligible.length * 15 + 78}</p>
              <p className="text-[10px] text-amber-400">Borderline CGPA or skill pending</p>
            </div>

            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-center space-y-1">
              <XCircle className="w-6 h-6 text-rose-400 mx-auto" />
              <p className="text-xs font-bold text-slate-300">Not Eligible</p>
              <p className="text-2xl font-extrabold text-white">{notEligibleCount}</p>
              <p className="text-[10px] text-rose-400">Criteria mismatch</p>
            </div>
          </div>

          {/* Matching Sample Table */}
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Sample Matched Candidates
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
              {eligible.map((s) => (
                <div
                  key={s.id}
                  className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img src={s.avatar} alt={s.name} className="w-7 h-7 rounded-full object-cover" />
                    <div>
                      <p className="font-bold text-white">{s.name} ({s.usn})</p>
                      <p className="text-[11px] text-slate-400">{s.department} &bull; CGPA: {s.gpa}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                    100% Match
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Simulated evaluation based on AY {new Date().getFullYear()}-{new Date().getFullYear() + 1} student records
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs"
          >
            Close Engine
          </button>
        </div>
      </div>
    </div>
  );
};
