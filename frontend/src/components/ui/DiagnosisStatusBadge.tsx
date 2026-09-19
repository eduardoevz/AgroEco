import React from 'react';
import { DiagnosisStatus } from '@/types';
import { getStatusLabel, getStatusBadgeClasses } from '@/lib/utils/formatters';
import { CheckCircle2, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

interface DiagnosisStatusBadgeProps {
  status: DiagnosisStatus;
  showIcon?: boolean;
  className?: string;
}

export const DiagnosisStatusBadge: React.FC<DiagnosisStatusBadgeProps> = ({
  status,
  showIcon = true,
  className = '',
}) => {
  const getIcon = () => {
    switch (status) {
      case 'detected':
        return <AlertTriangle className="w-3.5 h-3.5 mr-1" aria-hidden="true" />;
      case 'monitoring':
        return <Clock className="w-3.5 h-3.5 mr-1" aria-hidden="true" />;
      case 'treated':
        return <CheckCircle2 className="w-3.5 h-3.5 mr-1" aria-hidden="true" />;
      case 'controlled':
        return <ShieldCheck className="w-3.5 h-3.5 mr-1" aria-hidden="true" />;
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeClasses(
        status
      )} ${className}`}
    >
      {showIcon && getIcon()}
      {getStatusLabel(status)}
    </span>
  );
};
