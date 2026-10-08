// Motivos de contacto: el formulario y la API leen de aquí.

export const CONTACT_TOPICS = [
  { value: "Inscripciones", label: "Inscripciones y Clases de Prueba" },
  { value: "Sedes", label: "Información de Sedes y Horarios" },
  { value: "Torneos", label: "Invitación a Torneos y Fogueos" },
  { value: "PQRS", label: "Peticiones, Quejas o Reclamos (PQRS)" },
  { value: "Patrocinios", label: "Patrocinios y Convenios" },
] as const;

export const isOneOf = (options: readonly { value: string }[], value: unknown): value is string =>
  typeof value === "string" && options.some((o) => o.value === value);
