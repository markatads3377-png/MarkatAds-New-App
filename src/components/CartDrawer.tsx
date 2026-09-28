import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useEcom } from "@/context/EcomContext";
import {
  ShoppingCart,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Sparkles,
  Tag,
  MapPin,
  Clock,
  Paintbrush,
  Camera,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import { mediumLabel } from "@/lib/mediums";

export const CartDrawer: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartDuration,
    clearCart,
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen,
    setInstantCheckoutItem,
    cartSubtotal,
    cartAddonsTotal,
    cartDiscount,
    cartFinalTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    formatMoney,
    convertPrice,
    toggleCartAddon,
  } = useEcom();

  const [couponInput, setCouponInput] = useState("");

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    if (applyCoupon(couponInput)) {
      setCouponInput("");
    }
  };

  const handleProceedToCheckout = () => {
    if (cart.length === 0) return;
    setInstantCheckoutItem(null); // Full cart checkout
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col p-0 bg-background border-l border-border/80">
        {/* Header */}
        <SheetHeader className="p-5 border-b border-border/60 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <SheetTitle className="text-base font-bold">Media Campaign Cart</SheetTitle>
              <p className="text-xs text-muted-foreground">
                {cart.length} advertising {cart.length === 1 ? "space" : "spaces"} selected
              </p>
            </div>
          </div>
          {cart.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearCart}
              className="text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 h-7 px-2"
            >
              Clear Cart
            </Button>
          )}
        </SheetHeader>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground">
                <ShoppingCart className="w-8 h-8 opacity-40" />
              </div>
              <h3 className="font-semibold text-foreground text-sm">Your media cart is empty</h3>
              <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                Explore premium billboards, transit ribbons, mall displays, and digital screens to
                build your brand flight.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCartOpen(false)}
                className="mt-2 text-xs"
              >
                Browse Media Catalog
              </Button>
            </div>
          ) : (
            <>
              {cart.map((item) => {
                const cover =
                  item.listing.images?.[0] ||
                  "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600";
                const baseMonthly = convertPrice(
                  item.listing.price_per_month,
                  item.listing.currency,
                );
                const lineTotal = baseMonthly * item.durationMonths;

                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl border border-border/80 bg-card shadow-soft space-y-3 relative group"
                  >
                    {/* Item Top */}
                    <div className="flex gap-3">
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted shrink-0 border border-border/50">
                        <img
                          src={cover}
                          alt={item.listing.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <Badge
                            variant="secondary"
                            className="text-[10px] uppercase font-bold py-0 px-2"
                          >
                            {mediumLabel(item.listing.medium)}
                          </Badge>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="text-muted-foreground hover:text-rose-500 p-1 transition-colors"
                            title="Remove space"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <h4 className="font-bold text-xs text-foreground truncate mt-1">
                          {item.listing.title}
                        </h4>
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
                          <MapPin className="w-3 h-3 text-primary shrink-0" />
                          <span className="truncate">
                            {item.listing.city}, {item.listing.country}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
                          <Calendar className="w-3 h-3 text-muted-foreground shrink-0" />
                          <span>
                            Flight starts: <strong>{item.startDate}</strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Add-ons mini chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => toggleCartAddon(item.id, "printing")}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border transition-all ${
                          item.addons.printing
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-muted text-muted-foreground border-border hover:border-primary/40"
                        }`}
                      >
                        + Vinyl Print ({formatMoney(450, "USD")})
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleCartAddon(item.id, "creativeDesign")}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border transition-all ${
                          item.addons.creativeDesign
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-muted text-muted-foreground border-border hover:border-primary/40"
                        }`}
                      >
                        + Design ({formatMoney(250, "USD")})
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleCartAddon(item.id, "proofOfPlay")}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border transition-all ${
                          item.addons.proofOfPlay
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-muted text-muted-foreground border-border hover:border-primary/40"
                        }`}
                      >
                        + Proof-of-Play ({formatMoney(150, "USD")})
                      </button>
                    </div>

                    {/* Duration Stepper & Price */}
                    <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-[11px] font-medium">
                          Flight:
                        </span>
                        <div className="flex items-center border border-border rounded-lg bg-background overflow-hidden">
                          <button
                            type="button"
                            onClick={() => updateCartDuration(item.id, item.durationMonths - 1)}
                            className="px-2.5 py-1 text-muted-foreground hover:bg-muted font-bold disabled:opacity-30"
                            disabled={item.durationMonths <= 1}
                          >
                            -
                          </button>
                          <span className="px-2.5 py-1 font-bold text-xs min-w-[32px] text-center">
                            {item.durationMonths}m
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCartDuration(item.id, item.durationMonths + 1)}
                            className="px-2.5 py-1 text-muted-foreground hover:bg-muted font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-extrabold text-sm text-foreground">
                          {formatMoney(lineTotal, "USD")}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {formatMoney(baseMonthly, "USD")} / month
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Promo Coupon Box */}
              <form onSubmit={handleApplyCoupon} className="pt-2">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Code <strong>{appliedCoupon}</strong>{" "}
                      active!
                    </span>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-muted-foreground hover:text-rose-500 text-xs underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Coupon: SAVE10 or MARKATADS20"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="pl-8 text-xs h-9 bg-card"
                      />
                    </div>
                    <Button
                      type="submit"
                      variant="outline"
                      size="sm"
                      className="text-xs h-9 font-semibold"
                    >
                      Apply
                    </Button>
                  </div>
                )}
              </form>
            </>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <SheetFooter className="p-5 border-t border-border/70 flex-col space-y-3 bg-muted/30">
            <div className="w-full space-y-1.5 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Media Flight Subtotal</span>
                <span className="font-semibold text-foreground">
                  {formatMoney(cartSubtotal, "USD")}
                </span>
              </div>
              {cartAddonsTotal > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Turnkey Production & Services</span>
                  <span className="font-semibold text-foreground">
                    +{formatMoney(cartAddonsTotal, "USD")}
                  </span>
                </div>
              )}
              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                  <span>Discount Applied</span>
                  <span>-{formatMoney(cartDiscount, "USD")}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>Platform Booking & Escrow Fee</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  0% (Waived for Advertisers)
                </span>
              </div>
              <div className="border-t border-border/70 pt-2 flex justify-between font-extrabold text-sm text-foreground">
                <span>Total Campaign Investment</span>
                <span className="text-primary text-lg">{formatMoney(cartFinalTotal, "USD")}</span>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleProceedToCheckout}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-5 flex items-center justify-center gap-2 shadow-soft text-sm"
            >
              <span>Proceed to Multi-Gateway Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Funds held securely in escrow until campaign flight approval</span>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};
