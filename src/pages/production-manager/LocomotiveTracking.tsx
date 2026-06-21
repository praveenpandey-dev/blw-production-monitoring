import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Search, 
  Filter, 
  Train, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Activity, 
  Eye, 
  RefreshCw, 
  FileSpreadsheet,
  Layers,
  Sparkles,
  Database
} from "lucide-react";
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

export interface Locomotive {
  locoNumber: string;
  model: "WAG12" | "WAP7" | "WAG9" | "WAP5";
  currentShop: string;
  progress: number;
  status: "In Progress" | "Completed" | "Delayed" | "Quality Check";
  delay: string;
  supervisor: string;
}

// Generate exactly 25 realistic locomotives
const LOCOMOTIVE_DATABASE: Locomotive[] = [
  { locoNumber: "WAG12-101", model: "WAG12", currentShop: "Dispatch Center", progress: 100, status: "Completed", delay: "None", supervisor: "Aditya Patil" },
  { locoNumber: "WAG12-102", model: "WAG12", currentShop: "Dispatch Center", progress: 100, status: "Completed", delay: "None", supervisor: "Aditya Patil" },
  { locoNumber: "WAG12-201", model: "WAG12", currentShop: "Testing Center", progress: 92, status: "In Progress", delay: "None", supervisor: "Vikram Malhotra" },
  { locoNumber: "WAG12-202", model: "WAG12", currentShop: "Testing Center", progress: 95, status: "Quality Check", delay: "None", supervisor: "Vikram Malhotra" },
  { locoNumber: "WAG12-203", model: "WAG12", currentShop: "Shell Assembly", progress: 41, status: "Delayed", delay: "4 hrs (Crane issue)", supervisor: "Praveen Pandey" },
  { locoNumber: "WAG12-204", model: "WAG12", currentShop: "Brake & Pneumatic", progress: 68, status: "In Progress", delay: "None", supervisor: "Suresh Sharma" },
  { locoNumber: "WAG12-205", model: "WAG12", currentShop: "Electrical Assembly", progress: 54, status: "Delayed", delay: "10 hrs (Supply Shortage)", supervisor: "Ritik Dubey" },
  { locoNumber: "WAG12-206", model: "WAG12", currentShop: "Frame Fabrication", progress: 12, status: "In Progress", delay: "None", supervisor: "Amrita Sen" },
  { locoNumber: "WAP7-101", model: "WAP7", currentShop: "Dispatch Center", progress: 100, status: "Completed", delay: "None", supervisor: "Aditya Patil" },
  { locoNumber: "WAP7-102", model: "WAP7", currentShop: "Dispatch Center", progress: 100, status: "Completed", delay: "None", supervisor: "Aditya Patil" },
  { locoNumber: "WAP7-103", model: "WAP7", currentShop: "Dispatch Center", progress: 100, status: "Completed", delay: "None", supervisor: "Aditya Patil" },
  { locoNumber: "WAP7-104", model: "WAP7", currentShop: "Dispatch Center", progress: 100, status: "Completed", delay: "None", supervisor: "Aditya Patil" },
  { locoNumber: "WAP7-105", model: "WAP7", currentShop: "Dispatch Center", progress: 100, status: "Completed", delay: "None", supervisor: "Aditya Patil" },
  { locoNumber: "WAP7-106", model: "WAP7", currentShop: "Paint Shop", progress: 80, status: "In Progress", delay: "None", supervisor: "Somnath Nair" },
  { locoNumber: "WAP7-107", model: "WAP7", currentShop: "Paint Shop", progress: 85, status: "In Progress", delay: "None", supervisor: "Somnath Nair" },
  { locoNumber: "WAP7-108", model: "WAP7", currentShop: "Brake & Pneumatic", progress: 72, status: "Quality Check", delay: "None", supervisor: "Suresh Sharma" },
  { locoNumber: "WAP7-109", model: "WAP7", currentShop: "Shell Assembly", progress: 48, status: "In Progress", delay: "None", supervisor: "Praveen Pandey" },
  { locoNumber: "WAP7-110", model: "WAP7", currentShop: "Electrical Assembly", progress: 59, status: "In Progress", delay: "None", supervisor: "Ritik Dubey" },
  { locoNumber: "WAP7-111", model: "WAP7", currentShop: "Frame Fabrication", progress: 3, status: "In Progress", delay: "None", supervisor: "Amrita Sen" },
  { locoNumber: "WAP7-112", model: "WAP7", currentShop: "Bogie Shop", progress: 28, status: "In Progress", delay: "None", supervisor: "Rajesh Kulkarni" },
  { locoNumber: "WAP7-113", model: "WAP7", currentShop: "Bogie Shop", progress: 34, status: "In Progress", delay: "None", supervisor: "Rajesh Kulkarni" },
  { locoNumber: "WAG9-301", model: "WAG9", currentShop: "Dispatch Center", progress: 100, status: "Completed", delay: "None", supervisor: "Aditya Patil" },
  { locoNumber: "WAG9-302", model: "WAG9", currentShop: "Electrical Assembly", progress: 51, status: "Delayed", delay: "6 hrs (PLC fault)", supervisor: "Ritik Dubey" },
  { locoNumber: "WAP5-401", model: "WAP5", currentShop: "Frame Fabrication", progress: 8, status: "In Progress", delay: "None", supervisor: "Amrita Sen" },
  { locoNumber: "WAP5-402", model: "WAP5", currentShop: "Frame Fabrication", progress: 5, status: "In Progress", delay: "None", supervisor: "Amrita Sen" }
];

export default function LocomotiveTracking() {
  const navigate = useNavigate();
  const [dataList, setDataList] = useState<Locomotive[]>(LOCOMOTIVE_DATABASE);
  const [searchLoco, setSearchLoco] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterShop, setFilterShop] = useState("All");

  // Filtering Logic
  const filteredLocomotives = dataList.filter((loco) => {
    const matchesSearch = loco.locoNumber.toLowerCase().includes(searchLoco.toLowerCase());
    const matchesStatus = filterStatus === "All" || loco.status === filterStatus;
    const matchesShop = filterShop === "All" || loco.currentShop === filterShop;
    return matchesSearch && matchesStatus && matchesShop;
  });

  const handleExcelExport = () => {
    alert("Compiling comprehensive XLS spreadsheet of all 25 active/historic locomotive build vectors.");
  };

  const getStatusBadge = (status: Locomotive["status"]) => {
    switch (status) {
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono bg-emerald-50 text-emerald-800 border border-emerald-100">
            <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Finished
          </span>
        );
      case "In Progress":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono bg-indigo-50 text-indigo-800 border border-indigo-100">
            <Activity className="h-3 w-3 text-indigo-505" /> In-Assembly
          </span>
        );
      case "Delayed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono bg-red-50 text-red-800 border border-red-150 animate-pulse">
            <AlertTriangle className="h-3 w-3 text-red-505" /> Delayed
          </span>
        );
      case "Quality Check":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono bg-amber-50 text-amber-850 border border-amber-200">
            <Clock className="h-3 w-3 text-amber-500" /> QA Review
          </span>
        );
    }
  };

  const currentShops = [
    "Frame Fabrication",
    "Bogie Shop",
    "Shell Assembly",
    "Electrical Assembly",
    "Brake & Pneumatic",
    "Paint Shop",
    "Testing Center",
    "Dispatch Center"
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Navigation Header */}
      <ManagerPageHeader activeTab="locomotives" />

      {/* FILTER PANEL AND SYSTEM CONTROLS CARD */}
      <Card className="bg-white border border-slate-200">
        <CardHeader className="border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
          <div>
            <CardTitle className="text-xs uppercase tracking-wider font-mono font-bold text-slate-400">Search Filter Matrix</CardTitle>
            <CardDescription>Filter locomotive orders by locomotive identification index, workshop residence, and stage status.</CardDescription>
          </div>
          <Button onClick={handleExcelExport} variant="outline" className="h-9 hover:bg-slate-50 text-xs shrink-0 font-bold">
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600 mr-1.5" /> Export DB Ledger (XLSX)
          </Button>
        </CardHeader>
        <CardContent className="p-5">
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Filter 1: Loco Number Search */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest block">Loco Number Search</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. WAG12-203..."
                  value={searchLoco}
                  onChange={(e) => setSearchLoco(e.target.value)}
                  className="pl-9 pr-3 py-1.5 text-xs font-semibold w-full rounded-lg border border-slate-200 outline-none focus:border-slate-800 bg-white"
                />
              </div>
            </div>

            {/* Filter 2: Dropdown Status */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest block">Assembly Stage Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg outline-none text-slate-750 focus:border-slate-800 h-[34px]"
              >
                <option value="All">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
                <option value="Delayed">Delayed</option>
                <option value="Quality Check">Quality Check</option>
              </select>
            </div>

            {/* Filter 3: Dropdown Current Shop */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest block">Current Workshop Residence</label>
              <select
                value={filterShop}
                onChange={(e) => setFilterShop(e.target.value)}
                className="w-full px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg outline-none text-slate-755 focus:border-slate-800 h-[34px]"
              >
                <option value="All">All Workshops</option>
                {currentShops.map((shop) => (
                  <option key={shop} value={shop}>{shop}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* LOCOMOTIVE DIRECTORY TABLE CARD */}
      <Card className="bg-white border border-slate-200">
        <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between pb-3 bg-slate-50/20">
          <div>
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-900">Locomotive General Directory Checklist</CardTitle>
            <CardDescription>Live telemetry representation of exactly 25 manufactured systems across active shops.</CardDescription>
          </div>
          <div className="flex items-center gap-1 bg-indigo-50 border border-indigo-100 rounded px-2.5 py-1 text-[10px] font-mono font-bold text-indigo-750 self-start sm:self-center shrink-0">
            <Database className="h-3.5 w-3.5 mr-1" /> Count: {filteredLocomotives.length} Units Listed
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ResponsiveTableWrapper>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[9px] font-mono uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-5 font-bold">Loco Number</th>
                  <th className="py-3 px-4 font-bold">Model Type</th>
                  <th className="py-3 px-4 font-bold">Current Shop Residence</th>
                  <th className="py-3 px-5 font-bold min-w-[150px]">Physical Progress</th>
                  <th className="py-3 px-4 font-bold text-center">Status</th>
                  <th className="py-3 px-4 font-bold">Delay Impact</th>
                  <th className="py-3 px-4 font-bold">Supervisor Code</th>
                  <th className="py-3 px-5 font-bold text-right">Administrative</th>
                </tr>
              </thead>
              <tbody>
                {filteredLocomotives.map((loco) => (
                  <tr 
                    key={loco.locoNumber}
                    className="border-b last:border-0 border-slate-100 hover:bg-slate-50/30 text-xs text-slate-600 transition-colors"
                  >
                    {/* Loco Identifier */}
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-slate-100 rounded text-slate-800">
                          <Train className="h-4 w-4" />
                        </div>
                        <span className="font-extrabold text-slate-950 font-mono tracking-tight text-[13px]">{loco.locoNumber}</span>
                      </div>
                    </td>

                    {/* Model badge */}
                    <td className="py-3 px-4">
                      <span className="font-mono bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded border border-slate-200">
                        {loco.model}
                      </span>
                    </td>

                    {/* Current Shop */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800">
                        <span className="h-2 w-2 rounded-full bg-indigo-500 shrink-0" />
                        <span>{loco.currentShop}</span>
                      </div>
                    </td>

                    {/* Progress with precise styling */}
                    <td className="py-3 px-5">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-500">
                          <span>{loco.progress}% Done</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/50">
                          <div 
                            className={`h-full rounded-full transition-all duration-300 ${
                              loco.status === "Completed" ? "bg-emerald-500" :
                              loco.status === "Delayed" ? "bg-red-500" :
                              "bg-indigo-650"
                            }`} 
                            style={{ width: `${loco.progress}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Status badge */}
                    <td className="py-3 px-4 text-center">
                      {getStatusBadge(loco.status)}
                    </td>

                    {/* Delay */}
                    <td className="py-3 px-4">
                      <span className={`font-mono text-[11px] font-bold ${loco.delay !== "None" ? "text-red-650 hover:underline cursor-pointer" : "text-slate-400 font-medium"}`}>
                        {loco.delay}
                      </span>
                    </td>

                    {/* Supervisor */}
                    <td className="py-3 px-4 text-slate-705 font-bold">
                      {loco.supervisor}
                    </td>

                    {/* Action trigger: Redirect to Page 4 with dynamic ID selection */}
                    <td className="py-3 px-5 text-right whitespace-nowrap">
                      <Button 
                        onClick={() => navigate(`/production-manager/lifecycle?loco=${loco.locoNumber}`)}
                        variant="ghost" 
                        className="h-[30px] px-2 text-indigo-600 hover:text-indigo-850 hover:bg-indigo-50/50 font-bold flex items-center gap-1 text-[11px] ml-auto"
                      >
                        <Layers className="h-3.5 w-3.5" /> View Lifecycle
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
