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
      bg: 'from-emerald-50/50 to-teal-50/30',
      border: 'border-slate-200 hover:border-emerald-300',
      iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
      text: 'text-emerald-700',
    },
    blue: {
      bg: 'from-blue-50/50 to-cyan-50/30',
      border: 'border-slate-200 hover:border-blue-300',
      iconBg: 'bg-blue-50 text-blue-600 border border-blue-100',
      text: 'text-blue-700',
    },
    purple: {
      bg: 'from-purple-50/50 to-indigo-50/30',
      border: 'border-slate-200 hover:border-purple-300',
      iconBg: 'bg-purple-50 text-purple-600 border border-purple-100',
      text: 'text-purple-700',
    },
    amber: {
      bg: 'from-amber-50/50 to-orange-50/30',
      border: 'border-slate-200 hover:border-amber-300',
      iconBg: 'bg-amber-50 text-amber-600 border border-amber-100',
      text: 'text-amber-700',
    },
    teal: {
      bg: 'from-teal-50/50 to-emerald-50/30',
      border: 'border-slate-200 hover:border-teal-300',
      iconBg: 'bg-teal-50 text-teal-600 border border-teal-100',
      text: 'text-teal-700',
    },
    rose: {
      bg: 'from-rose-50/50 to-pink-50/30',
      border: 'border-slate-200 hover:border-rose-300',
      iconBg: 'bg-rose-50 text-rose-600 border border-rose-100',
      text: 'text-rose-700',
    },
  };

  const scheme = colorMap[color];

  const content = (
    <div
      className={`relative overflow-hidden rounded-2xl bg-white border ${scheme.border} p-5 shadow-card hover:shadow-cardHover transition-all duration-300 hover:-translate-y-0.5 group`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-baseline gap-2">
            <span>{value}</span>
            {trend && (
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  trendUp ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
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

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-500">{subtitle}</span>
        {badge && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
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
