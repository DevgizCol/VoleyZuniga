import { createECDH } from "node:crypto";
import { generateVAPIDKeys } from "web-push";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import { afterEach, describe, expect, it, vi } from "vitest";
import { subscriptionSchema } from "@/lib/push/validation";
import { pushConfig } from "@/lib/push/config";
import { noticeForRow } from "@/lib/push/events";
import { pushStore } from "@/lib/push/store";

const sub = { endpoint: "https://fcm.googleapis.com/fcm/send/device-test", keys: { p256dh: (() => { const ec = createECDH("prime256v1"); ec.generateKeys(); return ec.getPublicKey().toString("base64url"); })(), auth: Buffer.alloc(16, 2).toString("base64url") } };
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllEnvs(); });

describe("Web Push: fronteras públicas y configuración", () => {
  it("solo permite servicios push conocidos, nunca localhost, credenciales ni dominios parecidos", () => {
    expect(subscriptionSchema.safeParse(sub).success).toBe(true);
    for (const endpoint of ["http://fcm.googleapis.com/a", "https://127.0.0.1/a", "https://169.254.169.254/a", "https://fcm.googleapis.com.evil.test/a", "https://x@fcm.googleapis.com/a", "https://fcm.googleapis.com:8443/a", "https://fcm.googleapis.com/a#x"]) {
      expect(subscriptionSchema.safeParse({ ...sub, endpoint }).success).toBe(false);
    }
    for (const endpoint of ["https://web.push.apple.com/token", "https://updates.push.services.mozilla.com/wpush/v2/token", "https://db5.notify.windows.com/token"]) expect(subscriptionSchema.safeParse({ ...sub, endpoint }).success).toBe(true);
  });
  it("rechaza claves de tamaño inválido y elimina campos ajenos", () => {
    expect(subscriptionSchema.safeParse({ ...sub, keys: { ...sub.keys, auth: "short" } }).success).toBe(false);
    expect(subscriptionSchema.parse({ ...sub, extra: "private" })).not.toHaveProperty("extra");
    expect(subscriptionSchema.safeParse({ ...sub, keys: { ...sub.keys, p256dh: Buffer.alloc(65, 4).toString("base64url") } }).success).toBe(false);
  });
  it("exige un par VAPID coherente y un contacto", () => {
    const a = generateVAPIDKeys(), b = generateVAPIDKeys();
    vi.stubEnv("VAPID_PUBLIC_KEY", a.publicKey); vi.stubEnv("VAPID_PRIVATE_KEY", a.privateKey); vi.stubEnv("VAPID_SUBJECT", "mailto:club@example.com");
    expect(pushConfig()?.publicKey).toBe(a.publicKey);
    vi.stubEnv("VAPID_PRIVATE_KEY", b.privateKey); expect(pushConfig()).toBeNull();
  });
});

describe("Eventos de publicación", () => {
  const match = { Fecha: "2026-11-20", Hora: "17:00", Categoría: "Sub-18", Local: "Zúñiga", Visitante: "Rival", Sede: "Coliseo", Estado: "Programado", Resultado: "", Activo: "" };
  it("avisa de nuevas fechas y cambios de sede o resultado", () => {
    expect(noticeForRow("Fixture", match)?.body).toContain("17:00");
    expect(noticeForRow("Fixture", { ...match, Sede: "Otra sede" }, match)?.title).toContain("actualizado");
    expect(noticeForRow("Fixture", { ...match, Resultado: "3-1" }, match)?.body).toContain("3-1");
  });
  it("no envía borradores, otras hojas ni guardados sin cambios", () => {
    expect(noticeForRow("Fixture", { ...match, Activo: "NO" })).toBeNull();
    expect(noticeForRow("Fixture", match, { ...match })).toBeNull();
    expect(noticeForRow("Inscripciones", match)).toBeNull();
    expect(noticeForRow("Noticias", { Título: "Convocatoria", Activo: "NO" })).toBeNull();
    expect(noticeForRow("Noticias", { Título: "Convocatoria", Activo: "" }, { Título: "Convocatoria", Activo: "NO" })?.url).toBe("/noticias");
  });
});

describe("Registro privado", () => {
  it("persiste en desarrollo, deduplica y exige las claves originales para retirar un dispositivo", async () => {
    const folder = await mkdtemp(`${os.tmpdir()}/vz-push-`);
    vi.spyOn(process, "cwd").mockReturnValue(folder); vi.stubEnv("NODE_ENV", "development"); vi.stubEnv("VERCEL", "");
    try {
      await pushStore("upsert", sub); await pushStore("upsert", sub);
      const list = await pushStore("list");
      expect(list.ok && list.subscriptions.length).toBe(1);
      const forged = { ...sub, keys: { ...sub.keys, auth: Buffer.alloc(16, 3).toString("base64url") } };
      expect((await pushStore("remove", forged)).ok).toBe(false);
      await pushStore("prune", [sub]);
      const empty = await pushStore("list"); expect(empty.ok && empty.subscriptions).toEqual([]);
    } finally { await rm(folder, { recursive: true, force: true }); }
  });
  it("producción falla cerrada sin backend, sin recurrir al disco", async () => {
    vi.stubEnv("NODE_ENV", "production"); vi.stubEnv("SHEETS_WEBAPP_URL", "");
    expect(await pushStore("list")).toEqual({ ok: false, error: "not_configured" });
  });
  it("el registro push exige un secreto admin distinto del público", async () => {
    vi.stubEnv("NODE_ENV", "production"); vi.stubEnv("SHEETS_WEBAPP_URL", "https://script.google.com/macros/s/test/exec");
    vi.stubEnv("SHEETS_SECRET", "public-secret-not-valid-for-push"); vi.stubEnv("SHEETS_ADMIN_SECRET", "");
    expect(await pushStore("list")).toEqual({ ok: false, error: "dedicated_admin_secret" });
  });
  it("una purga conserva una renovación y sigue borrando otras caducadas", async () => {
    const folder = await mkdtemp(`${os.tmpdir()}/vz-push-prune-`);
    vi.spyOn(process, "cwd").mockReturnValue(folder); vi.stubEnv("NODE_ENV", "development"); vi.stubEnv("VERCEL", "");
    try {
      const other = { ...sub, endpoint: `${sub.endpoint}-other` };
      await pushStore("upsert", sub); await pushStore("upsert", other);
      const older = { ...sub, keys: { ...sub.keys, auth: Buffer.alloc(16, 3).toString("base64url") } };
      const result = await pushStore("prune", [older, other]);
      expect(result.ok && result.subscriptions).toEqual([sub]);
    } finally { await rm(folder, { recursive: true, force: true }); }
  });
});
