import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Camera } from "lucide-react";
import PageHero from "@/components/PageHero";
import CategoryFilter from "@/components/CategoryFilter";
import TeamBadge from "@/components/TeamBadge";
import { getSettings } from "@/lib/content";
import { CATEGORIES } from "@/data/registration";
import { getStandings, type StandingRow } from "@/lib/matches";

export const metadata: Metadata = {
  title: "Posiciones",
  description: "Tabla de posiciones de los equipos del Club Voley Zúñiga por categoría.",
};

export const revalidate = 300;

const order = (a: StandingRow, b: StandingRow) => b.points - a.points || b.won - a.won || a.lost - b.lost || a.team.localeCompare(b.team);

export default async function StandingsPage({ searchParams }: { searchParams: Promise<{ cat?: string }> }) {
  const { cat } = await searchParams;
  const [rowsRaw, { contact }] = await Promise.all([getStandings(), getSettings()]);
  const rows = rowsRaw ?? [];

  // Solo categorías con datos, en el orden oficial del club.
  const known = CATEGORIES.map((c) => c.value);
  const withData = Array.from(new Set(rows.map((r) => r.category))).sort(
    (a, b) => (known.indexOf(a) + 1 || 99) - (known.indexOf(b) + 1 || 99)
  );
  const active = cat && withData.includes(cat) ? cat : (withData[0] ?? null);
  const table = rows.filter((r) => r.category === active).sort(order);
  const club = table.find((r) => r.isClub);
  const clubPos = club ? table.indexOf(club) + 1 : null;
  const leaderPts = table[0]?.points ?? 0;

  return (
    <>
      <PageHero
        kicker="Temporada 2026"
        title="Posiciones"
        intro="Cómo van nuestros equipos en cada categoría. La tabla se actualiza después de cada fecha."
      >
        <Link
          href="/games"
          className="h-12 px-6 inline-flex items-center gap-2 border border-white/25 hover:border-white hover:bg-white/5 font-semibold rounded-md transition-colors"
        >
          Ver partidos <ArrowRight size={18} />
        </Link>
      </PageHero>

      <section className="bg-[#071426] text-white pb-24 sm:pb-32">
        <div className="container mx-auto px-4 sm:px-6">
          {withData.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0F2347] to-[#071426] p-8 sm:p-12 grid md:grid-cols-[1fr_auto] gap-8 items-center">
              <div>
                <h2 className="font-heading font-black uppercase text-4xl sm:text-5xl leading-none">La tabla arranca con el torneo</h2>
                <p className="mt-4 text-[#C9D5E6] text-lg max-w-xl">
                  Apenas se juegue la primera fecha publicaremos aquí la tabla de cada categoría, con nuestro equipo resaltado.
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
          ) : (
            <>
              <div className="py-6">
                <CategoryFilter basePath="/standings" categories={withData} active={active} showAll={false} />
              </div>

              {club && clubPos && (
                <div className="mb-8 grid sm:grid-cols-3 gap-3">
                  <Stat label="Posición" value={`${clubPos}º`} accent />
                  <Stat label="Puntos" value={String(club.points)} />
                  <Stat label="Ganados / perdidos" value={`${club.won} – ${club.lost}`} />
                </div>
              )}

              <div className="rounded-2xl border border-white/10 overflow-hidden">
                <table className="w-full text-left">
                  <caption className="sr-only">Tabla de posiciones, {active}</caption>
                  <thead className="bg-[#0F2347] text-xs text-[#8FA3BF]">
                    <tr>
                      <th scope="col" className="py-3 pl-4 sm:pl-6 w-12 font-semibold">#</th>
                      <th scope="col" className="py-3 font-semibold">Equipo</th>
                      <th scope="col" className="py-3 text-center font-semibold w-12" title="Partidos jugados">PJ</th>
                      <th scope="col" className="py-3 text-center font-semibold w-12" title="Partidos ganados">PG</th>
                      <th scope="col" className="py-3 text-center font-semibold w-12" title="Partidos perdidos">PP</th>
                      <th scope="col" className="py-3 pr-4 sm:pr-6 text-right font-semibold w-20">Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.map((r, i) => (
                      <tr
                        key={r.team}
                        className={`border-t border-white/10 ${r.isClub ? "bg-[#F29A2E]/[0.09]" : i % 2 ? "bg-white/[0.02]" : ""}`}
                      >
                        <td className="py-4 pl-4 sm:pl-6 relative">
                          {r.isClub && <span className="absolute left-0 inset-y-0 w-1 bg-[#F29A2E]" aria-hidden="true" />}
                          <span className={`font-heading font-black text-2xl tabular-nums ${i < 3 ? "text-[#F29A2E]" : "text-[#8FA3BF]"}`}>{i + 1}</span>
                        </td>
                        <td className="py-4 pr-2">
                          <div className="flex items-center gap-3 min-w-0">
                            <TeamBadge name={r.team} isClub={r.isClub} size="sm" />
                            <div className="min-w-0 flex-1">
                              <p className={`font-semibold truncate ${r.isClub ? "text-white" : "text-[#C9D5E6]"}`}>{r.team}</p>
                              <div className="mt-1.5 h-1 rounded-full bg-white/10 overflow-hidden max-w-[220px]" aria-hidden="true">
                                <div
                                  className={`h-full rounded-full ${r.isClub ? "bg-[#F29A2E]" : "bg-[#8FA3BF]/60"}`}
                                  style={{ width: `${leaderPts ? Math.max(4, (r.points / leaderPts) * 100) : 4}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-center tabular-nums text-[#C9D5E6]">{r.played}</td>
                        <td className="py-4 text-center tabular-nums text-[#C9D5E6]">{r.won}</td>
                        <td className="py-4 text-center tabular-nums text-[#C9D5E6]">{r.lost}</td>
                        <td className="py-4 pr-4 sm:pr-6 text-right font-heading font-black text-2xl tabular-nums">{r.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-sm text-[#8FA3BF]">PJ: jugados · PG: ganados · PP: perdidos · Pts: puntos.</p>
            </>
          )}
        </div>
      </section>
    </>
  );
}

function Stat({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl p-5 border ${accent ? "bg-[#F29A2E] border-[#F29A2E] text-[#071426]" : "bg-white/[0.04] border-white/10"}`}>
      <p className={`text-sm ${accent ? "text-[#071426]/75" : "text-[#8FA3BF]"}`}>Voley Zúñiga · {label}</p>
      <p className="font-heading font-black text-5xl leading-none mt-1 tabular-nums">{value}</p>
    </div>
  );
}
