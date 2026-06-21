import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Building2, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Gauge, 
  Workflow, 
  ArrowRight, 
  TrendingUp, 
  Activity, 
  User, 
  Wrench, 
  ShieldAlert, 
  CheckSquare, 
  Zap, 
  History,
  CornerDownRight,
  Filter,
  RefreshCw,
  BarChart2,
  Calendar
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from "recharts";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  Button 
} from "../../routes.tsx";

// Shared Manager Navigation component to let users switch pages since we shouldn't change layout sidebar/navbar
export function ManagerPageHeader({ activeTab }: { activeTab: string }) {
  const navigate = useNavigate();
  const tabs = [
    { id: "dashboard", label: "Command Center", path: "/production-manager" },
    { id: "live-shop", label: "Live Shop Monitor", path: "/production-manager/live-shop" },
    { id: "locomotives", label: "Locomotive Tracking", path: "/production-manager/locomotives" },
    { id: "lifecycle", label: "Lifecycle Tracking", path: "/production-manager/lifecycle" },
    { id: "delay", label: "Delay Monitoring", path: "/production-manager/delay-monitoring" },
    { id: "analytics", label: "Executive Analytics", path: "/production-manager/analytics" }
  ];

  return (
    <div className="mb-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-indigo-650 animate-pulse" />
            <span className="text-[10px] font-mono font-bold tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase">
              BLW Production Manager Portal
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Production Command Center</h1>
          <p className="text-xs text-slate-500">Real-time locomotive fabrication, shop throughput, and systemic delay monitoring.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Live Telemetry
          </span>
        </div>
      </div>

      {/* Modern Dashboard Sub tabs */}
      <div className="flex flex-wrap gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200 max-w-4xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => navigate(tab.path)}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer select-none ${
              activeTab === tab.id
                ? "bg-white text-slate-900 shadow-sm border border-slate-200/50"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/40"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// Donut data for Delay Distribution
const DELAY_DISTRIBUTION_DATA = [
  { name: "Material Shortage", value: 40, color: "#ef4444" },
  { name: "Machine Breakdown", value: 25, color: "#f59e0b" },
  { name: "Manpower Allocation", value: 20, color: "#3b82f6" },
  { name: "Quality Approvals", value: 15, color: "#8b5cf6" }
];

// Efficiency bar chart data
const SHOP_EFFICIENCY_DATA = [
  { name: "Frame Fab", score: 95, color: "#10b981" },
  { name: "Bogie Shop", score: 91, color: "#10b981" },
  { name: "Shell Assm", score: 88, color: "#10b981" },
  { name: "Elec Assm", score: 82, color: "#f59e0b" },
  { name: "Brake Shop", score: 90, color: "#10b981" },
  { name: "Paint Shop", score: 86, color: "#10b981" },
  { name: "Testing", score: 93, color: "#10b981" },
  { name: "Dispatch", score: 97, color: "#10b981" }
];

// 15 realistic recent activity logs
const RECENT_ACTIVITIES = [
  { id: "ACT-01", time: "5 mins ago", text: "Loco WAG12-202 successfully rolled out of testing and entered Dispatch Center.", type: "success", shop: "Dispatch Center", user: "Ritik Dubey" },
  { id: "ACT-02", time: "18 mins ago", text: "Loco WAG12-205 marked as DELAYED in Electrical Assembly due to wiring harness supply stockout.", type: "warning", shop: "Electrical Assembly", user: "Praveen Pandey" },
  { id: "ACT-03", time: "34 mins ago", text: "Supervisor Rajesh Kulkarni approved shell safety test guidelines on unit WAG12-203.", type: "info", shop: "Shell Assembly", user: "Rajesh Kulkarni" },
  { id: "ACT-04", time: "1 hour ago", text: "Brake & Pneumatic lines safety audit completed on Loco WAP7-108.", type: "success", shop: "Brake & Pneumatic", user: "Suresh Sharma" },
  { id: "ACT-05", time: "2 hours ago", text: "Critical repair completed on frame-cutting heavy laser tool on Fabrication Line-2.", type: "maintenance", shop: "Frame Fabrication", user: "Amrita Sen" },
  { id: "ACT-06", time: "3 hours ago", text: "New Loco WAP7-111 schedule initiated at Frame Fabrication shop floor.", type: "info", shop: "Frame Fabrication", user: "Ritik Dubey" },
  { id: "ACT-07", time: "4 hours ago", text: "Testing Center started complete high-pot electrical frequency diagnostic on WAG12-201.", type: "info", shop: "Testing Center", user: "Somnath Nair" },
  { id: "ACT-08", time: "5 hours ago", text: "Weekly Quality Assurance checklist signed off by Chief Supervisor Praveen Pandey.", type: "success", shop: "HQ Command Centre", user: "Praveen Pandey" },
  { id: "ACT-09", time: "Yesterday", text: "Bogie assembly Completed early on unit WAP7-109; sent to Shell Assembly.", type: "success", shop: "Bogie Shop", user: "Rajesh Kulkarni" },
  { id: "ACT-10", time: "Yesterday", text: "Loco WAP7-107 marked as active in Paint Shop with special anti-abrasive primer.", type: "info", shop: "Paint Shop", user: "Somnath Nair" },
  { id: "ACT-11", time: "Yesterday", text: "Air brake lines leakage error detected on Loco WAG12-204; rollback troubleshooting registered.", type: "warning", shop: "Brake & Pneumatic", user: "Suresh Sharma" },
  { id: "ACT-12", time: "2 days ago", text: "Pneumatic valve test equipment recalibrated to standard 12 Bar pressure parameters.", type: "maintenance", shop: "Brake & Pneumatic", user: "Suresh Sharma" },
  { id: "ACT-13", time: "2 days ago", text: "Heavy sheet metal frame fabrication completed on order item #WAG12-206.", type: "success", shop: "Frame Fabrication", user: "Amrita Sen" },
  { id: "ACT-14", time: "3 days ago", text: "Loco WAP7-105 successfully dispatched to Northern Railway division Lucknow.", type: "dispatch", shop: "Dispatch Center", user: "Ritik Dubey" },
  { id: "ACT-15", time: "3 days ago", text: "Sub-assembly harness connection completed for driver console on line WAP7-110.", type: "success", shop: "Electrical Assembly", user: "Somnath Nair" }
];

export default function ProductionManagerDashboard() {
  const [activities, setActivities] = useState(RECENT_ACTIVITIES);
  const [filterShop, setFilterShop] = useState("All");

  const filteredActivities = filterShop === "All" 
    ? activities 
    : activities.filter(a => a.shop === filterShop);

  // Shop locomotive counts for Horizontal Pipeline
  const shopPipeline = [
    { name: "Frame Fab.", count: 3, code: "FF", bg: "bg-indigo-50 border-indigo-200 text-indigo-700" },
    { name: "Bogie Shop", count: 2, code: "BS", bg: "bg-emerald-50 border-emerald-200 text-emerald-700" },
    { name: "Shell Assm.", count: 4, code: "SA", bg: "bg-amber-50 border-amber-200 text-amber-700" },
    { name: "Elec. Assm.", count: 3, code: "EA", bg: "bg-purple-50 border-purple-200 text-purple-700" },
    { name: "Brake & Pneu.", count: 1, code: "BP", bg: "bg-blue-50 border-blue-200 text-blue-700" },
    { name: "Paint Shop", count: 2, code: "PS", bg: "bg-rose-50 border-rose-200 text-rose-700" },
    { name: "Testing Center", count: 2, code: "TC", bg: "bg-teal-50 border-teal-200 text-teal-700" },
    { name: "Dispatch Cent.", count: 1, code: "DC", bg: "bg-slate-100 border-slate-300 text-slate-800" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Navigation Header */}
      <ManagerPageHeader activeTab="dashboard" />

      {/* TOP KPI CARDS STRIP */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {/* Today's Target */}
        <Card className="border-l-4 border-l-slate-800 bg-white">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Today's Target</span>
              <Calendar className="h-4 w-4 text-slate-400" />
            </div>
            <div className="mt-2.5">
              <span className="text-2xl font-black text-slate-900">8 Units</span>
              <span className="block text-[10px] text-slate-400 mt-1">Daily production schedule</span>
            </div>
          </CardContent>
        </Card>

        {/* Today's Completed */}
        <Card className="border-l-4 border-l-emerald-500 bg-white">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider font-mono">Today's Completed</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="mt-2.5">
              <span className="text-2xl font-black text-slate-900">5 Units</span>
              <span className="block text-[10px] text-emerald-600 font-semibold mt-1">62.5% Target Achieved</span>
            </div>
          </CardContent>
        </Card>

        {/* Running Locomotives */}
        <Card className="border-l-4 border-l-indigo-600 bg-white">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider font-mono">Running</span>
              <Activity className="h-4 w-4 text-indigo-500" />
            </div>
            <div className="mt-2.5">
              <span className="text-2xl font-black text-slate-900">18 Units</span>
              <span className="block text-[10px] text-slate-400 mt-1">Active across shop floors</span>
            </div>
          </CardContent>
        </Card>

        {/* Delayed Locomotives */}
        <Card className="border-l-4 border-l-red-500 bg-white">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-red-650 uppercase tracking-wider font-mono">Delayed</span>
              <AlertTriangle className="h-4 w-4 text-red-500 animate-bounce" />
            </div>
            <div className="mt-2.5">
              <span className="text-2xl font-black text-red-600">3 Units</span>
              <span className="block text-[10px] text-red-550 font-bold mt-1">Immediate action needed</span>
            </div>
          </CardContent>
        </Card>

        {/* Overall Efficiency */}
        <Card className="border-l-4 border-l-purple-500 bg-white">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-purple-650 uppercase tracking-wider font-mono">Overall Efficiency</span>
              <Gauge className="h-4 w-4 text-purple-500" />
            </div>
            <div className="mt-2.5">
              <span className="text-2xl font-black text-slate-900">91.4%</span>
              <span className="block text-[10px] text-emerald-600 font-semibold mt-1">↑ 1.2% this week</span>
            </div>
          </CardContent>
        </Card>

        {/* Shops Active */}
        <Card className="border-l-4 border-l-teal-500 bg-white">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider font-mono">Shops Active</span>
              <Building2 className="h-4 w-4 text-teal-500" />
            </div>
            <div className="mt-2.5">
              <span className="text-2xl font-black text-slate-900">8 / 8</span>
              <span className="block text-[10px] text-slate-400 mt-1">All operating lines online</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SECTION 1: PRODUCTION PIPELINE (HORIZONTAL PROGRESS) */}
      <Card className="bg-white border border-slate-200">
        <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Horizontal Production Pipeline
            </CardTitle>
            <CardDescription>
              Sequence map representing real-time unit counts currently resident at each specialized workshop.
            </CardDescription>
          </div>
          <span className="p-1 px-2.5 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded text-[10px] font-mono font-bold uppercase shrink-0">
            Flow Direction: Left to Right
          </span>
        </CardHeader>
        <CardContent className="p-6">
          <div className="overflow-x-auto pb-2">
            <div className="flex items-center gap-1.5 min-w-[960px]">
              {shopPipeline.map((shop, idx) => (
                <React.Fragment key={idx}>
                  {/* Pipeline Station Node */}
                  <div className="flex-1 flex flex-col items-center">
                    <div className={`w-full p-3.5 border rounded-xl flex flex-col items-center justify-center relative min-h-[105px] hover:shadow-sm transition-all duration-200 ${shop.bg}`}>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 mb-1">{`SHOP-0${idx + 1}`}</span>
                      <h4 className="text-[11px] font-black text-slate-900 text-center truncate w-full">{shop.name}</h4>
                      
                      {/* Badge representing active loco counts */}
                      <div className="mt-2 flex items-center justify-center gap-1.5 bg-white border border-slate-200 shadow-3xs rounded-full px-3 py-1 font-mono">
                        <span className="h-2 w-2 rounded-full bg-slate-900 animate-pulse" />
                        <span className="text-xs font-extrabold text-slate-900">{shop.count} Unit{shop.count !== 1 && "s"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Connecting Arrow */}
                  {idx < shopPipeline.length - 1 && (
                    <div className="flex flex-col items-center justify-center text-slate-400 px-1 shrink-0">
                      <ArrowRight className="h-4 w-4" />
                      <span className="text-[9px] font-bold text-slate-300 font-mono mt-0.5">NEXT</span>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CHARTS GRID: SECTION 2 & SECTION 3 */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* SECTION 2: SHOP EFFICIENCY COMPARISON (BAR CHART) */}
        <Card className="bg-white border border-slate-200">
          <CardHeader className="border-b border-slate-100 pb-3">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Shop Efficiency Comparison (%)
            </CardTitle>
            <CardDescription>
              Performance indexes compiled from target timelines vs actual fabrication outputs.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-4">
            <div className="h-72 w-full -ml-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SHOP_EFFICIENCY_DATA}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis domain={[50, 100]} stroke="#64748b" fontSize={10} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ fontSize: "11px", background: "#0f172a", border: "none", borderRadius: "8px", color: "white" }} 
                    formatter={(value) => [`${value}% Efficiency Score`, "Score"]}
                  />
                  <Bar dataKey="score" fill="#4f46e5" radius={[4, 4, 0, 0]}>
                    {SHOP_EFFICIENCY_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.score < 85 ? "#f59e50" : "#4f46e5"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-4 justify-center text-xs font-mono text-slate-500 pt-3 border-t border-slate-100">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-indigo-650" /> Target Standard (&gt;= 85%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500" /> Caution Attention (&lt; 85%)
              </span>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 3: DELAY DISTRIBUTION (DONUT CHART) */}
        <Card className="bg-white border border-slate-200">
          <CardHeader className="border-b border-slate-100 pb-3">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Critical Delay Factor Distribution
            </CardTitle>
            <CardDescription>
              Major categorized causes attribute percentages of delayed production hours.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-4 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="h-60 w-full max-w-[240px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={DELAY_DISTRIBUTION_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {DELAY_DISTRIBUTION_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Contribution"]} />
                </PieChart>
              </ResponsiveContainer>
              {/* Central text indicator inside donut */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-xl font-black text-slate-900">4 Categories</span>
                <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-widest">Delay Sources</span>
              </div>
            </div>

            {/* Stylized Legends */}
            <div className="flex-1 space-y-3.5 w-full">
              {DELAY_DISTRIBUTION_DATA.map((entry) => (
                <div key={entry.name} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                    <span className="text-xs font-bold text-slate-700">{entry.name}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 text-xs">{entry.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SECTION 4: RECENT ACTIVITY FEED (15 ITEMS WITH FILTER) */}
      <Card className="bg-white border border-slate-200">
        <CardHeader className="border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
          <div>
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Live Shop Floor Operations Audit Log
            </CardTitle>
            <CardDescription>
              Sequence history showing exactly 15 recorded physical actions and state modifications.
            </CardDescription>
          </div>
          
          {/* Shop Selector Filter */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="text-xs font-semibold text-slate-500 font-sans flex items-center gap-1">
              <Filter className="h-3.5 w-3.5 text-slate-400" /> Filter Shop:
            </span>
            <select
              value={filterShop}
              onChange={(e) => setFilterShop(e.target.value)}
              className="px-2.5 py-1.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg outline-none text-slate-700 focus:border-slate-800"
            >
              <option value="All">All Shops</option>
              <option value="Frame Fabrication">Frame Fabrication</option>
              <option value="Bogie Shop">Bogie Shop</option>
              <option value="Shell Assembly">Shell Assembly</option>
              <option value="Electrical Assembly">Electrical Assembly</option>
              <option value="Brake & Pneumatic">Brake & Pneumatic</option>
              <option value="Paint Shop">Paint Shop</option>
              <option value="Testing Center">Testing Center</option>
              <option value="Dispatch Center">Dispatch Center</option>
            </select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100 max-h-[580px] overflow-y-auto">
            {filteredActivities.length === 0 ? (
              <div className="p-8 text-center text-slate-400 font-medium">
                No recent activities logged matching selection.
              </div>
            ) : (
              filteredActivities.map((activity) => (
                <div key={activity.id} className="p-4 p-x-5 hover:bg-slate-50/40 transition-colors flex items-start gap-4 text-xs">
                  {/* Dynamic Colored Left Strip or Bullet based on type */}
                  <span className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    activity.type === "success" ? "bg-emerald-50 text-emerald-700" :
                    activity.type === "warning" ? "bg-red-50 text-red-700" :
                    activity.type === "maintenance" ? "bg-amber-50 text-amber-700" :
                    "bg-blue-50 text-indigo-700"
                  }`}>
                    {activity.type === "success" && <CheckCircle2 className="h-4 w-4" />}
                    {activity.type === "warning" && <AlertTriangle className="h-4 w-4" />}
                    {activity.type === "maintenance" && <Wrench className="h-4 w-4" />}
                    {activity.type !== "success" && activity.type !== "warning" && activity.type !== "maintenance" && <Activity className="h-4 w-4" />}
                  </span>

                  <div className="flex-1 space-y-1">
                    <p className="font-semibold text-slate-800 leading-relaxed">{activity.text}</p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-mono text-slate-400 font-bold">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded">{activity.id}</span>
                      <span>&bull;</span>
                      <span className="text-slate-550 flex items-center gap-0.5 uppercase"><Building2 className="h-3 w-3 inline text-slate-400" /> {activity.shop}</span>
                      <span>&bull;</span>
                      <span className="text-slate-550 flex items-center gap-0.5"><User className="h-3 w-3 inline text-slate-400" /> {activity.user}</span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-slate-400 font-bold shrink-0 self-start">{activity.time}</span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
