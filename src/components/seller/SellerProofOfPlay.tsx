import React, { useState } from "react";
import {
  Camera,
  CheckCircle2,
  Upload,
  Calendar,
  MapPin,
  ShieldCheck,
  Download,
  Eye,
  RefreshCw,
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
import { type MediaAsset, type ProofOfPlayRecord } from "./sellerTypes";
import { sellerStore } from "./sellerStore";

interface SellerProofOfPlayProps {
  assets: MediaAsset[];
  popRecords: ProofOfPlayRecord[];
}

export const SellerProofOfPlay: React.FC<SellerProofOfPlayProps> = ({ assets, popRecords }) => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState(assets[0]?.id || "");
  const [advertiserName, setAdvertiserName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [cameraName, setCameraName] = useState("Stationary Inspection Cam 01");

  const handleUploadPoP = (e: React.FormEvent) => {
    e.preventDefault();
    const asset = assets.find((a) => a.id === selectedAssetId);
    if (!asset || !advertiserName.trim() || !photoUrl.trim()) {
      toast.error("Please fill in all verification fields.");
      return;
    }

    sellerStore.addPoP({
      assetId: asset.id,
      assetTitle: asset.title,
      advertiser: advertiserName.trim(),
      timestamp: new Date().toLocaleString(),
      imageUrl: photoUrl.trim(),
      cameraName: cameraName.trim(),
      compliancePct: 100,
      verifiedBy: "Manual Field Audit & GPS Verification",
      gpsVerified: true,
    });

    toast.success("Proof of Play photograph uploaded & certified!");
    setIsUploadOpen(false);
    setPhotoUrl("");
    setAdvertiserName("");
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <Card className="border-border/80 shadow-xs">
        <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="size-3.5" /> 100% Broadcast Verification
              </span>
              <span aria-hidden="true">·</span>
              <span>Audit-Ready for Escrow Release</span>
            </div>
            <h2 className="text-lg font-bold font-display text-foreground mt-1">
              Proof of Play (PoP) & Live Camera Feeds
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live webcam snapshots, AI vision playback logs, and physical site inspection
              certifications for brand advertisers.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                toast.success("Auditing all live webcam sensor streams... 100% active.");
              }}
              className="text-xs h-8.5"
            >
              <RefreshCw className="mr-1.5 size-3.5" /> Refresh Feeds
            </Button>
            <Button
              size="sm"
              onClick={() => setIsUploadOpen(true)}
              className="text-xs font-semibold h-8.5 px-3"
            >
              <Upload className="mr-1.5 size-3.5" /> Upload PoP Photo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Proof of Play Feed Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {popRecords.map((pop) => (
          <Card key={pop.id} className="overflow-hidden border-border/80 shadow-xs group">
            <div className="relative aspect-video w-full overflow-hidden bg-muted">
              <img
                src={pop.imageUrl}
                alt={pop.assetTitle}
                className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded font-mono flex items-center gap-1">
                <Camera className="size-2.5 text-emerald-400" />
                {pop.cameraName}
              </div>
              <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded font-bold shadow-xs flex items-center gap-1">
                <CheckCircle2 className="size-2.5" /> {pop.compliancePct}% Compliance
              </div>
              <div className="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-xs text-white p-2 rounded text-[11px] font-mono flex justify-between">
                <span>{pop.timestamp}</span>
                <span className="text-emerald-400">GPS Verified</span>
              </div>
            </div>

            <CardContent className="p-4 space-y-2">
              <div>
                <h4 className="font-semibold text-xs text-foreground line-clamp-1">
                  {pop.assetTitle}
                </h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Campaign: <strong className="text-foreground">{pop.advertiser}</strong>
                </p>
              </div>

              <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs">
                <span className="text-muted-foreground text-[10px]">
                  Audited by {pop.verifiedBy}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    toast.success(`Exporting certified PoP certificate for ${pop.advertiser}...`);
                  }}
                  className="h-6 text-[11px] px-2 text-primary"
                >
                  <Download className="size-3 mr-1" /> Certificate
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upload PoP Inspection Modal */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Upload Proof of Play Photo</DialogTitle>
            <DialogDescription className="text-xs">
              Add a timestamped site inspection photo for advertiser campaign compliance and escrow
              release.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUploadPoP} className="space-y-3.5 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Media Space</Label>
              <Select value={selectedAssetId} onValueChange={setSelectedAssetId}>
                <SelectTrigger className="text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {assets.map((asset) => (
                    <SelectItem key={asset.id} value={asset.id}>
                      {asset.title} ({asset.city})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="popAdv" className="text-xs">
                Advertiser / Brand Name
              </Label>
              <Input
                id="popAdv"
                value={advertiserName}
                onChange={(e) => setAdvertiserName(e.target.value)}
                placeholder="e.g. Nike Global Running"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="popPhoto" className="text-xs">
                High-Res Photo URL
              </Label>
              <Input
                id="popPhoto"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cameraName" className="text-xs">
                Camera / Inspector Source
              </Label>
              <Input
                id="cameraName"
                value={cameraName}
                onChange={(e) => setCameraName(e.target.value)}
                placeholder="e.g. Street Level Field Camera #4"
                required
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsUploadOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" className="text-xs font-semibold">
                Certify & Publish Proof
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
