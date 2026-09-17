'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useIndustry } from '@/context/IndustryContext';
import { RequiredSkill, SkillLevel, SkillImportance } from '@/types/industry';
import {
  GraduationCap,
  ArrowLeft,
  Plus,
  X,
  CheckCircle2,
  Sparkles,
  Award,
  TrendingUp,
} from 'lucide-react';

export default function CreateInternshipPage() {
  const router = useRouter();
  const { company, postNewInternship, showToast } = useIndustry();

  const [title, setTitle] = useState('AI/ML Research Intern');
  const [department, setDepartment] = useState('Artificial Intelligence');
  const [duration, setDuration] = useState('12 weeks');
  const [stipend, setStipend] = useState('₹15,000 / month');
  const [location, setLocation] = useState('Bengaluru, Karnataka');
  const [workMode, setWorkMode] = useState<'Remote' | 'Hybrid' | 'On-site'>('Hybrid');
  const [eligibility, setEligibility] = useState('3rd & 4th Year B.Tech / M.Tech AIML/CSE students');
  const [startDate, setStartDate] = useState('2026-11-01');
  const [deadline, setDeadline] = useState('2026-10-25');
  const [mentor, setMentor] = useState('Dr. Srinivas Murthy (Principal AI Researcher)');
  const [openings, setOpenings] = useState(5);
  const [isStartupFriendly, setIsStartupFriendly] = useState(true);
  const [targetAudience, setTargetAudience] = useState('Designed for 3rd-year students');
  const [eligibleForConversion, setEligibleForConversion] = useState(true);
  const [description, setDescription] = useState(
    'Work alongside senior deep learning engineers to build predictive AI healthcare pipelines and evaluate transformer architectures.'
  );

  const [requiredSkills, setRequiredSkills] = useState<RequiredSkill[]>([
    { name: 'Python', level: 'Intermediate', importance: 'Required' },
    { name: 'Machine Learning', level: 'Intermediate', importance: 'Required' },
    { name: 'SQL', level: 'Basic', importance: 'Required' },
    { name: 'Git', level: 'Basic', importance: 'Preferred' },
  ]);

  const [newSkillName, setNewSkillName] = useState('');

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    setRequiredSkills([
      ...requiredSkills,
      { name: newSkillName.trim(), level: 'Intermediate', importance: 'Required' },
    ]);
    setNewSkillName('');
  };

  const handleRemoveSkill = (name: string) => {
    setRequiredSkills(requiredSkills.filter((s) => s.name !== name));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    postNewInternship({
      title,
      company: company.name,
      department,
      location,
      workMode,
      duration,
      stipend,
      eligibility,
      startDate,
      applicationDeadline: deadline,
      requiredSkills,
      description,
      learningOutcomes: [
        'Hands-on PyTorch inference optimization and FastAPI deployment',
        'Direct mentor code reviews and PPO interview fast-tracking',
      ],
      mentor,
      openings,
      isStartupFriendly,
      targetAudience,
      eligibleForConversion,
      status: 'Active',
    });

    router.push('/industry/internships');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Internships</span>
      </button>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-card space-y-6 text-slate-900">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-600" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">Create New Internship</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Publish structured startup micro-internships and skill-building opportunities for college students.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* Title & Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">Internship Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-emerald-500 shadow-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-emerald-500 shadow-xs"
              />
            </div>
          </div>

          {/* Duration, Stipend, Mode, Openings */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">Duration</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 12 weeks"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-emerald-500 shadow-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">Monthly Stipend</label>
              <input
                type="text"
                value={stipend}
                onChange={(e) => setStipend(e.target.value)}
                placeholder="e.g. ₹15,000 / month"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-emerald-500 shadow-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">Work Mode</label>
              <select
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-emerald-500 shadow-xs"
              >
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">Openings</label>
              <input
                type="number"
                min={1}
                value={openings}
                onChange={(e) => setOpenings(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-emerald-500 shadow-xs"
              />
            </div>
          </div>

          {/* Startup Priority & PPO Conversion Checkboxes */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isStartupFriendly}
                onChange={(e) => setIsStartupFriendly(e.target.checked)}
                className="w-4 h-4 accent-emerald-600 rounded"
              />
              <div>
                <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  Mark as "Student-Friendly Opportunity" (Startup Experience Priority)
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Enables 3rd-year engineering students to gain startup mentorship before big tech placement drives.
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer pt-2 border-t border-slate-200">
              <input
                type="checkbox"
                checked={eligibleForConversion}
                onChange={(e) => setEligibleForConversion(e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded"
              />
              <div>
                <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                  Eligible for Pre-Placement Offer (PPO) Full-Time Conversion
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Top performing interns will be evaluated for direct full-time engineering conversions.
                </span>
              </div>
            </label>
          </div>

          {/* Mentor & Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">Assigned Mentor</label>
              <input
                type="text"
                value={mentor}
                onChange={(e) => setMentor(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-emerald-500 shadow-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-emerald-500 shadow-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-emerald-500 shadow-xs"
              />
            </div>
          </div>

          {/* Required Skills */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
            <label className="block font-bold text-slate-900 text-xs">Required Verified Skills</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                placeholder="Add required skill (e.g. Python, SQL)..."
                className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-emerald-500 shadow-xs"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 bg-gradient-to-r from-brand-emerald to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {requiredSkills.map((s, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs shadow-xs font-medium"
                >
                  <span>{s.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(s.name)}
                    className="text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">Internship Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-emerald-500 shadow-xs"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-emerald to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold shadow-md flex items-center gap-2 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Create Internship</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
