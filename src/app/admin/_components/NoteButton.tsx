"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2, NotebookPen, Save } from "lucide-react";
import { saveNote } from "../actions";
import type { StatusSheet } from "@/lib/admin/options";
import { btn } from "./ui";
import type { RowData } from "./types";

// Nota interna (solo la ve el equipo en el panel y en la hoja).
export default function NoteButton({ sheet, row }: { sheet: StatusSheet; row: RowData }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [text, setText] = useState(row.Notas || "");
  const [pending, start] = useTransition();
  const has = Boolean((row.Notas || "").trim());

  const save = () =>
    start(async () => {
      const expected = Object.fromEntries(Object.entries(row).filter(([k]) => k !== "_row"));
      const res = await saveNote(sheet, Number(row._row), expected, text);
      if (res.ok) {
        toast.success(res.message);
        ref.current?.close();
      } else toast.error(res.message);
    });

  return (
    <>
      <button type="button" onClick={() => ref.current?.showModal()} className={btn.ghost} aria-label={has ? "Ver o editar nota" : "Agregar nota"}>
        <NotebookPen size={16} /> {has ? "Nota" : "Anotar"}
        {has ? <span className="w-2 h-2 rounded-full bg-[#F29A2E]" aria-hidden="true" /> : null}
      </button>
      <dialog ref={ref} className="m-auto w-[min(92vw,520px)] rounded-2xl bg-[#0B1E38] text-white border border-white/10 p-6 backdrop:bg-black/60">
        <h2 className="font-heading font-black uppercase text-2xl">Nota interna</h2>
        <p className="text-sm text-[#8FA3BF] mt-1">Solo la ve el equipo. Ej.: “Vino a la clase el sábado, nivel intermedio”.</p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          maxLength={1000}
          aria-label="Nota"
          className="mt-4 w-full rounded-lg bg-white/[0.05] border border-white/15 p-3 focus:outline-none focus:border-[#F29A2E]"
        />
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={() => ref.current?.close()} className={btn.secondary}>
            Cancelar
          </button>
          <button type="button" onClick={save} disabled={pending} className={btn.primary}>
            {pending ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Guardar
          </button>
        </div>
      </dialog>
    </>
  );
}
