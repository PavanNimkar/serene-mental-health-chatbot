import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useFindHelp } from "../../context/FindHelpContext";

const DIFFICULTY_COLOR = {
  Beginner: { bg: "#F0FDF4", text: "#10B981" },
  Intermediate: { bg: "#FFF7ED", text: "#F59E0B" },
  Advanced: { bg: "#FEF2F2", text: "#EF4444" },
};

function TechniqueModal({ technique, onClose }) {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(31,41,51,0.6)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        style={{ boxShadow: "0 24px 64px rgba(34,177,212,0.18)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div
          className="h-2 rounded-t-2xl"
          style={{ background: technique.color }}
        />

        <div className="p-6">
          {/* Top */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{
                  background: `${technique.color}22`,
                  color: technique.color,
                }}
              >
                {technique.category}
              </span>
              <h2 className="text-xl font-serif font-bold text-[#1F2933] mt-2">
                {technique.title}
              </h2>
              <p className="text-sm text-[#52606D] mt-0.5">
                {technique.subtitle}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#F8FAFC] text-[#9AA5B1] hover:text-[#1F2933] transition-colors flex-shrink-0"
            >
              <span className="material-icons-round">close</span>
            </button>
          </div>

          {/* Meta */}
          <div className="flex gap-3 mb-5">
            <span className="flex items-center gap-1 text-xs text-[#52606D]">
              <span className="material-icons-round text-sm text-[#22B1D4]">
                schedule
              </span>
              {technique.duration}
            </span>
            <span
              className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={
                DIFFICULTY_COLOR[technique.difficulty] ||
                DIFFICULTY_COLOR.Beginner
              }
            >
              {technique.difficulty}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-[#52606D] leading-relaxed mb-6">
            {technique.description}
          </p>

          {/* Steps */}
          <div>
            <h3 className="font-semibold text-[#1F2933] mb-3 text-sm uppercase tracking-wide">
              Steps
            </h3>
            <div className="space-y-3">
              {technique.steps.map((step, i) => (
                <div
                  key={i}
                  onClick={() => setActiveStep(i)}
                  className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                    activeStep === i
                      ? "border-2 bg-opacity-5"
                      : "border border-[#E8F4F8] hover:border-[#22B1D4]/40"
                  }`}
                  style={
                    activeStep === i
                      ? {
                          borderColor: technique.color,
                          background: `${technique.color}0D`,
                        }
                      : {}
                  }
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                    style={{
                      background:
                        activeStep === i ? technique.color : "#E8F4F8",
                      color: activeStep === i ? "#fff" : "#9AA5B1",
                    }}
                  >
                    {i + 1}
                  </div>
                  <p className="text-sm text-[#1F2933] leading-relaxed">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button
            className="w-full mt-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{
              background: technique.color,
              boxShadow: `0 4px 16px ${technique.color}44`,
            }}
          >
            Start This Exercise
          </button>
        </div>
      </div>
    </div>
  );
}

function TechniqueCard({ technique, onClick }) {
  const diff =
    DIFFICULTY_COLOR[technique.difficulty] || DIFFICULTY_COLOR.Beginner;

  return (
    <div
      className="bg-white rounded-2xl border border-[#E8F4F8] overflow-hidden cursor-pointer group transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
      style={{ boxShadow: "0 2px 12px rgba(34,177,212,0.06)" }}
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div
        className="relative h-44 overflow-hidden"
        style={{ background: technique.color }}
      >
        <img
          src={technique.thumbnail}
          alt={technique.title}
          className="w-full h-full object-cover mix-blend-overlay opacity-40"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">
            {technique.category}
          </p>
          <p className="text-white font-bold text-sm uppercase tracking-wide leading-tight">
            {technique.videoLabel}
          </p>
        </div>
        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
            <span className="material-icons-round text-[#1F2933] text-xl">
              play_arrow
            </span>
          </div>
        </div>
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/30" />
      </div>

      <div className="p-5">
        <h3 className="font-serif font-bold text-[#1F2933] text-base mb-0.5">
          {technique.title}
        </h3>
        <p className="text-xs text-[#52606D] mb-3">{technique.subtitle}</p>

        <p className="text-sm text-[#627D98] line-clamp-2 mb-4">
          {technique.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <span className="flex items-center gap-1 text-xs text-[#52606D]">
              <span className="material-icons-round text-sm text-[#22B1D4]">
                schedule
              </span>
              {technique.duration}
            </span>
            <span
              className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={diff}
            >
              {technique.difficulty}
            </span>
          </div>
          <span
            className="text-xs font-semibold flex items-center gap-0.5 transition-colors group-hover:underline"
            style={{ color: technique.color }}
          >
            Start
            <span className="material-icons-round text-sm">arrow_forward</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default function SelfHelpTechniques() {
  const { selfHelpTechniques, categories } = useFindHelp();
  const [activeCategory, setActiveCategory] = useState("All");
  const [selected, setSelected] = useState(null);

  const filtered =
    activeCategory === "All"
      ? selfHelpTechniques
      : selfHelpTechniques.filter((t) => t.category === activeCategory);

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
          <span className="text-[#1F2933] font-medium">
            Self-Help Techniques
          </span>
        </nav>
      </div>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 pb-8">
        <div
          className="rounded-2xl p-8 md:p-12 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 60%, #4C1D95 100%)",
          }}
        >
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              <span className="material-icons-round text-sm">
                self_improvement
              </span>
              Evidence-based techniques
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-3">
              Self-Help Techniques
            </h1>
            <p className="text-white/75 text-base md:text-lg max-w-xl">
              Practical, therapist-approved exercises you can try on your own —
              anytime, anywhere.
            </p>
          </div>
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div className="absolute bottom-0 right-20 w-32 h-32 rounded-full bg-white/10 translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Tab Nav */}
      <div className="max-w-6xl mx-auto px-6 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[
            {
              label: "Helplines",
              to: "/find-help/helplines",
              active: false,
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
              active: true,
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

      {/* Category Filter */}
      <div className="max-w-6xl mx-auto px-6 mb-8">
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                activeCategory === cat
                  ? "bg-[#8B5CF6] text-white border-[#8B5CF6] shadow-md"
                  : "bg-white text-[#52606D] border-[#D9E2EC] hover:border-[#8B5CF6] hover:text-[#8B5CF6]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <p className="text-sm text-[#9AA5B1] mb-6">
          <span className="font-semibold text-[#1F2933]">
            {filtered.length}
          </span>{" "}
          techniques
          {activeCategory !== "All" ? ` for ${activeCategory}` : ""}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((t) => (
            <TechniqueCard
              key={t.id}
              technique={t}
              onClick={() => setSelected(t)}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <TechniqueModal
          technique={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
