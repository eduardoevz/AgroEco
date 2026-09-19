import React from 'react';
import Link from 'next/link';
import { Plot, Crop } from '@/types';
import { Sprout, Edit2, Trash2, ScanLine, Layers } from 'lucide-react';

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
    <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm hover:shadow-card-hover hover:border-emerald-300/80 transition-all duration-200 flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                {plot.name}
              </h4>
              <span className="inline-block text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md mt-0.5">
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
                className="p-2 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(plot)}
                aria-label={`Eliminar parcela ${plot.name}`}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {plot.description && (
          <p className="text-xs text-slate-500 line-clamp-2 mb-3 font-normal leading-relaxed">
            {plot.description}
          </p>
        )}

        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
          <Layers className="w-3.5 h-3.5 text-slate-400" />
          <span>Área cultivada: </span>
          <strong className="text-slate-800 font-bold">
            {plot.area} {plot.areaUnit}
          </strong>
        </div>
      </div>

      <div className="pt-3.5 border-t border-slate-100 flex items-center justify-end">
        <Link
          href={`/analyze?farmId=${plot.farmId}&plotId=${plot.id}&cropId=${plot.cropId}`}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-sm active:scale-[0.98]"
        >
          <ScanLine className="w-3.5 h-3.5" />
          <span>Analizar Parcela</span>
        </Link>
      </div>
    </div>
  );
};

