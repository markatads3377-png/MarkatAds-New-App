import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Coins,
  Search,
  Heart,
  MessageSquare,
  Gift,
  Eye,
  Clock,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Share2,
  X,
  Building,
} from 'lucide-react';
import { useApp, AVAILABLE_PERKS } from '../context/AppContext';
import { FeedPost, FeedComment, CoinPerk } from '../types';
import { toast } from 'sonner';

export const INITIAL_POSTS: FeedPost[] = [
  {
    id: 'post-1',
    authorId: 'usr-1',
    authorName: 'Marcus Sterling',
    authorUsername: 'marcus_ooh',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    authorRole: 'spotter',
    authorBadge: '★ Gold Scout',
    title: 'Anamorphic 3D DOOH Spectacular - Times Square Corner',
    description: 'Naked-eye 3D creative execution spotted at Broadway & 45th! Over 80% viral social pass-along rate observed from pedestrians.',
    mediaType: 'photo',
    mediaUrl: 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=1000',
    oohMedium: 'digital_screen',
    city: 'New York',
    country: 'United States',
    area: 'Times Square Broadway',
    insights: {
      dailyTraffic: '520,000+ pedestrian & vehicular views',
      dwellTimeSeconds: 65,
      visibilityRating: 9.8,
      daypartingPeak: 'Evening Spectacular (7:00 PM - 1:00 AM)',
      bestIndustries: ['Entertainment', 'Consumer Tech', 'Fashion'],
      keyAdvantage: 'Extreme viral pull; 1 in 3 pedestrians record video clips for TikTok & Reels.',
      recommendedCpm: '$12.00 - $18.50',
    },
    linkedListingId: 'times-square-broadway',
    linkedListingTitle: 'Times Square Broadway 4K Curved Spectacular',
    linkedListingPrice: 18500,
    linkedListingCurrency: 'USD',
    coinsRewarded: 50,
    likesCount: 142,
    likedBy: [],
    commentsCount: 18,
    tags: ['TimesSquare', 'DOOH', '3DAnamorphic'],
    verifiedSpotter: true,
    createdAt: '2026-09-28T14:30:00Z',
  },
  {
    id: 'post-2',
    authorId: 'usr-2',
    authorName: 'Priya Sharma',
    authorUsername: 'priya_mumbai',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
    authorRole: 'agency',
    authorBadge: '★ Top Scout',
    title: 'Massive Arterial Highway Unipole - Western Express Highway',
    description: 'Crucial spot right before the Bandra Kurla Complex (BKC) flyover. Unavoidable during morning corporate rush hours when traffic naturally slows to 15km/h.',
    mediaType: 'photo',
    mediaUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200',
    oohMedium: 'outdoor_hoarding',
    city: 'Mumbai',
    country: 'India',
    area: 'Western Express Highway, Bandra',
    insights: {
      dailyTraffic: '380,000+ corporate vehicles & cabs',
      dwellTimeSeconds: 90,
      visibilityRating: 9.5,
      daypartingPeak: 'Morning Peak (8:30 AM - 11:30 AM)',
      bestIndustries: ['Fintech & Banking', 'Automotive', 'Real Estate'],
      keyAdvantage: 'Head-on driver eye-level alignment with zero tree obstruction.',
      recommendedCpm: '$0.40 - $0.80',
    },
    linkedListingId: 'bandra-we-hoarding',
    linkedListingTitle: 'Bandra Western Express Highway Unipole Hoarding',
    linkedListingPrice: 5400,
    linkedListingCurrency: 'USD',
    coinsRewarded: 50,
    likesCount: 98,
    likedBy: [],
    commentsCount: 12,
    tags: ['HighwayUnipole', 'MumbaiOOH', 'BKCExpress'],
    verifiedSpotter: true,
    createdAt: '2026-09-27T08:15:00Z',
  },
  {
    id: 'post-3',
    authorId: 'usr-3',
    authorName: 'Tariq Al-Mansoor',
    authorUsername: 'tariq_dubaimedia',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    authorRole: 'seller',
    authorBadge: '★ Media Owner',
    title: 'Grand Atrium Luxury Curved LED - The Dubai Mall',
    description: 'Positioned outside Bloomingdales and Galeries Lafayette. Reaches ultra-high-net-worth international shoppers with long retail dwell times.',
    mediaType: 'photo',
    mediaUrl: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=1200',
    oohMedium: 'indoor_mall_screen',
    city: 'Dubai',
    country: 'United Arab Emirates',
    area: 'Downtown Dubai',
    insights: {
      dailyTraffic: '210,000 affluent tourists & luxury buyers',
      dwellTimeSeconds: 120,
      visibilityRating: 9.7,
      daypartingPeak: 'Afternoon & Late Nights (4:00 PM - Midnight)',
      bestIndustries: ['Luxury Horology', 'Fine Jewelry', 'Airlines'],
      keyAdvantage: 'Shoppers can walk 50 meters and buy the advertised luxury item immediately.',
      recommendedCpm: '$4.00 - $9.50',
    },
    linkedListingId: 'dubai-mall-atrium',
    linkedListingTitle: 'Dubai Mall Grand Atrium Ultra-HD LED',
    linkedListingPrice: 9600,
    linkedListingCurrency: 'USD',
    coinsRewarded: 50,
    likesCount: 114,
    likedBy: [],
    commentsCount: 9,
    tags: ['DubaiMall', 'LuxuryDOOH', 'FashionAvenue'],
    verifiedSpotter: true,
    createdAt: '2026-09-26T18:00:00Z',
  },
];

export const CommunityFeed: React.FC = () => {
  const {
    userCoins,
    claimDailyReward,
    canClaimDaily,
    redeemPerk,
    redeemedPerks,
    setSelectedListingForDetail,
    catalog,
    formatMoney,
  } = useApp();

  const [posts, setPosts] = useState<FeedPost[]>(INITIAL_POSTS);
  const [search, setSearch] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('all');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCity, setNewCity] = useState('Dubai');
  const [newCountry, setNewCountry] = useState('United Arab Emirates');
  const [newDesc, setNewDesc] = useState('');
  const [newPhoto, setNewPhoto] = useState('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200');

  const filteredPosts = posts.filter((p) => {
    if (selectedFormat !== 'all' && p.oohMedium !== selectedFormat) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.city.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    }
    return true;
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newPost: FeedPost = {
      id: `post-${Date.now()}`,
      authorId: 'usr-self',
      authorName: 'Community Media Scout',
      authorUsername: 'scout_pro',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
      authorRole: 'spotter',
      authorBadge: '★ Verified Scout',
      title: newTitle.trim(),
      description: newDesc.trim() || 'Spotted fresh high-impact placement in prime traffic zone.',
      mediaType: 'photo',
      mediaUrl: newPhoto.trim(),
      oohMedium: 'digital_screen',
      city: newCity.trim(),
      country: newCountry.trim(),
      area: 'Central Commercial District',
      insights: {
        dailyTraffic: '250,000+ daily views',
        dwellTimeSeconds: 45,
        visibilityRating: 9.4,
        daypartingPeak: 'Morning & Evening Commutes',
        bestIndustries: ['Automotive', 'Fintech', 'Retail'],
        keyAdvantage: 'High line-of-sight elevation at arterial highway intersection.',
        recommendedCpm: '$2.50 - $4.00',
      },
      coinsRewarded: 50,
      likesCount: 1,
      likedBy: [],
      commentsCount: 0,
      tags: ['NewSighting', newCity],
      verifiedSpotter: true,
      createdAt: new Date().toISOString(),
    };
    setPosts([newPost, ...posts]);
    toast.success('Sighting posted! +50 OOH Coins added to your wallet.');
    setIsSubmitModalOpen(false);
    setNewTitle('');
  };

  const handleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, likesCount: p.likesCount + 1 } : p
      )
    );
    toast.success('Upvoted! +5 Coins bonus.');
  };

  return (
    <div className="space-y-6">
      {/* Community Feed Banner with Wallet */}
      <div className="rounded-3xl border border-neutral-200 bg-gradient-to-br from-card via-white to-red-50/40 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-[#C62828] border border-red-200 text-xs font-bold">
              <Sparkles className="size-3.5" />
              <span>OOH Ecosystem Spotter Intelligence Feed</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-neutral-900">
              Community Billboard Sightings & DOOH Video Reel
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Real-world photos and video reels of high-impact advertising spaces. Post media sightings to earn <strong>OOH Coins</strong> and redeem them for campaign flight discounts!
            </p>
          </div>

          {/* Wallet Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-3 min-w-[260px] shrink-0">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-500 font-medium">Spotter Wallet</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold text-[10px]">
                Gold Scout
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <Coins className="size-6 text-amber-500 shrink-0" />
              <span className="text-3xl font-black text-neutral-900 font-display">
                {userCoins.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-amber-600">Coins</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(true)}
                className="h-8 px-2 rounded-xl bg-[#C62828] hover:bg-[#B71C1C] text-white text-xs font-bold flex items-center justify-center gap-1"
              >
                <Plus className="size-3" />
                <span>Post (+50)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (claimDailyReward()) {
                    toast.success('Daily bounty claimed! +25 Coins.');
                  } else {
                    toast.info('Already claimed today!');
                  }
                }}
                disabled={!canClaimDaily}
                className={`h-8 px-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1 ${
                  canClaimDaily
                    ? 'border-amber-400 bg-amber-50 text-amber-800 hover:bg-amber-100'
                    : 'border-neutral-200 text-neutral-400 opacity-60'
                }`}
              >
                <Gift className="size-3 text-amber-500" />
                <span>{canClaimDaily ? 'Daily +25' : 'Claimed'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sighting Feed Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by city (e.g. Dubai, New York)..."
            className="w-full h-9 pl-9 pr-3 rounded-xl border border-neutral-200 text-xs bg-white text-neutral-800"
          />
        </div>

        <button
          type="button"
          onClick={() => setIsSubmitModalOpen(true)}
          className="h-9 px-4 rounded-xl bg-[#C62828] hover:bg-[#B71C1C] text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs self-start sm:self-auto"
        >
          <Plus className="size-3.5" />
          <span>Upload Sighting (+50 Coins)</span>
        </button>
      </div>

      {/* Feed Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => {
          const linked = catalog.find((c) => c.id === post.linkedListingId);

          return (
            <div
              key={post.id}
              className="rounded-3xl border border-neutral-200 bg-white overflow-hidden shadow-2xs flex flex-col justify-between space-y-3"
            >
              {/* Author Row */}
              <div className="p-4 pb-0 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <img src={post.authorAvatar} alt="" className="size-9 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold text-xs text-neutral-900 leading-tight">{post.authorName}</h4>
                    <span className="text-[10px] text-neutral-400">@{post.authorUsername}</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
                  {post.city}
                </span>
              </div>

              {/* Photo */}
              <div className="relative aspect-[16/10] overflow-hidden bg-black mx-4 rounded-2xl">
                <img src={post.mediaUrl} alt="" className="size-full object-cover" />
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/75 text-white capitalize">
                  {post.oohMedium.replace('_', ' ')}
                </div>
              </div>

              {/* Title & Desc */}
              <div className="px-4 space-y-1.5">
                <h3 className="font-bold text-sm text-neutral-900 line-clamp-1">{post.title}</h3>
                <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">{post.description}</p>
                <div className="p-2 rounded-xl bg-neutral-50 text-[11px] text-neutral-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Reach: <strong>{post.insights.dailyTraffic}</strong></span>
                    <span className="text-emerald-700 font-bold">Score: {post.insights.visibilityRating}/10</span>
                  </div>
                  <p className="text-[10px] text-neutral-400 italic">"{post.insights.keyAdvantage}"</p>
                </div>
              </div>

              {/* Linked Booking Space */}
              {linked && (
                <div className="mx-4 p-3 rounded-xl bg-red-50/60 border border-red-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-[#C62828] block uppercase">Available in Catalog</span>
                    <strong className="text-neutral-900 truncate block max-w-[180px]">{linked.title}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedListingForDetail(linked)}
                    className="h-7 px-2.5 rounded-lg bg-[#C62828] text-white font-bold text-[11px]"
                  >
                    Book Space
                  </button>
                </div>
              )}

              {/* Actions Footer */}
              <div className="p-4 pt-1 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                <button
                  type="button"
                  onClick={() => handleLike(post.id)}
                  className="flex items-center gap-1 font-semibold hover:text-[#C62828]"
                >
                  <Heart className="size-3.5 fill-current text-rose-500" />
                  <span>{post.likesCount} Upvotes</span>
                </button>

                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="size-3.5" />
                    <span>{post.commentsCount} Notes</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(window.location.href);
                      toast.success('Link copied to clipboard!');
                    }}
                    className="hover:text-neutral-900"
                    title="Share"
                  >
                    <Share2 className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rewards Vouchers Shop Section */}
      <div className="p-6 rounded-3xl border border-neutral-200 bg-white shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-neutral-900 font-display">
              Redeem OOH Spotter Coins for Campaign Credits
            </h3>
            <p className="text-xs text-neutral-500">
              Apply these promo codes at checkout for instant deductions on billboard and DOOH bookings.
            </p>
          </div>
          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            {userCoins} Coins Available
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {AVAILABLE_PERKS.slice(0, 3).map((perk) => {
            const isRedeemed = redeemedPerks.includes(perk.id);
            const canAfford = userCoins >= perk.cost;

            return (
              <div key={perk.id} className="p-4 rounded-2xl border border-neutral-200 bg-neutral-50/50 space-y-2 text-xs">
                <div className="flex justify-between font-bold">
                  <span className="text-neutral-900">{perk.name}</span>
                  <span className="text-amber-600 flex items-center gap-1 font-display">
                    <Coins className="size-3" /> {perk.cost}
                  </span>
                </div>
                <p className="text-neutral-500 text-[11px] leading-relaxed">{perk.description}</p>
                <div className="pt-1">
                  {isRedeemed ? (
                    <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded block text-center">
                      Code: {perk.code}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        if (redeemPerk(perk)) {
                          toast.success(`Redeemed ${perk.name}! Use code ${perk.code} in cart.`);
                        } else {
                          toast.error(`Need ${perk.cost} coins. Post more sightings to earn!`);
                        }
                      }}
                      disabled={!canAfford}
                      className="w-full h-8 rounded-xl bg-[#C62828] hover:bg-[#B71C1C] text-white font-bold disabled:opacity-40"
                    >
                      {canAfford ? 'Redeem Voucher' : `Needs ${perk.cost} Coins`}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sighting Submission Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-neutral-200">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-bold text-sm text-neutral-900 font-display">
                Upload OOH Billboard Sighting (+50 Coins)
              </h3>
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                className="size-8 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 grid place-items-center"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-neutral-700">Placement Title *</label>
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Piccadilly Lights Curved LED Roadblock"
                  className="w-full h-9 px-3 rounded-xl border border-neutral-200 text-xs bg-white text-neutral-800"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-700">City</label>
                  <input
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-neutral-200 text-xs bg-white text-neutral-800"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-700">Country</label>
                  <input
                    value={newCountry}
                    onChange={(e) => setNewCountry(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-neutral-200 text-xs bg-white text-neutral-800"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-neutral-700">Photo URL</label>
                <input
                  value={newPhoto}
                  onChange={(e) => setNewPhoto(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-neutral-200 text-xs bg-white text-neutral-800"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-neutral-700">Observation Notes</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows={2}
                  placeholder="Describe lighting clarity, commuter dwell behaviors, or viewing angles..."
                  className="w-full p-2.5 rounded-xl border border-neutral-200 text-xs bg-white text-neutral-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="h-8 px-3 rounded-xl border border-neutral-200 text-neutral-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-8 px-4 rounded-xl bg-[#C62828] hover:bg-[#B71C1C] text-white font-bold"
                >
                  Publish & Collect +50 Coins
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
