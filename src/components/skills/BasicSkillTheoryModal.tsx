'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  X,
  BookOpen,
  Code2,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Workflow,
  Copy,
  Check,
  Briefcase,
  HelpCircle,
  ExternalLink,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { SkillItem } from '@/data/skillsData';
import { getBasicSkillTheory } from '@/data/basicSkillsTheoryData';

interface BasicSkillTheoryModalProps {
  skill: SkillItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BasicSkillTheoryModal: React.FC<BasicSkillTheoryModalProps> = ({
  skill,
  isOpen,
  onClose,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'concepts' | 'syntax' | 'workflow' | 'examples' | 'mistakes' | 'interview'
  >('overview');

  if (!isOpen || !skill) return null;

  const theory = getBasicSkillTheory(skill);

  const handleCopyCode = (text: string, index: number) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2500);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4 bg-gradient-to-r from-slate-50 via-white to-teal-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-850">
          <div className="flex items-start gap-3.5">
            <span className="text-3xl p-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-xs leading-none">
              {skill.icon}
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {skill.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-brand-teal/10 dark:bg-teal-950/60 text-brand-teal dark:text-teal-300 text-xs font-bold border border-brand-teal/20">
                  Basic &bull; {skill.category}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Structured Beginner Theoretical Notes &bull; Technical Foundations &bull; CSE Placement Prep
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Navigation Tabs for Quick Scanning */}
        <div className="px-5 sm:px-6 pt-3 pb-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/50 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs font-semibold">
          {[
            { id: 'overview', label: '1. Overview & Importance' },
            { id: 'concepts', label: '2. Core Concepts' },
            { id: 'syntax', label: '3. Syntax & Structure' },
            { id: 'workflow', label: '4. How It Works' },
            { id: 'examples', label: '5. Examples' },
            { id: 'mistakes', label: '6. Common Mistakes' },
            { id: 'interview', label: '7. Interview Key Points' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-brand-teal text-white shadow-2xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-7 text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
          {/* TAB 1: OVERVIEW & IMPORTANCE */}
          {(activeTab === 'overview' || activeTab === 'concepts') && (
            <div className="space-y-6">
              {/* Section 1: What is [Skill]? */}
              <div className="bg-slate-50 dark:bg-slate-850/70 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-brand-teal dark:text-teal-400 font-bold text-xs uppercase tracking-wider">
                  <BookOpen className="w-4 h-4" />
                  <span>1. What is {skill.name}?</span>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-sans">
                  {theory.whatIs}
                </p>
              </div>

              {/* Section 2: Why is it important? */}
              <div className="bg-teal-50/60 dark:bg-teal-950/30 rounded-2xl p-4 sm:p-5 border border-teal-200/70 dark:border-teal-800/60 space-y-2">
                <div className="flex items-center gap-2 text-teal-800 dark:text-teal-300 font-bold text-xs uppercase tracking-wider">
                  <Lightbulb className="w-4 h-4 text-brand-teal dark:text-teal-400" />
                  <span>2. Why is it Important for Engineers?</span>
                </div>
                <p className="text-sm text-teal-950 dark:text-teal-100 leading-relaxed font-sans">
                  {theory.whyImportant}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: CORE CONCEPTS & TERMINOLOGY */}
          {(activeTab === 'overview' || activeTab === 'concepts') && (
            <div className="space-y-6">
              {/* Section 3: Core Concepts */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm uppercase tracking-wider">
                  <Layers className="w-4 h-4 text-brand-teal" />
                  <span>3. Core Concepts</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {theory.coreConcepts.map((concept, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1.5"
                    >
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-brand-teal/10 dark:bg-teal-950/60 text-brand-teal dark:text-teal-300 text-[10px] flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        {concept.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {concept.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 4: Important Terminology */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm uppercase tracking-wider">
                  <HelpCircle className="w-4 h-4 text-brand-teal" />
                  <span>4. Important Terminology</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {theory.importantTerminology.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800 text-xs"
                    >
                      <strong className="text-slate-900 dark:text-white block font-bold mb-0.5">
                        {item.term}:
                      </strong>
                      <span className="text-slate-600 dark:text-slate-300">{item.definition}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SYNTAX / STRUCTURE */}
          {(activeTab === 'overview' || activeTab === 'syntax') && theory.syntaxStructure && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm uppercase tracking-wider">
                  <Code2 className="w-4 h-4 text-brand-teal" />
                  <span>5. Syntax &amp; Structural Overview</span>
                </div>
                {theory.syntaxStructure.codeSnippet && (
                  <button
                    type="button"
                    onClick={() => handleCopyCode(theory.syntaxStructure!.codeSnippet!, 99)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    {copiedIndex === 99 ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-800 text-slate-100 space-y-3">
                <p className="text-xs text-slate-400 font-sans">
                  {theory.syntaxStructure.explanation}
                </p>
                {theory.syntaxStructure.codeSnippet && (
                  <pre className="text-xs font-mono bg-slate-950 p-4 rounded-xl overflow-x-auto border border-slate-800/80 leading-relaxed text-emerald-300/90">
                    <code>{theory.syntaxStructure.codeSnippet}</code>
                  </pre>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: HOW IT WORKS (WORKFLOW STEPS) */}
          {(activeTab === 'overview' || activeTab === 'workflow') && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm uppercase tracking-wider">
                <Workflow className="w-4 h-4 text-brand-teal" />
                <span>6. How It Works (Execution &amp; Lifecycle)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {theory.howItWorks.map((step) => (
                  <div
                    key={step.step}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850/80 border border-slate-200/80 dark:border-slate-800 space-y-1.5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-brand-teal text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {step.step}
                      </span>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                        {step.title}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-8">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SIMPLE EXAMPLES & REAL-WORLD APPLICATIONS */}
          {(activeTab === 'overview' || activeTab === 'examples') && (
            <div className="space-y-6">
              {/* Simple Examples */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm uppercase tracking-wider">
                  <Code2 className="w-4 h-4 text-brand-teal" />
                  <span>7. Simple Practical Examples</span>
                </div>
                {theory.simpleExamples.map((ex, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-850 shadow-xs"
                  >
                    <div className="p-3.5 bg-slate-100/70 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                          {ex.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {ex.description}
                        </p>
                      </div>
                      {ex.codeOrDiagram && (
                        <button
                          type="button"
                          onClick={() => handleCopyCode(ex.codeOrDiagram!, idx)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600"
                        >
                          {copiedIndex === idx ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                    {ex.codeOrDiagram && (
                      <pre className="p-4 bg-slate-950 text-slate-200 text-xs font-mono overflow-x-auto leading-relaxed border-t border-slate-900">
                        <code>{ex.codeOrDiagram}</code>
                      </pre>
                    )}
                    {ex.outputExplanation && (
                      <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 text-xs text-emerald-900 dark:text-emerald-200 border-t border-emerald-100 dark:border-emerald-900/40">
                        <strong className="font-bold">Key Insight:</strong> {ex.outputExplanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Real-World Applications */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm uppercase tracking-wider">
                  <Briefcase className="w-4 h-4 text-brand-teal" />
                  <span>8. Real-World Applications</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {theory.realWorldApplications.map((app, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850/80 border border-slate-200/80 dark:border-slate-800 text-xs flex items-start gap-2.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-slate-700 dark:text-slate-300">{app}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: COMMON MISTAKES */}
          {(activeTab === 'overview' || activeTab === 'mistakes') && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>9. Common Beginner Mistakes &amp; How to Avoid Them</span>
              </div>
              <div className="space-y-3">
                {theory.commonMistakes.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/60 space-y-2 text-xs"
                  >
                    <div className="flex items-start gap-2 text-rose-700 dark:text-rose-400 font-bold">
                      <span className="px-1.5 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 text-[10px] font-mono">
                        MISTAKE
                      </span>
                      <span>{item.mistake}</span>
                    </div>
                    <div className="text-slate-600 dark:text-slate-300 pl-4 border-l-2 border-rose-300 dark:border-rose-800">
                      <strong>Why It&apos;s Wrong:</strong> {item.whyWrong}
                    </div>
                    <div className="text-emerald-800 dark:text-emerald-300 pl-4 border-l-2 border-emerald-400 dark:border-emerald-700 font-medium">
                      <strong>Correct Approach:</strong> {item.correctApproach}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: INTERVIEW KEY POINTS */}
          {(activeTab === 'overview' || activeTab === 'interview') && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>10. Key Points to Remember (Interview Cheat Sheet)</span>
              </div>
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-50/60 to-teal-50/60 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800/80 space-y-2.5">
                {theory.keyPointsToRemember.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-800 dark:text-slate-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:text-emerald-400 shrink-0 mt-1.5" />
                    <span className="leading-relaxed">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-800 dark:text-slate-200">{skill.name}</span>
            <span>&bull;</span>
            <span>Theoretical Foundations</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-center"
            >
              Done Reading
            </button>

            <Link
              href={`/student/skills/${skill.id}`}
              onClick={onClose}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-brand-teal hover:bg-brand-dark text-white text-xs font-bold shadow-xs transition-all text-center"
            >
              <span>Practice &amp; Take Assessment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
