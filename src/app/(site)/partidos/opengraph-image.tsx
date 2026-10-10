import { brandCard, OG_SIZE } from "@/lib/og";
import { SITE } from "@/config/site";
import { bogotaToday, daysUntil, getMatches, time12 } from "@/lib/matches";
import { longDate } from "@/lib/news";

// Imagen al compartir /partidos: el resultado de los últimos 3 días o, si no hay, el próximo partido.
export const alt = "Partidos del Club Voley Zúñiga";
export const size = OG_SIZE;
export const contentType = "image/png";
export const revalidate = 300;

const CLUB_RE = /z[uú][ñn]iga/i;
const team = (name: string) => ({ name, isClub: CLUB_RE.test(name) });

export default async function MatchesImage() {
  const all = ((await getMatches()) ?? []).filter((m) => m.clubPlays);
  const today = bogotaToday();
  const recent = all.filter((m) => m.finished && m.result && daysUntil(m.date, today) >= -3).at(-1);
  if (recent) {
    return brandCard({
      kicker: `Resultado · ${recent.category}`,
      title: `${recent.outcome === "win" ? "¡Victoria! " : ""}${longDate(recent.date)}${recent.venue ? ` · ${recent.venue}` : ""}`,
      match: { home: team(recent.home), away: team(recent.away), center: recent.result.replace(/\s*[-–:]\s*/, " – ") },
    });
  }
  const next = all.find((m) => !m.finished && m.date >= today);
  if (next) {
    const [, month, day] = next.date.split("-");
    const months = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
    return brandCard({
      kicker: `Próximo partido · ${next.category}`,
      title: [longDate(next.date), next.time ? time12(next.time) : "", next.venue].filter(Boolean).join(" · "),
      match: { home: team(next.home), away: team(next.away), center: String(Number(day)), centerSmall: `${months[Number(month) - 1]} · VS` },
    });
  }
  return brandCard({ kicker: "Partidos", title: "Calendario y resultados", subtitle: `${SITE.name} · ${SITE.city}` });
}
