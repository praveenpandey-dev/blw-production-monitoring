import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar.tsx";
import TopNavbar from "../components/TopNavbar.tsx";
import { useAuth } from "../context/AuthContext.tsx";
import { 
  X, 
  LayoutDashboard, 
  Users, 
  Factory, 
  Train, 
  FileText, 
  Settings, 
  LogOut,
  ShieldAlert,
  Gauge,
  Sliders,
  Clock,
  BarChart2,
  AlertTriangle,
  History
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function AppLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const getNavigationItems = () => {
    if (!user) return [];
    
    switch (user.role) {
      case "ADMIN":
        return [
          { name: "Admin Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
          { name: "Users", href: "/users", icon: Users },
          { name: "Roles", href: "/roles", icon: ShieldAlert },
          { name: "Shops", href: "/shops", icon: Factory },
          { name: "Locomotives", href: "/locomotives", icon: Train },
          { name: "Reports", href: "/reports", icon: FileText },
          { name: "Settings", href: "/settings", icon: Settings },
        ];
      case "PRODUCTION_MANAGER":
        return [
          { name: "PM Dashboard", href: "/pm/dashboard", icon: LayoutDashboard },
          { name: "Live Shop Monitoring", href: "/production-manager/live-shop", icon: Factory },
          { name: "Locomotive Tracking", href: "/production-manager/locomotives", icon: Train },
          { name: "Lifecycle Tracking", href: "/production-manager/lifecycle", icon: Sliders },
          { name: "Delay Monitoring", href: "/production-manager/delay-monitoring", icon: Clock },
          { name: "Analytics Console", href: "/production-manager/analytics", icon: BarChart2 },
          { name: "Reports", href: "/reports", icon: FileText },
          { name: "Settings", href: "/settings", icon: Settings },
        ];
      case "SHOP_SUPERVISOR":
        return [
          { name: "Supervisor Dashboard", href: "/shop/dashboard", icon: LayoutDashboard },
          { name: "Assigned Locomotives", href: "/shop/assigned-locomotives", icon: Train },
          { name: "Update Progress", href: "/shop/update-progress", icon: Sliders },
          { name: "Report Delay", href: "/shop/report-delay", icon: AlertTriangle },
          { name: "Production History", href: "/shop/history", icon: History },
          { name: "Reports", href: "/reports", icon: FileText },
          { name: "Settings", href: "/settings", icon: Settings },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavigationItems();

  const handleLogoutClick = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans antialiased text-slate-800">
      {/* Top Header Controls */}
      <TopNavbar 
        onToggleMobileSidebar={() => setMobileSidebarOpen(true)} 
        role={user?.role || "GUEST"} 
      />

      {/* Enterprise Left Sidebar (Desktop) */}
      <Sidebar role={user?.role || "GUEST"} />

      {/* Mobile Drawer Overlay & Sidebar Navigation */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            {/* Backdrop cover */}
            <motion.div
              id="mobile-overlay-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
            />

            {/* Mobile Drawer Content */}
            <motion.div
              id="mobile-drawer-content"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-50 flex w-full max-w-[300px] flex-col bg-white border-r border-slate-100 shadow-2xl p-5 md:hidden"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <div className="flex flex-col">
                  <span className="font-bold text-slate-950 text-sm tracking-tight tracking-wider uppercase">
                    BLW Monitor
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">Enterprise Control Panel</span>
                </div>
                <button
                  id="close-mobile-menu"
                  type="button"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer Menu Items */}
              <nav className="flex-1 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3.5 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                          isActive
                            ? "bg-slate-950 text-white"
                            : "text-slate-605 hover:bg-slate-100/70 hover:text-slate-950"
                        }`
                      }
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </NavLink>
                  );
                })}
              </nav>

              {/* Drawer User info section */}
              <div className="border-t border-slate-100 pt-4 mt-auto">
                <div className="flex items-center justify-between rounded-lg p-2.5 bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white font-bold text-xs">
                      {user?.name.split(" ").map(n => n[0]).join("") || "BLW"}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="truncate text-xs font-semibold text-slate-800">{user?.name || "BLW Personnel"}</span>
                      <span className="truncate text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                        {user?.role || "GUEST"}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={handleLogoutClick}
                    className="p-1 px-1.5 hover:bg-red-50 text-red-505 rounded transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Enterprise Content Workspace */}
      <main className="min-h-screen pt-16 md:pl-[72px] lg:pl-[280px]">
        <div className="h-full px-4 py-6 md:px-8 md:py-8">
          {/* Animated wrapper to provide premium page fluid entry animations */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="mx-auto max-w-7xl"
          >
            <Outlet />
          </motion.div>
        </div>
      </main>
    </div>
  );
}

