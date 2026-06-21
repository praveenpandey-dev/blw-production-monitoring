import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { 
  Search, 
  MapPin, 
  Clock, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  User, 
  PlusCircle, 
  Calendar,
  Layers,
  ChevronRight,
  ClipboardList,
  UserCheck,
  Send,
  Zap,
  Check
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

// Robust database of 25 vehicles, each with customized timelines, delays, and supervisor notes
interface LifecycleDetails {
  locoNumber: string;
  model: string;
  progress: number;
  currentShop: string;
  expectedCompletion: string;
  currentActivity: string;
  status: "Completed" | "In Progress" | "Delayed" | "Quality Check";
  stageNum: number; // 0 to 7 indicating the 8 shops
  timelineEvents: { date: string; title: string; subtitle: string; completed: boolean }[];
  delayHistory: { reason: string; duration: string; reportedBy: string }[];
  supervisorRemarks: { author: string; time: string; text: string }[];
}

const LIFECYCLE_REGISTRY: Record<string, LifecycleDetails> = {
  "WAG12-101": {
    locoNumber: "WAG12-101",
    model: "WAG12",
    progress: 100,
    currentShop: "Dispatch Center",
    expectedCompletion: "Completed (09 Jun 2026)",
    currentActivity: "System signed off. Locomotive successfully rolled out to Northern Railways.",
    status: "Completed",
    stageNum: 7,
    timelineEvents: [
      { date: "16 May 2026", title: "Frame Fabrication Started", subtitle: "Chassis cutting & welding completed.", completed: true },
      { date: "19 May 2026", title: "Frame Fabrication Completed", subtitle: "Moved to Bogie assembly depot.", completed: true },
      { date: "20 May 2026", title: "Entered Bogie Shop", subtitle: "Primary wheel and axle mounting.", completed: true },
      { date: "25 May 2026", title: "Bogie Setup Completed", subtitle: "Transferred to Shell assembly cradle.", completed: true },
      { date: "26 May 2026", title: "Shell Assembly Complete", subtitle: "Cab structure and panel alignment clear.", completed: true },
      { date: "01 Jun 2026", title: "Electrical Assembly Done", subtitle: "High-tension cables and dashboard wiring set.", completed: true },
      { date: "04 Jun 2026", title: "Pneumatic Brake Testing Passed", subtitle: "Valve metrics calibrated to standard 12 Bar.", completed: true },
      { date: "07 Jun 2026", title: "Testing & Trial Runs Finished", subtitle: "Passed static and dynamic voltage test blocks.", completed: true },
      { date: "09 Jun 2026", title: "Dispatched to Client Division", subtitle: "Authorized by Chief Supervisor Praveen Pandey.", completed: true }
    ],
    delayHistory: [],
    supervisorRemarks: [
      { author: "Praveen Pandey", time: "09 Jun 14:20", text: "Exceptional build quality. Axle loads tested within 0.1% tolerance. Ready for freight operational duties immediately." }
    ]
  },
  "WAG12-203": {
    locoNumber: "WAG12-203",
    model: "WAG12",
    progress: 41,
    currentShop: "Shell Assembly Shop",
    expectedCompletion: "28 Jun 2026 (Delayed by crane failure)",
    currentActivity: "Fitting outer sheet metal cabin frame structure onto loco underbelly structure.",
    status: "Delayed",
    stageNum: 2,
    timelineEvents: [
      { date: "01 Jun 2026", title: "Frame Fabrication Started", subtitle: "Heavy steel panel laser cutting.", completed: true },
      { date: "05 Jun 2026", title: "Frame Fabrication Finished", subtitle: "Approved with full welding compliance.", completed: true },
      { date: "06 Jun 2026", title: "Entered Bogie Shop", subtitle: "Traction motor alignment and primary gear tuning.", completed: true },
      { date: "11 Jun 2026", title: "Bogie Setup Completed", subtitle: "Unit delivered to Shell assembly floor.", completed: true },
      { date: "12 Jun 2026", title: "Entered Shell Assembly Shop", subtitle: "Cab fixture alignment with heavy cranes.", completed: true },
      { date: "15 Jun 2026", title: "Shell Overhead Crane Failure", subtitle: "Gantry crane lock seized. Assembly on halt.", completed: false },
      { date: "Pending", title: "Electrical Wire Harness Layout", subtitle: "Awaiting mechanical shell wrap approval.", completed: false }
    ],
    delayHistory: [
      { reason: "Overhead Gantry Crane hydraulic lock failure in Shell Shop", duration: "4 Hours (Active)", reportedBy: "Praveen Pandey" },
      { reason: "Sheet welding electrode shortage at Line 3", duration: "2 Hours (Resolved)", reportedBy: "Amrita Sen" }
    ],
    supervisorRemarks: [
      { author: "Praveen Pandey", time: "Yesterday, 16:30", text: "Maintenance team is replacing the crane valve. Progress expected to resume tomorrow morning on shift A." },
      { author: "Ritik Dubey", time: "June 18, 11:15", text: "Shell alignment was perfect before halting. Safety block successfully validated." }
    ]
  },
  "WAG12-205": {
    locoNumber: "WAG12-205",
    model: "WAG12",
    progress: 54,
    currentShop: "Electrical Assembly Shop",
    expectedCompletion: "30 Jun 2026",
    currentActivity: "Resolving supply deficiency regarding high-tension connection wires & copper plates.",
    status: "Delayed",
    stageNum: 3,
    timelineEvents: [
      { date: "28 May 2026", title: "Frame Fabrication Initiated", subtitle: "Laser line chassis compilation.", completed: true },
      { date: "01 Jun 2026", title: "Frame Welding Signoff", subtitle: "Ultrasonic welding checks passed.", completed: true },
      { date: "02 Jun 2026", title: "Bogie Mounting Set", subtitle: "Heavy coil springs balanced successfully.", completed: true },
      { date: "08 Jun 2026", title: "Shell Assembly Wrapping Complete", subtitle: "Nose cone and drivers cab fit.", completed: true },
      { date: "09 Jun 2026", title: "Entered Electrical Assembly", subtitle: "Cabinet harness routing starting.", completed: true },
      { date: "18 Jun 2026", title: "Copper Plate Stockout detected", subtitle: "Vendor dispatch backlog at logistics zone.", completed: false }
    ],
    delayHistory: [
      { reason: "High-voltage copper busbar plate supplier delay", duration: "10 Hours (Active)", reportedBy: "Ritik Dubey" }
    ],
    supervisorRemarks: [
      { author: "Ritik Dubey", time: "Today, 09:12", text: "Contacted local supplier in Varanasi. Urgent dispatch of copper busbars expected by Saturday eve." }
    ]
  }
};

// Fallback generator for other 22 locomotives to ensure complete functional coverage
function generateLocoDetails(locoId: string): LifecycleDetails {
  const model = locoId.startsWith("WAP7") ? "WAP7" : locoId.startsWith("WAG9") ? "WAG9" : locoId.startsWith("WAP5") ? "WAP5" : "WAG12";
  const numPart = parseInt(locoId.split("-")[1]) || 201;
  
  // Deterministic values depending on the locomotive number
  let progress = 75;
  let currentShop = "Brake & Pneumatic Shop";
  let stageNum = 4;
  let status: LifecycleDetails["status"] = "In Progress";
  
  if (numPart <= 105) {
    progress = 100;
    currentShop = "Dispatch Center";
    stageNum = 7;
    status = "Completed";
  } else if (numPart === 201 || numPart === 202) {
    progress = 92;
    currentShop = "Testing Center";
    stageNum = 6;
    status = "Quality Check";
  } else if (numPart === 106 || numPart === 107) {
    progress = 85;
    currentShop = "Paint Shop";
    stageNum = 5;
    status = "In Progress";
  } else if (numPart >= 111 && numPart <= 113) {
    progress = 15;
    currentShop = "Bogie Shop";
    stageNum = 1;
    status = "In Progress";
  }

  // Create customized events
  const timelineEvents = [
    { date: "01 Jun 2026", title: "Frame Fabrication Started", subtitle: "Sheet alignment and plasma cutting.", completed: true },
    { date: "03 Jun 2026", title: "Frame Fabrication Completed", subtitle: "Full dye check approved.", completed: progress >= 15 },
    { date: "04 Jun 2026", title: "Entered Bogie Shop", subtitle: "Wheelset lowering & motor alignment.", completed: progress >= 20 },
    { date: "09 Jun 2026", title: "Bogie Setup Signoff", subtitle: "Transferred to Shell assembly.", completed: progress >= 40 },
    { date: "10 Jun 2026", title: "Entered Shell Assembly", subtitle: "Frame cabins welded successfully.", completed: progress >= 50 },
    { date: "14 Jun 2026", title: "Shell Structural Completed", subtitle: "Cab control plates mounted.", completed: progress >= 60 },
    { date: "15 Jun 2026", title: "Entered Electrical Division", subtitle: "Auxiliary wiring and relay boxes layout.", completed: progress >= 70 },
    { date: "Current", title: `Active in ${currentShop}`, subtitle: `Progress reached ${progress}%.`, completed: false }
  ];

  return {
    locoNumber: locoId,
    model,
    progress,
    currentShop,
    expectedCompletion: progress === 100 ? "Completed" : "29 Jun 2026",
    currentActivity: `Undergoing standard calibration processes scheduled inside ${currentShop}.`,
    status,
    stageNum,
    timelineEvents,
    delayHistory: [],
    supervisorRemarks: [
      { author: "Suresh Sharma", time: "18 Jun 15:40", text: "Electrical insulation checklist passed with good limits. No anomalies tracked on primary sensors." }
    ]
  };
}

export default function LifecycleTracking() {
  const [searchParams] = useSearchParams();
  const [selectedLoco, setSelectedLoco] = useState<string>("WAG12-203");
  const [currentDetails, setCurrentDetails] = useState<LifecycleDetails>(LIFECYCLE_REGISTRY["WAG12-203"]);

  // Input fields for adding custom supervisor remark
  const [remarksInput, setRemarksInput] = useState("");
  const [remarksList, setRemarksList] = useState<{ author: string; time: string; text: string }[]>([]);

  const ALL_PROD_SHOPS = [
    "Frame Fabrication",
    "Bogie Shop",
    "Shell Assembly Shop",
    "Electrical Assembly Shop",
    "Brake & Pneumatic Shop",
    "Paint Shop",
    "Testing Center",
    "Dispatch Center"
  ];

  // Load locomotive from search parameters if specified (e.g., from table clicking "View Lifecycle")
  useEffect(() => {
    const queryLoco = searchParams.get("loco");
    if (queryLoco) {
      setSelectedLoco(queryLoco);
    }
  }, [searchParams]);

  // Sync state whenever selected locomotive changes
  useEffect(() => {
    let details = LIFECYCLE_REGISTRY[selectedLoco];
    if (!details) {
      details = generateLocoDetails(selectedLoco);
    }
    setCurrentDetails(details);
    setRemarksList(details.supervisorRemarks);
  }, [selectedLoco]);

  const handleAddRemark = (e: React.FormEvent) => {
    e.preventDefault();
    if (!remarksInput.trim()) return;

    const newRemark = {
      author: "Praveen Pandey", // Signed-in user representation
      time: "Just Now",
      text: remarksInput
    };

    setRemarksList([newRemark, ...remarksList]);
    setRemarksInput("");
    alert("New supervisor remark compiled into cryptographic unit log.");
  };

  // Full list of 25 locomotives for quick dropdown selection
  const locomotiveIdsList = [
    "WAG12-101", "WAG12-102", "WAG12-201", "WAG12-202", "WAG12-203", "WAG12-204", "WAG12-205", "WAG12-206",
    "WAP7-101", "WAP7-102", "WAP7-103", "WAP7-104", "WAP7-105", "WAP7-106", "WAP7-107", "WAP7-108",
    "WAP7-109", "WAP7-110", "WAP7-111", "WAP7-112", "WAP7-113", "WAG9-301", "WAG9-302", "WAP5-401", "WAP5-402"
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Navigation Header */}
      <ManagerPageHeader activeTab="lifecycle" />

      {/* LOCOMOTIVE SELECTOR HEADER BAR */}
      <Card className="bg-white border border-slate-200 p-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 pr-2">
            <span className="p-3.5 rounded-full bg-slate-900 text-white shrink-0">
              <Layers className="h-5 w-5" />
            </span>
            <div>
              <span className="text-[10px] font-bold font-mono tracking-wider text-indigo-700 uppercase bg-indigo-50 px-2 py-0.5 rounded">
                Active System Audit
              </span>
              <h2 className="text-xl font-bold text-slate-950 mt-1">Lifecycle Auditor: <strong className="font-mono text-indigo-750">{currentDetails.locoNumber}</strong> ({currentDetails.model})</h2>
            </div>
          </div>

          {/* Search Dropdown Selector */}
          <div className="flex items-center gap-2 self-stretch sm:self-center shrink-0">
            <span className="text-xs font-bold text-slate-500 font-sans whitespace-nowrap">Selected Loco:</span>
            <select
              value={selectedLoco}
              onChange={(e) => setSelectedLoco(e.target.value)}
              className="px-3 py-1.5 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-lg outline-none text-slate-800 focus:border-slate-800 h-[38px] w-full sm:w-[180px]"
            >
              {locomotiveIdsList.map((id) => (
                <option key={id} value={id}>{id}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* HEADER STATS BLOCK */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {/* Current Shop */}
        <Card className="p-4 bg-white border-l-4 border-l-indigo-650 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1">
            <MapPin className="h-3 w-3 text-indigo-500" /> Current Shop Residence
          </span>
          <div className="mt-2.5">
            <span className="text-sm font-black text-slate-905">{currentDetails.currentShop}</span>
            <span className="block text-[10px] text-slate-400 mt-1">Operational workshop</span>
          </div>
        </Card>

        {/* Expect Completion */}
        <Card className="p-4 bg-white border-l-4 border-l-purple-550 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1">
            <Calendar className="h-3 w-3 text-purple-400" /> Completion Target
          </span>
          <div className="mt-2.5 font-mono">
            <span className="text-sm font-black text-slate-905">{currentDetails.expectedCompletion}</span>
            <span className="block text-[10px] text-slate-400 mt-1">Projected rollout calendar</span>
          </div>
        </Card>

        {/* Progress % */}
        <Card className="p-4 bg-white border-l-4 border-l-emerald-500 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1">
            <Activity className="h-3 w-3 text-emerald-500" /> Production Progress
          </span>
          <div className="mt-2.5">
            <div className="flex items-center justify-between font-mono">
              <span className="text-base font-black text-slate-900">{currentDetails.progress}%</span>
              <span className={`text-[10px] inline-block font-extrabold px-1.5 py-0.25 rounded-md ${
                currentDetails.status === "Completed" ? "bg-emerald-50 text-emerald-800" :
                currentDetails.status === "Delayed" ? "bg-red-50 text-red-700" : "bg-indigo-50 text-indigo-700"
              }`}>{currentDetails.status}</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1.5">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${currentDetails.progress}%` }} />
            </div>
          </div>
        </Card>

        {/* Current Activity details */}
        <Card className="p-4 bg-white border-l-4 border-l-amber-450 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1">
            <Zap className="h-3 w-3 text-amber-500" /> Underway Activity
          </span>
          <div className="mt-1.5">
            <p className="text-[11px] leading-relaxed text-slate-650 font-semibold line-clamp-2" title={currentDetails.currentActivity}>
              {currentDetails.currentActivity}
            </p>
          </div>
        </Card>
      </div>

      {/* LARGE HORIZONTAL JOURNEY TRACKER */}
      <Card className="bg-white border border-slate-200">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="text-xs uppercase font-bold text-slate-400 tracking-wider font-mono">Horizontal Stage Sequence Tracker</CardTitle>
          <CardDescription>Visual state of the locomotive across the 8 industrial shop floor stages.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="overflow-x-auto pb-2">
            <div className="flex items-center justify-between min-w-[900px] px-2.5">
              {ALL_PROD_SHOPS.map((shopName, idx) => {
                const isCompleted = idx < currentDetails.stageNum;
                const isActive = idx === currentDetails.stageNum;
                const isUpcoming = idx > currentDetails.stageNum;

                // Color configuration of circles
                let circleColor = "bg-slate-200 border-slate-300 text-slate-500";
                if (isCompleted) circleColor = "bg-emerald-500 border-emerald-600 text-white";
                if (isActive) circleColor = "bg-indigo-600 border-indigo-750 text-white ring-4 ring-indigo-50";

                return (
                  <React.Fragment key={idx}>
                    {/* Stage Unit Node */}
                    <div className="flex flex-col items-center flex-1 relative">
                      <div className={`h-8 w-8 rounded-full border-2 flex items-center justify-center font-mono text-xs font-extrabold select-none ${circleColor}`}>
                        {isCompleted ? <Check className="h-4 w-4 stroke-[3px]" /> : (idx + 1)}
                      </div>
                      <span className={`text-[11px] font-bold mt-2.5 text-center px-1 truncate w-28 block ${
                        isActive ? "text-indigo-600 font-extrabold" : isCompleted ? "text-slate-800" : "text-slate-400 font-medium"
                      }`}>
                        {shopName.replace(" Shop", "").replace(" Center", "")}
                      </span>
                    </div>

                    {/* Stage connection line */}
                    {idx < ALL_PROD_SHOPS.length - 1 && (
                      <div className="flex-1 h-[2px] bg-slate-200 relative shrink-0 -mt-7">
                        <div 
                          className={`absolute inset-0 transition-all duration-500 ${
                            idx < currentDetails.stageNum ? "bg-emerald-500" : "bg-slate-205"
                          }`}
                        />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* BOTTOM SECTIONS GRID */}
      <div className="grid gap-6 md:grid-cols-12 items-start">
        
        {/* LEFT COLUMN: VERTICAL TIMELINE (md:col-span-6) */}
        <div className="md:col-span-6 space-y-6">
          <Card className="bg-white border border-slate-200">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <ClipboardList className="h-4 w-4 text-slate-500" /> Vertical Telemetry Timeline
              </CardTitle>
              <CardDescription>Dense historical record representing production event checkouts.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="relative pl-6 border-l-2 border-slate-100 space-y-6">
                {currentDetails.timelineEvents.map((event, idx) => (
                  <div key={idx} className="relative">
                    {/* Bullet marker */}
                    <span className={`absolute -left-[30px] top-1 h-3.5 w-3.5 rounded-full border-2 bg-white ${
                      event.completed ? "border-emerald-500 bg-emerald-50" : "border-slate-350 bg-slate-50"
                    }`} />
                    
                    {/* Text node */}
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 px-2 rounded-md">
                          {event.date}
                        </span>
                        {event.completed && (
                          <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 rounded border border-emerald-100 uppercase">
                            Verify Complete
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-extrabold text-slate-900 mt-1">{event.title}</h4>
                      <p className="text-[11px] text-slate-500 font-medium">{event.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: DELAYS AND SUPERVISOR REMARKS (md:col-span-6) */}
        <div className="md:col-span-6 space-y-6">
          
          {/* DELAY EVENTS BLOCK */}
          <Card className="bg-white border border-slate-200">
            <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between pb-3.5 bg-red-50/10">
              <div>
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-red-505" /> Delay Events Ledger
                </CardTitle>
                <CardDescription>Downtime details recorded by station sensors or supervisors.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              {currentDetails.delayHistory.length === 0 ? (
                <div className="p-5 border border-dashed border-slate-150 rounded-xl text-center">
                  <p className="text-xs font-semibold text-emerald-600 bg-emerald-50 p-2.5 rounded-lg inline-flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Operational Compliance Perfect. No delay hours registered.
                  </p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {currentDetails.delayHistory.map((delay, index) => (
                    <div key={index} className="p-3.5 bg-red-50/50 border border-red-100 rounded-xl space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-mono font-bold text-red-700">
                        <span>REASON:</span>
                        <span className="px-2 py-0.5 bg-red-100 rounded flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {delay.duration} DOWNTIME
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-800 leading-relaxed">
                        {delay.reason}
                      </p>
                      <div className="pt-2 border-t border-red-100/50 flex justify-between items-center text-[10px] text-slate-400 font-bold font-mono">
                        <span>AUTHOR: {delay.reportedBy}</span>
                        <span className="text-red-500">SEVERITY: HIGH</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* SUPERVISOR REMARKS CHANNEL */}
          <Card className="bg-white border border-slate-200">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <UserCheck className="h-4 w-4 text-indigo-500" /> Supervisor Remarks Channel
              </CardTitle>
              <CardDescription>Bespoke instruction log annotated by managing engineers.</CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-5">
              
              {/* Add Remark Form */}
              <form onSubmit={handleAddRemark} className="space-y-2.5">
                <textarea
                  value={remarksInput}
                  onChange={(e) => setRemarksInput(e.target.value)}
                  placeholder="Type an official production log instruction alert (e.g. 'Calibration check passed. Motor layout optimized.')..."
                  className="w-full h-20 px-3.5 py-2.5 border border-slate-200 rounded-lg outline-none text-xs font-semibold focus:border-slate-800 focus:ring-1 focus:ring-slate-100 placeholder:text-slate-400 font-sans leading-relaxed"
                />
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono font-bold text-slate-400">AUTHOR IDENT: <strong>Praveen Pandey</strong></span>
                  <Button type="submit" className="bg-slate-900 hover:bg-slate-800 text-xs px-4 h-8.5 font-bold">
                    <Send className="h-3 w-3 mr-1" /> Post Remark
                  </Button>
                </div>
              </form>

              {/* Remarks list */}
              <div className="divide-y divide-slate-100 max-h-[220px] overflow-y-auto pt-2">
                {remarksList.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-2 font-medium">No supervisor remarks recorded yet.</p>
                ) : (
                  remarksList.map((remark, idx) => (
                    <div key={idx} className="py-3 last:pb-0 space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-500">
                        <span className="text-indigo-650 flex items-center gap-1"><User className="h-3 w-3 inline text-slate-400" /> {remark.author}</span>
                        <span>{remark.time}</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-705 leading-relaxed font-sans">
                        {remark.text}
                      </p>
                    </div>
                  ))
                )}
              </div>

            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  );
}
