import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { esES } from "@clerk/localizations";
import { Cormorant, DM_Sans } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "AlquilAutos — Pagos",
  description: "Plataforma de alquiler de vehículos entre particulares",
};

const cormorant = Cormorant({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${cormorant.variable} ${dmSans.variable}`}>
      <head>
        <link rel="preconnect" href="https://clerk.accounts.dev" />
      </head>
      <body className="font-sans antialiased">
        <ClerkProvider appearance={{ baseTheme: dark }} localization={esES}>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
