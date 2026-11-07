import { describe, expect, it } from "vitest";
import { findByCode } from "@/lib/admin/free-class";

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
