'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useStudent } from '@/context/StudentContext';
import { AssessmentQuestion } from '@/types/student';
import { auth, getAiAppCheckHeaders } from '@/lib/firebase';
import {
  CheckCircle2,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Clock,
  Briefcase,
  XCircle,
  AlertCircle,
  Loader2,
  Check,
  ChevronDown,
  ChevronUp,
  Timer,
} from 'lucide-react';

const QUESTION_TIMER_SECONDS = 10;

/**
 * Randomly shuffles the 4 options of a question using Fisher-Yates
 * and maps correctIndex accordingly so answers are never predictable.
 */
function shuffleQuestionOptions(q: AssessmentQuestion): AssessmentQuestion {
  if (!q || !Array.isArray(q.options) || q.options.length < 2) return q;

  const validCorrectIdx =
    typeof q.correctIndex === 'number' && q.correctIndex >= 0 && q.correctIndex < q.options.length
      ? q.correctIndex
      : 0;

  const pairs = q.options.map((opt, idx) => ({ opt, isCorrect: idx === validCorrectIdx }));

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

export default function SkillDetailPage() {
  const params = useParams();
  const rawId = params.id as string;
  const { getSkillById, toggleResourceCompletion, verifySkill, updateSkillQuestions } = useStudent();

  const skill = getSkillById(rawId);

  // Dynamic question state
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [assessmentAttemptId, setAssessmentAttemptId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [generationSource, setGenerationSource] = useState<'gemini' | 'fallback' | null>(null);

  // Assessment flow state
  const [isTakingAssessment, setIsTakingAssessment] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [assessmentCompleted, setAssessmentCompleted] = useState(false);
  const [showExplanationIndex, setShowExplanationIndex] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(QUESTION_TIMER_SECONDS);
  const [scoreResult, setScoreResult] = useState<{
    score: number;
    passed: boolean;
    percentage: number;
    weakTopics: string[];
  } | null>(null);

  const loadedSkillIdRef = useRef<string | null>(null);
  const hasAutoStartedRef = useRef<boolean>(false);

  // Sync questions from skill on initial load with shuffled options
  useEffect(() => {
    if (skill && loadedSkillIdRef.current !== skill.id) {
      loadedSkillIdRef.current = skill.id;
      if (skill.assessmentQuestions && skill.assessmentQuestions.length > 0) {
        setQuestions(skill.assessmentQuestions.map(shuffleQuestionOptions));
      }
    }
  }, [skill]);

  // Reset 10s timer whenever question index changes
  useEffect(() => {
    if (isTakingAssessment && !assessmentCompleted) {
      setTimeLeft(QUESTION_TIMER_SECONDS);
    }
  }, [currentQuestionIndex, isTakingAssessment, assessmentCompleted]);

  // Countdown timer: 10s per question
  useEffect(() => {
    if (!isTakingAssessment || assessmentCompleted || isGenerating) return;

    // Stop timer if current question is already answered
    if (selectedAnswers[currentQuestionIndex] !== undefined) return;

    if (timeLeft <= 0) {
      // Time's up: auto-lock question as unanswered (-1) to reveal correct answer
      setSelectedAnswers((prev) => ({
        ...prev,
        [currentQuestionIndex]: -1,
      }));
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [isTakingAssessment, assessmentCompleted, isGenerating, timeLeft, currentQuestionIndex, selectedAnswers]);

  // Handler to fetch/generate 10 questions using Gemini API
  const handleStartAssessment = useCallback(async () => {
    if (!skill) return;

    setIsTakingAssessment(true);
    setAssessmentCompleted(false);
    setSelectedAnswers({});
    setAssessmentAttemptId(null);
    setCurrentQuestionIndex(0);
    setScoreResult(null);
    setShowExplanationIndex(null);
    setTimeLeft(QUESTION_TIMER_SECONDS);

    setGenerationError(null);
    setIsGenerating(true);

    try {
      if (!auth?.currentUser) throw new Error('Sign in to generate an assessment.');
      const res = await fetch('/api/skills/generate-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${await auth.currentUser.getIdToken()}`, ...await getAiAppCheckHeaders() },
        body: JSON.stringify({
          skillId: skill.id,
          skillName: skill.name,
          skillTier: skill.tier,
          skillCategory: skill.category,
          topics: (skill.resources || []).map((r) => r.topic || r.title).filter(Boolean),
        }),
      });

      const data = await res.json();
      if (res.ok && Array.isArray(data.questions) && data.questions.length === 10 && typeof data.attemptId === 'string') {
        setAssessmentAttemptId(data.attemptId);
        setQuestions(data.questions);
        setGenerationSource(data.source === 'gemini' ? 'gemini' : 'fallback');
        updateSkillQuestions(skill.id, data.questions);
      } else {
        throw new Error(data.error || 'Failed to receive questions from assessment engine.');
      }
    } catch (err) {
      console.warn('[Assessment] Question generation failed:', err);
      setGenerationError(err instanceof Error ? err.message : 'Could not generate questions');
      setIsTakingAssessment(false);
    } finally {
      setIsGenerating(false);
      setTimeLeft(QUESTION_TIMER_SECONDS);
    }
  }, [skill, updateSkillQuestions]);

  // Auto-launch assessment if ?start=true was passed in the URL (e.g. from Resume Skill cards)
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      skill &&
      !hasAutoStartedRef.current &&
      !isTakingAssessment &&
      !assessmentCompleted
    ) {
      const search = new URLSearchParams(window.location.search);
      if (search.get('start') === 'true') {
        hasAutoStartedRef.current = true;
        handleStartAssessment();
      }
    }
  }, [skill, isTakingAssessment, assessmentCompleted, handleStartAssessment]);

  const totalQuestions = questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const currentQuestion = questions[currentQuestionIndex];
  const isCurrentAnswered = currentQuestion && selectedAnswers[currentQuestionIndex] !== undefined;
  const currentChoice = currentQuestion ? selectedAnswers[currentQuestionIndex] : undefined;
  const isCurrentCorrect = assessmentCompleted && currentQuestion && currentChoice === currentQuestion.correctIndex;

  const handleSelectOption = (questionIndex: number, optionIndex: number) => {
    // If already answered, do not allow changing answer
    if (selectedAnswers[questionIndex] !== undefined) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  const handleSubmitAssessment = async () => {
    if (!skill || totalQuestions !== 10 || answeredCount !== totalQuestions || !assessmentAttemptId || isSubmitting) return;

    setIsSubmitting(true);
    setGenerationError(null);
    try {
      const user = auth?.currentUser;
      if (!user) throw new Error('Sign in to verify your assessment.');

      const res = await fetch('/api/skills/submit-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await user.getIdToken()}`,
          ...(await getAiAppCheckHeaders()),
        },
        body: JSON.stringify({
          skillId: skill.id,
          attemptId: assessmentAttemptId,
          answers: selectedAnswers,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Assessment submission failed.');
      }

      const percentage = typeof data.percentage === 'number' ? data.percentage : 0;
      const passed = Boolean(data.passed);
      const weakTopics = Array.isArray(data.weakTopics) ? data.weakTopics : [];
      const score = typeof data.score === 'number' ? data.score : 0;
      if (!Array.isArray(data.questionResults) || data.questionResults.length !== totalQuestions) {
        throw new Error('The server returned an incomplete assessment result. Please generate a new assessment.');
      }

      setQuestions((previous) => previous.map((question, index) => ({
        ...question,
        correctIndex: data.questionResults[index].correctIndex,
        explanation: data.questionResults[index].explanation,
      })));

      setScoreResult({
        score,
        percentage,
        passed,
        weakTopics,
      });

      setAssessmentCompleted(true);
      verifySkill(skill.id, percentage);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Assessment verification failed.';
      setGenerationError(message);
      setAssessmentCompleted(false);
      setScoreResult(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!skill) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Skill not found</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          The requested skill could not be located in your syllabus. Return to the Skills Hub to select an active skill path.
        </p>
        <Link
          href="/student/skills"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-teal text-white rounded-xl text-xs font-semibold shadow-sm hover:bg-brand-dark transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Skills Hub
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      {/* Back Button */}
      <Link
        href="/student/skills"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to All Skills
      </Link>

      {/* Header Banner */}
      <div className="w-full bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{skill.icon || '⚡'}</span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {skill.name}
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
                  {skill.level} Level
                </span>
                {skill.isVerified && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold border border-emerald-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    ✓ Verified Skill
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {skill.category} &bull; {skill.estimatedTime || 'Self-paced'}
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            {skill.description}
          </p>
        </div>

        {/* Progress & Quick Assessment Action */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 shrink-0 min-w-[260px] space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-500 font-semibold">Curriculum Progress</span>
              <span className="font-extrabold text-brand-teal">{skill.progress}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  skill.isVerified ? 'bg-emerald-600' : 'bg-brand-teal'
                }`}
                style={{ width: `${skill.progress}%` }}
              ></div>
            </div>
          </div>

          {skill.isVerified ? (
            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-emerald-100/80 border border-emerald-300 text-center text-xs font-bold text-emerald-900 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                Verified &bull; {skill.verifiedDate || 'Recently Verified'}
              </div>
              <button
                type="button"
                onClick={() => handleStartAssessment()}
                className="w-full py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-brand-teal" />
                <span>Practice / Retake AI Assessment</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => handleStartAssessment()}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 bg-gradient-to-r from-teal-700 to-emerald-600 hover:from-teal-800 hover:to-emerald-700 text-white hover:scale-102"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Take 10-Question AI Assessment</span>
            </button>
          )}
        </div>
      </div>

      {/* Interactive Assessment Experience */}
      {generationError && (
        <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {generationError}
        </div>
      )}

      {isTakingAssessment && (
        <div id="assessment-section" className="w-full bg-white rounded-3xl border-2 border-brand-teal p-6 sm:p-8 shadow-xl space-y-6 animate-in fade-in">
          {isGenerating ? (
            /* AI Question Generation Loading State */
            <div className="py-12 px-4 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-teal-50 border border-teal-200 text-brand-teal flex items-center justify-center mx-auto shadow-sm">
                <Sparkles className="w-8 h-8 text-teal-600 animate-pulse" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700 flex items-center justify-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Gemini AI Assessment Engine
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  Crafting 10 Tailored Questions for {skill.name}...
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
                  Generating real-world code problems, edge cases, and industry standards matching the {skill.level} proficiency benchmark.
                </p>
              </div>
            </div>
          ) : !assessmentCompleted ? (
            /* Active 10-Question Quiz */
            <div className="space-y-6">
              {/* Tracker Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-brand-teal uppercase tracking-wider">
                      Official SkillSetu Assessment
                    </span>
                    {generationSource === 'gemini' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-[10px] font-bold text-indigo-700">
                        <Sparkles className="w-3 h-3 text-indigo-500" />
                        Gemini AI Generated
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                    {skill.name} Competency Test
                  </h3>
                </div>

                {/* 10s Timer + Progress */}
                <div className="flex items-center gap-3">
                  {!isCurrentAnswered ? (
                    <div
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors shadow-xs ${
                        timeLeft <= 3
                          ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
                          : timeLeft <= 5
                          ? 'bg-amber-50 border-amber-300 text-amber-700'
                          : 'bg-teal-50 border-teal-300 text-teal-800'
                      }`}
                    >
                      <Timer className={`w-3.5 h-3.5 ${timeLeft <= 3 ? 'text-rose-600 animate-spin' : 'text-teal-600'}`} />
                      <span>{timeLeft}s remaining</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Answered</span>
                    </div>
                  )}

                  <div className="text-right">
                    <span className="text-xs font-semibold text-slate-500">
                      Answered {answeredCount} of {totalQuestions}
                    </span>
                    <div className="w-28 bg-slate-100 rounded-full h-2 mt-1">
                      <div
                        className="bg-brand-teal h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 10s Progress Bar (Shrinks across the 10s) */}
              {!isCurrentAnswered && (
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ease-linear ${
                      timeLeft <= 3
                        ? 'bg-rose-500'
                        : timeLeft <= 5
                        ? 'bg-amber-500'
                        : 'bg-brand-teal'
                    }`}
                    style={{ width: `${(timeLeft / QUESTION_TIMER_SECONDS) * 100}%` }}
                  ></div>
                </div>
              )}

              {/* Question Navigation Bar (1 through 10) */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {questions.map((q, idx) => {
                  const isCurrent = idx === currentQuestionIndex;
                  const isAnswered = selectedAnswers[idx] !== undefined;
                  const userChoice = selectedAnswers[idx];
                  const isCorrectChoice = assessmentCompleted && userChoice === q.correctIndex;

                  let navBtnClass = 'bg-slate-100 text-slate-600 hover:bg-slate-200';
                  if (isCurrent) {
                    navBtnClass = 'bg-brand-teal text-white shadow-sm ring-2 ring-brand-teal/30 ring-offset-1';
                  } else if (assessmentCompleted && isAnswered) {
                    if (isCorrectChoice) {
                      navBtnClass = 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold';
                    } else {
                      navBtnClass = 'bg-rose-100 text-rose-800 border border-rose-300 font-bold';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`min-w-[36px] h-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shrink-0 ${navBtnClass}`}
                    >
                      <span>{idx + 1}</span>
                      {isAnswered && !isCurrent && (
                        isCorrectChoice ? (
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        ) : (
                          <XCircle className="w-2.5 h-2.5 text-rose-600" />
                        )
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Current Question Card */}
              {currentQuestion ? (
                <div className="space-y-4">
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                        Topic: {currentQuestion.topic}
                      </span>
                      <span className="text-slate-400">
                        Question {currentQuestionIndex + 1} of {totalQuestions}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 leading-snug">
                      {currentQuestion.question}
                    </h4>
                  </div>

                  {/* 4 Options with Instant Green/Red Highlighting */}
                  <div className="space-y-3">
                    {(currentQuestion.options || []).map((opt, optIdx) => {
                      const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;
                      const isCorrect = assessmentCompleted && optIdx === currentQuestion.correctIndex;
                      const isUserWrong = isSelected && !isCorrect;
                      const optionLetters = ['A', 'B', 'C', 'D'];

                      let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300';
                      let badgeStyle = 'bg-slate-100 text-slate-600 group-hover:bg-slate-200';

                      if (assessmentCompleted && isCurrentAnswered) {
                        if (isCorrect) {
                          // Correct option is ALWAYS highlighted in GREEN
                          btnStyle = 'bg-emerald-50/90 border-2 border-emerald-500 text-emerald-950 shadow-sm';
                          badgeStyle = 'bg-emerald-600 text-white';
                        } else if (isUserWrong) {
                          // Wrong option chosen by user is highlighted in RED
                          btnStyle = 'bg-rose-50/90 border-2 border-rose-500 text-rose-950 shadow-sm';
                          badgeStyle = 'bg-rose-600 text-white';
                        } else {
                          // Other neutral unselected options
                          btnStyle = 'bg-slate-50/50 border-slate-200 text-slate-400 opacity-60 cursor-not-allowed';
                          badgeStyle = 'bg-slate-200 text-slate-400';
                        }
                      } else if (isCurrentAnswered && isSelected) {
                        btnStyle = 'bg-teal-50 border-2 border-brand-teal text-teal-950';
                        badgeStyle = 'bg-brand-teal text-white';
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          disabled={isCurrentAnswered}
                          onClick={() => handleSelectOption(currentQuestionIndex, optIdx)}
                          className={`w-full p-4 rounded-2xl border text-left text-xs font-semibold transition-all flex items-center justify-between group ${btnStyle}`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-7 h-7 rounded-xl text-xs font-bold flex items-center justify-center shrink-0 transition-colors ${badgeStyle}`}
                            >
                              {isCurrentAnswered && isCorrect ? (
                                <Check className="w-4 h-4 stroke-[3]" />
                              ) : isCurrentAnswered && isUserWrong ? (
                                <XCircle className="w-4 h-4" />
                              ) : (
                                optionLetters[optIdx]
                              )}
                            </span>
                            <span className="leading-relaxed text-sm">{opt}</span>
                          </div>

                          <div className="shrink-0 ml-3 flex items-center gap-1.5">
                            {assessmentCompleted && isCurrentAnswered && isCorrect && (
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                                ✓ Correct Answer
                              </span>
                            )}
                            {assessmentCompleted && isCurrentAnswered && isUserWrong && (
                              <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[11px] font-bold">
                                ✗ Your Choice
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Instant Explanation Box Displayed Immediately Upon Selection */}
                    {assessmentCompleted && isCurrentAnswered && (
                    <div
                      className={`p-4 rounded-2xl border text-xs space-y-2 animate-in fade-in duration-200 ${
                        isCurrentCorrect
                          ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                          : 'bg-rose-50/80 border-rose-300 text-rose-950'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold flex items-center gap-1.5 text-sm">
                          {isCurrentCorrect ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span className="text-emerald-800">Correct! Great answer.</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-rose-600" />
                              <span className="text-rose-800">
                                {selectedAnswers[currentQuestionIndex] === -1
                                  ? "Time Expired! (10s limit reached)"
                                  : "Incorrect choice."}
                              </span>
                            </>
                          )}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500">
                          Topic: {currentQuestion.topic}
                        </span>
                      </div>

                      <p className="leading-relaxed text-slate-700 pt-1.5 border-t border-slate-200/70">
                        <strong className="text-slate-900">Technical Rationale: </strong>
                        {currentQuestion.explanation}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500">
                  <p className="text-sm font-semibold">No questions available for this module.</p>
                  <button
                    type="button"
                    onClick={() => handleStartAssessment()}
                    className="mt-3 px-4 py-2 bg-brand-teal text-white text-xs font-bold rounded-xl"
                  >
                    Generate 10 Questions with AI
                  </button>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold ${
                    currentQuestionIndex === 0
                      ? 'text-slate-300 cursor-not-allowed'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Previous
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsTakingAssessment(false)}
                    className="px-4 py-2 rounded-xl text-xs text-slate-500 hover:text-slate-800"
                  >
                    Exit Test
                  </button>

                  {totalQuestions > 0 && (
                    currentQuestionIndex < totalQuestions - 1 ? (
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentQuestionIndex((prev) => Math.min(totalQuestions - 1, prev + 1))
                        }
                        className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 ${
                          isCurrentAnswered
                            ? 'bg-brand-teal hover:bg-brand-dark text-white ring-2 ring-brand-teal/20'
                            : 'bg-brand-teal text-white hover:bg-brand-dark'
                        }`}
                      >
                        <span>Next Question</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={answeredCount !== totalQuestions || !assessmentAttemptId || isSubmitting}
                        onClick={handleSubmitAssessment}
                        className={`px-6 py-2.5 rounded-xl text-white text-xs font-bold shadow-md transition-all ${
                          answeredCount === totalQuestions
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:scale-102 ring-2 ring-emerald-500/20'
                            : 'bg-emerald-600 hover:bg-emerald-700'
                        }`}
                      >
                        {isSubmitting ? 'Checking answers...' : `Finish & View Results (${answeredCount}/${totalQuestions})`}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Results Screen */
            <div className="p-4 sm:p-6 text-center space-y-6">
              {scoreResult?.passed ? (
                <div className="space-y-6">
                  <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner animate-bounce">
                    <ShieldCheck className="w-12 h-12" />
                  </div>

                  <div>
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                      Assessment Passed!
                    </span>
                    <h3 className="text-2xl font-black text-slate-900 mt-1">
                      Official SkillSetu Verified Badge Unlocked
                    </h3>
                    <p className="text-xs text-slate-600 mt-1">
                      You scored <strong>{scoreResult.score} / {totalQuestions}</strong> ({scoreResult.percentage}%). Minimum passing score was 70% (7/10).
                    </p>
                  </div>

                  {/* The Official Verified Badge Card */}
                  <div className="max-w-md mx-auto p-6 rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50 to-white border-2 border-emerald-400 shadow-lg text-center space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-xs">
                      <CheckCircle2 className="w-4 h-4" />
                      ✓ VERIFIED SKILL
                    </div>
                    <div className="text-2xl font-black text-slate-900">{skill.name}</div>
                    <div className="text-xs font-semibold text-slate-600">{skill.level} Level Competency</div>
                    <div className="text-[11px] text-slate-400 pt-2 border-t border-emerald-200/60 flex justify-between">
                      <span>Verified by SkillSetu</span>
                      <span>
                        {new Date().toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Impact Notice */}
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 text-left space-y-1">
                    <p className="font-bold flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      Dynamic Match Boost Activated:
                    </p>
                    <p className="text-emerald-800">
                      Your verified {skill.name} competency granted an instant <strong>+6% bonus boost</strong> to related opportunities! This credential is now visible to recruiters on your profile.
                    </p>
                  </div>

                  <div className="pt-2 flex flex-wrap justify-center gap-3">
                    <Link
                      href="/student/opportunities"
                      className="px-5 py-2.5 rounded-xl bg-brand-teal hover:bg-brand-dark text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                    >
                      <span>Check Boosted Opportunities</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleStartAssessment()}
                      className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retake with Fresh AI Questions</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Failed Result */
                <div className="space-y-6">
                  <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                    <XCircle className="w-10 h-10" />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      Skill not verified yet
                    </h3>
                    <p className="text-xs text-slate-600 mt-1">
                      Your score: <strong>{scoreResult?.score} / {totalQuestions}</strong> ({scoreResult?.percentage}%). Minimum passing score is 70% (7/10).
                    </p>
                  </div>

                  {scoreResult?.weakTopics && scoreResult.weakTopics.length > 0 && (
                    <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 text-xs text-left">
                      <span className="font-bold text-rose-900 block mb-1">Recommended Topics to Review:</span>
                      <ul className="list-disc pl-4 space-y-0.5 text-rose-800">
                        {scoreResult.weakTopics.map((topic, i) => (
                          <li key={i}>{topic}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="pt-2 flex flex-wrap justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleStartAssessment()}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-700 to-emerald-600 hover:from-teal-800 hover:to-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-md hover:scale-102 transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Generate New Questions with AI &amp; Retry</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsTakingAssessment(false);
                        const el = document.getElementById('curriculum-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors"
                    >
                      Review Learning Modules
                    </button>
                  </div>
                </div>
              )}

              {/* In-Depth Question Review & Explanations */}
              <div className="pt-6 border-t border-slate-200 text-left space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-brand-teal" />
                    Review All 10 Questions &amp; Detailed Explanations
                  </h4>
                  <span className="text-xs text-slate-400">
                    Click any question to view the full explanation
                  </span>
                </div>

                <div className="space-y-3">
                  {questions.map((q, idx) => {
                    const studentChoice = selectedAnswers[idx];
                    const isCorrect = studentChoice === q.correctIndex;
                    const isExpanded = showExplanationIndex === idx;

                    return (
                      <div
                        key={idx}
                        className={`rounded-2xl border p-4 transition-all ${
                          isCorrect
                            ? 'bg-emerald-50/40 border-emerald-200'
                            : studentChoice !== undefined
                            ? 'bg-rose-50/40 border-rose-200'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div
                          className="flex items-start justify-between gap-3 cursor-pointer"
                          onClick={() =>
                            setShowExplanationIndex(isExpanded ? null : idx)
                          }
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  isCorrect
                                    ? 'bg-emerald-200 text-emerald-900'
                                    : 'bg-rose-200 text-rose-900'
                                }`}
                              >
                                {isCorrect ? 'Correct' : studentChoice === -1 ? 'Time Expired' : 'Incorrect'}
                              </span>
                              <span className="text-xs font-semibold text-slate-500">
                                Question {idx + 1} &bull; {q.topic}
                              </span>
                            </div>
                            <p className="text-xs sm:text-sm font-bold text-slate-900">
                              {q.question}
                            </p>
                          </div>

                          <div className="shrink-0 text-slate-400 mt-1">
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </div>
                        </div>

                        {/* Candidate selection vs correct answer */}
                        <div className="mt-3 pt-3 border-t border-slate-200/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div className="p-2.5 rounded-xl bg-white/80 border border-slate-200">
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">
                              Your Answer
                            </span>
                            <span
                              className={`font-semibold ${
                                isCorrect ? 'text-emerald-700' : 'text-rose-700'
                              }`}
                            >
                              {studentChoice !== undefined && studentChoice >= 0
                                ? q.options?.[studentChoice] || 'None'
                                : studentChoice === -1
                                ? '⏰ Timed out (No answer)'
                                : 'Unanswered'}
                            </span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-white/80 border border-slate-200">
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">
                              Correct Answer
                            </span>
                            <span className="font-semibold text-emerald-800">
                              {q.options?.[q.correctIndex] || 'N/A'}
                            </span>
                          </div>
                        </div>

                        {/* Expandable Explanation */}
                        {isExpanded && (
                          <div className="mt-3 p-3 rounded-xl bg-white border border-teal-200 text-xs text-slate-700 space-y-1">
                            <span className="font-bold text-brand-teal flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                              Technical Explanation:
                            </span>
                            <p className="leading-relaxed text-slate-600">
                              {q.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. Learning Objectives (if catalog skill has them) */}
      {(skill.learningObjectives || []).length > 0 && (
        <div className="w-full bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card space-y-3">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-brand-teal" />
            Learning Objectives
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
            {skill.learningObjectives.map((obj, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold mt-0.5">&bull;</span>
                <span>{obj}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Learning Resources Curriculum (if catalog skill has them) */}
      {(skill.resources || []).length > 0 ? (
        <div id="curriculum-section" className="w-full bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-lg text-slate-900">
                Curriculum Modules &amp; Hands-on Practice
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Mark modules as completed to advance your curriculum progress.
              </p>
            </div>

            <span className="text-xs font-bold text-brand-teal bg-teal-50 px-3 py-1 rounded-full border border-teal-200 shrink-0">
              {(skill.resources || []).filter((r) => r.completed).length} of {(skill.resources || []).length} Completed
            </span>
          </div>

          <div className="space-y-3">
            {(skill.resources || []).map((res) => (
              <div
                key={res.id}
                onClick={() => toggleResourceCompletion(skill.id, res.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  res.completed
                    ? 'bg-emerald-50/40 border-emerald-200'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors ${
                      res.completed
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    {res.completed && <CheckCircle2 className="w-4 h-4" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{res.title}</span>
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {res.type}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" /> {res.duration}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-xs font-semibold ${
                    res.completed ? 'text-emerald-700' : 'text-slate-400'
                  }`}
                >
                  {res.completed ? 'Completed' : 'Click to complete'}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Resume Skill Evidence & Direct Assessment Guide */
        <div className="w-full bg-gradient-to-r from-teal-50 via-slate-50 to-emerald-50 rounded-3xl border border-teal-200 p-6 sm:p-8 shadow-card space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-brand-teal text-white text-[11px] font-bold">
              Resume-Extracted Competency
            </span>
            <span className="text-xs text-slate-500">Student Evidence Registry</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Resume Skill Verification: {skill.name}
            </h3>
            {skill.resumeEvidence && (
              <div className="mt-2 text-xs text-slate-700 bg-white/90 p-3 rounded-2xl border border-slate-200">
                <span className="font-bold text-slate-500 block uppercase text-[10px] tracking-wider mb-0.5">
                  Verified Resume Excerpt:
                </span>
                “{skill.resumeEvidence}”
              </div>
            )}
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Resume skills begin as unverified claims carrying a 0.75× match factor. Taking this 10-question AI assessment generates formal verification, unlocks the official SkillSetu badge, and activates a +6% opportunity match boost.
            </p>
          </div>
          {!isTakingAssessment && !skill.isVerified && (
            <button
              type="button"
              onClick={() => handleStartAssessment()}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-700 to-emerald-600 hover:from-teal-800 hover:to-emerald-700 text-white text-xs font-bold shadow-md hover:scale-102 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Launch 10-Question Gemini Verification Quiz</span>
            </button>
          )}
        </div>
      )}

      {/* 4. Career Roles Unlocked */}
      <div className="w-full bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-brand-teal" />
              Eligible Career Roles for {skill.name}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
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
          {(skill.careerRoles || []).map((role) => (
            <span
              key={role}
              className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200/80"
            >
              {role}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
