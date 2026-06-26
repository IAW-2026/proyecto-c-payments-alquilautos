import { NextResponse } from "next/server";
import { Payment } from "mercadopago";
import client, { verifyMercadoPagoSignature } from "@/lib/mercado-pago";
import db from "@/lib/db";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();

    // Verificación de firma no bloqueante — loguea warning si falla pero procesa igual
    const xSignature = request.headers.get("x-signature");
    const xRequestId = request.headers.get("x-request-id");
    if (xSignature || xRequestId) {
      const isValid = verifyMercadoPagoSignature(rawBody, xSignature, xRequestId);
      if (!isValid) {
        console.warn("Firma de Mercado Pago inválida — se procesa igual");
      }
    }

    // Mercado Pago envía notificaciones webhook o IPN en varios formatos.
    const url = new URL(request.url);
    const queryId = url.searchParams.get("id");
    const queryTopic = url.searchParams.get("topic");
    const queryDataId = url.searchParams.get("data.id");

    let paymentId: string | null = null;

    try {
      const body = JSON.parse(rawBody);
      // Formato 1: { type: "payment", data: { id } }
      if (body.type === "payment" && body.data?.id) {
        paymentId = String(body.data.id);
      }
      // Formato 2: { action: "payment.created", data: { id } }
      else if (body.action?.startsWith("payment.") && body.data?.id) {
        paymentId = String(body.data.id);
      }
      // Formato 3: { id: 123 } (ID directo en el body)
      else if (body.id && body.topic === "payment") {
        paymentId = String(body.id);
      }
      // Formato 4: { data: { id } } sin type/action
      else if (body.data?.id) {
        paymentId = String(body.data.id);
      }
    } catch {
      // Body no es JSON, probamos con query params
      if (queryTopic === "payment" && queryId) {
        paymentId = queryId;
      } else if (queryDataId) {
        paymentId = queryDataId;
      }
    }

    console.log(`[WEBHOOK] Notificación recibida. paymentId: ${paymentId}, topic: ${queryTopic}, xSignature: ${!!xSignature}`);

    if (!paymentId) {
      console.log("[WEBHOOK] No se detectó un ID de pago en la notificación.");
      return new NextResponse("OK", { status: 200 });
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

    // 4. Mapear el estado de Mercado Pago a nuestro estado.
    // Si MP rechaza o cancela el intento de pago, queda en "Pendiente" para que
    // el usuario pueda reintentar. Solo el admin puede cancelar desde el panel.
    let nuevoEstado = "Pendiente";
    if (mpStatus === "approved") {
      nuevoEstado = "Pagada";
    }

    // 5. Actualizar nuestra base de datos (Pago y HistorialEstadoPago)
    const pagoActualizado = await db.pago.update({
      where: { id_pago: Number(id_pago) },
      data: { estado: nuevoEstado },
    });

    await db.historialEstadoPago.create({
      data: {
        id_pago: Number(id_pago),
        estado: nuevoEstado,
        descripcion: `Mercado Pago: ${mpStatusDetail || mpStatus}`,
      },
    });

    console.log(`Pago ${id_pago} actualizado a ${nuevoEstado} vía Webhook.`);

    // 6. Notificar a las aplicaciones externas si corresponde.
    // Solo se notifica cuando MP aprueba el pago.
    // La cancelación la dispara el admin desde la pantalla de transacciones.
    if (nuevoEstado === "Pagada") {
      const { notificarSellerApp } = await import("@/lib/notificadorSeller");
      const { getServiceAccountToken } = await import("@/lib/clerk-service-account");
      const token = await getServiceAccountToken();
      await notificarSellerApp(pagoActualizado.id_reserva, "Pagada", token);
    }

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("Error en Webhook Mercado Pago:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}