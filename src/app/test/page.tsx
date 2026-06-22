"use client";

import { useState } from "react";

export default function TestPage() {
  const [idReserva, setIdReserva] = useState("");
  const [monto, setMonto] = useState("");
  const [idAlquilador, setIdAlquilador] = useState("");
  const [idPropietario, setIdPropietario] = useState("");

  const [pagoCreado, setPagoCreado] = useState<{ id_pago: number; id_reserva: number } | null>(null);
  const [linkPago, setLinkPago] = useState("");
  const [patchResult, setPatchResult] = useState("");

  const [loadingPost, setLoadingPost] = useState(false);
  const [loadingGet, setLoadingGet] = useState(false);
  const [loadingPatch, setLoadingPatch] = useState(false);
  const [error, setError] = useState("");

  const crearPago = async () => {
    if (!idReserva || !monto) {
      setError("Faltan id_reserva y monto");
      return;
    }
    setLoadingPost(true);
    setError("");
    setPagoCreado(null);
    setLinkPago("");
    setPatchResult("");

    try {
      const res = await fetch("/api/pago", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "sk_seller_a4f6c8e2b1d9",
        },
        body: JSON.stringify({
          id_reserva: Number(idReserva),
          monto_pagar: parseFloat(monto),
          id_alquilador: Number(idAlquilador) || 0,
          id_propietario: Number(idPropietario) || 0,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al crear pago");
        return;
      }
      setPagoCreado(data);
    } catch {
      setError("Error de conexión");
    } finally {
      setLoadingPost(false);
    }
  };

  const obtenerLink = async () => {
    const id = pagoCreado?.id_reserva || Number(idReserva);
    if (!id) return;

    setLoadingGet(true);
    setError("");

    try {
      const res = await fetch(`/api/pago/link?id_reserva=${id}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al obtener link");
        return;
      }
      setLinkPago(data.link_pago);
    } catch {
      setError("Error de conexión");
    } finally {
      setLoadingGet(false);
    }
  };

  const iniciarPago = async () => {
    const id = pagoCreado?.id_reserva || Number(idReserva);
    if (!id) return;

    setLoadingPatch(true);
    setError("");

    try {
      const res = await fetch(`/api/pago/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: "Pendiente" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al iniciar pago");
        return;
      }
      setPatchResult("Estado cambiado a Pendiente correctamente");
    } catch {
      setError("Error de conexión");
    } finally {
      setLoadingPatch(false);
    }
  };

  return (
    <main className="min-h-dvh bg-bg p-8 max-sm:p-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="font-display text-3xl">Test de Integración</h1>
          <p className="text-text-secondary mt-1">
            Simulá el flujo completo: Seller App → POST → GET link → PATCH
          </p>
        </div>

        <section className="bg-surface rounded-xl p-6 shadow-card space-y-4">
          <h2 className="font-display text-xl">1. Seller crea un pago (POST /api/pago)</h2>

          <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
            <Input label="ID Reserva *" value={idReserva} onChange={setIdReserva} />
            <Input label="Monto *" value={monto} onChange={setMonto} type="number" />
            <Input label="ID Alquilador" value={idAlquilador} onChange={setIdAlquilador} />
            <Input label="ID Propietario" value={idPropietario} onChange={setIdPropietario} />
          </div>

          <button
            className="w-full py-3 px-6 bg-brand text-white font-semibold rounded-xl cursor-pointer hover:bg-brand-hover disabled:opacity-60 transition-colors"
            onClick={crearPago}
            disabled={loadingPost}
          >
            {loadingPost ? "Creando..." : "Crear pago"}
          </button>

          {pagoCreado && (
            <div className="bg-brand-light rounded-lg p-4 text-sm font-mono">
              <p>✅ Pago creado</p>
              <p>id_pago: <strong>{pagoCreado.id_pago}</strong></p>
              <p>id_reserva: <strong>{pagoCreado.id_reserva}</strong></p>
            </div>
          )}
        </section>

        <section className="bg-surface rounded-xl p-6 shadow-card space-y-4">
          <h2 className="font-display text-xl">2. Buyer obtiene link (GET /api/pago/link)</h2>
          <button
            className="w-full py-3 px-6 bg-brand text-white font-semibold rounded-xl cursor-pointer hover:bg-brand-hover disabled:opacity-60 transition-colors"
            onClick={obtenerLink}
            disabled={loadingGet}
          >
            {loadingGet ? "Obteniendo..." : "Obtener link de pago"}
          </button>

          {linkPago && (
            <div className="bg-brand-light rounded-lg p-4 text-sm break-all">
              <p>🔗 Link de pago:</p>
              <a href={linkPago} target="_blank" className="text-brand underline font-semibold">
                {linkPago}
              </a>
            </div>
          )}
        </section>

        <section className="bg-surface rounded-xl p-6 shadow-card space-y-4">
          <h2 className="font-display text-xl">3. Buyer inicia pago (PATCH /api/pago/[id])</h2>
          <p className="text-text-secondary text-sm">Cambia estado de Coordinada a Pendiente</p>
          <button
            className="w-full py-3 px-6 bg-brand text-white font-semibold rounded-xl cursor-pointer hover:bg-brand-hover disabled:opacity-60 transition-colors"
            onClick={iniciarPago}
            disabled={loadingPatch}
          >
            {loadingPatch ? "Actualizando..." : "Iniciar pago"}
          </button>

          {patchResult && (
            <div className="bg-brand-light rounded-lg p-4 text-sm">
              <p>✅ {patchResult}</p>
            </div>
          )}
        </section>

        <section className="bg-surface rounded-xl p-6 shadow-card">
          <h2 className="font-display text-xl mb-2">Log</h2>
          <pre className="bg-[#111] text-green-400 p-4 rounded-lg text-xs min-h-[60px] whitespace-pre-wrap font-mono">
            {error || "Sin errores"}
          </pre>
        </section>
      </div>
    </main>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-text-secondary">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="py-2 px-3 border border-border rounded-lg text-sm outline-none focus:border-brand transition-colors"
      />
    </div>
  );
}
