import { CATEGORIES, type CategoryInfo } from "./registration";

// Textos de cada categoría para /equipos y para su página propia (/equipos/[categoria]).
// `search` es la búsqueda principal en Google a la que apunta la página de la categoría.

export type CategoryPage = {
  slug: string;
  info: CategoryInfo;
  lead: string;
  points: string[];
  search: string;
  intro: string;
  faqs: { q: string; a: string }[];
};

const slugify = (v: string) => v.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const tagOf = (v: string) => v.match(/Sub-\d+/)?.[0] ?? "18+";
export const nameOf = (v: string) => v.replace(/\s*(Sub-\d+|Élite)$/, "");
export const agesOf = (c: Pick<CategoryInfo, "minAge" | "maxAge">) =>
  c.maxAge >= 100 ? "18 años o más" : c.minAge === 0 ? "7 a 11 años" : `${c.minAge} a ${c.maxAge} años`;

const COPY: Record<string, Omit<CategoryPage, "slug" | "info">> = {
  "Semillero Sub-12": {
    lead: "El primer contacto con el balón: jugar, moverse bien y enamorarse del voleibol.",
    points: ["Coordinación y control del balón", "Postura y desplazamientos básicos", "Compañerismo y disciplina desde el juego"],
    search: "Voleibol para niños en Medellín",
    intro: "Escuela de voleibol para niñas y niños de 7 a 11 años. Aprenden jugando, sin experiencia previa, con entrenadores que cuidan su técnica y su crecimiento.",
    faqs: [
      { q: "¿Mi hijo necesita experiencia para entrar al Semillero?", a: "No. La mayoría llega sin haber jugado nunca. En el Semillero se aprende desde cero, con juegos y ejercicios adaptados a su edad." },
      { q: "¿Desde qué edad reciben niños?", a: "Desde los 7 años. El Semillero Sub-12 es para niñas y niños de 7 a 11 años." },
      { q: "¿Es seguro para niños pequeños?", a: "Sí. El trabajo de salto y el acondicionamiento son progresivos, pensados para cuidar rodillas y hombros en crecimiento." },
    ],
  },
  "Infantil Sub-14": {
    lead: "Llegan los fundamentos completos y los primeros sistemas de juego.",
    points: ["Saque, recepción y armado con técnica correcta", "Batida y remate con trabajo de salto seguro", "Primeros partidos y festivales"],
    search: "Escuela de voleibol en Medellín",
    intro: "Para jugadoras y jugadores de 12 y 13 años que quieren aprender los fundamentos completos y empezar a competir en festivales y partidos.",
    faqs: [
      { q: "¿Puede entrar a los 12 años sin haber jugado antes?", a: "Sí. Los entrenadores valoran el nivel en la clase de prueba y acompañan a quien llega nuevo para que se ponga al día con el grupo." },
      { q: "¿La categoría Infantil compite?", a: "Sí. Juega festivales interclubes y sus primeros partidos de liga, siempre con el aprendizaje como prioridad." },
    ],
  },
  "Menores Sub-16": {
    lead: "Se compite en serio y cada posición empieza a especializarse.",
    points: ["Sistemas 5-1 y 4-2", "Lectura de bloqueo y cobertura", "Partidos de liga y torneos interclubes"],
    search: "Club de voleibol para adolescentes en Medellín",
    intro: "Categoría de 14 y 15 años. Cada jugador encuentra su posición y compite en la Liga de Antioquia y en torneos interclubes.",
    faqs: [
      { q: "¿En qué torneos juega la categoría Menores?", a: "En la Liga de Voleibol de Antioquia, torneos municipales y festivales interclubes. El calendario está en la página de Partidos." },
      { q: "¿Se puede entrar a los 14 o 15 años?", a: "Sí. Hay jugadores que empiezan en esta edad. En la clase de prueba se valora su nivel y se define cómo integrarlo al grupo." },
    ],
  },
  "Juvenil Sub-18": {
    lead: "Alta competencia: decisiones rápidas, cabeza fría y liderazgo en la cancha.",
    points: ["Preparación física por posición", "Manejo de la presión en puntos críticos", "Liga de Antioquia y festivales nacionales"],
    search: "Voleibol juvenil de competencia en Medellín",
    intro: "Para jugadoras y jugadores de 16 y 17 años que quieren competir a alto nivel en la Liga de Antioquia y en festivales nacionales.",
    faqs: [
      { q: "¿El club ayuda con becas deportivas universitarias?", a: "Sí. Acompañamos a los jugadores juveniles y de mayores que quieren buscar una beca deportiva." },
      { q: "¿Cuántas veces a la semana entrena la categoría Juvenil?", a: "Martes y jueves en la noche. El horario exacto está arriba en esta página." },
    ],
  },
  "Mayores Élite": {
    lead: "Para quienes quieren seguir compitiendo después del colegio, o volver a la cancha.",
    points: ["Entrenamiento táctico de alto nivel", "Partidos oficiales en el Coliseo Yesid Santos", "Acompañamiento para becas deportivas"],
    search: "Voleibol para adultos en Medellín",
    intro: "Equipo de 18 años en adelante que entrena y juega partidos oficiales en el Coliseo Yesid Santos. Para quien viene de un equipo juvenil o quiere volver a jugar.",
    faqs: [
      { q: "¿Pueden entrar adultos que no juegan hace años?", a: "Sí. Muchos vuelven a la cancha después de un tiempo. En la clase de prueba se valora el nivel y se acuerda el ritmo de regreso." },
      { q: "¿Dónde entrena Mayores Élite?", a: "En el Coliseo Yesid Santos, en la Unidad Deportiva Atanasio Girardot, los viernes en la noche." },
    ],
  },
};

export const CATEGORY_PAGES: CategoryPage[] = CATEGORIES.map((info) => ({ slug: slugify(info.value), info, ...COPY[info.value] }));

export const categoryPage = (slug: string) => CATEGORY_PAGES.find((c) => c.slug === slug);
export const categoryHref = (value: string) => `/equipos/${slugify(value)}`;
