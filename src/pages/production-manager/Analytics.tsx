import React, { useState } from "react";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { 
  Building2, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Activity, 
  Calendar, 
  Layers, 
  Database,
  Briefcase,
  HelpCircle,
  FileSpreadsheet,
  Download,
  Filter
} from "lucide-react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  Button 
} from "../../routes.tsx";
import { ManagerPageHeader } from "./ProductionManagerDashboard.tsx";

// Chart 1: Monthly Production Trend (Jan - Jun)
const MONTHLY_PRODUCTION_DATA = [
  { month: "Jan", target: 12, actual: 11 },
  { month: "Feb", target: 15, actual: 16 },
  { month: "Mar", target: 14, actual: 12 },
  { month: "Apr", target: 18, actual: 19 },
  { month: "May", target: 16, actual: 15 },
  { month: "Jun", target: 20, actual: 21 }
];

// Chart 2: Shop Efficiency Trend Curves
const SHOP_EFFICIENCY_TREND_DATA = [
  { shop: "Frame Fab.", avgScore: 95, previousScore: 92 },
  { shop: "Bogie Shop", avgScore: 91, previousScore: 89 },
  { shop: "Shell Assm.", avgScore: 88, previousScore: 85 },
  { shop: "Elec. Assm.", avgScore: 82, previousScore: 84 },
  { shop: "Brake Shop", avgScore: 90, previousScore: 88 },
  { shop: "Paint Shop", avgScore: 86, previousScore: 85 },
  { shop: "Testing", avgScore: 93, previousScore: 91 },
  { shop: "Dispatch", avgScore: 97, previousScore: 95 }
];

// Chart 3: Delay Trend
const DELAY_TREND_DATA = [
  { month: "Jan", mechanical: 15, supplyChain: 25 },
  { month: "Feb", mechanical: 10, supplyChain: 20 },
  { month: "Mar", mechanical: 20, supplyChain: 35 },
  { month: "Apr", mechanical: 8, supplyChain: 12 },
  { month: "May", mechanical: 12, supplyChain: 23 },
  { month: "Jun", mechanical: 4, supplyChain: 10 }
];

// Chart 4: Completion Forecast for next 6 weeks
const COMPLEX_OUTFLOW_FORECAST = [
  { week: "Week 26", projected: 5, confidenceLower: 4, confidenceUpper: 6 },
  { week: "Week 27", projected: 6, confidenceLower: 5, confidenceUpper: 7 },
  { week: "Week 28", projected: 8, confidenceLower: 6, confidenceUpper: 9 },
  { week: "Week 29", projected: 7, confidenceLower: 5, confidenceUpper: 8 },
  { week: "Week 30", projected: 9, confidenceLower: 7, confidenceUpper: 10 },
  { week: "Week 31", projected: 10, confidenceLower: 8, confidenceUpper: 11 }
];

// Chart 5: Workload Distribution (Active locos across shops)
const WORKLOAD_DISTRIBUTION_DATA = [
  { name: "Structural Fabrication", value: 5, color: "#4f46e5" },
  { name: "Heavy Assembly", value: 6, color: "#10b981" },
  { name: "Electrical Controls", value: 3, color: "#3b82f6" },
  { name: "Pneumatics & Test", value: 3, color: "#f59e0b" },
  { name: "Finishing & Logistics", value: 1, color: "#64748b" }
];

// Chart 6: Shop Comparison Scheduled Targets vs Actual outputs (YTD)
const SHOP_COMPARISON_DATA = [
  { shopName: "Line-1 (Fab)", targeted: 75, actualOut: 72 },
  { shopName: "Line-2 (Bogie)", targeted: 80, actualOut: 78 },
  { shopName: "Line-3 (Shell)", targeted: 72, actualOut: 69 },
  { shopName: "Line-4 (Elec)", targeted: 68, actualOut: 61 },
  { shopName: "Line-5 (Brake)", targeted: 70, actualOut: 70 },
  { shopName: "Line-6 (Paint)", targeted: 65, actualOut: 63 }
];

export default function Analytics() {
  const [forecastLevel, setForecastLevel] = useState("standard");

  const triggerExportAnalytics = () => {
    alert("Exporting Executive Analytics dossier containing cross-workshop metrics, forecasting logs, and workload models.");
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Navigation Header */}
      <ManagerPageHeader activeTab="analytics" />

      {/* TOP ANALYTICS BRIEF BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-5 bg-white border border-slate-200 rounded-xl gap-4">
        <div className="flex items-center gap-3">
          <span className="p-3 bg-indigo-50 text-indigo-700 rounded-full shrink-0">
            <TrendingUp className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest font-mono">Executive Analytics Console</h2>
            <p className="text-xs text-slate-400 mt-0.5">High-fidelity predictive math models and YTD shop benchmarking curves.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-stretch sm:self-center shrink-0">
          <Button onClick={triggerExportAnalytics} className="bg-slate-900 border-slate-900 text-white font-bold h-9">
            <Download className="h-3.5 w-3.5 mr-1" /> PDF Executive Dossier
          </Button>
        </div>
      </div>

      {/* MAIN BENTO CHART GRID (6 CHARTS) */}
      <div className="grid gap-6 md:grid-cols-12">
        
        {/* CHART 1: MONTHLY PRODUCTION TREND (md:col-span-6) */}
        <div className="md:col-span-6">
          <Card className="bg-white border border-slate-200 h-full">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-xs uppercase font-bold text-slate-400 tracking-wider font-mono">
                1. Monthly Production Trend (Targets vs Rollouts)
              </CardTitle>
              <CardDescription>
                Linear tracking of monthly target parameters compared to historical unit rollouts.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-4">
              <div className="h-64 w-full -ml-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={MONTHLY_PRODUCTION_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: "11px", background: "#0f172a", border: "none", color: "white" }} />
                    <Line type="monotone" dataKey="target" stroke="#4f46e5" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              {/* Custom Legend */}
              <div className="flex justify-center gap-5 pt-3 border-t border-slate-100 text-xs font-mono text-slate-500">
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-indigo-600" /> Scheduled Targets</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Plant Rollouts YTD</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CHART 2: SHOP EFFICIENCY TREND (md:col-span-6) */}
        <div className="md:col-span-6">
          <Card className="bg-white border border-slate-200 h-full">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-xs uppercase font-bold text-slate-400 tracking-wider font-mono">
                2. Continuous Shop Efficiency Scoring Curves
              </CardTitle>
              <CardDescription>
                Comparison of current average shop index rating scores against previous quarter outputs.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-4">
              <div className="h-64 w-full -ml-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={SHOP_EFFICIENCY_TREND_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="shop" stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <YAxis domain={[50, 100]} stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: "11px", background: "#0f172a", border: "none", color: "white" }} />
                    <Line type="monotone" dataKey="avgScore" stroke="#4f46e5" strokeWidth={2.5} label="Current" />
                    <Line type="monotone" dataKey="previousScore" stroke="#94a3b8" strokeDasharray="5 5" label="Previous" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-5 pt-3 border-t border-slate-100 text-xs font-mono text-slate-500">
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-indigo-600" /> Current Quarter Average</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-slate-350" /> Previous Quarter Baseline</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CHART 3: DELAY TREND (md:col-span-6) */}
        <div className="md:col-span-6">
          <Card className="bg-white border border-slate-200 h-full">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-xs uppercase font-bold text-slate-400 tracking-wider font-mono">
                3. Incident Loss Trend Hourly breakdown
              </CardTitle>
              <CardDescription>
                Categorized hours lost to mechanical faults vs supply stockouts over time.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-4">
              <div className="h-64 w-full -ml-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={DELAY_TREND_DATA}>
                    <defs>
                      <linearGradient id="mechGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="supplyGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: "11px", background: "#0f172a", border: "none", color: "white" }} />
                    <Area type="monotone" dataKey="mechanical" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#mechGrad)" />
                    <Area type="monotone" dataKey="supplyChain" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#supplyGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-5 pt-3 border-t border-slate-100 text-xs font-mono text-slate-500">
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Mechanical Failures</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-red-500" /> Supply Chain Backlogs</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CHART 4: COMPLETION FORECAST (md:col-span-6) */}
        <div className="md:col-span-6">
          <Card className="bg-white border border-slate-200 h-full">
            <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-xs uppercase font-bold text-slate-400 tracking-wider font-mono">
                  4. Predictive Output Outflow Forecast (Confidence Matrix)
                </CardTitle>
                <CardDescription>
                  Forecasting weekly unit dispatches utilizing Bayesian historical velocity.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-4">
              <div className="h-64 w-full -ml-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={COMPLEX_OUTFLOW_FORECAST}>
                    <defs>
                      <linearGradient id="forecastColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="week" stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: "11px", background: "#0f172a", border: "none", color: "white" }} />
                    <Area type="monotone" dataKey="confidenceUpper" stroke="transparent" fill="#3b82f6" fillOpacity={0.08} />
                    <Area type="monotone" dataKey="projected" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#forecastColor)" />
                    <Area type="monotone" dataKey="confidenceLower" stroke="transparent" fill="#3b82f6" fillOpacity={0.08} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-5 pt-3 border-t border-slate-100 text-xs font-mono text-slate-500">
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-blue-500" /> Projected Outflow (Locos)</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-5 bg-blue-500/10 rounded" /> 95% Confidence Intervals</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CHART 5: WORKLOAD DISTRIBUTION (md:col-span-6) */}
        <div className="md:col-span-6">
          <Card className="bg-white border border-slate-200 h-full">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-xs uppercase font-bold text-slate-400 tracking-wider font-mono">
                5. Active Workload Resource Distribution %
              </CardTitle>
              <CardDescription>
                Proportionate allocation of personnel and active locomotive setups on site.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-4 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="h-56 w-full max-w-[200px] relative shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={WORKLOAD_DISTRIBUTION_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {WORKLOAD_DISTRIBUTION_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} Units`, "Workload"]} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center caption */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <span className="text-lg font-black text-slate-900">18 Locos</span>
                  <span className="text-[9px] text-slate-400 tracking-wider font-bold font-mono">TOTAL WIP</span>
                </div>
              </div>

              {/* Legends list */}
              <div className="flex-grow space-y-2.5 w-full">
                {WORKLOAD_DISTRIBUTION_DATA.map((item) => (
                  <div key={item.name} className="flex items-center justify-between p-2 bg-slate-50 border border-slate-100 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-[11px] font-bold text-slate-650 truncate w-28 block">{item.name}</span>
                    </div>
                    <span className="font-mono text-xs font-black text-slate-900">{item.value} Units</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CHART 6: SHOP COMPARISON (md:col-span-6) */}
        <div className="md:col-span-6">
          <Card className="bg-white border border-slate-200 h-full">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-xs uppercase font-bold text-slate-400 tracking-wider font-mono">
                6. Workshop Annual Comparison (Targets vs Deliveries)
              </CardTitle>
              <CardDescription>
                Scheduled target loads vs finished output dispatches across major operating lines.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-4">
              <div className="h-64 w-full -ml-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={SHOP_COMPARISON_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="shopName" stroke="#94a3b8" fontSize={9} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: "11px", background: "#0f172a", border: "none", color: "white" }} />
                    <Bar dataKey="targeted" fill="#4f46e5" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="actualOut" fill="#10b981" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-5 pt-3 border-t border-slate-100 text-xs font-mono text-slate-500">
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-indigo-650" /> Annual Target load</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Finished Output units</span>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
