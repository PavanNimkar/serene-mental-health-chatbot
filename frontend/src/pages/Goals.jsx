// src/pages/Goals.jsx
import { useState, useEffect, useCallback } from "react";
import AppLayout from "../components/AppLayout";
import GlassCard from "../components/GlassCard";
import GoalCard from "../components/goals/GoalCard";
import GoalForm from "../components/goals/GoalForm";
import GoalDetail from "../components/goals/GoalDetail";
import { goals } from "../services/api";

const STATUS_TABS = [
  { value: "", label: "All" },
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "completed", label: "Completed" },
];

export default function Goals() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list"); // list | create | detail
  const [selected, setSelected] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = statusFilter ? { status: statusFilter } : {};
      const data = await goals.list(params);
      setItems(Array.isArray(data) ? data : data.results || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { load(); }, [load]);

  const handleSaved = () => {
    setView("list");
    setSelected(null);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this goal?")) return;
    await goals.delete(id);
    setView("list");
    setSelected(null);
    load();
  };

  const openGoal = async (goal) => {
    try {
      const full = await goals.get(goal.id);
      setSelected(full);
      setView("detail");
    } catch (e) {
      setSelected(goal);
      setView("detail");
    }
  };

  const activeCount = items.filter((g) => g.status === "active").length;
  const completedCount = items.filter((g) => g.status === "completed").length;
  const avgProgress = items.length
    ? Math.round(items.reduce((a, g) => a + (g.progress_pct || 0), 0) / items.length)
    : 0;

  return (
    <AppLayout title="My Goals" subtitle="Track your progress and celebrate every milestone">
      <div className="space-y-5">
        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-3">
          <GlassCard className="p-4 flex items-center gap-3">
            <span className="p-2 rounded-xl bg-[#E8F8FC]">
              <span className="material-symbols-outlined text-[20px] text-[#22B1D4]">flag</span>
            </span>
            <div>
              <p className="text-xs text-[#9AA5B1]">Active Goals</p>
              <p className="text-xl font-bold text-[#1F2933]" style={{ fontFamily: "serif" }}>{activeCount}</p>
            </div>
          </GlassCard>
          <GlassCard className="p-4 flex items-center gap-3">
            <span className="p-2 rounded-xl bg-emerald-50">
              <span className="material-symbols-outlined text-[20px] text-emerald-500">check_circle</span>
            </span>
            <div>
              <p className="text-xs text-[#9AA5B1]">Completed</p>
              <p className="text-xl font-bold text-[#1F2933]" style={{ fontFamily: "serif" }}>{completedCount}</p>
            </div>
          </GlassCard>
          <GlassCard className="p-4 flex items-center gap-3">
            <span className="p-2 rounded-xl bg-violet-50">
              <span className="material-symbols-outlined text-[20px] text-violet-500">trending_up</span>
            </span>
            <div>
              <p className="text-xs text-[#9AA5B1]">Avg Progress</p>
              <p className="text-xl font-bold text-[#1F2933]" style={{ fontFamily: "serif" }}>{avgProgress}%</p>
            </div>
          </GlassCard>
        </div>

        {view === "list" && (
          <>
            {/* Filters + Add */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex gap-1 p-1 bg-white rounded-xl border border-[#E4EEF3]">
                {STATUS_TABS.map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setStatusFilter(tab.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                      statusFilter === tab.value
                        ? "bg-[#22B1D4] text-white shadow-sm"
                        : "text-[#52606D] hover:text-[#22B1D4]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setView("create")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition shadow-[0_4px_12px_rgba(34,177,212,.3)]"
                style={{ background: "linear-gradient(135deg,#22B1D4,#189AB4)" }}
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                New Goal
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-pulse text-[#9AA5B1] text-sm font-mono">Loading goals…</div>
              </div>
            ) : items.length === 0 ? (
              <GlassCard className="p-12 text-center">
                <span className="material-symbols-outlined text-4xl text-[#9AA5B1] mb-3 block">flag</span>
                <p className="text-[#52606D] font-medium mb-1">No goals yet</p>
                <p className="text-sm text-[#9AA5B1] mb-5">Set your first goal and start tracking progress</p>
                <button
                  onClick={() => setView("create")}
                  className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition"
                  style={{ background: "linear-gradient(135deg,#22B1D4,#189AB4)" }}
                >
                  Create First Goal
                </button>
              </GlassCard>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {items.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onClick={() => openGoal(goal)}
                    onDelete={() => handleDelete(goal.id)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {view === "create" && (
          <GoalForm
            onSaved={handleSaved}
            onCancel={() => setView("list")}
          />
        )}

        {view === "detail" && selected && (
          <GoalDetail
            goal={selected}
            onUpdate={async (id, data) => {
              await goals.update(id, data);
              load();
              const full = await goals.get(id);
              setSelected(full);
            }}
            onDelete={() => handleDelete(selected.id)}
            onBack={() => { setView("list"); setSelected(null); }}
            onMilestoneAdded={async () => {
              const full = await goals.get(selected.id);
              setSelected(full);
              load();
            }}
            onMilestoneComplete={async (mid) => {
              await goals.completeMilestone(selected.id, mid);
              const full = await goals.get(selected.id);
              setSelected(full);
              load();
            }}
          />
        )}
      </div>
    </AppLayout>
  );
}
