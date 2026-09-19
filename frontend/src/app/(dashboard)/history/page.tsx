'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getDiagnoses, getFarms, getPlotsByOwner, getCrops } from '@/lib/firebase/firestore';
import { Diagnosis, Farm, Plot, Crop, DiagnosisStatus } from '@/types';
import { PageTitle } from '@/components/layout/PageTitle';
import { DiagnosisCard } from '@/components/diagnosis/DiagnosisCard';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { Search, Filter, ScanLine, History as HistoryIcon, ArrowUpDown } from 'lucide-react';

export default function HistoryPage() {
  const { user } = useAuth();
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [plots, setPlots] = useState<Plot[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros y búsqueda
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [cropFilter, setCropFilter] = useState<string>('');
  const [farmFilter, setFarmFilter] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

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
        console.error('Error cargando historial:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  if (loading) {
    return <LoadingState message="Cargando historial de diagnósticos fitosanitarios..." />;
  }

  // Filtrado y ordenamiento
  const filtered = diagnoses
    .filter((d) => {
      if (statusFilter && d.status !== statusFilter) return false;
      if (cropFilter && d.cropId !== cropFilter) return false;
      if (farmFilter && d.farmId !== farmFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchDisease = d.predictedDiseaseName.toLowerCase().includes(q);
        const matchNotes = d.notes?.toLowerCase().includes(q);
        const crop = crops.find((c) => c.id === d.cropId);
        const matchCrop = crop?.name.toLowerCase().includes(q);
        if (!matchDisease && !matchNotes && !matchCrop) return false;
      }
      return true;
    })
    .sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });

  return (
    <div className="space-y-6">
      <PageTitle
        title="Expedientes y Trazabilidad"
        subtitle="Registro histórico de afecciones, evolución temporal y medidas de contención fitosanitaria"
        action={
          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-md shadow-emerald-700/20 active:scale-[0.98]"
          >
            <ScanLine className="w-4 h-4" />
            <span>Nuevo Análisis</span>
          </Link>
        }
      />

      {/* Barra de Búsqueda y Filtros */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Buscador */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por patología, cultivo, síntoma o predio..."
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-900"
            />
          </div>

          {/* Ordenar */}
          <button
            type="button"
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200/80 hover:bg-slate-100 rounded-2xl transition-all w-full sm:w-auto justify-center"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <span>{sortOrder === 'desc' ? 'Más recientes' : 'Más antiguos'}</span>
          </button>
        </div>

        {/* Segmented Status Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          {[
            { id: '', label: 'Todos', count: diagnoses.length },
            { id: 'detected', label: 'Detectados', count: diagnoses.filter((d) => d.status === 'detected').length },
            { id: 'monitoring', label: 'En seguimiento', count: diagnoses.filter((d) => d.status === 'monitoring').length },
            { id: 'treated', label: 'Tratados', count: diagnoses.filter((d) => d.status === 'treated').length },
            { id: 'controlled', label: 'Controlados', count: diagnoses.filter((d) => d.status === 'controlled').length },
          ].map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-bold text-xs transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-white text-slate-500 border border-slate-200'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filtros desplegables adicionales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
          <select
            value={farmFilter}
            onChange={(e) => setFarmFilter(e.target.value)}
            className="px-3.5 py-2.5 bg-slate-50 border border-slate-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-700"
          >
            <option value="">Todas las fincas</option>
            {farms.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.municipality})
              </option>
            ))}
          </select>

          <select
            value={cropFilter}
            onChange={(e) => setCropFilter(e.target.value)}
            className="px-3.5 py-2.5 bg-slate-50 border border-slate-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-700"
          >
            <option value="">Todos los cultivos</option>
            {crops.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Resultados */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No se encontraron diagnósticos"
          description={
            diagnoses.length === 0
              ? 'Aún no has registrado ningún diagnóstico fitosanitario en la plataforma.'
              : 'Ningún expediente coincide con los criterios o filtros seleccionados.'
          }
          icon={<HistoryIcon className="w-8 h-8" />}
          actionText={diagnoses.length === 0 ? 'Iniciar Primer Análisis' : 'Restablecer Filtros'}
          onAction={() => {
            if (diagnoses.length === 0) {
              window.location.href = '/analyze';
            } else {
              setSearchQuery('');
              setStatusFilter('');
              setCropFilter('');
              setFarmFilter('');
            }
          }}
        />
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-medium">
            <span>
              Mostrando <strong className="text-slate-800 font-bold">{filtered.length}</strong> expediente{filtered.length === 1 ? '' : 's'}
            </span>
          </div>

          {filtered.map((d) => (
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
    </div>
  );
}

