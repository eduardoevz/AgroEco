'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  getDashboardMetrics,
  getDiagnoses,
  getFarms,
  getPlotsByOwner,
  getCrops,
} from '@/lib/firebase/firestore';
import { DashboardMetrics, Diagnosis, Farm, Plot, Crop } from '@/types';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { DiagnosisCard } from '@/components/diagnosis/DiagnosisCard';
import { DashboardCharts } from '@/components/dashboard/Charts';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  ScanLine,
  MapPin,
  Trees,
  History,
  AlertTriangle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Layers,
  Calendar,
  ChevronRight,
  ShieldAlert,
  BookOpen,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [plots, setPlots] = useState<Plot[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      try {
        const [met, diag, f, p, c] = await Promise.all([
          getDashboardMetrics(user.id),
          getDiagnoses(user.id),
          getFarms(user.id),
          getPlotsByOwner(user.id),
          getCrops(),
        ]);
        setMetrics(met);
        setDiagnoses(diag);
        setFarms(f);
        setPlots(p);
        setCrops(c);
      } catch (err) {
        console.error('Error cargando métricas del dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  if (loading) {
    return <LoadingState message="Cargando telemetría fitosanitaria de tus cultivos..." />;
  }

  const recentDiagnoses = diagnoses.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Hero Banner Ejecutivo de Sanidad Vegetal */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 p-6 sm:p-8 text-white border border-emerald-800/40 shadow-xl">
        {/* Glows ambientales */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Plataforma de Diagnóstico IA Activa · Gemini 3.6 & MobileNet</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Panel Agroecológico de {user?.name || 'Productor'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Vigilancia fitosanitaria continua, detección temprana de plagas y trazabilidad georreferenciada de parcelas.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2.5 px-5 py-3 text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
            >
              <ScanLine className="w-4 h-4 text-emerald-950" />
              <span>Nuevo Escaneo IA</span>
            </Link>
            <Link
              href="/map"
              className="inline-flex items-center gap-2 px-4 py-3 text-xs font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/15 rounded-2xl transition-all backdrop-blur-sm"
            >
              <MapPin className="w-4 h-4 text-emerald-300" />
              <span>Explorar Mapa</span>
            </Link>
          </div>
        </div>

        {/* Barra de telemetría inferior del banner */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 mt-6 border-t border-white/10 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Fincas Registradas</span>
            <strong className="text-white text-base font-bold">{farms.length} activas</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Parcelas Monitoreadas</span>
            <strong className="text-white text-base font-bold">{plots.length} lotes</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Cultivos en Catálogo</span>
            <strong className="text-white text-base font-bold">{crops.length} especies</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Índice de Control</span>
            <strong className="text-emerald-400 text-base font-bold">
              {diagnoses.length > 0
                ? `${Math.round(
                    ((metrics?.controlledCount || 0) / diagnoses.length) * 100
                  )}% resuelto`
                : '100% óptimo'}
            </strong>
          </div>
        </div>
      </div>

      {/* Tarjetas de Métricas Principales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Análisis"
          value={metrics?.totalAnalyses || 0}
          subtitle={`${metrics?.farmsCount || 0} fincas activas`}
          icon={ScanLine}
          variant="default"
          trend={{ value: `${diagnoses.length} reg.`, direction: 'up' }}
        />
        <MetricCard
          title="Casos Detectados"
          value={metrics?.detectedCount || 0}
          subtitle="Requieren acción inmediata"
          icon={AlertTriangle}
          variant="danger"
          trend={{ value: 'Prioridad alta', direction: 'up' }}
        />
        <MetricCard
          title="En Seguimiento"
          value={metrics?.monitoringCount || 0}
          subtitle="Bajo evaluación agronómica"
          icon={Clock}
          variant="warning"
          trend={{ value: 'En proceso', direction: 'neutral' }}
        />
        <MetricCard
          title="Casos Controlados"
          value={metrics?.controlledCount || 0}
          subtitle="Brotes superados con éxito"
          icon={ShieldCheck}
          variant="success"
          trend={{ value: 'Efectivo', direction: 'down' }}
        />
      </div>

      {/* Acciones Rápidas Bento Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Accesos Rápidos del Productor
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          <Link
            href="/analyze"
            className="p-5 bg-gradient-to-br from-emerald-800 to-emerald-950 text-white rounded-2xl shadow-sm hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between group border border-emerald-700/50"
          >
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ScanLine className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <span className="text-sm font-bold block mb-0.5">Analizar Planta</span>
              <span className="text-[11px] text-emerald-200/80 font-medium">
                Cámara o imagen con IA
              </span>
            </div>
          </Link>

          <Link
            href="/catalog"
            className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-card-hover hover:border-emerald-300 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between group"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 border border-teal-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 block mb-0.5 group-hover:text-emerald-700 transition-colors">
                Catálogo Agrícola
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                6 especies & 20 patologías
              </span>
            </div>
          </Link>

          <Link
            href="/map"
            className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-card-hover hover:border-emerald-300 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 block mb-0.5 group-hover:text-emerald-700 transition-colors">
                Mapa Epidemiológico
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Brotes georreferenciados
              </span>
            </div>
          </Link>

          <Link
            href="/farms"
            className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-card-hover hover:border-emerald-300 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Trees className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 block mb-0.5 group-hover:text-emerald-700 transition-colors">
                Gestión de Fincas
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                {farms.length} predios registrados
              </span>
            </div>
          </Link>

          <Link
            href="/history"
            className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-card-hover hover:border-emerald-300 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between group"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <History className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 block mb-0.5 group-hover:text-emerald-700 transition-colors">
                Expedientes Clínicos
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Trazabilidad fitosanitaria
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* Gráficos Analíticos */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Analítica de Sanidad Vegetal
            </h3>
            <p className="text-[11px] text-slate-500">
              Métricas agregadas y patrones epidemiológicos observados
            </p>
          </div>
          {metrics?.mostFrequentDisease && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200/70 rounded-full text-xs text-amber-900">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              <span>
                Mayor prevalencia: <strong className="font-bold">{metrics.mostFrequentDisease}</strong>
              </span>
            </div>
          )}
        </div>
        <DashboardCharts diagnoses={diagnoses} />
      </section>

      {/* Últimos Diagnósticos Registrados */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Últimos Diagnósticos Registrados
            </h3>
            <p className="text-[11px] text-slate-500">
              Casos recientes evaluados en campo
            </p>
          </div>
          <Link
            href="/history"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 px-3 py-1.5 rounded-xl transition-colors"
          >
            <span>Ver historial completo ({diagnoses.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentDiagnoses.length === 0 ? (
          <EmptyState
            title="Sin diagnósticos registrados aún"
            description="Inicia tu primer análisis fotográfico asistido por IA para monitorear la salud de tus cultivos."
            actionText="Realizar Primer Análisis"
            onAction={() => (window.location.href = '/analyze')}
          />
        ) : (
          <div className="space-y-3">
            {recentDiagnoses.map((d) => (
              <DiagnosisCard
                key={d.id}
                diagnosis={d}
                farm={farms.find((f) => f.id === d.farmId)}
                plot={plots.find((p) => p.id === d.plotId)}
                crop={crops.find((c) => c.id === d.cropId)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

