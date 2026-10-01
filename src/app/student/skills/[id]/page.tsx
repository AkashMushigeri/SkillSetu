'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useStudent } from '@/context/StudentContext';
import { requestSkillAssessment, submitAssessmentEvaluation } from '@/lib/ai/aiClient';
import { AssessmentQuestionItem, AssessmentEvaluationResult } from '@/types/student';
import {
  Award,
  CheckCircle2,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Play,
  FileText,
  Code,
  RotateCcw,
  Sparkles,
  Clock,
  Briefcase,
  ExternalLink,
  HelpCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Info,
  TrendingUp,
} from 'lucide-react';

export default function SkillDetailPage() {
  const params = useParams();
  const router = useRouter();
  const skillId = params.id as string;
  const { getSkillById, toggleResourceCompletion, verifySkill } = useStudent();

  const skill = getSkillById(skillId);

  // Assessment state
  const [selectedDifficulty, setSelectedDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('MEDIUM');
  const [isTakingAssessment, setIsTakingAssessment] = useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [questions, setQuestions] = useState<AssessmentQuestionItem[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [assessmentCompleted, setAssessmentCompleted] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<AssessmentEvaluationResult | null>(null);
  const [assessmentError, setAssessmentError] = useState<string | null>(null);

  // Load questions dynamically from AI assessment engine
  const loadAssessment = async (
    isRetry: boolean = false,
    diff: 'EASY' | 'MEDIUM' | 'HARD' = selectedDifficulty
  ) => {
    if (!skill) return;
    setIsLoadingQuestions(true);
    setAssessmentError(null);
    try {
      // Dynamic AI generation (no static fallback)
      const generated = await requestSkillAssessment(
        skill.name,
        diff,
        isRetry ? { retakeSeed: `Retake-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` } : undefined
      );
      if (!generated || generated.length === 0) {
        throw new Error('AI assessment generation is temporarily unavailable. Please try again.');
      }
      setQuestions(generated);
      setIsTakingAssessment(true);
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setAssessmentCompleted(false);
    } catch (e: any) {
      console.warn('Failed to generate AI questions:', e);
      setAssessmentError(e?.message || 'AI assessment generation is temporarily unavailable. Please try again.');
      setIsTakingAssessment(false);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  // Auto-launch assessment if navigated with ?takeAssessment=true or ?autoStart=true
  useEffect(() => {
    if (typeof window !== 'undefined' && skill && !isTakingAssessment && !assessmentCompleted) {
      const searchParams = new URLSearchParams(window.location.search);
      if (
        searchParams.get('takeAssessment') === 'true' ||
        searchParams.get('autoStart') === 'true' ||
        searchParams.get('verify') === 'true'
      ) {
        loadAssessment();
      }
    }
  }, [skill?.id]);

  if (!skill) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Skill not found</h2>
        <Link
          href="/student/skills"
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-teal text-white rounded-xl text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Skills Hub
        </Link>
      </div>
    );
  }

  const totalQuestions = questions.length;

  // Handle answer selection
  const handleSelectOption = (questionIndex: number, optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  // Submit assessment
  const handleSubmitAssessment = async () => {
    setIsEvaluating(true);
    try {
      const sessionId = (questions as any)?.sessionId;
      const result = await submitAssessmentEvaluation(questions, selectedAnswers, skill.name, sessionId);
      setEvaluationResult(result);
      setAssessmentCompleted(true);
      verifySkill(skill.id, result.percentage, result);
    } catch (e) {
      console.error('Error submitting assessment:', e);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleRetryAssessment = () => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setAssessmentCompleted(false);
    setEvaluationResult(null);
    loadAssessment(true);
  };

  return (
    <div className="w-full max-w-[1820px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-8 space-y-8">
      {/* Back Button */}
      <Link
        href="/student/skills"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Skills Hub
      </Link>

      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{skill.icon}</span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {skill.name}
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                  {skill.level} Level
                </span>
                {skill.isVerified ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-extrabold border border-emerald-300 dark:border-emerald-800">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    ✓ AI Verified
                  </span>
                ) : skill.evidenceSource === 'resume' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 text-[11px] font-bold border border-blue-200 dark:border-blue-800">
                    📄 Resume Detected (Unverified)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[11px] font-bold border border-amber-200 dark:border-amber-800">
                    Claimed (Unverified)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{skill.category} &bull; Est. {skill.estimatedTime}</p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            {skill.description}
          </p>

          {/* Extracted Resume Evidence Snippet */}
          {skill.evidenceSnippet && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-300 max-w-2xl flex items-start gap-2.5">
              <FileText className="w-4 h-4 text-brand-teal shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                  Detected Resume Context
                </span>
                <span className="italic text-slate-600 dark:text-slate-400">&ldquo;{skill.evidenceSnippet}&rdquo;</span>
              </div>
            </div>
          )}
        </div>

        {/* Progress & Quick Assessment Action */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700 shrink-0 min-w-[240px] space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-500 dark:text-slate-400 font-semibold">Curriculum Progress</span>
              <span className="font-extrabold text-brand-teal">{skill.progress}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  skill.isVerified ? 'bg-emerald-600' : 'bg-brand-teal'
                }`}
                style={{ width: `${skill.progress}%` }}
              ></div>
            </div>
          </div>

          {/* Explicit Difficulty Selector */}
          <div className="space-y-1.5 pt-1 border-t border-slate-200 dark:border-slate-700">
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
              Assessment Difficulty
            </span>
            <div className="grid grid-cols-3 gap-1 bg-slate-200/80 dark:bg-slate-800 p-1 rounded-xl">
              {(['EASY', 'MEDIUM', 'HARD'] as const).map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`py-1 text-[11px] font-bold rounded-lg transition-all ${
                    selectedDifficulty === diff
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
              {selectedDifficulty === 'EASY' && 'Fundamental syntax & concepts (10–15 Qs)'}
              {selectedDifficulty === 'MEDIUM' && 'Applied concepts & debugging (10–15 Qs)'}
              {selectedDifficulty === 'HARD' && 'Advanced reasoning & architecture (10–15 Qs)'}
            </p>
            <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium pt-0.5">
              ✓ Direct Skill Verification &bull; No module prerequisites required
            </p>
          </div>

          {skill.isVerified ? (
            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-emerald-100/80 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-center text-xs font-bold text-emerald-900 dark:text-emerald-300">
                Verified: {skill.verifiedLevel || 'Intermediate'} &bull; {skill.verifiedDate || 'Aug 2026'}
              </div>
              <button
                type="button"
                onClick={() => loadAssessment(true, selectedDifficulty)}
                disabled={isLoadingQuestions}
                className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Re-take ({selectedDifficulty}) Assessment</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              disabled={isLoadingQuestions}
              onClick={() => loadAssessment(false, selectedDifficulty)}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 bg-gradient-to-r from-brand-teal to-emerald-600 text-white hover:shadow-md cursor-pointer"
            >
              {isLoadingQuestions ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Preparing ({selectedDifficulty}) Assessment...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Take ({selectedDifficulty}) Assessment</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* AI Generation Loading State */}
      {isLoadingQuestions && (
        <div className="p-8 bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-slate-900 dark:to-teal-950/40 rounded-3xl border border-teal-200 dark:border-teal-800 text-center space-y-3 animate-in fade-in shadow-sm">
          <Loader2 className="w-8 h-8 animate-spin text-brand-teal mx-auto" />
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Preparing Your AI Assessment...
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Creating personalized questions based on your selected skill and proficiency level.
          </p>
        </div>
      )}

      {/* AI Generation Error State */}
      {assessmentError && (
        <div className="p-5 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-300 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <div>
              <p className="font-bold text-amber-900 dark:text-amber-200">{assessmentError}</p>
              <p className="text-[11px] text-amber-700 dark:text-amber-400">Check your network connection or retry the assessment generation.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => loadAssessment(false)}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs shrink-0 transition-all shadow-xs cursor-pointer"
          >
            Retry Generation
          </button>
        </div>
      )}

      {/* 1. Assessment Interface Container */}
      {isTakingAssessment && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-brand-teal/30 dark:border-teal-500/30 p-6 sm:p-8 shadow-xl space-y-6 animate-in fade-in duration-300">
          {!assessmentCompleted ? (
            <div className="space-y-6">
              {/* Assessment Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-brand-teal/10 dark:bg-teal-950/60 text-brand-teal dark:text-teal-300 text-[11px] font-bold uppercase tracking-wider mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Adaptive SkillSetu Assessment
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {skill.name} Competency Assessment
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Question {currentQuestionIndex + 1} of {totalQuestions}
                  </span>
                  <div className="w-32 bg-slate-100 dark:bg-slate-800 rounded-full h-2 mt-1">
                    <div
                      className="bg-brand-teal h-2 rounded-full transition-all"
                      style={{
                        width: `${totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Current Question */}
              {questions[currentQuestionIndex] && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-brand-teal/10 text-brand-teal border border-brand-teal/20">
                        {questions[currentQuestionIndex].difficulty?.toUpperCase() || selectedDifficulty}
                      </span>
                      <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                        Topic: {questions[currentQuestionIndex].topic}
                      </span>
                    </div>

                    <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                      {questions[currentQuestionIndex].question}
                    </h4>

                    {/* Code Snippet if present */}
                    {questions[currentQuestionIndex].codeSnippet && (
                      <div className="my-3 p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed">
                        <pre>{questions[currentQuestionIndex].codeSnippet}</pre>
                      </div>
                    )}
                  </div>

                  {/* Options */}
                  <div className="space-y-2.5">
                    {questions[currentQuestionIndex].options.map((option, optIdx) => {
                      const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;
                      return (
                        <div
                          key={optIdx}
                          onClick={() => handleSelectOption(currentQuestionIndex, optIdx)}
                          className={`p-4 rounded-2xl border text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'bg-teal-50 dark:bg-teal-950/40 border-brand-teal text-brand-dark dark:text-teal-200 shadow-xs'
                              : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                                isSelected
                                  ? 'bg-brand-teal text-white'
                                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{option}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      disabled={currentQuestionIndex === 0}
                      onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
                    >
                      Previous
                    </button>

                    {currentQuestionIndex < totalQuestions - 1 ? (
                      <button
                        type="button"
                        onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                        className="px-5 py-2.5 rounded-xl bg-brand-teal hover:bg-brand-dark text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1"
                      >
                        Next Question
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={isEvaluating}
                        onClick={handleSubmitAssessment}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                      >
                        {isEvaluating ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Evaluating Submission...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            Submit Assessment
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Results View */
            <div className="text-center py-6 space-y-6">
              {evaluationResult && evaluationResult.passed ? (
                /* Passed Result */
                <div className="space-y-5 animate-in zoom-in-95">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>

                  <div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                      Skill Assessment Verified!
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-md mx-auto">
                      Congratulations! You scored <strong>{evaluationResult.score} / {totalQuestions}</strong> ({evaluationResult.percentage}%).
                    </p>
                  </div>

                  {/* Verified Credential Badge Card */}
                  <div className="p-5 rounded-2xl bg-gradient-to-b from-emerald-50 to-teal-50/50 dark:from-emerald-950/40 dark:to-teal-950/20 border-2 border-emerald-300 dark:border-emerald-700 max-w-sm mx-auto text-center space-y-2 shadow-xs">
                    <ShieldCheck className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
                    <span className="font-extrabold text-sm text-emerald-950 dark:text-emerald-300 block">
                      SkillSetu Verified Credential
                    </span>
                    <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/80 px-3 py-1 rounded-full inline-block">
                      Level: {evaluationResult.skillLevel} &bull; Score: {evaluationResult.percentage}%
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-emerald-200/60 dark:border-emerald-800/60 flex justify-between">
                      <span>Verified by SkillSetu AI</span>
                      <span>{evaluationResult.verifiedDate}</span>
                    </div>
                  </div>

                  {/* Strengths & Improvement Areas Breakdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto text-left text-xs">
                    <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-2">
                      <span className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        Demonstrated Strengths:
                      </span>
                      <ul className="space-y-1 text-emerald-800 dark:text-emerald-400">
                        {evaluationResult.strengths.map((str, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-emerald-500 mt-0.5">&bull;</span>
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                      <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4 text-amber-500" />
                        Recommended Focus Areas:
                      </span>
                      <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                        {evaluationResult.areasForImprovement.map((imp, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-amber-500 mt-0.5">&bull;</span>
                            <span>{imp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Dynamic Match Boost Banner */}
                  <div className="max-w-2xl mx-auto p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 text-left space-y-1">
                    <p className="font-bold flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      Dynamic Match Boost Activated:
                    </p>
                    <p className="text-slate-600 dark:text-slate-400">
                      Your verified <strong>{skill.name}</strong> badge has been added to your profile! Recruiter pipelines and internship match algorithms will now prioritize your application with an elevated match score.
                    </p>
                  </div>

                  {/* Disclaimer */}
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-md mx-auto italic flex items-center justify-center gap-1">
                    <Info className="w-3.5 h-3.5 shrink-0" />
                    <span>{evaluationResult.disclaimer}</span>
                  </p>

                  <div className="pt-2 flex flex-wrap justify-center gap-3">
                    <Link
                      href="/student/opportunities"
                      className="px-5 py-2.5 rounded-xl bg-brand-teal hover:bg-brand-dark text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                    >
                      <span>Check Boosted Opportunities</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/student/profile"
                      className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors"
                    >
                      View on Profile
                    </Link>
                  </div>
                </div>
              ) : (
                /* Failed Result */
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
                    <XCircle className="w-10 h-10" />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      Skill not verified yet
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      Your score: <strong>{evaluationResult?.score} / {totalQuestions}</strong> ({evaluationResult?.percentage}%). Minimum passing score for verification is 70%.
                    </p>
                  </div>

                  {evaluationResult?.areasForImprovement && evaluationResult.areasForImprovement.length > 0 && (
                    <div className="p-4 bg-rose-50 dark:bg-rose-950/30 rounded-2xl border border-rose-200 dark:border-rose-800 text-xs text-left max-w-md mx-auto">
                      <span className="font-bold text-rose-900 dark:text-rose-300 block mb-1">Recommended Topics to Review:</span>
                      <ul className="list-disc pl-4 space-y-0.5 text-rose-800 dark:text-rose-400">
                        {evaluationResult.areasForImprovement.map((topic, i) => (
                          <li key={i}>{topic}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="pt-2 flex justify-center gap-3">
                    <button
                      type="button"
                      onClick={handleRetryAssessment}
                      className="px-5 py-2.5 rounded-xl bg-brand-teal hover:bg-brand-dark text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Retry Assessment
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsTakingAssessment(false)}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                    >
                      Back to Resources
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 2. Learning Objectives */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-card space-y-3">
        <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-brand-teal" />
          Learning Objectives
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
          {skill.learningObjectives.map((obj, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">&bull;</span>
              <span>{obj}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Learning Resources Curriculum with Interactive Completion Toggles */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-card space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              Curriculum Modules &amp; Hands-on Practice
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Practice modules to explore topic depth. Assessments are always directly accessible to verify your skill.
            </p>
          </div>

          <span className="text-xs font-bold text-brand-teal bg-teal-50 dark:bg-teal-950/60 px-3 py-1 rounded-full border border-teal-200 dark:border-teal-800 shrink-0">
            {skill.resources.filter((r) => r.completed).length} of {skill.resources.length} Completed
          </span>
        </div>

        <div className="space-y-3">
          {skill.resources.map((res) => (
            <div
              key={res.id}
              onClick={() => toggleResourceCompletion(skill.id, res.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                res.completed
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors ${
                    res.completed
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-slate-300 dark:border-slate-600 hover:border-slate-400'
                  }`}
                >
                  {res.completed && <CheckCircle2 className="w-4 h-4" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{res.title}</span>
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {res.type}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" /> {res.duration}
                  </span>
                </div>
              </div>

              <span
                className={`text-xs font-semibold ${
                  res.completed ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {res.completed ? 'Completed' : 'Click to complete'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Career Roles Unlocked */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-brand-teal" />
              Eligible Career Roles for {skill.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Verified proficiency in {skill.name} unlocks candidate eligibility for these industry roles.
            </p>
          </div>
          <Link
            href="/student/opportunities"
            className="text-xs font-bold text-brand-teal hover:underline flex items-center gap-1"
          >
            Explore Matching Jobs <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex flex-wrap gap-2">
          {skill.careerRoles.map((role) => (
            <span
              key={role}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200/80 dark:border-slate-700"
            >
              {role}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
