import "server-only";
import { localPushStore } from "./config";

/** Registro del comunicado en el Historial existente, usando únicamente la operación nueva push.audit. */
export async function auditPushNotice(actor: string, detail: string): Promise<void> {
  if (localPushStore()) return;
  const url = process.env.SHEETS_WEBAPP_URL;
  const secret = process.env.SHEETS_ADMIN_SECRET;
  if (!url || !secret || secret.length < 24 || secret === process.env.SHEETS_SECRET) return;
  try {
    await fetch(url, {
      method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "push.audit", secret, actor: actor.slice(0, 60), detail: detail.slice(0, 500) }),
      cache: "no-store", redirect: "follow", signal: AbortSignal.timeout(3000),
    });
  } catch { /* No repetir un comunicado porque falle su registro de auditoría. */ }
}
