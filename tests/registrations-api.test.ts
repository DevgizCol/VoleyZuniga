import { beforeEach, describe, expect, it, vi } from "vitest";

const appendToSheet = vi.fn(async () => true);
vi.mock("@/lib/sheets", () => ({ appendToSheet, sheetsConfigured: () => true }));

const { POST } = await import("@/app/api/registrations/route");

let ip = 0;
const send = (body: unknown) =>
  POST(new Request("https://x.test/api/registrations", {
    method: "POST",
    // Una IP distinta por prueba para no chocar con el límite de peticiones.
    headers: { "content-type": "application/json", "x-forwarded-for": `10.0.0.${++ip}` },
    body: JSON.stringify(body),
  }));

const valid = {
  name: "Sara Gómez",
  age: 13,
  category: "Infantil Sub-14",
  level: "Iniciación Formativa",
  sede: "Polideportivo 3 Canchas",
  horario: "Martes y Jueves (5:30 PM – 7:00 PM)",
  phone: "312 845 9210",
  consent: true,
  code: "vz14-4fgr",
};

beforeEach(() => appendToSheet.mockClear());

describe("POST /api/registrations", () => {
  it("guarda una inscripción válida con el código en mayúsculas", async () => {
    const res = await send(valid);
    expect(res.status).toBe(200);
    expect(appendToSheet).toHaveBeenCalledWith("Inscripciones", expect.objectContaining({ Nombre: "Sara Gómez", Código: "VZ14-4FGR" }));
  });

  it.each([
    ["sin consentimiento", { consent: false }],
    ["edad fuera de rango", { age: 3 }],
    ["categoría inventada", { category: "Pro" }],
    ["teléfono inválido", { phone: "abc" }],
    ["nombre vacío", { name: " " }],
  ])("rechaza: %s", async (_, change) => {
    const res = await send({ ...valid, ...change });
    expect(res.status).toBe(400);
    expect(appendToSheet).not.toHaveBeenCalled();
  });

  it("descarta en silencio a los bots que llenan el campo trampa", async () => {
    const res = await send({ ...valid, website: "spam.com" });
    expect(res.status).toBe(200);
    expect(appendToSheet).not.toHaveBeenCalled();
  });

  it("no guarda códigos con formato extraño", async () => {
    await send({ ...valid, code: "=HYPERLINK()" });
    expect(appendToSheet).toHaveBeenCalledWith("Inscripciones", expect.objectContaining({ Código: "" }));
  });

  it("limita las solicitudes repetidas desde la misma IP", async () => {
    const req = () => POST(new Request("https://x.test", { method: "POST", headers: { "x-forwarded-for": "9.9.9.9" }, body: "{}" }));
    const statuses = [];
    for (let i = 0; i < 6; i++) statuses.push((await req()).status);
    expect(statuses.slice(0, 5).every((s) => s === 400)).toBe(true);
    expect(statuses[5]).toBe(429);
  });
});
