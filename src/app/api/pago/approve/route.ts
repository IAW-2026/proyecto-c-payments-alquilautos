import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id_reserva } = body;

    const pago = await db.pago.findFirst({
      where: { id_reserva: Number(id_reserva) },
      orderBy: { fecha: 'desc' }
    });

    if (!pago) {
      return NextResponse.json({ error: "No se encontró un pago para esta reserva" }, { status: 404 });
    }

    await db.historialEstadoPago.create({
      data: {
        id_pago: pago.id_pago,
        estado: "Aprobado",
        descripcion: "Pago aprobado manualmente desde el botón de prueba",
      }
    });

    return NextResponse.json({ success: true, estado: "Aprobado" });
  } catch (error) {
    console.error("Error al aprobar pago:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
