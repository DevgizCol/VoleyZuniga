"use client";

import { useEffect } from "react";
import { captureOrigin } from "@/lib/origin";
import { track } from "@/lib/track";

// Guarda de dónde llegó la visita y cuenta los clics que llevan a inscribirse o escribir al club.
export default function SiteTracker() {
  useEffect(() => {
    captureOrigin();

    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      const lugar = window.location.pathname;
      if (/wa\.me|api\.whatsapp\.com/.test(href)) track("clic_whatsapp", { lugar });
      else if (/^\/inscripciones(\b|$)/.test(href) && lugar !== "/inscripciones") track("clic_inscribirme", { lugar });
      else if (href.endsWith(".ics") || href.startsWith("webcal:") || href.includes("calendar.google.com")) track("calendario", { lugar });
      else if (href.startsWith("tel:")) track("clic_llamar", { lugar });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
  return null;
}
