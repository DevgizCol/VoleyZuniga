import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Política de contenido: solo recursos del propio sitio, más las imágenes de noticias (enlaces https)
// y el mapa de Google embebido en /contacto. 'unsafe-inline' en scripts es necesario sin nonce
// (que obligaría a renderizar todo en cada visita); en desarrollo React además necesita 'unsafe-eval'.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-src https://www.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

// Rutas anteriores (en inglés) → rutas actuales. Mantienen vivos los enlaces ya compartidos y el SEO.
const OLD_ROUTES: [string, string][] = [
  ["/registrations", "/inscripciones"],
  ["/games", "/partidos"],
  ["/standings", "/posiciones"],
  ["/team", "/equipos"],
  ["/news", "/noticias"],
  ["/news/:slug", "/noticias/:slug"],
  ["/store", "/tienda"],
  ["/club", "/el-club"],
  ["/club/history", "/el-club"],
  ["/club/methodology", "/metodologia"],
  ["/club/contact", "/contacto"],
];

const nextConfig: NextConfig = {
  ...(process.env.VERCEL ? {} : { output: "standalone" }),
  images: {
    formats: ["image/avif", "image/webp"],
  },
  redirects: async () => OLD_ROUTES.map(([source, destination]) => ({ source, destination, permanent: true })),
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "Content-Security-Policy", value: csp },
        { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      ],
    },
    {
      source: "/logo.svg",
      headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
    },
  ],
};

export default nextConfig;
