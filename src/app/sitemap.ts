import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";
import { getArticles } from "@/lib/news";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: [string, number, MetadataRoute.Sitemap[number]["changeFrequency"]][] = [
    ["", 1, "weekly"],
    ["/registrations", 0.9, "monthly"],
    ["/games", 0.8, "daily"],
    ["/standings", 0.7, "weekly"],
    ["/team", 0.7, "monthly"],
    ["/club/contact", 0.7, "monthly"],
    ["/news", 0.6, "weekly"],
    ["/club/history", 0.5, "yearly"],
    ["/club/methodology", 0.5, "yearly"],
    ["/store", 0.5, "monthly"],
    ["/privacidad", 0.2, "yearly"],
  ];
  const articles = await getArticles().catch(() => []);
  return [
    ...pages.map(([path, priority, changeFrequency]) => ({ url: `${siteUrl}${path}`, priority, changeFrequency, lastModified: new Date() })),
    ...articles.map((a) => ({ url: `${siteUrl}/news/${a.slug}`, lastModified: new Date(`${a.date}T12:00:00-05:00`), priority: 0.5 })),
  ];
}
