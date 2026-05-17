export interface Transaction {
  id: string;
  cliente: string;
  iniciales: string;
  color: string;
  vehiculo: string;
  fecha: string;
  monto: number;
  estado: "Completado" | "Pendiente" | "Cancelado";
}

export interface Stat {
  label: string;
  value: string;
  sub: string;
  color: string;
}

export const MOCK_STATS: Stat[] = [
  { label: "Transacciones", value: "24", sub: "+12% vs ayer", color: "var(--brand)" },
  { label: "Promedio Ticket", value: "$202,08", sub: "Monto estable", color: "#10b981" },
  { label: "Reservas Activas", value: "15", sub: "8 en curso", color: "#6366f1" },
];

export const MOCK_TRANSACCIONES: Transaction[] = [
  { id: "#VR-89231", cliente: "Carlos Pérez", iniciales: "CP", color: "#6366f1", vehiculo: "Tesla Model 3", fecha: "14-05-2026", monto: 450, estado: "Completado" },
  { id: "#VR-89230", cliente: "Ana Martínez", iniciales: "AM", color: "#f59e0b", vehiculo: "Audi A4 Sport", fecha: "14-05-2026", monto: 320, estado: "Pendiente" },
  { id: "#VR-89229", cliente: "Juan Rodríguez", iniciales: "JR", color: "#10b981", vehiculo: "BMW X5 Excellence", fecha: "13-05-2026", monto: 1200, estado: "Completado" },
  { id: "#VR-89228", cliente: "Laura García", iniciales: "LG", color: "#8b5cf6", vehiculo: "Jeep Wrangler", fecha: "12-05-2026", monto: 580, estado: "Cancelado" },
  { id: "#VR-89227", cliente: "Marcos Acuña", iniciales: "MA", color: "#ef4444", vehiculo: "Renault Twingo", fecha: "12-05-2026", monto: 150, estado: "Completado" },
  { id: "#VR-89226", cliente: "Sofía Braun", iniciales: "SB", color: "#10b981", vehiculo: "Citroën Mehari", fecha: "11-05-2026", monto: 200, estado: "Completado" },
  { id: "#VR-89225", cliente: "Julián Álvarez", iniciales: "JA", color: "#3b82f6", vehiculo: "Suzuki Vitara", fecha: "11-05-2026", monto: 890, estado: "Pendiente" },
  { id: "#VR-89224", cliente: "Lucía Fernández", iniciales: "LF", color: "#f59e0b", vehiculo: "Toyota Hilux", fecha: "10-05-2026", monto: 1100, estado: "Completado" },
  { id: "#VR-89223", cliente: "Diego Forlán", iniciales: "DF", color: "#6366f1", vehiculo: "Ford Mustang", fecha: "10-05-2026", monto: 2500, estado: "Completado" },
  { id: "#VR-89222", cliente: "Enzo Pérez", iniciales: "EP", color: "#000000", vehiculo: "Mercedes-Benz G-Class", fecha: "09-05-2026", monto: 3500, estado: "Cancelado" },
  { id: "#VR-89221", cliente: "Martina Stoessel", iniciales: "MS", color: "#ec4899", vehiculo: "Fiat 500", fecha: "09-05-2026", monto: 400, estado: "Completado" },
  { id: "#VR-89220", cliente: "Lionel Scaloni", iniciales: "LS", color: "#1e3a8a", vehiculo: "Volkswagen Amarok", fecha: "08-05-2026", monto: 950, estado: "Pendiente" }
];

export const ESTADO_STYLES: Record<string, { bg: string; color: string }> = {
  Completado: { bg: "#dcfce7", color: "#16a34a" },
  Aprobado: { bg: "#dcfce7", color: "#16a34a" },
  Pendiente: { bg: "#fef9c3", color: "#a16207" },
  Cancelado: { bg: "#fee2e2", color: "#dc2626" },
};

export function formatCurrency(n: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(n);
}
