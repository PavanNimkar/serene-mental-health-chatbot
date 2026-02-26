import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const features = [
  {
    icon: "psychology",
    bg: "#E8F8FC",
    iconColor: "#22B1D4",
    title: "AI Companion",
    desc: "Chat with Serene anytime. Get empathetic, personalized support 24/7 without judgment.",
  },
  {
    icon: "edit_note",
    bg: "#EEF2F6",
    iconColor: "#52606D",
    title: "Guided Journaling",
    desc: "Reflect on your thoughts with guided prompts that promote self-awareness and healing.",
  },
  {
    icon: "insights",
    bg: "#E8F8FC",
    iconColor: "#22B1D4",
    title: "Mood Analytics",
    desc: "Track emotional patterns and gain insights to understand what helps you thrive.",
  },
  {
    icon: "self_improvement",
    bg: "#EEF2F6",
    iconColor: "#52606D",
    title: "Mindfulness Exercises",
    desc: "Access breathing exercises, meditations, and grounding techniques when you need them.",
  },
  {
    icon: "assessment",
    bg: "#E8F8FC",
    iconColor: "#22B1D4",
    title: "Mental Health Assessments",
    desc: "Track your wellbeing with validated PHQ-9 and GAD-7 assessments over time.",
  },
  {
    icon: "people",
    bg: "#EEF2F6",
    iconColor: "#52606D",
    title: "Professional Support",
    desc: "Connect with licensed therapists for personalized professional guidance when needed.",
  },
];

const stats = [
  { value: "10K+", label: "Active Users" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "24/7", label: "Available" },
  { value: "150+", label: "Exercises" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      <Navbar />

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-8 pt-20 pb-28 grid md:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E8F8FC] text-[#22B1D4] font-semibold text-sm border border-[#22B1D4]/20">
            <span className="material-icons-round text-sm">favorite</span>
            Your mental health matters
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-[#1F2933] leading-tight">
            Your Safe Space for{" "}
            <span className="text-[#22B1D4] italic">Mental Wellness</span>
          </h1>
          <p className="text-lg text-[#52606D] leading-relaxed max-w-lg">
            Meet Serene, your AI companion designed to listen, support, and
            guide you through life's ups and downs with empathy and
            evidence-based practices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/onboarding/1"
              className="bg-[#22B1D4] text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#189AB4] transition-colors text-center"
              style={{ boxShadow: "0 4px 20px rgba(34,177,212,0.35)" }}
            >
              Start Your Journey
            </Link>
            <Link
              to="/chat"
              className="bg-transparent text-[#22B1D4] border-2 border-[#22B1D4] px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#E8F8FC] transition-colors text-center"
            >
              Meet Your Companion
            </Link>
          </div>
          <div className="flex items-center gap-5 pt-2">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((n) => (
                <img
                  key={n}
                  src={`https://picsum.photos/seed/user${n}/100/100`}
                  alt=""
                  className="w-10 h-10 rounded-full border-2 border-white object-cover"
                  referrerPolicy="no-referrer"
                />
              ))}
            </div>
            <div className="text-sm text-[#52606D]">
              <span className="font-bold text-[#1F2933]">10,000+</span> users
              finding peace
            </div>
          </div>
        </div>

        <div className="relative">
          <div
            className="absolute inset-0 bg-[#22B1D4] rounded-full blur-3xl opacity-10"
            style={{ transform: "translate(30px, 30px)" }}
          ></div>
          <img
            src="/login-bck.png"
            alt="Wellness"
            className="rounded-3xl shadow-2xl relative z-10 object-cover w-full h-[580px]"
            referrerPolicy="no-referrer"
          />
          <div
            className="absolute top-8 -left-8 bg-white p-4 rounded-2xl shadow-xl z-20 flex items-center gap-3 border border-[#D9E2EC]"
            style={{ animation: "bounce 3s infinite" }}
          >
            <div className="w-11 h-11 bg-[#E8F8FC] rounded-full flex items-center justify-center">
              <span className="material-icons-round text-[#22B1D4]">mood</span>
            </div>
            <div>
              <p className="text-xs text-[#9AA5B1] font-medium">
                Daily Check-in
              </p>
              <p className="text-[#1F2933] font-bold text-sm">
                Feeling Peaceful
              </p>
            </div>
          </div>
          <div
            className="absolute bottom-16 -right-8 bg-white p-4 rounded-2xl shadow-xl z-20 flex items-center gap-3 border border-[#D9E2EC]"
            style={{ animation: "bounce 4s infinite", animationDelay: "1s" }}
          >
            <div className="w-11 h-11 bg-[#E8F8FC] rounded-full flex items-center justify-center">
              <span className="material-icons-round text-[#22B1D4]">
                trending_down
              </span>
            </div>
            <div>
              <p className="text-xs text-[#9AA5B1] font-medium">
                Weekly Insight
              </p>
              <p className="text-[#1F2933] font-bold text-sm">
                Stress reduced 15%
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Stats Bar */}
      <section className="bg-[#22B1D4]">
        <div className="max-w-7xl mx-auto px-8 py-14 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl font-bold text-white mb-1">
                {s.value}
              </div>
              <div className="text-[#E8F8FC] font-medium text-sm">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-white py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-[#22B1D4] font-semibold text-sm uppercase tracking-widest mb-4">
              Features
            </span>
            <h2 className="text-4xl font-serif font-bold text-[#1F2933] mb-4">
              Everything You Need to Thrive
            </h2>
            <p className="text-[#52606D] text-lg max-w-2xl mx-auto">
              Tools designed with compassion and evidence-based practices to
              support your mental health journey.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-[#F8FAFC] rounded-3xl p-8 hover:shadow-lg transition-all border border-[#D9E2EC] group cursor-pointer"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: f.bg }}
                >
                  <span
                    className="material-icons-round text-2xl"
                    style={{ color: f.iconColor }}
                  >
                    {f.icon}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#1F2933] mb-3">
                  {f.title}
                </h3>
                <p className="text-[#52606D] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="bg-[#F8FAFC] py-24 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block text-[#22B1D4] font-semibold text-sm uppercase tracking-widest mb-4">
            How It Works
          </span>
          <h2 className="text-4xl font-serif font-bold text-[#1F2933] mb-16">
            Start in 3 Simple Steps
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                step: "01",
                icon: "person_add",
                title: "Create Your Profile",
                desc: "Tell us about yourself and your wellness goals in a quick 5-step onboarding.",
              },
              {
                step: "02",
                icon: "chat",
                title: "Chat with Serene",
                desc: "Have a conversation with your AI companion — anytime, anywhere, about anything.",
              },
              {
                step: "03",
                icon: "insights",
                title: "Track Your Growth",
                desc: "View mood trends, journal entries, and assessment scores in your personal dashboard.",
              },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div
                  className="w-16 h-16 rounded-full bg-[#22B1D4] flex items-center justify-center mb-5 text-white"
                  style={{ boxShadow: "0 4px 20px rgba(34,177,212,0.35)" }}
                >
                  <span className="material-icons-round text-2xl">
                    {item.icon}
                  </span>
                </div>
                <span className="text-xs font-bold text-[#9AA5B1] uppercase tracking-widest mb-2">
                  {item.step}
                </span>
                <h3 className="text-lg font-bold text-[#1F2933] mb-2">
                  {item.title}
                </h3>
                <p className="text-[#52606D] text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-8 bg-[#22B1D4]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-serif font-bold text-white mb-6">
            Begin Your Healing Journey Today
          </h2>
          <p className="text-[#E8F8FC] text-lg mb-10">
            Join thousands finding peace, clarity, and emotional resilience with
            Serene.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/onboarding/1"
              className="bg-white text-[#22B1D4] px-10 py-4 rounded-full font-bold text-lg hover:bg-[#E8F8FC] transition-colors shadow-xl"
            >
              Get Started Free
            </Link>
            <Link
              to="/pricing"
              className="bg-transparent text-white border-2 border-white/50 px-10 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
