"use client";

import { useEffect, useState } from "react";
import { pushClientError } from "@/lib/push/client-errors";
import { Bell, BellOff, Send } from "lucide-react";

async function api(action: string, subscription: PushSubscription) {
  const response = await fetch("/api/notifications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, subscription: subscription.toJSON() }) });
  const result = await response.json();
  if (!response.ok || !result.ok) throw new Error(result.error || "No se pudo completar la solicitud.");
  return result;
}
function keyBytes(key: string) {
  const raw = atob(key.replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(raw, c => c.charCodeAt(0));
}

export default function NotificationSettings({ admin = false }: { admin?: boolean }) {
  const [supported, setSupported] = useState<boolean | null>(null);
  const [ios, setIos] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [registered, setRegistered] = useState(false);
  const [publicKey, setPublicKey] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let alive = true;
    const ok = window.isSecureContext && "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
    const apple = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const standalone = window.matchMedia("(display-mode: standalone)").matches || Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
    async function init() {
      setIos(apple && !standalone);
      setSupported(ok);
      if (!ok) return;
      setPermission(Notification.permission);
      try {
        const config = await fetch("/api/notifications", { cache: "no-store" }).then(r => r.json());
        if (!alive) return;
        setPublicKey(config.publicKey || "");
        if (!config.configured) return;
        const registration = await navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" });
        await navigator.serviceWorker.ready;
        const sub = await registration.pushManager.getSubscription();
        if (alive) setSubscription(sub);
        // Renueva el registro privado sin volver a pedir permiso. El navegador ya está suscrito.
        if (sub) { await api("subscribe", sub); if (alive) setRegistered(true); }
      } catch (e) { if (alive) setMessage(e instanceof Error ? e.message : "No pudimos comprobar los avisos."); }
    }
    void init();
    return () => { alive = false; };
  }, []);

  async function enable() {
    setBusy(true); setMessage("");
    try {
      // Debe ejecutarse directamente por un gesto del usuario, especialmente en iOS.
      const allowed = await Notification.requestPermission();
      setPermission(allowed);
      if (allowed !== "granted") throw new Error("No se activaron los avisos. Puedes cambiar el permiso en los ajustes del navegador.");
      const registration = await navigator.serviceWorker.ready;
      const previous = await registration.pushManager.getSubscription();
      const sub = previous || await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyBytes(publicKey) });
      setSubscription(sub); // Permite desactivar incluso si falla el guardado remoto.
      await api("subscribe", sub);
      setRegistered(true);
      setMessage("Avisos activados para este dispositivo. Recibirás partidos y noticias publicados desde el admin.");
    } catch (e) { setMessage(pushClientError(e, Boolean((navigator as Navigator & { brave?: unknown }).brave))); }
    finally { setBusy(false); }
  }

  async function disable() {
    if (!subscription) return;
    setBusy(true); setMessage("");
    try {
      // Primero borrar del servidor: si falla, se conserva la capacidad de reintentar la baja.
      await api("unsubscribe", subscription);
      if (!(await subscription.unsubscribe())) throw new Error("Reintenta la baja o retira el permiso en el navegador.");
      setSubscription(null); setRegistered(false); setMessage("Avisos desactivados en este dispositivo.");
    } catch (e) { setMessage(e instanceof Error ? e.message : "No se pudo desactivar."); }
    finally { setBusy(false); }
  }

  async function test() {
    if (!subscription) return;
    setBusy(true); setMessage("");
    try { const result = await api("test", subscription); setMessage(result.message); }
    catch (e) { setMessage(e instanceof Error ? e.message : "No se pudo enviar la prueba."); }
    finally { setBusy(false); }
  }

  const button = "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/25 px-4 py-3 font-semibold disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";
  return (
    <section className="rounded-2xl border border-white/15 bg-[#0D2037] p-5 sm:p-7 space-y-4" aria-labelledby="notification-settings-title">
      <div className="flex items-start gap-3"><Bell className="text-accent shrink-0" aria-hidden="true" /><div>
        <h2 id="notification-settings-title" className="text-xl font-bold text-white">El club, al instante</h2>
        <p className="mt-2 text-sm text-[#C9D5E6]">Partidos, cambios de agenda y noticias. Tú decides si recibirlos; puedes desactivarlos aquí cuando quieras.</p>
      </div></div>
      {ios ? <p className="text-sm text-[#FFD0AA]">En iPhone o iPad: abre el menú Compartir, elige «Añadir a pantalla de inicio» y abre el club desde ese icono para activar los avisos (iOS/iPadOS 16.4 o posterior).</p> : null}
      {supported === false && !ios ? <p>Este navegador no admite avisos o la conexión no es segura. Abre la web con HTTPS en un navegador compatible.</p> : null}
      {supported && !publicKey ? <p className="text-sm text-[#FFD0AA]">Los avisos todavía no están configurados por el club.</p> : null}
      {permission === "denied" ? <p className="text-sm text-[#FFD0AA]">Los avisos están bloqueados. Habilita las notificaciones de este sitio en los ajustes del navegador y recarga.</p> : null}
      {supported && publicKey && !ios ? <div className="flex flex-wrap gap-3">
        {subscription ? <button onClick={disable} disabled={busy} className={button}><BellOff size={18} /> Desactivar avisos</button>
          : <button onClick={enable} disabled={busy || permission === "denied"} className={`${button} bg-accent text-primary border-transparent`}><Bell size={18} /> Activar avisos</button>}
        {subscription && !registered ? <button onClick={enable} disabled={busy} className={button}>Reintentar activación</button> : null}
        {admin && subscription ? <button onClick={test} disabled={busy} className={button}><Send size={18} /> Enviar prueba a este dispositivo</button> : null}
      </div> : null}
      <p role="status" aria-live="polite" className="text-sm text-[#C9D5E6]">{busy ? "Procesando…" : message || (subscription ? "Este navegador está suscrito. La entrega depende de tu conexión y los permisos del sistema." : "No solicitamos tu nombre, correo ni número de teléfono para suscribirte.")}</p>
    </section>
  );
}
