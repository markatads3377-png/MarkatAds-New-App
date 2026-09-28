import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import { Menu, Search, Globe, Bell, Heart, ShoppingCart, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useEcom, CURRENCIES, type CurrencyCode } from "@/context/EcomContext";
import { SidebarNav } from "@/components/navigation/SidebarNav";
import { SavedSearchesModal } from "@/components/dashboard/SavedSearchesModal";
import { getLocalCoins } from "@/lib/coinService";

export function SiteHeader() {
  const { session, user, username, displayName } = useAuth();
  const {
    cart,
    setIsCartOpen,
    wishlist,
    setIsWishlistOpen,
    selectedCurrency,
    setSelectedCurrency,
  } = useEcom();

  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [savedSearchesOpen, setSavedSearchesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const userCoins = mounted ? getLocalCoins(user?.uid) : 500;

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({
        to: "/browse",
        search: { search: searchQuery.trim() },
      });
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-neutral-200/80 shadow-2xs select-none">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          {/* Left Zone: Hamburger Menu & Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Clean Hamburger Menu Button for all secondary navigation */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="size-9 rounded-xl text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="size-5" />
            </Button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <span className="grid size-9 place-items-center rounded-xl font-display text-sm font-black text-white bg-[#C62828] shadow-sm group-hover:bg-[#B71C1C] transition-colors">
                MA
              </span>
              <div className="hidden sm:block">
                <span className="font-display text-base font-bold tracking-tight text-neutral-900 block leading-tight">
                  Mark@Ads
                </span>
                <span className="text-[10px] font-medium text-neutral-400 block leading-none">
                  Beyond Visibility
                </span>
              </div>
            </Link>
          </div>

          {/* Center Zone: Global Search */}
          <div className="flex-1 max-w-md mx-2 hidden md:block">
            <form onSubmit={handleGlobalSearch} className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search locations, billboards, cities..."
                className="w-full h-10 pl-9 pr-4 rounded-full border border-neutral-200 bg-neutral-50/70 hover:bg-neutral-50 focus:bg-white text-xs font-medium text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#C62828]/20 focus:border-[#C62828] transition-all shadow-2xs"
              />
            </form>
          </div>

          {/* Right Zone: Currency Selector, Notifications, Wishlist, Cart, Profile */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Currency Selector */}
            <div className="hidden sm:block">
              <Select
                value={selectedCurrency}
                onValueChange={(val: CurrencyCode) => setSelectedCurrency(val)}
              >
                <SelectTrigger className="h-8.5 text-xs px-2.5 py-0 bg-neutral-50/80 hover:bg-neutral-100 border border-neutral-200 rounded-lg font-semibold text-neutral-700 focus:ring-0 gap-1.5 transition-colors">
                  <Globe className="size-3.5 text-neutral-500" />
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent className="text-xs">
                  {Object.values(CURRENCIES).map((c) => (
                    <SelectItem key={c.code} value={c.code} className="text-xs">
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="size-8.5 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 relative"
              aria-label="Notifications"
            >
              <Bell className="size-4" />
              <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-[#C62828] ring-2 ring-white" />
            </Button>

            {/* Wishlist Heart with count badge */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsWishlistOpen(true)}
              className="size-8.5 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 relative"
              aria-label="Wishlist"
            >
              <Heart className="size-4" />
              <span
                suppressHydrationWarning
                className="absolute -top-0.5 -right-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-black bg-[#C62828] text-white"
              >
                {mounted && wishlist.length > 0 ? wishlist.length : 3}
              </span>
            </Button>

            {/* Cart with count badge */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCartOpen(true)}
              className="size-8.5 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 relative"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="size-4" />
              {mounted && cart.length > 0 ? (
                <span
                  suppressHydrationWarning
                  className="absolute -top-0.5 -right-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-black bg-[#C62828] text-white"
                >
                  {cart.length}
                </span>
              ) : (
                <span
                  suppressHydrationWarning
                  className="absolute -top-0.5 -right-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-black bg-neutral-300 text-neutral-700"
                >
                  0
                </span>
              )}
            </Button>

            {/* User Profile Avatar in Red */}
            <Link
              to="/profile"
              className="flex items-center gap-1.5 p-0.5 rounded-full hover:ring-2 hover:ring-[#C62828]/20 transition-all"
              title="My Account & Spotter Profile"
            >
              <div
                suppressHydrationWarning
                className="size-8.5 rounded-full bg-[#C62828] text-white grid place-items-center font-display font-bold text-xs shadow-2xs"
              >
                {mounted && displayName ? displayName.slice(0, 2).toUpperCase() : "MA"}
              </div>
            </Link>
          </div>
        </div>

        {/* Mobile Search Bar below header */}
        <div className="p-2 border-t border-neutral-100 md:hidden bg-neutral-50/50">
          <form onSubmit={handleGlobalSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search billboards, screens, locations..."
              className="w-full h-8 pl-8 pr-3 rounded-full border border-neutral-200 bg-white text-xs font-medium placeholder:text-neutral-400"
            />
          </form>
        </div>
      </header>

      {/* Hamburger Navigation Drawer */}
      <SidebarNav
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenSavedSearches={() => setSavedSearchesOpen(true)}
      />

      {/* Saved Searches Modal */}
      <SavedSearchesModal isOpen={savedSearchesOpen} onClose={() => setSavedSearchesOpen(false)} />
    </>
  );
}
