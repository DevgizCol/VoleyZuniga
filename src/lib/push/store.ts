import "server-only";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { localPushStore } from "./config";
import { subscriptionSchema, type ClubSubscription } from "./validation";

export const MAX_SUBSCRIPTIONS = 200;
type Operation = "list" | "upsert" | "remove" | "prune";
export type StoreResult = { ok: true; subscriptions: ClubSubscription[] } | { ok: false; error: string };
let queue: Promise<unknown> = Promise.resolve();

async function local(operation: Operation, subscription?: ClubSubscription | ClubSubscription[]): Promise<StoreResult> {
  const folder = path.join(process.cwd(), ".local-data");
  const file = path.join(folder, "push-subscriptions.json");
  await mkdir(folder, { recursive: true, mode: 0o700 });
  let subscriptions: ClubSubscription[] = [];
  try { subscriptions = JSON.parse(await readFile(file, "utf8")); }
  catch (e) { if ((e as NodeJS.ErrnoException).code !== "ENOENT") throw e; }
  if (!Array.isArray(subscriptions) || subscriptions.some(s => !subscriptionSchema.safeParse(s).success)) throw new Error("invalid_store");
  if (subscription && operation !== "list") {
    for (const item of Array.isArray(subscription) ? subscription : [subscription]) {
      const existing = subscriptions.find(s => s.endpoint === item.endpoint);
      if (existing && (existing.keys.auth !== item.keys.auth || existing.keys.p256dh !== item.keys.p256dh)) {
        if (operation === "prune") continue; // Una renovación concurrente no bloquea la baja de otras caducadas.
        return { ok: false, error: "subscription_mismatch" };
      }
      subscriptions = subscriptions.filter(s => s.endpoint !== item.endpoint);
      if (operation === "upsert") {
        if (subscriptions.length >= MAX_SUBSCRIPTIONS) return { ok: false, error: "capacity" };
        subscriptions.push(item);
      }
    }
    await writeFile(`${file}.tmp`, JSON.stringify(subscriptions), { mode: 0o600 });
    await rename(`${file}.tmp`, file);
  }
  return { ok: true, subscriptions };
}

export async function pushStore(operation: Operation, subscription?: ClubSubscription | ClubSubscription[]): Promise<StoreResult> {
  try {
    if (localPushStore()) {
      const task = queue.then(() => local(operation, subscription));
      queue = task.catch(() => undefined);
      return await task;
    }
    const url = process.env.SHEETS_WEBAPP_URL;
    const secret = process.env.SHEETS_ADMIN_SECRET;
    if (!url) return { ok: false, error: "not_configured" };
    if (!secret || secret.length < 24 || secret === process.env.SHEETS_SECRET) return { ok: false, error: "dedicated_admin_secret" };
    const response = await fetch(url, {
      method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: `push.${operation}`, secret, subscription }),
      redirect: "follow", cache: "no-store", signal: AbortSignal.timeout(12000),
    });
    if (!response.ok) return { ok: false, error: "network" };
    const result = await response.json();
    if (!result.ok) return { ok: false, error: String(result.error || "backend") };
    const parsed = subscriptionSchema.array().max(MAX_SUBSCRIPTIONS).safeParse(result.subscriptions);
    return parsed.success ? { ok: true, subscriptions: parsed.data } : { ok: false, error: "backend_version" };
  } catch {
    // Los endpoints y claves de los dispositivos nunca se imprimen en logs.
    return { ok: false, error: "storage_unavailable" };
  }
}
