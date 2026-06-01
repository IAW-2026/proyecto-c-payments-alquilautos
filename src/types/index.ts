export interface Transaction {
  id: string;
  id_pago: number;
  cliente: string;
  iniciales: string;
  color: string;
  vehiculo: string;
  fecha: string;
  monto: number;
  estado: "Aprobada" | "Pendiente" | "Cancelada" | "Coordinada";
}
