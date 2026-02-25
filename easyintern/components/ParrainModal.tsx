'use client';

import { useEffect, useState, useCallback } from 'react';
import { Parrain } from '@/types';
import InfosPratiques from '@/components/InfosPratiques';

const badgeConfig = {
  gold: { label: 'Gold', color: 'bg-yellow-100 text-yellow-800', icon: '🥇' },
  silver: { label: 'Silver', color: 'bg-gray-100 text-gray-700', icon: '🥈' },
  bronze: { label: 'Bronze', color: 'bg-orange-100 text-orange-800', icon: '🥉' },
};

const expertiseLabels: Record<string, string> = {
  logement: 'Logement',
  admin: 'Administratif',
  'vie-quotidienne': 'Vie quotidienne',
  stage: 'Stage',
  universite: 'Université',
  langue: 'Langue',
  social: 'Social',
};

const mobilityLabels: Record<string, string> = {
  stage: 'Stage',
  exchange: 'Échange universitaire',
  both: 'Stage & Échange',
};

type ParrainModalProps = {
  parrain: Parrain;
  onClose: () => void;
};

export default function ParrainModal({ parrain, onClose }: ParrainModalProps) {
  const [isClosing, setIsClosing] = useState(false);
  const badge = parrain.badge ? badgeConfig[parrain.badge] : null;

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(onClose, 250);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [handleClose]);

  const mapsQuery = encodeURIComponent(`${parrain.city}, ${parrain.country}`);
  const mapsUrl = `https://maps.google.com/maps?q=${mapsQuery}&t=&z=12&ie=UTF8&iwloc=B&output=embed`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Overlay */}
      <div
        onClick={handleClose}
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm ${isClosing ? 'modal-overlay-exit' : 'modal-overlay-enter'
          }`}
      />

      {/* Modal panel */}
      <div
        className={`relative z-10 flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl ${isClosing ? 'modal-panel-exit' : 'modal-panel-enter'
          }`}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-md transition-transform hover:scale-110"
        >
          <svg className="h-4 w-4 text-[#222]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Scrollable content */}
        <div className="overflow-y-auto">
          {/* Main Layout: Profile + Map */}
          <div className="flex flex-col">

            {/* Top Section: Profile Info */}
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 p-6 sm:p-8">

              {/* Sidebar (Mobile: Top, Desktop: Left) */}
              <div className="flex flex-col items-center sm:items-start shrink-0 sm:w-[220px]">
                {/* Photo */}
                <div className="relative aspect-square w-32 sm:w-full overflow-hidden rounded-2xl shadow-sm border border-gray-100">
                  <img
                    src={parrain.profileImage}
                    alt={`${parrain.firstName} ${parrain.lastNameInitial}.`}
                    className="h-full w-full object-cover"
                  />
                  {badge && (
                    <div
                      className={`absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-wide shadow-md whitespace-nowrap ${badge.color}`}
                    >
                      <span>{badge.icon}</span>
                      <span>{badge.label}</span>
                    </div>
                  )}
                </div>

                {/* Rating (Desktop: under photo, Mobile: inline with name below) */}
                <div className="hidden sm:flex mt-4 w-full items-center gap-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  {/* Left Column: Note */}
                  <div className="flex flex-col items-center shrink-0">
                    <div className="flex items-center gap-1">
                      <svg className="h-4 w-4 text-[#FF385C]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <span className="text-2xl font-black text-[#222]">{parrain.rating}</span>
                    </div>
                  </div>

                  {/* Vertical Divider */}
                  <div className="h-8 w-px bg-gray-100" />

                  {/* Right Column: Status & Reviews */}
                  <div className="flex flex-col">
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#FF385C]">
                      {parrain.rating >= 4.8 ? 'Excellent' : parrain.rating >= 4.5 ? 'Très bien' : 'Bien noté'}
                    </span>
                    <span className="text-[11px] font-semibold text-gray-400 mt-0.5 whitespace-nowrap">
                      {parrain.reviewCount} avis vérifiés
                    </span>
                  </div>
                </div>

                {/* Key info (Single card, Desktop only) */}
                <div className="hidden sm:flex mt-4 w-full flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-xl shrink-0">🎓</span>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">École</span>
                      <span className="text-sm font-semibold text-[#222] truncate w-full">{parrain.school}</span>
                    </div>
                  </div>
                  <div className="h-px bg-gray-100" />
                  <div className="flex items-center gap-3">
                    <span className="text-xl shrink-0">📅</span>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Sur place</span>
                      <span className="text-sm font-semibold text-[#222]">
                        {parrain.yearsOnSite} an{parrain.yearsOnSite > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  <div className="h-px bg-gray-100" />
                  <div className="flex items-center gap-3">
                    <span className="text-xl shrink-0">✈️</span>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Mobilité</span>
                      <span className="text-sm font-semibold text-[#222] truncate w-full">
                        {mobilityLabels[parrain.mobilityType]}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Trust (Desktop only — left sidebar) */}
                <div className="hidden sm:flex mt-4 w-full flex-col gap-3 rounded-xl bg-gray-50/50 p-4 border border-gray-100">
                  <h4 className="text-sm font-semibold text-[#222]">Pourquoi contacter {parrain.firstName} ?</h4>
                  <ul className="flex flex-col gap-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <svg className="h-5 w-5 shrink-0 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Conseils personnalisés pour la recherche de logement et les démarches administratives locales.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="h-5 w-5 shrink-0 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Aide à l'intégration et bons plans sur le campus et dans la ville.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Main Content (Name, Details, Bio) */}
              <div className="flex-1 flex flex-col min-w-0">
                {/* Header (Name & Location) */}
                <div className="flex justify-between items-end sm:items-start">
                  <div className="text-left w-full sm:w-auto">
                    <h2 className="text-3xl font-bold text-[#222]">
                      {parrain.firstName} {parrain.lastNameInitial}.
                    </h2>
                    <p className="mt-1 text-base text-gray-500 flex items-center gap-1.5">
                      <span className="text-lg">{parrain.countryFlag}</span>
                      {parrain.city}, {parrain.country}
                    </p>
                  </div>

                  {/* Rating (Mobile only) */}
                  <div className="sm:hidden flex shrink-0 flex-col items-center bg-white rounded-xl px-4 py-2 border border-gray-100 shadow-sm ml-4">
                    <div className="flex items-center gap-1">
                      <svg className="h-4 w-4 text-[#FF385C]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <span className="text-xl font-black text-[#222]">{parrain.rating}</span>
                    </div>
                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">{parrain.reviewCount} avis</span>
                  </div>
                </div>

                {/* Key info (Single card, Mobile only) */}
                <div className="flex sm:hidden mt-6 w-full flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-xl shrink-0">🎓</span>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">École</span>
                      <span className="text-sm font-semibold text-[#222] truncate w-full">{parrain.school}</span>
                    </div>
                  </div>
                  <div className="h-px bg-gray-100" />
                  <div className="flex items-center gap-3">
                    <span className="text-xl shrink-0">📅</span>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Sur place</span>
                      <span className="text-sm font-semibold text-[#222]">
                        {parrain.yearsOnSite} an{parrain.yearsOnSite > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  <div className="h-px bg-gray-100" />
                  <div className="flex items-center gap-3">
                    <span className="text-xl shrink-0">✈️</span>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Mobilité</span>
                      <span className="text-sm font-semibold text-[#222] truncate w-full">
                        {mobilityLabels[parrain.mobilityType]}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bio & Expertise */}
                <div className="mt-8">
                  <h3 className="mb-3 text-xl font-semibold text-[#222]">
                    À propos de {parrain.firstName}
                  </h3>
                  <p className="leading-relaxed text-gray-600 sm:text-lg">{parrain.bio}</p>

                  {/* Expertise tags */}
                  <div className="mt-5 flex flex-wrap gap-2">
                    {parrain.expertise.map((exp) => (
                      <span
                        key={exp}
                        className="rounded-lg bg-gray-50 border border-gray-200 px-3.5 py-1.5 text-sm font-medium text-gray-700"
                      >
                        {expertiseLabels[exp] || exp}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Infos pratiques du pays */}
                <InfosPratiques country={parrain.country} countryFlag={parrain.countryFlag} />

                {/* Trust (Mobile only) */}
                <div className="mt-8 pt-6 border-t border-gray-100 sm:hidden">
                  <div className="flex flex-col gap-3 rounded-xl bg-gray-50/50 p-4 border border-gray-100">
                    <h4 className="text-sm font-semibold text-[#222]">Pourquoi contacter {parrain.firstName} ?</h4>
                    <ul className="flex flex-col gap-2 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <svg className="h-5 w-5 shrink-0 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Conseils personnalisés pour la recherche de logement et les démarches administratives locales.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="h-5 w-5 shrink-0 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Aide à l'intégration et bons plans sur le campus et dans la ville.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="mt-8 sm:mt-auto">
                  <button className="w-full rounded-xl bg-[#FF385C] px-8 py-4 text-base font-semibold text-white shadow-sm transition-all hover:bg-[#D70466] hover:shadow active:scale-[0.98]">
                    Contacter {parrain.firstName}
                  </button>
                </div>
              </div>
            </div>

            {/* FULL-WIDTH BOTTOM — Google Maps */}
            <div className="border-t border-gray-100 bg-gray-50/50 p-6 sm:p-8">
              <h3 className="mb-4 text-lg font-semibold text-[#222]">
                Où se trouve {parrain.firstName}
              </h3>
              <div className="overflow-hidden rounded-2xl shadow-sm border border-gray-200/60">
                <iframe
                  src={mapsUrl}
                  width="100%"
                  height="320"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Carte de ${parrain.city}`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
