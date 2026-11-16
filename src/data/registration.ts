// Fuente única para categorías, sedes, horarios y niveles de inscripción.
// Horarios y sedes reales del club (noviembre 2026).

export const SEDES = [
  { value: "Polideportivo 3 Canchas", label: "Polideportivo 3 Canchas (Buenos Aires)" },
  { value: "Placa Quinta Linda", label: "Placa Polideportiva Quinta Linda (Buenos Aires)" },
  { value: "Coliseo Alejandro Echavarría", label: "Coliseo Alejandro Echavarría (Buenos Aires)" },
  { value: "Coliseo Poblado de Veracruz", label: "Coliseo Poblado de Veracruz" },
  { value: "Coliseo El Vergel", label: "Coliseo El Vergel (Buenos Aires)" },
] as const;

/** Categorías sin horario publicado: la inscripción queda a confirmar por el club. */
export const POR_CONFIRMAR = "Por confirmar con el club";

// Respaldo si la pestaña Horarios no tiene la categoría (mismo formato que scheduleOptions en content.ts).
export const HORARIOS = [
  { value: "Miércoles y Jueves (6:00 PM – 7:30 PM)", label: "Mié y Jue (6:00 PM – 7:30 PM) · Benjamín" },
  { value: "Martes y Jueves (6:00 PM – 7:10 PM)", label: "Mar y Jue (6:00 PM – 7:10 PM) · Mini" },
  { value: "Martes y Jueves (4:30 PM – 6:00 PM)", label: "Mar y Jue (4:30 PM – 6:00 PM) · Infantil" },
  { value: "Lunes, Miércoles y Viernes (7:00 PM – 8:30 PM)", label: "Lun, Mié y Vie (7:00 PM – 8:30 PM) · Libre" },
  { value: POR_CONFIRMAR, label: POR_CONFIRMAR },
] as const;

export const NIVELES = [
  "Iniciación Formativa",
  "Intermedio en Desarrollo",
  "Alta Competencia",
] as const;

export type CategoryInfo = {
  value: string;
  label: string;
  minAge: number;
  maxAge: number;
  sede: string;
  horario: (typeof HORARIOS)[number]["value"];
};

// Edades del club: Benjamín 7-10, Mini 10-12, Infantil 12-14, Pre-juvenil 14-16, Sub-17 (17) y Libre (18+).
// En las edades límite se asigna la categoría menor; el club puede reasignar.
export const CATEGORIES: CategoryInfo[] = [
  { value: "Benjamín", label: "Benjamín (7 a 10 años)", minAge: 0, maxAge: 9, sede: "Coliseo Poblado de Veracruz", horario: HORARIOS[0].value },
  { value: "Mini", label: "Mini (10 a 12 años)", minAge: 10, maxAge: 11, sede: "Placa Quinta Linda", horario: HORARIOS[1].value },
  { value: "Infantil", label: "Infantil (12 a 14 años)", minAge: 12, maxAge: 13, sede: "Coliseo Alejandro Echavarría", horario: HORARIOS[2].value },
  { value: "Pre-juvenil", label: "Pre-juvenil (14 a 16 años)", minAge: 14, maxAge: 16, sede: POR_CONFIRMAR, horario: POR_CONFIRMAR },
  { value: "Sub-17", label: "Sub-17 (17 años)", minAge: 17, maxAge: 17, sede: POR_CONFIRMAR, horario: POR_CONFIRMAR },
  { value: "Libre", label: "Libre (18 años en adelante)", minAge: 18, maxAge: 120, sede: "Polideportivo 3 Canchas", horario: HORARIOS[3].value },
];

export function categoryForAge(age: number): CategoryInfo {
  return (
    CATEGORIES.find((c) => age >= c.minAge && age <= c.maxAge) ??
    CATEGORIES[CATEGORIES.length - 1]
  );
}

/** Versión de la política de datos que acepta cada inscripción (Ley 1581): cambiarla al modificar /privacidad. */
export const POLICY_VERSION = "2026-11-06";

/** Quién autoriza el tratamiento cuando el deportista es menor de edad. */
export const PARENTESCOS = ["Madre", "Padre", "Otro familiar", "Representante legal"] as const;

/** Logos oficiales de entidades afiliadas: se usan si el nombre en Ajustes ("afiliaciones") coincide. */
export const AFFILIATION_LOGOS: { match: RegExp; src: string; width: number; height: number }[] = [
  { match: /\binder\b/i, src: "/afiliaciones/inder-medellin.webp", width: 474, height: 209 },
  { match: /liga.*voleibol|voleibol.*antioqu/i, src: "/afiliaciones/liga-antioquena-voleibol.webp", width: 456, height: 287 },
  { match: /alcald[ií]a/i, src: "/afiliaciones/alcaldia-medellin.webp", width: 588, height: 409 },
  { match: /presupuesto\s+participativo|\bPP\b/i, src: "/afiliaciones/presupuesto-participativo.webp", width: 198, height: 247 },
];
