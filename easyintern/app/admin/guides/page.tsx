'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { guideThemes } from '@/data/guides';
import { SUPPORTED_COUNTRIES } from '@/data/countries';
import { ALL_COUNTRIES } from '@/data/allCountries';
import {
    fetchGuidesByCountry,
    fetchGuideCountries,
    upsertGuideCard,
    deleteGuideCard,
} from '@/lib/guides';
import type { GuideCard, GuideThemeId, GuideResource } from '@/types';

type EditingGuide = GuideCard & { country: string };

const themeOptions = guideThemes.map((t) => ({ value: t.id, label: `${t.icon} ${t.label}` }));
const resourceTypeOptions: { value: GuideResource['type']; label: string }[] = [
    { value: 'officiel', label: 'Officiel' },
    { value: 'site', label: 'Site' },
    { value: 'app', label: 'Application' },
    { value: 'article', label: 'Article' },
];

const inputClass =
    'w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-[#222] placeholder-gray-400 outline-none transition-all focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20';

export default function AdminGuidesPage() {
    const [countries, setCountries] = useState<string[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<string>('');
    const [guides, setGuides] = useState<GuideCard[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editGuide, setEditGuide] = useState<EditingGuide | null>(null);
    const [editForm, setEditForm] = useState<GuideCard>({
        id: '',
        themeId: 'visa-admin',
        title: '',
        description: '',
        icon: '',
        tips: [],
        resources: [],
    });
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 3000);
    };

    // Load countries list
    const [countriesWithGuidesSet, setCountriesWithGuidesSet] = useState<Set<string>>(new Set());
    useEffect(() => {
        (async () => {
            try {
                const dbCountries = await fetchGuideCountries();
                setCountriesWithGuidesSet(new Set(dbCountries));
                // All world countries, with ones that have guides first
                const withGuides = [...new Set([...Object.keys(SUPPORTED_COUNTRIES), ...dbCountries])].sort(
                    (a, b) => a.localeCompare(b, 'fr')
                );
                const otherCountries = Object.keys(ALL_COUNTRIES)
                    .filter((c) => !withGuides.includes(c))
                    .sort((a, b) => a.localeCompare(b, 'fr'));
                const allCountriesList = [...withGuides, ...otherCountries];
                setCountries(allCountriesList);
                if (allCountriesList.length > 0 && !selectedCountry) {
                    setSelectedCountry(allCountriesList[0]);
                }
            } catch {
                showMessage('error', 'Erreur lors du chargement des pays');
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Load guides for selected country
    const loadGuides = useCallback(async () => {
        if (!selectedCountry) return;
        setLoading(true);
        try {
            const data = await fetchGuidesByCountry(selectedCountry);
            setGuides(data);
        } catch {
            showMessage('error', 'Erreur lors du chargement des guides');
        } finally {
            setLoading(false);
        }
    }, [selectedCountry]);

    useEffect(() => {
        loadGuides();
    }, [loadGuides]);

    const filteredGuides = useMemo(() => {
        if (!search.trim()) return guides;
        const q = search.toLowerCase();
        return guides.filter(
            (c) =>
                c.title.toLowerCase().includes(q) ||
                c.description.toLowerCase().includes(q) ||
                c.themeId.toLowerCase().includes(q)
        );
    }, [guides, search]);

    const openEdit = (card: GuideCard) => {
        setEditGuide({ ...card, country: selectedCountry });
        setEditForm({
            ...card,
            tips: [...card.tips],
            resources: card.resources.map((r) => ({ ...r })),
        });
    };

    const openNew = () => {
        const newCard: GuideCard = {
            id: `${selectedCountry.toLowerCase().replace(/[\s']/g, '-')}-${Date.now()}`,
            themeId: 'visa-admin',
            title: '',
            description: '',
            icon: '📋',
            tips: [''],
            resources: [],
        };
        setEditGuide({ ...newCard, country: selectedCountry });
        setEditForm(newCard);
    };

    const handleSave = async () => {
        if (!editGuide) return;
        if (!editForm.title.trim() || !editForm.description.trim()) {
            showMessage('error', 'Titre et description requis');
            return;
        }
        setSaving(true);
        try {
            await upsertGuideCard(
                { ...editForm, country: editGuide.country },
                editForm.resources
            );
            showMessage('success', 'Guide sauvegardé ✓');
            // If saved to a different country, switch to it
            if (editGuide.country !== selectedCountry) {
                setSelectedCountry(editGuide.country);
                // Refresh the countries with guides set
                const freshCountries = await fetchGuideCountries();
                setCountriesWithGuidesSet(new Set(freshCountries));
            }
            setEditGuide(null);
            await loadGuides();
        } catch (err) {
            showMessage('error', `Erreur : ${(err as Error).message}`);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteGuideCard(id);
            showMessage('success', 'Guide supprimé ✓');
            setConfirmDelete(null);
            await loadGuides();
        } catch (err) {
            showMessage('error', `Erreur : ${(err as Error).message}`);
        }
    };

    // Tip helpers
    const addTip = () => setEditForm((f) => ({ ...f, tips: [...f.tips, ''] }));
    const updateTip = (idx: number, val: string) =>
        setEditForm((f) => ({ ...f, tips: f.tips.map((t, i) => (i === idx ? val : t)) }));
    const removeTip = (idx: number) =>
        setEditForm((f) => ({ ...f, tips: f.tips.filter((_, i) => i !== idx) }));

    // Resource helpers
    const addResource = () =>
        setEditForm((f) => ({
            ...f,
            resources: [...f.resources, { title: '', url: '', type: 'site' as const }],
        }));
    const updateResource = (idx: number, field: keyof GuideResource, val: string) =>
        setEditForm((f) => ({
            ...f,
            resources: f.resources.map((r, i) => (i === idx ? { ...r, [field]: val } : r)),
        }));
    const removeResource = (idx: number) =>
        setEditForm((f) => ({ ...f, resources: f.resources.filter((_, i) => i !== idx) }));

    const getThemeLabel = (id: GuideThemeId) => {
        const t = guideThemes.find((th) => th.id === id);
        return t ? `${t.icon} ${t.label}` : id;
    };

    const getFlag = (c: string) => SUPPORTED_COUNTRIES[c] ?? ALL_COUNTRIES[c] ?? '🌍';
    const countryFlag = getFlag(selectedCountry);

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[#1A3B5C]">Guides pays</h1>
                    <p className="mt-1 text-sm text-gray-500">Gérer les guides de chaque pays depuis Supabase</p>
                </div>
                <button
                    onClick={openNew}
                    className="rounded-xl bg-[#FF385C] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#D70466]"
                >
                    + Nouveau guide
                </button>
            </div>

            {message && (
                <div
                    className={`mb-4 rounded-xl px-4 py-3 text-sm font-medium transition-all ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}
                    style={{ animation: 'menuSlideIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
                >
                    {message.text}
                </div>
            )}

            {/* Country selector + Search */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row">
                <select
                    value={selectedCountry}
                    onChange={(e) => {
                        setSelectedCountry(e.target.value);
                        setSearch('');
                    }}
                    className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-[#222] outline-none transition-all focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20 sm:w-72"
                >
                    <optgroup label="📚 Pays avec guides">
                        {countries.filter((c) => countriesWithGuidesSet.has(c)).map((c) => (
                            <option key={c} value={c}>
                                {getFlag(c)} {c}
                            </option>
                        ))}
                    </optgroup>
                    <optgroup label="🌍 Tous les pays">
                        {countries.filter((c) => !countriesWithGuidesSet.has(c)).map((c) => (
                            <option key={c} value={c}>
                                {getFlag(c)} {c}
                            </option>
                        ))}
                    </optgroup>
                </select>
                <input
                    type="text"
                    placeholder="Rechercher un guide..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-sm text-[#222] placeholder-gray-400 outline-none transition-all focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20"
                />
            </div>

            {/* Country stats */}
            <div className="mb-6 flex items-center gap-4">
                <span className="text-2xl">{countryFlag}</span>
                <span className="rounded-full bg-[#1A3B5C]/10 px-3 py-1 text-sm font-medium text-[#1A3B5C]">
                    {filteredGuides.length} guide{filteredGuides.length > 1 ? 's' : ''}
                </span>
                <div className="flex flex-wrap gap-1.5">
                    {Array.from(new Set(filteredGuides.map((g) => g.themeId))).map((themeId) => (
                        <span
                            key={themeId}
                            className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600"
                        >
                            {getThemeLabel(themeId)}
                        </span>
                    ))}
                </div>
            </div>

            {/* Loading */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#FF385C] border-t-transparent" />
                </div>
            ) : (
                /* Guide cards grid */
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredGuides.map((card) => (
                        <div
                            key={card.id}
                            className="group relative rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md"
                        >
                            <div className="mb-3 flex items-start justify-between">
                                <div className="flex items-center gap-2.5">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-xl">
                                        {card.icon}
                                    </span>
                                    <div>
                                        <h3 className="text-sm font-semibold text-[#222] line-clamp-1">{card.title}</h3>
                                        <span className="text-xs text-gray-400">{getThemeLabel(card.themeId)}</span>
                                    </div>
                                </div>
                            </div>
                            <p className="mb-3 text-xs text-gray-500 line-clamp-2">{card.description}</p>
                            <div className="mb-3 space-y-1">
                                {card.tips.slice(0, 2).map((tip, i) => (
                                    <p key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                                        <span className="mt-0.5 text-[#FF385C]">•</span>
                                        <span className="line-clamp-1">{tip}</span>
                                    </p>
                                ))}
                                {card.tips.length > 2 && (
                                    <p className="text-xs text-gray-400">+{card.tips.length - 2} autre(s)</p>
                                )}
                            </div>
                            {card.resources.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                    {card.resources.map((r, i) => (
                                        <span
                                            key={i}
                                            className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600"
                                        >
                                            {r.title}
                                        </span>
                                    ))}
                                </div>
                            )}
                            {/* Actions */}
                            <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-3">
                                <button
                                    onClick={() => openEdit(card)}
                                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-[#1A3B5C] transition-colors hover:bg-blue-50"
                                >
                                    Modifier
                                </button>
                                {confirmDelete === card.id ? (
                                    <>
                                        <button
                                            onClick={() => handleDelete(card.id)}
                                            className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-600"
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
                                        onClick={() => setConfirmDelete(card.id)}
                                        className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-50"
                                    >
                                        Supprimer
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    {filteredGuides.length === 0 && !loading && (
                        <div className="col-span-full rounded-2xl border-2 border-dashed border-gray-200 py-16 text-center">
                            <p className="text-lg text-gray-400">Aucun guide pour ce pays</p>
                            <button
                                onClick={openNew}
                                className="mt-4 rounded-xl bg-[#FF385C] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#D70466]"
                            >
                                Créer le premier guide
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Edit/Create Modal */}
            {editGuide && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                    onClick={() => setEditGuide(null)}
                >
                    <div
                        className="mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                        style={{ animation: 'menuSlideIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
                    >
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-[#1A3B5C]">
                                {guides.find((c) => c.id === editGuide.id)
                                    ? 'Modifier le guide'
                                    : 'Nouveau guide'}
                                <span className="ml-2 text-sm font-normal text-gray-400">
                                    {getFlag(editGuide.country)} {editGuide.country}
                                </span>
                            </h2>
                            <button
                                onClick={() => setEditGuide(null)}
                                className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Country (for new guides) */}
                            {!guides.find((c) => c.id === editGuide.id) && (
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-gray-500">Pays *</label>
                                    <select
                                        value={editGuide.country}
                                        onChange={(e) => {
                                            const newCountry = e.target.value;
                                            setEditGuide((prev) => prev ? { ...prev, country: newCountry } : prev);
                                            setEditForm((f) => ({ ...f, id: `${newCountry.toLowerCase().replace(/[\s']/g, '-')}-${Date.now()}` }));
                                        }}
                                        className={inputClass}
                                    >
                                        <optgroup label="📚 Pays avec guides">
                                            {countries.filter((c) => countriesWithGuidesSet.has(c)).map((c) => (
                                                <option key={c} value={c}>
                                                    {getFlag(c)} {c}
                                                </option>
                                            ))}
                                        </optgroup>
                                        <optgroup label="🌍 Autres pays">
                                            {countries.filter((c) => !countriesWithGuidesSet.has(c)).map((c) => (
                                                <option key={c} value={c}>
                                                    {getFlag(c)} {c}
                                                </option>
                                            ))}
                                        </optgroup>
                                    </select>
                                </div>
                            )}

                            {/* Title & Icon */}
                            <div className="grid grid-cols-[1fr_80px] gap-3">
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-gray-500">Titre *</label>
                                    <input
                                        type="text"
                                        value={editForm.title}
                                        onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                                        placeholder="Visa étudiant, Se loger..."
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-gray-500">Icône</label>
                                    <input
                                        type="text"
                                        value={editForm.icon}
                                        onChange={(e) => setEditForm((f) => ({ ...f, icon: e.target.value }))}
                                        placeholder="📋"
                                        className={inputClass + ' text-center text-xl'}
                                    />
                                </div>
                            </div>

                            {/* Theme */}
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-500">Thème *</label>
                                <select
                                    value={editForm.themeId}
                                    onChange={(e) =>
                                        setEditForm((f) => ({ ...f, themeId: e.target.value as GuideThemeId }))
                                    }
                                    className={inputClass}
                                >
                                    {themeOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-500">Description *</label>
                                <textarea
                                    rows={2}
                                    value={editForm.description}
                                    onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                                    placeholder="Courte description du guide..."
                                    className={inputClass + ' resize-none'}
                                />
                            </div>

                            {/* Tips */}
                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <label className="text-xs font-medium text-gray-500">
                                        Conseils ({editForm.tips.length})
                                    </label>
                                    <button
                                        type="button"
                                        onClick={addTip}
                                        className="rounded-lg px-2.5 py-1 text-xs font-medium text-[#FF385C] transition-colors hover:bg-red-50"
                                    >
                                        + Ajouter
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {editForm.tips.map((tip, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <span className="text-xs font-medium text-gray-400">{i + 1}.</span>
                                            <input
                                                type="text"
                                                value={tip}
                                                onChange={(e) => updateTip(i, e.target.value)}
                                                placeholder="Un conseil pratique..."
                                                className={inputClass + ' flex-1'}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeTip(i)}
                                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                                            >
                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Resources */}
                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <label className="text-xs font-medium text-gray-500">
                                        Ressources ({editForm.resources.length})
                                    </label>
                                    <button
                                        type="button"
                                        onClick={addResource}
                                        className="rounded-lg px-2.5 py-1 text-xs font-medium text-[#FF385C] transition-colors hover:bg-red-50"
                                    >
                                        + Ajouter
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {editForm.resources.map((res, i) => (
                                        <div key={i} className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                                            <div className="mb-2 flex items-center justify-between">
                                                <span className="text-xs font-medium text-gray-400">Ressource {i + 1}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeResource(i)}
                                                    className="text-xs text-red-400 transition-colors hover:text-red-600"
                                                >
                                                    Supprimer
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-[1fr_100px] gap-2">
                                                <input
                                                    type="text"
                                                    value={res.title}
                                                    onChange={(e) => updateResource(i, 'title', e.target.value)}
                                                    placeholder="Nom du site"
                                                    className={inputClass}
                                                />
                                                <select
                                                    value={res.type}
                                                    onChange={(e) => updateResource(i, 'type', e.target.value)}
                                                    className={inputClass}
                                                >
                                                    {resourceTypeOptions.map((opt) => (
                                                        <option key={opt.value} value={opt.value}>
                                                            {opt.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <input
                                                type="url"
                                                value={res.url}
                                                onChange={(e) => updateResource(i, 'url', e.target.value)}
                                                placeholder="https://..."
                                                className={inputClass + ' mt-2'}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
                                <button
                                    onClick={() => setEditGuide(null)}
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
