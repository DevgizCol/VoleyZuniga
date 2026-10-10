import type { Contact } from "@/config/contact";
import type { Session } from "@/data/schedule";
import { VENUES, mapsLink } from "@/data/venues";
import { CATEGORIES } from "@/data/registration";
import { categoryHref } from "@/data/categories";
import { CLUB_ID, openingHours } from "./seo";
import { siteUrl } from "./site-url";

const MEDELLIN = { "@type": "PostalAddress", addressLocality: "Medellín", addressRegion: "Antioquia", addressCountry: "CO" };

/**
 * Ficha del club para Google y los asistentes de IA: qué es, dónde entrena, cuándo,
 * a quién recibe y cómo contactarlo. Va en todas las páginas públicas.
 */
export function clubJsonLd(contact: Contact, sessions: Session[]) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "SportsClub",
      "@id": CLUB_ID,
      name: "Club Voley Zúñiga",
      alternateName: ["Voley Zúñiga", "Club Voley Zuniga"],
      url: siteUrl,
      logo: `${siteUrl}/logo-trim.png`,
      image: `${siteUrl}/opengraph-image`,
      description:
        "Club de voleibol en Medellín para niños, jóvenes y adultos desde los 7 años. Cinco categorías (Semillero Sub-12, Infantil Sub-14, Menores Sub-16, Juvenil Sub-18 y Mayores Élite), dos sedes y clase de prueba sin costo.",
      sport: "Volleyball",
      knowsLanguage: "es",
      telephone: `+${contact.phoneDigits}`,
      email: contact.email,
      sameAs: [contact.instagramUrl],
      address: MEDELLIN,
      areaServed: [
        { "@type": "City", name: "Medellín" },
        { "@type": "AdministrativeArea", name: "Valle de Aburrá" },
      ],
      audience: { "@type": "PeopleAudience", suggestedMinAge: 7 },
      openingHoursSpecification: openingHours(sessions),
      location: VENUES.map((v) => ({
        "@type": "SportsActivityLocation",
        name: v.name,
        url: `${siteUrl}/sedes/${v.id}`,
        address: { ...MEDELLIN, streetAddress: v.address },
        geo: { "@type": "GeoCoordinates", latitude: v.lat, longitude: v.lng },
        hasMap: mapsLink(v),
      })),
      makesOffer: {
        "@type": "Offer",
        name: "Clase de prueba de voleibol",
        price: 0,
        priceCurrency: "COP",
        url: `${siteUrl}/inscripciones`,
      },
      subOrganization: CATEGORIES.map((c) => ({ "@type": "SportsTeam", name: `Voley Zúñiga ${c.value}`, sport: "Volleyball", url: `${siteUrl}${categoryHref(c.value)}` })),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${siteUrl}/#web`,
      name: "Voley Zúñiga",
      url: siteUrl,
      inLanguage: "es-CO",
      publisher: { "@id": CLUB_ID },
    },
  ];
}
