import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-mono">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-900 border-t-transparent" />
        <span className="mt-4 text-xs font-bold text-slate-550 uppercase tracking-widest">Verifying BLW Credentials...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login but save current location to return back
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
