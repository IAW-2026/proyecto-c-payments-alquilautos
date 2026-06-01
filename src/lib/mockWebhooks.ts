import { formatDateTime } from "@/lib/format";

export async function notifyApp(
  id_reserva: number | string,
  estado: "Aprobada" | "Cancelada" | "Pagada"
) {
  const targetUrl = `https://api.vendedores.local/reserva/${id_reserva}`;

  const payload = {
    estado,
    timestamp: formatDateTime(new Date()),
    id_reserva,
  };

  console.log(`[MOCK WEBHOOK] Enviando a SELLERAPP:`);
  console.log(`URL: PATCH ${targetUrl}`);
  console.log(`Payload:`, JSON.stringify(payload, null, 2));

  // Simular un retraso de red
  await new Promise((resolve) => setTimeout(resolve, 500));

  console.log(`[MOCK WEBHOOK] Notificación enviada con éxito a SELLERAPP.`);
}
