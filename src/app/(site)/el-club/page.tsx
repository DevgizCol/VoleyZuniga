/* eslint-disable @next/next/no-img-element -- las fotos de los entrenadores vienen de la hoja */
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import { getCoaches } from "@/lib/club";

export const metadata: Metadata = {
  title: "El club",
  alternates: { canonical: "/el-club" },
  description: "Quiénes somos, qué nos mueve y el camino que recorre cada deportista del Club Voley Zúñiga.",
};

const PATH = [
  { title: "Semillero", age: "7 a 11 años", text: "Psicomotricidad, control del balón y disciplina básica, aprendidos jugando." },
  { title: "Desarrollo", age: "12 a 14 años", text: "Fundamentos completos, primeros sistemas de juego y salto con técnica segura." },
  { title: "Competencia", age: "15 a 18 años", text: "Liga de Antioquia y festivales: resiliencia, decisiones bajo presión y liderazgo." },
  { title: "Proyección", age: "Mayores y egresados", text: "Acompañamos a quienes buscan becas deportivas y mantenemos viva la red de egresados." },
];

const VALUES = [
  { title: "Puntualidad", text: "Llegar a tiempo es la primera forma de respeto por el equipo." },
  { title: "Resiliencia", text: "Un error se olvida en el siguiente punto. Una derrota se estudia y se supera." },
  { title: "Humildad", text: "Se gana con la cabeza en alto y los pies en la tierra." },
  { title: "Respeto", text: "Por compañeros, rivales, árbitros y familias. Sin excepciones." },
];

export const revalidate = 300;

export default async function HistoryPage() {
  const coaches = await getCoaches();
  return (
    <>
      <PageHero kicker="Quiénes somos" title="El club" intro="Nacimos con una convicción: el voleibol es una de las mejores herramientas para formar jóvenes disciplinados, competitivos y con valores." />

      <section className="bg-[#071426] text-white pb-20 sm:pb-28">
        <div className="container mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <p className="font-heading font-black uppercase text-5xl sm:text-7xl leading-[0.9]">
              No formamos jugadores, <span className="text-[#F29A2E]">formamos campeones.</span>
            </p>
            <p className="mt-6 text-lg text-[#C9D5E6] max-w-2xl leading-relaxed">
              Para nosotros un campeón no es solo quien levanta un trofeo. Es quien llega puntual, se levanta después de un mal set, apoya al compañero
              y saca adelante el colegio. Eso es lo que entrenamos, dentro y fuera de la cancha.
            </p>
          </div>
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm aspect-square rounded-full border border-[#F29A2E]/30 flex items-center justify-center bg-[radial-gradient(circle,rgba(242,154,46,0.15),transparent_65%)]">
              <div className="absolute inset-6 rounded-full border border-white/10" />
              <Image src="/logo-trim.png" alt="Escudo del Club Voley Zúñiga" width={800} height={473} className="w-3/4 h-auto" />
            </div>
          </div>
        </div>
      </section>

      {coaches.length > 0 && (
        <section className="bg-[#0B1E38] text-white py-20 sm:py-28">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="font-heading font-black uppercase text-5xl sm:text-6xl leading-none mb-4">Cuerpo técnico</h2>
            <p className="text-[#B7C4D8] text-lg max-w-2xl mb-12">Las personas que acompañan a cada deportista en la cancha.</p>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {coaches.map((c) => (
                <li key={c.name} className="rounded-xl border border-white/10 bg-[#071426] overflow-hidden flex flex-col">
                  <div className="relative aspect-[4/3] bg-gradient-to-br from-[#0F2347] to-[#071426]">
                    {c.photo ? (
                      <img src={c.photo} alt={`Foto de ${c.name}`} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <span className="absolute inset-0 flex items-center justify-center font-heading font-black text-7xl text-[#F29A2E]/40" aria-hidden="true">
                        {c.name.split(/\s+/).slice(0, 2).map((w) => w[0]).join("")}
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-heading font-black uppercase text-3xl leading-none">{c.name}</h3>
                    {c.role ? <p className="mt-2 font-semibold text-[#F29A2E]">{c.role}</p> : null}
                    {c.categories ? <p className="text-sm text-[#8FA3BF]">{c.categories}</p> : null}
                    {c.bio ? <p className="mt-3 text-[#C9D5E6] leading-relaxed">{c.bio}</p> : null}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="bg-[#EEF2F7] text-[#0F2347] py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="font-heading font-black uppercase text-5xl sm:text-6xl leading-none mb-12">El camino del deportista</h2>
          <ol className="relative grid md:grid-cols-4 gap-8">
            <div className="hidden md:block absolute top-6 left-0 right-0 h-0.5 bg-[#0F2347]/15" aria-hidden="true" />
            {PATH.map((s, i) => (
              <li key={s.title} className="relative">
                <span className="relative z-10 w-12 h-12 rounded-full bg-[#0F2347] text-[#F29A2E] font-heading font-black text-xl flex items-center justify-center">{i + 1}</span>
                <h3 className="font-heading font-black uppercase text-3xl mt-5">{s.title}</h3>
                <p className="font-semibold text-[#C46F0A]">{s.age}</p>
                <p className="mt-2 text-[#44546F] leading-relaxed">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-[#071426] text-white py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="font-heading font-black uppercase text-5xl sm:text-6xl leading-none mb-12">Lo que nos mueve</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
                <div className="court-rule mb-5" />
                <h3 className="font-heading font-black uppercase text-3xl">{v.title}</h3>
                <p className="mt-2 text-[#B7C4D8]">{v.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap gap-3">
            <Link href="/metodologia" className="h-12 px-6 inline-flex items-center gap-2 rounded-md border border-white/25 hover:border-white font-semibold">Cómo entrenamos <ArrowRight size={18} /></Link>
            <Link href="/inscripciones" className="h-12 px-6 inline-flex items-center gap-2 rounded-md bg-[#F29A2E] hover:bg-[#FFB14A] text-[#071426] font-bold">Inscribirme <ArrowRight size={18} /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
