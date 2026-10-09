import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import PageHero from "@/components/PageHero";
import RegistrationForm from "./RegistrationForm";
import { categorySchedules, getSessions, getSettings, scheduleOptions } from "@/lib/content";
import { waLink } from "@/config/contact";

export const metadata: Metadata = {
  title: "Inscripción",
  description: "Inscríbete al Club Voley Zúñiga y agenda una clase de prueba sin costo.",
};

export const revalidate = 300;

export default async function RegistrationsPage() {
  const [sessions, settings] = await Promise.all([getSessions(), getSettings()]);
  const horarios = scheduleOptions(sessions).map(({ value, label }) => ({ value, label }));

  return (
    <>
      <PageHero
        kicker="Clase de prueba sin costo"
        title="Inscripción"
        intro="Tres pasos y menos de un minuto. Después te escribimos por WhatsApp para acordar el día de la primera clase."
      />
      <section id="inscripcion" className="scroll-mt-24 bg-[#071426] text-white pb-24 sm:pb-32">
        <div className="container mx-auto px-4 sm:px-6">
          {settings.registrationsOpen ? (
            <RegistrationForm horarios={horarios} perCategory={categorySchedules(sessions)} />
          ) : (
            <div className="max-w-2xl rounded-2xl border border-white/10 bg-gradient-to-br from-[#0F2347] to-[#071426] p-8 sm:p-12">
              <h2 className="font-heading font-black uppercase text-4xl sm:text-5xl leading-none">Cupos cerrados por ahora</h2>
              <p className="mt-4 text-lg text-[#C9D5E6]">
                En este momento no estamos recibiendo inscripciones nuevas. Escríbenos y te avisamos apenas abramos cupos.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={waLink(settings.contact, "Hola, quiero que me avisen cuando abran cupos en el Club Voley Zúñiga")} target="_blank" rel="noopener noreferrer" className="h-12 px-5 inline-flex items-center gap-2 rounded-md bg-[#25D366] text-[#071426] font-bold">
                  <MessageCircle size={18} /> Avísenme por WhatsApp
                </a>
                <Link href="/club/contact" className="h-12 px-5 inline-flex items-center rounded-md border border-white/25 hover:border-white font-semibold">
                  Ver horarios y sedes
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
