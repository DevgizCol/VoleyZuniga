import { beforeEach, describe, expect, it, vi } from "vitest";
import { checkAdminPassword, createSessionToken, verifySessionToken } from "@/lib/auth";

beforeEach(() => {
  vi.stubEnv("SESSION_SECRET", "s".repeat(40));
  vi.stubEnv("ADMIN_PASSWORD", "una frase larga y segura");
});

describe("contraseña del panel", () => {
  it("acepta la correcta y rechaza las demás", () => {
    expect(checkAdminPassword("una frase larga y segura")).toBe(true);
    expect(checkAdminPassword("otra")).toBe(false);
    expect(checkAdminPassword("")).toBe(false);
  });
  it("falla cerrado si falta la configuración", () => {
    vi.stubEnv("ADMIN_PASSWORD", "");
    expect(checkAdminPassword("")).toBe(false);
    vi.stubEnv("ADMIN_PASSWORD", "x");
    vi.stubEnv("SESSION_SECRET", "corto");
    expect(checkAdminPassword("x")).toBe(false);
  });
});

describe("sesión", () => {
  it("valida un token recién creado", () => {
    expect(verifySessionToken(createSessionToken()!)).toBe(true);
  });
  it("rechaza tokens alterados, vencidos o firmados con otro secreto", () => {
    const token = createSessionToken()!;
    const [role, exp, sig] = token.split(".");
    expect(verifySessionToken(`${role}.${Number(exp) + 1000}.${sig}`)).toBe(false);
    expect(verifySessionToken(`${role}.1.${sig}`)).toBe(false);
    expect(verifySessionToken(undefined)).toBe(false);
    vi.stubEnv("SESSION_SECRET", "o".repeat(40));
    expect(verifySessionToken(token)).toBe(false);
  });
});
