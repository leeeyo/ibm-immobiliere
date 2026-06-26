"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { trackGaSearch } from "@/lib/google-analytics";
import { createMetaEventId, sendMetaCapiClientEvent } from "@/lib/meta-client-events";
import { isMetaPixelEnabled, trackMetaSearch } from "@/lib/meta-pixel";

interface SearchFilters {
  query: string;
  type: 'all' | 'residential' | 'commercial';
  rooms: string;
}

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<SearchFilters>({ query: '', type: 'all', rooms: 'all' });

  useEffect(() => {
    const q = searchParams?.get('query') || '';
    const type = (searchParams?.get('type') as any) || 'all';
    const rooms = searchParams?.get('rooms') || 'all';
    setFilters({ query: q, type, rooms });
  }, [searchParams]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (filters.query) params.set('query', filters.query);
    if (filters.type && filters.type !== 'all') params.set('type', filters.type);
    if (filters.rooms && filters.rooms !== 'all') params.set('rooms', filters.rooms);
    const qs = params.toString();
    const searchString = filters.query || [filters.type, filters.rooms].filter((v) => v && v !== "all").join(" ") || "catalogue";

    trackGaSearch({
      searchTerm: searchString,
      property_type: filters.type,
      rooms: filters.rooms,
    });

    if (isMetaPixelEnabled()) {
      const eventId = createMetaEventId("search");
      const payload = {
        eventId,
        searchString,
        contentCategory: "property_search",
        customData: {
          property_type: filters.type,
          rooms: filters.rooms,
        },
      };
      trackMetaSearch(payload);
      sendMetaCapiClientEvent({
        eventName: "Search",
        source: "search",
        ...payload,
      });
    }

    router.push('/proprietes' + (qs ? `?${qs}` : ''));
  };

  const handleReset = () => {
    setFilters({ query: '', type: 'all', rooms: 'all' });
    router.push('/proprietes');
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl shadow-2xl p-6 md:p-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Type
          </label>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value as any })}
            className="w-full px-4 py-3 text-black border rounded-lg focus:ring-primary focus:border-transparent transition-all"
          >
            <option value="all">Tous</option>
            <option value="residential">Résidentiel</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Recherche par clé
          </label>
          <div className="relative">
            <input
              type="text"
              value={filters.query}
              onChange={(e) => setFilters({ ...filters, query: e.target.value })}
              placeholder="Localisation, projet, mot-clé..."
              className="w-full px-4 py-3 pl-10 text-black border rounded-lg focus:ring-primary focus:border-transparent transition-all"
            />
            <svg
              className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Pièces
          </label>
          <select
            value={filters.rooms}
            onChange={(e) => setFilters({ ...filters, rooms: e.target.value })}
            className="w-full px-4 py-3 text-black border rounded-lg focus:ring-primary focus:border-transparent transition-all"
          >
            <option value="all">Tous</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSearch}
            className="bg-secondary text-white px-8 py-3 rounded-lg font-semibold hover:bg-secondary-600 transition-colors shadow-lg hover:shadow-xl flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Rechercher</span>
          </motion.button>

          <button onClick={handleReset} className="bg-slate-100 text-slate-700 px-6 py-3 rounded-lg font-semibold hover:bg-slate-200 transition-colors">
            Réinitialiser
          </button>
        </div>
      </div>
    </motion.div>
  );
}
