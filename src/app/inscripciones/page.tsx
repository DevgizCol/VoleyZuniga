import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import RegistrationForm from "./RegistrationForm";

export const metadata: Metadata = {
  title: "Inscripción",
  alternates: { canonical: "/inscripciones" },
  description: "Inscríbete al Club Voley Zúñiga y agenda una clase de prueba sin costo.",
};

export default function RegistrationsPage() {
  return (
    <>
      <PageHero
        kicker="Clase de prueba sin costo"
        title="Inscripción"
        intro="Tres pasos y menos de un minuto. Después te escribimos por WhatsApp para acordar el día de la primera clase."
      />
      <section id="inscripcion" className="scroll-mt-24 bg-[#071426] text-white pb-24 sm:pb-32">
        <div className="container mx-auto px-4 sm:px-6">
          <RegistrationForm />
        </div>
      </section>
    </>
  );
}
