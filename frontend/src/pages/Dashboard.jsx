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

function StatCard({ icon, iconBg, iconColor, label, value, badge, badgeColor }) {
  return (
    <GlassCard className="p-5 hover:scale-[1.02] transition-transform duration-200">
      <div className="flex items-center justify-between mb-3">
        <span className={`p-2 rounded-xl ${iconBg}`}>
          <span className={`material-symbols-outlined text-[20px] ${iconColor}`}>{icon}</span>
        </span>
        {badge && (
          <span className={`text-xs font-mono ${badgeColor || "text-[#787586]"}`}>{badge}</span>
        )}
      </div>
      <p className="text-xs text-[#787586] mb-0.5">{label}</p>
      <h3 className="text-2xl font-bold text-[#111c2d] font-display">{value}</h3>
    </GlassCard>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card px-3 py-2 rounded-xl text-xs">
        <p className="text-[#787586]">{label}</p>
        <p className="font-mono font-bold text-[#5742d3]">Score: {payload[0].value}</p>
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
            <p className="text-xs text-[#787586] font-mono">Loading your sanctuary…</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon="bolt"
              iconBg="bg-[#5742d3]/10"
              iconColor="text-[#5742d3]"
              label="Streak"
              value={`${stats.streak || 0} Days`}
              badge="+1 today"
              badgeColor="text-[#006b56]"
            />
            <StatCard
              icon="forum"
              iconBg="bg-[#006b56]/10"
              iconColor="text-[#006b56]"
              label="Sessions"
              value={stats.total_conversations || 0}
              badge="Last: today"
            />
            <StatCard
              icon="sentiment_satisfied"
              iconBg="bg-[#8a4c05]/10"
              iconColor="text-[#8a4c05]"
              label="Avg Mood"
              value={stats.avg_mood || "—"}
              badge="7-day avg"
            />
            <StatCard
              icon="history_edu"
              iconBg="bg-[#787586]/10"
              iconColor="text-[#787586]"
              label="Mood Entries"
              value={stats.total_mood_entries || 0}
            />
          </div>

          {/* Middle: Conversations + Mood Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Recent Conversations */}
            <GlassCard className="lg:col-span-5 p-6">
              <div className="flex justify-between items-center mb-5">
                <h4 className="font-display text-lg font-bold text-[#111c2d]">Recent Sessions</h4>
                <Link to="/chat" className="text-[#5742d3] text-xs font-mono hover:underline">
                  New Chat →
                </Link>
              </div>
              {conversations.length === 0 ? (
                <div className="text-center py-8 text-[#787586] text-sm">
                  <span className="material-symbols-outlined text-3xl mb-2 block">chat_bubble_outline</span>
                  No conversations yet. Start chatting!
                </div>
              ) : (
                <div className="space-y-2">
                  {conversations.slice(0, 4).map((c) => (
                    <Link
                      key={c.id}
                      to="/chat"
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/50 transition-colors border border-transparent hover:border-white/40 group"
                    >
                      <div className="w-9 h-9 rounded-full bg-[#5742d3]/10 flex items-center justify-center text-[#5742d3] shrink-0">
                        <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          smart_toy
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <span className="text-sm font-semibold text-[#111c2d] truncate">
                            {c.title || `Session ${c.id}`}
                          </span>
                          <span className="text-[10px] text-[#787586] font-mono shrink-0 ml-2">
                            {new Date(c.updated_at || c.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-[#787586] truncate mt-0.5">
                          {c.last_message || "Continue where you left off…"}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              <Link
                to="/chat"
                className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#5742d3] text-white text-sm font-semibold hover:bg-[#4126bd] transition-colors shadow-lg shadow-[#5742d3]/20"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                New Conversation
              </Link>
            </GlassCard>

            {/* Mood Chart */}
            <GlassCard className="lg:col-span-7 p-6 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-display text-lg font-bold text-[#111c2d]">Mood This Week</h4>
                  <p className="text-xs text-[#787586] mt-0.5">Your emotional landscape over 7 days</p>
                </div>
                <Link to="/mood" className="text-[#5742d3] text-xs font-mono hover:underline">
                  Log Today →
                </Link>
              </div>
              {moodGraph.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-center text-[#787586] text-sm py-8">
                  <div>
                    <span className="material-symbols-outlined text-3xl mb-2 block">show_chart</span>
                    Start logging moods to see your chart
                  </div>
                </div>
              ) : (
                <div className="flex-1 min-h-[160px]">
                  <ResponsiveContainer width="100%" height={180}>
                    <AreaChart data={moodGraph} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#5742d3" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#5742d3" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 10, fill: "#787586", fontFamily: "JetBrains Mono" }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis domain={[0, 10]} hide />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="score"
                        stroke="#5742d3"
                        strokeWidth={2}
                        fill="url(#moodGrad)"
                        dot={{ fill: "#5742d3", strokeWidth: 0, r: 4 }}
                        activeDot={{ r: 6, fill: "#5742d3" }}
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
                  <h5 className="font-semibold text-[#111c2d] text-sm">PHQ-9 Depression</h5>
                  <p className="text-xs text-[#787586]">Latest result</p>
                </div>
                <span className="p-1.5 rounded-lg bg-[#5742d3]/10">
                  <span className="material-symbols-outlined text-[#5742d3] text-[18px]">psychology</span>
                </span>
              </div>
              {latestTests["PHQ-9"] ? (
                <div>
                  <p className="text-2xl font-bold font-display text-[#111c2d]">
                    {latestTests["PHQ-9"].total_score}
                  </p>
                  <p className="text-xs text-[#787586] mt-1">{latestTests["PHQ-9"].interpretation}</p>
                </div>
              ) : (
                <p className="text-sm text-[#787586]">Not taken yet</p>
              )}
              <Link
                to="/tests"
                className="mt-3 flex items-center gap-1 text-xs text-[#5742d3] hover:underline font-mono"
              >
                Take assessment →
              </Link>
            </GlassCard>

            {/* GAD-7 */}
            <GlassCard className="p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h5 className="font-semibold text-[#111c2d] text-sm">GAD-7 Anxiety</h5>
                  <p className="text-xs text-[#787586]">Latest result</p>
                </div>
                <span className="p-1.5 rounded-lg bg-[#006b56]/10">
                  <span className="material-symbols-outlined text-[#006b56] text-[18px]">monitor_heart</span>
                </span>
              </div>
              {latestTests["GAD-7"] ? (
                <div>
                  <p className="text-2xl font-bold font-display text-[#111c2d]">
                    {latestTests["GAD-7"].total_score}
                  </p>
                  <p className="text-xs text-[#787586] mt-1">{latestTests["GAD-7"].interpretation}</p>
                </div>
              ) : (
                <p className="text-sm text-[#787586]">Not taken yet</p>
              )}
              <Link
                to="/tests"
                className="mt-3 flex items-center gap-1 text-xs text-[#006b56] hover:underline font-mono"
              >
                Take assessment →
              </Link>
            </GlassCard>

            {/* Quick Actions */}
            <GlassCard className="p-5">
              <h5 className="font-semibold text-[#111c2d] text-sm mb-3">Quick Actions</h5>
              <div className="space-y-2">
                <Link
                  to="/mood"
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/60 transition-colors text-sm text-[#474554] group"
                >
                  <span className="p-1.5 rounded-lg bg-[#8a4c05]/10 text-[#8a4c05]">
                    <span className="material-symbols-outlined text-[16px]">wb_sunny</span>
                  </span>
                  Log today's mood
                </Link>
                <Link
                  to="/chat"
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/60 transition-colors text-sm text-[#474554]"
                >
                  <span className="p-1.5 rounded-lg bg-[#5742d3]/10 text-[#5742d3]">
                    <span className="material-symbols-outlined text-[16px]">forum</span>
                  </span>
                  Start a session
                </Link>
                <Link
                  to="/find-help/helplines"
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-red-50 transition-colors text-sm text-[#474554]"
                >
                  <span className="p-1.5 rounded-lg bg-red-100 text-red-600">
                    <span className="material-symbols-outlined text-[16px]">emergency</span>
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
