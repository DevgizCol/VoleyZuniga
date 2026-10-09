// Datos estructurados para buscadores. Se escapa "<" para que ningún texto de la hoja cierre la etiqueta.
export default function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
