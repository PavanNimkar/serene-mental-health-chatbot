// src/components/goals/GoalDetail.jsx
import { useState } from "react";
import GlassCard from "../GlassCard";
import { goals } from "../../services/api";

const STATUS_OPTIONS = [
  { value: "active", label: "Active", color: "text-[#22B1D4]" },
  { value: "paused", label: "Paused", color: "text-amber-500" },
  { value: "completed", label: "Completed", color: "text-emerald-600" },
  { value: "abandoned", label: "Abandoned", color: "text-[#9AA5B1]" },
];

const CATEGORY_LABELS = {
  mental_health: "Mental Health",
  relationships: "Relationships",
  work: "Work / Career",
  physical: "Physical Health",
  habits: "Habits",
  personal: "Personal Growth",
  other: "Other",
};

export default function GoalDetail({ goal, onUpdate, onDelete, onBack, onMilestoneAdded, onMilestoneComplete }) {
  const [newMilestone, setNewMilestone] = useState("");
  const [addingMs, setAddingMs] = useState(false);
  const [progressEdit, setProgressEdit] = useState(goal.progress_pct || 0);
  const [savingProgress, setSavingProgress] = useState(false);
  const [completingId, setCompletingId] = useState(null);

  const handleAddMilestone = async () => {
    if (!newMilestone.trim()) return;
    setAddingMs(true);
    try {
      await goals.addMilestone(goal.id, { title: newMilestone.trim() });
      setNewMilestone("");
      onMilestoneAdded();
    } catch (e) {
      console.error(e);
    } finally {
      setAddingMs(false);
    }
  };

  const handleComplete = async (mid) => {
    setCompletingId(mid);
    try {
      await onMilestoneComplete(mid);
    } finally {
      setCompletingId(null);
    }
  };

  const handleProgressSave = async () => {
    setSavingProgress(true);
    try {
      await onUpdate(goal.id, { progress_pct: progressEdit });
    } finally {
      setSavingProgress(false);
    }
  };

  const handleStatusChange = async (status) => {
    await onUpdate(goal.id, { status });
  };

  const daysLeft = goal.target_date
    ? Math.ceil((new Date(goal.target_date) - new Date()) / 86400000)
    : null;

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Nav */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-[#52606D] hover:text-[#22B1D4] transition-colors font-medium"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to Goals
        </button>
        <button
          onClick={onDelete}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 border border-red-100 transition"
        >
          <span className="material-symbols-outlined text-[16px]">delete</span>
          Delete
        </button>
      </div>

      {/* Main card */}
      <GlassCard className="p-6 space-y-5">
        {/* Title + meta */}
        <div>
          <div className="flex items-start justify-between gap-3 mb-2">
            <h2 className="text-2xl font-bold text-[#1F2933] leading-tight" style={{ fontFamily: "serif" }}>
              {goal.title}
            </h2>
            {/* Status selector */}
            <select
              value={goal.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="text-xs font-mono px-2.5 py-1.5 rounded-lg border border-[#E4EEF3] text-[#52606D] focus:outline-none focus:border-[#22B1D4] transition bg-white"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3 text-xs text-[#9AA5B1] font-mono flex-wrap">
            <span>{CATEGORY_LABELS[goal.category] || goal.category}</span>
            {goal.target_date && (
              <>
                <span>·</span>
                <span className={daysLeft < 0 ? "text-red-400" : daysLeft < 7 ? "text-amber-500" : ""}>
                  {daysLeft < 0
                    ? `${Math.abs(daysLeft)}d overdue`
                    : daysLeft === 0
                    ? "Due today"
                    : `${daysLeft}d left`}
                  {" "}({goal.target_date})
                </span>
              </>
            )}
          </div>
        </div>

        {goal.description && (
          <p className="text-sm text-[#52606D] leading-relaxed">{goal.description}</p>
        )}

        {/* Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-[#9AA5B1] uppercase tracking-widest">Progress</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                max={100}
                value={progressEdit}
                onChange={(e) => setProgressEdit(Math.min(100, Math.max(0, +e.target.value)))}
                className="w-14 px-2 py-1 text-xs font-mono text-center rounded-lg border border-[#E4EEF3] focus:outline-none focus:border-[#22B1D4] transition"
              />
              <span className="text-xs text-[#9AA5B1]">%</span>
              {progressEdit !== goal.progress_pct && (
                <button
                  onClick={handleProgressSave}
                  disabled={savingProgress}
                  className="text-xs px-2.5 py-1 rounded-lg bg-[#22B1D4] text-white font-medium hover:opacity-90 transition disabled:opacity-60"
                >
                  {savingProgress ? "…" : "Save"}
                </button>
              )}
            </div>
          </div>
          <div className="h-2 bg-[#E4EEF3] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${goal.progress_pct}%`,
                background: goal.progress_pct === 100
                  ? "linear-gradient(90deg,#10B981,#059669)"
                  : "linear-gradient(90deg,#22B1D4,#189AB4)",
              }}
            />
          </div>
        </div>

        {/* AI nudge */}
        {goal.ai_nudge && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-[#E8F8FC]/60 border border-[#D4EEF7]">
            <span className="material-symbols-outlined text-[18px] text-[#22B1D4] mt-0.5 shrink-0">auto_awesome</span>
            <div>
              <p className="text-[11px] font-mono text-[#9AA5B1] uppercase tracking-widest mb-1">AI Insight</p>
              <p className="text-sm text-[#22B1D4] leading-relaxed">{goal.ai_nudge}</p>
            </div>
          </div>
        )}
      </GlassCard>

      {/* Milestones */}
      <GlassCard className="p-6">
        <h4 className="font-semibold text-[#1F2933] text-sm mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-[#22B1D4]">checklist</span>
          Milestones
          {goal.milestones_total > 0 && (
            <span className="ml-auto text-xs font-mono text-[#9AA5B1]">
              {goal.milestones_done}/{goal.milestones_total}
            </span>
          )}
        </h4>

        {/* Milestone list */}
        <div className="space-y-2 mb-4">
          {(goal.milestones || []).length === 0 ? (
            <p className="text-sm text-[#9AA5B1] py-2">No milestones yet. Add one below.</p>
          ) : (
            goal.milestones.map((ms) => (
              <div
                key={ms.id}
                className={`flex items-center gap-3 p-3 rounded-xl border transition ${
                  ms.is_complete
                    ? "bg-emerald-50 border-emerald-100"
                    : "bg-[#F8FAFC] border-[#E4EEF3]"
                }`}
              >
                <button
                  onClick={() => !ms.is_complete && handleComplete(ms.id)}
                  disabled={ms.is_complete || completingId === ms.id}
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition ${
                    ms.is_complete
                      ? "border-emerald-500 bg-emerald-500"
                      : "border-[#D4EEF7] hover:border-[#22B1D4]"
                  } disabled:cursor-not-allowed`}
                >
                  {ms.is_complete && (
                    <span className="material-symbols-outlined text-white text-[12px]">check</span>
                  )}
                  {completingId === ms.id && (
                    <span className="material-symbols-outlined text-[#22B1D4] text-[12px] animate-spin">refresh</span>
                  )}
                </button>
                <span className={`text-sm flex-1 ${ms.is_complete ? "line-through text-[#9AA5B1]" : "text-[#1F2933]"}`}>
                  {ms.title}
                </span>
                {ms.is_complete && ms.completed_at && (
                  <span className="text-[10px] font-mono text-emerald-500">
                    {new Date(ms.completed_at).toLocaleDateString()}
                  </span>
                )}
              </div>
            ))
          )}
        </div>

        {/* Add milestone */}
        <div className="flex gap-2">
          <input
            value={newMilestone}
            onChange={(e) => setNewMilestone(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddMilestone()}
            placeholder="Add a milestone…"
            className="flex-1 px-3 py-2.5 rounded-xl border border-[#E4EEF3] text-sm text-[#1F2933] placeholder-[#9AA5B1] focus:outline-none focus:border-[#22B1D4] focus:ring-2 focus:ring-[#22B1D4]/10 transition"
          />
          <button
            onClick={handleAddMilestone}
            disabled={addingMs || !newMilestone.trim()}
            className="px-4 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition disabled:opacity-50"
            style={{ background: "linear-gradient(135deg,#22B1D4,#189AB4)" }}
          >
            {addingMs ? "…" : "Add"}
          </button>
        </div>
      </GlassCard>
    </div>
  );
}
