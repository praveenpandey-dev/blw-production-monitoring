import React, { useState } from "react";
import { 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  ArrowDown, 
  Check, 
  X, 
  UserPlus, 
  UserMinus, 
  HelpCircle, 
  ChevronRight, 
  User, 
  Building2,
  Lock,
  ArrowUpCircle,
  ArrowDownCircle,
  Sparkles
} from "lucide-react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  Button 
} from "../../routes.tsx";
import { ResponsiveTableWrapper } from "../../components/ResponsiveTableWrapper.tsx";

// Types
type HierarchyRole = "ADMIN" | "PRODUCTION_MANAGER" | "SHOP_SUPERVISOR";

interface MatrixRow {
  feature: string;
  admin: boolean;
  manager: boolean;
  supervisor: boolean;
}

interface AssignedUser {
  id: string;
  name: string;
  currentRole: HierarchyRole;
}

const INITIAL_ASSIGNED_USERS: AssignedUser[] = [
  { id: "U-01", name: "Suresh Sharma", currentRole: "SHOP_SUPERVISOR" },
  { id: "U-02", name: "Ritik Dubey", currentRole: "PRODUCTION_MANAGER" },
  { id: "U-03", name: "Rajesh Kulkarni", currentRole: "SHOP_SUPERVISOR" },
  { id: "U-04", name: "Vikram Malhotra", currentRole: "PRODUCTION_MANAGER" },
  { id: "U-05", name: " नेहा देशमुख (Neha Deshmukh)", currentRole: "SHOP_SUPERVISOR" },
];

const PERMISSION_ROWS: MatrixRow[] = [
  { feature: "Dashboard Access", admin: true, manager: true, supervisor: true },
  { feature: "User Management", admin: true, manager: false, supervisor: false },
  { feature: "Role Management", admin: true, manager: false, supervisor: false },
  { feature: "Shop Management", admin: true, manager: true, supervisor: false },
  { feature: "Locomotive Tracking", admin: true, manager: true, supervisor: true },
  { feature: "Lifecycle Tracking", admin: true, manager: true, supervisor: true },
  { feature: "Reports Generation", admin: true, manager: true, supervisor: true },
  { feature: "Analytics Compilation", admin: true, manager: true, supervisor: false },
  { feature: "Delay Management Bypass", admin: true, manager: true, supervisor: true },
];

export default function RoleManagement() {
  const [assignedUsers, setAssignedUsers] = useState<AssignedUser[]>(INITIAL_ASSIGNED_USERS);

  const handlePromote = (id: string) => {
    setAssignedUsers(assignedUsers.map(user => {
      if (user.id === id) {
        let nextRole: HierarchyRole = user.currentRole;
        if (user.currentRole === "SHOP_SUPERVISOR") {
          nextRole = "PRODUCTION_MANAGER";
        } else if (user.currentRole === "PRODUCTION_MANAGER") {
          nextRole = "ADMIN";
        }
        return { ...user, currentRole: nextRole };
      }
      return user;
    }));
  };

  const handleDemote = (id: string) => {
    setAssignedUsers(assignedUsers.map(user => {
      if (user.id === id) {
        let nextRole: HierarchyRole = user.currentRole;
        if (user.currentRole === "ADMIN") {
          nextRole = "PRODUCTION_MANAGER";
        } else if (user.currentRole === "PRODUCTION_MANAGER") {
          nextRole = "SHOP_SUPERVISOR";
        }
        return { ...user, currentRole: nextRole };
      }
      return user;
    }));
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-slate-100 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="flex h-2.5 w-2.5 rounded-full bg-indigo-600" />
          <span className="text-[10px] font-bold tracking-widest uppercase text-indigo-600 font-mono bg-indigo-50 px-2 rounded-md">
            Operational Matrix
          </span>
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Role Management</h1>
        <p className="text-xs text-slate-400 mt-0.5">Manage administrative hierarchy, feature permission matrices, and roster levels.</p>
      </div>

      {/* SECTION 1: Visual Hierarchy Diagram */}
      <Card className="border border-slate-200">
        <CardHeader>
          <CardTitle>Visual Hierarchy Diagram</CardTitle>
          <CardDescription>
            High-level cascading structures of systemic locomotive access controls.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2 pb-6">
          <div className="relative flex flex-col items-center max-w-lg mx-auto py-4 space-y-6">
            
            {/* Level 1: ADMIN */}
            <div className="relative group w-full max-w-sm h-full rounded-xl border border-indigo-200 bg-indigo-50/20 p-4 shadow-3xs flex items-center gap-4.5 transition-all">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shrink-0">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[9px] font-bold text-indigo-700 tracking-widest uppercase">Level III HQ Command</span>
                <h4 className="text-sm font-bold text-slate-900 mt-0.5">Admin (ADMIN)</h4>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-0.5">
                  Universal database write access, safety overrides, system configurations, and user assignment locks.
                </p>
              </div>
            </div>

            {/* Down Connector 1 */}
            <div className="flex flex-col items-center">
              <ArrowDown className="text-indigo-400 h-5 w-5 animate-bounce" />
            </div>

            {/* Level 2: PRODUCTION MANAGER */}
            <div className="relative group w-full max-w-sm h-full rounded-xl border border-amber-200 bg-amber-50/25 p-4 shadow-3xs flex items-center gap-4.5 transition-all">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[9px] font-bold text-amber-700 tracking-widest uppercase font-mono">Level II Overseer</span>
                <h4 className="text-sm font-bold text-slate-900 mt-0.5">Production Manager</h4>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-0.5">
                  Moderate workflow control, shop delegation triggers, report approval generation, and analytics compile.
                </p>
              </div>
            </div>

            {/* Down Connector 2 */}
            <div className="flex flex-col items-center">
              <ArrowDown className="text-amber-400 h-5 w-5 animate-bounce" />
            </div>

            {/* Level 3: SHOP SUPERVISOR */}
            <div className="relative group w-full max-w-sm h-full rounded-xl border border-slate-200 bg-slate-50/45 p-4 shadow-3xs flex items-center gap-4.5 transition-all">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 text-white shadow-sm shrink-0">
                <Shield className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[9px] font-bold text-slate-500 tracking-widest uppercase font-mono">Level I Workshop Lead</span>
                <h4 className="text-sm font-bold text-slate-900 mt-0.5">Shop Supervisor</h4>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-0.5">
                  Micro-level active locomotive logging, localized delay triggers, shop equipment checks, and dispatch clearances.
                </p>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* SECTION 2: Permission Matrix Table */}
      <Card className="border border-slate-200">
        <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle>Permission Matrix Table</CardTitle>
            <CardDescription>
              Detailed comparative analysis of user workspace capability profiles.
            </CardDescription>
          </div>
          <span className="text-[9px] font-mono font-bold text-indigo-700 bg-indigo-50 rounded px-2.5 py-1 uppercase border border-indigo-100">
            Enforced Live Engine
          </span>
        </CardHeader>
        <CardContent className="p-0">
          <ResponsiveTableWrapper>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[9px] font-mono uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-6 font-semibold">Workspace Feature Module</th>
                  <th className="py-3 px-5 text-center font-bold text-indigo-900">Admin (Tier III)</th>
                  <th className="py-3 px-5 text-center font-bold text-amber-900">Production Mgr (Tier II)</th>
                  <th className="py-3 px-6 text-center font-bold text-slate-900">Shop Supervisor (Tier I)</th>
                </tr>
              </thead>
              <tbody>
                {PERMISSION_ROWS.map((row, idx) => (
                  <tr 
                    key={idx} 
                    className="border-b last:border-0 border-slate-100 hover:bg-slate-50/20 text-xs text-slate-600 transition-colors"
                  >
                    <td className="py-3 px-6 font-bold text-slate-900">{row.feature}</td>
                    
                    {/* Admin Access Status */}
                    <td className="py-3 px-5 text-center">
                      {row.admin ? (
                        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-rose-50 text-rose-400">
                          <X className="h-3.5 w-3.5" />
                        </span>
                      )}
                    </td>

                    {/* Manager Access Status */}
                    <td className="py-3 px-5 text-center">
                      {row.manager ? (
                        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-slate-100 text-slate-400">
                          <X className="h-3.5 w-3.5" />
                        </span>
                      )}
                    </td>

                    {/* Supervisor Access Status */}
                    <td className="py-3 px-6 text-center">
                      {row.supervisor ? (
                        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-slate-100 text-slate-400">
                          <X className="h-3.5 w-3.5" />
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ResponsiveTableWrapper>
        </CardContent>
      </Card>

      {/* SECTION 3: Role Assignment Table */}
      <Card className="border border-slate-200">
        <CardHeader className="border-b border-slate-100 pb-4">
          <CardTitle>Role Assignment Table</CardTitle>
          <CardDescription>
            Quick access controller to promote or demote available plant staff.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ResponsiveTableWrapper>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[9px] font-mono uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-6 font-semibold">User Personnel</th>
                  <th className="py-3 px-5 font-semibold text-center">Current Cleared Role</th>
                  <th className="py-3 px-5 font-semibold text-center">Proposed New Role</th>
                  <th className="py-3 px-6 font-semibold text-right">Adjustment Action</th>
                </tr>
              </thead>
              <tbody>
                {assignedUsers.map((user) => {
                  // Figure out next promote/demote target
                  let nextPromote: string | null = null;
                  let nextDemote: string | null = null;

                  if (user.currentRole === "SHOP_SUPERVISOR") {
                    nextPromote = "PRODUCTION_MANAGER";
                  } else if (user.currentRole === "PRODUCTION_MANAGER") {
                    nextPromote = "ADMIN";
                    nextDemote = "SHOP_SUPERVISOR";
                  } else if (user.currentRole === "ADMIN") {
                    nextDemote = "PRODUCTION_MANAGER";
                  }

                  return (
                    <tr 
                      key={user.id} 
                      className="border-b last:border-0 border-slate-100 hover:bg-slate-50/20 text-xs text-slate-600 transition-colors"
                    >
                      {/* Name card */}
                      <td className="py-3.5 px-6 font-bold text-slate-900 flex items-center gap-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded bg-slate-100 font-bold text-[10px] text-slate-600 uppercase">
                          {user.name.trim().split(" ").slice(-1)[0][0]}
                        </div>
                        {user.name}
                      </td>

                      {/* Current Role Badge */}
                      <td className="py-3.5 px-5 text-center">
                        <span className={`inline-flex items-center gap-1.5 text-[9px] font-extrabold px-3 py-1 rounded-full uppercase border ${
                          user.currentRole === "ADMIN" 
                            ? "bg-indigo-50 text-indigo-700 border-indigo-100" 
                            : user.currentRole === "PRODUCTION_MANAGER"
                            ? "bg-amber-50 text-amber-700 border-amber-100"
                            : "bg-emerald-50 text-emerald-700 border-emerald-100"
                        }`}>
                          <Shield className="h-3 w-3 shrink-0" />
                          {user.currentRole.replace("_", " ")}
                        </span>
                      </td>

                      {/* Proposed New Role Badge preview */}
                      <td className="py-3.5 px-5 text-slate-400 font-medium text-center font-mono text-[10px]">
                        {nextPromote ? (
                          <div className="flex items-center justify-center gap-1.5 text-indigo-600">
                             <span>Promote &rarr; {nextPromote.replace("_", " ")}</span>
                          </div>
                        ) : nextDemote ? (
                          <div className="flex items-center justify-center gap-1.5 text-amber-600">
                             <span>Demote &rarr; {nextDemote.replace("_", " ")}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400">Maximum cleared level</span>
                        )}
                      </td>

                      {/* Action trigger buttons */}
                      <td className="py-3.5 px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          {nextPromote && (
                            <Button
                              variant="outline"
                              onClick={() => handlePromote(user.id)}
                              className="h-8 px-2.5 text-[10px] uppercase font-bold text-indigo-600 hover:bg-indigo-50 hover:text-indigo-900 border-indigo-200"
                              title={`Promote user clearance level`}
                            >
                              <ArrowUpCircle className="h-3.5 w-3.5" /> Promote
                            </Button>
                          )}
                          {nextDemote && (
                            <Button
                              variant="outline"
                              onClick={() => handleDemote(user.id)}
                              className="h-8 px-2.5 text-[10px] uppercase font-bold text-amber-600 hover:bg-amber-50 hover:text-amber-900 border-amber-200"
                              title={`Demote user clearance level`}
                            >
                              <ArrowDownCircle className="h-3.5 w-3.5" /> Demote
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </ResponsiveTableWrapper>
        </CardContent>
      </Card>
    </div>
  );
}
