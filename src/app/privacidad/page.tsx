import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de tratamiento de datos personales",
  description:
    "Cómo el Club Voley Zúñiga recoge, usa y protege los datos personales de deportistas, padres y acudientes.",
  alternates: { canonical: "/privacidad" },
};

const sections: { title: string; body: React.ReactNode }[] = [
  {
    title: "1. Responsable del tratamiento",
    body: (
      <p>
        Club Voley Zúñiga, Medellín (Antioquia, Colombia). Puedes contactarnos por WhatsApp al +57 312 845 9210, al correo clubvoleyzuniga@gmail.com o desde el{" "}
        <Link href="/club/contact" className="text-[#F29A2E] underline underline-offset-2">
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
    <div className="pt-28 pb-24 bg-[#071426] min-h-screen text-white">
      <div className="container mx-auto px-6 max-w-3xl">
        <span className="text-[#F29A2E] font-mono text-xs uppercase font-bold tracking-widest block mb-3">
          Documento institucional
        </span>
        <h1 className="text-3xl md:text-5xl font-heading font-bold uppercase text-white mb-3">
          Política de tratamiento de datos personales
        </h1>
        <p className="text-sm text-gray-400 font-sans mb-10">Última actualización: 8 de octubre de 2026.</p>

        <div className="space-y-8 font-sans text-sm md:text-base text-gray-300 leading-relaxed">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="text-lg font-heading font-bold uppercase text-white mb-2">{s.title}</h2>
              {s.body}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
