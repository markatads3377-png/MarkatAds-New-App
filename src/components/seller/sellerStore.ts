import {
  type MediaAsset,
  type BookingRecord,
  type ProposalRecord,
  type ProofOfPlayRecord,
  type PayoutTransaction,
  type SlotInfo,
} from "./sellerTypes";

const STORAGE_KEYS = {
  ASSETS: "markatads_seller_assets_v2",
  BOOKINGS: "markatads_seller_bookings_v2",
  PROPOSALS: "markatads_seller_proposals_v2",
  POP: "markatads_seller_pop_v2",
  PAYOUTS: "markatads_seller_payouts_v2",
};

export const INITIAL_SLOTS_SAMPLE: SlotInfo[] = [
  {
    id: "slot-1",
    slotNumber: 1,
    durationSeconds: 10,
    advertiserName: "Nike Running Global",
    brandCategory: "Sportswear & Footwear",
    status: "active",
    monthlyRevenue: 3400,
    creativePreviewUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
    contractEnd: "2026-11-15",
  },
  {
    id: "slot-2",
    slotNumber: 2,
    durationSeconds: 10,
    advertiserName: "Samsung Galaxy AI",
    brandCategory: "Consumer Electronics",
    status: "active",
    monthlyRevenue: 3400,
    creativePreviewUrl:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80",
    contractEnd: "2026-12-01",
  },
  {
    id: "slot-3",
    slotNumber: 3,
    durationSeconds: 10,
    advertiserName: "Rolex Oyster Perpetual",
    brandCategory: "Luxury Horology",
    status: "active",
    monthlyRevenue: 3600,
    creativePreviewUrl:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80",
    contractEnd: "2026-10-30",
  },
  {
    id: "slot-4",
    slotNumber: 4,
    durationSeconds: 10,
    advertiserName: "Open for Booking",
    brandCategory: "Available",
    status: "vacant",
    monthlyRevenue: 0,
  },
  {
    id: "slot-5",
    slotNumber: 5,
    durationSeconds: 10,
    advertiserName: "Emirates First Class",
    brandCategory: "Aviation & Travel",
    status: "active",
    monthlyRevenue: 3500,
    creativePreviewUrl:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&auto=format&fit=crop&q=80",
    contractEnd: "2026-11-20",
  },
  {
    id: "slot-6",
    slotNumber: 6,
    durationSeconds: 10,
    advertiserName: "BMW iX Electric",
    brandCategory: "Automotive",
    status: "active",
    monthlyRevenue: 3500,
    creativePreviewUrl:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&auto=format&fit=crop&q=80",
    contractEnd: "2026-12-15",
  },
];

export const INITIAL_ASSETS: MediaAsset[] = [
  {
    id: "asset-ts-broadway",
    title: "Times Square Broadway 4K Curved Spectacular",
    description:
      "Iconic curved DOOH spectacular dominating Broadway and 47th Street. Highest pedestrian density in the Western hemisphere with dynamic programmatic slot scheduling.",
    medium: "digital_screen",
    city: "New York",
    country: "United States",
    address: "Broadway & 47th St, Times Square, NY 10036",
    size: "30ft x 70ft Curved LED Display",
    resolution: "3840 x 2160 (4K UHD 60FPS)",
    lightingType: "Daylight SMD LED 8,500 Nits",
    dailyImpressions: "450,000+ daily views",
    decAudit: "Geopath Verified #NY-8821",
    pricePerMonth: 18500,
    spotRateDaily: 750,
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200&auto=format&fit=crop&q=80",
    ],
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    latitude: 40.7589,
    longitude: -73.9851,
    available: true,
    secondHand: false,
    featured: true,
    maintenance: false,
    minimumFlight: "2 Weeks",
    views: 8940,
    inquiriesCount: 28,
    totalRevenueEarned: 124500,
    currentAdvertiser: "Nike / Samsung / Rolex Loop",
    activeContractEnd: "2026-12-31",
    occupancyRate: 83,
    totalSlots: 6,
    occupiedSlots: 5,
    slots: INITIAL_SLOTS_SAMPLE,
    liveCameraUrl:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80",
    createdAt: "2025-01-10",
  },
  {
    id: "asset-dubai-mall",
    title: "Dubai Mall Grand Atrium Ultra-HD LED",
    description:
      "Ultra-luxury indoor LED spectacular positioned in the Grand Atrium of Dubai Mall. Direct eye-level line-of-sight to global high-net-worth shoppers and tourists.",
    medium: "indoor_mall_screen",
    city: "Dubai",
    country: "United Arab Emirates",
    address: "Grand Atrium Level 1, The Dubai Mall, Downtown Dubai",
    size: "8m x 4m Ultra-HD LED",
    resolution: "3840 x 1920 (4K P2.5)",
    lightingType: "Ultra-Fine Pitch P2.5 Indoor OLED (4000 nits)",
    dailyImpressions: "220,000+ daily shoppers",
    decAudit: "Ipsos UAE Audited 2026",
    pricePerMonth: 32000,
    spotRateDaily: 1200,
    currency: "AED",
    images: [
      "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&auto=format&fit=crop&q=80",
    ],
    latitude: 25.1972,
    longitude: 55.2744,
    available: true,
    secondHand: false,
    featured: true,
    maintenance: false,
    minimumFlight: "1 Month",
    views: 6420,
    inquiriesCount: 19,
    totalRevenueEarned: 89000,
    currentAdvertiser: "Cartier Haute Joaillerie",
    activeContractEnd: "2026-11-30",
    occupancyRate: 100,
    totalSlots: 4,
    occupiedSlots: 4,
    liveCameraUrl:
      "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=800&auto=format&fit=crop&q=80",
    createdAt: "2025-02-14",
  },
  {
    id: "asset-london-oxford",
    title: "London Underground Oxford Circus Digital Ribbons",
    description:
      "High-impact synchronized commuter ribbon screens reaching fashion shoppers, business leaders, and tourists navigating the UK's busiest shopping interchange.",
    medium: "transit",
    city: "London",
    country: "United Kingdom",
    address: "Oxford Circus Station Concourse, London W1B 3AG",
    size: "16-Screen Synchronized Array",
    resolution: "1080p HD Network",
    lightingType: "Anti-Glare IPS Digital Display (2500 nits)",
    dailyImpressions: "180,000+ commuters",
    decAudit: "Route UK Transport Verified",
    pricePerMonth: 9400,
    spotRateDaily: 350,
    currency: "GBP",
    images: [
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=1200&auto=format&fit=crop&q=80",
    ],
    latitude: 51.5152,
    longitude: -0.1419,
    available: true,
    secondHand: false,
    featured: true,
    maintenance: false,
    minimumFlight: "2 Weeks",
    views: 5120,
    inquiriesCount: 14,
    totalRevenueEarned: 48600,
    currentAdvertiser: "Burberry Spring Campaign",
    activeContractEnd: "2026-10-24",
    occupancyRate: 75,
    totalSlots: 8,
    occupiedSlots: 6,
    createdAt: "2025-03-01",
  },
  {
    id: "asset-mumbai-we-hoarding",
    title: "Bandra Western Express Highway Unipole Hoarding",
    description:
      "High-impact arterial highway hoarding located on the Western Express Highway near Bandra junction. Reaches heavy business traffic heading towards BKC and South Mumbai.",
    medium: "outdoor_hoarding",
    city: "Mumbai",
    country: "India",
    address: "Western Express Highway, Bandra East, Mumbai 400051",
    size: "40ft x 20ft (800 sq.ft)",
    resolution: "Frontlit High-Res Flex (300 DPI)",
    lightingType: "Uniform High-Flux Backlit Illumination (24/7)",
    dailyImpressions: "380,000+ daily vehicles",
    decAudit: "IOAA Traffic Audit Certified",
    pricePerMonth: 5500,
    spotRateDaily: 200,
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80",
    ],
    latitude: 19.0607,
    longitude: 72.8532,
    available: true,
    secondHand: false,
    featured: false,
    maintenance: false,
    minimumFlight: "1 Month",
    views: 4310,
    inquiriesCount: 22,
    totalRevenueEarned: 38500,
    currentAdvertiser: "HDFC Bank Corporate",
    activeContractEnd: "2026-11-10",
    occupancyRate: 100,
    totalSlots: 1,
    occupiedSlots: 1,
    createdAt: "2025-03-20",
  },
  {
    id: "asset-tokyo-shibuya",
    title: "Shibuya Crossing 3D Anamorphic LED Domination",
    description:
      "World-famous Shibuya crossing screen with cutting-edge 3D anamorphic depth simulation. Unmatched viral social media potential with extreme pedestrian density.",
    medium: "digital_screen",
    city: "Tokyo",
    country: "Japan",
    address: "1-1 Udagawacho, Shibuya City, Tokyo 150-0042",
    size: "18m x 9m 8K Curved Display",
    resolution: "7680 x 3840 (8K Ultra 120Hz)",
    lightingType: "Ultra-Bright MicroLED (10,000 Nits)",
    dailyImpressions: "650,000+ pedestrians",
    decAudit: "Dentsu Tokyo Audience Verified",
    pricePerMonth: 24000,
    spotRateDaily: 950,
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=1200&auto=format&fit=crop&q=80",
    ],
    latitude: 35.6595,
    longitude: 139.7005,
    available: true,
    secondHand: false,
    featured: true,
    maintenance: false,
    minimumFlight: "1 Month",
    views: 11200,
    inquiriesCount: 36,
    totalRevenueEarned: 96000,
    currentAdvertiser: "Sony PlayStation 5 Pro & Cyberpunk",
    activeContractEnd: "2026-12-20",
    occupancyRate: 100,
    totalSlots: 6,
    occupiedSlots: 6,
    liveCameraUrl:
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80",
    createdAt: "2025-04-05",
  },
  {
    id: "asset-milan-duomo",
    title: "Milan Piazza del Duomo Luxury Facade Wrap",
    description:
      "Historic fashion district facade mega-banner facing the Duomo cathedral. Premium target for luxury fashion houses, automotive brands, and international travelers.",
    medium: "outdoor_hoarding",
    city: "Milan",
    country: "Italy",
    address: "Piazza del Duomo, 20122 Milano MI",
    size: "24m x 14m Mega Format (336 sq.m)",
    resolution: "Fine Architectural Mesh Flex",
    lightingType: "Precision Architectural Spotlights (Night Warm White)",
    dailyImpressions: "160,000+ fashion & tourist footfall",
    decAudit: "AudiOutdoor Italy Audited",
    pricePerMonth: 16500,
    spotRateDaily: 600,
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=1200&auto=format&fit=crop&q=80",
    ],
    latitude: 45.4642,
    longitude: 9.19,
    available: false,
    secondHand: false,
    featured: false,
    maintenance: false,
    minimumFlight: "1 Month",
    views: 3950,
    inquiriesCount: 16,
    totalRevenueEarned: 49500,
    currentAdvertiser: "Gucci Ancora Fashion Week",
    activeContractEnd: "2026-10-18",
    occupancyRate: 100,
    totalSlots: 1,
    occupiedSlots: 1,
    createdAt: "2025-04-18",
  },
  {
    id: "asset-changi-airport",
    title: "Singapore Changi Airport Terminal 3 Panoramic LED",
    description:
      "Seamless panoramic digital wall located at Terminal 3 international departure transit hall. Reaches affluent international travelers with long dwell times.",
    medium: "airport",
    city: "Singapore",
    country: "Singapore",
    address: "Terminal 3 Departure Concourse, Changi Airport, Singapore",
    size: "20m x 3.5m Panoramic Curve",
    resolution: "5120 x 896 Wide Aspect",
    lightingType: "Fine Pitch LED (3000 nits, flicker-free)",
    dailyImpressions: "95,000+ premium international flyers",
    decAudit: "Changi Airport Group Verified",
    pricePerMonth: 14000,
    spotRateDaily: 500,
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&auto=format&fit=crop&q=80",
    ],
    latitude: 1.3644,
    longitude: 103.9915,
    available: true,
    secondHand: false,
    featured: true,
    maintenance: false,
    minimumFlight: "2 Weeks",
    views: 4890,
    inquiriesCount: 12,
    totalRevenueEarned: 42000,
    currentAdvertiser: "DBS Private Banking",
    activeContractEnd: "2026-11-05",
    occupancyRate: 85,
    totalSlots: 6,
    occupiedSlots: 5,
    createdAt: "2025-05-10",
  },
  {
    id: "asset-chicago-led-truck",
    title: "Chicago Loop Mobile 3-Sided 4K LED Campaign Fleet",
    description:
      "High-mobility LED advertising truck with hydraulic lifting screens. Navigates Michigan Avenue, Fulton Market, and Soldier Field during major sports games and events.",
    medium: "led_truck",
    city: "Chicago",
    country: "United States",
    address: "The Loop & Michigan Ave, Chicago, IL 60601",
    size: "Triple-Sided 16ft x 8ft Truck Displays",
    resolution: "1920 x 1080 Full HD",
    lightingType: "Weatherproof Outdoor High-Lumen LED",
    dailyImpressions: "110,000+ street-level eyes",
    decAudit: "GPS Route & Geo-Impression Logged",
    pricePerMonth: 7800,
    spotRateDaily: 320,
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80",
    ],
    latitude: 41.8781,
    longitude: -87.6298,
    available: true,
    secondHand: false,
    featured: false,
    maintenance: false,
    minimumFlight: "1 Week",
    views: 2840,
    inquiriesCount: 9,
    totalRevenueEarned: 23400,
    currentAdvertiser: "Red Bull Energy F1 Pop-up",
    activeContractEnd: "2026-10-12",
    occupancyRate: 70,
    totalSlots: 4,
    occupiedSlots: 3,
    createdAt: "2025-06-01",
  },
];

export const INITIAL_BOOKINGS: BookingRecord[] = [
  {
    id: "bkg-101",
    assetId: "asset-ts-broadway",
    assetTitle: "Times Square Broadway 4K Curved Spectacular",
    medium: "digital_screen",
    advertiser: "Nike Global Communications",
    agency: "Wieden+Kennedy Media",
    startDate: "2026-09-01",
    endDate: "2026-11-30",
    totalAmount: 55500,
    currency: "USD",
    status: "in_flight",
    escrowStatus: "held",
    popStatus: "verified",
    impressionsDelivered: 12400000,
    createdAt: "2026-08-20",
  },
  {
    id: "bkg-102",
    assetId: "asset-dubai-mall",
    assetTitle: "Dubai Mall Grand Atrium Ultra-HD LED",
    medium: "indoor_mall_screen",
    advertiser: "Cartier Haute Joaillerie",
    agency: "Publicis Media Middle East",
    startDate: "2026-08-15",
    endDate: "2026-11-15",
    totalAmount: 96000,
    currency: "AED",
    status: "in_flight",
    escrowStatus: "held",
    popStatus: "verified",
    impressionsDelivered: 19800000,
    createdAt: "2026-08-01",
  },
  {
    id: "bkg-103",
    assetId: "asset-tokyo-shibuya",
    assetTitle: "Shibuya Crossing 3D Anamorphic LED Domination",
    medium: "digital_screen",
    advertiser: "Sony Interactive Entertainment",
    agency: "Dentsu Inc.",
    startDate: "2026-09-10",
    endDate: "2026-12-10",
    totalAmount: 72000,
    currency: "USD",
    status: "in_flight",
    escrowStatus: "held",
    popStatus: "verified",
    impressionsDelivered: 18500000,
    createdAt: "2026-08-25",
  },
  {
    id: "bkg-104",
    assetId: "asset-london-oxford",
    assetTitle: "London Underground Oxford Circus Digital Ribbons",
    medium: "transit",
    advertiser: "Burberry Group PLC",
    agency: "OMD UK",
    startDate: "2026-08-01",
    endDate: "2026-10-15",
    totalAmount: 23500,
    currency: "GBP",
    status: "in_flight",
    escrowStatus: "held",
    popStatus: "verified",
    impressionsDelivered: 7200000,
    createdAt: "2026-07-22",
  },
  {
    id: "bkg-105",
    assetId: "asset-mumbai-we-hoarding",
    assetTitle: "Bandra Western Express Highway Unipole Hoarding",
    medium: "outdoor_hoarding",
    advertiser: "HDFC Bank Private Wealth",
    agency: "Madison Media",
    startDate: "2026-07-01",
    endDate: "2026-09-30",
    totalAmount: 16500,
    currency: "USD",
    status: "completed",
    escrowStatus: "released",
    popStatus: "verified",
    impressionsDelivered: 34200000,
    createdAt: "2026-06-15",
  },
  {
    id: "bkg-106",
    assetId: "asset-milan-duomo",
    assetTitle: "Milan Piazza del Duomo Luxury Facade Wrap",
    medium: "outdoor_hoarding",
    advertiser: "Gucci Group",
    agency: "Havas Media Italy",
    startDate: "2026-09-01",
    endDate: "2026-10-18",
    totalAmount: 24750,
    currency: "USD",
    status: "in_flight",
    escrowStatus: "held",
    popStatus: "verified",
    impressionsDelivered: 8900000,
    createdAt: "2026-08-18",
  },
];

export const INITIAL_PROPOSALS: ProposalRecord[] = [
  {
    id: "prop-401",
    proposalNumber: "RFP-2026-088",
    clientName: "Elena Rostova",
    clientCompany: "BMW Group North America",
    clientEmail: "elena.rostova@bmwgroup.com",
    items: [
      {
        assetId: "asset-ts-broadway",
        title: "Times Square Broadway 4K Curved Spectacular",
        medium: "digital_screen",
        city: "New York",
        monthlyRate: 18500,
        months: 2,
        total: 37000,
      },
      {
        assetId: "asset-chicago-led-truck",
        title: "Chicago Loop Mobile 3-Sided 4K LED Campaign Fleet",
        medium: "led_truck",
        city: "Chicago",
        monthlyRate: 7800,
        months: 2,
        total: 15600,
      },
    ],
    subtotal: 52600,
    agencyDiscountPct: 10,
    productionCost: 1200,
    totalAmount: 48540,
    currency: "USD",
    status: "sent",
    validUntil: "2026-10-25",
    notes:
      "Includes peak morning and evening daypart synchronization, high-res 4K video transcoding, and real-time live webcam proof of play verification.",
    createdAt: "2026-09-24",
  },
  {
    id: "prop-402",
    proposalNumber: "RFP-2026-082",
    clientName: "David Miller",
    clientCompany: "Omnicom Media / PepsiCo",
    clientEmail: "d.miller@omnicom.com",
    items: [
      {
        assetId: "asset-london-oxford",
        title: "London Underground Oxford Circus Digital Ribbons",
        medium: "transit",
        city: "London",
        monthlyRate: 9400,
        months: 3,
        total: 28200,
      },
    ],
    subtotal: 28200,
    agencyDiscountPct: 15,
    productionCost: 800,
    totalAmount: 24770,
    currency: "GBP",
    status: "accepted",
    validUntil: "2026-10-15",
    notes: "Accepted by client. Awaiting flight material upload & escrow funding.",
    createdAt: "2026-09-15",
  },
];

export const INITIAL_POP: ProofOfPlayRecord[] = [
  {
    id: "pop-001",
    assetId: "asset-ts-broadway",
    assetTitle: "Times Square Broadway 4K Curved Spectacular",
    advertiser: "Nike Running Global",
    timestamp: "2026-09-26 14:15:32 EST",
    imageUrl:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1000&auto=format&fit=crop&q=80",
    cameraName: "TimesSquare-Cam-01-PTZ (North Facing)",
    compliancePct: 100,
    verifiedBy: "AI Vision & Geopath Sensor",
    gpsVerified: true,
  },
  {
    id: "pop-002",
    assetId: "asset-dubai-mall",
    assetTitle: "Dubai Mall Grand Atrium Ultra-HD LED",
    advertiser: "Cartier Haute Joaillerie",
    timestamp: "2026-09-26 18:40:11 GST",
    imageUrl:
      "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=1000&auto=format&fit=crop&q=80",
    cameraName: "DubaiMall-Atrium-Fixed-Cam04",
    compliancePct: 99.8,
    verifiedBy: "Emaar Media Control Center",
    gpsVerified: true,
  },
  {
    id: "pop-003",
    assetId: "asset-tokyo-shibuya",
    assetTitle: "Shibuya Crossing 3D Anamorphic LED Domination",
    advertiser: "Sony PlayStation 5 Pro",
    timestamp: "2026-09-26 21:05:00 JST",
    imageUrl:
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1000&auto=format&fit=crop&q=80",
    cameraName: "Shibuya-Crossing-Webcam-4K",
    compliancePct: 100,
    verifiedBy: "Shibuya DOOH Network Broadcast Engine",
    gpsVerified: true,
  },
];

export const INITIAL_PAYOUTS: PayoutTransaction[] = [
  {
    id: "pay-901",
    date: "2026-09-15",
    amount: 38500,
    currency: "USD",
    method: "bank_wire",
    accountReference: "Chase Commercial •••• 9812",
    status: "completed",
    invoiceNumber: "INV-2026-09-001",
  },
  {
    id: "pay-902",
    date: "2026-08-15",
    amount: 42200,
    currency: "USD",
    method: "stripe_connect",
    accountReference: "Stripe Connect •••• 4402",
    status: "completed",
    invoiceNumber: "INV-2026-08-002",
  },
  {
    id: "pay-903",
    date: "2026-07-15",
    amount: 34000,
    currency: "USD",
    method: "bank_wire",
    accountReference: "Chase Commercial •••• 9812",
    status: "completed",
    invoiceNumber: "INV-2026-07-001",
  },
];

// Helper to safely read from localStorage
function getLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, val: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(val));
    window.dispatchEvent(new Event("markatads_seller_sync"));
  } catch (e) {
    console.error("Storage error:", e);
  }
}

export const sellerStore = {
  getAssets(): MediaAsset[] {
    return getLocal<MediaAsset[]>(STORAGE_KEYS.ASSETS, INITIAL_ASSETS);
  },
  saveAssets(assets: MediaAsset[]): void {
    setLocal(STORAGE_KEYS.ASSETS, assets);
  },
  addAsset(
    asset: Omit<MediaAsset, "id" | "createdAt" | "views" | "inquiriesCount" | "totalRevenueEarned">,
  ): MediaAsset {
    const assets = this.getAssets();
    const newAsset: MediaAsset = {
      ...asset,
      id: `asset-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      views: 12,
      inquiriesCount: 0,
      totalRevenueEarned: 0,
      createdAt: new Date().toISOString().split("T")[0],
      occupancyRate: asset.occupancyRate ?? (asset.available ? 0 : 100),
    };
    assets.unshift(newAsset);
    this.saveAssets(assets);
    return newAsset;
  },
  updateAsset(id: string, patch: Partial<MediaAsset>): void {
    const assets = this.getAssets().map((a) => (a.id === id ? { ...a, ...patch } : a));
    this.saveAssets(assets);
  },
  deleteAsset(id: string): void {
    const assets = this.getAssets().filter((a) => a.id !== id);
    this.saveAssets(assets);
  },
  duplicateAsset(id: string): MediaAsset | null {
    const assets = this.getAssets();
    const target = assets.find((a) => a.id === id);
    if (!target) return null;
    const duplicated: MediaAsset = {
      ...target,
      id: `asset-${Date.now()}`,
      title: `${target.title} (Copy)`,
      views: 0,
      inquiriesCount: 0,
      totalRevenueEarned: 0,
      available: true,
      currentAdvertiser: undefined,
      activeContractEnd: undefined,
      createdAt: new Date().toISOString().split("T")[0],
    };
    assets.unshift(duplicated);
    this.saveAssets(assets);
    return duplicated;
  },

  // Bookings
  getBookings(): BookingRecord[] {
    return getLocal<BookingRecord[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
  },
  saveBookings(bookings: BookingRecord[]): void {
    setLocal(STORAGE_KEYS.BOOKINGS, bookings);
  },
  addBooking(booking: Omit<BookingRecord, "id" | "createdAt">): BookingRecord {
    const bookings = this.getBookings();
    const newBooking: BookingRecord = {
      ...booking,
      id: `bkg-${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
    };
    bookings.unshift(newBooking);
    this.saveBookings(bookings);
    return newBooking;
  },

  // Proposals
  getProposals(): ProposalRecord[] {
    return getLocal<ProposalRecord[]>(STORAGE_KEYS.PROPOSALS, INITIAL_PROPOSALS);
  },
  saveProposals(proposals: ProposalRecord[]): void {
    setLocal(STORAGE_KEYS.PROPOSALS, proposals);
  },
  addProposal(proposal: Omit<ProposalRecord, "id" | "createdAt">): ProposalRecord {
    const proposals = this.getProposals();
    const newProposal: ProposalRecord = {
      ...proposal,
      id: `prop-${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
    };
    proposals.unshift(newProposal);
    this.saveProposals(proposals);
    return newProposal;
  },
  updateProposalStatus(id: string, status: ProposalRecord["status"]): void {
    const proposals = this.getProposals().map((p) => (p.id === id ? { ...p, status } : p));
    this.saveProposals(proposals);
  },

  // Proof of Play
  getPoP(): ProofOfPlayRecord[] {
    return getLocal<ProofOfPlayRecord[]>(STORAGE_KEYS.POP, INITIAL_POP);
  },
  addPoP(record: Omit<ProofOfPlayRecord, "id">): ProofOfPlayRecord {
    const items = this.getPoP();
    const newItem: ProofOfPlayRecord = {
      ...record,
      id: `pop-${Date.now()}`,
    };
    items.unshift(newItem);
    setLocal(STORAGE_KEYS.POP, items);
    return newItem;
  },

  // Payouts
  getPayouts(): PayoutTransaction[] {
    return getLocal<PayoutTransaction[]>(STORAGE_KEYS.PAYOUTS, INITIAL_PAYOUTS);
  },
  requestPayout(
    amount: number,
    method: PayoutTransaction["method"],
    ref: string,
  ): PayoutTransaction {
    const payouts = this.getPayouts();
    const newTx: PayoutTransaction = {
      id: `pay-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      amount,
      currency: "USD",
      method,
      accountReference: ref,
      status: "processing",
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(payouts.length + 1).padStart(3, "0")}`,
    };
    payouts.unshift(newTx);
    setLocal(STORAGE_KEYS.PAYOUTS, payouts);
    return newTx;
  },

  // Reset demo
  resetToDemoFleet(): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(INITIAL_ASSETS));
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
    localStorage.setItem(STORAGE_KEYS.PROPOSALS, JSON.stringify(INITIAL_PROPOSALS));
    localStorage.setItem(STORAGE_KEYS.POP, JSON.stringify(INITIAL_POP));
    localStorage.setItem(STORAGE_KEYS.PAYOUTS, JSON.stringify(INITIAL_PAYOUTS));
    window.dispatchEvent(new Event("markatads_seller_sync"));
  },
};
