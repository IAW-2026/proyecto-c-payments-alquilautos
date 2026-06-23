"use client";

import { useEffect, useState } from "react";
import { UserButton } from "@clerk/nextjs";

type Vista = "clientes" | "analiticas";

interface AdminSidebarProps {
  activeView: Vista;
  onViewChange: (view: Vista) => void;
}

const navItems: { key: Vista; label: string; icon: string }[] = [
  { key: "clientes", label: "Panel de Administración", icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" },
  { key: "analiticas", label: "Analíticas", icon: "M18 20V10M12 20V4M6 20v-6" },
];

export default function AdminSidebar({ activeView, onViewChange }: AdminSidebarProps) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") {
      setDark(stored === "dark");
      document.documentElement.classList.toggle("dark", stored === "dark");
    }
  }, []);

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
          <div className="w-9 h-9 rounded-xl bg-brand flex items-center justify-center text-white font-bold text-sm">
            AA
          </div>
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

      {/* Navbar mobile */}
      <div className="md:hidden flex items-center justify-between py-3 px-4 bg-surface border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center text-white font-bold text-xs">
            AA
          </div>
          <span className="font-semibold text-sm text-text-primary">AlquilAutos</span>
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
        <button
          onClick={toggleTheme}
          className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-colors text-text-muted hover:text-text-secondary bg-bg"
          title="Cambiar tema"
        >
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
        </button>
      </div>
    </>
  );
}
