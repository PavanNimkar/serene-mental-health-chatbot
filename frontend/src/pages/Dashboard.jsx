import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../hooks/useAuth";
import { dashboard, mood, tests } from "../services/api";

const MOOD_LABELS = { 1: "😞", 2: "😕", 3: "😐", 4: "🙂", 5: "😄" };

export default function Dashboard() {
  const { user } = useAuth();
  const displayName = user?.display_name || user?.username || "there";
  const joinedDate = user?.date_joined
    ? new Date(user.date_joined).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : null;

  // ── State ──────────────────────────────────────────────────────────────────
  const [dashData, setDashData] = useState(null);
  const [moodData, setMoodData] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [moodRange, setMoodRange] = useState(7);
  const [loadingDash, setLoadingDash] = useState(true);
  const [loadingMood, setLoadingMood] = useState(true);
  const [loadingTests, setLoadingTests] = useState(true);

  // ── Fetch dashboard summary ────────────────────────────────────────────────
  useEffect(() => {
    dashboard
      .get()
      .then(setDashData)
      .catch(console.error)
      .finally(() => setLoadingDash(false));
  }, []);

  // ── Fetch mood graph ───────────────────────────────────────────────────────
  useEffect(() => {
    setLoadingMood(true);
    mood
      .graph(moodRange)
      .then((data) => {
        // API returns array of { date, mood_score } or { day, mood }
        const normalized = (data.entries || data || []).map((e) => ({
          day: e.date
            ? new Date(e.date).toLocaleDateString("en-US", { weekday: "short" })
            : e.day,
          mood: e.mood_score ?? e.mood,
        }));
        setMoodData(normalized);
      })
      .catch(console.error)
      .finally(() => setLoadingMood(false));
  }, [moodRange]);

  // ── Fetch latest test results ──────────────────────────────────────────────
  useEffect(() => {
    tests
      .latest()
      .then((data) =>
        setTestResults(Array.isArray(data) ? data : data.results || []),
      )
      .catch(console.error)
      .finally(() => setLoadingTests(false));
  }, []);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const weekSummary = dashData?.weekly_summary || {};
  const sessions = weekSummary.sessions ?? dashData?.session_count ?? 0;
  const journalCount =
    weekSummary.journal_entries ?? dashData?.journal_count ?? 0;
  const exercises = weekSummary.exercises ?? dashData?.exercise_count ?? 0;
  const streak = dashData?.streak ?? user?.streak ?? 0;
  const goals = dashData?.goals || [];
  const recentJournal = dashData?.recent_journal || [];

  const getSeverityLabel = (score, type) => {
    if (type === "PHQ-9") {
      if (score <= 4)
        return { label: "Minimal", color: "#10B981", bg: "#D1FAE5", pct: 10 };
      if (score <= 9)
        return { label: "Mild", color: "#F59E0B", bg: "#FEF3C7", pct: 30 };
      if (score <= 14)
        return { label: "Moderate", color: "#F97316", bg: "#FFEDD5", pct: 55 };
      if (score <= 19)
        return {
          label: "Mod-Severe",
          color: "#EF4444",
          bg: "#FEE2E2",
          pct: 75,
        };
      return { label: "Severe", color: "#DC2626", bg: "#FEE2E2", pct: 95 };
    }
    if (type === "GAD-7") {
      if (score <= 4)
        return { label: "Minimal", color: "#10B981", bg: "#D1FAE5", pct: 10 };
      if (score <= 9)
        return { label: "Mild", color: "#F59E0B", bg: "#FEF3C7", pct: 35 };
      if (score <= 14)
        return { label: "Moderate", color: "#EF4444", bg: "#FEE2E2", pct: 60 };
      return { label: "Severe", color: "#DC2626", bg: "#FEE2E2", pct: 90 };
    }
    return { label: "N/A", color: "#9AA5B1", bg: "#EEF2F6", pct: 0 };
  };

  const fmtDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    const now = new Date();
    const diff = Math.floor((now - d) / 86400000);
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#1F2933]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ── Left Column ──────────────────────────────────────────────────── */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#D9E2EC] text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[#E8F8FC] to-transparent" />
            <div className="relative z-10">
              <div className="w-24 h-24 mx-auto bg-white rounded-full p-1 shadow-md mb-4 flex items-center justify-center overflow-hidden">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={displayName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-[#E8F8FC] to-[#22B1D4] flex items-center justify-center">
                    <span className="material-icons-round text-white text-4xl">
                      person
                    </span>
                  </div>
                )}
              </div>
              <h2 className="text-xl font-bold text-[#1F2933]">
                {displayName}
              </h2>
              {joinedDate && (
                <p className="text-sm text-[#9AA5B1] font-medium mb-4">
                  Joined {joinedDate}
                </p>
              )}
              {streak > 0 && (
                <div className="flex items-center justify-center gap-2 text-sm text-[#52606D] bg-[#F8FAFC] py-2 px-4 rounded-full border border-[#D9E2EC]">
                  <span className="material-icons-round text-[#F59E0B] text-base">
                    emoji_events
                  </span>
                  <span className="font-semibold">{streak} Day Streak</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#D9E2EC]">
            <h3 className="text-sm font-bold text-[#9AA5B1] uppercase tracking-wider mb-4">
              Weekly Summary
            </h3>
            {loadingDash ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-10 bg-[#F8FAFC] rounded-xl animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {[
                  {
                    icon: "chat_bubble_outline",
                    bg: "#E8F8FC",
                    color: "#22B1D4",
                    label: "Sessions",
                    value: sessions,
                  },
                  {
                    icon: "edit_note",
                    bg: "#EEF2F6",
                    color: "#52606D",
                    label: "Journal Entries",
                    value: journalCount,
                  },
                  {
                    icon: "self_improvement",
                    bg: "#E8F8FC",
                    color: "#22B1D4",
                    label: "Exercises",
                    value: exercises,
                  },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: stat.bg }}
                      >
                        <span
                          className="material-icons-round"
                          style={{ color: stat.color }}
                        >
                          {stat.icon}
                        </span>
                      </div>
                      <span className="font-medium text-[#1F2933]">
                        {stat.label}
                      </span>
                    </div>
                    <span className="font-bold text-lg text-[#1F2933]">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Middle Column ─────────────────────────────────────────────────── */}
        <div className="lg:col-span-6 space-y-6">
          {/* Welcome Banner */}
          <div
            className="bg-[#22B1D4] rounded-3xl p-8 text-white shadow-md relative overflow-hidden"
            style={{ boxShadow: "0 8px 30px rgba(34,177,212,0.35)" }}
          >
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-black/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <h2 className="text-3xl font-serif font-bold mb-2">
                {greeting()}, {displayName}.
              </h2>
              <p className="text-[#E8F8FC]/90 text-lg mb-6 max-w-md">
                "Every day is a new beginning. Take a deep breath and start
                again."
              </p>
              <Link
                to="/chat"
                className="bg-white text-[#22B1D4] px-6 py-3 rounded-full font-bold hover:bg-[#E8F8FC] transition-colors shadow-sm flex items-center gap-2 w-fit"
              >
                <span className="material-icons-round text-sm">add</span>
                Log Today's Mood
              </Link>
            </div>
          </div>

          {/* Mood Chart */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#D9E2EC]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[#1F2933]">Mood Trend</h3>
              <select
                className="bg-[#F8FAFC] border border-[#D9E2EC] text-sm font-medium text-[#52606D] rounded-lg px-3 py-1.5"
                value={moodRange}
                onChange={(e) => setMoodRange(Number(e.target.value))}
              >
                <option value={7}>This Week</option>
                <option value={14}>Last 2 Weeks</option>
                <option value={30}>This Month</option>
              </select>
            </div>
            <div className="h-64 w-full">
              {loadingMood ? (
                <div className="h-full flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-[#22B1D4] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : moodData.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center gap-2 text-[#9AA5B1]">
                  <span className="material-icons-round text-3xl">mood</span>
                  <p className="text-sm font-medium">
                    No mood entries yet. Start logging!
                  </p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={moodData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#EEF2F6"
                    />
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#9AA5B1", fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#9AA5B1", fontSize: 12 }}
                      dx={-10}
                      domain={[1, 5]}
                      ticks={[1, 2, 3, 4, 5]}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #D9E2EC",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.08)",
                      }}
                      formatter={(val) => [
                        `${MOOD_LABELS[val] || ""} ${val}/5`,
                        "Mood",
                      ]}
                      cursor={{ stroke: "#E8F8FC", strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="mood"
                      stroke="#22B1D4"
                      strokeWidth={4}
                      dot={{
                        r: 6,
                        fill: "#22B1D4",
                        stroke: "#fff",
                        strokeWidth: 2,
                      }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Recent Journal */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#D9E2EC]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[#1F2933]">
                Recent Journal
              </h3>
              <button className="text-[#22B1D4] hover:text-[#189AB4] text-sm font-bold transition-colors">
                View All
              </button>
            </div>

            {loadingDash ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-20 bg-[#F8FAFC] rounded-2xl animate-pulse"
                  />
                ))}
              </div>
            ) : recentJournal.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 gap-2 text-[#9AA5B1]">
                <span className="material-icons-round text-3xl">edit_note</span>
                <p className="text-sm font-medium">No journal entries yet.</p>
                <Link
                  to="/chat"
                  className="text-[#22B1D4] text-sm font-bold hover:underline"
                >
                  Start journaling →
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentJournal.map((entry, i) => {
                  const moodScore = entry.mood_score || entry.mood;
                  const moodEmoji = MOOD_LABELS[moodScore];
                  const isPositive = moodScore >= 4;
                  return (
                    <div
                      key={entry.id || i}
                      className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#D9E2EC] hover:border-[#22B1D4]/40 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-[#9AA5B1] uppercase tracking-wider">
                          {fmtDate(entry.created_at || entry.date)}
                        </span>
                        {moodEmoji && (
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                            style={{
                              backgroundColor: isPositive
                                ? "#D1FAE5"
                                : "#FEF3C7",
                            }}
                          >
                            {moodEmoji}
                          </div>
                        )}
                      </div>
                      <h4 className="font-bold text-[#1F2933] mb-1 group-hover:text-[#22B1D4] transition-colors">
                        {entry.title || "Journal Entry"}
                      </h4>
                      <p className="text-sm text-[#9AA5B1] line-clamp-2">
                        {entry.content || entry.preview || ""}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── Right Column ──────────────────────────────────────────────────── */}
        <div className="lg:col-span-3 space-y-6">
          {/* Assessments */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#D9E2EC]">
            <h3 className="text-lg font-bold text-[#1F2933] mb-4">
              Assessments
            </h3>

            {loadingTests ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-24 bg-[#F8FAFC] rounded-2xl animate-pulse"
                  />
                ))}
              </div>
            ) : testResults.length === 0 ? (
              <p className="text-sm text-[#9AA5B1] mb-4">
                No assessments taken yet.
              </p>
            ) : (
              <div className="space-y-4">
                {testResults.map((result, i) => {
                  const type = result.test_type || result.type || "PHQ-9";
                  const score = result.score ?? 0;
                  const maxScore =
                    type === "PHQ-9" ? 27 : type === "GAD-7" ? 21 : 27;
                  const pct = Math.round((score / maxScore) * 100);
                  const { label, color, bg } = getSeverityLabel(score, type);
                  return (
                    <div
                      key={result.id || i}
                      className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#D9E2EC]"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-[#1F2933]">{type}</h4>
                        <span
                          className="text-xs font-bold px-2 py-1 rounded-md"
                          style={{ color, backgroundColor: bg }}
                        >
                          {label}
                        </span>
                      </div>
                      <p className="text-xs text-[#9AA5B1] mb-3">
                        {type === "PHQ-9"
                          ? "Depression Severity"
                          : type === "GAD-7"
                            ? "Anxiety Severity"
                            : "Assessment"}
                      </p>
                      <div className="w-full bg-[#EEF2F6] rounded-full h-2 mb-2">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{ width: `${pct}%`, backgroundColor: color }}
                        />
                      </div>
                      <p className="text-[10px] text-[#9AA5B1] text-right">
                        {result.created_at
                          ? `Last taken: ${new Date(result.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                          : ""}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            <Link
              to="/onboarding/4"
              className="w-full py-2.5 border-2 border-dashed border-[#D9E2EC] rounded-xl text-sm font-bold text-[#22B1D4] hover:bg-[#E8F8FC] hover:border-[#22B1D4] transition-colors flex items-center justify-center gap-2 mt-2"
            >
              <span className="material-icons-round text-sm">add</span>
              Take New Assessment
            </Link>
          </div>

          {/* Current Goals */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#D9E2EC]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#1F2933]">
                Current Goals
              </h3>
              <button className="text-[#9AA5B1] hover:text-[#22B1D4] transition-colors">
                <span className="material-icons-round text-sm">edit</span>
              </button>
            </div>

            {loadingDash ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-6 bg-[#F8FAFC] rounded animate-pulse"
                  />
                ))}
              </div>
            ) : goals.length === 0 ? (
              <p className="text-sm text-[#9AA5B1]">
                No goals set yet. Start your onboarding to add goals.
              </p>
            ) : (
              <ul className="space-y-3">
                {goals.map((goal, i) => (
                  <li key={goal.id || i} className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-colors ${
                        goal.completed || goal.done
                          ? "bg-[#22B1D4] border-[#22B1D4]"
                          : "border-[#D9E2EC] hover:border-[#22B1D4]"
                      }`}
                    >
                      <span
                        className={`material-icons-round text-[12px] ${goal.completed || goal.done ? "text-white" : "text-transparent"}`}
                      >
                        check
                      </span>
                    </div>
                    <span
                      className={`text-sm font-medium ${goal.completed || goal.done ? "text-[#9AA5B1] line-through" : "text-[#52606D]"}`}
                    >
                      {goal.label || goal.title || goal.text}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Quick Action */}
          <Link
            to="/chat"
            className="block bg-[#22B1D4] rounded-3xl p-6 text-white text-center hover:bg-[#189AB4] transition-colors"
            style={{ boxShadow: "0 4px 20px rgba(34,177,212,0.3)" }}
          >
            <span className="material-icons-round text-4xl mb-2 block">
              chat
            </span>
            <p className="font-bold text-lg">Chat with Serene</p>
            <p className="text-[#E8F8FC]/80 text-sm">I'm here to listen</p>
          </Link>
        </div>
      </main>

      <div className="mt-8">
        <Footer />
      </div>
    </div>
  );
}
