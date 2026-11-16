import Link from "next/link";
import { Bell } from "lucide-react";

export default function NotificationInvite() {
  return <aside className="container mx-auto px-4 sm:px-6 py-7">
    <Link href="/notificaciones" className="flex items-center gap-4 rounded-xl border border-accent/30 bg-[#0D2037] p-5 text-white focus-visible:outline-2 focus-visible:outline-accent">
      <Bell className="text-accent shrink-0" size={24} aria-hidden="true" />
      <span><strong className="block">Que el próximo partido te encuentre listo.</strong><span className="text-sm text-[#C9D5E6]">Activa los avisos de agenda y noticias en tu celular o computador →</span></span>
    </Link>
  </aside>;
}
