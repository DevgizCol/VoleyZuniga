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
    <div
      className={`w-full py-2 px-4 transition-all duration-300 z-40 text-xs font-sans flex items-center justify-between border-b ${
        isAlert
          ? "bg-gradient-to-r from-amber-600/90 via-[#F29A2E]/90 to-amber-700/90 text-[#071426] font-bold border-amber-400/50 shadow-md"
          : "bg-[#071426]/95 text-gray-300 border-white/5"
      }`}
    >
      <div className="container mx-auto flex items-center justify-center gap-2 text-center flex-wrap">
        {status.type === "rain" ? (
          <CloudRain size={16} className="text-[#071426] animate-pulse" />
        ) : isAlert ? (
          <AlertTriangle size={16} className="text-[#071426]" />
        ) : (
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block mr-1" />
        )}

        <span>
          <strong>{isAlert ? "AVISO EN VIVO:" : "ESTADO DE CANCHAS:"}</strong> {status.message}
        </span>

        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase ${
          isAlert ? "bg-[#071426] text-[#F29A2E]" : "bg-white/10 text-[#F29A2E]"
        }`}>
          {status.venue}
        </span>
      </div>

      <button
        onClick={() => setDismissed(true)}
        className="p-1 rounded-md opacity-60 hover:opacity-100 transition-opacity ml-2 shrink-0 cursor-pointer"
        aria-label="Cerrar aviso"
      >
        <X size={14} />
      </button>
    </div>
  );
}
