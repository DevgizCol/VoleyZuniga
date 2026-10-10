"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, MessageCircle, UserPlus } from "lucide-react";
import { useContact } from "./ContactProvider";

// Acciones principales siempre a mano en el celular.
export default function MobileBar() {
  const pathname = usePathname();
  const { wa } = useContact();
  if (pathname.startsWith("/admin") || pathname.startsWith("/inscripciones")) return null;

  const base =
    "flex-1 min-h-[52px] flex flex-col items-center justify-center gap-0.5 text-[11px] font-semibold touch-manipulation active:opacity-80";

  return (
    <nav
      aria-label="Acciones rápidas"
      className="md:hidden fixed inset-x-0 bottom-0 z-40 bg-[#071426]/95 backdrop-blur border-t border-white/10 flex"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)", viewTransitionName: "mobile-bar" }}
    >
      <Link href="/inscripciones" className={`${base} bg-[#F29A2E] text-[#071426]`}>
        <UserPlus size={18} />
        <span>Clase gratis</span>
      </Link>
      <Link href="/#semana" className={`${base} text-white`}>
        <CalendarDays size={18} className="text-[#F29A2E]" />
        <span>Horarios</span>
      </Link>
      <a href={wa()} target="_blank" rel="noopener noreferrer" className={`${base} text-white`}>
        <MessageCircle size={18} className="text-[#25D366]" />
        <span>WhatsApp</span>
      </a>
    </nav>
  );
}
