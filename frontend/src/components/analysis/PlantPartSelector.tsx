import React from 'react';
import { PlantPart } from '@/types';
import { Leaf, Trees, Apple } from 'lucide-react';

interface PlantPartSelectorProps {
  selectedPart?: PlantPart;
  onSelect: (part: PlantPart) => void;
}

export const PlantPartSelector: React.FC<PlantPartSelectorProps> = ({
  selectedPart,
  onSelect,
}) => {
  const parts: { id: PlantPart; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      id: 'leaf',
      label: 'Hoja / Follaje',
      desc: 'Manchas, tizones, royas o decoloración en la lámina foliar.',
      icon: <Leaf className="w-6 h-6" />,
    },
    {
      id: 'stem',
      label: 'Tallo / Pseudotallo',
      desc: 'Cancros, necrosis vascular, marchitez o pudrición de base.',
      icon: <Trees className="w-6 h-6" />,
    },
    {
      id: 'fruit',
      label: 'Fruto / Racimo',
      desc: 'Lesiones superficiales, pudrición de corona o deformaciones.',
      icon: <Apple className="w-6 h-6" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {parts.map((item) => {
        const isSelected = selectedPart === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={`flex flex-col items-start p-4 rounded-2xl border text-left transition-all ${
              isSelected
                ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-600/30'
                : 'border-stone-200 bg-white hover:border-emerald-300 hover:bg-stone-50/80'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                isSelected
                  ? 'bg-emerald-600 text-white'
                  : 'bg-stone-100 text-stone-600'
              }`}
            >
              {item.icon}
            </div>
            <span className="text-sm font-bold text-stone-900 mb-1">
              {item.label}
            </span>
            <span className="text-xs text-stone-500 leading-relaxed">
              {item.desc}
            </span>
          </button>
        );
      })}
    </div>
  );
};
