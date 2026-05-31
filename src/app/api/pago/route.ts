import { NextResponse } from "next/server";
import db from "@/lib/db";
import { mpPreference } from "@/lib/mercado-pago";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://payments-app.com";

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
        estado: "Coordinada",
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
        notification_url: `${BASE_URL}/api/webhooks/mercado-pago`,
        back_urls: {
          success: `${BASE_URL}/`,
          failure: `${BASE_URL}/`,
          pending: `${BASE_URL}/`,
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
        estado: "Coordinada",
        descripcion: "Pago coordinado desde la app de Vendedores",
      },
    });

    return NextResponse.json({
      success: true,
      id_pago: nuevoPago.id_pago,
      id_reserva: nuevoPago.id_reserva,
      link_pago,
    });
  } catch (error: unknown) {
    console.error("Error al crear pago:", error);
    const err = error as Record<string, unknown>;
    const status = typeof err.status === "number" ? err.status : 500;
    const mpMessage = typeof err.message === "string" ? err.message : "";
    const message =
      status === 401 || mpMessage.includes("401")
        ? "Error de autenticación con Mercado Pago. Revisá el ACCESS_TOKEN."
        : mpMessage.includes("ENOTFOUND") || mpMessage.includes("ECONNREFUSED") || mpMessage.includes("fetch")
        ? "No se pudo conectar con Mercado Pago. Revisá tu conexión a internet."
        : "Error interno al crear el pago";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
