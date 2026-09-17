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
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors mb-3 font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Partner Colleges</span>
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Academia–Industry Bilateral MoUs &amp; Curriculum Studio
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-purple-50 text-purple-800 border border-purple-200 font-mono">
                SIH Core
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Directly address the curriculum-skill lag by advising partner colleges on industry syllabus updates, monitoring credit-aligned internships, and executing bilateral Memoranda of Understanding (MoU).
            </p>
          </div>

          <button
            onClick={handleDownloadMoU}
            className="px-4 py-2.5 bg-gradient-to-r from-brand-emerald to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 self-start lg:self-auto transition-all"
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
            className={`px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 shadow-xs ${
              selectedMoUId === mou.id
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-300 font-bold'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <School className="w-3.5 h-3.5 text-emerald-600" />
            <span>{mou.collegeName.split(',')[0]}</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                mou.status === 'Active'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
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
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-card space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900">{currentMoU.collegeName}</h2>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    MoU Valid: {currentMoU.durationYears} Years
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Primary Institutional Signatory: <strong className="text-slate-800">{currentMoU.collegeContact}</strong>
                </p>
                <span className="text-[11px] text-teal-700 font-medium mt-0.5 block">
                  Effective from {currentMoU.effectiveFrom}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Committed Internships</span>
                  <span className="text-lg font-black text-emerald-700 font-mono">
                    {currentMoU.internshipCommitmentCount} Seats / Year
                  </span>
                </div>
                <div className="bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Curriculum Reviews</span>
                  <span className="text-lg font-black text-teal-700 font-mono">
                    {currentMoU.curriculumReviewsCompleted} Adopted
                  </span>
                </div>
              </div>
            </div>

            {/* Key Bilateral Initiatives */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-emerald-600" />
                <span>Enacted Bilateral Commitments &amp; Objectives</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentMoU.keyInitiatives.map((init, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700 flex items-start gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{init}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Curriculum Modernization Engine */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-card space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-600" />
                  <h2 className="text-lg font-bold text-slate-900">
                    Joint Curriculum Modernization &amp; Skill Gap Advisories
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Recommendations drafted by TechNova Senior Engineering Staff submitted to {currentMoU.collegeName.split(',')[0]} Academic Senate.
                </p>
              </div>

              <button
                onClick={() => setIsProposing(!isProposing)}
                className="px-3.5 py-2 bg-gradient-to-r from-brand-emerald to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isProposing ? 'Cancel Proposal' : 'Propose Syllabus Change'}</span>
              </button>
            </div>

            {/* Propose Form Drawer */}
            {isProposing && (
              <form
                onSubmit={handleProposeSubmit}
                className="bg-slate-50 border border-emerald-200 rounded-2xl p-5 space-y-4 animate-in fade-in slide-in-from-top-2 shadow-xs"
              >
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Draft New Industry Syllabus Recommendation</span>
                  </h3>
                  <span className="text-[11px] text-slate-500">Targeting Academic Year 2026–27</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Target Semester</label>
                    <select
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500 shadow-xs"
                    >
                      <option>Semester 4</option>
                      <option>Semester 5</option>
                      <option>Semester 6</option>
                      <option>Semester 7</option>
                      <option>Semester 8 Elective</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Existing College Subject / Course Code
                    </label>
                    <input
                      type="text"
                      value={currentSubject}
                      onChange={(e) => setCurrentSubject(e.target.value)}
                      placeholder="e.g. CS604: Distributed Web Systems"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500 placeholder-slate-400 shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Industry Recommended Topic / Modern Replacement
                  </label>
                  <input
                    type="text"
                    value={industryRecommendation}
                    onChange={(e) => setIndustryRecommendation(e.target.value)}
                    placeholder="e.g. Production Microservices with FastAPI, Vector DBs, & Docker"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500 placeholder-slate-400 shadow-xs"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Recommended Tools &amp; Frameworks (comma separated)
                  </label>
                  <input
                    type="text"
                    value={recommendedTechnologies}
                    onChange={(e) => setRecommendedTechnologies(e.target.value)}
                    placeholder="e.g. FastAPI, PostgreSQL, Redis, Docker, GitHub Actions"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500 placeholder-slate-400 shadow-xs"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Industry Hiring Rationale &amp; Justification
                  </label>
                  <textarea
                    rows={2}
                    value={rationale}
                    onChange={(e) => setRationale(e.target.value)}
                    placeholder="Explain why current graduates lack this skill and how this increases student placement rates..."
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500 placeholder-slate-400 shadow-xs"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsProposing(false)}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold text-xs rounded-xl shadow-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-gradient-to-r from-brand-emerald to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md"
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
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {mod.semester}
                      </span>
                      <span className="text-xs text-slate-500">
                        Existing: <span className="text-slate-800 font-semibold">{mod.currentSubject}</span>
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full border self-start sm:self-auto ${
                        mod.status === 'Adopted'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : mod.status === 'In Review'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-blue-50 text-blue-800 border-blue-200'
                      }`}
                    >
                      {mod.status}
                    </span>
                  </div>

                  {/* Recommendation */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1.5 shadow-xs">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 block tracking-wider">
                      Industry Upgrade Recommendation:
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm">{mod.industryRecommendation}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed pt-1">{mod.rationale}</p>
                  </div>

                  {/* Tools */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400 mr-1">Target Tools:</span>
                    {mod.recommendedTechnologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-mono font-medium"
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
