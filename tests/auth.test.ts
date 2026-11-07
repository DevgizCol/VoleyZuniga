import { beforeEach, describe, expect, it, vi } from "vitest";
import { checkAdminPassword, createDeviceToken, createOtpToken, createSessionToken, deviceTrusted, emailOf, verifyOtp, verifySessionToken } from "@/lib/auth";

beforeEach(() => {
  vi.stubEnv("SESSION_SECRET", "s".repeat(40));
  vi.stubEnv("ADMIN_PASSWORD", "una frase larga y segura");
  vi.stubEnv("ADMIN_USERS", "Profe Carlos:clave-larga-1; Corta:123; Zúñiga:director@club.co:clave:con:dospuntos");
});

describe("contraseña del panel", () => {
  it("reconoce a cada usuario y rechaza las demás", () => {
    expect(checkAdminPassword("una frase larga y segura")).toEqual({ name: "Administrador" });
    expect(checkAdminPassword("clave-larga-1")).toEqual({ name: "Profe Carlos" });
    expect(checkAdminPassword("otra")).toBeNull();
    expect(checkAdminPassword("")).toBeNull();
  });
  it("ignora contraseñas adicionales de menos de 8 caracteres", () => {
    expect(checkAdminPassword("123")).toBeNull();
  });
  it("falla cerrado si el secreto de sesión es corto", () => {
    vi.stubEnv("SESSION_SECRET", "corto");
    expect(checkAdminPassword("una frase larga y segura")).toBeNull();
  });
});

describe("sesión", () => {
  const user = { name: "Profe Carlos" };
  it("valida un token recién creado y conserva el nombre", () => {
    expect(verifySessionToken(createSessionToken(user)!)).toEqual(user);
  });
  it("rechaza tokens alterados, vencidos o firmados con otro secreto", () => {
    const token = createSessionToken(user)!;
    const [role, name, exp, sig] = token.split(".");
    expect(verifySessionToken(`${role}.${name}.${Number(exp) + 1000}.${sig}`)).toBeNull();
    expect(verifySessionToken(`${role}.${name}.1.${sig}`)).toBeNull();
    expect(verifySessionToken(undefined)).toBeNull();
    vi.stubEnv("SESSION_SECRET", "o".repeat(40));
    expect(verifySessionToken(token)).toBeNull();
  });
  it("deja de valer si el usuario se retira de ADMIN_USERS", () => {
    const token = createSessionToken(user)!;
    vi.stubEnv("ADMIN_USERS", "");
    expect(verifySessionToken(token)).toBeNull();
  });
});

describe("usuarios con correo, código y celular reconocido", () => {
  const z = { name: "Zúñiga" };
  it("lee Nombre:correo:clave (la clave puede tener dos puntos) y el formato viejo sin correo", () => {
    expect(checkAdminPassword("clave:con:dospuntos")).toEqual(z);
    expect(emailOf("Zúñiga")).toBe("director@club.co");
    expect(emailOf("Profe Carlos")).toBe("");
  });
  it("el código solo vale con el número correcto, una vez firmado para ese usuario", () => {
    const t = createOtpToken(z, "123456")!;
    expect(verifyOtp(t, "123456")).toEqual(z);
    expect(verifyOtp(t, "123457")).toBeNull();
    expect(verifyOtp(t, "12345")).toBeNull();
    // Un token de código no sirve como sesión ni al revés.
    expect(verifySessionToken(t)).toBeNull();
    expect(verifyOtp(createSessionToken(z)!, "123456")).toBeNull();
  });
  it("el celular reconocido es solo del usuario que lo registró y cae si cambia su clave", () => {
    const d = createDeviceToken(z)!;
    expect(deviceTrusted(d, z)).toBe(true);
    expect(deviceTrusted(d, { name: "Profe Carlos" })).toBe(false);
    vi.stubEnv("ADMIN_USERS", "Zúñiga:director@club.co:otra-clave-larga");
    expect(deviceTrusted(d, z)).toBe(false);
  });
});
