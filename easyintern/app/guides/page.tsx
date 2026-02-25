'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import GuideHero from '@/components/GuideHero';
import GuideSearchBar from '@/components/GuideSearchBar';
import CountryArticle from '@/components/CountryArticle';
import Footer from '@/components/Footer';

export default function GuidesPage() {
  const [selectedDestination, setSelectedDestination] = useState('');

  const handleSearch = (filters: { departure: string; destination: string }) => {
    setSelectedDestination(filters.destination);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <GuideHero />
        <GuideSearchBar onSearch={handleSearch} />

        {selectedDestination ? (
          <CountryArticle country={selectedDestination} />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="mb-4 text-5xl">🌍</span>
            <h3 className="mb-2 text-lg font-semibold text-[#222]">
              Sélectionnez votre destination
            </h3>
            <p className="max-w-md text-sm text-gray-500">
              Choisissez votre pays de destination dans la barre de recherche pour découvrir le guide complet adapté à votre mobilité.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
