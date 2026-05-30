"use server";

import { currentUser } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { notifyApp } from "@/lib/mockWebhooks";

function isAdmin(user: Awaited<ReturnType<typeof currentUser>>): boolean {
  if (!user) return false;
  const email = user.primaryEmailAddress?.emailAddress?.toLowerCase();
  const role = user.publicMetadata?.role;

  const adminEmailsEnv = process.env.NEXT_PUBLIC_ADMIN_EMAILS || process.env.ADMIN_EMAILS || "";
  const adminEmails = adminEmailsEnv
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  return role === "admin" || (!!email && adminEmails.includes(email));
}

export async function getTransactions() {
  const user = await currentUser();
  if (!isAdmin(user)) {
    throw new Error("No autorizado");
  }

  const pagos = await db.pago.findMany({
    orderBy: { fecha: "desc" },
  });

  const transactions = pagos.map((pago) => ({
    id: String(pago.id_pago),
    cliente: `Reserva #${pago.id_reserva}`,
    vehiculo: `Propietario #${pago.id_propietario}`,
    fecha: pago.fecha.toLocaleDateString("es-AR"),
    monto: pago.monto_pagar,
    estado: pago.estado as "Aprobado" | "Pendiente" | "Cancelado" | "Coordinado",
    iniciales: "R" as const,
    color: "#6366f1" as const,
  }));

  const totalVentas = pagos.reduce((acc, p) => acc + p.monto_pagar, 0);
  const pagosAprobados = pagos.filter((p) => p.estado === "Aprobado").length;

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

  if (pago.estado !== "Pendiente" && pago.estado !== "Coordinado") {
    throw new Error("Solo se pueden cancelar transacciones pendientes o coordinadas");
  }

  await db.pago.update({
    where: { id_pago: pagoId },
    data: { estado: "Cancelado" },
  });

  await db.historialEstadoPago.create({
    data: {
      id_pago: pagoId,
      estado: "Cancelado",
      descripcion: "Transacción cancelada por administrador",
    },
  });

  await notifyApp("sellerApp", pago.id_reserva, "Cancelado");
  await notifyApp("shippingApp", pago.id_reserva, "Cancelado");

  revalidatePath("/admin");
  return { success: true };
}