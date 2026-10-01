import React, { useState } from 'react';
import {
  X,
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
  Star,
  Layers,
  Clock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AddonServices } from '../types';
import { MEDIUM_OPTIONS } from '../data/mockCatalog';
import { toast } from 'sonner';

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
  } = useApp();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedMonths, setSelectedMonths] = useState(1);
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });

  const [addons, setAddons] = useState<AddonServices>({
    printing: false,
    creativeDesign: false,
    proofOfPlay: true,
    stormInsurance: false,
  });

  if (!selectedListingForDetail) return null;
  const item = selectedListingForDetail;

  const images = item.images && item.images.length > 0
    ? item.images
    : ['https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200'];

  const mediumLabel =
    MEDIUM_OPTIONS.find((m) => m.value === item.medium)?.label || item.medium;

  // Duration discounts
  const durationDiscountPercent =
    selectedMonths >= 12 ? 20 : selectedMonths >= 6 ? 15 : selectedMonths >= 3 ? 10 : 0;

  const baseMonthlyConverted = convertPrice(item.pricePerMonth, item.currency);
  const rawTotal = baseMonthlyConverted * selectedMonths;
  const durationDiscountAmount = (rawTotal * durationDiscountPercent) / 100;

  // Addons calculation
  let addonsCost = 0;
  if (addons.printing) addonsCost += convertPrice(450, 'USD');
  if (addons.creativeDesign) addonsCost += convertPrice(250, 'USD');
  if (addons.proofOfPlay) addonsCost += convertPrice(150, 'USD');
  if (addons.stormInsurance) addonsCost += convertPrice(99, 'USD');

  const finalCalculatedTotal = rawTotal - durationDiscountAmount + addonsCost;

  const handleAddToCart = () => {
    addToCart(item, selectedMonths, startDate, addons);
    setSelectedListingForDetail(null);
    toast.success(`"${item.title}" added to your campaign cart!`);
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
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Media listing link copied to clipboard!');
    }
  };

  const isFav = isWishlisted(item.id);
  const isComp = isCompared(item.id);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col border border-neutral-200 shadow-2xl overflow-hidden text-neutral-900">
        {/* Modal Top Header */}
        <div className="p-4 sm:p-6 pb-3 border-b border-neutral-100 flex items-center justify-between gap-4 bg-neutral-50/50">
          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-neutral-200 text-neutral-800">
                {mediumLabel}
              </span>
              {item.featured && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C62828] text-white flex items-center gap-1 shadow-2xs">
                  <Sparkles className="size-3" />
                  <span>High-Impact Showcase</span>
                </span>
              )}
              {item.secondHand && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                  Resale Slot (Discounted)
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-display tracking-tight text-neutral-900 truncate">
              {item.title}
            </h2>
            <p className="text-xs text-neutral-500 flex items-center gap-1 truncate">
              <MapPin className="size-3 text-[#C62828] shrink-0" />
              <span>{item.address ? `${item.address} • ` : ''}{item.city}, {item.country}</span>
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => toggleCompare(item)}
              className={`size-8 rounded-full grid place-items-center border transition-colors ${
                isComp ? 'bg-[#C62828] text-white border-[#C62828]' : 'border-neutral-200 text-neutral-600 hover:bg-neutral-100'
              }`}
              title="Compare Side-by-Side"
            >
              <Scale className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => toggleWishlist(item.id)}
              className={`size-8 rounded-full grid place-items-center border transition-colors ${
                isFav ? 'bg-red-50 text-[#C62828] border-red-200' : 'border-neutral-200 text-neutral-600 hover:bg-neutral-100'
              }`}
              title="Save to Wishlist"
            >
              <Heart className={`size-4 ${isFav ? 'fill-[#C62828] text-[#C62828]' : ''}`} />
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="size-8 rounded-full grid place-items-center border border-neutral-200 text-neutral-600 hover:bg-neutral-100 transition-colors"
              title="Share Listing"
            >
              <Share2 className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setSelectedListingForDetail(null)}
              className="size-8 rounded-full grid place-items-center text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 ml-1 transition-colors"
              aria-label="Close"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Image Gallery, Specs & Description (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Picture */}
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-neutral-100 border border-neutral-200 shadow-2xs">
              <img
                src={images[selectedImageIndex] || images[0]}
                alt={item.title}
                className="size-full object-cover"
              />
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-[11px] font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-emerald-400" />
                  <span>Verified Media Space</span>
                </span>
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-20 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImageIndex === idx
                        ? 'border-[#C62828] ring-2 ring-[#C62828]/20 scale-102'
                        : 'border-neutral-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="size-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Specs Grid */}
            <div className="bg-neutral-50/70 rounded-2xl p-4 border border-neutral-200/80 space-y-3">
              <h4 className="font-bold text-xs text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="size-4 text-[#C62828]" />
                <span>Audience Verification & Specs</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="bg-white p-3 rounded-xl border border-neutral-200 shadow-2xs">
                  <span className="text-[10px] text-neutral-400 block font-medium">Display Dimensions</span>
                  <span className="font-bold text-neutral-900 flex items-center gap-1 mt-0.5">
                    <Maximize2 className="size-3.5 text-[#C62828]" />
                    {item.size || "Standard 40' x 20'"}
                  </span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-neutral-200 shadow-2xs">
                  <span className="text-[10px] text-neutral-400 block font-medium">Daily Impressions</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
                    <Eye className="size-3.5" />
                    {item.dailyImpressions}
                  </span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-neutral-200 shadow-2xs">
                  <span className="text-[10px] text-neutral-400 block font-medium">Hardware / Illumination</span>
                  <span className="font-bold text-neutral-900 truncate block mt-0.5">
                    {item.lightingType || '24/7 Illuminated'}
                  </span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-neutral-200 shadow-2xs">
                  <span className="text-[10px] text-neutral-400 block font-medium">Resolution / Tech</span>
                  <span className="font-bold text-neutral-900 truncate block mt-0.5">
                    {item.resolution || 'High-Res Flex'}
                  </span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-neutral-200 shadow-2xs">
                  <span className="text-[10px] text-neutral-400 block font-medium">Owner Rating</span>
                  <span className="font-bold text-neutral-900 flex items-center gap-1 mt-0.5">
                    <Star className="size-3.5 fill-amber-400 text-amber-400" />
                    {item.sellerRating || 4.9} ({item.sellerReviewsCount || 34})
                  </span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-neutral-200 shadow-2xs">
                  <span className="text-[10px] text-neutral-400 block font-medium">Estimated CPM</span>
                  <span className="font-bold text-[#C62828] flex items-center gap-1 mt-0.5">
                    <Sparkles className="size-3.5" />
                    {item.cpm || '$2.10'}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5 text-xs text-neutral-600 leading-relaxed">
              <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider">
                Site Overview & Viewing Sightlines
              </h4>
              <p>
                {item.description ||
                  `High-visibility outdoor advertising asset situated at prime viewing angles in ${item.city}, ${item.country}. Guarantees maximum consumer recall and prominent unobstructed sightlines.`}
              </p>
            </div>
          </div>

          {/* Right Column: Customizer, Flight Booking & Pricing (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4 bg-neutral-50/80 p-4 sm:p-5 rounded-2xl border border-neutral-200/90">
            <div className="space-y-4">
              {/* Rate Card Header */}
              <div className="border-b border-neutral-200 pb-3">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                  Published Rate Card
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight font-display">
                    {formatMoney(item.pricePerMonth, item.currency)}
                  </span>
                  <span className="text-xs text-neutral-500 font-medium">/ month</span>
                </div>
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                  <ShieldCheck className="size-3.5" />
                  <span>100% Escrow Flight Protection Included</span>
                </span>
              </div>

              {/* Campaign Duration Selector */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-neutral-700">Flight Duration</span>
                  {durationDiscountPercent > 0 && (
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full text-[11px] border border-emerald-200">
                      Save {durationDiscountPercent}%!
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { m: 1, label: '1 Mo', disc: 0 },
                    { m: 3, label: '3 Mo', disc: 10 },
                    { m: 6, label: '6 Mo', disc: 15 },
                    { m: 12, label: '12 Mo', disc: 20 },
                  ].map((tier) => (
                    <button
                      key={tier.m}
                      type="button"
                      onClick={() => setSelectedMonths(tier.m)}
                      className={`py-2 px-1 text-center rounded-xl border text-xs font-semibold transition-all ${
                        selectedMonths === tier.m
                          ? 'bg-[#C62828] text-white border-[#C62828] shadow-xs'
                          : 'bg-white text-neutral-800 border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div className="font-bold">{tier.label}</div>
                      {tier.disc > 0 && <div className="text-[9px] opacity-80">-{tier.disc}%</div>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Start Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-700 flex items-center gap-1.5">
                  <Calendar className="size-3.5 text-[#C62828]" />
                  <span>Target Flight Start Date</span>
                </label>
                <input
                  type="date"
                  value={startDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-neutral-200 text-xs bg-white text-neutral-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#C62828]/20 focus:border-[#C62828]"
                />
              </div>

              {/* Turnkey Add-ons */}
              <div className="space-y-2 pt-1">
                <span className="text-xs font-bold text-neutral-800 flex items-center gap-1">
                  <Sparkles className="size-3.5 text-[#C62828]" />
                  <span>Optional Turnkey Add-ons</span>
                </span>
                <div className="space-y-2 text-xs">
                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-neutral-200 hover:border-neutral-300 cursor-pointer shadow-2xs">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={addons.printing}
                        onChange={(e) => setAddons((p) => ({ ...p, printing: e.target.checked }))}
                        className="rounded border-neutral-300 text-[#C62828] focus:ring-[#C62828]"
                      />
                      <div className="leading-tight">
                        <span className="font-bold block text-neutral-900">Vinyl Print & Mounting</span>
                        <span className="text-[10px] text-neutral-500">Weather-proof heavy duty flex</span>
                      </div>
                    </div>
                    <span className="font-bold text-[#C62828]">+{formatMoney(450, 'USD')}</span>
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-neutral-200 hover:border-neutral-300 cursor-pointer shadow-2xs">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={addons.creativeDesign}
                        onChange={(e) => setAddons((p) => ({ ...p, creativeDesign: e.target.checked }))}
                        className="rounded border-neutral-300 text-[#C62828] focus:ring-[#C62828]"
                      />
                      <div className="leading-tight">
                        <span className="font-bold block text-neutral-900">Creative Resizing & Design Audit</span>
                        <span className="text-[10px] text-neutral-500">OOH high-contrast optimization</span>
                      </div>
                    </div>
                    <span className="font-bold text-[#C62828]">+{formatMoney(250, 'USD')}</span>
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-neutral-200 hover:border-neutral-300 cursor-pointer shadow-2xs">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={addons.proofOfPlay}
                        onChange={(e) => setAddons((p) => ({ ...p, proofOfPlay: e.target.checked }))}
                        className="rounded border-neutral-300 text-[#C62828] focus:ring-[#C62828]"
                      />
                      <div className="leading-tight">
                        <span className="font-bold block text-neutral-900">Drone & Optical Proof-of-Play</span>
                        <span className="text-[10px] text-neutral-500">Timestamped inspection report</span>
                      </div>
                    </div>
                    <span className="font-bold text-emerald-600">+{formatMoney(150, 'USD')}</span>
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-neutral-200 hover:border-neutral-300 cursor-pointer shadow-2xs">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={addons.stormInsurance}
                        onChange={(e) => setAddons((p) => ({ ...p, stormInsurance: e.target.checked }))}
                        className="rounded border-neutral-300 text-[#C62828] focus:ring-[#C62828]"
                      />
                      <div className="leading-tight">
                        <span className="font-bold block text-neutral-900">Weather & Damage Warranty</span>
                        <span className="text-[10px] text-neutral-500">Instant 24-hr re-print cover</span>
                      </div>
                    </div>
                    <span className="font-bold text-[#C62828]">+{formatMoney(99, 'USD')}</span>
                  </label>
                </div>
              </div>

              {/* Price Calculation Box */}
              <div className="bg-white rounded-2xl p-3.5 border border-neutral-200 space-y-2 text-xs shadow-2xs">
                <div className="flex justify-between text-neutral-500">
                  <span>Base Rate ({selectedMonths} month{selectedMonths > 1 ? 's' : ''})</span>
                  <span>{formatMoney(rawTotal, 'USD')}</span>
                </div>
                {durationDiscountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Duration Discount ({durationDiscountPercent}%)</span>
                    <span>-{formatMoney(durationDiscountAmount, 'USD')}</span>
                  </div>
                )}
                {addonsCost > 0 && (
                  <div className="flex justify-between text-neutral-500">
                    <span>Selected Add-ons</span>
                    <span>+{formatMoney(addonsCost, 'USD')}</span>
                  </div>
                )}
                <div className="border-t border-neutral-100 pt-2 flex justify-between font-black text-sm text-neutral-900">
                  <span>Total Campaign Investment</span>
                  <span className="text-[#C62828] text-base font-display">
                    {formatMoney(finalCalculatedTotal, 'USD')}
                  </span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleInstantBuy}
                className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98"
              >
                <Zap className="size-4 fill-current" />
                <span>Instant 1-Click Checkout ({formatMoney(finalCalculatedTotal, 'USD')})</span>
              </button>
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full h-11 bg-white hover:bg-neutral-100 text-neutral-900 border border-neutral-200 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-2xs transition-colors"
              >
                <ShoppingCart className="size-4" />
                <span>Add to Campaign Cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
