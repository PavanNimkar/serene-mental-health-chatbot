// src/components/Sidebar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const NAV_ITEMS = [
  { to: "/dashboard", icon: "dashboard", label: "Dashboard" },
  { to: "/chat", icon: "forum", label: "AI Chat" },
  { to: "/mood", icon: "wb_sunny", label: "Mood Tracker" },
  { to: "/tests", icon: "quiz", label: "Mental Health Tests" },
  { to: "/profile", icon: "person", label: "Profile" },
];

const HELP_ITEMS = [
  { to: "/find-help/helplines", icon: "emergency", label: "Crisis Helplines" },
  {
    to: "/find-help/therapist",
    icon: "medical_services",
    label: "Find Professional",
  },
  { to: "/find-help/self-help", icon: "self_improvement", label: "Self-Help" },
];

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full py-6 px-3 gap-1">
      {/* Brand */}
      <div className="px-3 mb-6">
        <div className="flex items-center gap-2.5">
          <img
            src="/logo.png"
            alt="Serene"
            className="w-8 h-8 object-contain"
          />
          <div>
            <h1
              className="text-xl font-bold text-[#1F2933] leading-none"
              style={{ fontFamily: "serif" }}
            >
              Serene
            </h1>
            <p className="text-[10px] text-[#9AA5B1] font-mono tracking-widest uppercase">
              AI Companion
            </p>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="flex flex-col gap-0.5 flex-1">
        <p className="text-[10px] font-mono tracking-widest uppercase text-[#9AA5B1] px-3 mb-1">
          Main
        </p>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-[#E8F8FC] text-[#22B1D4] font-semibold"
                  : "text-[#52606D] hover:bg-[#E8F8FC] hover:text-[#22B1D4] hover:translate-x-0.5"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#22B1D4]" />
                )}
              </>
            )}
          </NavLink>
        ))}

        {/* Find Help */}
        <p className="text-[10px] font-mono tracking-widest uppercase text-[#9AA5B1] px-3 mt-4 mb-1">
          Support
        </p>
        {HELP_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-[#E8F8FC] text-[#22B1D4]"
                  : "text-[#52606D] hover:bg-[#E8F8FC] hover:text-[#22B1D4] hover:translate-x-0.5"
              }`
            }
          >
            <span className="material-symbols-outlined text-[20px]">
              {item.icon}
            </span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* User + Logout */}
      <div className="mt-auto flex flex-col gap-2 px-1">
        <div className="bg-[#E8F8FC] rounded-xl p-3 flex items-center gap-3 border border-[#D4EEF7]">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
            style={{ background: "linear-gradient(135deg,#22B1D4,#189AB4)" }}
          >
            {user?.username?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#1F2933] truncate">
              {user?.username || "User"}
            </p>
            <p className="text-[11px] text-[#9AA5B1] truncate">
              {user?.email || ""}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#52606D] hover:bg-red-50 hover:text-red-500 transition-all duration-200 w-full"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col bg-white border-r border-[#E4EEF3] w-64 fixed left-0 top-0 h-screen z-40 shadow-sm">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={onClose}
          />
          <aside className="absolute left-0 top-0 h-full w-72 bg-white border-r border-[#E4EEF3] shadow-2xl animate-[slideIn_0.25s_ease]">
            <SidebarContent />
          </aside>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
