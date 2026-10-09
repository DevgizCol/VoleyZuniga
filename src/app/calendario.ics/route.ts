import { getMatches } from "@/lib/matches";
import { siteUrl } from "@/lib/site-url";

// Calendario de partidos en formato iCalendar. Las familias se suscriben una vez y
// cada partido nuevo de la pestaña "Fixture" les aparece solo en el celular.
export const revalidate = 1800;

const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

// Las líneas de más de 75 octetos se parten según el estándar (RFC 5545).
function fold(line: string) {
  const bytes = new TextEncoder().encode(line);
  if (bytes.length <= 75) return line;
  const out: string[] = [];
  let cur = "";
  let len = 0;
  for (const ch of line) {
    const n = new TextEncoder().encode(ch).length;
    if (len + n > (out.length ? 74 : 75)) {
      out.push(cur);
      cur = "";
      len = 0;
    }
    cur += ch;
    len += n;
  }
  out.push(cur);
  return out.join("\r\n ");
}

const stamp = () => new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

export async function GET() {
  const matches = (await getMatches()) ?? [];
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Club Voley Zuniga//Partidos//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Voley Zúñiga · Partidos",
    "X-WR-TIMEZONE:America/Bogota",
    "REFRESH-INTERVAL;VALUE=DURATION:PT6H",
    "X-PUBLISHED-TTL:PT6H",
    // Colombia no tiene horario de verano: UTC-5 todo el año.
    "BEGIN:VTIMEZONE",
    "TZID:America/Bogota",
    "BEGIN:STANDARD",
    "DTSTART:19700101T000000",
    "TZOFFSETFROM:-0500",
    "TZOFFSETTO:-0500",
    "TZNAME:-05",
    "END:STANDARD",
    "END:VTIMEZONE",
  ];

  for (const m of matches) {
    const day = m.date.replace(/-/g, "");
    const title = `${m.home} vs ${m.away} · ${m.category}${m.result ? ` (${m.result.match(/^\s*\d+\s*[-–:]\s*\d+/)?.[0]?.trim() ?? m.result})` : ""}`;
    // UID estable: no cambia si se reordenan las filas de la hoja.
    const uid = `${day}-${m.category}-${m.home}-${m.away}`.normalize("NFD").replace(/[^\w-]+/g, "").toLowerCase();
    lines.push("BEGIN:VEVENT", `UID:${uid}@voleyzuniga`, `DTSTAMP:${stamp()}`);
    if (m.time) {
      const [h, min] = m.time.split(":").map(Number);
      const endH = Math.min(h + 2, 23);
      lines.push(`DTSTART;TZID=America/Bogota:${day}T${m.time.replace(":", "")}00`);
      lines.push(`DTEND;TZID=America/Bogota:${day}T${String(endH).padStart(2, "0")}${String(min).padStart(2, "0")}00`);
    } else {
      lines.push(`DTSTART;VALUE=DATE:${day}`);
    }
    lines.push(
      `SUMMARY:${esc(title)}`,
      ...(m.venue ? [`LOCATION:${esc(m.venue + ", Medellín")}`] : []),
      `DESCRIPTION:${esc(`Partido del Club Voley Zúñiga.${m.time ? "" : " Hora por confirmar."}\nMás información: ${siteUrl}/partidos`)}`,
      `URL:${siteUrl}/partidos`,
      "END:VEVENT"
    );
  }
  lines.push("END:VCALENDAR");

  return new Response(lines.map(fold).join("\r\n") + "\r\n", {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="voley-zuniga-partidos.ics"',
    },
  });
}
