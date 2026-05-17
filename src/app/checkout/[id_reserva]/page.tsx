"use client";

import { useState } from "react";
import Header from "@/components/checkout/Header";
import Footer from "@/components/checkout/Footer";
import { useParams } from "next/navigation";

export default function CheckoutPage() {
  const params = useParams();
  const id_reserva = params?.id_reserva;
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      // 1. Nos aseguramos de que el pago existe (lógica de prueba para ti)
      await fetch("/api/pago", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          id_reserva: id_reserva, 
          monto_pagar: 150,
          id_alquilador: 1,
          id_propietario: 1
        }),
      });

      // 2. Creamos la preferencia de Mercado Pago
      const prefResponse = await fetch("/api/pago/preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_reserva }),
      });

      const data = await prefResponse.json();

      if (data.init_point) {
        // Redirigir a Mercado Pago
        window.location.href = data.init_point;
      } else {
        alert(data.error || "Error al generar link de pago");
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
          Al hacer clic en el botón, serás redirigido a la pasarela segura de <strong>Mercado Pago</strong> para completar tu transacción.
        </p>
        
        <button 
          className="btn-primary" 
          style={{ maxWidth: "300px" }}
          onClick={handlePay}
          disabled={loading}
        >
          {loading ? "Generando link..." : "Pagar con Mercado Pago"}
        </button>
      </div>

      <Footer />
    </main>
  );
}