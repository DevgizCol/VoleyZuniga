"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, MessageCircle, Copy, Check } from "lucide-react";

export function LogoutButton({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
        router.refresh();
      }}
      className={
        compact
          ? "h-10 px-3 inline-flex items-center gap-1.5 rounded-lg border border-white/15 text-sm font-semibold hover:bg-white/5"
          : "h-11 px-4 inline-flex items-center gap-2 rounded-md border border-white/20 hover:border-white font-semibold"
      }
    >
      <LogOut size={compact ? 14 : 18} /> Salir
    </button>
  );
}

const TEMPLATES = [
  "Recordatorio: mañana hay entrenamiento en el Polideportivo 3 Canchas. Lleguen 15 minutos antes y con uniforme.",
  "Por lluvia se cancela el entrenamiento de hoy. Les avisamos la reposición por este medio.",
  "Este fin de semana jugamos. Revisen hora y sede en la página de Partidos: ",
];

// Arma un mensaje para enviar al grupo de WhatsApp de las familias (se elige el grupo al abrir WhatsApp).
export function GroupMessage({ gamesUrl }: { gamesUrl: string }) {
  const [text, setText] = useState(TEMPLATES[0]);
  const [copied, setCopied] = useState(false);
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3">
        {["Recordatorio", "Cancelación", "Partido"].map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => setText(TEMPLATES[i] + (i === 2 ? gamesUrl : ""))}
            className="h-9 px-3 rounded-full border border-white/15 hover:border-white/40 text-sm font-semibold"
          >
            {label}
          </button>
        ))}
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        maxLength={1000}
        aria-label="Mensaje para el grupo"
        className="w-full rounded-lg bg-white/[0.05] border border-white/15 p-4 focus:outline-none focus:border-[#F29A2E]"
      />
      <div className="mt-3 flex flex-wrap gap-3">
        <a
          href={`https://wa.me/?text=${encodeURIComponent(text)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="h-11 px-5 inline-flex items-center gap-2 rounded-md bg-[#25D366] text-[#071426] font-bold"
        >
          <MessageCircle size={18} /> Enviar por WhatsApp
        </a>
        <button
          type="button"
          onClick={async () => {
            await navigator.clipboard?.writeText(text).catch(() => {});
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className="h-11 px-5 inline-flex items-center gap-2 rounded-md border border-white/20 hover:border-white font-semibold"
        >
          {copied ? <Check size={18} /> : <Copy size={18} />} {copied ? "Copiado" : "Copiar"}
        </button>
      </div>
    </div>
  );
}
