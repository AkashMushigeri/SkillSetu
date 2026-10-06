'use client';

import React from 'react';
import { BookOpen, ChevronRight, Sparkles } from 'lucide-react';
import { SkillItem } from '@/data/skillsData';
import { getBasicSkillTheory } from '@/data/basicSkillsTheoryData';

interface BasicSkillCardProps {
  skill: SkillItem;
  onReadTheory: (skill: SkillItem) => void;
}

export const BasicSkillCard: React.FC<BasicSkillCardProps> = ({ skill, onReadTheory }) => {
  const theory = getBasicSkillTheory(skill);

  return (
    <div
      onClick={() => onReadTheory(skill)}
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-card hover:shadow-cardHover hover:border-brand-teal/50 dark:hover:border-teal-500/50 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between group h-full cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onReadTheory(skill);
        }
      }}
      aria-label={`Read theoretical notes for ${skill.name}`}
    >
      <div className="flex-1 flex flex-col">
        {/* Top Header: Icon, Title, and Category */}
        <div className="flex items-start justify-between gap-2.5 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-2xl shrink-0 p-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800 leading-none group-hover:scale-105 transition-transform duration-200">
              {skill.icon}
            </span>
            <div className="min-w-0">
              <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-brand-teal dark:group-hover:text-teal-400 transition-colors truncate">
                {skill.name}
              </h3>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-brand-teal dark:text-teal-400">Basic</span>
                <span>&bull;</span>
                <span className="truncate">{skill.category}</span>
              </div>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-brand-teal dark:text-teal-300 text-[10px] font-bold border border-teal-200/80 dark:border-teal-800/60 shrink-0">
            <Sparkles className="w-3 h-3 text-brand-teal dark:text-teal-400" />
            Theory Notes
          </span>
        </div>

        {/* Short Description */}
        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-3.5 flex-grow">
          {skill.description}
        </p>

        {/* Core Topics Checklist */}
        <div className="bg-slate-50/80 dark:bg-slate-850/60 rounded-xl p-3 border border-slate-100 dark:border-slate-800/80 space-y-2">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            Core Topics:
          </span>
          <ul className="space-y-1.5">
            {theory.coreTopics.slice(0, 5).map((topic, idx) => (
              <li
                key={idx}
                className="text-xs text-slate-700 dark:text-slate-200 flex items-start gap-2 leading-tight"
              >
                <span className="text-brand-teal dark:text-teal-400 font-bold shrink-0 mt-0.5">&bull;</span>
                <span className="truncate">{topic}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action: Read Theory */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onReadTheory(skill);
          }}
          className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-brand-teal/10 hover:bg-brand-teal text-brand-teal hover:text-white dark:bg-teal-950/40 dark:hover:bg-brand-teal dark:text-teal-300 dark:hover:text-white text-xs font-bold transition-all duration-200 shadow-2xs group-hover:bg-brand-teal group-hover:text-white"
        >
          <BookOpen className="w-3.5 h-3.5 shrink-0" />
          <span>Read Theory</span>
          <ChevronRight className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
