import React, { useState } from 'react';
import {
  X,
  PackageCheck,
  Calendar,
  Download,
  UploadCloud,
  CheckCircle2,
  Clock,
  Sparkles,
  MapPin,
  FileText,
  Radio,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PlacedOrder } from '../types';
import { toast } from 'sonner';

export const OrdersTrackerModal: React.FC = () => {
  const { orders, isOrdersOpen, setIsOrdersOpen, formatMoney, uploadArtworkForOrder } = useApp();
  const [selectedOrder, setSelectedOrder] = useState<PlacedOrder | null>(null);
  const [sampleArtworkUrl, setSampleArtworkUrl] = useState(
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200'
  );

  if (!isOrdersOpen) return null;

  const currentOrder = selectedOrder || orders[0] || null;

  const handleUploadSimulate = (e: React.FormEvent, orderId: string) => {
    e.preventDefault();
    uploadArtworkForOrder(orderId, sampleArtworkUrl);
    toast.success('Creative artwork uploaded and scheduled for pre-flight mounting check!');
  };

  const handlePrintOrder = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const getStatusColor = (status: PlacedOrder['status']) => {
    switch (status) {
      case 'Live on Air':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Mounting & Prep':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Creative Review':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Completed':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-neutral-100 text-neutral-600 border-neutral-200';
    }
  };

  const stages: { key: PlacedOrder['status']; label: string }[] = [
    { key: 'Booked', label: 'Flight Booked' },
    { key: 'Creative Review', label: 'Artwork Review' },
    { key: 'Mounting & Prep', label: 'Mounting / QC' },
    { key: 'Live on Air', label: 'Live On Air' },
    { key: 'Completed', label: 'Completed' },
  ];

  const getStageIndex = (status: PlacedOrder['status']) => {
    return stages.findIndex((s) => s.key === status);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200 select-none">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col border border-neutral-200 shadow-2xl overflow-hidden text-neutral-900">
        {/* Header */}
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-red-50 text-[#C62828] grid place-items-center">
              <PackageCheck className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display text-neutral-900">
                Campaign Orders & Flight Tracker
              </h3>
              <p className="text-xs text-neutral-500">
                Manage your active advertising flights, artwork approvals, and tax invoices
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOrdersOpen(false)}
            className="size-8 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 grid place-items-center"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Orders list (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-500">
              Booked Campaigns ({orders.length})
            </h4>
            {orders.length === 0 ? (
              <div className="p-6 rounded-2xl bg-neutral-50 text-center text-xs text-neutral-500 border border-neutral-200">
                No campaign bookings yet.
              </div>
            ) : (
              orders.map((o) => (
                <div
                  key={o.id}
                  onClick={() => setSelectedOrder(o)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    currentOrder?.id === o.id
                      ? 'bg-white border-[#C62828] ring-2 ring-[#C62828]/20 shadow-xs'
                      : 'bg-neutral-50/70 border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-mono font-bold text-xs text-neutral-900">{o.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusColor(o.status)}`}>
                      {o.status}
                    </span>
                  </div>
                  <div className="font-bold text-xs text-neutral-800 truncate">{o.companyName}</div>
                  <div className="text-[11px] text-neutral-500 mt-0.5">
                    {new Date(o.createdAt).toLocaleDateString()} • {formatMoney(o.totalAmount, o.currency)}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right: Selected Order Detail (8 cols) */}
          {currentOrder && (
            <div className="lg:col-span-8 space-y-5 bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs">
              {/* Top Details */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-extrabold text-neutral-900">
                      {currentOrder.id}
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getStatusColor(currentOrder.status)}`}>
                      {currentOrder.status}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Advertiser: <strong className="text-neutral-800">{currentOrder.advertiserName}</strong> ({currentOrder.advertiserEmail})
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handlePrintOrder}
                  className="h-8 px-3 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-800 text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <Download className="size-3.5" />
                  <span>PDF Tax Invoice</span>
                </button>
              </div>

              {/* Progress Stepper */}
              <div className="space-y-2">
                <h4 className="font-bold text-xs text-neutral-800 flex items-center gap-1.5">
                  <Radio className="size-3.5 text-[#C62828]" />
                  <span>Live Flight Progress Pipeline</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                  {stages.map((stg, idx) => {
                    const activeIndex = getStageIndex(currentOrder.status);
                    const isPassed = idx <= activeIndex;
                    const isCurrent = idx === activeIndex;
                    return (
                      <div
                        key={stg.key}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          isCurrent
                            ? 'bg-red-50 border-[#C62828] text-[#C62828] font-bold shadow-2xs'
                            : isPassed
                            ? 'bg-neutral-100 border-neutral-200 text-neutral-800'
                            : 'bg-neutral-50 border-neutral-100 text-neutral-400 opacity-60'
                        }`}
                      >
                        <div className="size-5 rounded-full bg-white border border-neutral-200 flex items-center justify-center mx-auto mb-1 text-[10px] font-bold">
                          {isPassed ? (
                            <CheckCircle2 className="size-3.5 text-emerald-600" />
                          ) : (
                            idx + 1
                          )}
                        </div>
                        <div className="text-[11px] leading-tight font-bold">{stg.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Flight Dates & Escrow Protection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200">
                  <span className="text-neutral-400 block mb-0.5 text-[10px] font-medium">Flight Duration Schedule</span>
                  <span className="font-bold text-neutral-900 flex items-center gap-1.5">
                    <Calendar className="size-3.5 text-[#C62828]" />
                    {currentOrder.flightStartDate} → {currentOrder.flightEndDate}
                  </span>
                </div>
                <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200">
                  <span className="text-neutral-400 block mb-0.5 text-[10px] font-medium">Payment & Escrow Protection</span>
                  <span className="font-bold text-neutral-900 flex items-center gap-1.5 truncate">
                    <ShieldCheck className="size-3.5 text-emerald-600 shrink-0" />
                    {currentOrder.paymentMethod}
                  </span>
                </div>
              </div>

              {/* Creative Artwork Upload Portal */}
              <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-neutral-900 flex items-center gap-1.5">
                    <UploadCloud className="size-4 text-[#C62828]" />
                    <span>Creative Artwork & Digital Asset Delivery Portal</span>
                  </h4>
                  {currentOrder.artworkUploaded ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="size-3" /> Creative Approved
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                      Awaiting Advertiser Upload
                    </span>
                  )}
                </div>

                {currentOrder.artworkUploaded ? (
                  <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-neutral-200">
                    <img
                      src={currentOrder.artworkUrl}
                      alt="Uploaded Artwork"
                      className="size-14 rounded-lg object-cover border border-neutral-100"
                    />
                    <div className="text-xs space-y-0.5">
                      <div className="font-bold text-neutral-900">brand_campaign_keyart_4k.mp4</div>
                      <div className="text-[11px] text-neutral-500">
                        3840x2160 UHD • Rec.709 • Verified by QC Engine for Live Broadcast
                      </div>
                    </div>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => handleUploadSimulate(e, currentOrder.id)}
                    className="space-y-2 text-xs"
                  >
                    <p className="text-[11px] text-neutral-500">
                      Upload your high-res design file (TIFF, PDF for billboards, or MP4 for digital DOOH).
                    </p>
                    <div className="flex gap-2">
                      <input
                        value={sampleArtworkUrl}
                        onChange={(e) => setSampleArtworkUrl(e.target.value)}
                        placeholder="Image URL or Cloud Asset Link"
                        className="flex-1 h-9 px-3 rounded-xl border border-neutral-200 text-xs bg-white text-neutral-800 focus:outline-none focus:ring-1 focus:ring-[#C62828]"
                      />
                      <button
                        type="submit"
                        className="px-4 h-9 rounded-xl bg-[#C62828] hover:bg-[#B71C1C] text-white font-bold text-xs shrink-0"
                      >
                        Upload & Verify
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
