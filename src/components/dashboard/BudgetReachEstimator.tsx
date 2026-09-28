import React, { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  DollarSign,
  Users,
  Target,
  BarChart,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Link } from "@tanstack/react-router";

export const BudgetReachEstimator: React.FC = () => {
  const [budget, setBudget] = useState<number>(7500);
  const [durationDays, setDurationDays] = useState<number>(30);
  const [selectedCity, setSelectedCity] = useState<string>("Dubai");
  const [formatType, setFormatType] = useState<string>("digital_screen");

  // Dynamic calculations
  const impressionsMultiplier =
    formatType === "digital_screen" ? 380 : formatType === "billboard" ? 420 : 310;
  const totalImpressions = Math.round(budget * impressionsMultiplier * (durationDays / 30));
  const uniqueReach = Math.round(totalImpressions * 0.28);
  const avgCpm = ((budget / totalImpressions) * 1000).toFixed(2);
  const avgFrequency = (totalImpressions / uniqueReach).toFixed(1);
  const brandLift = Math.min(52, Math.round(18 + (budget / 1000) * 1.5));

  return (
    <div className="rounded-2xl border border-neutral-200/90 bg-white p-5 sm:p-7 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-red-50 text-[#C62828]">
              <TrendingUp className="size-4" />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-neutral-900 font-display">
              Campaign Budget Estimator & Audience Reach Calculator
            </h3>
          </div>
          <p className="text-xs text-neutral-500">
            Model your audience delivery, estimated vehicular/pedestrian impressions, and effective
            CPM in real-time.
          </p>
        </div>

        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-auto">
          Sensor & Telemetry Grounded
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sliders and Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Budget Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-neutral-700">Campaign Flight Budget</span>
              <span className="text-sm font-black text-[#C62828] font-display">
                ${budget.toLocaleString()} USD
              </span>
            </div>
            <Slider
              value={[budget]}
              onValueChange={([val]) => setBudget(val)}
              min={1000}
              max={50000}
              step={500}
              className="py-1"
            />
            <div className="flex justify-between text-[10px] text-neutral-400">
              <span>$1,000 (Local Flash)</span>
              <span>$25,000</span>
              <span>$50,000 (City Roadblock)</span>
            </div>
          </div>

          {/* Duration Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-neutral-700">Flight Duration</span>
              <span className="text-sm font-black text-neutral-900 font-display">
                {durationDays} Days ({Math.round(durationDays / 7)} Weeks)
              </span>
            </div>
            <Slider
              value={[durationDays]}
              onValueChange={([val]) => setDurationDays(val)}
              min={7}
              max={90}
              step={7}
              className="py-1"
            />
            <div className="flex justify-between text-[10px] text-neutral-400">
              <span>1 Week (7 Days)</span>
              <span>1 Month (30 Days)</span>
              <span>1 Quarter (90 Days)</span>
            </div>
          </div>

          {/* Media Format & City Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <label className="text-xs font-medium text-neutral-700">Preferred Media Format</label>
              <select
                value={formatType}
                onChange={(e) => setFormatType(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-neutral-200 text-xs bg-white text-neutral-800"
              >
                <option value="digital_screen">Digital LED Spectaculars (DOOH)</option>
                <option value="billboard">Highway Unipoles & Hoardings</option>
                <option value="transit">Transit & Bus Fleet Wraps</option>
                <option value="airport">Airport International Terminals</option>
                <option value="mall">Luxury Mall Atriums</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-neutral-700">
                Target Metropolitan Hub
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-neutral-200 text-xs bg-white text-neutral-800"
              >
                <option value="Dubai">Dubai, UAE</option>
                <option value="Mumbai">Mumbai, India</option>
                <option value="New York">New York, USA</option>
                <option value="London">London, UK</option>
                <option value="Tokyo">Tokyo, Japan</option>
              </select>
            </div>
          </div>
        </div>

        {/* Forecast Output Scorecard (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-neutral-50/90 border border-neutral-200/90 flex flex-col justify-between gap-4">
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
              Estimated Delivery Metrics ({selectedCity})
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white border border-neutral-200 shadow-2xs">
                <span className="text-[10px] text-neutral-500 block mb-0.5">
                  Est. Total Impressions
                </span>
                <strong className="text-base sm:text-lg font-black text-neutral-900 font-display block">
                  {totalImpressions.toLocaleString()}+
                </strong>
                <span className="text-[10px] text-emerald-600 font-semibold">
                  100% verified sensors
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white border border-neutral-200 shadow-2xs">
                <span className="text-[10px] text-neutral-500 block mb-0.5">Est. Unique Reach</span>
                <strong className="text-base sm:text-lg font-black text-[#C62828] font-display block">
                  {uniqueReach.toLocaleString()}
                </strong>
                <span className="text-[10px] text-neutral-400">Unique commuters</span>
              </div>

              <div className="p-3 rounded-xl bg-white border border-neutral-200 shadow-2xs">
                <span className="text-[10px] text-neutral-500 block mb-0.5">Calculated CPM</span>
                <strong className="text-sm sm:text-base font-black text-neutral-900 font-display block">
                  ${avgCpm}
                </strong>
                <span className="text-[10px] text-neutral-400">Industry avg: $4.50</span>
              </div>

              <div className="p-3 rounded-xl bg-white border border-neutral-200 shadow-2xs">
                <span className="text-[10px] text-neutral-500 block mb-0.5">
                  Est. Brand Recall Lift
                </span>
                <strong className="text-sm sm:text-base font-black text-emerald-600 font-display block">
                  +{brandLift}%
                </strong>
                <span className="text-[10px] text-neutral-400">Avg frequency: {avgFrequency}x</span>
              </div>
            </div>
          </div>

          <Button
            asChild
            className="w-full h-9 text-xs font-bold bg-[#C62828] hover:bg-[#B71C1C] text-white shadow-2xs gap-1.5 rounded-xl"
          >
            <Link to="/browse" search={{ city: selectedCity, medium: formatType }}>
              <span>
                Find Spaces in {selectedCity} Under ${budget.toLocaleString()}
              </span>
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
