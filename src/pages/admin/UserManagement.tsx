import React, { useState, useEffect, useCallback } from "react";
import { 
  Users, 
  UserCheck, 
  UserX, 
  ShieldAlert, 
  Search, 
  Plus, 
  Eye, 
  Edit2, 
  UserMinus, 
  Trash2, 
  ShieldCheck, 
  X, 
  Lock,
  Building2,
  Mail,
  Shield,
  Info,
  RefreshCw,
  Loader2
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
import { ResponsiveTableWrapper } from "../../components/ResponsiveTableWrapper.tsx";
import { supabase } from "../../lib/supabase.ts";

// Role types
export type RoleType = "ADMIN" | "PRODUCTION_MANAGER" | "SHOP_SUPERVISOR";

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: RoleType;
  shop: string;
  status: "Active" | "Inactive";
  lastLogin: string;
  phone?: string;
  photoUrl?: string;
  employeeId?: string;
  title?: string;
}

// Default seed data — updated with correct names/emails matching AuthContext MOCK_USERS
const INITIAL_USERS: SystemUser[] = [
  { id: "DEMO-001", name: "Praveen Pandey",    email: "admin@blw.com",       role: "ADMIN",              shop: "HQ Command Centre",        status: "Active",   lastLogin: "Just now",       title: "Chief System Administrator",    employeeId: "BLW-2026-0001" },
  { id: "DEMO-002", name: "Ritik Dubey",       email: "pm@blw.com",         role: "PRODUCTION_MANAGER", shop: "Heavy Fabrication Lines",  status: "Active",   lastLogin: "10 mins ago",   title: "Chief Production Manager",      employeeId: "BLW-2026-0002" },
  { id: "DEMO-003", name: "Rahul Yadav",       email: "frame@blw.com",      role: "SHOP_SUPERVISOR",    shop: "Frame Fabrication Shop",  status: "Active",   lastLogin: "32 mins ago",   title: "Frame Shop Supervisor",         employeeId: "BLW-2026-0101" },
  { id: "DEMO-004", name: "Shailender Dubey",  email: "bogie@blw.com",      role: "SHOP_SUPERVISOR",    shop: "Bogie Shop",               status: "Active",   lastLogin: "1 hour ago",    title: "Bogie Shop Supervisor",         employeeId: "BLW-2026-0102" },
  { id: "DEMO-005", name: "Aman Prajapati",    email: "shell@blw.com",      role: "SHOP_SUPERVISOR",    shop: "Shell Assembly Shop",      status: "Active",   lastLogin: "Yesterday",     title: "Shell Assembly Supervisor",     employeeId: "BLW-2026-0103" },
  { id: "DEMO-006", name: "Tejas Pathak",      email: "electrical@blw.com", role: "SHOP_SUPERVISOR",    shop: "Electrical Assembly Shop", status: "Active",   lastLogin: "2 hours ago",   title: "Electrical Shop Supervisor",    employeeId: "BLW-2026-0104" },
  { id: "DEMO-007", name: "Nikhil Mishra",     email: "brake@blw.com",      role: "SHOP_SUPERVISOR",    shop: "Brake & Pneumatic Shop",  status: "Active",   lastLogin: "June 20, 2026", title: "Brake Shop Supervisor",         employeeId: "BLW-2026-0105" },
  { id: "DEMO-008", name: "Ranvir Srivastava", email: "paint@blw.com",      role: "SHOP_SUPERVISOR",    shop: "Paint Shop",               status: "Active",   lastLogin: "June 20, 2026", title: "Paint Shop Supervisor",         employeeId: "BLW-2026-0106" },
  { id: "DEMO-009", name: "Ekansh Srivastava", email: "testing@blw.com",    role: "SHOP_SUPERVISOR",    shop: "Testing Center",           status: "Active",   lastLogin: "June 19, 2026", title: "Testing Center Supervisor",     employeeId: "BLW-2026-0107" },
  { id: "DEMO-010", name: "Harsh Singh",       email: "dispatch@blw.com",   role: "SHOP_SUPERVISOR",    shop: "Dispatch Center",          status: "Active",   lastLogin: "June 19, 2026", title: "Dispatch Logistics Supervisor", employeeId: "BLW-2026-0108" },
];

// Check if Supabase is configured
function isSupabaseConfigured(): boolean {
  const url = import.meta.env.VITE_SUPABASE_URL as string;
  return !!(url && url !== "https://placeholder.supabase.co");
}

export default function UserManagement() {
  const [users, setUsers] = useState<SystemUser[]>(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"ALL" | "Active" | "Inactive">("ALL");
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [dbSyncActive, setDbSyncActive] = useState(false);
  
  // Modal states
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isChangeRoleOpen, setIsChangeRoleOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [selectedProfileCard, setSelectedProfileCard] = useState<SystemUser | null>(null);
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  
  // Add User Form states
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<RoleType>("SHOP_SUPERVISOR");
  const [newShop, setNewShop] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newTitle, setNewTitle] = useState("");
  
  // Custom temporary role select state
  const [tempRole, setTempRole] = useState<RoleType>("SHOP_SUPERVISOR");

  // ─── Load users from Supabase on mount ──────────────────────────────────
  const loadUsersFromSupabase = useCallback(async () => {
    if (!isSupabaseConfigured()) return;
    setIsLoadingUsers(true);
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("name");
      if (!error && data && data.length > 0) {
        const mapped: SystemUser[] = data.map((row: Record<string, unknown>) => ({
          id: row.id as string,
          name: row.name as string,
          email: row.email as string,
          role: row.role as RoleType,
          shop: (row.shop as string) || "General Shop",
          status: (row.status as "Active" | "Inactive") || "Active",
          lastLogin: row.updated_at ? new Date(row.updated_at as string).toLocaleDateString("en-IN") : "Never",
          title: row.title as string | undefined,
          phone: row.phone as string | undefined,
          photoUrl: row.photo_url as string | undefined,
          employeeId: row.employee_id as string | undefined,
        }));
        setUsers(mapped);
        setDbSyncActive(true);
      }
    } catch {
      // Fall back to INITIAL_USERS silently
    } finally {
      setIsLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    loadUsersFromSupabase();
  }, [loadUsersFromSupabase]);

  // Statistics
  const totalUsersCount = users.length;
  const activeUsersCount = users.filter(u => u.status === "Active").length;
  const inactiveUsersCount = users.filter(u => u.status === "Inactive").length;
  
  const adminCount = users.filter(u => u.role === "ADMIN").length;
  const managerCount = users.filter(u => u.role === "PRODUCTION_MANAGER").length;
  const supervisorCount = users.filter(u => u.role === "SHOP_SUPERVISOR").length;
  const roleBreakdown = `${adminCount} ADMINS • ${managerCount} MANAGERS • ${supervisorCount} SUPERVISORS`;

  // Filtered users
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          u.shop.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === "ALL") return matchesSearch;
    return matchesSearch && u.status === activeTab;
  });

  // ─── Create/update user ──────────────────────────────────────────────────
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    const newId = `USR-${Date.now()}`;
    const newUserObj: SystemUser = {
      id: newId,
      name: newName,
      email: newEmail,
      role: newRole,
      shop: newShop || "General Production Site",
      status: "Active",
      lastLogin: "Never logged in",
      title: newTitle,
    };

    // Optimistic update
    if (selectedUser) {
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...newUserObj, id: u.id } : u));
    } else {
      setUsers([newUserObj, ...users]);
    }

    // Supabase sync
    if (isSupabaseConfigured()) {
      setIsSyncing(true);
      try {
        if (selectedUser) {
          await supabase.from("users").update({
            name: newName, email: newEmail, role: newRole,
            shop: newShop, title: newTitle, updated_at: new Date().toISOString(),
          }).eq("id", selectedUser.id);
        } else {
          await supabase.from("users").insert({
            id: newId, name: newName, email: newEmail, role: newRole,
            shop: newShop || "General Production Site", title: newTitle,
            status: "Active", updated_at: new Date().toISOString(),
          });
        }
      } catch { /* silent */ } finally { setIsSyncing(false); }
    }

    setNewName(""); setNewEmail(""); setNewRole("SHOP_SUPERVISOR");
    setNewShop(""); setNewPassword(""); setNewTitle("");
    setSelectedUser(null);
    setIsAddUserOpen(false);
  };

  // ─── Toggle status ───────────────────────────────────────────────────────
  const handleToggleStatus = async (id: string) => {
    const target = users.find(u => u.id === id);
    if (!target) return;
    const newStatus = target.status === "Active" ? "Inactive" : "Active";
    
    setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u));
    
    if (isSupabaseConfigured()) {
      await supabase.from("users").update({ status: newStatus }).eq("id", id);
    }
  };

  // ─── Delete user ─────────────────────────────────────────────────────────
  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to remove this user from the BLW Enterprise Registry?")) return;
    
    setUsers(users.filter(u => u.id !== id));
    
    if (isSupabaseConfigured()) {
      await supabase.from("users").delete().eq("id", id);
    }
  };

  // ─── Role change ─────────────────────────────────────────────────────────
  const openRoleModal = (user: SystemUser) => {
    setSelectedUser(user);
    setTempRole(user.role);
    setIsChangeRoleOpen(true);
  };

  const handleUpdateRole = async () => {
    if (!selectedUser) return;
    setUsers(users.map(u => u.id === selectedUser.id ? { ...u, role: tempRole } : u));
    
    if (isSupabaseConfigured()) {
      await supabase.from("users").update({ role: tempRole }).eq("id", selectedUser.id);
    }
    setIsChangeRoleOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">User Management</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-xs text-slate-400">Manage all system users, operational permissions, and registry clearance levels.</p>
            {dbSyncActive && (
              <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 font-mono">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live DB
              </span>
            )}
            {isSyncing && (
              <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100 font-mono">
                <Loader2 className="h-2.5 w-2.5 animate-spin" />
                Syncing...
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 self-start">
          {isSupabaseConfigured() && (
            <Button
              variant="outline"
              onClick={loadUsersFromSupabase}
              disabled={isLoadingUsers}
              className="h-9"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoadingUsers ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          )}
          <Button 
            variant="default" 
            onClick={() => { setSelectedUser(null); setNewName(""); setNewEmail(""); setNewRole("SHOP_SUPERVISOR"); setNewShop(""); setNewTitle(""); setIsAddUserOpen(true); }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
          >
            <Plus className="h-4 w-4" /> Add Industrial User
          </Button>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Users */}
        <Card className="bg-white border-l-4 border-l-slate-900">
          <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0 pb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Users</span>
            <span className="p-1.5 rounded-lg bg-slate-100 text-slate-900">
              <Users className="h-4 w-4" />
            </span>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-slate-900">{totalUsersCount}</div>
            <p className="text-[10px] text-slate-400 mt-0.5">Registered supervisors & admins</p>
          </CardContent>
        </Card>

        {/* Active Users */}
        <Card className="bg-white border-l-4 border-l-emerald-500">
          <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0 pb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Active Users</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <UserCheck className="h-4 w-4" />
            </span>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-slate-900">{activeUsersCount}</div>
            <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Clearance live & operational</p>
          </CardContent>
        </Card>

        {/* Inactive Users */}
        <Card className="bg-white border-l-4 border-l-amber-500">
          <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0 pb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Inactive Users</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <UserX className="h-4 w-4" />
            </span>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-slate-900">{inactiveUsersCount}</div>
            <p className="text-[10px] text-slate-400 mt-0.5">De-commissioned or offline</p>
          </CardContent>
        </Card>

        {/* Role Distribution */}
        <Card className="bg-white border-l-4 border-l-indigo-500">
          <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0 pb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Role Distribution</span>
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <ShieldAlert className="h-4 w-4" />
            </span>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-sm font-bold text-slate-900 truncate uppercase mt-1">{roleBreakdown}</div>
            <p className="text-[10px] text-slate-400 mt-1">Tier-based system structure</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Interface */}
      <Card className="border border-slate-200">
        <CardHeader className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100">
          {/* Custom Tabs */}
          <div className="flex bg-slate-100 p-0.5 rounded-lg self-start">
            <button
              onClick={() => setActiveTab("ALL")}
              className={`px-3 py-1 text-[11px] font-semibold rounded-md transition-all ${
                activeTab === "ALL" ? "bg-white text-slate-900 shadow-3xs" : "text-slate-400 hover:text-slate-700"
              }`}
            >
              All personnel ({totalUsersCount})
            </button>
            <button
              onClick={() => setActiveTab("Active")}
              className={`px-3 py-1 text-[11px] font-semibold rounded-md transition-all ${
                activeTab === "Active" ? "bg-white text-slate-900 shadow-3xs" : "text-slate-400 hover:text-slate-700"
              }`}
            >
              Active ({activeUsersCount})
            </button>
            <button
              onClick={() => setActiveTab("Inactive")}
              className={`px-3 py-1 text-[11px] font-semibold rounded-md transition-all ${
                activeTab === "Inactive" ? "bg-white text-slate-900 shadow-3xs" : "text-slate-400 hover:text-slate-700"
              }`}
            >
              Inactive ({inactiveUsersCount})
            </button>
          </div>

          {/* Search Field */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <Input
              placeholder="Search by name, email, or shop..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <ResponsiveTableWrapper>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[9px] font-mono uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-5 font-semibold">User Identity</th>
                  <th className="py-3 px-4 font-semibold">Clearance Role</th>
                  <th className="py-3 px-4 font-semibold text-right">Last Shift Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-12 text-center text-slate-400 font-mono text-xs">
                      No matching records found in the BLW database.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <React.Fragment key={user.id}>
                      <tr 
                        onClick={() => {
                          setExpandedUserId(expandedUserId === user.id ? null : user.id);
                        }}
                        className={`border-b border-slate-100 hover:bg-slate-50/20 transition-all text-xs text-slate-600 cursor-pointer ${
                          expandedUserId === user.id ? "bg-indigo-50/10" : ""
                        }`}
                      >
                        {/* Name & Mail */}
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-3">
                            <div 
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedProfileCard(user);
                              }}
                              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white font-mono font-bold text-[10px] cursor-pointer hover:ring-2 hover:ring-indigo-500 hover:ring-offset-1 transition"
                            >
                              {user.name.split(" ").map(w => w[0]).join("")}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedProfileCard(user);
                                  }}
                                  className="font-bold text-slate-900 truncate hover:text-indigo-600 cursor-pointer transition"
                                >
                                  {user.name}
                                </span>
                                <span 
                                  className={`h-2 w-2 rounded-full shrink-0 ${
                                    user.status === "Active" ? "bg-emerald-500" : "bg-slate-400"
                                  }`}
                                  title={user.status}
                                />
                              </div>
                              <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5 max-w-[150px] sm:max-w-none shrink-0">
                                <Mail className="h-3 w-3 text-slate-400 shrink-0" />
                                <span className="truncate">{user.email}</span>
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Role Badge */}
                        <td className="py-3.5 px-4 font-medium">
                          <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                            user.role === "ADMIN" 
                              ? "bg-indigo-50 text-indigo-700 border border-indigo-100" 
                              : user.role === "PRODUCTION_MANAGER"
                              ? "bg-amber-50 text-amber-700 border border-amber-100"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          }`}>
                            <Shield className="h-2.5 w-2.5" />
                            {user.role.replace("_", " ")}
                          </span>
                        </td>

                        {/* Last Login with state indicator */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <span className="text-slate-400 font-medium font-mono text-[10px]">
                              {user.lastLogin}
                            </span>
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition ${
                              expandedUserId === user.id 
                                ? "bg-slate-900 text-white" 
                                : "bg-slate-50 text-indigo-600 border border-slate-150 hover:bg-slate-100"
                            }`}>
                              {expandedUserId === user.id ? "Hide Panel" : "Tap to Action"}
                            </span>
                          </div>
                        </td>
                      </tr>

                      {/* Expandable subrow showing Assigned Shop and Actions Panel */}
                      {expandedUserId === user.id && (
                        <tr className="bg-slate-50/70 border-b border-indigo-50/60 animate-in fade-in duration-200">
                          <td colSpan={3} className="p-4 bg-slate-50/30">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-1.5 px-2">
                              {/* Assigned Shop details */}
                              <div className="flex items-start gap-4">
                                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
                                  <Building2 className="h-4.5 w-4.5 shrink-0" />
                                </div>
                                <div className="space-y-0.5">
                                  <span className="text-[9px] font-mono font-black text-slate-400 block uppercase tracking-wider">Assigned Shop Station</span>
                                  <span className="font-extrabold text-slate-800 text-xs">{user.shop}</span>
                                </div>
                              </div>
                              
                              {/* Actions container with elegant spacious touch targets */}
                              <div className="flex flex-wrap items-center gap-2">
                                <Button 
                                  variant="outline" 
                                  className="h-8 text-[11px] font-semibold bg-white text-slate-600 border-slate-150 hover:bg-slate-100"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedProfileCard(user);
                                  }}
                                >
                                  <Eye className="h-3.5 w-3.5 mr-1" /> View Details
                                </Button>
                                <Button 
                                  variant="outline" 
                                  className="h-8 text-[11px] font-semibold bg-white text-indigo-650 border-indigo-200 hover:bg-indigo-50"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedUser(user);
                                    setNewName(user.name);
                                    setNewEmail(user.email);
                                    setNewRole(user.role);
                                    setNewShop(user.shop);
                                    setIsAddUserOpen(true);
                                  }}
                                >
                                  <Edit2 className="h-3.5 w-3.5 mr-1" /> Edit Profile
                                </Button>
                                <Button 
                                  variant="outline" 
                                  className={`h-8 text-[11px] font-semibold bg-white ${
                                    user.status === "Active" 
                                      ? "text-rose-600 border-rose-250 hover:bg-rose-50" 
                                      : "text-emerald-600 border-emerald-250 hover:bg-emerald-50"
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleStatus(user.id);
                                  }}
                                >
                                  <UserMinus className="h-3.5 w-3.5 mr-1" /> {user.status === "Active" ? "Suspend Account" : "Activate Account"}
                                </Button>
                                <Button 
                                  variant="outline" 
                                  className="h-8 text-[11px] font-semibold bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openRoleModal(user);
                                  }}
                                >
                                  <ShieldCheck className="h-3.5 w-3.5 mr-1" /> Clearances
                                </Button>
                                <Button 
                                  variant="outline" 
                                  className="h-8 text-[11px] font-semibold bg-white text-red-600 border-red-200 hover:bg-red-50 hover:text-red-750"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteUser(user.id);
                                  }}
                                >
                                  <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete Registry
                                </Button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </ResponsiveTableWrapper>
        </CardContent>
      </Card>

      {/* Dialogue 1: Add User Modal (shadcn structure simulated with native React trigger portal) */}
      {isAddUserOpen && (
        <div id="add-user-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  {selectedUser ? "Modify Personnel Record" : "Add Industrial User"}
                </h3>
                <p className="text-[10px] text-slate-400 font-medium">Record registry entry to active security databases.</p>
              </div>
              <button 
                type="button" 
                onClick={() => {
                  setIsAddUserOpen(false);
                  setSelectedUser(null);
                  setNewName("");
                  setNewEmail("");
                  setNewRole("SHOP_SUPERVISOR");
                  setNewShop("");
                }}
                className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateUser} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Full Name</label>
                <Input 
                  placeholder="e.g. Suresh Sharma" 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)} 
                  required 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Official Email</label>
                <Input 
                  type="email" 
                  placeholder="e.g. s.sharma@blw.in" 
                  value={newEmail} 
                  onChange={(e) => setNewEmail(e.target.value)} 
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Clearance Level</label>
                  <select 
                    value={newRole} 
                    onChange={(e) => setNewRole(e.target.value as RoleType)}
                    className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-slate-800 font-medium text-slate-700"
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="PRODUCTION_MANAGER">PRODUCTION_MANAGER</option>
                    <option value="SHOP_SUPERVISOR">SHOP_SUPERVISOR</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Assigned Shop</label>
                  <Input 
                    placeholder="e.g. Bogie Shop" 
                    value={newShop} 
                    onChange={(e) => setNewShop(e.target.value)} 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Designation / Title</label>
                <Input 
                  placeholder="e.g. Electrical Shop Supervisor" 
                  value={newTitle} 
                  onChange={(e) => setNewTitle(e.target.value)} 
                />
              </div>

              {!selectedUser && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                    <Lock className="h-3 w-3" /> Security Password
                  </label>
                  <Input 
                    type="password" 
                    placeholder="Minimum 8 alpha characters" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    required 
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2.5 justify-end pt-3 border-t border-slate-100">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsAddUserOpen(false);
                    setSelectedUser(null);
                    setNewName("");
                    setNewEmail("");
                    setNewRole("SHOP_SUPERVISOR");
                    setNewShop("");
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-slate-900 text-white hover:bg-slate-800">
                  {selectedUser ? "Apply Changes" : "Create Account"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dialogue 2: Change Role Modal */}
      {isChangeRoleOpen && selectedUser && (
        <div id="role-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">Change Hierarchy Role</h3>
              <p className="text-[10px] text-slate-400 mt-1">Modify structural clearance for &quot;{selectedUser.name}&quot;.</p>
            </div>
            <div className="p-5 space-y-4">
              <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-lg text-indigo-950 font-medium">
                <div className="flex items-center gap-1.5 mb-1 text-xs font-bold uppercase text-indigo-900">
                  <Info className="h-3.5 w-3.5" />
                  Security Impact Warning
                </div>
                <p className="text-[11px] leading-relaxed">
                  Upgrading or downgrading system clearance re-calibrates active read/write permissions instantaneously and logs changes in the master registry.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Select New Level</label>
                <select 
                  value={tempRole} 
                  onChange={(e) => setTempRole(e.target.value as RoleType)}
                  className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-slate-800 text-slate-800 font-bold"
                >
                  <option value="ADMIN">ADMIN (HQ Privilege Access)</option>
                  <option value="PRODUCTION_MANAGER">PRODUCTION_MANAGER (Intermediate Overseer)</option>
                  <option value="SHOP_SUPERVISOR">SHOP_SUPERVISOR (Workshop Floor Lead)</option>
                </select>
              </div>

              <div className="flex gap-2 justify-end pt-3 border-t border-slate-100">
                <Button variant="outline" onClick={() => setIsChangeRoleOpen(false)}>Cancel</Button>
                <Button onClick={handleUpdateRole}>Confirm Assignment</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Popup window of user profile card */}
      {selectedProfileCard && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-md"
          onClick={() => setSelectedProfileCard(null)}
        >
          <div 
            className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Upper profile decorative banner colored according to role */}
            <div className={`h-28 w-full relative ${
              selectedProfileCard.role === "ADMIN" 
                ? "bg-gradient-to-tr from-slate-900 to-indigo-950" 
                : selectedProfileCard.role === "PRODUCTION_MANAGER"
                ? "bg-gradient-to-tr from-slate-900 to-amber-950"
                : "bg-gradient-to-tr from-slate-950 to-emerald-950"
            }`}>
              {/* Badge element */}
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/20 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                BLW Official
              </div>
              
              {/* Close Button */}
              <button 
                type="button"
                onClick={() => setSelectedProfileCard(null)}
                className="absolute top-4 left-4 p-1 rounded-full bg-slate-900/40 text-slate-100 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Profile Avatar Container pulling up */}
            <div className="px-6 pb-6 relative">
              <div className="flex justify-between items-end -mt-12 mb-4">
                <div className="h-20 w-20 rounded-2xl bg-slate-900 text-white font-mono font-extrabold text-2xl flex items-center justify-center border-4 border-white shadow-lg">
                  {selectedProfileCard.name.split(" ").map(w => w[0]).join("")}
                </div>
                <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-2.5 py-1 rounded-full ${
                  selectedProfileCard.status === "Active"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-150"
                    : "bg-slate-100 text-slate-500 border border-slate-200"
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${selectedProfileCard.status === "Active" ? "bg-emerald-500" : "bg-slate-400"}`} />
                  {selectedProfileCard.status}
                </span>
              </div>

              {/* Profile details block */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 tracking-tight leading-none">
                    {selectedProfileCard.name}
                  </h3>
                  <p className="text-xs text-indigo-650 font-bold mt-1 font-mono uppercase tracking-wide">
                    {selectedProfileCard.role.replace("_", " ")}
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-3.5 space-y-2.5 text-xs text-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-slate-400 font-bold uppercase">Assigned shop</span>
                    <span className="font-bold text-slate-900 flex items-center gap-1">
                      <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      {selectedProfileCard.shop}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-slate-400 font-bold uppercase">System email</span>
                    <a href={`mailto:${selectedProfileCard.email}`} className="font-bold text-indigo-600 hover:underline break-all ml-4 text-right">
                      {selectedProfileCard.email}
                    </a>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-slate-400 font-bold uppercase">Employee ID</span>
                    <span className="font-mono font-bold text-slate-900">BLW-ENG-{selectedProfileCard.id}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-slate-400 font-bold uppercase">Clearance Check</span>
                    <span className="font-semibold text-slate-800">Standard Tier Clearance</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-slate-400 font-bold uppercase">Last Active Connection</span>
                    <span className="text-[10px] font-mono text-slate-500 font-bold">{selectedProfileCard.lastLogin}</span>
                  </div>
                </div>

                {/* Micro metrics mock graphics on the card to look exceptionally professional */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 space-y-2 text-[11px]">
                  <div className="flex justify-between items-center text-slate-500 font-bold text-[10px] uppercase font-mono">
                    <span>Performance Rating</span>
                    <span className="text-slate-900">98% Efficient</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: "98%" }}></div>
                  </div>
                </div>

                <div className="flex gap-2 pt-1 border-t border-slate-100">
                  <Button 
                    className="flex-1 bg-slate-900 text-white"
                    onClick={() => setSelectedProfileCard(null)}
                  >
                    Dismiss Profile
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
