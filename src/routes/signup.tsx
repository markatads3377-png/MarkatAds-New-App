import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Building2,
  ShoppingCart,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SiteHeader } from "@/components/SiteHeader";
import { registerWithEmail, loginWithGoogle, dashboardPath, type Role } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your Mark@Ads account — Buyer or Seller" },
      {
        name: "description",
        content:
          "Sign up to Mark@Ads to buy or sell billboards, digital screens, transit, mall and airport advertising media worldwide.",
      },
      { property: "og:title", content: "Create your Mark@Ads account — Buyer or Seller" },
      {
        property: "og:description",
        content: "One account for advertisers and media owners. Free to join.",
      },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("buyer");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [repeat, setRepeat] = useState("");
  const [terms, setTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const handle = username.trim().toLowerCase();

    if (!/^[a-z0-9_.]{3,24}$/.test(handle)) {
      toast.error("Username must be 3–24 characters (letters, numbers, _ or .)");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (password !== repeat) {
      toast.error("Passwords do not match");
      return;
    }
    if (!terms) {
      toast.error("Please accept the Terms & Conditions");
      return;
    }

    setLoading(true);
    try {
      const { role: registeredRole } = await registerWithEmail(
        email,
        password,
        handle,
        role,
        displayName || handle,
        company,
      );
      toast.success("Account created successfully!");
      navigate({ to: dashboardPath(registeredRole) });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Registration failed. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      const { role: authedRole } = await loginWithGoogle(role);
      toast.success("Signed in with Google!");
      navigate({ to: dashboardPath(authedRole) });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Google sign-in failed.";
      toast.error(msg);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col">
      <SiteHeader />
      <main className="flex-1 flex items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-lg space-y-6">
          <div className="text-center space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
              Create your Mark@Ads Account
            </h1>
            <p className="text-sm text-muted-foreground">
              Join thousands of advertisers and media space owners worldwide.
            </p>
          </div>

          <Card className="shadow-lg border-border/80 bg-background">
            <CardHeader className="pb-4">
              <CardTitle className="font-display text-xl">Select Your Account Type</CardTitle>
              <CardDescription>
                One unified platform — pick your main role and customize at any time.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Role Selection */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("buyer")}
                  className={cn(
                    "rounded-xl border p-4 text-left transition-all flex flex-col gap-1.5",
                    role === "buyer"
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs"
                      : "border-border hover:border-border/80 bg-card",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <ShoppingCart
                      className={cn(
                        "size-5",
                        role === "buyer" ? "text-primary" : "text-muted-foreground",
                      )}
                    />
                    {role === "buyer" && <CheckCircle2 className="w-4 h-4 text-primary" />}
                  </div>
                  <p className="font-display text-sm font-semibold text-foreground">
                    Buyer / Advertiser
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Book billboards, DOOH, transit media
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("seller")}
                  className={cn(
                    "rounded-xl border p-4 text-left transition-all flex flex-col gap-1.5",
                    role === "seller"
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs"
                      : "border-border hover:border-border/80 bg-card",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <Building2
                      className={cn(
                        "size-5",
                        role === "seller" ? "text-primary" : "text-muted-foreground",
                      )}
                    />
                    {role === "seller" && <CheckCircle2 className="w-4 h-4 text-primary" />}
                  </div>
                  <p className="font-display text-sm font-semibold text-foreground">
                    Media Owner / Seller
                  </p>
                  <p className="text-xs text-muted-foreground">List spaces & receive bookings</p>
                </button>
              </div>

              {/* 1-Click Google Sign Up */}
              <Button
                type="button"
                variant="outline"
                disabled={googleLoading}
                onClick={handleGoogle}
                className="w-full h-11 flex items-center justify-center gap-3 border-border hover:bg-muted/70 text-sm font-semibold shadow-xs"
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
                  {googleLoading ? "Connecting to Google..." : "Fast Sign Up with Google"}
                </span>
              </Button>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-border w-full" />
                <span className="bg-background px-3 text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  Or register with email
                </span>
              </div>

              <form onSubmit={submit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="username" className="text-xs font-semibold">
                      Username handle *
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-mono">
                        @
                      </span>
                      <Input
                        id="username"
                        value={username}
                        onChange={(e) =>
                          setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, ""))
                        }
                        placeholder="mediapro"
                        maxLength={24}
                        className="h-10 text-sm pl-7 bg-muted/20 font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="displayName" className="text-xs font-semibold">
                      Display / Brand Name
                    </Label>
                    <Input
                      id="displayName"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. Acme Agency"
                      className="h-10 text-sm bg-muted/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-semibold">
                      Business Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="h-10 text-sm bg-muted/20"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="company" className="text-xs font-semibold">
                      Company Name
                    </Label>
                    <Input
                      id="company"
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Optional"
                      className="h-10 text-sm bg-muted/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-xs font-semibold">
                      Password *
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength={6}
                        className="h-10 text-sm pr-9 bg-muted/20"
                        placeholder="Min. 6 chars"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="repeat" className="text-xs font-semibold">
                      Repeat password *
                    </Label>
                    <Input
                      id="repeat"
                      type="password"
                      value={repeat}
                      onChange={(e) => setRepeat(e.target.value)}
                      minLength={6}
                      className="h-10 text-sm bg-muted/20"
                      placeholder="Confirm password"
                      required
                    />
                  </div>
                </div>

                <label className="flex items-start gap-2.5 text-xs text-muted-foreground pt-1 cursor-pointer">
                  <Checkbox
                    checked={terms}
                    onCheckedChange={(v) => setTerms(v === true)}
                    className="mt-0.5"
                  />
                  <span>I agree to the Mark@Ads Terms of Service & Privacy Policy.</span>
                </label>

                <Button
                  type="submit"
                  className="w-full h-11 font-semibold text-sm"
                  disabled={loading}
                >
                  {loading
                    ? "Creating your account…"
                    : `Create ${role === "seller" ? "Media Owner" : "Advertiser"} Account`}
                </Button>

                <div className="text-center text-xs text-muted-foreground pt-2">
                  Already have an account?{" "}
                  <Link to="/auth" className="font-semibold text-primary hover:underline">
                    Log in here
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
