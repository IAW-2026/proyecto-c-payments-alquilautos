import React from "react";
import { UserButton } from "@clerk/nextjs";

interface AdminHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export default function AdminHeader({ searchTerm, onSearchChange }: AdminHeaderProps) {
  return (
    <div className="admin-header-flex">
      <div>
        <h1 className="admin-header-title">Panel de Administración</h1>
        <p className="admin-header-subtitle">Gestión de ingresos.</p>
      </div>
      <div className="admin-header-actions">
        <div className="admin-search-wrapper">
          <span className="admin-search-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
          </span>
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="admin-search-input"
          />
        </div>
        <div className="admin-user-button-container">
          <UserButton />
        </div>
      </div>
    </div>
  );
}
