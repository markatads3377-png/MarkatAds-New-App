import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import {
  Building2,
  Calendar,
  Camera,
  CheckCircle2,
  Clock,
  Compass,
  Download,
  Eye,
  FileText,
  Filter,
  Flame,
  GitCompareArrows,
  Heart,
  HelpCircle,
  Layers,
  MapPin,
  Megaphone,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Upload,
  UserCheck,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SiteHeader } from "@/components/SiteHeader";
import { ListingCard } from "@/components/ListingCard";
import { ConsoleModeToggle } from "@/components/ConsoleModeToggle";
import { useAuth } from "@/hooks/useAuth";
import { useEcom } from "@/context/EcomContext";
import { useLiveCatalog } from "@/hooks/useLiveCatalog";
import { formatPrice, mediumLabel, MEDIUMS } from "@/lib/mediums";

export const Route = createFileRoute("/_authenticated/buyer")({
  head: () => ({
    meta: [
      { title: "Advertiser & Buyer Console — Mark@Ads" },
      {
        name: "description",
        content:
          "Enterprise campaign dispatch console for brand advertisers and media buyers. Track booked mediums, live audience delivery, escrow protection, and proof of play.",
      },
      {
        property: "og:title",
        content: "Advertiser & Buyer Console — Mark@Ads",
      },
      {
        property: "og:description",
        content:
          "Manage booked media spaces, monitor impressions delivered, and inspect live webcam proof of play.",
      },
    ],
  }),
  component: BuyerDashboard,
});

export interface BookedMediumFlight {
  id: string;
  orderNumber: string;
  title: string;
  medium: string;
  city: string;
  country: string;
  address: string;
  size: string;
  resolution?: string;
  imageUrl: string;
  flightStartDate: string;
  flightEndDate: string;
  daysRemaining: number;
  totalAmount: number;
  currency: string;
  status: "broadcasting" | "scheduled" | "completed" | "creative_review";
  escrowStatus: "protected" | "settled";
  impressionsDelivered: number;
  totalTargetImpressions: number;
  cpm: string;
  creativeAssetUrl?: string;
  creativeFileName?: string;
  creativeStatus: "approved" | "pending_upload" | "reviewing";
  proofOfPlayVerified: boolean;
  popPhotoUrl?: string;
  cameraName?: string;
  verificationTimestamp?: string;
  sellerName: string;
  bookedAt: string;
}

const INITIAL_BUYER_FLIGHTS: BookedMediumFlight[] = [
  {
    id: "flight-101",
    orderNumber: "FLIGHT-2026-091",
    title: "Times Square Broadway 4K Curved Spectacular",
    medium: "digital_screen",
    city: "New York",
    country: "United States",
    address: "Broadway & 47th St, Times Square, NY 10036",
    size: "30ft x 70ft Curved LED Display",
    resolution: "3840 x 2160 (4K UHD 60FPS)",
    imageUrl:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80",
    flightStartDate: "2026-09-01",
    flightEndDate: "2026-11-30",
    daysRemaining: 65,
    totalAmount: 55500,
    currency: "USD",
    status: "broadcasting",
    escrowStatus: "protected",
    impressionsDelivered: 12400000,
    totalTargetImpressions: 40500000,
    cpm: "$1.37",
    creativeAssetUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    creativeFileName: "Nike_AirMax_4K_TimesSquare_Master.mp4",
    creativeStatus: "approved",
    proofOfPlayVerified: true,
    popPhotoUrl:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1000&auto=format&fit=crop&q=80",
    cameraName: "TimesSquare-PTZ-North-Cam01",
    verificationTimestamp: "Live 2026-09-26 14:15:32 EST",
    sellerName: "PrimeMedia Manhattan LLC",
    bookedAt: "2026-08-20",
  },
  {
    id: "flight-102",
    orderNumber: "FLIGHT-2026-084",
    title: "Dubai Mall Grand Atrium Ultra-HD LED",
    medium: "indoor_mall_screen",
    city: "Dubai",
    country: "United Arab Emirates",
    address: "Grand Atrium Level 1, The Dubai Mall, Downtown Dubai",
    size: "8m x 4m Ultra-HD LED",
    resolution: "3840 x 1920 (4K P2.5)",
    imageUrl:
      "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=1200&auto=format&fit=crop&q=80",
    flightStartDate: "2026-08-15",
    flightEndDate: "2026-11-15",
    daysRemaining: 50,
    totalAmount: 32000,
    currency: "USD",
    status: "broadcasting",
    escrowStatus: "protected",
    impressionsDelivered: 9200000,
    totalTargetImpressions: 19800000,
    cpm: "$1.61",
    creativeAssetUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    creativeFileName: "Dubai_Luxury_FallCollection_UltraHD.mp4",
    creativeStatus: "approved",
    proofOfPlayVerified: true,
    popPhotoUrl:
      "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=1000&auto=format&fit=crop&q=80",
    cameraName: "DubaiMall-Atrium-Fixed-Cam04",
    verificationTimestamp: "Live 2026-09-26 18:40:11 GST",
    sellerName: "Emaar Media Network",
    bookedAt: "2026-08-01",
  },
  {
    id: "flight-103",
    orderNumber: "FLIGHT-2026-079",
    title: "London Underground Oxford Circus Digital Ribbons",
    medium: "transit",
    city: "London",
    country: "United Kingdom",
    address: "Oxford Circus Station Concourse, London W1B 3AG",
    size: "16-Screen Synchronized Array",
    resolution: "1080p HD Network",
    imageUrl:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&auto=format&fit=crop&q=80",
    flightStartDate: "2026-09-10",
    flightEndDate: "2026-10-31",
    daysRemaining: 35,
    totalAmount: 18800,
    currency: "USD",
    status: "broadcasting",
    escrowStatus: "protected",
    impressionsDelivered: 4100000,
    totalTargetImpressions: 9200000,
    cpm: "$2.04",
    creativeAssetUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    creativeFileName: "OxfordCircus_Escalator_Synchronized.mp4",
    creativeStatus: "approved",
    proofOfPlayVerified: true,
    popPhotoUrl:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1000&auto=format&fit=crop&q=80",
    cameraName: "TfL-Escalator-Inspection-Feed",
    verificationTimestamp: "Live 2026-09-26 19:10:00 GMT",
    sellerName: "TfL Media Network UK",
    bookedAt: "2026-08-25",
  },
  {
    id: "flight-104",
    orderNumber: "FLIGHT-2026-102",
    title: "Shibuya Crossing 3D Anamorphic LED Domination",
    medium: "digital_screen",
    city: "Tokyo",
    country: "Japan",
    address: "1-1 Udagawacho, Shibuya City, Tokyo 150-0042",
    size: "18m x 9m 8K Curved Display",
    resolution: "7680 x 3840 (8K Ultra 120Hz)",
    imageUrl:
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&auto=format&fit=crop&q=80",
    flightStartDate: "2026-10-15",
    flightEndDate: "2026-12-15",
    daysRemaining: 80,
    totalAmount: 48000,
    currency: "USD",
    status: "scheduled",
    escrowStatus: "protected",
    impressionsDelivered: 0,
    totalTargetImpressions: 39000000,
    cpm: "$1.23",
    creativeFileName: "Tokyo_3D_Cat_Anamorphic_V3.mov",
    creativeStatus: "reviewing",
    proofOfPlayVerified: false,
    sellerName: "Dentsu DOOH Tokyo",
    bookedAt: "2026-09-22",
  },
  {
    id: "flight-105",
    orderNumber: "FLIGHT-2026-061",
    title: "Bandra Western Express Highway Unipole Hoarding",
    medium: "outdoor_hoarding",
    city: "Mumbai",
    country: "India",
    address: "Western Express Highway, Bandra East, Mumbai 400051",
    size: "40ft x 20ft (800 sq.ft)",
    resolution: "Frontlit High-Res Flex (300 DPI)",
    imageUrl:
      "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&auto=format&fit=crop&q=80",
    flightStartDate: "2026-07-01",
    flightEndDate: "2026-09-15",
    daysRemaining: 0,
    totalAmount: 11000,
    currency: "USD",
    status: "completed",
    escrowStatus: "settled",
    impressionsDelivered: 28500000,
    totalTargetImpressions: 28500000,
    cpm: "$0.38",
    creativeFileName: "Mumbai_Bandra_Printed_Flex_300DPI.tiff",
    creativeStatus: "approved",
    proofOfPlayVerified: true,
    popPhotoUrl:
      "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1000&auto=format&fit=crop&q=80",
    cameraName: "WesternExpress-Highway-Cam02",
    verificationTimestamp: "Flight Completed & Certified",
    sellerName: "Apex Outdoor Media India",
    bookedAt: "2026-06-15",
  },
];

const LOCAL_BUYER_FLIGHTS_KEY = "markatads_buyer_booked_flights_v2";

function BuyerDashboard() {
  const { session, username, displayName, role } = useAuth();
  const navigate = useNavigate();
  const {
    formatMoney,
    wishlist,
    isWishlisted,
    toggleWishlist,
    compareList,
    toggleCompare,
    isCompared,
  } = useEcom();
  const { listings: liveCatalogListings } = useLiveCatalog();

  // Booked mediums state
  const [flights, setFlights] = useState<BookedMediumFlight[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(LOCAL_BUYER_FLIGHTS_KEY);
        if (saved) return JSON.parse(saved);
        localStorage.setItem(LOCAL_BUYER_FLIGHTS_KEY, JSON.stringify(INITIAL_BUYER_FLIGHTS));
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_BUYER_FLIGHTS;
  });

  const [activeTab, setActiveTab] = useState("flights");
  const [flightStatusFilter, setFlightStatusFilter] = useState("all");

  // Marketplace search inside buyer portal
  const [searchQuery, setSearchQuery] = useState("");
  const [mediumFilter, setMediumFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("");

  // Creative artwork upload modal
  const [isArtworkModalOpen, setIsArtworkModalOpen] = useState(false);
  const [targetFlight, setTargetFlight] = useState<BookedMediumFlight | null>(null);
  const [artworkFileUrl, setArtworkFileUrl] = useState("");
  const [artworkFileName, setArtworkFileName] = useState("");

  // PoP inspection modal
  const [isPoPModalOpen, setIsPoPModalOpen] = useState(false);
  const [selectedPoPFlight, setSelectedPoPFlight] = useState<BookedMediumFlight | null>(null);

  // Sync flights with localStorage
  const saveFlights = (newFlights: BookedMediumFlight[]) => {
    setFlights(newFlights);
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_BUYER_FLIGHTS_KEY, JSON.stringify(newFlights));
      window.dispatchEvent(new Event("markatads_buyer_sync"));
    }
  };

  // Buyer Analytics Computations
  const totalMediumsBought = flights.length;

  const totalSpend = useMemo(() => {
    return flights.reduce((sum, f) => sum + (f.totalAmount || 0), 0);
  }, [flights]);

  const totalDeliveredImpressions = useMemo(() => {
    return flights.reduce((sum, f) => sum + (f.impressionsDelivered || 0), 0);
  }, [flights]);

  const activeBroadcastingCount = useMemo(() => {
    return flights.filter((f) => f.status === "broadcasting").length;
  }, [flights]);

  const scheduledCount = useMemo(() => {
    return flights.filter((f) => f.status === "scheduled").length;
  }, [flights]);

  const completedCount = useMemo(() => {
    return flights.filter((f) => f.status === "completed").length;
  }, [flights]);

  const blendedCPM = useMemo(() => {
    if (totalDeliveredImpressions === 0) return "$0.00";
    const cpmVal = (totalSpend / (totalDeliveredImpressions / 1000)).toFixed(2);
    return `$${cpmVal}`;
  }, [totalSpend, totalDeliveredImpressions]);

  const escrowProtectedTotal = useMemo(() => {
    return flights
      .filter((f) => f.escrowStatus === "protected")
      .reduce((sum, f) => sum + f.totalAmount, 0);
  }, [flights]);

  // Filtered flights
  const filteredFlights = useMemo(() => {
    if (flightStatusFilter === "all") return flights;
    return flights.filter((f) => f.status === flightStatusFilter);
  }, [flights, flightStatusFilter]);

  // Filtered live catalog for buyer browsing
  const filteredCatalog = useMemo(() => {
    return liveCatalogListings.filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const mTitle = item.title.toLowerCase().includes(q);
        const mCity = item.city.toLowerCase().includes(q);
        const mCountry = item.country.toLowerCase().includes(q);
        if (!mTitle && !mCity && !mCountry) return false;
      }
      if (mediumFilter !== "all" && item.medium !== mediumFilter) return false;
      if (cityFilter.trim() && !item.city.toLowerCase().includes(cityFilter.toLowerCase().trim())) {
        return false;
      }
      return true;
    });
  }, [liveCatalogListings, searchQuery, mediumFilter, cityFilter]);

  // Handle Switch to Seller Portal
  const handleSwitchToSeller = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("markatads_user_role", "seller");
    }
    toast.success("Switched console to Media Owner (Seller) Platform!");
    navigate({ to: "/seller" });
  };

  // Upload creative handler
  const handleUploadArtwork = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetFlight || !artworkFileUrl.trim()) {
      toast.error("Please provide a valid creative asset URL.");
      return;
    }
    const updated = flights.map((f) => {
      if (f.id === targetFlight.id) {
        return {
          ...f,
          creativeAssetUrl: artworkFileUrl.trim(),
          creativeFileName: artworkFileName.trim() || "Brand_Campaign_Creative_Master.mp4",
          creativeStatus: "reviewing" as const,
        };
      }
      return f;
    });
    saveFlights(updated);
    toast.success(`Creative submitted for "${targetFlight.title}". Verification in progress.`);
    setIsArtworkModalOpen(false);
    setArtworkFileUrl("");
    setArtworkFileName("");
  };

  const handleDownloadInvoice = (flight: BookedMediumFlight) => {
    toast.success(
      `Downloading certified Tax Invoice & Escrow Flight Receipt #${flight.orderNumber} (PDF)...`,
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8 space-y-6">
        {/* TOP PERSISTENT CONSOLE MODE SWITCHER BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-card border border-border/80 rounded-2xl shadow-xs">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider pl-1">
              Console Mode:
            </span>
            <ConsoleModeToggle currentMode="buyer" variant="compact" />
          </div>

          <div className="flex items-center gap-2">
            <Button
              asChild
              size="sm"
              className="bg-primary hover:bg-primary/90 text-xs font-semibold h-8 shadow-xs"
            >
              <Link to="/browse">
                <Compass className="mr-1.5 size-3.5" /> Book Media Spaces
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="text-xs font-semibold h-8">
              <Link to="/pricing">Pricing & Plans</Link>
            </Button>
          </div>
        </div>

        {/* 1. STRICT ROLE HEADER: ADVERTISER & BUYER CONSOLE */}
        <div className="relative overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-900 text-white shadow-xl p-6 sm:p-8">
          <div
            className="pointer-events-none absolute inset-0 opacity-15"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Left: Console Scope & Advertiser Status */}
            <div>
              <div className="flex flex-wrap items-center gap-2.5 text-xs text-blue-300">
                <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-emerald-400">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  Buyer & Advertiser Console
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  Active Account: {displayName || username ? `@${username}` : "Verified Brand"}
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-300">100% Escrow Flight Guarantee</span>
              </div>

              <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl font-display">
                Campaign Dispatch & Flight Cockpit
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-300">
                Monitor all advertising media you have purchased, track real-time footfall delivery,
                inspect live Proof-of-Play webcam streams, and manage campaign creative files.
              </p>

              {/* Quick Summary Pill Bar */}
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs sm:gap-6">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-400" />
                  <span className="text-slate-400">Bought Mediums:</span>
                  <span className="font-semibold text-white">{totalMediumsBought} Spaces</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-cyan-400" />
                  <span className="text-slate-400">Audience Impressions:</span>
                  <span className="font-semibold text-white">
                    {(totalDeliveredImpressions / 1000000).toFixed(1)}M Delivered
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-amber-400" />
                  <span className="text-slate-400">In Escrow:</span>
                  <span className="font-semibold text-amber-400">
                    {formatPrice(escrowProtectedTotal)} Protected
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Dedicated Convincing Console Mode Switcher */}
            <div className="flex flex-col items-start lg:items-end gap-3 sm:self-start lg:self-center">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Switch Platform Console:
              </span>
              <ConsoleModeToggle currentMode="buyer" variant="pill" />
            </div>
          </div>
        </div>

        {/* 2. BUYER ANALYTICS COCKPIT ("buyer portel also give the analytics show the how many mediums buy and all details") */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Metric 1: Total Mediums Bought */}
          <Card className="border-border/80 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />
            <CardContent className="p-5">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Total Mediums Bought</span>
                <span className="text-primary font-semibold">
                  {activeBroadcastingCount} Live on Air
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold font-display tracking-tight text-foreground">
                {totalMediumsBought} Media Spaces
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <span>{scheduledCount} scheduled</span>
                <span aria-hidden="true">·</span>
                <span>{completedCount} completed</span>
              </div>
            </CardContent>
          </Card>

          {/* Metric 2: Total Campaign Spend in Escrow */}
          <Card className="border-border/80 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600" />
            <CardContent className="p-5">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Total Campaign Budget</span>
                <span className="flex items-center text-emerald-600 dark:text-emerald-400 font-medium">
                  <ShieldCheck className="size-3.5 mr-0.5" /> Escrow Protected
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold font-display tracking-tight text-emerald-600 dark:text-emerald-400">
                {formatPrice(totalSpend, "USD")}
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <span>Funds auto-release only upon PoP audit</span>
              </div>
            </CardContent>
          </Card>

          {/* Metric 3: Delivered Audience Footfall */}
          <Card className="border-border/80 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
            <CardContent className="p-5">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Verified Reach Delivered</span>
                <span className="text-purple-600 dark:text-purple-400 font-semibold">
                  100% Certified
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold font-display tracking-tight text-foreground">
                {(totalDeliveredImpressions / 1000000).toFixed(2)}M Impressions
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <span>Audited by Geopath, Route UK & Ipsos</span>
              </div>
            </CardContent>
          </Card>

          {/* Metric 4: Effective CPM / Efficiency */}
          <Card className="border-border/80 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-teal-500" />
            <CardContent className="p-5">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Effective Blended CPM</span>
                <span className="text-cyan-600 dark:text-cyan-400 font-semibold">
                  Cost / 1K Eyes
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold font-display tracking-tight text-foreground">
                {blendedCPM}
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <span>High ROI compared to online video</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 3. TABS: MY BOUGHT FLIGHTS, LIVE BROWSE & BOOK, CREATIVE ASSETS, WISHLIST */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="overflow-x-auto pb-1">
            <TabsList className="h-10 bg-muted/60 p-1 border border-border/70 rounded-xl gap-1">
              <TabsTrigger
                value="flights"
                className="text-xs sm:text-sm font-medium px-3.5 data-[state=active]:bg-background data-[state=active]:shadow-xs gap-1.5"
              >
                <Layers className="size-3.5 text-primary" />
                My Booked Mediums & Flights
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                  {flights.length}
                </span>
              </TabsTrigger>

              <TabsTrigger
                value="analytics"
                className="text-xs sm:text-sm font-medium px-3.5 data-[state=active]:bg-background data-[state=active]:shadow-xs gap-1.5"
              >
                <TrendingUp className="size-3.5 text-emerald-500" />
                Audience & Reach Analytics
              </TabsTrigger>

              <TabsTrigger
                value="marketplace"
                className="text-xs sm:text-sm font-medium px-3.5 data-[state=active]:bg-background data-[state=active]:shadow-xs gap-1.5"
              >
                <Compass className="size-3.5 text-cyan-500" />
                Live Marketplace (Real-Time Sync)
              </TabsTrigger>

              <TabsTrigger
                value="saved"
                className="text-xs sm:text-sm font-medium px-3.5 data-[state=active]:bg-background data-[state=active]:shadow-xs gap-1.5"
              >
                <Heart className="size-3.5 text-rose-500" />
                Saved Spaces ({wishlist.length})
              </TabsTrigger>
            </TabsList>
          </div>

          {/* TAB 1: DETAILED BOOKED MEDIUMS LIST ("all details , add releted details") */}
          <TabsContent value="flights" className="mt-0 space-y-4 focus-visible:outline-hidden">
            {/* Filter Sub-bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border border-border/70 bg-card shadow-xs">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Filter by Flight Status:</span>
                <Select value={flightStatusFilter} onValueChange={setFlightStatusFilter}>
                  <SelectTrigger className="h-8 text-xs w-44">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Bought Mediums ({flights.length})</SelectItem>
                    <SelectItem value="broadcasting">
                      Broadcasting Live ({activeBroadcastingCount})
                    </SelectItem>
                    <SelectItem value="scheduled">Scheduled Launches ({scheduledCount})</SelectItem>
                    <SelectItem value="completed">Completed Flights ({completedCount})</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                  <ShieldCheck className="size-3.5" /> 100% Escrow Guarantee Active
                </span>
              </div>
            </div>

            {/* Flight Cards Roster */}
            <div className="space-y-4">
              {filteredFlights.map((flight) => (
                <Card
                  key={flight.id}
                  className="border-border/80 shadow-xs hover:border-primary/40 transition-all overflow-hidden"
                >
                  <CardContent className="p-0">
                    <div className="flex flex-col lg:flex-row">
                      {/* Left: Image with Status Overlay */}
                      <div className="relative w-full lg:w-72 shrink-0 aspect-video lg:aspect-auto overflow-hidden bg-muted">
                        <img
                          src={flight.imageUrl}
                          alt={flight.title}
                          className="size-full object-cover"
                        />
                        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide bg-black/80 text-white backdrop-blur-xs">
                            {mediumLabel(flight.medium)}
                          </span>
                        </div>
                        <div className="absolute bottom-2.5 left-2.5 bg-black/80 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded">
                          {flight.orderNumber}
                        </div>
                      </div>

                      {/* Middle: Rich Details of the Bought Medium */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-base text-foreground font-display">
                                  {flight.title}
                                </h3>
                                {flight.status === "broadcasting" && (
                                  <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Broadcasting Live
                                  </span>
                                )}
                                {flight.status === "scheduled" && (
                                  <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                    <Clock className="size-3" /> Scheduled Launch
                                  </span>
                                )}
                                {flight.status === "completed" && (
                                  <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-muted text-muted-foreground">
                                    <CheckCircle2 className="size-3" /> Completed
                                  </span>
                                )}
                              </div>

                              <p className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <MapPin className="size-3" /> {flight.city}, {flight.country}
                                </span>
                                <span aria-hidden="true">·</span>
                                <span>{flight.address}</span>
                                <span aria-hidden="true">·</span>
                                <span>Size: {flight.size}</span>
                                {flight.resolution && (
                                  <>
                                    <span aria-hidden="true">·</span>
                                    <span>Resolution: {flight.resolution}</span>
                                  </>
                                )}
                              </p>
                            </div>

                            {/* Investment Total */}
                            <div className="text-right">
                              <span className="text-lg font-bold font-display text-foreground">
                                {formatPrice(flight.totalAmount, flight.currency)}
                              </span>
                              <span className="text-[11px] text-muted-foreground block">
                                {flight.escrowStatus === "protected"
                                  ? "Held in Escrow"
                                  : "Settled Payout"}
                              </span>
                            </div>
                          </div>

                          {/* Flight Specs Grid */}
                          <div className="mt-3.5 grid grid-cols-2 sm:grid-cols-4 gap-2.5 rounded-xl bg-muted/30 p-3 border border-border/60 text-xs">
                            <div>
                              <span className="text-[10px] text-muted-foreground block">
                                Flight Duration
                              </span>
                              <span className="font-semibold text-foreground">
                                {flight.flightStartDate} → {flight.flightEndDate}
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] text-muted-foreground block">
                                Days Remaining
                              </span>
                              <span className="font-semibold text-foreground">
                                {flight.daysRemaining > 0
                                  ? `${flight.daysRemaining} days left`
                                  : "Flight Concluded"}
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] text-muted-foreground block">
                                Audience Impressions
                              </span>
                              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                {(flight.impressionsDelivered / 1000000).toFixed(2)}M delivered (
                                {flight.cpm} CPM)
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] text-muted-foreground block">
                                Verified Media Owner
                              </span>
                              <span className="font-semibold text-foreground">
                                {flight.sellerName}
                              </span>
                            </div>
                          </div>

                          {/* Creative Asset Status */}
                          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">Broadcast Creative:</span>
                              {flight.creativeFileName ? (
                                <span className="font-medium text-foreground flex items-center gap-1 font-mono text-[11px]">
                                  <FileText className="size-3 text-primary" />{" "}
                                  {flight.creativeFileName}
                                </span>
                              ) : (
                                <span className="text-amber-500 italic">
                                  No artwork uploaded yet
                                </span>
                              )}
                              {flight.creativeStatus === "approved" && (
                                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.2 rounded">
                                  Approved
                                </span>
                              )}
                              {flight.creativeStatus === "reviewing" && (
                                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold bg-blue-500/10 px-1.5 py-0.2 rounded">
                                  In Review
                                </span>
                              )}
                            </div>

                            {/* Proof of Play Badge */}
                            {flight.proofOfPlayVerified && (
                              <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 className="size-3.5" />
                                <span>PoP Audited ({flight.cameraName || "Live Camera"})</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Bottom Actions Row */}
                        <div className="pt-3 border-t border-border/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-2">
                            {flight.proofOfPlayVerified && flight.popPhotoUrl && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedPoPFlight(flight);
                                  setIsPoPModalOpen(true);
                                }}
                                className="h-8 text-xs px-2.5 font-medium"
                              >
                                <Camera className="size-3.5 mr-1 text-primary" /> Inspect Live
                                Camera PoP
                              </Button>
                            )}

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setTargetFlight(flight);
                                setIsArtworkModalOpen(true);
                              }}
                              className="h-8 text-xs px-2.5"
                            >
                              <Upload className="size-3.5 mr-1" /> Replace Artwork
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownloadInvoice(flight)}
                              className="h-8 text-xs px-2.5"
                            >
                              <Download className="size-3.5 mr-1" /> Tax Invoice & Receipt
                            </Button>
                          </div>

                          <Button
                            asChild
                            variant="default"
                            size="sm"
                            className="h-8 text-xs px-3 font-semibold"
                          >
                            <Link to="/browse">
                              Extend Flight <ArrowRight className="size-3 ml-1" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* TAB 2: AUDIENCE & REACH ANALYTICS ("analytics show the how many mediums buy and all details") */}
          <TabsContent value="analytics" className="mt-0 space-y-6 focus-visible:outline-hidden">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Left: Reach Distribution by Format */}
              <Card className="border-border/80 shadow-xs lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base font-semibold text-foreground">
                    Impression Delivery by Media Channel
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Breakdown of verified footfall delivery across your bought billboards and DOOH
                    screens
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      format: "Times Square & Urban Digital Screens",
                      impressions: "16.5M impressions",
                      pct: 38,
                      spend: "$103,500",
                      color: "bg-primary",
                    },
                    {
                      format: "Highway Static Unipoles",
                      impressions: "28.5M impressions",
                      pct: 35,
                      spend: "$11,000",
                      color: "bg-emerald-500",
                    },
                    {
                      format: "Luxury Mall Atrium Spectaculars",
                      impressions: "9.2M impressions",
                      pct: 18,
                      spend: "$32,000",
                      color: "bg-cyan-500",
                    },
                    {
                      format: "Metro Transit Escalator Ribbons",
                      impressions: "4.1M impressions",
                      pct: 9,
                      spend: "$18,800",
                      color: "bg-amber-500",
                    },
                  ].map((row) => (
                    <div key={row.format} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-foreground">{row.format}</span>
                        <span className="text-muted-foreground">
                          {row.impressions} · {row.spend} ({row.pct}%)
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full ${row.color}`}
                          style={{ width: `${row.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}

                  <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Third-Party Verification Engine:</span>
                    <strong className="text-foreground">Geopath + Ipsos Traffic Sensors</strong>
                  </div>
                </CardContent>
              </Card>

              {/* Right: Escrow Protection Status */}
              <Card className="border-border/80 shadow-xs">
                <CardHeader>
                  <CardTitle className="text-base font-semibold text-foreground">
                    Escrow Protection Guarantee
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    How Mark@Ads safeguards your media investment
                  </p>
                </CardHeader>
                <CardContent className="space-y-3.5 text-xs">
                  <div className="flex items-start gap-2.5 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                    <ShieldCheck className="size-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">100% Funds Held Until Playback Proof</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Your payment is held in escrow and only released to the media owner once
                        live photos and sensor logs certify broadcast compliance.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-muted-foreground">
                    <p className="flex items-center justify-between">
                      <span>Total Deployed Capital:</span>
                      <strong className="text-foreground">{formatPrice(totalSpend)}</strong>
                    </p>
                    <p className="flex items-center justify-between">
                      <span>Currently in Escrow:</span>
                      <strong className="text-emerald-600 dark:text-emerald-400">
                        {formatPrice(escrowProtectedTotal)}
                      </strong>
                    </p>
                    <p className="flex items-center justify-between">
                      <span>Completed Flights Settled:</span>
                      <strong className="text-foreground">
                        {formatPrice(totalSpend - escrowProtectedTotal)}
                      </strong>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TAB 3: LIVE MARKETPLACE (LIVE SYNC WITH SELLER UPLOADS) */}
          <TabsContent value="marketplace" className="mt-0 space-y-5 focus-visible:outline-hidden">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-border/70 bg-card shadow-xs">
              <div className="flex flex-1 flex-wrap items-center gap-2.5">
                <div className="relative min-w-44 flex-1">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search available screens worldwide..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-8 pl-8 text-xs"
                  />
                </div>

                <Select value={mediumFilter} onValueChange={setMediumFilter}>
                  <SelectTrigger className="h-8 text-xs w-40">
                    <SelectValue placeholder="All Formats" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Media Formats</SelectItem>
                    {MEDIUMS.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  placeholder="Filter City..."
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="h-8 text-xs w-32"
                />
              </div>

              <div className="text-xs text-muted-foreground self-end sm:self-center">
                <span>
                  Real-Time Catalog:{" "}
                  <strong className="text-foreground">{filteredCatalog.length} spaces</strong>
                </span>
              </div>
            </div>

            {/* Catalog Grid */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCatalog.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  favorite={isWishlisted(listing.id)}
                  onToggleFavorite={() => toggleWishlist(listing.id)}
                  compareChecked={isCompared(listing.id)}
                  onToggleCompare={() => toggleCompare(listing)}
                  actionLabel="Book This Medium"
                />
              ))}
            </div>
          </TabsContent>

          {/* TAB 4: SAVED SPACES */}
          <TabsContent value="saved" className="mt-0 space-y-4 focus-visible:outline-hidden">
            {wishlist.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {liveCatalogListings
                  .filter((l) => wishlist.includes(l.id))
                  .map((listing) => (
                    <ListingCard
                      key={listing.id}
                      listing={listing}
                      favorite
                      onToggleFavorite={() => toggleWishlist(listing.id)}
                      compareChecked={isCompared(listing.id)}
                      onToggleCompare={() => toggleCompare(listing)}
                      actionLabel="Book This Medium"
                    />
                  ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed p-12 text-center text-sm text-muted-foreground">
                <Heart className="size-8 mx-auto text-muted-foreground/50 mb-2" />
                <p className="font-semibold text-foreground">No saved media spaces yet</p>
                <p className="text-xs mt-1">
                  Click the heart icon on any billboard or screen to bookmark it for upcoming
                  campaigns.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Upload Artwork Modal */}
      <Dialog open={isArtworkModalOpen} onOpenChange={setIsArtworkModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Upload Campaign Creative Artwork</DialogTitle>
            <DialogDescription className="text-xs">
              Assign high-resolution video (MP4 60FPS) or print flex file (TIFF/PDF 300DPI) to "
              {targetFlight?.title}".
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUploadArtwork} className="space-y-3.5 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="artworkUrl" className="text-xs">
                Asset File URL (MP4 / MOV / TIFF)
              </Label>
              <Input
                id="artworkUrl"
                value={artworkFileUrl}
                onChange={(e) => setArtworkFileUrl(e.target.value)}
                placeholder="https://cdn.brand.com/campaign_master_4k.mp4"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="fileName" className="text-xs">
                File Reference / Campaign Title
              </Label>
              <Input
                id="fileName"
                value={artworkFileName}
                onChange={(e) => setArtworkFileName(e.target.value)}
                placeholder="e.g. Nike_Q4_WinterFlight_4K.mp4"
                required
              />
            </div>

            <div className="rounded-lg bg-muted/50 p-3 text-[11px] text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground">Technical Transcoding Notice</p>
              <p>
                Our media network verifies aspect ratios ({targetFlight?.size}) and color encoding
                before airtime broadcast.
              </p>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsArtworkModalOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" className="text-xs font-semibold">
                Submit Artwork for Broadcast
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Proof of Play Inspection Modal */}
      <Dialog open={isPoPModalOpen} onOpenChange={setIsPoPModalOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="font-display">Live Proof of Play Inspection Feed</DialogTitle>
            <DialogDescription className="text-xs">
              Real-time optical sensor verification from {selectedPoPFlight?.title}.
            </DialogDescription>
          </DialogHeader>

          {selectedPoPFlight && (
            <div className="space-y-3.5 py-2">
              <div className="relative aspect-video rounded-xl overflow-hidden border border-border/80 bg-black">
                <img
                  src={selectedPoPFlight.popPhotoUrl}
                  alt={selectedPoPFlight.title}
                  className="size-full object-cover"
                />
                <div className="absolute top-2.5 left-2.5 bg-black/80 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded font-mono flex items-center gap-1">
                  <Camera className="size-2.5 text-emerald-400" />
                  {selectedPoPFlight.cameraName}
                </div>
                <div className="absolute top-2.5 right-2.5 bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded font-bold shadow-xs">
                  100% Broadcast Certified
                </div>
                <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-black/80 backdrop-blur-xs text-white p-2 rounded text-[11px] font-mono flex justify-between">
                  <span>{selectedPoPFlight.verificationTimestamp}</span>
                  <span className="text-emerald-400">GPS Verified</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-muted/40 p-3 rounded-lg">
                <div>
                  <span className="text-muted-foreground block text-[10px]">Location</span>
                  <span className="font-semibold text-foreground">
                    {selectedPoPFlight.city}, {selectedPoPFlight.country}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">
                    Impressions Logged
                  </span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {selectedPoPFlight.impressionsDelivered.toLocaleString()} verified passes
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownloadInvoice(selectedPoPFlight)}
                  className="text-xs"
                >
                  <Download className="size-3.5 mr-1" /> Download Certificate
                </Button>
                <Button size="sm" onClick={() => setIsPoPModalOpen(false)} className="text-xs">
                  Done
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
