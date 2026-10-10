// Umami (analítica sin cookies, plan gratuito en cloud.umami.is o alojado por cuenta propia).
//   NEXT_PUBLIC_UMAMI_WEBSITE_ID   identificador del sitio en Umami (sin él no se carga nada)
//   NEXT_PUBLIC_UMAMI_SCRIPT_URL   opcional, para un Umami propio (por defecto el de Umami Cloud)

export const UMAMI_WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID?.trim() || "";
export const UMAMI_SCRIPT_URL = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL?.trim() || "https://cloud.umami.is/script.js";

/** Orígenes que la política de seguridad debe permitir para Umami (vacío si no está configurado). */
export function umamiOrigins(): string[] {
  if (!UMAMI_WEBSITE_ID) return [];
  try {
    const own = new URL(UMAMI_SCRIPT_URL).origin;
    // Umami Cloud envía los eventos a su pasarela.
    return own === "https://cloud.umami.is" ? [own, "https://api-gateway.umami.dev"] : [own];
  } catch {
    return [];
  }
}
