import React from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Building2, ShieldCheck, ArrowRight } from 'lucide-react';
import { Role } from '../types';

interface ConsoleModeToggleProps {
  variant?: 'compact' | 'pill' | 'banner';
}

export const ConsoleModeToggle: React.FC<ConsoleModeToggleProps> = ({ variant = 'compact' }) => {
  const { role, setRole, setCurrentView, currentView } = useApp();

  const handleSelectRole = (newRole: Role) => {
    setRole(newRole);
    if (newRole === 'buyer') {
      setCurrentView('buyer');
    } else if (newRole === 'seller') {
      setCurrentView('seller');
    } else if (newRole === 'admin') {
      setCurrentView('admin');
    }
  };

  if (variant === 'compact') {
    return (
      <div className="inline-flex items-center p-1 rounded-xl bg-neutral-100 border border-neutral-200/90 shadow-xs text-xs font-semibold select-none">
        <button
          type="button"
          onClick={() => handleSelectRole('buyer')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
            role === 'buyer' && (currentView === 'buyer' || currentView === 'home' || currentView === 'browse')
              ? 'bg-white text-[#C62828] shadow-xs font-bold'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
          title="Switch to Advertiser / Buyer Console"
        >
          <ShoppingBag className="w-3.5 h-3.5 text-blue-600" />
          <span>Buyer</span>
          {role === 'buyer' && <span className="size-1.5 rounded-full bg-blue-600 animate-pulse ml-0.5" />}
        </button>
        <button
          type="button"
          onClick={() => handleSelectRole('seller')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
            role === 'seller' || currentView === 'seller'
              ? 'bg-white text-[#C62828] shadow-xs font-bold'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
          title="Switch to Media Owner / Seller Console"
        >
          <Building2 className="w-3.5 h-3.5 text-amber-500" />
          <span>Seller</span>
          {role === 'seller' && <span className="size-1.5 rounded-full bg-amber-500 animate-pulse ml-0.5" />}
        </button>
        <button
          type="button"
          onClick={() => handleSelectRole('admin')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
            role === 'admin' || currentView === 'admin'
              ? 'bg-[#C62828] text-white shadow-xs font-bold'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
          title="Switch to Master Operations Admin Console"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Admin</span>
        </button>
      </div>
    );
  }

  // Pill variant
  return (
    <div className="flex flex-col sm:flex-row items-center gap-2 p-1.5 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl text-xs select-none">
      <button
        type="button"
        onClick={() => handleSelectRole('buyer')}
        className={`w-full sm:w-auto flex items-center justify-center gap-2.5 px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
          role === 'buyer'
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
            : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
        }`}
      >
        <ShoppingBag className="w-4 h-4" />
        <div className="text-left">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-xs">Buyer Console</span>
            {role === 'buyer' && (
              <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[9px] font-extrabold uppercase">
                Active
              </span>
            )}
          </div>
          <div className="text-[10px] opacity-75 hidden md:block">Campaigns & Flights</div>
        </div>
      </button>

      <button
        type="button"
        onClick={() => handleSelectRole('seller')}
        className={`w-full sm:w-auto flex items-center justify-center gap-2.5 px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
          role === 'seller'
            ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md'
            : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
        }`}
      >
        <Building2 className="w-4 h-4" />
        <div className="text-left">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-xs">Seller Console</span>
            {role === 'seller' && (
              <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[9px] font-extrabold uppercase">
                Active
              </span>
            )}
          </div>
          <div className="text-[10px] opacity-75 hidden md:block">Listings & Revenue</div>
        </div>
      </button>

      <button
        type="button"
        onClick={() => handleSelectRole('admin')}
        className={`w-full sm:w-auto flex items-center justify-center gap-2 px-3 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
          role === 'admin'
            ? 'bg-[#C62828] text-white shadow-md font-bold'
            : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
        }`}
      >
        <ShieldCheck className="w-4 h-4 text-amber-400" />
        <span className="font-bold text-xs">Master Admin</span>
      </button>
    </div>
  );
};
