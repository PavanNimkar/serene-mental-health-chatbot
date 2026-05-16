// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await login(form.username, form.password);
        navigate("/dashboard");
      } else {
        const user = await register(form.username, form.email, form.password);
        // New user → onboarding
        if (!user?.onboarding_complete) {
          navigate("/onboarding/1");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (err) {
      setError(
        err?.detail ||
          err?.username?.[0] ||
          err?.email?.[0] ||
          err?.non_field_errors?.[0] ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-[#f9f9ff]">
      {/* Background orbs */}
      <div className="orb w-[400px] h-[400px] bg-[#75f9d3]/20 -top-24 -left-24" />
      <div className="orb w-[350px] h-[350px] bg-[#e4dfff]/30 bottom-[-50px] right-[40%]" />

      {/* Left — visual panel */}
      <section className="hidden lg:flex w-1/2 relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/login-bck.png"
            alt="Serene Landscape"
            className="w-full h-full object-cover brightness-95"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#f9f9ff]/20" />
        </div>
        <div className="relative z-10 glass-card p-10 max-w-sm rounded-2xl text-center space-y-5 mx-8 shadow-xl">
          <img src="/logo.png" alt="Serene" className="w-14 h-14 object-contain mx-auto" />
          <h2 className="font-display text-3xl font-bold text-[#5742d3] leading-tight">
            Your digital sanctuary awaits.
          </h2>
          <p className="text-[#474554] text-sm leading-relaxed">
            Step away from the noise and rediscover your inner balance with
            Serene's clinically-informed wellness companion.
          </p>
          <div className="flex justify-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#5742d3]" />
            <div className="w-2 h-2 rounded-full bg-[#5742d3]/30" />
            <div className="w-2 h-2 rounded-full bg-[#5742d3]/10" />
          </div>
        </div>
      </section>

      {/* Right — auth */}
      <section className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 py-12 relative">
        <div className="w-full max-w-md space-y-6">
          {/* Logo (mobile) */}
          <div className="text-center lg:hidden mb-2">
            <img src="/logo.png" alt="Serene" className="w-12 h-12 object-contain mx-auto mb-2" />
          </div>

          <header className="text-center">
            <h1 className="font-display text-3xl font-bold text-[#5742d3]">Serene</h1>
            <p className="text-[#474554] text-base mt-1">
              {mode === "login" ? "Welcome back to peace" : "Begin your journey"}
            </p>
          </header>

          {/* Toggle */}
          <div className="flex p-1 bg-[#f0f3ff] rounded-xl">
            {["login", "register"].map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(""); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium font-mono tracking-wide transition-all duration-200 ${
                  mode === m
                    ? "bg-white shadow-sm text-[#5742d3]"
                    : "text-[#474554] hover:text-[#5742d3]"
                }`}
              >
                {m === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={submit} className="space-y-4">
            {mode === "register" && (
              <div className="space-y-1">
                <label className="text-xs font-mono tracking-widest uppercase text-[#787586] px-1">
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handle}
                  placeholder="name@example.com"
                  required
                  className="w-full px-5 py-3.5 rounded-xl border border-[#c8c4d7]/40 focus:border-[#5742d3] focus:ring-2 focus:ring-[#5742d3]/10 bg-white/60 backdrop-blur-sm text-sm outline-none transition-all"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-mono tracking-widest uppercase text-[#787586] px-1">
                Username
              </label>
              <input
                name="username"
                type="text"
                value={form.username}
                onChange={handle}
                placeholder="your_username"
                required
                className="w-full px-5 py-3.5 rounded-xl border border-[#c8c4d7]/40 focus:border-[#5742d3] focus:ring-2 focus:ring-[#5742d3]/10 bg-white/60 backdrop-blur-sm text-sm outline-none transition-all"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between px-1">
                <label className="text-xs font-mono tracking-widest uppercase text-[#787586]">
                  Password
                </label>
                {mode === "login" && (
                  <a href="#" className="text-xs text-[#5742d3] hover:underline font-mono">
                    Forgot?
                  </a>
                )}
              </div>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handle}
                placeholder="••••••••"
                required
                className="w-full px-5 py-3.5 rounded-xl border border-[#c8c4d7]/40 focus:border-[#5742d3] focus:ring-2 focus:ring-[#5742d3]/10 bg-white/60 backdrop-blur-sm text-sm outline-none transition-all"
              />
            </div>

            {error && (
              <div className="bg-[#ffdad6] text-[#93000a] text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#5742d3] hover:bg-[#4126bd] text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-[#5742d3]/20 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 mt-2"
            >
              {loading
                ? "Please wait…"
                : mode === "login"
                ? "Sign In"
                : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-[#787586]">
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
              className="text-[#5742d3] font-medium hover:underline"
            >
              {mode === "login" ? "Sign up free" : "Sign in"}
            </button>
          </p>

          <p className="text-center text-xs text-[#787586]/60 leading-relaxed">
            By continuing, you agree to Serene's{" "}
            <a href="#" className="underline">Terms of Service</a> and{" "}
            <a href="#" className="underline">Privacy Policy</a>.
          </p>
        </div>
      </section>
    </div>
  );
}
