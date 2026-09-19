import React from 'react';
import Link from 'next/link';
import { Diagnosis, Farm, Plot, Crop } from '@/types';
import { formatDate, formatPercent, getPlantPartLabel } from '@/lib/utils/formatters';
import { DiagnosisStatusBadge } from '@/components/ui/DiagnosisStatusBadge';
import { MapPin, ArrowRight, ShieldCheck, Calendar, Activity } from 'lucide-react';

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
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm hover:shadow-card-hover hover:border-emerald-300/80 transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group">
      <div className="flex items-center gap-4 min-w-0">
        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200 shadow-inner">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={diagnosis.imageUrl}
            alt={diagnosis.predictedDiseaseName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-md uppercase tracking-wider">
              {crop?.name || diagnosis.cropId} · {getPlantPartLabel(diagnosis.plantPart)}
            </span>
            <DiagnosisStatusBadge status={diagnosis.status} />
          </div>

          <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
            {diagnosis.predictedDiseaseName}
          </h4>

          <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
            <span className="inline-flex items-center gap-1 font-medium text-emerald-700 bg-emerald-50/70 px-1.5 py-0.5 rounded">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>{formatPercent(diagnosis.confidence)} certeza</span>
            </span>
            <span className="inline-flex items-center gap-1 text-slate-400">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>{formatDate(diagnosis.createdAt)}</span>
            </span>
            {farm && (
              <span className="inline-flex items-center gap-1 text-slate-400 truncate">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>
                  {farm.name} {plot ? `· ${plot.name}` : ''}
                </span>
              </span>
            )}
          </div>
        </div>
      </div>

      <Link
        href={`/history/${diagnosis.id}`}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 group-hover:text-emerald-700 bg-slate-50 hover:bg-emerald-50 border border-slate-200 group-hover:border-emerald-200 px-4 py-2 rounded-xl transition-all self-end sm:self-center flex-shrink-0"
      >
        <span>Ver Expediente</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  );
};

