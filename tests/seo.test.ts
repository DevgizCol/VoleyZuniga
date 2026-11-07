import { describe, expect, it } from "vitest";
import { pageMeta } from "@/lib/seo";

describe("pageMeta", () => {
  it("da a cada página su propio openGraph (no hereda el de la portada)", () => {
    const m = pageMeta("/equipos", "Categorías", "Edades y horarios");
    expect(m.alternates?.canonical).toBe("/equipos");
    expect(m.openGraph).toMatchObject({ url: "/equipos", title: "Categorías | Voley Zúñiga", description: "Edades y horarios" });
  });
});
