'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useStudent } from '@/context/StudentContext';
import { AIInterviewModal } from '@/components/AIInterviewModal';
import type { AIInterviewEval, InterviewTurn } from '@/server/ai/interviewService';
import { auth, getAiAppCheckHeaders } from '@/lib/firebase';
import {
  Sparkles,
  Bot,
  Video,
  Mic,
  ArrowLeft,
  Play,
  Zap,
} from 'lucide-react';

export default function StudentAIInterviewPage() {
  const { profile } = useStudent();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetRole, setTargetRole] = useState('Full Stack Software Engineer');
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [result, setResult] = useState<AIInterviewEval | null>(null);
  const [resultError, setResultError] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const resultTranscriptRef = useRef<InterviewTurn[]>([]);

  useEffect(() => {
    const updateCooldown = () => setCooldownSeconds(Math.max(0, Math.ceil((Number(localStorage.getItem('aiInterviewCooldownUntil')) - Date.now()) / 1000)));
    updateCooldown();
    const timer = setInterval(updateCooldown, 1000);
    return () => clearInterval(timer);
  }, []);

  const startInterview = () => {
    if (isEvaluating || Number(localStorage.getItem('aiInterviewCooldownUntil')) > Date.now()) return;
    setResult(null);
    setResultError('');
    resultTranscriptRef.current = [];
    setIsModalOpen(true);
  };

  const generateResult = async (transcript: InterviewTurn[]) => {
    resultTranscriptRef.current = transcript;
    if (!transcript.some((turn) => turn.sender === 'user' && turn.text.trim())) {
      setResultError('No spoken answers were captured, so this interview cannot be scored.');
      return;
    }
    setIsEvaluating(true);
    setResultError('');
    try {
      if (!auth?.currentUser) throw new Error('Sign in to evaluate the interview.');
      const response = await fetch('/api/ai-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${await auth.currentUser.getIdToken()}`, ...await getAiAppCheckHeaders() },
        body: JSON.stringify({ action: 'evaluate', roleTitle: targetRole, transcript }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || errorData?.message || `Evaluation failed: ${response.status}`);
      }
      const data = await response.json();
      if (!data.evaluation) throw new Error('Evaluation was missing');
      setResult(data.evaluation);
    } catch (error) {
      console.error('[AI Interview] Evaluation failed:', error);
      setResultError(`${error instanceof Error ? error.message : 'Could not generate the interview result.'} Your answers are kept here so you can retry.`);
    } finally {
      setIsEvaluating(false);
    }
  };

  const closeInterview = () => {
    localStorage.setItem('aiInterviewCooldownUntil', String(Date.now() + 10_000));
    setCooldownSeconds(10);
    setIsModalOpen(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      {/* Back Link */}
      <Link
        href="/student/skills"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Skills Hub
      </Link>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-brand-dark to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            AI Mock Interview &amp; Voice Evaluation
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            AI Technical Interview Practice
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Practice technical interview questions with live voice input, a local camera preview, and a transcript-based AI evaluation.
          </p>
        </div>

        <button
          onClick={startInterview}
          disabled={cooldownSeconds > 0 || isEvaluating}
          className="px-6 py-3.5 bg-gradient-to-r from-brand-emerald to-emerald-500 hover:from-emerald-600 hover:to-emerald-500 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg transition-all flex items-center gap-2 shrink-0 self-start md:self-auto hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>{isEvaluating ? 'Preparing results...' : cooldownSeconds ? `Try again in ${cooldownSeconds}s` : 'Start AI Interview Session'}</span>
        </button>
      </div>

      {/* Role Selection & Preparation Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Select Practice Domain</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Target role for AI technical question generation</p>
          </div>

          <select
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-brand-teal"
          >
            <option value="Full Stack Software Engineer">Full Stack Software Engineer</option>
            <option value="Frontend React Developer">Frontend React Developer</option>
            <option value="Backend Node.js Engineer">Backend Node.js Engineer</option>
            <option value="Data Analyst &amp; Python Developer">Data Analyst &amp; Python Developer</option>
            <option value="Machine Learning Associate">Machine Learning Associate</option>
          </select>
        </div>

        {/* Requirements Checklist */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/40 space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-bold text-xs">
              <Mic className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Microphone Input</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              Browser will explicitly request microphone permissions for real-time speech transcription &amp; voice volume analysis.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-800/40 space-y-2">
            <div className="flex items-center gap-2 text-blue-800 dark:text-blue-400 font-bold text-xs">
              <Video className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Webcam Video Feed</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              Real-time video feed lets you monitor eye contact and interview posture during practice questions.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200/80 dark:border-purple-800/40 space-y-2">
            <div className="flex items-center gap-2 text-purple-800 dark:text-purple-400 font-bold text-xs">
              <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Instant AI Score</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              Evaluates technical vocabulary, communication fluency, and problem-solving explanation quality.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex items-center justify-end">
          <button
            onClick={startInterview}
            disabled={cooldownSeconds > 0 || isEvaluating}
            className="px-6 py-3 bg-brand-teal hover:bg-brand-dark text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Bot className="w-4 h-4" />
            <span>{isEvaluating ? 'Preparing results...' : cooldownSeconds ? `Try again in ${cooldownSeconds}s` : 'Launch Practice Session Now'}</span>
          </button>
        </div>
      </div>

      {(isEvaluating || resultError || result) && (
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card space-y-4" aria-label="Interview result">
          <h2 className="text-xl font-bold text-slate-900">Interview Result</h2>
          {isEvaluating && <p role="status" className="text-slate-600">Analyzing your answers...</p>}
          {resultError && <div role="alert" className="text-rose-700">{resultError}</div>}
          {resultError && resultTranscriptRef.current.some((turn) => turn.sender === 'user') && (
            <button type="button" onClick={() => generateResult(resultTranscriptRef.current)} className="px-4 py-2 rounded-xl bg-brand-teal text-white font-semibold">Retry result</button>
          )}
          {result && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                {[
                  ['Overall', result.overallScore],
                  ['Technical', result.technicalScore],
                  ['Communication', result.communicationScore],
                  ['Answer confidence', result.confidenceScore],
                ].map(([label, score]) => (
                  <div key={label} className="rounded-xl bg-emerald-50 p-3"><div className="text-xs text-slate-600">{label}</div><strong className="text-xl text-emerald-800">{score}%</strong></div>
                ))}
              </div>
              <p className="text-slate-700">{result.feedback}</p>
              {result.source === 'rubric' && (
                <p className="text-xs font-semibold text-amber-800">Transcript rubric fallback</p>
              )}
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div><h3 className="font-bold text-slate-900 mb-2">Strengths</h3><ul className="list-disc pl-5 space-y-1">{result.strengths.map((item, index) => <li key={index}>{item}</li>)}</ul></div>
                <div><h3 className="font-bold text-slate-900 mb-2">Improve next time</h3><ul className="list-disc pl-5 space-y-1">{result.improvements.map((item, index) => <li key={index}>{item}</li>)}</ul></div>
              </div>
              <p className="text-xs text-slate-500">Based on the captured interview transcript; camera posture and voice acoustics are not scored.</p>
            </>
          )}
        </section>
      )}

      {/* AI Interview Modal */}
      <AIInterviewModal
        isOpen={isModalOpen}
        onClose={closeInterview}
        onComplete={generateResult}
        candidateName={profile.name}
        roleTitle={targetRole}
      />
    </div>
  );
}
