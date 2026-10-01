export type Role = 'buyer' | 'seller' | 'admin';

export type MediumType =
  | 'billboard'
  | 'digital_screen'
  | 'indoor_mall_screen'
  | 'outdoor_hoarding'
  | 'airport'
  | 'metro'
  | 'transit'
  | 'shop_branding'
  | 'led_truck'
  | 'event_branding'
  | 'second_hand';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'AED' | 'INR';

export interface CurrencyRate {
  code: CurrencyCode;
  symbol: string;
  rateAgainstUSD: number;
  name: string;
}

export interface AddonServices {
  printing: boolean; // Vinyl Print & Mounting (+$450)
  creativeDesign: boolean; // Creative Resizing & Audit (+$250)
  proofOfPlay: boolean; // Drone & Sensor Proof-of-Play (+$150)
  stormInsurance: boolean; // Weather & Damage Insurance (+$99)
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  medium: MediumType;
  city: string;
  country: string;
  address?: string;
  size: string;
  resolution?: string;
  lightingType?: string;
  pricePerMonth: number;
  pricePerDay?: number;
  currency: string;
  available: boolean;
  secondHand: boolean;
  featured: boolean;
  maintenance?: boolean;
  images: string[];
  videoUrl?: string;
  dailyImpressions: string;
  audienceTag?: string;
  trafficTag?: string;
  minimumFlight?: string;
  sellerName?: string;
  sellerRating?: number;
  sellerReviewsCount?: number;
  cpm?: string;
  decAudit?: string;
  occupancyRate?: number;
  views?: number;
  inquiriesCount?: number;
  coordinates?: { lat: number; lng: number };
  totalRevenueEarned?: number;
  currentAdvertiser?: string;
  activeContractEnd?: string;
  totalSlots?: number;
  occupiedSlots?: number;
  slots?: SlotInfo[];
  liveCameraUrl?: string;
  createdAt?: string;
}

export interface SlotInfo {
  id: string;
  slotNumber: number;
  durationSeconds: number;
  advertiserName: string;
  brandCategory: string;
  status: 'active' | 'vacant' | 'reserved';
  creativePreviewUrl?: string;
  monthlyRevenue: number;
  contractEnd?: string;
}

export interface CartMediaItem {
  id: string;
  listing: Listing;
  durationMonths: number;
  startDate: string;
  addons: AddonServices;
  customNotes?: string;
}

export interface PlacedOrder {
  id: string;
  createdAt: string;
  items: CartMediaItem[];
  subtotal: number;
  discountAmount: number;
  addonsTotal: number;
  taxAmount: number;
  totalAmount: number;
  currency: CurrencyCode;
  paymentMethod: string;
  advertiserName: string;
  advertiserEmail: string;
  companyName: string;
  status: 'Booked' | 'Creative Review' | 'Mounting & Prep' | 'Live on Air' | 'Completed';
  artworkUploaded?: boolean;
  artworkUrl?: string;
  flightStartDate: string;
  flightEndDate: string;
}

export interface ProposalItem {
  assetId: string;
  title: string;
  medium: MediumType;
  city: string;
  monthlyRate: number;
  months: number;
  total: number;
}

export interface ProposalRecord {
  id: string;
  proposalNumber: string;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  items: ProposalItem[];
  subtotal: number;
  agencyDiscountPct: number;
  productionCost: number;
  totalAmount: number;
  currency: string;
  status: 'draft' | 'sent' | 'accepted' | 'expired';
  validUntil: string;
  notes?: string;
  createdAt: string;
}

export interface ProofOfPlayRecord {
  id: string;
  assetId: string;
  assetTitle: string;
  advertiser: string;
  timestamp: string;
  imageUrl: string;
  cameraName: string;
  compliancePct: number;
  verifiedBy: string;
  gpsVerified: boolean;
}

export interface PayoutTransaction {
  id: string;
  date: string;
  amount: number;
  currency: string;
  method: 'bank_wire' | 'stripe_connect' | 'escrow_direct' | 'paypal';
  accountReference: string;
  status: 'completed' | 'processing' | 'scheduled';
  invoiceNumber: string;
}

export interface FeedPost {
  id: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  authorRole: 'advertiser' | 'seller' | 'agency' | 'spotter' | 'admin';
  authorBadge?: string;
  title: string;
  description: string;
  mediaType: 'photo' | 'video';
  mediaUrl: string;
  thumbnailUrl?: string;
  oohMedium: MediumType;
  city: string;
  country: string;
  area: string;
  landmark?: string;
  insights: {
    dailyTraffic: string;
    dwellTimeSeconds: number;
    visibilityRating: number;
    daypartingPeak: string;
    bestIndustries: string[];
    keyAdvantage: string;
    recommendedCpm: string;
  };
  linkedListingId?: string;
  linkedListingTitle?: string;
  linkedListingPrice?: number;
  linkedListingCurrency?: string;
  coinsRewarded: number;
  likesCount: number;
  likedBy: string[];
  commentsCount: number;
  tags: string[];
  verifiedSpotter: boolean;
  createdAt: string;
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
  createdAt: string;
}

export interface CoinTransaction {
  id: string;
  userId: string;
  amount: number;
  action: string;
  description: string;
  createdAt: string;
}

export interface CoinPerk {
  id: string;
  name: string;
  cost: number;
  discountValue: number;
  description: string;
  code: string;
  badge?: string;
}
