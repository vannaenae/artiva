import React from 'react';
import { CATEGORIES } from '../../data/mockData';
import { ServiceCategory } from '../../types';
import { Search, Filter, ShieldCheck, Star, SlidersHorizontal, Heart } from 'lucide-react';
import { Input } from '../ui/Input';

interface ArtisanFilterProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeCategory: ServiceCategory | 'all';
  setActiveCategory: (cat: ServiceCategory | 'all') => void;
  onlyVerified: boolean;
  setOnlyVerified: (val: boolean) => void;
  minRating: number;
  setMinRating: (val: number) => void;
  onlyFavorites?: boolean;
  setOnlyFavorites?: (val: boolean) => void;
}

export const ArtisanFilter: React.FC<ArtisanFilterProps> = ({
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
  onlyVerified,
  setOnlyVerified,
  minRating,
  setMinRating,
  onlyFavorites = false,
  setOnlyFavorites,
}) => {
  return (
    <div className="space-y-4 mb-8">
      {/* Search Input & Toggles */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="flex-1 w-full">
          <Input
            icon={<Search className="w-4 h-4 text-slate-400" />}
            placeholder="Search by artisan name, skill (e.g. inverter, borehole, AC gas), or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto shrink-0 overflow-x-auto pb-1 md:pb-0">
          {/* Verified Only Filter Toggle */}
          <button
            onClick={() => setOnlyVerified(!onlyVerified)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-artiva text-xs font-semibold border transition-all ${
              onlyVerified
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-sm'
                : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <ShieldCheck className={`w-4 h-4 ${onlyVerified ? 'text-emerald-600' : 'text-slate-400'}`} />
            <span>Verified Only</span>
          </button>

          {/* Min Rating Toggle */}
          <button
            onClick={() => setMinRating(minRating === 4.5 ? 0 : 4.5)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-artiva text-xs font-semibold border transition-all ${
              minRating > 0
                ? 'bg-amber-50 text-amber-800 border-amber-300 shadow-sm'
                : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Star className={`w-4 h-4 ${minRating > 0 ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
            <span>4.5+ Stars</span>
          </button>

          {/* Favorites Only Filter Toggle */}
          {setOnlyFavorites && (
            <button
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-artiva text-xs font-semibold border transition-all ${
                onlyFavorites
                  ? 'bg-rose-50 text-rose-800 border-rose-300 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Heart className={`w-4 h-4 ${onlyFavorites ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
              <span>Favorites</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3.5 py-2 rounded-artiva-pill text-xs font-bold whitespace-nowrap transition-all ${
            activeCategory === 'all'
              ? 'bg-artiva-teal text-white shadow-artiva-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          All Categories
        </button>

        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 py-2 rounded-artiva-pill text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeCategory === cat.id
                ? 'bg-artiva-teal text-white shadow-artiva-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
