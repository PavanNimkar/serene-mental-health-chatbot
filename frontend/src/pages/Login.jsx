import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      if (isRegister) {
        const user = await register(form.username, form.email, form.password);
        navigate(user.onboarding_complete ? "/dashboard" : "/onboarding/1");
      } else {
        const user = await login(form.username, form.password);
        navigate(user.onboarding_complete ? "/dashboard" : "/onboarding/1");
      }
    } catch (e) {
      setError(
        e?.detail ||
          e?.username?.[0] ||
          e?.email?.[0] ||
          e?.password?.[0] ||
          "Invalid credentials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-sm border border-[#D9E2EC]">
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-6">
          <img src="logo.png" alt="serene" className="w-12" />
          <span className="text-2xl font-serif font-bold text-[#1F2933]">
            Serene
          </span>
        </Link>

        <h2 className="text-xl font-serif font-bold text-[#1F2933] text-center mb-1">
          {isRegister ? "Create your account" : "Welcome back"}
        </h2>
        <p className="text-sm text-[#9AA5B1] text-center mb-7">
          {isRegister
            ? "Your mental wellness journey starts here."
            : "Sign in to continue your journey."}
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-[#1F2933] mb-1.5 flex items-center gap-2">
              <span className="material-icons-round text-[#22B1D4] text-base">
                person
              </span>
              Username
            </label>
            <input
              type="text"
              value={form.username}
              onChange={set("username")}
              placeholder="your_username"
              className="w-full bg-[#F8FAFC] border border-[#D9E2EC] rounded-xl px-4 py-3 text-[#1F2933] focus:outline-none focus:ring-2 focus:ring-[#22B1D4] transition-all text-sm"
            />
          </div>

          {isRegister && (
            <div>
              <label className="block text-sm font-bold text-[#1F2933] mb-1.5 flex items-center gap-2">
                <span className="material-icons-round text-[#22B1D4] text-base">
                  email
                </span>
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder="you@example.com"
                className="w-full bg-[#F8FAFC] border border-[#D9E2EC] rounded-xl px-4 py-3 text-[#1F2933] focus:outline-none focus:ring-2 focus:ring-[#22B1D4] transition-all text-sm"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-[#1F2933] mb-1.5 flex items-center gap-2">
              <span className="material-icons-round text-[#22B1D4] text-base">
                lock
              </span>
              Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={set("password")}
              placeholder="••••••••"
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="w-full bg-[#F8FAFC] border border-[#D9E2EC] rounded-xl px-4 py-3 text-[#1F2933] focus:outline-none focus:ring-2 focus:ring-[#22B1D4] transition-all text-sm"
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 text-sm text-[#EF4444] bg-[#FEE2E2] px-4 py-3 rounded-xl">
            <span className="material-icons-round text-base">error_outline</span>
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-6 bg-[#22B1D4] text-white py-3.5 rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#189AB4] transition-colors disabled:opacity-60"
          style={{ boxShadow: "0 4px 20px rgba(34,177,212,0.3)" }}
        >
          {loading ? (
            <>
              <span className="material-icons-round text-base animate-spin">
                refresh
              </span>
              {isRegister ? "Creating account…" : "Signing in…"}
            </>
          ) : (
            <>
              <span className="material-icons-round text-base">
                {isRegister ? "person_add" : "login"}
              </span>
              {isRegister ? "Create Account" : "Sign In"}
            </>
          )}
        </button>

        <p className="text-center text-sm text-[#9AA5B1] mt-5">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
            className="text-[#22B1D4] font-bold hover:underline"
          >
            {isRegister ? "Sign in" : "Sign up free"}
          </button>
        </p>

        <p className="text-center text-[10px] text-[#9AA5B1] mt-4">
          By continuing, you agree to our{" "}
          <a href="#" className="text-[#22B1D4] hover:underline">
            Terms
          </a>{" "}
          and{" "}
          <a href="#" className="text-[#22B1D4] hover:underline">
            Privacy Policy
          </a>
          . HIPAA-compliant · SSL encrypted.
        </p>
      </div>
    </div>
  );
}
