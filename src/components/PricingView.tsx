import React from 'react';
import { Check, Sparkles, ShieldCheck, ArrowRight, Building2, ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PricingView: React.FC = () => {
  const { setCurrentView, setRole } = useApp();

  const plans = [
    {
      name: 'Regular',
      price: 'Free',
      period: '',
      desc: 'Essential listing tools for independent billboard operators and shop owners.',
      features: [
        'Free media listing',
        'Basic photo & video uploads',
        'Customer comments & inquiries',
        'Standard marketplace search indexing',
        'Basic audience count tag',
      ],
      highlight: false,
      cta: 'Start Free',
      role: 'seller' as const,
    },
    {
      name: 'Medium',
      price: '$8',
      period: '/month',
      desc: 'Accelerated bookings with automated alerts and prime placement boosts.',
      features: [
        'Everything in Regular',
        'Medium analytics & traffic tracking',
        '15GB high-res media storage',
        'Instant WhatsApp & Email booking alerts',
        'Automated payment & escrow facility',
        'Feature up to 3 billboards on homepage',
      ],
      highlight: true,
      badge: 'Most Popular for Operators',
      cta: 'Choose Medium Plan',
      role: 'seller' as const,
    },
    {
      name: 'Premium',
      price: '$12',
      period: '/month',
      desc: 'Complete media empire suite with programmatic DOOH loops and priority agency dispatch.',
      features: [
        'Everything in Medium',
        'Unlimited active listings',
        'Full analytics + keyword intent tracking',
        'View verified buyer IDs & agencies',
        'Direct message potential brand advertisers',
        'Unlimited featured billboard placements',
        'Manage & moderate customer reviews',
        '60-second DOOH slot scheduling engine',
      ],
      highlight: false,
      cta: 'Choose Premium Plan',
      role: 'seller' as const,
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4">
      <div className="text-center space-y-2">
        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-50 text-[#C62828] border border-red-200">
          Transparent Operator Pricing
        </span>
        <h1 className="text-2xl sm:text-4xl font-black font-display text-neutral-900 tracking-tight">
          Plans that Scale with your Inventory Fleet
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 max-w-xl mx-auto leading-relaxed">
          Advertisers and buyers always browse and book with 0% escrow fees. Media owners start free and upgrade when they want enhanced footfall analytics and featured spotlight boosts.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`rounded-3xl p-6 flex flex-col justify-between space-y-5 transition-all duration-300 relative ${
              p.highlight
                ? 'bg-white border-2 border-[#C62828] shadow-xl shadow-red-500/10'
                : 'bg-white border border-neutral-200 shadow-2xs hover:border-neutral-300'
            }`}
          >
            {p.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#C62828] text-white shadow-xs">
                {p.badge}
              </span>
            )}

            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold font-display text-neutral-900">{p.name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black text-neutral-900 font-display">
                    {p.price}
                  </span>
                  <span className="text-xs text-neutral-500 font-medium">{p.period}</span>
                </div>
                <p className="text-xs text-neutral-500 mt-1 leading-snug">{p.desc}</p>
              </div>

              <div className="border-t border-neutral-100 pt-3 space-y-2.5">
                {p.features.map((feat) => (
                  <div key={feat} className="flex items-start gap-2 text-xs text-neutral-700">
                    <Check className="size-3.5 text-[#C62828] shrink-0 mt-0.5" />
                    <span className="leading-snug">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setRole(p.role);
                setCurrentView('seller');
              }}
              className={`w-full h-11 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 ${
                p.highlight
                  ? 'bg-[#C62828] hover:bg-[#B71C1C] text-white shadow-md'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-white'
              }`}
            >
              <span>{p.cta}</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Advertiser Volume Guarantee Box */}
      <div className="p-6 rounded-3xl border border-neutral-200 bg-neutral-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1 max-w-lg">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
            <ShieldCheck className="size-4" />
            <span>Are you a Brand Advertiser or Agency?</span>
          </div>
          <h4 className="text-base font-bold font-display text-white">
            Volume Discounts & Escrow Multi-Flight Booking
          </h4>
          <p className="text-xs text-neutral-400">
            Book 3+ months for 10% off, 6+ months for 15% off, and 12+ months for 20% off with dedicated proof-of-play inspection.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setRole('buyer');
            setCurrentView('browse');
          }}
          className="h-10 px-5 rounded-xl bg-white text-neutral-900 hover:bg-neutral-100 font-bold text-xs shrink-0 flex items-center gap-1.5"
        >
          <span>Browse Flight Inventory</span>
          <ArrowRight className="size-3.5" />
        </button>
      </div>
    </div>
  );
};
