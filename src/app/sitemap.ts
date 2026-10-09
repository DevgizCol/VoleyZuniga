import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";
import { getArticles } from "@/lib/news";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: [string, number, MetadataRoute.Sitemap[number]["changeFrequency"]][] = [
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
  ];
  const articles = await getArticles().catch(() => []);
  return [
    ...pages.map(([path, priority, changeFrequency]) => ({ url: `${siteUrl}${path}`, priority, changeFrequency, lastModified: new Date() })),
    ...articles.map((a) => ({ url: `${siteUrl}/noticias/${a.slug}`, lastModified: new Date(`${a.date}T12:00:00-05:00`), priority: 0.5 })),
  ];
}
