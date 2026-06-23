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
    <main className="min-h-dvh grid grid-rows-[auto_1fr_auto]">
      <Header />

      <div className="flex flex-col items-center justify-center py-20 px-8 gap-8 max-md:py-12 max-md:px-6 max-sm:py-6 max-sm:px-4 max-sm:gap-5">
        <h2 className="font-display text-3xl text-text-primary max-md:text-[1.75rem] max-sm:text-[1.35rem]">Finalizar Pago</h2>
        <p className="text-text-secondary text-center max-w-[400px] max-sm:text-[0.85rem]">
          Reserva ID: <strong>{id_reserva}</strong>
        </p>
        <p className="text-text-secondary text-center max-w-[400px] max-sm:text-[0.85rem]">
          Al hacer clic en el botón, serás redirigido a la pasarela segura de <strong>Mercado Pago</strong> para completar tu transacción.
        </p>

        <div className="max-w-[300px] w-full">
          <button
            className="w-full py-[0.9rem] px-6 bg-brand text-white font-sans text-[0.9375rem] font-semibold tracking-wider border-none rounded-xl cursor-pointer shadow-btn transition-all duration-150 hover:bg-brand-hover hover:shadow-btn-hover hover:-translate-y-px active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={handlePay}
            disabled={loading || !pagoCreado}
          >
            {loading ? "Generando link..." : "Pagar con Mercado Pago"}
          </button>
        </div>

        {!pagoCreado && (
          <p className="text-center text-text-muted text-[0.85rem] -mt-4">
            Creá un pago de prueba abajo para habilitar el botón
          </p>
        )}

        <div className="w-full max-w-[400px] mt-4 pt-6 border-t border-border">
          <div className="text-center text-[0.8rem] font-semibold tracking-widest text-text-muted mb-5">
            &horbar;&horbar; Zona de Test &horbar;&horbar;
          </div>

          <div className="flex flex-col gap-[0.9rem]">
            <div className="flex flex-col gap-[0.3rem]">
              <label className="text-[0.8rem] font-semibold text-text-secondary" htmlFor="monto">Monto *</label>
              <input
                id="monto"
                type="number"
                step="0.01"
                placeholder="15000.00"
                value={testMonto}
                onChange={(e) => setTestMonto(e.target.value)}
                disabled={pagoCreado}
                className="py-[0.6rem] px-3 border border-border rounded-lg font-sans text-[0.9rem] text-text-primary outline-none transition-colors focus:border-brand"
              />
            </div>

            <div className="flex flex-col gap-[0.3rem]">
              <label className="text-[0.8rem] font-semibold text-text-secondary" htmlFor="id-alquilador">ID Alquilador</label>
              <input
                id="id-alquilador"
                type="number"
                placeholder="0"
                value={testAlquilador}
                onChange={(e) => setTestAlquilador(e.target.value)}
                disabled={pagoCreado}
                className="py-[0.6rem] px-3 border border-border rounded-lg font-sans text-[0.9rem] text-text-primary outline-none transition-colors focus:border-brand"
              />
            </div>

            <div className="flex flex-col gap-[0.3rem]">
              <label className="text-[0.8rem] font-semibold text-text-secondary" htmlFor="id-propietario">ID Propietario</label>
              <input
                id="id-propietario"
                type="number"
                placeholder="0"
                value={testPropietario}
                onChange={(e) => setTestPropietario(e.target.value)}
                disabled={pagoCreado}
                className="py-[0.6rem] px-3 border border-border rounded-lg font-sans text-[0.9rem] text-text-primary outline-none transition-colors focus:border-brand"
              />
            </div>

            {!pagoCreado ? (
              <button
                className="py-[0.65rem] px-4 bg-brand text-white font-sans text-[0.85rem] font-semibold border-none rounded-lg cursor-pointer transition-colors hover:bg-brand-hover disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={handleCrearPagoTest}
                disabled={creando}
              >
                {creando ? "Creando..." : "Crear pago de prueba"}
              </button>
            ) : (
              <div className="flex items-center justify-between py-[0.65rem] px-3 bg-brand-light rounded-lg text-[0.85rem] font-semibold text-brand">
                <span>&check; Pago creado correctamente</span>
                <button
                  className="bg-transparent text-brand border border-brand text-[0.8rem] hover:bg-brand-light py-[0.65rem] px-4 font-sans font-semibold rounded-lg cursor-pointer transition-colors"
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

            {errorTest && <p className="text-[#dc2626] text-[0.8rem] text-center">{errorTest}</p>}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
