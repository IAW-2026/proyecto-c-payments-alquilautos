import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "radial-gradient(circle at top right, #1e1b4b, transparent), radial-gradient(circle at bottom left, #09090b, #000)",
      color: "#fff",
      padding: "2rem",
    }}>
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1.5rem",
        maxWidth: "480px",
        width: "100%"
      }}>
        <div style={{ textAlign: "center", marginBottom: "0.5rem" }}>
          <span style={{
            fontSize: "0.85rem",
            fontWeight: 600,
            letterSpacing: "0.2em",
            color: "#6366f1",
            textTransform: "uppercase"
          }}>
            Plataforma de Pagos
          </span>
          <h1 style={{
            fontSize: "2.25rem",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            background: "linear-gradient(to right, #ffffff, #94a3b8)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginTop: "0.5rem",
            marginBottom: "0.25rem"
          }}>
            ALQUILAUTOS
          </h1>
          <p style={{ color: "#64748b", fontSize: "0.95rem" }}>
            Ingresá tus credenciales para acceder al panel de control.
          </p>
        </div>

        <div style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(99, 102, 241, 0.1)"
        }}>
          <SignIn />
        </div>
      </div>
    </div>
  );
}
