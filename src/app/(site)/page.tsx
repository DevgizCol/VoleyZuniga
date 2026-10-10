import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronDown, Camera, MessageCircle, MapPin, Clock, Quote, Check, ShieldCheck, Users } from "lucide-react";
import HeroCourt from "@/components/HeroCourt";
import JsonLd from "@/components/JsonLd";
import NextSession from "@/components/NextSession";
import Volleyball from "@/components/Volleyball";
import BrandPhoto from "@/components/BrandPhoto";
import { PictoGrowth, PictoScore, PictoTechnique } from "@/components/Pictograms";
import { waLink } from "@/config/contact";
import { categorySchedules, getRecentRegistrations, getSessions, getSettings, spotsFor, trainingDays } from "@/lib/content";
import { CATEGORIES, SEDES } from "@/data/registration";
import { DAY_NAMES, formatTime } from "@/data/schedule";
import { getCoaches, getGallery, getTestimonials } from "@/lib/club";
import { faqList } from "@/data/faq";
import { faqPage, pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Club de voleibol en Medellín | Voley Zúñiga",
  absoluteTitle: true,
  path: "/",
  description: "Club de voleibol en Medellín para niños, jóvenes y adultos desde los 7 años. Cinco categorías, dos sedes y clase de prueba sin costo.",
});

const ageLabel = (min: number, max: number) => (max >= 100 ? "18 años o más" : min === 0 ? "7 a 11 años" : `${min} a ${max} años`);

// "Martes y Jueves (4:00 PM – 5:30 PM)" -> { days: "Martes y Jueves", hours: "4:00 PM – 5:30 PM" }
const splitSchedule = (value: string) => {
  const m = value.match(/^(.*?)\s*\((.*)\)\s*$/);
  return m ? { days: m[1], hours: m[2] } : { days: value, hours: "" };
};

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
    href: "/metodologia",
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
    href: "/partidos",
    cta: "Ver partidos",
  },
];

const VALUES = ["Puntualidad", "Resiliencia", "Humildad", "Respeto"];

// Por debajo de este número el contador de inscripciones no se muestra: con pocas, juega en contra.
const MIN_SOCIAL_PROOF = 5;
const spotsLabel = (n: number) => (n === 0 ? "Lista de espera" : n === 1 ? "Queda 1 cupo" : `Quedan ${n} cupos`);

export const revalidate = 300;

export default async function Home() {
  const [SESSIONS, settings, photos, testimonials, coaches, recent] = await Promise.all([
    getSessions(),
    getSettings(),
    getGallery(),
    getTestimonials(),
    getCoaches(),
    getRecentRegistrations(),
  ]);
  const TRAINING_DAYS = trainingDays(SESSIONS);
  const perCategory = categorySchedules(SESSIONS);
  const { contact } = settings;
  const marqueeItems = CATEGORIES.map((c) => c.value);
  const heroMedia = settings.heroVideo || settings.heroPhoto;
  const FAQS = faqList(settings.priceFrom);
  // Las cifras reales del club (Ajustes) anclan trayectoria; si no están, se usan las del código.
  const STATS = settings.stats.length
    ? settings.stats
    : [
        { value: CATEGORIES.length, label: "categorías, de los 7 años a mayores" },
        { value: SESSIONS.length, label: "entrenamientos cada semana" },
        { value: SEDES.length, label: "sedes en Medellín" },
      ];
  const statCols = STATS.length >= 4 ? "lg:grid-cols-4" : STATS.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2";

  return (
    <>
      <JsonLd data={faqPage(FAQS)} />
      {/* ================= PORTADA ================= */}
      <section className="relative isolate overflow-hidden floodlights grain text-white min-h-[100svh] flex flex-col">
        {heroMedia ? (
          <div className="absolute inset-0 -z-10" aria-hidden="true">
            {settings.heroVideo ? (
              <div className="duotone absolute inset-0">
                <video
                  src={settings.heroVideo}
                  poster={settings.heroPhoto || undefined}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            ) : (
              <BrandPhoto src={settings.heroPhoto} alt="" eager className="absolute inset-0" />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-[#071426] via-[#071426]/80 to-[#071426]/20" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#071426] to-transparent" />
          </div>
        ) : null}
        <div className="container mx-auto px-4 sm:px-6 flex-1 grid lg:grid-cols-12 items-center gap-6 pt-40 sm:pt-44 lg:pt-32 pb-10">
          <div className="lg:col-span-6 relative z-10 hero-rise min-w-0">
            {settings.homeNotice ? (
              <Link href="/inscripciones" className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#F29A2E] text-[#071426] px-4 py-2 text-sm font-bold hover:bg-[#FFB14A]">
                <span className="w-2 h-2 rounded-full bg-[#071426] animate-pulse" /> {settings.homeNotice} <ArrowRight size={14} />
              </Link>
            ) : null}
            {/* Le habla a quien decide (en cuatro de las cinco categorías es el acudiente) e incluye
                "Club de voleibol en Medellín", que es lo que la gente busca en Google. */}
            <h1>
              <span className="flex items-center gap-2 font-sans normal-case tracking-normal text-[#F29A2E] font-semibold text-base">
                <span className="h-px w-8 bg-[#F29A2E]" aria-hidden="true" /> Club de voleibol en Medellín
              </span>
              <span className="sr-only">: </span>
              <span className="block mt-5 font-heading font-black uppercase leading-[0.86] tracking-tight text-[clamp(3rem,14.5vw,5.5rem)] lg:text-[6rem] xl:text-[6.6rem]">
                Voleibol, disciplina
                <span className="block text-[#F29A2E]">y equipo.</span>
              </span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-[#C9D5E6] max-w-md leading-relaxed">
              Para niños desde los 7 años, jóvenes y adultos. La primera clase va por nuestra cuenta.
            </p>
            {/* Dos caminos: cada uno abre el formulario con la edad sugerida para esa persona. */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/inscripciones?para=hijo"
                className="group h-14 px-7 inline-flex items-center justify-center gap-2 bg-[#F29A2E] hover:bg-[#FFB14A] text-[#071426] font-bold text-lg rounded-md shadow-[0_10px_30px_-8px_rgba(242,154,46,0.7)] transition-all"
              >
                Clase gratis para mi hijo
                <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/inscripciones?para=mi"
                className="group h-14 px-7 inline-flex items-center justify-center gap-2 border border-white/25 hover:border-white hover:bg-white/5 text-white font-semibold text-lg rounded-md transition-colors"
              >
                Clase gratis para mí
              </Link>
            </div>
            <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#B7C4D8]">
              {["Sin costo ni compromiso", "Solo trae ropa cómoda y agua", "Te confirmamos por WhatsApp"].map((t) => (
                <li key={t} className="inline-flex items-center gap-1.5">
                  <Check size={15} className="text-[#F29A2E]" aria-hidden="true" /> {t}
                </li>
              ))}
            </ul>
            {recent >= MIN_SOCIAL_PROOF ? (
              <p className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-white">
                <Users size={16} className="text-[#F29A2E]" aria-hidden="true" />
                {recent} familias reservaron su clase de prueba en el último mes
              </p>
            ) : null}
            <p className="mt-3 text-sm">
              <a href="#semana" className="font-semibold text-[#F29A2E] hover:text-[#FFB14A] underline underline-offset-4">
                Ver horarios y sedes
              </a>
            </p>
            <div className="mt-8 max-w-md">
              <NextSession sessions={SESSIONS} />
            </div>
          </div>

          {heroMedia ? null : (
            // En el celular la cancha queda detrás y muy tenue para que el titular se lea limpio.
            <div className="lg:col-span-6 order-first lg:order-none -mx-10 sm:mx-0 -mb-6 lg:mb-0 absolute lg:relative inset-x-0 top-[38%] sm:top-20 lg:top-auto opacity-[0.14] sm:opacity-30 lg:opacity-100 -z-10 lg:z-0">
              <HeroCourt className="w-full lg:scale-110 lg:translate-x-6" />
            </div>
          )}
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
      <section id="ruta" className="relative isolate bg-[#071426] text-white py-24 sm:py-32 overflow-hidden">
        <div className="net-texture" aria-hidden="true" />
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-12 gap-6 items-end mb-14">
            <h2 className="lg:col-span-7 font-heading font-black uppercase leading-[0.9] text-5xl sm:text-7xl reveal">
              La ruta del deportista
            </h2>
            <p className="lg:col-span-5 text-[#B7C4D8] text-lg leading-relaxed">
              Cinco categorías, una sola idea: que cada etapa prepare la siguiente. Entra en la de tu edad y avanza a tu ritmo.
              {settings.priceFrom ? (
                <span className="block mt-3 text-white font-semibold">
                  Mensualidad desde {settings.priceFrom}. La clase de prueba no tiene costo.
                </span>
              ) : null}
            </p>
          </div>

          <ol className="relative grid grid-flow-col auto-cols-[78%] sm:auto-cols-[45%] lg:grid-flow-row lg:grid-cols-5 gap-4 overflow-x-auto lg:overflow-visible snap-x snap-mandatory pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 [scrollbar-width:none]">
            <div className="hidden lg:block absolute left-0 right-0 top-[22px] h-px bg-gradient-to-r from-[#F29A2E] via-[#F29A2E]/50 to-[#F29A2E]/10" aria-hidden="true" />
            {CATEGORIES.map((c, i) => {
              const { name, tag } = splitCategory(c.value);
              const { days, hours } = splitSchedule(perCategory[c.value]?.horario ?? c.horario);
              const spots = spotsFor(settings.spots, c.value);
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
                    {/* Solo cupos reales y escasos: con muchos libres no se muestra nada. */}
                    {spots !== null && spots <= 5 ? (
                      <p className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-bold ${spots === 0 ? "bg-white/10 text-[#C9D5E6]" : "bg-[#F29A2E] text-[#071426]"}`}>
                        {spotsLabel(spots)}
                      </p>
                    ) : null}
                    <div className="mt-5 pt-5 border-t border-white/10 space-y-2 text-sm text-[#B7C4D8]">
                      <p className="flex gap-2">
                        <Clock size={16} className="shrink-0 mt-0.5 text-[#8FA3BF]" />
                        <span>
                          {days}
                          {hours ? <span className="block whitespace-nowrap text-white font-semibold">{hours}</span> : null}
                        </span>
                      </p>
                      <p className="flex gap-2"><MapPin size={16} className="shrink-0 mt-0.5 text-[#8FA3BF]" />{perCategory[c.value]?.sede ?? c.sede}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* El club en cifras: cuentan hacia arriba al entrar en pantalla */}
          <dl className={`mt-16 sm:mt-20 grid grid-cols-2 ${statCols} gap-x-6 gap-y-10 border-t border-white/10 pt-12`}>
            {STATS.map((s) => (
              <div key={s.label} className="reveal">
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="sr-only">{s.value}</span>
                  <span aria-hidden="true" className="count block font-heading font-black text-7xl sm:text-8xl leading-none text-[#F29A2E] tabular-nums" style={{ "--to": s.value } as React.CSSProperties} />
                  <span aria-hidden="true" className="mt-2 block text-[#B7C4D8] max-w-[14rem]">{s.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ================= SEMANA DE ENTRENAMIENTOS ================= */}
      <section id="semana" className="relative bg-[#EEF2F7] text-[#0F2347] py-24 sm:py-32 overflow-hidden">
        <Volleyball className="absolute -right-24 -top-24 w-[420px] opacity-[0.06]" id="wm-week" />
        <div className="container mx-auto px-4 sm:px-6 relative">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
            <h2 className="font-heading font-black uppercase leading-[0.9] text-5xl sm:text-7xl reveal">La semana en la cancha</h2>
            <p className="text-[#44546F] text-lg max-w-md">
              Horarios de referencia. Antes de tu primera clase confirmamos todo por WhatsApp.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start reveal-stagger">
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
                        <p className="font-semibold mt-1.5">{s.group.replace(/-/g, "\u2011")}</p>
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
              href="/inscripciones"
              className="group h-14 px-7 inline-flex items-center justify-center gap-2 bg-[#0F2347] hover:bg-[#071426] text-white font-bold text-lg rounded-md transition-colors"
            >
              Reservar clase gratis <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href={waLink(contact, "Hola, quiero confirmar los horarios de entrenamiento del Club Voley Zúñiga")}
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
      <section className="relative isolate bg-[#071426] text-white py-24 sm:py-32 overflow-hidden grain">
        <div className="net-texture" aria-hidden="true" />
        <div className="container mx-auto px-4 sm:px-6 relative">
          <h2 className="font-heading font-black uppercase leading-[0.9] text-5xl sm:text-7xl mb-14 max-w-3xl reveal">
            Así entrenamos
          </h2>
          <div className="grid md:grid-cols-3 gap-4 reveal-stagger">
            {METHOD.map(({ Picto, title, text, href, cta }) => (
              <article
                key={title}
                className="group relative rounded-xl border border-white/10 bg-white/[0.03] p-7 sm:p-8 transition-all hover:-translate-y-1 hover:bg-white/[0.06] hover:border-[#F29A2E]/50 hover:shadow-[0_24px_50px_-20px_rgba(242,154,46,0.35)]"
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

      {/* ================= QUIÉN TE ENTRENA ================= */}
      {coaches.length > 0 && (
        <section className="bg-[#0B1E38] text-white py-20 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
              <h2 className="font-heading font-black uppercase leading-[0.9] text-5xl sm:text-6xl reveal">Quién te entrena</h2>
              <Link href="/el-club" className="inline-flex items-center gap-2 font-semibold text-[#F29A2E] hover:text-[#FFB14A]">
                Conoce al cuerpo técnico <ArrowRight size={16} />
              </Link>
            </div>
            <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 reveal-stagger">
              {coaches.slice(0, 4).map((c) => (
                <li key={c.name} className="flex flex-col">
                  <div className="relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#0F2347] to-[#071426]">
                    {c.photo ? (
                      <BrandPhoto src={c.photo} alt={`Foto de ${c.name}`} hover className="absolute inset-0" />
                    ) : (
                      <span className="absolute inset-0 flex items-center justify-center font-heading font-black text-6xl text-[#F29A2E]/40" aria-hidden="true">
                        {c.name.split(/\s+/).slice(0, 2).map((w) => w[0]).join("")}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 font-heading font-extrabold text-2xl leading-none">{c.name}</p>
                  {c.role ? <p className="mt-1 text-sm font-semibold text-[#F29A2E]">{c.role}</p> : null}
                  {c.categories ? <p className="text-sm text-[#8FA3BF]">{c.categories}</p> : null}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ================= CUIDADO Y AFILIACIONES ================= */}
      {(settings.care.length > 0 || settings.affiliations.length > 0) && (
        <section aria-label="Confianza" className="bg-[#EEF2F7] text-[#0F2347] py-20 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-10 items-start">
            {settings.care.length > 0 && (
              <div className={settings.affiliations.length ? "lg:col-span-8" : "lg:col-span-12"}>
                <h2 className="font-heading font-black uppercase leading-[0.9] text-5xl sm:text-6xl reveal">Así cuidamos a tu hijo</h2>
                <ul className="mt-8 grid sm:grid-cols-2 gap-x-8 gap-y-4">
                  {settings.care.map((item) => (
                    <li key={item} className="flex gap-3 text-lg leading-snug">
                      <ShieldCheck size={22} className="shrink-0 mt-0.5 text-[#C46F0A]" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {settings.affiliations.length > 0 && (
              <div className={settings.care.length ? "lg:col-span-4" : "lg:col-span-12"}>
                <p className="text-sm font-bold uppercase tracking-wider text-[#44546F]">Club afiliado a</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {settings.affiliations.map((a) => (
                    <li key={a} className="rounded-md border border-[#0F2347]/20 bg-white px-4 py-2.5 font-semibold">
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ================= VALORES ================= */}
      <section aria-label="Nuestros valores" className="relative bg-[#0B1E38] text-white py-16 sm:py-20 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4 flex items-center gap-5">
            <Image src="/logo-trim.png" alt="" width={800} height={473} className="w-32 h-auto" />
            <p className="text-[#B7C4D8] leading-relaxed">
              Lo que se entrena fuera del marcador también cuenta.
            </p>
          </div>
          <ul className="lg:col-span-8 flex flex-wrap gap-x-6 gap-y-1 font-heading font-black uppercase text-5xl sm:text-6xl leading-none reveal-stagger">
            {VALUES.map((v, i) => (
              <li key={v} className={i % 2 ? "text-transparent [-webkit-text-stroke:1.5px_#F29A2E]" : "text-white"}>
                {v}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ================= FOTOS ================= */}
      {photos.length > 0 && (
        <section className="bg-[#071426] text-white py-24 sm:py-32">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
              <h2 className="font-heading font-black uppercase leading-[0.9] text-5xl sm:text-7xl reveal">En la cancha</h2>
              <Link href="/galeria" className="inline-flex items-center gap-2 font-semibold text-[#F29A2E] hover:text-[#FFB14A]">
                Ver la galería <ArrowRight size={16} />
              </Link>
            </div>
            {/* La primera foto va grande; todas con el color del club y su color real al pasar el mouse */}
            <ul className="grid grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-3 sm:gap-4 reveal-stagger">
              {photos.slice(0, 5).map((p, i) => (
                <li
                  key={`${p.image}-${i}`}
                  className={`relative rounded-xl overflow-hidden border border-white/10 ${i === 0 ? "col-span-2 row-span-2 aspect-square lg:aspect-auto" : "aspect-square"}`}
                >
                  <BrandPhoto src={p.image} alt={p.title || "Foto del Club Voley Zúñiga"} hover className="absolute inset-0" />
                  {p.title ? (
                    <p className="absolute inset-x-0 bottom-0 z-10 p-4 pt-10 bg-gradient-to-t from-[#071426]/90 to-transparent text-sm font-semibold">{p.title}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ================= TESTIMONIOS ================= */}
      {testimonials.length > 0 && (
        <section className="bg-[#EEF2F7] text-[#0F2347] py-24 sm:py-32">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="font-heading font-black uppercase leading-[0.9] text-5xl sm:text-7xl mb-12 reveal">Lo que dicen las familias</h2>
            <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 reveal-stagger">
              {testimonials.slice(0, 6).map((t) => (
                <li key={t.name + t.text.slice(0, 20)}>
                  <figure className="h-full rounded-xl bg-white p-7 shadow-[0_1px_0_rgba(15,35,71,0.06),0_20px_40px_-24px_rgba(15,35,71,0.35)] flex flex-col">
                    <Quote size={28} className="text-[#F29A2E]" aria-hidden="true" />
                    <blockquote className="mt-4 text-lg leading-relaxed flex-1">{t.text}</blockquote>
                    <figcaption className="mt-6 pt-5 border-t border-[#0F2347]/10">
                      <span className="font-heading font-extrabold text-2xl">{t.name}</span>
                      {t.relation ? <span className="block text-sm text-[#44546F]">{t.relation}</span> : null}
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ================= PREGUNTAS ================= */}
      <section className="relative isolate bg-white text-[#0F2347] py-24 sm:py-32 overflow-hidden">
        <Volleyball className="absolute -z-10 -left-28 bottom-[-6rem] w-[380px] opacity-[0.07]" id="wm-faq" />
        <div className="container mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <h2 className="font-heading font-black uppercase leading-[0.9] text-5xl sm:text-6xl reveal">Preguntas frecuentes</h2>
            <div className="mt-8 rounded-xl border border-[#25D366]/40 bg-[#25D366]/[0.08] p-6">
              <p className="font-heading font-extrabold text-2xl">¿Te quedó alguna duda?</p>
              <p className="text-[#44546F] mt-1 mb-4">Escríbenos y te respondemos en horario de oficina.</p>
              <a
                href={waLink(contact)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 h-12 px-5 rounded-md bg-[#25D366] text-[#071426] font-bold hover:brightness-110"
              >
                <MessageCircle size={18} /> Escribir por WhatsApp
              </a>
            </div>
          </div>
          <div className="lg:col-span-8 border-t border-[#0F2347]/15">
            {FAQS.map((f, i) => (
              <details key={f.q} name="faq" open={i === 0} className="group border-b border-[#0F2347]/15">
                <summary className="flex items-center justify-between gap-4 py-6 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <h3 className="font-heading font-extrabold text-2xl sm:text-3xl group-open:text-[#C46F0A] transition-colors">{f.q}</h3>
                  <span className="shrink-0 w-10 h-10 rounded-full border border-[#0F2347]/20 flex items-center justify-center group-open:bg-[#F29A2E] group-open:border-[#F29A2E] group-open:text-[#071426] transition-colors">
                    <ChevronDown size={20} className="transition-transform group-open:rotate-180" />
                  </span>
                </summary>
                <p className="pb-7 text-[#44546F] text-lg leading-relaxed max-w-2xl">{f.a}</p>
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
            <h2 className="font-heading font-black uppercase leading-[0.88] text-6xl sm:text-8xl reveal-left">
              Tu lugar en la cancha te espera.
            </h2>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/inscripciones"
                className="group h-14 px-8 inline-flex items-center justify-center gap-2 bg-[#071426] hover:bg-[#0F2347] text-white font-bold text-lg rounded-md transition-colors"
              >
                Reservar clase gratis <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href={contact.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-14 px-7 inline-flex items-center justify-center gap-2 border-2 border-[#071426] font-bold text-lg rounded-md hover:bg-[#071426] hover:text-white transition-colors"
              >
                <Camera size={20} /> {contact.instagramHandle}
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
