import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = pageMeta("/privacidad", "Política de tratamiento de datos personales", "Cómo el Club Voley Zúñiga recoge, usa y protege los datos personales de deportistas, padres y acudientes.");

const sections: { title: string; body: React.ReactNode }[] = [
  {
    title: "1. Responsable del tratamiento",
    body: (
      <p>
        Club Voley Zúñiga, con domicilio en Medellín (Antioquia, Colombia) y sede principal en el Polideportivo 3 Canchas, barrio Buenos Aires. Puedes contactarnos por WhatsApp al +57 312 845 9210, al correo clubvoleyzuniga@gmail.com o desde el{" "}
        <Link href="/contacto" className="text-accent underline underline-offset-2">
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
        En la inscripción: nombre y edad del deportista, categoría, nivel, sede y horario de interés, un número de WhatsApp de contacto y, si es menor de edad, el nombre y parentesco de quien autoriza. Guardamos la fecha y la versión de esta política que se aceptó. En el formulario de contacto: nombre, correo, teléfono, motivo y mensaje. No pedimos documentos de identidad, datos financieros ni fotografías a través de este sitio.
      </p>
    ),
  },
  {
    title: "3. Para qué los usamos",
    body: (
      <p>
        Gestionar inscripciones y clases de prueba, responder consultas y PQRS, comunicarnos contigo sobre horarios, convocatorias y cambios en los entrenamientos, y enviarte novedades del club (puedes pedir que no te las enviemos en cualquier momento). Solo si lo autorizas aparte, publicar fotos y videos del deportista en entrenamientos y partidos en la web y las redes del club; esa autorización es opcional y puedes retirarla cuando quieras. No vendemos ni cedemos tus datos a terceros con fines comerciales.
      </p>
    ),
  },
  {
    title: "4. Menores de edad",
    body: (
      <p>
        Los datos de niñas, niños y adolescentes solo se tratan con la autorización de su padre, madre o representante legal, respetando su interés superior y sus derechos, y se usan únicamente para la actividad deportiva del club. Responder preguntas sobre sus datos es opcional. Quien diligencia el formulario declara tener esa calidad o ser mayor de edad.
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
        Las solicitudes se almacenan en una hoja de cálculo de Google (Google Workspace) a la que solo accede el personal autorizado del club, y cada solicitud se avisa por correo al club. El sitio se aloja en Vercel, que además mide visitas de forma agregada (Web Analytics y Speed Insights, sin datos del formulario). Ambos proveedores tratan los datos por encargo nuestro y pueden hacerlo en servidores fuera de Colombia.
      </p>
    ),
  },
  {
    title: "7. Cuánto tiempo los conservamos",
    body: (
      <p>
        Las inscripciones que no terminan en matrícula se borran automáticamente a los 6 meses. Los datos de deportistas matriculados se conservan mientras pertenezcan al club y hasta 1 año después de su retiro. Los mensajes de contacto, mientras se atiende la consulta. En cualquier momento puedes pedir que los eliminemos antes.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero kicker="Ley 1581 de 2012" title="Tus datos" intro="Cómo recogemos, usamos y protegemos los datos de deportistas, padres y acudientes. Versión 2026-11-06 (última actualización: 6 de noviembre de 2026)." />
      <section className="bg-primary-dark text-white pb-24">
        <div className="container mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-10">
          <nav aria-label="Secciones" className="hidden lg:block lg:col-span-3">
            <ul className="sticky top-32 space-y-2 text-sm text-steel">
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
