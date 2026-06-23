interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message = "Verificando credenciales..." }: LoadingSpinnerProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg text-text-secondary font-sans">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-3 border-border border-t-brand rounded-full animate-spin" />
        <span>{message}</span>
      </div>
    </div>
  );
}
