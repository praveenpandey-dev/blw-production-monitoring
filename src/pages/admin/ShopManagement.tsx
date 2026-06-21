import React, { useState } from "react";
import { 
  Factory, 
  Construction, 
  Wrench, 
  Cpu, 
  Wind, 
  Paintbrush, 
  Activity, 
  Truck, 
  ChevronRight, 
  Plus, 
  User, 
  Play, 
  AlertTriangle, 
  CheckCircle, 
  X, 
  Compass, 
  ClipboardList, 
  CornerDownRight,
  Sparkles
} from "lucide-react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter,
  Button, 
  Input 
} from "../../routes.tsx";

export interface ShopRecord {
  code: string;
  name: string;
  supervisor: string;
  activeLocos: number;
  delayedLocos: number;
  efficiency: number;
  icon: React.ComponentType<{ className?: string }>;
}

const INITIAL_SHOPS: ShopRecord[] = [
  { code: "SHOP-01", name: "Frame Fabrication Shop", supervisor: "Aditya Patil", activeLocos: 12, delayedLocos: 0, efficiency: 95, icon: Construction },
  { code: "SHOP-02", name: "Bogie Shop", supervisor: "Rajesh K.", activeLocos: 8, delayedLocos: 1, efficiency: 91, icon: Wrench },
  { code: "SHOP-03", name: "Shell Assembly Shop", supervisor: "Vijay M.", activeLocos: 14, delayedLocos: 2, efficiency: 88, icon: Factory },
  { code: "SHOP-04", name: "Electrical Assembly Shop", supervisor: "Suresh Sharma", activeLocos: 11, delayedLocos: 3, efficiency: 82, icon: Cpu },
  { code: "SHOP-05", name: "Brake & Pneumatic Shop", supervisor: "H. Deshmukh", activeLocos: 4, delayedLocos: 0, efficiency: 90, icon: Wind },
  { code: "SHOP-06", name: "Paint Shop", supervisor: "Somnath Nair", activeLocos: 3, delayedLocos: 0, efficiency: 86, icon: Paintbrush },
  { code: "SHOP-07", name: "Testing Center", supervisor: "Amrita Sen", activeLocos: 2, delayedLocos: 1, efficiency: 93, icon: Activity },
  { code: "SHOP-08", name: "Dispatch Center", supervisor: "G. Subramanian", activeLocos: 2, delayedLocos: 0, efficiency: 97, icon: Truck },
];

export const SHOP_COLORS: Record<string, { bg: string; border: string; accent: string; text: string; headerBg: string }> = {
  "SHOP-01": { bg: "bg-red-50/40", border: "border-red-100", accent: "text-red-650", text: "text-red-900", headerBg: "bg-red-100/30" },
  "SHOP-02": { bg: "bg-blue-50/40", border: "border-blue-100", accent: "text-blue-650", text: "text-blue-900", headerBg: "bg-blue-100/30" },
  "SHOP-03": { bg: "bg-purple-50/40", border: "border-purple-100", accent: "text-purple-650", text: "text-purple-900", headerBg: "bg-purple-100/30" },
  "SHOP-04": { bg: "bg-amber-50/40", border: "border-amber-100", accent: "text-amber-650", text: "text-amber-900", headerBg: "bg-amber-100/30" },
  "SHOP-05": { bg: "bg-teal-50/40", border: "border-teal-100", accent: "text-teal-650", text: "text-teal-900", headerBg: "bg-teal-100/30" },
  "SHOP-06": { bg: "bg-emerald-50/40", border: "border-emerald-100", accent: "text-emerald-650", text: "text-emerald-900", headerBg: "bg-emerald-100/30" },
  "SHOP-07": { bg: "bg-rose-50/40", border: "border-rose-100", accent: "text-rose-650", text: "text-rose-900", headerBg: "bg-rose-100/30" },
  "SHOP-08": { bg: "bg-sky-50/45", border: "border-sky-100", accent: "text-sky-650", text: "text-sky-900", headerBg: "bg-sky-100/30" },
};

export const SHOP_MOCK_LOGS: Record<string, string[]> = {
  "SHOP-01": [
    "10:45 AM - Steel plates thickness validated via laser scanner.",
    "09:12 AM - Underframe longitudinal members mounted on Main Jig #1.",
    "Yesterday - Quality assurance green-lit welding on Chassis #109."
  ],
  "SHOP-02": [
    "01:30 PM - Wheelset axle press fit load curves finalized.",
    "11:15 AM - Traction motor #4 stator coil insulation inspected.",
    "Yesterday - Primary suspension springs matched and load-tested."
  ],
  "SHOP-03": [
    "04:20 PM - Driver cabin module outer shell aligned.",
    "02:10 PM - Side-wall alignment verification on Main Assembly Bay.",
    "Yesterday - Buffer beams mounted on both cab ends successfully."
  ],
  "SHOP-04": [
    "02:40 PM - High-voltage machine room cabling loom routing checked.",
    "11:00 AM - Pantograph pressure valve threshold calibrated.",
    "Yesterday - Driver control console electronic desk panel test complete."
  ],
  "SHOP-05": [
    "05:15 PM - Braking compressed air distributor leak diagnostic passes.",
    "01:00 PM - Parking brake mechanical linkage alignment secured.",
    "Yesterday - Main reservoirs air charge-discharge cycle verified."
  ],
  "SHOP-06": [
    "Yesterday - Final gloss level met on IR Blue main stripe.",
    "June 18 - Polyurethane protective prime undercoat dry-test done.",
    "June 17 - Masking tape layout for dual-cabin warning decals finished."
  ],
  "SHOP-07": [
    "03:10 PM - Static high-voltage line insulation breakdown test pass.",
    "09:30 AM - Wheel slip control brake test simulations executed.",
    "Yesterday - Driver signaling display diagnostic computer logging done."
  ],
  "SHOP-08": [
    "Yesterday - Commissioner railway safety certificate received.",
    "June 18 - Physical weight distribution validation profile logged.",
    "June 17 - Official flags and zonal railways commission tags attached."
  ]
};

export default function ShopManagement() {
  const [shops, setShops] = useState<ShopRecord[]>(INITIAL_SHOPS);
  
  // Modal toggle states
  const [isAddShopOpen, setIsAddShopOpen] = useState(false);
  const [isAssignSupervisorOpen, setIsAssignSupervisorOpen] = useState(false);
  const [selectedShop, setSelectedShop] = useState<ShopRecord | null>(null);
  const [viewLogShop, setViewLogShop] = useState<ShopRecord | null>(null);

  // New Shop form fields
  const [newCode, setNewCode] = useState("");
  const [newName, setNewName] = useState("");
  const [newSupervisor, setNewSupervisor] = useState("");
  const [newEfficiency, setNewEfficiency] = useState(90);

  // Supervisor assignment fields
  const [tempSupervisor, setTempSupervisor] = useState("");

  const handleCreateShop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newName) return;

    const newShopObj: ShopRecord = {
      code: newCode.toUpperCase(),
      name: newName,
      supervisor: newSupervisor || "Unassigned supervisor",
      activeLocos: 0,
      delayedLocos: 0,
      efficiency: Number(newEfficiency) || 100,
      icon: Factory,
    };

    setShops([...shops, newShopObj]);
    // Reset Form
    setNewCode("");
    setNewName("");
    setNewSupervisor("");
    setNewEfficiency(90);
    setIsAddShopOpen(false);
  };

  const handleAssignSupervisorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShop || !tempSupervisor) return;

    setShops(shops.map(s => {
      if (s.code === selectedShop.code) {
        return { ...s, supervisor: tempSupervisor };
      }
      return s;
    }));

    setIsAssignSupervisorOpen(false);
    setSelectedShop(null);
  };

  const openSupervisorModal = (shop: ShopRecord) => {
    setSelectedShop(shop);
    setTempSupervisor(shop.supervisor);
    setIsAssignSupervisorOpen(true);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-2.5 w-2.5 rounded-full bg-indigo-600" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-indigo-600 font-mono bg-indigo-50 px-2 rounded-md">
              Station Inventory
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Shop Management</h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage production shops, workflow routes, and supervisors.</p>
        </div>
        <Button 
          variant="default" 
          onClick={() => setIsAddShopOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs self-start"
        >
          <Plus className="h-4 w-4" /> Add Production Shop
        </Button>
      </div>

      {/* WORKFLOW VISUALIZATION STEP BAR */}
      <div>
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono flex items-center gap-1.5">
            <Compass className="h-4 w-4 text-indigo-600" />
            Assembly Sequence & Route Flow
          </h2>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Locomotives transition through heavy shops sequentially leading to testing and final dispatch.
          </p>
        </div>

        {/* Responsive Flex / Custom Layout Horizontal Line Cascade */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs overflow-x-auto">
          <style>{`
            @keyframes neon-pass {
              0% { left: -150px; }
              100% { left: 100%; }
            }
          `}</style>
          <div className="flex min-w-[1000px] items-center justify-between relative py-2">
            
            {/* Absolute horizontal pipeline background with neon passing charge */}
            <div className="absolute top-[35px] left-8 right-8 h-1.5 bg-slate-100 rounded-full z-0 overflow-hidden shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)]">
              <div 
                className="absolute h-full w-40 bg-gradient-to-r from-transparent via-cyan-400 via-indigo-500 to-transparent shadow-[0_0_12px_rgba(34,211,238,0.85)]"
                style={{ animation: 'neon-pass 3.2s linear infinite' }} 
              />
            </div>

            {shops.map((shop, idx) => {
              const ShopIcon = shop.icon || Factory;
              return (
                <div key={shop.code} className="flex flex-col items-center text-center relative z-10 w-28">
                  {/* Step Code Orb */}
                  <div className="h-9 w-9 rounded-full bg-slate-950 border-4 border-white text-amber-500 flex items-center justify-center shadow-md font-mono text-[9px] font-bold tracking-tighter">
                    {idx + 1}
                  </div>
                  
                  {/* Step Label Icon */}
                  <div className="p-2 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-lg mt-2 shadow-3xs">
                    <ShopIcon className="h-4 w-4" />
                  </div>

                  <span className="text-[11px] font-bold text-slate-900 mt-1.5 truncate max-w-[100px]" title={shop.name}>
                    {shop.name.replace(" Shop", "").replace(" Center", "")}
                  </span>
                  
                  {/* Arrow element for all except end */}
                  {idx < shops.length - 1 && (
                    <div className="absolute left-[105px] top-[14px] z-20 pointer-events-none hidden lg:block">
                      <ChevronRight className="h-4 w-4 text-slate-300" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 8 SHOP CARDS CONTAINER GRID */}
      <div>
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono flex items-center gap-1.5">
            <ClipboardList className="h-4 w-4 text-slate-900" />
            Active Production Workshops
          </h2>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Overview logs, real-time workload rates, and operational efficiency ratios.
          </p>
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {shops.map((shop) => {
            const ShopIcon = shop.icon || Factory;
            const color = SHOP_COLORS[shop.code] || { bg: "bg-slate-50/40", border: "border-slate-150", accent: "text-indigo-650", text: "text-slate-900", headerBg: "bg-slate-50/30" };

            return (
              <Card 
                key={shop.code} 
                className={`${color.bg} ${color.border} border-2 flex flex-col justify-between hover:scale-[1.02] transition-all duration-200 shadow-3xs hover:shadow-xs`}
              >
                <CardHeader className={`pb-3 border-b ${color.border} ${color.headerBg}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold bg-white px-2 py-0.5 rounded border border-slate-150 uppercase text-slate-500">
                      {shop.code}
                    </span>
                    <span className={`inline-flex h-2.5 w-2.5 rounded-full ${
                      shop.delayedLocos > 0 ? "bg-rose-500 animate-pulse" : "bg-emerald-500"
                    }`} />
                  </div>
                  <CardTitle className="text-sm font-bold text-slate-900 mt-2.5 flex items-center gap-2">
                    <ShopIcon className={`h-4.5 w-4.5 ${color.accent} shrink-0`} />
                    {shop.name}
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-4 pb-3 space-y-3">
                  {/* Supervisor */}
                  <div className="flex items-center gap-2 justify-between">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider font-mono">Supervisor:</span>
                    <div className="flex items-center gap-1 text-slate-800 font-bold text-xs truncate max-w-[120px]">
                      <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>{shop.supervisor}</span>
                    </div>
                  </div>

                  {/* Active vs Delayed */}
                  <div className="grid grid-cols-2 gap-2 text-center py-1">
                    <div className="bg-white/80 rounded-lg p-1.5 border border-slate-100">
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">Active Build</span>
                      <span className="text-slate-800 font-extrabold text-sm">{shop.activeLocos}</span>
                    </div>
                    <div className={`${shop.delayedLocos > 0 ? "bg-rose-50/50 text-rose-950 border-rose-100" : "bg-white/80"} rounded-lg p-1.5 border border-slate-100`}>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">Delayed</span>
                      <span className={`font-extrabold text-sm ${shop.delayedLocos > 0 ? "text-rose-600" : "text-slate-800"}`}>
                        {shop.delayedLocos}
                      </span>
                    </div>
                  </div>

                  {/* Efficiency Progress bar design */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-slate-400 font-semibold">Efficiency Rate:</span>
                      <span className="font-extrabold text-slate-900">{shop.efficiency}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100/70 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          shop.efficiency >= 90 ? "bg-slate-900" : "bg-amber-500"
                        }`} 
                        style={{ width: `${shop.efficiency}%` }} 
                      />
                    </div>
                  </div>
                </CardContent>

                <CardFooter className={`py-2 px-4 flex gap-2 border-t ${color.border} bg-white/30`}>
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      setViewLogShop(shop);
                    }}
                    className="h-8 text-slate-600 hover:text-slate-900 hover:bg-white/50 flex-1 text-[10px] uppercase font-bold"
                  >
                    View Log
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => openSupervisorModal(shop)}
                    className="h-8 text-indigo-700 bg-white/85 border-indigo-150 hover:bg-indigo-50 flex-1 text-[10px] uppercase font-bold"
                  >
                    Assign Head
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>

      {/* DIALOG 1: ADD SHOP DIALOG OVERLAY */}
      {isAddShopOpen && (
        <div id="add-shop-dialog-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/55">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Post Active Shop Station</h3>
                <p className="text-[10px] text-slate-400">Map a new heavy fabrication workshop onto the route.</p>
              </div>
              <button 
                type="button" 
                onClick={() => setIsAddShopOpen(false)}
                className="p-1 px-2 rounded-md hover:bg-slate-100 transition-colors"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateShop} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Shop Station Code</label>
                <Input 
                  placeholder="e.g. SHOP-09" 
                  value={newCode} 
                  onChange={(e) => setNewCode(e.target.value)} 
                  required 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Workshop Station Name</label>
                <Input 
                  placeholder="e.g. Engine Calibration Bay" 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)} 
                  required 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Chief Supervisor Assigned</label>
                <Input 
                  placeholder="e.g. Neha Deshmukh" 
                  value={newSupervisor} 
                  onChange={(e) => setNewSupervisor(e.target.value)} 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Base Performance (Efficiency %)</label>
                <Input 
                  type="number"
                  min="50"
                  max="100"
                  value={newEfficiency} 
                  onChange={(e) => setNewEfficiency(Number(e.target.value))} 
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 justify-end pt-3 border-t border-slate-100">
                <Button type="button" variant="outline" onClick={() => setIsAddShopOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Launch Shop
                </Button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* DIALOG 2: ASSIGN SUPERVISOR DIALOG */}
      {isAssignSupervisorOpen && selectedShop && (
        <div id="assign-supervisor-dialog" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/55">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">Assign Shop Head</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Delegate supervisory profile of &quot;{selectedShop.name}&quot;.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleAssignSupervisorSubmit} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-slate-500">Supervisor Name</label>
                <Input 
                  placeholder="e.g. S. Sharma" 
                  value={tempSupervisor} 
                  onChange={(e) => setTempSupervisor(e.target.value)} 
                  required 
                />
              </div>

              <div className="flex gap-2 justify-end pt-3 border-t border-slate-100">
                <Button type="button" variant="outline" onClick={() => {
                  setIsAssignSupervisorOpen(false);
                  setSelectedShop(null);
                }}>
                  Cancel
                </Button>
                <Button type="submit">
                  Assign Lead
                </Button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* DIALOG 3: DETAILED VIEW LOGS DIALOG */}
      {viewLogShop && (
        <div 
          id="view-logs-dialog" 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
          onClick={() => setViewLogShop(null)}
        >
          <div 
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header portion */}
            <div className={`px-5 py-5 border-b border-slate-100 ${
              SHOP_COLORS[viewLogShop.code]?.headerBg || "bg-indigo-50/40"
            } flex justify-between items-center`}>
              <div className="flex items-center gap-2.5">
                <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-white border border-slate-150 ${
                  SHOP_COLORS[viewLogShop.code]?.accent || "text-indigo-600"
                }`}>
                  {viewLogShop.code}
                </span>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 tracking-tight leading-none">
                    {viewLogShop.name}
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-1 font-medium">Telemetry diagnostics & sequential assembly ledger.</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setViewLogShop(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content area */}
            <div className="p-5 space-y-4">
              {/* Telemetry metadata row */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block font-mono">Supervisor</span>
                  <span className="text-slate-950 font-bold block truncate mt-0.5" title={viewLogShop.supervisor}>
                    {viewLogShop.supervisor.split(" ")[0]}
                  </span>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block font-mono">Active Load</span>
                  <span className="text-indigo-600 font-extrabold block mt-0.5">{viewLogShop.activeLocos} Units</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block font-mono">Performance</span>
                  <span className="text-emerald-600 font-extrabold block mt-0.5">{viewLogShop.efficiency}%</span>
                </div>
              </div>

              {/* Live operational log feeds */}
              <div className="space-y-2.5">
                <h4 className="text-[10px] font-mono font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                  Live Operational Sequence Logs
                </h4>
                
                <div className="bg-slate-950 rounded-xl p-4 font-mono text-[10px] text-slate-300 leading-relaxed shadow-inner space-y-3 relative overflow-hidden">
                  <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-slate-900/50 px-1.5 py-0.5 rounded border border-slate-800">
                    <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-ping" />
                    <span className="text-[8px] font-bold uppercase text-slate-400">Stream</span>
                  </div>

                  {(SHOP_MOCK_LOGS[viewLogShop.code] || []).length > 0 ? (
                    (SHOP_MOCK_LOGS[viewLogShop.code] || []).map((log, index) => (
                      <div key={index} className="flex gap-2 items-start last:mb-0 border-b last:border-0 border-slate-900 pb-2.5 last:pb-0">
                        <span className="text-indigo-400 select-none">&gt;&gt;</span>
                        <p className="text-slate-200">{log}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-slate-500 italic text-center py-4">No active connection logs recorded on this shift.</div>
                  )}
                </div>
              </div>

              {/* Compliance & Quality Check Stamp */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150 flex items-start gap-2.5">
                <CheckCircle className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-extrabold text-slate-900 uppercase block font-mono">Quality Assurance Stamp</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5 leading-relaxed">
                    This workshop operates in full compliance with ISO 9001 and RDSO Rail Transport Safety Directives.
                  </span>
                </div>
              </div>

              {/* Action */}
              <div className="flex gap-2 pt-1 border-t border-slate-100">
                <Button 
                  className="w-full bg-slate-900 text-white"
                  onClick={() => setViewLogShop(null)}
                >
                  Close Logs
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
