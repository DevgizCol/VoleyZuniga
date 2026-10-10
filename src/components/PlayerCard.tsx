import BrandPhoto from "./BrandPhoto";
import type { Player } from "@/lib/club";

// Lámina de jugador, como las de un álbum: foto con el color del club, número grande y un brillo
// que cruza la tarjeta al pasar el mouse. Sin foto, se ve la camiseta con su número.
export default function PlayerCard({ player }: { player: Player }) {
  return (
    <figure className="player-card group relative aspect-[3/4] rounded-2xl p-[3px] bg-[linear-gradient(140deg,#FFB14A,#F29A2E_35%,#0F2347_60%,#F29A2E)]">
      <div className="relative h-full w-full rounded-[14px] overflow-hidden bg-[#0B1E38]">
        {player.photo ? (
          <BrandPhoto src={player.photo} alt={`Foto de ${player.name}`} hover className="absolute inset-0" />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,#1B3A6B,#0B1E38_70%)]" aria-hidden="true">
            <svg viewBox="0 0 400 400" className="absolute inset-x-[12%] top-[8%] w-[76%] opacity-80">
              <path d="M120 40 L165 22 Q200 44 235 22 L280 40 L345 85 L315 140 L285 122 L285 360 Q200 372 115 360 L115 122 L85 140 L55 85 Z" fill="#0F2347" stroke="#F29A2E" strokeWidth="4" />
              <text x="200" y="250" textAnchor="middle" fontFamily="var(--font-display), sans-serif" fontWeight="900" fontSize="140" fill="#F3F6FB">
                {player.number}
              </text>
            </svg>
          </div>
        )}
        {player.number && player.photo ? (
          <span aria-hidden="true" className="absolute top-2 right-3 z-10 font-heading font-black text-6xl leading-none text-[#F29A2E] drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
            {player.number}
          </span>
        ) : null}
        <figcaption className="absolute inset-x-0 bottom-0 z-10 p-4 pt-14 bg-gradient-to-t from-[#071426] via-[#071426]/85 to-transparent">
          <span className="block font-heading font-black uppercase text-2xl leading-none">{player.name}</span>
          <span className="mt-1 block text-sm font-semibold text-[#F29A2E]">
            {[player.position, player.number ? `#${player.number}` : ""].filter(Boolean).join(" · ")}
          </span>
        </figcaption>
        <span className="player-shine absolute inset-0 z-20 pointer-events-none" aria-hidden="true" />
      </div>
    </figure>
  );
}
