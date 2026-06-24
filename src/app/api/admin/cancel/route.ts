import { NextResponse } from "next/server";
import { currentUser, Token } from "@clerk/nextjs/server";
import { isAdminUser } from "@/lib/admin";
import db from "@/lib/db";
import { notificarSellerApp } from "@/lib/notificadorSeller";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const user = await currentUser();
    if (!isAdminUser(user)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { id_pago } = await request.json();
    if (!id_pago) {
      return NextResponse.json({ error: "Falta id_pago" }, { status: 400 });
    }

    const pagoId = Number(id_pago);
    const pago = await db.pago.findUnique({ where: { id_pago: pagoId } });
    if (!pago) {
      return NextResponse.json({ error: "Transacción no encontrada" }, { status: 404 });
    }

    if (pago.estado === "Pagada" || pago.estado === "Cancelada") {
      return NextResponse.json({ error: "La transacción ya está en un estado final" }, { status: 400 });
    }

    await db.pago.update({
      where: { id_pago: pagoId },
      data: { estado: "Cancelada" },
    });

    await db.historialEstadoPago.create({
      data: {
        id_pago: pagoId,
        estado: "Cancelada",
        descripcion: "Transacción cancelada por administrador",
      },
    });

    const { getToken } = await auth();
    const token = await getToken();

    if (!token){
        return Response.json({ error: "sin token" });
    }

    await notificarSellerApp(pago.id_reserva, "Cancelada", token);

    revalidatePath("/admin");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al cancelar transacción:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
