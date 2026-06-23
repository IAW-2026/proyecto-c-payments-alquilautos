export interface Transaction {
  id: string;
  id_pago: number;
  id_reserva: number;
  cliente: string;
  iniciales: string;
  color: string;
  vehiculo: string;
  fecha: string;
  monto: number;
  estado: "Pagada" | "Pendiente" | "Cancelada" | "Coordinada";
  pagoEstado: "Pagada" | "Pendiente" | "Cancelada" | "Coordinada";
}
