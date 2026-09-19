'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Diagnosis, Farm, Plot, Crop } from '@/types';
import { LoadingState } from '@/components/ui/LoadingState';

interface DiagnosisMapProps {
  diagnoses: Diagnosis[];
  farms: Farm[];
  plots: Plot[];
  crops: Crop[];
  selectedDiagnosisId?: string;
  viewMode?: 'markers' | 'heatmap';
}

const DynamicDiagnosisMapInner = dynamic(
  () => import('./DiagnosisMapInner'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[480px] bg-stone-100 rounded-2xl flex items-center justify-center border border-stone-200">
        <LoadingState message="Cargando mapa satelital y capas georreferenciadas..." />
      </div>
    ),
  }
);

export const DiagnosisMap: React.FC<DiagnosisMapProps> = ({
  diagnoses,
  farms,
  plots,
  crops,
  selectedDiagnosisId,
  viewMode = 'markers',
}) => {
  return (
    <DynamicDiagnosisMapInner
      diagnoses={diagnoses}
      farms={farms}
      plots={plots}
      crops={crops}
      selectedDiagnosisId={selectedDiagnosisId}
      viewMode={viewMode}
    />
  );
};
export default DiagnosisMap;
