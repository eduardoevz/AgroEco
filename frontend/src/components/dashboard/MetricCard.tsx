import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'default' | 'danger' | 'warning' | 'success' | 'info';
  trend?: {
    value: string;
    direction?: 'up' | 'down' | 'neutral';
  };
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default',
  trend,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          iconBg: 'bg-rose-50 text-rose-600 border border-rose-100 shadow-sm shadow-rose-500/10',
          border: 'border-rose-200/70 hover:border-rose-300',
          glow: 'from-rose-500/5 to-transparent',
          accent: 'text-rose-600',
          pillBg: 'bg-rose-50 text-rose-700 border-rose-100',
        };
      case 'warning':
        return {
          iconBg: 'bg-amber-50 text-amber-600 border border-amber-100 shadow-sm shadow-amber-500/10',
          border: 'border-amber-200/70 hover:border-amber-300',
          glow: 'from-amber-500/5 to-transparent',
          accent: 'text-amber-600',
          pillBg: 'bg-amber-50 text-amber-700 border-amber-100',
        };
      case 'success':
        return {
          iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm shadow-emerald-500/10',
          border: 'border-emerald-200/70 hover:border-emerald-300',
          glow: 'from-emerald-500/5 to-transparent',
          accent: 'text-emerald-600',
          pillBg: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        };
      case 'info':
        return {
          iconBg: 'bg-sky-50 text-sky-600 border border-sky-100 shadow-sm shadow-sky-500/10',
          border: 'border-sky-200/70 hover:border-sky-300',
          glow: 'from-sky-500/5 to-transparent',
          accent: 'text-sky-600',
          pillBg: 'bg-sky-50 text-sky-700 border-sky-100',
        };
      default:
        return {
          iconBg: 'bg-slate-100 text-slate-700 border border-slate-200/80 shadow-sm',
          border: 'border-slate-200/80 hover:border-slate-300',
          glow: 'from-slate-500/5 to-transparent',
          accent: 'text-slate-900',
          pillBg: 'bg-slate-100 text-slate-600 border-slate-200',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div
      className={`relative overflow-hidden bg-white rounded-2xl p-5 border ${styles.border} shadow-sm hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between group`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${styles.glow} pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity`}
      />

      <div className="relative z-10 flex items-start justify-between gap-3 mb-3">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl transition-transform group-hover:scale-105 duration-200 ${styles.iconBg}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="relative z-10">
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {value}
          </h3>
          {trend && (
            <span
              className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${styles.pillBg}`}
            >
              {trend.direction === 'up' && <TrendingUp className="w-3 h-3" />}
              {trend.direction === 'down' && <TrendingDown className="w-3 h-3" />}
              {trend.direction === 'neutral' && <Minus className="w-3 h-3" />}
              {trend.value}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-slate-500 mt-1 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-emerald-500 transition-colors" />
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

