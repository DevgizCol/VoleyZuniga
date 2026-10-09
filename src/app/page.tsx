import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronDown, Camera, MessageCircle, MapPin, Clock } from "lucide-react";
import HeroCourt from "@/components/HeroCourt";
import NextSession from "@/components/NextSession";
import Volleyball from "@/components/Volleyball";
import { PictoGrowth, PictoScore, PictoTechnique } from "@/components/Pictograms";
import { SITE, whatsappUrl } from "@/config/site";
import { CATEGORIES } from "@/data/registration";
import { DAY_NAMES, SESSIONS, TRAINING_DAYS, formatTime } from "@/data/schedule";

const ageLabel = (min: number, max: number) => (max >= 100 ? "18 años o más" : min === 0 ? "7 a 11 años" : `${min} a ${max} años`);

// "Semillero Sub-12" -> { name: "Semillero", tag: "Sub-12" }
const splitCategory = (value: string) => {
  const m = value.match(/^(.*?)\s+(Sub-\d+|Élite)$/);
  return m ? { name: m[1], tag: m[2] === "Élite" ? "18+" : m[2] } : { name: value, tag: "" };
};

const METHOD = [
  {
    Picto: PictoTechnique,
    title: "Técnica que se corrige en video",
    text: "Batida, suspensión y golpeo revisados cuadro a cuadro, con acondicionamiento progresivo para cuidar rodillas y hombros.",
    href: "/club/methodology",
    cta: "Ver metodología",
  },
  {
    Picto: PictoGrowth,
    title: "Un camino por etapas",
    text: "Desde el semillero de 7 años hasta mayores: cada categoría tiene objetivos claros y el paso a la siguiente se gana en la cancha.",
    href: "#ruta",
    cta: "Ver la ruta",
  },
  {
    Picto: PictoScore,
    title: "Competencia de verdad",
    text: "Liga de Antioquia, torneos municipales y festivales interclubes. Se aprende a ganar, y también a perder.",
    href: "/games",
    cta: "Ver partidos",
  },
];

const VALUES = ["Puntualidad", "Resiliencia", "Humildad", "Respeto"];

const FAQS = [
  {
    q: "¿Desde qué edad pueden entrar?",
    a: "Desde los 7 años, en Semillero Sub-12. Luego siguen Infantil Sub-14, Menores Sub-16, Juvenil Sub-18 y Mayores Élite, para 18 años en adelante.",
  },
  {
    q: "¿Cómo funciona la clase de prueba?",
    a: "Llenas el formulario de inscripción y te escribimos por WhatsApp para acordar el día. En la clase conoces a los entrenadores y ellos valoran el nivel del deportista, sin compromiso.",
  },
  {
    q: "¿Dónde y cuándo se entrena?",
    a: "En el Polideportivo 3 Canchas (Buenos Aires) y en el Coliseo Yesid Santos (Atanasio Girardot). El horario de cada categoría está en la semana de entrenamientos, más arriba.",
  },
  {
    q: "¿Qué debo llevar el primer día?",
    a: "Ropa deportiva cómoda, tenis con buen agarre para cancha y un termo con agua. La indumentaria oficial se entrega al formalizar la matrícula.",
  },
  {
    q: "¿El club participa en torneos?",
    a: "Sí: Liga de Voleibol de Antioquia, torneos municipales y festivales interclubes. Los partidos programados están en la página de Partidos.",
  },
];

export default function Home() {
  const marqueeItems = CATEGORIES.map((c) => c.value);

  return (
    <>
      {/* ================= PORTADA ================= */}
      <section className="relative isolate overflow-hidden floodlights grain text-white min-h-[100svh] flex flex-col">
        <div className="container mx-auto px-4 sm:px-6 flex-1 grid lg:grid-cols-12 items-center gap-6 pt-40 sm:pt-44 lg:pt-32 pb-10">
          <div className="lg:col-span-6 relative z-10 hero-rise min-w-0">
            <p className="inline-flex items-center gap-2 text-[#F29A2E] font-semibold">
              <span className="h-px w-8 bg-[#F29A2E]" /> Club de voleibol · {SITE.city}
            </p>
            <h1 className="mt-5 font-heading font-black uppercase leading-[0.86] tracking-tight text-[clamp(3rem,14.5vw,5.5rem)] lg:text-[6rem] xl:text-[6.6rem]">
              No formamos jugadores,
              <span className="block text-[#F29A2E]">formamos campeones.</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-[#C9D5E6] max-w-md leading-relaxed">
              Entrenamiento para niños, jóvenes y adultos desde los 7 años. Tu primera clase es de prueba y no cuesta nada.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/registrations"
                className="group h-14 px-7 inline-flex items-center justify-center gap-2 bg-[#F29A2E] hover:bg-[#FFB14A] text-[#071426] font-bold text-lg rounded-md shadow-[0_10px_30px_-8px_rgba(242,154,46,0.7)] transition-all"
              >
                Reservar clase de prueba
                <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#semana"
                className="h-14 px-7 inline-flex items-center justify-center border border-white/25 hover:border-white hover:bg-white/5 text-white font-semibold text-lg rounded-md transition-colors"
              >
                Ver horarios
              </a>
            </div>
            <div className="mt-8 max-w-md">
              <NextSession />
            </div>
          </div>

          <div className="lg:col-span-6 order-first lg:order-none -mx-10 sm:mx-0 -mb-6 lg:mb-0 absolute lg:relative inset-x-0 top-24 sm:top-20 lg:top-auto opacity-40 lg:opacity-100 -z-10 lg:z-0">
            <HeroCourt className="w-full lg:scale-110 lg:translate-x-6" />
          </div>
        </div>

        {/* Banda de categorías */}
        <div className="relative bg-[#F29A2E] text-[#071426] py-3 overflow-hidden -rotate-1 scale-105 origin-left shadow-[0_-10px_40px_rgba(0,0,0,0.4)]">
          <div className="marquee flex w-max gap-10 whitespace-nowrap font-heading font-black uppercase text-2xl sm:text-3xl">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span key={i} className="flex items-center gap-10" aria-hidden={i >= marqueeItems.length}>
                {item}
                <Volleyball className="w-6 h-6" id={`mq-${i}`} />
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ================= RUTA DEL DEPORTISTA ================= */}
      <section id="ruta" className="relative bg-[#071426] text-white py-24 sm:py-32 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-12 gap-6 items-end mb-14">
            <h2 className="lg:col-span-7 font-heading font-black uppercase leading-[0.9] text-5xl sm:text-7xl">
              La ruta del deportista
            </h2>
            <p className="lg:col-span-5 text-[#B7C4D8] text-lg leading-relaxed">
              Cinco categorías, una sola idea: que cada etapa prepare la siguiente. Entra en la de tu edad y avanza a tu ritmo.
            </p>
          </div>

          <ol className="relative grid grid-flow-col auto-cols-[78%] sm:auto-cols-[45%] lg:grid-flow-row lg:grid-cols-5 gap-4 overflow-x-auto lg:overflow-visible snap-x snap-mandatory pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 [scrollbar-width:none]">
            <div className="hidden lg:block absolute left-0 right-0 top-[22px] h-px bg-gradient-to-r from-[#F29A2E] via-[#F29A2E]/50 to-[#F29A2E]/10" aria-hidden="true" />
            {CATEGORIES.map((c, i) => {
              const { name, tag } = splitCategory(c.value);
              return (
                <li key={c.value} className="snap-start relative">
                  <div className="relative z-10 w-11 h-11 rounded-full bg-[#071426] border-2 border-[#F29A2E] flex items-center justify-center font-heading font-black text-lg text-[#F29A2E]">
                    {i + 1}
                  </div>
                  <div className="group mt-5 h-[calc(100%-4rem)] rounded-xl border border-white/10 bg-gradient-to-b from-[#0F2347] to-[#0B1E38] p-6 transition-all hover:border-[#F29A2E]/60 hover:-translate-y-1 hover:shadow-[0_24px_50px_-20px_rgba(242,154,46,0.45)]">
                    <p className="font-heading font-black uppercase text-5xl xl:text-6xl leading-none whitespace-nowrap text-outline-accent group-hover:text-[#F29A2E] transition-colors">
                      {tag}
                    </p>
                    <h3 className="font-heading font-extrabold text-3xl mt-3">{name}</h3>
                    <p className="text-[#F29A2E] font-semibold mt-1">{ageLabel(c.minAge, c.maxAge)}</p>
                    <div className="mt-5 pt-5 border-t border-white/10 space-y-2 text-sm text-[#B7C4D8]">
                      <p className="flex gap-2"><Clock size={16} className="shrink-0 mt-0.5 text-[#8FA3BF]" />{c.horario}</p>
                      <p className="flex gap-2"><MapPin size={16} className="shrink-0 mt-0.5 text-[#8FA3BF]" />{c.sede}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ================= SEMANA DE ENTRENAMIENTOS ================= */}
      <section id="semana" className="relative bg-[#EEF2F7] text-[#0F2347] py-24 sm:py-32 overflow-hidden">
        <Volleyball className="absolute -right-24 -top-24 w-[420px] opacity-[0.06]" id="wm-week" />
        <div className="container mx-auto px-4 sm:px-6 relative">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
            <h2 className="font-heading font-black uppercase leading-[0.9] text-5xl sm:text-7xl">La semana en la cancha</h2>
            <p className="text-[#44546F] text-lg max-w-md">
              Horarios de referencia. Antes de tu primera clase confirmamos todo por WhatsApp.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TRAINING_DAYS.map((day) => (
              <div key={day} className="rounded-xl bg-white shadow-[0_1px_0_rgba(15,35,71,0.06),0_20px_40px_-24px_rgba(15,35,71,0.35)] overflow-hidden">
                <div className="bg-[#0F2347] text-white px-5 py-3 flex items-baseline justify-between">
                  <h3 className="font-heading font-black uppercase text-2xl">{DAY_NAMES[day]}</h3>
                  <span className="text-xs text-[#8FA3BF]">{(() => {
                      const n = SESSIONS.filter((s) => s.day === day).length;
                      return n === 1 ? "1 sesión" : `${n} sesiones`;
                    })()}</span>
                </div>
                <ul className="divide-y divide-[#0F2347]/10">
                  {SESSIONS.filter((s) => s.day === day).map((s) => (
                    <li key={s.start + s.group} className="px-5 py-4 flex gap-4">
                      <div className="w-1 rounded-full bg-[#F29A2E]" />
                      <div>
                        <p className="font-heading font-extrabold text-2xl leading-none tabular-nums">
                          {formatTime(s.start)}
                          <span className="text-[#8FA3BF] font-bold text-lg"> – {formatTime(s.end)}</span>
                        </p>
                        <p className="font-semibold mt-1.5">{s.group}</p>
                        <p className="text-sm text-[#44546F]">{s.sede}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <Link
              href="/registrations"
              className="group h-14 px-7 inline-flex items-center justify-center gap-2 bg-[#0F2347] hover:bg-[#071426] text-white font-bold text-lg rounded-md transition-colors"
            >
              Inscribirme <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href={whatsappUrl("Hola, quiero confirmar los horarios de entrenamiento del Club Voley Zúñiga")}
              target="_blank"
              rel="noopener noreferrer"
              className="h-14 px-7 inline-flex items-center justify-center gap-2 border border-[#0F2347]/25 hover:border-[#0F2347] font-semibold text-lg rounded-md transition-colors"
            >
              <MessageCircle size={20} className="text-[#1DA851]" /> Preguntar por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ================= MÉTODO ================= */}
      <section className="relative bg-[#071426] text-white py-24 sm:py-32 overflow-hidden grain">
        <div className="container mx-auto px-4 sm:px-6 relative">
          <h2 className="font-heading font-black uppercase leading-[0.9] text-5xl sm:text-7xl mb-14 max-w-3xl">
            Así entrenamos
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {METHOD.map(({ Picto, title, text, href, cta }) => (
              <article
                key={title}
                className="group relative rounded-xl border border-white/10 bg-white/[0.03] p-7 sm:p-8 transition-colors hover:bg-white/[0.06] hover:border-white/20"
              >
                <Picto className="w-28 h-20 text-[#F29A2E]" />
                <h3 className="font-heading font-extrabold text-3xl mt-6 mb-3 leading-tight">{title}</h3>
                <p className="text-[#B7C4D8] leading-relaxed mb-6">{text}</p>
                <Link href={href} className="inline-flex items-center gap-2 font-semibold text-[#F29A2E] hover:text-[#FFB14A]">
                  {cta} <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= VALORES ================= */}
      <section aria-label="Nuestros valores" className="relative bg-[#0B1E38] text-white py-16 sm:py-20 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4 flex items-center gap-5">
            <Image src="/logo-trim.png" alt="" width={800} height={473} className="w-32 h-auto" />
            <p className="text-[#B7C4D8] leading-relaxed">
              Lo que se entrena fuera del marcador también cuenta.
            </p>
          </div>
          <ul className="lg:col-span-8 flex flex-wrap gap-x-6 gap-y-1 font-heading font-black uppercase text-5xl sm:text-6xl leading-none">
            {VALUES.map((v, i) => (
              <li key={v} className={i % 2 ? "text-transparent [-webkit-text-stroke:1.5px_#F29A2E]" : "text-white"}>
                {v}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ================= PREGUNTAS ================= */}
      <section className="bg-[#071426] text-white py-24 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <h2 className="font-heading font-black uppercase leading-[0.9] text-5xl sm:text-6xl">Preguntas frecuentes</h2>
            <div className="mt-8 rounded-xl border border-[#25D366]/30 bg-[#25D366]/[0.06] p-6">
              <p className="font-heading font-extrabold text-2xl">¿Te quedó alguna duda?</p>
              <p className="text-[#B7C4D8] mt-1 mb-4">Escríbenos y te respondemos en horario de oficina.</p>
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 h-12 px-5 rounded-md bg-[#25D366] text-[#071426] font-bold hover:brightness-110"
              >
                <MessageCircle size={18} /> Escribir por WhatsApp
              </a>
            </div>
          </div>
          <div className="lg:col-span-8 border-t border-white/15">
            {FAQS.map((f, i) => (
              <details key={f.q} name="faq" open={i === 0} className="group border-b border-white/15">
                <summary className="flex items-center justify-between gap-4 py-6 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <h3 className="font-heading font-extrabold text-2xl sm:text-3xl group-open:text-[#F29A2E] transition-colors">{f.q}</h3>
                  <span className="shrink-0 w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-open:bg-[#F29A2E] group-open:border-[#F29A2E] group-open:text-[#071426] transition-colors">
                    <ChevronDown size={20} className="transition-transform group-open:rotate-180" />
                  </span>
                </summary>
                <p className="pb-7 text-[#C9D5E6] text-lg leading-relaxed max-w-2xl">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CIERRE ================= */}
      <section className="relative overflow-hidden bg-[#F29A2E] text-[#071426]">
        <div className="absolute inset-0 opacity-25" aria-hidden="true">
          <svg viewBox="0 0 1200 400" preserveAspectRatio="none" className="w-full h-full">
            <g fill="none" stroke="#071426" strokeWidth="2">
              <path d="M0 330 C 300 260, 700 250, 1200 120" />
              <path d="M0 370 C 320 300, 720 290, 1200 170" />
              <path d="M0 400 C 340 340, 740 330, 1200 220" />
            </g>
          </svg>
        </div>
        <div className="container mx-auto px-4 sm:px-6 py-20 sm:py-28 relative grid lg:grid-cols-12 items-center gap-10">
          <div className="lg:col-span-8">
            <h2 className="font-heading font-black uppercase leading-[0.88] text-6xl sm:text-8xl">
              Tu lugar en la cancha te espera.
            </h2>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/registrations"
                className="group h-14 px-8 inline-flex items-center justify-center gap-2 bg-[#071426] hover:bg-[#0F2347] text-white font-bold text-lg rounded-md transition-colors"
              >
                Reservar clase de prueba <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href={SITE.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="h-14 px-7 inline-flex items-center justify-center gap-2 border-2 border-[#071426] font-bold text-lg rounded-md hover:bg-[#071426] hover:text-white transition-colors"
              >
                <Camera size={20} /> {SITE.instagram.handle}
              </a>
            </div>
          </div>
          <div className="hidden lg:block lg:col-span-4">
            <Volleyball className="w-full max-w-xs ml-auto ball-float drop-shadow-[0_30px_40px_rgba(7,20,38,0.45)]" id="cta-ball" />
          </div>
        </div>
      </section>
    </>
  );
}
