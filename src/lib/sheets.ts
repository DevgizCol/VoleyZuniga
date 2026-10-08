import "server-only";

// Cliente del backend gratuito: una aplicación web de Google Apps Script
// (docs/google-sheets/Code.gs) que lee y escribe en una Hoja de cálculo de Google.
//
// Variables de entorno (Vercel):
//   SHEETS_WEBAPP_URL  URL de la implementación, termina en /exec
//   SHEETS_SECRET      mismo valor que SHARED_SECRET en las propiedades del script

export type WritableSheet = "Inscripciones" | "Contacto";
export type ReadableSheet = "Fixture" | "Tabla" | "Noticias" | "Cancha";
export type Row = Record<string, string>;

export function sheetsConfigured(): boolean {
  return Boolean(process.env.SHEETS_WEBAPP_URL && process.env.SHEETS_SECRET);
}

const TIMEOUT_MS = 15000;

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
 * Lee las filas activas de Fixture, Tabla, Noticias o Cancha.
 * Se cachea en Next (revalidate) para que los visitantes no esperen a Google.
 * Devuelve null si no está configurado o falla, para que la página use un respaldo.
 */
export async function readSheet(sheet: ReadableSheet, revalidateSeconds = 300): Promise<Row[] | null> {
  const url = process.env.SHEETS_WEBAPP_URL;
  const secret = process.env.SHEETS_SECRET;
  if (!url || !secret) return null;

  try {
    // Apps Script no permite leer cabeceras personalizadas, por eso el secreto va en la consulta
    // (servidor a servidor, sobre HTTPS; nunca llega al navegador).
    const target = `${url}?sheet=${encodeURIComponent(sheet)}&secret=${encodeURIComponent(secret)}`;
    const res = await fetch(target, {
      redirect: "follow",
      next: { revalidate: revalidateSeconds },
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
