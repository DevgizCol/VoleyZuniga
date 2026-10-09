"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { EyeOff } from "lucide-react";
import EditorButton from "../_components/EditorButton";
import { DeleteButton } from "../_components/RowActions";
import { Badge, Card, Empty } from "../_components/ui";
import { FIXTURE_FIELDS } from "../_components/fields";
import { bogotaToday, dayMonth, hhmm, isoDate, shortDate } from "../_components/format";
import type { RowData } from "../_components/types";
import QuickResult from "./QuickResult";

type View = "proximos" | "pendientes" | "jugados" | "ocultos";

export default function MatchesBoard({ rows, initialView }: { rows: RowData[]; initialView: View }) {
  const [view, setView] = useState<View>(initialView);
  const [category, setCategory] = useState("");
  const today = bogotaToday();

  const groups = useMemo(() => {
    const key = (r: RowData) => isoDate(r.Fecha) + hhmm(r.Hora);
    const hidden = (r: RowData) => (r.Activo || "").toUpperCase() === "NO";
    const visible = rows.filter((r) => !hidden(r));
    return {
      proximos: visible.filter((r) => isoDate(r.Fecha) >= today && !r.Resultado).sort((a, b) => key(a).localeCompare(key(b))),
      pendientes: visible.filter((r) => isoDate(r.Fecha) < today && !r.Resultado && !/cancel|aplaz/i.test(r.Estado || "")).sort((a, b) => key(b).localeCompare(key(a))),
      jugados: visible.filter((r) => r.Resultado).sort((a, b) => key(b).localeCompare(key(a))),
      ocultos: rows.filter(hidden).sort((a, b) => key(b).localeCompare(key(a))),
    };
  }, [rows, today]);

  const categories = Array.from(new Set(rows.map((r) => r["Categoría"]).filter(Boolean)));
  const list = groups[view].filter((r) => !category || r["Categoría"] === category);
  const tabs: { id: View; label: string }[] = [
    { id: "proximos", label: "Próximos" },
    { id: "pendientes", label: "Sin resultado" },
    { id: "jugados", label: "Jugados" },
    { id: "ocultos", label: "Ocultos" },
  ];

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-5">
        <div className="flex gap-2 overflow-x-auto [scrollbar-width:none]" role="tablist">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={view === t.id}
              onClick={() => setView(t.id)}
              className={clsx(
                "shrink-0 h-10 px-4 inline-flex items-center gap-2 rounded-full text-sm font-semibold border",
                view === t.id ? "bg-[#F29A2E] border-[#F29A2E] text-[#071426]" : "border-white/15 text-[#C9D5E6] hover:border-white/40",
                t.id === "pendientes" && groups.pendientes.length > 0 && view !== t.id && "border-[#F29A2E]/60"
              )}
            >
              {t.label}
              <span className={clsx("min-w-6 h-6 px-1.5 inline-flex items-center justify-center rounded-full text-xs", view === t.id ? "bg-[#071426]/15" : "bg-white/10")}>{groups[t.id].length}</span>
            </button>
          ))}
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Categoría" className="h-10 rounded-lg bg-[#0F2347] border border-white/15 px-3 [color-scheme:dark]">
          <option value="">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      {list.length === 0 ? (
        <Empty title={view === "pendientes" ? "Todo al día" : "Nada por aquí"}>
          {view === "proximos" ? "Crea el próximo partido con el botón “Nuevo partido”." : view === "pendientes" ? "No hay partidos jugados sin resultado." : null}
        </Empty>
      ) : (
        <ul className="space-y-2.5">
          {list.map((m) => {
            const d = dayMonth(m.Fecha);
            const label = `${m.Local} vs ${m.Visitante} (${shortDate(m.Fecha)})`;
            return (
              <li key={m._row}>
                <Card className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-16 shrink-0 text-center rounded-lg py-2 bg-[#F29A2E]/10 border border-[#F29A2E]/30">
                      <p className="font-heading font-black text-3xl leading-none">{d.day}</p>
                      <p className="font-heading font-bold uppercase text-sm text-[#F29A2E]">{d.month}</p>
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-heading font-extrabold text-xl sm:text-2xl leading-tight">
                          {m.Local} <span className="text-white/35">vs</span> {m.Visitante}
                        </p>
                        {m.Resultado ? <Badge tone="success">{m.Resultado.match(/^\d\s*-\s*\d/)?.[0]}</Badge> : null}
                        {/cancel|aplaz/i.test(m.Estado || "") ? <Badge tone="danger">{m.Estado}</Badge> : null}
                        {(m.Activo || "").toUpperCase() === "NO" ? (
                          <Badge tone="muted">
                            <EyeOff size={12} className="mr-1" /> Oculto
                          </Badge>
                        ) : null}
                      </div>
                      <p className="text-sm text-[#B7C4D8] mt-1">
                        {m["Categoría"]} · {hhmm(m.Hora) || "hora por confirmar"} · {m.Sede || "sede por confirmar"}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-1">
                    <QuickResult row={m} />
                    <EditorButton sheet="Fixture" fields={FIXTURE_FIELDS} title="Editar partido" mode="edit" row={m} />
                    <EditorButton sheet="Fixture" fields={FIXTURE_FIELDS} title="Duplicar partido" mode="duplicate" row={{ ...m, Resultado: "", Estado: "Programado" }} />
                    <DeleteButton sheet="Fixture" row={m} label={label} compact />
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
