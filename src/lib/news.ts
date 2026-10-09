import "server-only";
import { readSheet } from "./sheets";

// Noticias de la pestaña "Noticias": Fecha, Título, Categoría, Resumen, Cuerpo, Imagen (URL), Activo.

export type Article = {
  slug: string;
  date: string;
  title: string;
  category: string;
  summary: string;
  body: string;
  image: string;
};

const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);

function normDate(raw: string) {
  const s = (raw || "").trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  return m ? `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}` : "";
}

// Convierte un enlace de Google Drive ("Cualquier persona con el enlace") en una imagen directa.
function imageUrl(raw: string) {
  const url = (raw || "").trim();
  const drive = url.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:export=\w+&)?id=)([\w-]{20,})/);
  if (drive) return `https://lh3.googleusercontent.com/d/${drive[1]}=w1600`;
  return /^https:\/\//.test(url) ? url : "";
}

export async function getArticles(): Promise<Article[]> {
  const rows = (await readSheet("Noticias")) ?? [];
  return rows
    .filter((r) => r["Título"] && normDate(r["Fecha"]))
    .map((r) => {
      const date = normDate(r["Fecha"]);
      const image = imageUrl(r["Imagen (URL)"]);
      return {
        slug: `${date}-${slugify(r["Título"])}`,
        date,
        title: r["Título"].trim(),
        category: (r["Categoría"] || "Club").trim(),
        summary: (r["Resumen"] || "").trim(),
        body: (r["Cuerpo"] || "").trim(),
        image,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getArticle(slug: string) {
  return (await getArticles()).find((a) => a.slug === slug) ?? null;
}

const MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
export const longDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} de ${MONTHS[m - 1]} de ${y}`;
};
