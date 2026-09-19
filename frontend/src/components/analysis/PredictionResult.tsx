import React from 'react';
import Link from 'next/link';
import { Diagnosis, Disease, Crop } from '@/types';
import {
  formatDate,
  formatPercent,
  getPlantPartLabel,
  getSeverityLabel,
  getSeverityBadgeClasses,
} from '@/lib/utils/formatters';
import { DiagnosisStatusBadge } from '@/components/ui/DiagnosisStatusBadge';
import {
  AlertTriangle,
  ShieldAlert,
  MapPin,
  CheckCircle2,
  ScanLine,
  History,
  Map,
  BookOpen,
  Info,
} from 'lucide-react';

interface PredictionResultProps {
  diagnosis: Diagnosis;
  crop?: Crop;
  disease?: Disease;
  onNewAnalysis?: () => void;
}

export const PredictionResult: React.FC<PredictionResultProps> = ({
  diagnosis,
  crop,
  disease,
  onNewAnalysis,
}) => {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Banner de Advertencia Legal Obligatoria */}
      <div
        role="alert"
        className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-2xl text-amber-900 shadow-sm"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-bold text-sm">
              Diagnóstico preliminar asistido por inteligencia artificial
            </p>
            <p className="leading-relaxed">
              Este resultado es una estimación generada mediante inteligencia artificial y no sustituye la evaluación de un profesional agrícola.
            </p>
          </div>
        </div>
      </div>

      {/* Tarjeta Principal de Diagnóstico */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        {/* Imagen del análisis */}
        <div className="relative aspect-video sm:aspect-[21/9] bg-stone-900 overflow-hidden flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={diagnosis.imageUrl}
            alt={diagnosis.predictedDiseaseName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white flex items-end justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-emerald-400 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-sm">
                {crop?.name || 'Cultivo'} · Órgano: {getPlantPartLabel(diagnosis.plantPart)}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
                {diagnosis.predictedDiseaseName}
              </h2>
              {disease?.scientificName && (
                <p className="text-xs text-stone-300 italic">
                  {disease.scientificName}
                </p>
              )}
            </div>
            <DiagnosisStatusBadge status={diagnosis.status} />
          </div>
        </div>

        {/* Métricas de Confianza y Severidad */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-4 bg-stone-50 border-b border-stone-100 text-center">
          <div className="p-2 rounded-xl bg-white border border-stone-200">
            <span className="text-[10px] uppercase font-semibold text-stone-500 block">
              Certeza IA
            </span>
            <span className="text-lg font-bold text-emerald-700">
              {formatPercent(diagnosis.confidence)}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-white border border-stone-200">
            <span className="text-[10px] uppercase font-semibold text-stone-500 block">
              Severidad
            </span>
            <span
              className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-md mt-0.5 ${getSeverityBadgeClasses(
                diagnosis.severity
              )}`}
            >
              {getSeverityLabel(diagnosis.severity)}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-white border border-stone-200">
            <span className="text-[10px] uppercase font-semibold text-stone-500 block">
              Fecha
            </span>
            <span className="text-xs font-semibold text-stone-800">
              {formatDate(diagnosis.createdAt)}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-white border border-stone-200">
            <span className="text-[10px] uppercase font-semibold text-stone-500 block">
              Coordenadas
            </span>
            <span className="text-[11px] font-mono text-stone-700 truncate block">
              {diagnosis.latitude.toFixed(4)}, {diagnosis.longitude.toFixed(4)}
            </span>
          </div>
        </div>

        {/* Detalles Agronómicos: Descripción, Síntomas y Recomendaciones */}
        <div className="p-6 space-y-6">
          {/* Descripción */}
          {disease?.description && (
            <div>
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-700" />
                Descripción Patológica
              </h4>
              <p className="text-sm text-stone-600 leading-relaxed bg-stone-50 p-3.5 rounded-xl border border-stone-100">
                {disease.description}
              </p>
            </div>
          )}

          {/* Síntomas Clave */}
          {disease?.symptoms && disease.symptoms.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                Síntomas Característicos
              </h4>
              <ul className="space-y-2">
                {disease.symptoms.map((symptom, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-stone-700 flex items-start gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-100"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                    <span>{symptom}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recomendaciones de Manejo Agronómico */}
          {disease?.recommendations && disease.recommendations.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                Recomendaciones Iniciales de Manejo Integrado
              </h4>
              <ul className="space-y-2">
                {disease.recommendations.map((rec, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-stone-700 flex items-start gap-2.5 bg-emerald-50/60 p-3 rounded-xl border border-emerald-100"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Aviso agronómico complementario */}
          <div className="flex items-center gap-2 p-3 bg-stone-100 rounded-xl text-[11px] text-stone-500">
            <Info className="w-4 h-4 flex-shrink-0" />
            <span>
              La información presentada sirve como apoyo y deberá complementarse con evaluación técnica cuando el caso lo requiera.
            </span>
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Link
              href={`/map?diagnosisId=${diagnosis.id}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-stone-700 bg-white border border-stone-200 hover:bg-stone-100 rounded-xl transition-colors shadow-sm"
            >
              <Map className="w-4 h-4 text-emerald-700" />
              Ver en Mapa
            </Link>

            <Link
              href={`/history/${diagnosis.id}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-stone-700 bg-white border border-stone-200 hover:bg-stone-100 rounded-xl transition-colors shadow-sm"
            >
              <History className="w-4 h-4 text-stone-600" />
              Seguimiento
            </Link>
          </div>

          {onNewAnalysis && (
            <button
              type="button"
              onClick={onNewAnalysis}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors shadow-sm"
            >
              <ScanLine className="w-4 h-4" />
              Nuevo Análisis
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
