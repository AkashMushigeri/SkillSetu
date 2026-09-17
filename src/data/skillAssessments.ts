import { AssessmentQuestion } from '@/types/student';

// 1. C PROGRAMMING — BASIC LEVEL (10 Questions covering all core areas)
export const C_BASIC_ASSESSMENT: AssessmentQuestion[] = [
  {
    id: 1,
    question: "What is the mandatory entry point function where execution of any C program begins?",
    options: ["start()", "main()", "init()", "run()"],
    correctIndex: 1,
    explanation: "In C, execution always begins with the `main()` function, which typically returns an integer status code.",
    topic: "C Fundamentals"
  },
  {
    id: 2,
    question: "Which format specifiers in printf() correctly format a signed decimal integer and a single character respectively?",
    options: ["%f and %s", "%d and %c", "%x and %p", "%ld and %f"],
    correctIndex: 1,
    explanation: "`%d` (or `%i`) is used for decimal integers and `%c` is used for single character values.",
    topic: "Input & Output"
  },
  {
    id: 3,
    question: "What is the effect of encountering a `break` statement inside a loop or switch block in C?",
    options: [
      "Skips the current iteration and tests the loop condition again",
      "Immediately terminates the innermost enclosing loop or switch statement",
      "Terminates the entire C program and frees all memory",
      "Restarts the loop iteration from index 0"
    ],
    correctIndex: 1,
    explanation: "`break` causes immediate termination of the innermost enclosing `while`, `for`, `do-while`, or `switch` construct.",
    topic: "Control Flow"
  },
  {
    id: 4,
    question: "In C, how are arguments passed to functions by default?",
    options: ["Call by reference", "Call by value", "Call by pointer", "Call by name"],
    correctIndex: 1,
    explanation: "C strictly uses call by value for all argument passing. Passing an address emulates call by reference by copying the pointer value.",
    topic: "Functions"
  },
  {
    id: 5,
    question: "How is a character string terminated in C memory?",
    options: ["With EOF (-1)", "With the null character '\\0'", "With a newline '\\n'", "With a space character ' '"],
    correctIndex: 1,
    explanation: "Strings in C are character arrays terminated by a null byte `\\0` (ASCII value 0).",
    topic: "Arrays and Strings"
  },
  {
    id: 6,
    question: "Given `int val = 42; int *ptr = &val;`, what does the dereference expression `*ptr` return?",
    options: ["The memory address of val", "The integer value 42", "The memory address of ptr", "The size of an integer"],
    correctIndex: 1,
    explanation: "The unary `*` (dereference) operator retrieves the value stored at the address pointed to by `ptr`.",
    topic: "Pointers"
  },
  {
    id: 7,
    question: "If pointer `ptr` of type `int*` points to memory address 2000 on an architecture where sizeof(int) is 4 bytes, what address does `ptr + 2` point to?",
    options: ["2002", "2004", "2008", "2016"],
    correctIndex: 2,
    explanation: "Pointer arithmetic scales with element size: `2000 + 2 * sizeof(int) = 2000 + 2 * 4 = 2008`.",
    topic: "Pointer Arithmetic"
  },
  {
    id: 8,
    question: "What is the key difference in memory layout between a `struct` and a `union` in C?",
    options: [
      "A struct allocates memory sequentially for all members; a union allocates only enough memory for its largest member, sharing memory between members",
      "A struct can only contain integers, while a union can contain any type",
      "Unions can be allocated on the heap while structs can only exist on the stack",
      "There is no difference in memory allocation between structs and unions"
    ],
    correctIndex: 0,
    explanation: "Every member of a struct has its own distinct offset in memory, whereas all members of a union share the same base memory address.",
    topic: "Structures and Unions"
  },
  {
    id: 9,
    question: "Which dynamic memory allocation function allocates heap memory and zero-initializes all bytes?",
    options: ["malloc()", "calloc()", "realloc()", "alloca()"],
    correctIndex: 1,
    explanation: "`calloc(num, size)` allocates contiguous memory on the heap and initializes all allocated bytes to zero.",
    topic: "Dynamic Memory Management"
  },
  {
    id: 10,
    question: "Which file mode in `fopen()` opens a file for writing, appending new data to the end without truncating existing content?",
    options: ["\"r+\"", "\"w\"", "\"a\"", "\"wb\""],
    correctIndex: 2,
    explanation: "Mode `\"a\"` opens a file in append mode, preserving existing content and positioning writes at the end.",
    topic: "File Handling"
  }
];

// 2. HTML — BASIC LEVEL
export const HTML_BASIC_ASSESSMENT: AssessmentQuestion[] = [
  {
    id: 1,
    question: "Which HTML5 semantic element is most appropriate for containing the primary navigation links of a website?",
    options: ["<menu>", "<nav>", "<section>", "<header>"],
    correctIndex: 1,
    explanation: "The `<nav>` element represents a section of a page whose purpose is to provide navigation links.",
    topic: "Semantic Elements"
  },
  {
    id: 2,
    question: "Which attribute must be linked to an `<input>` element's `id` to ensure form accessibility for screen readers?",
    options: ["name", "<label for=\"...\">", "placeholder", "title"],
    correctIndex: 1,
    explanation: "Associating `<label for=\"inputId\">` with `<input id=\"inputId\">` allows assistive technologies to announce the input label.",
    topic: "Forms & Accessibility"
  },
  {
    id: 3,
    question: "What is the purpose of the `<!DOCTYPE html>` declaration at the beginning of an HTML document?",
    options: [
      "To link external CSS styles",
      "To instruct the browser to render the page in standard HTML5 mode",
      "To declare the character encoding of the document",
      "To enable JavaScript execution"
    ],
    correctIndex: 1,
    explanation: "`<!DOCTYPE html>` triggers standard mode rendering in modern browsers, preventing quirks mode.",
    topic: "HTML Fundamentals"
  },
  {
    id: 4,
    question: "Which meta tag is essential in the `<head>` to ensure proper scaling on mobile devices?",
    options: [
      "<meta name=\"robots\" content=\"index\">",
      "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">",
      "<meta http-equiv=\"refresh\" content=\"30\">",
      "<meta name=\"theme-color\" content=\"#000000\">"
    ],
    correctIndex: 1,
    explanation: "The viewport meta tag instructs mobile browsers how to adjust screen dimensions and scaling.",
    topic: "Responsive Metadata"
  },
  {
    id: 5,
    question: "Which HTML tag is used to embed tabular column header cells for optimal accessibility?",
    options: ["<td>", "<th>", "<tr head>", "<header>"],
    correctIndex: 1,
    explanation: "`<th>` defines a header cell in a table, providing structural context for screen readers.",
    topic: "Tables & Accessibility"
  }
];

// 3. CSS — BASIC LEVEL
export const CSS_BASIC_ASSESSMENT: AssessmentQuestion[] = [
  {
    id: 1,
    question: "In the CSS box model, which property ensures that `width` includes padding and borders?",
    options: ["box-sizing: content-box;", "box-sizing: border-box;", "display: flex;", "overflow: hidden;"],
    correctIndex: 1,
    explanation: "`box-sizing: border-box` includes padding and border in the element's total width and height.",
    topic: "Box Model"
  },
  {
    id: 2,
    question: "In Flexbox, which property controls the alignment of flex items along the main axis?",
    options: ["align-items", "justify-content", "align-content", "flex-direction"],
    correctIndex: 1,
    explanation: "`justify-content` defines how the browser distributes space between and around items along the main axis.",
    topic: "Flexbox"
  },
  {
    id: 3,
    question: "Which CSS Grid property creates three equal-width responsive columns?",
    options: [
      "grid-template-columns: repeat(3, 1fr);",
      "grid-columns: 3;",
      "grid-template-columns: 33% 33% 33%;",
      "display: grid-3;"
    ],
    correctIndex: 0,
    explanation: "`repeat(3, 1fr)` defines three tracks each taking one fractional unit of available space.",
    topic: "CSS Grid"
  },
  {
    id: 4,
    question: "Which media query syntax targets viewport screens that are 768 pixels or wider (tablet/desktop)?",
    options: ["@media (max-width: 768px)", "@media (min-width: 768px)", "@media (device-width: 768px)", "@screen-width >= 768px"],
    correctIndex: 1,
    explanation: "`@media (min-width: 768px)` applies styles when the viewport width is at least 768px.",
    topic: "Responsive Media Queries"
  },
  {
    id: 5,
    question: "How do you declare and consume a CSS custom property (variable)?",
    options: [
      "$brand-color: #0D5C68; color: $brand-color;",
      "--brand-color: #0D5C68; color: var(--brand-color);",
      "@brand-color: #0D5C68; color: @brand-color;",
      "set(--brand-color, #0D5C68); color: get(--brand-color);"
    ],
    correctIndex: 1,
    explanation: "Native CSS variables are defined with a `--` prefix and referenced using the `var()` function.",
    topic: "CSS Variables"
  }
];

// 4. SQL — BASIC LEVEL
export const SQL_BASIC_ASSESSMENT: AssessmentQuestion[] = [
  {
    id: 1,
    question: "Which SQL clause is used to filter records before grouping operations occur?",
    options: ["HAVING", "WHERE", "ORDER BY", "GROUP BY"],
    correctIndex: 1,
    explanation: "`WHERE` filters individual rows before any aggregations or groupings take place.",
    topic: "Filtering"
  },
  {
    id: 2,
    question: "Which JOIN returns all records from the left table, and the matched records from the right table?",
    options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"],
    correctIndex: 1,
    explanation: "`LEFT JOIN` (or LEFT OUTER JOIN) returns all records from the left table, filling unmatched right columns with NULL.",
    topic: "Table Joins"
  },
  {
    id: 3,
    question: "Which aggregate function calculates the average value of a numeric column in SQL?",
    options: ["MEAN()", "AVG()", "AVERAGE()", "CALC_AVG()"],
    correctIndex: 1,
    explanation: "`AVG(column_name)` returns the numerical average of non-NULL values.",
    topic: "Aggregate Functions"
  },
  {
    id: 4,
    question: "What clause is required when filtering grouped results produced by `GROUP BY`?",
    options: ["WHERE", "HAVING", "LIMIT", "ORDER BY"],
    correctIndex: 1,
    explanation: "`HAVING` filters aggregated records produced by `GROUP BY`, whereas `WHERE` cannot use aggregate functions directly.",
    topic: "Group By & Having"
  },
  {
    id: 5,
    question: "Which constraint uniquely identifies each record in a database table and enforces non-null values?",
    options: ["FOREIGN KEY", "PRIMARY KEY", "CHECK", "DEFAULT"],
    correctIndex: 1,
    explanation: "A `PRIMARY KEY` uniquely identifies each row in a table and cannot contain `NULL` values.",
    topic: "Constraints & Keys"
  }
];

// 5. C++ — BASIC LEVEL
export const CPP_BASIC_ASSESSMENT: AssessmentQuestion[] = [
  {
    id: 1,
    question: "Which OOP concept in C++ allows a function or operator to have multiple forms depending on arguments?",
    options: ["Encapsulation", "Polymorphism", "Abstraction", "Inheritance"],
    correctIndex: 1,
    explanation: "Polymorphism allows routines to act differently based on the data types or signatures provided.",
    topic: "OOP Principles"
  },
  {
    id: 2,
    question: "Which C++ Standard Template Library (STL) container provides dynamic resizing and random access in O(1) time?",
    options: ["std::list", "std::vector", "std::set", "std::stack"],
    correctIndex: 1,
    explanation: "`std::vector` encapsulates dynamic contiguous arrays with constant-time random access via operator `[]`.",
    topic: "STL Containers"
  },
  {
    id: 3,
    question: "What keyword is placed before a member function in a base class to enable runtime dynamic method dispatch?",
    options: ["override", "virtual", "dynamic", "abstract"],
    correctIndex: 1,
    explanation: "The `virtual` keyword tells C++ to perform late binding through a virtual method table (vtable).",
    topic: "Virtual Functions"
  },
  {
    id: 4,
    question: "What is the difference between passing by reference (`int &x`) and passing by pointer (`int *x`) in C++?",
    options: [
      "References can never be re-seated or be null; pointers can be reassigned and point to nullptr",
      "References occupy more memory on the stack than pointers",
      "Pointers can only point to primitives; references only to classes",
      "References cannot be passed to const functions"
    ],
    correctIndex: 0,
    explanation: "References must be initialized upon declaration, cannot be null, and cannot be reseated to another variable.",
    topic: "References vs Pointers"
  },
  {
    id: 5,
    question: "Which stream manipulator in `<iostream>` inserts a newline and immediately flushes the output buffer?",
    options: ["\\n", "std::flush", "std::endl", "std::break"],
    correctIndex: 2,
    explanation: "`std::endl` inserts a newline character and forces a buffer flush onto the output stream.",
    topic: "I/O Streams"
  }
];

// 6. JAVA — BASIC LEVEL
export const JAVA_BASIC_ASSESSMENT: AssessmentQuestion[] = [
  {
    id: 1,
    question: "Which Java component is responsible for converting compiled bytecode into machine code at runtime?",
    options: ["JDK", "JRE", "JVM (JIT Compiler)", "JShell"],
    correctIndex: 2,
    explanation: "The Java Virtual Machine (JVM) interprets bytecode and compiles hot spots into native machine code via the Just-In-Time (JIT) compiler.",
    topic: "Java Architecture"
  },
  {
    id: 2,
    question: "Which collection interface in `java.util` stores key-value pairs with fast O(1) average lookup?",
    options: ["ArrayList", "HashMap", "TreeSet", "LinkedList"],
    correctIndex: 1,
    explanation: "`HashMap` implements the `Map` interface using hashing algorithms for near O(1) retrieval.",
    topic: "Collections Framework"
  },
  {
    id: 3,
    question: "What keyword prevents a Java class from being subclassed (inherited)?",
    options: ["static", "final", "abstract", "const"],
    correctIndex: 1,
    explanation: "Declaring a class `final` prohibits other classes from extending it (e.g., `java.lang.String`).",
    topic: "OOP & Modifiers"
  },
  {
    id: 4,
    question: "Which block in exception handling is guaranteed to execute whether an exception is thrown or caught?",
    options: ["try", "catch", "finally", "throw"],
    correctIndex: 2,
    explanation: "The `finally` block always executes after `try-catch`, commonly used for closing resources.",
    topic: "Exception Handling"
  },
  {
    id: 5,
    question: "In Java, what is the default equality check performed by the `==` operator on non-primitive objects?",
    options: [
      "Deep structural equality",
      "Reference (memory address) equality",
      "String content equality",
      "Hash code comparison"
    ],
    correctIndex: 1,
    explanation: "`==` tests whether both references point to the exact same object in memory, unlike `equals()`.",
    topic: "Object Equality"
  }
];

// 7. JAVASCRIPT — BASIC LEVEL
export const JS_BASIC_ASSESSMENT: AssessmentQuestion[] = [
  {
    id: 1,
    question: "What is the key difference between `let` and `var` in modern JavaScript?",
    options: [
      "var is block-scoped; let is function-scoped",
      "let is block-scoped; var is function-scoped and hoisted with undefined",
      "let variables cannot be reassigned; var variables can",
      "var is executed in strict mode only"
    ],
    correctIndex: 1,
    explanation: "`let` obeys block scope `{}` and prevents temporal dead-zone bugs, whereas `var` is function-scoped.",
    topic: "Scope & Declarations"
  },
  {
    id: 2,
    question: "Which array method creates a new array populated with the results of calling a provided function on every element?",
    options: ["forEach()", "filter()", "map()", "reduce()"],
    correctIndex: 2,
    explanation: "`map()` returns a new array with the transformed elements without mutating the original array.",
    topic: "Array Iteration"
  },
  {
    id: 3,
    question: "What does `async function foo()` return implicitly?",
    options: ["A callback function", "A Promise", "Undefined", "A Generator"],
    correctIndex: 1,
    explanation: "Async functions in ES2017+ always wrap their return value in a resolved `Promise`.",
    topic: "Asynchronous JS"
  },
  {
    id: 4,
    question: "Which DOM method is recommended to select the first matching element using CSS selectors?",
    options: ["document.getElementById()", "document.querySelector()", "document.getElementsByClass()", "document.find()"],
    correctIndex: 1,
    explanation: "`document.querySelector()` accepts any valid CSS selector string and returns the first matching Node.",
    topic: "DOM Manipulation"
  },
  {
    id: 5,
    question: "What is the output of `typeof null` in standard JavaScript?",
    options: ["\"null\"", "\"undefined\"", "\"object\"", "\"boolean\""],
    correctIndex: 2,
    explanation: "Due to a historical legacy artifact in the initial JS implementation, `typeof null` returns `\"object\"`.",
    topic: "Types & Primitives"
  }
];

// 8. GIT — BASIC LEVEL
export const GIT_BASIC_ASSESSMENT: AssessmentQuestion[] = [
  {
    id: 1,
    question: "Which command stages changes from the working directory to prepare them for a commit?",
    options: ["git push", "git add", "git commit", "git checkout"],
    correctIndex: 1,
    explanation: "`git add <path>` moves file modifications from the working directory into the staging index.",
    topic: "Staging & Commits"
  },
  {
    id: 2,
    question: "Which command creates and switches to a new branch in Git simultaneously?",
    options: ["git branch new-feature", "git checkout -b new-feature", "git merge new-feature", "git clone new-feature"],
    correctIndex: 1,
    explanation: "`git checkout -b <name>` (or `git switch -c <name>`) creates a branch and checks it out immediately.",
    topic: "Branch Management"
  },
  {
    id: 3,
    question: "What occurs when two branches modify the same line of code and are merged?",
    options: [
      "Git automatically chooses the newest commit",
      "A merge conflict occurs requiring manual resolution",
      "Git rejects both commits and deletes the branch",
      "The merge is aborted with an unrecoverable disk error"
    ],
    correctIndex: 1,
    explanation: "Git marks the conflicting area with `<<<<<<<` and `>>>>>>>` markers for the developer to resolve.",
    topic: "Merge Conflicts"
  },
  {
    id: 4,
    question: "Which command downloads commits, files, and refs from a remote repository and incorporates them into the current branch?",
    options: ["git push", "git pull", "git fetch", "git init"],
    correctIndex: 1,
    explanation: "`git pull` performs a `git fetch` followed immediately by a `git merge` of the tracked upstream branch.",
    topic: "Remote Repositories"
  },
  {
    id: 5,
    question: "Which file is used in a Git project root to specify deliberately untracked files that Git should ignore?",
    options: [".gitconfig", ".gitignore", ".gitmodules", "README.md"],
    correctIndex: 1,
    explanation: "`.gitignore` defines patterns of files (like `node_modules/` or build artifacts) to exclude from tracking.",
    topic: "Git Configuration"
  }
];

// 9. MS EXCEL — BASIC LEVEL
export const EXCEL_BASIC_ASSESSMENT: AssessmentQuestion[] = [
  {
    id: 1,
    question: "Which modern Excel lookup function replaces both VLOOKUP and HLOOKUP, searching in any direction without column index limits?",
    options: ["INDEX/MATCH", "XLOOKUP", "LOOKUP2", "FINDV"],
    correctIndex: 1,
    explanation: "`XLOOKUP` defaults to exact match and can search left, right, vertically, or horizontally.",
    topic: "Lookup Functions"
  },
  {
    id: 2,
    question: "Which feature in Excel is best suited for aggregating, summarizing, and cross-tabulating thousands of rows of data within seconds?",
    options: ["Goal Seek", "Pivot Table", "Data Validation", "Conditional Formatting"],
    correctIndex: 1,
    explanation: "Pivot Tables provide drag-and-drop multidimensional summarization of large datasets.",
    topic: "Pivot Tables"
  },
  {
    id: 3,
    question: "What symbol is used in Excel formulas to create an absolute cell reference (e.g., locking cell B2 when copied across rows)?",
    options: ["#", "$", "&", "%"],
    correctIndex: 1,
    explanation: "The `$` sign anchors the column and/or row (e.g., `$B$2`) so it remains constant when dragging formulas.",
    topic: "Cell Referencing"
  },
  {
    id: 4,
    question: "Which function counts the number of cells within a range that meet a specific condition?",
    options: ["SUMIF()", "COUNTIF()", "AVERAGEIF()", "LOOKUP()"],
    correctIndex: 1,
    explanation: "`COUNTIF(range, criteria)` tallies cells matching criteria such as `>50` or `\"Delivered\"`.",
    topic: "Statistical Functions"
  },
  {
    id: 5,
    question: "Which Excel data tool restricts user input in a cell to a predefined dropdown list of values?",
    options: ["Conditional Formatting", "Data Validation", "Solver", "Flash Fill"],
    correctIndex: 1,
    explanation: "Data Validation allows authors to enforce rules such as numeric ranges or dropdown lists.",
    topic: "Data Validation"
  }
];

// 10. COMMUNICATION — BASIC LEVEL
export const COMM_BASIC_ASSESSMENT: AssessmentQuestion[] = [
  {
    id: 1,
    question: "What does the STAR technique stand for when answering behavioral and technical interview questions?",
    options: [
      "Strategy, Task, Assessment, Result",
      "Situation, Task, Action, Result",
      "Summary, Theory, Analysis, Review",
      "Stakeholder, Timeline, Agenda, Roadmap"
    ],
    correctIndex: 1,
    explanation: "STAR stands for Situation, Task, Action, and Result — the industry standard framework for competency answers.",
    topic: "Interview Communication"
  },
  {
    id: 2,
    question: "In an Agile sprint standup, which three questions should every team member answer succinctly?",
    options: [
      "What did I complete yesterday? What will I do today? What blockers do I have?",
      "Who caused the bug? When is the deadline? Can I take leave?",
      "What is the client budget? Who is the manager? Which stack is best?",
      "How much code did I write? Who reviewed it? What is my rating?"
    ],
    correctIndex: 0,
    explanation: "Daily standup focuses on yesterday's achievements, today's commitments, and active blockers.",
    topic: "Agile Ceremonies"
  },
  {
    id: 3,
    question: "When composing an urgent professional email to a cross-functional stakeholder, what is the best practice for the subject line?",
    options: [
      "\"Hey please check this\"",
      "\"[URGENT / ACTION REQUIRED] Project Alpha: Production Deployment Approval by 4 PM\"",
      "\"IMPORTANT UPDATE!!!\"",
      "Leave the subject empty so they open it quickly"
    ],
    correctIndex: 1,
    explanation: "Clear prefixes and specific project contexts allow busy stakeholders to prioritize and respond promptly.",
    topic: "Workplace Email Etiquette"
  },
  {
    id: 4,
    question: "What is an essential component of active listening during requirements gathering with non-technical clients?",
    options: [
      "Interrupting immediately with technical jargon",
      "Paraphrasing and summarizing what the client stated to verify mutual understanding",
      "Remaining silent without taking any notes",
      "Dismissing constraints that seem difficult to implement"
    ],
    correctIndex: 1,
    explanation: "Paraphrasing confirms comprehension and uncovers hidden ambiguities early in the development lifecycle.",
    topic: "Active Listening"
  },
  {
    id: 5,
    question: "When presenting a technical engineering project to business executives, what should be emphasized first?",
    options: [
      "Low-level pointer math and compiler optimizations",
      "Business impact, user problem solved, and key performance outcomes",
      "Personal coding setup and IDE plugins",
      "Disagreements between engineering team members"
    ],
    correctIndex: 1,
    explanation: "Business audiences need to understand value, ROI, and outcomes before diving into technical details.",
    topic: "Executive Presentations"
  }
];

// 11. REACT — INTERMEDIATE LEVEL
export const REACT_INT_ASSESSMENT: AssessmentQuestion[] = [
  {
    id: 1,
    question: "What rule governs the execution of React Hooks such as `useState` and `useEffect`?",
    options: [
      "Hooks can be called conditionally inside if statements",
      "Hooks must be called only at the top level of React function components or custom hooks",
      "Hooks can be executed inside regular JavaScript helper utility loops",
      "Hooks must always be initialized in class constructors"
    ],
    correctIndex: 1,
    explanation: "Hooks must run in the exact same order on every render, so they cannot be nested in loops or conditions.",
    topic: "React Hooks"
  },
  {
    id: 2,
    question: "What is the primary function of the cleanup function returned inside a `useEffect` callback?",
    options: [
      "To force the component to re-render immediately",
      "To unsubscribe from subscriptions, clear timers, and prevent memory leaks before unmounting or re-running",
      "To delete component state from browser storage",
      "To trigger parent props validation"
    ],
    correctIndex: 1,
    explanation: "The cleanup function tears down side effects when dependencies change or the component unmounts.",
    topic: "Side Effects (useEffect)"
  },
  {
    id: 3,
    question: "Why does React require a unique `key` prop when rendering dynamic lists of elements?",
    options: [
      "To style list items with CSS pseudo-selectors",
      "To help React's virtual DOM reconciliation algorithm identify which items were added, changed, or removed efficiently",
      "To automatically sort the array alphabetically",
      "To bind click event handlers to DOM nodes"
    ],
    correctIndex: 1,
    explanation: "`key` gives list items a stable identity across renders so React avoids costly re-mounts.",
    topic: "Virtual DOM & Reconciliation"
  },
  {
    id: 4,
    question: "Which hook provides global state access without prop drilling down intermediary component trees?",
    options: ["useMemo", "useContext", "useRef", "useCallback"],
    correctIndex: 1,
    explanation: "`useContext` subscribes a component to a React Context Provider's value without passing props explicitly.",
    topic: "Context API"
  },
  {
    id: 5,
    question: "What is the primary purpose of the `useCallback` hook in React?",
    options: [
      "To memoize expensive mathematical calculation results",
      "To return a memoized version of a callback function that only changes when its dependencies change",
      "To run asynchronous background network requests",
      "To manipulate direct DOM nodes"
    ],
    correctIndex: 1,
    explanation: "`useCallback(fn, deps)` prevents unnecessary re-creations of function instances passed to memoized child components.",
    topic: "Performance Optimization"
  }
];

// 12. NODE.JS — INTERMEDIATE LEVEL
export const NODE_INT_ASSESSMENT: AssessmentQuestion[] = [
  {
    id: 1,
    question: "How does the Node.js runtime handle concurrent I/O operations despite being single-threaded in user code?",
    options: [
      "By spawning a new operating system thread for every HTTP request",
      "Through the Event Loop and libuv thread pool for asynchronous non-blocking I/O",
      "By compiling JavaScript directly to C++ binaries at launch",
      "By executing multiple Node processes on a single port automatically"
    ],
    correctIndex: 1,
    explanation: "Node.js relies on an event loop backed by libuv to offload file, network, and DNS I/O to background OS threads.",
    topic: "Event Loop & Architecture"
  },
  {
    id: 2,
    question: "In Express.js, what signature must a middleware function have to intercept incoming requests and pass control to the next handler?",
    options: [
      "(req, res) => {}",
      "(req, res, next) => {}",
      "(app, router) => {}",
      "(err, res) => {}"
    ],
    correctIndex: 1,
    explanation: "Standard Express middleware accepts `(req, res, next)` and invokes `next()` to continue the pipeline.",
    topic: "Express Middleware"
  },
  {
    id: 3,
    question: "What standard HTTP status code should be returned when a resource is successfully created via a POST request?",
    options: ["200 OK", "201 Created", "204 No Content", "301 Moved Permanently"],
    correctIndex: 1,
    explanation: "`201 Created` indicates the request succeeded and led to the creation of a new resource on the server.",
    topic: "HTTP Status Codes"
  },
  {
    id: 4,
    question: "How should passwords always be stored in a backend database?",
    options: [
      "In plaintext for easy support lookup",
      "Base64 encoded strings",
      "Hashed using a cryptographic slow hash algorithm like bcrypt or argon2 with a unique salt",
      "Symmetric AES encryption with the key stored in the same database table"
    ],
    correctIndex: 2,
    explanation: "Salted cryptographic hashes like bcrypt defend against rainbow table and dictionary attacks.",
    topic: "Security & Auth"
  },
  {
    id: 5,
    question: "What is the purpose of JWT (JSON Web Token) in stateless REST authentication?",
    options: [
      "To store session data in memory on the backend server",
      "To securely transmit digitally signed claims between client and server without server-side session lookup",
      "To encrypt all database tables",
      "To cache static images on CDNs"
    ],
    correctIndex: 1,
    explanation: "JWTs are digitally signed JSON payloads verified statelessly on each request by the backend.",
    topic: "JWT Authentication"
  }
];

// 13. DSA — INTERMEDIATE LEVEL
export const DSA_INT_ASSESSMENT: AssessmentQuestion[] = [
  {
    id: 1,
    question: "What is the worst-case time complexity of searching an element in a balanced Binary Search Tree (BST) with N nodes?",
    options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
    correctIndex: 1,
    explanation: "In a balanced BST, each comparison halves the search space, yielding O(log N) time.",
    topic: "Tree Structures"
  },
  {
    id: 2,
    question: "Which data structure operates on a Last-In, First-Out (LIFO) principle and is commonly used for function call stacks?",
    options: ["Queue", "Stack", "Priority Queue", "Deque"],
    correctIndex: 1,
    explanation: "A Stack pushes and pops items from the top, adhering to the LIFO discipline.",
    topic: "Stacks & Queues"
  },
  {
    id: 3,
    question: "Which graph traversal algorithm uses a Queue and visits nodes level by level?",
    options: ["Depth First Search (DFS)", "Breadth First Search (BFS)", "Dijkstra's Algorithm", "Kruskal's Algorithm"],
    correctIndex: 1,
    explanation: "BFS explores neighboring vertices using a FIFO queue to guarantee shortest path in unweighted graphs.",
    topic: "Graph Traversals"
  },
  {
    id: 4,
    question: "What distinguishes Dynamic Programming from basic Divide-and-Conquer algorithms?",
    options: [
      "DP only works on sorted arrays",
      "DP solves overlapping subproblems by storing already computed answers (memoization/tabulation)",
      "DP always uses exponential space",
      "DP does not use recursion"
    ],
    correctIndex: 1,
    explanation: "Dynamic programming applies to problems with optimal substructure and overlapping subproblems.",
    topic: "Dynamic Programming"
  },
  {
    id: 5,
    question: "What is the average time complexity of Quick Sort on an array of size N?",
    options: ["O(N)", "O(N log N)", "O(N^2)", "O(log N)"],
    correctIndex: 1,
    explanation: "Quick Sort partitions the array around a pivot, achieving O(N log N) on average.",
    topic: "Sorting Algorithms"
  }
];

// 14. POWER BI — INTERMEDIATE LEVEL
export const POWERBI_INT_ASSESSMENT: AssessmentQuestion[] = [
  {
    id: 1,
    question: "In Power BI, what engine is responsible for data ingestion, cleansing, and ETL transformations before loading into the model?",
    options: ["DAX Engine", "Power Query (M Language)", "Power Automate", "VertiPaq Analytics"],
    correctIndex: 1,
    explanation: "Power Query extracts, cleanses, and shapes data using the M programming language.",
    topic: "Power Query ETL"
  },
  {
    id: 2,
    question: "What is the key difference between a DAX Calculated Column and a DAX Measure?",
    options: [
      "Calculated columns are computed row-by-row at data refresh and stored in memory; measures are calculated on-the-fly based on report filter context",
      "Measures consume more disk space than calculated columns",
      "Calculated columns can only be numeric, while measures are text",
      "Measures cannot be used in chart visuals"
    ],
    correctIndex: 0,
    explanation: "Measures dynamically aggregate data according to user filter contexts and take zero table storage space.",
    topic: "DAX Measures"
  },
  {
    id: 3,
    question: "Which DAX function is the most fundamental for altering the evaluation filter context of an expression?",
    options: ["SUM()", "CALCULATE()", "FILTER()", "RELATED()"],
    correctIndex: 1,
    explanation: "`CALCULATE(expression, filter1, filter2)` modifies the existing filter context before evaluating an expression.",
    topic: "DAX Functions"
  },
  {
    id: 4,
    question: "Which database schema architecture is the recognized industry best practice for dimensional modeling in Power BI?",
    options: ["Snowflake Schema with deep normalization", "Star Schema (Fact tables linked to Dimension tables)", "Single flat 150-column denormalized table", "Hierarchical network model"],
    correctIndex: 1,
    explanation: "Star schemas optimize the VertiPaq compression engine and offer intuitive relationship navigation.",
    topic: "Data Modeling"
  },
  {
    id: 5,
    question: "Which feature allows report viewers to click a summary item and navigate to a detailed view filtered by that selection?",
    options: ["Drillthrough", "Bookmarks", "Q&A Visual", "Decomposition Tree"],
    correctIndex: 0,
    explanation: "Drillthrough allows users to transition between macro-level summary reports and granular detail pages.",
    topic: "Interactive Visuals"
  }
];

// 15. DATA ANALYTICS — INTERMEDIATE LEVEL
export const DATA_ANALYTICS_INT_ASSESSMENT: AssessmentQuestion[] = [
  {
    id: 1,
    question: "Which Python data science library provides the `DataFrame` structure for tabular manipulation and analysis?",
    options: ["NumPy", "Pandas", "Matplotlib", "Scipy"],
    correctIndex: 1,
    explanation: "Pandas is the core library for labeled rectangular datasets (Series and DataFrame).",
    topic: "Pandas Foundations"
  },
  {
    id: 2,
    question: "What does the Pearson correlation coefficient value of -0.87 between two continuous variables indicate?",
    options: [
      "No relationship between variables",
      "A strong negative linear correlation (as one increases, the other decreases)",
      "A strong positive relationship",
      "The variables are identical"
    ],
    correctIndex: 1,
    explanation: "Values close to -1 indicate a strong inverse linear relationship.",
    topic: "Statistical Analysis"
  },
  {
    id: 3,
    question: "Which statistical visualization is best suited for assessing data skewness and identifying potential outliers across quartiles?",
    options: ["Pie chart", "Box plot (Box-and-Whisker)", "Line chart", "Donut chart"],
    correctIndex: 1,
    explanation: "Box plots display median, IQR (Q1-Q3), whiskers, and isolated outlier points.",
    topic: "Data Visualization"
  },
  {
    id: 4,
    question: "In statistical hypothesis testing, what does a p-value less than 0.05 typically signify?",
    options: [
      "The null hypothesis is definitely true",
      "Statistically significant evidence to reject the null hypothesis at the 5% significance level",
      "The sample size was too small",
      "No further data analysis is possible"
    ],
    correctIndex: 1,
    explanation: "A p-value < 0.05 indicates the observed data is unlikely under the null hypothesis, supporting rejection.",
    topic: "Hypothesis Testing"
  },
  {
    id: 5,
    question: "Which method in Pandas handles missing values by substituting them with a calculated mean or constant?",
    options: ["df.dropna()", "df.fillna()", "df.replace_null()", "df.impute()"],
    correctIndex: 1,
    explanation: "`df.fillna(value)` fills missing `NaN` entries with a specified value or statistic.",
    topic: "Data Cleaning"
  }
];

// 16. REST APIS — INTERMEDIATE LEVEL
export const REST_APIS_INT_ASSESSMENT: AssessmentQuestion[] = [
  {
    id: 1,
    question: "What does idempotency mean in the context of RESTful HTTP methods?",
    options: [
      "The method executes faster than other methods",
      "Making multiple identical requests produces the exact same server state as making a single request",
      "The method requires API key authentication",
      "The request body must be encoded as XML"
    ],
    correctIndex: 1,
    explanation: "Methods like GET, PUT, and DELETE are idempotent because repeating them results in the same outcome.",
    topic: "HTTP Idempotency"
  },
  {
    id: 2,
    question: "Which HTTP status code signifies that the client is not authenticated (missing or invalid credentials)?",
    options: ["400 Bad Request", "401 Unauthorized", "403 Forbidden", "404 Not Found"],
    correctIndex: 1,
    explanation: "`401 Unauthorized` means the request lacks valid authentication credentials.",
    topic: "Status Codes"
  },
  {
    id: 3,
    question: "What is the industry-standard specification format for documenting, describing, and generating interactive REST API clients?",
    options: ["OpenAPI (Swagger)", "WSDL", "SOAP Schema", "GraphQL Schema"],
    correctIndex: 0,
    explanation: "OpenAPI Specification (OAS) defines a standard, language-agnostic interface for REST APIs.",
    topic: "API Documentation"
  },
  {
    id: 4,
    question: "Which HTTP header is standard for transmitting a Bearer Token for authorization?",
    options: ["Content-Type", "Authorization", "X-Token", "Accept"],
    correctIndex: 1,
    explanation: "`Authorization: Bearer <jwt_token>` is the RFC 6750 standard header for bearer tokens.",
    topic: "API Security"
  },
  {
    id: 5,
    question: "What HTTP method should be chosen to apply partial updates to a resource rather than replacing the entire entity?",
    options: ["PUT", "PATCH", "POST", "UPDATE"],
    correctIndex: 1,
    explanation: "`PATCH` applies partial modifications to a resource, whereas `PUT` replaces the resource representation entirely.",
    topic: "HTTP Methods"
  }
];

// 17. SAP — ADVANCED LEVEL
export const SAP_ADV_ASSESSMENT: AssessmentQuestion[] = [
  {
    id: 1,
    question: "What is the primary architectural advancement of SAP S/4HANA over legacy SAP ECC systems?",
    options: [
      "It requires on-premise tape backup drives",
      "It runs exclusively on the SAP HANA in-memory relational columnar database, eliminating aggregated tables",
      "It replaces ABAP entirely with Python",
      "It eliminates the financial accounting module"
    ],
    correctIndex: 1,
    explanation: "SAP S/4HANA uses in-memory columnar computing to deliver real-time processing and simplified table models.",
    topic: "S/4HANA Architecture"
  },
  {
    id: 2,
    question: "Which core SAP module handles sales quotations, customer billing, and delivery processing?",
    options: ["MM (Materials Management)", "SD (Sales & Distribution)", "FICO (Finance & Controlling)", "PP (Production Planning)"],
    correctIndex: 1,
    explanation: "SAP SD manages sales transactions, shipping, billing, and credit management.",
    topic: "Enterprise Modules"
  },
  {
    id: 3,
    question: "What is the primary role of the SAP ABAP Data Dictionary (Transaction SE11)?",
    options: [
      "To configure network firewall ports",
      "To centrally define and manage database tables, structures, views, data elements, and domains",
      "To monitor student login credentials",
      "To design printable marketing brochures"
    ],
    correctIndex: 1,
    explanation: "The ABAP Dictionary (SE11) defines metadata and database objects independently of the underlying SQL database.",
    topic: "ABAP Data Dictionary"
  },
  {
    id: 4,
    question: "What modern user interface standard has SAP adopted to replace the traditional SAP GUI desktop client?",
    options: ["SAP Fiori (based on SAPUI5 / OpenUI5)", "Java Swing", "Windows Presentation Foundation", "Silverlight"],
    correctIndex: 0,
    explanation: "SAP Fiori provides a role-based, responsive HTML5 user experience across desktops, tablets, and phones.",
    topic: "SAP Fiori"
  },
  {
    id: 5,
    question: "In SAP enterprise integration, what protocol is standard for exposing modern S/4HANA CDS views to cloud applications?",
    options: ["OData (REST-based protocol)", "FTP", "Telnet", "SMTP"],
    correctIndex: 0,
    explanation: "SAP utilizes OData services (Open Data Protocol) to integrate S/4HANA core business data with web and mobile clients.",
    topic: "Enterprise Integration"
  }
];

// 18. AWS — ADVANCED LEVEL
export const AWS_ADV_ASSESSMENT: AssessmentQuestion[] = [
  {
    id: 1,
    question: "According to the AWS Shared Responsibility Model, which responsibility belongs to the customer when using Amazon EC2?",
    options: [
      "Physical data center perimeter security",
      "Guest operating system patching, application software updates, and security group firewall rules",
      "Decommissioning failing physical server hardware racks",
      "Managing virtualization hypervisor patches"
    ],
    correctIndex: 1,
    explanation: "AWS secures the cloud infrastructure; customers must manage OS patches, firewalls, and application configurations on IaaS.",
    topic: "Shared Responsibility"
  },
  {
    id: 2,
    question: "Which AWS service enables serverless execution of code triggered by events without provisioning or managing virtual machines?",
    options: ["Amazon EC2", "AWS Lambda", "Amazon ECS", "AWS Elastic Beanstalk"],
    correctIndex: 1,
    explanation: "AWS Lambda runs functions in response to events (S3 uploads, API calls) with automated horizontal scaling.",
    topic: "Serverless Compute"
  },
  {
    id: 3,
    question: "In Amazon Virtual Private Cloud (VPC), what networking component enables instances in a public subnet to communicate with the internet?",
    options: ["NAT Instance", "Internet Gateway (IGW)", "VPC Peering", "Transit Gateway"],
    correctIndex: 1,
    explanation: "An Internet Gateway attaches to a VPC to enable two-way communication between public subnets and the internet.",
    topic: "VPC Networking"
  },
  {
    id: 4,
    question: "Which AWS storage class is best suited for infrequently accessed archive data that can tolerate retrieval times of several hours at minimum cost?",
    options: ["S3 Standard", "S3 Glacier Flexible or Deep Archive", "S3 One Zone-IA", "Amazon EBS gp3"],
    correctIndex: 1,
    explanation: "Amazon S3 Glacier Deep Archive offers the lowest cost cloud storage for long-term compliance retention.",
    topic: "S3 Object Storage"
  },
  {
    id: 5,
    question: "What AWS service collects metrics, monitors log files, and triggers automated alarm notifications for infrastructure health?",
    options: ["Amazon CloudWatch", "AWS CloudTrail", "AWS Config", "Amazon Inspector"],
    correctIndex: 0,
    explanation: "Amazon CloudWatch monitors telemetry metrics and triggers alarms, while CloudTrail records API audit logs.",
    topic: "Monitoring & Observability"
  }
];

// 19. AZURE — ADVANCED LEVEL
export const AZURE_ADV_ASSESSMENT: AssessmentQuestion[] = [
  {
    id: 1,
    question: "What is the primary cloud identity and access management service in the Microsoft ecosystem?",
    options: ["Microsoft Active Directory Domain Services (on-prem only)", "Microsoft Entra ID (formerly Azure Active Directory)", "Azure Key Vault", "Azure Sentinel"],
    correctIndex: 1,
    explanation: "Microsoft Entra ID is the multi-tenant cloud identity provider for Azure, Microsoft 365, and enterprise SaaS apps.",
    topic: "Identity & Entra ID"
  },
  {
    id: 2,
    question: "Which Azure service provides a fully managed platform as a service (PaaS) for hosting web apps and REST APIs without infrastructure maintenance?",
    options: ["Azure Virtual Machines", "Azure App Service", "Azure Bastion", "Azure Dedicated Host"],
    correctIndex: 1,
    explanation: "Azure App Service allows developers to build and host web apps and APIs with automated scaling and patching.",
    topic: "App Services"
  },
  {
    id: 3,
    question: "Which Azure storage redundancy option replicates data synchronously three times within a single physical location in the primary region?",
    options: ["Locally Redundant Storage (LRS)", "Zone-Redundant Storage (ZRS)", "Geo-Redundant Storage (GRS)", "Read-Access Geo-Redundant (RA-GRS)"],
    correctIndex: 0,
    explanation: "LRS replicates data three times within a single physical data center in the primary region.",
    topic: "Azure Storage"
  },
  {
    id: 4,
    question: "In Azure Virtual Networks (VNets), what resource filters network traffic to and from Azure resources in a virtual network subnet?",
    options: ["Application Gateway", "Network Security Group (NSG)", "Azure ExpressRoute", "Traffic Manager"],
    correctIndex: 1,
    explanation: "An NSG contains security rules that allow or deny inbound/outbound network traffic by IP, port, and protocol.",
    topic: "Networking & NSG"
  },
  {
    id: 5,
    question: "What service in Microsoft Azure provides serverless event-driven compute similar to AWS Lambda?",
    options: ["Azure Functions", "Azure Batch", "Azure Spring Apps", "Azure Service Bus"],
    correctIndex: 0,
    explanation: "Azure Functions executes event-driven code blocks with on-demand scalability.",
    topic: "Serverless Compute"
  }
];

// 20. DEVOPS — ADVANCED LEVEL
export const DEVOPS_ADV_ASSESSMENT: AssessmentQuestion[] = [
  {
    id: 1,
    question: "What is the primary operational benefit of multi-stage builds in a Dockerfile?",
    options: [
      "Allowing the container to run without an operating system kernel",
      "Separating build dependencies from runtime binaries to drastically reduce production container image size and security attack surface",
      "Enabling the container to run on multiple CPU architectures without recompilation",
      "Automatically pushing images to Docker Hub"
    ],
    correctIndex: 1,
    explanation: "Multi-stage builds leave compiler toolchains behind, packaging only the minimal production artifacts.",
    topic: "Docker Containers"
  },
  {
    id: 2,
    question: "In CI/CD automation, what is the key distinction between Continuous Delivery and Continuous Deployment?",
    options: [
      "Continuous Delivery requires manual approval before release to production; Continuous Deployment deploys automatically upon passing tests",
      "Continuous Delivery only compiles code; Deployment does unit testing",
      "Continuous Deployment is only for mobile applications",
      "There is no difference"
    ],
    correctIndex: 0,
    explanation: "Continuous Delivery stops before production for manual approval; Continuous Deployment pushes directly to live environments.",
    topic: "CI/CD Pipelines"
  },
  {
    id: 3,
    question: "Which Infrastructure as Code (IaC) tool uses declarative configuration files written in HCL (HashiCorp Configuration Language)?",
    options: ["Ansible", "Terraform", "Puppet", "Chef"],
    correctIndex: 1,
    explanation: "Terraform provisions multi-cloud infrastructure declaratively using state files and provider plugins.",
    topic: "Infrastructure as Code"
  },
  {
    id: 4,
    question: "In a GitHub Actions workflow YAML file, what keyword defines the list of commands executed inside a specific job step?",
    options: ["commands", "run", "exec", "actions"],
    correctIndex: 1,
    explanation: "The `run:` keyword specifies shell commands executed within that step in the runner.",
    topic: "GitHub Actions"
  },
  {
    id: 5,
    question: "What role does Docker Compose serve in modern developer workflows?",
    options: [
      "Deploying Kubernetes clusters across global datacenters",
      "Defining and running multi-container Docker applications locally using a single YAML configuration file",
      "Compiling C++ code to WebAssembly",
      "Monitoring cloud server CPU temperature"
    ],
    correctIndex: 1,
    explanation: "Docker Compose provisions multi-container environments (e.g., app, database, Redis) via `docker-compose.yml`.",
    topic: "Docker Compose"
  }
];

// 21. MACHINE LEARNING — ADVANCED LEVEL
export const ML_ADV_ASSESSMENT: AssessmentQuestion[] = [
  {
    id: 1,
    question: "In supervised learning, what metric is most appropriate for evaluating a classification model on an imbalanced dataset (e.g., fraud detection where 99.5% of cases are negative)?",
    options: ["Accuracy", "F1-Score / Precision-Recall AUC", "Mean Absolute Error", "R-squared"],
    correctIndex: 1,
    explanation: "Accuracy is misleading with extreme class imbalance; F1-score balances precision and recall for the positive minority class.",
    topic: "Evaluation Metrics"
  },
  {
    id: 2,
    question: "What phenomenon occurs when a machine learning model fits training data noise too closely and performs poorly on unseen test data?",
    options: ["Underfitting", "Overfitting", "Gradient descent", "Data imputation"],
    correctIndex: 1,
    explanation: "Overfitting occurs when high model variance captures idiosyncratic training noise instead of generalizable patterns.",
    topic: "Model Generalization"
  },
  {
    id: 3,
    question: "Which unsupervised learning algorithm groups unlabeled data points into K distinct clusters by iteratively updating centroids?",
    options: ["Linear Regression", "K-Means Clustering", "Random Forest", "Support Vector Machines"],
    correctIndex: 1,
    explanation: "K-Means iteratively computes cluster centroids and assigns data points based on Euclidean distance.",
    topic: "Unsupervised Clustering"
  },
  {
    id: 4,
    question: "Why is feature scaling (e.g., StandardScaler or MinMaxScaler) critical for distance-based algorithms like KNN, SVM, and Gradient Descent?",
    options: [
      "It converts categorical variables into numerical tokens",
      "It prevents features with large numeric scales from disproportionately dominating distance metrics and objective function gradients",
      "It eliminates missing values automatically",
      "It prevents underfitting in decision trees"
    ],
    correctIndex: 1,
    explanation: "Distance calculations and gradient steps are distorted if one feature has an order of magnitude larger variance than others.",
    topic: "Feature Engineering"
  },
  {
    id: 5,
    question: "Which ensemble machine learning method trains multiple decision trees in sequence, where each new tree corrects the residual errors of preceding trees?",
    options: ["Bagging", "Gradient Boosting (e.g., XGBoost, LightGBM)", "K-Fold Cross Validation", "Principal Component Analysis"],
    correctIndex: 1,
    explanation: "Gradient Boosting iteratively builds trees sequentially to minimize the loss gradient of previous models.",
    topic: "Ensemble Methods"
  }
];
