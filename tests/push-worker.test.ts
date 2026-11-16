import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { expect, it, vi } from "vitest";

it("el service worker muestra un aviso visible, limita destino y abre la página al tocarlo", async () => {
  const handlers: Record<string, (e: unknown) => void> = {};
  const show = vi.fn().mockResolvedValue(undefined), open = vi.fn().mockResolvedValue(undefined);
  const clients = vi.fn().mockResolvedValue([]);
  const ctx = { self: { addEventListener: (n: string, cb: (e: unknown) => void) => { handlers[n] = cb; }, location: { origin: "https://club.example" }, registration: { showNotification: show }, clients: { matchAll: clients, openWindow: open } }, URL };
  runInNewContext(readFileSync("public/sw.js", "utf8"), ctx);
  let work: Promise<unknown> = Promise.resolve();
  const waitUntil = (p: Promise<unknown>) => { work = p; };
  handlers.push({ data: { json: () => ({ title: "Partido", body: "A las 17:00", url: "https://evil.test" }) }, waitUntil });
  await work; expect(show.mock.calls[0][1].data.url).toBe("/");
  const close = vi.fn();
  handlers.notificationclick({ notification: { close, data: { url: "/partidos" } }, waitUntil });
  await work; expect(close).toHaveBeenCalled(); expect(open).toHaveBeenCalledWith("https://club.example/partidos");
  handlers.push({ data: { json: () => { throw new Error(); } }, waitUntil }); await work;
  expect(show.mock.calls[1][0]).toBe("Club Voley Zúñiga");
  const navigateAdmin = vi.fn();
  clients.mockResolvedValue([{ url: "https://club.example/admin/noticias", navigate: navigateAdmin }]);
  handlers.notificationclick({ notification: { close, data: { url: "/noticias" } }, waitUntil }); await work;
  expect(navigateAdmin).not.toHaveBeenCalled(); expect(open).toHaveBeenLastCalledWith("https://club.example/noticias");
  clients.mockResolvedValue([{ url: "https://club.example/partidos", navigate: async () => { throw new TypeError("not controlled"); } }]);
  handlers.notificationclick({ notification: { close, data: { url: "/partidos" } }, waitUntil }); await work;
  expect(open).toHaveBeenLastCalledWith("https://club.example/partidos");
});
