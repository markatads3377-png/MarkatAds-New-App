// OOH Coins Service - Manages rewards, gamification, and marketplace discounts
import { toast } from "sonner";
import { db, handleFirestoreError, OperationType, auth } from "@/integrations/firebase/client";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";

export interface CoinTransaction {
  id: string;
  userId: string;
  amount: number; // positive for earn, negative for spend
  action:
    | "post_photo"
    | "post_video"
    | "daily_checkin"
    | "spotter_bounty"
    | "comment"
    | "voucher_redeem"
    | "starter_bonus";
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

export const AVAILABLE_PERKS: CoinPerk[] = [
  {
    id: "voucher-25",
    name: "$25 Campaign Flight Credit",
    cost: 150,
    discountValue: 25,
    description: "Instant $25 deduction on your next billboard or DOOH booking checkout.",
    code: "OOHCOIN25",
    badge: "Most Popular",
  },
  {
    id: "voucher-50",
    name: "$50 Enterprise Flight Credit",
    cost: 300,
    discountValue: 50,
    description: "Get $50 off any prime arterial highway or airport spectacular booking.",
    code: "OOHCOIN50",
    badge: "Great Value",
  },
  {
    id: "voucher-100",
    name: "$100 High-Impact Flight Credit",
    cost: 550,
    discountValue: 100,
    description: "Maximum discount applied to any multi-week digital or static OOH flight.",
    code: "OOHCOIN100",
    badge: "VIP Exclusive",
  },
  {
    id: "spotter-vip",
    name: "Verified OOH Scout VIP Badge",
    cost: 100,
    discountValue: 0,
    description:
      "Unlocks an iridescent Verified Media Scout badge on your profile and all community feed posts.",
    code: "SCOUT_VIP",
    badge: "Profile Status",
  },
  {
    id: "drone-audit",
    name: "Free Drone Proof-of-Play Audit",
    cost: 250,
    discountValue: 40,
    description:
      "Get certified 4K drone photography and third-party inspection for your live OOH campaign.",
    code: "DRONE_FREE",
    badge: "Service Perk",
  },
];

const LOCAL_COINS_KEY = "markatads_user_coins";
const LOCAL_TX_KEY = "markatads_coin_transactions";
const LOCAL_CHECKIN_KEY = "markatads_last_checkin";
const LOCAL_REDEEMED_KEY = "markatads_redeemed_perks";

export function getLocalCoins(userId?: string): number {
  if (typeof window === "undefined") return 250;
  const key = userId ? `${LOCAL_COINS_KEY}_${userId}` : LOCAL_COINS_KEY;
  const stored = localStorage.getItem(key);
  if (stored !== null) {
    const val = parseInt(stored, 10);
    return isNaN(val) ? 250 : val;
  }
  // Initialize with 250 welcome coins!
  localStorage.setItem(key, "250");
  return 250;
}

export function setLocalCoins(amount: number, userId?: string): void {
  if (typeof window === "undefined") return;
  const key = userId ? `${LOCAL_COINS_KEY}_${userId}` : LOCAL_COINS_KEY;
  localStorage.setItem(key, Math.max(0, amount).toString());
  window.dispatchEvent(new Event("markatads_coins_updated"));
}

export function getLocalTransactions(userId?: string): CoinTransaction[] {
  if (typeof window === "undefined") return [];
  const key = userId ? `${LOCAL_TX_KEY}_${userId}` : LOCAL_TX_KEY;
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
  } catch {
    // fallback
  }
  const defaultTx: CoinTransaction[] = [
    {
      id: "tx-welcome",
      userId: userId || "guest",
      amount: 250,
      action: "starter_bonus",
      description: "Welcome to Mark@Ads OOH Ecosystem! Starter Spotter Grant",
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
  ];
  localStorage.setItem(key, JSON.stringify(defaultTx));
  return defaultTx;
}

export function addCoinTransaction(
  amount: number,
  action: CoinTransaction["action"],
  description: string,
  userId?: string,
): number {
  const current = getLocalCoins(userId);
  const updated = current + amount;
  setLocalCoins(updated, userId);

  const txList = getLocalTransactions(userId);
  const newTx: CoinTransaction = {
    id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    userId: userId || "current_user",
    amount,
    action,
    description,
    createdAt: new Date().toISOString(),
  };

  const nextList = [newTx, ...txList].slice(0, 50);
  const key = userId ? `${LOCAL_TX_KEY}_${userId}` : LOCAL_TX_KEY;
  localStorage.setItem(key, JSON.stringify(nextList));

  // Sync to Firestore if authenticated
  if (auth.currentUser) {
    try {
      addDoc(collection(db, "coin_transactions"), {
        id: newTx.id,
        userId: auth.currentUser.uid,
        amount: newTx.amount,
        action: newTx.action,
        description: newTx.description,
        createdAt: newTx.createdAt,
      }).catch((e) => console.debug("Firestore coin_tx sync background note:", e));
    } catch {
      // ignore
    }
  }

  return updated;
}

export function canClaimDailyCheckin(userId?: string): boolean {
  if (typeof window === "undefined") return false;
  const key = userId ? `${LOCAL_CHECKIN_KEY}_${userId}` : LOCAL_CHECKIN_KEY;
  const last = localStorage.getItem(key);
  if (!last) return true;
  const lastDate = new Date(last).toDateString();
  const today = new Date().toDateString();
  return lastDate !== today;
}

export function claimDailyCheckin(userId?: string): { success: boolean; newBalance: number } {
  if (!canClaimDailyCheckin(userId)) {
    toast.info("You've already claimed your daily spotter bonus today! Check back tomorrow.");
    return { success: false, newBalance: getLocalCoins(userId) };
  }
  const key = userId ? `${LOCAL_CHECKIN_KEY}_${userId}` : LOCAL_CHECKIN_KEY;
  localStorage.setItem(key, new Date().toISOString());
  const newBalance = addCoinTransaction(
    25,
    "daily_checkin",
    "Daily Spotter Streak Check-in (+25 Coins)",
    userId,
  );
  toast.success("🎁 Daily Spotter Bounty Claimed! +25 OOH Coins added to your wallet.");
  return { success: true, newBalance };
}

export function getRedeemedPerks(userId?: string): string[] {
  if (typeof window === "undefined") return [];
  const key = userId ? `${LOCAL_REDEEMED_KEY}_${userId}` : LOCAL_REDEEMED_KEY;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function redeemPerk(perk: CoinPerk, userId?: string): { success: boolean; message: string } {
  const current = getLocalCoins(userId);
  if (current < perk.cost) {
    return {
      success: false,
      message: `Insufficient coins. You have ${current} coins, but ${perk.name} requires ${perk.cost} coins. Post more OOH photos/videos to earn!`,
    };
  }

  addCoinTransaction(
    -perk.cost,
    "voucher_redeem",
    `Redeemed ${perk.name} (-${perk.cost} Coins)`,
    userId,
  );
  const redeemed = getRedeemedPerks(userId);
  const key = userId ? `${LOCAL_REDEEMED_KEY}_${userId}` : LOCAL_REDEEMED_KEY;
  localStorage.setItem(key, JSON.stringify([...redeemed, perk.id]));

  toast.success(`🎉 Successfully unlocked ${perk.name}! Promo Code: ${perk.code}`);
  return {
    success: true,
    message: `Perk redeemed successfully! Use code ${perk.code} in cart or checkout.`,
  };
}

export function calculateSpotterLevel(coins: number): {
  levelName: string;
  badge: string;
  color: string;
  nextTierCoins: number;
  progressPercent: number;
} {
  if (coins >= 1000) {
    return {
      levelName: "Diamond Billboard Legend",
      badge: "💎 Legend",
      color: "text-cyan-500 bg-cyan-500/10 border-cyan-500/30",
      nextTierCoins: 2000,
      progressPercent: 100,
    };
  }
  if (coins >= 500) {
    return {
      levelName: "Platinum OOH Master",
      badge: "⭐ Platinum",
      color: "text-purple-500 bg-purple-500/10 border-purple-500/30",
      nextTierCoins: 1000,
      progressPercent: Math.min(100, Math.round(((coins - 500) / 500) * 100)),
    };
  }
  if (coins >= 250) {
    return {
      levelName: "Gold Media Scout",
      badge: "🥇 Gold Scout",
      color: "text-amber-500 bg-amber-500/10 border-amber-500/30",
      nextTierCoins: 500,
      progressPercent: Math.min(100, Math.round(((coins - 250) / 250) * 100)),
    };
  }
  return {
    levelName: "Bronze Sightings Tracker",
    badge: "🥉 Bronze Scout",
    color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30",
    nextTierCoins: 250,
    progressPercent: Math.min(100, Math.round((coins / 250) * 100)),
  };
}
