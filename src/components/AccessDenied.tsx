"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface AccessDeniedProps {
  email?: string;
  title?: string;
  message?: string;
  onSignOut?: () => void;
}

export default function AccessDenied({
  email,
  title = "Acceso Restringido",
  message,
  onSignOut,
}: AccessDeniedProps) {
  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto] bg-bg text-text-primary font-sans">
      <Header />
      <main className="flex flex-col items-center justify-center p-12 px-8 text-center max-sm:p-8 max-sm:px-4">
        <div className="bg-surface border border-border rounded-3xl p-14 px-10 max-w-[460px] shadow-card flex flex-col items-center gap-6 w-full max-sm:p-6 max-sm:px-4 max-sm:gap-4">
          <div className="w-16 h-16 rounded-full bg-[#fef2f2] flex items-center justify-center border border-[#fee2e2] text-[#dc2626] mb-2">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          <h2 className="font-display text-[1.75rem] font-semibold text-text-primary max-sm:text-[1.35rem]">{title}</h2>

          <p className="text-text-secondary text-[0.9375rem] leading-relaxed max-sm:text-[0.85rem]">
            {message || (
              <>
                Tu cuenta <strong>{email || "sin correo"}</strong> no tiene permisos de administrador en este panel de control.
              </>
            )}
          </p>

          {onSignOut && (
            <div className="flex gap-4 mt-2 w-full">
              <button
                onClick={onSignOut}
                className="w-full py-[0.8rem] px-6 bg-surface border border-border text-text-primary font-sans text-[0.9rem] font-semibold cursor-pointer rounded-xl transition-all hover:bg-border-light hover:border-text-muted max-sm:text-[0.8rem] max-sm:py-[0.6rem] max-sm:px-[0.85rem]"
              >
                Cerrar Sesión e Iniciar con otra cuenta
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
