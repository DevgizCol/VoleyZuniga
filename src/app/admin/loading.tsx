// Esqueleto mientras la sección lee la hoja de Google (puede tardar varios segundos si Apps Script arranca en frío).
export default function Loading() {
  const block = "rounded-2xl bg-white/[0.06] motion-safe:animate-pulse";
  return (
    <div role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Cargando la sección…</span>
      <div className={`${block} h-12 w-72 max-w-full`} />
      <div className={`${block} mt-3 h-5 w-[28rem] max-w-full`} />
      <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`${block} h-32`} />
        ))}
      </div>
      <div className="mt-6 space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`${block} h-24`} />
        ))}
      </div>
    </div>
  );
}
