import React, { useState, useEffect } from "react";
import { getLocomotives, Locomotive, saveLocomotives } from "./mockData.ts";
import { useAuth } from "../../context/AuthContext.tsx";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Input } from "../../routes.tsx";
import { 
  AlertTriangle, 
  Clock, 
  Search, 
  SlidersHorizontal,
  ThumbsUp,
  AlertOctagon,
  Wrench,
  ShieldAlert,
  ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ReportDelay() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const shopName = user?.shop || "Electrical Assembly Shop";

  const [locomotives, setLocomotives] = useState<Locomotive[]>([]);
  
  // Form fields
  const [selectedLocoId, setSelectedLocoId] = useState("");
  const [delayReason, setDelayReason] = useState("Material Shortage");
  const [severity, setSeverity] = useState<"Low" | "Medium" | "High" | "Critical">("Medium");
  const [duration, setDuration] = useState(8); // Default 8 hours
  const [remarks, setRemarks] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const list = getLocomotives();
    setLocomotives(list);

    // Default select first assigned locomotive
    const shopLocoList = list.filter(l => l.shop === shopName);
    if (shopLocoList.length > 0) {
      setSelectedLocoId(shopLocoList[0].id);
    }
  }, [shopName]);

  // Handle Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLocoId) return;

    const list = getLocomotives();
    const updated = list.map((loco) => {
      if (loco.id === selectedLocoId) {
        
        // Push note to notes timeline
        const originHistory = loco.remarks_history || [];
        const authorName = user?.name || "Shop Supervisor";
        const newRecord = {
          date: new Date().toISOString().split("T")[0],
          progress: loco.progress,
          remark: `🔴 DELAY REGISTERED: ${delayReason} [Severity: ${severity}]. Remarks: ${remarks || "Awaiting support dispatch."}`,
          author: authorName
        };

        return {
          ...loco,
          status: "Delayed" as const,
          delayReason,
          delaySeverity: severity,
          delayDuration: duration,
          delayRemarks: remarks,
          remarks_history: [newRecord, ...originHistory].slice(0, 5)
        };
      }
      return loco;
    });

    saveLocomotives(updated);
    setLocomotives(updated);
    setSuccessMessage(`Delay incident reports successfully logged for selected locomotive. Admin and logistics coordinators have been alerted.`);
    
    // reset form fields except drop down selection
    setRemarks("");
    setDuration(8);

    // auto dismiss
    setTimeout(() => {
      setSuccessMessage("");
    }, 5000);
  };

  const shopLocos = locomotives.filter(l => l.shop === shopName);
  const currentMatched = locomotives.find(l => l.id === selectedLocoId);

  return (
    <div className="space-y-6">
      
      {/* Block Title Header */}
      <div className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-sans tracking-tight">Report Production Delay</h1>
          <p className="text-xs text-slate-500 mt-1">
            File structured latency tickets regarding equipment breakages or raw material deficits in <span className="text-indigo-650 font-semibold">{shopName}</span>.
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
        
        {/* Delay Submission Form Panel */}
        <div className="lg:col-span-8">
          <Card className="bg-white border-slate-200">
            <CardHeader className="border-b border-slate-100 py-4 pb-3">
              <CardTitle className="text-sm font-extrabold uppercase font-sans tracking-wide text-slate-900 flex items-center gap-1.5 text-red-650">
                <AlertTriangle className="h-4 w-4 text-red-600 animate-pulse" /> Delay Incident Registry Form
              </CardTitle>
              <CardDescription>
                Submitting this ticket dynamically triggers routing adjustments in the central BLW scheduler system.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 sm:p-6">
              
              {/* SUCCESS BANNER */}
              {successMessage && (
                <div className="mb-6 p-4 rounded-xl text-xs flex items-start gap-3 bg-red-50 text-red-800 border border-red-100 animate-all">
                  <ShieldAlert className="h-5 w-5 text-red-605 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-extrabold text-[12px]">{successMessage}</p>
                    <p className="text-[10.5px] text-red-700 italic">
                      High severity alerts have been triggered to materials handling HQ, supervisor dashboard flagged.
                    </p>
                  </div>
                </div>
              )}

              {shopLocos.length === 0 ? (
                <div className="p-8 text-center text-slate-400 font-mono text-xs">
                  No locomotives currently assigned to your shop environment to report incidents for.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  <div className="grid gap-4.5 sm:grid-cols-2">
                    
                    {/* Locomotive Dropdown */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono block">
                        Select Affected Locomotive *
                      </label>
                      <select
                        required
                        value={selectedLocoId}
                        onChange={(e) => setSelectedLocoId(e.target.value)}
                        className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs outline-hidden focus:border-slate-450 focus:ring-1 focus:ring-slate-450 font-bold text-slate-800 font-mono"
                      >
                        {shopLocos.map((loco) => (
                          <option key={loco.id} value={loco.id}>
                            {loco.locoNumber} ({loco.locoClass})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Delay Reason Dropdown */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono block">
                        Delay Factor Cause *
                      </label>
                      <select
                        required
                        value={delayReason}
                        onChange={(e) => setDelayReason(e.target.value)}
                        className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs outline-hidden focus:border-slate-450 focus:ring-1 focus:ring-slate-450 font-semibold text-slate-755"
                      >
                        <option value="Material Shortage">Material Shortage</option>
                        <option value="Machine Breakdown">Machine Breakdown</option>
                        <option value="Manpower Issue">Manpower Issue</option>
                        <option value="Quality Problem">Quality Problem</option>
                        <option value="Testing Failure">Testing Failure</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Severity dropdown */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono block">
                        Incident Severity Rating *
                      </label>
                      <select
                        required
                        value={severity}
                        onChange={(e) => setSeverity(e.target.value as any)}
                        className={`w-full h-10 rounded-md border bg-white px-3 py-2 text-xs outline-hidden focus:ring-1 font-extrabold ${
                          severity === "Critical" 
                            ? "border-red-300 text-red-650 focus:border-red-400 focus:ring-red-400" 
                            : severity === "High"
                            ? "border-orange-350 text-orange-600 focus:border-orange-400 focus:ring-orange-400"
                            : "border-slate-200 text-slate-800 focus:border-slate-400"
                        }`}
                      >
                        <option value="Low">Low (No deadline risk)</option>
                        <option value="Medium">Medium (Disrupts shift sequence)</option>
                        <option value="High">High (Disrupts corporate target)</option>
                        <option value="Critical">Critical (Complete station shutdown)</option>
                      </select>
                    </div>

                    {/* Duration input */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono block">
                        Forecasted Delay Latency (hours) *
                      </label>
                      <Input
                        type="number"
                        min="1"
                        max="500"
                        required
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                        className="h-10 text-xs font-mono font-bold text-slate-850"
                      />
                    </div>

                  </div>

                  {/* Remarks */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono block">
                      Specific remarks, defective component, or materials code
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="Identify the underlying issue (e.g., Crane hoist hydraulic line blown out. Spare part code #SH-814 currently out of stock. Heavy mechanics maintenance team currently paged.)"
                      className="w-full p-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-850 outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-sans"
                    />
                  </div>

                  {/* Submission */}
                  <div className="flex justify-end pt-3 border-t border-slate-100">
                    <Button
                      type="submit"
                      className="h-10 text-xs font-bold bg-slate-900 border-slate-950 text-white hover:bg-slate-850 hover:text-white min-w-44 flex items-center justify-center gap-1.5"
                    >
                      <AlertOctagon className="h-4 w-4" /> Log & Submit Incident Report
                    </Button>
                  </div>

                </form>
              )}

            </CardContent>
          </Card>
        </div>

        {/* Dynamic Risk Analysis panel */}
        <div className="lg:col-span-4">
          <Card className="bg-slate-950 border-slate-850 text-slate-200">
            <CardHeader className="border-b border-slate-850 pb-4">
              <CardTitle className="text-xs uppercase font-extrabold text-amber-500 tracking-wider font-mono flex items-center gap-1.5">
                <ShieldAlert className="h-4 w-4 text-emerald-500" /> Mitigation Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 space-y-4">
              {currentMatched ? (
                <div className="space-y-4">
                  
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-805 space-y-2">
                    <span className="text-[8.5px] font-black uppercase text-amber-500 font-mono tracking-wide block">
                      Affected Unit Target Spec:
                    </span>
                    <p className="text-xs text-white font-mono font-bold leading-none">
                      {currentMatched.locoClass} - {currentMatched.locoNumber}
                    </p>
                    <div className="text-[10px] text-slate-450 leading-relaxed font-sans pt-1">
                      Task: <strong className="text-slate-300 font-semibold">{currentMatched.currentTask}</strong>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <span className="text-[10px] font-black uppercase text-slate-500 font-mono">Standard Operating Procedures:</span>
                    <ul className="space-y-2 text-slate-350 list-disc list-inside">
                      <li>For <strong className="text-white">Critical</strong> ratings, sound shop warning siren and clear active electrical terminals.</li>
                      <li>Contact logistics liaison for <strong className="text-white">Material Shortages</strong> to look up spare inventory pools.</li>
                      <li>File maintenance slips immediately on machine breakdown to dispatch engineering teams.</li>
                    </ul>
                  </div>

                  <div className="pt-3 border-t border-slate-900 p-3 bg-indigo-950/20 text-indigo-400 font-mono text-[10.5px] rounded-lg border border-indigo-950 flex items-start gap-2">
                    <Clock className="h-4 w-4 mt-0.5 shrink-0 text-indigo-350" />
                    <div>
                      <strong className="text-white">Central Hub Integration</strong>
                      <p className="mt-1 text-slate-300 leading-normal">
                        All delay factors are dynamically synchronized on the HQ command center overview board for production manager review.
                      </p>
                    </div>
                  </div>

                </div>
              ) : (
                <p className="text-xs text-slate-500 font-mono text-center py-6">
                  No active locomotive selected. Select list item first.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

      </div>

    </div>
  );
}
