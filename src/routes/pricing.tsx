import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SiteHeader } from "@/components/SiteHeader";
import { PLANS } from "@/lib/mediums";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Seller plans & pricing — Mark@Ads" },
      {
        name: "description",
        content:
          "Free listings for media owners, plus Medium at $8/month and Premium at $12/month with full analytics, keyword tracking and unlimited featured billboards.",
      },
      { property: "og:title", content: "Seller plans & pricing — Mark@Ads" },
      {
        property: "og:description",
        content: "Start free. Upgrade for analytics, WhatsApp alerts and unlimited featured media.",
      },
    ],
  }),
  component: PricingPage,
});

function PricingPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <div className="text-center">
          <Badge variant="secondary">For media owners</Badge>
          <h1 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">
            Plans that scale with your inventory
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Buyers always browse and book for free. Sellers start free and upgrade when they want
            analytics, alerts and featured placement.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {PLANS.map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                "relative flex flex-col shadow-soft",
                "highlight" in plan && plan.highlight && "border-primary shadow-lift",
              )}
            >
              {"highlight" in plan && plan.highlight ? (
                <Badge className="surface-matte absolute -top-3 left-1/2 -translate-x-1/2 border-0">
                  Most popular
                </Badge>
              ) : null}
              <CardHeader>
                <CardTitle className="font-display text-lg">{plan.name}</CardTitle>
                <p className="font-display text-3xl font-semibold text-primary">
                  {plan.price}
                  <span className="text-sm font-normal text-muted-foreground">{plan.period}</span>
                </p>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col">
                <ul className="space-y-3 text-sm">
                  {plan.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild className="mt-6 w-full">
                  <Link to="/signup">
                    {plan.price === "Free" ? "Start free" : `Choose ${plan.name}`}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Plans are shown for onboarding — card payments and subscription billing activate in the
          payments phase.
        </p>
      </main>
    </div>
  );
}
