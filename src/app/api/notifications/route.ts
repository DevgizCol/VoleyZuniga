import { getAdmin, sameOrigin } from "@/lib/auth";
import { clientIp, sharedLimited } from "@/lib/rate-limit";
import { pushConfig } from "@/lib/push/config";
import { pushStore, MAX_SUBSCRIPTIONS } from "@/lib/push/store";
import { sendToDevice } from "@/lib/push/send";
import { subscriptionSchema } from "@/lib/push/validation";

export const runtime = "nodejs";
export const maxDuration = 60;
const reply = (data: unknown, status = 200) => Response.json(data, { status, headers: { "Cache-Control": "no-store" } });

export async function GET() {
  const config = pushConfig();
  return reply({ configured: Boolean(config), publicKey: config?.publicKey || "" });
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return reply({ error: "Solicitud inválida." }, 403);
  if (!pushConfig()) return reply({ error: "Falta configurar las notificaciones. Revisa el panel de administración." }, 503);
  if (await sharedLimited(`push:device:${clientIp(request)}`, 30, 3600000)) return reply({ error: "Demasiados intentos. Espera un momento." }, 429);
  let body;
  try {
    if (Number(request.headers.get("content-length")) > 6000) return reply({ error: "Solicitud demasiado grande." }, 413);
    const reader = request.body?.getReader();
    if (!reader) return reply({ error: "Solicitud inválida." }, 400);
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      size += part.value.byteLength;
      if (size > 6000) { await reader.cancel(); return reply({ error: "Solicitud demasiado grande." }, 413); }
      chunks.push(part.value);
    }
    const raw = Buffer.concat(chunks).toString("utf8");
    body = JSON.parse(raw);
  } catch { return reply({ error: "Solicitud inválida." }, 400); }
  const sub = subscriptionSchema.safeParse(body?.subscription);
  if (!sub.success || !["subscribe", "unsubscribe", "test"].includes(body?.action)) return reply({ error: "Suscripción inválida." }, 400);
  if (body.action === "test") {
    const user = await getAdmin();
    if (!user) return reply({ error: "Entra al admin para enviar una prueba." }, 401);
    if (await sharedLimited(`push:test:${user.name}`, 10, 60000)) return reply({ error: "Espera un minuto antes de repetir la prueba." }, 429);
    const status = await sendToDevice(sub.data, { title: "¡Estamos conectados! · Zúñiga", body: "Prueba enviada desde el admin. Aquí recibirás partidos y noticias del club.", url: "/partidos", tag: "vz-test" });
    return reply(status === "accepted" ? { ok: true, message: "El servicio push aceptó la prueba. Revisa las notificaciones del dispositivo." } : { error: "El servicio no aceptó la prueba. Revisa permisos y vuelve a activar los avisos." }, status === "accepted" ? 200 : 502);
  }
  if (body.action === "subscribe") {
    const stored = await pushStore("list");
    if (!stored.ok) return reply({ error: "El registro no está disponible. Revisa Notificaciones en el admin." }, 503);
    const existing = stored.subscriptions.find(s => s.endpoint === sub.data.endpoint);
    if (existing) {
      if (existing.keys.auth !== sub.data.keys.auth || existing.keys.p256dh !== sub.data.keys.p256dh) return reply({ error: "La suscripción no coincide. Desactiva los avisos y vuelve a activarlos." }, 409);
      return reply({ ok: true });
    }
    if (stored.subscriptions.length >= MAX_SUBSCRIPTIONS) return reply({ error: "Se alcanzó el cupo de dispositivos. Contacta al club." }, 503);
    if ((await sharedLimited(`push:new:${clientIp(request)}`, 10, 3600000)) || (await sharedLimited("push:new:global", 100, 3600000))) return reply({ error: "No podemos registrar más dispositivos ahora. Intenta más tarde." }, 429);
    // Evita reservar plazas con endpoints inventados o caducados. Es un aviso visible tras optar por recibirlos.
    const confirmation = await sendToDevice(sub.data, { title: "Conectando con Zúñiga", body: "Tu navegador puede recibir avisos. La web confirmará cuando la suscripción quede registrada.", url: "/" });
    if (confirmation !== "accepted") return reply({ error: "El servicio push no aceptó esta suscripción. Reintenta la activación o prueba otro navegador." }, 502);
  }
  const saved = await pushStore(body.action === "subscribe" ? "upsert" : "remove", sub.data);
  if (!saved.ok) return reply({ error: saved.error === "capacity" ? "Se alcanzó el cupo de dispositivos. Contacta al club." : "No se pudo actualizar la suscripción. Revisa la conexión y la configuración del admin." }, 503);
  // Nunca devolver el listado privado ni las claves de otros dispositivos.
  return reply({ ok: true });
}
