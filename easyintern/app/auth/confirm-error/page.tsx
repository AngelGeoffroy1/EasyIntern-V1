'use client';

import Image from 'next/image';
import Link from 'next/link';
import Logo from '@/assets/Logo.png';

export default function ConfirmErrorPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-white to-red-50/20 px-4 py-12">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="mb-8 flex justify-center">
                    <Link href="/">
                        <Image src={Logo} alt="EasyIntern" height={56} className="h-14 w-auto" priority />
                    </Link>
                </div>

                {/* Card */}
                <div className="rounded-3xl border border-gray-200/80 bg-white/90 backdrop-blur-sm p-10 shadow-2xl shadow-gray-200/50 text-center">
                    {/* Error Icon */}
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-red-400 to-red-500 shadow-lg shadow-red-200/50">
                        <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>

                    {/* Title */}
                    <h1 className="mb-3 text-2xl font-bold text-[#222]">
                        Lien expiré ou invalide
                    </h1>

                    {/* Subtitle */}
                    <p className="mb-8 text-sm text-gray-500 leading-relaxed">
                        Le lien de confirmation que vous avez utilisé a expiré ou est invalide.
                        Pas de panique, vous pouvez vous reconnecter pour en recevoir un nouveau.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col gap-3">
                        <Link
                            href="/auth"
                            className="w-full rounded-xl bg-gradient-to-r from-[#FF385C] to-[#D70466] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#FF385C]/25 transition-all hover:shadow-xl hover:shadow-[#FF385C]/30 hover:-translate-y-0.5 active:scale-[0.98] text-center"
                        >
                            Retour à la connexion
                        </Link>
                        <Link
                            href="/"
                            className="w-full rounded-xl border border-gray-200 bg-white px-8 py-3.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98] text-center"
                        >
                            Retour à l&apos;accueil
                        </Link>
                    </div>
                </div>

                {/* Bottom text */}
                <p className="mt-6 text-center text-xs text-gray-400">
                    Besoin d&apos;aide ?{' '}
                    <a href="mailto:support@easyintern.com" className="text-[#FF385C] hover:underline">
                        Contactez le support
                    </a>
                </p>
            </div>
        </div>
    );
}
