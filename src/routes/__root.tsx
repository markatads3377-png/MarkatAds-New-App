import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import React, { useEffect, type ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/integrations/firebase/client";
import { ArrowLeft, Home, LogIn, LayoutDashboard, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Analytics } from "@vercel/analytics/react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Toaster } from "@/components/ui/sonner";
import { EcomProvider } from "@/context/EcomContext";
import { MediaDetailModal } from "@/components/MediaDetailModal";
import { CartDrawer } from "@/components/CartDrawer";
import { CheckoutModal } from "@/components/CheckoutModal";
import { CompareDrawer } from "@/components/CompareDrawer";
import { WishlistDrawer } from "@/components/WishlistDrawer";
import { OrdersTrackerModal } from "@/components/OrdersTrackerModal";

export function NotFoundComponent() {
  const router = useRouter();

  // Auto-redirect if URL contains leftover auth tokens/callbacks
  useEffect(() => {
    if (typeof window !== "undefined") {
      const href = window.location.href;
      if (
        href.includes("access_token=") ||
        href.includes("id_token=") ||
        href.includes("code=") ||
        href.includes("__auth")
      ) {
        window.location.replace("/auth");
      }
    }
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/20 px-4 py-12">
      <div className="max-w-md w-full text-center space-y-6 bg-background p-8 rounded-2xl border border-border/80 shadow-lg">
        <div className="space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary font-bold text-3xl font-display">
            404
          </div>
          <h2 className="text-xl font-bold font-display text-foreground">Page not found</h2>
          <p className="text-sm text-muted-foreground">
            The requested destination or session link is not available. Please choose a page below:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <Button asChild variant="default" className="w-full h-10 font-semibold text-xs gap-2">
            <Link to="/">
              <Home className="w-4 h-4" />
              Go to Home
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full h-10 font-semibold text-xs gap-2 border-border"
          >
            <Link to="/auth">
              <LogIn className="w-4 h-4" />
              Sign In / Log In
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full h-10 font-semibold text-xs gap-2 col-span-1 sm:col-span-2 border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20"
          >
            <Link to="/admin">
              <ShieldCheck className="w-4 h-4" />
              Open Admin Console (/admin)
            </Link>
          </Button>

          <Button
            asChild
            variant="secondary"
            className="w-full h-10 font-semibold text-xs gap-2 col-span-1 sm:col-span-2"
          >
            <Link to="/buyer">
              <LayoutDashboard className="w-4 h-4" />
              Open Marketplace Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error("Root ErrorComponent caught:", error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="max-w-md w-full text-center space-y-6 bg-card p-8 rounded-2xl border border-border shadow-lg">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-destructive/10 text-destructive font-bold text-2xl font-display">
          !
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-bold tracking-tight text-foreground font-display">
            Something went wrong
          </h1>
          <p className="text-sm text-muted-foreground">
            {error?.message ||
              "Something went wrong on our end. You can try refreshing or head back home."}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
          <Button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            variant="default"
            className="w-full text-xs font-semibold"
          >
            Try again
          </Button>
          <Button asChild variant="outline" className="w-full text-xs font-semibold">
            <a href="/">Go home</a>
          </Button>
          <Button
            asChild
            variant="secondary"
            className="w-full text-xs font-semibold col-span-1 sm:col-span-2"
          >
            <a href="/admin">Open Admin Console (/admin)</a>
          </Button>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Mark@Ads — Find & Book Advertising Spaces Worldwide" },
      {
        name: "description",
        content:
          "Mark@Ads is the global marketplace for billboards, digital screens, mall, airport, metro and transit advertising. Find, compare and book media worldwide.",
      },
      { property: "og:title", content: "Mark@Ads — Find & Book Advertising Spaces Worldwide" },
      {
        property: "og:description",
        content:
          "Turn locations into opportunities. Plan, compare and launch verified OOH & DOOH billboard campaigns in 1-click.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.markatads.com" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:domain", content: "markatads.com" },
      { name: "twitter:url", content: "https://www.markatads.com" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://www.markatads.com",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700&family=Manrope:wght@400;500;600&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Analytics />
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      router.invalidate();
      queryClient.invalidateQueries();
    });

    const handleStorageChange = () => {
      router.invalidate();
      queryClient.invalidateQueries();
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      unsubscribe();
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [queryClient, router]);

  return (
    <QueryClientProvider client={queryClient}>
      <EcomProvider>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
        <MediaDetailModal />
        <CartDrawer />
        <CheckoutModal />
        <CompareDrawer />
        <WishlistDrawer />
        <OrdersTrackerModal />
        <Toaster position="top-center" richColors />
      </EcomProvider>
    </QueryClientProvider>
  );
}
