import type { Metadata } from "next";
import { Mail, MessageCircle } from "lucide-react";
import { adminRead } from "@/lib/sheets";
import { PageHeader, NotConnected, Card, Empty, Badge, btn } from "../_components/ui";
import StatusSelect from "../_components/StatusSelect";
import NoteButton from "../_components/NoteButton";
import { shortDate, waLink } from "../_components/format";

export const metadata: Metadata = { title: "Mensajes" };
export const dynamic = "force-dynamic";

const emailOf = (s: string) => s.match(/[^\s@·]+@[^\s@·]+\.[^\s@·]{2,}/)?.[0] ?? "";
const phoneOf = (s: string) => (s.split("·")[0] || "").trim();

export default async function MessagesAdmin({ searchParams }: { searchParams: Promise<{ ver?: string }> }) {
  const { ver } = await searchParams;
  const data = await adminRead("Contacto");
  const all = (data?.rows ?? []).slice().reverse();
  const showAll = ver === "todos";
  const rows = showAll ? all : all.filter((m) => (m.Estado || "Nuevo") !== "Archivado");

  return (
    <>
      <PageHeader title="Mensajes" description="Lo que llega desde el formulario de contacto: torneos, patrocinios, PQRS y dudas.">
        <a href={showAll ? "/admin/mensajes" : "/admin/mensajes?ver=todos"} className={btn.secondary}>
          {showAll ? "Ocultar archivados" : "Ver archivados"}
        </a>
      </PageHeader>
      {!data ? (
        <NotConnected />
      ) : rows.length === 0 ? (
        <Empty title="Bandeja vacía">Los mensajes del formulario de contacto aparecerán aquí.</Empty>
      ) : (
        <ul className="space-y-3">
          {rows.map((m) => {
            const email = emailOf(m.Contacto || "");
            const wa = waLink(phoneOf(m.Contacto || ""), `Hola ${m.Nombre}, te escribimos del Club Voley Zúñiga por tu mensaje sobre ${m.Asunto}.`);
            return (
              <li key={m._row}>
                <Card className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-heading font-extrabold text-2xl leading-tight">{m.Nombre}</p>
                        <Badge>{m.Asunto}</Badge>
                      </div>
                      <p className="text-xs text-[#8FA3BF] mt-0.5">{shortDate(m.Fecha)} · {m.Contacto}</p>
                    </div>
                    <StatusSelect sheet="Contacto" row={m} />
                  </div>
                  <p className="mt-3 text-[#DCE4EF] whitespace-pre-line">{m.Mensaje}</p>
                  {m.Notas ? <p className="mt-3 text-sm text-[#FFD9A8] bg-[#F29A2E]/10 border border-[#F29A2E]/20 rounded-lg px-3 py-2 whitespace-pre-line">{m.Notas}</p> : null}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {wa ? (
                      <a href={wa} target="_blank" rel="noopener noreferrer" className={btn.whatsapp}>
                        <MessageCircle size={16} /> WhatsApp
                      </a>
                    ) : null}
                    {email ? (
                      <a href={`mailto:${email}?subject=${encodeURIComponent(`Re: ${m.Asunto} · Club Voley Zúñiga`)}`} className={btn.secondary}>
                        <Mail size={16} /> Responder por correo
                      </a>
                    ) : null}
                    <NoteButton sheet="Contacto" row={m} />
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
