import Image from "next/image";
import clsx from "clsx";

// Escudo del equipo: el logo del club o las iniciales del rival.
export default function TeamBadge({ name, isClub, size = "md" }: { name: string; isClub: boolean; size?: "sm" | "md" | "lg" }) {
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
  return (
    <span
      aria-hidden="true"
      className={clsx(dims, "shrink-0 rounded-full bg-[#0F2347] ring-1 ring-white/20 flex items-center justify-center font-heading font-black text-[#C9D5E6]")}
    >
      {initials}
    </span>
  );
}
