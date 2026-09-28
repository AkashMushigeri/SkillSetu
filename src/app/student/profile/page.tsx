'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStudent } from '@/context/StudentContext';
import {
  User,
  GraduationCap,
  MapPin,
  Briefcase,
  Mail,
  Phone,
  Award,
  ShieldCheck,
  CheckCircle2,
  FolderKanban,
  FileCheck2,
  ExternalLink,
  Edit3,
  Sparkles,
  Rocket,
  Zap,
  BookOpen,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/icons/BrandIcons';

export default function StudentProfilePage() {
  const { profile, skills, projects, updateProfile, addProject, deleteProject } = useStudent();
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState(profile.bio);

  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    techStack: '',
    githubUrl: '',
    liveUrl: '',
  });

  const handleAddProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title.trim() || !newProject.description.trim()) return;
    addProject({
      title: newProject.title.trim(),
      description: newProject.description.trim(),
      techStack: newProject.techStack.split(',').map((s) => s.trim()).filter(Boolean),
      githubUrl: newProject.githubUrl.trim() || 'https://github.com',
      liveUrl: newProject.liveUrl.trim() || undefined,
    });
    setNewProject({
      title: '',
      description: '',
      techStack: '',
      githubUrl: '',
      liveUrl: '',
    });
    setIsAddProjectOpen(false);
  };

  const verifiedSkills = skills.filter((s) => s.isVerified);
  const unverifiedSkills = skills.filter((s) => !s.isVerified && s.progress > 0);

  const handleSaveBio = () => {
    updateProfile({ bio: bioInput });
    setIsEditingBio(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      {/* 1. Profile Hero Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            {/* Avatar */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-brand-teal to-brand-emerald text-white flex items-center justify-center font-black text-2xl sm:text-3xl shadow-md shrink-0">
              {profile.name
                ? profile.name
                    .split(' ')
                    .filter(Boolean)
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()
                : 'ST'}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {profile.name}
                </h1>
                <span className="p-1 rounded-full bg-emerald-100 text-emerald-700" title="Verified Student">
                  <CheckCircle2 className="w-5 h-5" />
                </span>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-slate-700">
                {profile.degree} &bull; {profile.year} ({profile.gpa})
              </p>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 pt-0.5">
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-brand-teal" />
                  {profile.college}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {profile.location}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-brand-orange" />
                  Goal: <strong className="text-slate-700">{profile.careerGoal}</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
            <div className="flex items-center gap-2">
              <Link
                href="/onboarding"
                className="px-3.5 py-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5"
                title="Update your verified profile and database records"
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                <span>Edit Profile</span>
              </Link>

              <Link
                href="/student/resume"
                className="px-4 py-2 rounded-xl bg-brand-teal hover:bg-brand-dark text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>Preview ATS Resume</span>
              </Link>
            </div>

            <div className="text-right text-xs">
              <span className="text-slate-400 block text-[11px]">SkillSetu ID</span>
              <strong className="text-slate-700 font-mono">
                {profile.id && !profile.id.includes('aarav')
                  ? profile.id.toUpperCase()
                  : `STD-${(profile.name ? profile.name.slice(0, 3).toUpperCase() : 'GAT')}-${new Date().getFullYear()}`}
              </strong>
            </div>
          </div>
        </div>

        {/* Profile Completion Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-teal" />
              Profile Strength &amp; Completion
            </span>
            <span className="font-black text-brand-teal">{profile.profileCompletion}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-brand-teal to-brand-emerald h-2.5 rounded-full transition-all duration-700"
              style={{ width: `${profile.profileCompletion}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Tip: Complete your pending skill assessments to reach 100% verified status.
          </p>
        </div>
      </div>

      {/* 2-Column Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): About, Verified Skills, Projects, Work Experience */}
        <div className="lg:col-span-8 space-y-6">
          {/* About Section */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <User className="w-4 h-4 text-brand-teal" />
                About &amp; Career Summary
              </h3>
              <button
                type="button"
                onClick={() => setIsEditingBio(!isEditingBio)}
                className="text-xs font-semibold text-brand-teal hover:underline flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3" />
                {isEditingBio ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {isEditingBio ? (
              <div className="space-y-2">
                <textarea
                  rows={3}
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-teal"
                />
                <button
                  type="button"
                  onClick={handleSaveBio}
                  className="px-3.5 py-1.5 bg-brand-teal text-white rounded-lg text-xs font-bold"
                >
                  Save Summary
                </button>
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {profile.bio}
              </p>
            )}
          </div>

          {/* Official Verified Skills Badges Section */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  Verified Skill Badges ({verifiedSkills.length})
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Proctored assessments passed with &ge; 70% score on SkillSetu.
                </p>
              </div>
              <Link
                href="/student/skills"
                className="text-xs font-bold text-brand-teal hover:underline"
              >
                Verify More Skills &rarr;
              </Link>
            </div>

            {verifiedSkills.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {verifiedSkills.map((sk) => (
                  <div
                    key={sk.id}
                    className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/70 to-teal-50/70 border border-emerald-300 flex items-center justify-between shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{sk.icon}</span>
                      <div>
                        <span className="font-bold text-sm text-slate-900 block">{sk.name}</span>
                        <span className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          {sk.level} &bull; Verified
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {sk.verifiedDate || 'Verified'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center py-5">
                <p className="text-xs text-slate-600 font-medium">
                  Take your first skill assessment to earn your official verified badge!
                </p>
                <Link
                  href="/student/skills"
                  className="inline-flex items-center gap-1.5 mt-2.5 px-3 py-1.5 bg-brand-teal text-white rounded-xl text-xs font-bold shadow-xs hover:bg-brand-dark transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Start Verification Quiz</span>
                </Link>
              </div>
            )}

            {/* In-Progress / Selected Competencies */}
            {unverifiedSkills.length > 0 && (
              <div className="pt-3 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-500 block mb-2">
                  Active Competencies &amp; Skills ({unverifiedSkills.length}):
                </span>
                <div className="flex flex-wrap gap-2">
                  {unverifiedSkills.map((sk) => (
                    <Link
                      key={sk.id}
                      href={`/student/skills`}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors flex items-center gap-1.5"
                    >
                      <span>{sk.icon}</span>
                      <span>{sk.name}</span>
                      <span className="text-[10px] text-brand-teal font-semibold">Verify &rarr;</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Projects Showcase */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-brand-teal" />
                Academic &amp; Hackathon Projects ({projects.length})
              </h3>
              <button
                type="button"
                onClick={() => setIsAddProjectOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-teal hover:bg-brand-dark text-white text-xs font-bold transition-all shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Project</span>
              </button>
            </div>

            {projects.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-50 border border-dashed border-slate-300 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-200/60 text-slate-500 flex items-center justify-center mx-auto">
                  <FolderKanban className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800">No projects added yet</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    Upload your academic coursework, capstones, hackathon builds, or open-source repositories to showcase real proof-of-work to recruiters.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddProjectOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-teal hover:bg-brand-dark text-white text-xs font-bold transition-all shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Upload Your First Project</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-slate-900">{proj.title}</h4>
                      <div className="flex items-center gap-2.5">
                        {proj.githubUrl && (
                          <a
                            href={proj.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                          >
                            <GithubIcon className="w-3.5 h-3.5" />
                            Code
                          </a>
                        )}
                        {proj.liveUrl && (
                          <a
                            href={proj.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-semibold text-brand-teal hover:underline flex items-center gap-1"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Live Demo
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => deleteProject(proj.id)}
                          className="text-slate-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {proj.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[10px] font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Work Experience Section (Specific Demo Requirement) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-card space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-brand-teal" />
              Industry &amp; Work Experience
            </h3>

            <div className="p-5 rounded-2xl bg-slate-50 border border-dashed border-slate-300 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center mx-auto">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-800">
                  No major corporate experience yet
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Looking for first industry experience. Recommended starting paths:
                </p>
              </div>

              {/* Recommendations */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-xs">
                <Link
                  href="/student/opportunities"
                  className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-brand-teal text-slate-800 font-semibold transition-all hover:shadow-xs"
                >
                  <Rocket className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                  Startup Internships
                </Link>
                <Link
                  href="/student/opportunities"
                  className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-brand-teal text-slate-800 font-semibold transition-all hover:shadow-xs"
                >
                  <Zap className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                  Micro-Internships
                </Link>
                <Link
                  href="/student/opportunities"
                  className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-brand-teal text-slate-800 font-semibold transition-all hover:shadow-xs"
                >
                  <Award className="w-4 h-4 text-rose-600 mx-auto mb-1" />
                  Industry Challenges
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Education, Contact, Certifications & Achievements */}
        <div className="lg:col-span-4 space-y-6">
          {/* Education Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-card space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-brand-teal" />
              Education
            </h3>
            <div className="space-y-2 text-xs">
              <div className="border-l-2 border-brand-teal pl-3 space-y-0.5">
                <strong className="text-slate-900 block font-bold">
                  {profile.college || 'Institution In Progress'}
                </strong>
                <p className="text-slate-600">{profile.degree || 'Degree Program'}</p>
                <p className="text-slate-400">{profile.year || 'Academic Year'}</p>
                {profile.gpa && (
                  <span className="inline-block mt-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                    {profile.gpa.toLowerCase().includes('cgpa') || profile.gpa.includes('/')
                      ? profile.gpa
                      : `CGPA: ${profile.gpa} / 10`}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Contact & Links */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-card space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Mail className="w-4 h-4 text-brand-teal" />
              Contact &amp; Profiles
            </h3>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{profile.email || 'No email provided'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{profile.phone || 'No phone provided'}</span>
              </div>
              <div className="flex items-center gap-2">
                <GithubIcon className="w-3.5 h-3.5 text-slate-400" />
                {profile.github ? (
                  <a
                    href={profile.github.startsWith('http') ? profile.github : `https://${profile.github}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand-teal hover:underline truncate"
                  >
                    {profile.github.replace(/^https?:\/\//, '')}
                  </a>
                ) : (
                  <span className="text-slate-400 italic">GitHub not linked</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <LinkedinIcon className="w-3.5 h-3.5 text-slate-400" />
                {profile.linkedin ? (
                  <a
                    href={profile.linkedin.startsWith('http') ? profile.linkedin : `https://${profile.linkedin}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand-teal hover:underline truncate"
                  >
                    {profile.linkedin.replace(/^https?:\/\//, '')}
                  </a>
                ) : (
                  <span className="text-slate-400 italic">LinkedIn not linked</span>
                )}
              </div>
            </div>
          </div>

          {/* Certifications & Achievements */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-card space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-brand-teal" />
              Certifications &amp; Honors
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800 block">
                  Smart India Hackathon Finalist 2026
                </span>
                <span className="text-[11px] text-slate-500">Team GAT054 &bull; Ministry of Ayush</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800 block">
                  SkillSetu Verified Developer Badge
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold">Web &amp; Python Competency</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Project Modal */}
      {isAddProjectOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-brand-teal" />
                <h3 className="font-bold text-base text-slate-900">Add Academic / Industry Project</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddProjectOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProjectSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  placeholder="e.g. AYUSH Healthcare Management System"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal outline-none font-sans"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="Describe the problem, your implementation, libraries used, and key features..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal outline-none font-sans"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  value={newProject.techStack}
                  onChange={(e) => setNewProject({ ...newProject, techStack: e.target.value })}
                  placeholder="e.g. Next.js, Python, PostgreSQL, TailwindCSS"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal outline-none font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">GitHub Code URL</label>
                  <input
                    type="url"
                    value={newProject.githubUrl}
                    onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                    placeholder="https://github.com/username/project"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal outline-none font-sans"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Live Demo URL (Optional)</label>
                  <input
                    type="url"
                    value={newProject.liveUrl}
                    onChange={(e) => setNewProject({ ...newProject, liveUrl: e.target.value })}
                    placeholder="https://myproject.vercel.app"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal outline-none font-sans"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddProjectOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-teal hover:bg-brand-dark text-white font-bold shadow-sm transition-colors"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
