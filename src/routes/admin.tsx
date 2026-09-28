import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import React, { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import {
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Layers,
  ShoppingBag,
  Users,
  Settings,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Eye,
  Edit,
  Trash2,
  Plus,
  RefreshCw,
  Sliders,
  ExternalLink,
  LogOut,
  Sparkles,
  BarChart3,
  BadgePercent,
  Radio,
  FileText,
  MapPin,
  Building,
  ArrowUpRight,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { MOCK_CATALOG, type ExtendedListing } from "@/data/mockCatalog";
import { useAuth, loginWithDemo, logoutUser } from "@/hooks/useAuth";
import { useEcom, type PlacedOrder } from "@/context/EcomContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Platform Admin Console — Mark@Ads" },
      {
        name: "description",
        content:
          "Master operations, inventory management, user controls, and marketplace financials for Mark@Ads.",
      },
    ],
  }),
  component: AdminPage,
});

// Seed sample admin data if not present
const INITIAL_DEMO_USERS = [
  {
    id: "usr_adm_1",
    username: "admin",
    name: "Master Administrator",
    email: "admin@markatads.com",
    role: "admin",
    company: "Mark@Ads Platform HQ",
    status: "active",
    joinedDate: "2026-01-10",
    verified: true,
  },
  {
    id: "usr_adm_2",
    username: "markatads3377",
    name: "Mark@Ads Owner",
    email: "markatads3377@gmail.com",
    role: "admin",
    company: "Global Advertising Ops",
    status: "active",
    joinedDate: "2026-01-15",
    verified: true,
  },
  {
    id: "usr_sel_1",
    username: "apex_media_demo",
    name: "Apex Outdoor Media Group",
    email: "inventory@apexmedia.demo",
    role: "seller",
    company: "Apex Outdoor Media LLC",
    status: "active",
    joinedDate: "2026-02-01",
    verified: true,
  },
  {
    id: "usr_sel_2",
    username: "skyline_digitals",
    name: "Skyline DOOH Networks",
    email: "sales@skylinedooh.com",
    role: "seller",
    company: "Skyline Media Group",
    status: "active",
    joinedDate: "2026-02-12",
    verified: true,
  },
  {
    id: "usr_buy_1",
    username: "horizon_brand_demo",
    name: "Horizon Advertising Agency",
    email: "media@horizonbrands.demo",
    role: "buyer",
    company: "Horizon Global Brands",
    status: "active",
    joinedDate: "2026-02-18",
    verified: true,
  },
  {
    id: "usr_buy_2",
    username: "zenith_retail",
    name: "Zenith Consumer Brands",
    email: "campaigns@zenithretail.com",
    role: "buyer",
    company: "Zenith Retail Group",
    status: "active",
    joinedDate: "2026-03-02",
    verified: true,
  },
];

const REVENUE_DATA = [
  { month: "Oct", gmv: 340000, commission: 28900 },
  { month: "Nov", gmv: 420000, commission: 35700 },
  { month: "Dec", gmv: 610000, commission: 51850 },
  { month: "Jan", gmv: 520000, commission: 44200 },
  { month: "Feb", gmv: 680000, commission: 57800 },
  { month: "Mar", gmv: 890000, commission: 75650 },
];

const MEDIUM_DISTRIBUTION = [
  { name: "Billboards", value: 38, color: "#2563eb" },
  { name: "Digital OOH", value: 32, color: "#10b981" },
  { name: "Transit", value: 16, color: "#f59e0b" },
  { name: "Airport", value: 9, color: "#8b5cf6" },
  { name: "Mall Screens", value: 5, color: "#ec4899" },
];

export function AdminPage() {
  const navigate = useNavigate();
  const { session, role, username } = useAuth();
  const { orders = [], formatMoney } = useEcom();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Selected Active Tab
  const [currentTab, setCurrentTab] = useState("overview");

  // Editable Listings State
  const [listings, setListings] = useState<ExtendedListing[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("markatads_admin_listings");
        if (saved) return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return MOCK_CATALOG;
  });

  // Editable Users State
  const [users, setUsers] = useState(INITIAL_DEMO_USERS);

  // Platform Settings State
  const [platformFee, setPlatformFee] = useState<number>(8.5);
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(false);
  const [announcementText, setAnnouncementText] = useState<string>(
    "Notice: Q2 Premium billboard flight reservations are now open worldwide.",
  );

  // Listing Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMedium, setSelectedMedium] = useState<string>("all");

  // Edit Listing Dialog State
  const [editingListing, setEditingListing] = useState<ExtendedListing | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editCity, setEditCity] = useState("");
  const [editAvailable, setEditAvailable] = useState(true);
  const [editFeatured, setEditFeatured] = useState(false);

  // Add User Dialog State
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<string>("seller");

  // Save listings to local storage helper
  const persistListings = (updated: ExtendedListing[]) => {
    setListings(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("markatads_admin_listings", JSON.stringify(updated));
      } catch {
        // ignore
      }
    }
  };

  // Toggle Featured status
  const toggleFeaturedListing = (id: string) => {
    const updated = listings.map((item) =>
      item.id === id ? { ...item, featured: !item.featured } : item,
    );
    persistListings(updated);
    toast.success("Listing feature status updated");
  };

  // Toggle Availability
  const toggleAvailableListing = (id: string) => {
    const updated = listings.map((item) =>
      item.id === id ? { ...item, available: !item.available } : item,
    );
    persistListings(updated);
    toast.success("Listing availability toggled");
  };

  // Delete Listing
  const deleteListing = (id: string) => {
    if (
      !window.confirm("Are you sure you want to remove this media space listing from the platform?")
    )
      return;
    const updated = listings.filter((l) => l.id !== id);
    persistListings(updated);
    toast.success("Listing removed by administrator");
  };

  // Open Edit Modal
  const openEditListing = (listing: ExtendedListing) => {
    setEditingListing(listing);
    setEditTitle(listing.title);
    setEditPrice(listing.price_per_month);
    setEditCity(listing.city);
    setEditAvailable(listing.available);
    setEditFeatured(!!listing.featured);
  };

  // Save Edit
  const saveListingEdit = () => {
    if (!editingListing) return;
    const updated = listings.map((item) =>
      item.id === editingListing.id
        ? {
            ...item,
            title: editTitle,
            price_per_month: editPrice,
            city: editCity,
            available: editAvailable,
            featured: editFeatured,
          }
        : item,
    );
    persistListings(updated);
    setEditingListing(null);
    toast.success("Listing updated successfully");
  };

  // Toggle User Status
  const toggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, status: u.status === "active" ? "suspended" : "active" } : u,
      ),
    );
    toast.success("User access state updated");
  };

  // Change User Role
  const changeUserRole = (userId: string, newRole: string) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    toast.success(`User role adjusted to ${newRole}`);
  };

  // Add New User
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newEmail) {
      toast.error("Please fill in required user details");
      return;
    }
    const newUser = {
      id: `usr_${Date.now()}`,
      username: newUsername.trim().toLowerCase(),
      name: newName.trim() || newUsername,
      email: newEmail.trim().toLowerCase(),
      role: newRole,
      company: `${newName || newUsername} Enterprise`,
      status: "active",
      joinedDate: new Date().toISOString().split("T")[0],
      verified: true,
    };
    setUsers((prev) => [newUser, ...prev]);
    setIsAddUserOpen(false);
    setNewUsername("");
    setNewName("");
    setNewEmail("");
    toast.success(`New ${newRole} account created successfully`);
  };

  // Filtered listings
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.seller_name && item.seller_name.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesMedium = selectedMedium === "all" || item.medium === selectedMedium;
      return matchesSearch && matchesMedium;
    });
  }, [listings, searchQuery, selectedMedium]);

  // Combined orders (Demo + actual orders from context)
  const allOrders = useMemo(() => {
    const demoOrders: PlacedOrder[] = [
      {
        id: "ORD-9418",
        createdAt: "2026-03-24T14:20:00Z",
        items: [
          {
            id: "cart-1",
            listing: MOCK_CATALOG[0],
            durationMonths: 3,
            startDate: "2026-04-01",
            addons: {
              printing: true,
              creativeDesign: false,
              proofOfPlay: true,
              stormInsurance: true,
            },
          },
        ],
        subtotal: 1350000,
        discountAmount: 0,
        addonsTotal: 699,
        taxAmount: 67500,
        totalAmount: 1418199,
        currency: "INR",
        paymentMethod: "Corporate Wire Transfer",
        advertiserName: "Global Auto Brands",
        advertiserEmail: "marketing@globalauto.com",
        companyName: "Horizon Motors Ltd",
        status: "Live on Air",
        flightStartDate: "2026-04-01",
        flightEndDate: "2026-06-30",
      },
      {
        id: "ORD-8812",
        createdAt: "2026-03-22T09:15:00Z",
        items: [
          {
            id: "cart-2",
            listing: MOCK_CATALOG[1],
            durationMonths: 1,
            startDate: "2026-04-15",
            addons: {
              printing: false,
              creativeDesign: true,
              proofOfPlay: true,
              stormInsurance: false,
            },
          },
        ],
        subtotal: 32000,
        discountAmount: 1600,
        addonsTotal: 400,
        taxAmount: 1540,
        totalAmount: 32340,
        currency: "AED",
        paymentMethod: "Business Credit Card",
        advertiserName: "Luxe Retail Fragrances",
        advertiserEmail: "ads@luxeparfums.ae",
        companyName: "Luxe Brands Gulf",
        status: "Creative Review",
        flightStartDate: "2026-04-15",
        flightEndDate: "2026-05-15",
      },
      {
        id: "ORD-7201",
        createdAt: "2026-03-20T11:45:00Z",
        items: [
          {
            id: "cart-3",
            listing: MOCK_CATALOG[2],
            durationMonths: 2,
            startDate: "2026-05-01",
            addons: {
              printing: true,
              creativeDesign: true,
              proofOfPlay: true,
              stormInsurance: true,
            },
          },
        ],
        subtotal: 96000,
        discountAmount: 4800,
        addonsTotal: 949,
        taxAmount: 4607,
        totalAmount: 96756,
        currency: "USD",
        paymentMethod: "ACH Escrow",
        advertiserName: "Vertex Fintech Solutions",
        advertiserEmail: "growth@vertexpay.io",
        companyName: "Vertex Technologies Inc",
        status: "Mounting & Prep",
        flightStartDate: "2026-05-01",
        flightEndDate: "2026-06-30",
      },
    ];

    // Merge placed orders from user checkout safely
    const safeUserOrders = Array.isArray(orders) ? orders : [];
    return [...safeUserOrders, ...demoOrders];
  }, [orders]);

  // If user is not authenticated or not admin, show instant admin auth gate with 1-click bypass
  const isAdmin = role === "admin" || (session && username === "admin");

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-xl">
          <CardHeader className="text-center space-y-2 pb-4">
            <div className="mx-auto size-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 grid place-items-center text-amber-400">
              <Lock className="size-7" />
            </div>
            <CardTitle className="text-2xl font-bold font-display text-white">
              Platform Admin Console
            </CardTitle>
            <CardDescription className="text-slate-400 text-sm">
              Restricted management portal for Mark@Ads marketplace operators.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Default Admin Credentials:</span>
                <span className="font-mono text-emerald-400 font-semibold">Ready to Use</span>
              </div>
              <div className="text-xs font-mono bg-slate-900 p-2.5 rounded-lg border border-slate-800 space-y-1">
                <div>
                  <span className="text-slate-500">Username:</span>{" "}
                  <span className="text-amber-300 font-bold">admin</span>{" "}
                  <span className="text-slate-500">or</span>{" "}
                  <span className="text-amber-300">admin@markatads.com</span>
                </div>
                <div>
                  <span className="text-slate-500">Password:</span>{" "}
                  <span className="text-amber-300 font-bold">admin123</span>
                </div>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm h-11 gap-2 shadow-lg shadow-amber-500/20"
              onClick={() => {
                loginWithDemo("admin");
                toast.success("Authenticated as Master Administrator!");
              }}
            >
              <ShieldCheck className="size-4" />
              1-Click Enter Admin Panel
            </Button>

            <div className="text-center">
              <Link
                to="/auth"
                className="text-xs text-slate-400 hover:text-white transition-colors underline"
              >
                Sign in with custom password / Google account
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Admin Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-800/90 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="size-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 grid place-items-center font-bold text-slate-950 text-sm shadow-md shadow-amber-500/20">
                MA
              </span>
              <span className="font-display font-bold text-base tracking-tight text-white hidden sm:inline">
                Mark@Ads{" "}
                <span className="text-amber-400 text-xs px-1.5 py-0.5 rounded bg-amber-400/10 ml-1 border border-amber-400/20">
                  OPS CONSOLE
                </span>
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-slate-800 text-xs text-slate-400">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>All Systems Operational</span>
              <span className="text-slate-600">•</span>
              <span>Database: Connected</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-200 text-xs h-9 gap-1.5"
            >
              <Link to="/browse">
                <ExternalLink className="size-3.5" />
                <span className="hidden sm:inline">Live Marketplace</span>
              </Link>
            </Button>

            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs">
              <ShieldCheck className="size-4 text-amber-400" />
              <span className="font-medium text-slate-200 hidden md:inline">Master Admin</span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 text-xs h-9"
              onClick={async () => {
                await logoutUser();
                toast.info("Admin session terminated");
                navigate({ to: "/auth" });
              }}
            >
              <LogOut className="size-3.5 mr-1" />
              <span className="hidden sm:inline">Exit</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Banner Alert if Maintenance Mode */}
        {maintenanceMode && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-rose-400" />
              <span>
                <strong>Maintenance Mode Active:</strong> Public user bookings and new listing
                creations are temporarily restricted.
              </span>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="border-rose-500/40 text-rose-200 text-xs h-8"
              onClick={() => setMaintenanceMode(false)}
            >
              Disable
            </Button>
          </div>
        )}

        {/* Navigation Tabs */}
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
          <TabsList className="bg-slate-900 border border-slate-800/80 p-1 rounded-xl w-full sm:w-auto grid grid-cols-2 sm:flex sm:flex-row gap-1">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950 font-semibold text-xs sm:text-sm py-2 px-4 rounded-lg"
            >
              <BarChart3 className="size-4 mr-2" />
              Overview & Analytics
            </TabsTrigger>
            <TabsTrigger
              value="listings"
              className="data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950 font-semibold text-xs sm:text-sm py-2 px-4 rounded-lg"
            >
              <Layers className="size-4 mr-2" />
              Listings ({listings.length})
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950 font-semibold text-xs sm:text-sm py-2 px-4 rounded-lg"
            >
              <ShoppingBag className="size-4 mr-2" />
              Campaign Flights ({allOrders.length})
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950 font-semibold text-xs sm:text-sm py-2 px-4 rounded-lg"
            >
              <Users className="size-4 mr-2" />
              Partners & Users ({users.length})
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950 font-semibold text-xs sm:text-sm py-2 px-4 rounded-lg"
            >
              <Settings className="size-4 mr-2" />
              Platform Controls
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: OVERVIEW & ANALYTICS */}
          <TabsContent value="overview" className="space-y-6">
            {/* KPI Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-xs">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Total Marketplace GMV
                  </CardTitle>
                  <DollarSign className="size-4 text-emerald-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-display text-white">$1,482,900</div>
                  <p className="text-xs text-emerald-400 flex items-center gap-1 mt-1 font-medium">
                    <TrendingUp className="size-3" />
                    +18.4% from last calendar month
                  </p>
                </CardContent>
              </Card>

              <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-xs">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Net Operator Commission
                  </CardTitle>
                  <BadgePercent className="size-4 text-amber-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-display text-amber-400">$126,046</div>
                  <p className="text-xs text-slate-400 mt-1">
                    Based on current {platformFee}% take rate
                  </p>
                </CardContent>
              </Card>

              <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-xs">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Active Media Spaces
                  </CardTitle>
                  <Radio className="size-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-display text-white">
                    {listings.length}
                  </div>
                  <p className="text-xs text-blue-400 mt-1">
                    {listings.filter((l) => l.featured).length} featured spectaculars
                  </p>
                </CardContent>
              </Card>

              <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-xs">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Live Flight Bookings
                  </CardTitle>
                  <ShoppingBag className="size-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-display text-white">
                    {allOrders.length}
                  </div>
                  <p className="text-xs text-purple-400 mt-1">
                    Across 14 global metropolitan regions
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Visual Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 border-slate-800 bg-slate-900/60">
                <CardHeader>
                  <CardTitle className="text-base font-semibold text-white">
                    Platform GMV & Commission Velocity (Past 6 Months)
                  </CardTitle>
                  <CardDescription className="text-slate-400 text-xs">
                    Aggregated media booking value booked through Mark@Ads
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-72">
                  {isMounted ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={REVENUE_DATA}
                        margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="month" stroke="#64748b" textAnchor="middle" />
                        <YAxis stroke="#64748b" tickFormatter={(v) => `$${v / 1000}k`} />
                        <RechartsTooltip
                          contentStyle={{
                            backgroundColor: "#0f172a",
                            borderColor: "#334155",
                            borderRadius: "0.5rem",
                            color: "#fff",
                          }}
                          formatter={(val: number) => [`$${val.toLocaleString()}`, "Amount"]}
                        />
                        <Bar
                          dataKey="gmv"
                          name="Gross Booking Volume"
                          fill="#3b82f6"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          dataKey="commission"
                          name="Platform Take"
                          fill="#f59e0b"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full w-full rounded-lg bg-slate-900/40 animate-pulse flex items-center justify-center text-xs text-slate-500">
                      Loading chart...
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-slate-800 bg-slate-900/60">
                <CardHeader>
                  <CardTitle className="text-base font-semibold text-white">
                    Media Inventory Mix
                  </CardTitle>
                  <CardDescription className="text-slate-400 text-xs">
                    Breakdown of billboard & screen formats
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-72 flex flex-col justify-between">
                  <div className="h-44 w-full">
                    {isMounted ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={MEDIUM_DISTRIBUTION}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={75}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {MEDIUM_DISTRIBUTION.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <RechartsTooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full w-full rounded-lg bg-slate-900/40 animate-pulse flex items-center justify-center text-xs text-slate-500">
                        Loading distribution...
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800">
                    {MEDIUM_DISTRIBUTION.map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <span
                          className="size-2.5 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-slate-300 truncate">{item.name}</span>
                        <span className="text-slate-500 font-mono ml-auto">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Activity Audit Log */}
            <Card className="border-slate-800 bg-slate-900/60">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold text-white">
                    Recent Platform Operational Events
                  </CardTitle>
                  <CardDescription className="text-slate-400 text-xs">
                    Live immutable stream of transactions, registrations, and reviews
                  </CardDescription>
                </div>
                <Badge variant="outline" className="border-slate-700 text-slate-300 text-[10px]">
                  Realtime Stream
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      icon: ShoppingBag,
                      color: "text-emerald-400",
                      title: "New Booking Order ORD-9418 confirmed",
                      desc: "Global Auto Brands reserved Bandra Western Express Hoarding (3 Months flight)",
                      time: "12 mins ago",
                    },
                    {
                      icon: Layers,
                      color: "text-blue-400",
                      title: "Listing verification badge awarded",
                      desc: "Dubai Mall Atrium LED Screen marked as Verified High-Flux",
                      time: "45 mins ago",
                    },
                    {
                      icon: Users,
                      color: "text-purple-400",
                      title: "New Media Owner Onboarded",
                      desc: "Skyline DOOH Networks registered with 14 metropolitan LED screens",
                      time: "2 hours ago",
                    },
                    {
                      icon: ShieldCheck,
                      color: "text-amber-400",
                      title: "Platform Security & Rules Deployed",
                      desc: "Firestore access controls synchronized with zero-trust model",
                      time: "4 hours ago",
                    },
                  ].map((evt, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-lg bg-slate-950/50 border border-slate-800/70"
                    >
                      <evt.icon className={`size-4 mt-0.5 ${evt.color}`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-slate-200">{evt.title}</div>
                        <div className="text-xs text-slate-400 truncate">{evt.desc}</div>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono whitespace-nowrap">
                        {evt.time}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 2: LISTINGS & INVENTORY MANAGEMENT */}
          <TabsContent value="listings" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="size-4 text-slate-400 absolute left-3 top-2.5" />
                  <Input
                    placeholder="Search listings, cities..."
                    className="pl-9 bg-slate-900 border-slate-800 text-slate-100 text-xs h-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <Select value={selectedMedium} onValueChange={setSelectedMedium}>
                  <SelectTrigger className="w-40 bg-slate-900 border-slate-800 text-slate-100 text-xs h-9">
                    <SelectValue placeholder="All Formats" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
                    <SelectItem value="all">All Formats</SelectItem>
                    <SelectItem value="billboard">Billboards</SelectItem>
                    <SelectItem value="mall">Mall Screens</SelectItem>
                    <SelectItem value="transit">Transit & Buses</SelectItem>
                    <SelectItem value="airport">Airports</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-slate-800 text-slate-300 text-xs h-9 gap-1.5"
                  onClick={() => {
                    persistListings(MOCK_CATALOG);
                    toast.success("Listings reset to master catalog");
                  }}
                >
                  <RefreshCw className="size-3.5" />
                  Reset Catalog
                </Button>
              </div>
            </div>

            {/* Listings Table */}
            <Card className="border-slate-800 bg-slate-900/60 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Media Unit</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Format</th>
                      <th className="py-3 px-4">Rate / Month</th>
                      <th className="py-3 px-4">Impressions</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-200">
                    {filteredListings.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-white flex items-center gap-1.5">
                            {item.title}
                            {item.featured && (
                              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-[10px] px-1.5 py-0">
                                Featured
                              </Badge>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono truncate max-w-xs">
                            ID: {item.id} • {item.seller_name || "Direct Media Partner"}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1 text-slate-300">
                            <MapPin className="size-3 text-slate-500" />
                            {item.city}, {item.country}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <Badge
                            variant="outline"
                            className="border-slate-700 capitalize text-[11px]"
                          >
                            {item.medium}
                          </Badge>
                        </td>

                        <td className="py-3 px-4 font-mono font-medium text-emerald-400">
                          {formatMoney(item.price_per_month, item.currency)}
                        </td>

                        <td className="py-3 px-4 text-slate-400">
                          {item.daily_impressions || "250,000+ daily"}
                        </td>

                        <td className="py-3 px-4">
                          {item.available ? (
                            <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                              <span className="size-1.5 rounded-full bg-emerald-400"></span>
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-slate-500 font-medium">
                              <span className="size-1.5 rounded-full bg-slate-500"></span>
                              Paused
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              variant="ghost"
                              className={`h-7 px-2 text-xs ${
                                item.featured ? "text-amber-400" : "text-slate-400"
                              }`}
                              title="Toggle Featured"
                              onClick={() => toggleFeaturedListing(item.id)}
                            >
                              <Sparkles className="size-3.5" />
                            </Button>

                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 text-xs text-slate-400 hover:text-white"
                              title="Edit Details"
                              onClick={() => openEditListing(item)}
                            >
                              <Edit className="size-3.5" />
                            </Button>

                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                              title="Delete"
                              onClick={() => deleteListing(item.id)}
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* TAB 3: ORDERS & CAMPAIGN FLIGHTS */}
          <TabsContent value="orders" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-white">
                  Advertiser Bookings & Flight Pipeline
                </h3>
                <p className="text-xs text-slate-400">
                  Track buyer reservations, artwork upload approvals, mounting status, and proof of
                  play.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {allOrders.map((ord) => (
                <Card key={ord.id} className="border-slate-800 bg-slate-900/60 p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-amber-400">{ord.id}</span>
                        <Badge
                          className={`text-xs ${
                            ord.status === "Live on Air"
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                              : ord.status === "Mounting & Prep"
                                ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                                : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                          }`}
                        >
                          {ord.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-slate-400">
                        Booked by{" "}
                        <strong className="text-slate-200">
                          {ord.companyName || ord.advertiserName}
                        </strong>{" "}
                        ({ord.advertiserEmail})
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-bold font-mono text-emerald-400">
                        {formatMoney(ord.totalAmount, ord.currency)}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Payment: {ord.paymentMethod}
                      </div>
                    </div>
                  </div>

                  {/* Flight Item Details */}
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Reserved Media Spaces
                    </div>
                    {ord.items.map((it, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                      >
                        <div>
                          <div className="font-semibold text-white">{it.listing.title}</div>
                          <div className="text-slate-400">
                            Location: {it.listing.city}, {it.listing.country} • Flight Duration:{" "}
                            {it.durationMonths} Month(s)
                          </div>
                        </div>
                        <div className="text-slate-300 font-mono">
                          Flight Dates: {ord.flightStartDate} → {ord.flightEndDate}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Admin State Transition */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
                    <div className="text-slate-400">
                      Operator Actions: Advance flight lifecycle or issue proof-of-play certificate.
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-800 text-slate-300 h-8 text-xs"
                        onClick={() => {
                          toast.success(`Proof of play certification generated for ${ord.id}`);
                        }}
                      >
                        Issue Proof of Play
                      </Button>
                      <Button
                        size="sm"
                        className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold h-8 text-xs"
                        onClick={() => {
                          toast.success(`Flight ${ord.id} marked as Live on Air!`);
                        }}
                      >
                        Mark Live on Air
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* TAB 4: PARTNERS & USERS */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-white">
                  Registered Media Partners & Advertisers
                </h3>
                <p className="text-xs text-slate-400">
                  Manage buyer and seller accounts, assign operator privileges, and configure
                  verified badges.
                </p>
              </div>

              <Button
                size="sm"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs h-9 gap-1.5"
                onClick={() => setIsAddUserOpen(true)}
              >
                <Plus className="size-3.5" />
                Add User / Operator
              </Button>
            </div>

            <Card className="border-slate-800 bg-slate-900/60 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Partner / User</th>
                      <th className="py-3 px-4">Email Address</th>
                      <th className="py-3 px-4">Organization</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Access Controls</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-200">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-white flex items-center gap-1.5">
                            {u.name}
                            {u.verified && <CheckCircle2 className="size-3.5 text-blue-400" />}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">@{u.username}</div>
                        </td>

                        <td className="py-3 px-4 font-mono text-slate-300">{u.email}</td>

                        <td className="py-3 px-4 text-slate-300">{u.company}</td>

                        <td className="py-3 px-4">
                          <Select value={u.role} onValueChange={(val) => changeUserRole(u.id, val)}>
                            <SelectTrigger className="w-28 bg-slate-950 border-slate-800 text-xs h-7">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
                              <SelectItem value="buyer">Buyer</SelectItem>
                              <SelectItem value="seller">Seller</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>

                        <td className="py-3 px-4">
                          {u.status === "active" ? (
                            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px]">
                              Active
                            </Badge>
                          ) : (
                            <Badge className="bg-rose-500/20 text-rose-300 border-rose-500/30 text-[10px]">
                              Suspended
                            </Badge>
                          )}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            className={`h-7 px-2.5 text-xs ${
                              u.status === "active"
                                ? "text-rose-400 hover:bg-rose-500/10"
                                : "text-emerald-400 hover:bg-emerald-500/10"
                            }`}
                            onClick={() => toggleUserStatus(u.id)}
                          >
                            {u.status === "active" ? "Suspend" : "Activate"}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* TAB 5: PLATFORM CONTROLS & SETTINGS */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Marketplace Financials */}
              <Card className="border-slate-800 bg-slate-900/60">
                <CardHeader>
                  <CardTitle className="text-base font-semibold text-white">
                    Marketplace Monetization & Commission
                  </CardTitle>
                  <CardDescription className="text-slate-400 text-xs">
                    Platform take rate automatically deducted from gross media booking proceeds
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <Label htmlFor="takeRate">Current Take Rate (%)</Label>
                      <span className="font-mono text-amber-400 font-bold text-sm">
                        {platformFee}%
                      </span>
                    </div>
                    <Input
                      id="takeRate"
                      type="number"
                      step="0.5"
                      min="0"
                      max="30"
                      className="bg-slate-950 border-slate-800 text-white font-mono"
                      value={platformFee}
                      onChange={(e) => setPlatformFee(parseFloat(e.target.value) || 0)}
                    />
                    <p className="text-[11px] text-slate-500">
                      Standard industry benchmark for out-of-home programmatic agencies is 7.5% -
                      12%.
                    </p>
                  </div>

                  <Button
                    size="sm"
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                    onClick={() =>
                      toast.success(`Platform commission rate updated to ${platformFee}%`)
                    }
                  >
                    Save Commission Rate
                  </Button>
                </CardContent>
              </Card>

              {/* Maintenance & Broadcasting */}
              <Card className="border-slate-800 bg-slate-900/60">
                <CardHeader>
                  <CardTitle className="text-base font-semibold text-white">
                    Global System Governance
                  </CardTitle>
                  <CardDescription className="text-slate-400 text-xs">
                    Emergency kill-switches and network announcement banners
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                    <div className="space-y-0.5">
                      <div className="text-xs font-semibold text-white">Maintenance Mode Lock</div>
                      <div className="text-[11px] text-slate-400">
                        Prevent public users from placing new media bookings
                      </div>
                    </div>
                    <Switch
                      checked={maintenanceMode}
                      onCheckedChange={(val) => {
                        setMaintenanceMode(val);
                        toast.info(val ? "Maintenance mode engaged" : "Marketplace unlocked");
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="broadcast" className="text-xs">
                      Global Announcement Banner
                    </Label>
                    <Input
                      id="broadcast"
                      className="bg-slate-950 border-slate-800 text-white text-xs"
                      value={announcementText}
                      onChange={(e) => setAnnouncementText(e.target.value)}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-800 text-slate-300 text-xs mt-2"
                      onClick={() => toast.success("Announcement broadcasted across marketplace")}
                    >
                      Broadcast Banner
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* EDIT LISTING MODAL */}
      <Dialog open={!!editingListing} onOpenChange={(open) => !open && setEditingListing(null)}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white text-base">Edit Media Space Listing</DialogTitle>
            <DialogDescription className="text-slate-400 text-xs">
              Modify rates, location details, and marketplace visibility.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <Label htmlFor="title">Listing Title</Label>
              <Input
                id="title"
                className="bg-slate-950 border-slate-800 text-white"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="price">Monthly Rate ({editingListing?.currency || "USD"})</Label>
                <Input
                  id="price"
                  type="number"
                  className="bg-slate-950 border-slate-800 text-white font-mono"
                  value={editPrice}
                  onChange={(e) => setEditPrice(parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="city">Metropolitan City</Label>
                <Input
                  id="city"
                  className="bg-slate-950 border-slate-800 text-white"
                  value={editCity}
                  onChange={(e) => setEditCity(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/80 border border-slate-800">
              <span>Feature on Marketplace Homepage</span>
              <Switch checked={editFeatured} onCheckedChange={setEditFeatured} />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/80 border border-slate-800">
              <span>Active for Booking</span>
              <Switch checked={editAvailable} onCheckedChange={setEditAvailable} />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              className="border-slate-800 text-slate-300"
              onClick={() => setEditingListing(null)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
              onClick={saveListingEdit}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ADD USER MODAL */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 sm:max-w-md">
          <form onSubmit={handleAddUser}>
            <DialogHeader>
              <DialogTitle className="text-white text-base">Add New Partner / Operator</DialogTitle>
              <DialogDescription className="text-slate-400 text-xs">
                Create buyer, seller, or administrator account credentials.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-3 text-xs">
              <div className="space-y-1.5">
                <Label htmlFor="uName">Full Name / Business Name</Label>
                <Input
                  id="uName"
                  placeholder="e.g. Apex Global DOOH"
                  className="bg-slate-950 border-slate-800 text-white"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="uUser">Username</Label>
                <Input
                  id="uUser"
                  placeholder="e.g. apex_ops"
                  className="bg-slate-950 border-slate-800 text-white"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="uEmail">Email Address</Label>
                <Input
                  id="uEmail"
                  type="email"
                  placeholder="ops@partner.com"
                  className="bg-slate-950 border-slate-800 text-white"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="uRole">Account Role</Label>
                <Select value={newRole} onValueChange={setNewRole}>
                  <SelectTrigger className="bg-slate-950 border-slate-800 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
                    <SelectItem value="buyer">Advertiser / Media Buyer</SelectItem>
                    <SelectItem value="seller">Media Owner / Seller</SelectItem>
                    <SelectItem value="admin">Platform Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-slate-800 text-slate-300"
                onClick={() => setIsAddUserOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
              >
                Create Account
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
