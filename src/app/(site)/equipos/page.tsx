import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, MapPin, Check } from "lucide-react";
import PageHero from "@/components/PageHero";
import Volleyball from "@/components/Volleyball";
import PlayerCard from "@/components/PlayerCard";
import { CATEGORIES } from "@/data/registration";
import { getRoster } from "@/lib/club";

export const metadata: Metadata = {
  title: "Equipos",
  alternates: { canonical: "/equipos" },
  description: "Las cinco categorías del Club Voley Zúñiga: edades, horarios y enfoque de entrenamiento.",
};

const FOCUS: Record<string, { lead: string; points: string[] }> = {
  "Semillero Sub-12": {
    lead: "El primer contacto con el balón: jugar, moverse bien y enamorarse del voleibol.",
    points: ["Coordinación y control del balón", "Postura y desplazamientos básicos", "Compañerismo y disciplina desde el juego"],
  },
  "Infantil Sub-14": {
    lead: "Llegan los fundamentos completos y los primeros sistemas de juego.",
    points: ["Saque, recepción y armado con técnica correcta", "Batida y remate con trabajo de salto seguro", "Primeros partidos y festivales"],
  },
  "Menores Sub-16": {
    lead: "Se compite en serio y cada posición empieza a especializarse.",
    points: ["Sistemas 5-1 y 4-2", "Lectura de bloqueo y cobertura", "Partidos de liga y torneos interclubes"],
  },
  "Juvenil Sub-18": {
    lead: "Alta competencia: decisiones rápidas, cabeza fría y liderazgo en la cancha.",
    points: ["Preparación física por posición", "Manejo de la presión en puntos críticos", "Liga de Antioquia y festivales nacionales"],
  },
  "Mayores Élite": {
    lead: "Para quienes quieren seguir compitiendo después del colegio, o volver a la cancha.",
    points: ["Entrenamiento táctico de alto nivel", "Partidos oficiales en el Coliseo Yesid Santos", "Acompañamiento para becas deportivas"],
  },
};

const tagOf = (v: string) => (v.match(/Sub-\d+/)?.[0] ?? "18+");
const nameOf = (v: string) => v.replace(/\s*(Sub-\d+|Élite)$/, "");
const ages = (min: number, max: number) => (max >= 100 ? "18 años o más" : min === 0 ? "7 a 11 años" : `${min} a ${max} años`);

export const revalidate = 300;

export default async function TeamPage() {
  const roster = await getRoster();
  return (
    <>
      <PageHero art="net" kicker="Cinco categorías" title="Equipos" intro="Cada equipo tiene un objetivo claro para su edad. Así trabaja cada uno y cuándo entrena." />
      <section className="bg-[#071426] text-white pb-24 sm:pb-32">
        <div className="container mx-auto px-4 sm:px-6 space-y-5">
          {CATEGORIES.map((c, i) => {
            const f = FOCUS[c.value];
            const players = roster.filter((p) => p.category.toLowerCase() === c.value.toLowerCase());
            return (
              <article key={c.value} className="reveal group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0F2347] to-[#0B1E38] grid lg:grid-cols-12">
                <div className="lg:col-span-4 relative p-7 sm:p-10 flex flex-col justify-between min-h-[220px] border-b lg:border-b-0 lg:border-r border-white/10 overflow-hidden">
                  <Volleyball className="absolute -right-16 -bottom-16 w-64 opacity-[0.08] transition-transform duration-700 group-hover:rotate-45" id={`team-${i}`} />
                  <p className="font-heading font-black uppercase whitespace-nowrap text-[5rem] sm:text-[6.5rem] leading-[0.8] text-outline-accent group-hover:text-[#F29A2E] transition-colors">
                    {tagOf(c.value)}
                  </p>
                  <div className="relative">
                    <h2 className="font-heading font-black uppercase text-4xl leading-none mt-4">{nameOf(c.value)}</h2>
                    <p className="text-[#F29A2E] font-semibold mt-1">{ages(c.minAge, c.maxAge)}</p>
                  </div>
                </div>
                <div className="lg:col-span-8 p-7 sm:p-10 grid md:grid-cols-2 gap-8">
                  <div>
                    <p className="text-xl text-white leading-snug">{f?.lead}</p>
                    <ul className="mt-5 space-y-2.5">
                      {f?.points.map((p) => (
                        <li key={p} className="flex gap-3 text-[#C9D5E6]"><Check size={18} className="text-[#F29A2E] shrink-0 mt-1" />{p}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-col">
                    <div className="rounded-xl bg-[#071426]/60 border border-white/10 p-5 space-y-3">
                      <p className="flex gap-3"><Clock size={18} className="text-[#8FA3BF] shrink-0 mt-0.5" /><span>{c.horario}</span></p>
                      <p className="flex gap-3"><MapPin size={18} className="text-[#8FA3BF] shrink-0 mt-0.5" /><span>{c.sede}</span></p>
                    </div>
                    <Link href="/inscripciones" className="mt-5 lg:mt-auto self-start h-12 px-5 inline-flex items-center gap-2 rounded-md bg-[#F29A2E] hover:bg-[#FFB14A] text-[#071426] font-bold">
                      Inscribirme en {nameOf(c.value)} <ArrowRight size={18} />
                    </Link>
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
