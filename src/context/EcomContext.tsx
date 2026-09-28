import React, { createContext, useContext, useState, useEffect } from "react";
import { type ExtendedListing } from "@/data/mockCatalog";
import { toast } from "sonner";

export type CurrencyCode = "USD" | "EUR" | "GBP" | "AED" | "INR";

export interface CurrencyRate {
  code: CurrencyCode;
  symbol: string;
  rateAgainstUSD: number; // 1 USD = X in currency
  name: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyRate> = {
  USD: { code: "USD", symbol: "$", rateAgainstUSD: 1, name: "US Dollar ($)" },
  EUR: { code: "EUR", symbol: "€", rateAgainstUSD: 0.92, name: "Euro (€)" },
  GBP: { code: "GBP", symbol: "£", rateAgainstUSD: 0.79, name: "British Pound (£)" },
  AED: { code: "AED", symbol: "AED ", rateAgainstUSD: 3.67, name: "UAE Dirham (AED)" },
  INR: { code: "INR", symbol: "₹", rateAgainstUSD: 83.5, name: "Indian Rupee (₹)" },
};

export interface AddonServices {
  printing: boolean; // Vinyl Printing & Mounting (+450 USD)
  creativeDesign: boolean; // Design & Resizing (+250 USD)
  proofOfPlay: boolean; // Inspection & Drone Photography (+150 USD)
  stormInsurance: boolean; // Weather & Damage Insurance (+99 USD)
}

export interface CartMediaItem {
  id: string;
  listing: ExtendedListing;
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
  status: "Booked" | "Creative Review" | "Mounting & Prep" | "Live on Air" | "Completed";
  artworkUploaded?: boolean;
  artworkUrl?: string;
  flightStartDate: string;
  flightEndDate: string;
}

interface EcomContextType {
  // Currency
  selectedCurrency: CurrencyCode;
  setSelectedCurrency: (code: CurrencyCode) => void;
  formatMoney: (amountInOriginalCurrency: number, originalCurrency?: string) => string;
  convertPrice: (amount: number, fromCurrency?: string) => number;

  // Cart
  cart: CartMediaItem[];
  addToCart: (
    listing: ExtendedListing,
    durationMonths?: number,
    startDate?: string,
    addons?: Partial<AddonServices>,
  ) => void;
  removeFromCart: (itemId: string) => void;
  updateCartDuration: (itemId: string, months: number) => void;
  updateCartStartDate: (itemId: string, date: string) => void;
  toggleCartAddon: (itemId: string, addonKey: keyof AddonServices) => void;
  clearCart: () => void;
  cartTotalCount: number;
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
  compareList: ExtendedListing[];
  toggleCompare: (listing: ExtendedListing) => void;
  isCompared: (listingId: string) => boolean;
  clearCompare: () => void;

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
  selectedListingForDetail: ExtendedListing | null;
  setSelectedListingForDetail: (listing: ExtendedListing | null) => void;

  // Direct checkout single item
  instantCheckoutItem: CartMediaItem | null;
  setInstantCheckoutItem: (item: CartMediaItem | null) => void;

  // Orders
  orders: PlacedOrder[];
  placedOrders?: PlacedOrder[];
  placeOrder: (orderPayload: Omit<PlacedOrder, "id" | "createdAt" | "status">) => PlacedOrder;
  updateOrderStatus: (orderId: string, status: PlacedOrder["status"]) => void;
  uploadArtworkForOrder: (orderId: string, fileUrl: string) => void;
}

const EcomContext = createContext<EcomContextType | undefined>(undefined);

export const EcomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>("USD");

  const [cart, setCart] = useState<CartMediaItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<ExtendedListing[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const [orders, setOrders] = useState<PlacedOrder[]>([
    {
      id: "ORD-9428-MKT",
      createdAt: "2026-09-24T12:00:00.000Z",
      items: [],
      subtotal: 32000,
      discountAmount: 3200,
      addonsTotal: 600,
      taxAmount: 1470,
      totalAmount: 30870,
      currency: "USD",
      paymentMethod: "Corporate Wire (ACH / Pro-Forma)",
      advertiserName: "Sarah Jenkins",
      advertiserEmail: "s.jenkins@acmecorp.com",
      companyName: "Acme Global Brand",
      status: "Live on Air",
      artworkUploaded: true,
      artworkUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800",
      flightStartDate: "2026-09-25",
      flightEndDate: "2026-10-25",
    },
  ]);

  const hasLoadedStorage = React.useRef(false);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("markatads_ecom_cart");
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem("markatads_ecom_wishlist");
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

      const savedOrders = localStorage.getItem("markatads_ecom_orders");
      if (savedOrders) setOrders(JSON.parse(savedOrders));
    } catch (e) {
      console.error(e);
    } finally {
      hasLoadedStorage.current = true;
    }
  }, []);

  // Modal UI States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [selectedListingForDetail, setSelectedListingForDetail] = useState<ExtendedListing | null>(
    null,
  );
  const [instantCheckoutItem, setInstantCheckoutItem] = useState<CartMediaItem | null>(null);

  useEffect(() => {
    if (hasLoadedStorage.current && typeof window !== "undefined") {
      localStorage.setItem("markatads_ecom_cart", JSON.stringify(cart));
    }
  }, [cart]);

  useEffect(() => {
    if (hasLoadedStorage.current && typeof window !== "undefined") {
      localStorage.setItem("markatads_ecom_wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist]);

  useEffect(() => {
    if (hasLoadedStorage.current && typeof window !== "undefined") {
      localStorage.setItem("markatads_ecom_orders", JSON.stringify(orders));
    }
  }, [orders]);

  // Convert any price to selected currency
  const convertPrice = (amount: number, fromCurrency = "USD"): number => {
    const fromCode =
      (fromCurrency.toUpperCase() as CurrencyCode) in CURRENCIES
        ? (fromCurrency.toUpperCase() as CurrencyCode)
        : "USD";
    const fromRate = CURRENCIES[fromCode].rateAgainstUSD;
    const targetRate = CURRENCIES[selectedCurrency].rateAgainstUSD;

    // Convert from original to USD, then USD to target
    const amountInUSD = amount / fromRate;
    return amountInUSD * targetRate;
  };

  const formatMoney = (amount: number, originalCurrency = "USD"): string => {
    const converted = convertPrice(amount, originalCurrency);
    const curr = CURRENCIES[selectedCurrency];
    return `${curr.symbol}${converted.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  // Add to cart
  const addToCart = (
    listing: ExtendedListing,
    durationMonths = 1,
    startDate?: string,
    addons?: Partial<AddonServices>,
  ) => {
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 7);
    const dateStr = startDate || defaultDate.toISOString().split("T")[0];

    const defaultAddons: AddonServices = {
      printing: false,
      creativeDesign: false,
      proofOfPlay: true, // Included / opted by default
      stormInsurance: false,
      ...addons,
    };

    setCart((prev) => {
      const existing = prev.find((item) => item.listing.id === listing.id);
      if (existing) {
        return prev.map((item) =>
          item.listing.id === listing.id
            ? { ...item, durationMonths: item.durationMonths + durationMonths }
            : item,
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

    toast.success(`"${listing.title}" added to your media cart!`);
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
    toast.info("Item removed from cart");
  };

  const updateCartDuration = (itemId: string, months: number) => {
    if (months < 1) return;
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, durationMonths: months } : item)),
    );
  };

  const updateCartStartDate = (itemId: string, date: string) => {
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, startDate: date } : item)),
    );
  };

  const toggleCartAddon = (itemId: string, addonKey: keyof AddonServices) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              addons: {
                ...item.addons,
                [addonKey]: !item.addons[addonKey],
              },
            }
          : item,
      ),
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Coupons
  const applyCoupon = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === "SAVE10" || clean === "MARKATADS10") {
      setAppliedCoupon("SAVE10");
      toast.success("Coupon applied: 10% Discount!");
      return true;
    } else if (clean === "MARKATADS20" || clean === "LAUNCHVIP") {
      setAppliedCoupon("MARKATADS20");
      toast.success("VIP Launch Coupon applied: 20% Discount!");
      return true;
    } else {
      toast.error("Invalid coupon code. Try SAVE10 or MARKATADS20");
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Pricing calculations
  const cartTotalCount = cart.reduce((sum, i) => sum + i.durationMonths, 0);

  const cartSubtotal = cart.reduce((sum, item) => {
    const rawMonthly = convertPrice(item.listing.price_per_month, item.listing.currency);
    return sum + rawMonthly * item.durationMonths;
  }, 0);

  const cartAddonsTotal = cart.reduce((sum, item) => {
    let add = 0;
    if (item.addons.printing) add += convertPrice(450, "USD");
    if (item.addons.creativeDesign) add += convertPrice(250, "USD");
    if (item.addons.proofOfPlay) add += convertPrice(150, "USD");
    if (item.addons.stormInsurance) add += convertPrice(99, "USD");
    return sum + add;
  }, 0);

  const couponPercent = appliedCoupon === "MARKATADS20" ? 20 : appliedCoupon === "SAVE10" ? 10 : 0;
  const cartDiscount = (cartSubtotal * couponPercent) / 100;
  const cartFinalTotal = Math.max(0, cartSubtotal - cartDiscount + cartAddonsTotal);

  // Wishlist
  const toggleWishlist = (listingId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(listingId);
      if (exists) {
        toast.info("Removed from saved spaces");
        return prev.filter((id) => id !== listingId);
      } else {
        toast.success("Saved to your wishlist!");
        return [...prev, listingId];
      }
    });
  };

  const isWishlisted = (listingId: string) => wishlist.includes(listingId);

  // Compare
  const toggleCompare = (listing: ExtendedListing) => {
    setCompareList((prev) => {
      const exists = prev.some((i) => i.id === listing.id);
      if (exists) {
        toast.info(`Removed "${listing.title}" from comparison`);
        return prev.filter((i) => i.id !== listing.id);
      }
      if (prev.length >= 4) {
        toast.error("You can compare up to 4 media spaces at once");
        return prev;
      }
      toast.success(`Added "${listing.title}" to compare list`);
      return [...prev, listing];
    });
  };

  const isCompared = (listingId: string) => compareList.some((i) => i.id === listingId);
  const clearCompare = () => setCompareList([]);

  // Orders
  const placeOrder = (
    orderPayload: Omit<PlacedOrder, "id" | "createdAt" | "status">,
  ): PlacedOrder => {
    const newOrder: PlacedOrder = {
      ...orderPayload,
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}-MKT`,
      createdAt: new Date().toISOString(),
      status: "Creative Review",
      artworkUploaded: false,
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: PlacedOrder["status"]) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  };

  const uploadArtworkForOrder = (orderId: string, fileUrl: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              artworkUploaded: true,
              artworkUrl: fileUrl,
              status: "Mounting & Prep",
            }
          : o,
      ),
    );
    toast.success("Creative artwork uploaded and scheduled for pre-flight mounting check!");
  };

  return (
    <EcomContext.Provider
      value={{
        selectedCurrency,
        setSelectedCurrency,
        formatMoney,
        convertPrice,
        cart,
        addToCart,
        removeFromCart,
        updateCartDuration,
        updateCartStartDate,
        toggleCartAddon,
        clearCart,
        cartTotalCount,
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
        selectedListingForDetail,
        setSelectedListingForDetail,
        instantCheckoutItem,
        setInstantCheckoutItem,
        orders,
        placedOrders: orders,
        placeOrder,
        updateOrderStatus,
        uploadArtworkForOrder,
      }}
    >
      {children}
    </EcomContext.Provider>
  );
};

export const useEcom = () => {
  const context = useContext(EcomContext);
  if (!context) {
    return {
      selectedCurrency: "USD",
      setSelectedCurrency: () => {},
      formatMoney: (amount: number, currency = "USD") => {
        const symbol =
          currency === "INR"
            ? "₹"
            : currency === "AED"
              ? "AED "
              : currency === "GBP"
                ? "£"
                : currency === "EUR"
                  ? "€"
                  : "$";
        return `${symbol}${Number(amount || 0).toLocaleString()}`;
      },
      convertPrice: (amount: number) => amount || 0,
      cart: [],
      addToCart: () => {},
      removeFromCart: () => {},
      updateCartDuration: () => {},
      updateCartStartDate: () => {},
      toggleCartAddon: () => {},
      clearCart: () => {},
      cartTotalCount: 0,
      cartSubtotal: 0,
      cartAddonsTotal: 0,
      cartDiscount: 0,
      cartFinalTotal: 0,
      appliedCoupon: null,
      applyCoupon: () => false,
      removeCoupon: () => {},
      wishlist: [],
      toggleWishlist: () => {},
      isWishlisted: () => false,
      compareList: [],
      toggleCompare: () => {},
      isCompared: () => false,
      clearCompare: () => {},
      isCartOpen: false,
      setIsCartOpen: () => {},
      isWishlistOpen: false,
      setIsWishlistOpen: () => {},
      isCompareOpen: false,
      setIsCompareOpen: () => {},
      isCheckoutOpen: false,
      setIsCheckoutOpen: () => {},
      isOrdersOpen: false,
      setIsOrdersOpen: () => {},
      selectedListingForDetail: null,
      setSelectedListingForDetail: () => {},
      instantCheckoutItem: null,
      setInstantCheckoutItem: () => {},
      orders: [],
      placedOrders: [],
      placeOrder: () => ({}) as PlacedOrder,
      updateOrderStatus: () => {},
      uploadArtworkForOrder: () => {},
    } as unknown as EcomContextType;
  }
  return context;
};
