import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="auth-layout">
      <div className="auth-container">
        <div className="auth-header">
          <span className="auth-tagline">Plataforma de Pagos</span>
          <h1 className="auth-title">ALQUILAUTOS</h1>
          <p className="auth-subtitle">
            Registrá tu cuenta para empezar a gestionar transacciones.
          </p>
        </div>

        <div className="auth-card-wrapper">
          <SignUp />
        </div>
      </div>
    </main>
  );
}
