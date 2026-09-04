import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import VercelAnalytics from "@/components/VercelAnalytics";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://voleyzuniga.com"),
  title: {
    default: "Club Voley Zúñiga | Formamos Campeones",
    template: "%s | Voley Zúñiga"
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/logo.svg", type: "image/svg+xml" }
    ],
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  description: "Club deportivo premium de voleibol en Medellín, Antioquia. Formación de élite, desarrollo atlético y valores competitivos.",
  keywords: ["voleibol", "medellin", "club deportivo", "voley", "antioquia", "entrenamiento", "deporte"],
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "https://voleyzuniga.com",
    title: "Club Voley Zúñiga | Formamos Campeones",
    description: "Club deportivo premium de voleibol en Medellín, Antioquia. Formación de élite y valores competitivos.",
    siteName: "Voley Zúñiga",
    images: [{
      url: "/logo.svg",
      width: 800,
      height: 600,
      alt: "Club Voley Zúñiga"
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Club Voley Zúñiga | Formamos Campeones",
    description: "Club deportivo premium de voleibol en Medellín, Antioquia.",
    images: ["/logo.svg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SportsClub",
  "name": "Club Voley Zúñiga",
  "image": "https://voleyzuniga.com/logo.svg",
  "description": "Club deportivo premium de voleibol en Medellín, Antioquia.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Medellín",
    "addressRegion": "Antioquia",
    "addressCountry": "CO"
  },
  "telephone": "+573128459210",
  "url": "https://voleyzuniga.com"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${oswald.variable} scroll-smooth antialiased`}
    >
      <body className="min-h-screen flex flex-col font-sans text-white bg-[#071426] selection:bg-[#F29A2E] selection:text-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <CartProvider>
          <Header />
          <CartDrawer />
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </CartProvider>
        <VercelAnalytics />
      </body>
    </html>
  );
}
