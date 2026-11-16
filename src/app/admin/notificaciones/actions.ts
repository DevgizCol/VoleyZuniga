"use server";

import { randomUUID } from "node:crypto";
import { getAdmin } from "@/lib/auth";
import { consumePushOnce } from "@/lib/push/once";
import { sharedLimited } from "@/lib/rate-limit";
import { broadcastNotice, deliveryText } from "@/lib/push/send";
import { noticeSchema } from "@/lib/push/validation";
import { auditPushNotice } from "@/lib/push/audit";

export type NoticeState = { ok: boolean; message: string; id: string };
export async function publishNotice(previous: NoticeState, form: FormData): Promise<NoticeState> {
  const user = await getAdmin();
  if (!user) return { ...previous, ok: false, message: "Tu sesión expiró. Vuelve a entrar." };
  const parsed = noticeSchema.safeParse({ title: form.get("title"), body: form.get("body"), url: form.get("url") });
  if (!parsed.success) return { ...previous, ok: false, message: "Revisa el título (3–100 caracteres), mensaje (3–240) y destino." };
  if (form.get("confirm") !== "on") return { ...previous, ok: false, message: "Confirma el envío a los dispositivos suscritos." };
  if (await sharedLimited(`push:broadcast:${user.name}`, 10, 600000)) return { ...previous, ok: false, message: "Ya enviaste varios avisos. Espera unos minutos." };
  if (!/^[a-f0-9-]{36}$/.test(previous.id) || !(await consumePushOnce(`push:notice:${user.name}:${previous.id}`, 600000))) return { ok: false, message: "Esta solicitud ya se procesó. Revisa el resultado antes de enviar otra.", id: randomUUID() };
  const delivery = await broadcastNotice(parsed.data);
  if (!delivery.error) await auditPushNotice(user.name, `Notificación web: ${parsed.data.title}; aceptados=${delivery.accepted}, fallidos=${delivery.failed}, caducados=${delivery.expired}`);
  return { ok: !delivery.error && !delivery.failed, message: delivery.error ? "No se pudo enviar el aviso. Revisa la configuración de notificaciones." : deliveryText(delivery), id: randomUUID() };
}
