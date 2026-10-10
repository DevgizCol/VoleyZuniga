import Volleyball from "./Volleyball";
import CourtLines from "./CourtLines";

// Ilustración de fondo de cada encabezado interior, para que cada página tenga su propia cara.
export type HeroArtKind = "court" | "net" | "scoreboard" | "podium" | "trajectory" | "ball" | "pin";

export default function HeroArt({ kind }: { kind: HeroArtKind }) {
  switch (kind) {
    case "net":
      // Red de voleibol en perspectiva, con la cinta superior naranja.
      return (
        <svg viewBox="0 0 600 300" aria-hidden="true" className="absolute -z-10 right-[-20%] sm:right-[-6%] top-24 w-[120%] sm:w-[70%] lg:w-[52%] opacity-60 drift">
          <defs>
            <pattern id="mesh" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="skewX(-18)">
              <path d="M18 0H0V18" fill="none" stroke="#8FA3BF" strokeOpacity="0.35" strokeWidth="1.2" />
            </pattern>
            <linearGradient id="mesh-fade" x1="0" x2="1">
              <stop offset="0" stopColor="#fff" stopOpacity="0" />
              <stop offset="0.35" stopColor="#fff" stopOpacity="1" />
            </linearGradient>
            <mask id="mesh-mask"><rect width="600" height="300" fill="url(#mesh-fade)" /></mask>
          </defs>
          <g mask="url(#mesh-mask)">
            <path d="M40 70 L580 30 L580 190 L40 200 Z" fill="url(#mesh)" />
            <path d="M40 70 L580 30" stroke="#F29A2E" strokeWidth="10" strokeLinecap="round" />
            <path d="M40 200 L580 190" stroke="#F29A2E" strokeOpacity="0.6" strokeWidth="4" />
            <path d="M40 70 V290 M580 30 V290" stroke="#C9D5E6" strokeOpacity="0.5" strokeWidth="5" />
          </g>
        </svg>
      );
    case "scoreboard":
      // Marcador de coliseo: dos cifras grandes con el set en juego.
      return (
        <div aria-hidden="true" className="absolute -z-10 right-[-6%] sm:right-[4%] top-28 sm:top-24 select-none opacity-25 sm:opacity-40 drift">
          <div className="flex items-center gap-4 sm:gap-6 font-heading font-black leading-none">
            <span className="text-[9rem] sm:text-[13rem] text-outline-accent">25</span>
            <span className="flex flex-col gap-4">
              <span className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-[#F29A2E]" />
              <span className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-[#F29A2E]" />
            </span>
            <span className="text-[9rem] sm:text-[13rem] text-transparent [-webkit-text-stroke:1.5px_#C9D5E6]">23</span>
          </div>
          <div className="mt-2 flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <span key={s} className={`h-1.5 w-10 rounded-full ${s <= 3 ? "bg-[#F29A2E]" : "bg-white/20"}`} />
            ))}
          </div>
        </div>
      );
    case "podium":
      return (
        <svg viewBox="0 0 360 240" aria-hidden="true" className="absolute -z-10 right-[-10%] sm:right-[4%] top-28 w-[80%] sm:w-[46%] lg:w-[34%] opacity-40 sm:opacity-60 drift">
          <g fill="none" strokeWidth="2.5">
            <rect x="20" y="120" width="100" height="110" stroke="#8FA3BF" />
            <rect x="130" y="60" width="100" height="170" stroke="#F29A2E" fill="#F29A2E" fillOpacity="0.08" />
            <rect x="240" y="150" width="100" height="80" stroke="#8FA3BF" />
          </g>
          <g fontFamily="var(--font-display), sans-serif" fontWeight="900" textAnchor="middle">
            <text x="70" y="185" fontSize="44" fill="#8FA3BF">2</text>
            <text x="180" y="150" fontSize="64" fill="#F29A2E">1</text>
            <text x="290" y="205" fontSize="40" fill="#8FA3BF">3</text>
          </g>
        </svg>
      );
    case "trajectory":
      // Trayectoria de un saque con el balón al final: para Metodología.
      return (
        <div aria-hidden="true" className="absolute -z-10 right-[-8%] sm:right-0 top-24 w-[90%] sm:w-[60%] lg:w-[46%] opacity-50 sm:opacity-80">
          <svg viewBox="0 0 400 220" className="w-full">
            <path d="M20 200 C 120 20, 260 10, 330 90" fill="none" stroke="#F29A2E" strokeWidth="3" strokeDasharray="2 12" strokeLinecap="round" />
            <path d="M0 210 H400" stroke="#8FA3BF" strokeOpacity="0.4" strokeWidth="2" />
            <path d="M200 210 V120" stroke="#C9D5E6" strokeOpacity="0.5" strokeWidth="4" />
          </svg>
          <Volleyball className="absolute w-[18%] right-[12%] top-[30%] ball-float" id="hero-traj" />
        </div>
      );
    case "ball":
      return <Volleyball className="absolute -z-10 -right-24 sm:-right-16 top-24 w-[340px] sm:w-[460px] opacity-25 sm:opacity-40 drift" id="hero-ball" />;
    case "pin":
      // Pin de ubicación sobre la cancha: para Contacto.
      return (
        <div aria-hidden="true" className="absolute -z-10 right-[-12%] sm:right-[2%] top-20 w-[85%] sm:w-[56%] lg:w-[42%] opacity-40 sm:opacity-70">
          <CourtLines className="w-full text-[#F29A2E]/40 [transform:perspective(600px)_rotateX(55deg)]" />
          <svg viewBox="0 0 80 110" className="absolute left-1/2 top-[8%] w-[16%] -translate-x-1/2 ball-float">
            <path d="M40 4 C 18 4 4 20 4 40 C 4 66 40 104 40 104 C 40 104 76 66 76 40 C 76 20 62 4 40 4 Z" fill="#F29A2E" />
            <circle cx="40" cy="40" r="14" fill="#071426" />
          </svg>
        </div>
      );
    default:
      return <CourtLines className="absolute -z-10 right-[-12%] top-16 w-[85%] sm:w-[60%] lg:w-[45%] text-[#F29A2E]/30" />;
  }
}
