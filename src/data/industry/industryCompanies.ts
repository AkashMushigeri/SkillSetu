import { CompanyProfile, HiringPreferences } from '@/types/industry';

export const defaultCompanyProfile: CompanyProfile = {
  name: 'TechNova Labs',
  type: 'Technology Startup',
  industry: 'Software & Artificial Intelligence',
  location: 'Bengaluru, Karnataka',
  coordinates: { lat: 12.9784, lng: 77.6408 }, // Indiranagar, Bengaluru
  employees: '120+',
  founded: 2020,
  activeJobsCount: 12,
  activeInternshipsCount: 8,
  collegePartnersCount: 14,
  website: 'https://technovalabs.ai',
  tagline: 'Pioneering AI & Cloud Intelligence for Enterprise Innovation',
  about:
    'TechNova Labs is an engineering-first deep-tech startup building scalable machine learning pipelines, generative AI workflows, and cloud-native SaaS solutions. We partner with India’s leading technical and AYUSH institutions to mentor students, evaluate verified skills, and fast-track top undergraduate talent into cutting-edge production engineering roles.',
  mission:
    'To bridge foundational academic computer science and deep domain specializations with real-world industry applications through continuous skill verification, hands-on micro-internships, and talent acceleration.',
  techStack: [
    'Python',
    'Machine Learning',
    'PyTorch',
    'TensorFlow',
    'FastAPI',
    'React',
    'Next.js',
    'TypeScript',
    'PostgreSQL',
    'Docker',
    'Kubernetes',
    'AWS',
  ],
  departments: [
    'Artificial Intelligence & ML',
    'Full Stack Engineering',
    'Data Science & Analytics',
    'Cloud Platform & DevOps',
    'Product & Design',
  ],
  hiringDomains: [
    'AI/ML Engineering',
    'Full Stack Web Development',
    'Data Analytics & BI',
    'Cloud DevOps',
    'Cybersecurity & Systems',
  ],
  benefits: [
    'High-ownership startup engineering culture',
    'Competitive stipend & pre-placement offer (PPO) pipeline',
    'Direct mentorship from Staff Engineers and AI Researchers',
    'Flexible hybrid schedule with Bengaluru Innovation Lab access',
    'Continuous skill upskilling and certification sponsorships',
  ],
  culture: [
    'Skill-First Meritocracy: We evaluate verified code and architectures over vanity resumes',
    'Fast Iteration & Open Source Advocacy',
    'Cross-Disciplinary Curiosity & Deep Focus',
  ],
  logo: '🚀',
  coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
  recruiter: {
    name: 'Rahul Verma',
    title: 'HR & Talent Acquisition Lead',
    email: 'hr@technova.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  },
};

export const defaultHiringPreferences: HiringPreferences = {
  preferredDepartments: [
    'Computer Science & Engineering',
    'Artificial Intelligence & Machine Learning',
    'Information Science & Engineering',
    'Data Science',
    'Electronics & Communication',
  ],
  preferredDegrees: ['B.Tech', 'B.E.', 'M.Tech', 'MCA'],
  preferredGraduationYears: ['2025', '2026', '2027'],
  preferredLocations: ['Bengaluru', 'Mysuru', 'Hyderabad', 'Remote'],
  workModes: ['Hybrid', 'Remote', 'On-site'],
  minimumCgpa: 7.5,
  prioritizeVerifiedSkills: true,
  prioritizeStartupExperience: true,
  searchRadiusKm: 25,
};
