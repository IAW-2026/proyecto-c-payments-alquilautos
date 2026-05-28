import { NextResponse } from "next/server";
import db from "@/lib/db";
import { mpPreference } from "@/lib/mercado-pago";

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

    // Crear la Preference en Mercado Pago para generar el link de pago
    const preference = await mpPreference.create({
      body: {
        items: [
          {
            id: String(nuevoPago.id_pago),
            title: `Reserva #${id_reserva}`,
            quantity: 1,
            unit_price: parseFloat(monto_pagar),
            currency_id: "ARS",
          },
        ],
        external_reference: String(nuevoPago.id_pago),
        notification_url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://payments-app.com"}/api/webhooks/mercado-pago`,
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_BASE_URL || "https://payments-app.com"}/success`,
          failure: `${process.env.NEXT_PUBLIC_BASE_URL || "https://payments-app.com"}/failure`,
          pending: `${process.env.NEXT_PUBLIC_BASE_URL || "https://payments-app.com"}/pending`,
        },
        auto_return: "approved",
      },
    });

    const link_pago = preference.init_point || preference.sandbox_init_point;

    // Guardar el link de pago en la base de datos
    await db.pago.update({
      where: { id_pago: nuevoPago.id_pago },
      data: { link_pago },
    });

    // Registrar en el historial (HistorialEstadoPago)
    await db.historialEstadoPago.create({
      data: {
        id_pago: nuevoPago.id_pago,
        estado: "Pendiente",
        descripcion: "Pago ingresado desde la app de Vendedores",
      },
    });

    return NextResponse.json({
      success: true,
      id_pago: nuevoPago.id_pago,
      id_reserva: nuevoPago.id_reserva,
      link_pago,
    });
  } catch (error) {
    console.error("Error al crear pago:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
