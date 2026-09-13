'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useStudent } from '@/context/StudentContext';
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
  AlertCircle
} from 'lucide-react';

export default function SkillDetailPage() {
  const params = useParams();
  const router = useRouter();
  const skillId = params.id as string;
  const { getSkillById, toggleResourceCompletion, verifySkill } = useStudent();

  const skill = getSkillById(skillId);

  // Assessment state
  const [isTakingAssessment, setIsTakingAssessment] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [assessmentCompleted, setAssessmentCompleted] = useState(false);
  const [scoreResult, setScoreResult] = useState<{
    score: number;
    passed: boolean;
    percentage: number;
    weakTopics: string[];
  } | null>(null);

  if (!skill) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Skill not found</h2>
        <Link
          href="/student/skills"
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-teal text-white rounded-xl text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Skills Hub
        </Link>
      </div>
    );
  }

  const questions = skill.assessmentQuestions || [];
  const totalQuestions = questions.length;
  const isAssessmentReady = skill.progress >= 80 || skill.isVerified;

  // Handle answer selection
  const handleSelectOption = (questionIndex: number, optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  // Submit assessment
  const handleSubmitAssessment = () => {
    let correctCount = 0;
    const weakTopicsList: string[] = [];

    questions.forEach((q, idx) => {
      const chosen = selectedAnswers[idx];
      if (chosen === q.correctIndex) {
        correctCount++;
      } else {
        if (!weakTopicsList.includes(q.topic)) {
          weakTopicsList.push(q.topic);
        }
      }
    });

    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const passed = percentage >= 70;

    setScoreResult({
      score: correctCount,
      percentage,
      passed,
      weakTopics: weakTopicsList,
    });

    setAssessmentCompleted(true);
    verifySkill(skill.id, percentage);
  };

  const handleRetryAssessment = () => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setAssessmentCompleted(false);
    setScoreResult(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      {/* Back Button */}
      <Link
        href="/student/skills"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to All Skills
      </Link>

      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{skill.icon}</span>
            <div>
              <div className="flex items-center gap-2">
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
              <p className="text-xs text-slate-500 mt-0.5">{skill.category} &bull; Est. {skill.estimatedTime}</p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            {skill.description}
          </p>
        </div>

        {/* Progress & Quick Assessment Action */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 shrink-0 min-w-[240px] space-y-3">
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
            <div className="p-2.5 rounded-xl bg-emerald-100/80 border border-emerald-300 text-center text-xs font-bold text-emerald-900">
              Verified by SkillSetu &bull; {skill.verifiedDate || 'Aug 2026'}
            </div>
          ) : (
            <button
              type="button"
              disabled={!isAssessmentReady}
              onClick={() => {
                setIsTakingAssessment(true);
                setAssessmentCompleted(false);
              }}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 ${
                isAssessmentReady
                  ? 'bg-brand-emerald hover:bg-emerald-600 text-white shadow-md hover:scale-102'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>{isAssessmentReady ? 'Take Assessment Now' : 'Complete 80% to Unlock'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Interactive Assessment Modal or Full Experience */}
      {isTakingAssessment && (
        <div className="bg-white rounded-3xl border-2 border-brand-teal p-6 sm:p-8 shadow-xl space-y-6 animate-in fade-in">
          {!assessmentCompleted ? (
            <div className="space-y-6">
              {/* Tracker Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-bold text-brand-teal uppercase tracking-wider">
                    Official SkillSetu Assessment
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                    {skill.name} Basic Competency Test
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-slate-500">
                    Question {currentQuestionIndex + 1} of {totalQuestions}
                  </span>
                  <div className="w-32 bg-slate-100 rounded-full h-2 mt-1">
                    <div
                      className="bg-brand-teal h-2 rounded-full transition-all"
                      style={{
                        width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Question Content */}
              {questions[currentQuestionIndex] && (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Topic: {questions[currentQuestionIndex].topic}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 mt-1">
                      {questions[currentQuestionIndex].question}
                    </h4>
                  </div>

                  {/* Options */}
                  <div className="space-y-2.5">
                    {questions[currentQuestionIndex].options.map((opt, optIdx) => {
                      const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;
                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelectOption(currentQuestionIndex, optIdx)}
                          className={`w-full p-4 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-brand-teal/10 border-brand-teal text-brand-teal font-bold shadow-xs'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span>{opt}</span>
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected
                                ? 'border-brand-teal bg-brand-teal text-white'
                                : 'border-slate-300'
                            }`}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                          </div>
                        </button>
                      );
                    })}
                  </div>
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
                    Save &amp; Exit
                  </button>

                  {currentQuestionIndex < totalQuestions - 1 ? (
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentQuestionIndex((prev) => Math.min(totalQuestions - 1, prev + 1))
                      }
                      className="px-5 py-2 rounded-xl bg-brand-teal hover:bg-brand-dark text-white text-xs font-bold transition-all shadow-xs"
                    >
                      Next Question
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmitAssessment}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-emerald to-emerald-600 text-white text-xs font-bold shadow-md hover:scale-102 transition-all"
                    >
                      Submit Assessment
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Results Screen */
            <div className="p-6 text-center space-y-6">
              {scoreResult?.passed ? (
                <div className="space-y-4">
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
                      You scored <strong>{scoreResult.score} / {totalQuestions}</strong> ({scoreResult.percentage}%). Passing score was 70%.
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
                      <span>{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>

                  {/* Impact Notice */}
                  <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-800 text-left space-y-1">
                    <p className="font-bold flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      Dynamic Match Boost Activated:
                    </p>
                    <p className="text-slate-600">
                      Your verified Python skill increased your local internship match score from <strong>62% to 87%</strong>! This badge is now live on your Resume and Student Profile.
                    </p>
                  </div>

                  <div className="pt-3 flex flex-wrap justify-center gap-3">
                    <Link
                      href="/student/opportunities"
                      className="px-5 py-2.5 rounded-xl bg-brand-teal hover:bg-brand-dark text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                    >
                      <span>Check Boosted Opportunities</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/student/resume"
                      className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                    >
                      View on Resume
                    </Link>
                  </div>
                </div>
              ) : (
                /* Failed Result */
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                    <XCircle className="w-10 h-10" />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      Skill not verified yet
                    </h3>
                    <p className="text-xs text-slate-600 mt-1">
                      Your score: <strong>{scoreResult?.score} / {totalQuestions}</strong> ({scoreResult?.percentage}%). Minimum passing score is 70%.
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
                      className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
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
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-card space-y-3">
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

      {/* 3. Learning Resources Curriculum with Interactive Completion Toggles */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card space-y-5">
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
            {skill.resources.filter((r) => r.completed).length} of {skill.resources.length} Completed
          </span>
        </div>

        <div className="space-y-3">
          {skill.resources.map((res, index) => (
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

      {/* 4. Career Roles Unlocked */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-card space-y-4">
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
          {skill.careerRoles.map((role) => (
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
