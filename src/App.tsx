import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { SiteHeader } from './components/SiteHeader';
import { HomeView } from './components/HomeView';
import { BrowseView } from './components/BrowseView';
import { BuyerPortal } from './components/BuyerPortal';
import { SellerPortal } from './components/SellerPortal';
import { AdminPortal } from './components/AdminPortal';
import { CommunityFeed } from './components/CommunityFeed';
import { PricingView } from './components/PricingView';
import { MediaDetailModal } from './components/MediaDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { CompareDrawer } from './components/CompareDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { OrdersTrackerModal } from './components/OrdersTrackerModal';
import { CloudflareDeploymentModal } from './components/CloudflareDeploymentModal';
import { Toaster } from 'sonner';
import { Cloud, GitBranch, ShieldCheck } from 'lucide-react';

function AppContent() {
  const { currentView, setCurrentView, setIsDeployModalOpen } = useApp();

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-neutral-900 flex flex-col font-sans selection:bg-red-100 selection:text-[#C62828]">
      {/* Main Navigation Header directly at top as in user screenshot */}
      <SiteHeader />

      {/* Main Body Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {currentView === 'home' && <HomeView />}
        {currentView === 'browse' && <BrowseView />}
        {currentView === 'buyer' && <BuyerPortal />}
        {currentView === 'seller' && <SellerPortal />}
        {currentView === 'admin' && <AdminPortal />}
        {currentView === 'feed' && <CommunityFeed />}
        {currentView === 'pricing' && <PricingView />}
      </main>

      {/* Global Footer */}
      <footer className="w-full border-t border-neutral-200 bg-white py-10 px-4 sm:px-6 text-xs text-neutral-500 mt-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="space-y-3 lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-xl font-display text-xs font-black text-white bg-[#C62828] shadow-xs">
                MA
              </span>
              <span className="font-display text-base font-black tracking-tight text-neutral-900">
                Mark@Ads
              </span>
            </div>
            <p className="text-xs text-neutral-500 max-w-sm leading-relaxed">
              Global marketplace connecting brand advertisers, media buying agencies, and out-of-home screen operators with 100% verified escrow protection.
            </p>
            <div className="flex items-center gap-2 pt-1 text-emerald-600 font-semibold text-[11px]">
              <ShieldCheck className="size-3.5" />
              <span>Bank-Grade Escrow & Automated Proof-of-Play Verification</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-1.5">
              <li>
                <button type="button" onClick={() => setCurrentView('browse')} className="hover:text-neutral-900">
                  Browse Catalog
                </button>
              </li>
              <li>
                <button type="button" onClick={() => setCurrentView('feed')} className="hover:text-neutral-900">
                  Community Feed & Sightings
                </button>
              </li>
              <li>
                <button type="button" onClick={() => setCurrentView('pricing')} className="hover:text-neutral-900">
                  Plans & Pricing
                </button>
              </li>
              <li>
                <button type="button" onClick={() => setIsDeployModalOpen(true)} className="hover:text-neutral-900 flex items-center gap-1">
                  <span>Cloudflare & GitHub Setup</span>
                  <span className="text-[10px] text-orange-500 font-bold">New</span>
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider">Consoles</h4>
            <ul className="space-y-1.5">
              <li>
                <button type="button" onClick={() => setCurrentView('buyer')} className="hover:text-neutral-900">
                  Advertiser Flight Cockpit
                </button>
              </li>
              <li>
                <button type="button" onClick={() => setCurrentView('seller')} className="hover:text-neutral-900">
                  Media Owner Operating System
                </button>
              </li>
              <li>
                <button type="button" onClick={() => setCurrentView('admin')} className="hover:text-neutral-900">
                  Master Operations Admin
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider">Deployment</h4>
            <p className="text-[11px] text-neutral-500 leading-snug">
              Connected to GitHub repository. Built for Cloudflare Pages edge delivery with custom domain mapping.
            </p>
            <button
              type="button"
              onClick={() => setIsDeployModalOpen(true)}
              className="mt-1 px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-[11px] flex items-center gap-1.5 transition-colors"
            >
              <GitBranch className="size-3 text-[#C62828]" />
              <span>CI/CD Setup Guide</span>
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-neutral-100 mt-8 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-neutral-400">
          <span>© 2026 Mark@Ads. All rights reserved. Global OOH & DOOH Marketplace.</span>
          <span>Fast Load Times • Zero Bloat • Cloudflare Edge Ready</span>
        </div>
      </footer>

      {/* Global Modals & Drawers */}
      <MediaDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <CompareDrawer />
      <WishlistDrawer />
      <OrdersTrackerModal />
      <CloudflareDeploymentModal />
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
