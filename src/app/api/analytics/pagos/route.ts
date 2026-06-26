import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

type Periodo = "dia" | "semana" | "mes";

function validarPeriodo(val: string | null): Periodo {
  if (val === "dia" || val === "semana" || val === "mes") return val;
  return "mes";
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const periodo = validarPeriodo(searchParams.get("periodo"));
    const desde = searchParams.get("desde") || null;
    const hasta = searchParams.get("hasta") || null;

    const truncMap: Record<Periodo, string> = {
      dia: "day",
      semana: "week",
      mes: "month",
    };

    const rows: { fecha: string; cantidad: number; monto_promedio: number; monto_total: number }[] =
      await db.$queryRawUnsafe(
        `SELECT
           DATE_TRUNC($1, p.fecha)::date AS fecha,
           COUNT(*)::int AS cantidad,
           ROUND(AVG(p.monto_pagar)::numeric, 2)::float AS monto_promedio,
           ROUND(SUM(p.monto_pagar)::numeric, 2)::float AS monto_total
         FROM "Pago" p
         WHERE p.estado = 'Pagada'
           ${desde ? "AND p.fecha >= $2::date" : ""}
           ${hasta ? `AND p.fecha <= ${desde ? "$3" : "$2"}::date` : ""}
         GROUP BY DATE_TRUNC($1, p.fecha)
         ORDER BY fecha ASC`,
        [truncMap[periodo], desde, hasta].filter(Boolean)
      );

    const totalPagos = rows.reduce((s, r) => s + r.cantidad, 0);
    const montoTotal = rows.reduce((s, r) => s + r.monto_total, 0);

    return NextResponse.json({
      datos: rows,
      periodo,
      total_pagos: totalPagos,
      monto_total: Math.round(montoTotal * 100) / 100,
      monto_promedio_general: totalPagos > 0
        ? Math.round((montoTotal / totalPagos) * 100) / 100
        : 0,
    });
  } catch (error) {
    console.error("Error en GET /api/analytics/pagos:", error);
    return NextResponse.json(
      { error: "Error al obtener datos de analytics" },
      { status: 500 }
    );
  }
}
