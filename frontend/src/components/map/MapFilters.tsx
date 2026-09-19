'use client';

import React from 'react';
import { Farm, Plot, Crop, DiagnosisStatus } from '@/types';
import { Filter, Layers, Flame, MapPin } from 'lucide-react';

export interface MapFiltersState {
  farmId: string;
  plotId: string;
  cropId: string;
  status: string;
}

interface MapFiltersProps {
  filters: MapFiltersState;
  onChange: (filters: MapFiltersState) => void;
  farms: Farm[];
  plots: Plot[];
  crops: Crop[];
  viewMode: 'markers' | 'heatmap';
  onViewModeChange: (mode: 'markers' | 'heatmap') => void;
}

export const MapFilters: React.FC<MapFiltersProps> = ({
  filters,
  onChange,
  farms,
  plots,
  crops,
  viewMode,
  onViewModeChange,
}) => {
  const filteredPlots = filters.farmId
    ? plots.filter((p) => p.farmId === filters.farmId)
    : plots;

  const handleChange = (field: keyof MapFiltersState, val: string) => {
    const updated = { ...filters, [field]: val };
    if (field === 'farmId') {
      updated.plotId = ''; // Reset plot if farm changes
    }
    onChange(updated);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2 text-xs font-bold text-stone-900 uppercase tracking-wider">
          <Filter className="w-4 h-4 text-emerald-700" />
          <span>Filtros de Georreferenciación</span>
        </div>

        {/* Alternador Marcadores vs Mapa de Calor */}
        <div className="inline-flex rounded-xl bg-stone-100 p-1">
          <button
            type="button"
            onClick={() => onViewModeChange('markers')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'markers'
                ? 'bg-white text-emerald-800 shadow-sm font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Marcadores</span>
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('heatmap')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'heatmap'
                ? 'bg-white text-red-800 shadow-sm font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Concentración</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        {/* Filtro Finca */}
        <div>
          <label className="block text-stone-500 font-medium mb-1">Finca</label>
          <select
            value={filters.farmId}
            onChange={(e) => handleChange('farmId', e.target.value)}
            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Todas las fincas</option>
            {farms.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro Parcela */}
        <div>
          <label className="block text-stone-500 font-medium mb-1">Parcela</label>
          <select
            value={filters.plotId}
            onChange={(e) => handleChange('plotId', e.target.value)}
            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Todas las parcelas</option>
            {filteredPlots.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro Cultivo */}
        <div>
          <label className="block text-stone-500 font-medium mb-1">Cultivo</label>
          <select
            value={filters.cropId}
            onChange={(e) => handleChange('cropId', e.target.value)}
            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Todos los cultivos</option>
            {crops.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro Estado */}
        <div>
          <label className="block text-stone-500 font-medium mb-1">Estado</label>
          <select
            value={filters.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Todos los estados</option>
            <option value="detected">Detectado</option>
            <option value="monitoring">En seguimiento</option>
            <option value="treated">Tratado</option>
            <option value="controlled">Controlado</option>
          </select>
        </div>
      </div>
    </div>
  );
};
