'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';
import ParrainGrid from '@/components/ParrainGrid';
import ParrainModal from '@/components/ParrainModal';
import Footer from '@/components/Footer';
import { parrains } from '@/data/parrains';
import { ExpertiseCategory, Parrain } from '@/types';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<ExpertiseCategory | 'all'>('all');
  const [searchFilters, setSearchFilters] = useState({
    city: '',
    school: '',
    mobility: '',
  });
  const [isSearchCollapsed, setIsSearchCollapsed] = useState(false);
  const [selectedParrain, setSelectedParrain] = useState<Parrain | null>(null);
  const [pendingField, setPendingField] = useState<'city' | 'school' | 'mobility' | null>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!searchBarRef.current) return;
      const searchBarBottom = searchBarRef.current.getBoundingClientRect().bottom;
      setIsSearchCollapsed(searchBarBottom < 60);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCompactSearchClick = (field?: 'city' | 'school' | 'mobility') => {
    setPendingField(field || 'city');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsSearchCollapsed(false);
  };

  const filteredParrains = useMemo(() => {
    return parrains.filter((p) => {
      if (selectedCategory !== 'all' && !p.expertise.includes(selectedCategory)) {
        return false;
      }
      if (
        searchFilters.city &&
        !p.city.toLowerCase().includes(searchFilters.city.toLowerCase())
      ) {
        return false;
      }
      if (
        searchFilters.school &&
        !p.school.toLowerCase().includes(searchFilters.school.toLowerCase())
      ) {
        return false;
      }
      if (searchFilters.mobility) {
        if (p.mobilityType !== 'both' && p.mobilityType !== searchFilters.mobility) {
          return false;
        }
      }
      return true;
    });
  }, [selectedCategory, searchFilters]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar
        showCompactSearch={isSearchCollapsed}
        onCompactSearchClick={handleCompactSearchClick}
        searchFilters={searchFilters}
      />

      <main className="flex-1">
        <div ref={searchBarRef}>
          <SearchBar onSearch={setSearchFilters} isCollapsed={isSearchCollapsed} openField={pendingField} onOpenFieldConsumed={() => setPendingField(null)} />
        </div>
        <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
        <ParrainGrid
          parrains={filteredParrains}
          onParrainClick={setSelectedParrain}
          animationKey={`${selectedCategory}-${searchFilters.city}-${searchFilters.school}-${searchFilters.mobility}`}
        />
      </main>

      <Footer />

      {selectedParrain && (
        <ParrainModal parrain={selectedParrain} onClose={() => setSelectedParrain(null)} />
      )}
    </div>
  );
}
