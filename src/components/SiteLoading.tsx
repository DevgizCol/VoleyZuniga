// Esqueleto de las páginas públicas que se generan en cada visita (/partidos y /posiciones, por sus filtros).
export default function SiteLoading() {
  const block = "rounded-xl bg-white/[0.06] motion-safe:animate-pulse";
  return (
    <section role="status" aria-live="polite" aria-busy="true" className="floodlights grain text-white min-h-[100svh] pt-40 sm:pt-44 pb-16">
      <span className="sr-only">Cargando…</span>
      <div className="container mx-auto px-4 sm:px-6">
        <div className={`${block} h-4 w-32`} />
        <div className={`${block} mt-4 h-14 w-80 max-w-full`} />
        <div className={`${block} mt-4 h-5 w-[32rem] max-w-full`} />
        <div className="mt-12 space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`${block} h-28`} />
          ))}
        </div>
      </div>
    </section>
  );
}
