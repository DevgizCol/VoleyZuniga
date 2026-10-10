// Eventos de conversión (clic en WhatsApp, pasos de la inscripción…). Se envían a Umami solo si
// está configurado (NEXT_PUBLIC_UMAMI_WEBSITE_ID); si no, no hacen nada.

type Umami = { track: (event: string, data?: Record<string, string | number>) => void };

export function track(event: string, data?: Record<string, string | number>): void {
  try {
    (window as unknown as { umami?: Umami }).umami?.track(event, data);
  } catch {
    // La analítica nunca debe romper la página.
  }
}
