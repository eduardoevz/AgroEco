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
      {/* Botón Volver */}
      <div className="flex items-center justify-between">
        <Link
          href="/history"
          className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-stone-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Historial</span>
        </Link>
        <Link
          href={`/map?diagnosisId=${diagnosis.id}&farmId=${diagnosis.farmId}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors"
        >
          <Map className="w-4 h-4" />
          <span>Ver este brote en el mapa</span>
        </Link>
      </div>

      {/* Advertencia Legal Obligatoria */}
      <div
        role="alert"
        className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-2xl text-amber-900 shadow-sm text-xs space-y-1"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-sm">
              Diagnóstico preliminar asistido por inteligencia artificial
            </p>
            <p className="leading-relaxed">
              Este resultado es una estimación generada mediante inteligencia artificial y no sustituye la evaluación de un profesional agrícola.
            </p>
          </div>
        </div>
      </div>

      {/* Tarjeta Superior: Foto + Datos Centrales */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Fotografía de la muestra */}
          <div className="relative aspect-square md:aspect-auto bg-stone-900 overflow-hidden flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={diagnosis.imageUrl}
              alt={diagnosis.predictedDiseaseName}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <DiagnosisStatusBadge status={diagnosis.status} />
            </div>
          </div>

          {/* Información Técnica */}
          <div className="p-6 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-700 block">
                {crop?.name || diagnosis.cropId} · Órgano: {getPlantPartLabel(diagnosis.plantPart)}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight mt-1">
                {diagnosis.predictedDiseaseName}
              </h2>
              {disease?.scientificName && (
                <p className="text-xs text-stone-500 italic mt-0.5">
                  {disease.scientificName}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">
                  Certeza IA
                </span>
                <span className="text-base font-bold text-emerald-700">
                  {formatPercent(diagnosis.confidence)}
                </span>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">
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

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">
                  Fecha Detección
                </span>
                <span className="font-semibold text-stone-700">
                  {formatDate(diagnosis.createdAt)}
                </span>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">
                  Modelo Visión
                </span>
                <span className="font-mono text-stone-600">
                  {diagnosis.aiModelVersion}
                </span>
              </div>
            </div>

            {/* Finca y Coordenadas */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-stone-800">
                <MapPin className="w-4 h-4 text-emerald-700" />
                <span>{farm?.name || 'Finca registrada'}</span>
              </div>
              <p className="text-[11px] font-mono text-stone-500">
                Lat: {diagnosis.latitude.toFixed(6)}, Lon: {diagnosis.longitude.toFixed(6)} (±{diagnosis.gpsAccuracy}m)
              </p>
            </div>
          </div>
        </div>

        {/* Sección de Conocimiento Agronómico */}
        <div className="p-6 border-t border-stone-100 space-y-6">
          {disease?.description && (
            <div>
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-700" />
                Descripción Patológica
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-3.5 rounded-xl border border-stone-100">
                {disease.description}
              </p>
            </div>
          )}

          {disease?.symptoms && disease.symptoms.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                Síntomas Observables en Campo
              </h4>
              <ul className="space-y-1.5">
                {disease.symptoms.map((s, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-stone-700 flex items-start gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-100"
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
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                Recomendaciones Iniciales de Manejo Integrado
              </h4>
              <ul className="space-y-1.5">
                {disease.recommendations.map((r, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-stone-700 flex items-start gap-2 bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center gap-2 p-3 bg-stone-100 rounded-xl text-[11px] text-stone-500">
            <Info className="w-4 h-4 flex-shrink-0" />
            <span>
              La información presentada sirve como apoyo y deberá complementarse con evaluación técnica cuando el caso lo requiera.
            </span>
          </div>
        </div>
      </div>

      {/* Línea de Tiempo y Seguimiento */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm">
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
