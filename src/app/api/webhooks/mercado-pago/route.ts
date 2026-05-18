import { NextResponse } from "next/server";
import { Payment } from "mercadopago";
import client from "@/lib/mercado-pago";
import db from "@/lib/db";

export async function POST(request: Request) {
  try {
    // Mercado Pago envía notificaciones webhook o IPN.
    // Usualmente la URL recibe query params (id, topic) o un JSON en el body con (type, data.id)
    const url = new URL(request.url);
    const queryId = url.searchParams.get("id");
    const queryTopic = url.searchParams.get("topic");

    let paymentId: string | null = null;

    // 1. Tratamos de obtener el ID del pago del body (formato Webhook de MP)
    try {
      const body = await request.json();
      if (body.type === "payment" && body.data?.id) {
        paymentId = body.data.id;
      } else if (body.action?.startsWith("payment.") && body.data?.id) {
        paymentId = body.data.id;
      }
    } catch (error) {
      // Body no es JSON válido o no está presente, intentamos con query params (formato IPN antiguo)
      if (queryTopic === "payment" && queryId) {
        paymentId = queryId;
      }
    }

    if (!paymentId) {
      console.log("No se detectó un ID de pago en la notificación.");
      return new NextResponse("OK", { status: 200 }); // Siempre devolver 200 a MP rápidamente
    }

    // 2. Consultar el pago en Mercado Pago usando el SDK
    const paymentClient = new Payment(client);
    const paymentInfo = await paymentClient.get({ id: paymentId });

    // 3. Extraer la referencia externa (nuestro id_pago) y el estado
    const id_pago = paymentInfo.external_reference;
    const mpStatus = paymentInfo.status; // 'approved', 'pending', 'rejected', etc.
    const mpStatusDetail = paymentInfo.status_detail;

    if (!id_pago) {
      console.error("El pago de Mercado Pago no tiene external_reference.");
      return new NextResponse("OK", { status: 200 });
    }

    // 4. Mapear el estado de Mercado Pago a nuestro estado
    let nuevoEstado = "Pendiente";
    if (mpStatus === "approved") {
      nuevoEstado = "Aprobado";
    } else if (mpStatus === "rejected" || mpStatus === "cancelled") {
      nuevoEstado = "Cancelado";
    }

    // 5. Actualizar nuestra base de datos (HistorialEstadoPago)
    await db.historialEstadoPago.create({
      data: {
        id_pago: Number(id_pago),
        estado: nuevoEstado,
        descripcion: `Mercado Pago: ${mpStatusDetail || mpStatus}`,
      }
    });

    console.log(`Pago ${id_pago} actualizado a ${nuevoEstado} vía Webhook.`);

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("Error en Webhook Mercado Pago:", error);
    // Aunque haya error interno, es buena práctica devolver 200 a MP para que no reintente infinitamente,
    // o 500 si se quiere que MP reintente la notificación más tarde.
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
