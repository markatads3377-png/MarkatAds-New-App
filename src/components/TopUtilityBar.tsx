import React from "react";
import { useEcom, CURRENCIES, CurrencyCode } from "@/context/EcomContext";
import {
  ShoppingCart,
  Heart,
  Scale,
  PackageCheck,
  Globe,
  ShieldCheck,
  Headphones,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export const TopUtilityBar: React.FC = () => {
  const {
    selectedCurrency,
    setSelectedCurrency,
    wishlist,
    compareList,
    orders,
    setIsWishlistOpen,
    setIsCompareOpen,
    setIsOrdersOpen,
  } = useEcom();

  return (
    <div className="w-full border-b border-border/60 bg-background text-xs py-1 px-4 sm:px-6 select-none">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 min-h-[30px]">
        {/* Left: Trust & Escrow Guarantee */}
        <div className="hidden sm:flex items-center gap-4 text-muted-foreground text-[11px]">
          <span className="flex items-center gap-1 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            100% Escrow Flight Protection
          </span>
          <span className="hidden md:inline text-border">•</span>
          <span className="hidden md:flex items-center gap-1 font-medium">
            <Globe className="w-3.5 h-3.5 text-primary shrink-0" />
            Worldwide Out-of-Home & DOOH Inventory
          </span>
        </div>

        {/* Right: Currency Switcher & E-Commerce Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto text-xs">
          {/* Currency Switcher */}
          <div className="flex items-center">
            <Select
              value={selectedCurrency}
              onValueChange={(val: CurrencyCode) => setSelectedCurrency(val)}
            >
              <SelectTrigger className="h-6.5 text-[11px] px-2 py-0 bg-muted/60 hover:bg-muted border border-border/50 rounded-md font-semibold text-foreground focus:ring-0 gap-1 transition-colors">
                <Globe className="w-3 h-3 text-muted-foreground" />
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

          <span className="text-border/80">|</span>

          {/* Compare Button */}
          <button
            type="button"
            onClick={() => setIsCompareOpen(true)}
            className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary font-medium transition-colors py-1 px-1.5 rounded-md hover:bg-muted/50"
          >
            <Scale className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Compare</span>
            {compareList.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                {compareList.length}
              </span>
            )}
          </button>

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={() => setIsWishlistOpen(true)}
            className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary font-medium transition-colors py-1 px-1.5 rounded-md hover:bg-muted/50"
          >
            <Heart className="w-3.5 h-3.5 text-rose-500" />
            <span className="hidden sm:inline">Wishlist</span>
            {wishlist.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Track Campaigns */}
          <button
            type="button"
            onClick={() => setIsOrdersOpen(true)}
            className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary font-medium transition-colors py-1 px-1.5 rounded-md hover:bg-muted/50"
          >
            <PackageCheck className="w-3.5 h-3.5 text-primary" />
            <span className="hidden sm:inline">My Flights</span>
            {orders.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                {orders.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
