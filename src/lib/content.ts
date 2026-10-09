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
};

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
    return { value, label: `${value} · ${s.group}`, group: s.group, sede: s.sede };
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
