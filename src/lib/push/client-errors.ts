/** Errores anteriores al alta en nuestro servidor, sin confundir permiso con suscripción. */
export function pushClientError(error: unknown, brave = false): string {
  const message = error instanceof Error ? error.message : "";
  if (/registration failed.*push service error/i.test(message)) {
    return brave
      ? "Brave no pudo conectarse al servicio push. Revisa en Privacidad y seguridad el ajuste de servicios de Google para mensajes push, reinicia Brave y vuelve a intentarlo. No se completó la suscripción."
      : "El navegador no pudo conectarse a su servicio push. Comprueba la conexión y los ajustes de notificaciones del navegador, reinícialo y vuelve a intentarlo. No se completó la suscripción.";
  }
  return message || "No se pudieron activar los avisos.";
}
