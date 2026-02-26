import { Link } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const moodData = [
  { day: 'Mon', mood: 3 }, { day: 'Tue', mood: 4 }, { day: 'Wed', mood: 2 },
  { day: 'Thu', mood: 5 }, { day: 'Fri', mood: 4 }, { day: 'Sat', mood: 5 }, { day: 'Sun', mood: 4 },
]

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#1F2933]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#D9E2EC] text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[#E8F8FC] to-transparent"></div>
            <div className="relative z-10">
              <div className="w-24 h-24 mx-auto bg-white rounded-full p-1 shadow-md mb-4">
                <img src="https://picsum.photos/seed/sarah/150/150" alt="Sarah" className="w-full h-full rounded-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <h2 className="text-xl font-bold text-[#1F2933]">Sarah Jenkins</h2>
              <p className="text-sm text-[#9AA5B1] font-medium mb-4">Joined March 2024</p>
              <div className="flex items-center justify-center gap-2 text-sm text-[#52606D] bg-[#F8FAFC] py-2 px-4 rounded-full border border-[#D9E2EC]">
                <span className="material-icons-round text-[#F59E0B] text-base">emoji_events</span>
                <span className="font-semibold">14 Day Streak</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#D9E2EC]">
            <h3 className="text-sm font-bold text-[#9AA5B1] uppercase tracking-wider mb-4">Weekly Summary</h3>
            <div className="space-y-4">
              {[
                { icon: 'chat_bubble_outline', bg: '#E8F8FC', color: '#22B1D4', label: 'Sessions', value: 5 },
                { icon: 'edit_note', bg: '#EEF2F6', color: '#52606D', label: 'Journal Entries', value: 3 },
                { icon: 'self_improvement', bg: '#E8F8FC', color: '#22B1D4', label: 'Exercises', value: 2 },
              ].map((stat, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: stat.bg }}>
                      <span className="material-icons-round" style={{ color: stat.color }}>{stat.icon}</span>
                    </div>
                    <span className="font-medium text-[#1F2933]">{stat.label}</span>
                  </div>
                  <span className="font-bold text-lg text-[#1F2933]">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Column */}
        <div className="lg:col-span-6 space-y-6">
          {/* Welcome Banner */}
          <div className="bg-[#22B1D4] rounded-3xl p-8 text-white shadow-md relative overflow-hidden" style={{ boxShadow: '0 8px 30px rgba(34,177,212,0.35)' }}>
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-black/10 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-serif font-bold mb-2">Good morning, Sarah.</h2>
              <p className="text-[#E8F8FC]/90 text-lg mb-6 max-w-md">"Every day is a new beginning. Take a deep breath and start again."</p>
              <button className="bg-white text-[#22B1D4] px-6 py-3 rounded-full font-bold hover:bg-[#E8F8FC] transition-colors shadow-sm flex items-center gap-2">
                <span className="material-icons-round text-sm">add</span>
                Log Today's Mood
              </button>
            </div>
          </div>

          {/* Mood Chart */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#D9E2EC]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[#1F2933]">Mood Trend</h3>
              <select className="bg-[#F8FAFC] border border-[#D9E2EC] text-sm font-medium text-[#52606D] rounded-lg px-3 py-1.5">
                <option>This Week</option>
                <option>Last Week</option>
                <option>This Month</option>
              </select>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={moodData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF2F6" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9AA5B1', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9AA5B1', fontSize: 12 }} dx={-10} domain={[1, 5]} ticks={[1,2,3,4,5]} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #D9E2EC', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.08)' }} cursor={{ stroke: '#E8F8FC', strokeWidth: 2 }} />
                  <Line type="monotone" dataKey="mood" stroke="#22B1D4" strokeWidth={4} dot={{ r: 6, fill: '#22B1D4', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Journal */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#D9E2EC]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[#1F2933]">Recent Journal</h3>
              <button className="text-[#22B1D4] hover:text-[#189AB4] text-sm font-bold transition-colors">View All</button>
            </div>
            <div className="space-y-4">
              {[
                { date: 'Yesterday, 8:00 PM', icon: 'sentiment_satisfied', iconColor: '#22B1D4', iconBg: '#E8F8FC', title: 'Reflecting on work stress', preview: 'Today was challenging. I felt overwhelmed during the afternoon meeting, but I remembered to use the breathing technique Serene suggested...' },
                { date: 'Oct 24, 9:15 AM', icon: 'sentiment_very_satisfied', iconColor: '#10B981', iconBg: '#D1FAE5', title: 'A peaceful morning', preview: 'Woke up feeling refreshed today. The morning meditation really helped set a positive tone for the rest of the day...' },
              ].map((entry, i) => (
                <div key={i} className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#D9E2EC] hover:border-[#22B1D4]/40 transition-colors cursor-pointer group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#9AA5B1] uppercase tracking-wider">{entry.date}</span>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: entry.iconBg }}>
                      <span className="material-icons-round text-sm" style={{ color: entry.iconColor }}>{entry.icon}</span>
                    </div>
                  </div>
                  <h4 className="font-bold text-[#1F2933] mb-1 group-hover:text-[#22B1D4] transition-colors">{entry.title}</h4>
                  <p className="text-sm text-[#9AA5B1] line-clamp-2">{entry.preview}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-3 space-y-6">
          {/* Assessments */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#D9E2EC]">
            <h3 className="text-lg font-bold text-[#1F2933] mb-4">Assessments</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#D9E2EC]">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-[#1F2933]">PHQ-9</h4>
                  <span className="text-xs font-bold text-[#F59E0B] bg-[#FEF3C7] px-2 py-1 rounded-md">Mild</span>
                </div>
                <p className="text-xs text-[#9AA5B1] mb-3">Depression Severity</p>
                <div className="w-full bg-[#EEF2F6] rounded-full h-2 mb-2">
                  <div className="bg-[#F59E0B] h-2 rounded-full" style={{ width: '30%' }}></div>
                </div>
                <p className="text-[10px] text-[#9AA5B1] text-right">Last taken: Oct 15</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#D9E2EC]">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-[#1F2933]">GAD-7</h4>
                  <span className="text-xs font-bold text-[#EF4444] bg-[#FEE2E2] px-2 py-1 rounded-md">Moderate</span>
                </div>
                <p className="text-xs text-[#9AA5B1] mb-3">Anxiety Severity</p>
                <div className="w-full bg-[#EEF2F6] rounded-full h-2 mb-2">
                  <div className="bg-[#EF4444] h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
                <p className="text-[10px] text-[#9AA5B1] text-right">Last taken: Oct 15</p>
              </div>
              <Link to="/onboarding/4" className="w-full py-2.5 border-2 border-dashed border-[#D9E2EC] rounded-xl text-sm font-bold text-[#22B1D4] hover:bg-[#E8F8FC] hover:border-[#22B1D4] transition-colors flex items-center justify-center gap-2">
                <span className="material-icons-round text-sm">add</span>
                Take New Assessment
              </Link>
            </div>
          </div>

          {/* Current Goals */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#D9E2EC]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#1F2933]">Current Goals</h3>
              <button className="text-[#9AA5B1] hover:text-[#22B1D4] transition-colors">
                <span className="material-icons-round text-sm">edit</span>
              </button>
            </div>
            <ul className="space-y-3">
              {[
                { label: 'Meditate for 10 mins daily', done: false },
                { label: 'Drink 8 glasses of water', done: true },
                { label: 'Journal before bed', done: false },
              ].map((goal, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-colors ${goal.done ? 'bg-[#22B1D4] border-[#22B1D4]' : 'border-[#D9E2EC] hover:border-[#22B1D4]'}`}>
                    <span className={`material-icons-round text-[12px] ${goal.done ? 'text-white' : 'text-transparent'}`}>check</span>
                  </div>
                  <span className={`text-sm font-medium ${goal.done ? 'text-[#9AA5B1] line-through' : 'text-[#52606D]'}`}>{goal.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Action */}
          <Link to="/chat" className="block bg-[#22B1D4] rounded-3xl p-6 text-white text-center hover:bg-[#189AB4] transition-colors" style={{ boxShadow: '0 4px 20px rgba(34,177,212,0.3)' }}>
            <span className="material-icons-round text-4xl mb-2 block">chat</span>
            <p className="font-bold text-lg">Chat with Serene</p>
            <p className="text-[#E8F8FC]/80 text-sm">I'm here to listen</p>
          </Link>
        </div>
      </main>

      <div className="mt-8">
        <Footer />
      </div>
    </div>
  )
}
