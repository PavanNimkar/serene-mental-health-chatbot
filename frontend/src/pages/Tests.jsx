// src/pages/Tests.jsx
import { useState, useEffect } from "react";
import { tests as testsApi } from "../services/api";
import AppLayout from "../components/AppLayout";
import GlassCard from "../components/GlassCard";

const TEST_TYPES = [
  {
    id: "PHQ-9",
    name: "PHQ-9",
    full: "Patient Health Questionnaire",
    desc: "Screens for depression severity",
    icon: "psychology",
    color: "text-[#5742d3]",
    bg: "bg-[#e4dfff]/40",
    questions: 9,
  },
  {
    id: "GAD-7",
    name: "GAD-7",
    full: "Generalized Anxiety Disorder",
    desc: "Assesses anxiety severity",
    icon: "monitor_heart",
    color: "text-[#006b56]",
    bg: "bg-[#75f9d3]/20",
    questions: 7,
  },
];

const ANSWER_OPTIONS = [
  { label: "Not at all", value: 0 },
  { label: "Several days", value: 1 },
  { label: "More than half the days", value: 2 },
  { label: "Nearly every day", value: 3 },
];

function SeverityBadge({ score, type }) {
  let label = "";
  let cls = "";
  if (type === "PHQ-9") {
    if (score <= 4) { label = "Minimal"; cls = "bg-[#75f9d3]/30 text-[#006b56]"; }
    else if (score <= 9) { label = "Mild"; cls = "bg-[#e4dfff]/60 text-[#5742d3]"; }
    else if (score <= 14) { label = "Moderate"; cls = "bg-[#ffdcc2]/50 text-[#8a4c05]"; }
    else { label = "Severe"; cls = "bg-[#ffdad6]/60 text-[#ba1a1a]"; }
  } else {
    if (score <= 4) { label = "Minimal"; cls = "bg-[#75f9d3]/30 text-[#006b56]"; }
    else if (score <= 9) { label = "Mild"; cls = "bg-[#e4dfff]/60 text-[#5742d3]"; }
    else if (score <= 14) { label = "Moderate"; cls = "bg-[#ffdcc2]/50 text-[#8a4c05]"; }
    else { label = "Severe"; cls = "bg-[#ffdad6]/60 text-[#ba1a1a]"; }
  }
  return (
    <span className={`text-xs font-mono px-2.5 py-1 rounded-full font-semibold ${cls}`}>{label}</span>
  );
}

export default function Tests() {
  const [activeTest, setActiveTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [latestResults, setLatestResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    testsApi.latest().then(setLatestResults).catch(console.error);
  }, []);

  const startTest = async (testId) => {
    setLoading(true);
    setResult(null);
    try {
      const q = await testsApi.questions(testId);
      setQuestions(Array.isArray(q) ? q : q.questions || []);
      setAnswers(new Array(q.length || (q.questions || []).length).fill(null));
      setActiveTest(testId);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const setAnswer = (idx, val) => {
    const a = [...answers];
    a[idx] = val;
    setAnswers(a);
  };

  const submit = async () => {
    if (answers.some((a) => a === null)) {
      alert("Please answer all questions.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await testsApi.submit({ test_type: activeTest, answers });
      setResult(res);
      testsApi.latest().then(setLatestResults);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const progress = answers.filter((a) => a !== null).length;

  return (
    <AppLayout title="Mental Health Tests" subtitle="Clinically validated self-assessments">
      {!activeTest ? (
        <div className="space-y-5">
          {/* Test cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TEST_TYPES.map((t) => {
              const lr = latestResults[t.id];
              return (
                <GlassCard key={t.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-2.5 rounded-xl ${t.bg}`}>
                      <span className={`material-symbols-outlined ${t.color}`}>{t.icon}</span>
                    </div>
                    {lr && <SeverityBadge score={lr.total_score} type={t.id} />}
                  </div>
                  <h3 className="font-display text-xl font-bold text-[#111c2d]">{t.name}</h3>
                  <p className="text-xs text-[#787586] mb-1">{t.full}</p>
                  <p className="text-sm text-[#474554] mb-4">{t.desc}</p>
                  {lr && (
                    <div className="mb-4 p-3 bg-[#f0f3ff] rounded-xl">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#787586]">Last score:</span>
                        <span className="font-mono font-bold text-[#111c2d] text-lg">{lr.total_score}</span>
                      </div>
                      <p className="text-xs text-[#787586] mt-0.5">{lr.interpretation}</p>
                    </div>
                  )}
                  <button
                    onClick={() => startTest(t.id)}
                    className="w-full py-3 rounded-xl bg-[#5742d3] text-white text-sm font-semibold hover:bg-[#4126bd] transition-colors shadow-lg shadow-[#5742d3]/15"
                  >
                    {lr ? "Retake Assessment" : "Take Assessment"}
                  </button>
                  <p className="text-center text-[10px] text-[#c8c4d7] mt-2 font-mono">
                    {t.questions} questions · ~2 minutes
                  </p>
                </GlassCard>
              );
            })}
          </div>

          {/* Disclaimer */}
          <GlassCard className="p-5 border border-[#e4dfff] bg-[#f0f3ff]/50">
            <div className="flex gap-3">
              <span className="material-symbols-outlined text-[#5742d3] shrink-0">info</span>
              <p className="text-sm text-[#474554] leading-relaxed">
                These assessments are for educational purposes only and do not constitute a clinical diagnosis.
                Always consult a qualified mental health professional for diagnosis and treatment.
              </p>
            </div>
          </GlassCard>
        </div>
      ) : result ? (
        /* Result View */
        <div className="max-w-xl mx-auto">
          <GlassCard className="p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-[#5742d3]/10 flex items-center justify-center mx-auto mb-4">
              <span className="font-mono text-3xl font-bold text-[#5742d3]">{result.total_score}</span>
            </div>
            <h3 className="font-display text-2xl font-bold text-[#111c2d] mb-1">{activeTest} Complete</h3>
            <SeverityBadge score={result.total_score} type={activeTest} />
            <p className="text-[#474554] text-sm mt-4 mb-6 leading-relaxed">{result.interpretation}</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => { setActiveTest(null); setResult(null); }}
                className="w-full py-3 rounded-xl bg-[#5742d3] text-white font-semibold text-sm hover:bg-[#4126bd] transition-colors"
              >
                Back to Tests
              </button>
              <a
                href="/find-help/therapist"
                className="w-full py-3 rounded-xl glass-card border border-white/30 text-[#5742d3] font-semibold text-sm hover:bg-white/80 transition-colors"
              >
                Find Professional Help
              </a>
            </div>
          </GlassCard>
        </div>
      ) : (
        /* Questions View */
        <div className="max-w-2xl mx-auto space-y-5">
          {/* Progress */}
          <GlassCard className="p-4">
            <div className="flex justify-between text-xs font-mono text-[#787586] mb-2">
              <span>{activeTest} Assessment</span>
              <span>{progress}/{questions.length}</span>
            </div>
            <div className="h-1.5 bg-[#e7eeff] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#5742d3] rounded-full transition-all duration-300"
                style={{ width: `${(progress / questions.length) * 100}%` }}
              />
            </div>
          </GlassCard>

          {loading ? (
            <div className="flex justify-center py-12">
              <img src="/logo.png" className="w-10 animate-pulse" alt="Loading" />
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((q, i) => (
                <GlassCard key={i} className="p-5">
                  <p className="text-sm font-semibold text-[#111c2d] mb-4">
                    <span className="font-mono text-[#5742d3] mr-2">{i + 1}.</span>
                    {q.text || q.question || q}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {ANSWER_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setAnswer(i, opt.value)}
                        className={`text-xs py-2.5 px-3 rounded-xl border transition-all ${
                          answers[i] === opt.value
                            ? "bg-[#5742d3] text-white border-[#5742d3] shadow-md shadow-[#5742d3]/15"
                            : "glass-card border-white/20 text-[#474554] hover:bg-white/80"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </GlassCard>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setActiveTest(null)}
              className="px-5 py-3 rounded-xl glass-card border border-white/30 text-[#474554] text-sm font-medium hover:bg-white/80 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={submit}
              disabled={submitting || progress < questions.length}
              className="flex-1 py-3 rounded-xl bg-[#5742d3] text-white text-sm font-semibold hover:bg-[#4126bd] transition-colors shadow-lg shadow-[#5742d3]/15 disabled:opacity-40"
            >
              {submitting ? "Submitting…" : "Submit Assessment"}
            </button>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
