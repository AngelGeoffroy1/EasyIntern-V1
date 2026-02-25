'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { parrains } from '@/data/parrains';

type SearchBarProps = {
  onSearch: (filters: { city: string; school: string; mobility: string }) => void;
  isCollapsed?: boolean;
  openField?: 'city' | 'school' | 'mobility' | null;
  onOpenFieldConsumed?: () => void;
};

type ActiveField = 'city' | 'school' | 'mobility' | null;

const fieldOrder: ActiveField[] = ['city', 'school', 'mobility'];

// Extract unique suggestions from data
const allCities = Array.from(
  new Map(parrains.map((p) => [p.city, { name: p.city, flag: p.countryFlag, country: p.country }])).values()
);
const allSchools = Array.from(new Set(parrains.map((p) => p.school)));
const mobilityOptions = [
  { value: '', label: 'Tous types', icon: '✨' },
  { value: 'exchange', label: 'Échange universitaire', icon: '🎓' },
  { value: 'stage', label: 'Stage', icon: '💼' },
];

function ClearButton({ onClick }: { onClick: (e: React.MouseEvent) => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute right-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-gray-500 transition-colors hover:bg-gray-300 hover:text-gray-700"
    >
      <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  );
}

export default function SearchBar({ onSearch, isCollapsed = false, openField, onOpenFieldConsumed }: SearchBarProps) {
  const [city, setCity] = useState('');
  const [school, setSchool] = useState('');
  const [mobility, setMobility] = useState('');
  const [activeField, setActiveField] = useState<ActiveField>(null);
  const [prevField, setPrevField] = useState<ActiveField>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Track direction for slide animation
  const slideDirection = useMemo(() => {
    if (!activeField || !prevField) return 'right';
    const prevIdx = fieldOrder.indexOf(prevField);
    const curIdx = fieldOrder.indexOf(activeField);
    return curIdx >= prevIdx ? 'right' : 'left';
  }, [activeField, prevField]);

  const changeField = (next: ActiveField) => {
    setPrevField(activeField);
    setActiveField(next);
  };

  const handleSearch = () => {
    onSearch({ city, school, mobility });
    setPrevField(activeField);
    setActiveField(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
    if (e.key === 'Escape') { setPrevField(activeField); setActiveField(null); }
  };

  // Open specific field when requested from compact search
  useEffect(() => {
    if (openField && !isCollapsed) {
      changeField(openField);
      onOpenFieldConsumed?.();
    }
  }, [openField, isCollapsed]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setPrevField(activeField);
        setActiveField(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeField]);

  // Filter cities based on input
  const filteredCities = useMemo(() => {
    if (!city) return allCities;
    return allCities.filter(
      (c) =>
        c.name.toLowerCase().includes(city.toLowerCase()) ||
        c.country.toLowerCase().includes(city.toLowerCase())
    );
  }, [city]);

  // Filter schools based on input
  const filteredSchools = useMemo(() => {
    if (!school) return allSchools;
    return allSchools.filter((s) => s.toLowerCase().includes(school.toLowerCase()));
  }, [school]);

  const selectCity = (name: string) => {
    setCity(name);
    onSearch({ city: name, school, mobility });
    setPrevField('city');
    setActiveField('school');
  };

  const selectSchool = (name: string) => {
    setSchool(name);
    onSearch({ city, school: name, mobility });
    setPrevField('school');
    setActiveField('mobility');
  };

  const selectMobility = (value: string) => {
    setMobility(value);
    onSearch({ city, school, mobility: value });
    setPrevField('mobility');
    setActiveField(null);
  };

  const clearCity = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCity('');
    onSearch({ city: '', school, mobility });
    changeField('city');
  };

  const clearSchool = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSchool('');
    onSearch({ city, school: '', mobility });
    changeField('school');
  };

  const clearMobility = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMobility('');
    onSearch({ city, school, mobility: '' });
    changeField('mobility');
  };

  return (
    <div
      ref={containerRef}
      className={`relative transition-all duration-500 ease-in-out overflow-visible ${
        isCollapsed ? 'max-h-0 opacity-0 py-0 pointer-events-none' : 'max-h-40 opacity-100 py-6'
      }`}
    >
      <div className="mx-auto max-w-3xl px-4">
        {/* Search bar pill */}
        <div
          className={`relative flex flex-col items-stretch rounded-full border shadow-sm transition-all sm:flex-row ${
            activeField ? 'border-gray-300 shadow-lg' : 'border-gray-300 hover:shadow-md'
          }`}
        >
          {/* Ville */}
          <div
            onClick={() => changeField('city')}
            className={`relative flex-1 cursor-pointer rounded-full border-b border-gray-200 transition-colors sm:border-b-0 sm:border-r ${
              activeField === 'city' ? 'bg-white' : activeField ? 'bg-gray-50 hover:bg-gray-100' : ''
            }`}
          >
            <label className="absolute left-5 top-2 text-[10px] font-bold uppercase tracking-wide text-gray-800">
              Ville
            </label>
            <input
              type="text"
              placeholder="Où partez-vous ?"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onFocus={() => changeField('city')}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent px-5 pb-2 pr-9 pt-6 text-sm text-gray-600 placeholder-gray-400 outline-none"
            />
            {city && <ClearButton onClick={clearCity} />}
          </div>

          {/* École */}
          <div
            onClick={() => changeField('school')}
            className={`relative flex-1 cursor-pointer rounded-full border-b border-gray-200 transition-colors sm:border-b-0 sm:border-r ${
              activeField === 'school' ? 'bg-white' : activeField ? 'bg-gray-50 hover:bg-gray-100' : ''
            }`}
          >
            <label className="absolute left-5 top-2 text-[10px] font-bold uppercase tracking-wide text-gray-800">
              École
            </label>
            <input
              type="text"
              placeholder="École d'origine"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              onFocus={() => changeField('school')}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent px-5 pb-2 pr-9 pt-6 text-sm text-gray-600 placeholder-gray-400 outline-none"
            />
            {school && <ClearButton onClick={clearSchool} />}
          </div>

          {/* Mobilité */}
          <div
            onClick={() => changeField('mobility')}
            className={`relative flex-1 cursor-pointer rounded-full transition-colors ${
              activeField === 'mobility' ? 'bg-white' : activeField ? 'bg-gray-50 hover:bg-gray-100' : ''
            }`}
          >
            <label className="absolute left-5 top-2 text-[10px] font-bold uppercase tracking-wide text-gray-800">
              Mobilité
            </label>
            <div className="w-full px-5 pb-2 pr-9 pt-6 text-sm text-gray-600">
              {mobility ? mobilityOptions.find((m) => m.value === mobility)?.label : 'Tous types'}
            </div>
            {mobility && <ClearButton onClick={clearMobility} />}
          </div>

          {/* Bouton recherche */}
          <button
            onClick={handleSearch}
            className="m-2 flex items-center justify-center rounded-full bg-[#FF385C] px-4 py-3 text-white transition-transform hover:scale-105 active:scale-95 sm:m-1.5 sm:h-auto sm:w-12 sm:px-0"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span className="ml-2 font-medium sm:hidden">Rechercher</span>
          </button>
        </div>

        {/* Dropdown Panel */}
        <div
          className={`absolute left-1/2 z-40 mt-3 w-full max-w-3xl -translate-x-1/2 px-4 transition-all duration-300 ease-out ${
            activeField
              ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
              : 'pointer-events-none -translate-y-2 scale-[0.98] opacity-0'
          }`}
        >
          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl">
            {/* City dropdown */}
            {activeField === 'city' && (
              <div
                key="city-panel"
                className={slideDirection === 'right' ? 'animate-slide-right' : 'animate-slide-left'}
              >
                <div className="p-5">
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-500">
                    Destinations populaires
                  </h3>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {filteredCities.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => selectCity(c.name)}
                        className={`flex items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-gray-100 ${
                          city === c.name ? 'bg-gray-100' : ''
                        }`}
                      >
                        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-lg">
                          {c.flag}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-[#222]">{c.name}</p>
                          <p className="text-xs text-gray-500">{c.country}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                  {filteredCities.length === 0 && (
                    <p className="py-4 text-center text-sm text-gray-400">Aucune ville trouvée</p>
                  )}
                </div>
              </div>
            )}

            {/* School dropdown */}
            {activeField === 'school' && (
              <div
                key="school-panel"
                className={slideDirection === 'right' ? 'animate-slide-right' : 'animate-slide-left'}
              >
                <div className="p-5">
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-500">
                    Écoles partenaires
                  </h3>
                  <div className="space-y-1">
                    {filteredSchools.map((s) => (
                      <button
                        key={s}
                        onClick={() => selectSchool(s)}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-gray-100 ${
                          school === s ? 'bg-gray-100' : ''
                        }`}
                      >
                        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-lg">
                          🎓
                        </span>
                        <p className="text-sm font-medium text-[#222]">{s}</p>
                      </button>
                    ))}
                  </div>
                  {filteredSchools.length === 0 && (
                    <p className="py-4 text-center text-sm text-gray-400">Aucune école trouvée</p>
                  )}
                </div>
              </div>
            )}

            {/* Mobility dropdown */}
            {activeField === 'mobility' && (
              <div
                key="mobility-panel"
                className={slideDirection === 'right' ? 'animate-slide-right' : 'animate-slide-left'}
              >
                <div className="p-5">
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-500">
                    Type de mobilité
                  </h3>
                  <div className="space-y-1">
                    {mobilityOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => selectMobility(opt.value)}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-gray-100 ${
                          mobility === opt.value ? 'bg-gray-100' : ''
                        }`}
                      >
                        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-lg">
                          {opt.icon}
                        </span>
                        <p className="text-sm font-medium text-[#222]">{opt.label}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
