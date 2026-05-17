// src/pages/Profile.jsx
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { auth } from "../services/api";
import AppLayout from "../components/AppLayout";
import GlassCard from "../components/GlassCard";

const CHAT_STYLES = [
  { value: "supportive", label: "Supportive & Warm", icon: "favorite" },
  { value: "cbt", label: "CBT Techniques", icon: "psychology" },
  {
    value: "mindfulness",
    label: "Mindfulness-Based",
    icon: "self_improvement",
  },
  { value: "direct", label: "Direct & Practical", icon: "bolt" },
];

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    first_name: user?.first_name || "",
    email: user?.email || "",
    chat_style: user?.chat_style || "supportive",
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const updated = await auth.updateProfile(form);
      setUser(updated);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err?.detail || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout title="Profile" subtitle="Manage your account and preferences">
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Avatar Card */}
        <GlassCard className="p-6 flex items-center gap-5">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold shrink-0 shadow-[0_6px_20px_rgba(34,177,212,.35)]"
            style={{
              fontFamily: "serif",
              background: "linear-gradient(135deg,#22B1D4,#189AB4)",
            }}
          >
            {user?.username?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <h3
              className="text-xl font-bold text-[#1F2933]"
              style={{ fontFamily: "serif" }}
            >
              {user?.first_name || user?.username}
            </h3>
            <p className="text-sm text-[#9AA5B1]">@{user?.username}</p>
            <p className="text-xs text-[#9AA5B1] mt-1">
              Member since{" "}
              {new Date(user?.date_joined || Date.now()).toLocaleDateString()}
            </p>
          </div>
        </GlassCard>

        {/* Edit Form */}
        <GlassCard className="p-6">
          <h4
            className="text-lg font-bold text-[#1F2933] mb-5"
            style={{ fontFamily: "serif" }}
          >
            Account Details
          </h4>
          <form onSubmit={save} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-mono tracking-widest uppercase text-[#9AA5B1]">
                Display Name
              </label>
              <input
                value={form.first_name}
                onChange={(e) =>
                  setForm({ ...form, first_name: e.target.value })
                }
                placeholder="Your name"
                className="w-full px-4 py-3 rounded-xl border border-[#E4EEF3] focus:border-[#22B1D4] focus:ring-2 focus:ring-[#22B1D4]/10 bg-[#F8FAFC] text-sm outline-none transition-all text-[#1F2933] placeholder:text-[#9AA5B1]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono tracking-widest uppercase text-[#9AA5B1]">
                Email
              </label>
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                type="email"
                className="w-full px-4 py-3 rounded-xl border border-[#E4EEF3] focus:border-[#22B1D4] focus:ring-2 focus:ring-[#22B1D4]/10 bg-[#F8FAFC] text-sm outline-none transition-all text-[#1F2933] placeholder:text-[#9AA5B1]"
              />
            </div>

            {/* Chat Style */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-mono tracking-widest uppercase text-[#9AA5B1]">
                Preferred Chat Style
              </label>
              <div className="grid grid-cols-2 gap-2">
                {CHAT_STYLES.map((s) => (
                  <label key={s.value} className="cursor-pointer">
                    <input
                      type="radio"
                      name="chat_style"
                      value={s.value}
                      checked={form.chat_style === s.value}
                      onChange={() => setForm({ ...form, chat_style: s.value })}
                      className="sr-only"
                    />
                    <div
                      className={`flex items-center gap-2 p-3 rounded-xl border text-sm transition-all ${
                        form.chat_style === s.value
                          ? "border-[#22B1D4] bg-[#E8F8FC] text-[#22B1D4]"
                          : "border-[#E4EEF3] bg-white text-[#52606D] hover:border-[#D4EEF7] hover:bg-[#F8FAFC]"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {s.icon}
                      </span>
                      <span className="font-medium">{s.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-2.5 rounded-xl border border-red-100">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-[#E8F8FC] text-[#22B1D4] text-sm px-4 py-2.5 rounded-xl flex items-center gap-2 border border-[#D4EEF7]">
                <span className="material-symbols-outlined text-[18px]">
                  check_circle
                </span>
                Profile updated successfully!
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-all shadow-[0_4px_14px_rgba(34,177,212,.3)] disabled:opacity-50"
              style={{ background: "linear-gradient(135deg,#22B1D4,#189AB4)" }}
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </form>
        </GlassCard>

        {/* Privacy & Data */}
        <GlassCard className="p-6 border border-[#E4EEF3]">
          <h4
            className="text-lg font-bold text-[#1F2933] mb-1"
            style={{ fontFamily: "serif" }}
          >
            Privacy & Data
          </h4>
          <p className="text-sm text-[#9AA5B1] mb-4">
            Your mental health data is private and never shared with third
            parties.
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] border border-[#E4EEF3]">
              <div className="flex items-center gap-2 text-sm text-[#52606D]">
                <span className="material-symbols-outlined text-[#22B1D4] text-[18px]">
                  shield
                </span>
                End-to-end encryption
              </div>
              <span className="text-xs text-[#22B1D4] font-mono bg-[#E8F8FC] px-2 py-0.5 rounded-full border border-[#D4EEF7]">
                Active
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] border border-[#E4EEF3]">
              <div className="flex items-center gap-2 text-sm text-[#52606D]">
                <span className="material-symbols-outlined text-[#22B1D4] text-[18px]">
                  local_hospital
                </span>
                Local AI processing
              </div>
              <span className="text-xs text-[#22B1D4] font-mono bg-[#E8F8FC] px-2 py-0.5 rounded-full border border-[#D4EEF7]">
                Active
              </span>
            </div>
          </div>
        </GlassCard>
      </div>
    </AppLayout>
  );
}
