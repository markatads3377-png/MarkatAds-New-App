import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import {
  DollarSign,
  LayoutGrid,
  Layers,
  FileText,
  Calendar,
  Camera,
  ShieldCheck,
  Sparkles,
  Plus,
  ArrowRight,
  TrendingUp,
  CreditCard,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SiteHeader } from "@/components/SiteHeader";
import { PLANS, formatPrice } from "@/lib/mediums";
import { useAuth } from "@/hooks/useAuth";

// Seller Modular Components
import { type MediaAsset } from "@/components/seller/sellerTypes";
import { sellerStore } from "@/components/seller/sellerStore";
import { SellerHeader } from "@/components/seller/SellerHeader";
import { SellerRevenueHub } from "@/components/seller/SellerRevenueHub";
import { SellerInventoryManager } from "@/components/seller/SellerInventoryManager";
import { SellerLoopScheduler } from "@/components/seller/SellerLoopScheduler";
import { SellerProposalBuilder } from "@/components/seller/SellerProposalBuilder";
import { SellerFlightCalendar } from "@/components/seller/SellerFlightCalendar";
import { SellerProofOfPlay } from "@/components/seller/SellerProofOfPlay";
import { SellerAddListingModal } from "@/components/seller/SellerAddListingModal";
import { SellerRateCardModal } from "@/components/seller/SellerRateCardModal";

export const Route = createFileRoute("/_authenticated/seller")({
  head: () => ({
    meta: [
      { title: "Media Selling Platform & Revenue Cockpit — Mark@Ads" },
      {
        name: "description",
        content:
          "Enterprise Out-of-Home & DOOH media selling operating system. Manage billboard listings, track real-time revenue earnings, schedule digital loops, and issue agency proposals.",
      },
      {
        property: "og:title",
        content: "Media Selling Platform & Revenue Cockpit — Mark@Ads",
      },
      {
        property: "og:description",
        content:
          "Enterprise inventory management, revenue intelligence, and slot scheduling for billboard and screen operators.",
      },
    ],
  }),
  component: MediaSellingPlatformPage,
});

function MediaSellingPlatformPage() {
  const { session, username, displayName } = useAuth();

  // Reactive fleet & platform state from store
  const [assets, setAssets] = useState<MediaAsset[]>(() => sellerStore.getAssets());
  const [bookings, setBookings] = useState(() => sellerStore.getBookings());
  const [proposals, setProposals] = useState(() => sellerStore.getProposals());
  const [popRecords, setPopRecords] = useState(() => sellerStore.getPoP());
  const [payouts, setPayouts] = useState(() => sellerStore.getPayouts());

  // Navigation tab
  const [currentTab, setCurrentTab] = useState("revenue");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<MediaAsset | null>(null);
  const [isRateCardOpen, setIsRateCardOpen] = useState(false);
  const [schedulerAsset, setSchedulerAsset] = useState<MediaAsset | null>(null);

  // Sync state across tab events & store changes
  useEffect(() => {
    const handleSync = () => {
      setAssets(sellerStore.getAssets());
      setBookings(sellerStore.getBookings());
      setProposals(sellerStore.getProposals());
      setPopRecords(sellerStore.getPoP());
      setPayouts(sellerStore.getPayouts());
    };

    window.addEventListener("markatads_seller_sync", handleSync);
    return () => window.removeEventListener("markatads_seller_sync", handleSync);
  }, []);

  const totalImpressionsFormatted = useMemo(() => {
    return "2,420,000+ daily eyes";
  }, []);

  // Quick Action Handlers
  const handleOpenAddModal = () => {
    setEditingAsset(null);
    setIsAddModalOpen(true);
  };

  const handleEditAsset = (asset: MediaAsset) => {
    setEditingAsset(asset);
    setIsAddModalOpen(true);
  };

  const handleViewPoP = (asset: MediaAsset) => {
    setCurrentTab("pop");
  };

  const handleOpenLoopScheduler = (asset: MediaAsset) => {
    setSchedulerAsset(asset);
    setCurrentTab("loops");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8 space-y-6">
        {/* 1. Distinctive Media Operator Cockpit Header */}
        <SellerHeader
          onOpenAddModal={handleOpenAddModal}
          onOpenProposalModal={() => setCurrentTab("proposals")}
          onOpenRateCardModal={() => setIsRateCardOpen(true)}
          assetsCount={assets.length}
          totalImpressions={totalImpressionsFormatted}
        />

        {/* 2. Interactive Navigation Tabs for Media Selling Platform */}
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
          <div className="overflow-x-auto pb-1">
            <TabsList className="h-10 bg-muted/60 p-1 border border-border/70 rounded-xl gap-1">
              <TabsTrigger
                value="revenue"
                className="text-xs sm:text-sm font-medium px-3.5 data-[state=active]:bg-background data-[state=active]:shadow-xs gap-1.5"
              >
                <DollarSign className="size-3.5 text-emerald-500" />
                Revenue & Earnings
              </TabsTrigger>

              <TabsTrigger
                value="inventory"
                className="text-xs sm:text-sm font-medium px-3.5 data-[state=active]:bg-background data-[state=active]:shadow-xs gap-1.5"
              >
                <LayoutGrid className="size-3.5 text-primary" />
                Media Listings Fleet
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                  {assets.length}
                </span>
              </TabsTrigger>

              <TabsTrigger
                value="loops"
                className="text-xs sm:text-sm font-medium px-3.5 data-[state=active]:bg-background data-[state=active]:shadow-xs gap-1.5"
              >
                <Layers className="size-3.5 text-cyan-500" />
                DOOH Loop Scheduler
              </TabsTrigger>

              <TabsTrigger
                value="proposals"
                className="text-xs sm:text-sm font-medium px-3.5 data-[state=active]:bg-background data-[state=active]:shadow-xs gap-1.5"
              >
                <FileText className="size-3.5 text-amber-500" />
                Proposals & RFPs
                {proposals.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold">
                    {proposals.length}
                  </span>
                )}
              </TabsTrigger>

              <TabsTrigger
                value="calendar"
                className="text-xs sm:text-sm font-medium px-3.5 data-[state=active]:bg-background data-[state=active]:shadow-xs gap-1.5"
              >
                <Calendar className="size-3.5 text-indigo-500" />
                Flight Calendar
              </TabsTrigger>

              <TabsTrigger
                value="pop"
                className="text-xs sm:text-sm font-medium px-3.5 data-[state=active]:bg-background data-[state=active]:shadow-xs gap-1.5"
              >
                <Camera className="size-3.5 text-rose-500" />
                Proof of Play (PoP)
              </TabsTrigger>

              <TabsTrigger
                value="plans"
                className="text-xs sm:text-sm font-medium px-3.5 data-[state=active]:bg-background data-[state=active]:shadow-xs gap-1.5"
              >
                <Sparkles className="size-3.5 text-purple-500" />
                Operator Plans
              </TabsTrigger>
            </TabsList>
          </div>

          {/* TAB 1: REVENUE & EARNINGS HUB ("how much revenue earn") */}
          <TabsContent value="revenue" className="mt-0 focus-visible:outline-hidden">
            <SellerRevenueHub assets={assets} bookings={bookings} payouts={payouts} />
          </TabsContent>

          {/* TAB 2: MEDIA LISTINGS FLEET ("media listing and full interface showup") */}
          <TabsContent value="inventory" className="mt-0 focus-visible:outline-hidden">
            <SellerInventoryManager
              assets={assets}
              onOpenAddModal={handleOpenAddModal}
              onEditAsset={handleEditAsset}
              onViewPoP={handleViewPoP}
              onOpenLoopScheduler={handleOpenLoopScheduler}
            />
          </TabsContent>

          {/* TAB 3: DOOH LOOP & SLOT SCHEDULER */}
          <TabsContent value="loops" className="mt-0 focus-visible:outline-hidden">
            <SellerLoopScheduler
              assets={assets}
              selectedAsset={schedulerAsset}
              onSelectAsset={(a) => setSchedulerAsset(a)}
            />
          </TabsContent>

          {/* TAB 4: DIRECT PROPOSALS & RFPS */}
          <TabsContent value="proposals" className="mt-0 focus-visible:outline-hidden">
            <SellerProposalBuilder assets={assets} proposals={proposals} />
          </TabsContent>

          {/* TAB 5: FLIGHT CALENDAR */}
          <TabsContent value="calendar" className="mt-0 focus-visible:outline-hidden">
            <SellerFlightCalendar bookings={bookings} assets={assets} />
          </TabsContent>

          {/* TAB 6: PROOF OF PLAY VERIFICATION */}
          <TabsContent value="pop" className="mt-0 focus-visible:outline-hidden">
            <SellerProofOfPlay assets={assets} popRecords={popRecords} />
          </TabsContent>

          {/* TAB 7: OPERATOR SUBSCRIPTION PLANS */}
          <TabsContent value="plans" className="mt-0 focus-visible:outline-hidden space-y-6">
            <Card className="border-border/80 shadow-xs">
              <CardContent className="p-5">
                <h3 className="text-base font-bold font-display text-foreground">
                  Media Owner Subscription & Capacity Tiers
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Expand your screen capacity, unlock programmatic ad exchange routing, and enable
                  white-label agency proposals.
                </p>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-3">
              {PLANS.map((plan) => (
                <Card
                  key={plan.name}
                  className={`border shadow-xs flex flex-col justify-between transition-all ${
                    plan.highlight
                      ? "border-primary shadow-md relative overflow-hidden"
                      : "border-border/80"
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                      Most Popular
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="font-display text-lg">{plan.name}</CardTitle>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="font-display text-3xl font-extrabold text-foreground">
                        {plan.price}
                      </span>
                      <span className="text-xs text-muted-foreground">{plan.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                    <ul className="space-y-2 text-xs text-muted-foreground">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-center gap-2">
                          <CheckCircle2 className="size-3.5 text-primary shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      asChild
                      variant={plan.highlight ? "default" : "outline"}
                      className="w-full text-xs font-semibold mt-4"
                    >
                      <Link to="/pricing">
                        {plan.highlight ? "Upgrade to Operator Pro" : "View Tier Details"}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* 3. Global Modals */}
      <SellerAddListingModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        editingAsset={editingAsset}
      />

      <SellerRateCardModal open={isRateCardOpen} onOpenChange={setIsRateCardOpen} assets={assets} />
    </div>
  );
}
