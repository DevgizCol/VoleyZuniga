import "server-only";
import * as webpush from "web-push";
import { pushConfig } from "./config";
import { pushStore } from "./store";
import { subscriptionSchema, type ClubNotice, type ClubSubscription } from "./validation";

export type Delivery = { accepted: number; failed: number; expired: number; error?: string };

export async function sendToDevice(subscription: ClubSubscription, notice: ClubNotice): Promise<"accepted" | "failed" | "expired"> {
  const config = pushConfig();
  if (!config) return "failed";
  if (!subscriptionSchema.safeParse(subscription).success) return "expired";
  try {
    await webpush.sendNotification(subscription, JSON.stringify(notice), {
      vapidDetails: config, TTL: 3600, urgency: "high", timeout: 2000,
    });
    return "accepted";
  } catch (e) {
    const status = (e as { statusCode?: number }).statusCode;
    return status === 404 || status === 410 ? "expired" : "failed";
  }
}

export async function broadcastNotice(notice: ClubNotice): Promise<Delivery> {
  const out: Delivery = { accepted: 0, failed: 0, expired: 0 };
  if (!pushConfig()) return { ...out, error: "not_configured" };
  const stored = await pushStore("list");
  if (!stored.ok) return { ...out, error: stored.error };
  // Grupos pequeños acotan sockets y duración; máximo 200 suscripciones por instalación.
  const expired: ClubSubscription[] = [];
  for (let i = 0; i < stored.subscriptions.length; i += 20) {
    await Promise.all(stored.subscriptions.slice(i, i + 20).map(async sub => {
      const status = await sendToDevice(sub, notice);
      out[status]++;
      if (status === "expired") expired.push(sub);
    }));
  }
  if (expired.length) await pushStore("prune", expired);
  return out;
}

export function deliveryText(d: Delivery): string {
  if (d.error) return "El contenido se guardó, pero no se pudo enviar el aviso. Revisa Notificaciones en el admin.";
  return `Aviso aceptado para ${d.accepted} dispositivo(s).${d.failed ? ` ${d.failed} envío(s) fallaron.` : ""}${d.expired ? ` ${d.expired} suscripción(es) caducadas.` : ""}${!d.accepted && !d.failed && !d.expired ? " Aún no hay dispositivos suscritos." : ""}`;
}
