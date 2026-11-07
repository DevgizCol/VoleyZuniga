import { describe, expect, it } from "vitest";
import { findByCode, funnel } from "@/lib/admin/free-class";

const rows = [
  { _row: "2", Nombre: "Ana", Código: "VZ14-ABCD" },
  { _row: "3", Nombre: "Luis", Código: " vz16-wxyz " },
];

describe("findByCode", () => {
  it("encuentra el código sin importar mayúsculas ni espacios", () => {
    expect(findByCode(rows, "vz14-abcd")?.Nombre).toBe("Ana");
    expect(findByCode(rows, "VZ16-WXYZ")?.Nombre).toBe("Luis");
  });
  it("no encuentra códigos vacíos ni inexistentes", () => {
    expect(findByCode(rows, "  ")).toBeUndefined();
    expect(findByCode(rows, "VZ14-0000")).toBeUndefined();
  });
});

describe("funnel", () => {
  it("cuenta inscritos, clase gratis y matriculados en total y por origen", () => {
    const { total, porOrigen } = funnel([
      { Origen: "instagram", "Clase gratis": "2026-11-07 · Profe", Estado: "Matriculado" },
      { Origen: "Instagram", "Clase gratis": "", Estado: "Nuevo" },
      { Origen: "", "Clase gratis": "2026-11-08 · Profe", Estado: "Contactado" },
    ]);
    expect(total).toEqual({ origen: "Total", inscritos: 3, asistieron: 2, matriculados: 1 });
    expect(porOrigen[0]).toEqual({ origen: "instagram", inscritos: 2, asistieron: 1, matriculados: 1 });
    expect(porOrigen[1]).toMatchObject({ origen: "sin dato", inscritos: 1, asistieron: 1 });
  });
});
