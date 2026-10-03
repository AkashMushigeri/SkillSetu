import type { SkillItem } from './skillsData';

/**
 * Expanded Skill Taxonomy & Comprehensive Curriculum Library
 * Covering: Programming, Web Development, Databases, Data Science, AI/ML,
 * Deep Learning, Generative AI, Cloud, DevOps, Cybersecurity, DSA, IoT & Software Engineering.
 */

export const EXPANDED_BASIC_SKILLS: SkillItem[] = [
  // --- PROGRAMMING ---
  {
    id: 'cpp-basic',
    name: 'C++',
    tier: 'Basic',
    level: 'Basic',
    category: 'Programming',
    icon: '⚡',
    aliases: ['CPP', 'C Plus Plus'],
    relatedSkills: ['C Programming', 'Data Structures', 'OOP', 'STL'],
    description: 'Foundations of C++, standard template library (STL vectors, maps), classes, references, memory management, and algorithmic syntax.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Software Engineer', 'C++ Developer', 'Game Developer', 'Systems Engineer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 16,
    estimatedTime: '14 Hours',
    learningObjectives: [
      'Understand C++ compilation, basic syntax, namespaces, and standard I/O (cin/cout)',
      'Master reference variables, memory addressing, and const correctness',
      'Learn basic Object-Oriented syntax: classes, access specifiers, and constructors',
      'Use essential Standard Template Library (STL) containers: vector, string, pair, map',
      'Write clean algorithmic functions and implement modular header separations'
    ],
    resources: [
      { id: 'cpp-1', title: 'C++ Syntax, Compilation & I/O Streams', type: 'doc', duration: '30 min', completed: false, topic: 'Syntax' },
      { id: 'cpp-2', title: 'Classes & Objects in Modern C++', type: 'video', duration: '45 min', completed: false, topic: 'Classes' },
      { id: 'cpp-3', title: 'STL Vector & Map Essential Practice', type: 'practice', duration: '40 min', completed: false, topic: 'STL' },
      { id: 'cpp-4', title: 'Mini Project: Student Grade Calculator', type: 'mini_project', duration: '50 min', completed: false, topic: 'Projects' }
    ]
  },
  {
    id: 'java-basic',
    name: 'Java',
    tier: 'Basic',
    level: 'Basic',
    category: 'Programming',
    icon: '☕',
    aliases: ['Core Java', 'Java Basics', 'JDK'],
    relatedSkills: ['OOP', 'Spring Boot', 'Data Structures', 'Backend Development'],
    description: 'Core Java fundamentals, JVM/JRE architecture, primitive types, control structures, basic OOP classes, and Java standard library collections.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Java Developer', 'Backend Developer', 'Software Engineer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 22,
    estimatedTime: '15 Hours',
    learningObjectives: [
      'Understand Java bytecode compilation, JVM execution, and package structures',
      'Master object creation, constructors, methods, and access control',
      'Apply core OOP: encapsulation, single inheritance, and method overriding',
      'Handle basic exceptions using try-catch blocks and validate inputs',
      'Use ArrayList and basic Collections for data grouping and traversal'
    ],
    resources: [
      { id: 'jav-1', title: 'Java Syntax, JVM & Bytecode Execution', type: 'doc', duration: '35 min', completed: false, topic: 'JVM' },
      { id: 'jav-2', title: 'Classes, Objects & Encapsulation', type: 'video', duration: '40 min', completed: false, topic: 'OOP' },
      { id: 'jav-3', title: 'ArrayList & Collections Practice Sandbox', type: 'practice', duration: '45 min', completed: false, topic: 'Collections' }
    ]
  },
  {
    id: 'ts-basic',
    name: 'TypeScript',
    tier: 'Basic',
    level: 'Basic',
    category: 'Programming',
    icon: '📘',
    aliases: ['TS', 'Typed JavaScript'],
    relatedSkills: ['JavaScript', 'React.js', 'Next.js', 'Node.js'],
    description: 'Static typing for JavaScript: primitives, interface definitions, custom types, union types, function signatures, and compilation configuration.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Frontend Developer', 'Full Stack Engineer', 'TypeScript Developer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 20,
    estimatedTime: '10 Hours',
    learningObjectives: [
      'Understand the TypeScript compiler (tsc) and tsconfig.json setup',
      'Declare primitive, array, tuple, and enum types accurately',
      'Model structured application data with interfaces and type aliases',
      'Utilize union types, optional properties, and type narrowing with typeof',
      'Type functions, return values, callback signatures, and asynchronous Promises'
    ],
    resources: [
      { id: 'ts-1', title: 'TypeScript Foundations & Compiler Architecture', type: 'doc', duration: '30 min', completed: false, topic: 'Foundations' },
      { id: 'ts-2', title: 'Interfaces, Types & Union Structures', type: 'video', duration: '40 min', completed: false, topic: 'Types' },
      { id: 'ts-3', title: 'Typed JavaScript Refactor Practice', type: 'practice', duration: '45 min', completed: false, topic: 'Practice' }
    ]
  },
  {
    id: 'csharp-basic',
    name: 'C#',
    tier: 'Basic',
    level: 'Basic',
    category: 'Programming',
    icon: '🔷',
    aliases: ['CSharp', 'C Sharp', '.NET Basics'],
    relatedSkills: ['.NET', 'Backend Development', 'OOP'],
    description: 'C# language foundations, .NET runtime, strongly typed syntax, classes, properties, LINQ basics, and console application design.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['.NET Developer', 'C# Engineer', 'Backend Developer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 14,
    estimatedTime: '12 Hours',
    learningObjectives: [
      'Explore .NET SDK, CLI commands (dotnet new, build, run), and project structures',
      'Master C# types, variables, loops, conditionals, and switch expressions',
      'Declare classes, auto-implemented properties, constructors, and namespaces',
      'Handle exceptions safely with structured try/catch/finally blocks',
      'Write basic LINQ queries to filter and project collections'
    ],
    resources: [
      { id: 'cs-1', title: 'C# & .NET Runtime Architecture', type: 'doc', duration: '30 min', completed: false, topic: 'Syntax' },
      { id: 'cs-2', title: 'Classes, Properties & LINQ Intro', type: 'video', duration: '40 min', completed: false, topic: 'LINQ' }
    ]
  },
  {
    id: 'php-basic',
    name: 'PHP',
    tier: 'Basic',
    level: 'Basic',
    category: 'Programming',
    icon: '🐘',
    aliases: ['Hypertext Preprocessor', 'PHP8'],
    relatedSkills: ['MySQL', 'Web Development', 'Backend Development'],
    description: 'Server-side scripting with PHP: dynamic page rendering, form handling, superglobals ($_POST, $_GET), sessions, and PDO database connections.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['PHP Developer', 'Web Developer', 'Backend Intern'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 11,
    estimatedTime: '10 Hours',
    learningObjectives: [
      'Understand PHP execution model and embedded server setup',
      'Process HTTP form inputs via $_GET and $_POST safely',
      'Manage user authentication state using $_SESSION and cookies',
      'Connect to relational databases using PDO and prepared statements'
    ],
    resources: [
      { id: 'php-1', title: 'PHP Syntax, Variables & Superglobals', type: 'doc', duration: '30 min', completed: false, topic: 'Syntax' },
      { id: 'php-2', title: 'PDO Database Integration & Security', type: 'practice', duration: '45 min', completed: false, topic: 'PDO' }
    ]
  },
  {
    id: 'go-basic',
    name: 'Go',
    tier: 'Basic',
    level: 'Basic',
    category: 'Programming',
    icon: '🐹',
    aliases: ['Golang', 'Go Language'],
    relatedSkills: ['Backend Development', 'Microservices', 'Docker'],
    description: 'Simplicity and speed of Go: strict typing, fast compilation, structs, slices, error return values, and introductory goroutines.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Go Developer', 'Cloud Engineer', 'Backend Developer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 15,
    estimatedTime: '12 Hours',
    learningObjectives: [
      'Master Go toolchain, packages, and workspace layout',
      'Use slices, maps, structs, and pointers cleanly',
      'Handle errors idiomatic to Go using explicit multiple return values',
      'Implement basic concurrent tasks with goroutines and channels'
    ],
    resources: [
      { id: 'go-1', title: 'Tour of Go: Variables, Structs & Slices', type: 'doc', duration: '35 min', completed: false, topic: 'Tour' },
      { id: 'go-2', title: 'Go Error Handling & Basic Concurrency', type: 'video', duration: '40 min', completed: false, topic: 'Concurrency' }
    ]
  },
  {
    id: 'kotlin-basic',
    name: 'Kotlin',
    tier: 'Basic',
    level: 'Basic',
    category: 'Programming',
    icon: '🎯',
    aliases: ['Kotlin Android', 'Android Development Basics'],
    relatedSkills: ['Java', 'Mobile Development', 'Android Studio'],
    description: 'Modern concise language on the JVM: null safety, data classes, smart casts, lambda expressions, and introductory Android app concepts.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Android Developer', 'Kotlin Engineer', 'Mobile Developer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 13,
    estimatedTime: '12 Hours',
    learningObjectives: [
      'Understand Kotlin null safety (nullable types, safe calls, Elvis operator)',
      'Create concise data models with data classes and default parameter values',
      'Use higher-order functions, lambdas, and collection extension methods',
      'Compile Kotlin scripts and integrate with JVM environments'
    ],
    resources: [
      { id: 'kt-1', title: 'Kotlin Null Safety & Syntax Fundamentals', type: 'doc', duration: '30 min', completed: false, topic: 'Syntax' },
      { id: 'kt-2', title: 'Data Classes, Lambdas & Collections', type: 'video', duration: '45 min', completed: false, topic: 'Functional' }
    ]
  },
  {
    id: 'swift-basic',
    name: 'Swift',
    tier: 'Basic',
    level: 'Basic',
    category: 'Programming',
    icon: '🐦',
    aliases: ['Apple Swift', 'iOS Swift'],
    relatedSkills: ['iOS Development', 'Mobile Development', 'SwiftUI Basics'],
    description: 'Swift programming fundamentals for iOS/macOS ecosystems: optionals, structs, protocols, closures, and type safety.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['iOS Developer', 'Mobile Engineer', 'Apple Platform Developer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 10,
    estimatedTime: '12 Hours',
    learningObjectives: [
      'Master Swift optionals, unwrapping (if let, guard let), and type safety',
      'Differentiate value types (struct, enum) from reference types (class)',
      'Define and conform to protocols with protocol-oriented programming principles',
      'Write closures and capture lists for asynchronous event handlers'
    ],
    resources: [
      { id: 'sw-1', title: 'Swift Optionals & Type Safety', type: 'doc', duration: '35 min', completed: false, topic: 'Syntax' },
      { id: 'sw-2', title: 'Structs, Classes & Protocol Basics', type: 'video', duration: '40 min', completed: false, topic: 'Protocols' }
    ]
  },
  {
    id: 'rust-basic',
    name: 'Rust',
    tier: 'Basic',
    level: 'Basic',
    category: 'Programming',
    icon: '🦀',
    aliases: ['Rustlang', 'Systems Programming'],
    relatedSkills: ['C++', 'Systems Engineering', 'Memory Safety'],
    description: 'Memory safety without a garbage collector: ownership rules, borrowing, lifetimes, pattern matching, Result/Option enums, and Cargo package management.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Systems Engineer', 'Rust Developer', 'Security Researcher'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 12,
    estimatedTime: '16 Hours',
    learningObjectives: [
      'Master the borrow checker: ownership rules, mutable vs immutable borrows',
      'Use Result and Option enums with exhaustive pattern matching (match)',
      'Organize modules, dependencies, and unit tests using Cargo',
      'Write memory-safe functions with zero-cost abstractions'
    ],
    resources: [
      { id: 'rs-1', title: 'Rust Ownership & Borrowing In-Depth', type: 'doc', duration: '45 min', completed: false, topic: 'Ownership' },
      { id: 'rs-2', title: 'Enums, Pattern Matching & Error Handling', type: 'video', duration: '40 min', completed: false, topic: 'Enums' }
    ]
  },

  // --- WEB DEVELOPMENT BASICS ---
  {
    id: 'rwd-basic',
    name: 'Responsive Web Design',
    tier: 'Basic',
    level: 'Basic',
    category: 'Web Development',
    icon: '📱',
    aliases: ['Mobile First Design', 'Fluid Grids', 'Media Queries'],
    relatedSkills: ['HTML', 'CSS', 'Tailwind CSS', 'Frontend Development'],
    description: 'Mobile-first design principles, CSS media queries, viewport configuration, fluid typography with clamp(), and responsive images.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Frontend Developer', 'UI Designer', 'Web Developer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 20,
    estimatedTime: '8 Hours',
    learningObjectives: [
      'Configure viewport meta tags and implement mobile-first styling strategies',
      'Design adaptive layouts with CSS media query breakpoints',
      'Use fluid length units (rem, em, vw, vh, clamp) for scalable typography',
      'Serve multi-resolution responsive images with picture and srcset tags'
    ],
    resources: [
      { id: 'rwd-1', title: 'Mobile-First Layouts & Breakpoint Architecture', type: 'doc', duration: '30 min', completed: false, topic: 'Layouts' },
      { id: 'rwd-2', title: 'Fluid Typography & Responsive Images Sandbox', type: 'practice', duration: '45 min', completed: false, topic: 'Images' }
    ]
  },
  {
    id: 'bootstrap-basic',
    name: 'Bootstrap',
    tier: 'Basic',
    level: 'Basic',
    category: 'Web Development',
    icon: '🅱️',
    aliases: ['Bootstrap 5', 'Bootstrap CSS'],
    relatedSkills: ['HTML', 'CSS', 'Responsive Web Design'],
    description: 'Rapid UI styling with Bootstrap 5: 12-column grid system, utility classes, buttons, forms, navbars, modals, and responsive breakpoints.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Web Developer', 'Frontend Intern', 'UI Developer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 15,
    estimatedTime: '8 Hours',
    learningObjectives: [
      'Master the 12-column container/row/col responsive grid structure',
      'Style interactive UI elements using standard Bootstrap component classes',
      'Customize typography, spacing, and colors using CSS utility classes',
      'Implement interactive components: navbars, modals, and tooltips'
    ],
    resources: [
      { id: 'bs-1', title: 'Bootstrap 5 Grid System & Components', type: 'doc', duration: '30 min', completed: false, topic: 'Grid' },
      { id: 'bs-2', title: 'Landing Page Clone with Bootstrap 5', type: 'mini_project', duration: '50 min', completed: false, topic: 'Project' }
    ]
  },
  {
    id: 'tailwind-basic',
    name: 'Tailwind CSS',
    tier: 'Basic',
    level: 'Basic',
    category: 'Web Development',
    icon: '🌊',
    aliases: ['Tailwind', 'Utility-First CSS'],
    relatedSkills: ['CSS', 'HTML', 'React.js', 'Next.js'],
    description: 'Modern utility-first CSS framework: flexbox/grid classes, typography, spacing, pseudo-classes (hover, focus), dark mode, and responsive modifiers.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Frontend Developer', 'UI Engineer', 'Full Stack Developer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 24,
    estimatedTime: '10 Hours',
    learningObjectives: [
      'Understand utility-first philosophy and setup with PostCSS / Vite / Next.js',
      'Apply flexbox, grid, sizing, and spacing utility classes directly in markup',
      'Use state variants (hover, active, focus, disabled) and dark mode classes',
      'Configure custom themes, breakpoints, and extended colors in tailwind.config'
    ],
    resources: [
      { id: 'tw-1', title: 'Utility-First Styling Essentials & Setup', type: 'doc', duration: '30 min', completed: false, topic: 'Setup' },
      { id: 'tw-2', title: 'Responsive Cards & Grids in Tailwind', type: 'practice', duration: '40 min', completed: false, topic: 'Practice' }
    ]
  },
  {
    id: 'basic-react',
    name: 'Basic React',
    tier: 'Basic',
    level: 'Basic',
    category: 'Web Development',
    icon: '⚛️',
    aliases: ['React Basics', 'React Components', 'Intro to React'],
    relatedSkills: ['JavaScript', 'HTML', 'CSS', 'React.js'],
    description: 'Foundations of React: JSX syntax, functional components, props passing, useState hook, conditional rendering, and list mapping with keys.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Junior Frontend Developer', 'React Intern', 'Web Developer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 26,
    estimatedTime: '12 Hours',
    learningObjectives: [
      'Understand JSX rules, virtual DOM concepts, and component hierarchies',
      'Pass data down via props and handle events with callback functions',
      'Manage local component state with the useState hook',
      'Render dynamic arrays using map() and assign unique key attributes'
    ],
    resources: [
      { id: 'br-1', title: 'JSX & Functional Components Primer', type: 'doc', duration: '30 min', completed: false, topic: 'Components' },
      { id: 'br-2', title: 'State Management with useState', type: 'video', duration: '45 min', completed: false, topic: 'State' },
      { id: 'br-3', title: 'Mini Project: Interactive Todo Application', type: 'mini_project', duration: '50 min', completed: false, topic: 'Project' }
    ]
  },
  {
    id: 'basic-node',
    name: 'Basic Node.js',
    tier: 'Basic',
    level: 'Basic',
    category: 'Web Development',
    icon: '🟢',
    aliases: ['Node Basics', 'Server-Side JavaScript'],
    relatedSkills: ['JavaScript', 'Express.js', 'REST APIs'],
    description: 'Node.js runtime foundations, CommonJS vs ES Modules, built-in modules (fs, path, http), npm scripts, and creating simple HTTP servers.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Junior Backend Developer', 'Node.js Intern', 'Web Developer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 20,
    estimatedTime: '10 Hours',
    learningObjectives: [
      'Understand the Node.js event loop and asynchronous non-blocking runtime',
      'Import/export code with CommonJS require() and ES Modules import/export',
      'Read and write files asynchronously using the built-in fs/promises module',
      'Spin up a lightweight HTTP server returning JSON payloads'
    ],
    resources: [
      { id: 'bn-1', title: 'Node.js Architecture & Built-in Modules', type: 'doc', duration: '35 min', completed: false, topic: 'Modules' },
      { id: 'bn-2', title: 'Building a Simple HTTP Server', type: 'practice', duration: '40 min', completed: false, topic: 'Server' }
    ]
  },
  {
    id: 'basic-rest-api',
    name: 'Basic REST API',
    tier: 'Basic',
    level: 'Basic',
    category: 'Web Development',
    icon: '🔌',
    aliases: ['RESTful API Basics', 'HTTP Protocol', 'API Fundamentals'],
    relatedSkills: ['JSON', 'Express.js', 'Postman', 'Web Development'],
    description: 'REST architecture principles: HTTP methods (GET, POST, PUT, DELETE), status codes (200, 201, 400, 404, 500), request headers, and JSON payloads.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Backend Developer', 'API Developer', 'Full Stack Engineer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 22,
    estimatedTime: '8 Hours',
    learningObjectives: [
      'Map CRUD operations directly to standard HTTP methods (GET, POST, PUT, DELETE)',
      'Interpret and assign appropriate HTTP response status codes',
      'Design clean REST resource URIs following industry conventions',
      'Test and validate API endpoints using curl or Postman'
    ],
    resources: [
      { id: 'ra-1', title: 'REST Architecture & HTTP Verb Semantics', type: 'doc', duration: '30 min', completed: false, topic: 'REST' },
      { id: 'ra-2', title: 'API Status Codes & Error Formatting', type: 'video', duration: '35 min', completed: false, topic: 'Status Codes' }
    ]
  },
  {
    id: 'json-basic',
    name: 'JSON',
    tier: 'Basic',
    level: 'Basic',
    category: 'Web Development',
    icon: '📋',
    aliases: ['JavaScript Object Notation', 'JSON Parsing'],
    relatedSkills: ['JavaScript', 'REST APIs', 'Web Development'],
    description: 'Standard data interchange format: syntax rules, nested objects/arrays, serialization (JSON.stringify), deserialization (JSON.parse), and validation.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Web Developer', 'Software Engineer', 'Data Analyst'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 18,
    estimatedTime: '4 Hours',
    learningObjectives: [
      'Understand strict JSON syntax rules (double quotes, key-value pairs, types)',
      'Convert JavaScript objects to JSON with JSON.stringify() and options',
      'Safely parse JSON strings with JSON.parse() and handle syntax exceptions'
    ],
    resources: [
      { id: 'jsn-1', title: 'JSON Syntax Rules & Serialization', type: 'doc', duration: '20 min', completed: false, topic: 'Syntax' }
    ]
  },
  {
    id: 'xml-basic',
    name: 'XML',
    tier: 'Basic',
    level: 'Basic',
    category: 'Web Development',
    icon: '📄',
    aliases: ['Extensible Markup Language', 'XML Parsing'],
    relatedSkills: ['Web Development', 'Technical Documentation'],
    description: 'Markup format for structured documents: elements, attributes, XML schemas (XSD), XPath traversal, and legacy enterprise integrations.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Software Engineer', 'Integration Specialist', 'Data Specialist'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 8,
    estimatedTime: '5 Hours',
    learningObjectives: [
      'Structure valid and well-formed XML documents with root elements and tags',
      'Use attributes vs nested child elements appropriately',
      'Query XML data structures using basic XPath expressions'
    ],
    resources: [
      { id: 'xml-1', title: 'XML Structure, Tags & Attributes', type: 'doc', duration: '25 min', completed: false, topic: 'XML' }
    ]
  },

  // --- DATABASES BASICS ---
  {
    id: 'mysql-basic',
    name: 'MySQL',
    tier: 'Basic',
    level: 'Basic',
    category: 'Databases',
    icon: '🐬',
    aliases: ['MySQL Database', 'RDBMS MySQL'],
    relatedSkills: ['SQL', 'Databases', 'PHP', 'Backend Development'],
    description: 'Relational database management with MySQL: creating databases, tables, defining data types, primary/foreign keys, and running CRUD queries.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Database Developer', 'Backend Engineer', 'Data Analyst'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 18,
    estimatedTime: '10 Hours',
    learningObjectives: [
      'Install and configure MySQL Server and connect using MySQL Workbench or CLI',
      'Create schemas and tables with appropriate data types (VARCHAR, INT, DATETIME)',
      'Establish primary keys, unique constraints, and foreign key relationships',
      'Execute standard INSERT, SELECT, UPDATE, and DELETE operations'
    ],
    resources: [
      { id: 'my-1', title: 'MySQL Installation, Schemas & Table Creation', type: 'doc', duration: '30 min', completed: false, topic: 'Setup' },
      { id: 'my-2', title: 'CRUD Query Execution in MySQL', type: 'practice', duration: '40 min', completed: false, topic: 'CRUD' }
    ]
  },
  {
    id: 'postgres-basic',
    name: 'PostgreSQL',
    tier: 'Basic',
    level: 'Basic',
    category: 'Databases',
    icon: '🐘',
    aliases: ['Postgres', 'PgSQL', 'Postgres Database'],
    relatedSkills: ['SQL', 'Databases', 'Node.js', 'Backend Development'],
    description: 'Advanced open-source relational database: table definitions, UUID primary keys, JSONB support, psql CLI, and basic indexing.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Backend Developer', 'Database Administrator', 'Full Stack Engineer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 22,
    estimatedTime: '11 Hours',
    learningObjectives: [
      'Connect to PostgreSQL databases via psql command-line client',
      'Define schemas with constraints (CHECK, NOT NULL, REFERENCES)',
      'Store and query semi-structured data with the JSONB column type',
      'Create single-column B-tree indexes for fast lookup performance'
    ],
    resources: [
      { id: 'pg-1', title: 'PostgreSQL Architecture & psql Shell', type: 'doc', duration: '30 min', completed: false, topic: 'psql' },
      { id: 'pg-2', title: 'Relational Integrity & JSONB Columns', type: 'practice', duration: '40 min', completed: false, topic: 'JSONB' }
    ]
  },
  {
    id: 'sqlite-basic',
    name: 'SQLite',
    tier: 'Basic',
    level: 'Basic',
    category: 'Databases',
    icon: '🗃️',
    aliases: ['Embedded Database', 'SQLite3'],
    relatedSkills: ['SQL', 'Python', 'Mobile Development'],
    description: 'Serverless, self-contained SQL database engine: single-file storage, zero-configuration setup, desktop/mobile app data persistence, and Python sqlite3.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Mobile Developer', 'Python Developer', 'Embedded Software Engineer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 12,
    estimatedTime: '6 Hours',
    learningObjectives: [
      'Understand zero-config serverless architecture and single-file persistence',
      'Create and query SQLite databases using command-line shell',
      'Integrate SQLite with Python applications using the standard sqlite3 library'
    ],
    resources: [
      { id: 'sq-1', title: 'SQLite File Architecture & Python Integration', type: 'doc', duration: '30 min', completed: false, topic: 'SQLite' }
    ]
  },
  {
    id: 'mongodb-basic',
    name: 'MongoDB Basics',
    tier: 'Basic',
    level: 'Basic',
    category: 'Databases',
    icon: '🍃',
    aliases: ['Mongo Basics', 'NoSQL Basics', 'Document Store'],
    relatedSkills: ['Node.js', 'Express.js', 'JSON', 'NoSQL'],
    description: 'Document-oriented NoSQL database: BSON documents, collections, MongoDB Compass GUI, basic CRUD commands (insertOne, find, updateOne, deleteOne).',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Full Stack Developer', 'MERN Developer', 'Backend Intern'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 19,
    estimatedTime: '9 Hours',
    learningObjectives: [
      'Contrast relational tables/rows with MongoDB collections/documents',
      'Write flexible JSON-like BSON documents with ObjectId primary keys',
      'Execute find() queries with comparison filters ($gt, $in, $regex)',
      'Update and remove documents using $set and atomic operators'
    ],
    resources: [
      { id: 'mg-1', title: 'NoSQL Concepts & MongoDB Document Model', type: 'doc', duration: '30 min', completed: false, topic: 'Concepts' },
      { id: 'mg-2', title: 'CRUD Query Sandbox with MongoDB Compass', type: 'practice', duration: '40 min', completed: false, topic: 'CRUD' }
    ]
  },
  {
    id: 'db-fundamentals-basic',
    name: 'Database Fundamentals',
    tier: 'Basic',
    level: 'Basic',
    category: 'Databases',
    icon: '💽',
    aliases: ['DB Basics', 'Database Concepts'],
    relatedSkills: ['SQL', 'DBMS', 'ER Modeling'],
    description: 'Foundations of data storage: relational vs non-relational databases, tables, keys, integrity constraints, and query processing overview.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Software Engineer', 'Data Analyst', 'Database Associate'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 15,
    estimatedTime: '8 Hours',
    learningObjectives: [
      'Understand role of databases in software applications vs flat files',
      'Differentiate SQL relational databases and NoSQL document stores',
      'Master primary keys, candidate keys, foreign keys, and referential integrity'
    ],
    resources: [
      { id: 'dbf-1', title: 'Relational Database Principles & Key Concepts', type: 'doc', duration: '30 min', completed: false, topic: 'Principles' }
    ]
  },
  {
    id: 'er-modeling-basic',
    name: 'ER Modeling',
    tier: 'Basic',
    level: 'Basic',
    category: 'Databases',
    icon: '📊',
    aliases: ['Entity Relationship Modeling', 'ER Diagram', 'Schema Modeling'],
    relatedSkills: ['DBMS', 'SQL', 'Database Design'],
    description: 'Conceptual database design: Entity-Relationship (ER) diagrams, entities, attributes, relationships, cardinalities (1:1, 1:N, M:N), and schema conversion.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Database Designer', 'Systems Analyst', 'Backend Engineer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 14,
    estimatedTime: '8 Hours',
    learningObjectives: [
      'Identify strong and weak entities, composite and multi-valued attributes',
      'Map relationship cardinalities: one-to-one, one-to-many, and many-to-many',
      'Convert ER diagrams directly into normalized relational table schemas'
    ],
    resources: [
      { id: 'er-1', title: 'ER Diagram Components & Cardinality Rules', type: 'doc', duration: '35 min', completed: false, topic: 'Diagrams' },
      { id: 'er-2', title: 'Transforming ER Models into SQL DDL Tables', type: 'practice', duration: '40 min', completed: false, topic: 'DDL' }
    ]
  },

  // --- DATA BASICS ---
  {
    id: 'excel-basic',
    name: 'Excel',
    tier: 'Basic',
    level: 'Basic',
    category: 'Data Science',
    icon: '📈',
    aliases: ['Microsoft Excel', 'Spreadsheets', 'Excel Analytics'],
    relatedSkills: ['Data Analytics', 'Statistics Basics', 'Data Visualization Basics'],
    description: 'Spreadsheet analytics: formulas (SUM, AVERAGE, IF), VLOOKUP, XLOOKUP, Pivot Tables, conditional formatting, and chart generation.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Data Analyst', 'Business Analyst', 'Operations Associate'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 22,
    estimatedTime: '8 Hours',
    learningObjectives: [
      'Write dynamic cell formulas using logic functions (IF, AND, OR)',
      'Look up cross-sheet data with VLOOKUP, INDEX/MATCH, and XLOOKUP',
      'Summarize multi-thousand row datasets using Pivot Tables and Slicers',
      'Build professional charts: bar, line, and scatter plots'
    ],
    resources: [
      { id: 'ex-1', title: 'Excel Essential Formulas & Lookup Functions', type: 'doc', duration: '30 min', completed: false, topic: 'Formulas' },
      { id: 'ex-2', title: 'Pivot Tables & Dynamic Dashboards Sandbox', type: 'practice', duration: '45 min', completed: false, topic: 'Pivot' }
    ]
  },
  {
    id: 'pandas-basic',
    name: 'Pandas Basics',
    tier: 'Basic',
    level: 'Basic',
    category: 'Data Science',
    icon: '🐼',
    aliases: ['Intro Pandas', 'Python DataFrames'],
    relatedSkills: ['Python', 'NumPy Basics', 'Data Analysis'],
    description: 'Foundations of Pandas: Series, DataFrames, CSV data loading (read_csv), head(), info(), column filtering, and summary statistics.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Data Analyst', 'Junior Data Scientist', 'Python Developer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 20,
    estimatedTime: '8 Hours',
    learningObjectives: [
      'Create and inspect 1D Series and 2D DataFrame structures',
      'Load real-world datasets from CSV and Excel spreadsheets',
      'Filter and select data slices using .loc and .iloc indexers',
      'Calculate statistical metrics with describe(), mean(), and value_counts()'
    ],
    resources: [
      { id: 'pdb-1', title: 'Pandas DataFrames & Series Foundations', type: 'doc', duration: '30 min', completed: false, topic: 'DataFrames' },
      { id: 'pdb-2', title: 'CSV Exploration & Column Indexing Sandbox', type: 'practice', duration: '40 min', completed: false, topic: 'Indexing' }
    ]
  },
  {
    id: 'numpy-basic',
    name: 'NumPy Basics',
    tier: 'Basic',
    level: 'Basic',
    category: 'Data Science',
    icon: '🔢',
    aliases: ['Intro NumPy', 'Numerical Arrays'],
    relatedSkills: ['Python', 'Pandas Basics', 'Machine Learning Fundamentals'],
    description: 'Numerical computing in Python: ndarray creation, vectorization, array shapes, broadcasting rules, and slicing multi-dimensional arrays.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Data Scientist', 'ML Engineer', 'Python Analyst'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 18,
    estimatedTime: '8 Hours',
    learningObjectives: [
      'Create multi-dimensional numpy ndarrays with np.array, arange, zeros, ones',
      'Inspect and manipulate array dimensions with .shape and .reshape()',
      'Perform vectorized mathematical operations without slow Python for-loops',
      'Understand broadcasting principles when operating on different array shapes'
    ],
    resources: [
      { id: 'npb-1', title: 'NumPy ndarrays, Slicing & Reshaping', type: 'doc', duration: '30 min', completed: false, topic: 'Arrays' },
      { id: 'npb-2', title: 'Vectorization & Broadcasting Practice', type: 'practice', duration: '40 min', completed: false, topic: 'Vectorization' }
    ]
  },
  {
    id: 'dataviz-basic',
    name: 'Data Visualization Basics',
    tier: 'Basic',
    level: 'Basic',
    category: 'Data Science',
    icon: '📊',
    aliases: ['Intro DataViz', 'Charts & Visual Analytics'],
    relatedSkills: ['Python', 'Matplotlib', 'Excel'],
    description: 'Visual storytelling: selecting appropriate chart types (bar, line, scatter, pie), color palettes, axis labeling, and basic plot generation.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Data Analyst', 'BI Specialist', 'Business Analyst'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 16,
    estimatedTime: '6 Hours',
    learningObjectives: [
      'Match analytical questions to chart types (comparisons, trends, distributions)',
      'Follow clean chart design standards: titles, readable axes, legends',
      'Generate basic plots using Python (matplotlib) or spreadsheet tools'
    ],
    resources: [
      { id: 'dvb-1', title: 'Principles of Effective Data Visualization', type: 'doc', duration: '25 min', completed: false, topic: 'Principles' }
    ]
  },
  {
    id: 'stats-basic',
    name: 'Statistics Basics',
    tier: 'Basic',
    level: 'Basic',
    category: 'Data Science',
    icon: '📉',
    aliases: ['Descriptive Statistics', 'Intro Statistics'],
    relatedSkills: ['Data Science', 'Data Analytics', 'Machine Learning Fundamentals'],
    description: 'Descriptive statistics: measures of central tendency (mean, median, mode), dispersion (range, variance, standard deviation), and percentiles.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Data Analyst', 'Junior Data Scientist', 'Research Associate'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 17,
    estimatedTime: '8 Hours',
    learningObjectives: [
      'Calculate mean, median, and mode and choose appropriate metrics for skewed data',
      'Compute variance and standard deviation to quantify data dispersion',
      'Interpret interquartile ranges (IQR) and identify potential dataset outliers'
    ],
    resources: [
      { id: 'stb-1', title: 'Central Tendency & Dispersion Metrics', type: 'doc', duration: '30 min', completed: false, topic: 'Metrics' }
    ]
  },
  {
    id: 'prob-basic',
    name: 'Probability Basics',
    tier: 'Basic',
    level: 'Basic',
    category: 'Data Science',
    icon: '🎲',
    aliases: ['Intro Probability', 'Probability Distributions'],
    relatedSkills: ['Statistics Basics', 'Data Science', 'Machine Learning Fundamentals'],
    description: 'Foundations of probability: sample spaces, events, conditional probability, Bayes theorem intuition, independent events, and normal distribution.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Data Scientist', 'Quantitative Analyst', 'ML Associate'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 14,
    estimatedTime: '7 Hours',
    learningObjectives: [
      'Define sample spaces, events, mutually exclusive vs independent events',
      'Apply conditional probability formula and understand Bayes theorem logic',
      'Understand Gaussian (normal) bell curves and standard deviations (68-95-99.7 rule)'
    ],
    resources: [
      { id: 'prb-1', title: 'Probability Laws & Bayes Theorem Intuition', type: 'doc', duration: '30 min', completed: false, topic: 'Bayes' }
    ]
  },

  // --- AI / ML BASICS ---
  {
    id: 'ai-fundamentals-basic',
    name: 'Artificial Intelligence Fundamentals',
    tier: 'Basic',
    level: 'Basic',
    category: 'AI & Machine Learning',
    icon: '🧠',
    aliases: ['AI Basics', 'Intro AI', 'Artificial Intelligence'],
    relatedSkills: ['Machine Learning Fundamentals', 'Python', 'Data Science'],
    description: 'Core concepts of Artificial Intelligence: search algorithms, knowledge representation, rule-based systems, expert systems, and modern AI paradigms.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['AI Associate', 'Software Engineer', 'Research Intern'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 20,
    estimatedTime: '10 Hours',
    learningObjectives: [
      'Trace the evolution from symbolic rule-based AI to statistical learning',
      'Understand state space search techniques (BFS, DFS, heuristic A* search)',
      'Explain agent-environment architectures, sensors, and actuators'
    ],
    resources: [
      { id: 'aif-1', title: 'History & Architectures of Artificial Intelligence', type: 'doc', duration: '30 min', completed: false, topic: 'History' },
      { id: 'aif-2', title: 'State Space & Heuristic Search Algorithms', type: 'video', duration: '40 min', completed: false, topic: 'Search' }
    ]
  },
  {
    id: 'data-preprocessing-basic',
    name: 'Data Preprocessing',
    tier: 'Basic',
    level: 'Basic',
    category: 'AI & Machine Learning',
    icon: '🧹',
    aliases: ['Data Prep', 'Data Cleaning for ML', 'Feature Preparation'],
    relatedSkills: ['Pandas Basics', 'Machine Learning Fundamentals', 'Python'],
    description: 'Preparing raw data for machine learning: missing value imputation, categorical encoding (One-Hot, Label), feature scaling (StandardScaler, MinMaxScaler).',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Data Scientist', 'ML Engineer', 'Data Analyst'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 19,
    estimatedTime: '9 Hours',
    learningObjectives: [
      'Detect and impute missing values (mean, median, mode, forward-fill)',
      'Convert categorical strings using One-Hot and Ordinal encoding',
      'Normalize numerical scales using MinMax and StandardScaler techniques',
      'Split datasets into train, validation, and test partitions without leakage'
    ],
    resources: [
      { id: 'dpp-1', title: 'Imputation & Scaling Techniques with scikit-learn', type: 'doc', duration: '30 min', completed: false, topic: 'Imputation' },
      { id: 'dpp-2', title: 'Data Cleaning & Preprocessing Pipeline Sandbox', type: 'practice', duration: '45 min', completed: false, topic: 'Pipelines' }
    ]
  },
  {
    id: 'supervised-learning-basic',
    name: 'Supervised Learning Basics',
    tier: 'Basic',
    level: 'Basic',
    category: 'AI & Machine Learning',
    icon: '🎯',
    aliases: ['Supervised ML', 'Classification and Regression Basics'],
    relatedSkills: ['Machine Learning Fundamentals', 'Scikit-learn', 'Python'],
    description: 'Learning with labeled datasets: mapping features to targets, understanding regression vs classification, linear models, and decision boundaries.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Junior ML Engineer', 'Data Scientist', 'Python Developer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 22,
    estimatedTime: '10 Hours',
    learningObjectives: [
      'Differentiate continuous target regression from discrete classification',
      'Train a simple Linear Regression model and interpret slope/intercept coefficients',
      'Train a Logistic Regression binary classifier and interpret probability outputs',
      'Visualize decision boundaries and understand overfitting vs underfitting'
    ],
    resources: [
      { id: 'slb-1', title: 'Supervised Learning Principles: Regression & Classification', type: 'doc', duration: '35 min', completed: false, topic: 'Supervised' }
    ]
  },
  {
    id: 'unsupervised-learning-basic',
    name: 'Unsupervised Learning Basics',
    tier: 'Basic',
    level: 'Basic',
    category: 'AI & Machine Learning',
    icon: '🔍',
    aliases: ['Unsupervised ML', 'Clustering Basics'],
    relatedSkills: ['Machine Learning Fundamentals', 'Python', 'Data Science'],
    description: 'Discovering hidden patterns in unlabeled data: clustering intuition (K-Means), centroid updates, and dimensionality reduction basics (PCA).',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Data Scientist', 'ML Researcher', 'Data Analyst'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 16,
    estimatedTime: '8 Hours',
    learningObjectives: [
      'Understand unsupervised learning objectives without labeled target variables',
      'Apply K-Means clustering algorithm and find optimal k via the elbow method',
      'Understand why dimensionality reduction is needed for high-dimensional data'
    ],
    resources: [
      { id: 'ulb-1', title: 'K-Means Clustering & Centroid Iterations', type: 'doc', duration: '30 min', completed: false, topic: 'Clustering' }
    ]
  },
  {
    id: 'model-eval-basic',
    name: 'Model Evaluation Basics',
    tier: 'Basic',
    level: 'Basic',
    category: 'AI & Machine Learning',
    icon: '📏',
    aliases: ['ML Metrics', 'Model Validation', 'Accuracy Precision Recall'],
    relatedSkills: ['Machine Learning Fundamentals', 'Data Science'],
    description: 'Measuring model performance: confusion matrix, accuracy, precision, recall, F1-score for classification, and MSE/RMSE/MAE for regression.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['ML Engineer', 'Data Scientist', 'QA Analyst'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 18,
    estimatedTime: '7 Hours',
    learningObjectives: [
      'Construct and read 2x2 confusion matrices (TP, TN, FP, FN)',
      'Calculate precision, recall, and harmonic mean F1-score',
      'Identify accuracy paradoxes in heavily imbalanced class distributions',
      'Evaluate continuous regression errors with Mean Squared Error (MSE)'
    ],
    resources: [
      { id: 'meb-1', title: 'Confusion Matrix, Precision, Recall & F1 Deep Dive', type: 'doc', duration: '30 min', completed: false, topic: 'Metrics' }
    ]
  },

  // --- DEVELOPER TOOLS & DEVOPS BASICS ---
  {
    id: 'github-basic',
    name: 'GitHub',
    tier: 'Basic',
    level: 'Basic',
    category: 'Developer Tools',
    icon: '🐙',
    aliases: ['GitHub Workflows', 'GitHub Repositories'],
    relatedSkills: ['Git & GitHub', 'Developer Tools'],
    description: 'Cloud repository hosting on GitHub: remote repos, forks, pull requests, issue tracking, markdown READMEs, and GitHub Pages.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Software Engineer', 'Frontend Developer', 'Open Source Contributor'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 25,
    estimatedTime: '6 Hours',
    learningObjectives: [
      'Create public and private repositories, manage SSH/HTTPS keys',
      'Fork repositories, commit changes, and submit structured Pull Requests',
      'Manage team issues, project boards, and branch protection rules'
    ],
    resources: [
      { id: 'gh-1', title: 'GitHub PR Workflow & Collaborative Coding', type: 'doc', duration: '25 min', completed: false, topic: 'GitHub' }
    ]
  },
  {
    id: 'gitlab-basic',
    name: 'GitLab',
    tier: 'Basic',
    level: 'Basic',
    category: 'Developer Tools',
    icon: '🦊',
    aliases: ['GitLab CI', 'GitLab Repositories'],
    relatedSkills: ['Git & GitHub', 'CI/CD Fundamentals'],
    description: 'DevOps lifecycle on GitLab: repository management, merge requests, issue boards, and introductory .gitlab-ci.yml pipelines.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['DevOps Intern', 'Software Engineer', 'Cloud Associate'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 12,
    estimatedTime: '6 Hours',
    learningObjectives: [
      'Manage repositories, branches, and Merge Requests (MR) on GitLab',
      'Configure issue boards, milestones, and user permission groups'
    ],
    resources: [
      { id: 'gl-1', title: 'GitLab Repository & Merge Request Essentials', type: 'doc', duration: '25 min', completed: false, topic: 'GitLab' }
    ]
  },
  {
    id: 'vscode-basic',
    name: 'VS Code',
    tier: 'Basic',
    level: 'Basic',
    category: 'Developer Tools',
    icon: '💻',
    aliases: ['Visual Studio Code', 'Code Editor'],
    relatedSkills: ['Developer Tools', 'Git & GitHub'],
    description: 'Modern code editing in VS Code: keybindings, extension ecosystem (ESLint, Prettier, Python), integrated terminal, debugging configs, and workspace settings.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Software Engineer', 'Full Stack Developer', 'Data Analyst'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 22,
    estimatedTime: '4 Hours',
    learningObjectives: [
      'Master high-productivity shortcuts (multi-cursor, command palette, symbol search)',
      'Install and configure linting and formatting extensions (ESLint, Prettier)',
      'Debug application code using breakpoints and launch.json configurations'
    ],
    resources: [
      { id: 'vsc-1', title: 'VS Code Productivity & Debugger Mastery', type: 'doc', duration: '25 min', completed: false, topic: 'VSCode' }
    ]
  },
  {
    id: 'cli-basic',
    name: 'Command Line',
    tier: 'Basic',
    level: 'Basic',
    category: 'Developer Tools',
    icon: '⌨️',
    aliases: ['CLI', 'Terminal Basics', 'Shell'],
    relatedSkills: ['Linux Basics', 'Git & GitHub'],
    description: 'Navigating operating systems via terminal: file manipulation (ls, cd, cp, mv, rm), redirection (>, >>, |), environment variables, and shell scripting basics.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Software Engineer', 'DevOps Intern', 'Systems Administrator'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 20,
    estimatedTime: '6 Hours',
    learningObjectives: [
      'Navigate directory hierarchies swiftly using absolute and relative paths',
      'Manipulate files, permissions, and directories via standard commands',
      'Pipe stdout into stdin using | and redirect output streams',
      'Inspect and export environment variables (PATH, PORT, ENV)'
    ],
    resources: [
      { id: 'cli-1', title: 'Terminal Navigation & File Manipulation', type: 'doc', duration: '25 min', completed: false, topic: 'CLI' }
    ]
  },
  {
    id: 'postman-basic',
    name: 'Postman',
    tier: 'Basic',
    level: 'Basic',
    category: 'Developer Tools',
    icon: '🚀',
    aliases: ['Postman API Client', 'API Testing Tool'],
    relatedSkills: ['Basic REST API', 'REST APIs & Web Services'],
    description: 'API client for testing HTTP endpoints: crafting requests, setting headers/params, inspecting status codes/responses, and Postman collections.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['QA Engineer', 'Backend Developer', 'Frontend Developer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 19,
    estimatedTime: '5 Hours',
    learningObjectives: [
      'Craft GET, POST, PUT, DELETE requests with body formats (JSON, form-data)',
      'Configure custom headers (Authorization Bearer tokens, Content-Type)',
      'Organize endpoints into reusable Collections and Environment variables'
    ],
    resources: [
      { id: 'pst-1', title: 'Postman Collections & Environment Variables', type: 'doc', duration: '25 min', completed: false, topic: 'Postman' }
    ]
  },
  {
    id: 'npm-basic',
    name: 'npm',
    tier: 'Basic',
    level: 'Basic',
    category: 'Developer Tools',
    icon: '📦',
    aliases: ['Node Package Manager', 'npm CLI'],
    relatedSkills: ['Basic Node.js', 'JavaScript', 'Package Management'],
    description: 'Node Package Manager: package.json structure, semantic versioning (^, ~), installing dependencies (dependencies vs devDependencies), and npm scripts.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Web Developer', 'Frontend Engineer', 'Full Stack Developer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 21,
    estimatedTime: '5 Hours',
    learningObjectives: [
      'Initialize projects with npm init and understand package.json fields',
      'Install, update, and uninstall production and development packages',
      'Understand semantic versioning (Major.Minor.Patch) and lockfiles'
    ],
    resources: [
      { id: 'npm-1', title: 'package.json, Semantic Versioning & npm Scripts', type: 'doc', duration: '25 min', completed: false, topic: 'npm' }
    ]
  },
  {
    id: 'pkg-mgmt-basic',
    name: 'Package Management',
    tier: 'Basic',
    level: 'Basic',
    category: 'Developer Tools',
    icon: '📑',
    aliases: ['Yarn', 'pnpm', 'Dependency Management'],
    relatedSkills: ['npm', 'Developer Tools'],
    description: 'Managing dependencies across software ecosystems: lockfiles, package resolution algorithms, yarn, pnpm monorepos, and pip/conda in Python.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Software Engineer', 'DevOps Associate', 'Full Stack Developer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 15,
    estimatedTime: '5 Hours',
    learningObjectives: [
      'Understand why lockfiles are essential for deterministic builds',
      'Compare npm, yarn, and pnpm symlink storage strategies',
      'Manage Python virtual environments and pip requirements.txt files'
    ],
    resources: [
      { id: 'pkg-1', title: 'Lockfiles, Monorepos & Deterministic Builds', type: 'doc', duration: '25 min', completed: false, topic: 'Packages' }
    ]
  },

  // --- CLOUD & DEVOPS BASICS ---
  {
    id: 'cloud-fundamentals-basic',
    name: 'Cloud Computing Fundamentals',
    tier: 'Basic',
    level: 'Basic',
    category: 'Cloud & DevOps',
    icon: '☁️',
    aliases: ['Intro Cloud', 'IaaS PaaS SaaS', 'Cloud Concepts'],
    relatedSkills: ['AWS Fundamentals', 'Docker Basics'],
    description: 'Cloud architecture foundations: public/private/hybrid models, service models (IaaS, PaaS, SaaS, FaaS), elasticity, scalability, and shared responsibility.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Cloud Associate', 'DevOps Intern', 'Solutions Architect'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 24,
    estimatedTime: '8 Hours',
    learningObjectives: [
      'Compare on-premises infrastructure with on-demand cloud economies',
      'Differentiate Infrastructure as a Service (IaaS), PaaS, and SaaS',
      'Understand high availability, fault tolerance, and geo-redundancy',
      'Explain the Cloud Shared Responsibility Model for security'
    ],
    resources: [
      { id: 'cf-1', title: 'Cloud Models: IaaS vs PaaS vs SaaS Architecture', type: 'doc', duration: '30 min', completed: false, topic: 'Models' }
    ]
  },
  {
    id: 'aws-fundamentals-basic',
    name: 'AWS Fundamentals',
    tier: 'Basic',
    level: 'Basic',
    category: 'Cloud & DevOps',
    icon: '🔶',
    aliases: ['AWS Cloud Practitioner', 'AWS Basics', 'Amazon Web Services Intro'],
    relatedSkills: ['Cloud Computing Fundamentals', 'AWS', 'Developer Tools'],
    description: 'Core Amazon Web Services: AWS global infrastructure (Regions, AZs), foundational compute (EC2), storage (S3), identity (IAM), and billing alerts.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Cloud Support Associate', 'Junior DevOps Engineer', 'Solutions Architect Intern'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 26,
    estimatedTime: '10 Hours',
    learningObjectives: [
      'Navigate AWS Management Console and configure multi-factor root security',
      'Understand Regions, Availability Zones (AZ), and Edge Locations',
      'Launch an EC2 virtual machine and connect via SSH keypairs',
      'Create an S3 bucket, configure permissions, and upload objects'
    ],
    resources: [
      { id: 'awsf-1', title: 'AWS Global Infrastructure & IAM Setup', type: 'doc', duration: '35 min', completed: false, topic: 'AWS' },
      { id: 'awsf-2', title: 'EC2 Instance Launch & S3 Bucket Sandbox', type: 'practice', duration: '45 min', completed: false, topic: 'EC2' }
    ]
  },
  {
    id: 'azure-fundamentals-basic',
    name: 'Azure Fundamentals',
    tier: 'Basic',
    level: 'Basic',
    category: 'Cloud & DevOps',
    icon: '🔷',
    aliases: ['AZ-900', 'Microsoft Azure Basics'],
    relatedSkills: ['Cloud Computing Fundamentals', 'Cloud & DevOps'],
    description: 'Microsoft Azure core services: Azure Resource Manager, Resource Groups, Azure Virtual Machines, Blob Storage, Entra ID (Azure AD), and portal management.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Azure Cloud Associate', 'Cloud Engineer', 'Systems Administrator'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 18,
    estimatedTime: '10 Hours',
    learningObjectives: [
      'Understand Azure Resource Manager (ARM) and resource hierarchy',
      'Deploy Virtual Machines and manage Virtual Networks (VNet)',
      'Store unstructured files in Azure Blob Storage containers'
    ],
    resources: [
      { id: 'azf-1', title: 'Azure Resource Groups & Virtual Machine Setup', type: 'doc', duration: '30 min', completed: false, topic: 'Azure' }
    ]
  },
  {
    id: 'gcp-fundamentals-basic',
    name: 'Google Cloud Fundamentals',
    tier: 'Basic',
    level: 'Basic',
    category: 'Cloud & DevOps',
    icon: '🌐',
    aliases: ['GCP Basics', 'GCP Digital Leader', 'Google Cloud Platform Intro'],
    relatedSkills: ['Cloud Computing Fundamentals', 'Cloud & DevOps'],
    description: 'Google Cloud Platform basics: GCP Console, Projects, Compute Engine, Cloud Storage buckets, IAM roles, and Cloud Shell commands.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['GCP Associate', 'Cloud Support Engineer', 'DevOps Intern'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 16,
    estimatedTime: '10 Hours',
    learningObjectives: [
      'Manage GCP projects, service accounts, and IAM predefined roles',
      'Deploy Compute Engine VM instances and configure firewall rules',
      'Store objects in Cloud Storage multi-regional and standard buckets'
    ],
    resources: [
      { id: 'gcpf-1', title: 'Google Cloud Projects & Compute Engine Basics', type: 'doc', duration: '30 min', completed: false, topic: 'GCP' }
    ]
  },
  {
    id: 'docker-basics',
    name: 'Docker Basics',
    tier: 'Basic',
    level: 'Basic',
    category: 'Cloud & DevOps',
    icon: '🐳',
    aliases: ['Containers Basics', 'Dockerfile Intro'],
    relatedSkills: ['Docker', 'Linux Basics', 'Cloud & DevOps'],
    description: 'Containerization concepts: images vs containers, writing simple Dockerfiles (FROM, COPY, RUN, CMD), docker run, and port publishing.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['DevOps Intern', 'Software Engineer', 'Backend Developer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 22,
    estimatedTime: '8 Hours',
    learningObjectives: [
      'Differentiate lightweight containers from heavy virtual machines',
      'Write Dockerfiles to containerize Node.js and Python web applications',
      'Build, tag, and run containers with port publishing (-p 3000:3000)',
      'Manage container lifecycles (docker ps, stop, logs, exec)'
    ],
    resources: [
      { id: 'dkb-1', title: 'Docker Containers vs VMs & Dockerfile Syntax', type: 'doc', duration: '30 min', completed: false, topic: 'Containers' },
      { id: 'dkb-2', title: 'Containerizing a Node Web App Sandbox', type: 'practice', duration: '40 min', completed: false, topic: 'Build' }
    ]
  },
  {
    id: 'cicd-fundamentals-basic',
    name: 'CI/CD Fundamentals',
    tier: 'Basic',
    level: 'Basic',
    category: 'Cloud & DevOps',
    icon: '🔄',
    aliases: ['Continuous Integration Basics', 'Build Pipelines Intro'],
    relatedSkills: ['Git & GitHub', 'DevOps'],
    description: 'Automation of build and test processes: continuous integration principles, automated linting/testing triggers on commit, and continuous delivery pipelines.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['DevOps Intern', 'Software Engineer', 'QA Automation Engineer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 18,
    estimatedTime: '6 Hours',
    learningObjectives: [
      'Explain the business value of frequent, automated code integration',
      'Understand stages of modern delivery pipelines: Lint -> Test -> Build -> Deploy',
      'Create a simple automated test runner workflow on code push'
    ],
    resources: [
      { id: 'cicdb-1', title: 'Continuous Integration Lifecycle & Pipeline Triggers', type: 'doc', duration: '25 min', completed: false, topic: 'Pipelines' }
    ]
  },

  // --- CYBERSECURITY BASICS ---
  {
    id: 'cybersecurity-fundamentals-basic',
    name: 'Cybersecurity Fundamentals',
    tier: 'Basic',
    level: 'Basic',
    category: 'Cybersecurity',
    icon: '🛡️',
    aliases: ['Security Basics', 'InfoSec Intro', 'Cyber Security'],
    relatedSkills: ['Computer Networks', 'Network Security Basics'],
    description: 'Core security principles: CIA Triad (Confidentiality, Integrity, Availability), threat actors, attack surfaces, defense in depth, and password hygiene.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Security Analyst', 'SOC Associate', 'Cybersecurity Engineer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 20,
    estimatedTime: '8 Hours',
    learningObjectives: [
      'Define the CIA Triad and evaluate security controls against each pillar',
      'Identify common attack vectors: phishing, malware, ransomware, social engineering',
      'Explain defense in depth and least-privilege access principles'
    ],
    resources: [
      { id: 'csf-1', title: 'The CIA Triad & Threat Vector Analysis', type: 'doc', duration: '30 min', completed: false, topic: 'CIA' }
    ]
  },
  {
    id: 'netsec-basic',
    name: 'Network Security Basics',
    tier: 'Basic',
    level: 'Basic',
    category: 'Cybersecurity',
    icon: '🔒',
    aliases: ['Firewall Basics', 'Port Security', 'Intro NetSec'],
    relatedSkills: ['Computer Networks', 'Cybersecurity Fundamentals'],
    description: 'Securing network perimeters: stateless/stateful firewalls, open port scanning, DMZ concepts, NAT, and secure protocols (SSH, HTTPS vs Telnet, HTTP).',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Network Security Associate', 'Systems Administrator', 'SOC Analyst'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 16,
    estimatedTime: '8 Hours',
    learningObjectives: [
      'Explain firewall packet filtering rules and stateful connection tracking',
      'Identify well-known secure ports (22, 443) and insecure alternatives (21, 23, 80)',
      'Analyze network traffic banners using basic scanning utilities'
    ],
    resources: [
      { id: 'nsb-1', title: 'Firewalls, NAT & Port Security Foundations', type: 'doc', duration: '30 min', completed: false, topic: 'Firewalls' }
    ]
  },
  {
    id: 'auth-basic',
    name: 'Authentication',
    tier: 'Basic',
    level: 'Basic',
    category: 'Cybersecurity',
    icon: '🔑',
    aliases: ['AuthN', 'User Login', 'Password Security'],
    relatedSkills: ['Authorization', 'Web Development', 'Cybersecurity'],
    description: 'Verifying user identity: password hashing algorithms (bcrypt, argon2), salt generation, multi-factor authentication (MFA/2FA), and biometric auth concepts.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Full Stack Developer', 'Security Analyst', 'Backend Developer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 22,
    estimatedTime: '7 Hours',
    learningObjectives: [
      'Understand why passwords must never be stored in plain text or simple MD5/SHA1',
      'Implement salted password hashing with work factors using bcrypt',
      'Explain Multi-Factor Authentication factors: something you know, have, are'
    ],
    resources: [
      { id: 'atb-1', title: 'Secure Password Hashing with Salt & bcrypt', type: 'doc', duration: '30 min', completed: false, topic: 'Hashing' }
    ]
  },
  {
    id: 'authz-basic',
    name: 'Authorization',
    tier: 'Basic',
    level: 'Basic',
    category: 'Cybersecurity',
    icon: '📜',
    aliases: ['AuthZ', 'RBAC', 'Access Control'],
    relatedSkills: ['Authentication', 'Backend Development'],
    description: 'Controlling resource permissions: Role-Based Access Control (RBAC), permission matrices, principle of least privilege, and route protection guards.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Backend Developer', 'Security Engineer', 'Software Architect'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 18,
    estimatedTime: '6 Hours',
    learningObjectives: [
      'Differentiate authentication (who you are) from authorization (what you can do)',
      'Design Role-Based Access Control (RBAC) schemas: Admin, User, Guest',
      'Implement middleware permission checks on API routes'
    ],
    resources: [
      { id: 'azb-1', title: 'RBAC Access Control Matrices & Middleware', type: 'doc', duration: '25 min', completed: false, topic: 'RBAC' }
    ]
  },
  {
    id: 'encryption-basic',
    name: 'Encryption Basics',
    tier: 'Basic',
    level: 'Basic',
    category: 'Cybersecurity',
    icon: '🔐',
    aliases: ['Ciphers', 'Symmetric & Asymmetric Encryption', 'Crypto Basics'],
    relatedSkills: ['Cybersecurity Fundamentals', 'Computer Networks'],
    description: 'Data confidentiality: symmetric ciphers (AES), asymmetric keypairs (RSA), public/private keys, digital signatures, and TLS certificate handshakes.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Security Analyst', 'Software Engineer', 'Network Associate'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 16,
    estimatedTime: '8 Hours',
    learningObjectives: [
      'Compare symmetric single-key encryption speed with asymmetric public key pairs',
      'Explain how digital signatures verify data integrity and non-repudiation',
      'Understand the HTTPS TLS handshake establishing encrypted communication'
    ],
    resources: [
      { id: 'enc-1', title: 'Symmetric vs Asymmetric Encryption & TLS Handshakes', type: 'doc', duration: '30 min', completed: false, topic: 'Encryption' }
    ]
  },
  {
    id: 'owasp-basic',
    name: 'OWASP Basics',
    tier: 'Basic',
    level: 'Basic',
    category: 'Cybersecurity',
    icon: '🚨',
    aliases: ['OWASP Intro', 'Web Vulnerability Basics'],
    relatedSkills: ['Cybersecurity Fundamentals', 'Web Development'],
    description: 'Introduction to Web Application Security: Open Web Application Security Project (OWASP), common web flaws, SQL injection intuition, and XSS concepts.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Web Developer', 'Security Analyst', 'QA Engineer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 19,
    estimatedTime: '8 Hours',
    learningObjectives: [
      'Understand OWASP organization mission and top risks overview',
      'Identify SQL Injection risk when user input concatenates into queries',
      'Recognize Cross-Site Scripting (XSS) when untrusted HTML renders in browsers'
    ],
    resources: [
      { id: 'owb-1', title: 'Intro to OWASP Top Web Security Risks', type: 'doc', duration: '30 min', completed: false, topic: 'OWASP' }
    ]
  },

  // --- CORE COMPUTER SCIENCE BASICS ---
  {
    id: 'dsa-fundamentals-basic',
    name: 'Data Structures Fundamentals',
    tier: 'Basic',
    level: 'Basic',
    category: 'Core Computer Science',
    icon: '🌲',
    aliases: ['Basic Data Structures', 'Linear Data Structures'],
    relatedSkills: ['Data Structures & Algorithms', 'C Programming', 'Java'],
    description: 'Foundations of computer memory layout: contiguous arrays, dynamic arrays, basic linked list nodes, stacks, queues, and Big-O notation intuition.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Software Engineer', 'C++ Developer', 'Full Stack Developer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 25,
    estimatedTime: '12 Hours',
    learningObjectives: [
      'Understand contiguous memory allocation and dynamic array resizing',
      'Model node-pointer structures for single linked lists',
      'Implement LIFO Stack and FIFO Queue data structures',
      'Calculate time and space complexity with Big-O notation'
    ],
    resources: [
      { id: 'dsf-1', title: 'Big-O Notation & Memory Layout of Arrays', type: 'doc', duration: '35 min', completed: false, topic: 'Big-O' },
      { id: 'dsf-2', title: 'Stacks, Queues & Node Chaining Sandbox', type: 'practice', duration: '40 min', completed: false, topic: 'Structures' }
    ]
  },
  {
    id: 'algo-fundamentals-basic',
    name: 'Algorithms Fundamentals',
    tier: 'Basic',
    level: 'Basic',
    category: 'Core Computer Science',
    icon: '⚡',
    aliases: ['Basic Algorithms', 'Algorithm Design Intro'],
    relatedSkills: ['Data Structures Fundamentals', 'Problem Solving'],
    description: 'Essential algorithmic procedures: linear and binary search, comparison sorts (Bubble, Insertion, Selection), recursion basics, and recursion trees.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Software Engineer', 'Systems Developer', 'Competitive Programmer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 24,
    estimatedTime: '12 Hours',
    learningObjectives: [
      'Implement Linear Search O(N) and Binary Search O(log N) on sorted data',
      'Understand step-by-step mechanics of insertion sort and selection sort',
      'Trace recursive call stacks with base cases and recursive steps'
    ],
    resources: [
      { id: 'alf-1', title: 'Binary Search & Iterative vs Recursive Strategies', type: 'doc', duration: '35 min', completed: false, topic: 'Search' }
    ]
  },
  {
    id: 'oop-basic',
    name: 'OOP',
    tier: 'Basic',
    level: 'Basic',
    category: 'Core Computer Science',
    icon: '🧩',
    aliases: ['Object-Oriented Programming', 'OOP Concepts', 'Classes & Objects'],
    relatedSkills: ['Java', 'C++', 'Python'],
    description: 'The four fundamental pillars of Object-Oriented Programming: Encapsulation, Abstraction, Inheritance, and Polymorphism across modern languages.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Software Engineer', 'Java Developer', 'Full Stack Developer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 26,
    estimatedTime: '10 Hours',
    learningObjectives: [
      'Encapsulate object state using private attributes and public getters/setters',
      'Abstract complex implementations using interfaces and abstract classes',
      'Extend base functionality via single and multi-level inheritance',
      'Demonstrate polymorphism via method overloading and overriding'
    ],
    resources: [
      { id: 'oopb-1', title: 'The Four Pillars of OOP with Practical Examples', type: 'doc', duration: '35 min', completed: false, topic: 'Pillars' }
    ]
  },
  {
    id: 'swe-basic',
    name: 'Software Engineering',
    tier: 'Basic',
    level: 'Basic',
    category: 'Core Computer Science',
    icon: '🏗️',
    aliases: ['Software Engineering Fundamentals', 'SWE Principles'],
    relatedSkills: ['SDLC', 'Software Engineering & Agile'],
    description: 'Systematic approaches to software construction: requirements elicitation, modular architecture, coupling vs cohesion, code quality, and testing levels.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Software Engineer', 'Quality Assurance Analyst', 'Product Associate'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 20,
    estimatedTime: '8 Hours',
    learningObjectives: [
      'Translate user requirements into functional and non-functional specifications',
      'Apply high cohesion and loose coupling principles in module design',
      'Differentiate unit testing, integration testing, and system acceptance tests'
    ],
    resources: [
      { id: 'sweb-1', title: 'Modular Software Design & Quality Metrics', type: 'doc', duration: '30 min', completed: false, topic: 'Modular' }
    ]
  },
  {
    id: 'sdlc-basic',
    name: 'SDLC',
    tier: 'Basic',
    level: 'Basic',
    category: 'Core Computer Science',
    icon: '🔄',
    aliases: ['Software Development Life Cycle', 'SDLC Models'],
    relatedSkills: ['Software Engineering', 'Agile Fundamentals'],
    description: 'Software development phases: Planning, Analysis, Design, Implementation, Testing, Deployment, and Maintenance across Waterfall and Agile models.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Software Project Associate', 'Scrum Master', 'Business Analyst'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 16,
    estimatedTime: '6 Hours',
    learningObjectives: [
      'Identify each phase in the standard Software Development Life Cycle',
      'Compare predictive Waterfall models with iterative adaptive models'
    ],
    resources: [
      { id: 'sdlc-1', title: 'SDLC Phases, Deliverables & Lifecycle Comparison', type: 'doc', duration: '25 min', completed: false, topic: 'Phases' }
    ]
  },
  {
    id: 'agile-basic',
    name: 'Agile Fundamentals',
    tier: 'Basic',
    level: 'Basic',
    category: 'Core Computer Science',
    icon: '🏃',
    aliases: ['Scrum', 'Agile Methodology', 'Sprint Planning'],
    relatedSkills: ['SDLC', 'Software Engineering'],
    description: 'Agile manifesto and Scrum framework: user stories, story points, 2-week sprints, daily standups, sprint reviews, and retrospectives.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Scrum Master', 'Software Developer', 'Project Coordinator'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 18,
    estimatedTime: '6 Hours',
    learningObjectives: [
      'Articulate the 4 core values and 12 principles of the Agile Manifesto',
      'Participate in Scrum ceremonies: Planning, Standup, Review, Retrospective',
      'Draft actionable User Stories with clear Acceptance Criteria'
    ],
    resources: [
      { id: 'agb-1', title: 'Scrum Roles, Artifacts & Ceremony Execution', type: 'doc', duration: '25 min', completed: false, topic: 'Scrum' }
    ]
  },
  {
    id: 'tech-docs-basic',
    name: 'Technical Documentation',
    tier: 'Basic',
    level: 'Basic',
    category: 'Core Computer Science',
    icon: '📝',
    aliases: ['Technical Writing', 'Markdown Documentation', 'API Docs'],
    relatedSkills: ['Software Engineering', 'Git & GitHub'],
    description: 'Communicating engineering designs: writing Markdown READMEs, docstrings/JSDoc, API specifications, and architecture decision records (ADRs).',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Software Engineer', 'Technical Writer', 'Developer Advocate'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 14,
    estimatedTime: '5 Hours',
    learningObjectives: [
      'Format professional repository README files with installation and usage guides',
      'Document functions and classes using JSDoc, Python docstrings, or JavaDoc',
      'Write clear bug reproduction steps and pull request descriptions'
    ],
    resources: [
      { id: 'tdb-1', title: 'Writing Clear Developer READMEs & JSDocs', type: 'doc', duration: '25 min', completed: false, topic: 'Writing' }
    ]
  },
  {
    id: 'problem-solving-basic',
    name: 'Problem Solving',
    tier: 'Basic',
    level: 'Basic',
    category: 'Core Computer Science',
    icon: '💡',
    aliases: ['Algorithmic Thinking', 'Analytical Reasoning'],
    relatedSkills: ['Algorithms Fundamentals', 'Debugging'],
    description: 'Structured engineering reasoning: decomposing complex problems into sub-problems, edge-case identification, pseudocode, and dry-running logic.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Software Engineer', 'Systems Analyst', 'Technical Consultant'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 25,
    estimatedTime: '8 Hours',
    learningObjectives: [
      'Break ambiguous software problem prompts into discrete logical steps',
      'Identify edge cases (empty inputs, zero values, boundary limits, negative numbers)',
      'Dry-run algorithms on paper with trace tables before writing code'
    ],
    resources: [
      { id: 'psb-1', title: 'Decomposition, Trace Tables & Edge-Case Identification', type: 'doc', duration: '30 min', completed: false, topic: 'ProblemSolving' }
    ]
  },
  {
    id: 'debugging-basic',
    name: 'Debugging',
    tier: 'Basic',
    level: 'Basic',
    category: 'Core Computer Science',
    icon: '🔍',
    aliases: ['Troubleshooting', 'Root Cause Analysis', 'Error Diagnostics'],
    relatedSkills: ['Problem Solving', 'Developer Tools'],
    description: 'Isolating and fixing software defects: reading stack traces, scientific hypothesis testing, using debuggers, print logging, and fixing syntax/runtime errors.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Software Engineer', 'Support Engineer', 'QA Tester'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 22,
    estimatedTime: '6 Hours',
    learningObjectives: [
      'Interpret call stack traces to find the exact file and line number of an exception',
      'Formulate and test hypotheses to reproduce bugs reliably',
      'Step through running execution using IDE debuggers and inspect variable states'
    ],
    resources: [
      { id: 'dbg-1', title: 'Reading Stack Traces & Interactive Debugging Strategies', type: 'doc', duration: '25 min', completed: false, topic: 'Debugging' }
    ]
  }
];
