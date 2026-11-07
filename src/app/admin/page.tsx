import Link from "next/link";
import { Inbox, Users, Mail, CalendarDays, ArrowRight, CheckCircle2, CloudRain } from "lucide-react";
import { getAdmin } from "@/lib/auth";
import { adminRead } from "@/lib/sheets";
import { funnel } from "@/lib/admin/free-class";
import { siteUrl } from "@/lib/site-url";
import { GroupMessage } from "./AdminTools";
import StatusSelect from "./_components/StatusSelect";
import EditorButton from "./_components/EditorButton";
import { Card, PageHeader, Badge, NotConnected, btn } from "./_components/ui";
import { FIXTURE_FIELDS, NEWS_FIELDS } from "./_components/fields";
import { bogotaToday, daysAgo, isoDate, shortDate, hhmm, waLink } from "./_components/format";
import { WhatsAppIcon } from "@/components/BrandIcons";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const user = await getAdmin();
  const [regs, msgs, fixture, court] = await Promise.all([adminRead("Inscripciones"), adminRead("Contacto"), adminRead("Fixture"), adminRead("Cancha")]);
  const today = bogotaToday();
  const weekAgo = daysAgo(7);

  const registrations = (regs?.rows ?? []).slice().reverse();
  const pending = registrations.filter((r) => (r.Estado || "Nuevo") === "Nuevo");
  const regsWeek = registrations.filter((r) => isoDate(r.Fecha) >= weekAgo);
  const monthAgo = daysAgo(30);
  const fun = funnel(registrations.filter((r) => isoDate(r.Fecha) >= monthAgo));
  const pct = (n: number) => (fun.total.inscritos ? `${Math.round((n / fun.total.inscritos) * 100)} %` : "");
  const messages = (msgs?.rows ?? []).slice().reverse();
  const msgsNew = messages.filter((m) => (m.Estado || "Nuevo") === "Nuevo");
  const upcoming = (fixture?.rows ?? [])
    .filter((m) => isoDate(m.Fecha) >= today && !m.Resultado && (m.Activo || "").toUpperCase() !== "NO")
    .sort((a, b) => (isoDate(a.Fecha) + hhmm(a.Hora)).localeCompare(isoDate(b.Fecha) + hhmm(b.Hora)));
  const toScore = (fixture?.rows ?? []).filter((m) => isoDate(m.Fecha) < today && !m.Resultado && !/cancel|aplaz/i.test(m.Estado || ""));
  const alerts = (court?.rows ?? []).filter((c) => c.Estado && c.Estado !== "Normal");
  const hour = Number(new Intl.DateTimeFormat("en-US", { timeZone: "America/Bogota", hour: "numeric", hour12: false }).format(new Date()));
  const greeting = hour < 12 ? "Buenos días" : hour < 19 ? "Buenas tardes" : "Buenas noches";

  return (
    <>
      <PageHeader title={`${greeting}, ${user?.name.split(" ")[0] ?? ""}`} description="Lo importante de hoy en el club. Todo lo que cambies aquí se ve en la web al instante.">
        <EditorButton sheet="Fixture" fields={FIXTURE_FIELDS} title="Nuevo partido" mode="create" label="Nuevo partido" defaults={{ Estado: "Programado", Local: "Club Voley Zúñiga" }} />
        <EditorButton sheet="Noticias" fields={NEWS_FIELDS} title="Nueva noticia" mode="create" label="Nueva noticia" variant="secondary" defaults={{ Fecha: today }} preview="news" />
      </PageHeader>

      {!regs && !fixture ? <NotConnected /> : null}

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-8">
        <Stat href="/admin/inscripciones" icon={<Inbox size={18} />} label="Inscripciones sin atender" value={pending.length} accent={pending.length > 0} />
        <Stat href="/admin/inscripciones" icon={<Users size={18} />} label="Inscripciones en 7 días" value={regsWeek.length} />
        <Stat href="/admin/mensajes" icon={<Mail size={18} />} label="Mensajes nuevos" value={msgsNew.length} accent={msgsNew.length > 0} />
        <Stat
          href="/admin/partidos"
          icon={<CalendarDays size={18} />}
          label="Próximo partido"
          value={upcoming[0] ? shortDate(upcoming[0].Fecha) : "—"}
          detail={upcoming[0] ? `${upcoming[0].Categoría} · ${hhmm(upcoming[0].Hora) || "hora por confirmar"}` : "Sin partidos programados"}
        />
      </div>

      {fun.total.inscritos > 0 ? (
        <section aria-labelledby="embudo" className="mb-8 rounded-2xl border border-white/10 bg-night p-5">
          <h2 id="embudo" className="font-heading font-black uppercase text-2xl">Embudo · últimos 30 días</h2>
          <p className="text-sm text-steel">De la inscripción a la matrícula, pasando por la clase gratis.</p>
          <ol className="mt-4 grid grid-cols-3 gap-3">
            {([["Inscritos", fun.total.inscritos, ""], ["Clase gratis", fun.total.asistieron, pct(fun.total.asistieron)], ["Matriculados", fun.total.matriculados, pct(fun.total.matriculados)]] as const).map(([label, n, p]) => (
              <li key={label} className="rounded-xl bg-white/[0.04] p-3">
                <p className="text-xs text-steel">{label}</p>
                <p className="font-heading font-black text-3xl tabular-nums">{n}</p>
                {p ? <p className="text-xs text-accent font-semibold">{p} de los inscritos</p> : null}
              </li>
            ))}
          </ol>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <caption className="sr-only">Embudo por canal de llegada</caption>
              <thead className="text-xs text-steel">
                <tr>
                  <th className="py-2 pr-3 font-semibold">Canal</th>
                  <th className="py-2 px-3 font-semibold text-right">Inscritos</th>
                  <th className="py-2 px-3 font-semibold text-right">Clase gratis</th>
                  <th className="py-2 pl-3 font-semibold text-right">Matriculados</th>
                </tr>
              </thead>
              <tbody>
                {fun.porOrigen.slice(0, 6).map((f) => (
                  <tr key={f.origen} className="border-t border-white/10">
                    <td className="py-2 pr-3 font-semibold">{f.origen}</td>
                    <td className="py-2 px-3 text-right tabular-nums">{f.inscritos}</td>
                    <td className="py-2 px-3 text-right tabular-nums">{f.asistieron}</td>
                    <td className="py-2 pl-3 text-right tabular-nums">{f.matriculados}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {(toScore.length > 0 || alerts.length > 0) && (
        <div className="grid md:grid-cols-2 gap-3 mb-8">
          {toScore.length > 0 && (
            <Link href="/admin/partidos?vista=resultados" className="rounded-2xl border border-accent/40 bg-accent/10 p-5 flex items-center gap-4 hover:bg-accent/15">
              <CalendarDays className="text-accent shrink-0" />
              <span className="flex-1">
                <strong className="block">{toScore.length === 1 ? "Falta 1 resultado" : `Faltan ${toScore.length} resultados`} por cargar</strong>
                <span className="text-sm text-[#C9D5E6]">Partidos ya jugados sin marcador.</span>
              </span>
              <ArrowRight size={18} />
            </Link>
          )}
          {alerts.length > 0 && (
            <Link href="/admin/canchas" className="rounded-2xl border border-accent/40 bg-accent/10 p-5 flex items-center gap-4 hover:bg-accent/15">
              <CloudRain className="text-accent shrink-0" />
              <span className="flex-1">
                <strong className="block">Aviso activo en la web</strong>
                <span className="text-sm text-[#C9D5E6]">{alerts.map((a) => `${a.Estado} · ${a.Sede}`).join(" / ")}</span>
              </span>
              <ArrowRight size={18} />
            </Link>
          )}
        </div>
      )}

      <div className="grid xl:grid-cols-12 gap-6">
        <section className="xl:col-span-7">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading font-black uppercase text-2xl">Por atender</h2>
            <Link href="/admin/inscripciones" className={btn.ghost}>
              Ver todas <ArrowRight size={14} />
            </Link>
          </div>
          {pending.length === 0 ? (
            <Card className="p-6 flex items-center gap-3 text-[#7AF0A8]">
              <CheckCircle2 /> Todas las inscripciones están atendidas.
            </Card>
          ) : (
            <ul className="space-y-2.5">
              {pending.slice(0, 6).map((r) => {
                const wa = waLink(r.WhatsApp, `Hola, te escribimos del Club Voley Zúñiga sobre la inscripción de ${r.Nombre}${r["Código"] ? ` (código ${r["Código"]})` : ""}. ¿Cuándo podemos agendar la clase de prueba?`);
                return (
                  <li key={r._row}>
                    <Card className="p-4 flex flex-wrap items-center gap-3">
                      <div className="flex-1 min-w-[180px]">
                        <p className="font-heading font-extrabold text-xl leading-tight">{r.Nombre}</p>
                        <p className="text-sm text-[#B7C4D8]">
                          {r.Edad} años · {r["Categoría"]} · {shortDate(r.Fecha)}
                        </p>
                      </div>
                      {wa ? (
                        <a href={wa} target="_blank" rel="noopener noreferrer" className={btn.whatsapp}>
                          <WhatsAppIcon size={16} /> Escribir
                        </a>
                      ) : null}
                      <StatusSelect sheet="Inscripciones" row={r} />
                    </Card>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="xl:col-span-5 space-y-6">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-heading font-black uppercase text-2xl">Próximos partidos</h2>
              <Link href="/admin/partidos" className={btn.ghost}>
                Todos <ArrowRight size={14} />
              </Link>
            </div>
            {upcoming.length === 0 ? (
              <p className="text-[#B7C4D8]">No hay partidos programados.</p>
            ) : (
              <ul className="divide-y divide-white/10">
                {upcoming.slice(0, 4).map((m) => (
                  <li key={m._row} className="py-3 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">
                        {m.Local} vs {m.Visitante}
                      </p>
                      <p className="text-sm text-steel">
                        {shortDate(m.Fecha)} · {hhmm(m.Hora) || "por confirmar"} · {m["Categoría"]}
                      </p>
                    </div>
                    <EditorButton sheet="Fixture" fields={FIXTURE_FIELDS} title="Editar partido" mode="edit" row={m} />
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="p-5">
            <h2 className="font-heading font-black uppercase text-2xl mb-1">Mensaje al grupo</h2>
            <p className="text-sm text-[#B7C4D8] mb-4">Escribe el aviso y elige el grupo de familias al abrir WhatsApp.</p>
            <GroupMessage gamesUrl={`${siteUrl}/games`} />
          </Card>

          {messages.length > 0 && (
            <Card className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-heading font-black uppercase text-2xl">Último mensaje</h2>
                <Badge tone={msgsNew.length ? "accent" : "muted"}>{msgsNew.length === 1 ? "1 nuevo" : `${msgsNew.length} nuevos`}</Badge>
              </div>
              <p className="font-semibold">
                {messages[0].Nombre} · <span className="text-steel font-normal">{messages[0].Asunto}</span>
              </p>
              <p className="text-[#C9D5E6] mt-1 line-clamp-3">{messages[0].Mensaje}</p>
              <Link href="/admin/mensajes" className={`${btn.ghost} mt-3`}>
                Ver mensajes <ArrowRight size={14} />
              </Link>
            </Card>
          )}
        </section>
      </div>
    </>
  );
}

function Stat({ href, icon, label, value, detail, accent = false }: { href: string; icon: React.ReactNode; label: string; value: string | number; detail?: string; accent?: boolean }) {
  return (
    <Link href={href} className={`rounded-2xl p-4 sm:p-5 border transition-colors ${accent ? "bg-accent border-accent text-primary-dark hover:bg-accent-light" : "bg-night border-white/10 hover:border-white/25"}`}>
      <span className={`flex items-center gap-2 text-sm ${accent ? "text-primary-dark/80" : "text-steel"}`}>
        {icon}
        {label}
      </span>
      <span className="block font-heading font-black text-4xl sm:text-5xl leading-none mt-2 tabular-nums">{value}</span>
      {detail ? <span className={`block text-xs mt-1.5 ${accent ? "text-primary-dark/80" : "text-steel"}`}>{detail}</span> : null}
    </Link>
  );
}
