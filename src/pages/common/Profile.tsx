import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.tsx";
import { supabase } from "../../lib/supabase.ts";
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Factory, 
  Briefcase, 
  Edit, 
  Lock, 
  Key, 
  CheckCircle2, 
  AlertCircle,
  X,
  Settings,
  Camera,
  Loader2,
  Upload
} from "lucide-react";

export default function Profile() {
  const { user, updateUser, isSaving } = useAuth();

  const name = user?.name || "BLW Officer";
  const email = user?.email || "";
  const role = user?.role || "SHOP_SUPERVISOR";
  const shop = user?.shop || "General Shop";
  const title = user?.title || "Officer";
  const employeeId = user?.employeeId || "BLW-2026-XXXX";
  const phone = user?.phone || "—";
  const photoUrl = user?.photoUrl || "";
  const joinedDate = "Feb 15, 2024";
  const shift = "General Shift (08:00 – 17:00 IST)";

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Messages
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Edit form
  const [editForm, setEditForm] = useState({
    name,
    email,
    phone,
    title,
    photoUrl,
  });

  // Photo upload
  const [photoPreview, setPhotoPreview] = useState<string>(photoUrl);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // ─── Open edit modal — pre-fill with latest user data ─────────────────────
  const openEditModal = () => {
    setEditForm({ name, email, phone, title, photoUrl });
    setPhotoPreview(photoUrl);
    setErrorMsg("");
    setIsEditModalOpen(true);
  };

  // ─── Handle photo file selection ──────────────────────────────────────────
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Photo must be under 5 MB.");
      return;
    }

    // Show local preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setPhotoPreview(base64);
      setEditForm((f) => ({ ...f, photoUrl: base64 }));
    };
    reader.readAsDataURL(file);

    // Try to upload to Supabase Storage
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (supabaseUrl && supabaseUrl !== "https://placeholder.supabase.co" && user) {
      setIsUploadingPhoto(true);
      try {
        const filePath = `${user.id}/avatar.${file.name.split(".").pop()}`;
        const { error } = await supabase.storage
          .from("avatars")
          .upload(filePath, file, { upsert: true });

        if (!error) {
          const { data: urlData } = supabase.storage
            .from("avatars")
            .getPublicUrl(filePath);
          const publicUrl = urlData.publicUrl;
          setPhotoPreview(publicUrl);
          setEditForm((f) => ({ ...f, photoUrl: publicUrl }));
        }
      } catch {
        // Use base64 fallback (already set above)
      } finally {
        setIsUploadingPhoto(false);
      }
    }
  };

  // ─── Save profile edit ────────────────────────────────────────────────────
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.name.trim() || !editForm.email.trim()) {
      setErrorMsg("Name and Email are required.");
      return;
    }
    await updateUser({
      name: editForm.name.trim(),
      email: editForm.email.trim(),
      phone: editForm.phone.trim(),
      title: editForm.title.trim(),
      photoUrl: editForm.photoUrl,
    });
    setIsEditModalOpen(false);
    triggerSuccess("Profile successfully updated and saved.");
  };

  // ─── Change password ──────────────────────────────────────────────────────
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.currentPassword) {
      setErrorMsg("Current password is required.");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setErrorMsg("New password must be at least 6 characters.");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    // Try Supabase password update
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (supabaseUrl && supabaseUrl !== "https://placeholder.supabase.co") {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword,
      });
      if (error) {
        setErrorMsg("Password update failed: " + error.message);
        return;
      }
    }

    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setIsPasswordModalOpen(false);
    triggerSuccess("Password changed successfully!");
  };

  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setErrorMsg("");
    setTimeout(() => setSuccessMsg(""), 5000);
  };

  const getRoleColor = () => {
    switch (role) {
      case "ADMIN": return "text-indigo-400";
      case "PRODUCTION_MANAGER": return "text-amber-400";
      default: return "text-emerald-400";
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-slate-950 text-amber-500">
              <User className="h-5 w-5" />
            </span>
            My Profile
          </h1>
          <p className="text-xs text-slate-500 mt-1 uppercase font-semibold font-mono tracking-wider">
            BLW Indian Railways • Personnel Management Console
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-700 uppercase font-mono">
            <Shield className="h-3.5 w-3.5" /> SECURE ROOT
          </span>
        </div>
      </div>

      {/* Success Alert */}
      {successMsg && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-xl text-xs font-medium shadow-xs">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Error Alert */}
      {errorMsg && !isEditModalOpen && !isPasswordModalOpen && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-800 p-3.5 rounded-xl text-xs font-medium shadow-xs">
          <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Card: Avatar Panel */}
        <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 h-24 w-24 bg-slate-800/40 rounded-bl-full pointer-events-none" />
          
          <div className="relative mt-4">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={name}
                referrerPolicy="no-referrer"
                className="h-24 w-24 sm:h-28 sm:w-28 object-cover rounded-full shadow-2xl border-4 border-slate-800"
              />
            ) : (
              <div className="h-24 w-24 sm:h-28 sm:w-28 flex items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 font-extrabold text-slate-950 text-3xl tracking-widest shadow-2xl border-4 border-slate-800">
                {name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
            )}
            <span className="absolute bottom-1 right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-emerald-500 border-2 border-slate-900 font-mono text-[9px] text-white" title="Active">
              ●
            </span>
          </div>

          <h3 className="text-lg font-bold text-white mt-4 tracking-tight">{name}</h3>
          <p className={`text-xs font-mono font-medium uppercase tracking-wider ${getRoleColor()}`}>{title}</p>
          <div className="text-[10px] text-slate-400 font-bold bg-slate-800 px-2.5 py-0.5 rounded-full mt-2 font-mono uppercase">
            ID: {employeeId}
          </div>

          <div className="w-full border-t border-slate-800/80 my-5 pt-5 space-y-3.5 text-left text-xs text-slate-300">
            <div className="flex items-center justify-between font-mono">
              <span className="text-slate-500">SECURITY ROLE</span>
              <span className={`font-bold uppercase ${getRoleColor()}`}>{role}</span>
            </div>
            <div className="flex items-center justify-between font-mono">
              <span className="text-slate-500">SHIFT STATUS</span>
              <span className="font-bold text-emerald-400">ACTIVE</span>
            </div>
            <div className="flex items-center justify-between font-mono">
              <span className="text-slate-500">SHIFT SLOTS</span>
              <span className="font-bold text-slate-300 text-[10px]">General Shift</span>
            </div>
          </div>

          <div className="w-full grid grid-cols-1 gap-2.5 pt-3">
            <button
              id="profile-edit-btn"
              onClick={openEditModal}
              className="flex items-center justify-center gap-2 w-full py-2 bg-slate-800 hover:bg-slate-700 text-xs text-white font-bold rounded-xl border border-slate-700 transition-colors cursor-pointer"
            >
              <Edit className="h-3.5 w-3.5 text-amber-500" />
              Edit Profile
            </button>
            <button
              onClick={() => {
                setErrorMsg("");
                setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                setIsPasswordModalOpen(true);
              }}
              className="flex items-center justify-center gap-2 w-full py-2 bg-slate-950 hover:bg-black text-xs text-slate-400 hover:text-white font-bold rounded-xl border border-slate-800 transition-colors cursor-pointer"
            >
              <Lock className="h-3.5 w-3.5 text-slate-500" />
              Change Password
            </button>
            <Link
              to="/settings"
              className="flex items-center justify-center gap-2 w-full py-2 bg-amber-500 hover:bg-amber-600 text-xs text-slate-950 font-extrabold rounded-xl transition-all duration-150 shadow-sm text-center"
            >
              <Settings className="h-3.5 w-3.5 text-slate-950" />
              Workspace Settings
            </Link>
          </div>
        </div>

        {/* Right Section: Profile Fields */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-150 p-6 shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest font-mono mb-4 pb-2 border-b border-slate-100">
              Departmental Credentials & Assignment
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              
              {/* Employee ID */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Employee ID No.</span>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5">
                  <Briefcase className="h-4 w-4 text-slate-500" />
                  <span className="text-xs font-semibold text-slate-800 font-mono">{employeeId}</span>
                </div>
              </div>

              {/* Assigned Rank */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Assigned Rank</span>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5">
                  <Shield className="h-4 w-4 text-slate-500" />
                  <span className="text-xs font-semibold text-slate-800">{title}</span>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Email Address</span>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5">
                  <Mail className="h-4 w-4 text-slate-500" />
                  <span className="text-xs font-semibold text-slate-800 truncate">{email}</span>
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Telephone Log</span>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5">
                  <Phone className="h-4 w-4 text-slate-500" />
                  <span className="text-xs font-semibold text-slate-800 font-mono">{phone}</span>
                </div>
              </div>

              {/* System Role */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">System Role Auth</span>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5">
                  <User className="h-4 w-4 text-slate-500" />
                  <span className="text-xs font-bold text-indigo-700 font-mono uppercase">{role}</span>
                </div>
              </div>

              {/* Shop */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Assigned Logistics Shop</span>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5">
                  <Factory className="h-4 w-4 text-slate-500" />
                  <span className="text-xs font-semibold text-slate-800">{shop}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Workstation Logs */}
          <div className="bg-white rounded-2xl border border-slate-150 p-6 shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest font-mono mb-4 pb-2 border-b border-slate-100">
              Technical Workstation & Logs
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Enlisted Joined Date</div>
                <div className="text-slate-900 font-extrabold text-xs mt-1.5">{joinedDate}</div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 sm:col-span-2">
                <div className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Shift Schedule & Timing</div>
                <div className="text-slate-900 font-extrabold text-xs mt-1.5">{shift}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── EDIT PROFILE MODAL ──────────────────────────────────────────────── */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 flex items-center justify-center p-4 z-50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-scale-up">
            <div className="bg-slate-900 p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Edit className="h-4 w-4 text-amber-500" />
                <span className="font-bold text-sm tracking-tight font-mono uppercase">Edit Profile</span>
              </div>
              <button 
                onClick={() => { setIsEditModalOpen(false); setErrorMsg(""); }}
                className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">

              {/* Photo Upload */}
              <div className="flex flex-col items-center gap-3 pb-4 border-b border-slate-100">
                <div className="relative">
                  {photoPreview ? (
                    <img src={photoPreview} alt="preview" className="h-20 w-20 rounded-full object-cover border-4 border-slate-100 shadow-md" />
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-extrabold text-xl border-4 border-slate-100 shadow-md">
                      {editForm.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                  )}
                  {isUploadingPhoto && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                      <Loader2 className="h-5 w-5 text-white animate-spin" />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 hover:text-slate-900 uppercase tracking-wide border border-slate-200 rounded-full px-3 py-1.5 hover:bg-slate-50 transition cursor-pointer"
                >
                  <Camera className="h-3.5 w-3.5" />
                  {photoPreview ? "Change Photo" : "Upload Photo"}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
                <p className="text-[9px] text-slate-400 font-mono">Max 5 MB · JPG, PNG, WebP</p>
              </div>

              {/* Error inside modal */}
              {errorMsg && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 p-2.5 rounded-lg text-xs font-medium">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Email Address</label>
                <input
                  type="email"
                  required
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Designated Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Phone Number</label>
                <input
                  type="text"
                  placeholder="+91 XXXXX XXXXX"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-slate-800 font-mono"
                />
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setIsEditModalOpen(false); setErrorMsg(""); }}
                  className="flex-1 py-2 bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isUploadingPhoto}
                  className="flex-1 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSaving ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...</> : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── CHANGE PASSWORD MODAL ────────────────────────────────────────────── */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 flex items-center justify-center p-4 z-50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-scale-up">
            <div className="bg-slate-900 p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4 text-amber-500" />
                <span className="font-bold text-sm tracking-tight font-mono uppercase">Change Password</span>
              </div>
              <button
                onClick={() => { setIsPasswordModalOpen(false); setErrorMsg(""); }}
                className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">

              {errorMsg && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 p-2.5 rounded-lg text-xs font-medium">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Current Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">New Password</label>
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Confirm New Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-slate-800"
                />
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setIsPasswordModalOpen(false); setErrorMsg(""); }}
                  className="flex-1 py-2 bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
