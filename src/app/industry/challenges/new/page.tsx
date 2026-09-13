'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useIndustry } from '@/context/IndustryContext';
import {
  Trophy,
  ArrowLeft,
  Plus,
  X,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export default function CreateChallengePage() {
  const router = useRouter();
  const { createIndustryChallenge, showToast } = useIndustry();

  const [title, setTitle] = useState('AI Clinical Diagnosis & Prescription NLP Benchmark');
  const [description, setDescription] = useState(
    'Build an intelligent NLP benchmark that extracts clinical symptoms and maps vernacular herbal remedies to modern pharmacopeia taxonomies.'
  );
  const [problemStatement, setProblemStatement] = useState(
    'Current hospital records in regional primary centers are recorded in unstructured formats. Create an offline-first containerized transformer pipeline extracting active herb compounds.'
  );
  const [difficulty, setDifficulty] = useState<'Basic' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [deadline, setDeadline] = useState('2026-11-30');
  const [teamSize, setTeamSize] = useState('1–4 Students');
  const [prize, setPrize] = useState('₹50,000 Cash Prize + Direct PPO Interview');
  const [submissionRequirements, setSubmissionRequirements] = useState(
    'GitHub repo with Dockerfile, MIT License, and a 3-minute video presentation.'
  );
  const [collegeParticipation, setCollegeParticipation] = useState('Open to All 14 Partner Colleges');

  const [skills, setSkills] = useState<string[]>(['Python', 'NLP', 'Transformers', 'FastAPI']);
  const [newSkill, setNewSkill] = useState('');

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    if (!skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createIndustryChallenge({
      title,
      description,
      problemStatement,
      requiredSkills: skills,
      difficulty,
      deadline,
      teamSize,
      prize,
      submissionRequirements,
      collegeParticipation,
    });

    router.push('/industry/challenges');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Challenges</span>
      </button>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              Create Industry Challenge / Hackathon
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Crowdsource innovative technical solutions from students while evaluating real skills before campus recruitment.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Challenge Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Short Overview</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Technical Problem Statement</label>
            <textarea
              rows={3}
              value={problemStatement}
              onChange={(e) => setProblemStatement(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="Basic">Basic</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Team Size</label>
              <input
                type="text"
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
                placeholder="e.g. 1–4 Students"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Submission Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Required Skills */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
            <label className="block font-bold text-white text-xs">Required Technical Skills</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add skill (e.g. PyTorch, Docker)..."
                className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 bg-emerald-500 text-white font-bold rounded-xl text-xs"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {skills.map((s, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs"
                >
                  <span>{s}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(s)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Prize / Recognition</label>
              <input
                type="text"
                value={prize}
                onChange={(e) => setPrize(e.target.value)}
                placeholder="e.g. ₹50,000 + Pre-Placement Interview"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Institutional Participation</label>
              <input
                type="text"
                value={collegeParticipation}
                onChange={(e) => setCollegeParticipation(e.target.value)}
                placeholder="e.g. Open to All Partner Colleges"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Submission Deliverables</label>
            <input
              type="text"
              value={submissionRequirements}
              onChange={(e) => setSubmissionRequirements(e.target.value)}
              placeholder="e.g. GitHub Repository with MIT License + Dockerfile"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

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
              <span>Launch Challenge</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
