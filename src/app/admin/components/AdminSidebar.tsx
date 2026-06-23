"use client";

import { UserButton } from "@clerk/nextjs";

type Vista = "clientes" | "analiticas";

interface AdminSidebarProps {
  activeView: Vista;
  onViewChange: (view: Vista) => void;
}

const navItems: { key: Vista; label: string; icon: string }[] = [
  { key: "clientes", label: "Gestión de Clientes", icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" },
  { key: "analiticas", label: "Analíticas", icon: "M18 20V10M12 20V4M6 20v-6" },
];

export default function AdminSidebar({ activeView, onViewChange }: AdminSidebarProps) {
  return (
    <>
      {/* Sidebar desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-surface border-r border-border min-h-dvh">
        <div className="flex items-center gap-3 py-6 px-6 border-b border-border-light">
          <div className="w-9 h-9 rounded-xl bg-brand flex items-center justify-center text-white font-bold text-sm">
            AA
          </div>
          <div>
            <p className="font-semibold text-sm">AlquilAutos</p>
            <p className="text-[0.7rem] text-text-muted">Panel Admin</p>
          </div>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => onViewChange(key)}
              className={`w-full flex items-center gap-3 py-2.5 px-4 rounded-xl text-sm font-medium cursor-pointer transition-colors ${
                activeView === key
                  ? "bg-brand-light text-brand"
                  : "text-text-secondary hover:bg-bg hover:text-text-primary"
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <path d={icon} />
                {key === "clientes" && (
                  <>
                    <circle cx="9" cy="7" r="4" />
                  </>
                )}
              </svg>
              {label}
            </button>
          ))}
        </nav>

        <div className="py-4 px-4 border-t border-border-light flex items-center gap-3">
          <UserButton />
          <span className="text-sm text-text-secondary">Mi cuenta</span>
        </div>
      </aside>

      {/* Navbar mobile */}
      <div className="md:hidden flex items-center justify-between py-3 px-4 bg-surface border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center text-white font-bold text-xs">
            AA
          </div>
          <span className="font-semibold text-sm">AlquilAutos</span>
        </div>
        <div className="flex gap-1">
          {navItems.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => onViewChange(key)}
              className={`py-1.5 px-3 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                activeView === key
                  ? "bg-brand text-white"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              {key === "clientes" ? "Clientes" : "Analíticas"}
            </button>
          ))}
        </div>
        <UserButton />
      </div>
    </>
  );
}
