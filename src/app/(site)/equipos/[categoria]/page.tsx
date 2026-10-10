import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, ChevronDown, Clock, MapPin, MessageCircle, Users } from "lucide-react";
import PageHero from "@/components/PageHero";
import PlayerCard from "@/components/PlayerCard";
import JsonLd from "@/components/JsonLd";
import { CATEGORY_PAGES, agesOf, categoryPage, nameOf } from "@/data/categories";
import { VENUES } from "@/data/venues";
import { waLink } from "@/config/contact";
import { categorySchedules, getSessions, getSettings } from "@/lib/content";
import { getCoaches, getRoster } from "@/lib/club";
import { CLUB_ID, breadcrumbs, faqPage, pageMeta } from "@/lib/seo";
import { siteUrl } from "@/lib/site-url";

// Una página por categoría: cada una responde a una búsqueda concreta ("voleibol para niños en Medellín").

export const revalidate = 300;
export const dynamicParams = false;

export function generateStaticParams() {
  return CATEGORY_PAGES.map((c) => ({ categoria: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ categoria: string }> }): Promise<Metadata> {
  const c = categoryPage((await params).categoria);
  if (!c) return {};
  return pageMeta({
    title: `${c.search} · ${c.info.value}`,
    path: `/equipos/${c.slug}`,
    description: `${c.intro} Clase de prueba sin costo.`,
  });
}

export default async function CategoryPage({ params }: { params: Promise<{ categoria: string }> }) {
  const c = categoryPage((await params).categoria);
  if (!c) notFound();
  const [sessions, { contact }, roster, coaches] = await Promise.all([getSessions(), getSettings(), getRoster(), getCoaches()]);
  const name = nameOf(c.info.value);
  const { horario, sede } = categorySchedules(sessions)[c.info.value];
  const venue = VENUES.find((v) => v.name === sede);
  const players = roster.filter((p) => p.category.toLowerCase() === c.info.value.toLowerCase());
  const staff = coaches.filter((x) => x.categories.toLowerCase().includes(name.toLowerCase()));
  const path = `/equipos/${c.slug}`;

  const jsonLd = [
    breadcrumbs([["Inicio", "/"], ["Equipos", "/equipos"], [c.info.value, path]]),
    faqPage(c.faqs),
    {
      "@context": "https://schema.org",
      "@type": "SportsTeam",
      name: `Voley Zúñiga ${c.info.value}`,
      sport: "Volleyball",
      url: `${siteUrl}${path}`,
      description: c.intro,
      memberOf: { "@id": CLUB_ID },
      audience: { "@type": "PeopleAudience", suggestedMinAge: c.info.minAge || 7, ...(c.info.maxAge < 100 ? { suggestedMaxAge: c.info.maxAge } : {}) },
      ...(staff.length ? { coach: staff.map((x) => ({ "@type": "Person", name: x.name, jobTitle: x.role || undefined })) } : {}),
      ...(venue ? { location: { "@type": "SportsActivityLocation", name: venue.name, url: `${siteUrl}/sedes/${venue.id}` } } : {}),
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageHero art="net" kicker={c.search} title={name} intro={c.intro}>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/inscripciones" className="h-14 px-7 inline-flex items-center justify-center gap-2 rounded-md bg-[#F29A2E] hover:bg-[#FFB14A] text-[#071426] font-bold text-lg">
            Reservar clase de prueba <ArrowRight size={20} />
          </Link>
          <a
            href={waLink(contact, `Hola, quisiera información sobre la categoría ${c.info.value} del Club Voley Zúñiga`)}
            target="_blank"
            rel="noopener noreferrer"
            className="h-14 px-7 inline-flex items-center justify-center gap-2 rounded-md border border-white/25 hover:border-white font-semibold text-lg"
          >
            <MessageCircle size={20} className="text-[#25D366]" /> Preguntar por WhatsApp
          </a>
        </div>
      </PageHero>

      <section className="bg-[#071426] text-white pb-20 sm:pb-28">
        <div className="container mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7">
            <h2 className="font-heading font-black uppercase text-4xl sm:text-5xl leading-none">Qué se trabaja</h2>
            <p className="mt-5 text-xl leading-snug">{c.lead}</p>
            <ul className="mt-6 space-y-3">
              {c.points.map((p) => (
                <li key={p} className="flex gap-3 text-[#C9D5E6] text-lg"><Check size={20} className="text-[#F29A2E] shrink-0 mt-1" />{p}</li>
              ))}
            </ul>
          </div>
          <aside className="lg:col-span-5 rounded-2xl border border-white/10 bg-[#0B1E38] p-7 sm:p-8 space-y-5 self-start">
            <p className="flex gap-3"><Users size={20} className="text-[#F29A2E] shrink-0 mt-0.5" /><span><b className="block">Edades</b>{agesOf(c.info)}</span></p>
            <p className="flex gap-3"><Clock size={20} className="text-[#F29A2E] shrink-0 mt-0.5" /><span><b className="block">Horario</b>{horario}</span></p>
            <p className="flex gap-3">
              <MapPin size={20} className="text-[#F29A2E] shrink-0 mt-0.5" />
              <span>
                <b className="block">Sede</b>
                {venue ? <Link href={`/sedes/${venue.id}`} className="underline underline-offset-4 decoration-white/30 hover:text-[#F29A2E]">{venue.name}</Link> : sede}
                {venue ? <span className="block text-sm text-[#8FA3BF]">{venue.address}</span> : null}
              </span>
            </p>
            {staff.length > 0 && (
              <div className="border-t border-white/10 pt-5">
                <b className="block mb-2">Entrenadores</b>
                <ul className="space-y-1 text-[#C9D5E6]">
                  {staff.map((x) => <li key={x.name}>{x.name}{x.role ? <span className="text-[#8FA3BF]"> · {x.role}</span> : null}</li>)}
                </ul>
              </div>
            )}
          </aside>
        </div>

        {players.length > 0 && (
          <div className="container mx-auto px-4 sm:px-6 mt-16">
            <h2 className="font-heading font-black uppercase text-4xl leading-none mb-6">Plantel {name}</h2>
            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {players.map((p) => (
                <li key={p.name + p.number}><PlayerCard player={p} /></li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className="bg-[#EEF2F7] text-[#0F2347] py-20 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
          <h2 className="font-heading font-black uppercase text-4xl sm:text-5xl leading-none mb-6">Preguntas sobre {name}</h2>
          {c.faqs.map((f, i) => (
            <details key={f.q} name="faq" open={i === 0} className="group border-b border-[#0F2347]/15">
              <summary className="flex items-center justify-between gap-4 py-6 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <h3 className="font-heading font-extrabold text-2xl group-open:text-[#C46F0A] transition-colors">{f.q}</h3>
                <span className="shrink-0 w-10 h-10 rounded-full border border-[#0F2347]/20 flex items-center justify-center group-open:bg-[#F29A2E] group-open:border-[#F29A2E] group-open:text-[#071426] transition-colors">
                  <ChevronDown size={20} className="transition-transform group-open:rotate-180" />
                </span>
              </summary>
              <p className="pb-7 text-[#44546F] text-lg leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <nav aria-label="Otras categorías" className="bg-[#071426] text-white py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="font-heading font-black uppercase text-3xl leading-none mb-6">Otras categorías</h2>
          <ul className="flex flex-wrap gap-3">
            {CATEGORY_PAGES.filter((x) => x.slug !== c.slug).map((x) => (
              <li key={x.slug}>
                <Link href={`/equipos/${x.slug}`} className="h-12 px-5 inline-flex items-center gap-2 rounded-md border border-white/20 hover:border-[#F29A2E] hover:text-[#F29A2E] font-semibold">
                  {x.info.value} <span className="text-[#8FA3BF] font-normal">· {agesOf(x.info)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
}
