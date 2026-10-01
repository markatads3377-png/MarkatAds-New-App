import React, { useState } from 'react';
import {
  X,
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Lock,
  Loader2,
  Download,
  Sparkles,
  QrCode,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CartMediaItem, PlacedOrder } from '../types';
import { toast } from 'sonner';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    instantCheckoutItem,
    setInstantCheckoutItem,
    cart,
    clearCart,
    cartDiscount,
    selectedCurrency,
    formatMoney,
    convertPrice,
    placeOrder,
    setIsOrdersOpen,
  } = useApp();

  const [paymentGateway, setPaymentGateway] = useState<'card' | 'gpay' | 'bank' | 'crypto'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<PlacedOrder | null>(null);

  // Billing Fields
  const [fullName, setFullName] = useState('Alex Morgan');
  const [email, setEmail] = useState('alex.morgan@brandglobal.com');
  const [company, setCompany] = useState('Apex Global Retail Inc');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('08/29');
  const [cvc, setCvc] = useState('892');

  const checkoutItems: CartMediaItem[] = instantCheckoutItem ? [instantCheckoutItem] : cart;

  if (!isCheckoutOpen || checkoutItems.length === 0) return null;

  // Single item or cart totals
  let subtotal = 0;
  let addonsCost = 0;
  checkoutItems.forEach((item) => {
    const baseMonthly = convertPrice(item.listing.pricePerMonth, item.listing.currency);
    subtotal += baseMonthly * item.durationMonths;
    if (item.addons.printing) addonsCost += convertPrice(450, 'USD');
    if (item.addons.creativeDesign) addonsCost += convertPrice(250, 'USD');
    if (item.addons.proofOfPlay) addonsCost += convertPrice(150, 'USD');
    if (item.addons.stormInsurance) addonsCost += convertPrice(99, 'USD');
  });

  const discount = instantCheckoutItem
    ? (subtotal * (instantCheckoutItem.durationMonths >= 3 ? 10 : 0)) / 100
    : cartDiscount;
  const tax = (subtotal + addonsCost - discount) * 0.05; // 5% regional media tax
  const grandTotal = subtotal + addonsCost - discount + tax;

  const handleExecutePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) {
      toast.error('Please provide your advertiser and contact details');
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
          paymentGateway === 'card'
            ? 'Credit / Debit Card (Stripe Gateway)'
            : paymentGateway === 'gpay'
            ? 'Google Pay / Apple Pay 1-Click'
            : paymentGateway === 'bank'
            ? 'Corporate Wire (ACH / SEPA Pro-Forma)'
            : 'USDT / USDC Crypto Web3 Escrow',
        advertiserName: fullName,
        advertiserEmail: email,
        companyName: company,
        flightStartDate: firstItem?.startDate || today.toISOString().split('T')[0],
        flightEndDate: endFlight.toISOString().split('T')[0],
      });

      setCompletedOrder(newOrder);
      if (!instantCheckoutItem) {
        clearCart();
      }
      toast.success('Campaign flight locked in Escrow! Tax invoice dispatched.');
    }, 1200);
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setCompletedOrder(null);
    setInstantCheckoutItem(null);
  };

  const handlePrintReceipt = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col border border-neutral-200 shadow-2xl overflow-hidden text-neutral-900">
        {!completedOrder ? (
          <div>
            {/* Header */}
            <div className="p-5 border-b border-neutral-100 bg-neutral-50/50 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Lock className="size-4 text-emerald-600" />
                  <h3 className="text-base font-bold font-display text-neutral-900">
                    Secure Campaign Flight Checkout
                  </h3>
                </div>
                <p className="text-xs text-neutral-500">
                  Reserving {checkoutItems.length} advertising space{checkoutItems.length > 1 ? 's' : ''} via Mark@Ads Escrow
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] text-neutral-400 block font-medium">Total Flight Amount</span>
                  <span className="text-base font-black text-[#C62828] font-display">
                    {formatMoney(grandTotal, 'USD')}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="size-8 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 grid place-items-center ml-1"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleExecutePayment} className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Order Summary box */}
              <div className="bg-neutral-50 p-3.5 rounded-2xl border border-neutral-200 text-xs space-y-2">
                <div className="font-semibold text-neutral-700 flex items-center justify-between">
                  <span>Selected Spaces ({checkoutItems.length}):</span>
                  <span className="text-neutral-400 font-normal">Flight Duration</span>
                </div>
                <div className="max-h-24 overflow-y-auto space-y-1.5 pr-1">
                  {checkoutItems.map((it) => (
                    <div key={it.id} className="flex justify-between items-center text-neutral-500">
                      <span className="truncate max-w-[280px] text-neutral-800 font-medium">
                        {it.listing.title} ({it.listing.city})
                      </span>
                      <span>
                        {it.durationMonths} month{it.durationMonths > 1 ? 's' : ''}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-neutral-200/80 pt-1.5 flex justify-between text-neutral-500 font-medium">
                  <span>Flight Subtotal + Add-ons + 5% Media Tax:</span>
                  <span className="font-bold text-neutral-900">{formatMoney(grandTotal, 'USD')}</span>
                </div>
              </div>

              {/* Section 1: Billing / Advertiser Info */}
              <div className="space-y-2.5">
                <div className="font-bold text-[11px] uppercase tracking-wider text-neutral-500">
                  1. Advertiser & Billing Details
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-700">Contact Person Name *</label>
                    <input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="w-full h-9 px-3 rounded-xl border border-neutral-200 text-xs bg-white text-neutral-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#C62828]/20 focus:border-[#C62828]"
                      placeholder="e.g. Alex Morgan"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-700">Business / Work Email *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full h-9 px-3 rounded-xl border border-neutral-200 text-xs bg-white text-neutral-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#C62828]/20 focus:border-[#C62828]"
                      placeholder="alex@company.com"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-semibold text-neutral-700">Brand / Organization Name</label>
                    <input
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-neutral-200 text-xs bg-white text-neutral-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#C62828]/20 focus:border-[#C62828]"
                      placeholder="Apex Global Retail Inc"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Gateway Selector */}
              <div className="space-y-2.5">
                <div className="font-bold text-[11px] uppercase tracking-wider text-neutral-500">
                  2. Select Payment Gateway
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'card', label: 'Credit Card', icon: CreditCard },
                    { id: 'gpay', label: 'G-Pay / Apple', icon: Sparkles },
                    { id: 'bank', label: 'Wire / ACH', icon: Building2 },
                    { id: 'crypto', label: 'Crypto Escrow', icon: QrCode },
                  ].map((gw) => {
                    const Icon = gw.icon;
                    const isSelected = paymentGateway === gw.id;
                    return (
                      <button
                        key={gw.id}
                        type="button"
                        onClick={() => setPaymentGateway(gw.id as 'card' | 'gpay' | 'bank' | 'crypto')}
                        className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                          isSelected
                            ? 'bg-[#C62828] text-white border-[#C62828] shadow-2xs font-bold'
                            : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <Icon className="size-4" />
                        <span className="text-[11px]">{gw.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Gateway Detail Panels */}
                {paymentGateway === 'card' && (
                  <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3 text-xs">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-neutral-700">Card Number</label>
                      <input
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full h-9 px-3 rounded-xl border border-neutral-200 text-xs font-mono bg-white text-neutral-800"
                        placeholder="4242 •••• •••• 4242"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-neutral-700">Expiry Date</label>
                        <input
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          className="w-full h-9 px-3 rounded-xl border border-neutral-200 text-xs font-mono bg-white text-neutral-800"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-neutral-700">Security CVC</label>
                        <input
                          value={cvc}
                          onChange={(e) => setCvc(e.target.value)}
                          className="w-full h-9 px-3 rounded-xl border border-neutral-200 text-xs font-mono bg-white text-neutral-800"
                          placeholder="CVC"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentGateway === 'gpay' && (
                  <div className="p-4 rounded-2xl bg-neutral-50 text-center space-y-1.5 border border-neutral-200 text-xs">
                    <div className="font-bold text-neutral-900">1-Click Express Checkout via Google Pay / Apple Pay</div>
                    <p className="text-[11px] text-neutral-500">
                      Authorizes with your saved biometric card on device with zero processing fee.
                    </p>
                  </div>
                )}

                {paymentGateway === 'bank' && (
                  <div className="p-3.5 rounded-2xl bg-neutral-50 text-xs space-y-1.5 border border-neutral-200">
                    <div className="font-bold text-neutral-900">Corporate Wire Transfer / Automated Pro-Forma Invoice:</div>
                    <p className="text-[11px] text-neutral-600 font-mono leading-relaxed">
                      Beneficiary: Mark@Ads Global Media Escrow Ops<br />
                      Bank: JPMorgan Chase Bank N.A. (Swift: CHASUS33)<br />
                      Terms: Net-30 available for verified enterprise accounts.
                    </p>
                  </div>
                )}

                {paymentGateway === 'crypto' && (
                  <div className="p-3.5 rounded-2xl bg-neutral-50 text-xs space-y-1.5 border border-neutral-200">
                    <div className="font-bold text-neutral-900">Web3 Multi-Chain Crypto Escrow:</div>
                    <p className="text-[11px] text-neutral-500">
                      Accepts USDT & USDC on Ethereum, Arbitrum, and Polygon. Instant on-chain confirmation.
                    </p>
                  </div>
                )}
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Locking Flight & Confirming Escrow...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="size-4" />
                      <span>Pay {formatMoney(grandTotal, 'USD')} & Launch Campaign</span>
                    </>
                  )}
                </button>
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-400 mt-2 font-medium">
                  <ShieldCheck className="size-3.5 text-emerald-500" />
                  <span>256-bit Bank Grade Encryption • Verified Media Owner Contract</span>
                </div>
              </div>
            </form>
          </div>
        ) : (
          /* Confirmation / Receipt View */
          <div className="p-6 sm:p-8 text-center space-y-5">
            <div className="size-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-2xs">
              <CheckCircle2 className="size-10" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-black text-neutral-900 font-display">
                Campaign Booked & Confirmed!
              </h3>
              <p className="text-xs text-neutral-500">
                Order ID: <span className="font-mono font-bold text-neutral-800">{completedOrder.id}</span>
              </p>
            </div>

            <div className="bg-neutral-50 p-4 rounded-2xl text-left border border-neutral-200 text-xs space-y-2 max-w-md mx-auto shadow-2xs">
              <div className="flex justify-between border-b border-neutral-200 pb-2 font-bold">
                <span>Total Amount Paid:</span>
                <span className="text-emerald-600 text-sm font-display">
                  {formatMoney(completedOrder.totalAmount, 'USD')}
                </span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Gateway:</span>
                <span className="text-neutral-800 font-medium">{completedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Advertiser:</span>
                <span className="text-neutral-800 font-medium">
                  {completedOrder.advertiserName} ({completedOrder.companyName})
                </span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Flight Dates:</span>
                <span className="text-neutral-800 font-medium">
                  {completedOrder.flightStartDate} → {completedOrder.flightEndDate}
                </span>
              </div>
            </div>

            <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
              A formal Tax Invoice and Creative Upload Link have been dispatched to{' '}
              <strong className="text-neutral-800">{completedOrder.advertiserEmail}</strong>.
            </p>

            <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-2">
              <button
                type="button"
                onClick={() => {
                  handleClose();
                  setIsOrdersOpen(true);
                }}
                className="h-10 px-5 rounded-xl bg-[#C62828] hover:bg-[#B71C1C] text-white font-bold text-xs shadow-xs"
              >
                Track Live Campaign Flights →
              </button>
              <button
                type="button"
                onClick={handlePrintReceipt}
                className="h-10 px-4 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-800 font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Download className="size-4" />
                <span>Download / Print Receipt</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
