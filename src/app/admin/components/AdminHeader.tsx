import React from "react";
import { UserButton } from "@clerk/nextjs";

interface AdminHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export default function AdminHeader({ searchTerm, onSearchChange }: AdminHeaderProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1.5rem", flexWrap: "wrap", width: "100%" }}>
      <div>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--text-primary)" }}>Panel de Administración</h1>
        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Gestión de ingresos y flota.</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
        <div style={{ position: "relative", width: "320px" }}>
          <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", display: "flex" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
          </span>
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{ width: "100%", padding: "0.6rem 1rem 0.6rem 2.5rem", border: "1px solid var(--border)", borderRadius: "10px", background: "var(--surface)", outline: "none", color: "var(--text-primary)" }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", minWidth: "28px" }}>
          <UserButton />
        </div>
      </div>
    </div>
  );
}
