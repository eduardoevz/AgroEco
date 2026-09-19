import React from 'react';
import Link from 'next/link';
import { Diagnosis, Farm, Plot, Crop } from '@/types';
import { formatDate, formatPercent, getPlantPartLabel } from '@/lib/utils/formatters';
import { DiagnosisStatusBadge } from '@/components/ui/DiagnosisStatusBadge';
import { MapPin, ArrowRight } from 'lucide-react';

interface DiagnosisCardProps {
  diagnosis: Diagnosis;
  farm?: Farm;
  plot?: Plot;
  crop?: Crop;
}

export const DiagnosisCard: React.FC<DiagnosisCardProps> = ({
  diagnosis,
  farm,
  plot,
  crop,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group">
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="w-14 h-14 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0 border border-stone-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={diagnosis.imageUrl}
            alt={diagnosis.predictedDiseaseName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
              {crop?.name || diagnosis.cropId} · {getPlantPartLabel(diagnosis.plantPart)}
            </span>
            <DiagnosisStatusBadge status={diagnosis.status} />
          </div>
          <h4 className="text-sm font-bold text-stone-900 truncate">
            {diagnosis.predictedDiseaseName}
          </h4>
          <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
            <span>Certeza: <strong>{formatPercent(diagnosis.confidence)}</strong></span>
            <span>·</span>
            <span>{formatDate(diagnosis.createdAt)}</span>
          </div>
          {farm && (
            <p className="text-[11px] text-stone-400 truncate mt-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-stone-400" />
              {farm.name} {plot ? `· ${plot.name}` : ''}
            </p>
          )}
        </div>
      </div>

      <Link
        href={`/history/${diagnosis.id}`}
        className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-xl transition-colors self-end sm:self-center"
      >
        <span>Detalle</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
};
