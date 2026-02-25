'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { destinations } from '@/data/guides';

type GuideSearchBarProps = {
  onSearch: (filters: { departure: string; destination: string }) => void;
};

type ActiveField = 'departure' | 'destination' | null;

const fieldOrder: ActiveField[] = ['departure', 'destination'];

const departureOptions = [
  { name: 'France', flag: '🇫🇷' },
];

const destinationOptions = destinations.map((d) => ({ name: d.country, flag: d.flag }));

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

export default function GuideSearchBar({ onSearch }: GuideSearchBarProps) {
  const [departure, setDeparture] = useState('France');
  const [destination, setDestination] = useState('');
  const [activeField, setActiveField] = useState<ActiveField>(null);
  const [prevField, setPrevField] = useState<ActiveField>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
    onSearch({ departure, destination });
    setPrevField(activeField);
    setActiveField(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
    if (e.key === 'Escape') { setPrevField(activeField); setActiveField(null); }
  };

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

  const filteredDestinations = useMemo(() => {
    if (!destination) return destinationOptions;
    return destinationOptions.filter((d) =>
      d.name.toLowerCase().includes(destination.toLowerCase())
    );
  }, [destination]);

  const selectDeparture = (name: string) => {
    setDeparture(name);
    onSearch({ departure: name, destination });
    setPrevField('departure');
    setActiveField('destination');
  };

  const selectDestination = (name: string) => {
    setDestination(name);
    onSearch({ departure, destination: name });
    setPrevField('destination');
    setActiveField(null);
  };

  const clearDestination = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDestination('');
    onSearch({ departure, destination: '' });
    changeField('destination');
  };

  return (
    <div ref={containerRef} className="relative py-6 overflow-visible">
      <div className="mx-auto max-w-2xl px-4">
        {/* Search bar pill */}
        <div
          className={`relative flex flex-col items-stretch rounded-full border shadow-sm transition-all sm:flex-row ${
            activeField ? 'border-gray-300 shadow-lg' : 'border-gray-300 hover:shadow-md'
          }`}
        >
          {/* Pays de départ */}
          <div
            onClick={() => changeField('departure')}
            className={`relative flex-1 cursor-pointer rounded-full border-b border-gray-200 transition-colors sm:border-b-0 sm:border-r ${
              activeField === 'departure' ? 'bg-white' : activeField ? 'bg-gray-50 hover:bg-gray-100' : ''
            }`}
          >
            <label className="absolute left-5 top-2 text-[10px] font-bold uppercase tracking-wide text-gray-800">
              Pays de départ
            </label>
            <div className="w-full px-5 pb-2 pr-9 pt-6 text-sm text-gray-600">
              {departure ? `🇫🇷 ${departure}` : 'Sélectionnez'}
            </div>
          </div>

          {/* Pays de destination */}
          <div
            onClick={() => changeField('destination')}
            className={`relative flex-1 cursor-pointer rounded-full transition-colors ${
              activeField === 'destination' ? 'bg-white' : activeField ? 'bg-gray-50 hover:bg-gray-100' : ''
            }`}
          >
            <label className="absolute left-5 top-2 text-[10px] font-bold uppercase tracking-wide text-gray-800">
              Destination
            </label>
            <input
              type="text"
              placeholder="Où partez-vous ?"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              onFocus={() => changeField('destination')}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent px-5 pb-2 pr-9 pt-6 text-sm text-gray-600 placeholder-gray-400 outline-none"
            />
            {destination && <ClearButton onClick={clearDestination} />}
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
          className={`absolute left-1/2 z-40 mt-3 w-full max-w-2xl -translate-x-1/2 px-4 transition-all duration-300 ease-out ${
            activeField
              ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
              : 'pointer-events-none -translate-y-2 scale-[0.98] opacity-0'
          }`}
        >
          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl">
            {/* Departure dropdown */}
            {activeField === 'departure' && (
              <div
                key="departure-panel"
                className={slideDirection === 'right' ? 'animate-slide-right' : 'animate-slide-left'}
              >
                <div className="p-5">
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-500">
                    Pays de départ
                  </h3>
                  <div className="space-y-1">
                    {departureOptions.map((opt) => (
                      <button
                        key={opt.name}
                        onClick={() => selectDeparture(opt.name)}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-gray-100 ${
                          departure === opt.name ? 'bg-gray-100' : ''
                        }`}
                      >
                        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-lg">
                          {opt.flag}
                        </span>
                        <p className="text-sm font-medium text-[#222]">{opt.name}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Destination dropdown */}
            {activeField === 'destination' && (
              <div
                key="destination-panel"
                className={slideDirection === 'right' ? 'animate-slide-right' : 'animate-slide-left'}
              >
                <div className="p-5">
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-500">
                    Choisissez votre destination
                  </h3>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {filteredDestinations.map((d) => (
                      <button
                        key={d.name}
                        onClick={() => selectDestination(d.name)}
                        className={`flex items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-gray-100 ${
                          destination === d.name ? 'bg-gray-100' : ''
                        }`}
                      >
                        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-lg">
                          {d.flag}
                        </span>
                        <p className="text-sm font-medium text-[#222]">{d.name}</p>
                      </button>
                    ))}
                  </div>
                  {filteredDestinations.length === 0 && (
                    <p className="py-4 text-center text-sm text-gray-400">Aucun pays trouvé</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
