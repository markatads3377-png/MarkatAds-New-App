import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useEcom, CartMediaItem, PlacedOrder } from "@/context/EcomContext";
import {
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Lock,
  Loader2,
  Download,
  Receipt,
  Sparkles,
  QrCode,
  Calendar,
  FileText,
  UploadCloud,
  Check,
} from "lucide-react";
import { toast } from "sonner";

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    instantCheckoutItem,
    setInstantCheckoutItem,
    cart,
    clearCart,
    cartFinalTotal,
    cartDiscount,
    cartAddonsTotal,
    selectedCurrency,
    formatMoney,
    convertPrice,
    placeOrder,
    setIsOrdersOpen,
  } = useEcom();

  const [paymentGateway, setPaymentGateway] = useState<"card" | "gpay" | "bank" | "crypto">("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<PlacedOrder | null>(null);

  // Billing Fields
  const [fullName, setFullName] = useState("Alex Morgan");
  const [email, setEmail] = useState("alex.morgan@brandglobal.com");
  const [company, setCompany] = useState("Apex Global Retail Inc");
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [expiry, setExpiry] = useState("08/29");
  const [cvc, setCvc] = useState("892");

  const checkoutItems: CartMediaItem[] = instantCheckoutItem ? [instantCheckoutItem] : cart;

  if (!isCheckoutOpen || checkoutItems.length === 0) return null;

  // Single item or cart totals
  let subtotal = 0;
  let addonsCost = 0;
  checkoutItems.forEach((item) => {
    const baseMonthly = convertPrice(item.listing.price_per_month, item.listing.currency);
    subtotal += baseMonthly * item.durationMonths;
    if (item.addons.printing) addonsCost += convertPrice(450, "USD");
    if (item.addons.creativeDesign) addonsCost += convertPrice(250, "USD");
    if (item.addons.proofOfPlay) addonsCost += convertPrice(150, "USD");
    if (item.addons.stormInsurance) addonsCost += convertPrice(99, "USD");
  });

  const discount = instantCheckoutItem
    ? (subtotal * (instantCheckoutItem.durationMonths >= 3 ? 10 : 0)) / 100
    : cartDiscount;
  const tax = (subtotal + addonsCost - discount) * 0.05; // 5% regional media tax
  const grandTotal = subtotal + addonsCost - discount + tax;

  const handleExecutePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) {
      toast.error("Please provide your advertiser and contact details");
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const firstItem = checkoutItems[0];
      const today = new Date();
      const endFlight = new Date(today);
      endFlight.setMonth(endFlight.getMonth() + (firstItem?.durationMonths || 1));

      const newOrder = placeOrder({
        items: checkoutItems,
        subtotal: subtotal,
        discountAmount: discount,
        addonsTotal: addonsCost,
        taxAmount: tax,
        totalAmount: grandTotal,
        currency: selectedCurrency,
        paymentMethod:
          paymentGateway === "card"
            ? "Credit / Debit Card (Stripe Gateway)"
            : paymentGateway === "gpay"
              ? "Google Pay / Apple Pay 1-Click"
              : paymentGateway === "bank"
                ? "Corporate Wire (ACH / SEPA Pro-Forma)"
                : "USDT / USDC Crypto Web3 Escrow",
        advertiserName: fullName,
        advertiserEmail: email,
        companyName: company,
        flightStartDate: firstItem?.startDate || today.toISOString().split("T")[0],
        flightEndDate: endFlight.toISOString().split("T")[0],
      });

      setCompletedOrder(newOrder);
      if (!instantCheckoutItem) {
        clearCart();
      }
      toast.success("Campaign booked successfully! Escrow contract locked.");
    }, 1600);
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setCompletedOrder(null);
    setInstantCheckoutItem(null);
  };

  const handlePrintReceipt = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <Dialog open={isCheckoutOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden bg-background border-border/80 shadow-2xl">
        {!completedOrder ? (
          <div>
            {/* Header */}
            <DialogHeader className="p-5 border-b border-border/60 bg-muted/30">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
                    <Lock className="w-4 h-4 text-emerald-500" /> Secure Campaign Flight Checkout
                  </DialogTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Reserving {checkoutItems.length} advertising{" "}
                    {checkoutItems.length === 1 ? "space" : "spaces"} via Mark@Ads Escrow
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-muted-foreground block">Total Flight Amount</span>
                  <span className="text-lg font-extrabold text-primary">
                    {formatMoney(grandTotal, "USD")}
                  </span>
                </div>
              </div>
            </DialogHeader>

            <form onSubmit={handleExecutePayment} className="p-5 space-y-5">
              {/* Order Summary box */}
              <div className="bg-card p-3.5 rounded-2xl border border-border/80 text-xs space-y-2 shadow-soft">
                <div className="font-semibold text-foreground flex items-center justify-between">
                  <span>Selected Spaces ({checkoutItems.length}):</span>
                  <span className="text-muted-foreground font-normal">Flight Duration</span>
                </div>
                <div className="max-h-24 overflow-y-auto space-y-1.5 pr-1">
                  {checkoutItems.map((it) => (
                    <div
                      key={it.id}
                      className="flex justify-between items-center text-muted-foreground"
                    >
                      <span className="truncate max-w-[280px] text-foreground font-medium">
                        • {it.listing.title} ({it.listing.city})
                      </span>
                      <span>
                        {it.durationMonths} month{it.durationMonths > 1 ? "s" : ""}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border/60 pt-1.5 flex justify-between text-muted-foreground font-medium">
                  <span>Flight Subtotal + Add-ons + 5% Media Tax:</span>
                  <span className="font-bold text-foreground">
                    {formatMoney(grandTotal, "USD")}
                  </span>
                </div>
              </div>

              {/* Section 1: Billing / Advertiser Info */}
              <div className="space-y-2.5">
                <div className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                  1. Advertiser & Billing Details
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">Contact Person Name</Label>
                    <Input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="h-9 text-xs bg-card"
                      placeholder="e.g. Alex Morgan"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">Business / Work Email</Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-9 text-xs bg-card"
                      placeholder="alex@company.com"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-1">
                    <Label className="text-xs font-medium">Brand / Organization Name</Label>
                    <Input
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="h-9 text-xs bg-card"
                      placeholder="Apex Global Brands Ltd."
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Gateway Selector */}
              <div className="space-y-2.5">
                <div className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                  2. Select Payment Method
                </div>

                <Tabs
                  value={paymentGateway}
                  onValueChange={(v) => setPaymentGateway(v as "card" | "gpay" | "bank" | "crypto")}
                >
                  <TabsList className="grid grid-cols-4 h-10 p-1 bg-muted/60">
                    <TabsTrigger value="card" className="text-xs flex items-center gap-1">
                      <CreditCard className="w-3.5 h-3.5" /> Card
                    </TabsTrigger>
                    <TabsTrigger value="gpay" className="text-xs flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> G-Pay
                    </TabsTrigger>
                    <TabsTrigger value="bank" className="text-xs flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" /> Wire / ACH
                    </TabsTrigger>
                    <TabsTrigger value="crypto" className="text-xs flex items-center gap-1">
                      <QrCode className="w-3.5 h-3.5" /> Crypto
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="card" className="mt-3 space-y-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Card Number</Label>
                      <Input
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="h-9 text-xs font-mono bg-card"
                        placeholder="4242 4242 4242 4242"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Expiry Date</Label>
                        <Input
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          className="h-9 text-xs font-mono bg-card"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">CVC Code</Label>
                        <Input
                          value={cvc}
                          onChange={(e) => setCvc(e.target.value)}
                          className="h-9 text-xs font-mono bg-card"
                          placeholder="CVC"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent
                    value="gpay"
                    className="mt-3 p-4 rounded-2xl bg-muted/40 text-center space-y-2 border border-border/80"
                  >
                    <div className="font-bold text-xs text-foreground">
                      1-Click Express Checkout via Google Pay / Apple Pay
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Authorizes with your saved biometric card on device with zero fee.
                    </p>
                  </TabsContent>

                  <TabsContent
                    value="bank"
                    className="mt-3 p-3.5 rounded-2xl bg-muted/40 text-xs space-y-1.5 border border-border/80"
                  >
                    <div className="font-bold text-foreground">
                      Corporate Wire Transfer / Automated Pro-Forma Invoice:
                    </div>
                    <p className="text-[11px] text-muted-foreground font-mono">
                      Beneficiary: Mark@Ads Global Media Escrow Ops
                      <br />
                      Bank: JPMorgan Chase Bank N.A. (Swift: CHASUS33)
                      <br />
                      Terms: Net-30 available for verified enterprise accounts.
                    </p>
                  </TabsContent>

                  <TabsContent
                    value="crypto"
                    className="mt-3 p-3.5 rounded-2xl bg-muted/40 text-xs space-y-1.5 border border-border/80"
                  >
                    <div className="font-bold text-foreground">Web3 Multi-Chain Crypto Escrow:</div>
                    <p className="text-[11px] text-muted-foreground">
                      Accepts USDT & USDC on Ethereum, Arbitrum, and Polygon. Instant on-chain
                      confirmation.
                    </p>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-5 text-sm flex items-center justify-center gap-2 shadow-soft"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Locking Flight & Confirming Escrow...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Pay {formatMoney(grandTotal, "USD")} & Launch Campaign</span>
                    </>
                  )}
                </Button>
                <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground mt-2 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>256-bit Bank Grade Encryption • Verified Media Owner Contract</span>
                </div>
              </div>
            </form>
          </div>
        ) : (
          /* Confirmation / Receipt View */
          <div className="p-6 sm:p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto shadow-soft">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-foreground">
                Campaign Booked & Confirmed!
              </h2>
              <p className="text-xs text-muted-foreground">
                Order ID:{" "}
                <span className="font-mono font-bold text-foreground">{completedOrder.id}</span>
              </p>
            </div>

            <div className="bg-card p-4 rounded-2xl text-left border border-border/80 text-xs space-y-2 max-w-md mx-auto shadow-soft">
              <div className="flex justify-between border-b border-border/60 pb-2 font-bold">
                <span>Total Amount Paid:</span>
                <span className="text-emerald-600 text-sm">
                  {formatMoney(completedOrder.totalAmount, "USD")}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Gateway:</span>
                <span className="text-foreground font-medium">{completedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Advertiser:</span>
                <span className="text-foreground font-medium">
                  {completedOrder.advertiserName} ({completedOrder.companyName})
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Flight Dates:</span>
                <span className="text-foreground font-medium">
                  {completedOrder.flightStartDate} → {completedOrder.flightEndDate}
                </span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              A formal Tax Invoice and Creative Upload Link have been dispatched to{" "}
              <strong>{completedOrder.advertiserEmail}</strong>.
            </p>

            <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-2">
              <Button
                type="button"
                onClick={() => {
                  handleClose();
                  setIsOrdersOpen(true);
                }}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs"
              >
                Track Live Campaign Flights →
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handlePrintReceipt}
                className="flex items-center gap-1.5 text-xs font-semibold"
              >
                <Download className="w-4 h-4" /> Download / Print PDF Receipt
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
