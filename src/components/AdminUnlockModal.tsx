import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Lock, X, KeyRound, AlertCircle, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export const AdminUnlockModal: React.FC = () => {
  const {
    isAdminUnlockModalOpen,
    setIsAdminUnlockModalOpen,
    unlockAdmin,
    setCurrentView,
  } = useApp();

  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isAdminUnlockModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = unlockAdmin(passcode);
    if (result.success) {
      toast.success('Admin authorization granted. Welcome to Master Operations.');
      setIsAdminUnlockModalOpen(false);
      setCurrentView('admin');
      setPasscode('');
    } else {
      setError(result.message || 'Invalid passcode.');
    }
  };

  const handleQuickAuthorizeOwner = () => {
    const result = unlockAdmin('markatads2026');
    if (result.success) {
      toast.success('Verified owner access (markatads3377@gmail.com). Admin panel unlocked!');
      setIsAdminUnlockModalOpen(false);
      setCurrentView('admin');
      setPasscode('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl p-6 sm:p-7 text-white overflow-hidden">
        {/* Ambient red glow */}
        <div className="absolute -top-24 -right-24 size-48 bg-[#C62828]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            setIsAdminUnlockModalOpen(false);
            setError(null);
            setPasscode('');
          }}
          className="absolute top-5 right-5 size-8 rounded-full bg-neutral-800/80 hover:bg-neutral-800 text-neutral-400 hover:text-white grid place-items-center transition-colors cursor-pointer"
        >
          <X className="size-4" />
        </button>

        {/* Header */}
        <div className="space-y-2 mb-6">
          <div className="size-12 rounded-2xl bg-[#C62828]/20 border border-[#C62828]/40 grid place-items-center text-[#C62828] mb-4">
            <Lock className="size-6" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-950/80 border border-red-800/60 text-[#EF5350] text-[10px] font-bold uppercase tracking-wider">
            <ShieldCheck className="size-3" />
            <span>Authorized Personnel Only</span>
          </div>
          <h3 className="text-xl font-black font-display tracking-tight text-white">
            Master Admin Clearance
          </h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            The platform operations console is restricted exclusively to Mark@Ads administrators. Enter your security passcode or authorize with your owner account.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
              Admin Passcode
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
              <input
                type="password"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Enter master admin passcode..."
                autoFocus
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-neutral-700 bg-neutral-800/80 text-white placeholder:text-neutral-500 text-sm font-mono tracking-widest focus:outline-none focus:border-[#C62828] focus:ring-2 focus:ring-[#C62828]/30 transition-all"
              />
            </div>
            {error && (
              <div className="flex items-center gap-1.5 text-xs text-red-400 pt-1">
                <AlertCircle className="size-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full h-11 rounded-xl bg-[#C62828] hover:bg-[#B71C1C] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-900/40 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <ShieldCheck className="size-4" />
            <span>Unlock Admin Operations</span>
          </button>
        </form>

        {/* 1-Click Owner Authorization */}
        <div className="mt-5 pt-5 border-t border-neutral-800/80 space-y-2">
          <div className="text-[11px] font-semibold text-neutral-400 flex items-center justify-between">
            <span>Primary Platform Owner:</span>
            <span className="text-neutral-300 font-mono">markatads3377@gmail.com</span>
          </div>
          <button
            type="button"
            onClick={handleQuickAuthorizeOwner}
            className="w-full py-2.5 px-3 rounded-xl border border-neutral-700 hover:border-neutral-600 bg-neutral-800/40 hover:bg-neutral-800 text-xs font-semibold text-neutral-200 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Sparkles className="size-3.5 text-amber-400" />
            <span>1-Click Authorize as markatads3377@gmail.com</span>
          </button>
          <p className="text-[10px] text-neutral-500 text-center">
            Default emergency master key: <code className="text-neutral-400">markatads2026</code>
          </p>
        </div>
      </div>
    </div>
  );
};
