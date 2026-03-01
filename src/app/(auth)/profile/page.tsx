"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaEdit,
  FaSave,
  FaTimes,
  FaCalendarAlt,
  FaHeart,
  FaUtensils,
  FaShieldAlt,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getFavorites, getDietPlan, updateProfile } from "@/utils/api";
import axios from "axios";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProfileStats {
  favoriteRecipes: number;
  plansMade: number;
}

interface EditForm {
  name: string;
  email: string;
  current_password: string;
  password: string;
  password_confirmation: string;
}

interface FieldErrors {
  name?: string;
  email?: string;
  current_password?: string;
  password?: string;
  password_confirmation?: string;
}

// ─── Helper: Input field ──────────────────────────────────────────────────────

function Field({
  label,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  readOnly = false,
  rightElement,
}: {
  label: string;
  type?: string;
  value: string;
  onChange?: (v: string) => void;
  error?: string;
  placeholder?: string;
  readOnly?: boolean;
  rightElement?: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-600 mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`w-full px-4 py-3 rounded-xl border transition-all pr-10
            ${readOnly ? "bg-gray-50 text-gray-500 cursor-not-allowed" : "bg-white focus:ring-2 focus:ring-green-400 focus:border-transparent"}
            ${error ? "border-red-400" : "border-gray-300"}
          `}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
          <FaExclamationCircle /> {error}
        </p>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading, logout, isAdmin, updateUser } = useAuth();

  // Stats
  const [statsLoading, setStatsLoading] = useState(true);
  const [stats, setStats] = useState<ProfileStats>({ favoriteRecipes: 0, plansMade: 0 });

  // Edit form
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [globalError, setGlobalError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [changePassword, setChangePassword] = useState(false);

  const [form, setForm] = useState<EditForm>({
    name: "",
    email: "",
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  // ─── Auth guard ──────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // ─── Sync form with user ─────────────────────────────────────────────────────

  useEffect(() => {
    if (user) {
      setForm((prev) => ({ ...prev, name: user.name, email: user.email }));
    }
  }, [user]);

  // ─── Fetch stats ─────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!isAuthenticated) return;
    (async () => {
      setStatsLoading(true);
      const [favRes, planRes] = await Promise.allSettled([getFavorites(), getDietPlan(1)]);
      const count = (res: PromiseSettledResult<any>) => {
        if (res.status !== "fulfilled") return 0;
        const d = res.value;
        return Array.isArray(d) ? d.length : d?.data?.length ?? 0;
      };
      setStats({ favoriteRecipes: count(favRes), plansMade: count(planRes) });
      setStatsLoading(false);
    })();
  }, [isAuthenticated]);

  // ─── Handlers ────────────────────────────────────────────────────────────────

  const openEdit = () => {
    setForm({
      name: user?.name ?? "",
      email: user?.email ?? "",
      current_password: "",
      password: "",
      password_confirmation: "",
    });
    setFieldErrors({});
    setGlobalError("");
    setSuccessMsg("");
    setChangePassword(false);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setFieldErrors({});
    setGlobalError("");
  };

  const set = (key: keyof EditForm) => (val: string) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  // Client-side validation
  const validate = (): boolean => {
    const errs: FieldErrors = {};
    if (!form.name.trim()) errs.name = "Name is required.";
    if (!form.email.trim()) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Invalid email format.";

    if (changePassword) {
      if (!form.current_password) errs.current_password = "Current password is required.";
      if (!form.password) errs.password = "New password is required.";
      else if (form.password.length < 8) errs.password = "Password must be at least 8 characters.";
      if (form.password !== form.password_confirmation)
        errs.password_confirmation = "Passwords do not match.";
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    setGlobalError("");
    setSuccessMsg("");

    try {
      const payload: Record<string, string> = {
        name: form.name.trim(),
        email: form.email.trim(),
      };
      if (changePassword) {
        payload.current_password    = form.current_password;
        payload.password            = form.password;
        payload.password_confirmation = form.password_confirmation;
      }

      await updateUser(payload);
      setSuccessMsg("Profile updated successfully!");
      setIsEditing(false);
    } catch (err: any) {
      // Laravel returns 422 with errors object
      if (axios.isAxiosError(err) && err.response?.status === 422) {
        const serverErrors = err.response.data?.errors ?? {};
        const mapped: FieldErrors = {};
        for (const [key, messages] of Object.entries(serverErrors)) {
          mapped[key as keyof FieldErrors] = (messages as string[])[0];
        }
        setFieldErrors(mapped);
        setGlobalError(err.response.data?.message ?? "Please fix the errors below.");
      } else {
        setGlobalError("Something went wrong. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  // ─── Guards ───────────────────────────────────────────────────────────────────

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600" />
      </div>
    );
  }
  if (!isAuthenticated || !user) return null;

  // ─── Stats cards ─────────────────────────────────────────────────────────────

  const statsCards = [
    {
      icon: FaHeart,
      label: "Favorite Recipes",
      value: stats.favoriteRecipes,
      color: "from-teal-500 to-cyan-600",
      bgColor: "from-teal-100 to-teal-50",
    },
    {
      icon: FaCalendarAlt,
      label: "Diet Plan Meals",
      value: stats.plansMade,
      color: "from-emerald-500 to-green-600",
      bgColor: "from-emerald-100 to-emerald-50",
    },
  ];

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Page header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">My Profile</h1>
            <p className="text-green-100 text-lg max-w-2xl mx-auto">
              Manage your account settings and track your healthy journey
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">

        {/* ── Success toast ── */}
        <AnimatePresence>
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 bg-green-50 border border-green-300 text-green-800 px-5 py-4 rounded-xl shadow"
            >
              <FaCheckCircle className="text-green-500 text-lg shrink-0" />
              <span className="font-medium">{successMsg}</span>
              <button onClick={() => setSuccessMsg("")} className="ml-auto text-green-600 hover:text-green-800">
                <FaTimes />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Profile card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Coloured header strip */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-10 text-white">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <FaUser className="text-5xl text-green-600" />
                </div>
                <div className="absolute bottom-0 right-0 bg-emerald-500 w-9 h-9 rounded-full flex items-center justify-center border-4 border-white shadow">
                  {isAdmin ? <FaShieldAlt className="text-white text-xs" /> : <FaUser className="text-white text-xs" />}
                </div>
              </div>

              {/* Name / email */}
              <div className="text-center md:text-left flex-1 min-w-0">
                <h2 className="text-3xl font-bold truncate">{user.name}</h2>
                <p className="text-green-100 flex items-center justify-center md:justify-start gap-2 mt-1">
                  <FaEnvelope className="text-sm shrink-0" />
                  <span className="truncate">{user.email}</span>
                </p>
                <span className="inline-block mt-2 text-xs font-semibold bg-white/20 px-3 py-1 rounded-full capitalize">
                  {user.role}
                </span>
              </div>

              {/* Edit button */}
              {!isEditing && (
                <button
                  onClick={openEdit}
                  className="bg-white text-green-600 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2 shrink-0"
                >
                  <FaEdit /> Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* ── Edit form ── */}
          <AnimatePresence>
            {isEditing && (
              <motion.div
                key="edit-form"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-8 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      <FaEdit className="text-green-500" /> Edit Profile
                    </h3>
                    <button onClick={cancelEdit} className="text-gray-400 hover:text-gray-600 transition-colors">
                      <FaTimes className="text-xl" />
                    </button>
                  </div>

                  {/* Global error */}
                  {globalError && (
                    <div className="mb-5 flex items-center gap-3 bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-xl text-sm">
                      <FaExclamationCircle className="shrink-0" /> {globalError}
                    </div>
                  )}

                  <div className="space-y-5">
                    {/* Name */}
                    <Field
                      label="Full Name"
                      value={form.name}
                      onChange={set("name")}
                      error={fieldErrors.name}
                      placeholder="Your full name"
                    />

                    {/* Email */}
                    <Field
                      label="Email Address"
                      type="email"
                      value={form.email}
                      onChange={set("email")}
                      error={fieldErrors.email}
                      placeholder="you@example.com"
                    />

                    {/* Change password toggle */}
                    <div>
                      <button
                        type="button"
                        onClick={() => {
                          setChangePassword((v) => !v);
                          setFieldErrors((prev) => ({
                            ...prev,
                            current_password: undefined,
                            password: undefined,
                            password_confirmation: undefined,
                          }));
                          setForm((prev) => ({
                            ...prev,
                            current_password: "",
                            password: "",
                            password_confirmation: "",
                          }));
                        }}
                        className="flex items-center gap-2 text-sm font-semibold text-green-600 hover:text-green-700 transition-colors"
                      >
                        <FaLock />
                        {changePassword ? "Cancel password change" : "Change Password"}
                      </button>
                    </div>

                    {/* Password fields */}
                    <AnimatePresence>
                      {changePassword && (
                        <motion.div
                          key="pw-fields"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden space-y-4 border-t border-gray-100 pt-5"
                        >
                          {/* Current password */}
                          <Field
                            label="Current Password"
                            type={showCurrentPw ? "text" : "password"}
                            value={form.current_password}
                            onChange={set("current_password")}
                            error={fieldErrors.current_password}
                            placeholder="Enter current password"
                            rightElement={
                              <button
                                type="button"
                                onClick={() => setShowCurrentPw((v) => !v)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                              >
                                {showCurrentPw ? <FaEyeSlash /> : <FaEye />}
                              </button>
                            }
                          />

                          {/* New password */}
                          <Field
                            label="New Password"
                            type={showNewPw ? "text" : "password"}
                            value={form.password}
                            onChange={set("password")}
                            error={fieldErrors.password}
                            placeholder="Min. 8 characters"
                            rightElement={
                              <button
                                type="button"
                                onClick={() => setShowNewPw((v) => !v)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                              >
                                {showNewPw ? <FaEyeSlash /> : <FaEye />}
                              </button>
                            }
                          />

                          {/* Confirm password */}
                          <Field
                            label="Confirm New Password"
                            type={showConfirmPw ? "text" : "password"}
                            value={form.password_confirmation}
                            onChange={set("password_confirmation")}
                            error={fieldErrors.password_confirmation}
                            placeholder="Repeat new password"
                            rightElement={
                              <button
                                type="button"
                                onClick={() => setShowConfirmPw((v) => !v)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                              >
                                {showConfirmPw ? <FaEyeSlash /> : <FaEye />}
                              </button>
                            }
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Action buttons */}
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <FaSave />
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        onClick={cancelEdit}
                        disabled={saving}
                        className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all flex items-center gap-2 disabled:opacity-60"
                      >
                        <FaTimes /> Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Read-only account info ── */}
          {!isEditing && (
            <div className="p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-5">Account Information</h3>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Full Name</p>
                  <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800">{user.name}</div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Email Address</p>
                  <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800 flex items-center gap-2">
                    <FaEnvelope className="text-gray-400 shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Role</p>
                  <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800 capitalize flex items-center gap-2">
                    {isAdmin ? <FaShieldAlt className="text-emerald-500" /> : <FaUser className="text-gray-400" />}
                    {user.role}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">User ID</p>
                  <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-500 font-mono text-sm">#{user.id}</div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* ── Stats ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h3 className="text-2xl font-bold text-gray-800 mb-5">Your Activity</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {statsCards.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className={`bg-gradient-to-br ${stat.bgColor} p-6`}>
                  <div className={`bg-gradient-to-br ${stat.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <stat.icon className="text-3xl text-white" />
                  </div>
                  <div className="text-4xl font-bold text-gray-800 mb-1">
                    {statsLoading ? (
                      <span className="inline-block w-10 h-9 bg-gray-200 animate-pulse rounded" />
                    ) : (
                      stat.value
                    )}
                  </div>
                  <div className="text-gray-600 font-semibold">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Quick Actions ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-5">Quick Actions</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => router.push('/recipes')}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-3"
            >
              <FaUtensils /> Browse Recipes
            </button>
            <button
              onClick={() => router.push('/diet-plan')}
              className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-6 py-4 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-3"
            >
              <FaCalendarAlt /> View Diet Plan
            </button>
            {isAdmin && (
              <button
                onClick={() => router.push('/admin')}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-4 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-3 md:col-span-2"
              >
                <FaShieldAlt /> Admin Dashboard
              </button>
            )}
          </div>
        </motion.div>

        {/* ── Logout ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">Sign Out</h3>
              <p className="text-gray-500 text-sm">You can always sign back in anytime</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition-all flex items-center gap-2"
            >
              <MdLogout /> Logout
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}