import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Heart,
  MessageSquare,
  Sparkles,
  MapPin,
  Eye,
  Clock,
  TrendingUp,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Share2,
  ShieldCheck,
  ShoppingBag,
  ExternalLink,
  Coins,
} from "lucide-react";
import { type FeedPost, toggleLikePost, claimPostSpotterBounty } from "@/lib/feedService";
import { useAuth } from "@/hooks/useAuth";
import { useEcom } from "@/context/EcomContext";
import { MOCK_CATALOG, type ExtendedListing } from "@/data/mockCatalog";
import { formatDistanceToNow } from "date-fns";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";

interface FeedPostCardProps {
  post: FeedPost;
  onOpenComments: (post: FeedPost) => void;
  onPostUpdated?: (updated: FeedPost) => void;
}

export const FeedPostCard: React.FC<FeedPostCardProps> = ({
  post,
  onOpenComments,
  onPostUpdated,
}) => {
  const { user } = useAuth();
  const { setSelectedListingForDetail, formatMoney } = useEcom();

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [hasLiked, setHasLiked] = useState(user?.uid ? post.likedBy.includes(user.uid) : false);
  const [bountyClaimed, setBountyClaimed] = useState(false);

  const videoRef = React.useRef<HTMLVideoElement>(null);

  // Check if there is a linked listing or matching listing in catalog
  const linkedListing: ExtendedListing | undefined = post.linkedListingId
    ? MOCK_CATALOG.find((l) => l.id === post.linkedListingId)
    : undefined;

  const toggleVideoPlayback = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleLike = async () => {
    const userId = user?.uid || "guest_viewer";
    const res = await toggleLikePost(post.id, userId);
    setHasLiked(res.liked);
    setLikesCount(res.newCount);
    if (onPostUpdated) {
      onPostUpdated({
        ...post,
        likesCount: res.newCount,
        likedBy: res.liked ? [...post.likedBy, userId] : post.likedBy.filter((id) => id !== userId),
      });
    }
  };

  const handleBountyClaim = () => {
    const userId = user?.uid || "guest_viewer";
    const res = claimPostSpotterBounty(post.id, userId);
    if (res.success) {
      setBountyClaimed(true);
    }
  };

  const handleBookListing = () => {
    if (linkedListing) {
      setSelectedListingForDetail(linkedListing);
    } else {
      toast.info("Listing details opened from catalog.");
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      toast.success("Sighting link copied to clipboard!");
    }
  };

  return (
    <article className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs hover:shadow-md transition-shadow">
      {/* Post Author Header */}
      <header className="p-4 sm:p-5 flex items-center justify-between gap-3 border-b border-border/60 bg-muted/20">
        <div className="flex items-center gap-3">
          <Link
            to="/profile"
            search={{ id: post.authorId, u: post.authorUsername }}
            className="group shrink-0"
          >
            <Avatar className="size-11 border-2 border-primary/20 group-hover:border-primary transition-colors">
              <AvatarImage src={post.authorAvatar} alt={post.authorName} />
              <AvatarFallback className="font-semibold text-xs">
                {post.authorName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                to="/profile"
                search={{ id: post.authorId, u: post.authorUsername }}
                className="text-sm font-bold text-foreground hover:text-primary transition-colors truncate"
              >
                {post.authorName}
              </Link>
              {post.authorBadge && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                  {post.authorBadge}
                </span>
              )}
              {post.verifiedSpotter && (
                <span className="inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 text-[11px] font-medium">
                  <ShieldCheck className="size-3.5" />
                  <span className="hidden sm:inline">Verified Scout</span>
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
              <span>@{post.authorUsername}</span>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
            </div>
          </div>
        </div>

        {/* Location & Format Pill */}
        <div className="text-right shrink-0">
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-foreground px-2.5 py-1 rounded-full bg-muted border border-border/80">
            <MapPin className="size-3 text-primary" />
            <span className="truncate max-w-[140px] sm:max-w-[200px]">{post.city}</span>
          </span>
        </div>
      </header>

      {/* Post Title & Description */}
      <div className="p-4 sm:p-5 pb-3 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base sm:text-lg font-bold text-foreground font-display leading-snug">
            {post.title}
          </h3>
          <span className="shrink-0 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary capitalize border border-primary/20">
            {post.oohMedium.replace(/_/g, " ")}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {post.description}
        </p>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-0.5">
          <MapPin className="size-3.5 text-muted-foreground shrink-0" />
          <span>
            {post.area} {post.landmark ? `(${post.landmark})` : ""} • {post.country}
          </span>
        </div>
      </div>

      {/* Visual Media (Photo / Video Player) */}
      <div className="relative bg-black/90 aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden select-none">
        {post.mediaType === "video" ? (
          <div
            className="relative w-full h-full cursor-pointer group"
            onClick={toggleVideoPlayback}
          >
            <video
              ref={videoRef}
              src={post.mediaUrl}
              poster={post.thumbnailUrl}
              loop
              autoPlay
              muted={isMuted}
              playsInline
              className="w-full h-full object-cover"
            />
            {/* Play/Pause Center Indicator */}
            {!isPlaying && (
              <div className="absolute inset-0 bg-black/40 grid place-items-center">
                <div className="size-14 rounded-full bg-background/90 text-foreground grid place-items-center shadow-lg">
                  <Play className="size-7 ml-1" />
                </div>
              </div>
            )}
            {/* Video Controls Overlay */}
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <button
                type="button"
                onClick={toggleMute}
                className="size-8 rounded-full bg-black/60 hover:bg-black/80 text-white grid place-items-center backdrop-blur-xs transition-colors"
                aria-label={isMuted ? "Unmute video" : "Mute video"}
              >
                {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
              </button>
            </div>
            {/* Format Tag Overlay */}
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-xs text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
              <span>▶ Live DOOH Reel</span>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full">
            <img
              src={post.mediaUrl}
              alt={post.title}
              className="w-full h-full object-cover hover:scale-[1.01] transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-xs text-white text-[11px] font-bold uppercase tracking-wider">
              <span>📷 Sighting Photo</span>
            </div>
          </div>
        )}
      </div>

      {/* OOH Medium Insights Box */}
      <div className="p-4 sm:p-5 bg-muted/30 border-y border-border/70 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <TrendingUp className="size-3.5 text-primary" />
            <span>Out-Of-Home Placement Intelligence</span>
          </span>
          <span className="text-xs font-semibold text-foreground">
            Visibility:{" "}
            <strong className="text-primary font-bold">
              {post.insights.visibilityRating} / 10
            </strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="p-2.5 rounded-xl bg-background border border-border/60">
            <span className="text-[10px] text-muted-foreground block flex items-center gap-1 mb-0.5">
              <Eye className="size-3 text-primary" /> Daily Traffic
            </span>
            <p className="font-bold text-foreground truncate">{post.insights.dailyTraffic}</p>
          </div>

          <div className="p-2.5 rounded-xl bg-background border border-border/60">
            <span className="text-[10px] text-muted-foreground block flex items-center gap-1 mb-0.5">
              <Clock className="size-3 text-primary" /> Avg Dwell Time
            </span>
            <p className="font-bold text-foreground">
              {post.insights.dwellTimeSeconds}s commuter stop
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-background border border-border/60 col-span-2 sm:col-span-1">
            <span className="text-[10px] text-muted-foreground block mb-0.5">
              Est. Benchmark CPM
            </span>
            <p className="font-bold text-emerald-600 dark:text-emerald-400">
              {post.insights.recommendedCpm}
            </p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground bg-background/80 p-2.5 rounded-lg border border-border/50 italic">
          "{post.insights.keyAdvantage}"
        </p>
      </div>

      {/* Direct Out-Of-Home Purchase Link Section */}
      {linkedListing ? (
        <div className="p-4 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-primary flex items-center gap-1 uppercase tracking-wider">
              <ShoppingBag className="size-3.5" />
              <span>Available Marketplace Medium</span>
            </span>
            <h4 className="text-xs sm:text-sm font-bold text-foreground">{linkedListing.title}</h4>
            <p className="text-xs text-muted-foreground">
              Starting from{" "}
              <strong className="text-foreground font-semibold">
                {formatMoney(linkedListing.price_per_month, linkedListing.currency)}
              </strong>{" "}
              / month • Escrow Protected
            </p>
          </div>

          <Button
            size="sm"
            onClick={handleBookListing}
            className="h-8.5 text-xs font-bold gap-1.5 shadow-xs shrink-0"
          >
            <span>Book & Inspect Medium</span>
            <ExternalLink className="size-3.5" />
          </Button>
        </div>
      ) : (
        <div className="px-4 py-2.5 bg-muted/40 border-b border-border/60 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            Looking for similar billboards in <strong>{post.city}</strong>?
          </span>
          <Button
            asChild
            variant="link"
            size="sm"
            className="h-auto p-0 text-xs font-semibold text-primary"
          >
            <Link to="/browse" search={{ search: post.city }}>
              Browse {post.city} Listings →
            </Link>
          </Button>
        </div>
      )}

      {/* Engagement & Coin Reward Actions Footer */}
      <footer className="p-3 sm:p-4 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Like / Upvote Button */}
          <Button
            variant={hasLiked ? "default" : "outline"}
            size="sm"
            onClick={handleLike}
            className={`h-8.5 text-xs gap-1.5 px-3 ${
              hasLiked ? "bg-rose-500 hover:bg-rose-600 text-white" : ""
            }`}
          >
            <Heart className={`size-3.5 ${hasLiked ? "fill-current" : ""}`} />
            <span>{likesCount}</span>
            <span className="hidden sm:inline">Upvotes</span>
          </Button>

          {/* Comments Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenComments(post)}
            className="h-8.5 text-xs gap-1.5 px-3"
          >
            <MessageSquare className="size-3.5 text-muted-foreground" />
            <span>{post.commentsCount}</span>
            <span className="hidden sm:inline">Comments</span>
          </Button>

          {/* Share */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleShare}
            className="h-8.5 w-8.5 text-muted-foreground hover:text-foreground"
            title="Share Sighting"
          >
            <Share2 className="size-3.5" />
          </Button>
        </div>

        {/* Spotter Bounty Collect Option */}
        <div className="flex items-center gap-2 ml-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBountyClaim}
            disabled={bountyClaimed}
            className={`h-8.5 text-xs gap-1.5 px-3 border-amber-500/30 font-semibold ${
              bountyClaimed
                ? "bg-muted text-muted-foreground border-border"
                : "bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20"
            }`}
          >
            <Coins className="size-3.5 text-amber-500" />
            <span>{bountyClaimed ? "Bounty Collected" : "Collect +20 Bounty"}</span>
          </Button>
        </div>
      </footer>
    </article>
  );
};
