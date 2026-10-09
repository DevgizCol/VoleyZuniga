import clsx from "clsx";

// Piezas de formulario compartidas (inscripción y contacto).

export const inputCls =
  "w-full h-13 min-h-[52px] rounded-lg bg-white/[0.05] border border-white/15 px-4 text-white text-base placeholder:text-[#8FA3BF]/70 focus:outline-none focus:border-[#F29A2E] focus:bg-white/[0.08] transition-colors aria-[invalid=true]:border-[#FF7A6B]";

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
  return (
    <div>
      <label htmlFor={htmlFor} className="block font-semibold mb-2">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} className="mt-2 text-sm text-[#FF9C90]">
          {error}
        </p>
      ) : hint ? (
        <p id={`${htmlFor}-hint`} className="mt-2 text-sm text-[#8FA3BF]">
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
        "relative flex cursor-pointer rounded-lg border p-4 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-[#F29A2E]",
        checked ? "border-[#F29A2E] bg-[#F29A2E]/10" : "border-white/15 bg-white/[0.03] hover:border-white/35"
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
          checked ? "border-[#F29A2E]" : "border-white/30"
        )}
      >
        {checked ? <span className="h-2.5 w-2.5 rounded-full bg-[#F29A2E]" /> : null}
      </span>
    </label>
  );
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
