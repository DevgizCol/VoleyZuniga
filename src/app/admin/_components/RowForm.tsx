"use client";

import { useActionState, useEffect, useRef } from "react";
import clsx from "clsx";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { saveRow, type ActionState } from "../actions";
import { btn } from "./ui";
import type { FieldDef, RowData } from "./types";

const input =
  "w-full min-h-11 rounded-lg bg-white/[0.05] border border-white/15 px-3.5 text-white placeholder:text-[#8FA3BF]/70 focus:outline-none focus:border-[#F29A2E] aria-[invalid=true]:border-[#E5484D] transition-colors";

// Formulario genérico para crear o editar una fila de la hoja.
export default function RowForm({
  sheet,
  fields,
  initial,
  expectedRow,
  row,
  submitLabel,
  onSaved,
  children,
}: {
  sheet: string;
  fields: FieldDef[];
  initial?: RowData;
  expectedRow?: RowData; // la fila tal como está en la hoja (para detectar cambios ajenos)
  row?: string; // número de fila: si existe, se edita; si no, se crea
  submitLabel?: string;
  onSaved?: () => void;
  children?: React.ReactNode; // vista previa u otros extras debajo del formulario
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveRow, { ok: false });
  const lastAt = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!state.at || state.at === lastAt.current) return;
    lastAt.current = state.at;
    if (state.ok) {
      toast.success(state.message);
      onSaved?.();
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state, onSaved]);

  const err = (name: string) => state.fieldErrors?.[name];
  // Lo que la persona vio al abrir el formulario: la hoja lo compara para evitar sobrescribir cambios ajenos.
  const source = expectedRow ?? initial;
  const expected = row && source ? JSON.stringify(Object.fromEntries(Object.entries(source).filter(([k]) => k !== "_row"))) : "";
  const hasActivo = fields.some((f) => f.type === "checkbox" && f.name === "Activo");

  return (
    <form action={action} className="space-y-6" noValidate>
      <input type="hidden" name="_sheet" value={sheet} />
      {row ? <input type="hidden" name="_row" value={row} /> : null}
      {expected ? <input type="hidden" name="_expected" value={expected} /> : null}
      {hasActivo ? <input type="hidden" name="_hasActivo" value="1" /> : null}

      <div className="grid sm:grid-cols-2 gap-x-4 gap-y-5">
        {fields.map((f) => {
          const id = `f-${sheet}-${f.name}`.replace(/\W+/g, "-");
          const value = initial?.[f.name] ?? "";
          const invalid = Boolean(err(f.name));
          const describedBy = invalid ? `${id}-err` : f.help ? `${id}-help` : undefined;

          if (f.type === "checkbox") {
            const checked = initial ? String(value).toUpperCase() !== "NO" : true;
            return (
              <label key={f.name} className={clsx("flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3.5 cursor-pointer", f.wide !== false && "sm:col-span-2")}>
                <input type="checkbox" name={f.name} defaultChecked={checked} className="mt-0.5 h-5 w-5 accent-[#F29A2E]" />
                <span>
                  <span className="font-semibold block">{f.label}</span>
                  {f.help ? <span className="text-sm text-[#8FA3BF]">{f.help}</span> : null}
                </span>
              </label>
            );
          }

          return (
            <div key={f.name} className={clsx(f.wide && "sm:col-span-2")}>
              <label htmlFor={id} className="block text-sm font-semibold mb-1.5">
                {f.label}
                {f.required ? <span className="text-[#F29A2E]"> *</span> : null}
              </label>
              {f.type === "select" ? (
                <select id={id} name={f.name} defaultValue={value || f.options?.[0]} aria-invalid={invalid} aria-describedby={describedBy} className={clsx(input, "bg-[#0F2347]")}>
                  {f.options?.map((o) => (
                    <option key={o} value={o}>
                      {o === "" ? "No" : o}
                    </option>
                  ))}
                </select>
              ) : f.type === "textarea" ? (
                <textarea id={id} name={f.name} defaultValue={value} rows={f.rows ?? 5} placeholder={f.placeholder} aria-invalid={invalid} aria-describedby={describedBy} className={clsx(input, "py-2.5 resize-y")} />
              ) : (
                <>
                  <input
                    id={id}
                    name={f.name}
                    type={f.type === "url" ? "url" : f.type}
                    defaultValue={value}
                    placeholder={f.placeholder}
                    inputMode={f.type === "number" ? "numeric" : undefined}
                    min={f.type === "number" ? 0 : undefined}
                    list={f.suggestions ? `${id}-list` : undefined}
                    aria-invalid={invalid}
                    aria-describedby={describedBy}
                    className={clsx(input, (f.type === "date" || f.type === "time") && "[color-scheme:dark]")}
                  />
                  {f.suggestions ? (
                    <datalist id={`${id}-list`}>
                      {f.suggestions.map((s) => (
                        <option key={s} value={s} />
                      ))}
                    </datalist>
                  ) : null}
                </>
              )}
              {invalid ? (
                <p id={`${id}-err`} className="mt-1.5 text-sm text-[#FFA7AA]">
                  {err(f.name)}
                </p>
              ) : f.help ? (
                <p id={`${id}-help`} className="mt-1.5 text-sm text-[#8FA3BF]">
                  {f.help}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>

      {children}

      {!state.ok && state.message && !state.fieldErrors ? (
        <p role="alert" className="rounded-lg border border-[#E5484D]/40 bg-[#E5484D]/10 p-3.5 text-[#FFC2C4]">
          {state.message}
        </p>
      ) : null}

      <div className="sticky bottom-0 -mx-5 sm:-mx-6 px-5 sm:px-6 py-4 bg-[#0B1E38]/95 backdrop-blur border-t border-white/10 flex justify-end">
        <button type="submit" disabled={pending} className={btn.primary}>
          {pending ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} {pending ? "Guardando…" : submitLabel ?? (row ? "Guardar cambios" : "Crear")}
        </button>
      </div>
    </form>
  );
}
