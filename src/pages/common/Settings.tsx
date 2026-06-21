import { useState } from "react";
import { useAuth } from "../../context/AuthContext.tsx";
import { 
  Settings as SettingsIcon, 
  Palette, 
  Bell, 
  SlidersHorizontal, 
  Check, 
  Globe, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ShieldCheck,
  Moon,
  Sun,
  Laptop,
  User,
  Camera,
  Mail,
  Phone,
  Briefcase
} from "lucide-react";

type SettingsTab = "profile" | "appearance" | "notifications" | "preferences";

export default function Settings() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  // State values for profile
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "Praveen Pandey",
    email: user?.email || "pp002613@gmail.com",
    phone: user?.phone || "+91 94530 18451",
    photoUrl: user?.photoUrl || "",
    title: user?.title || "Chief System Administrator"
  });

  const PRESET_AVATARS = [
    {
      name: "Senior Officer",
      url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
    },
    {
      name: "Engineering Lead",
      url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
    },
    {
      name: "Quality Clearance",
      url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    },
    {
      name: "Chief Technical Inspector",
      url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
    }
  ];

  // Appearance & other state values
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
  
  const [notificationToggles, setNotificationToggles] = useState({
    emailAlerts: true,
    delayAlerts: true,
    productionUpdates: false,
    weeklyReports: true,
  });

  const [preferences, setPreferences] = useState({
    language: "en-IN",
    dateFormat: "DD-MM-YYYY",
    timeFormat: "24h"
  });

  const [bannerMsg, setBannerMsg] = useState("");

  const handleSaveSettings = () => {
    if (activeTab === "profile") {
      updateUser({
        name: profileForm.name,
        email: profileForm.email,
        phone: profileForm.phone,
        photoUrl: profileForm.photoUrl,
        title: profileForm.title
      });
      setBannerMsg("Security Profile credentials updated successfully!");
    } else {
      setBannerMsg("Configuration preferences updated! Session data refreshed.");
    }
    setTimeout(() => {
      setBannerMsg("");
    }, 4000);
  };

  const toggleSwitch = (key: keyof typeof notificationToggles) => {
    setNotificationToggles(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">

      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-slate-950 text-amber-500">
              <SettingsIcon className="h-5 w-5" />
            </span>
            System Settings
          </h1>
          <p className="text-xs text-slate-500 mt-1 uppercase font-semibold font-mono tracking-wider">
            BLW Indian Railways • System Configuration Panel
          </p>
        </div>
      </div>

      {/* Banner Message Alert */}
      {bannerMsg && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-xl text-xs animate-fade-in font-medium shadow-xs">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{bannerMsg}</span>
        </div>
      )}

      {/* Industrial Tabs Controller */}
      <div className="bg-slate-900 p-1.5 rounded-xl flex flex-wrap md:flex-nowrap items-center gap-1.5 border border-slate-800 shadow-md">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center justify-center gap-2 flex-1 py-2 px-3 rounded-lg text-xs font-bold transition font-mono uppercase tracking-wider cursor-pointer ${
            activeTab === "profile" 
              ? "bg-amber-500 text-slate-950 shadow-sm"
              : "text-slate-400 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <User className="h-3.5 w-3.5" />
          My Profile
        </button>

        <button
          onClick={() => setActiveTab("appearance")}
          className={`flex items-center justify-center gap-2 flex-1 py-2 px-3 rounded-lg text-xs font-bold transition font-mono uppercase tracking-wider cursor-pointer ${
            activeTab === "appearance" 
              ? "bg-amber-500 text-slate-950 shadow-sm"
              : "text-slate-400 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <Palette className="h-3.5 w-3.5" />
          Appearance
        </button>

        <button
          onClick={() => setActiveTab("notifications")}
          className={`flex items-center justify-center gap-2 flex-1 py-2 px-3 rounded-lg text-xs font-bold transition font-mono uppercase tracking-wider cursor-pointer ${
            activeTab === "notifications" 
              ? "bg-amber-500 text-slate-950 shadow-sm"
              : "text-slate-400 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <Bell className="h-3.5 w-3.5" />
          Notifications
        </button>

        <button
          onClick={() => setActiveTab("preferences")}
          className={`flex items-center justify-center gap-2 flex-1 py-2 px-3 rounded-lg text-xs font-bold transition font-mono uppercase tracking-wider cursor-pointer ${
            activeTab === "preferences" 
              ? "bg-amber-500 text-slate-950 shadow-sm"
              : "text-slate-400 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Preferences
        </button>
      </div>

      {/* Tabs Content Sections */}
      <div className="bg-white rounded-2xl border border-slate-150 p-6 shadow-sm min-h-[280px]">
        
        {/* TAB 0: PROFILE EDIT */}
        {activeTab === "profile" && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight uppercase font-mono flex items-center gap-2">
                <span className="p-1 rounded bg-amber-500 text-slate-950">
                  <User className="h-4 w-4" />
                </span>
                Edit Personal Security Profile
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Modify your human credentials, contact coordinates, and digital Identification photo. Updates sync instantly across BLW systems.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
              {/* Left Side: Avatar and Photo selection */}
              <div className="lg:col-span-5 space-y-5 border-r border-slate-100 pr-0 lg:pr-8">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Profile Photograph</label>
                  <div className="flex items-center gap-4 mt-2">
                    {profileForm.photoUrl ? (
                      <img
                        src={profileForm.photoUrl}
                        alt="Current Profile Photo"
                        referrerPolicy="no-referrer"
                        className="h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover border-2 border-slate-900 shadow-md transform hover:scale-105 transition duration-150"
                      />
                    ) : (
                      <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-slate-900 text-amber-500 flex items-center justify-center font-black text-2xl border-2 border-slate-800 shadow-inner">
                        {profileForm.name.split(" ").map(n => n[0]).join("")}
                      </div>
                    )}
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-slate-800">Identify Signature Image</div>
                      <div className="text-[10.5px] text-slate-400">Click a preset avatar or provide an external picture address below.</div>
                    </div>
                  </div>
                </div>

                {/* Preset Avatars Selection Grid */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1 pb-1">
                    <Camera className="h-3.5 w-3.5" /> Preset Crew Avatars
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {PRESET_AVATARS.map((av, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setProfileForm({ ...profileForm, photoUrl: av.url })}
                        className={`p-1.5 rounded-xl transition border text-center cursor-pointer group ${
                          profileForm.photoUrl === av.url ? "border-amber-500 bg-amber-50/50" : "border-slate-150 hover:bg-slate-50"
                        }`}
                        title={av.name}
                      >
                        <img
                          src={av.url}
                          alt={av.name}
                          referrerPolicy="no-referrer"
                          className="h-10 w-10 sm:h-11 sm:w-11 object-cover rounded-full mx-auto"
                        />
                        <span className="text-[9px] font-bold block text-slate-400 mt-1 truncate group-hover:text-slate-700">{av.name.split(" ")[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Photo URL Input */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Custom Image Web URL</label>
                  <input
                    type="url"
                    value={profileForm.photoUrl}
                    onChange={(e) => setProfileForm({ ...profileForm, photoUrl: e.target.value })}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-800"
                  />
                </div>

                {/* Preset Avatar Clean option */}
                {profileForm.photoUrl && (
                  <button
                    type="button"
                    onClick={() => setProfileForm({ ...profileForm, photoUrl: "" })}
                    className="text-[10px] font-bold text-red-650 hover:text-red-700 tracking-wide uppercase font-mono block transition cursor-pointer"
                  >
                    ✕ Reset to initials avatar
                  </button>
                )}
              </div>

              {/* Right Side: Form fields */}
              <div className="lg:col-span-7 space-y-4">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-slate-400" /> Full Legal Name
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-850 bg-slate-50/40 hover:bg-white"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-slate-400" /> Crew Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-850 bg-slate-50/40 hover:bg-white"
                  />
                </div>

                {/* Phone Contact */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-slate-400" /> Telephone Contact Number
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-850 bg-slate-50/40 hover:bg-white font-mono"
                  />
                </div>

                {/* Assigned Rank Title */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5 text-slate-400" /> Assigned Department Rank Title
                  </label>
                  <input
                    type="text"
                    value={profileForm.title}
                    onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-850 bg-slate-50/40 hover:bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* TAB 1: APPEARANCE */}
        {activeTab === "appearance" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight uppercase font-mono">
                Visual Workspace Skin
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Customize the lighting and dashboard presentation for long and late monitoring shifts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              
              {/* Light Theme Card */}
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`flex flex-col items-start p-4 rounded-xl border text-left transition relative select-none cursor-pointer ${
                  theme === "light"
                    ? "border-slate-900 ring-2 ring-slate-100 bg-slate-50"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <div className={`p-1.5 rounded-lg mb-4 ${theme === "light" ? "bg-amber-400 text-slate-950" : "bg-slate-100 text-slate-500"}`}>
                  <Sun className="h-4.5 w-4.5" />
                </div>
                <div className="text-xs font-extrabold text-slate-900">Light Theme</div>
                <div className="text-[10px] text-slate-450 mt-1 font-mono">Precision daylight aesthetics</div>
                {theme === "light" && (
                  <span className="absolute top-3 right-3 h-4 w-4 flex items-center justify-center rounded-full bg-slate-900 text-white">
                    <Check className="h-2.5 w-2.5" />
                  </span>
                )}
              </button>

              {/* Dark Theme Card */}
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`flex flex-col items-start p-4 rounded-xl border text-left transition relative select-none cursor-pointer ${
                  theme === "dark"
                    ? "border-slate-900 ring-2 ring-slate-100 bg-slate-50"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <div className={`p-1.5 rounded-lg mb-4 ${theme === "dark" ? "bg-amber-400 text-slate-950" : "bg-slate-100 text-slate-500"}`}>
                  <Moon className="h-4.5 w-4.5" />
                </div>
                <div className="text-xs font-extrabold text-slate-900">Dark Theme</div>
                <div className="text-[10px] text-slate-450 mt-1 font-mono">High contrast nocturnal eye-care</div>
                {theme === "dark" && (
                  <span className="absolute top-3 right-3 h-4 w-4 flex items-center justify-center rounded-full bg-slate-900 text-white">
                    <Check className="h-2.5 w-2.5" />
                  </span>
                )}
              </button>

              {/* System Default Theme Card */}
              <button
                type="button"
                onClick={() => setTheme("system")}
                className={`flex flex-col items-start p-4 rounded-xl border text-left transition relative select-none cursor-pointer ${
                  theme === "system"
                    ? "border-slate-900 ring-2 ring-slate-100 bg-slate-50"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <div className={`p-1.5 rounded-lg mb-4 ${theme === "system" ? "bg-amber-400 text-slate-950" : "bg-slate-100 text-slate-500"}`}>
                  <Laptop className="h-4.5 w-4.5" />
                </div>
                <div className="text-xs font-extrabold text-slate-900">System Default</div>
                <div className="text-[10px] text-slate-450 mt-1 font-mono">Sync with OS sensor telemetry</div>
                {theme === "system" && (
                  <span className="absolute top-3 right-3 h-4 w-4 flex items-center justify-center rounded-full bg-slate-900 text-white">
                    <Check className="h-2.5 w-2.5" />
                  </span>
                )}
              </button>

            </div>
          </div>
        )}

        {/* TAB 2: NOTIFICATIONS */}
        {activeTab === "notifications" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight uppercase font-mono">
                Logistics & Alert Notifications
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Configure when and where to broadcast critical warning alerts or telemetry logs.
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              
              {/* Toggle 1: Email Alerts */}
              <div className="flex items-center justify-between py-4 select-none">
                <div className="mr-8">
                  <div className="text-xs font-extrabold text-slate-800">Email Alerts</div>
                  <div className="text-[10.5px] text-slate-450 mt-0.5">Send structural shift certificates and approvals directly to email.</div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleSwitch("emailAlerts")}
                  className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                    notificationToggles.emailAlerts ? "bg-slate-900" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      notificationToggles.emailAlerts ? "translate-x-4.5" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 2: Delay Alerts */}
              <div className="flex items-center justify-between py-4 select-none">
                <div className="mr-8">
                  <div className="text-xs font-extrabold text-slate-800">Delay Alerts</div>
                  <div className="text-[10.5px] text-slate-450 mt-0.5 text-rose-600 font-medium">Broadcast critical and high-priority delay log alerts instantly.</div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleSwitch("delayAlerts")}
                  className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                    notificationToggles.delayAlerts ? "bg-slate-900" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      notificationToggles.delayAlerts ? "translate-x-4.5" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 3: Production Updates */}
              <div className="flex items-center justify-between py-4 select-none">
                <div className="mr-8">
                  <div className="text-xs font-extrabold text-slate-800">Production Updates</div>
                  <div className="text-[10.5px] text-slate-450 mt-0.5">Receive logs whenever a locomotive undergoes shop transitions or test clearances.</div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleSwitch("productionUpdates")}
                  className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                    notificationToggles.productionUpdates ? "bg-slate-900" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      notificationToggles.productionUpdates ? "translate-x-4.5" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 4: Weekly Reports */}
              <div className="flex items-center justify-between py-4 select-none">
                <div className="mr-8">
                  <div className="text-xs font-extrabold text-slate-800">Weekly Performance Reports</div>
                  <div className="text-[10.5px] text-slate-450 mt-0.5 font-mono">Consolidating PDF/XLSX summaries delivered regularly on Sunday 23:59.</div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleSwitch("weeklyReports")}
                  className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                    notificationToggles.weeklyReports ? "bg-slate-900" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      notificationToggles.weeklyReports ? "translate-x-4.5" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

            </div>
          </div>
        )}

        {/* TAB 3: PREFERENCES */}
        {activeTab === "preferences" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight uppercase font-mono">
                System Preferences & Localization
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Configure internationalization templates and timestamp displays for the fabrication blocks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
              
              {/* Language Selection */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5" /> System Language
                </span>
                <select
                  value={preferences.language}
                  onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-slate-800 bg-white"
                >
                  <option value="en-IN">English (India)</option>
                  <option value="hi-IN">Hindi (हिन्दी)</option>
                  <option value="en-US">English (US)</option>
                </select>
              </div>

              {/* Date Format Selection */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" /> Date Sequence Code
                </span>
                <select
                  value={preferences.dateFormat}
                  onChange={(e) => setPreferences({ ...preferences, dateFormat: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-slate-800 bg-white font-mono"
                >
                  <option value="DD-MM-YYYY">DD-MM-YYYY (eg. 20-06-2026)</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD (eg. 2026-06-20)</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY (eg. 06/20/2026)</option>
                </select>
              </div>

              {/* Time Format Selection */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" /> Locomotive Clock Log
                </span>
                <select
                  value={preferences.timeFormat}
                  onChange={(e) => setPreferences({ ...preferences, timeFormat: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-slate-800 bg-white"
                >
                  <option value="24h">24-Hour (Industrial ISO: eg. 16:30)</option>
                  <option value="12h">12-Hour (Standard eg. 04:30 PM)</option>
                </select>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* Primary Action Panel */}
      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-150">
        <div className="flex items-center gap-2 text-slate-450 hidden sm:flex">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <span className="text-[10px] font-mono font-bold tracking-wide uppercase">Preferences saved under local session</span>
        </div>
        <button
          onClick={handleSaveSettings}
          className="px-6 py-2 bg-slate-900 border border-slate-850 hover:bg-slate-850 text-white font-bold text-xs rounded-xl transition shadow-xs cursor-pointer w-full sm:w-auto"
        >
          Save Settings
        </button>
      </div>

    </div>
  );
}
