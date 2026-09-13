import React from 'react';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface IndustryStatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  href?: string;
  badge?: string;
  color?: 'emerald' | 'blue' | 'purple' | 'amber' | 'teal' | 'rose';
}

export const IndustryStatCard: React.FC<IndustryStatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendUp = true,
  href,
  badge,
  color = 'emerald',
}) => {
  const colorMap = {
    emerald: {
      bg: 'from-emerald-500/10 to-teal-500/5',
      border: 'border-emerald-500/30 hover:border-emerald-500/60',
      iconBg: 'bg-emerald-500/20 text-emerald-400',
      text: 'text-emerald-400',
    },
    blue: {
      bg: 'from-blue-500/10 to-cyan-500/5',
      border: 'border-blue-500/30 hover:border-blue-500/60',
      iconBg: 'bg-blue-500/20 text-blue-400',
      text: 'text-blue-400',
    },
    purple: {
      bg: 'from-purple-500/10 to-indigo-500/5',
      border: 'border-purple-500/30 hover:border-purple-500/60',
      iconBg: 'bg-purple-500/20 text-purple-400',
      text: 'text-purple-400',
    },
    amber: {
      bg: 'from-amber-500/10 to-orange-500/5',
      border: 'border-amber-500/30 hover:border-amber-500/60',
      iconBg: 'bg-amber-500/20 text-amber-400',
      text: 'text-amber-400',
    },
    teal: {
      bg: 'from-teal-500/10 to-emerald-500/5',
      border: 'border-teal-500/30 hover:border-teal-500/60',
      iconBg: 'bg-teal-500/20 text-teal-400',
      text: 'text-teal-400',
    },
    rose: {
      bg: 'from-rose-500/10 to-pink-500/5',
      border: 'border-rose-500/30 hover:border-rose-500/60',
      iconBg: 'bg-rose-500/20 text-rose-400',
      text: 'text-rose-400',
    },
  };

  const scheme = colorMap[color];

  const content = (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${scheme.bg} bg-slate-900/90 border ${scheme.border} p-5 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5 group`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
          <div className="text-3xl font-extrabold text-white tracking-tight flex items-baseline gap-2">
            <span>{value}</span>
            {trend && (
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  trendUp ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                }`}
              >
                {trend}
              </span>
            )}
          </div>
        </div>

        <div className={`p-3 rounded-xl ${scheme.iconBg} transition-transform group-hover:scale-110 duration-200`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <span className="text-slate-400">{subtitle}</span>
        {badge && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
            {badge}
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
};
