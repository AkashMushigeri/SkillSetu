import { Skill, SkillTier, LearningResource } from '@/types/student';
import { EXPANDED_BASIC_SKILLS } from './skillsCatalogBasic';
import { EXPANDED_INTERMEDIATE_SKILLS } from './skillsCatalogIntermediate';
import { EXPANDED_INTERMEDIATE_AI_CLOUD_SKILLS } from './skillsCatalogIntermediate2';
import { EXPANDED_ADVANCED_SKILLS } from './skillsCatalogAdvanced';

export interface SkillItem {
  id: string;
  name: string;
  tier: SkillTier;
  level: 'Basic' | 'Intermediate' | 'Advanced';
  category: string;
  icon: string;
  aliases?: string[];
  relatedSkills?: string[];
  description: string;
  defaultProgress: number;
  defaultStatus: 'Not Started' | 'In Progress' | 'Verified';
  isVerified?: boolean;
  verifiedDate?: string;
  bestScore?: number;
  careerRoles: string[];
  recommendedAction?: string;
  relatedOpportunityCount: number;
  estimatedTime: string;
  learningObjectives: string[];
  resources: LearningResource[];
}

export type SkillLevelKey = 'basic' | 'intermediate' | 'advanced';

const CORE_SKILLS_DATA: Record<SkillLevelKey, SkillItem[]> = {
  basic: [
    {
      id: 'c-basic',
      name: 'C Programming',
      tier: 'Basic',
      level: 'Basic',
      category: 'Core Programming',
      icon: '⚙️',
      description: 'Master procedural programming, pointers, dynamic memory allocation (malloc/free), structs, and low-level algorithmic logic.',
      defaultProgress: 0,
      defaultStatus: 'Not Started',
      careerRoles: ['Systems Engineer', 'Firmware Engineer', 'Embedded Developer', 'Software Engineer'],
      recommendedAction: 'Continue Curriculum & Assessment',
      relatedOpportunityCount: 8,
      estimatedTime: '15 Hours',
      learningObjectives: [
        'C compilation pipeline, syntax rules & execution structure',
        'Control flow, modular functions & recursive algorithmic logic',
        'Pointer arithmetic, address manipulation & array relations',
        'Dynamic memory management (malloc, calloc, realloc, free)',
        'User-defined types (struct, union) and file I/O operations'
      ],
      resources: [
        { id: 'c-1', title: 'C Fundamentals: Program Structure & Compilation', type: 'doc', duration: '35 min', completed: false, topic: 'Fundamentals' },
        { id: 'c-2', title: 'Control Flow, Functions & Recursive Problem Solving', type: 'video', duration: '40 min', completed: false, topic: 'Functions' },
        { id: 'c-3', title: 'Pointers & Memory Addressing In-Depth', type: 'doc', duration: '45 min', completed: false, topic: 'Pointers' },
        { id: 'c-4', title: 'Dynamic Memory Allocation & Heap Management', type: 'practice', duration: '50 min', completed: false, topic: 'Memory' },
        { id: 'c-5', title: 'Mini Project: In-Memory Record Management Engine', type: 'mini_project', duration: '60 min', completed: false, topic: 'Project' }
      ]
    },
    {
      id: 'python-basic',
      name: 'Python',
      tier: 'Basic',
      level: 'Basic',
      category: 'Programming',
      icon: '🐍',
      description: 'Learn Python fundamentals, syntax, functions, collections, file handling, and basic problem solving.',
      defaultProgress: 0,
      defaultStatus: 'Not Started',
      careerRoles: ['Python Developer', 'Data Analyst', 'Backend Developer', 'Automation Engineer'],
      recommendedAction: 'Continue Curriculum & Assessment',
      relatedOpportunityCount: 14,
      estimatedTime: '12 Hours',
      learningObjectives: [
        'Master primitive types, strings, lists, tuples, and dictionaries',
        'Implement clean conditional branching and iterative loops',
        'Write modular functions, default parameters, and lambda expressions',
        'Read and write data securely using context managers (with open)',
        'Understand class syntax, constructor __init__, and method definitions'
      ],
      resources: [
        { id: 'py-1', title: 'Python Variables & Primitive Types', type: 'video', duration: '25 min', completed: false, topic: 'Variables' },
        { id: 'py-2', title: 'Lists, Tuples, and Dictionaries Deep Dive', type: 'doc', duration: '35 min', completed: false, topic: 'Data Types' },
        { id: 'py-3', title: 'Conditions & Control Flow in Real Apps', type: 'article', duration: '20 min', completed: false, topic: 'Conditions' },
        { id: 'py-4', title: 'Loops & Iterators Practice Sandbox', type: 'practice', duration: '40 min', completed: false, topic: 'Loops' },
        { id: 'py-5', title: 'Functions, Arguments, and Scope Rules', type: 'video', duration: '30 min', completed: false, topic: 'Functions' },
        { id: 'py-6', title: 'Safe File Operations & CSV Parsing', type: 'doc', duration: '25 min', completed: false, topic: 'File Handling' },
        { id: 'py-7', title: 'OOP Principles: Classes, Attributes, & Methods', type: 'article', duration: '45 min', completed: false, topic: 'OOP' },
        { id: 'py-8', title: 'Mini Project: Student Data Record Manager', type: 'mini_project', duration: '60 min', completed: false, topic: 'Mini Project' }
      ]
    },
    {
      id: 'html-basic',
      name: 'HTML',
      tier: 'Basic',
      level: 'Basic',
      category: 'Web Development',
      icon: '🌐',
      description: 'Semantic HTML5 structure, accessibility best practices (WCAG & ARIA), metadata, forms, and multimedia integration.',
      defaultProgress: 0,
      defaultStatus: 'Verified',
      isVerified: true,
      verifiedDate: '10 Aug 2026',
      bestScore: 90,
      careerRoles: ['Frontend Developer', 'Web Developer', 'UI Developer'],
      recommendedAction: 'View Verified Badge & Syllabus',
      relatedOpportunityCount: 22,
      estimatedTime: '8 Hours',
      learningObjectives: [
        'Master semantic HTML5 markup (header, nav, main, article, section)',
        'Build accessible user forms with client validation and ARIA labels',
        'Embed responsive pictures, WebP media, and vector SVG graphics',
        'Optimize SEO headers, open graph tags, and web accessibility standards'
      ],
      resources: [
        { id: 'html-1', title: 'HTML5 Semantic Layout & Hierarchy', type: 'video', duration: '25 min', completed: false, topic: 'Semantics' },
        { id: 'html-2', title: 'Accessible Forms & ARIA Roles', type: 'doc', duration: '35 min', completed: false, topic: 'Accessibility' },
        { id: 'html-3', title: 'Mini Project: Responsive Developer Portfolio', type: 'mini_project', duration: '50 min', completed: false, topic: 'Projects' }
      ]
    },
    {
      id: 'css-basic',
      name: 'CSS',
      tier: 'Basic',
      level: 'Basic',
      category: 'Web Development',
      icon: '🎨',
      description: 'Modern CSS3 layouts with Flexbox, CSS Grid, animations, fluid typography, and responsive mobile-first design.',
      defaultProgress: 0,
      defaultStatus: 'Verified',
      isVerified: true,
      verifiedDate: '15 Aug 2026',
      bestScore: 85,
      careerRoles: ['Frontend Developer', 'UI/UX Developer', 'Web Designer'],
      recommendedAction: 'View Verified Badge & Syllabus',
      relatedOpportunityCount: 20,
      estimatedTime: '10 Hours',
      learningObjectives: [
        'Understand CSS box model, cascade priority, and specificity scoring',
        'Construct fluid 1D layouts with Flexbox and 2D layouts with CSS Grid',
        'Apply mobile-first media query breakpoints and clamp() functions',
        'Create performant keyframe animations and smooth transitions'
      ],
      resources: [
        { id: 'css-1', title: 'Box Model & Modern Selectors', type: 'doc', duration: '30 min', completed: false, topic: 'Selectors' },
        { id: 'css-2', title: 'Flexbox & CSS Grid Mastery', type: 'practice', duration: '45 min', completed: false, topic: 'Layouts' },
        { id: 'css-3', title: 'Mini Project: Responsive Product Showcase', type: 'mini_project', duration: '55 min', completed: false, topic: 'Projects' }
      ]
    },
    {
      id: 'js-basic',
      name: 'JavaScript',
      tier: 'Basic',
      level: 'Basic',
      category: 'Web Development',
      icon: '🟨',
      description: 'Core modern JavaScript, ES6+ syntax, DOM manipulation, asynchronous programming, Promises, and fetch API.',
      defaultProgress: 0,
      defaultStatus: 'Not Started',
      careerRoles: ['Frontend Developer', 'Full Stack Developer', 'Web Developer'],
      recommendedAction: 'Continue Curriculum & Assessment',
      relatedOpportunityCount: 24,
      estimatedTime: '14 Hours',
      learningObjectives: [
        'Master modern ES6+ syntax: let/const, arrow functions, destructuring & spread',
        'Manipulate HTML DOM trees, elements, and styles dynamically',
        'Handle interaction events with event listeners and delegation',
        'Manage asynchronous operations with Promises, async/await, and Fetch API'
      ],
      resources: [
        { id: 'js-1', title: 'Modern ES6+ Syntax & Scoping Rules', type: 'video', duration: '30 min', completed: false, topic: 'ES6' },
        { id: 'js-2', title: 'DOM Selection & Event Delegation', type: 'doc', duration: '35 min', completed: false, topic: 'DOM' },
        { id: 'js-3', title: 'Promises, Async/Await & Fetch API', type: 'practice', duration: '40 min', completed: false, topic: 'Async' },
        { id: 'js-4', title: 'Mini Project: Interactive Task Management App', type: 'mini_project', duration: '55 min', completed: false, topic: 'Projects' }
      ]
    },
    {
      id: 'sql-basic',
      name: 'SQL',
      tier: 'Basic',
      level: 'Basic',
      category: 'Databases',
      icon: '🗄️',
      description: 'Relational database querying, SELECT, WHERE, multi-table JOINs, aggregations, GROUP BY, and schema definitions.',
      defaultProgress: 0,
      defaultStatus: 'Not Started',
      careerRoles: ['Data Analyst', 'Business Analyst', 'Database Developer', 'Backend Engineer'],
      recommendedAction: 'Continue Curriculum & Assessment',
      relatedOpportunityCount: 16,
      estimatedTime: '10 Hours',
      learningObjectives: [
        'Write structured SQL queries using SELECT, WHERE, and ORDER BY',
        'Filter data with pattern matching, logical operators, and NULL handling',
        'Execute multi-table relational joins (INNER, LEFT, RIGHT, FULL)',
        'Aggregate summary metrics with GROUP BY and HAVING clauses',
        'Design relational schemas with primary and foreign key constraints'
      ],
      resources: [
        { id: 'sql-1', title: 'SQL Foundations: SELECT, WHERE, ORDER BY', type: 'video', duration: '25 min', completed: false, topic: 'Queries' },
        { id: 'sql-2', title: 'Relational Joins: INNER, LEFT, RIGHT', type: 'doc', duration: '40 min', completed: false, topic: 'Joins' },
        { id: 'sql-3', title: 'Aggregations & GROUP BY Analysis', type: 'practice', duration: '35 min', completed: false, topic: 'Aggregations' },
        { id: 'sql-4', title: 'Mini Project: Clinic Analytics Query Sandbox', type: 'mini_project', duration: '50 min', completed: false, topic: 'Projects' }
      ]
    },
    {
      id: 'git-basic',
      name: 'Git & GitHub',
      tier: 'Basic',
      level: 'Basic',
      category: 'Developer Tools',
      icon: '🐙',
      description: 'Version control lifecycle, branching workflows, merging, conflict resolution, pull requests, and GitHub collaboration.',
      defaultProgress: 0,
      defaultStatus: 'Not Started',
      careerRoles: ['Software Engineer', 'DevOps Intern', 'Open Source Contributor'],
      recommendedAction: 'Continue Curriculum & Assessment',
      relatedOpportunityCount: 25,
      estimatedTime: '6 Hours',
      learningObjectives: [
        'Understand Git architecture (working directory, staging area, commit history)',
        'Create and switch branches, merge branches, and resolve conflicts cleanly',
        'Synchronize code with GitHub remotes using clone, push, fetch, and pull',
        'Open, review, and collaborate on GitHub Pull Requests'
      ],
      resources: [
        { id: 'git-1', title: 'Git Lifecycle & Essential Commands', type: 'doc', duration: '25 min', completed: false, topic: 'Git' },
        { id: 'git-2', title: 'Branching, Merging & Conflict Resolution', type: 'video', duration: '35 min', completed: false, topic: 'Branching' },
        { id: 'git-3', title: 'GitHub PRs & Collaborative Workflows', type: 'practice', duration: '30 min', completed: false, topic: 'Collaboration' }
      ]
    },
    {
      id: 'cn-basic',
      name: 'Computer Networks',
      tier: 'Basic',
      level: 'Basic',
      category: 'Core Computer Science',
      icon: '🌐',
      description: 'OSI and TCP/IP protocol suites, IP addressing & subnets, DNS, HTTP/HTTPS protocols, routing concepts, and network security.',
      defaultProgress: 0,
      defaultStatus: 'Not Started',
      careerRoles: ['Network Engineer', 'Systems Administrator', 'Cloud Associate', 'Site Reliability Engineer'],
      recommendedAction: 'Start Assessment & Syllabus',
      relatedOpportunityCount: 11,
      estimatedTime: '14 Hours',
      learningObjectives: [
        'Differentiate 7-layer OSI model and 4-layer TCP/IP protocol stack',
        'Understand IPv4/IPv6 addressing, subnet masking, and CIDR notation',
        'Explain DNS resolution, DHCP assignment, and ARP address discovery',
        'Compare TCP three-way handshake and UDP connectionless transport',
        'Master application protocols: HTTP/1.1, HTTP/2, HTTPS TLS certificates'
      ],
      resources: [
        { id: 'cn-1', title: 'OSI & TCP/IP Model Foundations', type: 'doc', duration: '35 min', completed: false, topic: 'Models' },
        { id: 'cn-2', title: 'IP Addressing, Subnetting & CIDR', type: 'video', duration: '40 min', completed: false, topic: 'Addressing' },
        { id: 'cn-3', title: 'Transport Layer: TCP vs UDP Deep Dive', type: 'doc', duration: '35 min', completed: false, topic: 'Transport' },
        { id: 'cn-4', title: 'Application Layer Protocols (HTTP, DNS, TLS)', type: 'practice', duration: '45 min', completed: false, topic: 'Protocols' }
      ]
    },
    {
      id: 'os-basic',
      name: 'Operating Systems',
      tier: 'Basic',
      level: 'Basic',
      category: 'Core Computer Science',
      icon: '💻',
      description: 'Process management, multithreading, CPU scheduling algorithms, virtual memory, paging, concurrency, and file system architectures.',
      defaultProgress: 0,
      defaultStatus: 'Not Started',
      careerRoles: ['Systems Programmer', 'Infrastructure Engineer', 'Software Developer'],
      recommendedAction: 'Start Assessment & Syllabus',
      relatedOpportunityCount: 10,
      estimatedTime: '16 Hours',
      learningObjectives: [
        'Understand process control blocks (PCB), process states, and context switching',
        'Evaluate CPU scheduling algorithms: FCFS, SJF, Round Robin, Priority',
        'Analyze inter-process communication (IPC), race conditions, and semaphores',
        'Master virtual memory concepts: paging, segmentation, and page replacement',
        'Explore file system organization, directory allocation, and disk scheduling'
      ],
      resources: [
        { id: 'os-1', title: 'Process Lifecycle & Context Switching', type: 'doc', duration: '35 min', completed: false, topic: 'Processes' },
        { id: 'os-2', title: 'CPU Scheduling Algorithms Simulation', type: 'practice', duration: '45 min', completed: false, topic: 'Scheduling' },
        { id: 'os-3', title: 'Deadlocks, Mutexes & Concurrency Control', type: 'video', duration: '40 min', completed: false, topic: 'Concurrency' },
        { id: 'os-4', title: 'Virtual Memory & Paging Architectures', type: 'doc', duration: '40 min', completed: false, topic: 'Memory' }
      ]
    },
    {
      id: 'dbms-basic',
      name: 'DBMS',
      tier: 'Basic',
      level: 'Basic',
      category: 'Databases',
      icon: '💾',
      description: 'Database management architecture, ER modeling, normalization (1NF to BCNF), ACID transaction management, and indexing mechanisms.',
      defaultProgress: 0,
      defaultStatus: 'Not Started',
      careerRoles: ['Database Administrator', 'Backend Engineer', 'Data Architect', 'Database Developer'],
      recommendedAction: 'Start Assessment & Syllabus',
      relatedOpportunityCount: 15,
      estimatedTime: '12 Hours',
      learningObjectives: [
        'Design Entity-Relationship (ER) and Extended ER conceptual data models',
        'Normalize database tables from 1NF through BCNF to minimize redundancy',
        'Master transaction states, schedules, serializability, and ACID properties',
        'Implement concurrency control via two-phase locking (2PL) and timestamps',
        'Understand database indexing architectures (B-Trees, B+ Trees, Hashing)'
      ],
      resources: [
        { id: 'dbms-1', title: 'Relational Database Architecture & ER Modeling', type: 'doc', duration: '35 min', completed: false, topic: 'ER Modeling' },
        { id: 'dbms-2', title: 'Database Normalization: 1NF to BCNF', type: 'video', duration: '45 min', completed: false, topic: 'Normalization' },
        { id: 'dbms-3', title: 'ACID Properties & Transaction Schedules', type: 'doc', duration: '35 min', completed: false, topic: 'Transactions' },
        { id: 'dbms-4', title: 'Indexing Internals with B+ Trees', type: 'practice', duration: '40 min', completed: false, topic: 'Indexing' }
      ]
    }
  ],

  intermediate: [
    {
      id: 'oop-int',
      name: 'Object-Oriented Programming',
      tier: 'Intermediate',
      level: 'Intermediate',
      category: 'Software Engineering',
      icon: '🧩',
      description: 'Core OOP tenets (encapsulation, abstraction, inheritance, polymorphism), SOLID principles, and clean design patterns.',
      defaultProgress: 0,
      defaultStatus: 'Not Started',
      careerRoles: ['Software Engineer', 'Backend Developer', 'System Architect'],
      recommendedAction: 'Continue Curriculum & Assessment',
      relatedOpportunityCount: 22,
      estimatedTime: '15 Hours',
      learningObjectives: [
        'Master classes, access specifiers, constructor types, and destructors',
        'Implement single, multiple, hierarchical, and virtual inheritance',
        'Apply compile-time and runtime polymorphism via method overriding',
        'Structure scalable codebases following SOLID design principles',
        'Implement foundational Gang of Four design patterns (Factory, Singleton, Observer)'
      ],
      resources: [
        { id: 'oop-1', title: 'Four Pillars of OOP & Class Architecture', type: 'doc', duration: '35 min', completed: false, topic: 'Pillars' },
        { id: 'oop-2', title: 'Polymorphism & Dynamic Dispatch', type: 'video', duration: '40 min', completed: false, topic: 'Polymorphism' },
        { id: 'oop-3', title: 'SOLID Design Principles with Production Examples', type: 'practice', duration: '50 min', completed: false, topic: 'SOLID' },
        { id: 'oop-4', title: 'Essential Design Patterns: Factory & Singleton', type: 'doc', duration: '45 min', completed: false, topic: 'Patterns' }
      ]
    },
    {
      id: 'java-int',
      name: 'Java',
      tier: 'Intermediate',
      level: 'Intermediate',
      category: 'Programming',
      icon: '☕',
      description: 'Core Java syntax, JVM architecture, Java Collections framework, multithreading, Streams API, and Spring Boot foundations.',
      defaultProgress: 0,
      defaultStatus: 'Not Started',
      careerRoles: ['Java Developer', 'Backend Engineer', 'Enterprise Application Developer'],
      recommendedAction: 'Continue Curriculum & Assessment',
      relatedOpportunityCount: 19,
      estimatedTime: '16 Hours',
      learningObjectives: [
        'Understand JVM memory model (heap, stack, metaspace) and garbage collection',
        'Master the Java Collections Framework (List, Set, Map, Queue implementations)',
        'Leverage functional programming features: Lambdas and Streams API',
        'Handle multithreading, thread safety, and synchronized keyword',
        'Build structured REST endpoints using Spring Boot microservices'
      ],
      resources: [
        { id: 'java-1', title: 'Java Collections Framework In-Depth', type: 'video', duration: '45 min', completed: false, topic: 'Collections' },
        { id: 'java-2', title: 'Streams API & Lambda Expressions', type: 'doc', duration: '40 min', completed: false, topic: 'Streams' },
        { id: 'java-3', title: 'Concurrency & Thread Management in Java', type: 'practice', duration: '45 min', completed: false, topic: 'Concurrency' },
        { id: 'java-4', title: 'Spring Boot RESTful Microservices Setup', type: 'video', duration: '50 min', completed: false, topic: 'Spring Boot' }
      ]
    },
    {
      id: 'adv-python-int',
      name: 'Advanced Python',
      tier: 'Intermediate',
      level: 'Intermediate',
      category: 'Programming',
      icon: '🐍',
      description: 'Generators, decorators, context managers, concurrency (asyncio/multiprocessing), metaprogramming, and performance optimization.',
      defaultProgress: 0,
      defaultStatus: 'Not Started',
      careerRoles: ['Python Developer', 'Data Engineer', 'Backend Architect'],
      recommendedAction: 'Continue Curriculum & Assessment',
      relatedOpportunityCount: 17,
      estimatedTime: '18 Hours',
      learningObjectives: [
        'Write custom generators and iterator protocols for memory efficiency',
        'Create function and class decorators with parameterized arguments',
        'Author context managers using contextlib and dunder methods (__enter__/__exit__)',
        'Build high-concurrency applications with asyncio event loops and coroutines',
        'Profile Python runtime and optimize critical paths with vectorization'
      ],
      resources: [
        { id: 'pyadv-1', title: 'Iterators, Generators & Memory Streaming', type: 'doc', duration: '35 min', completed: false, topic: 'Generators' },
        { id: 'pyadv-2', title: 'Decorator Patterns & Metaprogramming', type: 'video', duration: '45 min', completed: false, topic: 'Decorators' },
        { id: 'pyadv-3', title: 'Asynchronous Python with asyncio & Aiohttp', type: 'practice', duration: '50 min', completed: false, topic: 'Asyncio' },
        { id: 'pyadv-4', title: 'Multiprocessing vs Multithreading Performance', type: 'doc', duration: '40 min', completed: false, topic: 'Concurrency' }
      ]
    },
    {
      id: 'dsa-int',
      name: 'Data Structures & Algorithms',
      tier: 'Intermediate',
      level: 'Intermediate',
      category: 'Computer Science',
      icon: '🧠',
      description: 'Stacks, queues, trees, graphs, dynamic programming, sorting algorithms, and Big-O computational complexity.',
      defaultProgress: 0,
      defaultStatus: 'Not Started',
      careerRoles: ['Software Development Engineer (SDE)', 'Algorithm Developer', 'Competitive Programmer'],
      recommendedAction: 'Continue Curriculum & Assessment',
      relatedOpportunityCount: 26,
      estimatedTime: '35 Hours',
      learningObjectives: [
        'Analyze asymptotic Big-O time and space bounds across data structures',
        'Implement linked lists, binary heaps, circular queues, and monotonic stacks',
        'Execute tree traversals: BST search/insert, balanced AVL, and lowest common ancestor',
        'Traverse graphs using BFS, DFS, Dijkstra, and Topological Sort algorithms',
        'Solve complex optimization problems with 1D/2D Dynamic Programming'
      ],
      resources: [
        { id: 'dsa-1', title: 'Linear Structures: Arrays, Stacks, Queues', type: 'video', duration: '45 min', completed: false, topic: 'Linear' },
        { id: 'dsa-2', title: 'Binary Trees & Binary Search Tree Algorithms', type: 'practice', duration: '55 min', completed: false, topic: 'Trees' },
        { id: 'dsa-3', title: 'Graph Traversal & Shortest Path Algorithms', type: 'video', duration: '50 min', completed: false, topic: 'Graphs' },
        { id: 'dsa-4', title: 'Dynamic Programming Patterns: Knapsack & Grid Paths', type: 'practice', duration: '60 min', completed: false, topic: 'DP' }
      ]
    },
    {
      id: 'rest-apis-int',
      name: 'REST APIs',
      tier: 'Intermediate',
      level: 'Intermediate',
      category: 'Backend Architecture',
      icon: '🔌',
      description: 'HTTP methods, status codes, OpenAPI/Swagger specifications, authentication tokens, rate limiting, and webhook integrations.',
      defaultProgress: 0,
      defaultStatus: 'Not Started',
      careerRoles: ['API Developer', 'Backend Engineer', 'Integration Specialist'],
      recommendedAction: 'Continue Curriculum & Assessment',
      relatedOpportunityCount: 17,
      estimatedTime: '10 Hours',
      learningObjectives: [
        'Understand stateless REST architectural constraints and resource URIs',
        'Implement idempotent HTTP methods and semantic status code handling',
        'Author OpenAPI 3.0 (Swagger) specs and validate request/response schemas',
        'Secure API endpoints using Bearer JWT tokens and custom header validation',
        'Integrate outgoing webhooks and implement rate-limiting middleware'
      ],
      resources: [
        { id: 'rest-1', title: 'REST Principles & HTTP Method Idempotency', type: 'doc', duration: '30 min', completed: false, topic: 'Principles' },
        { id: 'rest-2', title: 'OpenAPI 3.0 & Interactive Swagger Documentation', type: 'practice', duration: '40 min', completed: false, topic: 'OpenAPI' },
        { id: 'rest-3', title: 'API Security, JWT Authentication & Rate Limiting', type: 'video', duration: '45 min', completed: false, topic: 'Security' },
        { id: 'rest-4', title: 'Postman Test Automation Collections', type: 'practice', duration: '40 min', completed: false, topic: 'Testing' }
      ]
    },
    {
      id: 'react-int',
      name: 'React',
      tier: 'Intermediate',
      level: 'Intermediate',
      category: 'Frontend Frameworks',
      icon: '⚛️',
      description: 'Functional components, React Hooks (useState, useEffect, useContext), custom hooks, routing, and component state management.',
      defaultProgress: 0,
      defaultStatus: 'Not Started',
      careerRoles: ['Frontend Developer', 'React Developer', 'UI Engineer', 'Web Developer'],
      recommendedAction: 'Continue Curriculum & Assessment',
      relatedOpportunityCount: 20,
      estimatedTime: '20 Hours',
      learningObjectives: [
        'Build declarative component hierarchies with JSX composition',
        'Manage reactive state and lifecycle with useState, useEffect, and useMemo',
        'Share global application state with Context API and useReducer',
        'Author custom hooks for encapsulating shared asynchronous business logic',
        'Prevent performance regressions using React.memo and useCallback'
      ],
      resources: [
        { id: 'react-1', title: 'Component Composition & State Hooks', type: 'video', duration: '35 min', completed: false, topic: 'Hooks' },
        { id: 'react-2', title: 'Side Effects & Cleanup with useEffect', type: 'doc', duration: '40 min', completed: false, topic: 'Effects' },
        { id: 'react-3', title: 'Custom Hooks Architecture & Data Fetching', type: 'practice', duration: '45 min', completed: false, topic: 'Custom Hooks' },
        { id: 'react-4', title: 'Global State Management with Context & Reducers', type: 'video', duration: '45 min', completed: false, topic: 'Context' }
      ]
    },
    {
      id: 'node-int',
      name: 'Node.js',
      tier: 'Intermediate',
      level: 'Intermediate',
      category: 'Backend Development',
      icon: '🟢',
      description: 'Asynchronous event loop, Express.js microservices, middleware pipelines, authentication with JWT, and API development.',
      defaultProgress: 0,
      defaultStatus: 'Not Started',
      careerRoles: ['Backend Developer', 'Node.js Engineer', 'Full Stack Developer'],
      recommendedAction: 'Continue Curriculum & Assessment',
      relatedOpportunityCount: 18,
      estimatedTime: '18 Hours',
      learningObjectives: [
        'Understand non-blocking asynchronous event loop and libuv thread pool',
        'Build structured microservice APIs using Express.js routers and controllers',
        'Implement middleware pipelines for logging, CORS, and error handling',
        'Store and query data using relational and document database drivers',
        'Secure endpoints with bcrypt password hashing and signed JWT tokens'
      ],
      resources: [
        { id: 'node-1', title: 'Node Event Loop & Core Modules', type: 'doc', duration: '35 min', completed: false, topic: 'Event Loop' },
        { id: 'node-2', title: 'Express.js Routing, Middleware & Controllers', type: 'video', duration: '40 min', completed: false, topic: 'Express' },
        { id: 'node-3', title: 'JWT Authentication & Security Best Practices', type: 'practice', duration: '45 min', completed: false, topic: 'Auth' },
        { id: 'node-4', title: 'Database Integration & Async Error Handling', type: 'practice', duration: '50 min', completed: false, topic: 'Database' }
      ]
    },
    {
      id: 'mongodb-int',
      name: 'MongoDB',
      tier: 'Intermediate',
      level: 'Intermediate',
      category: 'NoSQL Databases',
      icon: '🍃',
      description: 'Document store schema design, BSON validation, aggregation pipelines, compound indexing strategies, and Mongoose ODM.',
      defaultProgress: 0,
      defaultStatus: 'Not Started',
      careerRoles: ['NoSQL Database Developer', 'Full Stack Developer', 'Backend Engineer'],
      recommendedAction: 'Start Assessment & Syllabus',
      relatedOpportunityCount: 14,
      estimatedTime: '12 Hours',
      learningObjectives: [
        'Model polymorphic hierarchical data with JSON/BSON document schemas',
        'Execute CRUD operations using MongoDB shell and Compass GUI',
        'Construct multi-stage Aggregation Pipelines ($match, $group, $lookup, $project)',
        'Optimize query execution plans with single-field and compound indexes',
        'Integrate Node.js applications with Mongoose schema validation models'
      ],
      resources: [
        { id: 'mongo-1', title: 'Document Model Architecture & CRUD Operations', type: 'doc', duration: '35 min', completed: false, topic: 'Basics' },
        { id: 'mongo-2', title: 'Aggregation Pipeline Mastery ($group, $lookup)', type: 'practice', duration: '50 min', completed: false, topic: 'Aggregation' },
        { id: 'mongo-3', title: 'Indexing Strategies & Query Optimization', type: 'video', duration: '40 min', completed: false, topic: 'Indexing' },
        { id: 'mongo-4', title: 'Mongoose ODM Integration with Node.js', type: 'practice', duration: '45 min', completed: false, topic: 'Mongoose' }
      ]
    },
    {
      id: 'mysql-int',
      name: 'MySQL',
      tier: 'Intermediate',
      level: 'Intermediate',
      category: 'Relational Databases',
      icon: '🐬',
      description: 'Relational database administration, complex queries, stored procedures, indexing, triggers, and query performance optimization.',
      defaultProgress: 0,
      defaultStatus: 'Not Started',
      careerRoles: ['Database Administrator', 'SQL Developer', 'Backend Engineer'],
      recommendedAction: 'Start Assessment & Syllabus',
      relatedOpportunityCount: 15,
      estimatedTime: '14 Hours',
      learningObjectives: [
        'Administer MySQL databases, user privileges, and storage engines (InnoDB)',
        'Author stored procedures, user-defined functions, and automated triggers',
        'Analyze query execution plans using EXPLAIN and optimize slow queries',
        'Implement transaction isolation levels to prevent phantom reads and deadlocks',
        'Configure database backup, replication, and master-slave architectures'
      ],
      resources: [
        { id: 'mysql-1', title: 'InnoDB Architecture & Storage Engines', type: 'doc', duration: '35 min', completed: false, topic: 'Architecture' },
        { id: 'mysql-2', title: 'Stored Procedures, Triggers & Views', type: 'practice', duration: '45 min', completed: false, topic: 'Stored Logic' },
        { id: 'mysql-3', title: 'Query Profiling with EXPLAIN & Index Tuning', type: 'video', duration: '40 min', completed: false, topic: 'Tuning' },
        { id: 'mysql-4', title: 'Transactions, Locks & Replication Setup', type: 'doc', duration: '45 min', completed: false, topic: 'Replication' }
      ]
    },
    {
      id: 'linux-int',
      name: 'Linux',
      tier: 'Intermediate',
      level: 'Intermediate',
      category: 'Operating Systems & DevOps',
      icon: '🐧',
      description: 'Linux CLI commands, shell scripting (Bash), user permissions, systemd service management, networking, and SSH server administration.',
      defaultProgress: 0,
      defaultStatus: 'Not Started',
      careerRoles: ['Linux Administrator', 'DevOps Engineer', 'Cloud Operations Specialist'],
      recommendedAction: 'Continue Curriculum & Assessment',
      relatedOpportunityCount: 16,
      estimatedTime: '12 Hours',
      learningObjectives: [
        'Navigate the Linux file hierarchy and master pipeline tools (grep, awk, sed)',
        'Manage file permissions with chmod, chown, and access control lists (ACLs)',
        'Write robust Bash automation scripts with conditionals, loops, and flags',
        'Monitor processes (ps, top, htop, systemctl) and manage daemon services',
        'Configure secure SSH key-based access and troubleshoot networking tools (netstat, curl)'
      ],
      resources: [
        { id: 'linux-1', title: 'Linux CLI Essentials & Text Stream Processing', type: 'doc', duration: '35 min', completed: false, topic: 'CLI' },
        { id: 'linux-2', title: 'Shell Scripting with Bash & Automation', type: 'practice', duration: '45 min', completed: false, topic: 'Bash' },
        { id: 'linux-3', title: 'Systemd Services, Daemons & Cron Jobs', type: 'video', duration: '40 min', completed: false, topic: 'Systemd' },
        { id: 'linux-4', title: 'SSH Hardening, Firewall (UFW) & Networking', type: 'doc', duration: '35 min', completed: false, topic: 'Security' }
      ]
    },
    {
      id: 'swe-int',
      name: 'Software Engineering',
      tier: 'Intermediate',
      level: 'Intermediate',
      category: 'Engineering Practices',
      icon: '📐',
      description: 'Software development lifecycles (SDLC), Agile & Scrum methodologies, TDD, design patterns, and code review standards.',
      defaultProgress: 0,
      defaultStatus: 'Not Started',
      careerRoles: ['Software Engineer', 'QA Automation Engineer', 'Technical Product Manager'],
      recommendedAction: 'Start Assessment & Syllabus',
      relatedOpportunityCount: 21,
      estimatedTime: '15 Hours',
      learningObjectives: [
        'Differentiate software development methodologies: Agile, Scrum, Kanban, Waterfall',
        'Write comprehensive unit and integration tests using Test-Driven Development (TDD)',
        'Conduct constructive, secure code reviews using automated linting and CI quality gates',
        'Document software architectures using UML component and sequence diagrams',
        'Manage technical debt and refactor legacy code using industry best practices'
      ],
      resources: [
        { id: 'swe-1', title: 'Agile Frameworks, Sprints & User Story Mapping', type: 'doc', duration: '35 min', completed: false, topic: 'Agile' },
        { id: 'swe-2', title: 'Test-Driven Development (TDD) in Action', type: 'video', duration: '45 min', completed: false, topic: 'TDD' },
        { id: 'swe-3', title: 'Code Review Hygiene & Architectural Refactoring', type: 'practice', duration: '40 min', completed: false, topic: 'Code Review' },
        { id: 'swe-4', title: 'System Documentation & UML Diagrams', type: 'doc', duration: '35 min', completed: false, topic: 'UML' }
      ]
    },
    {
      id: 'ml-fundamentals-int',
      name: 'Machine Learning Fundamentals',
      tier: 'Intermediate',
      level: 'Intermediate',
      category: 'Artificial Intelligence',
      icon: '📊',
      description: 'Supervised vs unsupervised learning, data preprocessing, regression, classification, Scikit-learn, and model validation.',
      defaultProgress: 0,
      defaultStatus: 'Not Started',
      careerRoles: ['ML Intern', 'Junior Data Scientist', 'Data Analyst'],
      recommendedAction: 'Continue Curriculum & Assessment',
      relatedOpportunityCount: 15,
      estimatedTime: '20 Hours',
      learningObjectives: [
        'Formulate business problems into supervised or unsupervised learning tasks',
        'Clean raw datasets: missing value imputation, categorical one-hot encoding, and scaling',
        'Train regression models (Linear, Polynomial) and classification models (Logistic, Trees)',
        'Evaluate models using Precision, Recall, F1-Score, and ROC-AUC curves',
        'Implement k-fold cross-validation and hyperparameter grid searching in Scikit-learn'
      ],
      resources: [
        { id: 'mlf-1', title: 'ML Foundations: Problem Framing & Datasets', type: 'doc', duration: '35 min', completed: false, topic: 'Foundations' },
        { id: 'mlf-2', title: 'Data Cleaning & Preprocessing with Scikit-learn', type: 'practice', duration: '45 min', completed: false, topic: 'Preprocessing' },
        { id: 'mlf-3', title: 'Supervised Learning: Regression & Decision Trees', type: 'video', duration: '50 min', completed: false, topic: 'Algorithms' },
        { id: 'mlf-4', title: 'Model Evaluation Metrics & Cross-Validation', type: 'practice', duration: '40 min', completed: false, topic: 'Evaluation' }
      ]
    }
  ],

  advanced: [
    {
      id: 'ml-adv',
      name: 'Machine Learning',
      tier: 'Advanced',
      level: 'Advanced',
      category: 'Artificial Intelligence',
      icon: '🤖',
      description: 'Ensemble modeling, gradient boosting (XGBoost/LightGBM), hyperparameter tuning, model explainability (SHAP), and production inference.',
      defaultProgress: 0,
      defaultStatus: 'Not Started',
      careerRoles: ['ML Engineer', 'Data Scientist', 'AI Engineer', 'Research Intern'],
      recommendedAction: 'Continue Curriculum & Assessment',
      relatedOpportunityCount: 18,
      estimatedTime: '40 Hours',
      learningObjectives: [
        'Master tree ensembles: Random Forests, Gradient Boosted Trees, and XGBoost',
        'Optimize hyperparameters using Bayesian optimization and Optuna',
        'Interpret model decisions using SHAP (Shapley Additive exPlanations) and LIME',
        'Handle imbalanced class distributions using SMOTE and focal loss',
        'Export trained pipelines via ONNX and serve real-time predictions via FastAPI'
      ],
      resources: [
        { id: 'ml-1', title: 'Advanced Gradient Boosting (XGBoost & LightGBM)', type: 'video', duration: '50 min', completed: false, topic: 'Boosting' },
        { id: 'ml-2', title: 'Model Explainability with SHAP & Feature Attribution', type: 'practice', duration: '45 min', completed: false, topic: 'Explainability' },
        { id: 'ml-3', title: 'Hyperparameter Tuning with Bayesian Optimization', type: 'doc', duration: '40 min', completed: false, topic: 'Optimization' },
        { id: 'ml-4', title: 'Production Model Serving with FastAPI & Docker', type: 'mini_project', duration: '60 min', completed: false, topic: 'Deployment' }
      ]
    },
    {
      id: 'deep-learning-adv',
      name: 'Deep Learning',
      tier: 'Advanced',
      level: 'Advanced',
      category: 'Artificial Intelligence',
      icon: '🧠',
      description: 'Deep neural networks (ANN, CNN, RNN, LSTM), backpropagation, activation functions, optimization, and transfer learning.',
      defaultProgress: 0,
      defaultStatus: 'Not Started',
      careerRoles: ['Deep Learning Engineer', 'AI Research Scientist', 'Computer Vision Specialist'],
      recommendedAction: 'Start Assessment & Syllabus',
      relatedOpportunityCount: 14,
      estimatedTime: '35 Hours',
      learningObjectives: [
        'Understand multi-layer perceptron architectures, weight initialization, and backpropagation',
        'Apply modern activation functions (ReLU, GELU, Swish) and loss functions',
        'Prevent overfitting using Dropout, Batch Normalization, and Weight Decay',
        'Construct Convolutional Neural Networks (CNNs) for image classification',
        'Implement Recurrent Neural Networks (RNN/LSTM) for sequential timeseries modeling'
      ],
      resources: [
        { id: 'dl-1', title: 'Neural Network Math: Forward & Backward Propagation', type: 'doc', duration: '45 min', completed: false, topic: 'Backprop' },
        { id: 'dl-2', title: 'Convolutional Neural Networks & Feature Maps', type: 'video', duration: '50 min', completed: false, topic: 'CNN' },
        { id: 'dl-3', title: 'Sequence Modeling with LSTMs & GRUs', type: 'practice', duration: '45 min', completed: false, topic: 'RNN' },
        { id: 'dl-4', title: 'Transfer Learning with Pre-trained Architectures', type: 'doc', duration: '40 min', completed: false, topic: 'Transfer Learning' }
      ]
    },
    {
      id: 'genai-adv',
      name: 'Generative AI',
      tier: 'Advanced',
      level: 'Advanced',
      category: 'Artificial Intelligence',
      icon: '✨',
      description: 'Large Language Models (LLMs), prompt engineering, Retrieval-Augmented Generation (RAG), vector databases, and agentic workflows.',
      defaultProgress: 0,
      defaultStatus: 'Not Started',
      careerRoles: ['Generative AI Engineer', 'LLM Application Developer', 'AI Solutions Architect'],
      recommendedAction: 'Continue Curriculum & Assessment',
      relatedOpportunityCount: 22,
      estimatedTime: '30 Hours',
      learningObjectives: [
        'Understand Transformer architecture: self-attention mechanisms and positional encoding',
        'Master prompt engineering strategies: few-shot prompting, chain-of-thought, ReAct',
        'Build end-to-end RAG pipelines using text chunking, embeddings, and vector databases',
        'Implement autonomous AI agent workflows with tool calling and memory',
        'Fine-tune small language models (SLMs) using LoRA and QLoRA parameter-efficient tuning'
      ],
      resources: [
        { id: 'genai-1', title: 'Transformer Architecture & Self-Attention Math', type: 'doc', duration: '45 min', completed: false, topic: 'Transformers' },
        { id: 'genai-2', title: 'Building Production RAG with Vector Search', type: 'practice', duration: '55 min', completed: false, topic: 'RAG' },
        { id: 'genai-3', title: 'Autonomous Agent Frameworks (LangChain & AutoGen)', type: 'video', duration: '50 min', completed: false, topic: 'Agents' },
        { id: 'genai-4', title: 'Parameter-Efficient Fine-Tuning with LoRA', type: 'practice', duration: '60 min', completed: false, topic: 'Fine-Tuning' }
      ]
    },
    {
      id: 'nlp-adv',
      name: 'NLP',
      tier: 'Advanced',
      level: 'Advanced',
      category: 'Artificial Intelligence',
      icon: '🗣️',
      description: 'Text tokenization, embeddings (Word2Vec, BERT), Transformer models, sentiment analysis, NER, and language generation.',
      defaultProgress: 0,
      defaultStatus: 'Not Started',
      careerRoles: ['NLP Engineer', 'Language Technology Specialist', 'Conversational AI Developer'],
      recommendedAction: 'Start Assessment & Syllabus',
      relatedOpportunityCount: 12,
      estimatedTime: '25 Hours',
      learningObjectives: [
        'Master text preprocessing, subword tokenization (BPE, WordPiece), and lemmatization',
        'Generate dense semantic vectors using Word2Vec, GloVe, and transformer embeddings',
        'Fine-tune BERT and RoBERTa for text classification and Named Entity Recognition (NER)',
        'Evaluate generative NLP models using BLEU, ROUGE, and Perplexity metrics',
        'Build multi-turn conversational chatbots using Hugging Face transformers'
      ],
      resources: [
        { id: 'nlp-1', title: 'Text Tokenization & Word Vector Embeddings', type: 'doc', duration: '40 min', completed: false, topic: 'Embeddings' },
        { id: 'nlp-2', title: 'BERT Fine-Tuning with Hugging Face Transformers', type: 'practice', duration: '50 min', completed: false, topic: 'BERT' },
        { id: 'nlp-3', title: 'Named Entity Recognition & Information Extraction', type: 'video', duration: '45 min', completed: false, topic: 'NER' },
        { id: 'nlp-4', title: 'Generative Language Modeling & Evaluation', type: 'doc', duration: '40 min', completed: false, topic: 'Generation' }
      ]
    },
    {
      id: 'cv-adv',
      name: 'Computer Vision',
      tier: 'Advanced',
      level: 'Advanced',
      category: 'Artificial Intelligence',
      icon: '👁️',
      description: 'OpenCV image processing, convolutional architectures, object detection (YOLO), image segmentation, and edge vision models.',
      defaultProgress: 0,
      defaultStatus: 'Not Started',
      careerRoles: ['Computer Vision Engineer', 'Perception Engineer', 'Robotics Software Engineer'],
      recommendedAction: 'Start Assessment & Syllabus',
      relatedOpportunityCount: 13,
      estimatedTime: '30 Hours',
      learningObjectives: [
        'Perform color space transforms, morphological filtering, and contour detection in OpenCV',
        'Train real-time object detection models using YOLOv8 architectures',
        'Execute semantic and instance segmentation using U-Net and Mask R-CNN',
        'Estimate spatial keypoints and track visual features across video frames',
        'Quantize and deploy vision models to mobile and edge hardware using TensorRT'
      ],
      resources: [
        { id: 'cv-1', title: 'OpenCV Foundations: Filtering, Thresholding & Contours', type: 'doc', duration: '40 min', completed: false, topic: 'OpenCV' },
        { id: 'cv-2', title: 'Real-Time Object Detection with YOLOv8', type: 'practice', duration: '55 min', completed: false, topic: 'YOLO' },
        { id: 'cv-3', title: 'Image Segmentation with U-Net Architectures', type: 'video', duration: '50 min', completed: false, topic: 'Segmentation' },
        { id: 'cv-4', title: 'Edge Vision Deployment with TensorRT', type: 'practice', duration: '45 min', completed: false, topic: 'Deployment' }
      ]
    },
    {
      id: 'tensorflow-adv',
      name: 'TensorFlow',
      tier: 'Advanced',
      level: 'Advanced',
      category: 'Machine Learning Frameworks',
      icon: '🔶',
      description: 'TensorFlow 2.x and Keras, custom layers, distributed training, TF Lite edge quantization, and TensorBoard profiling.',
      defaultProgress: 0,
      defaultStatus: 'Not Started',
      careerRoles: ['ML Platform Engineer', 'AI Engineer', 'Deep Learning Specialist'],
      recommendedAction: 'Start Assessment & Syllabus',
      relatedOpportunityCount: 10,
      estimatedTime: '25 Hours',
      learningObjectives: [
        'Construct computational graphs using tf.function and TensorFlow 2.x Keras APIs',
        'Write custom layers, custom loss functions, and specialized training loops with tf.GradientTape',
        'Accelerate training across multi-GPU setups using tf.distribute.Strategy',
        'Monitor loss convergence, weight distributions, and graphs via TensorBoard',
        'Convert models to TF Lite format with post-training integer quantization'
      ],
      resources: [
        { id: 'tf-1', title: 'TensorFlow 2.x Architecture & Keras Sequential/Functional', type: 'doc', duration: '40 min', completed: false, topic: 'Architecture' },
        { id: 'tf-2', title: 'Custom Training Loops with tf.GradientTape', type: 'practice', duration: '50 min', completed: false, topic: 'GradientTape' },
        { id: 'tf-3', title: 'Distributed Training & TensorBoard Profiling', type: 'video', duration: '45 min', completed: false, topic: 'Distributed' },
        { id: 'tf-4', title: 'TF Lite Quantization for Mobile Inference', type: 'doc', duration: '35 min', completed: false, topic: 'TFLite' }
      ]
    },
    {
      id: 'pytorch-adv',
      name: 'PyTorch',
      tier: 'Advanced',
      level: 'Advanced',
      category: 'Machine Learning Frameworks',
      icon: '🔥',
      description: 'Dynamic computational graphs, Autograd engine, custom neural network modules, DataLoader pipelines, and TorchScript deployment.',
      defaultProgress: 0,
      defaultStatus: 'Not Started',
      careerRoles: ['AI Research Engineer', 'PyTorch Developer', 'Deep Learning Specialist'],
      recommendedAction: 'Continue Curriculum & Assessment',
      relatedOpportunityCount: 16,
      estimatedTime: '28 Hours',
      learningObjectives: [
        'Understand dynamic computation graphs and automatic differentiation in Autograd',
        'Subclass nn.Module to design modular deep learning architectures',
        'Optimize high-throughput data loading using torch.utils.data.Dataset and DataLoader',
        'Implement mixed-precision training (torch.cuda.amp) for memory reduction',
        'Trace and serialize models using TorchScript for C++ production runtimes'
      ],
      resources: [
        { id: 'torch-1', title: 'Tensors, Autograd & Computational Graph Math', type: 'doc', duration: '40 min', completed: false, topic: 'Autograd' },
        { id: 'torch-2', title: 'Building Modular Networks with nn.Module', type: 'practice', duration: '45 min', completed: false, topic: 'nn.Module' },
        { id: 'torch-3', title: 'High-Performance DataLoader & Mixed Precision', type: 'video', duration: '45 min', completed: false, topic: 'DataLoader' },
        { id: 'torch-4', title: 'Model Export & Production TorchScript', type: 'practice', duration: '50 min', completed: false, topic: 'TorchScript' }
      ]
    },
    {
      id: 'react-adv',
      name: 'Advanced React',
      tier: 'Advanced',
      level: 'Advanced',
      category: 'Frontend Frameworks',
      icon: '⚛️',
      description: 'React Server Components (RSC), Next.js App Router, suspense architectures, micro-frontends, and performance optimization.',
      defaultProgress: 0,
      defaultStatus: 'Not Started',
      careerRoles: ['Senior Frontend Engineer', 'React Architect', 'Full Stack Lead'],
      recommendedAction: 'Continue Curriculum & Assessment',
      relatedOpportunityCount: 19,
      estimatedTime: '22 Hours',
      learningObjectives: [
        'Master React Server Components (RSC) vs Client Component boundaries',
        'Architect nested dynamic routing, layouts, and server actions in Next.js',
        'Implement streaming SSR, React Suspense boundaries, and progressive hydration',
        'Profile web application bottlenecks using React DevTools and Chrome Performance Tracing',
        'Design micro-frontend integrations and robust enterprise design systems'
      ],
      resources: [
        { id: 'radv-1', title: 'React Server Components & Next.js App Router Architecture', type: 'doc', duration: '45 min', completed: false, topic: 'RSC' },
        { id: 'radv-2', title: 'Streaming Hydration & Suspense Boundaries', type: 'video', duration: '45 min', completed: false, topic: 'Suspense' },
        { id: 'radv-3', title: 'Server Actions & Optimistic UI Updates', type: 'practice', duration: '50 min', completed: false, topic: 'Server Actions' },
        { id: 'radv-4', title: 'Performance Profiling & Bundle Splitting Optimization', type: 'practice', duration: '40 min', completed: false, topic: 'Performance' }
      ]
    },
    {
      id: 'cloud-computing-adv',
      name: 'Cloud Computing',
      tier: 'Advanced',
      level: 'Advanced',
      category: 'Cloud Infrastructure',
      icon: '☁️',
      description: 'Multi-cloud architectures (IaaS, PaaS, SaaS), cloud governance, IAM security, cost management, and disaster recovery.',
      defaultProgress: 0,
      defaultStatus: 'Not Started',
      careerRoles: ['Cloud Architect', 'Solutions Architect', 'Cloud Infrastructure Engineer'],
      recommendedAction: 'Start Assessment & Syllabus',
      relatedOpportunityCount: 15,
      estimatedTime: '25 Hours',
      learningObjectives: [
        'Compare cloud service paradigms: IaaS, PaaS, SaaS, and serverless computing',
        'Design high-availability cloud topologies with multi-region failover and autoscaling',
        'Enforce cloud security postures, least-privilege IAM, and encryption at rest/in transit',
        'Implement cloud financial management (FinOps) and resource tagging strategies',
        'Formulate disaster recovery plans with defined RTO and RPO objectives'
      ],
      resources: [
        { id: 'cloud-1', title: 'Multi-Cloud Architecture & Resilience Patterns', type: 'doc', duration: '40 min', completed: false, topic: 'Patterns' },
        { id: 'cloud-2', title: 'Cloud Security Posture & Zero Trust IAM', type: 'video', duration: '45 min', completed: false, topic: 'Security' },
        { id: 'cloud-3', title: 'FinOps: Cloud Cost Tracking & Resource Optimization', type: 'doc', duration: '35 min', completed: false, topic: 'FinOps' },
        { id: 'cloud-4', title: 'Disaster Recovery: Active-Active vs Warm Standby', type: 'practice', duration: '45 min', completed: false, topic: 'DR' }
      ]
    },
    {
      id: 'aws-adv',
      name: 'AWS',
      tier: 'Advanced',
      level: 'Advanced',
      category: 'Cloud Computing',
      icon: '🟧',
      description: 'Amazon EC2, S3, Lambda serverless microservices, IAM security policies, VPC networking, CloudWatch, and CloudFormation.',
      defaultProgress: 0,
      defaultStatus: 'Not Started',
      careerRoles: ['Cloud Engineer', 'DevOps Engineer', 'Cloud Architect'],
      recommendedAction: 'Continue Curriculum & Assessment',
      relatedOpportunityCount: 20,
      estimatedTime: '30 Hours',
      learningObjectives: [
        'Configure secure AWS IAM policies, roles, user groups, and multi-factor auth',
        'Provision scalable compute using Amazon EC2, AMI images, and Auto Scaling groups',
        'Architect custom Virtual Private Clouds (VPC) with public/private subnets and NAT gateways',
        'Deploy serverless APIs combining AWS Lambda, API Gateway, and DynamoDB',
        'Monitor operational telemetry and configure alarms using Amazon CloudWatch'
      ],
      resources: [
        { id: 'aws-1', title: 'AWS Global Infrastructure & IAM Policies', type: 'doc', duration: '40 min', completed: false, topic: 'IAM' },
        { id: 'aws-2', title: 'Amazon EC2, Auto Scaling & Security Groups', type: 'video', duration: '50 min', completed: false, topic: 'EC2' },
        { id: 'aws-3', title: 'Custom VPC Networking & Route Tables', type: 'practice', duration: '55 min', completed: false, topic: 'VPC' },
        { id: 'aws-4', title: 'Serverless Applications with AWS Lambda & API Gateway', type: 'practice', duration: '50 min', completed: false, topic: 'Serverless' }
      ]
    },
    {
      id: 'docker-adv',
      name: 'Docker',
      tier: 'Advanced',
      level: 'Advanced',
      category: 'DevOps & Containers',
      icon: '🐳',
      description: 'Containerization principles, Dockerfile multi-stage optimization, container networking, storage volumes, and Docker Compose.',
      defaultProgress: 0,
      defaultStatus: 'Not Started',
      careerRoles: ['DevOps Engineer', 'Container Platform Engineer', 'Site Reliability Engineer'],
      recommendedAction: 'Continue Curriculum & Assessment',
      relatedOpportunityCount: 18,
      estimatedTime: '20 Hours',
      learningObjectives: [
        'Understand Linux namespaces and cgroups powering container isolation',
        'Author hardened Dockerfiles leveraging multi-stage builds for minimal image size',
        'Manage stateful container data with persistent volumes and bind mounts',
        'Configure user-defined bridge networks for isolated container communication',
        'Orchestrate multi-container microservice stacks using Docker Compose'
      ],
      resources: [
        { id: 'docker-1', title: 'Container Internals vs Virtual Machines', type: 'doc', duration: '35 min', completed: false, topic: 'Internals' },
        { id: 'docker-2', title: 'Production Multi-Stage Dockerfile Optimization', type: 'practice', duration: '50 min', completed: false, topic: 'Dockerfiles' },
        { id: 'docker-3', title: 'Networking & Persistent Volume Management', type: 'video', duration: '45 min', completed: false, topic: 'Networking' },
        { id: 'docker-4', title: 'Multi-Tier Applications with Docker Compose', type: 'practice', duration: '45 min', completed: false, topic: 'Compose' }
      ]
    },
    {
      id: 'k8s-adv',
      name: 'Kubernetes',
      tier: 'Advanced',
      level: 'Advanced',
      category: 'DevOps & Containers',
      icon: '☸️',
      description: 'Container orchestration, Pods, Deployments, Services, Ingress controllers, Helm charts, autoscaling (HPA), and cluster networking.',
      defaultProgress: 0,
      defaultStatus: 'Not Started',
      careerRoles: ['Kubernetes Administrator', 'DevOps Platform Engineer', 'Cloud Reliability Engineer'],
      recommendedAction: 'Start Assessment & Syllabus',
      relatedOpportunityCount: 16,
      estimatedTime: '30 Hours',
      learningObjectives: [
        'Understand Kubernetes control plane and node worker components',
        'Deploy declarative applications using Pods, Deployments, and ReplicaSets',
        'Expose applications externally via ClusterIP, NodePort, and Ingress controllers',
        'Manage configuration and secrets securely using ConfigMaps and Secrets',
        'Package and release complex applications using Helm chart templates'
      ],
      resources: [
        { id: 'k8s-1', title: 'Kubernetes Architecture & Control Plane Internals', type: 'doc', duration: '45 min', completed: false, topic: 'Architecture' },
        { id: 'k8s-2', title: 'Deployments, ReplicaSets & Rolling Updates', type: 'practice', duration: '50 min', completed: false, topic: 'Deployments' },
        { id: 'k8s-3', title: 'Services, Ingress Controllers & Network Policies', type: 'video', duration: '50 min', completed: false, topic: 'Networking' },
        { id: 'k8s-4', title: 'Package Management with Helm Charts', type: 'practice', duration: '45 min', completed: false, topic: 'Helm' }
      ]
    },
    {
      id: 'devops-adv',
      name: 'DevOps',
      tier: 'Advanced',
      level: 'Advanced',
      category: 'Infrastructure & CI/CD',
      icon: '🚀',
      description: 'Automated CI/CD pipelines (GitHub Actions), Infrastructure as Code with Terraform, observability, monitoring, and GitOps.',
      defaultProgress: 0,
      defaultStatus: 'Not Started',
      careerRoles: ['DevOps Engineer', 'Release Engineer', 'Platform Engineer'],
      recommendedAction: 'Continue Curriculum & Assessment',
      relatedOpportunityCount: 17,
      estimatedTime: '35 Hours',
      learningObjectives: [
        'Build automated CI/CD pipelines in GitHub Actions with test and security gates',
        'Declare reproducible cloud infrastructure using HashiCorp Terraform (IaC)',
        'Monitor production telemetry using Prometheus and Grafana dashboards',
        'Implement zero-downtime blue/green and canary deployment strategies',
        'Enforce GitOps workflows for continuous delivery using ArgoCD'
      ],
      resources: [
        { id: 'devops-1', title: 'CI/CD Pipelines with GitHub Actions Workflows', type: 'video', duration: '50 min', completed: false, topic: 'CI/CD' },
        { id: 'devops-2', title: 'Infrastructure as Code (IaC) with Terraform', type: 'practice', duration: '55 min', completed: false, topic: 'Terraform' },
        { id: 'devops-3', title: 'Observability & Monitoring with Prometheus & Grafana', type: 'doc', duration: '40 min', completed: false, topic: 'Observability' },
        { id: 'devops-4', title: 'Blue-Green & Canary Deployment Automation', type: 'practice', duration: '45 min', completed: false, topic: 'Deployments' }
      ]
    },
    {
      id: 'data-eng-adv',
      name: 'Data Engineering',
      tier: 'Advanced',
      level: 'Advanced',
      category: 'Data Architecture',
      icon: '🏗️',
      description: 'Distributed data pipelines, Apache Spark, Kafka streaming ingestion, batch ELT, data lakehouses, and Apache Airflow orchestration.',
      defaultProgress: 0,
      defaultStatus: 'Not Started',
      careerRoles: ['Data Engineer', 'Big Data Developer', 'ETL Architect'],
      recommendedAction: 'Start Assessment & Syllabus',
      relatedOpportunityCount: 15,
      estimatedTime: '35 Hours',
      learningObjectives: [
        'Design scalable batch and streaming data architectures (Lambda / Kappa)',
        'Process distributed datasets at scale with PySpark and Resilient Distributed Datasets',
        'Implement high-throughput real-time event streaming using Apache Kafka topics',
        'Orchestrate complex dependent data pipelines using Apache Airflow DAGs',
        'Store and query structured and semi-structured data in Delta Lake / Iceberg'
      ],
      resources: [
        { id: 'de-1', title: 'Data Engineering Architecture & Lakehouse Patterns', type: 'doc', duration: '40 min', completed: false, topic: 'Lakehouse' },
        { id: 'de-2', title: 'Distributed Data Processing with PySpark', type: 'practice', duration: '55 min', completed: false, topic: 'Spark' },
        { id: 'de-3', title: 'Real-Time Event Streaming with Apache Kafka', type: 'video', duration: '50 min', completed: false, topic: 'Kafka' },
        { id: 'de-4', title: 'Workflow Orchestration with Apache Airflow DAGs', type: 'practice', duration: '50 min', completed: false, topic: 'Airflow' }
      ]
    },
    {
      id: 'dmdw-adv',
      name: 'Data Mining & Data Warehousing',
      tier: 'Advanced',
      level: 'Advanced',
      category: 'Data Analytics',
      icon: '🏛️',
      description: 'Cloud data warehouses (Snowflake, BigQuery), dimensional modeling, star schemas, OLAP cubes, and association rule mining.',
      defaultProgress: 0,
      defaultStatus: 'Not Started',
      careerRoles: ['Data Warehouse Architect', 'BI Engineer', 'Data Mining Specialist'],
      recommendedAction: 'Start Assessment & Syllabus',
      relatedOpportunityCount: 13,
      estimatedTime: '28 Hours',
      learningObjectives: [
        'Design Star and Snowflake dimensional schemas with Fact and Dimension tables',
        'Implement Slowly Changing Dimensions (SCD Type 1, 2, 3) tracking',
        'Manage analytical workloads in modern cloud data warehouses (Snowflake / BigQuery)',
        'Extract hidden insights using Association Rule Mining (Apriori, FP-Growth)',
        'Perform multi-dimensional OLAP cube operations: slice, dice, roll-up, drill-down'
      ],
      resources: [
        { id: 'dmdw-1', title: 'Dimensional Modeling & Star Schema Design', type: 'doc', duration: '45 min', completed: false, topic: 'Modeling' },
        { id: 'dmdw-2', title: 'Modern Cloud Warehousing with Snowflake', type: 'video', duration: '45 min', completed: false, topic: 'Snowflake' },
        { id: 'dmdw-3', title: 'Slowly Changing Dimensions (SCD) Implementation', type: 'practice', duration: '40 min', completed: false, topic: 'SCD' },
        { id: 'dmdw-4', title: 'Association Rule Mining & Market Basket Analysis', type: 'practice', duration: '45 min', completed: false, topic: 'Mining' }
      ]
    },
    {
      id: 'cybersecurity-adv',
      name: 'Cybersecurity',
      tier: 'Advanced',
      level: 'Advanced',
      category: 'Security & Infrastructure',
      icon: '🛡️',
      description: 'Network vulnerability assessment, penetration testing fundamentals, cryptography, OWASP Top 10 vulnerabilities, and SIEM analysis.',
      defaultProgress: 0,
      defaultStatus: 'Not Started',
      careerRoles: ['Security Analyst', 'SOC Analyst', 'Cybersecurity Engineer'],
      recommendedAction: 'Start Assessment & Syllabus',
      relatedOpportunityCount: 19,
      estimatedTime: '30 Hours',
      learningObjectives: [
        'Understand the CIA triad, threat vectors, attack surfaces, and defense-in-depth',
        'Identify and remediate OWASP Top 10 web vulnerabilities (SQLi, XSS, CSRF, SSRF)',
        'Apply modern cryptography: symmetric vs asymmetric ciphers, hashing, and PKI',
        'Perform network port scanning, service reconnaissance, and banner grabbing (Nmap)',
        'Analyze security event logs and detect intrusions using SIEM platforms'
      ],
      resources: [
        { id: 'sec-1', title: 'Cybersecurity Fundamentals & CIA Triad', type: 'doc', duration: '35 min', completed: false, topic: 'Fundamentals' },
        { id: 'sec-2', title: 'OWASP Top 10 Web Vulnerabilities & Exploits', type: 'practice', duration: '55 min', completed: false, topic: 'OWASP' },
        { id: 'sec-3', title: 'Cryptography: AES, RSA, Hashing & Digital Certificates', type: 'video', duration: '45 min', completed: false, topic: 'Crypto' },
        { id: 'sec-4', title: 'SOC Monitoring & SIEM Incident Detection', type: 'practice', duration: '50 min', completed: false, topic: 'SIEM' }
      ]
    },
    {
      id: 'iot-adv',
      name: 'IoT',
      tier: 'Advanced',
      level: 'Advanced',
      category: 'Embedded Systems',
      icon: '📡',
      description: 'Embedded microcontrollers (ESP32, Arduino), IoT protocols (MQTT, CoAP), edge computing, sensor telemetry, and cloud IoT hubs.',
      defaultProgress: 0,
      defaultStatus: 'Not Started',
      careerRoles: ['IoT Solutions Engineer', 'Embedded Systems Developer', 'Firmware Engineer'],
      recommendedAction: 'Start Assessment & Syllabus',
      relatedOpportunityCount: 11,
      estimatedTime: '24 Hours',
      learningObjectives: [
        'Program microcontroller architectures (ESP32, Arduino) using C++ firmware',
        'Interface analog and digital environmental sensors (I2C, SPI, UART interfaces)',
        'Publish lightweight telemetry using MQTT publish-subscribe protocols',
        'Connect edge devices securely to cloud IoT hubs (AWS IoT Core, Azure IoT Hub)',
        'Process sensor telemetry at the edge and trigger local actuator alerts'
      ],
      resources: [
        { id: 'iot-1', title: 'IoT Architecture & Microcontroller Foundations (ESP32)', type: 'doc', duration: '35 min', completed: false, topic: 'Hardware' },
        { id: 'iot-2', title: 'Sensor Interfacing via I2C, SPI & UART Buses', type: 'practice', duration: '45 min', completed: false, topic: 'Sensors' },
        { id: 'iot-3', title: 'Publishing Telemetry with MQTT & Broker Setup', type: 'video', duration: '45 min', completed: false, topic: 'MQTT' },
        { id: 'iot-4', title: 'Cloud IoT Hub Integration & Live Telemetry Dashboards', type: 'practice', duration: '50 min', completed: false, topic: 'Cloud IoT' }
      ]
    }
  ]
};

/**
 * Merges core curriculum skills with the expanded taxonomy catalog,
 * ensuring no duplicates while preserving rich curriculum and adding aliases.
 */
function mergeSkillsCatalog(core: SkillItem[], expanded: SkillItem[]): SkillItem[] {
  const result: SkillItem[] = [...core];
  const seenIds = new Set(core.map((s) => s.id.toLowerCase()));
  const seenNames = new Set(core.map((s) => s.name.toLowerCase().replace(/[^a-z0-9]/g, '')));

  for (const item of expanded) {
    const idKey = item.id.toLowerCase();
    const nameKey = item.name.toLowerCase().replace(/[^a-z0-9]/g, '');

    if (seenIds.has(idKey) || seenNames.has(nameKey)) {
      // Find matching core item and enhance it with aliases and relatedSkills
      const existing = result.find(
        (s) =>
          s.id.toLowerCase() === idKey ||
          s.name.toLowerCase().replace(/[^a-z0-9]/g, '') === nameKey
      );
      if (existing) {
        if (item.aliases && item.aliases.length > 0) {
          existing.aliases = Array.from(new Set([...(existing.aliases || []), ...item.aliases]));
        }
        if (item.relatedSkills && item.relatedSkills.length > 0) {
          existing.relatedSkills = Array.from(new Set([...(existing.relatedSkills || []), ...item.relatedSkills]));
        }
      }
      continue;
    }

    seenIds.add(idKey);
    seenNames.add(nameKey);
    result.push(item);
  }

  return result;
}

export const SKILLS_DATA: Record<SkillLevelKey, SkillItem[]> = {
  basic: mergeSkillsCatalog(CORE_SKILLS_DATA.basic, EXPANDED_BASIC_SKILLS),
  intermediate: mergeSkillsCatalog(CORE_SKILLS_DATA.intermediate, [
    ...EXPANDED_INTERMEDIATE_SKILLS,
    ...EXPANDED_INTERMEDIATE_AI_CLOUD_SKILLS,
  ]),
  advanced: mergeSkillsCatalog(CORE_SKILLS_DATA.advanced, EXPANDED_ADVANCED_SKILLS),
};

/**
 * Returns all skills across all 3 tiers formatted as the full Skill interface
 */
export function getAllSkillsAsInitialSkills(): Skill[] {
  const allItems: SkillItem[] = [
    ...SKILLS_DATA.basic,
    ...SKILLS_DATA.intermediate,
    ...SKILLS_DATA.advanced
  ];

  return allItems.map((item) => ({
    id: item.id,
    name: item.name,
    tier: item.tier,
    category: item.category,
    icon: item.icon,
    level: item.level,
    progress: item.isVerified ? 100 : 0,
    isVerified: Boolean(item.isVerified),
    verifiedDate: item.verifiedDate,
    bestScore: item.bestScore,
    learningStatus: item.isVerified ? 'completed' : 'not_started',
    assessmentStatus: item.isVerified ? 'passed' : 'ready',
    description: item.description,
    estimatedTime: item.estimatedTime,
    learningObjectives: item.learningObjectives,
    resources: item.resources,
    careerRoles: item.careerRoles,
    relatedOpportunityCount: item.relatedOpportunityCount,
    aliases: item.aliases,
    relatedSkills: item.relatedSkills,
  }));
}

/**
 * Retrieve all skills in the catalog across all tiers
 */
export function getAllCatalogSkills(): SkillItem[] {
  return [
    ...SKILLS_DATA.basic,
    ...SKILLS_DATA.intermediate,
    ...SKILLS_DATA.advanced
  ];
}

/**
 * Find any skill in the catalog by ID, name, or alias
 */
export function findCatalogSkill(identifier: string): SkillItem | undefined {
  if (!identifier) return undefined;
  const target = identifier.toLowerCase().trim();
  const cleanTarget = target.replace(/[^a-z0-9]/g, '');

  const all = getAllCatalogSkills();
  return all.find((item) => {
    if (item.id.toLowerCase() === target) return true;
    if (item.name.toLowerCase() === target) return true;
    if (item.name.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanTarget) return true;
    if (item.aliases?.some((a) => a.toLowerCase() === target || a.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanTarget)) return true;
    return false;
  });
}

/**
 * Search the catalog by query, tier, and category
 */
export function searchCatalogSkills(
  query: string,
  tier?: SkillTier | 'All',
  category?: string
): SkillItem[] {
  let pool = getAllCatalogSkills();

  if (tier && tier !== 'All') {
    pool = pool.filter((s) => s.tier === tier);
  }

  if (category && category !== 'All') {
    pool = pool.filter((s) => s.category.toLowerCase() === category.toLowerCase());
  }

  const q = query.toLowerCase().trim();
  if (!q) return pool;

  return pool.filter((s) => {
    if (s.name.toLowerCase().includes(q)) return true;
    if (s.category.toLowerCase().includes(q)) return true;
    if (s.description.toLowerCase().includes(q)) return true;
    if (s.aliases?.some((a) => a.toLowerCase().includes(q))) return true;
    if (s.careerRoles?.some((r) => r.toLowerCase().includes(q))) return true;
    return false;
  });
}

/**
 * Get distinct categories in the catalog
 */
export function getCatalogCategories(tier?: SkillTier | 'All'): string[] {
  let pool = getAllCatalogSkills();
  if (tier && tier !== 'All') {
    pool = pool.filter((s) => s.tier === tier);
  }
  const set = new Set<string>();
  pool.forEach((s) => set.add(s.category));
  return Array.from(set).sort();
}

/**
 * Skill to Career Role mappings for the featured opportunity section
 */
export const CAREER_ROLE_MAPPINGS = [
  {
    skill: 'Python',
    icon: '🐍',
    roles: ['Data Analyst', 'Python Developer', 'Backend Developer', 'Automation Engineer'],
    highlightRole: 'Data Analyst Intern @ Google (₹50k/mo)',
  },
  {
    skill: 'React',
    icon: '⚛️',
    roles: ['Frontend Developer', 'React Developer', 'UI Engineer', 'Web Developer'],
    highlightRole: 'Junior Frontend Developer Intern (₹22k/mo)',
  },
  {
    skill: 'Machine Learning',
    icon: '🤖',
    roles: ['ML Engineer', 'Data Scientist', 'AI Engineer', 'Research Intern'],
    highlightRole: 'AI Research Intern @ TechNova Labs (₹35k/mo)',
  },
  {
    skill: 'Cybersecurity',
    icon: '🛡️',
    roles: ['Security Analyst', 'SOC Analyst', 'Cybersecurity Engineer'],
    highlightRole: 'Associate Security Analyst @ CyberShield (₹6.8 LPA)',
  },
  {
    skill: 'SQL & DBMS',
    icon: '🗄️',
    roles: ['Data Analyst', 'Business Analyst', 'Database Developer', 'Data Engineer'],
    highlightRole: 'Business Analyst Intern @ Swiggy (₹25k/mo)',
  },
  {
    skill: 'AWS & Cloud Computing',
    icon: '☁️',
    roles: ['Cloud Engineer', 'DevOps Engineer', 'Cloud Architect'],
    highlightRole: 'Graduate Cloud Support Specialist @ Wipro (₹4.2 LPA)',
  },
  {
    skill: 'Java & Backend Architecture',
    icon: '☕',
    roles: ['Java Developer', 'Backend Engineer', 'Enterprise Application Developer'],
    highlightRole: 'Enterprise Software Associate @ Infosys (₹5.5 LPA)',
  },
  {
    skill: 'Docker & DevOps',
    icon: '🚀',
    roles: ['DevOps Engineer', 'Release Engineer', 'Platform Engineer'],
    highlightRole: 'DevOps & Cloud Intern @ CloudNine (₹30k/mo)',
  },
  {
    skill: 'Computer Networks',
    icon: '🌐',
    roles: ['Network Engineer', 'Systems Administrator', 'Site Reliability Engineer'],
    highlightRole: 'Network Infrastructure Associate @ Cisco (₹7.2 LPA)',
  },
];
