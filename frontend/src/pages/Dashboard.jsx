// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { dashboard, mood } from "../services/api";
import AppLayout from "../components/AppLayout";
import GlassCard from "../components/GlassCard";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function StatCard({
  icon,
  iconBg,
  iconColor,
  label,
  value,
  badge,
  badgeColor,
}) {
  return (
    <GlassCard className="p-5 hover:scale-[1.02] transition-transform duration-200">
      <div className="flex items-center justify-between mb-3">
        <span className={`p-2 rounded-xl ${iconBg}`}>
          <span
            className={`material-symbols-outlined text-[20px] ${iconColor}`}
          >
            {icon}
          </span>
        </span>
        {badge && (
          <span
            className={`text-xs font-mono ${badgeColor || "text-[#9AA5B1]"}`}
          >
            {badge}
          </span>
        )}
      </div>
      <p className="text-xs text-[#9AA5B1] mb-0.5">{label}</p>
      <h3
        className="text-2xl font-bold text-[#1F2933]"
        style={{ fontFamily: "serif" }}
      >
        {value}
      </h3>
    </GlassCard>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#E4EEF3] shadow-lg px-3 py-2 rounded-xl text-xs">
        <p className="text-[#9AA5B1]">{label}</p>
        <p className="font-mono font-bold text-[#22B1D4]">
          Score: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [moodGraph, setMoodGraph] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([dashboard.get(), mood.graph(7)])
      .then(([d, g]) => {
        setData(d);
        setMoodGraph(g?.data || g || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const name = user?.first_name || user?.username || "there";
  const stats = data?.stats || {};
  const conversations = data?.recent_conversations || [];
  const latestTests = data?.latest_tests || {};

  return (
    <AppLayout
      title={`${getGreeting()}, ${name} ✨`}
      subtitle="Your serenity score is looking strong today. Take a deep breath."
    >
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <img src="/logo.png" alt="Serene" className="w-10 animate-pulse" />
            <p className="text-xs text-[#9AA5B1] font-mono">
              Loading your sanctuary…
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon="bolt"
              iconBg="bg-[#E8F8FC]"
              iconColor="text-[#22B1D4]"
              label="Streak"
              value={`${stats.streak || 0} Days`}
              badge="+1 today"
              badgeColor="text-[#10B981]"
            />
            <StatCard
              icon="forum"
              iconBg="bg-[#E8F8FC]"
              iconColor="text-[#22B1D4]"
              label="Sessions"
              value={stats.total_conversations || 0}
              badge="Last: today"
            />
            <StatCard
              icon="sentiment_satisfied"
              iconBg="bg-[#E8F8FC]"
              iconColor="text-[#189AB4]"
              label="Avg Mood"
              value={stats.avg_mood || "—"}
              badge="7-day avg"
            />
            <StatCard
              icon="history_edu"
              iconBg="bg-[#F8FAFC]"
              iconColor="text-[#9AA5B1]"
              label="Mood Entries"
              value={stats.total_mood_entries || 0}
            />
          </div>

          {/* Middle: Conversations + Mood Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Recent Conversations */}
            <GlassCard className="lg:col-span-5 p-6">
              <div className="flex justify-between items-center mb-5">
                <h4
                  className="text-lg font-bold text-[#1F2933]"
                  style={{ fontFamily: "serif" }}
                >
                  Recent Sessions
                </h4>
                <Link
                  to="/chat"
                  className="text-[#22B1D4] text-xs font-mono hover:underline"
                >
                  New Chat →
                </Link>
              </div>
              {conversations.length === 0 ? (
                <div className="text-center py-8 text-[#9AA5B1] text-sm">
                  <span className="material-symbols-outlined text-3xl mb-2 block">
                    chat_bubble_outline
                  </span>
                  No conversations yet. Start chatting!
                </div>
              ) : (
                <div className="space-y-2">
                  {conversations.slice(0, 4).map((c) => (
                    <Link
                      key={c.id}
                      to="/chat"
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#E8F8FC] transition-colors border border-transparent hover:border-[#D4EEF7] group"
                    >
                      <div className="w-9 h-9 rounded-full bg-[#E8F8FC] flex items-center justify-center text-[#22B1D4] shrink-0 border border-[#D4EEF7]">
                        <span
                          className="material-symbols-outlined text-[18px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          smart_toy
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <span className="text-sm font-semibold text-[#1F2933] truncate">
                            {c.title || `Session ${c.id}`}
                          </span>
                          <span className="text-[10px] text-[#9AA5B1] font-mono shrink-0 ml-2">
                            {new Date(
                              c.updated_at || c.created_at,
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-[#9AA5B1] truncate mt-0.5">
                          {c.last_message || "Continue where you left off…"}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              <Link
                to="/chat"
                className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-colors shadow-[0_4px_12px_rgba(34,177,212,.3)]"
                style={{
                  background: "linear-gradient(135deg,#22B1D4,#189AB4)",
                }}
              >
                <span className="material-symbols-outlined text-[18px]">
                  add
                </span>
                New Conversation
              </Link>
            </GlassCard>

            {/* Mood Chart */}
            <GlassCard className="lg:col-span-7 p-6 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4
                    className="text-lg font-bold text-[#1F2933]"
                    style={{ fontFamily: "serif" }}
                  >
                    Mood This Week
                  </h4>
                  <p className="text-xs text-[#9AA5B1] mt-0.5">
                    Your emotional landscape over 7 days
                  </p>
                </div>
                <Link
                  to="/mood"
                  className="text-[#22B1D4] text-xs font-mono hover:underline"
                >
                  Log Today →
                </Link>
              </div>
              {moodGraph.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-center text-[#9AA5B1] text-sm py-8">
                  <div>
                    <span className="material-symbols-outlined text-3xl mb-2 block">
                      show_chart
                    </span>
                    Start logging moods to see your chart
                  </div>
                </div>
              ) : (
                <div className="flex-1 min-h-[160px]">
                  <ResponsiveContainer width="100%" height={180}>
                    <AreaChart
                      data={moodGraph}
                      margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="moodGrad"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#22B1D4"
                            stopOpacity={0.2}
                          />
                          <stop
                            offset="95%"
                            stopColor="#22B1D4"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="date"
                        tick={{
                          fontSize: 10,
                          fill: "#9AA5B1",
                          fontFamily: "JetBrains Mono",
                        }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis domain={[0, 10]} hide />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="score"
                        stroke="#22B1D4"
                        strokeWidth={2}
                        fill="url(#moodGrad)"
                        dot={{ fill: "#22B1D4", strokeWidth: 0, r: 4 }}
                        activeDot={{ r: 6, fill: "#22B1D4" }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </GlassCard>
          </div>

          {/* Bottom: Tests + Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* PHQ-9 */}
            <GlassCard className="p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h5 className="font-semibold text-[#1F2933] text-sm">
                    PHQ-9 Depression
                  </h5>
                  <p className="text-xs text-[#9AA5B1]">Latest result</p>
                </div>
                <span className="p-1.5 rounded-lg bg-[#E8F8FC] border border-[#D4EEF7]">
                  <span className="material-symbols-outlined text-[#22B1D4] text-[18px]">
                    psychology
                  </span>
                </span>
              </div>
              {latestTests["PHQ-9"] ? (
                <div>
                  <p
                    className="text-2xl font-bold text-[#1F2933]"
                    style={{ fontFamily: "serif" }}
                  >
                    {latestTests["PHQ-9"].total_score}
                  </p>
                  <p className="text-xs text-[#9AA5B1] mt-1">
                    {latestTests["PHQ-9"].interpretation}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-[#9AA5B1]">Not taken yet</p>
              )}
              <Link
                to="/tests"
                className="mt-3 flex items-center gap-1 text-xs text-[#22B1D4] hover:underline font-mono"
              >
                Take assessment →
              </Link>
            </GlassCard>

            {/* GAD-7 */}
            <GlassCard className="p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h5 className="font-semibold text-[#1F2933] text-sm">
                    GAD-7 Anxiety
                  </h5>
                  <p className="text-xs text-[#9AA5B1]">Latest result</p>
                </div>
                <span className="p-1.5 rounded-lg bg-[#E8F8FC] border border-[#D4EEF7]">
                  <span className="material-symbols-outlined text-[#189AB4] text-[18px]">
                    monitor_heart
                  </span>
                </span>
              </div>
              {latestTests["GAD-7"] ? (
                <div>
                  <p
                    className="text-2xl font-bold text-[#1F2933]"
                    style={{ fontFamily: "serif" }}
                  >
                    {latestTests["GAD-7"].total_score}
                  </p>
                  <p className="text-xs text-[#9AA5B1] mt-1">
                    {latestTests["GAD-7"].interpretation}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-[#9AA5B1]">Not taken yet</p>
              )}
              <Link
                to="/tests"
                className="mt-3 flex items-center gap-1 text-xs text-[#22B1D4] hover:underline font-mono"
              >
                Take assessment →
              </Link>
            </GlassCard>

            {/* Quick Actions */}
            <GlassCard className="p-5">
              <h5 className="font-semibold text-[#1F2933] text-sm mb-3">
                Quick Actions
              </h5>
              <div className="space-y-2">
                <Link
                  to="/mood"
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#E8F8FC] transition-colors text-sm text-[#52606D] group"
                >
                  <span className="p-1.5 rounded-lg bg-[#E8F8FC] text-[#22B1D4] border border-[#D4EEF7]">
                    <span className="material-symbols-outlined text-[16px]">
                      wb_sunny
                    </span>
                  </span>
                  Log today's mood
                </Link>
                <Link
                  to="/chat"
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#E8F8FC] transition-colors text-sm text-[#52606D]"
                >
                  <span className="p-1.5 rounded-lg bg-[#E8F8FC] text-[#22B1D4] border border-[#D4EEF7]">
                    <span className="material-symbols-outlined text-[16px]">
                      forum
                    </span>
                  </span>
                  Start a session
                </Link>
                <Link
                  to="/find-help/helplines"
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-red-50 transition-colors text-sm text-[#52606D]"
                >
                  <span className="p-1.5 rounded-lg bg-red-50 text-red-500 border border-red-100">
                    <span className="material-symbols-outlined text-[16px]">
                      emergency
                    </span>
                  </span>
                  Crisis helplines
                </Link>
              </div>
            </GlassCard>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
