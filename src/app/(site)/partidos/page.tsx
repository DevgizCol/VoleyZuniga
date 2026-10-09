import type { Metadata } from "next";
import Link from "next/link";
import { CalendarPlus, CalendarCheck, Clock, MapPin, Navigation, ArrowRight, Camera } from "lucide-react";
import { siteUrl } from "@/lib/site-url";
import PageHero from "@/components/PageHero";
import JsonLd from "@/components/JsonLd";
import CategoryFilter from "@/components/CategoryFilter";
import TeamBadge from "@/components/TeamBadge";
import { getSettings } from "@/lib/content";
import { CATEGORIES } from "@/data/registration";
import { bogotaToday, calendarUrl, countdownLabel, dateParts, getMatches, time12, type Match } from "@/lib/matches";

export const metadata: Metadata = {
  title: "Partidos",
  alternates: { canonical: "/partidos" },
  description: "Calendario de partidos y resultados del Club Voley Zúñiga.",
};

export const revalidate = 300;

const mapsUrl = (venue: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${venue}, Medellín`)}`;

export default async function GamesPage({ searchParams }: { searchParams: Promise<{ cat?: string }> }) {
  const { cat } = await searchParams;
  const [allRaw, { contact }] = await Promise.all([getMatches(), getSettings()]);
  const all = allRaw ?? [];
  const today = bogotaToday();

  const categories = Array.from(new Set([...CATEGORIES.map((c) => c.value), ...all.map((m) => m.category)].filter(Boolean)));
  const active = cat && categories.includes(cat) ? cat : null;
  const matches = active ? all.filter((m) => m.category === active) : all;

  const upcoming = matches.filter((m) => !m.finished && m.date >= today);
  const results = matches.filter((m) => m.finished).reverse();
  const [next, ...later] = upcoming;
  const record = results.reduce(
    (acc, m) => (m.outcome === "win" ? { ...acc, w: acc.w + 1 } : m.outcome === "loss" ? { ...acc, l: acc.l + 1 } : acc),
    { w: 0, l: 0 }
  );

  const jsonLd = upcoming.slice(0, 10).map((m) => ({
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: `${m.home} vs ${m.away} · ${m.category}`,
    sport: "Volleyball",
    startDate: m.time ? `${m.date}T${m.time}:00-05:00` : m.date,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: { "@type": "Place", name: m.venue || "Por confirmar", address: { "@type": "PostalAddress", addressLocality: "Medellín", addressRegion: "Antioquia", addressCountry: "CO" } },
    homeTeam: { "@type": "SportsTeam", name: m.home },
    awayTeam: { "@type": "SportsTeam", name: m.away },
    organizer: { "@type": "SportsOrganization", name: "Club Voley Zúñiga", url: siteUrl },
    url: `${siteUrl}/partidos`,
  }));

  return (
    <>
      {jsonLd.length > 0 && (
        <JsonLd data={jsonLd} />
      )}
      <PageHero
        kicker="Calendario y resultados"
        title="Partidos"
        intro="Dónde y cuándo juegan nuestros equipos, y cómo nos fue. Ven a la tribuna: el apoyo también suma puntos."
      >
        <div className="flex flex-wrap gap-3">
          <Link
            href="/posiciones"
            className="h-12 px-6 inline-flex items-center gap-2 border border-white/25 hover:border-white hover:bg-white/5 font-semibold rounded-md transition-colors"
          >
            Ver posiciones <ArrowRight size={18} />
          </Link>
          {results.length > 0 && (
            <p className="h-12 px-5 inline-flex items-center gap-3 rounded-md bg-white/[0.06] border border-white/10">
              <span className="text-[#B7C4D8] text-sm">Balance</span>
              <span className="font-heading font-black text-2xl tabular-nums">
                <span className="text-[#25D366]">{record.w}G</span> <span className="text-white/40">·</span>{" "}
                <span className="text-[#FF7A6B]">{record.l}P</span>
              </span>
            </p>
          )}
        </div>
      </PageHero>

      <section className="bg-[#071426] text-white pb-24 sm:pb-32">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="py-6">
            <CategoryFilter basePath="/partidos" categories={categories} active={active} />
          </div>

          {next ? <FeaturedMatch m={next} /> : <EmptyUpcoming filtered={Boolean(active)} instagram={contact} />}

          {later.length > 0 && (
            <div className="mt-16">
              <h2 className="font-heading font-black uppercase text-4xl sm:text-5xl mb-6">Próximos partidos</h2>
              <ul className="space-y-3">
                {later.map((m) => (
                  <UpcomingRow key={m.id} m={m} />
                ))}
              </ul>
            </div>
          )}

          <SubscribeBox />

          <div className="mt-20">
            <h2 className="font-heading font-black uppercase text-4xl sm:text-5xl mb-6">Resultados</h2>
            {results.length > 0 ? (
              <ul className="space-y-3">
                {results.map((m) => (
                  <ResultRow key={m.id} m={m} />
                ))}
              </ul>
            ) : (
              <p className="rounded-xl border border-dashed border-white/15 p-8 text-[#B7C4D8]">
                Todavía no hay resultados publicados{active ? ` para ${active}` : ""}. Aquí aparecerá el marcador de cada partido apenas termine.
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function FeaturedMatch({ m }: { m: Match }) {
  const d = dateParts(m.date);
  return (
    <article className="relative mt-4 rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#0F2347] via-[#0B1E38] to-[#071426] shadow-[0_40px_80px_-40px_rgba(242,154,46,0.35)]">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#F29A2E] via-[#FFB14A] to-[#F29A2E]" />
      <div className="flex items-center justify-between gap-3 px-5 sm:px-8 pt-6">
        <span className="text-sm font-semibold text-[#F29A2E]">Próximo partido · {m.category}</span>
        <span className="shrink-0 whitespace-nowrap h-8 px-3 inline-flex items-center rounded-full bg-[#F29A2E] text-[#071426] text-sm font-bold">
          {countdownLabel(m.date)}
        </span>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-8 px-5 sm:px-8 py-10">
        <TeamSide name={m.home} isClub={m.clubIsHome} label="Local" />
        <div className="text-center">
          <p className="font-heading font-black text-5xl sm:text-7xl leading-none tabular-nums">{d.day}</p>
          <p className="font-heading font-bold uppercase text-xl sm:text-2xl text-[#F29A2E]">{d.month}</p>
          <p className="mt-2 font-heading font-black text-white/30 text-2xl">VS</p>
        </div>
        <TeamSide name={m.away} isClub={m.clubPlays && !m.clubIsHome} label="Visitante" />
      </div>

      <div className="border-t border-white/10 px-5 sm:px-8 py-5 flex flex-col lg:flex-row lg:items-center gap-4 lg:justify-between">
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[#C9D5E6]">
          <span className="inline-flex items-center gap-2">
            <Clock size={18} className="text-[#F29A2E]" /> {d.weekday.charAt(0).toUpperCase() + d.weekday.slice(1)} {d.day} de {d.monthLong} · {time12(m.time)}
          </span>
          {m.venue && (
            <span className="inline-flex items-center gap-2">
              <MapPin size={18} className="text-[#F29A2E]" /> {m.venue}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href={calendarUrl(m)}
            target="_blank"
            rel="noopener noreferrer"
            className="h-11 px-5 inline-flex items-center gap-2 bg-[#F29A2E] hover:bg-[#FFB14A] text-[#071426] font-bold rounded-md transition-colors"
          >
            <CalendarPlus size={18} /> Agregar a mi calendario
          </a>
          {m.venue && (
            <a
              href={mapsUrl(m.venue)}
              target="_blank"
              rel="noopener noreferrer"
              className="h-11 px-5 inline-flex items-center gap-2 border border-white/25 hover:border-white font-semibold rounded-md transition-colors"
            >
              <Navigation size={18} /> Cómo llegar
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function TeamSide({ name, isClub, label }: { name: string; isClub: boolean; label: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-3 min-w-0">
      <TeamBadge name={name} isClub={isClub} size="lg" />
      <div className="min-w-0">
        <p className={`font-heading font-black uppercase text-xl sm:text-3xl leading-tight break-words ${isClub ? "text-white" : "text-[#C9D5E6]"}`}>
          {name}
        </p>
        <p className="text-xs text-[#8FA3BF] mt-1">{label}</p>
      </div>
    </div>
  );
}

function DateBlock({ iso, muted = false }: { iso: string; muted?: boolean }) {
  const d = dateParts(iso);
  return (
    <div className={`w-16 shrink-0 text-center rounded-lg py-2 ${muted ? "bg-white/[0.04]" : "bg-[#F29A2E]/10 border border-[#F29A2E]/30"}`}>
      <p className="font-heading font-black text-3xl leading-none tabular-nums">{d.day}</p>
      <p className={`font-heading font-bold uppercase text-sm ${muted ? "text-[#8FA3BF]" : "text-[#F29A2E]"}`}>{d.month}</p>
    </div>
  );
}

function UpcomingRow({ m }: { m: Match }) {
  return (
    <li className="rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] transition-colors p-4 sm:p-5 flex items-center gap-4 sm:gap-6">
      <DateBlock iso={m.date} />
      <div className="flex-1 min-w-0">
        <p className="font-heading font-extrabold text-xl sm:text-2xl leading-tight">
          {m.home} <span className="text-white/35">vs</span> {m.away}
        </p>
        <p className="text-sm text-[#B7C4D8] mt-1 flex flex-wrap gap-x-4 gap-y-1">
          <span>{m.category}</span>
          <span>{time12(m.time)}</span>
          {m.venue && <span>{m.venue}</span>}
        </p>
      </div>
      <a
        href={calendarUrl(m)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Agregar ${m.home} vs ${m.away} a mi calendario`}
        className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/15 hover:border-[#F29A2E] hover:text-[#F29A2E] transition-colors"
      >
        <CalendarPlus size={18} />
      </a>
    </li>
  );
}

function ResultRow({ m }: { m: Match }) {
  const score = m.result.match(/(\d+)\s*[-–:]\s*(\d+)/);
  const sets = m.result.replace(/^\s*\d+\s*[-–:]\s*\d+\s*/, "").replace(/^[(\s]+|[)\s]+$/g, "");
  const tag =
    m.outcome === "win"
      ? { text: "Victoria", cls: "bg-[#25D366]/15 text-[#25D366] border-[#25D366]/30" }
      : m.outcome === "loss"
        ? { text: "Derrota", cls: "bg-[#FF7A6B]/15 text-[#FF7A6B] border-[#FF7A6B]/30" }
        : null;

  return (
    <li className="rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 grid grid-cols-[auto_1fr] sm:grid-cols-[auto_1fr_auto] items-center gap-4 sm:gap-6">
      <DateBlock iso={m.date} muted />
      <div className="min-w-0">
        <div className="flex items-center gap-3 flex-wrap">
          <p className="font-heading font-extrabold text-xl sm:text-2xl leading-tight">
            <span className={m.clubIsHome ? "text-white" : "text-[#C9D5E6]"}>{m.home}</span>{" "}
            <span className="text-white/35">vs</span>{" "}
            <span className={m.clubPlays && !m.clubIsHome ? "text-white" : "text-[#C9D5E6]"}>{m.away}</span>
          </p>
          {tag && <span className={`h-6 px-2.5 inline-flex items-center rounded-full border text-xs font-bold ${tag.cls}`}>{tag.text}</span>}
        </div>
        <p className="text-sm text-[#B7C4D8] mt-1">
          {m.category}
          {sets ? ` · Sets: ${sets}` : ""}
        </p>
      </div>
      <p className="col-span-2 sm:col-span-1 font-heading font-black text-4xl sm:text-5xl tabular-nums text-right">
        {score ? (
          <>
            {score[1]}
            <span className="text-white/30 mx-1">–</span>
            {score[2]}
          </>
        ) : (
          <span className="text-base font-semibold text-[#8FA3BF]">{m.status || "Sin marcador"}</span>
        )}
      </p>
    </li>
  );
}

function EmptyUpcoming({ filtered, instagram: contact }: { filtered: boolean; instagram: { instagramUrl: string; instagramHandle: string } }) {
  return (
    <div className="mt-4 rounded-2xl border border-white/10 bg-gradient-to-br from-[#0F2347] to-[#071426] p-8 sm:p-12 grid md:grid-cols-[1fr_auto] gap-8 items-center">
      <div>
        <h2 className="font-heading font-black uppercase text-4xl sm:text-5xl leading-none">
          {filtered ? "Sin partidos para esta categoría" : "Pronto publicaremos el calendario"}
        </h2>
        <p className="mt-4 text-[#C9D5E6] text-lg max-w-xl">
          Cuando la liga confirme fechas, verás aquí el próximo partido con la hora, la sede y un botón para guardarlo en tu calendario.
          Mientras tanto, las novedades salen primero en Instagram.
        </p>
      </div>
      <a
        href={contact.instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="h-12 px-6 inline-flex items-center gap-2 bg-[#F29A2E] hover:bg-[#FFB14A] text-[#071426] font-bold rounded-md transition-colors"
      >
        <Camera size={18} /> Seguir {contact.instagramHandle}
      </a>
    </div>
  );
}

function SubscribeBox() {
  const host = siteUrl.replace(/^https?:\/\//, "");
  const webcal = `webcal://${host}/calendario.ics`;
  const google = `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(webcal)}`;
  return (
    <div className="mt-16 rounded-2xl border border-[#F29A2E]/30 bg-gradient-to-r from-[#F29A2E]/[0.12] to-transparent p-6 sm:p-8 grid md:grid-cols-[auto_1fr_auto] gap-5 items-center">
      <span className="w-14 h-14 rounded-xl bg-[#F29A2E] text-[#071426] flex items-center justify-center">
        <CalendarCheck size={28} />
      </span>
      <div>
        <h2 className="font-heading font-black uppercase text-3xl leading-none">Todos los partidos en tu celular</h2>
        <p className="mt-2 text-[#C9D5E6]">Suscríbete una vez y cada partido nuevo aparece solo en tu calendario, con hora y sede.</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <a href={google} target="_blank" rel="noopener noreferrer" className="h-12 px-5 inline-flex items-center gap-2 rounded-md bg-[#F29A2E] hover:bg-[#FFB14A] text-[#071426] font-bold">
          Google Calendar
        </a>
        <a href={webcal} className="h-12 px-5 inline-flex items-center gap-2 rounded-md border border-white/25 hover:border-white font-semibold">
          iPhone / Outlook
        </a>
      </div>
    </div>
  );
}
