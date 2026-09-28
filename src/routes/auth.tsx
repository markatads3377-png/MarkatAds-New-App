import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User as UserIcon,
  Building2,
  Megaphone,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SiteHeader } from "@/components/SiteHeader";
import {
  loginWithGoogle,
  loginWithEmail,
  registerWithEmail,
  loginWithDemo,
  resetUserPassword,
  dashboardPath,
  type Role,
} from "@/hooks/useAuth";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>) => ({
    tab: (search.tab as string) || "login",
  }),
  head: () => ({
    meta: [
      { title: "Sign In & Access Marketplace — Mark@Ads" },
      {
        name: "description",
        content:
          "Access the Mark@Ads global out-of-home advertising marketplace. Sign in with Google, email, or explore instant demo mode.",
      },
      { property: "og:title", content: "Sign In & Access Marketplace — Mark@Ads" },
      {
        property: "og:description",
        content: "Unified portal for buyers, agencies, and media space owners.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/auth" });
  const [activeTab, setActiveTab] = useState<string>(search.tab === "signup" ? "signup" : "login");

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Signup form state
  const [signupRole, setSignupRole] = useState<Role>("buyer");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupDisplayName, setSignupDisplayName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupCompany, setSignupCompany] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);

  // Reset password state
  const [resetEmail, setResetEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);

  // Google OAuth state
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // 1. Google 1-Click Login
  const handleGoogleAuth = async (preferredRole: Role = "buyer") => {
    setIsGoogleLoading(true);
    try {
      const { role } = await loginWithGoogle(preferredRole);
      toast.success("Signed in successfully with Google!");
      navigate({ to: dashboardPath(role) });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Google authentication could not be completed.";
      toast.error(msg);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // 2. Email / Username Login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim() || !loginPassword) {
      toast.error("Please provide both email/username and password.");
      return;
    }

    setIsLoggingIn(true);
    try {
      const { role } = await loginWithEmail(loginIdentifier, loginPassword);
      toast.success("Welcome back to Mark@Ads!");
      navigate({ to: dashboardPath(role) });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Login failed. Please check your credentials.";
      toast.error(msg);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // 3. Register New Account
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const handle = signupUsername.trim().toLowerCase();

    if (!/^[a-z0-9_.]{3,24}$/.test(handle)) {
      toast.error("Username must be 3–24 lowercase characters (letters, numbers, _ or .)");
      return;
    }
    if (!signupEmail.trim() || !signupEmail.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (signupPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    setIsSigningUp(true);
    try {
      const { role } = await registerWithEmail(
        signupEmail,
        signupPassword,
        handle,
        signupRole,
        signupDisplayName || handle,
        signupCompany,
      );
      toast.success(`Account created! Welcome, @${handle}`);
      navigate({ to: dashboardPath(role) });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Registration failed. Please try again.";
      toast.error(msg);
    } finally {
      setIsSigningUp(false);
    }
  };

  // 4. Instant Demo Login (1-Click)
  const handleInstantDemo = (demoRole: Role) => {
    const { role } = loginWithDemo(demoRole);
    toast.success(
      `Logged in as Demo ${
        demoRole === "admin"
          ? "Platform Administrator"
          : demoRole === "seller"
            ? "Media Owner"
            : "Advertiser"
      }!`,
    );
    navigate({ to: dashboardPath(role) });
  };

  // 5. Password Reset
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      toast.error("Please enter your email address to receive reset instructions.");
      return;
    }

    setIsResetting(true);
    try {
      await resetUserPassword(resetEmail);
      toast.success("Password reset link dispatched! Please check your email inbox.");
      setIsResetOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not send reset link.";
      toast.error(msg);
    } finally {
      setIsResetting(false);
    }
  };

  // Password strength calculation helper
  const getPasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 6) score += 30;
    if (pass.length >= 10) score += 20;
    if (/[A-Z]/.test(pass)) score += 25;
    if (/[0-9]/.test(pass)) score += 15;
    if (/[^A-Za-z0-9]/.test(pass)) score += 10;
    return Math.min(score, 100);
  };

  const strength = getPasswordStrength(signupPassword);

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col">
      <SiteHeader />

      <main className="flex-1 flex items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-xl space-y-6">
          {/* Top Brand Banner */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Unified Marketplace Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-foreground">
              Welcome to Mark@Ads
            </h1>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Buy, sell, and manage billboards, digital screens, transit, and landmark media
              worldwide.
            </p>
          </div>

          <Card className="shadow-lg border-border/80 bg-background overflow-hidden">
            {/* Main Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="p-2 border-b border-border/60 bg-muted/40">
                <TabsList className="grid grid-cols-3 w-full h-11 bg-muted/80 p-1">
                  <TabsTrigger value="login" className="font-semibold text-xs sm:text-sm">
                    Log In
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="font-semibold text-xs sm:text-sm">
                    Create Account
                  </TabsTrigger>
                  <TabsTrigger
                    value="demo"
                    className="font-semibold text-xs sm:text-sm text-primary data-[state=active]:text-primary"
                  >
                    ⚡ Instant Demo
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* TAB 1: LOGIN */}
              <TabsContent
                value="login"
                className="p-6 sm:p-8 space-y-6 focus-visible:outline-none"
              >
                {/* 1-Click Google Button */}
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  disabled={isGoogleLoading}
                  onClick={() => handleGoogleAuth("buyer")}
                  className="w-full h-12 flex items-center justify-center gap-3 border-border hover:bg-muted/70 text-sm font-semibold transition-all shadow-xs"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                  <span>
                    {isGoogleLoading ? "Connecting to Google…" : "Continue with Google (1-Click)"}
                  </span>
                </Button>

                <div className="relative flex items-center justify-center">
                  <div className="border-t border-border w-full" />
                  <span className="bg-background px-3 text-xs uppercase tracking-wider text-muted-foreground font-medium">
                    Or sign in with email
                  </span>
                </div>

                {/* Email / Username Form */}
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="loginIdentifier"
                      className="text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                      Email Address or Username
                    </Label>
                    <Input
                      id="loginIdentifier"
                      type="text"
                      placeholder="you@company.com or @username"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      className="h-11 text-sm bg-muted/20"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="loginPassword"
                        className="text-xs font-semibold flex items-center gap-1.5"
                      >
                        <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                        Password
                      </Label>
                      <button
                        type="button"
                        onClick={() => setIsResetOpen(true)}
                        className="text-xs text-primary hover:underline font-medium"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Input
                        id="loginPassword"
                        type={showLoginPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="h-11 text-sm pr-10 bg-muted/20"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                        tabIndex={-1}
                      >
                        {showLoginPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full h-11 font-semibold text-sm mt-2 transition-transform active:scale-[0.99]"
                  >
                    {isLoggingIn ? (
                      <span className="flex items-center gap-2">
                        <span className="size-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Signing in…
                      </span>
                    ) : (
                      "Sign In to Dashboard"
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* TAB 2: SIGN UP */}
              <TabsContent
                value="signup"
                className="p-6 sm:p-8 space-y-6 focus-visible:outline-none"
              >
                {/* Role Picker */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Select Your Account Role
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSignupRole("buyer")}
                      className={`p-3.5 rounded-xl border text-left transition-all flex flex-col gap-1.5 ${
                        signupRole === "buyer"
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs"
                          : "border-border hover:border-border/80 bg-card"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Megaphone
                          className={`w-5 h-5 ${signupRole === "buyer" ? "text-primary" : "text-muted-foreground"}`}
                        />
                        {signupRole === "buyer" && (
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <div className="font-semibold text-sm text-foreground">
                        Advertiser / Buyer
                      </div>
                      <div className="text-[11px] text-muted-foreground line-clamp-2">
                        Book media spaces, launch flight campaigns & compare CPMs.
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSignupRole("seller")}
                      className={`p-3.5 rounded-xl border text-left transition-all flex flex-col gap-1.5 ${
                        signupRole === "seller"
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs"
                          : "border-border hover:border-border/80 bg-card"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Building2
                          className={`w-5 h-5 ${signupRole === "seller" ? "text-primary" : "text-muted-foreground"}`}
                        />
                        {signupRole === "seller" && (
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <div className="font-semibold text-sm text-foreground">
                        Media Owner / Seller
                      </div>
                      <div className="text-[11px] text-muted-foreground line-clamp-2">
                        List ad inventory, manage occupancy rates & receive payouts.
                      </div>
                    </button>
                  </div>
                </div>

                {/* Google 1-Click for Selected Role */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isGoogleLoading}
                  onClick={() => handleGoogleAuth(signupRole)}
                  className="w-full h-10 flex items-center justify-center gap-2 border-border text-xs font-semibold hover:bg-muted/70"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                  <span>
                    Quick Sign Up with Google as{" "}
                    {signupRole === "seller" ? "Media Owner" : "Advertiser"}
                  </span>
                </Button>

                <div className="relative flex items-center justify-center">
                  <div className="border-t border-border w-full" />
                  <span className="bg-background px-3 text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                    Or create with email
                  </span>
                </div>

                {/* Sign up form */}
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="signupUsername" className="text-xs font-semibold">
                        Username handle <span className="text-primary">*</span>
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-mono">
                          @
                        </span>
                        <Input
                          id="signupUsername"
                          type="text"
                          placeholder="yourname"
                          value={signupUsername}
                          onChange={(e) =>
                            setSignupUsername(
                              e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, ""),
                            )
                          }
                          className="h-10 text-sm pl-7 bg-muted/20 font-mono"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="signupDisplayName" className="text-xs font-semibold">
                        Display Name / Brand
                      </Label>
                      <Input
                        id="signupDisplayName"
                        type="text"
                        placeholder="e.g. Acme Marketing"
                        value={signupDisplayName}
                        onChange={(e) => setSignupDisplayName(e.target.value)}
                        className="h-10 text-sm bg-muted/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="signupEmail" className="text-xs font-semibold">
                        Business Email <span className="text-primary">*</span>
                      </Label>
                      <Input
                        id="signupEmail"
                        type="email"
                        placeholder="you@company.com"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        className="h-10 text-sm bg-muted/20"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="signupCompany" className="text-xs font-semibold">
                        Company / Agency Name
                      </Label>
                      <Input
                        id="signupCompany"
                        type="text"
                        placeholder="Optional"
                        value={signupCompany}
                        onChange={(e) => setSignupCompany(e.target.value)}
                        className="h-10 text-sm bg-muted/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="signupPassword" className="text-xs font-semibold">
                      Create Password <span className="text-primary">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="signupPassword"
                        type={showSignupPassword ? "text" : "password"}
                        placeholder="At least 6 characters"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        className="h-10 text-sm pr-10 bg-muted/20"
                        minLength={6}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignupPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                        tabIndex={-1}
                      >
                        {showSignupPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Password Strength meter */}
                    {signupPassword && (
                      <div className="space-y-1 pt-1">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-muted-foreground">Strength</span>
                          <span
                            className={`font-semibold ${
                              strength > 60
                                ? "text-emerald-600"
                                : strength > 30
                                  ? "text-amber-500"
                                  : "text-rose-500"
                            }`}
                          >
                            {strength > 60 ? "Strong" : strength > 30 ? "Medium" : "Weak"}
                          </span>
                        </div>
                        <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              strength > 60
                                ? "bg-emerald-500"
                                : strength > 30
                                  ? "bg-amber-500"
                                  : "bg-rose-500"
                            }`}
                            style={{ width: `${strength}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSigningUp}
                    className="w-full h-11 font-semibold text-sm mt-3 transition-transform active:scale-[0.99]"
                  >
                    {isSigningUp ? (
                      <span className="flex items-center gap-2">
                        <span className="size-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Creating Account…
                      </span>
                    ) : (
                      `Create ${signupRole === "seller" ? "Media Owner" : "Advertiser"} Account`
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* TAB 3: INSTANT DEMO (1-CLICK TESTING) */}
              <TabsContent value="demo" className="p-6 sm:p-8 space-y-5 focus-visible:outline-none">
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
                  <Zap className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="font-semibold text-sm text-foreground">Instant Demo Mode</div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Need to test or review the application right away? Jump in with 1-click
                      without creating new credentials.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Demo Buyer */}
                  <div className="p-3.5 rounded-xl border border-border/80 bg-card hover:border-primary/50 transition-all flex flex-col justify-between gap-3 shadow-xs">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600">
                          Advertiser
                        </span>
                        <Megaphone className="w-3.5 h-3.5 text-blue-500" />
                      </div>
                      <div className="font-bold text-xs text-foreground">Horizon Brands</div>
                      <p className="text-[11px] text-muted-foreground">
                        Book flights, compare media & checkout.
                      </p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleInstantDemo("buyer")}
                      className="w-full h-8 text-xs font-semibold flex items-center justify-between"
                    >
                      <span>Buyer Mode</span>
                      <ArrowRight className="w-3 h-3" />
                    </Button>
                  </div>

                  {/* Demo Seller */}
                  <div className="p-3.5 rounded-xl border border-border/80 bg-card hover:border-primary/50 transition-all flex flex-col justify-between gap-3 shadow-xs">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600">
                          Media Owner
                        </span>
                        <Building2 className="w-3.5 h-3.5 text-emerald-500" />
                      </div>
                      <div className="font-bold text-xs text-foreground">Apex Outdoor</div>
                      <p className="text-[11px] text-muted-foreground">
                        Manage inventory, earnings & listings.
                      </p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => handleInstantDemo("seller")}
                      className="w-full h-8 text-xs font-semibold flex items-center justify-between border-primary/40 hover:bg-primary/5"
                    >
                      <span>Seller Mode</span>
                      <ArrowRight className="w-3 h-3" />
                    </Button>
                  </div>

                  {/* Demo Admin */}
                  <div className="p-3.5 rounded-xl border border-amber-500/40 bg-amber-500/5 hover:border-amber-500/70 transition-all flex flex-col justify-between gap-3 shadow-xs">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-700 dark:text-amber-300">
                          Master Admin
                        </span>
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                      </div>
                      <div className="font-bold text-xs text-foreground">Admin Ops Console</div>
                      <p className="text-[11px] text-muted-foreground">
                        Full marketplace control, GMV & users.
                      </p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleInstantDemo("admin")}
                      className="w-full h-8 text-xs font-semibold flex items-center justify-between bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                    >
                      <span>Admin Mode</span>
                      <ArrowRight className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-muted/40 border border-border text-xs flex items-center justify-between">
                  <div className="text-muted-foreground">
                    Direct Admin Link: <strong className="text-foreground">/admin</strong> •
                    Username:{" "}
                    <code className="text-amber-600 dark:text-amber-400 font-mono">admin</code> •
                    Password:{" "}
                    <code className="text-amber-600 dark:text-amber-400 font-mono">admin123</code>
                  </div>
                  <Button
                    asChild
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-xs text-primary font-semibold"
                  >
                    <Link to="/admin">Go to /admin →</Link>
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </Card>

          {/* Trust & Guarantee Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> 256-Bit SSL Encrypted
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-primary" /> Google Cloud Security
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-amber-500" /> 100% Escrow Protection
            </span>
          </div>
        </div>
      </main>

      {/* Password Reset Modal */}
      {isResetOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-background border border-border rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl animate-in fade-in zoom-in-95">
            <div className="space-y-1">
              <h3 className="text-lg font-bold font-display text-foreground">
                Reset your password
              </h3>
              <p className="text-xs text-muted-foreground">
                Enter your registered email address and we'll send you a secure link to reset your
                password.
              </p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="resetEmail" className="text-xs font-semibold">
                  Registered Email Address
                </Label>
                <Input
                  id="resetEmail"
                  type="email"
                  placeholder="you@company.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="h-10 text-sm bg-muted/20"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsResetOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={isResetting}>
                  {isResetting ? "Sending..." : "Send Reset Link"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
