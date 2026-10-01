import React, { useState, useMemo } from 'react';
import {
  Layers,
  Clock,
  CheckCircle2,
  MapPin,
  TrendingUp,
  ShieldCheck,
  Camera,
  Upload,
  Download,
  ArrowRight,
  Eye,
  FileText,
  Radio,
  ExternalLink,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ConsoleModeToggle } from './ConsoleModeToggle';
import { PlacedOrder } from '../types';
import { toast } from 'sonner';

export const BuyerPortal: React.FC = () => {
  const {
    orders,
    formatMoney,
    setCurrentView,
    displayName,
    username,
    uploadArtworkForOrder,
  } = useApp();

  const [flightFilter, setFlightFilter] = useState<'all' | 'live' | 'review' | 'completed'>('all');
  const [selectedPoPOrder, setSelectedPoPOrder] = useState<PlacedOrder | null>(null);
  const [isArtworkModalOpen, setIsArtworkModalOpen] = useState(false);
  const [targetOrder, setTargetOrder] = useState<PlacedOrder | null>(null);
  const [artworkUrl, setArtworkUrl] = useState('https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200');

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (flightFilter === 'live') return o.status === 'Live on Air';
      if (flightFilter === 'review') return o.status === 'Creative Review' || o.status === 'Mounting & Prep';
      if (flightFilter === 'completed') return o.status === 'Completed';
      return true;
    });
  }, [orders, flightFilter]);

  // Aggregate metrics
  const totalSpend = useMemo(() => {
    return orders.reduce((sum, o) => sum + o.totalAmount, 0);
  }, [orders]);

  const activeFlightsCount = useMemo(() => {
    return orders.filter((o) => o.status === 'Live on Air').length;
  }, [orders]);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetOrder || !artworkUrl.trim()) return;
    uploadArtworkForOrder(targetOrder.id, artworkUrl.trim());
    toast.success(`Creative artwork assigned to ${targetOrder.id} and approved for airtime.`);
    setIsArtworkModalOpen(false);
  };

  const handleDownloadInvoice = (order: PlacedOrder) => {
    toast.success(`Generating PDF Tax Invoice & Escrow Receipt #${order.id}...`);
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
            onClick={() => setCurrentView('browse')}
            className="h-8 px-3.5 rounded-xl bg-[#C62828] hover:bg-[#B71C1C] text-white text-xs font-bold shadow-2xs transition-colors"
          >
            + Book More Spaces
          </button>
          <button
            type="button"
            onClick={() => setCurrentView('pricing')}
            className="h-8 px-3 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-800 text-xs font-semibold"
          >
            Volume Pricing
          </button>
        </div>
      </div>

      {/* Hero Banner for Advertiser Console */}
      <div className="rounded-3xl border border-blue-200/80 bg-gradient-to-br from-slate-900 via-indigo-950/80 to-slate-900 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30 flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Advertiser Flight Cockpit</span>
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-300">Account: @{username} ({displayName})</span>
              <span className="text-slate-400">•</span>
              <span className="text-blue-300 font-semibold">100% Escrow Protected</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white">
              Campaign Dispatch & Airtime Monitoring
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Track your purchased billboards and DOOH flights, monitor real-time vehicular impressions, inspect live webcam feeds for proof of play, and manage creative video assets.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-400" />
                <span className="text-slate-400">Bought Flights:</span>
                <strong className="text-white">{orders.length} Campaigns</strong>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-blue-400" />
                <span className="text-slate-400">Active Live on Air:</span>
                <strong className="text-white">{activeFlightsCount} Units</strong>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-amber-400" />
                <span className="text-slate-400">Protected in Escrow:</span>
                <strong className="text-amber-400">{formatMoney(totalSpend, 'USD')}</strong>
              </div>
            </div>
          </div>

          <ConsoleModeToggle variant="pill" />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-500 font-medium">
            <span>Total Mediums Bought</span>
            <span className="text-blue-600 font-bold">{activeFlightsCount} Live on Air</span>
          </div>
          <div className="text-2xl font-black text-neutral-900 font-display">
            {orders.length} Spaces
          </div>
          <p className="text-[11px] text-neutral-400">
            Across highway unipoles, DOOH screens & transit
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-500 font-medium">
            <span>Total Campaign Spend</span>
            <span className="text-emerald-600 font-bold flex items-center gap-1">
              <ShieldCheck className="size-3.5" /> Escrow Safe
            </span>
          </div>
          <div className="text-2xl font-black text-emerald-600 font-display">
            {formatMoney(totalSpend, 'USD')}
          </div>
          <p className="text-[11px] text-neutral-400">
            Funds auto-released only upon PoP compliance
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-500 font-medium">
            <span>Verified Reach Delivered</span>
            <span className="text-purple-600 font-bold">100% Certified</span>
          </div>
          <div className="text-2xl font-black text-neutral-900 font-display">
            41.6M+ Impressions
          </div>
          <p className="text-[11px] text-neutral-400">
            Grounded by Geopath, Dubai RTA & Route UK
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-500 font-medium">
            <span>Effective Blended CPM</span>
            <span className="text-cyan-600 font-bold">High ROI</span>
          </div>
          <div className="text-2xl font-black text-neutral-900 font-display">
            $1.42 CPM
          </div>
          <p className="text-[11px] text-neutral-400">
            70% lower than traditional social video ads
          </p>
        </div>
      </div>

      {/* Booked Flights Roster with Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl border border-neutral-200 bg-white shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-neutral-600">Filter Flights:</span>
            <div className="inline-flex rounded-xl bg-neutral-100 p-0.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setFlightFilter('all')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  flightFilter === 'all' ? 'bg-white text-neutral-900 shadow-2xs font-bold' : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                All ({orders.length})
              </button>
              <button
                type="button"
                onClick={() => setFlightFilter('live')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  flightFilter === 'live' ? 'bg-white text-emerald-700 shadow-2xs font-bold' : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                Live on Air
              </button>
              <button
                type="button"
                onClick={() => setFlightFilter('review')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  flightFilter === 'review' ? 'bg-white text-amber-700 shadow-2xs font-bold' : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                In Review / Prep
              </button>
            </div>
          </div>

          <div className="text-xs text-neutral-500 flex items-center gap-1 font-medium">
            <ShieldCheck className="size-4 text-emerald-600" />
            <span>Escrow contract active on all booked spaces</span>
          </div>
        </div>

        {/* Flight Cards */}
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const firstItem = order.items[0];
            const cover =
              firstItem?.listing.images?.[0] ||
              'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800';

            return (
              <div
                key={order.id}
                className="p-5 rounded-3xl border border-neutral-200 bg-white shadow-2xs hover:border-neutral-300 transition-all space-y-4"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
                  <div className="flex items-center gap-3">
                    <img
                      src={cover}
                      alt=""
                      className="size-16 rounded-2xl object-cover border border-neutral-100 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-black text-neutral-900">{order.id}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            order.status === 'Live on Air'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-neutral-900 mt-0.5">
                        {firstItem?.listing.title || 'Multi-Space Brand Flight'}
                      </h4>
                      <p className="text-xs text-neutral-500 flex items-center gap-1">
                        <MapPin className="size-3 text-[#C62828]" />
                        <span>{firstItem?.listing.city}, {firstItem?.listing.country}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-black text-neutral-900 font-display">
                      {formatMoney(order.totalAmount, order.currency)}
                    </div>
                    <div className="text-[11px] text-neutral-400">
                      Payment: {order.paymentMethod}
                    </div>
                  </div>
                </div>

                {/* Specs Sub-Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-neutral-50 p-3 rounded-2xl text-xs">
                  <div>
                    <span className="text-[10px] text-neutral-400 block font-medium">Flight Duration</span>
                    <strong className="text-neutral-900">{order.flightStartDate} → {order.flightEndDate}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block font-medium">Creative Status</span>
                    <strong className={order.artworkUploaded ? 'text-emerald-600' : 'text-amber-600'}>
                      {order.artworkUploaded ? 'Approved for Airtime' : 'Awaiting Upload'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block font-medium">Media Owner Partner</span>
                    <strong className="text-neutral-900">{firstItem?.listing.sellerName || 'Verified Partner'}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block font-medium">Delivery Guarantee</span>
                    <strong className="text-emerald-600 flex items-center gap-1">
                      <ShieldCheck className="size-3" /> 100% Escrow Backed
                    </strong>
                  </div>
                </div>

                {/* Actions Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPoPOrder(order);
                      }}
                      className="h-8 px-3 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-800 font-bold flex items-center gap-1.5"
                    >
                      <Camera className="size-3.5 text-[#C62828]" />
                      <span>Inspect Live Camera PoP</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTargetOrder(order);
                        setIsArtworkModalOpen(true);
                      }}
                      className="h-8 px-3 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-800 font-bold flex items-center gap-1.5"
                    >
                      <Upload className="size-3.5" />
                      <span>{order.artworkUploaded ? 'Replace Artwork' : 'Upload Creative'}</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDownloadInvoice(order)}
                    className="h-8 px-3 rounded-xl text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 font-semibold flex items-center gap-1.5"
                  >
                    <Download className="size-3.5" />
                    <span>Download Invoice & Receipt</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live PoP Camera Modal */}
      {selectedPoPOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-5 space-y-4 shadow-2xl border border-neutral-200">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="space-y-0.5">
                <h3 className="font-bold text-sm text-neutral-900 font-display">
                  Live Proof of Play Optical Sensor Stream
                </h3>
                <p className="text-xs text-neutral-500">
                  {selectedPoPOrder.id} • Verified GPS & Daylight Sensor Telemetry
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPoPOrder(null)}
                className="size-8 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 grid place-items-center"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-neutral-200">
              <img
                src={selectedPoPOrder.items[0]?.listing.images[0] || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800'}
                alt=""
                className="size-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-lg text-white font-mono text-[10px] flex items-center gap-1">
                <Camera className="size-3 text-emerald-400" />
                <span>Stationary Inspection Cam 01</span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 bg-black/80 backdrop-blur-md p-2.5 rounded-xl text-white font-mono text-[11px] flex justify-between">
                <span>Timestamp: {new Date().toLocaleString()}</span>
                <span className="text-emerald-400">100% Broadcast Certified</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setSelectedPoPOrder(null)}
                className="h-8 px-4 rounded-xl bg-neutral-900 text-white text-xs font-bold"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Artwork Modal */}
      {isArtworkModalOpen && targetOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-neutral-200">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-bold text-sm text-neutral-900 font-display">
                Upload Campaign Creative Artwork
              </h3>
              <button
                type="button"
                onClick={() => setIsArtworkModalOpen(false)}
                className="size-8 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 grid place-items-center"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3 text-xs">
              <p className="text-neutral-500">
                Provide high-resolution image URL (TIFF, PDF for billboards) or video URL (MP4 60FPS for DOOH displays).
              </p>
              <div className="space-y-1">
                <label className="font-semibold text-neutral-700">Artwork Asset URL</label>
                <input
                  value={artworkUrl}
                  onChange={(e) => setArtworkUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full h-9 px-3 rounded-xl border border-neutral-200 text-xs bg-white text-neutral-800 focus:outline-none focus:ring-1 focus:ring-[#C62828]"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsArtworkModalOpen(false)}
                  className="h-8 px-3 rounded-xl border border-neutral-200 text-neutral-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-8 px-4 rounded-xl bg-[#C62828] hover:bg-[#B71C1C] text-white font-bold"
                >
                  Submit & Verify
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
