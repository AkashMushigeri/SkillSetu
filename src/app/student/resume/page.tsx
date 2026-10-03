'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStudent } from '@/context/StudentContext';
import { auth, getAiAppCheckHeaders } from '@/lib/firebase';
import type { ResumeAnalysis, ResumeDetail } from '@/lib/resumeAnalysis';
import {
  Printer,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import { GithubIcon } from '@/components/icons/BrandIcons';

function DetailList({ title, items }: { title: string; items: ResumeDetail[] }) {
  return (
    <div>
      <h4 className="font-bold text-slate-800 mb-2">{title}</h4>
      {items.length ? (
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={`${item.value}-${index}`} className="rounded-lg bg-slate-50 p-3 text-sm text-slate-800">
              {item.value}
              <p className="mt-1 text-xs text-slate-500">From resume: “{item.evidence}”</p>
            </li>
          ))}
        </ul>
      ) : <p className="text-sm text-slate-500">Not found in the resume.</p>}
    </div>
  );
}

export default function ResumePage() {
  const { profile, skills, projects, updateProfile, syncResumeSkills } = useStudent();
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [comparedWithJob, setComparedWithJob] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [skillEdits, setSkillEdits] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
  const [careerGoalDraft, setCareerGoalDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [syncWarning, setSyncWarning] = useState('');

  const verifiedSkills = skills.filter((s) => s.isVerified);
  const otherSkills = skills.filter((s) => !s.isVerified && (s.progress > 0 || s.resumeEvidence || s.category === 'Resume'));

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const analyzeResume = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file || file.size > 4 * 1024 * 1024 || (file.type && file.type !== 'application/pdf')) {
      setError('Choose a PDF file up to 4 MB.');
      return;
    }
    setLoading(true);
    setError('');
    setSaved(false);
    setAnalysis(null);
    const form = new FormData();
    form.append('resume', file);
    form.append('jobDescription', jobDescription);
    try {
      if (!auth?.currentUser) throw new Error('Sign in to analyze your resume.');
      const token = await auth.currentUser.getIdToken();
      const response = await fetch('/api/resume-analysis', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, ...await getAiAppCheckHeaders() },
        body: form,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Resume analysis failed.');
      const next = result.analysis as ResumeAnalysis;
      setAnalysis(next);
      setSkillEdits(next.candidateSkills.map((skill) => skill.value));
      setSelectedSkills([]);
      setSyncWarning('');
      setCareerGoalDraft(next.jobInterests[0]?.value || '');
      setComparedWithJob(Boolean(jobDescription.trim()));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Resume analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  const saveApprovedDetails = async () => {
    if (!analysis) return;
    const approved = selectedSkills.map((index) => ({
      ...analysis.candidateSkills[index],
      value: skillEdits[index]?.trim() || '',
    })).filter((item) => item.value);
    setSaving(true);
    setError('');
    try {
      if (careerGoalDraft.trim()) updateProfile({ careerGoal: careerGoalDraft.trim().slice(0, 120) });
      const sync = await syncResumeSkills(approved);
      setSyncWarning(sync.synced < sync.attempted
        ? `Saved in this browser's Skill Mapping. Cloud sync completed for ${sync.synced} of ${sync.attempted} skills.`
        : '');
      setSaved(true);
    } catch {
      setError('Could not save the approved skills. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Top Action Controls (Hidden when printing) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm no-print">
        <div className="flex items-center gap-3">
          <Link
            href="/student/profile"
            className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-white">
              Verified ATS-Ready Resume
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Generated automatically from your verified SkillSetu credentials.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 bg-brand-teal hover:bg-brand-dark text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      <section className="no-print rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Analyze your PDF resume</h2>
          <p className="text-sm text-slate-600">Get an estimated ATS readiness score, extracted skills, and suggested career interests. Review details before adding them to your profile.</p>
        </div>
        <form onSubmit={analyzeResume} className="space-y-4">
          <label className="block text-sm font-semibold text-slate-700">
            Resume PDF (up to 4 MB)
            <input
              type="file"
              accept=".pdf,application/pdf"
              required
              disabled={loading}
              onChange={(event) => {
                setFile(event.target.files?.[0] || null);
                setAnalysis(null);
                setError('');
                setSaved(false);
              }}
              className="mt-2 block w-full rounded-lg border border-slate-300 p-2 text-sm font-normal"
            />
          </label>
          <label className="block text-sm font-semibold text-slate-700">
            Job description (optional, for a separate match score)
            <textarea
              value={jobDescription}
              onChange={(event) => {
                setJobDescription(event.target.value);
                setAnalysis(null);
                setSaved(false);
              }}
              maxLength={4000}
              rows={3}
              disabled={loading}
              placeholder="Paste the role's required skills here"
              className="mt-2 block w-full rounded-lg border border-slate-300 p-3 text-sm font-normal"
            />
          </label>
          <button type="submit" disabled={loading} className="rounded-lg bg-brand-teal px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">
            {loading ? 'Analyzing…' : 'Analyze resume'}
          </button>
        </form>
        <p className="text-xs text-slate-500">Your PDF is sent to Gemini for this analysis and is not saved by SkillSetu. Scores are estimates, not official ATS results.</p>
        {error && <p role="alert" className="text-sm font-medium text-rose-700">{error}</p>}
        {loading && <p role="status" className="text-sm text-slate-600">Reading your resume. This may take a moment.</p>}
      </section>

      {analysis && (
        <section className="no-print rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Resume analysis</h2>
            <p className="text-sm text-slate-600">Please check AI extracted details against your PDF before saving anything.</p>
          </div>
          <div className="rounded-xl bg-teal-50 p-4">
            <p className="text-sm font-semibold text-teal-900">Estimated ATS readiness</p>
            <p className="text-3xl font-black text-teal-900">{analysis.atsScore}<span className="text-lg">/100</span></p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {analysis.atsBreakdown.map((part) => (
                <p key={part.label} className="text-sm text-teal-900">{part.label}: <strong>{part.score}/{part.max}</strong></p>
              ))}
            </div>
          </div>
          {comparedWithJob && (
            <div className="rounded-xl bg-blue-50 p-4 text-sm text-blue-900">
              <h3 className="font-bold">Job description match</h3>
              {analysis.jobMatch ? (
                <>
                  <p className="mt-1 text-2xl font-black">{analysis.jobMatch.score}%</p>
                  <p>Matched: {analysis.jobMatch.matchedSkills.join(', ') || 'None found'}</p>
                  <p>Missing from resume: {analysis.jobMatch.missingSkills.join(', ') || 'None'}</p>
                </>
              ) : <p className="mt-1">No explicit technical requirements were found in the job description.</p>}
            </div>
          )}
          <div className="grid gap-4 text-sm sm:grid-cols-2">
            <p><strong>Name:</strong> {analysis.name || 'Not found'}</p>
            <p><strong>Email:</strong> {analysis.email || 'Not found'}</p>
            <p><strong>Phone:</strong> {analysis.phone || 'Not found'}</p>
            <p><strong>Summary:</strong> {analysis.summary || 'Not found'}</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <DetailList title="Education" items={analysis.education} />
            <DetailList title="Experience" items={analysis.experience} />
            <DetailList title="Projects" items={analysis.projects} />
            <DetailList title="Certifications" items={analysis.certifications} />
            <DetailList title="Technologies" items={analysis.technologies} />
            <DetailList title="Suggested job interests" items={analysis.jobInterests} />
          </div>
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900">Candidate skill profile</h3>
            <p className="text-sm text-slate-600">Explicit skills and technologies are deduplicated for Skill Mapping. Select only those you can confirm. Saving replaces the skills mapped from your previous resume; they remain unverified.</p>
            {analysis.candidateSkills.length ? analysis.candidateSkills.map((skill, index) => (
              <div key={`${skill.value}-${index}`} className="flex gap-3 rounded-lg bg-slate-50 p-3">
                <input
                  type="checkbox"
                  aria-label={`Add ${skillEdits[index] || skill.value} to profile`}
                  checked={selectedSkills.includes(index)}
                  onChange={(event) => {
                    setSelectedSkills((prev) => event.target.checked ? [...prev, index] : prev.filter((item) => item !== index));
                    setSaved(false);
                  }}
                  className="mt-2"
                />
                <div className="flex-1">
                  <input
                    aria-label={`Correct skill ${index + 1}`}
                    value={skillEdits[index] || ''}
                    maxLength={80}
                    onChange={(event) => {
                      setSkillEdits((prev) => prev.map((value, item) => item === index ? event.target.value : value));
                      setSaved(false);
                    }}
                    className="w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
                  />
                  <p className="mt-1 text-xs text-slate-500">From resume: “{skill.evidence}”</p>
                  <p className="mt-1 text-xs font-medium text-teal-700">Source: {skill.source}</p>
                </div>
              </div>
            )) : <p className="text-sm text-slate-500">No explicit skills found.</p>}
          </div>
          <label className="block text-sm font-semibold text-slate-700">
            Career interest to save (optional)
            <input
              value={careerGoalDraft}
              onChange={(event) => {
                setCareerGoalDraft(event.target.value);
                setSaved(false);
              }}
              maxLength={120}
              list="resume-job-interests"
              placeholder="Choose or correct a suggested role"
              className="mt-2 block w-full rounded-lg border border-slate-300 p-2 font-normal"
            />
            <datalist id="resume-job-interests">
              {analysis.jobInterests.map((interest) => <option key={interest.value} value={interest.value} />)}
            </datalist>
          </label>
          {analysis.suggestions.length > 0 && (
            <div>
              <h3 className="font-bold text-slate-900">Ways to improve</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                {analysis.suggestions.map((suggestion, index) => <li key={index}>{suggestion}</li>)}
              </ul>
            </div>
          )}
          <button
            type="button"
            onClick={saveApprovedDetails}
            disabled={saving}
            className="rounded-lg bg-brand-teal px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
          >{saving ? 'Syncing skills…' : `Update Skill Mapping (${selectedSkills.length} skills selected)`}</button>
          {saved && <p role="status" className={`text-sm font-medium ${syncWarning ? 'text-amber-700' : 'text-emerald-700'}`}>
            {syncWarning || (selectedSkills.length ? 'Approved details saved to your profile and Skill Mapping.' : "Previous resume skills cleared from this browser's Skill Mapping.")}
            {' '}<Link href="/student/skills" className="underline">View mapped skills</Link>
          </p>}
        </section>
      )}

      {/* Printable Resume Document */}
      <div className="print-container bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xl space-y-8 font-sans text-slate-900">
        {/* 1. Header */}
        <div className="border-b-2 border-slate-900 pb-6 space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950 uppercase">
              {profile.name}
            </h1>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-[11px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              SkillSetu Verified Profile
            </div>
          </div>

          <p className="text-xs sm:text-sm font-semibold text-slate-700">
            {profile.degree} &bull; {profile.year} ({profile.gpa}) &bull; {profile.college}
          </p>

          <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-600 pt-1">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> {profile.location}
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-slate-400" /> {profile.email}
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-slate-400" /> {profile.phone}
            </span>
            {profile.github && (
              <>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <GithubIcon className="w-3.5 h-3.5 text-slate-400" />
                  {profile.github.replace(/^https?:\/\//, '')}
                </span>
              </>
            )}
          </div>
        </div>

        {/* 2. Career Summary */}
        <div className="space-y-2">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-200 pb-1">
            Career Objective &amp; Summary
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {profile.bio || 'Motivated professional focused on software engineering, technology innovation, and applied technical solutions.'}
          </p>
        </div>

        {/* 3. Education */}
        <div className="space-y-2">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-200 pb-1">
            Education
          </h2>
          <div className="flex justify-between items-start text-xs sm:text-sm">
            <div>
              <strong className="font-bold text-slate-900 block">
                {profile.college || 'Institution'}
              </strong>
              <span className="text-slate-600">
                {profile.degree || 'Degree Program'}
              </span>
            </div>
            <div className="text-right">
              <span className="font-bold text-slate-800 block">{profile.year || 'Academic Year'}</span>
              {profile.gpa && (
                <span className="text-emerald-700 font-bold">
                  {profile.gpa.toLowerCase().includes('cgpa') || profile.gpa.includes('/')
                    ? profile.gpa
                    : `CGPA: ${profile.gpa} / 10`}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 4. Skills & Verified Competencies */}
        <div className="space-y-3">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-200 pb-1">
            Skills &amp; Technical Competencies
          </h2>

          {/* Verified Badges Section */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Verified Competencies (Proctored on SkillSetu):
            </span>
            <div className="flex flex-wrap gap-2">
              {verifiedSkills.map((sk) => (
                <span
                  key={sk.id}
                  className="px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  {sk.name} &bull; {sk.level} (✓ Verified)
                </span>
              ))}
            </div>
          </div>

          {/* Additional Skills */}
          <div className="space-y-1 pt-1">
            <span className="text-xs font-bold text-slate-700">Additional Working Proficiencies:</span>
            <p className="text-xs text-slate-600 leading-relaxed">
              {otherSkills.map((s) => s.name).join(' &bull; ')} &bull; Git &amp; GitHub &bull; REST APIs &bull; Data Structures &bull; Object-Oriented Design &bull; Agile Scrum.
            </p>
          </div>
        </div>

        {/* 5. Projects */}
        <div className="space-y-3">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-200 pb-1">
            Academic &amp; Industry Projects
          </h2>
          <div className="space-y-4 text-xs sm:text-sm">
            {projects.length === 0 ? (
              <p className="text-xs text-slate-400 italic">
                No academic or industry projects added yet. Add projects in your profile to display them on your verified resume.
              </p>
            ) : (
              projects.map((proj) => (
                <div key={proj.id} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">{proj.title}</span>
                    <span className="text-xs text-slate-400 font-mono">
                      {proj.techStack.join(', ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 6. Experience & Relevant Work */}
        <div className="space-y-2">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-200 pb-1">
            Experience &amp; Industry Engagements
          </h2>
          <div className="space-y-2 text-xs sm:text-sm">
            {profile.name === 'Aarav Sharma' ? (
              <div>
                <div className="flex justify-between">
                  <strong className="font-bold text-slate-900">
                    Open Source Contributor &amp; Student Researcher
                  </strong>
                  <span className="text-slate-500">2025 &ndash; Present</span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Contributed bug fixes and responsive layout patches to open healthcare repositories; participated in hackathon sprints focusing on AYUSH practitioner indexing.
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">
                Verified candidate active on SkillSetu &bull; Ready for internships, industry tasks, and micro-sprints.
              </p>
            )}
          </div>
        </div>

        {/* 7. Achievements */}
        <div className="space-y-2">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-200 pb-1">
            Honors &amp; Extracurriculars
          </h2>
          <ul className="list-disc pl-4 space-y-1 text-xs text-slate-600">
            <li>National Skill Intelligence Challenge Finalist &mdash; AI &amp; Health Track</li>
            <li>Awarded SkillSetu Verified Developer Badge in Web and Python tracks</li>
            <li>Member of RVCE Open Source Software Development Club</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
