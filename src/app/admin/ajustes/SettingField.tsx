"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Check, Loader2 } from "lucide-react";
import { createSetting, saveSetting } from "../actions";
import { btn } from "../_components/ui";

type Props = {
  settingKey: string;
  label: string;
  help: string;
  type?: "text" | "textarea" | "yesno";
  row?: { _row: string; values: Record<string, string> };
  value: string;
};

// Un ajuste de la web que se guarda por separado (con su propio botón).
export default function SettingField({ settingKey, label, help, type = "text", row, value }: Props) {
  const [draft, setDraft] = useState(value);
  const [saved, setSaved] = useState(value);
  const [pending, start] = useTransition();
  const dirty = draft !== saved;
  const id = `s-${settingKey}`;

  const save = () =>
    start(async () => {
      const res = row ? await saveSetting(Number(row._row), row.values, settingKey, draft) : await createSetting(settingKey, draft);
      if (res.ok) {
        setSaved(draft);
        toast.success(res.message);
      } else toast.error(res.message);
    });

  const input = "w-full min-h-11 rounded-lg bg-white/[0.05] border border-white/15 px-3.5 focus:outline-none focus:border-[#F29A2E]";

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0B1E38] p-5">
      <label htmlFor={id} className="font-heading font-extrabold text-xl block">
        {label}
      </label>
      <p className="text-sm text-[#8FA3BF] mt-0.5 mb-3">{help}</p>
      <div className="flex flex-col sm:flex-row gap-2 sm:items-start">
        {type === "yesno" ? (
          <div role="radiogroup" aria-label={label} className="flex gap-2 flex-1">
            {["SI", "NO"].map((o) => (
              <button
                key={o}
                type="button"
                role="radio"
                aria-checked={draft === o}
                onClick={() => setDraft(o)}
                className={`h-11 px-5 rounded-lg border font-bold ${draft === o ? (o === "SI" ? "bg-[#25D366] border-[#25D366] text-[#071426]" : "bg-[#E5484D] border-[#E5484D] text-white") : "border-white/15 text-[#C9D5E6]"}`}
              >
                {o === "SI" ? "Sí, abiertas" : "No, cerradas"}
              </button>
            ))}
          </div>
        ) : type === "textarea" ? (
          <textarea id={id} value={draft} onChange={(e) => setDraft(e.target.value)} rows={3} className={`${input} py-2.5 flex-1`} />
        ) : (
          <input id={id} value={draft} onChange={(e) => setDraft(e.target.value)} className={`${input} flex-1`} />
        )}
        <button type="button" onClick={save} disabled={!dirty || pending} className={btn.primary}>
          {pending ? <Loader2 size={18} className="animate-spin" /> : dirty ? null : <Check size={18} />} {dirty ? "Guardar" : "Guardado"}
        </button>
      </div>
    </div>
  );
}
