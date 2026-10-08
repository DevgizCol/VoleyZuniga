// Fuente única de las opciones del formulario de inscripción.
// La página y la API leen de aquí, así los valores nunca se desincronizan.

export interface Option {
  value: string;
  label: string;
}

export const CATEGORIES: Option[] = [
  { value: "Semillero Sub-12", label: "Semillero Sub-12 (8-11 años)" },
  { value: "Infantil Sub-14", label: "Infantil Sub-14 (12-13 años)" },
  { value: "Menores Sub-16", label: "Menores Sub-16 (14-15 años)" },
  { value: "Juvenil Sub-18", label: "Juvenil Sub-18 (16-17 años)" },
  { value: "Mayores Élite", label: "Mayores Élite (18+ años)" },
];

export const SEDES: Option[] = [
  { value: "Polideportivo 3 Canchas", label: "Polideportivo 3 Canchas (Belén)" },
  { value: "Coliseo Yesid Santos", label: "Coliseo Yesid Santos (Atanasio Girardot)" },
  { value: "Sede Buenos Aires", label: "Sede Buenos Aires" },
];

export const HORARIOS: Option[] = [
  { value: "Martes y Jueves (4:00 PM – 6:00 PM)", label: "Mar & Jue (4:00 PM – 6:00 PM)" },
  { value: "Lunes, Miércoles y Viernes (4:30 PM – 6:30 PM)", label: "Lun, Mié & Vie (4:30 PM – 6:30 PM)" },
  { value: "Lunes a Jueves (6:00 PM – 8:00 PM)", label: "Lun a Jue (6:00 PM – 8:00 PM)" },
  { value: "Sábados Intensivos (8:00 AM – 12:00 M)", label: "Sábados Intensivos (8:00 AM – 12:00 M)" },
];

export const LEVELS: Option[] = [
  { value: "Iniciación Formativa", label: "Iniciación Formativa" },
  { value: "Intermedio en Desarrollo", label: "Intermedio en Desarrollo" },
  { value: "Alta Competencia", label: "Alta Competencia" },
];

export const CONTACT_TOPICS: Option[] = [
  { value: "Inscripciones", label: "Inscripciones y Clases de Prueba" },
  { value: "Sedes", label: "Información de Sedes y Horarios" },
  { value: "Torneos", label: "Invitación a Torneos y Fogueos" },
  { value: "PQRS", label: "Peticiones, Quejas o Reclamos (PQRS)" },
  { value: "Patrocinios", label: "Patrocinios y Convenios" },
];

export const isValidOption = (options: Option[], value: unknown): value is string =>
  typeof value === "string" && options.some((o) => o.value === value);
