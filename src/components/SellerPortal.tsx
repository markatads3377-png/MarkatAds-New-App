import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  LayoutGrid,
  Layers,
  FileText,
  Calendar,
  Camera,
  ShieldCheck,
  Sparkles,
  Plus,
  ArrowRight,
  TrendingUp,
  CreditCard,
  Building2,
  CheckCircle2,
  Trash2,
  Edit3,
  Copy,
  Clock,
  Download,
  Upload,
  Eye,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ConsoleModeToggle } from './ConsoleModeToggle';
import { Listing, MediumType } from '../types';
import { MEDIUM_OPTIONS } from '../data/mockCatalog';
import { toast } from 'sonner';

export const SellerPortal: React.FC = () => {
  const {
    catalog,
    addListing,
    updateListing,
    deleteListing,
    toggleFeatureListing,
    toggleAvailableListing,
    proposals,
    addProposal,
    updateProposalStatus,
    popRecords,
    addPoPRecord,
    payouts,
    requestPayout,
    formatMoney,
    displayName,
    username,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'revenue' | 'inventory' | 'loops' | 'proposals' | 'calendar' | 'pop'>('revenue');

  // Withdrawal modal
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('14800');
  const [withdrawRef, setWithdrawRef] = useState('Chase Commercial •••• 9812');

  // Add Listing Modal
  const [isAddListingOpen, setIsAddListingOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newMedium, setNewMedium] = useState<MediumType>('digital_screen');
  const [newCity, setNewCity] = useState('Dubai');
  const [newCountry, setNewCountry] = useState('United Arab Emirates');
  const [newAddress, setNewAddress] = useState('Business Bay Boulevard');
  const [newPrice, setNewPrice] = useState(12500);
  const [newSize, setNewSize] = useState("14m x 7m DOOH");
  const [newImpressions, setNewImpressions] = useState('350,000+ daily');
  const [newImage, setNewImage] = useState('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200');

  // DOOH Loop selected screen
  const [selectedScreenId, setSelectedScreenId] = useState<string>(catalog[0]?.id || 'sheikh-zayed-digital');
  const [isAssignSlotOpen, setIsAssignSlotOpen] = useState(false);
  const [assignSlotNumber, setAssignSlotNumber] = useState<number>(4);
  const [newAdvName, setNewAdvName] = useState('Audi Sport e-Tron');
  const [newAdvRate, setNewAdvRate] = useState(1350);

  // Proposal modal
  const [isNewProposalOpen, setIsNewProposalOpen] = useState(false);
  const [clientCompany, setClientCompany] = useState('BMW Group Middle East');
  const [clientName, setClientName] = useState('Marcus Vance');
  const [clientEmail, setClientEmail] = useState('m.vance@bmw.com');
  const [proposalMonths, setProposalMonths] = useState(2);
  const [agencyDiscount, setAgencyDiscount] = useState(10);

  // PoP upload modal
  const [isPoPUploadOpen, setIsPoPUploadOpen] = useState(false);
  const [popAdvName, setPopAdvName] = useState('Cartier Haute Joaillerie');
  const [popPhotoUrl, setPopPhotoUrl] = useState('https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=1000');

  // Calculations
  const lifetimeRevenue = useMemo(() => {
    return catalog.reduce((sum, item) => sum + (item.totalRevenueEarned || 35000), 0);
  }, [catalog]);

  const availableBalance = 14800; // Ready for instant wire transfer

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(withdrawAmount);
    if (!val || val <= 0) return;
    requestPayout(val, 'bank_wire', withdrawRef);
    toast.success(`Withdrawal of ${formatMoney(val, 'USD')} requested! Funds will settle via bank wire.`);
    setIsWithdrawOpen(false);
  };

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error('Please enter a listing title');
      return;
    }
    addListing({
      title: newTitle.trim(),
      description: `Premium ${newMedium.replace('_', ' ')} outdoor media space situated in ${newCity}, ${newCountry}. Verified traffic reach.`,
      medium: newMedium,
      city: newCity.trim(),
      country: newCountry.trim(),
      address: newAddress.trim(),
      size: newSize.trim(),
      pricePerMonth: Number(newPrice),
      pricePerDay: Math.round(Number(newPrice) / 30),
      currency: 'USD',
      available: true,
      secondHand: false,
      featured: false,
      dailyImpressions: newImpressions.trim(),
      images: [newImage.trim()],
      sellerName: displayName || 'Media Owner Partner',
      sellerRating: 5.0,
      sellerReviewsCount: 1,
      cpm: '$2.20',
      occupancyRate: 0,
    });
    toast.success('New advertising space published to the marketplace!');
    setIsAddListingOpen(false);
    setNewTitle('');
  };

  const currentScreen = catalog.find((c) => c.id === selectedScreenId) || catalog[0];

  const handleAssignSlotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentScreen) return;
    const updatedSlots = currentScreen.slots?.map((s) => {
      if (s.slotNumber === assignSlotNumber) {
        return {
          ...s,
          advertiserName: newAdvName,
          status: 'active' as const,
          monthlyRevenue: Number(newAdvRate),
          contractEnd: '2026-12-31',
        };
      }
      return s;
    }) || [];
    updateListing(currentScreen.id, { slots: updatedSlots, occupiedSlots: updatedSlots.filter(s => s.status === 'active').length });
    toast.success(`Slot #${assignSlotNumber} assigned to ${newAdvName}!`);
    setIsAssignSlotOpen(false);
  };

  const handleCreateProposalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientCompany.trim()) return;
    const sub = currentScreen.pricePerMonth * proposalMonths;
    const disc = (sub * agencyDiscount) / 100;
    addProposal({
      proposalNumber: `RFP-2026-${Math.floor(100 + Math.random() * 900)}`,
      clientName,
      clientCompany,
      clientEmail,
      items: [
        {
          assetId: currentScreen.id,
          title: currentScreen.title,
          medium: currentScreen.medium,
          city: currentScreen.city,
          monthlyRate: currentScreen.pricePerMonth,
          months: proposalMonths,
          total: sub,
        },
      ],
      subtotal: sub,
      agencyDiscountPct: agencyDiscount,
      productionCost: 1000,
      totalAmount: sub - disc + 1000,
      currency: 'USD',
      status: 'sent',
      validUntil: '2026-11-15',
      notes: 'Includes 24/7 technical monitoring, 4K digital playback verification, and live camera feed access.',
    });
    toast.success(`Proposal generated and dispatched to ${clientEmail}!`);
    setIsNewProposalOpen(false);
  };

  const handleUploadPoPSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPoPRecord({
      assetId: currentScreen.id,
      assetTitle: currentScreen.title,
      advertiser: popAdvName,
      timestamp: `Live ${new Date().toLocaleTimeString()} Today`,
      imageUrl: popPhotoUrl,
      cameraName: 'Stationary Inspection Cam 02',
      compliancePct: 100,
      verifiedBy: 'Field Inspector Certified',
      gpsVerified: true,
    });
    toast.success('Proof-of-play photograph uploaded and verified!');
    setIsPoPUploadOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Persitent Top Console Toggle Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white border border-neutral-200 rounded-2xl shadow-2xs">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider pl-1">
            Console Mode:
          </span>
          <ConsoleModeToggle variant="compact" />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAddListingOpen(true)}
            className="h-8 px-3.5 rounded-xl bg-[#C62828] hover:bg-[#B71C1C] text-white text-xs font-bold shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="size-3.5" />
            <span>List New Space</span>
          </button>
          <button
            type="button"
            onClick={() => setIsNewProposalOpen(true)}
            className="h-8 px-3 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-800 text-xs font-semibold"
          >
            Create RFP Quote
          </button>
        </div>
      </div>

      {/* Hero Banner for Media Owner Console */}
      <div className="rounded-3xl border border-amber-200/80 bg-gradient-to-br from-slate-900 via-stone-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30 flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-amber-400 animate-ping" />
                <span>Media Owner Operating System</span>
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-300">Fleet: {catalog.length} units</span>
              <span className="text-slate-400">•</span>
              <span className="text-emerald-400 font-semibold">Instant Escrow Payouts</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white">
              Inventory Fleet & Revenue Operating System
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Monetize billboards, DOOH screens, and transit spaces. Schedule digital loops, track gross & net earnings, generate agency proposals, and upload certified proofs of play.
            </p>
          </div>

          <ConsoleModeToggle variant="pill" />
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex items-center gap-1 p-1 bg-white border border-neutral-200/90 rounded-2xl text-xs font-semibold overflow-x-auto shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveTab('revenue')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'revenue' ? 'bg-[#C62828] text-white shadow-xs font-bold' : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <DollarSign className="size-3.5" />
          <span>Revenue & Earnings</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('inventory')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'inventory' ? 'bg-[#C62828] text-white shadow-xs font-bold' : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <LayoutGrid className="size-3.5" />
          <span>Media Fleet ({catalog.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('loops')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'loops' ? 'bg-[#C62828] text-white shadow-xs font-bold' : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <Layers className="size-3.5" />
          <span>DOOH Loop Scheduler</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('proposals')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'proposals' ? 'bg-[#C62828] text-white shadow-xs font-bold' : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <FileText className="size-3.5" />
          <span>Proposals & RFPs ({proposals.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('calendar')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'calendar' ? 'bg-[#C62828] text-white shadow-xs font-bold' : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <Calendar className="size-3.5" />
          <span>Flight Calendar</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('pop')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'pop' ? 'bg-[#C62828] text-white shadow-xs font-bold' : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <Camera className="size-3.5" />
          <span>Proof of Play (PoP)</span>
        </button>
      </div>

      {/* TAB 1: REVENUE & EARNINGS */}
      {activeTab === 'revenue' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs text-neutral-500 font-medium">
                <span>Gross Revenue Earned</span>
                <span className="text-emerald-600 font-bold">+18.4% YoY</span>
              </div>
              <div className="text-2xl font-black text-neutral-900 font-display">
                {formatMoney(lifetimeRevenue, 'USD')}
              </div>
              <p className="text-[11px] text-neutral-400">All-time booked earnings</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs text-neutral-500 font-medium">
                <span>In-Flight Escrow Balance</span>
                <span className="text-amber-600 font-bold">Protected</span>
              </div>
              <div className="text-2xl font-black text-neutral-900 font-display">
                {formatMoney(48500, 'USD')}
              </div>
              <p className="text-[11px] text-neutral-400">Auto-releases upon flight completion</p>
            </div>

            <div className="p-5 rounded-2xl bg-red-50/50 border border-red-200/80 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-neutral-800 font-bold">Available for Withdrawal</span>
                <button
                  type="button"
                  onClick={() => setIsWithdrawOpen(true)}
                  className="px-2 py-0.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px]"
                >
                  Withdraw
                </button>
              </div>
              <div className="text-2xl font-black text-emerald-600 font-display">
                {formatMoney(availableBalance, 'USD')}
              </div>
              <p className="text-[11px] text-neutral-500">Settled funds ready for wire transfer</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs text-neutral-500 font-medium">
                <span>Fleet Occupancy</span>
                <span className="text-blue-600 font-bold">85% Capacity</span>
              </div>
              <div className="text-2xl font-black text-neutral-900 font-display">
                {catalog.filter((l) => l.available).length} Open Units
              </div>
              <p className="text-[11px] text-neutral-400">Out of {catalog.length} total listed spaces</p>
            </div>
          </div>

          {/* Screen by Screen Revenue Table */}
          <div className="p-5 rounded-3xl border border-neutral-200 bg-white shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-neutral-900 font-display">
                  Screen-by-Screen Revenue Leaderboard
                </h3>
                <p className="text-xs text-neutral-500">
                  Track individual billboard yield, advertiser sponsorships, and occupancy.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50 text-neutral-500 font-semibold">
                    <th className="p-3">Media Space</th>
                    <th className="p-3">Format</th>
                    <th className="p-3">Monthly Rate</th>
                    <th className="p-3">Total Earned</th>
                    <th className="p-3">Occupancy</th>
                    <th className="p-3">Current Sponsor</th>
                    <th className="p-3 text-right">Airtime Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-neutral-800">
                  {catalog.map((item) => (
                    <tr key={item.id} className="hover:bg-neutral-50/60">
                      <td className="p-3 font-semibold text-neutral-900">
                        {item.title}
                        <span className="block text-[11px] text-neutral-400 font-normal">
                          {item.city}, {item.country}
                        </span>
                      </td>
                      <td className="p-3 capitalize">{item.medium.replace('_', ' ')}</td>
                      <td className="p-3 font-bold font-display">{formatMoney(item.pricePerMonth, item.currency)}</td>
                      <td className="p-3 font-bold text-emerald-600 font-display">
                        {formatMoney(item.totalRevenueEarned || 25000, item.currency)}
                      </td>
                      <td className="p-3">{item.occupancyRate || 80}%</td>
                      <td className="p-3 text-neutral-600 font-medium">{item.currentAdvertiser || 'Open for Booking'}</td>
                      <td className="p-3 text-right">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Broadcasting
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MEDIA FLEET MANAGER */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-neutral-900 font-display">
              My Media Fleet Inventory ({catalog.length})
            </h3>
            <button
              type="button"
              onClick={() => setIsAddListingOpen(true)}
              className="h-8 px-3 rounded-xl bg-[#C62828] hover:bg-[#B71C1C] text-white text-xs font-bold shadow-2xs flex items-center gap-1.5"
            >
              <Plus className="size-3.5" />
              <span>List New Billboard or Screen</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {catalog.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-3xl border border-neutral-200 bg-white shadow-2xs hover:border-neutral-300 transition-all space-y-3"
              >
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-neutral-100">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="size-full object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/75 text-white capitalize">
                    {item.medium.replace('_', ' ')}
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-xs text-neutral-900 truncate">{item.title}</h4>
                  <p className="text-[11px] text-neutral-500">
                    {item.city}, {item.country} • {item.dailyImpressions}
                  </p>
                  <div className="text-sm font-black text-[#C62828] font-display">
                    {formatMoney(item.pricePerMonth, item.currency)} / mo
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleFeatureListing(item.id)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border transition-colors ${
                        item.featured
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : 'bg-neutral-50 text-neutral-500 border-neutral-200'
                      }`}
                    >
                      {item.featured ? 'Featured' : 'Regular'}
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleAvailableListing(item.id)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border transition-colors ${
                        item.available
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-neutral-100 text-neutral-500 border-neutral-200'
                      }`}
                    >
                      {item.available ? 'Live' : 'Paused'}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Delete this listing?')) deleteListing(item.id);
                    }}
                    className="size-7 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 grid place-items-center"
                    title="Delete space"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: DOOH LOOP SCHEDULER */}
      {activeTab === 'loops' && currentScreen && (
        <div className="space-y-6">
          <div className="p-5 rounded-3xl border border-neutral-200 bg-white shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-sm text-neutral-900 font-display">
                  60-Second Broadcast Rotation Cycle ({currentScreen.title})
                </h3>
                <p className="text-xs text-neutral-500">
                  Programmatic 10-second spot rotations with automated dayparting.
                </p>
              </div>

              <select
                value={selectedScreenId}
                onChange={(e) => setSelectedScreenId(e.target.value)}
                className="h-9 px-3 rounded-xl border border-neutral-200 text-xs font-semibold bg-neutral-50 text-neutral-800"
              >
                {catalog.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} ({c.city})
                  </option>
                ))}
              </select>
            </div>

            {/* Loop Timeline Visualization */}
            <div className="space-y-2">
              <div className="flex justify-between text-[11px] font-mono text-neutral-400">
                <span>0s</span>
                <span>15s</span>
                <span>30s</span>
                <span>45s</span>
                <span>60s Loop End</span>
              </div>
              <div className="h-7 w-full rounded-xl overflow-hidden flex border border-neutral-200 bg-neutral-100 p-0.5 gap-1">
                {(currentScreen.slots || []).map((s, idx) => (
                  <div
                    key={s.id}
                    className={`h-full flex-1 rounded-lg flex items-center justify-center text-[10px] font-bold ${
                      s.status === 'active'
                        ? 'bg-[#C62828] text-white shadow-2xs'
                        : 'bg-white text-neutral-400 border border-dashed border-neutral-300'
                    }`}
                  >
                    #{idx + 1}
                  </div>
                ))}
              </div>
            </div>

            {/* Slot list */}
            <div className="space-y-2 pt-2">
              {(currentScreen.slots || []).map((s) => (
                <div
                  key={s.id}
                  className="p-3 rounded-xl border border-neutral-200 bg-neutral-50/60 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="size-6 rounded-lg bg-neutral-900 text-white font-mono font-bold text-xs grid place-items-center">
                      #{s.slotNumber}
                    </span>
                    <div>
                      <strong className="text-neutral-900">{s.advertiserName}</strong>
                      <span className="text-neutral-400 ml-2">({s.durationSeconds}s spot • {s.brandCategory})</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-bold text-neutral-900 font-display">
                      ${s.monthlyRevenue}/mo
                    </span>
                    {s.status === 'vacant' ? (
                      <button
                        type="button"
                        onClick={() => {
                          setAssignSlotNumber(s.slotNumber);
                          setIsAssignSlotOpen(true);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#C62828] text-white font-bold text-[11px]"
                      >
                        Assign / Book
                      </button>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                        Broadcasting
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PROPOSALS & RFPS */}
      {activeTab === 'proposals' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-neutral-900 font-display">
              Advertiser Proposals & Formal RFP Quotes
            </h3>
            <button
              type="button"
              onClick={() => setIsNewProposalOpen(true)}
              className="h-8 px-3 rounded-xl bg-[#C62828] hover:bg-[#B71C1C] text-white text-xs font-bold shadow-2xs flex items-center gap-1"
            >
              <Plus className="size-3.5" />
              <span>Create New Proposal</span>
            </button>
          </div>

          <div className="space-y-3">
            {proposals.map((prop) => (
              <div
                key={prop.id}
                className="p-5 rounded-3xl border border-neutral-200 bg-white shadow-2xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-[#C62828]">{prop.proposalNumber}</span>
                    <strong className="text-sm text-neutral-900">{prop.clientCompany}</strong>
                    <span className="text-xs text-neutral-500">({prop.clientName} • {prop.clientEmail})</span>
                  </div>
                  <div className="text-sm font-black text-neutral-900 font-display">
                    {formatMoney(prop.totalAmount, prop.currency)}
                  </div>
                </div>

                <div className="text-xs text-neutral-600">
                  Included Media:{' '}
                  {prop.items.map((i, idx) => (
                    <span key={i.assetId} className="font-semibold text-neutral-900">
                      {i.title} ({i.months} months){idx < prop.items.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-neutral-400 text-[11px]">Valid until {prop.validUntil}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(window.location.href);
                        toast.success('Shareable RFP Quote Link copied to clipboard!');
                      }}
                      className="px-3 h-7.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-semibold"
                    >
                      Copy Quote Link
                    </button>
                    {prop.status !== 'accepted' && (
                      <button
                        type="button"
                        onClick={() => {
                          updateProposalStatus(prop.id, 'accepted');
                          toast.success('Proposal marked accepted!');
                        }}
                        className="px-3 h-7.5 rounded-lg bg-emerald-600 text-white font-bold"
                      >
                        Mark Accepted
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: CALENDAR */}
      {activeTab === 'calendar' && (
        <div className="p-5 rounded-3xl border border-neutral-200 bg-white shadow-2xs space-y-4">
          <h3 className="font-bold text-sm text-neutral-900 font-display">
            Active Campaign Flight Durations
          </h3>
          <p className="text-xs text-neutral-500">
            Schedule of booked advertiser campaigns and upcoming space vacancies.
          </p>

          <div className="space-y-3">
            {catalog.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl border border-neutral-200 bg-neutral-50 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <h4 className="font-bold text-neutral-900">{item.title}</h4>
                  <span className="text-neutral-500 text-[11px]">{item.city}, {item.country}</span>
                </div>

                <div className="text-right">
                  <span className="text-emerald-700 font-bold block">
                    Contract Active → {item.activeContractEnd || '2026-11-30'}
                  </span>
                  <span className="text-[10px] text-neutral-400">
                    Sponsor: {item.currentAdvertiser || 'Open for booking'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: PROOF OF PLAY */}
      {activeTab === 'pop' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-neutral-900 font-display">
              Proof of Play Inspection Photos & Verification
            </h3>
            <button
              type="button"
              onClick={() => setIsPoPUploadOpen(true)}
              className="h-8 px-3 rounded-xl bg-[#C62828] hover:bg-[#B71C1C] text-white text-xs font-bold shadow-2xs flex items-center gap-1.5"
            >
              <Upload className="size-3.5" />
              <span>Upload PoP Photo</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {popRecords.map((pop) => (
              <div key={pop.id} className="rounded-3xl border border-neutral-200 bg-white overflow-hidden shadow-2xs space-y-3 p-3">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-black">
                  <img src={pop.imageUrl} alt="" className="size-full object-cover" />
                  <div className="absolute top-2 left-2 bg-black/80 px-2 py-0.5 rounded text-[10px] text-white font-mono flex items-center gap-1">
                    <Camera className="size-3 text-emerald-400" />
                    <span>{pop.cameraName}</span>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <h4 className="font-bold text-neutral-900 truncate">{pop.assetTitle}</h4>
                  <p className="text-neutral-500 text-[11px]">Sponsor: <strong>{pop.advertiser}</strong></p>
                  <p className="text-neutral-400 text-[10px]">{pop.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: Add Listing */}
      {isAddListingOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 space-y-4 shadow-2xl border border-neutral-200">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-bold text-sm text-neutral-900 font-display">
                List New Media Space or DOOH Screen
              </h3>
              <button
                type="button"
                onClick={() => setIsAddListingOpen(false)}
                className="size-8 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 grid place-items-center"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleCreateListing} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-neutral-700">Space Title *</label>
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Sunset Blvd Highway Unipole"
                  className="w-full h-9 px-3 rounded-xl border border-neutral-200 text-xs bg-white text-neutral-800"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-700">Medium Type</label>
                  <select
                    value={newMedium}
                    onChange={(e) => setNewMedium(e.target.value as MediumType)}
                    className="w-full h-9 px-3 rounded-xl border border-neutral-200 text-xs bg-white text-neutral-800"
                  >
                    {MEDIUM_OPTIONS.map((m) => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-700">Monthly Price ($ USD)</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full h-9 px-3 rounded-xl border border-neutral-200 text-xs bg-white text-neutral-800"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-700">City</label>
                  <input
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-neutral-200 text-xs bg-white text-neutral-800"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-700">Country</label>
                  <input
                    value={newCountry}
                    onChange={(e) => setNewCountry(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-neutral-200 text-xs bg-white text-neutral-800"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-neutral-700">Photo URL</label>
                <input
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-neutral-200 text-xs bg-white text-neutral-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddListingOpen(false)}
                  className="h-8 px-3 rounded-xl border border-neutral-200 text-neutral-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-8 px-4 rounded-xl bg-[#C62828] hover:bg-[#B71C1C] text-white font-bold"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Request Withdrawal */}
      {isWithdrawOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-neutral-200">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-bold text-sm text-neutral-900 font-display">
                Request Revenue Withdrawal
              </h3>
              <button
                type="button"
                onClick={() => setIsWithdrawOpen(false)}
                className="size-8 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 grid place-items-center"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-neutral-700">Withdrawal Amount ($ USD)</label>
                <input
                  type="number"
                  max={availableBalance}
                  min={100}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-neutral-200 text-xs bg-white text-neutral-800"
                  required
                />
                <span className="text-[11px] text-neutral-500">Max available: {formatMoney(availableBalance, 'USD')}</span>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-neutral-700">Bank Account / Reference</label>
                <input
                  value={withdrawRef}
                  onChange={(e) => setWithdrawRef(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-neutral-200 text-xs bg-white text-neutral-800"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsWithdrawOpen(false)}
                  className="h-8 px-3 rounded-xl border border-neutral-200 text-neutral-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-8 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Confirm Wire Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
