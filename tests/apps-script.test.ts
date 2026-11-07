import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it } from "vitest";

// Carga el Apps Script real para probar funciones puras (sin servicios de Google).
const ctx: Record<string, unknown> = {};
runInNewContext(readFileSync("docs/google-sheets/Code.gs", "utf8"), ctx);
const build = ctx.buildRowByHeaders_ as (h: string[], f: string[], a: string[], d: Record<string, string>, s: string) => string[] | null;
const fields = ["Nombre", "Edad", "Categoría", "Nivel", "Sede", "Horario", "WhatsApp", "Consentimiento"];
const data = { Nombre: "DevGiz", Edad: "21", Categoría: "Mayores Élite", Nivel: "Alta", Sede: "Coliseo", Horario: "Viernes", WhatsApp: "3053261466", Consentimiento: "Sí", Código: "VZMY-22J8", Origen: "directo" };

describe("buildRowByHeaders_ (Code.gs)", () => {
  it("escribe cada dato bajo su encabezado aunque Origen y Clase gratis estén al inicio", () => {
    const headers = ["Fecha", "Origen", "Clase gratis", ...fields, "Estado", "Código", "Notas"];
    const row = build(headers, fields, ["Código"], data, "2026-11-06 21:24:03")!;
    const at = (h: string) => row[headers.indexOf(h)];
    expect(at("Nombre")).toBe("DevGiz");
    expect(at("Origen")).toBe("directo");
    expect(at("Código")).toBe("VZMY-22J8");
    expect(at("Estado")).toBe("Nuevo");
    expect(at("Clase gratis")).toBe("");
  });
  it("funciona igual con el orden clásico", () => {
    const headers = ["Fecha", ...fields, "Estado", "Código", "Notas", "Origen", "Clase gratis"];
    const row = build(headers, fields, ["Código"], data, "t")!;
    expect(row.slice(0, 11)).toEqual(["t", "DevGiz", "21", "Mayores Élite", "Alta", "Coliseo", "Viernes", "3053261466", "Sí", "Nuevo", "VZMY-22J8"]);
  });
  it("devuelve null si falta un encabezado esperado (se usa el orden fijo)", () => {
    expect(build(["Fecha", "Nombre", "Estado"], fields, ["Código"], data, "t")).toBeNull();
  });
});
