import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Activity, 
  Filter, 
  Search, 
  TrendingDown, 
  Wrench, 
  ShieldAlert, 
  BarChart2, 
  ArrowUpRight,
  Sparkles,
  HelpCircle
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid,
  BarChart,
  Bar,
  Cell
} from "recharts";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  Button 
} from "../../routes.tsx";
import { ResponsiveTableWrapper } from "../../components/ResponsiveTableWrapper.tsx";
import { ManagerPageHeader } from "./ProductionManagerDashboard.tsx";

// Mock delay trends over last 6 months (cumulative hours)
const MONTHLY_DELAY_TREND = [
  { month: "Jan", hours: 45 },
  { month: "Feb", hours: 30 },
  { month: "Mar", hours: 55 },
  { month: "Apr", hours: 20 },
  { month: "May", hours: 35 },
  { month: "Jun", hours: 14 } // Current month
];

// Delay factors categories data
const DELAY_CATEGORIES_DATA = [
  { name: "Material Shortage", hours: 45, color: "#ef4444" },
  { name: "Machine Breakdown", hours: 32, color: "#f59e0b" },
  { name: "Manpower", hours: 20, color: "#3b82f6" },
  { name: "Quality Issue", hours: 18, color: "#8b5cf6" }
];

interface DelayEvent {
  loco: string;
  shop: string;
  reason: string;
  duration: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  status: "Open" | "Resolved";
  reportedBy: string;
  date: string;
}

const INITIAL_DELAYS_DATABASE: DelayEvent[] = [
  { loco: "WAG12-205", shop: "Electrical Assembly Shop", reason: "Copper plate component delivery stockout at Varanasi warehouse", duration: "10 hrs", severity: "Critical", status: "Open", reportedBy: "Ritik Dubey", date: "Today" },
  { loco: "WAG12-203", shop: "Shell Assembly Shop", reason: "Overhead gantry crane hydraulic hydraulic fluid leak", duration: "4 hrs", severity: "High", status: "Open", reportedBy: "Praveen Pandey", date: "Today" },
  { loco: "WAG9-302", shop: "Electrical Assembly Shop", reason: "PLC drive communication control boards interface fault", duration: "6 hrs", severity: "High", status: "Open", reportedBy: "Ritik Dubey", date: "Yesterday" },
  { loco: "WAP7-108", shop: "Brake & Pneumatic Shop", reason: "Air compressor motor brush recalibration and testing", duration: "2 hrs", severity: "Low", status: "Resolved", reportedBy: "Suresh Sharma", date: "Yesterday" },
  { loco: "WAG12-201", shop: "Testing Center", reason: "High-voltage voltage transformer static sensor calibration", duration: "3 hrs", severity: "Medium", status: "Resolved", reportedBy: "Vikram Malhotra", date: "18 Jun 2026" },
  { loco: "WAP7-106", shop: "Paint Shop", reason: "Air intake relative humidity level exceeding 75% threshold", duration: "5 hrs", severity: "Medium", status: "Resolved", reportedBy: "Somnath Nair", date: "17 Jun 2026" },
  { loco: "WAG12-202", shop: "Testing Center", reason: "Cabin headlight voltage drop override testing complete", duration: "1 hr", severity: "Low", status: "Resolved", reportedBy: "Vikram Malhotra", date: "16 Jun 2026" },
  { loco: "WAP7-109", shop: "Shell Assembly Shop", reason: "Special cabin safety clamp realignment on driver seat console", duration: "3 hrs", severity: "Medium", status: "Resolved", reportedBy: "Praveen Pandey", date: "15 Jun 2026" }
];

export default function DelayMonitoring() {
  const navigate = useNavigate();
  const [delays, setDelays] = useState<DelayEvent[]>(INITIAL_DELAYS_DATABASE);
  const [filterSeverity, setFilterSeverity] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const filteredDelays = delays.filter((d) => {
    const matchesSeverity = filterSeverity === "All" || d.severity === filterSeverity;
    const matchesStatus = filterStatus === "All" || d.status === filterStatus;
    return matchesSeverity && matchesStatus;
  });

  const getSeverityColor = (severity: DelayEvent["severity"]) => {
    switch (severity) {
      case "Critical": return "bg-red-50 text-red-700 border-red-200";
      case "High": return "bg-orange-50 text-orange-700 border-orange-200";
      case "Medium": return "bg-amber-50 text-amber-800 border-amber-200";
      case "Low": return "bg-slate-50 text-slate-705 border-slate-205";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Navigation Header */}
      <ManagerPageHeader activeTab="delay" />

      {/* TOP KPI CARDS */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {/* Total Delays cumulative */}
        <Card className="bg-white border-l-4 border-l-slate-800 p-4">
          <CardHeader className="p-0 flex flex-row items-center justify-between pb-1 space-y-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Cumulative Incident Cycles</span>
            <AlertTriangle className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent className="p-0 mt-2">
            <div className="text-2xl font-black text-slate-900">14 Registered</div>
            <p className="text-[10px] text-slate-450 mt-0.5">Total recorded shop delays</p>
          </CardContent>
        </Card>

        {/* Critical Delays active */}
        <Card className="bg-white border-l-4 border-l-red-650 p-4">
          <CardHeader className="p-0 flex flex-row items-center justify-between pb-1 space-y-0">
            <span className="text-[10px] font-bold text-red-600 uppercase font-mono">Critical Hours Lost</span>
            <span className="h-2 w-2 rounded-full bg-red-650 animate-pulse" />
          </CardHeader>
          <CardContent className="p-0 mt-2">
            <div className="text-2xl font-black text-red-600">3 Blockers</div>
            <p className="text-[10px] text-red-500 font-bold mt-0.5">Requires immediate attention</p>
          </CardContent>
        </Card>

        {/* Resolved Delays */}
        <Card className="bg-white border-l-4 border-l-emerald-650 p-4">
          <CardHeader className="p-0 flex flex-row items-center justify-between pb-1 space-y-0">
            <span className="text-[10px] font-bold text-emerald-600 uppercase font-mono">Closed & Mitigated</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent className="p-0 mt-2">
            <div className="text-2xl font-black text-slate-905 font-mono">11 Mitigated</div>
            <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Average resolution time: 3.2 hrs</p>
          </CardContent>
        </Card>

        {/* Open Delays */}
        <Card className="bg-white border-l-4 border-l-amber-600 p-4">
          <CardHeader className="p-0 flex flex-row items-center justify-between pb-1 space-y-0">
            <span className="text-[10px] font-bold text-amber-600 uppercase font-mono">Active Open Queues</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent className="p-0 mt-2">
            <div className="text-2xl font-black text-slate-901">3 Active</div>
            <p className="text-[10px] text-slate-400 mt-0.5">Underway troubleshooting active</p>
          </CardContent>
        </Card>
      </div>

      {/* CHARTS GRID PANEL */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Chart 1: Delay Monthly trend */}
        <Card className="bg-white border border-slate-200">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="text-xs uppercase font-bold text-slate-400 tracking-wider font-mono">1. Delay Duration Monthly Trend (Hours)</CardTitle>
            <CardDescription>Downtime progress metrics indicating systematic improvement index.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-4">
            <div className="h-64 w-full -ml-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MONTHLY_DELAY_TREND}>
                  <defs>
                    <linearGradient id="delayGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: "11px", background: "#0f172a", border: "none", borderRadius: "8px", color: "white" }} />
                  <Area type="monotone" dataKey="hours" stroke="#ef4444" strokeWidth={2.5} fillOpacity={1} fill="url(#delayGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between items-center text-xs font-mono text-emerald-600 pt-3 border-t border-slate-100 font-bold">
              <span>Average Month Downtime: 34.8 hrs</span>
              <span className="flex items-center gap-0.5 text-emerald-600"><TrendingDown className="h-3.5 w-3.5" /> -60% since peak (March)</span>
            </div>
          </CardContent>
        </Card>

        {/* Chart 2: Delay Factors Categories */}
        <Card className="bg-white border border-slate-200">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="text-xs uppercase font-bold text-slate-400 tracking-wider font-mono">2. Cumulative Lost Hours per Category</CardTitle>
            <CardDescription>Visual distribution of downtime hours lost across major bottlenecks.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-4 font-mono">
            <div className="h-64 w-full -ml-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DELAY_CATEGORIES_DATA} layout="vertical">
                  <XAxis type="number" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={10} width={110} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: "11px", background: "#0f172a", border: "none", borderRadius: "8px", color: "white" }} />
                  <Bar dataKey="hours" radius={[0, 4, 4, 0]}>
                    {DELAY_CATEGORIES_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* DETAILED DELAYS DATA LOG TABLE */}
      <Card className="bg-white border border-slate-200">
        <CardHeader className="border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4">
          <div>
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-900">Incident Registry Table</CardTitle>
            <CardDescription>Log checklist tracking open issues and audited mitigations.</CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
            {/* Filter 1 */}
            <span className="text-xs font-bold text-slate-500 font-sans flex items-center gap-1">
              <Filter className="h-3.5 w-3.5" /> Severity:
            </span>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="px-2.5 py-1.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-md outline-none text-slate-700"
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            {/* Filter 2 */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-2.5 py-1.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-md outline-none text-slate-700"
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ResponsiveTableWrapper>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[9px] font-mono uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-5 font-bold">Build No.</th>
                  <th className="py-3 px-4 font-bold">Reside Workshop</th>
                  <th className="py-3 px-4 font-bold">Technical Description Root Cause</th>
                  <th className="py-3 px-4 font-bold">Downtime</th>
                  <th className="py-3 px-4 font-bold text-center">Threat Level</th>
                  <th className="py-3 px-4 font-bold text-center">Engine Status</th>
                  <th className="py-3 px-5 font-bold text-right">Audit Workspace</th>
                </tr>
              </thead>
              <tbody>
                {filteredDelays.map((delay, index) => (
                  <tr 
                    key={index}
                    className="border-b last:border-0 border-slate-100 hover:bg-slate-50/30 text-xs text-slate-600 transition-colors"
                  >
                    {/* Loco */}
                    <td className="py-3 px-5">
                      <span className="font-extrabold text-slate-900 font-mono tracking-tight">{delay.loco}</span>
                    </td>

                    {/* Shop */}
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {delay.shop}
                    </td>

                    {/* Reason */}
                    <td className="py-3 px-4 font-medium leading-relaxed max-w-sm truncate" title={delay.reason || "Transformer calibration check"}>
                      {delay.reason || "High temperature sensor re-wiring & check calibration"}
                    </td>

                    {/* Duration */}
                    <td className="py-3 px-4 text-slate-700 font-mono font-bold">
                      {delay.duration}
                    </td>

                    {/* Severity */}
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono border ${getSeverityColor(delay.severity)}`}>
                        {delay.severity}
                      </span>
                    </td>

                    {/* Status badge */}
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full ${
                        delay.status === "Resolved" ? "bg-emerald-50 text-emerald-800 border-emerald-100" : "bg-red-50 text-red-800 border-red-100 animate-pulse"
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${delay.status === "Resolved" ? "bg-emerald-500" : "bg-red-500"}`} />
                        {delay.status}
                      </span>
                    </td>

                    {/* Redirect action to Page 4 */}
                    <td className="py-3 px-5 text-right whitespace-nowrap">
                      <Button 
                        onClick={() => navigate(`/production-manager/lifecycle?loco=${delay.loco}`)}
                        variant="ghost" 
                        className="h-8 px-2 text-indigo-650 hover:text-indigo-850 hover:bg-indigo-50 font-bold text-[11px]"
                      >
                        Inspect Lifecycle <ArrowUpRight className="h-3.5 w-3.5 inline ml-0.5" />
                      </Button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </ResponsiveTableWrapper>
        </CardContent>
      </Card>
    </div>
  );
}
