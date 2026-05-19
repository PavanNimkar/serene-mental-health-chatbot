// src/components/goals/GoalCard.jsx
import GlassCard from "../GlassCard";

const CATEGORY_STYLES = {
  mental_health: { bg: "bg-[#E8F8FC]", text: "text-[#22B1D4]", icon: "psychology" },
  relationships: { bg: "bg-pink-50", text: "text-pink-500", icon: "group" },
  work: { bg: "bg-amber-50", text: "text-amber-600", icon: "work" },
  physical: { bg: "bg-emerald-50", text: "text-emerald-600", icon: "fitness_center" },
  habits: { bg: "bg-violet-50", text: "text-violet-600", icon: "repeat" },
  personal: { bg: "bg-indigo-50", text: "text-indigo-600", icon: "person" },
  other: { bg: "bg-[#F8FAFC]", text: "text-[#9AA5B1]", icon: "category" },
};

const STATUS_STYLES = {
  active: { dot: "bg-[#22B1D4]", text: "text-[#22B1D4]", label: "Active" },
  paused: { dot: "bg-amber-400", text: "text-amber-500", label: "Paused" },
  completed: { dot: "bg-emerald-500", text: "text-emerald-600", label: "Completed" },
  abandoned: { dot: "bg-[#9AA5B1]", text: "text-[#9AA5B1]", label: "Abandoned" },
};

export default function GoalCard({ goal, onClick, onDelete }) {
  const cat = CATEGORY_STYLES[goal.category] || CATEGORY_STYLES.other;
  const status = STATUS_STYLES[goal.status] || STATUS_STYLES.active;
  const progress = goal.progress_pct || 0;
  const daysLeft = goal.target_date
    ? Math.ceil((new Date(goal.target_date) - new Date()) / 86400000)
    : null;

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <GlassCard hover onClick={onClick} className="p-5 group relative">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <span className={`p-2 rounded-xl ${cat.bg}`}>
            <span className={`material-symbols-outlined text-[18px] ${cat.text}`}>{cat.icon}</span>
          </span>
          <div>
            <h4 className="font-semibold text-[#1F2933] text-sm leading-tight">{goal.title}</h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
              <span className={`text-[11px] font-mono ${status.text}`}>{status.label}</span>
            </div>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-red-50 text-[#9AA5B1] hover:text-red-400 shrink-0"
        >
          <span className="material-symbols-outlined text-[16px]">delete</span>
        </button>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-[#9AA5B1]">Progress</span>
          <span className="text-xs font-mono font-bold text-[#1F2933]">{progress}%</span>
        </div>
        <div className="h-1.5 bg-[#E4EEF3] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: progress === 100
                ? "linear-gradient(90deg,#10B981,#059669)"
                : "linear-gradient(90deg,#22B1D4,#189AB4)",
            }}
          />
        </div>
      </div>

      {/* Milestones */}
      {goal.milestones_total > 0 && (
        <div className="flex items-center gap-1.5 mb-3 text-xs text-[#9AA5B1]">
          <span className="material-symbols-outlined text-[14px]">checklist</span>
          <span>
            {goal.milestones_done}/{goal.milestones_total} milestones
          </span>
        </div>
      )}

      {/* AI nudge */}
      {goal.ai_nudge && (
        <div className="flex items-start gap-2 p-2.5 rounded-xl bg-[#E8F8FC] border border-[#D4EEF7] mb-3">
          <span className="material-symbols-outlined text-[13px] text-[#22B1D4] mt-0.5 shrink-0">auto_awesome</span>
          <p className="text-[11px] text-[#22B1D4] leading-relaxed line-clamp-2">{goal.ai_nudge}</p>
        </div>
      )}

      {/* Footer */}
      {daysLeft !== null && (
        <div className={`flex items-center gap-1 text-[11px] font-mono ${
          daysLeft < 0 ? "text-red-400" : daysLeft < 7 ? "text-amber-500" : "text-[#9AA5B1]"
        }`}>
          <span className="material-symbols-outlined text-[14px]">schedule</span>
          {daysLeft < 0
            ? `${Math.abs(daysLeft)} days overdue`
            : daysLeft === 0
            ? "Due today"
            : `${daysLeft} days left`}
        </div>
      )}
    </GlassCard>
  );
}
