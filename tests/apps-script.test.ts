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

describe("rowsToPurge_ (Code.gs, Ley 1581)", () => {
  const purge = ctx.rowsToPurge_ as (h: string[], v: string[][], cutoff: string) => number[];
  const headers = ["Origen", "Fecha", "Nombre", "Estado"]; // Fecha fuera de la columna A a propósito
  const values = [
    ["directo", "2026-01-10 10:00:00", "Viejo sin matrícula", "Descartado"],
    ["directo", "2026-01-11 10:00:00", "Viejo matriculado", "Matriculado"],
    ["directo", "2026-10-01 10:00:00", "Reciente", "Nuevo"],
    ["directo", "", "Sin fecha", "Nuevo"],
    ["directo", "2026-02-01 09:00:00", "Viejo nuevo", "Nuevo"],
  ];
  it("borra solo lo anterior al corte que no está Matriculado, de abajo hacia arriba", () => {
    expect(purge(headers, values, "2026-05-06")).toEqual([6, 2]);
  });
  it("no borra nada si falta Fecha o Estado", () => {
    expect(purge(["Nombre", "Estado"], values, "2026-05-06")).toEqual([]);
  });
});

describe("clean_ (Code.gs)", () => {
  const clean = ctx.clean_ as (v: unknown, max?: number) => string;
  it("neutraliza fórmulas al inicio y deja el texto normal", () => {
    expect(clean("=HYPERLINK(\"x\")")).toBe("'=HYPERLINK(\"x\")");
    expect(clean("@SUM(A1)")).toBe("'@SUM(A1)");
    expect(clean("Sí (2026-11-06) · autoriza Ana")).toBe("Sí (2026-11-06) · autoriza Ana");
  });
});

describe("loginCodeEmail_ (Code.gs)", () => {
  const mail = ctx.loginCodeEmail_ as (n: string, c: string, e: string, u: string) => { subject: string; plain: string; html: string };
  it("pone el código al inicio del asunto, saluda por el primer nombre y escapa el HTML", () => {
    const m = mail("DanielG <b>x</b>", "982132", "12:23 a. m.", "https://voleyzuniga.co");
    expect(m.subject.startsWith("982132 ")).toBe(true);
    expect(m.html).toContain("Hola DanielG,");
    expect(m.html).not.toContain("<b>x</b>");
    expect(m.html).toContain("https://voleyzuniga.co/email-logo.png");
    expect(m.plain).toContain("Vence a las 12:23 a. m.");
  });
  it("sin SITE_URL https no pone el logo", () => {
    expect(mail("Ana", "000111", "1:00 p. m.", "").html).not.toContain("email-logo.png");
  });
});
