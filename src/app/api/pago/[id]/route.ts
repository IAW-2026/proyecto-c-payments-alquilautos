import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const pago = await db.pago.findUnique({
      where: { id_pago: Number(id) },
    });

    if (!pago) {
      return NextResponse.json({ error: "Pago no encontrado" }, { status: 404 });
    }

    return NextResponse.json({
      id_pago: pago.id_pago,
      estado: "Pendiente",
      descripcion: "",
      fecha_hora: pago.fecha.toISOString(),
    });
  } catch (error) {
    console.error("Error al consultar pago:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
