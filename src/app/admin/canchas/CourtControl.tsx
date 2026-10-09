"use client";

import { useState, useTransition } from "react";
import clsx from "clsx";
import { toast } from "sonner";
import { CheckCircle2, CloudRain, Ban, MapPinned, Megaphone, Loader2 } from "lucide-react";
import { quickCourt } from "../actions";
import { Card, btn } from "../_components/ui";
import type { RowData } from "../_components/types";

const PRESETS = [
  { estado: "Normal", icon: CheckCircle2, label: "Normal", mensaje: "" },
  { estado: "Lluvia", icon: CloudRain, label: "Lluvia", mensaje: "Por lluvia hoy no hay entrenamiento. Les avisamos la reposición." },
  { estado: "Cancelado", icon: Ban, label: "Cancelado", mensaje: "Hoy se cancela el entrenamiento. Disculpen las molestias." },
  { estado: "Cambio de sede", icon: MapPinned, label: "Cambio de sede", mensaje: "Hoy entrenamos en otra sede: " },
  { estado: "Aviso", icon: Megaphone, label: "Aviso", mensaje: "" },
] as const;

// Control de una sede: un toque para publicar o quitar el aviso de la web.
export default function CourtControl({ sede, row }: { sede: string; row: RowData | null }) {
  const current = row?.Estado || "Normal";
  const [estado, setEstado] = useState(current);
  const [mensaje, setMensaje] = useState(row?.Mensaje || "");
  const [pending, start] = useTransition();
  const live = current !== "Normal";

  const publish = (e: string, m: string) =>
    start(async () => {
      const expected = row ? Object.fromEntries(Object.entries(row).filter(([k]) => k !== "_row")) : null;
      const res = await quickCourt(row ? Number(row._row) : null, expected, sede, e, m);
      if (res.ok) toast.success(res.message);
      else toast.error(res.message);
    });

  return (
    <Card className={clsx("p-5 sm:p-6", live && "border-[#F29A2E]/60")}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-heading font-black uppercase text-3xl leading-none">{sede}</h2>
          <p className={clsx("mt-2 text-sm font-semibold", live ? "text-[#F29A2E]" : "text-[#7AF0A8]")}>
            {live ? `En la web ahora: ${current}${row?.Mensaje ? ` · ${row.Mensaje}` : ""}` : "Normal: no se muestra aviso."}
          </p>
          {row?.Actualizado ? <p className="text-xs text-[#8FA3BF] mt-1">Actualizado {row.Actualizado}</p> : null}
        </div>
        {live ? (
          <button type="button" disabled={pending} onClick={() => publish("Normal", "")} className={btn.secondary}>
            {pending ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />} Quitar aviso
          </button>
        ) : null}
      </div>

      <div className="mt-5 grid grid-cols-2 sm:grid-cols-5 gap-2" role="radiogroup" aria-label={`Estado de ${sede}`}>
        {PRESETS.map((p) => (
          <button
            key={p.estado}
            type="button"
            role="radio"
            aria-checked={estado === p.estado}
            onClick={() => {
              setEstado(p.estado);
              if (p.mensaje && (!mensaje || PRESETS.some((x) => x.mensaje === mensaje))) setMensaje(p.mensaje);
              if (p.estado === "Normal") setMensaje("");
            }}
            className={clsx(
              "h-16 rounded-xl border flex flex-col items-center justify-center gap-1 text-sm font-semibold transition-colors",
              estado === p.estado ? "border-[#F29A2E] bg-[#F29A2E]/15 text-white" : "border-white/15 text-[#C9D5E6] hover:border-white/40"
            )}
          >
            <p.icon size={20} /> {p.label}
          </button>
        ))}
      </div>

      {estado !== "Normal" && (
        <label className="block mt-4">
          <span className="block text-sm font-semibold mb-1.5">Mensaje para las familias</span>
          <input value={mensaje} onChange={(e) => setMensaje(e.target.value.slice(0, 200))} className="w-full h-11 rounded-lg bg-white/[0.05] border border-white/15 px-3.5 focus:outline-none focus:border-[#F29A2E]" />
        </label>
      )}

      <div className="mt-4 flex justify-end">
        <button type="button" disabled={pending || (estado === current && mensaje === (row?.Mensaje || ""))} onClick={() => publish(estado, estado === "Normal" ? "" : mensaje)} className={btn.primary}>
          {pending ? <Loader2 size={16} className="animate-spin" /> : null} {estado === "Normal" ? "Guardar como normal" : "Publicar aviso"}
        </button>
      </div>
    </Card>
  );
}
