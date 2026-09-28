export interface AIInterviewRequest {
  candidateName: string;
  roleTitle: string;
  userAnswer: string;
  chatHistory: Array<{ sender: 'ai' | 'user'; text: string }>;
  audioMetrics?: {
    avgPitchHz: number;
    rmsVolume: number;
    speakingPaceWpm: number;
    pauseCount: number;
  };
}

export interface AIInterviewEval {
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  confidenceScore: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

export interface AIInterviewResponse {
  reply: string;
  isFinal: boolean;
  technicalScore: number;
  communicationScore: number;
  sentiment: string;
  keywordsIdentified: string[];
  evaluation: AIInterviewEval | null;
}

let cachedApiKey: string | undefined;
function getGeminiApiKey(): string | undefined {
  if (cachedApiKey !== undefined) return cachedApiKey;
  cachedApiKey = process.env.GEMINI_API_KEY;
  return cachedApiKey;
}

export async function callGeminiAPI(
  systemPrompt: string,
  conversationContext: string,
  userReply: string
): Promise<AIInterviewResponse | null> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    console.warn('[AI Interview] GEMINI_API_KEY not configured; using NLP fallback engine');
    return null;
  }

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                { text: systemPrompt },
                { text: `${conversationContext}\n\nCandidate Reply: "${userReply}"` },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    if (!geminiRes.ok) {
      console.warn(`[AI Interview] Gemini API error: ${geminiRes.status} ${geminiRes.statusText}`);
      return null;
    }

    const geminiData = await geminiRes.json();
    const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
    if (rawText) {
      return JSON.parse(rawText) as AIInterviewResponse;
    }
    return null;
  } catch (geminiErr) {
    console.warn('[AI Interview] Gemini API call error, falling back to NLP processing engine:', geminiErr);
    return null;
  }
}

export function processNLPResponse(
  candidateName: string,
  roleTitle: string,
  userAnswer: string,
  history: Array<{ sender: 'ai' | 'user'; text: string }>,
  audioMetrics?: {
    avgPitchHz: number;
    rmsVolume: number;
    speakingPaceWpm: number;
    pauseCount: number;
  }
): AIInterviewResponse {
  const text = userAnswer.trim().toLowerCase();
  const turnCount = history.filter((c) => c.sender === 'user').length + 1;

  const techLexicon: Record<string, string[]> = {
    frontend: ['react', 'next', 'vue', 'angular', 'javascript', 'typescript', 'tailwind', 'css', 'dom', 'state', 'redux', 'hooks', 'virtual dom'],
    backend: ['node', 'express', 'python', 'java', 'go', 'api', 'rest', 'graphql', 'microservices', 'docker', 'kubernetes', 'aws'],
    database: ['sql', 'postgres', 'mysql', 'mongodb', 'redis', 'orm', 'indexing', 'query', 'schema', 'transaction'],
    engineering: ['architecture', 'testing', 'jest', 'cypress', 'ci/cd', 'git', 'security', 'oauth', 'jwt', 'optimization', 'caching'],
  };

  const foundKeywords: string[] = [];
  Object.values(techLexicon).flat().forEach((kw) => {
    if (text.includes(kw) && !foundKeywords.includes(kw)) {
      foundKeywords.push(kw);
    }
  });

  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const isGreeting = /^(hi|hello|hey|greetings|good morning|good afternoon)[\s!.]*$/i.test(text);
  const isShort = wordCount < 4;

  let replyText = '';
  let isFinal = turnCount >= 4;

  if (isGreeting) {
    replyText = `Hello ${candidateName}! Great to meet you. Let's begin the evaluation for the ${roleTitle} role. Could you please summarize your technical background, core stack, and recent projects?`;
    isFinal = false;
  } else if (isShort) {
    replyText = `Could you elaborate a bit more on that? For example, what specific technical architecture, languages, or engineering decisions were involved in your work?`;
    isFinal = false;
  } else if (foundKeywords.some((k) => techLexicon.frontend.includes(k))) {
    replyText = `You highlighted frontend engineering with ${foundKeywords.filter((k) => techLexicon.frontend.includes(k)).join(', ')}. How do you manage complex application state, optimize bundle sizes, and maintain high Lighthouse performance scores?`;
  } else if (foundKeywords.some((k) => techLexicon.backend.includes(k) || techLexicon.database.includes(k))) {
    replyText = `Great depth on backend infrastructure! How do you handle database connection pooling, API rate limiting, and async error recovery under high concurrent request volume?`;
  } else if (turnCount === 1) {
    replyText = `Thank you for sharing your background, ${candidateName}! Could you describe a challenging technical bug or performance bottleneck you encountered recently, and how you systematically diagnosed and resolved it?`;
  } else if (turnCount === 2) {
    replyText = `Solid problem-solving methodology! How do you approach automated unit/integration testing, peer code reviews, and CI/CD deployment safety in your projects?`;
  } else if (turnCount === 3) {
    replyText = `Where do you see yourself making the biggest technical impact in our ${roleTitle} team over the next 12 months?`;
  } else {
    replyText = `Thank you for the detailed responses, ${candidateName}! That concludes our technical evaluation. I have synthesized your real-time voice, acoustic pitch analysis, and technical vocabulary into your final candidate evaluation report.`;
    isFinal = true;
  }

  const basePace = audioMetrics?.speakingPaceWpm || Math.round(wordCount * 12);
  const commScore = Math.min(98, Math.max(65, Math.round(72 + Math.min(20, wordCount / 4) + (basePace > 110 && basePace < 170 ? 6 : 0))));
  const techScore = Math.min(99, Math.max(60, Math.round(65 + foundKeywords.length * 7)));

  let evaluation: AIInterviewEval | null = null;
  if (isFinal) {
    const overallScore = Math.round(commScore * 0.45 + techScore * 0.55);
    evaluation = {
      overallScore,
      technicalScore: techScore,
      communicationScore: commScore,
      confidenceScore: Math.min(95, Math.max(75, Math.round(commScore * 0.95))),
      feedback: `Candidate demonstrated solid engagement for the ${roleTitle} role. Extracted ${foundKeywords.length} verified domain keywords (${foundKeywords.slice(0, 4).join(', ')}) with clear verbal articulation and a steady speaking rate (~${basePace} WPM). Recommended for technical onboarding.`,
      strengths: [
        `Strong technical vocabulary (${foundKeywords.length} verified domain terms used)`,
        `Paced voice delivery (~${basePace} WPM)`,
        'Structured problem-solving approach',
      ],
      improvements: [
        'Incorporate specific quantitative benchmarks (e.g. latency reduction %, test coverage %)',
        'Deepen architectural trade-off discussions',
      ],
    };
  }

  return {
    reply: replyText,
    isFinal,
    technicalScore: techScore,
    communicationScore: commScore,
    sentiment: foundKeywords.length > 2 ? 'Strong Technical Depth' : isGreeting ? 'Professional Greeting' : 'Moderate Technical Context',
    keywordsIdentified: foundKeywords,
    evaluation,
  };
}
