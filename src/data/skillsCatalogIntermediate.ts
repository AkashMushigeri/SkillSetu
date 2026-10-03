import type { SkillItem } from './skillsData';

export const EXPANDED_INTERMEDIATE_SKILLS: SkillItem[] = [
  // --- PROGRAMMING ---
  {
    id: 'adv-c-int',
    name: 'Advanced C',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Programming',
    icon: '⚙️',
    aliases: ['System C', 'C Memory Optimization', 'Pointers and Memory'],
    relatedSkills: ['C Programming', 'Operating Systems', 'Embedded Systems'],
    description: 'Advanced C systems engineering: custom memory allocators, pointer arithmetic, bitwise masks, function pointers, signal handling, and multi-file project architecture.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Systems Engineer', 'Firmware Engineer', 'Embedded Developer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 15,
    estimatedTime: '18 Hours',
    learningObjectives: [
      'Implement function pointer jump tables and callback architectures',
      'Optimize cache locality and structure packing with bitfields',
      'Handle POSIX system calls, file descriptors, and UNIX signals',
      'Detect memory leaks and buffer overflows using Valgrind'
    ],
    resources: [
      { id: 'ac-1', title: 'Function Pointers, Callbacks & Jump Tables', type: 'doc', duration: '35 min', completed: false, topic: 'Pointers' },
      { id: 'ac-2', title: 'Memory Leak Detection with Valgrind', type: 'practice', duration: '45 min', completed: false, topic: 'Valgrind' }
    ]
  },
  {
    id: 'adv-cpp-int',
    name: 'Advanced C++',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Programming',
    icon: '⚡',
    aliases: ['Modern C++', 'C++17', 'C++20', 'STL Mastery'],
    relatedSkills: ['C++', 'Design Patterns', 'Data Structures & Algorithms'],
    description: 'Modern C++ (C++17/20): RAII idiom, smart pointers (unique_ptr, shared_ptr), move semantics, rvalue references, template metaprogramming, and lambda captures.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['C++ Software Engineer', 'Game Engine Programmer', 'High-Frequency Trading Dev'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 18,
    estimatedTime: '20 Hours',
    learningObjectives: [
      'Master Resource Acquisition Is Initialization (RAII) and smart pointer ownership',
      'Apply move semantics and perfect forwarding with std::move and std::forward',
      'Write reusable generic template functions and class templates',
      'Utilize C++20 concepts and range algorithms for clean data transformations'
    ],
    resources: [
      { id: 'acpp-1', title: 'Smart Pointers & RAII Memory Ownership', type: 'doc', duration: '40 min', completed: false, topic: 'RAII' },
      { id: 'acpp-2', title: 'Move Semantics, Rvalues & Perfect Forwarding', type: 'video', duration: '45 min', completed: false, topic: 'Move' }
    ]
  },
  {
    id: 'js-es6-int',
    name: 'JavaScript ES6+',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Programming',
    icon: '🟨',
    aliases: ['Modern JavaScript', 'ESNext', 'Async JavaScript'],
    relatedSkills: ['JavaScript', 'TypeScript', 'React.js', 'Node.js'],
    description: 'Modern ECMAScript features: closures, lexical scoping, prototypal inheritance, generators, async/await, Proxy objects, and module bundler integration.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Frontend Engineer', 'Full Stack Developer', 'JavaScript Specialist'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 25,
    estimatedTime: '15 Hours',
    learningObjectives: [
      'Master JavaScript execution context, call stack, microtask vs macrotask queues',
      'Leverage closures for data privacy and function currying patterns',
      'Handle complex asynchronous data streams with async/await and Promise.allSettled',
      'Use modern ES2020-ES2024 features: optional chaining, nullish coalescing, structuredClone'
    ],
    resources: [
      { id: 'jes-1', title: 'Event Loop, Microtasks & Async Execution', type: 'doc', duration: '35 min', completed: false, topic: 'EventLoop' },
      { id: 'jes-2', title: 'Closures, Currying & Functional Patterns', type: 'practice', duration: '40 min', completed: false, topic: 'Closures' }
    ]
  },
  {
    id: 'ts-int',
    name: 'TypeScript',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Programming',
    icon: '📘',
    aliases: ['TypeScript Pro', 'TS Generics', 'Advanced TypeScript'],
    relatedSkills: ['JavaScript ES6+', 'React.js', 'Next.js'],
    description: 'Applied TypeScript: generics, conditional types, mapped types, keyof/typeof operators, discriminating unions, utility types (Partial, Pick, Omit), and decorators.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['TypeScript Developer', 'Senior Frontend Engineer', 'Full Stack Developer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 24,
    estimatedTime: '16 Hours',
    learningObjectives: [
      'Write type-safe generic functions and classes with generic constraints',
      'Construct conditional types (T extends U ? X : Y) and infer return types',
      'Use built-in utility types: Record, Pick, Omit, Partial, Required, Readonly',
      'Implement discriminating unions for robust Redux-style action state machines'
    ],
    resources: [
      { id: 'tsi-1', title: 'Generics & Type Constraints in TypeScript', type: 'doc', duration: '35 min', completed: false, topic: 'Generics' },
      { id: 'tsi-2', title: 'Conditional & Mapped Types Deep Dive', type: 'video', duration: '45 min', completed: false, topic: 'AdvancedTypes' }
    ]
  },
  {
    id: 'fp-int',
    name: 'Functional Programming',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Programming',
    icon: 'λ',
    aliases: ['Pure Functions', 'Immutability', 'Declarative Programming'],
    relatedSkills: ['JavaScript ES6+', 'TypeScript', 'Design Patterns'],
    description: 'Declarative paradigm: pure functions, side-effect elimination, immutability, higher-order functions (map, filter, reduce), currying, and function composition.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Software Engineer', 'Frontend Architect', 'Backend Developer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 16,
    estimatedTime: '12 Hours',
    learningObjectives: [
      'Design pure deterministic functions without side effects',
      'Enforce deep object immutability using Object.freeze and persistent data structures',
      'Compose reusable data transformation pipelines using pipe and compose operators'
    ],
    resources: [
      { id: 'fp-1', title: 'Pure Functions & Immutability Patterns', type: 'doc', duration: '30 min', completed: false, topic: 'Pure' }
    ]
  },
  {
    id: 'multithreading-int',
    name: 'Multithreading',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Programming',
    icon: '🧵',
    aliases: ['Thread Safety', 'Thread Pools', 'Concurrent Execution'],
    relatedSkills: ['Concurrency', 'Operating Systems', 'Java Programming'],
    description: 'Concurrent CPU execution: thread creation, race conditions, synchronization locks (mutex, synchronized), deadlocks, thread pools, and worker threads.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Backend Engineer', 'Systems Programmer', 'Java Developer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 19,
    estimatedTime: '16 Hours',
    learningObjectives: [
      'Understand OS thread scheduling, context switching, and shared memory models',
      'Prevent data races using mutexes, read-write locks, and atomic operations',
      'Diagnose and resolve deadlock conditions with resource ordering strategies',
      'Manage thread lifecycles using thread pools (ExecutorService in Java)'
    ],
    resources: [
      { id: 'mt-1', title: 'Race Conditions, Mutex Locks & Thread Synchronization', type: 'doc', duration: '35 min', completed: false, topic: 'Locks' },
      { id: 'mt-2', title: 'Deadlock Prevention & Thread Pool Architecture', type: 'video', duration: '40 min', completed: false, topic: 'Deadlocks' }
    ]
  },
  {
    id: 'concurrency-int',
    name: 'Concurrency',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Programming',
    icon: '🔀',
    aliases: ['Async Concurrency', 'Event-Driven Concurrency', 'Non-blocking IO'],
    relatedSkills: ['Multithreading', 'Node.js', 'Go'],
    description: 'Concurrent programming models: async/await, non-blocking event loops, channels, CSP (Communicating Sequential Processes in Go), and futures/promises.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Backend Developer', 'Distributed Systems Engineer', 'Go Developer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 20,
    estimatedTime: '14 Hours',
    learningObjectives: [
      'Contrast thread-based concurrency with event-loop non-blocking models',
      'Implement CSP channel communication and select statements (Go/Rust)',
      'Manage concurrent asynchronous tasks with timeouts and cancellations'
    ],
    resources: [
      { id: 'cc-1', title: 'Concurrency Models: Threads vs Event Loops vs CSP', type: 'doc', duration: '35 min', completed: false, topic: 'Models' }
    ]
  },
  {
    id: 'exception-handling-int',
    name: 'Exception Handling',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Programming',
    icon: '⚠️',
    aliases: ['Robust Error Handling', 'Custom Exceptions', 'Defensive Programming'],
    relatedSkills: ['Software Engineering', 'Java Programming', 'Python Programming'],
    description: 'Defensive error architecture: checked vs unchecked exceptions, custom domain exceptions, error wrapping, finally cleanup, and global error boundaries.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Software Engineer', 'Backend Developer', 'Enterprise Developer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 18,
    estimatedTime: '8 Hours',
    learningObjectives: [
      'Design clean exception hierarchies aligned with domain business logic',
      'Preserve root cause traces using exception wrapping and chaining',
      'Implement centralized global error middleware in web services'
    ],
    resources: [
      { id: 'eh-1', title: 'Exception Hierarchies & Graceful Recovery Strategies', type: 'doc', duration: '30 min', completed: false, topic: 'Exceptions' }
    ]
  },
  {
    id: 'design-patterns-int',
    name: 'Design Patterns',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Programming',
    icon: '📐',
    aliases: ['GoF Patterns', 'Software Design Patterns', 'OOP Patterns'],
    relatedSkills: ['Object-Oriented Programming', 'Software Architecture'],
    description: 'Classic Gang of Four (GoF) design patterns: Creational (Singleton, Factory, Builder), Structural (Adapter, Decorator), and Behavioral (Observer, Strategy).',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Software Engineer', 'Software Architect', 'Senior Developer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 23,
    estimatedTime: '16 Hours',
    learningObjectives: [
      'Apply Factory Method and Builder patterns for flexible object construction',
      'Decouple component communication using the Observer pattern',
      'Swap algorithms dynamically at runtime using the Strategy pattern',
      'Wrap legacy third-party interfaces using the Adapter pattern'
    ],
    resources: [
      { id: 'dp-1', title: 'Creational & Structural Patterns in Practice', type: 'doc', duration: '40 min', completed: false, topic: 'Patterns' },
      { id: 'dp-2', title: 'Behavioral Patterns: Observer & Strategy Sandbox', type: 'practice', duration: '45 min', completed: false, topic: 'Behavioral' }
    ]
  },

  // --- DSA INTERMEDIATE ---
  {
    id: 'algorithms-int',
    name: 'Algorithms',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Data Structures & Algorithms',
    icon: '⚡',
    aliases: ['Algorithm Design', 'Asymptotic Complexity', 'Algorithm Analysis'],
    relatedSkills: ['Data Structures', 'Competitive Programming'],
    description: 'Algorithmic design techniques: divide and conquer, greedy heuristics, dynamic programming, graph traversals, and amortized complexity analysis.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Software Engineer', 'Algorithmic Developer', 'SDE Intern'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 28,
    estimatedTime: '24 Hours',
    learningObjectives: [
      'Solve recurrence relations using Master Theorem and substitution',
      'Select between Greedy and Dynamic Programming paradigms based on optimal substructure',
      'Analyze amortized operational costs using accounting and potential methods'
    ],
    resources: [
      { id: 'alg-1', title: 'Master Theorem & Recurrence Relations', type: 'doc', duration: '35 min', completed: false, topic: 'Complexity' }
    ]
  },
  {
    id: 'arrays-int',
    name: 'Arrays',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Data Structures & Algorithms',
    icon: '📊',
    aliases: ['Array Algorithms', 'Two Pointers', 'Sliding Window'],
    relatedSkills: ['Data Structures', 'Searching Algorithms'],
    description: 'Advanced array problem solving: two-pointer techniques, sliding window patterns, prefix sums, Kadane algorithm, and Dutch national flag partitioning.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Software Engineer', 'Competitive Programmer', 'SDE'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 26,
    estimatedTime: '14 Hours',
    learningObjectives: [
      'Solve subarray sum problems in O(N) using Prefix Sum hash maps',
      'Find optimal contiguous subarrays with Kadane algorithm',
      'Apply fixed and variable length sliding window patterns to string/array problems'
    ],
    resources: [
      { id: 'arr-1', title: 'Two Pointers & Sliding Window Patterns', type: 'doc', duration: '35 min', completed: false, topic: 'Pointers' },
      { id: 'arr-2', title: 'Prefix Sums & Kadane Algorithm Practice', type: 'practice', duration: '45 min', completed: false, topic: 'Practice' }
    ]
  },
  {
    id: 'linked-lists-int',
    name: 'Linked Lists',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Data Structures & Algorithms',
    icon: '🔗',
    aliases: ['Linked List Algorithms', 'Doubly Linked List', 'Cycle Detection'],
    relatedSkills: ['Data Structures', 'Pointers'],
    description: 'Pointer-based dynamic list algorithms: reversing lists iteratively/recursively, Floyd cycle detection (tortoise & hare), merging sorted lists, and LRU cache doubly linked lists.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Software Engineer', 'Backend Developer', 'SDE Intern'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 22,
    estimatedTime: '12 Hours',
    learningObjectives: [
      'Reverse singly and doubly linked lists without auxiliary memory',
      'Detect and locate cycle entry points with Floyd cycle detection',
      'Implement a Least Recently Used (LRU) Cache combining Doubly Linked Lists & Hash Maps'
    ],
    resources: [
      { id: 'll-1', title: 'Floyd Cycle Detection & In-Place Reversal', type: 'doc', duration: '30 min', completed: false, topic: 'Cycles' }
    ]
  },
  {
    id: 'stacks-int',
    name: 'Stacks',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Data Structures & Algorithms',
    icon: '🥞',
    aliases: ['Stack Algorithms', 'Monotonic Stack', 'Parentheses Matching'],
    relatedSkills: ['Queues', 'Data Structures'],
    description: 'LIFO data structure applications: balanced parenthesis evaluation, monotonic stacks for Next Greater Element, histogram maximum area, and infix-to-postfix conversion.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Software Engineer', 'Compiler Developer', 'SDE'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 20,
    estimatedTime: '12 Hours',
    learningObjectives: [
      'Solve Next Greater Element queries in O(N) using Monotonic Stacks',
      'Calculate Largest Rectangle in Histogram using stack intervals',
      'Evaluate arithmetic expressions with operator precedence parsing'
    ],
    resources: [
      { id: 'stk-1', title: 'Monotonic Stacks & Next Greater Element', type: 'doc', duration: '35 min', completed: false, topic: 'Monotonic' }
    ]
  },
  {
    id: 'queues-int',
    name: 'Queues',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Data Structures & Algorithms',
    icon: '🚶',
    aliases: ['Queue Algorithms', 'Priority Queue', 'Deque', 'Circular Queue'],
    relatedSkills: ['Stacks', 'Data Structures', 'Graphs'],
    description: 'FIFO data structures: circular arrays, double-ended queues (deque), priority queues (binary heaps), sliding window maximums, and breadth-first search queues.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Software Engineer', 'Systems Programmer', 'SDE'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 19,
    estimatedTime: '11 Hours',
    learningObjectives: [
      'Implement Circular Queue without memory waste using modulo indexing',
      'Find sliding window maximums in O(N) using a Monotonic Deque',
      'Use Priority Queues for Top-K frequent elements problems'
    ],
    resources: [
      { id: 'que-1', title: 'Monotonic Deque & Priority Queue Applications', type: 'doc', duration: '30 min', completed: false, topic: 'Queues' }
    ]
  },
  {
    id: 'trees-int',
    name: 'Trees',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Data Structures & Algorithms',
    icon: '🌳',
    aliases: ['Binary Trees', 'Binary Search Tree', 'Tree Traversals', 'AVL Trees'],
    relatedSkills: ['Data Structures', 'Recursion'],
    description: 'Hierarchical data structures: Binary Trees, BST validation, DFS traversals (Pre, In, Post-order), BFS level-order traversal, Lowest Common Ancestor (LCA), and balance concepts.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Software Engineer', 'Database Developer', 'SDE'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 26,
    estimatedTime: '16 Hours',
    learningObjectives: [
      'Implement iterative and recursive DFS & BFS level-order traversals',
      'Validate Binary Search Tree properties within valid value ranges',
      'Calculate tree diameter and find Lowest Common Ancestor (LCA)',
      'Understand balance mechanisms in self-balancing AVL and Red-Black trees'
    ],
    resources: [
      { id: 'tr-1', title: 'Tree Traversals & BST Invariant Validation', type: 'doc', duration: '35 min', completed: false, topic: 'Traversals' },
      { id: 'tr-2', title: 'LCA & Subtree Diameter Practice Sandbox', type: 'practice', duration: '45 min', completed: false, topic: 'Problems' }
    ]
  },
  {
    id: 'graphs-int',
    name: 'Graphs',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Data Structures & Algorithms',
    icon: '🕸️',
    aliases: ['Graph Algorithms', 'BFS and DFS', 'Dijkstra', 'Topological Sort'],
    relatedSkills: ['Data Structures', 'Algorithms'],
    description: 'Network graph models: adjacency list/matrix, Breadth-First Search (BFS), Depth-First Search (DFS), cycle detection, Topological Sort (Kahn algorithm), and Dijkstra shortest path.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Software Engineer', 'Network Analyst', 'SDE Intern'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 25,
    estimatedTime: '18 Hours',
    learningObjectives: [
      'Represent directed/undirected graphs using adjacency lists and hash maps',
      'Detect cycles in directed and undirected graphs using DFS back-edges',
      'Perform Topological Sort for dependency resolution using Kahn algorithm',
      'Compute single-source shortest paths on weighted graphs with Dijkstra algorithm'
    ],
    resources: [
      { id: 'gr-1', title: 'Graph Traversal (BFS/DFS) & Cycle Detection', type: 'doc', duration: '40 min', completed: false, topic: 'Traversals' },
      { id: 'gr-2', title: 'Topological Sort & Dijkstra Implementation', type: 'practice', duration: '50 min', completed: false, topic: 'Dijkstra' }
    ]
  },
  {
    id: 'hashing-int',
    name: 'Hashing',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Data Structures & Algorithms',
    icon: '🔑',
    aliases: ['Hash Maps', 'Hash Tables', 'Collision Resolution'],
    relatedSkills: ['Data Structures', 'Arrays'],
    description: 'Associative memory: hash functions, collision resolution (chaining vs open addressing), load factor resizing, HashSet/HashMap lookups, and counting frequencies.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Software Engineer', 'Backend Developer', 'SDE'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 24,
    estimatedTime: '10 Hours',
    learningObjectives: [
      'Explain collision resolution strategies: chaining vs linear probing',
      'Optimize average O(1) lookup times with proper initial capacity and load factors',
      'Solve anagram, subarray sum, and grouping problems using HashMaps'
    ],
    resources: [
      { id: 'hsh-1', title: 'Hash Functions, Collisions & Load Factor Resizing', type: 'doc', duration: '30 min', completed: false, topic: 'Hashing' }
    ]
  },
  {
    id: 'recursion-int',
    name: 'Recursion',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Data Structures & Algorithms',
    icon: '🔁',
    aliases: ['Backtracking', 'Recursive Problem Solving', 'Subsets and Permutations'],
    relatedSkills: ['Dynamic Programming', 'Trees'],
    description: 'Divide-and-conquer & backtracking: state space trees, base cases, subset generation, permutations, N-Queens problem, and Sudoku solver algorithms.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Software Engineer', 'Algorithmic Developer', 'SDE'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 22,
    estimatedTime: '14 Hours',
    learningObjectives: [
      'Trace call stack frames and identify non-terminating stack overflows',
      'Generate all combinations and permutations with backtracking choose-explore-unchoose',
      'Prune dead-end search spaces in constraint satisfaction problems (N-Queens)'
    ],
    resources: [
      { id: 'rec-1', title: 'Backtracking Framework: Choose, Explore, Unchoose', type: 'doc', duration: '35 min', completed: false, topic: 'Backtracking' }
    ]
  },
  {
    id: 'dp-int',
    name: 'Dynamic Programming',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Data Structures & Algorithms',
    icon: '🧠',
    aliases: ['DP', 'Memoization', 'Tabulation', 'Optimal Substructure'],
    relatedSkills: ['Algorithms', 'Recursion'],
    description: 'Optimal substructure & overlapping subproblems: top-down memoization, bottom-up tabulation, 1D DP (Fibonacci, Climbing Stairs), 2D DP (0/1 Knapsack, LCS, Edit Distance).',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Software Engineer', 'Competitive Programmer', 'SDE'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 26,
    estimatedTime: '22 Hours',
    learningObjectives: [
      'Identify whether a problem has optimal substructure and overlapping subproblems',
      'Transform brute-force recursive solutions into top-down memoized DP',
      'Formulate bottom-up state transitions (dp[i][j]) with base cases',
      'Solve classic paradigms: 0/1 Knapsack, Longest Common Subsequence, Coin Change'
    ],
    resources: [
      { id: 'dp-1', title: 'Top-Down Memoization vs Bottom-Up Tabulation', type: 'doc', duration: '40 min', completed: false, topic: 'DP' },
      { id: 'dp-2', title: 'Knapsack & Longest Common Subsequence Sandbox', type: 'practice', duration: '50 min', completed: false, topic: 'Knapsack' }
    ]
  },
  {
    id: 'greedy-int',
    name: 'Greedy Algorithms',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Data Structures & Algorithms',
    icon: '🪙',
    aliases: ['Greedy Choice Property', 'Interval Scheduling', 'Huffman Coding'],
    relatedSkills: ['Algorithms', 'Sorting Algorithms'],
    description: 'Locally optimal choice strategies: proving the greedy choice property, interval scheduling, fractional knapsack, Huffman coding trees, and minimum spanning trees (Kruskal/Prim).',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Software Engineer', 'Systems Developer', 'SDE'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 20,
    estimatedTime: '12 Hours',
    learningObjectives: [
      'Prove greedy choice property and differentiate from dynamic programming',
      'Sort intervals by end-time for optimal activity selection',
      'Construct Huffman coding trees for lossless data compression'
    ],
    resources: [
      { id: 'grd-1', title: 'Greedy Choice Property & Interval Scheduling', type: 'doc', duration: '30 min', completed: false, topic: 'Greedy' }
    ]
  },
  {
    id: 'sorting-int',
    name: 'Sorting Algorithms',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Data Structures & Algorithms',
    icon: '📶',
    aliases: ['QuickSort', 'MergeSort', 'HeapSort', 'Comparison Sorting'],
    relatedSkills: ['Algorithms', 'Searching Algorithms'],
    description: 'Comparison and non-comparison sorting: MergeSort O(N log N), QuickSort partitioning, HeapSort, stability, in-place behavior, and Counting/Radix Sort for linear bounds.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Software Engineer', 'Core Developer', 'SDE'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 22,
    estimatedTime: '12 Hours',
    learningObjectives: [
      'Implement stable divide-and-conquer MergeSort with auxiliary array merging',
      'Master Lomuto and Hoare QuickSort partitioning algorithms and pivot choices',
      'Understand sorting stability and non-comparison linear sorts (Counting Sort)'
    ],
    resources: [
      { id: 'srt-1', title: 'MergeSort vs QuickSort Partitioning & Stability', type: 'doc', duration: '35 min', completed: false, topic: 'Sorting' }
    ]
  },
  {
    id: 'searching-int',
    name: 'Searching Algorithms',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Data Structures & Algorithms',
    icon: '🔍',
    aliases: ['Binary Search on Answer', 'Rotated Array Search', 'Ternary Search'],
    relatedSkills: ['Algorithms', 'Arrays'],
    description: 'Advanced search techniques: Binary Search on Monotonic Functions (Binary Search on Answer), searching in rotated sorted arrays, lower_bound / upper_bound, and peak element finding.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Software Engineer', 'Algorithmic Developer', 'SDE'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 20,
    estimatedTime: '10 Hours',
    learningObjectives: [
      'Master binary search invariant conditions (while left <= right vs left < right)',
      'Find first and last occurrences using lower_bound and upper_bound logic',
      'Apply binary search on the answer space for optimization problems'
    ],
    resources: [
      { id: 'sch-1', title: 'Binary Search on Answer & Invariant Boundary Rules', type: 'doc', duration: '30 min', completed: false, topic: 'BinarySearch' }
    ]
  },
  {
    id: 'cp-int',
    name: 'Competitive Programming',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Data Structures & Algorithms',
    icon: '🏆',
    aliases: ['LeetCode', 'Codeforces', 'Speed Problem Solving', 'DSA Challenges'],
    relatedSkills: ['Data Structures & Algorithms', 'C++', 'Java'],
    description: 'Timed contest problem solving: fast I/O, bitwise arithmetic tricks, math fundamentals (modulo arithmetic, sieve of Eratosthenes), coordinate compression, and contest testing.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Software Engineer', 'Competitive Programmer', 'Quantitative Developer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 25,
    estimatedTime: '20 Hours',
    learningObjectives: [
      'Write ultra-fast I/O routines to avoid Time Limit Exceeded (TLE) errors',
      'Apply modular arithmetic rules for large calculation constraints (10^9 + 7)',
      'Generate prime numbers up to 10^7 swiftly with Sieve of Eratosthenes',
      'Use bitmasking to represent sets and subsets in binary operations'
    ],
    resources: [
      { id: 'cp-1', title: 'Modular Arithmetic & Prime Sieve Algorithms', type: 'doc', duration: '35 min', completed: false, topic: 'Math' }
    ]
  },

  // --- WEB DEVELOPMENT INTERMEDIATE ---
  {
    id: 'nextjs-int',
    name: 'Next.js',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Web Development',
    icon: '▲',
    aliases: ['NextJS', 'Next.js 14', 'App Router', 'React Server Components'],
    relatedSkills: ['React.js', 'TypeScript', 'Full Stack Development'],
    description: 'Full-stack React framework: App Router architecture, React Server Components (RSC), Server Actions, dynamic routing, SEO optimization, and API route handlers.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Full Stack Developer', 'Frontend Engineer', 'Next.js Developer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 26,
    estimatedTime: '16 Hours',
    learningObjectives: [
      'Differentiate Server Components (zero bundle size) from Client Components',
      'Build file-based routes using layout.tsx, page.tsx, and loading.tsx',
      'Mutate database state securely using Server Actions without API boilerplate',
      'Optimize image delivery, open graph tags, and metadata for search engines'
    ],
    resources: [
      { id: 'nxt-1', title: 'Next.js App Router & React Server Components', type: 'doc', duration: '35 min', completed: false, topic: 'AppRouter' },
      { id: 'nxt-2', title: 'Server Actions & Database Mutations Sandbox', type: 'practice', duration: '45 min', completed: false, topic: 'Actions' }
    ]
  },
  {
    id: 'express-int',
    name: 'Express.js',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Web Development',
    icon: '🚂',
    aliases: ['Express', 'Express Framework', 'Node Express'],
    relatedSkills: ['Node.js', 'REST API Development', 'Backend Development'],
    description: 'Fast, minimalist Node.js web framework: routing middleware pipeline, request parsing, error-handling middleware, CORS, and serving RESTful JSON endpoints.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Backend Developer', 'Node.js Engineer', 'Full Stack Developer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 24,
    estimatedTime: '12 Hours',
    learningObjectives: [
      'Design modular Express routers using express.Router()',
      'Write custom middleware functions with req, res, next signatures',
      'Implement central error-handling middleware (err, req, res, next)',
      'Configure CORS, security headers (helmet), and body parser limits'
    ],
    resources: [
      { id: 'exp-1', title: 'Express Middleware Lifecycle & Modular Routing', type: 'doc', duration: '30 min', completed: false, topic: 'Middleware' }
    ]
  },
  {
    id: 'api-integration-int',
    name: 'API Integration',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Web Development',
    icon: '🔗',
    aliases: ['Third Party APIs', 'Webhook Integration', 'Axios'],
    relatedSkills: ['REST API Development', 'Web Development'],
    description: 'Consuming and orchestrating external web services: axios/fetch patterns, webhook receivers, retry logic with exponential backoff, rate limiting, and OAuth token exchanges.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Integration Engineer', 'Backend Developer', 'Full Stack Developer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 20,
    estimatedTime: '10 Hours',
    learningObjectives: [
      'Call third-party REST and GraphQL APIs with robust error interception',
      'Verify incoming cryptographic webhook signatures (HMAC SHA256)',
      'Implement transient error retries using exponential backoff with jitter'
    ],
    resources: [
      { id: 'api-1', title: 'Webhook Verification & Robust Retry Mechanisms', type: 'doc', duration: '30 min', completed: false, topic: 'Webhooks' }
    ]
  },
  {
    id: 'auth-int',
    name: 'Authentication',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Web Development',
    icon: '🛡️',
    aliases: ['Auth Systems', 'OAuth2', 'Session Authentication', 'NextAuth'],
    relatedSkills: ['JWT', 'Web Security', 'Backend Development'],
    description: 'Production identity architectures: stateful session cookies (express-session), OAuth2 authorization code flows (Google/GitHub login), and CSRF token protections.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Security Engineer', 'Backend Developer', 'Full Stack Developer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 22,
    estimatedTime: '12 Hours',
    learningObjectives: [
      'Implement OAuth2 Authorization Code Grant with PKCE protection',
      'Configure secure HttpOnly, SameSite, and Secure session cookie flags',
      'Mitigate Cross-Site Request Forgery (CSRF) via double-submit cookies'
    ],
    resources: [
      { id: 'aut-1', title: 'OAuth2 Authorization Code Flows & PKCE', type: 'doc', duration: '35 min', completed: false, topic: 'OAuth2' }
    ]
  },
  {
    id: 'jwt-int',
    name: 'JWT',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Web Development',
    icon: '🎫',
    aliases: ['JSON Web Tokens', 'Bearer Tokens', 'Stateless Auth'],
    relatedSkills: ['Authentication', 'Backend Development', 'REST API Development'],
    description: 'Stateless token-based authentication: token structure (Header, Payload, Signature), HMAC SHA256 signing, expiration claims (exp), and refresh token rotation schemes.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Backend Developer', 'API Engineer', 'Full Stack Developer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 24,
    estimatedTime: '10 Hours',
    learningObjectives: [
      'Generate and cryptographically sign JWTs using jsonwebtoken and secret keys',
      'Validate token signatures, expiration claims, and reject tampered payloads',
      'Implement silent token refresh with short-lived access and long-lived refresh tokens'
    ],
    resources: [
      { id: 'jwt-1', title: 'JWT Signing, Verification & Refresh Token Rotation', type: 'doc', duration: '30 min', completed: false, topic: 'JWT' }
    ]
  },
  {
    id: 'websockets-int',
    name: 'WebSockets',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Web Development',
    icon: '⚡',
    aliases: ['Socket.io', 'Real-Time Communication', 'Bi-directional WebSockets'],
    relatedSkills: ['Node.js', 'Frontend Development', 'Web Development'],
    description: 'Full-duplex real-time communication: WebSocket protocol handshake (ws://, wss://), event broadcasting with Socket.io, rooms, presence tracking, and reconnect logic.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Real-Time Systems Developer', 'Full Stack Engineer', 'Frontend Developer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 18,
    estimatedTime: '12 Hours',
    learningObjectives: [
      'Upgrade standard HTTP connections to full-duplex persistent WebSockets',
      'Emit, broadcast, and listen to custom events with Socket.io',
      'Partition user communication using Socket.io rooms and namespaces',
      'Handle client disconnects, reconnect polling, and message buffering'
    ],
    resources: [
      { id: 'ws-1', title: 'WebSocket Protocol Handshake & Socket.io Architecture', type: 'doc', duration: '35 min', completed: false, topic: 'WebSockets' }
    ]
  },
  {
    id: 'frontend-dev-int',
    name: 'Frontend Development',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Web Development',
    icon: '🖥️',
    aliases: ['Frontend Engineering', 'Client-Side Architecture', 'UI Engineering'],
    relatedSkills: ['React.js', 'CSS', 'JavaScript ES6+', 'HTML'],
    description: 'Comprehensive client-side engineering: component hierarchy, client caching (TanStack React Query), accessibility (ARIA/WCAG), Core Web Vitals, and responsive UI.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Frontend Engineer', 'UI Developer', 'React Developer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 28,
    estimatedTime: '16 Hours',
    learningObjectives: [
      'Manage asynchronous server state using React Query with automatic cache invalidation',
      'Optimize Core Web Vitals metrics: Largest Contentful Paint (LCP) & Cumulative Layout Shift (CLS)',
      'Ensure WCAG 2.1 AA accessibility compliance across interactive components'
    ],
    resources: [
      { id: 'fe-1', title: 'Server State Caching with React Query', type: 'doc', duration: '35 min', completed: false, topic: 'ReactQuery' }
    ]
  },
  {
    id: 'backend-dev-int',
    name: 'Backend Development',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Web Development',
    icon: '⚙️',
    aliases: ['Backend Engineering', 'Server Architecture', 'API Engineering'],
    relatedSkills: ['Node.js', 'PostgreSQL', 'REST API Development', 'Express.js'],
    description: 'Server engineering: multi-layered architecture (Controllers, Services, Repositories), database transactions, connection pooling, rate limiting, and environment configs.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Backend Engineer', 'API Developer', 'Server Engineer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 26,
    estimatedTime: '18 Hours',
    learningObjectives: [
      'Structure clean 3-tier backends: Controller -> Service -> Repository layer',
      'Configure connection pools to prevent database exhaustion under load',
      'Apply rate-limiting middleware to protect APIs against brute-force attacks'
    ],
    resources: [
      { id: 'be-1', title: 'Layered Backend Architecture: Controllers & Services', type: 'doc', duration: '35 min', completed: false, topic: 'Layers' }
    ]
  },
  {
    id: 'fullstack-dev-int',
    name: 'Full Stack Development',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Web Development',
    icon: '🥞',
    aliases: ['Full Stack Engineering', 'MERN Stack', 'End-to-End Development'],
    relatedSkills: ['Frontend Development', 'Backend Development', 'React.js', 'Node.js'],
    description: 'End-to-end web construction: connecting client UI with relational or document databases through REST/GraphQL APIs, secure authentication, and cloud deployment.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Full Stack Developer', 'Software Engineer', 'Startup Engineer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 30,
    estimatedTime: '22 Hours',
    learningObjectives: [
      'Build end-to-end full stack web applications connecting UI to persistent DBs',
      'Deploy full-stack applications with separate client/server tiers or unified Next.js',
      'Implement shared TypeScript models between frontend and backend codebases'
    ],
    resources: [
      { id: 'fs-1', title: 'Full Stack Architecture & Monorepo Organization', type: 'doc', duration: '35 min', completed: false, topic: 'FullStack' }
    ]
  },

  // --- DATABASES INTERMEDIATE ---
  {
    id: 'adv-sql-int',
    name: 'Advanced SQL',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Databases',
    icon: '🗄️',
    aliases: ['SQL Window Functions', 'CTEs', 'Complex SQL Queries'],
    relatedSkills: ['SQL', 'PostgreSQL', 'Query Optimization'],
    description: 'Advanced relational querying: Common Table Expressions (WITH / CTEs), recursive CTEs, window functions (ROW_NUMBER, RANK, DENSE_RANK, LEAD, LAG), and pivot tables.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Data Analyst', 'Database Developer', 'Data Engineer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 22,
    estimatedTime: '14 Hours',
    learningObjectives: [
      'Calculate moving averages and running totals with OVER (PARTITION BY ... ORDER BY)',
      'Rank dataset rows using ROW_NUMBER, RANK, and DENSE_RANK without ties',
      'Traverse hierarchical tree/graph records using RECURSIVE Common Table Expressions'
    ],
    resources: [
      { id: 'asq-1', title: 'Window Functions: PARTITION BY, LEAD & LAG', type: 'doc', duration: '35 min', completed: false, topic: 'Window' }
    ]
  },
  {
    id: 'postgres-int',
    name: 'PostgreSQL',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Databases',
    icon: '🐘',
    aliases: ['Postgres Advanced', 'Production PostgreSQL'],
    relatedSkills: ['Databases', 'SQL', 'Query Optimization'],
    description: 'Production PostgreSQL: stored procedures, triggers, custom types, full-text search (tsvector), GIN/GiST indexes, connection pooling (PgBouncer), and vacuuming.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['PostgreSQL DBA', 'Backend Engineer', 'Data Platform Engineer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 24,
    estimatedTime: '15 Hours',
    learningObjectives: [
      'Write PL/pgSQL stored functions and automated audit logging triggers',
      'Implement ranked natural language search with tsvector and tsquery',
      'Understand PostgreSQL multi-version concurrency control (MVCC) and VACUUM'
    ],
    resources: [
      { id: 'pgi-1', title: 'PL/pgSQL Functions, Triggers & Full-Text Search', type: 'doc', duration: '35 min', completed: false, topic: 'PLpgSQL' }
    ]
  },
  {
    id: 'redis-int',
    name: 'Redis',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Databases',
    icon: '🔴',
    aliases: ['In-Memory Cache', 'Key-Value Store', 'Redis Caching'],
    relatedSkills: ['Databases', 'Backend Development', 'System Design'],
    description: 'In-memory data structure store: caching patterns (Cache-Aside, Write-Through), data types (Strings, Hashes, Lists, Sets, Sorted Sets), TTL expiration, and Pub/Sub.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Backend Engineer', 'High Performance Systems Dev', 'Site Reliability Engineer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 22,
    estimatedTime: '12 Hours',
    learningObjectives: [
      'Implement Cache-Aside caching patterns with Time-To-Live (TTL) expiration',
      'Build real-time leaderboards using Redis Sorted Sets (ZADD, ZRANGEBYSCORE)',
      'Distribute async notifications using lightweight Redis Pub/Sub channels'
    ],
    resources: [
      { id: 'red-1', title: 'Redis Data Structures & Cache-Aside Architecture', type: 'doc', duration: '35 min', completed: false, topic: 'Caching' }
    ]
  },
  {
    id: 'db-design-int',
    name: 'Database Design',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Databases',
    icon: '📐',
    aliases: ['Relational Schema Design', 'Data Modeling'],
    relatedSkills: ['Databases', 'SQL', 'Database Normalization'],
    description: 'Relational schema architecture: translating domain entities into normalized tables, surrogate vs natural keys, foreign key cascading strategies, and handling history.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Database Architect', 'Backend Developer', 'Systems Analyst'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 20,
    estimatedTime: '12 Hours',
    learningObjectives: [
      'Design clean schemas that prevent data anomalies (insertion, update, deletion)',
      'Choose between CASCADE, SET NULL, and RESTRICT on foreign key deletions',
      'Model temporal and audit trail data (slowly changing dimensions)'
    ],
    resources: [
      { id: 'dbd-1', title: 'Schema Modeling & Referential Integrity Rules', type: 'doc', duration: '30 min', completed: false, topic: 'Design' }
    ]
  },
  {
    id: 'query-opt-int',
    name: 'Query Optimization',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Databases',
    icon: '⚡',
    aliases: ['SQL Performance Tuning', 'EXPLAIN ANALYZE', 'Slow Query Tuning'],
    relatedSkills: ['Databases', 'SQL', 'Indexing'],
    description: 'SQL execution plan diagnostics: reading EXPLAIN ANALYZE trees, identifying sequential scans vs index scans, eliminating N+1 query problems, and optimizing subqueries.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Database Administrator', 'Backend Engineer', 'Performance Engineer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 22,
    estimatedTime: '14 Hours',
    learningObjectives: [
      'Analyze query execution plans to spot expensive sequential table scans',
      'Eliminate costly nested loop joins with hash or merge joins',
      'Rewrite unindexed OR clauses and subqueries into efficient UNION ALL / JOINs'
    ],
    resources: [
      { id: 'qo-1', title: 'Reading EXPLAIN ANALYZE Plans & Index Hit Diagnostics', type: 'doc', duration: '35 min', completed: false, topic: 'EXPLAIN' }
    ]
  },
  {
    id: 'transactions-int',
    name: 'Transactions',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Databases',
    icon: '💳',
    aliases: ['ACID Properties', 'Database Concurrency Control', 'Isolation Levels'],
    relatedSkills: ['Databases', 'Backend Development'],
    description: 'ACID guarantees in databases: Atomicity, Consistency, Isolation, Durability; transaction isolation levels (Read Committed, Repeatable Read, Serializable), and locks.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['FinTech Developer', 'Backend Architect', 'Database Engineer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 20,
    estimatedTime: '12 Hours',
    learningObjectives: [
      'Execute multi-step operations atomically within BEGIN ... COMMIT blocks',
      'Prevent dirty reads, non-repeatable reads, and phantom reads with isolation levels',
      'Manage pessimistic and optimistic locking strategies to avoid write skew'
    ],
    resources: [
      { id: 'trx-1', title: 'ACID Guarantees & Transaction Isolation Levels', type: 'doc', duration: '35 min', completed: false, topic: 'ACID' }
    ]
  },
  {
    id: 'indexing-int',
    name: 'Indexing',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Databases',
    icon: '📑',
    aliases: ['Database Indexes', 'B-Tree Indexes', 'Composite Indexes'],
    relatedSkills: ['Databases', 'Query Optimization'],
    description: 'Database index structures: B-Tree internal nodes and leaves, composite index column ordering rules, covering indexes (INCLUDE), and index overhead on writes.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Database Developer', 'Backend Engineer', 'Data Engineer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 21,
    estimatedTime: '12 Hours',
    learningObjectives: [
      'Understand how balanced B-Trees achieve O(log N) lookup and range scans',
      'Design composite indexes respecting left-to-right column matching rules',
      'Build covering indexes using index-only scans to bypass table heap lookups'
    ],
    resources: [
      { id: 'idx-1', title: 'B-Tree Index Internals & Composite Index Ordering', type: 'doc', duration: '30 min', completed: false, topic: 'BTree' }
    ]
  },
  {
    id: 'db-norm-int',
    name: 'Database Normalization',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Databases',
    icon: '📏',
    aliases: ['1NF 2NF 3NF BCNF', 'Relational Normalization'],
    relatedSkills: ['Database Design', 'Databases', 'SQL'],
    description: 'Systematic database normalization rules: First Normal Form (1NF atomic values), 2NF (full functional dependency), 3NF (transitive dependency removal), and BCNF.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Database Architect', 'Backend Developer', 'Systems Engineer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 18,
    estimatedTime: '10 Hours',
    learningObjectives: [
      'Decompose non-atomic repeating groups to achieve 1NF compliance',
      'Remove partial key dependencies to reach 2NF',
      'Eliminate transitive dependencies to achieve 3NF and Boyce-Codd (BCNF)'
    ],
    resources: [
      { id: 'norm-1', title: '1NF, 2NF, 3NF & BCNF Step-by-Step Decomposition', type: 'doc', duration: '35 min', completed: false, topic: 'NormalForms' }
    ]
  },

  // --- DATA SCIENCE INTERMEDIATE ---
  {
    id: 'pandas-int',
    name: 'Pandas',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Data Science',
    icon: '🐼',
    aliases: ['Python Pandas', 'DataFrame Analysis', 'Data Wrangling'],
    relatedSkills: ['Data Science', 'NumPy', 'Python'],
    description: 'Advanced data manipulation: groupby aggregations, multi-level indexing, merging/joining DataFrames, pivot tables, apply functions, and datetime series processing.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Data Analyst', 'Data Scientist', 'BI Developer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 26,
    estimatedTime: '15 Hours',
    learningObjectives: [
      'Perform complex split-apply-combine aggregations with groupby and agg()',
      'Combine multiple DataFrames using merge(how="left") and concat()',
      'Process time-series dates with pd.to_datetime, resampling, and window rollups'
    ],
    resources: [
      { id: 'pdi-1', title: 'Groupby Aggregations, Merges & Multi-Indexing', type: 'doc', duration: '35 min', completed: false, topic: 'Groupby' }
    ]
  },
  {
    id: 'numpy-int',
    name: 'NumPy',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Data Science',
    icon: '🔢',
    aliases: ['Numerical Python', 'Linear Algebra NumPy'],
    relatedSkills: ['Python', 'Data Science', 'Machine Learning'],
    description: 'Numerical computing & matrix algebra: linear algebra (np.linalg dot, inv, eig), boolean masking, structured arrays, random distributions, and FFT analysis.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Data Scientist', 'Machine Learning Engineer', 'Quantitative Analyst'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 22,
    estimatedTime: '12 Hours',
    learningObjectives: [
      'Solve linear equations using matrix multiplication (np.dot, @) and np.linalg.solve',
      'Filter large multidimensional matrices using boolean masking and np.where',
      'Sample reproducible random distributions using np.random.default_rng()'
    ],
    resources: [
      { id: 'npi-1', title: 'Matrix Algebra & Vectorized Computing in NumPy', type: 'doc', duration: '30 min', completed: false, topic: 'Matrices' }
    ]
  },
  {
    id: 'matplotlib-int',
    name: 'Matplotlib',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Data Science',
    icon: '📊',
    aliases: ['Pyplot', 'Python Plotting Library'],
    relatedSkills: ['Data Science', 'Seaborn', 'Data Visualization'],
    description: 'Programmatic plotting in Python: figure and axis object hierarchy (fig, ax = plt.subplots()), subplots grids, histograms, custom legends, and exporting vector PDFs/SVGs.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Data Analyst', 'Research Scientist', 'Data Journalist'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 18,
    estimatedTime: '10 Hours',
    learningObjectives: [
      'Master the Object-Oriented Matplotlib API (fig, ax) over simple pyplot calls',
      'Construct multi-plot dashboard grids with plt.subplots(rows, cols)',
      'Customize axes tickers, limits, annotations, and export publication figures'
    ],
    resources: [
      { id: 'mpl-1', title: 'Object-Oriented Matplotlib API & Multi-Axes Grids', type: 'doc', duration: '30 min', completed: false, topic: 'Matplotlib' }
    ]
  },
  {
    id: 'seaborn-int',
    name: 'Seaborn',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Data Science',
    icon: '🎨',
    aliases: ['Statistical Plots', 'Seaborn DataViz'],
    relatedSkills: ['Matplotlib', 'Data Science', 'Data Visualization'],
    description: 'Statistical data visualization: distribution plots (histplot, kdeplot), categorical plots (boxplot, violinplot), correlation heatmaps, and pairplot feature interactions.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Data Scientist', 'Data Analyst', 'Statistical Modeler'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 19,
    estimatedTime: '10 Hours',
    learningObjectives: [
      'Plot bivariate correlation heatmaps with annotated coefficients',
      'Inspect feature distributions and medians using boxplots and violinplots',
      'Generate multi-feature pairwise scatter matrices with sns.pairplot'
    ],
    resources: [
      { id: 'sbn-1', title: 'Correlation Heatmaps & Distribution Plots in Seaborn', type: 'doc', duration: '30 min', completed: false, topic: 'Seaborn' }
    ]
  },
  {
    id: 'eda-int',
    name: 'Exploratory Data Analysis',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Data Science',
    icon: '🔬',
    aliases: ['EDA', 'Data Profiling', 'Data Exploration'],
    relatedSkills: ['Data Science', 'Pandas', 'Seaborn'],
    description: 'Systematic dataset investigation: statistical summaries, skewness analysis, identifying multicollinearity, visualizing distributions, and generating hypothesis insights.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Data Scientist', 'Business Intelligence Analyst', 'Analytics Consultant'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 24,
    estimatedTime: '14 Hours',
    learningObjectives: [
      'Execute structured EDA workflows on messy tabular real-world datasets',
      'Assess variable distributions, kurtosis, skewness, and missingness patterns',
      'Detect multicollinearity using Variance Inflation Factors (VIF)'
    ],
    resources: [
      { id: 'eda-1', title: 'Structured Exploratory Data Analysis Playbook', type: 'doc', duration: '35 min', completed: false, topic: 'EDA' }
    ]
  },
  {
    id: 'statistical-analysis-int',
    name: 'Statistical Analysis',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Data Science',
    icon: '📉',
    aliases: ['Inferential Statistics', 'Hypothesis Testing', 'A/B Testing'],
    relatedSkills: ['Data Science', 'Machine Learning'],
    description: 'Inferential statistics: hypothesis testing (null vs alternative), p-values, t-tests (one-sample, two-sample), ANOVA, Chi-Square tests, and A/B test sample sizing.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Data Scientist', 'Quantitative Researcher', 'Product Analyst'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 22,
    estimatedTime: '15 Hours',
    learningObjectives: [
      'Formulate null and alternative hypotheses with significance alpha thresholds',
      'Execute Student t-tests and ANOVA to compare group means',
      'Evaluate categorical contingency tables using Chi-Square tests of independence'
    ],
    resources: [
      { id: 'sta-1', title: 'Hypothesis Testing, P-Values & Two-Sample T-Tests', type: 'doc', duration: '35 min', completed: false, topic: 'Hypothesis' }
    ]
  },
  {
    id: 'data-cleaning-int',
    name: 'Data Cleaning',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Data Science',
    icon: '🧼',
    aliases: ['Data Wrangling', 'Outlier Treatment', 'Data Sanitization'],
    relatedSkills: ['Data Science', 'Pandas', 'Exploratory Data Analysis'],
    description: 'Cleaning messy data: deduplication, string sanitization (regex), handling missing data with KNN/IterativeImputer, and detecting/capping outliers (Z-score, IQR).',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Data Engineer', 'Data Analyst', 'Junior Data Scientist'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 21,
    estimatedTime: '12 Hours',
    learningObjectives: [
      'Identify and remove duplicate records and trailing whitespace discrepancies',
      'Detect and cap numerical outliers using the Interquartile Range (IQR) rule',
      'Handle structured text normalization using regular expressions'
    ],
    resources: [
      { id: 'dc-1', title: 'Outlier Detection (Z-Score & IQR) & Imputation Rules', type: 'doc', duration: '30 min', completed: false, topic: 'Outliers' }
    ]
  },
  {
    id: 'feature-eng-int',
    name: 'Feature Engineering',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Data Science',
    icon: '⚙️',
    aliases: ['Feature Creation', 'Feature Scaling', 'Data Transformations'],
    relatedSkills: ['Data Science', 'Machine Learning', 'Scikit-learn'],
    description: 'Creating predictive representations: mathematical interaction features, polynomial features, target encoding, date/time part extraction, and log transformations.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Data Scientist', 'ML Engineer', 'Analytics Specialist'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 24,
    estimatedTime: '14 Hours',
    learningObjectives: [
      'Extract cyclical time features (sin/cos encoding for months/hours)',
      'Transform skewed numerical distributions using log and Box-Cox transforms',
      'Create interaction features that capture cross-variable effects'
    ],
    resources: [
      { id: 'fe-1', title: 'Mathematical Transformations & Feature Interaction Engineering', type: 'doc', duration: '35 min', completed: false, topic: 'Features' }
    ]
  },
  {
    id: 'dataviz-int',
    name: 'Data Visualization',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Data Science',
    icon: '📈',
    aliases: ['BI Dashboards', 'Interactive Charts', 'Plotly'],
    relatedSkills: ['Data Science', 'Matplotlib', 'Seaborn'],
    description: 'Interactive analytics: building dynamic charts using Plotly, hover tooltips, multi-series dashboards, choropleth maps, and business metric presentation.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['BI Developer', 'Data Visualization Specialist', 'Data Analyst'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 20,
    estimatedTime: '12 Hours',
    learningObjectives: [
      'Generate interactive HTML charts with zooming and panning using Plotly Express',
      'Render geographical choropleth maps representing regional metrics',
      'Deliver executive analytics dashboards communicating actionable business KPIs'
    ],
    resources: [
      { id: 'dvi-1', title: 'Interactive Web Charts & Choropleths with Plotly', type: 'doc', duration: '35 min', completed: false, topic: 'Plotly' }
    ]
  },
  {
    id: 'jupyter-int',
    name: 'Jupyter Notebook',
    tier: 'Intermediate',
    level: 'Intermediate',
    category: 'Data Science',
    icon: '🪐',
    aliases: ['JupyterLab', 'Notebook Workflows', 'IPython'],
    relatedSkills: ['Python', 'Data Science', 'Machine Learning'],
    description: 'Interactive computational notebooks: kernel execution, magic commands (%timeit, %matplotlib inline), markdown documentation with LaTeX math, and exporting reports.',
    defaultProgress: 0,
    defaultStatus: 'Not Started',
    careerRoles: ['Data Scientist', 'Research Associate', 'ML Engineer'],
    recommendedAction: 'Start Assessment & Syllabus',
    relatedOpportunityCount: 22,
    estimatedTime: '6 Hours',
    learningObjectives: [
      'Manage multiple Python virtual environments in Jupyter using ipykernel',
      'Benchmark code snippets using %time and %timeit magic functions',
      'Document analytical findings with rich Markdown and LaTeX equations'
    ],
    resources: [
      { id: 'jup-1', title: 'Jupyter Magic Commands, Kernels & LaTeX Math', type: 'doc', duration: '25 min', completed: false, topic: 'Jupyter' }
    ]
  }
];
