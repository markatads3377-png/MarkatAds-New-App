import React from "react";
import {
  Plus,
  FileText,
  Radio,
  RotateCcw,
  Sparkles,
  ExternalLink,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { ConsoleModeToggle } from "@/components/ConsoleModeToggle";
import { sellerStore } from "./sellerStore";

interface SellerHeaderProps {
  onOpenAddModal: () => void;
  onOpenProposalModal: () => void;
  onOpenRateCardModal: () => void;
  assetsCount: number;
  totalImpressions: string;
}

export const SellerHeader: React.FC<SellerHeaderProps> = ({
  onOpenAddModal,
  onOpenProposalModal,
  onOpenRateCardModal,
  assetsCount,
  totalImpressions,
}) => {
  const handleResetDemo = () => {
    sellerStore.resetToDemoFleet();
    toast.success("Demo fleet reset to standard high-yield inventory!");
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white shadow-xl">
      {/* Subtle grid pattern background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Left: Brand Identity & Telemetry */}
          <div>
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-amber-400">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-amber-500" />
                </span>
                Media Owner & Seller Console
              </span>
              <span aria-hidden="true">·</span>
              <span>Broadcasting 24/7</span>
              <span aria-hidden="true">·</span>
              <span>99.8% Fleet Uptime</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-300 font-medium">Verified Media Operator</span>
            </div>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl font-display">
              Media Selling & Fleet Operating System
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Manage your out-of-home inventory, monitor real-time gross & net earnings, schedule
              digital loops, issue agency proposals, and verify broadcast proofs.
            </p>

            {/* Quick Metrics Bar */}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs sm:gap-6">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-primary" />
                <span className="text-slate-400">Media Locations:</span>
                <span className="font-semibold text-white">{assetsCount} units</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-cyan-400" />
                <span className="text-slate-400">Total Footfall / DEC:</span>
                <span className="font-semibold text-white">{totalImpressions}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-400" />
                <span className="text-slate-400">Instant Escrow:</span>
                <span className="font-semibold text-emerald-400">Enabled</span>
              </div>
            </div>
          </div>

          {/* Right: Primary Action Cockpit & Console Mode Switcher */}
          <div className="flex flex-col items-start lg:items-end gap-3 sm:self-start lg:self-center">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Switch Platform Console:
            </span>
            <ConsoleModeToggle currentMode="seller" variant="pill" />

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Button
                onClick={onOpenAddModal}
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md font-semibold text-xs sm:text-sm h-9 px-3.5"
              >
                <Plus className="mr-1.5 size-4" />
                List New Media
              </Button>

              <Button
                variant="outline"
                onClick={onOpenProposalModal}
                className="border-slate-700 bg-slate-800/80 text-white hover:bg-slate-700 hover:text-white text-xs h-9 px-3"
              >
                <FileText className="mr-1.5 size-3.5 text-cyan-400" />
                RFP Quote
              </Button>

              <Button
                variant="outline"
                onClick={onOpenRateCardModal}
                className="border-slate-700 bg-slate-800/80 text-white hover:bg-slate-700 hover:text-white text-xs h-9 px-3"
              >
                <Sparkles className="mr-1.5 size-3.5 text-amber-400" />
                Rate Card
              </Button>

              <Button
                variant="ghost"
                size="icon"
                title="Reset to Demo Fleet"
                onClick={handleResetDemo}
                className="text-slate-400 hover:bg-slate-800 hover:text-white h-9 w-9"
              >
                <RotateCcw className="size-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
