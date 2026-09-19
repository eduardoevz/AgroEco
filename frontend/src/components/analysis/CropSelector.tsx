import React from 'react';
import { Crop } from '@/types';
import { Sprout } from 'lucide-react';

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
            className={`flex flex-col items-start p-4 rounded-2xl border text-left transition-all ${
              isSelected
                ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-600/30'
                : 'border-stone-200 bg-white hover:border-emerald-300 hover:bg-stone-50/80'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 transition-colors ${
                isSelected
                  ? 'bg-emerald-600 text-white'
                  : 'bg-stone-100 text-stone-600'
              }`}
            >
              <Sprout className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-stone-900">{crop.name}</span>
            {crop.scientificName && (
              <span className="text-[11px] text-stone-500 italic">
                {crop.scientificName}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
