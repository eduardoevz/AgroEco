import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Cargando información agronómica...',
  className = '',
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center p-8 text-center ${className}`}
    >
      <Loader2 className="w-9 h-9 text-emerald-600 animate-spin mb-3" />
      <p className="text-sm font-medium text-stone-600">{message}</p>
    </div>
  );
};
