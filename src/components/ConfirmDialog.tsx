"use client";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title = "Confirmar",
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onCancel}>
      <div
        className="bg-surface border border-border rounded-2xl p-6 max-w-sm w-full mx-4 shadow-card"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-display text-lg font-semibold text-text-primary mb-2">{title}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="py-2 px-4 rounded-xl border border-border bg-surface text-text-primary text-sm font-semibold cursor-pointer transition-all hover:bg-border-light"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="py-2 px-4 rounded-xl bg-[#dc2626] text-white text-sm font-semibold cursor-pointer transition-all hover:bg-[#b91c1c]"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
