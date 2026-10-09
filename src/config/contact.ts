import { SITE } from "./site";

// Datos de contacto del club. Se editan en la pestaña "Ajustes" de la hoja (desde el panel);
// estos valores son el respaldo si la hoja no responde.

export type Contact = {
  phoneDisplay: string;
  phoneDigits: string;
  email: string;
  instagramHandle: string; // con @
  instagramUrl: string;
  whatsappMessage: string;
};

export const DEFAULT_CONTACT: Contact = {
  phoneDisplay: SITE.phoneDisplay,
  phoneDigits: SITE.phoneDigits,
  email: SITE.email,
  instagramHandle: SITE.instagram.handle,
  instagramUrl: SITE.instagram.url,
  whatsappMessage: SITE.whatsappMessage,
};

export const waLink = (c: Contact, message?: string) => `https://wa.me/${c.phoneDigits}?text=${encodeURIComponent(message ?? c.whatsappMessage)}`;
export const telLink = (c: Contact) => `tel:+${c.phoneDigits}`;

/** Convierte lo escrito en Ajustes ("+57 312 845 9210", "3128459210") en dígitos con indicativo. */
export function phoneToDigits(raw: string): string | null {
  const d = (raw || "").replace(/\D/g, "");
  if (d.length === 10 && d.startsWith("3")) return `57${d}`;
  if (d.length === 12 && d.startsWith("57")) return d;
  return null;
}

export function prettyPhone(digits: string) {
  const local = digits.startsWith("57") ? digits.slice(2) : digits;
  return local.length === 10 ? `+57 ${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}` : `+${digits}`;
}
