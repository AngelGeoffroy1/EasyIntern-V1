'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

type AuthModalProps = {
  parrainFirstName: string;
  onClose: () => void;
};

export default function AuthModal({ parrainFirstName, onClose }: AuthModalProps) {
  const [isClosing, setIsClosing] = useState(false);
  const router = useRouter();

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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Overlay */}
      <div
        onClick={handleClose}
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm ${
          isClosing ? 'modal-overlay-exit' : 'modal-overlay-enter'
        }`}
      />

      {/* Modal panel */}
      <div
        className={`relative z-10 flex w-full max-w-sm flex-col items-center overflow-hidden rounded-3xl bg-white p-8 shadow-2xl ${
          isClosing ? 'modal-panel-exit' : 'modal-panel-enter'
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

        {/* Lock icon */}
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <svg className="h-8 w-8 text-[#1A3B5C]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>

        {/* Text */}
        <h3 className="mb-2 text-xl font-bold text-[#222] text-center">
          Connectez-vous pour continuer
        </h3>
        <p className="mb-8 text-center text-sm leading-relaxed text-gray-500">
          Créez un compte ou connectez-vous pour voir le profil complet de{' '}
          <span className="font-semibold text-[#222]">{parrainFirstName}</span> et le contacter.
        </p>

        {/* CTA Buttons */}
        <button
          onClick={() => router.push('/auth')}
          className="mb-3 w-full rounded-xl bg-[#FF385C] px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#D70466] hover:shadow active:scale-[0.98]"
        >
          Se connecter
        </button>
        <button
          onClick={() => router.push('/auth')}
          className="w-full rounded-xl border border-gray-300 px-8 py-3.5 text-sm font-semibold text-[#222] transition-all hover:bg-gray-50 active:scale-[0.98]"
        >
          Créer un compte
        </button>
      </div>
    </div>
  );
}
