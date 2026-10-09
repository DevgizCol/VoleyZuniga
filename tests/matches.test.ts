import { describe, expect, it, vi } from "vitest";

const rows = [
  { Fecha: "15/11/2026", Hora: "9:00", Categoría: "Juvenil Sub-18", Local: "Voley Zúñiga", Visitante: "Club Rival", Sede: "Coliseo", Estado: "", Resultado: "3-1" },
  { Fecha: "2026-11-01", Hora: "", Categoría: "Menores Sub-16", Local: "Otro Club", Visitante: "Voley Zuniga", Sede: "", Estado: "", Resultado: "3 – 0" },
  { Fecha: "2026-12-01", Hora: "16:30", Categoría: "Mayores Élite", Local: "A", Visitante: "B", Sede: "", Estado: "Programado", Resultado: "" },
  { Fecha: "sin fecha", Local: "X", Visitante: "Y" },
];
vi.mock("@/lib/sheets", () => ({ readSheet: async () => rows }));

const { getMatches, time12, daysUntil } = await import("@/lib/matches");

describe("getMatches", () => {
  it("normaliza, ordena y calcula el resultado del club", async () => {
    const m = (await getMatches())!;
    expect(m.map((x) => x.date)).toEqual(["2026-11-01", "2026-11-15", "2026-12-01"]);
    expect(m[0]).toMatchObject({ clubPlays: true, clubIsHome: false, finished: true, outcome: "loss" });
    expect(m[1]).toMatchObject({ time: "09:00", clubIsHome: true, outcome: "win" });
    expect(m[2]).toMatchObject({ clubPlays: false, finished: false, outcome: null });
  });
});

describe("formato", () => {
  it("time12", () => {
    expect(time12("00:15")).toBe("12:15 AM");
    expect(time12("16:30")).toBe("4:30 PM");
    expect(time12("")).toBe("Hora por confirmar");
  });
  it("daysUntil", () => expect(daysUntil("2026-03-02", "2026-02-27")).toBe(3));
});
