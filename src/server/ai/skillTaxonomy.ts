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
  // --- PROGRAMMING LANGUAGES ---
  {
    canonical: 'C#',
    category: 'Programming',
    synonyms: ['c#', 'csharp', 'c sharp', '.net', 'dotnet'],
    relatedSkills: ['OOP', 'Backend', 'Software Engineering'],
  },
  {
    canonical: 'Go',
    category: 'Programming',
    synonyms: ['go', 'golang'],
    relatedSkills: ['Microservices', 'Distributed Systems', 'Backend Development', 'Docker'],
  },
  {
    canonical: 'Rust',
    category: 'Programming',
    synonyms: ['rust', 'rustlang', 'rust programming'],
    relatedSkills: ['Systems Programming', 'C++', 'Memory Safety', 'Concurrency'],
  },
  {
    canonical: 'Kotlin',
    category: 'Programming',
    synonyms: ['kotlin', 'android kotlin'],
    relatedSkills: ['Java', 'Android', 'Mobile Development', 'Spring Boot'],
  },
  {
    canonical: 'Swift',
    category: 'Programming',
    synonyms: ['swift', 'swiftui', 'ios swift'],
    relatedSkills: ['iOS Development', 'Mobile Development', 'Apple SDK'],
  },
  {
    canonical: 'PHP',
    category: 'Programming',
    synonyms: ['php', 'php8', 'laravel php'],
    relatedSkills: ['Laravel', 'MySQL', 'Web Development', 'Backend Development'],
  },
  // --- WEB DEVELOPMENT ---
  {
    canonical: 'Bootstrap',
    category: 'Web Development',
    synonyms: ['bootstrap', 'bootstrap 5', 'bootstrap css'],
    relatedSkills: ['CSS', 'HTML', 'Responsive Web Design'],
  },
  {
    canonical: 'Express.js',
    category: 'Web Development',
    synonyms: ['express', 'express.js', 'expressjs'],
    relatedSkills: ['Node.js', 'REST API Development', 'Backend Development'],
  },
  {
    canonical: 'WebSockets',
    category: 'Web Development',
    synonyms: ['websocket', 'websockets', 'socket.io', 'real-time web'],
    relatedSkills: ['Node.js', 'React.js', 'Backend Development'],
  },
  // --- DATABASES ---
  {
    canonical: 'MySQL',
    category: 'Databases',
    synonyms: ['mysql', 'mysql database', 'mariadb'],
    relatedSkills: ['SQL', 'Database Design', 'Backend Development'],
  },
  {
    canonical: 'MongoDB',
    category: 'Databases',
    synonyms: ['mongodb', 'mongo', 'nosql', 'mongoose'],
    relatedSkills: ['NoSQL', 'Node.js', 'Express.js', 'Full Stack Development'],
  },
  {
    canonical: 'Redis',
    category: 'Databases',
    synonyms: ['redis', 'in-memory cache', 'key-value store'],
    relatedSkills: ['Caching', 'System Design', 'Performance Engineering', 'Backend Development'],
  },
  {
    canonical: 'Snowflake',
    category: 'Databases',
    synonyms: ['snowflake', 'snowflake data warehouse', 'snowpark'],
    relatedSkills: ['Data Warehousing', 'SQL', 'Big Data Architecture', 'ETL Pipelines'],
  },
  {
    canonical: 'BigQuery',
    category: 'Databases',
    synonyms: ['bigquery', 'google bigquery', 'bq'],
    relatedSkills: ['Google Cloud', 'SQL', 'Data Warehousing', 'Data Lakes'],
  },
  // --- DATA SCIENCE & AI / ML ---
  {
    canonical: 'Pandas',
    category: 'Data Science',
    synonyms: ['pandas', 'dataframes', 'python pandas'],
    relatedSkills: ['Python', 'NumPy', 'Data Analysis', 'Data Cleaning'],
  },
  {
    canonical: 'NumPy',
    category: 'Data Science',
    synonyms: ['numpy', 'numerical python', 'arrays'],
    relatedSkills: ['Python', 'Pandas', 'Scientific Computing', 'Machine Learning'],
  },
  {
    canonical: 'PyTorch',
    category: 'Artificial Intelligence',
    synonyms: ['pytorch', 'torch'],
    relatedSkills: ['Deep Learning', 'Neural Networks', 'Python', 'Machine Learning'],
  },
  {
    canonical: 'Scikit-learn',
    category: 'Artificial Intelligence',
    synonyms: ['scikit-learn', 'sklearn'],
    relatedSkills: ['Machine Learning', 'Python', 'Regression', 'Classification'],
  },
  {
    canonical: 'Natural Language Processing',
    category: 'Artificial Intelligence',
    synonyms: ['nlp', 'natural language processing', 'text analytics', 'tokenization'],
    relatedSkills: ['Transformers', 'LLM Fundamentals', 'Python', 'Hugging Face'],
  },
  {
    canonical: 'Computer Vision',
    category: 'Computer Vision',
    synonyms: ['computer vision', 'cv', 'image processing', 'object detection'],
    relatedSkills: ['OpenCV', 'PyTorch', 'YOLO', 'Deep Learning'],
  },
  {
    canonical: 'Prompt Engineering',
    category: 'Artificial Intelligence',
    synonyms: ['prompt engineering', 'prompting', 'in-context learning'],
    relatedSkills: ['LLM Fundamentals', 'Generative AI', 'RAG'],
  },
  {
    canonical: 'RAG Systems',
    category: 'Artificial Intelligence',
    synonyms: ['rag', 'rag systems', 'retrieval augmented generation', 'advanced rag'],
    relatedSkills: ['Vector Databases', 'LangChain', 'LlamaIndex', 'Semantic Search'],
  },
  {
    canonical: 'AI Agents',
    category: 'Artificial Intelligence',
    synonyms: ['ai agents', 'agentic ai', 'multi-agent systems', 'langgraph', 'crewai'],
    relatedSkills: ['LLM Fundamentals', 'Python', 'LangChain', 'RAG Systems'],
  },
  {
    canonical: 'LangChain',
    category: 'Artificial Intelligence',
    synonyms: ['langchain', 'lcel'],
    relatedSkills: ['AI Agents', 'RAG Systems', 'Python', 'LLM Fundamentals'],
  },
  {
    canonical: 'LlamaIndex',
    category: 'Artificial Intelligence',
    synonyms: ['llamaindex', 'gpt index'],
    relatedSkills: ['RAG Systems', 'Vector Databases', 'Python'],
  },
  {
    canonical: 'MLOps',
    category: 'Artificial Intelligence',
    synonyms: ['mlops', 'machine learning operations', 'model deployment'],
    relatedSkills: ['Docker', 'Kubernetes', 'CI/CD', 'MLflow', 'Python'],
  },
  // --- CLOUD & DEVOPS ---
  {
    canonical: 'Google Cloud',
    category: 'Cloud Computing',
    synonyms: ['gcp', 'google cloud', 'google cloud platform'],
    relatedSkills: ['Cloud Computing', 'BigQuery', 'Kubernetes', 'Docker'],
  },
  {
    canonical: 'Azure',
    category: 'Cloud Computing',
    synonyms: ['azure', 'microsoft azure'],
    relatedSkills: ['Cloud Computing', 'Docker', 'Kubernetes', 'DevOps'],
  },
  {
    canonical: 'Kubernetes',
    category: 'DevOps',
    synonyms: ['kubernetes', 'k8s'],
    relatedSkills: ['Docker', 'Helm', 'ArgoCD', 'DevOps', 'Cloud Computing'],
  },
  {
    canonical: 'Terraform',
    category: 'DevOps & Cloud',
    synonyms: ['terraform', 'opentofu', 'infrastructure as code', 'iac'],
    relatedSkills: ['AWS', 'Azure', 'Google Cloud', 'DevOps', 'CI/CD'],
  },
  {
    canonical: 'Helm',
    category: 'DevOps',
    synonyms: ['helm', 'helm charts'],
    relatedSkills: ['Kubernetes', 'Docker', 'DevOps'],
  },
  {
    canonical: 'ArgoCD',
    category: 'DevOps',
    synonyms: ['argocd', 'gitops', 'argo rollouts'],
    relatedSkills: ['Kubernetes', 'CI/CD', 'DevOps'],
  },
  {
    canonical: 'Prometheus',
    category: 'DevOps',
    synonyms: ['prometheus', 'promql'],
    relatedSkills: ['Grafana', 'SRE', 'Monitoring', 'DevOps'],
  },
  {
    canonical: 'Grafana',
    category: 'DevOps',
    synonyms: ['grafana', 'grafana dashboards', 'loki'],
    relatedSkills: ['Prometheus', 'Monitoring', 'SRE'],
  },
  {
    canonical: 'Site Reliability Engineering',
    category: 'DevOps',
    synonyms: ['sre', 'site reliability engineering', 'sli slo'],
    relatedSkills: ['Prometheus', 'Grafana', 'System Design', 'DevOps'],
  },
  // --- SOFTWARE ARCHITECTURE & BACKEND ---
  {
    canonical: 'System Design',
    category: 'Software Architecture',
    synonyms: ['system design', 'high level design', 'hld', 'scalable architecture'],
    relatedSkills: ['Distributed Systems', 'Microservices', 'Database Architecture'],
  },
  {
    canonical: 'Distributed Systems',
    category: 'Software Architecture',
    synonyms: ['distributed systems', 'consensus', 'raft', 'paxos'],
    relatedSkills: ['System Design', 'Microservices', 'Distributed Databases'],
  },
  {
    canonical: 'Microservices',
    category: 'Software Architecture',
    synonyms: ['microservices', 'microservice architecture'],
    relatedSkills: ['System Design', 'Docker', 'Kubernetes', 'API Gateway', 'gRPC'],
  },
  {
    canonical: 'Spring Boot',
    category: 'Backend Development',
    synonyms: ['spring boot', 'spring framework', 'spring boot 3'],
    relatedSkills: ['Java', 'Microservices', 'PostgreSQL', 'Docker'],
  },
  {
    canonical: 'FastAPI',
    category: 'Backend Development',
    synonyms: ['fastapi', 'fastapi python', 'pydantic api'],
    relatedSkills: ['Python', 'Docker', 'AI API Integration', 'PostgreSQL'],
  },
  {
    canonical: 'Django',
    category: 'Backend Development',
    synonyms: ['django', 'django rest framework', 'drf'],
    relatedSkills: ['Python', 'PostgreSQL', 'Backend Development'],
  },
  {
    canonical: 'GraphQL',
    category: 'Backend Development',
    synonyms: ['graphql', 'apollo graphql'],
    relatedSkills: ['REST API Development', 'Node.js', 'React.js'],
  },
  {
    canonical: 'gRPC',
    category: 'Backend Development',
    synonyms: ['grpc', 'protobuf', 'protocol buffers'],
    relatedSkills: ['Microservices', 'Distributed Systems', 'Go'],
  },
  {
    canonical: 'Apache Kafka',
    category: 'Backend Development',
    synonyms: ['kafka', 'apache kafka', 'kafka streams'],
    relatedSkills: ['Event-Driven Architecture', 'Distributed Systems', 'Microservices'],
  },
  {
    canonical: 'RabbitMQ',
    category: 'Backend Development',
    synonyms: ['rabbitmq', 'amqp', 'message queues'],
    relatedSkills: ['Event-Driven Architecture', 'Backend Development', 'Microservices'],
  },
  // --- CYBERSECURITY ---
  {
    canonical: 'Cybersecurity',
    category: 'Cybersecurity',
    synonyms: ['cybersecurity', 'infosec', 'information security'],
    relatedSkills: ['Network Security', 'Ethical Hacking', 'Cryptography', 'OWASP'],
  },
  {
    canonical: 'Ethical Hacking',
    category: 'Cybersecurity',
    synonyms: ['ethical hacking', 'penetration testing', 'pentesting', 'red team'],
    relatedSkills: ['Cybersecurity', 'Web Security', 'Network Security'],
  },
  {
    canonical: 'SIEM',
    category: 'Cybersecurity',
    synonyms: ['siem', 'splunk', 'microsoft sentinel', 'wazuh'],
    relatedSkills: ['SOC Operations', 'Cybersecurity', 'Monitoring'],
  },
  {
    canonical: 'Zero Trust',
    category: 'Cybersecurity',
    synonyms: ['zero trust', 'zero trust architecture', 'zta', 'ztna'],
    relatedSkills: ['Cybersecurity', 'Authentication', 'Security Architecture'],
  },
  // --- BIG DATA & DATA ENGINEERING ---
  {
    canonical: 'Apache Spark',
    category: 'Data Engineering',
    synonyms: ['spark', 'apache spark', 'pyspark', 'spark sql'],
    relatedSkills: ['Big Data Architecture', 'Databricks', 'Data Lakes', 'Python'],
  },
  {
    canonical: 'Apache Airflow',
    category: 'Data Engineering',
    synonyms: ['airflow', 'apache airflow', 'data pipelines'],
    relatedSkills: ['ETL Pipelines', 'Python', 'Docker'],
  },
  {
    canonical: 'Databricks',
    category: 'Data Engineering',
    synonyms: ['databricks', 'delta lake', 'lakehouse'],
    relatedSkills: ['Apache Spark', 'Data Lakes', 'Big Data Architecture'],
  },
  // --- IOT & HARDWARE ---
  {
    canonical: 'IoT',
    category: 'IoT & Embedded',
    synonyms: ['iot', 'internet of things', 'embedded systems', 'arduino', 'raspberry pi', 'esp32'],
    relatedSkills: ['MQTT', 'Sensors', 'C++', 'Edge AI', 'Microcontrollers'],
  },
  {
    canonical: 'OpenCV',
    category: 'Computer Vision',
    synonyms: ['opencv', 'opencv python', 'image processing'],
    relatedSkills: ['Computer Vision', 'Python', 'YOLO', 'Deep Learning'],
  },
  {
    canonical: 'YOLO',
    category: 'Computer Vision',
    synonyms: ['yolo', 'yolov8', 'object detection'],
    relatedSkills: ['Computer Vision', 'OpenCV', 'PyTorch'],
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
    const reqWords = normReq.split(/\s+/);
    const hasFullWordMatch =
      studentWords.includes(normReq) ||
      reqWords.includes(normStudent) ||
      (normStudent.length >= 4 && normReq.length >= 4 && (normStudent.includes(normReq) || normReq.includes(normStudent)));

    if (hasFullWordMatch) {
      return { matched: true, score: 0.8, relation: 'synonym', canonical: requiredSkill };
    }
  }

  return { matched: false, score: 0, relation: 'none', canonical: requiredSkill };
}
