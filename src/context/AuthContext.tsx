import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

export type Role = "ADMIN" | "PRODUCTION_MANAGER" | "SHOP_SUPERVISOR";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  shop?: string;
  title?: string;
  phone?: string;
  photoUrl?: string;
  employeeId?: string;
  status?: "Active" | "Inactive";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isLoading: boolean;
  updateUser: (updatedFields: Partial<User>) => Promise<void>;
  isSaving: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─────────────────────────────────────────────────────────────────────────────
// MOCK USER REGISTRY  (fallback until real data is saved to Supabase)
// Same @blw.com emails — updated names per user request
// ─────────────────────────────────────────────────────────────────────────────
export const MOCK_USERS: User[] = [
  {
    id: "DEMO-001",
    name: "Praveen Pandey",
    email: "admin@blw.com",
    role: "ADMIN",
    shop: "HQ Command Centre",
    title: "Chief System Administrator",
    employeeId: "BLW-2026-0001",
    status: "Active",
  },
  {
    id: "DEMO-002",
    name: "Ritik Dubey",
    email: "pm@blw.com",
    role: "PRODUCTION_MANAGER",
    shop: "Heavy Fabrication Lines",
    title: "Chief Production Manager",
    employeeId: "BLW-2026-0002",
    status: "Active",
  },
  {
    id: "DEMO-003",
    name: "Rahul Yadav",
    email: "frame@blw.com",
    role: "SHOP_SUPERVISOR",
    shop: "Frame Fabrication Shop",
    title: "Frame Shop Supervisor",
    employeeId: "BLW-2026-0101",
    status: "Active",
  },
  {
    id: "DEMO-004",
    name: "Shailender Dubey",
    email: "bogie@blw.com",
    role: "SHOP_SUPERVISOR",
    shop: "Bogie Shop",
    title: "Bogie Shop Supervisor",
    employeeId: "BLW-2026-0102",
    status: "Active",
  },
  {
    id: "DEMO-005",
    name: "Aman Prajapati",
    email: "shell@blw.com",
    role: "SHOP_SUPERVISOR",
    shop: "Shell Assembly Shop",
    title: "Shell Assembly Supervisor",
    employeeId: "BLW-2026-0103",
    status: "Active",
  },
  {
    id: "DEMO-006",
    name: "Tejas Pathak",
    email: "electrical@blw.com",
    role: "SHOP_SUPERVISOR",
    shop: "Electrical Assembly Shop",
    title: "Electrical Shop Supervisor",
    employeeId: "BLW-2026-0104",
    status: "Active",
  },
  {
    id: "DEMO-007",
    name: "Nikhil Mishra",
    email: "brake@blw.com",
    role: "SHOP_SUPERVISOR",
    shop: "Brake & Pneumatic Shop",
    title: "Brake Shop Supervisor",
    employeeId: "BLW-2026-0105",
    status: "Active",
  },
  {
    id: "DEMO-008",
    name: "Ranvir Srivastava",
    email: "paint@blw.com",
    role: "SHOP_SUPERVISOR",
    shop: "Paint Shop",
    title: "Paint Shop Supervisor",
    employeeId: "BLW-2026-0106",
    status: "Active",
  },
  {
    id: "DEMO-009",
    name: "Ekansh Srivastava",
    email: "testing@blw.com",
    role: "SHOP_SUPERVISOR",
    shop: "Testing Center",
    title: "Testing Center Supervisor",
    employeeId: "BLW-2026-0107",
    status: "Active",
  },
  {
    id: "DEMO-010",
    name: "Harsh Singh",
    email: "dispatch@blw.com",
    role: "SHOP_SUPERVISOR",
    shop: "Dispatch Center",
    title: "Dispatch Logistics Supervisor",
    employeeId: "BLW-2026-0108",
    status: "Active",
  },
];

// Helper: map Supabase DB row → User
function dbRowToUser(row: Record<string, unknown>): User {
  return {
    id: row.id as string,
    name: row.name as string,
    email: row.email as string,
    role: row.role as Role,
    shop: row.shop as string | undefined,
    title: row.title as string | undefined,
    phone: row.phone as string | undefined,
    photoUrl: row.photo_url as string | undefined,
    employeeId: row.employee_id as string | undefined,
    status: (row.status as "Active" | "Inactive") ?? "Active",
  };
}

// Helper: find mock user by email
function getMockUserByEmail(email: string): User | undefined {
  return MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

// Helper: check if Supabase is configured
function isSupabaseConfigured(): boolean {
  const url = import.meta.env.VITE_SUPABASE_URL as string;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
  return !!(url && key && url !== "https://placeholder.supabase.co");
}

// ─────────────────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // ─── Restore session on mount ──────────────────────────────────────────────
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      // Offline/mock mode: restore from localStorage
      const saved = localStorage.getItem("blw_auth_user");
      if (saved) {
        try { setUser(JSON.parse(saved)); } catch { localStorage.removeItem("blw_auth_user"); }
      }
      setIsLoading(false);
      return;
    }

    // Supabase mode: get current session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id, session.user.email ?? "");
        setUser(profile);
      }
      setIsLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id, session.user.email ?? "");
        setUser(profile);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ─── Fetch profile from Supabase (fallback to mock) ───────────────────────
  const fetchUserProfile = async (uid: string, email: string): Promise<User> => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", uid)
        .maybeSingle();

      if (!error && data) {
        return dbRowToUser(data as Record<string, unknown>);
      }
    } catch {
      // Supabase query failed — use mock
    }

    // Fallback: match by email in MOCK_USERS, or create minimal user
    const mock = getMockUserByEmail(email);
    return mock ?? {
      id: uid,
      name: email.split("@")[0],
      email,
      role: "SHOP_SUPERVISOR",
      status: "Active",
    };
  };

  // ─── LOGIN ─────────────────────────────────────────────────────────────────
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const normalizedEmail = email.toLowerCase().trim();

    if (!isSupabaseConfigured()) {
      // ── MOCK MODE (no Supabase configured) ──
      const mockUser = getMockUserByEmail(normalizedEmail);
      if (!mockUser) {
        return { success: false, error: "No account found with this email address." };
      }
      if (password !== "BLW@2026!") {
        return { success: false, error: "Incorrect password. Default is BLW@2026!" };
      }
      setUser(mockUser);
      localStorage.setItem("blw_auth_user", JSON.stringify(mockUser));
      return { success: true };
    }

    // ── SUPABASE MODE ──
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (error || !data.user) {
      let msg = "Login failed. Please check your credentials.";
      if (error?.message?.includes("Invalid login credentials")) msg = "Incorrect email or password.";
      else if (error?.message?.includes("Email not confirmed")) msg = "Please verify your email first.";
      else if (error?.message?.includes("Too many requests")) msg = "Too many attempts. Please wait and try again.";
      return { success: false, error: msg };
    }

    // Profile will be set by onAuthStateChange listener
    return { success: true };
  };

  // ─── LOGOUT ────────────────────────────────────────────────────────────────
  const logout = async () => {
    if (!isSupabaseConfigured()) {
      setUser(null);
      localStorage.removeItem("blw_auth_user");
      return;
    }
    await supabase.auth.signOut();
    setUser(null);
  };

  // ─── UPDATE USER PROFILE ───────────────────────────────────────────────────
  const updateUser = useCallback(async (updatedFields: Partial<User>) => {
    if (!user) return;
    setIsSaving(true);

    const updated: User = { ...user, ...updatedFields };

    // Always update local state immediately (optimistic)
    setUser(updated);

    if (!isSupabaseConfigured()) {
      localStorage.setItem("blw_auth_user", JSON.stringify(updated));
      setIsSaving(false);
      return;
    }

    // Upsert to Supabase users table
    try {
      const { error } = await supabase.from("users").upsert({
        id: updated.id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        shop: updated.shop,
        title: updated.title,
        phone: updated.phone,
        photo_url: updated.photoUrl,
        employee_id: updated.employeeId,
        status: updated.status ?? "Active",
        updated_at: new Date().toISOString(),
      }, { onConflict: "id" });

      if (error) {
        console.error("[BLW PMS] Failed to save profile to Supabase:", error.message);
      }
    } catch (err) {
      console.error("[BLW PMS] updateUser error:", err);
    } finally {
      setIsSaving(false);
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        isLoading,
        updateUser,
        isSaving,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
