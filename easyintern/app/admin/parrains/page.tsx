'use client';

import { useState, useEffect, useMemo } from 'react';
import { fetchAllParrains, updateParrainAdmin, deleteParrain } from '@/lib/admin';
import type { ParrainUpdates } from '@/lib/admin';
import type { AdminParrain, Badge, MobilityType, ExpertiseCategory } from '@/types';
import { SUPPORTED_COUNTRIES } from '@/data/countries';

const badgeOptions: { value: Badge | ''; label: string }[] = [
  { value: '', label: 'Aucun' },
  { value: 'gold', label: 'Gold' },
  { value: 'silver', label: 'Silver' },
  { value: 'bronze', label: 'Bronze' },
];

const mobilityOptions: { value: MobilityType; label: string }[] = [
  { value: 'exchange', label: 'Échange universitaire' },
  { value: 'stage', label: 'Stage' },
  { value: 'both', label: 'Les deux' },
];

const expertiseOptions: { value: ExpertiseCategory; label: string }[] = [
  { value: 'logement', label: 'Logement' },
  { value: 'admin', label: 'Administratif' },
  { value: 'vie-quotidienne', label: 'Vie quotidienne' },
  { value: 'stage', label: 'Stage' },
  { value: 'universite', label: 'Université' },
  { value: 'langue', label: 'Langue' },
  { value: 'social', label: 'Social' },
];

const inputClass = 'w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-[#222] placeholder-gray-400 outline-none transition-all focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20';

export default function AdminParrainsPage() {
  const [parrains, setParrains] = useState<AdminParrain[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [editParrain, setEditParrain] = useState<AdminParrain | null>(null);
  const [editForm, setEditForm] = useState<ParrainUpdates>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadParrains = async () => {
    setLoading(true);
    const data = await fetchAllParrains();
    setParrains(data);
    setLoading(false);
  };

  useEffect(() => {
    loadParrains();
  }, []);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const openEdit = (p: AdminParrain) => {
    setEditParrain(p);
    setEditForm({
      first_name: p.first_name,
      last_name: p.last_name,
      city: p.city,
      country: p.country,
      country_flag: p.country_flag,
      school: p.school,
      bio: p.bio,
      mobility_type: p.mobility_type,
      badge: p.badge,
      email: p.email,
      phone: p.phone,
      instagram: p.instagram,
      linkedin: p.linkedin,
      expertise: [...p.expertise],
      rating: p.rating,
      review_count: p.review_count,
      years_on_site: p.years_on_site,
    });
  };

  const handleSave = async () => {
    if (!editParrain) return;
    setSaving(true);
    const { error } = await updateParrainAdmin(editParrain.id, editForm);
    if (error) {
      showMessage('error', 'Erreur lors de la sauvegarde');
    } else {
      setParrains((prev) =>
        prev.map((p) => (p.id === editParrain.id ? { ...p, ...editForm } : p))
      );
      showMessage('success', 'Parrain mis à jour');
      setEditParrain(null);
    }
    setSaving(false);
  };

  const handleBadgeChange = async (parrainId: string, badge: Badge | null) => {
    setActionLoading(parrainId);
    const { error } = await updateParrainAdmin(parrainId, { badge });
    if (error) {
      showMessage('error', 'Erreur lors de la mise à jour du badge');
    } else {
      setParrains((prev) =>
        prev.map((p) => (p.id === parrainId ? { ...p, badge } : p))
      );
      showMessage('success', 'Badge mis à jour');
    }
    setActionLoading(null);
  };

  const handleDelete = async (parrainId: string) => {
    setActionLoading(parrainId);
    const { error } = await deleteParrain(parrainId);
    if (error) {
      showMessage('error', 'Erreur lors de la suppression');
    } else {
      setParrains((prev) => prev.filter((p) => p.id !== parrainId));
      showMessage('success', 'Parrain supprimé');
    }
    setConfirmDelete(null);
    setActionLoading(null);
  };

  const handleCountryChange = (country: string) => {
    setEditForm((prev) => ({
      ...prev,
      country,
      country_flag: SUPPORTED_COUNTRIES[country] ?? prev.country_flag,
    }));
  };

  const toggleExpertise = (exp: ExpertiseCategory) => {
    setEditForm((prev) => {
      const current = prev.expertise ?? [];
      const next = current.includes(exp)
        ? current.filter((e) => e !== exp)
        : [...current, exp];
      return { ...prev, expertise: next };
    });
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return parrains;
    const q = search.toLowerCase();
    return parrains.filter(
      (p) =>
        p.first_name.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.country.toLowerCase().includes(q) ||
        p.school.toLowerCase().includes(q)
    );
  }, [parrains, search]);

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
        <h1 className="text-2xl font-bold text-[#1A3B5C]">Parrains</h1>
        <span className="text-sm text-gray-500">{parrains.length} parrain(s)</span>
      </div>

      {message && (
        <div className={`mb-4 rounded-xl px-4 py-3 text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
          {message.text}
        </div>
      )}

      <div className="mb-6">
        <input
          type="text"
          placeholder="Rechercher par nom, ville, pays, école..."
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
              <th className="px-6 py-4">Destination</th>
              <th className="hidden px-6 py-4 md:table-cell">École</th>
              <th className="px-6 py-4">Badge</th>
              <th className="hidden px-6 py-4 lg:table-cell">Expertise</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((p) => (
              <tr key={p.id} className="transition-colors hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#1A3B5C] text-xs font-bold text-white">
                      {p.profile_image ? (
                        <img src={p.profile_image} alt="" className="h-full w-full object-cover" />
                      ) : (
                        p.first_name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-[#222]">
                        {p.first_name} {p.last_name}
                      </p>
                      {p.email && <p className="text-xs text-gray-400">{p.email}</p>}
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                  {p.country_flag} {p.city}, {p.country}
                </td>
                <td className="hidden whitespace-nowrap px-6 py-4 text-gray-600 md:table-cell">
                  {p.school}
                </td>
                <td className="px-6 py-4">
                  <select
                    value={p.badge ?? ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      handleBadgeChange(p.id, val === '' ? null : (val as Badge));
                    }}
                    disabled={actionLoading === p.id}
                    className={`rounded-lg border px-2 py-1 text-xs font-medium outline-none ${p.badge === 'gold' ? 'border-yellow-200 bg-yellow-50 text-yellow-700' :
                        p.badge === 'silver' ? 'border-gray-300 bg-gray-100 text-gray-700' :
                          p.badge === 'bronze' ? 'border-orange-200 bg-orange-50 text-orange-700' :
                            'border-gray-200 bg-gray-50 text-gray-500'
                      }`}
                  >
                    {badgeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="hidden px-6 py-4 lg:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {p.expertise.slice(0, 3).map((e) => (
                      <span key={e} className="rounded-full bg-[#FF385C]/10 px-2 py-0.5 text-xs text-[#FF385C]">
                        {e}
                      </span>
                    ))}
                    {p.expertise.length > 3 && (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                        +{p.expertise.length - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEdit(p)}
                      className="rounded-lg px-3 py-1.5 text-xs font-medium text-[#1A3B5C] transition-colors hover:bg-blue-50"
                    >
                      Modifier
                    </button>
                    {confirmDelete === p.id ? (
                      <>
                        <button
                          onClick={() => handleDelete(p.id)}
                          disabled={actionLoading === p.id}
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
                      </>
                    ) : (
                      <button
                        onClick={() => setConfirmDelete(p.id)}
                        className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-50"
                      >
                        Supprimer
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                  Aucun parrain trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editParrain && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setEditParrain(null)}
        >
          <div
            className="mx-4 max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#1A3B5C]">Modifier le parrain</h2>
              <button
                onClick={() => setEditParrain(null)}
                className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Identité */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500">Prénom</label>
                  <input
                    type="text"
                    value={editForm.first_name ?? ''}
                    onChange={(e) => setEditForm((f) => ({ ...f, first_name: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500">Nom de famille</label>
                  <input
                    type="text"
                    value={editForm.last_name ?? ''}
                    onChange={(e) => setEditForm((f) => ({ ...f, last_name: e.target.value }))}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Destination */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500">Ville</label>
                  <input
                    type="text"
                    value={editForm.city ?? ''}
                    onChange={(e) => setEditForm((f) => ({ ...f, city: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500">Pays</label>
                  <select
                    value={editForm.country ?? ''}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className={inputClass}
                  >
                    {Object.entries(SUPPORTED_COUNTRIES).map(([name, flag]) => (
                      <option key={name} value={name}>
                        {flag} {name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* École & Mobilité */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500">École</label>
                  <input
                    type="text"
                    value={editForm.school ?? ''}
                    onChange={(e) => setEditForm((f) => ({ ...f, school: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500">Type de mobilité</label>
                  <select
                    value={editForm.mobility_type ?? 'exchange'}
                    onChange={(e) => setEditForm((f) => ({ ...f, mobility_type: e.target.value as MobilityType }))}
                    className={inputClass}
                  >
                    {mobilityOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Badge & Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500">Badge</label>
                  <select
                    value={editForm.badge ?? ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEditForm((f) => ({ ...f, badge: val === '' ? null : (val as Badge) }));
                    }}
                    className={inputClass}
                  >
                    {badgeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500">Note (/5)</label>
                  <input
                    type="number"
                    min={0}
                    max={5}
                    step={0.1}
                    value={editForm.rating ?? 0}
                    onChange={(e) => setEditForm((f) => ({ ...f, rating: parseFloat(e.target.value) || 0 }))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500">Nb avis</label>
                  <input
                    type="number"
                    min={0}
                    value={editForm.review_count ?? 0}
                    onChange={(e) => setEditForm((f) => ({ ...f, review_count: parseInt(e.target.value) || 0 }))}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">Bio</label>
                <textarea
                  rows={3}
                  value={editForm.bio ?? ''}
                  onChange={(e) => setEditForm((f) => ({ ...f, bio: e.target.value }))}
                  className={inputClass + ' resize-none'}
                />
              </div>

              {/* Expertise */}
              <div>
                <label className="mb-2 block text-xs font-medium text-gray-500">Expertise</label>
                <div className="flex flex-wrap gap-2">
                  {expertiseOptions.map((opt) => {
                    const active = editForm.expertise?.includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => toggleExpertise(opt.value)}
                        className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${active
                            ? 'bg-[#FF385C] text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Contact */}
              <div>
                <label className="mb-2 block text-xs font-medium text-gray-500">Contact</label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="email"
                    placeholder="Email"
                    value={editForm.email ?? ''}
                    onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value || null }))}
                    className={inputClass}
                  />
                  <input
                    type="tel"
                    placeholder="Téléphone"
                    value={editForm.phone ?? ''}
                    onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value || null }))}
                    className={inputClass}
                  />
                  <input
                    type="text"
                    placeholder="Instagram"
                    value={editForm.instagram ?? ''}
                    onChange={(e) => setEditForm((f) => ({ ...f, instagram: e.target.value || null }))}
                    className={inputClass}
                  />
                  <input
                    type="text"
                    placeholder="LinkedIn"
                    value={editForm.linkedin ?? ''}
                    onChange={(e) => setEditForm((f) => ({ ...f, linkedin: e.target.value || null }))}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  onClick={() => setEditParrain(null)}
                  className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-xl bg-[#FF385C] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#D70466] disabled:opacity-50"
                >
                  {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
