"use client";

export default function ConfirmarPagoForm() {
  return (
    <div className="card fade-up" style={{ maxHeight: "fit-content" }}>
      <div className="card-body">
        <div>
          <h1 className="checkout-title">Confirmar Pago</h1>
          <p className="checkout-subtitle">Recuerda revisar los datos antes de continuar</p>
        </div>

        <button className="btn-primary" onClick={() => {}}>
          CONFIRMAR PAGO
        </button>

        <div className="security-badge">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span>Transacción Encriptada y Segura</span>
        </div>
      </div>
    </div>
  );
}