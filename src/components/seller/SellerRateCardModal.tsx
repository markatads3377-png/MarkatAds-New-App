import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Copy, Printer, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { type MediaAsset } from "./sellerTypes";
import { formatPrice, mediumLabel } from "@/lib/mediums";

interface SellerRateCardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assets: MediaAsset[];
}

export const SellerRateCardModal: React.FC<SellerRateCardModalProps> = ({
  open,
  onOpenChange,
  assets,
}) => {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/browse`);
    toast.success("Rate Card link copied to clipboard!");
  };

  const handlePrint = () => {
    toast.success("Generating printable Agency Media Kit & Rate Card (PDF)...");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="font-display text-xl">
                Official Agency Rate Card & Media Kit 2026
              </DialogTitle>
              <DialogDescription className="text-xs">
                Comprehensive inventory pricing, audience verification, and mechanical
                specifications.
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleCopyLink} className="text-xs h-8">
                <Copy className="size-3 mr-1" /> Copy Link
              </Button>
              <Button size="sm" onClick={handlePrint} className="text-xs h-8">
                <Download className="size-3 mr-1" /> Export PDF
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Rate Card Content */}
        <div className="space-y-6 py-2 text-xs">
          {/* Executive Overview */}
          <div className="rounded-xl border border-border/80 bg-muted/30 p-4 space-y-2">
            <h4 className="font-semibold text-sm text-foreground">Fleet & Audience Overview</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
              <div>
                <span className="text-muted-foreground block text-[11px]">Total Network Units</span>
                <span className="font-bold text-foreground text-sm">
                  {assets.length} Premium Locations
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Combined Footfall</span>
                <span className="font-bold text-foreground text-sm">2,400,000+ Daily Eyes</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Audience Profile</span>
                <span className="font-bold text-foreground text-sm">A/B Commuters & Tourists</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Verification</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                  100% PoP Audit
                </span>
              </div>
            </div>
          </div>

          {/* Pricing Matrix */}
          <div>
            <h4 className="font-semibold text-sm text-foreground mb-2">
              Published Rate Card (Standard Net 30)
            </h4>
            <div className="overflow-x-auto rounded-lg border border-border/80">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border/80 bg-muted/50 font-medium text-muted-foreground">
                    <th className="py-2.5 px-3">Location / Medium</th>
                    <th className="py-2.5 px-3">Format</th>
                    <th className="py-2.5 px-3">Size & Resolution</th>
                    <th className="py-2.5 px-3">Daily Impressions</th>
                    <th className="py-2.5 px-3 text-right">Standard Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {assets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-muted/20">
                      <td className="py-2.5 px-3 font-semibold text-foreground">
                        {asset.title}
                        <span className="block text-[11px] font-normal text-muted-foreground">
                          {asset.city}, {asset.country}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-muted-foreground whitespace-nowrap">
                        {mediumLabel(asset.medium)}
                      </td>
                      <td className="py-2.5 px-3 text-muted-foreground">
                        {asset.size}
                        {asset.resolution && (
                          <span className="block text-[10px]">{asset.resolution}</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-muted-foreground whitespace-nowrap">
                        {asset.dailyImpressions}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-foreground text-right whitespace-nowrap">
                        {formatPrice(asset.pricePerMonth, asset.currency)}/mo
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Technical Specs & Creative Delivery Guidelines */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border/80 p-3.5 space-y-1.5 bg-card">
              <h5 className="font-semibold text-foreground">Digital Screen Guidelines (DOOH)</h5>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground text-[11px]">
                <li>File formats: MP4 (H.264 / ProRes 422), 60 FPS, No audio track</li>
                <li>Duration: 10 seconds or 15 seconds seamless loop</li>
                <li>Delivery deadline: 72 hours prior to scheduled flight launch</li>
                <li>Color space: Rec.709 / sRGB uncompressed</li>
              </ul>
            </div>

            <div className="rounded-lg border border-border/80 p-3.5 space-y-1.5 bg-card">
              <h5 className="font-semibold text-foreground">Static Billboard Guidelines (OOH)</h5>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground text-[11px]">
                <li>File formats: TIFF, PDF (vector), or High-Res JPG (300 DPI at 1:10 scale)</li>
                <li>Printing substrate: Heavy-duty weatherproof flex vinyl with grommets</li>
                <li>Bleed allowance: 6 inches all around for wrapping</li>
                <li>Proof of installation: Live photos certified within 24 hours of mount</li>
              </ul>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
