import { describe, expect, it } from "vitest";
import { imageUrl, normDate, normTime, slugify } from "@/lib/sheet-values";

describe("normDate", () => {
  it("acepta AAAA-MM-DD tal cual", () => expect(normDate("2026-03-07")).toBe("2026-03-07"));
  it("convierte DD/MM/AAAA de la hoja en español", () => expect(normDate(" 7/3/2026 ")).toBe("2026-03-07"));
  it("descarta texto que no es fecha", () => {
    expect(normDate("mañana")).toBe("");
    expect(normDate("")).toBe("");
  });
});

describe("normTime", () => {
  it("completa la hora con cero", () => expect(normTime("7:05")).toBe("07:05"));
  it("ignora los segundos", () => expect(normTime("19:30:00")).toBe("19:30"));
  it("devuelve vacío sin hora", () => expect(normTime("Por confirmar")).toBe(""));
});

describe("imageUrl", () => {
  const id = "1AbCdEfGhIjKlMnOpQrStUvWxYz012345";
  it("convierte enlaces de Drive en imagen directa", () => {
    expect(imageUrl(`https://drive.google.com/file/d/${id}/view?usp=sharing`)).toBe(`https://lh3.googleusercontent.com/d/${id}=w1600`);
    expect(imageUrl(`https://drive.google.com/open?id=${id}`, 800)).toBe(`https://lh3.googleusercontent.com/d/${id}=w800`);
    expect(imageUrl(`https://drive.google.com/uc?export=view&id=${id}`)).toContain(id);
  });
  it("deja pasar otras URL https", () => expect(imageUrl("https://ejemplo.com/a.jpg")).toBe("https://ejemplo.com/a.jpg"));
  it("descarta http y esquemas peligrosos", () => {
    expect(imageUrl("http://ejemplo.com/a.jpg")).toBe("");
    expect(imageUrl("javascript:alert(1)")).toBe("");
  });
});

describe("slugify", () => {
  it("quita tildes, eñes y signos", () => expect(slugify("¡Campeones Sub-16 en Zúñiga!")).toBe("campeones-sub-16-en-zuniga"));
  it("limita la longitud", () => expect(slugify("a".repeat(100))).toHaveLength(70));
});
