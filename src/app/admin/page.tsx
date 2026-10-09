import Link from "next/link";
import { MessageCircle, ExternalLink, CloudRain, CheckCircle2, Inbox, Users, Mail, CalendarDays, AlertTriangle } from "lucide-react";
import { isAdmin } from "@/lib/auth";
import { readSheet, type Row } from "@/lib/sheets";
import { getMatches, bogotaToday, dateParts, time12 } from "@/lib/matches";
import { getCourtNotices } from "@/lib/court";
import { siteUrl } from "@/lib/site-url";
import AdminLogin from "./AdminLogin";
import { GroupMessage, LogoutButton } from "./AdminTools";

export const dynamic = "force-dynamic";

const daysAgo = (n: number) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bogota" }).format(new Date(Date.now() - n * 86_400_000));

function waLink(raw: string, text: string) {
  const d = (raw || "").replace(/\D/g, "");
  const num = d.length === 10 && d.startsWith("3") ? `57${d}` : d.length === 12 && d.startsWith("57") ? d : "";
  return num ? `https://wa.me/${num}?text=${encodeURIComponent(text)}` : null;
}

const statusChip = (estado: string) => {
  const e = (estado || "").toLowerCase();
  if (e === "nuevo") return "bg-[#F29A2E] text-[#071426]";
  if (e.startsWith("contact")) return "bg-[#3B82F6]/20 text-[#93C5FD]";
  if (e.startsWith("matric")) return "bg-[#25D366]/20 text-[#6EE7A0]";
  return "bg-white/10 text-[#C9D5E6]";
};

export default async function AdminPage() {
  if (!(await isAdmin())) return <AdminLogin />;

  const [regsRaw, msgsRaw, matches, notices] = await Promise.all([
    readSheet("Inscripciones", 0),
    readSheet("Contacto", 0),
    getMatches(),
    getCourtNotices(),
  ]);
  const privateOk = regsRaw !== null;
  const regs: Row[] = (regsRaw ?? []).slice().reverse();
  const msgs: Row[] = (msgsRaw ?? []).slice().reverse();
  const weekAgo = daysAgo(7);
  const pending = regs.filter((r) => (r["Estado"] || "").toLowerCase() === "nuevo");
  const regsWeek = regs.filter((r) => (r["Fecha"] || "").slice(0, 10) >= weekAgo);
  const msgsWeek = msgs.filter((r) => (r["Fecha"] || "").slice(0, 10) >= weekAgo);
  const nextMatch = (matches ?? []).find((m) => !m.finished && m.date >= bogotaToday());
  const sheetUrl = process.env.SHEET_URL;

  return (
    <div className="bg-[#071426] text-white min-h-screen pt-36 sm:pt-40 pb-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-[#F29A2E] font-semibold">Panel del club</p>
            <h1 className="font-heading font-black uppercase text-5xl sm:text-6xl leading-none mt-1">Hoy en el club</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            {sheetUrl ? (
              <a href={sheetUrl} target="_blank" rel="noopener noreferrer" className="h-11 px-4 inline-flex items-center gap-2 rounded-md bg-[#F29A2E] hover:bg-[#FFB14A] text-[#071426] font-bold">
                <ExternalLink size={18} /> Abrir la hoja
              </a>
            ) : null}
            <LogoutButton />
          </div>
        </div>

        {!privateOk && (
          <div className="mb-8 rounded-xl border border-[#F29A2E]/40 bg-[#F29A2E]/10 p-5 flex gap-3">
            <AlertTriangle className="text-[#F29A2E] shrink-0" />
            <p className="text-[#E6EDF7]">
              Para ver aquí las inscripciones y los mensajes, publica la versión nueva del Apps Script
              (Implementar → Administrar implementaciones → lápiz → Nueva versión).
            </p>
          </div>
        )}

        {/* Resumen */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
          <Stat icon={<Inbox size={20} />} label="Inscripciones sin atender" value={privateOk ? pending.length : "—"} accent={pending.length > 0} />
          <Stat icon={<Users size={20} />} label="Inscripciones en 7 días" value={privateOk ? regsWeek.length : "—"} />
          <Stat icon={<Mail size={20} />} label="Mensajes en 7 días" value={privateOk ? msgsWeek.length : "—"} />
          <Stat
            icon={<CalendarDays size={20} />}
            label="Próximo partido"
            value={nextMatch ? `${dateParts(nextMatch.date).day} ${dateParts(nextMatch.date).month}` : "—"}
            detail={nextMatch ? `${nextMatch.category} · ${time12(nextMatch.time)}` : "Agrega partidos en Fixture"}
          />
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-10">
            <section>
              <h2 className="font-heading font-black uppercase text-3xl mb-4">Inscripciones recientes</h2>
              {regs.length === 0 ? (
                <p className="rounded-xl border border-dashed border-white/15 p-6 text-[#B7C4D8]">{privateOk ? "Todavía no hay inscripciones." : "Disponible cuando actualices el Apps Script."}</p>
              ) : (
                <ul className="space-y-3">
                  {regs.slice(0, 15).map((r, i) => {
                    const wa = waLink(r["WhatsApp"], `Hola, te escribimos del Club Voley Zúñiga sobre la inscripción de ${r["Nombre"]}${r["Código"] ? ` (código ${r["Código"]})` : ""}. ¿Cuándo podemos agendar la clase de prueba?`);
                    return (
                      <li key={i} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-heading font-extrabold text-2xl leading-tight">{r["Nombre"]}</p>
                            <span className={`h-6 px-2.5 inline-flex items-center rounded-full text-xs font-bold ${statusChip(r["Estado"])}`}>{r["Estado"] || "Sin estado"}</span>
                            {r["Código"] ? <span className="text-xs font-semibold text-[#8FA3BF] tracking-wide">{r["Código"]}</span> : null}
                          </div>
                          <p className="text-sm text-[#B7C4D8] mt-1">
                            {r["Edad"]} años · {r["Categoría"]} · {r["Nivel"]}
                          </p>
                          <p className="text-xs text-[#8FA3BF] mt-0.5">{r["Fecha"]} · {r["Horario"]}</p>
                        </div>
                        {wa ? (
                          <a href={wa} target="_blank" rel="noopener noreferrer" className="shrink-0 h-11 px-4 inline-flex items-center gap-2 rounded-md bg-[#25D366] text-[#071426] font-bold">
                            <MessageCircle size={18} /> Escribir
                          </a>
                        ) : (
                          <span className="text-sm text-[#8FA3BF]">{r["WhatsApp"]}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
              <p className="mt-3 text-sm text-[#8FA3BF]">Cuando le escribas, cambia el Estado en la hoja a “Contactado” y luego a “Matriculado”.</p>
            </section>

            <section>
              <h2 className="font-heading font-black uppercase text-3xl mb-4">Mensajes de contacto</h2>
              {msgs.length === 0 ? (
                <p className="rounded-xl border border-dashed border-white/15 p-6 text-[#B7C4D8]">{privateOk ? "No hay mensajes." : "Disponible cuando actualices el Apps Script."}</p>
              ) : (
                <ul className="space-y-3">
                  {msgs.slice(0, 8).map((m, i) => (
                    <li key={i} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold">{m["Nombre"]}</p>
                        <span className="h-6 px-2.5 inline-flex items-center rounded-full bg-white/10 text-xs font-semibold">{m["Asunto"]}</span>
                        <span className="text-xs text-[#8FA3BF]">{m["Fecha"]}</span>
                      </div>
                      <p className="text-[#C9D5E6] mt-2 whitespace-pre-line line-clamp-4">{m["Mensaje"]}</p>
                      <p className="text-sm text-[#8FA3BF] mt-2">{m["Contacto"]}</p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <aside className="lg:col-span-4 space-y-6">
            <section className="rounded-2xl border border-white/10 bg-[#0B1E38] p-6">
              <h2 className="font-heading font-black uppercase text-2xl">Estado de canchas</h2>
              {notices.length === 0 ? (
                <p className="mt-3 flex items-center gap-2 text-[#6EE7A0]"><CheckCircle2 size={18} /> Todo normal. No se muestra aviso.</p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {notices.map((n, i) => (
                    <li key={i} className="flex gap-2 text-[#FFD9A8]"><CloudRain size={18} className="shrink-0 mt-0.5" /> <span><strong>{n.estado}</strong>{n.sede ? ` · ${n.sede}` : ""}: {n.mensaje}</span></li>
                  ))}
                </ul>
              )}
              <p className="mt-4 text-sm text-[#B7C4D8]">
                Para cambiarlo, edita la pestaña <strong>Cancha</strong> de la hoja: Estado “Normal”, “Lluvia”, “Cancelado” o “Cambio de sede”, con un mensaje. La web se actualiza en unos 2 minutos.
              </p>
            </section>

            <section className="rounded-2xl border border-white/10 bg-[#0B1E38] p-6">
              <h2 className="font-heading font-black uppercase text-2xl mb-1">Mensaje al grupo</h2>
              <p className="text-sm text-[#B7C4D8] mb-4">Escribe el aviso y elige el grupo de familias al abrir WhatsApp.</p>
              <GroupMessage gamesUrl={`${siteUrl}/partidos`} />
            </section>

            <section className="rounded-2xl border border-white/10 bg-[#0B1E38] p-6">
              <h2 className="font-heading font-black uppercase text-2xl mb-3">Ver la web</h2>
              <ul className="grid grid-cols-2 gap-2 text-sm">
                {[
                  ["Partidos", "/partidos"],
                  ["Posiciones", "/posiciones"],
                  ["Noticias", "/noticias"],
                  ["Inscripción", "/inscripciones"],
                ].map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} className="h-10 px-3 flex items-center rounded-md border border-white/10 hover:border-white/40">{label}</Link>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value, detail, accent = false }: { icon: React.ReactNode; label: string; value: string | number; detail?: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl p-5 border ${accent ? "bg-[#F29A2E] border-[#F29A2E] text-[#071426]" : "bg-white/[0.04] border-white/10"}`}>
      <div className={`flex items-center gap-2 text-sm ${accent ? "text-[#071426]/80" : "text-[#8FA3BF]"}`}>{icon}{label}</div>
      <p className="font-heading font-black text-4xl sm:text-5xl leading-none mt-2 tabular-nums">{value}</p>
      {detail ? <p className={`text-xs mt-1 ${accent ? "text-[#071426]/80" : "text-[#8FA3BF]"}`}>{detail}</p> : null}
    </div>
  );
}
