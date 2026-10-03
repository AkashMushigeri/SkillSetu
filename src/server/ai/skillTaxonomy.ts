/**
 * src/server/ai/skillTaxonomy.ts
 * 
 * Domain-aware taxonomy and normalization for engineering, data science, 
 * web, mobile, cloud, and AYUSH-aligned technology stacks.
 */

export interface SkillSynonymGroup {
  canonical: string;
  category: string;
  synonyms: string[];
  relatedSkills: string[];
}

export const SKILL_TAXONOMY: SkillSynonymGroup[] = [
  {
    canonical: 'Python',
    category: 'Programming',
    synonyms: ['python', 'python3', 'python 3', 'py'],
    relatedSkills: ['Django', 'FastAPI', 'Flask', 'Pandas', 'NumPy', 'Data Analysis', 'Automation', 'Scripting'],
  },
  {
    canonical: 'Machine Learning',
    category: 'Artificial Intelligence',
    synonyms: [
      'machine learning',
      'ml',
      'deep learning',
      'dl',
      'artificial intelligence',
      'ai',
      'predictive modeling',
      'scikit-learn',
      'sklearn',
    ],
    relatedSkills: ['Python', 'TensorFlow', 'PyTorch', 'Data Science', 'Computer Vision', 'NLP', 'Data Analysis', 'Keras'],
  },
  {
    canonical: 'TensorFlow',
    category: 'Artificial Intelligence',
    synonyms: ['tensorflow', 'tf', 'keras'],
    relatedSkills: ['Machine Learning', 'Deep Learning', 'PyTorch', 'Python', 'Neural Networks'],
  },
  {
    canonical: 'SQL',
    category: 'Databases',
    synonyms: ['sql', 'structured query language', 'relational database', 'rdbms', 'ansi sql'],
    relatedSkills: ['PostgreSQL', 'MySQL', 'SQLite', 'Database Management', 'Data Analysis', 'Queries', 'Database Design'],
  },
  {
    canonical: 'PostgreSQL',
    category: 'Databases',
    synonyms: ['postgres', 'postgresql', 'pgsql'],
    relatedSkills: ['SQL', 'Databases', 'Prisma', 'Backend'],
  },
  {
    canonical: 'Data Analysis',
    category: 'Data Science',
    synonyms: ['data analysis', 'data analytics', 'exploratory data analysis', 'eda', 'data insights'],
    relatedSkills: ['Python', 'SQL', 'Pandas', 'NumPy', 'Power BI', 'Tableau', 'Excel', 'Statistics'],
  },
  {
    canonical: 'Power BI',
    category: 'Data Science',
    synonyms: ['power bi', 'powerbi', 'microsoft power bi'],
    relatedSkills: ['Data Analysis', 'Tableau', 'SQL', 'Data Visualization', 'Dashboards'],
  },
  {
    canonical: 'React',
    category: 'Web Development',
    synonyms: ['react', 'react.js', 'reactjs', 'react native'],
    relatedSkills: ['JavaScript', 'TypeScript', 'Next.js', 'Redux', 'Tailwind CSS', 'HTML', 'CSS', 'Frontend'],
  },
  {
    canonical: 'Next.js',
    category: 'Web Development',
    synonyms: ['next.js', 'nextjs', 'next'],
    relatedSkills: ['React', 'TypeScript', 'SSR', 'Web Development', 'Node.js', 'Full Stack'],
  },
  {
    canonical: 'JavaScript',
    category: 'Programming',
    synonyms: ['javascript', 'js', 'es6', 'ecmascript'],
    relatedSkills: ['TypeScript', 'React', 'Node.js', 'HTML', 'CSS', 'Web Development'],
  },
  {
    canonical: 'TypeScript',
    category: 'Programming',
    synonyms: ['typescript', 'ts'],
    relatedSkills: ['JavaScript', 'React', 'Next.js', 'Node.js', 'Frontend', 'Backend'],
  },
  {
    canonical: 'HTML',
    category: 'Web Development',
    synonyms: ['html', 'html5', 'semantic html'],
    relatedSkills: ['CSS', 'JavaScript', 'Web Development', 'Frontend'],
  },
  {
    canonical: 'CSS',
    category: 'Web Development',
    synonyms: ['css', 'css3', 'styling', 'styles'],
    relatedSkills: ['Tailwind CSS', 'HTML', 'Sass', 'Responsive Design', 'Frontend'],
  },
  {
    canonical: 'Tailwind CSS',
    category: 'Web Development',
    synonyms: ['tailwind', 'tailwindcss', 'tailwind css'],
    relatedSkills: ['CSS', 'HTML', 'React', 'Next.js', 'Frontend'],
  },
  {
    canonical: 'Docker',
    category: 'DevOps & Cloud',
    synonyms: ['docker', 'containerization', 'containers'],
    relatedSkills: ['Kubernetes', 'CI/CD', 'DevOps', 'Linux', 'Cloud', 'AWS'],
  },
  {
    canonical: 'AWS',
    category: 'DevOps & Cloud',
    synonyms: ['aws', 'amazon web services', 'amazon aws'],
    relatedSkills: ['Cloud', 'Docker', 'Kubernetes', 'DevOps', 'Serverless', 'S3', 'EC2'],
  },
  {
    canonical: 'Node.js',
    category: 'Backend Development',
    synonyms: ['node.js', 'nodejs', 'node'],
    relatedSkills: ['Express', 'JavaScript', 'TypeScript', 'Backend', 'REST APIs', 'SQL', 'MongoDB'],
  },
  {
    canonical: 'C',
    category: 'Core Programming',
    synonyms: ['c language', 'c programming'],
    relatedSkills: ['C++', 'Pointers', 'Data Structures', 'Embedded Systems', 'Algorithms'],
  },
  {
    canonical: 'C++',
    category: 'Core Programming',
    synonyms: ['cpp', 'c plus plus', 'c++'],
    relatedSkills: ['C', 'Object Oriented Programming', 'Data Structures', 'Algorithms', 'STL'],
  },
  {
    canonical: 'Java',
    category: 'Core Programming',
    synonyms: ['java', 'core java'],
    relatedSkills: ['Spring Boot', 'OOP', 'Data Structures', 'Backend', 'SQL'],
  },
  {
    canonical: 'Communication',
    category: 'Soft Skills',
    synonyms: ['communication', 'verbal communication', 'presentation skills', 'written communication'],
    relatedSkills: ['Teamwork', 'Collaboration', 'Problem Solving', 'Leadership'],
  },
  {
    canonical: 'Problem Solving',
    category: 'Core Aptitude',
    synonyms: ['problem solving', 'analytical skills', 'critical thinking', 'data structures and algorithms', 'dsa'],
    relatedSkills: ['Algorithms', 'Logic', 'Debugging'],
  },
];

/**
 * Normalizes a skill string for uniform comparison.
 */
export function normalizeSkill(raw: string): string {
  if (!raw) return '';
  return raw
    .toLowerCase()
    .replace(/[._\-/\\]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Finds the canonical group for a given raw skill name.
 */
export function findTaxonomyGroup(rawSkill: string): SkillSynonymGroup | undefined {
  const normalized = normalizeSkill(rawSkill);
  return SKILL_TAXONOMY.find((group) => {
    if (normalizeSkill(group.canonical) === normalized) return true;
    return group.synonyms.some((s) => normalizeSkill(s) === normalized);
  });
}

export function normalizeSkillName(rawSkill: string): { canonical: string; category: string } {
  if (!rawSkill) return { canonical: '', category: 'Technical' };
  const group = findTaxonomyGroup(rawSkill);
  if (group) {
    return { canonical: group.canonical, category: group.category };
  }

  // Strip adversarial injection trailers (newlines, script/style tags with content, other HTML tags, SQL comments, semicolon command chains)
  const sanitized = rawSkill
    .replace(/<(script|style|iframe)[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/[\r\n][\s\S]*$/, '')
    .replace(/[;'"\-\-\/\*].*$/g, '')
    .trim();

  if (sanitized && sanitized !== rawSkill) {
    const cleanGroup = findTaxonomyGroup(sanitized);
    if (cleanGroup) {
      return { canonical: cleanGroup.canonical, category: cleanGroup.category };
    }
  }

  const trimmed = (sanitized || rawSkill).trim();
  const canonical = trimmed.length > 0 ? trimmed.charAt(0).toUpperCase() + trimmed.slice(1) : '';
  return { canonical, category: 'Technical' };
}

/**
 * Evaluates the similarity between a candidate/student skill and a target requirement.
 * Returns match degree (0 to 1), relation type, and matched canonical name.
 */
export function calculateSkillSimilarity(
  studentSkill: string,
  requiredSkill: string
): {
  matched: boolean;
  score: number;
  relation: 'exact' | 'synonym' | 'related' | 'none';
  canonical: string;
} {
  const normStudent = normalizeSkill(studentSkill);
  const normReq = normalizeSkill(requiredSkill);

  // 1. Exact match
  if (normStudent === normReq) {
    return { matched: true, score: 1.0, relation: 'exact', canonical: requiredSkill };
  }

  const groupReq = findTaxonomyGroup(requiredSkill);
  const groupStudent = findTaxonomyGroup(studentSkill);

  // 2. Both belong to the same canonical group (synonyms)
  if (groupReq && groupStudent && groupReq.canonical === groupStudent.canonical) {
    return { matched: true, score: 0.95, relation: 'synonym', canonical: groupReq.canonical };
  }

  // 3. Synonym lookup via group
  if (groupReq) {
    const isSynonym = groupReq.synonyms.some((syn) => normalizeSkill(syn) === normStudent);
    if (isSynonym) {
      return { matched: true, score: 0.95, relation: 'synonym', canonical: groupReq.canonical };
    }

    // 4. Related skills lookup (e.g. Machine Learning -> Python / TensorFlow / Pandas)
    const isRelated = groupReq.relatedSkills.some((rel) => normalizeSkill(rel) === normStudent);
    if (isRelated) {
      return { matched: true, score: 0.65, relation: 'related', canonical: groupReq.canonical };
    }
  }

  if (groupStudent) {
    const isRelatedToStudent = groupStudent.relatedSkills.some(
      (rel) => normalizeSkill(rel) === normReq
    );
    if (isRelatedToStudent) {
      return { matched: true, score: 0.65, relation: 'related', canonical: requiredSkill };
    }
  }

  // 5. Safe token / word-boundary matching (e.g. "React Developer" vs "React")
  // Guards against false substring matches (e.g. Java vs JavaScript, C vs CSS/C++)
  const isFalseSubstringConflict =
    (normStudent === 'java' && normReq.includes('javascript')) ||
    (normReq === 'java' && normStudent.includes('javascript')) ||
    (normStudent === 'c' && normReq !== 'c') ||
    (normReq === 'c' && normStudent !== 'c') ||
    (normStudent === 'r' && normReq !== 'r') ||
    (normReq === 'r' && normStudent !== 'r');

  if (!isFalseSubstringConflict) {
    const studentWords = normStudent.split(/\s+/);
    // Only the student-is-more-specific direction is a synonym. A required skill
    // that merely contains the student's skill (raw substring or as one word)
    // is a different, narrower skill: "React" must not satisfy
    // "React Testing Library", "SQL" must not satisfy "PostgreSQL".
    const hasFullWordMatch = studentWords.includes(normReq);

    if (hasFullWordMatch) {
      return { matched: true, score: 0.8, relation: 'synonym', canonical: requiredSkill };
    }
  }

  return { matched: false, score: 0, relation: 'none', canonical: requiredSkill };
}
