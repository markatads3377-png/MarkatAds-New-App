import React, { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sparkles,
  Plus,
  Coins,
  Search,
  Filter,
  Image,
  Video,
  TrendingUp,
  Award,
  ShieldCheck,
  User,
  Gift,
  Flame,
  ArrowUpDown,
} from "lucide-react";
import {
  type FeedPost,
  getLocalFeedPosts,
  fetchFeedPosts,
  type OOHMediumCategory,
} from "@/lib/feedService";
import {
  getLocalCoins,
  claimDailyCheckin,
  canClaimDailyCheckin,
  calculateSpotterLevel,
} from "@/lib/coinService";
import { FeedPostCard } from "@/components/feed/FeedPostCard";
import { CreatePostModal } from "@/components/feed/CreatePostModal";
import { CommentsModal } from "@/components/feed/CommentsModal";
import { OOHInsightsMatrix } from "@/components/feed/OOHInsightsMatrix";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/feed")({
  component: FeedPage,
});

function FeedPage() {
  const { user, username, displayName } = useAuth();

  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFormat, setSelectedFormat] = useState<string>("all");
  const [selectedMediaType, setSelectedMediaType] = useState<"all" | "photo" | "video">("all");
  const [sortBy, setSortBy] = useState<"trending" | "latest" | "most_liked">("trending");

  // Coins state
  const [userCoins, setUserCoins] = useState(() => getLocalCoins(user?.uid));
  const [canClaimDaily, setCanClaimDaily] = useState(() => canClaimDailyCheckin(user?.uid));

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeCommentsPost, setActiveCommentsPost] = useState<FeedPost | null>(null);

  // Sync feed posts on mount
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await fetchFeedPosts();
        setPosts(data);
      } finally {
        setLoading(false);
      }
    }
    loadData();

    const handleFeedUpdate = () => {
      setPosts(getLocalFeedPosts());
    };
    const handleCoinsUpdate = () => {
      setUserCoins(getLocalCoins(user?.uid));
      setCanClaimDaily(canClaimDailyCheckin(user?.uid));
    };

    window.addEventListener("markatads_feed_updated", handleFeedUpdate);
    window.addEventListener("markatads_coins_updated", handleCoinsUpdate);

    return () => {
      window.removeEventListener("markatads_feed_updated", handleFeedUpdate);
      window.removeEventListener("markatads_coins_updated", handleCoinsUpdate);
    };
  }, [user?.uid]);

  const spotterLevel = calculateSpotterLevel(userCoins);

  const handleClaimDaily = () => {
    const res = claimDailyCheckin(user?.uid);
    if (res.success) {
      setUserCoins(res.newBalance);
      setCanClaimDaily(false);
    }
  };

  // Filter & Sort Logic
  const filteredPosts = posts.filter((post) => {
    // Format filter
    if (selectedFormat !== "all") {
      if (post.oohMedium !== selectedFormat) return false;
    }
    // Media type filter
    if (selectedMediaType !== "all") {
      if (post.mediaType !== selectedMediaType) return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = post.title.toLowerCase().includes(q);
      const matchCity = post.city.toLowerCase().includes(q);
      const matchArea = post.area.toLowerCase().includes(q);
      const matchMedium = post.oohMedium.toLowerCase().includes(q);
      const matchDesc = post.description.toLowerCase().includes(q);
      return matchTitle || matchCity || matchArea || matchMedium || matchDesc;
    }
    return true;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === "latest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy === "most_liked") {
      return b.likesCount - a.likesCount;
    }
    // "trending": combined weight of likes + comments
    const scoreA = a.likesCount * 2 + a.commentsCount * 3;
    const scoreB = b.likesCount * 2 + b.commentsCount * 3;
    return scoreB - scoreA;
  });

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col">
      <SiteHeader />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* Top Hero Banner */}
        <section className="rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-primary/5 p-6 sm:p-8 shadow-xs relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold">
                <Flame className="size-3.5" />
                <span>OOH Ecosystem Community & Intelligence Hub</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground font-display tracking-tight leading-tight">
                Real-World Out-Of-Home Sightings & DOOH Video Feed
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Watch verified billboard executions, 3D DOOH reels, and transit media across global
                cities. Earn <strong>OOH Coins</strong> for contributing photos, and purchase or
                rent suitable ad spaces directly from sightings.
              </p>
            </div>

            {/* User Coin Balance & Quick Actions Card */}
            <div className="shrink-0 p-4 sm:p-5 rounded-2xl bg-background/90 border border-border shadow-xs space-y-3.5 min-w-[280px]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">
                  My Spotter Wallet
                </span>
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${spotterLevel.color}`}
                >
                  {spotterLevel.badge}
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <Coins className="size-6 text-amber-500 shrink-0" />
                <span className="text-2xl sm:text-3xl font-black text-foreground font-display">
                  {userCoins.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                  OOH Coins
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <Button
                  size="sm"
                  onClick={() => setIsCreateOpen(true)}
                  className="h-8.5 text-xs font-bold gap-1.5 shadow-xs"
                >
                  <Plus className="size-3.5" />
                  <span>+ Post Sighting</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClaimDaily}
                  disabled={!canClaimDaily}
                  className={`h-8.5 text-xs font-bold gap-1.5 ${
                    canClaimDaily
                      ? "border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20"
                      : "opacity-60"
                  }`}
                >
                  <Gift className="size-3.5 text-amber-500" />
                  <span>{canClaimDaily ? "Daily +25" : "Claimed"}</span>
                </Button>
              </div>

              <div className="pt-1 text-center">
                <Link
                  to="/profile"
                  className="text-[11px] font-semibold text-primary hover:underline inline-flex items-center gap-1"
                >
                  <User className="size-3" />
                  <span>View My Profile & Redeem Vouchers →</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Filter, Search & Sorting Controls */}
        <section className="space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sightings by city (e.g. London, Mumbai), landmark, or brand..."
                className="pl-9 h-10 text-xs bg-background border-border/80"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Media Type & Sort Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Media Type Filter */}
              <div className="inline-flex rounded-lg border border-border/80 bg-background p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedMediaType("all")}
                  className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                    selectedMediaType === "all"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  All Media
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMediaType("photo")}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors flex items-center gap-1 ${
                    selectedMediaType === "photo"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Image className="size-3" />
                  <span>Photos</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMediaType("video")}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors flex items-center gap-1 ${
                    selectedMediaType === "video"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Video className="size-3" />
                  <span>Videos (Reels)</span>
                </button>
              </div>

              {/* Sort Switcher */}
              <div className="inline-flex rounded-lg border border-border/80 bg-background p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setSortBy("trending")}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                    sortBy === "trending"
                      ? "bg-muted text-foreground font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  🔥 Trending
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy("latest")}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                    sortBy === "latest"
                      ? "bg-muted text-foreground font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  🕒 Latest
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy("most_liked")}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                    sortBy === "most_liked"
                      ? "bg-muted text-foreground font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  ❤️ Top Upvoted
                </button>
              </div>
            </div>
          </div>

          {/* OOH Format Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <Filter className="size-3 text-muted-foreground" /> Format:
            </span>
            {[
              { id: "all", label: "All Formats" },
              { id: "digital_billboard", label: "DOOH Digital Billboards" },
              { id: "highway_unipole", label: "Highway Unipoles" },
              { id: "anamorphic_3d", label: "3D Anamorphic Screens" },
              { id: "transit_bus", label: "Transit Fleet & Buses" },
              { id: "metro_station", label: "Metro Stations" },
              { id: "airport_led", label: "Airport Mega Displays" },
              { id: "mall_atrium", label: "Mall Atriums" },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedFormat(cat.id)}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap text-xs font-semibold transition-all ${
                  selectedFormat === cat.id
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-background border border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </section>

        {/* Feed Posts Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <span>Community Sightings</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-semibold">
                {sortedPosts.length} posts
              </span>
            </h2>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsCreateOpen(true)}
              className="h-8 text-xs font-semibold gap-1.5"
            >
              <Plus className="size-3.5 text-primary" />
              <span>Submit Sighting (+50 Coins)</span>
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-border/70 bg-card p-6 h-96 animate-pulse space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-muted" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-muted rounded w-1/3" />
                      <div className="h-3 bg-muted rounded w-1/4" />
                    </div>
                  </div>
                  <div className="h-48 bg-muted rounded-xl" />
                </div>
              ))}
            </div>
          ) : sortedPosts.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-2xl border border-border bg-card space-y-4">
              <div className="size-14 rounded-2xl bg-primary/10 text-primary grid place-items-center mx-auto">
                <Image className="size-7" />
              </div>
              <h3 className="text-base font-bold text-foreground">No Sightings Found</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                No posts match your search or filter. Be the first to upload an OOH photo or video
                in this category and earn +50 OOH Coins!
              </p>
              <Button
                onClick={() => setIsCreateOpen(true)}
                size="sm"
                className="h-9 text-xs font-semibold gap-1.5"
              >
                <Plus className="size-3.5" />
                <span>Upload First Sighting</span>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sortedPosts.map((post) => (
                <FeedPostCard
                  key={post.id}
                  post={post}
                  onOpenComments={(p) => setActiveCommentsPost(p)}
                  onPostUpdated={(updated) => {
                    setPosts((prev) =>
                      prev.map((item) => (item.id === updated.id ? updated : item)),
                    );
                  }}
                />
              ))}
            </div>
          )}
        </section>

        {/* OOH Medium Ecosystem Insights Matrix Section */}
        <OOHInsightsMatrix />

        {/* Coin Rewards Explainer & Spotter Perks */}
        <section className="rounded-2xl border border-border/80 bg-card p-6 sm:p-7 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-amber-500" />
                <h3 className="text-base font-bold text-foreground font-display">
                  How OOH Spotter Coin Rewards Work
                </h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Turn your real-world out-of-home media intelligence into real flight credits and
                marketplace discounts.
              </p>
            </div>

            <Button asChild size="sm" variant="outline" className="h-8.5 text-xs font-bold gap-1.5">
              <Link to="/profile">
                <span>View Rewards & Redeem</span>
                <Coins className="size-3.5 text-amber-500" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-background border border-border/70 space-y-2">
              <div className="size-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 grid place-items-center font-bold">
                +50
              </div>
              <h4 className="font-bold text-foreground">Post Sighting Photo</h4>
              <p className="text-muted-foreground leading-relaxed">
                Take or upload a crisp photo of any billboard, hoarding, or transit ad in your city.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-background border border-border/70 space-y-2">
              <div className="size-8 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 grid place-items-center font-bold">
                +75
              </div>
              <h4 className="font-bold text-foreground">Post DOOH Video Reel</h4>
              <p className="text-muted-foreground leading-relaxed">
                Capture high-impact video loops of digital screens, 3D anamorphic displays, or metro
                signage.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-background border border-border/70 space-y-2">
              <div className="size-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 grid place-items-center font-bold">
                +10
              </div>
              <h4 className="font-bold text-foreground">Insightful Comment</h4>
              <p className="text-muted-foreground leading-relaxed">
                Share traffic counts, visibility scores, and advertiser recommendations in post
                comments.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-background border border-border/70 space-y-2">
              <div className="size-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 grid place-items-center font-bold">
                $$$
              </div>
              <h4 className="font-bold text-foreground">Redeem Booking Flight Credits</h4>
              <p className="text-muted-foreground leading-relaxed">
                Exchange 150 - 550 coins for $25, $50, or $100 discounts on any Mark@Ads campaign
                flight.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Modals */}
      <CreatePostModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onPostCreated={(newPost) => {
          setPosts((prev) => [newPost, ...prev]);
          setUserCoins(getLocalCoins(user?.uid));
        }}
      />

      <CommentsModal
        post={activeCommentsPost}
        isOpen={!!activeCommentsPost}
        onClose={() => setActiveCommentsPost(null)}
        onCommentAdded={() => {
          setPosts(getLocalFeedPosts());
          setUserCoins(getLocalCoins(user?.uid));
        }}
      />
    </div>
  );
}
