// src/pages/Onboarding/OnboardingFlow.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../services/api";

/* ─── Step data ─────────────────────────────────────────────────────────────── */
const WELLNESS_FOCUSES = [
  { value: "anxiety", label: "Anxiety Relief", icon: "spa", color: "secondary" },
  { value: "focus", label: "Better Focus", icon: "center_focus_strong", color: "primary" },
  { value: "mood", label: "Mood Improvement", icon: "mood", color: "tertiary" },
  { value: "sleep", label: "Better Sleep", icon: "bedtime", color: "secondary" },
  { value: "stress", label: "Stress Management", icon: "self_improvement", color: "primary" },
  { value: "relationships", label: "Relationships", icon: "favorite", color: "tertiary" },
];

const MOOD_EMOJIS = [
  { value: "great", emoji: "😊", label: "Great", score: 9 },
  { value: "good", emoji: "🙂", label: "Good", score: 7 },
  { value: "okay", emoji: "😐", label: "Okay", score: 5 },
  { value: "low", emoji: "😔", label: "Low", score: 3 },
  { value: "bad", emoji: "😞", label: "Bad", score: 1 },
];

const CONCERNS = [
  { value: "depression", label: "Depression" },
  { value: "anxiety_disorder", label: "Anxiety Disorder" },
  { value: "ptsd", label: "PTSD / Trauma" },
  { value: "ocd", label: "OCD" },
  { value: "bipolar", label: "Bipolar Disorder" },
  { value: "eating_disorder", label: "Eating Disorder" },
  { value: "adhd", label: "ADHD" },
  { value: "grief", label: "Grief / Loss" },
  { value: "none", label: "None of the above" },
];

const CHAT_STYLES = [
  { value: "supportive", label: "Supportive & Warm", desc: "Gentle, encouraging conversations", icon: "favorite" },
  { value: "cbt", label: "CBT Techniques", desc: "Structured cognitive-behavioral approach", icon: "psychology" },
  { value: "mindfulness", label: "Mindfulness-Based", desc: "Present-moment awareness practices", icon: "self_improvement" },
  { value: "direct", label: "Direct & Practical", desc: "Actionable, no-fluff guidance", icon: "bolt" },
];

/* ─── Progress bar ───────────────────────────────────────────────────────────── */
function ProgressBar({ step, total = 4 }) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-mono tracking-widest uppercase text-[#787586]">
          Step 0{step} / 0{total}
        </span>
        <span className="text-xs font-mono text-[#5742d3]">{(step / total) * 100}% Complete</span>
      </div>
      <div className="h-1 w-full bg-[#e7eeff] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#5742d3] rounded-full transition-all duration-500"
          style={{ width: `${(step / total) * 100}%` }}
        />
      </div>
    </div>
  );
}

/* ─── Step 1: Basics ─────────────────────────────────────────────────────────── */
function Step1({ data, setData }) {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-[#111c2d]">
          Welcome to your sanctuary.
        </h2>
        <p className="text-[#474554]">Let's begin by tailoring the experience to your unique needs.</p>
      </header>

      {/* Name */}
      <div className="space-y-2">
        <label className="text-xs font-mono tracking-widest uppercase text-[#787586]">
          What should we call you?
        </label>
        <input
          value={data.name || ""}
          onChange={(e) => setData({ ...data, name: e.target.value })}
          placeholder="Enter your name"
          className="w-full bg-transparent border-0 border-b-2 border-[#c8c4d7] focus:border-[#5742d3] px-1 py-3 text-xl text-[#111c2d] outline-none transition-colors placeholder:text-[#c8c4d7]"
        />
      </div>

      {/* Disclaimer */}
      <div className="bg-[#e7eeff] rounded-xl p-4 flex gap-3">
        <span className="material-symbols-outlined text-[#5742d3] shrink-0 mt-0.5">info</span>
        <div className="text-sm text-[#474554] leading-relaxed">
          <strong className="text-[#5742d3]">Important:</strong> Serene is an AI wellness companion,
          not a substitute for professional mental health care. In a crisis, please contact emergency
          services or a crisis helpline.
        </div>
      </div>

      {/* Wellness focus */}
      <div className="space-y-3">
        <label className="text-xs font-mono tracking-widest uppercase text-[#787586]">
          What is your primary wellness focus?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {WELLNESS_FOCUSES.map((f) => (
            <label key={f.value} className="cursor-pointer">
              <input
                type="radio"
                name="focus"
                value={f.value}
                checked={data.wellness_focus === f.value}
                onChange={() => setData({ ...data, wellness_focus: f.value })}
                className="sr-only"
              />
              <div
                className={`glass-card flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 hover:scale-[1.01] ${
                  data.wellness_focus === f.value
                    ? "border-[#5742d3] bg-[#5742d3]/5 shadow-md shadow-[#5742d3]/10"
                    : "border-white/20 hover:bg-white/80"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center ${
                    f.color === "primary"
                      ? "bg-[#e4dfff] text-[#5742d3]"
                      : f.color === "secondary"
                      ? "bg-[#75f9d3]/30 text-[#006b56]"
                      : "bg-[#ffdcc2]/40 text-[#8a4c05]"
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{f.icon}</span>
                </div>
                <span className="font-medium text-[#111c2d] text-sm">{f.label}</span>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Step 2: Mood snapshot ───────────────────────────────────────────────────── */
function Step2({ data, setData }) {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-[#111c2d]">
          How are you feeling today?
        </h2>
        <p className="text-[#474554]">This helps us personalise your first session.</p>
      </header>

      {/* Mood selector */}
      <div className="flex flex-wrap gap-3 justify-center py-4">
        {MOOD_EMOJIS.map((m) => (
          <button
            key={m.value}
            onClick={() => setData({ ...data, initial_mood: m.value, initial_mood_score: m.score })}
            className={`flex flex-col items-center gap-2 px-6 py-4 rounded-2xl transition-all duration-200 border ${
              data.initial_mood === m.value
                ? "bg-[#5742d3] border-[#5742d3] text-white scale-105 shadow-lg shadow-[#5742d3]/20"
                : "glass-card border-white/20 text-[#474554] hover:scale-105"
            }`}
          >
            <span className="text-3xl">{m.emoji}</span>
            <span className="text-xs font-mono tracking-wide">{m.label}</span>
          </button>
        ))}
      </div>

      {/* Note */}
      <div className="space-y-2">
        <label className="text-xs font-mono tracking-widest uppercase text-[#787586]">
          Anything you'd like to share? (optional)
        </label>
        <textarea
          value={data.initial_note || ""}
          onChange={(e) => setData({ ...data, initial_note: e.target.value })}
          placeholder="How's your day going so far…"
          rows={3}
          className="w-full bg-transparent border-0 border-b-2 border-[#c8c4d7] focus:border-[#5742d3] px-1 py-3 text-[#111c2d] outline-none transition-colors resize-none placeholder:text-[#c8c4d7] text-sm"
        />
      </div>

      {/* Info card */}
      <div className="glass-card rounded-xl p-4 flex gap-3 border border-[#75f9d3]/30">
        <span className="material-symbols-outlined text-[#006b56] shrink-0">eco</span>
        <p className="text-sm text-[#474554]">
          Tracking your mood daily helps identify patterns and triggers. You can update it anytime
          from your dashboard.
        </p>
      </div>
    </div>
  );
}

/* ─── Step 3: Concerns + screening ───────────────────────────────────────────── */
function Step3({ data, setData }) {
  const toggle = (val) => {
    const current = data.concerns || [];
    if (val === "none") {
      setData({ ...data, concerns: ["none"] });
      return;
    }
    const filtered = current.filter((c) => c !== "none");
    setData({
      ...data,
      concerns: filtered.includes(val)
        ? filtered.filter((c) => c !== val)
        : [...filtered, val],
    });
  };

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-[#111c2d]">
          What brings you here?
        </h2>
        <p className="text-[#474554]">Select all that apply. This stays completely private.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {CONCERNS.map((c) => {
          const selected = (data.concerns || []).includes(c.value);
          return (
            <button
              key={c.value}
              onClick={() => toggle(c.value)}
              className={`text-left px-4 py-3 rounded-xl text-sm font-medium border transition-all duration-200 ${
                selected
                  ? "bg-[#5742d3] text-white border-[#5742d3] shadow-md shadow-[#5742d3]/15"
                  : "glass-card border-white/20 text-[#474554] hover:border-[#5742d3]/30 hover:bg-white/80"
              }`}
            >
              <div className="flex items-center gap-2">
                {selected && <span className="material-symbols-outlined text-[16px]">check</span>}
                {c.label}
              </div>
            </button>
          );
        })}
      </div>

      <div className="bg-[#ffdad6]/40 rounded-xl p-4 flex gap-3">
        <span className="material-symbols-outlined text-[#ba1a1a] shrink-0">shield</span>
        <p className="text-sm text-[#474554]">
          Your responses help Serene personalise support. We never share this data with third parties.
        </p>
      </div>
    </div>
  );
}

/* ─── Step 4: Style + safety ─────────────────────────────────────────────────── */
function Step4({ data, setData }) {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-[#111c2d]">
          How should Serene talk to you?
        </h2>
        <p className="text-[#474554]">Choose a conversation style that resonates with you.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CHAT_STYLES.map((s) => (
          <label key={s.value} className="cursor-pointer">
            <input
              type="radio"
              name="chat_style"
              value={s.value}
              checked={data.chat_style === s.value}
              onChange={() => setData({ ...data, chat_style: s.value })}
              className="sr-only"
            />
            <div
              className={`glass-card flex gap-3 p-4 rounded-xl border transition-all duration-200 hover:scale-[1.01] ${
                data.chat_style === s.value
                  ? "border-[#5742d3] bg-[#5742d3]/5 shadow-md shadow-[#5742d3]/10"
                  : "border-white/20 hover:bg-white/80"
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-[#e4dfff] text-[#5742d3] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">{s.icon}</span>
              </div>
              <div>
                <p className="font-semibold text-[#111c2d] text-sm">{s.label}</p>
                <p className="text-xs text-[#787586] mt-0.5">{s.desc}</p>
              </div>
            </div>
          </label>
        ))}
      </div>

      {/* Safety check */}
      <div className="space-y-2">
        <label className="text-xs font-mono tracking-widest uppercase text-[#787586]">
          Safety Check
        </label>
        <p className="text-sm text-[#474554] mb-3">
          Are you currently having thoughts of harming yourself?
        </p>
        <div className="flex gap-3">
          {["no", "yes"].map((v) => (
            <button
              key={v}
              onClick={() => setData({ ...data, safety_status: v })}
              className={`flex-1 py-3 rounded-xl font-medium text-sm border transition-all ${
                data.safety_status === v
                  ? v === "no"
                    ? "bg-[#006b56] text-white border-[#006b56]"
                    : "bg-[#ba1a1a] text-white border-[#ba1a1a]"
                  : "glass-card border-white/20 text-[#474554] hover:bg-white/80"
              }`}
            >
              {v === "no" ? "No, I'm safe" : "Yes, I need help"}
            </button>
          ))}
        </div>
        {data.safety_status === "yes" && (
          <div className="bg-[#ffdad6] rounded-xl p-4 mt-2">
            <p className="text-[#93000a] text-sm font-semibold mb-1">
              You're not alone. Help is available right now.
            </p>
            <p className="text-[#93000a] text-sm">
              Please call{" "}
              <a href="tel:+911800599059" className="font-bold underline">
                iCall: 9152987821
              </a>{" "}
              or{" "}
              <a href="tel:112" className="font-bold underline">
                Emergency: 112
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Main flow ───────────────────────────────────────────────────────────────── */
export default function OnboardingFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    name: "",
    wellness_focus: "",
    initial_mood: "",
    initial_mood_score: null,
    initial_note: "",
    concerns: [],
    chat_style: "",
    safety_status: "no",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canProceed = () => {
    if (step === 1) return data.name.trim() && data.wellness_focus;
    if (step === 2) return data.initial_mood;
    if (step === 3) return (data.concerns || []).length > 0;
    if (step === 4) return data.chat_style && data.safety_status;
    return true;
  };

  const next = async () => {
    setError("");
    setLoading(true);
    try {
      let payload = {};
      if (step === 1)
        payload = { first_name: data.name, wellness_focus: data.wellness_focus, disclaimer_accepted: true };
      if (step === 2)
        payload = { initial_mood: data.initial_mood, initial_mood_score: data.initial_mood_score, initial_note: data.initial_note };
      if (step === 3)
        payload = { concerns: data.concerns };
      if (step === 4) {
        payload = { chat_style: data.chat_style, safety_status: data.safety_status };
        const res = await auth.onboarding(4, payload);
        if (res.safety_alert) {
          // Crisis — stay with message visible
        }
        navigate("/chat");
        return;
      }
      await auth.onboarding(step, payload);
      setStep(step + 1);
    } catch (err) {
      setError(err?.detail || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9ff] relative overflow-hidden flex items-center justify-center px-5 py-10">
      {/* Orbs */}
      <div className="orb w-[400px] h-[400px] bg-[#5742d3]/12 -top-24 -right-24" />
      <div className="orb w-[500px] h-[500px] bg-[#006b56]/8 -bottom-36 -left-36" />
      <div className="orb w-[300px] h-[300px] bg-[#8a4c05]/6 top-[40%] left-[20%]" />

      <div className="relative z-10 w-full max-w-2xl">
        {/* Brand */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Serene" className="w-8 h-8 object-contain" />
            <h1 className="font-display text-2xl font-bold text-[#5742d3]">Serene</h1>
          </div>
        </div>

        {/* Card */}
        <div className="glass-card rounded-3xl p-6 md:p-10 shadow-xl border border-white/40">
          <ProgressBar step={step} />

          {step === 1 && <Step1 data={data} setData={setData} />}
          {step === 2 && <Step2 data={data} setData={setData} />}
          {step === 3 && <Step3 data={data} setData={setData} />}
          {step === 4 && <Step4 data={data} setData={setData} />}

          {error && (
            <div className="mt-4 bg-[#ffdad6] text-[#93000a] text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between mt-8">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-[#474554] hover:bg-[#e7eeff] transition-all text-sm font-medium"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                Back
              </button>
            ) : (
              <div />
            )}
            <button
              onClick={next}
              disabled={!canProceed() || loading}
              className="flex items-center gap-2 bg-[#5742d3] hover:bg-[#4126bd] text-white px-7 py-3 rounded-xl font-semibold shadow-lg shadow-[#5742d3]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? "Saving…" : step === 4 ? "Start My Journey" : "Continue"}
              {!loading && <span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
