import { createECDH } from "node:crypto";
import { afterEach, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ send: vi.fn(), store: vi.fn() }));
vi.mock("web-push", () => ({ sendNotification: mocks.send }));
vi.mock("@/lib/push/config", () => ({ pushConfig: () => ({ subject: "mailto:club@example.com", publicKey: "public", privateKey: "private" }) }));
vi.mock("@/lib/push/store", () => ({ pushStore: mocks.store }));
import { broadcastNotice, sendToDevice } from "@/lib/push/send";
const sub = (id: string) => ({ endpoint: `https://fcm.googleapis.com/fcm/send/${id}`, keys: { p256dh: (() => { const ec = createECDH("prime256v1"); ec.generateKeys(); return ec.getPublicKey().toString("base64url"); })(), auth: Buffer.alloc(16, 2).toString("base64url") } });
afterEach(() => vi.resetAllMocks());
it("cuenta aceptados, fallidos y caducados sin confundir aceptación con visualización", async () => {
  const active = sub("active"), expired = sub("expired"), transient = sub("transient");
  mocks.store.mockResolvedValue({ ok: true, subscriptions: [active, expired, transient] });
  mocks.send.mockImplementation(async s => { if (s.endpoint.endsWith("expired")) throw { statusCode: 410 }; if (s.endpoint.endsWith("transient")) throw { statusCode: 503 }; return {}; });
  expect(await broadcastNotice({ title: "Partido", body: "Hoy jugamos", url: "/partidos" })).toEqual({ accepted: 1, expired: 1, failed: 1 });
  expect(mocks.store).toHaveBeenCalledWith("prune", [expired]);
});
it("no envía hacia destinos arbitrarios aunque el registro esté adulterado", async () => {
  expect(await sendToDevice({ ...sub("x"), endpoint: "https://localhost/private" }, { title: "x", body: "y", url: "/" })).toBe("expired");
  expect(mocks.send).not.toHaveBeenCalled();
});
it("un backend sin actualizar produce error y cero envíos", async () => {
  mocks.store.mockResolvedValue({ ok: false, error: "backend_version" });
  expect((await broadcastNotice({ title: "Partido", body: "Hoy jugamos", url: "/partidos" })).error).toBe("backend_version");
  expect(mocks.send).not.toHaveBeenCalled();
});
