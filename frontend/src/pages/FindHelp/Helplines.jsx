import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useFindHelp } from "../../context/FindHelpContext";

function HelplineCard({ h, expanded, onToggle }) {
  return (
    <div
      className="bg-white rounded-2xl border border-[#E8F4F8] overflow-hidden transition-all duration-300"
      style={{ boxShadow: "0 2px 16px rgba(34,177,212,0.07)" }}
    >
      {/* Header */}
      <div className="p-6 flex items-start gap-4">
        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-[#F0F9FC] flex items-center justify-center border border-[#E8F4F8]">
          <img
            src={h.logo}
            alt={h.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-[#1F2933] font-serif">
            {h.name}
          </h3>
          <p className="text-sm text-[#52606D] mt-1 line-clamp-2">
            {h.description}
          </p>
          <button
            onClick={onToggle}
            className="mt-2 text-sm font-semibold text-[#22B1D4] hover:text-[#189AB4] transition-colors underline underline-offset-2"
          >
            {expanded ? "Show less" : "Learn More"}
          </button>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="px-6 pb-2 text-sm text-[#627D98]">
          <p>{h.description}</p>
        </div>
      )}

      {/* Info rows */}
      <div className="px-6 pb-6 space-y-3">
        <div className="flex items-start gap-3">
          <span className="material-icons-round text-[#22B1D4] text-lg mt-0.5">
            phone
          </span>
          <div>
            <span className="font-semibold text-[#1F2933] text-sm">
              Helpline:{" "}
            </span>
            <a
              href={`tel:${h.helpline}`}
              className="text-sm text-[#22B1D4] font-bold hover:underline"
            >
              {h.helpline}
            </a>
            {h.helplineNote && (
              <span className="text-xs text-[#9AA5B1] ml-1">
                {h.helplineNote}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-start gap-3">
          <span className="material-icons-round text-[#22B1D4] text-lg mt-0.5">
            schedule
          </span>
          <div>
            <span className="font-semibold text-[#1F2933] text-sm">Time: </span>
            <span className="text-sm text-[#52606D]">{h.time}</span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <span className="material-icons-round text-[#22B1D4] text-lg mt-0.5">
            language
          </span>
          <div>
            <span className="font-semibold text-[#1F2933] text-sm">
              Languages:{" "}
            </span>
            <span className="text-sm text-[#52606D]">
              {h.languages.join(", ")}
            </span>
          </div>
        </div>

        {h.email && (
          <div className="flex items-start gap-3">
            <span className="material-icons-round text-[#22B1D4] text-lg mt-0.5">
              email
            </span>
            <div>
              <span className="font-semibold text-[#1F2933] text-sm">
                Email:{" "}
              </span>
              <a
                href={`mailto:${h.email}`}
                className="text-sm text-[#22B1D4] hover:underline"
              >
                {h.email}
              </a>
            </div>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="px-6 pb-6">
        <a
          href={`tel:${h.helpline}`}
          className="w-full flex items-center justify-center gap-2 bg-[#22B1D4] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#189AB4] active:bg-[#137A8F] transition-colors"
          style={{ boxShadow: "0 4px 12px rgba(34,177,212,0.25)" }}
        >
          <span className="material-icons-round text-base">call</span>
          Call Now
        </a>
      </div>
    </div>
  );
}

export default function Helplines() {
  const { helplines } = useFindHelp();
  const [expanded, setExpanded] = useState(null);

  const toggle = (id) => setExpanded((prev) => (prev === id ? null : id));

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-6 py-4">
        <nav className="flex items-center gap-1.5 text-sm text-[#9AA5B1]">
          <Link to="/" className="hover:text-[#22B1D4] transition-colors">
            Home
          </Link>
          <span className="material-icons-round text-sm">chevron_right</span>
          <Link
            to="/find-help"
            className="hover:text-[#22B1D4] transition-colors"
          >
            Find Help
          </Link>
          <span className="material-icons-round text-sm">chevron_right</span>
          <span className="text-[#1F2933] font-medium">Helplines</span>
        </nav>
      </div>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 pb-8">
        <div
          className="rounded-2xl p-8 md:p-12 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #22B1D4 0%, #189AB4 60%, #0E7490 100%)",
          }}
        >
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              <span className="material-icons-round text-sm">
                support_agent
              </span>
              Free & Confidential
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-3">
              Mental Health Helplines
            </h1>
            <p className="text-white/80 text-base md:text-lg max-w-xl">
              Reach out to trained counsellors anytime. All helplines listed
              here are free and available across India.
            </p>
          </div>
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div className="absolute bottom-0 right-16 w-28 h-28 rounded-full bg-white/10 translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Tab Nav (mirrors Find Help sub-pages) */}
      <div className="max-w-6xl mx-auto px-6 mb-8">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {[
            {
              label: "Helplines",
              to: "/find-help/helplines",
              active: true,
              icon: "phone_in_talk",
            },
            {
              label: "Find a Therapist",
              to: "/find-help/therapist",
              active: false,
              icon: "person_search",
            },
            {
              label: "Self-Help Techniques",
              to: "/find-help/self-help",
              active: false,
              icon: "self_improvement",
            },
          ].map((tab) => (
            <Link
              key={tab.label}
              to={tab.to}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-semibold transition-all ${
                tab.active
                  ? "bg-[#22B1D4] text-white shadow-md"
                  : "bg-white text-[#52606D] border border-[#D9E2EC] hover:border-[#22B1D4] hover:text-[#22B1D4]"
              }`}
            >
              <span className="material-icons-round text-base">{tab.icon}</span>
              {tab.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <p className="text-sm text-[#9AA5B1] mb-6">
          {helplines.length} helplines available
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {helplines.map((h) => (
            <HelplineCard
              key={h.id}
              h={h}
              expanded={expanded === h.id}
              onToggle={() => toggle(h.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
