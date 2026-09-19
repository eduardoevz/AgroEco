'use client';

import React from 'react';
import { Farm, Plot, Crop } from '@/types';
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
    <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Control Espacial & Filtros Geográficos
            </h4>
            <p className="text-[11px] text-slate-500 font-medium">
              Filtra por predio, cultivo o severidad del foco
            </p>
          </div>
        </div>

        {/* Alternador Marcadores vs Mapa de Calor */}
        <div className="inline-flex rounded-2xl bg-slate-100 p-1 border border-slate-200/80 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => onViewModeChange('markers')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'markers'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>Marcadores GNSS</span>
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('heatmap')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'heatmap'
                ? 'bg-white text-rose-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-rose-600" />
            <span>Densidad / Calor</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        {/* Filtro Finca */}
        <div>
          <label className="block text-slate-600 font-bold mb-1.5">Predio / Finca</label>
          <select
            value={filters.farmId}
            onChange={(e) => handleChange('farmId', e.target.value)}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-900"
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
          <label className="block text-slate-600 font-bold mb-1.5">Lote / Parcela</label>
          <select
            value={filters.plotId}
            onChange={(e) => handleChange('plotId', e.target.value)}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-900"
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
          <label className="block text-slate-600 font-bold mb-1.5">Especie / Cultivo</label>
          <select
            value={filters.cropId}
            onChange={(e) => handleChange('cropId', e.target.value)}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-900"
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
          <label className="block text-slate-600 font-bold mb-1.5">Estado Epidemiológico</label>
          <select
            value={filters.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-900"
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

