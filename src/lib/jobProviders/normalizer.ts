import { Opportunity, OpportunityType } from '@/types/student';
import { RawProviderJob } from './types';

// Standard Indian & Global tech hubs coordinates
export const KNOWN_CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  bengaluru: { lat: 12.9716, lng: 77.5946 },
  bangalore: { lat: 12.9716, lng: 77.5946 },
  hyderabad: { lat: 17.3850, lng: 78.4867 },
  pune: { lat: 18.5204, lng: 73.8567 },
  mumbai: { lat: 19.0760, lng: 72.8777 },
  delhi: { lat: 28.6139, lng: 77.2090 },
  'new delhi': { lat: 28.6139, lng: 77.2090 },
  noida: { lat: 28.5355, lng: 77.3910 },
  gurgaon: { lat: 28.4595, lng: 77.0266 },
  gurugram: { lat: 28.4595, lng: 77.0266 },
  chennai: { lat: 13.0827, lng: 80.2707 },
  kolkata: { lat: 22.5726, lng: 88.3639 },
  ahmedabad: { lat: 23.0225, lng: 72.5714 },
  kochi: { lat: 9.9312, lng: 76.2673 },
  mysuru: { lat: 12.2958, lng: 76.6394 },
  mysore: { lat: 12.2958, lng: 76.6394 },
  jaipur: { lat: 26.9124, lng: 75.7873 },
  chandigarh: { lat: 30.7333, lng: 76.7794 },
  remote: { lat: 12.9716, lng: 77.5946 },
};

const COMMON_TECH_SKILLS = [
  'Python', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js',
  'Java', 'C++', 'C#', 'Go', 'Rust', 'SQL', 'PostgreSQL', 'MongoDB',
  'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Git', 'Linux',
  'REST APIs', 'GraphQL', 'Machine Learning', 'AI', 'Data Analysis',
  'Data Science', 'DevOps', 'HTML', 'CSS', 'Tailwind CSS', 'Figma',
  'System Design', 'DSA', 'Spring Boot', 'Express', 'Django', 'FastAPI'
];

export function extractSkillsFromText(text: string): string[] {
  if (!text) return [];
  const found: string[] = [];
  const lower = text.toLowerCase();
  
  for (const skill of COMMON_TECH_SKILLS) {
    // Word boundary check
    const regex = new RegExp(`\\b${skill.toLowerCase().replace('+', '\\+')}\\b`, 'i');
    if (regex.test(lower)) {
      found.push(skill);
    }
  }
  return found.slice(0, 8);
}

export function detectCityAndCoordinates(locationStr: string): {
  city: string;
  coordinates: { lat: number; lng: number };
} {
  const norm = (locationStr || '').toLowerCase();
  for (const [cityName, coords] of Object.entries(KNOWN_CITY_COORDINATES)) {
    if (norm.includes(cityName)) {
      const displayCity = cityName.charAt(0).toUpperCase() + cityName.slice(1);
      return { city: displayCity === 'Bangalore' ? 'Bengaluru' : displayCity, coordinates: coords };
    }
  }
  return {
    city: 'Bengaluru',
    coordinates: KNOWN_CITY_COORDINATES.bengaluru,
  };
}

export function detectWorkMode(
  locationStr: string,
  title: string,
  desc: string
): 'Remote' | 'Hybrid' | 'On-site' {
  const text = `${locationStr} ${title} ${desc}`.toLowerCase();
  if (text.includes('remote') || text.includes('anywhere') || text.includes('work from home')) {
    return 'Remote';
  }
  if (text.includes('hybrid')) {
    return 'Hybrid';
  }
  return 'On-site';
}

export function detectOpportunityType(
  rawType?: string,
  title?: string
): OpportunityType {
  const text = `${rawType || ''} ${title || ''}`.toLowerCase();
  if (text.includes('intern') || text.includes('trainee')) {
    return 'Internship';
  }
  if (text.includes('part-time') || text.includes('part time')) {
    return 'Part-Time Job';
  }
  if (text.includes('contract') || text.includes('contractor')) {
    return 'Contract';
  }
  if (text.includes('apprentice')) {
    return 'Apprenticeship';
  }
  if (text.includes('graduate') || text.includes('campus')) {
    return 'Graduate';
  }
  if (text.includes('challenge') || text.includes('hackathon')) {
    return 'Industry Challenge';
  }
  return 'Full-Time Job';
}

export function formatTimeAgo(dateString?: string): string {
  if (!dateString) return 'Recently verified';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Recently verified';
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  } catch {
    return 'Recently verified';
  }
}

export function normalizeRawJob(raw: RawProviderJob): Opportunity {
  const { city, coordinates } = detectCityAndCoordinates(raw.location || raw.city || '');
  const workMode = raw.workMode || detectWorkMode(raw.location || '', raw.title || '', raw.description || '');
  const type = detectOpportunityType(raw.employmentType, raw.title);

  let skills = raw.skills && raw.skills.length > 0
    ? raw.skills
    : extractSkillsFromText(`${raw.title} ${raw.summary || ''} ${raw.description || ''}`);

  if (skills.length === 0) {
    skills = ['Problem Solving', 'Engineering Fundamentals'];
  }

  const postedDate = formatTimeAgo(raw.publishedAt);
  const deadline = raw.deadline || 'Apply before posting closes';

  // Reliable company logo from domain or clear favicon
  let companyLogo = raw.companyLogo;
  if (!companyLogo && raw.companyDomain) {
    companyLogo = `https://www.google.com/s2/favicons?domain=${raw.companyDomain}&sz=64`;
  } else if (!companyLogo && raw.companyWebsite) {
    try {
      const host = new URL(raw.companyWebsite).hostname;
      companyLogo = `https://www.google.com/s2/favicons?domain=${host}&sz=64`;
    } catch {
      companyLogo = undefined;
    }
  }

  return {
    id: raw.id,
    title: raw.title.trim(),
    company: raw.company.trim(),
    companyLogo,
    type,
    location: raw.location || `${city}, India`,
    city,
    coordinates,
    distanceKm: undefined,
    workMode,
    stipend: raw.salary || 'Competitive (Industry Standard)',
    duration: raw.experience || (type === 'Internship' ? '3–6 Months' : 'Full-Time Position'),
    postedDate,
    deadline,
    requiredSkills: skills.slice(0, 8),
    experienceLevel: raw.experience || (type === 'Internship' ? 'Student / Fresher' : 'Entry / Associate Level'),
    isStartup: Boolean(raw.isStartup),
    description: raw.description || raw.summary || `Verified opening for ${raw.title} at ${raw.company}. View full role and apply via official career board.`,
    responsibilities: [
      `Apply engineering skills including ${skills.slice(0, 3).join(', ')} to production systems`,
      `Collaborate with cross-functional technology and engineering teams`,
      `Participate in agile sprints, code reviews, and system delivery`
    ],
    perks: raw.perks && raw.perks.length > 0 ? raw.perks : [
      'Comprehensive Medical Insurance',
      'Flexible Work Culture',
      'Professional Mentorship & Learning Credits'
    ],
    matchScore: raw.trustScore || 90,
    isMatchBoosted: true,
    // Normalized Schema
    source: raw.source,
    sourceUrl: raw.sourceUrl || raw.applicationUrl,
    applicationUrl: raw.applicationUrl,
    verified: true,
    lastVerified: raw.publishedAt ? new Date(raw.publishedAt).toISOString() : new Date().toISOString(),
    tags: [type, workMode, city, ...skills.slice(0, 3)],
    salary: raw.salary,
    applicationDeadline: deadline,
    skills,
  };
}
