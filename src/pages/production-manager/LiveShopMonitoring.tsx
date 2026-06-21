import React, { useState } from "react";
import { 
  Building2, 
  User, 
  Activity, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck, 
  RefreshCw, 
  Search, 
  Filter, 
  Award,
  Zap,
  ArrowRight
} from "lucide-react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter,
  Button 
} from "../../routes.tsx";
import { ManagerPageHeader } from "./ProductionManagerDashboard.tsx";

interface ShopOperationalCard {
  id: string;
  name: string;
  supervisor: string;
  runningLocos: number;
  delayedLocos: number;
  completionRate: number;
  currentActivity: string;
  health: "Healthy" | "Warning" | "Critical";
  targetScore: number;
  shiftHours: string;
  contact: string;
}

const INITIAL_SHOPS_DATA: ShopOperationalCard[] = [
  { 
    id: "SHOP-01", 
    name: "Frame Fabrication Shop", 
    supervisor: "Amrita Sen", 
    runningLocos: 3, 
    delayedLocos: 0, 
    completionRate: 95.8, 
    currentActivity: "High-precision arc welding on WAG12-206 chassis underbelly steel frame.", 
    health: "Healthy",
    targetScore: 12,
    shiftHours: "06:00 - 14:00 (Shift A)",
    contact: "Ext-401"
  },
  { 
    id: "SHOP-02", 
    name: "Bogie Shop", 
    supervisor: "Rajesh Kulkarni", 
    runningLocos: 2, 
    delayedLocos: 0, 
    completionRate: 91.2, 
    currentActivity: "Balancing gear teeth alignment parameters and dual heavy motor mounting setup.", 
    health: "Healthy",
    targetScore: 14,
    shiftHours: "06:00 - 14:00 (Shift A)",
    contact: "Ext-402"
  },
  { 
    id: "SHOP-03", 
    name: "Shell Assembly Shop", 
    supervisor: "Praveen Pandey", 
    runningLocos: 4, 
    delayedLocos: 1, 
    completionRate: 88.5, 
    currentActivity: "Fitting outer sheet metal cabin frame structure onto WAG12-203 locomotive base.", 
    health: "Warning",
    targetScore: 10,
    shiftHours: "14:00 - 22:00 (Shift B)",
    contact: "Ext-403"
  },
  { 
    id: "SHOP-04", 
    name: "Electrical Assembly Shop", 
    supervisor: "Ritik Dubey", 
    runningLocos: 3, 
    delayedLocos: 2, 
    completionRate: 82.1, 
    currentActivity: "Resolving supply deficiency regarding high-tension connection wires & copper plates.", 
    health: "Critical",
    targetScore: 15,
    shiftHours: "06:00 - 14:00 (Shift A)",
    contact: "Ext-404"
  },
  { 
    id: "SHOP-05", 
    name: "Brake & Pneumatic Shop", 
    supervisor: "Suresh Sharma", 
    runningLocos: 1, 
    delayedLocos: 0, 
    completionRate: 90.0, 
    currentActivity: "Performing hydraulic high-pressure pressure leak inspections on model WAG12-204.", 
    health: "Healthy",
    targetScore: 11,
    shiftHours: "14:00 - 22:00 (Shift B)",
    contact: "Ext-405"
  },
  { 
    id: "SHOP-06", 
    name: "Paint Shop", 
    supervisor: "Somnath Nair", 
    runningLocos: 2, 
    delayedLocos: 0, 
    completionRate: 86.4, 
    currentActivity: "Curing outer coating weatherproofing primer on freshly complete WAP7-107 body.", 
    health: "Healthy",
    targetScore: 9,
    shiftHours: "06:00 - 14:00 (Shift A)",
    contact: "Ext-406"
  },
  { 
    id: "SHOP-07", 
    name: "Testing Center", 
    supervisor: "Vikram Malhotra", 
    runningLocos: 2, 
    delayedLocos: 0, 
    completionRate: 93.3, 
    currentActivity: "High voltage electrical insulation dynamic testing on complete unit WAG12-201.", 
    health: "Healthy",
    targetScore: 8,
    shiftHours: "14:00 - 22:00 (Shift B)",
    contact: "Ext-407"
  },
  { 
    id: "SHOP-08", 
    name: "Dispatch Center", 
    supervisor: "Aditya Patil", 
    runningLocos: 1, 
    delayedLocos: 0, 
    completionRate: 97.5, 
    currentActivity: "Polishing paperwork guidelines and signoff clearances for physical engine rollouts.", 
    health: "Healthy",
    targetScore: 16,
    shiftHours: "06:00 - 14:00 (Shift A)",
    contact: "Ext-408"
  }
];

export default function LiveShopMonitoring() {
  const [shopsList, setShopsList] = useState<ShopOperationalCard[]>(INITIAL_SHOPS_DATA);
  const [healthFilter, setHealthFilter] = useState<"All" | "Healthy" | "Warning" | "Critical">("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredShops = shopsList.filter((shop) => {
    const matchesHealth = healthFilter === "All" || shop.health === healthFilter;
    const matchesSearch = shop.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          shop.supervisor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesHealth && matchesSearch;
  });

  const triggerShopReSync = () => {
    alert("Initiating live terminal TCP connection to shop-floor PLCs. Aligning sensor metrics database caches.");
  };

  const showHealthBadge = (health: "Healthy" | "Warning" | "Critical") => {
    switch (health) {
      case "Healthy":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider font-mono rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Healthy
          </span>
        );
      case "Warning":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider font-mono rounded-full bg-amber-50 text-amber-850 border border-amber-250">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" /> Caution Warnings
          </span>
        );
      case "Critical":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider font-mono rounded-full bg-red-50 text-red-800 border border-red-200">
            <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse" /> Critical Blockers
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Navigation Header */}
      <ManagerPageHeader activeTab="live-shop" />

      {/* FILTER PANEL AND SYSTEM CONTROLS CARD */}
      <Card className="bg-white border border-slate-200 shadow-3xs p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          
          {/* Left search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by shop identifier name or supervisor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 text-xs font-medium w-full rounded-lg border border-slate-200 outline-none focus:border-slate-800 bg-white"
            />
          </div>

          {/* Health selectors strip */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="h-3.5 w-3.5" /> Filter Health:
            </span>
            <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              {(["All", "Healthy", "Warning", "Critical"] as const).map((filterVal) => (
                <button
                  key={filterVal}
                  onClick={() => setHealthFilter(filterVal)}
                  className={`px-3 py-1.5 text-[10px] uppercase font-bold rounded-md transition-all cursor-pointer ${
                    healthFilter === filterVal
                      ? filterVal === "All" ? "bg-slate-900 text-white" :
                        filterVal === "Healthy" ? "bg-emerald-600 text-white" :
                        filterVal === "Warning" ? "bg-amber-500 text-white" :
                        "bg-red-600 text-white"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {filterVal}
                </button>
              ))}
            </div>

            <Button onClick={triggerShopReSync} variant="outline" className="h-9 hover:bg-slate-50">
              <RefreshCw className="h-3.5 w-3.5 text-indigo-600 mr-1 animate-spin" /> Sync Stations
            </Button>
          </div>

        </div>
      </Card>

      {/* 8 LARGE OPERATIONAL WORKSHOP CARDS GRID */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredShops.map((shop) => (
          <Card 
            key={shop.id} 
            className={`bg-white border-t-4 transition-all duration-300 hover:scale-[1.01] hover:shadow-md relative ${
              shop.health === "Healthy" ? "border-t-emerald-500" :
              shop.health === "Warning" ? "border-t-amber-400" :
              "border-t-red-500"
            }`}
          >
            {/* Header Area */}
            <CardHeader className="pb-2 flex flex-col space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                  {shop.id}
                </span>
                {showHealthBadge(shop.health)}
              </div>
              <CardTitle className="text-sm font-extrabold text-slate-900 mt-1 line-clamp-1">
                {shop.name}
              </CardTitle>
              <CardDescription className="flex items-center gap-1 font-semibold text-slate-500 text-[11px] mt-0.5">
                <User className="h-3.5 w-3.5 text-slate-400" />
                <span>Supv: <strong className="text-slate-800">{shop.supervisor}</strong></span>
                <span className="text-slate-300">&bull;</span>
                <span className="text-[10px] font-mono text-indigo-600">{shop.contact}</span>
              </CardDescription>
            </CardHeader>

            {/* Core parameters content */}
            <CardContent className="px-5 py-4 space-y-3.5 border-t border-slate-100 bg-slate-50/20">
              {/* Unit gauges */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-2.5 bg-slate-50 border border-slate-150 rounded-lg text-center">
                  <span className="text-[9px] font-mono font-bold text-indigo-650 uppercase block">Running Units</span>
                  <div className="text-lg font-black text-slate-900 mt-1 flex items-center justify-center gap-1">
                    <Activity className="h-4 w-4 text-indigo-500 shrink-0" />
                    <span>{shop.runningLocos}</span>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 border border-slate-150 rounded-lg text-center">
                  <span className="text-[9px] font-mono font-bold text-red-650 uppercase block">Delayed Units</span>
                  <div className="text-lg font-black text-slate-900 mt-1 flex items-center justify-center gap-1">
                    <AlertTriangle className={`h-4 w-4 shrink-0 ${shop.delayedLocos > 0 ? "text-red-500 animate-pulse" : "text-slate-400"}`} />
                    <span className={shop.delayedLocos > 0 ? "text-red-600" : "text-slate-800"}>{shop.delayedLocos}</span>
                  </div>
                </div>
              </div>

              {/* Progress and compliance rates */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-semibold text-slate-700">
                  <span className="flex items-center gap-1"><Award className="h-3.5 w-3.5 text-indigo-500" /> Target Accuracy</span>
                  <span className="font-mono text-slate-900">{shop.completionRate}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      shop.health === "Healthy" ? "bg-emerald-500" :
                      shop.health === "Warning" ? "bg-amber-400" : "bg-red-500"
                    }`} 
                    style={{ width: `${shop.completionRate}%` }}
                  />
                </div>
              </div>

              {/* Current action and logs */}
              <div className="p-3 bg-white border border-slate-150 rounded-lg space-y-1 min-h-[72px]">
                <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Zap className="h-3 w-3 text-amber-500" /> Live Duty Activity
                </span>
                <p className="text-[11px] leading-relaxed text-slate-600 font-medium font-sans">
                  {shop.currentActivity}
                </p>
              </div>
            </CardContent>

            {/* Footer triggers */}
            <CardFooter className="flex items-center justify-between px-5 py-3">
              <span className="text-[10px] font-mono text-slate-400 font-bold max-w-[150px] truncate" title={shop.shiftHours}>
                {shop.shiftHours}
              </span>
              <Button 
                onClick={() => alert(`Review log guidelines for shop floor station ${shop.name} under supervisor ${shop.supervisor}. Live sync clear.`)}
                variant="ghost" 
                className="h-8 px-2.5 text-indigo-650 font-bold hover:bg-indigo-50/60 flex items-center gap-1 shrink-0"
              >
                Inspect Shop <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
