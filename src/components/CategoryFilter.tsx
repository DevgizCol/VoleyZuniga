import Link from "next/link";
import clsx from "clsx";

// Filtro por categoría con enlaces (funciona sin JavaScript).
export default function CategoryFilter({
  basePath,
  categories,
  active,
  allLabel = "Todas",
  showAll = true,
}: {
  basePath: string;
  categories: string[];
  active: string | null;
  allLabel?: string;
  showAll?: boolean;
}) {
  const items = [...(showAll ? [{ label: allLabel, value: null as string | null }] : []), ...categories.map((c) => ({ label: c, value: c }))];
  return (
    <nav aria-label="Filtrar por categoría" className="flex gap-2 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 pb-1 [scrollbar-width:none]">
      {items.map((it) => {
        const isActive = it.value === active;
        return (
          <Link
            key={it.label}
            href={it.value ? `${basePath}?cat=${encodeURIComponent(it.value)}` : basePath}
            scroll={false}
            aria-current={isActive ? "page" : undefined}
            className={clsx(
              "shrink-0 h-10 px-4 inline-flex items-center rounded-full text-sm font-semibold border transition-colors",
              isActive
                ? "bg-[#F29A2E] border-[#F29A2E] text-[#071426]"
                : "border-white/15 text-[#C9D5E6] hover:border-white/40 hover:text-white"
            )}
          >
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}
