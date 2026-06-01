"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useParams } from "next/navigation";

export default function CheckoutPage() {
  const params = useParams();
  const id_reserva = params?.id_reserva;
  const [loading, setLoading] = useState(false);
  const [testMonto, setTestMonto] = useState("");
  const [testAlquilador, setTestAlquilador] = useState("");
  const [testPropietario, setTestPropietario] = useState("");
  const [creando, setCreando] = useState(false);
  const [pagoCreado, setPagoCreado] = useState(false);
  const [linkPago, setLinkPago] = useState("");
  const [errorTest, setErrorTest] = useState("");

  const handlePay = async () => {
    setLoading(true);
    try {
      const patchResponse = await fetch(`/api/pago/${id_reserva}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: "Pendiente" }),
      });

      if (!patchResponse.ok) {
        const error = await patchResponse.json();
        alert(error.error || "No se pudo iniciar el pago");
        return;
      }

      if (linkPago) {
        window.location.href = linkPago;
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

  const handleCrearPagoTest = async () => {
    if (!testMonto) {
      setErrorTest("El monto es obligatorio");
      return;
    }

    setCreando(true);
    setErrorTest("");

    try {
      const res = await fetch("/api/pago", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_reserva: Number(id_reserva),
          monto_pagar: parseFloat(testMonto),
          id_alquilador: Number(testAlquilador) || 0,
          id_propietario: Number(testPropietario) || 0,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorTest(data.error || "Error al crear el pago");
        return;
      }

      if (!data.link_pago) {
        setErrorTest("El pago se creó pero no se pudo generar el link de Mercado Pago. Revisá las credenciales.");
        return;
      }

      setLinkPago(data.link_pago);
      setPagoCreado(true);
    } catch {
      setErrorTest("Error de conexión");
    } finally {
      setCreando(false);
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
          disabled={loading || !pagoCreado}
        >
          {loading ? "Generando link..." : "Pagar con Mercado Pago"}
        </button>

        {!pagoCreado && (
          <p className="checkout-test-hint">
            Creá un pago de prueba abajo para habilitar el botón
          </p>
        )}

        <div className="checkout-test-section">
          <div className="checkout-test-divider">── Zona de Test ──</div>

          <div className="checkout-test-form">
            <div className="checkout-test-field">
              <label htmlFor="monto">Monto *</label>
              <input
                id="monto"
                type="number"
                step="0.01"
                placeholder="15000.00"
                value={testMonto}
                onChange={(e) => setTestMonto(e.target.value)}
                disabled={pagoCreado}
              />
            </div>

            <div className="checkout-test-field">
              <label htmlFor="id-alquilador">ID Alquilador</label>
              <input
                id="id-alquilador"
                type="number"
                placeholder="0"
                value={testAlquilador}
                onChange={(e) => setTestAlquilador(e.target.value)}
                disabled={pagoCreado}
              />
            </div>

            <div className="checkout-test-field">
              <label htmlFor="id-propietario">ID Propietario</label>
              <input
                id="id-propietario"
                type="number"
                placeholder="0"
                value={testPropietario}
                onChange={(e) => setTestPropietario(e.target.value)}
                disabled={pagoCreado}
              />
            </div>

            {!pagoCreado ? (
              <button
                className="btn-test"
                onClick={handleCrearPagoTest}
                disabled={creando}
              >
                {creando ? "Creando..." : "Crear pago de prueba"}
              </button>
            ) : (
              <div className="checkout-test-success">
                <span>✓ Pago creado correctamente</span>
                <button
                  className="btn-test btn-test-reset"
                  onClick={() => {
                    setPagoCreado(false);
                    setLinkPago("");
                    setTestMonto("");
                    setTestAlquilador("");
                    setTestPropietario("");
                    setErrorTest("");
                  }}
                >
                  Crear otro
                </button>
              </div>
            )}

            {errorTest && <p className="checkout-test-error">{errorTest}</p>}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
