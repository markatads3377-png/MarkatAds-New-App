import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Layers,
  ShoppingBag,
  Users,
  Settings,
  Search,
  CheckCircle2,
  Trash2,
  Edit3,
  Plus,
  Radio,
  BadgePercent,
  Sparkles,
  MapPin,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ConsoleModeToggle } from './ConsoleModeToggle';
import { toast } from 'sonner';

export const AdminPortal: React.FC = () => {
  const {
    catalog,
    deleteListing,
    toggleFeatureListing,
    toggleAvailableListing,
    orders,
    formatMoney,
    platformTakeRate,
    setPlatformTakeRate,
    maintenanceMode,
    setMaintenanceMode,
    announcementText,
    setAnnouncementText,
    username,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'kpi' | 'listings' | 'users' | 'settings'>('kpi');
  const [searchListing, setSearchListing] = useState('');

  // Sample users
  const [users, setUsers] = useState([
    { id: '1', name: 'Master Administrator', username: 'admin', email: 'admin@markatads.com', role: 'admin', status: 'active', company: 'Platform HQ' },
    { id: '2', name: 'Al-Khaleej Media Group', username: 'alkhaleej_owner', email: 'sales@alkhaleej.ae', role: 'seller', status: 'active', company: 'Al-Khaleej Outdoor' },
    { id: '3', name: 'PrimeMedia Manhattan', username: 'primemedia_ny', email: 'ny@primemedia.com', role: 'seller', status: 'active', company: 'PrimeMedia LLC' },
    { id: '4', name: 'Alex Morgan', username: 'alex_buyer', email: 'alex@brandglobal.com', role: 'buyer', status: 'active', company: 'Apex Global Retail' },
    { id: '5', name: 'Elena Rostova', username: 'elena_bmw', email: 'elena.rostova@bmwgroup.com', role: 'buyer', status: 'active', company: 'BMW Group' },
  ]);

  const filteredCatalog = catalog.filter((l) =>
    l.title.toLowerCase().includes(searchListing.toLowerCase()) ||
    l.city.toLowerCase().includes(searchListing.toLowerCase())
  );

  const toggleUserStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u
      )
    );
    toast.success('User access status updated.');
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
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Master Admin Level 4 Clearance</span>
          </span>
        </div>
      </div>

      {/* Admin Dark Ops Banner */}
      <div className="rounded-3xl border border-neutral-800 bg-neutral-950 text-white p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30 flex items-center gap-1.5">
                <ShieldCheck className="size-3.5" />
                <span>Mark@Ads Operations Control</span>
              </span>
              <span className="text-neutral-500">•</span>
              <span className="text-neutral-300">Operator: @{username}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white">
              Platform Administration & Revenue Governance
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Global marketplace oversight: monitor overall Gross Merchandise Value (GMV), approve and verify billboard listings, regulate seller commission take rates, and manage user permissions.
            </p>
          </div>

          <ConsoleModeToggle variant="pill" />
        </div>
      </div>

      {/* Maintenance alert if active */}
      {maintenanceMode && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <AlertTriangle className="size-4 text-rose-600 shrink-0" />
            <span>Emergency Maintenance Mode Active: Public flight bookings and new submissions paused.</span>
          </div>
          <button
            type="button"
            onClick={() => setMaintenanceMode(false)}
            className="px-3 py-1 rounded-lg bg-rose-600 text-white font-bold text-xs"
          >
            Disable
          </button>
        </div>
      )}

      {/* Tabs Menu */}
      <div className="flex items-center gap-1 p-1 bg-white border border-neutral-200/90 rounded-2xl text-xs font-semibold overflow-x-auto shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveTab('kpi')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'kpi' ? 'bg-[#C62828] text-white shadow-xs font-bold' : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <TrendingUp className="size-3.5" />
          <span>Marketplace Metrics</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('listings')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'listings' ? 'bg-[#C62828] text-white shadow-xs font-bold' : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <Layers className="size-3.5" />
          <span>Listings & Approvals ({catalog.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('users')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'users' ? 'bg-[#C62828] text-white shadow-xs font-bold' : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <Users className="size-3.5" />
          <span>Partners & Users ({users.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'settings' ? 'bg-[#C62828] text-white shadow-xs font-bold' : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <Settings className="size-3.5" />
          <span>Platform Governance</span>
        </button>
      </div>

      {/* TAB 1: METRICS & GMV */}
      {activeTab === 'kpi' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs text-neutral-500 font-medium">
                <span>Total Marketplace GMV</span>
                <DollarSign className="size-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-neutral-900 font-display">
                $1,482,900
              </div>
              <p className="text-[11px] text-emerald-600 font-bold">+18.4% month-over-month</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs text-neutral-500 font-medium">
                <span>Net Operator Take</span>
                <BadgePercent className="size-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-[#C62828] font-display">
                ${Math.round(1482900 * (platformTakeRate / 100)).toLocaleString()}
              </div>
              <p className="text-[11px] text-neutral-400">Based on {platformTakeRate}% take rate</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs text-neutral-500 font-medium">
                <span>Active Spaces Fleet</span>
                <Radio className="size-4 text-blue-600" />
              </div>
              <div className="text-2xl font-black text-neutral-900 font-display">
                {catalog.length} Spaces
              </div>
              <p className="text-[11px] text-neutral-400">{catalog.filter(l => l.featured).length} featured showcases</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs text-neutral-500 font-medium">
                <span>Total Flight Bookings</span>
                <ShoppingBag className="size-4 text-purple-600" />
              </div>
              <div className="text-2xl font-black text-neutral-900 font-display">
                {orders.length} Flights
              </div>
              <p className="text-[11px] text-neutral-400">Escrow backed and verified</p>
            </div>
          </div>

          {/* Revenue Distribution Breakdown */}
          <div className="p-5 rounded-3xl border border-neutral-200 bg-white shadow-2xs space-y-4">
            <h3 className="font-bold text-sm text-neutral-900 font-display">
              Media Mediums Booking Allocation
            </h3>
            <div className="space-y-3 text-xs">
              {[
                { format: 'Digital LED Spectaculars & 3D DOOH', amount: '$741,450', pct: 50, color: 'bg-[#C62828]' },
                { format: 'Highway Unipoles & Static Hoardings', amount: '$370,725', pct: 25, color: 'bg-blue-600' },
                { format: 'International Airport Concourses', amount: '$222,435', pct: 15, color: 'bg-amber-500' },
                { format: 'Transit & Metro Escalator Ribbons', amount: '$148,290', pct: 10, color: 'bg-emerald-600' },
              ].map((row) => (
                <div key={row.format} className="space-y-1.5">
                  <div className="flex justify-between font-medium">
                    <span className="text-neutral-800">{row.format}</span>
                    <strong className="text-neutral-900">{row.amount} ({row.pct}%)</strong>
                  </div>
                  <div className="h-2 w-full rounded-full bg-neutral-100 overflow-hidden">
                    <div className={`h-full rounded-full ${row.color}`} style={{ width: `${row.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LISTINGS OVERVIEW & CONTROLS */}
      {activeTab === 'listings' && (
        <div className="p-5 rounded-3xl border border-neutral-200 bg-white shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-sm text-neutral-900 font-display">
                All Marketplace Media Listings ({catalog.length})
              </h3>
              <p className="text-xs text-neutral-500">
                Grant featured status, pause listings, or moderate inventory pricing.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                value={searchListing}
                onChange={(e) => setSearchListing(e.target.value)}
                placeholder="Filter by title or city..."
                className="w-full h-8 pl-8 pr-3 rounded-xl border border-neutral-200 text-xs bg-neutral-50"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50 text-neutral-500 font-semibold">
                  <th className="p-3">Space Title</th>
                  <th className="p-3">City / Hub</th>
                  <th className="p-3">Format</th>
                  <th className="p-3">Rate</th>
                  <th className="p-3">Featured</th>
                  <th className="p-3">Availability</th>
                  <th className="p-3 text-right">Admin Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-neutral-800">
                {filteredCatalog.map((item) => (
                  <tr key={item.id} className="hover:bg-neutral-50/60">
                    <td className="p-3 font-semibold text-neutral-900">
                      {item.title}
                      <span className="block text-[10px] text-neutral-400 font-normal">{item.sellerName}</span>
                    </td>
                    <td className="p-3">{item.city}, {item.country}</td>
                    <td className="p-3 capitalize">{item.medium.replace('_', ' ')}</td>
                    <td className="p-3 font-bold font-display">{formatMoney(item.pricePerMonth, item.currency)}/mo</td>
                    <td className="p-3">
                      <button
                        type="button"
                        onClick={() => {
                          toggleFeatureListing(item.id);
                          toast.success('Featured status toggled');
                        }}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border transition-colors ${
                          item.featured
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : 'bg-neutral-50 text-neutral-500 border-neutral-200'
                        }`}
                      >
                        {item.featured ? 'Featured' : 'Standard'}
                      </button>
                    </td>
                    <td className="p-3">
                      <button
                        type="button"
                        onClick={() => {
                          toggleAvailableListing(item.id);
                          toast.success('Availability status toggled');
                        }}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border transition-colors ${
                          item.available
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-neutral-100 text-neutral-500 border-neutral-200'
                        }`}
                      >
                        {item.available ? 'Live' : 'Paused'}
                      </button>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm('Delete this space from marketplace?')) deleteListing(item.id);
                        }}
                        className="text-rose-500 hover:text-rose-600 p-1"
                        title="Delete Space"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: USERS & PARTNERS */}
      {activeTab === 'users' && (
        <div className="p-5 rounded-3xl border border-neutral-200 bg-white shadow-2xs space-y-4">
          <h3 className="font-bold text-sm text-neutral-900 font-display">
            Registered Partners & User Accounts ({users.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50 text-neutral-500 font-semibold">
                  <th className="p-3">User / Organization</th>
                  <th className="p-3">Email Address</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Access Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-neutral-800">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-neutral-50/60">
                    <td className="p-3 font-semibold text-neutral-900">
                      {u.name}
                      <span className="block text-[11px] text-neutral-400 font-normal">@{u.username} • {u.company}</span>
                    </td>
                    <td className="p-3 font-mono">{u.email}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-neutral-100 text-neutral-700">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        type="button"
                        onClick={() => toggleUserStatus(u.id)}
                        className="text-xs font-bold text-neutral-600 hover:text-neutral-900"
                      >
                        {u.status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: PLATFORM GOVERNANCE */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-3xl border border-neutral-200 bg-white shadow-2xs space-y-4">
            <h3 className="font-bold text-sm text-neutral-900 font-display">
              Marketplace Commission Take Rate
            </h3>
            <p className="text-xs text-neutral-500">
              Platform transaction fee automatically deducted from gross media owner flight receipts.
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between font-bold">
                <span>Commission Percentage</span>
                <span className="text-sm font-black text-[#C62828] font-display">{platformTakeRate}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={20}
                step={0.5}
                value={platformTakeRate}
                onChange={(e) => setPlatformTakeRate(Number(e.target.value))}
                className="w-full"
              />
              <span className="text-[11px] text-neutral-400 block">Industry standard: 7.5% - 10.0%</span>
            </div>

            <button
              type="button"
              onClick={() => toast.success(`Platform take rate saved to ${platformTakeRate}%`)}
              className="h-8 px-4 rounded-xl bg-[#C62828] text-white font-bold text-xs"
            >
              Save Take Rate
            </button>
          </div>

          <div className="p-5 rounded-3xl border border-neutral-200 bg-white shadow-2xs space-y-4">
            <h3 className="font-bold text-sm text-neutral-900 font-display">
              Global Platform Broadcast Announcement
            </h3>
            <p className="text-xs text-neutral-500">
              Banner text displayed across the top of all user sessions and marketplaces.
            </p>

            <div className="space-y-1.5 text-xs">
              <label className="font-semibold text-neutral-700">Announcement Banner</label>
              <textarea
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                rows={2}
                className="w-full p-2.5 rounded-xl border border-neutral-200 text-xs bg-neutral-50"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={maintenanceMode}
                  onChange={(e) => setMaintenanceMode(e.target.checked)}
                  className="rounded text-[#C62828]"
                />
                <span className="font-bold text-rose-600">Enable Maintenance Mode Lock</span>
              </label>

              <button
                type="button"
                onClick={() => toast.success('Announcement broadcasted across live user sessions!')}
                className="h-8 px-4 rounded-xl bg-neutral-900 text-white font-bold text-xs"
              >
                Broadcast
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
