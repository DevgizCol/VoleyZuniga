import { beforeEach, describe, expect, it, vi } from "vitest";

const getAdmin = vi.fn();
vi.mock("@/lib/auth", () => ({ getAdmin }));
const fetchMock = vi.fn(async () => Response.json({ ok: true, headers: ["Nombre"], rows: [] }));
vi.stubGlobal("fetch", fetchMock);
process.env.SHEETS_WEBAPP_URL = "https://script.example/exec";
process.env.SHEETS_SECRET = "s";

const { adminRead, adminMutate } = await import("@/lib/sheets");

describe("lecturas y escrituras del panel exigen sesión", () => {
  beforeEach(() => fetchMock.mockClear());

  it("sin sesión no consulta la hoja", async () => {
    getAdmin.mockResolvedValue(null);
    expect(await adminRead("Inscripciones")).toBeNull();
    expect(await adminMutate({ action: "remove", sheet: "Inscripciones", actor: "x", row: 2 })).toEqual({ ok: false, error: "unauthorized" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("con sesión sí consulta la hoja", async () => {
    getAdmin.mockResolvedValue({ name: "Admin" });
    expect(await adminRead("Inscripciones")).toEqual({ headers: ["Nombre"], rows: [] });
    expect(fetchMock).toHaveBeenCalledOnce();
  });
});
