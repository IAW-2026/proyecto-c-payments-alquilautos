import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id_reserva: string }> }
) {
  try {
    const { id_reserva } = await params;
    const body = await request.json();
    const { estado } = body;

    if (!id_reserva || !estado) {
      return NextResponse.json({ error: "Faltan datos obligatorios" }, { status: 400 });
    }

    const pago = await db.pago.findUnique({
      where: { id_reserva: Number(id_reserva) },
    });

    if (!pago) {
      return NextResponse.json({ error: "Pago no encontrado para esta reserva" }, { status: 404 });
    }

    if (pago.estado !== "Coordinada") {
      return NextResponse.json(
        { error: `No se puede cambiar el estado desde "${pago.estado}" a "${estado}". Solo se permite desde "Coordinada"` },
        { status: 400 }
      );
    }

    await db.pago.update({
      where: { id_pago: pago.id_pago },
      data: { estado },
    });

    await db.historialEstadoPago.create({
      data: {
        id_pago: pago.id_pago,
        estado,
        descripcion: "Pago iniciado desde la app de Compradores (checkout)",
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error al actualizar pago:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
