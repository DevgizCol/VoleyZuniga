import { z } from "zod";
import {
  COURT_STATES,
  CUSTOMIZABLE,
  MATCH_STATES,
  WEEKDAYS,
} from "./options";

export * from "./options";

// Reglas de cada pestaña editable desde el panel. Se usan en el servidor antes de escribir en la hoja.

const text = (max: number, label: string) => z.string().trim().max(max, `${label}: máximo ${max} caracteres.`);
const required = (max: number, label: string) => text(max, label).min(1, `${label} es obligatorio.`);
const date = z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Elige una fecha válida.");
const time = z.string().trim().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Escribe la hora como 16:30.");
const optionalTime = z.union([time, z.literal("")]);
const count = (label: string) =>
  z.coerce.number({ message: `${label} debe ser un número.` }).int(`${label} debe ser entero.`).min(0, `${label} no puede ser negativo.`).max(999).transform(String);
// En la hoja, Activo vacío = visible; "NO" = oculto.
const active = z.union([z.literal("on"), z.literal("SI"), z.literal(""), z.literal("NO"), z.undefined()]).transform((v) => (v === "on" || v === "SI" || v === "" ? "" : "NO"));

export const fixtureSchema = z
  .object({
    Fecha: date,
    Hora: optionalTime,
    Categoría: required(60, "La categoría"),
    Local: required(80, "El equipo local"),
    Visitante: required(80, "El equipo visitante"),
    Sede: text(120, "La sede"),
    Estado: z.enum(MATCH_STATES),
    Resultado: z.union([z.literal(""), z.string().trim().regex(/^\d\s*-\s*\d(\s*\(.{0,80}\))?$/, "Escribe el resultado como 3-1 o 3-1 (25-20, 25-18, 20-25, 25-22).")]),
    Activo: active,
  })
  .transform((v) => ({ ...v, Estado: v.Resultado ? "Finalizado" : v.Estado }));

export const standingSchema = z.object({
  Categoría: required(60, "La categoría"),
  Equipo: required(80, "El equipo"),
  PJ: count("PJ"),
  PG: count("PG"),
  PP: count("PP"),
  Puntos: count("Puntos"),
  Activo: active,
});

export const newsSchema = z.object({
  Fecha: date,
  Título: required(140, "El título"),
  Categoría: required(40, "La categoría"),
  Resumen: text(300, "El resumen"),
  Cuerpo: text(10000, "El texto"),
  "Imagen (URL)": z.union([z.literal(""), z.string().trim().url("La imagen debe ser un enlace que empiece por https://").startsWith("https://", "La imagen debe empezar por https://")]),
  Activo: active,
});

export const courtSchema = z.object({
  Sede: required(80, "La sede"),
  Estado: z.enum(COURT_STATES),
  Mensaje: text(200, "El mensaje"),
});

export const scheduleSchema = z
  .object({
    Día: z.enum(WEEKDAYS),
    Inicio: time,
    Fin: time,
    Grupo: required(80, "El grupo"),
    Sede: required(80, "La sede"),
    Activo: active,
  })
  .refine((v) => v.Fin > v.Inicio, { message: "La hora de fin debe ser después del inicio.", path: ["Fin"] });


export const productSchema = z.object({
  Nombre: required(80, "El nombre"),
  Categoría: required(40, "La categoría"),
  Precio: z
    .string()
    .trim()
    .transform((v) => v.replace(/[^\d]/g, ""))
    .pipe(z.string().regex(/^\d{3,8}$/, "Escribe el precio en pesos, por ejemplo 95000.")),
  Descripción: text(300, "La descripción"),
  Imagen: z.union([
    z.literal(""),
    z.string().trim().regex(/^\//, "Usa una ruta del sitio (/store/...) o un enlace https."),
    z.string().trim().startsWith("https://", "La imagen debe empezar por https://"),
  ]),
  Personalizable: z.enum(CUSTOMIZABLE),
  Activo: active,
});

const mediaLink = (what: string) =>
  z.union([
    z.literal(""),
    z.string().trim().max(500, `${what}: el enlace es demasiado largo.`).regex(/^\/[\w.-]/, "Usa una ruta del sitio (/portada.mp4) o un enlace https."),
    z.string().trim().max(500, `${what}: el enlace es demasiado largo.`).startsWith("https://", `${what} debe ser un enlace que empiece por https://`),
  ]);

// Ajustes: solo se edita el valor; cada clave tiene su propia regla.
export const SETTING_RULES: Record<string, { label: string; help: string; schema: z.ZodType<string>; type?: "text" | "textarea" | "yesno" }> = {
  telefono: {
    label: "Teléfono y WhatsApp",
    help: "Con o sin +57, por ejemplo 312 845 9210. Cambia todos los botones de WhatsApp y llamada de la web.",
    schema: z.string().trim().refine((v) => /^(\+?57)?\s*3\d{2}\s*\d{3}\s*\d{4}$/.test(v.replace(/[-.]/g, " ")), "Escribe un celular colombiano de 10 dígitos."),
  },
  correo: { label: "Correo de contacto", help: "Se muestra en el pie de página y en Contacto.", schema: z.string().trim().email("Escribe un correo válido.") },
  instagram: {
    label: "Instagram",
    help: "Solo el usuario, sin @ (por ejemplo voleyzuniga).",
    schema: z.string().trim().transform((v) => v.replace(/^@/, "")).pipe(z.string().regex(/^[\w.]{1,30}$/, "Solo letras, números, puntos y guiones bajos.")),
  },
  mensaje_whatsapp: { label: "Mensaje de WhatsApp", help: "Texto que aparece escrito cuando alguien toca un botón de WhatsApp.", schema: required(300, "El mensaje"), type: "textarea" },
  aviso_inicio: { label: "Aviso en la portada", help: "Una frase corta destacada arriba del título, por ejemplo “Inscripciones abiertas 2027”. Déjalo vacío para no mostrar nada.", schema: text(160, "El aviso") },
  inscripciones_abiertas: {
    label: "Inscripciones abiertas",
    help: "Con NO, el formulario muestra que los cupos están cerrados y ofrece WhatsApp.",
    schema: z.enum(["SI", "NO"], { message: "Elige SI o NO." }),
    type: "yesno",
  },
  portada_foto: {
    label: "Foto de la portada",
    help: "Va detrás del titular del inicio, con el color del club. Enlace de Google Drive (compartido con cualquiera) o https. Vacío: se ve la ilustración de la cancha.",
    schema: mediaLink("La foto"),
  },
  portada_video: {
    label: "Video de la portada",
    help: "Video corto en bucle, sin sonido (MP4 de 6 a 8 segundos, menos de 4 MB). Enlace https directo al archivo o ruta del sitio como /portada.mp4. Tiene prioridad sobre la foto.",
    schema: mediaLink("El video"),
  },
  foto_club: {
    label: "Foto de “El club”",
    help: "Foto grupal para el encabezado de la página El club. Si queda vacía se usa la foto más reciente de la Galería.",
    schema: mediaLink("La foto"),
  },
};

export const SCHEMAS = {
  Fixture: fixtureSchema,
  Tabla: standingSchema,
  Noticias: newsSchema,
  Cancha: courtSchema,
  Horarios: scheduleSchema,
  Productos: productSchema,
} as const;

export type EditableSheet = keyof typeof SCHEMAS;
