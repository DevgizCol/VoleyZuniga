import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const rutas = [
  "/",
  "/el-club",
  "/metodologia",
  "/equipos",
  "/partidos",
  "/posiciones",
  "/noticias",
  "/galeria",
  "/tienda",
  "/inscripciones",
  "/contacto",
  "/privacidad",
  "/admin",
];

for (const ruta of rutas) {
  test(`accesibilidad ${ruta}`, async ({ page }) => {
    await page.goto(ruta);
    const wcag = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
    // Estructura (aparte: withRules reemplaza a withTags): un solo h1, títulos en orden y contenido dentro de <main>.
    const estructura = await new AxeBuilder({ page }).withRules(["page-has-heading-one", "heading-order", "landmark-one-main"]).analyze();
    const violations = [...wcag.violations, ...estructura.violations];
    // Resumen legible en el fallo: regla, impacto y primeros nodos afectados.
    const resumen = violations.map((v) => ({
      regla: v.id,
      impacto: v.impact,
      nodos: v.nodes.slice(0, 3).map((n) => n.target.join(" ")),
    }));
    expect(resumen).toEqual([]);
  });
}
