import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AlquilAutos — Pagos",
  description: "Plataforma de alquiler de vehículos entre particulares",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}