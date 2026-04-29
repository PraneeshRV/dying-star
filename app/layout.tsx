import type { Metadata, Viewport } from "next";
import { Cinzel, DM_Sans, JetBrains_Mono, Orbitron } from "next/font/google";
import { CustomCursor } from "@/components/ui/CustomCursor";
import {
  absoluteUrl,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
} from "@/lib/site";
import "./globals.css";
import { MainContent } from "./MainContent";

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
    default: SITE_TITLE,
    template: "%s | Praneesh R V",
  },
  description: SITE_DESCRIPTION,
  keywords: [...SITE_KEYWORDS],
  authors: [{ name: "Praneesh R V" }],
  creator: "Praneesh R V",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: absoluteUrl("/"),
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Archive of the Shattered Star - Praneesh R V cybersecurity portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/twitter-image"],
  },
};

export const viewport: Viewport = {
  themeColor: "#030406",
  width: "device-width",
  initialScale: 1,
};

/* ═══ Root Layout ═══ */

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
