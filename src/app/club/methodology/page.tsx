import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Dumbbell, Activity, Brain, ShieldCheck, Check } from "lucide-react";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Metodología",
  description: "Los cuatro pilares de entrenamiento del Club Voley Zúñiga.",
};

const PILLARS = [
  {
    Icon: Dumbbell,
    title: "Preparación física",
    subtitle: "Salto, velocidad de reacción y prevención de lesiones",
    text: "Planes adaptados a la madurez ósea y muscular de cada categoría. Fortalecemos tobillos, rodillas y hombros para saltar más y lesionarse menos.",
    points: ["Trabajo de salto progresivo y seguro", "Fuerza de core y tren inferior", "Estiramiento y recuperación"],
  },
  {
    Icon: Activity,
    title: "Técnica y táctica",
    subtitle: "Batida, armado, cobertura y lectura de bloqueo",
    text: "Fundamentos del voleibol moderno: pase de antebrazo preciso, sistemas 5-1 y 4-2, y variantes de ataque por las bandas y desde zona zaguera.",
    points: ["Corrección de la mecánica de golpeo en video", "Saque flotante y de potencia", "Transiciones rápidas de defensa a ataque"],
  },
  {
    Icon: Brain,
    title: "Fortaleza mental",
    subtitle: "Presión, foco y decisiones en puntos críticos",
    text: "Un set se gana también con la cabeza. Preparamos a los deportistas para mantener la calma, soltar el error al instante y comunicarse bien bajo presión.",
    points: ["Rutinas de respiración y reinicio", "Liderazgo y lenguaje corporal positivo", "Manejo sano de la frustración"],
  },
  {
    Icon: ShieldCheck,
    title: "Código de honor",
    subtitle: "Disciplina, convivencia y estudio",
    text: "Primero son estudiantes. Pedimos puntualidad (15 minutos antes en la cancha), uniforme impecable, respeto por árbitros y rivales, y buen rendimiento escolar.",
    points: ["Asistencia y puntualidad", "Seguimiento del rendimiento escolar", "Sentido de pertenencia y cuidado de la sede"],
  },
];

export default function MethodologyPage() {
  return (
    <>
      <PageHero kicker="Cómo entrenamos" title="Metodología" intro="Cuatro pilares que trabajamos en todas las categorías, con la exigencia ajustada a cada edad." />
      <section className="bg-[#071426] text-white pb-24 sm:pb-32">
        <div className="container mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-5">
          {PILLARS.map(({ Icon, title, subtitle, text, points }) => (
            <article key={title} className="group rounded-2xl border border-white/10 bg-gradient-to-br from-[#0F2347] to-[#0B1E38] p-7 sm:p-10 hover:border-[#F29A2E]/50 transition-colors">
              <span className="w-14 h-14 rounded-xl bg-[#F29A2E]/10 border border-[#F29A2E]/30 flex items-center justify-center text-[#F29A2E]">
                <Icon size={28} />
              </span>
              <h2 className="font-heading font-black uppercase text-4xl leading-none mt-6">{title}</h2>
              <p className="text-[#F29A2E] font-semibold mt-2">{subtitle}</p>
              <p className="mt-4 text-[#C9D5E6] leading-relaxed">{text}</p>
              <ul className="mt-6 pt-6 border-t border-white/10 space-y-2.5">
                {points.map((p) => (
                  <li key={p} className="flex gap-3 text-[#B7C4D8]"><Check size={18} className="text-[#F29A2E] shrink-0 mt-1" />{p}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="container mx-auto px-4 sm:px-6 mt-12">
          <Link href="/registrations" className="h-14 px-7 inline-flex items-center gap-2 rounded-md bg-[#F29A2E] hover:bg-[#FFB14A] text-[#071426] font-bold text-lg">
            Reservar clase de prueba <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </>
  );
}
