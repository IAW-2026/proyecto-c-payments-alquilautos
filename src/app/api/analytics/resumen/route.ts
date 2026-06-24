import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const desde = searchParams.get("desde");
    const hasta = searchParams.get("hasta");

    const params: (string | number)[] = [];
    let dateFilter = "";
    let idx = 0;

    if (desde) {
      idx++;
      dateFilter += ` AND p.fecha >= $${idx}::date`;
      params.push(desde);
    }
    if (hasta) {
      idx++;
      dateFilter += ` AND p.fecha <= $${idx}::date`;
      params.push(hasta);
    }

    const baseFilter = `WHERE 1=1${dateFilter}`;

    const mainQuery = `
      SELECT
        COALESCE(SUM(p.monto_pagar) FILTER (WHERE p.estado = 'Pagada'), 0) AS ventas_totales,
        COALESCE(AVG(p.monto_pagar) FILTER (WHERE p.estado = 'Pagada'), 0) AS ticket_promedio,
        COUNT(*)::int AS pagos_totales,
        COUNT(*) FILTER (WHERE p.estado = 'Pagada')::int AS pagos_aprobados,
        COUNT(*) FILTER (WHERE p.estado = 'Pendiente')::int AS pendientes,
        COUNT(*) FILTER (WHERE p.estado = 'Cancelada')::int AS cancelados
      FROM "Pago" p
      ${baseFilter}
    `;

    const [main]: any = await db.$queryRawUnsafe(mainQuery, ...params);

    const tasaAprobacion =
      main.pagos_totales > 0
        ? Math.round((main.pagos_aprobados / main.pagos_totales) * 1000) / 10
        : 0;

    const topFilter = `WHERE p.estado = 'Pagada'${dateFilter}`;
    const topParams = [...params];
    const topQuery = `
      SELECT
        p.id_propietario,
        COUNT(*)::int AS ventas,
        ROUND(SUM(p.monto_pagar)::numeric, 2)::float AS monto
      FROM "Pago" p
      ${topFilter}
      GROUP BY p.id_propietario
      ORDER BY COUNT(*) DESC
      LIMIT 1
    `;
    const [topPropietario]: any = await db.$queryRawUnsafe(topQuery, ...topParams);

    const recurFilter = `${baseFilter.replaceAll("p.", "")}`;
    const recurParams = [...params];
    const recurQuery = `
      WITH alquilador_counts AS (
        SELECT id_alquilador, COUNT(*)::int AS reservas
        FROM "Pago"
        ${recurFilter}
        GROUP BY id_alquilador
      )
      SELECT
        COUNT(*) FILTER (WHERE reservas > 1)::int AS recurrentes,
        COUNT(*)::int AS total
      FROM alquilador_counts
    `;
    const [recurrentes]: any = await db.$queryRawUnsafe(recurQuery, ...recurParams);

    const alquiladoresRecurrentesPct =
      recurrentes.total > 0
        ? Math.round((recurrentes.recurrentes / recurrentes.total) * 1000) / 10
        : 0;

    const [pagosHoy]: any = await db.$queryRawUnsafe(`
      SELECT COUNT(*)::int AS cantidad
      FROM "Pago"
      WHERE fecha::date = CURRENT_DATE
    `);

    const [mesActual]: any = await db.$queryRawUnsafe(`
      SELECT
        COALESCE(SUM(monto_pagar), 0) AS ingresos,
        COUNT(*)::int AS pagos,
        COUNT(DISTINCT id_propietario)::int AS propietarios_activos
      FROM "Pago"
      WHERE estado = 'Pagada'
        AND fecha >= date_trunc('month', CURRENT_DATE)
        AND fecha < date_trunc('month', CURRENT_DATE) + interval '1 month'
    `);

    const [mesAnterior]: any = await db.$queryRawUnsafe(`
      SELECT COALESCE(SUM(monto_pagar), 0) AS ingresos
      FROM "Pago"
      WHERE estado = 'Pagada'
        AND fecha >= date_trunc('month', CURRENT_DATE) - interval '1 month'
        AND fecha < date_trunc('month', CURRENT_DATE)
    `);

    const crecimientoMensual =
      mesAnterior.ingresos > 0
        ? Math.round(((mesActual.ingresos - mesAnterior.ingresos) / mesAnterior.ingresos) * 1000) / 10
        : 0;

    return NextResponse.json({
      ventas_totales: Math.round(main.ventas_totales * 100) / 100,
      ticket_promedio: Math.round(main.ticket_promedio * 100) / 100,
      ingresos_mes_actual: Math.round(mesActual.ingresos * 100) / 100,
      crecimiento_mensual: crecimientoMensual,
      pagos_totales: main.pagos_totales,
      tasa_aprobacion: tasaAprobacion,
      pendientes: main.pendientes,
      cancelados: main.cancelados,
      pagos_hoy: pagosHoy.cantidad,
      top_propietario: topPropietario
        ? {
            id: topPropietario.id_propietario,
            ventas: topPropietario.ventas,
            monto: topPropietario.monto,
          }
        : null,
      alquiladores_recurrentes: alquiladoresRecurrentesPct,
      propietarios_activos: mesActual.propietarios_activos,
    });
  } catch (error) {
    console.error("Error en GET /api/analytics/resumen:", error);
    return NextResponse.json(
      { error: "Error al obtener resumen de analytics" },
      { status: 500 }
    );
  }
}
