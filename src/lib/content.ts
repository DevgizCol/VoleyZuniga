import "server-only";
import { cache } from "react";
import { readSheet } from "./sheets";
import { imageUrl } from "./images";
import { DEFAULT_CONTACT, phoneToDigits, prettyPhone, type Contact } from "@/config/contact";
import { SESSIONS, formatTime, type Session } from "@/data/schedule";
import { PRODUCTS, type Product } from "@/data/products";
import { CATEGORIES, HORARIOS } from "@/data/registration";

// Contenido que el club edita desde el panel (pestañas Ajustes, Horarios y Productos).
// Si la hoja no responde, la web usa los valores del código para no quedar vacía.

export type Settings = {
  contact: Contact;
  homeNotice: string;
  registrationsOpen: boolean;
  /** Foto o video corto (MP4) detrás del titular de la portada, y foto del encabezado de "El club". */
  heroPhoto: string;
  heroVideo: string;
  clubPhoto: string;
  /** Cifras del club para la portada ("12 | años formando deportistas"). Vacío: se usan las del código. */
  stats: { value: number; label: string }[];
  /** Mensualidad de referencia, por ejemplo "$80.000". Vacío: no se muestra. */
  priceFrom: string;
  /** Cupos disponibles por categoría (clave: la categoría, por ejemplo "Sub-14"). */
  spots: Record<string, number>;
  /** Ligas o entidades a las que el club está afiliado. */
  affiliations: string[];
  /** Compromisos de cuidado de los deportistas, uno por línea. */
  care: string[];
};

const lines = (raw: string) =>
  raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

// "12 | años formando deportistas" -> { value: 12, label: "años formando deportistas" }
const parseStats = (raw: string) =>
  lines(raw)
    .map((l) => {
      const [num, ...rest] = l.split("|");
      const value = Number((num || "").replace(/[^\d]/g, ""));
      const label = rest.join("|").trim().slice(0, 60);
      return value > 0 && label ? { value: Math.min(value, 99999), label } : null;
    })
    .filter((s): s is { value: number; label: string } => s !== null)
    .slice(0, 4);

// "Sub-14: 4" -> { "Sub-14": 4 }. La clave se compara luego contra el nombre de cada categoría.
const parseSpots = (raw: string) =>
  Object.fromEntries(
    lines(raw)
      .map((l) => l.match(/^(.+?)\s*[:=]\s*(\d{1,3})$/))
      .filter((m): m is RegExpMatchArray => m !== null)
      .map((m) => [m[1].trim().toLowerCase(), Number(m[2])])
  ) as Record<string, number>;

/** Cupos que quedan en una categoría, o null si el club no los publicó. */
export const spotsFor = (spots: Record<string, number>, category: string): number | null => {
  const name = category.toLowerCase();
  const key = Object.keys(spots).find((k) => name === k || name.includes(k));
  return key === undefined ? null : spots[key];
};

// Solo enlaces https o archivos del propio sitio ("/portada.mp4").
const mediaUrl = (raw: string) => (/^(https:\/\/|\/[\w.-])/.test(raw) ? raw.slice(0, 500) : "");

export const getSettings = cache(async (): Promise<Settings> => {
  const rows = (await readSheet("Ajustes", 300)) ?? [];
  const map = new Map(rows.map((r) => [(r["Clave"] || "").trim().toLowerCase(), (r["Valor"] || "").trim()]));
  const digits = phoneToDigits(map.get("telefono") || "") ?? DEFAULT_CONTACT.phoneDigits;
  const ig = (map.get("instagram") || "").replace(/^@/, "").replace(/[^\w.]/g, "");
  const email = map.get("correo") || "";
  return {
    contact: {
      phoneDigits: digits,
      phoneDisplay: map.get("telefono") ? prettyPhone(digits) : DEFAULT_CONTACT.phoneDisplay,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ? email : DEFAULT_CONTACT.email,
      instagramHandle: ig ? `@${ig}` : DEFAULT_CONTACT.instagramHandle,
      instagramUrl: ig ? `https://www.instagram.com/${ig}` : DEFAULT_CONTACT.instagramUrl,
      whatsappMessage: (map.get("mensaje_whatsapp") || DEFAULT_CONTACT.whatsappMessage).slice(0, 300),
    },
    homeNotice: (map.get("aviso_inicio") || "").slice(0, 160),
    registrationsOpen: !/^no$/i.test(map.get("inscripciones_abiertas") || "SI"),
    heroPhoto: imageUrl(map.get("portada_foto") || "") || "",
    heroVideo: mediaUrl(map.get("portada_video") || ""),
    clubPhoto: imageUrl(map.get("foto_club") || "") || "",
    stats: parseStats(map.get("cifras") || ""),
    priceFrom: (map.get("precio_desde") || "").slice(0, 40),
    spots: parseSpots(map.get("cupos") || ""),
    affiliations: (map.get("afiliaciones") || "")
      .split(/[,\n]/)
      .map((a) => a.trim().slice(0, 60))
      .filter(Boolean)
      .slice(0, 6),
    care: lines(map.get("cuidado") || "").map((l) => l.slice(0, 160)).slice(0, 6),
  };
});

const DAY_INDEX: Record<string, number> = { domingo: 0, lunes: 1, martes: 2, miercoles: 3, miércoles: 3, jueves: 4, viernes: 5, sabado: 6, sábado: 6 };
const hhmm = (raw: string) => {
  const m = (raw || "").trim().match(/^(\d{1,2}):(\d{2})/);
  return m && Number(m[1]) < 24 ? `${m[1].padStart(2, "0")}:${m[2]}` : "";
};

export const getSessions = cache(async (): Promise<Session[]> => {
  const rows = await readSheet("Horarios", 300);
  if (!rows) return SESSIONS;
  const list = rows
    .map((r) => ({
      day: DAY_INDEX[(r["Día"] || "").trim().toLowerCase()] ?? -1,
      start: hhmm(r["Inicio"]),
      end: hhmm(r["Fin"]),
      group: (r["Grupo"] || "").trim(),
      sede: (r["Sede"] || "").trim(),
    }))
    .filter((s) => s.day >= 0 && s.start && s.end && s.group);
  return list.length ? list.sort((a, b) => a.day - b.day || a.start.localeCompare(b.start)) : SESSIONS;
});

export const trainingDays = (sessions: Session[]) => Array.from(new Set(sessions.map((s) => s.day))).sort((a, b) => a - b);

const DAY_LABEL = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const joinDays = (days: number[]) => {
  const names = days.map((d) => (d === 6 ? "Sábados" : DAY_LABEL[d]));
  return names.length <= 1 ? names[0] ?? "" : `${names.slice(0, -1).join(", ")} y ${names[names.length - 1]}`;
};

/** Horarios para el formulario de inscripción: une los días que comparten grupo, hora y sede. */
export function scheduleOptions(sessions: Session[]) {
  const groups = new Map<string, { days: number[]; s: Session }>();
  for (const s of sessions) {
    const key = `${s.group}|${s.start}|${s.end}|${s.sede}`;
    const g = groups.get(key) ?? { days: [], s };
    g.days.push(s.day);
    groups.set(key, g);
  }
  return Array.from(groups.values()).map(({ days, s }) => {
    const value = `${joinDays(days)} (${formatTime(s.start)} – ${formatTime(s.end)})`;
    return { value, label: `${value} · ${s.group}`, group: s.group, sede: s.sede, days, start: s.start, end: s.end };
  });
}

/** Horario y sede sugeridos para cada categoría según la pestaña Horarios. */
export function categorySchedules(sessions: Session[]) {
  const options = scheduleOptions(sessions);
  return Object.fromEntries(
    CATEGORIES.map((c) => {
      const match = options.find((o) => o.group.toLowerCase().includes(c.value.toLowerCase()));
      return [c.value, match ? { horario: match.value, sede: match.sede } : { horario: c.horario as string, sede: c.sede as string }];
    })
  ) as Record<string, { horario: string; sede: string }>;
}

/** Todos los horarios válidos para la inscripción (los de la hoja y, por compatibilidad, los del código). */
export async function validHorarios(): Promise<string[]> {
  const fromSheet = scheduleOptions(await getSessions()).map((o) => o.value);
  return Array.from(new Set([...fromSheet, ...HORARIOS.map((h) => h.value)]));
}

const CUSTOM: Record<string, Product["customizable"]> = { titular: "home", home: "home", libero: "libero", líbero: "libero" };

export const getProducts = cache(async (): Promise<Product[]> => {
  const rows = await readSheet("Productos", 300);
  if (!rows) return PRODUCTS;
  const list = rows
    .map((r, i): Product | null => {
      const name = (r["Nombre"] || "").trim();
      const price = Number(String(r["Precio"] || "").replace(/[^\d]/g, ""));
      if (!name || !price) return null;
      const image = imageUrl(r["Imagen"]);
      const cat = (r["Categoría"] || "Accesorios").trim();
      return {
        id: `p${i}-${name.toLowerCase().normalize("NFD").replace(/[^\w]+/g, "-").slice(0, 40)}`,
        name,
        category: cat,
        price,
        description: (r["Descripción"] || "").trim(),
        image: image || "/placeholder-club.svg",
        customizable: CUSTOM[(r["Personalizable"] || "").trim().toLowerCase()],
      };
    })
    .filter((p): p is Product => p !== null);
  return list.length ? list : PRODUCTS;
});

/**
 * Solicitudes de clase de prueba de los últimos 30 días (prueba social con datos reales).
 * Solo sale del servidor el número; devuelve 0 si la hoja no responde.
 */
export const getRecentRegistrations = cache(async (): Promise<number> => {
  const rows = await readSheet("Inscripciones", 1800);
  if (!rows) return 0;
  const since = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bogota" }).format(new Date(Date.now() - 30 * 86400000));
  return rows.filter((r) => String(r["Fecha"] || "").slice(0, 10) >= since).length;
});
