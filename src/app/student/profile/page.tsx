'use client';

import React, { useState, useMemo } from 'react';
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
  School,
  Plus,
  Trash2,
  X,
  Lock,
  Search,
  ChevronDown,
  AlertCircle,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/icons/BrandIcons';
import { Project, EducationHistory } from '@/types/student';
import { getAllCatalogSkills, SkillItem } from '@/data/skillsData';

export default function StudentProfilePage() {
  const {
    profile,
    skills,
    projects,
    updateProfile,
    addProject,
    updateProject,
    deleteProject,
    addSkill,
    removeSkill,
    updateSkillLevel,
  } = useStudent();

  // 1. Profile Header Edit Modal State
  const [isEditHeaderOpen, setIsEditHeaderOpen] = useState(false);
  const [headerForm, setHeaderForm] = useState({
    name: '',
    degree: '',
    year: '',
    gpa: '',
    college: '',
    location: '',
    careerGoal: '',
  });

  const handleOpenEditHeader = () => {
    setHeaderForm({
      name: profile.name || '',
      degree: profile.degree || 'B.Tech',
      year: profile.year || '3rd Year',
      gpa: profile.gpa || '',
      college: profile.college || '',
      location: profile.location || '',
      careerGoal: profile.careerGoal || '',
    });
    setIsEditHeaderOpen(true);
  };

  const handleSaveHeader = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedEdu: EducationHistory = {
      ...profile.education,
      college: {
        institutionName: headerForm.college.trim(),
        degree: headerForm.degree.trim(),
        academicYear: headerForm.year.trim(),
        score: headerForm.gpa.trim(),
        scoreType: 'CGPA',
      },
    };
    updateProfile({
      name: headerForm.name.trim(),
      degree: headerForm.degree.trim(),
      year: headerForm.year.trim(),
      gpa: headerForm.gpa.trim(),
      college: headerForm.college.trim(),
      location: headerForm.location.trim(),
      careerGoal: headerForm.careerGoal.trim(),
      education: updatedEdu,
    });
    setIsEditHeaderOpen(false);
  };

  // 2. About & Career Summary Edit Modal State
  const [isEditAboutOpen, setIsEditAboutOpen] = useState(false);
  const [aboutForm, setAboutForm] = useState({
    bio: '',
    careerGoal: '',
  });

  const handleOpenEditAbout = () => {
    setAboutForm({
      bio: profile.bio || '',
      careerGoal: profile.careerGoal || '',
    });
    setIsEditAboutOpen(true);
  };

  const handleSaveAbout = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      bio: aboutForm.bio.trim(),
      careerGoal: aboutForm.careerGoal.trim(),
    });
    setIsEditAboutOpen(false);
  };

  // 3. Education State & Handlers (College, PUC, School)
  // 3a. College Education
  const [isEditCollegeOpen, setIsEditCollegeOpen] = useState(false);
  const [collegeForm, setCollegeForm] = useState({
    institutionName: '',
    degree: '',
    academicYear: '',
    score: '',
  });

  const handleOpenEditCollege = () => {
    setCollegeForm({
      institutionName: profile.education?.college?.institutionName || profile.college || '',
      degree: profile.education?.college?.degree || profile.degree || 'B.Tech',
      academicYear: profile.education?.college?.academicYear || profile.year || '3rd Year',
      score: profile.education?.college?.score || profile.gpa || '',
    });
    setIsEditCollegeOpen(true);
  };

  const handleSaveCollege = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedEdu: EducationHistory = {
      ...profile.education,
      college: {
        institutionName: collegeForm.institutionName.trim(),
        degree: collegeForm.degree.trim(),
        academicYear: collegeForm.academicYear.trim(),
        score: collegeForm.score.trim(),
        scoreType: 'CGPA',
      },
    };
    updateProfile({
      college: collegeForm.institutionName.trim(),
      degree: collegeForm.degree.trim(),
      year: collegeForm.academicYear.trim(),
      gpa: collegeForm.score.trim(),
      education: updatedEdu,
    });
    setIsEditCollegeOpen(false);
  };

  // 3b. PUC / 12th Education
  const [isEditPucOpen, setIsEditPucOpen] = useState(false);
  const [pucForm, setPucForm] = useState({
    institutionName: '',
    course: '',
    academicYear: '',
    score: '',
  });

  const handleOpenEditPuc = () => {
    setPucForm({
      institutionName: profile.education?.puc?.institutionName || '',
      course: profile.education?.puc?.course || 'PCMB',
      academicYear: profile.education?.puc?.academicYear || '2023',
      score: profile.education?.puc?.score || '',
    });
    setIsEditPucOpen(true);
  };

  const handleOpenAddPuc = () => {
    setPucForm({
      institutionName: '',
      course: 'PCMB',
      academicYear: '2023',
      score: '',
    });
    setIsEditPucOpen(true);
  };

  const handleSavePuc = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedEdu: EducationHistory = {
      ...profile.education,
      puc: {
        institutionName: pucForm.institutionName.trim(),
        course: pucForm.course.trim(),
        academicYear: pucForm.academicYear.trim(),
        score: pucForm.score.trim(),
        scoreType: 'Percentage',
      },
    };
    updateProfile({
      education: updatedEdu,
    });
    setIsEditPucOpen(false);
  };

  // 3c. School / 10th Education
  const [isEditSchoolOpen, setIsEditSchoolOpen] = useState(false);
  const [schoolForm, setSchoolForm] = useState({
    institutionName: '',
    board: '',
    academicYear: '',
    score: '',
  });

  const handleOpenEditSchool = () => {
    setSchoolForm({
      institutionName: profile.education?.school?.institutionName || '',
      board: profile.education?.school?.board || 'Karnataka SSLC',
      academicYear: profile.education?.school?.academicYear || '2021',
      score: profile.education?.school?.score || '',
    });
    setIsEditSchoolOpen(true);
  };

  const handleOpenAddSchool = () => {
    setSchoolForm({
      institutionName: '',
      board: 'Karnataka SSLC',
      academicYear: '2021',
      score: '',
    });
    setIsEditSchoolOpen(true);
  };

  const handleSaveSchool = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedEdu: EducationHistory = {
      ...profile.education,
      school: {
        institutionName: schoolForm.institutionName.trim(),
        board: schoolForm.board.trim(),
        academicYear: schoolForm.academicYear.trim(),
        score: schoolForm.score.trim(),
        scoreType: 'Percentage',
      },
    };
    updateProfile({
      education: updatedEdu,
    });
    setIsEditSchoolOpen(false);
  };

  // 4. Contact & Profiles Edit Modal State
  const [isEditContactOpen, setIsEditContactOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    email: '',
    phone: '',
    github: '',
    linkedin: '',
  });

  const handleOpenEditContact = () => {
    setContactForm({
      email: profile.email || '',
      phone: profile.phone || '',
      github: profile.github || '',
      linkedin: profile.linkedin || '',
    });
    setIsEditContactOpen(true);
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      email: contactForm.email.trim(),
      phone: contactForm.phone.trim(),
      github: contactForm.github.trim(),
      linkedin: contactForm.linkedin.trim(),
    });
    setIsEditContactOpen(false);
  };

  // 5. Academic & Hackathon Projects State (Add & Edit)
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    techStack: '',
    githubUrl: '',
    liveUrl: '',
  });

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editProjectForm, setEditProjectForm] = useState({
    title: '',
    description: '',
    techStack: '',
    githubUrl: '',
    liveUrl: '',
  });

  const handleOpenEditProject = (proj: Project) => {
    setEditingProject(proj);
    setEditProjectForm({
      title: proj.title || '',
      description: proj.description || '',
      techStack: Array.isArray(proj.techStack) ? proj.techStack.join(', ') : '',
      githubUrl: proj.githubUrl || '',
      liveUrl: proj.liveUrl || '',
    });
  };

  const handleSaveEditProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    updateProject(editingProject.id, {
      title: editProjectForm.title.trim(),
      description: editProjectForm.description.trim(),
      techStack: editProjectForm.techStack
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      githubUrl: editProjectForm.githubUrl.trim() || 'https://github.com',
      liveUrl: editProjectForm.liveUrl.trim() || undefined,
    });
    setEditingProject(null);
  };

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

  // 6. Skills Overview & Management Modal State
  const [isEditSkillsOpen, setIsEditSkillsOpen] = useState(false);
  const [skillSearchQuery, setSkillSearchQuery] = useState('');
  const [selectedCatalogSkill, setSelectedCatalogSkill] = useState<SkillItem | null>(null);
  const [selectedProficiency, setSelectedProficiency] = useState<'Basic' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [skillAddMessage, setSkillAddMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [modalSkillTab, setModalSkillTab] = useState<'all' | 'verified' | 'claimed'>('all');

  const verifiedSkills = skills.filter((s) => s.isVerified);
  const activeUnverifiedSkills = skills.filter(
    (s) => !s.isVerified && (s.progress > 0 || s.learningStatus === 'in_progress' || s.evidenceSource || s.id.startsWith('custom-'))
  );
  const unverifiedSkills = skills.filter((s) => !s.isVerified);

  // Available catalog skills filtered by search query and category
  const allCatalogSkills: SkillItem[] = useMemo(() => getAllCatalogSkills(), []);

  const catalogCategories: string[] = useMemo(() => {
    const set = new Set<string>();
    allCatalogSkills.forEach((s: SkillItem) => set.add(s.category));
    return ['All', ...Array.from(set).sort()];
  }, [allCatalogSkills]);

  const searchedCatalogSkills: SkillItem[] = useMemo(() => {
    let pool = allCatalogSkills;
    if (selectedCategoryFilter !== 'All') {
      pool = pool.filter((s: SkillItem) => s.category.toLowerCase() === selectedCategoryFilter.toLowerCase());
    }
    const q = skillSearchQuery.toLowerCase().trim();
    if (!q) return pool.slice(0, 10);

    return pool
      .filter((s: SkillItem) => {
        if (s.name.toLowerCase().includes(q)) return true;
        if (s.category.toLowerCase().includes(q)) return true;
        if (s.aliases?.some((a: string) => a.toLowerCase().includes(q))) return true;
        return false;
      })
      .slice(0, 14);
  }, [allCatalogSkills, selectedCategoryFilter, skillSearchQuery]);

  const isSkillAlreadyAdded = (name: string) => {
    const clean = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    return skills.find(
      (s) =>
        s.name.toLowerCase() === name.toLowerCase() ||
        s.name.toLowerCase().replace(/[^a-z0-9]/g, '') === clean ||
        s.aliases?.some((a) => a.toLowerCase().replace(/[^a-z0-9]/g, '') === clean)
    );
  };

  const handleAddSkillToProfile = () => {
    const nameToAdd = selectedCatalogSkill ? selectedCatalogSkill.name : skillSearchQuery.trim();
    if (!nameToAdd) {
      setSkillAddMessage({ text: 'Please select or search a skill.', type: 'error' });
      return;
    }

    const existing = isSkillAlreadyAdded(nameToAdd);
    if (existing) {
      setSkillAddMessage({
        text: `"${existing.name}" is already in your skills profile (${existing.level} Level).`,
        type: 'error',
      });
      return;
    }

    const result = addSkill({
      name: nameToAdd,
      level: selectedProficiency,
      category: selectedCatalogSkill?.category,
      icon: selectedCatalogSkill?.icon,
    });

    if (result.success) {
      setSkillAddMessage({ text: result.message, type: 'success' });
      setSkillSearchQuery('');
      setSelectedCatalogSkill(null);
      setTimeout(() => setSkillAddMessage(null), 4000);
    } else {
      setSkillAddMessage({ text: result.message, type: 'error' });
    }
  };

  const collegeEdu = profile.education?.college || {
    institutionName: profile.college || 'Institution In Progress',
    degree: profile.degree || 'Degree Program',
    academicYear: profile.year || 'Academic Year',
    score: profile.gpa || '',
  };
  const pucEdu = profile.education?.puc;
  const schoolEdu = profile.education?.school;

  return (
    <div className="w-full max-w-[1820px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-8 space-y-8">
      {/* 1. Profile Hero Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-card relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            {/* Avatar */}
            <div
              suppressHydrationWarning
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-brand-teal to-brand-emerald text-white flex items-center justify-center font-black text-2xl sm:text-3xl shadow-md shrink-0"
            >
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
                <h1 suppressHydrationWarning className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  {profile.name}
                </h1>
                <span className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300" title="Verified Student">
                  <CheckCircle2 className="w-5 h-5" />
                </span>
              </div>

              <p suppressHydrationWarning className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                {profile.degree} &bull; {profile.year} ({profile.gpa})
              </p>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 dark:text-slate-400 pt-0.5">
                <span suppressHydrationWarning className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-brand-teal" />
                  {profile.college}
                </span>
                <span suppressHydrationWarning className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {profile.location}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-brand-orange" />
                  Goal: <strong className="text-slate-700 dark:text-slate-200">{profile.careerGoal}</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleOpenEditHeader}
                className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
                title="Edit profile header details"
              >
                <Edit3 className="w-3.5 h-3.5 text-brand-teal dark:text-teal-400" />
                <span>Edit Profile</span>
              </button>

              <Link
                href="/student/resume"
                className="px-4 py-2 rounded-xl bg-brand-teal hover:bg-brand-dark text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>Preview ATS Resume</span>
              </Link>
            </div>

            <div className="text-right text-xs">
              <span className="text-slate-400 dark:text-slate-500 block text-[11px]">SkillSetu ID</span>
              <strong className="text-slate-700 dark:text-slate-300 font-mono">
                {profile.id && !profile.id.includes('aarav')
                  ? profile.id.toUpperCase()
                  : `STD-${(profile.name ? profile.name.slice(0, 3).toUpperCase() : 'GAT')}-${new Date().getFullYear()}`}
              </strong>
            </div>
          </div>
        </div>

        {/* Profile Completion Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-teal" />
              Profile Strength &amp; Completion
            </span>
            <span className="font-black text-brand-teal dark:text-teal-400">{profile.profileCompletion}%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-brand-teal to-brand-emerald h-2.5 rounded-full transition-all duration-700"
              style={{ width: `${profile.profileCompletion}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            Tip: Complete your pending skill assessments to reach 100% verified status.
          </p>
        </div>
      </div>

      {/* 2-Column Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): About, Verified Skills, Projects, Work Experience */}
        <div className="lg:col-span-8 space-y-6">
          {/* About Section */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <User className="w-4 h-4 text-brand-teal" />
                About &amp; Career Summary
              </h3>
              <button
                type="button"
                onClick={handleOpenEditAbout}
                className="text-xs font-semibold text-brand-teal dark:text-teal-400 hover:text-brand-dark dark:hover:text-teal-300 hover:underline flex items-center gap-1 transition-colors"
                title="Edit about & career summary"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit &rarr;</span>
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {profile.bio || 'Add your elevator pitch and career summary to help employers understand your passions and goals.'}
            </p>
          </div>

          {/* Official Verified Skills Badges Section */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  Verified Skill Badges ({verifiedSkills.length})
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Proctored assessments passed with &ge; 70% score on SkillSetu.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditSkillsOpen(true)}
                  className="text-xs font-semibold text-brand-teal dark:text-teal-400 hover:text-brand-dark dark:hover:text-teal-300 hover:underline flex items-center gap-1 transition-colors"
                  title="View and edit skills"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit &rarr;</span>
                </button>
                <Link
                  href="/student/skills"
                  className="text-xs font-bold text-brand-teal dark:text-teal-400 hover:underline hidden sm:inline"
                >
                  Verify More Skills &rarr;
                </Link>
              </div>
            </div>

            {verifiedSkills.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {verifiedSkills.map((sk) => (
                  <div
                    key={sk.id}
                    className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/70 to-teal-50/70 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-300 dark:border-emerald-800/80 flex items-center justify-between shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{sk.icon}</span>
                      <div>
                        <span className="font-bold text-sm text-slate-900 dark:text-white block">{sk.name}</span>
                        <span className="text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          {sk.level} &bull; Verified
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                      {sk.verifiedDate || 'Verified'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-dashed border-slate-200 dark:border-slate-700 text-center py-5">
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
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
            {activeUnverifiedSkills.length > 0 && (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-2">
                  Active Competencies &amp; Skills ({activeUnverifiedSkills.length}):
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeUnverifiedSkills.map((sk) => (
                    <Link
                      key={sk.id}
                      href={`/student/skills/${sk.id}`}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors flex items-center gap-1.5"
                    >
                      <span>{sk.icon}</span>
                      <span>{sk.name}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold uppercase">{sk.level}</span>
                      <span className="text-[10px] text-brand-teal dark:text-teal-400 font-semibold">Verify &rarr;</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Projects Showcase */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
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
              <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-200/60 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center mx-auto">
                  <FolderKanban className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">No projects added yet</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
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
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{proj.title}</h4>
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEditProject(proj)}
                          className="text-xs font-semibold text-brand-teal dark:text-teal-400 hover:text-brand-dark dark:hover:text-teal-300 hover:underline flex items-center gap-1 transition-colors"
                          title="Edit Project"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        {proj.githubUrl && (
                          <a
                            href={proj.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
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
                            className="text-xs font-semibold text-brand-teal dark:text-teal-400 hover:underline flex items-center gap-1"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Live Demo
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => deleteProject(proj.id)}
                          className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{proj.description}</p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {proj.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-[10px] font-medium"
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
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-card space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-brand-teal" />
              Industry &amp; Work Experience
            </h3>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center mx-auto">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                  No major corporate experience yet
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Looking for first industry experience. Recommended starting paths:
                </p>
              </div>

              {/* Recommendations */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-xs">
                <Link
                  href="/student/opportunities"
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-brand-teal dark:hover:border-teal-400 text-slate-800 dark:text-slate-200 font-semibold transition-all hover:shadow-xs"
                >
                  <Rocket className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                  Startup Internships
                </Link>
                <Link
                  href="/student/opportunities"
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-brand-teal dark:hover:border-teal-400 text-slate-800 dark:text-slate-200 font-semibold transition-all hover:shadow-xs"
                >
                  <Zap className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                  Micro-Internships
                </Link>
                <Link
                  href="/student/opportunities"
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-brand-teal dark:hover:border-teal-400 text-slate-800 dark:text-slate-200 font-semibold transition-all hover:shadow-xs"
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
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-brand-teal" />
                Education
              </h3>
            </div>

            <div className="space-y-4 text-xs divide-y divide-slate-100 dark:divide-slate-800/80">
              {/* 1. College / University */}
              <div className="border-l-2 border-brand-teal pl-3 space-y-1 relative pt-1 first:pt-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-teal dark:text-teal-400 block">
                      College / University
                    </span>
                    <strong className="text-slate-900 dark:text-white block font-bold text-sm truncate">
                      {collegeEdu.institutionName}
                    </strong>
                    <p className="text-slate-600 dark:text-slate-300 font-medium">{collegeEdu.degree}</p>
                    <p className="text-slate-400 dark:text-slate-500">{collegeEdu.academicYear}</p>
                    {collegeEdu.score && (
                      <span className="inline-block mt-1 px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                        {collegeEdu.score.toLowerCase().includes('cgpa') || collegeEdu.score.includes('/') || collegeEdu.score.includes('%')
                          ? collegeEdu.score
                          : `${collegeEdu.score} CGPA`}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenEditCollege}
                    className="text-xs font-semibold text-brand-teal dark:text-teal-400 hover:text-brand-dark dark:hover:text-teal-300 hover:underline flex items-center gap-1 transition-colors shrink-0"
                    title="Edit college education details"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit &rarr;</span>
                  </button>
                </div>
              </div>

              {/* 2. PUC / 12th */}
              {pucEdu ? (
                <div className="border-l-2 border-emerald-500 pl-3 space-y-1 relative pt-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                        PUC / 12th
                      </span>
                      <strong className="text-slate-900 dark:text-white block font-bold truncate">
                        {pucEdu.institutionName}
                      </strong>
                      <p className="text-slate-600 dark:text-slate-300">{pucEdu.course || 'PUC / 12th'}</p>
                      <p className="text-slate-400 dark:text-slate-500">{pucEdu.academicYear}</p>
                      {pucEdu.score && (
                        <span className="inline-block mt-1 px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 text-[10px] font-bold">
                          {pucEdu.score.includes('%') ? pucEdu.score : `${pucEdu.score}%`}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleOpenEditPuc}
                      className="text-xs font-semibold text-brand-teal dark:text-teal-400 hover:text-brand-dark dark:hover:text-teal-300 hover:underline flex items-center gap-1 transition-colors shrink-0"
                      title="Edit PUC / 12th details"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit &rarr;</span>
                    </button>
                  </div>
                </div>
              ) : null}

              {/* 3. School / 10th */}
              {schoolEdu ? (
                <div className="border-l-2 border-sky-500 pl-3 space-y-1 relative pt-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 block">
                        School / 10th
                      </span>
                      <strong className="text-slate-900 dark:text-white block font-bold truncate">
                        {schoolEdu.institutionName}
                      </strong>
                      <p className="text-slate-600 dark:text-slate-300">{schoolEdu.board || 'SSLC / 10th'}</p>
                      <p className="text-slate-400 dark:text-slate-500">{schoolEdu.academicYear}</p>
                      {schoolEdu.score && (
                        <span className="inline-block mt-1 px-2 py-0.5 rounded bg-violet-50 dark:bg-violet-950/60 text-violet-800 dark:text-violet-300 text-[10px] font-bold">
                          {schoolEdu.score.includes('%') ? schoolEdu.score : `${schoolEdu.score}%`}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleOpenEditSchool}
                      className="text-xs font-semibold text-brand-teal dark:text-teal-400 hover:text-brand-dark dark:hover:text-teal-300 hover:underline flex items-center gap-1 transition-colors shrink-0"
                      title="Edit school / 10th details"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit &rarr;</span>
                    </button>
                  </div>
                </div>
              ) : null}

              {/* Dynamic Add Buttons for Missing Education Entries */}
              {(!pucEdu || !schoolEdu) && (
                <div className="pt-3 flex flex-wrap gap-2">
                  {!pucEdu && (
                    <button
                      type="button"
                      onClick={handleOpenAddPuc}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-brand-teal dark:hover:border-teal-400 hover:text-brand-teal dark:hover:text-teal-400 hover:bg-brand-teal/5 text-xs font-semibold transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Add PUC / 12th</span>
                    </button>
                  )}
                  {!schoolEdu && (
                    <button
                      type="button"
                      onClick={handleOpenAddSchool}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-brand-teal dark:hover:border-teal-400 hover:text-brand-teal dark:hover:text-teal-400 hover:bg-brand-teal/5 text-xs font-semibold transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Add School / 10th</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Contact & Links */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-teal" />
                Contact &amp; Profiles
              </h3>
              <button
                type="button"
                onClick={handleOpenEditContact}
                className="text-xs font-semibold text-brand-teal dark:text-teal-400 hover:text-brand-dark dark:hover:text-teal-300 hover:underline flex items-center gap-1 transition-colors"
                title="Edit contact & profiles"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit &rarr;</span>
              </button>
            </div>
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                <span className="truncate">{profile.email || 'No email provided'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                <span>{profile.phone || 'No phone provided'}</span>
              </div>
              <div className="flex items-center gap-2">
                <GithubIcon className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                {profile.github ? (
                  <a
                    href={profile.github.startsWith('http') ? profile.github : `https://${profile.github}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand-teal dark:text-teal-400 hover:underline truncate"
                  >
                    {profile.github.replace(/^https?:\/\//, '')}
                  </a>
                ) : (
                  <span className="text-slate-400 dark:text-slate-500 italic">GitHub not linked</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <LinkedinIcon className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                {profile.linkedin ? (
                  <a
                    href={profile.linkedin.startsWith('http') ? profile.linkedin : `https://${profile.linkedin}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand-teal dark:text-teal-400 hover:underline truncate"
                  >
                    {profile.linkedin.replace(/^https?:\/\//, '')}
                  </a>
                ) : (
                  <span className="text-slate-400 dark:text-slate-500 italic">LinkedIn not linked</span>
                )}
              </div>
            </div>
          </div>

          {/* Certifications & Achievements */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-card space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-brand-teal" />
              Certifications &amp; Honors
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  National Skill Intelligence Challenge Finalist
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Ministry of Ayush &bull; Top National Merit</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  SkillSetu Verified Developer Badge
                </span>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">Web &amp; Python Competency</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Project Modal */}
      {isAddProjectOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-brand-teal dark:text-teal-400" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Add Academic / Industry Project</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddProjectOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProjectSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  placeholder="e.g. AYUSH Healthcare Management System"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal outline-none font-sans"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="Describe the problem, your implementation, libraries used, and key features..."
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal outline-none font-sans"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  value={newProject.techStack}
                  onChange={(e) => setNewProject({ ...newProject, techStack: e.target.value })}
                  placeholder="e.g. Next.js, Python, PostgreSQL, TailwindCSS"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal outline-none font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">GitHub Code URL</label>
                  <input
                    type="url"
                    value={newProject.githubUrl}
                    onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                    placeholder="https://github.com/username/project"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal outline-none font-sans"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Live Demo URL (Optional)</label>
                  <input
                    type="url"
                    value={newProject.liveUrl}
                    onChange={(e) => setNewProject({ ...newProject, liveUrl: e.target.value })}
                    placeholder="https://myproject.vercel.app"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal outline-none font-sans"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddProjectOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition-colors"
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

      {/* Edit Profile Header Modal */}
      {isEditHeaderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-brand-teal dark:text-teal-400" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Edit Profile Header</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditHeaderOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveHeader} className="space-y-3.5 text-xs">
              {/* SkillSetu ID Notice */}
              <div className="bg-slate-50 dark:bg-slate-850 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-medium">SkillSetu ID (Immutable)</span>
                  </div>
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                    {profile.id && !profile.id.includes('aarav')
                      ? profile.id.toUpperCase()
                      : `STD-${(profile.name ? profile.name.slice(0, 3).toUpperCase() : 'GAT')}-${new Date().getFullYear()}`}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                  System-assigned student ID linked to your verified credentials.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={headerForm.name}
                  onChange={(e) => setHeaderForm({ ...headerForm, name: e.target.value })}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal outline-none font-sans"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Career Goal *</label>
                <input
                  type="text"
                  required
                  value={headerForm.careerGoal}
                  onChange={(e) => setHeaderForm({ ...headerForm, careerGoal: e.target.value })}
                  placeholder="e.g. Full-Stack Developer & Cloud Architect"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal outline-none font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Degree Program *</label>
                  <input
                    type="text"
                    required
                    value={headerForm.degree}
                    onChange={(e) => setHeaderForm({ ...headerForm, degree: e.target.value })}
                    placeholder="e.g. B.Tech Computer Science"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal outline-none font-sans"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Academic Year *</label>
                  <input
                    type="text"
                    required
                    value={headerForm.year}
                    onChange={(e) => setHeaderForm({ ...headerForm, year: e.target.value })}
                    placeholder="e.g. Final Year / 4th Year"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal outline-none font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Current CGPA / GPA *</label>
                  <input
                    type="text"
                    required
                    value={headerForm.gpa}
                    onChange={(e) => setHeaderForm({ ...headerForm, gpa: e.target.value })}
                    placeholder="e.g. 8.8 CGPA"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal outline-none font-sans"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Location (City, State) *</label>
                  <input
                    type="text"
                    required
                    value={headerForm.location}
                    onChange={(e) => setHeaderForm({ ...headerForm, location: e.target.value })}
                    placeholder="e.g. Bengaluru, Karnataka"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal outline-none font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">College / University Name *</label>
                <input
                  type="text"
                  required
                  value={headerForm.college}
                  onChange={(e) => setHeaderForm({ ...headerForm, college: e.target.value })}
                  placeholder="e.g. RV College of Engineering"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal outline-none font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditHeaderOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-teal hover:bg-brand-dark text-white font-bold shadow-sm transition-colors"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit About & Career Summary Modal */}
      {isEditAboutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-brand-teal dark:text-teal-400" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Edit About &amp; Career Summary</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditAboutOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAbout} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Career Goal</label>
                <input
                  type="text"
                  value={aboutForm.careerGoal}
                  onChange={(e) => setAboutForm({ ...aboutForm, careerGoal: e.target.value })}
                  placeholder="e.g. Full-Stack Developer & Cloud Architect"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal outline-none font-sans"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">About / Bio *</label>
                <textarea
                  required
                  rows={5}
                  value={aboutForm.bio}
                  onChange={(e) => setAboutForm({ ...aboutForm, bio: e.target.value })}
                  placeholder="Describe your background, core technical focus, achievements, and career aspirations..."
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal outline-none font-sans leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditAboutOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-teal hover:bg-brand-dark text-white font-bold shadow-sm transition-colors"
                >
                  Save Summary
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit College Education Modal */}
      {isEditCollegeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-brand-teal dark:text-teal-400" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Edit College Education</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditCollegeOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCollege} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  College / University Name *
                </label>
                <input
                  type="text"
                  required
                  value={collegeForm.institutionName}
                  onChange={(e) => setCollegeForm({ ...collegeForm, institutionName: e.target.value })}
                  placeholder="e.g. Global Academy of Technology"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal outline-none font-sans"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Degree Program &amp; Branch *
                </label>
                <input
                  type="text"
                  required
                  value={collegeForm.degree}
                  onChange={(e) => setCollegeForm({ ...collegeForm, degree: e.target.value })}
                  placeholder="e.g. B.Tech Computer Science &amp; Engineering"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal outline-none font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Academic Year *
                  </label>
                  <input
                    type="text"
                    required
                    value={collegeForm.academicYear}
                    onChange={(e) => setCollegeForm({ ...collegeForm, academicYear: e.target.value })}
                    placeholder="e.g. 3rd Year"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal outline-none font-sans"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    CGPA / Score *
                  </label>
                  <input
                    type="text"
                    required
                    value={collegeForm.score}
                    onChange={(e) => setCollegeForm({ ...collegeForm, score: e.target.value })}
                    placeholder="e.g. 8.4"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal outline-none font-sans"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditCollegeOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-teal hover:bg-brand-dark text-white font-bold shadow-sm transition-colors"
                >
                  Save Education
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit PUC / 12th Details Modal */}
      {isEditPucOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Edit PUC / 12th Details</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditPucOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePuc} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  PUC / College Name *
                </label>
                <input
                  type="text"
                  required
                  value={pucForm.institutionName}
                  onChange={(e) => setPucForm({ ...pucForm, institutionName: e.target.value })}
                  placeholder="e.g. Government Pre-University College"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none font-sans"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Course / Stream *
                </label>
                <input
                  type="text"
                  required
                  value={pucForm.course}
                  onChange={(e) => setPucForm({ ...pucForm, course: e.target.value })}
                  placeholder="e.g. PCMB"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Academic Year *
                  </label>
                  <input
                    type="text"
                    required
                    value={pucForm.academicYear}
                    onChange={(e) => setPucForm({ ...pucForm, academicYear: e.target.value })}
                    placeholder="e.g. 2023"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none font-sans"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Percentage / Score *
                  </label>
                  <input
                    type="text"
                    required
                    value={pucForm.score}
                    onChange={(e) => setPucForm({ ...pucForm, score: e.target.value })}
                    placeholder="e.g. 85%"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none font-sans"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditPucOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-teal hover:bg-brand-dark text-white font-bold shadow-sm transition-colors"
                >
                  Save Education
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit School / 10th Details Modal */}
      {isEditSchoolOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <School className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Edit School / 10th Details</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditSchoolOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSchool} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  School Name *
                </label>
                <input
                  type="text"
                  required
                  value={schoolForm.institutionName}
                  onChange={(e) => setSchoolForm({ ...schoolForm, institutionName: e.target.value })}
                  placeholder="e.g. ABC High School"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 outline-none font-sans"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Board *
                </label>
                <input
                  type="text"
                  required
                  value={schoolForm.board}
                  onChange={(e) => setSchoolForm({ ...schoolForm, board: e.target.value })}
                  placeholder="e.g. Karnataka SSLC"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 outline-none font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Academic Year *
                  </label>
                  <input
                    type="text"
                    required
                    value={schoolForm.academicYear}
                    onChange={(e) => setSchoolForm({ ...schoolForm, academicYear: e.target.value })}
                    placeholder="e.g. 2021"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 outline-none font-sans"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Percentage / Score *
                  </label>
                  <input
                    type="text"
                    required
                    value={schoolForm.score}
                    onChange={(e) => setSchoolForm({ ...schoolForm, score: e.target.value })}
                    placeholder="e.g. 92%"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 outline-none font-sans"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditSchoolOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-teal hover:bg-brand-dark text-white font-bold shadow-sm transition-colors"
                >
                  Save Education
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Contact & Profiles Modal */}
      {isEditContactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-brand-teal dark:text-teal-400" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Edit Contact &amp; Profiles</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditContactOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveContact} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  placeholder="student@example.edu"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal outline-none font-sans"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal outline-none font-sans"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">GitHub Profile Link</label>
                <input
                  type="text"
                  value={contactForm.github}
                  onChange={(e) => setContactForm({ ...contactForm, github: e.target.value })}
                  placeholder="https://github.com/username or username"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal outline-none font-sans"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">LinkedIn Profile Link</label>
                <input
                  type="text"
                  value={contactForm.linkedin}
                  onChange={(e) => setContactForm({ ...contactForm, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/username or username"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal outline-none font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditContactOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-teal hover:bg-brand-dark text-white font-bold shadow-sm transition-colors"
                >
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-brand-teal dark:text-teal-400" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Edit Project Details</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditProject} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  value={editProjectForm.title}
                  onChange={(e) => setEditProjectForm({ ...editProjectForm, title: e.target.value })}
                  placeholder="e.g. AYUSH Healthcare Management System"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal outline-none font-sans"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={editProjectForm.description}
                  onChange={(e) => setEditProjectForm({ ...editProjectForm, description: e.target.value })}
                  placeholder="Describe the problem, your implementation, libraries used, and key features..."
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal outline-none font-sans"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  value={editProjectForm.techStack}
                  onChange={(e) => setEditProjectForm({ ...editProjectForm, techStack: e.target.value })}
                  placeholder="e.g. Next.js, Python, PostgreSQL, TailwindCSS"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal outline-none font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">GitHub Code URL</label>
                  <input
                    type="url"
                    value={editProjectForm.githubUrl}
                    onChange={(e) => setEditProjectForm({ ...editProjectForm, githubUrl: e.target.value })}
                    placeholder="https://github.com/username/project"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal outline-none font-sans"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Live Demo URL (Optional)</label>
                  <input
                    type="url"
                    value={editProjectForm.liveUrl}
                    onChange={(e) => setEditProjectForm({ ...editProjectForm, liveUrl: e.target.value })}
                    placeholder="https://myproject.vercel.app"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal outline-none font-sans"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-teal hover:bg-brand-dark text-white font-bold shadow-sm transition-colors"
                >
                  Update Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Skills Management / Verification Modal */}
      {isEditSkillsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 my-auto max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-brand-teal/10 dark:bg-teal-950/60 flex items-center justify-center text-brand-teal dark:text-teal-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">Skills &amp; Badges Management</h3>
                  <p className="text-[11px] text-slate-500">
                    Add competencies, adjust proficiency, and take assessments to earn verified recruiter badges.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditSkillsOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 1. Add New Skill Form */}
            <div className="bg-slate-50 dark:bg-slate-850/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-brand-teal" />
                  Add Skill from Expanded Catalog
                </span>
                <span className="text-[10px] text-slate-400">
                  150+ Standardized Skills Available
                </span>
              </div>

              {/* Search + Category Filter */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="relative sm:col-span-2">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={skillSearchQuery}
                    onChange={(e) => {
                      setSkillSearchQuery(e.target.value);
                      setSelectedCatalogSkill(null);
                      setSkillAddMessage(null);
                    }}
                    placeholder="Search Python, React, Docker, System Design..."
                    className="w-full pl-8 pr-8 py-2 bg-white dark:bg-slate-900 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-brand-teal"
                  />
                  {skillSearchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSkillSearchQuery('');
                        setSelectedCatalogSkill(null);
                      }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="px-2.5 py-2 bg-white dark:bg-slate-900 rounded-xl text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-brand-teal truncate"
                >
                  {catalogCategories.map((c: string) => (
                    <option key={c} value={c}>
                      {c === 'All' ? 'All Categories' : c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Catalog Suggestions Dropdown/Pills */}
              {searchedCatalogSkills.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">
                    {skillSearchQuery ? 'Matching Skills in Catalog:' : 'Recommended Skills to Add:'}
                  </span>
                  <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
                    {searchedCatalogSkills.map((catSkill: SkillItem) => {
                      const isAdded = isSkillAlreadyAdded(catSkill.name);
                      const isSelected = selectedCatalogSkill?.id === catSkill.id;

                      return (
                        <button
                          key={catSkill.id}
                          type="button"
                          onClick={() => {
                            setSelectedCatalogSkill(catSkill);
                            setSkillSearchQuery(catSkill.name);
                            setSkillAddMessage(null);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1.5 border ${
                            isSelected
                              ? 'bg-brand-teal text-white border-brand-teal shadow-xs'
                              : isAdded
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
                              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-brand-teal/50'
                          }`}
                        >
                          <span>{catSkill.icon}</span>
                          <span>{catSkill.name}</span>
                          {isAdded && (
                            <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400">(Added)</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Proficiency Selection & Add Button */}
              <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 shrink-0">
                    Proficiency:
                  </span>
                  <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700">
                    {(['Basic', 'Intermediate', 'Advanced'] as const).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setSelectedProficiency(lvl)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                          selectedProficiency === lvl
                            ? 'bg-brand-teal text-white shadow-2xs'
                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddSkillToProfile}
                  className="px-4 py-2 bg-brand-teal hover:bg-brand-dark text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Skill to Profile</span>
                </button>
              </div>

              {/* Status/Feedback Alert */}
              {skillAddMessage && (
                <div
                  className={`p-2.5 rounded-xl text-xs flex items-center gap-2 border animate-in fade-in ${
                    skillAddMessage.type === 'success'
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                      : 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                  }`}
                >
                  {skillAddMessage.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  )}
                  <span>{skillAddMessage.text}</span>
                </div>
              )}
            </div>

            {/* 2. Active Skills Management Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setModalSkillTab('all')}
                    className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-colors ${
                      modalSkillTab === 'all'
                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    All Active ({skills.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalSkillTab('verified')}
                    className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-colors ${
                      modalSkillTab === 'verified'
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    Verified ({verifiedSkills.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalSkillTab('claimed')}
                    className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-colors ${
                      modalSkillTab === 'claimed'
                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    Self-Declared / In-Progress ({unverifiedSkills.length})
                  </button>
                </div>
              </div>

              {/* Skills List */}
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {(modalSkillTab === 'verified'
                  ? verifiedSkills
                  : modalSkillTab === 'claimed'
                  ? unverifiedSkills
                  : skills
                ).map((sk) => (
                  <div
                    key={sk.id}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-xl shrink-0">{sk.icon}</span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-slate-900 dark:text-white truncate">
                            {sk.name}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {sk.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px]">
                          {sk.isVerified ? (
                            <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Official Verified Badge &bull; {sk.verifiedScore ? `${sk.verifiedScore}%` : 'Passed'}
                            </span>
                          ) : (
                            <span className="text-slate-500 dark:text-slate-400">
                              Self-Declared &bull; {sk.progress}% Curriculum
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Action: Proficiency level selector or verified badge */}
                    <div className="flex items-center gap-2 shrink-0">
                      {sk.isVerified ? (
                        <div className="text-right">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-extrabold text-[10px] border border-emerald-300 dark:border-emerald-800">
                            <ShieldCheck className="w-3 h-3" />
                            {sk.level}
                          </span>
                          <span className="block text-[9px] text-slate-400 font-mono mt-0.5">
                            {sk.verifiedDate || 'Verified'}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {/* Level dropdown */}
                          <select
                            value={sk.level}
                            onChange={(e) =>
                              updateSkillLevel(sk.id, e.target.value as 'Basic' | 'Intermediate' | 'Advanced')
                            }
                            className="px-2 py-1 bg-white dark:bg-slate-900 rounded-lg text-[11px] font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 focus:outline-hidden"
                          >
                            <option value="Basic">Basic</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                          </select>

                          {/* Verify Link */}
                          <Link
                            href={`/student/skills/${sk.id}`}
                            onClick={() => setIsEditSkillsOpen(false)}
                            className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold text-[11px] transition-colors"
                          >
                            Verify &rarr;
                          </Link>

                          {/* Delete Skill Button */}
                          <button
                            type="button"
                            onClick={() => removeSkill(sk.id)}
                            title="Remove skill from profile"
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Official Policy Banner */}
            <div className="bg-emerald-50/70 dark:bg-emerald-950/30 p-3 rounded-2xl border border-emerald-200 dark:border-emerald-800/50 flex items-start gap-2.5 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong className="text-slate-900 dark:text-white">Accreditation Policy:</strong> Official Verified Badges are earned exclusively through diagnostic assessments (&ge; 70% score) to protect accreditation integrity and recruiter credibility.
              </p>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <Link
                href="/student/skills"
                onClick={() => setIsEditSkillsOpen(false)}
                className="py-2 px-3.5 rounded-xl bg-brand-teal hover:bg-brand-dark text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Go to Skills Assessment Hub &rarr;</span>
              </Link>

              <button
                type="button"
                onClick={() => setIsEditSkillsOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
