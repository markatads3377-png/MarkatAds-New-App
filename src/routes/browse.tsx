import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { Search, Sparkles, SlidersHorizontal, MapPin, Eye, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { SiteHeader } from "@/components/SiteHeader";
import { ListingCard } from "@/components/ListingCard";
import { supabase } from "@/integrations/supabase/client";
import { MEDIUMS } from "@/lib/mediums";
import { type ExtendedListing } from "@/data/mockCatalog";
import { useEcom } from "@/context/EcomContext";
import { useLiveCatalog } from "@/hooks/useLiveCatalog";

export const Route = createFileRoute("/browse")({
  head: () => ({
    meta: [
      { title: "Browse Advertising Media Worldwide — Mark@Ads" },
      {
        name: "description",
        content:
          "Explore billboards, 4K digital LED screens, transit escalator ribbons, mall atriums, and airport spectaculars worldwide with instant escrow booking.",
      },
      { property: "og:title", content: "Browse Advertising Media Worldwide — Mark@Ads" },
      {
        property: "og:description",
        content:
          "Search, compare, and instantly book advertising spaces across major global business hubs.",
      },
    ],
  }),
  component: BrowsePage,
});

function BrowsePage() {
  const [q, setQ] = useState("");
  const [medium, setMedium] = useState("all");
  const [city, setCity] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  const { formatMoney, convertPrice } = useEcom();
  const { listings: liveCatalogListings } = useLiveCatalog();

  const { data: dbListings, isLoading } = useQuery({
    queryKey: ["public-listings"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("listings")
          .select(
            "id,title,description,medium,city,country,size,price_per_month,currency,available,second_hand,images,featured",
          )
          .eq("status", "approved")
          .order("featured", { ascending: false })
          .limit(40);

        if (error) {
          console.warn("[Browse] DB Query error:", error.message);
          return [] as ExtendedListing[];
        }
        return (data ?? []) as ExtendedListing[];
      } catch (err) {
        return [] as ExtendedListing[];
      }
    },
  });

  // Combine live catalog (synced with seller uploads) with any DB items
  const allListings = useMemo(() => {
    const combined = [...liveCatalogListings];
    if (dbListings && dbListings.length > 0) {
      dbListings.forEach((item) => {
        if (!combined.some((c) => c.id === item.id)) {
          combined.push(item);
        }
      });
    }
    return combined;
  }, [liveCatalogListings, dbListings]);

  // Client-side filtering & search
  const filteredListings = useMemo(() => {
    return allListings
      .filter((item) => {
        if (q.trim()) {
          const term = q.toLowerCase().trim();
          const matchesTitle = item.title.toLowerCase().includes(term);
          const matchesCity = item.city.toLowerCase().includes(term);
          const matchesCountry = item.country.toLowerCase().includes(term);
          const matchesDesc = item.description?.toLowerCase().includes(term);
          if (!matchesTitle && !matchesCity && !matchesCountry && !matchesDesc) {
            return false;
          }
        }

        if (medium !== "all" && item.medium !== medium) {
          return false;
        }

        if (city.trim()) {
          if (!item.city.toLowerCase().includes(city.toLowerCase().trim())) {
            return false;
          }
        }

        if (maxPrice && Number(maxPrice) > 0) {
          const itemConvertedPrice = convertPrice(item.price_per_month, item.currency);
          if (itemConvertedPrice > Number(maxPrice)) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "featured") {
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        }
        if (sortBy === "price_asc") {
          return (
            convertPrice(a.price_per_month, a.currency) -
            convertPrice(b.price_per_month, b.currency)
          );
        }
        if (sortBy === "price_desc") {
          return (
            convertPrice(b.price_per_month, b.currency) -
            convertPrice(a.price_per_month, a.currency)
          );
        }
        return 0;
      });
  }, [allListings, q, medium, city, maxPrice, sortBy, convertPrice]);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 space-y-8">
        {/* Title Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-semibold">
                <Sparkles className="w-3 h-3 mr-1" /> Global OOH & DOOH Marketplace
              </Badge>
              <span className="text-xs text-muted-foreground font-medium">
                {filteredListings.length} spaces live & bookable
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Browse Advertising Spaces
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              Select verified billboards, airport displays, transit networks, and high-impact
              digital screens. Configure duration and turnkey production in 1-click.
            </p>
          </div>

          {/* Quick Medium Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {[
              { id: "all", label: "All Spaces" },
              { id: "billboard", label: "Billboards" },
              { id: "digital_screen", label: "Digital LED" },
              { id: "transit", label: "Transit & Metro" },
              { id: "mall", label: "Malls & Retail" },
              { id: "airport", label: "Airports" },
            ].map((pill) => (
              <button
                key={pill.id}
                type="button"
                onClick={() => setMedium(pill.id)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all shrink-0 ${
                  medium === pill.id
                    ? "bg-primary text-primary-foreground border-primary shadow-soft"
                    : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="grid gap-3 rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-soft sm:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-1.5 sm:col-span-2 lg:col-span-2">
            <Label htmlFor="q" className="text-xs font-semibold">
              Search Space or Location
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input
                id="q"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search Bandra, Dubai, Times Square, LED, Billboard..."
                className="pl-9 h-9 text-xs bg-background"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Medium Category</Label>
            <Select value={medium} onValueChange={setMedium}>
              <SelectTrigger className="h-9 text-xs bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Medium Types</SelectItem>
                {MEDIUMS.map((m) => (
                  <SelectItem key={m.value} value={m.value} className="text-xs">
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="city" className="text-xs font-semibold">
              Filter City
            </Label>
            <Input
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Mumbai, Dubai, London..."
              className="h-9 text-xs bg-background"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Sort Order</Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-9 text-xs bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured" className="text-xs">
                  Featured First
                </SelectItem>
                <SelectItem value="price_asc" className="text-xs">
                  Price: Low to High
                </SelectItem>
                <SelectItem value="price_desc" className="text-xs">
                  Price: High to Low
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-96 rounded-2xl" />
              ))
            : filteredListings.map((listing) => <ListingCard key={listing.id} listing={listing} />)}
        </div>

        {/* Empty State */}
        {!isLoading && filteredListings.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center bg-card/50 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto text-muted-foreground">
              <Search className="w-6 h-6 opacity-40" />
            </div>
            <p className="font-display text-base font-bold text-foreground">
              No media spaces matched your filter
            </p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Try clearing some search terms or adjusting the medium category filter.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setQ("");
                setMedium("all");
                setCity("");
                setMaxPrice("");
              }}
              className="text-xs font-semibold"
            >
              Reset All Filters
            </Button>
          </div>
        )}

        {/* Bottom Banner */}
        <div className="surface-matte rounded-3xl p-8 text-center shadow-soft border border-border/60 space-y-3">
          <h2 className="font-display text-2xl font-bold text-foreground">
            Looking for Custom Multi-Market Campaigns?
          </h2>
          <p className="text-xs text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Our media planning experts can curate a multi-city OOH flight with programmatic DOOH
            targeting, dedicated printing crews, and escrow guarantees.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Button asChild className="font-bold text-xs">
              <Link to="/signup">Start Enterprise Campaign</Link>
            </Button>
            <Button asChild variant="outline" className="text-xs font-semibold">
              <Link to="/pricing">View Volume Discounts</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
