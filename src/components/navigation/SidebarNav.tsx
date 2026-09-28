import React from "react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  Home,
  LayoutGrid,
  MapPin,
  Megaphone,
  Heart,
  BarChart3,
  Bookmark,
  MessageSquare,
  HelpCircle,
  Settings,
  X,
  Crown,
  Sparkles,
  Layers,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEcom } from "@/context/EcomContext";

interface SidebarNavProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSavedSearches?: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({ isOpen, onClose, onOpenSavedSearches }) => {
  const location = useLocation();
  const { wishlist, setIsWishlistOpen, compareList, setIsCompareOpen, orders, setIsOrdersOpen } =
    useEcom();

  const NAV_ITEMS = [
    { to: "/", label: "Home", icon: Home },
    { to: "/browse", label: "Browse Media", icon: LayoutGrid },
    { to: "/feed", label: "Community Feed", icon: Sparkles },
    { to: "/pricing", label: "Pricing & Plans", icon: Layers },
    {
      to: "/profile",
      label: "Spotter Profile & Coins",
      icon: Crown,
    },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar Panel */}
      <aside className="fixed inset-y-0 left-0 z-50 w-72 sm:w-80 bg-white border-r border-neutral-200/90 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-250 select-none">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl font-display text-sm font-black text-white bg-[#C62828] shadow-sm">
              MA
            </span>
            <div>
              <span className="font-display text-base font-bold tracking-tight text-neutral-900 block leading-tight">
                Mark@Ads
              </span>
              <span className="text-[10px] font-medium text-neutral-500 block">
                Beyond Visibility
              </span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="size-8 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
            aria-label="Close navigation"
          >
            <X className="size-4" />
          </Button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 p-3 space-y-1 overflow-y-auto">
          {/* Main Links */}
          <div className="space-y-0.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-red-50 text-[#C62828] shadow-2xs font-bold"
                      : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
                  }`}
                >
                  <Icon className={`size-4 ${isActive ? "text-[#C62828]" : "text-neutral-400"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Secondary Features Section */}
          <div className="pt-3 mt-3 border-t border-neutral-100 space-y-0.5">
            <span className="px-3.5 text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
              Workspaces & Tools
            </span>

            {/* My Campaigns (Flight tracker) */}
            <button
              type="button"
              onClick={() => {
                onClose();
                setIsOrdersOpen(true);
              }}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
            >
              <span className="flex items-center gap-3">
                <Megaphone className="size-4 text-neutral-400" />
                <span>My Campaigns</span>
              </span>
              {orders.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#C62828] text-white">
                  {orders.length}
                </span>
              )}
            </button>

            {/* Favorites */}
            <button
              type="button"
              onClick={() => {
                onClose();
                setIsWishlistOpen(true);
              }}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
            >
              <span className="flex items-center gap-3">
                <Heart className="size-4 text-neutral-400" />
                <span>Favorites</span>
              </span>
              {wishlist.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-neutral-200 text-neutral-800">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Compare */}
            <button
              type="button"
              onClick={() => {
                onClose();
                setIsCompareOpen(true);
              }}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
            >
              <span className="flex items-center gap-3">
                <BarChart3 className="size-4 text-neutral-400" />
                <span>Compare Spaces</span>
              </span>
              {compareList.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-neutral-200 text-neutral-800">
                  {compareList.length}
                </span>
              )}
            </button>

            {/* Saved Searches */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSavedSearches?.();
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
            >
              <Bookmark className="size-4 text-neutral-400" />
              <span>Saved Searches</span>
            </button>

            {/* Messages */}
            <Link
              to="/buyer"
              onClick={onClose}
              className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
            >
              <span className="flex items-center gap-3">
                <MessageSquare className="size-4 text-neutral-400" />
                <span>Messages & Inquiries</span>
              </span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#C62828] text-white">
                2
              </span>
            </Link>
          </div>

          {/* Help & Settings */}
          <div className="pt-3 mt-3 border-t border-neutral-100 space-y-0.5">
            <Link
              to="/pricing"
              onClick={onClose}
              className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
            >
              <HelpCircle className="size-4 text-neutral-400" />
              <span>Help & Support</span>
            </Link>

            <Link
              to="/profile"
              onClick={onClose}
              className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
            >
              <Settings className="size-4 text-neutral-400" />
              <span>Account Settings</span>
            </Link>
          </div>
        </div>

        {/* Upgrade to Pro Card at Bottom */}
        <div className="p-4 m-3 rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/20 space-y-3">
          <div className="flex items-center gap-2 text-[#C62828]">
            <Crown className="size-4 fill-amber-500 text-amber-500" />
            <span className="font-display font-bold text-xs text-neutral-900">Upgrade to Pro</span>
          </div>
          <p className="text-[11px] text-neutral-600 leading-relaxed">
            Get exclusive deals, priority booking, live sensor tracking, and concierge campaign
            support.
          </p>
          <Button
            asChild
            size="sm"
            className="w-full h-8 text-xs font-bold bg-[#C62828] hover:bg-[#B71C1C] text-white shadow-xs rounded-xl"
          >
            <Link to="/pricing" onClick={onClose}>
              Upgrade Now
            </Link>
          </Button>
        </div>
      </aside>
    </>
  );
};
