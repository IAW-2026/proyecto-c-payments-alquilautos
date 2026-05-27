import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import db from "@/lib/db";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Validamos sesión con Clerk
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // 2. Extraemos email y rol de Public Metadata
    const email = user.primaryEmailAddress?.emailAddress?.toLowerCase();
    const role = user.publicMetadata?.role;

    // 3. Leemos whitelist de emails autorizados
    const adminEmailsEnv = process.env.NEXT_PUBLIC_ADMIN_EMAILS || process.env.ADMIN_EMAILS || "";
    const adminEmails = adminEmailsEnv
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    // 4. Verificamos autorización
    const isAuthorized = role === "admin" || (email && adminEmails.includes(email));
    if (!isAuthorized) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const pagoId = parseInt(id, 10);
    if (isNaN(pagoId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    // 5. Buscamos el pago y validamos que exista y esté Pendiente
    const pago = await db.pago.findUnique({
      where: { id_pago: pagoId },
      include: {
        HistorialEstadoPago: {
          orderBy: { fecha_hora: "desc" },
          take: 1,
        },
      },
    });

    if (!pago) {
      return NextResponse.json({ error: "Transacción no encontrada" }, { status: 404 });
    }

    const ultimoEstado = pago.HistorialEstadoPago[0]?.estado;
    if (ultimoEstado !== "Pendiente") {
      return NextResponse.json(
        { error: "Solo se pueden eliminar transacciones pendientes" },
        { status: 400 }
      );
    }

    // 6. En lugar de borrar físicamente, actualizamos el estado a "Cancelado"
    const pagoCancelado = await db.pago.update({
      where: { id_pago: pagoId },
      data: { estado: "Cancelado" },
    });

    // 7. Agregamos el historial
    await db.historialEstadoPago.create({
      data: {
        id_pago: pagoId,
        estado: "Cancelado",
        descripcion: "Transacción cancelada por administrador",
      },
    });

    // 8. Notificar a las aplicaciones externas (Webhooks Mock)
    const { notifyApp } = await import("@/lib/mockWebhooks");
    await notifyApp("vendedores", pago.id_reserva, "Cancelado");
    await notifyApp("shipping", pago.id_reserva, "Cancelado");

    return NextResponse.json({ success: true, message: "Transacción cancelada correctamente" });
  } catch (error) {
    console.error("Error al eliminar transacción:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}