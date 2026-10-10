import { describe, expect, it } from "vitest";
import { formatOrigin, parseOrigin, sanitizeOrigin } from "@/lib/origin";

describe("parseOrigin", () => {
  it("usa los parámetros utm del enlace", () => {
    const o = parseOrigin("https://club.test/inscripciones?utm_source=Instagram&utm_medium=bio&utm_campaign=Convocatoria 2027", "");
    expect(o).toEqual({ source: "instagram", medium: "bio", campaign: "convocatoria-2027", landing: "/inscripciones" });
    expect(formatOrigin(o)).toBe("instagram / bio / convocatoria-2027 · entrada: /inscripciones");
  });

  it("reconoce redes y buscadores por el sitio anterior", () => {
    expect(parseOrigin("https://club.test/", "https://l.instagram.com/?u=x")?.source).toBe("instagram");
    expect(parseOrigin("https://club.test/", "https://www.google.com.co/")?.source).toBe("google");
    expect(parseOrigin("https://club.test/", "https://blog.ejemplo.co/post")).toMatchObject({ source: "blog.ejemplo.co", medium: "referido" });
  });

  it("marca como directo cuando no hay sitio anterior", () => {
    expect(parseOrigin("https://club.test/partidos", "")).toEqual({ source: "directo", landing: "/partidos" });
  });

  it("ignora la navegación dentro del mismo sitio", () => {
    expect(parseOrigin("https://club.test/partidos", "https://www.club.test/")).toBeNull();
  });
});

describe("sanitizeOrigin", () => {
  it("quita caracteres de control y limita el largo", () => {
    expect(sanitizeOrigin("a\u0000b\r\nc")).toBe("a b c");
    expect(sanitizeOrigin("x".repeat(500))).toHaveLength(200);
    expect(sanitizeOrigin(42)).toBe("");
  });
});
