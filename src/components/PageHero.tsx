import clsx from "clsx";
import BrandPhoto from "./BrandPhoto";
import HeroArt, { type HeroArtKind } from "./HeroArt";
import Volleyball from "./Volleyball";

// Encabezado de las páginas interiores. Cada página elige su ilustración (`art`), y puede llevar
// una foto de fondo con el color del club (`photo`) o el fondo naranja de la marca (`tone="accent"`).
export default function PageHero({
  kicker,
  title,
  intro,
  children,
  art = "court",
  photo,
  tone = "night",
}: {
  kicker: string;
  title: string;
  intro?: string;
  children?: React.ReactNode;
  art?: HeroArtKind;
  photo?: string;
  tone?: "night" | "accent";
}) {
  const accent = tone === "accent";
  return (
    <section
      className={clsx(
        "relative isolate overflow-hidden pt-40 sm:pt-44 pb-14 sm:pb-20",
        accent ? "bg-[#F29A2E] text-[#071426]" : "floodlights grain text-white"
      )}
    >
      {photo ? (
        <>
          <BrandPhoto src={photo} alt="" eager className="absolute inset-0 -z-20" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#071426] via-[#071426]/85 to-[#071426]/30" aria-hidden="true" />
          <div className="absolute inset-x-0 bottom-0 h-24 -z-10 bg-gradient-to-t from-[#071426] to-transparent" aria-hidden="true" />
        </>
      ) : accent ? (
        <div className="absolute inset-x-0 bottom-0 h-1/2 -z-10 opacity-20" aria-hidden="true">
          <svg viewBox="0 0 1200 400" preserveAspectRatio="none" className="w-full h-full">
            <g fill="none" stroke="#071426" strokeWidth="2">
              <path d="M0 330 C 300 260, 700 250, 1200 120" />
              <path d="M0 370 C 320 300, 720 290, 1200 170" />
              <path d="M0 400 C 340 340, 740 330, 1200 220" />
            </g>
          </svg>
        </div>
      ) : (
        <HeroArt kind={art} />
      )}
      {accent ? (
        <Volleyball className="hidden sm:block absolute -z-10 right-[6%] top-1/2 -translate-y-1/3 w-56 lg:w-72 ball-float drop-shadow-[0_30px_40px_rgba(7,20,38,0.45)]" id="hero-accent-ball" />
      ) : null}
      <div className="container mx-auto px-4 sm:px-6 hero-rise">
        <p className={clsx("inline-flex items-center gap-2 font-semibold", accent ? "text-[#071426]" : "text-[#F29A2E]")}>
          <span className={clsx("h-px w-8", accent ? "bg-[#071426]" : "bg-[#F29A2E]")} /> {kicker}
        </p>
        <h1 className="mt-4 font-heading font-black uppercase leading-[0.88] tracking-tight text-[clamp(3rem,12vw,7rem)] max-w-4xl">
          {title}
        </h1>
        {intro ? (
          <p className={clsx("mt-5 text-lg sm:text-xl max-w-2xl leading-relaxed", accent ? "text-[#071426]/80" : "text-[#C9D5E6]")}>{intro}</p>
        ) : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </section>
  );
}
