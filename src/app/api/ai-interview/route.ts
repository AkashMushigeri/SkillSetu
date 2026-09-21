import { NextResponse } from 'next/server';
import {
  AIInterviewRequest,
  AIInterviewResponse,
  callGeminiAPI,
  processNLPResponse,
} from '@/server/ai/interviewService';

export async function POST(req: Request) {
  try {
    const body: AIInterviewRequest = await req.json();
    const { candidateName, roleTitle, userAnswer, chatHistory, audioMetrics } = body;

    const systemPrompt = `You are an expert Senior Technical Interviewer evaluating a candidate named "${candidateName}" for the position of "${roleTitle}".
Your task is to conduct an interactive, rigorous, and encouraging technical interview.

Guidelines:
1. Analyze the candidate's latest response: "${userAnswer}".
2. Evaluate their technical vocabulary, clarity, problem-solving approach, and relevance to the role.
3. If their answer is a brief greeting (e.g. "hi", "hello"), greet them warmly and ask them to introduce their technical background and primary stack.
4. If their answer is short or vague (e.g. "ok", "yes"), ask a specific technical question tailored to ${roleTitle}.
5. If their answer contains technical details (e.g. React, Node, Python, Databases, SQL, Architecture, Testing), acknowledge their specific points and ask an insightful follow-up question or scenario-based problem.
6. Keep your spoken response concise, professional, and natural (2-4 sentences max per turn).
7. Total interview length is 4 turns. You are currently on turn ${chatHistory.filter((c) => c.sender === 'user').length + 1}.

Respond ONLY in valid JSON format with the following keys:
{
  "reply": "Your next AI interviewer response / follow-up question",
  "isFinal": false,
  "technicalScore": 85,
  "communicationScore": 90,
  "sentiment": "Confident / Structured / Needs Detail",
  "keywordsIdentified": ["React", "API", "State"],
  "evaluation": null
}`;

    const conversationContext = `Conversation History:\n${chatHistory
      .map((c) => `${c.sender.toUpperCase()}: ${c.text}`)
      .join('\n')}`;

    const geminiResult: AIInterviewResponse | null = await callGeminiAPI(
      systemPrompt,
      conversationContext,
      userAnswer
    );

    if (geminiResult) {
      return NextResponse.json(geminiResult);
    }

    const nlpResult = processNLPResponse(
      candidateName,
      roleTitle,
      userAnswer,
      chatHistory,
      audioMetrics
    );
    return NextResponse.json(nlpResult);
  } catch (err: any) {
    console.error('AI Interview Route Error:', err);
    return NextResponse.json({ error: 'Failed to process AI interview response' }, { status: 500 });
  }
}
