import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id_reserva, id_alquilador, id_propietario, monto_pagar } = body;

    if (!id_reserva || !monto_pagar) {
      return NextResponse.json({ error: "Faltan datos obligatorios" }, { status: 400 });
    }

    // Crear el pago en la base de datos siguiendo el esquema real
    const nuevoPago = await db.pago.create({
      data: {
        id_reserva: Number(id_reserva),
        id_alquilador: Number(id_alquilador || 0),
        id_propietario: Number(id_propietario || 0),
        monto_pagar: parseFloat(monto_pagar),
        estado: "Pendiente",
      },
    });

    // Registrar en el historial (se llama HistorialEstadoPago)
    await db.historialEstadoPago.create({
      data: {
        id_pago: nuevoPago.id_pago,
        estado: "Pendiente",
        descripcion: "Pago ingresado desde la app de Vendedores",
      },
    });

    return NextResponse.json({ success: true, id_pago: nuevoPago.id_pago, id_reserva: nuevoPago.id_reserva });
  } catch (error) {
    console.error("Error al crear pago:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
