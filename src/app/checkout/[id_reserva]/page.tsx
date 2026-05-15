import Header from "@/components/checkout/Header";
import Footer from "@/components/checkout/Footer";

export default function CheckoutPage() {
  return (
    <main className="checkout-layout">
      <Header />

      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center", 
        padding: "5rem 2rem",
        gap: "2rem"
      }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2rem" }}>Finalizar Pago</h2>
        <p style={{ color: "var(--text-secondary)", textAlign: "center", maxWidth: "400px" }}>
          Hacé clic en el botón de abajo para procesar tu pago de forma segura a través de nuestra pasarela.
        </p>
        
        <button className="btn-primary" style={{ maxWidth: "300px" }}>
          Pagar Ahora
        </button>
      </div>

      <Footer />
    </main>
  );
}