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
import { PageTitle } from '@/components/layout/PageTitle';
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
    return <LoadingState message="Cargando métricas de salud agronómica..." />;
  }

  const recentDiagnoses = diagnoses.slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Cabecera con bienvenida */}
      <PageTitle
        title={`Bienvenido, ${user?.name || 'Productor'}`}
        subtitle="Monitoreo fitosanitario en tiempo real de tus parcelas y fincas"
        action={
          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-all shadow-sm"
          >
            <ScanLine className="w-4 h-4" />
            <span>Nuevo Análisis</span>
          </Link>
        }
      />

      {/* Tarjetas de Métricas Principales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Análisis"
          value={metrics?.totalAnalyses || 0}
          subtitle={`${metrics?.farmsCount || 0} fincas activas`}
          icon={ScanLine}
          variant="default"
        />
        <MetricCard
          title="Casos Detectados"
          value={metrics?.detectedCount || 0}
          subtitle="Requieren inspección"
          icon={AlertTriangle}
          variant="danger"
        />
        <MetricCard
          title="En Seguimiento"
          value={metrics?.monitoringCount || 0}
          subtitle="Bajo observación"
          icon={Clock}
          variant="warning"
        />
        <MetricCard
          title="Controlados"
          value={metrics?.controlledCount || 0}
          subtitle="Casos superados"
          icon={ShieldCheck}
          variant="success"
        />
      </div>

      {/* Acciones Rápidas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          href="/analyze"
          className="p-4 bg-emerald-800 text-white rounded-2xl shadow-sm hover:bg-emerald-900 transition-all flex flex-col justify-between group"
        >
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center mb-3">
            <ScanLine className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xs font-bold block">Analizar Planta</span>
            <span className="text-[11px] text-emerald-200">Tomar o subir foto</span>
          </div>
        </Link>

        <Link
          href="/map"
          className="p-4 bg-white border border-stone-200 rounded-2xl shadow-sm hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between group"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-stone-900 block group-hover:text-emerald-700 transition-colors">
              Ver Mapa
            </span>
            <span className="text-[11px] text-stone-500">Brotes georreferenciados</span>
          </div>
        </Link>

        <Link
          href="/farms"
          className="p-4 bg-white border border-stone-200 rounded-2xl shadow-sm hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between group"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
            <Trees className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-stone-900 block group-hover:text-emerald-700 transition-colors">
              Mis Fincas
            </span>
            <span className="text-[11px] text-stone-500">
              {farms.length} registradas
            </span>
          </div>
        </Link>

        <Link
          href="/history"
          className="p-4 bg-white border border-stone-200 rounded-2xl shadow-sm hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between group"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-3">
            <History className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-stone-900 block group-hover:text-emerald-700 transition-colors">
              Historial
            </span>
            <span className="text-[11px] text-stone-500">Trazabilidad completa</span>
          </div>
        </Link>
      </div>

      {/* Gráficos Analíticos */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
            Analítica de Sanidad Vegetal
          </h3>
          {metrics?.mostFrequentDisease && (
            <span className="text-xs text-stone-500">
              Mayor prevalencia: <strong className="text-stone-800">{metrics.mostFrequentDisease}</strong>
            </span>
          )}
        </div>
        <DashboardCharts diagnoses={diagnoses} />
      </section>

      {/* Últimos Diagnósticos */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
            Últimos Diagnósticos Registrados
          </h3>
          <Link
            href="/history"
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
          >
            <span>Ver todos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentDiagnoses.length === 0 ? (
          <EmptyState
            title="Sin diagnósticos registrados"
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
