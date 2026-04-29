import type { Metadata, Viewport } from "next";
import { Cinzel, DM_Sans, JetBrains_Mono, Orbitron } from "next/font/google";
import "./globals.css";

/* ═══ Font Configuration (zero layout shift via next/font) ═══ */

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

/* ═══ SEO Metadata ═══ */

export const metadata: Metadata = {
  title: {
    default: "Archive of the Shattered Star — Praneesh R V",
    template: "%s | Praneesh R V",
  },
  description:
    "Praneesh R V's cybersecurity portfolio: CTF results, security projects, skills, and technical writeups presented as a post-apocalyptic shattered-star archive.",
  keywords: [
    "Praneesh R V",
    "cybersecurity portfolio",
    "CTF player India",
    "web exploitation",
    "OSINT",
    "Arch Linux",
    "security researcher",
  ],
  authors: [{ name: "Praneesh R V" }],
  creator: "Praneesh R V",
  metadataBase: new URL("https://praneeshrv.me"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://praneeshrv.me",
    siteName: "Praneesh R V",
    title: "Archive of the Shattered Star — Praneesh R V",
    description:
      "Praneesh R V's cybersecurity portfolio: CTF results, security projects, skills, and technical writeups presented as a post-apocalyptic shattered-star archive.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Archive of the Shattered Star — Praneesh R V",
    description:
      "Praneesh R V's cybersecurity portfolio: CTF results, security projects, skills, and technical writeups presented as a post-apocalyptic shattered-star archive.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#030406",
  width: "device-width",
  initialScale: 1,
};

/* ═══ Root Layout ═══ */

import { CustomCursor } from "@/components/ui/CustomCursor";
import { MainContent } from "./MainContent";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${dmSans.variable} ${jetbrainsMono.variable} ${cinzel.variable}`}
    >
      <body
        suppressHydrationWarning
        className="min-h-dvh flex flex-col antialiased bg-void"
      >
        <CustomCursor />
        <MainContent>{children}</MainContent>
      </body>
    </html>
  );
}
