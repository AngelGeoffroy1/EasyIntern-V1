'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/hooks/useAdmin';

const adminNav = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/users', label: 'Utilisateurs', icon: '👤' },
  { href: '/admin/parrains', label: 'Parrains', icon: '🤝' },
  { href: '/admin/guides', label: 'Guides', icon: '📚' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (authLoading || adminLoading) return;
    if (!user) {
      router.push('/auth');
    } else if (!isAdmin) {
      router.push('/');
    }
  }, [user, isAdmin, authLoading, adminLoading, router]);

  if (authLoading || adminLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#FF385C] border-t-transparent" />
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`sticky top-0 flex h-screen flex-col border-r border-gray-200 bg-white transition-all duration-200 ${collapsed ? 'w-[68px]' : 'w-64'
          }`}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-3">
          {!collapsed && (
            <div className="flex items-center gap-2 px-2">
              <Link href="/" className="text-lg font-bold text-[#1A3B5C]">
                EasyIntern
              </Link>
              <span className="rounded-md bg-[#FF385C] px-2 py-0.5 text-xs font-semibold text-white">
                Admin
              </span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 ${collapsed ? 'mx-auto' : ''
              }`}
            title={collapsed ? 'Ouvrir le menu' : 'Replier le menu'}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {collapsed ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7M19 19l-7-7 7-7" />
              )}
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 px-2 py-4">
          {adminNav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${active
                    ? 'bg-[#FF385C]/10 text-[#FF385C]'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-[#222]'
                  } ${collapsed ? 'justify-center' : ''}`}
              >
                <span className="text-base">{item.icon}</span>
                {!collapsed && item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 px-2 py-4">
          <Link
            href="/"
            title={collapsed ? 'Retour au site' : undefined}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-[#222] ${collapsed ? 'justify-center' : ''
              }`}
          >
            <span className="text-base">←</span>
            {!collapsed && 'Retour au site'}
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-8 py-8">{children}</div>
      </main>
    </div>
  );
}
