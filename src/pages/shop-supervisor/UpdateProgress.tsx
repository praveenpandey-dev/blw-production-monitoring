import React, { useState, useEffect } from "react";
import { getLocomotives, Locomotive, saveLocomotives, SHOP_TASKS, HistoryItem, getHistory, saveHistory } from "./mockData.ts";
import { useAuth } from "../../context/AuthContext.tsx";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Input } from "../../routes.tsx";
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle,
  TrendingUp,
  ArrowRight,
  Sliders,
  ChevronRight,
  Info
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function UpdateProgress() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const shopName = user?.shop || "Electrical Assembly Shop";

  // Load locomotives
  const [locomotives, setLocomotives] = useState<Locomotive[]>([]);
  
  // Form fields
  const [selectedLocoId, setSelectedLocoId] = useState("");
  const [currentTask, setCurrentTask] = useState("");
  const [progress, setProgress] = useState(50);
  const [status, setStatus] = useState<Locomotive["status"]>("In Progress");
  const [remarks, setRemarks] = useState("");
  const [completionDate, setCompletionDate] = useState(
    new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );

  // Status and Alerts
  const [successMessage, setSuccessMessage] = useState("");
  const [isCompletedFlow, setIsCompletedFlow] = useState(false);

  useEffect(() => {
    const list = getLocomotives();
    setLocomotives(list);

    // If passed a state from "AssignedLocomotives", select that locomotive immediately!
    const passedId = location.state?.selectLocoId;
    if (passedId) {
      setSelectedLocoId(passedId);
      const matched = list.find(l => l.id === passedId);
      if (matched) {
        setCurrentTask(matched.currentTask);
        setProgress(matched.progress);
        setStatus(matched.status);
        if (matched.expectedCompletion) {
          setCompletionDate(matched.expectedCompletion.split(" ")[0]);
        }
      }
    } else {
      // Find the first assigned locomotive to this shop to populate as default
      const shopLocoList = list.filter(l => l.shop === shopName);
      if (shopLocoList.length > 0) {
        setSelectedLocoId(shopLocoList[0].id);
        setCurrentTask(shopLocoList[0].currentTask);
        setProgress(shopLocoList[0].progress);
        setStatus(shopLocoList[0].status);
        if (shopLocoList[0].expectedCompletion) {
          setCompletionDate(shopLocoList[0].expectedCompletion.split(" ")[0]);
        }
      }
    }
  }, [shopName, location.state]);

  // When selected locomotive ID changes, pre-fill form fields
  const handleLocoChange = (id: string) => {
    setSelectedLocoId(id);
    const matched = locomotives.find(l => l.id === id);
    if (matched) {
      setCurrentTask(matched.currentTask);
      setProgress(matched.progress);
      setStatus(matched.status);
      if (matched.expectedCompletion) {
        setCompletionDate(matched.expectedCompletion.split(" ")[0]);
      }
    }
  };

  // Only show locomotives assigned to this supervisor's shop
  const shopLocos = locomotives.filter(l => l.shop === shopName);

  // Submit flow: Save Progress (Normal saving)
  const handleSaveProgress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLocoId) return;

    const list = getLocomotives();
    const updated = list.map((loco) => {
      if (loco.id === selectedLocoId) {
        // Construct updated history record
        const originHistory = loco.remarks_history || [];
        const authorName = user?.name || "Shop Supervisor";
        const newRecord = {
          date: new Date().toISOString().split("T")[0],
          progress: progress,
          remark: remarks || `Progress calibrated to ${progress}%. Operational tasks ongoing.`,
          author: authorName
        };

        return {
          ...loco,
          currentTask,
          progress,
          status,
          expectedCompletion: `${completionDate} 17:00`,
          remarks_history: [newRecord, ...originHistory].slice(0, 5) // keep latest 5
        };
      }
      return loco;
    });

    saveLocomotives(updated);
    setLocomotives(updated);
    setSuccessMessage("Production log has been calibrated and saved to Central Registry.");
    setIsCompletedFlow(false);

    // auto-dismiss after 4 seconds
    setTimeout(() => {
      setSuccessMessage("");
    }, 4000);
  };

  // Submit flow: Mark Completed (Special completion workflow!)
  const handleMarkCompleted = () => {
    if (!selectedLocoId) return;

    const list = getLocomotives();
    const activeLocoIndex = list.findIndex((l) => l.id === selectedLocoId);
    
    if (activeLocoIndex !== -1) {
      const activeLoco = list[activeLocoIndex];
      
      // Update local storage to reflect 100% and Completed status!
      activeLoco.progress = 100;
      activeLoco.status = "Completed";
      
      // Keep notes updated
      const originHistory = activeLoco.remarks_history || [];
      const newRecord = {
        date: new Date().toISOString().split("T")[0],
        progress: 100,
        remark: "Stage completed fully. Quality clearances signed off. Rolling stock dispatched.",
        author: user?.name || "Shop Supervisor"
      };
      activeLoco.remarks_history = [newRecord, ...originHistory].slice(0, 5);

      // Save list back to database
      saveLocomotives(list);
      setLocomotives(list);

      // Log this into History repository so it shows up in Page 5
      const currentHist = getHistory();
      const newHistoryItem: HistoryItem = {
        id: `HIST-${Date.now().toString().slice(-4)}`,
        locoNumber: activeLoco.locoNumber,
        locoClass: activeLoco.locoClass,
        task: activeLoco.currentTask,
        completionDate: new Date().toISOString().split("T")[0],
        duration: "5 days", // default or dynamically derived
        result: "Passed Quality Control",
        shop: shopName
      };
      saveHistory([newHistoryItem, ...currentHist]);

      // Set state to trigger beautiful success banner!
      setProgress(100);
      setStatus("Completed");
      setSuccessMessage("Locomotive successfully marked as Completed.");
      setIsCompletedFlow(true);
    }
  };

  const currentMatched = locomotives.find(l => l.id === selectedLocoId);

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-sans tracking-tight">Update Production Progress</h1>
          <p className="text-xs text-slate-500 mt-1">
            Publish progress certifications, log shift reports, or transition finished rolling stock to the next shop berth.
          </p>
        </div>

        <Button 
          variant="outline" 
          onClick={() => navigate("/shop/dashboard")}
          className="h-8 text-xs font-bold leading-none self-start sm:self-center"
        >
          Back to Dashboard
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        
        {/* Core Update Form Panel */}
        <div className="lg:col-span-8">
          <Card className="bg-white border-slate-200">
            <CardHeader className="border-b border-slate-100 py-4 pb-3">
              <CardTitle className="text-sm font-extrabold uppercase font-sans tracking-wide text-slate-900">
                Performance Registry Update
              </CardTitle>
              <CardDescription>
                Provide precision values regarding standard testing or structural alignments in progress representing {shopName}.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 sm:p-6">
              
              {/* SUCCESS BANNER */}
              {successMessage && (
                <div className="mb-6 p-4 rounded-xl text-xs flex items-start gap-3 animate-all duration-200 bg-emerald-50 text-emerald-800 border border-emerald-100">
                  <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-extrabold text-[12px]">{successMessage}</p>
                    {isCompletedFlow && (
                      <p className="font-semibold text-emerald-700 text-[11px] uppercase tracking-wide bg-emerald-100/40 p-2 rounded-md font-mono mt-2">
                        🎉 Locomotive ready for next shop. Passed to transit coordinator logs.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {shopLocos.length === 0 ? (
                <div className="p-8 text-center text-slate-400 font-mono text-xs">
                  No locomotives currently assigned to your shop environment to configure.
                </div>
              ) : (
                <form onSubmit={handleSaveProgress} className="space-y-5">
                  <div className="grid gap-4.5 sm:grid-cols-2">
                    
                    {/* Select Locomotive */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono block">
                        Select Locomotive *
                      </label>
                      <select
                        required
                        value={selectedLocoId}
                        onChange={(e) => handleLocoChange(e.target.value)}
                        className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs outline-hidden focus:border-slate-450 focus:ring-1 focus:ring-slate-450 font-bold text-slate-800 font-mono"
                      >
                        {shopLocos.map((loco) => (
                          <option key={loco.id} value={loco.id}>
                            {loco.locoNumber} ({loco.locoClass})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Current Task */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono block">
                        Active Stage Task *
                      </label>
                      <select
                        required
                        value={currentTask}
                        onChange={(e) => setCurrentTask(e.target.value)}
                        className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs outline-hidden focus:border-slate-450 focus:ring-1 focus:ring-slate-450 font-semibold text-slate-750"
                      >
                        {SHOP_TASKS[shopName]?.map((task, idx) => (
                          <option key={idx} value={task}>
                            {task}
                          </option>
                        )) || (
                          <option value={currentTask}>{currentTask || "General Calibration Assembling"}</option>
                        )}
                      </select>
                    </div>

                    {/* Status Dropdown */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono block">
                        Assembling Status *
                      </label>
                      <select
                        required
                        value={status}
                        onChange={(e) => setStatus(e.target.value as Locomotive["status"])}
                        className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs outline-hidden focus:border-slate-450 focus:ring-1 focus:ring-slate-450 font-bold text-slate-800"
                      >
                        <option value="On Schedule">On Schedule</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Delayed">Delayed</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>

                    {/* Expected Completion Date */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono block">
                        Estimated Target Relocation Date
                      </label>
                      <Input
                        type="date"
                        required
                        value={completionDate}
                        onChange={(e) => setCompletionDate(e.target.value)}
                        className="h-10 text-xs font-mono font-bold"
                      />
                    </div>

                  </div>

                  {/* Progress Slider block */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-black uppercase text-indigo-700 tracking-wider font-mono block">
                          Progress Percentage Slider
                        </span>
                        <span className="text-[10px] text-slate-500 block">Drag to update relative completion logs.</span>
                      </div>
                      <span className="h-9 px-3 bg-slate-900 border border-slate-950 text-white rounded-lg flex items-center justify-center font-mono font-black text-sm">
                        {progress}%
                      </span>
                    </div>

                    <div className="relative pt-1">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={progress}
                        onChange={(e) => setProgress(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-650"
                      />
                      <div className="flex justify-between text-[10px] font-mono font-bold text-slate-400 mt-1">
                        <span>0% (Assembling Intake)</span>
                        <span>50% (Mid-Review)</span>
                        <span>100% (Completed)</span>
                      </div>
                    </div>
                  </div>

                  {/* Remarks */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono block">
                      Shift Supervisor Calibration Remarks / Safety Codes
                    </label>
                    <textarea
                      rows={3}
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="e.g. Completed initial wiring static diagnostics. Insulation checked. Ready for high-voltage static testing."
                      className="w-full p-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-850 outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-sans"
                    />
                  </div>

                  {/* Buttons group */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-3 pt-3 border-t border-slate-100">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleMarkCompleted}
                      className="h-10 text-xs font-bold font-sans text-emerald-700 border-emerald-200 hover:bg-emerald-50/75 shrink-0"
                    >
                      Mark Completed & Handover
                    </Button>
                    <Button
                      type="submit"
                      className="h-10 text-xs font-bold bg-indigo-650 hover:bg-indigo-700 border-indigo-750 text-white min-w-32"
                    >
                      Save Progress Certification
                    </Button>
                  </div>

                </form>
              )}

            </CardContent>
          </Card>
        </div>

        {/* Real-time Status Card helper Side Panel */}
        <div className="lg:col-span-4">
          <Card className="bg-slate-900 border-slate-800 text-slate-200">
            <CardHeader className="border-b border-slate-800 pb-4">
              <CardTitle className="text-xs uppercase font-extrabold text-indigo-400 tracking-wider font-mono flex items-center gap-1.5">
                <Info className="h-4 w-4" /> Active Selection Spec
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 space-y-4">
              {currentMatched ? (
                <div className="space-y-4">
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 font-mono text-xs text-slate-350 space-y-2">
                    <div className="flex justify-between">
                      <span>Ref ID:</span>
                      <strong className="text-white font-black">{currentMatched.id}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Model Block:</span>
                      <strong className="text-white">{currentMatched.locoClass}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Asset Name:</span>
                      <strong className="text-white">{currentMatched.locoNumber}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Current Status:</span>
                      <strong className="text-amber-400 font-bold uppercase">{currentMatched.status}</strong>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <span className="text-[10px] font-black uppercase text-slate-500 font-mono">Current Task Description:</span>
                    <p className="text-white leading-relaxed font-semibold">
                      {currentMatched.currentTask}
                    </p>
                  </div>

                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-slate-450 font-bold">Registered Progress Level</span>
                      <span className="text-indigo-400 font-black">{currentMatched.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-850 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full" style={{ width: `${currentMatched.progress}%` }} />
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 font-mono text-[10px] leading-relaxed text-slate-450 space-y-2">
                    <span className="text-[8.5px] font-bold uppercase text-indigo-400 block tracking-wider mb-1">BLW TRANSIT PROTOCOLS</span>
                    <p>
                      When a locomotive reaches <strong className="text-white">100% (Completed)</strong> state, marking it completed releases it to the subsequent terminal. The routing logistics engine dynamically flags safety certificates.
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 font-mono text-center py-6">
                  No active locomotive selected yet. Pre-fill layout.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

      </div>

    </div>
  );
}
