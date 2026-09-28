import { db, auth, handleFirestoreError, OperationType } from "@/integrations/firebase/client";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { addCoinTransaction } from "./coinService";
import { toast } from "sonner";

export type OOHMediumCategory =
  | "digital_billboard"
  | "highway_unipole"
  | "transit_bus"
  | "airport_led"
  | "mall_atrium"
  | "street_furniture"
  | "anamorphic_3d"
  | "metro_station";

export interface OOHInsights {
  dailyTraffic: string; // e.g. "420,000 daily vehicles"
  dwellTimeSeconds: number; // e.g. 45
  visibilityRating: number; // e.g. 9.6 / 10
  daypartingPeak: string; // e.g. "Morning Rush (8-11am) & Evening Commute (6-10pm)"
  bestIndustries: string[]; // e.g. ["EV Automotive", "Fintech", "Luxury Fragrance"]
  keyAdvantage: string; // e.g. "Unobstructed arterial highway visibility with slow traffic dwell"
  recommendedCpm: string; // e.g. "$4.50 - $6.20"
}

export interface FeedPost {
  id: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  authorRole: "advertiser" | "seller" | "agency" | "spotter" | "admin";
  authorBadge?: string;
  title: string;
  description: string;
  mediaType: "photo" | "video";
  mediaUrl: string;
  thumbnailUrl?: string;
  oohMedium: OOHMediumCategory;
  city: string;
  country: string;
  area: string;
  landmark?: string;
  insights: OOHInsights;
  linkedListingId?: string; // Links to marketplace listing for direct purchase!
  linkedListingTitle?: string;
  linkedListingPrice?: number;
  linkedListingCurrency?: string;
  coinsRewarded: number;
  likesCount: number;
  likedBy: string[]; // user IDs or IPs
  commentsCount: number;
  tags: string[];
  verifiedSpotter: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface FeedComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  authorBadge?: string;
  text: string;
  likesCount: number;
  likedBy: string[];
  createdAt: string;
}

// Initial Rich Seed Posts for instant community vibrancy and out-of-home insights
export const INITIAL_FEED_POSTS: FeedPost[] = [
  {
    id: "post-times-square-3d",
    authorId: "user-spotter-marcus",
    authorName: "Marcus Sterling",
    authorUsername: "marcus_ooh",
    authorAvatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    authorRole: "spotter",
    authorBadge: "🥇 Gold Scout",
    title: "Anamorphic 3D DOOH Spectacular - Times Square Corner",
    description:
      "Insane naked-eye 3D creative execution spotted at Broadway & 45th! The depth illusion causes pedestrians to halt and film with their phones. Over 80% viral social pass-along rate observed.",
    mediaType: "video",
    mediaUrl:
      "https://assets.mixkit.co/videos/preview/mixkit-busy-crosswalk-in-times-square-at-night-4223-large.mp4",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=1000&auto=format&fit=crop&q=80",
    oohMedium: "anamorphic_3d",
    city: "New York",
    country: "United States",
    area: "Times Square Broadway",
    landmark: "Broadway & 45th St Crossing",
    insights: {
      dailyTraffic: "520,000+ pedestrian & vehicular impressions",
      dwellTimeSeconds: 65,
      visibilityRating: 9.8,
      daypartingPeak: "Evening Spectacular (7:00 PM - 1:00 AM)",
      bestIndustries: ["Entertainment / Movie Releases", "Consumer Tech", "Global Fashion"],
      keyAdvantage:
        "Extreme viral pull; 1 in 3 pedestrians record video clips for TikTok/Instagram.",
      recommendedCpm: "$12.00 - $18.50",
    },
    linkedListingId: "times-square-screen",
    linkedListingTitle: "Times Square Broadway LED Spectacular",
    linkedListingPrice: 48000,
    linkedListingCurrency: "USD",
    coinsRewarded: 75,
    likesCount: 142,
    likedBy: ["demo-user-1"],
    commentsCount: 18,
    tags: ["3DAnamorphic", "TimesSquare", "DOOH", "NightIllumination", "ViralCampaign"],
    verifiedSpotter: true,
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: "post-mumbai-we-highway",
    authorId: "user-spotter-priya",
    authorName: "Priya Sharma",
    authorUsername: "priya_ooh_scout",
    authorAvatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
    authorRole: "agency",
    authorBadge: "⭐ Top Scout",
    title: "Massive Arterial Highway Unipole - Western Express Highway",
    description:
      "Crucial spot right before the Bandra Kurla Complex (BKC) flyover. Unavoidable during morning corporate rush hours when traffic naturally slows to 15km/h, maximizing billboard exposure time.",
    mediaType: "photo",
    mediaUrl:
      "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&auto=format&fit=crop&q=80",
    oohMedium: "highway_unipole",
    city: "Mumbai",
    country: "India",
    area: "Western Express Highway, Bandra East",
    landmark: "Near BKC Flyover Junction",
    insights: {
      dailyTraffic: "380,000+ corporate vehicles & cabs",
      dwellTimeSeconds: 90,
      visibilityRating: 9.5,
      daypartingPeak: "Morning Peak (8:30 AM - 11:30 AM) & Evening (6:30 PM - 10:00 PM)",
      bestIndustries: ["Fintech & Banking", "Automotive Luxury", "Commercial Real Estate"],
      keyAdvantage:
        "Head-on driver eye-level alignment with zero tree obstruction and 24/7 backlit flex.",
      recommendedCpm: "₹38.50 (~$0.46)",
    },
    linkedListingId: "bandra-we-hoarding",
    linkedListingTitle: "Bandra Western Express Hoarding (40ft x 20ft)",
    linkedListingPrice: 450000,
    linkedListingCurrency: "INR",
    coinsRewarded: 50,
    likesCount: 98,
    likedBy: [],
    commentsCount: 12,
    tags: ["HighwayBillboard", "MumbaiOOH", "BKCExpress", "Unipole", "HighTraffic"],
    verifiedSpotter: true,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: "post-dubai-mall-atrium",
    authorId: "user-spotter-tariq",
    authorName: "Tariq Al-Mansoor",
    authorUsername: "tariq_dubaimedia",
    authorAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    authorRole: "seller",
    authorBadge: "🏢 Media Owner",
    title: "Grand Atrium Luxury Curved LED - The Dubai Mall",
    description:
      "Walked past this curved screen outside Bloomingdale's and Galeries Lafayette. Reaches ultra-high-net-worth international shoppers. Pristine contrast even under bright skylight illumination.",
    mediaType: "photo",
    mediaUrl:
      "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=1200&auto=format&fit=crop&q=80",
    oohMedium: "mall_atrium",
    city: "Dubai",
    country: "United Arab Emirates",
    area: "Downtown Dubai",
    landmark: "The Dubai Mall - Level 1 Fashion Avenue",
    insights: {
      dailyTraffic: "210,000 affluent tourists & luxury buyers",
      dwellTimeSeconds: 120,
      visibilityRating: 9.7,
      daypartingPeak: "Afternoon & Weekend Late Nights (4:00 PM - Midnight)",
      bestIndustries: [
        "Haute Horlogerie / Watches",
        "Fine Jewelry",
        "Luxury Hospitality & Airlines",
      ],
      keyAdvantage:
        "Direct proximity to point of sale; shoppers can walk 50 meters and buy the advertised luxury item.",
      recommendedCpm: "AED 35.00 (~$9.50)",
    },
    linkedListingId: "dubai-mall-atrium",
    linkedListingTitle: "Dubai Mall Atrium LED Screen (8m x 4m)",
    linkedListingPrice: 32000,
    linkedListingCurrency: "AED",
    coinsRewarded: 50,
    likesCount: 114,
    likedBy: [],
    commentsCount: 9,
    tags: ["DubaiMall", "LuxuryDOOH", "RetailMedia", "FashionAvenue", "HighNetWorth"],
    verifiedSpotter: true,
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
  },
  {
    id: "post-london-tube-transit",
    authorId: "user-spotter-oliver",
    authorName: "Oliver Higgins",
    authorUsername: "oliver_transit",
    authorAvatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
    authorRole: "spotter",
    authorBadge: "🚇 Transit Pro",
    title: "London Underground Cross-Track 48-Sheet Digital Escalator Reel",
    description:
      "Filmed the digital escalator panel series at Oxford Circus during peak evening commuter rush. Sequential storytelling format where 6 screens sync together as passengers descend.",
    mediaType: "video",
    mediaUrl:
      "https://assets.mixkit.co/videos/preview/mixkit-busy-metro-station-during-rush-hour-42031-large.mp4",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1000&auto=format&fit=crop&q=80",
    oohMedium: "metro_station",
    city: "London",
    country: "United Kingdom",
    area: "Central London",
    landmark: "Oxford Circus Underground Concourse",
    insights: {
      dailyTraffic: "360,000 daily underground commuters",
      dwellTimeSeconds: 45,
      visibilityRating: 9.3,
      daypartingPeak: "Weekday Rush Hours (7:30-9:30 AM & 5:00-7:30 PM)",
      bestIndustries: ["SaaS & Business Software", "Streaming Services", "Job Portals / Fintech"],
      keyAdvantage: "Captive audience with no phone signal distractions on deep platforms.",
      recommendedCpm: "£8.50 (~$11.00)",
    },
    linkedListingId: "london-underground-pack",
    linkedListingTitle: "Central Line Concourse Digital 16-Screen Package",
    linkedListingPrice: 18500,
    linkedListingCurrency: "GBP",
    coinsRewarded: 75,
    likesCount: 88,
    likedBy: [],
    commentsCount: 14,
    tags: ["TransitOOH", "LondonTube", "SequentialAd", "MetroDigital", "CommuterImpact"],
    verifiedSpotter: true,
    createdAt: new Date(Date.now() - 3600000 * 30).toISOString(),
  },
  {
    id: "post-tokyo-shibuya-crossing",
    authorId: "user-spotter-kenji",
    authorName: "Kenji Sato",
    authorUsername: "kenji_tokyo_media",
    authorAvatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80",
    authorRole: "advertiser",
    authorBadge: "🥈 Silver Scout",
    title: "Synchronized Triple-Screen Takeover - Shibuya Scramble",
    description:
      "All 3 mega-screens around Shibuya crossing synched for a 30-second brand roadblock. The sound and audio can be heard across the entire intersection when the walk sign turns green.",
    mediaType: "photo",
    mediaUrl:
      "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=1200&auto=format&fit=crop&q=80",
    oohMedium: "digital_billboard",
    city: "Tokyo",
    country: "Japan",
    area: "Shibuya",
    landmark: "Hachiko Square / Shibuya Scramble Crossing",
    insights: {
      dailyTraffic: "650,000+ pedestrian crossers daily",
      dwellTimeSeconds: 70,
      visibilityRating: 9.9,
      daypartingPeak: "Evenings & Weekends (6:00 PM - 11:00 PM)",
      bestIndustries: ["Gaming & Esports", "Consumer Electronics", "App Launches", "Beverages"],
      keyAdvantage:
        "Iconic global cultural landmark; immense earned media on YouTube and Instagram travel vlogs.",
      recommendedCpm: "¥1,800 (~$12.50)",
    },
    linkedListingId: "shibuya-mega-screen",
    linkedListingTitle: "Shibuya Center Synchronized DOOH Network",
    linkedListingPrice: 55000,
    linkedListingCurrency: "USD",
    coinsRewarded: 50,
    likesCount: 230,
    likedBy: [],
    commentsCount: 29,
    tags: ["TokyoOOH", "ShibuyaScramble", "SyncScreens", "DOOHRoadblock", "IconicSite"],
    verifiedSpotter: true,
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
];

export const INITIAL_COMMENTS: Record<string, FeedComment[]> = {
  "post-times-square-3d": [
    {
      id: "c-101",
      postId: "post-times-square-3d",
      authorId: "user-anna",
      authorName: "Anna Lindqvist",
      authorUsername: "anna_creative",
      authorAvatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      authorBadge: "🎨 Creative Director",
      text: "The anamorphic perspective angle here is engineered perfectly for the south pedestrian island. What was the production resolution for the 3D asset?",
      likesCount: 16,
      likedBy: [],
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    },
    {
      id: "c-102",
      postId: "post-times-square-3d",
      authorId: "user-spotter-marcus",
      authorName: "Marcus Sterling",
      authorUsername: "marcus_ooh",
      authorAvatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      authorBadge: "🥇 Gold Scout",
      text: "Rendered at 4K UHD 60fps ProRes 4444! The corner pixel pitch is 4mm, so it stays crisp even at 15ft distance.",
      likesCount: 9,
      likedBy: [],
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: "c-103",
      postId: "post-times-square-3d",
      authorId: "user-cmo-dave",
      authorName: "David Vance",
      authorUsername: "vance_marketing",
      authorAvatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
      authorBadge: "💼 Media Buyer",
      text: "We just booked a 2-week flight here through Mark@Ads for our Q4 gaming launch. The direct escrow booking process was so painless!",
      likesCount: 12,
      likedBy: [],
      createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    },
  ],
  "post-mumbai-we-highway": [
    {
      id: "c-201",
      postId: "post-mumbai-we-highway",
      authorId: "user-rajesh",
      authorName: "Rajesh Kothari",
      authorUsername: "rajesh_mumbai",
      authorAvatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      authorBadge: "🏢 Media Owner",
      text: "True insight regarding the BKC traffic bottleneck. Between 8:30 AM and 10:45 AM, avg speed is under 12 km/h, which gives drivers nearly 2 full minutes of head-on view.",
      likesCount: 14,
      likedBy: [],
      createdAt: new Date(Date.now() - 3600000 * 10).toISOString(),
    },
  ],
};

const LOCAL_FEED_KEY = "markatads_community_feed_posts";
const LOCAL_COMMENTS_KEY = "markatads_community_comments";

// Feed Posts Data Management
export function getLocalFeedPosts(): FeedPost[] {
  if (typeof window === "undefined") return INITIAL_FEED_POSTS;
  try {
    const raw = localStorage.getItem(LOCAL_FEED_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback
  }
  localStorage.setItem(LOCAL_FEED_KEY, JSON.stringify(INITIAL_FEED_POSTS));
  return INITIAL_FEED_POSTS;
}

export function saveLocalFeedPosts(posts: FeedPost[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_FEED_KEY, JSON.stringify(posts));
  window.dispatchEvent(new Event("markatads_feed_updated"));
}

export async function fetchFeedPosts(): Promise<FeedPost[]> {
  try {
    // Try fetching from Firestore
    const snap = await getDocs(
      query(collection(db, "feed_posts"), orderBy("createdAt", "desc"), limit(50)),
    );
    if (!snap.empty) {
      const livePosts = snap.docs.map((d) => d.data() as FeedPost);
      saveLocalFeedPosts(livePosts);
      return livePosts;
    }
  } catch (err) {
    console.debug("Firestore feed_posts fetch fallback to local:", err);
  }
  return getLocalFeedPosts();
}

export async function createFeedPost(
  postInput: Omit<
    FeedPost,
    "id" | "coinsRewarded" | "likesCount" | "likedBy" | "commentsCount" | "createdAt"
  >,
  userUid?: string,
): Promise<FeedPost> {
  const coinsForPost = postInput.mediaType === "video" ? 75 : 50;
  const newPostId = `feed-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const newPost: FeedPost = {
    ...postInput,
    id: newPostId,
    coinsRewarded: coinsForPost,
    likesCount: 1, // author auto-upvote
    likedBy: userUid ? [userUid] : ["current_user"],
    commentsCount: 0,
    createdAt: now,
    verifiedSpotter: true,
  };

  // Save to local state
  const current = getLocalFeedPosts();
  const updated = [newPost, ...current];
  saveLocalFeedPosts(updated);

  // Award coins to user!
  addCoinTransaction(
    coinsForPost,
    postInput.mediaType === "video" ? "post_video" : "post_photo",
    `Spotter Sighting Reward: Posted ${postInput.mediaType.toUpperCase()} of ${postInput.title} (+${coinsForPost} Coins)`,
    userUid,
  );

  // Attempt Firestore sync
  if (auth.currentUser) {
    try {
      await setDoc(doc(db, "feed_posts", newPostId), newPost);
    } catch (err) {
      console.debug("Firestore post sync error handled:", err);
    }
  }

  toast.success(`🎉 Sighting published! You earned +${coinsForPost} OOH Coins!`);
  return newPost;
}

export async function toggleLikePost(
  postId: string,
  userId: string = "guest_user",
): Promise<{ liked: boolean; newCount: number }> {
  const posts = getLocalFeedPosts();
  const idx = posts.findIndex((p) => p.id === postId);
  if (idx === -1) return { liked: false, newCount: 0 };

  const post = posts[idx];
  const hasLiked = post.likedBy.includes(userId);
  let nextLikedBy: string[];
  let nextCount: number;

  if (hasLiked) {
    nextLikedBy = post.likedBy.filter((id) => id !== userId);
    nextCount = Math.max(0, post.likesCount - 1);
  } else {
    nextLikedBy = [...post.likedBy, userId];
    nextCount = post.likesCount + 1;
    // Award +5 coins for community engagement!
    addCoinTransaction(
      5,
      "spotter_bounty",
      `Engagement Bonus: Liked ${post.title} (+5 Coins)`,
      userId,
    );
    toast.success("Spotter Upvoted! +5 OOH Coins earned.");
  }

  const updatedPost: FeedPost = {
    ...post,
    likesCount: nextCount,
    likedBy: nextLikedBy,
  };

  posts[idx] = updatedPost;
  saveLocalFeedPosts(posts);

  // Sync to Firestore
  if (auth.currentUser) {
    try {
      await updateDoc(doc(db, "feed_posts", postId), {
        likesCount: nextCount,
        likedBy: nextLikedBy,
      });
    } catch (err) {
      console.debug("Firestore like sync error handled:", err);
    }
  }

  return { liked: !hasLiked, newCount: nextCount };
}

// Comments Management
export function getLocalComments(postId: string): FeedComment[] {
  if (typeof window === "undefined") return INITIAL_COMMENTS[postId] || [];
  try {
    const raw = localStorage.getItem(`${LOCAL_COMMENTS_KEY}_${postId}`);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  const defaultComments = INITIAL_COMMENTS[postId] || [];
  localStorage.setItem(`${LOCAL_COMMENTS_KEY}_${postId}`, JSON.stringify(defaultComments));
  return defaultComments;
}

export function saveLocalComments(postId: string, comments: FeedComment[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${LOCAL_COMMENTS_KEY}_${postId}`, JSON.stringify(comments));
}

export async function addCommentToPost(
  postId: string,
  text: string,
  authorInfo: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
    badge?: string;
  },
): Promise<FeedComment> {
  const commentId = `c-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const newComment: FeedComment = {
    id: commentId,
    postId,
    authorId: authorInfo.id,
    authorName: authorInfo.name,
    authorUsername: authorInfo.username,
    authorAvatar:
      authorInfo.avatar ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    authorBadge: authorInfo.badge || "💬 OOH Analyst",
    text: text.trim(),
    likesCount: 0,
    likedBy: [],
    createdAt: new Date().toISOString(),
  };

  const existingComments = getLocalComments(postId);
  const updatedComments = [...existingComments, newComment];
  saveLocalComments(postId, updatedComments);

  // Update post's commentsCount
  const posts = getLocalFeedPosts();
  const pIdx = posts.findIndex((p) => p.id === postId);
  if (pIdx !== -1) {
    posts[pIdx].commentsCount = (posts[pIdx].commentsCount || 0) + 1;
    saveLocalFeedPosts(posts);
  }

  // Award +10 coins for adding analytical insights!
  addCoinTransaction(
    10,
    "comment",
    `Community Insight: Commented on post (+10 Coins)`,
    authorInfo.id,
  );

  // Sync to Firestore
  if (auth.currentUser) {
    try {
      await setDoc(doc(db, "feed_comments", commentId), newComment);
      await updateDoc(doc(db, "feed_posts", postId), {
        commentsCount: posts[pIdx]?.commentsCount || 1,
      });
    } catch (err) {
      console.debug("Firestore comment sync note:", err);
    }
  }

  toast.success("Comment added! +10 OOH Coins rewarded for your insight.");
  return newComment;
}

export function claimPostSpotterBounty(
  postId: string,
  userId: string = "guest_user",
): { success: boolean; coins: number } {
  const claimedKey = `markatads_bounty_claimed_${postId}_${userId}`;
  if (typeof window !== "undefined") {
    if (localStorage.getItem(claimedKey)) {
      toast.info("You already collected the spotter bounty on this medium sighting.");
      return { success: false, coins: 0 };
    }
    localStorage.setItem(claimedKey, "true");
  }
  const bounty = 20;
  addCoinTransaction(
    bounty,
    "spotter_bounty",
    `Claimed OOH Spotter Bounty (+${bounty} Coins)`,
    userId,
  );
  toast.success(`🎯 Bounty Collected! +${bounty} OOH Coins deposited in your wallet.`);
  return { success: true, coins: bounty };
}
