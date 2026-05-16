// src/pages/Home.jsx
import { Link } from "react-router-dom";

const FEATURES = [
  {
    icon: "psychology",
    title: "AI Companion",
    desc: "Chat with Serene anytime — empathetic, personalised support 24/7 without judgment.",
    color: "text-[#5742d3]",
    bg: "bg-[#e4dfff]/40",
  },
  {
    icon: "wb_sunny",
    title: "Mood Analytics",
    desc: "Track emotional patterns and gain insights to understand what helps you thrive.",
    color: "text-[#8a4c05]",
    bg: "bg-[#ffdcc2]/30",
  },
  {
    icon: "quiz",
    title: "Clinical Assessments",
    desc: "Track wellbeing with validated PHQ-9 and GAD-7 tests, interpreted with care.",
    color: "text-[#006b56]",
    bg: "bg-[#75f9d3]/20",
  },
  {
    icon: "self_improvement",
    title: "Mindfulness Exercises",
    desc: "Breathing exercises, grounding techniques, and meditations — always available.",
    color: "text-[#5742d3]",
    bg: "bg-[#e4dfff]/40",
  },
  {
    icon: "medical_services",
    title: "Professional Support",
    desc: "Connect with licensed therapists for personalised professional guidance.",
    color: "text-[#006b56]",
    bg: "bg-[#75f9d3]/20",
  },
  {
    icon: "emergency",
    title: "Crisis Helplines",
    desc: "Immediate access to verified crisis helplines across India, available 24/7.",
    color: "text-[#ba1a1a]",
    bg: "bg-[#ffdad6]/30",
  },
];

const STATS = [
  { value: "10K+", label: "Active Users" },
  { value: "98%", label: "Satisfaction" },
  { value: "24/7", label: "Available" },
  { value: "150+", label: "Exercises" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f9f9ff] relative overflow-x-hidden">
      {/* Background orbs */}
      <div className="orb w-[600px] h-[600px] bg-[#5742d3]/8 -top-32 -right-32" />
      <div className="orb w-[500px] h-[500px] bg-[#006b56]/6 bottom-0 -left-32" />
      <div className="orb w-[400px] h-[400px] bg-[#8a4c05]/5 top-[40%] left-[30%]" />

      {/* Navbar */}
      <nav className="sticky top-0 z-40 flex items-center justify-between px-6 md:px-12 py-4 bg-white/70 backdrop-blur-xl border-b border-white/30 shadow-sm">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Serene" className="w-8 h-8 object-contain" />
          <span className="font-display text-xl font-bold text-[#5742d3]">Serene</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm text-[#474554]">
          <a href="#features" className="hover:text-[#5742d3] transition-colors">Features</a>
          <a href="#how" className="hover:text-[#5742d3] transition-colors">How it Works</a>
          <Link to="/find-help/helplines" className="hover:text-[#5742d3] transition-colors">Crisis Help</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm text-[#5742d3] font-medium hover:underline px-3 py-1.5"
          >
            Sign In
          </Link>
          <Link
            to="/login"
            className="text-sm bg-[#5742d3] text-white px-4 py-2 rounded-xl font-semibold hover:bg-[#4126bd] transition-colors shadow-lg shadow-[#5742d3]/20"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 pt-20 pb-24 grid md:grid-cols-2 gap-12 items-center relative z-10">
        <div className="space-y-7">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-[#5742d3]/20 text-[#5742d3] text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-[#5742d3] animate-pulse" />
            Your mental health matters
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-[#111c2d] leading-tight">
            Your safe space for{" "}
            <span className="text-[#5742d3] italic">mental wellness</span>
          </h1>
          <p className="text-[#474554] text-lg leading-relaxed max-w-md">
            Meet Serene — an AI companion designed to listen, support, and guide you through life's
            ups and downs with empathy and evidence-based practices.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/login"
              className="bg-[#5742d3] text-white px-8 py-3.5 rounded-xl font-semibold text-base hover:bg-[#4126bd] transition-all shadow-xl shadow-[#5742d3]/25 text-center active:scale-[0.98]"
            >
              Begin Your Journey
            </Link>
            <Link
              to="/find-help/helplines"
              className="glass-card border border-[#5742d3]/20 text-[#5742d3] px-8 py-3.5 rounded-xl font-semibold text-base hover:bg-white/80 transition-all text-center"
            >
              Crisis Help
            </Link>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <div className="flex -space-x-2">
              {["A", "B", "C", "D"].map((l, i) => (
                <div
                  key={l}
                  className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white"
                  style={{
                    background: ["#5742d3", "#006b56", "#8a4c05", "#5742d3"][i],
                  }}
                >
                  {l}
                </div>
              ))}
            </div>
            <p className="text-sm text-[#787586]">
              <span className="font-bold text-[#111c2d]">10,000+</span> users finding peace
            </p>
          </div>
        </div>

        {/* Hero image card */}
        <div className="relative">
          <div className="absolute inset-0 bg-[#5742d3] rounded-3xl blur-3xl opacity-8 translate-x-4 translate-y-4" />
          <div className="relative z-10 glass-card rounded-3xl overflow-hidden shadow-2xl border border-white/40">
            <img
              src="/login-bck.png"
              alt="Serene wellness"
              className="w-full h-[400px] md:h-[480px] object-cover"
              onError={(e) => {
                e.currentTarget.parentNode.style.background =
                  "linear-gradient(135deg, #e4dfff 0%, #75f9d3 100%)";
                e.currentTarget.style.display = "none";
              }}
            />
            {/* Floating card */}
            <div className="absolute bottom-4 left-4 right-4 glass-card rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#5742d3] flex items-center justify-center text-white shrink-0">
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#111c2d]">Serene AI</p>
                <p className="text-xs text-[#787586]">Here whenever you need to talk 🌿</p>
              </div>
              <div className="ml-auto flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#006b56] animate-pulse" />
                <span className="text-[10px] text-[#006b56] font-mono">ONLINE</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-4xl mx-auto px-6 md:px-12 pb-16 relative z-10">
        <div className="glass-card rounded-2xl p-6 grid grid-cols-2 md:grid-cols-4 gap-6 border border-white/40 shadow-xl">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-3xl font-bold text-[#5742d3]">{s.value}</p>
              <p className="text-xs text-[#787586] mt-1 font-mono tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 md:px-12 py-16 relative z-10">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[#111c2d] mb-3">
            Everything you need to thrive
          </h2>
          <p className="text-[#787586] max-w-lg mx-auto">
            A comprehensive suite of tools built with clinical insight and human empathy.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <GlassFeatureCard key={f.title} feature={f} />
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section id="how" className="max-w-4xl mx-auto px-6 md:px-12 py-16 relative z-10">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl font-bold text-[#111c2d] mb-3">How it works</h2>
          <p className="text-[#787586]">Get started in minutes</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { step: "01", title: "Create account", desc: "Sign up in seconds — no credit card needed", icon: "person_add" },
            { step: "02", title: "Onboarding", desc: "Tell Serene about your wellness goals and preferences", icon: "tune" },
            { step: "03", title: "Start chatting", desc: "Your AI companion is ready to listen 24/7", icon: "forum" },
            { step: "04", title: "Track & grow", desc: "Monitor your mood, tests, and wellbeing over time", icon: "trending_up" },
          ].map((item) => (
            <div key={item.step} className="glass-card rounded-2xl p-5 text-center border border-white/30">
              <div className="w-12 h-12 rounded-full bg-[#5742d3] flex items-center justify-center mx-auto mb-3 text-white">
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              </div>
              <p className="text-xs font-mono text-[#787586] mb-1">{item.step}</p>
              <h4 className="font-semibold text-[#111c2d] text-sm mb-1">{item.title}</h4>
              <p className="text-xs text-[#787586] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 md:px-12 py-16 relative z-10 text-center">
        <div className="glass-card rounded-3xl p-10 border border-white/40 shadow-xl">
          <div className="w-14 h-14 rounded-full bg-[#5742d3]/10 flex items-center justify-center mx-auto mb-4 animate-breathe">
            <span className="material-symbols-outlined text-2xl text-[#5742d3]">self_improvement</span>
          </div>
          <h2 className="font-display text-3xl font-bold text-[#111c2d] mb-3">
            Ready to find your peace?
          </h2>
          <p className="text-[#787586] mb-6 max-w-md mx-auto">
            Join thousands who've taken the first step toward better mental wellbeing with Serene.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 bg-[#5742d3] text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-[#4126bd] transition-all shadow-xl shadow-[#5742d3]/25"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#111c2d] text-white px-6 md:px-12 py-10 mt-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <img src="/logo.png" alt="Serene" className="w-7 h-7 object-contain" />
              <span className="font-display text-lg font-bold text-white">Serene</span>
            </div>
            <p className="text-[#787586] text-xs max-w-xs leading-relaxed">
              An AI-powered mental wellness companion. Not a substitute for professional care.
            </p>
          </div>
          <div className="flex gap-8 text-sm">
            <div className="space-y-2">
              <p className="font-mono text-[10px] tracking-widest text-[#787586] uppercase">Support</p>
              <Link to="/find-help/helplines" className="block text-[#c8c4d7] hover:text-white transition-colors text-xs">Crisis Helplines</Link>
              <Link to="/find-help/therapist" className="block text-[#c8c4d7] hover:text-white transition-colors text-xs">Find Therapist</Link>
              <Link to="/find-help/self-help" className="block text-[#c8c4d7] hover:text-white transition-colors text-xs">Self-Help</Link>
            </div>
            <div className="space-y-2">
              <p className="font-mono text-[10px] tracking-widest text-[#787586] uppercase">App</p>
              <Link to="/login" className="block text-[#c8c4d7] hover:text-white transition-colors text-xs">Sign In</Link>
              <Link to="/dashboard" className="block text-[#c8c4d7] hover:text-white transition-colors text-xs">Dashboard</Link>
              <Link to="/chat" className="block text-[#c8c4d7] hover:text-white transition-colors text-xs">AI Chat</Link>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto border-t border-white/10 mt-8 pt-6 text-center">
          <p className="text-[10px] text-[#787586] font-mono">
            © {new Date().getFullYear()} Serene. Built with care for your mental wellbeing.
          </p>
        </div>
      </footer>
    </div>
  );
}

function GlassFeatureCard({ feature: f }) {
  return (
    <div className="glass-card rounded-2xl p-5 border border-white/30 hover:scale-[1.01] transition-transform duration-200 hover:shadow-md">
      <div className={`w-11 h-11 rounded-xl ${f.bg} flex items-center justify-center mb-4`}>
        <span className={`material-symbols-outlined ${f.color}`}>{f.icon}</span>
      </div>
      <h3 className="font-semibold text-[#111c2d] mb-1.5">{f.title}</h3>
      <p className="text-sm text-[#787586] leading-relaxed">{f.desc}</p>
    </div>
  );
}
