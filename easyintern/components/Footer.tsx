'use client';

import Link from 'next/link';
import { useParrainProfile } from '@/hooks/useParrainProfile';

export default function Footer() {
  const { isParrain } = useParrainProfile();

  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} EasyIntern. Tous droits r&eacute;serv&eacute;s.
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="transition-colors hover:text-[#1A3B5C]">
              &Agrave; propos
            </a>
            <Link href="/guides" className="transition-colors hover:text-[#1A3B5C]">
              Guides pratiques
            </Link>
            <a href="#" className="transition-colors hover:text-[#1A3B5C]">
              Contact
            </a>
            {!isParrain && (
              <Link href="/devenir-parrain" className="transition-colors hover:text-[#1A3B5C]">
                Devenir parrain
              </Link>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
