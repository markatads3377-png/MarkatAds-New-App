import React, { useState } from "react";
import {
  Layers,
  Clock,
  Play,
  Plus,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Sliders,
  DollarSign,
  ChevronRight,
  TrendingUp,
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
import { toast } from "sonner";
import { type MediaAsset, type SlotInfo } from "./sellerTypes";
import { sellerStore } from "./sellerStore";
import { formatPrice } from "@/lib/mediums";

interface SellerLoopSchedulerProps {
  assets: MediaAsset[];
  selectedAsset: MediaAsset | null;
  onSelectAsset: (asset: MediaAsset) => void;
}

export const SellerLoopScheduler: React.FC<SellerLoopSchedulerProps> = ({
  assets,
  selectedAsset,
  onSelectAsset,
}) => {
  const digitalAssets = assets.filter(
    (a) =>
      a.medium === "digital_screen" ||
      a.medium === "indoor_mall_screen" ||
      a.medium === "airport" ||
      a.slots,
  );

  const currentScreen = selectedAsset || digitalAssets[0] || assets[0];
  const slots: SlotInfo[] = currentScreen?.slots || [
    {
      id: "s1",
      slotNumber: 1,
      durationSeconds: 10,
      advertiserName: "Nike Running Global",
      brandCategory: "Sportswear",
      status: "active",
      monthlyRevenue: 3400,
      contractEnd: "2026-11-15",
    },
    {
      id: "s2",
      slotNumber: 2,
      durationSeconds: 10,
      advertiserName: "Samsung Galaxy AI",
      brandCategory: "Technology",
      status: "active",
      monthlyRevenue: 3400,
      contractEnd: "2026-12-01",
    },
    {
      id: "s3",
      slotNumber: 3,
      durationSeconds: 10,
      advertiserName: "Rolex Oyster Perpetual",
      brandCategory: "Luxury Horology",
      status: "active",
      monthlyRevenue: 3600,
      contractEnd: "2026-10-30",
    },
    {
      id: "s4",
      slotNumber: 4,
      durationSeconds: 10,
      advertiserName: "Vacant Slot",
      brandCategory: "Open for Booking",
      status: "vacant",
      monthlyRevenue: 0,
    },
    {
      id: "s5",
      slotNumber: 5,
      durationSeconds: 10,
      advertiserName: "Emirates Airline",
      brandCategory: "Aviation",
      status: "active",
      monthlyRevenue: 3500,
      contractEnd: "2026-11-20",
    },
    {
      id: "s6",
      slotNumber: 6,
      durationSeconds: 10,
      advertiserName: "BMW iX Electric",
      brandCategory: "Automotive",
      status: "active",
      monthlyRevenue: 3500,
      contractEnd: "2026-12-15",
    },
  ];

  const [isBookSlotOpen, setIsBookSlotOpen] = useState(false);
  const [targetSlot, setTargetSlot] = useState<SlotInfo | null>(null);
  const [newAdvName, setNewAdvName] = useState("");
  const [newAdvCategory, setNewAdvCategory] = useState("Technology");
  const [newMonthlyRate, setNewMonthlyRate] = useState("3200");
  const [newContractMonths, setNewContractMonths] = useState("3");

  const totalLoopSeconds = slots.reduce((sum, s) => sum + s.durationSeconds, 0);
  const activeSlotsCount = slots.filter((s) => s.status === "active").length;
  const loopYield = slots.reduce((sum, s) => sum + s.monthlyRevenue, 0);

  const handleOpenBookSlot = (slot: SlotInfo) => {
    setTargetSlot(slot);
    setNewAdvName("");
    setNewMonthlyRate(String(Math.round(currentScreen.pricePerMonth / slots.length) || 3000));
    setIsBookSlotOpen(true);
  };

  const handleAssignSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetSlot || !newAdvName.trim()) {
      toast.error("Please provide an advertiser name.");
      return;
    }

    const updatedSlots = slots.map((s) => {
      if (s.id === targetSlot.id) {
        return {
          ...s,
          advertiserName: newAdvName.trim(),
          brandCategory: newAdvCategory,
          status: "active" as const,
          monthlyRevenue: Number(newMonthlyRate) || 3000,
          contractEnd: new Date(Date.now() + Number(newContractMonths) * 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        };
      }
      return s;
    });

    const newOccupied = updatedSlots.filter((s) => s.status === "active").length;
    const newOccupancyRate = Math.round((newOccupied / updatedSlots.length) * 100);

    sellerStore.updateAsset(currentScreen.id, {
      slots: updatedSlots,
      occupiedSlots: newOccupied,
      occupancyRate: newOccupancyRate,
      totalRevenueEarned:
        (currentScreen.totalRevenueEarned || 0) +
        Number(newMonthlyRate) * Number(newContractMonths),
    });

    toast.success(`Slot #${targetSlot.slotNumber} booked for ${newAdvName}!`);
    setIsBookSlotOpen(false);
  };

  const handleReleaseSlot = (slot: SlotInfo) => {
    const updatedSlots = slots.map((s) => {
      if (s.id === slot.id) {
        return {
          ...s,
          advertiserName: "Vacant Slot",
          brandCategory: "Open for Booking",
          status: "vacant" as const,
          monthlyRevenue: 0,
          contractEnd: undefined,
        };
      }
      return s;
    });

    const newOccupied = updatedSlots.filter((s) => s.status === "active").length;
    const newOccupancyRate = Math.round((newOccupied / updatedSlots.length) * 100);

    sellerStore.updateAsset(currentScreen.id, {
      slots: updatedSlots,
      occupiedSlots: newOccupied,
      occupancyRate: newOccupancyRate,
    });

    toast.success(`Slot #${slot.slotNumber} is now marked as vacant and available.`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Screen Selector */}
      <Card className="border-border/80 shadow-xs">
        <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-semibold text-primary">DOOH Loop Engine</span>
              <span aria-hidden="true">·</span>
              <span>Dynamic Daypart & Spot Scheduling</span>
            </div>
            <h2 className="text-lg font-bold font-display text-foreground mt-1">
              Digital Screen Loop & Spot Allocator
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Programmatic time-slot rotation for high-frequency LED screens and digital ribbons
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground whitespace-nowrap">Select Screen:</span>
            <Select
              value={currentScreen.id}
              onValueChange={(id) => {
                const target = assets.find((a) => a.id === id);
                if (target) onSelectAsset(target);
              }}
            >
              <SelectTrigger className="text-xs h-8.5 w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {digitalAssets.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.title} ({a.city})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Screen Overview & Loop Visualization */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Screen Specs & Real-Time Stats */}
        <Card className="border-border/80 shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-foreground">
              Selected DOOH Asset Specs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative aspect-video rounded-lg overflow-hidden border border-border/60">
              <img
                src={currentScreen.images[0]}
                alt={currentScreen.title}
                className="size-full object-cover"
              />
              <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded font-mono">
                {currentScreen.resolution || "4K UHD"}
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Screen Name</span>
                <span className="font-semibold text-foreground text-right">
                  {currentScreen.title}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Loop Duration</span>
                <span className="font-semibold text-foreground">
                  {totalLoopSeconds}s Continuous Cycle
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Slots Occupied</span>
                <span className="font-semibold text-foreground">
                  {activeSlotsCount} / {slots.length} (
                  {Math.round((activeSlotsCount / slots.length) * 100)}%)
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Combined Loop Yield</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {formatPrice(loopYield, currentScreen.currency)}/mo
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-muted-foreground">Frequency / Day</span>
                <span className="font-semibold text-foreground">
                  ~1,440 plays per advertiser / 24h
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right: The Visual 60-Second Loop Wheel / Timeline */}
        <Card className="border-border/80 shadow-xs lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-semibold text-foreground">
                60-Second Broadcast Rotation Cycle
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Every {totalLoopSeconds} seconds, each 10-second spot airs sequentially on the
                display
              </p>
            </div>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" /> Live Loop
              Playing
            </span>
          </CardHeader>
          <CardContent className="pt-2">
            {/* Visual Timeline Bar */}
            <div className="mb-6 space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>0s</span>
                <span>15s</span>
                <span>30s</span>
                <span>45s</span>
                <span>{totalLoopSeconds}s Loop Restart</span>
              </div>
              <div className="h-6 w-full rounded-lg overflow-hidden flex border border-border/80 shadow-xs p-0.5 bg-muted/30 gap-1">
                {slots.map((s, idx) => (
                  <div
                    key={s.id}
                    className={`h-full flex-1 rounded-sm flex items-center justify-center text-[10px] font-bold transition-all ${
                      s.status === "active"
                        ? "bg-primary text-primary-foreground hover:brightness-110"
                        : "bg-muted text-muted-foreground border border-dashed border-border/80 hover:bg-muted/80"
                    }`}
                    title={`Slot #${idx + 1}: ${s.advertiserName} (${s.durationSeconds}s)`}
                  >
                    #{idx + 1}
                  </div>
                ))}
              </div>
            </div>

            {/* Slots List Breakdown */}
            <div className="space-y-3">
              {slots.map((slot) => (
                <div
                  key={slot.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border transition-all gap-3 ${
                    slot.status === "active"
                      ? "border-border/80 bg-card hover:border-primary/50 shadow-xs"
                      : "border-dashed border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`grid size-8 place-items-center rounded-lg font-mono text-xs font-bold shrink-0 ${
                        slot.status === "active"
                          ? "bg-primary text-primary-foreground"
                          : "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      #{slot.slotNumber}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-xs text-foreground">
                          {slot.advertiserName}
                        </p>
                        <span className="text-[10px] text-muted-foreground">
                          ({slot.durationSeconds}s spot)
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        {slot.brandCategory}
                        {slot.contractEnd && ` · Contract through ${slot.contractEnd}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 self-end sm:self-center w-full sm:w-auto">
                    {slot.status === "active" ? (
                      <>
                        <div className="text-right">
                          <span className="text-xs font-bold text-foreground">
                            {formatPrice(slot.monthlyRevenue, currentScreen.currency)}
                          </span>
                          <span className="text-[10px] text-muted-foreground block">
                            /month yield
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReleaseSlot(slot)}
                          className="h-7 text-[11px] text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                        >
                          Vacate Slot
                        </Button>
                      </>
                    ) : (
                      <>
                        <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                          Vacant ({slot.durationSeconds}s unmonetized)
                        </span>
                        <Button
                          size="sm"
                          onClick={() => handleOpenBookSlot(slot)}
                          className="h-7 text-[11px] bg-primary font-semibold text-white px-3"
                        >
                          <Plus className="size-3 mr-1" /> Sell / Assign
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Book / Assign Slot Dialog */}
      <Dialog open={isBookSlotOpen} onOpenChange={setIsBookSlotOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">
              Assign Slot #{targetSlot?.slotNumber} ({targetSlot?.durationSeconds}s Spot)
            </DialogTitle>
            <DialogDescription className="text-xs">
              Book this open rotation slot for an inbound advertiser or agency campaign.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAssignSlot} className="space-y-3.5 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="advName" className="text-xs">
                Advertiser / Brand Name
              </Label>
              <Input
                id="advName"
                value={newAdvName}
                onChange={(e) => setNewAdvName(e.target.value)}
                placeholder="e.g. Sony PlayStation 5 Pro"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Industry Category</Label>
              <Select value={newAdvCategory} onValueChange={setNewAdvCategory}>
                <SelectTrigger className="text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Consumer Electronics">Consumer Electronics</SelectItem>
                  <SelectItem value="Automotive">Automotive</SelectItem>
                  <SelectItem value="Luxury Horology & Fashion">Luxury & Fashion</SelectItem>
                  <SelectItem value="Finance & Banking">Finance & Banking</SelectItem>
                  <SelectItem value="FMCG & Beverage">FMCG & Beverage</SelectItem>
                  <SelectItem value="Entertainment & Streaming">
                    Entertainment & Streaming
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="slotRate" className="text-xs">
                  Monthly Rate ({currentScreen.currency})
                </Label>
                <Input
                  id="slotRate"
                  type="number"
                  value={newMonthlyRate}
                  onChange={(e) => setNewMonthlyRate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Flight Duration</Label>
                <Select value={newContractMonths} onValueChange={setNewContractMonths}>
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Month</SelectItem>
                    <SelectItem value="2">2 Months</SelectItem>
                    <SelectItem value="3">3 Months (Quarterly)</SelectItem>
                    <SelectItem value="6">6 Months</SelectItem>
                    <SelectItem value="12">12 Months (Annual)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsBookSlotOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" className="text-xs font-semibold">
                Confirm & Activate Slot
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
