import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building,
  MapPin,
  ExternalLink,
  ChevronRight,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type BookingRecord, type MediaAsset } from "./sellerTypes";
import { formatPrice, mediumLabel } from "@/lib/mediums";

interface SellerFlightCalendarProps {
  bookings: BookingRecord[];
  assets: MediaAsset[];
}

export const SellerFlightCalendar: React.FC<SellerFlightCalendarProps> = ({ bookings, assets }) => {
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter === "in_flight") return b.status === "in_flight";
    if (statusFilter === "completed") return b.status === "completed";
    return true;
  });

  // Calculate upcoming vacancies (assets whose contract ends within 30 days)
  const expiringSoon = assets.filter((a) => {
    if (!a.activeContractEnd) return false;
    const diffDays = Math.ceil(
      (new Date(a.activeContractEnd).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );
    return diffDays > 0 && diffDays <= 45;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Vacancy Alerts */}
      <Card className="border-border/80 shadow-xs">
        <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-semibold text-primary">Flight Dispatch Calendar</span>
              <span aria-hidden="true">·</span>
              <span>Gantt Availability & Occupancy Tracking</span>
            </div>
            <h2 className="text-lg font-bold font-display text-foreground mt-1">
              Active Campaigns & Flight Durations
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live schedule of confirmed advertiser flights, contract expiration dates, and upcoming
              space vacancies.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8.5 text-xs w-40">
                <SelectValue placeholder="All Flights" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Flights</SelectItem>
                <SelectItem value="in_flight">Active Flights</SelectItem>
                <SelectItem value="completed">Completed Flights</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Vacancy Alert Bar */}
      {expiringSoon.length > 0 && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 dark:text-amber-400">
            <AlertTriangle className="size-4 shrink-0" />
            <span>Upcoming Space Vacancies (Next 45 Days) — Ready for Next Advertiser Pitch:</span>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {expiringSoon.map((asset) => (
              <div
                key={asset.id}
                className="flex items-center justify-between p-2 rounded-lg bg-background/80 border border-amber-500/20 text-xs"
              >
                <div>
                  <p className="font-semibold text-foreground line-clamp-1">{asset.title}</p>
                  <p className="text-[11px] text-muted-foreground">
                    Opens: {asset.activeContractEnd} ({asset.city})
                  </p>
                </div>
                <span className="font-bold text-primary whitespace-nowrap ml-2">
                  {formatPrice(asset.pricePerMonth, asset.currency)}/mo
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Flights Table / Cards */}
      <Card className="border-border/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border/80 bg-muted/40 text-muted-foreground font-medium">
                <th className="py-3 px-4">Flight / Asset</th>
                <th className="py-3 px-4">Advertiser & Agency</th>
                <th className="py-3 px-4">Flight Duration</th>
                <th className="py-3 px-4">Contract Value</th>
                <th className="py-3 px-4">Escrow Status</th>
                <th className="py-3 px-4">Proof of Play</th>
                <th className="py-3 px-4 text-right">Flight Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredBookings.map((bkg) => (
                <tr key={bkg.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div>
                      <p className="font-semibold text-foreground">{bkg.assetTitle}</p>
                      <p className="text-[11px] text-muted-foreground">{mediumLabel(bkg.medium)}</p>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div>
                      <p className="font-medium text-foreground">{bkg.advertiser}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {bkg.agency || "Direct Client"}
                      </p>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                    <div className="flex items-center gap-1.5 font-medium text-foreground">
                      <CalendarIcon className="size-3 text-muted-foreground" />
                      <span>{bkg.startDate}</span>
                      <span>→</span>
                      <span>{bkg.endDate}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-foreground whitespace-nowrap">
                    {formatPrice(bkg.totalAmount, bkg.currency)}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {bkg.escrowStatus === "held" ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                        <Clock className="size-3" /> In Escrow
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="size-3" /> Released to Bank
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="size-3" /> Verified (100%)
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider ${
                        bkg.status === "in_flight"
                          ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                          : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {bkg.status === "in_flight" ? "Broadcasting" : "Completed"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
