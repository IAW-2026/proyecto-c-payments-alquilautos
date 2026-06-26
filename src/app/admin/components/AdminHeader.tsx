import React from "react";
import { UserButton } from "@clerk/nextjs";

interface AdminHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export default function AdminHeader({ searchTerm, onSearchChange }: AdminHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-6 flex-wrap w-full max-md:flex-col max-md:items-start max-md:gap-4 max-md:w-full">
      <div>
        <h1 className="text-[2rem] font-bold text-text-primary max-lg:text-[1.75rem] max-md:text-[1.5rem] max-sm:text-lg">Panel de Administración</h1>
        <p className="text-sm text-text-secondary max-sm:text-xs">Gestión de ingresos.</p>
      </div>
      <div className="flex items-center gap-5 max-md:w-full max-md:flex-wrap max-md:gap-3">
        <div className="relative w-[320px] max-md:w-full max-md:max-w-full">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted flex">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
          </span>
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full py-[0.6rem] pl-10 pr-4 border border-border rounded-xl bg-surface outline-none text-text-primary transition-colors focus:border-brand"
          />
        </div>
        <div className="flex items-center min-w-[28px] max-md:fixed max-md:top-[10px] max-md:right-[10px] max-md:z-[999] max-md:min-w-0">
          <UserButton />
        </div>
      </div>
    </div>
  );
}
