import React, { useState, useEffect } from "react";
import { getLocomotives, Locomotive, saveLocomotives } from "./mockData.ts";
import { useAuth } from "../../context/AuthContext.tsx";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Input } from "../../routes.tsx";
import { ResponsiveTableWrapper } from "../../components/ResponsiveTableWrapper.tsx";
import { 
  Building, 
  Search, 
  Filter, 
  ChevronRight, 
  SlidersHorizontal, 
  RefreshCw, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  HelpCircle,
  Eye,
  Sliders,
  X
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AssignedLocomotives() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const shopName = user?.shop || "Electrical Assembly Shop";

  const [locomotives, setLocomotives] = useState<Locomotive[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Custom Filter State
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [progressFilter, setProgressFilter] = useState<string>("ALL"); // "ALL", "0-30", "31-70", "71-99", "100"

  // Selected Locomotive for detail View Sidebar/Modal
  const [selectedLoco, setSelectedLoco] = useState<Locomotive | null>(null);

  useEffect(() => {
    setLocomotives(getLocomotives());
  }, []);

  // Filter locomotives based on current logged in supervisor's shop!
  const shopLocos = locomotives.filter(l => l.shop === shopName);

  // Apply search & filters
  const filteredLocos = shopLocos.filter((loco) => {
    // Search match
    const matchSearch = 
      loco.locoNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loco.currentTask.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loco.locoClass.toLowerCase().includes(searchTerm.toLowerCase());

    // Status match
    const matchStatus = statusFilter === "ALL" || loco.status === statusFilter;

    // Priority match
    const matchPriority = priorityFilter === "ALL" || loco.priority === priorityFilter;

    // Progress match
    let matchProgress = true;
    if (progressFilter === "0-30") matchProgress = loco.progress <= 30;
    else if (progressFilter === "31-70") matchProgress = loco.progress > 30 && loco.progress <= 70;
    else if (progressFilter === "71-99") matchProgress = loco.progress > 70 && loco.progress < 100;
    else if (progressFilter === "100") matchProgress = loco.progress === 100;

    return matchSearch && matchStatus && matchPriority && matchProgress;
  });

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
    setPriorityFilter("ALL");
    setProgressFilter("ALL");
  };

  const getPriorityBadgeColor = (prio: string) => {
    switch (prio) {
      case "Critical": return "bg-red-950 text-red-400 border-red-900";
      case "High": return "bg-orange-950 text-orange-400 border-orange-900";
      case "Medium": return "bg-indigo-950 text-indigo-400 border-indigo-900";
      case "Low": return "bg-slate-900 text-slate-400 border-slate-800";
      default: return "bg-slate-900 text-slate-400 border-slate-800";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Delayed": return "bg-rose-50 text-rose-700 border-rose-100";
      case "Completed": return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "On Schedule": return "bg-indigo-50 text-indigo-700 border-indigo-100";
      case "In Progress": return "bg-blue-50 text-blue-700 border-blue-100";
      default: return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 gap-4 border-b border-slate-100">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-sans tracking-tight">Assigned Locomotives</h1>
          <p className="text-xs text-slate-500 mt-1">
            Managing <strong className="text-indigo-650">{shopName}</strong> assets currently on active fabrication berths.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={resetFilters} 
            className="h-8 text-xs font-bold leading-none"
          >
            Clear Filters
          </Button>
          <Button 
            className="h-8 text-xs font-bold bg-slate-900 border-slate-950 text-white leading-none"
            onClick={() => navigate("/shop/update-progress")}
          >
            Update Locomotive Progress
          </Button>
        </div>
      </div>

      {/* FILTER CONTROLS BAR */}
      <Card className="bg-white border-slate-200">
        <CardContent className="p-4 sm:p-5 space-y-4">
          <div className="grid gap-3 grid-cols-1 md:grid-cols-12">
            
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by Loco#, Class, or active task..."
                className="pl-9 h-9 text-xs"
              />
            </div>

            {/* Status Filter */}
            <div className="md:col-span-2.5">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-xs outline-hidden focus:border-slate-450 focus:ring-1 focus:ring-slate-450 font-medium text-slate-750"
              >
                <option value="ALL">Status: All Statuses</option>
                <option value="On Schedule">On Schedule</option>
                <option value="In Progress">In Progress</option>
                <option value="Delayed">Delayed</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div className="md:col-span-2">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-xs outline-hidden focus:border-slate-450 focus:ring-1 focus:ring-slate-450 font-medium text-slate-750"
              >
                <option value="ALL">Priority: All</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Progress Selector */}
            <div className="md:col-span-2.5">
              <select
                value={progressFilter}
                onChange={(e) => setProgressFilter(e.target.value)}
                className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-xs outline-hidden focus:border-slate-450 focus:ring-1 focus:ring-slate-450 font-medium text-slate-750"
              >
                <option value="ALL">Progress: Any</option>
                <option value="0-30">0% - 30% Initial</option>
                <option value="31-70">31% - 70% Mid-way</option>
                <option value="71-99">71% - 99% Near Done</option>
                <option value="100">100% Fully Ready</option>
              </select>
            </div>

          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-450 pt-1">
            <span>
              Showing <strong className="font-bold text-slate-700">{filteredLocos.length}</strong> of {shopLocos.length} assigned locomotives
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-indigo-500" />
              Dynamic Sync Enabled
            </span>
          </div>
        </CardContent>
      </Card>

      {/* LOCOMOTIVES GRID OR TABLE */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className={selectedLoco ? "lg:col-span-8 animate-all" : "lg:col-span-12"}>
          <Card className="bg-white border-slate-200">
            <CardContent className="p-0">
              {filteredLocos.length === 0 ? (
                <div className="p-12 text-center text-slate-400 font-sans text-xs">
                  <SlidersHorizontal className="h-10 w-10 mx-auto text-slate-350 mb-3" />
                  No locomotives matched your query patterns on the active floor.
                </div>
              ) : (
                <ResponsiveTableWrapper>
                  <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-450 tracking-wider">
                      <th className="py-3 px-4 font-mono">Loco Number</th>
                      <th className="py-3 px-4">Task</th>
                      <th className="py-3 px-4">Progress</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Priority</th>
                      <th className="py-3 px-4">Timeline</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredLocos.map((loco) => (
                      <tr key={loco.id} className={`hover:bg-slate-50/50 transition-colors ${selectedLoco?.id === loco.id ? "bg-indigo-50/20" : ""}`}>
                        <td className="py-3.5 px-4 font-mono">
                          <div>
                            <span className="font-extrabold text-slate-900 block leading-tight">{loco.locoNumber}</span>
                            <span className="text-[8.5px] font-bold text-slate-500 uppercase font-mono block.mt-0.5">{loco.locoClass} ({loco.id})</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-600 truncate max-w-[140px]" title={loco.currentTask}>
                          {loco.currentTask}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 sm:w-20 bg-slate-100 h-1 rounded-full overflow-hidden shrink-0">
                              <div 
                                className={`h-full rounded-full ${
                                  loco.status === "Delayed" ? "bg-rose-500" : loco.status === "Completed" ? "bg-emerald-500" : "bg-indigo-650"
                                }`}
                                style={{ width: `${loco.progress}%` }}
                              />
                            </div>
                            <span className="font-mono font-bold text-slate-700 text-[10px] shrink-0">{loco.progress}%</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${getStatusBadgeColor(loco.status)}`}>
                            {loco.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[8.5px] font-bold uppercase font-mono border ${getPriorityBadgeColor(loco.priority)}`}>
                            {loco.priority}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 text-[10.5px] font-mono leading-tight">
                          <div>
                            <span className="block text-slate-450 leading-none">Est Completion:</span>
                            <span className="block mt-1 font-bold text-slate-650">{loco.expectedCompletion.split(" ")[0]}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button 
                              variant="outline" 
                              className="h-7 w-7 p-0" 
                              title="Inspector Specs"
                              onClick={() => setSelectedLoco(loco)}
                            >
                              <Eye className="h-3.5 w-3.5 text-slate-550" />
                            </Button>
                            <Button 
                              variant="outline" 
                              className="h-7 text-[10px] font-extrabold px-2.5 py-1"
                              onClick={() => {
                                navigate("/shop/update-progress", { state: { selectLocoId: loco.id } });
                              }}
                            >
                              Update
                            </Button>
                          </div>
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

        {/* DETAILS SIDEBAR COMPONENT */}
        {selectedLoco && (
          <div className="lg:col-span-4 animate-in slide-in-from-right duration-250">
            <Card className="bg-slate-950 border-slate-800 text-slate-200">
              <CardHeader className="border-b border-slate-800 pb-4 flex flex-row items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-indigo-400 font-mono uppercase tracking-widest">{selectedLoco.locoClass} Build Model</span>
                  <CardTitle className="text-base font-extrabold text-white mt-1 font-mono tracking-tight">{selectedLoco.locoNumber}</CardTitle>
                </div>
                <Button 
                  variant="outline" 
                  className="h-7 w-7 p-0 bg-transparent text-slate-400 border-slate-800 hover:text-white"
                  onClick={() => setSelectedLoco(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-4 sm:p-5 space-y-4">
                
                {/* ID & Priority Badge Cluster */}
                <div className="grid grid-cols-2 gap-3.5 bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs font-mono">
                  <div>
                    <span className="text-[9px] text-slate-500 block uppercase">Log Code</span>
                    <span className="text-[11px] font-bold text-slate-150 block mt-0.5">{selectedLoco.id}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 block uppercase">Priority Level</span>
                    <span className="text-[11px] font-bold text-amber-500 block mt-0.5 uppercase">{selectedLoco.priority}</span>
                  </div>
                </div>

                {/* Task Details */}
                <div className="space-y-1">
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-450 font-mono">Active Shop Stage Task</h4>
                  <p className="text-xs text-white leading-normal font-semibold">
                    {selectedLoco.currentTask}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-slate-400 font-bold">Stage Progress Completed</span>
                    <span className="text-indigo-400 font-extrabold">{selectedLoco.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        selectedLoco.status === "Delayed" ? "bg-red-500" : selectedLoco.status === "Completed" ? "bg-emerald-500" : "bg-indigo-500"
                      }`}
                      style={{ width: `${selectedLoco.progress}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2 text-xs border-t border-slate-900">
                  {/* Timeline block */}
                  <div className="space-y-1.5 font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-505">Arrival Time:</span>
                      <span className="text-slate-250 font-semibold">{selectedLoco.startTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-505">Target Out:</span>
                      <span className="text-slate-250 font-semibold">{selectedLoco.expectedCompletion}</span>
                    </div>
                  </div>

                  {/* Delay fields if delayed */}
                  {selectedLoco.status === "Delayed" && (
                    <div className="p-3 bg-red-950/25 border border-red-900 rounded-lg text-[11px] space-y-1.5">
                      <span className="text-[9px] text-red-400 font-bold uppercase font-mono tracking-wider flex items-center gap-1">
                        <AlertTriangle className="h-3.5 w-3.5 animate-pulse" /> Materialized Delay Report
                      </span>
                      <p className="text-slate-350 leading-relaxed font-sans mt-0.5">
                        Reason: <strong className="text-white">{selectedLoco.delayReason}</strong>
                      </p>
                      <p className="text-slate-400 leading-normal font-sans">
                        Severity: <strong className="text-white font-semibold italic">{selectedLoco.delaySeverity}</strong>
                      </p>
                      <p className="text-slate-450 leading-relaxed font-sans block pt-0.5 italic text-[11px]">
                        "{selectedLoco.delayRemarks || "Inspection queued"}"
                      </p>
                    </div>
                  )}

                  {/* Remarks History */}
                  <div className="space-y-2 pt-2">
                    <h5 className="text-[10px] font-black uppercase tracking-wider text-slate-450 font-mono">Supervisor Notes Timeline</h5>
                    {selectedLoco.remarks_history && selectedLoco.remarks_history.length > 0 ? (
                      <div className="space-y-2">
                        {selectedLoco.remarks_history.map((hist, ind) => (
                          <div key={ind} className="bg-slate-900/60 p-2.5 rounded-md border border-slate-800 text-[10.5px] leading-relaxed">
                            <div className="flex justify-between text-slate-400 font-mono text-[9px] mb-1">
                              <span>Progress: {hist.progress}%</span>
                              <span>{hist.date}</span>
                            </div>
                            <p className="text-slate-200">"{hist.remark}"</p>
                            <span className="block text-[8px] text-slate-550 font-mono mt-1 text-right">Signed: {hist.author}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[10px] font-medium text-slate-550 italic font-mono">No notes or status reports filed for this model build yet.</p>
                    )}
                  </div>

                  <div className="pt-2">
                    <Button 
                      className="w-full text-xs font-bold leading-none bg-indigo-650 hover:bg-indigo-700 text-white h-9"
                      onClick={() => {
                        navigate("/shop/update-progress", { state: { selectLocoId: selectedLoco.id } });
                      }}
                    >
                      Open Action Editor
                    </Button>
                  </div>
                </div>

              </CardContent>
            </Card>
          </div>
        )}
      </div>

    </div>
  );
}
