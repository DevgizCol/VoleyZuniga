"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Home, Users, CalendarDays, Trophy, Newspaper, CloudRain, Clock, Mail, History, HelpCircle, ShoppingBag, Settings } from "lucide-react";
import { ADMIN_NAV } from "./nav";

const ICONS = { home: Home, users: Users, calendar: CalendarDays, trophy: Trophy, news: Newspaper, cloud: CloudRain, clock: Clock, mail: Mail, history: History, help: HelpCircle, store: ShoppingBag, settings: Settings };

export default function AdminNav({ variant }: { variant: "side" | "top" }) {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  if (variant === "top") {
    return (
      <nav aria-label="Secciones del panel" className="lg:hidden flex gap-1 overflow-x-auto px-3 py-2 [scrollbar-width:none]">
        {ADMIN_NAV.map((item) => {
          const Icon = ICONS[item.icon];
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={clsx(
                "shrink-0 h-10 px-3 inline-flex items-center gap-2 rounded-full text-sm font-semibold transition-colors",
                isActive(item.href) ? "bg-[#F29A2E] text-[#071426]" : "text-[#C9D5E6] hover:bg-white/5"
              )}
            >
              <Icon size={16} /> {item.label}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav aria-label="Secciones del panel" className="flex flex-col gap-1">
      {ADMIN_NAV.map((item) => {
        const Icon = ICONS[item.icon];
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive(item.href) ? "page" : undefined}
            className={clsx(
              "h-11 px-3 flex items-center gap-3 rounded-lg font-semibold transition-colors",
              isActive(item.href) ? "bg-[#F29A2E] text-[#071426]" : "text-[#C9D5E6] hover:bg-white/5 hover:text-white"
            )}
          >
            <Icon size={18} /> {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
