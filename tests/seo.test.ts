import { describe, expect, it } from "vitest";
import { pageMeta } from "@/lib/seo";

describe("pageMeta", () => {
  it("da a cada página su propio openGraph (no hereda el de la portada)", () => {
    const m = pageMeta("/equipos", "Categorías", "Edades y horarios");
    expect(m.alternates?.canonical).toBe("/equipos");
    expect(m.openGraph).toMatchObject({ url: "/equipos", title: "Categorías | Voley Zúñiga", description: "Edades y horarios" });
  });
});

describe("logos de afiliaciones", async () => {
  const { AFFILIATION_LOGOS } = await import("@/data/registration");
  const logo = (name: string) => AFFILIATION_LOGOS.find((l) => l.match.test(name))?.src;
  it("reconoce cada entidad por cómo la escribe el club y no confunde Medellín con INDER", () => {
    expect(logo("INDER Medellín")).toContain("inder");
    expect(logo("Liga Antioqueña de Voleibol")).toContain("liga");
    expect(logo("Liga de Voleibol de Antioquia")).toContain("liga");
    expect(logo("Alcaldía de Medellín")).toContain("alcaldia");
    expect(logo("Club Deportivo X")).toBeUndefined();
  });
});
