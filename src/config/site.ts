// Datos del club en un solo lugar: si cambia el teléfono o una red, se edita aquí.

export const SITE = {
  name: "Club Voley Zúñiga",
  shortName: "Voley Zúñiga",
  city: "Medellín, Antioquia",
  phoneDisplay: "+57 312 845 9210",
  phoneDigits: "573128459210",
  email: "clubvoleyzuniga@gmail.com",
  instagram: { handle: "@voleyzuniga", url: "https://www.instagram.com/voleyzuniga" },
  whatsappMessage: "Hola, quisiera información sobre inscripciones y horarios en el Club Voley Zúñiga",
} as const;

export const whatsappUrl = (message: string = SITE.whatsappMessage) =>
  `https://wa.me/${SITE.phoneDigits}?text=${encodeURIComponent(message)}`;

export const telUrl = `tel:+${SITE.phoneDigits}`;

export const NAV_LINKS = [
  { name: "El club", href: "/el-club" },
  { name: "Equipos", href: "/equipos" },
  { name: "Partidos", href: "/partidos" },
  { name: "Posiciones", href: "/posiciones" },
  { name: "Noticias", href: "/noticias" },
  { name: "Tienda", href: "/tienda" },
  { name: "Contacto", href: "/contacto" },
] as const;

// Menú principal de escritorio: lo que busca quien llega por primera vez, y lo de competencia agrupado.
export const NAV_MENU = [
  { name: "El club", href: "/el-club" },
  { name: "Equipos", href: "/equipos" },
  {
    name: "Competencia",
    children: [
      { name: "Partidos", href: "/partidos" },
      { name: "Posiciones", href: "/posiciones" },
      { name: "Noticias", href: "/noticias" },
    ],
  },
  { name: "Tienda", href: "/tienda" },
  { name: "Contacto", href: "/contacto" },
] as const;
