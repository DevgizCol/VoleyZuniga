"use client";

import React, { useState, useEffect } from "react";
import { CloudRain, CheckCircle, AlertTriangle, X, ChevronRight } from "lucide-react";

export default function CourtStatusBanner() {
  const [status, setStatus] = useState<{
    type: "normal" | "rain" | "special";
    message: string;
    venue: string;
    active: boolean;
  }>({
    type: "normal",
    message: "Entrenamientos habilitados con normalidad en todas las sedes.",
    venue: "Polideportivo 3 Canchas & Yesid Santos",
    active: true,
  });

  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Escuchar cambios de estado guardados desde el Panel de Administración
    const saved = localStorage.getItem("vz_court_status");
    if (saved) {
      try {
        setStatus(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  if (!status.active || dismissed) return null;

  const isAlert = status.type === "rain" || status.type === "special";

  return (
    <aside
      role="alert"
      className={`w-full pt-[max(0.375rem,env(safe-area-inset-top,0px))] pb-1.5 px-3 sm:px-4 transition-all duration-300 text-[11px] sm:text-xs font-sans flex items-center justify-between gap-2 border-b ${
        isAlert
          ? "bg-gradient-to-r from-amber-600 via-[#F29A2E] to-amber-700 text-[#071426] font-bold border-amber-400/50 shadow-md"
          : "bg-[#071426]/95 text-gray-200 border-white/10"
      }`}
    >
      <div className="container mx-auto flex items-center justify-center gap-1.5 sm:gap-2 text-center flex-wrap leading-tight">
        {status.type === "rain" ? (
          <CloudRain size={14} className="text-[#071426] animate-pulse shrink-0" />
        ) : isAlert ? (
          <AlertTriangle size={14} className="text-[#071426] shrink-0" />
        ) : (
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block mr-1 shrink-0" />
        )}

        <span className="break-words">
          <strong>{isAlert ? "AVISO EN VIVO:" : "ESTADO DE CANCHAS:"}</strong> {status.message}
        </span>

        <span className={`px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono uppercase tracking-wider shrink-0 ${
          isAlert ? "bg-[#071426] text-[#F29A2E]" : "bg-white/10 text-[#F29A2E]"
        }`}>
          {status.venue}
        </span>
      </div>

      <button
        onClick={() => setDismissed(true)}
        className="p-1.5 rounded-lg opacity-70 hover:opacity-100 active:scale-90 transition-all shrink-0 cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
        aria-label="Cerrar aviso"
      >
        <X size={14} />
      </button>
    </aside>
  );
}
