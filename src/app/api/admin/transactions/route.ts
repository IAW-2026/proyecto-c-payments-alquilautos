import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import db from "@/lib/db";

export async function GET() {
  try {
    // 1. Validamos sesión con Clerk
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // 2. Extraemos email y rol de Public Metadata
    const email = user.primaryEmailAddress?.emailAddress?.toLowerCase();
    const role = user.publicMetadata?.role;

    // 3. Leemos whitelist de emails autorizados (con soporte para el prefijo público del frontend)
    const adminEmailsEnv = process.env.NEXT_PUBLIC_ADMIN_EMAILS || process.env.ADMIN_EMAILS || "";
    const adminEmails = adminEmailsEnv
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    // 4. Verificamos autorización (por rol 'admin' o si está en la whitelist de emails)
    const isAuthorized = role === "admin" || (email && adminEmails.includes(email));

    if (!isAuthorized) {
      return NextResponse.json({ error: "No autorizado para ver este panel" }, { status: 403 });
    }
    // Obtenemos todos los pagos con su historial ordenado por fecha
    const pagos = await db.pago.findMany({
      include: {
        HistorialEstadoPago: {
          orderBy: {
            fecha_hora: 'desc',
          },
          take: 1, // Solo nos interesa el último estado para el listado
        },
      },
      orderBy: {
        fecha: 'desc',
      },
    });

    // Mapeamos al formato que espera el frontend del admin
    const transactions = pagos.map((pago) => {
      const ultimoEstado = pago.HistorialEstadoPago[0];
      return {
        id: String(pago.id_pago),
        cliente: `Reserva #${pago.id_reserva}`,
        vehiculo: `Propietario #${pago.id_propietario}`,
        fecha: pago.fecha.toLocaleDateString('es-AR'),
        monto: pago.monto_pagar,
        estado: ultimoEstado?.estado || "Pendiente",
        // Datos extra para la estética de la tabla
        iniciales: "R",
        color: "#6366f1" 
      };
    });

    // Calcular estadísticas básicas (KPIs)
    const totalVentas = pagos.reduce((acc, p) => acc + p.monto_pagar, 0);
    const pagosAprobados = pagos.filter(p => p.HistorialEstadoPago[0]?.estado === "Aprobado").length;

    return NextResponse.json({
      transactions,
      stats: {
        totalVentas,
        cantidadPagos: pagos.length,
        pagosAprobados
      }
    });
  } catch (error) {
    console.error("Error en API Admin:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
