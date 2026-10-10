import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { adminRead, readSheet } from "@/lib/sheets";

const MAIN = "clave-principal-de-prueba-123456";
const READ = "clave-de-lectura-de-prueba-123456";

const fetchMock = vi.fn();
const reply = (body: unknown) => new Response(JSON.stringify(body), { status: 200 });

beforeEach(() => {
  vi.stubEnv("SHEETS_WEBAPP_URL", "https://script.test/exec");
  vi.stubEnv("SHEETS_SECRET", MAIN);
  vi.stubGlobal("fetch", fetchMock);
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  fetchMock.mockReset();
});

describe("claves de la hoja", () => {
  it("lee las pestañas públicas con la clave de lectura en la dirección", async () => {
    vi.stubEnv("SHEETS_READ_SECRET", READ);
    fetchMock.mockResolvedValueOnce(reply({ ok: true, rows: [{ Equipo: "Zúñiga" }] }));
    expect(await readSheet("Tabla")).toEqual([{ Equipo: "Zúñiga" }]);
    const url = String(fetchMock.mock.calls[0][0]);
    expect(url).toContain(`secret=${READ}`);
    expect(url).not.toContain(MAIN);
  });

  it("el panel lee por POST: la clave principal no va en la dirección", async () => {
    fetchMock.mockResolvedValueOnce(reply({ ok: true, headers: ["Nombre"], rows: [{ Nombre: "Sara", _row: "2" }] }));
    const table = await adminRead("Inscripciones");
    expect(table?.rows).toHaveLength(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).not.toContain(MAIN);
    expect(JSON.parse(init.body)).toMatchObject({ action: "admin.read", sheet: "Inscripciones", all: true, secret: MAIN });
  });

  it("si el Apps Script publicado es el anterior, vuelve a la lectura de antes", async () => {
    fetchMock
      .mockResolvedValueOnce(reply({ ok: false, error: "bad_action" }))
      .mockResolvedValueOnce(reply({ ok: true, headers: ["Nombre"], rows: [{ Nombre: "Sara", _row: "2" }] }));
    const table = await adminRead("Inscripciones");
    expect(table?.rows[0].Nombre).toBe("Sara");
    expect(String(fetchMock.mock.calls[1][0])).toContain("all=1");
  });
});
