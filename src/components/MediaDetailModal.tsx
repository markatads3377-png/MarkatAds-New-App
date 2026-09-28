import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useEcom, AddonServices } from "@/context/EcomContext";
import {
  MapPin,
  Calendar,
  Maximize2,
  Eye,
  CheckCircle2,
  ShoppingCart,
  Zap,
  TrendingUp,
  Share2,
  ShieldCheck,
  Building2,
  Sparkles,
  Heart,
  Scale,
  FileCheck,
  Paintbrush,
  Camera,
  ShieldAlert,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import { mediumLabel } from "@/lib/mediums";

export const MediaDetailModal: React.FC = () => {
  const {
    selectedListingForDetail,
    setSelectedListingForDetail,
    addToCart,
    setInstantCheckoutItem,
    setIsCheckoutOpen,
    formatMoney,
    convertPrice,
    toggleWishlist,
    isWishlisted,
    toggleCompare,
    isCompared,
  } = useEcom();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedMonths, setSelectedMonths] = useState(1);
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split("T")[0];
  });

  const [addons, setAddons] = useState<AddonServices>({
    printing: false,
    creativeDesign: false,
    proofOfPlay: true,
    stormInsurance: false,
  });

  if (!selectedListingForDetail) return null;

  const item = selectedListingForDetail;
  const defaultImage =
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80";
  const images = item.images && item.images.length > 0 ? item.images : [defaultImage];

  // Duration discounts
  const durationDiscountPercent =
    selectedMonths >= 12 ? 20 : selectedMonths >= 6 ? 15 : selectedMonths >= 3 ? 10 : 0;

  const baseMonthlyConverted = convertPrice(item.price_per_month, item.currency);
  const rawTotal = baseMonthlyConverted * selectedMonths;
  const durationDiscountAmount = (rawTotal * durationDiscountPercent) / 100;

  // Addons calculation
  let addonsCost = 0;
  if (addons.printing) addonsCost += convertPrice(450, "USD");
  if (addons.creativeDesign) addonsCost += convertPrice(250, "USD");
  if (addons.proofOfPlay) addonsCost += convertPrice(150, "USD");
  if (addons.stormInsurance) addonsCost += convertPrice(99, "USD");

  const finalCalculatedTotal = rawTotal - durationDiscountAmount + addonsCost;

  const handleAddToCart = () => {
    addToCart(item, selectedMonths, startDate, addons);
    setSelectedListingForDetail(null);
  };

  const handleInstantBuy = () => {
    setInstantCheckoutItem({
      id: `${item.id}-${Date.now()}`,
      listing: item,
      durationMonths: selectedMonths,
      startDate,
      addons,
    });
    setSelectedListingForDetail(null);
    setIsCheckoutOpen(true);
  };

  const handleShare = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Media listing link copied to clipboard!");
    }
  };

  const isFav = isWishlisted(item.id);
  const isComp = isCompared(item.id);

  return (
    <Dialog
      open={!!selectedListingForDetail}
      onOpenChange={(open) => !open && setSelectedListingForDetail(null)}
    >
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-background max-h-[92vh] flex flex-col border-border/80 shadow-2xl">
        {/* Header */}
        <DialogHeader className="p-4 sm:p-6 pb-3 border-b border-border/60 flex flex-row items-center justify-between">
          <div className="space-y-1 pr-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="font-semibold text-xs uppercase tracking-wider">
                {mediumLabel(item.medium)}
              </Badge>
              {item.second_hand ? (
                <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-xs">
                  Resale / Second-Hand
                </Badge>
              ) : (
                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs">
                  Live & Bookable
                </Badge>
              )}
              {item.featured && (
                <Badge className="bg-primary/10 text-primary border-primary/20 text-xs flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> High-Impact Location
                </Badge>
              )}
            </div>
            <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {item.title}
            </DialogTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 text-primary shrink-0" />
              <span>
                {item.address ? `${item.address} • ` : ""}
                {[item.city, item.country].filter(Boolean).join(", ")}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              variant={isComp ? "default" : "outline"}
              size="icon"
              onClick={() => toggleCompare(item)}
              className="size-9 rounded-full"
              title="Compare side-by-side"
            >
              <Scale className="size-4" />
            </Button>
            <Button
              variant={isFav ? "default" : "outline"}
              size="icon"
              onClick={() => toggleWishlist(item.id)}
              className="size-9 rounded-full"
              title="Save to Wishlist"
            >
              <Heart className={`size-4 ${isFav ? "fill-current" : ""}`} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleShare}
              className="size-9 rounded-full"
              title="Share listing"
            >
              <Share2 className="size-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Content Body */}
        <div className="overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Gallery & Specs */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-muted border border-border group shadow-soft">
              <img
                src={images[selectedImageIndex] || images[0]}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Verified Media Spot
                </span>
              </div>
            </div>

            {/* Thumbnail selector */}
            {images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-20 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImageIndex === idx
                        ? "border-primary ring-2 ring-primary/20 scale-105"
                        : "border-border opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Specs Grid */}
            <div className="bg-card rounded-2xl p-4 border border-border/80 space-y-3 shadow-soft">
              <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" /> Key Media Specifications & Reach
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="bg-muted/50 p-3 rounded-xl border border-border/50">
                  <span className="text-muted-foreground block mb-0.5 font-medium">Dimensions</span>
                  <span className="font-semibold text-foreground flex items-center gap-1">
                    <Maximize2 className="w-3.5 h-3.5 text-primary" />{" "}
                    {item.size || "Standard 40' x 20'"}
                  </span>
                </div>
                <div className="bg-muted/50 p-3 rounded-xl border border-border/50">
                  <span className="text-muted-foreground block mb-0.5 font-medium">
                    Daily Impressions
                  </span>
                  <span className="font-semibold text-foreground flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-emerald-500" />{" "}
                    {item.daily_impressions || "280,000+ views"}
                  </span>
                </div>
                <div className="bg-muted/50 p-3 rounded-xl border border-border/50">
                  <span className="text-muted-foreground block mb-0.5 font-medium">
                    Lighting / Display
                  </span>
                  <span className="font-semibold text-foreground flex items-center gap-1 truncate">
                    <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />{" "}
                    {item.lighting_type || "24/7 Illuminated"}
                  </span>
                </div>
                <div className="bg-muted/50 p-3 rounded-xl border border-border/50">
                  <span className="text-muted-foreground block mb-0.5 font-medium">
                    Media Owner
                  </span>
                  <span className="font-semibold text-foreground flex items-center gap-1 truncate">
                    <Building2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />{" "}
                    {item.seller_name || "Verified Partner"}
                  </span>
                </div>
                <div className="bg-muted/50 p-3 rounded-xl border border-border/50">
                  <span className="text-muted-foreground block mb-0.5 font-medium">
                    Owner Rating
                  </span>
                  <span className="font-semibold text-foreground flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />{" "}
                    {item.seller_rating || 4.9} ({item.seller_reviews_count || 42})
                  </span>
                </div>
                <div className="bg-muted/50 p-3 rounded-xl border border-border/50">
                  <span className="text-muted-foreground block mb-0.5 font-medium">Est. CPM</span>
                  <span className="font-semibold text-foreground flex items-center gap-1 text-primary">
                    <Sparkles className="w-3.5 h-3.5" /> {item.cpm || "$1.50"}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-foreground">
                About this Advertising Space
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description ||
                  `High-visibility outdoor advertising asset situated at prime viewing angles in ${item.city}, ${item.country}. Guarantees maximum consumer recall, prominent sightlines, and complete compliance certification.`}
              </p>
            </div>
          </div>

          {/* Right Column: Customizer, Flight Booking & Pricing */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4 bg-muted/40 p-4 sm:p-5 rounded-2xl border border-border/80">
            <div className="space-y-4">
              {/* Monthly Rate Header */}
              <div className="border-b border-border/70 pb-3">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                  Monthly Rate Card
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-foreground tracking-tight">
                    {formatMoney(item.price_per_month, item.currency)}
                  </span>
                  <span className="text-sm text-muted-foreground">/ month</span>
                </div>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1 font-semibold">
                  <ShieldCheck className="w-4 h-4" /> 100% Escrow Price & Flight Guarantee
                </span>
              </div>

              {/* Campaign Duration Selector */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <Label className="text-xs">Campaign Flight Duration</Label>
                  {durationDiscountPercent > 0 && (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      Save {durationDiscountPercent}%!
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { m: 1, label: "1 Mo", disc: 0 },
                    { m: 3, label: "3 Mo", disc: 10 },
                    { m: 6, label: "6 Mo", disc: 15 },
                    { m: 12, label: "12 Mo", disc: 20 },
                  ].map((tier) => (
                    <button
                      key={tier.m}
                      type="button"
                      onClick={() => setSelectedMonths(tier.m)}
                      className={`py-2 px-1 text-center rounded-xl border text-xs font-semibold transition-all ${
                        selectedMonths === tier.m
                          ? "bg-primary text-primary-foreground border-primary shadow-soft ring-2 ring-primary/20"
                          : "bg-card text-foreground border-border hover:border-primary/50"
                      }`}
                    >
                      <div>{tier.label}</div>
                      {tier.disc > 0 && <div className="text-[10px] opacity-80">-{tier.disc}%</div>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Campaign Start Date */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="flight-start"
                  className="text-xs font-semibold flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5 text-primary" /> Target Flight Start Date
                </Label>
                <Input
                  id="flight-start"
                  type="date"
                  value={startDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-card h-9 text-xs"
                />
              </div>

              {/* Add-on Production & Support Services */}
              <div className="space-y-2 pt-1">
                <Label className="text-xs font-semibold text-foreground flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-primary" /> Optional Turnkey Add-ons
                </Label>
                <div className="space-y-2 text-xs">
                  <label className="flex items-center justify-between p-2 rounded-xl bg-card border border-border/80 hover:border-primary/40 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={addons.printing}
                        onCheckedChange={(checked) =>
                          setAddons((p) => ({ ...p, printing: !!checked }))
                        }
                      />
                      <div className="leading-none">
                        <span className="font-semibold block">
                          Vinyl Print & Professional Mounting
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          Weather-proof heavy duty flex
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-primary">+{formatMoney(450, "USD")}</span>
                  </label>

                  <label className="flex items-center justify-between p-2 rounded-xl bg-card border border-border/80 hover:border-primary/40 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={addons.creativeDesign}
                        onCheckedChange={(checked) =>
                          setAddons((p) => ({ ...p, creativeDesign: !!checked }))
                        }
                      />
                      <div className="leading-none">
                        <span className="font-semibold block">
                          Creative Resizing & Design Audit
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          OOH high-contrast optimization
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-primary">+{formatMoney(250, "USD")}</span>
                  </label>

                  <label className="flex items-center justify-between p-2 rounded-xl bg-card border border-border/80 hover:border-primary/40 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={addons.proofOfPlay}
                        onCheckedChange={(checked) =>
                          setAddons((p) => ({ ...p, proofOfPlay: !!checked }))
                        }
                      />
                      <div className="leading-none">
                        <span className="font-semibold block">
                          Drone & Time-Stamped Proof-of-Play
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          High-res inspection report
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-emerald-600">+{formatMoney(150, "USD")}</span>
                  </label>

                  <label className="flex items-center justify-between p-2 rounded-xl bg-card border border-border/80 hover:border-primary/40 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={addons.stormInsurance}
                        onCheckedChange={(checked) =>
                          setAddons((p) => ({ ...p, stormInsurance: !!checked }))
                        }
                      />
                      <div className="leading-none">
                        <span className="font-semibold block">
                          Weather & Damage Replacement Warranty
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          Immediate 24-hr re-print cover
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-primary">+{formatMoney(99, "USD")}</span>
                  </label>
                </div>
              </div>

              {/* Price Calculation Card */}
              <div className="bg-card rounded-2xl p-3.5 border border-border/80 space-y-2 text-xs shadow-soft">
                <div className="flex justify-between text-muted-foreground">
                  <span>
                    Base Rate ({selectedMonths} month{selectedMonths > 1 ? "s" : ""})
                  </span>
                  <span>{formatMoney(rawTotal, "USD")}</span>
                </div>
                {durationDiscountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Duration Discount ({durationDiscountPercent}%)</span>
                    <span>-{formatMoney(durationDiscountAmount, "USD")}</span>
                  </div>
                )}
                {addonsCost > 0 && (
                  <div className="flex justify-between text-muted-foreground">
                    <span>Selected Add-ons</span>
                    <span>+{formatMoney(addonsCost, "USD")}</span>
                  </div>
                )}
                <div className="border-t border-border/60 pt-2 flex justify-between font-extrabold text-sm text-foreground">
                  <span>Total Estimated Flight Cost</span>
                  <span className="text-primary text-base">
                    {formatMoney(finalCalculatedTotal, "USD")}
                  </span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2 pt-2">
              <Button
                type="button"
                onClick={handleInstantBuy}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-5 text-sm flex items-center justify-center gap-2 shadow-soft"
              >
                <Zap className="w-4 h-4 fill-current" />
                Instant Book & Checkout Now
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleAddToCart}
                className="w-full font-semibold py-5 text-sm flex items-center justify-center gap-2 border-border/80 hover:bg-accent"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Media Cart
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
