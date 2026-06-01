"use server";

import { currentUser } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { notifyApp } from "@/lib/mockWebhooks";
import { isAdminUser, type ClerkUserForRoleCheck } from "@/lib/admin";

function isAdmin(user: Awaited<ReturnType<typeof currentUser>>): boolean {
  return isAdminUser(user as ClerkUserForRoleCheck);
}

export async function getTransactions() {
  const user = await currentUser();
  if (!isAdmin(user)) {
    throw new Error("No autorizado");
  }

  const historial = await db.historialEstadoPago.findMany({
    include: { Pago: true },
    orderBy: [
      { id_pago: "desc" },
      { fecha_hora: "desc" },
    ],
  });

  const transactions = historial.map((entry) => ({
    id: String(entry.id_historial_estado_pago),
    id_pago: entry.id_pago,
    cliente: `Reserva #${entry.Pago.id_reserva}`,
    vehiculo: `Propietario #${entry.Pago.id_propietario}`,
    fecha: entry.fecha_hora.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    monto: entry.Pago.monto_pagar,
    estado: entry.estado as "Aprobada" | "Pendiente" | "Cancelada" | "Coordinada",
    pagoEstado: entry.Pago.estado as "Aprobada" | "Pendiente" | "Cancelada" | "Coordinada",
    iniciales: "R" as const,
    color: "#6366f1" as const,
  }));

  const pagos = await db.pago.findMany();
  const pagosAprobadosList = pagos.filter((p) => p.estado === "Aprobada");
  const totalVentas = pagosAprobadosList.reduce((acc, p) => acc + p.monto_pagar, 0);
  const pagosAprobados = pagosAprobadosList.length;

  return {
    transactions,
    stats: {
      totalVentas,
      cantidadPagos: pagos.length,
      pagosAprobados,
    },
  };
}

export async function cancelTransaction(id: string) {
  const user = await currentUser();
  if (!isAdmin(user)) {
    throw new Error("No autorizado");
  }

  const pagoId = parseInt(id, 10);
  if (isNaN(pagoId)) {
    throw new Error("ID inválido");
  }

  const pago = await db.pago.findUnique({
    where: { id_pago: pagoId },
  });

  if (!pago) {
    throw new Error("Transacción no encontrada");
  }

  if (pago.estado !== "Pendiente" && pago.estado !== "Coordinada") {
    throw new Error("Solo se pueden cancelar transacciones pendientes o coordinadas");
  }

  await db.pago.update({
    where: { id_pago: pagoId },
    data: { estado: "Cancelada" },
  });

  await db.historialEstadoPago.create({
    data: {
      id_pago: pagoId,
      estado: "Cancelada",
      descripcion: "Transacción cancelada por administrador",
    },
  });

  await notifyApp("sellerApp", pago.id_reserva, "Cancelada");
  await notifyApp("shippingApp", pago.id_reserva, "Cancelada");

  revalidatePath("/admin");
  return { success: true };
}