import React from 'react';
import { X, Heart, ShoppingCart, Trash2, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MEDIUM_OPTIONS } from '../data/mockCatalog';

export const WishlistDrawer: React.FC = () => {
  const {
    catalog,
    wishlist,
    toggleWishlist,
    isWishlistOpen,
    setIsWishlistOpen,
    addToCart,
    setSelectedListingForDetail,
    formatMoney,
  } = useApp();

  if (!isWishlistOpen) return null;

  const savedListings = catalog.filter((item) => wishlist.includes(item.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-200"
        onClick={() => setIsWishlistOpen(false)}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <aside className="w-screen max-w-md bg-white border-l border-neutral-200 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-250">
          {/* Header */}
          <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
            <div className="flex items-center gap-2.5">
              <div className="size-9 rounded-xl bg-red-50 flex items-center justify-center text-[#C62828]">
                <Heart className="size-5 fill-current" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-display text-neutral-900">Saved Media Shortlist</h3>
                <p className="text-[11px] text-neutral-500">
                  {savedListings.length} {savedListings.length === 1 ? 'space' : 'spaces'} shortlisted
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsWishlistOpen(false)}
              className="size-8 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 grid place-items-center"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {savedListings.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="size-16 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400">
                  <Heart className="size-8 opacity-40" />
                </div>
                <h4 className="font-bold text-neutral-800 text-sm">Your shortlist is empty</h4>
                <p className="text-xs text-neutral-500 max-w-xs leading-relaxed">
                  Click the heart icon on any billboard or screen to save it for campaign planning or client presentations.
                </p>
                <button
                  type="button"
                  onClick={() => setIsWishlistOpen(false)}
                  className="mt-2 text-xs font-bold text-[#C62828] hover:underline"
                >
                  Browse Spaces →
                </button>
              </div>
            ) : (
              savedListings.map((item) => {
                const mediumLbl =
                  MEDIUM_OPTIONS.find((m) => m.value === item.medium)?.label || item.medium;

                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl border border-neutral-200 bg-white shadow-2xs space-y-3"
                  >
                    <div className="flex gap-3">
                      <img
                        src={item.images?.[0] || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500'}
                        alt={item.title}
                        className="size-18 rounded-xl object-cover border border-neutral-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded">
                            {mediumLbl}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleWishlist(item.id)}
                            className="text-neutral-400 hover:text-rose-500 p-0.5"
                            title="Remove from saved"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                        <h4 className="font-bold text-xs text-neutral-900 truncate mt-1">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-1 text-[11px] text-neutral-500 mt-0.5">
                          <MapPin className="size-3 text-[#C62828] shrink-0" />
                          <span className="truncate">
                            {item.city}, {item.country}
                          </span>
                        </div>
                        <div className="font-black text-xs text-[#C62828] mt-1 font-display">
                          {formatMoney(item.pricePerMonth, item.currency)} / mo
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1 border-t border-neutral-100">
                      <button
                        type="button"
                        onClick={() => {
                          addToCart(item);
                          setIsWishlistOpen(false);
                        }}
                        className="flex-1 h-8 rounded-xl bg-[#C62828] hover:bg-[#B71C1C] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <ShoppingCart className="size-3.5" />
                        <span>Move to Cart</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedListingForDetail(item);
                          setIsWishlistOpen(false);
                        }}
                        className="h-8 px-3 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-800 text-xs font-semibold"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};
