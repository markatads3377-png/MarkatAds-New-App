import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Listing,
  Role,
  CurrencyCode,
  CurrencyRate,
  AddonServices,
  CartMediaItem,
  PlacedOrder,
  ProposalRecord,
  ProofOfPlayRecord,
  PayoutTransaction,
  FeedPost,
  FeedComment,
  CoinPerk,
} from '../types';
import { MOCK_CATALOG } from '../data/mockCatalog';

export const CURRENCIES: Record<CurrencyCode, CurrencyRate> = {
  USD: { code: 'USD', symbol: '$', rateAgainstUSD: 1, name: 'US Dollar ($)' },
  EUR: { code: 'EUR', symbol: '€', rateAgainstUSD: 0.92, name: 'Euro (€)' },
  GBP: { code: 'GBP', symbol: '£', rateAgainstUSD: 0.79, name: 'British Pound (£)' },
  AED: { code: 'AED', symbol: 'AED ', rateAgainstUSD: 3.67, name: 'UAE Dirham (AED)' },
  INR: { code: 'INR', symbol: '₹', rateAgainstUSD: 83.5, name: 'Indian Rupee (₹)' },
};

export const AVAILABLE_PERKS: CoinPerk[] = [
  {
    id: 'voucher-25',
    name: '$25 Campaign Flight Credit',
    cost: 150,
    discountValue: 25,
    description: 'Instant $25 deduction on your next billboard or DOOH booking checkout.',
    code: 'OOHCOIN25',
    badge: 'Most Popular',
  },
  {
    id: 'voucher-50',
    name: '$50 Enterprise Flight Credit',
    cost: 300,
    discountValue: 50,
    description: 'Get $50 off any prime arterial highway or airport spectacular booking.',
    code: 'OOHCOIN50',
    badge: 'Great Value',
  },
  {
    id: 'voucher-100',
    name: '$100 High-Impact Flight Credit',
    cost: 550,
    discountValue: 100,
    description: 'Maximum discount applied to any multi-week digital or static OOH flight.',
    code: 'OOHCOIN100',
    badge: 'VIP Exclusive',
  },
  {
    id: 'spotter-vip',
    name: 'Verified OOH Scout VIP Badge',
    cost: 100,
    discountValue: 0,
    description: 'Unlocks an iridescent Verified Media Scout badge on your profile and sightings.',
    code: 'SCOUT_VIP',
    badge: 'Profile Status',
  },
  {
    id: 'drone-audit',
    name: 'Free Drone Proof-of-Play Audit',
    cost: 250,
    discountValue: 40,
    description: 'Get certified 4K drone photography and third-party inspection for your live OOH campaign.',
    code: 'DRONE_FREE',
    badge: 'Service Perk',
  },
];

export const INITIAL_ORDERS: PlacedOrder[] = [
  {
    id: 'ORD-9418-MKT',
    createdAt: '2026-09-24T12:00:00.000Z',
    items: [
      {
        id: 'item-1',
        listing: MOCK_CATALOG[0],
        durationMonths: 2,
        startDate: '2026-10-01',
        addons: { printing: true, creativeDesign: false, proofOfPlay: true, stormInsurance: true },
      },
    ],
    subtotal: 15000,
    discountAmount: 1500,
    addonsTotal: 699,
    taxAmount: 709,
    totalAmount: 14908,
    currency: 'USD',
    paymentMethod: 'Corporate Wire Transfer (ACH Escrow)',
    advertiserName: 'Alex Morgan',
    advertiserEmail: 'alex.morgan@brandglobal.com',
    companyName: 'Apex Global Retail Inc',
    status: 'Live on Air',
    artworkUploaded: true,
    artworkUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
    flightStartDate: '2026-10-01',
    flightEndDate: '2026-11-30',
  },
  {
    id: 'ORD-8812-MKT',
    createdAt: '2026-09-22T09:15:00Z',
    items: [
      {
        id: 'item-2',
        listing: MOCK_CATALOG[1],
        durationMonths: 1,
        startDate: '2026-10-15',
        addons: { printing: false, creativeDesign: true, proofOfPlay: true, stormInsurance: false },
      },
    ],
    subtotal: 18500,
    discountAmount: 0,
    addonsTotal: 400,
    taxAmount: 945,
    totalAmount: 19845,
    currency: 'USD',
    paymentMethod: 'Business Credit Card (Stripe)',
    advertiserName: 'David Miller',
    advertiserEmail: 'd.miller@omnicom.com',
    companyName: 'Omnicom Media',
    status: 'Creative Review',
    artworkUploaded: false,
    flightStartDate: '2026-10-15',
    flightEndDate: '2026-11-15',
  },
];

export const INITIAL_PROPOSALS: ProposalRecord[] = [
  {
    id: 'prop-401',
    proposalNumber: 'RFP-2026-088',
    clientName: 'Elena Rostova',
    clientCompany: 'BMW Group North America',
    clientEmail: 'elena.rostova@bmwgroup.com',
    items: [
      {
        assetId: 'sheikh-zayed-digital',
        title: 'Sheikh Zayed Road Digital Spectacular',
        medium: 'digital_screen',
        city: 'Dubai',
        monthlyRate: 7500,
        months: 2,
        total: 15000,
      },
      {
        assetId: 'times-square-broadway',
        title: 'Times Square Broadway 4K Curved Spectacular',
        medium: 'digital_screen',
        city: 'New York',
        monthlyRate: 18500,
        months: 2,
        total: 37000,
      },
    ],
    subtotal: 52000,
    agencyDiscountPct: 10,
    productionCost: 1200,
    totalAmount: 48000,
    currency: 'USD',
    status: 'sent',
    validUntil: '2026-10-25',
    notes: 'Includes peak dayparting synchronization, 4K video transcoding, and real-time live webcam proof of play verification.',
    createdAt: '2026-09-24',
  },
  {
    id: 'prop-402',
    proposalNumber: 'RFP-2026-082',
    clientName: 'Sarah Jenkins',
    clientCompany: 'Acme Global Brands',
    clientEmail: 's.jenkins@acmecorp.com',
    items: [
      {
        assetId: 'london-oxford-circus',
        title: 'London Underground Oxford Circus Digital Ribbons',
        medium: 'transit',
        city: 'London',
        monthlyRate: 9400,
        months: 3,
        total: 28200,
      },
    ],
    subtotal: 28200,
    agencyDiscountPct: 15,
    productionCost: 800,
    totalAmount: 24770,
    currency: 'GBP',
    status: 'accepted',
    validUntil: '2026-10-15',
    notes: 'Accepted by client. Awaiting flight material upload & escrow funding.',
    createdAt: '2026-09-15',
  },
];

export const INITIAL_POP_RECORDS: ProofOfPlayRecord[] = [
  {
    id: 'pop-001',
    assetId: 'sheikh-zayed-digital',
    assetTitle: 'Sheikh Zayed Road Digital Spectacular',
    advertiser: 'Emirates Aviation Global',
    timestamp: 'Live Today 14:15:32 GST',
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1000&auto=format&fit=crop&q=80',
    cameraName: 'SZR-Interchange-PTZ-Cam01',
    compliancePct: 100,
    verifiedBy: 'AI Vision & Dubai RTA Telemetry Sensor',
    gpsVerified: true,
  },
  {
    id: 'pop-002',
    assetId: 'times-square-broadway',
    assetTitle: 'Times Square Broadway 4K Curved Spectacular',
    advertiser: 'Sony PlayStation 5 Pro',
    timestamp: 'Live Today 18:40:11 EST',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1000&auto=format&fit=crop&q=80',
    cameraName: 'TimesSquare-North-Cam04',
    compliancePct: 99.8,
    verifiedBy: 'Geopath Sensor & Field Inspector #284',
    gpsVerified: true,
  },
  {
    id: 'pop-003',
    assetId: 'dubai-mall-atrium',
    assetTitle: 'Dubai Mall Grand Atrium Ultra-HD LED',
    advertiser: 'Cartier Haute Joaillerie',
    timestamp: 'Live Today 20:05:00 GST',
    imageUrl: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=1000&auto=format&fit=crop&q=80',
    cameraName: 'DubaiMall-Atrium-Fixed-Cam04',
    compliancePct: 100,
    verifiedBy: 'Emaar Media Network Automated Log',
    gpsVerified: true,
  },
];

export const INITIAL_PAYOUTS: PayoutTransaction[] = [
  {
    id: 'pay-901',
    date: '2026-09-15',
    amount: 38500,
    currency: 'USD',
    method: 'bank_wire',
    accountReference: 'Chase Commercial •••• 9812',
    status: 'completed',
    invoiceNumber: 'INV-2026-09-001',
  },
  {
    id: 'pay-902',
    date: '2026-08-15',
    amount: 42200,
    currency: 'USD',
    method: 'stripe_connect',
    accountReference: 'Stripe Connect •••• 4402',
    status: 'completed',
    invoiceNumber: 'INV-2026-08-002',
  },
];

interface AppContextType {
  // Active User / Role
  role: Role;
  setRole: (r: Role) => void;
  username: string;
  setUsername: (u: string) => void;
  displayName: string;
  setDisplayName: (n: string) => void;
  company: string;
  setCompany: (c: string) => void;

  // Active View / Page
  currentView: 'home' | 'browse' | 'buyer' | 'seller' | 'admin' | 'feed' | 'pricing' | 'deployment';
  setCurrentView: (view: 'home' | 'browse' | 'buyer' | 'seller' | 'admin' | 'feed' | 'pricing' | 'deployment') => void;

  // Currency
  selectedCurrency: CurrencyCode;
  setSelectedCurrency: (c: CurrencyCode) => void;
  convertPrice: (amount: number, fromCurrency?: string) => number;
  formatMoney: (amount: number, originalCurrency?: string) => string;

  // Catalog
  catalog: Listing[];
  addListing: (listing: Omit<Listing, 'id' | 'createdAt'>) => Listing;
  updateListing: (id: string, patch: Partial<Listing>) => void;
  deleteListing: (id: string) => void;
  toggleFeatureListing: (id: string) => void;
  toggleAvailableListing: (id: string) => void;

  // Cart
  cart: CartMediaItem[];
  addToCart: (listing: Listing, durationMonths?: number, startDate?: string, addons?: Partial<AddonServices>) => void;
  removeFromCart: (itemId: string) => void;
  updateCartDuration: (itemId: string, months: number) => void;
  updateCartStartDate: (itemId: string, date: string) => void;
  toggleCartAddon: (itemId: string, addonKey: keyof AddonServices) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartAddonsTotal: number;
  cartDiscount: number;
  cartFinalTotal: number;
  appliedCoupon: string | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (listingId: string) => void;
  isWishlisted: (listingId: string) => boolean;

  // Compare
  compareList: Listing[];
  toggleCompare: (listing: Listing) => void;
  isCompared: (listingId: string) => boolean;
  clearCompare: () => void;

  // Orders
  orders: PlacedOrder[];
  placeOrder: (payload: Omit<PlacedOrder, 'id' | 'createdAt' | 'status'>) => PlacedOrder;
  uploadArtworkForOrder: (orderId: string, url: string) => void;
  updateOrderStatus: (orderId: string, status: PlacedOrder['status']) => void;

  // Modals & Drawers
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  isCompareOpen: boolean;
  setIsCompareOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isOrdersOpen: boolean;
  setIsOrdersOpen: (open: boolean) => void;
  isDeployModalOpen: boolean;
  setIsDeployModalOpen: (open: boolean) => void;
  selectedListingForDetail: Listing | null;
  setSelectedListingForDetail: (listing: Listing | null) => void;
  instantCheckoutItem: CartMediaItem | null;
  setInstantCheckoutItem: (item: CartMediaItem | null) => void;

  // Proposals & Quotes
  proposals: ProposalRecord[];
  addProposal: (proposal: Omit<ProposalRecord, 'id' | 'createdAt'>) => ProposalRecord;
  updateProposalStatus: (id: string, status: ProposalRecord['status']) => void;

  // PoP Records
  popRecords: ProofOfPlayRecord[];
  addPoPRecord: (record: Omit<ProofOfPlayRecord, 'id'>) => ProofOfPlayRecord;

  // Payouts
  payouts: PayoutTransaction[];
  requestPayout: (amount: number, method: PayoutTransaction['method'], ref: string) => PayoutTransaction;

  // Spotter Coins
  userCoins: number;
  redeemedPerks: string[];
  redeemPerk: (perk: CoinPerk) => boolean;
  claimDailyReward: () => boolean;
  canClaimDaily: boolean;

  // Admin Controls
  platformTakeRate: number;
  setPlatformTakeRate: (r: number) => void;
  maintenanceMode: boolean;
  setMaintenanceMode: (m: boolean) => void;
  announcementText: string;
  setAnnouncementText: (t: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Session
  const [role, setRole] = useState<Role>('buyer');
  const [username, setUsername] = useState('markatads_buyer');
  const [displayName, setDisplayName] = useState('Mark@Ads Partner');
  const [company, setCompany] = useState('Apex Global Brands');
  const [currentView, setCurrentView] = useState<'home' | 'browse' | 'buyer' | 'seller' | 'admin' | 'feed' | 'pricing' | 'deployment'>('home');

  // Currency
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('USD');

  // Catalog
  const [catalog, setCatalog] = useState<Listing[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('markatads_catalog_v3');
        if (stored) return JSON.parse(stored);
      } catch {
        // ignore
      }
    }
    return MOCK_CATALOG;
  });

  // Cart & Orders
  const [cart, setCart] = useState<CartMediaItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>(['sheikh-zayed-digital', 'dubai-mall-atrium']);
  const [compareList, setCompareList] = useState<Listing[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [orders, setOrders] = useState<PlacedOrder[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('markatads_orders_v3');
        if (stored) return JSON.parse(stored);
      } catch {
        // ignore
      }
    }
    return INITIAL_ORDERS;
  });

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [selectedListingForDetail, setSelectedListingForDetail] = useState<Listing | null>(null);
  const [instantCheckoutItem, setInstantCheckoutItem] = useState<CartMediaItem | null>(null);

  // Seller & Admin Hub
  const [proposals, setProposals] = useState<ProposalRecord[]>(INITIAL_PROPOSALS);
  const [popRecords, setPopRecords] = useState<ProofOfPlayRecord[]>(INITIAL_POP_RECORDS);
  const [payouts, setPayouts] = useState<PayoutTransaction[]>(INITIAL_PAYOUTS);
  const [platformTakeRate, setPlatformTakeRate] = useState<number>(8.5);
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(false);
  const [announcementText, setAnnouncementText] = useState<string>(
    'Notice: Q2 Global Premium billboard flight reservations are now live with instant escrow verification.'
  );

  // Coins & Rewards
  const [userCoins, setUserCoins] = useState<number>(350);
  const [redeemedPerks, setRedeemedPerks] = useState<string[]>([]);
  const [lastCheckin, setLastCheckin] = useState<string | null>(null);

  // Persistence
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('markatads_catalog_v3', JSON.stringify(catalog));
    }
  }, [catalog]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('markatads_orders_v3', JSON.stringify(orders));
    }
  }, [orders]);

  // Price conversion
  const convertPrice = (amount: number, fromCurrency = 'USD'): number => {
    const fromCode = (fromCurrency.toUpperCase() in CURRENCIES)
      ? (fromCurrency.toUpperCase() as CurrencyCode)
      : 'USD';
    const fromRate = CURRENCIES[fromCode].rateAgainstUSD;
    const targetRate = CURRENCIES[selectedCurrency].rateAgainstUSD;
    const amountInUSD = amount / fromRate;
    return amountInUSD * targetRate;
  };

  const formatMoney = (amount: number, originalCurrency = 'USD'): string => {
    const converted = convertPrice(amount, originalCurrency);
    const curr = CURRENCIES[selectedCurrency];
    return `${curr.symbol}${converted.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  // Cart operations
  const addToCart = (
    listing: Listing,
    durationMonths = 1,
    startDate?: string,
    addons?: Partial<AddonServices>
  ) => {
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 7);
    const dateStr = startDate || defaultDate.toISOString().split('T')[0];
    const defaultAddons: AddonServices = {
      printing: false,
      creativeDesign: false,
      proofOfPlay: true,
      stormInsurance: false,
      ...addons,
    };

    setCart((prev) => {
      const existing = prev.find((item) => item.listing.id === listing.id);
      if (existing) {
        return prev.map((item) =>
          item.listing.id === listing.id
            ? { ...item, durationMonths: item.durationMonths + durationMonths }
            : item
        );
      }
      return [
        ...prev,
        {
          id: `${listing.id}-${Date.now()}`,
          listing,
          durationMonths,
          startDate: dateStr,
          addons: defaultAddons,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((i) => i.id !== itemId));
  };

  const updateCartDuration = (itemId: string, months: number) => {
    if (months < 1) return;
    setCart((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, durationMonths: months } : i))
    );
  };

  const updateCartStartDate = (itemId: string, date: string) => {
    setCart((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, startDate: date } : i))
    );
  };

  const toggleCartAddon = (itemId: string, addonKey: keyof AddonServices) => {
    setCart((prev) =>
      prev.map((i) =>
        i.id === itemId
          ? {
              ...i,
              addons: {
                ...i.addons,
                [addonKey]: !i.addons[addonKey],
              },
            }
          : i
      )
    );
  };

  const clearCart = () => setCart([]);

  // Coupons
  const applyCoupon = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === 'SAVE10' || clean === 'MARKATADS10' || clean === 'OOHCOIN25') {
      setAppliedCoupon(clean);
      return true;
    }
    if (clean === 'MARKATADS20' || clean === 'OOHCOIN50' || clean === 'OOHCOIN100') {
      setAppliedCoupon(clean);
      return true;
    }
    return false;
  };

  const removeCoupon = () => setAppliedCoupon(null);

  // Cart Calculations
  const cartSubtotal = cart.reduce((sum, item) => {
    const raw = convertPrice(item.listing.pricePerMonth, item.listing.currency);
    return sum + raw * item.durationMonths;
  }, 0);

  const cartAddonsTotal = cart.reduce((sum, item) => {
    let add = 0;
    if (item.addons.printing) add += convertPrice(450, 'USD');
    if (item.addons.creativeDesign) add += convertPrice(250, 'USD');
    if (item.addons.proofOfPlay) add += convertPrice(150, 'USD');
    if (item.addons.stormInsurance) add += convertPrice(99, 'USD');
    return sum + add;
  }, 0);

  const couponDiscountVal = (() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon === 'MARKATADS20') return (cartSubtotal * 20) / 100;
    if (appliedCoupon === 'SAVE10' || appliedCoupon === 'MARKATADS10') return (cartSubtotal * 10) / 100;
    if (appliedCoupon === 'OOHCOIN25') return convertPrice(25, 'USD');
    if (appliedCoupon === 'OOHCOIN50') return convertPrice(50, 'USD');
    if (appliedCoupon === 'OOHCOIN100') return convertPrice(100, 'USD');
    return 0;
  })();

  const cartDiscount = Math.min(cartSubtotal, couponDiscountVal);
  const cartFinalTotal = Math.max(0, cartSubtotal - cartDiscount + cartAddonsTotal);

  // Wishlist
  const toggleWishlist = (listingId: string) => {
    setWishlist((prev) =>
      prev.includes(listingId) ? prev.filter((id) => id !== listingId) : [...prev, listingId]
    );
  };
  const isWishlisted = (listingId: string) => wishlist.includes(listingId);

  // Compare
  const toggleCompare = (listing: Listing) => {
    setCompareList((prev) => {
      const exists = prev.some((l) => l.id === listing.id);
      if (exists) return prev.filter((l) => l.id !== listing.id);
      if (prev.length >= 4) return prev;
      return [...prev, listing];
    });
  };
  const isCompared = (listingId: string) => compareList.some((l) => l.id === listingId);
  const clearCompare = () => setCompareList([]);

  // Catalog methods
  const addListing = (newListingData: Omit<Listing, 'id' | 'createdAt'>): Listing => {
    const created: Listing = {
      ...newListingData,
      id: `listing-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      totalRevenueEarned: 0,
      views: 0,
      inquiriesCount: 0,
    };
    setCatalog((prev) => [created, ...prev]);
    return created;
  };

  const updateListing = (id: string, patch: Partial<Listing>) => {
    setCatalog((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  };

  const deleteListing = (id: string) => {
    setCatalog((prev) => prev.filter((l) => l.id !== id));
  };

  const toggleFeatureListing = (id: string) => {
    setCatalog((prev) =>
      prev.map((l) => (l.id === id ? { ...l, featured: !l.featured } : l))
    );
  };

  const toggleAvailableListing = (id: string) => {
    setCatalog((prev) =>
      prev.map((l) => (l.id === id ? { ...l, available: !l.available } : l))
    );
  };

  // Orders
  const placeOrder = (payload: Omit<PlacedOrder, 'id' | 'createdAt' | 'status'>): PlacedOrder => {
    const newOrder: PlacedOrder = {
      ...payload,
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}-MKT`,
      createdAt: new Date().toISOString(),
      status: 'Creative Review',
      artworkUploaded: false,
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const uploadArtworkForOrder = (orderId: string, url: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, artworkUploaded: true, artworkUrl: url, status: 'Mounting & Prep' }
          : o
      )
    );
  };

  const updateOrderStatus = (orderId: string, status: PlacedOrder['status']) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  };

  // Proposals
  const addProposal = (prop: Omit<ProposalRecord, 'id' | 'createdAt'>): ProposalRecord => {
    const record: ProposalRecord = {
      ...prop,
      id: `prop-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setProposals((prev) => [record, ...prev]);
    return record;
  };

  const updateProposalStatus = (id: string, status: ProposalRecord['status']) => {
    setProposals((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
  };

  // PoP Records
  const addPoPRecord = (record: Omit<ProofOfPlayRecord, 'id'>): ProofOfPlayRecord => {
    const newPoP: ProofOfPlayRecord = {
      ...record,
      id: `pop-${Date.now()}`,
    };
    setPopRecords((prev) => [newPoP, ...prev]);
    return newPoP;
  };

  // Payouts
  const requestPayout = (
    amount: number,
    method: PayoutTransaction['method'],
    ref: string
  ): PayoutTransaction => {
    const tx: PayoutTransaction = {
      id: `pay-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      amount,
      currency: 'USD',
      method,
      accountReference: ref,
      status: 'processing',
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(payouts.length + 1).padStart(3, '0')}`,
    };
    setPayouts((prev) => [tx, ...prev]);
    return tx;
  };

  // Coins & Perks
  const canClaimDaily = (() => {
    if (!lastCheckin) return true;
    return new Date(lastCheckin).toDateString() !== new Date().toDateString();
  })();

  const claimDailyReward = (): boolean => {
    if (!canClaimDaily) return false;
    setUserCoins((prev) => prev + 25);
    setLastCheckin(new Date().toISOString());
    return true;
  };

  const redeemPerk = (perk: CoinPerk): boolean => {
    if (userCoins < perk.cost) return false;
    setUserCoins((prev) => prev - perk.cost);
    setRedeemedPerks((prev) => [...prev, perk.id]);
    return true;
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        username,
        setUsername,
        displayName,
        setDisplayName,
        company,
        setCompany,
        currentView,
        setCurrentView,
        selectedCurrency,
        setSelectedCurrency,
        convertPrice,
        formatMoney,
        catalog,
        addListing,
        updateListing,
        deleteListing,
        toggleFeatureListing,
        toggleAvailableListing,
        cart,
        addToCart,
        removeFromCart,
        updateCartDuration,
        updateCartStartDate,
        toggleCartAddon,
        clearCart,
        cartSubtotal,
        cartAddonsTotal,
        cartDiscount,
        cartFinalTotal,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        wishlist,
        toggleWishlist,
        isWishlisted,
        compareList,
        toggleCompare,
        isCompared,
        clearCompare,
        orders,
        placeOrder,
        uploadArtworkForOrder,
        updateOrderStatus,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isCompareOpen,
        setIsCompareOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isOrdersOpen,
        setIsOrdersOpen,
        isDeployModalOpen,
        setIsDeployModalOpen,
        selectedListingForDetail,
        setSelectedListingForDetail,
        instantCheckoutItem,
        setInstantCheckoutItem,
        proposals,
        addProposal,
        updateProposalStatus,
        popRecords,
        addPoPRecord,
        payouts,
        requestPayout,
        userCoins,
        redeemedPerks,
        redeemPerk,
        claimDailyReward,
        canClaimDaily,
        platformTakeRate,
        setPlatformTakeRate,
        maintenanceMode,
        setMaintenanceMode,
        announcementText,
        setAnnouncementText,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
