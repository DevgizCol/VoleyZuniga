"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";
import { enablePush } from "./NotificationSettings";

const KEY = "vz-invitacion-avisos";
const PAUSA = 14 * 24 * 60 * 60 * 1000; // si la persona no acepta, no volver a preguntar en 14 días
const ESPERA = 4000; // dejar ver la web antes de preparar la pregunta

function marcar() {
  try { localStorage.setItem(KEY, String(Date.now())); } catch { /* sin almacenamiento */ }
}

// Invitación automática a los dispositivos sin avisos activos: la ventana NATIVA del navegador sale en el
// primer toque, clic o tecla de la persona (sin un gesto, los navegadores la bloquean). En iPhone sin instalar,
// Apple no permite esa ventana: se muestra un cartel que explica cómo agregar la web a la pantalla de inicio.
export default function NotificationInvite() {
  const pathname = usePathname();
  const [iphone, setIphone] = useState(false);

  useEffect(() => {
    if (pathname === "/notificaciones") return;
    let vivo = true;
    let quitar = () => {};
    const timer = setTimeout(async () => {
      try {
        if (Date.now() - Number(localStorage.getItem(KEY) || 0) < PAUSA) return;
      } catch { /* sin almacenamiento: se pregunta igual */ }
      const apple = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
      const instalada = window.matchMedia("(display-mode: standalone)").matches || Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
      if (apple && !instalada) { if (vivo) setIphone(true); return; }
      const soporta = window.isSecureContext && "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
      if (!soporta || Notification.permission !== "default") return; // ya decidió, o el navegador no lo admite
      try {
        const config = await fetch("/api/notifications", { cache: "no-store" }).then((r) => r.json());
        if (!config.configured || !vivo) return;
        const pedir = () => {
          quitar();
          marcar(); // si la cierra sin elegir, no insistir hasta dentro de 14 días
          enablePush(config.publicKey).catch(() => { /* rechazó o falló el guardado: /notificaciones permite reintentar */ });
        };
        document.addEventListener("pointerup", pedir, { capture: true });
        document.addEventListener("keydown", pedir, { capture: true });
        quitar = () => { document.removeEventListener("pointerup", pedir, true); document.removeEventListener("keydown", pedir, true); };
      } catch { /* sin conexión con la API: no molestar */ }
    }, ESPERA);
    return () => { vivo = false; clearTimeout(timer); quitar(); };
  }, [pathname]);

  useEffect(() => {
    if (!iphone) return;
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") { marcar(); setIphone(false); } };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [iphone]);

  function cerrar() {
    marcar();
    setIphone(false);
  }

  if (!iphone) return null;
  return (
    <div role="dialog" aria-labelledby="invitacion-avisos-titulo" className="fixed z-50 inset-x-3 bottom-[calc(76px+env(safe-area-inset-bottom,0px))] md:inset-x-auto md:right-6 md:bottom-6 md:w-[380px] rounded-2xl border border-accent/40 bg-[#0D2037] p-5 text-white shadow-2xl shadow-black/50 motion-safe:animate-[invitacion_.35s_ease-out]">
      <style>{"@keyframes invitacion{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}"}</style>
      <button type="button" onClick={cerrar} aria-label="Cerrar invitación" className="absolute right-2 top-2 grid h-11 w-11 place-items-center rounded-full text-[#C9D5E6] hover:text-white focus-visible:outline-2 focus-visible:outline-accent">
        <X size={18} aria-hidden="true" />
      </button>
      <div className="flex gap-3 pr-8">
        <Bell className="mt-0.5 shrink-0 text-accent" size={24} aria-hidden="true" />
        <div>
          <h2 id="invitacion-avisos-titulo" className="font-bold leading-snug">¿Te avisamos de partidos, cancha y noticias?</h2>
          <p className="mt-1.5 text-sm text-[#C9D5E6]">En iPhone primero agrega el club a tu pantalla de inicio: toca <strong className="text-white">Compartir</strong> → <strong className="text-white">Añadir a pantalla de inicio</strong> y ábrelo desde ese ícono. Ahí te preguntaremos si quieres los avisos.</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href="/notificaciones" onClick={cerrar} className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg bg-accent px-4 font-semibold text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">Ver cómo</Link>
        <button type="button" onClick={cerrar} className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/25 px-4 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">Ahora no</button>
      </div>
    </div>
  );
}
