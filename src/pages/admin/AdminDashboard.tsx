import React from "react";
import { 
  Train, 
  Play, 
  CheckCircle, 
  AlertTriangle, 
  Users, 
  Factory, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  FileText, 
  Plus, 
  History, 
  HelpCircle,
  Wrench,
  ShieldCheck,
  Building2,
  Lock,
  ArrowUpRight,
  Sparkles
} from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  LineChart, 
  Line, 
  CartesianGrid 
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

// ============================================================================
// MOCK DATASETS & STATIC VALUE CONFIGS
// ============================================================================

const KPI_CARDS = [
  {
    id: "total",
    label: "Total Locomotives",
    val: "124",
    icon: Train,
    trend: "+8% this quarter",
    isPositive: true,
    color: "slate",
  },
  {
    id: "active",
    label: "Active Locomotives",
    val: "56",
    icon: Play,
    trend: "+4% from yesterday",
    isPositive: true,
    color: "indigo",
  },
  {
    id: "completed",
    label: "Completed Locomotives",
    val: "61",
    icon: CheckCircle,
    trend: "+12 units this month",
    isPositive: true,
    color: "emerald",
  },
  {
    id: "delayed",
    label: "Delayed Locomotives",
    val: "7",
    icon: AlertTriangle,
    trend: "-2 from last week",
    isPositive: true, // fewer delayed is positive
    color: "rose",
  },
  {
    id: "users",
    label: "Total Users",
    val: "10",
    icon: Users,
    trend: "2 active online now",
    isPositive: true,
    color: "amber",
  },
  {
    id: "shops",
    label: "Total Shops",
    val: "8",
    icon: Factory,
    trend: "All operational",
    isPositive: true,
    color: "cyan",
  },
];

// Recharts: Section 1 (Donut Chart)
const STATUS_DATA = [
  { name: "Completed", value: 61, color: "#10b981" },
  { name: "In Progress", value: 56, color: "#6366f1" },
  { name: "Delayed", value: 7, color: "#f43f5e" },
];

// Recharts: Section 2 (Horizontal Bar Chart)
const PERFORMANCE_DATA = [
  { name: "Frame Fab.", value: 95, color: "#0f172a" },
  { name: "Bogie Shop", value: 91, color: "#475569" },
  { name: "Shell Assembly", value: 88, color: "#6366f1" },
  { name: "Elec. Assembly", value: 82, color: "#818cf8" },
  { name: "Brake Shop", value: 90, color: "#0d9488" },
  { name: "Paint Shop", value: 86, color: "#fbbf24" },
  { name: "Testing Center", value: 93, color: "#14b8a6" },
  { name: "Dispatch Center", value: 97, color: "#10b981" },
];

// Recharts: Section 3 (Line Chart)
const TREND_DATA = [
  { month: "Jan", production: 18 },
  { month: "Feb", production: 21 },
  { month: "Mar", production: 24 },
  { month: "Apr", production: 19 },
  { month: "May", production: 26 },
  { month: "Jun", production: 31 },
];

// Section 4: Shop Health Table Status
const SHOP_HEALTH_ROWS = [
  { shop: "Frame Fabrication", supervisor: "Aditya Patil", activeLocos: 12, delayed: 0, efficiency: 95, status: "Optimal" },
  { shop: "Bogie Shop", supervisor: "Rajesh K.", activeLocos: 8, delayed: 1, efficiency: 91, status: "Optimal" },
  { shop: "Shell Assembly", supervisor: "Vijay M.", activeLocos: 14, delayed: 2, efficiency: 88, status: "Warning" },
  { shop: "Electrical Assembly", supervisor: "Suresh Sharma", activeLocos: 11, delayed: 3, efficiency: 82, status: "Warning" },
  { shop: "Brake Shop", supervisor: "H. Deshmukh", activeLocos: 4, delayed: 0, efficiency: 90, status: "Optimal" },
  { shop: "Paint Shop", supervisor: "Somnath Nair", activeLocos: 3, delayed: 0, efficiency: 86, status: "Optimal" },
  { shop: "Testing Center", supervisor: "Amrita Sen", activeLocos: 2, delayed: 1, efficiency: 93, status: "Optimal" },
  { shop: "Dispatch Center", supervisor: "G. Subramanian", activeLocos: 2, delayed: 0, efficiency: 97, status: "Optimal" },
];

// Section 5: Recent Activity Feed (10 items)
const RECENT_ACTIVITIES = [
  { id: 1, text: "Locomotive WAG12-101 moved to Paint Shop", time: "10 mins ago", type: "move" },
  { id: 2, text: "Delay reported in Electrical Assembly", time: "42 mins ago", type: "delay" },
  { id: 3, text: "Testing completed for WAG12-095", time: "1 hour ago", type: "complete" },
  { id: 4, text: "New locomotive build WAP7-31008 registered", time: "2 hours ago", type: "add" },
  { id: 5, text: "Role changed for Paint Supervisor to Chief Overseer", time: "Yesterday", type: "system" },
  { id: 6, text: "Bogie Shop completed structural hydraulic frame #402", time: "Yesterday", type: "complete" },
  { id: 7, text: "Frame Fabrication speed record exceeded (95% efficiency)", time: "June 18, 2026", type: "achievement" },
  { id: 8, text: "Maintenance scheduled complete on Brake Shop Line 1 pneumatic valve calibrator", time: "June 18, 2026", type: "maintenance" },
  { id: 9, text: "New operator S. Sharma onboarded to Electrical Assembly Shift B", time: "June 17, 2026", type: "user" },
  { id: 10, text: "Dispatch Center successfully dispatched WAP7-30410 to Eastern Railways division", time: "June 16, 2026", type: "dispatch" },
];

// Section 6: Critical Alerts Panel
const CRITICAL_ALERTS = [
  {
    title: "Machine Breakdown",
    detail: "Welding Robot #4 in Frame Fabrication inactive. Pneumatic actuator seal leak.",
    time: "Critical Alarm • 12 mins ago",
    severity: "danger"
  },
  {
    title: "Material Shortage",
    detail: "Bogie Shop awaiting external shipment of class-H copper traction motors.",
    time: "Warning • 2 hours ago",
    severity: "warning"
  },
  {
    title: "Testing Delay",
    detail: "High-speed testing tracks suffering grid power fluctuation backlog.",
    time: "Caution • Yesterday",
    severity: "caution"
  },
  {
    title: "Dispatch Hold",
    detail: "Customs certification paperwork hold on Export Dispatch Line 2 railhead.",
    time: "Hold • Yesterday",
    severity: "neutral"
  },
];

export default function AdminDashboard() {
  return (
    <div id="admin-dashboard-page" className="space-y-8 pb-12">
      {/* Header Segment */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-2.5 w-2.5 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-indigo-600 font-mono bg-indigo-50/80 px-2 py-0.5 rounded-md">
              Secure HQ Access
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Admin Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Production Monitoring System Overview & Heavy Rolling Stock Assemblies.
          </p>
        </div>

        {/* Quick Action Group */}
        <div className="flex items-center gap-2.5 mt-4 sm:mt-0">
          <Button variant="outline" className="hidden lg:inline-flex bg-white text-slate-700">
            <FileText className="h-3.5 w-3.5 text-slate-500" /> Export Status Sheet
          </Button>
          <Button variant="default" className="shadow-sm">
            <Plus className="h-3.5 w-3.5" /> Initialize Build
          </Button>
        </div>
      </div>

      {/* KPI Cards Strip (Grid of 6) */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 animate-in fade-in duration-200">
        {KPI_CARDS.map((card) => {
          const Icon = card.icon;
          
          // Color styles matching industrial slate patterns
          let colorBgTheme = "bg-slate-50/50 hover:bg-slate-50";
          let iconColor = "text-slate-600 bg-slate-100";
          
          if (card.color === "indigo") {
            iconColor = "text-indigo-600 bg-indigo-50";
          } else if (card.color === "emerald") {
            iconColor = "text-emerald-600 bg-emerald-50";
          } else if (card.color === "rose") {
            iconColor = "text-rose-600 bg-rose-50";
          } else if (card.color === "amber") {
            iconColor = "text-amber-600 bg-amber-50";
          } else if (card.color === "cyan") {
            iconColor = "text-cyan-600 bg-cyan-50";
          }

          return (
            <Card key={card.id} className={`transition-all duration-200 border border-slate-150 ${colorBgTheme}`}>
              <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0 pb-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 truncate leading-none">
                  {card.label}
                </span>
                <span className={`p-1.5 rounded-lg shrink-0 ${iconColor}`}>
                  <Icon className="h-3.5 w-3.5" />
                </span>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                  {card.val}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {card.color === "rose" ? (
                    <TrendingDown className="h-3 w-3 text-emerald-500" />
                  ) : (
                    <TrendingUp className="h-3 w-3 text-indigo-500" />
                  )}
                  <span className="text-[10px] text-slate-400 font-medium">
                    {card.trend}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Analytics Subsection (Grid layout containing 3 key charts) */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Section 1: Donut Chart -> 1 col */}
        <div className="col-span-1 flex flex-col h-full">
          <Card className="flex flex-col h-full border border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-slate-900">
                Production Status Overview
              </CardTitle>
              <CardDescription>
                Unit distribution by lifecycle stage.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between pt-2">
              {/* Pie/Donut Chart Area */}
              <div className="h-44 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={STATUS_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {STATUS_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ background: "#0f172a", border: "none", borderRadius: "6px" }}
                      labelStyle={{ color: "#ffffff", fontSize: "11px" }}
                      itemStyle={{ color: "#ffffff", fontSize: "11px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Total Counter in Centered Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xl font-extrabold text-slate-800">124</span>
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Locomotives</span>
                </div>
              </div>

              {/* Status Legends */}
              <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-slate-100 font-mono text-[10px]">
                {STATUS_DATA.map((status) => (
                  <div key={status.name} className="flex flex-col items-start p-1 bg-slate-50 rounded-lg text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: status.color }} />
                      <span className="text-slate-400 font-sans font-medium text-[9px]">{status.name}</span>
                    </div>
                    <span className="font-bold text-slate-700 text-xs pl-3.5 mt-0.5">{status.value} units</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section 2: Shop Performance -> 1 col */}
        <div className="col-span-1 flex flex-col h-full">
          <Card className="flex flex-col h-full border border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-slate-900">
                Shop Performance
              </CardTitle>
              <CardDescription>
                Average assembly efficiency load percentage.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center pt-2">
              <div className="h-56 w-full -ml-3">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={PERFORMANCE_DATA}
                    layout="vertical"
                    margin={{ top: 5, right: 10, left: 24, bottom: 5 }}
                  >
                    <XAxis 
                      type="number" 
                      domain={[0, 100]} 
                      fontSize={8} 
                      axisLine={false} 
                      tickLine={false}
                      tickFormatter={(v) => `${v}%`}
                      stroke="#94a3b8" 
                    />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      fontSize={8} 
                      axisLine={false} 
                      tickLine={false} 
                      stroke="#475569"
                    />
                    <Tooltip 
                      cursor={{ fill: "rgba(226, 232, 240, 0.4)" }}
                      contentStyle={{ background: "#0f172a", border: "none", borderRadius: "6px" }}
                      labelStyle={{ color: "#ffffff", fontSize: "11px" }}
                      itemStyle={{ color: "#ffffff", fontSize: "11px" }}
                      formatter={(value) => [`${value}% Efficiency`, "Load"]}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={11}>
                      {PERFORMANCE_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section 3: Production Trend -> spans full width of 2 cols */}
        <div className="lg:col-span-2 flex flex-col h-full">
          <Card className="flex flex-col h-full border border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-slate-900">
                Production Trend
              </CardTitle>
              <CardDescription>
                Units rolled out over active calendar months.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center pt-2">
              <div className="h-56 w-full -ml-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={TREND_DATA}
                    margin={{ top: 8, right: 10, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="month" 
                      fontSize={9} 
                      axisLine={false} 
                      tickLine={false} 
                      stroke="#94a3b8" 
                    />
                    <YAxis 
                      fontSize={9} 
                      axisLine={false} 
                      tickLine={false} 
                      stroke="#94a3b8" 
                    />
                    <Tooltip 
                      contentStyle={{ background: "#0f172a", border: "none", borderRadius: "6px" }}
                      labelStyle={{ color: "#ffffff", fontSize: "11px" }}
                      itemStyle={{ color: "#ffffff", fontSize: "11px" }}
                      formatter={(value) => [`${value} Completed`, "Builds"]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="production" 
                      stroke="#6366f1" 
                      strokeWidth={2.5} 
                      dot={{ stroke: '#4f46e5', strokeWidth: 1.5, r: 4, fill: '#ffffff' }}
                      activeDot={{ r: 6 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Grid containing Section 4: Shop Health Table & Section 5: Recent Activities */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Section 4: Shop Health Table -> 8 cols */}
        <div className="lg:col-span-8">
          <Card className="border border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle>Shop Health Table</CardTitle>
                <CardDescription>
                  Workflow status, efficiency rating, and delay reports across shops.
                </CardDescription>
              </div>
              <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 border border-emerald-100 font-bold px-2.5 py-1 rounded-lg uppercase">
                All Active Shops
              </span>
            </CardHeader>
            <CardContent className="p-0">
              <ResponsiveTableWrapper>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-y border-slate-100 bg-slate-50/50 text-slate-400 font-mono text-[9px] uppercase tracking-wider">
                      <th className="py-3 px-5 font-semibold text-slate-500">Shop Station</th>
                      <th className="py-3 px-4 font-semibold text-slate-500">Supervisor</th>
                      <th className="py-3 px-4 font-semibold text-slate-500 text-center">Active Locos</th>
                      <th className="py-3 px-4 font-semibold text-slate-400 text-center">Delayed</th>
                      <th className="py-3 px-5 font-semibold text-slate-500 text-center">Efficiency</th>
                      <th className="py-3 px-5 font-semibold text-slate-500 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SHOP_HEALTH_ROWS.map((row, idx) => (
                      <tr 
                        key={idx} 
                        className="border-b last:border-0 border-slate-100 hover:bg-slate-50/30 transition-colors text-xs text-slate-600"
                      >
                        <td className="py-3 px-5 font-semibold text-slate-900">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-3.5 w-3.5 text-slate-400" />
                            <span>{row.shop}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-500 font-medium">{row.supervisor}</td>
                        <td className="py-3 px-4 text-center font-bold text-slate-800">{row.activeLocos}</td>
                        <td className="py-3 px-4 text-center">
                          {row.delayed > 0 ? (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold text-rose-500 bg-rose-50 px-1.5 py-0.25 rounded">
                              {row.delayed} delayed
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-medium">0</span>
                          )}
                        </td>
                        <td className="py-3 px-5 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <span className="font-bold text-slate-700 font-mono">{row.efficiency}%</span>
                            <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-slate-800 rounded-full" 
                                style={{ width: `${row.efficiency}%` }} 
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-5 text-right font-medium">
                          <span className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                            row.status === "Optimal" 
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                              : "bg-amber-50 text-amber-700 border border-amber-100"
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${row.status === "Optimal" ? "bg-emerald-500" : "bg-amber-500"}`} />
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ResponsiveTableWrapper>
            </CardContent>
          </Card>
        </div>

        {/* Section 5: Recent Activity Feed -> 4 cols */}
        <div className="lg:col-span-4">
          <Card className="border border-slate-200 flex flex-col h-full max-h-[500px]">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <History className="h-4.5 w-4.5 text-slate-500" />
                <CardTitle>Recent Activity Feed</CardTitle>
              </div>
              <CardDescription>
                Plant logs, transition events, and registry changes.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto px-4 py-2 pt-3 divide-y divide-slate-100">
              {RECENT_ACTIVITIES.map((activity) => (
                <div key={activity.id} className="py-3 flex items-start gap-3 first:pt-0 last:pb-0">
                  <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                    activity.type === "delay" ? "bg-rose-50 text-rose-600 border border-rose-100" :
                    activity.type === "complete" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                    activity.type === "move" ? "bg-indigo-50 text-indigo-600 border border-indigo-150" :
                    activity.type === "achievement" ? "bg-amber-50 text-amber-600 border border-amber-150" :
                    "bg-slate-50 text-slate-500"
                  }`}>
                    {activity.type === "complete" || activity.type === "dispatch" ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : activity.type === "delay" ? (
                      <AlertTriangle className="h-3 w-3" />
                    ) : activity.type === "achievement" ? (
                      <Sparkles className="h-3 w-3" />
                    ) : (
                      <Clock className="h-3 w-3" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-700 leading-tight">
                      {activity.text}
                    </p>
                    <span className="text-[10px] text-slate-400 font-medium mt-1 inline-block">
                      {activity.time}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Section 6: Critical Alerts Panel (Warning cards) */}
      <div>
        <div className="mb-4">
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <AlertTriangle className="h-4.5 w-4.5 text-rose-500" />
            Critical Alerts Panel
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time machine faults, safety stops, and supply blockages awaiting administrative bypass.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CRITICAL_ALERTS.map((alert, index) => (
            <div 
              key={index} 
              className={`rounded-xl border p-4 shadow-3xs hover:shadow-2xs transition-all flex flex-col justify-between ${
                alert.severity === "danger" 
                  ? "bg-rose-50/50 border-rose-200 text-rose-950" 
                  : alert.severity === "warning" 
                  ? "bg-amber-50/50 border-amber-200 text-amber-950" 
                  : alert.severity === "caution"
                  ? "bg-indigo-50/30 border-slate-200 text-slate-950"
                  : "bg-slate-50 border-slate-200 text-slate-950"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${
                      alert.severity === "danger" ? "bg-rose-500 animate-ping" : 
                      alert.severity === "warning" ? "bg-amber-500" : 
                      alert.severity === "caution" ? "bg-indigo-500" : "bg-slate-400"
                    }`} />
                    {alert.title}
                  </h3>
                  <span className="text-[9px] font-mono font-bold bg-white/80 border border-slate-200 px-2 py-0.25 rounded-md uppercase">
                    {alert.severity === "danger" ? "Critical" : alert.severity === "warning" ? "High" : "Medium"}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-3 font-medium">
                  {alert.detail}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2.5 border-t border-slate-200/45 text-[10px] font-semibold text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-slate-400" />
                  {alert.time}
                </span>
                <button className="text-indigo-600 hover:text-indigo-900 border border-slate-200 px-2 py-0.5 rounded bg-white hover:bg-slate-50 shadow-3xs cursor-pointer">
                  Acknowledge
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
