import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEcom } from "@/context/EcomContext";
import { MOCK_CATALOG } from "@/data/mockCatalog";
import { Heart, ShoppingCart, Trash2, MapPin, Sparkles, ArrowRight } from "lucide-react";
import { mediumLabel } from "@/lib/mediums";

export const WishlistDrawer: React.FC = () => {
  const {
    wishlist,
    toggleWishlist,
    isWishlistOpen,
    setIsWishlistOpen,
    addToCart,
    setSelectedListingForDetail,
    formatMoney,
  } = useEcom();

  const savedListings = MOCK_CATALOG.filter((item) => wishlist.includes(item.id));

  return (
    <Sheet open={isWishlistOpen} onOpenChange={setIsWishlistOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 bg-background border-l border-border/80">
        <SheetHeader className="p-5 border-b border-border/60 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <SheetTitle className="text-base font-bold">Saved Media Spaces</SheetTitle>
              <p className="text-xs text-muted-foreground">
                {savedListings.length} {savedListings.length === 1 ? "space" : "spaces"} shortlisted
              </p>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {savedListings.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground">
                <Heart className="w-8 h-8 opacity-40" />
              </div>
              <h3 className="font-semibold text-foreground text-sm">Your shortlist is empty</h3>
              <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                Click the heart icon on any billboard or screen to save it for campaign planning or
                client presentations.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsWishlistOpen(false)}
                className="mt-2 text-xs"
              >
                Browse Spaces
              </Button>
            </div>
          ) : (
            savedListings.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl border border-border/80 bg-card shadow-soft space-y-3"
              >
                <div className="flex gap-3">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted shrink-0 border border-border/60">
                    <img
                      src={
                        item.images?.[0] ||
                        "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500"
                      }
                      alt={item.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="secondary"
                        className="text-[10px] uppercase font-bold py-0 px-2"
                      >
                        {mediumLabel(item.medium)}
                      </Badge>
                      <button
                        type="button"
                        onClick={() => toggleWishlist(item.id)}
                        className="text-muted-foreground hover:text-rose-500 p-1"
                        title="Remove from saved"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <h4 className="font-bold text-xs text-foreground truncate mt-1">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
                      <MapPin className="w-3 h-3 text-primary shrink-0" />
                      <span className="truncate">
                        {item.city}, {item.country}
                      </span>
                    </div>
                    <div className="font-extrabold text-xs text-primary mt-1">
                      {formatMoney(item.price_per_month, item.currency)} / mo
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-1 border-t border-border/50">
                  <Button
                    size="sm"
                    onClick={() => {
                      addToCart(item);
                      setIsWishlistOpen(false);
                    }}
                    className="flex-1 text-xs font-bold h-8 flex items-center justify-center gap-1.5"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" /> Move to Cart
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedListingForDetail(item);
                      setIsWishlistOpen(false);
                    }}
                    className="text-xs h-8 font-semibold"
                  >
                    Details
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
