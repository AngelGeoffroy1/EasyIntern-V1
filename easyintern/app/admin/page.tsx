'use client';

import { useState, useEffect } from 'react';
import { fetchAdminStats, fetchAllProfiles, fetchAllParrains } from '@/lib/admin';
import type { AdminStats, AdminProfile, AdminParrain } from '@/types';

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<AdminProfile[]>([]);
  const [recentParrains, setRecentParrains] = useState<AdminParrain[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [s, users, parrains] = await Promise.all([
        fetchAdminStats(),
        fetchAllProfiles(),
        fetchAllParrains(),
      ]);
      setStats(s);
      setRecentUsers(users.slice(0, 5));
      setRecentParrains(parrains.slice(0, 5));
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#FF385C] border-t-transparent" />
      </div>
    );
  }

  const statCards = [
    { label: 'Utilisateurs', value: stats?.totalUsers ?? 0, color: 'bg-blue-50 text-blue-700' },
    { label: 'Parrains', value: stats?.totalParrains ?? 0, color: 'bg-green-50 text-green-700' },
    { label: 'Admins', value: stats?.totalAdmins ?? 0, color: 'bg-red-50 text-red-700' },
  ];

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-[#1A3B5C]">Dashboard</h1>

      {/* Stats Cards */}
      <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-3">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`rounded-2xl border border-gray-100 p-5 shadow-sm ${card.color}`}
          >
            <p className="text-sm font-medium opacity-80">{card.label}</p>
            <p className="mt-1 text-3xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Users */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-[#1A3B5C]">Derniers inscrits</h2>
          {recentUsers.length === 0 ? (
            <p className="text-sm text-gray-500">Aucun utilisateur</p>
          ) : (
            <div className="space-y-3">
              {recentUsers.map((u) => (
                <div key={u.id} className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-[#222]">
                      {u.first_name} {u.last_name}
                    </p>
                    <p className="text-xs text-gray-500">{u.email}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      u.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {u.role}
                    </span>
                    <p className="mt-0.5 text-xs text-gray-400">
                      {new Date(u.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Parrains */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-[#1A3B5C]">Derniers parrains</h2>
          {recentParrains.length === 0 ? (
            <p className="text-sm text-gray-500">Aucun parrain</p>
          ) : (
            <div className="space-y-3">
              {recentParrains.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-[#222]">
                      {p.first_name} {p.last_name_initial}.
                    </p>
                    <p className="text-xs text-gray-500">
                      {p.country_flag} {p.city}, {p.country}
                    </p>
                  </div>
                  <div className="text-right">
                    {p.badge && (
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                        p.badge === 'gold' ? 'bg-yellow-100 text-yellow-700' :
                        p.badge === 'silver' ? 'bg-gray-200 text-gray-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {p.badge}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
