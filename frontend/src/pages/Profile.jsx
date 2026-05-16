// src/pages/Profile.jsx
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { auth } from "../services/api";
import AppLayout from "../components/AppLayout";
import GlassCard from "../components/GlassCard";

const CHAT_STYLES = [
  { value: "supportive", label: "Supportive & Warm", icon: "favorite" },
  { value: "cbt", label: "CBT Techniques", icon: "psychology" },
  { value: "mindfulness", label: "Mindfulness-Based", icon: "self_improvement" },
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
          <div className="w-20 h-20 rounded-full bg-[#5742d3] flex items-center justify-center text-white text-3xl font-bold font-display shrink-0">
            {user?.username?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <h3 className="font-display text-xl font-bold text-[#111c2d]">
              {user?.first_name || user?.username}
            </h3>
            <p className="text-sm text-[#787586]">@{user?.username}</p>
            <p className="text-xs text-[#787586] mt-1">Member since {new Date(user?.date_joined || Date.now()).toLocaleDateString()}</p>
          </div>
        </GlassCard>

        {/* Edit Form */}
        <GlassCard className="p-6">
          <h4 className="font-display text-lg font-bold text-[#111c2d] mb-5">Account Details</h4>
          <form onSubmit={save} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-mono tracking-widest uppercase text-[#787586]">Display Name</label>
              <input
                value={form.first_name}
                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                placeholder="Your name"
                className="w-full px-4 py-3 rounded-xl border border-[#c8c4d7]/40 focus:border-[#5742d3] focus:ring-2 focus:ring-[#5742d3]/10 bg-white/60 text-sm outline-none transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono tracking-widest uppercase text-[#787586]">Email</label>
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                type="email"
                className="w-full px-4 py-3 rounded-xl border border-[#c8c4d7]/40 focus:border-[#5742d3] focus:ring-2 focus:ring-[#5742d3]/10 bg-white/60 text-sm outline-none transition-all"
              />
            </div>

            {/* Chat Style */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-mono tracking-widest uppercase text-[#787586]">Preferred Chat Style</label>
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
                          ? "border-[#5742d3] bg-[#5742d3]/5 text-[#5742d3]"
                          : "border-[#c8c4d7]/30 glass-card text-[#474554] hover:bg-white/80"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">{s.icon}</span>
                      <span className="font-medium">{s.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-[#ffdad6] text-[#93000a] text-sm px-4 py-2.5 rounded-xl">{error}</div>
            )}
            {success && (
              <div className="bg-[#75f9d3]/30 text-[#006b56] text-sm px-4 py-2.5 rounded-xl flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                Profile updated successfully!
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 rounded-xl bg-[#5742d3] text-white font-semibold text-sm hover:bg-[#4126bd] transition-colors shadow-lg shadow-[#5742d3]/15 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </form>
        </GlassCard>

        {/* Danger Zone */}
        <GlassCard className="p-6 border border-[#ffdad6]/50">
          <h4 className="font-display text-lg font-bold text-[#111c2d] mb-1">Privacy & Data</h4>
          <p className="text-sm text-[#787586] mb-4">
            Your mental health data is private and never shared with third parties.
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#f0f3ff]">
              <div className="flex items-center gap-2 text-sm text-[#474554]">
                <span className="material-symbols-outlined text-[#5742d3] text-[18px]">shield</span>
                End-to-end encryption
              </div>
              <span className="text-xs text-[#006b56] font-mono bg-[#75f9d3]/30 px-2 py-0.5 rounded-full">Active</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#f0f3ff]">
              <div className="flex items-center gap-2 text-sm text-[#474554]">
                <span className="material-symbols-outlined text-[#5742d3] text-[18px]">local_hospital</span>
                Local AI processing
              </div>
              <span className="text-xs text-[#006b56] font-mono bg-[#75f9d3]/30 px-2 py-0.5 rounded-full">Active</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </AppLayout>
  );
}
