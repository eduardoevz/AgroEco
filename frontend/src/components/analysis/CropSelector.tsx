import React from 'react';
import { Crop } from '@/types';
import { Sprout, Check } from 'lucide-react';

interface CropSelectorProps {
  crops: Crop[];
  selectedCropId?: string;
  onSelect: (cropId: string) => void;
}

export const CropSelector: React.FC<CropSelectorProps> = ({
  crops,
  selectedCropId,
  onSelect,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {crops.map((crop) => {
        const isSelected = selectedCropId === crop.id;
        return (
          <button
            key={crop.id}
            type="button"
            onClick={() => onSelect(crop.id)}
            className={`relative flex flex-col items-start p-4 rounded-2xl border text-left transition-all duration-200 group ${
              isSelected
                ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-600/30 shadow-sm'
                : 'border-slate-200/80 bg-white hover:border-emerald-300 hover:bg-slate-50/60 shadow-sm'
            }`}
          >
            {isSelected && (
              <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            )}
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                  : 'bg-slate-100 text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-700'
              }`}
            >
              <Sprout className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
              {crop.name}
            </span>
            {crop.scientificName && (
              <span className="text-[11px] text-slate-500 italic mt-0.5">
                {crop.scientificName}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

