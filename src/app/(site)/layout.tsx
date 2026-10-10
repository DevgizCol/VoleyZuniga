import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import MobileBar from "@/components/MobileBar";
import { getCourtNotices } from "@/lib/court";
import { getSessions, getSettings } from "@/lib/content";
import { ContactProvider } from "@/components/ContactProvider";
import JsonLd from "@/components/JsonLd";
import { clubJsonLd } from "@/lib/club-jsonld";

// Estructura del sitio público: encabezado con aviso de canchas, carrito, pie y barra móvil.
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [notices, settings, sessions] = await Promise.all([getCourtNotices(), getSettings(), getSessions()]);
  return (
    <ContactProvider value={settings.contact}>
      <JsonLd data={clubJsonLd(settings.contact, sessions)} />
      <Header notices={notices} />
      <CartDrawer />
      <main id="contenido" className="flex-1">
        {children}
      </main>
      <Footer />
      <MobileBar />
    </ContactProvider>
  );
}
