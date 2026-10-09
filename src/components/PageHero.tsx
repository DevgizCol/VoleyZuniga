import CourtLines from "./CourtLines";

// Encabezado común para las páginas interiores.
export default function PageHero({
  kicker,
  title,
  intro,
  children,
}: {
  kicker: string;
  title: string;
  intro?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden floodlights grain text-white pt-40 sm:pt-44 pb-14 sm:pb-20">
      <CourtLines className="absolute -z-10 right-[-12%] top-16 w-[85%] sm:w-[60%] lg:w-[45%] text-[#F29A2E]/30" />
      <div className="container mx-auto px-4 sm:px-6 hero-rise">
        <p className="inline-flex items-center gap-2 text-[#F29A2E] font-semibold">
          <span className="h-px w-8 bg-[#F29A2E]" /> {kicker}
        </p>
        <h1 className="mt-4 font-heading font-black uppercase leading-[0.88] tracking-tight text-[clamp(3rem,12vw,7rem)] max-w-4xl">
          {title}
        </h1>
        {intro ? <p className="mt-5 text-lg sm:text-xl text-[#C9D5E6] max-w-2xl leading-relaxed">{intro}</p> : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </section>
  );
}
