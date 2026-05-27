import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id_reserva = searchParams.get("id_reserva");

    if (!id_reserva) {
      return NextResponse.json({ error: "Falta id_reserva" }, { status: 400 });
    }

    // Devolvemos el link estático hacia nuestro propio front-end checkout
    // Nota: El baseUrl debería obtenerse de variables de entorno en prod
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const checkoutLink = `${baseUrl}/checkout/${id_reserva}`;

    return NextResponse.json({ link: checkoutLink });
  } catch (error) {
    console.error("Error al obtener el link:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
