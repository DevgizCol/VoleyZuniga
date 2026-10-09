import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import StoreClient from "./StoreClient";
import { getProducts } from "@/lib/content";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Tienda",
  alternates: { canonical: "/tienda" },
  description: "Camisetas personalizadas, balones y accesorios del Club Voley Zúñiga.",
};

const STEPS = [
  { title: "Arma tu pedido", text: "Personaliza la camiseta y agrega lo que necesites al carrito." },
  { title: "Confírmalo por WhatsApp", text: "El carrito arma el mensaje con tu pedido; te respondemos con el pago." },
  { title: "Recógelo en la sede", text: "Te avisamos cuando esté listo para entregarlo en el entrenamiento." },
];

export default async function StorePage() {
  const products = await getProducts();
  return (
    <>
      <PageHero kicker="Tienda del club" title="Viste los colores" intro="Pides aquí y confirmas por WhatsApp. Sin pasarelas ni registros: pagas por transferencia y recoges en la sede." />
      <StoreClient products={products} />
      <section className="bg-[#071426] text-white py-20 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="font-heading font-black uppercase text-5xl leading-none mb-10">Cómo comprar</h2>
          <ol className="grid md:grid-cols-3 gap-8">
            {STEPS.map((s, i) => (
              <li key={s.title}>
                <div className="court-rule mb-5" />
                <span className="font-heading font-black text-6xl text-[#F29A2E] leading-none">{i + 1}</span>
                <h3 className="font-heading font-bold text-2xl mt-3 mb-2">{s.title}</h3>
                <p className="text-[#B7C4D8]">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
