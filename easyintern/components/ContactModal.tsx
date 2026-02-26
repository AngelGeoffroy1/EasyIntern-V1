'use client';

import { useEffect, useState, useCallback } from 'react';
import { Parrain } from '@/types';

type ContactModalProps = {
  parrain: Parrain;
  onClose: () => void;
};

function ContactRow({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-gray-200 hover:shadow-md active:scale-[0.98]"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-xl">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
        <p className="truncate text-sm font-semibold text-[#222]">{value}</p>
      </div>
      <svg className="h-5 w-5 shrink-0 text-gray-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </a>
  );
}

export default function ContactModal({ parrain, onClose }: ContactModalProps) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(onClose, 250);
  }, [onClose]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleClose]);

  const hasAnyContact = parrain.email || parrain.phone || parrain.instagram || parrain.linkedin;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        onClick={handleClose}
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm ${isClosing ? 'modal-overlay-exit' : 'modal-overlay-enter'}`}
      />

      {/* Panel */}
      <div
        className={`relative z-10 w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl ${isClosing ? 'modal-panel-exit' : 'modal-panel-enter'}`}
      >
        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-md transition-transform hover:scale-110"
        >
          <svg className="h-4 w-4 text-[#222]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 border-b border-gray-100 p-6">
          <img
            src={parrain.profileImage}
            alt={parrain.firstName}
            className="h-14 w-14 rounded-full object-cover shadow-sm"
          />
          <div>
            <h3 className="text-lg font-bold text-[#222]">
              Contacter {parrain.firstName} {parrain.lastNameInitial}.
            </h3>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <span>{parrain.countryFlag}</span> {parrain.city}, {parrain.country}
            </p>
          </div>
        </div>

        {/* Contact list */}
        <div className="flex flex-col gap-3 p-6">
          {hasAnyContact ? (
            <>
              {parrain.email && (
                <ContactRow
                  icon={<svg className="h-6 w-6 text-[#FF385C]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>}
                  label="Email"
                  value={parrain.email}
                  href={`mailto:${parrain.email}`}
                />
              )}
              {parrain.phone && (
                <ContactRow
                  icon={<svg className="h-6 w-6 text-green-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>}
                  label="Téléphone"
                  value={parrain.phone}
                  href={`tel:${parrain.phone.replace(/\s/g, '')}`}
                />
              )}
              {parrain.instagram && (
                <ContactRow
                  icon={<svg className="h-6 w-6 text-pink-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>}
                  label="Instagram"
                  value={parrain.instagram}
                  href={`https://instagram.com/${parrain.instagram.replace('@', '')}`}
                />
              )}
              {parrain.linkedin && (
                <ContactRow
                  icon={<svg className="h-6 w-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>}
                  label="LinkedIn"
                  value={parrain.linkedin}
                  href={`https://linkedin.com/in/${parrain.linkedin}`}
                />
              )}
            </>
          ) : (
            <div className="py-8 text-center">
              <span className="mb-3 block text-4xl">📭</span>
              <p className="text-sm text-gray-500">Aucune information de contact disponible pour le moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
