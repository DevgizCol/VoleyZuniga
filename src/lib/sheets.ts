import "server-only";

// Cliente del backend gratuito: una aplicación web de Google Apps Script
// (docs/google-sheets/Code.gs) que lee y escribe en una Hoja de cálculo de Google.
//
// Variables de entorno (Vercel):
//   SHEETS_WEBAPP_URL  URL de la implementación, termina en /exec
//   SHEETS_SECRET      mismo valor que SHARED_SECRET en las propiedades del script (clave principal)
//   SHEETS_READ_SECRET (recomendada) mismo valor que READ_SECRET: solo lee las pestañas públicas.
//                      Es la única clave que viaja en la dirección de las consultas; la principal va
//                      siempre dentro del cuerpo de la petición.

export type WritableSheet = "Inscripciones" | "Contacto";
export type ReadableSheet =
  | "Fixture" | "Tabla" | "Noticias" | "Cancha" | "Horarios" | "Productos" | "Ajustes"
  | "Galería" | "Entrenadores" | "Testimonios" | "Plantel";
// Solo para el panel de administración (contienen datos personales; nunca se cachean).
export type PrivateSheet = "Inscripciones" | "Contacto";
export type Row = Record<string, string>;

/** Etiqueta de caché de cada pestaña: el panel la invalida al guardar para que la web cambie al instante. */
export const sheetTag = (sheet: string) => `sheet:${sheet}`;

export function sheetsConfigured(): boolean {
  return Boolean(process.env.SHEETS_WEBAPP_URL && process.env.SHEETS_SECRET);
}

const TIMEOUT_MS = 15000;
const PRIVATE_SHEETS = new Set<string>(["Inscripciones", "Contacto", "Historial"]);

/** Clave para leer pestañas públicas: la de solo lectura si existe, si no la principal. */
const readSecret = () => process.env.SHEETS_READ_SECRET || process.env.SHEETS_SECRET;

// Códigos con los que un Apps Script anterior (sin lectura por POST) rechaza la petición.
const OLD_SCRIPT = new Set(["sheet_not_allowed", "bad_action"]);

/**
 * Lee por POST (la clave principal no queda en la dirección). Si el Apps Script publicado todavía es
 * la versión anterior, devuelve "old_script" para que se use la lectura de antes.
 */
async function postRead(url: string, secret: string, sheet: string, all: boolean): Promise<{ ok?: boolean; error?: string; headers?: string[]; rows?: Row[] } | "old_script" | null> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    // "admin.read": un Apps Script anterior lo rechaza (bad_action) en vez de tratarlo como un formulario.
    body: JSON.stringify({ secret, action: "admin.read", sheet, all }),
    redirect: "follow",
    cache: "no-store",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) return null;
  const json = (await res.json()) as { ok?: boolean; error?: string; headers?: string[]; rows?: Row[] };
  if (!json.ok && json.error && OLD_SCRIPT.has(json.error)) return "old_script";
  return json;
}

const getUrl = (url: string, sheet: string, secret: string, all: boolean) =>
  `${url}?sheet=${encodeURIComponent(sheet)}${all ? "&all=1" : ""}&secret=${encodeURIComponent(secret)}`;

/** Agrega una fila a Inscripciones o Contacto. Devuelve false si no se pudo guardar. */
export async function appendToSheet(sheet: WritableSheet, data: Row): Promise<boolean> {
  const url = process.env.SHEETS_WEBAPP_URL;
  const secret = process.env.SHEETS_SECRET;
  if (!url || !secret) return false;

  try {
    const res = await fetch(url, {
      method: "POST",
      // text/plain evita el preflight; Apps Script lee el cuerpo igual.
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ secret, sheet, data }),
      redirect: "follow",
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) return false;
    const json = (await res.json()) as { ok?: boolean };
    return json.ok === true;
  } catch (err) {
    console.error("[sheets] append falló:", err instanceof Error ? err.message : err);
    return false;
  }
}

/**
 * Lee las filas activas de una pestaña pública (Fixture, Tabla, Noticias, Cancha, Galería…).
 * Se cachea en Next (revalidate) para que los visitantes no esperen a Google.
 * Devuelve null si no está configurado o falla, para que la página use un respaldo.
 */
export async function readSheet(sheet: ReadableSheet | PrivateSheet, revalidateSeconds = 300): Promise<Row[] | null> {
  const url = process.env.SHEETS_WEBAPP_URL;
  const secret = process.env.SHEETS_SECRET;
  if (!url || !secret) return null;

  try {
    // Datos personales: por POST con la clave principal y sin caché.
    if (PRIVATE_SHEETS.has(sheet)) {
      const json = await postRead(url, secret, sheet, false);
      if (json !== "old_script") return json?.ok && Array.isArray(json.rows) ? json.rows : null;
    }
    // Apps Script no permite leer cabeceras personalizadas, por eso la clave de lectura va en la consulta
    // (servidor a servidor, sobre HTTPS; nunca llega al navegador). Las lecturas por GET se pueden cachear.
    const target = getUrl(url, sheet, PRIVATE_SHEETS.has(sheet) ? secret : readSecret()!, false);
    const res = await fetch(target, {
      redirect: "follow",
      ...(revalidateSeconds > 0
        ? { next: { revalidate: revalidateSeconds, tags: [sheetTag(sheet)] } }
        : { cache: "no-store" as const }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { ok?: boolean; rows?: Row[] };
    return json.ok && Array.isArray(json.rows) ? json.rows : null;
  } catch (err) {
    console.error(`[sheets] lectura de ${sheet} falló:`, err instanceof Error ? err.message : err);
    return null;
  }
}

// ---------- Panel de administración ----------

export type AdminSheet = "Fixture" | "Tabla" | "Noticias" | "Cancha" | "Horarios" | "Productos" | "Ajustes" | "Inscripciones" | "Contacto" | "Historial";
export type AdminRow = Row & { _row: string };
export type AdminTable = { headers: string[]; rows: AdminRow[] };

/** Lee todas las filas (también las inactivas) con su número de fila. Nunca se cachea. */
export async function adminRead(sheet: AdminSheet): Promise<AdminTable | null> {
  const url = process.env.SHEETS_WEBAPP_URL;
  const secret = process.env.SHEETS_SECRET;
  if (!url || !secret) return null;
  try {
    let json = await postRead(url, secret, sheet, true);
    if (json === "old_script") {
      const res = await fetch(getUrl(url, sheet, secret, true), { redirect: "follow", cache: "no-store", signal: AbortSignal.timeout(TIMEOUT_MS) });
      json = res.ok ? ((await res.json()) as { ok?: boolean; headers?: string[]; rows?: Row[] }) : null;
    }
    return json?.ok && Array.isArray(json.rows) ? { headers: json.headers ?? [], rows: json.rows as AdminRow[] } : null;
  } catch (err) {
    console.error(`[sheets] lectura admin de ${sheet} falló:`, err instanceof Error ? err.message : err);
    return null;
  }
}

export type MutationResult = { ok: true; row?: number } | { ok: false; error: string };

/** Crea, edita o borra una fila desde el panel. */
export async function adminMutate(payload: {
  action: "create" | "update" | "remove";
  sheet: AdminSheet;
  actor: string;
  row?: number;
  expected?: Row;
  data?: Row;
}): Promise<MutationResult> {
  const url = process.env.SHEETS_WEBAPP_URL;
  const secret = process.env.SHEETS_SECRET;
  if (!url || !secret) return { ok: false, error: "not_configured" };
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ ...payload, action: `admin.${payload.action}`, secret }),
      redirect: "follow",
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) return { ok: false, error: `http_${res.status}` };
    const json = (await res.json()) as { ok?: boolean; error?: string; row?: number };
    return json.ok ? { ok: true, row: json.row } : { ok: false, error: json.error || "unknown" };
  } catch (err) {
    console.error("[sheets] escritura admin falló:", err instanceof Error ? err.message : err);
    return { ok: false, error: "network" };
  }
}
