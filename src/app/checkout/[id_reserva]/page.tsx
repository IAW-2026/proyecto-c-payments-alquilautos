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
      // Obtener el link de pago previamente generado
      const response = await fetch(`/api/pago/link?id_reserva=${id_reserva}`);
      
      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "El pago no está disponible");
        return;
      }

      const data = await response.json();

      if (data.link_pago) {
        // Redirigir a Mercado Pago
        window.location.href = data.link_pago;
      } else {
        alert("Error: No se encontró el link de pago");
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

      <div className="checkout-pay-container">
        <h2 className="checkout-pay-title">Finalizar Pago</h2>
        <p className="checkout-pay-desc">
          Reserva ID: <strong>{id_reserva}</strong>
        </p>
        <p className="checkout-pay-desc">
          Al hacer clic en el botón, serás redirigido a la pasarela segura de <strong>Mercado Pago</strong> para completar tu transacción.
        </p>

        <button
          className="btn-primary checkout-pay-btn-wrapper"
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