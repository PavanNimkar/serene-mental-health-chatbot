import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] text-white">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <Link to="/" className="flex items-center gap-2.5">
                <img src="logo.png" alt="serene" className="w-10" />
                <span className="text-2xl font-serif font-bold text-white">
                  Serene
                </span>
              </Link>
            </div>
            <p className="text-[#CBD5E1] text-sm leading-relaxed mb-6">
              Your AI-powered mental wellness companion. Available 24/7,
              judgment-free.
            </p>
            <div className="flex gap-3">
              {["twitter", "facebook", "instagram", "linkedin"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-[#CBD5E1] hover:text-[#22B1D4] hover:border-[#22B1D4] transition-colors"
                >
                  <span className="material-icons-round text-sm">
                    {s === "twitter"
                      ? "alternate_email"
                      : s === "facebook"
                        ? "facebook"
                        : s === "instagram"
                          ? "photo_camera"
                          : "business"}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-widest">
              Product
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Features", to: "/#features" },
                { label: "Pricing", to: "/pricing" },
                { label: "Chat with Serene", to: "/chat" },
                { label: "Dashboard", to: "/dashboard" },
                { label: "Assessments", to: "/onboarding/4" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-[#CBD5E1] hover:text-[#22B1D4] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-widest">
              Resources
            </h4>
            <ul className="space-y-3">
              {[
                "Mental Health Blog",
                "Mindfulness Guide",
                "Crisis Support",
                "Community",
                "Help Center",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-[#CBD5E1] hover:text-[#22B1D4] transition-colors text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-widest">
              Company
            </h4>
            <ul className="space-y-3">
              {[
                "About Us",
                "Careers",
                "Privacy Policy",
                "Terms of Service",
                "Contact",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-[#CBD5E1] hover:text-[#22B1D4] transition-colors text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#CBD5E1] text-sm">
            © {new Date().getFullYear()} Serene. Made with care for mental
            wellness.
          </p>
          <div className="flex items-center gap-2 text-sm text-[#CBD5E1]">
            <span className="material-icons-round text-[#22B1D4] text-base">
              verified_user
            </span>
            HIPAA-compliant · SSL encrypted · Privacy-first
          </div>
        </div>
      </div>
    </footer>
  );
}
