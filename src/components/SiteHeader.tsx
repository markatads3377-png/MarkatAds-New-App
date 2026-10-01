import React, { useState } from 'react';
import {
  Menu,
  Search,
  Globe,
  Bell,
  Heart,
  ShoppingCart,
  ChevronDown,
  X,
  Layers,
  Sparkles,
  ShoppingBag,
  Building2,
  ShieldCheck,
  Cloud,
  Compass,
  Bookmark,
  MessageSquare,
  HelpCircle,
  Settings,
  Crown,
} from 'lucide-react';
import { useApp, CURRENCIES } from '../context/AppContext';
import { CurrencyCode } from '../types';

export const SiteHeader: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    role,
    setRole,
    displayName,
    selectedCurrency,
    setSelectedCurrency,
    cart,
    setIsCartOpen,
    wishlist,
    setIsWishlistOpen,
    setIsDeployModalOpen,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: '1', title: 'New Flight Available', desc: 'Times Square Anamorphic 3D slot now open for booking', time: '10m ago' },
    { id: '2', title: 'Daily Sighting Bounty', desc: 'Post a DOOH photo to earn +50 OOH Coins', time: '1h ago' },
    { id: '3', title: 'Cloudflare Connected', desc: 'Git deployment configured for main branch', time: '2h ago' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentView('browse');
  };

  const currentCurrencyObj = CURRENCIES[selectedCurrency] || CURRENCIES.USD;

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white border-b border-neutral-200/80 shadow-2xs select-none">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          {/* Left: Hamburger Menu & Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="size-9 rounded-xl text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>

            <button
              type="button"
              onClick={() => setCurrentView('home')}
              className="flex items-center gap-2.5 group cursor-pointer text-left"
            >
              <div className="size-9 rounded-full bg-[#C62828] text-white font-bold text-xs grid place-items-center shadow-xs">
                MA
              </div>
              <div className="hidden sm:block">
                <span className="font-display text-base font-black tracking-tight text-neutral-900 block leading-tight">
                  Mark@Ads
                </span>
                <span className="text-[10px] font-medium text-neutral-400 block leading-none">
                  Beyond Visibility
                </span>
              </div>
            </button>
          </div>

          {/* Center: Global Search Bar */}
          <div className="flex-1 max-w-xl mx-2 hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search locations, billboards, cities..."
                className="w-full h-10 pl-10 pr-4 rounded-full border border-neutral-200/90 bg-neutral-50/70 hover:bg-neutral-50 focus:bg-white text-xs font-medium text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#C62828]/20 focus:border-[#C62828] transition-all shadow-2xs"
              />
            </form>
          </div>

          {/* Right: Currency Dropdown, Notifications, Wishlist, Cart, User Avatar */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Currency Pill Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                className="h-9 px-3 rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-semibold text-neutral-800 flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
              >
                <Globe className="size-3.5 text-neutral-500" />
                <span>{currentCurrencyObj.name}</span>
                <ChevronDown className="size-3 text-neutral-400 ml-0.5" />
              </button>

              {isCurrencyDropdownOpen && (
                <div className="absolute right-0 top-11 w-44 bg-white rounded-2xl border border-neutral-200 shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95">
                  {Object.values(CURRENCIES).map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => {
                        setSelectedCurrency(c.code);
                        setIsCurrencyDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between ${
                        selectedCurrency === c.code
                          ? 'bg-red-50 text-[#C62828] font-bold'
                          : 'text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      <span>{c.name}</span>
                      <span className="font-mono text-neutral-400">{c.symbol}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="size-9 rounded-full text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 flex items-center justify-center relative cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="size-4.5" />
                <span className="absolute top-2 right-2 size-2 rounded-full bg-[#C62828] ring-2 ring-white" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-11 w-72 bg-white rounded-2xl border border-neutral-200 shadow-xl p-3 space-y-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                    <span className="text-xs font-bold text-neutral-900">Notifications</span>
                    <span className="text-[10px] text-neutral-400">3 New</span>
                  </div>
                  <div className="space-y-1">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-2 rounded-lg hover:bg-neutral-50 text-xs space-y-0.5">
                        <div className="font-semibold text-neutral-800">{n.title}</div>
                        <div className="text-[11px] text-neutral-500 leading-snug">{n.desc}</div>
                        <div className="text-[9px] text-neutral-400">{n.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Wishlist Heart with count badge */}
            <button
              type="button"
              onClick={() => setIsWishlistOpen(true)}
              className="size-9 rounded-full text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 flex items-center justify-center relative cursor-pointer"
              aria-label="Saved Spaces"
            >
              <Heart className="size-4.5" />
              <span className="absolute -top-0.5 -right-0.5 size-4 rounded-full bg-[#C62828] text-white text-[9px] font-bold grid place-items-center ring-2 ring-white">
                {wishlist.length > 0 ? wishlist.length : 3}
              </span>
            </button>

            {/* Cart with count badge */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="size-9 rounded-full text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 flex items-center justify-center relative cursor-pointer"
              aria-label="Campaign Cart"
            >
              <ShoppingCart className="size-4.5" />
              <span className="absolute -top-0.5 -right-0.5 size-4 rounded-full bg-neutral-300 text-neutral-700 text-[9px] font-bold grid place-items-center ring-2 ring-white">
                {cart.length}
              </span>
            </button>

            {/* User Profile Avatar (Solid Red Circle with "AP" as in reference image) */}
            <button
              type="button"
              onClick={() => setCurrentView(role === 'seller' ? 'seller' : role === 'admin' ? 'admin' : 'buyer')}
              className="size-9 rounded-full bg-[#C62828] hover:bg-[#B71C1C] text-white font-bold text-xs grid place-items-center shadow-xs transition-transform active:scale-95 cursor-pointer ml-0.5"
              title={`Active Profile: ${displayName} (${role}) - Click to open console`}
            >
              AP
            </button>
          </div>
        </div>

        {/* Mobile Search Bar below header */}
        <div className="p-2.5 border-t border-neutral-100 md:hidden bg-neutral-50/50">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search locations, billboards, cities..."
              className="w-full h-8.5 pl-8 pr-3 rounded-full border border-neutral-200 bg-white text-xs font-medium placeholder:text-neutral-400 focus:outline-none"
            />
          </form>
        </div>
      </header>

      {/* Hamburger Drawer Menu */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden select-none">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
          />

          <aside className="fixed inset-y-0 left-0 w-72 sm:w-80 bg-white border-r border-neutral-200 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-250 z-50">
            {/* Header */}
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-full bg-[#C62828] text-white font-bold text-xs grid place-items-center shadow-xs">
                  MA
                </div>
                <div>
                  <span className="font-display text-base font-bold text-neutral-900 block leading-tight">
                    Mark@Ads
                  </span>
                  <span className="text-[10px] font-medium text-neutral-400 block">
                    Beyond Visibility
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                className="size-8 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 grid place-items-center"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Menu Links */}
            <div className="p-3 space-y-1 flex-1 overflow-y-auto text-xs">
              <div className="space-y-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentView('home');
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold transition-all ${
                    currentView === 'home' ? 'bg-red-50 text-[#C62828] font-bold' : 'text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  <Compass className="size-4" />
                  <span>Home Overview</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentView('browse');
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold transition-all ${
                    currentView === 'browse' ? 'bg-red-50 text-[#C62828] font-bold' : 'text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  <Layers className="size-4" />
                  <span>Browse Media Catalog</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentView('feed');
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold transition-all ${
                    currentView === 'feed' ? 'bg-red-50 text-[#C62828] font-bold' : 'text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  <Sparkles className="size-4 text-amber-500" />
                  <span>Community Feed & Sightings</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentView('pricing');
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold transition-all ${
                    currentView === 'pricing' ? 'bg-red-50 text-[#C62828] font-bold' : 'text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  <Crown className="size-4 text-amber-500" />
                  <span>Plans & Pricing</span>
                </button>
              </div>

              {/* Console Switching Section */}
              <div className="pt-3 mt-3 border-t border-neutral-100 space-y-1">
                <span className="px-3.5 text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                  Platform Consoles
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setRole('buyer');
                    setCurrentView('buyer');
                    setIsSidebarOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-neutral-700 hover:bg-neutral-50 font-semibold"
                >
                  <ShoppingBag className="size-4 text-blue-500" />
                  <span>Advertiser & Buyer Console</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRole('seller');
                    setCurrentView('seller');
                    setIsSidebarOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-neutral-700 hover:bg-neutral-50 font-semibold"
                >
                  <Building2 className="size-4 text-amber-500" />
                  <span>Media Owner & Seller Console</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRole('admin');
                    setCurrentView('admin');
                    setIsSidebarOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-neutral-700 hover:bg-neutral-50 font-semibold"
                >
                  <ShieldCheck className="size-4 text-[#C62828]" />
                  <span>Master Operations Admin</span>
                </button>
              </div>

              {/* Deployment Guide */}
              <div className="pt-3 mt-3 border-t border-neutral-100 space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsDeployModalOpen(true);
                    setIsSidebarOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-orange-700 bg-orange-50/70 hover:bg-orange-100 font-bold"
                >
                  <Cloud className="size-4 text-orange-500" />
                  <span>Cloudflare & GitHub Setup</span>
                </button>
              </div>
            </div>

            {/* Bottom Upgrade Card */}
            <div className="p-4 m-3 rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/20 space-y-2.5">
              <div className="flex items-center gap-2 text-[#C62828]">
                <Crown className="size-4 fill-amber-500 text-amber-500" />
                <span className="font-display font-bold text-xs text-neutral-900">Upgrade to Pro</span>
              </div>
              <p className="text-[11px] text-neutral-600 leading-relaxed">
                Get exclusive deals, priority booking, live sensor tracking, and concierge campaign support.
              </p>
              <button
                type="button"
                onClick={() => {
                  setCurrentView('pricing');
                  setIsSidebarOpen(false);
                }}
                className="w-full h-8 text-xs font-bold bg-[#C62828] hover:bg-[#B71C1C] text-white shadow-xs rounded-xl"
              >
                Upgrade Now
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};
