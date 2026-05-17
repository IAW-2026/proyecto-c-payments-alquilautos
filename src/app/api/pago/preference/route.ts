import { NextResponse } from "next/server";
import { mpPreference } from "@/lib/mercado-pago";
import db from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { id_reserva } = await request.json();

    // Buscar los datos del pago en nuestra DB
    const pago = await db.pago.findFirst({
      where: { id_reserva: Number(id_reserva) },
      orderBy: { fecha: 'desc' }
    });

    if (!pago) {
      return NextResponse.json({ error: "No se encontró el pago" }, { status: 404 });
    }

    // Crear la preferencia en Mercado Pago
    const response = await mpPreference.create({
      body: {
        items: [
          {
            id: String(pago.id_pago),
            title: `Reserva #${pago.id_reserva}`,
            quantity: 1,
            unit_price: pago.monto_pagar,
            currency_id: "USD", // O "ARS" dependiendo de tu necesidad
          },
        ],
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
          failure: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/failure`,
          pending: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/pending`,
        },
        auto_return: "approved",
        notification_url: `${process.env.NEXT_PUBLIC_WEBHOOK_URL}/api/webhooks/mercado-pago`,
        external_reference: String(pago.id_pago),
      },
    });

    return NextResponse.json({ init_point: response.init_point });
  } catch (error) {
    console.error("Error al crear preferencia:", error);
    return NextResponse.json({ error: "Error interno al procesar con Mercado Pago" }, { status: 500 });
  }
}
