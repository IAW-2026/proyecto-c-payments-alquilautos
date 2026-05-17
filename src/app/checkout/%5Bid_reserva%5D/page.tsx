"use client";

import { useState } from "react";
import Header from "@/components/checkout/Header";
import Footer from "@/components/checkout/Footer";
import { useParams } from "next/navigation";

export default function CheckoutPage() {
  const params = useParams();
  const id_reserva = params?.id_reserva;
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handlePay = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/pago/approve", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_reserva }),
      });

      const data = await response.json();
      if (data.success) {
        setStatus("¡Pago Aprobado!");
      } else {
        alert(data.error || "Error al procesar el pago");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

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
          Reserva ID: <strong>{id_reserva}</strong>
        </p>
        <p style={{ color: "var(--text-secondary)", textAlign: "center", maxWidth: "400px" }}>
          Hacé clic en el botón de abajo para procesar tu pago de forma segura a través de nuestra pasarela.
        </p>
        
        {status ? (
          <div style={{ padding: "1rem 2rem", background: "#dcfce7", color: "#16a34a", borderRadius: "12px", fontWeight: 600 }}>
            {status}
          </div>
        ) : (
          <button 
            className="btn-primary" 
            style={{ maxWidth: "300px" }}
            onClick={handlePay}
            disabled={loading}
          >
            {loading ? "Procesando..." : "Pagar Ahora"}
          </button>
        )}
      </div>

      <Footer />
    </main>
  );
}
