/* eslint-disable @next/next/no-img-element -- el escudo del rival viene de la hoja */
import Image from "next/image";
import clsx from "clsx";

// Escudo del equipo: el logo del club, el escudo del rival si la hoja lo trae, o un escudo con sus iniciales.
export default function TeamBadge({
  name,
  isClub,
  logo = "",
  size = "md",
}: {
  name: string;
  isClub: boolean;
  logo?: string;
  size?: "sm" | "md" | "lg";
}) {
  const dims = { sm: "w-10 h-10 text-sm", md: "w-14 h-14 text-lg", lg: "w-20 h-20 sm:w-28 sm:h-28 text-2xl sm:text-4xl" }[size];
  const initials =
    name
      .replace(/\b(club|voley|vóley|voleibol|de|del|la|el|los|las)\b/gi, " ")
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 3)
      .map((w) => w[0]!.toUpperCase())
      .join("") || name.slice(0, 2).toUpperCase();

  if (isClub) {
    return (
      <span className={clsx(dims, "shrink-0 rounded-full bg-[#F3F6FB] ring-2 ring-[#F29A2E] flex items-center justify-center p-1.5")}>
        <Image src="/logo-trim.png" alt="" width={800} height={473} className="w-full h-auto" />
      </span>
    );
  }
  if (logo) {
    return (
      <span className={clsx(dims, "shrink-0 rounded-full bg-[#F3F6FB] ring-1 ring-white/30 flex items-center justify-center p-2 overflow-hidden")}>
        <img src={logo} alt="" loading="lazy" className="w-full h-full object-contain" />
      </span>
    );
  }
  // Sin escudo: medallón con franja diagonal y las iniciales, del mismo peso visual que el del club.
  return (
    <span
      aria-hidden="true"
      className={clsx(
        dims,
        "relative shrink-0 rounded-full overflow-hidden ring-2 ring-[#8FA3BF]/50 flex items-center justify-center font-heading font-black text-white",
        "bg-[linear-gradient(135deg,#1B3A6B_0%,#0F2347_55%,#0B1E38_100%)] shadow-[inset_0_2px_0_rgba(255,255,255,0.12)]"
      )}
    >
      <span className="absolute inset-0 bg-[linear-gradient(120deg,transparent_42%,rgba(201,213,230,0.18)_42%,rgba(201,213,230,0.18)_58%,transparent_58%)]" />
      <span className="relative tracking-wide">{initials}</span>
    </span>
  );
}
