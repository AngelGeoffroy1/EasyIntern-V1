'use client';

import { useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '@/assets/Logo.png';
import { useAuth } from '@/contexts/AuthContext';

type AuthMode = 'signin' | 'signup';

function AuthPageContent() {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [animationKey, setAnimationKey] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [school, setSchool] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const { signIn, signUp } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  const inputClass =
    'w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-[#222] placeholder-gray-400 outline-none transition-all focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20';

  const resetForm = useCallback(() => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFirstName('');
    setLastName('');
    setPhone('');
    setSchool('');
    setError('');
    setSuccess('');
  }, []);

  const handleModeSwitch = (newMode: AuthMode) => {
    resetForm();
    setMode(newMode);
    setAnimationKey((k) => k + 1);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      setError(error.message === 'Invalid login credentials'
        ? 'Email ou mot de passe incorrect.'
        : error.message);
    } else {
      router.push(redirectTo);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    setLoading(true);
    const { error } = await signUp({ email, password, firstName, lastName, phone, school });
    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setSuccess('Compte créé ! Vérifiez votre email pour confirmer votre inscription.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Link href="/">
            <Image src={Logo} alt="EasyIntern" height={56} className="h-14 w-auto" priority />
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
          {/* Toggle tabs */}
          <div className="mb-8 flex rounded-full bg-gray-100 p-1">
            <button
              onClick={() => handleModeSwitch('signin')}
              className={`flex-1 rounded-full py-2.5 text-sm font-semibold transition-all duration-200 ${mode === 'signin'
                ? 'bg-white text-[#222] shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Se connecter
            </button>
            <button
              onClick={() => handleModeSwitch('signup')}
              className={`flex-1 rounded-full py-2.5 text-sm font-semibold transition-all duration-200 ${mode === 'signup'
                ? 'bg-white text-[#222] shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Créer un compte
            </button>
          </div>

          {/* Success message */}
          {success && (
            <div className="mb-6 rounded-xl bg-green-50 border border-green-200 p-4 text-sm text-green-700">
              {success}
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Sign In Form */}
          {mode === 'signin' && (
            <form key={`signin-${animationKey}`} onSubmit={handleSignIn} className="flex flex-col gap-4">
              <div className="auth-form-enter auth-field-stagger">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="votre@email.com"
                  className={inputClass}
                />
              </div>

              <div className="auth-form-enter auth-field-stagger">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Mot de passe</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className={inputClass}
                />
              </div>

              <div className="auth-form-enter auth-field-stagger">
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 w-full rounded-xl bg-[#FF385C] px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#D70466] hover:shadow active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Connexion...' : 'Se connecter'}
                </button>
              </div>
            </form>
          )}

          {/* Sign Up Form */}
          {mode === 'signup' && !success && (
            <form key={`signup-${animationKey}`} onSubmit={handleSignUp} className="flex flex-col gap-4">
              <div className="auth-form-enter auth-field-stagger grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Prénom</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    placeholder="Marie"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Nom</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    placeholder="Dupont"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="auth-form-enter auth-field-stagger">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="votre@email.com"
                  className={inputClass}
                />
              </div>

              <div className="auth-form-enter auth-field-stagger">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Numéro de téléphone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="+33 6 12 34 56 78"
                  className={inputClass}
                />
              </div>

              <div className="auth-form-enter auth-field-stagger">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">École actuelle</label>
                <input
                  type="text"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  required
                  placeholder="KEDGE Business School"
                  className={inputClass}
                />
              </div>

              <div className="auth-form-enter auth-field-stagger">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Mot de passe</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Minimum 6 caractères"
                  className={inputClass}
                />
              </div>

              <div className="auth-form-enter auth-field-stagger">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className={inputClass}
                />
              </div>

              <div className="auth-form-enter auth-field-stagger">
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 w-full rounded-xl bg-[#FF385C] px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#D70466] hover:shadow active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Création...' : 'Créer mon compte'}
                </button>
              </div>
            </form>
          )}

          {/* Footer link */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-gray-500 transition-colors hover:text-[#1A3B5C]"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <svg className="h-8 w-8 animate-spin text-[#FF385C]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    }>
      <AuthPageContent />
    </Suspense>
  );
}
