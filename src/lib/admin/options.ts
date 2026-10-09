// Opciones de las listas del panel. Sin zod, para poder usarlas en componentes del navegador
// sin cargar el validador (su prueba de `new Function` choca con la política de seguridad).

export const MATCH_STATES = ["Programado", "Finalizado", "Aplazado", "Cancelado"] as const;
export const COURT_STATES = ["Normal", "Lluvia", "Cancelado", "Cambio de sede", "Aviso"] as const;
export const WEEKDAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"] as const;
export const REGISTRATION_STATES = ["Nuevo", "Contactado", "Matriculado", "Descartado"] as const;
export const MESSAGE_STATES = ["Nuevo", "Respondido", "Archivado"] as const;
export const NEWS_CATEGORIES = ["Crónica de partido", "Convocatorias", "Vida en el club", "Torneos", "Comunicados"] as const;
export const PRODUCT_CATEGORIES = ["Indumentaria", "Equipamiento", "Protección", "Accesorios"] as const;
export const CUSTOMIZABLE = ["", "Titular", "Líbero"] as const;

export const STATUS_OPTIONS = {
  Inscripciones: REGISTRATION_STATES,
  Contacto: MESSAGE_STATES,
} as const;
export type StatusSheet = keyof typeof STATUS_OPTIONS;
