import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart3,
  Layers,
  TrendingUp,
  Eye,
  Bot,
  Map,
  List,
  CheckCircle2,
  Calendar,
  Building,
  Clock,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Listing } from '../types';
import { ListingCard } from './ListingCard';
import { toast } from 'sonner';

export const HomeView: React.FC = () => {
  const { catalog, setCurrentView, setSelectedListingForDetail, formatMoney, setIsDeployModalOpen } = useApp();

  // Filters
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchLocation, setSearchLocation] = useState<string>('');
  const [selectedMediaType, setSelectedMediaType] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Budget Calculator state
  const [calcBudget, setCalcBudget] = useState<number>(7500);
  const [calcDuration, setCalcDuration] = useState<number>(30);
  const [calcCity, setCalcCity] = useState<string>('Dubai');

  // Quick Filter Tabs matching the screenshot exactly
  const FILTER_TABS = [
    { id: 'all', label: 'All Spaces' },
    { id: 'billboard', label: 'Billboards' },
    { id: 'digital_screen', label: 'Digital LED' },
    { id: 'transit', label: 'Transit & Metro' },
    { id: 'airport', label: 'Airports' },
    { id: 'indoor_mall_screen', label: 'Malls' },
    { id: 'taxi', label: 'Taxi Ads' },
  ];

  // Value Proposition Cards
  const VALUE_CARDS = [
    {
      title: 'Verified Spaces',
      desc: '100% Genuine Inventory',
      icon: ShieldCheck,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
    {
      title: 'Instant Booking',
      desc: 'Real-time Availability',
      icon: Zap,
      color: 'bg-red-50 text-[#C62828] border-red-100',
    },
    {
      title: 'Compare & Plan',
      desc: 'Make Better Decisions',
      icon: BarChart3,
      color: 'bg-purple-50 text-purple-600 border-purple-100',
    },
    {
      title: 'Campaign Support',
      desc: 'From Planning to Go-Live',
      icon: Layers,
      color: 'bg-orange-50 text-orange-600 border-orange-100',
    },
    {
      title: 'Detailed Insights',
      desc: 'Traffic, Audience & More',
      icon: TrendingUp,
      color: 'bg-cyan-50 text-cyan-700 border-cyan-100',
    },
  ];

  // Filtered catalog
  const filteredCatalog = catalog.filter((item) => {
    if (activeFilter !== 'all') {
      if (activeFilter === 'billboard' && item.medium !== 'billboard' && item.medium !== 'outdoor_hoarding') return false;
      if (activeFilter === 'digital_screen' && item.medium !== 'digital_screen') return false;
      if (activeFilter === 'transit' && item.medium !== 'transit' && item.medium !== 'metro') return false;
      if (activeFilter === 'airport' && item.medium !== 'airport') return false;
      if (activeFilter === 'indoor_mall_screen' && item.medium !== 'indoor_mall_screen') return false;
      if (activeFilter === 'taxi' && item.medium !== 'led_truck' && item.medium !== 'transit') return false;
    }
    if (selectedMediaType !== 'all' && item.medium !== selectedMediaType) return false;
    if (selectedCity !== 'all' && item.city.toLowerCase() !== selectedCity.toLowerCase()) return false;
    if (searchLocation.trim()) {
      const q = searchLocation.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchCity = item.city.toLowerCase().includes(q);
      const matchAddr = item.address?.toLowerCase().includes(q) || false;
      if (!matchTitle && !matchCity && !matchAddr) return false;
    }
    return true;
  });

  const featuredSpaces = catalog.filter((c) => c.featured).slice(0, 4);

  const handleInstantSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentView('browse');
  };

  // Estimator Calculations
  const estTotalImpressions = Math.round(calcBudget * 380 * (calcDuration / 30));
  const estUniqueReach = Math.round(estTotalImpressions * 0.28);
  const estCpm = ((calcBudget / estTotalImpressions) * 1000).toFixed(2);

  return (
    <div className="space-y-8 select-none">
      {/* 1. HERO SECTION WITH WATERFRONT SKYLINE BANNER (EXACTLY MATCHING USER SCREENSHOT) */}
      <section className="relative rounded-3xl overflow-hidden shadow-sm border border-neutral-200/90">
        <div className="relative min-h-[480px] sm:min-h-[520px] lg:min-h-[540px] w-full flex flex-col justify-between p-6 sm:p-10 lg:p-12">
          {/* Panoramic Skyline Image with waterfront and large Rolex/Brand DOOH display */}
          <img
            src="/src/assets/images/ooh_city_hero_1790793829648.jpg"
            alt="Global city skyline at dusk with giant curved digital billboard overlooking waterfront"
            className="absolute inset-0 size-full object-cover object-center"
            referrerPolicy="no-referrer"
          />

          {/* Measured Dark Scrim for High Legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/85 via-neutral-950/60 to-neutral-950/30 backdrop-blur-[0.5px]" />

          {/* Top Hero Text */}
          <div className="relative z-10 space-y-4 max-w-2xl">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-xs font-medium shadow-xs">
              <span>Global OOH & DOOH Marketplace</span>
              <span className="text-white/60">•</span>
              <span className="text-white">27,000+ spaces live & bookable</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white font-display tracking-tight leading-[1.08] text-balance">
              Turn Locations into Opportunities
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-neutral-200 max-w-xl font-normal leading-relaxed">
              Find and book verified billboards, airport displays, transit networks and digital screens. Plan, compare and launch your campaign in 1-click.
            </p>

            {/* Two Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCurrentView('browse')}
                className="h-11 px-6 rounded-2xl bg-[#C62828] hover:bg-[#B71C1C] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 active:scale-98 cursor-pointer"
              >
                <span>Browse Spaces</span>
                <ArrowRight className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsAiModalOpen(true)}
                className="h-11 px-5 rounded-2xl bg-black/40 hover:bg-black/60 text-white border border-white/30 backdrop-blur-md font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="size-4 text-amber-400" />
                <span>Plan Campaign (AI)</span>
              </button>
            </div>
          </div>

          {/* Bottom Filter Pills Bar (Floating inside Hero Card at bottom-left) */}
          <div className="relative z-10 pt-8">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {FILTER_TABS.map((tab) => {
                const isSelected = activeFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveFilter(tab.id)}
                    className={`px-4.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all select-none cursor-pointer ${
                      isSelected
                        ? 'bg-[#C62828] text-white shadow-sm font-bold'
                        : 'bg-white/80 hover:bg-white text-neutral-800 backdrop-blur-md border border-white/40'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2. SEARCH FILTER ROW (MATCHING LABELS AT BOTTOM OF SCREENSHOT) */}
        <div className="bg-white border-t border-neutral-100 p-4 sm:p-5 shadow-xs">
          <form
            onSubmit={handleInstantSearch}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end"
          >
            <div className="lg:col-span-4 space-y-1">
              <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                SEARCH LOCATION OR KEYWORD
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                <input
                  type="text"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  placeholder="e.g. Bandra, Sheikh Zayed, Times Square, LED"
                  className="w-full h-11 pl-9 pr-3 rounded-xl border border-neutral-200 bg-neutral-50/70 hover:bg-neutral-50 focus:bg-white text-xs font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#C62828]/20 focus:border-[#C62828] transition-all"
                />
              </div>
            </div>

            <div className="lg:col-span-3 space-y-1">
              <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                MEDIA TYPE
              </label>
              <select
                value={selectedMediaType}
                onChange={(e) => setSelectedMediaType(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-neutral-200 bg-neutral-50/70 hover:bg-neutral-50 focus:bg-white text-xs font-semibold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#C62828]/20 focus:border-[#C62828]"
              >
                <option value="all">All Media Types</option>
                <option value="digital_screen">Digital Screen (DOOH)</option>
                <option value="billboard">Highway Unipole / Billboard</option>
                <option value="transit">Transit & Metro Stations</option>
                <option value="airport">Airport Spectaculars</option>
                <option value="indoor_mall_screen">Luxury Mall Atriums</option>
                <option value="second_hand">Resale / Second-Hand</option>
              </select>
            </div>

            <div className="lg:col-span-3 space-y-1">
              <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                CITY / MARKET
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-neutral-200 bg-neutral-50/70 hover:bg-neutral-50 focus:bg-white text-xs font-semibold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#C62828]/20 focus:border-[#C62828]"
              >
                <option value="all">Global (All Cities)</option>
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

            <div className="lg:col-span-2">
              <button
                type="submit"
                className="w-full h-11 rounded-xl bg-[#C62828] hover:bg-[#B71C1C] text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
              >
                <Search className="size-4" />
                <span>Search Spaces</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* 3. 5 VALUE PROPOSITION CARDS */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {VALUE_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="p-3.5 sm:p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs hover:border-neutral-300 hover:shadow-xs transition-all flex items-center gap-3 group"
            >
              <div className={`size-10 rounded-xl grid place-items-center shrink-0 border ${card.color}`}>
                <Icon className="size-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-bold text-neutral-900 truncate">{card.title}</h3>
                <p className="text-[11px] text-neutral-500 truncate">{card.desc}</p>
              </div>
            </div>
          );
        })}
      </section>

      {/* 4. FEATURED SPACES SECTION */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-neutral-900 font-display tracking-tight">
                Featured Spaces
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-[#C62828] border border-red-100">
                Handpicked
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
              Handpicked high-impact locations for your next campaign flight.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex rounded-xl border border-neutral-200 p-0.5 bg-neutral-100 text-xs">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'list' ? 'bg-white text-neutral-900 shadow-2xs font-bold' : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <List className="size-3.5" />
                <span>List View</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('map')}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'map' ? 'bg-white text-neutral-900 shadow-2xs font-bold' : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <Map className="size-3.5" />
                <span>Map View</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setCurrentView('browse')}
              className="text-xs font-bold text-[#C62828] hover:text-[#B71C1C] flex items-center gap-1 cursor-pointer"
            >
              <span>View All Spaces</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>
        </div>

        {/* View Mode */}
        {viewMode === 'list' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {featuredSpaces.map((item) => (
              <ListingCard key={item.id} listing={item} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-neutral-200 overflow-hidden bg-neutral-950 p-6 text-white min-h-[380px] flex flex-col justify-between relative shadow-md">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-bold text-amber-400">
                <MapPin className="size-4" />
                <span>Interactive Global Hub GPS Matrix</span>
              </span>
              <span className="text-neutral-400 font-mono">Real-Time Sensor Feeds Active</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-auto py-6">
              {featuredSpaces.map((sp) => (
                <div
                  key={sp.id}
                  onClick={() => setSelectedListingForDetail(sp)}
                  className="p-3.5 rounded-2xl bg-neutral-900/90 border border-neutral-800 hover:border-[#C62828] cursor-pointer transition-all space-y-1"
                >
                  <span className="text-[10px] font-bold text-[#C62828] uppercase">{sp.city}</span>
                  <h4 className="text-xs font-bold text-white truncate">{sp.title}</h4>
                  <p className="text-[11px] text-emerald-400 font-semibold">{sp.dailyImpressions}</p>
                </div>
              ))}
            </div>

            <div className="text-xs text-neutral-400 flex items-center justify-between">
              <span>Click on any hub card to inspect line-of-sight and camera proof</span>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className="text-xs font-bold text-white underline cursor-pointer"
              >
                Back to Grid View
              </button>
            </div>
          </div>
        )}
      </section>

      {/* 5. BUDGET REACH ESTIMATOR */}
      <section className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-red-50 text-[#C62828]">
                <TrendingUp className="size-4" />
              </span>
              <h3 className="text-base sm:text-lg font-bold text-neutral-900 font-display">
                Campaign Budget Estimator & Audience Reach Calculator
              </h3>
            </div>
            <p className="text-xs text-neutral-500">
              Calculate projected vehicular and pedestrian impressions, unique reach, and effective blended CPM in real-time.
            </p>
          </div>
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-auto">
            Telemetry Grounded
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-5">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-neutral-700">Campaign Flight Budget ($ USD)</span>
                <span className="text-base font-black text-[#C62828] font-display">
                  ${calcBudget.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min={1000}
                max={50000}
                step={500}
                value={calcBudget}
                onChange={(e) => setCalcBudget(Number(e.target.value))}
                className="w-full cursor-pointer accent-[#C62828]"
              />
              <div className="flex justify-between text-[10px] text-neutral-400">
                <span>$1,000 (Local Flash)</span>
                <span>$25,000</span>
                <span>$50,000 (City Roadblock)</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-neutral-700">Flight Duration</span>
                <span className="text-sm font-bold text-neutral-900 font-display">
                  {calcDuration} Days ({Math.round(calcDuration / 7)} Weeks)
                </span>
              </div>
              <input
                type="range"
                min={7}
                max={90}
                step={7}
                value={calcDuration}
                onChange={(e) => setCalcDuration(Number(e.target.value))}
                className="w-full cursor-pointer accent-[#C62828]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-700">Target Metropolitan Hub</label>
                <select
                  value={calcCity}
                  onChange={(e) => setCalcCity(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-neutral-200 text-xs bg-neutral-50 text-neutral-800"
                >
                  <option value="Dubai">Dubai, UAE</option>
                  <option value="Mumbai">Mumbai, India</option>
                  <option value="New York">New York, USA</option>
                  <option value="London">London, UK</option>
                  <option value="Tokyo">Tokyo, Japan</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-700">Audience Segment</label>
                <select className="w-full h-9 px-3 rounded-xl border border-neutral-200 text-xs bg-neutral-50 text-neutral-800">
                  <option>Executive Commuters & Drivers</option>
                  <option>Luxury Mall Shoppers</option>
                  <option>International Airport Travelers</option>
                  <option>Urban Metro Commuters</option>
                </select>
              </div>
            </div>
          </div>

          {/* Result Card */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-neutral-50/90 border border-neutral-200 flex flex-col justify-between gap-4">
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                Estimated Delivery Forecast ({calcCity})
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-white border border-neutral-200 shadow-2xs">
                  <span className="text-[10px] text-neutral-500 block mb-0.5">Est. Total Impressions</span>
                  <strong className="text-lg font-black text-neutral-900 font-display block">
                    {estTotalImpressions.toLocaleString()}+
                  </strong>
                  <span className="text-[10px] text-emerald-600 font-semibold">100% verified passes</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-neutral-200 shadow-2xs">
                  <span className="text-[10px] text-neutral-500 block mb-0.5">Unique Reach</span>
                  <strong className="text-lg font-black text-[#C62828] font-display block">
                    {estUniqueReach.toLocaleString()}
                  </strong>
                  <span className="text-[10px] text-neutral-400">Unique commuters</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-neutral-200 shadow-2xs">
                  <span className="text-[10px] text-neutral-500 block mb-0.5">Calculated CPM</span>
                  <strong className="text-base font-black text-neutral-900 font-display block">
                    ${estCpm}
                  </strong>
                  <span className="text-[10px] text-neutral-400">Industry avg: $4.50</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-neutral-200 shadow-2xs">
                  <span className="text-[10px] text-neutral-500 block mb-0.5">Brand Lift Rate</span>
                  <strong className="text-base font-black text-emerald-600 font-display block">
                    +24% Recall
                  </strong>
                  <span className="text-[10px] text-neutral-400">High repetition</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCurrentView('browse')}
              className="w-full h-10 rounded-xl bg-[#C62828] hover:bg-[#B71C1C] text-white text-xs font-bold shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>View Spaces in {calcCity} under ${calcBudget.toLocaleString()}</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 6. FLOATING RED AI MEDIA PLANNER BUTTON (BOTTOM RIGHT AS IN SCREENSHOT) */}
      <div className="fixed bottom-6 right-6 z-40 select-none">
        <button
          type="button"
          onClick={() => setIsAiModalOpen(true)}
          className="group flex items-center gap-3 px-4.5 py-3 rounded-2xl bg-[#C62828] hover:bg-[#B71C1C] text-white shadow-xl hover:shadow-2xl transition-all duration-200 border border-white/20 active:scale-98 cursor-pointer"
        >
          <div className="size-9 rounded-xl bg-white/20 grid place-items-center shrink-0">
            <Bot className="size-5 text-white" />
          </div>
          <div className="text-left">
            <span className="text-xs font-black block leading-tight font-display">AI Media Planner</span>
            <span className="text-[10px] text-white/80 block leading-tight">
              Instant Flight Allocation
            </span>
          </div>
        </button>
      </div>

      {/* AI Planner Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-neutral-200">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-xl bg-red-50 text-[#C62828] grid place-items-center">
                  <Bot className="size-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-neutral-900 font-display">AI Media Flight Planner</h3>
                  <p className="text-[11px] text-neutral-500">Autonomous OOH slot allocation & budget optimization</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAiModalOpen(false)}
                className="size-8 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 grid place-items-center"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-neutral-700">Campaign Flight Objective</label>
                <select className="w-full h-9 px-3 rounded-xl border border-neutral-200 text-xs bg-neutral-50">
                  <option>Mass Arterial Highway Reach (Maximum Impressions)</option>
                  <option>Luxury Shoppers (Dubai Mall & Paris Flagships)</option>
                  <option>Viral 3D Anamorphic Video (Times Square & Shibuya)</option>
                  <option>Corporate B2B / C-Suite (Airport Concourses)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-700">Flight Budget ($ USD)</label>
                  <input
                    type="number"
                    defaultValue={10000}
                    className="w-full h-9 px-3 rounded-xl border border-neutral-200 text-xs bg-neutral-50 font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-700">Target Market</label>
                  <select className="w-full h-9 px-3 rounded-xl border border-neutral-200 text-xs bg-neutral-50">
                    <option>Dubai, UAE</option>
                    <option>Mumbai, India</option>
                    <option>New York, USA</option>
                    <option>London, UK</option>
                    <option>Tokyo, Japan</option>
                  </select>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1 text-[11px] text-neutral-600">
                <div className="font-bold text-neutral-800">AI Recommendation Engine:</div>
                <p>Allocates 60% Highway Arterial Unipoles + 40% Digital Screen Loops for maximum recall lift.</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAiModalOpen(false)}
                  className="h-9 px-3.5 rounded-xl border border-neutral-200 text-neutral-700 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAiModalOpen(false);
                    setCurrentView('browse');
                    toast.success('AI plan applied! Showing recommended high-impact media spaces.');
                  }}
                  className="h-9 px-4 rounded-xl bg-[#C62828] hover:bg-[#B71C1C] text-white font-bold text-xs"
                >
                  Generate Plan & Show Spaces
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
