/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { adminRead } from "@/lib/sheets";
import { imageUrl } from "@/lib/images";
import { cop } from "@/data/products";
import { PageHeader, NotConnected, Card, Empty, Badge, btn } from "../_components/ui";
import EditorButton from "../_components/EditorButton";
import { DeleteButton } from "../_components/RowActions";
import { PRODUCT_FIELDS } from "../_components/fields";

export const metadata: Metadata = { title: "Tienda" };
export const dynamic = "force-dynamic";

export default async function StoreAdmin() {
  const data = await adminRead("Productos");
  const rows = data?.rows ?? [];
  return (
    <>
      <PageHeader title="Tienda" description="Productos, precios y fotos de la tienda del club. Los pedidos llegan por WhatsApp.">
        <a href="/store" target="_blank" className={btn.secondary}>
          <ExternalLink size={16} /> Ver tienda
        </a>
        <EditorButton sheet="Productos" fields={PRODUCT_FIELDS} title="Nuevo producto" mode="create" label="Nuevo producto" defaults={{ Categoría: "Indumentaria", Personalizable: "" }} />
      </PageHeader>
      {!data ? (
        <NotConnected />
      ) : rows.length === 0 ? (
        <Empty title="Sin productos">Mientras no haya filas, la tienda muestra el catálogo de respaldo.</Empty>
      ) : (
        <ul className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {rows.map((p) => {
            const img = imageUrl(p.Imagen || "") || "/placeholder-club.svg";
            const hidden = (p.Activo || "").toUpperCase() === "NO";
            const price = Number(String(p.Precio || "").replace(/[^\d]/g, ""));
            return (
              <li key={p._row}>
                <Card className={`overflow-hidden h-full flex flex-col ${hidden ? "opacity-60" : ""}`}>
                  <div className="relative aspect-[4/3] bg-[#071426]">
                    <img src={img} alt="" className="absolute inset-0 w-full h-full object-contain" loading="lazy" />
                    <div className="absolute left-3 top-3 flex gap-2">
                      <Badge>{p["Categoría"]}</Badge>
                      {p.Personalizable ? <Badge tone="accent">Personalizable</Badge> : null}
                      {hidden ? <Badge tone="muted">Oculto</Badge> : null}
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h2 className="font-heading font-extrabold text-2xl leading-tight">{p.Nombre}</h2>
                    <p className="font-heading font-black text-3xl mt-1 tabular-nums">{price ? cop(price) : "Sin precio"}</p>
                    <p className="text-sm text-[#B7C4D8] mt-1 line-clamp-2 flex-1">{p["Descripción"]}</p>
                    <div className="mt-4 -ml-2 flex flex-wrap gap-1">
                      <EditorButton sheet="Productos" fields={PRODUCT_FIELDS} title="Editar producto" mode="edit" row={p} />
                      <EditorButton sheet="Productos" fields={PRODUCT_FIELDS} title="Duplicar producto" mode="duplicate" row={p} />
                      <DeleteButton sheet="Productos" row={p} label={p.Nombre} compact />
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
