import Link from "next/link";
import Header from "@/components/checkout/Header";
import Footer from "@/components/checkout/Footer";

export default function Home() {
  return (
    <div className="checkout-layout" style={{ background: "#000" }}>
      <Header />
      
      <main style={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center", 
        padding: "6rem 2rem",
        textAlign: "center",
        gap: "4rem",
        background: "radial-gradient(circle at top right, #1a1c23, transparent), #000",
        color: "#fff"
      }}>
        <div style={{ maxWidth: "800px", display: "flex", flexDirection: "column", gap: "1.5rem" }} className="fade-up">
          <h1 style={{ 
            fontFamily: "var(--font-display)", 
            fontSize: "5rem", 
            fontWeight: 700, 
            lineHeight: 1,
            color: "#fff",
            letterSpacing: "-0.02em"
          }}>
            PaymentsApp
          </h1>
          <p style={{ 
            fontSize: "1.25rem", 
            color: "#9aa3b2",
            maxWidth: "650px",
            margin: "0 auto",
            lineHeight: 1.6
          }}>
            La infraestructura de pagos más robusta y segura para tu negocio. 
            Procesá transacciones, gestioná suscripciones y escalá tus ingresos sin límites.
          </p>
        </div>

        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", justifyContent: "center" }} className="fade-up fade-up-delay-1">
          <Link href="/admin" style={{ textDecoration: "none" }}>
            <button className="btn-primary" style={{ 
              minWidth: "220px", 
              padding: "1.2rem 3rem", 
              fontSize: "1.1rem",
              background: "#fff",
              color: "#000",
              border: "none",
              boxShadow: "0 10px 20px rgba(255,255,255,0.1)"
            }}>
              Ingresar
            </button>
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem", width: "100%", maxWidth: "1100px", marginTop: "4rem" }}>
           {[
             { title: "Seguridad Bancaria", desc: "Cumplimiento con estándares PCI-DSS y encriptación de alta seguridad en cada movimiento." },
             { title: "Liquidación 24h", desc: "Recibí tu dinero en tu cuenta bancaria de forma ágil y sin complicaciones burocráticas." },
             { title: "Dashboard Global", desc: "Visualizá métricas en tiempo real, gestioná reembolsos y analizá el crecimiento de tu negocio." }
           ].map((feature, i) => (
             <div key={i} className="fade-up" style={{ 
               animationDelay: `${0.3 + i * 0.1}s`,
               background: "#111318",
               border: "1px solid #222",
               borderRadius: "24px",
               padding: "2.5rem",
               textAlign: "left"
             }}>
                 <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "#fff", marginBottom: "1rem" }}>{feature.title}</h3>
                 <p style={{ fontSize: "0.95rem", color: "#666", lineHeight: 1.6 }}>{feature.desc}</p>
             </div>
           ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
