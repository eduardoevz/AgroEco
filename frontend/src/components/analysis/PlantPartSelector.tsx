import React from 'react';
import { PlantPart } from '@/types';
import { Leaf, Trees, Apple, Check } from 'lucide-react';

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
      desc: 'Manchas foliares, tizones, royas, clorosis o secazón en la lámina foliar.',
      icon: <Leaf className="w-5 h-5" />,
    },
    {
      id: 'stem',
      label: 'Tallo / Pseudotallo',
      desc: 'Cancros, necrosis vascular, marchitez bacteriana o pudrición del pie.',
      icon: <Trees className="w-5 h-5" />,
    },
    {
      id: 'fruit',
      label: 'Fruto / Racimo',
      desc: 'Lesiones superficiales, pudrición apical, deformaciones o manchas necróticas.',
      icon: <Apple className="w-5 h-5" />,
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
            className={`relative flex flex-col items-start p-5 rounded-2xl border text-left transition-all duration-200 group ${
              isSelected
                ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-600/30 shadow-sm'
                : 'border-slate-200/80 bg-white hover:border-emerald-300 hover:bg-slate-50/60 shadow-sm'
            }`}
          >
            {isSelected && (
              <span className="absolute top-4 right-4 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            )}
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/25'
                  : 'bg-slate-100 text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-700'
              }`}
            >
              {item.icon}
            </div>
            <span className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mb-1">
              {item.label}
            </span>
            <span className="text-xs text-slate-500 leading-relaxed font-normal">
              {item.desc}
            </span>
          </button>
        );
      })}
    </div>
  );
};

