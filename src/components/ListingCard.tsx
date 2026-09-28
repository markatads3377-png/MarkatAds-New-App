import React from "react";
import { Heart, MapPin, Star, ShoppingCart, Scale, Eye, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { mediumLabel } from "@/lib/mediums";
import { useEcom } from "@/context/EcomContext";
import { type ExtendedListing } from "@/data/mockCatalog";

export type Listing = {
  id: string;
  title: string;
  description: string | null;
  medium: string;
  city: string;
  country: string;
  size: string | null;
  price_per_month: number;
  currency: string;
  available: boolean;
  second_hand: boolean;
  images: string[];
  featured: boolean;
  daily_impressions?: string;
  cpm?: string;
};

type Props = {
  listing: Listing | ExtendedListing;
  favorite?: boolean;
  onToggleFavorite?: () => void;
  onSelect?: () => void;
  compareChecked?: boolean;
  onToggleCompare?: () => void;
  actionLabel?: string;
};

export function ListingCard({
  listing,
  favorite,
  onToggleFavorite,
  onSelect,
  compareChecked,
  onToggleCompare,
  actionLabel = "View & Book",
}: Props) {
  const {
    setSelectedListingForDetail,
    addToCart,
    toggleWishlist,
    isWishlisted,
    toggleCompare,
    isCompared,
    formatMoney,
  } = useEcom();

  const cover = listing.images?.[0];
  const isFav = favorite !== undefined ? favorite : isWishlisted(listing.id);
  const isComp = compareChecked !== undefined ? compareChecked : isCompared(listing.id);

  const handleOpenDetail = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (onSelect) {
      onSelect();
    } else {
      setSelectedListingForDetail(listing as ExtendedListing);
    }
  };

  const handleToggleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite();
    } else {
      toggleWishlist(listing.id);
    }
  };

  const handleToggleComp = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleCompare) {
      onToggleCompare();
    } else {
      toggleCompare(listing as ExtendedListing);
    }
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(listing as ExtendedListing, 1);
  };

  return (
    <Card
      onClick={handleOpenDetail}
      className="card-hover overflow-hidden border-border/70 p-0 shadow-soft cursor-pointer group hover:border-primary/50 transition-all duration-300 flex flex-col justify-between"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {cover ? (
          <img
            src={cover}
            alt={listing.title}
            loading="lazy"
            className="size-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="surface-ink grid size-full place-items-center font-display text-sm opacity-80">
            {mediumLabel(listing.medium)}
          </div>
        )}

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5 pointer-events-none">
          <Badge className="bg-background/90 text-foreground text-xs font-semibold backdrop-blur-md">
            {mediumLabel(listing.medium)}
          </Badge>
          {listing.featured && (
            <Badge className="bg-primary/90 text-primary-foreground border-0 text-xs shadow-soft font-semibold">
              <Star className="mr-1 size-3 fill-current" /> Featured
            </Badge>
          )}
          {listing.second_hand && (
            <Badge
              variant="secondary"
              className="text-xs bg-amber-500/20 text-amber-700 dark:text-amber-300"
            >
              Resale
            </Badge>
          )}
        </div>

        {/* Action icons on top right */}
        <div className="absolute right-3 top-3 flex items-center gap-1.5">
          <Button
            type="button"
            size="icon"
            variant="secondary"
            aria-label={isComp ? "Remove compare" : "Add to compare"}
            onClick={handleToggleComp}
            className={cn(
              "size-8 rounded-full bg-background/85 backdrop-blur-md hover:bg-background transition-colors",
              isComp && "bg-primary text-primary-foreground hover:bg-primary/90",
            )}
            title="Compare Media Space"
          >
            <Scale className="size-3.5" />
          </Button>

          <Button
            type="button"
            size="icon"
            variant="secondary"
            aria-label={isFav ? "Remove favourite" : "Save favourite"}
            onClick={handleToggleFav}
            className="size-8 rounded-full bg-background/85 backdrop-blur-md hover:bg-background transition-colors"
            title="Save to Wishlist"
          >
            <Heart className={cn("size-3.5", isFav && "fill-rose-500 text-rose-500")} />
          </Button>
        </div>

        {/* Daily impressions chip overlay */}
        {listing.daily_impressions && (
          <div className="absolute bottom-2.5 left-3 pointer-events-none">
            <span className="px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md text-white text-[11px] font-semibold flex items-center gap-1">
              <Eye className="w-3 h-3 text-emerald-400" />
              {listing.daily_impressions}
            </span>
          </div>
        )}
      </div>

      <CardContent className="space-y-3 p-4 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <h3 className="line-clamp-1 font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
            {listing.title}
          </h3>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3.5 text-primary shrink-0" />
            <span className="truncate">
              {[listing.city, listing.country].filter(Boolean).join(", ") || "Location on request"}
            </span>
            {listing.size ? ` · ${listing.size}` : ""}
          </p>
        </div>

        <div className="flex items-end justify-between gap-2 pt-1 border-t border-border/50">
          <div>
            <p className="font-display text-lg font-extrabold text-primary">
              {formatMoney(Number(listing.price_per_month), listing.currency)}
            </p>
            <p className="text-[11px] text-muted-foreground font-medium">per month rate</p>
          </div>
          <Badge variant={listing.available ? "secondary" : "outline"} className="text-xs">
            {listing.available ? "Live / Ready" : "Booked"}
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <Button
            size="sm"
            className="flex-1 font-bold text-xs h-9 bg-primary hover:bg-primary/90 text-primary-foreground shadow-soft"
            onClick={handleOpenDetail}
          >
            {actionLabel}
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="size-9 shrink-0 border-border hover:border-primary/50 hover:bg-primary/10 hover:text-primary transition-colors"
            onClick={handleQuickAdd}
            title="Quick Add to Cart"
          >
            <ShoppingCart className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
