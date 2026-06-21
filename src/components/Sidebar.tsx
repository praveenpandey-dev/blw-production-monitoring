import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";
import { 
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
import { motion } from "motion/react";

interface SidebarProps {
  role?: string;
}

export default function Sidebar({ role = "ADMIN" }: SidebarProps) {
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

  const handleLogoutClick = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside id="app-sidebar" className="fixed left-0 top-0 z-20 hidden md:flex h-screen w-[72px] lg:w-[280px] flex-col border-r border-slate-100 bg-white pt-16 transition-all duration-200">
      {/* Navigation Items */}
      <nav className="flex-1 space-y-1.5 px-2.5 lg:px-4 py-6 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `group relative flex items-center justify-center lg:justify-start gap-0 lg:gap-3.5 rounded-lg px-2 lg:px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-slate-50 text-slate-900 border-l-2 border-slate-900 -ml-0.5"
                    : "text-slate-500 hover:bg-slate-50/50 hover:text-slate-900"
                }`
              }
              title={item.name}
            >
              {({ isActive }) => (
                <>
                  <Icon 
                    className={`h-[18px] w-[18px] transition-transform duration-200 group-hover:scale-105 shrink-0 ${
                      isActive ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600"
                    }`} 
                  />
                  <span className="hidden lg:inline truncate">{item.name}</span>
                  
                  {/* Decorative indicator dots or labels */}
                  {isActive && (
                    <motion.div
                       layoutId="active-pill"
                       className="absolute right-3 h-1.5 w-1.5 rounded-full bg-slate-900 hidden lg:block"
                       transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer / User Profile section */}
      <div className="border-t border-slate-100 p-3 lg:p-4 bg-slate-50/50">
        <div className="flex items-center gap-3 rounded-lg p-2 bg-white border border-slate-100 shadow-sm min-w-0 justify-center lg:justify-start">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white font-semibold text-xs tracking-wider">
            {user?.name.split(" ").map(n => n[0]).join("") || "BLW"}
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 border-2 border-white">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            </span>
          </div>
          <div className="flex flex-col min-w-0 flex-1 hidden lg:flex animate-in fade-in duration-150">
            <span className="truncate text-xs font-semibold text-slate-800">{user?.name || "BLW Operator"}</span>
            <div className="flex items-center gap-1.5 mt-0.5 min-w-0">
              <ShieldAlert className="h-3 w-3 text-indigo-600 shrink-0" />
              <span className="truncate text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-1.5 py-0.25 rounded">
                {user?.role || role}
              </span>
            </div>
          </div>
          <button 
            id="logout-btn"
            type="button"
            onClick={handleLogoutClick}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors shrink-0 hidden lg:block"
            title="Log Out"
          >
            <LogOut className="h-[15px] w-[15px]" />
          </button>
        </div>
      </div>
    </aside>
  );
}

