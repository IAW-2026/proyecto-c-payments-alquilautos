export interface Transaction {
  id: string;
  cliente: string;
  iniciales: string;
  color: string;
  vehiculo: string;
  fecha: string;
  monto: number;
  estado: "Aprobado" | "Pendiente" | "Cancelado";
}

export const ESTADO_STYLES: Record<string, { bg: string; color: string }> = {
  Aprobado: { bg: "#dcfce7", color: "#16a34a" },
  Pendiente: { bg: "#fef9c3", color: "#a16207" },
  Cancelado: { bg: "#fee2e2", color: "#dc2626" },
};

export function formatCurrency(n: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 2 }).format(n);
}
