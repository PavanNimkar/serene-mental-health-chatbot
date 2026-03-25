import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../services/api";

const concerns = [
  { id: "anxiety", icon: "air", label: "Anxiety" },
  { id: "depression", icon: "mood_bad", label: "Depression" },
  { id: "stress", icon: "psychology", label: "Stress" },
  { id: "sleep", icon: "bedtime", label: "Sleep" },
  { id: "overthinking", icon: "bubble_chart", label: "Overthinking" },
  { id: "loneliness", icon: "person_off", label: "Loneliness" },
  { id: "work_study", icon: "school", label: "Work / Study" },
];

const freqOptions = [
  { value: "not_at_all", label: "Not at all" },
  { value: "several_days", label: "Several days" },
  { value: "nearly_every_day", label: "Nearly every day" },
];

export default function Step3() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
  const [lowFreq, setLowFreq] = useState("");
  const [anxiousFreq, setAnxiousFreq] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const toggle = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const canContinue = selected.length > 0 && lowFreq && anxiousFreq;

  const handleContinue = async () => {
    if (!canContinue) return;
    setSaving(true);
    setError("");
    try {
      await auth.onboarding(3, {
        primary_concerns: selected,
        low_frequency: lowFreq,
        anxious_frequency: anxiousFreq,
      });
      navigate("/onboarding/4");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-sm border border-[#D9E2EC]">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center mb-6">
          <img src="../../logo.png" alt="serene" className="w-16" />
        </Link>

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-[#E8F8FC] flex items-center justify-center">
            <span className="material-icons-round text-[#22B1D4] text-xl">psychology</span>
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold text-[#1F2933] leading-tight">
              What's on your mind?
            </h2>
            <p className="text-xs text-[#9AA5B1]">Select all that apply</p>
          </div>
        </div>

        <p className="text-sm text-[#52606D] mb-6">
          Understanding your concerns helps me support you better.
        </p>

        {/* Concern chips */}
        <div className="grid grid-cols-2 gap-2.5 mb-7">
          {concerns.map((c) => {
            const active = selected.includes(c.id);
            return (
              <button
                key={c.id}
                onClick={() => toggle(c.id)}
                className={`relative flex items-center gap-3 p-3.5 rounded-2xl border-2 text-left transition-all ${
                  active
                    ? "border-[#22B1D4] bg-[#E8F8FC]"
                    : "border-[#D9E2EC] bg-white hover:border-[#22B1D4]/40"
                }`}
              >
                {active && (
                  <div className="absolute top-2 right-2 w-4 h-4 bg-[#22B1D4] rounded-full flex items-center justify-center">
                    <span className="material-icons-round text-white text-[10px]">check</span>
                  </div>
                )}
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: active ? "#22B1D4" : "#EEF2F6" }}
                >
                  <span
                    className="material-icons-round text-lg"
                    style={{ color: active ? "white" : "#52606D" }}
                  >
                    {c.icon}
                  </span>
                </div>
                <span className="text-sm font-bold text-[#1F2933]">{c.label}</span>
              </button>
            );
          })}
        </div>

        {/* Screening questions */}
        <div className="space-y-5 mb-7">
          <p className="text-xs font-bold text-[#9AA5B1] uppercase tracking-widest">
            Quick check-in — past 2 weeks
          </p>

          {/* Q1 */}
          <div>
            <p className="text-sm font-semibold text-[#1F2933] mb-2.5 flex items-center gap-2">
              <span className="material-icons-round text-[#22B1D4] text-base">sentiment_very_dissatisfied</span>
              How often have you felt low or down?
            </p>
            <div className="flex flex-col gap-2">
              {freqOptions.map((o) => (
                <button
                  key={o.value}
                  onClick={() => setLowFreq(o.value)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                    lowFreq === o.value
                      ? "border-[#22B1D4] bg-[#E8F8FC] text-[#22B1D4]"
                      : "border-[#D9E2EC] text-[#52606D] hover:border-[#22B1D4]/40"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      lowFreq === o.value ? "border-[#22B1D4] bg-[#22B1D4]" : "border-[#D9E2EC]"
                    }`}
                  >
                    {lowFreq === o.value && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          {/* Q2 */}
          <div>
            <p className="text-sm font-semibold text-[#1F2933] mb-2.5 flex items-center gap-2">
              <span className="material-icons-round text-[#22B1D4] text-base">bolt</span>
              How often have you felt anxious or overwhelmed?
            </p>
            <div className="flex flex-col gap-2">
              {freqOptions.map((o) => (
                <button
                  key={o.value}
                  onClick={() => setAnxiousFreq(o.value)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                    anxiousFreq === o.value
                      ? "border-[#22B1D4] bg-[#E8F8FC] text-[#22B1D4]"
                      : "border-[#D9E2EC] text-[#52606D] hover:border-[#22B1D4]/40"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      anxiousFreq === o.value ? "border-[#22B1D4] bg-[#22B1D4]" : "border-[#D9E2EC]"
                    }`}
                  >
                    {anxiousFreq === o.value && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <p className="text-sm text-[#EF4444] mb-4 flex items-center gap-2">
            <span className="material-icons-round text-base">error_outline</span>
            {error}
          </p>
        )}

        {/* Progress + Nav */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all ${
                  i <= 3 ? "w-8 bg-[#22B1D4]" : "w-2 bg-[#D9E2EC]"
                }`}
              />
            ))}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/onboarding/2")}
              className="px-4 py-2.5 rounded-full text-[#9AA5B1] font-medium hover:bg-[#EEF2F6] transition-colors text-sm"
            >
              Back
            </button>
            <button
              onClick={handleContinue}
              disabled={!canContinue || saving}
              className={`px-6 py-2.5 rounded-full font-bold flex items-center gap-2 transition-all text-sm ${
                canContinue && !saving
                  ? "bg-[#22B1D4] text-white hover:bg-[#189AB4]"
                  : "bg-[#EEF2F6] text-[#9AA5B1] cursor-not-allowed"
              }`}
              style={canContinue && !saving ? { boxShadow: "0 4px 14px rgba(34,177,212,0.3)" } : {}}
            >
              {saving ? (
                <>
                  <span className="material-icons-round text-sm animate-spin">refresh</span>
                  Saving…
                </>
              ) : (
                <>
                  Continue
                  <span className="material-icons-round text-sm">arrow_forward</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
