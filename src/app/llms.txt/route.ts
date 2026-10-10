import { siteUrl } from "@/lib/site-url";
import { getSessions, getSettings } from "@/lib/content";
import { CATEGORY_PAGES, agesOf } from "@/data/categories";
import { VENUES } from "@/data/venues";
import { DAY_NAMES, formatTime } from "@/data/schedule";
import { faqList } from "@/data/faq";

// Resumen del club en texto plano para asistentes de IA (ChatGPT, Gemini, Perplexity, Claude).
// Formato llms.txt: un título, una cita breve y secciones con enlaces. Se arma con los datos de la hoja.
export const revalidate = 3600;

export async function GET() {
  const [sessions, { contact, priceFrom }] = await Promise.all([getSessions(), getSettings()]);
  const lines = [
    "# Club Voley Zúñiga",
    "",
    "> Club de voleibol en Medellín (Antioquia, Colombia) para niños, jóvenes y adultos desde los 7 años. Cinco categorías, dos sedes y clase de prueba sin costo.",
    "",
    "## Categorías",
    ...CATEGORY_PAGES.map((c) => `- [${c.info.value}](${siteUrl}/equipos/${c.slug}): ${agesOf(c.info)}. ${c.intro}`),
    "",
    "## Sedes",
    ...VENUES.map((v) => `- [${v.name}](${siteUrl}/sedes/${v.id}): ${v.address}. ${v.role}. ${v.description}`),
    "",
    "## Horario de entrenamientos (hora de Colombia)",
    ...sessions.map((s) => `- ${DAY_NAMES[s.day]} de ${formatTime(s.start)} a ${formatTime(s.end)}: ${s.group}, en ${s.sede}`),
    "",
    "## Inscripción y contacto",
    `- [Inscripción y clase de prueba gratis](${siteUrl}/inscripciones)`,
    `- WhatsApp y teléfono: ${contact.phoneDisplay}`,
    `- Correo: ${contact.email}`,
    `- Instagram: ${contact.instagramUrl}`,
    "",
    "## Preguntas frecuentes",
    ...faqList(priceFrom).filter((f) => !/más arriba/.test(f.a)).flatMap((f) => [`### ${f.q}`, f.a, ""]),
    "## Más información",
    `- [El club](${siteUrl}/el-club): historia y valores`,
    `- [Metodología](${siteUrl}/metodologia): cómo se entrena`,
    `- [Partidos](${siteUrl}/partidos): calendario y resultados`,
    `- [Posiciones](${siteUrl}/posiciones): tabla por categoría`,
    `- [Noticias](${siteUrl}/noticias)`,
    `- [Tienda](${siteUrl}/tienda): camisetas y accesorios, pedidos por WhatsApp`,
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
