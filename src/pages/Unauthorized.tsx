import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, ArrowLeft, LogOut, LayoutGrid } from "lucide-react";
import { useAuth } from "../context/AuthContext.tsx";
import { Button } from "../routes.tsx";

export default function Unauthorized() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleGoToDashboard = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    switch (user.role) {
      case "ADMIN":
        navigate("/admin/dashboard");
        break;
      case "PRODUCTION_MANAGER":
        navigate("/pm/dashboard");
        break;
      case "SHOP_SUPERVISOR":
        navigate("/shop/dashboard");
        break;
      default:
        navigate("/login");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Decorative ambient glass backdrops */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-red-900/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-indigo-950/20 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/60 border border-slate-800 backdrop-blur-md rounded-2xl p-8 shadow-2xl relative z-10 text-center">
        {/* Shield Icon Visual */}
        <div className="mx-auto h-16 w-16 bg-red-950/50 border border-red-850 text-red-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-red-950/20">
          <ShieldAlert className="h-8 w-8" />
        </div>

        {/* Text Area */}
        <h1 className="text-xl font-black text-white uppercase tracking-wider font-mono">403 Shield Triggered</h1>
        <p className="text-xs text-slate-400 font-medium uppercase font-mono mt-1 tracking-widest text-red-400">
          Access Level Verification Failed
        </p>

        <p className="text-xs text-slate-350 mt-4 leading-relaxed max-w-sm mx-auto">
          Your current personnel credentials <span className="font-mono text-white bg-slate-800 px-1.5 py-0.5 rounded font-bold">{user?.role || "UNKNOWN"}</span> do not match the clearances required to access this digital workshop zone.
        </p>

        {/* User context breakdown snippet */}
        {user && (
          <div className="mt-6 p-4 bg-slate-950/50 border border-slate-800/80 rounded-xl text-left font-mono">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Active Personnel profile</span>
            <div className="flex items-center justify-between mt-2 text-xs">
              <span className="text-slate-400 font-bold">{user.name}</span>
              <span className="text-slate-500 font-semibold text-[10px] bg-slate-850 px-1.5 py-0.25 rounded">
                {user.role}
              </span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">{user.shop}</div>
          </div>
        )}

        {/* Primary Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={handleGoToDashboard} 
            className="flex-1 bg-white hover:bg-slate-100 text-slate-900 font-bold h-10 border-0 flex justify-center"
          >
            <LayoutGrid className="h-4 w-4 mr-1 shrink-0" /> Go to Dashboard
          </Button>
          <Button 
            onClick={handleLogout} 
            variant="ghost"
            className="flex-1 border border-slate-705 text-slate-300 hover:text-white hover:bg-slate-800 font-bold h-10 flex justify-center"
          >
            <LogOut className="h-4 w-4 mr-1 shrink-0" /> Change User Code
          </Button>
        </div>
      </div>
    </div>
  );
}
