import React from 'react';
import { X, Scale, Trash2, ShoppingCart, Eye, Sparkles, Star, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MEDIUM_OPTIONS } from '../data/mockCatalog';

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
  } = useApp();

  if (!isCompareOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200 select-none">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] flex flex-col border border-neutral-200 shadow-2xl overflow-hidden text-neutral-900">
        {/* Header */}
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-red-50 text-[#C62828] grid place-items-center">
              <Scale className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display text-neutral-900">
                Media Space Comparison Matrix
              </h3>
              <p className="text-xs text-neutral-500">
                Comparing {compareList.length} advertising space{compareList.length === 1 ? '' : 's'} side-by-side
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {compareList.length > 0 && (
              <button
                type="button"
                onClick={clearCompare}
                className="text-xs font-semibold text-rose-500 hover:text-rose-600 px-2 py-1"
              >
                Clear All
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsCompareOpen(false)}
              className="size-8 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 grid place-items-center"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Comparison Table / Empty State */}
        <div className="flex-1 overflow-auto p-5">
          {compareList.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="size-16 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
                <Scale className="size-8 opacity-40" />
              </div>
              <h4 className="font-bold text-neutral-800 text-sm">No media spaces selected for comparison</h4>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Click the "Compare" icon on any listing card to evaluate metrics like CPM, impressions, dimensions, and rates.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse min-w-[650px]">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50/70">
                    <th className="p-3.5 font-bold text-neutral-500 w-44">Metric / Attribute</th>
                    {compareList.map((item) => {
                      const mediumLbl =
                        MEDIUM_OPTIONS.find((m) => m.value === item.medium)?.label || item.medium;
                      return (
                        <th key={item.id} className="p-3.5 font-bold text-neutral-900 w-64 min-w-[220px]">
                          <div className="flex justify-between items-start gap-1 mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600 bg-neutral-200/80 px-2 py-0.5 rounded">
                              {mediumLbl}
                            </span>
                            <button
                              type="button"
                              onClick={() => toggleCompare(item)}
                              className="text-neutral-400 hover:text-rose-500 p-0.5"
                              title="Remove"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                          <div className="w-full h-28 rounded-xl overflow-hidden mb-2 bg-neutral-100 border border-neutral-200">
                            <img
                              src={item.images?.[0] || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500'}
                              alt={item.title}
                              className="size-full object-cover"
                            />
                          </div>
                          <h4 className="font-bold text-xs truncate text-neutral-900">{item.title}</h4>
                          <div className="text-[11px] text-neutral-500 flex items-center gap-1 mt-0.5 font-normal">
                            <MapPin className="size-3 text-[#C62828]" /> {item.city}, {item.country}
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {/* Price */}
                  <tr>
                    <td className="p-3.5 font-bold text-neutral-600 bg-neutral-50/50">Monthly Rate Card</td>
                    {compareList.map((item) => (
                      <td key={item.id} className="p-3.5 font-black text-sm text-[#C62828] font-display">
                        {formatMoney(item.pricePerMonth, item.currency)}
                        <span className="text-[10px] text-neutral-400 font-normal block">per month</span>
                      </td>
                    ))}
                  </tr>
                  {/* Daily Impressions */}
                  <tr>
                    <td className="p-3.5 font-bold text-neutral-600 bg-neutral-50/50">Daily Traffic Reach</td>
                    {compareList.map((item) => (
                      <td key={item.id} className="p-3.5 font-semibold text-neutral-900">
                        <span className="flex items-center gap-1 text-emerald-600">
                          <Eye className="size-3.5 shrink-0" />
                          {item.dailyImpressions}
                        </span>
                      </td>
                    ))}
                  </tr>
                  {/* Est CPM */}
                  <tr>
                    <td className="p-3.5 font-bold text-neutral-600 bg-neutral-50/50">Estimated CPM</td>
                    {compareList.map((item) => (
                      <td key={item.id} className="p-3.5 font-semibold text-neutral-900">
                        <span className="flex items-center gap-1 text-[#C62828]">
                          <Sparkles className="size-3.5" /> {item.cpm || '$2.10'}
                        </span>
                      </td>
                    ))}
                  </tr>
                  {/* Dimensions */}
                  <tr>
                    <td className="p-3.5 font-bold text-neutral-600 bg-neutral-50/50">Display Dimensions</td>
                    {compareList.map((item) => (
                      <td key={item.id} className="p-3.5 text-neutral-800 font-medium">
                        {item.size || "Standard 40' x 20'"}
                      </td>
                    ))}
                  </tr>
                  {/* Illumination */}
                  <tr>
                    <td className="p-3.5 font-bold text-neutral-600 bg-neutral-50/50">Illumination / Tech</td>
                    {compareList.map((item) => (
                      <td key={item.id} className="p-3.5 text-neutral-800 font-medium">
                        {item.lightingType || '24/7 Illuminated'}
                      </td>
                    ))}
                  </tr>
                  {/* Owner Rating */}
                  <tr>
                    <td className="p-3.5 font-bold text-neutral-600 bg-neutral-50/50">Owner Rating</td>
                    {compareList.map((item) => (
                      <td key={item.id} className="p-3.5 text-neutral-800 font-medium">
                        <span className="flex items-center gap-1">
                          <Star className="size-3.5 fill-amber-400 text-amber-400" />
                          {item.sellerRating || 4.9} ({item.sellerReviewsCount || 34})
                        </span>
                      </td>
                    ))}
                  </tr>
                  {/* Actions */}
                  <tr>
                    <td className="p-3.5 font-bold text-neutral-600 bg-neutral-50/50">Action</td>
                    {compareList.map((item) => (
                      <td key={item.id} className="p-3.5 space-y-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            addToCart(item);
                            setIsCompareOpen(false);
                          }}
                          className="w-full h-8 rounded-xl bg-[#C62828] hover:bg-[#B71C1C] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs"
                        >
                          <ShoppingCart className="size-3.5" />
                          <span>Add to Cart</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedListingForDetail(item);
                            setIsCompareOpen(false);
                          }}
                          className="w-full h-8 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-800 text-xs font-semibold"
                        >
                          View Full Details
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
