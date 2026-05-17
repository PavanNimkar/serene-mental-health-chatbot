// src/pages/FindHelp/FindTherapist.jsx
import { useState } from "react";
import AppLayout from "../../components/AppLayout";
import GlassCard from "../../components/GlassCard";

const PLATFORMS = [
  {
    name: "iCall",
    desc: "Affordable online therapy by TISS-trained counsellors. Sessions start at ₹300.",
    url: "https://icallhelpline.org",
    icon: "psychology",
    badge: "₹300+",
    badgeColor: "text-[#22B1D4] bg-[#E8F8FC]",
    color: "text-[#22B1D4]",
    bg: "bg-[#E8F8FC]",
    tags: ["Online", "Affordable", "Certified"],
  },
  {
    name: "Practo",
    desc: "Find psychiatrists and psychologists near you or via teleconsultation.",
    url: "https://practo.com/therapists",
    icon: "local_hospital",
    badge: "In-person",
    badgeColor: "text-[#189AB4] bg-[#E8F8FC]",
    color: "text-[#189AB4]",
    bg: "bg-[#E8F8FC]",
    tags: ["Near you", "In-person", "Online"],
  },
  {
    name: "1to1help",
    desc: "Confidential counselling for individuals and corporates across India.",
    url: "https://1to1help.net",
    icon: "handshake",
    badge: "Corporate",
    badgeColor: "text-[#52606D] bg-[#F8FAFC]",
    color: "text-[#52606D]",
    bg: "bg-[#F8FAFC]",
    tags: ["Corporate", "Individual", "Hindi"],
  },
  {
    name: "Talkspace",
    desc: "Licensed therapists available via text, audio, and video sessions.",
    url: "https://talkspace.com",
    icon: "chat",
    badge: "International",
    badgeColor: "text-[#22B1D4] bg-[#E8F8FC]",
    color: "text-[#22B1D4]",
    bg: "bg-[#E8F8FC]",
    tags: ["Text", "Video", "Audio"],
  },
  {
    name: "BetterHelp",
    desc: "World's largest online therapy platform with 30,000+ licensed therapists.",
    url: "https://betterhelp.com",
    icon: "support_agent",
    badge: "Global",
    badgeColor: "text-[#189AB4] bg-[#E8F8FC]",
    color: "text-[#189AB4]",
    bg: "bg-[#E8F8FC]",
    tags: ["Global", "Specialised", "Flexible"],
  },
  {
    name: "The Mindful Lab",
    desc: "India-based therapists offering mindfulness-integrated therapy.",
    url: "#",
    icon: "self_improvement",
    badge: "India",
    badgeColor: "text-[#52606D] bg-[#F8FAFC]",
    color: "text-[#52606D]",
    bg: "bg-[#F8FAFC]",
    tags: ["Mindfulness", "India", "Online"],
  },
];

const SPECIALITIES = [
  "Anxiety",
  "Depression",
  "Trauma / PTSD",
  "Relationships",
  "Grief",
  "OCD",
  "ADHD",
  "Eating Disorders",
  "Stress",
  "Bipolar",
  "Sleep Issues",
  "Self-esteem",
];

const CHECKLIST = [
  { icon: "verified", text: "Check their credentials and license" },
  { icon: "chat", text: "Offer a free consultation session" },
  { icon: "translate", text: "Work in your preferred language" },
  { icon: "calendar_month", text: "Have availability matching your schedule" },
  { icon: "currency_rupee", text: "Fit within your budget" },
  { icon: "psychology", text: "Specialise in your area of concern" },
];

export default function FindTherapist() {
  const [selectedSpeciality, setSelectedSpeciality] = useState(null);

  return (
    <AppLayout
      title="Find Professional Help"
      subtitle="Connect with certified mental health professionals"
    >
      <div className="space-y-6">
        {/* Intro */}
        <GlassCard className="p-6 flex flex-col md:flex-row gap-5 items-center">
          <div className="w-16 h-16 rounded-full bg-[#E8F8FC] flex items-center justify-center shrink-0 border border-[#D4EEF7]">
            <span className="material-symbols-outlined text-3xl text-[#22B1D4]">
              medical_services
            </span>
          </div>
          <div>
            <h3
              className="text-xl font-bold text-[#1F2933] mb-1"
              style={{ fontFamily: "serif" }}
            >
              Professional help makes a real difference
            </h3>
            <p className="text-sm text-[#52606D] leading-relaxed">
              While Serene provides supportive AI companionship, a licensed
              therapist or psychiatrist can offer diagnosis, treatment, and
              evidence-based care that AI cannot replace. Here are trusted
              platforms to find qualified professionals.
            </p>
          </div>
        </GlassCard>

        {/* Speciality Filter */}
        <div>
          <h4
            className="text-base font-bold text-[#1F2933] mb-3"
            style={{ fontFamily: "serif" }}
          >
            Filter by Speciality
          </h4>
          <div className="flex flex-wrap gap-2">
            {SPECIALITIES.map((s) => (
              <button
                key={s}
                onClick={() =>
                  setSelectedSpeciality(selectedSpeciality === s ? null : s)
                }
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedSpeciality === s
                    ? "text-white shadow-[0_2px_8px_rgba(34,177,212,.3)]"
                    : "bg-white border border-[#E4EEF3] text-[#52606D] hover:border-[#D4EEF7] hover:text-[#22B1D4] hover:bg-[#E8F8FC]"
                }`}
                style={
                  selectedSpeciality === s
                    ? { background: "linear-gradient(135deg,#22B1D4,#189AB4)" }
                    : {}
                }
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Platform Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PLATFORMS.map((p) => (
            <GlassCard
              key={p.name}
              className="p-5 flex flex-col gap-4 hover:scale-[1.01] transition-transform"
            >
              <div className="flex items-start justify-between">
                <div
                  className={`p-2.5 rounded-xl ${p.bg} border border-[#D4EEF7]`}
                >
                  <span className={`material-symbols-outlined ${p.color}`}>
                    {p.icon}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-mono px-2 py-1 rounded-full border border-[#D4EEF7] ${p.badgeColor}`}
                >
                  {p.badge}
                </span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-[#1F2933] text-sm mb-1">
                  {p.name}
                </h4>
                <p className="text-xs text-[#9AA5B1] leading-relaxed">
                  {p.desc}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-mono bg-[#E8F8FC] text-[#22B1D4] px-2 py-0.5 rounded-full border border-[#D4EEF7]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-white text-xs font-semibold hover:opacity-90 transition-all shadow-[0_3px_10px_rgba(34,177,212,.25)]"
                style={{
                  background: "linear-gradient(135deg,#22B1D4,#189AB4)",
                }}
              >
                <span className="material-symbols-outlined text-[16px]">
                  open_in_new
                </span>
                Visit Platform
              </a>
            </GlassCard>
          ))}
        </div>

        {/* Checklist */}
        <GlassCard className="p-6">
          <h4
            className="text-lg font-bold text-[#1F2933] mb-4"
            style={{ fontFamily: "serif" }}
          >
            What to look for in a therapist
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CHECKLIST.map((item) => (
              <div
                key={item.text}
                className="flex items-center gap-3 p-3 rounded-xl bg-[#F8FAFC] border border-[#E4EEF3]"
              >
                <div className="w-8 h-8 rounded-full bg-[#E8F8FC] flex items-center justify-center shrink-0 border border-[#D4EEF7]">
                  <span className="material-symbols-outlined text-[#22B1D4] text-[16px]">
                    {item.icon}
                  </span>
                </div>
                <span className="text-sm text-[#52606D]">{item.text}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </AppLayout>
  );
}
