// src/pages/Journal.jsx
import { useState, useEffect, useCallback } from "react";
import AppLayout from "../components/AppLayout";
import GlassCard from "../components/GlassCard";
import JournalEntryCard from "../components/journal/JournalEntryCard";
import JournalEditor from "../components/journal/JournalEditor";
import JournalStats from "../components/journal/JournalStats";
import { journal } from "../services/api";

const CATEGORY_COLORS = {
  gratitude: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100", icon: "favorite" },
  reflection: { bg: "bg-violet-50", text: "text-violet-600", border: "border-violet-100", icon: "self_improvement" },
  anxiety: { bg: "bg-blue-50", text: "text-[#22B1D4]", border: "border-blue-100", icon: "air" },
  goals: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100", icon: "flag" },
  self_care: { bg: "bg-rose-50", text: "text-rose-500", border: "border-rose-100", icon: "spa" },
  relationships: { bg: "bg-pink-50", text: "text-pink-500", border: "border-pink-100", icon: "group" },
  general: { bg: "bg-[#E8F8FC]", text: "text-[#22B1D4]", border: "border-[#D4EEF7]", icon: "edit_note" },
};

export default function Journal() {
  const [entries, setEntries] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list"); // list | write | detail
  const [selected, setSelected] = useState(null);
  const [searchQ, setSearchQ] = useState("");
  const [filterTag, setFilterTag] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchQ) params.q = searchQ;
      if (filterTag) params.tag = filterTag;
      const [data, s] = await Promise.all([journal.list(params), journal.stats()]);
      setEntries(Array.isArray(data) ? data : data.results || []);
      setStats(s);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [searchQ, filterTag]);

  useEffect(() => { load(); }, [load]);

  const handleSaved = () => {
    setView("list");
    setSelected(null);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this entry?")) return;
    await journal.delete(id);
    if (view === "detail") setView("list");
    load();
  };

  const openEntry = (entry) => {
    setSelected(entry);
    setView("detail");
  };

  const allTags = [...new Set(entries.flatMap((e) => e.tags || []))];

  return (
    <AppLayout title="My Journal" subtitle="Reflect, process, and grow through writing">
      <div className="space-y-5">
        {/* Stats bar */}
        <JournalStats stats={stats} />

        {view === "list" && (
          <>
            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="flex gap-2 flex-1 w-full sm:w-auto">
                <div className="relative flex-1">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA5B1] text-[18px]">search</span>
                  <input
                    value={searchQ}
                    onChange={(e) => setSearchQ(e.target.value)}
                    placeholder="Search entries…"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#E4EEF3] bg-white text-sm text-[#1F2933] placeholder-[#9AA5B1] focus:outline-none focus:border-[#22B1D4] focus:ring-2 focus:ring-[#22B1D4]/10 transition"
                  />
                </div>
                {allTags.length > 0 && (
                  <select
                    value={filterTag}
                    onChange={(e) => setFilterTag(e.target.value)}
                    className="px-3 py-2.5 rounded-xl border border-[#E4EEF3] bg-white text-sm text-[#52606D] focus:outline-none focus:border-[#22B1D4] transition"
                  >
                    <option value="">All tags</option>
                    {allTags.map((t) => <option key={t} value={t}>#{t}</option>)}
                  </select>
                )}
              </div>
              <button
                onClick={() => { setSelected(null); setView("write"); }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition shadow-[0_4px_12px_rgba(34,177,212,.3)] shrink-0"
                style={{ background: "linear-gradient(135deg,#22B1D4,#189AB4)" }}
              >
                <span className="material-symbols-outlined text-[18px]">edit</span>
                New Entry
              </button>
            </div>

            {/* Entry list */}
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-pulse text-[#9AA5B1] text-sm font-mono">Loading entries…</div>
              </div>
            ) : entries.length === 0 ? (
              <GlassCard className="p-12 text-center">
                <span className="material-symbols-outlined text-4xl text-[#9AA5B1] mb-3 block">menu_book</span>
                <p className="text-[#52606D] font-medium mb-1">No journal entries yet</p>
                <p className="text-sm text-[#9AA5B1] mb-5">Start writing to reflect on your journey</p>
                <button
                  onClick={() => setView("write")}
                  className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition"
                  style={{ background: "linear-gradient(135deg,#22B1D4,#189AB4)" }}
                >
                  Write First Entry
                </button>
              </GlassCard>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {entries.map((entry) => (
                  <JournalEntryCard
                    key={entry.id}
                    entry={entry}
                    categoryColors={CATEGORY_COLORS}
                    onClick={() => openEntry(entry)}
                    onDelete={() => handleDelete(entry.id)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {(view === "write" || view === "detail") && (
          <JournalEditor
            entry={view === "detail" ? selected : null}
            categoryColors={CATEGORY_COLORS}
            onSaved={handleSaved}
            onCancel={() => { setView("list"); setSelected(null); }}
            onDelete={view === "detail" ? () => handleDelete(selected.id) : null}
          />
        )}
      </div>
    </AppLayout>
  );
}
