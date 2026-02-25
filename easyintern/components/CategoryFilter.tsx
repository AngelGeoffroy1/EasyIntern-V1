'use client';

import { categories } from '@/data/parrains';
import { ExpertiseCategory } from '@/types';

type CategoryFilterProps = {
  selected: ExpertiseCategory | 'all';
  onSelect: (category: ExpertiseCategory | 'all') => void;
};

export default function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex gap-6 overflow-x-auto py-4 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={`flex flex-shrink-0 flex-col items-center gap-1.5 border-b-2 pb-2 transition-all ${
                selected === cat.id
                  ? 'border-[#1A3B5C] text-[#1A3B5C]'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              <span className="text-xl">{cat.icon}</span>
              <span className="whitespace-nowrap text-xs font-medium">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
