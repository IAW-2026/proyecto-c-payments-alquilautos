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
      // 1. Obtener el pago para conocer el id_pago
      const linkResponse = await fetch(`/api/pago/link?id_reserva=${id_reserva}`);
      
      if (!linkResponse.ok) {
        const error = await linkResponse.json();
        alert(error.error || "El pago no está disponible");
        return;
      }

      const linkData = await linkResponse.json();

      // 2. Cambiar estado de "Coordinado" a "Pendiente"
      const patchResponse = await fetch(`/api/pago`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_reserva: Number(id_reserva), estado: "Pendiente" }),
      });

      if (!patchResponse.ok) {
        const error = await patchResponse.json();
        alert(error.error || "No se pudo iniciar el pago");
        return;
      }

      // 3. Redirigir a Mercado Pago
      if (linkData.link_pago) {
        window.location.href = linkData.link_pago;
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