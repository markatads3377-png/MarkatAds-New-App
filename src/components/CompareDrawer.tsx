import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEcom } from "@/context/EcomContext";
import {
  Scale,
  Trash2,
  ShoppingCart,
  Eye,
  Zap,
  Maximize2,
  Building2,
  Star,
  MapPin,
  Sparkles,
} from "lucide-react";
import { mediumLabel } from "@/lib/mediums";

export const CompareDrawer: React.FC = () => {
  const {
    compareList,
    toggleCompare,
    clearCompare,
    isCompareOpen,
    setIsCompareOpen,
    addToCart,
    setSelectedListingForDetail,
    formatMoney,
  } = useEcom();

  if (!isCompareOpen) return null;

  return (
    <Dialog open={isCompareOpen} onOpenChange={setIsCompareOpen}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden bg-background border-border/80 shadow-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="p-5 border-b border-border/60 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-foreground">
                Media Space Comparison Matrix
              </DialogTitle>
              <p className="text-xs text-muted-foreground">
                Comparing {compareList.length} advertising{" "}
                {compareList.length === 1 ? "space" : "spaces"} side-by-side
              </p>
            </div>
          </div>
          {compareList.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearCompare}
              className="text-xs text-rose-500 hover:text-rose-600 h-8"
            >
              Clear Comparison
            </Button>
          )}
        </DialogHeader>

        <div className="flex-1 overflow-auto p-5">
          {compareList.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                <Scale className="w-8 h-8 opacity-40" />
              </div>
              <h3 className="font-bold text-foreground text-sm">
                No media spaces selected for comparison
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Click the "Compare" button on any listing card to evaluate metrics like CPM,
                impressions, dimensions, and rates.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse min-w-[650px]">
                <thead>
                  <tr className="border-b border-border/70 bg-muted/40">
                    <th className="p-3.5 font-bold text-muted-foreground w-40">Feature / Metric</th>
                    {compareList.map((item) => (
                      <th
                        key={item.id}
                        className="p-3.5 font-bold text-foreground w-64 min-w-[220px]"
                      >
                        <div className="flex justify-between items-start gap-1 mb-2">
                          <Badge variant="secondary" className="text-[10px] uppercase font-bold">
                            {mediumLabel(item.medium)}
                          </Badge>
                          <button
                            type="button"
                            onClick={() => toggleCompare(item)}
                            className="text-muted-foreground hover:text-rose-500 p-1"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="w-full h-28 rounded-xl overflow-hidden mb-2 bg-muted border border-border/60">
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
                        <h4 className="font-bold text-xs truncate text-foreground">{item.title}</h4>
                        <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5 font-normal">
                          <MapPin className="w-3 h-3 text-primary" /> {item.city}, {item.country}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {/* Price Row */}
                  <tr>
                    <td className="p-3.5 font-bold text-muted-foreground bg-muted/20">
                      Monthly Rate Card
                    </td>
                    {compareList.map((item) => (
                      <td key={item.id} className="p-3.5 font-extrabold text-sm text-primary">
                        {formatMoney(item.price_per_month, item.currency)}
                        <span className="text-[10px] text-muted-foreground font-normal block">
                          per month
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Daily Impressions */}
                  <tr>
                    <td className="p-3.5 font-bold text-muted-foreground bg-muted/20">
                      Daily Traffic Reach
                    </td>
                    {compareList.map((item) => (
                      <td key={item.id} className="p-3.5 font-semibold text-foreground">
                        <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                          <Eye className="w-3.5 h-3.5 shrink-0" />
                          {item.daily_impressions || "180,000+ views"}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Est CPM */}
                  <tr>
                    <td className="p-3.5 font-bold text-muted-foreground bg-muted/20">
                      Estimated CPM
                    </td>
                    {compareList.map((item) => (
                      <td key={item.id} className="p-3.5 font-semibold text-foreground">
                        <span className="flex items-center gap-1 text-primary">
                          <Sparkles className="w-3 h-3" /> {item.cpm || "$1.50"}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Dimensions */}
                  <tr>
                    <td className="p-3.5 font-bold text-muted-foreground bg-muted/20">
                      Display Dimensions
                    </td>
                    {compareList.map((item) => (
                      <td key={item.id} className="p-3.5 text-foreground font-medium">
                        {item.size || "Standard Specification"}
                      </td>
                    ))}
                  </tr>

                  {/* Illumination */}
                  <tr>
                    <td className="p-3.5 font-bold text-muted-foreground bg-muted/20">
                      Illumination / Tech
                    </td>
                    {compareList.map((item) => (
                      <td key={item.id} className="p-3.5 text-foreground font-medium">
                        {item.lighting_type || "24/7 Illuminated"}
                      </td>
                    ))}
                  </tr>

                  {/* Seller Rating */}
                  <tr>
                    <td className="p-3.5 font-bold text-muted-foreground bg-muted/20">
                      Owner Rating
                    </td>
                    {compareList.map((item) => (
                      <td key={item.id} className="p-3.5 text-foreground font-medium">
                        <span className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          {item.seller_rating || 4.9} ({item.seller_reviews_count || 42} reviews)
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Action Buttons */}
                  <tr>
                    <td className="p-3.5 font-bold text-muted-foreground bg-muted/20">Action</td>
                    {compareList.map((item) => (
                      <td key={item.id} className="p-3.5 space-y-1.5">
                        <Button
                          size="sm"
                          onClick={() => {
                            addToCart(item);
                            setIsCompareOpen(false);
                          }}
                          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs h-8 flex items-center justify-center gap-1.5"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedListingForDetail(item);
                            setIsCompareOpen(false);
                          }}
                          className="w-full text-xs h-8 font-semibold"
                        >
                          View Full Details
                        </Button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
