import { describe, expect, it } from "vitest";
import { clientIp, isBlocked, isRateLimited, recordFailure, resetLimit } from "@/lib/rate-limit";

describe("isRateLimited", () => {
  it("deja pasar hasta el máximo y luego bloquea", () => {
    const key = "test:a";
    const now = 1_000_000;
    expect([1, 2, 3].map(() => isRateLimited(key, 2, 60_000, now))).toEqual([false, false, true]);
  });
  it("reinicia la cuenta cuando vence la ventana", () => {
    const key = "test:b";
    isRateLimited(key, 1, 1000, 0);
    expect(isRateLimited(key, 1, 1000, 500)).toBe(true);
    expect(isRateLimited(key, 1, 1000, 1500)).toBe(false);
  });
});

describe("intentos de inicio de sesión", () => {
  it("bloquea tras los fallos y se libera al reiniciar", () => {
    const key = "test:login";
    for (let i = 0; i < 3; i++) recordFailure(key, 60_000, 0);
    expect(isBlocked(key, 3, 10)).toBe(true);
    expect(isBlocked(key, 3, 60_001)).toBe(false);
    resetLimit(key);
    expect(isBlocked(key, 3, 10)).toBe(false);
  });
});

describe("clientIp", () => {
  it("prefiere la cabecera de Vercel, que el cliente no controla", () => {
    const req = new Request("https://x.test", { headers: { "x-vercel-forwarded-for": "5.6.7.8", "x-forwarded-for": "1.2.3.4" } });
    expect(clientIp(req)).toBe("5.6.7.8");
  });
  it("sin cabecera de plataforma usa el último salto de x-forwarded-for (el que añade el proxy)", () => {
    const req = new Request("https://x.test", { headers: { "x-forwarded-for": "1.2.3.4, 10.0.0.1" } });
    expect(clientIp(req)).toBe("10.0.0.1");
  });
});
