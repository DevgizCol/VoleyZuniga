/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { adminRead } from "@/lib/sheets";
import { PageHeader, NotConnected, Card, Empty, Badge, btn } from "../_components/ui";
import EditorButton from "../_components/EditorButton";
import { DeleteButton } from "../_components/RowActions";
import { NEWS_FIELDS } from "../_components/fields";
import { bogotaToday, isoDate, shortDate } from "../_components/format";

export const metadata: Metadata = { title: "Noticias" };
export const dynamic = "force-dynamic";

const slugify = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 70);

function preview(url: string) {
  const drive = url.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:export=\w+&)?id=)([\w-]{20,})/);
  if (drive) return `https://lh3.googleusercontent.com/d/${drive[1]}=w600`;
  return /^https:\/\//.test(url) ? url : "";
}

export default async function NewsAdmin() {
  const data = await adminRead("Noticias");
  const rows = (data?.rows ?? []).slice().sort((a, b) => isoDate(b.Fecha).localeCompare(isoDate(a.Fecha)));
  return (
    <>
      <PageHeader title="Noticias" description="Crónicas, convocatorias y comunicados. Guarda como borrador desmarcando “Publicada”.">
        <EditorButton sheet="Noticias" fields={NEWS_FIELDS} title="Nueva noticia" mode="create" label="Nueva noticia" defaults={{ Fecha: bogotaToday(), Categoría: "Vida en el club" }} preview="news" />
      </PageHeader>
      {!data ? (
        <NotConnected />
      ) : rows.length === 0 ? (
        <Empty title="Aún no hay noticias">Publica la primera: un resultado, una convocatoria o una novedad del club.</Empty>
      ) : (
        <ul className="grid md:grid-cols-2 gap-4">
          {rows.map((r) => {
            const img = preview(r["Imagen (URL)"] || "");
            const draft = (r.Activo || "").toUpperCase() === "NO";
            const slug = `${isoDate(r.Fecha)}-${slugify(r["Título"] || "")}`;
            return (
              <li key={r._row}>
                <Card className="overflow-hidden h-full flex flex-col">
                  <div className="relative aspect-[16/8] bg-gradient-to-br from-[#0F2347] to-[#071426]">
                    {img ? <img src={img} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" /> : null}
                    <div className="absolute left-3 top-3 flex gap-2">
                      <Badge tone={draft ? "muted" : "success"}>{draft ? "Borrador" : "Publicada"}</Badge>
                      <Badge>{r["Categoría"]}</Badge>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <p className="text-sm text-[#F29A2E] font-semibold">{shortDate(r.Fecha)}</p>
                    <h2 className="font-heading font-extrabold text-2xl leading-tight mt-1">{r["Título"]}</h2>
                    <p className="text-[#B7C4D8] mt-1 line-clamp-2 flex-1">{r.Resumen}</p>
                    <div className="mt-4 flex flex-wrap gap-1">
                      <EditorButton sheet="Noticias" fields={NEWS_FIELDS} title="Editar noticia" mode="edit" row={r} preview="news" />
                      {!draft ? (
                        <a href={`/noticias/${slug}`} target="_blank" className={btn.ghost}>
                          <ExternalLink size={14} /> Ver
                        </a>
                      ) : null}
                      <DeleteButton sheet="Noticias" row={r} label={`“${r["Título"]}”`} compact />
                    </div>
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
