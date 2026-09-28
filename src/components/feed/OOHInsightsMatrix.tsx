import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  TrendingUp,
  Target,
  Zap,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Eye,
  Clock,
  DollarSign,
  Building,
  Car,
  Plane,
  Train,
  ShoppingBag,
} from "lucide-react";
import { Link } from "@tanstack/react-router";

interface MediumGuide {
  id: string;
  name: string;
  icon: React.ElementType;
  cpmRange: string;
  dwellTime: string;
  recallRate: string;
  bestFor: string[];
  keyAdvantage: string;
  suitablePurchaseNote: string;
  filterParam: string;
}

const MEDIUM_GUIDES: MediumGuide[] = [
  {
    id: "dooh",
    name: "Digital Out-Of-Home (DOOH)",
    icon: Zap,
    cpmRange: "$8 - $18 CPM",
    dwellTime: "15 - 45 seconds",
    recallRate: "72% Visual Recall",
    bestFor: ["Fast Product Launches", "Time-Sensitive Flash Sales", "Tech & FinTech Brands"],
    keyAdvantage: "Dynamic dayparting (morning vs evening creatives) with zero print costs.",
    suitablePurchaseNote: "Ideal for brands wanting flexible flights and high-frequency rotations.",
    filterParam: "billboard",
  },
  {
    id: "highway",
    name: "Highway Arterial Unipoles",
    icon: Car,
    cpmRange: "$3 - $7 CPM",
    dwellTime: "30 - 90 seconds (Traffic)",
    recallRate: "68% Driver Recall",
    bestFor: ["Automotive Launches", "Real Estate Developers", "Mass FMCG Awareness"],
    keyAdvantage:
      "Unrivaled daily reach reaching 300,000+ daily vehicles at arterial city chokepoints.",
    suitablePurchaseNote: "Best for multi-month dominant brand presence on key commuter highways.",
    filterParam: "billboard",
  },
  {
    id: "airport",
    name: "Airport Mega Spectaculars",
    icon: Plane,
    cpmRange: "$22 - $45 CPM",
    dwellTime: "90 - 180 minutes",
    recallRate: "84% High-Affluence Recall",
    bestFor: ["Luxury Watches & Fashion", "B2B Enterprise SaaS", "Global Private Banking"],
    keyAdvantage: "Reaches high-net-worth international executives with unmatched dwell times.",
    suitablePurchaseNote:
      "Top choice for premium luxury positioning and global corporate credibility.",
    filterParam: "airport",
  },
  {
    id: "transit",
    name: "Transit Buses & Metro Screens",
    icon: Train,
    cpmRange: "$4 - $9 CPM",
    dwellTime: "45 - 120 seconds",
    recallRate: "65% Daily Habitual Recall",
    bestFor: ["Streaming & Entertainment", "App Installs", "E-Commerce Delivery Apps"],
    keyAdvantage: "Mobile street-level omnipresence traveling through pedestrian downtown hubs.",
    suitablePurchaseNote:
      "Perfect for high-density metropolitan coverage and grassroots street buzz.",
    filterParam: "transit",
  },
  {
    id: "mall",
    name: "Luxury Mall Atrium Displays",
    icon: ShoppingBag,
    cpmRange: "$10 - $24 CPM",
    dwellTime: "60 - 150 seconds",
    recallRate: "78% Path-To-Purchase Recall",
    bestFor: ["Cosmetics & Fragrance", "Footwear & Apparel", "Consumer Electronics"],
    keyAdvantage:
      "Zero-barrier path to purchase: shoppers are literally 50 steps from retail stores.",
    suitablePurchaseNote: "Recommended for retail brands looking to drive immediate weekend sales.",
    filterParam: "mall",
  },
];

export const OOHInsightsMatrix: React.FC = () => {
  const [selectedGoal, setSelectedGoal] = useState<"awareness" | "retail" | "affluent" | "viral">(
    "awareness",
  );
  const [selectedMedium, setSelectedMedium] = useState<MediumGuide>(MEDIUM_GUIDES[0]);

  // Matcher recommendation
  const getRecommendation = () => {
    switch (selectedGoal) {
      case "awareness":
        return {
          medium: "Highway Arterial Unipoles & City Gateways",
          reason:
            "Delivers maximum daily vehicular impressions and lowest overall CPM for building unshakeable brand recognition.",
          actionFilter: "billboard",
        };
      case "retail":
        return {
          medium: "Luxury Mall Atriums & Street Kiosks",
          reason:
            "Positioned directly inside high-footfall shopping centers to influence immediate buying decisions.",
          actionFilter: "mall",
        };
      case "affluent":
        return {
          medium: "International Airport Concourse Mega-LEDs",
          reason:
            "Extended 2+ hour passenger dwell with high concentration of business decision-makers and C-level leaders.",
          actionFilter: "airport",
        };
      case "viral":
        return {
          medium: "3D Anamorphic DOOH Screens (Times Square, Shibuya)",
          reason:
            "Naked-eye 3D optical illusions trigger viral social recording, earning 5x-10x social impressions on TikTok & Instagram.",
          actionFilter: "billboard",
        };
    }
  };

  const recommendation = getRecommendation();

  return (
    <section className="rounded-2xl border border-border/80 bg-card p-5 sm:p-7 space-y-6 shadow-xs">
      {/* Header */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
            <TrendingUp className="size-4" />
          </span>
          <h2 className="text-base sm:text-lg font-bold text-foreground font-display">
            OOH Medium Ecosystem Insights Matrix
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Compare out-of-home media formats, traffic dwell times, benchmark CPMs, and choose the
          most suitable purchase for your campaign.
        </p>
      </div>

      {/* Format Comparison Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {MEDIUM_GUIDES.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedMedium.id === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedMedium(item)}
              className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between gap-3 ${
                isSelected
                  ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary/30"
                  : "border-border/70 bg-background/50 hover:bg-muted/40 hover:border-border"
              }`}
            >
              <div className="space-y-2">
                <div className="size-8 rounded-lg bg-primary/10 text-primary grid place-items-center">
                  <Icon className="size-4" />
                </div>
                <h3 className="text-xs font-bold text-foreground leading-snug">{item.name}</h3>
                <div className="space-y-1 text-[11px] text-muted-foreground">
                  <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {item.cpmRange}
                  </p>
                  <p>⏱ {item.dwellTime}</p>
                  <p>👁 {item.recallRate}</p>
                </div>
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider block ${
                  isSelected ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {isSelected ? "● Selected Insight" : "View Breakdown"}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Medium Deep Dive */}
      <div className="p-4 sm:p-5 rounded-xl bg-muted/30 border border-border/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
              Deep Dive Analysis
            </span>
            <h4 className="text-sm sm:text-base font-bold text-foreground">
              {selectedMedium.name}
            </h4>
          </div>
          <Button asChild size="sm" className="h-8 text-xs font-semibold gap-1.5">
            <Link to="/browse" search={{ medium: selectedMedium.filterParam }}>
              <span>Buy {selectedMedium.name} Spaces</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="space-y-1.5 p-3 rounded-lg bg-background border border-border/60">
            <span className="font-bold text-foreground block">Key Advantage:</span>
            <p className="text-muted-foreground leading-relaxed">{selectedMedium.keyAdvantage}</p>
          </div>

          <div className="space-y-1.5 p-3 rounded-lg bg-background border border-border/60">
            <span className="font-bold text-foreground block">Best Advertiser Industries:</span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {selectedMedium.bestFor.map((ind) => (
                <span
                  key={ind}
                  className="px-2 py-0.5 rounded bg-muted text-[11px] font-medium text-foreground"
                >
                  {ind}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-1.5 p-3 rounded-lg bg-background border border-border/60">
            <span className="font-bold text-foreground block">Purchase Recommendation:</span>
            <p className="text-muted-foreground leading-relaxed">
              {selectedMedium.suitablePurchaseNote}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Medium Matcher Wizard */}
      <div className="p-5 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-muted/20 border border-primary/20 space-y-4">
        <div className="flex items-center gap-2">
          <Target className="size-4 text-primary" />
          <h3 className="text-sm font-bold text-foreground font-display">
            Interactive Format Matcher: What is Your Campaign Priority?
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: "awareness", label: "Mass Awareness & Reach" },
            { id: "retail", label: "Immediate Retail Sales" },
            { id: "affluent", label: "Affluent & C-Suite Target" },
            { id: "viral", label: "Viral Social Stunt / 3D DOOH" },
          ].map((goal) => (
            <button
              key={goal.id}
              type="button"
              onClick={() =>
                setSelectedGoal(goal.id as "awareness" | "retail" | "affluent" | "viral")
              }
              className={`p-2.5 rounded-lg border text-xs font-semibold text-center transition-all ${
                selectedGoal === goal.id
                  ? "border-primary bg-primary text-primary-foreground shadow-xs"
                  : "border-border/80 bg-background hover:bg-muted text-muted-foreground"
              }`}
            >
              {goal.label}
            </button>
          ))}
        </div>

        <div className="p-4 rounded-lg bg-background border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle className="size-3.5" /> Best Recommended Out-Of-Home Purchase
            </span>
            <h4 className="text-sm font-bold text-foreground">{recommendation.medium}</h4>
            <p className="text-xs text-muted-foreground">{recommendation.reason}</p>
          </div>

          <Button asChild size="sm" className="h-9 text-xs font-bold gap-1.5 shrink-0">
            <Link to="/browse" search={{ medium: recommendation.actionFilter }}>
              <span>View Matching Inventory</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
