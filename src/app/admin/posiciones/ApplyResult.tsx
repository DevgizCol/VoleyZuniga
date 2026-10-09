"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { Calculator, Loader2 } from "lucide-react";
import { applyResult } from "../actions";
import { btn } from "../_components/ui";

const input = "w-full h-11 rounded-lg bg-white/[0.05] border border-white/15 px-3.5 focus:outline-none focus:border-[#F29A2E]";

export default function ApplyResult({ categories, teams }: { categories: string[]; teams: string[] }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [pending, start] = useTransition();
  const [form, setForm] = useState({ category: categories[0] ?? "", a: "Club Voley Zúñiga", b: "", sa: "3", sb: "0" });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    start(async () => {
      const res = await applyResult(form.category, form.a, form.b, Number(form.sa), Number(form.sb));
      if (res.ok) {
        toast.success(res.message);
        ref.current?.close();
      } else toast.error(res.message);
    });
  };

  return (
    <>
      <button type="button" onClick={() => ref.current?.showModal()} className={btn.primary}>
        <Calculator size={16} /> Sumar un resultado
      </button>
      <dialog ref={ref} className="m-auto w-[min(94vw,520px)] rounded-2xl bg-[#0B1E38] text-white border border-white/10 p-0 backdrop:bg-black/60">
        <form onSubmit={submit} className="p-6 space-y-4">
          <div>
            <h2 className="font-heading font-black uppercase text-2xl">Sumar un resultado</h2>
            <p className="text-sm text-[#8FA3BF] mt-1">Actualiza partidos jugados, ganados, perdidos y puntos de los dos equipos (sistema FIVB).</p>
          </div>
          <label className="block">
            <span className="block text-sm font-semibold mb-1.5">Categoría</span>
            <input value={form.category} onChange={set("category")} list="ar-cats" className={input} required />
            <datalist id="ar-cats">{categories.map((c) => <option key={c} value={c} />)}</datalist>
          </label>
          <div className="grid grid-cols-[1fr_72px] gap-3 items-end">
            <label>
              <span className="block text-sm font-semibold mb-1.5">Equipo A</span>
              <input value={form.a} onChange={set("a")} list="ar-teams" className={input} required />
            </label>
            <label>
              <span className="block text-sm font-semibold mb-1.5">Sets</span>
              <select value={form.sa} onChange={set("sa")} className={`${input} bg-[#0F2347] text-center font-bold`}>
                {[0, 1, 2, 3].map((n) => <option key={n}>{n}</option>)}
              </select>
            </label>
            <label>
              <span className="block text-sm font-semibold mb-1.5">Equipo B</span>
              <input value={form.b} onChange={set("b")} list="ar-teams" className={input} required />
            </label>
            <label>
              <span className="block text-sm font-semibold mb-1.5">Sets</span>
              <select value={form.sb} onChange={set("sb")} className={`${input} bg-[#0F2347] text-center font-bold`}>
                {[0, 1, 2, 3].map((n) => <option key={n}>{n}</option>)}
              </select>
            </label>
          </div>
          <datalist id="ar-teams">{teams.map((t) => <option key={t} value={t} />)}</datalist>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => ref.current?.close()} className={btn.secondary}>
              Cancelar
            </button>
            <button type="submit" disabled={pending} className={btn.primary}>
              {pending ? <Loader2 size={18} className="animate-spin" /> : null} Actualizar tabla
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
