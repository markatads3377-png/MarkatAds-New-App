import React, { useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Camera,
  Play,
  FileCheck,
  ShieldCheck,
  Layers,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export const CampaignTimelinePlanner: React.FC = () => {
  const [timelineType, setTimelineType] = useState<"dooh" | "static">("dooh");

  const STAGES_DOOH = [
    {
      day: "Day 1 - 2",
      title: "Creative Ingest & Spec Review",
      desc: "Our automated QC engine checks 4K/UHD video aspect ratios, frame rate, and compliance guidelines.",
      icon: FileCheck,
      status: "Automated QC",
      color: "text-blue-600 bg-blue-50 border-blue-200",
    },
    {
      day: "Day 3 - 4",
      title: "CMS Scheduling & Dayparting Configuration",
      desc: "Slots injected into the media owner's digital playback schedule (morning vs evening commuters).",
      icon: Layers,
      status: "Media Owner Sync",
      color: "text-purple-600 bg-purple-50 border-purple-200",
    },
    {
      day: "Day 5 - 28",
      title: "Live On-Air Flight & Telemetry",
      desc: "Your campaign airs across high-brightness LED networks with 24/7 web sensor monitoring.",
      icon: Play,
      status: "Live On-Air",
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
    {
      day: "Day 29 - 30",
      title: "Proof-of-Play & Drone Inspection Audit",
      desc: "Time-stamped photographic proof, vehicular impressions certificate, and campaign audit release.",
      icon: Camera,
      status: "Escrow Release",
      color: "text-[#C62828] bg-red-50 border-red-200",
    },
  ];

  const STAGES_STATIC = [
    {
      day: "Day 1 - 3",
      title: "High-Flux Vinyl Print & Preparation",
      desc: "Commercial 300 DPI flex printing with weather-proof UV coating and reinforced mounting borders.",
      icon: Layers,
      status: "Print House",
      color: "text-blue-600 bg-blue-50 border-blue-200",
    },
    {
      day: "Day 4 - 6",
      title: "Overnight Scaffolding & Mounting",
      desc: "Certified rigging technicians install flex banners on highway unipoles during low-traffic night hours.",
      icon: Clock,
      status: "Field Rigging",
      color: "text-amber-600 bg-amber-50 border-amber-200",
    },
    {
      day: "Day 7 - 30",
      title: "Dominant Arterial Highway Flight",
      desc: "Unobstructed continuous 24/7 brand exposure with high-power automated evening illumination.",
      icon: Play,
      status: "Live On-Air",
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
    {
      day: "Day 31",
      title: "Certified Drone Photography & De-Mount",
      desc: "4K high-angle drone proof-of-play report provided directly into your Mark@Ads dashboard.",
      icon: Camera,
      status: "Final Audit",
      color: "text-[#C62828] bg-red-50 border-red-200",
    },
  ];

  const currentStages = timelineType === "dooh" ? STAGES_DOOH : STAGES_STATIC;

  return (
    <div className="rounded-2xl border border-neutral-200/90 bg-white p-5 sm:p-7 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-red-50 text-[#C62828]">
              <Calendar className="size-4" />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-neutral-900 font-display">
              End-to-End Campaign Timeline Planner
            </h3>
          </div>
          <p className="text-xs text-neutral-500">
            Transparent flight milestones with 100% Escrow buyer protection from creative ingest to
            live on-air verification.
          </p>
        </div>

        {/* Timeline Format Switcher */}
        <div className="inline-flex rounded-xl border border-neutral-200 p-1 bg-neutral-50 text-xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setTimelineType("dooh")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              timelineType === "dooh"
                ? "bg-white text-neutral-900 shadow-2xs font-bold"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            Digital Screen / DOOH (Fast Track)
          </button>
          <button
            type="button"
            onClick={() => setTimelineType("static")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              timelineType === "static"
                ? "bg-white text-neutral-900 shadow-2xs font-bold"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            Static Highway Unipole (Print & Mount)
          </button>
        </div>
      </div>

      {/* 4-Stage Horizontal Pipeline */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentStages.map((stage, idx) => {
          const Icon = stage.icon;
          return (
            <div
              key={stage.title}
              className="p-4 rounded-xl border border-neutral-200/90 bg-neutral-50/50 hover:bg-white hover:border-neutral-300 transition-all flex flex-col justify-between gap-3 relative shadow-2xs group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider font-mono">
                    {stage.day}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${stage.color}`}
                  >
                    {stage.status}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-lg bg-white border border-neutral-200 grid place-items-center text-neutral-800 shadow-2xs">
                    <Icon className="size-3.5 text-[#C62828]" />
                  </div>
                  <h4 className="text-xs font-bold text-neutral-900 leading-snug">{stage.title}</h4>
                </div>

                <p className="text-[11px] text-neutral-500 leading-relaxed">{stage.desc}</p>
              </div>

              <div className="pt-2 border-t border-neutral-200/60 flex items-center justify-between text-[10px] text-neutral-400">
                <span>Milestone {idx + 1} of 4</span>
                <CheckCircle2 className="size-3.5 text-emerald-500" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
