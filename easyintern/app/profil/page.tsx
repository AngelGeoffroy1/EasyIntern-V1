'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useParrainProfile, ParrainProfile } from '@/hooks/useParrainProfile';
import { updateParrain } from '@/lib/parrains';
import { ExpertiseCategory, MobilityType } from '@/types';

type Profile = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  school: string;
  avatar_url: string | null;
};

export default function ProfilPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<Profile>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    school: '',
    avatar_url: null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Password change
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Delete account
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Parrain profile
  const { parrainProfile, isParrain, loading: parrainLoading, refetch: refetchParrain } = useParrainProfile();
  const [editingParrain, setEditingParrain] = useState(false);
  const [parrainForm, setParrainForm] = useState<Partial<ParrainProfile>>({});
  const [savingParrain, setSavingParrain] = useState(false);
  const [parrainSuccess, setParrainSuccess] = useState('');
  const [parrainError, setParrainError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data && !error) {
        setProfile({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || user.email || '',
          phone: data.phone || '',
          school: data.school || '',
          avatar_url: data.avatar_url || null,
        });
      } else {
        setProfile({
          first_name: (user.user_metadata?.first_name as string) || '',
          last_name: (user.user_metadata?.last_name as string) || '',
          email: user.email || '',
          phone: (user.user_metadata?.phone as string) || '',
          school: (user.user_metadata?.school as string) || '',
          avatar_url: null,
        });
      }
      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  const showSuccess = (setter: (v: string) => void, message: string) => {
    setter(message);
    setTimeout(() => setter(''), 3000);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSaving(true);

    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone: profile.phone,
        school: profile.school,
      })
      .eq('id', user!.id);

    await supabase.auth.updateUser({
      data: {
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone: profile.phone,
        school: profile.school,
      },
    });

    setSaving(false);

    if (profileError) {
      setErrorMessage(profileError.message);
    } else {
      showSuccess(setSuccessMessage, 'Profil mis à jour avec succès.');
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploadingAvatar(true);
    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      setErrorMessage(uploadError.message);
      setUploadingAvatar(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    const avatarUrl = `${publicUrl}?t=${Date.now()}`;

    await supabase
      .from('profiles')
      .update({ avatar_url: avatarUrl })
      .eq('id', user.id);

    setProfile((prev) => ({ ...prev, avatar_url: avatarUrl }));
    setUploadingAvatar(false);
    showSuccess(setSuccessMessage, 'Photo de profil mise à jour.');
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (newPassword !== confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    setPasswordSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setPasswordSaving(false);

    if (error) {
      setPasswordError(error.message);
    } else {
      setNewPassword('');
      setConfirmPassword('');
      showSuccess(setPasswordSuccess, 'Mot de passe modifié avec succès.');
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    const { error } = await supabase.rpc('delete_own_account');

    if (error) {
      setErrorMessage(error.message);
      setDeleting(false);
      setShowDeleteConfirm(false);
    } else {
      await signOut();
      router.push('/auth');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-sm text-gray-500">Chargement...</div>
      </div>
    );
  }

  if (!user) return null;

  const inputClass =
    'w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-[#222] placeholder-gray-400 outline-none transition-all focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20';

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <h1 className="mb-8 text-3xl font-bold text-[#222]">Mon profil</h1>

          {/* Success / Error messages */}
          {successMessage && (
            <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {errorMessage}
            </div>
          )}

          {/* Two-column layout */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

            {/* Left column: Avatar + Quick info */}
            <div className="flex flex-col gap-6 lg:col-span-1">
              {/* Avatar Card */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    className="group relative mb-4 h-28 w-28 overflow-hidden rounded-full border-2 border-gray-200 transition-all hover:border-[#FF385C]"
                  >
                    {profile.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt="Avatar"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#1A3B5C] text-3xl font-bold text-white">
                        {profile.first_name.charAt(0).toUpperCase()}
                        {profile.last_name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                      {uploadingAvatar ? (
                        <span className="text-xs font-medium text-white">Envoi...</span>
                      ) : (
                        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </div>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                  <h2 className="text-xl font-bold text-[#222]">
                    {profile.first_name} {profile.last_name}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">{profile.email}</p>
                </div>

                {/* Quick info */}
                <div className="mt-6 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">📞</span>
                    <div className="min-w-0">
                      <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">Téléphone</span>
                      <span className="block truncate text-sm font-medium text-[#222]">
                        {profile.phone || '—'}
                      </span>
                    </div>
                  </div>
                  <div className="h-px bg-gray-100" />
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🎓</span>
                    <div className="min-w-0">
                      <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">École</span>
                      <span className="block truncate text-sm font-medium text-[#222]">
                        {profile.school || '—'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column: Forms */}
            <div className="flex flex-col gap-6 lg:col-span-2">
              {/* Personal Info Card */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl sm:p-8">
                <h3 className="mb-6 text-lg font-semibold text-[#222]">Informations personnelles</h3>

                <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">Prénom</label>
                      <input
                        type="text"
                        value={profile.first_name}
                        onChange={(e) => setProfile((p) => ({ ...p, first_name: e.target.value }))}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">Nom</label>
                      <input
                        type="text"
                        value={profile.last_name}
                        onChange={(e) => setProfile((p) => ({ ...p, last_name: e.target.value }))}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        value={profile.email}
                        disabled
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">Téléphone</label>
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                        placeholder="+33 6 12 34 56 78"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">École</label>
                    <input
                      type="text"
                      value={profile.school}
                      onChange={(e) => setProfile((p) => ({ ...p, school: e.target.value }))}
                      placeholder="KEDGE Business School"
                      className={inputClass}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="mt-2 w-full rounded-xl bg-[#FF385C] px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#D70466] hover:shadow active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                  </button>
                </form>
              </div>


            </div>
          </div>

          {/* ========== Parrain Section ========== */}
          {!parrainLoading && (
            <>
              <h2 className="mb-6 mt-10 text-2xl font-bold text-[#222]">
                {isParrain ? '🤝 Mon profil Parrain' : '🤝 Devenir Parrain'}
              </h2>

              {isParrain && parrainProfile ? (
                <>
                  {parrainSuccess && (
                    <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                      {parrainSuccess}
                    </div>
                  )}
                  {parrainError && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                      {parrainError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Left column – Avatar + Quick info */}
                    <div className="flex flex-col gap-6 lg:col-span-1">
                      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
                        <div className="flex flex-col items-center">
                          {/* Avatar */}
                          <div className="relative mb-4 h-28 w-28 overflow-hidden rounded-full border-2 border-gray-200">
                            {parrainProfile.profile_image ? (
                              <img
                                src={parrainProfile.profile_image}
                                alt="Avatar parrain"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#FF385C] to-[#D70466] text-3xl font-bold text-white">
                                {parrainProfile.first_name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <h2 className="text-xl font-bold text-[#222]">
                            {parrainProfile.first_name} {parrainProfile.last_name_initial}.
                          </h2>
                          <p className="mt-1 text-sm text-gray-500">
                            {parrainProfile.country_flag} {parrainProfile.city}, {parrainProfile.country}
                          </p>
                          {parrainProfile.badge && (
                            <span className={`mt-2 rounded-full px-3 py-1 text-xs font-semibold ${parrainProfile.badge === 'gold' ? 'bg-amber-100 text-amber-700' :
                              parrainProfile.badge === 'silver' ? 'bg-gray-100 text-gray-700' :
                                'bg-orange-100 text-orange-700'
                              }`}>
                              {parrainProfile.badge === 'gold' ? '🥇 Gold' : parrainProfile.badge === 'silver' ? '🥈 Silver' : '🥉 Bronze'}
                            </span>
                          )}
                        </div>

                        {/* Quick info */}
                        <div className="mt-6 flex flex-col gap-3">
                          <div className="flex items-center gap-3">
                            <span className="text-lg">🎓</span>
                            <div className="min-w-0">
                              <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">École</span>
                              <span className="block truncate text-sm font-medium text-[#222]">{parrainProfile.school}</span>
                            </div>
                          </div>
                          <div className="h-px bg-gray-100" />
                          <div className="flex items-center gap-3">
                            <span className="text-lg">📅</span>
                            <div className="min-w-0">
                              <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">Années sur place</span>
                              <span className="block truncate text-sm font-medium text-[#222]">{parrainProfile.years_on_site} an{parrainProfile.years_on_site > 1 ? 's' : ''}</span>
                            </div>
                          </div>
                          <div className="h-px bg-gray-100" />
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{parrainProfile.mobility_type === 'exchange' ? '🎓' : parrainProfile.mobility_type === 'stage' ? '💼' : '✨'}</span>
                            <div className="min-w-0">
                              <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">Mobilité</span>
                              <span className="block truncate text-sm font-medium text-[#222]">
                                {parrainProfile.mobility_type === 'exchange' ? 'Échange' : parrainProfile.mobility_type === 'stage' ? 'Stage' : 'Les deux'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="mt-5 grid grid-cols-2 gap-3">
                          <div className="rounded-xl bg-[#FF385C]/5 p-3 text-center">
                            <span className="block text-xl font-bold text-[#FF385C]">{parrainProfile.rating}</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Note</span>
                          </div>
                          <div className="rounded-xl bg-[#1A3B5C]/5 p-3 text-center">
                            <span className="block text-xl font-bold text-[#1A3B5C]">{parrainProfile.review_count}</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Avis</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right column – Details + Edit */}
                    <div className="flex flex-col gap-6 lg:col-span-2">
                      {/* Details / Edit Card */}
                      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl sm:p-8">
                        <div className="mb-6 flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-[#222]">Informations parrain</h3>
                          {!editingParrain ? (
                            <button
                              onClick={() => {
                                setParrainForm({
                                  city: parrainProfile.city,
                                  country: parrainProfile.country,
                                  school: parrainProfile.school,
                                  years_on_site: parrainProfile.years_on_site,
                                  expertise: parrainProfile.expertise,
                                  mobility_type: parrainProfile.mobility_type,
                                  bio: parrainProfile.bio,
                                  email: parrainProfile.email,
                                  phone: parrainProfile.phone,
                                  instagram: parrainProfile.instagram,
                                  linkedin: parrainProfile.linkedin,
                                });
                                setEditingParrain(true);
                                setParrainError('');
                                setParrainSuccess('');
                              }}
                              className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:border-[#FF385C] hover:text-[#FF385C] active:scale-[0.97]"
                            >
                              Modifier
                            </button>
                          ) : (
                            <button
                              onClick={() => { setEditingParrain(false); setParrainError(''); }}
                              className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-500 transition-all hover:bg-gray-50 active:scale-[0.97]"
                            >
                              Annuler
                            </button>
                          )}
                        </div>

                        {!editingParrain ? (
                          <div className="space-y-5">
                            {/* Expertise */}
                            <div>
                              <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">Expertise</span>
                              <div className="mt-2 flex flex-wrap gap-2">
                                {parrainProfile.expertise.map((exp) => (
                                  <span key={exp} className="rounded-full bg-[#1A3B5C]/10 px-3 py-1 text-xs font-medium text-[#1A3B5C]">
                                    {exp}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Bio */}
                            <div>
                              <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">Bio</span>
                              <p className="mt-2 text-sm leading-relaxed text-gray-600">{parrainProfile.bio}</p>
                            </div>

                            {/* Contact & Social */}
                            <div>
                              <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">Contact & réseaux</span>
                              <div className="mt-2 flex flex-wrap gap-3">
                                {parrainProfile.email && (
                                  <span className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700">
                                    📧 {parrainProfile.email}
                                  </span>
                                )}
                                {parrainProfile.phone && (
                                  <span className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700">
                                    📞 {parrainProfile.phone}
                                  </span>
                                )}
                                {parrainProfile.instagram && (
                                  <span className="flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1.5 text-xs font-medium text-purple-700">
                                    📸 {parrainProfile.instagram}
                                  </span>
                                )}
                                {parrainProfile.linkedin && (
                                  <span className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700">
                                    💼 {parrainProfile.linkedin}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* Edit form */
                          <form
                            onSubmit={async (e) => {
                              e.preventDefault();
                              setSavingParrain(true);
                              setParrainError('');

                              const countryFlags: Record<string, string> = {
                                'Espagne': '🇪🇸', 'Allemagne': '🇩🇪', 'Royaume-Uni': '🇬🇧', 'États-Unis': '🇺🇸',
                                'Canada': '🇨🇦', 'Australie': '🇦🇺', 'Japon': '🇯🇵', 'Corée du Sud': '🇰🇷',
                                'Italie': '🇮🇹', 'Portugal': '🇵🇹', 'Pays-Bas': '🇳🇱', 'Belgique': '🇧🇪',
                                'Suisse': '🇨🇭', 'Irlande': '🇮🇪', 'Suède': '🇸🇪', 'Norvège': '🇳🇴',
                                'Danemark': '🇩🇰', 'Finlande': '🇫🇮', 'Pologne': '🇵🇱', 'Autriche': '🇦🇹',
                                'Mexique': '🇲🇽', 'Brésil': '🇧🇷', 'Argentine': '🇦🇷', 'Chili': '🇨🇱',
                                'Colombie': '🇨🇴', 'Chine': '🇨🇳', 'Singapour': '🇸🇬', 'Thaïlande': '🇹🇭',
                                'Inde': '🇮🇳', 'Uruguay': '🇺🇾', 'Afrique du Sud': '🇿🇦',
                              };

                              const { error } = await updateParrain(parrainProfile.id, {
                                city: (parrainForm.city || '').trim(),
                                country: (parrainForm.country || '').trim(),
                                country_flag: countryFlags[parrainForm.country || ''] || '🌍',
                                school: (parrainForm.school || '').trim(),
                                years_on_site: parrainForm.years_on_site || 1,
                                expertise: (parrainForm.expertise || []) as string[],
                                mobility_type: parrainForm.mobility_type as 'stage' | 'exchange' | 'both',
                                bio: (parrainForm.bio || '').trim(),
                                email: (parrainForm.email || '').trim(),
                                phone: (parrainForm.phone || '').trim() || null,
                                instagram: (parrainForm.instagram || '').trim() || null,
                                linkedin: (parrainForm.linkedin || '').trim() || null,
                              });

                              setSavingParrain(false);
                              if (error) {
                                setParrainError('Erreur lors de la mise à jour. Veuillez réessayer.');
                              } else {
                                setEditingParrain(false);
                                await refetchParrain();
                                showSuccess(setParrainSuccess, 'Profil parrain mis à jour.');
                              }
                            }}
                            className="flex flex-col gap-4"
                          >
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                              <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">Ville</label>
                                <input type="text" value={parrainForm.city || ''} onChange={(e) => setParrainForm((p) => ({ ...p, city: e.target.value }))} className={inputClass} />
                              </div>
                              <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">Pays</label>
                                <select value={parrainForm.country || ''} onChange={(e) => setParrainForm((p) => ({ ...p, country: e.target.value }))} className={inputClass}>
                                  <option value="">Sélectionner</option>
                                  {Object.keys({
                                    'Espagne': '🇪🇸', 'Allemagne': '🇩🇪', 'Royaume-Uni': '🇬🇧', 'États-Unis': '🇺🇸',
                                    'Canada': '🇨🇦', 'Australie': '🇦🇺', 'Japon': '🇯🇵', 'Corée du Sud': '🇰🇷',
                                    'Italie': '🇮🇹', 'Portugal': '🇵🇹', 'Pays-Bas': '🇳🇱', 'Belgique': '🇧🇪',
                                    'Suisse': '🇨🇭', 'Irlande': '🇮🇪', 'Suède': '🇸🇪', 'Norvège': '🇳🇴',
                                    'Danemark': '🇩🇰', 'Finlande': '🇫🇮', 'Pologne': '🇵🇱', 'Autriche': '🇦🇹',
                                    'Mexique': '🇲🇽', 'Brésil': '🇧🇷', 'Argentine': '🇦🇷', 'Chili': '🇨🇱',
                                    'Colombie': '🇨🇴', 'Chine': '🇨🇳', 'Singapour': '🇸🇬', 'Thaïlande': '🇹🇭',
                                    'Inde': '🇮🇳', 'Uruguay': '🇺🇾', 'Afrique du Sud': '🇿🇦',
                                  }).sort().map((c) => <option key={c} value={c}>{c}</option>)}
                                </select>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                              <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">École</label>
                                <input type="text" value={parrainForm.school || ''} onChange={(e) => setParrainForm((p) => ({ ...p, school: e.target.value }))} className={inputClass} />
                              </div>
                              <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">Années sur place</label>
                                <input type="number" min={1} max={10} value={parrainForm.years_on_site || 1} onChange={(e) => setParrainForm((p) => ({ ...p, years_on_site: parseInt(e.target.value) || 1 }))} className={inputClass} />
                              </div>
                            </div>

                            {/* Expertise */}
                            <div>
                              <label className="mb-2 block text-sm font-medium text-gray-700">Expertise</label>
                              <div className="flex flex-wrap gap-2">
                                {(['logement', 'admin', 'vie-quotidienne', 'stage', 'universite', 'langue', 'social'] as ExpertiseCategory[]).map((exp) => {
                                  const labels: Record<string, string> = { logement: '🏠 Logement', admin: '📋 Administratif', 'vie-quotidienne': '🍽️ Vie quotidienne', stage: '💼 Stage', universite: '🎓 Université', langue: '🗣️ Langue', social: '🤝 Social' };
                                  const isSelected = (parrainForm.expertise || []).includes(exp);
                                  return (
                                    <button
                                      key={exp}
                                      type="button"
                                      onClick={() => {
                                        setParrainForm((p) => ({
                                          ...p,
                                          expertise: isSelected
                                            ? (p.expertise || []).filter((e) => e !== exp)
                                            : [...(p.expertise || []), exp],
                                        }));
                                      }}
                                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${isSelected ? 'bg-[#1A3B5C] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                    >
                                      {labels[exp]}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Mobility */}
                            <div>
                              <label className="mb-2 block text-sm font-medium text-gray-700">Type de mobilité</label>
                              <div className="flex gap-2">
                                {([{ value: 'exchange', label: '🎓 Échange' }, { value: 'stage', label: '💼 Stage' }, { value: 'both', label: '✨ Les deux' }] as { value: MobilityType; label: string }[]).map((opt) => (
                                  <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setParrainForm((p) => ({ ...p, mobility_type: opt.value }))}
                                    className={`flex-1 rounded-xl border py-2 text-sm font-medium transition-all ${parrainForm.mobility_type === opt.value ? 'border-[#FF385C] bg-[#FF385C]/5 text-[#FF385C]' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                                  >
                                    {opt.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Bio */}
                            <div>
                              <label className="mb-1.5 block text-sm font-medium text-gray-700">Bio</label>
                              <textarea
                                value={parrainForm.bio || ''}
                                onChange={(e) => setParrainForm((p) => ({ ...p, bio: e.target.value }))}
                                rows={3}
                                maxLength={300}
                                className={inputClass + ' resize-none'}
                              />
                              <p className="mt-1 text-right text-xs text-gray-400">{(parrainForm.bio || '').length}/300</p>
                            </div>

                            {/* Social */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                              <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">Instagram</label>
                                <input type="text" value={parrainForm.instagram || ''} onChange={(e) => setParrainForm((p) => ({ ...p, instagram: e.target.value }))} placeholder="@username" className={inputClass} />
                              </div>
                              <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">LinkedIn</label>
                                <input type="text" value={parrainForm.linkedin || ''} onChange={(e) => setParrainForm((p) => ({ ...p, linkedin: e.target.value }))} placeholder="URL LinkedIn" className={inputClass} />
                              </div>
                            </div>

                            <button
                              type="submit"
                              disabled={savingParrain}
                              className="mt-2 w-full rounded-xl bg-[#FF385C] px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#D70466] hover:shadow active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {savingParrain ? 'Enregistrement...' : 'Enregistrer les modifications'}
                            </button>
                          </form>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* Not a parrain – CTA */
                <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
                  <div className="flex flex-col items-center py-4 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FF385C]/10">
                      <span className="text-2xl">🤝</span>
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-[#222]">Devenez parrain</h3>
                    <p className="mb-5 text-sm leading-relaxed text-gray-500">
                      Partagez votre expérience à l&apos;étranger et aidez les futurs étudiants dans leur mobilité.
                    </p>
                    <Link
                      href="/devenir-parrain"
                      className="rounded-xl bg-[#FF385C] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#D70466] hover:shadow active:scale-[0.98]"
                    >
                      Devenir parrain
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ========== Sécurité & Compte ========== */}
          <h2 className="mb-6 mt-10 text-2xl font-bold text-[#222]">🔒 Sécurité & Compte</h2>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Change Password Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl sm:p-8">
              <h3 className="mb-6 text-lg font-semibold text-[#222]">Changer le mot de passe</h3>

              {passwordSuccess && (
                <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                  {passwordSuccess}
                </div>
              )}
              {passwordError && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                  {passwordError}
                </div>
              )}

              <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Nouveau mot de passe</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="Minimum 6 caractères"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Confirmer</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className={inputClass}
                  />
                </div>
                <button
                  type="submit"
                  disabled={passwordSaving}
                  className="w-full rounded-xl border border-[#1A3B5C] px-8 py-3.5 text-sm font-semibold text-[#1A3B5C] transition-all hover:bg-[#1A3B5C] hover:text-white active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {passwordSaving ? 'Modification...' : 'Modifier le mot de passe'}
                </button>
              </form>
            </div>

            {/* Danger Zone Card */}
            <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-xl sm:p-8">
              <h3 className="mb-2 text-lg font-semibold text-red-600">Zone dangereuse</h3>
              <p className="mb-6 text-sm text-gray-500">
                La suppression de votre compte est irréversible. Toutes vos données seront définitivement effacées.
              </p>

              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full rounded-xl border border-red-300 px-4 py-3 text-sm font-semibold text-red-600 transition-all hover:bg-red-50 active:scale-[0.98]"
                >
                  Supprimer mon compte
                </button>
              ) : (
                <div>
                  <p className="mb-3 text-sm font-medium text-red-700">
                    Êtes-vous sûr ? Cette action est irréversible.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleDeleteAccount}
                      disabled={deleting}
                      className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-red-700 active:scale-[0.98] disabled:opacity-50"
                    >
                      {deleting ? 'Suppression...' : 'Confirmer'}
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
