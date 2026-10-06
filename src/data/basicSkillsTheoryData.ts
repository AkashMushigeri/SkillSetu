import { SkillItem } from './skillsData';
import {
  SkillTheoryNote,
  TheoryCoreConcept,
  TheoryTerminology,
  TheorySyntaxSection,
  TheoryWorkflowStep,
  TheoryExample,
  TheoryCommonMistake,
} from '@/types/theory';

/**
 * Curated deep-dive theoretical notes for major Basic Skills.
 * Each entry covers all 10 core requirements:
 * 1. What is [Skill]?
 * 2. Why is it important?
 * 3. Core concepts
 * 4. Important terminology
 * 5. Syntax / structure where applicable
 * 6. How it works
 * 7. Simple examples
 * 8. Real-world applications
 * 9. Common mistakes
 * 10. Key points to remember
 */
const CURATED_THEORY_NOTES: Record<string, Partial<SkillTheoryNote>> = {
  'c-basic': {
    coreTopics: [
      'Compilation Pipeline (GCC)',
      'Data Types & Memory Sizes',
      'Pointers & Memory Addressing',
      'Dynamic Allocation (malloc/free)',
      'Structs, Unions & File I/O',
    ],
    whatIs:
      'C is a foundational, statically-typed, procedural programming language developed by Dennis Ritchie at Bell Labs in 1972. It provides low-level memory access and maps directly to hardware assembly instructions while maintaining structured programming abstractions.',
    whyImportant:
      'C serves as the parent of modern languages (C++, Java, C#, JavaScript). Operating systems (Linux, Windows, macOS kernels), database engines (PostgreSQL, MySQL), embedded microcontrollers, and graphics engines are predominantly written in C due to zero runtime overhead and deterministic memory control.',
    coreConcepts: [
      {
        title: 'Compilation Pipeline',
        description:
          'Source code (.c) passes through 4 distinct phases: Preprocessor (macro expansion, #include) → Compiler (assembly code) → Assembler (machine code .o) → Linker (resolves library dependencies to produce executable).',
      },
      {
        title: 'Memory Segments',
        description:
          'A C program’s memory is divided into: Text/Code segment (read-only binary), Data segment (initialized globals), BSS segment (uninitialized globals), Heap (dynamic memory managed by programmer), and Stack (local variables, function call frames).',
      },
      {
        title: 'Pointers & Dereferencing',
        description:
          'A pointer is a variable that holds the memory address of another variable. The `&` operator retrieves addresses, and the `*` operator accesses the value at that address. Pointers enable efficient passing by reference and dynamic structures.',
      },
      {
        title: 'Dynamic Memory Allocation',
        description:
          'Allocating heap memory using `malloc()` (uninitialized bytes), `calloc()` (zero-initialized contiguous blocks), `realloc()` (resizing buffers), and deallocating with `free()` to prevent memory leaks.',
      },
      {
        title: 'Structures & Unions',
        description:
          'Structs group heterogeneous data types into a single unit where each member has its own memory. Unions share the same memory location among all members, occupying space equal to the largest member.',
      },
    ],
    importantTerminology: [
      { term: 'Pointer', definition: 'A variable holding the hexadecimal memory address of another data element.' },
      { term: 'Segmentation Fault', definition: 'A hardware-triggered runtime fault caused by accessing unauthorized memory (e.g., dereferencing NULL or out-of-bounds pointer).' },
      { term: 'Memory Leak', definition: 'Failure to deallocate heap memory via free(), causing cumulative RAM consumption until system depletion.' },
      { term: 'Header File (.h)', definition: 'A declarations file containing function prototypes, macros, and typedefs shared across compilation units.' },
      { term: 'Macro (#define)', definition: 'A preprocessor directive that performs textual token substitution prior to actual code compilation.' },
      { term: 'Buffer Overflow', definition: 'Writing data beyond the boundaries of an allocated array, corrupting adjacent stack memory.' },
    ],
    syntaxStructure: {
      title: 'Program Skeleton & Control Flow',
      explanation: 'Every executable C program requires a `main()` entry point function returning an integer exit status code (0 for success).',
      language: 'c',
      codeSnippet: `#include <stdio.h>
#include <stdlib.h>

// Struct definition
typedef struct {
    int id;
    char grade;
} Student;

int main(void) {
    // 1. Primitive variables
    int count = 10;
    
    // 2. Pointer declaration and dereferencing
    int *ptr = &count;
    *ptr = 25; // Directly modifies 'count' in memory
    
    // 3. Dynamic Heap Allocation
    Student *s = (Student *)malloc(sizeof(Student));
    if (s == NULL) {
        perror("Allocation failed");
        return 1;
    }
    s->id = 101;
    s->grade = 'A';
    
    printf("Student ID: %d, Value: %d\\n", s->id, count);
    
    // 4. Memory Cleanup
    free(s);
    s = NULL; // Prevent dangling pointer
    return 0;
}`,
    },
    howItWorks: [
      { step: 1, title: 'Preprocessing', description: 'Replaces #include headers and expands #define constants into a pure C translation unit.' },
      { step: 2, title: 'Assembly Translation', description: 'Translates high-level procedural syntax into target architecture assembly mnemonics (x86-64 / ARM).' },
      { step: 3, title: 'Machine Code Object Generation', description: 'Converts assembly to relocatable binary machine instructions stored in .o / .obj files.' },
      { step: 4, title: 'Linking & Binary Creation', description: 'Combines object code with system C runtime libraries (libc) to build the final executable file.' },
    ],
    simpleExamples: [
      {
        title: 'Pass-by-Reference with Pointers',
        description: 'Swapping two integer values in memory without relying on global variables.',
        language: 'c',
        codeOrDiagram: `void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main() {
    int x = 5, y = 10;
    swap(&x, &y);
    printf("x=%d, y=%d\\n", x, y); // Output: x=10, y=5
    return 0;
}`,
        outputExplanation: 'Passing the addresses &x and &y allows the swap function to mutate the original stack variables directly.',
      },
    ],
    realWorldApplications: [
      'Linux Kernel & Device Drivers: Direct registers & memory access for hardware interfacing.',
      'PostgreSQL & SQLite: Embedded database engines requiring microsecond transaction performance.',
      'Game Engines & Physics Simulators: Real-time calculation loops with zero garbage collection pauses.',
      'Embedded IoT Firmware: Automotive ECUs, medical monitors, and consumer microcontrollers with <64KB RAM.',
    ],
    commonMistakes: [
      {
        mistake: 'Using uninitialized pointers (Wild Pointers)',
        whyWrong: 'Points to arbitrary, unpredictable RAM locations; dereferencing crashes the app or corrupts memory.',
        correctApproach: 'Always initialize pointers to NULL or an explicit valid memory address upon declaration.',
      },
      {
        mistake: 'Dangling Pointers after free()',
        whyWrong: 'Accessing memory after releasing it with free() results in undefined behavior or security exploits.',
        correctApproach: 'Set pointer = NULL immediately following free(pointer);.',
      },
      {
        mistake: 'Using unsafe string functions (gets, strcpy)',
        whyWrong: 'Does not check target buffer capacity, enabling classic buffer overflow vulnerabilities.',
        correctApproach: 'Use bounded safety alternatives like fgets(), strncpy(), or snprintf().',
      },
    ],
    keyPointsToRemember: [
      'Arrays decay to pointers when passed to functions; array size must be passed explicitly.',
      'Stack allocation is fast and automatic; Heap allocation requires explicit manual free() cleanup.',
      'Strings in C are null-terminated character arrays ending with the "\\0" sentinel byte.',
      'sizeof() is a compile-time operator, not a runtime function call.',
      'Volatile keyword instructs the compiler not to optimize memory reads for hardware-mapped variables.',
    ],
  },

  'python-basic': {
    coreTopics: [
      'Interpreted Execution & Syntax',
      'Dynamic Typing & Mutability',
      'Collections (Lists, Tuples, Dicts)',
      'Functions, *args & **kwargs',
      'List Comprehensions & File I/O',
    ],
    whatIs:
      'Python is an interpreted, high-level, dynamically-typed programming language created by Guido van Rossum in 1991. Emphasizing code readability through significant whitespace indentation, Python supports object-oriented, functional, and procedural paradigms.',
    whyImportant:
      'Python is the undisputed global standard for Artificial Intelligence, Machine Learning, Data Science, and rapid backend web engineering. Its massive standard library ("batteries included") and active package ecosystem (PyPI) enable engineers to build production solutions with minimal boilerplate.',
    coreConcepts: [
      {
        title: 'Interpreted Bytecode Execution',
        description:
          'Python source code (.py) is compiled into platform-independent bytecode (.pyc) and executed by the Python Virtual Machine (CPython) line-by-line.',
      },
      {
        title: 'Mutable vs Immutable Data Types',
        description:
          'Numbers, strings, and tuples are immutable (cannot be modified in-place; reassignments allocate new objects). Lists, dictionaries, and sets are mutable (mutations occur in-place without changing memory ID).',
      },
      {
        title: 'First-Class Functions',
        description:
          'Functions in Python are first-class citizens: they can be assigned to variables, passed as arguments to other functions, and returned from functions.',
      },
      {
        title: 'Comprehensions & Generators',
        description:
          'Syntactic constructs for concise mapping, filtering, and lazy evaluation of iterables using `[x for x in iterable if condition]`.',
      },
      {
        title: 'Exception Handling (try-except-finally)',
        description:
          'Graceful handling of runtime anomalies using structured exception blocks with optional `else` and `finally` cleanup guarantees.',
      },
    ],
    importantTerminology: [
      { term: 'CPython', definition: 'The reference implementation of Python written in C that interprets bytecode.' },
      { term: 'GIL (Global Interpreter Lock)', definition: 'A mutex in CPython that prevents multiple native threads from executing Python bytecodes simultaneously.' },
      { term: 'Duck Typing', definition: '"If it walks like a duck and quacks like a duck, it’s a duck" — type checking deferred to runtime method availability rather than inheritance.' },
      { term: 'PEP 8', definition: 'The official style guide for writing standardized, readable Python code.' },
      { term: 'Virtual Environment (venv)', definition: 'An isolated runtime directory that keeps project package dependencies separate from system-wide Python.' },
      { term: 'Dunder Methods', definition: 'Double-underscore magic methods like __init__, __str__, and __len__ that define class behaviors.' },
    ],
    syntaxStructure: {
      title: 'Python Idiomatic Syntax & Functions',
      explanation: 'Python uses 4-space indentation for code block scoping rather than curly braces {}.',
      language: 'python',
      codeSnippet: `# 1. List Comprehension with filtering
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
even_squares = [n ** 2 for n in numbers if n % 2 == 0]

# 2. Dictionary with type safety & unpacking
user_record = {
    "username": "aarav_cse",
    "role": "engineer",
    "score": 94.5
}

# 3. Clean function definition with default arguments
def calculate_grade(score: float, bonus: float = 0.0) -> str:
    total = score + bonus
    if total >= 90:
        return "Distinction"
    elif total >= 75:
        return "First Class"
    else:
        return "Pass"

# 4. Context manager for automatic file closure
with open("report.txt", "w") as f:
    f.write(f"Grade: {calculate_grade(user_record['score'])}\\n")`,
    },
    howItWorks: [
      { step: 1, title: 'Lexical Analysis & Parsing', description: 'Source code is parsed into an Abstract Syntax Tree (AST).' },
      { step: 2, title: 'Bytecode Compilation', description: 'AST is compiled into .pyc bytecode instructions (stored in __pycache__).' },
      { step: 3, title: 'PVM Execution', description: 'The Python Virtual Machine reads bytecode instructions and translates them to host OS operations.' },
      { step: 4, title: 'Garbage Collection', description: 'Automatic memory management using reference counting augmented by cyclic garbage collector.' },
    ],
    simpleExamples: [
      {
        title: 'Dictionary Manipulation & Aggregation',
        description: 'Counting word frequency in a sentence using dict comprehension.',
        language: 'python',
        codeOrDiagram: `text = "python python data code data"
words = text.split()

# Frequency map using dictionary get() with default 0
counts = {}
for w in words:
    counts[w] = counts.get(w, 0) + 1

print(counts) # {'python': 2, 'data': 2, 'code': 1}`,
        outputExplanation: 'The get() method avoids KeyError exceptions by returning 0 if the word key does not exist yet.',
      },
    ],
    realWorldApplications: [
      'Machine Learning & AI: PyTorch, TensorFlow, Hugging Face, Scikit-Learn pipelines.',
      'Backend Web Frameworks: FastAPI, Django, Flask powering scalable RESTful APIs.',
      'Data Analytics & Automation: Pandas, NumPy, Jupyter for ETL and financial quantitative modeling.',
      'DevOps & Cloud Scripting: Ansible, AWS Lambda serverless functions, orchestration scripts.',
    ],
    commonMistakes: [
      {
        mistake: 'Using mutable default arguments in functions (def add(item, lst=[]):)',
        whyWrong: 'The default list is instantiated once at function definition time; calls without arguments share the exact same list!',
        correctApproach: 'Use `def add(item, lst=None):` and initialize `if lst is None: lst = []` inside the function body.',
      },
      {
        mistake: 'Modifying a list while iterating over it',
        whyWrong: 'Shifts list indices dynamically, causing skipped elements or unexpected omissions.',
        correctApproach: 'Iterate over a shallow copy (`for item in lst[:]:`) or construct a filtered list comprehension.',
      },
      {
        mistake: 'Using "==" instead of "is" for None checks',
        whyWrong: '"==" checks equality by calling __eq__ which can be overridden; "is" checks exact memory identity.',
        correctApproach: 'Always use `if var is None:` or `if var is not None:`.',
      },
    ],
    keyPointsToRemember: [
      'Python variables are object references, not memory storage buckets.',
      'Lists are O(1) append but O(n) insert/delete at beginning; use collections.deque for FIFO queues.',
      'Dictionaries are O(1) average lookup due to underlying hash table implementation.',
      'Tuples can be used as dictionary keys because they are immutable and hashable; lists cannot.',
      'Use generators (`yield`) for processing multi-gigabyte datasets without exhausting system memory.',
    ],
  },

  'java-basic': {
    coreTopics: [
      'JVM Architecture (JDK, JRE, JVM)',
      'Strong Static Typing & Classes',
      'OOP 4 Pillars (Encapsulation, Inheritance, etc.)',
      'Memory Management (Heap, Stack, GC)',
      'Collections Framework (List, Set, Map)',
    ],
    whatIs:
      'Java is a class-based, object-oriented, statically-typed programming language designed by James Gosling at Sun Microsystems in 1995. Its core motto "Write Once, Run Anywhere" (WORA) allows compiled Java code to execute across any operating system equipped with a Java Virtual Machine.',
    whyImportant:
      'Java is the bedrock of global enterprise banking, large-scale financial transaction systems, and Android development. Companies like Amazon, Google, LinkedIn, and Netflix rely on Java and Spring Boot for high-throughput, fault-tolerant distributed backends.',
    coreConcepts: [
      {
        title: 'Write Once, Run Anywhere (WORA)',
        description:
          'Java source files (.java) compile into bytecode (.class). The JVM on each operating system translates bytecode to native machine instructions via JIT (Just-In-Time) compilation.',
      },
      {
        title: 'OOP Foundations',
        description:
          'Everything in Java belongs to a class. Encapsulation protects states via access modifiers (private, protected, public); Inheritance shares behavior; Polymorphism allows dynamic dispatch; Abstraction defines interfaces.',
      },
      {
        title: 'JVM Memory Layout',
        description:
          'Heap stores all class instances and arrays (managed by Garbage Collector); Stack stores local variables and method invocation frames (automatically reclaimed on method return).',
      },
      {
        title: 'Java Collections Framework',
        description:
          'A standardized architecture of interfaces (`List`, `Set`, `Queue`, `Map`) and concrete implementations (`ArrayList`, `LinkedList`, `HashSet`, `HashMap`, `TreeMap`).',
      },
      {
        title: 'Exception Hierarchy',
        description:
          'Checked exceptions (subclasses of Exception requiring explicit try-catch or throws clause) vs Unchecked exceptions (subclasses of RuntimeException like NullPointerException).',
      },
    ],
    importantTerminology: [
      { term: 'JDK (Java Development Kit)', definition: 'The full software bundle including compiler (javac), debugger, and JRE required to develop Java programs.' },
      { term: 'JVM (Java Virtual Machine)', definition: 'The runtime engine that loads bytecode, verifies security, and executes machine instructions.' },
      { term: 'Garbage Collection (GC)', definition: 'Background daemon threads that automatically detect and reclaim heap memory occupied by unreachable objects.' },
      { term: 'JIT Compiler', definition: 'Just-In-Time compiler inside JVM that converts hot bytecode methods directly into native assembly at runtime for high performance.' },
      { term: 'Static Keyword', definition: 'Belongs to the class itself rather than individual object instances; shared across all instances.' },
      { term: 'Interface', definition: 'A completely abstract contract containing method signatures that implementing classes must fulfill.' },
    ],
    syntaxStructure: {
      title: 'Class Structure & Object Instantiation',
      explanation: 'Every Java application file must contain a public class matching the filename with a main method.',
      language: 'java',
      codeSnippet: `public class StudentAccount {
    // 1. Encapsulated private fields
    private final String studentId;
    private double balance;

    // 2. Parameterized Constructor
    public StudentAccount(String studentId, double initialDeposit) {
        this.studentId = studentId;
        this.balance = initialDeposit;
    }

    // 3. Business logic method with validation
    public void deposit(double amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Deposit must be positive");
        }
        this.balance += amount;
    }

    // 4. Getter method
    public double getBalance() {
        return this.balance;
    }

    // Main entry point
    public static void main(String[] args) {
        StudentAccount acc = new StudentAccount("ST-2026", 1500.0);
        acc.deposit(500.0);
        System.out.println("Balance: " + acc.getBalance());
    }
}`,
    },
    howItWorks: [
      { step: 1, title: 'Compilation', description: '`javac StudentAccount.java` compiles source into bytecode `StudentAccount.class`.' },
      { step: 2, title: 'Class Loading & Verification', description: 'JVM ClassLoader loads bytecode into method area; Bytecode Verifier enforces security constraints.' },
      { step: 3, title: 'Execution & JIT Optimization', description: 'Interpreter begins execution; JIT compiles frequently called "hot spots" to native machine code.' },
      { step: 4, title: 'Automatic Heap Deallocation', description: 'Garbage Collector reclaims unreachable objects from Eden and Tenured memory spaces.' },
    ],
    simpleExamples: [
      {
        title: 'HashMap Key-Value Lookups',
        description: 'Storing and retrieving candidate placements using HashMap.',
        language: 'java',
        codeOrDiagram: `import java.util.HashMap;
import java.util.Map;

public class PlacementDirectory {
    public static void main(String[] args) {
        Map<String, String> placements = new HashMap<>();
        placements.put("Aarav", "Google");
        placements.put("Priya", "Microsoft");

        // O(1) retrieval
        String company = placements.getOrDefault("Aarav", "Unplaced");
        System.out.println("Company: " + company); // Google
    }
}`,
        outputExplanation: 'HashMap uses hash codes to compute bucket indices for average O(1) read and write performance.',
      },
    ],
    realWorldApplications: [
      'Enterprise Backend Services: Spring Boot microservices powering core banking and fintech portals.',
      'Big Data Processing: Apache Hadoop, Apache Spark, and Apache Kafka message brokers.',
      'Android Mobile Ecosystem: Native Android applications and SDK frameworks.',
      'E-Commerce Platforms: High-concurrency inventory checkouts at Amazon and Flipkart.',
    ],
    commonMistakes: [
      {
        mistake: 'Using "==" for String comparison instead of .equals()',
        whyWrong: '"==" checks whether two references point to the exact same heap memory address, not if text characters are identical.',
        correctApproach: 'Always use `str1.equals(str2)` or `Objects.equals(str1, str2)`.',
      },
      {
        mistake: 'Failing to close resources (Files, Database Connections)',
        whyWrong: 'Exhausts OS file descriptors and socket pools, eventually crashing servers under load.',
        correctApproach: 'Use Java 7+ Try-with-Resources: `try (FileReader fr = new FileReader(...)) { ... }`.',
      },
      {
        mistake: 'Modifying collections during standard foreach iteration',
        whyWrong: 'Throws `ConcurrentModificationException` because the internal iterator detects structural mutation.',
        correctApproach: 'Use an explicit `Iterator.remove()` or collection stream filtering.',
      },
    ],
    keyPointsToRemember: [
      'Primitive types (int, boolean, char) are stored directly on the stack; wrappers (Integer, Boolean) are objects on the heap.',
      'String is immutable in Java; use StringBuilder for multi-loop string concatenations to avoid O(n²) heap allocations.',
      'Java does not support multiple inheritance with classes, but allows a class to implement multiple interfaces.',
      'The final keyword makes variables constant, prevents method overriding, and prevents class inheritance.',
      'All classes implicitly extend `java.lang.Object`, inheriting methods like toString(), equals(), and hashCode().',
    ],
  },

  'sql-basic': {
    coreTopics: [
      'Relational Database Architecture',
      'DDL vs DML vs DCL Commands',
      'Filtering, Sorting & Pattern Matching',
      'Joins (INNER, LEFT, RIGHT, FULL)',
      'Aggregations, GROUP BY & HAVING',
    ],
    whatIs:
      'SQL (Structured Query Language) is the domain-specific standard language used to store, manipulate, query, and retrieve structured data in Relational Database Management Systems (RDBMS). Standardized by ANSI/ISO, it underpins systems like PostgreSQL, MySQL, SQL Server, and Oracle.',
    whyImportant:
      'Data is the core asset of every modern engineering company. SQL proficiency is required for software engineers, backend developers, data scientists, and business analysts alike. Placement interviewers test relational schema querying in almost every technical round.',
    coreConcepts: [
      {
        title: 'Relational Model',
        description:
          'Data is organized into tables (relations) consisting of rows (tuples/records) and columns (attributes). Tables are linked through Primary Keys (unique identifier) and Foreign Keys (referential integrity).',
      },
      {
        title: 'SQL Command Subsets',
        description:
          'DDL (Data Definition: CREATE, ALTER, DROP), DML (Data Manipulation: SELECT, INSERT, UPDATE, DELETE), DCL (Data Control: GRANT, REVOKE), and TCL (Transaction Control: COMMIT, ROLLBACK).',
      },
      {
        title: 'Relational Joins',
        description:
          'Combining columns from multiple tables based on related keys: INNER JOIN (matching records only), LEFT JOIN (all left records + matched right), RIGHT JOIN, and FULL OUTER JOIN.',
      },
      {
        title: 'Aggregation & Grouping',
        description:
          'Compressing multiple records into statistical summaries using aggregate functions (`COUNT`, `SUM`, `AVG`, `MIN`, `MAX`) combined with `GROUP BY` and filtered via `HAVING`.',
      },
      {
        title: 'Indexes & Query Optimization',
        description:
          'B-Tree indexes create sorted lookup structures that avoid full table scans, reducing query execution time from O(n) to O(log n).',
      },
    ],
    importantTerminology: [
      { term: 'Primary Key', definition: 'A column or set of columns that uniquely identifies each row in a table; cannot contain NULLs.' },
      { term: 'Foreign Key', definition: 'A column in one table referencing the Primary Key of another table, enforcing referential integrity.' },
      { term: 'Normalization (1NF, 2NF, 3NF)', definition: 'The systematic process of organizing database schema to eliminate data redundancy and prevent update anomalies.' },
      { term: 'ACID Properties', definition: 'Atomicity, Consistency, Isolation, Durability — the 4 guarantees that ensure database transactions execute reliably.' },
      { term: 'HAVING Clause', definition: 'Filters aggregated groups produced by GROUP BY; contrast with WHERE which filters individual rows before grouping.' },
      { term: 'Index', definition: 'A performance optimization data structure (usually B-Tree) that speeds up data retrieval operations.' },
    ],
    syntaxStructure: {
      title: 'Canonical Query Order & Execution Order',
      explanation: 'SQL syntax is written in one order, but the relational query engine executes clauses in a different logical order: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT.',
      language: 'sql',
      codeSnippet: `-- Schema Creation
CREATE TABLE students (
    student_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(50) DEFAULT 'CSE',
    cgpa NUMERIC(3, 2) CHECK (cgpa >= 0.0 AND cgpa <= 10.0)
);

CREATE TABLE placements (
    placement_id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(student_id),
    company VARCHAR(100) NOT NULL,
    salary_lpa NUMERIC(4, 2) NOT NULL
);

-- Analytical Query with JOIN, GROUP BY, and HAVING
SELECT 
    s.department,
    COUNT(p.placement_id) AS placed_count,
    ROUND(AVG(p.salary_lpa), 2) AS avg_package
FROM students s
INNER JOIN placements p ON s.student_id = p.student_id
WHERE p.salary_lpa >= 8.0
GROUP BY s.department
HAVING COUNT(p.placement_id) >= 5
ORDER BY avg_package DESC
LIMIT 10;`,
    },
    howItWorks: [
      { step: 1, title: 'Query Parsing & Validation', description: 'The SQL parser validates syntax, checks table existence, and verifies user access permissions.' },
      { step: 2, title: 'Query Optimization', description: 'Cost-based optimizer determines the cheapest query execution plan (Index Scans vs Sequential Scans).' },
      { step: 3, title: 'Execution Engine', description: 'Interacts with storage engine buffer pool to fetch pages from disk into memory cache.' },
      { step: 4, title: 'Result Serialization', description: 'Formats filtered and joined tabular rows into client response packets.' },
    ],
    simpleExamples: [
      {
        title: 'Finding Students Without Placements (LEFT JOIN)',
        description: 'Using LEFT JOIN to detect unplaced candidates.',
        language: 'sql',
        codeOrDiagram: `SELECT s.name, s.department
FROM students s
LEFT JOIN placements p ON s.student_id = p.student_id
WHERE p.placement_id IS NULL;`,
        outputExplanation: 'A LEFT JOIN preserves all student rows; where no matching placement exists, p.placement_id is NULL.',
      },
    ],
    realWorldApplications: [
      'Transactional Banking Core: Recording double-entry ledger transfers with strict ACID guarantees.',
      'E-Commerce Order Processing: Managing stock inventory, carts, and customer purchase histories.',
      'Business Intelligence & Reporting: Powering Dashboards (Tableau, PowerBI) with analytical aggregates.',
      'Healthcare Record Systems: Maintaining patient charts, medical histories, and prescription logs.',
    ],
    commonMistakes: [
      {
        mistake: 'Using WHERE clause to filter aggregate calculations',
        whyWrong: 'WHERE evaluates before GROUP BY runs; `WHERE COUNT(*) > 5` causes a SQL syntax error.',
        correctApproach: 'Use `HAVING COUNT(*) > 5` to filter aggregated groups after grouping.',
      },
      {
        mistake: 'Joining on non-indexed columns without foreign keys',
        whyWrong: 'Forces the database engine into O(n × m) nested loop scans, dramatically degrading performance.',
        correctApproach: 'Ensure foreign key columns and joined attributes have B-Tree indexes created.',
      },
      {
        mistake: 'Using SELECT * in production queries',
        whyWrong: 'Transfers unnecessary disk I/O and network payload; breaks code when table schemas evolve.',
        correctApproach: 'Explicitly specify only required column names: `SELECT id, name, cgpa FROM ...`.',
      },
    ],
    keyPointsToRemember: [
      'NULL represents unknown/missing data; test for it using `IS NULL` or `IS NOT NULL`, never `= NULL`.',
      'INNER JOIN excludes unmatched rows; LEFT JOIN keeps all rows from the first table.',
      'UNION combines results and removes duplicates; UNION ALL preserves duplicates and is significantly faster.',
      'Transactions must be wrapped in `BEGIN TRANSACTION` and completed with `COMMIT` or `ROLLBACK`.',
      'The SQL logical execution order explains why column aliases defined in SELECT cannot be referenced in WHERE.',
    ],
  },

  'html-basic': {
    coreTopics: [
      'DOM Tree Architecture & Doctype',
      'Semantic Elements (header, main, section)',
      'Forms, Input Controls & Validations',
      'Media, Images & Responsive Embeds',
      'Accessibility (ARIA) & Core SEO',
    ],
    whatIs:
      'HTML5 (HyperText Markup Language) is the standard markup language used to structure content and define the semantic skeleton of documents displayed on the World Wide Web.',
    whyImportant:
      'Every web application, mobile web view, and email newsletter begins with HTML. Understanding semantic HTML is essential for accessible web apps (a11y), search engine optimization (SEO), and smooth frontend frameworks (React, Next.js, Vue).',
    coreConcepts: [
      {
        title: 'Document Object Model (DOM)',
        description:
          'Browsers parse HTML tags into a tree of connected nodes called the DOM. JavaScript inspects and modifies this tree dynamically to render interactive UIs.',
      },
      {
        title: 'Semantic Elements',
        description:
          'Tags that convey meaning to browsers and screen readers: `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`. Replaces generic uninformative `<div>` tags.',
      },
      {
        title: 'Form Controls & Client Validation',
        description:
          'Interactive input collection using `<form>`, `<input>`, `<select>`, and `<textarea>` with built-in validation attributes (`required`, `pattern`, `min`, `max`, `type="email"`).',
      },
      {
        title: 'Hyperlinks & Navigation',
        description:
          'The `<a>` tag with `href` creates web hypertext links. Attributes like `target="_blank"` and `rel="noopener noreferrer"` protect against tabnabbing security exploits.',
      },
      {
        title: 'Accessibility (A11y) & ARIA',
        description:
          'Ensuring all users, including those with disabilities using screen readers, can navigate interfaces using proper labeling (`alt`, `aria-label`, keyboard tab indices).',
      },
    ],
    importantTerminology: [
      { term: 'DOM (Document Object Model)', definition: 'An in-memory tree representation of the HTML document rendered by the browser engine.' },
      { term: 'Semantic HTML', definition: 'Tags that clearly describe their meaning and purpose to both the browser and developer.' },
      { term: 'Void Elements', definition: 'Self-closing elements that cannot contain child content (e.g., `<img />`, `<br />`, `<input />`, `<meta />`).' },
      { term: 'Viewport', definition: 'The visible area of a web page on a device screen, configured via `<meta name="viewport">` for responsive design.' },
      { term: 'ARIA', definition: 'Accessible Rich Internet Applications — HTML attributes that define ways to make web content accessible.' },
      { term: 'Block vs Inline', definition: 'Block elements start on a new line and take full width (<div>, <p>); Inline elements fit within flow (<span>, <a>).' },
    ],
    syntaxStructure: {
      title: 'HTML5 Semantic Page Skeleton',
      explanation: 'Every standard HTML5 document begins with `<!DOCTYPE html>` and proper lang and viewport meta tags.',
      language: 'html',
      codeSnippet: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SkillSetu Student Profile</title>
</head>
<body>
    <header>
        <nav aria-label="Main Navigation">
            <a href="/">SkillSetu</a>
        </nav>
    </header>

    <main>
        <section aria-labelledby="skill-heading">
            <h1 id="skill-heading">Web Engineering Fundamentals</h1>
            <p>Welcome to theoretical notes for placement preparation.</p>

            <!-- Accessible Form -->
            <form action="/submit" method="POST">
                <label for="student-name">Student Full Name:</label>
                <input type="text" id="student-name" name="name" required placeholder="Aarav Sharma">

                <button type="submit">Verify Skill</button>
            </form>
        </section>
    </main>

    <footer>
        <p>&copy; 2026 SkillSetu. All rights reserved.</p>
    </footer>
</body>
</html>`,
    },
    howItWorks: [
      { step: 1, title: 'Bytes to Characters', description: 'Browser fetches raw bytes over HTTP/HTTPS and decodes them to characters according to charset.' },
      { step: 2, title: 'Tokenization', description: 'Browser parses character strings into standard HTML tokens (StartTag, EndTag, Attribute).' },
      { step: 3, title: 'Tree Construction (DOM)', description: 'Tokens are converted into Node objects and linked into the hierarchical DOM tree.' },
      { step: 4, title: 'Render Tree & Painting', description: 'DOM combines with CSSOM into the Render Tree, computes geometric layout, and paints pixels to screen.' },
    ],
    simpleExamples: [
      {
        title: 'Accessible Image with Alt Text',
        description: 'Proper image embed ensuring screen readers and SEO spiders understand content.',
        language: 'html',
        codeOrDiagram: `<figure>
    <img src="/assets/architecture.png" 
         alt="Diagram illustrating client-server HTTP request-response cycle" 
         width="800" height="400" 
         loading="lazy">
    <figcaption>Figure 1: Standard Client-Server Web Architecture</figcaption>
</figure>`,
        outputExplanation: 'Provides fallback description if image fails, improves accessibility for vision-impaired users, and defers loading for performance.',
      },
    ],
    realWorldApplications: [
      'Web Applications: Single Page Applications (React, Angular) hydrating on top of HTML structures.',
      'Email Templates: Cross-client compatible newsletter layouts for marketing and transactional alerts.',
      'SEO & E-Commerce: Schema.org structured microdata allowing Google to display rich search snippets.',
      'Documentation & CMS: Static site generators (Next.js, Docusaurus) building knowledge bases.',
    ],
    commonMistakes: [
      {
        mistake: '"Div Soup" — Nesting dozens of uninformative <div> tags instead of semantic tags',
        whyWrong: 'Destroys accessibility for screen readers and reduces page ranking in search engine crawlers.',
        correctApproach: 'Use semantic landmarks: `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`.',
      },
      {
        mistake: 'Omitting alt attributes on <img> tags',
        whyWrong: 'Screen readers read the raw URL filename aloud; accessibility audits fail WCAG compliance.',
        correctApproach: 'Always include meaningful `alt="..."`. If purely decorative, use `alt=""`.',
      },
      {
        mistake: 'Missing <label> elements for form inputs',
        whyWrong: 'Users cannot click text to focus input fields, and screen readers cannot describe the input.',
        correctApproach: 'Always associate labels with inputs using `<label for="inputId">` matching `<input id="inputId">`.',
      },
    ],
    keyPointsToRemember: [
      'HTML provides content and structure; CSS handles presentation; JavaScript delivers behavior.',
      'Always include `<meta name="viewport" content="width=device-width, initial-scale=1.0">` for mobile responsiveness.',
      'Headings must follow a logical hierarchy (`<h1>` down to `<h6>`); never skip levels for styling purposes.',
      '`target="_blank"` should always be paired with `rel="noopener noreferrer"` to prevent security tabnabbing.',
      'Forms using GET append parameters to URL query string; forms using POST send parameters in HTTP request body.',
    ],
  },

  'css-basic': {
    coreTopics: [
      'The CSS Box Model',
      'Selectors, Cascade & Specificity',
      'Flexbox 1-D Layout Engine',
      'CSS Grid 2-D Layout Engine',
      'Media Queries & Responsive Units',
    ],
    whatIs:
      'CSS (Cascading Style Sheets) is the stylesheet language used to describe the visual presentation, layout, typography, colors, and responsive adaptability of HTML documents.',
    whyImportant:
      'A functional web application is unusable without clear visual hierarchy, modern UI ergonomics, and responsive layouts that adapt seamlessly across mobile phones, tablets, and desktop displays. Modern UI engineering demands mastery of the Box Model, Flexbox, and CSS Grid.',
    coreConcepts: [
      {
        title: 'The CSS Box Model',
        description:
          'Every HTML element is rendered as a rectangular box consisting of 4 concentric layers: Content (text/media) → Padding (space inside border) → Border → Margin (space outside element separating neighbors).',
      },
      {
        title: 'Cascade & Specificity Hierarchy',
        description:
          'When multiple conflicting CSS rules target the same element, the browser resolves conflicts using specificity scoring: Inline styles (1000) > ID selectors (100) > Class/Attribute/Pseudo-class (10) > Element selectors (1).',
      },
      {
        title: 'Flexbox (One-Dimensional Layout)',
        description:
          'Layout engine designed for distributing space along a single axis (either row or column). Controls alignment (`justify-content`, `align-items`) and flexible wrapping (`flex-wrap`).',
      },
      {
        title: 'CSS Grid (Two-Dimensional Layout)',
        description:
          'Layout engine designed for orchestrating complex two-dimensional grid structures simultaneously across columns and rows using track units like `fr` (fractional unit).',
      },
      {
        title: 'Responsive Design & Media Queries',
        description:
          'Adapting visual styles dynamically based on device characteristics (viewport width, screen orientation, dark/light theme preference) using `@media (min-width: 768px)` breakpoints.',
      },
    ],
    importantTerminology: [
      { term: 'Box-Sizing: border-box', definition: 'Includes padding and border within the declared width and height, preventing unexpected element overflow.' },
      { term: 'Specificity', definition: 'The algorithm browsers use to determine which CSS rule takes precedence when multiple rules match.' },
      { term: 'Flex Container vs Item', definition: 'The parent with display: flex is the container; its immediate children become flexible items.' },
      { term: 'REM vs EM', definition: 'REM is relative to the root <html> font-size (typically 16px); EM is relative to the element’s current parent font-size.' },
      { term: 'CSS Variable (Custom Property)', definition: 'Re-usable design token declared with `--primary-color: #0d5c68;` and referenced with `var(--primary-color)`.' },
      { term: 'Z-Index & Stacking Context', definition: 'Controls the 3-dimensional stacking order of positioned elements along the z-axis.' },
    ],
    syntaxStructure: {
      title: 'Modern CSS Layout & Variables',
      explanation: 'Modern CSS leverages custom properties, border-box resets, and Flexbox for clean styling.',
      language: 'css',
      codeSnippet: `/* 1. Global Box-Sizing Reset */
*, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

/* 2. Design System Variables */
:root {
    --brand-teal: #0d5c68;
    --text-dark: #0f172a;
    --card-bg: #ffffff;
    --radius-lg: 16px;
}

/* 3. Responsive Flexbox Card Container */
.card-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    padding: 2rem;
}

.skill-card {
    flex: 1 1 300px; /* grow, shrink, min-width */
    background: var(--card-bg);
    border: 1px solid #e2e8f0;
    border-radius: var(--radius-lg);
    padding: 1.5rem;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.skill-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px -8px rgba(13, 92, 104, 0.15);
}`,
    },
    howItWorks: [
      { step: 1, title: 'CSS Tokenization & Parsing', description: 'Browser parses CSS rules into the CSS Object Model (CSSOM) tree.' },
      { step: 2, title: 'Cascade Computation', description: 'Calculates computed values for every DOM node based on selector specificity and inheritance.' },
      { step: 3, title: 'Layout / Reflow', description: 'Calculates exact geometric coordinate positions and dimensions for each element on screen.' },
      { step: 4, title: 'Painting & Compositing', description: 'Draws background colors, text, borders, and shadows onto GPU texture layers, composited onto display.' },
    ],
    simpleExamples: [
      {
        title: 'Centering an Element Vertically & Horizontally',
        description: 'The classic centering problem solved cleanly with modern Flexbox.',
        language: 'css',
        codeOrDiagram: `.parent-container {
    display: flex;
    justify-content: center; /* Centers horizontally on main axis */
    align-items: center;     /* Centers vertically on cross axis */
    min-height: 100vh;
}`,
        outputExplanation: 'Clean, reliable centering with zero margin calculation hacks.',
      },
    ],
    realWorldApplications: [
      'Design Systems & Component Libraries: Tailwind CSS, Material UI, Shadcn UI.',
      'Mobile-First Responsive Web: Seamless layouts across smartphones, folding devices, and 4K displays.',
      'Micro-Animations & Transitions: Interactive button feedback, loading spinners, and skeleton loaders.',
      'Dark Mode Theming: Dynamic theme swapping via CSS variables and prefers-color-scheme media query.',
    ],
    commonMistakes: [
      {
        mistake: 'Leaving default box-sizing: content-box active',
        whyWrong: 'Adding padding and borders expands the element beyond declared width, breaking grid layouts.',
        correctApproach: 'Always include global reset: `*, *::before, *::after { box-sizing: border-box; }`.',
      },
      {
        mistake: 'Overusing !important to solve specificity conflicts',
        whyWrong: 'Breaks natural cascade rules and makes future UI styling and overriding nearly impossible.',
        correctApproach: 'Refactor selector specificity by adding a class or reorganizing CSS order.',
      },
      {
        mistake: 'Hardcoding fixed pixel widths on mobile layouts (width: 800px;)',
        whyWrong: 'Causes horizontal scrollbars and broken overflow on mobile smartphone screens.',
        correctApproach: 'Use fluid units: `max-width: 800px; width: 100%;`.',
      },
    ],
    keyPointsToRemember: [
      'Margins collapse vertically between adjacent block elements; padding never collapses.',
      'Flexbox is optimized for 1D layouts (rows or columns); CSS Grid is designed for 2D layouts (rows AND columns).',
      'Use rem for font sizes and spacing to respect user browser accessibility zoom preferences.',
      'CSS animations using transform and opacity run directly on the GPU compositor, avoiding costly layout reflows.',
      'Mobile-first responsive design writes mobile styles by default and adds desktop styles with `@media (min-width: ...)`.',
    ],
  },
};

/**
 * Universal fallback generator for Basic Skills.
 * If a basic skill is not explicitly curated in the dictionary above,
 * this function constructs a comprehensive, technically accurate,
 * structured 10-point theoretical note using the skill's metadata.
 */
export function getBasicSkillTheory(skill: SkillItem): SkillTheoryNote {
  const curated = CURATED_THEORY_NOTES[skill.id];
  if (curated) {
    return {
      skillId: skill.id,
      skillName: skill.name,
      category: skill.category,
      coreTopics: curated.coreTopics || [
        'Core Syntax & Architecture',
        'Fundamental Principles',
        'Data Handling & Storage',
        'Standard Workflows',
        'Best Practices & Optimization',
      ],
      whatIs: curated.whatIs || `What is ${skill.name}? ${skill.description}`,
      whyImportant:
        curated.whyImportant ||
        `${skill.name} is a fundamental engineering competency required for modern technology careers. Mastering it provides the conceptual foundation for advanced frameworks, systems design, and placement interviews.`,
      coreConcepts: curated.coreConcepts || [
        {
          title: 'Foundational Principles',
          description: `Core operational mechanics and rules governing ${skill.name} implementation.`,
        },
        {
          title: 'Standard Architectural Flow',
          description: `How components, modules, and data interact within ${skill.name} environments.`,
        },
        {
          title: 'Operational Lifecycle',
          description: `Execution pipeline, parsing, and runtime environment characteristics.`,
        },
      ],
      importantTerminology: curated.importantTerminology || [
        { term: 'Syntax / Specification', definition: 'The grammatical rules and structural standards required.' },
        { term: 'Runtime Environment', definition: 'The target execution subsystem where instructions execute.' },
        { term: 'Abstraction Layer', definition: 'Simplification isolating low-level hardware or network complexities.' },
      ],
      syntaxStructure: curated.syntaxStructure,
      howItWorks: curated.howItWorks || [
        { step: 1, title: 'Initialization', description: 'Environment setup and configuration of runtime parameters.' },
        { step: 2, title: 'Parsing & Validation', description: 'Syntactic verification and semantic tree construction.' },
        { step: 3, title: 'Execution & Processing', description: 'Sequential computation and data transformation pipeline.' },
        { step: 4, title: 'Output & Resource Cleanup', description: 'Result emission and deallocation of system resources.' },
      ],
      simpleExamples: curated.simpleExamples || [
        {
          title: `Basic ${skill.name} Implementation`,
          description: `Standard beginner-friendly implementation pattern demonstrating ${skill.name} principles.`,
          codeOrDiagram: `// Standard ${skill.name} Pattern\nfunction demonstrate() {\n    // Core concept execution\n    console.log("${skill.name} fundamentals verified");\n}`,
        },
      ],
      realWorldApplications: curated.realWorldApplications || [
        `Production enterprise software and microservices architecture`,
        `High-throughput data pipelines and engineering systems`,
        `Campus placements, coding rounds, and technical interview assessments`,
      ],
      commonMistakes: curated.commonMistakes || [
        {
          mistake: `Ignoring fundamental syntax rules and error logs`,
          whyWrong: `Produces silent runtime exceptions or unpredictable behavior.`,
          correctApproach: `Carefully read stack traces, validate types, and adhere to official standards.`,
        },
      ],
      keyPointsToRemember: curated.keyPointsToRemember || [
        `Master foundational syntax before adopting high-level abstractions or frameworks.`,
        `Always adhere to idiomatic naming conventions and consistent formatting.`,
        `Technical interviewers prioritize core algorithmic clarity and conceptual understanding over rote memorization.`,
      ],
    };
  }

  // Generic structured builder for any other Basic Skill
  const topics = (skill.learningObjectives && skill.learningObjectives.length > 0)
    ? skill.learningObjectives.slice(0, 5)
    : [
        'Syntax & Foundations',
        'Data Types & Architecture',
        'Standard Workflows',
        'Debugging & Optimization',
        'Real-world Industry Integration',
      ];

  const resourcesTopics = (skill.resources || []).map((r) => r.topic).filter(Boolean);
  const coreTopics = topics.map((t) => {
    // Clean topic strings so they look like concise bullet titles
    const clean = t.split(':')[0].split(' - ')[0].replace(/^Master\s+/i, '').replace(/^Execute\s+/i, '').replace(/^Complete\s+/i, '').replace(/^Learn\s+/i, '').trim();
    return clean.length > 40 ? clean.slice(0, 37) + '...' : clean;
  });

  return {
    skillId: skill.id,
    skillName: skill.name,
    category: skill.category,
    coreTopics: coreTopics.length >= 3 ? coreTopics : [
      'Core Architecture & Syntax',
      'Fundamental Data Models',
      'Process Lifecycle',
      'Error Handling & Debugging',
      'Security & Best Practices',
    ],
    whatIs: `${skill.name} is an essential foundational competency in ${skill.category}. ${skill.description}`,
    whyImportant: `Mastering ${skill.name} is required for computer science and engineering students. It provides the bedrock theoretical principles tested in placement technical rounds, diagnostic coding assessments, and foundational software engineering courses.`,
    coreConcepts: [
      {
        title: 'Core Architecture & Foundations',
        description: `The theoretical structure, paradigms, and foundational building blocks that govern ${skill.name}.`,
      },
      {
        title: 'Data & Control Flow',
        description: `How information, variables, state, and instructions traverse through ${skill.name} systems.`,
      },
      {
        title: 'Operational Lifecycle',
        description: `Compilation, interpretation, execution, and cleanup procedures in modern computing environments.`,
      },
      {
        title: 'Design Best Practices',
        description: `Standard conventions, modularity principles, and maintainability requirements in modern codebases.`,
      },
    ],
    importantTerminology: [
      {
        term: 'Syntax & Grammar',
        definition: `The formal set of rules defining combinations of symbols that are considered correctly structured in ${skill.name}.`,
      },
      {
        term: 'Runtime Environment',
        definition: `The hardware and software ecosystem where ${skill.name} processes are executed and monitored.`,
      },
      {
        term: 'Concurrency & Threading',
        definition: `The execution of multiple computational tasks simultaneously or sequentially within the process space.`,
      },
      {
        term: 'Error Handling & Fault Tolerance',
        definition: `Structured mechanisms for intercepting, reporting, and recovering from runtime anomalies.`,
      },
    ],
    syntaxStructure: {
      title: `${skill.name} Structural Overview`,
      explanation: `Standard formatting and idiomatic construction used by professional engineers.`,
      language: 'text',
      codeSnippet: `// Standard ${skill.name} Structure
Input / Declaration -> Processing Logic -> Output / Validation
Adheres to standardized modularity and type verification rules.`,
    },
    howItWorks: [
      {
        step: 1,
        title: 'Initialization & Configuration',
        description: `The engine sets up memory namespaces, parses configuration, and establishes runtime constraints.`,
      },
      {
        step: 2,
        title: 'Instruction Parsing',
        description: `Source statements or commands are evaluated against semantic grammatical rules.`,
      },
      {
        step: 3,
        title: 'Execution & Transformation',
        description: `The runtime executes operations, manages state transitions, and interacts with system peripherals.`,
      },
      {
        step: 4,
        title: 'Termination & Resource Cleanup',
        description: `Buffers are flushed, open descriptors are closed, and allocated memory is safely deallocated.`,
      },
    ],
    simpleExamples: [
      {
        title: `Practical ${skill.name} Scenario`,
        description: `A standard implementation demonstrating the core mechanics of ${skill.name}.`,
        codeOrDiagram: `// Standard ${skill.name} Workflow Example
1. Define entities and data requirements
2. Implement core algorithmic operations
3. Verify output matches expected test assertions`,
        outputExplanation: `Demonstrates clean separation of concerns and deterministic execution.`,
      },
    ],
    realWorldApplications: [
      `Production backend microservices, web applications, and enterprise databases.`,
      `Scalable cloud infrastructure, distributed data pipelines, and developer tooling.`,
      `Technical interview assessments, campus recruitment coding tests, and competitive programming.`,
    ],
    commonMistakes: [
      {
        mistake: `Skipping foundational documentation and relying on trial-and-error`,
        whyWrong: `Leads to fragile implementations, unhandled edge cases, and hidden performance bugs.`,
        correctApproach: `Study formal specifications, understand underlying memory/time complexity, and review test assertions.`,
      },
      {
        mistake: `Ignoring edge case validation and boundary conditions`,
        whyWrong: `Causes unhandled null pointers, array index out-of-bounds, or memory leaks under heavy load.`,
        correctApproach: `Always defensively validate input boundaries, sanitize arguments, and assert conditions.`,
      },
    ],
    keyPointsToRemember: [
      `Always understand the underlying time and space complexity (Big-O analysis) for every operation.`,
      `Follow standard clean code principles: meaningful identifiers, single responsibility, and documented assumptions.`,
      `Interviewers frequently ask candidates to explain how ${skill.name} operates internally beneath high-level abstractions.`,
      `Consistent practice with small, focused examples builds deep conceptual intuition that scales to large projects.`,
    ],
  };
}
