"use client";

import { useOptimistic, useTransition } from "react";
import clsx from "clsx";
import { toast } from "sonner";
import { setStatus } from "../actions";
import { STATUS_OPTIONS, type StatusSheet } from "@/lib/admin/schemas";
import type { RowData } from "./types";

const tone = (e: string) =>
  ({
    Nuevo: "bg-[#F29A2E] text-[#071426] border-[#F29A2E]",
    Contactado: "bg-[#3B82F6]/20 text-[#A9C8FF] border-[#3B82F6]/40",
    Respondido: "bg-[#3B82F6]/20 text-[#A9C8FF] border-[#3B82F6]/40",
    Matriculado: "bg-[#25D366]/20 text-[#7AF0A8] border-[#25D366]/40",
  })[e] ?? "bg-white/5 text-[#C9D5E6] border-white/15";

// Cambia el estado al instante (optimista) y lo guarda en la hoja.
export default function StatusSelect({ sheet, row }: { sheet: StatusSheet; row: RowData }) {
  const [optimistic, setOptimistic] = useOptimistic(row.Estado || "Nuevo");
  const [pending, start] = useTransition();
  const options = STATUS_OPTIONS[sheet];

  return (
    <select
      aria-label="Estado"
      value={optimistic}
      disabled={pending}
      onChange={(e) => {
        const value = e.target.value;
        start(async () => {
          setOptimistic(value);
          const expected = Object.fromEntries(Object.entries(row).filter(([k]) => k !== "_row"));
          const res = await setStatus(sheet, Number(row._row), expected, value);
          if (res.ok) toast.success(res.message);
          else toast.error(res.message);
        });
      }}
      className={clsx("h-10 rounded-lg border px-3 text-sm font-bold cursor-pointer disabled:opacity-70 [color-scheme:dark]", tone(optimistic))}
    >
      {options.map((o) => (
        <option key={o} value={o} className="bg-[#0F2347] text-white">
          {o}
        </option>
      ))}
    </select>
  );
}
