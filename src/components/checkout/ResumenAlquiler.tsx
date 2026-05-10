// src/components/checkout/ResumenAlquiler.tsx

export default function ResumenAlquiler() {
  return (
    <div className="card fade-up fade-up-delay-1">

      {/* Imagen del auto */}
      <div className="vehicle-image-wrapper">
        <img src="/audiQ7.jpg" alt="Audi Q7 Quattro" style={{width:"100%", height:"100%", objectFit:"cover", display:"block"}} />
        <div className="vehicle-image-overlay" />
        <div className="vehicle-badges">
          <span className="vehicle-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            7 Plazas
          </span>
          <span className="vehicle-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
            </svg>
            Automático
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="card-body">
        <p className="vehicle-label">Vehículo Seleccionado</p>
        <h2 className="vehicle-name">Audi Q7 Quattro</h2>

        {/* Fechas — mismo estilo que price-row, sin recuadro */}
        <div className="price-row">
          <div>
            <p className="dates-label">Recogida y Devolución</p>
            <p className="dates-value">24 Oct, 2024 – 27 Oct, 2024</p>
          </div>
          <div className="text-right">
            <p className="dates-label">Duración</p>
            <p className="dates-value">3 Días</p>
          </div>
        </div>

        {/* Precio */}
        <div className="price-row">
          <span className="price-label">Tarifa diaria ($120.00 × 3)</span>
          <span className="price-value">$360.00</span>
        </div>

        <div className="divider" />

        <div className="total-row">
          <span className="total-label">Precio Total</span>
          <span className="total-value">$360.00</span>
        </div>

        {/* Nota */}
        <div className="cancel-note">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{flexShrink: 0, marginTop: 1}}>
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M8 7v4M8 5.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <p>Cancelación gratuita hasta 24 horas antes de la recogida.</p>
        </div>
      </div>

    </div>
  );
}