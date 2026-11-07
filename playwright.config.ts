import { defineConfig, devices } from "@playwright/test";

// Prueba de accesibilidad (axe) sobre la compilación de producción, en celular.
export default defineConfig({
  testDir: "e2e",
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? "github" : "list",
  use: {
    ...devices["Pixel 7"],
    baseURL: "http://localhost:3100",
    // Sin animaciones de entrada: axe mediría contraste a mitad de un fundido.
    contextOptions: { reducedMotion: "reduce" },
  },
  webServer: {
    command: "npm run start -- -p 3100",
    url: "http://localhost:3100",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
