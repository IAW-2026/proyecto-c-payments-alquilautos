import { formatDateTime } from "@/lib/format";

const SELLER_APP_URL = process.env.SELLER_APP_URL;

export async function notificarSellerApp(
  id_reserva: number | string,
  estado: "Cancelada" | "Pagada",
  token: string | null
) {
  if (!SELLER_APP_URL) {
    console.warn("[NOTIFICADOR] SELLER_APP_URL no configurada. Saltando notificación.");
    return;
  }

  if (!token) {
    console.error("[NOTIFICADOR] No hay token de autenticación disponible. Saltando notificación.");
    return;
  }

  const targetUrl = `${SELLER_APP_URL.replace(/\/$/, "")}/api/reserva/${id_reserva}`;

  const payload = {
    estado,
    timestamp: formatDateTime(new Date()),
    id_reserva: String(id_reserva),
  };

  try {
    const res = await fetch(targetUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error(
        `[NOTIFICADOR] La seller app respondió con ${res.status}: ${await res.text().catch(() => "sin cuerpo")}`
      );
      return;
    }

    console.log(`[NOTIFICADOR] Notificación enviada a ${targetUrl} (${estado})`);
  } catch (error) {
    console.error(`[NOTIFICADOR] Error al notificar a la seller app:`, error);
  }
}