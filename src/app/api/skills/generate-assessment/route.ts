import { NextResponse } from 'next/server';
import { AssessmentQuestion, SkillTier } from '@/types/student';
import { checkRateLimit, verifyAppCheckHeader } from '@/server/rateLimit';
import { verifyFirebaseUser } from '@/server/verifyFirebaseUser';
import { createAssessmentAttempt } from '@/server/assessmentAttempts';

export const runtime = 'nodejs';

async function createAttemptResponse(input: {
  userId: string;
  skillId: string;
  skillName: string;
  skillTier: string;
  skillCategory: string;
  questions: AssessmentQuestion[];
  source: 'gemini' | 'fallback';
}) {
  const attempt = await createAssessmentAttempt(input);
  return NextResponse.json({
    ...attempt,
    source: input.source,
    skillName: input.skillName,
    skillTier: input.skillTier,
  });
}

interface GenerateAssessmentRequest {
  skillId?: string;
  skillName: string;
  skillTier?: SkillTier | string;
  skillCategory?: string;
  topics?: string[];
}

const responseSchema = {
  type: 'OBJECT',
  properties: {
    questions: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          id: { type: 'INTEGER' },
          question: { type: 'STRING' },
          options: {
            type: 'ARRAY',
            items: { type: 'STRING' },
          },
          correctIndex: { type: 'INTEGER' },
          explanation: { type: 'STRING' },
          topic: { type: 'STRING' },
        },
        required: ['id', 'question', 'options', 'correctIndex', 'explanation', 'topic'],
      },
    },
  },
  required: ['questions'],
};

const systemInstruction = `You are a senior technical assessment designer for SkillSetu, an enterprise career verification platform.
Your task is to generate exactly 10 high-quality, real-world multiple-choice questions (MCQs) to evaluate a student's competency.

Strict Rules:
1. Provide exactly 10 questions numbered id: 1 through 10.
2. Each question must have exactly 4 plausible options (index 0, 1, 2, 3).
3. Exactly one option is correct; correctIndex must be an integer between 0 and 3.
4. CRITICAL: Distribute the correct answers uniformly across all 4 positions (0, 1, 2, and 3). Do NOT always make the first option (index 0) the correct answer.
5. Explanations must clearly explain WHY the correct option is right and cite practical engineering principles or syntax behavior.
6. Topics must reflect real engineering concepts (e.g. "State Management", "Async/Await", "Query Optimization", "Memory Management", "Clean Code").
7. Tone should be professional, practical, and test real-world developer problem solving (avoid trivial trick questions).
8. Return strictly valid JSON adhering to the specified schema.`;

/**
 * Randomly shuffles the 4 options of a question using Fisher-Yates
 * and updates correctIndex accordingly so that the correct answer is evenly distributed across A, B, C, D.
 */
function shuffleQuestionOptions(q: AssessmentQuestion): AssessmentQuestion {
  if (!q || !Array.isArray(q.options) || q.options.length < 2) return q;

  const validCorrectIdx =
    typeof q.correctIndex === 'number' && q.correctIndex >= 0 && q.correctIndex < q.options.length
      ? q.correctIndex
      : 0;

  // Pair each option with its correctness flag
  const pairs = q.options.map((opt, idx) => ({ opt, isCorrect: idx === validCorrectIdx }));

  // Fisher-Yates shuffle
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = pairs[i];
    pairs[i] = pairs[j];
    pairs[j] = temp;
  }

  const newCorrectIndex = pairs.findIndex((item) => item.isCorrect);

  return {
    ...q,
    options: pairs.map((item) => item.opt),
    correctIndex: newCorrectIndex !== -1 ? newCorrectIndex : 0,
  };
}

// Context-aware fallback generator if Gemini API key is missing or encounters temporary rate limits
function generateRawFallbackQuestions(
  skillName: string,
  tier: string = 'Basic',
  category: string = 'Technology'
): AssessmentQuestion[] {
  const normalized = skillName.toLowerCase();

  // Python Bank
  if (normalized.includes('python')) {
    return [
      {
        id: 1,
        question: 'What is the output of `type([])` in Python 3?',
        options: ["<class 'tuple'>", "<class 'list'>", "<class 'array'>", "<class 'dict'>"],
        correctIndex: 1,
        explanation: 'In Python, square brackets define a list object of type `list`.',
        topic: 'Data Types',
      },
      {
        id: 2,
        question: 'Which built-in function returns an iterator of tuples containing index and value?',
        options: ['range()', 'zip()', 'enumerate()', 'map()'],
        correctIndex: 2,
        explanation: '`enumerate()` adds a counter to an iterable and returns it as an enumerate object.',
        topic: 'Iterators & Loops',
      },
      {
        id: 3,
        question: 'What will `bool("False")` evaluate to in Python?',
        options: ['False', 'True', 'None', 'TypeError'],
        correctIndex: 1,
        explanation: 'Any non-empty string in Python evaluates to `True` in a boolean context.',
        topic: 'Type Casting',
      },
      {
        id: 4,
        question: 'Which keyword is used to ensure code runs regardless of exceptions in a `try` block?',
        options: ['catch', 'always', 'finally', 'ensure'],
        correctIndex: 2,
        explanation: 'The `finally` clause executes unconditionally whether an exception occurs or not.',
        topic: 'Exception Handling',
      },
      {
        id: 5,
        question: 'What is the time complexity of looking up a key in a standard Python dictionary on average?',
        options: ['O(n)', 'O(log n)', 'O(1)', 'O(n log n)'],
        correctIndex: 2,
        explanation: 'Python dictionaries are implemented as hash tables, giving average O(1) key lookups.',
        topic: 'Data Structures',
      },
      {
        id: 6,
        question: 'What is the difference between `list.append(x)` and `list.extend(x)` when x is `[1, 2]`?',
        options: [
          'append adds `[1, 2]` as a single element; extend unpacks and appends `1` and `2`',
          'Both behave identically',
          'extend creates a new list while append mutates in-place',
          'append only works for strings while extend works for lists',
        ],
        correctIndex: 0,
        explanation: '`append()` inserts the object as-is; `extend()` iterates over the iterable argument.',
        topic: 'List Manipulation',
      },
      {
        id: 7,
        question: 'How do you create a generator in Python using function syntax?',
        options: ['Using the `return` keyword', 'Using the `yield` keyword', 'Using the `generator` decorator', 'Using `async def`'],
        correctIndex: 1,
        explanation: 'Functions containing `yield` statements produce generator iterators on execution.',
        topic: 'Generators',
      },
      {
        id: 8,
        question: 'Which module in the Python standard library provides deep copy capabilities for nested objects?',
        options: ['sys', 'clone', 'copy', 'json'],
        correctIndex: 2,
        explanation: 'The `copy` module provides `copy.deepcopy()` to recursively duplicate compound objects.',
        topic: 'Standard Library',
      },
      {
        id: 9,
        question: 'What does the `@property` decorator achieve in Python classes?',
        options: [
          'Marks a method as static',
          'Allows a method to be accessed like an attribute with getters/setters',
          'Makes the class private',
          'Prevents inheritance',
        ],
        correctIndex: 1,
        explanation: '`@property` allows defining getter methods that callers access via dot notation without parentheses.',
        topic: 'Object-Oriented Programming',
      },
      {
        id: 10,
        question: 'In Python, what is the Global Interpreter Lock (GIL)?',
        options: [
          'A security feature that blocks unauthorized file writes',
          'A mutex that protects access to Python objects, preventing multiple native threads from executing Python bytecodes at once',
          'A garbage collection routine for circular references',
          'A package manager mechanism for pip',
        ],
        correctIndex: 1,
        explanation: 'The GIL is a mutex used by CPython to ensure thread-safety with reference-counted memory management.',
        topic: 'Concurrency & Internals',
      },
    ];
  }

  // React Bank
  if (normalized.includes('react')) {
    return [
      {
        id: 1,
        question: 'What is the primary purpose of the `useEffect` hook with an empty dependency array `[]`?',
        options: [
          'Runs on every re-render of the component',
          'Runs once when the component mounts',
          'Runs only when parent props change',
          'Disables rendering optimization',
        ],
        correctIndex: 1,
        explanation: 'An empty dependency array signals React to execute the effect only after the initial mount.',
        topic: 'React Hooks',
      },
      {
        id: 2,
        question: 'Why should you avoid using array indices as `key` props when list items can re-order or be deleted?',
        options: [
          'It causes a fatal JavaScript runtime error',
          'It can cause subtle UI glitches and state persistence across wrong components during reconciliation',
          'Keys are strictly required to be UUID strings',
          'It slows down server-side network transfers',
        ],
        correctIndex: 1,
        explanation: 'Index keys cause React to re-use DOM instances incorrectly when items shift position or get filtered.',
        topic: 'Reconciliation & Keys',
      },
      {
        id: 3,
        question: 'How does React Virtual DOM optimize DOM updates?',
        options: [
          'It runs directly inside WebAssembly',
          'It computes differences between virtual DOM trees and batches minimal updates to the real DOM',
          'It disables browser layout recalculations completely',
          'It replaces HTML with canvas elements',
        ],
        correctIndex: 1,
        explanation: 'Reconciliation diffs virtual representations to compute the minimal set of mutations for the real DOM.',
        topic: 'Architecture & Virtual DOM',
      },
      {
        id: 4,
        question: 'Which hook should you use to cache the result of an expensive calculation between renders?',
        options: ['useCallback', 'useMemo', 'useRef', 'useState'],
        correctIndex: 1,
        explanation: '`useMemo` memoizes computed values, recalculating only when its dependencies change.',
        topic: 'Performance Optimization',
      },
      {
        id: 5,
        question: 'What is the difference between `useCallback` and `useMemo`?',
        options: [
          '`useCallback` returns a memoized callback function; `useMemo` returns a memoized value',
          '`useCallback` runs synchronously; `useMemo` runs asynchronously',
          '`useCallback` is deprecated in React 18',
          '`useMemo` can only be used inside custom hooks',
        ],
        correctIndex: 0,
        explanation: '`useCallback(fn, deps)` is equivalent to `useMemo(() => fn, deps)`.',
        topic: 'React Hooks',
      },
      {
        id: 6,
        question: 'What problem does the Context API primarily solve in React architectures?',
        options: [
          'Cross-origin resource sharing (CORS)',
          'Prop drilling through intermediate components that do not need the data',
          'Server-side database caching',
          'Replacing CSS stylesheets',
        ],
        correctIndex: 1,
        explanation: 'Context provides a way to share values through the component tree without passing props manually at every level.',
        topic: 'State Management',
      },
      {
        id: 7,
        question: 'When updating state based on the previous state in `useState`, what is the best practice?',
        options: [
          'Call `setState(state + 1)` directly',
          'Use the functional updater form `setState(prev => prev + 1)`',
          'Mutate the existing state variable then call `forceUpdate()`',
          'Wrap the state in a `setTimeout` callback',
        ],
        correctIndex: 1,
        explanation: 'Because React state updates may be batched, updater functions guarantee access to the latest state value.',
        topic: 'State Updates',
      },
      {
        id: 8,
        question: 'What does `useRef` preserve across component renders without triggering a re-render when mutated?',
        options: ['Props', 'Mutable reference object via `.current`', 'Global context', 'JSX virtual nodes'],
        correctIndex: 1,
        explanation: 'Modifying the `.current` property of a `ref` persists across renders and does not trigger re-renders.',
        topic: 'React Hooks & Refs',
      },
      {
        id: 9,
        question: 'What is a Pure Component or `React.memo` used for?',
        options: [
          'Preventing unnecessary re-renders when props have not shallowly changed',
          'Enforcing TypeScript type checking',
          'Fetching data from REST APIs',
          'Creating immutable Redux stores',
        ],
        correctIndex: 0,
        explanation: '`React.memo` wraps components and skips re-rendering if previous and next props are shallowly equal.',
        topic: 'Component Lifecycle & Memo',
      },
      {
        id: 10,
        question: 'What is the recommended rule regarding hooks placement inside React components?',
        options: [
          'Hooks can be placed inside loops or if-statements conditionally',
          'Hooks must only be called at the top level of React functions, never conditionally',
          'Hooks must be placed inside the return statement',
          'Hooks should only run inside class constructors',
        ],
        correctIndex: 1,
        explanation: 'Calling hooks at the top level ensures hooks are called in the exact same order on every render.',
        topic: 'Rules of Hooks',
      },
    ];
  }

  // SQL Bank
  if (normalized.includes('sql') || normalized.includes('database')) {
    return [
      {
        id: 1,
        question: 'What is the primary difference between `WHERE` and `HAVING` clauses in SQL?',
        options: [
          '`WHERE` filters rows before aggregation; `HAVING` filters aggregated groups',
          '`HAVING` filters rows before `WHERE` executes',
          '`WHERE` is only used with JOINs',
          '`HAVING` cannot use comparison operators',
        ],
        correctIndex: 0,
        explanation: '`WHERE` filters individual records before `GROUP BY`; `HAVING` filters grouped summary results.',
        topic: 'Filtering & Aggregation',
      },
      {
        id: 2,
        question: 'Which JOIN returns all rows from the left table and matched rows from the right table?',
        options: ['INNER JOIN', 'LEFT JOIN', 'FULL OUTER JOIN', 'CROSS JOIN'],
        correctIndex: 1,
        explanation: 'A `LEFT JOIN` preserves all records from the left side and fills missing right-side columns with `NULL`.',
        topic: 'Table Joins',
      },
      {
        id: 3,
        question: 'What does the ACID acronym stand for in relational database transactions?',
        options: [
          'Accuracy, Consistency, Integrity, Durability',
          'Atomicity, Consistency, Isolation, Durability',
          'Asynchronous, Concurrent, Isolated, Distributed',
          'Availability, Consistency, Idempotency, Durability',
        ],
        correctIndex: 1,
        explanation: 'ACID guarantees transaction reliability: Atomicity, Consistency, Isolation, and Durability.',
        topic: 'Database Transactions',
      },
      {
        id: 4,
        question: 'What is a Database Index primarily designed to optimize?',
        options: [
          'Speed up data retrieval queries at the cost of slight write overhead and storage',
          'Encrypt sensitive column values',
          'Automatically compress image blobs',
          'Prevent foreign key constraint violations',
        ],
        correctIndex: 0,
        explanation: 'Indexes create balanced tree or hash lookups that drastically accelerate `SELECT` filtering and ordering.',
        topic: 'Indexing & Performance',
      },
      {
        id: 5,
        question: 'What does the SQL command `GROUP BY` require for all columns in the `SELECT` list that are not in the `GROUP BY` clause?',
        options: [
          'They must be indexed',
          'They must be wrapped in aggregate functions (e.g. SUM, AVG, COUNT)',
          'They must be foreign keys',
          'They must be sorted ascending',
        ],
        correctIndex: 1,
        explanation: 'Standard SQL requires non-grouped attributes to be aggregated so each group collapses into one row.',
        topic: 'Aggregations',
      },
      {
        id: 6,
        question: 'Which constraint ensures that no duplicate values exist across a column and values cannot be NULL?',
        options: ['UNIQUE', 'CHECK', 'PRIMARY KEY', 'DEFAULT'],
        correctIndex: 2,
        explanation: 'A `PRIMARY KEY` uniquely identifies each record and strictly enforces non-null, unique values.',
        topic: 'Schema Constraints',
      },
      {
        id: 7,
        question: 'What does `COALESCE(col1, col2, "default")` return?',
        options: [
          'The concatenation of all arguments',
          'The first non-null value among the arguments',
          'The boolean average of the columns',
          'A JSON array of valid keys',
        ],
        correctIndex: 1,
        explanation: '`COALESCE` evaluates arguments in order and returns the current value of the first expression that does not evaluate to NULL.',
        topic: 'Null Handling & Functions',
      },
      {
        id: 8,
        question: 'What is Database Normalization (e.g., 3NF) intended to prevent?',
        options: [
          'Data redundancy and update/delete anomalies',
          'Network latency across servers',
          'SQL injection attacks',
          'Automatic index creation',
        ],
        correctIndex: 0,
        explanation: 'Normalization organizes tables to reduce duplication and protect data integrity during updates.',
        topic: 'Database Design',
      },
      {
        id: 9,
        question: 'What does an `EXPLAIN` or `EXPLAIN ANALYZE` statement show in relational databases?',
        options: [
          'The database server operating system logs',
          'The query execution plan chosen by the query optimizer (index scans, seq scans, joins)',
          'The user permissions and role grants',
          'The schema definition DDL script',
        ],
        correctIndex: 1,
        explanation: '`EXPLAIN` details how the database engine executes the query, highlighting scan types and estimated costs.',
        topic: 'Query Optimization',
      },
      {
        id: 10,
        question: 'Which transaction isolation level prevents dirty reads, non-repeatable reads, and phantom reads completely?',
        options: ['Read Uncommitted', 'Read Committed', 'Repeatable Read', 'Serializable'],
        correctIndex: 3,
        explanation: '`Serializable` is the strictest isolation level, preventing all concurrent anomalies by emulating serial execution.',
        topic: 'Concurrency & Isolation',
      },
    ];
  }

  // Generic Tech Bank (Tailored dynamically to Skill Name & Tier)
  const capitalized = skillName.charAt(0).toUpperCase() + skillName.slice(1);
  return [
    {
      id: 1,
      question: `What is the core architectural principle behind ${capitalized}?`,
      options: [
        `Providing modular, maintainable, and standard-compliant implementations for ${category}`,
        `Replacing operating systems with embedded firmware`,
        `Mandating proprietary binary file formats`,
        `Disabling network communication protocols`,
      ],
      correctIndex: 0,
      explanation: `${capitalized} focuses on high maintainability, structured design, and standardized engineering patterns.`,
      topic: 'Core Architecture',
    },
    {
      id: 2,
      question: `Which approach is widely recognized as an engineering best practice when working with ${capitalized}?`,
      options: [
        'Hardcoding credentials and configurations directly in source files',
        'Separation of concerns, defensive validation, and modular encapsulation',
        'Ignoring automated test coverage in favor of manual testing',
        'Deploying untagged code straight to production environments',
      ],
      correctIndex: 1,
      explanation: 'Modern software engineering mandates separation of concerns, rigorous input validation, and testable modules.',
      topic: 'Best Practices',
    },
    {
      id: 3,
      question: `How should error handling and exceptions be structured in a ${capitalized} project?`,
      options: [
        'Swallow all errors silently with empty catch handlers',
        'Fail gracefully, log meaningful context, and bubble exceptions to centralized error boundaries or handlers',
        'Crash the entire operating system thread immediately',
        'Print error text to the browser alert modal in production',
      ],
      correctIndex: 1,
      explanation: 'Robust systems catch errors cleanly, attach diagnostic context, and prevent cascading service failures.',
      topic: 'Error Handling',
    },
    {
      id: 4,
      question: `When optimizing the performance of ${capitalized} workflows, what should be evaluated first?`,
      options: [
        'Profile real bottlenecks, measure network/IO latency, and eliminate unnecessary computations',
        'Rewrite everything in raw assembly code blindly',
        'Increase CPU clock speed without analyzing memory usage',
        'Remove comments and documentation to save disk space',
      ],
      correctIndex: 0,
      explanation: 'Premature optimization is counter-productive; engineering best practice requires measuring actual bottlenecks first.',
      topic: 'Performance & Optimization',
    },
    {
      id: 5,
      question: `In a modern CI/CD pipeline for ${capitalized}, what step should precede artifact deployment?`,
      options: [
        'Automated static analysis, unit/integration testing, and security vulnerability scanning',
        'Manual database deletion',
        'Unversioned file overwrites',
        'Disabling audit logs',
      ],
      correctIndex: 0,
      explanation: 'Automated verification pipelines ensure code quality, compliance, and regression safety prior to release.',
      topic: 'DevOps & Verification',
    },
    {
      id: 6,
      question: `Which data integrity or security standard is critical when building ${capitalized} applications?`,
      options: [
        'Principle of least privilege, sanitized inputs, and secure transmission protocols (TLS/HTTPS)',
        'Storing sensitive access tokens in public version control repositories',
        'Trusting all incoming user payloads without validation',
        'Granting root administrator privileges to anonymous clients',
      ],
      correctIndex: 0,
      explanation: 'The principle of least privilege combined with input sanitization guards against common vulnerability classes.',
      topic: 'Security & Integrity',
    },
    {
      id: 7,
      question: `What is the significance of semantic versioning (SemVer) when maintaining ${capitalized} packages or dependencies?`,
      options: [
        'MAJOR bumps break API compatibility, MINOR adds backward-compatible features, and PATCH fixes bugs',
        'It arbitrarily changes version numbers on every git commit',
        'It dictates the pricing tier of software licenses',
        'It restricts code execution to specific calendar dates',
      ],
      correctIndex: 0,
      explanation: 'SemVer (MAJOR.MINOR.PATCH) gives downstream consumers predictable signals about compatibility and breaking changes.',
      topic: 'Dependency Management',
    },
    {
      id: 8,
      question: `When collaborating in a team on ${capitalized}, what is the role of automated linting and code formatting?`,
      options: [
        'Enforcing consistent code style and catching syntax anti-patterns early in code reviews',
        'Increasing binary build artifact sizes',
        'Replacing runtime unit tests entirely',
        'Preventing git merge commits',
      ],
      correctIndex: 0,
      explanation: 'Linters standardize stylistic conventions and catch subtle bugs before code reaches review stages.',
      topic: 'Code Quality',
    },
    {
      id: 9,
      question: `How does modern ${capitalized} development handle asynchronous tasks and concurrent I/O operations?`,
      options: [
        'Using event loops, promises/futures, or non-blocking threads to maximize throughput',
        'Busy waiting with infinite while loops',
        'Halting the process until remote servers reply',
        'Running only single-instruction cycles sequentially',
      ],
      correctIndex: 0,
      explanation: 'Non-blocking I/O and asynchronous event architectures prevent thread starvation during network or disk operations.',
      topic: 'Asynchronous Programming',
    },
    {
      id: 10,
      question: `At the ${tier} level of ${capitalized}, what defines a production-ready solution?`,
      options: [
        'Documented architecture, high test coverage, robust edge-case handling, and monitoring',
        'Quick prototype code with no comments or validation',
        'Code that only runs on local localhost environments',
        'Hardcoded mock data in production endpoints',
      ],
      correctIndex: 0,
      explanation: 'Production readiness requires complete documentation, thorough test coverage, and reliable operational monitoring.',
      topic: 'Production Engineering',
    },
  ];
}

function generateFallbackQuestions(
  skillName: string,
  tier: string = 'Basic',
  category: string = 'Technology'
): AssessmentQuestion[] {
  return generateRawFallbackQuestions(skillName, tier, category).map(shuffleQuestionOptions);
}

export async function POST(req: Request) {
  try {
    const appCheck = await verifyAppCheckHeader(req);
    if (!appCheck.isValid) return NextResponse.json({ error: appCheck.reason || 'Invalid App Check token.' }, { status: 401 });

    const userId = await verifyFirebaseUser(req);
    if (!userId) return NextResponse.json({ error: 'Sign in to generate an assessment.' }, { status: 401 });

    const limit = await checkRateLimit(`assessment:${userId}`, 8, 60);
    if (limit.unavailable) return NextResponse.json({ error: 'Assessment service is temporarily unavailable.' }, { status: 503 });
    if (!limit.success) return NextResponse.json({ error: 'Too many assessment requests. Please try again in a minute.' }, { status: 429 });

    let body: GenerateAssessmentRequest;
    try {
      body = (await req.json()) as GenerateAssessmentRequest;
    } catch {
      return NextResponse.json({ error: 'Invalid JSON request payload.' }, { status: 400 });
    }

    const { skillId, skillName, skillTier = 'Basic', skillCategory = 'Technology', topics = [] } = body || {};

    if (typeof skillId !== 'string' || !skillId.trim() || skillId.length > 160 ||
      !skillName || typeof skillName !== 'string' || skillName.trim().length > 100 ||
        typeof skillTier !== 'string' || skillTier.length > 80 ||
        typeof skillCategory !== 'string' || skillCategory.length > 80) {
      return NextResponse.json({ error: 'Valid skillName is required.' }, { status: 400 });
    }

    const safeTopics = Array.isArray(topics)
      ? topics.filter((t) => typeof t === 'string' && t.trim().length > 0 && t.length <= 80).slice(0, 20)
      : [];
    const apiKey = process.env.GEMINI_API_KEY;

    // If Gemini key is missing, return our high quality fallback questions immediately
    if (!apiKey) {
      console.warn('[AI Assessment] GEMINI_API_KEY is not set. Serving high-fidelity fallback assessment.');
      const fallbackQuestions = generateFallbackQuestions(skillName, skillTier, skillCategory);
      return createAttemptResponse({
        userId,
        skillId,
        skillName: skillName.trim(),
        skillTier,
        skillCategory,
        questions: fallbackQuestions,
        source: 'fallback',
      });
    }

    const topicsHint = safeTopics.length > 0 ? safeTopics.join(', ') : 'core concepts, best practices, architecture, real-world syntax, problem solving';
    const prompt = `Generate exactly 10 multiple-choice questions for evaluating competency in:
- Skill: "${skillName}"
- Level: "${skillTier}"
- Category: "${skillCategory}"
- Topics to cover: ${topicsHint}

Strictly follow the output schema with 10 questions, each having 4 options and a correctIndex (0-3).`;

    const requestPayload = {
      systemInstruction: { parts: [{ text: systemInstruction }] },
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema,
        temperature: 0.3,
      },
    };

    const models = ['gemini-3.6-flash', 'gemini-3.1-flash-lite'];
    let geminiResponse: Response | undefined;

    for (let i = 0; i < models.length; i++) {
      const model = models[i];
      try {
        geminiResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-goog-api-key': apiKey,
            },
            body: JSON.stringify(requestPayload),
            signal: AbortSignal.timeout(25_000),
          }
        );

        if (geminiResponse.ok) {
          break;
        } else {
          console.warn(`[AI Assessment] Model ${model} returned ${geminiResponse.status}. Attempt ${i + 1}/${models.length}`);
        }
      } catch (err) {
        console.warn(`[AI Assessment] Network error calling ${model}:`, err);
        if (i === models.length - 1) {
          break;
        }
      }
    }

    if (geminiResponse && geminiResponse.ok) {
      const payload = await geminiResponse.json();
      const rawText = payload?.candidates?.[0]?.content?.parts
        ?.map((part: { text?: string }) => part.text || '')
        .join('');

      if (rawText) {
        try {
          const parsed = JSON.parse(rawText) as { questions: AssessmentQuestion[] };
          if (Array.isArray(parsed.questions) && parsed.questions.length > 0) {
            // Re-index IDs cleanly 1..10 and ensure options are randomly shuffled across A, B, C, D
            const cleanedQuestions: AssessmentQuestion[] = parsed.questions.slice(0, 10).map((q, idx) => {
              const baseQ: AssessmentQuestion = {
                id: idx + 1,
                question: q.question,
                options: Array.isArray(q.options) && q.options.length === 4 ? q.options : ['Option A', 'Option B', 'Option C', 'Option D'],
                correctIndex: typeof q.correctIndex === 'number' && q.correctIndex >= 0 && q.correctIndex <= 3 ? q.correctIndex : 0,
                explanation: q.explanation || 'Option evaluated according to modern industry standards.',
                topic: q.topic || 'General',
              };
              return shuffleQuestionOptions(baseQ);
            });

            return createAttemptResponse({
              userId,
              skillId,
              skillName: skillName.trim(),
              skillTier,
              skillCategory,
              questions: cleanedQuestions,
              source: 'gemini',
            });
          }
        } catch (jsonErr) {
          console.error('[AI Assessment] Failed to parse Gemini JSON output:', jsonErr);
        }
      }
    }

    // Fallback if Gemini request was unsuccessful or returned unparseable text
    console.warn('[AI Assessment] Gemini call failed or quota exceeded; returning contextual fallback questions.');
    const fallbackQuestions = generateFallbackQuestions(skillName, skillTier, skillCategory);
    return createAttemptResponse({
      userId,
      skillId,
      skillName: skillName.trim(),
      skillTier,
      skillCategory,
      questions: fallbackQuestions,
      source: 'fallback',
    });
  } catch (error) {
    console.error('[AI Assessment] Server error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate assessment questions.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
