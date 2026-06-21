import React, { useState } from "react";
import { 
  FileText, 
  Download, 
  Eye, 
  TrendingUp, 
  Calendar, 
  User, 
  CheckCircle, 
  RefreshCw, 
  Clock, 
  HelpCircle,
  TrendingDown,
  Filter,
  ArrowUpRight,
  Sparkles,
  BarChart2
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  CartesianGrid, 
  AreaChart, 
  Area 
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

// Mock History
interface ReportLog {
  id: string;
  name: string;
  generatedBy: string;
  date: string;
  format: "PDF" | "XLSX" | "CSV";
  status: "Completed" | "Pending" | "Failed";
}

const INITIAL_REPORT_HISTORY: ReportLog[] = [
  { id: "REP-0102", name: "Daily Assembly Status & Queue Load", generatedBy: "Suresh Sharma", date: "Today, 08:30 AM", format: "PDF", status: "Completed" },
  { id: "REP-0101", name: "Weekly Engine Production Velocity Index", generatedBy: "Ritik Dubey", date: "Yesterday, 04:15 PM", format: "XLSX", status: "Completed" },
  { id: "REP-0100", name: "Critical Component Delay Matrix Report", generatedBy: "Praveen Pandey", date: "June 18, 2026", format: "PDF", status: "Completed" },
  { id: "REP-0099", name: "Monthly Heavy Rolling Stock Rollover Log", generatedBy: "Aditya Patil", date: "June 17, 2026", format: "XLSX", status: "Completed" },
  { id: "REP-0098", name: "Shop Supervisor Health & Output metrics", generatedBy: "System automated daemon", date: "June 16, 2026", format: "CSV", status: "Completed" },
  { id: "REP-0097", name: "Brake & Pneumatic Line Safety Evaluation", generatedBy: "Neha Deshmukh", date: "June 15, 2026", format: "PDF", status: "Completed" },
  { id: "REP-0096", name: "Fabrication Machine Fault Diagnostics log", generatedBy: "Somnath Nair", date: "June 12, 2026", format: "CSV", status: "Failed" }
];

// Recharts data sets
const PRODUCTION_VELOCITY = [
  { week: "Wk 1", scheduled: 12, actual: 11 },
  { week: "Wk 2", scheduled: 15, actual: 16 },
  { week: "Wk 3", scheduled: 14, actual: 12 },
  { week: "Wk 4", scheduled: 18, actual: 19 },
  { week: "Wk 5", scheduled: 16, actual: 15 },
  { week: "Wk 6", scheduled: 20, actual: 21 }
];

const DELAY_HOURS_LOG = [
  { month: "Jan", mechanical: 45, supplyChain: 80, electrical: 30 },
  { month: "Feb", mechanical: 30, supplyChain: 65, electrical: 55 },
  { month: "Mar", mechanical: 55, supplyChain: 40, electrical: 70 },
  { month: "Apr", mechanical: 20, supplyChain: 95, electrical: 40 },
  { month: "May", mechanical: 35, supplyChain: 55, electrical: 30 },
  { month: "Jun", mechanical: 10, supplyChain: 30, electrical: 20 }
];

const SHOP_EFFICIENCY_METRICS = [
  { shop: "Frame Fab.", score: 95 },
  { shop: "Bogie Shop", score: 91 },
  { shop: "Shell Assm.", score: 88 },
  { shop: "Elec. Assm.", score: 82 },
  { shop: "Brake Shop", score: 90 },
  { shop: "Paint Shop", score: 86 },
  { shop: "Testing", score: 93 },
  { shop: "Dispatch", score: 97 }
];

export default function Reports() {
  const [reportHistory, setReportHistory] = useState<ReportLog[]>(INITIAL_REPORT_HISTORY);
  const [selectedType, setSelectedType] = useState<string>("Daily Production Report");

  // Top Card values
  const dailyGeneratedCount = 4;
  const weeklyGeneratedCount = 18;
  const monthlyGeneratedCount = 76;
  const totalReportsCount = reportHistory.length;

  const handleCreateReport = () => {
    const defaultAuthor = "Praveen Pandey";
    const dateFormatted = "Just Now";
    const newReport: ReportLog = {
      id: `REP-0${103 + reportHistory.length}`,
      name: `${selectedType} [System Compiled Query]`,
      generatedBy: defaultAuthor,
      date: dateFormatted,
      format: "PDF",
      status: "Completed"
    };

    setReportHistory([newReport, ...reportHistory]);
    alert(`${selectedType} generated successfully. Added to report log and queue list below.`);
  };

  const handleDownload = (name: string, format: string) => {
    alert(`Initiating secure high-speed downstream transfer of report: "${name}" as format: .${format.toLowerCase()}`);
  };

  return (
    <div className="space-y-6">
      {/* Header Profile */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Reports Center</h1>
          <p className="text-xs text-slate-400 mt-0.5">Compile systemic fabrication parameters, delay analysis, and rolling stock diagnostics.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => alert("Re-sync report queue database")} className="bg-white">
            <RefreshCw className="h-3.5 w-3.5 text-slate-400 mr-1" /> Re-sync Stack
          </Button>
        </div>
      </div>

      {/* TOP KPI STRIP */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* Daily Reports */}
        <Card className="bg-white border-l-4 border-l-slate-800">
          <CardHeader className="p-4 flex flex-row items-center justify-between pb-1 space-y-0">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Daily Reports</span>
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
              <Calendar className="h-3.5 w-3.5" />
            </span>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="text-2xl font-bold text-slate-900">{dailyGeneratedCount}</div>
            <p className="text-[10px] text-slate-400 mt-0.5">Logs generated today</p>
          </CardContent>
        </Card>

        {/* Weekly Reports */}
        <Card className="bg-white border-l-4 border-l-indigo-600">
          <CardHeader className="p-4 flex flex-row items-center justify-between pb-1 space-y-0">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Weekly Reports</span>
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-750">
              <TrendingUp className="h-3.5 w-3.5" />
            </span>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="text-2xl font-bold text-slate-900">{weeklyGeneratedCount}</div>
            <p className="text-[10px] text-indigo-600 font-semibold mt-0.5">Cycles logged this week</p>
          </CardContent>
        </Card>

        {/* Monthly Reports */}
        <Card className="bg-white border-l-4 border-l-teal-600">
          <CardHeader className="p-4 flex flex-row items-center justify-between pb-1 space-y-0">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Monthly Reports</span>
            <span className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="text-2xl font-bold text-slate-900">{monthlyGeneratedCount}</div>
            <p className="text-[10px] text-teal-600 font-semibold mt-0.5">Enterprise summary cache</p>
          </CardContent>
        </Card>

        {/* Total Reports */}
        <Card className="bg-white border-l-4 border-l-rose-500">
          <CardHeader className="p-4 flex flex-row items-center justify-between pb-1 space-y-0">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Generated Logs</span>
            <span className="p-1.5 rounded-lg bg-slate-100 text-slate-800">
              <FileText className="h-3.5 w-3.5" />
            </span>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="text-2xl font-bold text-slate-900">{totalReportsCount}</div>
            <p className="text-[10px] text-slate-400 mt-0.5">History cache database files</p>
          </CardContent>
        </Card>
      </div>

      {/* COMPACT COMPILER SECTION */}
      <Card className="border border-slate-200 bg-white">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-900">Configure On-Demand Report Export</CardTitle>
          <CardDescription>Select a target system parameters profile and trigger live server database compilation.</CardDescription>
        </CardHeader>
        <CardContent className="p-5 flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 space-y-1.5 w-full">
            <label className="text-xs font-bold text-slate-500 uppercase font-mono">Select Report Parameters Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-slate-850 font-medium text-slate-800"
            >
              <option value="Daily Production Report">Daily Production Report (Shift summaries & line delays)</option>
              <option value="Weekly Production Report">Weekly Production Report (Plant wide throughput indexes)</option>
              <option value="Monthly Production Report">Monthly Production Report (HQ strategic projection sheet)</option>
              <option value="Shop Performance Report">Shop Performance Report (Supervisor efficiencies & machine downtime)</option>
              <option value="Delay Analysis Report">Delay Analysis Report (Supply chain backlog & bottleneck warnings)</option>
            </select>
          </div>

          <Button 
            onClick={handleCreateReport} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white h-10 px-5 text-xs uppercase font-bold shrink-0 shadow-xs"
          >
            <BarChart2 className="h-4 w-4 mr-1.5" /> Compile & Register Report
          </Button>
        </CardContent>
      </Card>

      {/* CHARTS GRAPH SECTION */}
      <div className="grid gap-6 md:grid-cols-12">
        {/* Chart 1: Production trend */}
        <div className="md:col-span-4">
          <Card className="border border-slate-200 h-full">
            <CardHeader className="pb-1">
              <CardTitle className="text-xs uppercase font-bold text-slate-400 tracking-wider font-mono">1. Production Trend</CardTitle>
              <CardDescription>Scheduled vs rollouts over week indices.</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-48 w-full -ml-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={PRODUCTION_VELOCITY}>
                    <defs>
                      <linearGradient id="colorSched" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorAct" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0d9488" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="week" stroke="#94a3b8" fontSize={9} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: "11px", background: "#0f172a", border: "none", borderRadius: "6px", color: "white" }} />
                    <Area type="monotone" dataKey="scheduled" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorSched)" />
                    <Area type="monotone" dataKey="actual" stroke="#0d9488" strokeWidth={2} fillOpacity={1} fill="url(#colorAct)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex gap-4 justify-center text-[10px] font-mono text-slate-500 pt-3 border-t border-slate-100">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-indigo-600" /> Scheduled targets</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-teal-600" /> Actual rollouts</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart 2: Delay Trend */}
        <div className="md:col-span-4">
          <Card className="border border-slate-200 h-full">
            <CardHeader className="pb-1">
              <CardTitle className="text-xs uppercase font-bold text-slate-400 tracking-wider font-mono">2. Delay Trend Hours</CardTitle>
              <CardDescription>Major downtime triggers across calendar log.</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-48 w-full -ml-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={DELAY_HOURS_LOG}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={9} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: "11px", background: "#0f172a", border: "none", borderRadius: "6px", color: "white" }} />
                    <Bar dataKey="mechanical" stackId="a" fill="#0f172a" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="supplyChain" stackId="a" fill="#fbbf24" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="electrical" stackId="a" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-[8px] font-mono text-slate-500 pt-3 border-t border-slate-100">
                <span className="truncate flex items-center justify-center gap-1"><span className="h-2 w-2 rounded-full bg-slate-900" /> Mech. Faults</span>
                <span className="truncate flex items-center justify-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-400" /> Supply delay</span>
                <span className="truncate flex items-center justify-center gap-1"><span className="h-2 w-2 rounded-full bg-indigo-500" /> Elec. issues</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart 3: Efficiency Trend */}
        <div className="md:col-span-4">
          <Card className="border border-slate-200 h-full">
            <CardHeader className="pb-1">
              <CardTitle className="text-xs uppercase font-bold text-slate-400 tracking-wider font-mono">3. Efficiency Benchmark %</CardTitle>
              <CardDescription>Comparative workshop index score ratings.</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-48 w-full -ml-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={SHOP_EFFICIENCY_METRICS}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="shop" stroke="#94a3b8" fontSize={8} tickLine={false} />
                    <YAxis domain={[50, 100]} stroke="#94a3b8" fontSize={9} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: "11px", background: "#0f172a", border: "none", borderRadius: "6px", color: "white" }} />
                    <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2.5} dot={{ stroke: '#059669', strokeWidth: 1.5, r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex gap-4 justify-center text-[10px] font-mono text-slate-500 pt-3 border-t border-slate-100 font-bold">
                <div className="flex items-center gap-1 text-emerald-600">
                  <TrendingUp className="h-3 w-3" /> Average Efficiency Load: 90.2%
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* REPORT HISTORY TABLE */}
      <Card className="border border-slate-200">
        <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle>Report Compilation Log</CardTitle>
            <CardDescription>View, audit, or download previously compiled workspace report sheets.</CardDescription>
          </div>
          <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 uppercase rounded border border-emerald-100">
            Database Sync Live
          </span>
        </CardHeader>
        <CardContent className="p-0">
          <ResponsiveTableWrapper>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[9px] font-mono uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-5 font-semibold">Report Reference & Title</th>
                  <th className="py-3 px-4 font-semibold">Compiled By Identity</th>
                  <th className="py-3 px-4 font-semibold">Generation Date</th>
                  <th className="py-3 px-4 font-semibold text-center">Format</th>
                  <th className="py-3 px-4 font-semibold text-center">Engine Status</th>
                  <th className="py-3 px-5 font-semibold text-right">Actions Action Panel</th>
                </tr>
              </thead>
              <tbody>
                {reportHistory.map((report) => (
                  <tr 
                    key={report.id}
                    className="border-b last:border-0 border-slate-100 hover:bg-slate-50/20 text-xs text-slate-600 transition-colors"
                  >
                    {/* ID & Title */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 text-slate-600 rounded">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-slate-900 truncate">{report.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono mt-0.5">{report.id}</span>
                        </div>
                      </div>
                    </td>

                    {/* Compiled By */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-slate-800 font-semibold text-[11px]">
                        <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>{report.generatedBy}</span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-slate-500 font-medium font-mono text-[10px]">{report.date}</td>

                    {/* Format with stylized tags */}
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase font-mono ${
                        report.format === "PDF" ? "bg-red-50 text-red-700 border border-red-100" :
                        report.format === "XLSX" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                        "bg-indigo-50 text-indigo-700 border border-indigo-100"
                      }`}>
                        {report.format}
                      </span>
                    </td>

                    {/* Engine status */}
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                        report.status === "Completed" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                        "bg-rose-50 text-rose-700 border border-rose-100"
                      }`}>
                        <span className={`h-1 w-1 rounded-full ${report.status === "Completed" ? "bg-emerald-500" : "bg-rose-500"}`} />
                        {report.status}
                      </span>
                    </td>

                    {/* Action triggers */}
                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          className="h-8 px-2 text-slate-600"
                          onClick={() => alert(`Review Mode:\nReport: ${report.name}\nGenerated By: ${report.generatedBy}\nRegistered: ${report.date}\nStatus: Compiled Successful`)}
                          title="View on screen preview"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          className="h-8 px-2 text-indigo-600 hover:text-indigo-800"
                          onClick={() => handleDownload(report.name, "PDF")}
                          title="Download Acrobat PDF Document"
                        >
                          <Download className="h-3.5 w-3.5 text-red-500" /> PDF
                        </Button>
                        <Button 
                          variant="ghost" 
                          className="h-8 px-2 text-emerald-600 hover:text-emerald-800"
                          onClick={() => handleDownload(report.name, "XLSX")}
                          title="Download Excel Spreadsheet File"
                        >
                          <Download className="h-3.5 w-3.5 text-emerald-600" /> Excel
                        </Button>
                      </div>
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
