import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/nav/navbar";
import { Footer } from "@/components/nav/footer";
import "leaflet/dist/leaflet.css";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Verifiko — Encuentra prestadores de confianza",
    template: "%s | Verifiko",
  },
  description:
    "Encuentra gasfiters, electricistas, maestros y más, con calificaciones reales de otros usuarios.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
