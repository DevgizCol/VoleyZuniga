import "server-only";
import { readSheet } from "./sheets";
import { SITE } from "@/config/site";
import { imageUrl, normDate, normTime } from "./sheet-values";

// Partidos y tabla de posiciones leídos de la hoja (pestañas "Fixture" y "Tabla").

export type Match = {
  id: string;
  date: string; // AAAA-MM-DD
  time: string; // HH:MM (24 h) o vacío
  category: string;
  home: string;
  away: string;
  venue: string;
  status: string;
  result: string; // "3-1" desde el punto de vista del local
  finished: boolean;
  clubIsHome: boolean;
  clubPlays: boolean;
  outcome: "win" | "loss" | null;
  /** Escudo del rival (columna opcional "Escudo rival (URL)" de Fixture). */
  rivalLogo: string;
};

export type StandingRow = {
  category: string;
  team: string;
  played: number;
  won: number;
  lost: number;
  points: number;
  isClub: boolean;
};

const CLUB_RE = /z[uú][ñn]iga/i;

export const bogotaToday = () => new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bogota" }).format(new Date());

function parseResult(result: string): [number, number] | null {
  const m = result.match(/(\d+)\s*[-–:]\s*(\d+)/);
  return m ? [Number(m[1]), Number(m[2])] : null;
}

export async function getMatches(): Promise<Match[] | null> {
  const rows = await readSheet("Fixture");
  if (!rows) return null;
  return rows
    .map((r, i): Match | null => {
      const date = normDate(r["Fecha"]);
      if (!date || !r["Local"] || !r["Visitante"]) return null;
      const result = (r["Resultado"] || "").trim();
      const status = (r["Estado"] || "").trim();
      const score = parseResult(result);
      const finished = Boolean(score) || /final|jugado/i.test(status);
      const clubIsHome = CLUB_RE.test(r["Local"]);
      const clubPlays = clubIsHome || CLUB_RE.test(r["Visitante"]);
      let outcome: Match["outcome"] = null;
      if (score && clubPlays && score[0] !== score[1]) {
        const homeWon = score[0] > score[1];
        outcome = homeWon === clubIsHome ? "win" : "loss";
      }
      return {
        id: `${date}-${i}`,
        date,
        time: normTime(r["Hora"]),
        category: (r["Categoría"] || "").trim(),
        home: r["Local"].trim(),
        away: r["Visitante"].trim(),
        venue: (r["Sede"] || "").trim(),
        status,
        result,
        finished,
        clubIsHome,
        clubPlays,
        outcome,
        rivalLogo: imageUrl(r["Escudo rival (URL)"] || "", 300),
      };
    })
    .filter((m): m is Match => m !== null)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
}

const num = (v: string) => {
  const n = Number(String(v ?? "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
};

export async function getStandings(): Promise<StandingRow[] | null> {
  const rows = await readSheet("Tabla");
  if (!rows) return null;
  return rows
    .filter((r) => r["Equipo"] && r["Categoría"])
    .map((r) => ({
      category: r["Categoría"].trim(),
      team: r["Equipo"].trim(),
      played: num(r["PJ"]),
      won: num(r["PG"]),
      lost: num(r["PP"]),
      points: num(r["Puntos"]),
      isClub: CLUB_RE.test(r["Equipo"]),
    }));
}

// ---------- Formato ----------

const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const MONTHS_LONG = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const WEEKDAYS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

export function dateParts(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const wd = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return { day: d, month: MONTHS[m - 1], monthLong: MONTHS_LONG[m - 1], year: y, weekday: WEEKDAYS[wd] };
}

const utcDay = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
};

export function daysUntil(iso: string, today = bogotaToday()) {
  return Math.round((utcDay(iso) - utcDay(today)) / 86_400_000);
}

export function countdownLabel(iso: string) {
  const d = daysUntil(iso);
  if (d === 0) return "Hoy";
  if (d === 1) return "Mañana";
  return `En ${d} días`;
}

export function time12(hhmm: string) {
  if (!hhmm) return "Hora por confirmar";
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, "0")} ${suffix}`;
}

// Enlace para agregar el partido a Google Calendar (2 horas de duración por defecto).
export function calendarUrl(m: Match) {
  const start = `${m.date.replace(/-/g, "")}T${(m.time || "08:00").replace(":", "")}00`;
  const [h, min] = (m.time || "08:00").split(":").map(Number);
  const endH = String(Math.min(h + 2, 23)).padStart(2, "0");
  const end = `${m.date.replace(/-/g, "")}T${endH}${String(min).padStart(2, "0")}00`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${m.home} vs ${m.away} · ${m.category}`,
    dates: `${start}/${end}`,
    ctz: "America/Bogota",
    location: m.venue,
    details: `Partido de ${SITE.name}.`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

