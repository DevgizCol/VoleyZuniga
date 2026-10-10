import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { ArrowRight, Clock, MapPin, Check } from "lucide-react";
import PageHero from "@/components/PageHero";
import Volleyball from "@/components/Volleyball";
import PlayerCard from "@/components/PlayerCard";
import { CATEGORY_PAGES, agesOf, nameOf, tagOf } from "@/data/categories";
import { getRoster } from "@/lib/club";

export const metadata: Metadata = pageMeta({
  title: "Equipos y categorías de voleibol por edad",
  path: "/equipos",
  description: "Cinco categorías de voleibol en Medellín, de los 7 años a mayores: edades, horarios, sede y enfoque de entrenamiento de cada equipo.",
});

export const revalidate = 300;

export default async function TeamPage() {
  const roster = await getRoster();
  return (
    <>
      <PageHero art="net" kicker="Cinco categorías" title="Equipos" intro="Cada equipo tiene un objetivo claro para su edad. Así trabaja cada uno y cuándo entrena." />
      <section className="bg-[#071426] text-white pb-24 sm:pb-32">
        <div className="container mx-auto px-4 sm:px-6 space-y-5">
          {CATEGORY_PAGES.map(({ info: c, slug, ...f }, i) => {
            const players = roster.filter((p) => p.category.toLowerCase() === c.value.toLowerCase());
            return (
              <article key={c.value} className="reveal group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0F2347] to-[#0B1E38] grid lg:grid-cols-12">
                <div className="lg:col-span-4 relative p-7 sm:p-10 flex flex-col justify-between min-h-[220px] border-b lg:border-b-0 lg:border-r border-white/10 overflow-hidden">
                  <Volleyball className="absolute -right-16 -bottom-16 w-64 opacity-[0.08] transition-transform duration-700 group-hover:rotate-45" id={`team-${i}`} />
                  <p className="font-heading font-black uppercase whitespace-nowrap text-[5rem] sm:text-[6.5rem] leading-[0.8] text-outline-accent group-hover:text-[#F29A2E] transition-colors">
                    {tagOf(c.value)}
                  </p>
                  <div className="relative">
                    <h2 className="font-heading font-black uppercase text-4xl leading-none mt-4">
                      <Link href={`/equipos/${slug}`} className="hover:text-[#F29A2E] transition-colors">{nameOf(c.value)}</Link>
                    </h2>
                    <p className="text-[#F29A2E] font-semibold mt-1">{agesOf(c)}</p>
                  </div>
                </div>
                <div className="lg:col-span-8 p-7 sm:p-10 grid md:grid-cols-2 gap-8">
                  <div>
                    <p className="text-xl text-white leading-snug">{f.lead}</p>
                    <ul className="mt-5 space-y-2.5">
                      {f.points.map((p) => (
                        <li key={p} className="flex gap-3 text-[#C9D5E6]"><Check size={18} className="text-[#F29A2E] shrink-0 mt-1" />{p}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-col">
                    <div className="rounded-xl bg-[#071426]/60 border border-white/10 p-5 space-y-3">
                      <p className="flex gap-3"><Clock size={18} className="text-[#8FA3BF] shrink-0 mt-0.5" /><span>{c.horario}</span></p>
                      <p className="flex gap-3"><MapPin size={18} className="text-[#8FA3BF] shrink-0 mt-0.5" /><span>{c.sede}</span></p>
                    </div>
                    <div className="mt-5 lg:mt-auto flex flex-wrap items-center gap-x-5 gap-y-3">
                      <Link href="/inscripciones" className="h-12 px-5 inline-flex items-center gap-2 rounded-md bg-[#F29A2E] hover:bg-[#FFB14A] text-[#071426] font-bold">
                        Clase gratis en {nameOf(c.value)} <ArrowRight size={18} />
                      </Link>
                      <Link href={`/equipos/${slug}`} className="font-semibold text-[#C9D5E6] underline underline-offset-4 decoration-white/30 hover:text-white">
                        Todo sobre {nameOf(c.value)}
                      </Link>
                    </div>
                  </div>
                </div>
                {players.length > 0 && (
                  <div className="lg:col-span-12 border-t border-white/10 p-7 sm:p-10">
                    <h3 className="font-heading font-black uppercase text-2xl mb-5">Plantel {nameOf(c.value)}</h3>
                    <ul className="grid grid-flow-col auto-cols-[62%] sm:auto-cols-[38%] lg:grid-flow-row lg:grid-cols-5 gap-4 overflow-x-auto lg:overflow-visible snap-x snap-mandatory pb-2 [scrollbar-width:none]">
                      {players.map((p) => (
                        <li key={p.name + p.number} className="snap-start">
                          <PlayerCard player={p} />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
