import React, { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Coins,
  Sparkles,
  Award,
  ShieldCheck,
  MapPin,
  Building,
  Image,
  Video,
  Heart,
  Plus,
  Copy,
  Check,
  CheckCircle2,
  Gift,
  ExternalLink,
  Edit3,
  User,
  ShoppingBag,
  Eye,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getLocalFeedPosts, type FeedPost } from "@/lib/feedService";
import {
  getLocalCoins,
  getLocalTransactions,
  claimDailyCheckin,
  canClaimDailyCheckin,
  calculateSpotterLevel,
  AVAILABLE_PERKS,
  redeemPerk,
  getRedeemedPerks,
  type CoinPerk,
} from "@/lib/coinService";
import { CreatePostModal } from "@/components/feed/CreatePostModal";
import { CommentsModal } from "@/components/feed/CommentsModal";
import { FeedPostCard } from "@/components/feed/FeedPostCard";
import { useEcom } from "@/context/EcomContext";
import { MOCK_CATALOG } from "@/data/mockCatalog";
import { toast } from "sonner";
import { db, auth } from "@/integrations/firebase/client";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface ProfileSearch {
  id?: string;
  u?: string;
}

export const Route = createFileRoute("/profile")({
  validateSearch: (search: Record<string, unknown>): ProfileSearch => {
    return {
      id: typeof search.id === "string" ? search.id : undefined,
      u: typeof search.u === "string" ? search.u : undefined,
    };
  },
  component: ProfilePage,
});

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80",
];

function ProfilePage() {
  const { id: searchId, u: searchUsername } = Route.useSearch();
  const {
    user,
    username: currentUsername,
    displayName: currentDisplayName,
    company: currentCompany,
    role,
  } = useAuth();
  const { wishlist, setSelectedListingForDetail, formatMoney } = useEcom();
  const navigate = useNavigate();

  const isOwnProfile =
    (!searchId && !searchUsername) ||
    (user?.uid && searchId === user.uid) ||
    (searchUsername && searchUsername === currentUsername);

  // Profile data
  const [profileName, setProfileName] = useState(
    () => currentDisplayName || currentUsername || "Mark@Ads Spotter",
  );
  const [profileUsername, setProfileUsername] = useState(() => currentUsername || "spotter");
  const [profileBio, setProfileBio] = useState(
    "Passionate Out-Of-Home & DOOH spotter. Tracking prime highway hoardings, 3D anamorphic displays, and transit media innovations.",
  );
  const [profileCompany, setProfileCompany] = useState(
    () => currentCompany || "Horizon Media Scout Group",
  );
  const [profileCity, setProfileCity] = useState("New York & London");
  const [profileAvatar, setProfileAvatar] = useState(PRESET_AVATARS[0]);
  const [profileRole, setProfileRole] = useState(role || "spotter");

  // Coins & Transactions
  const [userCoins, setUserCoins] = useState(() => getLocalCoins(user?.uid));
  const [transactions, setTransactions] = useState(() => getLocalTransactions(user?.uid));
  const [redeemedPerks, setRedeemedPerks] = useState<string[]>(() => getRedeemedPerks(user?.uid));
  const [canClaimDaily, setCanClaimDaily] = useState(() => canClaimDailyCheckin(user?.uid));

  // Posts
  const [userPosts, setUserPosts] = useState<FeedPost[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeCommentsPost, setActiveCommentsPost] = useState<FeedPost | null>(null);

  // Copied code feedback
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Sync profile data and posts
  useEffect(() => {
    const allPosts = getLocalFeedPosts();

    if (!isOwnProfile) {
      // Viewing someone else's profile
      const targetPost = allPosts.find(
        (p) =>
          (searchId && p.authorId === searchId) ||
          (searchUsername && p.authorUsername === searchUsername),
      );

      if (targetPost) {
        setProfileName(targetPost.authorName);
        setProfileUsername(targetPost.authorUsername);
        setProfileAvatar(targetPost.authorAvatar);
        setProfileRole(targetPost.authorRole);
        setProfileCity(targetPost.city);
        setProfileBio(
          `Verified ${targetPost.authorRole} and media scout tracking high-impact billboard sightings.`,
        );
      }

      // Filter their posts
      const matched = allPosts.filter(
        (p) =>
          (searchId && p.authorId === searchId) ||
          (searchUsername && p.authorUsername === searchUsername),
      );
      setUserPosts(matched);
    } else {
      // Own profile
      setUserCoins(getLocalCoins(user?.uid));
      setTransactions(getLocalTransactions(user?.uid));
      setRedeemedPerks(getRedeemedPerks(user?.uid));
      setCanClaimDaily(canClaimDailyCheckin(user?.uid));

      // Filter own posts
      const own = allPosts.filter(
        (p) =>
          p.authorId === user?.uid ||
          p.authorUsername === currentUsername ||
          p.authorId === "spotter-current",
      );
      // If user has not posted yet, include sample author posts or own
      setUserPosts(own.length > 0 ? own : allPosts.slice(0, 2));
    }
  }, [searchId, searchUsername, isOwnProfile, user?.uid, currentUsername]);

  const spotterLevel = calculateSpotterLevel(userCoins);

  const handleClaimDaily = () => {
    const res = claimDailyCheckin(user?.uid);
    if (res.success) {
      setUserCoins(res.newBalance);
      setCanClaimDaily(false);
      setTransactions(getLocalTransactions(user?.uid));
    }
  };

  const handleRedeem = (perk: CoinPerk) => {
    const res = redeemPerk(perk, user?.uid);
    if (res.success) {
      setUserCoins(getLocalCoins(user?.uid));
      setRedeemedPerks(getRedeemedPerks(user?.uid));
      setTransactions(getLocalTransactions(user?.uid));
    } else {
      toast.error(res.message);
    }
  };

  const handleCopyCode = (code: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(code);
      setCopiedCode(code);
      toast.success(`Copied promo code ${code}! Use in cart or checkout.`);
      setTimeout(() => setCopiedCode(null), 2500);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      const payload = {
        displayName: profileName,
        username: profileUsername,
        company: profileCompany,
        city: profileCity,
        bio: profileBio,
        avatar: profileAvatar,
        role: profileRole,
      };
      localStorage.setItem("markatads_custom_profile", JSON.stringify(payload));

      if (auth.currentUser) {
        try {
          await setDoc(
            doc(db, "profiles", auth.currentUser.uid),
            {
              id: auth.currentUser.uid,
              displayName: profileName,
              username: profileUsername,
              company: profileCompany,
              role: profileRole,
              updatedAt: new Date().toISOString(),
            },
            { merge: true },
          );
        } catch (err) {
          console.debug("Firestore profile sync fallback note:", err);
        }
      }

      toast.success("Profile updated successfully!");
    }
  };

  // Wishlisted media items
  const wishlistedItems = MOCK_CATALOG.filter((item) => wishlist.includes(item.id));

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col">
      <SiteHeader />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* Profile Card Header */}
        <section className="rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-primary/5 p-6 sm:p-8 shadow-xs relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            {/* Avatar & Main Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6">
              <div className="relative">
                <Avatar className="size-24 sm:size-28 border-4 border-background shadow-md">
                  <AvatarImage src={profileAvatar} alt={profileName} />
                  <AvatarFallback className="text-xl font-bold font-display">
                    {profileName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div
                  className="absolute -bottom-1 -right-1 size-7 rounded-full bg-emerald-500 text-white grid place-items-center shadow-xs"
                  title="Verified OOH Spotter"
                >
                  <ShieldCheck className="size-4" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-foreground font-display">
                    {profileName}
                  </h1>
                  <span className="text-xs text-muted-foreground font-medium">
                    @{profileUsername}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 capitalize">
                    {profileRole}
                  </span>
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${spotterLevel.color}`}
                  >
                    {spotterLevel.badge}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
                  {profileBio}
                </p>

                <div className="flex items-center gap-4 text-xs text-muted-foreground justify-center sm:justify-start flex-wrap pt-1">
                  <span className="flex items-center gap-1">
                    <Building className="size-3.5 text-primary" />
                    <span>{profileCompany}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3.5 text-primary" />
                    <span>{profileCity}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="size-3.5" />
                    <span>Verified Spotter Flight Access</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Wallet & Rank Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-background/90 border border-border/80 shadow-xs space-y-3 min-w-[260px] shrink-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Spotter Rank</span>
                <span className="text-xs font-bold text-foreground">{spotterLevel.levelName}</span>
              </div>

              <div className="flex items-baseline gap-2">
                <Coins className="size-6 text-amber-500 shrink-0" />
                <span className="text-2xl sm:text-3xl font-black text-foreground font-display">
                  {userCoins.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">Coins</span>
              </div>

              {/* Tier Progress */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-muted-foreground font-medium">
                  <span>Tier Progress</span>
                  <span>{spotterLevel.progressPercent}% to next rank</span>
                </div>
                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all"
                    style={{ width: `${spotterLevel.progressPercent}%` }}
                  />
                </div>
              </div>

              {isOwnProfile && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Button
                    size="sm"
                    onClick={() => setIsCreateOpen(true)}
                    className="h-8 text-xs font-bold gap-1"
                  >
                    <Plus className="size-3" />
                    <span>Post (+50)</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClaimDaily}
                    disabled={!canClaimDaily}
                    className={`h-8 text-xs font-bold gap-1 ${
                      canClaimDaily
                        ? "border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20"
                        : "opacity-60"
                    }`}
                  >
                    <Gift className="size-3 text-amber-500" />
                    <span>{canClaimDaily ? "Daily +25" : "Claimed"}</span>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-border/60">
            <div className="p-3 rounded-xl bg-background/80 border border-border/60 text-center">
              <span className="text-xs text-muted-foreground block">OOH Sightings</span>
              <strong className="text-lg font-bold text-foreground font-display">
                {userPosts.length}
              </strong>
            </div>

            <div className="p-3 rounded-xl bg-background/80 border border-border/60 text-center">
              <span className="text-xs text-muted-foreground block">Total Upvotes</span>
              <strong className="text-lg font-bold text-rose-500 font-display">
                {userPosts.reduce((acc, p) => acc + p.likesCount, 0)}
              </strong>
            </div>

            <div className="p-3 rounded-xl bg-background/80 border border-border/60 text-center">
              <span className="text-xs text-muted-foreground block">Est. Reach Tracked</span>
              <strong className="text-lg font-bold text-primary font-display">1.4M+</strong>
            </div>

            <div className="p-3 rounded-xl bg-background/80 border border-border/60 text-center">
              <span className="text-xs text-muted-foreground block">Flight Credits Unlocked</span>
              <strong className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-display">
                {redeemedPerks.length} Perks
              </strong>
            </div>
          </div>
        </section>

        {/* Profile Tabs */}
        <Tabs defaultValue="sightings" className="space-y-6">
          <TabsList className="h-10 bg-background border border-border/80 p-1">
            <TabsTrigger value="sightings" className="text-xs font-semibold gap-1.5 h-8">
              <Image className="size-3.5" />
              <span>Sightings Portfolio ({userPosts.length})</span>
            </TabsTrigger>
            <TabsTrigger value="wallet" className="text-xs font-semibold gap-1.5 h-8">
              <Coins className="size-3.5" />
              <span>Coin Wallet & Perks ({userCoins})</span>
            </TabsTrigger>
            <TabsTrigger value="saved" className="text-xs font-semibold gap-1.5 h-8">
              <ShoppingBag className="size-3.5" />
              <span>Saved Media ({wishlist.length})</span>
            </TabsTrigger>
            {isOwnProfile && (
              <TabsTrigger value="settings" className="text-xs font-semibold gap-1.5 h-8">
                <Edit3 className="size-3.5" />
                <span>Edit Profile</span>
              </TabsTrigger>
            )}
          </TabsList>

          {/* TAB 1: SIGHTINGS PORTFOLIO */}
          <TabsContent value="sightings" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground font-display">
                  Out-Of-Home Sightings by {profileName}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Verified photo and video contributions to the global OOH ecosystem.
                </p>
              </div>

              {isOwnProfile && (
                <Button
                  size="sm"
                  onClick={() => setIsCreateOpen(true)}
                  className="h-8 text-xs font-semibold gap-1.5"
                >
                  <Plus className="size-3.5" />
                  <span>Post New Sighting (+50 Coins)</span>
                </Button>
              )}
            </div>

            {userPosts.length === 0 ? (
              <div className="text-center py-16 px-4 rounded-2xl border border-border bg-card space-y-4">
                <div className="size-14 rounded-2xl bg-primary/10 text-primary grid place-items-center mx-auto">
                  <Image className="size-7" />
                </div>
                <h4 className="text-base font-bold text-foreground">No Sightings Posted Yet</h4>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Upload photos and videos of billboards, screens, and transit ads you spot in the
                  city to earn +50 to +75 OOH Coins per post!
                </p>
                {isOwnProfile && (
                  <Button
                    onClick={() => setIsCreateOpen(true)}
                    size="sm"
                    className="h-9 text-xs font-semibold gap-1.5"
                  >
                    <Plus className="size-3.5" />
                    <span>Upload First Sighting</span>
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userPosts.map((post) => (
                  <FeedPostCard
                    key={post.id}
                    post={post}
                    onOpenComments={(p) => setActiveCommentsPost(p)}
                    onPostUpdated={(updated) => {
                      setUserPosts((prev) =>
                        prev.map((item) => (item.id === updated.id ? updated : item)),
                      );
                    }}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* TAB 2: COIN WALLET & PERKS */}
          <TabsContent value="wallet" className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground font-display flex items-center gap-2">
                <span>OOH Coin Wallet & Perks Store</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/20">
                  {userCoins} Available
                </span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Redeem your earned coins for campaign flight discounts, drone proof-of-play audits,
                or VIP scout status.
              </p>
            </div>

            {/* Perks Store Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {AVAILABLE_PERKS.map((perk) => {
                const isRedeemed = redeemedPerks.includes(perk.id);
                const canAfford = userCoins >= perk.cost;

                return (
                  <div
                    key={perk.id}
                    className="p-5 rounded-2xl border border-border/80 bg-card flex flex-col justify-between gap-4 shadow-xs"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-primary px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                          {perk.badge}
                        </span>
                        <div className="flex items-center gap-1 font-bold text-amber-500 text-sm">
                          <Coins className="size-4" />
                          <span>{perk.cost} Coins</span>
                        </div>
                      </div>

                      <h4 className="text-sm font-bold text-foreground font-display">
                        {perk.name}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {perk.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-border/60">
                      {isRedeemed ? (
                        <div className="flex items-center justify-between gap-2 bg-muted/60 p-2 rounded-lg">
                          <span className="text-xs font-mono font-bold text-foreground">
                            {perk.code}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleCopyCode(perk.code)}
                            className="h-7 text-[11px] font-semibold gap-1 px-2"
                          >
                            {copiedCode === perk.code ? (
                              <Check className="size-3 text-emerald-500" />
                            ) : (
                              <Copy className="size-3" />
                            )}
                            <span>{copiedCode === perk.code ? "Copied" : "Copy"}</span>
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleRedeem(perk)}
                          disabled={!canAfford}
                          className="w-full h-8.5 text-xs font-bold gap-1.5 shadow-xs"
                        >
                          <Coins className="size-3.5 text-amber-500" />
                          <span>
                            {canAfford ? `Redeem (${perk.cost} Coins)` : "Need More Coins"}
                          </span>
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Transaction Ledger */}
            <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4">
              <h4 className="text-sm font-bold text-foreground font-display">
                Coin Activity History
              </h4>
              <div className="divide-y divide-border/60">
                {transactions.map((tx) => (
                  <div key={tx.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div className="space-y-0.5">
                      <p className="font-semibold text-foreground">{tx.description}</p>
                      <span className="text-[11px] text-muted-foreground">
                        {new Date(tx.createdAt).toLocaleDateString()} at{" "}
                        {new Date(tx.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <span
                      className={`font-bold font-display text-sm shrink-0 ${
                        tx.amount > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500"
                      }`}
                    >
                      {tx.amount > 0 ? `+${tx.amount}` : tx.amount} Coins
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* TAB 3: SAVED MEDIA */}
          <TabsContent value="saved" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground font-display">
                  Watchlist & Saved Ad Spaces
                </h3>
                <p className="text-xs text-muted-foreground">
                  Prime media locations bookmarked for upcoming campaign flights.
                </p>
              </div>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="h-8 text-xs font-semibold gap-1.5"
              >
                <Link to="/browse">
                  <span>Browse More Media</span>
                  <ExternalLink className="size-3.5" />
                </Link>
              </Button>
            </div>

            {wishlistedItems.length === 0 ? (
              <div className="text-center py-16 px-4 rounded-2xl border border-border bg-card space-y-4">
                <div className="size-14 rounded-2xl bg-primary/10 text-primary grid place-items-center mx-auto">
                  <ShoppingBag className="size-7" />
                </div>
                <h4 className="text-base font-bold text-foreground">No Saved Spaces</h4>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Click the heart icon on any billboard or DOOH listing to save it to your spotter
                  watchlist.
                </p>
                <Button asChild size="sm" className="h-9 text-xs font-semibold">
                  <Link to="/browse">Explore Marketplace</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {wishlistedItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl border border-border bg-card space-y-3 shadow-xs hover:border-primary/50 transition-colors"
                  >
                    <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase text-primary">
                        {item.medium} • {item.city}
                      </span>
                      <h4 className="text-sm font-bold text-foreground truncate">{item.title}</h4>
                      <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        {formatMoney(item.price_per_month, item.currency)} / mo
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => setSelectedListingForDetail(item)}
                      className="w-full h-8 text-xs font-semibold"
                    >
                      Inspect & Book Flight
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* TAB 4: EDIT PROFILE */}
          {isOwnProfile && (
            <TabsContent value="settings" className="space-y-6">
              <form
                onSubmit={handleSaveProfile}
                className="max-w-2xl rounded-2xl border border-border/80 bg-card p-6 space-y-5"
              >
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-foreground font-display">
                    Edit Profile Details
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Customize how you appear in the OOH Community Feed and comments.
                  </p>
                </div>

                {/* Avatar Picker */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground block">
                    Choose Spotter Avatar
                  </label>
                  <div className="flex items-center gap-3 overflow-x-auto pb-1">
                    {PRESET_AVATARS.map((avUrl) => (
                      <button
                        key={avUrl}
                        type="button"
                        onClick={() => setProfileAvatar(avUrl)}
                        className={`size-12 rounded-full overflow-hidden border-2 transition-transform ${
                          profileAvatar === avUrl
                            ? "border-primary scale-110 shadow-xs"
                            : "border-border/60 hover:scale-105"
                        }`}
                      >
                        <img src={avUrl} alt="Avatar" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Display Name *</label>
                    <Input
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="h-9 text-xs"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium">Username Handle *</label>
                    <Input
                      value={profileUsername}
                      onChange={(e) => setProfileUsername(e.target.value)}
                      className="h-9 text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Organization / Agency</label>
                    <Input
                      value={profileCompany}
                      onChange={(e) => setProfileCompany(e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium">Primary Markets / Cities</label>
                    <Input
                      value={profileCity}
                      onChange={(e) => setProfileCity(e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium">Spotter Bio</label>
                  <Textarea
                    value={profileBio}
                    onChange={(e) => setProfileBio(e.target.value)}
                    rows={3}
                    className="text-xs resize-none"
                  />
                </div>

                <div className="pt-2">
                  <Button type="submit" className="h-9 text-xs font-semibold px-6">
                    Save Profile Changes
                  </Button>
                </div>
              </form>
            </TabsContent>
          )}
        </Tabs>
      </main>

      {/* Modals */}
      <CreatePostModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onPostCreated={(newPost) => {
          setUserPosts((prev) => [newPost, ...prev]);
          setUserCoins(getLocalCoins(user?.uid));
        }}
      />

      <CommentsModal
        post={activeCommentsPost}
        isOpen={!!activeCommentsPost}
        onClose={() => setActiveCommentsPost(null)}
        onCommentAdded={() => {
          setUserPosts(
            getLocalFeedPosts().filter(
              (p) => p.authorId === user?.uid || p.authorUsername === currentUsername,
            ),
          );
          setUserCoins(getLocalCoins(user?.uid));
        }}
      />
    </div>
  );
}
