export interface Transaction {
  id: string;
  cliente: string;
  iniciales: string;
  color: string;
  vehiculo: string;
  fecha: string;
  monto: number;
  estado: "Aprobada" | "Pendiente" | "Cancelada" | "Coordinada";
}

export const ESTADO_STYLES: Record<string, { bg: string; color: string }> = {
  Aprobada: { bg: "#dcfce7", color: "#16a34a" },
  Pendiente: { bg: "#fef9c3", color: "#a16207" },
  Cancelada: { bg: "#fee2e2", color: "#dc2626" },
  Coordinada: { bg: "#dbeafe", color: "#1d4ed8" },
};

export function formatCurrency(n: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 2 }).format(n);
}
