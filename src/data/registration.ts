// Fuente única para categorías, sedes, horarios y niveles de inscripción.
// Los horarios coinciden con la programación de /club/contact.

export const SEDES = [
  { value: "Polideportivo 3 Canchas", label: "Polideportivo 3 Canchas (Buenos Aires)" },
  { value: "Coliseo Yesid Santos", label: "Coliseo Yesid Santos (Atanasio Girardot)" },
] as const;

export const HORARIOS = [
  { value: "Martes y Jueves (4:00 PM – 5:30 PM)", label: "Mar & Jue (4:00 PM – 5:30 PM)" },
  { value: "Martes y Jueves (5:30 PM – 7:00 PM)", label: "Mar & Jue (5:30 PM – 7:00 PM)" },
  { value: "Martes y Jueves (7:00 PM – 8:30 PM)", label: "Mar & Jue (7:00 PM – 8:30 PM)" },
  { value: "Sábados Intensivos (8:00 AM – 12:00 M)", label: "Sábados Intensivos (8:00 AM – 12:00 M)" },
  { value: "Viernes (6:00 PM – 8:30 PM)", label: "Viernes (6:00 PM – 8:30 PM) · Selección Élite" },
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
  sede: (typeof SEDES)[number]["value"];
  horario: (typeof HORARIOS)[number]["value"];
};

export const CATEGORIES: CategoryInfo[] = [
  { value: "Semillero Sub-12", label: "Semillero Sub-12 (7-11 años)", minAge: 0, maxAge: 11, sede: "Polideportivo 3 Canchas", horario: HORARIOS[0].value },
  { value: "Infantil Sub-14", label: "Infantil Sub-14 (12-13 años)", minAge: 12, maxAge: 13, sede: "Polideportivo 3 Canchas", horario: HORARIOS[1].value },
  { value: "Menores Sub-16", label: "Menores Sub-16 (14-15 años)", minAge: 14, maxAge: 15, sede: "Polideportivo 3 Canchas", horario: HORARIOS[2].value },
  { value: "Juvenil Sub-18", label: "Juvenil Sub-18 (16-17 años)", minAge: 16, maxAge: 17, sede: "Polideportivo 3 Canchas", horario: HORARIOS[2].value },
  { value: "Mayores Élite", label: "Mayores Élite (18+ años)", minAge: 18, maxAge: 120, sede: "Coliseo Yesid Santos", horario: HORARIOS[4].value },
];

export function categoryForAge(age: number): CategoryInfo {
  return (
    CATEGORIES.find((c) => age >= c.minAge && age <= c.maxAge) ??
    CATEGORIES[CATEGORIES.length - 1]
  );
}
