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
        title="Historial de Diagnósticos"
        subtitle="Registro histórico y trazabilidad de afecciones fitosanitarias"
        action={
          <Link
            href="/analyze"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-all shadow-sm"
          >
            <ScanLine className="w-4 h-4" />
            <span>Nuevo Análisis</span>
          </Link>
        }
      />

      {/* Barra de Búsqueda y Filtros */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Buscador */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por enfermedad, cultivo o síntoma..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Ordenar */}
          <button
            type="button"
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-700 bg-stone-50 border border-stone-200 hover:bg-stone-100 rounded-xl transition-colors w-full sm:w-auto justify-center"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-500" />
            <span>{sortOrder === 'desc' ? 'Más recientes' : 'Más antiguos'}</span>
          </button>
        </div>

        {/* Filtros desplegables */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
          <select
            value={farmFilter}
            onChange={(e) => setFarmFilter(e.target.value)}
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Todas las fincas</option>
            {farms.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>

          <select
            value={cropFilter}
            onChange={(e) => setCropFilter(e.target.value)}
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Todos los cultivos</option>
            {crops.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Todos los estados</option>
            <option value="detected">Detectado</option>
            <option value="monitoring">En seguimiento</option>
            <option value="treated">Tratado</option>
            <option value="controlled">Controlado</option>
          </select>
        </div>
      </div>

      {/* Resultados */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No se encontraron diagnósticos"
          description={
            diagnoses.length === 0
              ? 'Aún no has registrado ningún diagnóstico en la plataforma.'
              : 'Ningún diagnóstico coincide con los criterios de búsqueda aplicados.'
          }
          icon={<HistoryIcon className="w-7 h-7" />}
          actionText={diagnoses.length === 0 ? 'Iniciar Análisis' : 'Limpiar Filtros'}
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
          <div className="flex items-center justify-between text-xs text-stone-500 px-1">
            <span>
              Mostrando <strong>{filtered.length}</strong> registro{filtered.length === 1 ? '' : 's'}
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
