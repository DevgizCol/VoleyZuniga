import { afterEach, expect, it, vi } from "vitest";
const limited = vi.hoisted(() => vi.fn());
vi.mock("@/lib/rate-limit", () => ({ sharedLimited: limited }));
import { consumePushOnce } from "@/lib/push/once";
import { pushClientError } from "@/lib/push/client-errors";
afterEach(() => vi.resetAllMocks());
it("el bloqueo de registro explica el fallo de Brave sin fingir activación", () => {
  const error = new Error("Registration failed - push service error");
  expect(pushClientError(error, true)).toContain("No se completó la suscripción");
  expect(pushClientError(error, true)).toContain("Brave");
  expect(pushClientError(error)).toContain("El navegador");
  expect(pushClientError(new Error("Registro no disponible"))).toBe("Registro no disponible");
});
it("idempotencia nueva usa el limitador existente sin modificar autenticación", async () => {
  limited.mockResolvedValueOnce(false).mockResolvedValueOnce(true);
  expect(await consumePushOnce("abc", 1000)).toBe(true);
  expect(await consumePushOnce("abc", 1000)).toBe(false);
  expect(limited.mock.calls[0]).toEqual([expect.stringMatching(/^push:once:[A-Za-z0-9_-]+$/), 1, 1000]);
});
