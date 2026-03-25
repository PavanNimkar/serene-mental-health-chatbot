import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../services/api";

const moodOptions = [
  { value: "good", emoji: "😊", label: "Good", color: "#10B981", bg: "#D1FAE5", border: "#10B981" },
  { value: "okay", emoji: "😐", label: "Okay", color: "#22B1D4", bg: "#E8F8FC", border: "#22B1D4" },
  { value: "low", emoji: "😔", label: "Low", color: "#6366F1", bg: "#EEF2FF", border: "#6366F1" },
  { value: "anxious", emoji: "😣", label: "Anxious", color: "#F59E0B", bg: "#FEF3C7", border: "#F59E0B" },
  { value: "stressed", emoji: "😡", label: "Stressed", color: "#EF4444", bg: "#FEE2E2", border: "#EF4444" },
];

export default function Step2() {
  const navigate = useNavigate();
  const [mood, setMood] = useState("");
  const [score, setScore] = useState(5);
  const [trackDaily, setTrackDaily] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const canContinue = mood !== "";

  const handleContinue = async () => {
    if (!canContinue) return;
    setSaving(true);
    setError("");
    try {
      await auth.onboarding(2, {
        initial_mood: mood,
        initial_mood_score: score,
        track_daily_mood: trackDaily,
      });
      navigate("/onboarding/3");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const selectedMood = moodOptions.find((m) => m.value === mood);

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
            <span className="material-icons-round text-[#22B1D4] text-xl">mood</span>
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold text-[#1F2933] leading-tight">
              How are you feeling today?
            </h2>
            <p className="text-xs text-[#9AA5B1]">Your emotional snapshot</p>
          </div>
        </div>

        <p className="text-sm text-[#52606D] mb-6">
          There's no right or wrong answer. Be honest with yourself.
        </p>

        {/* Mood selector */}
        <div className="grid grid-cols-5 gap-2 mb-6">
          {moodOptions.map((m) => {
            const active = mood === m.value;
            return (
              <button
                key={m.value}
                onClick={() => setMood(m.value)}
                className="flex flex-col items-center gap-1.5 py-3.5 rounded-2xl border-2 transition-all"
                style={{
                  borderColor: active ? m.border : "#D9E2EC",
                  backgroundColor: active ? m.bg : "white",
                  transform: active ? "scale(1.05)" : "scale(1)",
                }}
              >
                <span className="text-2xl">{m.emoji}</span>
                <span
                  className="text-[10px] font-bold"
                  style={{ color: active ? m.color : "#9AA5B1" }}
                >
                  {m.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Mood score slider */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-bold text-[#1F2933] flex items-center gap-2">
              <span className="material-icons-round text-[#22B1D4] text-base">
                equalizer
              </span>
              Rate your mood (1 – 10)
            </label>
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-sm"
              style={{
                backgroundColor: selectedMood?.color || "#22B1D4",
              }}
            >
              {score}
            </div>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, ${selectedMood?.color || "#22B1D4"} 0%, ${selectedMood?.color || "#22B1D4"} ${(score - 1) * 11.1}%, #D9E2EC ${(score - 1) * 11.1}%, #D9E2EC 100%)`,
            }}
          />
          <div className="flex justify-between text-[10px] text-[#9AA5B1] mt-1.5">
            <span>Very low</span>
            <span>Excellent</span>
          </div>
        </div>

        {/* Daily tracking preference */}
        <div className="mb-6">
          <p className="text-sm font-bold text-[#1F2933] mb-3 flex items-center gap-2">
            <span className="material-icons-round text-[#22B1D4] text-base">
              event_repeat
            </span>
            Would you like to track your mood daily?
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setTrackDaily(true)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                trackDaily
                  ? "border-[#22B1D4] bg-[#E8F8FC] text-[#22B1D4]"
                  : "border-[#D9E2EC] text-[#52606D] hover:border-[#22B1D4]/40"
              }`}
            >
              <span className="material-icons-round text-base">
                {trackDaily ? "check_circle" : "radio_button_unchecked"}
              </span>
              Yes, remind me
            </button>
            <button
              onClick={() => setTrackDaily(false)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                !trackDaily
                  ? "border-[#22B1D4] bg-[#E8F8FC] text-[#22B1D4]"
                  : "border-[#D9E2EC] text-[#52606D] hover:border-[#22B1D4]/40"
              }`}
            >
              <span className="material-icons-round text-base">
                {!trackDaily ? "check_circle" : "radio_button_unchecked"}
              </span>
              Maybe later
            </button>
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
                  i <= 2 ? "w-8 bg-[#22B1D4]" : "w-2 bg-[#D9E2EC]"
                }`}
              />
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
              onClick={handleContinue}
              disabled={!canContinue || saving}
              className={`px-6 py-2.5 rounded-full font-bold flex items-center gap-2 transition-all text-sm ${
                canContinue && !saving
                  ? "bg-[#22B1D4] text-white hover:bg-[#189AB4]"
                  : "bg-[#EEF2F6] text-[#9AA5B1] cursor-not-allowed"
              }`}
              style={
                canContinue && !saving
                  ? { boxShadow: "0 4px 14px rgba(34,177,212,0.3)" }
                  : {}
              }
            >
              {saving ? (
                <>
                  <span className="material-icons-round text-sm animate-spin">
                    refresh
                  </span>
                  Saving…
                </>
              ) : (
                <>
                  Continue
                  <span className="material-icons-round text-sm">
                    arrow_forward
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
