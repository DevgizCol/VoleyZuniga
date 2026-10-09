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
  { name: "El club", href: "/club/history" },
  { name: "Equipos", href: "/team" },
  { name: "Partidos", href: "/games" },
  { name: "Posiciones", href: "/standings" },
  { name: "Noticias", href: "/news" },
  { name: "Tienda", href: "/store" },
  { name: "Contacto", href: "/club/contact" },
] as const;
