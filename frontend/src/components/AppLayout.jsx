// src/components/AppLayout.jsx
import { useState } from "react";
import Sidebar from "./Sidebar";

export default function AppLayout({ children, title, subtitle }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] relative overflow-x-hidden">
      {/* Background orbs */}
      <div className="orb w-[500px] h-[500px] bg-[#22B1D4]/8 top-[-100px] left-[-100px] fixed" />
      <div className="orb w-[600px] h-[600px] bg-[#22B1D4]/5 bottom-[-200px] right-[-100px] fixed" />
      <div className="orb w-[400px] h-[400px] bg-[#189AB4]/5 top-[20%] right-[10%] fixed" />

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main area */}
      <div className="lg:pl-64 min-h-screen flex flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-5 md:px-8 py-3.5 bg-white/80 backdrop-blur-xl border-b border-[#E4EEF3] shadow-sm">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-xl text-[#52606D] hover:bg-[#E8F8FC] hover:text-[#22B1D4] transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div>
              {title && (
                <h2 className="font-display text-lg font-bold text-[#1F2933] leading-tight">
                  {title}
                </h2>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-5 md:px-8 py-6 relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
}
