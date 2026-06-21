import React, { useState, useEffect } from "react";
import { 
  getLocomotives, 
  getPendingActivities, 
  getRecentActivities, 
  Locomotive 
} from "./mockData.ts";
import { useAuth } from "../../context/AuthContext.tsx";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  Button 
} from "../../routes.tsx";
import { ResponsiveTableWrapper } from "../../components/ResponsiveTableWrapper.tsx";
import { 
  Train as LocoIcon, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Zap, 
  ListTodo, 
  History, 
  Filter, 
  ArrowRight,
  TrendingUp,
  SlidersHorizontal
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Link, useNavigate } from "react-router-dom";

export default function ShopSupervisorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const shopName = user?.shop || "Electrical Assembly Shop";
  
  // Map shop name to Supervisor Role dynamically as per guidelines:
  // Frame Fabrication Shop -> Frame Supervisor
  // Bogie Shop -> Bogie Supervisor
  // Paint Shop -> Paint Supervisor
  // Testing Center -> Testing Supervisor
  // Dispatch Center -> Dispatch Supervisor
  const getSupervisorRoleTitle = (shop: string): string => {
    switch (shop) {
      case "Frame Fabrication Shop":
        return "Frame Supervisor";
      case "Bogie Shop":
        return "Bogie Supervisor";
      case "Paint Shop":
        return "Paint Supervisor";
      case "Testing Center":
        return "Testing Supervisor";
      case "Dispatch Center":
        return "Dispatch Supervisor";
      case "Shell Assembly Shop":
        return "Shell Supervisor";
      case "Electrical Assembly Shop":
        return "Electrical Supervisor";
      case "Brake & Pneumatic Shop":
        return "Brake Supervisor";
      default:
        return "Shop Supervisor";
    }
  };

  const supervisorRole = getSupervisorRoleTitle(shopName);

  const [locomotives, setLocomotives] = useState<Locomotive[]>([]);
  const [pendingActivities, setPendingActivities] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    // Read from the shared mock registry
    const list = getLocomotives();
    setLocomotives(list);
    setPendingActivities(getPendingActivities(shopName));
    setRecentActivities(getRecentActivities(shopName));
  }, [shopName]);

  // Filter locomotives belonging directly to this supervisor's shop
  const shopLocos = locomotives.filter(l => l.shop === shopName);

  // Calculate high quality dynamic metrics for current shop
  const assignedLocosCount = shopLocos.length;
  const completedTodayCount = shopLocos.filter(l => l.status === "Completed" || l.progress === 100).length;
  const pendingWorkCount = shopLocos.filter(l => l.status === "In Progress" || l.status === "On Schedule").length;
  const delayedTasksCount = shopLocos.filter(l => l.status === "Delayed").length;

  // Efficiency calculation logic: Based on average progress minus delayed counts
  const shopEfficiency = assignedLocosCount > 0 
    ? Math.min(100, Math.round(
        (shopLocos.reduce((acc, curr) => acc + curr.progress, 0) / assignedLocosCount) * 0.9 + 
        (10 - delayedTasksCount * 2)
      ))
    : 85; 

  // Recharts Chart Data: status distribution for this shop
  const chartData = [
    { name: "Completed", value: completedTodayCount, color: "#10b981" },
    { name: "On Schedule", value: shopLocos.filter(l => l.status === "On Schedule" && l.progress < 100).length, color: "#3b82f6" },
    { name: "In Progress", value: shopLocos.filter(l => l.status === "In Progress" && l.progress < 100).length, color: "#6366f1" },
    { name: "Delayed", value: delayedTasksCount, color: "#ef4444" }
  ].filter(item => item.value > 0);

  // Fallback if data is empty for a newly assigned shop with no locomotives
  const barChartData = [
    { stage: "Stage 1: Assembly", Target: 90, Actual: shopEfficiency },
    { stage: "Stage 2: Wiring", Target: 85, Actual: Math.max(40, shopEfficiency - 12) },
    { stage: "Stage 3: Calib.", Target: 95, Actual: Math.max(50, shopEfficiency - 5) },
    { stage: "Stage 4: Testing", Target: 90, Actual: Math.max(30, shopEfficiency - 20) }
  ];

  return (
    <div className="space-y-6">
      {/* Dynamic Header */}
      <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-gradient-to-br from-indigo-500/10 to-amber-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider border border-emerald-500/30 font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Supervisor Desk Active
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-sans">
              Shop Operations Dashboard
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Dynamically monitoring <span className="text-amber-400 font-bold font-mono">{shopName}</span>. 
              Review the daily work queue, file status reports, update stage completion progress, and track latency metrics.
            </p>

            {/* Dynamic Relation Mapping Badges illustrating role & shop alignment */}
            <div className="flex flex-wrap items-center gap-2.5 mt-3 pt-3 border-t border-slate-800/80 text-xs">
              <div className="inline-flex flex-col px-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-300">
                <span className="text-[9px] text-slate-500 uppercase tracking-widest font-mono">Supervisor Role</span>
                <span className="text-xs font-extrabold text-indigo-400 font-sans mt-0.5">{supervisorRole}</span>
              </div>
              <span className="text-slate-500 font-mono text-sm font-bold">→</span>
              <div className="inline-flex flex-col px-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-300">
                <span className="text-[9px] text-slate-500 uppercase tracking-widest font-mono">Assigned Operations Shop</span>
                <span className="text-xs font-extrabold text-amber-400 font-sans mt-0.5">{shopName}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 shrink-0">
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-emerald-500 text-slate-950 font-black text-sm tracking-widest font-mono">
              {user?.name.split(" ").map(n => n[0]).join("") || "SV"}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-150">{user?.name || "Chief Supervisor"}</div>
              <div className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider font-mono">
                {supervisorRole}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TOP KPI CARDS */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        {/* Assigned Locomotives */}
        <Card className="border-l-4 border-l-blue-500 p-4 bg-white shadow-xs">
          <CardHeader className="p-0 flex flex-row items-center justify-between pb-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Assigned Locos</span>
            <LocoIcon className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent className="p-0 mt-3">
            <div className="text-3xl font-black text-slate-900 font-mono">
              {assignedLocosCount}
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Active under shop floor</p>
          </CardContent>
        </Card>

        {/* Completed Today */}
        <Card className="border-l-4 border-l-emerald-550 p-4 bg-white shadow-xs">
          <CardHeader className="p-0 flex flex-row items-center justify-between pb-1">
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest font-mono">Completed Today</span>
            <CheckCircle className="h-4 w-4 text-emerald-500 animate-bounce" />
          </CardHeader>
          <CardContent className="p-0 mt-3">
            <div className="text-3xl font-black text-emerald-700 font-mono">
              {completedTodayCount}
            </div>
            <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Ready for dispatch or handover</p>
          </CardContent>
        </Card>

        {/* Pending Work */}
        <Card className="border-l-4 border-l-indigo-600 p-4 bg-white shadow-xs">
          <CardHeader className="p-0 flex flex-row items-center justify-between pb-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Pending Work</span>
            <Clock className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent className="p-0 mt-3">
            <div className="text-3xl font-black text-slate-900 font-mono">
              {pendingWorkCount}
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Awaiting stage steps</p>
          </CardContent>
        </Card>

        {/* Delayed Tasks */}
        <Card className="border-l-4 border-l-red-500 p-4 bg-white shadow-xs">
          <CardHeader className="p-0 flex flex-row items-center justify-between pb-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono font-bold text-red-500">Delayed Tasks</span>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent className="p-0 mt-3">
            <div className="text-3xl font-black text-red-600 font-mono">
              {delayedTasksCount}
            </div>
            <p className="text-[10px] text-red-500 font-semibold mt-0.5">Critical blockers reported</p>
          </CardContent>
        </Card>

        {/* Shop Efficiency */}
        <Card className="border-l-4 border-l-amber-500 p-4 bg-white shadow-xs col-span-2 lg:col-span-1">
          <CardHeader className="p-0 flex flex-row items-center justify-between pb-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Shop Efficiency</span>
            <Zap className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent className="p-0 mt-3">
            <div className="text-3xl font-black text-amber-600 font-mono">
              {shopEfficiency}%
            </div>
            <div className="w-full bg-slate-100 h-1 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-amber-500 h-1 rounded-full" 
                style={{ width: `${shopEfficiency}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* THREE PANELS LAYOUT */}
      <div className="grid gap-6 lg:grid-cols-12">
        
        {/* LEFT COLUMN: 8 COLS */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* SECTION 1: Today's Work Queue */}
          <Card className="bg-white border-slate-200">
            <CardHeader className="border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 gap-4">
              <div>
                <CardTitle className="text-sm font-extrabold uppercase font-sans tracking-wide text-slate-900">
                  Today's Work Queue
                </CardTitle>
                <CardDescription>
                  List of locomotives currently occupying the bay for assembly operations.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Link to="/shop/assigned-locomotives">
                  <Button variant="outline" className="h-8 text-xs font-bold">
                    View All {assignedLocosCount} Locos
                  </Button>
                </Link>
                <Link to="/shop/update-progress">
                  <Button className="h-8 text-[11px] font-bold bg-slate-900 border-slate-950 text-white shrink-0">
                    Update Progress
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {shopLocos.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No locomotives currently assigned to <strong className="text-slate-605">{shopName}</strong>. 
                  Use quick preset bypass links in login, or wait for HQ dispatch schedules!
                </div>
              ) : (
                <ResponsiveTableWrapper>
                  <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-450 tracking-wider">
                      <th className="py-3.5 px-4 font-mono">Loco Number</th>
                      <th className="py-3.5 px-4">Current Task</th>
                      <th className="py-3.5 px-4">Progress</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {shopLocos.slice(0, 6).map((loco) => (
                      <tr key={loco.id} className="hover:bg-slate-50/55 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                          <div>
                            {loco.locoNumber}
                            <span className="ml-1.5 text-[8.5px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.25 rounded-md">
                              {loco.locoClass}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 font-medium truncate max-w-[200px]" title={loco.currentTask}>
                          {loco.currentTask}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden shrink-0">
                              <div 
                                className={`h-full rounded-full ${
                                  loco.status === "Delayed" ? "bg-red-500" : loco.status === "Completed" ? "bg-emerald-500" : "bg-indigo-650"
                                }`}
                                style={{ width: `${loco.progress}%` }}
                              />
                            </div>
                            <span className="font-mono text-[10px] font-bold text-slate-700">{loco.progress}%</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            loco.status === "Delayed" 
                              ? "bg-red-50 text-red-700 border border-red-100" 
                              : loco.status === "Completed"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : "bg-indigo-50 text-indigo-700 border border-indigo-100"
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${
                              loco.status === "Delayed" ? "bg-red-500 animate-ping" : loco.status === "Completed" ? "bg-emerald-500" : "bg-indigo-500"
                            }`} />
                            {loco.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Button 
                            variant="outline" 
                            className="h-7 text-[10.5px] py-1 px-2.5 font-bold"
                            onClick={() => {
                              navigate("/shop/update-progress", { state: { selectLocoId: loco.id } });
                            }}
                          >
                            Update
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ResponsiveTableWrapper>
            )}
          </CardContent>
          </Card>

          {/* SECTION 2: Daily Production Chart */}
          <Card className="bg-white border-slate-200">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-sm font-extrabold uppercase font-sans tracking-wide text-slate-900 flex items-center justify-between w-full">
                <span>Daily Production Efficiency Output</span>
                <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded font-mono">
                  TARGET VS ACTUAL
                </span>
              </CardTitle>
              <CardDescription>
                Shift performance, comparing completed task steps against corporate BLW precision timelines.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="h-64 sm:h-72 w-full mt-2 font-mono text-[11px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="stage" stroke="#64748b" tickLine={false} />
                    <YAxis stroke="#64748b" tickLine={false} unit="%" />
                    <Tooltip cursor={{ fill: '#f8fafc' }} />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
                    <Bar dataKey="Target" fill="#cbd5e1" radius={[4, 4, 0, 0]} name="Corporate Target %" />
                    <Bar dataKey="Actual" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Shop Actual Floor %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* RIGHT COLUMN: 4 COLS */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* SECTION 3: Pending Activities */}
          <Card className="bg-white border-slate-200">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-xs uppercase font-extrabold text-slate-500 tracking-wider font-mono flex items-center gap-1.5">
                <ListTodo className="h-4 w-4 text-indigo-550" /> Pending Activities
              </CardTitle>
              <CardDescription>
                Actions requiring shop supervisor physical sign-off or safety check audits.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-3.5">
              {pendingActivities.map((act) => (
                <div key={act.id} className="p-3 bg-slate-50 border border-slate-150 rounded-xl space-y-1.5 hover:border-slate-300 transition-all">
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center px-1.5 py-0.25 rounded text-[8.5px] font-black uppercase font-mono border ${
                      act.priority === "Critical" || act.priority === "High"
                        ? "bg-red-50 text-red-700 border-red-100" 
                        : "bg-slate-100 text-slate-600 border-slate-200"
                    }`}>
                      {act.priority} Priority
                    </span>
                    <span className="text-[9.5px] font-bold text-slate-400 font-mono italic">
                      {act.id}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 leading-normal">
                    {act.task}
                  </p>
                  <p className="text-[10px] text-slate-550 font-mono">
                    Target Area: <strong className="text-slate-700 font-semibold">{act.target}</strong>
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* SECTION 4: Recent Activity Feed */}
          <Card className="bg-white border-slate-200">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-xs uppercase font-extrabold text-slate-500 tracking-wider font-mono flex items-center gap-1.5">
                <History className="h-4 w-4 text-emerald-600" /> Recent Activity Feed
              </CardTitle>
              <CardDescription>
                Audit history log of recent movements on the local shop floor stations.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flow-root">
                <ul className="-mb-8">
                  {recentActivities.map((act, actIdx) => (
                    <li key={act.id}>
                      <div className="relative pb-6">
                        {actIdx !== recentActivities.length - 1 ? (
                          <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-150" aria-hidden="true" />
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center ring-4 ring-white shrink-0">
                              <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            </span>
                          </div>
                          <div className="flex-1 min-w-0 pt-1">
                            <p className="text-xs font-medium text-slate-800 leading-normal">
                              {act.text}
                            </p>
                            <div className="text-[9.5px] text-slate-450 mt-1 flex items-center gap-2 font-mono">
                              <span>By: <strong>{act.user}</strong></span>
                              <span>•</span>
                              <span>{act.time}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  );
}
