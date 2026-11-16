// Datos del club en un solo lugar: si cambia el teléfono o una red, se edita aquí.

export const SITE = {
  name: "Club Voley Zúñiga",
  shortName: "Voley Zúñiga",
  city: "Medellín, Antioquia",
  // Número administrativo: WhatsApp principal (inscripciones, pagos). El de Ajustes en la hoja tiene prioridad.
  phoneDisplay: "+57 320 559 3426",
  phoneDigits: "573205593426",
  // Número técnico-deportivo: entrenamientos, convocatorias y competencias.
  coachPhoneDisplay: "+57 350 247 2031",
  coachPhoneDigits: "573502472031",
  email: "svasupa30@gmail.com",
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
