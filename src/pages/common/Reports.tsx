import { useState } from "react";
import { useAuth } from "../../context/AuthContext.tsx";
import { ResponsiveTableWrapper } from "../../components/ResponsiveTableWrapper.tsx";
import { 
  FileText, 
  FileSpreadsheet, 
  Download, 
  Eye, 
  Calendar, 
  User, 
  CheckCircle2, 
  Clock, 
  Lock, 
  HelpCircle, 
  ChevronRight, 
  RefreshCw,
  Search,
  Filter,
  X,
  TrendingUp,
  BarChart2,
  ListCollapse
} from "lucide-react";

// Types
export interface ReportCardDef {
  id: string;
  name: string;
  description: string;
  category: "Production" | "Delay" | "Efficiency" | "Shop" | "Daily Work";
  size: string;
  allowedRoles: ("ADMIN" | "PRODUCTION_MANAGER" | "SHOP_SUPERVISOR")[];
}

export interface ReportHistoryItem {
  id: string;
  reportName: string;
  generatedBy: string;
  date: string;
  format: "PDF" | "XLSX";
  status: "Completed" | "Processing" | "Failed";
}

// Cards
const REPORT_CARDS: ReportCardDef[] = [
  {
    id: "rep-1",
    name: "Daily Production Report",
    description: "Detailed compilation of locomotive completions, stage transitions, and current track berths distribution.",
    category: "Daily Work",
    size: "2.4 MB",
    allowedRoles: ["ADMIN", "PRODUCTION_MANAGER", "SHOP_SUPERVISOR"]
  },
  {
    id: "rep-2",
    name: "Weekly Production Report",
    description: "Aggregated trend metrics, assembly throughput performance, and locomotive completions vs scheduled goals.",
    category: "Production",
    size: "5.8 MB",
    allowedRoles: ["ADMIN", "PRODUCTION_MANAGER"]
  },
  {
    id: "rep-3",
    name: "Monthly Production Report",
    description: "Enterprise aggregate monthly audit log of BLW locomotive fabrication lines, quality reviews, and dispatch records.",
    category: "Production",
    size: "14.2 MB",
    allowedRoles: ["ADMIN", "PRODUCTION_MANAGER"]
  },
  {
    id: "rep-4",
    name: "Delay Analysis Report",
    description: "Incident tracking logs, component latency issues, material supply deficit, and root-cause analysis charts.",
    category: "Delay",
    size: "4.1 MB",
    allowedRoles: ["ADMIN", "PRODUCTION_MANAGER"]
  },
  {
    id: "rep-5",
    name: "Shop Performance Report",
    description: "Granular breakdown of production efficiency benchmarks, work hours, and completion rates per active shop berth.",
    category: "Shop",
    size: "3.5 MB",
    allowedRoles: ["ADMIN", "PRODUCTION_MANAGER", "SHOP_SUPERVISOR"]
  }
];

// History
const INITIAL_HISTORY: ReportHistoryItem[] = [
  {
    id: "hist-1",
    reportName: "Daily Production Report (June 19, 2026)",
    generatedBy: "System Automation",
    date: "2026-06-19 23:59",
    format: "PDF",
    status: "Completed"
  },
  {
    id: "hist-2",
    reportName: "Weekly Shop Performance Report (WK-24)",
    generatedBy: "Praveen Pandey",
    date: "2026-06-18 14:22",
    format: "XLSX",
    status: "Completed"
  },
  {
    id: "hist-3",
    reportName: "Delay Analysis Report - Paint Shop Incidents",
    generatedBy: "Ashish Kumar",
    date: "2026-06-17 11:05",
    format: "PDF",
    status: "Completed"
  },
  {
    id: "hist-4",
    reportName: "Monthly Asset Audit Log (May 2026)",
    generatedBy: "Rita Sen (Admin)",
    date: "2026-06-01 09:12",
    format: "XLSX",
    status: "Completed"
  },
  {
    id: "hist-5",
    reportName: "High Altitude Braking Test Report",
    generatedBy: "System Diagnostic Engine",
    date: "2026-06-20 03:00",
    format: "PDF",
    status: "Processing"
  }
];

export default function Reports() {
  const { user } = useAuth();
  const currentRole = user?.role || "SHOP_SUPERVISOR";

  const [history, setHistory] = useState<ReportHistoryItem[]>(INITIAL_HISTORY);
  const [successBanner, setSuccessBanner] = useState("");
  const [activePreview, setActivePreview] = useState<ReportCardDef | null>(null);
  const [loadingActionId, setLoadingActionId] = useState<string | null>(null);

  // Filter report cards based on role-based authorization
  const authorizedReportCards = REPORT_CARDS.filter(card => 
    card.allowedRoles.includes(currentRole as any)
  );

  const triggerDownloadAction = (reportName: string, format: "PDF" | "XLSX", id: string) => {
    setLoadingActionId(id);
    setTimeout(() => {
      setLoadingActionId(null);
      setSuccessBanner(`Successfully generated and downloaded "${reportName}" as a ${format} file.`);
      
      // Append to local history list dynamically!
      const newHistoryItem: ReportHistoryItem = {
        id: `hist-${Date.now()}`,
        reportName: `${reportName} (Custom Run)`,
        generatedBy: user?.name || "BLW Authenticator",
        date: new Date().toISOString().replace("T", " ").substring(0, 16),
        format: format,
        status: "Completed"
      };
      setHistory(prev => [newHistoryItem, ...prev]);

      setTimeout(() => setSuccessBanner(""), 4000);
    }, 1800);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">

      {/* Header Profile Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-slate-950 text-amber-500">
              <FileText className="h-5 w-5" />
            </span>
            Reports Center
          </h1>
          <p className="text-xs text-slate-500 mt-1 uppercase font-semibold font-mono tracking-wider">
            BLW Indian Railways • Locomotive Analytical Audits
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 font-mono flex items-center gap-1.5 uppercase">
            <User className="h-3.5 w-3.5 text-indigo-600" /> {currentRole.replace("_", " ")}
          </span>
        </div>
      </div>

      {/* Alert toast banners */}
      {successBanner && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-xl text-xs animate-fade-in font-medium shadow-xs select-none">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Dynamic Authorization Info Box */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-bold font-mono uppercase tracking-widest text-amber-400">CREDENTIALED WORKSTATION AUTHORIZATION</div>
          <p className="text-[11px] text-slate-350 max-w-xl">
            You currently hold access logs mapped to the <strong className="text-white">{currentRole}</strong> key. Showing only audited spreadsheet templates assigned under your clearance index.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5 bg-slate-950 rounded-xl border border-slate-800">
          <Lock className="h-3.5 w-3.5 text-amber-500 shrink-0" />
          {authorizedReportCards.length} / {REPORT_CARDS.length} AUDIT SHEETS AVAILABLE
        </div>
      </div>

      {/* SECTION 1: Report Cards Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest font-mono flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-slate-500" /> Authorized Audit Documents
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {authorizedReportCards.map((card) => (
            <div 
              key={card.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all relative flex flex-col justify-between overflow-hidden group min-h-[196px]"
            >
              {/* Category indicator line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-slate-900" />

              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[9px] font-black uppercase font-mono border border-slate-200">
                    {card.category}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 font-mono uppercase">{card.size}</span>
                </div>

                <h4 className="text-sm font-extrabold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                  {card.name}
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {card.description}
                </p>
              </div>

              {/* Card Actions Footer */}
              <div className="border-t border-slate-100/80 mt-4 pt-3.5 flex items-center gap-1.5 select-none text-xs">
                {/* View/Analyze Action */}
                <button
                  onClick={() => setActivePreview(card)}
                  className="p-2 aspect-square flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-650 rounded-lg border border-slate-150 transition cursor-pointer"
                  title="View analytics logs"
                >
                  <Eye className="h-3.5 w-3.5" />
                </button>

                {/* PDF Generation */}
                <button
                  disabled={loadingActionId !== null}
                  onClick={() => triggerDownloadAction(card.name, "PDF", `${card.id}-pdf`)}
                  className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-lg font-mono text-[10px] tracking-wider uppercase transition flex items-center justify-center gap-1 shadow-2xs border border-transparent disabled:opacity-50 cursor-pointer"
                >
                  {loadingActionId === `${card.id}-pdf` ? (
                    <RefreshCw className="h-3 w-3 animate-spin text-amber-500" />
                  ) : (
                    <FileText className="h-3 w-3 text-red-400" />
                  )}
                  PDF
                </button>

                {/* Excel Compilation */}
                <button
                  disabled={loadingActionId !== null}
                  onClick={() => triggerDownloadAction(card.name, "XLSX", `${card.id}-xlsx`)}
                  className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold rounded-lg font-mono text-[10px] tracking-wider uppercase transition flex items-center justify-center gap-1 border border-slate-200 disabled:opacity-50 cursor-pointer"
                >
                  {loadingActionId === `${card.id}-xlsx` ? (
                    <RefreshCw className="h-3 w-3 animate-spin text-slate-500" />
                  ) : (
                    <FileSpreadsheet className="h-3 w-3 text-emerald-600" />
                  )}
                  XLSX
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: Audited Report Logs Table History */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-150 pb-2">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest font-mono flex items-center gap-2">
            <ListCollapse className="h-4 w-4 text-slate-500" /> Historical Performance Logs
          </h3>
          <span className="text-[10px] font-mono font-bold text-slate-450 uppercase">{history.length} FILES RETRIEVED</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-150 overflow-hidden shadow-xs">
          <ResponsiveTableWrapper>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-150 font-mono text-[9px] font-black uppercase text-slate-400 tracking-wider">
                  <th className="px-6 py-3.5">Audit Report Name</th>
                  <th className="px-6 py-3.5">Triggered By</th>
                  <th className="px-6 py-3.5">Timestamp</th>
                  <th className="px-6 py-3.5">Extension</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans text-xs text-slate-700">
                {history.map((hist) => (
                  <tr key={hist.id} className="hover:bg-slate-50/50 transition duration-150">
                    <td className="px-6 py-4 font-semibold text-slate-900">{hist.reportName}</td>
                    <td className="px-6 py-4 text-slate-550 font-medium">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-slate-300" />
                        {hist.generatedBy}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-[11px] text-slate-450">{hist.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black font-mono border ${
                        hist.format === "PDF" 
                          ? "bg-red-50 text-red-750 border-red-100" 
                          : "bg-emerald-50 text-emerald-750 border-emerald-100"
                      }`}>
                        {hist.format}
                      </span>
                    </td>
                    <td className="px-6 py-4 select-none">
                      {hist.status === "Completed" ? (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 font-mono uppercase bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                          <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full" /> Completed
                        </span>
                      ) : hist.status === "Processing" ? (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-600 font-mono uppercase bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 animate-pulse">
                          <span className="h-1.5 w-1.5 bg-amber-500 rounded-full animate-ping" /> Processing
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-red-650 font-mono uppercase bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                          <span className="h-1.5 w-1.5 bg-red-500 rounded-full" /> Failed
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right select-none">
                      <button
                        onClick={() => {
                          setSuccessBanner(`Downloading copy of "${hist.reportName}" directly from analytical archive storage.`);
                          setTimeout(() => setSuccessBanner(""), 4000);
                        }}
                        disabled={hist.status === "Processing"}
                        className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-650 rounded-lg border border-slate-200 hover:border-slate-350 transition text-[10px] font-extrabold uppercase font-mono tracking-wider disabled:opacity-50 cursor-pointer inline-flex items-center gap-1"
                        title="Download file from archive"
                      >
                        <Download className="h-3 w-3" /> Get
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ResponsiveTableWrapper>
        </div>
      </div>

      {/* DIALOG PREVIEW MODAL */}
      {activePreview && (
        <div className="fixed inset-0 bg-slate-950/60 flex items-center justify-center p-4 z-50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden animate-scale-up">
            
            <div className="bg-slate-900 p-4.5 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <BarChart2 className="h-4.5 w-4.5 text-amber-500" />
                <span className="font-extrabold text-sm font-mono uppercase tracking-tight">{activePreview.name} Analytics Mockup</span>
              </div>
              <button 
                onClick={() => setActivePreview(null)}
                className="p-1.5 rounded bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 font-mono text-slate-700">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 flex justify-between gap-4 flex-wrap text-xs">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">SHEET INDEX</div>
                  <div className="text-slate-950 font-extrabold text-sm mt-0.5">{activePreview.name}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">CLEARANCE REQUIRED</div>
                  <div className="text-indigo-600 font-extrabold mt-0.5 uppercase text-[11px]">{activePreview.category} APPROVED</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">FILE SEGMENT SIZE</div>
                  <div className="text-slate-950 font-extrabold mt-0.5 text-[11px]">{activePreview.size}</div>
                </div>
              </div>

              {/* Visualization Grid Panel */}
              <div className="border border-slate-150 rounded-xl overflow-hidden text-xs">
                <div className="bg-slate-100 p-2 border-b border-slate-150 font-bold text-[9px] uppercase tracking-widest text-slate-400">
                  Mockup Analytics Telemetry View (WAG12-101 Series)
                </div>
                <div className="p-4 space-y-3 font-sans">
                  
                  {/* Stats bars */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-bold text-slate-650">
                      <span>Bogie Wheel Alignment Accuracy</span>
                      <span className="font-mono text-slate-800 text-xs">99.2%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full">
                      <div className="h-full bg-indigo-600 rounded-full" style={{ width: "99.2%" }} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-bold text-slate-650">
                      <span>Electrical Logic Safety Rating</span>
                      <span className="font-mono text-slate-800 text-xs">98.5%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: "98.5%" }} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-bold text-slate-650">
                      <span>Curing Block Temperature Indices</span>
                      <span className="font-mono text-slate-800 text-xs">92.0%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: "92%" }} />
                    </div>
                  </div>

                </div>
              </div>

              <div className="text-[11px] leading-relaxed text-slate-450 border-t border-slate-100 pt-4 font-sans">
                ⚠️ *Mock analytical telemetry shown for illustration purposes only. Real PDF compilation incorporates detailed BLW Locomotive class schedules and transit matrices.*
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-4 border-t border-slate-150 flex justify-end">
              <button
                onClick={() => setActivePreview(null)}
                className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer transition select-none"
              >
                Close Preview
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
