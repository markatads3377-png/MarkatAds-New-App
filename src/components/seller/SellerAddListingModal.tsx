import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { type MediaAsset, type MediumType } from "./sellerTypes";
import { sellerStore } from "./sellerStore";
import { MEDIUMS } from "@/lib/mediums";

interface SellerAddListingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingAsset: MediaAsset | null;
}

const DEFAULT_FORM: Omit<
  MediaAsset,
  "id" | "createdAt" | "views" | "inquiriesCount" | "totalRevenueEarned"
> = {
  title: "",
  description: "",
  medium: "digital_screen",
  city: "",
  country: "",
  address: "",
  size: "",
  resolution: "3840 x 2160 (4K UHD)",
  lightingType: "Daylight SMD LED (8,000 Nits)",
  dailyImpressions: "250,000+ daily passes",
  decAudit: "Audited Circulation",
  pricePerMonth: 12500,
  spotRateDaily: 500,
  currency: "USD",
  images: [
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80",
  ],
  videoUrl: "",
  latitude: 40.7128,
  longitude: -74.006,
  available: true,
  secondHand: false,
  featured: false,
  maintenance: false,
  minimumFlight: "1 Month",
  occupancyRate: 0,
};

export const SellerAddListingModal: React.FC<SellerAddListingModalProps> = ({
  open,
  onOpenChange,
  editingAsset,
}) => {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [imagesText, setImagesText] = useState(DEFAULT_FORM.images.join("\n"));
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    if (editingAsset) {
      setForm({
        title: editingAsset.title,
        description: editingAsset.description,
        medium: editingAsset.medium,
        city: editingAsset.city,
        country: editingAsset.country,
        address: editingAsset.address,
        size: editingAsset.size,
        resolution: editingAsset.resolution || "3840 x 2160 (4K UHD)",
        lightingType: editingAsset.lightingType || "Daylight SMD LED",
        dailyImpressions: editingAsset.dailyImpressions,
        decAudit: editingAsset.decAudit || "Verified Audit",
        pricePerMonth: editingAsset.pricePerMonth,
        spotRateDaily: editingAsset.spotRateDaily || 450,
        currency: editingAsset.currency,
        images: editingAsset.images,
        videoUrl: editingAsset.videoUrl || "",
        latitude: editingAsset.latitude,
        longitude: editingAsset.longitude,
        available: editingAsset.available,
        secondHand: editingAsset.secondHand,
        featured: editingAsset.featured,
        maintenance: editingAsset.maintenance,
        minimumFlight: editingAsset.minimumFlight || "1 Month",
        occupancyRate: editingAsset.occupancyRate || 0,
        slots: editingAsset.slots,
        totalSlots: editingAsset.totalSlots,
        occupiedSlots: editingAsset.occupiedSlots,
      });
      setImagesText(editingAsset.images.join("\n"));
    } else {
      setForm(DEFAULT_FORM);
      setImagesText(DEFAULT_FORM.images.join("\n"));
    }
    setActiveStep(1);
  }, [editingAsset, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.city.trim() || !form.country.trim()) {
      toast.error("Please fill in the title, city, and country.");
      return;
    }

    const parsedImages = imagesText
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter((s) => s.startsWith("http"));

    const finalImages =
      parsedImages.length > 0
        ? parsedImages
        : [
            "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80",
          ];

    const payload = {
      ...form,
      images: finalImages,
      pricePerMonth: Number(form.pricePerMonth) || 1000,
      spotRateDaily: Number(form.spotRateDaily) || 100,
    };

    if (editingAsset) {
      sellerStore.updateAsset(editingAsset.id, payload);
      toast.success("Listing updated successfully!");
    } else {
      sellerStore.addAsset(payload);
      toast.success("New media asset published to marketplace!");
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">
            {editingAsset
              ? "Edit Media Asset Specifications"
              : "List New Media Space or DOOH Screen"}
          </DialogTitle>
          <DialogDescription className="text-xs">
            Complete the technical, location, and pricing details for your out-of-home inventory.
          </DialogDescription>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex items-center justify-between border-b border-border/60 pb-3 text-xs">
          <button
            type="button"
            onClick={() => setActiveStep(1)}
            className={`font-medium ${
              activeStep === 1
                ? "text-primary border-b-2 border-primary pb-1"
                : "text-muted-foreground"
            }`}
          >
            1. Location & Format
          </button>
          <button
            type="button"
            onClick={() => setActiveStep(2)}
            className={`font-medium ${
              activeStep === 2
                ? "text-primary border-b-2 border-primary pb-1"
                : "text-muted-foreground"
            }`}
          >
            2. Specs & Circulation
          </button>
          <button
            type="button"
            onClick={() => setActiveStep(3)}
            className={`font-medium ${
              activeStep === 3
                ? "text-primary border-b-2 border-primary pb-1"
                : "text-muted-foreground"
            }`}
          >
            3. Pricing & Visuals
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* STEP 1: LOCATION & FORMAT */}
          {activeStep === 1 && (
            <div className="space-y-3.5">
              <div className="space-y-1.5">
                <Label htmlFor="title" className="text-xs">
                  Asset Title / Landmark Name *
                </Label>
                <Input
                  id="title"
                  placeholder="e.g. Sunset Boulevard Curved 4K MegaScreen"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Medium Type *</Label>
                  <Select
                    value={form.medium}
                    onValueChange={(val: MediumType) => setForm({ ...form, medium: val })}
                  >
                    <SelectTrigger className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MEDIUMS.map((m) => (
                        <SelectItem key={m.value} value={m.value}>
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="city" className="text-xs">
                    City *
                  </Label>
                  <Input
                    id="city"
                    placeholder="e.g. Los Angeles"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="country" className="text-xs">
                    Country *
                  </Label>
                  <Input
                    id="country"
                    placeholder="e.g. United States"
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="address" className="text-xs">
                    Street Address / Concourse
                  </Label>
                  <Input
                    id="address"
                    placeholder="e.g. 8400 Sunset Blvd"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="desc" className="text-xs">
                  Description & Line-of-Sight Pitch
                </Label>
                <Textarea
                  id="desc"
                  rows={3}
                  placeholder="Describe arterial traffic, pedestrian dwell times, and visual impact..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setActiveStep(2)}
                  className="text-xs"
                >
                  Continue to Specs →
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: TECHNICAL SPECS & CIRCULATION */}
          {activeStep === 2 && (
            <div className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="size" className="text-xs">
                    Physical Size (W × H)
                  </Label>
                  <Input
                    id="size"
                    placeholder="e.g. 14ft x 48ft (672 sq.ft)"
                    value={form.size}
                    onChange={(e) => setForm({ ...form, size: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="resolution" className="text-xs">
                    Resolution / Pitch
                  </Label>
                  <Input
                    id="resolution"
                    placeholder="e.g. 3840 x 2160 (4K 60FPS)"
                    value={form.resolution}
                    onChange={(e) => setForm({ ...form, resolution: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="lighting" className="text-xs">
                    Illumination / Hardware
                  </Label>
                  <Input
                    id="lighting"
                    placeholder="e.g. Daylight SMD LED 8,500 Nits"
                    value={form.lightingType}
                    onChange={(e) => setForm({ ...form, lightingType: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="impressions" className="text-xs">
                    Daily Impressions / Footfall
                  </Label>
                  <Input
                    id="impressions"
                    placeholder="e.g. 320,000+ daily views"
                    value={form.dailyImpressions}
                    onChange={(e) => setForm({ ...form, dailyImpressions: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="audit" className="text-xs">
                    Traffic Audit Certification
                  </Label>
                  <Input
                    id="audit"
                    placeholder="e.g. Geopath Verified #LA-4410"
                    value={form.decAudit}
                    onChange={(e) => setForm({ ...form, decAudit: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="minFlight" className="text-xs">
                    Minimum Flight Duration
                  </Label>
                  <Select
                    value={form.minimumFlight}
                    onValueChange={(val) => setForm({ ...form, minimumFlight: val })}
                  >
                    <SelectTrigger className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1 Week">1 Week</SelectItem>
                      <SelectItem value="2 Weeks">2 Weeks</SelectItem>
                      <SelectItem value="1 Month">1 Month</SelectItem>
                      <SelectItem value="3 Months">3 Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveStep(1)}
                  className="text-xs"
                >
                  ← Back
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setActiveStep(3)}
                  className="text-xs"
                >
                  Continue to Pricing →
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: PRICING & VISUALS */}
          {activeStep === 3 && (
            <div className="space-y-3.5">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="price" className="text-xs">
                    Monthly Price *
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    min={0}
                    value={form.pricePerMonth}
                    onChange={(e) => setForm({ ...form, pricePerMonth: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="spotRate" className="text-xs">
                    Daily Spot Rate
                  </Label>
                  <Input
                    id="spotRate"
                    type="number"
                    min={0}
                    value={form.spotRateDaily}
                    onChange={(e) => setForm({ ...form, spotRateDaily: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="curr" className="text-xs">
                    Currency
                  </Label>
                  <Input
                    id="curr"
                    value={form.currency}
                    onChange={(e) => setForm({ ...form, currency: e.target.value.toUpperCase() })}
                    maxLength={3}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="images" className="text-xs">
                  Photo URLs (One per line)
                </Label>
                <Textarea
                  id="images"
                  rows={3}
                  value={imagesText}
                  onChange={(e) => setImagesText(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="video" className="text-xs">
                  Video Demonstration URL (Optional)
                </Label>
                <Input
                  id="video"
                  value={form.videoUrl}
                  onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              {/* Commercial Switches */}
              <div className="flex flex-wrap items-center gap-6 rounded-lg bg-muted/40 p-3 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Switch
                    checked={form.available}
                    onCheckedChange={(val) => setForm({ ...form, available: val })}
                  />
                  <span>Marketplace Active</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <Switch
                    checked={form.featured}
                    onCheckedChange={(val) => setForm({ ...form, featured: val })}
                  />
                  <span>Featured Spotlight</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <Switch
                    checked={form.secondHand}
                    onCheckedChange={(val) => setForm({ ...form, secondHand: val })}
                  />
                  <span>Second-Hand Space</span>
                </label>
              </div>

              <div className="flex justify-between pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveStep(2)}
                  className="text-xs"
                >
                  ← Back
                </Button>
                <Button type="submit" size="sm" className="text-xs font-semibold px-4">
                  {editingAsset ? "Save Changes" : "Publish to Fleet"}
                </Button>
              </div>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};
