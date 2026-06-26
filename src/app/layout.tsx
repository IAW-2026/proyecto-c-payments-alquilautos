import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { esES } from "@clerk/localizations";
import "./globals.css";

export const metadata: Metadata = {
  title: "AlquilAutos — Pagos",
  description: "Plataforma de alquiler de vehículos entre particulares",
  icons: "/logo.jpeg",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://clerk.accounts.dev" />
      </head>
      <body className="antialiased">
        <ClerkProvider appearance={{ baseTheme: dark }} localization={esES}>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
