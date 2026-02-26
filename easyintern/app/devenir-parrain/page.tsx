'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { insertParrain } from '@/lib/parrains';
import { supabase } from '@/lib/supabase';
import { ExpertiseCategory, MobilityType } from '@/types';

const TOTAL_STEPS = 4;

const expertiseOptions: { id: ExpertiseCategory; label: string; icon: string }[] = [
    { id: 'logement', label: 'Logement', icon: '🏠' },
    { id: 'admin', label: 'Administratif', icon: '📋' },
    { id: 'vie-quotidienne', label: 'Vie quotidienne', icon: '🍽️' },
    { id: 'stage', label: 'Stage', icon: '💼' },
    { id: 'universite', label: 'Université', icon: '🎓' },
    { id: 'langue', label: 'Langue', icon: '🗣️' },
    { id: 'social', label: 'Social', icon: '🤝' },
];

const mobilityOptions: { value: MobilityType; label: string; icon: string; description: string }[] = [
    { value: 'exchange', label: 'Échange universitaire', icon: '🎓', description: 'Semestre ou année d\'échange' },
    { value: 'stage', label: 'Stage', icon: '💼', description: 'Stage en entreprise à l\'étranger' },
    { value: 'both', label: 'Les deux', icon: '✨', description: 'Échange et stage' },
];

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

type FormData = {
    firstName: string;
    lastName: string;
    city: string;
    country: string;
    school: string;
    yearsOnSite: number;
    expertise: ExpertiseCategory[];
    mobilityType: MobilityType;
    bio: string;
    email: string;
    phone: string;
    instagram: string;
    linkedin: string;
};

const initialFormData: FormData = {
    firstName: '',
    lastName: '',
    city: '',
    country: '',
    school: '',
    yearsOnSite: 1,
    expertise: [],
    mobilityType: 'exchange',
    bio: '',
    email: '',
    phone: '',
    instagram: '',
    linkedin: '',
};

export default function DevenirParrainPage() {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState<FormData>(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');
    const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const formRef = useRef<HTMLDivElement>(null);

    // Pre-fill from auth user data
    useEffect(() => {
        if (user) {
            setForm((prev) => ({
                ...prev,
                email: prev.email || user.email || '',
                firstName: prev.firstName || (user.user_metadata?.first_name as string) || '',
                lastName: prev.lastName || (user.user_metadata?.last_name as string) || '',
                phone: prev.phone || (user.user_metadata?.phone as string) || '',
                school: prev.school || (user.user_metadata?.school as string) || '',
            }));
        }
    }, [user]);

    // Auth gate: show loading while checking session
    if (authLoading) {
        return (
            <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex flex-1 items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <svg className="h-8 w-8 animate-spin text-[#FF385C]" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <p className="text-sm text-gray-500">Chargement...</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // Auth gate: prompt login if not connected
    if (!user) {
        return (
            <div className="flex min-h-screen flex-col bg-gray-50/50">
                <Navbar />
                <main className="flex flex-1 items-center justify-center px-4">
                    <div className="success-entrance mx-auto flex w-full max-w-md flex-col items-center text-center">
                        {/* Lock icon */}
                        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#1A3B5C]/10">
                            <svg className="h-10 w-10 text-[#1A3B5C]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                        </div>

                        <h1 className="mb-3 text-3xl font-bold text-[#222]">
                            Connectez-vous pour continuer
                        </h1>
                        <p className="mb-8 leading-relaxed text-gray-500">
                            Pour devenir parrain et aider les futurs expatriés, vous devez d&apos;abord
                            créer un compte ou vous connecter.
                        </p>

                        <div className="flex w-full flex-col gap-3">
                            <button
                                onClick={() => router.push('/auth?redirect=/devenir-parrain')}
                                className="w-full rounded-xl bg-[#FF385C] px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#D70466] hover:shadow active:scale-[0.98]"
                            >
                                Se connecter
                            </button>
                            <button
                                onClick={() => router.push('/auth?redirect=/devenir-parrain')}
                                className="w-full rounded-xl border border-gray-300 px-8 py-3.5 text-sm font-semibold text-[#222] transition-all hover:bg-gray-50 active:scale-[0.98]"
                            >
                                Créer un compte
                            </button>
                        </div>

                        <button
                            onClick={() => router.push('/')}
                            className="mt-6 text-sm text-gray-500 transition-colors hover:text-[#1A3B5C]"
                        >
                            Retour à l&apos;accueil
                        </button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        setError('');
    };

    const toggleExpertise = (id: ExpertiseCategory) => {
        setForm((prev) => ({
            ...prev,
            expertise: prev.expertise.includes(id)
                ? prev.expertise.filter((e) => e !== id)
                : [...prev.expertise, id],
        }));
    };

    const handleAvatarChange = (file: File) => {
        if (!file.type.startsWith('image/')) {
            setError('Veuillez sélectionner une image');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError('L\'image ne doit pas dépasser 5 Mo');
            return;
        }
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
        setError('');
    };

    const uploadAvatar = async (): Promise<string | null> => {
        if (!avatarFile) return null;
        setIsUploadingAvatar(true);
        try {
            const ext = avatarFile.name.split('.').pop();
            const fileName = `parrains/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, avatarFile, { cacheControl: '3600', upsert: false });
            if (uploadError) {
                console.error('Upload error:', uploadError);
                return null;
            }
            const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
            return urlData.publicUrl;
        } catch {
            return null;
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    const validateStep = (): boolean => {
        switch (step) {
            case 1:
                if (!form.firstName.trim()) { setError('Le prénom est requis'); return false; }
                if (!form.lastName.trim()) { setError('Le nom est requis'); return false; }
                if (!form.email.trim()) { setError('L\'email est requis'); return false; }
                return true;
            case 2:
                if (!form.city.trim()) { setError('La ville est requise'); return false; }
                if (!form.country.trim()) { setError('Le pays est requis'); return false; }
                if (!form.school.trim()) { setError('L\'école est requise'); return false; }
                return true;
            case 3:
                if (form.expertise.length === 0) { setError('Sélectionnez au moins un domaine'); return false; }
                return true;
            case 4:
                if (!form.bio.trim()) { setError('La bio est requise'); return false; }
                return true;
            default:
                return true;
        }
    };

    const nextStep = () => {
        if (!validateStep()) return;
        setDirection('forward');
        setStep((s) => Math.min(s + 1, TOTAL_STEPS));
    };

    const prevStep = () => {
        setError('');
        setDirection('backward');
        setStep((s) => Math.max(s - 1, 1));
    };

    const handleSubmit = async () => {
        if (!validateStep()) return;
        setIsSubmitting(true);
        setError('');

        try {
            const flag = countryFlags[form.country] || '🌍';
            const lastNameInitial = form.lastName.charAt(0).toUpperCase();

            // Upload avatar if selected
            let avatarUrl: string | null = null;
            if (avatarFile) {
                avatarUrl = await uploadAvatar();
                if (!avatarUrl) {
                    setError('Erreur lors de l\'upload de la photo. Veuillez réessayer.');
                    setIsSubmitting(false);
                    return;
                }
            }

            const { error: insertError } = await insertParrain({
                user_id: user.id,
                first_name: form.firstName.trim(),
                last_name_initial: lastNameInitial,
                city: form.city.trim(),
                country: form.country.trim(),
                country_flag: flag,
                school: form.school.trim(),
                years_on_site: form.yearsOnSite,
                expertise: form.expertise,
                mobility_type: form.mobilityType,
                bio: form.bio.trim(),
                email: form.email.trim(),
                phone: form.phone.trim() || null,
                instagram: form.instagram.trim() || null,
                linkedin: form.linkedin.trim() || null,
                profile_image: avatarUrl,
            });

            if (insertError) {
                setError('Une erreur est survenue. Veuillez réessayer.');
                setIsSubmitting(false);
                return;
            }

            setIsSuccess(true);
        } catch {
            setError('Une erreur est survenue. Veuillez réessayer.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Success screen
    if (isSuccess) {
        return (
            <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex flex-1 items-center justify-center px-4">
                    <div className="success-entrance mx-auto flex max-w-md flex-col items-center text-center">
                        <div className="success-checkmark mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                            <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="mb-3 text-3xl font-bold text-[#222]">
                            Bienvenue dans la communauté ! 🎉
                        </h1>
                        <p className="mb-8 text-gray-500 leading-relaxed">
                            Ton profil de parrain a bien été créé. Les étudiants pourront désormais te
                            trouver et te contacter pour bénéficier de ton expérience.
                        </p>
                        <button
                            onClick={() => router.push('/')}
                            className="rounded-xl bg-[#FF385C] px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#D70466] hover:shadow active:scale-[0.98]"
                        >
                            Voir les parrains
                        </button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const stepLabels = ['Identité', 'Localisation', 'Expertise', 'Profil'];

    return (
        <div className="flex min-h-screen flex-col bg-gray-50/50">
            <Navbar />
            <main className="flex flex-1 flex-col items-center px-4 pb-20 pt-10">
                {/* Header */}
                <div className="mb-10 text-center form-field-stagger">
                    <h1 className="text-3xl font-bold text-[#222] sm:text-4xl">
                        Devenir parrain
                    </h1>
                    <p className="mt-3 text-gray-500 sm:text-lg">
                        Partagez votre expérience et aidez les futurs étudiants à l&apos;étranger.
                    </p>
                </div>

                {/* Progress bar */}
                <div className="mb-10 w-full max-w-lg">
                    <div className="relative flex items-start justify-between">
                        {/* Connecting line - sits behind the circles */}
                        <div className="absolute top-5 left-5 right-5 z-0">
                            <div className="h-0.5 w-full rounded-full bg-gray-200" />
                            <div
                                className="absolute left-0 top-0 h-0.5 rounded-full bg-[#FF385C] transition-all duration-700 ease-out"
                                style={{ width: `${((step - 1) / (TOTAL_STEPS - 1)) * 100}%` }}
                            />
                        </div>
                        {stepLabels.map((label, idx) => {
                            const stepNum = idx + 1;
                            const isActive = step === stepNum;
                            const isCompleted = step > stepNum;
                            return (
                                <div key={label} className="relative z-10 flex flex-col items-center gap-2">
                                    <div
                                        className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all duration-500 ${isActive
                                            ? 'bg-[#FF385C] text-white shadow-lg shadow-[#FF385C]/30 scale-110'
                                            : isCompleted
                                                ? 'bg-[#1A3B5C] text-white'
                                                : 'bg-gray-200 text-gray-500'
                                            }`}
                                    >
                                        {isCompleted ? (
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : (
                                            stepNum
                                        )}
                                    </div>
                                    <span
                                        className={`text-xs font-medium transition-colors ${isActive ? 'text-[#FF385C]' : isCompleted ? 'text-[#1A3B5C]' : 'text-gray-400'
                                            }`}
                                    >
                                        {label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Form card */}
                <div
                    ref={formRef}
                    className="w-full max-w-lg overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl"
                >
                    <div className="p-8">
                        {/* Step content with animation */}
                        <div
                            key={step}
                            className={direction === 'forward' ? 'step-slide-in-right' : 'step-slide-in-left'}
                        >
                            {/* Step 1: Identity */}
                            {step === 1 && (
                                <div className="space-y-5">
                                    <div className="mb-6">
                                        <h2 className="text-xl font-bold text-[#222]">Vos informations</h2>
                                        <p className="mt-1 text-sm text-gray-500">Comment les étudiants vous identifieront</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="form-field-stagger">
                                            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-700">
                                                Prénom *
                                            </label>
                                            <input
                                                type="text"
                                                value={form.firstName}
                                                onChange={(e) => updateField('firstName', e.target.value)}
                                                placeholder="Marie"
                                                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-800 outline-none transition-all focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20"
                                            />
                                        </div>
                                        <div className="form-field-stagger">
                                            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-700">
                                                Nom *
                                            </label>
                                            <input
                                                type="text"
                                                value={form.lastName}
                                                onChange={(e) => updateField('lastName', e.target.value)}
                                                placeholder="Dupont"
                                                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-800 outline-none transition-all focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-field-stagger">
                                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-700">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            value={form.email}
                                            onChange={(e) => updateField('email', e.target.value)}
                                            placeholder="marie@kedge.edu"
                                            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-800 outline-none transition-all focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20"
                                        />
                                    </div>
                                    <div className="form-field-stagger">
                                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-700">
                                            Téléphone
                                        </label>
                                        <input
                                            type="tel"
                                            value={form.phone}
                                            onChange={(e) => updateField('phone', e.target.value)}
                                            placeholder="+33 6 12 34 56 78"
                                            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-800 outline-none transition-all focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Location */}
                            {step === 2 && (
                                <div className="space-y-5">
                                    <div className="mb-6">
                                        <h2 className="text-xl font-bold text-[#222]">Votre lieu d&apos;expatriation</h2>
                                        <p className="mt-1 text-sm text-gray-500">Où êtes-vous actuellement basé(e) ?</p>
                                    </div>
                                    <div className="form-field-stagger">
                                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-700">
                                            Pays *
                                        </label>
                                        <select
                                            value={form.country}
                                            onChange={(e) => updateField('country', e.target.value)}
                                            className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition-all focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20"
                                        >
                                            <option value="">Sélectionner un pays</option>
                                            {Object.entries(countryFlags).map(([country, flag]) => (
                                                <option key={country} value={country}>
                                                    {flag} {country}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-field-stagger">
                                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-700">
                                            Ville *
                                        </label>
                                        <input
                                            type="text"
                                            value={form.city}
                                            onChange={(e) => updateField('city', e.target.value)}
                                            placeholder="Barcelone, Madrid, Londres..."
                                            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-800 outline-none transition-all focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20"
                                        />
                                    </div>
                                    <div className="form-field-stagger">
                                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-700">
                                            École d&apos;origine *
                                        </label>
                                        <input
                                            type="text"
                                            value={form.school}
                                            onChange={(e) => updateField('school', e.target.value)}
                                            placeholder="KEDGE, ESSEC, HEC..."
                                            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-800 outline-none transition-all focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20"
                                        />
                                    </div>
                                    <div className="form-field-stagger">
                                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-700">
                                            Années sur place
                                        </label>
                                        <div className="flex items-center gap-4">
                                            <button
                                                type="button"
                                                onClick={() => updateField('yearsOnSite', Math.max(0, form.yearsOnSite - 1))}
                                                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-gray-600 transition-all hover:border-[#FF385C] hover:text-[#FF385C] active:scale-90"
                                            >
                                                −
                                            </button>
                                            <span className="min-w-[3rem] text-center text-2xl font-bold text-[#222]">
                                                {form.yearsOnSite}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => updateField('yearsOnSite', form.yearsOnSite + 1)}
                                                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-gray-600 transition-all hover:border-[#FF385C] hover:text-[#FF385C] active:scale-90"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Expertise */}
                            {step === 3 && (
                                <div className="space-y-5">
                                    <div className="mb-6">
                                        <h2 className="text-xl font-bold text-[#222]">Vos domaines d&apos;expertise</h2>
                                        <p className="mt-1 text-sm text-gray-500">Dans quels domaines pouvez-vous aider ?</p>
                                    </div>

                                    <div>
                                        <label className="mb-3 block text-xs font-bold uppercase tracking-wide text-gray-700">
                                            Domaines d&apos;expertise *
                                        </label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {expertiseOptions.map((opt, idx) => {
                                                const selected = form.expertise.includes(opt.id);
                                                return (
                                                    <button
                                                        key={opt.id}
                                                        type="button"
                                                        onClick={() => toggleExpertise(opt.id)}
                                                        className={`form-field-stagger flex items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-left transition-all duration-200 ${selected
                                                            ? 'border-[#FF385C] bg-[#FF385C]/5 shadow-sm'
                                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                            }`}
                                                        style={{ animationDelay: `${idx * 50}ms` }}
                                                    >
                                                        <span className="text-xl">{opt.icon}</span>
                                                        <span className={`text-sm font-medium ${selected ? 'text-[#FF385C]' : 'text-gray-700'}`}>
                                                            {opt.label}
                                                        </span>
                                                        {selected && (
                                                            <svg className="ml-auto h-5 w-5 text-[#FF385C] expertise-check" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <label className="mb-3 block text-xs font-bold uppercase tracking-wide text-gray-700">
                                            Type de mobilité *
                                        </label>
                                        <div className="space-y-3">
                                            {mobilityOptions.map((opt) => {
                                                const selected = form.mobilityType === opt.value;
                                                return (
                                                    <button
                                                        key={opt.value}
                                                        type="button"
                                                        onClick={() => updateField('mobilityType', opt.value)}
                                                        className={`flex w-full items-center gap-4 rounded-xl border-2 px-4 py-3.5 text-left transition-all duration-200 ${selected
                                                            ? 'border-[#1A3B5C] bg-[#1A3B5C]/5'
                                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        <span className="text-xl">{opt.icon}</span>
                                                        <div>
                                                            <p className={`text-sm font-semibold ${selected ? 'text-[#1A3B5C]' : 'text-gray-700'}`}>
                                                                {opt.label}
                                                            </p>
                                                            <p className="text-xs text-gray-500">{opt.description}</p>
                                                        </div>
                                                        {selected && (
                                                            <div className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-[#1A3B5C]">
                                                                <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Profile & Bio */}
                            {step === 4 && (
                                <div className="space-y-5">
                                    <div className="mb-6">
                                        <h2 className="text-xl font-bold text-[#222]">Finalisez votre profil</h2>
                                        <p className="mt-1 text-sm text-gray-500">Présentez-vous aux futurs expatriés</p>
                                    </div>

                                    {/* Avatar Upload */}
                                    <div className="form-field-stagger">
                                        <label className="mb-3 block text-xs font-bold uppercase tracking-wide text-gray-700">
                                            Photo de profil
                                        </label>
                                        <div className="flex items-center gap-5">
                                            {/* Avatar preview */}
                                            <div
                                                onClick={() => fileInputRef.current?.click()}
                                                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                                onDrop={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    const file = e.dataTransfer.files?.[0];
                                                    if (file) handleAvatarChange(file);
                                                }}
                                                className="group relative flex h-24 w-24 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 transition-all hover:border-[#FF385C] hover:bg-[#FF385C]/5"
                                            >
                                                {avatarPreview ? (
                                                    <>
                                                        <img
                                                            src={avatarPreview}
                                                            alt="Avatar"
                                                            className="h-full w-full object-cover"
                                                        />
                                                        {/* Hover overlay */}
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                                                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                            </svg>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="flex flex-col items-center gap-1 text-gray-400 transition-colors group-hover:text-[#FF385C]">
                                                        <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <button
                                                    type="button"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:border-[#FF385C] hover:text-[#FF385C] active:scale-[0.97]"
                                                >
                                                    {avatarPreview ? 'Changer la photo' : 'Ajouter une photo'}
                                                </button>
                                                <p className="mt-2 text-xs text-gray-400">
                                                    JPG, PNG ou WebP · 5 Mo max
                                                </p>
                                                {avatarFile && (
                                                    <p className="mt-1 flex items-center gap-1 text-xs text-green-600">
                                                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        {avatarFile.name}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) handleAvatarChange(file);
                                            }}
                                            className="hidden"
                                        />
                                    </div>

                                    <div className="form-field-stagger">
                                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-700">
                                            Votre bio *
                                        </label>
                                        <textarea
                                            value={form.bio}
                                            onChange={(e) => updateField('bio', e.target.value)}
                                            placeholder="Présentez-vous en quelques lignes : votre parcours, vos conseils, ce qui vous motive à aider..."
                                            rows={4}
                                            maxLength={500}
                                            className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-800 outline-none transition-all focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20"
                                        />
                                        <p className="mt-1 text-right text-xs text-gray-400">
                                            {form.bio.length}/500
                                        </p>
                                    </div>

                                    <div className="form-field-stagger">
                                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-700">
                                            Instagram
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">@</span>
                                            <input
                                                type="text"
                                                value={form.instagram}
                                                onChange={(e) => updateField('instagram', e.target.value)}
                                                placeholder="votre_pseudo"
                                                className="w-full rounded-xl border border-gray-300 py-3 pl-9 pr-4 text-sm text-gray-800 outline-none transition-all focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-field-stagger">
                                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-700">
                                            LinkedIn
                                        </label>
                                        <input
                                            type="url"
                                            value={form.linkedin}
                                            onChange={(e) => updateField('linkedin', e.target.value)}
                                            placeholder="https://linkedin.com/in/votre-profil"
                                            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-800 outline-none transition-all focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20"
                                        />
                                    </div>

                                    {/* Preview card */}
                                    <div className="form-field-stagger rounded-2xl border border-gray-100 bg-gray-50 p-5">
                                        <p className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-400">Aperçu de votre profil</p>
                                        <div className="flex items-center gap-4">
                                            {avatarPreview ? (
                                                <img src={avatarPreview} alt="Avatar" className="h-14 w-14 shrink-0 rounded-xl object-cover" />
                                            ) : (
                                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#1A3B5C] text-xl font-bold text-white">
                                                    {form.firstName.charAt(0).toUpperCase() || '?'}
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-semibold text-[#222]">
                                                    {form.firstName || 'Prénom'} {form.lastName ? form.lastName.charAt(0).toUpperCase() + '.' : 'N.'}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {form.country ? (countryFlags[form.country] || '🌍') + ' ' : ''}
                                                    {form.city || 'Ville'}, {form.country || 'Pays'}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    🎓 {form.school || 'École'} · {form.yearsOnSite} an{form.yearsOnSite > 1 ? 's' : ''} sur place
                                                </p>
                                            </div>
                                        </div>
                                        {form.expertise.length > 0 && (
                                            <div className="mt-3 flex flex-wrap gap-1.5">
                                                {form.expertise.map((exp) => {
                                                    const opt = expertiseOptions.find((o) => o.id === exp);
                                                    return (
                                                        <span key={exp} className="rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-gray-600 shadow-sm">
                                                            {opt?.label || exp}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 error-shake">
                                <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                </svg>
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Navigation buttons */}
                    <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/50 px-8 py-5">
                        {step > 1 ? (
                            <button
                                onClick={prevStep}
                                className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100 active:scale-[0.97]"
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                </svg>
                                Retour
                            </button>
                        ) : (
                            <div />
                        )}
                        {step < TOTAL_STEPS ? (
                            <button
                                onClick={nextStep}
                                className="flex items-center gap-2 rounded-xl bg-[#1A3B5C] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#15304a] hover:shadow active:scale-[0.97]"
                            >
                                Suivant
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="flex items-center gap-2 rounded-xl bg-[#FF385C] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#D70466] hover:shadow disabled:opacity-50 active:scale-[0.97]"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Envoi en cours...
                                    </>
                                ) : (
                                    <>
                                        Créer mon profil
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
