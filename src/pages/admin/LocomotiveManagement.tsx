import React, { useState } from "react";
import { 
  Train, 
  Play, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Archive, 
  X, 
  Layers, 
  Calendar, 
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  Info,
  Wrench,
  Construction,
  Factory,
  Cpu,
  Wind,
  Paintbrush,
  Activity,
  Truck
} from "lucide-react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  Button, 
  Input 
} from "../../routes.tsx";
import { ResponsiveTableWrapper } from "../../components/ResponsiveTableWrapper.tsx";

// Types
export interface Locomotive {
  locoNumber: string;
  model: string;
  currentShop: string;
  progress: number;
  status: "Completed" | "In Progress" | "Delayed" | "Pending";
  expectedCompletion: string;
  priority: "High" | "Medium" | "Low";
  currentActivity: string;
}

// 20 Sample Records
const INITIAL_LOCOMOTIVES: Locomotive[] = [
  { locoNumber: "WAG12-101", model: "WAG-12 Heavy Freight", currentShop: "Dispatch Center", progress: 100, status: "Completed", expectedCompletion: "Ready", priority: "High", currentActivity: "Final safety clearance checklist completed" },
  { locoNumber: "WAG12-102", model: "WAG-12 Heavy Freight", currentShop: "Testing Center", progress: 95, status: "In Progress", expectedCompletion: "2026-06-21", priority: "High", currentActivity: "Dynamic track vibration testing" },
  { locoNumber: "WAG12-103", model: "WAG-12 Heavy Freight", currentShop: "Paint Shop", progress: 88, status: "In Progress", expectedCompletion: "2026-06-24", priority: "Medium", currentActivity: "Anti-corrosion double primer coat drying" },
  { locoNumber: "WAG12-104", model: "WAG-12 Heavy Freight", currentShop: "Brake Shop", progress: 75, status: "Delayed", expectedCompletion: "2026-06-28", priority: "High", currentActivity: "Waiting on pneumatic valve replacement" },
  { locoNumber: "WAG12-105", model: "WAG-12 Heavy Freight", currentShop: "Electrical Assembly", progress: 60, status: "In Progress", expectedCompletion: "2026-07-02", priority: "Medium", currentActivity: "Traction motor cabling and wiring loom set" },
  { locoNumber: "WAP7-31001", model: "WAP-7 Passenger", currentShop: "Shell Assembly", progress: 45, status: "In Progress", expectedCompletion: "2026-07-05", priority: "High", currentActivity: "Outer structure steel sheet welding" },
  { locoNumber: "WAP7-31002", model: "WAP-7 Passenger", currentShop: "Bogie Shop", progress: 30, status: "In Progress", expectedCompletion: "2026-07-10", priority: "Medium", currentActivity: "Wheelset hydraulic alignment validation" },
  { locoNumber: "WAP7-31003", model: "WAP-7 Passenger", currentShop: "Frame Fabrication", progress: 15, status: "In Progress", expectedCompletion: "2026-07-15", priority: "Low", currentActivity: "Chassis grid welding in progress" },
  { locoNumber: "WDM3D-11201", model: "WDM-3D Diesel Shunter", currentShop: "Testing Center", progress: 90, status: "Delayed", expectedCompletion: "2026-06-22", priority: "High", currentActivity: "Alternator heating threshold warning" },
  { locoNumber: "WDM3D-11202", model: "WDM-3D Diesel Shunter", currentShop: "Paint Shop", progress: 85, status: "In Progress", expectedCompletion: "2026-06-25", priority: "Low", currentActivity: "Official IR blue decal layout" },
  { locoNumber: "WAG12-106", model: "WAG-12 Heavy Freight", currentShop: "Electrical Assembly", progress: 55, status: "In Progress", expectedCompletion: "2026-07-08", priority: "Medium", currentActivity: "Cabin instrument panel installation" },
  { locoNumber: "WAG12-107", model: "WAG-12 Heavy Freight", currentShop: "Frame Fabrication", progress: 5, status: "Pending", expectedCompletion: "2026-07-28", priority: "Low", currentActivity: "Steel sheets awaiting shop intake" },
  { locoNumber: "WAP7-31004", model: "WAP-7 Passenger", currentShop: "Brake Shop", progress: 70, status: "In Progress", expectedCompletion: "2026-06-30", priority: "High", currentActivity: "Handbrake mechanical lever link testing" },
  { locoNumber: "WAP7-31005", model: "WAP-7 Passenger", currentShop: "Dispatch Center", progress: 100, status: "Completed", expectedCompletion: "Ready", priority: "Medium", currentActivity: "Flag-off ritual and transfer log signed" },
  { locoNumber: "WDM3D-11203", model: "WDM-3D Diesel Shunter", currentShop: "Shell Assembly", progress: 40, status: "In Progress", expectedCompletion: "2026-07-12", priority: "Low", currentActivity: "Radiator mesh structural fit" },
  { locoNumber: "WDM3D-11204", model: "WDM-3D Diesel Shunter", currentShop: "Bogie Shop", progress: 25, status: "In Progress", expectedCompletion: "2026-07-18", priority: "High", currentActivity: "Suspension system damper fitment" },
  { locoNumber: "WAG12-108", model: "WAG-12 Heavy Freight", currentShop: "Frame Fabrication", progress: 10, status: "In Progress", expectedCompletion: "2026-07-22", priority: "Medium", currentActivity: "Laser cut chassis plate delivery" },
  { locoNumber: "WAG12-109", model: "WAG-12 Heavy Freight", currentShop: "Frame Fabrication", progress: 0, status: "Pending", expectedCompletion: "2026-08-01", priority: "Low", currentActivity: "Fabrication blue prints awaiting supervisor login" },
  { locoNumber: "WAP7-31007", model: "WAP-7 Passenger", currentShop: "Dispatch Center", progress: 100, status: "Completed", expectedCompletion: "Ready", priority: "High", currentActivity: "Official commissioning tag attached" },
  { locoNumber: "WDM3D-11205", model: "WDM-3D Diesel Shunter", currentShop: "Electrical Assembly", progress: 50, status: "Delayed", expectedCompletion: "2026-07-01", priority: "Medium", currentActivity: "Cable tray supply chain bottleneck" }
];

const SHOP_SEQUENCE = [
  "Frame Fabrication",
  "Bogie Shop",
  "Shell Assembly",
  "Electrical Assembly",
  "Brake Shop",
  "Paint Shop",
  "Testing Center",
  "Dispatch Center"
];

const SHOP_DETAILS_DATA: Record<string, {
  function: string;
  checklist: string[];
  durationDays: number;
  machinery: string;
}> = {
  "Frame Fabrication": {
    function: "Precision heavy duty chassis framing and plasma arc plate profiling",
    checklist: ["Laser cut raw sheet inspection", "CNC chassis mounting layout match", "Stress welding load inspection", "Ultrasonic sensor check of welds"],
    durationDays: 4,
    machinery: "Ultra-High Power Fiber Laser Cutter, CNC Plate Beveller"
  },
  "Bogie Shop": {
    function: "Locomotive wheelset, suspension dampers and primary traction gearing configuration",
    checklist: ["Hydro-press axle fit validation", "Brake block alignment calibration", "Gearing grease bath load level check", "Suspension spring fatigue test"],
    durationDays: 5,
    machinery: "500-ton Wheel Press Machine, Hydraulic Axle Grinder"
  },
  "Shell Assembly": {
    function: "Cabin structure fabrication, driver consoles fitting and cowl envelope layout",
    checklist: ["Sidewall positioning matching console guide", "Cabin roof overhead crane drop", "Front windshield safety glass framing", "Door hardware sound proof seal check"],
    durationDays: 6,
    machinery: "Heavy Duty Overhead Gantry Crane, Robotic MIG Welders"
  },
  "Electrical Assembly": {
    function: "Traction converters, high-voltage cabling looms, batteries, and display consoles cabling",
    checklist: ["Traction control wire-harness layout installation", "Inverter sub-module rack thermal tests", "Control console micro-controller bench test", "Driver assistance program loading"],
    durationDays: 7,
    machinery: "HV Cable Harness Testing Rigs, Consol Bench Calibrators"
  },
  "Brake Shop": {
    function: "Pneumatic, direct-air and electro-regenerative braking grid coupling",
    checklist: ["Air compressor pressure test (8 bar stable)", "E-pneumatic distributor valve calibration", "Emergency backup hand brake leverage test", "Piping micro-leak dry sensor scan"],
    durationDays: 3,
    machinery: "Pneumatic Brake Calibrator Bench, Helium Leak Detector"
  },
  "Paint Shop": {
    function: "Multi-layer thermal baking anti-corrosive painting and IR livery decoration",
    checklist: ["Surface sandblast profiling verification", "Anti-rust base epoxy oven primer spray", "Livery primary color spray (Indian Railways Royal Blue)", "High durability top polyurethane clear coat baking"],
    durationDays: 4,
    machinery: "Automated Spray Robots, Industrial Baking Ovens"
  },
  "Testing Center": {
    function: "High-speed loop track operations, dynamic brake test and load-cell sensor telemetry",
    checklist: ["Static current leakage evaluation check", "25kV AC overhead pantograph contact safety", "Line track test run speed acceleration testing", "Emergency override stop length test"],
    durationDays: 8,
    machinery: "25kV AC Live Test Track, Regenerative Load Bank Grid"
  },
  "Dispatch Center": {
    function: "Final safety stamps, commissioning clearances and railway safety commissioner flagged release",
    checklist: ["Official commission certification stamping", "RDSO safety booklet assignment", "Supervisor release logs signed and submitted", "Pioneer trip route assignment register"],
    durationDays: 2,
    machinery: "Digital Commissioning Stamp, Smart IoT Fleet Tag"
  }
};

export default function LocomotiveManagement() {
  const [locomotives, setLocomotives] = useState<Locomotive[]>(INITIAL_LOCOMOTIVES);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filters
  const [selectedShopFilter, setSelectedShopFilter] = useState("ALL");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("ALL");
  const [progressRangeFilter, setProgressRangeFilter] = useState<number>(0); // 0 means all, else >= value
  
  // Drawer Detail State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerLoco, setDrawerLoco] = useState<Locomotive | null>(null);
  const [expandedLocoNumber, setExpandedLocoNumber] = useState<string | null>(null);
  const [selectedPipelineShop, setSelectedPipelineShop] = useState<string | null>(null);

  // Statistics calculation
  const totalLocos = locomotives.length;
  const inProduction = locomotives.filter(l => l.status === "In Progress").length;
  const completed = locomotives.filter(l => l.status === "Completed").length;
  const delayed = locomotives.filter(l => l.status === "Delayed").length;

  // Filter locomotives
  const filteredLocos = locomotives.filter(l => {
    const matchesSearch = l.locoNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.currentShop.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesShop = selectedShopFilter === "ALL" || l.currentShop === selectedShopFilter;
    const matchesStatus = selectedStatusFilter === "ALL" || l.status === selectedStatusFilter;
    const matchesProgress = l.progress >= progressRangeFilter;

    return matchesSearch && matchesShop && matchesStatus && matchesProgress;
  });

  const handleOpenDrawer = (loco: Locomotive) => {
    setDrawerLoco(loco);
    setIsDrawerOpen(true);
    setSelectedPipelineShop(loco.currentShop);
  };

  const handleArchive = (locoNumber: string) => {
    if (confirm(`Archive locomotive build record ${locoNumber} from the live monitoring database?`)) {
      setLocomotives(locomotives.filter(l => l.locoNumber !== locoNumber));
      if (drawerLoco?.locoNumber === locoNumber) {
        setIsDrawerOpen(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Locomotive Management</h1>
          <p className="text-xs text-slate-400 mt-0.5">Track, audit, and log chassis lifecycles and fabrication sequences</p>
        </div>
        <Button 
          variant="default" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white self-start shadow-xs"
          onClick={() => alert("Initialize new locomotive build sequence")}
        >
          <Play className="h-4 w-4" /> Start Build Sequence
        </Button>
      </div>

      {/* TOP KPI CARDS */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {/* Total */}
        <Card className="border-l-4 border-l-slate-800 bg-white shadow-3xs">
          <CardHeader className="p-4 flex flex-row items-center justify-between pb-1 space-y-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Locomotives</span>
            <span className="p-1 px-2 rounded-lg bg-slate-100 text-slate-950 font-mono text-[10px] font-bold">Registry</span>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="text-2xl font-bold text-slate-900">{totalLocos}</div>
            <p className="text-[10px] text-slate-400 mt-1">Units entered in system</p>
          </CardContent>
        </Card>

        {/* In Production */}
        <Card className="border-l-4 border-l-indigo-600 bg-white shadow-3xs">
          <CardHeader className="p-4 flex flex-row items-center justify-between pb-1 space-y-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">In Production</span>
            <span className="p-1 px-2 rounded-lg bg-indigo-50 text-indigo-700 font-mono text-[10px] font-bold">Active</span>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="text-2xl font-bold text-slate-900">{inProduction}</div>
            <p className="text-[10px] text-indigo-600 font-semibold mt-1">Undergoing assembly</p>
          </CardContent>
        </Card>

        {/* Completed */}
        <Card className="border-l-4 border-l-emerald-600 bg-white shadow-3xs">
          <CardHeader className="p-4 flex flex-row items-center justify-between pb-1 space-y-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Completed</span>
            <span className="p-1 px-2 rounded-lg bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold">Pass</span>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="text-2xl font-bold text-slate-900">{completed}</div>
            <p className="text-[10px] text-emerald-600 font-semibold mt-1">Dispatched or ready</p>
          </CardContent>
        </Card>

        {/* Delayed */}
        <Card className="border-l-4 border-l-rose-500 bg-white shadow-3xs">
          <CardHeader className="p-4 flex flex-row items-center justify-between pb-1 space-y-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Delayed</span>
            <span className="p-1 px-2 rounded-lg bg-rose-50 text-rose-700 font-mono text-[10px] font-bold">Critical</span>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="text-2xl font-bold text-rose-600">{delayed}</div>
            <p className="text-[10px] text-rose-500 font-semibold mt-1">Requires bypass check</p>
          </CardContent>
        </Card>
      </div>

      {/* SEARCH & FILTERS PANEL */}
      <Card className="border border-slate-200">
        <CardContent className="p-5 space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            {/* Search Box */}
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by Loco Number, Model, status or current shop..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 text-xs"
              />
            </div>

            {/* Quick Filter Status Indicator */}
            <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <span>Results: {filteredLocos.length} of {totalLocos} registered</span>
            </div>
          </div>

          {/* Expanded Filter Inputs */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pt-3 border-t border-slate-100">
            {/* Filter by current shop */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Current Shop</label>
              <select
                value={selectedShopFilter}
                onChange={(e) => setSelectedShopFilter(e.target.value)}
                className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-slate-850"
              >
                <option value="ALL">All Stations / Shops</option>
                {SHOP_SEQUENCE.map(shopName => (
                  <option key={shopName} value={shopName}>{shopName}</option>
                ))}
              </select>
            </div>

            {/* Filter by status */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Production Status</label>
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-slate-850"
              >
                <option value="ALL">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
                <option value="Delayed">Delayed</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            {/* Progress range tracker */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase flex justify-between">
                <span>Minimum Progress</span>
                <span className="font-mono text-slate-700">{progressRangeFilter}%</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progressRangeFilter}
                  onChange={(e) => setProgressRangeFilter(Number(e.target.value))}
                  className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <Button 
                  variant="outline" 
                  onClick={() => setProgressRangeFilter(0)}
                  className="h-7 px-2 text-[10px] uppercase text-slate-500 shrink-0"
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* LOCOMOTIVE RECORDS MAIN TABLE */}
      <Card className="border border-slate-200 overflow-hidden">
        <CardContent className="p-0">
          <ResponsiveTableWrapper>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-indigo-50 bg-slate-50/50 text-[9px] font-mono uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-5 font-semibold">Loco Number</th>
                  <th className="py-3.5 px-4 font-semibold">Model Class</th>
                  <th className="py-3.5 px-4 font-semibold">Current Shop Station</th>
                  <th className="py-3.5 px-4 font-semibold">Overall Progress</th>
                  <th className="py-3.5 px-4 font-semibold">State Status</th>
                  <th className="py-3.5 px-4 font-semibold">Target Rollout</th>
                  <th className="py-3.5 px-4 font-semibold">Line Priority</th>
                  <th className="py-3.5 px-5 font-semibold text-right">Actions Panel</th>
                </tr>
              </thead>
              <tbody>
                {filteredLocos.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400 font-mono text-xs">
                      No build logs found containing search parameters.
                    </td>
                  </tr>
                ) : (
                  filteredLocos.map((loco) => (
                    <tr 
                      key={loco.locoNumber} 
                      className="border-b last:border-0 border-slate-100 hover:bg-slate-50/20 text-xs text-slate-600 transition-colors"
                    >
                      {/* Number */}
                      <td className="py-3 px-5 font-bold text-slate-900 font-mono">
                        <div className="flex items-center gap-1.5">
                          <Train className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span>{loco.locoNumber}</span>
                        </div>
                      </td>

                      {/* Model */}
                      <td className="py-3 px-4 font-medium text-slate-700">{loco.model}</td>

                      {/* Shop */}
                      <td className="py-3 px-4 font-semibold text-indigo-750">
                        {loco.currentShop}
                      </td>

                      {/* Progress Bar with Indicator */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3 w-40">
                          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-300 ${
                                loco.status === "Completed" ? "bg-emerald-500" :
                                loco.status === "Delayed" ? "bg-rose-500" :
                                loco.status === "Pending" ? "bg-slate-300" : "bg-slate-900"
                              }`}
                              style={{ width: `${loco.progress}%` }}
                            />
                          </div>
                          <span className="font-mono text-[10px] font-bold text-slate-700 shrink-0">{loco.progress}%</span>
                        </div>
                      </td>

                      {/* Status badge */}
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide border ${
                          loco.status === "Completed" 
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                            : loco.status === "In Progress"
                            ? "bg-indigo-50 text-indigo-700 border-indigo-150"
                            : loco.status === "Delayed"
                            ? "bg-rose-50 text-rose-700 border-rose-100 animate-pulse"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}>
                          <span className={`h-1 w-1 rounded-full ${
                            loco.status === "Completed" ? "bg-emerald-500" :
                            loco.status === "In Progress" ? "bg-indigo-500" :
                            loco.status === "Delayed" ? "bg-rose-500" : "bg-slate-400"
                          }`} />
                          {loco.status === "In Progress" ? "In Progress" : loco.status}
                        </span>
                      </td>

                      {/* Expected Completion */}
                      <td className="py-3 px-4 font-mono text-[10px] text-slate-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-slate-300" />
                          <span>{loco.expectedCompletion}</span>
                        </div>
                      </td>

                      {/* Priority badge */}
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 text-[9px] font-extrabold uppercase px-1.8 py-0.25 rounded ${
                          loco.priority === "High" ? "bg-rose-50 text-rose-605 border border-rose-100" :
                          loco.priority === "Medium" ? "bg-amber-50 text-amber-605 border border-amber-100" :
                          "bg-slate-100 text-slate-605"
                        }`}>
                          {loco.priority}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <Button 
                            variant="outline" 
                            className="h-8 px-2 text-[10px] text-indigo-650 hover:bg-indigo-50 border-indigo-150 font-bold"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDrawer(loco);
                            }}
                          >
                            <Eye className="h-3 w-3 mr-0.5" /> View Line
                          </Button>
                          <Button 
                            variant="ghost" 
                            className="h-8 px-2 text-slate-605"
                            onClick={(e) => {
                              e.stopPropagation();
                              alert(`Modify parameters for ${loco.locoNumber}`);
                            }}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            className="h-8 px-2 text-red-500 hover:text-red-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleArchive(loco.locoNumber);
                            }}
                          >
                            <Archive className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </ResponsiveTableWrapper>
        </CardContent>
      </Card>

      {/* DETAIL DRAWER / SLIDE-OVER OVERLAY */}
      {isDrawerOpen && drawerLoco && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end" id="loco-drawer-container">
          {/* Backdrop screen cover */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />

          {/* Drawer Sidebar panel */}
          <div className="relative w-full max-w-lg bg-white h-screen shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-250">
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-slate-900 text-amber-500">
                  <Train className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-950 font-mono tracking-wider uppercase">
                    {drawerLoco.locoNumber}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium">Detailed lifecycle stage monitor & milestones</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setIsDrawerOpen(false)}
                className="p-1 px-1.5 rounded-md hover:bg-slate-200 transition-colors"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Properties Card Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block font-mono">Chassis Class Model</span>
                  <span className="text-xs font-bold text-slate-800 block mt-1">{drawerLoco.model}</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block font-mono">Current Shop Bay</span>
                  <span className="text-xs font-bold text-indigo-700 block mt-1">{drawerLoco.currentShop}</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block font-mono">Target Completion</span>
                  <span className="text-xs font-bold text-slate-800 block mt-1">{drawerLoco.expectedCompletion}</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block font-mono">Stage Status</span>
                  <span className="text-xs font-bold text-slate-800 mt-1 block">{drawerLoco.status}</span>
                </div>
              </div>

              {/* Progress and Current Action indicator */}
              <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/20 space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-indigo-950 uppercase">Overall Assembly Progression</span>
                  <span className="text-xs font-extrabold text-indigo-600 font-mono">{drawerLoco.progress}% Completed</span>
                </div>
                <div className="h-2.5 w-full bg-indigo-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${drawerLoco.progress}%` }}></div>
                </div>
                <div className="pt-2 border-t border-indigo-100 flex items-start gap-2 text-indigo-900 text-xs leading-relaxed">
                  <Info className="h-3.5 w-3.5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Active Station Log:</span>
                    <p className="mt-0.5 text-slate-600 text-[11px]">{drawerLoco.currentActivity}</p>
                  </div>
                </div>
              </div>

              {/* DYNAMIC PIPELINE OVERVIEW */}
              <div className="space-y-3 p-4 bg-slate-900 rounded-2xl text-white relative overflow-hidden shadow-md">
                <div className="absolute top-0 right-0 py-1 px-2.5 bg-slate-800 text-[8px] font-mono font-bold text-slate-400 uppercase rounded-bl-lg border-l border-b border-slate-705">
                  Segment Pipeline
                </div>
                <h4 className="text-[10px] font-mono font-extrabold text-indigo-400 uppercase tracking-widest">
                  Live Stage Visualization
                </h4>

                {/* Horizontal Segmented Progress Bar */}
                <div className="flex h-4.5 rounded-lg overflow-hidden border border-slate-850 bg-slate-950 p-0.5">
                  {SHOP_SEQUENCE.map((shop, idx) => {
                    const currentIdx = SHOP_SEQUENCE.indexOf(drawerLoco.currentShop);
                    const isDone = idx < currentIdx || drawerLoco.status === "Completed";
                    const isActive = idx === currentIdx && drawerLoco.status !== "Completed";
                    let bg = "bg-slate-800";
                    if (isDone) bg = "bg-emerald-500";
                    else if (isActive) bg = drawerLoco.status === "Delayed" ? "bg-rose-500 animate-pulse" : "bg-indigo-500 animate-pulse";

                    const isSelected = selectedPipelineShop === shop;

                    return (
                      <button
                        key={shop}
                        type="button"
                        onClick={() => setSelectedPipelineShop(shop)}
                        className={`flex-1 ${bg} h-full transition-all relative border-r last:border-r-0 border-slate-950/20`}
                        title={`${shop} (${isDone ? "Completed" : isActive ? "Active" : "Remaining"})`}
                      >
                        {isSelected && (
                          <span className="absolute inset-0 bg-white/30 ring-1 ring-white/70 animate-pulse rounded-xs" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Legend showing numbers of Completed / Pending / Remaining */}
                <div className="flex justify-between items-center text-[10px] font-mono pt-1 text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span>Completed: <span className="text-white font-bold">{
                      drawerLoco.status === "Completed" ? SHOP_SEQUENCE.length : SHOP_SEQUENCE.indexOf(drawerLoco.currentShop)
                    }</span></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded bg-indigo-500" />
                    <span>Active: <span className="text-white font-bold">{
                      drawerLoco.status === "Completed" ? 0 : 1
                    }</span></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded bg-slate-800" />
                    <span>Remaining: <span className="text-white font-bold">{
                      drawerLoco.status === "Completed" ? 0 : (SHOP_SEQUENCE.length - SHOP_SEQUENCE.indexOf(drawerLoco.currentShop) - 1)
                    }</span></span>
                  </div>
                </div>
              </div>

              {/* COMPREHENSIVE TAPPED SHOP DETAILS & PARAMETERS */}
              {selectedPipelineShop && (
                <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl space-y-3.5 animate-in fade-in slide-in-from-bottom-2 duration-150">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] uppercase font-mono font-bold px-1.8 py-0.5 rounded bg-indigo-600 text-white leading-none">
                          Stage #{SHOP_SEQUENCE.indexOf(selectedPipelineShop) + 1}
                        </span>
                        
                        {/* Dynamic category badge of Completed / Pending / Remaining */}
                        {(() => {
                          const currentIdx = SHOP_SEQUENCE.indexOf(drawerLoco.currentShop);
                          const seqIdx = SHOP_SEQUENCE.indexOf(selectedPipelineShop);
                          const isDone = seqIdx < currentIdx || drawerLoco.status === "Completed";
                          const isActive = seqIdx === currentIdx && drawerLoco.status !== "Completed";
                          
                          if (isDone) {
                            return <span className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.25 font-bold uppercase tracking-wide bg-emerald-100 text-emerald-800 rounded">✓ Completed</span>;
                          } else if (isActive) {
                            return <span className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.25 font-bold uppercase tracking-wide bg-amber-100 text-amber-800 rounded animate-pulse">⚙ Active</span>;
                          } else {
                            return <span className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.25 font-bold uppercase tracking-wide bg-slate-100 text-slate-600 rounded">Remaining</span>;
                          }
                        })()}
                      </div>
                      <h4 className="text-xs font-extrabold text-slate-900 mt-1.8 leading-none">
                        {selectedPipelineShop} Diagnostics
                      </h4>
                    </div>
                    
                    <span className="text-[10px] font-mono font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded shadow-3xs">
                      {SHOP_DETAILS_DATA[selectedPipelineShop]?.durationDays || 4} Days Std.
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed bg-white/70 p-2.5 rounded-xl border border-slate-100">
                    {SHOP_DETAILS_DATA[selectedPipelineShop]?.function}
                  </p>

                  <div className="space-y-2">
                    <span className="text-[9px] uppercase font-extrabold tracking-wider text-slate-400 block font-mono">Core Quality Checklist</span>
                    <div className="grid grid-cols-2 gap-2">
                      {(SHOP_DETAILS_DATA[selectedPipelineShop]?.checklist || []).map((step, sIdx) => {
                        const currentIdx = SHOP_SEQUENCE.indexOf(drawerLoco.currentShop);
                        const seqIdx = SHOP_SEQUENCE.indexOf(selectedPipelineShop);
                        const isDone = seqIdx < currentIdx || drawerLoco.status === "Completed";
                        return (
                          <div key={sIdx} className="bg-white p-2 border border-slate-150 rounded-xl flex items-start gap-1.5 text-[10px]">
                            <span className={`h-1.5 w-1.5 rounded-full shrink-0 mt-1.5 ${
                              isDone ? "bg-emerald-500" : "bg-slate-300"
                            }`} />
                            <span className="text-slate-700 leading-tight">{step}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-white/40 p-2.5 rounded-lg border border-slate-100/80 text-[10px]">
                    <span className="text-[8px] uppercase font-bold text-slate-400 block">Heavy Equipment Machinery</span>
                    <span className="font-mono text-slate-700 mt-0.5 block">
                      {SHOP_DETAILS_DATA[selectedPipelineShop]?.machinery || "Standard Calibration Jig"}
                    </span>
                  </div>
                </div>
              )}

              {/* STAGES TIMELINE DIAGRAM */}
              <div className="space-y-3">
                <span className="text-[10px] font-extrabold text-slate-400 font-mono uppercase tracking-wider block">Click stages to inspect</span>
                
                <div className="relative border-l border-slate-150 pl-6 ml-3 space-y-4">
                  {SHOP_SEQUENCE.map((shopName, index) => {
                    // Match shop sequence against locomotive's currentShop to determine if done, active, or pending
                    const currentIdx = SHOP_SEQUENCE.indexOf(drawerLoco.currentShop);
                    const isDone = index < currentIdx || drawerLoco.status === "Completed";
                    const isActive = index === currentIdx && drawerLoco.status !== "Completed";
                    
                    let pointColor = "bg-slate-100 text-slate-400 border-slate-150";
                    let textTheme = "text-slate-400";
                    
                    if (isDone) {
                      pointColor = "bg-emerald-50 text-emerald-600 border-emerald-200";
                      textTheme = "text-slate-500 font-medium";
                    } else if (isActive) {
                      pointColor = "bg-indigo-650 text-white border-indigo-200 animate-pulse";
                      textTheme = "text-indigo-950 font-extrabold";
                    }

                    const isSelected = selectedPipelineShop === shopName;

                    return (
                      <div 
                        key={shopName} 
                        onClick={() => setSelectedPipelineShop(shopName)}
                        className={`relative cursor-pointer p-2.5 -mx-2.5 rounded-xl transition-all border ${
                          isSelected 
                            ? "bg-indigo-50/50 border-indigo-150 shadow-3xs" 
                            : "border-transparent hover:bg-slate-50"
                        }`}
                      >
                        {/* Circle absolute trigger point */}
                        <div className={`absolute -left-[35px] top-3 flex h-4.5 w-4.5 items-center justify-center rounded-full border text-[9px] font-bold ${pointColor}`}>
                          {isDone ? "✓" : index + 1}
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className={`text-xs ${textTheme}`}>{shopName}</span>
                            {isActive && (
                              <span className="text-[8px] font-extrabold uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-100 px-1.5 rounded animate-pulse">
                                Underway
                              </span>
                            )}
                          </div>
                          {isActive && (
                            <p className="text-[10px] text-slate-500 mt-0.5">
                              This locomotive is actively mounted onto Assembly Slot #{100 + index} in {shopName}.
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => alert(`Operational layout logs for ${drawerLoco.locoNumber} exported.`)}
              >
                Download Schematic Specs
              </Button>
              <Button 
                variant="default" 
                className="flex-1 bg-slate-900"
                onClick={() => setIsDrawerOpen(false)}
              >
                Close Panel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
