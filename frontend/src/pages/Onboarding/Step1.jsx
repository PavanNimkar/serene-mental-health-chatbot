import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../services/api";

const ageRanges = [
  { value: "13-18", label: "13 – 18" },
  { value: "18-25", label: "18 – 25" },
  { value: "25-40", label: "25 – 40" },
  { value: "40+", label: "40+" },
];

const genders = [
  { value: "male", icon: "male", label: "Male" },
  { value: "female", icon: "female", label: "Female" },
  { value: "non_binary", icon: "transgender", label: "Non-binary" },
  { value: "prefer_not", icon: "block", label: "Prefer not to say" },
];

export default function Step1() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [ageRange, setAgeRange] = useState("");
  const [gender, setGender] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const canContinue = name.trim() && agreed;

  const handleContinue = async () => {
    if (!canContinue) return;
    setSaving(true);
    setError("");
    try {
      await auth.onboarding(1, {
        display_name: name.trim(),
        agreed_not_medical: agreed,
        age_range: ageRange,
        gender,
      });
      navigate("/onboarding/2");
    } catch (e) {
      setError(
        e?.agreed_not_medical?.[0] ||
          e?.display_name?.[0] ||
          "Something went wrong. Please try again."
      );
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
            <span className="material-icons-round text-[#22B1D4] text-xl">
              waving_hand
            </span>
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold text-[#1F2933] leading-tight">
              Welcome to Serene
            </h2>
            <p className="text-xs text-[#9AA5B1]">Let's get you set up</p>
          </div>
        </div>

        <p className="text-sm text-[#52606D] mb-6">
          This is your safe space. We'll personalize your experience in just a
          few steps.
        </p>

        {/* Name */}
        <div className="mb-5">
          <label className="block text-sm font-bold text-[#1F2933] mb-2 flex items-center gap-2">
            <span className="material-icons-round text-[#22B1D4] text-base">
              badge
            </span>
            What should I call you?
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your first name"
            className="w-full bg-[#F8FAFC] border border-[#D9E2EC] rounded-xl px-4 py-3 text-[#1F2933] focus:outline-none focus:ring-2 focus:ring-[#22B1D4] transition-all text-sm"
          />
        </div>

        {/* Age range */}
        <div className="mb-5">
          <label className="block text-sm font-bold text-[#1F2933] mb-2 flex items-center gap-2">
            <span className="material-icons-round text-[#22B1D4] text-base">
              calendar_today
            </span>
            Age range{" "}
            <span className="font-normal text-[#9AA5B1]">(optional)</span>
          </label>
          <div className="grid grid-cols-4 gap-2">
            {ageRanges.map((a) => (
              <button
                key={a.value}
                onClick={() => setAgeRange(a.value === ageRange ? "" : a.value)}
                className={`py-2.5 rounded-xl border-2 text-xs font-bold transition-all ${
                  ageRange === a.value
                    ? "border-[#22B1D4] bg-[#E8F8FC] text-[#22B1D4]"
                    : "border-[#D9E2EC] text-[#52606D] hover:border-[#22B1D4]/40"
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gender */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-[#1F2933] mb-2 flex items-center gap-2">
            <span className="material-icons-round text-[#22B1D4] text-base">
              person
            </span>
            Gender{" "}
            <span className="font-normal text-[#9AA5B1]">(optional)</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {genders.map((g) => (
              <button
                key={g.value}
                onClick={() => setGender(g.value === gender ? "" : g.value)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                  gender === g.value
                    ? "border-[#22B1D4] bg-[#E8F8FC] text-[#22B1D4]"
                    : "border-[#D9E2EC] text-[#52606D] hover:border-[#22B1D4]/40"
                }`}
              >
                <span
                  className="material-icons-round text-base"
                  style={{ color: gender === g.value ? "#22B1D4" : "#9AA5B1" }}
                >
                  {g.icon}
                </span>
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Medical disclaimer */}
        <button
          onClick={() => setAgreed(!agreed)}
          className={`w-full flex items-start gap-3 p-4 rounded-2xl border-2 text-left transition-all mb-6 ${
            agreed
              ? "border-[#22B1D4] bg-[#E8F8FC]"
              : "border-[#D9E2EC] bg-[#FAFBFC] hover:border-[#22B1D4]/40"
          }`}
        >
          <div
            className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
              agreed ? "bg-[#22B1D4] border-[#22B1D4]" : "border-[#D9E2EC]"
            }`}
          >
            {agreed && (
              <span className="material-icons-round text-white text-xs">
                check
              </span>
            )}
          </div>
          <div>
            <p className="text-sm font-bold text-[#1F2933] mb-1 flex items-center gap-1.5">
              <span className="material-icons-round text-[#F59E0B] text-base">
                info
              </span>
              I understand Serene is not a medical professional
            </p>
            <p className="text-xs text-[#9AA5B1] leading-relaxed">
              Serene provides emotional support and wellness guidance, not
              medical diagnosis or treatment. Always consult a licensed
              healthcare provider for medical concerns.
            </p>
          </div>
        </button>

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
                  i === 1 ? "w-8 bg-[#22B1D4]" : "w-2 bg-[#D9E2EC]"
                }`}
              />
            ))}
          </div>
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
  );
}
