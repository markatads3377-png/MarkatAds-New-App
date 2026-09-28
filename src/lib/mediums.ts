export const MEDIUMS = [
  { value: "billboard", label: "Billboards" },
  { value: "digital_screen", label: "Digital screens" },
  { value: "indoor_mall_screen", label: "Indoor mall screens" },
  { value: "outdoor_hoarding", label: "Outdoor hoardings" },
  { value: "airport", label: "Airport media" },
  { value: "metro", label: "Metro media" },
  { value: "transit", label: "Bus / taxi branding" },
  { value: "shop_branding", label: "Shop branding" },
  { value: "led_truck", label: "LED trucks" },
  { value: "event_branding", label: "Event branding" },
  { value: "second_hand", label: "Second-hand media" },
] as const;

export type MediumValue = (typeof MEDIUMS)[number]["value"];

export function mediumLabel(value: string) {
  return MEDIUMS.find((m) => m.value === value)?.label ?? value;
}

export function formatPrice(amount: number, currency = "USD") {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
}

export const PLANS = [
  {
    name: "Regular",
    price: "Free",
    period: "",
    features: ["Free media listing", "Basic photo & video uploads", "Customer comments"],
  },
  {
    name: "Medium",
    price: "$8",
    period: "/month",
    highlight: true,
    features: [
      "Everything in Regular",
      "Medium analytics",
      "15GB storage",
      "WhatsApp alerts",
      "Payment facility",
      "Feature up to 3 billboards",
    ],
  },
  {
    name: "Premium",
    price: "$12",
    period: "/month",
    features: [
      "Everything in Medium",
      "Unlimited listings",
      "Full analytics + keyword tracking",
      "View customer IDs",
      "Message potential clients",
      "Unlimited featured billboards",
      "Manage customer comments",
    ],
  },
] as const;
