import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { to: "/", label: "Home", exact: true },
    { to: "/#features", label: "Features", exact: false },
    { to: "/chat", label: "Chat", exact: true },
    { to: "/dashboard", label: "Dashboard", exact: true },
  ];

  const isActive = (to, exact) => {
    if (exact) return location.pathname === to;
    return location.pathname.startsWith(to);
  };

  return (
    <nav className="bg-white border-b border-[#D9E2EC] sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <img src="logo.png" alt="serene" className="w-10" />
          <span className="text-2xl font-serif font-bold text-[#1F2933]">
            Serene
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) =>
            link.to.startsWith("/#") ? (
              <a
                key={link.label}
                href={link.to}
                className="font-medium text-[#52606D] hover:text-[#22B1D4] transition-colors"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.to}
                className={`font-medium transition-colors ${
                  isActive(link.to, link.exact)
                    ? "text-[#22B1D4] border-b-2 border-[#22B1D4] pb-0.5"
                    : "text-[#52606D] hover:text-[#22B1D4]"
                }`}
              >
                {link.label}
              </Link>
            ),
          )}
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/chat"
            className="font-medium text-[#52606D] hover:text-[#22B1D4] transition-colors px-4 py-2"
          >
            Log in
          </Link>
          <Link
            to="/onboarding/1"
            className="bg-[#22B1D4] text-white px-6 py-2.5 rounded-full font-semibold hover:bg-[#189AB4] active:bg-[#137A8F] transition-colors"
            style={{ boxShadow: "0 4px 14px rgba(34,177,212,0.3)" }}
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 text-[#52606D] hover:text-[#22B1D4] transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span className="material-icons-round">
            {mobileOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-[#D9E2EC] px-6 py-4 space-y-3">
          {links.map((link) =>
            link.to.startsWith("/#") ? (
              <a
                key={link.label}
                href={link.to}
                onClick={() => setMobileOpen(false)}
                className="block font-medium text-[#52606D] hover:text-[#22B1D4] py-2 transition-colors"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block font-medium py-2 transition-colors ${
                  isActive(link.to, link.exact)
                    ? "text-[#22B1D4]"
                    : "text-[#52606D] hover:text-[#22B1D4]"
                }`}
              >
                {link.label}
              </Link>
            ),
          )}
          <div className="pt-3 border-t border-[#D9E2EC] flex flex-col gap-3">
            <Link
              to="/onboarding/1"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center bg-[#22B1D4] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#189AB4] transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
