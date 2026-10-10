import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Clock, MapPin, Navigation } from "lucide-react";
import PageHero from "@/components/PageHero";
import JsonLd from "@/components/JsonLd";
import { VENUES, mapEmbed, mapsLink, wazeLink } from "@/data/venues";
import { CATEGORY_PAGES } from "@/data/categories";
import { DAY_NAMES, formatTime } from "@/data/schedule";
import { categorySchedules, getSessions } from "@/lib/content";
import { CLUB_ID, breadcrumbs, openingHours, pageMeta } from "@/lib/seo";
import { siteUrl } from "@/lib/site-url";

// Una página por sede: capta búsquedas por barrio y refuerza la ficha del club en Google Maps.

export const revalidate = 300;
export const dynamicParams = false;

export function generateStaticParams() {
  return VENUES.map((v) => ({ sede: v.id }));
}

const venueOf = (id: string) => VENUES.find((x) => x.id === id);

export async function generateMetadata({ params }: { params: Promise<{ sede: string }> }): Promise<Metadata> {
  const v = venueOf((await params).sede);
  if (!v) return {};
  return pageMeta({
    title: `${v.search} · ${v.name}`,
    path: `/sedes/${v.id}`,
    description: `${v.name}: ${v.description} Horarios de entrenamiento, categorías y cómo llegar.`,
  });
}

export default async function VenuePage({ params }: { params: Promise<{ sede: string }> }) {
  const v = venueOf((await params).sede);
  if (!v) notFound();
  const all = await getSessions();
  const sessions = all.filter((s) => s.sede === v.name);
  const perCategory = categorySchedules(all);
  const teams = CATEGORY_PAGES.filter((c) => perCategory[c.info.value]?.sede === v.name);
  const path = `/sedes/${v.id}`;

  const jsonLd = [
    breadcrumbs([["Inicio", "/"], ["Sedes y horarios", "/contacto"], [v.name, path]]),
    {
      "@context": "https://schema.org",
      "@type": "SportsActivityLocation",
      name: v.name,
      url: `${siteUrl}${path}`,
      description: v.description,
      address: { "@type": "PostalAddress", streetAddress: v.address, addressLocality: "Medellín", addressRegion: "Antioquia", addressCountry: "CO" },
      geo: { "@type": "GeoCoordinates", latitude: v.lat, longitude: v.lng },
      hasMap: mapsLink(v),
      openingHoursSpecification: openingHours(sessions),
      parentOrganization: { "@id": CLUB_ID },
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageHero art="pin" kicker={v.search} title={v.name} intro={`${v.role}. ${v.description}`}>
        <div className="flex flex-wrap gap-3">
          <a href={mapsLink(v)} target="_blank" rel="noopener noreferrer" className="h-14 px-7 inline-flex items-center gap-2 rounded-md bg-[#F29A2E] hover:bg-[#FFB14A] text-[#071426] font-bold text-lg">
            <Navigation size={20} /> Cómo llegar
          </a>
          <a href={wazeLink(v)} target="_blank" rel="noopener noreferrer" className="h-14 px-7 inline-flex items-center gap-2 rounded-md border border-white/25 hover:border-white font-semibold text-lg">
            Waze
          </a>
        </div>
      </PageHero>

      <section className="bg-[#071426] text-white pb-20 sm:pb-28">
        <div className="container mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-10">
          <div className="space-y-10 min-w-0">
            <p className="flex gap-3 text-lg text-[#C9D5E6]"><MapPin size={22} className="text-[#F29A2E] shrink-0 mt-0.5" />{v.address}</p>
            <div>
              <h2 className="font-heading font-black uppercase text-4xl leading-none mb-5">Horarios en esta sede</h2>
              {sessions.length ? (
                <ul className="divide-y divide-white/10 border-y border-white/10">
                  {sessions.map((s) => (
                    <li key={`${s.day}-${s.start}-${s.group}`} className="py-3.5 flex flex-wrap gap-x-4 gap-y-1">
                      <span className="font-semibold w-24">{DAY_NAMES[s.day]}</span>
                      <span className="tabular-nums text-[#C9D5E6] inline-flex items-center gap-2"><Clock size={16} className="text-[#8FA3BF]" />{formatTime(s.start)} – {formatTime(s.end)}</span>
                      <span className="text-[#8FA3BF]">{s.group}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[#C9D5E6]">{v.schedule}</p>
              )}
            </div>
            {teams.length > 0 && (
              <div>
                <h2 className="font-heading font-black uppercase text-4xl leading-none mb-5">Categorías que entrenan aquí</h2>
                <ul className="flex flex-wrap gap-3">
                  {teams.map((c) => (
                    <li key={c.slug}>
                      <Link href={`/equipos/${c.slug}`} className="h-12 px-5 inline-flex items-center gap-2 rounded-md border border-white/20 hover:border-[#F29A2E] hover:text-[#F29A2E] font-semibold">
                        {c.info.value} <ArrowRight size={16} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <Link href="/inscripciones" className="h-14 px-7 inline-flex items-center gap-2 rounded-md bg-[#F29A2E] hover:bg-[#FFB14A] text-[#071426] font-bold text-lg">
              Reservar clase de prueba gratis <ArrowRight size={20} />
            </Link>
          </div>
          <div className="relative min-h-[320px] lg:min-h-[460px] rounded-2xl overflow-hidden border border-white/10 bg-[#0F2347]">
            <iframe
              title={`Mapa de ${v.name}`}
              src={mapEmbed(v)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 w-full h-full border-0 grayscale-[0.6] contrast-[1.05] invert-[0.92] hue-rotate-180"
            />
          </div>
        </div>
      </section>
    </>
  );
}
