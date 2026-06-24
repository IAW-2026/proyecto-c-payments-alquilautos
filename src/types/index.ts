export interface Transaction {
  id: string;
  id_pago: number;
  id_reserva: string;
  cliente: string;
  iniciales: string;
  color: string;
  vehiculo: string;
  fecha: string;
  monto: number;
  estado: "Pagada" | "Pendiente" | "Cancelada" | "Coordinada";
  pagoEstado: "Pagada" | "Pendiente" | "Cancelada" | "Coordinada";
}
