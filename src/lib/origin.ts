// Origen de la visita (de dónde llegó la familia): se guarda en el navegador la primera vez
// y viaja con la inscripción o el mensaje para que la hoja diga qué canal trae gente.
// Sin cookies ni servicios externos: solo los parámetros utm_ del enlace o el sitio que los trajo.

export type Origin = {
  source: string; // instagram, afiche, google, whatsapp, directo…
  medium?: string; // bio, post, qr, estado…
  campaign?: string;
  landing: string; // primera página que vieron
};

const KEY = "vz_origin";
const MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000;

// Dominios conocidos → nombre del canal.
const REFERRERS: [RegExp, string][] = [
  [/(^|\.)instagram\.com$/, "instagram"],
  [/(^|\.)(facebook\.com|fb\.com|fb\.me)$/, "facebook"],
  [/(^|\.)(whatsapp\.com|wa\.me)$/, "whatsapp"],
  [/(^|\.)tiktok\.com$/, "tiktok"],
  [/(^|\.)(t\.co|twitter\.com|x\.com)$/, "x"],
  [/(^|\.)youtube\.com$/, "youtube"],
  [/(^|\.)google\.[a-z.]+$/, "google"],
  [/(^|\.)bing\.com$/, "bing"],
];

const clean = (v: string | null | undefined, max = 40) =>
  (v ?? "").toLowerCase().replace(/[^\p{L}\p{N}._-]+/gu, "-").replace(/^-+|-+$/g, "").slice(0, max);

/** Calcula el origen a partir de la dirección actual y el sitio anterior. Devuelve null si es navegación interna. */
export function parseOrigin(href: string, referrer: string): Origin | null {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return null;
  }
  const landing = url.pathname.slice(0, 80) || "/";
  const p = url.searchParams;
  const source = clean(p.get("utm_source"));
  if (source) {
    return { source, medium: clean(p.get("utm_medium")) || undefined, campaign: clean(p.get("utm_campaign"), 60) || undefined, landing };
  }
  let refHost = "";
  try {
    refHost = referrer ? new URL(referrer).hostname.replace(/^www\./, "") : "";
  } catch {
    refHost = "";
  }
  if (refHost && refHost === url.hostname.replace(/^www\./, "")) return null; // otra página del mismo sitio
  if (!refHost) return { source: "directo", landing };
  const known = REFERRERS.find(([re]) => re.test(refHost));
  return { source: known ? known[1] : clean(refHost), medium: "referido", landing };
}

/** Texto para la columna Origen de la hoja, p. ej. "instagram / bio / convocatoria-2027 · entrada: /inscripciones". */
export function formatOrigin(o: Origin | null): string {
  if (!o) return "";
  const parts = [o.source, o.medium, o.campaign].filter(Boolean).join(" / ");
  return `${parts} · entrada: ${o.landing}`;
}

/** Guarda el origen de la primera visita (se renueva si llega con una campaña nueva o pasaron 90 días). */
export function captureOrigin(): void {
  try {
    const found = parseOrigin(window.location.href, document.referrer);
    if (!found) return;
    const saved = JSON.parse(localStorage.getItem(KEY) || "null") as (Origin & { at: number }) | null;
    const fresh = !saved || Date.now() - saved.at > MAX_AGE_MS;
    const isCampaign = new URL(window.location.href).searchParams.has("utm_source");
    if (fresh || isCampaign) localStorage.setItem(KEY, JSON.stringify({ ...found, at: Date.now() }));
  } catch {
    // Sin almacenamiento (modo privado): simplemente no se guarda.
  }
}

/** Origen guardado, listo para enviar con un formulario. */
export function storedOrigin(): string {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || "null") as Origin | null;
    return formatOrigin(saved);
  } catch {
    return "";
  }
}

/** Limpia el texto de origen que llega al servidor. */
export function sanitizeOrigin(v: unknown): string {
  return typeof v === "string" ? v.replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s{2,}/g, " ").trim().slice(0, 200) : "";
}
