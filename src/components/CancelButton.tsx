"use client";

import { useState } from "react";
import ConfirmDialog from "@/components/ConfirmDialog";

interface CancelButtonProps {
  idPago: number;
  onCancel: (idPago: number) => Promise<void>;
}

export default function CancelButton({ idPago, onCancel }: CancelButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setShowConfirm(false);
    setLoading(true);
    try {
      await onCancel(idPago);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        disabled={loading}
        className="inline-flex items-center justify-center w-8 h-8 border-none rounded-md bg-[#fee2e2] text-[#dc2626] cursor-pointer text-[0.9rem] transition-all hover:bg-[#fecaca] hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed max-sm:w-6 max-sm:h-6 max-sm:text-[0.75rem]"
        title="Cancelar transacción"
      >
        {loading ? (
          "..."
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        )}
      </button>

      <ConfirmDialog
        open={showConfirm}
        title="Cancelar transacción"
        message="¿Estás seguro de cancelar esta transacción? Esta acción no se puede deshacer."
        confirmLabel="Sí, cancelar"
        cancelLabel="Volver"
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
