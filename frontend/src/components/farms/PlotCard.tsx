import React from 'react';
import Link from 'next/link';
import { Plot, Crop } from '@/types';
import { Sprout, Edit, Trash2, ScanLine } from 'lucide-react';

interface PlotCardProps {
  plot: Plot;
  crop?: Crop;
  onEdit?: (plot: Plot) => void;
  onDelete?: (plot: Plot) => void;
}

export const PlotCard: React.FC<PlotCardProps> = ({
  plot,
  crop,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Sprout className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-stone-900">{plot.name}</h4>
              <span className="text-[11px] font-semibold text-emerald-700">
                {crop?.name || plot.cropId}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(plot)}
                aria-label={`Editar parcela ${plot.name}`}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(plot)}
                aria-label={`Eliminar parcela ${plot.name}`}
                className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {plot.description && (
          <p className="text-xs text-stone-500 line-clamp-2 my-2">
            {plot.description}
          </p>
        )}

        <div className="text-xs text-stone-500 mt-2 mb-3">
          <span>Área: </span>
          <span className="font-semibold text-stone-700">
            {plot.area} {plot.areaUnit}
          </span>
        </div>
      </div>

      <div className="pt-2.5 border-t border-stone-100 flex items-center justify-end">
        <Link
          href={`/analyze?farmId=${plot.farmId}&plotId=${plot.id}&cropId=${plot.cropId}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors shadow-sm"
        >
          <ScanLine className="w-3.5 h-3.5" />
          <span>Analizar esta parcela</span>
        </Link>
      </div>
    </div>
  );
};
