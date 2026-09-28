import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEcom, PlacedOrder } from "@/context/EcomContext";
import {
  PackageCheck,
  Calendar,
  Download,
  UploadCloud,
  CheckCircle2,
  Clock,
  Sparkles,
  MapPin,
  FileText,
  Radio,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

export const OrdersTrackerModal: React.FC = () => {
  const { orders, isOrdersOpen, setIsOrdersOpen, formatMoney, uploadArtworkForOrder } = useEcom();
  const [selectedOrder, setSelectedOrder] = useState<PlacedOrder | null>(null);
  const [uploadingForId, setUploadingForId] = useState<string | null>(null);
  const [sampleArtworkUrl, setSampleArtworkUrl] = useState(
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200",
  );

  if (!isOrdersOpen) return null;

  const currentOrder = selectedOrder || orders[0] || null;

  const handleUploadSimulate = (e: React.FormEvent, orderId: string) => {
    e.preventDefault();
    uploadArtworkForOrder(orderId, sampleArtworkUrl);
    setUploadingForId(null);
  };

  const handlePrintOrder = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const getStatusColor = (status: PlacedOrder["status"]) => {
    switch (status) {
      case "Live on Air":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "Mounting & Prep":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "Creative Review":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "Completed":
        return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const stages: { key: PlacedOrder["status"]; label: string; desc: string }[] = [
    { key: "Booked", label: "Flight Booked", desc: "Contract locked in escrow" },
    { key: "Creative Review", label: "Artwork Pre-Flight", desc: "DPI & dimension verification" },
    {
      key: "Mounting & Prep",
      label: "Production / Mounting",
      desc: "Flex print & display scheduling",
    },
    { key: "Live on Air", label: "Active Live Broadcast", desc: "High-dwell visibility & audit" },
    { key: "Completed", label: "Flight Concluded", desc: "Proof-of-play report archived" },
  ];

  const getStageIndex = (status: PlacedOrder["status"]) => {
    return stages.findIndex((s) => s.key === status);
  };

  return (
    <Dialog open={isOrdersOpen} onOpenChange={setIsOrdersOpen}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-background border-border/80 shadow-2xl max-h-[92vh] flex flex-col">
        <DialogHeader className="p-5 border-b border-border/60 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-foreground">
                Campaign Orders & Flight Tracker
              </DialogTitle>
              <p className="text-xs text-muted-foreground">
                Manage your active advertising flights, artwork approvals, and tax invoices
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Orders list */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
              Your Booked Campaigns ({orders.length})
            </h4>
            {orders.length === 0 ? (
              <div className="p-6 rounded-2xl bg-muted/40 text-center text-xs text-muted-foreground border border-border/60">
                No campaign bookings yet.
              </div>
            ) : (
              orders.map((o) => (
                <div
                  key={o.id}
                  onClick={() => setSelectedOrder(o)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    currentOrder?.id === o.id
                      ? "bg-card border-primary ring-2 ring-primary/20 shadow-soft"
                      : "bg-muted/30 border-border/70 hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-mono font-bold text-xs text-foreground">{o.id}</span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-bold ${getStatusColor(o.status)}`}
                    >
                      {o.status}
                    </Badge>
                  </div>
                  <div className="font-bold text-xs text-foreground truncate">{o.companyName}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    {new Date(o.createdAt).toLocaleDateString()} •{" "}
                    {formatMoney(o.totalAmount, o.currency)}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right: Selected Order Detail */}
          {currentOrder && (
            <div className="lg:col-span-8 space-y-5 bg-card p-5 rounded-2xl border border-border/80 shadow-soft">
              {/* Top Details */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-mono text-base font-extrabold text-foreground">
                      {currentOrder.id}
                    </h3>
                    <Badge
                      variant="outline"
                      className={`text-xs font-bold ${getStatusColor(currentOrder.status)}`}
                    >
                      {currentOrder.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Advertiser: <strong>{currentOrder.advertiserName}</strong> (
                    {currentOrder.advertiserEmail})
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrintOrder}
                  className="text-xs font-semibold flex items-center gap-1.5 h-8 self-start sm:self-auto"
                >
                  <Download className="w-3.5 h-3.5" /> PDF Tax Invoice
                </Button>
              </div>

              {/* Progress Stepper */}
              <div className="space-y-2">
                <h4 className="font-bold text-xs text-foreground flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-primary" /> Live Flight Progress Tracker
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                  {stages.map((stg, idx) => {
                    const activeIndex = getStageIndex(currentOrder.status);
                    const isPassed = idx <= activeIndex;
                    const isCurrent = idx === activeIndex;

                    return (
                      <div
                        key={stg.key}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          isCurrent
                            ? "bg-primary/10 border-primary text-primary font-bold shadow-soft"
                            : isPassed
                              ? "bg-muted/60 border-border text-foreground"
                              : "bg-muted/20 border-border/40 text-muted-foreground opacity-50"
                        }`}
                      >
                        <div className="w-5 h-5 rounded-full bg-background border flex items-center justify-center mx-auto mb-1 text-[10px] font-bold">
                          {isPassed ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            idx + 1
                          )}
                        </div>
                        <div className="text-[11px] leading-tight font-bold">{stg.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Campaign Flight Dates & Escrow Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-muted/40 p-3 rounded-xl border border-border/60">
                  <span className="text-muted-foreground block mb-0.5">
                    Campaign Flight Schedule
                  </span>
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    {currentOrder.flightStartDate} → {currentOrder.flightEndDate}
                  </span>
                </div>
                <div className="bg-muted/40 p-3 rounded-xl border border-border/60">
                  <span className="text-muted-foreground block mb-0.5">
                    Payment & Escrow Protection
                  </span>
                  <span className="font-bold text-foreground flex items-center gap-1.5 truncate">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    {currentOrder.paymentMethod}
                  </span>
                </div>
              </div>

              {/* Artwork Upload Portal */}
              <div className="bg-muted/30 p-4 rounded-2xl border border-border/80 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-foreground flex items-center gap-1.5">
                    <UploadCloud className="w-4 h-4 text-primary" />
                    Creative Artwork Specification & Upload Portal
                  </h4>
                  {currentOrder.artworkUploaded ? (
                    <Badge className="bg-emerald-500/10 text-emerald-600 text-[10px] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Creative Approved
                    </Badge>
                  ) : (
                    <Badge className="bg-amber-500/10 text-amber-600 text-[10px] font-bold">
                      Awaiting Advertiser Upload
                    </Badge>
                  )}
                </div>

                {currentOrder.artworkUploaded ? (
                  <div className="flex items-center gap-3 p-2 bg-card rounded-xl border border-border/60">
                    <div className="w-16 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                      <img
                        src={currentOrder.artworkUrl}
                        alt="Uploaded Artwork"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-xs">
                      <div className="font-bold text-foreground">brand_campaign_keyart_4k.tif</div>
                      <div className="text-[11px] text-muted-foreground">
                        300 DPI • CMYK Colorspace • Approved for flight mounting
                      </div>
                    </div>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => handleUploadSimulate(e, currentOrder.id)}
                    className="space-y-2 text-xs"
                  >
                    <p className="text-[11px] text-muted-foreground">
                      Upload your high-res design file (TIFF, PDF, or MP4 for digital DOOH).
                      Automated aspect ratio & pixel compliance will execute instantly.
                    </p>
                    <div className="flex gap-2">
                      <Input
                        value={sampleArtworkUrl}
                        onChange={(e) => setSampleArtworkUrl(e.target.value)}
                        placeholder="Image URL or Cloud Asset Link"
                        className="h-8 text-xs bg-card"
                      />
                      <Button type="submit" size="sm" className="h-8 text-xs font-bold shrink-0">
                        Upload & Verify
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
