import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="checkout-layout home-layout">
      <Header />
      
      <main className="home-main">
        <div className="home-hero-container fade-up">
          <h1 className="home-hero-title">
            PaymentsApp
          </h1>
          <p className="home-hero-desc">
            La infraestructura de pagos más robusta y segura para tu negocio. 
            Procesá transacciones, gestioná suscripciones y escalá tus ingresos sin límites.
          </p>
        </div>

        <div className="home-actions-container fade-up fade-up-delay-1">
          <Link href="/admin" className="home-link">
            <button className="btn-primary home-primary-btn">
              Ingresar
            </button>
          </Link>
        </div>

        <div className="home-features-grid">
           {[
             { title: "Seguridad Bancaria", desc: "Cumplimiento con estándares PCI-DSS y encriptación de alta seguridad en cada movimiento." },
             { title: "Liquidación 24h", desc: "Recibí tu dinero en tu cuenta bancaria de forma ágil y sin complicaciones burocráticas." },
             { title: "Dashboard Global", desc: "Visualizá métricas en tiempo real, gestioná reembolsos y analizá el crecimiento de tu negocio." }
           ].map((feature, i) => (
             <div key={i} className="fade-up home-feature-card" style={{ animationDelay: `${0.3 + i * 0.1}s` }}>
                 <h3 className="home-feature-title">{feature.title}</h3>
                 <p className="home-feature-desc">{feature.desc}</p>
             </div>
           ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
