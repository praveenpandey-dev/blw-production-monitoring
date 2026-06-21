import React, { useState, useEffect } from "react";
import { getHistory, HistoryItem } from "./mockData.ts";
import { useAuth } from "../../context/AuthContext.tsx";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../routes.tsx";
import { ResponsiveTableWrapper } from "../../components/ResponsiveTableWrapper.tsx";
import { 
  Building, 
  History as HistIcon, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  SlidersHorizontal,
  Workflow,
  CalendarCheck,
  CalendarDays
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

export default function HistoryPage() {
  const { user } = useAuth();
  const shopName = user?.shop || "Electrical Assembly Shop";

  const [historyList, setHistoryList] = useState<HistoryItem[]>([]);

  useEffect(() => {
    // Collect from local storage
    setHistoryList(getHistory());
  }, []);

  // Filter history belonging to this supervisor's shop!
  const shopHistory = historyList.filter(h => h.shop === shopName);

  // Recharts Monthly Completion Chart Data
  // Build a realistic distribution chart
  const monthlyCompletionData = [
    { month: "Jan 2026", LocosCount: 6 },
    { month: "Feb 2026", LocosCount: 8 },
    { month: "Mar 2026", LocosCount: 11 },
    { month: "Apr 2026", LocosCount: 14 },
    { month: "May 2026", LocosCount: 18 },
    { month: "Jun 2026", LocosCount: shopHistory.length > 0 ? 12 + shopHistory.length : 15 }
  ];

  const getResultBadgeColor = (res: string) => {
    switch (res) {
      case "Passed with Honours":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "Passed Quality Control":
      case "Certified":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "Minor Rework":
      case "Re-calibrated":
        return "bg-indigo-50 text-indigo-800 border-indigo-200";
      default:
        return "bg-slate-50 text-slate-850 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page header */}
      <div className="pb-3 border-b border-slate-100">
        <h1 className="text-2xl font-black text-slate-900 font-sans tracking-tight">Production History</h1>
        <p className="text-xs text-slate-500 mt-1">
          Archived record list of fully verified rolling stock and quality certifications logged under <span className="text-indigo-650 font-semibold">{shopName}</span>.
        </p>
      </div>

      {/* TOP CHARTS & STATISTICS GRID */}
      <div className="grid gap-6 lg:grid-cols-12">
        
        {/* Monthly Completion Area Chart */}
        <div className="lg:col-span-8">
          <Card className="bg-white border-slate-200">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-sm font-extrabold uppercase font-sans tracking-wide text-slate-900 flex items-center justify-between w-full">
                <span>Monthly Completion Volumes</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded font-mono">
                  YTD TRACTION TRACKER
                </span>
              </CardTitle>
              <CardDescription>
                Completed locos transitioned out of {shopName} to subsequent layout assembly blocks.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="h-56 sm:h-64 w-full mt-2 font-mono text-[11px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyCompletionData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorLocos" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" tickLine={false} />
                    <YAxis stroke="#64748b" tickLine={false} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} />
                    <Area type="monotone" dataKey="LocosCount" stroke="#10b981" fillOpacity={1} fill="url(#colorLocos)" strokeWidth={2.5} name="Locomotives Completed" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Stats Timeline Summary Card */}
        <div className="lg:col-span-4">
          <Card className="bg-slate-900 border-slate-800 text-slate-200 h-full">
            <CardHeader className="border-b border-slate-800 pb-4">
              <CardTitle className="text-xs uppercase font-extrabold text-indigo-400 tracking-wider font-mono">
                Shop Summary Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 space-y-4.5">
              
              {/* Dynamic counters */}
              <div className="grid grid-cols-2 gap-3.5 font-mono">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-850">
                  <span className="text-[8.5px] text-slate-500 block uppercase font-bold">Total Dispatched</span>
                  <span className="text-2xl font-black text-white mt-1 block">{shopHistory.length}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-850">
                  <span className="text-[8.5px] text-slate-500 block uppercase font-bold font-bold text-amber-500">Quality Rating</span>
                  <span className="text-2xl font-black text-amber-500 mt-1 block">98.4%</span>
                </div>
              </div>

              <div className="space-y-3.5 pt-2">
                <h4 className="text-[10px] font-black uppercase text-slate-500 font-mono tracking-wider">Historical Timeline Rules</h4>
                <div className="text-xs text-slate-350 space-y-2 leading-relaxed">
                  <p>
                    All historical transactions are archived representing <strong className="text-white">COSMIC ISO-9001</strong> manufacturing criteria standards.
                  </p>
                  <p>
                    Certifications shown below are verified physically on-site by registered safety inspectors using non-destructive weld diagnostics.
                  </p>
                </div>
              </div>

              <div className="pt-2 p-3 bg-emerald-950/20 text-emerald-400 font-mono text-[10.5px] rounded-lg border border-emerald-950/50 flex items-start gap-2">
                <CalendarCheck className="h-4 w-4 mt-0.5 shrink-0 text-emerald-355" />
                <div>
                  <strong className="text-white">Regulatory Acceptance Lock</strong>
                  <p className="mt-0.5 text-slate-300 leading-normal">
                    Archived data is locked from modification once uploaded onto the Rail Board.
                  </p>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>

      </div>

      {/* HISTORIC ARCHIVES DATA TABLE */}
      <Card className="bg-white border-slate-200">
        <CardHeader className="border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 gap-4">
          <div>
            <CardTitle className="text-sm font-extrabold uppercase font-sans tracking-wide text-slate-900 flex items-center gap-1.5">
              <HistIcon className="h-4 w-4 text-slate-500" /> Historic Completeness Archival
            </CardTitle>
            <CardDescription>
              Archive log list of finished locos processed under {shopName}.
            </CardDescription>
          </div>
          <span className="text-[10px] font-bold bg-slate-50 text-slate-500 px-2.5 py-1 rounded-md border border-slate-150 font-mono">
            {shopHistory.length} ARCHIVED ENTRIES
          </span>
        </CardHeader>
        <CardContent className="p-0">
          {shopHistory.length === 0 ? (
            <div className="p-12 text-center text-slate-400 font-sans text-xs">
              <Workflow className="h-10 w-10 mx-auto text-slate-350 mb-3" />
              Change user presets in Login or process finished rolling stocks in "Update Progress" to construct dynamic timeline.
            </div>
          ) : (
            <ResponsiveTableWrapper>
              <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-450 tracking-wider">
                  <th className="py-3.5 px-4 font-mono">Locomotive Number</th>
                  <th className="py-3.5 px-4">Completed Task / Operation</th>
                  <th className="py-3.5 px-4">Duration</th>
                  <th className="py-3.5 px-4">Completion Date</th>
                  <th className="py-3.5 px-4">Quality & Test Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {shopHistory.map((hist) => (
                  <tr key={hist.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono">
                      <div>
                        <span className="font-extrabold text-slate-900 block">{hist.locoNumber}</span>
                        <span className="text-[9px] font-bold text-slate-450 block italic">{hist.locoClass} Model</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-850">
                      {hist.task}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-600">
                      {hist.duration}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-550 flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      {hist.completionDate}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[8.5px] font-black uppercase border font-mono ${getResultBadgeColor(hist.result)}`}>
                        {hist.result}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ResponsiveTableWrapper>
        )}
      </CardContent>
      </Card>

    </div>
  );
}
