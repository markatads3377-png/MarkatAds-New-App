import React, { useState } from "react";
import { MapPin, Navigation, ExternalLink, Eye, DollarSign, Sparkles } from "lucide-react";
import { type ExtendedListing } from "@/data/mockCatalog";
import { Button } from "@/components/ui/button";
import { useEcom } from "@/context/EcomContext";

interface InteractiveMapViewProps {
  listings: ExtendedListing[];
  onSelectListing: (listing: ExtendedListing) => void;
}

export const InteractiveMapView: React.FC<InteractiveMapViewProps> = ({
  listings,
  onSelectListing,
}) => {
  const { formatMoney } = useEcom();
  const [activeListing, setActiveListing] = useState<ExtendedListing>(listings[0]);

  // Projected SVG coordinates for global cities
  const cityPositions: Record<string, { x: number; y: number }> = {
    Dubai: { x: 62, y: 44 },
    Mumbai: { x: 69, y: 49 },
    "New York": { x: 26, y: 35 },
    London: { x: 48, y: 28 },
    Tokyo: { x: 86, y: 38 },
    Singapore: { x: 77, y: 58 },
    Paris: { x: 50, y: 32 },
  };

  return (
    <div className="rounded-2xl border border-neutral-200/90 bg-neutral-900 overflow-hidden relative shadow-md">
      {/* Map Header Overlay */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-neutral-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-neutral-800 text-white text-xs">
        <Navigation className="size-3.5 text-[#C62828] animate-pulse" />
        <span className="font-semibold">Interactive Global Inventory Map</span>
        <span className="text-neutral-500">•</span>
        <span className="text-neutral-400">{listings.length} live pins</span>
      </div>

      {/* Styled World Map SVG Canvas */}
      <div className="relative w-full h-[380px] sm:h-[460px] bg-neutral-950 flex items-center justify-center overflow-hidden">
        {/* Abstract World Grid Pattern */}
        <svg
          className="absolute inset-0 w-full h-full opacity-25"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="grid-pattern" width="30" height="30" patternUnits="userSpaceOnUse">
              <path
                d="M 30 0 L 0 0 0 30"
                fill="none"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="0.8"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>

        {/* Global Hub Map Pins */}
        {listings.map((item) => {
          const pos = cityPositions[item.city] || { x: 50, y: 50 };
          const isSelected = activeListing.id === item.id;

          return (
            <div
              key={item.id}
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2 transition-transform duration-200"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              <button
                type="button"
                onClick={() => setActiveListing(item)}
                className={`relative group flex items-center gap-1.5 p-1 rounded-full transition-all ${
                  isSelected ? "scale-125 z-30" : "hover:scale-110 opacity-90 hover:opacity-100"
                }`}
              >
                <span
                  className={`size-7 rounded-full flex items-center justify-center text-white shadow-lg font-bold text-[10px] transition-colors ${
                    isSelected
                      ? "bg-[#C62828] ring-4 ring-[#C62828]/40"
                      : "bg-neutral-800 hover:bg-[#C62828] border border-neutral-700"
                  }`}
                >
                  <MapPin className="size-3.5 fill-current" />
                </span>

                <span
                  className={`hidden sm:inline-block px-2 py-0.5 rounded-md text-[10px] font-bold text-white shadow-md whitespace-nowrap transition-colors ${
                    isSelected ? "bg-[#C62828]" : "bg-neutral-900/90 border border-neutral-800"
                  }`}
                >
                  ${item.price_per_day || 250}/d
                </span>
              </button>
            </div>
          );
        })}

        {/* Active Space Detail Card Floating in Bottom-Left */}
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-30 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-neutral-200 shadow-xl flex items-center gap-3.5 animate-in slide-in-from-bottom duration-250">
          <img
            src={activeListing.images[0]}
            alt={activeListing.title}
            className="size-18 sm:size-20 rounded-xl object-cover shrink-0"
          />

          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-red-50 text-[#C62828]">
                {activeListing.medium.replace("_", " ")}
              </span>
              <span className="text-[10px] text-neutral-500 font-medium">
                {activeListing.city}, {activeListing.country}
              </span>
            </div>

            <h4 className="text-xs font-bold text-neutral-900 truncate">{activeListing.title}</h4>

            <div className="flex items-center justify-between pt-0.5">
              <span className="text-xs font-black text-neutral-900 font-display">
                ${activeListing.price_per_day || 250}{" "}
                <span className="text-[10px] text-neutral-500 font-normal">/ day</span>
              </span>

              <Button
                size="sm"
                onClick={() => onSelectListing(activeListing)}
                className="h-7 text-[11px] font-bold bg-[#C62828] hover:bg-[#B71C1C] text-white px-2.5 rounded-lg shadow-2xs gap-1"
              >
                <span>View Details</span>
                <ExternalLink className="size-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
