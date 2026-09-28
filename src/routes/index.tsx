import React, { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
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
  Heart,
  Scale,
  Eye,
  Bot,
  Map,
  List,
  CheckCircle2,
  Calendar,
  Building,
  Clock,
  ChevronRight,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import { MOCK_CATALOG, type ExtendedListing } from "@/data/mockCatalog";
import { useEcom } from "@/context/EcomContext";
import { AIMediaPlannerModal } from "@/components/dashboard/AIMediaPlannerModal";
import { BudgetReachEstimator } from "@/components/dashboard/BudgetReachEstimator";
import { CampaignTimelinePlanner } from "@/components/dashboard/CampaignTimelinePlanner";
import { InteractiveMapView } from "@/components/dashboard/InteractiveMapView";
import heroSkylineImage from "@/assets/images/hero_ooh_skyline_billboard_1790496885980.jpg";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mark@Ads — Find & Book Advertising Spaces Worldwide" },
      {
        name: "description",
        content:
          "Global OOH & DOOH marketplace to find, compare and book verified billboards, airport displays, transit networks, mall LED screens, and digital spectaculars worldwide.",
      },
      { property: "og:title", content: "Mark@Ads — Find & Book Advertising Spaces Worldwide" },
      {
        property: "og:description",
        content:
          "Turn locations into opportunities. Plan, compare and launch high-impact billboard and DOOH campaigns in 1-click.",
      },
    ],
  }),
  component: DashboardHome,
});

function DashboardHome() {
  const navigate = useNavigate();
  const {
    setSelectedListingForDetail,
    wishlist,
    toggleWishlist,
    isWishlisted,
    toggleCompare,
    isCompared,
    formatMoney,
  } = useEcom();

  // Search Filter state
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchLocation, setSearchLocation] = useState<string>("");
  const [selectedMediaType, setSelectedMediaType] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedBudget, setSelectedBudget] = useState<string>("all");
  const [selectedDuration, setSelectedDuration] = useState<string>("1_month");

  // View state
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [aiPlannerOpen, setAiPlannerOpen] = useState<boolean>(false);

  // Quick Filter Tabs matching mockup
  const FILTER_TABS = [
    { id: "all", label: "All Spaces", icon: null },
    { id: "billboard", label: "Billboards", icon: null },
    { id: "digital_screen", label: "Digital LED", icon: null },
    { id: "transit", label: "Transit & Metro", icon: null },
    { id: "airport", label: "Airports", icon: null },
    { id: "mall", label: "Malls", icon: null },
    { id: "taxi", label: "Taxi Ads", icon: null },
  ];

  // Value Proposition Cards
  const VALUE_CARDS = [
    {
      title: "Verified Spaces",
      desc: "100% Genuine Inventory",
      icon: ShieldCheck,
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
      title: "Instant Booking",
      desc: "Real-time Availability",
      icon: Zap,
      color: "bg-red-50 text-[#C62828] border-red-100",
    },
    {
      title: "Compare & Plan",
      desc: "Make Better Decisions",
      icon: BarChart3,
      color: "bg-purple-50 text-purple-600 border-purple-100",
    },
    {
      title: "Campaign Support",
      desc: "From Planning to Go-Live",
      icon: Layers,
      color: "bg-orange-50 text-orange-600 border-orange-100",
    },
    {
      title: "Detailed Insights",
      desc: "Traffic, Audience & More",
      icon: TrendingUp,
      color: "bg-cyan-50 text-cyan-700 border-cyan-100",
    },
  ];

  // Featured 4 spaces matching the mockup
  const featuredSpaces = MOCK_CATALOG.slice(0, 4);

  // Filtered catalog items based on user selection
  const filteredCatalog = MOCK_CATALOG.filter((item) => {
    if (activeFilter !== "all" && item.medium !== activeFilter) {
      // Map digital_screen or billboard flexibly
      if (activeFilter === "digital_screen" && item.medium !== "digital_screen") return false;
      if (activeFilter === "billboard" && item.medium !== "billboard") return false;
      if (activeFilter === "airport" && item.medium !== "airport") return false;
      if (activeFilter === "mall" && item.medium !== "mall") return false;
      if (activeFilter === "transit" && item.medium !== "transit") return false;
    }
    if (selectedMediaType !== "all" && item.medium !== selectedMediaType) return false;
    if (selectedCity !== "all" && item.city.toLowerCase() !== selectedCity.toLowerCase())
      return false;
    if (searchLocation.trim()) {
      const q = searchLocation.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchCity = item.city.toLowerCase().includes(q);
      const matchAddr = item.address?.toLowerCase().includes(q) || false;
      if (!matchTitle && !matchCity && !matchAddr) return false;
    }
    return true;
  });

  const handleInstantSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      to: "/browse",
      search: {
        search: searchLocation || undefined,
        city: selectedCity !== "all" ? selectedCity : undefined,
        medium: selectedMediaType !== "all" ? selectedMediaType : undefined,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-neutral-900 flex flex-col font-sans selection:bg-red-100 selection:text-[#C62828]">
      {/* Top Navigation */}
      <SiteHeader />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-6 space-y-8 sm:space-y-10">
        {/* HERO SECTION WITH CURVED PANORAMIC BANNER */}
        <section className="relative rounded-3xl overflow-hidden shadow-sm border border-neutral-200/90">
          {/* Background Visual Banner Image with Scrim */}
          <div className="relative min-h-[460px] sm:min-h-[520px] lg:min-h-[540px] w-full flex flex-col justify-between p-6 sm:p-10 lg:p-12">
            <img
              src={heroSkylineImage}
              alt="Global city skyline at dusk with iconic digital billboard"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            {/* Measured Dark Scrim for high legibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/85 via-neutral-950/65 to-neutral-950/40 backdrop-blur-[0.5px]" />

            {/* Top Badge & Subtitle */}
            <div className="relative z-10 space-y-4 max-w-2xl animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-semibold shadow-xs">
                <span className="size-2 rounded-full bg-[#C62828] animate-ping" />
                <span className="font-bold">Global OOH & DOOH Marketplace</span>
                <span className="text-white/60">•</span>
                <span className="text-white/90">27,000+ spaces live & bookable</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-display tracking-tight leading-[1.1] text-balance">
                Turn Locations into Opportunities
              </h1>

              <p className="text-sm sm:text-base text-neutral-200 max-w-xl font-normal leading-relaxed">
                Find and book verified billboards, airport displays, transit networks and digital
                screens. Plan, compare and launch your campaign in 1-click.
              </p>

              {/* CTAs */}
              <div className="flex items-center gap-3 pt-2">
                <Button
                  asChild
                  size="lg"
                  className="h-11 px-6 text-xs font-bold bg-[#C62828] hover:bg-[#B71C1C] text-white shadow-md rounded-xl transition-transform active:scale-98"
                >
                  <Link to="/browse">
                    <span>Browse Spaces</span>
                    <ArrowRight className="size-4 ml-1.5" />
                  </Link>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setAiPlannerOpen(true)}
                  className="h-11 px-5 text-xs font-bold bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-md rounded-xl shadow-xs gap-2"
                >
                  <Sparkles className="size-4 text-amber-400" />
                  <span>Plan Campaign (AI)</span>
                </Button>
              </div>
            </div>

            {/* QUICK FILTER BAR INSIDE HERO */}
            <div className="relative z-10 pt-8">
              <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none">
                {FILTER_TABS.map((tab) => {
                  const isSelected = activeFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveFilter(tab.id)}
                      className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all select-none ${
                        isSelected
                          ? "bg-[#C62828] text-white shadow-sm font-bold scale-102"
                          : "bg-white/80 hover:bg-white text-neutral-800 backdrop-blur-md border border-white/40"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SMART SEARCH PANEL (FLOATING OVER BOTTOM OF BANNER) */}
          <div className="bg-white border-t border-neutral-100 p-4 sm:p-5 shadow-xs">
            <form
              onSubmit={handleInstantSearch}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end"
            >
              {/* Location Input (4 cols) */}
              <div className="lg:col-span-4 space-y-1">
                <label className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider block">
                  Search location or keyword
                </label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                  <input
                    type="text"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    placeholder="e.g. Bandra, Dubai, Times Square, LED"
                    className="w-full h-11 pl-9 pr-3 rounded-xl border border-neutral-200 bg-neutral-50/70 hover:bg-neutral-50 focus:bg-white text-xs font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#C62828]/20 focus:border-[#C62828] transition-all"
                  />
                </div>
              </div>

              {/* Media Type Dropdown (3 cols) */}
              <div className="lg:col-span-3 space-y-1">
                <label className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider block">
                  Media Type
                </label>
                <select
                  value={selectedMediaType}
                  onChange={(e) => setSelectedMediaType(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-neutral-200 bg-neutral-50/70 hover:bg-neutral-50 focus:bg-white text-xs font-semibold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#C62828]/20 focus:border-[#C62828] transition-all"
                >
                  <option value="all">All Media Types</option>
                  <option value="digital_screen">Digital Screen (DOOH)</option>
                  <option value="billboard">Highway Unipole / Billboard</option>
                  <option value="transit">Transit & Metro Stations</option>
                  <option value="airport">Airport Spectaculars</option>
                  <option value="mall">Luxury Mall Atriums</option>
                </select>
              </div>

              {/* City Dropdown (3 cols) */}
              <div className="lg:col-span-3 space-y-1">
                <label className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider block">
                  City / Market
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-neutral-200 bg-neutral-50/70 hover:bg-neutral-50 focus:bg-white text-xs font-semibold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#C62828]/20 focus:border-[#C62828] transition-all"
                >
                  <option value="all">Global (All Cities)</option>
                  <option value="Dubai">Dubai, UAE</option>
                  <option value="Mumbai">Mumbai, India</option>
                  <option value="New York">New York, USA</option>
                  <option value="London">London, UK</option>
                  <option value="Tokyo">Tokyo, Japan</option>
                  <option value="Singapore">Singapore</option>
                </select>
              </div>

              {/* Action Search Button (2 cols) */}
              <div className="lg:col-span-2">
                <Button
                  type="submit"
                  className="w-full h-11 text-xs font-bold bg-[#C62828] hover:bg-[#B71C1C] text-white shadow-sm rounded-xl gap-2 transition-transform active:scale-98"
                >
                  <Search className="size-4" />
                  <span>Search Spaces</span>
                </Button>
              </div>
            </form>
          </div>
        </section>

        {/* 5 DASHBOARD VALUE PILL CARDS */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {VALUE_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="p-3.5 sm:p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs hover:border-neutral-300 hover:shadow-xs transition-all flex items-center gap-3 group"
              >
                <div
                  className={`size-10 rounded-xl grid place-items-center shrink-0 border ${card.color}`}
                >
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

        {/* FEATURED SPACES SECTION WITH MAP VIEW / LIST VIEW TOGGLE */}
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
                Handpicked high-impact locations for your next campaign.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto">
              {/* Map View / List View Toggle Button */}
              <div className="inline-flex rounded-xl border border-neutral-200 p-0.5 bg-neutral-100 text-xs">
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                    viewMode === "list"
                      ? "bg-white text-neutral-900 shadow-2xs font-bold"
                      : "text-neutral-500 hover:text-neutral-800"
                  }`}
                >
                  <List className="size-3.5" />
                  <span>List View</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("map")}
                  className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                    viewMode === "map"
                      ? "bg-white text-neutral-900 shadow-2xs font-bold"
                      : "text-neutral-500 hover:text-neutral-800"
                  }`}
                >
                  <Map className="size-3.5" />
                  <span>Map View</span>
                </button>
              </div>

              <Link
                to="/browse"
                className="text-xs font-bold text-[#C62828] hover:text-[#B71C1C] flex items-center gap-1"
              >
                <span>View All Spaces</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>

          {/* VIEW SWITCHER: LIST GRID VS INTERACTIVE MAP */}
          {viewMode === "map" ? (
            <InteractiveMapView
              listings={featuredSpaces}
              onSelectListing={(item) => setSelectedListingForDetail(item)}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {featuredSpaces.map((item) => {
                const wish = isWishlisted(item.id);
                return (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-neutral-200/90 bg-white overflow-hidden shadow-2xs hover:shadow-md hover:border-neutral-300 transition-all flex flex-col justify-between group"
                  >
                    {/* Media Image & Floating Badges */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                        loading="lazy"
                      />

                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold text-neutral-800 bg-white/95 backdrop-blur-xs shadow-xs capitalize">
                          {item.medium === "digital_screen"
                            ? "Digital LED"
                            : item.medium === "mall"
                              ? "Indoor Mall"
                              : item.medium === "airport"
                                ? "Airport"
                                : "Billboard"}
                        </span>
                        {item.featured && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold text-white bg-[#C62828] shadow-xs flex items-center gap-1">
                            <span>★</span>
                            <span>Featured</span>
                          </span>
                        )}
                      </div>

                      {/* Wishlist Heart Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(item.id);
                        }}
                        className="absolute top-2.5 right-2.5 size-7 rounded-full bg-white/95 backdrop-blur-xs text-neutral-700 hover:text-[#C62828] grid place-items-center shadow-xs transition-colors"
                        aria-label="Save to favorites"
                      >
                        <Heart
                          className={`size-3.5 ${wish ? "fill-[#C62828] text-[#C62828]" : ""}`}
                        />
                      </button>

                      {/* Live Availability Pill */}
                      <div className="absolute bottom-2 left-2.5 px-2 py-0.5 rounded-md bg-neutral-900/80 backdrop-blur-xs text-white text-[9px] font-semibold flex items-center gap-1">
                        <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Live & Available</span>
                      </div>
                    </div>

                    {/* Card Content Body */}
                    <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <h3 className="text-xs sm:text-sm font-bold text-neutral-900 truncate">
                          {item.title}
                        </h3>
                        <p className="text-[11px] text-neutral-500 flex items-center gap-1">
                          <MapPin className="size-3 text-neutral-400 shrink-0" />
                          <span className="truncate">
                            {item.city}, {item.country}
                          </span>
                        </p>
                      </div>

                      {/* Footfall & Audience Stats */}
                      <div className="flex items-center justify-between text-[10px] text-neutral-500 pt-1 border-t border-neutral-100">
                        <span className="flex items-center gap-1">
                          <Eye className="size-3 text-neutral-400" />
                          <strong className="text-neutral-700 font-semibold">
                            {item.daily_impressions || "500K+ daily"}
                          </strong>
                        </span>
                        <span className="truncate max-w-[110px]">
                          {item.audience_tag || "Premium Audience"}
                        </span>
                      </div>

                      {/* Price & Action Button */}
                      <div className="pt-2 border-t border-neutral-100 flex items-center justify-between gap-2">
                        <div>
                          <span className="text-sm sm:text-base font-black text-[#C62828] font-display">
                            ${item.price_per_day || 250}
                          </span>
                          <span className="text-[11px] text-neutral-400 font-medium"> / day</span>
                        </div>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedListingForDetail(item)}
                          className="h-7.5 px-2.5 text-[11px] font-bold border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 text-neutral-800 rounded-lg gap-1"
                        >
                          <span>View Details</span>
                          <ChevronRight className="size-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* AI RECOMMENDED SPACES SECTION */}
        <section className="rounded-2xl border border-neutral-200/90 bg-white p-5 sm:p-7 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-amber-50 text-amber-600">
                  <Sparkles className="size-4" />
                </span>
                <h3 className="text-base sm:text-lg font-bold text-neutral-900 font-display">
                  Recommended Spaces AI
                </h3>
              </div>
              <p className="text-xs text-neutral-500">
                Machine-learning matches optimized for maximum visual dwell time and lowest
                effective CPM.
              </p>
            </div>

            <Button
              size="sm"
              onClick={() => setAiPlannerOpen(true)}
              className="h-8 text-xs font-bold bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg shadow-2xs gap-1.5 self-start sm:self-auto"
            >
              <Bot className="size-3.5 text-amber-400" />
              <span>Configure AI Criteria</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MOCK_CATALOG.slice(1, 4).map((space) => (
              <div
                key={`rec-${space.id}`}
                className="p-3.5 rounded-xl border border-neutral-200/80 bg-neutral-50/50 hover:bg-white hover:border-[#C62828]/40 transition-all flex items-center justify-between gap-3 shadow-2xs"
              >
                <img
                  src={space.images[0]}
                  alt={space.title}
                  className="size-16 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-bold text-[#C62828] uppercase">
                      98% Fit Score
                    </span>
                    <span className="text-[10px] text-neutral-400">•</span>
                    <span className="text-[10px] text-neutral-500">{space.city}</span>
                  </div>
                  <h4 className="text-xs font-bold text-neutral-900 truncate">{space.title}</h4>
                  <p className="text-[11px] font-semibold text-emerald-600">
                    ${space.price_per_day || 250}/day • CPM {space.cpm || "$2.40"}
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => setSelectedListingForDetail(space)}
                  className="h-7 text-[11px] font-bold bg-[#C62828] hover:bg-[#B71C1C] text-white px-2.5 rounded-lg shadow-2xs shrink-0"
                >
                  Book
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* CAMPAIGN BUDGET ESTIMATOR & AUDIENCE REACH CALCULATOR */}
        <BudgetReachEstimator />

        {/* END-TO-END CAMPAIGN TIMELINE PLANNER */}
        <CampaignTimelinePlanner />

        {/* RECENTLY VIEWED SPACES TRAY */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              Recently Viewed Spaces
            </h3>
            <Link to="/browse" className="text-xs font-bold text-[#C62828] hover:underline">
              Explore 27,000+ Available Spaces →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {MOCK_CATALOG.slice(0, 4).map((item) => (
              <button
                key={`recent-${item.id}`}
                type="button"
                onClick={() => setSelectedListingForDetail(item)}
                className="text-left p-2.5 rounded-xl border border-neutral-200 bg-white hover:border-neutral-300 transition-all flex items-center gap-2.5 shadow-2xs group"
              >
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="size-11 rounded-lg object-cover shrink-0"
                />
                <div className="min-w-0">
                  <h5 className="text-xs font-bold text-neutral-900 truncate group-hover:text-[#C62828] transition-colors">
                    {item.title}
                  </h5>
                  <span className="text-[10px] text-neutral-500 block truncate">
                    {item.city} • ${item.price_per_day || 250}/d
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* FLOATING AI MEDIA PLANNER ASSISTANT BUTTON */}
      <div className="fixed bottom-6 right-6 z-40 select-none">
        <button
          type="button"
          onClick={() => setAiPlannerOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#C62828] to-[#B71C1C] text-white shadow-xl hover:shadow-2xl hover:scale-103 transition-all duration-200 border border-white/20 active:scale-98"
        >
          <div className="relative">
            <Bot className="size-5 text-white" />
            <span className="absolute -top-1 -right-1 size-2 rounded-full bg-amber-400 animate-ping" />
          </div>
          <div className="text-left hidden sm:block">
            <span className="text-xs font-bold block leading-tight">AI Media Planner</span>
            <span className="text-[10px] text-white/80 block leading-none">
              Instant Flight Allocation
            </span>
          </div>
        </button>
      </div>

      {/* AI Media Planner Modal */}
      <AIMediaPlannerModal isOpen={aiPlannerOpen} onClose={() => setAiPlannerOpen(false)} />
    </div>
  );
}
