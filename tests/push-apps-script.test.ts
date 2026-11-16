import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { expect, it, vi } from "vitest";
const code = readFileSync("docs/google-sheets/Code.gs", "utf8");
const subscription = { endpoint: "https://fcm.googleapis.com/fcm/send/test", keys: { p256dh: Buffer.alloc(65, 4).toString("base64url"), auth: Buffer.alloc(16, 2).toString("base64url") } };

it("Apps Script exige la clave admin para listar dispositivos, no basta SHARED_SECRET", () => {
  const ctx: Record<string, unknown> = { PropertiesService: { getScriptProperties: () => ({ getProperty: (key: string) => key === "ADMIN_SECRET" ? "a".repeat(32) : key === "SHARED_SECRET" ? "p".repeat(32) : "" }) }, ContentService: { MimeType: { JSON: "json" }, createTextOutput: (s: string) => ({ setMimeType: () => JSON.parse(s) }) } };
  runInNewContext(code, ctx);
  const handler = vi.fn().mockReturnValue({ ok: true, subscriptions: [] }); ctx.pushAction_ = handler;
  const post = ctx.doPost as (e: unknown) => unknown;
  expect(post({ postData: { contents: JSON.stringify({ action: "push.list", secret: "p".repeat(32) }) } })).toEqual({ ok: false, error: "unauthorized" });
  expect(handler).not.toHaveBeenCalled();
  expect(post({ postData: { contents: JSON.stringify({ action: "push.list", secret: "a".repeat(32) }) } })).toEqual({ ok: true, subscriptions: [] });
});

it("Apps Script guarda, deduplica y elimina bajo lock sin exponer el registro en lecturas públicas", () => {
  let rows: unknown[][] = [];
  const release = vi.fn();
  const sheet = { getLastRow: () => rows.length + 1, appendRow: vi.fn(), getRange: (r: number, _c: number, length: number) => ({ getValues: () => rows.slice(r - 2, r - 2 + length), clearContent: () => { rows.splice(r - 2, length); }, setNumberFormat() { return this; }, setValues: (v: unknown[][]) => { rows = v; } }) };
  const ctx: Record<string, unknown> = { SpreadsheetApp: { getActiveSpreadsheet: () => ({ getSheetByName: () => sheet }) }, LockService: { getScriptLock: () => ({ waitLock: vi.fn(), releaseLock: release }) } };
  runInNewContext(code, ctx);
  const action = ctx.pushAction_ as (b: unknown) => { ok: boolean; subscriptions: unknown[]; error?: string };
  expect(action({ action: "push.upsert", subscription }).ok).toBe(true);
  expect(action({ action: "push.upsert", subscription }).subscriptions).toHaveLength(1);
  expect(action({ action: "push.remove", subscription: { ...subscription, keys: { ...subscription.keys, auth: "A".repeat(22) } } }).error).toBe("subscription_mismatch");
  const other = { ...subscription, endpoint: `${subscription.endpoint}-other` };
  action({ action: "push.upsert", subscription: other });
  expect(action({ action: "push.prune", subscription: [{ ...subscription, keys: { ...subscription.keys, auth: "A".repeat(22) } }, other] }).subscriptions).toHaveLength(1);
  expect(action({ action: "push.prune", subscription: [subscription] }).subscriptions).toHaveLength(0);
  expect(ctx.READABLE).not.toContain("PushSuscripciones"); expect(ctx.PRIVATE_READABLE).not.toContain("PushSuscripciones"); expect(release).toHaveBeenCalled();
});
