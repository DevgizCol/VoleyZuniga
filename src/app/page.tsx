import Link from "next/link";
import { ArrowRight, ChevronDown, Camera } from "lucide-react";
import CourtLines from "@/components/CourtLines";
import { SITE } from "@/config/site";
import { CATEGORIES, SEDES } from "@/data/registration";

const STEPS = [
  {
    title: "Elige categoría y sede",
    text: "Llena el formulario con la edad del deportista. Te sugerimos la categoría y el horario que le corresponden.",
  },
  {
    title: "Ven a la clase de prueba",
    text: "Asistes a un entrenamiento con nuestros entrenadores, sin compromiso, para valorar nivel y ritmo.",
  },
  {
    title: "Confirma la matrícula",
    text: "Si te gustó, formalizamos la inscripción y te entregamos la indumentaria oficial del club.",
  },
];

const METHOD = [
  {
    title: "Técnica corregida en video",
    text: "Trabajamos la batida, la suspensión y el golpeo con corrección de postura y acondicionamiento progresivo para cuidar articulaciones.",
    href: "/club/methodology",
    cta: "Ver metodología",
  },
  {
    title: "Semillero desde los 7 años",
    text: "Coordinación, juego y amor por el voleibol con una pedagogía positiva, adaptada a cada etapa del desarrollo.",
    href: "/registrations",
    cta: "Ver categorías",
  },
  {
    title: "Competencia real",
    text: "Nuestros equipos juegan en la Liga Antioqueña y en festivales interclubes para aprender a ganar y a perder.",
    href: "/games",
    cta: "Ver partidos",
  },
];

const FAQS = [
  {
    q: "¿Desde qué edad pueden entrar?",
    a: "Desde los 7 años, en la categoría Semillero Sub-12. Después siguen Infantil Sub-14, Menores Sub-16, Juvenil Sub-18 y Mayores Élite, para 18 años en adelante.",
  },
  {
    q: "¿Cómo funciona la clase de prueba?",
    a: "Llenas el formulario de inscripción y te escribimos por WhatsApp para acordar el día. En la clase conoces a los entrenadores y ellos valoran el nivel del deportista, sin ningún compromiso.",
  },
  {
    q: "¿Dónde y cuándo se entrena?",
    a: "Entrenamos en el Polideportivo 3 Canchas (Buenos Aires) y en el Coliseo Yesid Santos (Atanasio Girardot). Los horarios dependen de la categoría y los ves en la tabla de arriba.",
  },
  {
    q: "¿Qué debo llevar el primer día?",
    a: "Ropa deportiva cómoda, tenis con buen agarre para cancha y un termo con agua. La indumentaria oficial se entrega al formalizar la matrícula.",
  },
  {
    q: "¿El club participa en torneos?",
    a: "Sí: la Liga de Voleibol de Antioquia, torneos municipales y festivales interclubes. Los partidos programados están en la página de Partidos.",
  },
];

export default function Home() {
  return (
    <>
      {/* Portada */}
      <section className="relative isolate overflow-hidden bg-[#071426] text-white pt-44 pb-16 sm:pb-24 lg:pt-48 lg:pb-32">
        <CourtLines className="absolute -z-10 text-[#F29A2E]/45 w-[130%] max-w-none -right-[15%] top-10 sm:top-0 sm:w-[80%] sm:-right-[8%] lg:w-[52%] lg:right-0 lg:top-1/2 lg:-translate-y-1/2" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#071426] via-[#071426]/85 to-transparent" />

        <div className="container mx-auto px-4 sm:px-6">
          <p className="text-[#F29A2E] font-semibold mb-5 text-base sm:text-lg">Voleibol en {SITE.city}</p>
          <h1 className="font-heading font-black text-[3.4rem] leading-[0.92] sm:text-8xl lg:text-[7.5rem] max-w-3xl">
            No formamos jugadores, formamos campeones.
          </h1>
          <p className="mt-7 text-lg sm:text-xl text-[#C9D5E6] max-w-xl leading-relaxed">
            Clases para niños, jóvenes y adultos, desde los 7 años. La primera clase es de prueba, sin costo.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row gap-3">
            <Link
              href="/registrations"
              className="h-14 px-8 inline-flex items-center justify-center gap-2 bg-[#F29A2E] hover:bg-[#FFB14A] text-[#071426] font-bold text-lg rounded-md transition-colors"
            >
              Inscribirme <ArrowRight size={20} />
            </Link>
            <Link
              href="/club/contact"
              className="h-14 px-8 inline-flex items-center justify-center border border-white/30 hover:border-white text-white font-semibold text-lg rounded-md transition-colors"
            >
              Ver horarios y sedes
            </Link>
          </div>
        </div>
      </section>

      {/* Datos clave */}
      <section aria-label="Datos del club" className="bg-[#0B1E38] text-white">
        <dl className="container mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-10">
          <div>
            <dt className="text-sm text-[#8FA3BF]">Edad mínima</dt>
            <dd className="font-heading font-bold text-4xl">7 años</dd>
          </div>
          <div>
            <dt className="text-sm text-[#8FA3BF]">Sedes en Medellín</dt>
            <dd className="font-heading font-bold text-4xl">{SEDES.length}</dd>
          </div>
          <div>
            <dt className="text-sm text-[#8FA3BF]">Primera clase</dt>
            <dd className="font-heading font-bold text-4xl">De prueba</dd>
          </div>
        </dl>
      </section>

      {/* Cómo empezar: es una secuencia, por eso va numerada */}
      <section className="bg-[#071426] text-white py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="font-heading font-extrabold text-5xl sm:text-6xl mb-12 max-w-2xl">Empezar es sencillo</h2>
          <ol className="grid md:grid-cols-3 gap-10 md:gap-8">
            {STEPS.map((step, i) => (
              <li key={step.title}>
                <div className="court-rule mb-5" />
                <span className="font-heading font-black text-6xl text-[#F29A2E] leading-none">{i + 1}</span>
                <h3 className="font-heading font-bold text-2xl mt-3 mb-2">{step.title}</h3>
                <p className="text-[#B7C4D8] leading-relaxed">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Categorías: marcador */}
      <section id="categorias" className="bg-[#EEF2F7] text-[#0F2347] py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="font-heading font-extrabold text-5xl sm:text-6xl mb-3">Categorías y horarios</h2>
          <p className="text-[#44546F] text-lg max-w-xl mb-10">
            Cada deportista entra en la categoría de su edad. Los horarios pueden ajustarse; confirmamos por WhatsApp.
          </p>

          <ul className="border-t border-[#0F2347]/15">
            {CATEGORIES.map((c) => (
              <li
                key={c.value}
                className="grid sm:grid-cols-[1.4fr_0.8fr_1.6fr] gap-x-6 gap-y-1 py-5 border-b border-[#0F2347]/15 items-baseline"
              >
                <h3 className="font-heading font-extrabold text-3xl">{c.value}</h3>
                <p className="font-heading font-bold text-2xl text-[#C46F0A]">
                  {c.maxAge >= 100 ? "18+ años" : c.minAge === 0 ? "7 a 11 años" : `${c.minAge} a ${c.maxAge} años`}
                </p>
                <p className="text-[#44546F]">
                  {c.horario}
                  <span className="block text-sm">{c.sede}</span>
                </p>
              </li>
            ))}
          </ul>

          <Link
            href="/registrations"
            className="mt-10 h-14 px-8 inline-flex items-center gap-2 bg-[#0F2347] hover:bg-[#071426] text-white font-bold text-lg rounded-md transition-colors"
          >
            Inscribirme <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Cómo entrenamos */}
      <section className="bg-[#071426] text-white py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="font-heading font-extrabold text-5xl sm:text-6xl mb-12 max-w-2xl">Así entrenamos</h2>
          <div className="grid md:grid-cols-3 gap-10 md:gap-8">
            {METHOD.map((m) => (
              <article key={m.title}>
                <div className="court-rule mb-5" />
                <h3 className="font-heading font-bold text-2xl mb-3">{m.title}</h3>
                <p className="text-[#B7C4D8] leading-relaxed mb-4">{m.text}</p>
                <Link href={m.href} className="inline-flex items-center gap-2 font-semibold text-[#F29A2E] hover:text-[#FFB14A]">
                  {m.cta} <ArrowRight size={16} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Preguntas frecuentes */}
      <section className="bg-[#0B1E38] text-white py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
          <h2 className="font-heading font-extrabold text-5xl sm:text-6xl mb-10">Preguntas frecuentes</h2>
          <div className="border-t border-white/15">
            {FAQS.map((f, i) => (
              <details key={f.q} name="faq" open={i === 0} className="group border-b border-white/15">
                <summary className="flex items-center justify-between gap-4 py-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <h3 className="font-heading font-bold text-2xl">{f.q}</h3>
                  <ChevronDown className="shrink-0 text-[#F29A2E] transition-transform group-open:rotate-180" />
                </summary>
                <p className="pb-6 text-[#C9D5E6] leading-relaxed max-w-2xl">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Cierre */}
      <section className="bg-[#F29A2E] text-[#071426] py-20 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div>
            <h2 className="font-heading font-black text-5xl sm:text-7xl leading-[0.95] max-w-2xl">
              Tu lugar en la cancha te espera.
            </h2>
            <a
              href={SITE.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 font-semibold underline underline-offset-4"
            >
              <Camera size={18} /> Míranos en Instagram {SITE.instagram.handle}
            </a>
          </div>
          <Link
            href="/registrations"
            className="h-14 px-8 shrink-0 inline-flex items-center justify-center gap-2 bg-[#071426] hover:bg-[#0F2347] text-white font-bold text-lg rounded-md transition-colors"
          >
            Inscribirme <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </>
  );
}
