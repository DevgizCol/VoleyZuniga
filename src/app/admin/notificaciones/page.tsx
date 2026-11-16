import { randomUUID } from "node:crypto";
import { getAdmin } from "@/lib/auth";
import { localPushStore, pushConfig } from "@/lib/push/config";
import { pushStore } from "@/lib/push/store";
import NotificationSettings from "@/components/NotificationSettings";
import { PageHeader } from "../_components/ui";
import NoticeForm from "./NoticeForm";

export const metadata = { title: "Notificaciones" };
export const maxDuration = 60;

export default async function NotificationsAdmin() {
  if (!(await getAdmin())) return null;
  const configured = Boolean(pushConfig());
  const stored = configured ? await pushStore("list") : null;
  return <div className="space-y-7 max-w-4xl">
    <PageHeader title="Notificaciones" description="Avisos de partidos y noticias para computadores y celulares suscritos." />
    <div className="rounded-xl border border-white/15 p-5 space-y-2 text-sm text-[#C9D5E6]">
      <p><strong className="text-white">Envío:</strong> {configured ? "Claves configuradas." : "Faltan claves VAPID. Ejecuta npm run notifications:setup en el equipo y reinicia la web. En hosting, configura las tres variables VAPID del .env.example."}</p>
      <p><strong className="text-white">Dispositivos:</strong> {stored?.ok ? `${stored.subscriptions.length} suscritos (capacidad: 200).` : "No se pudo comprobar el registro."}</p>
      <p>{localPushStore() ? "Modo local: registro privado en .local-data; permite probar sin modificar Google Sheets." : "Producción: registro privado en Sheets. Publica el Code.gs actualizado para habilitarlo; la pestaña se crea automáticamente."}</p>
      {stored && !stored.ok ? <p className="text-[#FFD0AA]">El registro no está disponible ({stored.error}). Revisa la conexión y la versión de Apps Script. La prueba directa puede funcionar aunque falte el registro.</p> : null}
      <p>Los partidos y noticias publicados desde sus formularios envían un aviso si dejas marcada la opción «Notificar». Los borradores no se envían. Los cambios hechos directamente en Sheets no activan envíos.</p>
    </div>
    <NotificationSettings admin />
    <p className="text-sm text-steel">Prueba inmediata: activa los avisos, permite las notificaciones y pulsa «Enviar prueba a este dispositivo». Puedes pasar a otra aplicación para comprobar el aviso.</p>
    {configured && stored?.ok ? <NoticeForm id={randomUUID()} /> : null}
  </div>;
}
