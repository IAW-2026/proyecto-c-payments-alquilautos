import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="auth-layout">
      <div className="auth-container">
        <div className="auth-header">
          <span className="auth-tagline">Plataforma de Pagos</span>
          <h1 className="auth-title">ALQUILAUTOS</h1>
          <p className="auth-subtitle">
            Ingresá tus credenciales para acceder al panel de control.
          </p>
        </div>

        <div className="auth-card-wrapper">
          <SignIn />
        </div>
      </div>
    </main>
  );
}
