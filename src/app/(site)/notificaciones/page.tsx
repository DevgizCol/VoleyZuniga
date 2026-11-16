import NotificationSettings from "@/components/NotificationSettings";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Notificaciones del club" };
export default function NotificationsPage() {
  return <section className="bg-primary-dark text-white"><div className="container mx-auto px-4 sm:px-6 py-12 sm:py-20 max-w-3xl">
    <p className="text-accent uppercase text-sm font-bold tracking-widest">Conectados con Zúñiga</p>
    <h1 className="font-heading font-black uppercase text-4xl sm:text-6xl my-5">Que no se te pase el próximo partido.</h1>
    <p className="text-steel mb-8">Recibe los avisos del club en tu computador o celular, incluso cuando la página esté cerrada, si tu dispositivo lo permite.</p>
    <NotificationSettings />
  </div></section>;
}
