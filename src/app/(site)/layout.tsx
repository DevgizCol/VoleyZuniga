import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import MobileBar from "@/components/MobileBar";
import { getCourtNotices } from "@/lib/court";
import { getSettings } from "@/lib/content";
import { ContactProvider } from "@/components/ContactProvider";
import SiteTracker from "@/components/SiteTracker";

// Estructura del sitio público: encabezado con aviso de canchas, carrito, pie y barra móvil.
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [notices, settings] = await Promise.all([getCourtNotices(), getSettings()]);
  return (
    <ContactProvider value={settings.contact}>
      <Header notices={notices} />
      <CartDrawer />
      <main id="contenido" className="flex-1">
        {children}
      </main>
      <Footer />
      <MobileBar />
      <SiteTracker />
    </ContactProvider>
  );
}
