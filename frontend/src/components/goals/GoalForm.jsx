// src/components/goals/GoalForm.jsx
import { useState } from "react";
import GlassCard from "../GlassCard";
import { goals } from "../../services/api";

const CATEGORIES = [
  { value: "mental_health", label: "Mental Health", icon: "psychology" },
  { value: "relationships", label: "Relationships", icon: "group" },
  { value: "work", label: "Work / Career", icon: "work" },
  { value: "physical", label: "Physical Health", icon: "fitness_center" },
  { value: "habits", label: "Habits", icon: "repeat" },
  { value: "personal", label: "Personal Growth", icon: "person" },
  { value: "other", label: "Other", icon: "category" },
];

export default function GoalForm({ onSaved, onCancel }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("personal");
  const [targetDate, setTargetDate] = useState("");
  const [milestones, setMilestones] = useState([""]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const addMilestone = () => setMilestones([...milestones, ""]);
  const updateMilestone = (i, val) => {
    const copy = [...milestones];
    copy[i] = val;
    setMilestones(copy);
  };
  const removeMilestone = (i) => setMilestones(milestones.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    if (!title.trim()) { setError("Goal title is required."); return; }
    setSaving(true);
    setError("");
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        category,
        ...(targetDate && { target_date: targetDate }),
      };
      const created = await goals.create(payload);

      // Add milestones
      const validMilestones = milestones.filter((m) => m.trim());
      for (const m of validMilestones) {
        await goals.addMilestone(created.id, { title: m.trim() });
      }

      onSaved();
    } catch (e) {
      setError(e?.title?.[0] || "Failed to create goal.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 text-sm text-[#52606D] hover:text-[#22B1D4] transition-colors font-medium"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition shadow-[0_4px_12px_rgba(34,177,212,.3)] disabled:opacity-60"
          style={{ background: "linear-gradient(135deg,#22B1D4,#189AB4)" }}
        >
          {saving ? (
            <><span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>Creating…</>
          ) : (
            <><span className="material-symbols-outlined text-[16px]">add</span>Create Goal</>
          )}
        </button>
      </div>

      <GlassCard className="p-6 space-y-5">
        {/* Title */}
        <div>
          <label className="text-xs font-mono text-[#9AA5B1] uppercase tracking-widest mb-2 block">Goal Title *</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What do you want to achieve?"
            className="w-full px-4 py-3 rounded-xl border border-[#E4EEF3] text-[#1F2933] text-sm placeholder-[#9AA5B1] focus:outline-none focus:border-[#22B1D4] focus:ring-2 focus:ring-[#22B1D4]/10 transition"
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-mono text-[#9AA5B1] uppercase tracking-widest mb-2 block">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your goal and why it matters to you…"
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-[#E4EEF3] text-[#1F2933] text-sm placeholder-[#9AA5B1] focus:outline-none focus:border-[#22B1D4] focus:ring-2 focus:ring-[#22B1D4]/10 transition resize-none"
          />
        </div>

        {/* Category */}
        <div>
          <label className="text-xs font-mono text-[#9AA5B1] uppercase tracking-widest mb-2 block">Category</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                  category === cat.value
                    ? "border-[#22B1D4] bg-[#E8F8FC] text-[#22B1D4]"
                    : "border-[#E4EEF3] text-[#52606D] hover:border-[#22B1D4]/40"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Target date */}
        <div>
          <label className="text-xs font-mono text-[#9AA5B1] uppercase tracking-widest mb-2 block">Target Date (optional)</label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="px-4 py-2.5 rounded-xl border border-[#E4EEF3] text-[#1F2933] text-sm focus:outline-none focus:border-[#22B1D4] focus:ring-2 focus:ring-[#22B1D4]/10 transition"
          />
        </div>

        {/* Milestones */}
        <div>
          <label className="text-xs font-mono text-[#9AA5B1] uppercase tracking-widest mb-2 block">Milestones (optional)</label>
          <div className="space-y-2">
            {milestones.map((m, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={m}
                  onChange={(e) => updateMilestone(i, e.target.value)}
                  placeholder={`Milestone ${i + 1}…`}
                  className="flex-1 px-3 py-2 rounded-xl border border-[#E4EEF3] text-sm text-[#1F2933] placeholder-[#9AA5B1] focus:outline-none focus:border-[#22B1D4] transition"
                />
                {milestones.length > 1 && (
                  <button
                    onClick={() => removeMilestone(i)}
                    className="p-2 rounded-xl text-[#9AA5B1] hover:text-red-400 hover:bg-red-50 transition"
                  >
                    <span className="material-symbols-outlined text-[16px]">remove</span>
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addMilestone}
              className="flex items-center gap-1.5 text-xs text-[#22B1D4] hover:underline font-mono"
            >
              <span className="material-symbols-outlined text-[14px]">add</span>
              Add milestone
            </button>
          </div>
        </div>

        {error && (
          <p className="text-xs text-red-500 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px]">error</span>
            {error}
          </p>
        )}
      </GlassCard>
    </div>
  );
}
