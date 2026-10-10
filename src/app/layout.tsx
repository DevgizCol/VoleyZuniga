import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { siteUrl } from "@/lib/site-url";
import VercelAnalytics from "@/components/VercelAnalytics";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

// Fuentes servidas desde el propio sitio (licencia SIL OFL): más rápido y sin depender de Google Fonts.
const figtree = localFont({
  variable: "--font-figtree",
  display: "swap",
  src: [
    { path: "../assets/fonts/figtree-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../assets/fonts/figtree-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../assets/fonts/figtree-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../assets/fonts/figtree-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  fallback: ["system-ui", "Arial", "sans-serif"],
});

const display = localFont({
  variable: "--font-display",
  display: "swap",
  src: [
    { path: "../assets/fonts/big-shoulders-display-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../assets/fonts/big-shoulders-display-latin-700-normal.woff2", weight: "700", style: "normal" },
    { path: "../assets/fonts/big-shoulders-display-latin-800-normal.woff2", weight: "800", style: "normal" },
    { path: "../assets/fonts/big-shoulders-display-latin-900-normal.woff2", weight: "900", style: "normal" },
  ],
  fallback: ["Arial Narrow", "Arial", "sans-serif"],
});


export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Club de voleibol en Medellín | Voley Zúñiga",
    template: "%s | Voley Zúñiga"
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Voley Zúñiga",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/icon-192.png",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  description: "Club de voleibol en Medellín para niños, jóvenes y adultos desde los 7 años. Cinco categorías, dos sedes y clase de prueba sin costo.",
  keywords: ["voleibol", "club de voleibol", "voleibol Medellín", "escuela de voleibol", "voleibol para niños", "voley", "Antioquia"],
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: siteUrl,
    title: "Club de voleibol en Medellín | Voley Zúñiga",
    description: "Voleibol en Medellín desde los 7 años. Reserva tu clase de prueba sin costo.",
    siteName: "Voley Zúñiga",
  },
  twitter: {
    card: "summary_large_image",
    title: "Club de voleibol en Medellín | Voley Zúñiga",
    description: "Voleibol en Medellín desde los 7 años. Reserva tu clase de prueba sin costo.",
  },
  // Códigos de Google Search Console y Bing Webmaster Tools: se ponen como variables de entorno en Vercel.
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION } : undefined,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#071426" },
    { media: "(prefers-color-scheme: dark)", color: "#071426" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${figtree.variable} ${display.variable} scroll-smooth antialiased`}
    >
      <body className="min-h-screen flex flex-col font-sans text-white bg-[#071426] selection:bg-[#F29A2E] selection:text-white">
        <CartProvider>{children}</CartProvider>
        {/* Los scripts de analítica solo existen en Vercel; en Docker u otro hosting darían 404. */}
        {process.env.VERCEL ? <VercelAnalytics /> : null}
      </body>
    </html>
  );
}
