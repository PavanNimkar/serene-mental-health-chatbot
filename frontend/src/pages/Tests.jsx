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
    color: "text-[#22B1D4]",
    bg: "bg-[#E8F8FC]",
    questions: 9,
  },
  {
    id: "GAD-7",
    name: "GAD-7",
    full: "Generalized Anxiety Disorder",
    desc: "Assesses anxiety severity",
    icon: "monitor_heart",
    color: "text-[#189AB4]",
    bg: "bg-[#E8F8FC]",
    questions: 7,
  },
];

const ANSWER_OPTIONS = [
  { label: "Not at all", value: 0 },
  { label: "Several days", value: 1 },
  { label: "More than half the days", value: 2 },
  { label: "Nearly every day", value: 3 },
];

function SeverityBadge({ score }) {
  let label, cls;
  if (score <= 4) {
    label = "Minimal";
    cls = "bg-[#E8F8FC] text-[#22B1D4] border border-[#D4EEF7]";
  } else if (score <= 9) {
    label = "Mild";
    cls = "bg-amber-50 text-amber-600 border border-amber-200";
  } else if (score <= 14) {
    label = "Moderate";
    cls = "bg-orange-50 text-orange-600 border border-orange-200";
  } else {
    label = "Severe";
    cls = "bg-red-50 text-red-500 border border-red-200";
  }
  return (
    <span
      className={`text-xs font-mono px-2.5 py-1 rounded-full font-semibold ${cls}`}
    >
      {label}
    </span>
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
    <AppLayout
      title="Mental Health Tests"
      subtitle="Clinically validated self-assessments"
    >
      {!activeTest ? (
        <div className="space-y-5">
          {/* Test cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TEST_TYPES.map((t) => {
              const lr = latestResults[t.id];
              return (
                <GlassCard key={t.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`p-2.5 rounded-xl ${t.bg} border border-[#D4EEF7]`}
                    >
                      <span className={`material-symbols-outlined ${t.color}`}>
                        {t.icon}
                      </span>
                    </div>
                    {lr && <SeverityBadge score={lr.total_score} />}
                  </div>
                  <h3
                    className="text-xl font-bold text-[#1F2933]"
                    style={{ fontFamily: "serif" }}
                  >
                    {t.name}
                  </h3>
                  <p className="text-xs text-[#9AA5B1] mb-1">{t.full}</p>
                  <p className="text-sm text-[#52606D] mb-4">{t.desc}</p>
                  {lr && (
                    <div className="mb-4 p-3 bg-[#F8FAFC] rounded-xl border border-[#E4EEF3]">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#9AA5B1]">
                          Last score:
                        </span>
                        <span className="font-mono font-bold text-[#1F2933] text-lg">
                          {lr.total_score}
                        </span>
                      </div>
                      <p className="text-xs text-[#9AA5B1] mt-0.5">
                        {lr.interpretation}
                      </p>
                    </div>
                  )}
                  <button
                    onClick={() => startTest(t.id)}
                    className="w-full py-3 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-all shadow-[0_4px_12px_rgba(34,177,212,.3)]"
                    style={{
                      background: "linear-gradient(135deg,#22B1D4,#189AB4)",
                    }}
                  >
                    {lr ? "Retake Assessment" : "Take Assessment"}
                  </button>
                  <p className="text-center text-[10px] text-[#9AA5B1] mt-2 font-mono">
                    {t.questions} questions · ~2 minutes
                  </p>
                </GlassCard>
              );
            })}
          </div>

          {/* Disclaimer */}
          <GlassCard className="p-5 border border-[#D4EEF7] bg-[#E8F8FC]/50">
            <div className="flex gap-3">
              <span className="material-symbols-outlined text-[#22B1D4] shrink-0">
                info
              </span>
              <p className="text-sm text-[#52606D] leading-relaxed">
                These assessments are for educational purposes only and do not
                constitute a clinical diagnosis. Always consult a qualified
                mental health professional for diagnosis and treatment.
              </p>
            </div>
          </GlassCard>
        </div>
      ) : result ? (
        /* Result View */
        <div className="max-w-xl mx-auto">
          <GlassCard className="p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-[#E8F8FC] flex items-center justify-center mx-auto mb-4 border border-[#D4EEF7]">
              <span className="font-mono text-3xl font-bold text-[#22B1D4]">
                {result.total_score}
              </span>
            </div>
            <h3
              className="text-2xl font-bold text-[#1F2933] mb-2"
              style={{ fontFamily: "serif" }}
            >
              {activeTest} Complete
            </h3>
            <SeverityBadge score={result.total_score} />
            <p className="text-[#52606D] text-sm mt-4 mb-6 leading-relaxed">
              {result.interpretation}
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setActiveTest(null);
                  setResult(null);
                }}
                className="w-full py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-colors shadow-[0_4px_12px_rgba(34,177,212,.3)]"
                style={{
                  background: "linear-gradient(135deg,#22B1D4,#189AB4)",
                }}
              >
                Back to Tests
              </button>
              <a
                href="/find-help/therapist"
                className="w-full py-3 rounded-xl bg-white border border-[#D4EEF7] text-[#22B1D4] font-semibold text-sm hover:bg-[#E8F8FC] transition-colors text-center"
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
            <div className="flex justify-between text-xs font-mono text-[#9AA5B1] mb-2">
              <span>{activeTest} Assessment</span>
              <span>
                {progress}/{questions.length}
              </span>
            </div>
            <div className="h-1.5 bg-[#E8F8FC] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${(progress / questions.length) * 100}%`,
                  background: "linear-gradient(90deg,#22B1D4,#189AB4)",
                }}
              />
            </div>
          </GlassCard>

          {loading ? (
            <div className="flex justify-center py-12">
              <img
                src="/logo.png"
                className="w-10 animate-pulse"
                alt="Loading"
              />
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((q, i) => (
                <GlassCard key={i} className="p-5">
                  <p className="text-sm font-semibold text-[#1F2933] mb-4">
                    <span className="font-mono text-[#22B1D4] mr-2">
                      {i + 1}.
                    </span>
                    {q.text || q.question || q}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {ANSWER_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setAnswer(i, opt.value)}
                        className={`text-xs py-2.5 px-3 rounded-xl border transition-all ${
                          answers[i] === opt.value
                            ? "text-white border-[#22B1D4] shadow-[0_2px_8px_rgba(34,177,212,.3)]"
                            : "bg-white border-[#E4EEF3] text-[#52606D] hover:bg-[#E8F8FC] hover:border-[#D4EEF7]"
                        }`}
                        style={
                          answers[i] === opt.value
                            ? {
                                background:
                                  "linear-gradient(135deg,#22B1D4,#189AB4)",
                              }
                            : {}
                        }
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
              className="px-5 py-3 rounded-xl bg-white border border-[#E4EEF3] text-[#52606D] text-sm font-medium hover:bg-[#F8FAFC] hover:border-[#D4EEF7] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={submit}
              disabled={submitting || progress < questions.length}
              className="flex-1 py-3 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-all shadow-[0_4px_12px_rgba(34,177,212,.3)] disabled:opacity-40"
              style={{ background: "linear-gradient(135deg,#22B1D4,#189AB4)" }}
            >
              {submitting ? "Submitting…" : "Submit Assessment"}
            </button>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
