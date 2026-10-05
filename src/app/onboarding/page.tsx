'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, getDashboardRoute } from '@/context/AuthContext';
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
  ChevronDown,
  Search,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LocationSuggestion } from '@/app/api/locations/autocomplete/route';
import { CollegeAutocomplete } from '@/components/onboarding/CollegeAutocomplete';
import { CollegeItem, searchColleges } from '@/data/collegesData';

interface OnboardingPayload {
  displayName: string;
  countryCode: string;
  phoneNumber: string;
  phone: string;
  location: string;
  locationDetails: {
    city?: string;
    state?: string;
    country?: string;
    displayName?: string;
    latitude?: number;
    longitude?: number;
  };
  role: 'STUDENT' | 'INDUSTRY' | 'COLLEGE';
  email: string;
  onboardingCompleted: boolean;
  // Student-specific
  college?: string;
  collegeId?: string;
  collegeDetails?: {
    id: string;
    name: string;
    city: string;
    state: string;
    type?: string;
    university?: string;
    affiliation?: string;
    institutionType?: string;
  };
  degree?: string;
  department?: string;
  year?: string;
  gpa?: string;
  careerGoal?: string;
  skills?: string[];
  bio?: string;
  github?: string;
  linkedin?: string;
  // Industry-specific
  companyName?: string;
  companyIndustry?: string;
  companySize?: string;
  companyLocation?: string;
  companyWebsite?: string;
  recruiterTitle?: string;
  hiringDomains?: string[];
  companyBio?: string;
  // College-specific
  institutionName?: string;
  collegeCode?: string;
  designation?: string;
  institutionLocation?: string;
  institutionWebsite?: string;
  departments?: string[];
  totalStudents?: number;
  naacGrade?: string;
}

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

interface CountryOption {
  code: string;
  name: string;
  flag: string;
  iso: string;
  minLength: number;
  maxLength: number;
  placeholder: string;
}

const COUNTRY_OPTIONS: CountryOption[] = [
  { code: '+91', name: 'India', flag: '🇮🇳', iso: 'IN', minLength: 10, maxLength: 10, placeholder: '9876543210' },
  { code: '+1', name: 'United States', flag: '🇺🇸', iso: 'US', minLength: 10, maxLength: 10, placeholder: '2025550143' },
  { code: '+44', name: 'United Kingdom', flag: '🇬🇧', iso: 'GB', minLength: 10, maxLength: 10, placeholder: '7911123456' },
  { code: '+61', name: 'Australia', flag: '🇦🇺', iso: 'AU', minLength: 9, maxLength: 9, placeholder: '412345678' },
  { code: '+1', name: 'Canada', flag: '🇨🇦', iso: 'CA', minLength: 10, maxLength: 10, placeholder: '4165550198' },
  { code: '+971', name: 'United Arab Emirates', flag: '🇦🇪', iso: 'AE', minLength: 9, maxLength: 9, placeholder: '501234567' },
  { code: '+65', name: 'Singapore', flag: '🇸🇬', iso: 'SG', minLength: 8, maxLength: 8, placeholder: '81234567' },
  { code: '+49', name: 'Germany', flag: '🇩🇪', iso: 'DE', minLength: 10, maxLength: 11, placeholder: '15123456789' },
  { code: '+33', name: 'France', flag: '🇫🇷', iso: 'FR', minLength: 9, maxLength: 9, placeholder: '612345678' },
  { code: '+81', name: 'Japan', flag: '🇯🇵', iso: 'JP', minLength: 10, maxLength: 10, placeholder: '9012345678' },
  { code: '+966', name: 'Saudi Arabia', flag: '🇸🇦', iso: 'SA', minLength: 9, maxLength: 9, placeholder: '501234567' },
  { code: '+974', name: 'Qatar', flag: '🇶🇦', iso: 'QA', minLength: 8, maxLength: 8, placeholder: '33123456' },
  { code: '+60', name: 'Malaysia', flag: '🇲🇾', iso: 'MY', minLength: 9, maxLength: 10, placeholder: '123456789' },
  { code: '+64', name: 'New Zealand', flag: '🇳🇿', iso: 'NZ', minLength: 9, maxLength: 10, placeholder: '211234567' },
  { code: '+31', name: 'Netherlands', flag: '🇳🇱', iso: 'NL', minLength: 9, maxLength: 9, placeholder: '612345678' },
  { code: '+41', name: 'Switzerland', flag: '🇨🇭', iso: 'CH', minLength: 9, maxLength: 9, placeholder: '781234567' },
  { code: '+880', name: 'Bangladesh', flag: '🇧🇩', iso: 'BD', minLength: 10, maxLength: 10, placeholder: '1712345678' },
  { code: '+977', name: 'Nepal', flag: '🇳🇵', iso: 'NP', minLength: 10, maxLength: 10, placeholder: '9841234567' },
  { code: '+94', name: 'Sri Lanka', flag: '🇱🇰', iso: 'LK', minLength: 9, maxLength: 9, placeholder: '712345678' },
];

function parseStoredPhone(phoneStr: string): { country: CountryOption; number: string } {
  const clean = (phoneStr || '').trim();
  if (!clean) {
    return { country: COUNTRY_OPTIONS[0], number: '' };
  }

  for (const opt of COUNTRY_OPTIONS) {
    if (clean.startsWith(opt.code)) {
      const rest = clean.slice(opt.code.length).replace(/\D/g, '');
      return { country: opt, number: rest.slice(0, opt.maxLength) };
    }
  }

  const digitsOnly = clean.replace(/\D/g, '');
  if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) {
    return { country: COUNTRY_OPTIONS[0], number: digitsOnly.slice(2) };
  }
  if (digitsOnly.length === 11 && digitsOnly.startsWith('0')) {
    return { country: COUNTRY_OPTIONS[0], number: digitsOnly.slice(1) };
  }

  return { country: COUNTRY_OPTIONS[0], number: digitsOnly.slice(0, 10) };
}

function getPhoneValidationError(digits: string, country: CountryOption): string | null {
  if (!digits || digits.trim() === '') {
    return 'Please provide a contact phone number.';
  }

  if (country.code === '+91') {
    if (digits.length !== 10) {
      return 'Phone number must contain exactly 10 digits.';
    }
    return null;
  }

  if (country.minLength === country.maxLength) {
    if (digits.length !== country.minLength) {
      return `Phone number must contain exactly ${country.minLength} digits.`;
    }
  } else {
    if (digits.length < country.minLength || digits.length > country.maxLength) {
      return `Phone number must contain between ${country.minLength} and ${country.maxLength} digits.`;
    }
  }

  return null;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { user, identity, loading, completeOnboarding, signOut } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customSkillInput, setCustomSkillInput] = useState('');

  // Role from PostgreSQL identity
  const role = (identity?.role?.toUpperCase() as 'STUDENT' | 'INDUSTRY' | 'COLLEGE') || 'STUDENT';

  // Common Fields
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');

  // International Phone Input State
  const [selectedCountry, setSelectedCountry] = useState<CountryOption>(COUNTRY_OPTIONS[0]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearchQuery, setCountrySearchQuery] = useState('');
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [step1Attempted, setStep1Attempted] = useState(false);

  // Real City / Location Autocomplete State
  const [locationTouched, setLocationTouched] = useState(false);
  const [selectedLocationDetails, setSelectedLocationDetails] = useState<{
    city?: string;
    state?: string;
    country?: string;
    displayName?: string;
    latitude?: number;
    longitude?: number;
  } | null>(null);
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [highlightedLocationIndex, setHighlightedLocationIndex] = useState(-1);
  const [locationSearchError, setLocationSearchError] = useState<string | null>(null);
  const locationDropdownRef = useRef<HTMLDivElement>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Student Fields
  const [college, setCollege] = useState('');
  const [selectedCollege, setSelectedCollege] = useState<CollegeItem | null>(null);
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

  // Prepopulate from identity (basic account fields only)
  useEffect(() => {
    if (identity) {
      if (identity.displayName) setDisplayName(identity.displayName);

      // Handle Phone
      if (identity.phone) {
        const parsed = parseStoredPhone(identity.phone);
        setSelectedCountry(parsed.country);
        setPhoneNumber(parsed.number);
        setPhone(identity.phone);
      }
    }
  }, [identity]);

  // Click outside listener for country and location dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCountryDropdownOpen(false);
      }
      if (
        locationDropdownRef.current &&
        !locationDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLocationDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Auth Guard
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > selectedCountry.maxLength) {
      val = val.slice(0, selectedCountry.maxLength);
    }
    setPhoneNumber(val);
    setPhone(`${selectedCountry.code} ${val}`);
    if (error && (error.toLowerCase().includes('phone') || error.toLowerCase().includes('contact'))) {
      setError(null);
    }
  };

  const handlePhonePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text') || '';
    let cleaned = pasted.replace(/\D/g, '');

    if (selectedCountry.code === '+91') {
      if (cleaned.length === 12 && cleaned.startsWith('91')) {
        cleaned = cleaned.slice(2);
      } else if (cleaned.length === 11 && cleaned.startsWith('0')) {
        cleaned = cleaned.slice(1);
      }
      cleaned = cleaned.slice(0, 10);
    } else {
      cleaned = cleaned.slice(0, selectedCountry.maxLength);
    }

    setPhoneNumber(cleaned);
    setPhone(`${selectedCountry.code} ${cleaned}`);
    if (error && (error.toLowerCase().includes('phone') || error.toLowerCase().includes('contact'))) {
      setError(null);
    }
  };

  const fetchLocationSuggestions = useCallback((query: string) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const trimmed = query.trim();
    if (trimmed.length < 3) {
      setLocationSuggestions([]);
      setIsSearchingLocation(false);
      setIsLocationDropdownOpen(false);
      return;
    }

    setIsSearchingLocation(true);
    setLocationSearchError(null);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    fetch(`/api/locations/autocomplete?q=${encodeURIComponent(trimmed)}`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch locations');
        return res.json();
      })
      .then((data) => {
        const suggestions = (data.suggestions || []) as LocationSuggestion[];
        setLocationSuggestions(suggestions);
        setIsSearchingLocation(false);
        setIsLocationDropdownOpen(true);
        setHighlightedLocationIndex(-1);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setIsSearchingLocation(false);
        setLocationSearchError('Could not load suggestions. You can still type your city manually.');
      });
  }, []);

  const handleLocationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocation(val);
    setSelectedLocationDetails({
      city: val.split(',')[0]?.trim() || val.trim(),
      displayName: val.trim(),
    });

    if (error && (error.toLowerCase().includes('location') || error.toLowerCase().includes('city'))) {
      setError(null);
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (val.trim().length >= 3) {
      setIsSearchingLocation(true);
      debounceTimerRef.current = setTimeout(() => {
        fetchLocationSuggestions(val);
      }, 350);
    } else {
      setIsSearchingLocation(false);
      setLocationSuggestions([]);
      setIsLocationDropdownOpen(false);
    }
  };

  const selectLocationSuggestion = (sug: LocationSuggestion) => {
    setLocation(sug.displayName);
    setSelectedLocationDetails({
      city: sug.city,
      state: sug.state,
      country: sug.country,
      displayName: sug.displayName,
      latitude: sug.latitude,
      longitude: sug.longitude,
    });
    setIsLocationDropdownOpen(false);
    setLocationSuggestions([]);
    if (error && (error.toLowerCase().includes('location') || error.toLowerCase().includes('city'))) {
      setError(null);
    }
  };

  const handleLocationKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isLocationDropdownOpen || locationSuggestions.length === 0) {
      if (e.key === 'ArrowDown' && location.trim().length >= 3) {
        setIsLocationDropdownOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedLocationIndex((prev) =>
        prev < locationSuggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedLocationIndex((prev) =>
        prev > 0 ? prev - 1 : locationSuggestions.length - 1
      );
    } else if (e.key === 'Enter') {
      if (highlightedLocationIndex >= 0 && locationSuggestions[highlightedLocationIndex]) {
        e.preventDefault();
        selectLocationSuggestion(locationSuggestions[highlightedLocationIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsLocationDropdownOpen(false);
    }
  };

  const filteredCountries = COUNTRY_OPTIONS.filter((c) => {
    const q = countrySearchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.iso.toLowerCase().includes(q)
    );
  });

  const phoneError = getPhoneValidationError(phoneNumber, selectedCountry);
  const showPhoneError = (phoneTouched || step1Attempted) && !!phoneError;
  const showLocationError = (locationTouched || step1Attempted) && !location.trim();

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
      setStep1Attempted(true);

      if (!displayName.trim()) {
        setError('Please enter your full name.');
        return false;
      }

      const phoneErr = getPhoneValidationError(phoneNumber, selectedCountry);
      if (phoneErr) {
        setError(phoneErr);
        return false;
      }

      if (role === 'STUDENT') {
        if (!college.trim()) {
          setError('Please search and select your college or university from the list.');
          return false;
        }
        const matched = selectedCollege || searchColleges(college.trim(), 1)[0];
        if (!matched) {
          setError('Please select a verified college or university from the dropdown list.');
          return false;
        }
        if (!selectedCollege && matched) {
          setSelectedCollege(matched);
        }
        if (!degree.trim()) {
          setError('Please select your degree or program.');
          return false;
        }
        if (!department.trim()) {
          setError('Please enter your department or major.');
          return false;
        }
        if (!year.trim()) {
          setError('Please select your current academic year.');
          return false;
        }
        if (!location.trim()) {
          setError('Please provide your base city / location.');
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
        if (!location.trim()) {
          setError('Please provide your campus location or city.');
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

  const renderLocationAutocomplete = (
    label: string,
    placeholder = 'e.g. Bengaluru, Karnataka',
    required = true
  ) => {
    return (
      <div className="relative" ref={locationDropdownRef}>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            {label} {required && <span className="text-emerald-600 dark:text-emerald-400">*</span>}
          </label>
          {selectedLocationDetails?.state && (
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium truncate max-w-[200px]">
              {[selectedLocationDetails.city, selectedLocationDetails.state, selectedLocationDetails.country]
                .filter(Boolean)
                .join(', ')}
            </span>
          )}
        </div>
        <div className="relative">
          <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            ref={locationInputRef}
            type="text"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={isLocationDropdownOpen}
            aria-haspopup="listbox"
            aria-controls="location-suggestions-listbox"
            aria-activedescendant={
              highlightedLocationIndex >= 0 ? `location-opt-${highlightedLocationIndex}` : undefined
            }
            aria-invalid={showLocationError}
            aria-describedby={showLocationError ? 'location-error-msg' : 'location-help-msg'}
            required={required}
            value={location}
            onChange={handleLocationInputChange}
            onFocus={() => {
              if (locationSuggestions.length > 0) setIsLocationDropdownOpen(true);
            }}
            onBlur={() => setLocationTouched(true)}
            onKeyDown={handleLocationKeyDown}
            placeholder={placeholder}
            autoComplete="off"
            className={`w-full pl-10 pr-9 py-2.5 bg-white dark:bg-slate-800/90 border rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 font-sans transition-all ${
              showLocationError
                ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                : 'border-slate-300 dark:border-slate-700 focus:ring-emerald-600/20 dark:focus:ring-emerald-500/20 focus:border-emerald-600 dark:focus:border-emerald-500'
            }`}
          />
          {isSearchingLocation && (
            <div className="absolute right-3 top-3">
              <Loader2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-spin" />
            </div>
          )}
        </div>

        {/* Location Suggestions Dropdown */}
        {isLocationDropdownOpen && (
          <div
            id="location-suggestions-listbox"
            role="listbox"
            aria-label="Location suggestions"
            className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800"
          >
            {locationSuggestions.length > 0 ? (
              locationSuggestions.map((sug, idx) => {
                const isHighlighted = idx === highlightedLocationIndex;
                return (
                  <button
                    key={`${sug.displayName}-${idx}`}
                    id={`location-opt-${idx}`}
                    role="option"
                    aria-selected={isHighlighted}
                    type="button"
                    onClick={() => selectLocationSuggestion(sug)}
                    onMouseEnter={() => setHighlightedLocationIndex(idx)}
                    className={`w-full text-left px-3.5 py-2.5 flex items-start gap-2.5 transition-colors ${
                      isHighlighted
                        ? 'bg-emerald-50 dark:bg-slate-800 text-slate-900 dark:text-white'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <MapPin
                      className={`w-4 h-4 mt-0.5 shrink-0 ${
                        isHighlighted ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {sug.city || sug.displayName.split(',')[0]}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {[sug.state, sug.country].filter(Boolean).join(', ') || sug.displayName}
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-3 text-xs text-slate-500 dark:text-slate-400 text-center">
                {locationSearchError || 'No matching locations found. You can keep your manually entered city.'}
              </div>
            )}
          </div>
        )}

        {showLocationError ? (
          <p id="location-error-msg" className="text-[11px] text-red-600 dark:text-red-400 mt-1.5 flex items-center gap-1.5 animate-in fade-in duration-200">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Please provide your {label.toLowerCase()}.</span>
          </p>
        ) : (
          <p id="location-help-msg" className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
            Type 3+ letters to search real verified cities
          </p>
        )}
      </div>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const fullNormalizedPhone = `${selectedCountry.code} ${phoneNumber.trim()}`;
      const baseData: OnboardingPayload = {
        displayName: displayName.trim(),
        countryCode: selectedCountry.code,
        phoneNumber: phoneNumber.trim(),
        phone: fullNormalizedPhone,
        location: location.trim() || 'Bengaluru, Karnataka',
        locationDetails: selectedLocationDetails || {
          city: location.trim().split(',')[0]?.trim() || location.trim(),
          displayName: location.trim() || 'Bengaluru, Karnataka',
        },
        role,
        email: user?.email || '',
        onboardingCompleted: true,
      };

      let finalPayload: OnboardingPayload = { ...baseData };

      if (role === 'STUDENT') {
        const finalCollegeItem = selectedCollege || searchColleges(college.trim(), 1)[0];
        finalPayload = {
          ...baseData,
          college: finalCollegeItem ? finalCollegeItem.name : college.trim(),
          collegeId: finalCollegeItem ? finalCollegeItem.id : undefined,
          collegeDetails: finalCollegeItem
            ? {
                id: finalCollegeItem.id,
                name: finalCollegeItem.name,
                city: finalCollegeItem.city,
                state: finalCollegeItem.state,
                type: finalCollegeItem.type,
                university: finalCollegeItem.university,
                affiliation: finalCollegeItem.affiliation,
                institutionType: finalCollegeItem.institutionType,
              }
            : undefined,
          degree: degree.trim(),
          department: department.trim(),
          year: year.trim(),
          gpa: gpa.trim(),
          careerGoal: careerGoal.trim(),
          skills: selectedSkills,
          bio:
            bio.trim() ||
            `${careerGoal} focused student at ${finalCollegeItem ? finalCollegeItem.name : college.trim()}, keen on real-world projects and verified skill assessment.`,
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
          completeOnboarding(finalPayload as unknown as Record<string, unknown>),
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
      <div className="min-h-screen bg-gradient-to-br from-[#EFF6FA] via-[#E4EFF7] to-[#D9EAF5] dark:from-[#0b131e] dark:via-[#0f172a] dark:to-[#08131d] flex flex-col items-center justify-center text-slate-900 dark:text-white p-4">
        <Loader2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 animate-spin mb-4" />
        <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Loading your SkillSetu profile...</p>
      </div>
    );
  }

  const roleMeta = {
    STUDENT: {
      label: 'Student Profile Setup',
      icon: GraduationCap,
      description: 'Set up your verified skill portfolio, college details, and internship preferences.',
      badgeColor: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-400',
    },
    INDUSTRY: {
      label: 'Company & Recruiter Setup',
      icon: Building2,
      description: 'Define your company profile, hiring domains, and team contacts.',
      badgeColor: 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30 text-blue-800 dark:text-blue-400',
    },
    COLLEGE: {
      label: 'College Administration Setup',
      icon: School,
      description: 'Register institution details, placement office contacts, and academic faculties.',
      badgeColor: 'bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/30 text-purple-800 dark:text-purple-400',
    },
  }[role];

  const RoleIcon = roleMeta.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EFF6FA] via-[#E4EFF7] to-[#D9EAF5] dark:from-[#0b131e] dark:via-[#0f172a] dark:to-[#08131d] text-slate-900 dark:text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:px-10 lg:py-6 relative selection:bg-emerald-100 selection:text-emerald-950">
      {/* Subtle soft ambient lighting */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(13,92,104,0.07),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(16,185,129,0.08),rgba(0,0,0,0))] -z-10" />
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_50%_at_90%_90%,rgba(56,189,248,0.1),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_60%_50%_at_90%_90%,rgba(14,165,233,0.06),rgba(0,0,0,0))] -z-10" />

      {/* Header */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between py-2 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-teal to-brand-emerald flex items-center justify-center shadow-md shadow-brand-teal/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-xl sm:text-2xl tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              Skill<span className="text-emerald-700 dark:text-emerald-400">Setu</span>
            </div>
            <div className="text-[9px] sm:text-[10px] tracking-widest uppercase font-bold text-emerald-800 dark:text-emerald-400">
              ACADEMIA – INDUSTRY SKILL INTELLIGENCE
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
            Logged in as <strong className="text-slate-700 dark:text-slate-200 font-semibold">{user?.email}</strong>
          </span>
          <button
            onClick={() => signOut()}
            type="button"
            className="text-xs px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-semibold transition-all shadow-xs"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl mx-auto w-full my-6 bg-white dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-6 sm:p-8 md:p-10 backdrop-blur-xl shadow-xl shadow-blue-950/5 dark:shadow-black/40 space-y-7">
        {/* Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/80">
          <div>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold mb-2 shadow-xs ${roleMeta.badgeColor}`}>
              <RoleIcon className="w-3.5 h-3.5" />
              <span>{roleMeta.label}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Complete Your Account Details
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {roleMeta.description} All information is securely synced with your SkillSetu account.
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
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/20'
                        : isCurrent
                        ? 'bg-emerald-50 dark:bg-emerald-500/20 border-2 border-emerald-600 dark:border-emerald-400 text-emerald-700 dark:text-emerald-300 font-bold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {isDone ? <Check className="w-4 h-4" /> : step}
                  </div>
                  {step < 3 && (
                    <div
                      className={`w-6 sm:w-10 h-0.5 rounded-full transition-all ${
                        currentStep > step ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-800'
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
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Step 1 of 3: Core Identity &amp; Contact Details</span>
              </div>

              {/* Display Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Full Name <span className="text-emerald-600 dark:text-emerald-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => {
                        setDisplayName(e.target.value);
                        if (error && error.toLowerCase().includes('name')) setError(null);
                      }}
                      placeholder="e.g. Aarav Sharma"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-white dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 dark:focus:ring-emerald-500/20 focus:border-emerald-600 dark:focus:border-emerald-500 font-sans transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Phone / WhatsApp Number <span className="text-emerald-600 dark:text-emerald-400">*</span>
                    </label>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      {selectedCountry.code === '+91'
                        ? `${phoneNumber.length}/10 digits`
                        : `${phoneNumber.length} digits`}
                    </span>
                  </div>

                  <div className="relative" ref={countryDropdownRef}>
                    <div className="flex rounded-xl shadow-xs">
                      {/* Country Code Trigger Button */}
                      <button
                        type="button"
                        onClick={() => setIsCountryDropdownOpen((prev) => !prev)}
                        aria-haspopup="listbox"
                        aria-expanded={isCountryDropdownOpen}
                        aria-label={`Country calling code: ${selectedCountry.name} ${selectedCountry.code}`}
                        className="inline-flex items-center gap-1.5 px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-r-0 border-slate-300 dark:border-slate-700 rounded-l-xl text-sm font-medium text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-600/20 select-none shrink-0"
                        title={`Current: ${selectedCountry.name} (${selectedCountry.code})`}
                      >
                        <span className="text-base leading-none">{selectedCountry.flag}</span>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{selectedCountry.code}</span>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      </button>

                      {/* Phone Digits Input */}
                      <div className="relative flex-1">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                        <input
                          type="tel"
                          required
                          value={phoneNumber}
                          onChange={handlePhoneChange}
                          onPaste={handlePhonePaste}
                          onBlur={() => setPhoneTouched(true)}
                          maxLength={selectedCountry.maxLength}
                          placeholder={selectedCountry.placeholder}
                          aria-label="Phone / WhatsApp Number"
                          aria-invalid={showPhoneError}
                          aria-describedby={showPhoneError ? 'phone-error-msg' : 'phone-help-msg'}
                          className={`w-full pl-9 pr-3.5 py-2.5 bg-white dark:bg-slate-800/90 border rounded-r-xl text-sm text-slate-900 dark:text-white font-mono tracking-wider placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 font-sans transition-all ${
                            showPhoneError
                              ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                              : 'border-slate-300 dark:border-slate-700 focus:ring-emerald-600/20 dark:focus:ring-emerald-500/20 focus:border-emerald-600 dark:focus:border-emerald-500'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Country Selector Dropdown */}
                    {isCountryDropdownOpen && (
                      <div
                        role="listbox"
                        aria-label="Country calling codes"
                        className="absolute top-full left-0 mt-1.5 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-50 p-2 space-y-1 backdrop-blur-xl max-h-64 flex flex-col"
                      >
                        <div className="relative mb-1">
                          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                          <input
                            type="text"
                            value={countrySearchQuery}
                            onChange={(e) => setCountrySearchQuery(e.target.value)}
                            placeholder="Search country or code..."
                            autoFocus
                            aria-label="Search countries"
                            className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                          />
                        </div>
                        <div className="overflow-y-auto space-y-0.5 flex-1 pr-1">
                          {filteredCountries.map((c) => {
                            const isSelected =
                              c.code === selectedCountry.code && c.iso === selectedCountry.iso;
                            return (
                              <button
                                key={`${c.iso}-${c.code}`}
                                role="option"
                                aria-selected={isSelected}
                                type="button"
                                onClick={() => {
                                  setSelectedCountry(c);
                                  setIsCountryDropdownOpen(false);
                                  setCountrySearchQuery('');
                                  let updated = phoneNumber;
                                  if (updated.length > c.maxLength) {
                                    updated = updated.slice(0, c.maxLength);
                                    setPhoneNumber(updated);
                                  }
                                  setPhone(`${c.code} ${updated}`);
                                  if (
                                    error &&
                                    (error.toLowerCase().includes('phone') ||
                                      error.toLowerCase().includes('contact'))
                                  ) {
                                    setError(null);
                                  }
                                }}
                                className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs transition-colors ${
                                  isSelected
                                    ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-semibold'
                                    : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                                }`}
                              >
                                <div className="flex items-center gap-2 truncate">
                                  <span className="text-sm leading-none">{c.flag}</span>
                                  <span className="truncate">{c.name}</span>
                                </div>
                                <span className="font-mono text-slate-400 ml-2 text-[11px] shrink-0">
                                  {c.code}
                                </span>
                              </button>
                            );
                          })}
                          {filteredCountries.length === 0 && (
                            <div className="p-3 text-center text-xs text-slate-400">
                              No country found
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Inline Error or Helper */}
                  {showPhoneError ? (
                    <p id="phone-error-msg" className="text-[11px] text-red-600 dark:text-red-400 mt-1.5 flex items-center gap-1.5 animate-in fade-in duration-200">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{phoneError}</span>
                    </p>
                  ) : (
                    <p id="phone-help-msg" className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                      {selectedCountry.code === '+91'
                        ? '10-digit mobile number for SMS & WhatsApp updates'
                        : `Enter standard ${selectedCountry.name} mobile/contact number`}
                    </p>
                  )}
                </div>
              </div>

              {/* STUDENT ROLE FIELDS */}
              {role === 'STUDENT' && (
                <>
                  <CollegeAutocomplete
                    value={college}
                    selectedCollege={selectedCollege}
                    onChange={(name, item) => {
                      setCollege(name);
                      setSelectedCollege(item);
                      if (error && error.toLowerCase().includes('college')) setError(null);
                    }}
                    error={
                      step1Attempted && !college.trim()
                        ? 'Please select your college or university from the list.'
                        : null
                    }
                    required={true}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Degree / Program <span className="text-emerald-600 dark:text-emerald-400">*</span>
                      </label>
                      <select
                        value={degree}
                        onChange={(e) => setDegree(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20 dark:focus:ring-emerald-500/20 focus:border-emerald-600 dark:focus:border-emerald-500 font-sans transition-all"
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
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Department / Branch <span className="text-emerald-600 dark:text-emerald-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={department}
                        onChange={(e) => {
                          setDepartment(e.target.value);
                          if (error && error.toLowerCase().includes('department')) setError(null);
                        }}
                        placeholder="e.g. CSE / AIML / Ayurveda"
                        className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 dark:focus:ring-emerald-500/20 focus:border-emerald-600 dark:focus:border-emerald-500 font-sans transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Current Academic Year <span className="text-emerald-600 dark:text-emerald-400">*</span>
                      </label>
                      <select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20 dark:focus:ring-emerald-500/20 focus:border-emerald-600 dark:focus:border-emerald-500 font-sans transition-all"
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
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Current CGPA / Percentage
                      </label>
                      <input
                        type="text"
                        value={gpa}
                        onChange={(e) => setGpa(e.target.value)}
                        placeholder="e.g. 8.7 CGPA or 85%"
                        className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 dark:focus:ring-emerald-500/20 focus:border-emerald-600 dark:focus:border-emerald-500 font-sans transition-all"
                      />
                    </div>

                    <div>
                      {renderLocationAutocomplete('Base City / Location', 'e.g. Bengaluru, Karnataka', true)}
                    </div>
                  </div>
                </>
              )}

              {/* INDUSTRY ROLE FIELDS */}
              {role === 'INDUSTRY' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Company / Organization Name <span className="text-emerald-600 dark:text-emerald-400">*</span>
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          required
                          value={companyName}
                          onChange={(e) => {
                            setCompanyName(e.target.value);
                            if (error && error.toLowerCase().includes('company')) setError(null);
                          }}
                          placeholder="e.g. TechNova Labs"
                          className="w-full pl-10 pr-3.5 py-2.5 bg-white dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 dark:focus:ring-emerald-500/20 focus:border-emerald-600 dark:focus:border-emerald-500 font-sans transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Industry Sector <span className="text-emerald-600 dark:text-emerald-400">*</span>
                      </label>
                      <select
                        value={companyIndustry}
                        onChange={(e) => setCompanyIndustry(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20 dark:focus:ring-emerald-500/20 focus:border-emerald-600 dark:focus:border-emerald-500 font-sans transition-all"
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
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Your Work Designation <span className="text-emerald-600 dark:text-emerald-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={recruiterTitle}
                        onChange={(e) => setRecruiterTitle(e.target.value)}
                        placeholder="e.g. Head of Talent Acquisition"
                        className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 dark:focus:ring-emerald-500/20 focus:border-emerald-600 dark:focus:border-emerald-500 font-sans transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Company Size
                      </label>
                      <select
                        value={companySize}
                        onChange={(e) => setCompanySize(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20 dark:focus:ring-emerald-500/20 focus:border-emerald-600 dark:focus:border-emerald-500 font-sans transition-all"
                      >
                        <option value="1-10 employees (Early Startup)">1-10 employees (Early Startup)</option>
                        <option value="11-50 employees (Growth Startup)">11-50 employees (Growth Startup)</option>
                        <option value="51-200 employees (Mid-size)">51-200 employees (Mid-size)</option>
                        <option value="201-500 employees (Enterprise)">201-500 employees (Enterprise)</option>
                        <option value="500+ employees (MNC)">500+ employees (MNC)</option>
                      </select>
                    </div>

                    <div>
                      {renderLocationAutocomplete('Office Location / City', 'e.g. Indiranagar, Bengaluru', true)}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Company Website
                    </label>
                    <div className="relative">
                      <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="url"
                        value={companyWebsite}
                        onChange={(e) => setCompanyWebsite(e.target.value)}
                        placeholder="https://technovalabs.com"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-white dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 dark:focus:ring-emerald-500/20 focus:border-emerald-600 dark:focus:border-emerald-500 font-sans transition-all"
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
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Institution / University Name <span className="text-emerald-600 dark:text-emerald-400">*</span>
                      </label>
                      <div className="relative">
                        <School className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          required
                          value={institutionName}
                          onChange={(e) => {
                            setInstitutionName(e.target.value);
                            if (error && error.toLowerCase().includes('institution')) setError(null);
                          }}
                          placeholder="e.g. AYUSH Institute of Technology"
                          className="w-full pl-10 pr-3.5 py-2.5 bg-white dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 dark:focus:ring-emerald-500/20 focus:border-emerald-600 dark:focus:border-emerald-500 font-sans transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        AISHE / College Code <span className="text-emerald-600 dark:text-emerald-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={collegeCode}
                        onChange={(e) => {
                          setCollegeCode(e.target.value);
                          if (error && error.toLowerCase().includes('code')) setError(null);
                        }}
                        placeholder="e.g. C-12894 / KA-BLR-054"
                        className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 dark:focus:ring-emerald-500/20 focus:border-emerald-600 dark:focus:border-emerald-500 font-sans transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Your Official Designation <span className="text-emerald-600 dark:text-emerald-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        placeholder="e.g. Placement Director"
                        className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 dark:focus:ring-emerald-500/20 focus:border-emerald-600 dark:focus:border-emerald-500 font-sans transition-all"
                      />
                    </div>

                    <div>
                      {renderLocationAutocomplete('Campus Location / City', 'e.g. Bengaluru, Karnataka', true)}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        NAAC / NBA Accreditation
                      </label>
                      <select
                        value={naacGrade}
                        onChange={(e) => setNaacGrade(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20 dark:focus:ring-emerald-500/20 focus:border-emerald-600 dark:focus:border-emerald-500 font-sans transition-all"
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
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Campus Website
                      </label>
                      <div className="relative">
                        <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="url"
                          value={institutionWebsite}
                          onChange={(e) => setInstitutionWebsite(e.target.value)}
                          placeholder="https://ayushcollege.edu.in"
                          className="w-full pl-10 pr-3.5 py-2.5 bg-white dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 dark:focus:ring-emerald-500/20 focus:border-emerald-600 dark:focus:border-emerald-500 font-sans transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Approximate Student Enrollment
                      </label>
                      <input
                        type="number"
                        value={totalStudents}
                        onChange={(e) => setTotalStudents(e.target.value)}
                        placeholder="e.g. 2400"
                        className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 dark:focus:ring-emerald-500/20 focus:border-emerald-600 dark:focus:border-emerald-500 font-sans transition-all"
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
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
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
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Target Career Goal / Aspiring Role <span className="text-emerald-600 dark:text-emerald-400">*</span>
                    </label>
                    <div className="relative">
                      <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={careerGoal}
                        onChange={(e) => setCareerGoal(e.target.value)}
                        placeholder="e.g. Full Stack AI Developer, Ayurvedic Clinical Researcher"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-white dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 dark:focus:ring-emerald-500/20 focus:border-emerald-600 dark:focus:border-emerald-500 font-sans transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Your Primary Skills <span className="text-emerald-600 dark:text-emerald-400">*</span> (Select all that apply)
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
                                ? 'bg-emerald-50 dark:bg-emerald-500/20 border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 shadow-xs font-semibold'
                                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            {isSelected ? <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> : <Plus className="w-3 h-3 text-slate-400" />}
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
                        className="flex-1 px-3.5 py-2 bg-white dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 font-sans"
                      />
                      <button
                        type="button"
                        onClick={addCustomSkill}
                        className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-600 transition-colors shadow-xs"
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
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Active Hiring Domains &amp; Roles <span className="text-emerald-600 dark:text-emerald-400">*</span>
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
                                ? 'bg-emerald-50 dark:bg-blue-500/20 border-emerald-300 dark:border-blue-400 text-emerald-800 dark:text-blue-300 shadow-xs font-semibold'
                                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            {isSelected ? <Check className="w-3 h-3 text-emerald-600 dark:text-blue-400" /> : <Plus className="w-3 h-3 text-slate-400" />}
                            <span>{domain}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      About Company &amp; Hiring Culture
                    </label>
                    <textarea
                      rows={3}
                      value={companyBio}
                      onChange={(e) => setCompanyBio(e.target.value)}
                      placeholder="Share what makes your team unique, your mission, and the type of talent you are excited to mentor..."
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 dark:focus:ring-emerald-500/20 focus:border-emerald-600 dark:focus:border-emerald-500 font-sans transition-all"
                    />
                  </div>
                </>
              )}

              {/* COLLEGE STEP 2 */}
              {role === 'COLLEGE' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Active Academic Departments &amp; Faculties <span className="text-emerald-600 dark:text-emerald-400">*</span>
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
                                ? 'bg-emerald-50 dark:bg-purple-500/20 border-emerald-300 dark:border-purple-400 text-emerald-800 dark:text-purple-300 shadow-xs font-semibold'
                                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            {isSelected ? <Check className="w-3 h-3 text-emerald-600 dark:text-purple-400" /> : <Plus className="w-3 h-3 text-slate-400" />}
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
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <FileText className="w-4 h-4" />
                <span>Step 3 of 3: Bio &amp; Professional Links</span>
              </div>

              {/* STUDENT STEP 3 */}
              {role === 'STUDENT' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Short Bio / Elevator Pitch
                    </label>
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Briefly describe your passion, key projects, and what kind of internship/micro-task opportunities excite you..."
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 dark:focus:ring-emerald-500/20 focus:border-emerald-600 dark:focus:border-emerald-500 font-sans transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        GitHub Profile Link (Optional)
                      </label>
                      <div className="relative">
                        <Github className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="url"
                          value={github}
                          onChange={(e) => setGithub(e.target.value)}
                          placeholder="https://github.com/username"
                          className="w-full pl-10 pr-3.5 py-2.5 bg-white dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 dark:focus:ring-emerald-500/20 focus:border-emerald-600 dark:focus:border-emerald-500 font-sans transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        LinkedIn Profile Link (Optional)
                      </label>
                      <div className="relative">
                        <Linkedin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="url"
                          value={linkedin}
                          onChange={(e) => setLinkedin(e.target.value)}
                          placeholder="https://linkedin.com/in/username"
                          className="w-full pl-10 pr-3.5 py-2.5 bg-white dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 dark:focus:ring-emerald-500/20 focus:border-emerald-600 dark:focus:border-emerald-500 font-sans transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Confirmation Overview Box */}
              <div className="bg-emerald-50/70 dark:bg-slate-800/50 border border-emerald-200/90 dark:border-slate-700/80 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Ready to Sync Profile &amp; Launch</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Clicking <strong>Complete Onboarding &amp; Launch</strong> will immediately persist your profile into SkillSetu&apos;s verified network, activate your personalized dashboard, and connect you with curated career opportunities.
                </p>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-xl p-3 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/80">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-2 shadow-xs"
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
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold transition-all shadow-md shadow-emerald-700/20 flex items-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold transition-all shadow-md shadow-emerald-700/20 flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Profile...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Complete Onboarding &amp; Launch</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto w-full py-2 text-center text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-200/80 dark:border-slate-800/60 pt-4">
        <span>&copy; 2026 SkillSetu &bull; AYUSH Career Bridge</span>
        <span>Secure Cloud Database &bull; All rights reserved</span>
      </footer>
    </div>
  );
}
