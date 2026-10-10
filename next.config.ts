import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";
// En las vistas previas de Vercel se inyecta la barra de comentarios (vercel.live); en producción no.
const isPreview = process.env.VERCEL_ENV === "preview";
const live = isPreview ? " https://vercel.live" : "";

// Política de contenido: solo recursos del propio sitio, más las imágenes de noticias (enlaces https)
// y el mapa de Google embebido en /contacto. 'unsafe-inline' en scripts es necesario sin nonce
// (que obligaría a renderizar todo en cada visita); en desarrollo React además necesita 'unsafe-eval'.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}${live}`,
  `style-src 'self' 'unsafe-inline'${live}`,
  "img-src 'self' data: blob: https:",
  // Video de la portada: archivo del propio sitio o enlace https que el club ponga en Ajustes.
  "media-src 'self' https:",
  `font-src 'self'${isPreview ? " https://vercel.live https://assets.vercel.com" : ""}`,
  `connect-src 'self'${isPreview ? " https://vercel.live wss://ws-us3.pusher.com" : ""}`,
  `frame-src https://www.google.com${live}`,
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
    remotePatterns: [{ protocol: "https", hostname: "lh3.googleusercontent.com", pathname: "/**" }],
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
