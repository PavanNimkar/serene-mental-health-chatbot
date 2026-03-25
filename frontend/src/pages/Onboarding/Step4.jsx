import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../services/api";

const chatStyles = [
  {
    id: "supportive",
    icon: "favorite",
    label: "Supportive",
    desc: "Warm validation and emotional support",
  },
  {
    id: "advice",
    icon: "lightbulb",
    label: "Advice-based",
    desc: "Practical guidance and solutions",
  },
  {
    id: "motivational",
    icon: "bolt",
    label: "Motivational",
    desc: "Encourage and push you forward",
  },
  {
    id: "just_listen",
    icon: "hearing",
    label: "Just listen",
    desc: "No advice — just a compassionate ear",
  },
];

const safetyOptions = [
  {
    value: "no",
    icon: "check_circle",
    label: "No",
    color: "#10B981",
    bg: "#D1FAE5",
    border: "#10B981",
  },
  {
    value: "sometimes",
    icon: "help_outline",
    label: "Sometimes",
    color: "#F59E0B",
    bg: "#FEF3C7",
    border: "#F59E0B",
  },
  {
    value: "yes",
    icon: "warning_amber",
    label: "Yes",
    color: "#EF4444",
    bg: "#FEE2E2",
    border: "#EF4444",
  },
];

export default function Step4() {
  const navigate = useNavigate();
  const [chatStyle, setChatStyle] = useState("");
  const [safetyStatus, setSafetyStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const canContinue = chatStyle && safetyStatus;
  const showCrisisAlert = safetyStatus === "yes" || safetyStatus === "sometimes";

  const handleFinish = async () => {
    if (!canContinue) return;
    setSaving(true);
    setError("");
    try {
      await auth.onboarding(4, {
        chat_style: chatStyle,
        safety_status: safetyStatus,
      });
      setDone(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ── Success screen ─────────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] font-sans flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-3xl p-10 shadow-sm border border-[#D9E2EC] text-center">
          <div
            className="w-20 h-20 mx-auto rounded-full bg-[#E8F8FC] flex items-center justify-center mb-6"
            style={{ boxShadow: "0 0 0 12px rgba(34,177,212,0.08)" }}
          >
            <span className="material-icons-round text-[#22B1D4] text-4xl">
              spa
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#1F2933] mb-3">
            You're all set.
          </h2>
          <p className="text-[#52606D] leading-relaxed mb-2">
            I'm here whenever you need to talk.
          </p>
          <p className="text-sm text-[#9AA5B1] mb-8">
            Your safe space, available 24 / 7.
          </p>

          {showCrisisAlert && (
            <div className="bg-[#FEF3C7] border border-[#F59E0B]/40 rounded-2xl p-4 mb-6 text-left">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-icons-round text-[#F59E0B] text-base">
                  support_agent
                </span>
                <p className="text-sm font-bold text-[#92400E]">
                  You're not alone — help is available
                </p>
              </div>
              <div className="space-y-1 text-xs text-[#92400E]">
                <p>
                  <span className="font-bold">iCall (India):</span> 9152987821
                </p>
                <p>
                  <span className="font-bold">Vandrevala Foundation:</span>{" "}
                  1860-2662-345
                </p>
                <p>
                  <span className="font-bold">Crisis Text Line:</span> Text HOME
                  to 741741
                </p>
              </div>
            </div>
          )}

          <button
            onClick={() => navigate("/chat")}
            className="w-full bg-[#22B1D4] text-white py-3.5 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-[#189AB4] transition-colors"
            style={{ boxShadow: "0 4px 20px rgba(34,177,212,0.35)" }}
          >
            <span className="material-icons-round">chat</span>
            Start chatting with Serene
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="w-full mt-3 py-3 rounded-full font-semibold text-[#52606D] hover:bg-[#EEF2F6] transition-colors text-sm flex items-center justify-center gap-2"
          >
            <span className="material-icons-round text-base">dashboard</span>
            Go to dashboard
          </button>
        </div>
      </div>
    );
  }

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
            <span className="material-icons-round text-[#22B1D4] text-xl">
              tune
            </span>
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold text-[#1F2933] leading-tight">
              Personalize your experience
            </h2>
            <p className="text-xs text-[#9AA5B1]">Almost done!</p>
          </div>
        </div>

        <p className="text-sm text-[#52606D] mb-6">
          Help me understand how you'd like me to communicate with you.
        </p>

        {/* Chat style */}
        <div className="mb-6">
          <p className="text-xs font-bold text-[#9AA5B1] uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="material-icons-round text-[#22B1D4] text-sm">
              chat_bubble_outline
            </span>
            Preferred chat style
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {chatStyles.map((s) => {
              const active = chatStyle === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setChatStyle(s.id)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 text-center transition-all ${
                    active
                      ? "border-[#22B1D4] bg-[#E8F8FC]"
                      : "border-[#D9E2EC] bg-white hover:border-[#22B1D4]/40"
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: active ? "#22B1D4" : "#EEF2F6" }}
                  >
                    <span
                      className="material-icons-round text-lg"
                      style={{ color: active ? "white" : "#52606D" }}
                    >
                      {s.icon}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1F2933]">
                      {s.label}
                    </p>
                    <p className="text-[10px] text-[#9AA5B1] leading-tight mt-0.5">
                      {s.desc}
                    </p>
                  </div>
                  {active && (
                    <span className="material-icons-round text-[#22B1D4] text-sm">
                      check_circle
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Safety question */}
        <div className="mb-6">
          <div className="bg-[#F8FAFC] border border-[#D9E2EC] rounded-2xl p-4">
            <p className="text-xs font-bold text-[#9AA5B1] uppercase tracking-widest mb-1 flex items-center gap-2">
              <span className="material-icons-round text-[#22B1D4] text-sm">
                shield
              </span>
              Safety check — gentle question
            </p>
            <p className="text-sm font-semibold text-[#1F2933] mb-3">
              Have you recently had thoughts of harming yourself?
            </p>
            <div className="flex gap-2">
              {safetyOptions.map((o) => {
                const active = safetyStatus === o.value;
                return (
                  <button
                    key={o.value}
                    onClick={() => setSafetyStatus(o.value)}
                    className="flex-1 flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 transition-all"
                    style={{
                      borderColor: active ? o.border : "#D9E2EC",
                      backgroundColor: active ? o.bg : "white",
                    }}
                  >
                    <span
                      className="material-icons-round text-lg"
                      style={{ color: active ? o.color : "#9AA5B1" }}
                    >
                      {o.icon}
                    </span>
                    <span
                      className="text-xs font-bold"
                      style={{ color: active ? o.color : "#9AA5B1" }}
                    >
                      {o.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Crisis resources inline */}
            {showCrisisAlert && (
              <div className="mt-3 p-3 bg-[#FEF3C7] rounded-xl border border-[#F59E0B]/30">
                <p className="text-xs font-bold text-[#92400E] mb-1 flex items-center gap-1.5">
                  <span className="material-icons-round text-[#F59E0B] text-sm">
                    favorite
                  </span>
                  You matter. Please reach out:
                </p>
                <div className="text-[11px] text-[#92400E] space-y-0.5">
                  <p>
                    📞 iCall:{" "}
                    <span className="font-bold">9152987821</span>
                  </p>
                  <p>
                    📞 Vandrevala Foundation:{" "}
                    <span className="font-bold">1860-2662-345</span>
                  </p>
                </div>
              </div>
            )}
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
                className="h-2 w-8 rounded-full bg-[#22B1D4]"
              />
            ))}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/onboarding/3")}
              className="px-4 py-2.5 rounded-full text-[#9AA5B1] font-medium hover:bg-[#EEF2F6] transition-colors text-sm"
            >
              Back
            </button>
            <button
              onClick={handleFinish}
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
                  Finishing…
                </>
              ) : (
                <>
                  Finish
                  <span className="material-icons-round text-sm">
                    check
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
