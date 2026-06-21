import { useState } from "react";
import { 
  Bell, 
  Check, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Info, 
  AlertOctagon, 
  Inbox,
  Sparkles,
  Train
} from "lucide-react";

export interface BLWNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "INFO";
  status: "READ" | "UNREAD";
  shop?: string;
  locoNumber?: string;
}

const INITIAL_NOTIFICATIONS: BLWNotification[] = [
  {
    id: "notif-1",
    title: "Delay reported in Paint Shop",
    message: "WAG12-214 paint coating deferred due to humidity level crossing safety index (now 85% RH).",
    timestamp: "10 mins ago",
    priority: "CRITICAL",
    status: "UNREAD",
    shop: "Paint Shop",
    locoNumber: "WAG12-214"
  },
  {
    id: "notif-2",
    title: "WAG12-101 moved to Testing Center",
    message: "Electrical logic diagnostics finished under Assembly Block Route 4. Lifted to active testing berth.",
    timestamp: "1 hour ago",
    priority: "INFO",
    status: "UNREAD",
    shop: "Testing Center",
    locoNumber: "WAG12-101"
  },
  {
    id: "notif-3",
    title: "Daily report compiled",
    message: "Automated aggregate statistics report generated for shift index A & B. Files ready for review.",
    timestamp: "4 hours ago",
    priority: "INFO",
    status: "READ"
  },
  {
    id: "notif-4",
    title: "Machine breakdown reported",
    message: "Pneumatic rivet compressor block C is reporting severe pressure drop. Structural welding paused.",
    timestamp: "1 day ago",
    priority: "CRITICAL",
    status: "UNREAD",
    shop: "Bogie Shop"
  },
  {
    id: "notif-5",
    title: "System maintenance warning",
    message: "Production logs database maintenance scheduled for Sunday at 02:00 IST. Read-only limits active.",
    timestamp: "2 days ago",
    priority: "MEDIUM",
    status: "READ"
  },
  {
    id: "notif-6",
    title: "Safety Inspector compliance log",
    message: "Safety auditing completed on Bogie subgrade berths. Standard safety alignment clearance gained.",
    timestamp: "3 days ago",
    priority: "HIGH",
    status: "READ",
    shop: "Bogie Shop"
  }
];

export default function Notifications() {
  const [notifications, setNotifications] = useState<BLWNotification[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<"ALL" | "UNREAD" | "CRITICAL">("ALL");

  // Filter computations
  const filteredNotifications = notifications.filter(notif => {
    if (filter === "UNREAD") return notif.status === "UNREAD";
    if (filter === "CRITICAL") return notif.priority === "CRITICAL";
    return true;
  });

  // Unread badge count
  const unreadCount = notifications.filter(n => n.status === "UNREAD").length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, status: "READ" } : notif
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, status: "READ" })));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  // Helper styles for priority
  const getBannerBadge = (priority: BLWNotification["priority"]) => {
    switch (priority) {
      case "CRITICAL":
        return {
          bg: "bg-red-550 mr-2.5",
          text: "bg-red-50 text-red-700 border-red-200",
          icon: <AlertOctagon className="h-3.5 w-3.5 text-red-650 shrink-0" />
        };
      case "HIGH":
        return {
          bg: "bg-orange-400 mr-2.5",
          text: "bg-orange-50 text-orange-700 border-orange-200",
          icon: <AlertTriangle className="h-3.5 w-3.5 text-orange-600 shrink-0" />
        };
      case "MEDIUM":
        return {
          bg: "bg-amber-400 mr-2.5",
          text: "bg-amber-50 text-amber-700 border-amber-200",
          icon: <Clock className="h-3.5 w-3.5 text-amber-600 shrink-0" />
        };
      default:
        return {
          bg: "bg-indigo-400 mr-2.5",
          text: "bg-indigo-50 text-indigo-700 border-indigo-200",
          icon: <Info className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
        };
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">

      {/* Header Notification Titles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-slate-950 text-amber-500">
              <Bell className="h-5 w-5 animate-pulse" />
            </span>
            Notifications
            {unreadCount > 0 && (
              <span className="h-6 px-2.5 bg-red-600 rounded-full font-mono text-white text-xs font-black flex items-center justify-center shadow-sm">
                {unreadCount} NEW
              </span>
            )}
          </h1>
          <p className="text-xs text-slate-500 mt-1 uppercase font-semibold font-mono tracking-wider">
            BLW Indian Railways • Live Alarm Dispatch Console
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-extrabold bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition cursor-pointer"
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            Mark All Read
          </button>
        )}
      </div>

      {/* Industrial Filters Row */}
      <div className="flex items-center justify-between bg-slate-100 p-1 rounded-xl border border-slate-200/50">
        <div className="flex items-center gap-1.5 flex-1 w-full sm:w-auto">
          
          {/* ALL FILTER */}
          <button
            onClick={() => setFilter("ALL")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition font-mono uppercase tracking-wider cursor-pointer ${
              filter === "ALL"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-550 hover:bg-slate-200/60 hover:text-slate-900"
            }`}
          >
            All Logs ({notifications.length})
          </button>

          {/* UNREAD */}
          <button
            onClick={() => setFilter("UNREAD")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition font-mono uppercase tracking-wider cursor-pointer ${
              filter === "UNREAD"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-550 hover:bg-slate-200/60 hover:text-slate-900"
            }`}
          >
            Unread ({notifications.filter(n => n.status === "UNREAD").length})
          </button>

          {/* CRITICAL */}
          <button
            onClick={() => setFilter("CRITICAL")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition font-mono uppercase tracking-wider cursor-pointer flex items-center gap-1.5 ${
              filter === "CRITICAL"
                ? "bg-red-700 text-white shadow-xs"
                : "text-red-650 hover:bg-red-50 hover:text-red-800"
            }`}
          >
            Critical ({notifications.filter(n => n.priority === "CRITICAL").length})
          </button>

        </div>
      </div>

      {/* Notifications List Container */}
      <div className="space-y-3.5">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-150 p-12 text-center flex flex-col items-center justify-center shadow-xs">
            <div className="h-14 w-14 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-4 shadow-inner">
              <Inbox className="h-6 w-6 stroke-[1.5]" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider font-mono">No Notifications Found</h3>
            <p className="text-xs text-slate-450 mt-1 max-w-sm">
              Your alarm log dashboard is perfectly clean. Operational telemetry is locked green with no flagged errors.
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif) => {
            const priorityConfig = getBannerBadge(notif.priority);

            return (
              <div 
                key={notif.id}
                className={`group rounded-2xl border transition relative p-5 flex flex-col md:flex-row md:items-start justify-between gap-4 ${
                  notif.status === "UNREAD"
                    ? "bg-slate-900 text-white border-slate-850 shadow-md"
                    : "bg-white text-slate-800 border-slate-200/80 hover:bg-slate-50/50 shadow-xs"
                }`}
              >
                
                {/* Left Indicator bar */}
                <div className={`absolute top-0 bottom-0 left-0 w-1.5 rounded-l-2xl ${
                  notif.priority === "CRITICAL" ? "bg-red-650" : 
                  notif.priority === "HIGH" ? "bg-orange-500" :
                  notif.priority === "MEDIUM" ? "bg-amber-400" : "bg-indigo-500"
                }`} />

                {/* Content Section */}
                <div className="flex items-start gap-3.5 pl-2">
                  <div className={`mt-0.5 p-2 rounded-xl border ${
                    notif.status === "UNREAD" ? "bg-slate-800 border-slate-700/60" : "bg-slate-100 border-slate-200/60"
                  }`}>
                    {priorityConfig.icon}
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <h4 className={`text-sm font-extrabold tracking-tight ${notif.status === "UNREAD" ? "text-white" : "text-slate-900"}`}>
                        {notif.title}
                      </h4>
                      
                      {/* Priority Badges */}
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase font-mono border ${
                        notif.status === "UNREAD" 
                          ? "bg-slate-800 text-slate-350 border-slate-700" 
                          : priorityConfig.text
                      }`}>
                        {notif.priority}
                      </span>

                      {/* Locomotives Badge */}
                      {notif.locoNumber && (
                        <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 text-[9px] font-black uppercase font-mono flex items-center gap-1 shadow-xs">
                          <Train className="h-2.5 w-2.5" /> {notif.locoNumber}
                        </span>
                      )}
                    </div>

                    <p className={`text-xs leading-relaxed max-w-2xl ${notif.status === "UNREAD" ? "text-slate-300" : "text-slate-550"}`}>
                      {notif.message}
                    </p>

                    <div className="flex items-center gap-2 text-[10px] font-bold font-mono uppercase tracking-wider pt-1">
                      <span className={notif.status === "UNREAD" ? "text-slate-400" : "text-slate-400"}>
                        {notif.timestamp}
                      </span>
                      {notif.shop && (
                        <>
                          <span className="text-slate-400">•</span>
                          <span className={notif.status === "UNREAD" ? "text-amber-400" : "text-slate-500"}>
                            {notif.shop}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right actions: Mark Read or Delete */}
                <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center pl-12 md:pl-0 z-10 select-none">
                  {notif.status === "UNREAD" ? (
                    <button
                      onClick={() => handleMarkAsRead(notif.id)}
                      className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-750 text-[10px] font-black uppercase font-mono tracking-wider text-amber-500 rounded-lg hover:text-white border border-slate-750 transition flex items-center gap-1 cursor-pointer"
                      title="Mark as read"
                    >
                      <Check className="h-3 w-3" /> Mark Read
                    </button>
                  ) : (
                    <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400 px-2 py-1 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Read
                    </span>
                  )}

                  <button
                    onClick={() => handleDeleteNotification(notif.id)}
                    className="p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-650 rounded-lg border border-transparent hover:border-red-200 transition-all cursor-pointer"
                    title="Dismiss alarm"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Operational guidelines telemetry warning */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-150 flex items-start gap-3">
        <Sparkles className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <div className="font-extrabold text-slate-800">BLW Automatic Failback Logs</div>
          <p className="text-slate-500 text-[11px] leading-relaxed">
            Operational warning dispatch is synchronized in real-time with automatic failsafe parameters. Critical alerts demand supervisor attention with direct escalation logs transited to the command center.
          </p>
        </div>
      </div>

    </div>
  );
}
