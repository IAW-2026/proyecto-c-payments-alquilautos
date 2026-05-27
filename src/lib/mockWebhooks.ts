export async function notifyApp(
  targetApp: "vendedores" | "shipping",
  id_reserva: number | string,
  estado: "Aprobado" | "Cancelado"
) {
  const targetUrl =
    targetApp === "vendedores"
      ? `https://api.vendedores.local/reserva/${id_reserva}`
      : `https://api.shipping.local/reserva/${id_reserva}`;

  const payload = {
    estado,
    timestamp: new Date().toISOString(),
    id_reserva,
  };

  console.log(`[MOCK WEBHOOK] Enviando a ${targetApp.toUpperCase()}:`);
  console.log(`URL: PATCH ${targetUrl}`);
  console.log(`Payload:`, JSON.stringify(payload, null, 2));

  // Simular un retraso de red
  await new Promise((resolve) => setTimeout(resolve, 500));

  /* 
  En producción esto sería algo así:
  try {
    await fetch(targetUrl, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("Error al notificar", err);
  }
  */

  console.log(`[MOCK WEBHOOK] Notificación enviada con éxito a ${targetApp}.`);
}
