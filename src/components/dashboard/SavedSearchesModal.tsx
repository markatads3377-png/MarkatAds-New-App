import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bookmark, Search, Trash2, ArrowRight, MapPin, Sparkles } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export interface SavedSearchItem {
  id: string;
  name: string;
  query: string;
  medium?: string;
  city?: string;
  budgetMax?: number;
  dateSaved: string;
  matchCount: number;
}

const DEFAULT_SAVED_SEARCHES: SavedSearchItem[] = [
  {
    id: "search-1",
    name: "Dubai Sheikh Zayed Digital LED",
    query: "Sheikh Zayed Road",
    medium: "digital_screen",
    city: "Dubai",
    budgetMax: 500,
    dateSaved: "2 days ago",
    matchCount: 14,
  },
  {
    id: "search-2",
    name: "Mumbai High-Traffic Highway Hoardings",
    query: "Bandra",
    medium: "billboard",
    city: "Mumbai",
    budgetMax: 300,
    dateSaved: "1 week ago",
    matchCount: 9,
  },
  {
    id: "search-3",
    name: "Times Square & Broadway DOOH",
    query: "Times Square",
    medium: "digital_screen",
    city: "New York",
    budgetMax: 1200,
    dateSaved: "2 weeks ago",
    matchCount: 6,
  },
];

interface SavedSearchesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSearch?: (item: SavedSearchItem) => void;
}

export const SavedSearchesModal: React.FC<SavedSearchesModalProps> = ({
  isOpen,
  onClose,
  onSelectSearch,
}) => {
  const [searches, setSearches] = useState<SavedSearchItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("markatads_saved_searches");
        if (stored) return JSON.parse(stored);
      } catch {
        // fallback
      }
    }
    return DEFAULT_SAVED_SEARCHES;
  });

  const navigate = useNavigate();

  const handleDelete = (id: string) => {
    const updated = searches.filter((s) => s.id !== id);
    setSearches(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("markatads_saved_searches", JSON.stringify(updated));
    }
    toast.success("Saved search removed.");
  };

  const handleRunSearch = (item: SavedSearchItem) => {
    onClose();
    if (onSelectSearch) {
      onSelectSearch(item);
    } else {
      navigate({
        to: "/browse",
        search: {
          search: item.query,
          city: item.city,
          medium: item.medium,
        },
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg p-0 overflow-hidden bg-white border-neutral-200">
        <DialogHeader className="p-5 border-b border-neutral-100 bg-neutral-50/50">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-red-50 text-[#C62828] grid place-items-center">
              <Bookmark className="size-4.5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-neutral-900 font-display">
                Saved Search Alerts
              </DialogTitle>
              <DialogDescription className="text-xs text-neutral-500">
                Instantly revisit or run your favorite OOH inventory filters.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-5 space-y-3 max-h-[60vh] overflow-y-auto">
          {searches.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <Search className="size-8 text-neutral-300 mx-auto" />
              <p className="text-sm font-semibold text-neutral-700">No saved searches</p>
              <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                When searching for billboards or screens, click "Save Search" to receive live
                inventory updates.
              </p>
            </div>
          ) : (
            searches.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl border border-neutral-200 hover:border-[#C62828]/50 transition-all flex items-center justify-between gap-3 group bg-white shadow-2xs"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-neutral-900 truncate">{item.name}</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold">
                      {item.matchCount} live spaces
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-neutral-500 flex-wrap">
                    <span className="flex items-center gap-0.5">
                      <MapPin className="size-3 text-neutral-400" />
                      {item.city}
                    </span>
                    <span>•</span>
                    <span className="capitalize">{item.medium?.replace("_", " ")}</span>
                    <span>•</span>
                    <span>Saved {item.dateSaved}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <Button
                    size="sm"
                    onClick={() => handleRunSearch(item)}
                    className="h-8 text-xs font-semibold bg-[#C62828] hover:bg-[#B71C1C] text-white gap-1 px-3 shadow-2xs"
                  >
                    <span>Run</span>
                    <ArrowRight className="size-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(item.id)}
                    className="size-8 text-neutral-400 hover:text-red-600 hover:bg-red-50"
                    title="Delete saved search"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
