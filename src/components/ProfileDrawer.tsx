import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  User,
  Mail,
  Building2,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Coins,
  Heart,
  Package,
  Layers,
  LogOut,
  LogIn,
  KeyRound,
  CheckCircle2,
  Lock,
  Edit2,
  Save,
  Crown,
  Sparkles,
  AlertTriangle,
  Trash2,
  Laptop,
  Smartphone,
  Eye,
  EyeOff,
  UserPlus,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { toast } from 'sonner';

export const ProfileDrawer: React.FC = () => {
  const {
    currentUser,
    isLoggedIn,
    isAdminAuthenticated,
    isProfileDrawerOpen,
    setIsProfileDrawerOpen,
    setIsAuthModalOpen,
    openAuthModal,
    loginWithGoogle,
    setIsAdminUnlockModalOpen,
    logout,
    lockAdmin,
    updateProfile,
    updatePassword,
    toggle2FA,
    deleteAccount,
    setCurrentView,
    role,
    setRole,
    userCoins,
    orders,
    wishlist,
    setIsOrdersOpen,
    setIsWishlistOpen,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'security'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editCompany, setEditCompany] = useState(currentUser?.company || '');
  const [editPhone, setEditPhone] = useState(currentUser?.phone || '');
  const [editBio, setEditBio] = useState(currentUser?.bio || '');

  // Change password state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmNewPass, setConfirmNewPass] = useState('');
  const [showNewPass, setShowNewPass] = useState(false);
  const [passError, setPassError] = useState<string | null>(null);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  if (!isProfileDrawerOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: editName,
      company: editCompany,
      phone: editPhone,
      bio: editBio,
    });
    setIsEditing(false);
    toast.success('Profile information updated successfully.');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(null);

    if (newPass !== confirmNewPass) {
      setPassError('New passwords do not match.');
      return;
    }

    if (newPass.length < 6) {
      setPassError('Password must be at least 6 characters.');
      return;
    }

    const res = updatePassword(currentPass, newPass);
    if (res.success) {
      toast.success(res.message);
      setCurrentPass('');
      setNewPass('');
      setConfirmNewPass('');
      setPassError(null);
    } else {
      setPassError(res.message || 'Failed to update password.');
    }
  };

  const handleLogoutClick = () => {
    logout();
    setIsProfileDrawerOpen(false);
    toast.info('You have been signed out.');
  };

  const userInitials = currentUser?.name
    ? currentUser.name
        .split(' ')
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'AP';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none animate-in fade-in duration-150">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsProfileDrawerOpen(false)}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <aside className="w-screen max-w-md bg-white border-l border-neutral-200 shadow-2xl flex flex-col justify-between overflow-y-auto z-50 animate-in slide-in-from-right duration-200">
          {/* Top Header */}
          <div className="p-5 border-b border-neutral-200 bg-neutral-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <BrandLogo variant="mark" size="sm" />
              <div>
                <span className="font-display font-black text-sm tracking-tight text-white block">
                  Individual Profile
                </span>
                <span className="text-[10px] text-neutral-400 block">
                  Mark@Ads Marketplace ID
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsProfileDrawerOpen(false)}
              className="size-8 rounded-full bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700 grid place-items-center transition-colors cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="p-5 space-y-6 flex-1 overflow-y-auto">
            {isLoggedIn && currentUser ? (
              <>
                {/* User Identity Card */}
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
                  <div className="flex items-center gap-3.5">
                    <div className="relative">
                      <div className="size-14 rounded-full bg-[#C62828] text-white font-extrabold text-lg grid place-items-center shadow-md">
                        {userInitials}
                      </div>
                      {isAdminAuthenticated && (
                        <span className="absolute -top-1 -right-1 size-5 rounded-full bg-amber-400 text-neutral-900 grid place-items-center shadow-xs text-[10px] font-black" title="Master Operations Admin">
                          👑
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-display font-bold text-base text-neutral-900 truncate">
                          {currentUser.name}
                        </h3>
                        {currentUser.isAdmin && (
                          <span className="px-1.5 py-0.2 rounded-full bg-red-100 text-[#C62828] text-[9px] font-extrabold uppercase">
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-500 truncate">{currentUser.email}</p>
                      <p className="text-[11px] font-semibold text-neutral-600 truncate mt-0.5">
                        {currentUser.company || 'Enterprise Partner'}
                      </p>
                    </div>
                  </div>

                  {/* Badges / Account status */}
                  <div className="pt-2 border-t border-neutral-200/80 flex flex-wrap items-center gap-1.5 text-[11px]">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="size-3" />
                      <span>Verified Identity</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-semibold flex items-center gap-1">
                      <ShieldCheck className="size-3" />
                      <span>Escrow Active</span>
                    </span>
                    {isAdminAuthenticated && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold flex items-center gap-1">
                        <Crown className="size-3 text-amber-600" />
                        <span>Master Ops</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Profile Tabs: Overview vs Security & Credentials */}
                <div className="flex p-1 bg-neutral-100 rounded-xl border border-neutral-200">
                  <button
                    type="button"
                    onClick={() => setActiveTab('overview')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      activeTab === 'overview'
                        ? 'bg-white text-neutral-900 shadow-2xs'
                        : 'text-neutral-500 hover:text-neutral-900'
                    }`}
                  >
                    <User className="size-3.5" />
                    <span>Overview</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('security')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      activeTab === 'security'
                        ? 'bg-white text-neutral-900 shadow-2xs'
                        : 'text-neutral-500 hover:text-neutral-900'
                    }`}
                  >
                    <KeyRound className="size-3.5" />
                    <span>Security & Credentials</span>
                  </button>
                </div>

                {activeTab === 'overview' ? (
                  <>
                    {/* Quick Metrics */}
                    <div className="grid grid-cols-3 gap-2 text-center select-none">
                      <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-100">
                        <div className="flex items-center justify-center gap-1 text-amber-700 text-xs font-bold mb-0.5">
                          <Coins className="size-3.5" />
                          <span>{userCoins}</span>
                        </div>
                        <div className="text-[10px] text-neutral-500 font-medium">OOH Coins</div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileDrawerOpen(false);
                          setIsOrdersOpen(true);
                        }}
                        className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100 hover:bg-blue-50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center justify-center gap-1 text-blue-700 text-xs font-bold mb-0.5">
                          <Package className="size-3.5" />
                          <span>{orders.length}</span>
                        </div>
                        <div className="text-[10px] text-neutral-500 font-medium">Bookings</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileDrawerOpen(false);
                          setIsWishlistOpen(true);
                        }}
                        className="p-2.5 rounded-xl bg-rose-50/60 border border-rose-100 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center justify-center gap-1 text-rose-700 text-xs font-bold mb-0.5">
                          <Heart className="size-3.5" />
                          <span>{wishlist.length}</span>
                        </div>
                        <div className="text-[10px] text-neutral-500 font-medium">Saved</div>
                      </button>
                    </div>

                    {/* Console Navigation */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                        Workspace Navigation
                      </label>
                      <div className="space-y-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setRole('buyer');
                            setCurrentView('buyer');
                            setIsProfileDrawerOpen(false);
                          }}
                          className={`w-full p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                            role === 'buyer'
                              ? 'border-blue-500 bg-blue-50 text-blue-900 shadow-2xs'
                              : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <ShoppingBag className="size-4 text-blue-600" />
                            <span>Advertiser / Buyer Cockpit</span>
                          </div>
                          <span className="text-[10px] text-neutral-400 font-mono">Campaigns</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setRole('seller');
                            setCurrentView('seller');
                            setIsProfileDrawerOpen(false);
                          }}
                          className={`w-full p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                            role === 'seller'
                              ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-2xs'
                              : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Building2 className="size-4 text-amber-600" />
                            <span>Media Owner Operating System</span>
                          </div>
                          <span className="text-[10px] text-neutral-400 font-mono">Inventory</span>
                        </button>

                        {/* Master Admin Button - ONLY IF ADMIN AUTHENTICATED */}
                        {isAdminAuthenticated && (
                          <div className="space-y-1">
                            <button
                              type="button"
                              onClick={() => {
                                setRole('admin');
                                setCurrentView('admin');
                                setIsProfileDrawerOpen(false);
                              }}
                              className={`w-full p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                                role === 'admin'
                                  ? 'border-red-600 bg-red-50 text-[#C62828] shadow-2xs'
                                  : 'border-red-200 bg-red-50/40 text-[#C62828] hover:bg-red-50'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <ShieldCheck className="size-4 text-[#C62828]" />
                                <span>Master Admin Panel</span>
                              </div>
                              <span className="px-1.5 py-0.5 rounded-full bg-[#C62828] text-white text-[9px] font-bold">
                                Active
                              </span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                lockAdmin();
                                toast.info('Admin operations locked.');
                              }}
                              className="w-full py-1 text-[11px] text-neutral-400 hover:text-neutral-700 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                            >
                              <Lock className="size-3" />
                              <span>Lock Admin Console (Hide from view)</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Edit Profile Form */}
                    <div className="space-y-2 pt-2 border-t border-neutral-200">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                          Account Details
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditing(!isEditing);
                            setEditName(currentUser.name);
                            setEditCompany(currentUser.company || '');
                            setEditPhone(currentUser.phone || '');
                            setEditBio(currentUser.bio || '');
                          }}
                          className="text-xs font-semibold text-[#C62828] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Edit2 className="size-3" />
                          <span>{isEditing ? 'Cancel' : 'Edit'}</span>
                        </button>
                      </div>

                      {isEditing ? (
                        <form onSubmit={handleSaveProfile} className="space-y-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-neutral-500 uppercase">Full Name</label>
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full h-8 px-2.5 rounded-lg border border-neutral-200 bg-white text-xs font-medium focus:outline-none focus:border-[#C62828]"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-neutral-500 uppercase">Company</label>
                            <input
                              type="text"
                              value={editCompany}
                              onChange={(e) => setEditCompany(e.target.value)}
                              className="w-full h-8 px-2.5 rounded-lg border border-neutral-200 bg-white text-xs font-medium focus:outline-none focus:border-[#C62828]"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-neutral-500 uppercase">Phone Number</label>
                            <input
                              type="text"
                              value={editPhone}
                              onChange={(e) => setEditPhone(e.target.value)}
                              placeholder="+971 50 000 0000"
                              className="w-full h-8 px-2.5 rounded-lg border border-neutral-200 bg-white text-xs font-medium focus:outline-none focus:border-[#C62828]"
                            />
                          </div>

                          <button
                            type="submit"
                            className="w-full py-1.5 rounded-lg bg-[#C62828] text-white text-xs font-bold hover:bg-[#B71C1C] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Save className="size-3.5" />
                            <span>Save Changes</span>
                          </button>
                        </form>
                      ) : (
                        <div className="p-3 bg-neutral-50/70 rounded-xl border border-neutral-200/80 text-xs space-y-1.5">
                          <div className="flex items-center justify-between text-neutral-600">
                            <span className="text-neutral-400">Company:</span>
                            <span className="font-semibold text-neutral-800">{currentUser.company || 'Not set'}</span>
                          </div>
                          <div className="flex items-center justify-between text-neutral-600">
                            <span className="text-neutral-400">Phone:</span>
                            <span className="font-semibold text-neutral-800">{currentUser.phone || '+1 (555) 019-2831'}</span>
                          </div>
                          <div className="flex items-center justify-between text-neutral-600">
                            <span className="text-neutral-400">Member Since:</span>
                            <span className="font-mono text-neutral-800">{currentUser.joinedDate || '2026'}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Switch Account */}
                    <div className="pt-2 border-t border-neutral-200">
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileDrawerOpen(false);
                          openAuthModal('signin');
                        }}
                        className="w-full py-2 px-3 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-xs font-semibold text-neutral-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <User className="size-3.5 text-neutral-500" />
                        <span>Sign In with Another Account</span>
                      </button>
                    </div>
                  </>
                ) : (
                  /* Security & Credentials Tab */
                  <div className="space-y-4 animate-in fade-in duration-100">
                    {/* Authentication Provider Card */}
                    <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                          Sign-in Method
                        </span>
                        {currentUser.authProvider === 'google' ? (
                          <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold flex items-center gap-1">
                            <svg className="size-3" viewBox="0 0 24 24">
                              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                            </svg>
                            <span>Google Account</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200 text-[10px] font-bold flex items-center gap-1">
                            <Mail className="size-3" />
                            <span>Work Email & Password</span>
                          </span>
                        )}
                      </div>
                      <div className="text-xs">
                        <div className="text-neutral-500 font-mono text-[11px] truncate">{currentUser.email}</div>
                        <div className="text-neutral-400 text-[10px] mt-0.5">Account ID: {currentUser.id}</div>
                      </div>
                    </div>

                    {/* Change Password Form */}
                    <div className="p-4 rounded-2xl bg-neutral-50/70 border border-neutral-200 space-y-3">
                      <div className="flex items-center gap-2">
                        <Lock className="size-4 text-neutral-700" />
                        <h4 className="text-xs font-bold text-neutral-900">Change Account Password</h4>
                      </div>

                      {passError && (
                        <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-1.5">
                          <AlertTriangle className="size-4 text-rose-600 shrink-0 mt-0.5" />
                          <span>{passError}</span>
                        </div>
                      )}

                      <form onSubmit={handleChangePassword} className="space-y-2.5">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-neutral-500 uppercase">Current Password</label>
                          <input
                            type="password"
                            value={currentPass}
                            onChange={(e) => setCurrentPass(e.target.value)}
                            placeholder="Enter current password"
                            className="w-full h-8.5 px-3 rounded-xl border border-neutral-200 bg-white text-xs font-medium focus:outline-none focus:border-[#C62828]"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-neutral-500 uppercase">New Password</label>
                          <div className="relative">
                            <input
                              type={showNewPass ? 'text' : 'password'}
                              value={newPass}
                              onChange={(e) => setNewPass(e.target.value)}
                              placeholder="Min. 6 characters"
                              className="w-full h-8.5 pl-3 pr-8 rounded-xl border border-neutral-200 bg-white text-xs font-medium focus:outline-none focus:border-[#C62828]"
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPass(!showNewPass)}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                            >
                              {showNewPass ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-neutral-500 uppercase">Confirm New Password</label>
                          <input
                            type={showNewPass ? 'text' : 'password'}
                            value={confirmNewPass}
                            onChange={(e) => setConfirmNewPass(e.target.value)}
                            placeholder="Re-type new password"
                            className="w-full h-8.5 px-3 rounded-xl border border-neutral-200 bg-white text-xs font-medium focus:outline-none focus:border-[#C62828]"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-bold transition-colors cursor-pointer mt-1"
                        >
                          Update Password
                        </button>
                      </form>
                    </div>

                    {/* Two-Factor Authentication (2FA) */}
                    <div className="p-4 rounded-2xl bg-neutral-50/70 border border-neutral-200 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="size-4 text-emerald-600" />
                          <div>
                            <h4 className="text-xs font-bold text-neutral-900">Two-Factor Authentication</h4>
                            <p className="text-[10px] text-neutral-500">Protect bookings and payout approvals</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            toggle2FA();
                            toast.success(
                              currentUser.twoFactorEnabled
                                ? 'Two-Factor Authentication disabled.'
                                : 'Two-Factor Authentication enabled with OTP security.'
                            );
                          }}
                          className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                            currentUser.twoFactorEnabled
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-neutral-200 text-neutral-700 border-neutral-300 hover:bg-neutral-300'
                          }`}
                        >
                          {currentUser.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                        </button>
                      </div>
                    </div>

                    {/* Active Sessions & Devices */}
                    <div className="p-4 rounded-2xl bg-neutral-50/70 border border-neutral-200 space-y-2.5">
                      <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">
                        Active Devices & Sessions
                      </span>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <div className="size-8 rounded-xl bg-neutral-200 grid place-items-center text-neutral-700">
                            <Laptop className="size-4" />
                          </div>
                          <div>
                            <div className="font-bold text-neutral-900">Current Web Session</div>
                            <div className="text-[10px] text-neutral-500 font-mono">Chrome / Edge • Active Now</div>
                          </div>
                        </div>
                        <span className="size-2 rounded-full bg-emerald-500 animate-pulse" title="Active session" />
                      </div>
                    </div>

                    {/* Danger Zone: Account Deletion */}
                    <div className="p-4 rounded-2xl border border-rose-200 bg-rose-50/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider">
                          Danger Zone
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-600 leading-relaxed">
                        Permanently purge your account credentials, preferences, and saved campaign media items.
                      </p>
                      {isDeletingAccount ? (
                        <div className="p-3 bg-white rounded-xl border border-rose-300 space-y-2">
                          <p className="text-xs font-bold text-rose-700">Are you sure? This cannot be undone.</p>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                deleteAccount();
                                toast.success('Your account has been deleted.');
                              }}
                              className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg cursor-pointer"
                            >
                              Yes, Delete Account
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsDeletingAccount(false)}
                              className="px-3 py-1.5 border border-neutral-200 text-xs font-bold text-neutral-700 rounded-lg cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setIsDeletingAccount(true)}
                          className="w-full py-1.5 px-3 rounded-xl border border-rose-200 bg-white hover:bg-rose-50 text-rose-700 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Trash2 className="size-3.5 text-rose-600" />
                          <span>Delete Account & Purge Data</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Logged Out View */
              <div className="p-6 text-center space-y-4 my-auto">
                <div className="size-16 rounded-3xl bg-neutral-100 text-neutral-400 grid place-items-center mx-auto">
                  <User className="size-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-base text-neutral-900">
                    Not Signed In
                  </h3>
                  <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                    Sign in or create your free account to access your individual campaign flights, track live sightings, and manage media spaces.
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileDrawerOpen(false);
                      openAuthModal('signin');
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-black text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <LogIn className="size-4" />
                    <span>Sign In to Account</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileDrawerOpen(false);
                      openAuthModal('register');
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#C62828] hover:bg-[#B71C1C] text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <UserPlus className="size-4" />
                    <span>Create Free Account (+100 Bonus Coins)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileDrawerOpen(false);
                      loginWithGoogle();
                    }}
                    className="w-full py-2 px-4 rounded-xl border border-neutral-300 hover:bg-neutral-50 text-neutral-800 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2.5 mt-2"
                  >
                    <svg className="size-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span>Continue with Google</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Logout Button */}
          {isLoggedIn && (
            <div className="p-4 border-t border-neutral-200 bg-neutral-50/80">
              <button
                type="button"
                onClick={handleLogoutClick}
                className="w-full h-10 rounded-xl border border-rose-200 bg-white hover:bg-rose-50 text-rose-700 font-bold text-xs shadow-2xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="size-4 text-rose-600" />
                <span>Log Out of Mark@Ads</span>
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
