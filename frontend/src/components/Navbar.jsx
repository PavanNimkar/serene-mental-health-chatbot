import { Link, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [findHelpOpen, setFindHelpOpen] = useState(false);
  const { user, logout } = useAuth();
  const dropdownRef = useRef(null);

  const links = [
    { to: "/", label: "Home", exact: true },
    { to: "/#features", label: "Features", exact: false },
    { to: "/chat", label: "Chat", exact: true },
    { to: "/dashboard", label: "Dashboard", exact: true },
  ];

  const findHelpLinks = [
    { to: "/find-help/helplines", label: "Helplines" },
    { to: "/find-help/therapist", label: "Find a Professional" },
    { to: "/find-help/self-help", label: "Self-Help Techniques" },
  ];

  const isActive = (to, exact) => {
    if (exact) return location.pathname === to;
    return location.pathname.startsWith(to);
  };

  const isFindHelpActive = findHelpLinks.some((l) =>
    location.pathname.startsWith(l.to),
  );

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setFindHelpOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white border-b border-[#D9E2EC] sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/logo.png" alt="serene" className="w-10" />
          <span className="text-2xl font-serif font-bold text-[#1F2933]">
            Serene
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => {
            if (link.to.startsWith("/#")) {
              return (
                <a
                  key={link.label}
                  href={link.to}
                  className="font-medium text-[#52606D] hover:text-[#22B1D4] transition-colors"
                >
                  {link.label}
                </a>
              );
            }
            return (
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
            );
          })}

          {/* Find Help Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setFindHelpOpen((prev) => !prev)}
              className={`flex items-center gap-1 font-medium transition-colors ${
                isFindHelpActive
                  ? "text-[#22B1D4] border-b-2 border-[#22B1D4] pb-0.5"
                  : "text-[#52606D] hover:text-[#22B1D4]"
              }`}
            >
              Find Help
              <span className="material-icons-round text-base leading-none">
                {findHelpOpen ? "expand_less" : "expand_more"}
              </span>
            </button>

            {findHelpOpen && (
              <div className="absolute top-full left-0 mt-2 w-52 bg-white border border-[#D9E2EC] rounded-xl shadow-lg py-1 z-50">
                {findHelpLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={() => setFindHelpOpen(false)}
                    className={`block px-4 py-2.5 text-sm font-medium transition-colors hover:bg-[#F0FBFD] hover:text-[#22B1D4] ${
                      location.pathname === link.to
                        ? "text-[#22B1D4] bg-[#F0FBFD]"
                        : "text-[#52606D]"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CTA Buttons — auth-aware */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <span className="font-medium text-[#52606D] px-2">
                {user.display_name || user.username}
              </span>
              <button
                onClick={logout}
                className="font-medium text-[#52606D] hover:text-[#22B1D4] transition-colors px-4 py-2"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
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
            </>
          )}
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

          {/* Mobile Find Help — collapsible */}
          <div>
            <button
              onClick={() => setFindHelpOpen((prev) => !prev)}
              className="flex items-center justify-between w-full font-medium text-[#52606D] py-2"
            >
              Find Help
              <span className="material-icons-round text-base">
                {findHelpOpen ? "expand_less" : "expand_more"}
              </span>
            </button>
            {findHelpOpen && (
              <div className="pl-4 mt-1 space-y-1 border-l-2 border-[#22B1D4]">
                {findHelpLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={() => {
                      setFindHelpOpen(false);
                      setMobileOpen(false);
                    }}
                    className={`block py-2 text-sm font-medium transition-colors ${
                      location.pathname === link.to
                        ? "text-[#22B1D4]"
                        : "text-[#52606D] hover:text-[#22B1D4]"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-[#D9E2EC] flex flex-col gap-3">
            {user ? (
              <button
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="w-full text-center border border-[#D9E2EC] text-[#52606D] px-6 py-3 rounded-full font-semibold hover:bg-[#F8FAFC] transition-colors"
              >
                Log out
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center border border-[#D9E2EC] text-[#52606D] px-6 py-3 rounded-full font-semibold hover:bg-[#F8FAFC] transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/onboarding/1"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center bg-[#22B1D4] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#189AB4] transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
