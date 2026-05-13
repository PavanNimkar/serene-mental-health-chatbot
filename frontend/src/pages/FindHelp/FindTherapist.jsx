import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useFindHelp } from "../../context/FindHelpContext";

const CITIES = [
  "All Cities",
  "Mumbai",
  "Ahmedabad",
  "Chennai",
  "Goa",
  "Kochi",
  "Kolkata",
];
const MODES = ["All Modes", "Online", "In-person"];
const SPECIALIZATIONS = [
  "All",
  "Clinical Psychologist",
  "Counselling Psychologist",
  "Psychiatrist",
  "Psychotherapist",
  "Child Psychologist",
  "Art Therapist",
];

function StarRating({ rating }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          className={`material-icons-round text-sm ${
            s <= Math.round(rating) ? "text-[#F59E0B]" : "text-[#D9E2EC]"
          }`}
        >
          star
        </span>
      ))}
    </span>
  );
}

function TherapistCard({ t }) {
  return (
    <div
      className="bg-white rounded-2xl border border-[#E8F4F8] overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
      style={{ boxShadow: "0 2px 12px rgba(34,177,212,0.06)" }}
    >
      {/* Top accent */}
      <div className="h-1.5 bg-gradient-to-r from-[#22B1D4] to-[#189AB4]" />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative flex-shrink-0">
            <img
              src={t.photo}
              alt={t.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-[#E8F4F8]"
            />
            {t.available && (
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#10B981] rounded-full border-2 border-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-[#1F2933] font-serif text-base">
              {t.name}
            </h3>
            <p className="text-xs text-[#52606D] mt-0.5">{t.specialization}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <StarRating rating={t.rating} />
              <span className="text-xs text-[#9AA5B1]">
                {t.rating} ({t.reviews})
              </span>
            </div>
          </div>
          <div className="flex-shrink-0 text-right">
            <p className="text-sm font-bold text-[#22B1D4]">{t.fee}</p>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm text-[#52606D] mb-4">
          <div className="flex items-center gap-2">
            <span className="material-icons-round text-[#22B1D4] text-base">
              work_history
            </span>
            <span>{t.experience} experience</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-icons-round text-[#22B1D4] text-base">
              location_on
            </span>
            <span>{t.city}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-icons-round text-[#22B1D4] text-base">
              language
            </span>
            <span className="truncate">{t.languages.join(", ")}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {t.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 rounded-full bg-[#F0F9FC] text-[#22B1D4] font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Mode badges */}
        <div className="flex gap-2 mb-4">
          {t.mode.map((m) => (
            <span
              key={m}
              className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border font-medium"
              style={{
                borderColor: m === "Online" ? "#22B1D4" : "#10B981",
                color: m === "Online" ? "#22B1D4" : "#10B981",
                background: m === "Online" ? "#F0F9FC" : "#F0FDF4",
              }}
            >
              <span className="material-icons-round text-xs">
                {m === "Online" ? "videocam" : "person"}
              </span>
              {m}
            </span>
          ))}
        </div>

        {/* CTA */}
        <button
          disabled={!t.available}
          className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${
            t.available
              ? "bg-[#22B1D4] text-white hover:bg-[#189AB4] active:bg-[#137A8F]"
              : "bg-[#F1F5F9] text-[#9AA5B1] cursor-not-allowed"
          }`}
          style={
            t.available ? { boxShadow: "0 4px 12px rgba(34,177,212,0.22)" } : {}
          }
        >
          {t.available ? "Book Appointment" : "Currently Unavailable"}
        </button>
      </div>
    </div>
  );
}

export default function FindTherapist() {
  const { therapists } = useFindHelp();
  const [city, setCity] = useState("All Cities");
  const [mode, setMode] = useState("All Modes");
  const [spec, setSpec] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return therapists.filter((t) => {
      if (city !== "All Cities" && t.city !== city) return false;
      if (mode !== "All Modes" && !t.mode.includes(mode)) return false;
      if (spec !== "All" && t.specialization !== spec) return false;
      if (search && !t.name.toLowerCase().includes(search.toLowerCase()))
        return false;
      return true;
    });
  }, [therapists, city, mode, spec, search]);

  const reset = () => {
    setCity("All Cities");
    setMode("All Modes");
    setSpec("All");
    setSearch("");
  };

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
          <span className="text-[#1F2933] font-medium">Find a Therapist</span>
        </nav>
      </div>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 pb-8">
        <div
          className="rounded-2xl p-8 md:p-12 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #1F2933 0%, #334155 100%)",
          }}
        >
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              <span className="material-icons-round text-sm">verified</span>
              Verified Professionals
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-3">
              Find a Therapist
            </h1>
            <p className="text-white/70 text-base md:text-lg max-w-xl">
              Connect with licensed mental health professionals across India —
              online or in-person.
            </p>
            <p className="text-[#22B1D4] font-semibold mt-2">
              {therapists.length} professionals available
            </p>
          </div>
          <div className="absolute top-0 right-0 w-56 h-56 rounded-full bg-[#22B1D4]/10 -translate-y-1/3 translate-x-1/4 pointer-events-none" />
          <div className="absolute bottom-0 right-24 w-32 h-32 rounded-full bg-white/5 translate-y-1/2 pointer-events-none" />
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
              active: true,
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

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-6 mb-8">
        <div
          className="bg-white rounded-2xl border border-[#E8F4F8] p-5"
          style={{ boxShadow: "0 2px 12px rgba(34,177,212,0.06)" }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search */}
            <div className="relative">
              <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA5B1] text-lg">
                search
              </span>
              <input
                type="text"
                placeholder="Search by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#D9E2EC] text-sm text-[#1F2933] placeholder-[#9AA5B1] focus:outline-none focus:ring-2 focus:ring-[#22B1D4]/30 focus:border-[#22B1D4] transition"
              />
            </div>

            {/* City */}
            <div className="relative">
              <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA5B1] text-lg">
                location_on
              </span>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#D9E2EC] text-sm text-[#1F2933] bg-white focus:outline-none focus:ring-2 focus:ring-[#22B1D4]/30 focus:border-[#22B1D4] transition appearance-none"
              >
                {CITIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Mode */}
            <div className="relative">
              <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA5B1] text-lg">
                videocam
              </span>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#D9E2EC] text-sm text-[#1F2933] bg-white focus:outline-none focus:ring-2 focus:ring-[#22B1D4]/30 focus:border-[#22B1D4] transition appearance-none"
              >
                {MODES.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Specialization */}
            <div className="relative">
              <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA5B1] text-lg">
                psychology
              </span>
              <select
                value={spec}
                onChange={(e) => setSpec(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#D9E2EC] text-sm text-[#1F2933] bg-white focus:outline-none focus:ring-2 focus:ring-[#22B1D4]/30 focus:border-[#22B1D4] transition appearance-none"
              >
                {SPECIALIZATIONS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-[#9AA5B1]">
              <span className="font-semibold text-[#1F2933]">
                {filtered.length}
              </span>{" "}
              / {therapists.length} results
            </p>
            <button
              onClick={reset}
              className="flex items-center gap-1.5 text-sm text-[#52606D] hover:text-[#E03E3E] transition-colors font-medium"
            >
              <span className="material-icons-round text-base">
                restart_alt
              </span>
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <span className="material-icons-round text-5xl text-[#D9E2EC] mb-3 block">
              person_search
            </span>
            <p className="text-[#9AA5B1] font-medium">
              No therapists match your filters.
            </p>
            <button
              onClick={reset}
              className="mt-3 text-[#22B1D4] font-semibold hover:underline text-sm"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((t) => (
              <TherapistCard key={t.id} t={t} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
