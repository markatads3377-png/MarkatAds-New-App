import React, { useState, useMemo } from 'react';
import { Search, Sparkles, SlidersHorizontal, MapPin, Eye, ShoppingCart, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Listing } from '../types';
import { MEDIUM_OPTIONS } from '../data/mockCatalog';
import { ListingCard } from './ListingCard';

export const BrowseView: React.FC = () => {
  const { catalog, formatMoney, convertPrice, setSelectedListingForDetail } = useApp();

  const [q, setQ] = useState('');
  const [selectedMedium, setSelectedMedium] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'impressions'>('featured');

  const filteredListings = useMemo(() => {
    return catalog
      .filter((item) => {
        if (q.trim()) {
          const term = q.toLowerCase().trim();
          const matchTitle = item.title.toLowerCase().includes(term);
          const matchCity = item.city.toLowerCase().includes(term);
          const matchCountry = item.country.toLowerCase().includes(term);
          const matchDesc = item.description?.toLowerCase().includes(term) || false;
          if (!matchTitle && !matchCity && !matchCountry && !matchDesc) return false;
        }

        if (selectedMedium !== 'all' && item.medium !== selectedMedium) return false;
        if (selectedCity !== 'all' && item.city.toLowerCase() !== selectedCity.toLowerCase()) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'featured') return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        if (sortBy === 'price_asc') {
          return convertPrice(a.pricePerMonth, a.currency) - convertPrice(b.pricePerMonth, b.currency);
        }
        if (sortBy === 'price_desc') {
          return convertPrice(b.pricePerMonth, b.currency) - convertPrice(a.pricePerMonth, a.currency);
        }
        return 0;
      });
  }, [catalog, q, selectedMedium, selectedCity, sortBy, convertPrice]);

  return (
    <div className="space-y-6">
      {/* Title & Quick Filter Pills */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-50 text-[#C62828] border border-red-200">
              Verified Inventory Catalog
            </span>
            <span className="text-xs text-neutral-400 font-medium">
              {filteredListings.length} advertising spaces available
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-neutral-900 tracking-tight">
            Browse Advertising Spaces Worldwide
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-2xl">
            Select verified billboards, airport displays, transit networks, and high-impact digital screens. Configure duration and turnkey production in 1-click.
          </p>
        </div>

        {/* Format Quick Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {[
            { id: 'all', label: 'All Spaces' },
            { id: 'billboard', label: 'Billboards' },
            { id: 'digital_screen', label: 'Digital LED' },
            { id: 'transit', label: 'Transit & Metro' },
            { id: 'airport', label: 'Airports' },
            { id: 'indoor_mall_screen', label: 'Malls' },
            { id: 'second_hand', label: 'Resale' },
          ].map((pill) => (
            <button
              key={pill.id}
              type="button"
              onClick={() => setSelectedMedium(pill.id)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all shrink-0 ${
                selectedMedium === pill.id
                  ? 'bg-[#C62828] text-white border-[#C62828] shadow-2xs font-bold'
                  : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-2xs sm:grid-cols-2 lg:grid-cols-4">
        {/* Search Input */}
        <div className="space-y-1 sm:col-span-2">
          <label className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider block">
            Search Keyword / Location
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="e.g. Bandra, Sheikh Zayed, Times Square, LED, Airport..."
              className="w-full h-9 pl-9 pr-3 rounded-xl border border-neutral-200 text-xs bg-neutral-50/70 focus:bg-white text-neutral-800 focus:outline-none focus:ring-1 focus:ring-[#C62828]"
            />
          </div>
        </div>

        {/* City Filter */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider block">
            Filter by City
          </label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full h-9 px-3 rounded-xl border border-neutral-200 text-xs bg-neutral-50/70 text-neutral-800 font-semibold"
          >
            <option value="all">All Global Cities</option>
            <option value="Dubai">Dubai, UAE</option>
            <option value="Mumbai">Mumbai, India</option>
            <option value="New York">New York, USA</option>
            <option value="London">London, UK</option>
            <option value="Tokyo">Tokyo, Japan</option>
            <option value="Singapore">Singapore</option>
            <option value="Milan">Milan, Italy</option>
            <option value="Chicago">Chicago, USA</option>
          </select>
        </div>

        {/* Sort Order */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider block">
            Sort Order
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full h-9 px-3 rounded-xl border border-neutral-200 text-xs bg-neutral-50/70 text-neutral-800 font-semibold"
          >
            <option value="featured">Featured First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Listing Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((item) => (
          <ListingCard key={item.id} listing={item} />
        ))}
      </div>

      {/* Empty State */}
      {filteredListings.length === 0 && (
        <div className="p-12 text-center rounded-3xl border border-dashed border-neutral-200 bg-white space-y-3">
          <div className="size-12 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
            <Search className="size-6 opacity-40" />
          </div>
          <h4 className="font-bold text-sm text-neutral-800">No media spaces matched your filter</h4>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Try adjusting your search terms or clearing the media format filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setQ('');
              setSelectedMedium('all');
              setSelectedCity('all');
            }}
            className="px-4 h-8 rounded-xl bg-[#C62828] text-white text-xs font-bold shadow-2xs"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
