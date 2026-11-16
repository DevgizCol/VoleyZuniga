import { z } from "zod";
import { ECDH } from "node:crypto";

// Solo servicios de entrega conocidos. Nunca enviar peticiones a una URL arbitraria del visitante.
export function isPushEndpoint(value: string): boolean {
  try {
    const u = new URL(value);
    if (u.protocol !== "https:" || u.username || u.password || u.port || u.hash) return false;
    return u.hostname === "fcm.googleapis.com" || u.hostname === "updates.push.services.mozilla.com"
      || u.hostname === "push.services.mozilla.com" || u.hostname.endsWith(".push.apple.com")
      || u.hostname.endsWith(".notify.windows.com");
  } catch { return false; }
}

const key = (length: number) => z.string().max(100).regex(/^[A-Za-z0-9_-]+$/).refine(v => {
  try {
    const decoded = Buffer.from(v, "base64url");
    if (decoded.length !== length) return false;
    if (length !== 65) return true;
    const normalized = ECDH.convertKey(decoded, "prime256v1");
    return decoded[0] === 4 && Buffer.isBuffer(normalized) && normalized.equals(decoded);
  } catch { return false; }
});
export const subscriptionSchema = z.object({
  endpoint: z.string().max(2048).refine(isPushEndpoint, "Servicio de notificaciones no admitido."),
  keys: z.object({ p256dh: key(65), auth: key(16) }),
});
export type ClubSubscription = z.infer<typeof subscriptionSchema>;

export const noticeSchema = z.object({
  title: z.string().trim().min(3).max(100),
  body: z.string().trim().min(3).max(240),
  url: z.enum(["/partidos", "/noticias", "/", "/posiciones", "/tienda", "/inscripciones"]), // igual que public/sw.js
});
export type ClubNotice = z.infer<typeof noticeSchema> & { tag?: string };
