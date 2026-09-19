'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  getDiagnosisById,
  getFollowUps,
  getFarmById,
  getCropById,
  getDiseaseById,
} from '@/lib/firebase/firestore';
import { Diagnosis, FollowUp, Farm, Crop, Disease } from '@/types';
import { PageTitle } from '@/components/layout/PageTitle';
import { DiagnosisTimeline } from '@/components/diagnosis/DiagnosisTimeline';
import { DiagnosisStatusBadge } from '@/components/ui/DiagnosisStatusBadge';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  formatDate,
  formatPercent,
  getPlantPartLabel,
  getSeverityLabel,
  getSeverityBadgeClasses,
} from '@/lib/utils/formatters';
import {
  ArrowLeft,
  MapPin,
  AlertTriangle,
  BookOpen,
  ShieldAlert,
  CheckCircle2,
  Map,
  Info,
} from 'lucide-react';

export default function DiagnosisDetailPage() {
  const params = useParams();
  const router = useRouter();
  const diagnosisId = params?.id as string;
  const { user } = useAuth();

  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [farm, setFarm] = useState<Farm | null>(null);
  const [crop, setCrop] = useState<Crop | null>(null);
  const [disease, setDisease] = useState<Disease | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!diagnosisId) return;
      try {
        const d = await getDiagnosisById(diagnosisId);
        if (d) {
          setDiagnosis(d);
          const [fols, f, c, dis] = await Promise.all([
            getFollowUps(diagnosisId),
            d.farmId ? getFarmById(d.farmId) : Promise.resolve(null),
            d.cropId ? getCropById(d.cropId) : Promise.resolve(null),
            d.predictedDiseaseId ? getDiseaseById(d.predictedDiseaseId) : Promise.resolve(null),
          ]);
          setFollowUps(fols);
          setFarm(f);
          setCrop(c);
          setDisease(dis);
        }
      } catch (err) {
        console.error('Error cargando detalle de diagnóstico:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [diagnosisId]);

  if (loading) {
    return <LoadingState message="Cargando expediente fitosanitario..." />;
  }

  if (!diagnosis) {
    return (
      <EmptyState
        title="Diagnóstico no encontrado"
        description="El reporte solicitado no existe o no tienes autorización para consultarlo."
        actionText="Volver al Historial"
        onAction={() => router.push('/history')}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Botón Volver y Accesos Rápidos */}
      <div className="flex items-center justify-between">
        <Link
          href="/history"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Historial</span>
        </Link>
        <Link
          href={`/map?diagnosisId=${diagnosis.id}&farmId=${diagnosis.farmId}`}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200/60 transition-all shadow-sm"
        >
          <Map className="w-4 h-4" />
          <span>Ver este brote en el mapa</span>
        </Link>
      </div>

      {/* Advertencia Legal */}
      <div
        role="alert"
        className="bg-amber-50/90 border border-amber-200 p-4 rounded-2xl text-amber-950 shadow-sm text-xs"
      >
        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded-xl bg-amber-100 text-amber-700 flex-shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-slate-900">
              Expediente Fitosanitario Asistido por Inteligencia Artificial
            </p>
            <p className="text-amber-800 leading-relaxed font-medium mt-0.5">
              Este resultado es una estimación generada mediante modelos de visión por computador y no sustituye la evaluación agronómica presencial certificada.
            </p>
          </div>
        </div>
      </div>

      {/* Tarjeta Superior: Foto + Datos Centrales */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Fotografía de la muestra */}
          <div className="relative aspect-square md:aspect-auto bg-slate-950 overflow-hidden flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={diagnosis.imageUrl}
              alt={diagnosis.predictedDiseaseName}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <DiagnosisStatusBadge status={diagnosis.status} />
            </div>
            <div className="absolute bottom-4 left-4 right-4 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md text-white text-[11px] font-mono flex items-center justify-between">
              <span>{crop?.name || diagnosis.cropId}</span>
              <span className="text-emerald-400 font-bold">{getPlantPartLabel(diagnosis.plantPart)}</span>
            </div>
          </div>

          {/* Información Técnica */}
          <div className="p-6 sm:p-7 flex flex-col justify-between space-y-5">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60 inline-block mb-2">
                {crop?.name || diagnosis.cropId} · {getPlantPartLabel(diagnosis.plantPart)}
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {diagnosis.predictedDiseaseName}
              </h2>
              {disease?.scientificName && (
                <p className="text-xs text-slate-500 italic mt-0.5 font-mono">
                  {disease.scientificName}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Certeza IA
                </span>
                <span className="text-lg font-extrabold text-emerald-700">
                  {formatPercent(diagnosis.confidence)}
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Severidad
                </span>
                <span
                  className={`inline-block px-2 py-0.5 text-xs font-bold rounded-lg mt-0.5 ${getSeverityBadgeClasses(
                    diagnosis.severity
                  )}`}
                >
                  {getSeverityLabel(diagnosis.severity)}
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Fecha Detección
                </span>
                <span className="font-bold text-slate-800 block mt-0.5">
                  {formatDate(diagnosis.createdAt)}
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Modelo Visión
                </span>
                <span className="font-mono text-slate-700 font-bold text-[11px] block mt-0.5 truncate">
                  {diagnosis.aiModelVersion}
                </span>
              </div>
            </div>

            {/* Finca y Coordenadas */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>{farm?.name || 'Finca registrada'}</span>
              </div>
              <p className="text-[11px] font-mono text-slate-500 font-medium">
                Lat: {diagnosis.latitude.toFixed(6)}, Lon: {diagnosis.longitude.toFixed(6)} (±{diagnosis.gpsAccuracy}m)
              </p>
            </div>
          </div>
        </div>

        {/* Sección de Conocimiento Agronómico */}
        <div className="p-6 sm:p-7 border-t border-slate-100 space-y-6">
          {disease?.description && (
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>Descripción Fitosanitaria</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/80 font-normal">
                {disease.description}
              </p>
            </div>
          )}

          {disease?.symptoms && disease.symptoms.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>Síntomas Observables en Campo</span>
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {disease.symptoms.map((s, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-slate-700 flex items-start gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200/80 font-medium"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {disease?.recommendations && disease.recommendations.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Recomendaciones Iniciales de Manejo Integrado</span>
              </h4>
              <ul className="space-y-2">
                {disease.recommendations.map((r, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-slate-800 flex items-start gap-2.5 bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-200/60 font-medium"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center gap-2.5 p-3.5 bg-slate-100 rounded-2xl text-[11px] text-slate-500 font-medium">
            <Info className="w-4 h-4 flex-shrink-0 text-slate-400" />
            <span>
              La información técnica presentada sirve como apoyo preliminar y deberá complementarse con evaluación de campo por un agrónomo colegiado.
            </span>
          </div>
        </div>
      </div>

      {/* Línea de Tiempo y Seguimiento */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-sm">
        <DiagnosisTimeline
          diagnosisId={diagnosis.id}
          currentStatus={diagnosis.status}
          followUps={followUps}
          onFollowUpAdded={(newFol) => {
            setFollowUps((prev) => [...prev, newFol]);
            setDiagnosis((prev) => (prev ? { ...prev, status: newFol.status } : null));
          }}
        />
      </div>
    </div>
  );
}

