import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Club Voley Zúñiga",
    short_name: "Voley Zúñiga",
    description: "Horarios, partidos, posiciones e inscripciones del Club Voley Zúñiga en Medellín.",
    start_url: "/",
    display: "standalone",
    background_color: "#071426",
    theme_color: "#071426",
    orientation: "portrait-primary",
    lang: "es-CO",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Inscribirme", url: "/registrations" },
      { name: "Partidos", url: "/games" },
      { name: "Horarios y sedes", url: "/club/contact" },
    ],
  };
}
