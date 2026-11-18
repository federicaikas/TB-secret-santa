import type { Metadata, Viewport } from "next";
import { Caveat_Brush, Fredoka } from "next/font/google";
import "./globals.css";
import Sparkles from "@/components/Sparkles";
import CardFlip from "@/components/CardFlip";

const title = Caveat_Brush({ weight: "400", subsets: ["latin"], variable: "--font-title" });
const text = Fredoka({ subsets: ["latin"], variable: "--font-text" });

export const metadata: Metadata = {
  title: "TB Secret Santa",
  description: "Il Babbo Natale segreto di TeleBoario",
  appleWebApp: { capable: true, title: "TB Secret Santa", statusBarStyle: "black-translucent" },
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
};

export const viewport: Viewport = { themeColor: "#30653d", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it">
      <body className={`${title.variable} ${text.variable}`}><Sparkles /><CardFlip />{children}</body>
    </html>
  );
}
