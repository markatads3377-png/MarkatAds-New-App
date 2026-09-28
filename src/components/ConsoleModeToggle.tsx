import React from "react";
import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import { ShoppingBag, Building2, Check, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface ConsoleModeToggleProps {
  currentMode: "buyer" | "seller";
  variant?: "pill" | "banner" | "compact";
  className?: string;
}

export const ConsoleModeToggle: React.FC<ConsoleModeToggleProps> = ({
  currentMode,
  variant = "pill",
  className = "",
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSwitch = (target: "buyer" | "seller") => {
    if (target === currentMode) return;

    // Cache user role preference
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("markatads_user_profile");
        if (cached) {
          const parsed = JSON.parse(cached);
          parsed.role = target;
          localStorage.setItem("markatads_user_profile", JSON.stringify(parsed));
        }
      } catch {
        // ignore
      }
    }

    if (target === "buyer") {
      toast.success("Switched to Buyer Console", {
        description: "View booked mediums, flight analytics, and proof of play.",
      });
      navigate({ to: "/buyer" });
    } else {
      toast.success("Switched to Seller Console", {
        description: "Manage media listings, track earnings, and review bookings.",
      });
      navigate({ to: "/seller" });
    }
  };

  // 1. Compact Header Switcher (for Navigation bar)
  if (variant === "compact") {
    return (
      <div
        className={`inline-flex items-center p-1 rounded-xl bg-muted/80 border border-border/80 shadow-xs ${className}`}
        role="group"
        aria-label="Console Switcher"
      >
        <button
          type="button"
          onClick={() => handleSwitch("buyer")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
            currentMode === "buyer"
              ? "bg-background text-primary shadow-xs border border-border/60"
              : "text-muted-foreground hover:text-foreground hover:bg-background/50"
          }`}
          title="Switch to Buyer Console (Track booked mediums & flights)"
        >
          <ShoppingBag className="w-3.5 h-3.5 text-blue-500" />
          <span>Buyer</span>
          {currentMode === "buyer" && (
            <span className="size-1.5 rounded-full bg-blue-500 animate-pulse ml-0.5" />
          )}
        </button>

        <button
          type="button"
          onClick={() => handleSwitch("seller")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
            currentMode === "seller"
              ? "bg-background text-amber-600 dark:text-amber-400 shadow-xs border border-border/60"
              : "text-muted-foreground hover:text-foreground hover:bg-background/50"
          }`}
          title="Switch to Seller Console (List media & earn revenue)"
        >
          <Building2 className="w-3.5 h-3.5 text-amber-500" />
          <span>Seller</span>
          {currentMode === "seller" && (
            <span className="size-1.5 rounded-full bg-amber-500 animate-pulse ml-0.5" />
          )}
        </button>
      </div>
    );
  }

  // 2. Ultra-convincing Pill Toggle (Prominent on Console pages)
  return (
    <div
      className={`inline-flex flex-col sm:flex-row items-center gap-2 p-1.5 rounded-2xl bg-slate-900/90 dark:bg-slate-950 border border-slate-700/80 shadow-lg text-xs backdrop-blur-md ${className}`}
    >
      <div className="flex items-center gap-1.5 w-full sm:w-auto">
        {/* BUYER OPTION */}
        <button
          type="button"
          onClick={() => handleSwitch("buyer")}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-200 cursor-pointer ${
            currentMode === "buyer"
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 ring-1 ring-white/20"
              : "text-slate-300 hover:text-white hover:bg-slate-800/60"
          }`}
        >
          <div
            className={`size-6 rounded-lg grid place-items-center ${
              currentMode === "buyer" ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs sm:text-sm">Buyer Console</span>
              {currentMode === "buyer" && (
                <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-extrabold uppercase tracking-wider text-white">
                  Active
                </span>
              )}
            </div>
            <div className="text-[10px] opacity-80 hidden md:block">
              Book & Track Media Campaigns
            </div>
          </div>
        </button>

        {/* SELLER OPTION */}
        <button
          type="button"
          onClick={() => handleSwitch("seller")}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-200 cursor-pointer ${
            currentMode === "seller"
              ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-500/25 ring-1 ring-white/20"
              : "text-slate-300 hover:text-white hover:bg-slate-800/60"
          }`}
        >
          <div
            className={`size-6 rounded-lg grid place-items-center ${
              currentMode === "seller" ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs sm:text-sm">Seller Console</span>
              {currentMode === "seller" && (
                <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-extrabold uppercase tracking-wider text-white">
                  Active
                </span>
              )}
            </div>
            <div className="text-[10px] opacity-80 hidden md:block">List Spaces & Earn Revenue</div>
          </div>
        </button>
      </div>
    </div>
  );
};
