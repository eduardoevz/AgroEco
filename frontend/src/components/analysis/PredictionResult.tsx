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
  Sparkles,
  ShieldCheck,
  Check,
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
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Banner de Advertencia Legal Obligatoria */}
      <div
        role="alert"
        className="bg-amber-50/90 border border-amber-200 p-4 rounded-2xl text-amber-950 shadow-sm"
      >
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-700 flex-shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="text-xs space-y-0.5">
            <p className="font-bold text-slate-900">
              Diagnóstico preliminar emitido por motor de visión artificial (Gemini / PyTorch)
            </p>
            <p className="text-amber-800 leading-relaxed font-medium">
              Este dictamen es una aproximación probabilística asistida por IA para soporte en campo y no sustituye la certificación presencial de un profesional agrónomo.
            </p>
          </div>
        </div>
      </div>

      {/* Tarjeta Principal de Diagnóstico */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card-hover overflow-hidden">
        {/* Imagen del análisis con overlay */}
        <div className="relative aspect-video sm:aspect-[21/9] bg-slate-950 overflow-hidden flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={diagnosis.imageUrl}
            alt={diagnosis.predictedDiseaseName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          
          <div className="absolute bottom-5 left-5 right-5 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/30 px-3 py-1 rounded-full backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5" />
                {crop?.name || 'Cultivo'} · Órgano: {getPlantPartLabel(diagnosis.plantPart)}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1">
                {diagnosis.predictedDiseaseName}
              </h2>
              {disease?.scientificName && (
                <p className="text-xs text-slate-300 italic font-mono">
                  {disease.scientificName}
                </p>
              )}
            </div>
            <div className="flex-shrink-0">
              <DiagnosisStatusBadge status={diagnosis.status} />
            </div>
          </div>
        </div>

        {/* Métricas de Confianza y Severidad */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-5 bg-slate-50/60 border-b border-slate-100 text-center">
          <div className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Certeza IA
            </span>
            <span className="text-xl font-extrabold text-emerald-700">
              {formatPercent(diagnosis.confidence)}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Severidad
            </span>
            <span
              className={`inline-block px-2.5 py-0.5 text-xs font-bold rounded-lg mt-1 ${getSeverityBadgeClasses(
                diagnosis.severity
              )}`}
            >
              {getSeverityLabel(diagnosis.severity)}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Fecha de Registro
            </span>
            <span className="text-xs font-bold text-slate-800 block mt-1">
              {formatDate(diagnosis.createdAt)}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Coordenadas GNSS
            </span>
            <span className="text-xs font-mono font-bold text-slate-800 block mt-1 truncate">
              {diagnosis.latitude.toFixed(4)}, {diagnosis.longitude.toFixed(4)}
            </span>
          </div>
        </div>

        {/* Detalles Agronómicos: Descripción, Síntomas y Recomendaciones */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Descripción */}
          {disease?.description && (
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-700" />
                <span>Descripción Fitosanitaria</span>
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80">
                {disease.description}
              </p>
            </div>
          )}

          {/* Síntomas Clave */}
          {disease?.symptoms && disease.symptoms.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>Signos y Síntomas Observados</span>
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {disease.symptoms.map((symptom, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-slate-700 flex items-start gap-2.5 bg-slate-50/80 p-3 rounded-2xl border border-slate-200/80 font-medium"
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                    <span>{symptom}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recomendaciones de Manejo Agronómico */}
          {disease?.recommendations && disease.recommendations.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Plan de Manejo Integrado Recomendado</span>
              </h4>
              <ul className="space-y-2.5">
                {disease.recommendations.map((rec, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-slate-800 flex items-start gap-3 bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-200/60 font-medium"
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span className="leading-relaxed">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Aviso agronómico complementario */}
          <div className="flex items-center gap-2.5 p-3.5 bg-slate-100 rounded-2xl text-[11px] text-slate-500 font-medium">
            <Info className="w-4 h-4 flex-shrink-0 text-slate-400" />
            <span>
              Este registro ha sido guardado de forma automática en tu base de datos de Cloud Firestore con geo-trazabilidad lista para inspección.
            </span>
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="p-5 bg-slate-50 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Link
              href={`/map?diagnosisId=${diagnosis.id}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-700 bg-white border border-slate-200/80 hover:bg-slate-100 rounded-xl transition-all shadow-sm"
            >
              <Map className="w-4 h-4 text-emerald-600" />
              <span>Ver Foco en Mapa</span>
            </Link>

            <Link
              href={`/history/${diagnosis.id}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-700 bg-white border border-slate-200/80 hover:bg-slate-100 rounded-xl transition-all shadow-sm"
            >
              <History className="w-4 h-4 text-slate-600" />
              <span>Bitácora y Trazabilidad</span>
            </Link>
          </div>

          {onNewAnalysis && (
            <button
              type="button"
              onClick={onNewAnalysis}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl transition-all shadow-md shadow-emerald-700/20 active:scale-[0.98]"
            >
              <ScanLine className="w-4 h-4" />
              <span>Escanear Otra Muestra</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

