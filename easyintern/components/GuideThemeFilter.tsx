'use client';

import { guideThemes } from '@/data/guides';
import { GuideThemeId } from '@/types';

type GuideThemeFilterProps = {
  selected: GuideThemeId | 'all';
  onSelect: (theme: GuideThemeId | 'all') => void;
};

export default function GuideThemeFilter({ selected, onSelect }: GuideThemeFilterProps) {
  return (
    <div className="border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex gap-6 overflow-x-auto py-4 scrollbar-hide">
          <button
            onClick={() => onSelect('all')}
            className={`flex flex-shrink-0 flex-col items-center gap-1.5 border-b-2 pb-2 transition-all ${
              selected === 'all'
                ? 'border-[#1A3B5C] text-[#1A3B5C]'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            <span className="text-xl">✨</span>
            <span className="whitespace-nowrap text-xs font-medium">Tous les guides</span>
          </button>
          {guideThemes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => onSelect(theme.id)}
              className={`flex flex-shrink-0 flex-col items-center gap-1.5 border-b-2 pb-2 transition-all ${
                selected === theme.id
                  ? 'border-[#1A3B5C] text-[#1A3B5C]'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              <span className="text-xl">{theme.icon}</span>
              <span className="whitespace-nowrap text-xs font-medium">{theme.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
