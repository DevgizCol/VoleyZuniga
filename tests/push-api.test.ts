import { createECDH } from "node:crypto";
import { afterEach, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ admin: vi.fn(), store: vi.fn(), send: vi.fn() }));
vi.mock("@/lib/auth", () => ({ getAdmin: mocks.admin, sameOrigin: (r: Request) => r.headers.get("origin") !== "https://evil.test" }));
vi.mock("@/lib/rate-limit", () => ({ clientIp: () => "test", sharedLimited: async () => false }));
vi.mock("@/lib/push/config", () => ({ pushConfig: () => ({ publicKey: "public-key", privateKey: "secret-key" }) }));
vi.mock("@/lib/push/store", () => ({ pushStore: mocks.store, MAX_SUBSCRIPTIONS: 200 }));
vi.mock("@/lib/push/send", () => ({ sendToDevice: mocks.send }));
import { GET, POST } from "@/app/api/notifications/route";
const subscription = { endpoint: "https://fcm.googleapis.com/fcm/send/test", keys: { p256dh: (() => { const ec = createECDH("prime256v1"); ec.generateKeys(); return ec.getPublicKey().toString("base64url"); })(), auth: Buffer.alloc(16, 2).toString("base64url") } };
const request = (action: string, sub = subscription, origin = "http://localhost") => new Request("http://localhost/api/notifications", { method: "POST", headers: { origin }, body: JSON.stringify({ action, subscription: sub }) });
afterEach(() => vi.clearAllMocks());
it("solo publica la clave pública, con no-store", async () => {
  const r = await GET(); expect(await r.json()).toEqual({ configured: true, publicKey: "public-key" }); expect(r.headers.get("cache-control")).toBe("no-store");
});
it("el alta nunca devuelve suscripciones ajenas", async () => {
  mocks.store.mockResolvedValue({ ok: true, subscriptions: [subscription] });
  expect(await (await POST(request("subscribe"))).json()).toEqual({ ok: true });
});
it("rechaza otro origen y endpoints arbitrarios antes de almacenar", async () => {
  expect((await POST(request("subscribe", subscription, "https://evil.test"))).status).toBe(403);
  expect((await POST(request("subscribe", { ...subscription, endpoint: "https://localhost/secret" }))).status).toBe(400);
  expect(mocks.store).not.toHaveBeenCalled();
});
it("una prueba exige sesión administrativa y solo envía al dispositivo solicitado", async () => {
  mocks.admin.mockResolvedValue(null); expect((await POST(request("test"))).status).toBe(401);
  expect(mocks.send).not.toHaveBeenCalled();
  mocks.admin.mockResolvedValue({ name: "Admin" }); mocks.send.mockResolvedValue("accepted");
  expect((await POST(request("test"))).status).toBe(200);
  expect(mocks.send.mock.calls[0][0]).toEqual(subscription);
});
it("no reserva cupo para un endpoint que el proveedor rechaza", async () => {
  mocks.store.mockResolvedValue({ ok: true, subscriptions: [] });
  mocks.send.mockResolvedValue("expired");
  expect((await POST(request("subscribe"))).status).toBe(502);
  expect(mocks.store).toHaveBeenCalledTimes(1);
  expect(mocks.store).toHaveBeenCalledWith("list");
  mocks.store.mockClear(); mocks.send.mockResolvedValue("accepted");
  expect((await POST(request("subscribe"))).status).toBe(200);
  expect(mocks.store).toHaveBeenCalledWith("upsert", subscription);
});
it("acota el cuerpo incluso sin Content-Length", async () => {
  const r = new Request("http://localhost/api/notifications", { method: "POST", body: "x".repeat(6001) });
  expect((await POST(r)).status).toBe(413);
});
