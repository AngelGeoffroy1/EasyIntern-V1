'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

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

              {/* Danger Zone Card */}
              <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-xl">
                <h3 className="mb-2 text-base font-semibold text-red-600">Zone dangereuse</h3>
                <p className="mb-4 text-xs text-gray-500">
                  La suppression est irréversible. Toutes vos données seront effacées.
                </p>

                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full rounded-xl border border-red-300 px-4 py-2.5 text-sm font-semibold text-red-600 transition-all hover:bg-red-50 active:scale-[0.98]"
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
                        className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-red-700 active:scale-[0.98] disabled:opacity-50"
                      >
                        {deleting ? 'Suppression...' : 'Confirmer'}
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                )}
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
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
