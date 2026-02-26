'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/assets/Logo.png';
import { useAuth } from '@/contexts/AuthContext';

type NavbarProps = {
  onCompactSearchClick?: (field?: 'city' | 'school' | 'mobility') => void;
  showCompactSearch?: boolean;
  searchFilters?: { city: string; school: string; mobility: string };
};

const mobilityLabels: Record<string, string> = {
  exchange: 'Échange universitaire',
  stage: 'Stage',
};

export default function Navbar({ onCompactSearchClick, showCompactSearch = false, searchFilters }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const userInitial = user?.user_metadata?.first_name
    ? (user.user_metadata.first_name as string).charAt(0).toUpperCase()
    : null;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on click outside
  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const navLinks = [
    { href: '/', label: 'Parrains' },
    { href: '/guides', label: 'Guides' },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 bg-white transition-shadow duration-200 ${scrolled ? 'shadow-md' : ''
        }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        {/* Logo + Nav Links */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={Logo}
              alt="EasyIntern"
              height={48}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden items-center gap-1 sm:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${pathname === link.href
                    ? 'bg-gray-100 text-[#1A3B5C]'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-[#222]'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Compact Search Bar - appears on scroll */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 transition-all duration-300 ease-in-out ${showCompactSearch
            ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none -translate-y-2 scale-95 opacity-0'
            }`}
        >
          <div className="flex items-center rounded-full border border-gray-300 shadow-sm transition-shadow hover:shadow-md">
            <button
              onClick={() => onCompactSearchClick?.('city')}
              className="cursor-pointer rounded-l-full px-5 py-2 transition-colors hover:bg-gray-50"
            >
              <span className={`text-sm ${searchFilters?.city ? 'font-medium text-[#222]' : 'text-gray-400'}`}>
                {searchFilters?.city || 'Ville'}
              </span>
            </button>
            <span className="h-6 w-px bg-gray-300" />
            <button
              onClick={() => onCompactSearchClick?.('school')}
              className="cursor-pointer px-5 py-2 transition-colors hover:bg-gray-50"
            >
              <span className={`text-sm ${searchFilters?.school ? 'font-medium text-[#222]' : 'text-gray-400'}`}>
                {searchFilters?.school || 'École'}
              </span>
            </button>
            <span className="h-6 w-px bg-gray-300" />
            <button
              onClick={() => onCompactSearchClick?.('mobility')}
              className="cursor-pointer px-5 py-2 transition-colors hover:bg-gray-50"
            >
              <span className={`text-sm ${searchFilters?.mobility ? 'font-medium text-[#222]' : 'text-gray-400'}`}>
                {searchFilters?.mobility ? mobilityLabels[searchFilters.mobility] || 'Mobilité' : 'Mobilité'}
              </span>
            </button>
            <div
              onClick={() => onCompactSearchClick?.('city')}
              className="m-1.5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#FF385C]"
            >
              <svg className="h-3.5 w-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link href="/devenir-parrain" className="hidden rounded-full px-4 py-2 text-sm font-medium text-[#1A3B5C] transition-colors hover:bg-gray-100 sm:block">
            Devenir parrain
          </Link>

          {/* Hamburger menu button */}
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 rounded-full border border-gray-300 px-3 py-2 transition-shadow hover:shadow-md"
            >
              <svg
                className="h-4 w-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1A3B5C] text-xs font-bold text-white">
                {userInitial ? (
                  userInitial
                ) : (
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                )}
              </div>
            </button>

            {/* Dropdown menu */}
            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
                {/* Mobile-only nav links */}
                <div className="sm:hidden">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={`block px-4 py-2.5 text-sm transition-colors ${pathname === link.href
                          ? 'font-semibold text-[#1A3B5C]'
                          : 'text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="my-1 border-t border-gray-100" />
                </div>
                {user ? (
                  <>
                    <Link
                      href="/profil"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm font-semibold text-[#222] transition-colors hover:bg-gray-50"
                    >
                      Mon profil
                    </Link>
                    <Link
                      href="/devenir-parrain"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      Devenir parrain
                    </Link>
                    <Link
                      href="#"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      À propos
                    </Link>
                    <div className="my-1 border-t border-gray-100" />
                    <button
                      onClick={() => {
                        signOut();
                        setMenuOpen(false);
                      }}
                      className="block w-full px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      Se déconnecter
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm font-semibold text-[#222] transition-colors hover:bg-gray-50"
                    >
                      Se connecter
                    </Link>
                    <Link
                      href="/auth"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      Créer un compte
                    </Link>
                    <div className="my-1 border-t border-gray-100" />
                    <Link
                      href="/devenir-parrain"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      Devenir parrain
                    </Link>
                    <Link
                      href="#"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      À propos
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
