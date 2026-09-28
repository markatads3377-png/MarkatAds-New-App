export type MediumType =
  | "billboard"
  | "digital_screen"
  | "indoor_mall_screen"
  | "outdoor_hoarding"
  | "airport"
  | "metro"
  | "transit"
  | "shop_branding"
  | "led_truck"
  | "event_branding"
  | "second_hand";

export interface SlotInfo {
  id: string;
  slotNumber: number;
  durationSeconds: number;
  advertiserName: string;
  brandCategory: string;
  status: "active" | "vacant" | "reserved";
  creativePreviewUrl?: string;
  monthlyRevenue: number;
  contractEnd?: string;
}

export interface MediaAsset {
  id: string;
  title: string;
  description: string;
  medium: MediumType;
  city: string;
  country: string;
  address: string;
  size: string;
  resolution?: string;
  lightingType?: string;
  dailyImpressions: string;
  decAudit?: string;
  pricePerMonth: number;
  spotRateDaily?: number;
  currency: string;
  images: string[];
  videoUrl?: string;
  latitude?: number;
  longitude?: number;
  available: boolean;
  secondHand: boolean;
  featured: boolean;
  maintenance: boolean;
  minimumFlight?: string;
  views: number;
  inquiriesCount: number;
  totalRevenueEarned: number;
  currentAdvertiser?: string;
  activeContractEnd?: string;
  occupancyRate: number; // 0 to 100
  totalSlots?: number;
  occupiedSlots?: number;
  slots?: SlotInfo[];
  liveCameraUrl?: string;
  createdAt: string;
}

export interface BookingRecord {
  id: string;
  assetId: string;
  assetTitle: string;
  medium: MediumType;
  advertiser: string;
  agency?: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  currency: string;
  status: "in_flight" | "completed" | "pending_approval" | "upcoming";
  escrowStatus: "held" | "released" | "processing";
  popStatus: "verified" | "pending_proof" | "reviewing";
  impressionsDelivered?: number;
  createdAt: string;
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
  status: "draft" | "sent" | "accepted" | "expired";
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
  method: "bank_wire" | "stripe_connect" | "escrow_direct" | "paypal";
  accountReference: string;
  status: "completed" | "processing" | "scheduled";
  invoiceNumber: string;
}
