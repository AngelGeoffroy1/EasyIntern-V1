'use client';

import { useState, useEffect, useMemo } from 'react';
import { fetchAllProfiles, updateUserRole, deleteUser } from '@/lib/admin';
import type { AdminProfile, UserRole } from '@/types';

export default function AdminUsersPage() {
  const [profiles, setProfiles] = useState<AdminProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadProfiles = async () => {
    setLoading(true);
    const data = await fetchAllProfiles();
    setProfiles(data);
    setLoading(false);
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    setActionLoading(userId);
    const { error } = await updateUserRole(userId, newRole);
    if (error) {
      showMessage('error', 'Erreur lors du changement de rôle');
    } else {
      setProfiles((prev) =>
        prev.map((p) => (p.id === userId ? { ...p, role: newRole } : p))
      );
      showMessage('success', 'Rôle mis à jour');
    }
    setActionLoading(null);
  };

  const handleDelete = async (userId: string) => {
    setActionLoading(userId);
    const { error } = await deleteUser(userId);
    if (error) {
      showMessage('error', 'Erreur lors de la suppression');
    } else {
      setProfiles((prev) => prev.filter((p) => p.id !== userId));
      showMessage('success', 'Utilisateur supprimé');
    }
    setConfirmDelete(null);
    setActionLoading(null);
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return profiles;
    const q = search.toLowerCase();
    return profiles.filter(
      (p) =>
        (p.first_name?.toLowerCase().includes(q)) ||
        (p.last_name?.toLowerCase().includes(q)) ||
        p.email.toLowerCase().includes(q) ||
        (p.school?.toLowerCase().includes(q))
    );
  }, [profiles, search]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#FF385C] border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1A3B5C]">Utilisateurs</h1>
        <span className="text-sm text-gray-500">{profiles.length} utilisateur(s)</span>
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-4 rounded-xl px-4 py-3 text-sm font-medium ${
          message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Rechercher par nom, email, école..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-[#222] placeholder-gray-400 outline-none transition-all focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20 sm:max-w-md"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
              <th className="px-6 py-4">Nom</th>
              <th className="px-6 py-4">Email</th>
              <th className="hidden px-6 py-4 md:table-cell">École</th>
              <th className="px-6 py-4">Rôle</th>
              <th className="hidden px-6 py-4 md:table-cell">Inscrit le</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((user) => (
              <tr key={user.id} className="transition-colors hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#1A3B5C] text-xs font-bold text-white">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt="" className="h-full w-full object-cover" />
                      ) : (
                        (user.first_name?.charAt(0) ?? '?').toUpperCase()
                      )}
                    </div>
                    <span className="font-medium text-[#222]">{user.first_name} {user.last_name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">{user.email}</td>
                <td className="hidden px-6 py-4 text-gray-600 md:table-cell">{user.school ?? '—'}</td>
                <td className="px-6 py-4">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                    disabled={actionLoading === user.id}
                    className={`rounded-lg border px-2 py-1 text-xs font-medium outline-none ${
                      user.role === 'admin'
                        ? 'border-red-200 bg-red-50 text-red-700'
                        : 'border-gray-200 bg-gray-50 text-gray-600'
                    }`}
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td className="hidden whitespace-nowrap px-6 py-4 text-gray-500 md:table-cell">
                  {new Date(user.created_at).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-6 py-4 text-right">
                  {confirmDelete === user.id ? (
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleDelete(user.id)}
                        disabled={actionLoading === user.id}
                        className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-50"
                      >
                        Confirmer
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="rounded-lg bg-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-300"
                      >
                        Annuler
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(user.id)}
                      className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-50"
                    >
                      Supprimer
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                  Aucun utilisateur trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
