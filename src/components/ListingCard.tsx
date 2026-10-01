import React from 'react';
import { Heart, MapPin, Star, ShoppingCart, Scale, Eye, Sparkles, ChevronRight } from 'lucide-react';
import { Listing } from '../types';
import { useApp } from '../context/AppContext';
import { MEDIUM_OPTIONS } from '../data/mockCatalog';

interface ListingCardProps {
  listing: Listing;
  onOpenDetail?: (listing: Listing) => void;
  actionLabel?: string;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  onOpenDetail,
  actionLabel = 'View & Book',
}) => {
  const {
    setSelectedListingForDetail,
    addToCart,
    wishlist,
    toggleWishlist,
    isWishlisted,
    toggleCompare,
    isCompared,
    formatMoney,
  } = useApp();

  const isFav = isWishlisted(listing.id);
  const isComp = isCompared(listing.id);

  const mediumLabel =
    MEDIUM_OPTIONS.find((m) => m.value === listing.medium)?.label || listing.medium;

  const handleCardClick = () => {
    if (onOpenDetail) {
      onOpenDetail(listing);
    } else {
      setSelectedListingForDetail(listing);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(listing.id);
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleCompare(listing);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(listing, 1);
  };

  const coverImage =
    listing.images && listing.images.length > 0
      ? listing.images[0]
      : 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800';

  return (
    <div
      onClick={handleCardClick}
      className="group rounded-2xl border border-neutral-200/90 bg-white overflow-hidden shadow-2xs hover:shadow-md hover:border-neutral-300 transition-all duration-300 flex flex-col justify-between cursor-pointer select-none"
    >
      {/* Media Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
        <img
          src={coverImage}
          alt={listing.title}
          loading="lazy"
          className="size-full object-cover group-hover:scale-104 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 pointer-events-none">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold text-neutral-800 bg-white/95 backdrop-blur-xs shadow-xs capitalize">
            {mediumLabel}
          </span>
          {listing.featured && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold text-white bg-[#C62828] shadow-xs flex items-center gap-1">
              <Star className="size-3 fill-current" />
              <span>Featured</span>
            </span>
          )}
          {listing.secondHand && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/90 text-white shadow-xs">
              Resale Slot
            </span>
          )}
        </div>

        {/* Action icons on top right */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCompareClick}
            className={`size-7 rounded-full backdrop-blur-xs grid place-items-center shadow-xs transition-colors ${
              isComp
                ? 'bg-[#C62828] text-white'
                : 'bg-white/90 text-neutral-700 hover:text-neutral-900 hover:bg-white'
            }`}
            title="Compare Media Space"
          >
            <Scale className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={handleFavoriteClick}
            className="size-7 rounded-full bg-white/90 backdrop-blur-xs text-neutral-700 hover:text-[#C62828] grid place-items-center shadow-xs transition-colors"
            title="Save to Wishlist"
          >
            <Heart className={`size-3.5 ${isFav ? 'fill-[#C62828] text-[#C62828]' : ''}`} />
          </button>
        </div>

        {/* Live Daily Impressions Overlay */}
        <div className="absolute bottom-2 left-2.5 px-2 py-0.5 rounded-md bg-neutral-900/80 backdrop-blur-xs text-white text-[10px] font-semibold flex items-center gap-1">
          <Eye className="size-3 text-emerald-400" />
          <span>{listing.dailyImpressions}</span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-neutral-900 line-clamp-1 group-hover:text-[#C62828] transition-colors">
            {listing.title}
          </h3>
          <p className="text-[11px] text-neutral-500 flex items-center gap-1">
            <MapPin className="size-3 text-neutral-400 shrink-0" />
            <span className="truncate">
              {[listing.city, listing.country].filter(Boolean).join(', ')}
            </span>
            {listing.size && (
              <>
                <span className="text-neutral-300">•</span>
                <span className="truncate text-neutral-600 font-medium">{listing.size}</span>
              </>
            )}
          </p>
        </div>

        {/* Pricing & Key Metrics */}
        <div className="pt-2 border-t border-neutral-100 flex items-end justify-between gap-2">
          <div>
            <div className="text-base sm:text-lg font-black text-[#C62828] font-display">
              {formatMoney(listing.pricePerMonth, listing.currency)}
            </div>
            <div className="text-[10px] text-neutral-400 font-medium">
              ${listing.pricePerDay || Math.round(listing.pricePerMonth / 30)}/day • CPM {listing.cpm || '$2.10'}
            </div>
          </div>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
              listing.available
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-neutral-100 text-neutral-500'
            }`}
          >
            {listing.available ? 'Live Ready' : 'Booked'}
          </span>
        </div>

        {/* CTA Buttons */}
        <div className="pt-1 flex items-center gap-2">
          <button
            type="button"
            onClick={handleCardClick}
            className="flex-1 h-9 rounded-xl bg-[#C62828] hover:bg-[#B71C1C] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-98"
          >
            <span>{actionLabel}</span>
            <ChevronRight className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={handleQuickAdd}
            className="size-9 rounded-xl border border-neutral-200 hover:border-[#C62828]/50 hover:bg-red-50 text-neutral-700 hover:text-[#C62828] grid place-items-center transition-colors shadow-2xs"
            title="Quick Add 1-Month Flight to Cart"
          >
            <ShoppingCart className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
