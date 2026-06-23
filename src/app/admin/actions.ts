"use server";

import { currentUser } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { notificarSellerApp } from "@/lib/notificadorSeller";
import { isAdminUser, type ClerkUserForRoleCheck } from "@/lib/admin";
import { formatDateTime } from "@/lib/format";

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
    id_reserva: entry.Pago.id_reserva,
    cliente: `Reserva #${entry.Pago.id_reserva}`,
    vehiculo: `Propietario #${entry.Pago.id_propietario}`,
    fecha: formatDateTime(entry.fecha_hora),
    monto: entry.Pago.monto_pagar,
    estado: entry.estado as "Pagada" | "Pendiente" | "Cancelada" | "Coordinada",
    pagoEstado: entry.Pago.estado as "Pagada" | "Pendiente" | "Cancelada" | "Coordinada",
    iniciales: "R" as const,
    color: "#6366f1" as const,
  }));

  const pagos = await db.pago.findMany();
  const pagosAprobadosList = pagos.filter((p) => p.estado === "Pagada");
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

  await notificarSellerApp(pago.id_reserva, "Cancelada");

  revalidatePath("/admin");
  return { success: true };
}

type Cotizaciones = Record<"USD" | "EUR" | "GBP", number>;

const cotizacionCache = { valor: {} as Cotizaciones, timestamp: 0 };

export async function getCotizacion(): Promise<Cotizaciones> {
  if (Date.now() - cotizacionCache.timestamp < 300_000) return cotizacionCache.valor;

  const fallback: Cotizaciones = { USD: 1200, EUR: 1300, GBP: 1500 };
  try {
    const res = await fetch("https://api.frankfurter.app/latest?from=ARS&to=USD,EUR,GBP");
    const data = await res.json();
    cotizacionCache.valor = {
      USD: 1 / data.rates.USD,
      EUR: 1 / data.rates.EUR,
      GBP: 1 / data.rates.GBP,
    };
    cotizacionCache.timestamp = Date.now();
  } catch {
    cotizacionCache.valor = fallback;
  }
  return cotizacionCache.valor;
}

export async function getSalesStats() {
  const user = await currentUser();
  if (!isAdmin(user)) {
    throw new Error("No autorizado");
  }

  const pagos = await db.pago.findMany({
    where: { estado: "Pagada" },
    orderBy: { fecha: "asc" },
  });

  const ventasPorDia = new Map<string, number>();
  const ventasPorMes = new Map<string, number>();

  for (const p of pagos) {
    const dia = p.fecha.toLocaleDateString("es-AR", {
      timeZone: "UTC",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).replace(/\//g, "-");

    const mes = p.fecha.toLocaleDateString("es-AR", {
      timeZone: "UTC",
      month: "long",
      year: "numeric",
    });

    ventasPorDia.set(dia, (ventasPorDia.get(dia) || 0) + p.monto_pagar);
    ventasPorMes.set(mes, (ventasPorMes.get(mes) || 0) + p.monto_pagar);
  }

  const ventasPorSemana = new Map<string, number>();
  for (const p of pagos) {
    const d = new Date(p.fecha);
    const diaSemana = d.getUTCDay();
    const diff = d.getUTCDate() - diaSemana + (diaSemana === 0 ? -6 : 1);
    const lunes = new Date(d);
    lunes.setUTCDate(diff);
    const clave = lunes.toLocaleDateString("es-AR", {
      timeZone: "UTC",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).replace(/\//g, "-");
    ventasPorSemana.set(clave, (ventasPorSemana.get(clave) || 0) + p.monto_pagar);
  }

  return {
    ventasPorDia: Array.from(ventasPorDia, ([fecha, monto]) => ({ fecha, monto })),
    ventasPorSemana: Array.from(ventasPorSemana, ([fecha, monto]) => ({ fecha, monto })),
    ventasPorMes: Array.from(ventasPorMes, ([fecha, monto]) => ({ fecha, monto })),
  };
}