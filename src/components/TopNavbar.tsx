import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";
import { 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  Menu, 
  ChevronDown, 
  Settings, 
  User, 
  Monitor, 
  Gauge
} from "lucide-react";

interface TopNavbarProps {
  onToggleMobileSidebar?: () => void;
  role?: string;
}

export default function TopNavbar({ onToggleMobileSidebar, role = "ADMIN" }: TopNavbarProps) {
  const { user } = useAuth();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  return (
    <header id="app-top-navbar" className="fixed top-0 left-0 right-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-150 bg-white/95 px-4 backdrop-blur-sm md:px-6">
      {/* Brand Logo & Mobile Trigger */}
      <div className="flex items-center gap-3">
        <button
          id="mobile-sidebar-toggle"
          type="button"
          onClick={onToggleMobileSidebar}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 md:hidden focus:outline-none transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <a href="/" className="flex items-center gap-2.5 group">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-amber-500 font-bold tracking-tight shadow-md transition-transform group-hover:scale-105">
            <Gauge className="h-5 w-5 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm tracking-tight text-slate-900 uppercase">
              BLW Locomotives
            </span>
            <span className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">
              Production Monitor
            </span>
          </div>
        </a>
      </div>

      {/* Global Locomotive Search */}
      <div className="hidden sm:flex max-w-md flex-1 px-8">
        <div className="relative w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className={`h-[15px] w-[15px] transition-colors duration-200 ${searchFocused ? "text-slate-900" : "text-slate-400"}`} />
          </div>
          <input
            id="locomotive-search"
            type="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Search locomotives by class, serial, or shop status..."
            className={`block w-full rounded-md border py-1.5 pl-9 pr-12 text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition-all duration-200 ${
              searchFocused 
                ? "border-slate-800 bg-white ring-2 ring-slate-100" 
                : "border-slate-200 bg-slate-50/50 hover:bg-slate-50"
            }`}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-0.5 rounded border border-slate-200 bg-white px-1.5 font-mono text-[9px] font-medium text-slate-400 shadow-sm">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Control Actions & Utility Panel */}
      <div className="flex items-center gap-2.5">
        {/* Mock Theme Toggle Placeholder */}
        <div id="theme-toggle-placeholder" className="relative group select-none">
          <Link
            to="/settings"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
            title="Workspace settings / Appearance"
          >
            <Sun className="h-4.5 w-4.5 block dark:hidden" />
            <Moon className="h-4.5 w-4.5 hidden dark:block" />
          </Link>
        </div>

        {/* Notifications System */}
        <Link
          id="notifications-bell"
          to="/notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer select-none"
          title="Notification center"
        >
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
          </span>
        </Link>

        {/* Separator */}
        <div className="h-5 w-px bg-slate-200 mx-1"></div>

        {/* User profile dropdown area */}
        <Link 
          to="/profile"
          className="flex items-center gap-2 pr-1 select-none cursor-pointer group"
          title="My Profile"
        >
          <div className="flex flex-col text-right hidden lg:flex">
            <span className="text-xs font-semibold text-slate-800 group-hover:text-amber-600 transition-colors">{user?.name || "Praveen Pandey"}</span>
            <span className="text-[10px] text-slate-400 font-medium">{user?.title || "Chief Supervisor"}</span>
          </div>
          <div
            id="user-profile-menu-btn"
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 p-1.5 text-slate-600 group-hover:bg-slate-150 transition-colors focus:outline-none"
          >
            {user?.photoUrl ? (
              <img
                src={user.photoUrl}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="h-6 w-6 object-cover rounded-full"
              />
            ) : (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 font-bold text-white text-[10px] tracking-wide font-mono">
                {user?.name.split(" ").map(n => n[0]).join("") || "PP"}
              </div>
            )}
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </div>
        </Link>
      </div>
    </header>
  );
}
