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
    setIsAdminUnlockModalOpen,
    logout,
    lockAdmin,
    updateProfile,
    setCurrentView,
    role,
    setRole,
    userCoins,
    orders,
    wishlist,
    setIsOrdersOpen,
    setIsWishlistOpen,
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editCompany, setEditCompany] = useState(currentUser?.company || '');
  const [editPhone, setEditPhone] = useState(currentUser?.phone || '');
  const [editBio, setEditBio] = useState(currentUser?.bio || '');

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

                {/* Switch Demo Profile */}
                <div className="pt-2 border-t border-neutral-200">
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileDrawerOpen(false);
                      setIsAuthModalOpen(true);
                    }}
                    className="w-full py-2 px-3 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-xs font-semibold text-neutral-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <User className="size-3.5 text-neutral-500" />
                    <span>Switch Account / Sign in as other role</span>
                  </button>
                </div>
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
                    Sign in to access your individual campaign flights, track live sightings, and manage media spaces.
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileDrawerOpen(false);
                      setIsAuthModalOpen(true);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#C62828] hover:bg-[#B71C1C] text-white font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <LogIn className="size-4" />
                    <span>Sign In / Create Account</span>
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
