'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useIndustry } from '@/context/IndustryContext';
import { RequiredSkill, SkillLevel, SkillImportance } from '@/types/industry';
import { popularTaxonomySkills } from '@/data/industry/industrySkills';
import {
  Briefcase,
  ArrowLeft,
  Plus,
  X,
  CheckCircle2,
  Sparkles,
  MapPin,
  Eye,
  Sliders,
  Calendar,
} from 'lucide-react';

export default function CreateJobPage() {
  const router = useRouter();
  const { company, postNewJob, showToast } = useIndustry();

  // Job Details State
  const [title, setTitle] = useState('AI/ML Engineer');
  const [department, setDepartment] = useState('Artificial Intelligence');
  const [location, setLocation] = useState('Bengaluru, Karnataka');
  const [workMode, setWorkMode] = useState<'Remote' | 'Hybrid' | 'On-site'>('Hybrid');
  const [jobType, setJobType] = useState<'Full Time' | 'Part Time' | 'Contract'>('Full Time');
  const [salaryRange, setSalaryRange] = useState('₹8–14 LPA');
  const [experienceRequired, setExperienceRequired] = useState('0–2 Years');
  const [education, setEducation] = useState('B.Tech / M.Tech in AIML, CSE, or Data Science');
  const [graduationYear, setGraduationYear] = useState('2024 / 2025 / 2026');
  const [minimumCgpa, setMinimumCgpa] = useState<number>(7.5);
  const [openings, setOpenings] = useState<number>(3);
  const [deadline, setDeadline] = useState('2026-11-30');
  const [description, setDescription] = useState(
    'We are seeking an enthusiastic AI/ML Engineer to train transformer architectures and build scalable machine learning deployment pipelines.'
  );

  // Required Skills Builder State
  const [requiredSkills, setRequiredSkills] = useState<RequiredSkill[]>([
    { name: 'Python', level: 'Intermediate', importance: 'Required', minScore: 80 },
    { name: 'Machine Learning', level: 'Intermediate', importance: 'Required', minScore: 80 },
    { name: 'SQL', level: 'Intermediate', importance: 'Required', minScore: 75 },
    { name: 'Git', level: 'Basic', importance: 'Preferred', minScore: 70 },
  ]);

  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<SkillLevel>('Intermediate');
  const [newSkillImportance, setNewSkillImportance] = useState<SkillImportance>('Required');

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    if (requiredSkills.some((s) => s.name.toLowerCase() === newSkillName.trim().toLowerCase())) {
      showToast('Skill already added to list', 'warning');
      return;
    }

    setRequiredSkills([
      ...requiredSkills,
      {
        name: newSkillName.trim(),
        level: newSkillLevel,
        importance: newSkillImportance,
      },
    ]);
    setNewSkillName('');
  };

  const handleRemoveSkill = (skillNameToRemove: string) => {
    setRequiredSkills(requiredSkills.filter((s) => s.name !== skillNameToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (requiredSkills.length === 0) {
      showToast('Please add at least one required skill for candidate matching', 'error');
      return;
    }

    postNewJob({
      title,
      company: company.name,
      department,
      location,
      workMode,
      jobType,
      salaryRange,
      experienceRequired,
      education,
      graduationYear,
      minimumCgpa,
      requiredSkills,
      description,
      responsibilities: [
        'Develop and fine-tune models based on product specifications',
        'Maintain automated unit and evaluation test suites',
        'Collaborate with university researchers on domain datasets',
      ],
      qualifications: [
        `Strong proficiency in ${requiredSkills.map((s) => s.name).slice(0, 3).join(', ')}`,
        `Minimum ${minimumCgpa} CGPA across academic semesters`,
      ],
      deadline,
      openings,
      status: 'Active',
    });

    router.push('/industry/jobs');
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Jobs</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Column (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-emerald-400" />
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">Post a New Job</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Define role parameters and required verified skills for automatic candidate matching.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            {/* Title & Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Job Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g. AI/ML Engineer"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                  placeholder="e.g. Artificial Intelligence"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Type, Mode, Location */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Job Type</label>
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
                >
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Work Mode</label>
                <select
                  value={workMode}
                  onChange={(e) => setWorkMode(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
                >
                  <option value="Hybrid">Hybrid</option>
                  <option value="Remote">Remote</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Salary, Experience, Openings */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Salary Range</label>
                <input
                  type="text"
                  value={salaryRange}
                  onChange={(e) => setSalaryRange(e.target.value)}
                  placeholder="e.g. ₹8–14 LPA"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Experience</label>
                <input
                  type="text"
                  value={experienceRequired}
                  onChange={(e) => setExperienceRequired(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Openings</label>
                <input
                  type="number"
                  min={1}
                  value={openings}
                  onChange={(e) => setOpenings(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* CRITICAL FEATURE: REQUIRED SKILLS BUILDER */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-emerald-500/40 space-y-4 shadow-inner">
              <div>
                <h3 className="font-bold text-white text-xs flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  Required Skills Builder
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Specify skills, proficiency level, and priority. These drive the 100-point candidate match engine.
                </p>
              </div>

              {/* Add Skill Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
                <div className="sm:col-span-5">
                  <label className="block text-[11px] text-slate-400 mb-1">Skill Name</label>
                  <input
                    type="text"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    placeholder="e.g. Docker, React, PyTorch"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[11px] text-slate-400 mb-1">Level</label>
                  <select
                    value={newSkillLevel}
                    onChange={(e) => setNewSkillLevel(e.target.value as SkillLevel)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Basic">Basic</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] text-slate-400 mb-1">Importance</label>
                  <select
                    value={newSkillImportance}
                    onChange={(e) => setNewSkillImportance(e.target.value as SkillImportance)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Required">Required</option>
                    <option value="Preferred">Preferred</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="w-full py-2 px-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Skill Chips Display with 'x' */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Configured Skill Requirements ({requiredSkills.length})
                </span>
                <div className="flex flex-wrap gap-2">
                  {requiredSkills.map((s, idx) => (
                    <div
                      key={idx}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold ${
                        s.importance === 'Required'
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                          : 'bg-slate-900 border-slate-700 text-slate-300'
                      }`}
                    >
                      <span>{s.name}</span>
                      <span className="text-[10px] font-normal opacity-80">({s.level})</span>
                      <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-slate-950/60">
                        {s.importance}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(s.name)}
                        className="text-slate-400 hover:text-white p-0.5"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Job Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold shadow-lg shadow-emerald-950/50 flex items-center gap-2 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Publish Job Listing</span>
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview Column (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-20 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <Eye className="w-4 h-4" />
              <span>Live Recruiter &amp; Student Preview</span>
            </div>

            {/* Preview Card */}
            <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 shadow-2xl space-y-5">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Actively Hiring
                  </span>
                  <span className="font-mono text-emerald-300 text-xs font-bold">{salaryRange}</span>
                </div>
                <h3 className="text-xl font-bold text-white pt-1">{title || 'Role Title'}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                  <span className="text-emerald-400 font-semibold">{company.name}</span> &bull;{' '}
                  <MapPin className="w-3 h-3 text-slate-500" /> {location} ({workMode})
                </p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Job Type:</span>
                  <span className="text-white font-semibold">{jobType}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Experience:</span>
                  <span className="text-white font-semibold">{experienceRequired}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Openings:</span>
                  <span className="text-white font-semibold">{openings} seats</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Required Verified Skills
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {requiredSkills.map((req, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs flex items-center gap-1"
                    >
                      <span>{req.name}</span>
                      <span className="text-[10px] text-emerald-400">({req.level})</span>
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed border-t border-slate-800 pt-3">
                {description}
              </p>

              <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Application Deadline: {deadline}</span>
                <span className="text-emerald-400 font-semibold">Instant AI Matching</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
