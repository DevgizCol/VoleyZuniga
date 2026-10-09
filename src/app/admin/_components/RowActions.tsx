"use client";

import { useRef, useTransition } from "react";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
import { deleteRow } from "../actions";
import type { EditableSheet } from "@/lib/admin/schemas";
import { btn } from "./ui";
import type { RowData } from "./types";

// Botón de borrar con confirmación (diálogo nativo accesible).
export function DeleteButton({ sheet, row, label, compact = false }: { sheet: EditableSheet; row: RowData; label: string; compact?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [pending, start] = useTransition();

  const confirm = () =>
    start(async () => {
      const expected = Object.fromEntries(Object.entries(row).filter(([k]) => k !== "_row"));
      const res = await deleteRow(sheet, Number(row._row), expected);
      ref.current?.close();
      if (res.ok) toast.success(res.message);
      else toast.error(res.message);
    });

  return (
    <>
      <button type="button" onClick={() => ref.current?.showModal()} className={compact ? btn.ghost : btn.secondary} aria-label={`Eliminar ${label}`}>
        <Trash2 size={16} /> {compact ? null : "Eliminar"}
      </button>
      <dialog ref={ref} className="m-auto w-[min(92vw,420px)] rounded-2xl bg-[#0B1E38] text-white border border-white/10 p-6 backdrop:bg-black/60">
        <h2 className="font-heading font-black uppercase text-2xl">¿Eliminar?</h2>
        <p className="mt-2 text-[#C9D5E6]">
          Se borrará <strong className="text-white">{label}</strong> de la hoja y de la web. Queda registrado en el historial.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={() => ref.current?.close()} className={btn.secondary}>
            Cancelar
          </button>
          <button type="button" onClick={confirm} disabled={pending} className={btn.danger}>
            {pending ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />} Eliminar
          </button>
        </div>
      </dialog>
    </>
  );
}
