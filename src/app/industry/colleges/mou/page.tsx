'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useIndustry } from '@/context/IndustryContext';
import {
  School,
  FileCheck2,
  FileText,
  Plus,
  ArrowLeft,
  CheckCircle2,
  Clock,
  BookOpen,
  Sparkles,
  Layers,
  GraduationCap,
  Download,
  Building2,
  Send,
  AlertCircle,
  Award,
} from 'lucide-react';

export default function CollegeMoUStudioPage() {
  const { collegeMous, addCurriculumFeedback, updateMoUStatus, showToast } = useIndustry();
  const [selectedMoUId, setSelectedMoUId] = useState<string>(collegeMous[0]?.id || 'mou-01');
  const [isProposing, setIsProposing] = useState(false);

  // New recommendation form
  const [semester, setSemester] = useState('Semester 6');
  const [currentSubject, setCurrentSubject] = useState('');
  const [industryRecommendation, setIndustryRecommendation] = useState('');
  const [recommendedTechnologies, setRecommendedTechnologies] = useState('');
  const [rationale, setRationale] = useState('');

  const currentMoU = collegeMous.find((m) => m.id === selectedMoUId) || collegeMous[0];

  const handleProposeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSubject || !industryRecommendation || !rationale) {
      showToast('Please fill out subject, recommendation, and rationale.', 'warning');
      return;
    }

    addCurriculumFeedback(currentMoU.id, {
      semester,
      currentSubject,
      industryRecommendation,
      recommendedTechnologies: recommendedTechnologies
        ? recommendedTechnologies.split(',').map((t) => t.trim())
        : ['Modern Cloud Tools'],
      rationale,
      status: 'In Review',
    });

    // Reset
    setCurrentSubject('');
    setIndustryRecommendation('');
    setRecommendedTechnologies('');
    setRationale('');
    setIsProposing(false);
  };

  const handleDownloadMoU = () => {
    showToast(`Downloading AICTE-Formatted Bilateral MoU for ${currentMoU.collegeName}...`, 'info');
    setTimeout(() => {
      showToast('MoU PDF generated and downloaded.', 'success');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Top Back & Header */}
      <div>
        <Link
          href="/industry/colleges"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Partner Colleges</span>
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Academia–Industry Bilateral MoUs &amp; Curriculum Studio
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono">
                SIH Core
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Directly address the curriculum-skill lag by advising partner colleges on industry syllabus updates, monitoring credit-aligned internships, and executing bilateral Memoranda of Understanding (MoU).
            </p>
          </div>

          <button
            onClick={handleDownloadMoU}
            className="px-4 py-2.5 bg-gradient-to-r from-brand-teal to-brand-emerald hover:from-teal-600 hover:to-emerald-700 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-teal-950/40 flex items-center gap-2 self-start lg:self-auto transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download Official MoU (PDF)</span>
          </button>
        </div>
      </div>

      {/* College Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {collegeMous.map((mou) => (
          <button
            key={mou.id}
            onClick={() => {
              setSelectedMoUId(mou.id);
              setIsProposing(false);
            }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              selectedMoUId === mou.id
                ? 'bg-slate-800 text-brand-teal border border-brand-teal/50 shadow-md shadow-brand-teal/10'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <School className="w-3.5 h-3.5" />
            <span>{mou.collegeName.split(',')[0]}</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                mou.status === 'Active'
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'bg-amber-500/20 text-amber-300'
              }`}
            >
              {mou.status}
            </span>
          </button>
        ))}
      </div>

      {currentMoU && (
        <>
          {/* Institutional Agreement Overview Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white">{currentMoU.collegeName}</h2>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    MoU Valid: {currentMoU.durationYears} Years
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Primary Institutional Signatory: <strong className="text-slate-200">{currentMoU.collegeContact}</strong>
                </p>
                <span className="text-[11px] text-brand-teal mt-0.5 block">
                  Effective from {currentMoU.effectiveFrom}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Committed Internships</span>
                  <span className="text-lg font-black text-emerald-400 font-mono">
                    {currentMoU.internshipCommitmentCount} Seats / Year
                  </span>
                </div>
                <div className="bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Curriculum Reviews</span>
                  <span className="text-lg font-black text-brand-teal font-mono">
                    {currentMoU.curriculumReviewsCompleted} Adopted
                  </span>
                </div>
              </div>
            </div>

            {/* Key Bilateral Initiatives */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-emerald-400" />
                <span>Enacted Bilateral Commitments &amp; Objectives</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentMoU.keyInitiatives.map((init, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-start gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-brand-teal flex-shrink-0 mt-0.5" />
                    <span>{init}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Curriculum Modernization Engine */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-400" />
                  <h2 className="text-lg font-bold text-white">
                    Joint Curriculum Modernization &amp; Skill Gap Advisories
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Recommendations drafted by TechNova Senior Engineering Staff submitted to {currentMoU.collegeName.split(',')[0]} Academic Senate.
                </p>
              </div>

              <button
                onClick={() => setIsProposing(!isProposing)}
                className="px-3.5 py-2 bg-brand-teal hover:bg-teal-500 text-slate-950 font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isProposing ? 'Cancel Proposal' : 'Propose Syllabus Change'}</span>
              </button>
            </div>

            {/* Propose Form Drawer */}
            {isProposing && (
              <form
                onSubmit={handleProposeSubmit}
                className="bg-slate-950 border border-brand-teal/40 rounded-2xl p-5 space-y-4 animate-in fade-in slide-in-from-top-2"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-brand-teal flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>Draft New Industry Syllabus Recommendation</span>
                  </h3>
                  <span className="text-[11px] text-slate-400">Targeting Academic Year 2026–27</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Target Semester</label>
                    <select
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-brand-teal"
                    >
                      <option>Semester 4</option>
                      <option>Semester 5</option>
                      <option>Semester 6</option>
                      <option>Semester 7</option>
                      <option>Semester 8 Elective</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">
                      Existing College Subject / Course Code
                    </label>
                    <input
                      type="text"
                      value={currentSubject}
                      onChange={(e) => setCurrentSubject(e.target.value)}
                      placeholder="e.g. CS604: Distributed Web Systems"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-brand-teal placeholder-slate-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">
                    Industry Recommended Topic / Modern Replacement
                  </label>
                  <input
                    type="text"
                    value={industryRecommendation}
                    onChange={(e) => setIndustryRecommendation(e.target.value)}
                    placeholder="e.g. Production Microservices with FastAPI, Vector DBs, & Docker"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-brand-teal placeholder-slate-600"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">
                    Recommended Tools &amp; Frameworks (comma separated)
                  </label>
                  <input
                    type="text"
                    value={recommendedTechnologies}
                    onChange={(e) => setRecommendedTechnologies(e.target.value)}
                    placeholder="e.g. FastAPI, PostgreSQL, Redis, Docker, GitHub Actions"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-brand-teal placeholder-slate-600"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">
                    Industry Hiring Rationale &amp; Justification
                  </label>
                  <textarea
                    rows={2}
                    value={rationale}
                    onChange={(e) => setRationale(e.target.value)}
                    placeholder="Explain why current graduates lack this skill and how this increases student placement rates..."
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-brand-teal placeholder-slate-600"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsProposing(false)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-brand-teal hover:bg-teal-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Proposal to Academic Senate</span>
                  </button>
                </div>
              </form>
            )}

            {/* List of Recommended Modules */}
            <div className="space-y-4">
              {currentMoU.suggestedCurriculumModules.map((mod) => (
                <div
                  key={mod.id}
                  className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-slate-800 text-brand-teal border border-slate-700">
                        {mod.semester}
                      </span>
                      <span className="text-xs text-slate-400">
                        Existing: <span className="text-slate-300 font-medium">{mod.currentSubject}</span>
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full border self-start sm:self-auto ${
                        mod.status === 'Adopted'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : mod.status === 'In Review'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                      }`}
                    >
                      {mod.status}
                    </span>
                  </div>

                  {/* Recommendation */}
                  <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 block tracking-wider">
                      Industry Upgrade Recommendation:
                    </span>
                    <h4 className="font-bold text-white text-sm">{mod.industryRecommendation}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed pt-1">{mod.rationale}</p>
                  </div>

                  {/* Tools */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] font-bold uppercase text-slate-500 mr-1">Target Tools:</span>
                    {mod.recommendedTechnologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-200 border border-slate-700/80 font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
