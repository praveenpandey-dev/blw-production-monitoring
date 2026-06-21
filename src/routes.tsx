import React from "react";
import { createBrowserRouter, Link, Navigate } from "react-router-dom";
import AppLayout from "./layouts/AppLayout.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import RoleProtectedRoute from "./components/RoleProtectedRoute.tsx";
import Login from "./pages/Login.tsx";
import Unauthorized from "./pages/Unauthorized.tsx";
import ShopSupervisorDashboard from "./pages/shop-supervisor/ShopSupervisorDashboard.tsx";
import AssignedLocomotives from "./pages/shop-supervisor/AssignedLocomotives.tsx";
import UpdateProgress from "./pages/shop-supervisor/UpdateProgress.tsx";
import ReportDelay from "./pages/shop-supervisor/ReportDelay.tsx";
import HistoryPage from "./pages/shop-supervisor/History.tsx";
import { useAuth } from "./context/AuthContext.tsx";

// Simple dynamic landing logic based on authentications
function HomeRedirect() {
  const { isAuthenticated, user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center font-mono text-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
        <span className="mt-4 text-xs font-bold uppercase tracking-widest text-slate-400">Loading Session...</span>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case "ADMIN":
      return <Navigate to="/admin/dashboard" replace />;
    case "PRODUCTION_MANAGER":
      return <Navigate to="/pm/dashboard" replace />;
    case "SHOP_SUPERVISOR":
      return <Navigate to="/shop/dashboard" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
}
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import UserManagement from "./pages/admin/UserManagement.tsx";
import RoleManagement from "./pages/admin/RoleManagement.tsx";
import ShopManagement from "./pages/admin/ShopManagement.tsx";
import LocomotiveManagement from "./pages/admin/LocomotiveManagement.tsx";
import Reports from "./pages/common/Reports.tsx";
import Settings from "./pages/common/Settings.tsx";
import Profile from "./pages/common/Profile.tsx";
import Notifications from "./pages/common/Notifications.tsx";
import ProductionManagerDashboard from "./pages/production-manager/ProductionManagerDashboard.tsx";
import LiveShopMonitoring from "./pages/production-manager/LiveShopMonitoring.tsx";
import LocomotiveTracking from "./pages/production-manager/LocomotiveTracking.tsx";
import LifecycleTracking from "./pages/production-manager/LifecycleTracking.tsx";
import DelayMonitoring from "./pages/production-manager/DelayMonitoring.tsx";
import Analytics from "./pages/production-manager/Analytics.tsx";
import { 
  Building2, 
  Users as UsersIcon, 
  Wrench, 
  Train, 
  BarChart, 
  FileSpreadsheet, 
  Settings as SettingsIcon,
  Plus,
  PlayCircle,
  Clock,
  CheckCircle,
  FileDown,
  Lock,
  ExternalLink
} from "lucide-react";

// ============================================================================
// REUSABLE SHADCN/UI STYLE COMPONENT WRAPPERS (Tailwind Enterprise Presets)
// ============================================================================

export function Button({ 
  children, 
  className = "", 
  variant = "default", 
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" }) {
  const baseStyle = "inline-flex items-center justify-center gap-2 rounded-lg text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer h-9 px-4 py-2 select-none";
  const variants = {
    default: "bg-slate-900 text-white hover:bg-slate-800 shadow-xs",
    destructive: "bg-red-600 text-white hover:bg-red-500 shadow-xs",
    outline: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900",
    secondary: "bg-slate-100 text-slate-800 hover:bg-slate-200",
    ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
  };
  const selectedVariant = variants[variant] || variants.default;
  return (
    <button className={`${baseStyle} ${selectedVariant} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function Card({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`rounded-xl border border-slate-200 bg-white text-slate-950 shadow-xs overflow-hidden transition-all hover:border-slate-300 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`flex flex-col space-y-1.5 p-5 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = "", ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={`text-sm font-semibold tracking-tight text-slate-900 ${className}`} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = "", ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`text-xs text-slate-400 font-medium ${className}`} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`px-5 pb-5 pt-0 text-xs text-slate-600 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`flex items-center justify-between p-4 bg-slate-50/50 border-t border-slate-100 text-xs text-slate-500 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function Input({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="text"
      className={`flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs shadow-2xs transition-all placeholder:text-slate-400 focus:outline-none focus:border-slate-800 focus:ring-2 focus:ring-slate-100 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}

// ============================================================================
// ROUTE PAGE WRAPPERS (Pure visual enterprise layouts)
// ============================================================================

// 1. Dashboard View
function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Locomotive Production Control</h1>
          <p className="text-xs text-slate-400 mt-0.5">Production planning overview and heavy engineering shop status.</p>
        </div>
        <div className="flex gap-2 mt-3 md:mt-0">
          <Button variant="outline">Export Layout</Button>
          <Button variant="default">
            <Plus className="h-3.5 w-3.5" /> New Loco Build
          </Button>
        </div>
      </div>

      {/* Grid Status Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription className="uppercase tracking-wider">Fabrication Active</CardDescription>
            <CardTitle className="text-2xl font-bold mt-1 text-slate-900">14 Units</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <span>+3 units scheduled</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription className="uppercase tracking-wider">Engine Assembly Line</CardDescription>
            <CardTitle className="text-2xl font-bold mt-1 text-slate-900">92% Load</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[11px] text-amber-600 font-semibold flex items-center gap-1">
              <span>Optimal load threshold</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription className="uppercase tracking-wider">Operators Active</CardDescription>
            <CardTitle className="text-2xl font-bold mt-1 text-slate-900">42 Supervisors</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[11px] text-indigo-600 font-semibold flex items-center gap-1">
              <span>Role configuration ADMIN</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription className="uppercase tracking-wider font-semibold">Active Warnings</CardDescription>
            <CardTitle className="text-2xl font-bold mt-1 text-red-600">0 Faults</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[11px] text-slate-400 flex items-center gap-1">
              <span>All diagnostics passing</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Primary Panels Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Double Section Placeholder */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Fabrication Milestones</CardTitle>
                  <CardDescription>Continuous assembly history tracker across manufacturing plants.</CardDescription>
                </div>
                <span className="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-600 font-bold uppercase tracking-wide">Live Stream</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 pt-1">
                {[
                  { time: "09:42 AM", loco: "WAG-9HC #33908", status: "Chassis Frame Welding Complete", shop: "Welding Shop 4", icon: CheckCircle, color: "text-emerald-500 bg-emerald-50" },
                  { time: "08:15 AM", loco: "WAP-7 #30412", status: "Traction Motor Wiring Rig", shop: "Electrical Shop 8", icon: Clock, color: "text-amber-500 bg-amber-50" },
                  { time: "Yesterday", loco: "WDM-3D #11422", status: "Engine Block Crankcase Fit", shop: "Assembly Plant 2", icon: Wrench, color: "text-blue-500 bg-blue-50" },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3.5 items-start bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                    <div className={`p-2 rounded ${item.color}`}>
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-slate-900 text-xs">{item.loco}</span>
                        <span className="text-[10px] text-slate-400 font-medium">{item.time}</span>
                      </div>
                      <p className="text-slate-500 text-xs mt-0.5">{item.status}</p>
                      <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 font-semibold uppercase">
                        <Building2 className="h-3 w-3" />
                        <span>{item.shop}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Section Placeholder */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Operator Actions Panel</CardTitle>
              <CardDescription>Shortcut utilities and permissions control.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3.5">
              <div className="p-3.5 rounded-lg border border-indigo-100 bg-indigo-50/30">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="h-2 w-2 rounded-full bg-indigo-500" />
                  <span className="text-xs font-bold text-indigo-950 uppercase tracking-wide">Enterprise Profile</span>
                </div>
                <p className="text-xs text-indigo-900 leading-relaxed">
                  Your current account is authenticated with the <strong className="font-semibold text-indigo-950">ADMIN</strong> privilege role group, granting access to fabrication controls.
                </p>
              </div>

              <div className="space-y-2">
                <Button variant="outline" className="w-full text-left justify-start">
                  <PlayCircle className="h-4 w-4 text-slate-500" /> Run Line Diagnostics
                </Button>
                <Link to="/reports" className="block w-full">
                  <Button variant="outline" className="w-full text-left justify-start">
                    <FileSpreadsheet className="h-4 w-4 text-slate-500" /> Compile Shop Logs
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// 2. Users View
function UsersPage() {
  const users = [
    { name: "Praveen Pandey", role: "ADMIN", title: "Chief Supervisor", shop: "HQ Command Centre", status: "Active" },
    { name: "Suresh Sharma", role: "SUPERVISOR", title: "Electrical Heavy-Lead", shop: "Electrical Shop 8", status: "Active" },
    { name: "Anil Kulkarni", role: "OPERATOR", title: "Chassis Welding Specialist", shop: "Welding Shop 4", status: "Off-shift" },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 pb-5">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Users & Roles</h1>
        <p className="text-xs text-slate-400 mt-0.5">Manage operator permissions, supervisory personnel, and credentials.</p>
      </div>

      <div className="flex gap-2">
        <div className="max-w-xs flex-1">
          <Input placeholder="Filter workforce by name or title..." />
        </div>
        <Button>Search Operators</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {users.map((user, idx) => (
          <Card key={idx}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded tracking-wide uppercase ${
                  user.role === "ADMIN" ? "bg-indigo-50 text-indigo-700 border border-indigo-100" :
                  user.role === "SUPERVISOR" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                  "bg-slate-100 text-slate-700"
                }`}>
                  {user.role}
                </span>
                <span className={`h-2 w-2 rounded-full ${user.status === "Active" ? "bg-emerald-500" : "bg-slate-300"}`} />
              </div>
              <CardTitle className="mt-2 text-base">{user.name}</CardTitle>
              <CardDescription>{user.title}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium pt-1">
                <Building2 className="h-3.5 w-3.5 text-slate-400" />
                <span>Stationed at {user.shop}</span>
              </div>
            </CardContent>
            <CardFooter>
              <span className="text-[10px] text-slate-400">Security Clearance Level V</span>
              <Button variant="ghost" className="h-8 px-2 text-indigo-600 font-bold hover:text-indigo-900">Edit Info</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

// 3. Shops View
function ShopsPage() {
  const shops = [
    { title: "Welding Shop 4", activeBuilds: "4 locomotives", load: "84%", head: "Supervisor A. Patil" },
    { title: "Electrical Shop 8", activeBuilds: "3 locomotives", load: "70%", head: "Lead S. Sharma" },
    { title: "Assembly Plant 2", activeBuilds: "5 locomotives", load: "95%", head: "Director P. Joshi" },
    { title: "Quality Audit Bay 1", activeBuilds: "2 locomotives", load: "30%", head: "Auditor M. Nair" },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 pb-5">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Manufacturing & Assembly Shops</h1>
        <p className="text-xs text-slate-400 mt-0.5">Heavy fabrication workshops and progress loads inside BLW premises.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {shops.map((shop, idx) => (
          <Card key={idx}>
            <CardHeader>
              <CardTitle>{shop.title}</CardTitle>
              <CardDescription>Managed by {shop.head}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Current Occupancy:</span>
                <span className="font-semibold text-slate-800">{shop.activeBuilds}</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Load Capacity:</span>
                  <span className="font-semibold text-slate-800">{shop.load}</span>
                </div>
                {/* Clean mock progress bar */}
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-900 rounded-full" style={{ width: shop.load }}></div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full text-xs">View Workshop Details</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

// 4. Locomotives View
function LocomotivesPage() {
  const locos = [
    { id: "WAP-7 #30412", classType: "Passenger Electric", progress: 68, priority: "Critical", status: "Electrical Installation" },
    { id: "WAG-9HC #33908", classType: "Freight Heavy Electric", progress: 85, priority: "High", status: "Chassis Alignment" },
    { id: "WDM-3D #11422", classType: "Shunting Mixed Diesel", progress: 12, priority: "Medium", status: "Underframe Welding" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Active Locomotive Builds</h1>
          <p className="text-xs text-slate-400 mt-0.5">Registry database of diesel and electric train units undergoing production.</p>
        </div>
        <Button>
          <Plus className="h-4 w-4" /> Add New Build Record
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 max-w-sm">
          <Input placeholder="Search build registries..." />
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Class Filter</Button>
          <Button variant="outline">Progress Status</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {locos.map((loco, idx) => (
          <Card key={idx}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-mono text-[10px] uppercase font-bold">{loco.classType}</span>
                <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                  loco.priority === "Critical" ? "bg-red-50 text-red-700 border border-red-100 animate-pulse" :
                  loco.priority === "High" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                  "bg-slate-100 text-slate-700"
                }`}>
                  {loco.priority} Priority
                </span>
              </div>
              <CardTitle className="mt-2.5 text-base">{loco.id}</CardTitle>
              <CardDescription>Stage: {loco.status}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Fabrication Stage Progress:</span>
                  <span className="font-semibold text-slate-900">{loco.progress}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-900 rounded-full transition-all duration-300" style={{ width: `${loco.progress}%` }}></div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <span className="text-[10px] text-slate-400 font-medium">Updated 10m ago</span>
              <Button variant="ghost" className="text-indigo-600 font-bold hover:text-indigo-900">Manage Stage</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

// 5. Reports View
function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 pb-5">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Production Logs & Reports</h1>
        <p className="text-xs text-slate-400 mt-0.5">Analyze and generate production sheets, test reports, and quality logs.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Compile Custom Report</CardTitle>
              <CardDescription>Select filters and parameters to compile a heavy vehicle production review sheet.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Timeframe</label>
                  <select className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-slate-800">
                    <option>Last 24 Hours</option>
                    <option>Last 7 Days</option>
                    <option>Current Calendar Month</option>
                    <option>Custom Date Range</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Active Workshop</label>
                  <select className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-slate-800">
                    <option>All Assembly Stations</option>
                    <option>Welding Shop 4</option>
                    <option>Electrical Shop 8</option>
                    <option>Assembly Plant 2</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Output Export Filename</label>
                <Input placeholder="BLW_locomotive_fabrication_report_Jun2026" />
              </div>

              <div className="flex gap-2 justify-end pt-2 border-t border-slate-150">
                <Button variant="outline">Reset Fields</Button>
                <Button>
                  <FileDown className="h-4 w-4" /> Generate Report (Mock)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Ready Export Logs</CardTitle>
              <CardDescription>Pre-compiled monthly reports approved by operations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { title: "Monthly Quality Log (May 2026)", size: "4.8 MB", date: "June 01, 2026" },
                { title: "Electrical Commissioning Stat", size: "1.2 MB", date: "May 24, 2026" },
                { title: "Rolling Stock Inventory Audit", size: "11.5 MB", date: "May 15, 2026" },
              ].map((report, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-lg">
                  <div className="flex flex-col min-w-0 pr-2">
                    <span className="font-semibold text-xs text-slate-800 truncate">{report.title}</span>
                    <span className="text-[10px] text-slate-400 font-medium mt-0.5">{report.date} &bull; {report.size}</span>
                  </div>
                  <Button variant="outline" className="h-8 w-8 px-0 shrink-0">
                    <FileDown className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// 6. Settings View
function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 pb-5">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">System & Security Configuration</h1>
        <p className="text-xs text-slate-400 mt-0.5">Manage fabrication thresholds, security clearance, and local telemetry links.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fabrication Alerts & Calibration</CardTitle>
              <CardDescription>Define system-wide critical alerts for plant lines.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3.5">
                <div className="flex items-center justify-between p-3.5 rounded-lg border border-slate-100 bg-slate-50/50">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-800">Automatic Backup Logs</span>
                    <span className="text-[10px] text-slate-400 font-medium mt-0.5">Persist fabrication audit logs locally every 4 hours.</span>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900" />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-lg border border-slate-100 bg-slate-50/50">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-800">Critical Shop Threshold Warning</span>
                    <span className="text-[10px] text-slate-400 font-medium mt-0.5">Trigger notification alarms if shop occupation exceed 90%.</span>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900" />
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-100">
                <Button>Save Settings Configuration</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-indigo-600" />
                <CardTitle>Enterprise Credentials</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Access Tier</span>
                <p className="text-xs text-slate-800 font-semibold flex items-center gap-1.5">
                  <span>Level 5 (HQ Administration)</span>
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Server Status</span>
                <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Cloud Production Online</span>
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">VCO Database Endpoint</span>
                <p className="text-xs text-slate-500 font-mono">blw-loco-prod-v1.cl.local</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ENTERPRISE APP ROUTER DEF
// ============================================================================

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/unauthorized",
    element: <ProtectedRoute><Unauthorized /></ProtectedRoute>,
  },
  {
    path: "/",
    element: <ProtectedRoute><AppLayout /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <HomeRedirect />,
      },
      {
        path: "admin/dashboard",
        element: <RoleProtectedRoute allowedRoles={["ADMIN"]}><AdminDashboard /></RoleProtectedRoute>,
      },
      {
        path: "users",
        element: <RoleProtectedRoute allowedRoles={["ADMIN"]}><UserManagement /></RoleProtectedRoute>,
      },
      {
        path: "roles",
        element: <RoleProtectedRoute allowedRoles={["ADMIN"]}><RoleManagement /></RoleProtectedRoute>,
      },
      {
        path: "shops",
        element: <RoleProtectedRoute allowedRoles={["ADMIN"]}><ShopManagement /></RoleProtectedRoute>,
      },
      {
        path: "locomotives",
        element: <RoleProtectedRoute allowedRoles={["ADMIN"]}><LocomotiveManagement /></RoleProtectedRoute>,
      },
      {
        path: "reports",
        element: <Reports />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "notifications",
        element: <Notifications />,
      },
      {
        path: "pm/dashboard",
        element: <RoleProtectedRoute allowedRoles={["PRODUCTION_MANAGER"]}><ProductionManagerDashboard /></RoleProtectedRoute>,
      },
      {
        path: "production-manager",
        element: <Navigate to="/pm/dashboard" replace />,
      },
      {
        path: "production-manager/live-shop",
        element: <RoleProtectedRoute allowedRoles={["PRODUCTION_MANAGER"]}><LiveShopMonitoring /></RoleProtectedRoute>,
      },
      {
        path: "production-manager/locomotives",
        element: <RoleProtectedRoute allowedRoles={["PRODUCTION_MANAGER"]}><LocomotiveTracking /></RoleProtectedRoute>,
      },
      {
        path: "production-manager/lifecycle",
        element: <RoleProtectedRoute allowedRoles={["PRODUCTION_MANAGER"]}><LifecycleTracking /></RoleProtectedRoute>,
      },
      {
        path: "production-manager/delay-monitoring",
        element: <RoleProtectedRoute allowedRoles={["PRODUCTION_MANAGER"]}><DelayMonitoring /></RoleProtectedRoute>,
      },
      {
        path: "production-manager/analytics",
        element: <RoleProtectedRoute allowedRoles={["PRODUCTION_MANAGER"]}><Analytics /></RoleProtectedRoute>,
      },
      {
        path: "shop/dashboard",
        element: <RoleProtectedRoute allowedRoles={["SHOP_SUPERVISOR"]}><ShopSupervisorDashboard /></RoleProtectedRoute>,
      },
      {
        path: "shop/assigned-locomotives",
        element: <RoleProtectedRoute allowedRoles={["SHOP_SUPERVISOR"]}><AssignedLocomotives /></RoleProtectedRoute>,
      },
      {
        path: "shop/update-progress",
        element: <RoleProtectedRoute allowedRoles={["SHOP_SUPERVISOR"]}><UpdateProgress /></RoleProtectedRoute>,
      },
      {
        path: "shop/report-delay",
        element: <RoleProtectedRoute allowedRoles={["SHOP_SUPERVISOR"]}><ReportDelay /></RoleProtectedRoute>,
      },
      {
        path: "shop/history",
        element: <RoleProtectedRoute allowedRoles={["SHOP_SUPERVISOR"]}><HistoryPage /></RoleProtectedRoute>,
      },
    ],
  },
]);
