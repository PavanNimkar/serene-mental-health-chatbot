// src/pages/FindHelp/Helplines.jsx
import AppLayout from "../../components/AppLayout";
import GlassCard from "../../components/GlassCard";

const CRISIS_LINES = [
  {
    name: "iCall",
    desc: "Psychological counselling and mental health support",
    phone: "9152987821",
    available: "Mon–Sat 8am–10pm",
    type: "Counselling",
    color: "text-[#22B1D4]",
    bg: "bg-[#E8F8FC]/60",
  },
  {
    name: "Vandrevala Foundation",
    desc: "24/7 mental health support in multiple languages",
    phone: "1860-2662-345",
    available: "24/7",
    type: "Crisis",
    color: "text-[#189AB4]",
    bg: "bg-[#E8F8FC]/40",
  },
  {
    name: "iCall TISS",
    desc: "Free, confidential counselling services",
    phone: "9152987821",
    available: "Mon–Sat 8am–10pm",
    type: "Counselling",
    color: "text-[#22B1D4]",
    bg: "bg-[#E8F8FC]/60",
  },
  {
    name: "Snehi",
    desc: "Emotional support for suicidal thoughts & mental health",
    phone: "044-24640050",
    available: "24/7",
    type: "Suicide Prevention",
    color: "text-[#8a4c05]",
    bg: "bg-[#ffdcc2]/30",
  },
  {
    name: "AASRA",
    desc: "24/7 crisis intervention for those in despair",
    phone: "9820466627",
    available: "24/7",
    type: "Crisis",
    color: "text-[#ba1a1a]",
    bg: "bg-[#ffdad6]/30",
  },
  {
    name: "Fortis Stress Helpline",
    desc: "Immediate mental health support",
    phone: "8376804102",
    available: "24/7",
    type: "Crisis",
    color: "text-[#189AB4]",
    bg: "bg-[#E8F8FC]/40",
  },
  {
    name: "Emergency Services",
    desc: "For life-threatening emergencies",
    phone: "112",
    available: "24/7",
    type: "Emergency",
    color: "text-[#ba1a1a]",
    bg: "bg-[#ffdad6]/40",
  },
  {
    name: "NIMHANS",
    desc: "National Institute of Mental Health helpline",
    phone: "080-46110007",
    available: "Mon–Sat 9am–5pm",
    type: "Mental Health",
    color: "text-[#22B1D4]",
    bg: "bg-[#E8F8FC]/60",
  },
];

const TYPE_COLORS = {
  Crisis: "bg-[#E8F8FC]/80 text-[#189AB4]",
  Counselling: "bg-[#E8F8FC]/60 text-[#22B1D4]",
  Emergency: "bg-[#ffdad6]/80 text-[#93000a]",
  "Suicide Prevention": "bg-[#ffdcc2]/60 text-[#8a4c05]",
  "Mental Health": "bg-[#E8F8FC]/60 text-[#189AB4]",
};

export default function Helplines() {
  return (
    <AppLayout
      title="Crisis Helplines"
      subtitle="You're not alone — help is available right now"
    >
      <div className="space-y-5">
        {/* SOS Banner */}
        <GlassCard className="p-5 bg-[#ffdad6]/40 border border-[#ffdad6]">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="w-12 h-12 rounded-full bg-[#ba1a1a] flex items-center justify-center shrink-0 animate-breathe">
              <span
                className="material-symbols-outlined text-white"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                emergency
              </span>
            </div>
            <div className="flex-1">
              <h3 className="font-display text-lg font-bold text-[#93000a]">
                In immediate danger?
              </h3>
              <p className="text-sm text-[#93000a]/80 mt-0.5">
                Call 112 for emergency services or reach out to any helpline
                below.
              </p>
            </div>
            <a
              href="tel:112"
              className="shrink-0 flex items-center gap-2 bg-[#ba1a1a] text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg hover:bg-[#93000a] transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">
                call
              </span>
              Call 112
            </a>
          </div>
        </GlassCard>

        {/* Helpline Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {CRISIS_LINES.map((line) => (
            <div
              key={line.name}
              className="bg-white border border-[#E4EEF3] rounded-2xl p-5 flex flex-col gap-3 hover:scale-[1.01] hover:shadow-[0_4px_16px_rgba(34,177,212,.12)] transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className={`p-2 rounded-xl ${line.bg}`}>
                  <span className={`material-symbols-outlined ${line.color}`}>
                    call
                  </span>
                </div>
                <span
                  className={`text-[10px] font-mono px-2 py-1 rounded-full ${TYPE_COLORS[line.type] || "bg-[#E8F8FC] text-[#9AA5B1]"}`}
                >
                  {line.type}
                </span>
              </div>
              <div>
                <h4 className="font-semibold text-[#1F2933] text-sm">
                  {line.name}
                </h4>
                <p className="text-xs text-[#9AA5B1] mt-0.5 leading-relaxed">
                  {line.desc}
                </p>
              </div>
              <div className="mt-auto space-y-2">
                <a
                  href={`tel:${line.phone}`}
                  className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-mono text-sm font-bold transition-all ${line.bg} ${line.color} hover:scale-[1.02]`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    call
                  </span>
                  {line.phone}
                </a>
                <p className="text-center text-[10px] text-[#9AA5B1] font-mono">
                  {line.available}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Reminder */}
        <div className="bg-white border border-[#E4EEF3] rounded-2xl p-5 flex gap-3 items-start">
          <span className="material-symbols-outlined text-[#22B1D4] shrink-0">
            info
          </span>
          <p className="text-sm text-[#52606D] leading-relaxed">
            These helplines are operated by trained professionals. Calls are
            confidential. If you're supporting someone in crisis, you can also
            reach out on their behalf. Remember: reaching out is an act of
            courage, not weakness.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
