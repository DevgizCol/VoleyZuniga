import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = pageMeta({
  title: "Política de tratamiento de datos personales",
  path: "/privacidad",
  description: "Cómo el Club Voley Zúñiga recoge, usa y protege los datos personales de deportistas, padres y acudientes.",
});

const sections: { title: string; body: React.ReactNode }[] = [
  {
    title: "1. Responsable del tratamiento",
    body: (
      <p>
        Club Voley Zúñiga, Medellín (Antioquia, Colombia). Puedes contactarnos por WhatsApp al +57 312 845 9210, al correo clubvoleyzuniga@gmail.com o desde el{" "}
        <Link href="/contacto" className="text-[#F29A2E] underline underline-offset-2">
          formulario de contacto
        </Link>
        .
      </p>
    ),
  },
  {
    title: "2. Datos que recogemos",
    body: (
      <p>
        En la inscripción: nombre y edad del deportista, categoría, nivel, sede y horario de interés, y un número de WhatsApp de contacto. En el formulario de contacto: nombre, correo, teléfono, motivo y mensaje. No pedimos documentos de identidad, datos financieros ni fotografías a través de este sitio.
      </p>
    ),
  },
  {
    title: "3. Para qué los usamos",
    body: (
      <p>
        Gestionar inscripciones y clases de prueba, responder consultas y PQRS, y comunicarnos contigo sobre horarios, convocatorias y cambios en los entrenamientos. No vendemos ni cedemos tus datos a terceros con fines comerciales.
      </p>
    ),
  },
  {
    title: "4. Menores de edad",
    body: (
      <p>
        Los datos de niñas, niños y adolescentes solo se tratan con la autorización de su padre, madre o acudiente, y se usan únicamente para la actividad deportiva del club. Quien diligencia el formulario declara tener esa calidad o ser mayor de edad.
      </p>
    ),
  },
  {
    title: "5. Tus derechos",
    body: (
      <p>
        Puedes conocer, actualizar y rectificar tus datos, pedir prueba de la autorización, solicitar que los eliminemos, revocar tu autorización y presentar quejas ante la Superintendencia de Industria y Comercio, conforme a la Ley 1581 de 2012 y sus decretos reglamentarios. Para ejercerlos escríbenos por los canales del punto 1.
      </p>
    ),
  },
  {
    title: "6. Dónde se guardan",
    body: (
      <p>
        Las solicitudes se almacenan en una hoja de cálculo de Google (Google Workspace) a la que solo accede el personal autorizado del club, y el sitio se aloja en Vercel. Ambos proveedores tratan los datos por encargo nuestro.
      </p>
    ),
  },
  {
    title: "7. Cuánto tiempo los conservamos",
    body: (
      <p>
        Mientras sea necesario para gestionar la inscripción o la consulta, y hasta que pidas su eliminación. Las solicitudes que no terminen en inscripción se depuran periódicamente.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero kicker="Ley 1581 de 2012" title="Tus datos" intro="Cómo recogemos, usamos y protegemos los datos de deportistas, padres y acudientes. Última actualización: 8 de octubre de 2026." />
      <section className="bg-[#071426] text-white pb-24">
        <div className="container mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-10">
          <nav aria-label="Secciones" className="hidden lg:block lg:col-span-3">
            <ul className="sticky top-32 space-y-2 text-sm text-[#8FA3BF]">
              {sections.map((s, i) => (
                <li key={s.title}><a href={`#s${i}`} className="hover:text-white">{s.title}</a></li>
              ))}
            </ul>
          </nav>
          <div className="lg:col-span-8 space-y-10 text-lg text-[#C9D5E6] leading-relaxed max-w-3xl">
            {sections.map((s, i) => (
              <section key={s.title} id={`s${i}`} className="scroll-mt-32">
                <h2 className="font-heading font-black uppercase text-3xl text-white mb-3">{s.title}</h2>
                {s.body}
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
