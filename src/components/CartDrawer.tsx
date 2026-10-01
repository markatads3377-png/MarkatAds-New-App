import React, { useState } from 'react';
import {
  X,
  ShoppingCart,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Sparkles,
  Tag,
  MapPin,
  Clock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MEDIUM_OPTIONS } from '../data/mockCatalog';
import { toast } from 'sonner';

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
  } = useApp();

  const [couponInput, setCouponInput] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    if (applyCoupon(couponInput)) {
      setCouponInput('');
      toast.success('Coupon discount applied successfully!');
    } else {
      toast.error('Invalid coupon code. Try SAVE10, MARKATADS20, or OOHCOIN25');
    }
  };

  const handleProceedToCheckout = () => {
    if (cart.length === 0) return;
    setInstantCheckoutItem(null); // Full cart checkout
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-200"
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <aside className="w-screen max-w-md bg-white border-l border-neutral-200 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-250">
          {/* Header */}
          <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
            <div className="flex items-center gap-2.5">
              <div className="size-9 rounded-xl bg-red-50 flex items-center justify-center text-[#C62828]">
                <ShoppingCart className="size-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-display text-neutral-900">Campaign Flight Cart</h3>
                <p className="text-[11px] text-neutral-500">
                  {cart.length} advertising {cart.length === 1 ? 'space' : 'spaces'} selected
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs text-rose-500 hover:text-rose-600 font-semibold px-2 py-1"
                >
                  Clear All
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="size-8 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 grid place-items-center"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="size-16 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400">
                  <ShoppingCart className="size-8 opacity-40" />
                </div>
                <h4 className="font-bold text-neutral-800 text-sm">Your media cart is empty</h4>
                <p className="text-xs text-neutral-500 max-w-xs leading-relaxed">
                  Explore prime billboards, transit ribbons, mall displays, and digital screens to build your campaign flight.
                </p>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 text-xs font-bold text-[#C62828] hover:underline"
                >
                  Browse Media Catalog →
                </button>
              </div>
            ) : (
              <>
                {cart.map((item) => {
                  const cover =
                    item.listing.images?.[0] ||
                    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600';
                  const baseMonthly = convertPrice(
                    item.listing.pricePerMonth,
                    item.listing.currency
                  );
                  const lineTotal = baseMonthly * item.durationMonths;
                  const mediumLbl =
                    MEDIUM_OPTIONS.find((m) => m.value === item.listing.medium)?.label ||
                    item.listing.medium;

                  return (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl border border-neutral-200 bg-white shadow-2xs space-y-3"
                    >
                      {/* Top Info */}
                      <div className="flex gap-3">
                        <img
                          src={cover}
                          alt={item.listing.title}
                          className="size-16 rounded-xl object-cover border border-neutral-100 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded">
                              {mediumLbl}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              className="text-neutral-400 hover:text-rose-500 p-0.5 transition-colors"
                              title="Remove space"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                          <h4 className="font-bold text-xs text-neutral-900 truncate mt-1">
                            {item.listing.title}
                          </h4>
                          <div className="flex items-center gap-1 text-[11px] text-neutral-500 mt-0.5">
                            <MapPin className="size-3 text-[#C62828] shrink-0" />
                            <span className="truncate">
                              {item.listing.city}, {item.listing.country}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Add-ons mini chips */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <button
                          type="button"
                          onClick={() => toggleCartAddon(item.id, 'printing')}
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border transition-all ${
                            item.addons.printing
                              ? 'bg-[#C62828] text-white border-[#C62828]'
                              : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-neutral-300'
                          }`}
                        >
                          + Vinyl Print ({formatMoney(450, 'USD')})
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleCartAddon(item.id, 'creativeDesign')}
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border transition-all ${
                            item.addons.creativeDesign
                              ? 'bg-[#C62828] text-white border-[#C62828]'
                              : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-neutral-300'
                          }`}
                        >
                          + Design ({formatMoney(250, 'USD')})
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleCartAddon(item.id, 'proofOfPlay')}
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border transition-all ${
                            item.addons.proofOfPlay
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-neutral-300'
                          }`}
                        >
                          + Proof-of-Play ({formatMoney(150, 'USD')})
                        </button>
                      </div>

                      {/* Duration Stepper & Subtotal */}
                      <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-neutral-500 text-[11px] font-medium">Flight:</span>
                          <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50">
                            <button
                              type="button"
                              onClick={() => updateCartDuration(item.id, item.durationMonths - 1)}
                              className="px-2 py-0.5 text-neutral-600 hover:bg-neutral-200 font-bold disabled:opacity-30"
                              disabled={item.durationMonths <= 1}
                            >
                              -
                            </button>
                            <span className="px-2 py-0.5 font-bold text-xs min-w-[28px] text-center">
                              {item.durationMonths}m
                            </span>
                            <button
                              type="button"
                              onClick={() => updateCartDuration(item.id, item.durationMonths + 1)}
                              className="px-2 py-0.5 text-neutral-600 hover:bg-neutral-200 font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-extrabold text-sm text-neutral-900">
                            {formatMoney(lineTotal, 'USD')}
                          </div>
                          <div className="text-[10px] text-neutral-400">
                            {formatMoney(baseMonthly, 'USD')} / month
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Promo Code Box */}
                <form onSubmit={handleApplyCoupon} className="pt-2">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="size-3.5 text-emerald-600" /> Code <strong>{appliedCoupon}</strong> active!
                      </span>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-neutral-500 hover:text-rose-600 text-xs underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input
                          placeholder="Coupon: SAVE10 or OOHCOIN25"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value)}
                          className="w-full h-9 pl-8 pr-3 text-xs rounded-xl border border-neutral-200 bg-neutral-50/70 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#C62828]"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-3 h-9 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-800 hover:bg-neutral-100"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                </form>
              </>
            )}
          </div>

          {/* Footer Summary & Checkout CTA */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-neutral-100 space-y-3 bg-neutral-50/80">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-neutral-500">
                  <span>Media Flight Subtotal</span>
                  <span className="font-semibold text-neutral-900">{formatMoney(cartSubtotal, 'USD')}</span>
                </div>
                {cartAddonsTotal > 0 && (
                  <div className="flex justify-between text-neutral-500">
                    <span>Turnkey Production & Services</span>
                    <span className="font-semibold text-neutral-900">+{formatMoney(cartAddonsTotal, 'USD')}</span>
                  </div>
                )}
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount Applied</span>
                    <span>-{formatMoney(cartDiscount, 'USD')}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-500">
                  <span>Platform Escrow Protection</span>
                  <span className="text-emerald-600 font-semibold">0% (Waived for Advertisers)</span>
                </div>
                <div className="border-t border-neutral-200 pt-2 flex justify-between font-black text-sm text-neutral-900">
                  <span>Total Campaign Investment</span>
                  <span className="text-[#C62828] text-base font-display">{formatMoney(cartFinalTotal, 'USD')}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleProceedToCheckout}
                className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98"
              >
                <span>Proceed to Multi-Gateway Checkout</span>
                <ArrowRight className="size-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-500">
                <ShieldCheck className="size-3.5 text-emerald-500" />
                <span>Funds held securely in escrow until campaign flight approval</span>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
