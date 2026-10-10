import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";
import { getArticles } from "@/lib/news";
import { CATEGORY_PAGES } from "@/data/categories";
import { VENUES } from "@/data/venues";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  type Page = [string, number, MetadataRoute.Sitemap[number]["changeFrequency"]];
  const pages: Page[] = [
    ["", 1, "weekly"],
    ["/inscripciones", 0.9, "monthly"],
    ["/partidos", 0.8, "daily"],
    ["/posiciones", 0.7, "weekly"],
    ["/equipos", 0.7, "monthly"],
    ["/contacto", 0.7, "monthly"],
    ["/noticias", 0.6, "weekly"],
    ["/el-club", 0.5, "yearly"],
    ["/metodologia", 0.5, "yearly"],
    ["/tienda", 0.5, "monthly"],
    ["/galeria", 0.5, "weekly"],
    ["/privacidad", 0.2, "yearly"],
    ...CATEGORY_PAGES.map((c): Page => [`/equipos/${c.slug}`, 0.8, "monthly"]),
    ...VENUES.map((v): Page => [`/sedes/${v.id}`, 0.6, "monthly"]),
  ];
  const articles = await getArticles().catch(() => []);
  return [
    ...pages.map(([path, priority, changeFrequency]) => ({ url: `${siteUrl}${path}`, priority, changeFrequency, lastModified: new Date() })),
    ...articles.map((a) => ({ url: `${siteUrl}/noticias/${a.slug}`, lastModified: new Date(`${a.date}T12:00:00-05:00`), priority: 0.5 })),
  ];
}
