import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sparkles,
  Bot,
  Zap,
  Target,
  DollarSign,
  MapPin,
  TrendingUp,
  CheckCircle2,
  ShoppingCart,
  ArrowRight,
  PieChart,
} from "lucide-react";
import { useEcom } from "@/context/EcomContext";
import { MOCK_CATALOG, type ExtendedListing } from "@/data/mockCatalog";
import { toast } from "sonner";

interface AIMediaPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIMediaPlannerModal: React.FC<AIMediaPlannerModalProps> = ({ isOpen, onClose }) => {
  const { addToCart, setIsCartOpen, formatMoney } = useEcom();

  const [goal, setGoal] = useState<string>("awareness");
  const [budget, setBudget] = useState<number>(10000);
  const [city, setCity] = useState<string>("Dubai");
  const [durationWeeks, setDurationWeeks] = useState<number>(4);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [hasPlan, setHasPlan] = useState<boolean>(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setHasPlan(true);
      toast.success("AI Media Plan optimized with real-time OOH inventory!");
    }, 700);
  };

  // Recommended spaces based on city and budget
  const recommendedItems = MOCK_CATALOG.filter(
    (l) => l.city.toLowerCase() === city.toLowerCase() || l.city === "Dubai" || l.city === "Mumbai",
  ).slice(0, 3);

  const handleAddAllToCart = () => {
    recommendedItems.forEach((item) => {
      addToCart(item, 1, new Date().toISOString().split("T")[0]);
    });
    onClose();
    setIsCartOpen(true);
    toast.success(
      `Added ${recommendedItems.length} recommended campaign spaces to your flight cart!`,
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden bg-white border-neutral-200">
        <DialogHeader className="p-5 border-b border-neutral-100 bg-gradient-to-r from-red-50/50 to-neutral-50">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-[#C62828] text-white grid place-items-center shadow-xs">
              <Bot className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-neutral-900 font-display flex items-center gap-2">
                <span>AI Media Planner Assistant</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-[#C62828] font-bold">
                  v2.4 Smart Flight
                </span>
              </DialogTitle>
              <DialogDescription className="text-xs text-neutral-500">
                Generate an optimized multi-format OOH allocation plan based on your marketing
                objectives.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Step 1: Goal & Budget Controls */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-2">
                1. Campaign Primary Objective
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "awareness", label: "Mass Brand Reach", icon: TrendingUp },
                  { id: "retail", label: "Retail Footfall", icon: Target },
                  { id: "viral", label: "Viral 3D DOOH", icon: Zap },
                  { id: "corporate", label: "B2B / C-Suite", icon: Sparkles },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = goal === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setGoal(item.id)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                        isSelected
                          ? "border-[#C62828] bg-red-50/80 text-[#C62828] ring-1 ring-[#C62828]/30 shadow-2xs"
                          : "border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                      }`}
                    >
                      <Icon className="size-4" />
                      <span className="text-center">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-700">
                  Flight Budget ($ USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400">
                    $
                  </span>
                  <Input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    step={1000}
                    min={2000}
                    className="pl-7 h-9 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-700">
                  Target Metropolitan Hub
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-neutral-200 text-xs bg-white text-neutral-800"
                >
                  <option value="Dubai">Dubai, UAE</option>
                  <option value="Mumbai">Mumbai, India</option>
                  <option value="London">London, UK</option>
                  <option value="New York">New York, USA</option>
                  <option value="Tokyo">Tokyo, Japan</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-700">Flight Duration</label>
                <select
                  value={durationWeeks}
                  onChange={(e) => setDurationWeeks(Number(e.target.value))}
                  className="w-full h-9 px-3 rounded-lg border border-neutral-200 text-xs bg-white text-neutral-800"
                >
                  <option value={2}>2 Weeks (Flash Blitz)</option>
                  <option value={4}>1 Month (Standard Dominance)</option>
                  <option value={8}>2 Months (Quarterly Flight)</option>
                  <option value={12}>3 Months (Seasonal Roadblock)</option>
                </select>
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full h-9 text-xs font-bold bg-[#C62828] hover:bg-[#B71C1C] text-white shadow-2xs gap-2"
            >
              <Sparkles className="size-3.5" />
              <span>
                {isGenerating
                  ? "Analyzing 27,000+ Media Slots..."
                  : "Generate Optimized AI Media Plan"}
              </span>
            </Button>
          </div>

          {/* AI Plan Output */}
          {hasPlan && (
            <div className="p-4 sm:p-5 rounded-2xl bg-neutral-50/80 border border-neutral-200/90 space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-emerald-600" />
                  <span>Optimized Media Mix Allocation</span>
                </span>
                <span className="text-xs font-bold text-[#C62828]">
                  Est. CPM: $2.40 • 96% Match
                </span>
              </div>

              {/* Forecast Stats */}
              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="p-3 rounded-xl bg-white border border-neutral-200 shadow-2xs">
                  <span className="text-[10px] text-neutral-400 block font-medium">
                    Est. Impressions
                  </span>
                  <strong className="text-sm font-black text-neutral-900 font-display">
                    {(budget * 420).toLocaleString()}+
                  </strong>
                </div>

                <div className="p-3 rounded-xl bg-white border border-neutral-200 shadow-2xs">
                  <span className="text-[10px] text-neutral-400 block font-medium">
                    Unique Reach
                  </span>
                  <strong className="text-sm font-black text-emerald-600 font-display">
                    {(budget * 95).toLocaleString()}+
                  </strong>
                </div>

                <div className="p-3 rounded-xl bg-white border border-neutral-200 shadow-2xs">
                  <span className="text-[10px] text-neutral-400 block font-medium">
                    Recommended Spaces
                  </span>
                  <strong className="text-sm font-black text-neutral-900 font-display">
                    {recommendedItems.length} High-Impact
                  </strong>
                </div>
              </div>

              {/* Format Split Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-semibold text-neutral-600">
                  <span>50% Arterial Highway DOOH</span>
                  <span>30% Luxury Mall LED</span>
                  <span>20% Transit Network</span>
                </div>
                <div className="w-full h-2.5 rounded-full overflow-hidden flex bg-neutral-200">
                  <div className="w-1/2 bg-[#C62828]" title="50% Highway DOOH" />
                  <div className="w-[30%] bg-amber-500" title="30% Mall LED" />
                  <div className="w-1/5 bg-blue-600" title="20% Transit" />
                </div>
              </div>

              {/* Recommended Inventory List */}
              <div className="space-y-2 pt-1">
                <span className="text-xs font-bold text-neutral-900 block">
                  Curated Flight Inventory ({city})
                </span>
                <div className="space-y-2">
                  {recommendedItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-xl bg-white border border-neutral-200 flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="size-10 rounded-lg object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <h5 className="text-xs font-bold text-neutral-900 truncate">
                            {item.title}
                          </h5>
                          <span className="text-[10px] text-neutral-500 capitalize">
                            {item.medium} • {item.city} • {item.daily_impressions || "500K+ daily"}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-emerald-600 block">
                          ${item.price_per_day || 250}/day
                        </span>
                        <span className="text-[10px] text-neutral-400">Live Available</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <span className="text-[11px] text-neutral-500">
                  100% Escrow protected flight booking
                </span>
                <Button
                  onClick={handleAddAllToCart}
                  className="h-8.5 text-xs font-bold bg-[#C62828] hover:bg-[#B71C1C] text-white shadow-2xs gap-1.5"
                >
                  <ShoppingCart className="size-3.5" />
                  <span>Book Recommended Flight (1-Click)</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
