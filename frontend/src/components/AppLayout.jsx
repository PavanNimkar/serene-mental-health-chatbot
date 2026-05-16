// src/components/AppLayout.jsx
import { useState } from "react";
import Sidebar from "./Sidebar";

export default function AppLayout({ children, title, subtitle }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f9f9ff] relative overflow-x-hidden">
      {/* Background orbs */}
      <div className="orb w-[500px] h-[500px] bg-[#5742d3]/8 top-[-100px] left-[-100px] fixed" />
      <div className="orb w-[600px] h-[600px] bg-[#006b56]/5 bottom-[-200px] right-[-100px] fixed" />
      <div className="orb w-[400px] h-[400px] bg-[#8a4c05]/5 top-[20%] right-[10%] fixed" />

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main area */}
      <div className="lg:pl-64 min-h-screen flex flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-5 md:px-8 py-3.5 bg-white/70 backdrop-blur-xl border-b border-white/30 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-xl text-[#474554] hover:bg-[#e7eeff] transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div>
              {title && <h2 className="font-display text-lg font-bold text-[#111c2d] leading-tight">{title}</h2>}
              {subtitle && <p className="text-xs text-[#787586]">{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-xl text-[#474554] hover:bg-[#e7eeff] transition-colors relative">
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#5742d3]" />
            </button>
            <div className="w-8 h-8 rounded-full bg-[#5742d3] flex items-center justify-center text-white text-sm font-bold cursor-pointer">
              <span className="material-symbols-outlined text-[18px]">person</span>
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
