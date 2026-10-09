// Conversión de los valores tal como los muestra la hoja de Google. Sin dependencias del servidor,
// para poder probarlas por separado.

/** Acepta AAAA-MM-DD o DD/MM/AAAA (como lo muestra Google Sheets en español). Devuelve "" si no es válida. */
export function normDate(raw: string): string {
  const s = (raw || "").trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  return m ? `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}` : "";
}

/** "7:05" o "19:30:00" → "07:05" / "19:30". Devuelve "" si no hay hora. */
export function normTime(raw: string): string {
  const m = (raw || "").trim().match(/^(\d{1,2}):(\d{2})/);
  return m ? `${m[1].padStart(2, "0")}:${m[2]}` : "";
}

/**
 * Convierte un enlace de Google Drive ("Cualquier persona con el enlace") en una imagen directa.
 * Otras direcciones https y rutas locales (/store/...) se usan tal cual; cualquier otra cosa se descarta.
 */
export function imageUrl(raw: string, width = 1600): string {
  const url = (raw || "").trim();
  const drive = url.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:export=\w+&)?id=)([\w-]{20,})/);
  if (drive) return `https://lh3.googleusercontent.com/d/${drive[1]}=w${width}`;
  if (/^\/(?!\/)/.test(url)) return url; // ruta local, pero no "//otro-dominio"
  return /^https:\/\//.test(url) ? url : "";
}

/** Texto apto para una URL: sin tildes, minúsculas y guiones. */
export function slugify(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}
