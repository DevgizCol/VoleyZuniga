import type { Metadata } from "next";
import { PageHeader, Card } from "../_components/ui";

export const metadata: Metadata = { title: "Ayuda" };

const TIPS: [string, string][] = [
  ["Programar un partido", "Partidos → Nuevo partido. Elige fecha, hora y rivales. Aparece en la web, en el calendario de las familias suscritas y en Google."],
  ["Cargar un resultado", "Partidos → pestaña “Sin resultado” → Resultado. Escribe los sets y, si quieres, suma los puntos a la tabla de posiciones con un toque."],
  ["Avisar lluvia o cancelación", "Canchas → toca la sede → Lluvia o Cancelado. La franja naranja aparece en toda la web al instante. Vuelve a “Normal” para quitarla."],
  ["Cambiar un horario", "Horarios → Editar. Se actualizan la portada, Sedes y contacto y el formulario de inscripción."],
  ["Atender una inscripción", "Inscripciones → Escribir (abre WhatsApp con el mensaje listo) → cambia el estado a Contactado y después a Matriculado. Usa “Anotar” para dejar notas."],
  ["Publicar una noticia", "Noticias → Nueva noticia. Desmarca “Publicada” para guardarla como borrador. Para la foto, sube la imagen a Google Drive, compártela con “Cualquier persona con el enlace” y pega el enlace."],
  ["Cerrar inscripciones", "Ajustes → Inscripciones abiertas → No. El formulario muestra que los cupos están cerrados y ofrece WhatsApp."],
  ["Cambiar el teléfono o Instagram", "Ajustes → edita el campo → Guardar. Todos los botones de la web usan el dato nuevo."],
  ["Deshacer un error", "Historial muestra qué cambió y quién lo hizo. Vuelve a editar el elemento con el valor anterior. Si borraste algo, puedes recuperarlo en la hoja con Archivo → Historial de versiones."],
  ["“Alguien cambió esta fila”", "Otra persona (o la hoja) modificó lo mismo mientras editabas. Recarga la página y vuelve a intentarlo: así nadie pisa el trabajo de otro."],
];

export default function HelpAdmin() {
  return (
    <>
      <PageHeader title="Ayuda" description="Guía rápida para el cuerpo técnico. Todo lo que cambias aquí queda guardado en la hoja de Google del club." />
      <div className="grid md:grid-cols-2 gap-4">
        {TIPS.map(([title, text]) => (
          <Card key={title} className="p-5">
            <h2 className="font-heading font-extrabold text-xl">{title}</h2>
            <p className="mt-1.5 text-[#C9D5E6]">{text}</p>
          </Card>
        ))}
      </div>
      <Card className="p-5 mt-6">
        <h2 className="font-heading font-extrabold text-xl">Instálalo en el celular</h2>
        <p className="mt-1.5 text-[#C9D5E6]">
          iPhone: en Safari, Compartir → “Agregar a inicio”. Android: en Chrome, menú ⋮ → “Agregar a la pantalla principal”. Queda como una app y la sesión dura 12
          horas.
        </p>
      </Card>
    </>
  );
}
