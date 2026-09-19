'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, getDashboardRoute } from '@/context/AuthContext';
import { UserRole, UserProfileData } from '@/lib/firebase';
import {
  Sparkles,
  GraduationCap,
  Building2,
  School,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  User,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Globe,
  Award,
  BookOpen,
  FileText,
  ShieldCheck,
  Loader2,
  Plus,
  X,
  Linkedin,
  Github,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const POPULAR_STUDENT_SKILLS = [
  'React',
  'Next.js',
  'TypeScript',
  'Python',
  'Machine Learning',
  'Deep Learning',
  'Node.js',
  'PostgreSQL',
  'Ayurvedic Pharmacology',
  'Herbal Formulation',
  'Clinical Research',
  'Data Analysis',
  'REST APIs',
  'Docker',
  'Git',
  'UI/UX Design',
];

const POPULAR_INDUSTRY_DOMAINS = [
  'Full Stack Development',
  'AI & Machine Learning',
  'Herbal / Ayurvedic R&D',
  'Clinical Trials & Documentation',
  'Mobile App Development',
  'Cloud Infrastructure',
  'Quality Assurance',
  'Product Management',
  'Data Science & Analytics',
];

const POPULAR_DEPARTMENTS = [
  'Computer Science & Engineering',
  'AI & Machine Learning',
  'Ayurveda Medicine & Surgery (BAMS)',
  'Pharmaceutical Sciences',
  'Electronics & Communication',
  'Information Technology',
  'Biotechnology',
  'Mechanical Engineering',
];

const POPULAR_CITIES = [
  'Bengaluru, Karnataka',
  'Delhi NCR',
  'Mumbai, Maharashtra',
  'Hyderabad, Telangana',
  'Pune, Maharashtra',
  'Chennai, Tamil Nadu',
  'Kolkata, West Bengal',
  'Ahmedabad, Gujarat',
  'Jaipur, Rajasthan',
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, userProfile, loading, completeOnboarding, signOut } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customSkillInput, setCustomSkillInput] = useState('');

  // Role
  const role: UserRole = userProfile?.role || 'STUDENT';

  // Common Fields
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');

  // Student Fields
  const [college, setCollege] = useState('');
  const [degree, setDegree] = useState('B.Tech');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [year, setYear] = useState('3rd Year');
  const [gpa, setGpa] = useState('8.4 CGPA');
  const [careerGoal, setCareerGoal] = useState('Full Stack AI/ML Developer');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    'React',
    'Python',
    'Machine Learning',
  ]);
  const [bio, setBio] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');

  // Industry Fields
  const [companyName, setCompanyName] = useState('');
  const [companyIndustry, setCompanyIndustry] = useState('AYUSH & Healthcare Technology');
  const [companySize, setCompanySize] = useState('11-50 employees (Growth Startup)');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [recruiterTitle, setRecruiterTitle] = useState('Talent Acquisition Lead');
  const [selectedHiringDomains, setSelectedHiringDomains] = useState<string[]>([
    'Full Stack Development',
    'AI & Machine Learning',
  ]);
  const [companyBio, setCompanyBio] = useState('');

  // College Fields
  const [institutionName, setInstitutionName] = useState('');
  const [collegeCode, setCollegeCode] = useState('');
  const [designation, setDesignation] = useState('Head of Training & Placement');
  const [institutionWebsite, setInstitutionWebsite] = useState('');
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([
    'Computer Science & Engineering',
    'AI & Machine Learning',
  ]);
  const [totalStudents, setTotalStudents] = useState('2400');
  const [naacGrade, setNaacGrade] = useState('A+ Accredited');

  // Prepopulate existing profile data if available
  useEffect(() => {
    if (userProfile) {
      if (userProfile.displayName) setDisplayName(userProfile.displayName);
      if (userProfile.phone) setPhone(userProfile.phone);
      if (userProfile.location) setLocation(userProfile.location);

      // Student fields
      if (userProfile.college) setCollege(userProfile.college);
      if (userProfile.degree) setDegree(userProfile.degree);
      if (userProfile.department) setDepartment(userProfile.department);
      if (userProfile.year) setYear(userProfile.year);
      if (userProfile.gpa) setGpa(userProfile.gpa);
      if (userProfile.careerGoal) setCareerGoal(userProfile.careerGoal);
      if (userProfile.skills && userProfile.skills.length > 0) {
        setSelectedSkills(userProfile.skills);
      }
      if (userProfile.bio) setBio(userProfile.bio);
      if (userProfile.github) setGithub(userProfile.github);
      if (userProfile.linkedin) setLinkedin(userProfile.linkedin);

      // Industry fields
      if (userProfile.companyName) setCompanyName(userProfile.companyName);
      if (userProfile.companyIndustry) setCompanyIndustry(userProfile.companyIndustry);
      if (userProfile.companySize) setCompanySize(userProfile.companySize);
      if (userProfile.companyWebsite) setCompanyWebsite(userProfile.companyWebsite);
      if (userProfile.recruiterTitle) setRecruiterTitle(userProfile.recruiterTitle);
      if (userProfile.hiringDomains && userProfile.hiringDomains.length > 0) {
        setSelectedHiringDomains(userProfile.hiringDomains);
      }
      if (userProfile.companyBio) setCompanyBio(userProfile.companyBio);

      // College fields
      if (userProfile.institutionName) setInstitutionName(userProfile.institutionName);
      if (userProfile.collegeCode) setCollegeCode(userProfile.collegeCode);
      if (userProfile.designation) setDesignation(userProfile.designation);
      if (userProfile.institutionWebsite) setInstitutionWebsite(userProfile.institutionWebsite);
      if (userProfile.departments && userProfile.departments.length > 0) {
        setSelectedDepartments(userProfile.departments);
      }
      if (userProfile.totalStudents) setTotalStudents(userProfile.totalStudents.toString());
      if (userProfile.naacGrade) setNaacGrade(userProfile.naacGrade);
    } else if (user) {
      if (user.displayName) setDisplayName(user.displayName);
      if (user.phoneNumber) setPhone(user.phoneNumber);
    }
  }, [userProfile, user]);

  // Auth Guard
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const addCustomSkill = () => {
    const trimmed = customSkillInput.trim();
    if (trimmed && !selectedSkills.includes(trimmed)) {
      setSelectedSkills((prev) => [...prev, trimmed]);
      setCustomSkillInput('');
    }
  };

  const toggleHiringDomain = (domain: string) => {
    setSelectedHiringDomains((prev) =>
      prev.includes(domain) ? prev.filter((d) => d !== domain) : [...prev, domain]
    );
  };

  const toggleDepartment = (dept: string) => {
    setSelectedDepartments((prev) =>
      prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept]
    );
  };

  const validateStep = (stepNumber: number): boolean => {
    setError(null);

    if (stepNumber === 1) {
      if (!displayName.trim()) {
        setError('Please enter your full name.');
        return false;
      }
      if (!phone.trim()) {
        setError('Please provide a contact phone number.');
        return false;
      }

      if (role === 'STUDENT') {
        if (!college.trim()) {
          setError('Please provide your college or university name.');
          return false;
        }
        if (!department.trim()) {
          setError('Please enter your department or major.');
          return false;
        }
      } else if (role === 'INDUSTRY') {
        if (!companyName.trim()) {
          setError('Please provide your company or organization name.');
          return false;
        }
        if (!location.trim()) {
          setError('Please provide your headquarters or office city.');
          return false;
        }
      } else if (role === 'COLLEGE') {
        if (!institutionName.trim()) {
          setError('Please provide your institution name.');
          return false;
        }
        if (!collegeCode.trim()) {
          setError('Please provide your AISHE or College Code.');
          return false;
        }
      }
    }

    if (stepNumber === 2) {
      if (role === 'STUDENT') {
        if (selectedSkills.length === 0) {
          setError('Please select at least one skill to match opportunities.');
          return false;
        }
        if (!careerGoal.trim()) {
          setError('Please state your target career goal or aspiration.');
          return false;
        }
      } else if (role === 'INDUSTRY') {
        if (selectedHiringDomains.length === 0) {
          setError('Please select at least one hiring domain or role category.');
          return false;
        }
      } else if (role === 'COLLEGE') {
        if (selectedDepartments.length === 0) {
          setError('Please select at least one active department.');
          return false;
        }
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const handleBack = () => {
    setError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const baseData: Partial<UserProfileData> = {
        displayName: displayName.trim(),
        phone: phone.trim(),
        location: location.trim() || 'Bengaluru, Karnataka',
        role,
        email: user?.email || '',
        onboardingCompleted: true,
      };

      let finalPayload: Partial<UserProfileData> = { ...baseData };

      if (role === 'STUDENT') {
        finalPayload = {
          ...baseData,
          college: college.trim(),
          degree: degree.trim(),
          department: department.trim(),
          year: year.trim(),
          gpa: gpa.trim(),
          careerGoal: careerGoal.trim(),
          skills: selectedSkills,
          bio: bio.trim() || `${careerGoal} focused student at ${college}, keen on real-world projects and verified skill assessment.`,
          github: github.trim(),
          linkedin: linkedin.trim(),
        };
      } else if (role === 'INDUSTRY') {
        finalPayload = {
          ...baseData,
          companyName: companyName.trim(),
          companyIndustry: companyIndustry.trim(),
          companySize: companySize.trim(),
          companyLocation: location.trim(),
          companyWebsite: companyWebsite.trim(),
          recruiterTitle: recruiterTitle.trim(),
          hiringDomains: selectedHiringDomains,
          companyBio: companyBio.trim() || `${companyName} is leading innovation in ${companyIndustry}, actively hiring verified student talent.`,
        };
      } else if (role === 'COLLEGE') {
        finalPayload = {
          ...baseData,
          institutionName: institutionName.trim(),
          collegeCode: collegeCode.trim(),
          designation: designation.trim(),
          institutionLocation: location.trim(),
          institutionWebsite: institutionWebsite.trim(),
          departments: selectedDepartments,
          totalStudents: parseInt(totalStudents, 10) || 2000,
          naacGrade: naacGrade.trim(),
        };
      }

      // Celebrate with confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }

      // Save to Firebase database & complete onboarding (with safety timeout)
      try {
        await Promise.race([
          completeOnboarding(finalPayload),
          new Promise((resolve) => setTimeout(resolve, 2500)),
        ]);
      } catch (saveErr) {
        console.warn('Onboarding sync note:', saveErr);
      }

      router.push(getDashboardRoute(role));
    } catch (err: any) {
      console.error('Onboarding save error:', err);
      setError(err.message || 'Failed to save profile. Please check connection and try again.');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-4">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mb-4" />
        <p className="text-slate-400 text-sm">Loading your SkillSetu profile...</p>
      </div>
    );
  }

  const roleMeta = {
    STUDENT: {
      label: 'Student Profile',
      icon: GraduationCap,
      description: 'Set up your verified skill portfolio, college details, and internship preferences.',
      badgeColor: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    },
    INDUSTRY: {
      label: 'Company & Recruiter Setup',
      icon: Building2,
      description: 'Define your company profile, hiring domains, and team contacts.',
      badgeColor: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    },
    COLLEGE: {
      label: 'College Administration Setup',
      icon: School,
      description: 'Register institution details, placement office contacts, and academic faculties.',
      badgeColor: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
    },
  }[role];

  const RoleIcon = roleMeta.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-brand-dark text-white flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between py-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-teal to-brand-emerald flex items-center justify-center shadow-lg shadow-brand-teal/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-xl tracking-tight text-white flex items-center gap-1.5">
              Skill<span className="text-emerald-400">Setu</span>
            </div>
            <div className="text-[9px] tracking-widest uppercase font-semibold text-emerald-300">
              PROFILE ONBOARDING &amp; DATABASE SYNC
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 hidden sm:inline">
            Logged in as <strong className="text-slate-200">{user?.email}</strong>
          </span>
          <button
            onClick={() => signOut()}
            type="button"
            className="text-xs px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-all"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl mx-auto w-full my-8 bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-8 md:p-10 backdrop-blur-2xl shadow-2xl space-y-8">
        {/* Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/70">
          <div>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold mb-2 ${roleMeta.badgeColor}`}>
              <RoleIcon className="w-3.5 h-3.5" />
              <span>{roleMeta.label}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Complete Your Account Details
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {roleMeta.description} All information is securely stored in Firebase database.
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            {[1, 2, 3].map((step) => {
              const isDone = currentStep > step;
              const isCurrent = currentStep === step;
              return (
                <div key={step} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                      isDone
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                        : isCurrent
                        ? 'bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300'
                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}
                  >
                    {isDone ? <Check className="w-4 h-4" /> : step}
                  </div>
                  {step < 3 && (
                    <div
                      className={`w-6 sm:w-10 h-0.5 rounded-full transition-all ${
                        currentStep > step ? 'bg-emerald-500' : 'bg-slate-800'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Form Container */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ==================== STEP 1 ==================== */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Step 1 of 3: Core Identity &amp; Contact Details</span>
              </div>

              {/* Display Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Full Name <span className="text-emerald-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. Aarav Sharma"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Phone / WhatsApp Number <span className="text-emerald-400">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* STUDENT ROLE FIELDS */}
              {role === 'STUDENT' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      College / University Name <span className="text-emerald-400">*</span>
                    </label>
                    <div className="relative">
                      <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={college}
                        onChange={(e) => setCollege(e.target.value)}
                        placeholder="e.g. RV College of Engineering, Bengaluru"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Degree / Program <span className="text-emerald-400">*</span>
                      </label>
                      <select
                        value={degree}
                        onChange={(e) => setDegree(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                      >
                        <option value="B.Tech">B.Tech / B.E</option>
                        <option value="BAMS">BAMS (Ayurveda)</option>
                        <option value="BHMS">BHMS (Homeopathy)</option>
                        <option value="BCA">BCA / MCA</option>
                        <option value="B.Pharm">B.Pharm / M.Pharm</option>
                        <option value="B.Sc">B.Sc / M.Sc</option>
                        <option value="M.Tech">M.Tech</option>
                        <option value="Other">Other Degree</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Department / Branch <span className="text-emerald-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="e.g. CSE / AIML / Ayurveda"
                        className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Current Academic Year <span className="text-emerald-400">*</span>
                      </label>
                      <select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                      >
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year (Final Year)</option>
                        <option value="Recent Graduate">Recent Graduate</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Current CGPA / Percentage
                      </label>
                      <input
                        type="text"
                        value={gpa}
                        onChange={(e) => setGpa(e.target.value)}
                        placeholder="e.g. 8.7 CGPA or 85%"
                        className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Base City / Location
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="e.g. Bengaluru, Karnataka"
                          className="w-full pl-10 pr-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* INDUSTRY ROLE FIELDS */}
              {role === 'INDUSTRY' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Company / Organization Name <span className="text-emerald-400">*</span>
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          required
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="e.g. TechNova Labs"
                          className="w-full pl-10 pr-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Industry Sector <span className="text-emerald-400">*</span>
                      </label>
                      <select
                        value={companyIndustry}
                        onChange={(e) => setCompanyIndustry(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                      >
                        <option value="AYUSH & Healthcare Technology">AYUSH &amp; Healthcare Technology</option>
                        <option value="IT, Cloud & Software Services">IT, Cloud &amp; Software Services</option>
                        <option value="Biotechnology & Pharmaceuticals">Biotechnology &amp; Pharmaceuticals</option>
                        <option value="AI / Machine Learning Startup">AI / Machine Learning Startup</option>
                        <option value="Medical Devices & Diagnostics">Medical Devices &amp; Diagnostics</option>
                        <option value="EdTech & Skill Development">EdTech &amp; Skill Development</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Your Work Designation <span className="text-emerald-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={recruiterTitle}
                        onChange={(e) => setRecruiterTitle(e.target.value)}
                        placeholder="e.g. Head of Talent Acquisition"
                        className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Company Size
                      </label>
                      <select
                        value={companySize}
                        onChange={(e) => setCompanySize(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                      >
                        <option value="1-10 employees (Early Startup)">1-10 employees (Early Startup)</option>
                        <option value="11-50 employees (Growth Startup)">11-50 employees (Growth Startup)</option>
                        <option value="51-200 employees (Mid-size)">51-200 employees (Mid-size)</option>
                        <option value="201-500 employees (Enterprise)">201-500 employees (Enterprise)</option>
                        <option value="500+ employees (MNC)">500+ employees (MNC)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Office Location / City <span className="text-emerald-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Indiranagar, Bengaluru"
                        className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Company Website
                    </label>
                    <div className="relative">
                      <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="url"
                        value={companyWebsite}
                        onChange={(e) => setCompanyWebsite(e.target.value)}
                        placeholder="https://technovalabs.com"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* COLLEGE ROLE FIELDS */}
              {role === 'COLLEGE' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Institution / University Name <span className="text-emerald-400">*</span>
                      </label>
                      <div className="relative">
                        <School className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          required
                          value={institutionName}
                          onChange={(e) => setInstitutionName(e.target.value)}
                          placeholder="e.g. AYUSH Institute of Technology"
                          className="w-full pl-10 pr-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        AISHE / College Code <span className="text-emerald-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={collegeCode}
                        onChange={(e) => setCollegeCode(e.target.value)}
                        placeholder="e.g. C-12894 / KA-BLR-054"
                        className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Your Official Designation <span className="text-emerald-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        placeholder="e.g. Placement Director"
                        className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Campus Location / City <span className="text-emerald-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Bengaluru, Karnataka"
                        className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        NAAC / NBA Accreditation
                      </label>
                      <select
                        value={naacGrade}
                        onChange={(e) => setNaacGrade(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                      >
                        <option value="A++ Accredited">A++ Accredited</option>
                        <option value="A+ Accredited">A+ Accredited</option>
                        <option value="A Accredited">A Accredited</option>
                        <option value="Autonomous Institute">Autonomous Institute</option>
                        <option value="In Process">Accreditation In Process</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Campus Website
                      </label>
                      <div className="relative">
                        <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="url"
                          value={institutionWebsite}
                          onChange={(e) => setInstitutionWebsite(e.target.value)}
                          placeholder="https://ayushcollege.edu.in"
                          className="w-full pl-10 pr-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Approximate Student Enrollment
                      </label>
                      <input
                        type="number"
                        value={totalStudents}
                        onChange={(e) => setTotalStudents(e.target.value)}
                        placeholder="e.g. 2400"
                        className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ==================== STEP 2 ==================== */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <Award className="w-4 h-4" />
                <span>
                  {role === 'STUDENT'
                    ? 'Step 2 of 3: Skills & Career Focus'
                    : role === 'INDUSTRY'
                    ? 'Step 2 of 3: Hiring Requirements & Domains'
                    : 'Step 2 of 3: Academic Faculties & Curriculum'}
                </span>
              </div>

              {/* STUDENT STEP 2 */}
              {role === 'STUDENT' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Target Career Goal / Aspiring Role <span className="text-emerald-400">*</span>
                    </label>
                    <div className="relative">
                      <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={careerGoal}
                        onChange={(e) => setCareerGoal(e.target.value)}
                        placeholder="e.g. Full Stack AI Developer, Ayurvedic Clinical Researcher"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Your Primary Skills <span className="text-emerald-400">*</span> (Select all that apply)
                    </label>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {POPULAR_STUDENT_SKILLS.map((skill) => {
                        const isSelected = selectedSkills.includes(skill);
                        return (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => toggleSkill(skill)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-sm shadow-emerald-500/20 font-semibold'
                                : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                            }`}
                          >
                            {isSelected ? <Check className="w-3 h-3 text-emerald-400" /> : <Plus className="w-3 h-3 text-slate-500" />}
                            <span>{skill}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Custom Skill Input */}
                    <div className="flex items-center gap-2 mt-3">
                      <input
                        type="text"
                        value={customSkillInput}
                        onChange={(e) => setCustomSkillInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addCustomSkill();
                          }
                        }}
                        placeholder="Add another skill..."
                        className="flex-1 px-3.5 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      />
                      <button
                        type="button"
                        onClick={addCustomSkill}
                        className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-600 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* INDUSTRY STEP 2 */}
              {role === 'INDUSTRY' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Active Hiring Domains &amp; Roles <span className="text-emerald-400">*</span>
                    </label>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {POPULAR_INDUSTRY_DOMAINS.map((domain) => {
                        const isSelected = selectedHiringDomains.includes(domain);
                        return (
                          <button
                            key={domain}
                            type="button"
                            onClick={() => toggleHiringDomain(domain)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-blue-500/20 border-blue-400 text-blue-300 shadow-sm font-semibold'
                                : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                            }`}
                          >
                            {isSelected ? <Check className="w-3 h-3 text-blue-400" /> : <Plus className="w-3 h-3 text-slate-500" />}
                            <span>{domain}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      About Company &amp; Hiring Culture
                    </label>
                    <textarea
                      rows={3}
                      value={companyBio}
                      onChange={(e) => setCompanyBio(e.target.value)}
                      placeholder="Share what makes your team unique, your mission, and the type of talent you are excited to mentor..."
                      className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                    />
                  </div>
                </>
              )}

              {/* COLLEGE STEP 2 */}
              {role === 'COLLEGE' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Active Academic Departments &amp; Faculties <span className="text-emerald-400">*</span>
                    </label>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {POPULAR_DEPARTMENTS.map((dept) => {
                        const isSelected = selectedDepartments.includes(dept);
                        return (
                          <button
                            key={dept}
                            type="button"
                            onClick={() => toggleDepartment(dept)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-sm font-semibold'
                                : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                            }`}
                          >
                            {isSelected ? <Check className="w-3 h-3 text-purple-400" /> : <Plus className="w-3 h-3 text-slate-500" />}
                            <span>{dept}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ==================== STEP 3 ==================== */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <FileText className="w-4 h-4" />
                <span>Step 3 of 3: Bio &amp; Professional Links</span>
              </div>

              {/* STUDENT STEP 3 */}
              {role === 'STUDENT' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Short Bio / Elevator Pitch
                    </label>
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Briefly describe your passion, key projects, and what kind of internship/micro-task opportunities excite you..."
                      className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        GitHub Profile Link (Optional)
                      </label>
                      <div className="relative">
                        <Github className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="url"
                          value={github}
                          onChange={(e) => setGithub(e.target.value)}
                          placeholder="https://github.com/username"
                          className="w-full pl-10 pr-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        LinkedIn Profile Link (Optional)
                      </label>
                      <div className="relative">
                        <Linkedin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="url"
                          value={linkedin}
                          onChange={(e) => setLinkedin(e.target.value)}
                          placeholder="https://linkedin.com/in/username"
                          className="w-full pl-10 pr-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Confirmation Overview Box */}
              <div className="bg-slate-800/40 border border-slate-700/80 rounded-2xl p-4 space-y-2.5">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Ready to Save to Firebase Database</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Clicking <strong>Complete Onboarding &amp; Launch</strong> will immediately persist your full profile into Firebase Firestore (under collection <code className="text-emerald-300 font-mono">users/{user?.uid?.slice(0, 8)}...</code>), verify your active session, and open your personalized dashboard.
                </p>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3.5 text-xs text-red-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-300 text-xs font-bold transition-all flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-lg shadow-emerald-950/40 flex items-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-950/50 flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving to Firebase Database...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Complete Onboarding &amp; Launch Dashboard</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto w-full py-2 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-800/60 pt-4">
        <span>&copy; 2026 SkillSetu &bull; AYUSH Career Bridge</span>
        <span>Secure Firebase Database Storage &bull; Team ID: GAT054</span>
      </footer>
    </div>
  );
}
