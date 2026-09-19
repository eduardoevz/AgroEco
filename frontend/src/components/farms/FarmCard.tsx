import React from 'react';
import Link from 'next/link';
import { Farm } from '@/types';
import { MapPin, ArrowRight, Layers, Trash2, Edit } from 'lucide-react';

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
    <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-base font-bold text-stone-900 group-hover:text-emerald-700 transition-colors">
            {farm.name}
          </h3>
          <div className="flex items-center gap-1">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(farm)}
                aria-label={`Editar ${farm.name}`}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(farm)}
                aria-label={`Eliminar ${farm.name}`}
                className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <p className="text-xs text-stone-500 line-clamp-2 mb-4">
          {farm.description || 'Sin descripción adicional registrada.'}
        </p>

        <div className="space-y-1.5 text-xs text-stone-600 mb-4">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-stone-400" />
            <span>
              {farm.municipality}, {farm.department}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-stone-400" />
            <span>
              {farm.area} {farm.areaUnit} · {plotsCount} parcela{plotsCount === 1 ? '' : 's'}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
        <Link
          href={`/farms/${farm.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
        >
          <span>Ver parcelas y mapa</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <Link
          href={`/analyze?farmId=${farm.id}`}
          className="px-2.5 py-1 text-[11px] font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
        >
          Analizar aquí
        </Link>
      </div>
    </div>
  );
};
