// src/pages/Mood.jsx
import { useState, useEffect } from "react";
import { mood as moodApi } from "../services/api";
import AppLayout from "../components/AppLayout";
import GlassCard from "../components/GlassCard";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const MOODS = [
  { value: "great", emoji: "😄", label: "Great", score: 9, glow: "mood-glow-good", bg: "bg-[#75f9d3]/20", text: "text-[#006b56]" },
  { value: "good", emoji: "🙂", label: "Good", score: 7, glow: "mood-glow-good", bg: "bg-[#75f9d3]/10", text: "text-[#006b56]" },
  { value: "okay", emoji: "😐", label: "Okay", score: 5, glow: "mood-glow-okay", bg: "bg-[#e4dfff]/40", text: "text-[#5742d3]" },
  { value: "low", emoji: "😔", label: "Low", score: 3, glow: "mood-glow-low", bg: "bg-[#ffdcc2]/30", text: "text-[#8a4c05]" },
  { value: "bad", emoji: "😞", label: "Bad", score: 1, glow: "mood-glow-anxious", bg: "bg-[#ffdad6]/30", text: "text-[#ba1a1a]" },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="glass-card px-3 py-2 rounded-xl text-xs border border-white/30">
        <p className="text-[#787586]">{label}</p>
        <p className="font-mono font-bold text-[#5742d3]">Score: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function Mood() {
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(5);
  const [note, setNote] = useState("");
  const [graphDays, setGraphDays] = useState(30);
  const [graphData, setGraphData] = useState([]);
  const [entries, setEntries] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    moodApi.graph(graphDays).then((d) => setGraphData(d?.data || d || [])).catch(console.error);
    moodApi.list().then((d) => setEntries(Array.isArray(d) ? d : d?.results || [])).catch(console.error);
  }, [graphDays]);

  const handleMoodClick = (m) => {
    setSelected(m.value);
    setScore(m.score);
  };

  const submit = async () => {
    if (!selected) return;
    setSubmitting(true);
    setError("");
    try {
      const today = new Date().toISOString().split("T")[0];
      await moodApi.create({
        mood_label: selected,
        mood_score: score,
        note,
        logged_date: today,
      });
      setSubmitted(true);
      moodApi.graph(graphDays).then((d) => setGraphData(d?.data || d || []));
      moodApi.list().then((d) => setEntries(Array.isArray(d) ? d : d?.results || []));
    } catch (err) {
      setError(err?.detail || err?.logged_date?.[0] || "Could not save. You may have already logged today.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout title="Mood Tracker" subtitle="Track your emotional wellbeing daily">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Log Mood Card */}
        <GlassCard className="md:col-span-8 p-6">
          <h3 className="font-display text-xl font-bold text-[#111c2d] mb-1">How are you feeling?</h3>
          <p className="text-[#787586] text-sm mb-5">Select your mood and add a note if you'd like.</p>

          {submitted ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-16 h-16 rounded-full bg-[#75f9d3]/30 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-3xl text-[#006b56]">check_circle</span>
              </div>
              <h4 className="font-display text-lg font-bold text-[#111c2d]">Mood logged!</h4>
              <p className="text-[#787586] text-sm mt-1">Come back tomorrow to track your progress.</p>
              <button
                onClick={() => { setSubmitted(false); setSelected(null); setNote(""); setScore(5); }}
                className="mt-4 text-[#5742d3] text-sm hover:underline font-mono"
              >
                Log another
              </button>
            </div>
          ) : (
            <>
              {/* Emoji selector */}
              <div className="flex flex-wrap gap-3 mb-6">
                {MOODS.map((m) => (
                  <button
                    key={m.value}
                    onClick={() => handleMoodClick(m)}
                    className={`flex flex-col items-center gap-1.5 px-5 py-3.5 rounded-2xl transition-all duration-200 border ${m.glow} ${
                      selected === m.value
                        ? `${m.bg} border-current ${m.text} scale-105 shadow-md`
                        : "glass-card border-white/20 hover:scale-105"
                    }`}
                  >
                    <span className="text-3xl">{m.emoji}</span>
                    <span className="text-xs font-mono">{m.label}</span>
                  </button>
                ))}
              </div>

              {/* Score slider */}
              <div className="mb-5">
                <div className="flex justify-between mb-2">
                  <label className="text-xs font-mono tracking-widest uppercase text-[#787586]">
                    Intensity Score
                  </label>
                  <span className="text-xs font-mono font-bold text-[#5742d3]">{score} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={score}
                  onChange={(e) => setScore(Number(e.target.value))}
                  className="w-full h-2 bg-[#e7eeff] rounded-lg appearance-none cursor-pointer accent-[#5742d3]"
                />
              </div>

              {/* Note */}
              <div className="mb-5">
                <label className="text-xs font-mono tracking-widest uppercase text-[#787586] block mb-2">
                  Add a note (optional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="What's contributing to this feeling…"
                  rows={2}
                  className="w-full bg-transparent border-0 border-b-2 border-[#c8c4d7] focus:border-[#5742d3] px-1 py-2 text-sm text-[#111c2d] outline-none resize-none transition-colors placeholder:text-[#c8c4d7]"
                />
              </div>

              {error && (
                <div className="mb-4 bg-[#ffdad6] text-[#93000a] text-sm px-4 py-2.5 rounded-xl">{error}</div>
              )}

              <button
                onClick={submit}
                disabled={!selected || submitting}
                className="w-full py-3.5 rounded-xl bg-[#5742d3] text-white font-semibold text-sm shadow-lg shadow-[#5742d3]/20 hover:bg-[#4126bd] transition-colors disabled:opacity-40"
              >
                {submitting ? "Saving…" : "Log My Mood"}
              </button>
            </>
          )}
        </GlassCard>

        {/* Today's insight */}
        <GlassCard className="md:col-span-4 p-6 flex flex-col justify-center items-center text-center relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <div className="w-48 h-48 rounded-full border-4 border-[#5742d3]" />
          </div>
          <div className="relative z-10">
            <div className="w-20 h-20 rounded-full bg-[#5742d3]/10 flex items-center justify-center mx-auto mb-4 animate-breathe">
              <span className="material-symbols-outlined text-4xl text-[#5742d3]">self_improvement</span>
            </div>
            <h4 className="font-display text-lg font-bold text-[#111c2d] mb-2">Wellness Tip</h4>
            <p className="text-[#787586] text-sm leading-relaxed">
              Consistent mood tracking helps identify patterns. Even 1 minute a day can reveal powerful insights about your wellbeing.
            </p>
          </div>
        </GlassCard>

        {/* Mood Graph */}
        <GlassCard className="md:col-span-12 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5 gap-3">
            <div>
              <h4 className="font-display text-lg font-bold text-[#111c2d]">Mood Over Time</h4>
              <p className="text-[#787586] text-xs mt-0.5">Tracking your emotional landscape</p>
            </div>
            <div className="flex gap-2">
              {[7, 14, 30].map((d) => (
                <button
                  key={d}
                  onClick={() => setGraphDays(d)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                    graphDays === d
                      ? "bg-[#5742d3] text-white"
                      : "glass-card text-[#787586] hover:text-[#5742d3] border border-white/20"
                  }`}
                >
                  {d}D
                </button>
              ))}
            </div>
          </div>
          {graphData.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-[#787586] text-sm">
              No mood data yet. Start logging to see your chart.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={graphData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="moodAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5742d3" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#5742d3" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7eeff" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#787586", fontFamily: "JetBrains Mono" }} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 10]} hide />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="score" stroke="#5742d3" strokeWidth={2} fill="url(#moodAreaGrad)" dot={{ fill: "#5742d3", r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </GlassCard>

        {/* Recent Entries */}
        <GlassCard className="md:col-span-12 p-6">
          <h4 className="font-display text-lg font-bold text-[#111c2d] mb-4">Recent Entries</h4>
          {entries.length === 0 ? (
            <p className="text-[#787586] text-sm text-center py-4">No entries yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {entries.slice(0, 9).map((e) => {
                const mood = MOODS.find((m) => m.value === e.mood_label) || MOODS[2];
                return (
                  <div key={e.id} className={`p-4 rounded-xl border border-white/20 ${mood.bg}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{mood.emoji}</span>
                      <span className="text-[10px] font-mono text-[#787586]">{e.logged_date}</span>
                    </div>
                    <p className={`text-sm font-semibold capitalize ${mood.text}`}>{e.mood_label}</p>
                    <p className="text-xs font-mono text-[#787586]">Score: {e.mood_score}</p>
                    {e.note && <p className="text-xs text-[#474554] mt-1.5 line-clamp-2">{e.note}</p>}
                  </div>
                );
              })}
            </div>
          )}
        </GlassCard>
      </div>
    </AppLayout>
  );
}
