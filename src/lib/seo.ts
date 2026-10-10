import type { Metadata } from "next";
import { siteUrl } from "./site-url";

export const SITE_NAME = "Voley Zúñiga";
export const CLUB_ID = `${siteUrl}/#club`;

/**
 * Metadatos de una página: título, descripción, URL canónica y lo que se ve al compartirla.
 * Next reemplaza el bloque `openGraph` completo del layout cuando una página define el suyo,
 * así que cada página debe traer su propio título y URL (si no, WhatsApp muestra los de la portada).
 */
export function pageMeta({
  title,
  description,
  path,
  absoluteTitle,
  ownImage,
}: {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
  /** La página tiene su propio opengraph-image.tsx: no se pone la tarjeta general. */
  ownImage?: boolean;
}): Metadata {
  const shareTitle = absoluteTitle ? title : `${title} | ${SITE_NAME}`;
  // Al definir openGraph se pierde la imagen del layout: se vuelve a poner la tarjeta general del club.
  // (sin la clave `images` cuando la página trae su propia imagen: Next solo la usa si la clave no existe).
  const images = ownImage ? {} : { images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Club Voley Zúñiga, voleibol en Medellín" }] };
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", locale: "es_CO", siteName: SITE_NAME, url: path, title: shareTitle, description, ...images },
    twitter: { card: "summary_large_image", title: shareTitle, description, ...images },
  };
}

/** Migas de pan para buscadores: [["Inicio", "/"], ["Equipos", "/equipos"], …]. */
export const breadcrumbs = (items: [string, string][]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: `${siteUrl}${path}` })),
});

export const faqPage = (faqs: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});

const DAY_SCHEMA = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** Horarios de entrenamiento como horario de apertura (schema.org). */
export const openingHours = (sessions: { day: number; start: string; end: string }[]) =>
  sessions.map((s) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: `https://schema.org/${DAY_SCHEMA[s.day]}`, opens: s.start, closes: s.end }));
