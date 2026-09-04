import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Club Deportivo Voley Zúñiga",
    short_name: "Voley Zúñiga",
    description: "Aplicación oficial del Club Voley Zúñiga en Medellín. Fixture en vivo, Carnet VIP, resultados e inscripciones.",
    start_url: "/",
    display: "standalone",
    background_color: "#071426",
    theme_color: "#071426",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/pwa-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
