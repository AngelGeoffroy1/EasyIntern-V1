'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '@/assets/Logo.png';

export default function WelcomePage() {
    const [showContent, setShowContent] = useState(false);
    const [showConfetti, setShowConfetti] = useState(true);

    useEffect(() => {
        // Animate content in
        const timer = setTimeout(() => setShowContent(true), 200);
        // Stop confetti after a few seconds
        const confettiTimer = setTimeout(() => setShowConfetti(false), 4000);
        return () => {
            clearTimeout(timer);
            clearTimeout(confettiTimer);
        };
    }, []);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-white to-pink-50/30 px-4 py-12 relative overflow-hidden">
            {/* Animated background shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#FF385C]/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#1A3B5C]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            {/* Confetti particles */}
            {showConfetti && (
                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute animate-confetti"
                            style={{
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 2}s`,
                                animationDuration: `${2 + Math.random() * 2}s`,
                            }}
                        >
                            <div
                                className="w-2 h-2 rounded-sm"
                                style={{
                                    backgroundColor: ['#FF385C', '#1A3B5C', '#FFB400', '#22C55E', '#3B82F6', '#A855F7'][i % 6],
                                    transform: `rotate(${Math.random() * 360}deg)`,
                                }}
                            />
                        </div>
                    ))}
                </div>
            )}

            <div
                className={`w-full max-w-lg relative z-10 transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
                {/* Logo */}
                <div className="mb-8 flex justify-center">
                    <Link href="/">
                        <Image src={Logo} alt="EasyIntern" height={56} className="h-14 w-auto" priority />
                    </Link>
                </div>

                {/* Card */}
                <div className="rounded-3xl border border-gray-200/80 bg-white/90 backdrop-blur-sm p-10 shadow-2xl shadow-gray-200/50 text-center">
                    {/* Success Icon */}
                    <div className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg shadow-green-200/50 transition-all duration-500 ${showContent ? 'scale-100' : 'scale-0'}`}>
                        <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                    </div>

                    {/* Title */}
                    <h1 className="mb-3 text-3xl font-bold text-[#222]">
                        Bienvenue sur EasyIntern ! 🎉
                    </h1>

                    {/* Subtitle */}
                    <p className="mb-8 text-base text-gray-500 leading-relaxed">
                        Votre compte a été confirmé avec succès.<br />
                        Vous pouvez maintenant accéder à toutes les fonctionnalités de la plateforme.
                    </p>

                    {/* Features teaser */}
                    <div className="mb-8 grid grid-cols-3 gap-3">
                        <div className="rounded-2xl bg-gradient-to-br from-[#FF385C]/5 to-[#FF385C]/10 p-4 transition-transform hover:scale-105">
                            <div className="mb-2 text-2xl">🌍</div>
                            <p className="text-xs font-medium text-gray-600">Guides Pays</p>
                        </div>
                        <div className="rounded-2xl bg-gradient-to-br from-[#1A3B5C]/5 to-[#1A3B5C]/10 p-4 transition-transform hover:scale-105">
                            <div className="mb-2 text-2xl">🤝</div>
                            <p className="text-xs font-medium text-gray-600">Parrains</p>
                        </div>
                        <div className="rounded-2xl bg-gradient-to-br from-amber-500/5 to-amber-500/10 p-4 transition-transform hover:scale-105">
                            <div className="mb-2 text-2xl">📋</div>
                            <p className="text-xs font-medium text-gray-600">Démarches</p>
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col gap-3">
                        <Link
                            href="/"
                            className="w-full rounded-xl bg-gradient-to-r from-[#FF385C] to-[#D70466] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#FF385C]/25 transition-all hover:shadow-xl hover:shadow-[#FF385C]/30 hover:-translate-y-0.5 active:scale-[0.98] text-center"
                        >
                            Commencer l&apos;aventure →
                        </Link>
                        <Link
                            href="/profil"
                            className="w-full rounded-xl border border-gray-200 bg-white px-8 py-3.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98] text-center"
                        >
                            Compléter mon profil
                        </Link>
                    </div>
                </div>

                {/* Bottom text */}
                <p className="mt-6 text-center text-xs text-gray-400">
                    Une question ? Contactez-nous à{' '}
                    <a href="mailto:support@easyintern.com" className="text-[#FF385C] hover:underline">
                        support@easyintern.com
                    </a>
                </p>
            </div>

            {/* CSS for confetti animation */}
            <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(-10vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti 3s ease-in forwards;
        }
      `}</style>
        </div>
    );
}
