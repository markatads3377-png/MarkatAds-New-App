import React, { useState, useMemo } from "react";
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  Table as TableIcon,
  Plus,
  Eye,
  Edit3,
  Copy,
  Trash2,
  Camera,
  ExternalLink,
  MapPin,
  Sparkles,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Layers,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { type MediaAsset, type MediumType } from "./sellerTypes";
import { sellerStore } from "./sellerStore";
import { formatPrice, mediumLabel, MEDIUMS } from "@/lib/mediums";

interface SellerInventoryManagerProps {
  assets: MediaAsset[];
  onOpenAddModal: () => void;
  onEditAsset: (asset: MediaAsset) => void;
  onViewPoP: (asset: MediaAsset) => void;
  onOpenLoopScheduler: (asset: MediaAsset) => void;
}

export const SellerInventoryManager: React.FC<SellerInventoryManagerProps> = ({
  assets,
  onOpenAddModal,
  onEditAsset,
  onViewPoP,
  onOpenLoopScheduler,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [mediumFilter, setMediumFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("revenue");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Filtering & Sorting
  const filteredAssets = useMemo(() => {
    return assets
      .filter((asset) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = asset.title.toLowerCase().includes(q);
          const matchCity = asset.city.toLowerCase().includes(q);
          const matchCountry = asset.country.toLowerCase().includes(q);
          const matchAddress = asset.address?.toLowerCase().includes(q);
          const matchAdv = asset.currentAdvertiser?.toLowerCase().includes(q);
          if (!matchTitle && !matchCity && !matchCountry && !matchAddress && !matchAdv) {
            return false;
          }
        }

        if (mediumFilter !== "all" && asset.medium !== mediumFilter) {
          return false;
        }

        if (statusFilter === "available" && !asset.available) return false;
        if (statusFilter === "booked" && asset.available) return false;
        if (statusFilter === "featured" && !asset.featured) return false;
        if (statusFilter === "maintenance" && !asset.maintenance) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "revenue") return (b.totalRevenueEarned || 0) - (a.totalRevenueEarned || 0);
        if (sortBy === "price_high") return b.pricePerMonth - a.pricePerMonth;
        if (sortBy === "price_low") return a.pricePerMonth - b.pricePerMonth;
        if (sortBy === "views") return b.views - a.views;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [assets, searchQuery, mediumFilter, statusFilter, sortBy]);

  const handleToggleAvailable = (id: string, current: boolean) => {
    sellerStore.updateAsset(id, { available: !current });
    toast.success(!current ? "Asset marked available on marketplace" : "Asset paused / unlisted");
  };

  const handleToggleFeatured = (id: string, current: boolean) => {
    sellerStore.updateAsset(id, { featured: !current });
    toast.success(!current ? "Asset featured on homepage spotlight" : "Asset unfeatured");
  };

  const handleToggleMaintenance = (id: string, current: boolean) => {
    sellerStore.updateAsset(id, { maintenance: !current });
    toast.success(
      !current ? "Asset placed in maintenance mode" : "Maintenance completed; screen live",
    );
  };

  const handleDuplicate = (id: string) => {
    const dup = sellerStore.duplicateAsset(id);
    if (dup) {
      toast.success("Listing duplicated successfully!");
    }
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to remove "${title}" from your active fleet?`)) {
      sellerStore.deleteAsset(id);
      toast.success("Listing deleted");
    }
  };

  return (
    <div className="space-y-5">
      {/* Control Bar: Filters, Search, View Switcher */}
      <div className="flex flex-col gap-3 rounded-xl border border-border/80 bg-card p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative min-w-48 flex-1 sm:max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search screen, city, sponsor..."
              className="h-8 pl-8 text-xs"
            />
          </div>

          {/* Medium Filter */}
          <Select value={mediumFilter} onValueChange={setMediumFilter}>
            <SelectTrigger className="h-8 text-xs w-36">
              <SelectValue placeholder="All Mediums" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Formats</SelectItem>
              {MEDIUMS.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-8 text-xs w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="available">Available to Book</SelectItem>
              <SelectItem value="booked">Currently Booked</SelectItem>
              <SelectItem value="featured">Featured Only</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort By */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-8 text-xs w-36">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="revenue">Highest Revenue</SelectItem>
              <SelectItem value="price_high">Price: High to Low</SelectItem>
              <SelectItem value="price_low">Price: Low to High</SelectItem>
              <SelectItem value="views">Most Views</SelectItem>
              <SelectItem value="newest">Newest Listed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* View Mode & Add Button */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <div className="flex items-center rounded-lg border border-border/80 p-0.5 bg-muted/40">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "grid"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "table"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Dense Spreadsheet Table View"
            >
              <TableIcon className="size-3.5" />
            </button>
          </div>

          <Button onClick={onOpenAddModal} size="sm" className="h-8 text-xs font-semibold px-3">
            <Plus className="mr-1 size-3.5" /> Add Media
          </Button>
        </div>
      </div>

      {/* Results Count & Fleet Summary */}
      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
        <p>
          Showing <strong className="text-foreground">{filteredAssets.length}</strong> of{" "}
          {assets.length} media listings
        </p>
        <div className="flex items-center gap-3">
          <span>
            Active loops:{" "}
            <strong className="text-foreground">{assets.filter((a) => a.totalSlots).length}</strong>
          </span>
          <span aria-hidden="true">·</span>
          <span>
            In-flight revenue:{" "}
            <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">
              {formatPrice(assets.reduce((sum, a) => sum + (a.totalRevenueEarned || 0), 0))}
            </strong>
          </span>
        </div>
      </div>

      {/* VIEW MODE 1: VISUAL CARDS GRID */}
      {viewMode === "grid" && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAssets.map((asset) => (
            <Card
              key={asset.id}
              className="group overflow-hidden border-border/80 shadow-xs hover:shadow-md transition-all flex flex-col"
            >
              {/* Image & Visual Tags */}
              <div className="relative aspect-video w-full overflow-hidden bg-muted">
                <img
                  src={asset.images[0]}
                  alt={asset.title}
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Status Badges Overlay */}
                <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase bg-black/75 text-white backdrop-blur-xs">
                    {mediumLabel(asset.medium)}
                  </span>
                  {asset.featured && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500 text-white shadow-xs">
                      ★ Featured
                    </span>
                  )}
                  {asset.secondHand && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-600 text-white shadow-xs">
                      Resale Space
                    </span>
                  )}
                </div>

                {/* Broadcasting Status */}
                <div className="absolute top-2.5 right-2.5">
                  {asset.maintenance ? (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-600/90 text-white backdrop-blur-xs">
                      <Wrench className="size-2.5" /> Maintenance
                    </span>
                  ) : asset.available ? (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-600/90 text-white backdrop-blur-xs">
                      <span className="size-1.5 rounded-full bg-white animate-pulse" /> Live
                      Available
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-600/90 text-white backdrop-blur-xs">
                      Active Flight
                    </span>
                  )}
                </div>

                {/* Price Pill at bottom right of image */}
                <div className="absolute bottom-2.5 right-2.5 bg-black/80 backdrop-blur-xs text-white px-2.5 py-1 rounded-md text-xs font-bold">
                  {formatPrice(asset.pricePerMonth, asset.currency)}
                  <span className="text-[10px] font-normal text-slate-300">/mo</span>
                </div>
              </div>

              {/* Card Body */}
              <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {asset.title}
                    </h3>
                  </div>

                  {/* Clean unboxed metadata with dot separators */}
                  <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-0.5">
                      <MapPin className="size-3 text-muted-foreground" />
                      {asset.city}, {asset.country}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{asset.size}</span>
                  </div>

                  {/* Audience & Tech Specs */}
                  <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs bg-muted/30 p-2 rounded-lg border border-border/60">
                    <div>
                      <span className="text-[10px] text-muted-foreground block">
                        Daily Circulation
                      </span>
                      <span className="font-medium text-foreground">{asset.dailyImpressions}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">
                        Lifetime Earned
                      </span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {formatPrice(asset.totalRevenueEarned, asset.currency)}
                      </span>
                    </div>
                  </div>

                  {/* DOOH Slot Indicator or Current Advertiser */}
                  {asset.totalSlots ? (
                    <div className="mt-2.5 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground">DOOH Loop Occupancy</span>
                        <span className="font-semibold text-foreground">
                          {asset.occupiedSlots} / {asset.totalSlots} slots ({asset.occupancyRate}%)
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${asset.occupancyRate}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2 text-xs text-muted-foreground">
                      <span>Sponsor: </span>
                      <strong className="text-foreground">
                        {asset.currentAdvertiser || "Vacant / Available"}
                      </strong>
                    </div>
                  )}
                </div>

                {/* Bottom Quick Controls & Actions */}
                <div className="pt-3 border-t border-border/60 space-y-2.5">
                  {/* Quick Toggles Row */}
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <Switch
                        checked={asset.available}
                        onCheckedChange={() => handleToggleAvailable(asset.id, asset.available)}
                        className="scale-75 origin-left"
                      />
                      <span>Marketplace</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <Switch
                        checked={asset.featured}
                        onCheckedChange={() => handleToggleFeatured(asset.id, asset.featured)}
                        className="scale-75 origin-left"
                      />
                      <span>Feature</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <Switch
                        checked={asset.maintenance}
                        onCheckedChange={() => handleToggleMaintenance(asset.id, asset.maintenance)}
                        className="scale-75 origin-left"
                      />
                      <span>Maint.</span>
                    </label>
                  </div>

                  {/* Buttons Row */}
                  <div className="flex items-center gap-1.5">
                    {asset.totalSlots && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onOpenLoopScheduler(asset)}
                        className="flex-1 text-xs h-7.5 px-2 font-medium"
                      >
                        <Layers className="size-3 mr-1 text-primary" /> Slots
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewPoP(asset)}
                      className="text-xs h-7.5 px-2"
                      title="Proof of Play"
                    >
                      <Camera className="size-3" />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditAsset(asset)}
                      className="text-xs h-7.5 px-2"
                      title="Edit Specs & Pricing"
                    >
                      <Edit3 className="size-3" />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDuplicate(asset.id)}
                      className="text-xs h-7.5 px-2"
                      title="Duplicate Listing"
                    >
                      <Copy className="size-3" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(asset.id, asset.title)}
                      className="text-xs h-7.5 px-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                      title="Delete Listing"
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* VIEW MODE 2: DENSE ENTERPRISE SPREADSHEET TABLE */}
      {viewMode === "table" && (
        <Card className="border-border/80 shadow-xs overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border/80 bg-muted/40 text-muted-foreground font-medium">
                    <th className="py-3 px-4">Screen / Asset</th>
                    <th className="py-3 px-4">Format</th>
                    <th className="py-3 px-4">Dimensions</th>
                    <th className="py-3 px-4">Monthly Rate</th>
                    <th className="py-3 px-4">Total Earned</th>
                    <th className="py-3 px-4">Occupancy</th>
                    <th className="py-3 px-4">Daily Views</th>
                    <th className="py-3 px-4">Marketplace Live</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredAssets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={asset.images[0]}
                            alt={asset.title}
                            className="size-9 rounded-md object-cover border border-border/60 shrink-0"
                          />
                          <div>
                            <p className="font-semibold text-foreground hover:text-primary transition-colors cursor-pointer">
                              {asset.title}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              {asset.city}, {asset.country}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                        {mediumLabel(asset.medium)}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                        {asset.size}
                      </td>
                      <td className="py-3 px-4 font-semibold text-foreground whitespace-nowrap">
                        {formatPrice(asset.pricePerMonth, asset.currency)}/mo
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                        {formatPrice(asset.totalRevenueEarned, asset.currency)}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-semibold text-foreground">
                          {asset.occupancyRate}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                        {asset.dailyImpressions}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <Switch
                          checked={asset.available}
                          onCheckedChange={() => handleToggleAvailable(asset.id, asset.available)}
                          className="scale-75"
                        />
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEditAsset(asset)}
                            className="size-7"
                            title="Edit"
                          >
                            <Edit3 className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onViewPoP(asset)}
                            className="size-7"
                            title="Proof of Play"
                          >
                            <Camera className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDuplicate(asset.id)}
                            className="size-7"
                            title="Duplicate"
                          >
                            <Copy className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(asset.id, asset.title)}
                            className="size-7 text-rose-500 hover:text-rose-600"
                            title="Delete"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
