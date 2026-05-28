import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id_reserva = searchParams.get("id_reserva");

    if (!id_reserva) {
      return NextResponse.json({ error: "Falta id_reserva" }, { status: 400 });
    }

    const pago = await db.pago.findUnique({
      where: { id_reserva: Number(id_reserva) },
      select: { id_pago: true, link_pago: true },
    });

    if (!pago) {
      return NextResponse.json({ error: "Pago no encontrado para esta reserva" }, { status: 404 });
    }

    if (!pago.link_pago) {
      return NextResponse.json({ error: "El pago no tiene un link generado aún" }, { status: 404 });
    }

    return NextResponse.json({
      id_pago: pago.id_pago,
      link_pago: pago.link_pago,
    });
  } catch (error) {
    console.error("Error al obtener link de pago:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}