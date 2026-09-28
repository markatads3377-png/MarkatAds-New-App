import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Image,
  Video,
  Sparkles,
  MapPin,
  TrendingUp,
  Clock,
  Eye,
  CheckCircle2,
  Building2,
  Tag,
} from "lucide-react";
import { createFeedPost, type FeedPost, type OOHMediumCategory } from "@/lib/feedService";
import { MOCK_CATALOG } from "@/data/mockCatalog";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (post: FeedPost) => void;
}

const PRESET_PHOTOS = [
  {
    label: "Highway Unipole Billboard",
    url: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&auto=format&fit=crop&q=80",
    format: "highway_unipole" as OOHMediumCategory,
  },
  {
    label: "Luxury Mall LED",
    url: "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=1200&auto=format&fit=crop&q=80",
    format: "mall_atrium" as OOHMediumCategory,
  },
  {
    label: "Times Square Roadblock",
    url: "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=1200&auto=format&fit=crop&q=80",
    format: "digital_billboard" as OOHMediumCategory,
  },
  {
    label: "Tokyo Synchronized DOOH",
    url: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=1200&auto=format&fit=crop&q=80",
    format: "anamorphic_3d" as OOHMediumCategory,
  },
  {
    label: "Airport Mega Display",
    url: "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=1200&auto=format&fit=crop&q=80",
    format: "airport_led" as OOHMediumCategory,
  },
];

const PRESET_VIDEOS = [
  {
    label: "3D DOOH Times Square Video Loop",
    url: "https://assets.mixkit.co/videos/preview/mixkit-busy-crosswalk-in-times-square-at-night-4223-large.mp4",
    format: "anamorphic_3d" as OOHMediumCategory,
  },
  {
    label: "Metro Transit Escalator Dynamic Feed",
    url: "https://assets.mixkit.co/videos/preview/mixkit-busy-metro-station-during-rush-hour-42031-large.mp4",
    format: "metro_station" as OOHMediumCategory,
  },
  {
    label: "Urban Highway Traffic & Digital Signage",
    url: "https://assets.mixkit.co/videos/preview/mixkit-traffic-at-night-in-a-busy-city-4328-large.mp4",
    format: "highway_unipole" as OOHMediumCategory,
  },
];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onPostCreated,
}) => {
  const { user, username, displayName, role } = useAuth();

  const [mediaType, setMediaType] = useState<"photo" | "video">("photo");
  const [mediaUrl, setMediaUrl] = useState(PRESET_PHOTOS[0].url);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [oohMedium, setOohMedium] = useState<OOHMediumCategory>("digital_billboard");
  const [city, setCity] = useState("New York");
  const [country, setCountry] = useState("United States");
  const [area, setArea] = useState("Downtown / Central Arterial");
  const [landmark, setLandmark] = useState("");

  // OOH Insights
  const [dailyTraffic, setDailyTraffic] = useState("250,000+ daily impressions");
  const [dwellTimeSeconds, setDwellTimeSeconds] = useState(45);
  const [visibilityRating, setVisibilityRating] = useState(9.4);
  const [daypartingPeak, setDaypartingPeak] = useState("Morning & Evening Rush Hours");
  const [keyAdvantage, setKeyAdvantage] = useState(
    "Head-on vehicular eye-level positioning with zero line-of-sight obstruction.",
  );
  const [selectedListingId, setSelectedListingId] = useState<string>("none");

  const [submitting, setSubmitting] = useState(false);

  const coinReward = mediaType === "video" ? 75 : 50;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !mediaUrl.trim() || !city.trim()) {
      toast.error("Please fill in the title, city, and provide media.");
      return;
    }

    setSubmitting(true);
    try {
      const selectedListing =
        selectedListingId !== "none"
          ? MOCK_CATALOG.find((l) => l.id === selectedListingId)
          : undefined;

      const created = await createFeedPost(
        {
          authorId: user?.uid || "spotter-current",
          authorName: displayName || username || "Community Spotter",
          authorUsername: username || "spotter_pro",
          authorAvatar:
            user?.photoURL ||
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
          authorRole:
            (role as "advertiser" | "seller" | "agency" | "spotter" | "admin") || "spotter",
          authorBadge: "🥇 Verified Spotter",
          title: title.trim(),
          description: description.trim() || "Real-world OOH sighting and placement intelligence.",
          mediaType,
          mediaUrl: mediaUrl.trim(),
          thumbnailUrl: mediaType === "video" ? PRESET_PHOTOS[0].url : undefined,
          oohMedium,
          city: city.trim(),
          country: country.trim(),
          area: area.trim(),
          landmark: landmark.trim() || undefined,
          insights: {
            dailyTraffic: dailyTraffic.trim(),
            dwellTimeSeconds: Number(dwellTimeSeconds) || 45,
            visibilityRating: Number(visibilityRating) || 9.0,
            daypartingPeak: daypartingPeak.trim(),
            bestIndustries: ["Automotive", "Fintech", "Consumer Tech", "Luxury Retail"],
            keyAdvantage: keyAdvantage.trim(),
            recommendedCpm: "$4.50 - $8.00",
          },
          linkedListingId: selectedListing?.id,
          linkedListingTitle: selectedListing?.title,
          linkedListingPrice: selectedListing?.price_per_month,
          linkedListingCurrency: selectedListing?.currency,
          tags: [oohMedium, city.replace(/\s+/g, ""), "OOHInsight", "MarkAtAds"],
          verifiedSpotter: true,
        },
        user?.uid,
      );

      onPostCreated(created);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to post sighting. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 overflow-hidden bg-background border-border">
        {/* Modal Header */}
        <DialogHeader className="p-4 sm:p-6 border-b border-border/80 bg-muted/20">
          <div className="flex items-center justify-between gap-4">
            <div>
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                <span>Add OOH Sighting & Medium Insight</span>
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Share real-world billboard photos, DOOH video reels, and traffic insights to empower
                media buyers.
              </DialogDescription>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25 text-xs font-bold shrink-0">
              <Sparkles className="size-4 text-amber-500 animate-pulse" />
              <span>Earn +{coinReward} OOH Coins</span>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Media Type Switcher & Presets */}
          <div className="space-y-3 p-4 rounded-xl bg-card border border-border/70">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <span>1. Select Media Type</span>
              </label>
              <Tabs
                value={mediaType}
                onValueChange={(val) => {
                  const mType = val as "photo" | "video";
                  setMediaType(mType);
                  if (mType === "video") {
                    setMediaUrl(PRESET_VIDEOS[0].url);
                    setOohMedium(PRESET_VIDEOS[0].format);
                  } else {
                    setMediaUrl(PRESET_PHOTOS[0].url);
                    setOohMedium(PRESET_PHOTOS[0].format);
                  }
                }}
              >
                <TabsList className="h-8">
                  <TabsTrigger value="photo" className="text-xs gap-1.5 h-7">
                    <Image className="size-3.5" />
                    <span>Photo (+50 Coins)</span>
                  </TabsTrigger>
                  <TabsTrigger value="video" className="text-xs gap-1.5 h-7">
                    <Video className="size-3.5" />
                    <span>Video (+75 Coins)</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Quick Pick Presets */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-semibold text-muted-foreground">
                Quick pick sample {mediaType} (or paste custom URL below):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(mediaType === "photo" ? PRESET_PHOTOS : PRESET_VIDEOS).map((preset) => (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => {
                      setMediaUrl(preset.url);
                      setOohMedium(preset.format);
                    }}
                    className={`text-left p-2 rounded-lg border text-xs transition-all ${
                      mediaUrl === preset.url
                        ? "border-primary bg-primary/10 text-primary font-semibold shadow-xs"
                        : "border-border/70 bg-muted/40 hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    <p className="truncate font-medium">{preset.label}</p>
                    <span className="text-[10px] opacity-75 capitalize">
                      {preset.format.replace("_", " ")}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Media URL Input */}
            <div className="pt-2">
              <label className="text-xs font-medium text-muted-foreground block mb-1">
                Custom{" "}
                {mediaType === "video" ? "Video URL (MP4 / WebM)" : "Photo URL (JPEG / PNG / WebP)"}
              </label>
              <Input
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder={
                  mediaType === "video"
                    ? "https://example.com/billboard-reel.mp4"
                    : "https://example.com/billboard-photo.jpg"
                }
                className="h-9 text-xs"
                required
              />
            </div>

            {/* Live Media Preview */}
            {mediaUrl && (
              <div className="mt-2 rounded-lg overflow-hidden border border-border bg-black/5 aspect-video max-h-48 relative grid place-items-center">
                {mediaType === "video" ? (
                  <video
                    src={mediaUrl}
                    controls
                    muted
                    autoPlay
                    loop
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={mediaUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = PRESET_PHOTOS[0].url;
                    }}
                  />
                )}
              </div>
            )}
          </div>

          {/* Sighting Information */}
          <div className="space-y-4 p-4 rounded-xl bg-card border border-border/70">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
              2. Sighting Details & OOH Classification
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium">Placement Title *</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Piccadilly Lights Curved LED Roadblock"
                  className="h-9 text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium">OOH Medium Category *</label>
                <Select
                  value={oohMedium}
                  onValueChange={(val: OOHMediumCategory) => setOohMedium(val)}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Select OOH Medium" />
                  </SelectTrigger>
                  <SelectContent className="text-xs">
                    <SelectItem value="digital_billboard">Digital Billboard (DOOH)</SelectItem>
                    <SelectItem value="highway_unipole">Highway Unipole Hoarding</SelectItem>
                    <SelectItem value="anamorphic_3d">3D Anamorphic Spectacular</SelectItem>
                    <SelectItem value="transit_bus">Transit Bus Wrap & Fleet</SelectItem>
                    <SelectItem value="metro_station">Metro & Underground Screen</SelectItem>
                    <SelectItem value="airport_led">Airport Mega Concourse LED</SelectItem>
                    <SelectItem value="mall_atrium">Mall Atrium Curved Display</SelectItem>
                    <SelectItem value="street_furniture">Street Furniture & Kiosk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium">City *</label>
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. London, Mumbai, New York"
                  className="h-9 text-xs"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">Country *</label>
                <Input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. United Kingdom"
                  className="h-9 text-xs"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">Neighborhood / Area</label>
                <Input
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. West End / Piccadilly"
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium">Observation Notes & Visual Impact</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe lighting clarity, commuter dwell behaviors, viewing angles, or creative execution details..."
                rows={2}
                className="text-xs resize-none"
              />
            </div>
          </div>

          {/* OOH Ecosystem Insights */}
          <div className="space-y-4 p-4 rounded-xl bg-card border border-border/70">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="size-3.5 text-primary" />
              <span>3. Out-Of-Home Medium Insights (Helps Buyers Decide)</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium flex items-center gap-1">
                  <Eye className="size-3 text-muted-foreground" />
                  Estimated Daily Traffic
                </label>
                <Input
                  value={dailyTraffic}
                  onChange={(e) => setDailyTraffic(e.target.value)}
                  placeholder="e.g. 350,000+ daily vehicles"
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium flex items-center gap-1">
                  <Clock className="size-3 text-muted-foreground" />
                  Avg Dwell Time (Seconds)
                </label>
                <Input
                  type="number"
                  value={dwellTimeSeconds}
                  onChange={(e) => setDwellTimeSeconds(Number(e.target.value))}
                  min={5}
                  max={300}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium">Visibility Score (1 - 10)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={visibilityRating}
                  onChange={(e) => setVisibilityRating(Number(e.target.value))}
                  min={1}
                  max={10}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium">Key Media Advantage</label>
              <Input
                value={keyAdvantage}
                onChange={(e) => setKeyAdvantage(e.target.value)}
                placeholder="e.g. 100% unblocked sightline at signal with high executive driver dwell"
                className="h-9 text-xs"
              />
            </div>
          </div>

          {/* Connect to Marketplace Listing for Direct Purchase */}
          <div className="space-y-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Building2 className="size-3.5 text-primary" />
                <span>4. Connect Marketplace Inventory (Direct Purchase)</span>
              </label>
              <span className="text-[11px] text-muted-foreground">Optional link to catalog</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Link this post to a bookable ad space from the catalog so community members can
              directly purchase or rent it!
            </p>
            <Select value={selectedListingId} onValueChange={(val) => setSelectedListingId(val)}>
              <SelectTrigger className="h-9 text-xs bg-background">
                <SelectValue placeholder="Choose a matching catalog medium" />
              </SelectTrigger>
              <SelectContent className="text-xs max-h-60">
                <SelectItem value="none">
                  -- No direct purchase link (Informational Spot) --
                </SelectItem>
                {MOCK_CATALOG.map((listing) => (
                  <SelectItem key={listing.id} value={listing.id}>
                    {listing.title} ({listing.city}) — {listing.currency}{" "}
                    {listing.price_per_month.toLocaleString()}/mo
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <CheckCircle2 className="size-3.5 text-emerald-500" />
              Instant verified spotter publishing & coin reward
            </span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={submitting}
                className="h-9 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting || !title.trim()}
                className="h-9 text-xs font-semibold gap-1.5 px-5"
              >
                <Sparkles className="size-3.5" />
                {submitting ? "Publishing Sighting..." : `Publish & Collect +${coinReward} Coins`}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
