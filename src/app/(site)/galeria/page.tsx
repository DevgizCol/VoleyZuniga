/* eslint-disable @next/next/no-img-element -- las fotos vienen de Drive u otra URL de la hoja */
import type { Metadata } from "next";
import { Camera } from "lucide-react";
import PageHero from "@/components/PageHero";
import { SITE } from "@/config/site";
import { getGallery } from "@/lib/club";
import { longDate } from "@/lib/news";

export const metadata: Metadata = {
  title: "Galería",
  alternates: { canonical: "/galeria" },
  description: "Fotos de entrenamientos, partidos y torneos del Club Voley Zúñiga.",
};

export const revalidate = 300;

export default async function GalleryPage() {
  const photos = await getGallery();

  return (
    <>
      <PageHero kicker="El club en imágenes" title="Galería" intro="Entrenamientos, partidos y torneos: así se vive el voleibol en el club." />
      <section className="bg-[#071426] text-white pb-24 sm:pb-32">
        <div className="container mx-auto px-4 sm:px-6">
          {photos.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0F2347] to-[#071426] p-8 sm:p-12 grid md:grid-cols-[1fr_auto] gap-8 items-center">
              <div>
                <h2 className="font-heading font-black uppercase text-4xl sm:text-5xl leading-none">Pronto, las primeras fotos</h2>
                <p className="mt-4 text-[#C9D5E6] text-lg max-w-xl">Mientras armamos la galería, el día a día del club se publica en Instagram.</p>
              </div>
              <a href={SITE.instagram.url} target="_blank" rel="noopener noreferrer" className="h-12 px-6 inline-flex items-center gap-2 bg-[#F29A2E] hover:bg-[#FFB14A] text-[#071426] font-bold rounded-md">
                <Camera size={18} /> Seguir {SITE.instagram.handle}
              </a>
            </div>
          ) : (
            <ul className="columns-1 sm:columns-2 lg:columns-3 gap-4 [&>li]:mb-4">
              {photos.map((p, i) => (
                <li key={`${p.image}-${i}`} className="break-inside-avoid">
                  <figure className="rounded-xl overflow-hidden border border-white/10 bg-[#0B1E38]">
                    <img src={p.image} alt={p.title || "Foto del Club Voley Zúñiga"} loading={i < 3 ? "eager" : "lazy"} className="w-full h-auto" />
                    {p.title || p.date ? (
                      <figcaption className="px-4 py-3 text-sm">
                        {p.title ? <span className="font-semibold text-white">{p.title}</span> : null}
                        {p.date ? <span className="block text-[#8FA3BF]">{longDate(p.date)}</span> : null}
                      </figcaption>
                    ) : null}
                  </figure>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
