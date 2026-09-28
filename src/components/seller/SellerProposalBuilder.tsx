import React, { useState, useMemo } from "react";
import {
  FileText,
  Plus,
  Send,
  CheckCircle2,
  Copy,
  ExternalLink,
  Percent,
  Trash2,
  Download,
  Calendar,
  Building,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { type MediaAsset, type ProposalRecord, type ProposalItem } from "./sellerTypes";
import { sellerStore } from "./sellerStore";
import { formatPrice, mediumLabel } from "@/lib/mediums";

interface SellerProposalBuilderProps {
  assets: MediaAsset[];
  proposals: ProposalRecord[];
}

export const SellerProposalBuilder: React.FC<SellerProposalBuilderProps> = ({
  assets,
  proposals,
}) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientCompany, setClientCompany] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [selectedAssetId, setSelectedAssetId] = useState("");
  const [flightMonths, setFlightMonths] = useState("2");
  const [agencyDiscount, setAgencyDiscount] = useState("10");
  const [productionCost, setProductionCost] = useState("1200");
  const [proposalNotes, setProposalNotes] = useState(
    "Includes daily broadcast logs, 24/7 technical monitoring, and live camera proof of play verification.",
  );

  const [proposalItems, setProposalItems] = useState<ProposalItem[]>([]);

  const handleAddItem = () => {
    if (!selectedAssetId) {
      toast.error("Please select a media space from your fleet.");
      return;
    }
    const asset = assets.find((a) => a.id === selectedAssetId);
    if (!asset) return;

    if (proposalItems.some((i) => i.assetId === asset.id)) {
      toast.error("This space is already in the proposal.");
      return;
    }

    const months = Number(flightMonths) || 1;
    const item: ProposalItem = {
      assetId: asset.id,
      title: asset.title,
      medium: asset.medium,
      city: asset.city,
      monthlyRate: asset.pricePerMonth,
      months,
      total: asset.pricePerMonth * months,
    };

    setProposalItems([...proposalItems, item]);
    setSelectedAssetId("");
  };

  const handleRemoveItem = (assetId: string) => {
    setProposalItems(proposalItems.filter((i) => i.assetId !== assetId));
  };

  // Calculations
  const subtotal = useMemo(() => {
    return proposalItems.reduce((sum, item) => sum + item.total, 0);
  }, [proposalItems]);

  const discountAmount = useMemo(() => {
    return Math.round((subtotal * Number(agencyDiscount)) / 100) || 0;
  }, [subtotal, agencyDiscount]);

  const grandTotal = useMemo(() => {
    return subtotal - discountAmount + (Number(productionCost) || 0);
  }, [subtotal, discountAmount, productionCost]);

  const handleCreateProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientEmail.trim()) {
      toast.error("Please provide client name and email.");
      return;
    }
    if (proposalItems.length === 0) {
      toast.error("Please add at least one media asset to the proposal.");
      return;
    }

    const newRecord = sellerStore.addProposal({
      proposalNumber: `RFP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      clientName: clientName.trim(),
      clientCompany: clientCompany.trim() || "Brand Direct",
      clientEmail: clientEmail.trim(),
      items: proposalItems,
      subtotal,
      agencyDiscountPct: Number(agencyDiscount) || 0,
      productionCost: Number(productionCost) || 0,
      totalAmount: grandTotal,
      currency: "USD",
      status: "sent",
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      notes: proposalNotes,
    });

    toast.success(`Proposal ${newRecord.proposalNumber} created & ready to send!`);
    setIsCreateOpen(false);
    setProposalItems([]);
    setClientName("");
    setClientCompany("");
    setClientEmail("");
  };

  const handleCopyLink = (p: ProposalRecord) => {
    navigator.clipboard.writeText(`${window.location.origin}/browse?proposal=${p.proposalNumber}`);
    toast.success("Client proposal quote link copied to clipboard!");
  };

  const handleMarkAccepted = (id: string) => {
    sellerStore.updateProposalStatus(id, "accepted");
    toast.success("Proposal marked as Accepted! Ready for contract flight.");
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <Card className="border-border/80 shadow-xs">
        <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-semibold text-primary">Agency Proposal Studio</span>
              <span aria-hidden="true">·</span>
              <span>Instant Media Kit & Quote Generation</span>
            </div>
            <h2 className="text-lg font-bold font-display text-foreground mt-1">
              Advertiser Proposals & Formal RFP Quotes
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Assemble multi-screen media plans, apply agency commission discounts, and issue
              binding quotes.
            </p>
          </div>

          <Button
            onClick={() => setIsCreateOpen(true)}
            className="text-xs font-semibold px-4 self-start sm:self-auto"
          >
            <Plus className="mr-1.5 size-4" /> Create New Proposal
          </Button>
        </CardContent>
      </Card>

      {/* Proposals List */}
      <div className="grid gap-4">
        {proposals.map((proposal) => (
          <Card
            key={proposal.id}
            className="border-border/80 shadow-xs hover:border-primary/40 transition-all"
          >
            <CardContent className="p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-primary">
                    {proposal.proposalNumber}
                  </span>
                  <span aria-hidden="true" className="text-muted-foreground">
                    ·
                  </span>
                  <span className="font-semibold text-sm text-foreground">
                    {proposal.clientCompany}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({proposal.clientName} · {proposal.clientEmail})
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                      proposal.status === "accepted"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : proposal.status === "sent"
                          ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {proposal.status}
                  </span>
                </div>

                {/* Items included in proposal */}
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span>Included Media:</span>
                  {proposal.items.map((item, idx) => (
                    <span key={item.assetId} className="font-medium text-foreground">
                      {item.title} ({item.months} mo){idx < proposal.items.length - 1 ? " · " : ""}
                    </span>
                  ))}
                </div>

                <p className="text-xs text-muted-foreground italic">"{proposal.notes}"</p>

                <p className="text-[11px] text-muted-foreground">
                  Created on {proposal.createdAt} · Valid until {proposal.validUntil}
                </p>
              </div>

              {/* Financial Total & Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-t lg:border-t-0 pt-3 lg:pt-0 border-border/60">
                <div className="lg:text-right">
                  <p className="text-lg font-bold font-display text-foreground">
                    {formatPrice(proposal.totalAmount, proposal.currency)}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Gross {formatPrice(proposal.subtotal)} · {proposal.agencyDiscountPct}% Agency
                    Net
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyLink(proposal)}
                    className="text-xs h-8 px-2.5"
                    title="Copy Shareable Link"
                  >
                    <Copy className="size-3.5 mr-1" /> Share Quote
                  </Button>

                  {proposal.status !== "accepted" && (
                    <Button
                      size="sm"
                      onClick={() => handleMarkAccepted(proposal.id)}
                      className="text-xs h-8 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                    >
                      <CheckCircle2 className="size-3.5 mr-1" /> Mark Accepted
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Proposal Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">Build Advertiser Proposal / RFP</DialogTitle>
            <DialogDescription className="text-xs">
              Select inventory from your media fleet, set campaign duration, and apply agency
              commission terms.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateProposal} className="space-y-4 py-2">
            {/* Client Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="clientCompany" className="text-xs">
                  Client / Brand
                </Label>
                <Input
                  id="clientCompany"
                  placeholder="e.g. BMW North America"
                  value={clientCompany}
                  onChange={(e) => setClientCompany(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="clientName" className="text-xs">
                  Contact Person
                </Label>
                <Input
                  id="clientName"
                  placeholder="e.g. Marcus Vance"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="clientEmail" className="text-xs">
                  Client Email
                </Label>
                <Input
                  id="clientEmail"
                  type="email"
                  placeholder="client@agency.com"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Media Asset Picker */}
            <div className="rounded-xl border border-border/80 bg-muted/20 p-3.5 space-y-3">
              <Label className="text-xs font-semibold text-foreground">
                Add Spaces to Proposal
              </Label>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1">
                  <Select value={selectedAssetId} onValueChange={setSelectedAssetId}>
                    <SelectTrigger className="text-xs">
                      <SelectValue placeholder="Select media from your fleet..." />
                    </SelectTrigger>
                    <SelectContent>
                      {assets.map((asset) => (
                        <SelectItem key={asset.id} value={asset.id}>
                          {asset.title} ({asset.city}) — {formatPrice(asset.pricePerMonth)}/mo
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-28">
                  <Select value={flightMonths} onValueChange={setFlightMonths}>
                    <SelectTrigger className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Month</SelectItem>
                      <SelectItem value="2">2 Months</SelectItem>
                      <SelectItem value="3">3 Months</SelectItem>
                      <SelectItem value="6">6 Months</SelectItem>
                      <SelectItem value="12">12 Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="button" onClick={handleAddItem} size="sm" className="text-xs">
                  <Plus className="size-3.5 mr-1" /> Add
                </Button>
              </div>

              {/* Items Table */}
              {proposalItems.length > 0 ? (
                <div className="mt-2 divide-y divide-border/60 rounded-lg border border-border/60 bg-card overflow-hidden">
                  {proposalItems.map((item) => (
                    <div
                      key={item.assetId}
                      className="flex items-center justify-between p-2.5 text-xs"
                    >
                      <div>
                        <p className="font-semibold text-foreground">{item.title}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {mediumLabel(item.medium)} · {item.city} · {formatPrice(item.monthlyRate)}
                          /mo × {item.months} months
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-foreground">{formatPrice(item.total)}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveItem(item.assetId)}
                          className="size-6 text-rose-500"
                        >
                          <Trash2 className="size-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-muted-foreground italic text-center py-2">
                  No spaces added yet. Select a billboard above to add to this proposal.
                </p>
              )}
            </div>

            {/* Financial Adjustments */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="discount" className="text-xs">
                  Agency Commission Discount (%)
                </Label>
                <Input
                  id="discount"
                  type="number"
                  min={0}
                  max={50}
                  value={agencyDiscount}
                  onChange={(e) => setAgencyDiscount(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="production" className="text-xs">
                  Production / Transcoding Fee ($)
                </Label>
                <Input
                  id="production"
                  type="number"
                  min={0}
                  value={productionCost}
                  onChange={(e) => setProductionCost(e.target.value)}
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <Label htmlFor="notes" className="text-xs">
                Terms & Deliverables
              </Label>
              <Textarea
                id="notes"
                rows={2}
                value={proposalNotes}
                onChange={(e) => setProposalNotes(e.target.value)}
                className="text-xs"
              />
            </div>

            {/* Summary Box */}
            <div className="rounded-xl bg-muted/60 p-3.5 space-y-1.5 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Gross Space Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Agency Discount ({agencyDiscount}%)</span>
                <span className="text-emerald-600 dark:text-emerald-400">
                  -{formatPrice(discountAmount)}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Production & Installation Fee</span>
                <span>+{formatPrice(Number(productionCost) || 0)}</span>
              </div>
              <div className="pt-2 border-t border-border/60 flex justify-between font-bold text-sm text-foreground">
                <span>Final Proposal Total</span>
                <span className="font-display text-primary">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" className="text-xs font-semibold">
                Generate & Finalize Proposal
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
