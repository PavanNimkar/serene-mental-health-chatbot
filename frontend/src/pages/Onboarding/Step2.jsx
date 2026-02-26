import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const topics = [
  { id: "anxiety", icon: "air", label: "Anxiety & Worry" },
  { id: "mood", icon: "mood", label: "Mood & Depression" },
  { id: "stress", icon: "psychology", label: "Stress Management" },
  { id: "relationships", icon: "people", label: "Relationships" },
  { id: "sleep", icon: "bedtime", label: "Sleep & Rest" },
  { id: "explore", icon: "explore", label: "Just Exploring" },
];

export default function Step2() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);

  const toggle = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-sm border border-[#D9E2EC]">
        <div className="flex items-center justify-center mb-8">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="../../logo.png" alt="serene" className="w-20" />
          </Link>
        </div>
        <h2 className="text-2xl font-serif font-bold text-[#1F2933] text-center mb-2">
          What brings you here?
        </h2>
        <p className="text-[#52606D] text-center mb-8">
          Select all that apply. You can always change this later.
        </p>

        <div className="grid grid-cols-2 gap-3 mb-8">
          {topics.map((t) => (
            <button
              key={t.id}
              onClick={() => toggle(t.id)}
              className={`relative flex flex-col items-center gap-3 p-5 rounded-2xl border-2 text-center transition-all ${
                selected.includes(t.id)
                  ? "border-[#22B1D4] bg-[#E8F8FC]"
                  : "border-[#D9E2EC] bg-white hover:border-[#22B1D4]/40"
              }`}
            >
              {selected.includes(t.id) && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-[#22B1D4] rounded-full flex items-center justify-center">
                  <span className="material-icons-round text-white text-xs">
                    check
                  </span>
                </div>
              )}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: selected.includes(t.id)
                    ? "#22B1D4"
                    : "#EEF2F6",
                }}
              >
                <span
                  className="material-icons-round text-xl"
                  style={{
                    color: selected.includes(t.id) ? "white" : "#52606D",
                  }}
                >
                  {t.icon}
                </span>
              </div>
              <span className="text-sm font-bold text-[#1F2933]">
                {t.label}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all ${i <= 2 ? "w-8 bg-[#22B1D4]" : "w-2 bg-[#D9E2EC]"}`}
              ></div>
            ))}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/onboarding/1")}
              className="px-4 py-2.5 rounded-full text-[#9AA5B1] font-medium hover:bg-[#EEF2F6] transition-colors text-sm"
            >
              Back
            </button>
            <button
              onClick={() => navigate("/onboarding/3")}
              className={`px-6 py-2.5 rounded-full font-bold flex items-center gap-2 transition-all ${
                selected.length > 0
                  ? "bg-[#22B1D4] text-white hover:bg-[#189AB4]"
                  : "bg-[#EEF2F6] text-[#9AA5B1] cursor-not-allowed"
              }`}
              style={
                selected.length > 0
                  ? { boxShadow: "0 4px 14px rgba(34,177,212,0.3)" }
                  : {}
              }
              disabled={selected.length === 0}
            >
              Continue
              <span className="material-icons-round text-sm">
                arrow_forward
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
