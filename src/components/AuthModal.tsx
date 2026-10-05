import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Role } from '../types';
import {
  X,
  LogIn,
  UserPlus,
  Mail,
  Lock,
  User,
  Building2,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  AlertCircle,
  KeyRound,
  Check,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { toast } from 'sonner';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalTab,
    setAuthModalTab,
    login,
    loginWithGoogle,
    register,
    resetPassword,
    setCurrentView,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'signin' | 'register' | 'forgot'>(authModalTab || 'signin');

  // Keep activeTab in sync with authModalTab
  React.useEffect(() => {
    if (authModalTab) {
      setActiveTab(authModalTab);
    }
  }, [authModalTab]);

  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [signInError, setSignInError] = useState<string | null>(null);

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regCompany, setRegCompany] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regRole, setRegRole] = useState<Role>('buyer');
  const [regError, setRegError] = useState<string | null>(null);

  // Forgot Password Form State
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotError, setForgotError] = useState<string | null>(null);

  // Google Account Picker Modal state
  const [isGooglePickerOpen, setIsGooglePickerOpen] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('markatads3377@gmail.com');
  const [customGoogleName, setCustomGoogleName] = useState('Platform Owner');
  const [googleChosenRole, setGoogleChosenRole] = useState<Role>('buyer');
  const [googleChosenCompany, setGoogleChosenCompany] = useState('');

  if (!isAuthModalOpen) return null;

  // Handle Standard Sign In
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError(null);

    if (!signInEmail.trim()) {
      setSignInError('Please enter your email address.');
      return;
    }

    const res = login(signInEmail, signInPassword);
    if (res.success) {
      toast.success(res.message || 'Signed in successfully.');
      setIsAuthModalOpen(false);
      setSignInEmail('');
      setSignInPassword('');
      setSignInError(null);
    } else {
      setSignInError(res.message || 'Authentication failed. Please verify your credentials.');
    }
  };

  // Handle Account Registration
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!regName.trim()) {
      setRegError('Please provide your full name.');
      return;
    }

    if (!regEmail.trim() || !regEmail.includes('@')) {
      setRegError('Please enter a valid work email address.');
      return;
    }

    if (regPassword.length < 6) {
      setRegError('Password must be at least 6 characters long.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match. Please re-enter.');
      return;
    }

    const res = register(regName, regEmail, regPassword, regRole, regCompany, regPhone);
    if (res.success) {
      toast.success(res.message);
      setIsAuthModalOpen(false);
      setRegName('');
      setRegEmail('');
      setRegPassword('');
      setRegConfirmPassword('');
      setRegCompany('');
      setRegPhone('');
      setRegError(null);
    } else {
      setRegError(res.message || 'Registration failed.');
    }
  };

  // Handle Google Auth
  const handleTriggerGoogleAuth = () => {
    setIsGooglePickerOpen(true);
  };

  const handleConfirmGoogleAuth = (
    email: string,
    name: string,
    roleOverride?: Role,
    companyOverride?: string
  ) => {
    setIsGooglePickerOpen(false);
    const chosenRole = roleOverride || (activeTab === 'register' ? regRole : googleChosenRole);
    const chosenCompany =
      companyOverride ||
      googleChosenCompany ||
      (chosenRole === 'seller' ? 'Apex Media Asset Holdings' : 'Global Brand Advertiser');
    const res = loginWithGoogle({
      name,
      email,
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=c62828&textColor=ffffff`,
      role: chosenRole,
      company: chosenCompany,
    });
    if (res.success) {
      toast.success(res.message);
      setIsAuthModalOpen(false);
      if (email.toLowerCase() === 'markatads3377@gmail.com') {
        setCurrentView('admin');
      } else if (chosenRole === 'seller') {
        setCurrentView('seller');
      }
    }
  };

  // Handle Forgot Password
  const handleSendResetCode = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    if (!forgotEmail.trim() || !forgotEmail.includes('@')) {
      setForgotError('Please enter a valid account email address.');
      return;
    }
    setForgotStep(2);
    setResetCode('482910'); // Simulated verification code
    toast.info(`Verification code sent to ${forgotEmail}. (Code: 482910)`);
  };

  const handleCompleteReset = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    if (!newPassword || newPassword.length < 6) {
      setForgotError('New password must be at least 6 characters long.');
      return;
    }
    const res = resetPassword(forgotEmail, newPassword);
    if (res.success) {
      toast.success(res.message);
      setActiveTab('signin');
      setSignInEmail(forgotEmail);
      setForgotStep(1);
      setForgotEmail('');
      setNewPassword('');
    } else {
      setForgotError(res.message || 'Password reset failed.');
    }
  };

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { label: 'Empty', score: 0, color: 'bg-neutral-200' };
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 10) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 2) return { label: 'Weak', score: 1, color: 'bg-rose-500' };
    if (score <= 4) return { label: 'Good', score: 2, color: 'bg-amber-500' };
    return { label: 'Strong', score: 3, color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(regPassword);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-6">
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
                Mark@Ads Marketplace
              </span>
              <span className="text-[10px] text-neutral-400 block">
                Secure Account & Credential Access
              </span>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight text-white">
            {activeTab === 'signin'
              ? 'Sign in to your account'
              : activeTab === 'register'
              ? 'Create your Mark@Ads account'
              : 'Reset your account password'}
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            {activeTab === 'signin'
              ? 'Manage campaign flights, view active billings, and access media inventory.'
              : activeTab === 'register'
              ? 'Connect directly to verified billboard owners and book global out-of-home media.'
              : 'Enter your account email to receive a secure password reset link.'}
          </p>

          {/* Tab Switcher */}
          {activeTab !== 'forgot' && (
            <div className="flex p-1 bg-neutral-800/90 rounded-xl mt-5 border border-neutral-700/60">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('signin');
                  setSignInError(null);
                }}
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
                onClick={() => {
                  setActiveTab('register');
                  setRegError(null);
                }}
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
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-5">
          {activeTab !== 'forgot' && (
            <>
              {/* GOOGLE SIGN IN BUTTON */}
              <div>
                <button
                  type="button"
                  onClick={handleTriggerGoogleAuth}
                  className="w-full h-11 px-4 rounded-xl border border-neutral-300 hover:border-neutral-400 bg-white hover:bg-neutral-50 text-neutral-800 font-bold text-xs shadow-2xs transition-all flex items-center justify-center gap-3 cursor-pointer group"
                >
                  {/* Official Google G SVG logo */}
                  <svg className="size-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span className="text-neutral-800 group-hover:text-neutral-900">
                    {activeTab === 'signin' ? 'Continue with Google' : 'Sign up with Google'}
                  </span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center">
                <div className="border-t border-neutral-200 w-full" />
                <span className="bg-white px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-wider absolute">
                  or with work email
                </span>
              </div>
            </>
          )}

          {/* SIGN IN VIEW */}
          {activeTab === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              {signInError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2 animate-in fade-in duration-100">
                  <AlertCircle className="size-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{signInError}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                  <input
                    type="email"
                    value={signInEmail}
                    onChange={(e) => {
                      setSignInEmail(e.target.value);
                      if (signInError) setSignInError(null);
                    }}
                    placeholder="name@company.com"
                    required
                    autoFocus
                    className="w-full h-11 pl-10 pr-3 rounded-xl border border-neutral-200 bg-neutral-50/70 focus:bg-white text-xs font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#C62828]/20 focus:border-[#C62828] transition-all"
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
                    onClick={() => {
                      setActiveTab('forgot');
                      setForgotEmail(signInEmail);
                    }}
                    className="text-[11px] font-semibold text-[#C62828] hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                  <input
                    type={showSignInPassword ? 'text' : 'password'}
                    value={signInPassword}
                    onChange={(e) => {
                      setSignInPassword(e.target.value);
                      if (signInError) setSignInError(null);
                    }}
                    placeholder="Enter your account password"
                    required
                    className="w-full h-11 pl-10 pr-10 rounded-xl border border-neutral-200 bg-neutral-50/70 focus:bg-white text-xs font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#C62828]/20 focus:border-[#C62828] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignInPassword(!showSignInPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                  >
                    {showSignInPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <label className="flex items-center gap-2 cursor-pointer select-none text-neutral-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-neutral-300 text-[#C62828] focus:ring-[#C62828]"
                  />
                  <span className="text-[11px]">Remember my device</span>
                </label>
                <span className="text-[10px] text-neutral-400 font-mono">256-bit SSL Escrow</span>
              </div>

              <button
                type="submit"
                className="w-full h-11 rounded-xl bg-[#C62828] hover:bg-[#B71C1C] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <LogIn className="size-4" />
                <span>Sign In to Account</span>
              </button>
            </form>
          )}

          {/* CREATE ACCOUNT VIEW */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              {regError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2 animate-in fade-in duration-100">
                  <AlertCircle className="size-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{regError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider block">
                    Full Name <span className="text-[#C62828]">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Alex Morgan"
                      required
                      className="w-full h-10 pl-9 pr-3 rounded-xl border border-neutral-200 bg-neutral-50/70 focus:bg-white text-xs font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#C62828]/20 focus:border-[#C62828] transition-all"
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
                      className="w-full h-10 pl-9 pr-3 rounded-xl border border-neutral-200 bg-neutral-50/70 focus:bg-white text-xs font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#C62828]/20 focus:border-[#C62828] transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider block">
                    Work Email <span className="text-[#C62828]">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="name@company.com"
                      required
                      className="w-full h-10 pl-9 pr-3 rounded-xl border border-neutral-200 bg-neutral-50/70 focus:bg-white text-xs font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#C62828]/20 focus:border-[#C62828] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider block">
                    Phone (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full h-10 pl-9 pr-3 rounded-xl border border-neutral-200 bg-neutral-50/70 focus:bg-white text-xs font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#C62828]/20 focus:border-[#C62828] transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider block">
                    Password <span className="text-[#C62828]">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      required
                      className="w-full h-10 pl-9 pr-9 rounded-xl border border-neutral-200 bg-neutral-50/70 focus:bg-white text-xs font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#C62828]/20 focus:border-[#C62828] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                    >
                      {showRegPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider block">
                    Confirm Password <span className="text-[#C62828]">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      required
                      className="w-full h-10 pl-9 pr-3 rounded-xl border border-neutral-200 bg-neutral-50/70 focus:bg-white text-xs font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#C62828]/20 focus:border-[#C62828] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Password strength bar */}
              {regPassword && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-neutral-500 font-medium">Strength: {strength.label}</span>
                    <span className="text-neutral-400">Min. 6 chars</span>
                  </div>
                  <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden flex gap-1">
                    <div className={`h-full flex-1 rounded-full ${strength.score >= 1 ? strength.color : 'bg-neutral-200'}`} />
                    <div className={`h-full flex-1 rounded-full ${strength.score >= 2 ? strength.color : 'bg-neutral-200'}`} />
                    <div className={`h-full flex-1 rounded-full ${strength.score >= 3 ? strength.color : 'bg-neutral-200'}`} />
                  </div>
                </div>
              )}

              {/* Account Type Selector */}
              <div className="space-y-1 pt-1">
                <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider block">
                  Account Type <span className="text-[#C62828]">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRegRole('buyer')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      regRole === 'buyer'
                        ? 'border-blue-600 bg-blue-50/80 text-blue-900 ring-2 ring-blue-600/20'
                        : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">Advertiser / Brand</span>
                      {regRole === 'buyer' && <Check className="size-3.5 text-blue-600" />}
                    </div>
                    <div className="text-[10px] text-neutral-500 mt-0.5">I want to book OOH campaigns</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegRole('seller')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      regRole === 'seller'
                        ? 'border-amber-600 bg-amber-50/80 text-amber-900 ring-2 ring-amber-600/20'
                        : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">Media Owner</span>
                      {regRole === 'seller' && <Check className="size-3.5 text-amber-600" />}
                    </div>
                    <div className="text-[10px] text-neutral-500 mt-0.5">I want to list billboard inventory</div>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-11 rounded-xl bg-[#C62828] hover:bg-[#B71C1C] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <UserPlus className="size-4" />
                <span>Create Account (+100 Bonus Coins)</span>
              </button>

              <p className="text-[10px] text-neutral-400 text-center leading-relaxed">
                By creating an account, you agree to Mark@Ads Marketplace Terms of Service and escrow security policies.
              </p>
            </form>
          )}

          {/* FORGOT PASSWORD VIEW */}
          {activeTab === 'forgot' && (
            <div className="space-y-4">
              {forgotError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
                  <AlertCircle className="size-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{forgotError}</span>
                </div>
              )}

              {forgotStep === 1 ? (
                <form onSubmit={handleSendResetCode} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider block">
                      Account Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="name@company.com"
                        required
                        autoFocus
                        className="w-full h-11 pl-10 pr-3 rounded-xl border border-neutral-200 bg-neutral-50/70 focus:bg-white text-xs font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#C62828]/20 focus:border-[#C62828] transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full h-11 rounded-xl bg-[#C62828] hover:bg-[#B71C1C] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <KeyRound className="size-4" />
                    <span>Send Verification Code</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleCompleteReset} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider block">
                      6-Digit Security Code
                    </label>
                    <input
                      type="text"
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value)}
                      placeholder="e.g. 482910"
                      required
                      className="w-full h-10 px-3 rounded-xl border border-neutral-200 bg-neutral-50/70 focus:bg-white text-xs font-mono tracking-widest text-neutral-900 focus:outline-none focus:border-[#C62828]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider block">
                      Set New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      required
                      className="w-full h-10 px-3 rounded-xl border border-neutral-200 bg-neutral-50/70 focus:bg-white text-xs font-medium text-neutral-900 focus:outline-none focus:border-[#C62828]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full h-11 rounded-xl bg-[#C62828] hover:bg-[#B71C1C] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
                  >
                    <CheckCircle2 className="size-4" />
                    <span>Update & Reset Password</span>
                  </button>
                </form>
              )}

              <button
                type="button"
                onClick={() => {
                  setActiveTab('signin');
                  setForgotError(null);
                }}
                className="w-full py-2 text-center text-xs font-semibold text-neutral-500 hover:text-neutral-900 cursor-pointer block"
              >
                ← Back to Sign In
              </button>
            </div>
          )}
        </div>
      </div>

      {/* GOOGLE ACCOUNT CHOOSER POPUP DIALOG */}
      {isGooglePickerOpen && (
        <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-100">
          <div className="bg-white rounded-3xl shadow-2xl border border-neutral-200 p-6 w-full max-w-sm text-neutral-900 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <svg className="size-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <h3 className="font-bold text-sm">Choose Google Account</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsGooglePickerOpen(false)}
                className="size-7 rounded-full hover:bg-neutral-100 grid place-items-center text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-500">
              Select or enter your Google Account to instantly authenticate and claim your 100 OOH Coins.
            </p>

            {/* Quick selector options */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleConfirmGoogleAuth('markatads3377@gmail.com', 'Mark@Ads Administrator', 'admin', 'Mark@Ads Operations HQ')}
                className="w-full p-3 rounded-2xl border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 text-left transition-colors flex items-center gap-3 cursor-pointer group"
              >
                <div className="size-9 rounded-full bg-[#C62828] text-white font-bold text-xs grid place-items-center shrink-0">
                  MA
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-neutral-900 truncate flex items-center gap-1.5">
                    <span>Mark@Ads Platform Owner</span>
                    <span className="text-[9px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold">HQ</span>
                  </div>
                  <div className="text-[11px] text-neutral-500 font-mono truncate">markatads3377@gmail.com</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleConfirmGoogleAuth('alex.morgan@brandglobal.com', 'Alex Morgan', 'buyer', 'Nike Global Campaigns')}
                className="w-full p-3 rounded-2xl border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 text-left transition-colors flex items-center gap-3 cursor-pointer group"
              >
                <div className="size-9 rounded-full bg-blue-600 text-white font-bold text-xs grid place-items-center shrink-0">
                  AM
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-neutral-900 truncate flex items-center gap-1.5">
                    <span>Alex Morgan</span>
                    <span className="text-[9px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">Advertiser</span>
                  </div>
                  <div className="text-[11px] text-neutral-500 font-mono truncate">alex.morgan@brandglobal.com</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleConfirmGoogleAuth('sarah.apex@mediaholding.com', 'Sarah Jenkins', 'seller', 'Apex Media Group')}
                className="w-full p-3 rounded-2xl border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 text-left transition-colors flex items-center gap-3 cursor-pointer group"
              >
                <div className="size-9 rounded-full bg-emerald-600 text-white font-bold text-xs grid place-items-center shrink-0">
                  SJ
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-neutral-900 truncate flex items-center gap-1.5">
                    <span>Sarah Jenkins</span>
                    <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold">Media Owner</span>
                  </div>
                  <div className="text-[11px] text-neutral-500 font-mono truncate">sarah.apex@mediaholding.com</div>
                </div>
              </button>
            </div>

            {/* Custom Google Account Input with Role Switcher */}
            <div className="pt-3 border-t border-neutral-100 space-y-2.5">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">
                Or sign up with any Google email:
              </span>

              {/* Role selection for new Google account */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setGoogleChosenRole('buyer')}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer text-center ${
                    googleChosenRole === 'buyer'
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  Brand Advertiser
                </button>
                <button
                  type="button"
                  onClick={() => setGoogleChosenRole('seller')}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer text-center ${
                    googleChosenRole === 'seller'
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  Media Owner
                </button>
              </div>

              <div className="flex gap-2">
                <input
                  type="email"
                  value={customGoogleEmail}
                  onChange={(e) => setCustomGoogleEmail(e.target.value)}
                  placeholder="your.email@gmail.com"
                  className="flex-1 h-9.5 px-3 rounded-xl border border-neutral-200 text-xs font-medium focus:outline-none focus:border-[#C62828]"
                />
                <button
                  type="button"
                  onClick={() => {
                    const parsedName = customGoogleEmail.includes('@')
                      ? customGoogleEmail.split('@')[0].replace(/[\._]/g, ' ')
                      : 'Google User';
                    handleConfirmGoogleAuth(
                      customGoogleEmail,
                      parsedName.charAt(0).toUpperCase() + parsedName.slice(1)
                    );
                  }}
                  className="px-4 rounded-xl bg-[#C62828] hover:bg-[#B71C1C] text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
