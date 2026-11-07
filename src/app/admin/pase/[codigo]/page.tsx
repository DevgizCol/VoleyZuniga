import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, CircleAlert, ArrowLeft, Star } from "lucide-react";
import { adminRead } from "@/lib/sheets";
import { getSettings } from "@/lib/content";
import { FREE_CLASS_COL, findByCode } from "@/lib/admin/free-class";
import { PageHeader, Card, Empty, NotConnected, btn } from "../../_components/ui";
import { shortDate, waLink } from "../../_components/format";
import StatusSelect from "../../_components/StatusSelect";
import FreeClassActions from "./FreeClassActions";
import { WhatsAppIcon } from "@/components/BrandIcons";

export const metadata: Metadata = { title: "Ficha del pase" };
export const dynamic = "force-dynamic";

// Lo que abre el QR del pase: ficha del deportista y canje de la clase gratis (una sola vez).
export default async function PassCard({ params }: { params: Promise<{ codigo: string }> }) {
  const { codigo } = await params;
  const code = decodeURIComponent(codigo).trim().toUpperCase();
  const [table, { reviewUrl }] = await Promise.all([adminRead("Inscripciones"), getSettings()]);
  if (!table) return <NotConnected />;
  // Un encabezado mal escrito ("Codigo ", sin tilde) haría que ningún pase aparezca: decirlo claro.
  if (!table.headers.includes("Código")) {
    return (
      <>
        <PageHeader title="Falta la columna Código" description="En la pestaña Inscripciones, el encabezado debe decir exactamente “Código” (con tilde y sin espacios)." />
        <Empty title="Corrige el encabezado y vuelve a escanear" />
      </>
    );
  }
  const r = findByCode(table.rows, code);
  if (!r) {
    return (
      <>
        <PageHeader title="Pase no encontrado" description={`No hay ninguna inscripción con el código ${code}.`} />
        <Empty title="Revisa el código">
          <Link href="/admin/pase" className="underline underline-offset-2">Escribir otro código</Link>
        </Empty>
      </>
    );
  }

  const used = r[FREE_CLASS_COL];
  const wa = waLink(r.WhatsApp || "", `Hola, te escribimos del Club Voley Zúñiga sobre la clase de ${r.Nombre}.`);
  // Tras la clase gratis (no antes): pedir la reseña cuando ya hubo una experiencia real.
  const reviewWa = reviewUrl ? waLink(r.WhatsApp || "", `¡Gracias por venir a la clase de prueba de ${r.Nombre}! Si te gustó, ¿nos ayudas con una reseña en Google? Nos toma 1 minuto y ayuda a otras familias a encontrarnos: ${reviewUrl}`) : "";
  const missingColumn = !table.headers.includes(FREE_CLASS_COL);
  const facts: [string, string][] = [
    ["Edad", r.Edad ? `${r.Edad} años` : "—"],
    ["Categoría", r["Categoría"] || "—"],
    ["Nivel", r.Nivel || "—"],
    ["Sede", r.Sede || "—"],
    ["Horario", r.Horario || "—"],
    ["Inscripción", r.Fecha ? shortDate(r.Fecha) : "—"],
    ...(r.Origen ? ([["Llegó por", r.Origen]] as [string, string][]) : []),
  ];

  return (
    <>
      <PageHeader title={r.Nombre || "Deportista"} description={`Código del pase ${r["Código"]}`}>
        <Link href="/admin/pase" className={btn.secondary}>
          <ArrowLeft size={16} /> Otro código
        </Link>
      </PageHeader>

      <div className="grid gap-4 lg:grid-cols-[1fr_380px] items-start">
        <div className="space-y-4">
          {used ? (
            <Card className="p-5 border-[#FF7A6B]/50 bg-[#FF7A6B]/10">
              <p className="flex items-center gap-2 font-heading font-black uppercase text-2xl text-[#FFC2BA]">
                <CircleAlert size={26} aria-hidden /> Ya usó su clase gratis
              </p>
              <p className="mt-1 text-[#FFC2BA]">{used}</p>
            </Card>
          ) : missingColumn ? (
            <Card className="p-5 border-accent/50 bg-accent/10">
              <p className="font-semibold">Falta la columna “{FREE_CLASS_COL}” en la pestaña Inscripciones.</p>
              <p className="mt-1 text-sm text-[#C9D5E6]">Créala en la hoja (en cualquier posición) para poder registrar la clase gratis.</p>
            </Card>
          ) : (
            <Card className="p-5 border-[#25D366]/50 bg-[#25D366]/10">
              <p className="flex items-center gap-2 font-heading font-black uppercase text-2xl text-[#7BE3A4]">
                <CheckCircle2 size={26} aria-hidden /> Clase gratis disponible
              </p>
              <p className="mt-1 mb-4 text-[#C9D5E6]">Regístrala cuando el deportista llegue a la cancha. Solo se puede usar una vez.</p>
              <FreeClassActions code={r["Código"]} />
            </Card>
          )}

          <Card className="p-5">
            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
              {facts.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs text-steel">{k}</dt>
                  <dd className="font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
            {r.Notas ? <p className="mt-4 rounded-lg bg-white/[0.05] p-3 text-sm">{r.Notas}</p> : null}
          </Card>
        </div>

        <Card className="p-5 space-y-4">
          <div>
            <p className="text-xs text-steel mb-2">Estado de la inscripción</p>
            <StatusSelect sheet="Inscripciones" row={r} />
          </div>
          {wa ? (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className={`${btn.secondary} w-full`}
            >
              <WhatsAppIcon size={18} /> Escribir a la familia <span className="sr-only">(abre WhatsApp)</span>
            </a>
          ) : null}
          {used && reviewWa ? (
            <a href={reviewWa} target="_blank" rel="noopener noreferrer" className={`${btn.secondary} w-full`}>
              <Star size={18} aria-hidden /> Pedir reseña en Google <span className="sr-only">(abre WhatsApp)</span>
            </a>
          ) : null}
        </Card>
      </div>
    </>
  );
}
