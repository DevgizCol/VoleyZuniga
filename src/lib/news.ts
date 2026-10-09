import "server-only";
import { readSheet } from "./sheets";
import { imageUrl, normDate, slugify } from "./sheet-values";

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
