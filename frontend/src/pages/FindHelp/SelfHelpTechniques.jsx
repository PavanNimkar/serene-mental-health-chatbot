// src/pages/FindHelp/SelfHelpTechniques.jsx
import { useState } from "react";
import AppLayout from "../../components/AppLayout";
import GlassCard from "../../components/GlassCard";

const CATEGORIES = [
  "All",
  "Breathing",
  "Mindfulness",
  "CBT",
  "Movement",
  "Sleep",
  "Journaling",
];

const TECHNIQUES = [
  {
    title: "Box Breathing",
    category: "Breathing",
    duration: "4 min",
    icon: "air",
    color: "text-[#22B1D4]",
    bg: "bg-[#E8F8FC]/60",
    desc: "A powerful technique used by Navy SEALs to manage stress. Inhale for 4 counts, hold for 4, exhale for 4, hold for 4.",
    steps: [
      "Find a comfortable seated position and close your eyes",
      "Inhale slowly through your nose for 4 counts",
      "Hold your breath for 4 counts",
      "Exhale completely through your mouth for 4 counts",
      "Hold empty for 4 counts",
      "Repeat for 4–8 cycles",
    ],
    tags: ["Anxiety", "Stress", "Focus"],
  },
  {
    title: "5-4-3-2-1 Grounding",
    category: "Mindfulness",
    duration: "5 min",
    icon: "anchor",
    color: "text-[#189AB4]",
    bg: "bg-[#E8F8FC]/40",
    desc: "A sensory grounding technique that brings you into the present moment instantly — perfect for panic attacks or overwhelming anxiety.",
    steps: [
      "Name 5 things you can see around you",
      "Notice 4 things you can physically feel (texture, temperature)",
      "Identify 3 things you can hear right now",
      "Find 2 things you can smell (or like to smell)",
      "Notice 1 thing you can taste",
      "Take 3 slow deep breaths to close",
    ],
    tags: ["Panic", "Anxiety", "Grounding"],
  },
  {
    title: "Cognitive Restructuring",
    category: "CBT",
    duration: "10 min",
    icon: "psychology",
    color: "text-[#22B1D4]",
    bg: "bg-[#E8F8FC]/60",
    desc: "Challenge and reframe negative thought patterns. Identify the thought, examine the evidence, and create a balanced alternative.",
    steps: [
      "Write down the negative automatic thought",
      "Rate how much you believe it (0–100%)",
      "List all evidence that supports this thought",
      "List all evidence that contradicts this thought",
      "Write a balanced, realistic alternative thought",
      "Re-rate belief in the original thought",
    ],
    tags: ["Depression", "Anxiety", "Negative Thinking"],
  },
  {
    title: "Progressive Muscle Relaxation",
    category: "Movement",
    duration: "15 min",
    icon: "accessibility_new",
    color: "text-[#8a4c05]",
    bg: "bg-[#ffdcc2]/30",
    desc: "Release physical tension stored in your body by systematically tensing and relaxing muscle groups from feet to face.",
    steps: [
      "Lie down in a comfortable position",
      "Start with your feet — tense them hard for 5 seconds",
      "Release suddenly and notice the relaxation for 30 seconds",
      "Move up to calves, thighs, abdomen, hands, arms, shoulders",
      "Finish with face muscles — scrunch then release",
      "Lie still for 2 minutes noticing body sensations",
    ],
    tags: ["Stress", "Sleep", "Tension"],
  },
  {
    title: "Gratitude Journaling",
    category: "Journaling",
    duration: "5 min",
    icon: "edit_note",
    color: "text-[#189AB4]",
    bg: "bg-[#E8F8FC]/40",
    desc: "Research shows writing 3 specific things you're grateful for daily rewires the brain toward positivity within 3 weeks.",
    steps: [
      "Set a consistent time each day (morning or night works best)",
      "Write 3 specific things you're genuinely grateful for",
      "For each, write WHY you're grateful — the reason matters",
      "Include at least one small, everyday thing",
      "Optionally write one person you appreciate and why",
      "Close with one positive expectation for tomorrow",
    ],
    tags: ["Depression", "Mood", "Wellbeing"],
  },
  {
    title: "Sleep Hygiene Protocol",
    category: "Sleep",
    duration: "Nightly",
    icon: "bedtime",
    color: "text-[#22B1D4]",
    bg: "bg-[#E8F8FC]/60",
    desc: "A structured evening routine that signals your brain it's time to wind down, improving both sleep quality and duration.",
    steps: [
      "Set a fixed sleep and wake time — even on weekends",
      "No screens 60 minutes before bed (use night mode if needed)",
      "Keep your room cool (18–20°C), dark, and quiet",
      "Avoid caffeine after 2pm and heavy meals within 3hrs of sleep",
      "Do 5 minutes of slow breathing or body scan before sleep",
      "If you can't sleep in 20 min, get up and do something calm",
    ],
    tags: ["Sleep", "Anxiety", "Rest"],
  },
  {
    title: "Mindful Walking",
    category: "Mindfulness",
    duration: "10 min",
    icon: "directions_walk",
    color: "text-[#8a4c05]",
    bg: "bg-[#ffdcc2]/30",
    desc: "Transform a simple walk into a meditation. Bring full attention to each step, breath, and sensation to clear mental clutter.",
    steps: [
      "Find a quiet path — indoors or outdoors, even 10 steps is enough",
      "Stand still, take 3 deep breaths, feel your feet on the ground",
      "Walk at half your normal pace",
      "Notice every sensation — the lift of your foot, the shift of weight",
      "When your mind wanders, gently return focus to your feet",
      "After 10 minutes, stand still again and notice how you feel",
    ],
    tags: ["Stress", "Focus", "Mindfulness"],
  },
  {
    title: "Emotion Regulation (TIPP)",
    category: "CBT",
    duration: "15 min",
    icon: "thermometer",
    color: "text-[#189AB4]",
    bg: "bg-[#E8F8FC]/40",
    desc: "A DBT skill for rapidly reducing intense emotional distress using Temperature, Intense exercise, Paced breathing, and Paired muscle relaxation.",
    steps: [
      "Temperature: Splash cold water on your face or hold an ice cube",
      "Intense exercise: Do 20 jumping jacks or run in place for 1 minute",
      "Paced breathing: Slow your exhale to be longer than your inhale",
      "Paired muscle relaxation: Tense muscles on inhale, relax on exhale",
      "Repeat whichever step worked best 2–3 more times",
      "Check in — rate your distress level (1–10) before and after",
    ],
    tags: ["Distress", "Emotions", "DBT"],
  },
  {
    title: "Loving-Kindness Meditation",
    category: "Mindfulness",
    duration: "10 min",
    icon: "favorite",
    color: "text-[#22B1D4]",
    bg: "bg-[#E8F8FC]/60",
    desc: "Cultivate compassion for yourself and others. Shown to reduce self-criticism, loneliness, and depressive symptoms.",
    steps: [
      "Sit comfortably, close your eyes, take 3 deep breaths",
      "Bring yourself to mind. Silently repeat: 'May I be happy. May I be healthy. May I be at peace.'",
      "Think of someone you love easily. Send them the same wishes",
      "Think of a neutral person (acquaintance). Send them the wishes",
      "Think of a difficult person. Try to send them the same",
      "Finally expand to all beings: 'May all beings be happy and free'",
    ],
    tags: ["Self-compassion", "Depression", "Loneliness"],
  },
];

function TechniqueCard({ t, onSelect }) {
  return (
    <div
      className="bg-white border border-[#E4EEF3] rounded-2xl p-5 flex flex-col gap-3 cursor-pointer hover:scale-[1.01] hover:shadow-[0_4px_16px_rgba(34,177,212,.12)] hover:border-[#D4EEF7] transition-all duration-200"
      onClick={() => onSelect(t)}
    >
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-xl ${t.bg}`}>
          <span className={`material-symbols-outlined ${t.color}`}>
            {t.icon}
          </span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] font-mono bg-[#E8F8FC] text-[#22B1D4] px-2 py-0.5 rounded-full">
            {t.category}
          </span>
          <span className="text-[10px] text-[#9AA5B1] font-mono">
            {t.duration}
          </span>
        </div>
      </div>
      <div>
        <h4 className="font-semibold text-[#1F2933] text-sm mb-1">{t.title}</h4>
        <p className="text-xs text-[#9AA5B1] leading-relaxed line-clamp-2">
          {t.desc}
        </p>
      </div>
      <div className="flex flex-wrap gap-1.5 mt-auto">
        {t.tags.map((tag) => (
          <span
            key={tag}
            className="text-[10px] font-mono bg-[#E8F8FC] text-[#22B1D4] px-2 py-0.5 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
      <button
        className={`flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-semibold transition-all ${t.bg} ${t.color} hover:opacity-80`}
      >
        <span className="material-symbols-outlined text-[15px]">
          play_arrow
        </span>
        Start Technique
      </button>
    </div>
  );
}

function TechniqueModal({ technique, onClose }) {
  const [step, setStep] = useState(0);
  if (!technique) return null;
  const done = step >= technique.steps.length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-[#E4EEF3] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#9AA5B1] hover:text-[#1F2933]"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div
          className={`w-12 h-12 rounded-2xl ${technique.bg} flex items-center justify-center mb-4`}
        >
          <span
            className={`material-symbols-outlined text-2xl ${technique.color}`}
          >
            {technique.icon}
          </span>
        </div>

        <h3 className="font-display text-xl font-bold text-[#1F2933] mb-1">
          {technique.title}
        </h3>
        <p className="text-xs text-[#9AA5B1] font-mono mb-4">
          {technique.duration} · {technique.category}
        </p>

        {/* Progress */}
        <div className="h-1 bg-[#E8F8FC] rounded-full mb-5 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${done ? 100 : (step / technique.steps.length) * 100}%`,
              background: "linear-gradient(135deg, #22B1D4, #189AB4)",
            }}
          />
        </div>

        {done ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-[#E8F8FC] flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-3xl text-[#189AB4]">
                check_circle
              </span>
            </div>
            <h4 className="font-display text-lg font-bold text-[#1F2933] mb-1">
              Well done!
            </h4>
            <p className="text-[#9AA5B1] text-sm">
              You completed {technique.title}. Take a moment to notice how you
              feel.
            </p>
            <button
              onClick={onClose}
              className="mt-4 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors"
              style={{
                background: "linear-gradient(135deg, #22B1D4, #189AB4)",
              }}
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="mb-5">
              <p className="text-[10px] font-mono text-[#9AA5B1] mb-2 uppercase tracking-widest">
                Step {step + 1} of {technique.steps.length}
              </p>
              <p className="text-[#1F2933] text-sm leading-relaxed">
                {technique.steps[step]}
              </p>
            </div>
            <div className="flex gap-3">
              {step > 0 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E4EEF3] text-[#52606D] text-sm"
                >
                  Back
                </button>
              )}
              <button
                onClick={() => setStep(step + 1)}
                className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold transition-colors"
                style={{
                  background: "linear-gradient(135deg, #22B1D4, #189AB4)",
                }}
              >
                {step === technique.steps.length - 1 ? "Complete" : "Next Step"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function SelfHelpTechniques() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedTechnique, setSelectedTechnique] = useState(null);

  const filtered =
    activeCategory === "All"
      ? TECHNIQUES
      : TECHNIQUES.filter((t) => t.category === activeCategory);

  return (
    <AppLayout
      title="Self-Help Techniques"
      subtitle="Evidence-based tools you can use right now"
    >
      <div className="space-y-5">
        {/* Intro Banner */}
        <div className="bg-white border border-[#D4EEF7] rounded-2xl p-5 flex gap-4 items-center">
          <div className="w-12 h-12 rounded-full bg-[#E8F8FC] flex items-center justify-center shrink-0 animate-breathe">
            <span className="material-symbols-outlined text-2xl text-[#22B1D4]">
              self_improvement
            </span>
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-[#1F2933]">
              Science-backed techniques
            </h3>
            <p className="text-sm text-[#9AA5B1] leading-relaxed">
              All techniques here are drawn from CBT, DBT, mindfulness research,
              and clinical psychology. Click any card to follow a guided
              step-by-step session.
            </p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all ${
                activeCategory === cat
                  ? "text-white shadow-md shadow-[#22B1D4]/20"
                  : "bg-white border border-[#E4EEF3] text-[#52606D] hover:text-[#22B1D4] hover:border-[#D4EEF7]"
              }`}
              style={
                activeCategory === cat
                  ? { background: "linear-gradient(135deg, #22B1D4, #189AB4)" }
                  : {}
              }
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Technique Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((t) => (
            <TechniqueCard
              key={t.title}
              t={t}
              onSelect={setSelectedTechnique}
            />
          ))}
        </div>

        {/* Disclaimer */}
        <div className="bg-white border border-[#E4EEF3] rounded-2xl p-4 flex gap-3">
          <span className="material-symbols-outlined text-[#22B1D4] shrink-0">
            info
          </span>
          <p className="text-xs text-[#9AA5B1] leading-relaxed">
            These techniques are educational and complementary — they are not a
            replacement for professional mental health treatment. If you are in
            crisis, please visit the Crisis Helplines page.
          </p>
        </div>
      </div>

      {/* Modal */}
      {selectedTechnique && (
        <TechniqueModal
          technique={selectedTechnique}
          onClose={() => setSelectedTechnique(null)}
        />
      )}
    </AppLayout>
  );
}
