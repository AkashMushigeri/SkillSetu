import { IndustryChallenge } from '@/types/industry';

export const mockChallenges: IndustryChallenge[] = [
  {
    id: 'chal-01',
    title: 'AI Resume Screening & Skill Extraction Challenge',
    description:
      'Design an intelligent NLP pipeline that parses unstructured resume PDFs, verifies candidate claims against standardized taxonomies, and generates match scores with explainable skill confidence.',
    problemStatement:
      'Current ATS systems reject high-potential candidates based on keyword mismatches. Candidates in this challenge will create an open-source parsing benchmark utilizing transformers (BERT/DeBERTa) and cosine similarity to match candidate profiles against TechNova job requirements.',
    requiredSkills: ['Python', 'NLP', 'Machine Learning', 'Transformers', 'FastAPI'],
    difficulty: 'Intermediate',
    deadline: '30 Oct 2026',
    teamSize: '1–3 Students',
    prize: '₹50,000 Cash Prize + Direct PPO Technical Interview at TechNova Labs',
    submissionRequirements:
      'GitHub repository with MIT License, reproducible Docker container, and a 3-minute Loom demo video walkthrough.',
    collegeParticipation: 'Open to All 14 Partner Colleges (Priority to AYUSH Tech & BIT)',
    participantsCount: 84,
    submissionsCount: 26,
    status: 'Active',
    createdDate: '01 Sep 2026',
  },
  {
    id: 'chal-02',
    title: 'Botanical Leaf Pathology Vision Benchmark',
    description:
      'Build a lightweight convolutional neural network capable of segmenting and classifying 28 foliar pathologies on Ayurvedic medicinal herbs under varying outdoor illumination.',
    problemStatement:
      'Ayurvedic farmers require mobile-first offline diagnostic tools to protect high-value medicinal flora from fungal infections. Build an edge model (< 25MB) running in real-time on standard Android devices.',
    requiredSkills: ['Python', 'PyTorch', 'Computer Vision', 'OpenCV', 'TensorFlow Lite'],
    difficulty: 'Advanced',
    deadline: '15 Nov 2026',
    teamSize: '1–4 Students',
    prize: '₹75,000 Cash Pool + TechNova Incubator Grant & Hardware Lab Access',
    submissionRequirements: 'PyTorch trained weights (.pt), ONNX export, and quantitative F1-score evaluation benchmark notebook.',
    collegeParticipation: 'Open to All Technical Institutions',
    participantsCount: 112,
    submissionsCount: 41,
    status: 'Active',
    createdDate: '25 Aug 2026',
  },
  {
    id: 'chal-03',
    title: 'High-Throughput Tele-Consultation Microservice',
    description:
      'Construct an event-driven WebRTC signaling and consultation records microservice handling 10,000 concurrent patient-practitioner sessions with Redis Pub/Sub.',
    problemStatement:
      'Rural Ayush dispensaries require fault-tolerant, low-bandwidth video consultation pipelines that gracefully degrade video quality while prioritizing encrypted audio telemetry.',
    requiredSkills: ['Java', 'Spring Boot', 'WebSockets', 'Redis', 'Docker'],
    difficulty: 'Intermediate',
    deadline: '10 Dec 2026',
    teamSize: '1–2 Students',
    prize: '₹40,000 + Paid 6-Month Backend Internship',
    submissionRequirements: 'Docker-Compose suite, JMeter load-test results demonstrating >5k RPS at p99 < 120ms.',
    collegeParticipation: 'Partner Colleges Only',
    participantsCount: 56,
    submissionsCount: 14,
    status: 'Active',
    createdDate: '05 Sep 2026',
  },
  {
    id: 'chal-04',
    title: 'Ayush State Healthcare Supply Chain Anomaly Detector',
    description:
      'Implement an algorithmic anomaly detection pipeline identifying inventory leakage and counterfeit medicine batch codes.',
    problemStatement:
      'Detect anomalous distribution patterns across 1,200 regional primary health centers using unsupervised clustering and isolation forests.',
    requiredSkills: ['SQL', 'Python', 'Data Analytics', 'Scikit-Learn'],
    difficulty: 'Basic',
    deadline: '05 Jan 2027',
    teamSize: '1–3 Students',
    prize: '₹30,000 + Certificate of Excellence from Ministry Stakeholders',
    submissionRequirements: 'Interactive Streamlit or Dash app with clean SQL schema scripts.',
    collegeParticipation: 'Open to All Colleges',
    participantsCount: 38,
    submissionsCount: 0,
    status: 'Upcoming',
    createdDate: '10 Sep 2026',
  },
];
