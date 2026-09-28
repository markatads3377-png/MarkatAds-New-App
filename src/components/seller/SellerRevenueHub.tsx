import React, { useState, useMemo } from "react";
import {
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  ShieldCheck,
  Wallet,
  Download,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  Send,
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
import { type MediaAsset, type BookingRecord, type PayoutTransaction } from "./sellerTypes";
import { sellerStore } from "./sellerStore";
import { formatPrice, mediumLabel } from "@/lib/mediums";

interface SellerRevenueHubProps {
  assets: MediaAsset[];
  bookings: BookingRecord[];
  payouts: PayoutTransaction[];
}

export const SellerRevenueHub: React.FC<SellerRevenueHubProps> = ({
  assets,
  bookings,
  payouts,
}) => {
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("14800");
  const [withdrawMethod, setWithdrawMethod] = useState<PayoutTransaction["method"]>("bank_wire");
  const [withdrawRef, setWithdrawRef] = useState("Chase Commercial •••• 9812");
  const [selectedAssetFilter, setSelectedAssetFilter] = useState("all");

  // Calculations
  const lifetimeRevenue = useMemo(() => {
    return assets.reduce((sum, a) => sum + (a.totalRevenueEarned || 0), 0);
  }, [assets]);

  const activeInFlightEscrow = useMemo(() => {
    return bookings
      .filter((b) => b.status === "in_flight" && b.escrowStatus === "held")
      .reduce((sum, b) => sum + Number(b.totalAmount || 0), 0);
  }, [bookings]);

  const settledPayoutsTotal = useMemo(() => {
    return payouts
      .filter((p) => p.status === "completed")
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);
  }, [payouts]);

  const availableBalance = 14800; // Ready for instant transfer

  const averageOccupancy = useMemo(() => {
    if (assets.length === 0) return 0;
    const total = assets.reduce((sum, a) => sum + (a.occupancyRate || 0), 0);
    return Math.round(total / assets.length);
  }, [assets]);

  const monthlyRunRate = useMemo(() => {
    return assets.reduce((sum, a) => sum + (a.pricePerMonth || 0), 0);
  }, [assets]);

  // Monthly historical trend (last 6 months)
  const monthlyTrends = [
    { month: "May", amount: 48500, bookings: 4, heightPct: 62 },
    { month: "Jun", amount: 56000, bookings: 5, heightPct: 70 },
    { month: "Jul", amount: 64200, bookings: 6, heightPct: 80 },
    { month: "Aug", amount: 72500, bookings: 7, heightPct: 90 },
    { month: "Sep", amount: 80400, bookings: 8, heightPct: 100 },
    { month: "Oct (Proj)", amount: 88900, bookings: 9, heightPct: 95, projected: true },
  ];

  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(withdrawAmount);
    if (!num || num <= 0 || num > availableBalance) {
      toast.error(`Please enter an amount up to ${formatPrice(availableBalance)}`);
      return;
    }
    sellerStore.requestPayout(num, withdrawMethod, withdrawRef);
    toast.success(
      `Withdrawal request of ${formatPrice(num)} submitted! Funds will settle within 24 hours.`,
    );
    setIsWithdrawOpen(false);
  };

  const filteredAssets = useMemo(() => {
    if (selectedAssetFilter === "all") return assets;
    return assets.filter((a) => a.medium === selectedAssetFilter);
  }, [assets, selectedAssetFilter]);

  return (
    <div className="space-y-6">
      {/* 1. Executive Financial KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total Gross Revenue */}
        <Card className="border-border/80 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-cyan-500" />
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Gross Revenue Earned</span>
              <span className="flex items-center text-emerald-600 dark:text-emerald-400 font-medium">
                <ArrowUpRight className="size-3.5 mr-0.5" /> +18.4% YoY
              </span>
            </div>
            <div className="mt-2 text-2xl font-bold font-display tracking-tight text-foreground">
              {formatPrice(lifetimeRevenue, "USD")}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>All-time booked revenue</span>
              <span aria-hidden="true">·</span>
              <span>{bookings.length} verified flights</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: In-Flight Escrow Funds */}
        <Card className="border-border/80 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-600" />
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>In-Flight Escrow Balance</span>
              <span className="flex items-center text-amber-600 dark:text-amber-400 font-medium">
                <ShieldCheck className="size-3.5 mr-0.5" /> 100% Protected
              </span>
            </div>
            <div className="mt-2 text-2xl font-bold font-display tracking-tight text-foreground">
              {formatPrice(activeInFlightEscrow, "USD")}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>Auto-releases upon flight completion</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Ready for Instant Withdrawal */}
        <Card className="border-border/80 shadow-xs relative overflow-hidden bg-primary/5">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600" />
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Available to Withdraw</span>
              <Button
                variant="default"
                size="sm"
                onClick={() => setIsWithdrawOpen(true)}
                className="h-6 text-[11px] px-2 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Withdraw
              </Button>
            </div>
            <div className="mt-2 text-2xl font-bold font-display tracking-tight text-emerald-600 dark:text-emerald-400">
              {formatPrice(availableBalance, "USD")}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>Settled funds · Instant wire available</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Fleet Utilization & ARPU */}
        <Card className="border-border/80 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Fleet Occupancy Rate</span>
              <span className="text-primary font-medium">{averageOccupancy}% booked</span>
            </div>
            <div className="mt-2 text-2xl font-bold font-display tracking-tight text-foreground">
              {formatPrice(monthlyRunRate, "USD")}
              <span className="text-xs font-normal text-muted-foreground">/mo</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>Monthly potential run rate</span>
              <span aria-hidden="true">·</span>
              <span>{assets.filter((a) => a.available).length} screens open</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2. Visual Revenue Performance Chart & Breakdown */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: 6-Month Visual Revenue Trend */}
        <Card className="border-border/80 shadow-xs lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-semibold text-foreground">
                Revenue Trajectory & Monthly Payouts
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Gross booked earnings across all billboard and DOOH screens (May – October 2026)
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-muted-foreground">
                <span className="size-2.5 rounded-xs bg-primary inline-block" /> Actual
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <span className="size-2.5 rounded-xs bg-cyan-400/60 inline-block" /> Projected
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-52 w-full flex items-end gap-3 sm:gap-6 pt-6 pb-2 border-b border-border/60">
              {monthlyTrends.map((item) => (
                <div
                  key={item.month}
                  className="flex-1 flex flex-col items-center gap-2 h-full justify-end group"
                >
                  <span className="text-[11px] font-semibold text-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {formatPrice(item.amount)}
                  </span>
                  <div
                    className={`w-full rounded-t-md transition-all duration-300 relative ${
                      item.projected
                        ? "bg-gradient-to-t from-cyan-500/40 to-cyan-400 border border-dashed border-cyan-400"
                        : "bg-gradient-to-t from-primary/80 to-primary hover:brightness-110 shadow-xs"
                    }`}
                    style={{ height: `${item.heightPct}%` }}
                  >
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-md" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">{item.month}</span>
                </div>
              ))}
            </div>

            {/* Bottom Insight Row */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <TrendingUp className="size-4 text-emerald-500 shrink-0" />
                <span>
                  Average revenue per screen is{" "}
                  <strong className="text-foreground">
                    {formatPrice(Math.round(lifetimeRevenue / (assets.length || 1)))}
                  </strong>
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500">
                <span>
                  Direct payout fees: <strong className="text-foreground">0%</strong> Mark@Ads
                  pass-through
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right: Revenue by Medium Breakdown */}
        <Card className="border-border/80 shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-foreground">
              Yield by Media Format
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Revenue distribution across your fleet categories
            </p>
          </CardHeader>
          <CardContent className="pt-2 space-y-4">
            {[
              {
                format: "Digital Screens (DOOH)",
                amount: 220500,
                pct: 53,
                color: "bg-primary",
              },
              {
                format: "Indoor Mall LED Displays",
                amount: 89000,
                pct: 21,
                color: "bg-cyan-500",
              },
              {
                format: "Highway Static Hoardings",
                amount: 88000,
                pct: 21,
                color: "bg-amber-500",
              },
              {
                format: "Transit & Mobile Fleets",
                amount: 23400,
                pct: 5,
                color: "bg-emerald-500",
              },
            ].map((cat) => (
              <div key={cat.format} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">{cat.format}</span>
                  <span className="font-semibold text-foreground">
                    {formatPrice(cat.amount)} ({cat.pct}%)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full ${cat.color}`}
                    style={{ width: `${cat.pct}%` }}
                  />
                </div>
              </div>
            ))}

            <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Total Settled to Date</span>
              <span className="font-bold text-foreground font-display">
                {formatPrice(settledPayoutsTotal)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Screen-by-Screen Revenue Leaderboard Table */}
      <Card className="border-border/80 shadow-xs">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-base font-semibold text-foreground">
              Asset Revenue & Occupancy Leaderboard
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Track exactly how much each individual billboard or screen has earned
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Filter Medium:</span>
            <Select value={selectedAssetFilter} onValueChange={setSelectedAssetFilter}>
              <SelectTrigger className="h-8 text-xs w-44">
                <SelectValue placeholder="All Formats" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Media Formats</SelectItem>
                <SelectItem value="digital_screen">Digital screens</SelectItem>
                <SelectItem value="indoor_mall_screen">Indoor mall screens</SelectItem>
                <SelectItem value="outdoor_hoarding">Outdoor hoardings</SelectItem>
                <SelectItem value="transit">Transit media</SelectItem>
                <SelectItem value="airport">Airport media</SelectItem>
                <SelectItem value="led_truck">LED trucks</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border/80 bg-muted/40 text-muted-foreground font-medium">
                  <th className="py-3 px-4">Media Asset / Location</th>
                  <th className="py-3 px-4">Format</th>
                  <th className="py-3 px-4">Monthly Rate</th>
                  <th className="py-3 px-4">Total Earned</th>
                  <th className="py-3 px-4">Occupancy</th>
                  <th className="py-3 px-4">Current Sponsor</th>
                  <th className="py-3 px-4">Contract End</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={asset.images[0]}
                          alt={asset.title}
                          className="size-10 rounded-md object-cover border border-border/60 shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-foreground hover:text-primary transition-colors cursor-pointer">
                            {asset.title}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {asset.city}, {asset.country} · {asset.dailyImpressions}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                      {mediumLabel(asset.medium)}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-foreground whitespace-nowrap">
                      {formatPrice(asset.pricePerMonth, asset.currency)}/mo
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                      {formatPrice(asset.totalRevenueEarned, asset.currency)}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              asset.occupancyRate >= 80
                                ? "bg-emerald-500"
                                : asset.occupancyRate >= 50
                                  ? "bg-amber-500"
                                  : "bg-primary"
                            }`}
                            style={{ width: `${asset.occupancyRate}%` }}
                          />
                        </div>
                        <span className="font-medium text-[11px]">{asset.occupancyRate}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-foreground whitespace-nowrap">
                      {asset.currentAdvertiser || (
                        <span className="text-muted-foreground italic">Available for booking</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                      {asset.activeContractEnd || "Immediate"}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      {asset.maintenance ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400">
                          Maintenance
                        </span>
                      ) : asset.available ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          Broadcasting
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-muted text-muted-foreground">
                          Fully Booked
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 4. Settlement & Payout History */}
      <Card className="border-border/80 shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-base font-semibold text-foreground">
              Settlement & Withdrawal Ledger
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              All bank wire transfers and electronic escrow disbursements
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              toast.success("Downloading consolidated financial tax summary (CSV/PDF)...");
            }}
            className="text-xs h-8"
          >
            <Download className="mr-1.5 size-3.5" /> Export Statements
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border/80 bg-muted/40 text-muted-foreground font-medium">
                  <th className="py-3 px-4">Invoice / Reference</th>
                  <th className="py-3 px-4">Payout Date</th>
                  <th className="py-3 px-4">Disbursement Method</th>
                  <th className="py-3 px-4">Account Reference</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {payouts.map((tx) => (
                  <tr key={tx.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-foreground">
                      {tx.invoiceNumber}
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">{tx.date}</td>
                    <td className="py-3.5 px-4 font-medium text-foreground capitalize">
                      {tx.method.replace("_", " ")}
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">{tx.accountReference}</td>
                    <td className="py-3.5 px-4 font-bold text-foreground">
                      {formatPrice(tx.amount, tx.currency)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="size-3" />
                        Completed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Payout Withdrawal Dialog */}
      <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Request Earnings Withdrawal</DialogTitle>
            <DialogDescription className="text-xs">
              Transfer settled advertising campaign revenues to your verified commercial bank
              account or payment provider.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleRequestPayout} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="amount" className="text-xs">
                Withdrawal Amount (USD)
              </Label>
              <Input
                id="amount"
                type="number"
                max={availableBalance}
                min={100}
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                required
              />
              <p className="text-[11px] text-muted-foreground">
                Maximum available for immediate disbursement:{" "}
                <strong>{formatPrice(availableBalance)}</strong>
              </p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Transfer Method</Label>
              <Select
                value={withdrawMethod}
                onValueChange={(val: PayoutTransaction["method"]) => setWithdrawMethod(val)}
              >
                <SelectTrigger className="text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank_wire">Commercial Bank Wire (ACH / SWIFT)</SelectItem>
                  <SelectItem value="stripe_connect">Stripe Connect Direct Deposit</SelectItem>
                  <SelectItem value="escrow_direct">Escrow.com Corporate Wallet</SelectItem>
                  <SelectItem value="paypal">Corporate PayPal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ref" className="text-xs">
                Account Details / Routing
              </Label>
              <Input
                id="ref"
                value={withdrawRef}
                onChange={(e) => setWithdrawRef(e.target.value)}
                placeholder="e.g. JPMorgan Chase Commercial Checking •••• 9812"
                required
              />
            </div>

            <div className="rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground space-y-1">
              <p className="font-medium text-foreground">Escrow Settlement Terms</p>
              <p>
                Transfers requested before 16:00 EST are processed same-day. No transfer fees are
                deducted from media owner earnings.
              </p>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsWithdrawOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              >
                Confirm & Disburse Funds
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
