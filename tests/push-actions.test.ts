import { afterEach, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ admin: vi.fn(), mutate: vi.fn(), broadcast: vi.fn() }));
vi.mock("next/cache", () => ({ updateTag: vi.fn(), revalidatePath: vi.fn() }));
vi.mock("@/lib/auth", () => ({ getAdmin: mocks.admin }));
vi.mock("@/lib/sheets", () => ({ adminMutate: mocks.mutate, adminRead: vi.fn(), sheetTag: (s: string) => s }));
vi.mock("@/lib/rate-limit", () => ({ sharedLimited: async () => false }));
vi.mock("@/lib/push/send", () => ({ broadcastNotice: mocks.broadcast, deliveryText: () => "Aviso aceptado." }));
import { quickCourt, saveRow } from "@/app/admin/actions";
const form = (notify = true, active = true) => {
  const f = new FormData();
  for (const [k, v] of Object.entries({ _sheet: "Noticias", _hasActivo: "1", Fecha: "2026-11-15", Título: "Nueva convocatoria", Categoría: "Club", Resumen: "Nos vemos el sábado", Cuerpo: "Texto de prueba", "Imagen (URL)": "", ...(notify ? { _notify: "on" } : {}), ...(active ? { Activo: "on" } : {}) })) f.set(k, v);
  return f;
};
afterEach(() => vi.resetAllMocks());
it("publicar y notificar solo ocurre después de guardar con sesión válida", async () => {
  mocks.admin.mockResolvedValue({ name: "Administrador" }); mocks.mutate.mockResolvedValue({ ok: true }); mocks.broadcast.mockResolvedValue({ accepted: 1, failed: 0, expired: 0 });
  expect((await saveRow({ ok: false }, form())).message).toContain("Aviso aceptado");
  expect(mocks.broadcast).toHaveBeenCalledWith(expect.objectContaining({ title: "Nueva convocatoria", url: "/noticias" }));
  expect(mocks.mutate.mock.invocationCallOrder[0]).toBeLessThan(mocks.broadcast.mock.invocationCallOrder[0]);
});
it("sin sesión, con fallo de guardado, en borrador o sin casilla nunca envía", async () => {
  mocks.admin.mockResolvedValue(null); await saveRow({ ok: false }, form());
  mocks.admin.mockResolvedValue({ name: "Administrador" }); mocks.mutate.mockResolvedValue({ ok: false, error: "conflict" }); await saveRow({ ok: false }, form());
  mocks.mutate.mockResolvedValue({ ok: true }); await saveRow({ ok: false }, form(true, false)); await saveRow({ ok: false }, form(false));
  expect(mocks.broadcast).not.toHaveBeenCalled();
});
it("el aviso rápido de cancha notifica solo si se pidió", async () => {
  mocks.admin.mockResolvedValue({ name: "Administrador" }); mocks.mutate.mockResolvedValue({ ok: true }); mocks.broadcast.mockResolvedValue({ accepted: 1, failed: 0, expired: 0 });
  await quickCourt(null, null, "Coliseo", "Lluvia", "Hoy no hay entrenamiento");
  expect(mocks.broadcast).not.toHaveBeenCalled();
  expect((await quickCourt(null, null, "Coliseo", "Lluvia", "Hoy no hay entrenamiento", true)).message).toContain("Aviso aceptado");
  expect(mocks.broadcast).toHaveBeenCalledWith(expect.objectContaining({ title: "Lluvia · Coliseo", url: "/" }));
});
