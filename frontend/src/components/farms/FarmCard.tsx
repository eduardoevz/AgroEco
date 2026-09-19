import React from 'react';
import Link from 'next/link';
import { Farm } from '@/types';
import { MapPin, ArrowRight, Layers, Trash2, Edit2, Trees, ScanLine } from 'lucide-react';

interface FarmCardProps {
  farm: Farm;
  plotsCount?: number;
  onEdit?: (farm: Farm) => void;
  onDelete?: (farm: Farm) => void;
}

export const FarmCard: React.FC<FarmCardProps> = ({
  farm,
  plotsCount = 0,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="relative overflow-hidden bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-card-hover hover:border-emerald-300/80 transition-all duration-200 flex flex-col justify-between group">
      {/* Glow de fondo al hover */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/10 transition-colors" />

      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <Trees className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                {farm.name}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="truncate font-medium">
                  {farm.municipality}, {farm.department}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(farm)}
                aria-label={`Editar ${farm.name}`}
                className="p-2 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(farm)}
                aria-label={`Eliminar ${farm.name}`}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <p className="text-xs text-slate-600 line-clamp-2 mb-4 font-normal leading-relaxed">
          {farm.description || 'Predio agroecológico registrado para monitoreo fitosanitario y vigilancia epidemiológica.'}
        </p>

        {/* Medallones de datos */}
        <div className="flex items-center gap-2 flex-wrap mb-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-700">
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              {farm.area} {farm.areaUnit} totales
            </span>
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-100 text-xs font-bold text-emerald-700">
            <span>{plotsCount}</span>
            <span>parcela{plotsCount === 1 ? '' : 's'}</span>
          </span>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
        <Link
          href={`/farms/${farm.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 group-hover:text-emerald-700 hover:underline transition-colors"
        >
          <span>Ver Parcelas</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
        <Link
          href={`/analyze?farmId=${farm.id}`}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100/80 rounded-xl border border-emerald-200/60 transition-colors"
        >
          <ScanLine className="w-3.5 h-3.5" />
          <span>Escanear Aquí</span>
        </Link>
      </div>
    </div>
  );
};

