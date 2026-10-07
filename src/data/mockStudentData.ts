import { StudentProfile, Skill, Opportunity, Application, Project, WorkExperience, NotificationItem, CityLocation } from '@/types/student';
import { getAllSkillsAsInitialSkills } from './skillsData';
import {
  C_BASIC_ASSESSMENT,
  HTML_BASIC_ASSESSMENT,
  CSS_BASIC_ASSESSMENT,
  SQL_BASIC_ASSESSMENT,
  CPP_BASIC_ASSESSMENT,
  JAVA_BASIC_ASSESSMENT,
  JS_BASIC_ASSESSMENT,
  GIT_BASIC_ASSESSMENT,
  EXCEL_BASIC_ASSESSMENT,
  COMM_BASIC_ASSESSMENT,
  REACT_INT_ASSESSMENT,
  NODE_INT_ASSESSMENT,
  DSA_INT_ASSESSMENT,
  POWERBI_INT_ASSESSMENT,
  DATA_ANALYTICS_INT_ASSESSMENT,
  REST_APIS_INT_ASSESSMENT,
  SAP_ADV_ASSESSMENT,
  AWS_ADV_ASSESSMENT,
  AZURE_ADV_ASSESSMENT,
  DEVOPS_ADV_ASSESSMENT,
  ML_ADV_ASSESSMENT,
} from './skillAssessments';

export const INITIAL_STUDENT_PROFILE: StudentProfile = {
  id: 'std-aarav-01',
  name: 'Aarav Sharma',
  degree: 'B.Tech Computer Science & Engineering',
  year: '3rd Year',
  college: 'RV College of Engineering, Bengaluru',
  location: 'Bengaluru, Karnataka',
  careerGoal: 'Software / Data / Product Roles',
  profileCompletion: 78,
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  bio: 'Ambitious 3rd-year undergraduate focusing on software engineering, data analytics, and full-stack systems. Passionate about applying AI and analytics to healthcare and AYUSH domain solutions.',
  email: 'aarav.sharma@rvce.edu.in',
  phone: '+91 98765 43210',
  github: 'https://github.com/aarav-sharma-dev',
  linkedin: 'https://linkedin.com/in/aarav-sharma-tech',
  gpa: '8.74 CGPA',
};

export const CITIES_LIST: CityLocation[] = [
  { name: 'Bengaluru', coordinates: { lat: 12.9716, lng: 77.5946 } },
  { name: 'Mumbai', coordinates: { lat: 19.0760, lng: 72.8777 } },
  { name: 'Delhi', coordinates: { lat: 28.6139, lng: 77.2090 } },
  { name: 'Hyderabad', coordinates: { lat: 17.3850, lng: 78.4867 } },
  { name: 'Pune', coordinates: { lat: 18.5204, lng: 73.8567 } },
  { name: 'Chennai', coordinates: { lat: 13.0827, lng: 80.2707 } },
  { name: 'Jaipur', coordinates: { lat: 26.9124, lng: 75.7873 } },
  { name: 'Kochi', coordinates: { lat: 9.9312, lng: 76.2673 } },
  { name: 'Ahmedabad', coordinates: { lat: 23.0225, lng: 72.5714 } },
];

export const PYTHON_BASIC_ASSESSMENT = [
  {
    id: 1,
    question: "What is the output of `type([])` in Python 3?",
    options: ["<class 'tuple'>", "<class 'list'>", "<class 'array'>", "<class 'dict'>"],
    correctIndex: 1,
    explanation: "In Python, square brackets `[]` define a list object of type `list`.",
    topic: "Data Types"
  },
  {
    id: 2,
    question: "Which keyword is used to define a reusable function in Python?",
    options: ["function", "func", "def", "lambda"],
    correctIndex: 2,
    explanation: "The `def` keyword declares user-defined functions in Python.",
    topic: "Functions"
  },
  {
    id: 3,
    question: "What will `bool('False')` evaluate to in Python?",
    options: ["False", "True", "None", "TypeError"],
    correctIndex: 1,
    explanation: "Any non-empty string in Python evaluates to `True` under boolean conversion.",
    topic: "Data Types & Booleans"
  },
  {
    id: 4,
    question: "How do you open a file for reading in a safe context manager?",
    options: [
      "open('data.txt', 'r')",
      "with open('data.txt', 'r') as f:",
      "file.open('data.txt')",
      "read.file('data.txt')"
    ],
    correctIndex: 1,
    explanation: "`with open(...)` guarantees that the file is safely closed when the block exits.",
    topic: "File Handling"
  },
  {
    id: 5,
    question: "What does the `break` statement do inside a `for` or `while` loop?",
    options: [
      "Skips to the next iteration",
      "Immediately terminates the innermost loop",
      "Restarts the loop from 0",
      "Causes a syntax error"
    ],
    correctIndex: 1,
    explanation: "`break` immediately exits the enclosing loop construct.",
    topic: "Loops"
  },
  {
    id: 6,
    question: "What is the correct syntax to create a dictionary in Python?",
    options: [
      "x = {'name': 'Aarav', 'age': 20}",
      "x = ('name' => 'Aarav', 'age' => 20)",
      "x = ['name': 'Aarav', 'age': 20]",
      "x = <'name': 'Aarav'>"
    ],
    correctIndex: 0,
    explanation: "Dictionaries are created using curly braces `{}` with key-value pairs separated by colons.",
    topic: "Data Structures"
  },
  {
    id: 7,
    question: "Which of the following creates a virtual constructor in Python class definitions?",
    options: ["__init__()", "constructor()", "def Class()", "__new__()"],
    correctIndex: 0,
    explanation: "The `__init__()` method acts as the initializer/constructor when instantiating a class.",
    topic: "OOP"
  },
  {
    id: 8,
    question: "What will `[x * 2 for x in range(3)]` produce?",
    options: ["[0, 1, 2]", "[0, 2, 4]", "[2, 4, 6]", "[0, 2, 4, 6]"],
    correctIndex: 1,
    explanation: "`range(3)` produces 0, 1, 2; multiplying each by 2 yields `[0, 2, 4]`.",
    topic: "List Comprehension"
  },
  {
    id: 9,
    question: "Which statement handles exceptions in Python?",
    options: ["try ... catch", "try ... except", "do ... catch", "handle ... on error"],
    correctIndex: 1,
    explanation: "Python uses `try ... except` blocks for exception handling.",
    topic: "Error Handling"
  },
  {
    id: 10,
    question: "Which standard library module provides mathematical functions like `sqrt` and `sin`?",
    options: ["calc", "math", "numbers", "algorithm"],
    correctIndex: 1,
    explanation: "The `math` module is the Python standard module for mathematical operations.",
    topic: "Modules"
  }
];

export const INITIAL_SKILLS: Skill[] = getAllSkillsAsInitialSkills();

/**
 * Verified real opportunities are loaded dynamically through the verified job providers
 * pipeline (TrustJob, Greenhouse, Ashby).
 * Zero mock or fake opportunities are used in the production student experience.
 */
export const INITIAL_OPPORTUNITIES: Opportunity[] = [];


/**
 * Applications for new users start from zero.
 * Only real student submissions are recorded and displayed.
 */
export const INITIAL_APPLICATIONS: Application[] = [];


export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'AYUSH Clinical Student Record System',
    description: 'Full-stack patient appointment booking and clinical documentation platform built for Ayurvedic medical colleges. Features role-based access for students, faculties, and doctors with automated prescription PDF generation.',
    techStack: ['Python', 'Flask', 'SQL', 'HTML', 'CSS', 'JavaScript'],
    githubUrl: 'https://github.com/aarav-sharma-dev/ayush-student-records',
    liveUrl: 'https://ayush-records-demo.vercel.app'
  },
  {
    id: 'proj-2',
    title: 'Personal Career Portfolio & Tech Blog',
    description: 'Clean, mobile-first responsive portfolio showcasing academic projects, verified skill badges, open-source pull requests, and technical writeups.',
    techStack: ['HTML', 'CSS', 'JavaScript', 'Responsive Design'],
    githubUrl: 'https://github.com/aarav-sharma-dev/aarav-portfolio',
    liveUrl: 'https://aaravsharma.dev'
  },
  {
    id: 'proj-3',
    title: 'Medicinal Herb Price & Telemetry Analytics',
    description: 'Exploratory data analysis pipeline extracting regional mandi raw herb pricing. Evaluates seasonality variations, stock shortages, and price volatility using statistical charts.',
    techStack: ['Python', 'Pandas', 'Matplotlib', 'SQL'],
    githubUrl: 'https://github.com/aarav-sharma-dev/herb-price-analytics'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Python Assessment Ready',
    message: 'Take the skill assessment now to earn your verified badge and stand out to hiring companies.',
    time: '10 min ago',
    read: false,
    type: 'assessment',
    link: '/student/skills/python-basic'
  },
  {
    id: 'notif-2',
    title: 'Verified Opportunities Available',
    message: 'Verified openings from top employers match tech skills like Python, JavaScript, and SQL.',
    time: '2 hours ago',
    read: false,
    type: 'opportunity',
    link: '/student/opportunities'
  },
  {
    id: 'notif-3',
    title: 'Profile Ready for Enhancement',
    message: 'Add your portfolio projects and GitHub repository links to increase your matching score.',
    time: '1 day ago',
    read: true,
    type: 'profile',
    link: '/student/profile'
  }
];
