import type { Metadata } from "next";

// La metadata se combina de forma superficial: si una página no define openGraph, hereda el de la portada
// (título y URL incluidos) y en WhatsApp/Instagram todas se ven como la portada.
export function pageMeta(path: string, title: string, description: string, ownImage = false): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "es_CO",
      siteName: "Voley Zúñiga",
      url: path,
      title: title.includes("Zúñiga") ? title : `${title} | Voley Zúñiga`, // sin repetir la marca
      description,
      // La imagen en config tapa la de un opengraph-image propio: las rutas que lo tienen pasan ownImage.
      ...(ownImage ? {} : { images: [{ url: "/opengraph-image", width: 1200, height: 630 }] }),
    },
  };
}
