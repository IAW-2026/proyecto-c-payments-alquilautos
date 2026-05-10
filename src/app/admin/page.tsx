// src/app/admin/page.tsx

import Header from "@/components/checkout/Header";
import Footer from "@/components/checkout/Footer";

const MOCK_STATS = {
  totalHoy: 4850,
  variacion: "+12.5%",
  transacciones: 24,
  promedioTicket: 202.08,
  reservasActivas: 15,
};

const MOCK_TRANSACCIONES = [
  { id: "#VR-89231", cliente: "Carlos Pérez",   iniciales: "CP", color: "#6366f1", vehiculo: "Tesla Model 3 - Red",    fecha: "Hoy, 10:45 AM",  monto: 450,  estado: "Completado" },
  { id: "#VR-89230", cliente: "Ana Martínez",   iniciales: "AM", color: "#f59e0b", vehiculo: "Audi A4 Sport",          fecha: "Hoy, 09:12 AM",  monto: 320,  estado: "Pendiente"  },
  { id: "#VR-89229", cliente: "Juan Rodríguez", iniciales: "JR", color: "#10b981", vehiculo: "BMW X5 Excellence",      fecha: "Ayer, 06:30 PM", monto: 1200, estado: "Completado" },
  { id: "#VR-89228", cliente: "Laura García",   iniciales: "LG", color: "#8b5cf6", vehiculo: "Jeep Wrangler Rubicon",  fecha: "Ayer, 04:15 PM", monto: 580,  estado: "Cancelado"  },
];

const ESTADO_STYLES: Record<string, { bg: string; color: string }> = {
  Completado: { bg: "#dcfce7", color: "#16a34a" },
  Pendiente:  { bg: "#fef9c3", color: "#a16207" },
  Cancelado:  { bg: "#fee2e2", color: "#dc2626" },
};

function formatCurrency(n: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(n);
}

export default function AdminPanel() {
  return (
    <div style={{ minHeight: "100dvh", display: "grid", gridTemplateRows: "auto 1fr auto", fontFamily: "var(--font)", background: "var(--bg)" }}>
      <Header />

      <div style={{ padding: "2.5rem 3rem", display: "flex", flexDirection: "column", gap: "1.75rem" }}>

        {/* Título + búsqueda */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <h1 style={{ fontFamily: "var(--font)", fontSize: "2rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.1 }}>
              Panel de Administración
            </h1>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
              Gestión centralizada de transacciones y flota.
            </p>
          </div>
          <div style={{ position: "relative", width: "320px" }}>
            <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none", display: "flex" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </span>
            <input
              type="text"
              placeholder="Buscar transacciones por cliente o ID..."
              readOnly
              style={{ width: "100%", padding: "0.6rem 1rem 0.6rem 2.5rem", border: "1px solid var(--border)", borderRadius: "10px", fontFamily: "var(--font)", fontSize: "0.875rem", color: "var(--text-primary)", background: "var(--surface)", outline: "none" }}
            />
          </div>
        </div>

        {/* Stats */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", boxShadow: "var(--shadow-card)", padding: "1.75rem 2rem" }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: "0.4rem" }}>
            Total Recaudado Hoy
          </p>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: 700, color: "var(--text-primary)", display: "flex", alignItems: "baseline", gap: "0.75rem" }}>
            {formatCurrency(MOCK_STATS.totalHoy)}
            <span style={{ fontFamily: "var(--font)", fontSize: "0.8rem", fontWeight: 600, color: "var(--brand)", background: "var(--brand-light)", padding: "2px 8px", borderRadius: "999px" }}>
              ↑ {MOCK_STATS.variacion}
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, auto)", gap: "2.5rem", marginTop: "1.25rem", paddingTop: "1.25rem", borderTop: "1px solid var(--border-light)", justifyContent: "start" }}>
            {[
              { label: "Transacciones",   value: MOCK_STATS.transacciones },
              { label: "Promedio Ticket", value: formatCurrency(MOCK_STATS.promedioTicket) },
              { label: "Reservas Activas", value: MOCK_STATS.reservasActivas },
            ].map((s) => (
              <div key={s.label}>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.2rem" }}>{s.label}</p>
                <p style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--text-primary)" }}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabla */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", boxShadow: "var(--shadow-card)", overflow: "hidden" }}>
          
          {/* Tabla header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 1.75rem", borderBottom: "1px solid var(--border-light)" }}>
            <span style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)" }}>Transacciones Recientes</span>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {[
                { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>, label: "Filtrar" },
                { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>, label: "Exportar" },
              ].map((btn) => (
                <button key={btn.label} style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.45rem 0.875rem", border: "1px solid var(--border)", borderRadius: "8px", background: "var(--surface)", fontFamily: "var(--font)", fontSize: "0.8125rem", fontWeight: 500, color: "var(--text-secondary)", cursor: "pointer" }}>
                  {btn.icon}{btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tabla body */}
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--bg)" }}>
                {["ID Transacción", "Cliente", "Vehículo", "Fecha", "Monto", "Estado", ""].map((h) => (
                  <th key={h} style={{ padding: "0.75rem 1.75rem", textAlign: "left", fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", borderBottom: "1px solid var(--border-light)", whiteSpace: "nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_TRANSACCIONES.map((t, i) => (
                <tr key={t.id} style={{ borderBottom: i < MOCK_TRANSACCIONES.length - 1 ? "1px solid var(--border-light)" : "none" }}>
                  <td style={{ padding: "1rem 1.75rem", fontFamily: "monospace", fontSize: "0.8rem", color: "var(--text-muted)" }}>{t.id}</td>
                  <td style={{ padding: "1rem 1.75rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                      <span style={{ width: "32px", height: "32px", borderRadius: "50%", background: t.color, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                        {t.iniciales}
                      </span>
                      <span style={{ fontWeight: 500, color: "var(--text-primary)", fontSize: "0.875rem" }}>{t.cliente}</span>
                    </div>
                  </td>
                  <td style={{ padding: "1rem 1.75rem", fontSize: "0.875rem", color: "var(--text-primary)" }}>{t.vehiculo}</td>
                  <td style={{ padding: "1rem 1.75rem", fontSize: "0.875rem", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>{t.fecha}</td>
                  <td style={{ padding: "1rem 1.75rem", fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap" }}>{formatCurrency(t.monto)}</td>
                  <td style={{ padding: "1rem 1.75rem" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: "999px", fontSize: "0.78rem", fontWeight: 600, background: ESTADO_STYLES[t.estado].bg, color: ESTADO_STYLES[t.estado].color }}>
                      {t.estado}
                    </span>
                  </td>
                  <td style={{ padding: "1rem 1.75rem" }}>
                    <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: "4px", borderRadius: "6px", display: "flex" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Paginación */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.75rem", borderTop: "1px solid var(--border-light)" }}>
            <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>Mostrando 4 de 128 transacciones</span>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {["Anterior", "Siguiente"].map((label) => (
                <button key={label} style={{ padding: "0.4rem 0.875rem", border: "1px solid var(--border)", borderRadius: "8px", background: "var(--surface)", fontFamily: "var(--font)", fontSize: "0.8125rem", fontWeight: 500, color: "var(--text-secondary)", cursor: "pointer" }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}