import React, { useState } from 'react';
import { useApp, DEMO_USERS } from '../context/AppContext';
import { Role } from '../types';
import {
  X,
  LogIn,
  UserPlus,
  Mail,
  Lock,
  User,
  Building2,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { toast } from 'sonner';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    login,
    register,
    setCurrentView,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'signin' | 'register'>('signin');

  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [selectedRoleHint, setSelectedRoleHint] = useState<Role>('buyer');

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regCompany, setRegCompany] = useState('');
  const [regRole, setRegRole] = useState<Role>('buyer');

  if (!isAuthModalOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInEmail.trim()) {
      toast.error('Please enter your email address.');
      return;
    }

    const res = login(signInEmail, signInPassword, selectedRoleHint);
    if (res.success) {
      toast.success(res.message || 'Signed in successfully.');
      setIsAuthModalOpen(false);
      setSignInEmail('');
      setSignInPassword('');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) {
      toast.error('Please fill in your name and email.');
      return;
    }

    const res = register(regName, regEmail, regPassword, regRole, regCompany);
    if (res.success) {
      toast.success(res.message);
      setIsAuthModalOpen(false);
      setRegName('');
      setRegEmail('');
      setRegPassword('');
      setRegCompany('');
    }
  };

  const handleQuickLogin = (userKey: 'admin' | 'buyer' | 'seller') => {
    const user = DEMO_USERS[userKey];
    const res = login(user.email, 'password123', user.role);
    if (res.success) {
      toast.success(res.message);
      setIsAuthModalOpen(false);
      if (user.role === 'admin') {
        setCurrentView('admin');
      } else if (user.role === 'seller') {
        setCurrentView('seller');
      } else {
        setCurrentView('buyer');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden">
        {/* Top Header */}
        <div className="relative bg-neutral-900 text-white p-6 sm:p-7">
          <button
            type="button"
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-5 right-5 size-8 rounded-full bg-neutral-800/80 hover:bg-neutral-800 text-neutral-400 hover:text-white grid place-items-center transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>

          <div className="flex items-center gap-3 mb-3">
            <BrandLogo variant="mark" size="sm" />
            <div>
              <span className="font-display font-black text-base tracking-tight text-white block">
                Mark@Ads Access
              </span>
              <span className="text-[10px] text-neutral-400 block">
                Global OOH & DOOH Marketplace
              </span>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight text-white">
            {activeTab === 'signin' ? 'Sign into your individual account' : 'Create your Mark@Ads account'}
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Access your campaigns, manage media spaces, or authenticate as master administrator.
          </p>

          {/* Tab Switcher */}
          <div className="flex p-1 bg-neutral-800/90 rounded-xl mt-5 border border-neutral-700/60">
            <button
              type="button"
              onClick={() => setActiveTab('signin')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'signin'
                  ? 'bg-[#C62828] text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <LogIn className="size-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'register'
                  ? 'bg-[#C62828] text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <UserPlus className="size-3.5" />
              <span>Create Account</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-6">
          {/* Quick Demo Switcher */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
              <span>1-Click Instant Sign In:</span>
              <span className="text-emerald-600 font-medium">Ready</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="p-2.5 rounded-xl border border-red-200/80 bg-red-50/50 hover:bg-red-50 text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#C62828] mb-0.5">
                  <ShieldCheck className="size-3.5 text-[#C62828]" />
                  <span>Master Admin</span>
                </div>
                <div className="text-[10px] text-neutral-500 truncate">markatads3377@...</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('buyer')}
                className="p-2.5 rounded-xl border border-blue-200/80 bg-blue-50/50 hover:bg-blue-50 text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 mb-0.5">
                  <ShoppingBag className="size-3.5 text-blue-600" />
                  <span>Advertiser</span>
                </div>
                <div className="text-[10px] text-neutral-500 truncate">Alex Morgan (Buyer)</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('seller')}
                className="p-2.5 rounded-xl border border-amber-200/80 bg-amber-50/50 hover:bg-amber-50 text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 mb-0.5">
                  <Building2 className="size-3.5 text-amber-600" />
                  <span>Media Owner</span>
                </div>
                <div className="text-[10px] text-neutral-500 truncate">Al-Khaleej (Seller)</div>
              </button>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-neutral-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-bold text-neutral-400 uppercase tracking-wider absolute">
              or enter credentials
            </span>
          </div>

          {/* Form */}
          {activeTab === 'signin' ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                  <input
                    type="email"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    placeholder="e.g. markatads3377@gmail.com or alex@brand.com"
                    required
                    className="w-full h-11 pl-10 pr-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white text-xs font-medium text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#C62828]/20 focus:border-[#C62828] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider block">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => toast.info('Default demo password is any password')}
                    className="text-[10px] font-semibold text-[#C62828] hover:underline"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                  <input
                    type="password"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full h-11 pl-10 pr-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white text-xs font-medium text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#C62828]/20 focus:border-[#C62828] transition-all"
                  />
                </div>
              </div>

              {/* Role Preference Hint */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider block">
                  Console Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRoleHint('buyer')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      selectedRoleHint === 'buyer'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    <ShoppingBag className="size-3.5" />
                    <span>Advertiser / Buyer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRoleHint('seller')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      selectedRoleHint === 'seller'
                        ? 'border-amber-600 bg-amber-50 text-amber-700'
                        : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    <Building2 className="size-3.5" />
                    <span>Media Owner / Seller</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-11 rounded-xl bg-[#C62828] hover:bg-[#B71C1C] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <LogIn className="size-4" />
                <span>Sign In to Account</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider block">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Alex Morgan"
                      required
                      className="w-full h-11 pl-10 pr-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white text-xs font-medium text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#C62828]/20 focus:border-[#C62828] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider block">
                    Company Name
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                    <input
                      type="text"
                      value={regCompany}
                      onChange={(e) => setRegCompany(e.target.value)}
                      placeholder="e.g. Apex Global Retail"
                      className="w-full h-11 pl-10 pr-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white text-xs font-medium text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#C62828]/20 focus:border-[#C62828] transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider block">
                  Work Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="e.g. user@company.com"
                    required
                    className="w-full h-11 pl-10 pr-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white text-xs font-medium text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#C62828]/20 focus:border-[#C62828] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Create a secure password"
                    className="w-full h-11 pl-10 pr-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white text-xs font-medium text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#C62828]/20 focus:border-[#C62828] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider block">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRegRole('buyer')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      regRole === 'buyer'
                        ? 'border-blue-600 bg-blue-50 text-blue-900'
                        : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                    }`}
                  >
                    <div className="font-bold text-xs">Advertiser / Brand</div>
                    <div className="text-[10px] text-neutral-500">I want to book billboards</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegRole('seller')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      regRole === 'seller'
                        ? 'border-amber-600 bg-amber-50 text-amber-900'
                        : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                    }`}
                  >
                    <div className="font-bold text-xs">Media Owner / Agency</div>
                    <div className="text-[10px] text-neutral-500">I want to list media assets</div>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-11 rounded-xl bg-[#C62828] hover:bg-[#B71C1C] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <UserPlus className="size-4" />
                <span>Create Account (+100 OOH Coins)</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
