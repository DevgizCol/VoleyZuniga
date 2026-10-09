"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Loader2, Trophy } from "lucide-react";
import { saveRow, type ActionState } from "../actions";
import { btn } from "../_components/ui";
import { forForm } from "../_components/format";
import type { RowData } from "../_components/types";

const PASSTHROUGH = ["Fecha", "Hora", "Categoría", "Local", "Visitante", "Sede", "Activo"];

// Carga rápida del marcador: sets de cada equipo y, si quieres, los parciales.
export default function QuickResult({ row }: { row: RowData }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [state, action, pending] = useActionState<ActionState, FormData>(saveRow, { ok: false });
  const last = useRef<number | undefined>(undefined);
  const current = (row.Resultado || "").match(/^(\d)\s*-\s*(\d)\s*(?:\((.*)\))?/);
  const [home, setHome] = useState(current?.[1] ?? "");
  const [away, setAway] = useState(current?.[2] ?? "");
  const [sets, setSets] = useState(current?.[3] ?? "");
  const f = forForm(row);
  const result = home !== "" && away !== "" ? `${home}-${away}${sets.trim() ? ` (${sets.trim()})` : ""}` : "";

  useEffect(() => {
    if (!state.at || state.at === last.current) return;
    last.current = state.at;
    if (state.ok) {
      toast.success("Resultado guardado. Ya aparece en la web.");
      ref.current?.close();
    } else toast.error(state.fieldErrors?.Resultado ?? state.message);
  }, [state]);

  return (
    <>
      <button type="button" onClick={() => ref.current?.showModal()} className={btn.ghost}>
        <Trophy size={16} /> {row.Resultado ? "Corregir resultado" : "Cargar resultado"}
      </button>
      <dialog ref={ref} className="m-auto w-[min(94vw,460px)] rounded-2xl bg-[#0B1E38] text-white border border-white/10 p-0 backdrop:bg-black/60">
        <form action={action} className="p-6">
          <h2 className="font-heading font-black uppercase text-2xl">Resultado</h2>
          <p className="text-sm text-[#8FA3BF] mt-1">
            {row["Categoría"]} · {row.Fecha}
          </p>
          <input type="hidden" name="_sheet" value="Fixture" />
          <input type="hidden" name="_row" value={row._row} />
          <input type="hidden" name="_expected" value={JSON.stringify(Object.fromEntries(Object.entries(row).filter(([k]) => k !== "_row")))} />
          <input type="hidden" name="_hasActivo" value="1" />
          {PASSTHROUGH.map((k) =>
            k === "Activo" ? (
              (f.Activo || "").toUpperCase() !== "NO" ? <input key={k} type="hidden" name="Activo" value="on" /> : null
            ) : (
              <input key={k} type="hidden" name={k} value={f[k] ?? ""} />
            )
          )}
          <input type="hidden" name="Estado" value="Finalizado" />
          <input type="hidden" name="Resultado" value={result} />

          <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-end gap-3">
            <label className="text-center">
              <span className="block text-sm font-semibold truncate mb-2">{row.Local}</span>
              <input value={home} onChange={(e) => setHome(e.target.value.replace(/\D/g, "").slice(0, 1))} inputMode="numeric" aria-label={`Sets de ${row.Local}`} className="w-full h-20 rounded-xl bg-white/[0.06] border border-white/15 text-center font-heading font-black text-5xl focus:outline-none focus:border-[#F29A2E]" />
            </label>
            <span className="pb-6 font-heading font-black text-3xl text-white/40">–</span>
            <label className="text-center">
              <span className="block text-sm font-semibold truncate mb-2">{row.Visitante}</span>
              <input value={away} onChange={(e) => setAway(e.target.value.replace(/\D/g, "").slice(0, 1))} inputMode="numeric" aria-label={`Sets de ${row.Visitante}`} className="w-full h-20 rounded-xl bg-white/[0.06] border border-white/15 text-center font-heading font-black text-5xl focus:outline-none focus:border-[#F29A2E]" />
            </label>
          </div>
          <label className="block mt-5">
            <span className="block text-sm font-semibold mb-1.5">Parciales (opcional)</span>
            <input value={sets} onChange={(e) => setSets(e.target.value)} placeholder="25-20, 23-25, 25-18, 25-21" className="w-full h-11 rounded-lg bg-white/[0.05] border border-white/15 px-3.5 focus:outline-none focus:border-[#F29A2E]" />
          </label>
          <div className="mt-6 flex justify-end gap-2">
            <button type="button" onClick={() => ref.current?.close()} className={btn.secondary}>
              Cancelar
            </button>
            <button type="submit" disabled={pending || !result} className={btn.primary}>
              {pending ? <Loader2 size={18} className="animate-spin" /> : null} Guardar resultado
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
