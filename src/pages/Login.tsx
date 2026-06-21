import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Lock,
  Mail,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  Train,
  User,
  LogIn,
  Loader2,
} from "lucide-react";
import { useAuth, Role } from "../context/AuthContext.tsx";

export default function Login() {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirection target from router state
  const from = (location.state as any)?.from?.pathname;

  React.useEffect(() => {
    if (isAuthenticated && user) {
      const defaultPath = getDefaultDashboard(user.role);
      navigate(from || defaultPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate, from]);

  const getDefaultDashboard = (userRole: Role): string => {
    switch (userRole) {
      case "ADMIN":
        return "/admin/dashboard";
      case "PRODUCTION_MANAGER":
        return "/pm/dashboard";
      case "SHOP_SUPERVISOR":
        return "/shop/dashboard";
      default:
        return "/";
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your BLW email address.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        // Navigation handled by useEffect above when user state updates
      } else {
        setError(result.error || "Authentication failed. Please check your credentials.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col lg:flex-row font-sans text-slate-800">

      {/* LEFT COLUMN: Clean White Credentials Entry Section */}
      <div className="w-full lg:w-[48%] xl:w-[44%] min-h-screen bg-[#fafbfc] sm:bg-white flex flex-col justify-between p-8 sm:p-12 md:p-16 overflow-y-auto shadow-2xl relative z-10">

        {/* LOGO AREA */}
        <div className="flex items-center gap-4 mb-8">
          <div className="h-11 w-11 shrink-0 flex items-center justify-center rounded-xl bg-[#912a1a] text-white shadow-md">
            <Train className="h-6 w-6 stroke-[2]" />
          </div>
          <div>
            <h2 className="text-2xl font-serif font-extrabold tracking-tight text-slate-900 leading-none">BLW</h2>
            <p className="text-[10px] text-slate-500 font-bold tracking-wider uppercase font-mono mt-1">
              Production Management System
            </p>
          </div>
        </div>

        {/* SIGN IN FORM BODY */}
        <div className="my-auto max-w-sm w-full mx-auto space-y-6">
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold font-sans text-slate-900 tracking-tight">
              Sign in to your account
            </h1>
            <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed font-medium">
              Enter your BLW credentials to access the production dashboard.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-xs flex items-start gap-2.5 font-medium leading-relaxed font-mono shadow-xs">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLoginSubmit}>
            {/* EMAIL */}
            <div className="space-y-1.5">
              <label htmlFor="blw-email" className="text-[11px] font-bold text-slate-700 uppercase tracking-wider font-sans">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="h-4 w-4 text-slate-400/80" />
                </div>
                <input
                  id="blw-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="admin@blw.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  className="block w-full h-11 pl-10 pr-4 bg-[#eaeced]/80 hover:bg-[#eaeced] focus:bg-white border border-transparent focus:border-slate-350 focus:outline-none rounded-xl text-xs sm:text-[13px] text-slate-900 font-medium placeholder-slate-400/80 transition-all shadow-inner disabled:opacity-60"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="space-y-1.5">
              <label htmlFor="blw-password" className="text-[11px] font-bold text-slate-700 uppercase tracking-wider font-sans">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4 text-slate-400/80" />
                </div>
                <input
                  id="blw-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  className="block w-full h-11 pl-10 pr-11 bg-[#eaeced]/80 hover:bg-[#eaeced] focus:bg-white border border-transparent focus:border-slate-350 focus:outline-none rounded-xl text-xs sm:text-[13px] text-slate-950 font-mono placeholder-slate-400/80 transition-all shadow-inner disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-800 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* REMEMBER ME & FORGOT PASSWORD */}
            <div className="flex items-center justify-between text-xs sm:text-[13px] pt-1 font-sans">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none font-semibold">
                <input
                  type="checkbox"
                  id="blw-remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded-md border-slate-300 text-teal-750 focus:ring-teal-750 cursor-pointer"
                />
                <span className="text-slate-600 font-medium">Remember me</span>
              </label>

              <a
                href="#forgot"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Please contact the BLW IT administrator to reset your password.");
                }}
                className="text-[#135154] hover:text-[#0b383b] font-extrabold transition-colors hover:underline"
              >
                Forgot password?
              </a>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              id="blw-signin-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-[#135154] hover:bg-[#0c393b] active:scale-[0.99] text-white font-extrabold tracking-wide flex items-center justify-center gap-2 rounded-xl border-none shadow-md hover:shadow-lg transition-all cursor-pointer font-sans text-xs sm:text-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Default credentials hint */}
          <div className="border border-slate-150 rounded-2xl bg-slate-50 overflow-hidden shadow-xs">
            <div className="px-4 py-3 border-b border-slate-100">
              <p className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                🔐 BLW Personnel Credentials
              </p>
            </div>
            <div className="p-4 space-y-2.5 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-white border border-slate-100 rounded-xl">
                  <span className="block text-indigo-700 text-[9.5px] font-bold uppercase tracking-wide">Administrator</span>
                  <span className="text-[10px] text-slate-500 block font-mono mt-0.5">Praveen Pandey</span>
                  <span className="text-[9px] text-slate-400 block font-mono">admin@blw.com</span>
                </div>
                <div className="p-2.5 bg-white border border-slate-100 rounded-xl">
                  <span className="block text-amber-600 text-[9.5px] font-bold uppercase tracking-wide">Prod. Manager</span>
                  <span className="text-[10px] text-slate-500 block font-mono mt-0.5">Ritik Dubey</span>
                  <span className="text-[9px] text-slate-400 block font-mono">pm@blw.com</span>
                </div>
              </div>
              <div className="p-2.5 bg-white border border-slate-100 rounded-xl">
                <span className="block text-emerald-700 text-[9.5px] font-bold uppercase tracking-wide mb-1">Shop Supervisors</span>
                <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
                  {[
                    { name: "Rahul Yadav", email: "frame@blw.com" },
                    { name: "Shailender Dubey", email: "bogie@blw.com" },
                    { name: "Aman Prajapati", email: "shell@blw.com" },
                    { name: "Tejas Pathak", email: "electrical@blw.com" },
                    { name: "Nikhil Mishra", email: "brake@blw.com" },
                    { name: "Ranvir Srivastava", email: "paint@blw.com" },
                    { name: "Ekansh Srivastava", email: "testing@blw.com" },
                    { name: "Harsh Singh", email: "dispatch@blw.com" },
                  ].map((sv) => (
                    <div key={sv.email}>
                      <span className="text-[9px] text-slate-600 font-semibold block truncate">{sv.name}</span>
                      <span className="text-[8.5px] text-slate-400 font-mono block truncate">{sv.email}</span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-[9.5px] text-slate-400 font-mono text-center pt-1">
                Default password: <span className="font-bold text-slate-600">BLW@2026!</span>
              </p>
            </div>
          </div>
        </div>

        {/* SECURED BAR */}
        <div className="text-center font-sans text-[11px] text-slate-400 flex items-center justify-center gap-1.5 pt-6">
          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Secured with enterprise-grade encryption</span>
        </div>
      </div>

      {/* RIGHT COLUMN: Cinematic Large Format Locomotive Construction Banner */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-[56%] min-h-screen bg-[#f3f4f6] p-6 lg:p-8 xl:p-10 flex-col justify-between relative select-none">

        {/* Rounded Container Box */}
        <div
          className="w-full h-full rounded-[28px] overflow-hidden relative shadow-2xl flex flex-col justify-end p-12 xl:p-16 bg-cover bg-center text-white"
          style={{
            backgroundImage: "url('/src/pages/3834ba35-63e7-4654-af36-2ae01f864985.png')"
          }}
        >
          {/* Dark gradient layer */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent z-10 opacity-90 pointer-events-none" />

          {/* Overhead light overlay */}
          <div className="absolute top-0 right-1/4 h-80 w-80 bg-cyan-500/5 blur-3xl pointer-events-none z-0" />

          {/* OVERLAY CONTENT */}
          <div className="relative z-20 space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-sans uppercase tracking-[0.25em] text-amber-400 font-extrabold flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-450" />
                Precision Engineering
              </h3>
              <p className="text-sm sm:text-base xl:text-lg text-slate-200 font-medium max-w-xl leading-relaxed tracking-wide">
                Powering locomotive production workflows across planning, assembly, and quality assurance.
              </p>
            </div>

            <div className="border-t border-slate-500/30 w-full" />

            {/* PRODUCTION METRICS */}
            <div className="grid grid-cols-3 gap-6 font-sans">
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl xl:text-4xl font-extrabold tracking-tight text-white font-serif">147</div>
                <div className="text-[10px] xl:text-xs text-slate-400 font-semibold tracking-wide uppercase">Active Units</div>
              </div>
              <div className="space-y-1 border-l border-slate-500/30 pl-6">
                <div className="text-2xl sm:text-3xl xl:text-4xl font-extrabold tracking-tight text-white font-serif">98.4%</div>
                <div className="text-[10px] xl:text-xs text-slate-400 font-semibold tracking-wide uppercase">On-Time Delivery</div>
              </div>
              <div className="space-y-1 border-l border-slate-500/30 pl-6">
                <div className="text-2xl sm:text-3xl xl:text-4xl font-extrabold tracking-tight text-white font-serif">12</div>
                <div className="text-[10px] xl:text-xs text-slate-400 font-semibold tracking-wide uppercase">Production Lines</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
