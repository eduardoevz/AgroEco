import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'default' | 'danger' | 'warning' | 'success' | 'info';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          iconBg: 'bg-red-50 text-red-700',
          border: 'border-red-200/80',
          badge: 'text-red-700 bg-red-50',
        };
      case 'warning':
        return {
          iconBg: 'bg-amber-50 text-amber-700',
          border: 'border-amber-200/80',
          badge: 'text-amber-700 bg-amber-50',
        };
      case 'success':
        return {
          iconBg: 'bg-emerald-50 text-emerald-700',
          border: 'border-emerald-200/80',
          badge: 'text-emerald-700 bg-emerald-50',
        };
      case 'info':
        return {
          iconBg: 'bg-blue-50 text-blue-700',
          border: 'border-blue-200/80',
          badge: 'text-blue-700 bg-blue-50',
        };
      default:
        return {
          iconBg: 'bg-stone-100 text-stone-700',
          border: 'border-stone-200',
          badge: 'text-stone-600 bg-stone-100',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div
      className={`bg-white rounded-2xl p-5 border ${styles.border} shadow-sm hover:shadow-md transition-shadow flex items-start justify-between gap-4`}
    >
      <div>
        <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
          {title}
        </p>
        <h3 className="text-2xl font-bold text-stone-900 tracking-tight">
          {value}
        </h3>
        {subtitle && (
          <p className="text-xs text-stone-400 mt-1">{subtitle}</p>
        )}
      </div>
      <div className={`p-3 rounded-xl ${styles.iconBg}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
};
