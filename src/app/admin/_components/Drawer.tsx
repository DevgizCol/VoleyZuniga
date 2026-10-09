"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

// Panel lateral accesible basado en <dialog> (foco atrapado, Esc para cerrar, fondo inerte).
export default function Drawer({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      aria-label={title}
      className="m-0 ml-auto h-dvh max-h-dvh w-full max-w-xl bg-[#0B1E38] text-white p-0 border-l border-white/10 backdrop:bg-black/60 backdrop:backdrop-blur-sm open:animate-fade-in"
    >
      <div className="flex flex-col h-full">
        <header className="flex items-center justify-between gap-3 px-5 sm:px-6 h-16 border-b border-white/10 shrink-0">
          <h2 className="font-heading font-black uppercase text-2xl truncate">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-white/10">
            <X size={22} />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-6">{open ? children : null}</div>
      </div>
    </dialog>
  );
}
