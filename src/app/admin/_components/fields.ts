import { CATEGORIES } from "@/data/registration";
import { VENUES } from "@/data/venues";
import { COURT_STATES, CUSTOMIZABLE, MATCH_STATES, NEWS_CATEGORIES, PRODUCT_CATEGORIES, WEEKDAYS } from "@/lib/admin/options";
import type { FieldDef } from "./types";

const categories = CATEGORIES.map((c) => c.value);
const venues = VENUES.map((v) => v.name);

export const FIXTURE_FIELDS: FieldDef[] = [
  { name: "Fecha", label: "Fecha", type: "date", required: true },
  { name: "Hora", label: "Hora", type: "time", help: "Déjala vacía si aún no está confirmada." },
  { name: "Categoría", label: "Categoría", type: "text", suggestions: categories, required: true, wide: true },
  { name: "Local", label: "Equipo local", type: "text", suggestions: ["Club Voley Zúñiga"], required: true },
  { name: "Visitante", label: "Equipo visitante", type: "text", suggestions: ["Club Voley Zúñiga"], required: true },
  { name: "Sede", label: "Sede", type: "text", suggestions: venues, wide: true },
  { name: "Estado", label: "Estado", type: "select", options: MATCH_STATES },
  { name: "Resultado", label: "Resultado (sets del local - visitante)", type: "text", placeholder: "3-1 (25-20, 23-25, 25-18, 25-21)", help: "Al escribir un resultado, el partido pasa a Finalizado." },
  { name: "Activo", label: "Visible en la web", type: "checkbox", help: "Desmárcalo para ocultarlo sin borrarlo." },
];

export const STANDING_FIELDS: FieldDef[] = [
  { name: "Categoría", label: "Categoría", type: "text", suggestions: categories, required: true },
  { name: "Equipo", label: "Equipo", type: "text", suggestions: ["Club Voley Zúñiga"], required: true },
  { name: "PJ", label: "Partidos jugados", type: "number" },
  { name: "PG", label: "Ganados", type: "number" },
  { name: "PP", label: "Perdidos", type: "number" },
  { name: "Puntos", label: "Puntos", type: "number" },
  { name: "Activo", label: "Visible en la web", type: "checkbox" },
];

export const NEWS_FIELDS: FieldDef[] = [
  { name: "Título", label: "Título", type: "text", required: true, wide: true, placeholder: "Juvenil Sub-18 vence a Sabaneta y sigue líder" },
  { name: "Fecha", label: "Fecha", type: "date", required: true },
  { name: "Categoría", label: "Tipo de noticia", type: "text", suggestions: NEWS_CATEGORIES, required: true },
  { name: "Resumen", label: "Resumen (aparece en la tarjeta)", type: "textarea", rows: 2, wide: true },
  { name: "Cuerpo", label: "Texto completo", type: "textarea", rows: 10, wide: true, help: "Un párrafo por línea." },
  { name: "Imagen (URL)", label: "Imagen (enlace)", type: "url", wide: true, placeholder: "https://drive.google.com/file/d/…" },
  { name: "Activo", label: "Publicada", type: "checkbox", help: "Desmárcala para guardarla como borrador." },
];

export const COURT_FIELDS: FieldDef[] = [
  { name: "Sede", label: "Sede", type: "text", suggestions: venues, required: true, wide: true },
  { name: "Estado", label: "Estado", type: "select", options: COURT_STATES },
  { name: "Mensaje", label: "Mensaje para las familias", type: "text", placeholder: "Hoy no hay entrenamiento. Reponemos el sábado.", wide: true },
];

export const SCHEDULE_FIELDS: FieldDef[] = [
  { name: "Día", label: "Día", type: "select", options: WEEKDAYS },
  { name: "Grupo", label: "Grupo o categoría", type: "text", suggestions: [...categories, "Sábado intensivo"], required: true },
  { name: "Inicio", label: "Hora de inicio", type: "time", required: true },
  { name: "Fin", label: "Hora de fin", type: "time", required: true },
  { name: "Sede", label: "Sede", type: "text", suggestions: venues, required: true, wide: true },
  { name: "Activo", label: "Visible en la web", type: "checkbox" },
];

export const PRODUCT_FIELDS: FieldDef[] = [
  { name: "Nombre", label: "Nombre del producto", type: "text", required: true, wide: true },
  { name: "Categoría", label: "Categoría", type: "text", suggestions: PRODUCT_CATEGORIES, required: true },
  { name: "Precio", label: "Precio (pesos)", type: "text", placeholder: "95000", required: true, help: "Solo números, sin puntos ni $." },
  { name: "Descripción", label: "Descripción", type: "textarea", rows: 3, wide: true },
  { name: "Imagen", label: "Imagen (enlace de Drive o https)", type: "text", wide: true, placeholder: "https://drive.google.com/file/d/…", help: "Déjala como está para usar la ilustración del club." },
  {
    name: "Colores",
    label: "Colores del probador 3D",
    type: "text",
    wide: true,
    placeholder: "Azul:#0F2347, Negro:#16181D",
    help: "Opcional. Nombre y código de color separados por comas. Requiere la columna Colores en la hoja.",
  },
  { name: "Personalizable", label: "Camiseta personalizable", type: "select", options: CUSTOMIZABLE, help: "Titular o Líbero activa el editor de nombre y número." },
  { name: "Activo", label: "Visible en la tienda", type: "checkbox" },
];
