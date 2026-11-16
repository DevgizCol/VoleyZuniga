"use client";
import { useActionState } from "react";
import { publishNotice } from "./actions";
import { btn } from "../_components/ui";

export default function NoticeForm({ id }: { id: string }) {
  const [state, action, pending] = useActionState(publishNotice, { ok: false, message: "", id });
  const input = "w-full rounded-lg border border-white/30 bg-primary px-3 py-3 text-white";
  return <form action={action} className="space-y-4 rounded-2xl border border-white/15 p-5 sm:p-7">
    <h2 className="text-xl font-bold">Enviar un comunicado</h2>
    <p className="text-sm text-[#C9D5E6]">Llegará a todos los dispositivos suscritos. La prueba de arriba solo se envía a tu dispositivo.</p>
    <label className="block space-y-2"><span>Título</span><input name="title" required minLength={3} maxLength={100} className={input} placeholder="Nos vemos en la cancha" /></label>
    <label className="block space-y-2"><span>Mensaje</span><textarea name="body" required minLength={3} maxLength={240} rows={3} className={input} placeholder="Escribe el aviso para las familias del club." /></label>
    <label className="block space-y-2"><span>Al tocar el aviso, abrir</span><select name="url" defaultValue="/noticias" className={input}><option value="/noticias">Noticias</option><option value="/partidos">Agenda de partidos</option><option value="/">Inicio</option></select></label>
    <label className="flex gap-3 items-start text-sm"><input type="checkbox" name="confirm" required className="mt-1 h-5 w-5 accent-accent shrink-0" /><span>Confirmo enviar este comunicado a todos los dispositivos suscritos.</span></label>
    <p role="status" aria-live="polite" className="text-sm text-[#C9D5E6]">{state.message}</p>
    <button disabled={pending} className={btn.primary}>{pending ? "Enviando…" : "Enviar comunicado"}</button>
  </form>;
}
