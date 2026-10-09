"use client";

import { useDeferredValue, useMemo, useState } from "react";
import clsx from "clsx";
import { MessageCircle, Search } from "lucide-react";
import { REGISTRATION_STATES } from "@/lib/admin/options";
import StatusSelect from "../_components/StatusSelect";
import NoteButton from "../_components/NoteButton";
import { Card, Empty, btn } from "../_components/ui";
import { shortDate, waLink } from "../_components/format";
import type { RowData } from "../_components/types";

export default function RegistrationsTable({ rows }: { rows: RowData[] }) {
  const [status, setStatus] = useState<string>("Nuevo");
  const [category, setCategory] = useState("");
  const [query, setQuery] = useState("");
  const q = useDeferredValue(query.trim().toLowerCase());

  const counts = useMemo(() => {
    const c: Record<string, number> = { Todas: rows.length };
    for (const s of REGISTRATION_STATES) c[s] = rows.filter((r) => (r.Estado || "Nuevo") === s).length;
    return c;
  }, [rows]);
  const categories = useMemo(() => Array.from(new Set(rows.map((r) => r["Categoría"]).filter(Boolean))), [rows]);

  const filtered = rows.filter(
    (r) =>
      (status === "Todas" || (r.Estado || "Nuevo") === status) &&
      (!category || r["Categoría"] === category) &&
      (!q || [r.Nombre, r.WhatsApp, r["Código"], r["Categoría"], r.Notas].some((v) => (v || "").toLowerCase().includes(q)))
  );

  return (
    <>
      <div className="flex gap-2 overflow-x-auto pb-1 mb-4 [scrollbar-width:none]" role="tablist" aria-label="Filtrar por estado">
        {["Nuevo", "Contactado", "Matriculado", "Descartado", "Todas"].map((s) => (
          <button
            key={s}
            type="button"
            role="tab"
            aria-selected={status === s}
            onClick={() => setStatus(s)}
            className={clsx(
              "shrink-0 h-10 px-4 inline-flex items-center gap-2 rounded-full text-sm font-semibold border",
              status === s ? "bg-[#F29A2E] border-[#F29A2E] text-[#071426]" : "border-white/15 text-[#C9D5E6] hover:border-white/40"
            )}
          >
            {s}
            <span className={clsx("min-w-6 h-6 px-1.5 inline-flex items-center justify-center rounded-full text-xs", status === s ? "bg-[#071426]/15" : "bg-white/10")}>{counts[s] ?? 0}</span>
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-[1fr_220px] gap-3 mb-5">
        <label className="relative">
          <span className="sr-only">Buscar</span>
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8FA3BF]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre, WhatsApp o código"
            className="w-full h-11 rounded-lg bg-white/[0.05] border border-white/15 pl-10 pr-3 focus:outline-none focus:border-[#F29A2E]"
          />
        </label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Categoría" className="h-11 rounded-lg bg-[#0F2347] border border-white/15 px-3 [color-scheme:dark]">
          <option value="">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <Empty title={rows.length ? "Nada con ese filtro" : "Aún no hay inscripciones"}>{rows.length ? "Prueba con otro estado o búsqueda." : "Aparecerán aquí apenas alguien se inscriba en la web."}</Empty>
      ) : (
        <ul className="space-y-2.5">
          {filtered.map((r) => {
            const wa = waLink(r.WhatsApp, `Hola, te escribimos del Club Voley Zúñiga sobre la inscripción de ${r.Nombre}${r["Código"] ? ` (código ${r["Código"]})` : ""}. ¿Cuándo podemos agendar la clase de prueba?`);
            return (
              <li key={r._row}>
                <Card className="p-4 sm:p-5 grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-heading font-extrabold text-2xl leading-tight">{r.Nombre}</p>
                      {r["Código"] ? <span className="text-xs font-bold tracking-wider text-[#8FA3BF]">{r["Código"]}</span> : null}
                    </div>
                    <p className="text-sm text-[#C9D5E6] mt-0.5">
                      {r.Edad} años · {r["Categoría"]} · {r.Nivel}
                    </p>
                    <p className="text-xs text-[#8FA3BF] mt-0.5">
                      {shortDate(r.Fecha)} · {r.Sede} · {r.Horario}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {wa ? (
                      <a href={wa} target="_blank" rel="noopener noreferrer" className={btn.whatsapp}>
                        <MessageCircle size={16} /> {r.WhatsApp}
                      </a>
                    ) : (
                      <span className="text-sm text-[#8FA3BF]">{r.WhatsApp}</span>
                    )}
                    <NoteButton sheet="Inscripciones" row={r} />
                    <StatusSelect sheet="Inscripciones" row={r} />
                  </div>
                  {r.Notas ? <p className="md:col-span-2 text-sm text-[#FFD9A8] bg-[#F29A2E]/10 border border-[#F29A2E]/20 rounded-lg px-3 py-2 whitespace-pre-line">{r.Notas}</p> : null}
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
