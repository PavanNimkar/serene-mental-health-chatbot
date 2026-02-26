import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Step1() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [style, setStyle] = useState("");

  const styles = [
    {
      id: "gentle",
      icon: "favorite",
      label: "Gentle & Nurturing",
      desc: "Warm, supportive, validating",
    },
    {
      id: "direct",
      icon: "bolt",
      label: "Direct & Actionable",
      desc: "Practical, goal-focused, clear",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-sm border border-[#D9E2EC]">
        <Link to="/" className="flex items-center justify-center gap-2.5">
          <img src="../../logo.png" alt="serene" className="w-20" />
        </Link>
        <h2 className="text-2xl font-serif font-bold text-[#1F2933] text-center mb-2">
          Welcome to Serene
        </h2>
        <p className="text-[#52606D] text-center mb-8">
          Let's personalize your experience.
        </p>

        <div className="mb-6">
          <label className="block text-sm font-bold text-[#1F2933] mb-2">
            What's your name?
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your first name"
            className="w-full bg-[#F8FAFC] border border-[#D9E2EC] rounded-xl px-4 py-3 text-[#1F2933] focus:outline-none focus:ring-2 focus:ring-[#22B1D4] transition-all"
          />
        </div>

        <div className="mb-8">
          <label className="block text-sm font-bold text-[#1F2933] mb-3">
            Choose your companion style
          </label>
          <div className="space-y-3">
            {styles.map((s) => (
              <button
                key={s.id}
                onClick={() => setStyle(s.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                  style === s.id
                    ? "border-[#22B1D4] bg-[#E8F8FC]"
                    : "border-[#D9E2EC] bg-white hover:border-[#22B1D4]/40"
                }`}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: style === s.id ? "#22B1D4" : "#EEF2F6",
                  }}
                >
                  <span
                    className="material-icons-round"
                    style={{ color: style === s.id ? "white" : "#52606D" }}
                  >
                    {s.icon}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-[#1F2933]">{s.label}</p>
                  <p className="text-sm text-[#9AA5B1]">{s.desc}</p>
                </div>
                {style === s.id && (
                  <span className="material-icons-round text-[#22B1D4]">
                    check_circle
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all ${i === 1 ? "w-8 bg-[#22B1D4]" : "w-2 bg-[#D9E2EC]"}`}
              ></div>
            ))}
          </div>
          <button
            onClick={() => navigate("/onboarding/2")}
            disabled={!name.trim() || !style}
            className={`px-6 py-2.5 rounded-full font-bold flex items-center gap-2 transition-all ${
              name.trim() && style
                ? "bg-[#22B1D4] text-white hover:bg-[#189AB4]"
                : "bg-[#EEF2F6] text-[#9AA5B1] cursor-not-allowed"
            }`}
            style={
              name.trim() && style
                ? { boxShadow: "0 4px 14px rgba(34,177,212,0.3)" }
                : {}
            }
          >
            Continue
            <span className="material-icons-round text-sm">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}
