// src/components/journal/JournalStats.jsx
import GlassCard from "../GlassCard";

export default function JournalStats({ stats }) {
  if (!stats) return null;
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <GlassCard className="p-4 flex items-center gap-3">
        <span className="p-2 rounded-xl bg-[#E8F8FC]">
          <span className="material-symbols-outlined text-[20px] text-[#22B1D4]">menu_book</span>
        </span>
        <div>
          <p className="text-xs text-[#9AA5B1]">Total Entries</p>
          <p className="text-xl font-bold text-[#1F2933]" style={{ fontFamily: "serif" }}>
            {stats.total_entries ?? 0}
          </p>
        </div>
      </GlassCard>

      <GlassCard className="p-4 flex items-center gap-3">
        <span className="p-2 rounded-xl bg-emerald-50">
          <span className="material-symbols-outlined text-[20px] text-emerald-500">local_fire_department</span>
        </span>
        <div>
          <p className="text-xs text-[#9AA5B1]">Writing Streak</p>
          <p className="text-xl font-bold text-[#1F2933]" style={{ fontFamily: "serif" }}>
            {stats.streak_days ?? 0} <span className="text-sm font-normal text-[#9AA5B1]">days</span>
          </p>
        </div>
      </GlassCard>

      <GlassCard className="p-4 flex items-center gap-3">
        <span className="p-2 rounded-xl bg-violet-50">
          <span className="material-symbols-outlined text-[20px] text-violet-500">calendar_today</span>
        </span>
        <div>
          <p className="text-xs text-[#9AA5B1]">This Week</p>
          <p className="text-xl font-bold text-[#1F2933]" style={{ fontFamily: "serif" }}>
            {stats.entries_this_week ?? 0}
          </p>
        </div>
      </GlassCard>

      <GlassCard className="p-4 flex items-center gap-3">
        <span className="p-2 rounded-xl bg-amber-50">
          <span className="material-symbols-outlined text-[20px] text-amber-500">label</span>
        </span>
        <div>
          <p className="text-xs text-[#9AA5B1]">Top Tag</p>
          <p className="text-sm font-bold text-[#1F2933] truncate">
            {stats.top_tags?.[0]?.tag ? `#${stats.top_tags[0].tag}` : "—"}
          </p>
        </div>
      </GlassCard>
    </div>
  );
}
