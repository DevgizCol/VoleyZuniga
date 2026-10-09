// Utilidades de formato para el panel (fechas de la hoja pueden venir como AAAA-MM-DD o DD/MM/AAAA).

const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const DAYS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];

export function isoDate(raw: string): string {
  const s = (raw || "").trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  return m ? `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}` : "";
}

export function hhmm(raw: string): string {
  const m = (raw || "").trim().match(/^(\d{1,2}):(\d{2})/);
  return m ? `${m[1].padStart(2, "0")}:${m[2]}` : "";
}

export function shortDate(raw: string) {
  const iso = isoDate(raw);
  if (!iso) return raw || "—";
  const [y, m, d] = iso.split("-").map(Number);
  const wd = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return `${DAYS[wd]} ${d} ${MONTHS[m - 1]}`;
}

export function dayMonth(raw: string) {
  const iso = isoDate(raw);
  if (!iso) return { day: "—", month: "" };
  const [, m, d] = iso.split("-").map(Number);
  return { day: String(d), month: MONTHS[m - 1] };
}

export const bogotaToday = () => new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bogota" }).format(new Date());

export const daysAgo = (n: number) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bogota" }).format(new Date(Date.now() - n * 86_400_000));

export function waLink(raw: string, text: string) {
  const d = (raw || "").replace(/\D/g, "");
  const num = d.length === 10 && d.startsWith("3") ? `57${d}` : d.length === 12 && d.startsWith("57") ? d : "";
  return num ? `https://wa.me/${num}?text=${encodeURIComponent(text)}` : null;
}

/** Normaliza una fila de la hoja a los formatos que usan los campos del formulario (fecha y hora). */
export function forForm<T extends Record<string, string>>(row: T): T {
  const out: Record<string, string> = { ...row };
  if ("Fecha" in out) out.Fecha = isoDate(out.Fecha) || out.Fecha;
  for (const k of ["Hora", "Inicio", "Fin"]) if (k in out && out[k]) out[k] = hhmm(out[k]) || out[k];
  return out as T;
}
