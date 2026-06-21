import React, { useState } from "react";
import { 
  Settings as SettingsIcon, 
  User, 
  Eye, 
  Bell, 
  Cpu, 
  Lock, 
  Check, 
  Laptop, 
  Mail, 
  Phone, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  Info,
  Building2,
  ChevronRight,
  ArrowRight
} from "lucide-react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  Button, 
  Input 
} from "../../routes.tsx";

const WORKFLOW_STEPS = [
  "Frame Fabrication",
  "Bogie Shop",
  "Shell Assembly",
  "Electrical Assembly",
  "Brake Shop",
  "Paint Shop",
  "Testing Center",
  "Dispatch Center"
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState<"profile" | "appearance" | "notifications" | "system">("profile");

  // Profile forms
  const [name, setName] = useState("Praveen Pandey");
  const [email, setEmail] = useState("praveen.pandey@blw.in");
  const [role, setRole] = useState("SUPER_ADMIN_LEVEL_3");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [password, setPassword] = useState("••••••••••••••");

  // Appearance theme selector
  const [selectedTheme, setSelectedTheme] = useState<"light" | "dark">("light");

  // Notifications toggles
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyDelay, setNotifyDelay] = useState(true);
  const [notifyDaily, setNotifyDaily] = useState(false);
  const [notifyWeekly, setNotifyWeekly] = useState(true);

  // System parameters
  const [systemName, setSystemName] = useState("BLW Production Monitoring System");
  const [systemVersion, setSystemVersion] = useState("v2.4.1-Stable");

  const handleSaveSettings = () => {
    alert(`Configuration updated successfully! Registered changes on ${activeTab.toUpperCase()} matrix sub-registers.`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-slate-100 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="flex h-2.5 w-2.5 rounded-full bg-indigo-600 animate-pulse" />
          <span className="text-[10px] font-bold tracking-widest uppercase text-indigo-600 font-mono bg-indigo-50 px-2 rounded-md">
            Management Cabin
          </span>
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">System Settings</h1>
        <p className="text-xs text-slate-400 mt-0.5">Manage administrative credentials, layout preferences, and notification overrides.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-12 items-start">
        {/* SIDE BAR NAVIGATION TABS */}
        <div className="md:col-span-3">
          <Card className="border border-slate-250 bg-slate-50/50 p-2 space-y-1.5 shadow-3xs">
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full text-left flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === "profile" 
                  ? "bg-slate-900 text-white shadow-sm" 
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <User className="h-4 w-4 shrink-0" />
              <span>Personal Profile</span>
            </button>

            <button
              onClick={() => setActiveTab("appearance")}
              className={`w-full text-left flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === "appearance" 
                  ? "bg-slate-900 text-white shadow-sm" 
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Laptop className="h-4 w-4 shrink-0" />
              <span>Appearance & Theme</span>
            </button>

            <button
              onClick={() => setActiveTab("notifications")}
              className={`w-full text-left flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === "notifications" 
                  ? "bg-slate-900 text-white shadow-sm" 
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Bell className="h-4 w-4 shrink-0" />
              <span>Email & Delay Alerts</span>
            </button>

            <button
              onClick={() => setActiveTab("system")}
              className={`w-full text-left flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === "system" 
                  ? "bg-slate-900 text-white shadow-sm" 
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Cpu className="h-4 w-4 shrink-0" />
              <span>System & Workflow</span>
            </button>
          </Card>
        </div>

        {/* ACTIVE TAB CORE INTERFACE CONTAINER */}
        <div className="md:col-span-9">
          <Card className="border border-slate-200">
            <CardContent className="p-6">
              
              {/* TAB 1: PROFILE */}
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-950 uppercase tracking-wide">Personal Profile Identification</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">Manage details linked to your secure administrative authorization key.</p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Full Name</label>
                      <Input value={name} onChange={(e) => setName(e.target.value)} />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Official Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Designated Security Role</label>
                      <div className="relative">
                        <ShieldCheck className="absolute left-2.5 top-2.5 h-4 w-4 text-emerald-600" />
                        <Input value={role} disabled className="pl-9 bg-slate-50 text-slate-500 font-mono font-bold text-[10px] uppercase" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Emergency Secure Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                        <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-9" />
                      </div>
                    </div>
                  </div>

                  {/* Password modifier */}
                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <span className="text-[11px] font-extrabold uppercase text-indigo-600 tracking-wider flex items-center gap-1.5 font-mono">
                      <Lock className="h-3.5 w-3.5" /> Re-calibrate Cryptographic Password
                    </span>
                    
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">New Security Password</span>
                        <Input type="password" placeholder="Define maximum length alphanumeric sequence" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase font-mono">Confirm Security Password</span>
                        <Input type="password" placeholder="Retype matching characters" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: APPEARANCE */}
              {activeTab === "appearance" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-950 uppercase tracking-wide">Workspace Appearance Theme</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">Toggle screen modes representing shop floor lighting paradigms.</p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 pt-2">
                    {/* Light option */}
                    <button
                      type="button"
                      onClick={() => setSelectedTheme("light")}
                      className={`text-left border rounded-xl overflow-hidden shadow-3xs p-3 focus:outline-none transition-all ${
                        selectedTheme === "light" 
                          ? "border-indigo-600 ring-2 ring-indigo-50" 
                          : "border-slate-200 opacity-75 hover:opacity-100"
                      }`}
                    >
                      <div className="bg-slate-50 p-6 rounded-lg border border-slate-100 flex flex-col gap-1.5 relative">
                        <div className="h-3.5 w-24 bg-slate-900 rounded-sm" />
                        <div className="h-2 w-14 bg-slate-300 rounded-sm" />
                        <div className="grid grid-cols-3 gap-1 mt-1">
                          <div className="h-4 bg-white rounded border border-slate-150" />
                          <div className="h-4 bg-white rounded border border-slate-150" />
                          <div className="h-4 bg-white rounded border border-slate-150" />
                        </div>
                        {selectedTheme === "light" && (
                          <div className="absolute right-2 top-2 h-5 w-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                            ✓
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-bold text-slate-800 block mt-3 font-mono">BLW Classical Light (RECOMMENDED)</span>
                      <p className="text-[10px] text-slate-400 mt-0.5">High-contrast bright daylight mode, optimized for industrial control rooms.</p>
                    </button>

                    {/* Dark option */}
                    <button
                      type="button"
                      onClick={() => setSelectedTheme("dark")}
                      className={`text-left border rounded-xl overflow-hidden shadow-3xs p-3 focus:outline-none transition-all ${
                        selectedTheme === "dark" 
                          ? "border-slate-900 ring-2 ring-slate-100" 
                          : "border-slate-200 opacity-75 hover:opacity-100"
                      }`}
                    >
                      <div className="bg-slate-950 p-6 rounded-lg border border-slate-900 flex flex-col gap-1.5 relative">
                        <div className="h-3.5 w-24 bg-white/20 rounded-sm" />
                        <div className="h-2 w-14 bg-white/10 rounded-sm" />
                        <div className="grid grid-cols-3 gap-1 mt-1">
                          <div className="h-4 bg-white/5 rounded border border-white/10" />
                          <div className="h-4 bg-white/5 rounded border border-white/10" />
                          <div className="h-4 bg-white/5 rounded border border-white/10" />
                        </div>
                        {selectedTheme === "dark" && (
                          <div className="absolute right-2 top-2 h-5 w-5 rounded-full bg-slate-100 text-slate-850 flex items-center justify-center font-bold text-xs shadow-sm">
                            ✓
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-bold text-slate-800 block mt-3 font-mono">Deep Carbon Indigo Dark</span>
                      <p className="text-[10px] text-slate-400 mt-0.5">Warm dark canvas representing carbon steel components. Lowers eye strain.</p>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: NOTIFICATIONS */}
              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-950 uppercase tracking-wide">Email Alerts & Broadcast Configuration</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">Subscribe or disconnect automated daily summaries and delay bypass locks.</p>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {/* Toggle 1: Email Notifications */}
                    <div className="py-3.5 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">General Email Notifications</span>
                        <p className="text-[10px] text-slate-400 mt-0.5">Receive shift start notifications and database status logs.</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setNotifyEmail(!notifyEmail)}
                        className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          notifyEmail ? "bg-slate-900" : "bg-slate-200"
                        }`}
                      >
                        <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          notifyEmail ? "translate-x-5" : "translate-x-0"
                        }`} />
                      </button>
                    </div>

                    {/* Toggle 2: Delay alerts */}
                    <div className="py-3.5 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Immediate Delay Critical bypass Alerts</span>
                        <p className="text-[10px] text-slate-400 mt-0.5">Receive automated high-priority triggers if any shop sequence is delayed &gt; 2 hours.</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setNotifyDelay(!notifyDelay)}
                        className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          notifyDelay ? "bg-slate-900" : "bg-slate-200"
                        }`}
                      >
                        <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          notifyDelay ? "translate-x-5" : "translate-x-0"
                        }`} />
                      </button>
                    </div>

                    {/* Toggle 3: Daily report logs */}
                    <div className="py-3.5 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Daily Production Summary Reports</span>
                        <p className="text-[10px] text-slate-400 mt-0.5">Receive email compiled files containing total rollouts and efficiency parameters.</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setNotifyDaily(!notifyDaily)}
                        className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          notifyDaily ? "bg-slate-900" : "bg-slate-200"
                        }`}
                      >
                        <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          notifyDaily ? "translate-x-5" : "translate-x-0"
                        }`} />
                      </button>
                    </div>

                    {/* Toggle 4: Weekly report logs */}
                    <div className="py-3.5 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Weekly Enterprise Strategic Overviews</span>
                        <p className="text-[10px] text-slate-400 mt-0.5">Receive comprehensive graphs representing velocity trend curves and shop benchmarks.</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setNotifyWeekly(!notifyWeekly)}
                        className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          notifyWeekly ? "bg-slate-900" : "bg-slate-200"
                        }`}
                      >
                        <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          notifyWeekly ? "translate-x-5" : "translate-x-0"
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: SYSTEM */}
              {activeTab === "system" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-950 uppercase tracking-wide">System & Workflow Config</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">Verify system names, micro-service engine levels, and standard heavy sequence lines.</p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 pt-2">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Master System Identifier Name</span>
                      <Input value={systemName} onChange={(e) => setSystemName(e.target.value)} />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Engine Version Level</span>
                      <Input value={systemVersion} disabled className="bg-slate-50 text-slate-500 font-mono font-bold" />
                    </div>
                  </div>

                  {/* Standard workflow visualization */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 space-y-3">
                    <span className="text-[10px] font-extrabold uppercase font-mono text-slate-500 tracking-wider flex items-center gap-1.5">
                      <Cpu className="h-3.5 w-3.5" /> Workflow Sequence Viewer
                    </span>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
                      Primary cascade sequence tracked on production charts. Changing steps requires database migration commands.
                    </p>

                    <div className="overflow-x-auto">
                      <div className="flex gap-2 items-center min-w-[700px] py-1">
                        {WORKFLOW_STEPS.map((step, idx) => (
                          <React.Fragment key={idx}>
                            <div className="p-2 bg-white rounded border border-slate-200 shadow-3xs flex items-center gap-1 shrink-0">
                              <span className="h-4.5 w-4.5 rounded-full bg-slate-900 text-white font-mono font-bold text-[9px] flex items-center justify-center">
                                {idx + 1}
                              </span>
                              <span className="text-[10px] font-bold text-slate-700">{step}</span>
                            </div>
                            {idx < WORKFLOW_STEPS.length - 1 && (
                              <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SAVE ACTION BUTTONS */}
              <div className="mt-8 pt-4 border-t border-slate-100 flex gap-2 justify-end">
                <Button variant="outline" onClick={() => alert("Discard change queue parameters")}>Discard changes</Button>
                <Button onClick={handleSaveSettings} className="bg-slate-900 border-slate-900 text-white hover:bg-slate-800">
                  Save Settings Parameters
                </Button>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
