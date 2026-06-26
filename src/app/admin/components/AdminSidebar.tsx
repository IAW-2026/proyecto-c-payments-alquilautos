"use client";

import { useState } from "react";
import { UserButton } from "@clerk/nextjs";

type Vista = "clientes" | "analiticas";

interface AdminSidebarProps {
  activeView: Vista;
  onViewChange: (view: Vista) => void;
}

const navItems: { key: Vista; label: string; shortLabel: string; icon: string }[] = [
  { key: "clientes", label: "Panel de Administración", shortLabel: "Clientes", icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" },
  { key: "analiticas", label: "Analíticas", shortLabel: "Analíticas", icon: "M18 20V10M12 20V4M6 20v-6" },
];

export default function AdminSidebar({ activeView, onViewChange }: AdminSidebarProps) {
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme");
      if (stored === "light" || stored === "dark") {
        document.documentElement.classList.toggle("dark", stored === "dark");
        return stored === "dark";
      }
    }
    return false;
  });

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <>
      {/* Sidebar desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-surface border-r border-border min-h-dvh">
        <div className="flex items-center gap-3 py-6 px-6 border-b border-border-light">
          <img src="/logo.jpeg" alt="AlquilAutos" className="w-9 h-9 rounded-xl" />
          <div>
            <p className="font-semibold text-sm text-text-primary">AlquilAutos</p>
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

        <div className="py-4 px-4 border-t border-border-light">
          <button onClick={toggleTheme} className="w-full flex items-center justify-between py-2 px-3 rounded-xl text-sm cursor-pointer transition-colors hover:bg-bg">
            <span className="flex items-center gap-2 text-text-secondary">
              {dark ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              )}
              {dark ? "Oscuro" : "Claro"}
            </span>
            <span className={`relative w-9 h-5 rounded-full transition-colors ${dark ? "bg-brand" : "bg-border"}`}>
              <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${dark ? "translate-x-4" : "translate-x-0"}`} />
            </span>
          </button>
          <div className="flex items-center gap-3">
            <UserButton />
            <span className="text-sm text-text-secondary">Mi cuenta</span>
          </div>
        </div>
      </aside>

      {/* Bottom bar mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around py-2 px-2 bg-surface border-t border-border">
        {navItems.map(({ key, shortLabel, icon }) => (
          <button
            key={key}
            onClick={() => onViewChange(key)}
            className={`flex flex-col items-center gap-0.5 py-1 px-4 rounded-xl text-[0.65rem] font-medium cursor-pointer transition-colors ${
              activeView === key
                ? "text-brand"
                : "text-text-muted hover:text-text-secondary"
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <path d={icon} />
              {key === "clientes" && (
                <>
                  <circle cx="9" cy="7" r="4" />
                </>
              )}
            </svg>
            {shortLabel}
          </button>
        ))}
        <div className="flex items-center">
          <UserButton />
        </div>
        <button
          onClick={toggleTheme}
          className="flex flex-col items-center gap-0.5 py-1 px-4 rounded-xl text-[0.65rem] font-medium cursor-pointer transition-colors text-text-muted hover:text-text-secondary"
          title="Cambiar tema"
        >
          {dark ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          )}
        </button>
      </div>
    </>
  );
}
