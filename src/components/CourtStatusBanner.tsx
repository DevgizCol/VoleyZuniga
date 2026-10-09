"use client";

import { useState } from "react";
import { CloudRain, AlertTriangle, Info, X } from "lucide-react";
import type { CourtNotice } from "@/lib/court";

// Aviso del estado de las canchas. Lo controla la pestaña "Cancha" de la hoja del club.
export default function CourtStatusBanner({ notices }: { notices: CourtNotice[] }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed || notices.length === 0) return null;

  const main = notices[0];
  const Icon = main.tipo === "rain" ? CloudRain : main.tipo === "cancel" ? AlertTriangle : Info;

  return (
    <aside role="status" className="w-full bg-[#F29A2E] text-[#071426]" style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>
      <div className="container mx-auto px-4 sm:px-6 py-2 flex items-center gap-3">
        <Icon size={18} className="shrink-0" />
        <p className="flex-1 text-sm leading-snug">
          {notices.map((n, i) => (
            <span key={n.sede + i} className="block sm:inline sm:mr-4">
              <strong>
                {n.estado}
                {n.sede ? ` · ${n.sede}` : ""}:
              </strong>{" "}
              {n.mensaje || "Revisa los detalles por WhatsApp."}
            </span>
          ))}
        </p>
        <button onClick={() => setDismissed(true)} aria-label="Cerrar aviso" className="w-9 h-9 shrink-0 flex items-center justify-center rounded-md hover:bg-black/10">
          <X size={16} />
        </button>
      </div>
    </aside>
  );
}
