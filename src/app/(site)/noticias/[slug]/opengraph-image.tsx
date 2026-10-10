import { brandCard, OG_SIZE } from "@/lib/og";
import { getArticle, longDate } from "@/lib/news";

// Imagen al compartir una noticia: su foto con el color del club, el título y la fecha.
export const alt = "Noticia del Club Voley Zúñiga";
export const size = OG_SIZE;
export const contentType = "image/png";
export const revalidate = 300;

export default async function NewsImage({ params }: { params: Promise<{ slug: string }> }) {
  const a = await getArticle((await params).slug);
  if (!a) return brandCard({ kicker: "Noticias", title: "Club Voley Zúñiga", subtitle: "Voleibol en Medellín" });
  return brandCard({
    kicker: [a.category, longDate(a.date)].filter(Boolean).join(" · "),
    title: a.title,
    subtitle: a.summary.slice(0, 110),
    photo: a.image || undefined,
  });
}
