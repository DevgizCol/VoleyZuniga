import { cloneElement, isValidElement } from "react";
import clsx from "clsx";

// Piezas de formulario compartidas (inscripción y contacto).

export const inputCls =
  "w-full h-13 min-h-[52px] rounded-lg bg-white/[0.05] border border-[#6B7F9C] px-4 text-white text-base placeholder:text-steel focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent focus:border-accent focus:bg-white/[0.08] transition-colors aria-[invalid=true]:border-[#FF7A6B]";

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string | null;
  children: React.ReactNode;
}) {
  // Conecta el error o la ayuda con el campo para que el lector de pantalla los lea al enfocarlo.
  const describedBy = error ? `${htmlFor}-error` : hint ? `${htmlFor}-hint` : undefined;
  return (
    <div>
      <label htmlFor={htmlFor} className="block font-semibold mb-2">
        {label}
      </label>
      {isValidElement<{ "aria-describedby"?: string }>(children) ? cloneElement(children, { "aria-describedby": describedBy }) : children}
      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="mt-2 text-sm text-[#FF9C90]">
          {error}
        </p>
      ) : hint ? (
        <p id={`${htmlFor}-hint`} className="mt-2 text-sm text-steel">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function ChoiceCard({
  name,
  value,
  checked,
  onChange,
  title,
  detail,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: (v: string) => void;
  title: string;
  detail?: string;
}) {
  return (
    <label
      className={clsx(
        "relative flex cursor-pointer rounded-lg border p-4 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent",
        checked ? "border-accent bg-accent/10" : "border-white/15 bg-white/[0.03] hover:border-white/35"
      )}
    >
      <input type="radio" name={name} value={value} checked={checked} onChange={() => onChange(value)} className="sr-only" />
      <span className="flex-1 min-w-0">
        <span className="block font-semibold">{title}</span>
        {detail ? <span className="block text-sm text-[#B7C4D8] mt-0.5">{detail}</span> : null}
      </span>
      <span
        aria-hidden="true"
        className={clsx(
          "ml-3 mt-0.5 h-5 w-5 shrink-0 rounded-full border-2 flex items-center justify-center",
          checked ? "border-accent" : "border-steel"
        )}
      >
        {checked ? <span className="h-2.5 w-2.5 rounded-full bg-accent" /> : null}
      </span>
    </label>
  );
}

/** Tras un envío con errores, lleva el foco al primer campo inválido (después de que React marque aria-invalid). */
export function focusFirstInvalid(form: HTMLElement | null) {
  requestAnimationFrame(() => form?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
}

// Campo trampa para bots: invisible para las personas.
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
      <label>
        No llenes este campo
        <input type="text" name="vz_hp" tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
      </label>
    </div>
  );
}
