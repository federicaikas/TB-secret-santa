import type { Metadata, Viewport } from "next";
import { Caveat_Brush, Inter } from "next/font/google";
import "./globals.css";
import Sparkles from "@/components/Sparkles";
import CardFlip from "@/components/CardFlip";
import LightBody from "@/components/LightBody";

const title = Caveat_Brush({ weight: "400", subsets: ["latin"], variable: "--font-title" });
// Testi: sans serif pulito e leggibile, font variabile (tutti i pesi 100-900).
const text = Inter({ subsets: ["latin"], variable: "--font-text", display: "swap" });

export const metadata: Metadata = {
  title: "TB Secret Santa",
  description: "Il Babbo Natale segreto di TeleBoario",
  appleWebApp: { capable: true, title: "TB Secret Santa", statusBarStyle: "black-translucent" },
  icons: { icon: [{ url: "/icon.svg", type: "image/svg+xml" }, { url: "/favicon-64.png", sizes: "64x64", type: "image/png" }], apple: "/icon-180.png" },
};

export const viewport: Viewport = { themeColor: "#1f5c36", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it">
      <body className={`${title.variable} ${text.variable}`}><Sparkles /><CardFlip /><LightBody />{children}</body>
    </html>
  );
}
