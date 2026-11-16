/* Web Push del club. No almacena páginas del admin ni intercepta navegación. */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", event => event.waitUntil(self.clients.claim()));
self.addEventListener("push", event => {
  let data = {};
  try { data = event.data?.json() || {}; } catch { /* notificación visible también si el cuerpo no es JSON */ }
  const url = ["/", "/partidos", "/noticias"].includes(data.url) ? data.url : "/";
  event.waitUntil(self.registration.showNotification(String(data.title || "Club Voley Zúñiga").slice(0, 100), {
    body: String(data.body || "Hay novedades del club.").slice(0, 240),
    icon: "/icon-192.png", badge: "/icon-192.png",
    tag: data.tag === "vz-test" ? "vz-test" : undefined,
    data: { url },
  }));
});
self.addEventListener("notificationclick", event => {
  event.notification.close();
  const url = new URL(event.notification.data?.url || "/", self.location.origin);
  if (url.origin !== self.location.origin) return;
  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: false });
    for (const client of windows) {
      // Conservar cualquier otra pantalla, en especial formularios y el admin.
      if (client.url === url.href) {
        try {
          const navigated = await client.navigate(url.href);
          if (navigated) return navigated.focus();
        } catch { /* Puede haberse cerrado o perdido el control: abrir una nueva. */ }
      }
    }
    return self.clients.openWindow(url.href);
  })());
});
