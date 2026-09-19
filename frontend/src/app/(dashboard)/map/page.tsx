'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getDiagnoses, getFarms, getPlotsByOwner, getCrops } from '@/lib/firebase/firestore';
import { Diagnosis, Farm, Plot, Crop } from '@/types';
import { PageTitle } from '@/components/layout/PageTitle';
import { DiagnosisMap } from '@/components/map/DiagnosisMap';
import { MapFilters, MapFiltersState } from '@/components/map/MapFilters';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { Map as MapIcon, ScanLine, Crosshair } from 'lucide-react';
import Link from 'next/link';

const getCropEmoji = (cropId?: string): string => {
  if (!cropId) return '🌱';
  const id = cropId.toLowerCase();
  if (id.includes('cafe')) return '☕';
  if (id.includes('maiz')) return '🌽';
  if (id.includes('arroz')) return '🌾';
  if (id.includes('frijol')) return '🫘';
  if (id.includes('tomate')) return '🍅';
  if (id.includes('platano')) return '🍌';
  return '🌱';
};

function MapContent() {
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [plots, setPlots] = useState<Plot[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);

  const [viewMode, setViewMode] = useState<'markers' | 'heatmap'>('markers');
  const [filters, setFilters] = useState<MapFiltersState>({
    farmId: searchParams.get('farmId') || '',
    plotId: searchParams.get('plotId') || '',
    cropId: searchParams.get('cropId') || '',
    status: '',
  });

  const urlDiagnosisId = searchParams.get('diagnosisId') || undefined;
  const [selectedDiagnosisId, setSelectedDiagnosisId] = useState<string | undefined>(urlDiagnosisId);

  useEffect(() => {
    if (urlDiagnosisId) {
      setSelectedDiagnosisId(urlDiagnosisId);
    }
  }, [urlDiagnosisId]);

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      try {
        const [d, f, p, c] = await Promise.all([
          getDiagnoses(user.id),
          getFarms(user.id),
          getPlotsByOwner(user.id),
          getCrops(),
        ]);
        setDiagnoses(d);
        setFarms(f);
        setPlots(p);
        setCrops(c);
      } catch (err) {
        console.error('Error cargando datos del mapa:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  // Si viene un diagnóstico específico, asegurarse de que no quede oculto por filtros restrictivos
  useEffect(() => {
    if (selectedDiagnosisId && diagnoses.length > 0) {
      const target = diagnoses.find((d) => d.id === selectedDiagnosisId);
      if (target) {
        setFilters((prev) => {
          let updated = { ...prev };
          let changed = false;
          if (prev.farmId && prev.farmId !== target.farmId) {
            updated.farmId = '';
            changed = true;
          }
          if (prev.cropId && prev.cropId !== target.cropId) {
            updated.cropId = '';
            changed = true;
          }
          if (prev.plotId && prev.plotId !== target.plotId) {
            updated.plotId = '';
            changed = true;
          }
          if (prev.status && prev.status !== target.status) {
            updated.status = '';
            changed = true;
          }
          return changed ? updated : prev;
        });
      }
    }
  }, [selectedDiagnosisId, diagnoses]);

  if (loading) {
    return <LoadingState message="Cargando mapa de brotes y focos fitosanitarios..." />;
  }

  // Filtrar diagnósticos reactivamente
  const filteredDiagnoses = diagnoses.filter((d) => {
    if (filters.farmId && d.farmId !== filters.farmId) return false;
    if (filters.plotId && d.plotId !== filters.plotId) return false;
    if (filters.cropId && d.cropId !== filters.cropId) return false;
    if (filters.status && d.status !== filters.status) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <PageTitle
        title="Mapa Epidemiológico de Brotes"
        subtitle="Vigilancia espacial satelital de diagnósticos, focos activos y severidad fitosanitaria"
        action={
          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-md shadow-emerald-700/20 active:scale-[0.98]"
          >
            <ScanLine className="w-4 h-4" />
            <span>Nuevo Escaneo IA</span>
          </Link>
        }
      />

      {/* Resumen de brotes georreferenciados - Telemetría en vivo */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-slate-950 text-white rounded-3xl border border-slate-800 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Crosshair className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-extrabold text-sm text-white">
                {filteredDiagnoses.length} {filteredDiagnoses.length === 1 ? 'foco georreferenciado activo' : 'focos georreferenciados activos'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Telemetría satelital GNSS vinculada a parcelas de cultivo
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 text-xs flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 font-bold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            {filteredDiagnoses.filter((d) => d.status === 'detected').length} Detectados
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            {filteredDiagnoses.filter((d) => d.status === 'treated' || d.status === 'monitoring').length} Seguimiento
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            {filteredDiagnoses.filter((d) => d.status === 'controlled').length} Controlados
          </span>
        </div>
      </div>

      {/* Selector Rápido de Focos / Muestras */}
      {filteredDiagnoses.length > 0 && (
        <div className="bg-white p-3.5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-3 overflow-x-auto">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex-shrink-0 flex items-center gap-1 pl-1">
            <Crosshair className="w-3.5 h-3.5 text-emerald-600" />
            Focos:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            {filteredDiagnoses.map((d) => {
              const isTarget = selectedDiagnosisId === d.id;
              const emoji = getCropEmoji(d.cropId);
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setSelectedDiagnosisId(d.id)}
                  className={`flex-shrink-0 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                    isTarget
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-700/20'
                      : 'bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-slate-100 hover:border-emerald-300'
                  }`}
                >
                  <span>{emoji}</span>
                  <span>{d.predictedDiseaseName}</span>
                  <span className={`text-[10px] ${isTarget ? 'text-emerald-100' : 'text-slate-400'}`}>
                    ({(d.confidence * 100).toFixed(0)}%)
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Barra de Filtros y Modo */}
      <MapFilters
        filters={filters}
        onChange={(newFilters) => setFilters(newFilters)}
        farms={farms}
        plots={plots}
        crops={crops}
        viewMode={viewMode}
        onViewModeChange={(mode) => setViewMode(mode)}
      />

      {/* Contenedor del Mapa */}
      {filteredDiagnoses.length === 0 ? (
        <EmptyState
          title="No hay diagnósticos para los filtros seleccionados"
          description="Intenta cambiar los filtros de finca o estado, o realiza un nuevo análisis georreferenciado."
          icon={<MapIcon className="w-8 h-8" />}
          actionText="Limpiar Filtros"
          onAction={() => setFilters({ farmId: '', plotId: '', cropId: '', status: '' })}
        />
      ) : (
        <div className="h-[580px] w-full rounded-3xl overflow-hidden shadow-card-hover border border-slate-200/80">
          <DiagnosisMap
            diagnoses={filteredDiagnoses}
            farms={farms}
            plots={plots}
            crops={crops}
            selectedDiagnosisId={selectedDiagnosisId}
            viewMode={viewMode}
          />
        </div>
      )}
    </div>
  );
}

export default function MapPage() {
  return (
    <Suspense fallback={<LoadingState message="Cargando mapa epidemiológico..." />}>
      <MapContent />
    </Suspense>
  );
}


